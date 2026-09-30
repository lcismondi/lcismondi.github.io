# Paquete de publicación V5

Generar desde la raíz: `node scripts/build-publication.cjs`.

El generador crea una carpeta nueva `dist/public-<fecha>/` y registra su ruta en `dist/latest-build.json`. No borra ni modifica versiones anteriores. `dist/` está excluido de Git porque contiene copias generadas.

Incluye las 64 páginas públicas, CSS, JavaScript, imágenes, fuentes y sus licencias, CNAME, robots.txt, sitemap.xml y .nojekyll. Conserva las rutas actuales. Una lista explícita de carpetas y extensiones impide copiar documentación, previews, inspiración, fuentes Apps Script, archivos del editor y ZIP de fuentes. Comprueba referencias HTML, anclas y recursos CSS antes de copiar; aborta si faltan destinos.

Para el despliegue se debe utilizar SOLO el contenido de `dist/public-<fecha>/`, no la raíz del repositorio ni la carpeta dist completa. No se ha cambiado la configuración de GitHub Pages. El mecanismo de despliegue y la rama V5 quedan para el siguiente paso.

La exclusión del sitio no vuelve privados los archivos del repositorio: si el repositorio es público, sus archivos versionados siguen siendo visibles allí.

Verificación del 30 de septiembre de 2026: 185 archivos, 64 páginas, 9.513.712 bytes. Comprobadas las 64 páginas desde la carpeta generada a 320, 768 y 1440 px, sin desbordamientos, referencias locales faltantes ni errores de ejecución detectados; servicios externos bloqueados y sin envíos reales. El dominio links sigue pendiente de configuración: incluir links/index.html no configura su subdominio.

La copia es una instantánea: volver a generar después de cualquier cambio del sitio. No se hizo push, merge ni publicación.
## Flujo manual preparado

`.github/workflows/pages-v5.yml` solo tiene `workflow_dispatch`: no se ejecuta al subir commits. Solo permite trabajar desde la rama V5. La opción `publish` está desmarcada por defecto: genera, valida y guarda el paquete sin desplegar. El trabajo de despliegue depende del éxito del empaquetado y requiere marcar esa opción. No usa la raíz del repositorio como artefacto.

Configuración confirmada por captura del propietario: Pages publica V4 desde / (root), dominio lucianocismondi.com.ar, DNS correcto y Enforce HTTPS activado. No se cambió esta configuración.

Pasos futuros, cuando se acuerde publicar:
1. Subir V5 y asegurar que el workflow exista en la rama predeterminada del repositorio para que aparezca Run workflow. Una opción es establecer V5 como predeterminada después de subirla; esto es distinto de cambiar la fuente de Pages. No modificar el código de V4 para introducir el workflow.
2. Ejecutar el flujo desde V5 con `publish` desmarcado y revisar el resultado de preparación.
3. Cambiar Settings > Pages > Source a GitHub Actions, conservando dominio y HTTPS. Revisar que el entorno github-pages permita despliegues desde V5.
4. Ejecutar manualmente desde V5, esta vez marcando `publish`. Este paso sí reemplaza el sitio público.
5. Verificar dominio, HTTPS, rutas, 404 y servicios. Para volver a la versión anterior, restablecer Deploy from a branch, V4, / (root).

El workflow fue preparado localmente: no se subió ni ejecutó en GitHub. La prueba local del generador no sustituye una ejecución real de Actions.

Referencia: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages