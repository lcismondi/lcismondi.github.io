/* GA4 basic opt-in: no Google tag is loaded before acceptance. */
(() => {
    const id = 'G-GVEJ50Y14T';
    const key = 'v5-analytics-choice';
    const preferencesOnly = document.currentScript?.hasAttribute('data-preferences-only');
    const settings = document.getElementById('analytics-settings');
    if (!settings) return;
    let panel = document.getElementById('analytics-choice');
    if (!panel) {
        document.body.insertAdjacentHTML('beforeend', "<section id=\"analytics-choice\" class=\"v5-analytics-panel\" aria-labelledby=\"analytics-title\" hidden>\n        <h2 id=\"analytics-title\">Tu elección sobre las cookies</h2>\n        <p>Luciano Cismondi utiliza cookies de Google Analytics para conocer las visitas y mejorar esta web. Solo se activan si aceptas.</p>\n        <div class=\"v5-analytics-actions\">\n            <button type=\"button\" class=\"v5-button\" data-analytics-accept>Aceptar</button>\n            <button type=\"button\" class=\"v5-button\" data-analytics-reject>Rechazar</button>\n        </div>\n        <p class=\"v5-analytics-note\"><a href=\"/cookies.html\">Información sobre cookies</a> · <a href=\"/privacidad.html\">Privacidad</a>. Puedes cambiar tu elección al pie de la página.</p>\n    </section>");
        panel = document.getElementById('analytics-choice');
    }
    const live = !preferencesOnly && ['lucianocismondi.com.ar', 'www.lucianocismondi.com.ar'].includes(location.hostname);
    let accepted = false;
    let started = false;
    let previousFocus;
    let choice;
    try { choice = JSON.parse(localStorage.getItem(key)); } catch { /* Storage can be unavailable. */ }
    const valid = choice && Date.now() - choice.at < 180 * 86400000;
    const track = (event, params = {}) => {
        if (accepted && live && started) window.gtag('event', event, params);
    };
    const start = () => {
        if (!live || started) return;
        started = true;
        window['ga-disable-' + id] = false;
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('consent', 'default', {analytics_storage:'granted', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied'});
        window.gtag('js', new Date());
        // Do not forward query strings, form values or hash fragments.
        window.gtag('config', id, {send_page_view:false, allow_google_signals:false, allow_ad_personalization_signals:false, page_location:location.origin + location.pathname});
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
        document.head.append(script);
        track('page_view', {page_location:location.origin + location.pathname, page_title:document.title});
    };
    const clearCookies = () => {
        for (const cookie of document.cookie.split(';')) {
            const name = cookie.split('=')[0].trim();
            if (name === '_ga' || name.startsWith('_ga_')) {
                for (const domain of ['', location.hostname, '.lucianocismondi.com.ar']) {
                    document.cookie = name + '=; Max-Age=0; Path=/; SameSite=Lax' + (domain ? '; Domain=' + domain : '');
                }
            }
        }
    };
    const choose = value => {
        accepted = value === 'accepted';
        try { localStorage.setItem(key, JSON.stringify({value, at:Date.now()})); } catch { /* Applies for this page anyway. */ }
        panel.hidden = true;
        if (accepted) {
            window['ga-disable-' + id] = false;
            if (started) window.gtag('consent', 'update', {analytics_storage:'granted'});
            else start();
        } else {
            window['ga-disable-' + id] = true;
            if (started) window.gtag('consent', 'update', {analytics_storage:'denied'});
            clearCookies();
        }
        (previousFocus || settings).focus({preventScroll:true});
    };
    settings.hidden = false;
    panel.hidden = preferencesOnly || !!valid;
    if (valid && choice.value === 'accepted') { accepted = true; start(); }
    const openSettings = () => {
        previousFocus = settings;
        panel.hidden = false;
        panel.querySelector('button').focus({preventScroll:true});
    };
    const openLinkedSettings = () => {
        if (location.hash === '#analytics-settings') openSettings();
    };
    settings.addEventListener('click', openSettings);
    window.addEventListener('hashchange', openLinkedSettings);
    window.addEventListener('pageshow', event => {
        if (event.persisted) openLinkedSettings();
    });
    openLinkedSettings();
    panel.querySelector('[data-analytics-accept]').addEventListener('click', () => choose('accepted'));
    panel.querySelector('[data-analytics-reject]').addEventListener('click', () => choose('rejected'));
    document.addEventListener('click', event => {
        const link = event.target.closest('a');
        if (!link) return;
        if (['#contact', '#contacto', '#formulario'].includes(link.hash) && link.origin === location.origin) track('primary_cta_click', {section:link.closest('section')?.id || 'navigation'});
        if (link.closest('#casos')) track('case_click', {case_id:link.closest('article')?.getAttribute('aria-labelledby') || 'cases'});
    });
    let contactStarted = false;
    document.getElementById('contactForm')?.addEventListener('input', () => {
        if (accepted && !contactStarted) { contactStarted = true; track('contact_start'); }
    });
    // Receipt is confirmed by Google Forms, not by a click or submit event here.
})();