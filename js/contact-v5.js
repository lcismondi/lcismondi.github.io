/* Google Forms owns the receipt confirmation. Never infer success locally. */
(() => {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const error = document.getElementById('contact-error');
    const showError = message => {
        error.textContent = message;
        error.hidden = false;
        error.focus();
    };
    form.hidden = false;
    form.addEventListener('submit', event => {
        error.hidden = true;
        if (form.elements.honeypot.value) {
            event.preventDefault();
            showError('No se pudo continuar. Puedes utilizar el formulario de Google.');
            return;
        }
        if (!window.grecaptcha || typeof window.grecaptcha.getResponse !== 'function') {
            event.preventDefault();
            showError('No se ha cargado la verificación. Inténtalo de nuevo o abre el formulario directamente en Google.');
            return;
        }
        let token = '';
        try { token = window.grecaptcha.getResponse(); } catch { /* Widget not ready. */ }
        if (!token) {
            event.preventDefault();
            showError('Completa la verificación antes de enviar. Si no está disponible, abre el formulario directamente en Google.');
        }
    });
    form.addEventListener('formdata', event => {
        // The existing Google Form has three fields. Preserve its entry IDs and
        // include optional company context in the message without changing the UI.
        const data = event.formData;
        const company = String(data.get('company') || '').trim();
        if (company) data.set('entry.1797313582', `Empresa: ${company}\n\n${data.get('entry.1797313582')}`);
        data.delete('company');
        data.delete('honeypot');
    });
})();