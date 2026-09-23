(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.SintoniaDemoCore=api;})(typeof globalThis!=='undefined'?globalThis:this,()=>{
  'use strict';
  class MineRound {
    constructor(bomb=Math.floor(Math.random()*16)){if(!Number.isInteger(bomb)||bomb<0||bomb>15)throw new RangeError('Invalid bomb');this.bomb=bomb;this.opened=new Set();this.player=1;this.done=false;}
    reveal(index){if(this.done||!Number.isInteger(index)||index<0||index>15||this.opened.has(index))return null;const player=this.player;this.opened.add(index);const bomb=index===this.bomb;this.done=bomb||this.opened.size===15;if(!this.done)this.player=3-this.player;return{index,player,bomb,won:!bomb&&this.done,done:this.done,count:this.opened.size,next:this.player};}
  }
  class SequenceRound {
    constructor(){this.pattern=[];this.cursor=0;this.phase='idle';this.completed=0;}
    extend(value=Math.floor(Math.random()*4)){if(this.phase==='input'||this.phase==='show')return false;this.pattern.push(value);this.cursor=0;this.phase='show';return true;}
    ready(){if(this.phase==='show')this.phase='input';}
    press(value){if(this.phase!=='input')return null;if(value!==this.pattern[this.cursor]){this.phase='lost';return 'lost';}this.cursor++;if(this.cursor===this.pattern.length){this.completed=this.pattern.length;this.phase='complete';return 'complete';}return 'correct';}
  }
  return {MineRound,SequenceRound};
});
