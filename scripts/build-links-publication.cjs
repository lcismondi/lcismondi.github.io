const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const out=path.join(root,'dist','links-'+new Date().toISOString().replace(/[:.]/g,'-'));
const files=['css/immersive.css','css/immersive-shared.css','css/immersive-details.css','assets/profile.png','assets/favicon.ico','assets/socialpreview.webp','assets/fonts/inter/Inter-Regular.woff2','assets/fonts/inter/Inter-SemiBold.woff2','assets/fonts/inter/LICENSE.txt'];
fs.mkdirSync(out,{recursive:true});
for(const file of files){const dest=path.join(out,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(root,file),dest);}
let html=fs.readFileSync(path.join(root,'links/index.html'),'utf8').replaceAll('https://lucianocismondi.com.ar/assets/','https://links.lucianocismondi.com.ar/assets/');
fs.writeFileSync(path.join(out,'index.html'),html);
fs.writeFileSync(path.join(out,'CNAME'),'links.lucianocismondi.com.ar\n');
fs.writeFileSync(path.join(out,'.nojekyll'),'');
fs.writeFileSync(path.join(out,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: https://links.lucianocismondi.com.ar/sitemap.xml\n');
fs.writeFileSync(path.join(out,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://links.lucianocismondi.com.ar/</loc></url></urlset>\n');
fs.writeFileSync(path.join(root,'dist/latest-links.json'),JSON.stringify({directory:out},null,2));
console.log(out);