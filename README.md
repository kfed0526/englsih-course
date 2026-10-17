# panda-school

Nickson 的英文小冒險 · 河馬學校 Panda 班。

My School 與 All About My Body 兩本、八週可玩的英文複習遊戲。純 HTML／CSS／JavaScript，無套件依賴、登入、付費或外部追蹤。

## 啟動與測試

需要 Node.js 18 或以上。本機專案目錄為 `H:\project\panda-school`。在此目錄執行：

```sh
npm start
```

開啟 http://localhost:4173 。勿直接雙擊 HTML，因為教材使用 fetch。手機可在同一區域網路連至 `http://電腦區網IP:4173`，需允許本機防火牆連線。Ctrl+C 停止伺服器。

```sh
npm test
```

## 四種玩法

| 單元 | 玩法 | 一回合 |
| --- | --- | --- |
| Week 1 Shapes at school | 聽音找形狀、顏色形狀 | 6 題：四形狀各一次、兩個不重複顏色組合 |
| Week 2 In the Classroom | 翻開卡片，找兩張相同物品 | 10 張卡，配對五組 |
| Week 3 People at School | 聽角色名稱，選人物卡讓校園人物登場 | 四角色各一次，以老師、朋友、司機、廚師插畫呈現 |
| Week 4 Places Around School | 點地圖帶小女孩前往各區 | 四地點各一次，最後找到 classroom |

每週都能先看單字卡。翻卡時播放單字，配對成功播放答句；角色及地圖先播教材問句與目標單字，再於成功時示範答句。物品與形狀圖片為專案內 SVG，人物採透明水彩 PNG；Week 4 使用內建 imagegen 生成並保存於專案的水彩校園背景，搭配可點選房間與向量小女孩，不依賴閱讀。

錯誤可無限重試，第三次後出現「幫幫我」，點擊才標示提示。配對錯誤時兩張卡會翻回，位置不改變。所有完成回合都有小夥伴舞蹈，可略過。返回與背景切換會取消聲音、計時與尚未執行的動作，回前景要按「繼續」。

家長入口長按兩秒；鍵盤 Enter／空白或展開輔助入口也能進入。2／3 選項設定適用形狀及角色題，下一回合生效；翻卡和地圖保持固定版面。慶祝音樂開關不影響教材語音。家長區可切換查看四週各自的紀錄，清除前需再次確認。

## 教材與擴充

- `LEARNING_CONTENT.md`：教材全文、Nickson 喜好、家長補充與版本對照。
- `CODE_MAP.md`：模組依賴、資料來源與遊戲狀態流程 Mermaid 圖譜。
- `DESIGN_SPEC_V1.md`：第一版原始規格，保留當時 Week 2–4 準備中的歷史範圍。
- `content/index.json`：課本檔案清單。
- `content/my-school.json`：獨立課本資料，包含全部四週單字、句型、作業、遊戲設定、素材映射。
- `content/all-about-my-body.json`：第二本18個單字、數量／器官／物件映射、問答與原文註記。
- `content/school-stories.json`、`school-story.js`：河馬學校 Panda 班首頁故事資料與畫面。
- `body-activities.js`、`body-art.js`、`body.css`：第二本四種遊戲、精準身體圖與版面。
- `lesson-text.js`：遊戲、題庫及家長試聽共用句型代入。
- `game.js`：形狀回合生成及向量圖。
- `activities.js`：配對、角色、地圖遊戲控制器。
- `campus.js`：校園點選區、小女孩與中央走廊路線。
- `illustrations.js`：物品、人物、場所及角色道具 SVG。
- `characters.js`：六張透明水彩人物素材、人物卡與陪伴角色。
- `app.js`：頁面路由、共用音訊、家長設定及本機紀錄。
- `sounds.js`：答對提示音、舞蹈節奏、拍手與滑音，使用共用 Web Audio 播放器。
- `speech.js`：裝置語音選擇、1–5級語速、預錄備援與播放取消。

新增課本：建立獨立 JSON，給予唯一 `id`、`name`、`order`，加入 index.json 的 books。每個單元需唯一 `id`、`week`、`theme`、`title`、`status`、`words`、`question`、`answer`、`homework`、`games` 與 `audio`。

`games.type` 支援 `shapes`、`memory`、`roles`、`map`、`face-count`、`body-touch`、`robot-matching`、`senses-link`。參照既有單元提供 `title`、`intro`、`story`、`completion`。新增詞彙時須提供對應 SVG 或人物素材，為單字、問句、模板代入後的完整答句及中文指示提供音檔映射。形狀型仍以四個既有形狀與指定顏色組合為規則。角色型若新增角色也需補對應人物素材。地圖型目前為四區學校布局，最後到 classroom；其他地圖主題需要調整終點規則與版面。身體遊戲的額外欄位參照第二本 JSON；句型 `{word}` 代入單字 ID，其餘變數代入同一單字資料欄位。

只需保存摘要的未完成單元設 `status: "coming"`。既有四週已改為 `ready`，這是原始第一版之後的擴充。

## 音訊與素材

114 段 WAV 位於 assets/audio（原有49段、身體教材62段、故事3段），來自 Microsoft Zira Desktop（英文）與 Hanhan Desktop（中文）系統合成語音，非真人老師錄音。JSON 的 audio 以完整語句映射路徑，可換成自行授權的家長／老師錄音。`generate-unit-audio.ps1` 可生成第一本 Week 2–4 音檔；`generate-content-audio.ps1` 依教材與故事映射補齊缺少的音檔，不覆寫既有檔案。需有對應 Windows 語音，正常遊玩不需要執行腳本。

開始前檢查必要音檔。預設優先使用裝置提供的中英文語音，偏好標示 Natural／Enhanced／Premium／Neural 或 Google 的聲音，並優先匹配美式英文、臺灣國語；名稱是挑選線索，不保證實際音質。家長可分別選擇中英文聲音，或固定使用內建音檔。裝置語音不可用或播放失敗時自動回到預錄備援；兩者都失敗才顯示重試與返回並鎖定答案。語音不與舞蹈音樂重疊。答對時先播約0.42秒的清脆提示音，再播放教材答句，不遮住英文。跳舞時有旋律、節奏鼓、拍手與滑音，完成時有短拍手收尾。音樂與音效在孩子點按時啟用共用 Web Audio 播放器，避免到慶祝時才建立播放器被行動瀏覽器阻擋。家長的慶祝音樂與音效開關同時控制答對提示音及舞蹈音效，教學語音保持開啟。返回、背景切換、略過慶祝與語音重播都停止正在播放或排程中的音效。

## 資料與範圍

只以 localStorage 保存設定、完成數、日期、每個目標嘗試及提示。索引為 `${book.id}/${unit.id}`，兩本同名 Week 不混用，機器人裝配與肯定／否定任務也分別記錄。未完成回合不計入；重新整理回書架。不宣稱跨裝置同步，儲存不可用仍可玩。

Week 4 地圖為遊戲示意，不是課本原圖或真實學校布局。沒有數餅乾、正式描線、正式上色、語音評分或微型鏡頭功能。Week 3 的 cook's cookies 作業說明完整保留，未自行新增數字範圍。

實際驗證與實機限制見 VALIDATION.md。

## GitHub Pages 部署

此專案可直接部署為靜態網站。GitHub 儲存庫 Settings → Pages → Deploy from a branch，選 main 與 / (root) 後儲存。根目錄 .nojekyll 讓 Pages 直接發布靜態素材。儲存庫為 https://github.com/kfed0526/panda-school ，網站為 https://kfed0526.github.io/panda-school/ 。每次推送 main 會更新網站。

## 版本號與發布

右上角顯示已發布版本，格式為 `yyyyMMdd.vN`，使用 Asia/Taipei 日期。同一天的第一個版本為 v1，再發布依序 v2、v3；隔天重新從 v1 開始。本次導入版本為 20261017.v1，先前未編號版本不回補。

每個要發布的新版本，在提交與推送前執行一次：

```sh
npm run release
npm test
```

release.json 保存目前發布版本；腳本更新 index.html 的版號及 CSS／JavaScript 入口版本參數。重新整理不遞增版本，重複測試同一發布也不要重跑 release。請將生成檔與功能修改一同提交推送。

## 家長查看題庫

家長設定 → 查看目前題庫。依課本與單元展開，可看全部單字圖片、中文參考意思、完整問答句、顏色形狀組合、出題規則、課本作業與備註。單字、問句、答句及顏色短語都能試聽。此頁直接使用教材 JSON，試聽不改變課程選擇或寫入學習紀錄。

## 家長語音與語速

家長設定 → 語音與語速，可設定1（很慢）至5（快），預設3（標準），並分別試聽中英文。設定保存在本機，適用遊戲題目、中文指示、答句、單字卡與題庫試聽；慶祝音樂速度不變。

| 級別 | 裝置語音 rate | 預錄音檔播放倍率 |
| --- | --- | --- |
| 1 | 0.65 | 0.75 |
| 2 | 0.80 | 0.875 |
| 3 | 0.95 | 1.00 |
| 4 | 1.10 | 1.125 |
| 5 | 1.25 | 1.25 |

預錄音檔本身已用慢速合成，因此兩種引擎採不同倍率；兩種方式都按級別由慢至快。錄音調速開啟 preservesPitch，避免變成高音或低音。

聲音清單由瀏覽器／作業系統提供，可能是內建或系統線上語音。無可用聲音時顯示使用內建音檔。此更新沒有新增付費語音API、後端服務或真人教師錄音，不宣稱每台裝置都會得到相同音質。

API參考：[SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)、[voiceschanged](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/voiceschanged_event)、[preservesPitch](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/preservesPitch)。

## 水彩校園地圖

Week 4 改為吉卜利感的溫暖手繪校園，包含遊戲區、教室、廚房、洗手間與相通走廊。孩子直接點房間，答對後小女孩沿走廊前進，再播放成功提示音與英文答句。行走期間鎖定點選，切背景後可繼續；系統「減少動態效果」開啟時直接抵達。

背景由內建 imagegen 生成，實際素材為 `assets/school-map-watercolor.png`（1536×1024），生成提示詞存於同目錄 `.prompt.txt`。這是虛構學校示意，並非課本原圖或真實校舍。
## 其他小遊戲的水彩風格

Week 1 改為花園舞會找形狀，Week 2 改為教室木桌紙卡翻翻配，Week 3 改為校園小劇場角色變身。三張場景由內建 imagegen 生成，清單與最終提示詞見 `assets/STORYBOOK_ASSETS.md`。`storybook.css` 負責場景、草綠卡背、米白紙卡與共同配色，原教材、出題規則、語音、音效與紀錄流程沿用既有邏輯。

此更新納入 20261018.v1 發布。後續變更仍依家長通知才執行發布流程。

## 水彩人物

陪伴角色改成自然比例的小男孩；地圖使用背書包的小女孩；老師、朋友、校車司機、廚師皆使用透明水彩人物。首頁、介紹、單字卡、遊戲、家長題庫及完成畫面共用同一套人物素材。答對角色題後，對應人物出現在舞台中央，保留音效、答句與慶祝動畫。

人物由內建 imagegen 生成，位置、最終提示詞與參考圖記錄於 `assets/characters/ASSETS.md`。中文介紹與兩段備援 WAV 已同步改為「小夥伴／學校裡的人」。人物素材載入失敗會沿用教材素材錯誤處理，避免顯示空白答案。

此更新依家長通知發布為 20261018.v1。原始主角照片保存在本機參考資料夾，不納入網站。
主角最後依家長提供形象調整：薄荷綠外套為日常姿勢，雙手比耶為答對與完成慶祝姿勢；其餘五個人物與場景保持原設計。

## 第二本與 Panda 班故事

| 單元 | 玩法 | 一回合 |
| --- | --- | --- |
| Week 1 My Face | 看亮起的部位，點一個／兩個數量圖卡 | 五個部位各一次 |
| Week 2 Smaller Body Parts | 聽目標單字，點身體近景圖片 | 四個部位各一次 |
| Week 3 Bigger Body Parts | Robot Matching，配零件到位置，再答可以／還不行 | 四次配對＋四次肯定／否定 |
| Week 4 Senses | 感官／器官連到指定物件，成功連線保留 | 五組各一次 |

全部使用同份教材問答，保留家長原文並註記 touch／cook's 的筆誤整理。數餅乾及上色作業只保存說明，沒有自行加入未提供的要求。2／3選項設定仍只適用原有形狀與角色題；第二本使用各玩法固定版面。

首頁「先聽一個小故事」有三段原創中文引導，代入 Nickson、河馬學校 Panda 班。點按才播放，可停止，沿用1–5級語速；背景暫停後需按繼續。故事與家長題庫試聽皆不改變課程或進度。家長紀錄可切換兩本課本，題庫可查看兩本35個單字及代入後的肯定／否定句。

本次內容依家長通知納入20261018.v2發布：第二本四週遊戲、Panda班故事、教材紀錄與程式圖譜。隨後20261018.v3補上教材JSON與整個JavaScript模組依賴的版本參數，避免更新後仍混用舊課本清單或題庫。後續仍等家長通知才推送與部署。
