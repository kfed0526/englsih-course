# 腳本索引

下列路徑皆相對專案根目錄。一般開發只需Node與Git。

| 指令 | 用途 | 改檔／額外依賴 |
| --- | --- | --- |
| node server.mjs | HTTP預覽，預設4173，PORT可改 | 不改檔；持續執行到Ctrl+C |
| node scripts/project-check.mjs | 根目錄、Node、Git、版本、教材、技能與素材就緒檢查 | 只讀，不下載、不發布 |
| node scripts/project-check.mjs --test | 上述檢查＋列出測試檔執行完整Node測試 | 不改產品檔，測試會建立自己的臨時fixture |
| node --test tests/life-learning.test.mjs | 指定功能測試，依變更換測試檔 | Node內建runner |
| node scripts/offline-manifest.mjs | 重建離線資源清單與總大小 | 寫offline-manifest.json，不改版本 |
| node scripts/release.mjs | 真正發布前更新版本、HTML／模組快取網址及離線清單 | 改多個檔案；每次正式發布只跑一次 |
| node scripts/festival-audio-manifest.mjs | 根據慶典instruction產生音檔映射 | 寫content/festival-audio.json；**不會產生聲音檔** |
| node scripts/hospital-audio-manifest.mjs | 根據醫院短句與正式教材部位產生映射 | 寫content/hospital-audio.json；不產生聲音檔 |
| powershell -NoProfile -File scripts/generate-hospital-audio.ps1 | 只補醫院缺少的短句WAV | 開發用Windows System.Speech／Microsoft Hanhan Desktop；不覆寫既有檔案、不連線，非啟動需求 |
| node scripts/department-audio-manifest.mjs | 從百貨短句與正式教材商品中文派生映射 | 寫content/department-audio.json；不生成聲音檔 |
| node scripts/salon-audio-manifest.mjs | 從理髮店短句產生11段映射 | 寫content/salon-audio.json；不產生音檔或改正式教材 |
| node scripts/police-audio-manifest.mjs | 從警察局短句產生43段映射 | 寫content/police-audio.json；不產生音檔或新增正式詞表 |
| powershell -NoProfile -File scripts/generate-police-audio.ps1 | 只補警察局缺少的中文WAV | 開發用System.Speech／Hanhan，目的地限定assets/audio/police，不覆寫既有音檔；系統限制腳本時可僅對該次程序加ExecutionPolicy Bypass，非啟動依賴或全域設定 |
| powershell -NoProfile -File scripts/generate-salon-audio.ps1 | 只補理髮店缺少的短句WAV | 開發用System.Speech／Hanhan；僅限assets/audio/salon，不覆寫其他錄音、不連線，非啟動需求 |
| powershell -NoProfile -File scripts/generate-department-audio.ps1 | 只補百貨缺少的短句WAV | 開發用Windows System.Speech／Microsoft Hanhan Desktop；不覆寫既有檔案、不連線，非啟動需求 |
| powershell -File generate-unit-audio.ps1 | 第一冊部分WAV生成 | Windows System.Speech；產生音檔，非必要啟動步驟 |
| powershell -File generate-content-audio.ps1 | 教材缺少的WAV生成 | Windows System.Speech；先讀腳本確認輸出 |
| python scripts/generate-japanese-audio.py | 日文單字MP3生成 | 開發用edge-tts、需要網路；正常遊玩不呼叫 |
| python scripts/normalize-japanese-audio.py | 日文音量正規化與映射更新 | imageio-ffmpeg；寫normalized音檔、報告及教材映射 |
| python scripts/generate-icons.py | 熊貓捷徑／網站圖示重繪 | Pillow；寫assets/icons，不為一般開發重跑 |

Python與音檔生成工具是選用工具，clone後既有音檔、圖示可直接使用。需要再生才安裝對應依賴，不複製原電腦個人Python絕對路徑，不自動升級或覆寫全部音檔。

## 常用一次檢查

```sh
node scripts/project-check.mjs --test
git diff --check
```

## 常用本機預覽

```sh
node server.mjs
```

瀏覽器query中的`?preview=...`目前主要是標示本次預覽，不是深連結路由；重新整理仍回首頁，請從地圖進入目標場景。

## 下一台電腦的Git檢查

```sh
git branch --show-current
git status --short
git log -3 --oneline
git remote -v
```

不要把`git config --global safe.directory '*'`當作環境安裝步驟。若是複製舊.git造成擁有者錯誤，優先在自己帳號下重新clone；確定是受信任專案才局部處理。

## 維護這些文件

完成一批工作後更新DEVELOPMENT_STATUS與VALIDATION；新增重要腳本同步本表。新增skill後檢查frontmatter、相對連結、觸發範圍與指令，不能讓skill暗示額外發布授權。
