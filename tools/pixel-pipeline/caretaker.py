"""Hand-drawn caretaker (badger) in the painted palette: walk, look, alert, run."""
from PIL import Image
import numpy as np

P = {
    'k': '#1c1229', 'C': '#1f3a36', 'c': '#2f574d', 'h': '#4f7f6a',
    'f': '#4d3a30', 'F': '#6e5444', 'w': '#f6e4bc', 'W': '#cdb48a', 'e': '#0e080c', 'n': '#160c10', 'E': '#fff6e0',
    's': '#c23a2c', 'S': '#7e1f1f', 'r': '#e8664c',
    'T': '#1d3934', 't': '#2d5a4e', 'u': '#4b8270', 'b': '#e6ad42',
    'p': '#6e4226', 'P': '#4a2a18', 'o': '#2a1a14', 'O': '#55361f',
    'g': '#3a2418', 'L': '#ffd166', 'M': '#fff3b8', 'G': '#7a4e1e', 'H': '#d49b3a',
    'a': '#8a5630', 'A': '#57331b', 'q': '#5a3420',
}
RGB = {k: tuple(int(v[i:i + 2], 16) for i in (1, 3, 5)) + (255,) for k, v in P.items()}

HEAD = [
    "....CCCCCCC.......",
    "...CcchhhccC......",
    "..CccccccccCCCCC..",
    "..fffwwwffffF.....",
    ".fFffwwwwfffFf....",
    ".fffffwwwwwwwwW...",
    ".ffeEfffwwwwwwwwn.",
    ".fffffffwwwwwwwnn.",
    "..ffffwwwwwwwW....",
    "...fffWWwwWW......",
    "....ffffff........",
]

FW = FH = 48
BASE = 46  # boot bottom row

def put(img, x, y, ch):
    if 0 <= x < FW and 0 <= y < FH: img[y, x] = RGB[ch]

def rect(img, x, y, w, h, ch):
    for j in range(y, y + h):
        for i in range(x, x + w): put(img, i, j, ch)

def grid(img, rows, ox, oy):
    for y, r in enumerate(rows):
        for x, ch in enumerate(r):
            if ch != '.': put(img, ox + x, oy + y, ch)

def outline(img):
    op = img[..., 3] > 0
    ring = (np.roll(op, 1, 0) | np.roll(op, -1, 0) | np.roll(op, 1, 1) | np.roll(op, -1, 1)) & ~op
    img[ring] = RGB['k']
    return img

def leg(img, x, top, lift, dx, back):
    """Trouser leg + boot. back legs are drawn darker."""
    pc, ph = ('P', 'p') if back else ('p', 'a')
    bottom = BASE - lift
    for y in range(top, bottom - 2):
        t = (y - top) / max(1, bottom - 2 - top)
        xx = x + round(dx * t)
        rect(img, xx, y, 4, 1, pc); put(img, xx + (0 if back else 3), y, ph if not back else 'P')
    bx = x + dx
    rect(img, bx, bottom - 2, 6, 2, 'o'); rect(img, bx + 1, bottom - 2, 3, 1, 'O')
    put(img, bx + 5, bottom - 2, 'o')

def frame(legs, bob=0, lean=0, arm='low', swing=0, alert=False, cap_dy=0, tail=0):
    img = np.zeros((FH, FW, 4), np.uint8)
    top_leg = 34 + bob
    (b_dx, b_lift), (f_dx, f_lift) = legs
    leg(img, 17 + lean, top_leg, b_lift, b_dx, True)
    # coat
    cy = 19 + bob
    rect(img, 15 + lean, cy, 14, 16, 't')
    rect(img, 15 + lean, cy, 3, 16, 'T')
    rect(img, 26 + lean, cy + 1, 3, 15, 'T')
    rect(img, 18 + lean, cy + 1, 3, 12, 'u')
    rect(img, 14 + lean, cy + 12, 16, 4, 't'); rect(img, 14 + lean, cy + 15, 16, 1, 'T')
    for by in (cy + 4, cy + 8, cy + 12): put(img, 24 + lean, by, 'b')
    # belt
    rect(img, 15 + lean, cy + 10, 14, 1, 'q'); put(img, 22 + lean, cy + 10, 'H')
    # satchel on the back hip
    rect(img, 11 + lean, cy + 9, 6, 6, 'a'); rect(img, 11 + lean, cy + 9, 6, 2, 'A'); put(img, 13 + lean, cy + 11, 'H')
    for i in range(10): put(img, 25 - i + lean, cy + i, 'q')
    leg(img, 22 + lean, top_leg, f_lift, f_dx, False)
    # scarf with a tail that flutters behind
    rect(img, 16 + lean, cy - 2, 13, 4, 's'); rect(img, 16 + lean, cy + 1, 13, 1, 'S'); rect(img, 18 + lean, cy - 2, 6, 1, 'r')
    tx = 15 + lean
    rect(img, tx - 4, cy - 1 + tail, 5, 3, 's'); rect(img, tx - 7, cy + tail, 4, 2, 'S'); put(img, tx - 8, cy + 1 + tail, 's')
    # head
    grid(img, HEAD, 15 + lean, cy - 13 + cap_dy)
    # lantern arm
    if arm == 'low':
        rect(img, 28 + lean, cy + 2, 3, 8, 't'); rect(img, 28 + lean, cy + 2, 1, 8, 'T'); rect(img, 29 + lean, cy + 9, 3, 2, 'g')
        lx, ly = 30 + lean + swing, cy + 11
    else:
        rect(img, 28 + lean, cy + 1, 8, 3, 't'); rect(img, 28 + lean, cy + 3, 8, 1, 'T'); rect(img, 35 + lean, cy, 2, 3, 'g')
        lx, ly = 36 + lean + swing, cy + 3
    put(img, lx, ly, 'G'); rect(img, lx - 2, ly + 1, 5, 1, 'G')
    rect(img, lx - 2, ly + 2, 5, 4, 'L'); rect(img, lx - 1, ly + 3, 3, 2, 'M')
    put(img, lx - 2, ly + 2, 'H'); put(img, lx + 2, ly + 2, 'H')
    rect(img, lx - 2, ly + 6, 5, 1, 'G')
    if alert:
        rect(img, 34 + lean, cy - 20, 2, 5, 'L'); rect(img, 34 + lean, cy - 14, 2, 2, 'L')
        put(img, 33 + lean, cy - 20, 'M')
    return Image.fromarray(outline(img))

def build():
    walk_legs = [((-4, 0), (4, 1)), ((-2, 1), (2, 0)), ((0, 2), (0, 0)), ((4, 1), (-4, 0)), ((2, 0), (-2, 1)), ((0, 0), (0, 2))]
    bob = [0, -1, -1, 0, -1, -1]
    swing = [1, 1, 0, -1, -1, 0]
    tail = [0, 1, 1, 0, 1, 1]
    walk = [frame(walk_legs[i], bob[i], swing=swing[i], tail=tail[i]) for i in range(6)]
    look = [frame(((-1, 0), (1, 0)), arm='raise'), frame(((-1, 0), (1, 0)), arm='raise', bob=1, cap_dy=1)]
    alert = [frame(((-2, 0), (2, 0)), arm='raise', alert=True, bob=-1)]
    run_legs = [((-6, 0), (5, 3)), ((-1, 3), (1, 0)), ((5, 3), (-6, 0)), ((1, 0), (-1, 3))]
    run = [frame(run_legs[i], bob=(-2 if i % 2 else 0), lean=1, arm='raise', alert=True, tail=(i % 2) * 2) for i in range(4)]
    frames = walk + look + alert + run
    s = Image.new('RGBA', (FW * len(frames), FH))
    for i, f in enumerate(frames): s.alpha_composite(f, (i * FW, 0))
    anims = {'walk': [0, 5], 'look': [6, 7], 'alert': [8, 8], 'run': [9, 12]}
    return s, anims

if __name__ == '__main__':
    s, _ = build()
    bg = Image.new('RGBA', s.size, (90, 80, 110, 255)); bg.alpha_composite(s)
    bg.resize((s.width * 5, s.height * 5), Image.NEAREST).convert('RGB').save('care_new.png')
