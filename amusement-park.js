export const PARK_MODES={wheel:'🎡 摩天輪',carousel:'🎠 旋轉木馬',train:'🚂 動物小火車',fireworks:'🎆 夜空煙火'};
export const PARK_COLORS={gold:{name:'金色',hex:'#ffda78'},pink:{name:'粉紅色',hex:'#ffa2c7'},mint:{name:'薄荷綠',hex:'#9ee3bc'},blue:{name:'天空藍',hex:'#9ccfff'}};
export const FIREWORK_PATTERNS={ring:'圓圓花',star:'星星花',heart:'愛心花'};
export const TRAIN_FRIENDS=[{id:'bear',name:'小熊',icon:'🐻'},{id:'rabbit',name:'小兔',icon:'🐰'},{id:'cat',name:'小貓',icon:'🐱'}];
export const RIDE_SECONDS=5;

// This visit is kept in memory only, separate from course and festival records.
export class AmusementVisit{
 constructor(){this.reset();}
 reset(){this.mode='wheel';this.paused=false;this.stamps=new Set();this.color='gold';this.pattern='ring';this.rides={wheel:{phase:'ready',elapsed:0},train:{phase:'boarding',elapsed:0}};this.notes=[];this.passengers=[];this.bursts=[];this.launched=0;this.serial=0;this.showing=false;this.showIndex=0;}
 selectMode(mode){if(!Object.hasOwn(PARK_MODES,mode))return false;const ride=this.rides[this.mode];if(ride?.phase==='riding')ride.phase='ready';this.mode=mode;this.paused=false;this.showing=false;this.showIndex=0;this.bursts=[];return true;}
 chooseColor(color){if(this.paused||this.showing||!Object.hasOwn(PARK_COLORS,color))return false;this.color=color;return true;}
 choosePattern(pattern){if(this.paused||this.showing||!Object.hasOwn(FIREWORK_PATTERNS,pattern))return false;this.pattern=pattern;return true;}
 collectNote(id){if(this.paused||this.mode!=='carousel'||!['0','1','2'].includes(String(id))||this.notes.includes(String(id)))return false;this.notes.push(String(id));if(this.notes.length===3)this.stamps.add('carousel');return true;}
 board(id){if(this.paused||this.mode!=='train'||this.rides.train.phase==='riding'||!TRAIN_FRIENDS.some(friend=>friend.id===id)||this.passengers.includes(id))return false;this.passengers.push(id);if(this.passengers.length===3)this.rides.train.phase='ready';return true;}
 startRide(){const ride=this.rides[this.mode];if(this.paused||!ride||ride.phase!=='ready')return false;ride.phase='riding';return true;}
 advance(seconds){const ride=this.rides[this.mode];if(this.paused||!ride||ride.phase!=='riding'||!Number.isFinite(seconds)||seconds<=0)return false;ride.elapsed=Math.min(RIDE_SECONDS,ride.elapsed+Math.min(seconds,.1));if(ride.elapsed<RIDE_SECONDS)return false;ride.phase='complete';this.stamps.add(this.mode);return true;}
 replayRide(){if(this.paused||!this.stamps.has(this.mode))return false;if(this.mode==='wheel')this.rides.wheel={phase:'ready',elapsed:0};else if(this.mode==='train'){this.rides.train={phase:'boarding',elapsed:0};this.passengers=[];}else if(this.mode==='carousel')this.notes=[];else return false;return true;}
 launch(point={x:.5,y:.4}){if(this.paused||this.mode!=='fireworks'||this.bursts.length>=6||!Number.isFinite(point?.x)||!Number.isFinite(point?.y))return null;const burst={id:++this.serial,x:Math.max(.2,Math.min(.8,point.x)),y:Math.max(.25,Math.min(.7,point.y)),color:this.color,pattern:this.pattern};this.bursts.push(burst);this.launched++;if(this.launched>=3)this.stamps.add('fireworks');return burst;}
}

export function amusementParkHTML(){return `<section class="amusement-game"><div class="ap-heading"><div><p class="eyebrow">NICKSON'S TWILIGHT PARK · 兒童樂園</p><h1>玩一圈，再看一場煙火</h1><p>選喜歡的設施慢慢玩，也可以直接去放煙火。</p></div><img src="assets/characters/nickson-panda-home.png" alt="Nickson 陪你遊園"/></div><nav class="ap-modes" aria-label="選擇樂園遊戲">${Object.entries(PARK_MODES).map(([id,name])=>`<button data-amusement="mode" data-amusement-value="${id}">${name}</button>`).join('')}</nav><div class="ap-layout"><div class="ap-stage"><img class="ap-background" src="assets/amusement-twilight-watercolor.webp" alt="黃昏的兒童樂園：摩天輪、旋轉木馬、動物小火車與寬廣夜空" draggable="false"/><div class="ap-play-board"></div><div class="ap-paused-shade" hidden>🌙 休息一下，準備好再繼續</div></div><aside class="ap-controls"><div class="ap-stamps" aria-label="這次遊園收集的印章"></div><h2 class="ap-title"></h2><p class="ap-instruction"></p><div class="ap-options"></div><p class="ap-status" role="status" aria-live="polite"></p><div class="ap-main-actions"></div><div class="ap-tools"><button data-amusement="pause">暫停</button><button data-amusement="reset">重新遊園</button></div><p class="ap-note">三個遊樂設施都有遊園章，煙火隨時可以玩。</p></aside></div></section>`;}

const coloredChoices=(state,disabled)=>`<div class="ap-color-choices" role="group" aria-label="選擇顏色">${Object.entries(PARK_COLORS).map(([id,color])=>`<button data-amusement="color" data-amusement-value="${id}" aria-pressed="${state.color===id}" style="--choice-color:${color.hex}" ${disabled?'disabled':''}><span aria-hidden="true"></span>${color.name}</button>`).join('')}</div>`;
const wheelArt=()=>`<svg class="ap-wheel-art" viewBox="0 0 400 320" aria-hidden="true"><path d="M145 305L200 148L255 305" fill="#c9b48b" stroke="#765f45" stroke-width="8"/><g class="ap-wheel-rotation">${[80,110].map(r=>`<circle cx="200" cy="148" r="${r}" fill="none" stroke="#edce7b" stroke-width="6"/>`).join('')}${Array.from({length:8},(_,i)=>{const angle=i*Math.PI/4,x=200+110*Math.cos(angle),y=148+110*Math.sin(angle);return `<path d="M200 148L${x} ${y}" stroke="#a2b6a2" stroke-width="4"/><g style="transform-origin:${x}px ${y}px" class="ap-wheel-cabin"><path d="M${x-18} ${y}h36v25q-18 14-36 0Z" fill="var(--ap-color)" stroke="#7e735e" stroke-width="3"/><path d="M${x-13} ${y+4}h26v10h-26Z" fill="#fff5d8"/></g>`;}).join('')}<circle cx="200" cy="148" r="12" fill="#fff1b5"/></g><path d="M125 308H275" stroke="#765f45" stroke-width="10" stroke-linecap="round"/></svg>`;
const carouselArt=()=>`<div class="ap-carousel-art" aria-hidden="true"><svg viewBox="0 0 400 260"><path d="M200 15L45 95H355Z" fill="#d79883" stroke="#896c51" stroke-width="4"/><path d="M200 15L130 95H270Z" fill="#f5dfae"/><ellipse cx="200" cy="220" rx="155" ry="25" fill="#ba9468" stroke="#896c51" stroke-width="4"/>${[95,200,305].map(x=>`<path d="M${x} 94V220" stroke="#e0bc70" stroke-width="7"/>`).join('')}<path d="M45 95Q200 140 355 95" fill="#efd49e" stroke="#896c51" stroke-width="4"/></svg><div class="ap-horses"><span>🎠</span><span>🐴</span><span>🎠</span></div></div>`;

export function burstHTML(burst,reducedMotion=false){const color=PARK_COLORS[burst.color].hex;const shape=burst.pattern==='heart'?'<path d="M0 52C-95 0-48-72 0-24C48-72 95 0 0 52Z"/>':burst.pattern==='star'?'<path d="M0-72L18-23L69-22L29 9L43 60L0 30L-43 60L-29 9L-69-22L-18-23Z"/>':'<circle r="60"/>';return `<span class="ap-burst ${reducedMotion?'ap-burst-still':''}" data-burst="${burst.id}" style="left:${burst.x*100}%;top:${burst.y*100}%;--burst-color:${color}"><svg viewBox="-100 -100 200 200" aria-hidden="true"><g class="ap-burst-shape" fill="none" stroke="currentColor" stroke-width="4">${shape}</g>${Array.from({length:16},(_,i)=>{const a=i*Math.PI/8;return `<path d="M${Math.cos(a)*76} ${Math.sin(a)*76}l${Math.cos(a)*14} ${Math.sin(a)*14}" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`;}).join('')}<circle r="5" fill="#fff4c0"/></svg></span>`;}

export class AmusementSession{
 constructor({root,state=new AmusementVisit(),reducedMotion=false,unlock=()=>{},effect=()=>{},stopAudio=()=>{},visible=()=>!document.hidden,requestFrame=fn=>requestAnimationFrame(fn),cancelFrame=id=>cancelAnimationFrame(id),schedule=(fn,ms)=>setTimeout(fn,ms),cancel=id=>clearTimeout(id)}){Object.assign(this,{root,state,reducedMotion,unlock,effect,stopAudio,visible,requestFrame,cancelFrame,schedule,cancel});this.destroyed=false;this.frame=null;this.last=null;this.revision=0;this.timers=new Set();this.click=event=>{const button=event.target.closest('[data-amusement]');if(!button||!this.root.contains(button)||button.disabled)return;const rect=button.getBoundingClientRect();const point=button.classList.contains('ap-sky')&&event.detail?{x:(event.clientX-rect.left)/rect.width,y:(event.clientY-rect.top)/rect.height}:undefined;this.action(button.dataset.amusement,button.dataset.amusementValue,point);};}
 mount(){this.root.addEventListener('click',this.click);this.paint();}
 clear(){this.revision++;if(this.frame!==null)this.cancelFrame(this.frame);this.frame=null;this.last=null;this.timers.forEach(id=>this.cancel(id));this.timers.clear();this.state.bursts=[];this.stopAudio();}
 later(work,ms){const revision=this.revision;const id=this.schedule(()=>{this.timers.delete(id);if(!this.destroyed&&!this.state.paused&&revision===this.revision&&this.visible())work();},ms);this.timers.add(id);}
 action(action,value,point){
  if(this.destroyed||!this.visible())return;
  this.unlock();const s=this.state;
  if(action==='reset'){this.clear();s.reset();this.paint(true);return;}
  if(action==='pause'){this.pause();return;}
  if(action==='resume'){this.resume();return;}
  if(s.paused)return;
  if(action==='mode'){if(!Object.hasOwn(PARK_MODES,value))return;this.clear();s.selectMode(value);this.paint(true);return;}
  if(action==='color'){if(s.chooseColor(value))this.paint(true);return;}
  if(action==='pattern'){if(s.choosePattern(value))this.paint(true);return;}
  if(action==='note'){if(s.collectNote(value)){this.effect(s.notes.length===3?'stamp':'note',s.notes.length*2);this.paint(true);}return;}
  if(action==='board'){if(s.board(value)){this.effect('note',this.state.passengers.length);this.paint(true);}return;}
  if(action==='replay'){if(s.replayRide()){this.clear();this.paint(true);}return;}
  if(action==='start'){if(s.startRide()){this.paint();this.animateRide();}return;}
  if(action==='launch'&&!s.showing){this.launch(point);return;}
  if(action==='show'&&!s.showing){this.clear();s.showing=true;s.showIndex=0;this.paint();this.showNext();}
 }
 animateRide(){
  if(this.reducedMotion){for(let n=0;n<51;n++)this.state.advance(.1);this.effect('stamp');this.paint(true);return;}
  const revision=this.revision;this.last=null;
  const tick=time=>{if(this.destroyed||this.state.paused||revision!==this.revision)return;this.frame=null;if(!this.visible()){this.pause();return;}const dt=this.last===null?0:(time-this.last)/1000;this.last=time;const complete=this.state.advance(dt);this.paintMotion();if(complete){this.effect('stamp');this.paint(true);}else this.frame=this.requestFrame(tick);};
  this.frame=this.requestFrame(tick);
 }
 launch(point){const burst=this.state.launch(point);if(!burst)return;this.effect('firework');this.paintBursts();this.paintStatus();this.later(()=>{this.state.bursts=this.state.bursts.filter(item=>item.id!==burst.id);this.paintBursts();},1800);}
 showNext(){const s=this.state;if(!s.showing)return;if(s.showIndex>=6){s.showing=false;this.paint(true);return;}const positions=[{x:.25,y:.4},{x:.7,y:.3},{x:.45,y:.6},{x:.75,y:.55},{x:.25,y:.65},{x:.5,y:.35}];this.launch(positions[s.showIndex++]);this.later(()=>this.showNext(),this.reducedMotion?1900:700);}
 pause(){if(this.destroyed||this.state.paused)return;this.state.paused=true;this.clear();this.paint();}
 resume(){if(this.destroyed||!this.state.paused||!this.visible())return;this.state.paused=false;this.paint();if(this.state.rides[this.state.mode]?.phase==='riding')this.animateRide();else if(this.state.showing)this.showNext();}
 paintBursts(){const layer=this.root.querySelector('.ap-bursts');if(!layer)return;const ids=new Set(this.state.bursts.map(burst=>String(burst.id)));layer.querySelectorAll('[data-burst]').forEach(node=>{if(!ids.has(node.dataset.burst))node.remove();});const existing=new Set([...layer.querySelectorAll('[data-burst]')].map(node=>node.dataset.burst));for(const burst of this.state.bursts)if(!existing.has(String(burst.id)))layer.insertAdjacentHTML('beforeend',burstHTML(burst,this.reducedMotion));}
 paintMotion(){const ride=this.state.rides[this.state.mode];if(!ride)return;const stage=this.root.querySelector('.ap-stage');stage.style.setProperty('--ride-angle',`${ride.elapsed/RIDE_SECONDS*360}deg`);stage.style.setProperty('--train-progress',`${ride.elapsed/RIDE_SECONDS*100}%`);const progress=this.root.querySelector('.ap-ride-progress');if(progress)progress.value=ride.elapsed;}
 paintStatus(){const s=this.state;this.root.querySelector('.ap-stamps').innerHTML=['wheel','carousel','train'].map(id=>`<span class="${s.stamps.has(id)?'collected':''}" aria-label="${PARK_MODES[id]}${s.stamps.has(id)?'已收集':'尚未收集'}">${s.stamps.has(id)?'✓':'○'} ${PARK_MODES[id].slice(3)}</span>`).join('');let text=s.paused?'休息一下，按繼續再玩。':s.mode==='fireworks'?s.showing?'煙火秀開始了，一起看天空！':s.launched>=3?'你的煙火在夜空開花了！還可以繼續自由放。':'選喜歡的顏色與花樣，再點天空。':s.stamps.has(s.mode)?'遊園章收到了！可以再玩，或去看煙火。':s.mode==='carousel'?`收集音符 ${s.notes.length} / 3`:s.mode==='train'?`上車的好朋友 ${s.passengers.length} / 3`:'選一個車廂顏色，準備出發。';if(s.stamps.has('wheel')&&s.stamps.has('carousel')&&s.stamps.has('train')&&s.mode!=='fireworks')text='三枚遊園章都收到了！準備看壓軸煙火吧。';this.root.querySelector('.ap-status').textContent=text;}
 paint(focus=false){
  const s=this.state,ride=s.rides[s.mode],disabled=s.paused||s.showing;
  this.root.querySelectorAll('[data-amusement="mode"]').forEach(button=>{button.setAttribute('aria-pressed',button.dataset.amusementValue===s.mode);button.disabled=s.paused;});
  const stage=this.root.querySelector('.ap-stage');stage.dataset.mode=s.mode;stage.classList.toggle('ap-reduced',this.reducedMotion);stage.style.setProperty('--ap-color',PARK_COLORS[s.color].hex);
  stage.classList.toggle('ap-paused',s.paused);
  this.root.querySelector('.ap-paused-shade').hidden=!s.paused;
  this.root.querySelector('.ap-title').textContent=PARK_MODES[s.mode];
  this.root.querySelector('.ap-instruction').textContent={wheel:'選車廂顏色，按出發，陪 Nickson 慢慢轉一圈。',carousel:'點亮三個不同的音符，讓小馬跟著旋律轉起來。',train:'點三位動物朋友上車，再按出發，沿著軌道繞一圈。',fireworks:'選顏色與花樣，點天空決定煙火的位置，或開始一場煙火秀。'}[s.mode];
  let board='',options='',main='';
  if(s.mode==='wheel'){board=`<div class="ap-ride-panel">${wheelArt()}<progress class="ap-ride-progress" max="${RIDE_SECONDS}" value="${ride.elapsed}" aria-label="摩天輪轉一圈的進度"></progress></div>`;options=coloredChoices(s,s.paused||ride.phase==='riding');}
  if(s.mode==='carousel'){board=`<div class="ap-ride-panel">${carouselArt()}<div class="ap-note-buttons">${['♪','♫','♬'].map((note,i)=>`<button data-amusement="note" data-amusement-value="${i}" ${s.paused||s.notes.includes(String(i))?'disabled':''} aria-label="收集第${i+1}個音符">${s.notes.includes(String(i))?'✓':note}</button>`).join('')}</div></div>`;}
  if(s.mode==='train'){board=`<div class="ap-ride-panel ap-train-panel"><div class="ap-train-track" aria-label="小火車沿著軌道繞圈"><div class="ap-train-motion"><span aria-hidden="true">🚂</span>${TRAIN_FRIENDS.map(friend=>`<span class="ap-carriage" aria-label="${friend.name}${s.passengers.includes(friend.id)?'已上車':'等待上車'}">${s.passengers.includes(friend.id)?friend.icon:'▢'}</span>`).join('')}</div></div><progress class="ap-ride-progress" max="${RIDE_SECONDS}" value="${ride.elapsed}" aria-label="小火車繞一圈的進度"></progress></div>`;options=`<div class="ap-friends" role="group" aria-label="邀請動物上車">${TRAIN_FRIENDS.map(friend=>`<button data-amusement="board" data-amusement-value="${friend.id}" ${s.paused||s.passengers.includes(friend.id)||ride.phase==='riding'?'disabled':''}><span>${friend.icon}</span>${friend.name}${s.passengers.includes(friend.id)?' ✓':'上車'}</button>`).join('')}</div>`;}
  if(s.mode==='fireworks'){board='<button class="ap-sky" data-amusement="launch" aria-label="點天空施放煙火"><span class="ap-sky-hint">✦ 點天空，放一朵煙火 ✦</span><span class="ap-bursts" aria-hidden="true"></span></button>';options=coloredChoices(s,disabled)+`<div class="ap-patterns" role="group" aria-label="選擇煙火花樣">${Object.entries(FIREWORK_PATTERNS).map(([id,name])=>`<button data-amusement="pattern" data-amusement-value="${id}" aria-pressed="${s.pattern===id}" ${disabled?'disabled':''}>${({ring:'◯',star:'☆',heart:'♡'})[id]} ${name}</button>`).join('')}</div>`;main=`<button class="primary" data-amusement="launch" ${disabled?'disabled':''}>🎆 放一朵煙火</button><button data-amusement="show" ${disabled?'disabled':''}>✨ 開始煙火秀</button>`;}
  if(ride)main=`<button class="primary" data-amusement="start" ${s.paused||ride.phase!=='ready'?'disabled':''}>${ride.phase==='riding'?'正在繞一圈…':ride.phase==='complete'?'✓ 這一圈完成了':ride.elapsed>0?'▶ 接著繞一圈':'▶ 出發，繞一圈'}</button>`;
  if(s.stamps.has(s.mode)&&s.mode!=='fireworks')main+='<button data-amusement="replay">再玩這個設施 ↻</button>';
  if(s.mode!=='fireworks')main+=`<button class="ap-finale-button" data-amusement="mode" data-amusement-value="fireworks">${['wheel','carousel','train'].every(id=>s.stamps.has(id))?'🎆 準備看壓軸煙火 →':'🎆 我想去放煙火 →'}</button>`;
  if(s.paused)main='<button class="primary" data-amusement="resume">▶ 繼續遊園</button>';
  this.root.querySelector('.ap-play-board').innerHTML=board;this.root.querySelector('.ap-options').innerHTML=options;this.root.querySelector('.ap-main-actions').innerHTML=main;
  this.root.querySelector('.ap-play-board').dataset.notes=String(s.notes.length);
  const sky=this.root.querySelector('.ap-sky');if(sky)sky.disabled=disabled;
  this.root.querySelector('.ap-tools [data-amusement="pause"]').disabled=s.paused;
  const horses=this.root.querySelector('.ap-horses');if(horses)horses.style.setProperty('--horse-shift',`${s.notes.length===0?0:s.notes.length%2?8:-8}px`);
  this.paintMotion();this.paintBursts();this.paintStatus();
  if(focus){const button=this.root.querySelector('.ap-main-actions button:not(:disabled)')||this.root.querySelector('[data-amusement="mode"][aria-pressed="true"]');button?.focus({preventScroll:true});}
 }
 destroy(){if(this.destroyed)return;this.destroyed=true;this.clear();const ride=this.state.rides[this.state.mode];if(ride?.phase==='riding')ride.phase='ready';this.state.showing=false;this.state.paused=false;this.root.removeEventListener('click',this.click);}
}
