import test from 'node:test';
import assert from 'node:assert/strict';
import {createSandpit,digSand,digStroke,collectTreasure,sandpitHTML,TREASURES,toySVG} from '../sandpit.js';
test('treasures are separated, buried and cannot be collected before discovery',()=>{
 for(let n=0;n<50;n++){const s=createSandpit();assert.equal(new Set(s.toys.map(t=>t.id)).size,3);for(const t of s.toys){assert.ok(t.x>80&&t.x<720&&t.y>80&&t.y<400);assert.equal(collectTreasure(s,t.id),false);for(const other of s.toys.filter(o=>o!==t))assert.ok(Math.hypot(t.x-other.x,t.y-other.y)>170);}}
});
test('continuous digging reveals each toy once, with no jump over fast strokes',()=>{
 const s=createSandpit(()=>.5),t=s.toys[0];assert.deepEqual(digSand(s,5,5),[]);assert.equal(t.found,false);const found=digStroke(s,{x:t.x-130,y:t.y},{x:t.x+130,y:t.y});assert.deepEqual(found,[t.id]);assert.deepEqual(digStroke(s,{x:t.x-130,y:t.y},{x:t.x+130,y:t.y}),[]);assert.ok(s.cleared.size>0);
});
test('collecting all three ends once, and an independent reset restores buried toys',()=>{
 const s=createSandpit(()=>.5);for(const toy of s.toys){digStroke(s,{x:toy.x-20,y:toy.y},{x:toy.x+20,y:toy.y});assert.equal(toy.found,true);assert.equal(collectTreasure(s,toy.id),true);assert.equal(collectTreasure(s,toy.id),false);}assert.equal(s.complete,true);assert.equal(s.toys.filter(t=>t.collected).length,3);assert.deepEqual(digSand(s,50,50),[]);const reset=createSandpit();assert.equal(reset.cleared.size,0);assert.ok(reset.toys.every(t=>!t.found&&!t.collected));assert.equal(s.complete,true);
});
test('invalid points and unknown toy IDs cannot advance progress; hidden items stay inaccessible',()=>{
 const s=createSandpit();assert.deepEqual(digSand(s,NaN,4),[]);assert.deepEqual(digSand(s,Infinity,4),[]);assert.equal(collectTreasure(s,'unknown'),false);assert.equal(s.cleared.size,0);const html=sandpitHTML(s);assert.equal((html.match(/aria-hidden="true" disabled/g)||[]).length,3);assert.match(html,/幫我找一找/);
});


test('twenty distinct treasures include all requested characters; sampling three covers the pool without duplicates',()=>{
 assert.equal(TREASURES.length,20);assert.equal(new Set(TREASURES.map(t=>t.id)).size,20);for(const name of ['皮卡丘','麵包超人','骨頭人'])assert.ok(TREASURES.some(t=>t.name===name));assert.equal(new Set(TREASURES.map(t=>toySVG(t.id))).size,20);
 const original=TREASURES.map(t=>t.id).join(','),seen=new Set(),combinations=new Set();let seed=728;
 const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<300;i++){const s=createSandpit(random);assert.equal(s.toys.length,3);assert.equal(new Set(s.toys.map(t=>t.id)).size,3);s.toys.forEach(t=>seen.add(t.id));combinations.add(s.toys.map(t=>t.id).sort().join(','));}
 assert.equal(seen.size,20);assert.ok(combinations.size>100);assert.equal(TREASURES.map(t=>t.id).join(','),original);
});
