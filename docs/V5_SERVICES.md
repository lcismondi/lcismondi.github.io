# Configuración pendiente de servicios V5

## Analítica recomendada

Google Analytics 4 estándar (gratuito): crear propiedad para https://lucianocismondi.com.ar y flujo Web; facilitar el ID de medición G-… para integración. No se han creado cuentas ni activado rastreadores. Antes de activarlo, preparar preferencias de consentimiento, textos aplicables y evitar enviar nombres, emails o contenido del formulario en eventos.

Fuentes consultadas: https://marketingplatform.google.com/intl/es/about/analytics/ y https://support.google.com/analytics/answer/9304153

Medir visitas, casos, CTA e inicio de contacto. El clic o POST no debe etiquetarse como recepción confirmada. Google Forms sigue gestionando la confirmación fuera de la Home; su spreadsheet permite contabilizar contactos recibidos.

## Contacto

Se recomienda conservar Google Forms por comodidad del propietario. Alternativa: Formspree permite un endpoint específico para la web y respuesta de envío; su plan gratuito empieza en 50 envíos mensuales según https://help.formspree.io/articles/account-management/account-limits . Requiere cuenta y configurar endpoint; no se ha cambiado el proveedor.

Prueba autorizada: PRUEBA V5 - Codex, identificador V5-20260920. Google respondió HTTP 200 y Hemos registrado tu respuesta. Se realizó un único POST al formulario con nombre, email del propietario y mensaje de prueba, incluyendo empresa en el mensaje. Pendiente confirmación del propietario en sus respuestas. No acredita funcionamiento del captcha de la Home en producción.

## Subdominio de enlaces

Preferencia confirmada: https://links.lucianocismondi.com.ar/. links/index.html renovado con diseño estático independiente, canonical al subdominio y destinos absolutos. No utiliza JS ni las dependencias antiguas. Fuera del sitemap del dominio principal.

Para publicarlo falta conocer proveedor DNS y registros actuales de links; no compartir credenciales. GitHub Pages debe servir esta página mediante una configuración de sitio/dominio compatible, por ejemplo un proyecto independiente cuyo contenido de raíz sea esta página. No cambiar CNAME de la web principal para apuntarlo a links. No se han modificado DNS ni configuración remota.
## Formulario corregido y DNS confirmado

El propietario indicó que el formulario anterior había sido sustituido por spam. Destino vigente: https://docs.google.com/forms/d/e/1FAIpQLSc2L75SKm2em22xHlLLP6Gd9BmykjFGBHdlt0MHOuXBVYSctQ/viewform . Se comprobaron en su estructura pública los tres entry IDs, que coinciden con los anteriores; se actualizaron action y enlace alternativo de la Home.

Prueba autorizada al nuevo destino: PRUEBA V5 - Formulario nuevo / V5-FORM-NUEVO. Google respondió HTTP 200 y Hemos registrado tu respuesta. Pendiente confirmación visual del propietario en las respuestas correctas. La prueba anterior no validaba este nuevo formulario.

El captcha del frontend no protege envíos directos al endpoint de Google Forms. Cambiar de formulario no constituye una protección completa contra spam. Para control robusto se necesita verificación en servidor de un captcha o un proveedor de formularios que lo gestione; no se ha creado un backend ni se ha cambiado de proveedor.

DNS aportado por el propietario: FreeDNS/afraid, links.lucianocismondi.com.ar CNAME lcismondi.github.io. El destino es compatible con Pages; falta asociar links al sitio/repositorio que sirva esta página. No se han modificado DNS ni Pages del sitio principal.
## Analytics y diagnóstico de automatizaciones de correo

ID facilitado: G-GVEJ50Y14T. Integrado en la Home mediante js/analytics-v5.js y css/analytics-v5.css, con aceptación/rechazo de igual jerarquía y preferencias accesibles desde el footer. Sin carga de gtag antes de aceptar; solo se activa en el dominio de producción y www, no en localhost. Preferencia con caducidad de 180 días; rechazo deshabilita GA y elimina cookies _ga conocidas. No es una certificación legal de consentimiento: pendiente texto de privacidad completo y revisión de configuración en GA.

Eventos implementados: page_view, primary_cta_click, case_click y contact_start, sin valores de campos. No se emite contact_submit: no puede inferirse la recepción desde la Home. Pendiente revisar Medición mejorada en la propiedad, desactivar seguimiento automático de formularios para evitar duplicación/ambigüedad y verificar DebugView tras despliegue consentido. La integración es de la Home; las páginas internas no cargan GA todavía.

Pruebas locales: rechazo no carga tag, aceptación lo carga una vez, revocación lo deshabilita, preferencias guardadas/caducadas y bloqueo en localhost. Verificación de enlaces/teclado/footer sin excepciones. No se realizaron más envíos de formularios ni eventos reales a GA.

El usuario confirma recepción pero informa correos inesperados. El correo PRUEBA V5 - Codex corresponde a la prueba del formulario anterior, enviada con el email del propietario. El aviso Apps Script indica doPost invocado por formSubmit sin autorización; código remoto no disponible en repo. Se solicitaron código de doPost/correos/newsletter, activadores y comportamiento deseado. No reautorizar ciegamente antes de revisar qué envía. Newsletter no corresponde a los datos de nuestras pruebas; origen pendiente de investigación. No se abrió el enlace de confirmación de suscripción.
Aviso de analítica personalizado: tarjeta compacta Navy Blue, texto breve que identifica responsable, proveedor y finalidad, botones Aceptar/Rechazar equivalentes y preferencias en footer. Sin cambios en lógica de consentimiento; pruebas de aceptación/rechazo/revocación/local pasan. Sigue pendiente información ampliada de cookies/privacidad antes de publicar. La apariencia concreta del aviso es personalizable; no se declara cumplimiento legal integral por esta modificación.
## Información ampliada de privacidad y cookies — borradores

Se preparan privacidad.html y cookies.html con estilos en css/legal-v5.css, enlazadas desde footer, aviso de Analytics y formulario. Son borradores locales con aviso explícito y noindex, fuera del sitemap; no están listas para publicar.

Contenido basado en la integración real: consentimiento Analytics, preferencia local de 180 días de vigencia funcional (sin prometer borrado automático), cookies GA con duración predeterminada documentada por Google, reCAPTCHA cargado independientemente de Analytics, Forms/Sheets/Apps Script, registros IP de GitHub Pages, proveedores externos y derechos ante AAIP. Se distingue conservación en navegador de conservación en servidores.

Pendientes explícitos: responsable/domicilio/contacto público, plazo de consultas, conservación GA, transferencias internacionales y configuración de proveedores, inventario real de cookies de terceros y alcance de automatizaciones de correo. No se afirman anonimato, ausencia de newsletter ni garantías legales no verificadas. No se modificaron scripts de correo, preferencias de analítica ni se borraron datos.

Se aclaró al propietario que conservación refiere a consultas recibidas (Forms/Sheets/correos), no a una cuenta nueva. Se solicitan por separado email público y plazo para consultas inactivas. El domicilio y demás datos siguen pendientes, sin inventarlos.

Verificación Chrome 320, 390, 768, 1440 px: ambas páginas sin desbordamiento, un h1, aviso de borrador, noindex y sin scripts. Sin excepciones. Fuentes enlazadas en páginas: AAIP, Ley 25.326, Google y GitHub. La revisión no certifica cumplimiento legal.