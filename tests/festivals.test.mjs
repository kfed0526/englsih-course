import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {taipeiToday,lunarDates,festivalEvents,festivalCalendarHTML} from '../festival-calendar.js';
import {FestivalGame} from '../festival-games.js';
const catalog=JSON.parse(fs.readFileSync('content/festivals.json','utf8'));
const events=festivalEvents(catalog,2026);
const narration=JSON.parse(fs.readFileSync('content/festival-audio.json','utf8'));
export function nextMove(a){
 const g=a.event.game,s=a.stage,c=a.count;
 if(g==='new-year')return s===0?['cracker',String(c)]:['nian'];
 if(g==='dragon-boat')return s===0?['row',c%2?'right':'left']:['zongzi'];
 if(g==='mid-autumn')return [s===0?'mooncake':'hat'];
 if(g==='fireworks')return ['launch'];
 if(g==='skeleton')return s===0?['bone',['head','body','arms','legs'][c]]:['pose',['up','side','down'][c]];
 if(g==='birthday')return s===0?['topping',['berry','chocolate','blueberry'][c]]:s===1?['candle',String(c)]:s===2?['blow']:['gift','book'];
 return s%2===0?['drive','right']:['deliver',['ball','bear','book'][a.delivered]];
}
test('Taipei year boundary and all nine dates match supplied birthdays and official 2026 calendar',()=>{
 assert.equal(taipeiToday(new Date('2026-12-31T16:00:00Z')),'2027-01-01');
 assert.equal(taipeiToday(new Date('2026-12-31T15:59:59Z')),'2026-12-31');
 assert.deepEqual(events.map(e=>[e.id,e.date]),[['new-year','2026-02-17'],['dad-may','2026-05-26'],['dragon-boat','2026-06-19'],['mid-autumn','2026-09-25'],['double-ten','2026-10-10'],['halloween','2026-10-31'],['mom-nov','2026-11-10'],['nickson','2026-11-18'],['christmas','2026-12-25']]);
 assert.equal(events.find(e=>e.id==='dad-may').name,'Nickson 爸爸生日');assert.equal(events.find(e=>e.id==='mom-nov').name,'Nickson 媽媽生日');
 const html=festivalCalendarHTML(catalog,2026,{'2026/nickson':{count:1}},'2026-10-18');
 assert.match(html,/下一個慶典/);assert.match(html,/data-festival-open="halloween"/);assert.match(html,/已完成，還可以再玩/);assert.equal((html.match(/class="festival-event /g)||[]).length,9);
});
test('lunar dates recompute every year and exclude the leap fifth month in 2028',()=>{
 assert.deepEqual(lunarDates(2027),{'1/1':'2027-02-06','5/5':'2027-06-09','8/15':'2027-09-15'});
 assert.equal(lunarDates(2028)['5/5'],'2028-05-28');assert.notEqual(lunarDates(2028)['5/5'],'2028-06-27');
 assert.equal(lunarDates(2028)['8/15'],'2028-10-03');
 assert.notEqual(lunarDates(2027)['1/1'],lunarDates(2026)['1/1']);assert.equal(festivalEvents(catalog,2027).find(e=>e.id==='nickson').date,'2027-11-18');
 assert.throws(()=>lunarDates(2101));assert.throws(()=>lunarDates(NaN));
 for(let year=1901;year<=2100;year++){const dates=Object.values(lunarDates(year));assert.equal(dates.length,3);assert.ok(dates.every(d=>d.startsWith(String(year))));assert.deepEqual(dates,[...dates].sort());}
});
for(const event of events)test(event.name+' '+event.id+' is playable to completion once with stale tap protection',()=>{
 const completions=[],effects=[];
 const a=new FestivalGame({event,year:2026,render(){},complete:r=>completions.push(r),effect:e=>effects.push(e)});
 let guard=0;
 while(!a.completed&&guard++<30){
  assert.ok(a.render().includes('data-festival-action'));const text=a.instruction.join('。');assert.ok(narration.audio[text]);const audio=fs.readFileSync(narration.audio[text]);assert.equal(audio.toString('ascii',0,4),'RIFF');assert.ok(audio.length>1000);const move=nextMove(a),old=a.token;
  assert.equal(a.play(move[0],move[1],old),true,event.id+' stage '+a.stage);
  assert.equal(a.play(move[0],move[1],old),false,'stale click must not advance twice');
 }
 assert.equal(a.completed,true);assert.equal(a.steps,a.total);assert.equal(completions.length,1);assert.equal(completions[0].id,event.id);assert.ok(effects.length>0);assert.match(a.render(),/再玩一次/);assert.equal(a.play('gift','book'),false);
 if(event.game==='fireworks')assert.equal(a.bursts.length,6);
 if(event.game==='christmas')assert.equal(a.delivered,3);
 if(event.game==='mid-autumn')assert.match(a.render(),/柚子帽戴好了/);
});
test('wrong boat side, bone and gift never advance; cancellation and resume preserve the same task',()=>{
 for(const [id,action,value]of [['dragon-boat','row','right'],['halloween','bone','legs'],['christmas','deliver','bear']]){
  let active=true;const a=new FestivalGame({event:events.find(e=>e.id===id),year:2026,render(){},active:()=>active});
  if(id==='christmas'){a.play('drive','right');a.play('drive','right');}
  const before=a.steps;assert.equal(a.play(action,value),false);assert.equal(a.steps,before);
  const move=nextMove(a),old=a.token;a.cancel();assert.equal(a.play(...move),false);a.resume();assert.equal(a.play(move[0],move[1],old),false);active=false;assert.equal(a.play(...move),false);active=true;assert.equal(a.play(...move),true);
 }
});
test('firework colors and positions are chosen by the player and remain inside the sky',()=>{
 const a=new FestivalGame({event:events.find(e=>e.id==='double-ten'),year:2026,render(){}});
 a.play('color','#e99cba');assert.equal(a.steps,0);a.play('launch','',a.token,{x:999,y:-40});assert.deepEqual(a.bursts[0],{color:'#e99cba',x:525,y:75});
 assert.match(a.render(),/aria-pressed="true"/);
});
