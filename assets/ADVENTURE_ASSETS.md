# 大地圖、旅行與熊貓帽首頁素材

由內建 imagegen 技能／工具產生並保存於專案，沒有使用CLI圖片生成。兩張地圖的完整提示詞見 [adventure-maps.prompts.json](./adventure-maps.prompts.json)，首頁去背提示詞見 [nickson-panda-home.prompt.txt](./characters/nickson-panda-home.prompt.txt)。

| 用途 | 專案素材 | 來源與限制 |
| --- | --- | --- |
| 七場景首頁 | [neighborhood-map-watercolor.png](./neighborhood-map-watercolor.png) | 原創擬真水彩小鎮；七個入口由HTML提供，圖片沒有文字或介面 |
| 台灣／日本旅行 | [taiwan-japan-watercolor.png](./taiwan-japan-watercolor.png) | 擬真水彩旅行示意；不是按比例的正式地理圖 |
| 首頁熊貓帽Nickson | [nickson-panda-home.png](./characters/nickson-panda-home.png) | 家長原始S__30826526_0.jpg去背衍生；保留熊貓帽、臉、藍色上衣與比耶姿勢 |

飛機、航線、標籤、按鈕及狀態由adventure-map.js與adventure.css繪製、控制，不烘焙在背景。所有原始主角JPG仍留在受Git排除的本機參考庫。

日文教材圖片由japanese-art.js以SVG繪製：木質教室物品、食物與顏料。遊戲表面沿用現有memory-table-watercolor.png及shapes-veranda-watercolor.png，未重新生成或更換原有英文場景。

## 日文音訊

12段MP3位於assets/audio/japanese，使用Microsoft Edge線上日文聲音ja-JP-NanamiNeural，以-15%語速在開發時產生；3段中文引導WAV使用既有Microsoft Hanhan Desktop。全部為系統合成語音，非真人錄音。

產生腳本：scripts/generate-japanese-audio.py。開發依賴[edge-tts](https://github.com/rany2/edge-tts)，本機安裝於被Git排除的.local-assets/audio-tools；這些套件不隨網站發布，正常遊玩不連線到語音產生服務。Windows的generate-content-audio.ps1僅補WAV，跳過MP3，避免用中文或英文聲音覆寫日文檔案。

再生MP3時需安裝edge-tts並可連線，執行python scripts/generate-japanese-audio.py。既有有效音檔不覆寫。家長可替換成有授權的教師錄音，保持教材映射一致。
