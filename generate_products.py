import os
import shutil
from PIL import Image, ImageDraw, ImageFont

font_path = os.path.join(os.environ.get('WINDIR', 'C:\\Windows'), 'Fonts', 'arialbd.ttf')
font_reg = os.path.join(os.environ.get('WINDIR', 'C:\\Windows'), 'Fonts', 'arial.ttf')

try:
    font_brand = ImageFont.truetype(font_path, 34)
    font_title = ImageFont.truetype(font_path, 42)
    font_sub = ImageFont.truetype(font_reg, 26)
    font_price = ImageFont.truetype(font_path, 46)
    font_badge = ImageFont.truetype(font_path, 22)
    font_icon = ImageFont.truetype(font_path, 110)
except Exception:
    font_brand = font_title = font_sub = font_price = font_badge = font_icon = ImageFont.load_default()

items = [
    {
        "id": "p17",
        "brand": "LACOSTE",
        "category": "SNEAKERS",
        "title": "Carnaby Pro Leather",
        "subtitle": "Edition Classique White & Green",
        "price": "26 500 DA",
        "tag": "OFFICIAL LACOSTE",
        "accent": (46, 125, 50),
        "icon": "👟",
        "bg_radial": (20, 35, 25)
    },
    {
        "id": "p18",
        "brand": "BOSS",
        "category": "SNEAKERS",
        "title": "Titanium Runner Luxe",
        "subtitle": "Black & Metallic Gold Edition",
        "price": "36 000 DA",
        "tag": "LUXURY RUNNER",
        "accent": (212, 160, 23),
        "icon": "👟",
        "bg_radial": (35, 30, 15)
    },
    {
        "id": "p19",
        "brand": "BOSS",
        "category": "VÊTEMENTS",
        "title": "Ensemble Polo & Short",
        "subtitle": "Piqué de Coton · Black Gold",
        "price": "27 500 DA",
        "tag": "HUGO BOSS STREET",
        "accent": (212, 160, 23),
        "icon": "👕",
        "bg_radial": (32, 28, 20)
    },
    {
        "id": "p20",
        "brand": "CORTEIZ",
        "category": "SNEAKERS",
        "title": "Air Max 95 SP RTW",
        "subtitle": "Rules The World · Olive Khaki",
        "price": "42 000 DA",
        "tag": "CRTZ EXCLUSIVE",
        "accent": (220, 50, 50),
        "icon": "👟",
        "bg_radial": (40, 20, 20)
    },
    {
        "id": "p21",
        "brand": "SYNA WORLD",
        "category": "VÊTEMENTS",
        "title": "Tracksuit Central Cee",
        "subtitle": "Ensemble Molleton 450 GSM Grey",
        "price": "32 500 DA",
        "tag": "SYNA DROP 2026",
        "accent": (30, 144, 255),
        "icon": "⚡",
        "bg_radial": (15, 25, 40)
    },
    {
        "id": "p22",
        "brand": "PALM ANGELS",
        "category": "VÊTEMENTS",
        "title": "Hoodie Classic Track",
        "subtitle": "Gothic Logo Black & White",
        "price": "29 000 DA",
        "tag": "MILANO STREETWEAR",
        "accent": (180, 180, 180),
        "icon": "🌴",
        "bg_radial": (25, 25, 30)
    }
]

for item in items:
    w, h = 900, 900
    img = Image.new("RGB", (w, h), (14, 14, 17))
    draw = ImageDraw.Draw(img)

    # Subtle background gradient ring
    rx0, ry0 = 150, 150
    rx1, ry1 = 750, 750
    for i in range(120):
        factor = i / 120.0
        r = int(14 + (item["bg_radial"][0] - 14) * (1 - factor))
        g = int(14 + (item["bg_radial"][1] - 14) * (1 - factor))
        b = int(17 + (item["bg_radial"][2] - 17) * (1 - factor))
        draw.ellipse([rx0 + i*2.5, ry0 + i*2.5, rx1 - i*2.5, ry1 - i*2.5], outline=(r, g, b))

    # Outer border / frame
    draw.rounded_rectangle([30, 30, 870, 870], radius=24, outline=(35, 35, 42), width=3)

    # Top brand badge & tag
    draw.rounded_rectangle([60, 60, 220, 105], radius=10, fill=item["accent"])
    draw.text((80, 70), item["brand"], fill=(255, 255, 255), font=font_badge)

    draw.rounded_rectangle([660, 60, 840, 105], radius=10, outline=item["accent"], width=2)
    draw.text((680, 72), item["category"], fill=item["accent"], font=font_badge)

    # Large stylized graphic circle in center
    draw.ellipse([270, 240, 630, 600], fill=(22, 22, 28), outline=item["accent"], width=4)
    # Inner glow
    draw.ellipse([320, 290, 580, 550], fill=(28, 28, 36))

    # Center silhouette / artwork representation
    # Draw sneaker or streetwear outline
    draw.text((390, 350), item["icon"], font=font_icon, fill=(240, 240, 240))

    # Lower card info container
    draw.rounded_rectangle([60, 670, 840, 840], radius=16, fill=(20, 20, 25), outline=(45, 45, 55), width=2)

    # Tag line
    draw.text((90, 690), "🔥 " + item["tag"], fill=item["accent"], font=font_badge)

    # Title & Subtitle
    draw.text((90, 725), item["title"], fill=(255, 255, 255), font=font_title)
    draw.text((90, 785), item["subtitle"], fill=(160, 160, 175), font=font_sub)

    # Price on right
    price_bbox = draw.textbbox((0, 0), item["price"], font=font_price)
    pw = price_bbox[2] - price_bbox[0]
    draw.text((810 - pw, 735), item["price"], fill=(255, 255, 255), font=font_price)

    # Save to all target paths
    out_name = f"{item['id']}.png"
    p1 = os.path.join("assets", "products", out_name)
    p2 = os.path.join("frontend", "dist", "assets", "products", out_name)
    p3 = os.path.join("frontend", "public", "assets", "products", out_name)

    img.save(p1, "PNG")
    os.makedirs(os.path.dirname(p2), exist_ok=True)
    shutil.copy(p1, p2)
    os.makedirs(os.path.dirname(p3), exist_ok=True)
    shutil.copy(p1, p3)
    print(f"Generated {out_name} -> {p1}, {p2}, {p3}")

