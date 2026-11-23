document.querySelectorAll('.mobile-toggle').forEach(b=>b.addEventListener('click',()=>{const n=document.getElementById('primary-navigation');const open=n.classList.toggle('open');b.setAttribute('aria-expanded',String(open))}));

// Accessible project-area cards: click, Space and Enter (native buttons) flip the card.
document.querySelectorAll('.flip-card').forEach(card=>{
 card.addEventListener('click',()=>{
   const active=card.getAttribute('aria-pressed')==='true';
   card.setAttribute('aria-pressed',String(!active));
 });
});
