# 家裡互動第一版（20261018.v12）

家裡換成可看見客廳、書桌、浴室與臥室的剖面圖，保留原本一家人坐沙發的場景圖檔。四個入口均可透過圖片熱區或上方按鈕操作。

- 浴室：先選溫溫的水，再用觸控／滑鼠拖曳搓五處泡泡，沖洗三次、擦乾四處。提供逐處點按與大按鈕替代操作。搓洗與沖洗有泡泡圖層變化；洗完可直接去找媽媽。每次進入重新開始。
- 臥室：選開心、累累或想抱抱，媽媽顯示不同回應；抱三次後顯示完整愛心。可按「聽媽媽說」使用既有中文語音與家長語速設定；離開取消播放。
- 書桌：選英文或日文，再選既有課本；直接開啟原本的課程，不另複製教材。從課程返回書桌，保留語言選擇。
- 電視：星光森林橫向捲軸闖關。3480寬場景、木橋、上層平台、7顆星與18顆光點、巡邏小蝸牛、4個檢查點。找到任意5顆星再抵達小屋即完成。雙段跳、空白鍵／方向鍵／A D、觸控左右與跳躍。掉落或碰蝸牛會回檢查點，保留收集；跳在蝸牛上會彈起。可暫停、回檢查點、重玩；背景頁籤與視窗失焦暫停，離開清除 RAF、按鍵與指標狀態。

休閒互動不寫教材進度；課程入口沿用原有學習紀錄。音效遵循家長設定。減少動態設定取消抱抱縮放與裝飾晃動，必要的遊戲移動仍保留。

## 程式
- `home-activities.js`：洗澡與抱抱狀態、互動控制器、教材選書介面。
- `home-platformer.js`：純物理模型、路線資料、Canvas繪圖及輸入生命週期。
- `home-play.css`：家裡熱區、互動及電視版面。
- `tests/home-activities.test.mjs`／`tests/home-platformer.test.mjs`：步驟順序、無重複計分、雙段跳、碰撞與完整可通關路線。

## 圖片與提示（內建 image_gen，非 CLI）
- [家裡剖面圖](assets/home-interactive-watercolor.png)
- [媽媽抱抱](assets/home-hug-watercolor.png)
- [洗澡泡泡](assets/home-bath-watercolor.png)
- [洗澡沖乾淨](assets/home-bath-clean-watercolor.png)
- [前三張完整提示及來源](assets/home-interactions.prompts.json)
- [洗乾淨變體提示](assets/home-bath-clean.prompts.json)
- [電視森林背景](assets/home-tv-forest-watercolor.png)
- [森林完整提示](assets/home-tv-forest.prompts.json)

人物來源為家長先前提供的全家合照與現有 Nickson 角色；原始照片及舊場景圖保持不變。
