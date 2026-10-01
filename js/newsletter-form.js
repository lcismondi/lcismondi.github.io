/* Native submission to the existing hidden iframe; no receipt is inferred from its load. */
(() => {
  const form = document.getElementById('newstForm');
  if (!form) return;
  const panel = document.getElementById('form');
  const status = document.getElementById('completion-msg');
  const error = document.getElementById('subscription-error');
  const fields = Array.from(form.elements).filter(el => el.name.startsWith('entry.'));
  let draft = [], pending = false;
  form.action = 'https://docs.google.com/forms/d/e/1FAIpQLSdS7mPrmf57O7zx45MXsvw1tewo9ZWsszo3FXTOKEUnIiddiw/formResponse';
  function open(recover) {
    form.reset();
    if (recover) fields.forEach((el, i) => { el.value = draft[i] || ''; });
    pending = false;
    error.hidden = true;
    status.hidden = true;
    panel.hidden = false;
    try { window.grecaptcha?.reset(); } catch (_) { /* Widget may still be loading. */ }
    fields[0].focus({preventScroll: true});
  }
  document.addEventListener('subscription:open', () => open(false));
  status.querySelector('[data-subscription-retry]').addEventListener('click', () => open(true));
  status.querySelector('[data-subscription-new]').addEventListener('click', () => open(false));
  form.addEventListener('submit', event => {
    if (pending || form.elements.honeypot.value) { event.preventDefault(); return; }
    let token = '';
    try { token = window.grecaptcha?.getResponse() || ''; } catch (_) {}
    if (!token) {
      event.preventDefault(); error.hidden = false;
      error.textContent = 'Completá la verificación antes de enviar. Si no aparece, recargá la página.';
      return;
    }
    error.hidden = true;
    draft = fields.map(el => el.value);
    pending = true;
    setTimeout(() => {
      form.reset(); panel.hidden = true; status.hidden = false;
      status.focus({preventScroll: true});
      status.scrollIntoView({behavior: 'instant', block: 'nearest'});
    }, 0);
  });
})();
