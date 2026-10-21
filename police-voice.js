export const POLICE_CUES={
 lobby:'Nickson，和拉拉警長一起幫助大家！點一個小任務。',
 clue:'小兔的書包不見了。點兩個放大鏡，找找線索。',color:'是藍色的！再看看另一個線索。',shape:'上面有星星！再看看另一個線索。',bags:'找到了！哪一個是藍色、有星星的書包？',bagRetry:'再看看，找藍色、有星星的書包。',give:'找對了！點小手，把書包交給警長。',lostDone:'小兔拿回書包了！謝謝小偵探。',missing:'圖片準備中，請大人幫忙重新打開遊戲。',
 stay:'小兔找不到家人。先在安全的服務台等，不要亂跑。',ask:'點警長，請服務台的警察幫忙。',waitFamily:'警長會聯絡家人。我們一起留在這裡等。',rabbitRetry:'不要自己跑遠，也不跟不認識的人離開。請服務台的警察幫忙。',reunionDone:'家人來了！小兔和家人在警長陪伴下團聚了。',
 red:'小紅人亮著，先在路邊停下等。點小手，停下來。',hand:'先牽好大人的手。點牽手圖。',look:'還不能走。先看看左邊，再看看右邊。',lookLeft:'左邊看過了，再看看右邊。',lookRight:'右邊看過了，再看看左邊。',green:'小綠人亮了，車子停好了。和大人一起走斑馬線。',crossing:'牽好手，慢慢走，不奔跑。',trafficRetry:'先等紅燈、牽好手，再看左右。不能直接跑過去。',trafficDone:'安全到達了！真的過馬路，要牽好大人的手。',
 allDone:'三個任務完成了！Nickson 是今天的小小守護員。',again:'想再玩一次嗎？也可以換一個小任務。',
 lobbyTasks:'點放大鏡找書包，點小兔找家人，點紅綠燈學過馬路。',replayHelp:'需要幫忙，就點拉拉警長，再聽一次。',
 colorGuide:'找到藍色線索了！再點另一個放大鏡。',shapeGuide:'找到星星線索了！再點另一個放大鏡。',bagsGuide:'兩個線索找到了。點藍色、有星星的書包。',
 seatGuide:'小兔找不到家人。點椅子圖，在安全服務台等。',officerGuide:'點戴警帽的人，請服務台的警長幫忙。',familyGuide:'點小兔和警察站一起的圖。陪警長在這裡等家人。',
 redGuide:'小紅人，先停下。點張開的小手，等一等。',handGuide:'點兩隻手握在一起的圖，牽好大人的手。',lookGuide:'點左邊眼睛看左邊，再點右邊眼睛看右邊。',lookLeftGuide:'左邊看過了。再點右邊的眼睛。',lookRightGuide:'右邊看過了。再點左邊的眼睛。',crossGuide:'小綠人亮了，車子停好了。點走路小人，牽手一起走。',
 resume:'回來了！我們繼續小任務。',restart:'再玩一次！聽聽警長的小提示。',earned:'得到一枚幫忙印章。謝謝小隊員！',nextTask:'點腳印換任務，或點圓箭頭再玩一次。'
};
export function policeCue(s){const c=POLICE_CUES;if(s.paused)return '';if(s.mission==='lobby')return s.complete?c.allDone:c.lobby;if(s.done)return s.mission==='lost'?c.lostDone:s.mission==='reunion'?c.reunionDone:c.trafficDone;
 if(s.mission==='lost')return !s.lostReady?c.missing:s.bag?c.give:s.clues.size===2?c.bagsGuide:s.clues.has('color')?c.colorGuide:s.clues.has('shape')?c.shapeGuide:c.clue;
 if(s.mission==='reunion')return [c.seatGuide,c.officerGuide,c.familyGuide][s.reunionStep];const r=s.traffic;if(r.status==='crossing')return c.crossing;return [c.redGuide,c.handGuide,r.left?c.lookLeftGuide:r.right?c.lookRightGuide:c.lookGuide,c.crossGuide][r.step];}
export function policeGuideLines(s){const c=POLICE_CUES,cue=policeCue(s);if(!cue)return [];if(s.mission==='lobby')return s.complete?[c.allDone,c.lobbyTasks]:[cue,c.lobbyTasks,c.replayHelp];return s.done?[cue,s.complete?c.allDone:c.earned,c.nextTask]:[cue];}
export const policeVoiceTexts=()=>[...new Set(Object.values(POLICE_CUES))];
