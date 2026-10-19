import test from 'node:test';
import assert from 'node:assert/strict';
import {AmusementVisit,AmusementSession,RIDE_SECONDS,TRAIN_FRIENDS,burstHTML} from '../amusement-park.js';

const finishRide=visit=>{for(let n=0;n<60;n++)visit.advance(.1);};

test('wheel starts once, caps frame gaps, ignores invalid time and awards one stamp',()=>{
 const visit=new AmusementVisit();assert.equal(visit.startRide(),true);assert.equal(visit.startRide(),false);
 visit.advance(999);assert.equal(visit.rides.wheel.elapsed,.1);
 for(const value of [NaN,Infinity,-1,0])visit.advance(value);
 assert.equal(visit.rides.wheel.elapsed,.1);finishRide(visit);
 assert.equal(visit.rides.wheel.elapsed,RIDE_SECONDS);assert.deepEqual([...visit.stamps],['wheel']);
 assert.equal(visit.advance(.1),false);assert.equal(visit.startRide(),false);
 assert.equal(visit.replayRide(),true);assert.equal(visit.startRide(),true);finishRide(visit);assert.equal(visit.stamps.size,1);
});

test('carousel needs three distinct notes and replay preserves other stamps',()=>{
 const visit=new AmusementVisit();visit.startRide();finishRide(visit);visit.selectMode('carousel');
 assert.equal(visit.collectNote('bad'),false);assert.equal(visit.collectNote('0'),true);assert.equal(visit.collectNote('0'),false);
 assert.equal(visit.collectNote('2'),true);assert.equal(visit.stamps.has('carousel'),false);
 assert.equal(visit.collectNote('1'),true);assert.equal(visit.stamps.has('carousel'),true);
 visit.replayRide();assert.deepEqual(visit.notes,[]);assert.deepEqual([...visit.stamps],['wheel','carousel']);
});

test('train boards each friend once, cannot leave early and completes only after the ride',()=>{
 const visit=new AmusementVisit();visit.selectMode('train');assert.equal(visit.startRide(),false);assert.equal(visit.board('unknown'),false);
 for(const friend of TRAIN_FRIENDS){assert.equal(visit.board(friend.id),true);assert.equal(visit.board(friend.id),false);}
 assert.equal(visit.stamps.has('train'),false);assert.equal(visit.startRide(),true);finishRide(visit);
 assert.equal(visit.rides.train.phase,'complete');assert.deepEqual([...visit.stamps],['train']);
});

test('fireworks work immediately, preserve chosen style, clamp positions and bound active bursts',()=>{
 const visit=new AmusementVisit();visit.selectMode('fireworks');visit.chooseColor('pink');visit.choosePattern('heart');
 const first=visit.launch({x:-20,y:50});assert.deepEqual({x:first.x,y:first.y,color:first.color,pattern:first.pattern},{x:.2,y:.7,color:'pink',pattern:'heart'});
 visit.chooseColor('blue');visit.choosePattern('star');assert.equal(first.color,'pink');assert.equal(first.pattern,'heart');
 assert.equal(visit.launch({x:NaN,y:.5}),null);assert.equal(visit.chooseColor('__proto__'),false);assert.equal(visit.choosePattern('invalid'),false);
 for(let n=0;n<5;n++)assert.ok(visit.launch());assert.equal(visit.bursts.length,6);assert.equal(visit.launch(),null);assert.equal(visit.launched,6);
 assert.deepEqual([...visit.stamps],['fireworks']);assert.match(burstHTML(first),/ffa2c7/);assert.match(burstHTML(first,true),/ap-burst-still/);
});

function sessionFixture(reducedMotion=false){
 let serial=0,visible=true;const frames=new Map(),timers=new Map(),effects=[];
 const session=new AmusementSession({root:{removeEventListener(){}},reducedMotion,visible:()=>visible,requestFrame:fn=>{frames.set(++serial,fn);return serial;},cancelFrame:id=>frames.delete(id),schedule:fn=>{timers.set(++serial,fn);return serial;},cancel:id=>timers.delete(id),effect:(...args)=>effects.push(args)});
 for(const name of ['paint','paintMotion','paintBursts','paintStatus'])session[name]=()=>{};
 const runFrame=time=>{const [id,fn]=frames.entries().next().value;frames.delete(id);fn(time);};
 return {session,frames,timers,effects,runFrame,hide:()=>visible=false,show:()=>visible=true};
}

test('pause cancels ride frames and explicit resume preserves elapsed time without a frame jump',()=>{
 const {session,frames,runFrame,effects}=sessionFixture();session.action('start');runFrame(100);runFrame(150);
 const elapsed=session.state.rides.wheel.elapsed,stale=[...frames.values()][0];session.pause();assert.equal(frames.size,0);stale(9000);assert.equal(session.state.rides.wheel.elapsed,elapsed);
 session.action('start');assert.equal(frames.size,0);session.resume();runFrame(12000);assert.equal(session.state.rides.wheel.elapsed,elapsed);
 for(let n=1;frames.size&&n<100;n++)runFrame(12000+n*100);
 assert.equal(session.state.stamps.has('wheel'),true);assert.equal(effects.filter(([kind])=>kind==='stamp').length,1);
});

test('mode changes and leaving cancel fireworks, queued show steps and late callbacks',()=>{
 const {session,timers,effects}=sessionFixture();session.action('mode','fireworks');session.action('show');
 const stale=[...timers.values()];assert.equal(session.state.launched,1);session.action('mode','train');
 const before=effects.length;for(const work of stale)work();assert.equal(session.state.launched,1);assert.equal(effects.length,before);assert.equal(timers.size,0);
 session.action('mode','fireworks');session.action('show');const late=[...timers.values()];session.destroy();for(const work of late)work();
 assert.equal(timers.size,0);assert.equal(session.state.bursts.length,0);assert.equal(session.destroyed,true);
 const count=session.state.launched;session.action('launch');assert.equal(session.state.launched,count);
});

test('hidden park stops fireworks and waits for explicit resume before continuing the six-flower show',()=>{
 const {session,timers,hide,show}=sessionFixture();session.action('mode','fireworks');session.action('show');
 hide();const count=session.state.launched;for(const [id,work] of [...timers]){timers.delete(id);work();}assert.equal(session.state.launched,count);
 session.pause();assert.equal(timers.size,0);show();assert.equal(session.state.launched,count);session.resume();
 for(let n=0;timers.size&&n<30;n++){const [id,work]=timers.entries().next().value;timers.delete(id);work();}
 assert.equal(session.state.launched,6);assert.equal(session.state.showing,false);assert.equal(session.state.bursts.length,0);
 assert.equal(session.state.stamps.has('fireworks'),true);
});

test('reduced motion completes rides without frames and reset clears only this visit',()=>{
 const {session,frames}=sessionFixture(true);session.action('start');assert.equal(frames.size,0);assert.equal(session.state.rides.wheel.phase,'complete');
 session.action('mode','fireworks');session.action('launch');assert.equal(session.state.launched,1);
 session.action('reset');assert.equal(session.state.mode,'wheel');assert.equal(session.state.stamps.size,0);assert.equal(session.state.launched,0);assert.equal(session.timers.size,0);
});

test('leaving midway through a ride preserves partial progress but cannot complete in the background',()=>{
 const {session,runFrame,frames}=sessionFixture();session.action('start');runFrame(0);runFrame(100);
 const elapsed=session.state.rides.wheel.elapsed,stale=[...frames.values()][0];session.destroy();stale(6000);
 assert.equal(session.state.rides.wheel.phase,'ready');assert.equal(session.state.rides.wheel.elapsed,elapsed);assert.equal(session.state.stamps.size,0);
 assert.equal(session.state.selectMode('invalid'),false);assert.equal(session.state.mode,'wheel');
});

test('a stale frame after resume cannot lose the new frame handle or survive destruction',()=>{
 const {session,frames}=sessionFixture();session.action('start');const stale=[...frames.values()][0];
 session.pause();session.resume();assert.equal(frames.size,1);stale(1000);session.destroy();assert.equal(frames.size,0);
});
