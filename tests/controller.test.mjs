import * as SalonModule from '../salon.js';
const Salon={...SalonModule,SalonSession:class{constructor({state,say}){this.state=state;this.say=say;}mount(){}pause(){this.state.paused=true;}destroy(){this.destroyed=true;this.state.paused=false;}}};
import {dogHTML,DogSession} from '../home-dog.js';
import * as WorldTimeModule from '../world-time.js';
import {offlineHTML,offlineAction} from '../offline.js';
import * as AmusementModule from '../amusement-park.js';
const Amusement={...AmusementModule,AmusementSession:class{constructor({state}){this.state=state;}mount(){}pause(){this.paused=true;this.state.paused=true;}destroy(){this.destroyed=true;this.state.paused=false;}}};
import {tableHTML,TableRound,TableSession} from '../table-game.js';
import * as ParentTools from '../parent-tools.js';
import {volumeLevel,VOLUME_CHANNELS,volumeControlsHTML} from '../audio-controls.js';
import {SceneAmbience,atmosphereHTML,sceneAirHTML} from '../scene-life.js';
import {LifeRound,LifeSession,lifeHTML,LIFE_PLACES,nextReview} from '../life-learning.js';
import {optimizeImages} from '../optimized-images.js';
import {SchoolGate,SCHOOL_GATE_KEY,pandaGateButton,schoolUnlockHTML,schoolFocusHTML} from '../school-gate.js';
import {musicGamesHTML} from '../music-games.js';
import {danceGamesHTML} from '../dance-games.js';
import {deskHTML,homeActivityHTML,createBath,createHug,HOME_ACTIVITY_ASSETS} from '../home-activities.js';
import {tvHTML} from '../home-platformer.js';
import {trampolineHTML} from '../trampoline.js';
import {slideHTML} from '../slide.js';
import {swingHTML} from '../swing.js';
import {createSandpit,sandpitHTML} from '../sandpit.js';
import {parkMemoriesHTML,memoryAlbum,memoryTabs,MEMORY_SCENES} from '../memories.js';
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
async function harness(failStorage=false,SoundClass=GameSounds,storedSettings=null){const handlers={};const nodes=new Map();const node=key=>{if(!nodes.has(key))nodes.set(key,{innerHTML:'',textContent:'',className:'',dataset:{},disabled:false,classList:{add(){},remove(){}},replaceChildren(){}});return nodes.get(key);};const app=node('app');app.addEventListener=(name,fn)=>handlers[name]=fn;app.removeEventListener=name=>delete handlers[name];const storage=new Map();if(storedSettings)storage.set('nickson-settings',JSON.stringify(storedSettings));const audioLog=[],requested=[];let clockNow=new Date('2026-10-19T04:00:00Z');const WorldTime={...WorldTimeModule,WorldClock:class extends WorldTimeModule.WorldClock{constructor(options){super({...options,now:()=>clockNow,schedule:()=>0,cancel:()=>{}});}}};const ctx={Salon,Department,dogHTML,DogSession,moveClock:iso=>{clockNow=new Date(iso);},WorldTime,Hospital,Amusement,offlineHTML,offlineAction,tableHTML,TableRound,TableSession,nextReview,ParentTools,volumeLevel,VOLUME_CHANNELS,volumeControlsHTML,SceneAmbience,atmosphereHTML,sceneAirHTML,LifeRound,LifeSession:class{mount(){}destroy(){this.destroyed=true;}pause(){this.paused=true;}action(a){this.lastAction=a;}},lifeHTML,LIFE_PLACES,optimizeImages,SchoolGate,SCHOOL_GATE_KEY,pandaGateButton,schoolUnlockHTML,schoolFocusHTML,musicGamesHTML,MusicGameSession:class{mount(){}destroy(){this.destroyed=true;}pause(){this.paused=true;}action(a){this.lastAction=a;}},danceGamesHTML,DanceGameSession:class{mount(){}destroy(){this.destroyed=true;}pause(){this.paused=true;}action(a){this.lastAction=a;}},deskHTML,homeActivityHTML,createBath,createHug,HOME_ACTIVITY_ASSETS,HomeActivitySession:class{mount(){}destroy(){this.destroyed=true;}cancelGesture(){this.cancelled=true;}action(a){this.lastAction=a;}},tvHTML,HomePlatformer:class{mount(){}destroy(){this.destroyed=true;}pause(){this.paused=true;}action(a){this.lastAction=a;}},trampolineHTML,TrampolineSession:class{mount(){}destroy(){this.destroyed=true;}pause(){this.paused=true;}action(a){this.lastAction=a;}},slideHTML,SlideSession:class{mount(){}destroy(){this.destroyed=true;}pause(){this.paused=true;}action(a){this.lastAction=a;}},swingHTML,SwingSession:class{mount(){}destroy(){this.destroyed=true;}pause(){this.paused=true;}action(a){this.lastAction=a;}},createSandpit,sandpitHTML,SandpitSession:class{constructor({state}){this.state=state;}mount(){}destroy(){this.destroyed=true;}cancelGesture(){this.cancelled=true;}help(){}collect(){}},parkMemoriesHTML,memoryAlbum,memoryTabs,MEMORY_SCENES,KPOP_SONGS,kpopLibraryHTML,kpopRoomHTML,KpopSession:class{mount(){}destroy(){this.destroyed=true;}pause(){this.paused=true;}setPose(p){this.pose=p;}togglePreview(){this.preview=!this.preview;}},FESTIVAL_ASSETS,FestivalGame,taipeiToday,festivalEvents,festivalCalendarHTML,JapaneseActivity,JAPANESE_TYPES,japaneseArt,homeMapHTML,worldMapHTML,sceneHTML,CountryFlight,ADVENTURE_ASSETS,BodyActivity,BODY_TYPES,questionFor,answersFor,storySectionHTML,CHARACTER_ASSETS,LessonSpeech,SPEECH_LEVELS,speechLevel,availableVoices,voiceId,chooseVoice,questionBankHTML,GameSounds:SoundClass,console,URL,Date,Math,JSON,Promise,Error,Number,String,Array,Object,Set,fetch:async url=>({ok:true,json:async()=>url.includes('index.json')?{books:['my-school.json','all-about-my-body.json','japanese-school.json']}:structuredClone(url.includes('salon-audio')?JSON.parse(fs.readFileSync('content/salon-audio.json','utf8')):url.includes('department-audio')?JSON.parse(fs.readFileSync('content/department-audio.json','utf8')):url.includes('hospital-audio')?JSON.parse(fs.readFileSync('content/hospital-audio.json','utf8')):url.includes('scene-memories')?JSON.parse(fs.readFileSync('content/scene-memories.json','utf8')):url.includes('park-memories')?JSON.parse(fs.readFileSync('content/park-memories.json','utf8')):url.includes('festival-audio')?JSON.parse(fs.readFileSync('content/festival-audio.json','utf8')):url.includes('festivals')?JSON.parse(fs.readFileSync('content/festivals.json','utf8')):url.includes('school-stories')?storyBook:url.includes('japanese-school')?japaneseBook:url.includes('all-about-my-body')?bodyBook:course),arrayBuffer:async()=>new ArrayBuffer(200)}),document:{documentElement:{dataset:{version:'20261017.v1'}},hidden:false,body:node('body'),querySelector:sel=>sel==='#app'?app:node(sel),querySelectorAll:()=>[node('a0'),node('a1')],addEventListener:(name,fn)=>handlers[name]=fn,createElement:()=>node('overlay')},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>{if(failStorage)throw Error('blocked');storage.set(k,v);},removeItem:k=>storage.delete(k)},setTimeout:(fn,ms)=>setTimeout(fn,ms===15000?1000:ms===2000?8:ms===9000?12:0),clearTimeout,Audio:class{play(){audioLog.push({src:this.src,rate:this.playbackRate,pitch:this.preservesPitch});queueMicrotask(()=>this.onended?.());return Promise.resolve();}pause(){}},companion:()=>'<svg/>',shapeSVG:()=>'<svg/>',illustration:()=>'<svg/>',Activity:(await import('../activities.js')).Activity,makeRound:(await import('../game.js')).makeRound};const fetchContent=ctx.fetch;ctx.fetch=async url=>{requested.push(url);return fetchContent(url);};ctx.window=ctx;ctx.speechSynthesis={cancel(){}};vm.createContext(ctx);let code=fs.readFileSync('app.js','utf8').replace(/^import .*;$/gm,'');code+='\nglobalThis.api={setWorldTime:iso=>{moveClock(iso);worldClock.refresh();},openFestival,start,answer,go,ask,playSchoolStory,startJapanFlight,visitDestination,selectBook:id=>{book=catalog.find(b=>b.id===id);unit=book.units[0];},select:id=>{unit=book.units.find(u=>u.id===id);},get:()=>({salonVisit,salonSession,departmentVisit,departmentSession,dogSession,closedVenue,worldClock,hospitalVisit,hospitalSession,amusementVisit,amusementSession,tableSession,extras,memoryScene,memoryReturn,memoryIndex,lifeSession,lifePlace,ambience,schoolGate,schoolLanguage,musicSession,studioSession,homeSession,tvSession,lessonOrigin,trampolineSession,slideSession,swingSession,sandpitState,sandpitSession,page,index,phase,locked,round,records,storageOK,activity,sounds,settings,bookId:book.id,unitId:unit.id,storyState,schoolStories,flight,festivalGame,festivalYear,festivalRecords}),click:handlers=>{},setMusic:()=>settings.music=false};';await vm.runInContext("(async()=>{"+code+"})()",ctx);await settle();ctx.api.setMusic();return {api:ctx.api,handlers,node,ctx,storage,audioLog,requested};}
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
 a.play('launch');api.visitDestination('school');assert.equal(a.play('launch'),false);assert.equal(api.get().page,'school-books');assert.equal(api.get().storageOK,false);assert.equal(Object.keys(api.get().festivalRecords).length,0);
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

test('correct-answer sounds fire once for shapes, matching, roles and map, including retries',async()=>{class SpySounds{constructor(){this.hits=0;}setVolume(value){this.volume=value;}unlock(){}stop(){}dance(){}correct(){this.hits++;return 0;}}for(const id of ['week-1','week-2','week-3','week-4']){const {api}=await harness(false,SpySounds);api.select(id);await api.start();await settle();const initial=api.get();if(id==='week-1'){const q=initial.round[0];const wrong=q.options.findIndex(o=>o.shape!==q.shape);await api.answer(wrong);assert.equal(initial.sounds.hits,0);const correct=q.options.findIndex(o=>o.shape===q.shape);await Promise.all([api.answer(correct),api.answer(correct)]);}else if(id==='week-2'){const a=initial.activity,pair=a.board.map((c,i)=>c.word===a.board[0].word?i:-1).filter(i=>i>=0);await a.flip(pair[0]);assert.equal(initial.sounds.hits,0);await a.flip(pair[1]);}else{const a=initial.activity;const wrong=a.unit.words.find(w=>w.id!==a.target).id;await a.choose(wrong);assert.equal(initial.sounds.hits,0);await Promise.all([a.choose(a.target),a.choose(a.target)]);}await settle();assert.equal(initial.sounds.hits,1,id);api.go('units');}});
test('replaying a successful role answer does not repeat the effect or advance twice',async()=>{class SpySounds{constructor(){this.hits=0;}setVolume(value){this.volume=value;}unlock(){}stop(){}dance(){}correct(){this.hits++;return 0;}}const {api}=await harness(false,SpySounds);api.select('week-3');await api.start();await settle();const a=api.get().activity;a.choose(a.target);await a.replay();await settle();assert.equal(api.get().sounds.hits,1);assert.equal(a.step,1);api.go('units');});
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
 const {api,node,handlers}=await harness();api.visitDestination('school');assert.equal(api.get().page,'school-books');await handlers.click({target:{closest:()=>({dataset:{schoolLanguage:'en'}})}});assert.match(node('app').innerHTML,/All About My Body/);
 api.visitDestination('park');assert.equal(api.get().page,'scene');assert.match(node('app').innerHTML,/公園裡的小時光/);assert.match(node('app').innerHTML,/park-nickson-bench-watercolor\.(png|webp)/);api.visitDestination('world');assert.equal(api.get().page,'world');await Promise.all([api.startJapanFlight(),api.startJapanFlight()]);assert.equal(api.get().bookId,'japanese-school');assert.equal(api.get().page,'units');assert.equal(Object.keys(api.get().records).length,0);
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
 const {api,handlers,node}=await harness();api.visitDestination('park');assert.match(node('app').innerHTML,/我的回憶/);await handlers.click({target:{closest:()=>({dataset:{parkMemories:'open'}})}});assert.equal(api.get().page,'park-memories');assert.match(node('app').innerHTML,/assets\/memories\/park\/swing-01.jpg/);assert.match(node('app').innerHTML,/第 1 張，共 4 張/);await handlers.click({target:{closest:()=>({dataset:{memoryStep:'99'}})}});assert.match(node('app').innerHTML,/第 4 張，共 4 張/);await handlers.click({target:{closest:()=>({dataset:{go:'scene'}})}});assert.equal(api.get().page,'scene');assert.match(node('app').innerHTML,/公園裡的小時光/);assert.equal(Object.keys(api.get().records).length,0);
});


test('sandpit entry, background gesture cancellation, reset and return preserve textbook progress',async()=>{
 const {api,handlers,ctx,node}=await harness();api.visitDestination('park');await handlers.click({target:{closest:()=>({dataset:{sandpit:'open'}})}});assert.equal(api.get().page,'sandbox');assert.match(node('app').innerHTML,/sand-surface/);const before=api.get().sandpitState,session=api.get().sandpitSession;ctx.document.hidden=true;handlers.visibilitychange();assert.equal(session.cancelled,true);ctx.document.hidden=false;handlers.visibilitychange();assert.equal(api.get().sandpitState,before);await handlers.click({target:{closest:()=>({dataset:{sandpit:'reset'}})}});assert.notEqual(api.get().sandpitState,before);assert.equal(session.destroyed,true);await handlers.click({target:{closest:()=>({dataset:{go:'scene'}})}});assert.equal(api.get().page,'scene');assert.match(node('app').innerHTML,/公園裡的小時光/);assert.equal(Object.keys(api.get().records).length,0);
});

test('swing opens from park, pauses in background, and destroys on return without lesson records',async()=>{const {api,handlers,ctx,node}=await harness();const before=JSON.stringify(api.get().records);await handlers.click({target:{closest:()=>({dataset:{swing:'open'}})}});assert.equal(api.get().page,'swing');assert.match(node('app').innerHTML,/幫 Nickson 推秋千/);const session=api.get().swingSession;ctx.document.hidden=true;handlers.visibilitychange();assert.equal(session.paused,true);api.go('scene');assert.equal(session.destroyed,true);assert.equal(JSON.stringify(api.get().records),before);});

test('slide entry, background pause and leaving keep textbook progress intact',async()=>{const {api,handlers,ctx,node}=await harness();const before=JSON.stringify(api.get().records);await handlers.click({target:{closest:()=>({dataset:{slide:'open'}})}});assert.equal(api.get().page,'slide');assert.match(node('app').innerHTML,/滑梯接星星/);const session=api.get().slideSession;ctx.document.hidden=true;handlers.visibilitychange();assert.equal(session.paused,true);api.go('scene');assert.equal(session.destroyed,true);assert.equal(JSON.stringify(api.get().records),before);});

test('trampoline opens from park, pauses in background and cleans up without altering records',async()=>{const {api,handlers,ctx,node}=await harness();const before=JSON.stringify(api.get().records);await handlers.click({target:{closest:()=>({dataset:{bounce:'open'}})}});assert.equal(api.get().page,'trampoline');assert.match(node('app').innerHTML,/跳跳床摘星星/);const session=api.get().trampolineSession;ctx.document.hidden=true;handlers.visibilitychange();assert.equal(session.paused,true);api.go('scene');assert.equal(session.destroyed,true);assert.equal(JSON.stringify(api.get().records),before);});

test('home desk opens both real curricula and returns to desk without changing progress',async()=>{const {api,handlers,node}=await harness();const click=dataset=>handlers.click({target:{closest:()=>({dataset})}});const before=JSON.stringify(api.get().records);await click({houseRoom:'desk'});assert.equal(api.get().page,'home-desk');await click({homeLanguage:'en'});assert.match(node('app').innerHTML,/All About My Body/);await click({homeBook:'all-about-my-body'});assert.equal(api.get().bookId,'all-about-my-body');assert.equal(api.get().page,'units');assert.equal(api.get().lessonOrigin,'home-desk');assert.match(node('app').innerHTML,/返回書桌/);api.go('home-desk');await click({homeLanguage:'ja'});await click({homeBook:'japanese-school'});assert.equal(api.get().bookId,'japanese-school');assert.equal(JSON.stringify(api.get().records),before);});
test('home activities and TV pause or clean up when hidden and when leaving',async()=>{const {api,handlers,ctx}=await harness();const click=dataset=>handlers.click({target:{closest:()=>({dataset})}});await click({houseRoom:'bath'});const bath=api.get().homeSession;ctx.document.hidden=true;handlers.visibilitychange();assert.equal(bath.cancelled,true);await click({houseRoom:'hug'});assert.equal(bath.destroyed,true);const hug=api.get().homeSession;await click({houseRoom:'tv'});assert.equal(hug.destroyed,true);const tv=api.get().tvSession;handlers.visibilitychange();assert.equal(tv.paused,true);api.go('house');assert.equal(tv.destroyed,true);assert.equal(api.get().page,'scene');assert.equal(Object.keys(api.get().records).length,0);});

test('dance games open from studio and pause or clean up without changing lesson records',async()=>{const {api,handlers,ctx,node}=await harness();const before=JSON.stringify(api.get().records);await handlers.click({target:{closest:()=>({dataset:{studioOpen:'true'}})}});assert.equal(api.get().page,'dance-game');assert.match(node('app').innerHTML,/記憶舞步/);const session=api.get().studioSession;ctx.document.hidden=true;handlers.visibilitychange();assert.equal(session.paused,true);api.go('dance-room');assert.equal(session.destroyed,true);assert.equal(api.get().page,'scene');assert.match(node('app').innerHTML,/一起走進舞蹈教室/);assert.equal(JSON.stringify(api.get().records),before);});

test('music games open from classroom and pause or destroy without textbook changes',async()=>{const {api,handlers,ctx,node}=await harness();const before=JSON.stringify(api.get().records);await handlers.click({target:{closest:()=>({dataset:{musicOpen:'true'}})}});assert.equal(api.get().page,'music-game');assert.match(node('app').innerHTML,/小小合奏/);const session=api.get().musicSession;ctx.document.hidden=true;handlers.visibilitychange();assert.equal(session.paused,true);api.go('music-room');assert.equal(session.destroyed,true);assert.match(node('app').innerHTML,/一起走進音樂教室/);assert.equal(JSON.stringify(api.get().records),before);});

test('school language selector opens English and Japanese textbooks and preserves records',async()=>{const {api,handlers,node}=await harness();const click=dataset=>handlers.click({target:{closest:()=>({dataset})}});api.visitDestination('school');assert.equal(api.get().page,'school-books');await click({schoolLanguage:'en'});await click({schoolBook:'all-about-my-body'});assert.equal(api.get().bookId,'all-about-my-body');assert.match(node('app').innerHTML,/返回學校課本/);api.go('school-books');await click({schoolLanguage:'ja'});await click({schoolBook:'japanese-school'});assert.equal(api.get().bookId,'japanese-school');assert.equal(Object.keys(api.get().records).length,0);});
test('triple panda click locks non-school destinations and stale routes while lessons remain usable',async()=>{const {api,handlers,node,storage}=await harness();for(let i=0;i<3;i++)await handlers.click({target:{closest:()=>({dataset:{schoolGate:'true'}})}});assert.equal(api.get().schoolGate.locked,true);assert.equal(storage.get(SCHOOL_GATE_KEY),'true');assert.equal(api.get().page,'home');assert.match(node('app').innerHTML,/專心上課模式/);api.visitDestination('park');assert.equal(api.get().page,'home');api.go('music-game');assert.equal(api.get().page,'home');api.go('world');assert.equal(api.get().page,'home');api.visitDestination('school');assert.equal(api.get().page,'school-books');await handlers.click({target:{closest:()=>({dataset:{schoolLanguage:'ja'}})}});await handlers.click({target:{closest:()=>({dataset:{schoolBook:'japanese-school'}})}});assert.equal(api.get().page,'units');assert.equal(api.get().bookId,'japanese-school');assert.equal(api.get().schoolGate.unlock('000000'),false);assert.equal(api.get().schoolGate.unlock('666666'),true);api.visitDestination('park');assert.equal(api.get().page,'scene');});

test('homepage requests only content, not every scene or audio; contextual games preserve lessons and obey focus mode',async()=>{const {api,handlers,ctx,requested}=await harness();assert.ok(requested.length>0);assert.ok(requested.every(url=>url.includes('.json')));const before=JSON.stringify(api.get().records);api.visitDestination('family');await handlers.click({target:{closest:()=>({dataset:{lifeOpen:'market'}})}});assert.equal(api.get().page,'life-game');const session=api.get().lifeSession;ctx.document.hidden=true;handlers.visibilitychange();assert.equal(session.paused,true);ctx.document.hidden=false;api.go('scene');assert.equal(session.destroyed,true);assert.equal(JSON.stringify(api.get().records),before);for(let i=0;i<3;i++)await handlers.click({target:{closest:()=>({dataset:{schoolGate:'true'}})}});await handlers.click({target:{closest:()=>({dataset:{lifeOpen:'market'}})}});assert.equal(api.get().page,'home');api.go('life-game');assert.equal(api.get().page,'home');});

test('scene albums keep return context and lesson progress while focus mode blocks photos',async()=>{const {api,handlers,node}=await harness();const click=dataset=>handlers.click({target:{closest:()=>({dataset})}});api.visitDestination('home');await click({sceneMemories:'home'});assert.equal(api.get().page,'park-memories');assert.equal(api.get().memoryScene,'home');assert.match(node('app').innerHTML,/共 5 張/);await click({memoryStep:'1'});assert.equal(api.get().memoryIndex,1);await click({memoryScene:'school'});assert.equal(api.get().memoryIndex,0);assert.match(node('app').innerHTML,/專心探索的小時光/);assert.match(node('app').innerHTML,/返回家裡/);await click({go:'scene'});assert.match(node('app').innerHTML,/歡迎回到我們的家/);api.visitDestination('school');await click({sceneMemories:'school'});assert.equal(api.get().memoryReturn,'school-books');await click({go:'school-books'});assert.match(node('app').innerHTML,/今天要上哪一堂課/);for(let i=0;i<3;i++)await click({schoolGate:'true'});await click({sceneMemories:'school'});assert.equal(api.get().page,'home');assert.equal(Object.keys(api.get().records).length,0);});

test('volume preferences persist independently and repeated bank speech does not restart its clip',async()=>{const {api,handlers,node,audioLog,storage}=await harness();api.go('settings');node('#volume-speech').oninput({target:{value:'30'}});node('#volume-effects').oninput({target:{value:'65'}});node('#volume-ambient').oninput({target:{value:'0'}});assert.equal(api.get().settings.speechVolume,30);assert.equal(api.get().sounds.volume,.65);assert.equal(api.get().ambience.volume,0);assert.equal(JSON.parse(storage.get('nickson-settings')).speechVolume,30);const dataset={bankSpeech:'circle',bankBook:'my-school',bankUnit:'week-1'};await Promise.all([handlers.click({target:{closest:()=>({dataset})}}),handlers.click({target:{closest:()=>({dataset})}})]);await settle();assert.equal(audioLog.length,1);assert.equal(Object.keys(api.get().records).length,0);});


test('parent learned-only preference persists and empty life review does not pretend a round completed',async()=>{const {api,node,storage,handlers}=await harness();api.go('settings');assert.match(node('app').innerHTML,/備份與還原/);assert.match(node('app').innerHTML,/修改解鎖密碼/);node('#only-learned').onchange({target:{checked:true}});assert.equal(JSON.parse(storage.get('panda-school-extras')).onlyLearned,true);await handlers.click({target:{closest:()=>({dataset:{lifeOpen:'bath'}})}});assert.equal(api.get().page,'life-game');assert.match(node('app').innerHTML,/還沒有學過/);assert.equal(Object.keys(api.get().records).length,0);});
test('parent memory story edits are local, reflected in albums and do not affect school records',async()=>{const {api,node,storage,handlers}=await harness();api.go('settings');const photo=JSON.parse(fs.readFileSync('content/scene-memories.json')).albums.home.photos[0];handlers.submit({preventDefault(){},target:{id:'memory-note-form',elements:{photo:{value:photo.id},date:{value:'2026-10-18'},caption:{value:'一起出發 <3'}}}});assert.equal(JSON.parse(storage.get('panda-school-extras')).notes[photo.id].caption,'一起出發 <3');await handlers.click({target:{closest:()=>({dataset:{sceneMemories:'home'}})}});assert.match(node('app').innerHTML,/一起出發 &lt;3/);assert.equal(Object.keys(api.get().records).length,0);});


test('backup undo remains reachable after leaving and reopening parent settings',async()=>{const {api,node,handlers}=await harness();api.go('settings');const payload=JSON.stringify({app:'panda-school',schema:1,data:{'nickson-settings':{speed:5}}});await node('#backup-file').onchange({target:{files:[{size:payload.length,text:async()=>payload}]}});assert.match(node('#backup-preview').innerHTML,/確認還原/);await handlers.click({target:{closest:()=>({dataset:{parentTool:'restore'}})}});assert.equal(api.get().settings.speed,5);assert.equal(node('#parent-backup').open,true);api.go('home');api.go('settings');assert.match(node('#backup-preview').innerHTML,/復原這次還原/);await handlers.click({target:{closest:()=>({dataset:{parentTool:'undo'}})}});assert.equal(api.get().settings.speed,3);});
test('parent shortcuts open the matching section and story feedback stays beside its form',async()=>{const {api,node,handlers}=await harness();api.go('settings');await handlers.click({target:{closest:selector=>selector==='.parent-shortcuts a'?{tagName:'A',getAttribute:()=> '#parent-memories'}:null}});assert.equal(node('#parent-memories').open,true);const photo=JSON.parse(fs.readFileSync('content/scene-memories.json')).albums.home.photos[0];handlers.submit({preventDefault(){},target:{id:'memory-note-form',elements:{photo:{value:photo.id},date:{value:''},caption:{value:'小故事'}}}});assert.match(node('#memory-note-status').textContent,/已儲存/);assert.equal(node('#parent-tool-status').textContent,'');});

test('table game enters from home, releases gestures on leaving and focus lock blocks it',async()=>{const {api,handlers,node}=await harness();await handlers.click({target:{closest:()=>({dataset:{tableOpen:'true'}})}});assert.equal(api.get().page,'table-game');assert.match(node('app').innerHTML,/擺好 0 \/ 9/);const table=api.get().tableSession;api.go('home');assert.equal(table.destroyed,true);api.get().schoolGate.locked=true;await handlers.click({target:{closest:()=>({dataset:{tableOpen:'true'}})}});assert.equal(api.get().page,'home');api.go('table-game');assert.equal(api.get().page,'home');});
test('pond is a park life activity with three canonical tasks and no course progress writes',async()=>{const {api,handlers,node}=await harness();await handlers.click({target:{closest:()=>({dataset:{lifeOpen:'pond'}})}});assert.equal(api.get().page,'life-game');assert.equal(api.get().lifePlace,'pond');assert.match(node('app').innerHTML,/餵魚任務 1 \/ 3/);assert.equal(Object.keys(api.get().records).length,0);});

test('second map links back to the first and preserves lessons through places, departments and shops',async()=>{
 const {api,handlers,node}=await harness();
 const click=dataset=>handlers.click({target:{closest:()=>({dataset})}});
 api.selectBook('all-about-my-body');api.select('week-3');
 const before=JSON.stringify(api.get().records);
 assert.match(node('app').innerHTML,/data-go="town"/);
 await click({go:'town'});assert.equal(api.get().page,'town');
 for(const id of ['hospital','department','salon','amusement','fire','police']){
  assert.match(node('app').innerHTML,new RegExp(`data-destination="town-${id}"`));
   await click({destination:'town-'+id});assert.equal(api.get().page,id==='amusement'?'amusement':id==='hospital'?'hospital':id==='department'?'department-store':id==='salon'?'salon':'scene');
  assert.match(node('app').innerHTML,/data-go="town"/);
  await click({go:'town'});
 }
 for(const [parent,children] of [['department',['market','bakery']]]){
  await click({destination:'town-'+parent});
  for(const child of children){
   const id=`town-${parent}-${child}`;assert.match(node('app').innerHTML,new RegExp(`data-department-value="${child}"`));
   await click({destination:id});assert.equal(api.get().page,'department-store');assert.equal(api.get().departmentVisit.room,child);
   assert.match(node('app').innerHTML,/data-department-value="lobby"/);
   await click({destination:'town-'+parent});
  }
 }
 await click({go:'town'});await click({go:'home'});
 assert.equal(api.get().page,'home');assert.match(node('app').innerHTML,/今天，想去哪裡/);
 assert.equal(api.get().bookId,'all-about-my-body');assert.equal(api.get().unitId,'week-3');
 assert.equal(JSON.stringify(api.get().records),before);
});

test('focus mode blocks the second map, every place and department, including stale buttons',async()=>{
 const {api,handlers,node}=await harness();
 const click=dataset=>handlers.click({target:{closest:()=>({dataset})}});
 api.go('town');await click({destination:'town-hospital'});
 for(let i=0;i<3;i++)await click({schoolGate:'true'});
 assert.equal(api.get().page,'home');assert.match(node('app').innerHTML,/data-go="town" disabled/);
 await click({go:'town'});assert.equal(api.get().page,'home');
 for(const id of ['town','town-hospital','town-hospital-dental','town-hospital-ent','town-department','town-department-market','town-department-bakery','town-salon','town-amusement','town-fire','town-police']){
  await click({destination:id});assert.equal(api.get().page,'home');
 }
 api.go('scene');assert.equal(api.get().page,'home');
 api.visitDestination('school');assert.equal(api.get().page,'school-books');
 assert.equal(Object.keys(api.get().records).length,0);
});

test('amusement park returns to town, pauses when hidden and keeps all learning records unchanged',async()=>{
 const {api,handlers,node,ctx}=await harness();api.selectBook('all-about-my-body');api.select('week-3');
 const before=JSON.stringify(api.get().records);api.visitDestination('town-amusement');
 assert.equal(api.get().page,'amusement');assert.match(node('app').innerHTML,/夜空煙火/);assert.match(node('app').innerHTML,/data-go="town"/);
 const session=api.get().amusementSession,visit=api.get().amusementVisit;visit.selectMode('fireworks');visit.launch();
 ctx.document.hidden=true;handlers.visibilitychange();assert.equal(session.paused,true);assert.equal(visit.paused,true);
 ctx.document.hidden=false;handlers.visibilitychange();assert.equal(visit.paused,true);assert.equal(visit.launched,1);
 api.go('town');assert.equal(session.destroyed,true);assert.equal(api.get().amusementSession,null);assert.equal(api.get().page,'town');
 assert.equal(api.get().bookId,'all-about-my-body');assert.equal(api.get().unitId,'week-3');assert.equal(JSON.stringify(api.get().records),before);
 api.visitDestination('town-amusement');assert.equal(api.get().amusementVisit,visit);
 for(let n=0;n<3;n++)await handlers.click({target:{closest:()=>({dataset:{schoolGate:'true'}})}});
 assert.equal(api.get().page,'home');api.go('amusement');assert.equal(api.get().page,'home');
 api.visitDestination('town-amusement');assert.equal(api.get().page,'home');
});
import * as HospitalModule from '../hospital.js';
const Hospital={...HospitalModule,HospitalSession:class{constructor({state,say}){this.state=state;this.say=say;}mount(){}pause(){this.paused=true;this.state.paused=true;this.state.cancelExam();}destroy(){this.destroyed=true;this.state.paused=false;this.state.cancelExam();}}};
test('hospital routes, reentry and background pause preserve textbook selections and records',async()=>{
 const {api,handlers,node,ctx,storage}=await harness();api.selectBook('all-about-my-body');api.select('week-3');
 const before=JSON.stringify(api.get().records),extras=JSON.stringify(api.get().extras),stored=JSON.stringify([...storage]);
 api.visitDestination('town-hospital');assert.equal(api.get().page,'hospital');assert.equal(api.get().hospitalVisit.room,'lobby');assert.match(node('app').innerHTML,/data-go="town"/);
 for(const room of ['dental','ent']){api.visitDestination('town-hospital-'+room);assert.equal(api.get().hospitalVisit.room,room);assert.equal(api.get().page,'hospital');}
 const visit=api.get().hospitalVisit,session=api.get().hospitalSession;visit.takeTicket();ctx.document.hidden=true;handlers.visibilitychange();assert.equal(session.paused,true);assert.equal(visit.paused,true);
 ctx.document.hidden=false;handlers.visibilitychange();assert.equal(visit.paused,true);api.go('town');assert.equal(session.destroyed,true);assert.equal(api.get().hospitalSession,null);
 api.visitDestination('town-hospital-ent');assert.equal(api.get().hospitalVisit,visit);assert.equal(visit.current.ticket,true);assert.equal(visit.parts.length,3);
 assert.equal(api.get().bookId,'all-about-my-body');assert.equal(api.get().unitId,'week-3');assert.equal(JSON.stringify(api.get().records),before);assert.equal(JSON.stringify(api.get().extras),extras);assert.equal(JSON.stringify([...storage]),stored);
 for(let i=0;i<3;i++)await handlers.click({target:{closest:()=>({dataset:{schoolGate:'true'}})}});
 assert.equal(api.get().page,'home');api.go('hospital');assert.equal(api.get().page,'home');api.visitDestination('town-hospital-dental');assert.equal(api.get().page,'home');
});
test('hospital short voice callback uses its matching WAV and existing parent speech speed',async()=>{
 const {api,audioLog}=await harness(false,GameSounds,{music:false,zhVoice:'recorded',speed:2,speechVolume:60});api.visitDestination('town-hospital');
 const manifest=JSON.parse(fs.readFileSync('content/hospital-audio.json','utf8')),before=JSON.stringify(api.get().records);
 const text='先拿一張號碼牌。';assert.equal(await api.get().hospitalSession.say(text),true);assert.equal(audioLog.at(-1).src,manifest.audio[text]);assert.equal(audioLog.at(-1).rate,.875);assert.equal(JSON.stringify(api.get().records),before);
});

test('closed venues reject map, direct and stale entries without changing learning records',async()=>{const {api,handlers,node}=await harness();const before=JSON.stringify(api.get().records);api.setWorldTime('2026-10-19T13:00:00Z');for(const id of ['town-hospital','town-hospital-dental','town-department-bakery','town-amusement','town-salon','family','dance','music']){api.visitDestination(id);assert.equal(api.get().page,'venue-closed',id);assert.match(node('app').innerHTML,/08:00–21:00/);}for(const page of ['hospital','amusement','dance-game','music-game','kpop','kpop-room']){api.go(page);assert.equal(api.get().page,'venue-closed',page);}await handlers.click({target:{closest:()=>({dataset:{lifeOpen:'market'}})}});assert.equal(api.get().page,'venue-closed');api.visitDestination('school');assert.equal(api.get().page,'school-books');api.visitDestination('town-fire');assert.equal(api.get().page,'scene');assert.equal(JSON.stringify(api.get().records),before);});
test('21:00 closes a running hospital session, destroys audio/gesture owner and reopens only on explicit entry',async()=>{const {api,node,handlers}=await harness();api.setWorldTime('2026-10-19T12:59:00Z');api.visitDestination('town-hospital-ent');const session=api.get().hospitalSession,before=JSON.stringify(api.get().records);api.setWorldTime('2026-10-19T13:00:00Z');assert.equal(session.destroyed,true);assert.equal(api.get().hospitalSession,null);assert.equal(api.get().page,'venue-closed');assert.match(node('app').innerHTML,/醫院正在休息/);api.setWorldTime('2026-10-20T00:00:00Z');assert.equal(api.get().page,'venue-closed');assert.match(node('app').innerHTML,/醫院開門了/);await handlers.click({target:{closest:()=>({dataset:{destination:'town-hospital'}})}});assert.equal(api.get().page,'hospital');assert.equal(JSON.stringify(api.get().records),before);});
test('phase changes keep a running open venue session alive and focus lock still takes priority',async()=>{const {api}=await harness();api.setWorldTime('2026-10-19T09:59:00Z');api.visitDestination('town-amusement');const session=api.get().amusementSession;api.setWorldTime('2026-10-19T10:00:00Z');assert.equal(api.get().amusementSession,session);assert.notEqual(session.destroyed,true);api.go('home');api.get().schoolGate.locked=true;api.setWorldTime('2026-10-19T13:00:00Z');api.visitDestination('town-hospital');assert.equal(api.get().page,'home');api.go('hospital');assert.equal(api.get().page,'home');});

test('one-click all-scenes access bypasses hours, keeps night visuals and focus lock, and restores normal hours',async()=>{const {api,node,handlers}=await harness();const click=()=>handlers.click({target:{closest:()=>({dataset:{worldAccess:'toggle'}})}});api.setWorldTime('2026-10-19T13:00:00Z');await click();assert.match(node('app').innerHTML,/所有場景自由開放中/);assert.match(node('app').innerHTML,/world-phase-night/);api.visitDestination('town-hospital');assert.equal(api.get().page,'hospital');api.setWorldTime('2026-10-19T14:00:00Z');assert.equal(api.get().page,'hospital');api.go('home');api.get().schoolGate.locked=true;await click();api.visitDestination('town-hospital');assert.equal(api.get().page,'home');api.get().schoolGate.locked=false;await click();api.visitDestination('town-hospital');assert.equal(api.get().page,'venue-closed');});

test('home dog entry, background pause, cleanup and focus lock preserve school records',async()=>{const {api,handlers,ctx}=await harness();const before=JSON.stringify(api.get().records);const click=dataset=>handlers.click({target:{closest:()=>({dataset})}});await click({dogOpen:'true'});assert.equal(api.get().page,'home-dog');const dog=api.get().dogSession;await click({dog:'ball'});assert.equal(dog.busy,true);ctx.document.hidden=true;handlers.visibilitychange();assert.equal(dog.paused,true);api.go('house');assert.equal(dog.destroyed,true);api.get().schoolGate.locked=true;await click({dogOpen:'true'});assert.equal(api.get().page,'scene');api.go('home-dog');assert.equal(api.get().page,'home');assert.equal(JSON.stringify(api.get().records),before);});

import * as DepartmentModule from '../department-store.js';
const Department={...DepartmentModule,DepartmentSession:class{constructor({state,say}){this.state=state;this.say=say;}mount(){}pause(){this.paused=true;this.state.paused=true;this.state.cancelBake();}destroy(){this.destroyed=true;this.state.paused=false;this.state.cancelBake();}}};
test('department store routes, retained visits, background and focus lock preserve every learning record',async()=>{
 const {api,handlers,ctx,node,storage}=await harness();api.selectBook('all-about-my-body');api.select('week-3');const before=JSON.stringify([...storage]),records=JSON.stringify(api.get().records),extras=JSON.stringify(api.get().extras);
 api.visitDestination('town-department');assert.equal(api.get().page,'department-store');assert.equal(api.get().departmentVisit.room,'lobby');assert.match(node('app').innerHTML,/data-go="town"/);
 api.visitDestination('town-department-market');const visit=api.get().departmentVisit;assert.equal(visit.goods.length,4);assert.equal(visit.shapes.length,3);visit.collect('rice');
 api.visitDestination('town-department-bakery');assert.equal(visit.room,'bakery');visit.knead();const session=api.get().departmentSession;ctx.document.hidden=true;handlers.visibilitychange();assert.equal(session.paused,true);ctx.document.hidden=false;handlers.visibilitychange();assert.equal(visit.paused,true);
 api.go('town');assert.equal(session.destroyed,true);assert.equal(api.get().departmentSession,null);api.visitDestination('town-department-market');assert.equal(api.get().departmentVisit,visit);assert.equal(visit.market.collected.size,1);assert.equal(visit.bakery.kneads,1);
 assert.equal(api.get().bookId,'all-about-my-body');assert.equal(api.get().unitId,'week-3');assert.equal(JSON.stringify(api.get().records),records);assert.equal(JSON.stringify(api.get().extras),extras);assert.equal(JSON.stringify([...storage]),before);
 for(let i=0;i<3;i++)await handlers.click({target:{closest:()=>({dataset:{schoolGate:'true'}})}});api.go('department-store');assert.equal(api.get().page,'home');for(const id of ['town-department','town-department-market','town-department-bakery']){api.visitDestination(id);assert.equal(api.get().page,'home');}
});
test('department narration uses matching WAV and parent speed, without changing learning progress',async()=>{
 const {api,audioLog}=await harness(false,GameSounds,{music:false,zhVoice:'recorded',speed:2,speechVolume:70});api.visitDestination('town-department');const before=JSON.stringify(api.get().records),audio=JSON.parse(fs.readFileSync('content/department-audio.json','utf8')).audio,text='點點麵團，揉一揉。';
 assert.equal(await api.get().departmentSession.say(text),true);assert.equal(audioLog.at(-1).src,audio[text]);assert.equal(audioLog.at(-1).rate,.875);assert.equal(JSON.stringify(api.get().records),before);
});

test('department closes at 21:00, cancels pending baking and reopens only on explicit entry',async()=>{
 const {api,handlers,node}=await harness();api.setWorldTime('2026-10-19T12:59:00Z');api.visitDestination('town-department-bakery');const visit=api.get().departmentVisit,session=api.get().departmentSession,before=JSON.stringify(api.get().records);
 for(let n=0;n<6;n++)visit.knead();visit.next();visit.chooseShape('star');visit.next();assert.equal(visit.startBake(),true);
 api.setWorldTime('2026-10-19T13:00:00Z');assert.equal(api.get().page,'venue-closed');assert.equal(session.destroyed,true);assert.equal(api.get().departmentSession,null);assert.equal(visit.bakery.bake,'ready');assert.match(node('app').innerHTML,/百貨正在休息/);
 api.go('department-store');assert.equal(api.get().page,'venue-closed');api.setWorldTime('2026-10-20T00:00:00Z');assert.equal(api.get().page,'venue-closed');assert.match(node('app').innerHTML,/百貨開門了/);
 await handlers.click({target:{closest:()=>({dataset:{destination:'town-department'}})}});assert.equal(api.get().page,'department-store');assert.equal(api.get().departmentVisit,visit);assert.equal(visit.bakery.bake,'ready');assert.equal(JSON.stringify(api.get().records),before);
});
test('department phase updates do not rebuild its session, and night access toggle still respects focus lock',async()=>{
 const {api,handlers,node}=await harness();api.setWorldTime('2026-10-19T09:59:00Z');api.visitDestination('town-department-market');const session=api.get().departmentSession;api.setWorldTime('2026-10-19T10:00:00Z');assert.equal(api.get().departmentSession,session);assert.notEqual(session.destroyed,true);
 api.go('town');api.setWorldTime('2026-10-19T13:00:00Z');const toggle=()=>handlers.click({target:{closest:()=>({dataset:{worldAccess:'toggle'}})}});await toggle();api.visitDestination('town-department-bakery');assert.equal(api.get().page,'department-store');assert.match(node('app').innerHTML,/world-phase-night/);
 api.go('town');await toggle();api.visitDestination('town-department-market');assert.equal(api.get().page,'venue-closed');api.get().schoolGate.locked=true;api.go('department-store');assert.equal(api.get().page,'home');
});

test('salon uses the supplied portrait, retains only visit hair, pauses and preserves all learning selections',async()=>{
 const {api,handlers,ctx,node,storage}=await harness();api.selectBook('all-about-my-body');api.select('week-3');const before=JSON.stringify([...storage]),records=JSON.stringify(api.get().records);api.visitDestination('town-salon');assert.equal(api.get().page,'salon');assert.match(node('app').innerHTML,/nickson-salon-ghibli-v3.webp/);assert.match(node('app').innerHTML,/data-go="town"/);
 const visit=api.get().salonVisit,session=api.get().salonSession;visit.applyZone('fringe');ctx.document.hidden=true;handlers.visibilitychange();assert.equal(visit.paused,true);ctx.document.hidden=false;handlers.visibilitychange();assert.equal(visit.paused,true);
 api.go('town');assert.equal(session.destroyed,true);api.visitDestination('town-salon');assert.equal(api.get().salonVisit,visit);assert.ok(visit.trimmed>0);assert.equal(api.get().bookId,'all-about-my-body');assert.equal(api.get().unitId,'week-3');assert.equal(JSON.stringify(api.get().records),records);assert.equal(JSON.stringify([...storage]),before);
 api.get().schoolGate.locked=true;api.go('salon');assert.equal(api.get().page,'home');api.visitDestination('town-salon');assert.equal(api.get().page,'home');
});
test('salon closes at 21:00, stops session ownership, and requires explicit morning entry',async()=>{
 const {api,node}=await harness();api.setWorldTime('2026-10-19T12:59:00Z');api.visitDestination('town-salon');const session=api.get().salonSession;api.get().salonVisit.applyZone('left');api.setWorldTime('2026-10-19T13:00:00Z');assert.equal(session.destroyed,true);assert.equal(api.get().salonSession,null);assert.equal(api.get().page,'venue-closed');assert.match(node('app').innerHTML,/理髮店正在休息/);api.go('salon');assert.equal(api.get().page,'venue-closed');api.setWorldTime('2026-10-20T00:00:00Z');assert.equal(api.get().page,'venue-closed');api.visitDestination('town-salon');assert.equal(api.get().page,'salon');assert.ok(api.get().salonVisit.trimmed>0);
});
test('salon voice uses matching recording and parent rate; night access keeps the same time and focus rules',async()=>{
 const {api,audioLog,handlers}=await harness(false,GameSounds,{music:false,zhVoice:'recorded',speed:2,speechVolume:70});api.visitDestination('town-salon');const clips=JSON.parse(fs.readFileSync('content/salon-audio.json','utf8')).audio,text='真的剪刀，要請大人幫忙。';assert.equal(await api.get().salonSession.say(text),true);assert.equal(audioLog.at(-1).src,clips[text]);assert.equal(audioLog.at(-1).rate,.875);
 const session=api.get().salonSession;api.setWorldTime('2026-10-19T09:59:00Z');api.setWorldTime('2026-10-19T10:00:00Z');assert.equal(api.get().salonSession,session);api.go('town');api.setWorldTime('2026-10-19T13:00:00Z');const toggle=()=>handlers.click({target:{closest:()=>({dataset:{worldAccess:'toggle'}})}});await toggle();api.visitDestination('town-salon');assert.equal(api.get().page,'salon');api.go('town');await toggle();api.visitDestination('town-salon');assert.equal(api.get().page,'venue-closed');
});
