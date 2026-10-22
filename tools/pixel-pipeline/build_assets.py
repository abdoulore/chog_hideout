"""Chog Hideout pixel pipeline.

Converts the painted Rooftop Mischief assets in public/assets into one consistent
pixel-art set, adds the hand-drawn caretaker and props, and writes meta.json.

Usage:
    python3 build_assets.py --assets ../public/assets --out ../public/pixel

Every size below is in output pixels. The prototype values make Chog about 36 px tall.
To match the game's world units, change SIZES only; nothing else should need editing.
"""
import argparse, json, os, shutil
import numpy as np
from PIL import Image
from px import prep, palette_from, mode_downscale, despeckle, outline, darken_edges
import caretaker, props3

HERE = os.path.dirname(os.path.abspath(__file__))

# ---- the one table to edit when resizing for the game ----
SIZES = {
    'chog_h': 36,          # Chog height (source frame is 301 px tall)
    'chog_frame': (48, 42),
    'ground_h': 44,        # roof strip height
    'plank_h': 15,         # timber walkway height
    'home_w': 104,
    'battery_h': 15,
    'music_w': 20,
    'planter_w': 44,
    'pot_w': 18,
    'sun_h': 19,
    'shutter_h': 64,
    'lift_w': 44,
    'city_w': 580,         # background width; keep it wider than the widest view
}
COLORS = {'chog': 14, 'ground': 18, 'plank': 14, 'home': 20, 'small': 12, 'planter': 16, 'city': 56}


def sprite(img, scale, colors=14, shade=.22, sat=1.2, con=1.15):
    im = prep(img, sat, con)
    pal = palette_from([im], colors)
    return outline(darken_edges(despeckle(mode_downscale(im, scale, pal)), shade))


def bbox(img):
    a = np.array(img)[..., 3] > 0
    ys, xs = np.where(a)
    return xs.min(), ys.min(), xs.max(), ys.max()


def seamless_crop(img, pmin, pmax, xmin, xmax, cols=2, margin=1):
    """Find the horizontal period whose edge columns match best, so the strip tiles without a seam.
    margin keeps the crop away from the strip's right end (use 12 for walkways so the end caps are excluded)."""
    a = np.array(img).astype(int)
    best = None
    for p in range(pmin, pmax):
        for x0 in range(xmin, xmax):
            if x0 + p + margin >= a.shape[1]:
                continue
            d = sum(np.abs(a[:, x0 + k] - a[:, x0 + p + k]).sum() for k in range(cols))
            if best is None or d < best[0]:
                best = (d, x0, p)
    _, x0, p = best
    return img.crop((x0, 0, x0 + p, img.height)), p


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--profile', choices=['prototype', 'repo'], default='repo')
    ap.add_argument('--assets', required=True, help='path to public/assets with the painted art')
    ap.add_argument('--out', required=True)
    args = ap.parse_args()
    R, O = args.assets, args.out
    if args.profile == 'repo':
        SIZES.update(home_w=120, planter_w=110, shutter_h=130, lift_w=160, city_w=900)
    os.makedirs(O, exist_ok=True)
    M = json.load(open(os.path.join(R, 'manifest.json')))
    meta = {}

    # Chog: 8 painted frames, one shared palette, anchored on the head so frames do not swim
    sheet = Image.open(f'{R}/burrows-chog-v1.webp').convert('RGBA')
    src = [prep(sheet.crop((x, y, x + w, y + h))) for x, y, w, h in M['chog']['frames']]
    pal = palette_from(src, COLORS['chog'])
    scale = SIZES['chog_h'] / 301
    px = [outline(darken_edges(despeckle(mode_downscale(f, scale, pal)), .22)) for f in src]
    FW, FH = SIZES['chog_frame']
    s = Image.new('RGBA', (FW * len(px), FH))
    for i, f in enumerate(px):
        x0, y0, x1, y1 = bbox(f)
        a = np.array(f)[..., 3] > 0
        cx = int(np.where(a[y0:y0 + max(1, (y1 - y0) // 2)])[1].mean())
        c = Image.new('RGBA', (FW, FH)); c.alpha_composite(f, (FW // 2 - cx, FH - 1 - y1))
        s.alpha_composite(c, (i * FW, 0))
    s.save(f'{O}/chog.png')
    meta['chog'] = {'fw': FW, 'fh': FH, 'anims': {'idle': [0, 0], 'run': [1, 4], 'jump': [5, 5], 'fall': [4, 4],
                                                  'land': [7, 7], 'dash': [6, 6], 'grab': [0, 0]}}

    # Caretaker: hand-drawn in the same palette (caretaker.py)
    cs, anims = caretaker.build()
    cs.save(f'{O}/care.png')
    meta['care'] = {'fw': caretaker.FW, 'fh': caretaker.FH, 'anims': anims}

    # Ground: roof strip, cropped to a seamless repeat
    roof = Image.open(f'{R}/burrows-roof-v1.webp').convert('RGBA')
    x, y, w, h = M['roof']['frame']
    rp = sprite(roof.crop((x, y, x + w, y + h)), SIZES['ground_h'] / h, COLORS['ground'], shade=0)
    rp = rp.crop((1, 1, rp.width - 1, rp.height - 1))
    g, p = seamless_crop(rp, 70, 220, 20, 60)
    g.save(f'{O}/ground.png'); meta['groundW'] = p; meta['groundH'] = rp.height

    # Timber walkway: left cap, repeating middle, right cap
    tim = Image.open(f'{R}/burrows-timber-v2.webp').convert('RGBA')
    x, y, w, h = M['timber']['frame']
    tp = sprite(tim.crop((x, y, x + w, y + h)), SIZES['plank_h'] / h, COLORS['plank'], shade=.15)
    tp.crop((0, 0, 10, tp.height)).save(f'{O}/plankL.png')
    tp.crop((tp.width - 10, 0, tp.width, tp.height)).save(f'{O}/plankR.png')
    mid, _ = seamless_crop(tp, 30, 120, 12, 40, cols=1, margin=12)
    mid.save(f'{O}/plankM.png'); meta['plankH'] = tp.height

    # Props from the painted sheets
    props = Image.open(f'{R}/burrows-props-v1.webp').convert('RGBA')
    x, y, w, h = M['props']['frames']['house']
    sprite(props.crop((x, y, x + w, y + h)), SIZES['home_w'] / w, COLORS['home']).save(f'{O}/home.png')
    d = Image.open(f'{R}/burrows-district-props-v2.webp').convert('RGBA')
    # boxes found by alpha bounds on burrows-district-props-v2.webp (battery, music box, planter)
    sprite(d.crop((98, 59, 302, 352)), SIZES['battery_h'] / 293, COLORS['small']).save(f'{O}/battery.png')
    sprite(d.crop((421, 104, 787, 351)), SIZES['music_w'] / 366, COLORS['small']).save(f'{O}/music.png')
    planter_src = d.crop((9, 457, 396, 739))
    sprite(planter_src, SIZES['planter_w'] / 387, COLORS['planter']).save(f'{O}/planter.png')
    im = prep(planter_src, 1.2, 1.15)
    outline(darken_edges(despeckle(mode_downscale(im, SIZES['pot_w'] / 387, palette_from([im], 12))), .2)).save(f'{O}/pot.png')
    sun = Image.open(f'{R}/burrows-sun-v2.webp').convert('RGBA'); x, y, w, h = M['sun']['frame']
    sprite(sun.crop((x, y, x + w, y + h)), SIZES['sun_h'] / h, COLORS['small']).save(f'{O}/sun.png')
    sh = Image.open(f'{R}/burrows-shutter-v2.webp').convert('RGBA'); x, y, w, h = M['shutter']['frame']
    s2 = sprite(sh.crop((x, y, x + w, y + h)), SIZES['shutter_h'] / h, COLORS['small'], shade=.1)
    s2.crop((1, 1, s2.width - 1, s2.height - 1)).save(f'{O}/shutter.png')

    # Background: the painted city, box-downscaled and quantized. Kept soft on purpose: it reads as distance.
    city = prep(Image.open(f'{R}/burrows-city-v1.jpg').convert('RGBA'), 1.1, 1.05).convert('RGB')
    cw = SIZES['city_w']; chh = round(city.height * cw / city.width)
    city.resize((cw, chh), Image.BOX).quantize(colors=COLORS['city'], method=Image.Quantize.MEDIANCUT,
                                              dither=Image.Dither.NONE).convert('RGBA').save(f'{O}/city.png')

    # Indexed PNG preserves the exact city pixels with a smaller download.
    if args.profile == 'repo':
        Image.open(f'{O}/city.png').convert('RGB').quantize(colors=56, dither=Image.Dither.NONE).save(f'{O}/city.png', optimize=True)

    # Hand-drawn props in the same palette (props3.py)
    props3.lamp().save(f'{O}/lamp.png')
    props3.lift(Image.open(f'{O}/plankM.png'), SIZES['lift_w']).save(f'{O}/lift.png')
    props3.socket().save(f'{O}/socket.png')
    props3.plinth().save(f'{O}/plinth.png')
    props3.rail().save(f'{O}/rail.png')
    props3.bird().save(f'{O}/bird.png')
    shutil.copy(os.path.join(HERE, 'handmade', 'crate.png'), f'{O}/crate.png')

    for k in ['planter', 'shutter', 'home', 'battery', 'music', 'sun']:
        meta[k] = list(Image.open(f'{O}/{k}.png').size)
    json.dump(meta, open(f'{O}/meta.json', 'w'), indent=1)
    print('wrote', len(os.listdir(O)), 'files to', O)


if __name__ == '__main__':
    main()
