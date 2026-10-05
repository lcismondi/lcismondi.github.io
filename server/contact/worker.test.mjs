import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {createSheetMock} from './sheet.mock.mjs';
import {handle,mac,ContactGuard} from './worker.mjs';
const attempts=new Map();
const guard={idFromName:x=>x,get:key=>({fetch:async(_,options)=>{const p=JSON.parse(options.body),rows=attempts.get(key)||[];const allowed=rows.length<p.daily && rows.filter(t=>Date.now()-t<600000).length<p.short;if(allowed){rows.push(Date.now());attempts.set(key,rows);}return Response.json({allowed});}})};
const env={ALLOWED_ORIGINS:'https://example.com',TURNSTILE_HOSTNAMES:'example.com',TURNSTILE_SECRET:'test',RELAY_SECRET:'test-secret',APPS_SCRIPT_URL:'https://relay.test',GUARD:guard};
let sent=0,verify=0,verification={success:true,hostname:'example.com',action:'contact'},providerOk=true;
const net=async url=>{if(url.includes('siteverify')){verify++;return Response.json(verification);}sent++;return Response.json({ok:providerOk});};
const request=(body,path='/contact',method='POST',origin='https://example.com')=>new Request('https://worker.test'+path,{method,headers:{Origin:origin,'CF-Connecting-IP':'192.0.2.1','Content-Type':'application/json'},...(method==='POST'?{body:typeof body==='string'?body:JSON.stringify(body)}:{})});
async function payload(age=3000){const raw=(Date.now()-age)+'.'+crypto.randomUUID();return {name:'Persona real',email:'user@example.com',company:'',message:'Consulta legítima sobre mi proyecto.',companyWebsite:'',challenge:raw+'.'+await mac(env.RELAY_SECRET,raw),token:'test-token'};}
let count=0;
async function test(label,fn){attempts.clear();sent=verify=0;verification={success:true,hostname:'example.com',action:'contact'};providerOk=true;await fn();count++;console.log('PASS '+label);}
await test('normal y honeypot vacío',async()=>{const r=await handle(request(await payload()),env,net);assert.equal(r.status,200);assert.equal(sent,1);});
await test('honeypot no produce correo ni verificación',async()=>{const p=await payload();p.companyWebsite='bot';assert.equal((await handle(request(p),env,net)).status,200);assert.equal(sent+verify,0);});
await test('tiempo firmado demasiado rápido',async()=>{assert.equal((await handle(request(await payload(0)),env,net)).status,400);assert.equal(sent,0);});
await test('firma alterada',async()=>{const p=await payload();p.challenge+='x';assert.equal((await handle(request(p),env,net)).status,400);assert.equal(verify,0);});
for(const [label,changes] of [['email inválido',{email:'test'}],['mensaje vacío',{message:''}],['mensaje largo',{message:'a'.repeat(10001)}],['URLs excesivas',{message:'https://a.test https://b.test https://c.test https://d.test'}],['header injection',{name:'Persona\r\nBcc: evil@example.com'}],['campo inesperado',{to:'evil@example.com'}],['tipo incorrecto',{email:42}]])await test(label,async()=>{const p=Object.assign(await payload(),changes);assert.equal((await handle(request(p),env,net)).status,400);assert.equal(sent+verify,0);});
await test('token ausente',async()=>{const p=await payload();p.token='';assert.equal((await handle(request(p),env,net)).status,400);assert.equal(sent,0);});
for(const [label,change] of [['token inválido',{success:false}],['hostname incorrecto',{hostname:'evil.test'}],['action incorrecta',{action:'newsletter'}]])await test(label,async()=>{Object.assign(verification,change);assert.equal((await handle(request(await payload()),env,net)).status,400);assert.equal(sent,0);});
await test('token reutilizado rechazado por proveedor',async()=>{const p=await payload();await handle(request(p),env,net);verification.success=false;assert.equal((await handle(request(p),env,net)).status,400);assert.equal(sent,1);});
await test('límite 3 por IP / 10 minutos',async()=>{for(let i=0;i<4;i++){const p=await payload();p.message+=' '+i;assert.equal((await handle(request(p),env,net)).status,i<3?200:429);}assert.equal(sent,3);});
await test('duplicados',async()=>{const p=await payload();await handle(request(p),env,net);assert.equal((await handle(request(p),env,net)).status,429);assert.equal(sent,1);});
await test('llamada directa no omite validación',async()=>{assert.equal((await handle(request({}),env,net)).status,400);assert.equal(sent,0);});
await test('CORS y métodos',async()=>{assert.equal((await handle(request({},'/contact','POST','https://evil.test'),env,net)).status,403);assert.equal((await handle(request(null,'/contact','GET'),env,net)).status,405);});
await test('body excesivo',async()=>{assert.equal((await handle(request('a'.repeat(48001)),env,net)).status,413);assert.equal(sent,0);});
await test('JSON malformado',async()=>{assert.equal((await handle(request('{'),env,net)).status,400);});
await test('error de correo',async()=>{providerOk=false;const r=await handle(request(await payload()),env,net);assert.equal(r.status,502);assert.equal((await r.json()).code,'delivery_failed');});
await test('idiomas y HTML tratados como datos',async()=>{for(const message of ['Consulta sobre mi proyecto.','Hello, I have a project enquiry.','こんにちは、プロジェクトについて相談したいです。','<script>alert(1)</script>']){attempts.clear();const p=await payload();p.message=message;assert.equal((await handle(request(p),env,net)).status,200);}});
// Exercise real Durable Object counter across instances, including daily limit and cleanup.
await test('contador persistente 10 diarios y alarma',async()=>{const storage=new Map();const ctx={storage:{get:async k=>storage.get(k),put:async(k,v)=>storage.set(k,v),transaction:async fn=>fn(ctx.storage),setAlarm:async()=>{},deleteAll:async()=>storage.clear()}};for(let i=0;i<11;i++){const object=new ContactGuard(ctx);const r=await object.fetch(new Request('https://guard/',{method:'POST',body:JSON.stringify({short:20,daily:10})}));assert.equal((await r.json()).allowed,i<10);}await new ContactGuard(ctx).alarm();assert.equal(storage.size,0);});
// Execute the actual Apps Script relay with mocked Google services.
await test('relay firma, replay, texto plano, cero autorespuestas',async()=>{
 const props=new Map([['CONTACT_RELAY_SECRET',env.RELAY_SECRET],['CONTACT_RECIPIENT','owner@example.com']]);const mails=[];
 const {createHmac}=await import('node:crypto');
 const context=vm.createContext({console,SpreadsheetApp:createSheetMock().service,PropertiesService:{getScriptProperties:()=>({getProperty:k=>props.get(k),setProperty:(k,v)=>props.set(k,v)})},Utilities:{Charset:{UTF_8:'utf8'},computeHmacSha256Signature:(p,s)=>Array.from(createHmac('sha256',s).update(p).digest())},ContentService:{MimeType:{JSON:'json'},createTextOutput:s=>({setMimeType:()=>JSON.parse(s)})},LockService:{getScriptLock:()=>({tryLock:()=>true,hasLock:()=>true,releaseLock:()=>{}})},MailApp:{getRemainingDailyQuota:()=>100,sendEmail:p=>mails.push(p)}});
 vm.runInContext(readFileSync(new URL('../../scripts/apps-script/ContactoRelay.gs',import.meta.url),'utf8'),context);
 const p=await payload();const payloadString=JSON.stringify({id:crypto.randomUUID(),timestamp:Date.now(),name:p.name,email:p.email,company:'',message:'<script>alert(1)</script>'});const envelope={payload:payloadString,signature:await mac(env.RELAY_SECRET,payloadString)};const event={postData:{contents:JSON.stringify(envelope)}};
 assert.equal(context.doPost(event).ok,true);assert.equal(context.doPost(event).ok,true);assert.equal(mails.length,1);assert.equal(mails[0].to,'owner@example.com');assert.equal(mails[0].htmlBody,undefined);assert.ok(mails[0].body.includes('<script>'));
 envelope.signature='0'.repeat(64);assert.equal(context.doPost({postData:{contents:JSON.stringify(envelope)}}).ok,false);assert.equal(mails.length,1);
});
console.log(`${count} tests passed. No real network or email.`);
