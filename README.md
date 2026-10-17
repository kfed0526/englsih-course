# Nickson 的骨頭人英文小冒險

My School 四週可玩的英文複習遊戲。純 HTML／CSS／JavaScript，無套件依賴、登入、付費或外部追蹤。

## 啟動與測試

需要 Node.js 18 或以上。在專案目錄執行：

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
| Week 3 People at School | 聽角色名稱，選角色圖片幫骨頭人變身 | 四角色各一次，搭配書本、氣球、司機帽或廚師帽 |
| Week 4 Places Around School | 點地圖帶小女孩前往各區 | 四地點各一次，最後找到 classroom |

每週都能先看單字卡。翻卡時播放單字，配對成功播放答句；角色及地圖先播教材問句與目標單字，再於成功時示範答句。單字圖片為專案內 SVG；Week 4 使用內建 imagegen 生成並保存於專案的水彩校園背景，搭配可點選房間與向量小女孩，不依賴閱讀。

錯誤可無限重試，第三次後出現「幫幫我」，點擊才標示提示。配對錯誤時兩張卡會翻回，位置不改變。所有完成回合都有骨頭人舞蹈，可略過。返回與背景切換會取消聲音、計時與尚未執行的動作，回前景要按「繼續」。

家長入口長按兩秒；鍵盤 Enter／空白或展開輔助入口也能進入。2／3 選項設定適用形狀及角色題，下一回合生效；翻卡和地圖保持固定版面。慶祝音樂開關不影響教材語音。家長區可切換查看四週各自的紀錄，清除前需再次確認。

## 教材與擴充

- `LEARNING_CONTENT.md`：教材全文、Nickson 喜好、家長補充與版本對照。
- `DESIGN_SPEC_V1.md`：第一版原始規格，保留當時 Week 2–4 準備中的歷史範圍。
- `content/index.json`：課本檔案清單。
- `content/my-school.json`：獨立課本資料，包含全部四週單字、句型、作業、遊戲設定、素材映射。
- `game.js`：形狀回合生成及向量圖。
- `activities.js`：配對、角色、地圖遊戲控制器。
- `campus.js`：校園點選區、小女孩與中央走廊路線。
- `illustrations.js`：物品、人物、場所及角色道具 SVG。
- `mascot.js`：白骨深紫描邊骨頭人與可動畫部位。
- `app.js`：頁面路由、共用音訊、家長設定及本機紀錄。
- `sounds.js`：答對提示音、舞蹈節奏、拍手與滑音，使用共用 Web Audio 播放器。
- `speech.js`：裝置語音選擇、1–5級語速、預錄備援與播放取消。

新增課本：建立獨立 JSON，給予唯一 `id`、`name`、`order`，加入 index.json 的 books。每個單元需唯一 `id`、`week`、`theme`、`title`、`status`、`words`、`question`、`answer`、`homework`、`games` 與 `audio`。

`games.type` 支援 `shapes`、`memory`、`roles`、`map`。參照既有單元提供 `title`、`intro`、`story`、`completion`。新增詞彙時須在 illustrations.js 增加對應 SVG，為單字、問句、模板代入後的完整答句及中文指示提供音檔映射。形狀型仍以四個既有形狀與指定顏色組合為規則。角色型若新增角色也需補對應變身道具。地圖型目前為四區學校布局，最後到 classroom；其他地圖主題需要調整終點規則與版面。

只需保存摘要的未完成單元設 `status: "coming"`。既有四週已改為 `ready`，這是原始第一版之後的擴充。

## 音訊與素材

47 段 WAV 位於 assets/audio，來自 Microsoft Zira Desktop（英文）與 Hanhan Desktop（中文）系統合成語音，非真人老師錄音。JSON 的 audio 以完整語句映射路徑，可換成自行授權的家長／老師錄音。`generate-unit-audio.ps1` 可在有對應 Windows 語音的電腦生成 Week 2–4 音檔；正常遊玩不需要執行此腳本。

開始前檢查必要音檔。預設優先使用裝置提供的中英文語音，偏好標示 Natural／Enhanced／Premium／Neural 或 Google 的聲音，並優先匹配美式英文、臺灣國語；名稱是挑選線索，不保證實際音質。家長可分別選擇中英文聲音，或固定使用內建音檔。裝置語音不可用或播放失敗時自動回到預錄備援；兩者都失敗才顯示重試與返回並鎖定答案。語音不與舞蹈音樂重疊。答對時先播約0.42秒的清脆提示音，再播放教材答句，不遮住英文。跳舞時有旋律、節奏鼓、拍手與滑音，完成時有短拍手收尾。音樂與音效在孩子點按時啟用共用 Web Audio 播放器，避免到慶祝時才建立播放器被行動瀏覽器阻擋。家長的慶祝音樂與音效開關同時控制答對提示音及舞蹈音效，教學語音保持開啟。返回、背景切換、略過慶祝與語音重播都停止正在播放或排程中的音效。

## 資料與範圍

只以 localStorage 保存設定、完成數、日期、每個目標嘗試及提示。索引為 `${book.id}/${unit.id}`，形狀、顏色、配對、角色及場所分開記錄。未完成回合不計入；重新整理回書架。不宣稱跨裝置同步，儲存不可用仍可玩。

Week 4 地圖為遊戲示意，不是課本原圖或真實學校布局。沒有數餅乾、正式描線、正式上色、語音評分或微型鏡頭功能。Week 3 的 cook's cookies 作業說明完整保留，未自行新增數字範圍。

實際驗證與實機限制見 VALIDATION.md。

## GitHub Pages 部署

此專案可直接部署為靜態網站。GitHub 儲存庫 Settings → Pages → Deploy from a branch，選 main 與 / (root) 後儲存。根目錄 .nojekyll 讓 Pages 直接發布靜態素材。啟用後的網址為 https://kfed0526.github.io/englsih-course/ 。每次推送 main 會更新網站。

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