# Integración local V5 — 30 de septiembre de 2026

Se conserva V4 sin cambios. La rama local V5 era antecesora de redesign/v5; la integración prevista es fast-forward, conservando todos los commits. Se guarda su estado anterior en codex/v5-before-integration-20260930.

Las ramas remotas consultadas con ls-remote son V1, V2, V3 y V4; no existe aún V5 remota. La consulta pública a la API de Pages respondió 404 y no permite confirmar la configuración. Antes del despliegue hay que comprobar Settings > Pages en GitHub.

El despliegue debe servir únicamente el paquete generado por scripts/build-publication.cjs, no la raíz de V5: la raíz conserva documentación y previews. No se ha configurado despliegue automático ni hecho push o publicación.

Se incorporan los cambios del sitio, sus fuentes, herramientas, documentación de implementación y previews propios. Se mantienen fuera de este commit los archivos de editor del propietario, docs/CHECK_LIST.md y la carpeta de inspiración; se conservan en disco. dist continúa ignorado por ser un resultado generado.