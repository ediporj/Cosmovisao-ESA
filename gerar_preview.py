import math, os

TAU = math.pi * 2
CORNER = ['Alfa', 'Beta', 'Gama']
ARCS   = ['αβ', 'βγ', 'αγ']  # αβ βγ αγ
SUB    = ['₁', '₂']  # ₁ ₂

def circ(i, n):
    a = math.pi/2 - (i/n)*TAU
    return (math.cos(a), -math.sin(a))

def gen_label(k, i):
    ss = 2**k
    sec = i // ss
    pos = i % ss
    if pos == 0:
        return CORNER[sec]
    base = ARCS[sec]
    label, lo, hi = base, 0, ss
    while hi - lo > 1:
        mid = (lo + hi) // 2
        if   pos < mid: label += SUB[0]; hi = mid
        elif pos > mid: label += SUB[1]; lo = mid
        else: break
    return label

def point_gen(i, k):
    if i == 0: return 0
    n = 3*(2**k)
    for g in range(k+1):
        step = n//(3*(2**g))
        prev = float('inf') if g==0 else n//(3*(2**(g-1)))
        if i % step == 0 and i % prev != 0: return g
    return k

def build(k):
    n = 3*(2**k)
    return [(circ(i,n), point_gen(i,k), gen_label(k,i)) for i in range(n)]

FONT_SZ = [0.115, 0.086, 0.070, 0.054, 0.042, 0.033]
DOT_R   = [0.044, 0.031, 0.023, 0.017, 0.012, 0.009]
DOT_CLR = ['#ffffff','#90c8ff','#5aaeff','#3a8fdd','#2868cc','#1a55aa']
LBL_D   = 1.20
MAX_K   = 5
DUR     = 24.0  # total cycle seconds
FADE    = 0.5

# (visible_start, visible_end) in seconds within the DUR cycle
WINDOWS = [
    (0.0,  2.5),   # gen 0
    (3.2,  5.7),   # gen 1
    (6.4,  8.9),   # gen 2
    (9.6, 11.1),   # gen 3
    (11.8, 13.1),  # gen 4
    (13.8, 15.1),  # gen 5
    (15.8, 21.0),  # circle
]

CAPTS = [
    'Triângulo base: Alfa, Beta, Gama',
    'Hexágono: αβ, βγ, αγ',
    'Dodécagono: αβ₁, αβ₂, ...',
    '24 vértices',
    '48 vértices',
    '96 vértices',
    'O círculo se forma',
]

def animate(win_idx):
    s, e = WINDOWS[win_idx]
    fi0, fi1 = s/DUR, min((s+FADE)/DUR, 1.0)
    fo0, fo1 = e/DUR, min((e+FADE)/DUR, 1.0)
    if fi0 > 0:
        kts  = f"0;{fi0:.4f};{fi1:.4f};{fo0:.4f};{fo1:.4f};1"
        vals = "0;0;1;1;0;0"
    else:
        kts  = f"0;{fi1:.4f};{fo0:.4f};{fo1:.4f};1"
        vals = "1;1;1;0;0"
    return (f'<animate attributeName="opacity" values="{vals}" '
            f'keyTimes="{kts}" dur="{DUR}s" repeatCount="indefinite"/>')

lines = []
lines.append('<?xml version="1.0" encoding="UTF-8"?>')
lines.append('<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1.65 -1.65 3.3 3.3">')
lines.append('<rect x="-1.65" y="-1.65" width="3.3" height="3.3" fill="#0c0c15"/>')
lines.append('<circle cx="0" cy="0" r="1" fill="none" stroke="#fff" '
             'stroke-width="0.013" opacity="0.18"/>')
lines.append('<text x="0" y="0.08" text-anchor="middle" dominant-baseline="middle" '
             'font-size="0.11" font-weight="700" fill="#fff" opacity="0.28" '
             'letter-spacing="0.03em" '
             'font-family="ui-sans-serif,Arial">Cosmovisão ESA</text>')

# Polygon generations
for k in range(MAX_K+1):
    pts = build(k)
    n   = len(pts)
    lines.append(f'<g opacity="0">')
    lines.append('  ' + animate(k))
    # polygon
    pp = ' '.join(f'{p[0][0]:.5f},{p[0][1]:.5f}' for p in pts)
    lines.append(f'  <polygon points="{pp}" fill="rgba(255,255,255,0.05)" '
                 f'stroke="#fff" stroke-width="0.024" '
                 f'stroke-linejoin="round" stroke-linecap="round"/>')
    # orange arcs
    for i in range(n):
        x1,y1 = pts[i][0]
        x2,y2 = pts[(i+1)%n][0]
        lines.append(f'  <path d="M {x1:.5f},{y1:.5f} A 1 1 0 0 1 {x2:.5f},{y2:.5f}" '
                     f'fill="none" stroke="#ffaa44" stroke-width="0.030"/>')
    # dots
    for (x,y), g, _ in pts:
        gr = min(g, len(DOT_R)-1)
        lines.append(f'  <circle cx="{x:.5f}" cy="{y:.5f}" r="{DOT_R[gr]}" '
                     f'fill="{DOT_CLR[gr]}"/>')
    # labels
    for idx, ((x,y), g, label) in enumerate(pts):
        fs = FONT_SZ[min(g, len(FONT_SZ)-1)]
        if not fs: continue
        a  = math.pi/2 - (idx/n)*TAU
        lx = math.cos(a)*LBL_D
        ly = -math.sin(a)*LBL_D
        fill = DOT_CLR[min(g, len(DOT_CLR)-1)]
        lines.append(f'  <text x="{lx:.5f}" y="{ly:.5f}" text-anchor="middle" '
                     f'dominant-baseline="middle" font-size="{fs:.4f}" '
                     f'fill="{fill}" '
                     f'font-family="ui-sans-serif,Arial">{label}</text>')
    # caption
    lines.append(f'  <text x="0" y="1.52" text-anchor="middle" font-size="0.075" '
                 f'fill="#fff" opacity="0.55" '
                 f'font-family="ui-sans-serif,Arial">{CAPTS[k]}</text>')
    lines.append('</g>')

# Final circle group
lines.append('<g opacity="0">')
lines.append('  ' + animate(MAX_K+1))
lines.append('  <circle cx="0" cy="0" r="1" fill="none" stroke="#fff" '
             'stroke-width="0.022" opacity="0.85"/>')
lines.append(f'  <text x="0" y="1.52" text-anchor="middle" font-size="0.075" '
             f'fill="#fff" opacity="0.55" '
             f'font-family="ui-sans-serif,Arial">{CAPTS[MAX_K+1]}</text>')
lines.append('</g>')

lines.append('</svg>')

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'preview.svg')
with open(out, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))
print(f'Gerado: {out}')
