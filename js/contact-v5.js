/* Protected contact: only a confirmed server response clears the enquiry. */
(() => {
  const form=document.getElementById('contactForm'); if(!form)return;
  const en=document.documentElement.lang.startsWith('en');
  const text=(es,english)=>en?english:es;
  const config=window.CONTACT_CONFIG||{};
  const error=document.getElementById('contact-error');
  const button=form.querySelector('[type="submit"]');
  const status=document.getElementById('contact-status');
  const showError=message=>{error.textContent=message;error.hidden=false;error.focus();};
  const unavailable=text('El formulario está temporalmente fuera de servicio. Podés escribirme por WhatsApp.','The form is temporarily unavailable. You can contact me through WhatsApp.');
  let busy=false, challenge='',widget, token='', draft;
  form.hidden=false;
  button.disabled=true;
  // Never fall back to the unprotected Google Forms endpoint.
  form.addEventListener('submit', async event=>{
    event.preventDefault(); if(busy)return;
    error.hidden=true;
    if(!challenge || !token){showError(text('Esperá a que termine la verificación.','Wait for verification to finish.'));return;}
    if(!form.reportValidity())return;
    busy=true;button.disabled=true;
    const data={name:form.elements['entry.2024450423'].value,email:form.elements['entry.172661864'].value,company:form.elements.company.value,message:form.elements['entry.1797313582'].value,companyWebsite:form.elements.companyWebsite.value,challenge,token};
    try {
      const response=await fetch(config.endpoint+'/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(30000)});
      const result=await response.json();
      if(!response.ok || !result.ok)throw new Error(result.code||'unavailable');
      draft={name:data.name,email:data.email,company:data.company,message:data.message}; form.reset(); form.hidden=true;
      status.className='contact-feedback';status.hidden=false;status.tabIndex=-1;
      status.replaceChildren();
      const title=document.createElement('h3');title.textContent=text('Consulta enviada','Enquiry sent');
      const note=document.createElement('p');note.textContent=text('Gracias por escribirme. Responderé a tu email; no se envía un acuse automático.','Thank you for contacting me. I will reply to your email; no automatic acknowledgement is sent.');
      const actions=document.createElement('div');actions.className='contact-feedback-actions';
      for(const recover of [false,true]){const b=document.createElement('button');b.type='button';b.textContent=recover?text('Recuperar consulta','Recover enquiry'):text('Escribir otra consulta','Write another enquiry');b.onclick=()=>{form.reset();if(recover && draft){form.elements['entry.2024450423'].value=draft.name;form.elements['entry.172661864'].value=draft.email;form.elements.company.value=draft.company;form.elements['entry.1797313582'].value=draft.message;}status.hidden=true;form.hidden=false;form.elements['entry.2024450423'].focus();};actions.append(b);}
      status.append(title,note,actions);status.focus();
    } catch(e) {
      showError(e.message==='rate_limit'||e.message==='duplicate'?text('Ya recibimos una consulta similar o alcanzaste el límite. Esperá antes de reintentar.','A similar enquiry was received or the limit was reached. Please wait before retrying.'):e.message==='too_fast'?text('Esperá unos segundos y volvé a enviar.','Wait a few seconds and submit again.'):text('No pudimos confirmar el envío. Conservamos tus datos para reintentar; también podés escribirme por WhatsApp.','We could not confirm delivery. Your details are preserved for retrying; you can also contact me through WhatsApp.'));
    } finally {busy=false;token='';button.disabled=true;try{window.turnstile.reset(widget);}catch{} }
  });
  if(!config.endpoint || !config.sitekey || !/^https:\/\/[^/]+$/.test(config.endpoint)){showError(unavailable);return;}
  async function renew(){challenge='';const r=await fetch(config.endpoint+'/challenge',{method:'POST',signal:AbortSignal.timeout(10000)});const data=await r.json();if(!r.ok || !data.challenge)throw new Error();challenge=data.challenge;button.disabled=busy||!token;}
  window.contactTurnstileReady=async()=>{
    try{await renew();widget=window.turnstile.render('#contact-verification',{sitekey:config.sitekey,action:'contact',appearance:'interaction-only',callback:value=>{token=value;button.disabled=busy||!challenge;},'expired-callback':()=>{token='';button.disabled=true;},'error-callback':()=>{token='';button.disabled=true;showError(unavailable);}});}catch{showError(unavailable);}
  };
  const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?onload=contactTurnstileReady&render=explicit';script.async=true;script.onerror=()=>showError(unavailable);document.head.append(script);
  // Refresh expiring server-issued timestamp without losing the draft.
  setInterval(()=>renew().catch(()=>{button.disabled=true;showError(unavailable);}),20*60*1000);
})();
