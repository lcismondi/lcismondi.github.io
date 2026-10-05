/** Google Forms trigger. Temporary protection while the verified receiver is configured. */
const EMAIL_CONTACTO = 'cismondil@gmail.com';
const CONTACT_LIMITS = {email10m:3,email24h:10,total10m:20,total24h:100};
function doPost(e) {
  const reject=reason=>console.log(JSON.stringify({reason}));
  let lock;
  try {
    if(!e || !e.response || typeof e.response.getItemResponses!=='function') {reject('invalid_event');return;}
    const items=e.response.getItemResponses();
    if(items.length!==3) {reject('invalid_payload');return;}
    const values=items.map(item=>item.getResponse());
    if(values.some(value=>typeof value!=='string')) {reject('invalid_payload');return;}
    const [name,email,message]=values.map(value=>value.trim());
    if(name.length<2 || name.length>200 || message.length<10 || message.length>10000) {reject('invalid_payload');return;}
    if(email.length>254 || !/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(email)) {reject('invalid_email');return;}
    if(/[\x00-\x1f\x7f]/.test(name+email) || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(message)) {reject('invalid_payload');return;}
    if((message.match(/https?:\/\/|www\./gi)||[]).length>3 || /(.)\1{49}/u.test(message)) {reject('content_spam');return;}
    const hash=value=>Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,value,Utilities.Charset.UTF_8).map(b=>('0'+((b+256)%256).toString(16)).slice(-2)).join('');
    const emailHash=hash(email.toLowerCase()), messageHash=hash(email.toLowerCase()+'\n'+message);
    lock=LockService.getScriptLock(); if(!lock.tryLock(10000)) {reject('unavailable');return;}
    const store=PropertiesService.getScriptProperties(),now=Date.now();
    // Keep state in individual properties to stay below the per-property size limit.
    const records=store.getProperties(),recent=[];
    for(const [key,value] of Object.entries(records)) {
      if(!key.startsWith('CONTACT_ATTEMPT_'))continue;
      const row=JSON.parse(value);
      if(now-row.time>=86400000)store.deleteProperty(key); else recent.push(row);
    }
    if(recent.some(row=>row.message===messageHash)) {reject('duplicate');return;}
    const mine=recent.filter(row=>row.email===emailHash);
    if(mine.length>=CONTACT_LIMITS.email24h || mine.filter(row=>now-row.time<600000).length>=CONTACT_LIMITS.email10m || recent.length>=CONTACT_LIMITS.total24h || recent.filter(row=>now-row.time<600000).length>=CONTACT_LIMITS.total10m || MailApp.getRemainingDailyQuota()<1) {reject('rate_limit');return;}
    // Reserve before sending; uncertain delivery must not trigger automatic repeats.
    store.setProperty('CONTACT_ATTEMPT_'+Utilities.getUuid(),JSON.stringify({time:now,email:emailHash,message:messageHash}));
    MailApp.sendEmail({to:EMAIL_CONTACTO,replyTo:email,name:'Contacto web',subject:'Contacto web de '+name,body:name+' <'+email+'> escribió:\n\n'+message});
    reject('accepted');
  } catch {reject('delivery_failed');}
  finally {if(lock && lock.hasLock())lock.releaseLock();}
}
function autorizarContacto() {
  FormApp.getActiveForm().getId();
  MailApp.getRemainingDailyQuota();
}
