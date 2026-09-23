(() => {
  'use strict';
  const english = {
    skip:'Skip to content', navGames:'The games', navFaq:'FAQ', support:'Support', navApp:'Meet the app ↗',
    eyebrow:'THE APP FOR PLAYING TOGETHER', hero1:'One phone.', hero2:'Two players.', hero3:'No routine.',
    heroDescription:'A little competition. A whole lot of connection. Minigames and challenges to make any night your night.', heroCta:'Find your next game', coming:'Coming soon for iPhone and Android',
    artNote:'your date just<br>levelled up.', phoneKicker:'MAKE TIME FOR TWO', phoneTitle:'Ready to play?', phoneSubtitle:'Pick a game. Let chemistry do the rest.',
    roulette:'Roulette', mines:'Mines', sequence:'Sequence', phoneRoulette:'Let chance decide', phoneHockey:'Time for a rematch', phoneMines:'Who will risk it?', phoneSequence:'Find your rhythm', gamesLabel:'Games', coupleLabel:'Couple', profileLabel:'Profile', illustration:'Illustrative app preview',
    strip1:'More laughter.', strip2:'More butterflies.', strip3:'More you two.', gamesEyebrow:'YOUR NEXT DATE STARTS HERE', gamesTitle:'One game leads to another.', gamesDescription:'Compete in the game.<br>Share the moment.', moreGames:'And more in the app.',
    moodEyebrow:'AT YOUR OWN PACE', moodTitle:'Your chemistry.<br>Your intensity.', moodDescription:'From easygoing to daring, choose the mood before you start. The best challenge is one you both want to try.', moodHint:'Tap an intensity to find your mood.', level0:'Light', level1:'Warming up', level2:'Spicy', level3:'Wild',
    downloadEyebrow:'LESS ROUTINE. MORE CONNECTION.', downloadTitle:'The next round<br>is yours.', downloadDescription:'We’re getting Sintonia ready for iOS and Android.<br>Download links will appear here when it launches.', soon:'Coming soon on', downloadFootnote:'For adults 18+. Some content requires a subscription.',
    faqTitle:'Before your first round.', faq1:'Do we need two phones?', answer1:'Play the minigames together on one phone. To use the couple dashboard, you can link your accounts with an invitation code in the app.', faq2:'Is the app free?', answer2:'Sintonia will offer free access and Premium content through monthly or annual subscriptions. Prices and terms will be shown in the app before you buy.', faq3:'Who is Sintonia for?', answer3:'Couples aged 18 and over who want to have fun together. Choose your intensity and only take part in challenges you both feel comfortable with.', faq4:'How can we reach you?', answer4:'Visit our ', supportPage:'support page', answer4b:' or email ', footerTag:'Made for your favourite company: each other.', privacy:'Privacy', terms:'Terms of use', deleteAccount:'Delete account', agePolicy:'Age policy', footerAge:'Adults only. Always with consent. 18+', madeIn:'Made in Brazil ↗'
  };
  const nodes = [...document.querySelectorAll('[data-i18n]')];
  const portuguese = Object.fromEntries(nodes.map(el => [el.dataset.i18n, el.innerHTML]));
  const gameCopy = {
    pt:{roulette:'Girem a roleta e deixem o acaso escolher o próximo desafio. A surpresa faz parte da brincadeira.',hockey:'Uma disputa de reflexos, uma partida a dois e aquela vontade de pedir revanche. Quem leva a melhor?',mines:'Cada escolha traz uma surpresa. Alternem as jogadas e descubram quem vai encontrar o próximo desafio.',sequence:'Memória, atenção e um pouco de rivalidade. Sigam a sequência e vejam quem consegue ir mais longe.'},
    en:{roulette:'Spin the wheel and let chance choose your next challenge. The surprise is part of the fun.',hockey:'Quick reflexes, two players and every reason for a rematch. Who will come out on top?',mines:'Every choice holds a surprise. Take turns and discover who will find the next challenge.',sequence:'Memory, focus and a little friendly rivalry. Follow the sequence and see who can go further.'}
  };
  const moods = {pt:['Começa com uma risada.<br>Termina com “só mais uma”.','A disputa esquenta.<br>A conexão também.','Um pouco de ousadia.<br>Muita química.','Vocês escolhem os limites.<br>A noite ganha outro ritmo.'],en:['Starts with a laugh.<br>Ends with “one more round”.','The competition heats up.<br>So does the connection.','A little daring.<br>A lot of chemistry.','You set the boundaries.<br>The night finds a new rhythm.']};
  let lang = 'pt', game = 'roulette', level = 0;
  const gameButtons = [...document.querySelectorAll('[data-game]')];
  function updateGame() {
    gameButtons.forEach(button => { const active = button.dataset.game === game; button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1; button.classList.toggle('selected', active); });
    document.getElementById('game-copy').textContent = gameCopy[lang][game];
    document.getElementById('game-description').setAttribute('aria-labelledby', `tab-${game}`);
  }
  function updateMood() {
    document.querySelectorAll('[data-level]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.level) === level)));
    document.querySelector('.mood-visual').dataset.mood = String(level);
    document.getElementById('mood-label').textContent = (lang === 'pt' ? portuguese : english)[`level${level}`].toLocaleUpperCase(lang);
    document.getElementById('mood-copy').innerHTML = moods[lang][level];
  }
  gameButtons.forEach((button, index) => {
    button.addEventListener('click', () => { game = button.dataset.game; updateGame(); });
    button.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = (index + 1) % gameButtons.length;
      if (event.key === 'ArrowLeft') target = (index + gameButtons.length - 1) % gameButtons.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = gameButtons.length - 1;
      if (target !== undefined) { event.preventDefault(); game = gameButtons[target].dataset.game; updateGame(); gameButtons[target].focus(); }
    });
  });
  document.querySelectorAll('[data-level]').forEach(button => button.addEventListener('click', () => { level = Number(button.dataset.level); updateMood(); }));
  document.querySelector('.language').addEventListener('click', () => {
    lang = lang === 'pt' ? 'en' : 'pt';
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    nodes.forEach(el => { el.innerHTML = (lang === 'pt' ? portuguese : english)[el.dataset.i18n]; });
    const toggle = document.querySelector('.language'); toggle.textContent = lang === 'pt' ? 'EN' : 'PT'; toggle.setAttribute('aria-label', lang === 'pt' ? 'Switch to English' : 'Mudar para português');
    document.querySelector('.phone').setAttribute('aria-label', lang === 'pt' ? 'Prévia ilustrativa do app Sintonia' : 'Illustrative preview of the Sintonia app');
    document.querySelector('.back-top').setAttribute('aria-label', lang === 'pt' ? 'Voltar ao topo' : 'Back to top');
    document.querySelectorAll('.store-badge').forEach((el,i) => el.setAttribute('aria-label', `${i ? 'Google Play' : 'App Store'} — ${lang === 'pt' ? 'em breve' : 'coming soon'}`));
    updateGame(); updateMood();
  });
})();
