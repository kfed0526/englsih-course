export const STORE_CUES={
 lobby:'點購物籃，或點麵包。一起逛逛！',missing:'請大人幫忙，重新打開遊戲。',
 retry:'今天先找清單上的東西。',drop:'拖到購物籃，或點一下商品。',basketDone:'三樣都找到了！按箭頭，去結帳。',scan:'點點商品，幫它們掃描。',scanned:'掃描好了！按箭頭，練習付款。',pay:'點三枚星星幣，練習付款。',paid:'付好了！按箭頭，帶回家。',marketDone:'購物完成！記得帶上購物袋。',
 knead:'點點麵團，揉一揉。',kneaded:'揉好了！按箭頭，選個形狀。',shape:'選一個喜歡的麵包形狀。',shaped:'真可愛！按箭頭，請店員幫忙。',bake:'點烤箱，請店員幫你烤。',cooled:'麵包放涼了！按箭頭，準備裝袋。',pack:'點三個麵包，裝進袋子。',packed:'裝好了！按箭頭，謝謝店員。',bakeryDone:'麵包完成！真的烤箱，要請大人幫忙。'
};
export function departmentCue(state){
 const c=STORE_CUES,v=state.current;if(state.paused)return '';if(!v)return c.lobby;
 if(state.room==='market'){
  if(v.step===0)return !state.marketReady?c.missing:state.target?`找找${state.target.zh}，放進籃子。`:c.basketDone;
  if(v.step===1)return v.scanned.size===3?c.scanned:c.scan;
  if(v.step===2)return v.coins.size===3?c.paid:c.pay;return c.marketDone;
 }
 if(v.step===0)return v.kneads===KNEAD_COUNT?c.kneaded:c.knead;
 if(v.step===1)return state.shapes.length? v.shape?c.shaped:c.shape:c.missing;
 if(v.step===2)return v.bake==='baking'?'':v.bake==='cooled'?c.cooled:c.bake;
 if(v.step===3)return v.packed.size===3?c.packed:c.pack;return c.bakeryDone;
}
export function departmentVoiceTexts(goods){return [...new Set([...Object.values(STORE_CUES),...goods.map(item=>`找找${item.zh}，放進籃子。`)])];}
import {KNEAD_COUNT} from './department-model.js?v=20261020.v1';
