# Desarrollo de V5

## Ramas e integración

- Base existente: `V4`, commit `d43c930` al comenzar el rediseño.
- Trabajo incremental: `redesign/v5`.
- Destino previsto para la versión terminada: una nueva rama `V5`.
- No hacer push, merge, cambiar la rama predeterminada ni la configuración de GitHub Pages como parte de las pruebas locales.
- Antes de integrar: comprobar nuevamente remoto, rama de publicación y cambios en V4; revisar el diff, validar la checklist de WEBSITE_REDESIGN.md y acordar el lanzamiento.
- Crear V5 desde la base acordada y fusionar redesign/v5 cuando la versión esté lista. No fusionar pruebas en V4.

La carpeta V5 no determina la rama de Git. Consultar `git branch --show-current`.
Guardar cada paso aprobado en un commit de la rama de trabajo. No cambiar de rama con modificaciones sin guardar: pueden acompañar al cambio de rama.

Al inicio existían cambios del usuario: eliminación de `web V4.code-workspace`, y archivos sin seguimiento `web V5.code-workspace` y `WEBSITE_REDESIGN.md`. No se incorporan automáticamente a los commits técnicos.

## Paso 1: fundamentos

`css/foundations.css` se carga después de los estilos existentes, únicamente en la Home. Las reglas se limitan a `.site-v5`; las páginas internas conservan sus estilos hasta su migración por secciones.

Incluye tokens de color, tipografía, espaciado y tamaño; contenedor de hasta 1280 px; primitivas optativas `v5-container`, `v5-section`, `v5-grid`, títulos y superficies; botones estables; foco visible; salto al contenido y movimiento reducido.

Inter 4.0 se extrae del ZIP ya existente, sin modificarla, con pesos 400, 500 y 600 en WOFF2. Licencia incluida en `assets/fonts/inter/LICENSE.txt`. La Home deja de solicitar Inter a Google Fonts. Las páginas internas mantienen su carga anterior.

No se cambia todavía el copy, el orden de secciones, las rutas ni el flujo de envío. El Header y el Hero son el siguiente paso. Los estilos legacy siguen presentes para permitir una migración incremental; no aplicar las nuevas primitivas a todas las páginas indiscriminadamente.

## Verificación de este paso

- Comprobar fuentes locales, estilos y navegación en servidor HTTP local.
- Revisar Home a 320, 390, 768 y 1440 px; comparar cualquier desbordamiento con la base V4.
- Comprobar foco con teclado, salto al contenido y movimiento reducido.
- Verificar contraste de los pares de color utilizados en los nuevos controles.
- Confirmar que una página interna no carga foundations.css.
- No enviar el formulario durante pruebas visuales. Su validación de extremo a extremo corresponde a la fase de contacto.
### Resultado de la revisión inicial

Verificado en Chrome headless a 320, 390, 768 y 1440 px, con inspección visual de capturas a 390 y 1440 px. Inter local carga en los tres pesos. El salto por teclado llega a main-content y tiene foco visible. Con movimiento reducido, animaciones y transiciones quedan desactivadas. No se detectaron excepciones JavaScript durante esta revisión. HVAC conserva sus estilos y no carga foundations.css.

Contrastes calculados: texto claro/Royal Blue 17,19:1; texto claro/Midnight Blue 9,79:1; texto secundario/blanco 6,04:1; Royal Blue/Blue Gray 7,40:1. Esto verifica estos pares, no equivale a una auditoría AA completa de la página legacy.

Se corrigieron el desbordamiento de la disponibilidad y las imágenes de las tarjetas. Persiste el ancho fijo del reCAPTCHA en 320 px (316 px de contenido sobre 305 px útiles con scrollbar), ya presente en V4: resolver en la fase del formulario. En 390, 768 y 1440 px no se observó desbordamiento horizontal. No se probó envío real ni se midieron Core Web Vitals en producción.
## Paso 2: Header y Hero

- Header estático en index.html para que la navegación exista sin JavaScript. Se mantienen nav.html y navproy.html para las internas.
- css/header-hero.css aplica la identidad Royal Blue, jerarquía del Hero y navegación responsive. js/navigation-v5.js mejora el menú con cierre por Escape, salida del foco y selección de enlace.
- js/scripts.js conserva la carga del footer en la Home y evita reemplazar su navegación estática. Solo inicializa el menú legacy al cargar nav, no al cargar footer; la Home ya no requiere jQuery.
- Copy del Hero según WEBSITE_REDESIGN.md, CTA principal uniforme, retrato existente y promesa de reducir incertidumbre. Metadatos de título y descripción de Home alineados con el nuevo posicionamiento.
- Destinos transitorios durante la migración: Casos lleva a trabajos/hvac.html; Perfil al CV; Ver cómo puedo ayudarte lleva al bloque actual #work. Al crear sus secciones definitivas, actualizar estos destinos. Se conserva #projects en la sección de proyectos.
- Revisión en Chrome: 320, 390, 768, 1024 y 1440 px; menú móvil, Escape, foco al contacto, salto al contenido y navegación sin JS verificados. Movimiento reducido sin animaciones ni transiciones. La navegación interna legacy sigue cargando en HVAC.
- El desbordamiento preexistente de reCAPTCHA a 320 px sigue pendiente de la fase de contacto. No se envían formularios en esta revisión.
- Los commits siguen pendientes de configurar la identidad de Git solicitada al usuario. No se publican cambios ni se modifica V4.
## Paso 3: La tecnología es una decisión de negocio

- Nueva sección #enfoque inmediatamente después del Hero, antes del contenido existente de proyectos.
- Copy principal de WEBSITE_REDESIGN.md, con tres preguntas de apoyo: inversión, definición de producto y viabilidad tecnológica. No se añaden resultados ni promesas de rendimiento.
- Fondo claro, jerarquía editorial y tres columnas en tablet/escritorio; lectura vertical en móvil. Sin JavaScript ni animaciones adicionales.
- CSS específico en css/value-proposition.css, reutilizando los tokens y las primitivas existentes.
- El CTA secundario del Hero ahora lleva a #enfoque, reemplazando el destino transitorio #work. Al incorporar situaciones del proyecto, revisar si ese bloque es un destino más directo.
- Verificación en Chrome a 320, 360, 390, 768, 1024 y 1440 px: sin desbordamientos dentro de la nueva sección, un único h1 y contenido visible sin JavaScript. Capturas revisadas en escritorio y móvil. La limitación previa del reCAPTCHA continúa fuera de este bloque.
## Paso 4: Situaciones del proyecto

- Se añade #situaciones después de #enfoque con las cuatro situaciones de WEBSITE_REDESIGN.md: definición, arquitectura, evolución/industrialización y dirección tecnológica.
- Cada situación explica el contexto y las decisiones a acompañar; enlaces explícitos al contacto con el CTA uniforme y contexto accesible asociado al título. No se modifican ni rellenan los campos del formulario.
- Dos columnas desde 768 px y lectura vertical en móvil. Se reutilizan tokens, botones/enlaces y foco de los fundamentos; CSS específico en css/project-stages.css. Sin JavaScript adicional.
- Ver cómo puedo ayudarte del Hero pasa a #situaciones, ahora el destino más directo para identificar la necesidad del visitante.
- Revisado en Chrome a 320, 360, 390, 768, 1024 y 1440 px. Cuatro tarjetas, sin desbordamiento dentro del bloque, enlaces con altura mínima de 44 px, destinos y descripciones accesibles existentes. Verificado el recorrido con Tab/Enter al contacto y contenido disponible sin JavaScript. Capturas de escritorio y móvil inspeccionadas.
- El proceso De una necesidad a un producto es el siguiente paso. La versión publicada y V4 permanecen intactas; commits pendientes de la identidad de Git ya solicitada.
## Paso 5: De una necesidad a un producto

- Se incorpora #proceso después de #situaciones, con Entender, Definir, Arquitectar, Desarrollar e Industrializar y los contenidos definidos en WEBSITE_REDESIGN.md.
- Se explica que la participación puede comenzar en distintas etapas. El cierre enfatiza elegir la tecnología adecuada al producto.
- Lista ordenada semántica, cinco pasos horizontales a partir de 1200 px y recorrido vertical en anchos menores. Las líneas son decorativas; todo el contenido existe en HTML sin JavaScript.
- CSS específico en css/process.css con tokens existentes y fondo Navy Blue. Sin dependencias ni movimiento adicional.
- Verificado en Chrome a 320, 360, 390, 768, 1024, 1200 y 1440 px: cinco etapas en orden, un único h1 y sin desbordamiento dentro del bloque. Inspección visual de escritorio/móvil y comprobaciones sin JavaScript y con movimiento reducido.
- Siguiente sección: Pensamiento estratégico. Profundidad técnica (capas de decisión).
## Paso 6: Pensamiento estratégico. Profundidad técnica

- Se añade #capas después de #proceso con Negocio, Producto, Sistema e Ingeniería y sus ámbitos de decisión definidos en WEBSITE_REDESIGN.md.
- Lista de definiciones semántica que relaciona cada capa con su alcance. Se explica la relación bidireccional entre decisiones de negocio y descubrimientos de ingeniería, sin presentarlas como nuevas etapas del proceso.
- Enlace al artículo HVAC existente para conectar el enfoque con la experiencia; no se incorporan resultados ni métricas nuevas.
- Estilos en css/expertise-layers.css, con tokens existentes y disposición de dos columnas en escritorio y vertical en móvil. Sin dependencias o JavaScript adicional.
- Verificado en Chrome a 320, 360, 390, 640, 768, 1024 y 1440 px: cuatro términos y descripciones, un único h1 y sin desbordamiento dentro del bloque. Enlace de 44 px de alto con foco visible por teclado; HVAC responde HTTP 200. Contenido disponible sin JavaScript y capturas de escritorio/móvil revisadas.
- Siguiente paso: casos seleccionados, priorizando HVAC y Chillit y distinguiendo resultados respaldados de información pendiente.
## Paso 7: Casos seleccionados — borrador pendiente de completar evidencia

- Se añade #casos después de #capas, con HVAC primero y Chillit después. El menú Casos apunta a esta sección; las páginas originales mantienen sus rutas y contenido.
- Contenido separado en content/cases.json. Ejecutar `node scripts/render-cases.cjs` para actualizar el bloque delimitado de index.html. El sitio sirve HTML estático sin fetch de contenido ni dependencias adicionales. Renderizado repetible verificado.
- Fuentes: WEBSITE_REDESIGN.md, trabajos/hvac.html y trabajos/frioen30segundos.html. Se verificó además la publicación US20210341220A1 (https://patents.google.com/patent/US20210341220A1/en), que incluye a Luciano Cismondi entre los inventores de un aparato para enfriamiento rápido de bebidas envasadas. La publicación es evidencia de propiedad intelectual; no demuestra por sí misma ventas, ahorro energético ni industrialización.
- HVAC: diagrama conceptual del enfoque, sin presentar la imagen ilustrativa existente como fotografía de un desarrollo real. Se presentan beneficios como objetivos, no como mejoras logradas.
- Chillit: responsabilidad de cofundador/CTO y alcance HW/control/mecánica/IA según el documento estratégico. Se enlaza la publicación de patente específica en lugar de una búsqueda genérica.
- Pendiente de respuesta del usuario: responsabilidad y resultado concreto en HVAC; etapa alcanzada e hito de Chillit durante su participación; aprendizaje/impacto en ambos. Los campos faltantes quedan en null y las notas editoriales no se renderizan. Este paso NO satisface aún todos los requisitos de casos terminados de §5.6 y no debe darse por aprobado para lanzamiento.
- Se solicitó esta información mediante una pregunta durante el trabajo. No sustituir resultados desconocidos por objetivos ni completar métricas por inferencia.
- Verificado en Chrome a 320, 390, 768, 1024 y 1440 px: dos artículos sin desbordamiento dentro del bloque, enlaces mínimos de 44 px, foco con Tab y contenido disponible sin JavaScript. Destinos locales HTTP 200; capturas móvil/escritorio revisadas. Sin filtración de notas editoriales en el HTML de la sección.
## Paso 8: Formación, criterio económico y perfil

- Se incorpora #perfil después de los casos: Decidir también es evaluar la inversión. Relaciona viabilidad técnica, viabilidad económica y estrategia de producto con la formación existente.
- Se reutilizan la Maestría en Evaluación de Proyectos, Ingeniería Electrónica y la trayectoria de ingeniería a producto y dirección tecnológica. Se enlazan estudios/mep.html, estudios/forceboard.html y trabajos/curriculum.html. No se añaden fechas ambiguas ni resultados nuevos.
- El menú Perfil y el enlace de perfil del Hero apuntan al nuevo bloque. Los artículos originales siguen disponibles.
- Estilos en css/investment-thinking.css con los tokens existentes: dos columnas en escritorio, lectura vertical en móvil y enlaces de al menos 44 px. Sin JavaScript adicional.
- Verificado en Chrome a 320, 360, 390, 768, 1024 y 1440 px: tres criterios, un único h1 y sin desbordamiento dentro de la sección. Enlaces locales HTTP 200, foco visible por teclado, navegación desde el Hero y contenido disponible sin JavaScript. Capturas de escritorio y móvil revisadas.
- Los casos siguen pendientes de los datos solicitados. Próximo paso: capacidades tecnológicas.
## Paso 9: Capacidades tecnológicas

- Se incorpora #capacidades después de #perfil y antes de los proyectos experimentales. Las seis áreas de §5.8 se presentan con títulos en español y alcance técnico vinculado a requisitos, costes y evolución del producto.
- Contenido en content/capabilities.json y renderizado estático mediante `node scripts/render-capabilities.cjs`. El HTML servido contiene todo el texto, sin dependencias ni peticiones de contenido en tiempo de ejecución.
- Estilos acotados en css/capabilities.css: fondo Royal Blue, tipografía y tokens existentes, tres columnas en escritorio, dos en tablet y una en móvil. No se añaden métricas, herramientas ni capacidades fuera del documento estratégico.
- Chrome: comprobado en 320, 360, 390, 768, 1024 y 1440 px, sin desbordamientos dentro del bloque, seis capacidades en orden y un único h1. Contenido disponible sin JavaScript, renderizado repetible y sin excepciones de ejecución. Capturas de escritorio y móvil revisadas.
- Próximo paso: proyectos experimentales, reposicionando el bloque existente Me divierto.
## Paso 10: Proyectos experimentales

- Se sustituye el bloque Me divierto de #projects por Proyectos experimentales, después de capacidades. Digit se destaca como exploración de IA, hardware, sistemas embebidos e interfaces; Airbit y Fmart mantienen presencia en dos tarjetas secundarias.
- Contenido basado en WEBSITE_REDESIGN.md §5.9 y los artículos originales. Se reformulan las promesas como exploración y preguntas de producto; no se trasladan las estimaciones de ahorro de Fmart como resultados medidos.
- Datos en content/projects.json y HTML estático generado con `node scripts/render-projects.cjs`. Estilos acotados en css/experimental-lab.css. No se modifican los artículos internos ni sus rutas.
- El menú Proyectos apunta a #projects; se conserva Ver todos los proyectos. Se eliminan los botones anidados dentro de enlaces del bloque anterior y se usa jerarquía h2/h3.
- Se reutilizan las tres imágenes WebP existentes (aproximadamente 20–59 KB cada una), con dimensiones intrínsecas verificadas, carga diferida y decodificación asíncrona. No se añade procesamiento de imágenes en esta fase.
- Chrome: 320, 360, 390, 768, 1024 y 1440 px sin desbordamientos del bloque; tres artículos disponibles sin JavaScript, un único h1, enlaces de 44 px y foco visible con Tab. Cuatro destinos locales HTTP 200, tres imágenes cargadas correctamente, renderizado repetible y sin excepciones de ejecución. Capturas de escritorio y móvil revisadas.
- Próximo paso: CTA final y formulario. Los bloques heredados Trabajo y Estudios siguen pendientes de consolidación antes del lanzamiento; los casos conservan sus pendientes de evidencia.
## Paso 11: CTA final y formulario

- Nuevo cierre #contact con el texto de §5.11, CTA Hablemos de tu proyecto, Nombre, Email, Empresa opcional y Proyecto o desafío. WhatsApp existente y acceso directo a Google Forms conservados.
- css/contact-v5.css y js/contact-v5.js sustituyen el bloque heredado y su script inline. IDs únicos, labels asociados, autocomplete, ayudas enlazadas, validación nativa y errores anunciados con foco.
- Se conserva el endpoint y los tres entry IDs existentes. Empresa se incorpora al mensaje mediante el evento formdata; no se inventa un campo de Google Forms. Los datos permanecen en los controles tras el intento.
- Eliminada la confirmación local prematura: el POST abre la respuesta de Google en otra pestaña, con aviso previo. Solo Google puede confirmar la recepción. Sin JavaScript quedan disponibles Google Forms y WhatsApp.
- Captcha compacto para evitar el desbordamiento móvil; se manejan API ausente, widget no listo y verificación vacía. La clave existente no admite localhost: la prueba real deberá hacerse en un dominio autorizado. Esta integración heredada solo comprueba el token en cliente; no implica verificación propia en servidor.
- Chrome: seis anchos de 320 a 1440 px sin desbordamiento en el bloque, cuatro labels correctos, campos por encima de 44 px y un único h1. Probados campos obligatorios, email inválido, empresa en payload, honeypot, fallos de captcha, conservación del formulario y ausencia de falso éxito. Sin excepciones de ejecución; fallback sin JavaScript probado con navegación completa. Capturas escritorio/móvil revisadas.
- No se enviaron datos a Google ni mensajes a WhatsApp. La recepción de extremo a extremo y la configuración de dominio del captcha siguen pendientes antes de publicar. Las pruebas de envío fueron eventos locales sin navegación de red.
- Próximo paso: footer y consolidación de los bloques heredados Trabajo/Estudio, preservando acceso al contenido original.
## Paso 12: Footer y consolidación de la Home

- Footer estático en index.html, con identidad, navegación, trayectoria, perfiles externos y licencia existente. Estilos acotados en css/footer-v5.css. Funciona sin JavaScript y evita footers anidados y enlaces sociales sin nombre accesible.
- La Home deja de cargar js/scripts.js: ya no necesita cargar fragmentos compartidos. footer.html, footerproy.html y el comportamiento de las páginas internas permanecen intactos.
- Se retiran de la Home los bloques heredados Trabajo y Estudio, ya representados por casos y perfil. Proyectos enlaza directamente con Contacto. Se conserva acceso a todos sus destinos: HVAC/Chillit en casos, MEP/tesis/CV en perfil, arquitectura de software en el footer.
- Las anclas históricas #work y #study se conservan en trayectoria y formación respectivamente. No se eliminan páginas, imágenes ni artículos del repositorio.
- Chrome: 320, 360, 390, 768, 1024 y 1440 px sin desbordamiento del footer; enlaces de al menos 44 px; un solo footer y sin IDs duplicados. Todos los enlaces locales de la Home responden HTTP 200 y todas sus anclas existen. Foco visible con Tab y 13 enlaces del footer disponibles sin JavaScript. Capturas de escritorio y móvil revisadas, sin excepciones de ejecución.
- Próximo paso: revisión transversal de responsive y accesibilidad de la Home. Siguen pendientes la evidencia de casos, prueba real de recepción del contacto y las fases de rendimiento/SEO antes del lanzamiento.
## Paso 13: Revisión transversal de responsive y accesibilidad

- Corregidos los enlaces Inicio/Casos/Perfil del menú de escritorio para alcanzar 44 px de ancho mínimo, además de la altura ya existente.
- Corregido el tamaño mínimo de los hijos de la cabecera de Casos. Se permite partir palabras largas cuando sea necesario con overflow-wrap: anywhere en los fundamentos, evitando desbordamientos al ampliar el texto.
- Chrome de escritorio con viewports emulados: 320, 360, 390, 768, 844 (horizontal), 1024, 1440 y 1920 px. La Home completa queda sin scroll horizontal ni controles propios visibles menores de 44 × 44 px. Se excluye el contenido interno del iframe de terceros del análisis DOM.
- Reflow equivalente a ventana de 1280 px al 200 % (640 CSS px) y aumento de fuente raíz al 200 % en 390 px: sin scroll horizontal del documento. Esto no sustituye una prueba manual del zoom nativo en todos los navegadores.
- Teclado: apertura del menú móvil con Enter, recorrido con Tab, Escape cierra y devuelve foco al botón, foco visible y skip link hacia main. La primera simulación de Enter no incluía el carácter de activación; corregido el protocolo de prueba, la activación nativa pasa sin cambios en el JS del menú.
- prefers-reduced-motion: reduce: cero animaciones CSS activas y scroll auto. Sin JavaScript: menú disponible, diez secciones y footer estáticos, alternativas de contacto visibles.
- Inspección del árbol accesible de Chrome: main, contentinfo, navegaciones nombradas y encabezados expuestos. Sin imágenes sin alt ni enlaces/botones propios visibles sin nombre. No equivale a una prueba con lector de pantalla real.
- Contraste calculado de los pares de texto del sistema: #091235/blanco 18,27; #526575/#f7f8fa 5,68; #526575/blanco 6,04; #88a9c3/#091235 7,40; #88a9c3/#14202e 6,67; #f7f8fa/#091235 17,19; #2b4257/blanco 10,40. Todos superan 4,5:1. No es una certificación integral de WCAG.
- Pendientes de validación antes de lanzamiento: dispositivo móvil real, lector de pantalla, zoom nativo y otros navegadores, captcha en dominio autorizado y recepción real del formulario. Evidencia de casos aún pendiente. Próxima fase: rendimiento y SEO de la Home.
## Paso 14: Rendimiento y metadata de la Home

- Se retiran exclusivamente de index.html Bootstrap CSS/JS, Popper, Bootstrap Icons, Animate.css y css/style.css, ya sin componentes consumidores tras la migración de secciones. Los archivos heredados permanecen para las páginas internas.
- Reset mínimo y acotado en foundations.css: box-sizing, márgenes, controles, imágenes y hidden. Ahorro bruto de CSS local dejado de solicitar: 242.816 bytes, además de cuatro dependencias externas (dos CSS y dos JS); no equivale a bytes comprimidos ni a una mejora medida de Core Web Vitals.
- Precarga de Inter Regular WOFF2, manteniendo font-display: swap. Las imágenes de proyectos conservan lazy loading y dimensiones reservadas.
- Canonical y og:url unificados con CNAME: https://lucianocismondi.com.ar/. Social image bajo el mismo dominio, metadatos de sitio/locale/alt, limpieza de keywords/copyright de plantilla y charset inválido. Datos Person en JSON-LD con nombre, URL, posicionamiento y perfiles ya presentes.
- Comprobado en Chrome que no se solicitan los recursos retirados; JSON-LD parseable y URLs de metadata coherentes. La imagen social existente permanece sin rediseñar; falta validar su presentación en plataformas sociales.
- Repetida la revisión de ocho anchos, reflow y texto al 200 %, teclado, modo sin JS y movimiento reducido: sin regresiones detectadas ni excepciones. Captura del Hero de escritorio inspeccionada.
- Pendientes: medición Lighthouse/Core Web Vitals bajo condiciones de publicación, revisión del peso de reCAPTCHA, SEO de páginas internas, sitemap/robots/404 y previews sociales. No se ha publicado ni medido tráfico real. Próximo paso: coherencia SEO e indexación del sitio, preservando las rutas existentes.
## Paso 15: SEO interno e indexación

- Corregidos los canonical de 59 páginas de proyectos, trabajos, estudios, diversión y recursos: cada uno apunta a su ruta existente. og:url y twitter:url coinciden con esa URL; idioma declarado es-AR para los artículos en español y charset sin hreflang inválido.
- Títulos y descripciones sociales sincronizados con la metadata editorial de cada página. Imágenes sociales normalizadas al dominio principal y comprobadas en disco; donde la referencia anterior no existía se reutiliza una imagen del artículo disponible o el recurso social general.
- Validación: 59 cuerpos de documento idénticos a HEAD desde el cierre de head; no se modifica contenido ni diseño de las páginas internas. Todas las URLs canónicas/sociales e imágenes comprobadas, sin errores detectados.
- Sitemap con 60 URLs locales existentes y únicas, sin fechas lastmod inventadas. Regenerar con `node scripts/generate-sitemap.cjs`. Se excluyen fragmentos de navegación/footer y 404.
- robots.txt permite rastreo y anuncia el sitemap del dominio definido por CNAME. links/index.html se conserva sin cambios y fuera del sitemap porque su metadata menciona un subdominio; falta confirmar su destino canónico.
- Nueva 404.html con noindex, recursos absolutos y enlaces a Inicio, Proyectos y Contacto. Probada en Chrome y captura móvil revisada. El servidor local muestra el archivo directamente; la entrega automática con HTTP 404 para rutas inexistentes deberá comprobarse en el hosting antes del lanzamiento.
- Pendientes: revisión editorial de descripciones antiguas, previews sociales reales, política del subdominio links, rastreo público tras publicación y validaciones de rendimiento/contacto/evidencia ya documentadas. No se ha publicado ni enviado el sitemap a buscadores.
## Paso 16: Revisión de lanzamiento

- Informe consolidado en docs/V5_LAUNCH_REVIEW.md con evidencias, límites, pendientes y secuencia de integración/publicación.
- Auditoría adicional de 60 páginas: diez referencias activas rotas reparadas en nueve páginas, conservando textos y destinos equivalentes existentes. La undécima detección inicial pertenecía a HTML comentado. Tras excluir comentarios y repetir: cero href/src locales a archivos inexistentes.
- Resultado de auditoría en docs/V5_LOCAL_LINK_AUDIT.json. Esta fase sí cambia referencias del cuerpo de nueve artículos, a diferencia de la fase previa limitada a metadata.
- Confirmados pendientes de evidencia en ambos casos, recepción real del contacto, medición de conversiones, identidad de Git y validaciones de hosting/dispositivo real. Se solicitan datos de casos y nombre/email mediante preguntas al usuario.
- Rama redesign/v5, cambios locales preparados; no commits nuevos, push, merge ni despliegue. No se declara listo para lanzamiento.
## Evidencia e identidad confirmadas por el propietario

- Casos actualizados con responsabilidad, intervención y resultados cualitativos aportados por Luciano. HVAC incluye gama, fabricación digital, almacén, producción y equipo. Enfriamiento de bebidas incluye prototipo, validación, inversión/mercado e industrialización internacional; expansión posterior se distingue de la etapa de participación. No se publican empresas en los títulos/textos nuevos ni detalles personales del dueño.
- Identidad Git local: lcismondi, cismondil@gmail.com. Rama final solicitada: V5. Sin push ni despliegue.
- Una prueba de Google Forms autorizada obtuvo confirmación explícita de recepción; pendiente comprobación por el propietario. Captcha de la Home aún requiere dominio autorizado.
- links renovado para el subdominio confirmado. Servicios/analítica y configuración externa pendiente documentados en V5_SERVICES.md.