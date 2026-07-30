"""Generates a 1024x1024 concept icon for MolaCard:
a squircle badge, a metallic memory-card glyph, and an accent 'copy' arrow.
Run once locally; output feeds `npx tauri icon` to produce the full macOS
icon set (see src-tauri/icons/README.md).
"""
from PIL import Image, ImageDraw, ImageFilter

SIZE = 1024
img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))

# ---- squircle background (macOS-style superellipse, approximated) ----
bg = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
draw = ImageDraw.Draw(bg)
radius = int(SIZE * 0.225)
top = (13, 13, 13, 255)      # matches --bg dark theme
bottom = (30, 34, 44, 255)
grad = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
for y in range(SIZE):
    t = y / SIZE
    r = int(top[0] + (bottom[0] - top[0]) * t)
    g = int(top[1] + (bottom[1] - top[1]) * t)
    b = int(top[2] + (bottom[2] - top[2]) * t)
    ImageDraw.Draw(grad).line([(0, y), (SIZE, y)], fill=(r, g, b, 255))
mask = Image.new("L", (SIZE, SIZE), 0)
ImageDraw.Draw(mask).rounded_rectangle([0, 0, SIZE, SIZE], radius=radius, fill=255)
bg = Image.composite(grad, bg, mask)
img = Image.alpha_composite(img, bg)

# ---- metallic memory card glyph ----
card_w, card_h = int(SIZE * 0.46), int(SIZE * 0.60)
cx, cy = int(SIZE * 0.42), int(SIZE * 0.52)
card = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
cd = ImageDraw.Draw(card)
x0, y0 = cx - card_w // 2, cy - card_h // 2
x1, y1 = cx + card_w // 2, cy + card_h // 2

card_grad = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
top_c = (226, 230, 236, 255)
bot_c = (150, 158, 172, 255)
for y in range(y0, y1):
    t = (y - y0) / max(1, (y1 - y0))
    r = int(top_c[0] + (bot_c[0] - top_c[0]) * t)
    g = int(top_c[1] + (bot_c[1] - top_c[1]) * t)
    b = int(top_c[2] + (bot_c[2] - top_c[2]) * t)
    ImageDraw.Draw(card_grad).line([(x0, y), (x1, y)], fill=(r, g, b, 255))

card_mask = Image.new("L", (SIZE, SIZE), 0)
cm = ImageDraw.Draw(card_mask)
notch = int(card_w * 0.28)
cm.rounded_rectangle([x0, y0, x1, y1], radius=int(SIZE * 0.045), fill=255)
# angled notch top-left corner (SD-card style)
cm.polygon([(x0, y0), (x0 + notch, y0), (x0, y0 + notch)], fill=0)

card_layer = Image.composite(card_grad, Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0)), card_mask)
img = Image.alpha_composite(img, card_layer)

# contact-pin lines near the top of the card
pins = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
pd = ImageDraw.Draw(pins)
pin_y0 = y0 + int(card_h * 0.10)
pin_y1 = pin_y0 + int(card_h * 0.10)
n_pins = 6
gap = card_w // (n_pins + 1)
for i in range(1, n_pins + 1):
    px = x0 + gap * i
    pd.rounded_rectangle(
        [px - 10, pin_y0, px + 10, pin_y1], radius=6, fill=(90, 98, 112, 255)
    )
img = Image.alpha_composite(img, pins)

# ---- ethereal copy-arrow accent (two overlapping rounded squares) ----
accent = (91, 140, 255, 255)  # matches --accent dark theme
glow = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)
ax, ay = int(SIZE * 0.66), int(SIZE * 0.62)
s1 = int(SIZE * 0.30)
s2 = int(SIZE * 0.30)
offset = int(SIZE * 0.10)

# back square (soft / translucent)
gd.rounded_rectangle(
    [ax - s1 // 2 - offset // 2, ay - s1 // 2 - offset // 2,
     ax + s1 // 2 - offset // 2, ay + s1 // 2 - offset // 2],
    radius=int(SIZE * 0.045),
    outline=(*accent[:3], 140),
    width=int(SIZE * 0.018),
)
glow = glow.filter(ImageFilter.GaussianBlur(6))
img = Image.alpha_composite(img, glow)

# front square (solid, brighter) with an arrow through it
front = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
fd = ImageDraw.Draw(front)
fx0 = ax - s2 // 2 + offset // 2
fy0 = ay - s2 // 2 + offset // 2
fx1 = ax + s2 // 2 + offset // 2
fy1 = ay + s2 // 2 + offset // 2
fd.rounded_rectangle([fx0, fy0, fx1, fy1], radius=int(SIZE * 0.05), fill=accent)

# arrow: simple chevron pointing right, in the card's light color, centered
ac = (13, 13, 13, 255)
mx, my = (fx0 + fx1) // 2, (fy0 + fy1) // 2
aw = int(s2 * 0.34)
fd.line([(mx - aw, my), (mx + aw * 0.4, my)], fill=ac, width=int(SIZE * 0.022))
fd.polygon(
    [
        (mx + aw * 0.4, my - aw * 0.55),
        (mx + aw * 0.95, my),
        (mx + aw * 0.4, my + aw * 0.55),
    ],
    fill=ac,
)
img = Image.alpha_composite(img, front)

img.save("/home/claude/molacard/design/molacard-icon-1024.png")
print("saved")
