"""Remaining props redrawn in the painted palette, light from the upper right."""
import numpy as np
from PIL import Image
from caretaker import RGB as BASE

C = dict(BASE)
def add(k, h): C[k] = tuple(int(h[i:i + 2], 16) for i in (1, 3, 5)) + (255,)
add('i', '#2b2236'); add('I', '#4a3e5e'); add('j', '#6b5a82')  # wrought iron
add('x', '#f2d7a8'); add('X', '#c9a77a'); add('y', '#8f7458'); add('Y', '#5e4a3c')  # cream stone
add('Q', '#7fe0ff'); add('R', '#2a7fa8')  # battery slot glow
add('B', '#9b6638'); add('D', '#c48d52')  # timber

def canvas(w, h): return np.zeros((h, w, 4), np.uint8)
def put(a, x, y, k):
    if 0 <= y < a.shape[0] and 0 <= x < a.shape[1]: a[y, x] = C[k]
def rect(a, x, y, w, h, k):
    for j in range(y, y + h):
        for i in range(x, x + w): put(a, i, j, k)
def outline(a):
    H, W = a.shape[:2]
    p = np.zeros((H + 2, W + 2, 4), np.uint8); p[1:-1, 1:-1] = a
    op = p[..., 3] > 0
    ring = (np.roll(op, 1, 0) | np.roll(op, -1, 0) | np.roll(op, 1, 1) | np.roll(op, -1, 1)) & ~op
    p[ring] = C['k']
    return Image.fromarray(p)

def lamp():
    a = canvas(16, 52)
    # base
    rect(a, 4, 47, 8, 4, 'i'); rect(a, 5, 47, 6, 1, 'I'); rect(a, 3, 50, 10, 2, 'i'); rect(a, 4, 50, 8, 1, 'I')
    # pole with a highlight on the lit side
    rect(a, 7, 16, 3, 31, 'i'); rect(a, 9, 16, 1, 31, 'I'); put(a, 9, 30, 'j'); put(a, 9, 20, 'j')
    rect(a, 6, 28, 5, 2, 'i'); rect(a, 6, 28, 5, 1, 'I')
    # curl bracket
    for (x, y) in [(10, 14), (11, 13), (12, 13), (13, 14), (13, 15), (12, 16)]: put(a, x, y, 'I')
    # lantern head
    rect(a, 4, 2, 9, 2, 'G'); rect(a, 5, 1, 7, 1, 'H'); put(a, 8, 0, 'H')
    rect(a, 4, 4, 9, 9, 'G'); rect(a, 5, 4, 7, 8, 'L'); rect(a, 6, 5, 4, 5, 'M')
    rect(a, 8, 4, 1, 8, 'G')
    rect(a, 4, 12, 9, 2, 'G'); rect(a, 5, 12, 7, 1, 'H'); put(a, 12, 5, 'H'); put(a, 12, 6, 'H')
    rect(a, 6, 14, 5, 2, 'i')
    return outline(a)

def lift(plank, w=44):
    """Lift deck: tiles the walkway texture to width w, brass rail underneath."""
    a = np.array(Image.new('RGBA', (w, 12)))
    pm = np.array(plank)
    ph = pm.shape[0]
    for x in range(0, w):
        col = pm[:, x % pm.shape[1]]
        for y in range(min(ph, 9)): a[y + 1, x] = col[y + (ph - 9) // 2] if col[y + (ph - 9) // 2][3] else C['B']
    rect(a, 0, 9, w, 3, 'G'); rect(a, 0, 9, w, 1, 'H')
    for x in (2, w - 4):
        rect(a, x, 0, 2, 2, 'H'); put(a, x, 0, 'M')
    for x in range(6, w - 6, 8): put(a, x, 10, 'L')
    return outline(a)

def socket():
    a = canvas(16, 6)
    rect(a, 0, 1, 16, 5, 'G'); rect(a, 1, 1, 14, 1, 'H'); rect(a, 4, 2, 8, 2, 'R'); rect(a, 5, 2, 6, 1, 'Q')
    put(a, 1, 3, 'L'); put(a, 14, 3, 'L')
    return outline(a)

def plinth():
    a = canvas(20, 14)
    rect(a, 0, 0, 20, 3, 'x'); rect(a, 0, 2, 20, 1, 'X'); rect(a, 1, 0, 18, 1, 'M')
    rect(a, 2, 3, 16, 8, 'X'); rect(a, 2, 3, 3, 8, 'y'); rect(a, 14, 3, 4, 8, 'x')
    for y in (5, 8): rect(a, 6, y, 7, 1, 'y')
    rect(a, 0, 11, 20, 3, 'y'); rect(a, 0, 11, 20, 1, 'X'); rect(a, 0, 13, 20, 1, 'Y')
    return outline(a)

def rail():
    """Foreground railing silhouette."""
    a = canvas(64, 30)
    rect(a, 0, 6, 64, 3, 'i'); rect(a, 0, 6, 64, 1, 'I')
    rect(a, 0, 20, 64, 2, 'i')
    for x in range(2, 64, 8):
        rect(a, x, 9, 2, 21, 'i')
        put(a, x + 1, 9, 'I')
    for x in (0, 32):
        rect(a, x, 0, 4, 30, 'i'); rect(a, x - 1, 0, 6, 3, 'i'); put(a, x + 2, 1, 'I')
    return outline(a)

def bird():
    a = canvas(14, 4)
    for i, (dx, rows) in enumerate([(0, ["k.....k", ".k...k.", "..kkk.."]), (7, [".......", "kkkkkkk", "...k..."])]):
        for y, r in enumerate(rows):
            for x, ch in enumerate(r):
                if ch == 'k': put(a, dx + x, y, 'i')
    return Image.fromarray(a)
