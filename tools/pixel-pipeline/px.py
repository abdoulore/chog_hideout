"""Turn painted assets into clean pixel art: shared palette, majority-vote downscale, outline."""
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

OUT = (28, 18, 41, 255)

def prep(img, sat=1.2, con=1.15):
    rgb = img.convert('RGB')
    rgb = ImageEnhance.Color(rgb).enhance(sat)
    rgb = ImageEnhance.Contrast(rgb).enhance(con)
    out = rgb.convert('RGBA'); out.putalpha(img.convert('RGBA').split()[3]); return out

def palette_from(imgs, n):
    """Median-cut palette over the opaque pixels of several images."""
    px = []
    for im in imgs:
        a = np.array(im.convert('RGBA'))
        px.append(a[a[..., 3] > 128][:, :3])
    px = np.concatenate(px)
    side = int(np.ceil(np.sqrt(len(px))))
    pad = np.zeros((side * side, 3), np.uint8); pad[:len(px)] = px; pad[len(px):] = px[0]
    pim = Image.fromarray(pad.reshape(side, side, 3))
    return pim.quantize(colors=n, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)

def mode_downscale(img, scale, pal, alpha_cut=.45):
    """Quantize at full res to the palette, then each output pixel takes the most common colour in its block."""
    W, H = img.size
    w, h = max(1, round(W * scale)), max(1, round(H * scale))
    q = np.array(img.convert('RGB').quantize(palette=pal, dither=Image.Dither.NONE))
    a = np.array(img.convert('RGBA'))[..., 3] > 128
    out = np.zeros((h, w), np.int16) - 1
    ys = np.linspace(0, H, h + 1).astype(int); xs = np.linspace(0, W, w + 1).astype(int)
    for j in range(h):
        for i in range(w):
            blk = q[ys[j]:ys[j + 1], xs[i]:xs[i + 1]]; am = a[ys[j]:ys[j + 1], xs[i]:xs[i + 1]]
            if am.size == 0 or am.mean() < alpha_cut: continue
            vals = blk[am]
            out[j, i] = np.bincount(vals).argmax()
    lut = np.array(pal.getpalette()[:768]).reshape(-1, 3)
    rgba = np.zeros((h, w, 4), np.uint8)
    m = out >= 0
    rgba[m, :3] = lut[out[m]]; rgba[m, 3] = 255
    return Image.fromarray(rgba)

def despeckle(img):
    """Replace opaque pixels that match none of their 4 neighbours with the most common neighbour colour."""
    a = np.array(img); H, W = a.shape[:2]; b = a.copy()
    for y in range(1, H - 1):
        for x in range(1, W - 1):
            if a[y, x, 3] == 0: continue
            nb = [tuple(a[y + dy, x + dx]) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))]
            if tuple(a[y, x]) not in nb:
                op = [n for n in nb if n[3] > 0]
                if len(op) >= 3:
                    b[y, x] = max(set(op), key=op.count)
    return Image.fromarray(b)

def outline(img, col=OUT):
    a = np.array(img); H, W = a.shape[:2]
    pad = np.zeros((H + 2, W + 2, 4), np.uint8); pad[1:-1, 1:-1] = a
    op = pad[..., 3] > 0
    ring = (np.roll(op, 1, 0) | np.roll(op, -1, 0) | np.roll(op, 1, 1) | np.roll(op, -1, 1)) & ~op
    pad[ring] = col
    return Image.fromarray(pad)

def darken_edges(img, amt=.35):
    """Inner shading: pixels touching the outline on the lower-left get darker (light from top-right)."""
    a = np.array(img).astype(float); H, W = a.shape[:2]
    op = a[..., 3] > 0
    for y in range(H):
        for x in range(W):
            if not op[y, x]: continue
            if (y + 1 < H and not op[y + 1, x]) or (x - 1 >= 0 and not op[y, x - 1]):
                a[y, x, :3] *= (1 - amt)
    return Image.fromarray(a.astype(np.uint8))
