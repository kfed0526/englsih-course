import {japaneseArt} from './japanese-art.js?v=20261019.v2';
import {illustration} from './illustrations.js?v=20261019.v2';
import {shapeSVG,colors} from './game.js?v=20261019.v2';
import {questionFor,answersFor} from './lesson-text.js?v=20261019.v2';
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const types={shapes:'聽音找形狀／顏色形狀',memory:'教室物品翻翻配',roles:'角色辨認',map:'學校地圖探索','face-count':'臉部數數','body-touch':'身體點點樂','robot-matching':'Robot Matching','senses-link':'五感連連看','ja-listen':'日文教室尋寶','ja-bento':'日文便當','ja-colors':'日文彩色花園'};
function rules(unit){
 const count=unit.words.length;
 switch(unit.games?.type){
  case 'shapes':return `每回合 ${unit.games.roundLength} 題：${count} 個形狀各一次，再從下列顏色組合不重複抽取 2 個。形狀題使用相同中性色；顏色題二選項只改變一個屬性。干擾顏色限 ${Object.keys(colors).join('、')}。`;
  case 'memory':return `${count*2} 張卡片，共 ${count} 組；每個物品恰好出現兩張。翻牌播放單字，找到相同圖片後示範答句。`;
  case 'roles':return `${count} 個角色各練習一次，順序隨機。聽問句與角色名稱，從 2／3 個選項選出角色。`;
  case 'map':return `${count} 個地點各練習一次，最後到 classroom。地圖固定顯示四個區域，是遊戲示意布局。`;
  case 'face-count':return `${count} 個臉部部位各一次；數圖中亮起的部位，選 one／two。`;
  case 'body-touch':return `${count} 個部位各一次；問句後播放目標單字，從固定四張近景圖點選，示範答句。`;
  case 'robot-matching':return `${count} 次零件配對，再做 ${count} 次機器人有／缺部位的回答，共 ${unit.games.roundLength} 個任務。Yes、No 各兩次。配對與回答分開記錄。`;
  case 'senses-link':return `${count} 組連線；聽目標問句，先點感官，再點對應物品。已完成連線保留，物品順序每回合重排。`;
  case 'ja-listen':return `${count} 個教室物品各一次；聽日文假名發音，從圖片選出物品。`;
  case 'ja-bento':return `${count} 樣食物各一次；聽日文點食物，答對後放進便當。`;
  case 'ja-colors':return `${count} 種顏色各一次；聽日文選顏料，答對後對應花朵變色。`;
  default:return '教材已保存，遊戲準備中。';
 }
}
function vocabularyHTML(book,unit,w){const japanese=unit.language==='ja-JP';const art=japanese?japaneseArt(w.id):illustration(w.id);return `<article class="bank-word"><div class="bank-art">${art}</div><strong ${japanese?'lang="ja"':''}>${escape(w.kana||w.id)}</strong><span>${escape(w.zh)}</span>${japanese?`<dl class="ja-word-fields">${[['中文',w.zh],['日文',w.kana],['漢字',w.kanji],['羅馬字',w.romaji],['英文',w.en]].map(([key,value])=>`<div><dt>${key}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl>`:''}${audioButton(book,unit,w.kana||w.id,'🔊 單字')}</article>`;}
function audioButton(book,unit,text,label='🔊 聽一聽'){
 return `<button class="bank-audio" data-bank-book="${escape(book.id)}" data-bank-unit="${escape(unit.id)}" data-bank-speech="${escape(text)}" aria-label="播放 ${escape(text)}">${label}</button>`;
}
function unitHTML(book,unit,index){
 const questions=[...new Set(unit.words.map(w=>questionFor(unit,w)).filter(Boolean))],answers=unit.words.flatMap(w=>answersFor(unit,w));
 return `<details class="bank-unit" ${index===0?'open':''}><summary><span><strong>${escape(book.unitLabel||'Week')} ${unit.week} · ${escape(unit.title)}</strong><small>${escape(unit.theme)}</small></span><span class="badge">${unit.status==='ready'?'可玩':'準備中'}</span></summary><div class="bank-content"><h3>單字與圖片</h3><div class="bank-words">${unit.words.map(w=>vocabularyHTML(book,unit,w)).join('')}</div><h3>${unit.language==='ja-JP'?'日文單字發音（未提供正式句型）':'問句與答句'}</h3>${questions.map(text=>`<div class="bank-question"><span>${escape(text)}</span>${audioButton(book,unit,text,'🔊 問句')}</div>`).join('')}<ul class="bank-sentences">${answers.map(text=>`<li><span>${escape(text)}</span>${audioButton(book,unit,text,unit.language==='ja-JP'?'🔊 日文':'🔊 答句')}</li>`).join('')}</ul>${unit.combinations?.length?`<h3>顏色與形狀任務</h3><div class="bank-words">${unit.combinations.map(c=>`<article class="bank-word"><div class="bank-art">${shapeSVG(c.shape,c.color)}</div><strong>${escape(c.color)} ${escape(c.shape)}</strong>${audioButton(book,unit,`${c.color} ${c.shape}.`,'🔊 短語')}</article>`).join('')}</div>`:''}${unit.words.some(w=>w.organ)?`<h3>感官與物品連線</h3><ul>${unit.words.map(w=>`<li>${escape(w.id)} → ${escape(w.organ)} → ${escape(w.objectZh)}</li>`).join('')}</ul>`:''}<h3>出題方式 · ${escape(types[unit.games?.type]||'準備中')}</h3><p>${escape(rules(unit))}</p><h3>課本作業</h3>${unit.homework.length?`<ul>${unit.homework.map(text=>`<li>${escape(text)}</li>`).join('')}</ul>`:'<p class="muted">本單元尚未提供額外作業。</p>'}${unit.notes?`<p class="muted">${escape(unit.notes)}</p>`:''}${unit.source?`<details><summary>家長提供原文與遊戲建議</summary><p>${escape(unit.source.sentences)}</p>${(unit.source.homework||[]).map(text=>`<p>${escape(text)}</p>`).join('')}${unit.source.gameSuggestion?`<p>${escape(unit.source.gameSuggestion)}</p>`:''}</details>`:''}${unit.games?.type==='shapes'?'<p class="muted">本遊戲將描畫與上色作業轉成聽音點選，沒有正式描線或上色。</p>':''}</div></details>`;
}
export function questionBankHTML(catalog){
 const units=catalog.flatMap(book=>book.units),count=units.reduce((n,u)=>n+u.words.length,0);
 return `<section class="bank"><p class="eyebrow">FOR PARENTS · LEARNING CONTENT</p><h1>目前題庫</h1><p class="muted">${catalog.length} 本課本 · ${units.length} 個單元 · ${count} 個單字<br>這裡是完整教材與出題範圍；每回合會依規則抽題或重新排列。</p><div id="audio-status" role="alert"></div>${catalog.map(book=>`<section class="bank-book"><h2>${escape(book.name)}</h2>${book.language==='ja-JP'?`<p>${book.units.length} 個主題 · ${book.units.reduce((n,u)=>n+u.words.length,0)} 個日文單字</p>`:''}${book.units.map((unit,i)=>unitHTML(book,unit,i)).join('')}</section>`).join('')}</section>`;
}
