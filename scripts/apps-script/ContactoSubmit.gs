/** Proyecto vinculado al FORMULARIO NUEVO de contacto, no al spreadsheet. */
const ENVIAR_ACUSE_CONTACTO = false; // Propuesta: aviso solo al propietario.
const EMAIL_CONTACTO = 'cismondil@gmail.com';

function onContactFormSubmit(e) {
  if (!e || !e.response || typeof e.response.getItemResponses !== 'function') {
    throw new Error('Usar un activador del formulario: Al enviar formulario. No invocar como web app.');
  }
  const answers = {};
  for (const item of e.response.getItemResponses()) {
    answers[item.getItem().getTitle().trim()] = String(item.getResponse() || '').trim();
  }
  const name = answers['Nombre'];
  const email = answers['Correo electrónico'];
  const message = answers['Mensaje'];
  if (!name || !message || !email || !/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(email)) {
    throw new Error('Revisar Nombre, Correo electrónico y Mensaje del formulario. No se enviaron correos.');
  }
  const subjectName = name.replace(/[\r\n]+/g, ' ').slice(0, 150);
  // Texto plano: los datos del visitante no se interpretan como HTML.
  MailApp.sendEmail({
    to: EMAIL_CONTACTO,
    replyTo: email,
    name: 'Contacto web',
    subject: 'Contacto web de ' + subjectName,
    body: name + ' <' + email + '> escribió:\n\n' + message
  });
  if (ENVIAR_ACUSE_CONTACTO && email.toLowerCase() !== EMAIL_CONTACTO.toLowerCase()) {
    MailApp.sendEmail({
      to: email,
      replyTo: EMAIL_CONTACTO,
      name: 'Luciano Cismondi',
      subject: 'Recibí tu consulta',
      body: 'Hola ' + name + ',\n\nRecibí tu consulta. Gracias por escribirme.\n\nLuciano Cismondi'
    });
  }
}

/** Pide permisos sin enviar correo. Ejecutar manualmente una sola vez. */
function autorizarContacto() {
  FormApp.getActiveForm().getId();
  MailApp.getRemainingDailyQuota();
}