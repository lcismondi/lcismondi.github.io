# Actualización posterior a la revisión

Los datos de los casos y la identidad Git ya fueron proporcionados. Los casos están actualizados y la prueba directa de Google Forms recibió confirmación del servidor; falta confirmar su aparición en las respuestas y probar el captcha en dominio autorizado. El subdominio links se mantiene por decisión del propietario. Ver V5_SERVICES.md. La revisión original que sigue conserva el contexto de los pendientes previos.

# V5 — revisión previa al lanzamiento

Estado: preparada para revisión local, todavía no lista para publicar.

## Implementado y verificado localmente

- Home completa con narrativa V5, contacto y footer; contenido estático de casos, capacidades y proyectos.
- Responsive emulado de 320 a 1920 px, teclado, texto ampliado, contraste de tokens y movimiento reducido. Límites de estas pruebas documentados en V5_DEVELOPMENT.md.
- Metadata de Home y 59 páginas internas, sitemap de 60 URLs, robots y 404.
- Auditoría de referencias href/src locales de 60 páginas: cero destinos inexistentes tras reparar diez referencias heredadas en nueve páginas. Se excluyen comentarios HTML. No comprueba enlaces externos ni fragmentos de páginas internas. Resultado: V5_LOCAL_LINK_AUDIT.json.
- Bibliotecas innecesarias retiradas de la Home; sin medición de Core Web Vitals de producción todavía.

## Pendientes para autorizar el lanzamiento

| Área | Qué falta | Criterio de cierre |
|---|---|---|
| HVAC | Responsabilidad concreta, resultado y aprendizaje/impacto | Contenido confirmado por Luciano y reflejado en content/cases.json |
| Chillit | Etapa alcanzada, hito y aprendizaje/impacto | Confirmación del alcance; no confundir patente con industrialización o ventas |
| Contacto | Prueba real en dominio autorizado para captcha | Envío recibido y campos correctos; prueba coordinada, sin mensajes automáticos no autorizados |
| Medición | Elegir e implementar analítica y eventos | page_view, interacción, contacto y atribución verificables; contact_submit debe representar recepción confirmada, no clic. El envío actual a Google no permite afirmarlo desde la Home |
| Git | Nombre/email de autor y commits | Identidad local indicada por el usuario, diff revisado y commits creados |
| Publicación | Confirmar rama de despliegue y destino V5 | Preparar integración sin alterar V4; no asumir que crear V5 activa el hosting |
| Accesibilidad | Dispositivo real, lector de pantalla, zoom nativo y otros navegadores | Recorridos de navegación/contacto verificados |
| Rendimiento | Medir con condiciones representativas | Evaluar LCP, CLS e INP; no convertir pruebas locales en promesas de rendimiento real |
| Hosting/SEO | 404 real, HTTPS, previews sociales, sitemap público | Comprobar respuestas y recursos del despliegue candidato |
| Contenido | Revisión editorial final | Coherencia lingüística y de posicionamiento en las rutas prioritarias |

## Decisiones pendientes

- links/index.html menciona un subdominio distinto; confirmar URL canónica antes de incorporarlo al sitemap.
- La imagen social de Home es la existente: revisar mensaje y recorte al compartir.
- No se ha añadido movimiento de entrada: se mantiene la narrativa estática conforme a la prioridad de claridad del documento.

## Estado de Git

Rama de trabajo: redesign/v5. Base: V4, d43c930. Cambios preparados en el índice, sin commits del rediseño porque falta identidad de autor. No se ha hecho push, merge ni despliegue.

Cambios del usuario preservados fuera del índice: WEBSITE_REDESIGN.md, web V5.code-workspace y eliminación de web V4.code-workspace. Decidir su inclusión al preparar los commits; el documento estratégico debe acompañar la versión final.

## Secuencia de cierre

1. Completar evidencia de casos e identidad Git.
2. Resolver medición y validar contacto con una prueba coordinada.
3. Revisar candidato en móvil real, accesibilidad, rendimiento y contenido.
4. Crear commits e integrar en V5 según el flujo acordado, conservando V4.
5. Revisar despliegue concreto y autorizar publicación; comprobar después 404, URLs, formulario y medición.