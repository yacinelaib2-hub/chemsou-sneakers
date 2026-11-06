import urllib.request
import os
import shutil
import io
import json
from PIL import Image

# 12 Curated Real Nike TN Models with Official Nike Assets
tn_models = [
    {
        "id": 1,
        "name": "Nike Air Max Plus TN Triple Black",
        "brand": "Nike",
        "category": "Sneakers",
        "gender": "Homme",
        "price": 34500,
        "old_price": 38000,
        "url_id": "u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/gjyvetexafxuetf5gej7/AIR+MAX+PLUS+%28GS%29.png",
        "colorway": "Noir / Noir Intégral",
        "description": "L'incontournable Requin Triple Black aux nervures TPU ondulées, mesh respirant et amorti Tuned Air légendaire."
    },
    {
        "id": 2,
        "name": "Nike Air Max Plus TN Tough Red Shark",
        "brand": "Nike",
        "category": "Sneakers",
        "gender": "Homme",
        "price": 36900,
        "old_price": 41000,
        "url_id": "u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/a3fe3d47-0e86-4102-b91c-ea2b4d8eba29/NIKE+AIR+MAX+PLUS.png",
        "colorway": "Tough Red / Noir / Mystic Dates",
        "description": "Le mythique dégradé Requin rouge sang et noir profond, cage TPU injectée et unité Air visible contrastée."
    },
    {
        "id": 3,
        "name": "Nike Air Max Plus TN Triple White",
        "brand": "Nike",
        "category": "Sneakers",
        "gender": "Homme",
        "price": 34500,
        "old_price": 38000,
        "url_id": "u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/9b34192e-3fc7-428b-a986-51497ba15a72/WMNS+AIR+MAX+PLUS.png",
        "colorway": "Blanc Pur / Pure Platinum",
        "description": "La silhouette Air Max Plus immaculée en blanc éclatant avec semelle Tuned Air transparente et détails réfléchissants."
    },
    {
        "id": 4,
        "name": "Nike Air Max Plus TN Dusty Cactus",
        "brand": "Nike",
        "category": "Sneakers",
        "gender": "Homme",
        "price": 36000,
        "old_price": 39500,
        "url_id": "u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/38393fb2-d3dd-436f-a43c-e52d433e9453/AIR+MAX+PLUS.png",
        "colorway": "Noir / Turquoise Dusty Cactus",
        "description": "Empeigne noire rehaussée de touches turquoise Tiffany vibrantes sur le Swoosh, les bulles d'air et la cage nervurée."
    },
    {
        "id": 5,
        "name": "Nike Air Max Plus TN Football Blue",
        "brand": "Nike",
        "category": "Sneakers",
        "gender": "Homme",
        "price": 35500,
        "old_price": 39000,
        "url_id": "u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/771838c6-3db5-4304-8bcb-d12ee5f20bd1/NIKE+AIR+MAX+PLUS.png",
        "colorway": "Bleu Football / Gris Fumée / Blanc",
        "description": "Superbe dégradé bleu ciel et gris métallisé évoquant les vagues océaniques originales dessinées par Sean McDowell."
    },
    {
        "id": 6,
        "name": "Nike Air Max Plus TN Canyon Purple & Volt",
        "brand": "Nike",
        "category": "Sneakers",
        "gender": "Homme",
        "price": 37500,
        "old_price": 42000,
        "url_id": "u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/9be085c5-d6bf-4299-b863-03d680d09f79/NIKE+AIR+MAX+PLUS.png",
        "colorway": "Canyon Purple / Electric Green / Noir",
        "description": "Coloris audacieux combinant dégradé violet profond et touches vert fluo électrique sur le mini-Swoosh et la semelle."
    },
    {
        "id": 7,
        "name": "Nike Air Max Plus TN SE Laser Crimson",
        "brand": "Nike",
        "category": "Sneakers",
        "gender": "Homme",
        "price": 38000,
        "old_price": 43000,
        "url_id": "u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/1b2663b6-239c-4c53-a5ee-a2494dd6df06/W+NIKE+AIR+MAX+PLUS+SE.png",
        "colorway": "Metallic Silver / Laser Crimson / Off Noir",
        "description": "Édition spéciale aux finitions argentées métalliques avec accents rouge vif Laser Crimson et cage thermo-collée."
    },
    {
        "id": 8,
        "name": "Nike Air Max Plus TN Chrome Yellow",
        "brand": "Nike",
        "category": "Sneakers",
        "gender": "Homme",
        "price": 36500,
        "old_price": 40000,
        "url_id": "u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/f37f06f3-2cd2-4ee2-9e0c-a9dc107f0a10/NIKE+AIR+MAX+PLUS.png",
        "colorway": "Dark Smoke Grey / Jaune Solaire / Noir",
        "description": "Teinte ténébreuse gris fumé contrastée par les emblématiques bulles d'air jaunes Tuned Air et accents solaires."
    },
    {
        "id": 9,
        "name": "Nike Air Max Plus TN Limelight Volt",
        "brand": "Nike",
        "category": "Sneakers",
        "gender": "Homme",
        "price": 35000,
        "old_price": 38500,
        "url_id": "4d8aa53d-9cc1-451f-947b-0188a28ec404/NIKE+AIR+MAX+PLUS.png",
        "colorway": "Noir / Limelight / Volt",
        "description": "Classique tige noire aux lignes fuselées avec accents lime fluo haute visibilité et amorti Tuned à quatre chambres."
    },
    {
        "id": 10,
        "name": "Nike Air Max Plus 3 TN Black & Smoke",
        "brand": "Nike",
        "category": "Sneakers",
        "gender": "Homme",
        "price": 37900,
        "old_price": 42500,
        "url_id": "u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/7e761d95-3f78-4266-9ed7-b0e04b4989e3/NIKE+AIR+MAX+PLUS+III.png",
        "colorway": "Noir / Smoke Grey / Tuned 3",
        "description": "La légendaire TN 3 avec son contrefort arrière aérodynamique futuriste en TPU et double unité Air au talon."
    },
    {
        "id": 11,
        "name": "Nike Air Max Plus 3 TN Triple White",
        "brand": "Nike",
        "category": "Sneakers",
        "gender": "Homme",
        "price": 37900,
        "old_price": 42500,
        "url_id": "u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/i1-7de41d28-c697-4595-9cc7-eea40afae99f/AIR+MAX+PLUS+III.png",
        "colorway": "Blanc Pur / Vast Grey",
        "description": "Silhouette TN 3 tout en blanc immaculé, clips talon sculptés et lettrage Tuned Air embossé."
    },
    {
        "id": 12,
        "name": "Nike Air Max Plus TN Premium Scorpion",
        "brand": "Nike",
        "category": "Sneakers",
        "gender": "Homme",
        "price": 39900,
        "old_price": 45000,
        "url_id": "u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/9339fefa-fd19-4e0b-996a-86d8afcc4e97/NIKE+AIR+MAX+PLUS+OG+PRM+1.png",
        "colorway": "Noir / Chrome / Gamma Blue",
        "description": "Édition Premium exclusive avec finitions chrome bleutées, semelle glossy et badge Tn brodé au talon."
    }
]

# Ensure output directories exist
os.makedirs("assets/products", exist_ok=True)
os.makedirs("frontend/dist/assets/products", exist_ok=True)
os.makedirs("frontend/public/assets/products", exist_ok=True)

print("--- DOWNLOADING REAL NIKE TN PICTURES ---")
for tn in tn_models:
    img_name = f"tn_{tn['id']}.png"
    target_path = os.path.join("assets", "products", img_name)
    dist_path = os.path.join("frontend", "dist", "assets", "products", img_name)
    public_path = os.path.join("frontend", "public", "assets", "products", img_name)

    nike_url = f"https://static.nike.com/a/images/t_PDP_1280_v1/{tn['url_id']}"
    print(f"Downloading TN #{tn['id']}: {tn['name']}...")
    try:
        req = urllib.request.Request(nike_url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            im = Image.open(io.BytesIO(data))
            
            # Convert to clean square 960x960
            im_resized = im.resize((960, 960), Image.Resampling.LANCZOS)
            im_resized.save(target_path, "PNG", optimize=True)
            shutil.copy(target_path, dist_path)
            shutil.copy(target_path, public_path)
            print(f" -> Successfully saved: {target_path} ({im_resized.size})")
    except Exception as e:
        print(f" -> Error downloading from {nike_url}: {e}, falling back to w_960")
        try:
            fallback_url = f"https://static.nike.com/a/images/w_960,c_limit,f_auto/{tn['url_id']}"
            req2 = urllib.request.Request(fallback_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req2, timeout=15) as resp2:
                im = Image.open(io.BytesIO(resp2.read()))
                im_resized = im.resize((960, 960), Image.Resampling.LANCZOS)
                im_resized.save(target_path, "PNG", optimize=True)
                shutil.copy(target_path, dist_path)
                shutil.copy(target_path, public_path)
                print(f" -> Fallback successful: {target_path}")
        except Exception as e2:
            print(f" -> Fallback also failed: {e2}")

# Generate SQL script to clear old products and insert Nike TN collection
sql_statements = [
    "USE sneaker_store;",
    "SET FOREIGN_KEY_CHECKS = 0;",
    "TRUNCATE TABLE product_sizes;",
    "TRUNCATE TABLE products;",
    "SET FOREIGN_KEY_CHECKS = 1;"
]

product_values = []
size_values = []

for tn in tn_models:
    img_rel = f"assets/products/tn_{tn['id']}.png"
    gallery = json.dumps([img_rel])
    desc_escaped = tn['description'].replace("'", "''")
    name_escaped = tn['name'].replace("'", "''")
    val = f"({tn['id']}, '{name_escaped}', 'Nike', 'Sneakers', 'Homme', {tn['price']}, {tn['old_price']}, '{img_rel}', '{gallery}', '{desc_escaped}', 1)"
    product_values.append(val)

    # Sizes 39 to 45
    for size in ['39', '40', '41', '42', '43', '44', '45']:
        size_values.append(f"({tn['id']}, '{size}', 6)")

sql_statements.append(
    "INSERT INTO products (id, name, brand, category, gender, price, old_price, image, gallery, description, active) VALUES\n"
    + ",\n".join(product_values) + ";"
)

sql_statements.append(
    "INSERT INTO product_sizes (product_id, size, stock) VALUES\n"
    + ",\n".join(size_values) + ";"
)

with open("setup_tns.sql", "w", encoding="utf-8") as f:
    f.write("\n\n".join(sql_statements))

print("\n--- SQL SCRIPT 'setup_tns.sql' GENERATED SUCCESSFULLY ---")

