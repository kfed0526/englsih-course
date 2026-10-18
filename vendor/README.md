# 農曆年資料

根目錄 `lunar-year-data.js` 只保存 1900–2100 共201筆農曆大小月／閏月位元資料，取自 [yize/solarlunar](https://github.com/yize/solarlunar)。

- 固定來源版本：`df2cbf9851ac631fdeeb9ba08325ef8fed97a43d`
- 來源檔案：`const/lunarInfo.js`
- 授權：ISC，完整聲明見 `solarlunar-LICENSE.txt`
- 下載日期：2026-10-18
- 沒有載入上游完整程式、套件管理器、CDN或執行期網路依賴。

`festival-calendar.js` 用 1900-01-31 為正月初一基準，累加年、月與閏月天數，只取正月初一、五月初五、八月十五。現有環境的 Intl Chinese Calendar 在2027年春節會產生2/7，與官方2/6不同，因此不使用裝置內建農曆來決定日期。

已用台灣政府2026、2027日曆與香港天文台2028日曆核對回歸案例，來源見 `FESTIVALS.md`。台北今天的判定仍使用 Intl 的 Gregorian 日期與 Asia/Taipei 時區。
