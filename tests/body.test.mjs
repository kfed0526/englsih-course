import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {BodyActivity} from '../body-activities.js';
import {questionFor,answersFor} from '../lesson-text.js';
import {questionBankHTML} from '../question-bank.js';
import {bodyArt} from '../body-art.js';
const book=JSON.parse(fs.readFileSync('content/all-about-my-body.json','utf8'));
const school=JSON.parse(fs.readFileSync('content/my-school.json','utf8'));
const stories=JSON.parse(fs.readFileSync('content/school-stories.json','utf8'));
function setup(unit,overrides={}){let finishes=0,hits=0,saved;const spoken=[];const a=new BodyActivity({unit,speak:async parts=>{spoken.push(...parts);return true;},delay:async()=>true,render:()=>{},complete:results=>{finishes++;saved=results;},active:()=>true,success:async()=>{hits++;return true;},...overrides});return {a,spoken,get:()=>({finishes,hits,saved})};}
async function answerTask(a){const word=a.word;if(a.type==='face-count')await Promise.all([a.answer(word.number),a.answer(word.number)]);else if(a.type==='body-touch')await Promise.all([a.answer(word.id),a.answer(word.id)]);else if(a.task.kind==='robot-check')await Promise.all([a.answer(a.task.available?'yes':'no'),a.answer(a.task.available?'yes':'no')]);else{await a.select(word.id);await Promise.all([a.connect(a.type==='senses-link'?word.object:word.id),a.connect(a.type==='senses-link'?word.object:word.id)]);}}
test('second textbook preserves all 18 words, sentence grammar, raw corrections and requested links',()=>{
 assert.deepEqual(book.units.map(u=>u.words.map(w=>w.id)),[['eyes','ears','mouth','nose','head'],['toes','fingers','hands','feet'],['knees','legs','arms','shoulders'],['see','hear','taste','smell','feel']]);
 const face=book.units[0];assert.equal(questionFor(face,face.words[2]),'How many mouths do you have?');assert.equal(answersFor(face,face.words[2])[0],'I have one mouth.');assert.equal(answersFor(face,face.words[0])[0],'I have two eyes.');
 assert.match(book.units[1].source.sentences,/youch/);assert.match(book.units[2].source.homework[1],/cock's cookies/);assert.match(book.units[2].homework[1],/cook's cookies/);
 assert.deepEqual(Object.fromEntries(book.units[3].words.map(w=>[w.id,[w.organ,w.object]])),{see:['eyes','rainbow'],hear:['ears','drum'],taste:['mouth','soup'],smell:['nose','spoiled-fish'],feel:['hands','cat']});
});
test('every expanded body question, answer and story has a real WAV backup',()=>{
 const wav=file=>{const data=fs.readFileSync(file);assert.equal(data.toString('ascii',0,4),'RIFF');assert.equal(data.toString('ascii',8,12),'WAVE');assert.ok(data.length>1000);};
 for(const unit of book.units){for(const word of unit.words){assert.ok(bodyArt(word.id));for(const text of [word.id,questionFor(unit,word),...answersFor(unit,word)]){assert.ok(!/[{}]/.test(text));assert.ok(unit.audio[text],text);wav(unit.audio[text]);}}wav(unit.audio[unit.games.intro]);}
 assert.equal(stories.school,'河馬學校');assert.equal(stories.className,'Panda');assert.equal(stories.stories.length,3);for(const story of stories.stories)wav(story.audio);
});
for(const unit of book.units)test(unit.theme+' completes once with rapid taps and every task recorded',async()=>{
 const {a,spoken,get}=setup(unit);await a.begin();while(!a.completed)await answerTask(a);
 assert.equal(get().finishes,1);assert.equal(get().hits,unit.games.roundLength);assert.equal(get().saved.length,unit.games.roundLength);assert.ok(get().saved.every(r=>r.attempts===1));
 await a.replay();await a.answer('yes');assert.equal(get().finishes,1);
 if(a.type==='robot-matching'){assert.equal(a.tasks.filter(t=>t.kind==='robot-check'&&t.available).length,2);assert.equal(a.tasks.filter(t=>t.kind==='robot-check'&&!t.available).length,2);assert.equal(spoken.filter(text=>typeof text==='string'&&text.startsWith('No, I cannot')).length,2);}
 if(a.type==='senses-link'){assert.equal(a.links.length,5);assert.equal(new Set(a.links.map(l=>l.object)).size,5);assert.equal((a.render().match(/<path d="M440/g)||[]).length,5);}
});
test('wrong attempts unlock help after three, and hint is explicit per task',async()=>{
 const {a,get}=setup(book.units[0]);await a.begin();const wrong=a.word.number==='one'?'two':'one';a.hint();assert.equal(a.result.hint,false);
 for(let i=0;i<3;i++)await a.answer(wrong);assert.equal(get().hits,0);assert.equal(a.result.attempts,3);assert.equal(a.help,false);a.hint();assert.equal(a.result.hint,true);assert.match(a.render(),/hint/);await answerTask(a);assert.equal(a.results[0].attempts,4);assert.equal(a.step,1);
});
test('interrupted success resumes the same task without double sound, attempt or link',async()=>{
 let release;const {a,get}=setup(book.units[3],{delay:()=>new Promise(resolve=>release=resolve)});await a.begin();await a.select(a.word.id);const pending=a.connect(a.word.object);await new Promise(resolve=>setImmediate(resolve));assert.equal(a.phase,'feedback');a.cancel();release(true);await pending;assert.equal(a.step,0);assert.equal(a.links.length,1);
 a.delay=async()=>true;await a.resume();assert.equal(a.step,1);assert.equal(a.links.length,1);assert.equal(a.results[0].attempts,1);assert.equal(get().hits,1);
});
test('replaying during a part selection retains the choice and never scores a second attempt',async()=>{
 const {a}=setup(book.units[2]);await a.begin();await a.select(a.word.id);await a.replay();assert.equal(a.selected,a.word.id);assert.equal(a.result.attempts,0);await a.connect(a.word.id);assert.equal(a.results[0].attempts,1);
});
test('parent bank expands both textbooks from JSON without unresolved placeholders',()=>{
 const html=questionBankHTML([school,book]);assert.match(html,/2 本課本 · 8 個單元 · 35 個單字/);assert.ok(!/\{(?:word|plural|number|organ)\}/.test(html));
 for(const unit of book.units)for(const word of unit.words)for(const text of [questionFor(unit,word),...answersFor(unit,word)])assert.ok(html.includes(text),text);
});
