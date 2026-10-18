"""Render the project's code-native panda mark; developer-only Pillow dependency."""
import math
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'assets/icons'
DEST.mkdir(parents=True, exist_ok=True)
shapes = [
    (153, 159, 59, 61, 0, '#343a32'), (359, 159, 59, 61, 0, '#343a32'),
    (256, 290, 156, 148, 0, '#fff4db'),
    (193, 275, 40, 57, 25, '#343a32'), (319, 275, 40, 57, -25, '#343a32'),
    (200, 266, 14, 18, 0, '#fffdf0'), (312, 266, 14, 18, 0, '#fffdf0'),
    (202, 270, 7, 10, 0, '#343a32'), (310, 270, 7, 10, 0, '#343a32'),
    (153, 337, 24, 13, 0, '#e5ae92'), (359, 337, 24, 13, 0, '#e5ae92'),
    (256, 327, 25, 18, 0, '#343a32'),
]
svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="#718360"/>'
for x, y, rx, ry, angle, fill in shapes:
    svg += f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{fill}" transform="rotate({angle} {x} {y})"/>'
svg += '<path d="M230 364q26 25 52 0" fill="none" stroke="#343a32" stroke-width="9" stroke-linecap="round"/></svg>'
(DEST / 'panda.svg').write_text(svg, encoding='utf-8')

def render(size, maskable=False):
    scale, factor = 4, .88 if maskable else 1
    im = Image.new('RGB', (size * scale, size * scale), '#718360')
    draw = ImageDraw.Draw(im)
    def point(x, y):
        return ((256 + (x-256)*factor)/512*size*scale, (256 + (y-256)*factor)/512*size*scale)
    for x, y, rx, ry, angle, fill in shapes:
        radians = math.radians(angle)
        points=[]
        for i in range(120):
            t=i*math.tau/120
            dx,dy=rx*math.cos(t),ry*math.sin(t)
            points.append(point(x+dx*math.cos(radians)-dy*math.sin(radians), y+dx*math.sin(radians)+dy*math.cos(radians)))
        draw.polygon(points, fill=fill)
    smile=[point(230+52*i/30,364+12*math.sin(math.pi*i/30)) for i in range(31)]
    draw.line(smile,fill='#343a32',width=max(1,round(9/512*size*scale*factor)),joint='curve')
    return im.resize((size,size),Image.Resampling.LANCZOS)

for size in [32,180,192,512]:
    render(size).save(DEST/f'panda-{size}.png')
render(512,True).save(DEST/'panda-maskable-512.png')
print('Saved SVG and five PNG home-screen/browser icons.')
