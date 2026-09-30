# Adopción del diseño inmersivo — 27 de septiembre de 2026

La Inmersiva V02 aprobada es ahora la Home oficial en `index.html`. Se conservan las dos franjas claras (proceso y formulario), las cinco etapas, las capacidades y los casos ampliados. Las pruebas de diseño permanecen en `previews/` como referencias; las páginas oficiales no dependen de esa carpeta.

## Sistema compartido

- `css/immersive.css`: tipografía, colores y componentes de la propuesta aprobada.
- `css/immersive-home.css`: secciones ampliadas y franjas claras.
- `css/immersive-shared.css`: navegación, footer, preferencias de analítica y movimiento reducido.
- `css/immersive-case.css`: cabeceras y lectura de casos.
- `css/immersive-legacy.css`: adaptación de las páginas anteriores conservando su contenido y la cuadrícula Bootstrap local donde sigue siendo necesaria.
- `css/immersive-legal.css`: presentación de privacidad, cookies y 404.

Se adaptaron 59 páginas de trabajos, proyectos, estudios, recursos y contenido personal, además de la Home, privacidad, cookies, 404 y enlaces. Las tarjetas relacionadas usan imágenes grandes y el lenguaje de la Home. La navegación principal y el footer son estáticos y no requieren la carga de `navproy.html` o `footerproy.html` mediante JavaScript. El catálogo usa CSS Grid en lugar de Masonry.

## Conservación y mantenimiento

Las URLs, metadatos y fechas de los artículos se mantienen. La comparación de párrafos y assets no detectó pérdida de contenido en las páginas individuales adaptadas; HVAC utiliza la presentación inmersiva previamente aprobada, con un CTA general. La Home utiliza la síntesis de contenido aprobada en V02.

Los scripts `render-cases.cjs`, `render-capabilities.cjs` y `render-projects.cjs` siguen funcionando, delegando en `render-immersive.cjs` para la nueva plantilla. Se comprobó que dos ejecuciones consecutivas producen exactamente el mismo HTML. Los textos breves de los proyectos de la Home están en `homeSummary` en `content/projects.json`.

Se preservaron los destinos y nombres de campos de los formularios. Las preferencias siguen siendo opt-in y Analytics solo se carga en los dominios autorizados. Se conservaron los anclajes anteriores `#home`, `#projects`, `#contact` y `#main-content`.

## Verificación local

- 64 páginas: un único h1, sin enlaces hacia previews y sin desbordamiento horizontal en 320, 768 y 1440 px.
- Comparación de referencias locales antes/después: sin referencias rotas nuevas.
- Inspección visual de Home, HVAC, Digit, ForceBoard, tarjetas relacionadas y formularios.
- Preferencias: rechazar, reabrir y aceptar funcionan; ningún tag de GA se carga en localhost.
- Formulario de contacto visible con JS; enlaces alternativos conservados.
- Servicios externos bloqueados durante la revisión automatizada. No se enviaron consultas ni suscripciones. Esta comprobación no sustituye la prueba del captcha y de recepción en el dominio final.

Los cambios continúan en la rama local `redesign/v5`; no se hizo merge, push ni publicación. La rama final V5 y la publicación siguen pendientes. Privacidad mantiene el domicilio de ejemplo y los avisos de borrador existentes. Se conserva como pendiente posterior a publicar el rediseño de la confirmación del newsletter.

## Revisión de páginas pendientes — 27 de septiembre de 2026

La segunda pasada detectó que 50 páginas usaban títulos h5 en sus listas de relacionados y habían quedado fuera de la primera conversión. Se convirtieron sus 150 tarjetas al mismo componente visual, manteniendo destinos, imágenes, textos y fechas. Ya no quedan listas antiguas en las secciones `#blog`.

Se completaron también:
- Catálogo de proyectos: imágenes proporcionadas, títulos jerarquizados y fechas originales separadas.
- Tablas de proyectos y contenido personal: superficies azules y desplazamiento horizontal local accesible en móvil.
- Enlaces que antes solo tenían iconos: flechas visibles y nombres accesibles.
- Recursos: tarjetas delimitadas, corrección del texto oscuro sobre fondos oscuros, formulario claro y etiquetas asociadas a controles con IDs únicos. Los nombres de campos, destino y scripts de envío se conservaron.
- Enlaces y error 404: composición inmersiva completa.

El acabado se concentra en `css/immersive-details.css`. Verificados nuevamente los 64 documentos en 320, 768 y 1440 px: sin desbordamiento de página, recursos locales faltantes ni errores de ejecución en el entorno de revisión. Los servicios externos se bloquearon y no se realizaron envíos. La comparación de contenido preserva textos e imágenes; el catálogo solo separa título y fecha antes unidos por una barra vertical. La copia `previews/home-inicial.html` se mantiene sin cambios.
