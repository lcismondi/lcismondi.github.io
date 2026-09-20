// Inline navigation remains usable without JavaScript. Enhance only the V5 Home.
(() => {
    const nav = document.querySelector('[data-v5-navigation]');
    if (!nav) return;
    const toggle = nav.querySelector('.v5-menu-toggle');
    const menu = nav.querySelector('#v5-menu');
    const label = toggle.querySelector('[data-menu-label]');
    const desktop = window.matchMedia('(min-width: 1024px)');
    const setOpen = (open) => {
        toggle.setAttribute('aria-expanded', String(open));
        label.textContent = open ? 'Cerrar' : 'Menú';
        menu.classList.toggle('is-open', open);
    };
    toggle.hidden = false;
    nav.classList.add('is-enhanced');
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !desktop.matches && toggle.getAttribute('aria-expanded') === 'true') {
            setOpen(false);
            toggle.focus();
        }
    });
    menu.addEventListener('click', (event) => {
        const link = event.target.closest('a');
        if (!link || desktop.matches) return;
        setOpen(false);
        // Move focus to the destination rather than leaving it in a hidden menu.
        if (link.hash && link.pathname === window.location.pathname) {
            const target = document.getElementById(link.hash.slice(1));
            if (target) {
                if (!target.hasAttribute('tabindex')) {
                    target.setAttribute('tabindex', '-1');
                    target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
                }
                target.focus({ preventScroll: true });
            }
        }
    });
    document.addEventListener('click', (event) => {
        if (!nav.contains(event.target)) {
            if (menu.contains(document.activeElement) && !desktop.matches) toggle.focus();
            setOpen(false);
        }
    });
    nav.addEventListener('focusout', () => {
        requestAnimationFrame(() => { if (!nav.contains(document.activeElement)) setOpen(false); });
    });
    desktop.addEventListener('change', () => {
        if (desktop.matches && document.activeElement === toggle) nav.querySelector('.v5-brand').focus();
        if (!desktop.matches && menu.contains(document.activeElement)) toggle.focus();
        setOpen(false);
    });
})();