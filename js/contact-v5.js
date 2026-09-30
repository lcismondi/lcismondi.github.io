/* Google Forms owns the receipt confirmation. Never infer success locally. */
(() => {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const error = document.getElementById('contact-error');
    const status = document.getElementById('contact-status');
    const showError = message => {
        error.textContent = message;
        error.hidden = false;
        error.focus();
    };
    form.hidden = false;
    form.addEventListener('submit', event => {
        error.hidden = true;
        status.hidden = true;
        if (form.elements.honeypot.value) {
            event.preventDefault();
            showError('No se pudo continuar. Recargá la página e intentá nuevamente.');
            return;
        }
        if (!window.grecaptcha || typeof window.grecaptcha.getResponse !== 'function') {
            event.preventDefault();
            showError('No se cargó la verificación. Revisá tu conexión y recargá la página para intentarlo de nuevo.');
            return;
        }
        let token = '';
        try { token = window.grecaptcha.getResponse(); } catch { /* Widget not ready. */ }
        if (!token) {
            event.preventDefault();
            showError('Completá la verificación antes de enviar. Si no aparece, recargá la página para volver a intentarlo.');
            return;
        }
        // A native POST into the hidden frame keeps the visitor on this page.
        // Its cross-origin response cannot prove receipt; preserve the fields.
        status.textContent = 'Envío iniciado. Revisá tu correo para confirmar la recepción de tu consulta, incluida la carpeta de spam. Si no recibís la confirmación, podés volver a intentarlo.';
        status.hidden = false;
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