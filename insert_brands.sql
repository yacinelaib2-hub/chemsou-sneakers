
USE sneaker_store;

-- 1. Insert new products
INSERT INTO products (id, name, brand, category, gender, price, old_price, image, gallery, description, active)
VALUES
(17, 'Lacoste Carnaby Pro Leather White/Green', 'Lacoste', 'Sneakers', 'Homme', 26500.00, 29500.00, 'assets/products/p17.png', '["assets/products/p17.png"]', 'Sneakers classiques en cuir souple blanc avec crocodile brodé vert signature et col rembourré pour un confort quotidien.', 1),
(18, 'Baskets Boss Titanium Runner Black & Gold', 'Boss', 'Sneakers', 'Homme', 36000.00, 39900.00, 'assets/products/p18.png', '["assets/products/p18.png"]', 'Baskets Boss contemporaines bi-matière mesh et cuir premium avec accents dorés métallisés et semelle amortissante légère.', 1),
(19, 'Ensemble Polo & Short Boss Luxury Gold', 'Boss', 'Vêtements', 'Homme', 27500.00, 31000.00, 'assets/products/p19.png', '["assets/products/p19.png"]', 'Ensemble streetwear chic Hugo Boss en piqué de coton mercerisé avec finitions bord-côtes contrastées et logo doré brodé.', 1),
(20, 'Corteiz Air Max 95 SP Rules The World', 'Corteiz', 'Sneakers', 'Homme', 42000.00, 46500.00, 'assets/products/p20.png', '["assets/products/p20.png"]', 'Collaboration mythique Nike x Corteiz RTW avec empeigne camouflage olive, détails Alcatraz brodés et doublure militaire.', 1),
(21, 'Tracksuit Syna World Logo Grey & Blue', 'Syna World', 'Vêtements', 'Homme', 32500.00, 36000.00, 'assets/products/p21.png', '["assets/products/p21.png"]', 'Survêtement emblématique Syna World par Central Cee en molleton lourd 450 GSM avec logo Syna en relief et cordon siglé.', 1),
(22, 'Hoodie Palm Angels Classic Track Black', 'Palm Angels', 'Vêtements', 'Homme', 29000.00, 33000.00, 'assets/products/p22.png', '["assets/products/p22.png"]', 'Sweat à capuche Palm Angels avec logo gothique blanc sur la poitrine et bandes sportives blanches sur les manches.', 1)
ON DUPLICATE KEY UPDATE 
    name=VALUES(name), brand=VALUES(brand), category=VALUES(category),
    price=VALUES(price), old_price=VALUES(old_price), image=VALUES(image),
    gallery=VALUES(gallery), description=VALUES(description), active=1;

-- 2. Insert sizes for sneakers (17, 18, 20)
DELETE FROM product_sizes WHERE product_id IN (17, 18, 19, 20, 21, 22);

INSERT INTO product_sizes (product_id, size, stock) VALUES
(17, '39', 6), (17, '40', 6), (17, '41', 6), (17, '42', 6), (17, '43', 6), (17, '44', 6), (17, '45', 6),
(18, '39', 5), (18, '40', 5), (18, '41', 5), (18, '42', 5), (18, '43', 5), (18, '44', 5), (18, '45', 5),
(20, '40', 5), (20, '41', 5), (20, '42', 5), (20, '43', 5), (20, '44', 5), (20, '45', 5),

-- Clothes sizes for 19, 21, 22
(19, 'S', 5), (19, 'M', 5), (19, 'L', 5), (19, 'XL', 5), (19, 'XXL', 5),
(21, 'S', 6), (21, 'M', 6), (21, 'L', 6), (21, 'XL', 6), (21, 'XXL', 6),
(22, 'S', 5), (22, 'M', 5), (22, 'L', 5), (22, 'XL', 5), (22, 'XXL', 5);
