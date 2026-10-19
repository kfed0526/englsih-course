import {festivalArt,boneIcon} from './festival-art.js?v=20261019.v3';
import {festivalDate} from './festival-calendar.js?v=20261019.v3';
const stageSizes={'new-year':[3,4],'dragon-boat':[8,5],'mid-autumn':[3,1],fireworks:[6],skeleton:[4,3],birthday:[3,3,1,1],christmas:[2,1,2,1,2,1]};
const skeletonParts=[['head','頭骨'],['body','胸骨'],['arms','手臂'],['legs','雙腿']];
const dancePoses=[['up','雙手舉高'],['side','向兩邊伸手'],['down','蹲低搖一搖']];
const giftNames=[['ball','紅色皮球'],['bear','黃色小熊'],['book','綠色故事書']];
const colorNames=[['#f6d483','金黃色'],['#e99cba','粉紅色'],['#9dd9d2','湖水綠']];
export class FestivalGame{
 constructor({event,year,render,complete,effect,active=()=>true}){
  Object.assign(this,{event,year,refresh:render,complete,effect,active});
  this.stage=0;this.count=0;this.token=0;this.items=[];this.lit=[];this.bursts=[];this.color=colorNames[0][0];this.position=0;this.delivered=0;this.steps=0;this.completed=false;this.cancelled=false;this.message='';this.keepsake='';
 }
 get sizes(){return stageSizes[this.event.game];}
 get total(){return this.sizes.reduce((a,b)=>a+b,0);}
 cancel(){this.cancelled=true;this.token++;}
 resume(){this.cancelled=false;this.refresh();}
 button(label,action,value='',extra=''){return `<button ${extra.includes('class=')?'':'class="festival-control"'} data-festival-action="${action}" data-festival-value="${value}" data-festival-token="${this.token}" ${extra}>${label}</button>`;}
 get instruction(){
  const {game}=this.event;
  if(game==='new-year')return this.stage===0?['讓鞭炮劈哩啪啦響！','點響三串鞭炮，迎接新年。']:['年獸躲在哪裡？','找到調皮年獸，敲敲牠四次，請牠回山上過年。'];
  if(game==='dragon-boat')return this.stage===0?['一起划龍舟！',`跟著節奏，這次划「${this.count%2?'右':'左'}」邊。`]:['龍舟到站，粽子開動！',this.count===0?'先解開粽繩。':this.count===1?'打開綠綠的粽葉。':'吃一口香香的粽子！'];
  if(game==='mid-autumn')return this.stage===0?['月圓了，分享月餅！','點月餅，分三口慢慢吃。']:['給 Nickson 戴柚子帽','把綠色柚子帽戴在頭上，一起賞月。'];
  if(game==='fireworks')return ['點亮雙十的夜空','先選顏色，再點天空放煙火。放六朵，完成你的煙火畫！'];
  if(game==='skeleton')return this.stage===0?['骨頭人，準備出發！',`幫骨頭人找到「${skeletonParts[this.count][1]}」。`]:['一起跳南瓜舞！',`跟著骨頭人：${dancePoses[this.count][1]}。`];
  if(game==='birthday')return [['一起裝飾生日蛋糕','點選三種裝飾，把蛋糕變得香香甜甜。'],['點亮生日蠟燭','點亮三根小蠟燭。'],['許個願，吹蠟燭！','準備好了，點一下，把願望輕輕吹出去。'],['生日禮物時間','選一個禮物，看看裡面藏著什麼！']][this.stage];
  return this.stage%2===0?['麋鹿車，出發！',`往右開到第 ${this.delivered+1} 間亮燈的小屋。`]:['聖誕老人送禮物',`這間小屋想收到「${giftNames[this.delivered][1]}」。`];
 }
 controls(){
  const g=this.event.game,b=(...args)=>this.button(...args);
  if(g==='new-year')return this.stage===0?[0,1,2].map(n=>b(`🏮 第 ${n+1} 串鞭炮`,'cracker',String(n),this.items.includes(String(n))?'disabled':'')).join(''):'';
  if(g==='dragon-boat')return this.stage===0?b('← 左邊划槳','row','left')+b('右邊划槳 →','row','right'):b(this.count===0?'解開粽繩':this.count===1?'打開粽葉':'吃一口粽子','zongzi');
  if(g==='mid-autumn')return b(this.stage===0?'吃一口月餅':'戴上柚子帽',this.stage===0?'mooncake':'hat');
  if(g==='fireworks')return colorNames.map(([value,label])=>b(`<span class="firework-swatch" style="background:${value}"></span>${label}`,'color',value,`aria-pressed="${value===this.color}"`)).join('');
  if(g==='skeleton')return (this.stage===0?skeletonParts:dancePoses).map(([value,label])=>b((this.stage===0?boneIcon(value):'')+label,this.stage===0?'bone':'pose',value,this.stage===0&&this.items.includes(value)?'disabled':'')).join('');
  if(g==='birthday')return this.stage===0?[['berry','🍓 草莓'],['chocolate','🍫 巧克力'],['blueberry','🫐 藍莓']].map(([v,l])=>b(l,'topping',v,this.items.includes(v)?'disabled':'')).join(''):this.stage===1?[0,1,2].map(n=>b(`點亮第 ${n+1} 根`,'candle',String(n),this.lit.includes(String(n))?'disabled':'')).join(''):this.stage===2?b('呼～許願吹蠟燭','blow'):[['book','📚 故事書'],['toy','🧸 小熊'],['train','🚂 小火車']].map(([v,l])=>b(l,'gift',v)).join('');
  return this.stage%2===0?b('← 往左開','drive','left',this.position===0?'disabled':'')+b('往右開 →','drive','right'):giftNames.map(([v,l],i)=>b(['🔴 ','🧸 ','📗 '][i]+l,'deliver',v)).join('');
 }
 render(){
  if(this.completed)return `<section class="festival-play festival-finished center"><span class="badge">${this.year} · ${this.event.name}</span><h1>${this.event.game==='birthday'?this.event.name.replace('生日','').trim()+'，生日快樂！':'慶典任務完成！'}</h1><p>${this.keepsake||this.event.title+' 一起完成囉！'}</p><div class="confetti">✦ · ✧ · ✦</div><img class="festival-celebrate" src="assets/characters/nickson-panda-home.png" alt="Nickson 開心慶祝"/><p>謝謝你陪 Nickson 留下這個回憶 ♡</p>${this.event.game==='mid-autumn'?`<div class="festival-board">${festivalArt('mid-autumn',{stage:1,count:1})}</div>`:''}${this.event.game==='fireworks'?`<div class="festival-board finished-sky">${festivalArt('fireworks',this)}</div>`:''}<div class="actions"><button class="primary" data-festival-open="${this.event.id}">再玩一次 ↻</button><button data-go="festivals">回慶典廣場</button></div></section>`;
  const [title,help]=this.instruction,g=this.event.game;
  return `<section class="festival-play"><p class="eyebrow">${this.event.name} · ${festivalDate(this.event.date)}</p><h1>${title}</h1><p class="festival-help">${help}</p>${this.button("🔊 聽玩法","narrate")}<div id="festival-audio-status" role="status"></div><div class="festival-progress"><progress max="${this.total}" value="${this.steps}" aria-label="慶典任務進度"></progress><span>${this.steps} / ${this.total}</span></div><div class="festival-board ${g}">${festivalArt(g,this)}${g==='new-year'&&this.stage===1?this.button('<span>🔨 敲敲</span>','nian','',`class="nian-hit" style="left:${[27.5,70,35,61.7][this.count%4]}%;top:59%" aria-label="敲敲年獸，第 ${this.count+1} 次"`):''}${g==='mid-autumn'?this.button(this.stage===0?'點月餅，吃一口':'戴上柚子帽',this.stage===0?'mooncake':'hat','',`class="festival-object-hit"`):''}${g==='dragon-boat'&&this.stage===1?this.button(this.count===0?'解開粽繩':this.count===1?'打開粽葉':'吃一口粽子','zongzi','',`class="festival-object-hit"`):''}${g==='fireworks'?this.button('點天空，放煙火 ✦','launch','',`class="firework-sky" aria-label="點天空放煙火，已放 ${this.count} 朵"`):''}</div><div class="festival-controls">${this.controls()}</div><p class="festival-feedback" role="status" aria-live="polite">${this.message||'慢慢玩，沒有時間限制。'}</p><p class="muted">${g==='birthday'?'把生日祝福送給喜歡的人 ♡':'遊戲中的慶典小冒險，全年都可以玩。'}</p></section>`;
 }
 play(action,value='',token=this.token,point){
  if(this.completed||this.cancelled||!this.active()||Number(token)!==this.token)return false;
  const g=this.event.game;let good=false,effect='correct';
  if(g==='fireworks'&&action==='color'&&colorNames.some(c=>c[0]===value)){this.color=value;this.token++;this.refresh();return true;}
  if(g==='new-year'){
   if(this.stage===0&&action==='cracker'&&['0','1','2'].includes(value)&&!this.items.includes(value)){this.items.push(value);good=true;effect='pop';}
   if(this.stage===1&&action==='nian'){good=true;effect='drum';}
  }else if(g==='dragon-boat'){
   if(this.stage===0&&action==='row'){good=value===(this.count%2?'right':'left');effect='row';if(!good)this.message=`這次換${this.count%2?'右':'左'}邊划槳囉！`;}
   if(this.stage===1&&action==='zongzi'){good=true;effect=this.count<2?'rustle':'bite';}
  }else if(g==='mid-autumn'){good=action===(this.stage===0?'mooncake':'hat');effect=this.stage===0?'bite':'correct';if(good&&this.stage===1)this.keepsake='柚子帽戴好了，和 Nickson 一起賞月！';
  }else if(g==='fireworks'&&action==='launch'){
   good=true;effect='firework';this.bursts.push({color:this.color,x:Math.max(75,Math.min(525,Number(point?.x)||[120,300,475,195,400,300][this.count])),y:Math.max(75,Math.min(275,Number(point?.y)||[100,190,105,260,260,85][this.count]))});
  }else if(g==='skeleton'){
   good=this.stage===0?action==='bone'&&value===skeletonParts[this.count][0]:action==='pose'&&value===dancePoses[this.count][0];
   if(good&&this.stage===0)this.items.push(value);if(!good)this.message=this.instruction[1];effect='drum';
  }else if(g==='birthday'){
   if(this.stage===0&&action==='topping'&&['berry','chocolate','blueberry'].includes(value)&&!this.items.includes(value)){this.items.push(value);good=true;}
   if(this.stage===1&&action==='candle'&&['0','1','2'].includes(value)&&!this.lit.includes(value)){this.lit.push(value);good=true;}
   if(this.stage===2&&action==='blow'){this.lit=[];good=true;effect='wish';}
   if(this.stage===3&&action==='gift'&&['book','toy','train'].includes(value)){good=true;this.keepsake=`打開禮物，是${({book:'一本故事書',toy:'一隻小熊',train:'一台小火車'})[value]}！把祝福送給${this.event.name.replace('生日','').trim()}。`;}
  }else if(g==='christmas'){
   if(this.stage%2===0&&action==='drive'&&['left','right'].includes(value)){
    const next=this.position+(value==='right'?1:-1),target=(this.delivered+1)*2;
    this.position=Math.max(this.delivered*2,Math.min(target,next));
    // Backtracking is allowed, but only arrival advances the stage.
    this.count=this.position-this.delivered*2;this.token++;this.message=this.count===2?'到小屋了！看看要送什麼禮物。':'叮叮噹，麋鹿車慢慢開。';this.effect?.('row');
    if(this.count===2){this.steps+=2;this.stage++;this.count=0;}this.refresh();return true;
   }
   if(this.stage%2===1&&action==='deliver'){good=value===giftNames[this.delivered][0];if(good)this.delivered++;else this.message=this.instruction[1];}
  }
  if(!good){if(!this.message)this.message='看看上面的提示，再試試看 ♡';this.refresh();return false;}
  this.message=effect==='pop'?'劈哩啪啦，新年快樂！':effect==='bite'?'好香呀，慢慢吃！':'做到了！繼續一起玩。';this.effect?.(effect);this.count++;this.steps++;this.token++;
  if(this.count===this.sizes[this.stage]){
   // Preserve the finished pomelo hat on the completion screen via its keepsake.
   this.stage++;this.count=0;
   if(this.stage===this.sizes.length){this.completed=true;this.complete?.({id:this.event.id,year:this.year,steps:this.steps});}
  }
  this.refresh();return true;
 }
}
