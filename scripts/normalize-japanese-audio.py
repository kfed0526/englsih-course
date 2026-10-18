"""Developer-only loudness normalization. Originals stay intact; no runtime service.
Dependency: imageio-ffmpeg, installed under .local-assets/audio-tools.
"""
import json
import hashlib
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '.local-assets/audio-tools'))
import imageio_ffmpeg

ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
book_file = ROOT / 'content/japanese-school.json'
book = json.loads(book_file.read_text(encoding='utf-8-sig'))
audio_root = ROOT / 'assets/audio/japanese'
output_root = audio_root / 'normalized'
output_root.mkdir(exist_ok=True)

def measure(file):
    result = subprocess.run([ffmpeg, '-hide_banner', '-i', str(file), '-af', 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True, check=True)
    return {key: float(re.search(key + r':\s*(-?[\d.]+) dB', result.stderr).group(1)) for key in ['mean_volume', 'max_volume']}

report = {'tool': 'FFmpeg 7.1 gain and peak limiter, development only', 'filter': 'volume=6dB,alimiter=limit=0.84:level=false', 'clips': []}
mapping = {}
for unit in book['units']:
    for word in unit['words']:
        old = word['audio']
        source = audio_root / Path(old).name
        output = output_root / source.name
        before = measure(source)
        subprocess.run([ffmpeg, '-hide_banner', '-loglevel', 'error', '-y', '-i', str(source), '-af', report['filter'], '-ar', '24000', '-ac', '1', '-b:a', '96k', str(output)], check=True)
        after = measure(output)
        if after['max_volume'] > -.5:
            raise RuntimeError('Normalized clip peak is too high: ' + word['id'])
        if after['mean_volume'] < before['mean_volume'] + 3:
            raise RuntimeError('Clip did not become noticeably louder: ' + word['id'])
        relative = output.relative_to(ROOT).as_posix()
        mapping[old] = relative
        word['audio'] = relative
        report['clips'].append({'word': word['id'], 'source': source.relative_to(ROOT).as_posix(), 'output': relative, 'before': before, 'after': after, 'sha256': hashlib.sha256(output.read_bytes()).hexdigest()})
    unit['audio'] = {text: mapping.get(file, file) for text, file in unit['audio'].items()}
book_file.write_text(json.dumps(book, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
(ROOT / 'assets/audio/japanese/normalization.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
for clip in report['clips']:
    print(clip['word'], clip['before']['mean_volume'], '->', clip['after']['mean_volume'], 'dB; peak', clip['after']['max_volume'])
