"""
Extract the Limitless brushstroke infinity mark from app/icon.png.

app/icon.png is the full brand lockup (mark + LIMITLESS wordmark + tagline) on
a light textured square. The site nav and footer need the *mark alone* on
transparency, so this:

  1. finds the mark band by row profile (no hardcoded crop),
  2. builds alpha from luminance with a smoothstep ramp, which keeps the
     brush's tapered edges instead of hard-clipping them,
  3. recolors to solid ink / white rather than reusing source pixels, so the
     paper texture does not come along for the ride,
  4. trims to the mark's bounding box,
  5. writes public/brand/mark-{ink,white}.{png,webp} plus a favicon source,
  6. renders public/brand/_preview.png for sign-off before anything is wired in.

Run:  python scripts/extract-logo.py
Reads app/icon.png. Writes only into public/brand/.
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "app" / "icon.png"
OUT = ROOT / "public" / "brand"

# Brand values, read from app/globals.css :root
INK = (11, 11, 10)
WHITE = (255, 255, 255)
PAGE_BG = (246, 244, 241)   # --bg
PILL_BG = (255, 255, 255)   # --surface

# Luminance ramp. BG is the paper (corners measure 230-240), FG is the darkest
# part of the brushstroke. Anything between becomes partial alpha.
BG_LUMA = 232
FG_LUMA = 45

FONT_DIR = Path("C:/Windows/Fonts")


def load_font(size, bold=True):
    for name in (("arialbd.ttf", "calibrib.ttf") if bold else ("arial.ttf", "calibri.ttf")):
        p = FONT_DIR / name
        if p.exists():
            return ImageFont.truetype(str(p), size)
    return ImageFont.load_default()


def find_mark_band(gray, threshold=140, min_px=3):
    """Return (y0, y1) of the first horizontal band of dark pixels: the mark."""
    w, h = gray.size
    px = gray.load()
    bands, start, inside = [], 0, False
    for y in range(h):
        dark = sum(1 for x in range(w) if px[x, y] < threshold)
        if dark > min_px and not inside:
            start, inside = y, True
        elif dark <= min_px and inside:
            bands.append((start, y - 1))
            inside = False
    if inside:
        bands.append((start, h - 1))
    if not bands:
        raise SystemExit("no dark bands found in icon.png")
    return bands[0]


def build_alpha(gray):
    """Luminance -> alpha with a smoothstep, so brush edges stay soft."""
    span = BG_LUMA - FG_LUMA

    def ramp(v):
        t = (BG_LUMA - v) / span
        t = 0.0 if t < 0 else 1.0 if t > 1 else t
        return int(round(255 * (t * t * (3 - 2 * t))))

    return gray.point([ramp(v) for v in range(256)])


def colorize(alpha, rgb):
    layer = Image.new("RGBA", alpha.size, rgb + (255,))
    layer.putalpha(alpha)
    return layer


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    src = Image.open(SRC).convert("RGB")
    gray = src.convert("L")

    y0, y1 = find_mark_band(gray)
    pad = 6
    band = gray.crop((0, max(0, y0 - pad), src.width, min(src.height, y1 + pad + 1)))
    print(f"mark band: y {y0}-{y1} (height {y1 - y0 + 1})")

    alpha = build_alpha(band)
    # Trim to the ink, ignoring faint paper noise.
    bbox = alpha.point(lambda v: 255 if v > 12 else 0).getbbox()
    if not bbox:
        raise SystemExit("mark alpha is empty; check BG_LUMA/FG_LUMA")
    x0, ty0, x1, ty1 = bbox
    alpha = alpha.crop((max(0, x0 - 4), max(0, ty0 - 4),
                        min(alpha.width, x1 + 4), min(alpha.height, ty1 + 4)))
    print(f"trimmed mark: {alpha.size[0]}x{alpha.size[1]}  ratio {alpha.size[0]/alpha.size[1]:.3f}")

    ink = colorize(alpha, INK)
    white = colorize(alpha, WHITE)

    for name, img in (("mark-ink", ink), ("mark-white", white)):
        img.save(OUT / f"{name}.png", optimize=True)
        img.save(OUT / f"{name}.webp", quality=92, method=6)
        print(f"  {name}.png {(OUT / f'{name}.png').stat().st_size}B"
              f"   {name}.webp {(OUT / f'{name}.webp').stat().st_size}B")

    # Favicon source: dark rounded square + white mark. A transparent dark mark
    # would vanish against a dark browser tab strip.
    fav = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    d = ImageDraw.Draw(fav)
    d.rounded_rectangle((0, 0, 511, 511), radius=96, fill=INK + (255,))
    fw = 384
    fh = max(1, round(fw * white.height / white.width))
    fav.alpha_composite(white.resize((fw, fh), Image.LANCZOS),
                        ((512 - fw) // 2, (512 - fh) // 2))
    fav.save(OUT / "favicon-src.png", optimize=True)
    print(f"  favicon-src.png {(OUT / 'favicon-src.png').stat().st_size}B")

    render_preview(ink, white)


def checkerboard(size, cell=12):
    img = Image.new("RGB", size, (255, 255, 255))
    d = ImageDraw.Draw(img)
    for y in range(0, size[1], cell):
        for x in range(0, size[0], cell):
            if (x // cell + y // cell) % 2:
                d.rectangle((x, y, x + cell - 1, y + cell - 1), fill=(222, 222, 222))
    return img


def brand_pill(mark, scale, circle=True):
    """Render the real .brand pill at `scale`x: 34px ink circle + Limitless."""
    s = scale
    pad_l, pad_r, pad_y = 9 * s, 20 * s, 8 * s
    dot = 34 * s
    gap = 10 * s
    font = load_font(round(17 * s * 1.02))
    label = "Limitless"
    tw = round(font.getlength(label))
    w = pad_l + dot + gap + tw + pad_r
    h = dot + pad_y * 2

    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((0, 0, w - 1, h - 1), radius=h // 2, fill=PILL_BG + (255,))

    if circle:
        d.ellipse((pad_l, pad_y, pad_l + dot, pad_y + dot), fill=INK + (255,))
        inner = round(20 * s)
        m = mark  # white variant expected
    else:
        inner = round(26 * s)
        m = mark  # ink variant expected

    mh = max(1, round(inner * m.height / m.width))
    resized = m.resize((inner, mh), Image.LANCZOS)
    img.alpha_composite(resized,
                        (pad_l + (dot - inner) // 2, pad_y + (dot - mh) // 2))

    bbox = d.textbbox((0, 0), label, font=font)
    d.text((pad_l + dot + gap, (h - (bbox[3] - bbox[1])) // 2 - bbox[1]),
           label, font=font, fill=INK + (255,))
    return img


def infinity_pill(scale):
    """The current nav mark: an &infin; character in the ink circle."""
    s = scale
    pad_l, pad_r, pad_y = 9 * s, 20 * s, 8 * s
    dot, gap = 34 * s, 10 * s
    font = load_font(round(17 * s * 1.02))
    glyph_font = load_font(round(25 * s))
    label = "Limitless"
    tw = round(font.getlength(label))
    w = pad_l + dot + gap + tw + pad_r
    h = dot + pad_y * 2
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((0, 0, w - 1, h - 1), radius=h // 2, fill=PILL_BG + (255,))
    d.ellipse((pad_l, pad_y, pad_l + dot, pad_y + dot), fill=INK + (255,))
    gb = d.textbbox((0, 0), "\u221e", font=glyph_font)
    d.text((pad_l + (dot - (gb[2] - gb[0])) / 2 - gb[0],
            pad_y + (dot - (gb[3] - gb[1])) / 2 - gb[1]),
           "\u221e", font=glyph_font, fill=WHITE + (255,))
    tb = d.textbbox((0, 0), label, font=font)
    d.text((pad_l + dot + gap, (h - (tb[3] - tb[1])) // 2 - tb[1]),
           label, font=font, fill=INK + (255,))
    return img


def render_preview(ink, white):
    W = 1180
    sheet = Image.new("RGB", (W, 1500), PAGE_BG)
    d = ImageDraw.Draw(sheet)
    h1 = load_font(30)
    h2 = load_font(19)
    body = load_font(15, bold=False)
    small = load_font(13, bold=False)

    y = 34
    d.text((40, y), "Limitless logo mark — extracted from app/icon.png", font=h1, fill=INK)
    y += 44
    d.text((40, y), "Pick one of the two nav treatments below. Nothing is wired in yet.",
           font=body, fill=(76, 75, 72))
    y += 46

    # --- extracted mark on checkerboard (alpha check)
    d.text((40, y), "1. The extracted mark (checkerboard = transparent)", font=h2, fill=INK)
    y += 32
    cw = 520
    ch = max(1, round(cw * ink.height / ink.width))
    board = checkerboard((cw, ch))
    board = board.convert("RGBA")
    board.alpha_composite(ink.resize((cw, ch), Image.LANCZOS))
    sheet.paste(board.convert("RGB"), (40, y))
    d.text((590, y + 10), f"{ink.width} x {ink.height} px source", font=small, fill=(76, 75, 72))
    d.text((590, y + 34), "Exported as PNG + WebP, ink and white.", font=small, fill=(76, 75, 72))
    d.text((590, y + 58), "No SVG trace: potrace/inkscape are not", font=small, fill=(144, 142, 137))
    d.text((590, y + 78), "installed, and at nav size a 2x WebP is", font=small, fill=(144, 142, 137))
    d.text((590, y + 98), "visually identical for a few KB.", font=small, fill=(144, 142, 137))
    y += ch + 50

    # --- Option A: keep the black circle, white mark inside
    d.text((40, y), "2. OPTION A — keep the black circle, white mark inside", font=h2, fill=INK)
    y += 34
    a1 = brand_pill(white, 1, circle=True)
    a3 = brand_pill(white, 3, circle=True)
    sheet.paste(a1, (40, y + (a3.height - a1.height) // 2), a1)
    d.text((40 + a1.width + 24, y + (a3.height - a1.height) // 2 + a1.height + 6),
           "actual size", font=small, fill=(144, 142, 137))
    sheet.paste(a3, (300, y), a3)
    d.text((300, y + a3.height + 8), "3x", font=small, fill=(144, 142, 137))
    y += a3.height + 56

    # --- Option B: no circle, ink mark straight on the pill
    d.text((40, y), "3. OPTION B — no circle, ink mark on the pill (more minimal)", font=h2, fill=INK)
    y += 34
    b1 = brand_pill(ink, 1, circle=False)
    b3 = brand_pill(ink, 3, circle=False)
    sheet.paste(b1, (40, y + (b3.height - b1.height) // 2), b1)
    d.text((40 + b1.width + 24, y + (b3.height - b1.height) // 2 + b1.height + 6),
           "actual size", font=small, fill=(144, 142, 137))
    sheet.paste(b3, (300, y), b3)
    d.text((300, y + b3.height + 8), "3x", font=small, fill=(144, 142, 137))
    y += b3.height + 56

    # --- what is on the site right now
    d.text((40, y), "4. WHAT IS THERE NOW — the plain infinity character", font=h2, fill=INK)
    y += 34
    c1 = infinity_pill(1)
    c3 = infinity_pill(3)
    sheet.paste(c1, (40, y + (c3.height - c1.height) // 2), c1)
    sheet.paste(c3, (300, y), c3)
    d.text((300, y + c3.height + 8),
           "3x  (preview text is Arial; the site uses Instrument Sans)",
           font=small, fill=(144, 142, 137))
    y += c3.height + 40

    sheet = sheet.crop((0, 0, W, min(y + 24, sheet.height)))
    sheet.save(OUT / "_preview.png", optimize=True)
    print(f"  _preview.png {(OUT / '_preview.png').stat().st_size}B  {sheet.size}")


if __name__ == "__main__":
    main()
