# -*- coding: utf-8 -*-
"""Generate PassKit images (icon/logo) for the EXIT 13 Wallet pass."""
import os
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "passModel")
os.makedirs(OUT, exist_ok=True)
ACID = (204, 255, 0, 255)
VOID = (7, 7, 10, 255)

def font(sz):
    for p in ("C:/Windows/Fonts/arialbd.ttf", "C:/Windows/Fonts/arial.ttf"):
        if os.path.exists(p):
            return ImageFont.truetype(p, sz)
    return ImageFont.load_default()

def icon(size):
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    r = int(size * 0.22)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=r, fill=VOID)
    f = font(int(size * 0.5))
    t = "13"
    bb = d.textbbox((0, 0), t, font=f)
    d.text(((size - (bb[2] - bb[0])) / 2 - bb[0], (size - (bb[3] - bb[1])) / 2 - bb[1]), t, font=f, fill=ACID)
    return im

def logo(w, h):
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    f = font(int(h * 0.62))
    t = "EXIT 13"
    bb = d.textbbox((0, 0), t, font=f)
    d.text((0 - bb[0], (h - (bb[3] - bb[1])) / 2 - bb[1]), t, font=f, fill=(255, 255, 255, 255))
    return im

icon(29).save(os.path.join(OUT, "icon.png"))
icon(58).save(os.path.join(OUT, "icon@2x.png"))
icon(87).save(os.path.join(OUT, "icon@3x.png"))
logo(160, 50).save(os.path.join(OUT, "logo.png"))
logo(320, 100).save(os.path.join(OUT, "logo@2x.png"))
print("assets written to", OUT)
