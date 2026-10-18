# 在新電腦接手 Panda School

這是給人與另一個 Codex 的共同入口。任何資料夾路徑皆可，不依賴原電腦的 H: 磁碟。

## 從main開始

```sh
git clone --branch main --single-branch https://github.com/kfed0526/panda-school.git
cd panda-school
node scripts/project-check.mjs
node scripts/project-check.mjs --test
node server.mjs
```

開啟 <http://localhost:4173/>。正常執行沒有 npm install、Python、帳號或 API key 的需求。不要雙擊 index.html。Node 環境說明見 [開發手冊](DEVELOPMENT.md)。

main包含已發布的離線與生活遊戲，以及接手文件。正式版本見release.json與DEVELOPMENT_STATUS；不要把讀取這份文件視為下一次發布授權。

## 給新 Codex 的第一則訊息

複製下面這段，接著補上你想做的工作：

> 請接手這個 panda-school 儲存庫。先讀 AGENTS.md、START_HERE.md、DEVELOPMENT_STATUS.md，再依任務讀 DEVELOPMENT.md、SCRIPTS.md、CODE_MAP.md 與相關專案 skill。先檢查目前分支、git status 和實際測試結果；保留現有改動，不要假設本機目錄或舊聊天工具還存在。請用繁體中文回報。除非我明確說發布，否則不要更新發布版本、合併／推送 main 或部署。完成本機工作並驗證後，更新開發狀態與驗證紀錄。

## 建議閱讀順序

| 文件 | 解決的問題 |
| --- | --- |
| [AGENTS.md](AGENTS.md) | 每次作業的規則、發布邊界、skill入口 |
| [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md) | 正式版與分支差異、最近完成項目、待辦與限制 |
| [DEVELOPMENT.md](DEVELOPMENT.md) | 跨電腦啟動、架構、資料保存、開發與驗證習慣 |
| [SCRIPTS.md](SCRIPTS.md) | 哪些腳本只讀、哪些會改檔、哪些需要額外工具 |
| [CODE_MAP.md](CODE_MAP.md) | 模組與資料來源圖譜 |
| [VALIDATION.md](VALIDATION.md) | 各批次驗證證據；較舊條目是歷史，不是現在的完整範圍 |

## Skills 隨 Git 帶走

專案的 `.agents/skills/` 包含三個 skills。支援 repository skills 的 Codex 可從專案發現它們；若當前工具沒有列出，直接請它讀對應 SKILL.md 即可，不需要存取原電腦的個人 skills 目錄。

- `$panda-school-game-dev`：新增／修改場景互動、觸控、音訊生命週期。
- `$panda-school-content-assets`：英文／日文教材、音檔、角色與圖片素材。
- `$panda-school-release`：只有明確收到發布要求時才執行正式發布；也提供不發布的分支交接與離線驗證路徑。

放置方式依據 [OpenAI 的 repository skills 說明](https://developers.openai.com/blog/skills-agents-sdk)。

## 不會從 Git 自動搬走的資料

- `.local-assets/` 中的原始照片與開發工具：被忽略，另行複製才有；網站所需衍生圖片已放進 assets。
- 瀏覽器學習紀錄、照片故事、音量、解鎖PIN：不在 Git；可在原瀏覽器家長設定匯出備份，再到新裝置匯入。PIN與離線下載不包含在備份。
- 聊天紀錄、工具連線、GitHub登入、畫面截圖絕對路徑：不隨專案同步。此文件與狀態表才是接手依據。

## 後續回到正式發布線

main也是部署分支。新工作可先建立開發分支；需要發布時先讀release skill，確認有發布授權，再整合最新main、處理衝突、跑驗證並更新一次版本。不要為了「讓另一台電腦下載」而推送main。
