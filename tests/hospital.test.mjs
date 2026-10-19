import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {HospitalVisit,HospitalSession,hospitalParts,BRUSH_ZONES,HOSPITAL_ROOMS,hospitalHTML} from '../hospital.js';
import {hospitalCue,HOSPITAL_CUES,hospitalVoiceTexts} from '../hospital-voice.js';

const book=JSON.parse(fs.readFileSync('content/all-about-my-body.json','utf8'));
const parts=hospitalParts([book]);
function practice(room='dental'){
 const state=new HospitalVisit(parts);state.selectRoom(room);assert.equal(state.next(),false);
 state.takeTicket();state.matchTicket(HOSPITAL_ROOMS[room].ticket);state.next();state.chooseFeeling('nervous');state.next();state.chooseTool(HOSPITAL_ROOMS[room].tool);state.next();return state;
}
function fixture(state=practice(),options={}){
 let id=0,visible=true;const timers=new Map(),effects=[],listeners=new Map();let stops=0;
 const session=new HospitalSession({state,root:{addEventListener:(type,fn)=>listeners.set(type,fn),removeEventListener:type=>listeners.delete(type)},visible:()=>visible,schedule:fn=>{timers.set(++id,fn);return id;},cancel:key=>timers.delete(key),effect:()=>effects.push('correct'),stopAudio:()=>stops++,...options});
 session.paint=()=>{};session.paintBrush=()=>{};session.hint=message=>session.message=message;
 return {session,timers,effects,listeners,stops:()=>stops,hide:()=>visible=false,show:()=>visible=true,run:()=>{const [key,fn]=timers.entries().next().value;timers.delete(key);fn();}};
}
test('hospital reuses canonical part labels and does not invent a replacement list',()=>{
 assert.deepEqual(parts,[{id:'ears',zh:'耳朵'},{id:'nose',zh:'鼻子'},{id:'mouth',zh:'嘴巴'}]);
 const modified=structuredClone(book);modified.units[0].words.find(w=>w.id==='ears').zh='耳部';assert.equal(hospitalParts([modified])[0].zh,'耳部');
 assert.deepEqual(hospitalParts([]),[]);const state=practice('ent');state.parts=[];assert.equal(state.choosePart('ears'),false);
});
test('registration requires ticket, matching call, feeling and correct clinician tool in order',()=>{
 const state=new HospitalVisit(parts);assert.equal(state.takeTicket(),false);assert.equal(state.selectRoom('__proto__'),false);state.selectRoom('dental');
 assert.equal(state.matchTicket('12'),false);assert.equal(state.chooseTool('mirror'),false);assert.equal(state.takeTicket(),true);assert.equal(state.takeTicket(),false);
 assert.equal(state.matchTicket('21'),false);assert.equal(state.next(),false);assert.equal(state.matchTicket('12'),true);assert.equal(state.matchTicket('12'),false);assert.equal(state.next(),true);
 assert.equal(state.chooseFeeling('invalid'),false);assert.equal(state.next(),false);assert.equal(state.chooseFeeling('nervous'),true);assert.equal(state.next(),true);
 assert.equal(state.chooseTool('brush'),false);assert.equal(state.chooseTool('mirror'),true);assert.equal(state.chooseTool('mirror'),false);assert.equal(state.next(),true);
});
test('six model zones complete only once, never count a duplicate tap or skip a zone',()=>{
 const state=practice();assert.equal(state.brush('bad'),false);assert.equal(state.next(),false);
 for(const zone of BRUSH_ZONES){assert.equal(state.brush(zone.id),true);assert.equal(state.brush(zone.id),false);}
 assert.equal(state.current.cleaned.size,6);assert.equal(state.stamps.size,0);assert.equal(state.next(),true);assert.equal(state.next(),false);assert.deepEqual([...state.stamps],['dental']);
 state.selectRoom('ent');assert.equal(state.current.step,0);state.selectRoom('dental');assert.equal(state.current.step,4);state.reset();assert.equal(state.current.cleaned.size,0);assert.equal(state.stamps.size,1);
});
test('ENT needs correct part then explicit doctor demonstration for each target',()=>{
 const state=practice('ent');assert.equal(state.startExam(),false);assert.equal(state.choosePart('nose'),false);
 for(const part of parts){assert.equal(state.finishExam(part.id),false);assert.equal(state.choosePart(part.id),true);assert.equal(state.choosePart(part.id),false);assert.equal(state.startExam(),true);assert.equal(state.startExam(),false);assert.equal(state.finishExam('bad'),false);assert.equal(state.finishExam(part.id),true);assert.equal(state.finishExam(part.id),false);}
 assert.equal(state.current.checked.size,3);assert.equal(state.current.practiceDone,true);assert.equal(state.next(),true);assert.deepEqual([...state.stamps],['ent']);
});
test('pause blocks every practice action and requires explicit resume',()=>{
 const {session,effects}=fixture();session.action('brush','0');session.pause();session.action('brush','1');session.action('room','ent');session.action('reset');assert.equal(session.state.room,'dental');assert.equal(session.state.current.cleaned.size,1);assert.equal(effects.length,1);
 session.resume();session.action('brush','1');assert.equal(session.state.current.cleaned.size,2);
});
test('hidden ENT demonstration cannot finish, pause cancels it and resume requires a fresh request',()=>{
 const {session,timers,hide,show,run,effects}=fixture(practice('ent'));session.action('part','ears');session.action('exam');const stale=[...timers.values()][0];
 hide();session.pause();assert.equal(timers.size,0);stale();assert.equal(session.state.current.checked.size,0);assert.equal(session.state.current.exam,'ready');show();session.resume();assert.equal(timers.size,0);
 session.action('exam');assert.equal(timers.size,1);stale();assert.equal(timers.size,1);run();assert.equal(session.state.current.checked.size,1);assert.equal(effects.length,2);
});
test('department change, replay and destroy reject queued doctor callbacks and clear listeners',()=>{
 for(const action of ['room','reset','destroy']){const {session,timers,listeners}=fixture(practice('ent'));session.mount();session.action('part','ears');session.action('exam');const stale=[...timers.values()][0];
  if(action==='destroy')session.destroy();else session.action(action,action==='room'?'dental':'');stale();assert.equal(timers.size,0);assert.equal(session.state.visits.ent.checked.size,0);
  session.destroy();assert.equal(listeners.size,0);session.action('brush','0');assert.equal(session.state.visits.dental.cleaned.size,0);
 }
});
test('rapid doctor clicks schedule once; listening does not invalidate an in-flight demonstration',async()=>{
 const {session,timers,run}=fixture(practice('ent'));session.action('part','ears');session.action('exam');session.action('exam');session.action('exam');assert.equal(timers.size,1);
 session.action('listen');await Promise.resolve();run();assert.equal(session.state.current.checked.size,1);assert.equal(session.state.current.exam,'choose');
});
test('late unavailable speech cannot overwrite a new department, next step or destroyed visit',async()=>{
 for(const action of ['room','next','destroy']){const resolvers=[];const say=()=>new Promise(resolve=>resolvers.push(resolve));const state=practice('ent');const {session}=fixture(state,{say});session.action('listen');const oldResolve=resolvers[0];
  if(action==='destroy')session.destroy();else if(action==='room')session.action('room','dental');else{state.current.practiceDone=true;session.action('next');}
  const message=session.message;oldResolve(false);await Promise.resolve();assert.equal(session.message,message);
 }
});
test('captured taps and drags clean unique zones and release capture on cancel, pause or exit',()=>{
 const {session,effects}=fixture();let captured=false,released=0;const board={getBoundingClientRect:()=>({left:0,top:0,width:400,height:270}),setPointerCapture:()=>captured=true,hasPointerCapture:()=>captured,releasePointerCapture:()=>{captured=false;released++;}};
 const event=(x,y,id=7)=>({pointerId:id,button:0,clientX:x,clientY:y,target:{closest:()=>board},preventDefault(){}});
 session.pointerDown(event(100,81));session.pointerUp(event(100,81));session.action('brush','0');assert.equal(session.state.current.cleaned.size,1);assert.equal(effects.length,1);assert.equal(released,1);
 session.pointerDown(event(200,81));session.pointerMove(event(300,81));session.pointerMove(event(300,184,99));assert.equal(session.state.current.cleaned.size,3);
 session.pause();assert.equal(session.gesture,null);session.pointerMove(event(100,184));assert.equal(session.state.current.cleaned.size,3);assert.equal(released,2);
 session.resume();session.pointerDown(event(100,184));session.destroy();assert.equal(released,3);assert.equal(session.gesture,null);
});
test('secondary pointers and non-primary buttons cannot start brushing',()=>{
 const {session}=fixture();const bad={pointerId:2,button:1,target:{closest:()=>{throw Error('should not capture');}}};session.pointerDown(bad);session.pointerDown({...bad,button:0,isPrimary:false});assert.equal(session.gesture,null);
});
test('reduced motion preserves doctor consent and completion without changing game progress',()=>{
 const {session,run}=fixture(practice('ent'),{reducedMotion:true});assert.equal(session.state.current.checked.size,0);session.action('part','ears');assert.equal(session.state.current.checked.size,0);session.action('exam');run();assert.equal(session.state.current.checked.size,1);assert.match(hospitalHTML(),/data-hospital="listen"/);
});
test('fast drag interpolation cleans crossed zones and cancellation stops subsequent movement',()=>{
 const {session}=fixture();const board={getBoundingClientRect:()=>({left:0,top:0,width:400,height:270}),setPointerCapture(){},hasPointerCapture:()=>false};
 const event=x=>({pointerId:1,button:0,clientX:x,clientY:81,target:{closest:()=>board},preventDefault(){}});
 session.pointerDown(event(100));session.pointerMove(event(300));assert.equal(session.state.current.cleaned.size,3);session.pointerCancel();session.pointerMove({...event(100),clientY:184});assert.equal(session.state.current.cleaned.size,3);
});
test('short voice cues follow each actionable state and canonical part labels',()=>{
 const state=new HospitalVisit(parts);assert.equal(hospitalCue(state),HOSPITAL_CUES.lobby);state.selectRoom('dental');assert.equal(hospitalCue(state),HOSPITAL_CUES.ticket);
 state.takeTicket();assert.equal(hospitalCue(state),HOSPITAL_CUES.dentalNumber);state.matchTicket('12');assert.equal(hospitalCue(state),HOSPITAL_CUES.called);state.next();assert.equal(hospitalCue(state),HOSPITAL_CUES.feeling);
 state.chooseFeeling('nervous');assert.equal(hospitalCue(state),HOSPITAL_CUES.nervous);state.next();assert.equal(hospitalCue(state),HOSPITAL_CUES.mirror);state.chooseTool('mirror');assert.equal(hospitalCue(state),HOSPITAL_CUES.tool);state.next();assert.equal(hospitalCue(state),HOSPITAL_CUES.brush);
 for(const zone of BRUSH_ZONES)state.brush(zone.id);assert.equal(hospitalCue(state),HOSPITAL_CUES.brushed);state.next();assert.equal(hospitalCue(state),HOSPITAL_CUES.dentalDone);
 const ent=practice('ent');ent.parts=ent.parts.map(part=>part.id==='ears'?{...part,zh:'耳部'}:part);assert.equal(hospitalCue(ent),'點點耳部。');ent.choosePart('ears');assert.equal(hospitalCue(ent),HOSPITAL_CUES.doctor);ent.startExam();assert.equal(hospitalCue(ent),'');ent.paused=true;assert.equal(hospitalCue(ent),'');
});
test('mount, transitions and resume narrate automatically; repeated listen shares a pending prompt',async()=>{
 const spoken=[],resolvers=[],state=new HospitalVisit(parts);const {session}=fixture(state,{say:text=>{spoken.push(text);return new Promise(resolve=>resolvers.push(resolve));}});
 session.mount();assert.deepEqual(spoken,[HOSPITAL_CUES.lobby]);session.action('listen');session.action('listen');assert.equal(spoken.length,1);
 session.action('room','dental');assert.equal(spoken.at(-1),HOSPITAL_CUES.ticket);session.action('ticket');assert.equal(spoken.at(-1),HOSPITAL_CUES.dentalNumber);
 session.pause();const count=spoken.length;resolvers.forEach(resolve=>resolve(true));await Promise.resolve();assert.equal(spoken.length,count);session.resume();assert.equal(spoken.at(-1),HOSPITAL_CUES.dentalNumber);
});
test('wrong-answer retry is brief, then repeats the goal; leaving cancels the queued goal',async()=>{
 const spoken=[],resolvers=[],state=practice('ent');const {session}=fixture(state,{say:text=>{spoken.push(text);return new Promise(resolve=>resolvers.push(resolve));}});
 session.action('part','nose');assert.deepEqual(spoken,[HOSPITAL_CUES.retry]);resolvers[0](true);await Promise.resolve();assert.equal(spoken.at(-1),'點點耳朵。');
 session.action('part','nose');const retry=resolvers.at(-1),count=spoken.length;session.destroy();retry(true);await Promise.resolve();assert.equal(spoken.length,count);
});
test('brushing narrates completion once and duplicates never cut or restart it',()=>{
 const spoken=[],state=practice();const {session}=fixture(state,{say:text=>{spoken.push(text);return new Promise(()=>{});}});
 session.mount();assert.deepEqual(spoken,[HOSPITAL_CUES.brush]);for(const zone of BRUSH_ZONES)session.action('brush',zone.id);
 assert.deepEqual(spoken,[HOSPITAL_CUES.brush,HOSPITAL_CUES.brushed]);const token=session.audioRevision;session.action('brush','5');assert.equal(session.audioRevision,token);assert.equal(spoken.length,2);
});
test('late doctor speech cannot speak the next part after pausing or switching departments',async()=>{
 const spoken=[],resolvers=[],state=practice('ent');const {session,run}=fixture(state,{say:text=>{spoken.push(text);return new Promise(resolve=>resolvers.push(resolve));}});
 session.action('part','ears');session.action('exam');run();assert.equal(spoken.at(-1),'點點鼻子。');session.pause();const count=spoken.length;resolvers.forEach(resolve=>resolve(true));await Promise.resolve();assert.equal(spoken.length,count);
 session.resume();assert.equal(spoken.at(-1),'點點鼻子。');session.action('room','dental');assert.equal(spoken.at(-1),HOSPITAL_CUES.ticket);
});
test('every short prompt has a non-silent PCM recording with bounded duration and exact text mapping',()=>{
 const manifest=JSON.parse(fs.readFileSync('content/hospital-audio.json','utf8'));assert.deepEqual(Object.keys(manifest.audio).sort(),hospitalVoiceTexts(parts).sort());
 const offline=new Set(JSON.parse(fs.readFileSync('offline-manifest.json','utf8')).files.map(file=>file.url));assert.ok(offline.has('hospital-voice.js'));assert.ok(offline.has('content/hospital-audio.json'));
 for(const [text,file] of Object.entries(manifest.audio)){
  assert.ok(offline.has(file),file);
  const wav=fs.readFileSync(file);assert.equal(wav.toString('ascii',0,4),'RIFF',text);assert.equal(wav.toString('ascii',8,12),'WAVE');
  let fmt,data;for(let offset=12;offset+8<=wav.length;){const name=wav.toString('ascii',offset,offset+4),size=wav.readUInt32LE(offset+4);if(name==='fmt ')fmt=wav.subarray(offset+8,offset+8+size);if(name==='data')data=wav.subarray(offset+8,offset+8+size);offset+=8+size+(size%2);}
  assert.ok(fmt&&data,text);assert.equal(fmt.readUInt16LE(0),1);assert.equal(fmt.readUInt16LE(14),16);const duration=data.length/fmt.readUInt32LE(8);assert.ok(duration>=.5&&duration<8,`${text}: ${duration}`);
  let peak=0,sum=0;for(let i=0;i+1<data.length;i+=2){const sample=data.readInt16LE(i);peak=Math.max(peak,Math.abs(sample));sum+=sample*sample;}assert.ok(peak>1000&&Math.sqrt(sum/(data.length/2))>100,text);
 }
});
