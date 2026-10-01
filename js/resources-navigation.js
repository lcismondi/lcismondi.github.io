/* Resource-page buttons select the existing newsletter option. */
function goToForm(optionValue) {
    document.dispatchEvent(new Event('subscription:open'));
    const form = document.getElementById('contact');
    const select = document.getElementById('tipoInput');
    if (select) select.value = optionValue;
    form?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    select?.focus({preventScroll:true});
}
