/* Updates data-backed fragments while preserving the approved immersive layout. */
const fs = require('node:fs');
const path = require('node:path');
module.exports = function renderImmersive(kind) {
    const root = path.join(__dirname, '..');
    const file = path.join(root, 'index.html');
    let html = fs.readFileSync(file, 'utf8');
    const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const read = name => JSON.parse(fs.readFileSync(path.join(root, 'content', name + '.json'), 'utf8'));
    if (kind === 'cases') {
        const cases = read('cases');
        let index = 0;
        html = html.replace(/<details class="case-evidence">[\s\S]*?<\/details>/g, () => {
            const item = cases[index++];
            if (!item) throw new Error('Missing case data');
            const fields = [['Contexto','context'],['Desafío','challenge'],['Mi responsabilidad','role'],['Intervención','decision'],['Arquitectura','architecture'],['Resultado','result'],['Aprendizaje e impacto','impact']];
            return '<details class="case-evidence"><summary>Responsabilidad, decisiones y resultados</summary><dl>' + fields.map(([label,key])=>'<div><dt>'+label+'</dt><dd>'+esc(item[key])+'</dd></div>').join('') + '</dl></details>';
        });
        if (index !== cases.length) throw new Error('Case count mismatch');
    } else if (kind === 'capabilities') {
        const content = read('capabilities');
        const pattern = /(<section class="capabilities wrap"[^>]*>[\s\S]*?<dl>)[\s\S]*?(<\/dl>)/;
        if (!pattern.test(html)) throw new Error('Capabilities section missing');
        html = html.replace(pattern, (_,start,end)=>start + content.items.map(item=>'<div><dt>'+esc(item.title)+'</dt><dd>'+esc(item.description)+'</dd></div>').join('')+end);
    } else if (kind === 'projects') {
        const content = read('projects');
        const pattern = /(<section class="lab wrap" id="proyectos">[\s\S]*?<div class="project-grid">)[\s\S]*?(<\/div><\/section>)/;
        if (!pattern.test(html)) throw new Error('Projects section missing');
        html = html.replace(pattern, (_,start,end)=>start+content.items.map(item=>'<a href="'+esc(item.href)+'"><img src="/'+esc(item.image.src.replace(/^\//,''))+'" alt="'+esc(item.image.alt)+'" loading="lazy"><div><span>'+esc(item.category)+'</span><h3>'+esc(item.title.toUpperCase())+' ↗</h3><p>'+esc(item.homeSummary || item.summary)+'</p></div></a>').join('')+end);
    } else throw new Error('Unknown section: '+kind);
    fs.writeFileSync(file, html);
    console.log('Rendered immersive '+kind);
};
