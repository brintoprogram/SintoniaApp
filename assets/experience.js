(() => {
  'use strict';
  const story = document.querySelector('.scroll-story');
  const steps = [...document.querySelectorAll('.story-steps p')];
  const counter = document.querySelector('.story-count');
  const toggle = document.querySelector('.motion-toggle');
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  let enabled = !media.matches, queued = false, phase = -1;
  const lang = () => document.documentElement.lang.startsWith('en') ? 'en' : 'pt';
  function label() { toggle.textContent = lang() === 'pt' ? `Animações ${enabled ? 'ligadas' : 'desligadas'}` : `Motion ${enabled ? 'on' : 'off'}`; toggle.setAttribute('aria-pressed',String(enabled)); }
  function draw() {
    queued = false;
    const total = document.documentElement.scrollHeight - innerHeight;
    document.querySelector('.scroll-progress').style.transform = `scaleX(${total > 0 ? scrollY / total : 0})`;
    if (!enabled) return;
    const rect = story.getBoundingClientRect();
    const distance = Math.max(1, story.offsetHeight - innerHeight);
    const progress = Math.max(0,Math.min(1,-rect.top / distance));
    story.style.setProperty('--progress', progress.toFixed(4));
    const next = Math.min(2,Math.floor(progress * 3));
    if (phase !== next) { phase = next; counter.textContent = `0${phase + 1} — 03`; steps.forEach((step,i)=>step.classList.toggle('is-current',i===phase)); }
  }
  function schedule() { if (!queued) { queued=true; requestAnimationFrame(draw); } }
  function apply() { document.documentElement.classList.toggle('motion-off',!enabled); label(); schedule(); }
  toggle.addEventListener('click',()=>{enabled=!enabled;apply();});
  media.addEventListener('change',()=>{enabled=!media.matches;apply();});
  document.addEventListener('sintonia:language',label);
  addEventListener('scroll',schedule,{passive:true}); addEventListener('resize',schedule,{passive:true});
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.06});
    document.querySelectorAll('.section-heading,.game-card,.demo-heading,.demo-shell,.mood-copy,.mood-visual,.download-inner,.faq-section').forEach((el,i)=>{el.classList.add('reveal-ready'); if(el.classList.contains('game-card')) el.style.setProperty('--reveal-delay',`${(i%4)*65}ms`);observer.observe(el);});
  }
  apply();
})();
