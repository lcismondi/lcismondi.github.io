/** Standalone web app. NOT a Google Forms trigger. Only accepts signed Worker requests. */
const CONTACT_SPREADSHEET_ID = '1CvLu3VhP7hLfAvdZBxPak-Ncif4qx4j_HpWZ-PcvK5s';
const CONTACT_SHEET_NAME = 'Contacto web';
function doPost(e) {
  const output = ok => ContentService.createTextOutput(JSON.stringify({ok})).setMimeType(ContentService.MimeType.JSON);
  const reject = reason => { console.log(JSON.stringify({reason})); return output(false); };
  let lock, stored;
  try {
    const settings=PropertiesService.getScriptProperties();
    const secret=settings.getProperty('CONTACT_RELAY_SECRET');
    const recipient=settings.getProperty('CONTACT_RECIPIENT');
    if(!secret || !recipient) return reject('unavailable');
    if(!e || !e.postData || e.postData.contents.length>60000) return reject('invalid_payload');
    const envelope=JSON.parse(e.postData.contents);
    if(typeof envelope.payload!=='string' || typeof envelope.signature!=='string') return reject('invalid_payload');
    const expected=Utilities.computeHmacSha256Signature(envelope.payload,secret,Utilities.Charset.UTF_8).map(b=>('0'+((b+256)%256).toString(16)).slice(-2)).join('');
    if(envelope.signature.length!==expected.length) return reject('invalid_signature');
    let diff=0; for(let i=0;i<expected.length;i++)diff|=expected.charCodeAt(i)^envelope.signature.charCodeAt(i);
    if(diff) return reject('invalid_signature');
    const p=JSON.parse(envelope.payload);
    if(!Number.isFinite(p.timestamp) || Math.abs(Date.now()-p.timestamp)>120000 || typeof p.id!=='string' || !/^[a-f0-9-]{36}$/.test(p.id)) return reject('invalid_payload');
    if(['name','email','company','message'].some(k=>typeof p[k]!=='string') || p.name.trim().length<2 || p.name.length>200 || p.company.length>200 || p.message.trim().length<10 || p.message.length>10000 || p.email.length>254 || !/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(p.email) || /[\x00-\x1f\x7f]/.test(p.name+p.email+p.company) || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(p.message)) return reject('invalid_payload');
    lock=LockService.getScriptLock(); if(!lock.tryLock(10000)) return reject('unavailable');
    const now=Date.now();
    const seen=JSON.parse(settings.getProperty('CONTACT_SEEN')||'{}');
    for(const id of Object.keys(seen)) if(now-seen[id].time>240000)delete seen[id];
    if(seen[p.id]) return output(seen[p.id].sent === true);
    const day=new Date().toISOString().slice(0,10);
    const budget=JSON.parse(settings.getProperty('CONTACT_BUDGET')||'{}');
    const used=budget.day===day?budget.used:0;
    if(used>=100 || MailApp.getRemainingDailyQuota()<1) return reject('rate_limit');
    stored = guardarConsultaContacto(p, now);
    if (stored.existing) return output(stored.sheet.getRange(stored.row, 7).getValue() === 'Enviado');
    // Mark before sending: ambiguous provider failures must not cause duplicate mail.
    seen[p.id]={time:now,sent:false}; settings.setProperty('CONTACT_SEEN',JSON.stringify(seen));
    settings.setProperty('CONTACT_BUDGET',JSON.stringify({day,used:used+1}));
    MailApp.sendEmail({to:recipient,replyTo:p.email,name:'Contacto web',subject:'Contacto web de '+p.name,body:p.name+' <'+p.email+'>\n'+(p.company?'Empresa: '+p.company+'\n':'')+'\n'+p.message});
    stored.sheet.getRange(stored.row, 7).setValue('Enviado');
    SpreadsheetApp.flush();
    seen[p.id].sent=true; settings.setProperty('CONTACT_SEEN',JSON.stringify(seen));
    return output(true);
  } catch {
    if (stored && !stored.existing) { try { stored.sheet.getRange(stored.row, 7).setValue('Revisar envío'); SpreadsheetApp.flush(); } catch {} }
    return reject('delivery_failed');
  }
  finally { if(lock && lock.hasLock())lock.releaseLock(); }
}
function textoSeguroContacto(value) {
  // User input must never become a Sheets formula, including after CSV export.
  return /^\s*[=+\-@]/.test(value) ? "'" + value : value;
}
function guardarConsultaContacto(p, timestamp) {
  const sheet=SpreadsheetApp.openById(CONTACT_SPREADSHEET_ID).getSheetByName(CONTACT_SHEET_NAME);
  if(!sheet) throw new Error('contact_sheet_missing');
  const headers=['Fecha','Nombre','Email','Empresa','Mensaje','ID','Estado correo'];
  if(sheet.getRange(1,1,1,7).getValues()[0].some((value,i)=>value!==headers[i])) throw new Error('contact_headers_changed');
  const last=sheet.getLastRow();
  if(last>1){const found=sheet.getRange(2,6,last-1,1).createTextFinder(p.id).matchEntireCell(true).findNext();if(found)return {sheet,row:found.getRow(),existing:true};}
  const row=last+1;
  if(row>sheet.getMaxRows())sheet.insertRowsAfter(sheet.getMaxRows(),100);
  const values=[new Date(timestamp),...['name','email','company','message'].map(key=>textoSeguroContacto(p[key])),p.id,'En proceso'];
  sheet.getRange(row,1,1,7).setValues([values]);
  sheet.getRange(row,1).setNumberFormat('dd/MM/yyyy HH:mm:ss');
  sheet.getRange(row,2,1,6).setWrap(true);
  SpreadsheetApp.flush();
  return {sheet,row,existing:false};
}
function autorizarContactoProtegido() {
  const sheet=SpreadsheetApp.openById(CONTACT_SPREADSHEET_ID).getSheetByName(CONTACT_SHEET_NAME);
  if(!sheet)throw new Error('contact_sheet_missing');
  MailApp.getRemainingDailyQuota();
}

/** Run once in the editor as owner. No emails or rows are created. */
function configurarContactoProtegido() {
  const settings=PropertiesService.getScriptProperties();
  if(!settings.getProperty('CONTACT_RELAY_SECRET'))settings.setProperty('CONTACT_RELAY_SECRET',Utilities.getUuid()+Utilities.getUuid());
  settings.setProperty('CONTACT_RECIPIENT','cismondil@gmail.com');
  autorizarContactoProtegido();
  console.log('Configuración completada. El secreto permanece en las propiedades del script.');
}
