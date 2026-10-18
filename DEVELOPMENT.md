# 開發與跨電腦接手手冊

## 環境

純HTML／CSS／ES modules，沒有bundler、npm dependencies、後端或環境祕密。Node.js提供本機HTTP伺服器與內建測試。本次驗證使用Node **24.19.0**；現有README寫18+，但未重新驗證所有測試在18版的相容性。新電腦可用同一已驗證版本或較新的相容版本。

在專案根目錄：

```sh
node scripts/project-check.mjs
node scripts/project-check.mjs --test
node server.mjs
```

project-check明列測試檔傳給Node，避免Windows shell與Node版本的萬用字元差異。npm可用時npm start／npm test仍可用，不必執行npm install。HTTP伺服器預設4173，Ctrl+C停止；不能用file://開啟。

改測試埠：

PowerShell：
```powershell
$env:PORT = '4174'
node server.mjs
```

macOS／Linux：
```sh
PORT=4174 node server.mjs
```

伺服器綁0.0.0.0，區網可存取；主畫面離線功能使用HTTPS或localhost，純HTTP區網IP不等同localhost。不要為了測試停止其他人現有的程序，可另開一個埠。

## 架構入口

- app.js：頁面路由、header/wrap/render、共享音訊、設定與localStorage、stop、背景切換。不是React/Vue專案。
- content/index.json：課本清單。三本教材JSON為單字、句型及家長題庫的來源；lesson-text.js展開句型。
- game.js／activities.js、body-activities.js、japanese-activities.js：課程回合與互動。
- 每個生活遊戲用自己的model/session與HTML helper；新入口需同時接render、click、stop、visibilitychange與專心鎖。
- speech.js、sounds.js、scene-life.js、audio-controls.js：教學語音、音效、環境音及三個音量通道。錄音已在assets/audio，正常開發不需要重新產生。
- memories.js、parent-tools.js：相簿與備份；school-gate.js：本機專心模式PIN。
- offline.js、sw.js、scripts/offline-manifest.mjs：離線下載與發布快取。詳見OFFLINE_LIFE。

詳細依賴與各功能入口見[CODE_MAP](CODE_MAP.md)，不必每次讀全部歷史功能文件。

文字檔由.gitattributes與.editorconfig統一LF，跨Windows／macOS／Linux的離線清單大小保持一致；編輯後保留LF。

## 既有開發習慣

- 對使用者用繁體中文，先實作可玩的結果；通常先本機預覽，收到「發布」才上線。
- 延續溫暖手繪場景與Nickson素材，不重新綁死骨頭人；兒童可重試、不以驚嚇或限時懲罰引導。
- 主要裝置是iPad Air 11橫向；最低也檢查手機320寬。大按鈕、鍵盤焦點、減少動態不可丟失。
- 先查現有模組再擴充；題庫與遊戲不另寫一份重複詞彙表。新增正式教材也更新LEARNING_CONTENT。
- 圖片用既有WebP映射、透明衍生角色；保留原照，不覆寫忽略目錄中的來源。來源不在新機時，記錄缺少即可，不是啟動阻礙。
- 每次新遊戲只保存屬於自己的紀錄，不能誤增課程完成數。答對音效只播一次，離開後不得繼續計分或播放遲到的答句。
- 不要在新電腦硬編碼H:\project、個人快取Python路徑、browser tab ID或前一段對話的工具名稱。以cwd／import.meta.url解析專案位置，工具依當前環境發現。

## 儲存與搬移

| localStorage key | 用途 |
| --- | --- |
| nickson-settings | 語速、聲音選擇、音量、選項、動態與環境音 |
| nickson-records | book.id/unit.id完成次數、最近目標明細 |
| nickson-festivals | year/event完成次數與時間 |
| panda-school-extras | 照片故事、生活複習、只練已學、休息間隔 |
| panda-school-focus-lock | 目前專心鎖狀態 |
| panda-school-pin | 自訂六位數PIN；沒有時使用預設666666 |

這些資料按網站origin保存；localhost、GitHub Pages、不同埠及不同電腦不共用。用家長設定備份匯出／匯入搬移前四項；PIN、鎖定與離線快取不在備份。備份檔不是開發範例，不要提交到Git。

## 變更後驗證

- 一般程式變更：`node scripts/project-check.mjs --test`，再`git diff --check`。先修失敗，不靠重跑掩蓋。
- 純文件：檢查相對連結、程式／指令名稱與當前程式相符。新腳本實際執行。
- 新／改互動：目標場景實際玩到完成，確認重玩、返回、快速重複點、切背景、靜音與鎖定；只加有意義的狀態與取消回歸測試。
- 測試用Node test runner與VM。controller.test會移除app.js imports並提供fake DOM/context；新增import時同步提供context，避免把假DOM缺少方法誤判成瀏覽器錯誤。
- UI：1180×714橫向與320寬；檢查主要動作可見、沒有水平溢出；瀏覽器模擬不能替代實體Safari證據。

## 離線與更新陷阱

修改資源後執行`node scripts/offline-manifest.mjs`。這會更新清單，**不增加發布版本**。正式release會在改版本後再產生一次。

本機版本號可能仍是上一個正式版。已下載同版快取若和現在程式不同，可用家長設定移除離線下載，再下載；不要清除全部網站資料，否則會連學習紀錄一起失去。localhost連網優先便於開發，正式站版本資源快取優先。

真離線測試可用獨立埠：下載完整包→確認就緒→停自己啟動的伺服器→重新載入並進教材／玩遊戲→檢查圖片與語音→恢復伺服器或關測試頁。記錄是否真的斷網，不能只測worker函式就宣稱實機離線通過。

## Git與發布

main是GitHub Pages發布來源，推main會更新正式站。文件交接、遠端備份、開發預覽可存到開發分支，不能因此推main或跑release。

不要使用force push或破壞其他人的改動。先git status／branch／log；跨機切換工作前先保存當前分支，另一台fetch後確認同一commit。只有ZIP沒有.git時能啟動，但不具分支追蹤；要持續開發優先clone。

正式發布完整順序放在release skill。驗證失敗不要繼續部署；已執行release但後續失敗時先檢查release.json與diff，不要再次執行而跳號。
