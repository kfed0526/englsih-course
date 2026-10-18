# 接手入口與工作方式

先讀 [START_HERE.md](START_HERE.md) 與 [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md)，再依任務查 [DEVELOPMENT.md](DEVELOPMENT.md)、[SCRIPTS.md](SCRIPTS.md) 或 [CODE_MAP.md](CODE_MAP.md)。舊功能文件保留歷史範圍；目前進度以狀態表、Git與實際測試交叉確認。

- 文字檔維持LF（.gitattributes／.editorconfig）；不要以不同換行造成離線清單大小漂移。
- 對使用者用繁體中文。一般功能先完成本機預覽與驗證；只有明確要求發布才更新正式網站。
- 不依賴原機H:路徑、個人runtime快取、既有瀏覽器tab或隱藏server。從目前checkout解析路徑，先查git status並保留既有修改。
- UI沿用溫暖手繪場景與Nickson角色；主要檢查iPad Air 11橫向及手機窄螢幕。未完成動作在離開／背景切換必須取消。
- 對應工作請讀repository skill：遊戲互動用 `.agents/skills/panda-school-game-dev/SKILL.md`，教材／圖片／語音用 `panda-school-content-assets`，發布、離線驗證或分支交接用 `panda-school-release`。若工具沒有自動列出skills，直接讀這些檔案。
- 完成一批工作後更新DEVELOPMENT_STATUS與VALIDATION。新機先跑`node scripts/project-check.mjs`；程式變更再用`--test`跑完整檢查。
- 文件或開發分支交接不是發布：不要因此跑release、合併或推送main。推送其他分支也應符合使用者本次授權。

# Project release instructions

For every new version published to GitHub Pages, run `npm run release` once before the release commit. This updates `release.json`, the top-right version label in `index.html`, and entry asset URLs. Use Asia/Taipei dates: `yyyyMMdd.v1`, then `v2`, `v3` on the same day; reset to `v1` on the next day. Do not bump versions for repeated local tests of the same release. Keep the generated version files in the same commit as the released changes.

The parent question bank must be generated from the existing textbook JSON files. Do not maintain a second hard-coded vocabulary or sentence list for this screen. Previewing textbook speech must not change lesson selection or learning records.

## Deployment preference

Deploy only when the user explicitly asks to deploy or publish. Routine feature requests authorize local implementation and testing only. Do not push main, trigger GitHub Pages, or run the release version bump until deployment is requested. This preference was set by the user on 2026-10-17.

## Protagonist reference library

The user asked to retain all six supplied protagonist images for suitable future use. Original JPGs and a usage index are saved in `.local-assets/nickson-references/`, which is ignored by Git. Consult that index when adding protagonist poses or related activities. Keep originals intact; put game-ready derived assets in `assets/characters/`.

## Project identity

Project name: panda-school. Local repository: H:/project/panda-school. Remote: https://github.com/kfed0526/panda-school.git. Pages: https://kfed0526.github.io/panda-school/.
