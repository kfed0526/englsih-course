# 醫院：陪 Nickson 認識看診

2026-10-19完成，經使用者要求納入20261019.v3發布。入口是「生活小鎮 → 醫院」，有掛號大廳、牙科、耳鼻喉科三張水彩內景，以及22段自動短句語音。未加入使用者暫緩的箭頭／按鈕發亮新導引。

## 一次看診小冒險

兩科共用五步：掛號候診 → 說說心情 → 認識工具 → 一起練習 → 謝謝醫生。沒有倒數、扣分、診斷或強迫完成。

- 掛號：拿號碼牌，在叫號螢幕找到一樣的數字；選錯可重試，不算能力評分。
- 心情：選準備好或有點緊張，練習請醫生先說明。任何時候可按「我想休息」，也能直接離院；休息後需明確按繼續。
- 工具：牙科認識小鏡子，耳鼻喉科認識檢查燈。醫療工具由醫生操作，不讓孩子把器具拖入耳鼻口。
- 牙科：在六區牙齒模型上點選或連續拖曳刷掉小斑點；鍵盤Tab／Space也能逐區完成。快速滑過會插值處理，已刷區域不重複發音效。這是簡化模型，不代表真實刷牙已完成；文案提醒請大人協助。
- 耳鼻喉科：從教材的耳、鼻、口找指定部位，接著明確按「請醫生示範檢查」。檢查燈短暫示範後換下一個，不做聽力／健康測驗。三個部位各一次，完畢再按謝謝醫生。
- 完成後可重玩或回大廳選科；兩科各有這次造訪的完成標記。

## 資料與生命週期

- `hospital.js`：`HospitalVisit`管理五步流程、唯一刷牙區、部位與完成狀態；`HospitalSession`管理DOM、pointer capture、計時、音效與取消。
- `hospitalParts(catalog)`只從`all-about-my-body`教材讀取`ears`、`nose`、`mouth`的ID／中文標籤，搭配既有`faceSVG`。不另建正式詞表，不改教材JSON。
- `app.js`將`town-hospital`及兩個科別入口導入`hospital`頁面；連接go／stop、標題焦點、背景暫停、共享GameSounds／LessonSpeech與專心鎖。
- 進度僅存在本次頁面記憶體，不寫localStorage，不改學校完成次數、生活複習、慶典紀錄、選課或家長設定；重新整理會清空。離院再回來可保留本次進度。
- 暫停、換科、重玩或離開取消語音、計時與拖曳；過期檢查回呼不能完成新步驟。背景返回不自動繼續，檢查中斷後仍需重新請醫生示範。
- 醫院已加入自動短句語音：入場／換科、拿牌／叫號、心情、工具、刷牙完成、耳鼻口目標及完成時播放；重聽按鈕與場景上的大喇叭可再播。錯誤只輕聲鼓勵再重複當前目標，刷牙不逐顆說話。播放不要求先看懂文字。
- `hospital-voice.js`集中短句與狀態對應，`content/hospital-audio.json`提供22段中文WAV映射；部位短句仍從正式教材標籤派生。備援用Microsoft Hanhan Desktop（Rate=-1）在開發時產生，非真人錄音；正常遊玩不需System.Speech或線上服務。
- 沿用LessonSpeech、家長語速、中文選聲及語音音量；裝置沒有中文聲音時自動改播WAV，家長選「內建音檔」亦可強制使用。語音音量0維持安靜，不把關閉效果音誤當關閉語音。
- 每次只保留最新引導，快速點選／換步驟不排隊播舊句；同一句播放中連點重聽不重啟。休息、背景與離院取消語音和未播句子；背景返回需按繼續才播。自動播放被擋時大喇叭亮起，可點擊重試。未做實體揚聲器聽感驗證。
- 尊重家長關閉音效／動態與系統減少動態；減少動態停用燈光動畫，仍保留明確的檢查按鈕。

## 視覺素材

內建image_gen生成三張1536×1024水彩內景，沒有文字燒入圖中；角色沿用已提交的Nickson去背圖。互動牙齒與部位是HTML／SVG，並非生成的教材圖或新增醫療照片。

| 場景 | 保存原圖 | 前台／離線使用 |
| --- | --- | --- |
| 掛號大廳 | `assets/hospital-lobby-watercolor.png` | `assets/hospital-lobby-watercolor.webp`（233,358 bytes） |
| 牙科 | `assets/hospital-dental-watercolor.png` | `assets/hospital-dental-watercolor.webp`（256,098 bytes） |
| 耳鼻喉科 | `assets/hospital-ent-watercolor.png` | `assets/hospital-ent-watercolor.webp`（288,846 bytes） |

生成方式、完整提示詞與來源記於[素材提示詞](assets/hospital.prompts.json)。`optimized-images.js`保留尺寸／WebP映射，離線清單不重複下載三張來源PNG。`hospital.css`提供橫向／窄螢幕版面，本次發布已同步這份CSS與所有模組的版本網址。

## 教學文案參考與範圍

查核於2026-10-19。以下是文案設計參考，不是對孩子的診療建議；遊戲沒有疾病辨識、用藥、劑量、掏耳、拔牙、鑽牙或保證不痛的情節。

- 採先說明、看看工具與溝通感受的敘事，參考AAPD列出的溝通及tell-show-do方式；遊戲是此概念的簡化設計，不是經臨床驗證的治療工具。[AAPD：Behavior Guidance for the Pediatric Dental Patient](https://www.aapd.org/research/oral-health-policies--recommendations/behavior-guidance-for-the-pediatric-dental-patient/)
- 真實幼兒刷牙需要成人協助，不能把六次點選視為完整潔牙；參考美國兒科學會的兒童刷牙說明。[HealthyChildren：Toothbrushing Tips for Young Children](https://www.healthychildren.org/English/healthy-living/oral-health/Pages/Toothbrushing-Tips-for-Young-Children.aspx)
- 不設自行往耳內放工具或移除耳垢的操作；參考NHS的耳痛照護提醒，並以保守文案提醒不要把東西放進耳鼻。[NHS：Earache](https://www.nhs.uk/symptoms/earache/)

## 驗證

完整回歸213項通過。新增醫院模型／session、app controller、離線資源及未來CSS版本同步測試；涵蓋錯誤／連點、唯一完成、拖曳插值與取消、暫停、過期計時／語音、重玩、科別切換、離院、保留教材及專心鎖。語音測試另驗證短句對應、連播取消、重聽去重、教材派生、app備援映射／語速，以及22段PCM有聲且各小於8秒、全部列入離線清單。

Chromium以1180×714與320×800實際完成兩科全部流程、錯誤重試、心情與休息、牙科點選／拖曳／鍵盤、ENT背景事件模擬與恢復、重玩及離院再入。手機啟用系統減少動態；兩尺寸沒有水平溢出、pageerror或HTTP失敗，關閉音效未建立AudioContext，教材／生活資料和家長設定不變。

另以Chromium模擬觸控完成牙科，確認tap捕捉、連續touchMove與touchCancel、暫停後區域保留、家長關閉動態及開啟音效時不報錯。完整證據與未驗證項目見VALIDATION；本批沒有重做關閉伺服器的整包離線演練。

短句語音另在1180×714與320×800強制預錄模式實際播放WAV並確認currentTime前進；語速2（0.875倍）／音量70%、完整兩科自動引導、刷牙不碎念、重聽去重、背景／離院停止及自動播放受阻後點喇叭重試皆通過。證據在`.local-assets/validation/hospital-audio/`。這是瀏覽器媒體播放檢查，不能當作實體iPad或喇叭聽感驗證。

截圖與結果保存在忽略目錄`.local-assets/validation/hospital/`。這是桌面瀏覽器模擬，不是實體iPad／Safari驗證。
