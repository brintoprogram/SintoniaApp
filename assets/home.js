(() => {
  'use strict';
  const english = {
    skip:'Skip to content',navGames:'Games',navFaq:'FAQ',support:'Support',navApp:'See the app',
    eyebrow:'APP FOR COUPLES',heroTitle:'Games and challenges<br><span>for couples.</span>',
    heroDescription:'Pick a game, choose the intensity and play together on one phone.',heroCta:'Meet the app <span aria-hidden="true">→</span>',coming:'Coming soon for iOS and Android.',
    gamesTitle:'The games',gamesDescription:'7 games, 4 intensity levels.',roulette:'Roulette',penalty:'Penalty',sequence:'Sequence',tug:'Tug of War',mines:'Mines',words:'Word Search',
    scrollExplore:'Scroll to explore',screensTitle:'Inside the app',screensNote:'Actual Sintonia screens.',screenHomeCaption:'Home',screenGamesCaption:'Games',downloadTitle:'Coming soon to your phone.',downloadDescription:'Sintonia for iOS and Android.',soon:'Coming soon on',downloadFootnote:'18+ · Some content requires a subscription.',
    faqTitle:'FAQ',faq1:'How do we play together?',answer1:'Play together on one phone. The couple dashboard lets you link your accounts with an invitation code.',faq2:'Will it be free?',answer2:'There will be free games and Premium content through a subscription. Prices will be shown in the app before you buy.',faq3:'What is the minimum age?',answer3:'18. Both of you choose the intensity and the challenges you want to try.',faq4:'I need help.',answer4:'Visit our ',supportPage:'support page',answer4b:' or email ',privacy:'Privacy',terms:'Terms of use',deleteAccount:'Delete account',agePolicy:'Age policy',footerAge:'For adults aged 18 and over.'
  };
  const descriptions={pt:{couple:'Os dois polvos roxos do Sintonia tocando os tentáculos',gallery:'Capturas reais do aplicativo',screenHome:'Tela inicial real do Sintonia, com painel do casal, polvo e Roulette',screenGames:'Tela real com Air Hockey, Pênalti, Sequência, Cabo de Guerra e Campo Minado',screenWords:'Caça-Palavras na tela real do aplicativo',mascot:'Polvo roxo do Sintonia'},en:{couple:'The two purple Sintonia octopuses touching tentacles',gallery:'Actual app screenshots',screenHome:'Actual Sintonia home screen with couple dashboard, octopus and Roulette',screenGames:'Actual screen with Air Hockey, Penalty, Sequence, Tug of War and Mines',screenWords:'Word Search in the app',mascot:'The purple Sintonia octopus'}};
  const nodes = [...document.querySelectorAll('[data-i18n]')];
  const portuguese = Object.fromEntries(nodes.map(el => [el.dataset.i18n,el.innerHTML]));
  const gameCopy = {
    pt:{roulette:'Gire a roleta e descubra o desafio da vez.',hockey:'Disputem uma partida de Air Hockey no mesmo celular.',penalty:'Mire e chute para marcar o gol.',sequence:'Memorize a ordem dos botões e repita.',tug:'Toque para puxar a corda para o seu lado.',mines:'Escolha uma casa e tente escapar da bomba.',words:'Encontrem as palavras escondidas.'},
    en:{roulette:'Spin the wheel to find your next challenge.',hockey:'Play Air Hockey together on one phone.',penalty:'Aim and shoot to score a goal.',sequence:'Remember the button order and repeat it.',tug:'Tap to pull the rope to your side.',mines:'Pick a tile and try to avoid the bomb.',words:'Find the hidden words.'}
  };
  let lang='pt',game='roulette';
  const buttons = [...document.querySelectorAll('[data-game]')];
  function updateGame(){
    buttons.forEach(button=>{const selected=button.dataset.game===game;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;button.classList.toggle('selected',selected);});
    document.getElementById('game-copy').textContent=gameCopy[lang][game];
    document.getElementById('game-description').setAttribute('aria-labelledby',`tab-${game}`);
  }
  buttons.forEach((button,i)=>{
    button.addEventListener('click',()=>{game=button.dataset.game;updateGame();});
    button.addEventListener('keydown',event=>{
      let n;
      if(event.key==='ArrowRight')n=(i+1)%buttons.length;
      if(event.key==='ArrowLeft')n=(i+buttons.length-1)%buttons.length;
      if(event.key==='Home')n=0;
      if(event.key==='End')n=buttons.length-1;
      if(n!==undefined){event.preventDefault();game=buttons[n].dataset.game;updateGame();buttons[n].focus();}
    });
  });
  document.querySelector('.language').addEventListener('click',()=>{
    lang=lang==='pt'?'en':'pt';document.documentElement.lang=lang==='pt'?'pt-BR':'en';
    nodes.forEach(el=>{el.innerHTML=(lang==='pt'?portuguese:english)[el.dataset.i18n]??portuguese[el.dataset.i18n];});
    const toggle=document.querySelector('.language');toggle.textContent=lang==='pt'?'EN':'PT';toggle.setAttribute('aria-label',lang==='pt'?'Switch to English':'Mudar para português');
    document.title=lang==='pt'?'Sintonia — Jogos para casais':'Sintonia — Games for couples';
    document.querySelector('.back-top').setAttribute('aria-label',lang==='pt'?'Voltar ao topo':'Back to top');
    document.querySelectorAll('.store-badge').forEach((el,i)=>el.setAttribute('aria-label',`${i?'Google Play':'App Store'} — ${lang==='pt'?'em breve':'coming soon'}`));
    document.querySelectorAll('[data-alt]').forEach(el=>el.setAttribute(el.tagName==='IMG'?'alt':'aria-label',descriptions[lang][el.dataset.alt]));
    updateGame();document.dispatchEvent(new CustomEvent('sintonia:language',{detail:{lang}}));
  });
})();
