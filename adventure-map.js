export const ADVENTURE_ASSETS=['assets/neighborhood-festival-watercolor.png','assets/taiwan-japan-watercolor.png','assets/characters/nickson-panda-home.png'];
export const SCENES=[
 {id:'home',name:'家裡',x:18,y:31,icon:'⌂',note:'我們的溫暖小屋'},
 {id:'school',name:'學校',x:50,y:31,icon:'▤',note:'My School · 英文課程'},
 {id:'park',name:'公園',x:82,y:31,icon:'♧',note:'樹下的新發現'},
 {id:'family',name:'親子館',x:18,y:62,icon:'♡',note:'一起玩的地方'},
 {id:'dance',name:'舞蹈教室',x:50,y:62,icon:'♫',note:'跟著節奏動一動'},
 {id:'music',name:'音樂教室',x:82,y:62,icon:'♬',note:'聽見美好的聲音'},
 {id:'world',name:'世界地圖',x:50,y:88,icon:'✈',note:'從台灣飛往日本'},
 {id:'festival',name:'慶典廣場',x:18,y:88,icon:'✦',note:'一年中的節日與生日'}
];
export function homeMapHTML(){return `<section class="adventure-home"><div class="map-title"><div><p class="eyebrow">NICKSON'S LITTLE WORLD</p><h1>今天，想去哪裡？</h1><p>河馬學校 Panda 班的小冒險家，點一個地方出發吧！</p></div><img class="map-nickson" src="${ADVENTURE_ASSETS[2]}" alt="戴熊貓帽的 Nickson 陪你一起出發"/></div><div class="neighborhood"><img class="neighborhood-painting" src="${ADVENTURE_ASSETS[0]}" alt="綠意小鎮裡的家、學校、公園、親子館、舞蹈與音樂教室，旅行站與慶典廣場" draggable="false"/>${SCENES.map((s,i)=>`<button class="destination ${s.id==='school'||s.id==='world'||s.id==='festival'?'available':''}" data-destination="${s.id}" style="--x:${s.x}%;--y:${s.y}%" aria-label="${s.name}${s.id==='school'?'，英文課程':s.id==='world'?'，日本日文課程':s.id==='festival'?'，節日與生日遊戲':'，準備中'}"><span class="destination-number" aria-hidden="true">${i+1}</span><strong>${s.name}</strong></button>`).join('')}</div><p class="map-key"><span>● 學校：英文課</span><span>✈ 世界地圖：日文課</span><span>✦ 慶典廣場：節日與生日</span><span>其他地方準備中</span></p></section>`;}
const plane='<svg viewBox="0 0 80 80" aria-hidden="true"><path d="M38 8q2-7 5 0l4 24 26 15v7l-27-8-1 18 9 7v5l-14-4-14 4v-5l9-7-1-18-27 8v-7l26-15Z" fill="#fff9e8" stroke="#6b7668" stroke-width="2.5"/><path d="M38 16h5m-5 5h5" stroke="#7da7b3" stroke-width="3"/></svg>';
export function worldMapHTML(flight){const flying=flight?.phase==='flying';return `<section class="world-travel"><p class="eyebrow">A LITTLE JOURNEY · 世界旅行</p><h1>下一站，日本！</h1><p class="muted">這次先探索台灣與日本。點日本，搭飛機去上日文課。</p><div class="travel-atlas ${flying?'is-flying':''}"><img src="${ADVENTURE_ASSETS[1]}" alt="旅行示意圖：台灣在左下方，日本在東北方" draggable="false"/><svg class="flight-route" viewBox="0 0 1000 667" preserveAspectRatio="none" aria-hidden="true"><path d="M280 514 Q420 270 700 233"/></svg><button class="country taiwan" data-travel="taiwan" ${flying?'disabled':''}><small>出發地</small><strong>台灣</strong></button><button class="country japan" data-travel="japan" ${flying?'disabled':''}><small>日文課</small><strong>日本</strong></button><div class="travel-plane" role="img" aria-label="從台灣飛往日本的飛機">${plane}</div></div><p class="travel-status" role="status">${flying?'正在飛往日本… 到了就開始日文小冒險！':'從台灣出發，點日本搭飛機 ✈'}</p><p class="map-disclaimer">旅行示意圖，不按實際比例；本次可探索台灣與日本。</p></section>`;}
export function sceneHTML(id){const s=SCENES.find(s=>s.id===id)||SCENES[0];return `<section class="scene-soon"><span class="badge">小鎮的新地方 · 準備中</span><h1>${s.name}</h1><p>${s.note}</p><img src="${ADVENTURE_ASSETS[0]}" alt="等待新故事的小鎮"/><h2>這裡的故事還在準備</h2><p>以後可以放小遊戲、故事或音樂。先到學校，或搭飛機去日本吧！</p><div class="actions"><button data-destination="school">去學校</button><button data-go="world">去世界地圖 ✈</button></div></section>`;}
export class JapanFlight{
 constructor({delay,active,arrive,render,reducedMotion=false}){Object.assign(this,{delay,active,arrive,render,reducedMotion});this.revision=0;this.phase='ready';this.running=false;this.completed=false;}
 cancel(){this.revision++;this.running=false;}
 async begin(){if(this.running||this.completed)return;const revision=++this.revision;this.running=true;this.phase='flying';this.render();const ok=await this.delay(this.reducedMotion?0:2400);if(!ok||revision!==this.revision||!this.active())return;this.running=false;this.completed=true;this.phase='arrived';this.arrive();}
}
