import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('../../js/contact-v5.js',import.meta.url),'utf8');
function setup(config,delivery) {
 const element=()=>({hidden:true,disabled:false,children:[],append(...items){this.children.push(...items);},replaceChildren(){this.children=[];},focus(){},setAttribute(){}});
 const fields=Object.fromEntries(['entry.2024450423','entry.172661864','company','entry.1797313582','companyWebsite'].map(k=>[k,{value:k==='companyWebsite'?'':'Datos originales',focus(){}}]));
 const listeners={}, button=element(), error=element(),status=element(),pending=element(), form={elements:fields,hidden:true,querySelector:()=>button,addEventListener:(event,fn)=>listeners[event]=fn,setAttribute(){},reportValidity:()=>true,reset:()=>Object.values(fields).forEach(f=>f.value='')};
 let sends=0,options;
 const window={CONTACT_CONFIG:config,turnstile:{render:(_,p)=>{options=p;p.callback('valid');return 1;},reset:()=>options.callback('new-token')}};
 const context=vm.createContext({window,document:{documentElement:{lang:'es'},getElementById:id=>({contactForm:form,'contact-error':error,'contact-status':status,'contact-pending':pending})[id],createElement:element,head:{append(){}}},AbortSignal,setInterval(){},fetch:async(url)=>{if(url.endsWith('/challenge'))return Response.json({challenge:'signed'});sends++;return delivery();}});
 vm.runInContext(source,context);
 return {window,form,button,error,status,pending,get sends(){return sends;},submit:()=>listeners.submit({preventDefault(){}})};
}
let state=setup({},()=>{throw new Error();});assert.equal(state.button.disabled,true);assert.ok(state.error.textContent.includes('WhatsApp'));await state.submit();assert.equal(state.sends,0);console.log('PASS configuración ausente bloquea el envío');
state=setup({endpoint:'https://contact.example.com',sitekey:'public'},()=>Response.json({ok:false,code:'delivery_failed'},{status:502}));await state.window.contactTurnstileReady();await state.submit();assert.equal(state.form.elements['entry.1797313582'].value,'Datos originales');assert.equal(state.form.hidden,false);assert.equal(state.status.hidden,true);console.log('PASS fallo conserva consulta y no confirma');
state=setup({endpoint:'https://contact.example.com',sitekey:'public'},()=>Response.json({ok:true}));await state.window.contactTurnstileReady();await state.submit();assert.equal(state.form.elements['entry.1797313582'].value,'');assert.equal(state.form.hidden,true);assert.equal(state.status.hidden,false);const actions=state.status.children[2];actions.children[1].onclick();assert.equal(state.form.elements['entry.1797313582'].value,'Datos originales');assert.equal(state.form.hidden,false);console.log('PASS éxito, limpieza y recuperación');
let resolve;state=setup({endpoint:'https://contact.example.com',sitekey:'public'},()=>new Promise(r=>resolve=r));await state.window.contactTurnstileReady();const first=state.submit();await state.submit();assert.equal(state.sends,1);assert.equal(state.pending.hidden,false);assert.equal(state.button.textContent,'Enviando consulta…');resolve(Response.json({ok:true}));await first;console.log('PASS doble clic produce un solo envío');
assert.equal(state.pending.hidden,true);
const blankAction=state.status.children[2].children[0];blankAction.onclick();assert.equal(state.form.hidden,false);assert.equal(state.status.hidden,true);assert.equal(state.form.elements['entry.1797313582'].value,'');console.log('PASS nueva consulta sin recargar');
for(const page of ['../../index.html','../../en/index.html']){const html=readFileSync(new URL(page,import.meta.url),'utf8');const start=html.indexOf('<form id="contactForm"');const end=html.indexOf('</form>',start);const feedback=html.indexOf('id="contact-status"');assert.ok(feedback>end,'La confirmación debe quedar fuera del formulario oculto');assert.ok(html.slice(start,end).includes('id="contact-pending"'));}console.log('PASS confirmación visible fuera del formulario en ES y EN');
console.log('6 interface tests passed (simulated DOM and published markup structure).');
