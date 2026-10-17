# Project release instructions

For every new version published to GitHub Pages, run `npm run release` once before the release commit. This updates `release.json`, the top-right version label in `index.html`, and entry asset URLs. Use Asia/Taipei dates: `yyyyMMdd.v1`, then `v2`, `v3` on the same day; reset to `v1` on the next day. Do not bump versions for repeated local tests of the same release. Keep the generated version files in the same commit as the released changes.

The parent question bank must be generated from the existing textbook JSON files. Do not maintain a second hard-coded vocabulary or sentence list for this screen. Previewing textbook speech must not change lesson selection or learning records.
