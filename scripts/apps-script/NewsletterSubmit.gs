/**
 * Proyecto vinculado al SPREADSHEET. Sustituir SOLO el onFormSubmit anterior.
 * Mantener doGet y validateCodeAndEmail por ahora para los enlaces ya emitidos.
 * No ejecutar manualmente: necesita el evento real de envío de Sheets.
 */
function onFormSubmit(e) {
  if (!e || !e.range || !e.values) {
    throw new Error('Esta función requiere un activador de spreadsheet: Al enviar formulario.');
  }
  const sheet = e.range.getSheet();
  if (sheet.getName() !== 'Suscripciones') return;
  const row = e.range.getRow();
  if (row < 2 || e.range.getNumRows() !== 1) return;

  const values = sheet.getRange(row, 1, 1, 7).getValues()[0];
  const timestamp = values[0];
  const name = String(values[1] || '').trim();
  const email = String(values[2] || '').trim();
  const subscription = String(values[3] || '').trim();
  if (!(timestamp instanceof Date) || !Number.isFinite(timestamp.getTime())) {
    throw new Error('La columna A debe contener una fecha válida.');
  }
  const age = Date.now() - timestamp.getTime();
  if (age < 0 || age >= 24 * 60 * 60 * 1000 || Number(values[6]) === 1) return;
  if (!/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(email)) {
    throw new Error('Correo de suscripción inválido. No se envió el mensaje.');
  }
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(subscription)) {
    throw new Error('Revisar el nombre de suscripción antes de formar el alias de correo.');
  }
  const url = 'https://script.google.com/macros/s/AKfycbxLUwzomWuL5dvrNQvNioOcydo9DuXmY1Ixde4iu8bsNn2WmbJmQsMgrvdFmxlMlitc/exec';
  // Compatibilidad con validateCodeAndEmail existente. Base64 NO es cifrado.
  const code = encodeURIComponent(Utilities.base64Encode(timestamp.toString()));
  const mail = encodeURIComponent(Utilities.base64Encode(email));
  const recipient = 'cismondil+' + subscription + '@gmail.com';
  MailApp.sendEmail({
    to: email,
    cc: recipient, // Copia existente al propietario: retirar si no se desea.
    replyTo: recipient,
    name: 'Luciano Cismondi',
    subject: 'Confirma tu dirección de correo | ' + subscription,
    body: 'Hola ' + name + ',\n\nGracias por suscribirte a ' + subscription + '.\n' +
      'Para confirmar tu dirección, abrí este enlace:\n\n' + url + '?code=' + code + '&email=' + mail +
      '\n\nEl enlace vence a las 24 horas de la solicitud.\n\nGracias.'
  });
}

/** Pide permisos sin enviar correo. Ejecutar manualmente una sola vez. */
function autorizarNewsletter() {
  SpreadsheetApp.getActiveSpreadsheet().getId();
  MailApp.getRemainingDailyQuota();
}