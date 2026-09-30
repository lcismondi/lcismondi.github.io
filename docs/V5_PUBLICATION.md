# Paquete de publicación V5

Generar desde la raíz: `node scripts/build-publication.cjs`.

El generador crea una carpeta nueva `dist/public-<fecha>/` y registra su ruta en `dist/latest-build.json`. No borra ni modifica versiones anteriores. `dist/` está excluido de Git porque contiene copias generadas.

Incluye las 64 páginas públicas, CSS, JavaScript, imágenes, fuentes y sus licencias, CNAME, robots.txt, sitemap.xml y .nojekyll. Conserva las rutas actuales. Una lista explícita de carpetas y extensiones impide copiar documentación, previews, inspiración, fuentes Apps Script, archivos del editor y ZIP de fuentes. Comprueba referencias HTML, anclas y recursos CSS antes de copiar; aborta si faltan destinos.

Para el despliegue se debe utilizar SOLO el contenido de `dist/public-<fecha>/`, no la raíz del repositorio ni la carpeta dist completa. No se ha cambiado la configuración de GitHub Pages. El mecanismo de despliegue y la rama V5 quedan para el siguiente paso.

La exclusión del sitio no vuelve privados los archivos del repositorio: si el repositorio es público, sus archivos versionados siguen siendo visibles allí.

Verificación del 30 de septiembre de 2026: 185 archivos, 64 páginas, 9.513.712 bytes. Comprobadas las 64 páginas desde la carpeta generada a 320, 768 y 1440 px, sin desbordamientos, referencias locales faltantes ni errores de ejecución detectados; servicios externos bloqueados y sin envíos reales. El dominio links sigue pendiente de configuración: incluir links/index.html no configura su subdominio.

La copia es una instantánea: volver a generar después de cualquier cambio del sitio. No se hizo push, merge ni publicación.