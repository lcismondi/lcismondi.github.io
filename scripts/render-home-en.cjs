/* Regenerate the English Home from the Spanish layout and reviewed translations.
   Review new Spanish content and update the dictionary before regenerating. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const translations = JSON.parse(fs.readFileSync(path.join(root, 'content/home-en-translations.json'), 'utf8'));
let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
html = html.replace(new RegExp(Object.keys(translations).sort((a,b)=>b.length-a.length).map(escape).join('|'), 'g'), text=>translations[text]);
html = html.replace('lang="es-AR"', 'lang="en"').replace('content="es_AR"', 'content="en_US"')
 .replaceAll('href="assets/', 'href="/assets/').replace('api.js"', 'api.js?hl=en"')
 .replace(/(<link rel="canonical" href="|<meta (?:property="(?:og:url|twitter:url)"|name="twitter:url") content=")https:\/\/lucianocismondi.com.ar\//g, '$1https://lucianocismondi.com.ar/en/')
 .replace('"url":"https://lucianocismondi.com.ar/"', '"url":"https://lucianocismondi.com.ar/en/"')
 .replace('<a class="brand" href="/">', '<a class="brand" href="/en/">')
 .replace('aria-label="Idioma"', 'aria-label="Language"')
 .replace('lang="es" hreflang="es" aria-current="page"', 'lang="es" hreflang="es"')
 .replace('lang="en" hreflang="en">EN', 'lang="en" hreflang="en" aria-current="page">EN');
for (const project of ['DIGIT','AIRBIT','FMART']) html=html.replace(project+' ↗',project+' (ES) ↗');
// Mark Spanish destination links, including images, for assistive technology.
html=html.replace(/<a\b([^>]*href="\/(?:trabajos|estudios|proyectos|recursos|privacidad|cookies)[^"]*"[^>]*)>/g,'<a$1 hreflang="es">');
fs.mkdirSync(path.join(root,'en'),{recursive:true});
fs.writeFileSync(path.join(root,'en/index.html'), html);
console.log('English Home generated.');
