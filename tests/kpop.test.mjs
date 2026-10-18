import test from 'node:test';
import assert from 'node:assert/strict';
import {KPOP_SONGS,KpopSession,kpopLibraryHTML,kpopRoomHTML} from '../kpop.js';
import {worldMapHTML} from '../adventure-map.js';
function setup(loadFailure=false,song=KPOP_SONGS[0]){
 const nodes=new Map();const node=s=>{if(!nodes.has(s))nodes.set(s,{textContent:'',dataset:{},attrs:{},classList:{toggle(k,on){this[k]=on;}},setAttribute(k,v){this.attrs[k]=v;}});return nodes.get(s);};
 const buttons=['sway','bounce','turn'].map(p=>{const b=node(p);b.dataset.kpopPose=p;return b;});const root={querySelector:node,querySelectorAll:()=>buttons};let options,created=0,paused=0,destroyed=0,hidden=false,observerCallback,disconnected=false;
 class Observer{constructor(cb){observerCallback=cb;}observe(){}disconnect(){disconnected=true;}}
 class Player{constructor(el,opts){options=opts;created++;}pauseVideo(){paused++;}destroy(){destroyed++;}}
 const session=new KpopSession({root,song,origin:'http://localhost:4173',hidden:()=>hidden,Observer,load:()=>loadFailure?Promise.reject(Error('offline')):Promise.resolve({Player})});
 return {session,node,buttons,get:()=>({options,created,paused,destroyed,disconnected}),hide:()=>hidden=true,visibility:r=>observerCallback([{isIntersecting:r>0,intersectionRatio:r}])};
}
test('Korea leads to official Queencard and SOYEON songs and visible video with separate local animation',()=>{
 assert.match(worldMapHTML(),/data-travel="korea"/);assert.match(worldMapHTML(),/data-travel="japan"/);assert.match(kpopLibraryHTML(),/i.ytimg.com\/vi\/7HDeem-JaSY/);assert.match(kpopRoomHTML(),/id="kpop-player"/);assert.match(kpopRoomHTML(),/nickson-celebrate-watercolor.png/);
});
test('native video events control animation, pose persists through pause, manual preview has no audio',async()=>{
 const h=setup();await h.session.mount();const {options}=h.get();assert.equal(options.videoId,'7HDeem-JaSY');assert.equal(options.playerVars.autoplay,0);assert.equal(options.playerVars.controls,1);assert.equal(options.playerVars.origin,'http://localhost:4173');
 options.events.onStateChange({data:1});assert.equal(h.node('.dance-studio').classList['is-dancing'],true);h.session.setPose('bounce');assert.equal(h.node('.dance-studio').dataset.pose,'bounce');
 options.events.onStateChange({data:2});assert.equal(h.node('.dance-studio').classList['is-dancing'],false);assert.equal(h.session.pose,'bounce');h.session.togglePreview();assert.equal(h.session.preview,true);assert.equal(h.session.playing,false);h.session.togglePreview();assert.equal(h.session.preview,false);
 options.events.onStateChange({data:3});assert.equal(h.session.playing,false);options.events.onStateChange({data:0});assert.match(h.node('#kpop-video-status').textContent,/跳完/);
});
test('offscreen and background playback pause; leaving destroys player and ignores late events',async()=>{
 const h=setup();await h.session.mount();const {options}=h.get();options.events.onStateChange({data:1});h.visibility(.2);assert.equal(h.session.playing,false);assert.equal(h.get().paused,1);h.visibility(1);h.hide();options.events.onStateChange({data:1});assert.equal(h.get().paused,2);h.session.destroy();options.events.onStateChange({data:1});assert.equal(h.session.playing,false);assert.equal(h.get().destroyed,1);assert.equal(h.get().disconnected,true);
});
test('slow API cannot create an orphan player after leaving; blocked video retains manual preview',async()=>{
 const h=setup();let resolve;h.session.load=()=>new Promise(r=>resolve=r);const pending=h.session.mount();h.session.destroy();resolve({Player:class{constructor(){throw Error('orphan');}}});await pending;assert.equal(h.get().created,0);
 const offline=setup(true);await offline.session.mount();assert.match(offline.node('#kpop-video-status').textContent,/暫時無法/);offline.session.togglePreview();assert.equal(offline.session.preview,true);
 const blocked=setup();await blocked.session.mount();blocked.get().options.events.onError({data:153});assert.match(blocked.node('#kpop-video-status').textContent,/官方影片/);assert.equal(blocked.session.playing,false);
});


test('SOYEON selection renders and embeds the exact supplied stage video without radio autoplay',async()=>{
 const song=KPOP_SONGS.find(s=>s.id==='toesa');assert.equal(song.videoId,'6MTxeUvX7VI');assert.equal(new Set(KPOP_SONGS.map(s=>s.id)).size,2);assert.match(kpopLibraryHTML(),/data-kpop="toesa"/);assert.match(kpopRoomHTML(song),/I’m gonna TOESA/);assert.match(kpopRoomHTML(song),/SOYEON/);assert.match(kpopRoomHTML(song),/YouTube 官方舞台/);assert.match(kpopRoomHTML(song),/watch\?v=6MTxeUvX7VI/);assert.doesNotMatch(kpopRoomHTML(song),/start_radio|list=RD/);
 const h=setup(false,song);await h.session.mount();assert.equal(h.get().options.videoId,'6MTxeUvX7VI');assert.equal(h.get().options.playerVars.autoplay,0);h.session.destroy();
});
