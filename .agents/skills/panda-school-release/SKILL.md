---
name: panda-school-release
description: Prepare Panda School handoff branches, verify offline packages, or publish GitHub Pages after an explicit publish request. Keep branch transfer separate from production deployment.
---

# Panda School 發布、離線驗證與分支交接

先讀[AGENTS](../../../AGENTS.md)、[狀態表](../../../DEVELOPMENT_STATUS.md)與[SCRIPTS](../../../SCRIPTS.md)。按使用者要求選以下路徑，不把「準備」、「交接」或「繼續開發」當成發布授權。

## 開發分支交接

確認git status、分支、remote及最近commit，保留未提交改動。把使用者要帶到另一台電腦的程式、素材、skills與文件放在獨立開發分支；不推main、不跑release、不部署。推送分支必須符合本次使用者授權；不要force push。回報分支名、commit、clone方式及未部署狀態。

更新DEVELOPMENT_STATUS區分目前正式版與分支內容；原照.local-assets、瀏覽器資料、登入、個人runtime及截圖路徑不會隨Git搬移。用START_HERE提供另一台的接手指令。

## 本機／離線驗證

先跑`node scripts/project-check.mjs --test`及`git diff --check`；若改資源，執行offline-manifest腳本而非release。

看OFFLINE_LIFE了解版本與scope快取、完成標記及音檔Range。可在獨立PORT啟動測試伺服器，下載完整包後停止自己那個程序，重載、進教材／玩到完成，查語音及圖片；不停止別人的4173。localhost連網優先、正式版本資源快取優先。只測mock不能宣稱實機離線通過。

## 正式發布（必須有明確發布要求）

1. 確認目前分支與origin/main，整合已授權內容並處理衝突。main推送會觸發Pages；檢查工作樹避免帶入備份、原照或祕密。
2. 執行`node scripts/release.mjs` **一次**。以Asia/Taipei當日yyyyMMdd.vN產生版本，更新HTML、模組/CSS與離線清單。不要手動猜下一號。失敗重試先看diff／release.json，避免重跑跳號。
3. 跑project-check --test與diff --check，版本、模組查詢字串、清單及測試必須一致。失敗就修，不繼續推main。
4. 把版本、產品變更與驗證紀錄放同一發布commit，正常推main。GitHub身份／權限依當前機器，不硬編碼原機帳號工具或修改全域設定。
5. 用可用GitHub工具／CLI查對應SHA的Pages build，等完成；再查正式網站data-version及重要新資源HTTP狀態。只push成功不等於上線成功。
6. 更新狀態把該批內容列為已發布，回報已驗證版本與網站連結。若部署失敗，明確說目前停在哪裡，不宣稱成功。

需要參考實際程式時看scripts/release.mjs、offline-manifest.mjs、sw.js；不維護另一份快取檔案清單。
