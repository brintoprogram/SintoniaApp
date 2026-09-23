(() => {
  'use strict';
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const art = document.querySelector('.hero-art');
  let queued = false;
  function draw() {
    queued = false;
    if (media.matches) { art.style.setProperty('--shift', '0'); return; }
    const rect = art.getBoundingClientRect();
    if (rect.bottom < -100 || rect.top > innerHeight) return;
    art.style.setProperty('--shift', Math.min(1, Math.max(0, scrollY / 600)).toFixed(3));
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(draw); } }
  addEventListener('scroll', schedule, {passive:true});
  media.addEventListener('change', schedule);
  if ('IntersectionObserver' in window && !media.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), {threshold:.05});
    document.querySelectorAll('.game-card').forEach((el,i) => {
      el.classList.add('reveal-ready');
      el.style.setProperty('--reveal-delay', `${(i % 4) * 45}ms`);
      observer.observe(el);
    });
  }
  schedule();
})();
