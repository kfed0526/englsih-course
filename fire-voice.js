export const FIRE_CUES={
 lobby:'Nickson，歡迎來到消防局！和斑斑一起練習。',tasks:'點消防員穿裝備，點水滴玩水柱，點消防車準備出發。',replay:'點斑斑，再聽一次小提示。',
 helmet:'先點黃色消防帽，戴好帽子。',coat:'再點消防衣，穿好外套。',boots:'最後點靴子，穿好消防靴。',gearDone:'帽子、消防衣、靴子都穿好了！',gearRetry:'看看斑斑的小提示，我們一件一件穿。',
 water:'這是紙板練習靶，沒有真的火。點靶子，噴出水柱！',waterLeft:'點左邊靶子，再噴一次！',waterMiddle:'點中間靶子，再噴一次！',waterRight:'點右邊靶子，再噴一次！',waterNext:'真棒！再點一個還站著的靶子。',spraying:'咻！水柱噴出來了。',waterDone:'三個紙板靶都倒下了！水柱練習完成。',
 hose:'消防車要出發了。先點捲圈圈，把水帶收好。',cabinet:'點工具箱，把器材櫃關好。',belt:'點座椅，把安全帶繫好。',drive:'都準備好了！點消防車，請消防員開去練習場。',driving:'消防員開車，我們坐好出發！',truckDone:'到練習場了！謝謝你幫忙準備消防車。',truckRetry:'先把東西收好，再坐好繫安全帶。',
 earned:'得到一枚消防小幫手印章！',allDone:'三個任務完成！Nickson 是今天的消防小幫手！',next:'點小房子換任務，或點圓箭頭再玩一次。',restart:'再玩一次！聽聽斑斑的小提示。',resume:'我們回來了！再點一下，接著練習。'
};
export function fireCue(s){const c=FIRE_CUES;if(s.paused)return '';if(s.mission==='lobby')return s.complete?c.allDone:c.lobby;if(s.done)return c[s.mission+'Done'];if(s.pending)return s.pending.kind==='water'?c.spraying:c.driving;if(s.mission==='gear')return [c.helmet,c.coat,c.boots][s.gearStep];if(s.mission==='truck')return [c.hose,c.cabinet,c.belt,c.drive][s.prepStep];if(s.hits.every(n=>n===0))return c.water;const index=s.hits.findIndex(n=>n===1);return index<0?c.waterNext:[c.waterLeft,c.waterMiddle,c.waterRight][index];}
export function fireGuideLines(s){const c=FIRE_CUES,cue=fireCue(s);if(!cue)return [];if(s.mission==='lobby')return [cue,c.tasks,c.replay];return s.done?[cue,s.complete?c.allDone:c.earned,c.next]:[cue];}
export const fireVoiceTexts=()=>[...new Set(Object.values(FIRE_CUES))];
