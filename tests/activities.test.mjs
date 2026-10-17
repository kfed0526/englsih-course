import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Activity} from '../activities.js';
import {illustration} from '../illustrations.js';
const book=JSON.parse(fs.readFileSync('content/my-school.json','utf8'));
test('all playable units have pictures and complete, nonempty recorded speech',()=>{for(const unit of book.units){assert.equal(unit.status,'ready');for(const word of unit.words){assert.match(illustration(word.id),/<(?:svg|img)/);for(const phrase of [word.id,unit.answer.replace('{word}',word.id)]){assert.ok(unit.audio[phrase],phrase);const data=fs.readFileSync(unit.audio[phrase]);assert.equal(data.toString('ascii',0,4),'RIFF');assert.equal(data.toString('ascii',8,12),'WAVE');assert.ok(data.length>1000);}}assert.ok(fs.existsSync(unit.audio[unit.question]));}});
test('role options are unique in both difficulties; map always ends in classroom',()=>{for(const count of [2,3])for(let i=0;i<500;i++){const role=new Activity({unit:book.units[2],count});for(let step=0;step<4;step++){role.step=step;role.makeOptions();assert.equal(role.options.length,count);assert.equal(new Set(role.options).size,count);assert.equal(role.options.filter(w=>w===role.target).length,1);}const map=new Activity({unit:book.units[3],count});assert.equal(new Set(map.order).size,4);assert.equal(map.order.at(-1),'classroom');}});
test('memory board has exactly two copies of each item',()=>{const a=new Activity({unit:book.units[1],count:2});assert.equal(a.board.length,10);for(const w of book.units[1].words)assert.equal(a.board.filter(c=>c.word===w.id).length,2);});
