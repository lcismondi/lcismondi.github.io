import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('../../js/contact-v5.js',import.meta.url),'utf8');
function setup(config,delivery) {
 const element=()=>({hidden:true,disabled:false,children:[],append(...items){this.children.push(...items);},replaceChildren(){this.children=[];},focus(){},setAttribute(){}});
 const fields=Object.fromEntries(['entry.2024450423','entry.172661864','company','entry.1797313582','companyWebsite'].map(k=>[k,{value:k==='companyWebsite'?'':'Datos originales',focus(){}}]));
 const listeners={}, button=element(), error=element(),status=element(), form={elements:fields,hidden:true,querySelector:()=>button,addEventListener:(event,fn)=>listeners[event]=fn,reportValidity:()=>true,reset:()=>Object.values(fields).forEach(f=>f.value='')};
 let sends=0,options;
 const window={CONTACT_CONFIG:config,turnstile:{render:(_,p)=>{options=p;p.callback('valid');return 1;},reset:()=>options.callback('new-token')}};
 const context=vm.createContext({window,document:{documentElement:{lang:'es'},getElementById:id=>({contactForm:form,'contact-error':error,'contact-status':status})[id],createElement:element,head:{append(){}}},AbortSignal,setInterval(){},fetch:async(url)=>{if(url.endsWith('/challenge'))return Response.json({challenge:'signed'});sends++;return delivery();}});
 vm.runInContext(source,context);
 return {window,form,button,error,status,get sends(){return sends;},submit:()=>listeners.submit({preventDefault(){}})};
}
let state=setup({},()=>{throw new Error();});assert.equal(state.button.disabled,true);assert.ok(state.error.textContent.includes('WhatsApp'));await state.submit();assert.equal(state.sends,0);console.log('PASS configuración ausente bloquea el envío');
state=setup({endpoint:'https://contact.example.com',sitekey:'public'},()=>Response.json({ok:false,code:'delivery_failed'},{status:502}));await state.window.contactTurnstileReady();await state.submit();assert.equal(state.form.elements['entry.1797313582'].value,'Datos originales');assert.equal(state.form.hidden,false);assert.equal(state.status.hidden,true);console.log('PASS fallo conserva consulta y no confirma');
state=setup({endpoint:'https://contact.example.com',sitekey:'public'},()=>Response.json({ok:true}));await state.window.contactTurnstileReady();await state.submit();assert.equal(state.form.elements['entry.1797313582'].value,'');assert.equal(state.form.hidden,true);assert.equal(state.status.hidden,false);const actions=state.status.children[2];actions.children[1].onclick();assert.equal(state.form.elements['entry.1797313582'].value,'Datos originales');assert.equal(state.form.hidden,false);console.log('PASS éxito, limpieza y recuperación');
let resolve;state=setup({endpoint:'https://contact.example.com',sitekey:'public'},()=>new Promise(r=>resolve=r));await state.window.contactTurnstileReady();const first=state.submit();await state.submit();assert.equal(state.sends,1);resolve(Response.json({ok:true}));await first;console.log('PASS doble clic produce un solo envío');
console.log('4 interface tests passed (simulated DOM; visual browser QA pending).');
