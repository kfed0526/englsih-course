import {shuffle} from './game.js';
import {bodyArt,faceSVG,robotSVG} from './body-art.js';
import {questionFor,answersFor} from './lesson-text.js';

export const BODY_TYPES=['face-count','body-touch','robot-matching','senses-link'];
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export class BodyActivity{
 constructor({unit,speak,delay,render,complete,active,success=async()=>true}){
  Object.assign(this,{unit,speak,delay,redraw:render,complete,active,success});
  this.type=unit.games.type;this.step=0;this.revision=0;this.locked=true;this.phase='prompt';this.message='';this.misses=0;this.help=false;this.selected=null;this.completed=false;
  this.tasks=shuffle(unit.words).map(w=>({word:w.id,kind:this.type==='robot-matching'?'robot-match':this.type}));
  if(this.type==='robot-matching'){const available=shuffle([true,true,false,false]);this.tasks.push(...shuffle(unit.words).map((w,i)=>({word:w.id,kind:'robot-check',available:available[i]})));}
  this.results=this.tasks.map(t=>({kind:t.kind,target:t.word,attempts:0,hint:false}));
  this.options=shuffle(unit.words.map(w=>w.id));this.objects=shuffle(unit.words.map(w=>w.object).filter(Boolean));this.links=[];this.installed=[];
 }
 get total(){return this.tasks.length;}
 get done(){return this.step;}
 get task(){return this.tasks[this.step];}
 get word(){return this.unit.words.find(w=>w.id===this.task?.word);}
 get result(){return this.results[this.step];}
 valid(revision){return !this.completed&&this.active()&&this.revision===revision;}
 cancel(){this.revision++;this.locked=true;}
 async audio(parts){const r=++this.revision;this.locked=true;this.redraw();const ok=await this.speak(parts);if(!ok||!this.valid(r))return false;this.locked=false;return true;}
 async begin(){if(await this.audio([{text:this.unit.games.intro,lang:'zh-TW'}]))await this.prompt();}
 async prompt(){
  if(this.completed)return;this.phase='prompt';this.message='';
  const parts=[questionFor(this.unit,this.word)];
  if(this.type==='body-touch')parts.push(this.word.id);
  if(this.task.kind==='robot-check')parts.unshift({text:'看機器人這個部位在不在，選可以或還不行。',lang:'zh-TW'});
  if(await this.audio(parts)){this.phase='answer';this.redraw();}
 }
 async replay(){if(this.completed)return;if(this.phase==='feedback')await this.resolveFeedback();else await this.prompt();}
 async resume(){this.revision++;await this.replay();}
 hint(){if(this.locked||this.misses<3||this.phase!=='answer')return;this.help=true;this.result.hint=true;this.redraw();}
 async select(value){
  if(this.locked||this.phase!=='answer'||!this.options.includes(value))return;
  if(this.links.some(link=>link.word===value))return;
  this.selected=value;this.message=this.type==='senses-link'?'再點右邊的物品，連起來！':'再點右邊機器人的位置！';
  if(await this.audio([value]))this.redraw();
 }
 async connect(value){
  if(this.locked||this.phase!=='answer'||!this.selected)return;
  const allowed=this.type==='senses-link'?this.objects:this.options;
  if(!allowed.includes(value)||this.links.some(link=>link.object===value))return;
  const correct=this.selected===this.word.id&&value===(this.type==='senses-link'?this.word.object:this.word.id);
  await this.attempt(correct);
 }
 async answer(value){
  if(this.locked||this.phase!=='answer')return;
  if(this.type==='face-count'&&!['one','two'].includes(value))return;
  if(this.type==='body-touch'&&!this.options.includes(value))return;
  if(this.task.kind==='robot-check'&&!['yes','no'].includes(value))return;
  const expected=this.type==='face-count'?this.word.number:this.task.kind==='robot-check'?(this.task.available?'yes':'no'):this.word.id;
  await this.attempt(value===expected);
 }
 async attempt(correct){
  this.result.attempts++;this.locked=true;
  if(!correct){
   this.misses++;this.selected=null;this.phase='retry';this.message='再試一次 ♡';
   if(await this.audio([{text:'再試一次',lang:'zh-TW'}])){this.phase='answer';this.redraw();}return;
  }
  this.phase='feedback';this.pendingSound=true;
  if(this.task.kind==='robot-match'&&!this.installed.includes(this.word.id))this.installed.push(this.word.id);
  if(this.type==='senses-link'&&!this.links.some(link=>link.word===this.word.id))this.links.push({word:this.word.id,object:this.word.object});
  await this.resolveFeedback();
 }
 async resolveFeedback(){
  this.phase='feedback';this.locked=true;this.message='✓ 找到了！一起說說看';this.redraw();
  const r=++this.revision;
  if(this.pendingSound){this.pendingSound=false;if(!await this.success()||!this.valid(r))return;}
  const answers=answersFor(this.unit,this.word),reply=this.task.kind==='robot-check'&&!this.task.available?answers[1]:answers[0];
  if(!await this.speak([reply])||!this.valid(r)||!await this.delay(1200)||!this.valid(r))return;
  this.step++;this.selected=null;this.misses=0;this.help=false;this.message='';
  if(this.step===this.total){this.completed=true;this.complete(this.results);return;}
  await this.prompt();
 }
 render(){
  const word=this.word||this.unit.words[0],task=this.task||this.tasks[0];
  const lock=this.locked?'disabled':'';
  const button=(action,value,content,label,hint=false,extra='')=>`<button class="answer body-choice ${this.help&&hint?'hint':''} ${extra}" data-body="${action}" data-value="${escape(value)}" aria-label="${escape(label)}" ${lock}>${content}</button>`;
  let surface='';
  if(this.type==='face-count')surface=`<div class="face-mirror">${faceSVG(word.id)}<span class="body-target">${escape(word.zh)}</span></div><div class="count-choices">${['one','two'].map(n=>button('answer',n,`<span class="count-dots" aria-hidden="true">${n==='one'?'●':'● ●'}</span><strong>${n==='one'?'1':'2'}</strong>`,n,n===word.number)).join('')}</div>`;
  if(this.type==='body-touch')surface=`<div class="touch-cards">${this.options.map(id=>button('answer',id,bodyArt(id),id,id===word.id)).join('')}</div><p class="body-note">找到後，也可以摸摸自己的這個部位 ♡</p>`;
  if(this.type==='robot-matching'){
   const check=task.kind==='robot-check';
   surface=`<div class="robot-preview">${robotSVG({focus:word.id,missing:check&&!task.available?word.id:'',installed:this.installed})}<span>${check?'替機器人回答':`零件 ${this.installed.length} / 4`}</span></div>`;
   if(check)surface+=`<div class="robot-responses">${button('answer','yes','<b aria-hidden="true">✓</b><span>Yes<br>可以</span>','Yes, I can',task.available)}${button('answer','no','<b aria-hidden="true">○</b><span>No<br>還不行</span>','No, I cannot',!task.available)}</div>`;
   else surface+=`<div class="robot-pair-board"><div><p>① 點零件</p><div class="robot-pieces">${this.options.map(id=>button('select',id,bodyArt(id),id,id===word.id,this.selected===id?'selected':'')).join('')}</div></div><span class="match-arrow" aria-hidden="true">→</span><div><p>② 點位置</p><div class="robot-slots">${this.options.map(id=>button('connect',id,robotSVG({focus:id}),`放到 ${id}`,id===word.id,this.installed.includes(id)?'installed':'')).join('')}</div></div></div>`;
  }
  if(this.type==='senses-link'){
   const y=(i)=>(i+.5)*100;
   surface=`<div class="senses-board"><svg class="sense-lines" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">${this.links.map(link=>`<path d="M440 ${y(this.options.indexOf(link.word))} C510 ${y(this.options.indexOf(link.word))} 490 ${y(this.objects.indexOf(link.object))} 560 ${y(this.objects.indexOf(link.object))}"/>`).join('')}</svg><div class="sense-left">${this.options.map(id=>{const w=this.unit.words.find(w=>w.id===id),done=this.links.some(l=>l.word===id);return `<button class="answer sense-choice ${done?'linked':''} ${this.selected===id?'selected':''} ${this.help&&id===word.id?'hint':''}" data-body="select" data-value="${id}" aria-label="${id}" ${this.locked||done?'disabled':''}>${bodyArt(w.organ)}<span>${id}</span>${done?'<b>✓</b>':''}</button>`;}).join('')}</div><div class="sense-right">${this.objects.map(id=>{const w=this.unit.words.find(w=>w.object===id),done=this.links.some(l=>l.object===id);return `<button class="answer sense-choice ${done?'linked':''} ${this.help&&id===word.object?'hint':''}" data-body="connect" data-value="${id}" aria-label="${w.objectZh}" ${this.locked||done?'disabled':''}>${bodyArt(id)}<span>${w.objectZh}</span>${done?'<b>✓</b>':''}</button>`;}).join('')}</div></div>`;
  }
  return `<div class="top"><span class="muted">${escape(this.unit.games.title)} · ${this.step} / ${this.total}</span><div class="progress body-progress" aria-label="已完成 ${this.step} 題">${this.tasks.map((_,i)=>`<span class="${i<this.step?'done':''}"></span>`).join('')}</div></div><section class="body-game ${this.type}"><div class="body-game-heading"><p>${this.type==='face-count'?'數數亮起的部位':this.type==='body-touch'?'聽聲音，找身體部位':this.type==='robot-matching'?(task.kind==='robot-check'?'看看部位在不在':'幫機器人配對零件'):'先點感官，再點物品'}</p><button class="speaker" data-body="replay">🔊 再聽一次</button></div>${surface}<div class="body-status" role="status">${this.message||'慢慢來，沒有時間限制 ♡'}${this.misses>=3?` <button data-body="hint" ${lock}>💡 幫幫我</button>`:''}</div><div id="audio-status" role="alert"></div></section>`;
 }
}
