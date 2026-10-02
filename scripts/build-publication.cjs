/* Build a fresh, isolated publication folder. Never modifies source files. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const roots = ['index.html', 'privacidad.html', 'cookies.html', '404.html', 'CNAME', 'robots.txt', 'sitemap.xml'];
const folders = ['en', 'trabajos', 'proyectos', 'estudios', 'diversion', 'recursos', 'links', 'css', 'js', 'assets'];
const extensions = new Set(['.html', '.css', '.js', '.webp', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.woff', '.woff2', '.ttf', '.otf', '.pdf']);
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const output = path.join(root, 'dist', 'public-' + stamp);
const files = [...roots];
function collect(dir) {
    for (const entry of fs.readdirSync(path.join(root, dir), {withFileTypes:true})) {
        const rel = path.posix.join(dir, entry.name);
        if (entry.isSymbolicLink()) throw new Error('Unexpected symbolic link: ' + rel);
        if (entry.isDirectory()) collect(rel);
        else if (extensions.has(path.extname(entry.name).toLowerCase()) || /^(license|ofl)(\..*)?$/i.test(entry.name)) files.push(rel);
    }
}
folders.forEach(collect);
const selected = new Set(files);
const errors = [];
function check(ref, source) {
    if (!ref || /^(?:[a-z]+:|\/\/)/i.test(ref)) return;
    const url = new URL(ref, 'https://local/' + source);
    let target = decodeURIComponent(url.pathname).slice(1);
    if (!target || target.endsWith('/')) target += 'index.html';
    if (!selected.has(target)) errors.push(source + ' -> ' + ref);
    else if (url.hash && target.endsWith('.html')) {
        const html = fs.readFileSync(path.join(root, target), 'utf8');
        const id = decodeURIComponent(url.hash.slice(1));
        if (!html.includes('id="' + id + '"') && !html.includes("id='" + id + "'") && !html.includes('name="' + id + '"')) errors.push(source + ' -> missing anchor ' + ref);
    }
}
for (const file of files) {
    if (file.endsWith('.html')) {
        const text = fs.readFileSync(path.join(root, file), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
        for (const m of text.matchAll(/\b(?:src|href|poster)=["']([^"']+)["']/g)) check(m[1], file);
    }
    if (file.endsWith('.css')) {
        const text = fs.readFileSync(path.join(root, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
        for (const m of text.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) check(m[1], file);
    }
}
if (errors.length) throw new Error('Publication references missing:\n' + errors.join('\n'));
fs.mkdirSync(output, {recursive:true});
for (const file of files) {
    const destination = path.join(output, file);
    fs.mkdirSync(path.dirname(destination), {recursive:true});
    fs.copyFileSync(path.join(root, file), destination);
}
fs.writeFileSync(path.join(output, '.nojekyll'), '');
const manifest = {directory:output,files:files.length + 1,pages:files.filter(f=>f.endsWith('.html')).length,bytes:files.reduce((n,f)=>n+fs.statSync(path.join(root,f)).size,0),createdAt:new Date().toISOString()};
fs.writeFileSync(path.join(root,'dist','latest-build.json'), JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify(manifest));