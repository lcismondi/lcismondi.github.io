// Run from any directory: node scripts/render-projects.cjs
// Render at edit time; the published page needs no content fetch or build runtime.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const content = JSON.parse(fs.readFileSync(path.join(root, 'content/projects.json'), 'utf8'));
const escape = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const articles = content.items.map((item, index) => `            <article class="v5-lab-project${index === 0 ? ' v5-lab-featured' : ''}" aria-labelledby="lab-${escape(item.slug)}">
                <div class="v5-lab-copy">
                    <p class="v5-lab-category">${escape(item.category)}</p>
                    <h3 id="lab-${escape(item.slug)}">${escape(item.title)}</h3>
                    <p class="v5-lab-summary">${escape(item.summary)}</p>
${item.question ? `                    <p class="v5-lab-question">${escape(item.question)}</p>\n` : ''}                    <a class="v5-text-link" href="${escape(item.href)}">Explorar ${escape(item.title)} <span aria-hidden="true">→</span></a>
                </div>
                <img src="${escape(item.image.src)}" alt="${escape(item.image.alt)}" width="${item.image.width}" height="${item.image.height}" loading="lazy" decoding="async" />
            </article>`).join('\n');
const section = `    <!-- V5 PROJECTS START -->
    <section class="v5-lab v5-section" id="projects" aria-labelledby="lab-title">
        <div class="v5-container">
            <div class="v5-section-header">
                <p class="v5-lab-eyebrow">Proyectos experimentales</p>
                <h2 class="v5-section-title" id="lab-title">${escape(content.title)}</h2>
                <p class="v5-lab-intro">${escape(content.intro)}</p>
            </div>
            <div class="v5-lab-grid">
${articles}
            </div>
            <div class="v5-lab-footer"><a class="v5-text-link" href="/proyectos/proyectos.html">Ver todos los proyectos <span aria-hidden="true">→</span></a></div>
        </div>
    </section>
    <!-- V5 PROJECTS END -->`;
const file = path.join(root, 'index.html');
const html = fs.readFileSync(file, 'utf8');
if (html.includes('/css/immersive-home.css')) { require('./render-immersive.cjs')('projects'); return; }
const region = /    <!-- V5 PROJECTS START -->[\s\S]*?    <!-- V5 PROJECTS END -->/;
if (!region.test(html)) throw new Error('Project section markers missing');
fs.writeFileSync(file, html.replace(region, section));
console.log(`Rendered ${content.items.length} projects into index.html`);