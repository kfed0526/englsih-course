export const SCHOOL_GATE_KEY='panda-school-focus-lock';
export const SCHOOL_FOCUS_PAGES=new Set(['home','school-books','units','summary','cards','intro','game','activity','complete','settings','question-bank']);
export class SchoolGate{
 constructor(storage){this.storage=storage;this.locked=false;this.storageOK=true;this.taps=[];this.sync();}
 sync(){try{this.locked=this.storage?.getItem(SCHOOL_GATE_KEY)==='true';}catch{this.storageOK=false;}this.taps=[];return this.locked;}
 save(){try{this.storage?.setItem(SCHOOL_GATE_KEY,String(this.locked));}catch{this.storageOK=false;}}
 tap(now=Date.now()){if(!Number.isFinite(now))return '';if(this.taps.length&&now<this.taps.at(-1))this.taps=[];this.taps=this.taps.filter(t=>now-t<=1000);this.taps.push(now);if(this.taps.length<3)return '';this.taps=[];if(this.locked)return 'unlock';this.locked=true;this.save();return 'locked';}
 unlock(password){if(!this.locked||String(password).trim()!=='666666')return false;this.locked=false;this.taps=[];this.save();return true;}
 allows(page){return !this.locked||SCHOOL_FOCUS_PAGES.has(page);}
}
export function pandaGateButton(locked=false){return `<button class="panda-gate-button" data-school-gate="true" aria-label="熊貓圖示，快速點三下${locked?'開啟密碼解鎖':'進入專心上課模式'}" title="快速點三下${locked?'解鎖':'專心上課'}"><span aria-hidden="true">🐼</span>${locked?'<small aria-hidden="true">🔒</small>':''}</button>`;}
export function schoolUnlockHTML(){return `<dialog id="school-unlock-dialog" class="school-unlock-dialog" aria-labelledby="school-unlock-title"><form id="school-unlock-form"><h2 id="school-unlock-title">解鎖其他場景</h2><p>請家長輸入六位數密碼。</p><label for="school-unlock-password">解鎖密碼</label><input id="school-unlock-password" name="password" type="password" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" minlength="6" required autocomplete="off" autofocus><p id="school-unlock-error" role="alert"></p><div class="unlock-actions"><button type="button" data-school-unlock="cancel">取消</button><button type="submit" class="primary">解鎖</button></div></form></dialog>`;}
export function schoolFocusHTML(){return `<section class="school-story focus-school-card"><div class="story-heading"><span class="panda-badge" aria-hidden="true">🏫</span><div><p class="eyebrow">PANDA SCHOOL · 專心上課</p><h2>今天先到學校吧</h2><p>英文、日文課本都在等你。</p></div></div><button class="primary" data-destination="school">選課本，開始上課 →</button><p class="focus-mode-note">其他場景先休息一下。</p></section>`;}
