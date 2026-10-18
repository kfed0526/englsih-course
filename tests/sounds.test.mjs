import test from 'node:test';
import assert from 'node:assert/strict';
import {GameSounds} from '../sounds.js';
function fakeContext(){
 const events=[],nodes=[];
 const param=()=>({value:0,setValueAtTime(value,time){events.push({action:'set',value,time});},linearRampToValueAtTime(value,time){events.push({action:'ramp',value,time});},exponentialRampToValueAtTime(value,time){events.push({action:'ramp',value,time});}});
 const node=()=>{const n={frequency:param(),connect(){},disconnect(){this.disconnected=true;},start(time){events.push({action:'start',time});},stop(time){this.stopped=true;events.push({action:'stop',time});}};nodes.push(n);return n;};
 return {state:'suspended',currentTime:10,sampleRate:8000,destination:{},events,nodes,resumes:0,resume(){this.resumes++;this.state='running';return Promise.resolve();},createGain(){return {gain:param(),connect(){},disconnect(){}};},createOscillator:node,createBufferSource:node,createBuffer(channels,length){return {getChannelData:()=>new Float32Array(length)};}};
}
test('tap unlock reuses a context, success is short, mute and stop cancel playback',()=>{
 let created=0;const context=fakeContext(),s=new GameSounds(()=>{created++;return context;});
 assert.equal(s.correct(),0);s.unlock();assert.equal(s.correct(),420);assert.equal(s.nodes.size,3);assert.equal(context.events.filter(e=>e.action==='start').length,3);
 const prior=[...s.nodes];s.stop();assert.ok(prior.every(n=>n.stopped&&n.disconnected));assert.equal(s.nodes.size,0);s.unlock();assert.equal(created,1);
 s.enabled=false;const starts=context.events.filter(e=>e.action==='start').length;s.correct();s.dance();assert.equal(context.events.filter(e=>e.action==='start').length,starts);
});
test('celebration schedules rhythm, claps and slides within nine seconds; skip cancels all',()=>{
 const context=fakeContext(),s=new GameSounds(()=>context);s.unlock();s.dance(9);
 assert.ok(s.nodes.size>40);assert.ok(context.events.filter(e=>e.action==='start').every(e=>e.time>=10&&e.time<19));assert.ok(context.events.filter(e=>e.action==='stop').every(e=>e.time<=19));
 const nodes=[...s.nodes];s.stop();assert.equal(s.nodes.size,0);assert.ok(nodes.every(n=>n.stopped&&n.disconnected));
 context.state='suspended';s.unlock();assert.equal(context.state,'running');assert.equal(context.resumes,2);
});
test('unsupported Web Audio does not block the game',()=>{const s=new GameSounds(()=>{throw Error('unsupported');});assert.doesNotThrow(()=>s.unlock());assert.equal(s.correct(),0);assert.doesNotThrow(()=>s.dance(9));});
test('festival effects use the shared mute and cancellation controls',()=>{
 const context=fakeContext(),s=new GameSounds(()=>context);s.unlock();
 for(const effect of ['pop','firework','drum','row','bite','rustle','wish','correct']){s.festival(effect);assert.ok(s.nodes.size>0);const old=[...s.nodes];s.stop();assert.ok(old.every(n=>n.stopped));}
 s.enabled=false;const starts=context.events.filter(e=>e.action==='start').length;s.festival('firework');assert.equal(context.events.filter(e=>e.action==='start').length,starts);
});
