//Activar un trigger al enviar el formulario
function doPost(e) {

  //https://developers.google.com/apps-script/reference/forms/form-response?hl=es-419
  /*
  Logger.log(e.response.getItemResponses()[0].getResponse());
  Logger.log(e.response.getItemResponses()[1].getResponse());
  Logger.log(e.response.getItemResponses()[2].getResponse());
  */

  let Nombre = e.response.getItemResponses()[0].getResponse();
  let Correo = e.response.getItemResponses()[1].getResponse();
  let Mensaje = e.response.getItemResponses()[2].getResponse();

  let Asunto = 'Contacto web de ' + Nombre;
  let Recipient = 'cismondil@gmail.com';
  let Sender = 'Luciano Cismondi';

  let body2 = Nombre + ' <' + Correo + '> escribió: ' + Mensaje;
  let bodyHTML4 = '<p> Muchas gracias ' + Nombre + ' (<a href="mailto:' + Correo + '">' + Correo + '</a>) responderé cuanto antes. </p>';
  let bodyHTML5 = '<blockquote>' + Mensaje + '</blockquote>';

  MailApp.sendEmail({
    to: Correo,
    subject: Asunto,
    body: body2,
    htmlBody: bodyHTML4 + bodyHTML5,
    cc: Recipient,
    replyTo: Correo,
    name: Sender,
  });

}
