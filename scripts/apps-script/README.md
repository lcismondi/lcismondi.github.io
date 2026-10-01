# Corrección de correos de contacto y newsletter

Estado: archivos para copiar y revisar. No instalados en Google. No se hicieron envíos.

## Diagnóstico

El activador de envío del spreadsheet recibe eventos de las hojas de respuestas asociadas. El onFormSubmit original ignora el evento y lee getLastRow de Suscripciones: un envío de contacto puede reenviar al último suscriptor, incluso uno antiguo. Se corrige con e.range.getSheet y e.range.getRow.

El cc de newsletter genera expresamente una copia al propietario. Se conserva en el parche para no cambiar esa elección sin confirmación; puede retirarse si no se desea. El contacto original usa to del visitante, cc del propietario y replyTo del visitante. La propuesta separa un aviso al propietario (responder al visitante) y un acuse opcional (responder al propietario).

El error Authorization is required es independiente: el propietario del activador debe conceder permisos de MailApp. Las funciones autorizarNewsletter/autorizarContacto solo consultan el recurso y la cuota; no envían mensajes. No ejecutar los manejadores de eventos manualmente.

## Instalación, en orden

1. Guardar copia de ambos proyectos y anotar sus activadores actuales. Comprobar también activadores de versiones antiguas: si siguen vinculados a formularios activos, pueden enviar correos.
2. En el proyecto del spreadsheet, sustituir únicamente onFormSubmit con NewsletterSubmit.gs (incluye autorizarNewsletter). Mantener doGet y validateCodeAndEmail existentes. No dejar dos funciones onFormSubmit ni duplicar el archivo.
3. Mantener UN activador: función onFormSubmit, fuente Hoja de cálculo, evento Al enviar formulario. El nombre exacto es onFormSubmit, no onFormSubmimt. Verificar que Suscripciones es el nombre exacto y A/B/C/D/G contienen fecha/nombre/email/suscripción/confirmado. No se añaden ni sobrescriben columnas con el parche.
4. Ejecutar autorizarNewsletter y conceder los permisos con la cuenta propietaria del activador. La aplicación web /exec sigue siendo necesaria para las confirmaciones. No sustituir su URL por /dev. Si posteriormente se cambia doGet, actualizar la implementación existente conservando su URL.
5. En el proyecto del FORMULARIO NUEVO de contacto, sustituir el antiguo doPost por ContactoSubmit.gs. Propuesta inicial: ENVIAR_ACUSE_CONTACTO=false. Si el propietario confirma ambos correos, cambiar a true. Se evita duplicar el acuse si el remitente es el propio propietario.
6. Sustituir el activador de doPost por UNO de onContactFormSubmit, fuente Formulario, evento Al enviar formulario. Ejecutar autorizarContacto para conceder permisos. El nombre doPost no era por sí mismo un error, pero el código esperaba e.response de un evento Forms, no un POST de aplicación web.
7. En cada Google Form comprobar Respuestas > hoja vinculada. Deben apuntar al spreadsheet deseado y a sus respectivas pestañas. Estos scripts no crean las filas de respuestas: lo hace Forms. No añadir appendRow porque duplicaría las respuestas.
8. Tras instalar: prueba coordinada de contacto (cero correos de newsletter), luego suscripción de prueba y confirmación con su propio enlace. Revisar Ejecuciones y destinatarios. No usar datos de terceros ni enlaces antiguos de prueba.

## Límites del parche

- Corrige el cruce de hojas y fila, no ofrece protección completa antispam.
- Mantiene temporalmente enlaces Base64 para compatibilidad con validateCodeAndEmail. Base64 no es cifrado ni token secreto; timestamp/email son predecibles. Nueva versión pendiente con tokens aleatorios, expiración robusta y sin emails en URL/logs.
- El doGet actual modifica G al abrir un enlace; escáneres de correo podrían visitarlo. Recomendable confirmación con acción explícita en una segunda etapa.
- No hay garantía de envío exactamente una vez: activadores duplicados/reintentos pueden repetir correos. Mantener un solo activador y revisar cuentas que crearon activadores; una garantía mayor requiere estado de procesamiento y tratamiento de fallos.
- La falta de permisos no se arregla editando HTML. Debe autorizar quien creó el activador.

## Pruebas locales realizadas

Servicios simulados (sin Google/MailApp reales): contacto ignorado por newsletter, fila del evento frente a última fila, URL codificada, solicitudes antiguas y confirmadas omitidas, errores de evento/email, destinatario/replyTo y mensajes de texto plano. Todos pasan.

Referencias: https://developers.google.com/apps-script/guides/triggers/events y https://developers.google.com/apps-script/reference/mail/mail-app
## Nueva pantalla de confirmación (1 de octubre de 2026)

Preparada localmente en `NewsletterConfirmation.gs`; pendiente de instalar en Google.

1. Guardar una copia del código actual del proyecto del newsletter.
2. Eliminar únicamente la función `doGet` antigua y agregar el contenido de `NewsletterConfirmation.gs`. Mantener `validateCodeAndEmail`, `onFormSubmit` y el activador existente. No dejar dos funciones `doGet`.
3. Guardar. En **Implementar > Gestionar implementaciones**, editar la aplicación web existente (lápiz), elegir **Nueva versión** e implementar. Conservar su URL `/exec`: crear otra implementación cambiaría el enlace que se envía por correo.
4. Abrir la URL `/exec` sin parámetros: debe mostrar la pantalla de enlace inválido. Luego comprobar una suscripción propia nueva: confirmar que muestra éxito y que la columna G de esa fila queda en 1. Una segunda apertura puede mostrar enlace utilizado, según el validador existente.

La presentación tiene estados de éxito, enlace inválido/usado/vencido y error temporal. Conserva la validación y los enlaces anteriores; no añade registros con datos personales ni refleja parámetros en el HTML. No cambia las limitaciones del mecanismo Base64 descritas arriba.

Documentación: https://developers.google.com/apps-script/concepts/deployments

### Confirmación instalada y verificada

El 1 de octubre de 2026 el usuario reemplazó `checkmail.gs` con `reemplazo/checkmail.gs` y actualizó la implementación existente, conservando la URL `/exec`. La lectura pública sin parámetros mostró el diseño nuevo. El usuario confirmó la prueba de suscripción, pantalla de éxito y valor 1 en la columna G. El archivo completo de reemplazo es una alternativa a `NewsletterConfirmation.gs`: no instalar ambos porque duplicarían funciones.

El formulario web ahora ofrece recuperación de datos para reintentar y una nueva solicitud en blanco. Verificado en navegador con destino local (sin enviar a Google): validación del selector y captcha, un solo envío ante doble clic, contenido enviado, reinicio, recuperación, elección de plan y ausencia de desbordamiento a 320/768/1440 px.
