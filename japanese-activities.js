import {shuffle} from './game.js?v=20261018.v6';
import {japaneseArt,gardenFlower,JAPANESE_COLORS} from './japanese-art.js?v=20261018.v6';
export const JAPANESE_TYPES=['ja-listen','ja-bento','ja-colors'];
export class JapaneseActivity{
 constructor({unit,speak,delay,render,complete,active,success=async()=>true}){Object.assign(this,{unit,speak,delay,redraw:render,complete,active,success});this.type=unit.games.type;this.tasks=shuffle(unit.words);this.options=shuffle(unit.words);this.step=0;this.revision=0;this.locked=true;this.phase='prompt';this.misses=0;this.help=false;this.completed=false;this.collected=[];this.message='';this.results=this.tasks.map(w=>({kind:this.type,target:w.kana,attempts:0,hint:false}));}
 get total(){return this.tasks.length;} get done(){return this.step;} get word(){return this.tasks[this.step];} get result(){return this.results[this.step];}
 valid(r){return !this.completed&&this.active()&&r===this.revision;}
 cancel(){this.revision++;this.locked=true;}
 async audio(parts){const r=++this.revision;this.locked=true;this.redraw();if(!await this.speak(parts)||!this.valid(r))return false;this.locked=false;return true;}
 async begin(){if(await this.audio([{text:this.unit.games.intro,lang:'zh-TW'}]))await this.prompt();}
 async prompt(){if(this.completed)return;this.phase='prompt';this.message='';if(await this.audio([{text:this.word.kana,lang:'ja-JP'}])){this.phase='answer';this.redraw();}}
 async replay(){if(this.completed)return;if(this.phase==='feedback')await this.feedback();else await this.prompt();}
 async resume(){this.revision++;await this.replay();}
 hint(){if(this.locked||this.phase!=='answer'||this.misses<3)return;this.help=true;this.result.hint=true;this.redraw();}
 async answer(id){if(this.locked||this.phase!=='answer'||!this.options.some(w=>w.id===id))return;this.result.attempts++;this.locked=true;
 if(id!==this.word.id){this.phase='retry';this.misses++;this.message='再試一次 ♡';if(await this.audio([{text:'再試一次',lang:'zh-TW'}])){this.phase='answer';this.redraw();}return;}
 this.phase='feedback';this.pendingSound=true;if(!this.collected.includes(id))this.collected.push(id);await this.feedback();}
 async feedback(){this.phase='feedback';this.locked=true;this.message='✓ 找到了！一起聽日文';this.redraw();const r=++this.revision;
 if(this.pendingSound){this.pendingSound=false;if(!await this.success()||!this.valid(r))return;}
 if(!await this.speak([{text:this.word.kana,lang:'ja-JP'}])||!this.valid(r)||!await this.delay(1000)||!this.valid(r))return;
 this.step++;this.help=false;this.misses=0;this.message='';if(this.step===this.total){this.completed=true;this.complete(this.results);return;}await this.prompt();}
 render(){const word=this.word||this.tasks[0],feedback=this.phase==='feedback';
 const stage=this.type==='ja-bento'?`<div class="bento-tray" aria-label="已放入 ${this.collected.length} 樣食物">${this.unit.words.map(w=>`<div class="bento-slot">${this.collected.includes(w.id)?japaneseArt(w.id):'<span aria-hidden="true">✧</span>'}</div>`).join('')}</div>`:this.type==='ja-colors'?`<div class="color-garden" aria-label="已開花 ${this.collected.length} 種顏色">${this.unit.words.map(w=>gardenFlower(this.collected.includes(w.id)?JAPANESE_COLORS[w.id]:undefined)).join('')}</div>`:'<div class="classroom-caption">小桌子旁的尋寶時間</div>';
 return `<div class="top"><span class="muted">${this.unit.games.title} · ${this.step} / ${this.total}</span><div class="progress body-progress" aria-label="已完成 ${this.step} 題">${this.tasks.map((_,i)=>`<span class="${i<this.step?'done':''}"></span>`).join('')}</div></div><section class="japanese-game ${this.type}"><div class="ja-heading"><p>聽日文，點圖片<span class="ja-prompt" lang="ja">${word.kana}</span></p><button class="speaker" data-ja="replay">🔊 再聽一次</button></div>${stage}<div class="ja-choices">${this.options.map(w=>`<button class="answer ja-choice ${this.help&&w.id===word.id?'hint':''} ${feedback&&w.id===word.id?'correct':''}" data-ja="answer" data-value="${w.id}" aria-label="${w.zh}" ${this.locked?'disabled':''}>${japaneseArt(w.id)}</button>`).join('')}</div><div class="ja-feedback" role="status"><span>${this.message||'慢慢聽，沒有時間限制 ♡'}</span>${feedback?`<strong lang="ja">${word.kana}</strong><small>${word.zh} · ${word.romaji}</small>`:''}${this.misses>=3?`<button data-ja="hint" ${this.locked?'disabled':''}>💡 幫幫我</button>`:''}</div><div id="audio-status" role="alert"></div></section>`;}
}
