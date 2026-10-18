"""Generate the 12 bundled Japanese vocabulary clips; no service is called during play.
Developer-only dependency: edge-tts (https://github.com/rany2/edge-tts).
Install normally or under .local-assets/audio-tools. Existing clips stay intact.
"""
import asyncio
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".local-assets" / "audio-tools"))
import edge_tts

VOICE = "ja-JP-NanamiNeural"

async def main():
    book = json.loads((ROOT / "content/japanese-school.json").read_text(encoding="utf-8-sig"))
    voices = await edge_tts.list_voices()
    if VOICE not in {v["ShortName"] for v in voices}:
        raise RuntimeError("Configured Japanese voice is unavailable; do not substitute another language.")
    semaphore = asyncio.Semaphore(2)
    async def save(word):
        target = (ROOT / 'assets/audio/japanese' / Path(word['audio']).name).resolve()
        if not target.is_relative_to((ROOT / "assets/audio/japanese").resolve()):
            raise RuntimeError("Audio path left the Japanese asset folder")
        if target.exists() and target.stat().st_size > 1000:
            return
        target.parent.mkdir(parents=True, exist_ok=True)
        async with semaphore:
            await edge_tts.Communicate(word["kana"], VOICE, rate="-15%").save(str(target))
        print("Saved", word["id"], flush=True)
    await asyncio.gather(*(save(w) for u in book["units"] for w in u["words"]))

if __name__ == "__main__":
    asyncio.run(main())
