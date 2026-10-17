# 水彩人物素材

以下七張 PNG 均由內建 imagegen 製作，保留真實 alpha 透明背景，供遊戲動態疊加使用。主角依家長提供的圖片去背，其他人物以 `../roles-theater-watercolor.png` 參考水彩畫風與光線。

| 人物／用途 | 專案內最終素材 |
| --- | --- |
| 男孩主角日常：首頁、介紹、形狀與配對 | [nickson-guide-watercolor.png](./nickson-guide-watercolor.png) |
| 男孩主角慶祝：答對回應與完成跳舞 | [nickson-celebrate-watercolor.png](./nickson-celebrate-watercolor.png) |
| 地圖小女孩 | [school-girl-watercolor.png](./school-girl-watercolor.png) |
| 老師 | [teacher-watercolor.png](./teacher-watercolor.png) |
| 朋友 | [friends-watercolor.png](./friends-watercolor.png) |
| 校車司機 | [bus-driver-watercolor.png](./bus-driver-watercolor.png) |
| 廚師 | [cook-watercolor.png](./cook-watercolor.png) |

最終提示詞集合：[prompts.json](./prompts.json)。主角日常來源為家長的 `S__30826531_0.jpg`，慶祝來源為 `S__30826530_0.jpg`。全部六張原始圖片及用途索引另存於本機的 `.local-assets/nickson-references/`，不供網站直接載入。人物插畫對照在 `characters.js`，角色卡、單字卡與家長題庫都由相同對照取得圖片。動作由 CSS 控制，慶祝音樂與答題邏輯沿用既有程式；「減少動態效果」設定會停用人物擺動。

`shapes-companion-intro.wav` 與 `roles-people-intro.wav` 是同步更新的中文介紹備援音檔，使用 Microsoft Hanhan Desktop 系統語音，並非人物真人錄音。
