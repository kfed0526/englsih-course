# panda-school 程式圖譜

此圖譜先於第二本遊戲實作建立，現已同步至完成的實作。專案為靜態 HTML／CSS／JavaScript，沒有後端。

```mermaid
flowchart TD
  HTML["index.html · 版本與入口"] --> APP["app.js · 路由／設定／紀錄"]
  HTML --> CSS["style.css + storybook.css + body.css + adventure.css · 響應版面"]
  APP --> MANIFEST["content/index.json · 課本清單"]
  MANIFEST --> SCHOOL["content/my-school.json · 第一本四週"]
  MANIFEST --> BODY["content/all-about-my-body.json · 第二本四週"]
  MANIFEST --> JAPANESE["content/japanese-school.json · 三主題／五欄單字"]
  APP --> ADVENTURE["adventure-map.js · 七個場景／台日飛行"]
  ADVENTURE --> MAPPAINT["assets/ · 小鎮／旅行／熊貓帽主角"]
  APP --> JAPANESEGAME["japanese-activities.js · 尋寶／便當／花園"]
  JAPANESEGAME --> JAART["japanese-art.js · 教學圖／正確顏色"]
  BANK --> JAART
  APP --> SHAPES["game.js · 形狀出題"]
  APP --> ACTIVITY["activities.js · 翻牌／角色／地圖"]
  APP --> BODYGAME["body-activities.js · 臉部／觸碰／機器人／感官"]
  ACTIVITY --> CAMPUS["campus.js · 校園路線與點選區"]
  APP --> BANK["question-bank.js · 家長教材預覽"]
  APP --> SPEECH["speech.js · 中英日裝置語音／五級語速／WAV與MP3備援"]
  APP --> SOUND["sounds.js · 答對音效／慶祝音樂"]
  APP --> CHARACTERS["characters.js · 主角與人物素材"]
  APP --> ART["illustrations.js · 教材圖像"]
  BODYGAME --> BODYART["body-art.js · 身體圖／機器人／感官物件"]
  ART --> BODYART
  APP --> STORYVIEW["school-story.js · 首頁故事與播放狀態"]
  APP --> STORY["content/school-stories.json · 河馬學校 Panda班故事"]
  APP --> TEXT["lesson-text.js · 句型代入"]
  BODYGAME --> TEXT
  BANK --> TEXT
  APP --> STORAGE["localStorage · book.id/unit.id 分開紀錄"]
  SPEECH --> WAV["assets/audio/ · 教材與故事備援"]
  CHARACTERS --> PNG["assets/characters/ · 去背人物"]
```

```mermaid
flowchart LR
  HOME["首頁：七場景大地圖／故事"] --> SCHOOLENTRY["學校：My School／All About My Body"]
  SCHOOLENTRY --> UNITS["選課本週次或日文主題"]
  HOME --> WORLD["世界地圖：台灣／日本"]
  WORLD --> FLIGHT["點日本：飛機動畫"]
  FLIGHT --> UNITS
  FLIGHT -->|離開或背景| CANCELFLIGHT["取消舊抵達；繼續後重新出發"]
  HOME --> OTHER["其他五場景：準備中"]
  HOME --> STORYPLAY["點按故事播放／停止；不寫入進度"]
  STORYPLAY --> HOME
  UNITS --> CARDS["認識單字"]
  UNITS --> INTRO["遊戲介紹"]
  CARDS --> INTRO
  INTRO --> PROMPT["播放指示與題目"]
  PROMPT --> ANSWER["解鎖答案"]
  ANSWER -->|答錯| RETRY["鼓勵／重試／第三次後可求助"]
  RETRY --> ANSWER
  ANSWER -->|答對| FEEDBACK["鎖定連點／音效／教材答句"]
  FEEDBACK -->|下一題| PROMPT
  FEEDBACK -->|全部完成| SAVE["只記錄一次，開始慶祝"]
  SAVE --> HOME
  PROMPT -->|離開或切背景| CANCEL["取消聲音與後續動作"]
  FEEDBACK -->|離開或切背景| CANCEL
  CANCEL --> RESUME["明確按繼續，恢復原階段"]
```

資料規則：題庫、單字卡、遊戲、語音模板均讀同一份課本 JSON；不另外維護家長用的詞彙清單。同名 Week 1 以課本 ID 隔離。故事播放不改變課本選擇或學習紀錄。

發布：`scripts/release.mjs` 更新 Asia/Taipei 日期版號與入口快取參數。只在家長通知發布時執行；原始主角照片保留於受 Git 排除的 `.local-assets/nickson-references/`。

驗證：`tests/` 透過 Node test 執行教材、音訊、出題、連點、取消恢復、紀錄與素材檢查；瀏覽器另做實際操作與尺寸檢查。
