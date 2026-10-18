import {trampolineHTML} from '../trampoline.js';
import {slideHTML} from '../slide.js';
import {swingHTML} from '../swing.js';
import {createSandpit,sandpitHTML} from '../sandpit.js';
import {parkMemoriesHTML} from '../memories.js';
import {KPOP_SONGS,kpopLibraryHTML,kpopRoomHTML} from '../kpop.js';
import {FESTIVAL_ASSETS} from '../festival-art.js';
import {FestivalGame} from '../festival-games.js';
import {taipeiToday,festivalEvents,festivalCalendarHTML} from '../festival-calendar.js';
import {JapaneseActivity,JAPANESE_TYPES} from '../japanese-activities.js';
import {japaneseArt} from '../japanese-art.js';
import {homeMapHTML,worldMapHTML,sceneHTML,CountryFlight,ADVENTURE_ASSETS} from '../adventure-map.js';
import {BodyActivity,BODY_TYPES} from '../body-activities.js';
import {questionFor,answersFor} from '../lesson-text.js';
import {storySectionHTML} from '../school-story.js';
import {CHARACTER_ASSETS} from '../characters.js';
import {LessonSpeech,SPEECH_LEVELS,speechLevel,availableVoices,voiceId,chooseVoice} from '../speech.js';
import {questionBankHTML} from '../question-bank.js';
import {GameSounds} from '../sounds.js';
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const course=JSON.parse(fs.readFileSync('content/my-school.json','utf8'));
const bodyBook=JSON.parse(fs.readFileSync('content/all-about-my-body.json','utf8'));
const japaneseBook=JSON.parse(fs.readFileSync('content/japanese-school.json','utf8'));
const storyBook=JSON.parse(fs.readFileSync('content/school-stories.json','utf8'));
async function harness(failStorage=false,SoundClass=GameSounds,storedSettings=null){const handlers={};const nodes=new Map();const node=key=>{if(!nodes.has(key))nodes.set(key,{innerHTML:'',textContent:'',className:'',dataset:{},disabled:false,classList:{add(){},remove(){}},replaceChildren(){}});return nodes.get(key);};const app=node('app');app.addEventListener=(name,fn)=>handlers[name]=fn;const storage=new Map();if(storedSettings)storage.set('nickson-settings',JSON.stringify(storedSettings));const audioLog=[];const ctx={trampolineHTML,TrampolineSession:class{mount(){}destroy(){this.destroyed=true;}pause(){this.paused=true;}action(a){this.lastAction=a;}},slideHTML,SlideSession:class{mount(){}destroy(){this.destroyed=true;}pause(){this.paused=true;}action(a){this.lastAction=a;}},swingHTML,SwingSession:class{mount(){}destroy(){this.destroyed=true;}pause(){this.paused=true;}action(a){this.lastAction=a;}},createSandpit,sandpitHTML,SandpitSession:class{constructor({state}){this.state=state;}mount(){}destroy(){this.destroyed=true;}cancelGesture(){this.cancelled=true;}help(){}collect(){}},parkMemoriesHTML,KPOP_SONGS,kpopLibraryHTML,kpopRoomHTML,KpopSession:class{mount(){}destroy(){this.destroyed=true;}pause(){this.paused=true;}setPose(p){this.pose=p;}togglePreview(){this.preview=!this.preview;}},FESTIVAL_ASSETS,FestivalGame,taipeiToday,festivalEvents,festivalCalendarHTML,JapaneseActivity,JAPANESE_TYPES,japaneseArt,homeMapHTML,worldMapHTML,sceneHTML,CountryFlight,ADVENTURE_ASSETS,BodyActivity,BODY_TYPES,questionFor,answersFor,storySectionHTML,CHARACTER_ASSETS,LessonSpeech,SPEECH_LEVELS,speechLevel,availableVoices,voiceId,chooseVoice,questionBankHTML,GameSounds:SoundClass,console,URL,Date,Math,JSON,Promise,Error,Number,String,Array,Object,Set,fetch:async url=>({ok:true,json:async()=>url.includes('index.json')?{books:['my-school.json','all-about-my-body.json','japanese-school.json']}:structuredClone(url.includes('park-memories')?JSON.parse(fs.readFileSync('content/park-memories.json','utf8')):url.includes('festival-audio')?JSON.parse(fs.readFileSync('content/festival-audio.json','utf8')):url.includes('festivals')?JSON.parse(fs.readFileSync('content/festivals.json','utf8')):url.includes('school-stories')?storyBook:url.includes('japanese-school')?japaneseBook:url.includes('all-about-my-body')?bodyBook:course),arrayBuffer:async()=>new ArrayBuffer(200)}),document:{documentElement:{dataset:{version:'20261017.v1'}},hidden:false,body:node('body'),querySelector:sel=>sel==='#app'?app:node(sel),querySelectorAll:()=>[node('a0'),node('a1')],addEventListener:(name,fn)=>handlers[name]=fn,createElement:()=>node('overlay')},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>{if(failStorage)throw Error('blocked');storage.set(k,v);},removeItem:k=>storage.delete(k)},setTimeout:(fn,ms)=>setTimeout(fn,ms===15000?1000:ms===2000?8:ms===9000?12:0),clearTimeout,Audio:class{play(){audioLog.push({src:this.src,rate:this.playbackRate,pitch:this.preservesPitch});queueMicrotask(()=>this.onended?.());return Promise.resolve();}pause(){}},companion:()=>'<svg/>',shapeSVG:()=>'<svg/>',illustration:()=>'<svg/>',Activity:(await import('../activities.js')).Activity,makeRound:(await import('../game.js')).makeRound};ctx.window=ctx;ctx.speechSynthesis={cancel(){}};vm.createContext(ctx);let code=fs.readFileSync('app.js','utf8').replace(/^import .*;$/gm,'');code+='\nglobalThis.api={openFestival,start,answer,go,ask,playSchoolStory,startJapanFlight,visitDestination,selectBook:id=>{book=catalog.find(b=>b.id===id);unit=book.units[0];},select:id=>{unit=book.units.find(u=>u.id===id);},get:()=>({trampolineSession,slideSession,swingSession,sandpitState,sandpitSession,page,index,phase,locked,round,records,storageOK,activity,sounds,settings,bookId:book.id,unitId:unit.id,storyState,schoolStories,flight,festivalGame,festivalYear,festivalRecords}),click:handlers=>{},setMusic:()=>settings.music=false};';await vm.runInContext("(async()=>{"+code+"})()",ctx);await settle();ctx.api.setMusic();return {api:ctx.api,handlers,node,ctx,storage,audioLog};}
async function settle(ms=35){await new Promise(r=>setTimeout(r,ms));}

test('festival entry, narration, completion and pause use the real app without changing textbook progress',async()=>{
 const {api,handlers,ctx,node,storage,audioLog}=await harness();
 api.selectBook('all-about-my-body');api.select('week-3');api.visitDestination('festival');
 assert.equal(api.get().page,'festivals');assert.match(node('app').innerHTML,/2026 年/);
 await handlers.click({target:{closest:()=>({dataset:{festivalOpen:'nickson'}})}});
 assert.equal(api.get().page,'festival-game');const a=api.get().festivalGame;
 await handlers.click({target:{closest:()=>({dataset:{festivalAction:'narrate'}})}});await settle();
 assert.ok(audioLog.some(clip=>clip.src.startsWith('assets/audio/festivals/')));
 a.play('topping','berry');ctx.document.hidden=true;handlers.visibilitychange();
 assert.equal(a.cancelled,true);assert.equal(a.play('topping','chocolate'),false);ctx.document.hidden=false;handlers.visibilitychange();
 await handlers.click({target:{closest:()=>({dataset:{action:'resume'}})}});
 assert.equal(a.cancelled,false);assert.equal(a.steps,1);assert.equal(api.get().page,'festival-game');
 for(const [action,value]of [['topping','chocolate'],['topping','blueberry'],['candle','0'],['candle','1'],['candle','2'],['blow',''],['gift','train']])a.play(action,value);
 assert.equal(a.completed,true);assert.equal(api.get().festivalRecords['2026/nickson'].count,1);assert.equal(a.play('gift','train'),false);
 assert.equal(JSON.parse(storage.get('nickson-festivals'))['2026/nickson'].count,1);assert.equal(Object.keys(api.get().records).length,0);
 assert.equal(api.get().bookId,'all-about-my-body');assert.equal(api.get().unitId,'week-3');
 api.go('festivals');assert.match(node('app').innerHTML,/已完成，還可以再玩/);
});

test('leaving a festival and unavailable storage cannot block other map destinations',async()=>{
 const {api}=await harness(true);api.visitDestination('festival');api.openFestival('double-ten');const a=api.get().festivalGame;
 a.play('launch');api.visitDestination('school');assert.equal(a.play('launch'),false);assert.equal(api.get().page,'units');assert.equal(api.get().storageOK,false);assert.equal(Object.keys(api.get().festivalRecords).length,0);
});

for(const id of ['week-1','week-2','week-3','week-4'])test('second book '+id+' saves separately and completes only once',async()=>{
 const {api}=await harness();api.selectBook('all-about-my-body');api.select(id);await api.start();await settle();const a=api.get().activity;
 while(!a.completed){const w=a.word;if(a.type==='face-count')await a.answer(w.number);else if(a.type==='body-touch')await a.answer(w.id);else if(a.task.kind==='robot-check')await a.answer(a.task.available?'yes':'no');else{await a.select(w.id);await a.connect(a.type==='senses-link'?w.object:w.id);}await settle();}
 const state=api.get();assert.equal(state.page,'complete');assert.equal(state.records['all-about-my-body/'+id].count,1);assert.equal(state.records['all-about-my-body/'+id].targets.length,a.total);assert.equal(state.records['my-school/'+id],undefined);
});
test('Panda stories play at parent speed, cancel on leaving and never change lesson records',async()=>{
 const {api,handlers,node,audioLog}=await harness();api.selectBook('all-about-my-body');api.select('week-3');api.go('home');const before=JSON.stringify(api.get().records);assert.match(node('app').innerHTML,/河馬學校/);assert.match(node('app').innerHTML,/Panda/);
 await api.playSchoolStory('panda-morning');assert.equal(api.get().storyState.status,'done');assert.equal(api.get().bookId,'all-about-my-body');assert.equal(api.get().unitId,'week-3');assert.equal(JSON.stringify(api.get().records),before);assert.ok(audioLog.some(clip=>clip.src==='assets/audio/stories/panda-morning.wav'));
 const pending=api.playSchoolStory('robot-visitor');api.go('units');await pending;assert.equal(api.get().page,'units');assert.equal(api.get().storyState,null);assert.equal(JSON.stringify(api.get().records),before);
 api.go('settings');node('#record-book').onchange({target:{value:'my-school'}});assert.equal(api.get().bookId,'my-school');assert.equal(api.get().unitId,'week-1');
});
test('story background pause resumes story rather than launching a lesson',async()=>{
 const {api,ctx,handlers}=await harness();api.go('home');const pending=api.playSchoolStory('body-team');ctx.document.hidden=true;handlers.visibilitychange();await pending;ctx.document.hidden=false;handlers.visibilitychange();await handlers.click({target:{closest:()=>({dataset:{action:'resume'}})}});await settle();assert.equal(api.get().page,'home');assert.equal(api.get().storyState.status,'done');assert.equal(Object.keys(api.get().records).length,0);
});
test('real controller: retry hints, rapid taps, six questions, save exactly once',async()=>{const {api,handlers,node}=await harness();await api.start();await settle();let s=api.get();assert.equal(s.phase,'answer');const wrong=s.round[0].options.findIndex(o=>o.shape!==s.round[0].shape);for(let i=0;i<3;i++){await api.answer(wrong);await settle();}assert.equal(api.get().round[0].attempts,3);assert.match(node('.status').innerHTML,/幫幫我/);handlers.click({target:{closest:()=>({dataset:{action:'hint'}})}});assert.equal(api.get().round[0].hint,true);for(let i=0;i<6;i++){s=api.get();assert.equal(s.index,i);const q=s.round[i];const correct=q.options.findIndex(o=>o.shape===q.shape&&o.color===q.color);await Promise.all([api.answer(correct),api.answer(correct)]);await settle();}s=api.get();assert.equal(s.page,'complete');assert.equal(s.records['my-school/week-1'].count,1);assert.equal(s.records['my-school/week-1'].targets.length,6);assert.equal(s.round[0].attempts,4);assert.ok(s.round.slice(1).every(q=>q.attempts===1));});
test('leaving cancels pending progression; unavailable storage remains playable',async()=>{const {api}=await harness(true);await api.start();await settle();assert.equal(api.get().storageOK,false);const q=api.get().round[0];const correct=q.options.findIndex(o=>o.shape===q.shape);api.answer(correct);api.go('units');await settle();assert.equal(api.get().page,'units');assert.equal(api.get().index,0);assert.equal(Object.keys(api.get().records).length,0);});



for(const [id,kind] of [['week-2','memory'],['week-3','roles'],['week-4','map']])test(id+' completes independently with rapid taps',async()=>{const {api}=await harness();api.select(id);await api.start();await settle();const activity=api.get().activity;assert.equal(activity.type,kind);if(kind==='memory'){for(const w of course.units[1].words){const pair=activity.board.map((c,i)=>c.word===w.id?i:-1).filter(i=>i>=0);await activity.flip(pair[0]);await activity.flip(pair[1]);await settle();}}else{if(kind==='map')assert.equal(activity.order.at(-1),'classroom');for(let i=0;i<4;i++){const target=activity.target;await Promise.all([activity.choose(target),activity.choose(target)]);await settle();}}const s=api.get();assert.equal(s.page,'complete');assert.equal(s.records['my-school/'+id].count,1);assert.equal(s.records['my-school/'+id].targets.length,course.units.find(u=>u.id===id).words.length);assert.ok(s.records['my-school/'+id].targets.every(t=>t.attempts===1));assert.equal(s.records['my-school/week-1'],undefined);});
test('interrupted map feedback resumes once without skipping a room',async()=>{const {api,handlers,ctx}=await harness();api.select('week-4');await api.start();await settle();const activity=api.get().activity;const target=activity.target;activity.choose(target);ctx.document.hidden=true;handlers.visibilitychange();await settle();assert.equal(activity.step,0);ctx.document.hidden=false;handlers.visibilitychange();await handlers.click({target:{closest:()=>({dataset:{action:'resume'}})}});await settle();assert.equal(activity.step,1);assert.equal(activity.result(target).attempts,1);assert.equal(Object.keys(api.get().records).length,0);});

test('correct-answer sounds fire once for shapes, matching, roles and map, including retries',async()=>{class SpySounds{constructor(){this.hits=0;}unlock(){}stop(){}dance(){}correct(){this.hits++;return 0;}}for(const id of ['week-1','week-2','week-3','week-4']){const {api}=await harness(false,SpySounds);api.select(id);await api.start();await settle();const initial=api.get();if(id==='week-1'){const q=initial.round[0];const wrong=q.options.findIndex(o=>o.shape!==q.shape);await api.answer(wrong);assert.equal(initial.sounds.hits,0);const correct=q.options.findIndex(o=>o.shape===q.shape);await Promise.all([api.answer(correct),api.answer(correct)]);}else if(id==='week-2'){const a=initial.activity,pair=a.board.map((c,i)=>c.word===a.board[0].word?i:-1).filter(i=>i>=0);await a.flip(pair[0]);assert.equal(initial.sounds.hits,0);await a.flip(pair[1]);}else{const a=initial.activity;const wrong=a.unit.words.find(w=>w.id!==a.target).id;await a.choose(wrong);assert.equal(initial.sounds.hits,0);await Promise.all([a.choose(a.target),a.choose(a.target)]);}await settle();assert.equal(initial.sounds.hits,1,id);api.go('units');}});
test('replaying a successful role answer does not repeat the effect or advance twice',async()=>{class SpySounds{constructor(){this.hits=0;}unlock(){}stop(){}dance(){}correct(){this.hits++;return 0;}}const {api}=await harness(false,SpySounds);api.select('week-3');await api.start();await settle();const a=api.get().activity;a.choose(a.target);await a.replay();await settle();assert.equal(api.get().sounds.hits,1);assert.equal(a.step,1);api.go('units');});
test('parent question bank displays all lessons and speech preview leaves progress unchanged',async()=>{
 const {api,handlers,node}=await harness();api.go('settings');assert.match(node('app').innerHTML,/查看目前題庫/);api.go('question-bank');const html=node('app').innerHTML;
 assert.match(html,/20261017.v1/);for(const u of course.units){assert.ok(html.includes(u.theme));for(const w of u.words){assert.ok(html.includes(w.id));assert.ok(html.includes(u.answer.replace('{word}',w.id)));}}
 assert.match(html,/red circle/);assert.match(html,/orange star/);assert.match(html,/10 張卡片/);
 const before=JSON.stringify(api.get().records);api.select('week-1');await handlers.click({target:{closest:()=>({dataset:{bankBook:'my-school',bankUnit:'week-3',bankSpeech:'cook'}})}});await settle();assert.equal(api.get().page,'question-bank');assert.equal(JSON.stringify(api.get().records),before);api.go('settings');assert.match(node('app').innerHTML,/<option value="week-1" selected>/);
});

test('parent speed applies to English, Chinese and bank previews and persists on reopen',async()=>{const {api,handlers,node,storage,audioLog}=await harness();api.go('settings');assert.match(node('app').innerHTML,/語速 1–5/);assert.equal(api.get().settings.speed,3);node('#speech-speed').onchange({target:{value:'5'}});await handlers.click({target:{closest:()=>({dataset:{action:'preview-en'}})}});await settle();await handlers.click({target:{closest:()=>({dataset:{action:'preview-zh'}})}});await settle();assert.ok(audioLog.length>=3);assert.ok(audioLog.every(a=>a.rate===1.25&&a.pitch===true));const saved=JSON.parse(storage.get('nickson-settings'));assert.equal(saved.speed,5);const reopened=await harness(false,GameSounds,saved);assert.equal(reopened.api.get().settings.speed,5);api.go('question-bank');await handlers.click({target:{closest:()=>({dataset:{bankBook:'my-school',bankUnit:'week-3',bankSpeech:'cook'}})}});await settle();assert.equal(audioLog.at(-1).rate,1.25);});
test('map movement locks choices and replay, and resumes without a duplicate attempt',async()=>{const {api}=await harness();api.select('week-4');await api.start();await settle();const a=api.get().activity;let releaseWalk;const originalDelay=a.delay;a.delay=ms=>ms===1000?new Promise(resolve=>releaseWalk=resolve):originalDelay(ms);const target=a.target;const pending=a.choose(target);assert.equal(a.phase,'walking');assert.equal(a.locked,true);assert.equal(a.room,null);await a.choose(target);await a.replay();assert.equal(a.result(target).attempts,1);a.cancel();releaseWalk(true);await pending;assert.equal(a.room,null);a.delay=originalDelay;await a.resume();await settle();assert.equal(a.room,target);assert.equal(a.step,1);assert.equal(a.result(target).attempts,1);api.go('units');});

for(const id of ['topic-classroom','topic-food','topic-colors'])test('Japanese '+id+' uses the real controller and saves separately once',async()=>{
 const {api,audioLog}=await harness();api.selectBook('japanese-school');api.select(id);await api.start();await settle();const a=api.get().activity;
 while(!a.completed){await Promise.all([a.answer(a.word.id),a.answer(a.word.id)]);await settle();}
 const state=api.get();assert.equal(state.page,'complete');assert.equal(state.records['japanese-school/'+id].count,1);assert.equal(state.records['japanese-school/'+id].targets.length,4);assert.equal(state.records['my-school/week-1'],undefined);assert.ok(audioLog.some(a=>a.src.endsWith('.mp3')));
});
test('map destinations preserve both English books; Japan flight selects Japanese without writing progress',async()=>{
 const {api,node}=await harness();api.visitDestination('school');assert.equal(api.get().bookId,'my-school');assert.equal(api.get().page,'units');assert.match(node('app').innerHTML,/All About My Body/);
 api.visitDestination('park');assert.equal(api.get().page,'scene');assert.match(node('app').innerHTML,/公園裡的小時光/);assert.match(node('app').innerHTML,/park-nickson-bench-watercolor.png/);api.visitDestination('world');assert.equal(api.get().page,'world');await Promise.all([api.startJapanFlight(),api.startJapanFlight()]);assert.equal(api.get().bookId,'japanese-school');assert.equal(api.get().page,'units');assert.equal(Object.keys(api.get().records).length,0);
});
test('Japanese parent preview respects speed and never switches the current English lesson',async()=>{
 const {api,handlers,node,audioLog}=await harness();api.selectBook('all-about-my-body');api.select('week-3');api.go('settings');node('#speech-speed').onchange({target:{value:'5'}});await handlers.click({target:{closest:()=>({dataset:{action:'preview-ja'}})}});await settle();assert.equal(api.get().bookId,'all-about-my-body');assert.equal(api.get().unitId,'week-3');const clip=audioLog.find(a=>a.src===japaneseBook.units[0].words[0].audio);assert.ok(clip);assert.equal(clip.rate,1.25);assert.equal(Object.keys(api.get().records).length,0);
});

test('background cancels the real flight and resume reaches Japanese once without progress changes',async()=>{
 const {api,ctx,handlers}=await harness();api.visitDestination('world');const pendingCallbacks=[],originalTimer=ctx.setTimeout;ctx.setTimeout=(fn,ms)=>ms===2400?(pendingCallbacks.push(fn),99999):originalTimer(fn,ms);
 const pending=api.startJapanFlight();assert.equal(api.get().page,'world');ctx.document.hidden=true;handlers.visibilitychange();pendingCallbacks[0]();await pending;assert.equal(api.get().page,'world');ctx.document.hidden=false;handlers.visibilitychange();await handlers.click({target:{closest:()=>({dataset:{action:'resume'}})}});assert.equal(pendingCallbacks.length,2);pendingCallbacks[1]();await settle();assert.equal(api.get().page,'units');assert.equal(api.get().bookId,'japanese-school');assert.equal(Object.keys(api.get().records).length,0);
});


test('Korea room routes, background pause and return leave textbook records unchanged',async()=>{
 const {api,handlers,node,ctx}=await harness();api.selectBook('all-about-my-body');api.select('week-3');api.visitDestination('world');
 await handlers.click({target:{closest:()=>({dataset:{travel:'korea'}})}});assert.equal(api.get().page,'kpop');assert.match(node('app').innerHTML,/Queencard/);
 await handlers.click({target:{closest:()=>({dataset:{kpop:'queencard'}})}});assert.equal(api.get().page,'kpop-room');assert.match(node('app').innerHTML,/kpop-player/);
 await handlers.click({target:{closest:()=>({dataset:{kpopPose:'turn'}})}});ctx.document.hidden=true;handlers.visibilitychange();ctx.document.hidden=false;handlers.visibilitychange();assert.equal(api.get().page,'kpop-room');
 await handlers.click({target:{closest:()=>({dataset:{go:'kpop'}})}});assert.equal(api.get().page,'kpop');api.go('world');assert.equal(api.get().bookId,'all-about-my-body');assert.equal(api.get().unitId,'week-3');assert.equal(Object.keys(api.get().records).length,0);
});


test('switching between two song cards uses the selected video and preserves both songs',async()=>{
 const {api,handlers,node}=await harness();api.go('kpop');assert.match(node('app').innerHTML,/data-kpop="queencard"/);assert.match(node('app').innerHTML,/data-kpop="toesa"/);
 await handlers.click({target:{closest:()=>({dataset:{kpop:'toesa'}})}});assert.equal(api.get().page,'kpop-room');assert.match(node('app').innerHTML,/I’m gonna TOESA/);assert.match(node('app').innerHTML,/6MTxeUvX7VI/);assert.doesNotMatch(node('app').innerHTML,/7HDeem-JaSY/);
 api.go('kpop');await handlers.click({target:{closest:()=>({dataset:{kpop:'queencard'}})}});assert.match(node('app').innerHTML,/Queencard/);assert.match(node('app').innerHTML,/7HDeem-JaSY/);assert.doesNotMatch(node('app').innerHTML,/6MTxeUvX7VI/);assert.equal(Object.keys(api.get().records).length,0);
});


test('third song opens independently and all six moves remain selectable without scoring',async()=>{
 const {api,handlers,node}=await harness();api.go('kpop');assert.match(node('app').innerHTML,/data-kpop="malatanghulu"/);await handlers.click({target:{closest:()=>({dataset:{kpop:'malatanghulu'}})}});assert.equal(api.get().page,'kpop-room');assert.match(node('app').innerHTML,/0zd6WZ1PLVs/);assert.match(node('app').innerHTML,/data-kpop-pose="hop-turn"/);assert.doesNotMatch(node('app').innerHTML,/7HDeem-JaSY/);assert.equal(Object.keys(api.get().records).length,0);
});


test('Korea flies before entering K-pop, ignores another destination and resumes Korea after background',async()=>{
 const {api,ctx,handlers,node}=await harness();api.visitDestination('world');const callbacks=[],timer=ctx.setTimeout;ctx.setTimeout=(fn,ms)=>ms===2400?(callbacks.push(fn),99999):timer(fn,ms);
 const travel=id=>handlers.click({target:{closest:()=>({dataset:{travel:id}})}});const pending=travel('korea');assert.equal(api.get().page,'world');assert.equal(api.get().flight.destination,'korea');assert.match(node('app').innerHTML,/正在飛往韓國/);assert.match(node('app').innerHTML,/從台灣飛往韓國的飛機/);assert.match(node('app').innerHTML,/data-travel="japan" disabled/);
 await travel('japan');assert.equal(callbacks.length,1);assert.equal(api.get().flight.destination,'korea');ctx.document.hidden=true;handlers.visibilitychange();callbacks[0]();await pending;assert.equal(api.get().page,'world');ctx.document.hidden=false;handlers.visibilitychange();await handlers.click({target:{closest:()=>({dataset:{action:'resume'}})}});assert.equal(api.get().flight.destination,'korea');callbacks[1]();await settle();assert.equal(api.get().page,'kpop');assert.equal(api.get().bookId,'my-school');assert.equal(Object.keys(api.get().records).length,0);
});

test('leaving the world map cancels Korea arrival instead of opening K-pop later',async()=>{
 const {api,ctx,handlers}=await harness();api.visitDestination('world');let done;const timer=ctx.setTimeout;ctx.setTimeout=(fn,ms)=>ms===2400?(done=fn,99999):timer(fn,ms);const pending=handlers.click({target:{closest:()=>({dataset:{travel:'korea'}})}});api.go('home');done();await pending;assert.equal(api.get().page,'home');assert.equal(Object.keys(api.get().records).length,0);
});


test('park memory opens the supplied photo, clamps paging and returns to park without lesson progress',async()=>{
 const {api,handlers,node}=await harness();api.visitDestination('park');assert.match(node('app').innerHTML,/我的回憶/);await handlers.click({target:{closest:()=>({dataset:{parkMemories:'open'}})}});assert.equal(api.get().page,'park-memories');assert.match(node('app').innerHTML,/assets\/memories\/park\/swing-01.jpg/);assert.match(node('app').innerHTML,/第 1 張，共 1 張/);await handlers.click({target:{closest:()=>({dataset:{memoryStep:'1'}})}});assert.match(node('app').innerHTML,/第 1 張，共 1 張/);await handlers.click({target:{closest:()=>({dataset:{go:'scene'}})}});assert.equal(api.get().page,'scene');assert.match(node('app').innerHTML,/公園裡的小時光/);assert.equal(Object.keys(api.get().records).length,0);
});


test('sandpit entry, background gesture cancellation, reset and return preserve textbook progress',async()=>{
 const {api,handlers,ctx,node}=await harness();api.visitDestination('park');await handlers.click({target:{closest:()=>({dataset:{sandpit:'open'}})}});assert.equal(api.get().page,'sandbox');assert.match(node('app').innerHTML,/sand-surface/);const before=api.get().sandpitState,session=api.get().sandpitSession;ctx.document.hidden=true;handlers.visibilitychange();assert.equal(session.cancelled,true);ctx.document.hidden=false;handlers.visibilitychange();assert.equal(api.get().sandpitState,before);await handlers.click({target:{closest:()=>({dataset:{sandpit:'reset'}})}});assert.notEqual(api.get().sandpitState,before);assert.equal(session.destroyed,true);await handlers.click({target:{closest:()=>({dataset:{go:'scene'}})}});assert.equal(api.get().page,'scene');assert.match(node('app').innerHTML,/公園裡的小時光/);assert.equal(Object.keys(api.get().records).length,0);
});

test('swing opens from park, pauses in background, and destroys on return without lesson records',async()=>{const {api,handlers,ctx,node}=await harness();const before=JSON.stringify(api.get().records);await handlers.click({target:{closest:()=>({dataset:{swing:'open'}})}});assert.equal(api.get().page,'swing');assert.match(node('app').innerHTML,/幫 Nickson 推秋千/);const session=api.get().swingSession;ctx.document.hidden=true;handlers.visibilitychange();assert.equal(session.paused,true);api.go('scene');assert.equal(session.destroyed,true);assert.equal(JSON.stringify(api.get().records),before);});

test('slide entry, background pause and leaving keep textbook progress intact',async()=>{const {api,handlers,ctx,node}=await harness();const before=JSON.stringify(api.get().records);await handlers.click({target:{closest:()=>({dataset:{slide:'open'}})}});assert.equal(api.get().page,'slide');assert.match(node('app').innerHTML,/滑梯接星星/);const session=api.get().slideSession;ctx.document.hidden=true;handlers.visibilitychange();assert.equal(session.paused,true);api.go('scene');assert.equal(session.destroyed,true);assert.equal(JSON.stringify(api.get().records),before);});

test('trampoline opens from park, pauses in background and cleans up without altering records',async()=>{const {api,handlers,ctx,node}=await harness();const before=JSON.stringify(api.get().records);await handlers.click({target:{closest:()=>({dataset:{bounce:'open'}})}});assert.equal(api.get().page,'trampoline');assert.match(node('app').innerHTML,/跳跳床摘星星/);const session=api.get().trampolineSession;ctx.document.hidden=true;handlers.visibilitychange();assert.equal(session.paused,true);api.go('scene');assert.equal(session.destroyed,true);assert.equal(JSON.stringify(api.get().records),before);});
