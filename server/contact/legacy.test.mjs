import vm from 'node:vm';
import {createHash,randomUUID} from 'node:crypto';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('../../ContactoWeb.gs',import.meta.url),'utf8');
function setup(){const data=new Map(),mails=[],logs=[];const context=vm.createContext({console:{log:x=>logs.push(JSON.parse(x).reason)},PropertiesService:{getScriptProperties:()=>({getProperties:()=>Object.fromEntries(data),setProperty:(k,v)=>data.set(k,v),deleteProperty:k=>data.delete(k)})},Utilities:{getUuid:randomUUID,Charset:{UTF_8:'utf8'},DigestAlgorithm:{SHA_256:'sha256'},computeDigest:(_,s)=>Array.from(createHash('sha256').update(s).digest())},LockService:{getScriptLock:()=>({tryLock:()=>true,hasLock:()=>true,releaseLock(){}})},MailApp:{getRemainingDailyQuota:()=>1000,sendEmail:p=>mails.push(p)},FormApp:{}});vm.runInContext(source,context);return {data,mails,logs,send:(name='Persona real',email='user@example.com',message='Consulta legítima de proyecto')=>context.doPost({response:{getItemResponses:()=>[name,email,message].map(v=>({getResponse:()=>v}))}}),context};}
let count=0;
function test(name,fn){fn();count++;console.log('PASS '+name);}
test('solo propietario y sin HTML/autorespuesta',()=>{const x=setup();x.send('Persona','user@example.com','<script>alert(1)</script>');assert.equal(x.mails.length,1);assert.equal(x.mails[0].to,'cismondil@gmail.com');assert.equal(x.mails[0].cc,undefined);assert.equal(x.mails[0].htmlBody,undefined);});
for(const [name,args,reason] of [['email test',['Persona','test'],'invalid_email'],['mensaje vacío',['Persona','user@example.com',''],'invalid_payload'],['mensaje largo',['Persona','user@example.com','a'.repeat(10001)],'invalid_payload'],['inyección',['Persona\r\nBcc: evil@example.com'],'invalid_payload'],['URLs',['Persona','user@example.com','https://a.test https://b.test https://c.test https://d.test'],'content_spam']])test(name,()=>{const x=setup();x.send(...args);assert.equal(x.mails.length,0);assert.ok(x.logs.includes(reason));});
test('evento incorrecto no provoca excepción',()=>{const x=setup();x.context.doPost({parameter:{}});assert.equal(x.mails.length,0);assert.ok(x.logs.includes('invalid_event'));});
test('duplicado no reenvía',()=>{const x=setup();x.send();x.send();assert.equal(x.mails.length,1);assert.ok(x.logs.includes('duplicate'));});
test('límite por email',()=>{const x=setup();for(let i=0;i<4;i++)x.send('Persona','user@example.com','Consulta legítima número '+i);assert.equal(x.mails.length,3);assert.ok(x.logs.includes('rate_limit'));});
test('límite global',()=>{const x=setup();for(let i=0;i<21;i++)x.send('Persona',`user${i}@example.com`,'Consulta legítima número '+i);assert.equal(x.mails.length,20);assert.ok(x.logs.includes('rate_limit'));});
test('caducidad del estado',()=>{const x=setup();x.data.set('CONTACT_ATTEMPT_old',JSON.stringify({time:Date.now()-86400001,email:'old',message:'old'}));x.send();assert.equal(x.data.has('CONTACT_ATTEMPT_old'),false);assert.equal(x.mails.length,1);});
test('fallo de proveedor controlado',()=>{const x=setup();x.context.MailApp.sendEmail=()=>{throw new Error('private details');};x.send();assert.ok(x.logs.includes('delivery_failed'));assert.ok(!x.logs.some(s=>s.includes('private details')));});
console.log(`${count} tests passed. No real email.`);
