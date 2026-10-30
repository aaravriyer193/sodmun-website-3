"""
Generates the derived art the redesign uses. Outputs are committed, so this
only needs re-running when source photos change.

    python3 tools/assets.py            # intro frames, stickers, logo paths
    python3 tools/assets.py --people   # + secretariat cut-outs (needs rembg
                                       #   and the u2net_human_seg model)

Writes:
  public/assets/intro/*.jpg        extra frames for the opening flip-book
  public/assets/people/*.png       black & white cut-outs of the secretariat
  public/assets/people/atlas.webp  the same cut-outs packed for WebGL
  public/assets/stickers/*.png     die-cut logo and gavel stickers
  src/data/logo-paths.json         traced logo outlines for the 3D logo
"""
import glob
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, 'public', 'assets')
SEC = os.path.join(PUB, 'sec')


def out(*p):
    path = os.path.join(PUB, *p)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    return path


# ------------------------------------------------------------------
# Intro frames: the event photo inside each secretariat poster
# ------------------------------------------------------------------
INTRO_PEOPLE = [
    'dhairya-kamlani', 'harini-anand', 'mahir-gandhi', 'ram-prasad', 'rudraditya-bisen',
    'tanya-bhargava', 'vidur-kumar', 'ananya-joshi', 'jinal-ravaya', 'diva-solanki', 'shreyas-vivek',
]


def intro_frames():
    for i, pid in enumerate(INTRO_PEOPLE):
        im = Image.open(os.path.join(SEC, pid + '.jpg')).convert('L')
        w, h = im.size
        crop = im.crop((int(w * 0.12), int(h * 0.3), int(w * 0.62), int(h * 0.93)))
        crop = crop.resize((crop.width * 2, crop.height * 2), Image.LANCZOS)
        crop.save(out('intro', f'p{i + 1:02d}.jpg'), quality=82, optimize=True, progressive=True)


# ------------------------------------------------------------------
# Secretariat cut-outs
# ------------------------------------------------------------------
SKIP = {'joshua-rohith', 'pranav-nair', 'raunak-ramesh', 'ankshita-tiwari', 'rittal-rafeek', 'rayan-hussain'}


def people():
    from rembg import new_session, remove
    from scipy import ndimage

    session = new_session('u2net_human_seg')
    names = []
    for f in sorted(glob.glob(os.path.join(SEC, '*.jpg'))):
        pid = os.path.basename(f)[:-4]
        if pid in SKIP:
            continue
        im = Image.open(f).convert('RGB')
        w, h = im.size
        crop = im.crop((0, int(h * 0.26), int(w * 0.66), h))
        a = np.array(remove(crop, session=session, only_mask=True)).astype(np.float32) / 255
        lab, n = ndimage.label(a > 0.5)
        if n > 1:
            sizes = ndimage.sum(np.ones_like(a), lab, range(1, n + 1))
            a = a * ndimage.binary_dilation(lab == np.argmax(sizes) + 1, iterations=2)
        # hard edge, lightly anti-aliased
        hard = Image.fromarray(((a > 0.5) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
        a = np.array(hard).astype(np.float32) / 255
        ys, xs = np.where(a > 0.5)
        x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
        g = np.array(crop.convert('L')).astype(np.float32)
        m = g[a > 0.5].mean()
        g = np.clip((g - m) * 1.5 + 118, 0, 255)
        rgba = np.dstack([g, g, g, a * 255]).astype(np.uint8)[y0:y1 + 1, x0:x1 + 1]
        img = Image.fromarray(rgba, 'RGBA')
        img.thumbnail((360, 520), Image.LANCZOS)
        img.save(out('people', pid + '.png'), optimize=True)
        names.append(pid)
        print('cut', pid)

    # Pack into a 6×5 atlas, each figure bottom-centred in its cell.
    cw, ch, cols = 256, 384, 6
    rows = (len(names) + cols - 1) // cols
    atlas = Image.new('RGBA', (cw * cols, ch * rows), (0, 0, 0, 0))
    for i, pid in enumerate(names):
        img = Image.open(out('people', pid + '.png'))
        img.thumbnail((cw - 8, ch - 4), Image.LANCZOS)
        x = (i % cols) * cw + (cw - img.width) // 2
        y = (i // cols) * ch + ch - img.height
        atlas.paste(img, (x, y), img)
    atlas.save(out('people', 'atlas.webp'), quality=88, method=6)
    with open(os.path.join(ROOT, 'src', 'data', 'people.json'), 'w') as fh:
        json.dump({'cols': cols, 'rows': rows, 'cell': [cw, ch], 'ids': names}, fh)


# ------------------------------------------------------------------
# Stickers (die-cut white border + soft print texture)
# ------------------------------------------------------------------
def diecut(art, border=26):
    a = art.getchannel('A')
    grown = a.filter(ImageFilter.MaxFilter(border * 2 + 1)).filter(ImageFilter.GaussianBlur(1.2))
    grown = grown.point(lambda v: 255 if v > 90 else 0).filter(ImageFilter.GaussianBlur(0.8))
    base = Image.new('RGBA', art.size, (255, 255, 255, 0))
    base.putalpha(grown)
    white = Image.new('RGBA', art.size, (252, 252, 248, 255))
    base = Image.composite(white, base, grown)
    base.alpha_composite(art)
    return base


def pad(img, p):
    c = Image.new('RGBA', (img.width + p * 2, img.height + p * 2), (0, 0, 0, 0))
    c.paste(img, (p, p), img)
    return c


def stickers():
    logo = Image.open(os.path.join(PUB, 'brand', 'logo.png')).convert('RGBA')
    logo = pad(logo, 60)
    a = np.array(logo)
    a[..., :3] = (14, 20, 16)
    logo = Image.fromarray(a)
    s = diecut(logo, 34)
    s.thumbnail((512, 512), Image.LANCZOS)
    s.save(out('stickers', 'logo.png'), optimize=True)

    # Gavel, drawn at 4× and downsampled
    S = 2048
    g = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(g)
    green = (30, 122, 64, 255)
    dark = (14, 52, 30, 255)
    # sound block
    d.rounded_rectangle((330, 1560, 1420, 1720), 40, fill=dark)
    d.rounded_rectangle((430, 1470, 1320, 1580), 36, fill=green)
    head = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    hd = ImageDraw.Draw(head)
    # head
    hd.rounded_rectangle((640, 420, 1400, 760), 70, fill=green)
    hd.rounded_rectangle((600, 470, 690, 710), 30, fill=dark)
    hd.rounded_rectangle((1350, 470, 1440, 710), 30, fill=dark)
    hd.rectangle((860, 420, 900, 760), fill=dark)
    hd.rectangle((1140, 420, 1180, 760), fill=dark)
    # handle
    hd.rounded_rectangle((975, 740, 1065, 1700), 45, fill=dark)
    head = head.rotate(38, resample=Image.BICUBIC, center=(1020, 600))
    head = head.transform(head.size, Image.AFFINE, (1, 0, 160, 0, 1, -40), resample=Image.BICUBIC)
    g.alpha_composite(head)
    s = diecut(pad(g.resize((512, 512), Image.LANCZOS), 30), 22)
    s.save(out('stickers', 'gavel.png'), optimize=True)


# ------------------------------------------------------------------
# Logo outlines for the 3D logo (ring and globe traced separately)
# ------------------------------------------------------------------
def trace(name, tol=0.9):
    from skimage import measure
    a = np.array(Image.open(os.path.join(PUB, 'brand', name + '.png')).getchannel('A')).astype(np.float32) / 255
    a = np.pad(a, 2)
    h, w = a.shape
    paths = []
    for c in measure.find_contours(a, 0.5):
        if len(c) < 12:
            continue
        c = measure.approximate_polygon(c, tolerance=tol)
        pts = [(round((x - w / 2) / (w / 2), 4), round(-(y - h / 2) / (w / 2), 4)) for y, x in c]
        area = 0.5 * sum(x0 * y1 - x1 * y0 for (x0, y0), (x1, y1) in zip(pts, pts[1:] + pts[:1]))
        if abs(area) < 2e-5:
            continue
        paths.append(pts)
    return paths


def logo_paths():
    data = {'ring': trace('logo-ring'), 'globe': trace('logo-globe', 0.7)}
    with open(os.path.join(ROOT, 'src', 'data', 'logo-paths.json'), 'w') as fh:
        json.dump(data, fh, separators=(',', ':'))
    print('logo paths', {k: len(v) for k, v in data.items()})


if __name__ == '__main__':
    intro_frames()
    stickers()
    logo_paths()
    if '--people' in sys.argv:
        people()

