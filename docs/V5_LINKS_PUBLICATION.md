# Sitio independiente de enlaces

Repositorio: https://github.com/lcismondi/links
Dominio: https://links.lucianocismondi.com.ar/

Creado el 1 de octubre de 2026 con autorización del propietario. Pages sirve main desde / (root), con dominio configurado y HTTPS obligatorio. La API confirmó build=built y certificado aprobado. La primera comprobación HTTPS externa todavía recibió un certificado distinto durante el aprovisionamiento; volver a comprobar la propagación antes de dar por terminada esa validación.

La fuente editable de la página sigue en links/index.html del proyecto V5. `node scripts/build-links-publication.cjs` crea un paquete independiente dentro de dist y registra su ruta en dist/latest-links.json; incluye la página, tres hojas CSS, dos fuentes con licencia, imágenes, CNAME, sitemap y robots. No añade medición ni formularios. Enlaces hacia el sitio principal apuntan al dominio principal y sus secciones V5 estarán disponibles al publicarlo.

Para futuras actualizaciones, generar el paquete, comparar y copiar los archivos públicos a un checkout del repositorio links; revisar el diff, guardar y subir a main. Un push a main de links sí publica este subdominio. Nunca copiar .git de un paquete o reemplazar el repositorio completo.

La publicación de links no modifica V4 ni publica la Home V5. Se verificó la página independiente a 320, 768 y 1440 px sin desbordamientos, recursos locales faltantes o errores de ejecución detectados.