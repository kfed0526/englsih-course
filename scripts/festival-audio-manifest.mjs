import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {FestivalGame} from '../festival-games.js';
const catalog=JSON.parse(fs.readFileSync('content/festivals.json','utf8'));
const audio={};
for(const event of catalog.events){
 const game=new FestivalGame({event,year:2026,render(){}});
 for(let stage=0;stage<game.sizes.length;stage++)for(let count=0;count<game.sizes[stage];count++){
  Object.assign(game,{stage,count,delivered:Math.floor(stage/2)});
  const text=game.instruction.join('。');
  audio[text]='assets/audio/festivals/'+createHash('sha256').update(text).digest('hex').slice(0,16)+'.wav';
 }
}
fs.writeFileSync('content/festival-audio.json',JSON.stringify({language:'zh-TW',source:'Microsoft Hanhan Desktop，開發時產生的中文合成語音；非真人錄音。',audio},null,2)+'\n');
console.log(Object.keys(audio).length+' festival instruction clips.');
