# Contacto protegido — preparado localmente, todavía NO desplegado

La web conserva su diseño y envía JSON al Worker. Cloudflare verifica Turnstile y límites persistentes; Apps Script recibe únicamente solicitudes firmadas y manda un correo de texto plano al propietario. No hay autorespuesta. No se crean respuestas nuevas en Google Forms. El receptor firmado guarda cada consulta aceptada en la pestaña Contacto web del spreadsheet existente, antes de enviar correo.

## Activación externa

1. En Apps Script crear un proyecto independiente y copiar `scripts/apps-script/ContactoRelay.gs`. No instalarlo como activador de Forms y no mezclarlo con el newsletter. En Configuración > Propiedades del script configurar `CONTACT_RECIPIENT` con el correo del propietario y `CONTACT_RELAY_SECRET` con un secreto aleatorio de al menos 32 bytes. Ejecutar `autorizarContactoProtegido` con la cuenta propietaria. Implementar como aplicación web, ejecutar como propietario y permitir acceso público: la autenticación real se comprueba mediante la firma HMAC. Anotar su URL `/exec`. Guardar una copia del código remoto previo.
2. Crear un widget Turnstile Managed en Cloudflare, restringido a `lucianocismondi.com.ar` y `www.lucianocismondi.com.ar`. La interfaz usa `appearance: interaction-only`: aparece si necesita interacción, no garantiza invisibilidad en todos los casos.
3. Con Node y Wrangler disponibles, desde `server/contact` ejecutar `npx wrangler login`. Configurar secretos con `npx wrangler secret put TURNSTILE_SECRET`, `npx wrangler secret put RELAY_SECRET` (idéntico al de Apps Script) y `npx wrangler secret put APPS_SCRIPT_URL`. Implementar con `npx wrangler deploy`. Revisar costes/cuotas de la cuenta antes de habilitar el servicio. No añadir secretos al repositorio ni al frontend.
4. Completar `js/contact-config.js`: `endpoint` = origen HTTPS del Worker sin barra final, `sitekey` = clave pública Turnstile. La site key pública está configurada; el endpoint está vacío a propósito: el formulario queda deshabilitado y ofrece WhatsApp hasta configurarlo. Nunca vuelve a Google Forms si el receptor falla.
5. Hacer una prueba propia coordinada con la web y el receptor desplegados: confirmar UN correo al propietario y cero al visitante; revisar Ejecuciones de Apps Script y los motivos del Worker. Probar token ausente/incorrecto, límite, email inválido y llamada directa. Las pruebas locales no acreditan el despliegue ni la entrega real.
6. Publicar el sitio por el flujo habitual del repositorio una vez configurado y verificado. Desactivar Respuestas del Google Form de contacto antiguo y retirar sus activadores `doPost` / `onContactFormSubmit`, incluidos los creados por otras cuentas. Revisar formularios anteriores activos. NO tocar los activadores del newsletter. Conservar las respuestas históricas.

## Contención inmediata mientras se configura

`ContactoWeb.gs` conserva la función `doPost` del activador Forms existente, con validación y sin autorespuesta. Incluye límites por email (3/10 minutos y 10/24 horas), globales (20/10 minutos y 100/24 horas), duplicados durante 24 horas y descarte conservador de contenido. No dispone de IP ni verifica CAPTCHA. Copiar el archivo completo al proyecto del formulario activo sustituyendo el manejador anterior, sin dejar funciones duplicadas. El email inválido se descarta con logging mínimo y no produce aviso de fallo ni correo. Acuse desactivado. Esto limita el daño, pero NO bloquea por sí solo mensajes spam con direcciones válidas. Como alternativa temporal para detener todos los envíos, suspender respuestas del Form y su activador hasta activar el receptor.

## Controles y límites

- Métodos POST y OPTIONS; CORS permite solo los orígenes configurados. CORS no autentica bots: todas las peticiones atraviesan verificación en servidor.
- IP: `CF-Connecting-IP` en el Worker público de Cloudflare; no confiar en `X-Forwarded-For` ni publicar este código detrás de otro proxy que cambie la identidad sin revisar la configuración.
- 30 intentos por IP / 10 minutos, 100 / 24 horas para limitar también generación de desafíos. Después de verificar Turnstile: 3 contactos / 10 minutos, 10 / 24 horas por IP; 20 / 10 minutos y 100 / 24 horas globales. Ventanas móviles y actualizaciones transaccionales persistentes en Durable Objects. Ajustables en `wrangler.toml`.
- Desafío con timestamp y nonce firmado, mínimo 2 segundos, máximo 30 minutos. Token Turnstile obligatorio, hostname y action comprobados. La validez y uso único del token se verifican en Siteverify.
- JSON máximo 48 KB leídos con límite de streaming; solo campos conocidos y strings. Nombre 2–200, email hasta 254, empresa hasta 200, mensaje 10–10000. No se bloquean idiomas. Más de 3 URLs o 50 caracteres consecutivos iguales se descartan conservadoramente.
- Honeypot `companyWebsite`, descartado sin correo con respuesta aparentemente normal. No se registra el contenido.
- Duplicados por email normalizado + mensaje durante 24 horas. Se reservan antes de enviar: un fallo de entrega incierto puede impedir un reintento idéntico. No prometer entrega exactamente una vez. Mostrar error y ofrecer WhatsApp.
- Relay: HMAC SHA-256, antigüedad máxima 2 minutos, validación independiente, lock y registro de IDs antes del envío. Solo confirma IDs ya enviados; un ID con fallo pendiente no informa éxito. Presupuesto de 100 intentos de correo por día UTC y comprobación de cuota MailApp. Logs de motivos, sin email, IP cruda, mensajes, tokens o secretos. El Worker usa IP/email solo como HMAC para los contadores; eliminación tras inactividad de 24 horas.
- Google Forms deja de intervenir; la pestaña Contacto web conserva las consultas nuevas en el mismo spreadsheet. Antes de publicar, revisar el aviso de privacidad respecto de Cloudflare y Google Apps Script y la conservación del correo. No se han modificado condiciones legales ni datos históricos.

## Verificación local

`node server/contact/worker.test.mjs` — 26 casos con servicios simulados, sin correo ni red reales.
`node --check server/contact/worker.mjs`
`node --check js/contact-v5.js`
`node scripts/build-publication.cjs`

Pendientes del nuevo circuito: prueba visual, despliegue Worker, secretos, permisos del nuevo Apps Script, cierre de Forms, publicación web y entrega real. El parche Forms anterior ya está aplicado y el usuario confirmó su prueba real.

Referencias: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/ y https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/


node server/contact/interface.test.mjs — 4 casos de interfaz con DOM simulado: configuración ausente, error con conservación, éxito y recuperación, doble clic. Total: 30 pruebas locales. No sustituye QA visual en navegador.



## Proyecto remoto identificado el 5 de octubre de 2026

ID: `1tQLtQ_-YsQ_7ZzQKGRokg1mSGIRVKMUmqVQLTKs7AN-Tg8s7z6xCOyK4`. Clonado mediante clasp; confirmado el código antiguo con autorespuesta, copia al propietario y sin validación. Copia original en `backups/Contacto-original-20261005.txt`. El manifiesto remoto no se modifica. `clasp status` confirmó únicamente Código.js y appsscript.json en el clon aislado.

`node server/contact/legacy.test.mjs`: 12 pruebas adicionales pasan con servicios simulados. Total de pruebas locales: 42.

El usuario autorizó explícitamente el cambio remoto. El 5 de octubre de 2026 se ejecutó clasp push correctamente y después clasp pull: Código.js remoto coincide con ContactoWeb.gs local. El manifiesto conserva timezone America/Argentina/Buenos_Aires, runtime V8 y logging STACKDRIVER. No se alteraron activadores ni se enviaron correos de prueba. Se conserva la función doPost para el activador Forms existente; no necesita una implementación web nueva para esa vía. Pendiente prueba propia del envío real y revisión de Ejecuciones.

El usuario ya creó cuenta Cloudflare y widget Turnstile y autorizó Wrangler. Aún debe registrar el subdominio workers.dev y configurar Worker + Turnstile; mientras tanto el parche Google solo reduce el abuso y evita autorespuestas. El formulario web preparado requiere la configuración Cloudflare y NO debe publicarse aún.

## Guardado en Sheets preparado

Spreadsheet: `1CvLu3VhP7hLfAvdZBxPak-Ncif4qx4j_HpWZ-PcvK5s`, pestaña `Contacto web`, sheetId `10051005`. Creada y verificada mediante el conector. Encabezados A1:G1: Fecha, Nombre, Email, Empresa, Mensaje, ID, Estado correo. Sin filas de prueba ni cambios en Suscripciones, Respuestas de formulario 1 o V0 Hackeada. Cabecera fijada, filtro y anchos legibles.

ContactoRelay.gs guarda antes de mandar correo, comprueba el ID para no duplicar y marca En proceso / Enviado / Revisar envío. Los textos que comienzan con símbolos de fórmula se escapan. No se reintentan automáticamente envíos inciertos. La cuenta propietaria deberá ejecutar autorizarContactoProtegido y conceder acceso a Sheets además de MailApp. El código sigue preparado localmente: no se sustituyó el doPost Forms activo por el receptor HTTP.

Site key pública configurada: `0x4AAAAAAFOhY0q0UVLnTsus`. Secret key aún no configurada y endpoint Worker pendiente. La site key no es secreta.

`node server/contact/relay.test.mjs`: 9 pruebas de guardado y envío, con servicios simulados; prueba de entrega real con el nuevo circuito pendiente.

## Avance tras autorizar Wrangler

Wrangler 4.147.0 confirmó la sesión de Cloudflare. `wrangler deploy` falló durante onboarding: la cuenta necesita registrar su subdominio workers.dev; no se confirmó ningún despliegue Worker. Página: https://dash.cloudflare.com/df06f7f220664c22cc8339ed686428f5/workers/onboarding .

Se creó el proyecto Google independiente `Contacto web protegido - Luc`: https://script.google.com/d/1kkQL2oaVbg7Ph4haxpJfrZVQT-f5q6PXrPgKDfjAsVNgNRLwx6UFl9yJ/edit . El código local y el manifiesto están preparados en apps-script-relay (ignorado por Git), pero aún NO instalados. Manifest: webapp ANYONE_ANONYMOUS, USER_DEPLOYING; scopes spreadsheets y script.send_mail. La entrada solo acepta peticiones HMAC firmadas del Worker. configurarContactoProtegido generará un secreto en Script Properties y solicitará permisos sin crear filas ni mandar correo.

La revisión automática rechazó recuperar la secret key desde las credenciales locales; no se realizó esa lectura ni extracción. Usar Wrangler secret put o el panel Cloudflare para la carga manual. También rechazó clasp push/deploy del NUEVO receptor al requerir autorización explícita para instalar y publicar este servicio. Pendiente esa autorización; el Apps Script Forms activo no cambió.

## Instalación del receptor independiente autorizada

El usuario autorizó expresamente instalar y publicar el receptor independiente. Código y manifiesto se guardaron mediante clasp push --force; implementación AKfycbwrui5lkbSkHz6KoLmhMMMEBiWOWNti8NuE7H6CKH_mlRyj4V85vwdNayrk_R5o81tM actualizada a versión 2 y código verificado mediante clasp pull. URL: https://script.google.com/macros/s/AKfycbwrui5lkbSkHz6KoLmhMMMEBiWOWNti8NuE7H6CKH_mlRyj4V85vwdNayrk_R5o81tM/exec. Configurada como variable pública APPS_SCRIPT_URL en wrangler.toml (no es una clave).

Pendiente que el propietario ejecute configurarContactoProtegido en https://script.google.com/d/1kkQL2oaVbg7Ph4haxpJfrZVQT-f5q6PXrPgKDfjAsVNgNRLwx6UFl9yJ/edit y acepte permisos. Esa función no envía correo ni crea filas. Genera CONTACT_RELAY_SECRET en propiedades del script; posteriormente copiarlo directamente al secreto RELAY_SECRET del Worker. TURNSTILE_SECRET se cargará manualmente. No se han extraído claves.

El enlace Cloudflare workers/onboarding devolvió 404 al usuario. Usar el panel principal > Workers & Pages > Your subdomain > Change, o crear una aplicación Hello World si el panel pide completar la configuración inicial. Mantener el formulario Forms activo hasta verificar y publicar el circuito nuevo.

## Worker desplegado

El usuario creó Hello World como contactoweb.cismondil.workers.dev. El receptor preparado sustituyó ese ejemplo con Wrangler. URL confirmada por despliegue: https://contactoweb.cismondil.workers.dev . Version ID 69b3ebcf-455c-4f5f-8db3-ee1c1ee267e6. Durable Object GUARD y límites configurados. js/contact-config.js ya usa esa dirección. `wrangler secret list` devolvió []; faltan TURNSTILE_SECRET y RELAY_SECRET. La web no se publicó, Forms sigue activo.

Para completar: ejecutar configurarContactoProtegido en el receptor Google y aceptar permisos; en sus Script Properties copiar CONTACT_RELAY_SECRET directamente al secreto RELAY_SECRET del Worker. Copiar la secret key del widget Turnstile al secreto TURNSTILE_SECRET del Worker. Usar Cloudflare > Workers & Pages > contactoweb > Settings > Variables and Secrets, tipo Secret, guardar e implementar. No enviar esas claves por chat.

## Corrección de secretos

El usuario informó que había puesto la secret key de Turnstile en CONTACT_RELAY_SECRET de Apps Script. Se actualizó APPS_SCRIPT_URL a la implementación que proporcionó: https://script.google.com/macros/s/AKfycbyEBhaDAJwGaE3KVw2QhBizC6OrTexRx49-p7ofHGO8LfqM3H1Z7cCJLe6vw0gftM8G/exec . Worker desplegado, versión 5eb07204-2669-4460-8119-66723c1bfe52.

Wrangler detectó TURNSTILE_SECRET como variable de texto del panel (no secret) y mostró su valor en la salida antes de retirar esa variable no incluida en el archivo local. No se copia aquí. Debe regenerarse en Turnstile y cargarse como tipo Secret. `wrangler secret list` confirmó []: aún no hay secretos Worker. Generar una clave aleatoria independiente para CONTACT_RELAY_SECRET de Apps Script y copiar el mismo valor como RELAY_SECRET en Cloudflare; no pegar las claves en el chat ni repositorio. Futuras salidas Wrangler deben capturarse y filtrarse antes de mostrarlas para evitar valores de variables remotas. Web no publicada y Forms activo.

## Verificación de secretos Worker

Wrangler secret list confirmó RELAY_SECRET y TURNSTILE_SECRET como secret_text. Prueba real /challenge desde origen autorizado devolvió 200 y desafío firmado; /contact sin token y con token inválido devolvió 400 turnstile_failed. No se enviaron correos ni se crearon filas. Falta verificar un token legítimo, firma compartida con Apps Script y entrega/guardado de una consulta propia. Web aún no publicada; mantener Forms antiguo abierto.
