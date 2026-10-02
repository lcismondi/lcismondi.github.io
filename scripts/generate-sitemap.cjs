// Run: node scripts/generate-sitemap.cjs
// Preserve existing article routes; links/ is published independently and has its own sitemap.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const origin = 'https://lucianocismondi.com.ar';
const directories = ['proyectos', 'trabajos', 'estudios', 'diversion', 'recursos'];
const pages = ['index.html', 'privacidad.html', 'cookies.html', 'en/index.html', ...directories.flatMap(dir => fs.readdirSync(path.join(root, dir)).filter(file => file.endsWith('.html')).map(file => `${dir}/${file}`))];
const urls = pages.filter(file => !/<meta[^>]+content="[^"]*noindex/i.test(fs.readFileSync(path.join(root, file), 'utf8'))).map(file => `${origin}/${file === 'index.html' ? '' : file === 'en/index.html' ? 'en/' : file}`);
const escape = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
fs.writeFileSync(path.join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${escape(url)}</loc></url>`).join('\n')}\n</urlset>\n`);
console.log(`Sitemap: ${urls.length} URLs`);