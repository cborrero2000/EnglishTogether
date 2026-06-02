"""
Generate the English Together app icon.
Produces:
  assets/icon.png              1024x1024  (main icon / App Store)
  assets/adaptive-icon.png      1024x1024  (Android adaptive foreground)
  assets/splash-icon.png         512x512   (splash screen centre mark)
  assets/favicon.png              64x64    (web favicon)
"""
from PIL import Image, ImageDraw, ImageFont
import os, math

OUT = os.path.join(os.path.dirname(__file__), "..", "assets")
os.makedirs(OUT, exist_ok=True)

# ── Brand colours ────────────────────────────────────────────────────
BG        = (14, 124, 102)   # #0E7C66  primary teal-green
BG_DARK   = (10,  93,  77)   # #0A5D4D  darker ring / shadow
ACCENT    = (232, 161,  58)  # #E8A13A  warm amber
WHITE     = (255, 255, 255)
CREAM     = (244, 241, 234)  # #F4F1EA  app background


def rounded_rect_mask(size, radius):
    """Return an 'L' mask with rounded corners."""
    img = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    return img


def draw_speech_bubble(draw, cx, cy, r, fill, outline=None, lw=0):
    """Draw a rounded speech bubble centred at (cx, cy) with radius r."""
    # Main oval body
    bbox = [cx - r, cy - r * 0.85, cx + r, cy + r * 0.85]
    draw.ellipse(bbox, fill=fill)
    # Tail (small triangle pointing bottom-left)
    tail_pts = [
        (cx - r * 0.15, cy + r * 0.65),
        (cx - r * 0.55, cy + r * 1.25),
        (cx + r * 0.15, cy + r * 0.75),
    ]
    draw.polygon(tail_pts, fill=fill)
    if outline and lw:
        draw.ellipse(bbox, outline=outline, width=lw)


def make_icon(size, out_path, bg=BG, adaptive=False):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    corner = int(size * 0.22)
    pad    = int(size * 0.07)

    if not adaptive:
        # Rounded-square background
        rr = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        rrd = ImageDraw.Draw(rr)
        rrd.rounded_rectangle([0, 0, size - 1, size - 1], radius=corner, fill=bg)
        img.paste(rr, mask=rr.split()[3])
        draw = ImageDraw.Draw(img)

    # Speech bubble (white) — centred horizontally, sitting in the upper half
    cx, cy = size // 2, int(size * 0.47)
    r  = int(size * 0.255)
    draw_speech_bubble(draw, cx, cy, r, fill=WHITE)

    # Amber accent dot — top-right of bubble, clear of the text
    dr = int(size * 0.062)
    dot_x = cx + int(r * 0.68)          # further right along the bubble rim
    dot_y = cy - int(r * 0.75)          # up near the top of the bubble
    draw.ellipse([dot_x, dot_y, dot_x + dr * 2, dot_y + dr * 2], fill=ACCENT)

    # "ET" text centred in the bubble — slightly smaller so it doesn't crowd the dot
    try:
        fnt = ImageFont.truetype("arialbd.ttf", int(size * 0.25))
    except OSError:
        try:
            fnt = ImageFont.truetype("Arial Bold.ttf", int(size * 0.25))
        except OSError:
            fnt = ImageFont.load_default()

    text = "ET"
    # Get bounding box
    bbox = draw.textbbox((0, 0), text, font=fnt)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx = cx - tw // 2 - bbox[0]
    ty = cy - th // 2 - bbox[1] - int(size * 0.01)
    draw.text((tx, ty), text, font=fnt, fill=BG_DARK)

    img.save(out_path)
    print(f"  Saved {out_path}  ({size}×{size})")


print("Generating English Together icons…")
make_icon(1024, os.path.join(OUT, "icon.png"),         bg=BG)
make_icon(1024, os.path.join(OUT, "adaptive-icon.png"),bg=BG, adaptive=True)
make_icon(512,  os.path.join(OUT, "splash-icon.png"),  bg=BG)
make_icon(64,   os.path.join(OUT, "favicon.png"),      bg=BG)
print("Done.")
