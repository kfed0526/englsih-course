# 斑斑消防局（20261021.v2發布）

2026-10-21依「接下來完成消防局」實作。首頁 → 生活小鎮 → 消防局。`?preview=fire`只標示預覽，重新整理仍由首頁進入。初期先完成本機，之後依使用者明確「先發佈一版」納入20261021.v2。發布結果以對應SHA的Pages成功及正式站冒煙結果核對。

## 三個任務

- 穿好裝備：幫互動斑點狗依提示穿帽子、消防衣、消防靴；圖片按鈕與人物裝備同步，選錯可重試。
- 水柱練習：三個明確標示為紙板的火焰形練習靶，各噴兩次就倒下。點圖上靶子或旁邊大水滴按鈕皆可，用Tab／Space／Enter也能玩；每次550ms水柱結束才計入一次，連點不重複。
- 消防車出發：收水帶、關器材櫃、繫安全帶，再明確請消防員開車；1800ms短動畫抵達練習場才蓋章。孩子不扮演真實消防車駕駛。

三枚印章只留在本次分頁的FireVisit；重玩只重設目前任務，不拿走已得印章，不寫教材／課程／生活複習／慶典紀錄或家長設定。這是額外生活扮演，不是正式消防安全課程或滅火操作教學；沒有真火、災難、受困者、強烈警報／閃光、真實電話或個資輸入，真實裝備只由專業人員操作。

## 語音與生命週期

原創斑點狗消防員「斑斑」可點按重聽，另有喇叭與收音機按鈕。27段中文短句會說明任務圖示、目前步驟、印章、重玩及繼續；來源為Microsoft Hanhan Desktop、Rate=-1的開發時系統合成WAV，非真人／卡通角色配音。`fire-voice.js`統一短句，manifest腳本由短句派生SHA-256檔名；PowerShell只補assets/audio/fire內缺檔，不覆寫舊音訊。遊玩不呼叫生成服務，透過LessonSpeech沿用家長語速、音量與選聲。

`FireVisit`是純狀態，`FireSession`管理DOM、唯一委派click、聲音佇列與計時。休息／背景／切任務／重玩／離場取消語音與未完成水柱／出發，revision拒絕遲到回呼；前景不自動續玩，要明確繼續並重按動作。動畫完成不截斷當前短句，完成導引等待原語音成功結束，切場／暫停可取消等待；播放受阻可點斑斑重試，靜音不妨礙遊玩。

消防局延續原入口夜間也開放，不加入08:00–21:00商業場所限制。專心鎖仍攔截路由／目的地；日夜只改底圖亮度，不改圖示與文字辨識。家長motion或系統減少動態停用動畫、改用零延遲完成，但仍要明確操作。

## 檔案與素材

- `fire-model.js`：三任務、裝備／準備順序、兩次靶命中、待完成動作及印章。
- `fire-station.js`／`fire-station.css`：畫面、原生按鈕、焦點／窄螢幕下一步可見、生命週期。
- `fire-art.js`：裝備、穿衣狀態、紙板靶及消防車為可互動原生SVG；不是用向量假裝生成水彩底圖。
- `app.js`：fire路由、返回小鎮、stop／visibility／專心鎖、共享語音與音效；不改正式教材。
- `assets/fire-station-watercolor.png`：內建image_gen新作1536×1024消防局；前台WebP同尺寸。
- `assets/characters/dalmatian-fire-guide.png`：內建image_gen新作1024×1536透明斑點狗；前台WebP700×1050保留alpha。原創，非特定卡通官方角色。
- `assets/fire.prompts.json`：完整兩段提示詞與PNG／WebP用途。原PNG保留，Sharp僅縮放及編碼；optimizedImages映射排除離線重複下載原PNG。Nickson沿用已保存的熊貓帽素材，未動原照片。
- `content/fire-audio.json`／`assets/audio/fire/`：27段在地WAV；新增兩個生成腳本見SCRIPTS。

## 驗證與限制

Node模型／session／controller回歸及Chromium 1180×714、320×800（模擬觸控）檢查見VALIDATION與DEVELOPMENT_STATUS。本機證據在忽略的`.local-assets/validation/fire/`，不隨Git搬移。此批未驗證實體iPad／Safari、揚聲器主觀聽感或停服後整包離線演練；離線清單已隨本次明確發布授權升版；正式站發布冒煙另見.local-assets/validation/release-20261021.v2。
