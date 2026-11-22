document.querySelectorAll('.mobile-toggle').forEach(b=>b.addEventListener('click',()=>{const n=document.getElementById('primary-navigation');const open=n.classList.toggle('open');b.setAttribute('aria-expanded',String(open))}));

// V7 motion preview: progressive enhancement; content remains visible without JS.
(function(){
  if(!document.querySelector('.motion-home')) return;
  if(!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const elements=document.querySelectorAll('.motion-home .pillars .pillar, .motion-home .statement, .motion-home .youth-voices-footer');
  if(!elements.length) return;
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.08,rootMargin:'0px 0px 35px 0px'});
  elements.forEach(el=>{el.classList.add('motion-reveal');observer.observe(el)});
  document.documentElement.classList.add('motion-ready');
})();
