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
## Publicación principal completada — 1 de octubre de 2026

Autorizada expresamente por el propietario. Pages cambiado de legacy/V4 a workflow, conservando dominio y HTTPS. Se añadió V5 a las ramas permitidas del entorno github-pages, manteniendo V4. Flujo ejecutado con publish=true sobre c3d2b4b087a9da581fef6572948242931b1ce28e.

Ejecución: https://github.com/lcismondi/lcismondi.github.io/actions/runs/36845383515 — build y deploy completados correctamente.

Verificación pública: las 64 rutas respondieron 200; 63 documentos coinciden con los archivos locales y /links/index.html redirige al repositorio independiente del subdominio (comportamiento de Pages). HTTP y www redirigen al HTTPS del dominio principal. Sitemap accesible; rutas inexistentes devuelven 404 personalizada. docs/V5_SERVICES.md, previews/inmersiva.html y assets/Inter-4.0.zip devuelven 404.

Chrome en producción: formulario visible con destino vigente e iframe, reCAPTCHA cargado (dos frames), ninguna etiqueta GA antes de elegir ni tras rechazar, preferencias internas abren sin navegar y sin errores de ejecución detectados. No se enviaron consultas ni se resolvió captcha desde la automatización. Pendiente: prueba manual del propietario con captcha y confirmación de hoja/correo; comprobación de recepción de eventos en la cuenta GA. V4 permanece en d43c930 como opción de restauración.