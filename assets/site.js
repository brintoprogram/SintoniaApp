(() => {
  'use strict';
  const doc = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const fineQuery = matchMedia('(hover: hover) and (pointer: fine)');
  let RM = reduceQuery.matches;

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const range = (v, a, b) => clamp((v - a) / (b - a));
  const lerp = (a, b, t) => a + (b - a) * t;
  const E = {
    out: t => 1 - Math.pow(1 - t, 3),
    in: t => t * t * t,
    inOut: t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    expo: t => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    back: t => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2)
  };

  /* ------------------------------------------------------------ i18n */
  const EN = {
    skip: 'Skip to content', navGames: 'Games', navLevels: 'Intensity', navFaq: 'FAQ', navCta: 'Coming soon',
    eyebrow: 'App for couples', heroTitle: 'Games and challenges <em>for couples.</em>',
    heroDescription: 'Pick a game, set the intensity and play together on one phone.',
    soonA: 'Coming soon on', soonG: 'Coming soon on',
    liveTitle: 'Partner connected', liveSub: 'Now you play in sync', appStatus: 'Couple status &amp; stats',
    roulette: 'Roulette', penalty: 'Penalty', sequence: 'Sequence', tug: 'Tug of War', mines: 'Mines', words: 'Word Search',
    sheetTitle: 'Share your invite code', sheetBtn: 'Copy code',
    cap1k: 'Home screen', cap1t: 'It all starts here.', cap1d: 'The couple dashboard, the Sintonia octopus and the games, all on one screen.',
    cap2k: 'Games', cap2t: 'Seven games. One phone.', cap2d: 'Air Hockey, Penalty, Sequence, Tug of War and more. You both play on the same device.',
    cap3k: 'Connection', cap3t: 'Link your accounts.', cap3d: 'Share the invite code and link both profiles in the couple dashboard.',
    levelsKicker: 'Control your fun', levelsTitle: 'You choose the intensity.',
    lv1: 'Mild', lv2: 'Heating up', lv3: 'Spicy', lv4: 'Wild',
    lv1d: 'Ease into the mood, no rush.', lv2d: 'Things start heating up.', lv3d: 'No shyness. Just the two of you.', lv4d: 'No brakes. Subscribers only.',
    autoTitle: 'Automatic progression', autoDesc: 'The game turns up the heat bit by bit, at your pace.',
    gamesKicker: 'The games', gamesTitle: 'Seven games. Two players. One phone.',
    gamesDescription: 'From the first challenge to the final point: just pick a game and pass the phone.',
    gRoulette: 'Spin the wheel to find your next challenge.', gHockey: 'Play Air Hockey together on one phone.', gPenalty: 'Aim and shoot to score a goal.',
    gSequence: 'Remember the button order and repeat it.', gTug: 'Tap to pull the rope to your side.', gMines: 'Pick a tile and try to avoid the bomb.', gWords: 'Find the hidden words.',
    spin: 'Spin the wheel',
    coupleKicker: 'Couple dashboard', coupleTitle: 'The two of you, in sync.',
    coupleDesc: 'Sintonia Score, Intimacy Flame, achievements and your time together. All in the couple dashboard.',
    wDays: 'Time together', wDaysUnit: 'days', wDaysFoot: 'Every day counts.',
    wScore: 'Sintonia Score', wScoreTitle: 'Deeply connected', sc1: 'Growing together', sc2: 'In sync', sc3: 'Deeply connected', sc4: 'Off the charts',
    wFlame: 'Flame lit', wFlameTitle: 'Intimacy Flame', wRank: 'Next achievement',
    wMap: 'Exploration map', wMapTitle: 'Categories you have explored together', catKiss: 'Kiss', catTease: 'Tease', catSpicy: 'Spicy', catSurprise: 'Surprise',
    premiumTitle: 'One subscribes. Both play.',
    premiumDesc: 'The subscriber links their partner and they go Premium too: every game and Wild mode unlocked for both of you.',
    premiumFine: 'Monthly and yearly plans. Prices are shown in the app before purchase.',
    pk1: 'Connect with your partner', pk2: 'Your partner goes Premium too', pk3: 'Access to every game', pk4: 'EXTREME mode',
    dlLabel: 'Soon…', downloadTitle: 'Coming soon to your phone.', downloadDescription: 'Sintonia for iOS and Android.',
    downloadFootnote: '18+ · Some content requires a subscription.',
    faqTitle: 'FAQ', faqSub: 'What every couple asks before getting started.',
    faq1: 'How do we play together?', answer1: 'Both of you play on the same phone. The couple dashboard lets you link your accounts with an invitation code.',
    faq2: 'Will it be free?', answer2: 'There will be free games and Premium content through a subscription. Prices will be shown in the app before you buy.',
    faq3: 'What is the minimum age?', answer3: '18. Both of you choose the intensity and the challenges you want to try.',
    faq4: 'I need help.', answer4: 'Visit our ', supportPage: 'support page', answer4b: ' or email ',
    support: 'Support', privacy: 'Privacy', terms: 'Terms of use', deleteAccount: 'Delete account', agePolicy: 'Age policy', footerAge: 'For adults aged 18 and over.'
  };
  const EN_ATTR = {
    kingAlt: 'The Sintonia octopus wearing a crown and holding a sign with the Premium benefits',
    ariaApple: 'App Store — coming soon', ariaGoogle: 'Google Play — coming soon', ariaTop: 'Back to top', ariaFooterNav: 'Information and support'
  };
  const CATS = {
    pt: [['💋', 'Beijo'], ['😈', 'Provocação'], ['🌶️', 'Picante'], ['🥃', 'Shots'], ['🎲', 'Surpresa']],
    en: [['💋', 'Kiss'], ['😈', 'Tease'], ['🌶️', 'Spicy'], ['🥃', 'Shots'], ['🎲', 'Surprise']]
  };

  const textNodes = $$('[data-i18n]');
  const altNodes = $$('[data-i18n-alt]');
  const ariaNodes = $$('[data-i18n-aria]');
  const PT = {}, PT_ATTR = {};
  textNodes.forEach(el => { if (!(el.dataset.i18n in PT)) PT[el.dataset.i18n] = el.innerHTML; });
  altNodes.forEach(el => { PT_ATTR[el.dataset.i18nAlt] = el.getAttribute('alt'); });
  ariaNodes.forEach(el => { PT_ATTR[el.dataset.i18nAria] = el.getAttribute('aria-label'); });
  let lang = 'pt';

  /* word splitting for masked headline reveals */
  function split(el) {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(ch => {
        if (ch.nodeType === 3) {
          const frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const wi = document.createElement('span'); wi.className = 'wi'; wi.textContent = part; wi.style.setProperty('--i', i++);
            w.appendChild(wi); frag.appendChild(w);
          });
          ch.replaceWith(frag);
        } else if (ch.nodeType === 1 && ch.tagName !== 'BR') walk(ch);
      });
    };
    walk(el);
  }
  function paintGradients() {
    $$('[data-split] em').forEach(em => {
      const ws = $$('.w', em); if (!ws.length) return;
      const rects = ws.map(w => w.getBoundingClientRect());
      const left = Math.min(...rects.map(r => r.left)), right = Math.max(...rects.map(r => r.right));
      ws.forEach((w, n) => { const wi = w.firstChild; wi.style.setProperty('--gw', (right - left).toFixed(1) + 'px'); wi.style.setProperty('--gx', (left - rects[n].left).toFixed(1) + 'px'); });
    });
  }
  $$('[data-split]').forEach(split);

  function applyLang(next, { toast: showToast = false } = {}) {
    lang = next;
    const en = lang === 'en';
    textNodes.forEach(el => {
      const k = el.dataset.i18n;
      const html = (en ? EN[k] : PT[k]) ?? PT[k];
      if (html === undefined) return;
      if (el.hasAttribute('data-split')) {
        el.innerHTML = html; split(el);
        if (el.classList.contains('in') && !RM) { el.classList.remove('in'); void el.offsetWidth; requestAnimationFrame(() => el.classList.add('in')); }
      } else if (el.innerHTML !== html) el.innerHTML = html;
    });
    altNodes.forEach(el => el.setAttribute('alt', en ? EN_ATTR[el.dataset.i18nAlt] : PT_ATTR[el.dataset.i18nAlt]));
    ariaNodes.forEach(el => el.setAttribute('aria-label', en ? EN_ATTR[el.dataset.i18nAria] : PT_ATTR[el.dataset.i18nAria]));
    $$('.brand').forEach(b => b.setAttribute('aria-label', en ? 'Sintonia — home' : 'Sintonia — início'));
    doc.lang = en ? 'en' : 'pt-BR';
    document.title = en ? 'Sintonia — Games for couples' : 'Sintonia — Jogos para casais';
    const seg = $('.seg');
    seg.style.setProperty('--seg', en ? 1 : 0);
    $$('button', seg).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    $$('.levels-words span').forEach(s => s.style.setProperty('--len', Math.max(4, s.textContent.trim().length)));
    renderSpin();
    try { localStorage.setItem('sintonia-lang', lang); } catch (e) { /* storage unavailable */ }
    if (showToast) toast(en ? 'English' : 'Português');
    requestAnimationFrame(() => { paintGradients(); measure(); });
  }
  $$('.seg button').forEach(b => b.addEventListener('click', () => { if (b.dataset.lang !== lang) applyLang(b.dataset.lang, { toast: true }); }));

  const toastEl = $('.toast'), toastText = $('.toast-text');
  let toastTimer = 0;
  function toast(msg) {
    toastText.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1500);
  }

  /* ------------------------------------------------------------ element refs */
  const nav = $('.nav');
  const hero = $('.hero');
  const heroTitle = $('.hero-title');
  const floaters = $('.floaters');
  const fls = $$('.fl').map((el, i) => {
    el.style.setProperty('--i', i);
    const cs = getComputedStyle(el);
    const num = n => parseFloat(cs.getPropertyValue(n)) || 0;
    return { el, d: num('--d') || 1, vx: num('--vx'), vy: num('--vy') };
  });
  const iphone = $('.iphone');
  const appHome = $('.app-home'), appGames = $('.app-games');
  const homeScroll = $('.app-home .app-scroll'), gamesScroll = $('.games-scroll');
  const sheet = $('.sheet'), sheetDim = $('.sheet-dim'), codeEl = $('.code'), island = $('.island');
  const caps = $$('.cap'), dots = $$('.story-dots i'), dotsWrap = $('.story-dots');
  const glowA = $('.glow-a');
  const lvStage = $('.levels-stage'), lvImgs = $$('.lv-img'), lvWords = $$('.levels-words span'), lvItems = $$('.levels-list li'), lvTicks = $$('.cc-ticks i');
  const cStage = $('.couple-stage');
  const king = $('.king'), signItems = $$('.king-sign li');
  const dlSection = $('.download');

  /* ------------------------------------------------------------ geometry */
  let vw = innerWidth, vh = innerHeight, mobile = vw <= 860;
  const G = { startY: 300, endY: 0, endScale: 1, homeTravel: 0, gamesTravel: 0 };
  const scenes = [
    { el: $('.story'), p: 0, t: 0, top: 0, h: 1, update: updateStory },
    { el: $('.levels'), p: 0, t: 0, top: 0, h: 1, update: updateLevels }
  ];
  const tracks = [
    { el: cStage, from: 1, to: .32, p: 0, t: 0, top: 0, update: updateCouple },
    { el: $('.premium-card'), from: .95, to: .12, p: 0, t: 0, top: 0, update: updatePremium },
    { el: dlSection, from: .95, to: .3, p: 0, t: 0, top: 0, update: updateDownload }
  ];

  function measure() {
    vw = innerWidth; vh = innerHeight; mobile = vw <= 860;
    const y = scrollY;
    scenes.forEach(s => { const r = s.el.getBoundingClientRect(); s.top = r.top + y; s.h = s.el.offsetHeight; });
    tracks.forEach(t => { const r = t.el.getBoundingClientRect(); t.top = r.top + y; });

    const phoneH = iphone.offsetHeight;
    const navB = nav.offsetTop + nav.offsetHeight;
    const row = hero.querySelector('.store-row');
    const heroBottom = row.offsetTop + row.offsetHeight;
    let top = Math.max(heroBottom + (mobile ? 30 : 46), vh * (mobile ? .6 : .64));
    top = Math.min(top, vh - Math.min(phoneH * .26, 190));
    G.startY = top - (vh / 2 - phoneH / 2);

    if (mobile) {
      const capH = Math.max(...caps.map(c => c.offsetHeight));
      const capTop = vh - 14 - capH;
      const lo = navB + 14, hi = capTop - 14;
      G.endScale = clamp((hi - lo) / phoneH, .5, 1);
      G.endY = (lo + hi) / 2 - vh / 2;
    } else {
      G.endScale = 1;
      G.endY = Math.min(navB / 2, 30);
    }
    const pad = parseFloat(getComputedStyle(appGames).paddingTop) || 0;
    G.gamesTravel = Math.max(0, gamesScroll.offsetHeight - (appGames.clientHeight - pad));
    G.homeTravel = Math.max(0, Math.min(homeScroll.offsetHeight - (appHome.clientHeight - pad), phoneH * .06));
    schedule(true);
  }

  /* ------------------------------------------------------------ scenes */
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };

  function updateStory(p) {
    const hOut = E.out(range(p, 0, .1));
    hero.style.opacity = (1 - hOut).toFixed(3);
    hero.style.transform = hOut > 0 ? `translate3d(0,${(-hOut * vh * .28).toFixed(1)}px,0) scale(${(1 - hOut * .08).toFixed(4)})` : '';
    hero.style.filter = hOut > .002 ? `blur(${(hOut * 10).toFixed(2)}px)` : '';
    hero.style.visibility = hOut > .995 ? 'hidden' : '';

    const sc = E.in(range(p, 0, .15));
    floaters.style.visibility = sc > .995 ? 'hidden' : '';
    if (sc <= .995) {
      fls.forEach(f => {
        const tx = f.vx * sc * vw * .45 + ptr.x * f.d * 24;
        const ty = f.vy * sc * vh * .45 + ptr.y * f.d * 18;
        f.el.style.transform = `translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,0) scale(${(1 + sc * .5 * f.d).toFixed(3)})`;
        f.el.style.opacity = (1 - sc).toFixed(3);
      });
    }

    const rise = E.inOut(range(p, .025, .19));
    const heroPhase = 1 - range(p, .08, .2);
    let x = 0, ry = 0;
    if (!mobile) {
      const shift = Math.min(vw * .15, 220);
      x = shift * (E.inOut(range(p, .14, .22)) - 2 * E.inOut(range(p, .38, .46)) + 2 * E.inOut(range(p, .62, .7)) - E.inOut(range(p, .9, 1)));
      ry = -(x / shift) * 9;
    }
    ry += ptr.x * 6 * heroPhase;
    const rx = lerp(24, 0, rise) - ptr.y * 4 * heroPhase;
    const outro = E.inOut(range(p, .92, 1));
    const y = lerp(G.startY, G.endY, rise);
    const s = lerp(.84, G.endScale, rise) * (1 - outro * .08);
    iphone.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${s.toFixed(4)})`;
    glowA.style.setProperty('--ga', lerp(.85, 1.15, rise).toFixed(3));
    glowA.style.setProperty('--gao', (lerp(.75, 1, rise) * (1 - outro * .5)).toFixed(3));

    homeScroll.style.transform = `translate3d(0,${(-E.inOut(range(p, .22, .38)) * G.homeTravel).toFixed(1)}px,0)`;
    const push = E.inOut(range(p, .41, .48));
    appHome.style.transform = `translate3d(${(-30 * push).toFixed(2)}%,0,0)`;
    appHome.style.filter = push > .001 ? `brightness(${(1 - .5 * push).toFixed(3)})` : '';
    appGames.style.transform = `translate3d(${(100 - 100 * push).toFixed(2)}%,0,0)`;
    gamesScroll.style.transform = `translate3d(0,${(-E.inOut(range(p, .49, .62)) * G.gamesTravel).toFixed(1)}px,0)`;
    const sh = range(p, .66, .72);
    sheet.style.transform = `translate3d(0,${((1 - E.back(sh)) * 115).toFixed(2)}%,0)`;
    sheetDim.style.opacity = (E.out(sh) * .9).toFixed(3);
    codeEl.classList.toggle('typed', p > .715);
    const live = p > .765;
    if (live !== island.classList.contains('live')) {
      island.classList.toggle('live', live);
      if (live && !RM) { iphone.classList.remove('buzz'); void iphone.offsetWidth; iphone.classList.add('buzz'); }
    }

    const windows = [[range(p, .15, .21), range(p, .35, .4)], [range(p, .43, .49), range(p, .6, .645)], [range(p, .67, .73), 0]];
    caps.forEach((c, i) => {
      const vIn = E.out(windows[i][0]), vOut = E.in(windows[i][1]);
      const o = vIn * (1 - vOut);
      const dy = (1 - vIn) * 36 - vOut * 36;
      c.style.opacity = o.toFixed(3);
      c.style.transform = mobile ? `translate3d(0,${dy.toFixed(1)}px,0)` : `translate3d(0,calc(-50% + ${dy.toFixed(1)}px),0)`;
      c.style.filter = o > .01 && o < .99 ? `blur(${((1 - o) * 6).toFixed(2)}px)` : '';
      c.style.visibility = o < .01 ? 'hidden' : '';
    });
    const step = p < .41 ? 0 : p < .655 ? 1 : 2;
    dots.forEach((d, i) => d.classList.toggle('on', i === step));
    dotsWrap.style.opacity = (range(p, .15, .2) * (1 - range(p, .95, 1))).toFixed(3);
  }

  let curLv = -1;
  function updateLevels(p) {
    const q = range(p, .06, .94);
    const lv = Math.min(3, Math.floor(q * 4));
    lvStage.style.setProperty('--fill', (.1 + .9 * q).toFixed(4));
    if (lv === curLv) return;
    curLv = lv;
    lvStage.dataset.lv = lv;
    lvImgs.forEach((im, i) => { im.classList.toggle('on', i === lv); im.classList.toggle('past', i < lv); });
    lvWords.forEach((w, i) => w.classList.toggle('on', i === lv));
    lvItems.forEach((li, i) => li.classList.toggle('on', i === lv));
    lvTicks.forEach((t, i) => t.classList.toggle('on', i <= lv));
  }

  let hit = false;
  function updateCouple(t) {
    const e = E.out(t);
    cStage.style.setProperty('--off', ((1 - e) * Math.min(vw * .34, 460)).toFixed(1) + 'px');
    cStage.style.setProperty('--offr', ((1 - e) * 14).toFixed(2) + 'deg');
    const f = range(t, .86, 1);
    cStage.style.setProperty('--flash', (E.out(f) * 1.15).toFixed(3));
    cStage.style.setProperty('--flasho', (f < .35 ? f / .35 : 1 - (f - .35) / .65 * .6).toFixed(3));
    if (t > .97 && !hit) { hit = true; if (!RM) cStage.classList.add('hit'); }
    if (t < .8 && hit) { hit = false; cStage.classList.remove('hit'); }
  }

  function updatePremium(t) {
    king.style.setProperty('--rise', ((1 - E.out(t)) * 42).toFixed(2) + '%');
    signItems.forEach((li, i) => li.classList.toggle('on', t > .5 + i * .1));
  }

  function updateDownload(t) {
    dlSection.style.setProperty('--dl', (E.out(t) * .72).toFixed(4));
    dlSection.classList.toggle('waiting', t > .995);
  }

  /* reduced motion: no timeline, every scene shows one calm, complete state */
  let staticApplied = false;
  function applyStatic() {
    [hero, floaters, iphone, appHome, appGames, homeScroll, gamesScroll, sheet, sheetDim, dotsWrap, ...caps, ...fls.map(f => f.el)].forEach(el => {
      el.style.transform = ''; el.style.opacity = ''; el.style.filter = ''; el.style.visibility = '';
    });
    island.classList.remove('live');
    codeEl.classList.remove('typed');
    curLv = -1; updateLevels(.35);
    updateCouple(1); updatePremium(1); updateDownload(1);
    staticApplied = true;
  }

  /* ------------------------------------------------------------ loop */
  let raf = 0, last = 0, force = true;
  function schedule(f) { if (f) force = true; if (!raf) raf = requestAnimationFrame(frame); }
  function frame(now) {
    raf = 0;
    if (RM) { if (!staticApplied) applyStatic(); nav.classList.toggle('scrolled', scrollY > 8); return; }
    staticApplied = false;
    const dt = last ? Math.min(64, now - last) : 16; last = now;
    const k = RM ? 1 : 1 - Math.exp(-dt / 85);
    const y = scrollY;
    let moving = false;

    const pk = RM ? 1 : 1 - Math.exp(-dt / 140);
    const dx = ptr.tx - ptr.x, dy = ptr.ty - ptr.y;
    if (Math.abs(dx) > .001 || Math.abs(dy) > .001) { ptr.x += dx * pk; ptr.y += dy * pk; moving = true; }
    const ptrActive = moving;

    scenes.forEach(s => {
      s.t = clamp((y - s.top) / Math.max(1, s.h - vh));
      const d = s.t - s.p;
      let changed = force;
      if (Math.abs(d) > .00015) { s.p += d * k; moving = true; changed = true; } else if (d !== 0) { s.p = s.t; changed = true; }
      const near = y + vh > s.top - vh * .5 && y < s.top + s.h + vh * .5;
      if (near && (changed || (ptrActive && s.update === updateStory))) s.update(s.p);
    });
    tracks.forEach(t => {
      const top = t.top - y;
      t.t = clamp((vh * t.from - top) / (vh * (t.from - t.to)));
      const d = t.t - t.p;
      let changed = force;
      if (Math.abs(d) > .0003) { t.p += d * k; moving = true; changed = true; } else if (d !== 0) { t.p = t.t; changed = true; }
      if (changed) t.update(t.p);
    });
    nav.classList.toggle('scrolled', y > 8);
    force = false;
    if (moving) schedule();
  }
  addEventListener('scroll', () => schedule(), { passive: true });
  let resizeRaf = 0;
  addEventListener('resize', () => { cancelAnimationFrame(resizeRaf); resizeRaf = requestAnimationFrame(() => { paintGradients(); measure(); }); });
  if ('ResizeObserver' in window) new ResizeObserver(() => { cancelAnimationFrame(resizeRaf); resizeRaf = requestAnimationFrame(measure); }).observe(document.body);
  addEventListener('load', () => { paintGradients(); measure(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { paintGradients(); measure(); });
  reduceQuery.addEventListener?.('change', e => { RM = e.matches; doc.classList.toggle('rm', RM); measure(); });

  if (fineQuery.matches) {
    addEventListener('pointermove', e => {
      ptr.tx = e.clientX / vw * 2 - 1; ptr.ty = e.clientY / vh * 2 - 1;
      if (scrollY < vh * 1.5) schedule();
    }, { passive: true });
    nav.addEventListener('pointermove', e => { const r = nav.getBoundingClientRect(); nav.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%'); });
  }

  /* ------------------------------------------------------------ reveals */
  function countUp(el) {
    const to = +el.dataset.count;
    if (RM) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 1700;
    const step = now => { const t = clamp((now - t0) / dur); el.textContent = Math.round(E.expo(t) * to); if (t < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  function onIn(el) {
    $$('[data-count]', el).forEach(countUp);
    const bar = $('.ring-bar', el);
    if (bar) bar.style.strokeDashoffset = String(100 - parseFloat(getComputedStyle($('.ring', el)).getPropertyValue('--v')) * 100);
    if (el.classList.contains('t-words')) highlightWord(el);
  }
  if (!RM) $$('[data-count]').forEach(el => { el.textContent = '0'; });

  const stagger = (sel, step) => $$(sel).forEach((el, i) => el.style.setProperty('--rd', (i * step).toFixed(2) + 's'));
  stagger('.bento .tile', .07);
  stagger('.widgets .widget', .08);
  $('.hero-sub').style.setProperty('--rd', '.28s');
  $('.hero .store-row').style.setProperty('--rd', '.4s');

  const heroSet = new Set([heroTitle, ...$$('.hero [data-reveal]')]);
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); onIn(en.target); } });
  }, { threshold: .16, rootMargin: '0px 0px -6% 0px' }) : null;
  $$('[data-reveal], [data-split]').forEach(el => {
    if (heroSet.has(el)) return;
    if (io && !RM) io.observe(el); else { el.classList.add('in'); onIn(el); }
  });

  /* launch → hero entrance */
  const launching = !doc.classList.contains('launched') && !RM;
  try { sessionStorage.setItem('sintonia-launch', '1'); } catch (e) { /* storage unavailable */ }
  setTimeout(() => {
    heroSet.forEach(el => el.classList.add('in'));
    floaters.classList.add('ready');
  }, launching ? 820 : 60);
  if (launching) setTimeout(() => { const l = $('.launch'); if (l) l.remove(); }, 1700);

  /* auto-progression switch turns on when the scene arrives */
  const autoEl = $('.auto');
  if (io && !RM) new IntersectionObserver((es, o) => es.forEach(en => { if (en.isIntersecting) { setTimeout(() => autoEl.classList.add('on'), 450); o.disconnect(); } }), { threshold: .9 }).observe(autoEl);
  else autoEl.classList.add('on');

  /* active nav link */
  const navLinks = $$('.nav-links a');
  if (io) {
    const secIO = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) return;
      navLinks.forEach(a => a.setAttribute('aria-current', String(a.getAttribute('href') === '#' + en.target.id)));
    }), { rootMargin: '-45% 0px -50% 0px' });
    ['intensidade', 'jogos', 'premium', 'duvidas', 'top', 'casal', 'download'].forEach(id => { const s = document.getElementById(id); if (s) secIO.observe(s); });
  }

  /* ------------------------------------------------------------ videos */
  const tryPlay = v => { const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); };
  const videos = $$('video');
  if ('IntersectionObserver' in window) {
    const vio = new IntersectionObserver(es => es.forEach(en => {
      const v = en.target;
      if (en.isIntersecting) { if (v.dataset.src && !v.getAttribute('src')) v.src = v.dataset.src; if (!RM) tryPlay(v); }
      else if (!v.paused) v.pause();
    }), { rootMargin: '250px 0px' });
    videos.forEach(v => vio.observe(v));
  }
  if (RM) videos.forEach(v => { v.removeAttribute('autoplay'); v.pause(); });

  /* ------------------------------------------------------------ bento: tilt + roulette + word search */
  if (fineQuery.matches && !RM) {
    $$('.tile').forEach(t => {
      t.addEventListener('pointermove', e => {
        const r = t.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        t.style.setProperty('--ry', ((x - .5) * 8).toFixed(2) + 'deg');
        t.style.setProperty('--rx', ((.5 - y) * 7).toFixed(2) + 'deg');
        t.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        t.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      });
      t.addEventListener('pointerleave', () => { t.style.setProperty('--rx', '0deg'); t.style.setProperty('--ry', '0deg'); });
    });
  }

  const rTile = $('.t-roulette'), wheel = $('.wheel'), spinBtn = $('.btn-spin'), spinOut = $('.spin-result');
  let rot = 0, spinIdx = -1, spinning = false;
  function renderSpin() {
    if (spinIdx < 0) return;
    const [emoji, label] = CATS[lang][spinIdx];
    $('.spin-emoji', spinOut).textContent = emoji;
    $('.spin-text', spinOut).innerHTML = (lang === 'en' ? 'Up next' : 'Categoria da vez') + '<b></b>';
    $('.spin-text b', spinOut).textContent = label;
  }
  spinBtn.addEventListener('click', () => {
    if (spinning) return;
    spinning = true;
    spinBtn.setAttribute('aria-disabled', 'true');
    spinOut.classList.remove('show');
    const idx = Math.floor(Math.random() * 5);
    rot += 1800 + Math.round(Math.random() * 360);
    wheel.style.setProperty('--rot', rot + 'deg');
    rTile.classList.add('spinning');
    setTimeout(() => {
      spinIdx = idx; renderSpin();
      spinOut.classList.add('show');
      spinning = false;
      spinBtn.removeAttribute('aria-disabled');
      rTile.classList.remove('spinning');
    }, RM ? 60 : 4500);
  });

  const letters = $('.letters');
  const WORD = 'SINTONIA', AT = 31;
  if (letters) {
    const abc = 'ABCDEFGHIJLMNOPQRSTUVXZ';
    let html = '';
    for (let i = 0; i < 70; i++) {
      const w = i >= AT && i < AT + WORD.length;
      html += `<span${w ? ` data-w style="--k:${i - AT}"` : ''}>${w ? WORD[i - AT] : abc[(i * 7 + 3) % abc.length]}</span>`;
    }
    letters.innerHTML = html;
    const tile = letters.closest('.tile');
    tile.addEventListener('pointerenter', () => highlightWord(tile, true));
  }
  function highlightWord(tile, replay) {
    const ws = $$('[data-w]', tile);
    if (replay) { ws.forEach(s => s.classList.remove('hl')); void tile.offsetWidth; }
    setTimeout(() => ws.forEach(s => s.classList.add('hl')), replay ? 30 : 500);
  }

  /* ------------------------------------------------------------ FAQ (animated, iOS-like) */
  $$('.group details').forEach(d => {
    const sum = $('summary', d), body = $('.row-body', d);
    sum.addEventListener('click', e => {
      if (RM || !body.animate) return;
      e.preventDefault();
      if (d.dataset.anim) return;
      d.dataset.anim = '1';
      const ease = 'cubic-bezier(.32,.72,0,1)';
      if (!d.open) {
        d.open = true;
        const h = body.scrollHeight;
        body.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 440, easing: ease }).onfinish = () => { delete d.dataset.anim; };
      } else {
        const h = body.offsetHeight;
        body.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 320, easing: ease }).onfinish = () => { d.open = false; delete d.dataset.anim; };
      }
    });
  });

  /* ------------------------------------------------------------ boot */
  let stored = null;
  try { stored = localStorage.getItem('sintonia-lang'); } catch (e) { /* storage unavailable */ }
  if (stored === 'en') applyLang('en');
  else $$('.levels-words span').forEach(s => s.style.setProperty('--len', Math.max(4, s.textContent.trim().length)));
  paintGradients();
  measure();
})();
