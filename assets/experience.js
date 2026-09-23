(() => {
  'use strict';
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const art = document.querySelector('.hero-art');
  const showcase = document.querySelector('.phone-showcase');
  const sticky = showcase.querySelector('.showcase-sticky');
  const screen = showcase.querySelector('.games-screen');
  const track = showcase.querySelector('.games-screen-track');
  let queued = false, screenTravel = 0;
  const clamp = value => Math.min(1, Math.max(0, value));
  function measure() {
    screenTravel = Math.max(0, track.scrollHeight - screen.clientHeight);
    schedule();
  }
  function draw() {
    queued = false;
    if (media.matches) {
      art.style.setProperty('--shift', '0');
      showcase.style.setProperty('--progress', '0');
      showcase.style.setProperty('--screen-shift', '0px');
      showcase.dataset.front = 'home';
      return;
    }
    art.style.setProperty('--shift', clamp(scrollY / 600).toFixed(3));
    const rect = showcase.getBoundingClientRect();
    const distance = Math.max(1, showcase.offsetHeight - sticky.offsetHeight);
    const progress = clamp(-rect.top / distance);
    showcase.style.setProperty('--progress', progress.toFixed(4));
    showcase.style.setProperty('--screen-shift', `${(screenTravel * clamp((progress - .28) / .72)).toFixed(2)}px`);
    showcase.dataset.front = progress > .43 ? 'games' : 'home';
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(draw); } }
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', measure, {passive:true});
  media.addEventListener('change', measure);
  track.querySelectorAll('img').forEach(img => img.addEventListener('load', measure, {once:true}));
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(screen);
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
  measure();
})();
