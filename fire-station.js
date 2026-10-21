import {FireVisit,FIRE_MISSIONS,FIRE_GEAR,FIRE_PREP,FIRE_TARGETS,SPRAY_MILLISECONDS,DRIVE_MILLISECONDS} from './fire-model.js?v=20261021.v2';
import {FIRE_CUES,fireCue,fireGuideLines} from './fire-voice.js?v=20261021.v2';
import {fireGearArt,fireOutfitArt,fireTruckArt,fireTargetArt} from './fire-art.js?v=20261021.v2';
export {FireVisit} from './fire-model.js?v=20261021.v2';
export const FIRE_ASSETS={room:'assets/fire-station-watercolor.webp',guide:'assets/characters/dalmatian-fire-guide.webp'};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(action,value,label,disabled=false,extra='')=>`<button data-fire="${action}" data-fire-value="${escape(value)}" ${disabled?'disabled':''} ${extra}>${label}</button>`;
const picture=(icon,label)=>`<span class="fs-option-icon" aria-hidden="true">${icon}</span><span>${label}</span>`;
const guide=()=>`<img class="fs-dog" src="${FIRE_ASSETS.guide}" alt="斑斑：原創斑點狗消防員，微笑揮手" draggable="false"/>`;
export function fireHTML(){return `<section class="fire-game"><div class="fs-heading"><div><p class="eyebrow">NICKSON'S LITTLE FIRE STATION</p><h1>斑斑消防局</h1><p>穿好裝備、玩水柱，和消防員一起練習。</p></div><img src="assets/characters/nickson-panda-home.png" alt="Nickson 陪你到消防局"/></div><nav class="fs-missions" aria-label="選擇消防局任務">${button('mission','lobby',picture('🏠','任務站'))}${Object.entries(FIRE_MISSIONS).map(([id,m])=>button('mission',id,picture(m.icon,m.name))).join('')}</nav><div class="fs-layout"><div class="fs-stage"><img class="fs-background" src="${FIRE_ASSETS.room}" alt="水彩消防局：停好的消防車、裝備櫃與安全練習庭院" draggable="false"/><div class="fs-board"></div><button class="fs-speaker" data-fire="listen" aria-label="聽斑斑說一次">🔊</button></div><aside class="fs-panel"><div class="fs-guide-head">${button('listen','',guide()+'<span aria-hidden="true">🔊</span>',false,'class="fs-guide-replay" aria-label="點斑斑，重聽目前步驟"')}<div><p class="fs-kicker">斑斑消防員 · 點我再聽一次</p><h2 class="fs-title" tabindex="-1"></h2></div></div><p class="fs-instruction"></p><div class="fs-options"></div><p class="fs-status" role="status" aria-live="polite"></p><div class="fs-actions"></div><div class="fs-tools">${button('listen','',picture('📻','再聽一次'))}${button('pause','',picture('♡','休息一下'))}</div><div class="fs-stamps" aria-label="本次消防任務印章"></div><p class="fs-note">這是假裝扮演與紙板靶練習，沒有真的火，不會撥電話。消防車由消防員開；真實消防裝備只能由專業人員操作。原創消防夥伴，非卡通官方遊戲。</p></aside></div></section>`;}
export class FireSession{
 constructor({root,state=new FireVisit(),unlock=()=>{},effect=()=>{},say=async()=>true,stopAudio=()=>{},visible=()=>!document.hidden,schedule=(fn,ms)=>setTimeout(fn,ms),cancel=id=>clearTimeout(id),reducedMotion=false}={}){
  Object.assign(this,{root,state,unlock,effect,say,stopAudio,visible,schedule,cancel,reducedMotion});this.destroyed=false;this.revision=0;this.voiceRevision=0;this.voiceKey='';this.voicePromise=null;this.voiceFailed=false;this.timers=new Set();this.message='';
  this.click=e=>{const b=e.target.closest('[data-fire]');if(b&&!b.disabled)this.action(b.dataset.fire,b.dataset.fireValue);};
 }
 active(){return !this.destroyed&&!this.state.paused&&this.visible();}
 mount(){this.root.addEventListener('click',this.click);this.paint();this.narrate();}
 paintVoice(pending,failed=false){this.voiceFailed=failed;this.root.querySelectorAll?.('[data-fire="listen"]').forEach(b=>{b.setAttribute('aria-busy',String(pending));b.classList.toggle('fs-audio-retry',failed);});}
 cancelVoice(){this.voiceRevision++;this.voicePromise=null;this.voiceKey='';this.stopAudio();this.paintVoice(false);}
 narrate(lines=fireGuideLines(this.state)){if(!this.active())return Promise.resolve(false);lines=lines.filter(Boolean);if(!lines.length)return Promise.resolve(true);const key=JSON.stringify(lines);if(this.voicePromise&&this.voiceKey===key)return this.voicePromise;this.cancelVoice();const token=++this.voiceRevision;this.voiceKey=key;this.paintVoice(true);
  const promise=(async()=>{for(const text of lines){if(token!==this.voiceRevision||!this.active())return false;let ok=false;try{ok=await this.say(text);}catch{/* Listening can always be retried without blocking play. */}if(token!==this.voiceRevision||!this.active())return false;if(!ok){this.paintVoice(false,true);return false;}}return true;})();this.voicePromise=promise;promise.then(()=>{if(token!==this.voiceRevision)return;this.voicePromise=null;this.voiceKey='';this.paintVoice(false,this.voiceFailed);});return promise;
 }
 narrateWhenReady(lines=fireGuideLines(this.state)){const pending=this.voicePromise,token=this.voiceRevision;if(!pending)return this.narrate(lines);return pending.then(ok=>ok&&token===this.voiceRevision&&this.active()?this.narrate(lines):false);}
 clear(){this.revision++;this.cancelVoice();for(const id of this.timers)this.cancel(id);this.timers.clear();this.state.cancelPending();}

 pause(){if(this.destroyed||this.state.paused)return;this.clear();this.state.paused=true;this.message='準備好再按繼續。中斷的噴水或出發，要重新點一下。';this.paint(true);}
 action(action,value){if(this.destroyed)return;if(action==='resume'){if(!this.state.paused||!this.visible())return;this.unlock();this.state.paused=false;this.message='';this.paint(true);this.narrate([FIRE_CUES.resume,...fireGuideLines(this.state)]);return;}if(!this.active())return;this.unlock();if(action==='listen'){this.narrate();return;}if(action==='pause'){this.pause();return;}
  const s=this.state;if(action==='mission'){if(value!=='lobby'&&!Object.hasOwn(FIRE_MISSIONS,value))return;this.clear();s.selectMission(value);this.message='';this.paint(true);this.narrate();return;}
  if(action==='reset'){if(s.mission==='lobby')return;this.clear();s.reset();this.message='';this.paint(true);this.narrate([FIRE_CUES.restart,...fireGuideLines(s)]);return;}
  if(action==='spray'||action==='drive'){
   if(!(action==='spray'?s.startShot(value):s.startDrive()))return;
   this.cancelVoice();const token=++this.revision;this.message='';this.paint();this.narrate();
   const id=this.schedule(()=>{this.timers.delete(id);if(token!==this.revision||!this.active())return;if(s.finishPending()){this.effect();this.paint(s.done);this.narrateWhenReady();}},this.reducedMotion?0:action==='spray'?SPRAY_MILLISECONDS:DRIVE_MILLISECONDS);this.timers.add(id);return;
  }
  const changed=action==='gear'?s.equip(value):action==='prepare'?s.prepare(value):false;
  if(!changed){if(s.done||s.pending)return;const retry=action==='gear'&&s.mission==='gear'?FIRE_CUES.gearRetry:action==='prepare'&&s.mission==='truck'?FIRE_CUES.truckRetry:'';if(retry){this.message=retry;this.paint();this.narrate([retry,fireCue(s)]);}return;}
  this.cancelVoice();this.effect();this.message='';this.paint(true);this.narrate();
 }
 paint(focus=false){
  const s=this.state,m=s.mission,disabled=s.paused,busy=Boolean(s.pending),doc=this.root.ownerDocument,prior=doc?.activeElement?.dataset?.fire?{...doc.activeElement.dataset}:null,game=this.root.querySelector('.fire-game');game.classList.toggle('fs-reduced',this.reducedMotion);game.classList.toggle('fs-paused',disabled);
  this.root.querySelectorAll('[data-fire="mission"]').forEach(b=>{b.disabled=disabled;b.setAttribute('aria-pressed',String(b.dataset.fireValue===m));});
  let title='今天想練習什麼？',instruction=fireCue(s),board='',options='',actions='';
  if(m==='lobby'){board=`<div class="fs-welcome">${guide()}<h2>${s.complete?'消防小幫手！':'汪！歡迎來消防局'}</h2><p>一起練習，慢慢來就可以。</p></div>`;options=Object.entries(FIRE_MISSIONS).map(([id,v])=>button('mission',id,picture(v.icon,`${v.name}${s.stamps.has(id)?' ✓':''}`),disabled)).join('');}
  if(m==='gear'){
   title=s.done?'裝備都穿好了！':['先戴消防帽','再穿消防衣','穿上消防靴'][s.gearStep];
   board=`<div class="fs-outfit">${fireOutfitArt(s.gearStep)}<div class="fs-checks">${FIRE_GEAR.map((g,i)=>`<span class="${i<s.gearStep?'fs-checked':''}">${g.icon}${i<s.gearStep?' ✓':' ○'}</span>`).join('')}</div></div>`;
   if(!s.done)options=`<div class="fs-gear-choices">${FIRE_GEAR.map((g,i)=>button('gear',g.id,picture(fireGearArt(g.id),g.name),disabled||i<s.gearStep,`aria-label="${g.name}${i<s.gearStep?'已穿好':''}"`)).join('')}</div>`;
  }
  if(m==='water'){
   title=s.done?'水柱練習完成！':busy?'咻——水柱出發！':'點紙板靶，噴一噴';
   board=`<div class="fs-training ${busy?'fs-spraying':''}"><p class="fs-training-label">紙板練習靶 · 沒有真的火</p><div class="fs-targets">${FIRE_TARGETS.map((id,i)=>button('spray',id,fireTargetArt(s.hits[i])+`<span>${s.hits[i]===2?'✓':s.hits[i]+'/2'}</span>`,disabled||busy||s.hits[i]===2,`class="fs-target ${s.hits[i]===2?'fs-down':''}" aria-label="${['左邊','中間','右邊'][i]}紙板靶，${s.hits[i]===2?'已完成':'已噴'+s.hits[i]+'次'}"`)).join('')}</div><svg class="fs-water-stream" viewBox="0 0 360 250" aria-hidden="true"><path d="M40 230Q75 205 95 230" stroke="#bba372" stroke-width="12" fill="none"/><path d="M95 230Q170 125 ${[62,180,298][s.pending?.index??1]} 100" stroke="#69bac9" stroke-width="11" fill="none" stroke-linecap="round" stroke-dasharray="12 8"/><path d="M75 234L104 217" stroke="#607c7f" stroke-width="13"/></svg><div class="fs-water-progress" aria-label="已噴水${s.hits.reduce((a,b)=>a+b,0)}次，共六次">${s.hits.map(n=>'💧'.repeat(n)+'○'.repeat(2-n)).join(' · ')}</div></div>`;
   if(!s.done)options=FIRE_TARGETS.map((id,i)=>button('spray',id,picture('💦',`${['左邊','中間','右邊'][i]}紙板靶${s.hits[i]===2?' ✓':''}`),disabled||busy||s.hits[i]===2)).join('');
  }
  if(m==='truck'){
   title=s.done?'平安到練習場！':busy?'消防員開車出發！':s.prepStep===3?'坐好，請消防員出發':'一起準備消防車';
   board=`<div class="fs-truck-scene ${busy?'fs-driving':''} ${s.arrived?'fs-arrived':''}"><p class="fs-training-label">消防員開車 · 前往練習場</p><div class="fs-truck">${fireTruckArt(s.prepStep,s.arrived)}</div><div class="fs-checks">${FIRE_PREP.map((p,i)=>`<span class="${i<s.prepStep?'fs-checked':''}">${p.icon}${i<s.prepStep?' ✓':' ○'}</span>`).join('')}</div></div>`;
   if(!s.done&&!busy){if(s.prepStep<3)options=FIRE_PREP.map((p,i)=>button('prepare',p.id,picture(p.icon,p.name),disabled||i<s.prepStep)).join('');else actions=button('drive','',picture('🚒','請消防員出發'),disabled,'class="primary"');}
  }
  if(s.done){board+=`<div class="fs-earned">✧ ${s.complete?'三個任務完成 · 消防小幫手':'得到一枚消防印章'}</div>`;actions=button('reset','',picture('↻','再玩一次'),disabled)+button('mission','lobby',picture('🏠','回任務站'),disabled,'class="primary"');}
  if(disabled){title='我們休息一下';instruction='準備好再按繼續，斑斑會陪你接著玩。';board='<div class="fs-rest"><span aria-hidden="true">🧸</span><h2>休息一下</h2></div>';options='';actions=button('resume','',picture('▶','繼續小任務'),false,'class="primary"');}
  this.root.querySelector('.fs-title').textContent=title;this.root.querySelector('.fs-instruction').textContent=instruction;this.root.querySelector('.fs-board').innerHTML=board;this.root.querySelector('.fs-options').innerHTML=options;this.root.querySelector('.fs-actions').innerHTML=actions;this.root.querySelector('.fs-status').textContent=this.message;
  this.root.querySelector('.fs-stamps').innerHTML=Object.entries(FIRE_MISSIONS).map(([id,v])=>`<span class="${s.stamps.has(id)?'fs-stamped':''}" aria-label="${v.name}${s.stamps.has(id)?'已完成':'尚未完成'}">${v.icon}<b>${s.stamps.has(id)?'✓':'○'}</b></span>`).join('');
  this.root.querySelectorAll('[data-fire="listen"],[data-fire="pause"]').forEach(b=>b.disabled=disabled);this.paintVoice(Boolean(this.voicePromise),this.voiceFailed);
  if(focus)this.root.querySelector('.fs-title').focus({preventScroll:true});else if(prior){const candidates=[...this.root.querySelectorAll('[data-fire]')],b=candidates.find(b=>b.dataset.fire===prior.fire&&b.dataset.fireValue===prior.fireValue&&!b.disabled);(b||this.root.querySelector('.fs-title')).focus({preventScroll:true});}
  if(!disabled&&doc?.defaultView?.matchMedia('(max-width:760px)').matches){const next=this.root.querySelector('.fs-options button:not(:disabled),.fs-actions button:not(:disabled)');if(!busy)next?.scrollIntoView({block:'center',behavior:'auto'});}
 }
 destroy(){if(this.destroyed)return;this.destroyed=true;this.clear();this.state.paused=false;this.root.removeEventListener('click',this.click);}
}
