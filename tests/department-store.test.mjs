import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {DepartmentVisit,departmentCatalog,KNEAD_COUNT,BAKE_MILLISECONDS} from '../department-model.js';
import {DepartmentSession,departmentHTML} from '../department-store.js';
import {departmentCue,departmentVoiceTexts,STORE_CUES} from '../department-voice.js';
const books=['my-school','japanese-school'].map(id=>JSON.parse(fs.readFileSync(`content/${id}.json`,'utf8')));
const source=departmentCatalog(books);
function visit(room='market'){const state=new DepartmentVisit(departmentCatalog(books));state.selectRoom(room);return state;}
function oven(){const state=visit('bakery');for(let n=0;n<KNEAD_COUNT;n++)state.knead();state.next();state.chooseShape('star');state.next();return state;}
function fixture(state=visit(),options={}){
 let id=0,visible=true,stops=0;const timers=new Map(),effects=[],spoken=[],events=new Map();
 const basket={getBoundingClientRect:()=>({left:100,top:100,right:200,bottom:200})};
 const session=new DepartmentSession({root:{addEventListener:(type,fn)=>events.set(type,fn),removeEventListener:type=>events.delete(type),querySelector:selector=>selector==='.ds-basket'?basket:null},state,visible:()=>visible,schedule:(fn,ms)=>{timers.set(++id,{fn,ms});return id;},cancel:key=>timers.delete(key),effect:()=>effects.push('correct'),say:async text=>{spoken.push(text);return true;},stopAudio:()=>stops++,...options});
 session.paint=()=>{};session.hint=message=>session.message=message;
 return {session,timers,effects,spoken,events,stops:()=>stops,hide:()=>visible=false,show:()=>visible=true,run:()=>{const [key,work]=timers.entries().next().value;timers.delete(key);work.fn();}};
}
test('department labels and shapes come from canonical books, with honest missing-data states',()=>{
 assert.deepEqual(source.goods.map(item=>item.zh),['白飯','菜','肉','魚']);assert.deepEqual(source.shapes.map(item=>item.zh),['圓形','三角形','星形']);
 const changed=structuredClone(books);changed[1].units[1].words[0].zh='米飯';assert.equal(departmentCatalog(changed).goods[0].zh,'米飯');assert.deepEqual(departmentCatalog([]),{goods:[],shapes:[]});
 const state=new DepartmentVisit();state.selectRoom('market');assert.equal(state.marketReady,false);assert.equal(state.collect('rice'),false);assert.equal(state.next(),false);assert.equal(departmentCue(state),STORE_CUES.missing);
});
test('shopping accepts exactly the three requested groceries in any order, without duplicate score',()=>{
 const state=visit();assert.equal(state.collect('meat'),false);assert.equal(state.collect('__proto__'),false);assert.equal(state.next(),false);
 for(const id of ['fish','rice','vegetables']){assert.equal(state.collect(id),true);assert.equal(state.collect(id),false);}assert.equal(state.market.collected.size,3);assert.equal(state.stamps.size,0);assert.equal(state.next(),true);assert.equal(state.collect('rice'),false);
});
test('checkout scans each item once, then uses three distinct pretend coins and completes once',()=>{
 const state=visit();assert.equal(state.scan('rice'),false);assert.equal(state.pay('0'),false);for(const item of state.list)state.collect(item.id);state.next();
 assert.equal(state.scan('meat'),false);assert.equal(state.next(),false);for(const item of state.list){assert.equal(state.scan(item.id),true);assert.equal(state.scan(item.id),false);}assert.equal(state.next(),true);
 for(const bad of ['-1','3','NaN',''])assert.equal(state.pay(bad),false);for(const id of ['2','0','1']){assert.equal(state.pay(id),true);assert.equal(state.pay(id),false);}
 assert.equal(state.stamps.size,0);assert.equal(state.next(),true);assert.equal(state.next(),false);assert.deepEqual([...state.stamps],['market']);
});
test('bakery needs six kneads, a valid shape, explicit staff baking, cooling and three unique packed breads',()=>{
 const state=visit('bakery');assert.equal(state.chooseShape('star'),false);assert.equal(state.startBake(),false);assert.equal(state.pack('0'),false);
 for(let n=0;n<6;n++)assert.equal(state.knead(),true);assert.equal(state.knead(),false);assert.equal(state.next(),true);assert.equal(state.chooseShape('square'),false);assert.equal(state.chooseShape('triangle'),true);assert.equal(state.chooseShape('triangle'),false);assert.equal(state.chooseShape('star'),true);assert.equal(state.next(),true);
 assert.equal(state.next(),false);assert.equal(state.finishBake('star'),false);assert.equal(state.startBake(),true);assert.equal(state.startBake(),false);assert.equal(state.finishBake('triangle'),false);assert.equal(state.finishBake('star'),true);assert.equal(state.finishBake('star'),false);assert.equal(state.next(),true);
 for(const id of ['0','1','2']){assert.equal(state.pack(id),true);assert.equal(state.pack(id),false);}assert.equal(state.pack('3'),false);assert.equal(state.next(),true);assert.equal(state.next(),false);assert.deepEqual([...state.stamps],['bakery']);
});
test('room changes preserve both visits, reset affects only that shop and invalid rooms are ignored',()=>{
 const state=visit();state.collect('rice');state.selectRoom('bakery');state.knead();state.chooseShape('bad');assert.equal(state.selectRoom('constructor'),false);state.selectRoom('market');assert.equal(state.market.collected.size,1);state.reset();assert.equal(state.market.collected.size,0);assert.equal(state.bakery.kneads,1);state.selectRoom('lobby');assert.equal(state.reset(),false);
});
test('pause cancels staff baking; resume does not silently finish or restart it',()=>{
 const {session,timers,hide,show,run}=fixture(oven());session.action('bake');assert.equal(timers.size,1);assert.equal([...timers.values()][0].ms,BAKE_MILLISECONDS);const stale=[...timers.values()][0].fn;
 hide();session.pause();stale();assert.equal(session.state.bakery.bake,'ready');assert.equal(timers.size,0);show();session.resume();assert.equal(timers.size,0);session.action('bake');assert.equal(timers.size,1);stale();assert.equal(timers.size,1);run();assert.equal(session.state.bakery.bake,'cooled');
});
test('switching shops, replay or leaving clears timers and rejects stale oven callbacks',()=>{
 for(const action of ['room','reset','destroy']){const {session,timers,events}=fixture(oven());session.mount();session.action('bake');const old=[...timers.values()][0].fn;
  if(action==='destroy')session.destroy();else session.action(action,action==='room'?'market':'');old();assert.notEqual(session.state.bakery.bake,'cooled');assert.equal(timers.size,0);session.destroy();assert.equal(events.size,0);const count=session.state.market.collected.size;session.action('collect','rice');assert.equal(session.state.market.collected.size,count);
 }
});
test('rapid bake clicks create one job and reduced motion still requires explicit staff action',()=>{
 const {session,timers,run}=fixture(oven(),{reducedMotion:true});assert.equal(session.state.bakery.bake,'ready');session.action('bake');session.action('bake');session.action('bake');assert.equal(timers.size,1);assert.equal([...timers.values()][0].ms,0);run();assert.equal(session.state.bakery.bake,'cooled');assert.equal(session.state.bakery.step,2);
});
test('all mutations and stale controls stay blocked while resting',()=>{
 const {session,effects}=fixture();session.action('collect','rice');session.pause();session.action('collect','fish');session.action('next');session.action('room','bakery');session.action('reset');assert.equal(session.state.market.collected.size,1);assert.equal(session.state.room,'market');assert.equal(effects.length,1);session.resume();session.action('collect','fish');assert.equal(session.state.market.collected.size,2);
});
function pointerFixture(){
 const f=fixture();let captured=false,releases=0,ghostRemoved=0;
 f.session.root.ownerDocument={createElement:()=>({style:{},setAttribute(){},remove(){ghostRemoved++;}}),body:{append(){}}};
 const target={disabled:false,dataset:{department:'collect',departmentValue:'rice'},setPointerCapture:()=>captured=true,hasPointerCapture:()=>captured,releasePointerCapture:()=>{captured=false;releases++;},querySelector:()=>({outerHTML:'<svg/>'})};
 const event=(x,y,id=1)=>({pointerId:id,button:0,clientX:x,clientY:y,target:{closest:()=>target},preventDefault(){}});
 return {...f,target,event,releases:()=>releases,removed:()=>ghostRemoved};
}
test('captured tap places one grocery and suppresses its synthesized duplicate click',()=>{
 const {session,event,target,effects,releases}=pointerFixture();session.pointerDown(event(20,20));session.pointerUp(event(20,20));assert.equal(session.state.market.collected.size,1);assert.equal(releases(),1);
 session.click({detail:1,target:{closest:()=>target}});assert.equal(session.state.market.collected.size,1);assert.equal(effects.length,1);assert.equal(session.suppressedClick,null);
});
test('drag only collects inside basket; drop outside, wrong pointer and cancellation never collect',()=>{
 const {session,event,releases,removed}=pointerFixture();session.pointerDown(event(20,20));session.pointerMove(event(150,150));session.pointerUp(event(150,150,99));assert.ok(session.gesture);session.pointerUp(event(150,150));assert.equal(session.state.market.collected.size,1);assert.equal(releases(),1);assert.equal(removed(),1);
 session.state.reset();session.pointerDown(event(20,20));session.pointerMove(event(300,300));session.pointerUp(event(300,300));assert.equal(session.state.market.collected.size,0);
 session.pointerDown(event(20,20));session.pointerUp(event(300,300));assert.equal(session.state.market.collected.size,0);
 session.pointerDown(event(20,20));session.pointerMove(event(150,150));session.pointerCancel();session.pointerUp(event(150,150));assert.equal(session.state.market.collected.size,0);assert.equal(session.gesture,null);
});
test('pause and destroy remove drag ghosts and release capture, without post-exit collection',()=>{
 const {session,event,releases,removed}=pointerFixture();session.pointerDown(event(20,20));session.pointerMove(event(150,150));session.pause();assert.equal(session.gesture,null);assert.equal(releases(),1);assert.equal(removed(),1);session.pointerUp(event(150,150));assert.equal(session.state.market.collected.size,0);
 session.resume();session.pointerDown(event(20,20));session.pointerMove(event(150,150));session.destroy();assert.equal(session.gesture,null);assert.equal(releases(),2);assert.equal(removed(),2);
});
test('secondary pointers and non-primary mouse buttons cannot steal a shopping gesture',()=>{
 const {session,event}=pointerFixture();session.pointerDown({...event(20,20),isPrimary:false});session.pointerDown({...event(20,20),button:2});assert.equal(session.gesture,null);session.pointerDown(event(20,20));session.pointerDown(event(30,30,2));assert.equal(session.gesture.id,1);
});
test('automatic short cues follow canonical grocery goals and shape/bake/pack stages',()=>{
 const state=visit();assert.equal(departmentCue(state),'找找白飯，放進籃子。');state.collect('rice');assert.equal(departmentCue(state),'找找菜，放進籃子。');state.collect('vegetables');state.collect('fish');assert.equal(departmentCue(state),STORE_CUES.basketDone);
 state.selectRoom('bakery');assert.equal(departmentCue(state),STORE_CUES.knead);for(let n=0;n<6;n++)state.knead();assert.equal(departmentCue(state),STORE_CUES.kneaded);state.next();assert.equal(departmentCue(state),STORE_CUES.shape);state.chooseShape('star');assert.equal(departmentCue(state),STORE_CUES.shaped);state.next();state.startBake();assert.equal(departmentCue(state),'');state.cancelBake();assert.equal(departmentCue(state),STORE_CUES.bake);
});
test('same pending replay is shared and late narration cannot overwrite a new room or rest state',async()=>{
 const spoken=[],resolvers=[];const {session}=fixture(visit(),{say:text=>{spoken.push(text);return new Promise(resolve=>resolvers.push(resolve));}});session.mount();session.action('listen');session.action('listen');assert.equal(spoken.length,1);const old=resolvers[0];session.action('room','bakery');const message=session.message;old(false);await Promise.resolve();assert.equal(session.message,message);
 session.pause();const count=spoken.length;resolvers.forEach(resolve=>resolve(true));await Promise.resolve();assert.equal(spoken.length,count);session.resume();assert.equal(spoken.at(-1),STORE_CUES.knead);
 const queued=[],release=[];const other=fixture(visit(),{say:text=>{queued.push(text);return new Promise(resolve=>release.push(resolve));}}).session;other.action('collect','meat');assert.deepEqual(queued,[STORE_CUES.retry]);other.destroy();release[0](true);await Promise.resolve();assert.deepEqual(queued,[STORE_CUES.retry]);
});
test('knead, scan and coin partial progress do not chatter; completion is narrated once',()=>{
 const {session,spoken}=fixture(visit('bakery'));session.mount();for(let n=0;n<6;n++)session.action('knead');assert.deepEqual(spoken,[STORE_CUES.knead,STORE_CUES.kneaded]);session.action('knead');assert.equal(spoken.length,2);
 const market=fixture(visit());for(const item of market.session.state.list)market.session.action('collect',item.id);market.session.action('next');const before=market.spoken.length;market.session.action('scan','rice');market.session.action('scan','vegetables');assert.equal(market.spoken.length,before);market.session.action('scan','fish');assert.equal(market.spoken.at(-1),STORE_CUES.scanned);
});
test('failed audio marks replay available, but an old failure after leaving has no effect',async()=>{
 const {session}=fixture(visit(),{say:async()=>false});assert.equal(await session.narrate(),false);assert.equal(session.voiceFailed,true);assert.match(session.message,/喇叭/);session.destroy();assert.equal(await session.narrate(),false);
});
test('every department cue has a mapped, non-silent PCM WAV and offline resources exclude source PNG duplicates',()=>{
 const audio=JSON.parse(fs.readFileSync('content/department-audio.json','utf8')).audio,files=new Set(JSON.parse(fs.readFileSync('offline-manifest.json','utf8')).files.map(file=>file.url));assert.deepEqual(Object.keys(audio).sort(),departmentVoiceTexts(source.goods).sort());
 for(const file of ['department-store.js','department-model.js','department-voice.js','department-art.js','department-store.css','content/department-audio.json','assets/department.prompts.json'])assert.ok(files.has(file),file);
 for(const room of ['lobby','market','bakery']){assert.ok(files.has(`assets/department-${room}-watercolor.webp`));assert.equal(files.has(`assets/department-${room}-watercolor.png`),false);}
 for(const file of Object.values(audio)){assert.ok(files.has(file),file);const wav=fs.readFileSync(file);assert.equal(wav.toString('ascii',0,4),'RIFF');assert.equal(wav.toString('ascii',8,12),'WAVE');let fmt,data;for(let i=12;i+8<=wav.length;){const name=wav.toString('ascii',i,i+4),size=wav.readUInt32LE(i+4);if(name==='fmt ')fmt=wav.subarray(i+8,i+8+size);if(name==='data')data=wav.subarray(i+8,i+8+size);i+=8+size+size%2;}assert.ok(fmt&&data);assert.equal(fmt.readUInt16LE(14),16);const duration=data.length/fmt.readUInt32LE(8);assert.ok(duration>.5&&duration<8);let peak=0;for(let i=0;i+1<data.length;i+=2)peak=Math.max(peak,Math.abs(data.readInt16LE(i)));assert.ok(peak>1000,file);}
 assert.match(departmentHTML(),/data-department="listen"/);
});
