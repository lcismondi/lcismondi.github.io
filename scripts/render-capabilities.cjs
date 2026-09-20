// Run from any directory: node scripts/render-capabilities.cjs
// Edit-time rendering keeps the content indexable without runtime JavaScript.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const content = JSON.parse(fs.readFileSync(path.join(root, 'content/capabilities.json'), 'utf8'));
const escape = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const items = content.items.map(item => `                <div class="v5-capability">
                    <dt>${escape(item.title)}</dt>
                    <dd>${escape(item.description)}</dd>
                </div>`).join('\n');
const section = `    <!-- V5 CAPABILITIES START -->
    <section class="v5-capabilities v5-section v5-dark" id="capacidades" aria-labelledby="capabilities-title">
        <div class="v5-container">
            <div class="v5-capabilities-heading">
                <div>
                    <p class="v5-capabilities-eyebrow">Capacidades tecnológicas</p>
                    <h2 class="v5-section-title" id="capabilities-title">${escape(content.title)}</h2>
                </div>
                <p class="v5-capabilities-intro">${escape(content.intro)}</p>
            </div>
            <dl class="v5-capabilities-grid">
${items}
            </dl>
        </div>
    </section>
    <!-- V5 CAPABILITIES END -->`;
const file = path.join(root, 'index.html');
const html = fs.readFileSync(file, 'utf8');
const region = /    <!-- V5 CAPABILITIES START -->[\s\S]*?    <!-- V5 CAPABILITIES END -->/;
if (!region.test(html)) throw new Error('Capabilities section markers missing');
fs.writeFileSync(file, html.replace(region, section));
console.log(`Rendered ${content.items.length} capabilities into index.html`);