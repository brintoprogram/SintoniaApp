(() => {
  'use strict';
  const {MineRound,SequenceRound}=window.SintoniaDemoCore;
  const $=id=>document.getElementById(id);
  const tabs=[...document.querySelectorAll('[data-demo]')];
  const pads=[...document.querySelectorAll('[data-pad]')];
  let active='roulette', spinning=false, rotation=0, spinTimer, sequenceToken=0, best=0;
  let mines, sequence;
  const lang=()=>document.documentElement.lang.startsWith('en')?'en':'pt';
  const strings={
    pt:{rouletteIdle:'O próximo momento de vocês começa com um giro.',spinning:'A sorte está escolhendo…',spin:'Girar a roleta ↗',spinAgain:'Girar de novo ↗',spinWait:'Girando…',minesIdle:'Jogador 1, escolha uma casa.',minesSafe:p=>`Casa segura! Agora é a vez do jogador ${p}.`,minesBomb:p=>`Jogador ${p}, seu desafio: conte uma lembrança de vocês que sempre te faz sorrir.`,minesWin:'Vocês escaparam da bomba! Vale uma comemoração a dois.',turn:p=>`Vez do jogador ${p}`,roundOver:'Rodada encerrada',cell:n=>`Casa ${n}, fechada`,safeCell:n=>`Casa ${n}, segura`,bombCell:n=>`Casa ${n}, bomba`,seqIdle:'Prontos para testar essa sintonia?',seqWatch:p=>`Jogador ${p}: observe a ordem…`,seqLit:n=>`Observe: botão ${n}.`,seqInput:p=>`Jogador ${p}, sua vez! Repita a sequência.`,seqCorrect:n=>`Acertou! ${n} na sequência. Preparem a próxima rodada.`,seqLost:n=>`Quase! Vocês completaram ${n} rodada${n===1?'':'s'}. Tentem de novo.`,seqWin:'Oito rodadas! Essa dupla está em sintonia. Joguem de novo para uma nova sequência.',round:n=>`RODADA ${n}`,record:n=>`RECORDE ${n}`,start:'Começar sequência ↗',restart:'Recomeçar ↻',playing:'Observem a sequência…',input:'Agora é com vocês',pad:n=>`Botão ${n}`},
    en:{rouletteIdle:'Your next moment together starts with a spin.',spinning:'Letting chance decide…',spin:'Spin the wheel ↗',spinAgain:'Spin again ↗',spinWait:'Spinning…',minesIdle:'Player 1, pick a tile.',minesSafe:p=>`Safe! Now it’s player ${p}’s turn.`,minesBomb:p=>`Player ${p}, your challenge: share a memory of you two that always makes you smile.`,minesWin:'You avoided the bomb! Time to celebrate together.',turn:p=>`Player ${p}’s turn`,roundOver:'Round finished',cell:n=>`Tile ${n}, hidden`,safeCell:n=>`Tile ${n}, safe`,bombCell:n=>`Tile ${n}, bomb`,seqIdle:'Ready to test your connection?',seqWatch:p=>`Player ${p}: watch the order…`,seqLit:n=>`Watch: button ${n}.`,seqInput:p=>`Player ${p}, your turn! Repeat the sequence.`,seqCorrect:n=>`You got it! ${n} steps. Get ready for the next round.`,seqLost:n=>`So close! You completed ${n} round${n===1?'':'s'}. Try again.`,seqWin:'Eight rounds! You two are in sync. Play again for a new sequence.',round:n=>`ROUND ${n}`,record:n=>`BEST ${n}`,start:'Start sequence ↗',restart:'Start over ↻',playing:'Watch the sequence…',input:'Your turn now',pad:n=>`Button ${n}`}
  };
  const challenges={pt:['Olhem nos olhos um do outro por dez segundos. Sem desviar!','Digam três coisas que admiram um no outro.','Escolham uma música que lembre vocês e dancem um pouquinho.','Contem qual detalhe do primeiro encontro vocês ainda lembram.','Deem um abraço demorado. O celular pode esperar.','Planejem um date diferente para fazer nesta semana.'],en:['Look into each other’s eyes for ten seconds. No looking away!','Name three things you admire about each other.','Pick a song that reminds you of each other and dance a little.','Share a detail you still remember from your first date.','Give each other a long hug. The phone can wait.','Plan a different kind of date for this week.']};
  const status={roulette:{key:'rouletteIdle'},mines:{key:'minesIdle'},sequence:{key:'seqIdle'}};
  let challengeIndex=null;
  function text(key,arg){const v=strings[lang()][key];return typeof v==='function'?v(arg):v;}
  function setStatus(game,key,arg){status[game]={key,arg};$(game+'-result').textContent=text(key,arg);}
  function rouletteLabels(){ $('spin-button').disabled=spinning;$('spin-button').textContent=text(spinning?'spinWait':challengeIndex===null?'spin':'spinAgain');$('roulette-result').textContent=challengeIndex!==null&&!spinning?challenges[lang()][challengeIndex]:text(status.roulette.key,status.roulette.arg);}
  $('spin-button').addEventListener('click',()=>{
    if(spinning)return;spinning=true;challengeIndex=null;setStatus('roulette','spinning');rouletteLabels();
    const result=Math.floor(Math.random()*6);rotation=Math.ceil(rotation/360)*360+1800+((360-result*60)%360);
    document.querySelector('.demo-wheel').style.transform=`rotate(${rotation}deg)`;
    const reduced=document.documentElement.classList.contains('motion-off')||matchMedia('(prefers-reduced-motion: reduce)').matches;
    spinTimer=setTimeout(()=>{spinning=false;challengeIndex=result;rouletteLabels();},reduced?80:1850);
  });
  function renderMines(){
    $('mines-turn').textContent=mines.done?text('roundOver'):text('turn',mines.player);$('mines-count').textContent=`${[...mines.opened].filter(i=>i!==mines.bomb).length} / 15`;
    document.querySelectorAll('.mine-cell').forEach((cell,i)=>{const opened=mines.opened.has(i),bomb=opened&&i===mines.bomb;cell.disabled=opened||mines.done;cell.classList.toggle('safe',opened&&!bomb);cell.classList.toggle('bomb',bomb);cell.classList.toggle('finished',mines.done);cell.setAttribute('aria-label',text(bomb?'bombCell':opened?'safeCell':'cell',i+1));cell.replaceChildren();if(bomb){const img=new Image();img.src='assets/game-mines.webp';img.alt='';cell.append(img);}else cell.textContent=opened?'♡':'✦';});
    $('mines-result').textContent=text(status.mines.key,status.mines.arg);
  }
  function resetMines(){mines=new MineRound();setStatus('mines','minesIdle');renderMines();}
  const grid=document.querySelector('.demo-mines-grid');
  for(let i=0;i<16;i++){const cell=document.createElement('button');cell.type='button';cell.className='mine-cell';cell.addEventListener('click',()=>{const result=mines.reveal(i);if(!result)return;setStatus('mines',result.bomb?'minesBomb':result.won?'minesWin':'minesSafe',result.bomb?result.player:result.next);renderMines();});grid.append(cell);}
  $('reset-mines').addEventListener('click',resetMines);
  function seqLabels(){const busy=sequence.phase==='show'||sequence.phase==='input'||sequence.phase==='complete';$('start-sequence').disabled=busy;$('start-sequence').textContent=text(sequence.phase==='show'||sequence.phase==='complete'?'playing':sequence.phase==='input'?'input':sequence.phase==='idle'?'start':'restart');$('sequence-round').textContent=text('round',Math.max(1,sequence.pattern.length));$('sequence-best').textContent=text('record',best);pads.forEach((pad,i)=>{pad.disabled=sequence.phase!=='input';pad.setAttribute('aria-label',text('pad',i+1));});$('sequence-result').textContent=text(status.sequence.key,status.sequence.arg);}
  function resetSequence(){sequenceToken++;sequence=new SequenceRound();pads.forEach(p=>p.classList.remove('lit'));setStatus('sequence','seqIdle');seqLabels();}
  const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  async function showSequence(token){
    const player=sequence.pattern.length%2?1:2;setStatus('sequence','seqWatch',player);seqLabels();await pause(650);if(token!==sequenceToken)return;
    for(const value of sequence.pattern){pads[value].classList.add('lit');setStatus('sequence','seqLit',value+1);await pause(650);if(token!==sequenceToken)return;pads[value].classList.remove('lit');await pause(250);if(token!==sequenceToken)return;}
    sequence.ready();setStatus('sequence','seqInput',player);seqLabels();
  }
  $('start-sequence').addEventListener('click',()=>{resetSequence();sequence.extend();showSequence(sequenceToken);});
  pads.forEach((pad,i)=>pad.addEventListener('click',async()=>{
    const result=sequence.press(i);if(!result)return;const token=sequenceToken;pad.classList.add('lit');setTimeout(()=>{if(token===sequenceToken)pad.classList.remove('lit');},160);
    if(result==='lost'){setStatus('sequence','seqLost',sequence.completed);seqLabels();return;}
    if(result==='complete'){best=Math.max(best,sequence.completed);setStatus('sequence','seqCorrect',sequence.completed);seqLabels();await pause(1000);if(token!==sequenceToken)return;if(sequence.completed>=8){sequence.phase='won';setStatus('sequence','seqWin');seqLabels();return;}sequence.extend();showSequence(token);}
  }));
  function stopPending(){clearTimeout(spinTimer);spinning=false;if(status.roulette.key==='spinning')setStatus('roulette','rouletteIdle');rouletteLabels();resetSequence();}
  function selectDemo(name){if(name!==active)stopPending();active=name;tabs.forEach(tab=>{const selected=tab.dataset.demo===name;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;$('demo-'+tab.dataset.demo).hidden=!selected;});}
  tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectDemo(tab.dataset.demo));tab.addEventListener('keydown',event=>{let n;if(event.key==='ArrowRight')n=(i+1)%tabs.length;if(event.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;if(event.key==='Home')n=0;if(event.key==='End')n=tabs.length-1;if(n!==undefined){event.preventDefault();selectDemo(tabs[n].dataset.demo);tabs[n].focus();}});});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&(spinning||sequence.phase==='show'||sequence.phase==='input'||sequence.phase==='complete'))stopPending();});
  document.addEventListener('sintonia:language',()=>{rouletteLabels();renderMines();seqLabels();});
  resetMines();resetSequence();rouletteLabels();
})();
