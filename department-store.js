import {DepartmentVisit,STORE_ROOMS,STORE_STEPS,KNEAD_COUNT,BAKE_MILLISECONDS} from './department-model.js?v=20261021.v2';
import {departmentCue,STORE_CUES} from './department-voice.js?v=20261021.v2';
import {japaneseArt} from './japanese-art.js?v=20261021.v2';
import {breadArt,bagArt,coinArt} from './department-art.js?v=20261021.v2';
export {DepartmentVisit,departmentCatalog} from './department-model.js?v=20261021.v2';
const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const button=(action,value,label,disabled=false,extra='')=>`<button data-department="${action}" data-department-value="${escape(value)}" ${disabled?'disabled':''} ${extra}>${label}</button>`;
const food=item=>`<span class="ds-food-picture" aria-hidden="true">${japaneseArt(item.id)||''}</span>`;
const next=(state,label='下一步 →')=>button('next','',label,!state.canNext,'class="primary"');

export function departmentHTML(){return `<section class="department-game"><div class="ds-heading"><div><p class="eyebrow">NICKSON'S LITTLE DEPARTMENT STORE · 百貨公司</p><h1>今天一起逛百貨</h1><p>看圖找商品，揉一個香香的麵包。</p></div><img src="assets/characters/nickson-panda-home.png" alt="Nickson 陪你逛百貨"/></div><nav class="ds-rooms" aria-label="選擇百貨店舖">${button('room','lobby','🏬 百貨大廳')}${Object.entries(STORE_ROOMS).map(([id,room])=>button('room',id,`${room.icon} ${room.name}`)).join('')}</nav><div class="ds-layout"><div class="ds-stage"><img class="ds-background" draggable="false"/><div class="ds-board"></div><button class="ds-speaker" data-department="listen" aria-label="再聽一次玩法">🔊</button></div><aside class="ds-guide"><p class="ds-kicker"></p><h2 class="ds-title" tabindex="-1"></h2><ol class="ds-steps" aria-label="遊戲流程"></ol><p class="ds-instruction"></p><div class="ds-options"></div><p class="ds-status" role="status" aria-live="polite"></p><div class="ds-actions"></div><div class="ds-tools">${button('listen','','🔊 再聽一次')}${button('pause','','♡ 休息一下')}</div><p class="ds-note">生活扮演遊戲，不影響學校紀錄。星星幣不是真錢；真實烘焙請大人陪伴，烤箱由大人操作。</p></aside></div></section>`;}

export class DepartmentSession{
 constructor({root,state=new DepartmentVisit(),unlock=()=>{},effect=()=>{},say=async()=>true,stopAudio=()=>{},visible=()=>!document.hidden,schedule=(fn,ms)=>setTimeout(fn,ms),cancel=id=>clearTimeout(id),reducedMotion=false}={}){
  Object.assign(this,{root,state,unlock,effect,say,stopAudio,visible,schedule,cancel,reducedMotion});this.destroyed=false;this.revision=0;this.audioRevision=0;this.voiceKey='';this.voicePromise=null;this.voiceFailed=false;this.timers=new Set();this.gesture=null;this.suppressedClick=null;this.message='';
  this.click=event=>{const target=event.target.closest('[data-department]');if(!target||target.disabled)return;const {department:action,departmentValue:value}=target.dataset;if(event.detail!==0&&this.suppressedClick?.value===value&&action==='collect'){this.suppressedClick=null;return;}this.action(action,value);};
  this.down=event=>this.pointerDown(event);this.move=event=>this.pointerMove(event);this.up=event=>this.pointerUp(event);this.pointerCancel=()=>this.cancelGesture();
 }
 active(){return !this.destroyed&&!this.state.paused&&this.visible();}
 mount(){for(const [type,handler] of this.listeners())this.root.addEventListener(type,handler);this.paint();this.narrate();}
 listeners(){return [['click',this.click],['pointerdown',this.down],['pointermove',this.move],['pointerup',this.up],['pointercancel',this.pointerCancel],['lostpointercapture',this.pointerCancel]];}
 hint(message){this.message=message;const node=this.root.querySelector?.('.ds-status');if(node)node.textContent=message;}
 paintVoice(pending,failed=false){this.voiceFailed=failed;this.root.querySelectorAll?.('[data-department="listen"]').forEach(node=>{node.setAttribute('aria-busy',String(pending));node.classList.toggle('ds-audio-retry',failed);});}
 cancelVoice(){this.audioRevision++;this.voicePromise=null;this.voiceKey='';this.stopAudio();this.paintVoice(false);}
 narrate(lines=[departmentCue(this.state)],replace=true){
  if(!this.active())return Promise.resolve(false);lines=lines.filter(Boolean);if(!lines.length)return Promise.resolve(true);const key=JSON.stringify(lines);if(this.voicePromise&&key===this.voiceKey)return this.voicePromise;if(replace)this.cancelVoice();const token=++this.audioRevision;this.voiceKey=key;this.paintVoice(true);
  const promise=(async()=>{for(const text of lines){if(token!==this.audioRevision||!this.active())return false;let ok=false;try{ok=await this.say(text);}catch{/* Retry stays available without blocking visual play. */}if(token!==this.audioRevision||!this.active())return false;if(!ok){this.hint('點亮亮的喇叭再聽一次，或請大人幫忙開啟聲音。');this.paintVoice(false,true);return false;}}return true;})();this.voicePromise=promise;promise.then(()=>{if(token!==this.audioRevision)return;this.voicePromise=null;this.voiceKey='';this.paintVoice(false,this.voiceFailed);});return promise;
 }
 cancelGesture(){const gesture=this.gesture;this.gesture=null;gesture?.ghost?.remove();if(gesture)try{if(gesture.target.hasPointerCapture?.(gesture.id))gesture.target.releasePointerCapture(gesture.id);}catch{/* Pointer capture may already be released. */}}
 clear(){this.revision++;this.cancelVoice();for(const timer of this.timers)this.cancel(timer);this.timers.clear();this.cancelGesture();this.suppressedClick=null;this.state.cancelBake();}
 pause(){if(this.destroyed||this.state.paused)return;this.clear();this.state.paused=true;this.message='準備好再按繼續。店員烘烤若被中斷，要重新請店員幫忙。';this.paint(true);}
 resume(){if(this.destroyed||!this.visible())return;this.state.paused=false;this.message='我們慢慢玩。';this.paint(true);this.narrate();}
 action(action,value){
  if(this.destroyed)return;if(action==='resume'){if(this.visible()){this.unlock();this.resume();}return;}if(!this.active())return;this.unlock();
  if(action==='listen'){this.narrate();return;}if(action==='pause'){this.pause();return;}
  const state=this.state;
  if(action==='room'){if(value!=='lobby'&&!Object.hasOwn(STORE_ROOMS,value))return;this.clear();state.selectRoom(value);this.message='';this.paint(true);this.narrate(undefined,false);return;}
  if(action==='reset'){if(!state.current)return;this.clear();state.reset();this.message='';this.paint(true);this.narrate(undefined,false);return;}
  if(action==='bake'){
   if(!state.startBake())return;this.cancelVoice();const token=++this.revision,shape=state.bakery.shape;this.message='店員正在烘烤，烤箱保持關閉。';this.paint();
   const timer=this.schedule(()=>{this.timers.delete(timer);if(token!==this.revision||!this.active()||state.room!=='bakery')return;if(state.finishBake(shape)){this.cancelVoice();this.effect();this.message='店員已幫忙烤好並放涼。';this.paint(true);this.narrate(undefined,false);}},this.reducedMotion?0:BAKE_MILLISECONDS);this.timers.add(timer);return;
  }
  const previousCue=departmentCue(state);let changed=false;
  if(action==='collect')changed=state.collect(value);
  if(action==='scan')changed=state.scan(value);
  if(action==='pay')changed=state.pay(value);
  if(action==='knead')changed=state.knead();
  if(action==='shape')changed=state.chooseShape(value);
  if(action==='pack')changed=state.pack(value);
  if(action==='next')changed=state.next();
  if(!changed){if(action==='collect'&&state.room==='market'&&state.market.step===0&&!state.market.collected.has(value)){this.hint('今天先找清單上的三樣商品，每樣放一份就好。');this.narrate([STORE_CUES.retry,departmentCue(state)]);}return;}
  const cue=departmentCue(state),speak=action==='next'||action==='collect'||cue!==previousCue;
  if(speak)this.cancelVoice();this.message='';this.effect();this.paint(action==='next');if(speak)this.narrate(undefined,false);
 }
 pointerDown(event){
  if(!this.active()||this.state.room!=='market'||this.state.market.step!==0||event.isPrimary===false||event.button!==undefined&&event.button!==0||this.gesture)return;
  const target=event.target.closest('[data-department="collect"]');if(!target||target.disabled)return;this.unlock();this.suppressedClick=null;this.gesture={id:event.pointerId,target,item:target.dataset.departmentValue,startX:event.clientX,startY:event.clientY,moved:false,ghost:null};try{target.setPointerCapture(event.pointerId);}catch{/* Tap alternative remains available. */}event.preventDefault();
 }
 pointerMove(event){
  const gesture=this.gesture;if(!gesture||gesture.id!==event.pointerId||!this.active())return;event.preventDefault();
  if(Math.hypot(event.clientX-gesture.startX,event.clientY-gesture.startY)>8)gesture.moved=true;if(!gesture.moved)return;
  if(!gesture.ghost){const doc=this.root.ownerDocument;if(doc){gesture.ghost=doc.createElement('div');gesture.ghost.className='ds-drag-ghost';gesture.ghost.setAttribute('aria-hidden','true');gesture.ghost.innerHTML=gesture.target.querySelector('svg')?.outerHTML||'';doc.body.append(gesture.ghost);}}
  if(gesture.ghost){gesture.ghost.style.left=event.clientX+'px';gesture.ghost.style.top=event.clientY+'px';}
 }
 pointerUp(event){
  const gesture=this.gesture;if(!gesture||gesture.id!==event.pointerId)return;
  if(Math.hypot(event.clientX-gesture.startX,event.clientY-gesture.startY)>8)gesture.moved=true;
  const rect=this.root.querySelector?.('.ds-basket')?.getBoundingClientRect(),inBasket=rect&&event.clientX>=rect.left&&event.clientX<=rect.right&&event.clientY>=rect.top&&event.clientY<=rect.bottom;
  this.cancelGesture();this.suppressedClick={value:gesture.item};if(!this.active())return;if(!gesture.moved||inBasket)this.action('collect',gesture.item);else{this.hint('把商品拖到購物籃，或直接點一下商品。');this.narrate([STORE_CUES.drop]);}
 }
 instruction(){const s=this.state,v=s.current;if(s.paused)return '休息一下，想繼續時再按按鈕。';if(!v)return '選一間店走進去。超市找商品，麵包店揉麵團。';if(s.room==='market')return ['看圖找清單上的三樣商品。直接點選，或拖進購物籃。','每樣商品掃描一次，看看清單上的勾勾。','用三枚星星玩具幣練習付款，不是真實金額。','帶上購物袋，謝謝店員！'][v.step];return ['點麵團六下，看看它變得圓圓軟軟。不用比速度。','選喜歡的形狀，再請店員幫忙。','烤箱由店員操作；等店員烤好、放涼，再去裝袋。','點三個放涼的麵包，裝進紙袋。','你的麵包袋準備好了！'][v.step];}
 paint(focus=false){
  const s=this.state,v=s.current,room=STORE_ROOMS[s.room],disabled=s.paused,doc=this.root.ownerDocument,active=doc?.activeElement,prior=active&&this.root.contains(active)?active.closest('[data-department]')?.dataset:null;
  const image=this.root.querySelector('.ds-background');image.src=room?.asset||'assets/department-lobby-watercolor.webp';image.alt=room?`溫暖水彩${room.name}內景，木製貨架與服務櫃台`:'水彩百貨大廳，通往超市與麵包店';
  this.root.querySelector('.department-game').classList.toggle('ds-reduced',this.reducedMotion);
  this.root.querySelector('.ds-kicker').textContent=room?`${room.icon} ${room.name} · 生活小幫手`:'🏬 百貨大廳';
  this.root.querySelector('.ds-title').textContent=disabled?'休息一下':v?STORE_STEPS[s.room][v.step]:'今天想逛哪一家？';this.root.querySelector('.ds-instruction').textContent=this.instruction();
  this.root.querySelector('.ds-steps').innerHTML=v?STORE_STEPS[s.room].map((label,i)=>`<li ${i===v.step?'aria-current="step"':''} class="${i<v.step?'is-done':''}"><span>${i<v.step?'✓':i+1}</span>${label}</li>`).join(''):'';
  this.root.querySelectorAll('.ds-rooms button').forEach(node=>{node.disabled=disabled;node.setAttribute('aria-pressed',String(node.dataset.departmentValue===s.room));});
  let board='',options='',actions='',status='';
  if(!v){board=`<div class="ds-welcome"><h2>歡迎來到小小百貨</h2><div class="ds-lobby-doors">${button('room','market','<span aria-hidden="true">🧺</span><small>超市</small>',disabled,'aria-label="購物籃，進入超市"')}${button('room','bakery','<span aria-hidden="true">🥐</span><small>麵包店</small>',disabled,'aria-label="麵包，進入麵包店"')}</div></div>`;options=Object.entries(STORE_ROOMS).map(([id,item])=>button('room',id,`<span class="ds-shop-icon">${id==='market'?'🧺':item.icon}</span>${item.name}${s.stamps.has(id)?' ✓':''}`,disabled)).join('');status=`這次逛過的店舖 ${s.stamps.size} / 2`;}
  else if(s.room==='market'){
   options=`<div class="ds-shopping-list" aria-label="今天的三樣購物清單">${s.list.map(item=>`<div class="${v.collected.has(item.id)?'is-done':''}" aria-label="${escape(item.zh)}${v.collected.has(item.id)?'已放入籃子':''}">${food(item)}<span>${escape(item.zh)}</span><b>${v.collected.has(item.id)?'✓':'○'}</b></div>`).join('')}</div>`;
   if(v.step===0){board=`<div class="ds-shop"><div class="ds-shelf" role="group" aria-label="選商品放進籃子">${s.goods.map(item=>button('collect',item.id,`${food(item)}<span>${escape(item.zh)}</span>${v.collected.has(item.id)?'<b>✓</b>':''}`,disabled||!s.marketReady||v.collected.has(item.id),`class="ds-stock-button" aria-label="拿${escape(item.zh)}放進購物籃"`)).join('')}</div><div class="ds-basket" role="group" aria-label="購物籃，可以把商品拖到這裡"><span aria-hidden="true">🧺</span><div>${s.list.filter(item=>v.collected.has(item.id)).map(food).join('')||'<span class="ds-basket-empty">放進籃子</span>'}</div></div></div>`;actions=next(s,'🛒 一起去結帳 →');status=s.marketReady?`購物籃 ${v.collected.size} / 3`:'商品教材未載入，請重新整理。';}
   if(v.step===1){board=`<div class="ds-checkout"><div class="ds-register" aria-hidden="true">🧾 <span>${v.scanned.size} / 3</span></div><div class="ds-counter-products">${s.list.map(item=>button('scan',item.id,`${food(item)}<span>${v.scanned.has(item.id)?'✓':escape(item.zh)}</span>`,disabled||v.scanned.has(item.id),`aria-label="掃描${escape(item.zh)}"`)).join('')}</div><div class="ds-scanner" aria-hidden="true">▥ ─ ▥ ─ ▥</div></div>`;actions=next(s,'🪙 去練習付款 →');status=`掃描完成 ${v.scanned.size} / 3`;}
   if(v.step===2){board=`<div class="ds-payment"><div class="ds-payment-count" aria-hidden="true">${[0,1,2].map(i=>v.coins.has(String(i))?'⭐':'○').join(' ')}</div><div class="ds-coins">${[0,1,2].map(i=>button('pay',String(i),coinArt(),disabled||v.coins.has(String(i)),`aria-label="付第${i+1}枚星星玩具幣"`)).join('')}</div><p>星星玩具幣 · 不是真錢</p></div>`;actions=next(s,'🛍️ 帶著購物袋回家 →');status=`已付玩具幣 ${v.coins.size} / 3`;}
   if(v.step===3){board=`<div class="ds-finished">${bagArt(s.list.map(food).join(''))}<h2>購物完成！</h2><p>謝謝店員，記得帶上購物袋。</p></div>`;actions=button('reset','','↻ 再逛一次',disabled)+button('room','lobby','🏬 回百貨大廳',disabled);}
  }else{
   if(v.step===0){board=`<div class="ds-kneading"><p>揉揉軟軟的麵團</p>${button('knead','',breadArt('circle'),disabled||v.kneads===KNEAD_COUNT,`class="ds-dough" data-kneads="${v.kneads}" aria-label="揉麵團，目前${v.kneads}次"`)}<div class="ds-knead-dots" aria-label="已揉${v.kneads}次">${Array.from({length:KNEAD_COUNT},(_,i)=>`<span class="${i<v.kneads?'is-done':''}">${i<v.kneads?'✓':'○'}</span>`).join('')}</div></div>`;actions=next(s,'✨ 去選麵包造型 →');status=`揉一揉 ${v.kneads} / ${KNEAD_COUNT}`;}
   if(v.step===1){board=`<div class="ds-shapes" role="group" aria-label="選喜歡的麵包形狀">${s.shapes.map(shape=>button('shape',shape.id,`${breadArt(shape.id)}<span>${escape(shape.zh)}</span>`,disabled,`aria-pressed="${v.shape===shape.id}"`)).join('')}</div>`;actions=next(s,'🧑‍🍳 請店員幫忙 →');status=v.shape?'選好了，準備請店員烘烤。':s.shapes.length?'三種造型都可以選。':'形狀教材未載入，請重新整理。';}
   if(v.step===2){board=`<div class="ds-oven-panel"><button data-department="bake" aria-label="請店員幫忙烘烤" ${disabled||v.bake!=='ready'?'disabled':''} class="ds-oven ${v.bake==='baking'?'is-baking':''}" style="--bake-time:${BAKE_MILLISECONDS}ms"><div class="ds-oven-controls" aria-hidden="true">● ─ ●</div><div class="ds-oven-window">${breadArt(v.shape,v.bake==='cooled')}</div><span class="ds-oven-handle" aria-hidden="true"></span></button><p>${v.bake==='baking'?'店員正在烘烤…':v.bake==='cooled'?'✓ 店員已烤好並放涼':'烤箱由店員操作'}</p></div>`;options=button('bake','',v.bake==='cooled'?'✓ 已放涼':v.bake==='baking'?'店員正在幫忙…':'🧑‍🍳 請店員烤麵包',disabled||v.bake!=='ready','class="ds-bake-button"');actions=next(s,'🛍️ 去裝袋 →');status='遊戲時間已簡化，不是真實烘焙食譜。';}
   if(v.step===3){board=`<div class="ds-packing"><div class="ds-pack-breads">${[0,1,2].map(i=>button('pack',String(i),`${breadArt(v.shape,true)}${v.packed.has(String(i))?'<b>✓</b>':''}`,disabled||v.packed.has(String(i)),`aria-label="第${i+1}個麵包裝袋"`)).join('')}</div>${bagArt([...v.packed].map(()=>breadArt(v.shape,true)).join(''))}</div>`;actions=next(s,'🥐 謝謝店員 →');status=`裝好麵包 ${v.packed.size} / 3`;}
   if(v.step===4){board=`<div class="ds-finished">${bagArt([0,1,2].map(()=>breadArt(v.shape,true)).join(''))}<h2>麵包準備好了！</h2><p>真的烤箱，要請大人幫忙。</p></div>`;actions=button('reset','','↻ 再做一次',disabled)+button('room','lobby','🏬 回百貨大廳',disabled);}
  }
  if(disabled){board='<div class="ds-rest"><span>🧸</span><h2>我們休息一下</h2><p>想玩時，再按繼續。</p></div>';options='';actions=button('resume','','▶ 繼續逛百貨',false,'class="primary"');}
  this.root.querySelector('.ds-board').innerHTML=board;this.root.querySelector('.ds-options').innerHTML=options;this.root.querySelector('.ds-actions').innerHTML=actions;this.hint(this.message||status);
  this.root.querySelector('[data-department="pause"]').disabled=disabled;this.root.querySelectorAll('[data-department="listen"]').forEach(node=>node.disabled=disabled||s.room==='bakery'&&v?.bake==='baking');
  if(focus)this.root.querySelector('.ds-title').focus({preventScroll:true});else if(prior){const node=[...this.root.querySelectorAll('[data-department]')].find(node=>node.dataset.department===prior.department&&node.dataset.departmentValue===prior.departmentValue&&!node.disabled);(node||this.root.querySelector('.ds-title')).focus({preventScroll:true});}
 }
 destroy(){if(this.destroyed)return;this.destroyed=true;this.clear();this.state.paused=false;for(const [type,handler] of this.listeners())this.root.removeEventListener(type,handler);}
}
