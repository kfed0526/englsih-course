import {faceSVG} from './body-art.js?v=20261020.v2';
import {hospitalCue,HOSPITAL_CUES} from './hospital-voice.js?v=20261020.v2';

export const HOSPITAL_ROOMS={dental:{name:'牙科',icon:'🦷',ticket:'12',tool:'mirror',toolName:'小鏡子',asset:'assets/hospital-dental-watercolor.webp'},ent:{name:'耳鼻喉科',icon:'👂',ticket:'21',tool:'light',toolName:'檢查燈',asset:'assets/hospital-ent-watercolor.webp'}};
export const HOSPITAL_STEPS=['掛號候診','說說心情','認識工具','一起練習','謝謝醫生'];
export const BRUSH_ZONES=Array.from({length:6},(_,i)=>({id:String(i),x:[25,50,75][i%3],y:i<3?30:68}));
const escape=text=>String(text).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

// Reuse the textbook's stable IDs and labels; this visit never writes course records.
export function hospitalParts(catalog){
 const words=catalog.find(book=>book.id==='all-about-my-body')?.units.flatMap(unit=>unit.words||[])||[];
 return ['ears','nose','mouth'].map(id=>words.find(word=>word.id===id)).filter(Boolean).map(({id,zh})=>({id,zh}));
}
const newVisit=()=>({step:0,ticket:false,called:false,feeling:'',tool:false,cleaned:new Set(),checked:new Set(),exam:'choose',practiceDone:false});
export class HospitalVisit{
 constructor(parts=[]){this.parts=parts;this.room='lobby';this.paused=false;this.visits={dental:newVisit(),ent:newVisit()};this.stamps=new Set();}
 get current(){return this.visits[this.room];}
 get target(){return this.parts.find(part=>!this.current?.checked.has(part.id));}
 selectRoom(room){if(room!=='lobby'&&!Object.hasOwn(HOSPITAL_ROOMS,room))return false;this.cancelExam();this.room=room;this.paused=false;return true;}
 reset(){if(!this.current||this.paused)return false;this.visits[this.room]=newVisit();return true;}
 takeTicket(){if(this.paused||this.current?.step!==0||this.current.ticket)return false;this.current.ticket=true;return true;}
 matchTicket(value){const visit=this.current;if(this.paused||visit?.step!==0||!visit.ticket||visit.called||value!==HOSPITAL_ROOMS[this.room].ticket)return false;visit.called=true;return true;}
 chooseFeeling(value){if(this.paused||this.current?.step!==1||!['ready','nervous'].includes(value))return false;this.current.feeling=value;return true;}
 chooseTool(value){if(this.paused||this.current?.step!==2||this.current.tool||value!==HOSPITAL_ROOMS[this.room].tool)return false;this.current.tool=true;return true;}
 brush(id){const visit=this.current;if(this.paused||this.room!=='dental'||visit.step!==3||!BRUSH_ZONES.some(zone=>zone.id===id)||visit.cleaned.has(id))return false;visit.cleaned.add(id);visit.practiceDone=visit.cleaned.size===BRUSH_ZONES.length;return true;}
 choosePart(id){const visit=this.current;if(this.paused||this.room!=='ent'||visit.step!==3||visit.exam!=='choose'||this.parts.length!==3||this.target?.id!==id)return false;visit.exam='ready';return true;}
 startExam(){const visit=this.current;if(this.paused||this.room!=='ent'||visit.step!==3||visit.exam!=='ready'||!this.target)return false;visit.exam='checking';return true;}
 finishExam(id){const visit=this.current;if(this.paused||this.room!=='ent'||visit.step!==3||visit.exam!=='checking'||this.target?.id!==id)return false;visit.checked.add(id);visit.exam='choose';visit.practiceDone=visit.checked.size===3;return true;}
 cancelExam(){if(this.current?.exam==='checking')this.current.exam='ready';}
 next(){const visit=this.current;if(this.paused||!visit||visit.step>=4)return false;const ready=[visit.called,Boolean(visit.feeling),visit.tool,visit.practiceDone][visit.step];if(!ready)return false;visit.step++;if(visit.step===4)this.stamps.add(this.room);return true;}
}

export function hospitalHTML(){return `<section class="hospital-game"><div class="hp-heading"><div><p class="eyebrow">NICKSON'S LITTLE HOSPITAL · 醫院</p><h1>陪 Nickson 認識看診</h1><p>先說明，再看看；準備好了才開始。</p></div><img src="assets/characters/nickson-panda-home.png" alt="Nickson 陪你認識醫院"/></div><nav class="hp-rooms" aria-label="選擇醫院科別"><button data-hospital="room" data-hospital-value="lobby">🏥 掛號大廳</button>${Object.entries(HOSPITAL_ROOMS).map(([id,room])=>`<button data-hospital="room" data-hospital-value="${id}">${room.icon} ${room.name}</button>`).join('')}</nav><div class="hp-layout"><div class="hp-stage"><img class="hp-background" draggable="false"/><div class="hp-board"></div><button class="hp-picture-speaker" data-hospital="listen" aria-label="再聽一次玩法">🔊</button></div><aside class="hp-guide"><p class="hp-kicker"></p><h2 class="hp-title" tabindex="-1"></h2><ol class="hp-steps" aria-label="看診流程"></ol><p class="hp-instruction"></p><div class="hp-options"></div><p class="hp-status" role="status" aria-live="polite"></p><div class="hp-actions"></div><div class="hp-tools"><button data-hospital="listen">🔊 再聽一次</button><button data-hospital="pause">♡ 我想休息</button></div><p class="hp-safety">這是認識看診的遊戲，不是健康檢查。真的不舒服時，請告訴大人；醫療工具由醫生操作。</p></aside></div></section>`;}
const button=(action,value,label,disabled=false,extra='')=>`<button data-hospital="${action}" data-hospital-value="${value}" ${disabled?'disabled':''} ${extra}>${label}</button>`;
const teethHTML=()=>`<div class="hp-brush-wrap"><div class="hp-brush-label">🪥 牙齒模型 · 點一點，也能滑動刷</div><div class="hp-teeth" role="group" aria-label="模型上的六個刷牙區域"><svg viewBox="0 0 400 270" aria-hidden="true"><path d="M30 112Q40 25 200 25T370 112L370 172Q350 250 200 250T30 172Z" fill="#d99990" stroke="#936b5a" stroke-width="4"/><path d="M54 133H346" stroke="#76564c" stroke-width="15"/>${BRUSH_ZONES.map(zone=>`<rect x="${zone.x*4-42}" y="${zone.y*2.7-40}" width="84" height="80" rx="23" fill="#fffbed" stroke="#c5b59b" stroke-width="3"/>`).join('')}</svg>${BRUSH_ZONES.map((zone,i)=>button('brush',zone.id,`<span class="hp-plaque" aria-hidden="true">•••</span><span class="hp-clean" aria-hidden="true">✦</span><span class="sr-only">刷模型第${i+1}區</span>`,false,`class="hp-tooth" style="left:${zone.x}%;top:${zone.y}%" aria-label="刷模型第${i+1}區"`)).join('')}</div><p>在模型練習，真實刷牙請大人幫忙。</p></div>`;

export class HospitalSession{
 constructor({root,state=new HospitalVisit(),unlock=()=>{},effect=()=>{},say=async()=>true,stopAudio=()=>{},visible=()=>!document.hidden,schedule=(fn,ms)=>setTimeout(fn,ms),cancel=id=>clearTimeout(id),reducedMotion=false}={}){
  Object.assign(this,{root,state,unlock,effect,say,stopAudio,visible,schedule,cancel,reducedMotion});this.timers=new Set();this.revision=0;this.audioRevision=0;this.voiceKey='';this.voicePromise=null;this.destroyed=false;this.gesture=null;this.message='';
  this.click=event=>{const target=event.target.closest('[data-hospital]');if(target&&!target.disabled)this.action(target.dataset.hospital,target.dataset.hospitalValue);};
  this.down=event=>this.pointerDown(event);this.move=event=>this.pointerMove(event);this.up=event=>this.pointerUp(event);this.pointerCancel=()=>this.cancelGesture();
 }
 mount(){this.root.addEventListener('click',this.click);this.root.addEventListener('pointerdown',this.down);this.root.addEventListener('pointermove',this.move);this.root.addEventListener('pointerup',this.up);this.root.addEventListener('pointercancel',this.pointerCancel);this.root.addEventListener('lostpointercapture',this.pointerCancel);this.paint();this.narrate();}
 active(){return !this.destroyed&&!this.state.paused&&this.visible();}
 cancelGesture(){const gesture=this.gesture;this.gesture=null;gesture?.brush?.remove();if(gesture)try{if(gesture.board.hasPointerCapture?.(gesture.id))gesture.board.releasePointerCapture(gesture.id);}catch{/* capture may already have ended */}}
 cancelVoice(){this.audioRevision++;this.voiceKey='';this.voicePromise=null;this.stopAudio();this.paintVoice(false);}
 paintVoice(pending,failed=false){this.voiceFailed=failed;this.root.querySelectorAll?.('[data-hospital="listen"]').forEach(button=>{button.setAttribute('aria-busy',String(pending));button.classList.toggle('hp-audio-retry',failed);});}
 narrate(lines=[hospitalCue(this.state)],replace=true){
  if(!this.active())return Promise.resolve(false);lines=lines.filter(Boolean);if(!lines.length)return Promise.resolve(true);
  const key=JSON.stringify(lines);if(this.voicePromise&&this.voiceKey===key)return this.voicePromise;
  if(replace)this.cancelVoice();const token=++this.audioRevision;this.voiceKey=key;this.paintVoice(true);
  const promise=(async()=>{for(const text of lines){if(token!==this.audioRevision||!this.active())return false;let ok=false;try{ok=await this.say(text);}catch{/* Preserve visual play if audio is unavailable. */}if(token!==this.audioRevision||!this.active())return false;if(!ok){this.hint('點亮亮的喇叭再聽一次，或請大人幫忙開啟聲音。');this.paintVoice(false,true);return false;}}return true;})();
  this.voicePromise=promise;promise.then(()=>{if(token!==this.audioRevision)return;this.voicePromise=null;this.voiceKey='';this.paintVoice(false,this.voiceFailed);});return promise;
 }
 clear(){this.revision++;this.cancelVoice();for(const timer of this.timers)this.cancel(timer);this.timers.clear();this.cancelGesture();this.state.cancelExam();}
 pause(){if(this.destroyed||this.state.paused)return;this.clear();this.state.paused=true;this.message='想休息、緊張，都可以告訴醫生。準備好再按繼續。';this.paint(true);}
 resume(){if(this.destroyed||!this.visible())return;this.state.paused=false;this.message='我們慢慢來，你可以隨時再休息。';this.paint(true);this.narrate();}
 hint(message){this.message=message;const status=this.root.querySelector('.hp-status');if(status)status.textContent=message;}
 instruction(){const s=this.state,v=s.current;if(s.paused)return '休息一下，準備好再繼續。';if(!v)return '選牙科或耳鼻喉科，陪 Nickson 走一遍看診流程。';return [v.ticket?`號碼牌是 ${HOSPITAL_ROOMS[s.room].ticket}。找到一樣的叫號，就可以準備進診間。`:'先拿一張號碼牌，再等候叫號。',v.feeling==='nervous'?'可以請醫生先說明、先看看工具。你想休息也可以說。':'今天看診的心情是什麼？每一種心情都可以說。',`醫生先介紹${HOSPITAL_ROOMS[s.room].toolName}。找找看，它是哪一個？`,s.room==='dental'?'拿起畫面中的牙刷，點掉模型上的六區小斑點，或在牙齒上滑動刷。':v.practiceDone?'三個部位都認識了，謝謝醫生的示範。':s.parts.length!==3?'部位教材尚未載入，請重新整理。':s.target?`先找到${s.target.zh}，再請醫生示範用燈看看。`:'部位教材尚未載入，請重新整理。','今天認識了看診流程，也練習說出自己的感受。'][v.step];}
 action(action,value){
  if(this.destroyed)return;if(action==='resume'){this.unlock();this.resume();return;}if(!this.active())return;
  this.unlock();if(action==='listen'){this.narrate();return;}if(action==='brush'){this.brush(value);return;}this.cancelVoice();const s=this.state,v=s.current;
  if(action==='pause'){this.pause();return;}
  if(action==='room'){this.clear();if(s.selectRoom(value)){this.message='';this.paint(true);this.narrate(undefined,false);}return;}
  let changed=false,correct=false;this.message='';
  if(action==='ticket')changed=s.takeTicket();
  if(action==='number'){changed=s.matchTicket(value);correct=changed;this.message=changed?'號碼一樣！準備好就可以進診間。':v?.called?'已經找到號碼囉。':'再看看自己的號碼牌，找一樣的數字就好。';}
  if(action==='feeling'){changed=s.chooseFeeling(value);this.message=value==='nervous'?'你可以說：「我有一點緊張，請先告訴我會做什麼。」':'你可以說：「我準備好了，請先告訴我會做什麼。」';}
  if(action==='tool'){changed=s.chooseTool(value);correct=changed;this.message=changed?'找到了！先看工具，準備好才開始；工具由醫生操作。':v?.tool?'已經認識這個工具囉。':'再看看提示，工具是讓醫生看看、照亮用的。';}
  if(action==='part'){changed=s.choosePart(value);correct=changed;this.message=changed?'找到了！可以請醫生示範，也可以先休息。':v?.exam==='checking'?'醫生正在示範，我們先等等。':`我們先找${s.target?.zh||'下一個部位'}，照著圖慢慢來。`;}
  if(action==='exam'&&s.startExam()){
   const id=s.target.id,room=s.room,token=++this.revision;this.paint();const timer=this.schedule(()=>{this.timers.delete(timer);if(token!==this.revision||!this.active()||s.room!==room)return;if(s.finishExam(id)){this.cancelVoice();this.effect();this.message=s.current.practiceDone?'三個部位都認識了！可以和醫生說謝謝。':'醫生示範好了，換下一個部位。';this.paint(true);this.narrate(undefined,false);}},this.reducedMotion?0:1000);this.timers.add(timer);return;
  }
  if(action==='next'){changed=s.next();if(changed){this.clear();correct=s.current.step===4;}}
  if(action==='reset'){this.clear();changed=s.reset();}
  if(correct)this.effect();if(changed||this.message){this.paint(changed&&['next','reset'].includes(action));this.narrate(!changed&&['number','tool','part'].includes(action)?[HOSPITAL_CUES.retry,hospitalCue(s)]:undefined,false);}
 }
 brush(id){if(!this.active()||!this.state.brush(id))return false;if(this.state.current.practiceDone)this.cancelVoice();this.effect();this.paintBrush();if(this.state.current.practiceDone)this.narrate(undefined,false);return true;}
 paintBrush(){const s=this.state,v=s.current;this.root.querySelectorAll('.hp-tooth').forEach(node=>{const clean=v.cleaned.has(node.dataset.hospitalValue);node.classList.toggle('is-clean',clean);node.setAttribute('aria-label',`模型第${Number(node.dataset.hospitalValue)+1}區${clean?'已刷乾淨':'，點選刷牙'}`);node.setAttribute('aria-pressed',String(clean));});this.hint(v.practiceDone?'六區都練習了！這是模型遊戲，真實刷牙請大人幫忙。':`刷牙模型 ${v.cleaned.size} / 6 區。點一點或繼續滑動刷。`);const next=this.root.querySelector('[data-hospital="next"]');if(next)next.disabled=!v.practiceDone;}
 pointerDown(event){if(!this.active()||this.state.room!=='dental'||this.state.current.step!==3||event.isPrimary===false||(event.button!==undefined&&event.button!==0))return;const board=event.target.closest('.hp-teeth');if(!board)return;this.unlock();this.cancelGesture();const brush=board.ownerDocument?.createElement('span');if(brush){brush.className='hp-brush-cursor';brush.textContent='🪥';brush.setAttribute('aria-hidden','true');board.append(brush);}this.gesture={id:event.pointerId,board,brush,last:null};try{board.setPointerCapture(event.pointerId);}catch{/* keyboard and tap alternatives remain */}event.preventDefault();this.brushAt(event);}
 pointerMove(event){if(this.gesture?.id===event.pointerId&&this.active()){event.preventDefault();this.brushAt(event);}}
 pointerUp(event){if(this.gesture?.id!==event.pointerId)return;if(this.active())this.brushAt(event);this.cancelGesture();}
 brushAt(event){const gesture=this.gesture,rect=gesture?.board.getBoundingClientRect();if(!rect?.width||!rect?.height)return;const point={x:(event.clientX-rect.left)/rect.width*100,y:(event.clientY-rect.top)/rect.height*100};if(!Number.isFinite(point.x)||!Number.isFinite(point.y))return;const previous=gesture.last||point,steps=Math.min(100,Math.max(1,Math.ceil(Math.hypot(point.x-previous.x,point.y-previous.y)/4)));for(let n=0;n<=steps;n++){const x=previous.x+(point.x-previous.x)*n/steps,y=previous.y+(point.y-previous.y)*n/steps;for(const zone of BRUSH_ZONES)if(Math.abs(x-zone.x)<13&&Math.abs(y-zone.y)<18)this.brush(zone.id);}gesture.last=point;if(gesture.brush){gesture.brush.style.left=point.x+'%';gesture.brush.style.top=point.y+'%';}}
 paint(focus=false){
  const s=this.state,v=s.current,room=HOSPITAL_ROOMS[s.room];
  const image=this.root.querySelector('.hp-background');image.src=room?.asset||'assets/hospital-lobby-watercolor.webp';image.alt=room?`溫暖水彩${room.name}診間，檢查椅與由醫生使用的工具`:'溫暖水彩醫院掛號大廳，櫃台、候診椅與兩個診間入口';
  this.root.querySelector('.hp-stage').classList.toggle('hp-reduced',this.reducedMotion);
  this.root.querySelector('.hospital-game').classList.toggle('hp-reduced',this.reducedMotion);
  this.root.querySelector('.hp-kicker').textContent=room?`${room.icon} ${room.name} · 小小看診練習`:'🏥 歡迎來到醫院';
  this.root.querySelector('.hp-title').textContent=s.paused?'我們休息一下':v?HOSPITAL_STEPS[v.step]:'今天想認識哪一科？';
  this.root.querySelector('.hp-instruction').textContent=this.instruction();
  this.root.querySelector('.hp-steps').innerHTML=v?HOSPITAL_STEPS.map((name,i)=>`<li ${i===v.step?'aria-current="step"':''} class="${i<v.step?'hp-step-done':''}"><span>${i<v.step?'✓':i+1}</span>${name}</li>`).join(''):'';
  this.root.querySelectorAll('[data-hospital="room"]').forEach(node=>{node.setAttribute('aria-pressed',String(node.dataset.hospitalValue===s.room));node.disabled=s.paused;});
  let board='',options='',actions='';const disabled=s.paused;
  if(!v){board='<div class="hp-welcome"><span>🏥</span><h2>歡迎，小小探險家</h2><p>有人陪伴，也能隨時休息。</p></div>';options=Object.entries(HOSPITAL_ROOMS).map(([id,item])=>button('room',id,`${item.icon} 進入${item.name}${s.stamps.has(id)?' ✓':''}`,disabled)).join('');}
  else if(v.step===0){board=`<div class="hp-number-scene"><span>🎟️</span><p>我的號碼牌</p><strong>${v.ticket?room.ticket:'？'}</strong><small>${v.called?'✓ 找到一樣的叫號了':'拿號碼牌 → 等候叫號'}</small></div>`;options=v.ticket?`<p class="hp-choice-label">叫號螢幕：找到一樣的號碼</p><div class="hp-number-choices">${['12','21','32'].map(number=>button('number',number,number,disabled||v.called)).join('')}</div>`:button('ticket','','🎟️ 拿號碼牌',disabled,'class="primary"');actions=button('next','','準備好，進診間 →',disabled||!v.called,'class="primary"');}
  else if(v.step===1){board=`<div class="hp-feeling-scene"><span>${v.feeling==='nervous'?'🧸':'🐼'}</span><h2>你的感受，醫生想聽</h2><p>${v.feeling==='nervous'?'「請先說明，我想慢慢來。」':'「可以先告訴我，等一下要做什麼嗎？」'}</p></div>`;options=button('feeling','ready','🙂 我準備好了',disabled,`aria-pressed="${v.feeling==='ready'}"`)+button('feeling','nervous','🧸 我有一點緊張',disabled,`aria-pressed="${v.feeling==='nervous'}"`);actions=button('next','','先看看工具 →',disabled||!v.feeling,'class="primary"');}
  else if(v.step===2){board=`<div class="hp-tool-scene"><span>${s.room==='dental'?'🪞':'🔦'}</span><h2>${room.toolName}</h2><p>${s.room==='dental'?'讓醫生看看牙齒的不同角度。':'幫醫生照亮要看的地方。'}</p><small>先說明、先看看，工具由醫生使用。</small></div>`;options=`<div class="hp-tool-choices">${[['mirror','🪞 小鏡子'],['light','🔦 檢查燈'],['brush','🪥 牙刷']].map(([id,label])=>button('tool',id,label,disabled||v.tool)).join('')}</div>`;actions=button('next','','準備好，一起練習 →',disabled||!v.tool,'class="primary"');}
  else if(v.step===3){
   if(s.room==='dental'){board=teethHTML();options='<p class="hp-choice-label">六區都能用點選或滑動完成，不用比速度。</p>';}
   else{const target=s.target;board=`<div class="hp-exam-scene ${v.exam==='checking'?'is-checking':''}"><span class="hp-exam-lamp" aria-hidden="true">🔦</span>${faceSVG(v.exam==='choose'?'':target?.id||'')}<p>${v.practiceDone?'✓ 都認識了':v.exam==='checking'?'醫生示範用燈看看…':v.exam==='ready'?'準備好了，再請醫生示範':`找找${escape(target?.zh||'部位')}`}</p></div>`;options=`<div class="hp-part-choices">${s.parts.map(part=>button('part',part.id,`${({ears:'👂',nose:'👃',mouth:'👄'})[part.id]||''} ${escape(part.zh)}${v.checked.has(part.id)?' ✓':''}`,disabled||s.parts.length!==3||v.exam!=='choose'||v.checked.has(part.id))).join('')}</div>`+button('exam','','🔦 請醫生示範檢查',disabled||v.exam!=='ready'||v.practiceDone,'class="hp-exam-button"')+'<p class="hp-choice-label">這裡只看圖認識部位；不要把東西放進真的耳朵或鼻子。</p>';}
   actions=button('next','','謝謝醫生 →',disabled||!v.practiceDone,'class="primary"');
  }else{board=`<div class="hp-finished"><span>🌿</span><h2>${room.name}小冒險完成！</h2><p>我會說心情，也知道可以休息。</p><div>✦ 謝謝醫生 ✦</div></div>`;options=`<p>${s.room==='dental'?'今天在模型上練習了刷牙，真實刷牙請大人幫忙。':'今天認識耳、鼻、口。這不是聽力或健康測驗。'}</p>`;actions=button('reset','','↻ 再認識一次',disabled)+button('room','lobby','🏥 回大廳選科別',disabled);}
  if(s.paused){board='<div class="hp-rest"><span>🧸</span><h2>你可以慢慢來</h2><p>休息一下，想繼續時再按按鈕。</p></div>';options='';actions=button('resume','','▶ 我準備好繼續了',false,'class="primary"');}
  this.root.querySelector('.hp-board').innerHTML=board;this.root.querySelector('.hp-options').innerHTML=options;this.root.querySelector('.hp-actions').innerHTML=actions;this.root.querySelector('[data-hospital="pause"]').disabled=disabled;this.root.querySelectorAll('[data-hospital="listen"]').forEach(button=>button.disabled=disabled||v?.exam==='checking');
  this.hint(this.message||(!v?`這次認識的科別 ${s.stamps.size} / 2 · 不影響學校學習紀錄` :v.step===3&&s.room==='ent'?`已認識 ${v.checked.size} / 3 個部位` :''));
  if(v?.step===3&&s.room==='dental'&&!disabled)this.paintBrush();
  if(focus)this.root.querySelector('.hp-title')?.focus({preventScroll:true});
 }
 destroy(){if(this.destroyed)return;this.destroyed=true;this.clear();this.state.paused=false;for(const [type,handler] of [['click',this.click],['pointerdown',this.down],['pointermove',this.move],['pointerup',this.up],['pointercancel',this.pointerCancel],['lostpointercapture',this.pointerCancel]])this.root.removeEventListener(type,handler);}
}
