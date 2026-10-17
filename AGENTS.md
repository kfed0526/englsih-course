# Project release instructions

For every new version published to GitHub Pages, run `npm run release` once before the release commit. This updates `release.json`, the top-right version label in `index.html`, and entry asset URLs. Use Asia/Taipei dates: `yyyyMMdd.v1`, then `v2`, `v3` on the same day; reset to `v1` on the next day. Do not bump versions for repeated local tests of the same release. Keep the generated version files in the same commit as the released changes.

The parent question bank must be generated from the existing textbook JSON files. Do not maintain a second hard-coded vocabulary or sentence list for this screen. Previewing textbook speech must not change lesson selection or learning records.

## Deployment preference

Deploy only when the user explicitly asks to deploy or publish. Routine feature requests authorize local implementation and testing only. Do not push main, trigger GitHub Pages, or run the release version bump until deployment is requested. This preference was set by the user on 2026-10-17.

## Protagonist reference library

The user asked to retain all six supplied protagonist images for suitable future use. Original JPGs and a usage index are saved in `.local-assets/nickson-references/`, which is ignored by Git. Consult that index when adding protagonist poses or related activities. Keep originals intact; put game-ready derived assets in `assets/characters/`.
