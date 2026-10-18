---
name: panda-school-game-dev
description: Develop Panda School scene games and polish touch, keyboard, audio, and session lifecycle behavior. Use for changes to this repository game interactions, not textbook authoring or deployment.
---

# Panda School 遊戲開發

在checkout根目錄工作；從skill目錄到根目錄為`../../..`。先讀[規則](../../../AGENTS.md)、[目前狀態](../../../DEVELOPMENT_STATUS.md)，再查[模組圖譜](../../../CODE_MAP.md)中與任務有關的區塊。

## 接既有遊戲

- 從目標model/session開始，不只改HTML展示。獨立model處理選擇、完成與防重複計分；session管理DOM、聲音、pointer、timer與取消。
- app.js新增入口要接render與click；go→stop會銷毀session，visibilitychange需暫停／取消拖曳，schoolGate需阻擋非學校活動。共用header回到正確場景。
- 用既有GameSounds、LessonSpeech及音量設定，答對只播一次；新的播放、下一題、重玩、背景與離開都不得留下遲到答句或計分。
- 新玩法不改課程累計完成數，除非它本來就是正式教材回合。題目從教材JSON或既有lifePool取得，單字代入用lesson-text。

## 已遇到的操作陷阱

根容器setPointerCapture後，輕點的click可能被改送到容器。pointerup要處理「移動小於拖曳門檻」的點選，不可直接return而吞掉操作；同時用solved／filled保護後續click不重複得分。table-game與life-learning已有範例。

拖曳保留點選替代方式。捕捉pointer ID、pointercancel、背景與destroy，清除ghost與capture。鍵盤操作能選到控件；重畫後保留合理焦點。尊重系統減少動態及家長motion選項。

## 完成驗證

用`node scripts/project-check.mjs --test`。app controller測試以fake DOM／context載入，新增import需同步fixture；不要為了mock缺少方法改壞真實瀏覽器行為。

實際玩到完成並檢查重玩、離開、快速點按、靜音、背景、專心鎖。UI檢查1180×714及320寬，保留截圖或具體結果到VALIDATION。模擬尺寸與真實裝置證據分開描述。

若變更離線可用資源，重建offline-manifest；不要執行release或部署。結尾更新DEVELOPMENT_STATUS與必要功能文件，依當次授權決定是否提交／推分支。
