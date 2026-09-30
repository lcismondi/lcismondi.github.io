(() => {
    const tools = document.querySelector('.catalog-tools');
    if (!tools) return;
    const search = document.getElementById('project-search');
    const year = document.getElementById('project-year');
    const count = document.getElementById('project-count');
    const empty = document.getElementById('project-empty');
    const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const cards = [...document.querySelectorAll('.catalog-card')].map(node => ({node, text:normalize(node.textContent)}));
    const update = () => {
        const words = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
        let visible = 0;
        for (const {node, text} of cards) {
            node.hidden = !words.every(word => text.includes(word)) || (!!year.value && node.dataset.year !== year.value);
            if (!node.hidden) visible++;
        }
        count.textContent = `${visible} de ${cards.length} proyectos`;
        empty.hidden = visible !== 0;
    };
    search.addEventListener('input', update);
    year.addEventListener('change', update);
    document.getElementById('project-reset').addEventListener('click', () => {
        search.value = ''; year.value = ''; update(); search.focus({preventScroll:true});
    });
    tools.hidden = false; count.hidden = false; update();
})();
