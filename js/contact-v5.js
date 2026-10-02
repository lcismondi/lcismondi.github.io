/* Native Google Forms POST: receipt is confirmed by email, not by iframe load. */
(() => {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const english = document.documentElement.lang.startsWith('en');
    const error = document.getElementById('contact-error');
    const oldStatus = document.getElementById('contact-status');
    const status = document.createElement('section');
    status.id = 'contact-status';
    status.className = 'contact-feedback';
    status.hidden = true;
    status.tabIndex = -1;
    status.setAttribute('aria-labelledby', 'contact-feedback-title');
    status.innerHTML = english ? '<h3 id="contact-feedback-title">Submission started</h3><p role="status">Check your email: you will receive a confirmation once your enquiry is processed. If it does not arrive, check spam or try again.</p><div class="contact-feedback-actions"><button type="button" data-contact-new>Write another enquiry</button><button type="button" data-contact-retry>Recover your enquiry to try again</button></div>' : '<h3 id="contact-feedback-title">Envío iniciado</h3><p role="status">Revisá tu correo: recibirás una confirmación cuando se procese la consulta. Si no aparece, revisá spam o reintentá el envío.</p><div class="contact-feedback-actions"><button type="button" data-contact-new>Escribir otra consulta</button><button type="button" data-contact-retry>Recuperar consulta para reintentar</button></div>';
    oldStatus?.remove();
    form.after(status);
    const fields = ['entry.2024450423', 'entry.172661864', 'company', 'entry.1797313582'];
    let draft;
    let submitting = false;
    const showError = message => {
        error.textContent = message;
        error.hidden = false;
        error.focus();
    };
    const restart = recover => {
        form.reset();
        if (recover && draft) fields.forEach(name => { form.elements[name].value = draft[name]; });
        if (!recover) draft = null;
        submitting = false;
        status.hidden = true;
        error.hidden = true;
        form.hidden = false;
        try { window.grecaptcha?.reset(); } catch { /* Widget may be unavailable. */ }
        form.elements[fields[0]].focus();
    };
    status.querySelector('[data-contact-new]').addEventListener('click', () => restart(false));
    status.querySelector('[data-contact-retry]').addEventListener('click', () => restart(true));
    form.hidden = false;
    form.addEventListener('submit', event => {
        if (submitting) { event.preventDefault(); return; }
        error.hidden = true;
        if (form.elements.honeypot.value) {
            event.preventDefault();
            showError(english ? 'Unable to continue. Reload the page and try again.' : 'No se pudo continuar. Recargá la página e intentá nuevamente.');
            return;
        }
        if (!window.grecaptcha || typeof window.grecaptcha.getResponse !== 'function') {
            event.preventDefault();
            showError(english ? 'Verification did not load. Check your connection and reload the page to try again.' : 'No se cargó la verificación. Revisá tu conexión y recargá la página para intentarlo de nuevo.');
            return;
        }
        let token = '';
        try { token = window.grecaptcha.getResponse(); } catch { /* Widget not ready. */ }
        if (!token) {
            event.preventDefault();
            showError(english ? 'Complete the verification before submitting. If it does not appear, reload the page to try again.' : 'Completá la verificación antes de enviar. Si no aparece, recargá la página para volver a intentarlo.');
            return;
        }
        draft = Object.fromEntries(fields.map(name => [name, form.elements[name].value]));
        submitting = true;
    });
    form.addEventListener('formdata', event => {
        const data = event.formData;
        const company = String(data.get('company') || '').trim();
        if (company) data.set('entry.1797313582', `${english ? 'Company' : 'Empresa'}: ${company}\n\n${data.get('entry.1797313582')}`);
        data.delete('company');
        data.delete('honeypot');
        if (!submitting) return;
        // Reset only after the browser has captured the native POST payload.
        // Keep a recoverable draft in memory; neither onload nor this state proves receipt.
        setTimeout(() => {
            form.reset();
            form.hidden = true;
            status.hidden = false;
            status.focus({preventScroll:true});
            status.scrollIntoView({behavior:'auto', block:'nearest'});
        }, 0);
    });
})();