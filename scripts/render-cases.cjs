// Run from any directory: node scripts/render-cases.cjs
// Content is rendered at edit time: no runtime fetch, dependencies or build required to serve.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const cases = JSON.parse(fs.readFileSync(path.join(root, 'content/cases.json'), 'utf8'));
const escape = (text) => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const row = (label, text) => text ? `<div><dt>${escape(label)}</dt><dd>${escape(text)}</dd></div>` : '';
const visual = (item) => item.visual === 'platform' ? `
    <aside class="v5-case-visual v5-case-platform" aria-label="Esquema conceptual del enfoque HVAC">
        <p class="v5-case-visual-label">Enfoque de plataforma</p>
        <div class="v5-case-platform-node">Necesidades del fabricante</div>
        <span class="v5-case-connector" aria-hidden="true">↓</span>
        <div class="v5-case-platform-core">Electrónica y control<span>Configuración · Firmware</span></div>
        <span class="v5-case-connector" aria-hidden="true">↓</span>
        <div class="v5-case-platform-node">Variantes de producto</div>
        <p class="v5-case-visual-note">Reutilización y evolución por software.</p>
    </aside>` : `
    <aside class="v5-case-visual v5-case-publication" aria-label="Publicación de patente">
        <p class="v5-case-visual-label">Propiedad intelectual · ${escape(item.publication.date)}</p>
        <p class="v5-case-document-id">${escape(item.publication.id)}</p>
        <p class="v5-case-document-title">Aparato para el enfriamiento rápido de bebidas envasadas.</p>
        <p class="v5-case-visual-note">Luciano Cismondi figura entre los inventores.</p>
        <a href="${escape(item.publication.href)}" class="v5-text-link">Consultar la publicación <span aria-hidden="true">↗</span></a>
    </aside>`;
const articles = cases.map(item => `
    <article class="v5-case" aria-labelledby="case-${escape(item.slug)}">
        <div class="v5-case-content">
            <p class="v5-case-category">${escape(item.category)}</p>
            <h3 id="case-${escape(item.slug)}">${escape(item.title)}</h3>
            <p class="v5-case-summary">${escape(item.summary)}</p>
            <dl class="v5-case-facts">
                ${row('Contexto',item.context)}
                ${row('Desafío',item.challenge)}
                ${row('Mi responsabilidad',item.role)}
                ${row('Decisión / intervención',item.decision)}
                ${row('Arquitectura',item.architecture)}
                ${row('Objetivo',item.objective)}
                ${row('Resultado',item.result)}
                ${row('Aprendizaje / impacto',item.impact)}
            </dl>
            <a class="v5-text-link v5-case-link" href="${escape(item.href)}">${escape(item.linkLabel)} <span aria-hidden="true">→</span></a>
        </div>
        ${visual(item)}
    </article>`).join('\n');
const section = `    <!-- V5 CASES START -->
    <section class="v5-cases v5-section" id="casos" aria-labelledby="cases-title">
        <div class="v5-container">
            <div class="v5-cases-heading">
                <h2 class="v5-section-title" id="cases-title">Casos seleccionados.</h2>
                <p>Decisiones de producto y tecnología en fabricantes y proyectos de productos físicos.</p>
            </div>
            ${articles}
        </div>
    </section>
    <!-- V5 CASES END -->`;
const file = path.join(root,'index.html');
const html = fs.readFileSync(file,'utf8');
const region = /    <!-- V5 CASES START -->[\s\S]*?    <!-- V5 CASES END -->/;
if (!region.test(html)) throw new Error('Case section markers missing');
fs.writeFileSync(file, html.replace(region, section.replace(/^[ \t]+$/gm, '')));
console.log(`Rendered ${cases.length} cases into index.html`);