---
name: panda-school-content-assets
description: Extend Panda School English and Japanese textbook JSON, recorded speech, question-bank mappings, and protagonist or scene assets while preserving their canonical sources.
---

# Panda School 教材與素材

先讀[規則](../../../AGENTS.md)、[教材](../../../LEARNING_CONTENT.md)及[腳本表](../../../SCRIPTS.md)。目前模組與進度見[狀態](../../../DEVELOPMENT_STATUS.md)，只讀相關功能文件。

## 教材來源

content/index.json列出課本；每本JSON的book.id／unit.id／word.id是穩定索引。沿用現有欄位與games.type，問答模板透過lesson-text展開。家長題庫由教材生成，不能另外硬寫詞表或讓試聽改選課與紀錄。

日文word保留kana、kanji、romaji、en、zh、audio與id。body單字另有數量、器官／物件映射；依既有單元schema添加。區分家長提供的正式內容與額外生活活動，不自行把構想說成正式教材。修改正式教材同步LEARNING_CONTENT。

## 語音

單字、完整問答與中文指示使用現有audio映射與LessonSpeech。正常遊玩無生成服務呼叫；開發再生是選用工具，依SCRIPTS確認Windows System.Speech、edge-tts或FFmpeg依賴，不能把它們加成啟動需求。使用目前checkout路徑。

新增音檔先確認路徑、非空、句子對應與語速／音量；日文正規化腳本會更新教材映射，不要無理由重跑全部音檔或破壞原錄音。

## 照片與場景

先查assets/characters/nickson-photo-usage.json、PHOTO_POSES_AND_MEMORIES及現有角色。原照位於忽略的.local-assets，新的clone不會有。缺來源時不要虛構成功去背；已提交衍生資產仍可用。保留原照，輸出到assets對應目錄。

手繪場景優先既有WebP映射；新位圖用當前可用的image generation/edit能力，透明去背保留alpha，並記錄來源與用途。無須把前台SVG控件轉成生成圖片。相簿資料在content/scene-memories與legacy park-memories，照片ID穩定、避免重複，不推測拍攝日期。

## 檢查

執行project-check --test，特別看教材派生、音檔存在、圖片／alpha、相簿與question-bank相關測試；實際試聽並確認storage不變。重建offline-manifest，把新資源包含進離線包。更新狀態／驗證與素材說明，不因新增教材自動發布。
