const enc = new TextEncoder();
const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {status, headers:{'Content-Type':'application/json','Cache-Control':'no-store', ...headers}});
export async function mac(secret, value) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), {name:'HMAC',hash:'SHA-256'}, false, ['sign']);
  return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(value))), b=>b.toString(16).padStart(2,'0')).join('');
}
export function validate(p) {
  const keys = ['name','email','company','message','companyWebsite','challenge','token'];
  if (!p || Array.isArray(p) || typeof p !== 'object' || Object.keys(p).some(k=>!keys.includes(k)) || keys.some(k=>typeof p[k] !== 'string')) return 'invalid_payload';
  if (p.name.trim().length < 2 || p.name.length > 200 || p.company.length > 200 || p.message.trim().length < 10 || p.message.length > 10000 || p.token.length > 2048 || p.challenge.length > 200 || p.companyWebsite.length > 200) return 'invalid_payload';
  if (p.email.length > 254 || !/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(p.email)) return 'invalid_email';
  if (/[\x00-\x1f\x7f]/.test(p.name+p.company+p.email) || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(p.message)) return 'invalid_payload';
  if ((p.message.match(/https?:\/\/|www\./gi)||[]).length > 3 || /(.)\1{49}/u.test(p.message)) return 'content_spam';
  return null;
}
export class ContactGuard {
  constructor(ctx) { this.ctx=ctx; }
  async fetch(request) {
    const p = await request.json();
    const now=Date.now();
    const allowed = await this.ctx.storage.transaction(async tx=>{
      const rows=(await tx.get('attempts')||[]).filter(t=>now-t<86400000);
      if (rows.length>=p.daily || rows.filter(t=>now-t<600000).length>=p.short) return false;
      rows.push(now); await tx.put('attempts',rows); return true;
    });
    await this.ctx.storage.setAlarm(now+86400000);
    return json({allowed});
  }
  async alarm() { await this.ctx.storage.deleteAll(); }
}
async function limit(env, key, short, daily) {
  const stub=env.GUARD.get(env.GUARD.idFromName(key));
  const r=await stub.fetch('https://guard/',{method:'POST',body:JSON.stringify({short,daily})});
  if (!r.ok) throw new Error('guard');
  return (await r.json()).allowed;
}
export async function handle(request, env, net=fetch) {
  const origin=request.headers.get('Origin');
  const origins=(env.ALLOWED_ORIGINS||'').split(',').map(x=>x.trim());
  const cors={'Access-Control-Allow-Origin':origin||'', 'Vary':'Origin','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'};
  const url=new URL(request.url);
  if (!origins.includes(origin)) return json({ok:false},403);
  if (!['/challenge','/contact'].includes(url.pathname)) return json({ok:false},404,cors);
  if (request.method==='OPTIONS') return new Response(null,{status:204,headers:cors});
  if (request.method!=='POST') return json({ok:false},405,{...cors,Allow:'POST, OPTIONS'});
  const fail=(reason,status=400)=>{console.log(JSON.stringify({reason})); return json({ok:false,code:reason},status,cors);};
  try {
    if (!env.TURNSTILE_SECRET || !env.RELAY_SECRET || !env.APPS_SCRIPT_URL || !env.TURNSTILE_HOSTNAMES || !env.GUARD) return fail('unavailable',503);
    // Cloudflare supplies this header. Do not use client X-Forwarded-For.
    const ip=request.headers.get('CF-Connecting-IP');
    if (!ip) return fail('unavailable',503);
    const ipKey=await mac(env.RELAY_SECRET,ip);
    if (!await limit(env, 'request:'+ipKey, 30,100)) return fail('rate_limit',429);
    if (url.pathname==='/challenge') {
      const raw=Date.now()+'.'+crypto.randomUUID();
      return json({challenge:raw+'.'+await mac(env.RELAY_SECRET,raw)},200,cors);
    }
    if (!(request.headers.get('Content-Type')||'').startsWith('application/json')) return fail('invalid_payload');
    // Stream limit: do not allocate an unbounded request body.
    const reader=request.body?.getReader(); if (!reader) return fail('invalid_payload');
    let bytes=0, chunks=[];
    while (true) { const {done,value}=await reader.read(); if(done)break; bytes+=value.byteLength; if(bytes>48000){await reader.cancel();return fail('invalid_payload',413);} chunks.push(value); }
    const joined=new Uint8Array(bytes); let offset=0; for(const part of chunks){joined.set(part,offset);offset+=part.length;}
    let p; try {p=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(joined));} catch {return fail('invalid_payload');}
    const invalid=validate(p); if(invalid) return fail(invalid);
    if (p.companyWebsite.trim()) { console.log(JSON.stringify({reason:'honeypot'})); return json({ok:true},200,cors); }
    const [stamp,nonce,signature,...extra]=p.challenge.split('.');
    const issued=Number(stamp), age=Date.now()-issued;
    if(extra.length || !nonce || !Number.isFinite(issued) || age<0 || age>1800000 || signature!==await mac(env.RELAY_SECRET,stamp+'.'+nonce)) return fail('invalid_payload');
    if(age<Number(env.MIN_FORM_MS||2000)) return fail('too_fast');
    if(!p.token) return fail('turnstile_failed');
    const verification=await net('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:env.TURNSTILE_SECRET,response:p.token,remoteip:ip}),signal:AbortSignal.timeout(10000)});
    if(!verification.ok) return fail('turnstile_failed');
    const check=await verification.json();
    if(!check.success || check.action!=='contact' || !env.TURNSTILE_HOSTNAMES.split(',').map(x=>x.trim()).includes(check.hostname)) return fail('turnstile_failed');
    if(!await limit(env,'contact:'+ipKey,Number(env.IP_LIMIT_10M||3),Number(env.IP_LIMIT_DAY||10))) return fail('rate_limit',429);
    const fingerprint=await mac(env.RELAY_SECRET,p.email.toLowerCase().trim()+'\n'+p.message.trim());
    if(!await limit(env,'duplicate:'+fingerprint,1,1)) return fail('duplicate',429);
    if(!await limit(env,'global',Number(env.GLOBAL_LIMIT_10M||20),Number(env.GLOBAL_LIMIT_DAY||100))) return fail('rate_limit',429);
    const payload=JSON.stringify({id:crypto.randomUUID(),timestamp:Date.now(),name:p.name.trim(),email:p.email.trim(),company:p.company.trim(),message:p.message.trim()});
    const response=await net(env.APPS_SCRIPT_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({payload,signature:await mac(env.RELAY_SECRET,payload)}),signal:AbortSignal.timeout(20000)});
    const result=response.ok ? await response.json() : {};
    if(!result.ok) return fail('delivery_failed',502);
    return json({ok:true},200,cors);
  } catch { return fail('unavailable',503); }
}
export default {fetch:(request,env)=>handle(request,env)};
