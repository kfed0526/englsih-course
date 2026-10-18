import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JapaneseActivity} from '../japanese-activities.js';
import {JapanFlight,SCENES,ADVENTURE_ASSETS,homeMapHTML,worldMapHTML} from '../adventure-map.js';
import {japaneseArt} from '../japanese-art.js';
import {questionBankHTML} from '../question-bank.js';
import {chooseVoice,LessonSpeech} from '../speech.js';
const book=JSON.parse(fs.readFileSync('content/japanese-school.json','utf8'));
function setup(unit,overrides={}){let finishes=0,hits=0,saved;const spoken=[];const a=new JapaneseActivity({unit,speak:async parts=>{spoken.push(...parts);return true;},delay:async()=>true,render:()=>{},complete:results=>{finishes++;saved=results;},active:()=>true,success:async()=>{hits++;return true;},...overrides});return {a,spoken,get:()=>({finishes,hits,saved})};}
test('Japanese curriculum preserves all five fields of the twelve supplied words',()=>{
 const expected=[
 ['椅子','いす','椅子','isu','chair'],['桌子','つくえ','机','tsukue','desk'],['鉛筆','えんぴつ','鉛筆','enpitsu','pencil'],['蠟筆','クレヨン','—','kureyon','crayon'],
 ['白飯','ごはん','御飯','gohan','rice'],['菜','やさい','野菜','yasai','vegetables'],['肉','にく','肉','niku','meat'],['魚','さかな','魚','sakana','fish'],
 ['紅色','あか','赤','aka','red'],['藍色','あお','青','ao','blue'],['黃色','きいろ','黄色','kiiro','yellow'],['綠色','みどり','緑','midori','green']];
 assert.deepEqual(book.units.flatMap(u=>u.words.map(w=>[w.zh,w.kana,w.kanji,w.romaji,w.en])),expected);assert.equal(book.unitLabel,'主題');
 for(const unit of book.units){assert.equal(unit.question,'');for(const w of unit.words){assert.ok(japaneseArt(w.id));const data=fs.readFileSync(unit.audio[w.kana]);assert.ok(data.length>1000);assert.ok(data.subarray(0,3).toString()==='ID3'||(data[0]===255&&(data[1]&224)===224));}const intro=fs.readFileSync(unit.audio[unit.games.intro]);assert.equal(intro.toString('ascii',0,4),'RIFF');}
});
for(const unit of book.units)test(unit.title+' completes once, speaks Japanese kana and ignores rapid duplicate taps',async()=>{
 const {a,get,spoken}=setup(unit);await a.begin();while(!a.completed){const id=a.word.id;await Promise.all([a.answer(id),a.answer(id)]);}
 assert.equal(get().finishes,1);assert.equal(get().hits,4);assert.equal(a.collected.length,4);assert.ok(get().saved.every(r=>r.attempts===1&&!r.hint));
 assert.ok(spoken.filter(p=>p.lang==='ja-JP').every(p=>unit.words.some(w=>w.kana===p.text)));await a.replay();await a.answer(unit.words[0].id);assert.equal(get().finishes,1);
});
test('Japanese retry help is explicit after three wrong attempts and is recorded only for that word',async()=>{
 const {a,get}=setup(book.units[0]);await a.begin();const wrong=a.options.find(w=>w.id!==a.word.id).id;a.hint();assert.equal(a.help,false);for(let i=0;i<3;i++)await a.answer(wrong);assert.equal(a.result.hint,false);a.hint();assert.equal(a.result.hint,true);await a.answer(a.word.id);assert.equal(a.results[0].attempts,4);assert.equal(a.help,false);assert.equal(get().hits,1);
});
test('interrupted Japanese success resumes with one bento item, sound and attempt',async()=>{
 let release;const {a,get}=setup(book.units[1],{delay:()=>new Promise(r=>release=r)});await a.begin();const pending=a.answer(a.word.id);await new Promise(r=>setImmediate(r));assert.equal(a.phase,'feedback');a.cancel();release(true);await pending;assert.equal(a.step,0);assert.equal(a.collected.length,1);a.delay=async()=>true;await a.resume();assert.equal(a.step,1);assert.equal(a.collected.length,1);assert.equal(a.results[0].attempts,1);assert.equal(get().hits,1);
});
test('flight ignores double clicks, cancels old arrival and can resume once',async()=>{
 let release,arrivals=0;const f=new JapanFlight({delay:()=>new Promise(r=>release=r),active:()=>true,arrive:()=>arrivals++,render:()=>{}});
 const first=f.begin();await f.begin();f.cancel();release(true);await first;assert.equal(arrivals,0);
 const second=f.begin();release(true);await second;await f.begin();assert.equal(arrivals,1);assert.equal(f.completed,true);
});
test('reduced motion arrives without the flight delay; background cannot auto-navigate',async()=>{
 const durations=[];let arrivals=0;const f=new JapanFlight({delay:async ms=>{durations.push(ms);return true;},active:()=>true,arrive:()=>arrivals++,render:()=>{},reducedMotion:true});await f.begin();assert.deepEqual(durations,[0]);assert.equal(arrivals,1);
 const inactive=new JapanFlight({delay:async()=>true,active:()=>false,arrive:()=>arrivals++,render:()=>{}});await inactive.begin();assert.equal(arrivals,1);
});
test('seven destinations, Japan route and real image assets remain available',()=>{
 assert.deepEqual(SCENES.map(s=>s.name),['家裡','學校','公園','親子館','舞蹈教室','音樂教室','世界地圖']);assert.equal(new Set(SCENES.map(s=>s.id)).size,7);assert.match(homeMapHTML(),/data-destination="school"/);assert.match(worldMapHTML({phase:'flying'}),/is-flying/);
 for(const file of ADVENTURE_ASSETS){const data=fs.readFileSync(file);assert.equal(data.toString('ascii',1,4),'PNG');}
});
test('parent bank derives all Japanese columns from JSON and has no invented formal question',()=>{
 const school=JSON.parse(fs.readFileSync('content/my-school.json','utf8')),body=JSON.parse(fs.readFileSync('content/all-about-my-body.json','utf8'));
 const html=questionBankHTML([school,body,book]);assert.match(html,/3 本課本 · 11 個單元 · 47 個單字/);assert.match(html,/3 個主題 · 12 個日文單字/);assert.match(html,/未提供正式句型/);
 for(const w of book.units.flatMap(u=>u.words))for(const value of [w.zh,w.kana,w.kanji,w.romaji,w.en])assert.ok(html.includes(value),value);
});
test('Japanese speech selects only Japanese voices and otherwise uses its MP3 backup at parent speed',async()=>{
 const voices=[{name:'Mandarin Natural',lang:'zh-TW',voiceURI:'zh'},{name:'English Natural',lang:'en-US',voiceURI:'en'},{name:'Japanese Natural',lang:'ja-JP',voiceURI:'ja'}];
 assert.equal(chooseVoice(voices,'ja-JP').voiceURI,'ja');assert.equal(chooseVoice(voices.slice(0,2),'ja-JP'),null);
 const utterances=[],clips=[];class Utterance{constructor(text){this.text=text;}}class Audio{play(){clips.push(this);queueMicrotask(()=>this.onended());return Promise.resolve();}pause(){}}
 const synth={getVoices:()=>voices,speak:u=>{utterances.push(u);queueMicrotask(()=>u.onend());},cancel(){}};
 const p=new LessonSpeech({synth,Utterance,Audio});assert.equal(await p.play('いす',{lang:'ja-JP',clip:'chair.mp3',level:4}),true);assert.equal(utterances[0].voice.lang,'ja-JP');
 synth.getVoices=()=>voices.slice(0,2);assert.equal(await p.play('いす',{lang:'ja-JP',clip:'chair.mp3',level:4}),true);assert.equal(clips[0].src,'chair.mp3');assert.equal(clips[0].playbackRate,1.125);assert.equal(clips[0].preservesPitch,true);
});
