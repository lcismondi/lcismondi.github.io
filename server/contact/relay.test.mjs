import {createSheetMock} from './sheet.mock.mjs';
import {readFileSync} from 'node:fs';
import {createHmac,randomUUID} from 'node:crypto';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const source=readFileSync(new URL('../../scripts/apps-script/ContactoRelay.gs',import.meta.url),'utf8');
function setup(){
 const mock=createSheetMock(),mails=[],logs=[],props=new Map([['CONTACT_RELAY_SECRET','test-secret'],['CONTACT_RECIPIENT','owner@example.com']]);
 const context=vm.createContext({console:{log:x=>logs.push(JSON.parse(x).reason)},SpreadsheetApp:mock.service,PropertiesService:{getScriptProperties:()=>({getProperty:k=>props.get(k),setProperty:(k,v)=>props.set(k,v)})},Utilities:{Charset:{UTF_8:'utf8'},computeHmacSha256Signature:(p,s)=>Array.from(createHmac('sha256',s).update(p).digest())},ContentService:{MimeType:{JSON:'json'},createTextOutput:s=>({setMimeType:()=>JSON.parse(s)})},LockService:{getScriptLock:()=>({tryLock:()=>true,hasLock:()=>true,releaseLock(){}})},MailApp:{getRemainingDailyQuota:()=>100,sendEmail:p=>mails.push(p)}});
 vm.runInContext(source,context);
 const p={id:randomUUID(),timestamp:Date.now(),name:'Persona real',email:'user@example.com',company:'Empresa',message:'Consulta legítima para mi proyecto'};
 const send=(data=p,signature)=>{const payload=JSON.stringify(data);return context.doPost({postData:{contents:JSON.stringify({payload,signature:signature??createHmac('sha256','test-secret').update(payload).digest('hex')})}});};
 return {...mock,mails,logs,props,context,p,send};
}
let count=0;function test(name,fn){fn();count++;console.log('PASS '+name);}
test('guardado previo a correo y estado Enviado',()=>{const x=setup();x.context.MailApp.sendEmail=mail=>{assert.equal(x.rows.length,2);assert.equal(x.rows[1][6],'En proceso');x.mails.push(mail);};assert.equal(x.send().ok,true);assert.equal(x.rows.length,2);assert.equal(x.rows[1][6],'Enviado');assert.equal(x.rows[1][4],x.p.message);assert.equal(x.mails.length,1);});
test('replay no duplica ni fila ni correo',()=>{const x=setup();x.send();assert.equal(x.send().ok,true);assert.equal(x.rows.length,2);assert.equal(x.mails.length,1);});
test('ID en hoja evita repetición sin caché',()=>{const x=setup();x.send();x.props.delete('CONTACT_SEEN');assert.equal(x.send().ok,true);assert.equal(x.rows.length,2);assert.equal(x.mails.length,1);});
test('firma inválida no guarda ni envía',()=>{const x=setup();assert.equal(x.send(x.p,'0'.repeat(64)).ok,false);assert.equal(x.rows.length,1);assert.equal(x.mails.length,0);});
test('error de correo conserva fila y exige revisión',()=>{const x=setup();x.context.MailApp.sendEmail=()=>{throw new Error('provider secret');};assert.equal(x.send().ok,false);assert.equal(x.rows.length,2);assert.equal(x.rows[1][6],'Revisar envío');assert.equal(x.send().ok,false);assert.equal(x.rows.length,2);});
test('fórmulas almacenadas como texto',()=>{const x=setup();x.p.name='=IMPORTXML("url","//a")';x.p.company='+SUM(1,2)';x.p.message='  =HYPERLINK("url","consulta")';assert.equal(x.send().ok,true);for(const col of [1,3,4])assert.ok(x.rows[1][col].startsWith("'"));assert.equal(x.mails[0].body.includes(x.p.message),true);});
test('encabezados modificados no sobrescribe hoja',()=>{const x=setup();x.rows[0][0]='Otro encabezado';assert.equal(x.send().ok,false);assert.equal(x.rows.length,1);assert.equal(x.mails.length,0);});
test('fallo de almacenamiento no envía correo',()=>{const x=setup();x.sheet.getRange=()=>{throw new Error('storage');};assert.equal(x.send().ok,false);assert.equal(x.mails.length,0);});
test('email inválido no guarda ni envía',()=>{const x=setup();x.p.email='test';assert.equal(x.send().ok,false);assert.equal(x.rows.length,1);assert.equal(x.mails.length,0);});


test('health firmado no crea filas ni correos',()=>{const x=setup();assert.equal(x.send({operation:'health',id:x.p.id,timestamp:Date.now()}).code,'ready');assert.equal(x.rows.length,1);assert.equal(x.mails.length,0);});

console.log(`${count} sheet integration tests passed. No live rows or email.`);
