import {PoliceVisit,POLICE_MISSIONS,BAG_CHOICES,REUNION_CHOICES,CROSS_MILLISECONDS} from './police-model.js?v=20261021.v1';
import {POLICE_CUES,policeCue,policeGuideLines} from './police-voice.js?v=20261021.v1';
import {policeBagArt,rabbitArt,roadArt} from './police-art.js?v=20261021.v1';
export {PoliceVisit,policeCatalog} from './police-model.js?v=20261021.v1';
export const POLICE_ASSETS={room:'assets/police-station-watercolor.webp',guide:'assets/characters/labrador-police-guide.webp'};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(action,value,label,disabled=false,extra='')=>`<button data-police="${action}" data-police-value="${escape(value)}" ${disabled?'disabled':''} ${extra}>${label}</button>`;
const picture=(icon,label)=>`<span class="pc-option-icon" aria-hidden="true">${icon}</span><span>${label}</span>`;
const guide=()=>`<img class="pc-dog" src="${POLICE_ASSETS.guide}" alt="拉拉：原創拉布拉多警犬隊長，微笑揮手" draggable="false"/>`;
export function policeHTML(){return `<section class="police-game"><div class="pc-heading"><div><p class="eyebrow">NICKSON'S LITTLE POLICE STATION</p><h1>和拉拉警長一起出任務</h1><p>看看線索、幫助朋友，當一天小小守護員。</p></div><img src="assets/characters/nickson-panda-home.png" alt="Nickson 陪你到警察局"/></div><nav class="pc-missions" aria-label="選擇警察局任務">${button('mission','lobby',picture('🐾','警察局'))}${Object.entries(POLICE_MISSIONS).map(([id,m])=>button('mission',id,picture(m.icon,m.name))).join('')}</nav><div class="pc-layout"><div class="pc-stage"><img class="pc-background" src="${POLICE_ASSETS.room}" alt="溫暖的警察局服務台，旁邊有失物櫃與休息椅" draggable="false"/><div class="pc-board"></div><button class="pc-speaker" data-police="listen" aria-label="聽警長說一次">🔊</button></div><aside class="pc-panel"><div class="pc-guide-head">${button('listen','',guide()+'<span aria-hidden="true">🔊</span>',false,'class="pc-guide-replay" aria-label="點拉拉警長，重聽目前步驟"')}<div><p class="pc-kicker">拉拉警長 · 點我再聽一次</p><h2 class="pc-title" tabindex="-1"></h2></div></div><p class="pc-instruction"></p><div class="pc-options"></div><p class="pc-status" role="status" aria-live="polite"></p><div class="pc-actions"></div><div class="pc-tools">${button('listen','',picture('📻','再聽一次'))}${button('pause','',picture('♡','休息一下'))}</div><div class="pc-stamps" aria-label="本次任務印章"></div><p class="pc-note">這是假裝扮演，不會真的報案或打電話。真實過馬路要由大人陪伴；遇到困難，請服務台警察或可信任的大人幫忙。<br>原創警犬夥伴，非卡通官方遊戲。</p></aside></div></section>`;}
export class PoliceSession{
 constructor({root,state=new PoliceVisit(),unlock=()=>{},effect=()=>{},say=async()=>true,stopAudio=()=>{},visible=()=>!document.hidden,schedule=(fn,ms)=>setTimeout(fn,ms),cancel=id=>clearTimeout(id),reducedMotion=false}={}){
  Object.assign(this,{root,state,unlock,effect,say,stopAudio,visible,schedule,cancel,reducedMotion});this.destroyed=false;this.revision=0;this.voiceRevision=0;this.voiceKey='';this.voicePromise=null;this.voiceFailed=false;this.timers=new Set();this.message='';
  this.click=e=>{const b=e.target.closest('[data-police]');if(b&&!b.disabled)this.action(b.dataset.police,b.dataset.policeValue);};
 }
 active(){return !this.destroyed&&!this.state.paused&&this.visible();}
 mount(){this.root.addEventListener('click',this.click);this.paint();this.narrate();}
 paintVoice(pending,failed=false){this.voiceFailed=failed;this.root.querySelectorAll?.('[data-police="listen"]').forEach(b=>{b.setAttribute('aria-busy',String(pending));b.classList.toggle('pc-audio-retry',failed);});}
 cancelVoice(){this.voiceRevision++;this.voicePromise=null;this.voiceKey='';this.stopAudio();this.paintVoice(false);}
 narrate(lines=policeGuideLines(this.state)){if(!this.active())return Promise.resolve(false);lines=lines.filter(Boolean);if(!lines.length)return Promise.resolve(true);const key=JSON.stringify(lines);if(this.voicePromise&&this.voiceKey===key)return this.voicePromise;this.cancelVoice();const token=++this.voiceRevision;this.voiceKey=key;this.paintVoice(true);
  const promise=(async()=>{for(const text of lines){if(token!==this.voiceRevision||!this.active())return false;let ok=false;try{ok=await this.say(text);}catch{/* Listening can always be retried without blocking play. */}if(token!==this.voiceRevision||!this.active())return false;if(!ok){this.paintVoice(false,true);return false;}}return true;})();this.voicePromise=promise;promise.then(()=>{if(token!==this.voiceRevision)return;this.voicePromise=null;this.voiceKey='';this.paintVoice(false,this.voiceFailed);});return promise;
 }
 narrateWhenReady(lines=policeGuideLines(this.state)){const pending=this.voicePromise,token=this.voiceRevision;if(!pending)return this.narrate(lines);return pending.then(ok=>ok&&token===this.voiceRevision&&this.active()?this.narrate(lines):false);}
 clear(){this.revision++;this.cancelVoice();for(const id of this.timers)this.cancel(id);this.timers.clear();this.state.cancelCross();}
 pause(){if(this.destroyed||this.state.paused)return;this.clear();this.state.paused=true;this.message='準備好再按繼續。過馬路動畫若中斷，要重新按一起走。';this.paint(true);}
 action(action,value){if(this.destroyed)return;if(action==='resume'){if(!this.visible())return;this.unlock();this.state.paused=false;this.message='';this.paint(true);this.narrate([POLICE_CUES.resume,...policeGuideLines(this.state)]);return;}if(!this.active())return;this.unlock();if(action==='listen'){this.narrate();return;}if(action==='pause'){this.pause();return;}
  const s=this.state;if(action==='mission'){if(value!=='lobby'&&!Object.hasOwn(POLICE_MISSIONS,value))return;this.clear();s.selectMission(value);this.message='';this.paint(true);this.narrate();return;}if(action==='reset'){if(s.mission==='lobby')return;this.clear();s.reset();this.message='';this.paint(true);this.narrate([POLICE_CUES.restart,...policeGuideLines(s)]);return;}
  if(action==='cross'){if(!s.startCross())return;this.cancelVoice();const token=++this.revision;this.message='';this.paint(true);this.narrate();const id=this.schedule(()=>{this.timers.delete(id);if(token!==this.revision||!this.active()||s.mission!=='traffic')return;if(s.finishCross()){this.effect();this.paint(true);this.narrateWhenReady();}},this.reducedMotion?0:CROSS_MILLISECONDS);this.timers.add(id);return;}
  let changed=false;if(action==='clue')changed=s.findClue(value);if(action==='bag')changed=s.chooseBag(value);if(action==='return')changed=s.returnBag();if(action==='rabbit')changed=s.helpRabbit(value);if(action==='road')changed=s.roadAction(value);
  if(!changed){if(s.done)return;const retry=action==='bag'&&s.mission==='lost'&&s.clues.size===2&&!s.bag?POLICE_CUES.bagRetry:action==='rabbit'&&s.mission==='reunion'?POLICE_CUES.rabbitRetry:action==='road'&&value==='run'&&s.mission==='traffic'?POLICE_CUES.trafficRetry:'';if(retry){this.message=retry;this.paint();this.narrate([retry,policeCue(s)]);}return;}
  this.cancelVoice();this.effect();this.message='';this.paint(s.done||action==='rabbit'||action==='road'&&s.traffic.step===3||action==='bag');this.narrate();
 }
 paint(focus=false){
  const s=this.state,disabled=s.paused,m=s.mission,doc=this.root.ownerDocument,prior=doc?.activeElement?.dataset?.police?{...doc.activeElement.dataset}:null,game=this.root.querySelector('.police-game');game.classList.toggle('pc-reduced',this.reducedMotion);game.classList.toggle('pc-paused',disabled);
  this.root.querySelectorAll('[data-police="mission"]').forEach(b=>{b.disabled=disabled;b.setAttribute('aria-pressed',String(b.dataset.policeValue===m));});
  let title='今天想幫誰呢？',instruction=policeCue(s),board='',options='',actions='',status=this.message;
  if(m==='lobby'){board=`<div class="pc-welcome">${guide()}<h2>${s.complete?'小小守護員！':'汪！小隊員，歡迎你！'}</h2><p>${s.complete?'謝謝你，讓小鎮更溫暖。':'不急、不害怕，我們一起幫忙。'}</p><span class="pc-welcome-paws" aria-hidden="true">🐾 · 🐾 · 🐾</span></div>`;options=Object.entries(POLICE_MISSIONS).map(([id,v])=>button('mission',id,picture(v.icon,`${v.name}${s.stamps.has(id)?' ✓':''}`),disabled)).join('');}
  if(m==='lost'){
   title=s.lostDone?'書包回家了！':s.bag?'交給警長保管':'找找小兔的書包';
   board=`<div class="pc-case-board"><div class="pc-rabbit">${rabbitArt(s.lostDone)}<strong>${s.lostDone?'謝謝你！':'我的書包在哪裡？'}</strong></div><div class="pc-clues">${['color','shape'].map((id,i)=>button('clue',id,s.clues.has(id)?picture(id==='color'?'🔵':'⭐',id==='color'?'藍色':escape(s.catalog.shapes.star)):picture('🔎',`線索 ${i+1}`),disabled||!s.lostReady||s.clues.has(id)||Boolean(s.bag),`aria-label="${s.clues.has(id)?'已找到':'尋找'}${i===0?'顏色':'形狀'}線索"`)).join('')}</div>${s.bag?`<div class="pc-found-bag">${policeBagArt()}${s.lostDone?'<b>✓ 已交還</b>':''}</div>`:'<p class="pc-case-note">點放大鏡，看看兩個線索。</p>'}</div>`;
   if(s.clues.size===2&&!s.bag)options=`<div class="pc-bag-choices">${BAG_CHOICES.map((bag,i)=>button('bag',bag.id,policeBagArt(bag),disabled,`aria-label="${bag.color==='blue'?'藍色':'橘色'}${escape(s.catalog.shapes[bag.shape])}${escape(s.catalog.bag)}，第${i+1}個"`)).join('')}</div>`;
   if(s.bag&&!s.lostDone)actions=button('return','',picture('🤲','交給警長'),disabled,'class="primary"');
   if(!s.lostReady)status=POLICE_CUES.missing;
  }
  if(m==='reunion'){
   title=s.done?'和家人團聚了！':['先停下來','找誰幫忙呢？','一起等家人'][s.reunionStep];board=`<div class="pc-rabbit-scene">${rabbitArt(s.done)}<div class="pc-service-desk">${s.reunionStep>0?guide():'<span aria-hidden="true">🪑</span>'}</div><p>${s.done?'警長確認後，小兔和家人一起回家。':s.reunionStep===0?'在安全的服務台，慢慢等候。':s.reunionStep===1?'穿制服的警長就在服務台。':'警長正在聯絡家人，我們留在這裡等。'}</p></div>`;
   if(!s.done)options=REUNION_CHOICES[s.reunionStep].map(c=>button('rabbit',c.id,picture(c.icon,c.label),disabled)).join('');
  }
  if(m==='traffic'){
   title=s.done?'安全到達！':s.traffic.status==='crossing'?'牽著手慢慢走':['小紅人，先停下','牽好大人的手','看看左邊和右邊','一起走斑馬線'][s.traffic.step];board=roadArt(s.traffic);
   if(!s.done&&s.traffic.status!=='crossing'){
    if(s.traffic.step===0)options=button('road','wait',picture('✋','停下等候'),disabled)+button('road','run',picture('🏃','直接跑過去'),disabled);
    if(s.traffic.step===1)options=button('road','hand',picture('🤝','牽好手'),disabled);
    if(s.traffic.step===2)options=`<div class="pc-look-choices">${['left','right'].map(id=>button('road',id,picture(id==='left'?'👀 ←':'→ 👀',`${id==='left'?'看看左邊':'看看右邊'}${s.traffic[id]?' ✓':''}`),disabled||s.traffic[id])).join('')}</div>`;
    if(s.traffic.step===3)actions=button('cross','',picture('🚶','牽手一起走'),disabled,'class="primary"');
   }
  }
  if(s.done){board+=`<div class="pc-earned"><span aria-hidden="true">✧</span> ${s.complete?'三個任務完成 · 小小守護員':'得到一枚幫忙印章'}</div>`;actions=button('reset','',picture('↻','再玩一次'),disabled)+button('mission','lobby',picture('🐾','回任務站'),disabled,'class="primary"');}
  if(disabled){title='我們休息一下';instruction='準備好再按繼續，警長會陪你慢慢玩。';board='<div class="pc-rest"><span aria-hidden="true">🧸</span><h2>休息一下</h2></div>';options='';actions=button('resume','',picture('▶','繼續小任務'),false,'class="primary"');}
  this.root.querySelector('.pc-title').textContent=title;this.root.querySelector('.pc-instruction').textContent=instruction;this.root.querySelector('.pc-board').innerHTML=board;this.root.querySelector('.pc-options').innerHTML=options;this.root.querySelector('.pc-actions').innerHTML=actions;this.root.querySelector('.pc-status').textContent=status||'';
  this.root.querySelector('.pc-stamps').innerHTML=Object.entries(POLICE_MISSIONS).map(([id,v])=>`<span class="${s.stamps.has(id)?'pc-stamped':''}" aria-label="${v.name}${s.stamps.has(id)?'已完成':'尚未完成'}">${v.icon}<b>${s.stamps.has(id)?'✓':'○'}</b></span>`).join('');
  this.root.querySelectorAll('[data-police="listen"],[data-police="pause"]').forEach(b=>b.disabled=disabled);this.paintVoice(Boolean(this.voicePromise),this.voiceFailed);
  if(focus)this.root.querySelector('.pc-title').focus({preventScroll:true});else if(prior){const b=[...this.root.querySelectorAll('[data-police]')].find(b=>b.dataset.police===prior.police&&b.dataset.policeValue===prior.policeValue&&!b.disabled);(b||this.root.querySelector('.pc-title')).focus({preventScroll:true});}
  if(!disabled&&m!=='lobby'&&doc?.defaultView?.matchMedia('(max-width:760px)').matches){const next=this.root.querySelector('.pc-options button:not(:disabled),.pc-actions button:not(:disabled)');next?.scrollIntoView({block:'center',behavior:'auto'});}
 }
 destroy(){if(this.destroyed)return;this.destroyed=true;this.clear();this.state.paused=false;this.root.removeEventListener('click',this.click);}
}
