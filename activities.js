import {campusHTML,campusRoute} from './campus.js?v=20261018.v11';
import {shuffle} from './game.js?v=20261018.v11';
import {illustration} from './illustrations.js?v=20261018.v11';
import {companion} from './characters.js?v=20261018.v11';

// One controller per round. A revision prevents interrupted speech or timers
// from changing a later page or a newly started round.
export class Activity {
  constructor({unit,count,speak,delay,render,complete,active,success=async()=>true,reducedMotion=false}) {
    Object.assign(this,{unit,count,speak,delay,redraw:render,complete,active,success,reducedMotion});
    this.type=unit.games.type;
    this.results=unit.words.map(w=>({kind:this.type,target:w.id,attempts:0,hint:false}));
    this.order=shuffle(unit.words.map(w=>w.id));
    if(this.type==='map')this.order=[...shuffle(this.order.filter(w=>w!=='classroom')),'classroom'];
    this.board=shuffle(unit.words.flatMap(w=>[{word:w.id},{word:w.id}]));
    this.found=new Set();this.open=[];this.step=0;this.misses=0;
    this.locked=true;this.phase='prompt';this.revision=0;this.help=false;this.message='';
    this.room=null;this.dressed=null;this.makeOptions();
  }
  cancel(){this.revision++;this.locked=true;}
  valid(revision){return this.active()&&this.revision===revision;}
  get target(){return this.order[this.step];}
  get done(){return this.type==='memory'?this.found.size:this.step;}
  result(word){return this.results.find(r=>r.target===word);}
  makeOptions(){if(this.type==='roles')this.options=shuffle([this.target,...shuffle(this.unit.words.map(w=>w.id).filter(w=>w!==this.target)).slice(0,this.count-1)]);}
  async audio(parts){const r=++this.revision;this.locked=true;this.redraw();const ok=await this.speak(parts);if(!ok||!this.valid(r))return false;this.locked=false;this.redraw();return true;}
  async begin(){if(!await this.audio([{text:this.unit.games.intro,lang:'zh-TW'}]))return;await this.prompt();}
  async prompt(){this.phase='prompt';this.message='';const parts=this.type==='memory'?[this.unit.question]:[this.unit.question,this.target];if(await this.audio(parts)){this.phase='answer';this.redraw();}}
  async replay(){if(this.phase==='walking')return;if(this.type==='memory'&&this.open.length===2&&this.phase!=='feedback'){this.open=[];this.help=false;}if(this.phase==='feedback')await this.resolveFeedback();else if(this.type==='memory'&&this.open.length===1){this.phase='answer';await this.audio([this.board[this.open[0]].word]);}else await this.prompt();}
  async resume(){this.revision++;if(this.phase==='walking'){await this.walkToRoom();return;}if(this.phase==='feedback')await this.resolveFeedback();else if(this.type==='memory'&&this.open.length===2){this.open=[];await this.prompt();}else await this.replay();}
  hint(){if(this.misses<3||this.locked)return;this.help=true;if(this.type==='memory'){const word=this.open.length===1?this.board[this.open[0]].word:this.unit.words.find(w=>!this.found.has(w.id)).id;this.hintWord=word;this.result(word).hint=true;}else this.result(this.target).hint=true;this.redraw();}
  async flip(n){if(this.locked||this.phase!=='answer'||this.open.includes(n)||!this.board[n]||this.found.has(this.board[n].word))return;
    this.open.push(n);this.message='';this.phase='reveal';
    if(!await this.audio([this.board[n].word]))return;
    if(this.open.length===1){this.phase='answer';this.redraw();return;}
    const [a,b]=this.open.map(i=>this.board[i].word);
    this.result(a).attempts++;if(a!==b)this.result(b).attempts++;
    if(a===b){this.pending=a;this.pendingSound=true;this.phase='feedback';await this.resolveFeedback();}
    else{this.misses++;this.phase='mismatch';this.locked=true;this.message='再看一看，找兩張一樣的 ♡';this.redraw();const r=++this.revision;if(!await this.delay(1400)||!this.valid(r))return;this.open=[];this.help=false;this.phase='answer';this.locked=false;this.redraw();}
  }
  async choose(word){if(this.locked||this.phase!=='answer')return;
    const result=this.result(this.target);result.attempts++;
    if(word!==this.target){this.misses++;this.message='再試一次 ♡';this.wrong=word;this.phase='retry';if(!await this.audio(this.misses===2?[this.unit.question,this.target]:[{text:'再試一次',lang:'zh-TW'}]))return;this.phase='answer';this.wrong=null;this.redraw();return;}
    this.pending=word;this.pendingSound=true;if(this.type==='map'){await this.walkToRoom();return;}this.phase='feedback';this.dressed=word;
    await this.resolveFeedback();
  }
  async walkToRoom(){
    this.phase='walking';this.locked=true;this.message='一起沿走廊走過去！';
    this.route=campusRoute(this.room,this.pending);
    const r=++this.revision;this.redraw();
    if(!this.reducedMotion&&(!await this.delay(1000)||!this.valid(r)))return;
    if(!this.valid(r))return;
    this.room=this.pending;this.route=null;await this.resolveFeedback();
  }
  async resolveFeedback(){this.phase='feedback';this.locked=true;this.message=this.type==='map'?'✓ 到了！一起說說看':'✓ 找到了！一起說說看';this.redraw();
    const r=++this.revision;if(this.pendingSound){this.pendingSound=false;if(!await this.success()||!this.valid(r))return;}const ok=await this.speak([this.unit.answer.replace('{word}',this.pending)]);
    if(!ok||!this.valid(r)||!await this.delay(1800)||!this.valid(r))return;
    if(this.type==='memory'){this.found.add(this.pending);this.open=[];}else this.step++;
    if(this.done===this.unit.words.length){this.complete(this.results);return;}
    this.phase='answer';this.locked=false;this.help=false;this.hintWord=null;this.misses=0;this.message='';this.pending=null;this.makeOptions();this.redraw();
    if(this.type!=='memory')await this.prompt();
  }
  render(){const type=this.type,total=this.unit.words.length;
    const progress=`<div class="top"><span class="muted">${this.unit.games.title} · ${this.done} / ${total}</span><div class="progress" aria-label="已完成 ${this.done} 個">${this.unit.words.map((_,i)=>`<span class="${i<this.done?'done':''}"></span>`).join('')}</div></div>`;
    const controls=`<div class="activity-toolbar"><button class="speaker" data-activity="replay" ${this.phase==='walking'?'disabled':''}>🔊 再聽一次</button>${this.misses>=3?`<button data-activity="hint" ${this.locked?'disabled':''}>💡 幫幫我</button>`:''}</div>`;
    let body='';
    if(type==='memory')body=`<div class="activity-guide">${companion(this.phase==='feedback'?'boing':'wave')}<p>翻一翻，找兩張一樣的物品</p></div>${controls}<div class="memory-board">${this.board.map((c,i)=>{const found=this.found.has(c.word),open=this.open.includes(i);return `<button class="memory-card answer ${found?'matched':''} ${this.help&&c.word===this.hintWord?'hint':''}" data-activity="flip" data-tile="${i}" aria-label="${found?'已配對 '+c.word:open?c.word:'翻開第 '+(i+1)+' 張卡片'}" ${this.locked||found||open?'disabled':''}>${found||open?illustration(c.word):'<span class="card-back" aria-hidden="true">✦</span>'}${found?'<span class="match-tick">✓</span>':''}</button>`;}).join('')}</div>`;
    if(type==='roles')body=`<div class="role-stage ${this.phase==='feedback'?'posing':''}"><div class="role-character role-${this.dressed?.replaceAll(' ','-')||'none'}">${companion(this.phase==='feedback'?'boing':'wave',this.dressed||'guide')}</div><div class="stage-label">${this.phase==='feedback'?'角色登場！':'今天我來當…'}<small>選一張人物卡</small></div></div>${controls}<div class="role-options ${this.options.length===3?'three':'two'}">${this.options.map(word=>`<button class="role-card answer ${this.help&&word===this.target?'hint':''} ${this.wrong===word?'wrong':''}" data-activity="choose" data-word="${word}" aria-label="${word}" ${this.locked?'disabled':''}>${illustration(word)}<span aria-hidden="true">${{teacher:'📖',friend:'🎈','bus driver':'🚌',cook:'🥄'}[word]}</span></button>`).join('')}</div>`;
    if(type==='map')body=`<div class="map-caption"><span>${this.room?'到下一個地方探險！':'陪小女孩一起出發'}</span><small>聽聲音，點地圖上的房間</small></div>${controls}${campusHTML({unit:this.unit,room:this.room,route:this.route,moving:this.phase==='walking'&&!this.reducedMotion,locked:this.locked,help:this.help,target:this.target,wrong:this.wrong})}`;
    return `${progress}<section class="activity ${type}">${body}<div class="activity-status status" role="status">${this.message||'慢慢來，沒有時間限制 ♡'}</div><div id="audio-status" role="alert"></div></section>`;
  }
}
