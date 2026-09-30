(() => {
const nav=document.querySelector('.nav'),toggle=nav.querySelector('.menu-toggle'),menu=nav.querySelector('nav');
toggle.hidden=false;nav.classList.add('is-enhanced');
const close=()=>{toggle.setAttribute('aria-expanded','false');menu.classList.remove('is-open')};
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));menu.classList.toggle('is-open',open)});
nav.addEventListener('keydown',e=>{if(e.key==='Escape'){close();toggle.focus()}});
menu.addEventListener('click',e=>{if(e.target.closest('a'))close()});
document.addEventListener('click',e=>{if(!nav.contains(e.target))close()});
if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.08});
document.querySelectorAll('.feature,.profile,.project-grid,.case-reading article h2').forEach(el=>{if(el.getBoundingClientRect().top>innerHeight){el.classList.add('reveal-ready');observer.observe(el)}});
})();