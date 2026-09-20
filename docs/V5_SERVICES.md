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