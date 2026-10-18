# iPad 橫向、日文音量與捷徑圖示（本機）

## 日文語音

日文自動模式優先播放專案內 Nanami 自然日文音檔，避免不同裝置的日文系統聲音音量差異。家長仍可手動選擇裝置聲音；裝置聲音與Audio播放音量均明確設為1，語速1–5與取消／備援機制不變。

12個單字保留原始MP3，較大聲版本放在 `assets/audio/japanese/normalized/`，教材的word.audio和unit.audio同步指向新檔。使用開發時FFmpeg `volume=6dB,alimiter=limit=0.84:level=false`放大並限制峰值；輸出實測平均音量提高3.6–5.0dB，峰值介於−1.9與−1.8dBFS。每段的前後測量與檔案SHA256保存在 `assets/audio/japanese/normalization.json`，測試確認檔案與報告相符。

重建：先執行 `scripts/generate-japanese-audio.py`產生缺少的原始錄音，再執行 `scripts/normalize-japanese-audio.py`。後者需要開發用imageio-ffmpeg，安裝於受Git排除的 `.local-assets/audio-tools`；網站遊玩不載入FFmpeg、Python或雲端語音服務。

## 圖示與捷徑

新增原創向量熊貓標誌 `assets/icons/panda.svg`與32、180、192、512像素PNG，以及512像素maskable PNG。`scripts/generate-icons.py`用Pillow從同一幾何設計輸出圖檔；沒有修改主角照片。

index.html提供favicon、180px apple-touch-icon、Apple網頁App標題與site.webmanifest。manifest的id、start_url、scope皆採相對路徑，能同時在localhost及GitHub Pages的 `/panda-school/`子路徑工作。網站與捷徑圖示會在正式release時更新HTML快取參數。新增的本機server MIME為application/manifest+json。

iPad既有捷徑若繼續顯示舊的空白圖，待更新版本可存取後，重新加入主畫面。尚未宣稱已在iPad實機完成安裝；設定依[Apple Safari Web Content Guide](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)。未加入離線遊玩或service worker。

## iPad 橫向課程

`tablet.css`使用可用的100svh與橫向媒體條件，針對寬度至少768、高度560–1000px的畫面調整，包含Safari工具列縮減高度的情況：

- 課程卡片的資訊與開始按鈕並排，四週可同屏選擇。
- 單字卡、介紹、形狀與校園地圖遊戲使用左右配置。
- 翻牌、人物、身體、機器人、五感與日文課縮減留白，保留至少64px的主要觸控按鈕。
- 首頁地圖與故事並排；慶典遊戲的畫面與操作也採左右配置。
- 仍允許家長題庫、設定、完整節慶清單或放大字體時捲動，沒有用overflow:hidden裁掉內容。

預覽為桌面瀏覽器尺寸模擬；實際iPad Safari、系統音量與已安裝捷徑仍由裝置驗證。依家長通知，與慶典功能一同納入20261018.v6發布。
