-- ============================================================
-- CHEMSOU SNEAKERS & STREETWEAR DATABASE
-- NIKE AIR MAX PLUS TN EXCLUSIVE STORE
-- ============================================================

CREATE DATABASE IF NOT EXISTS sneaker_store
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE sneaker_store;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    phone VARCHAR(30) DEFAULT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('customer','admin') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS login_throttles (
    attempt_key CHAR(64) PRIMARY KEY,
    attempts TINYINT UNSIGNED NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    locked_until TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    brand VARCHAR(80) NOT NULL,
    category VARCHAR(80) NOT NULL DEFAULT 'Sneakers',
    gender VARCHAR(20) NOT NULL DEFAULT 'Homme',
    price DECIMAL(10,2) NOT NULL,
    old_price DECIMAL(10,2) DEFAULT NULL,
    image TEXT NOT NULL,
    gallery TEXT,
    description TEXT,
    active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product_sizes (
    product_id INT UNSIGNED NOT NULL,
    size VARCHAR(10) NOT NULL,
    stock INT UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (product_id, size),
    CONSTRAINT fk_product_sizes_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED DEFAULT NULL,
    order_number VARCHAR(30) NOT NULL UNIQUE,
    customer_name VARCHAR(120) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    wilaya VARCHAR(100) NOT NULL,
    commune VARCHAR(100) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    payment_method VARCHAR(20) NOT NULL DEFAULT 'COD',
    status ENUM('pending','confirmed','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    product_id INT UNSIGNED DEFAULT NULL,
    product_name VARCHAR(150) NOT NULL,
    size VARCHAR(10) NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    line_total DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- CLEAR AND INSERT REAL NIKE TN PRODUCTS
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE product_sizes;
TRUNCATE TABLE products;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO products (id, name, brand, category, gender, price, old_price, image, gallery, description, active)
VALUES
(1, 'Nike Air Max Plus TN Triple Black', 'Nike', 'Sneakers', 'Homme', 34500.00, 38000.00, 'assets/products/tn_1.png', '["assets/products/tn_1.png"]', 'L''incontournable Requin Triple Black aux nervures TPU ondulées, mesh respirant et amorti Tuned Air légendaire.', 1),
(2, 'Nike Air Max Plus TN Tough Red Shark', 'Nike', 'Sneakers', 'Homme', 36900.00, 41000.00, 'assets/products/tn_2.png', '["assets/products/tn_2.png"]', 'Le mythique dégradé Requin rouge sang et noir profond, cage TPU injectée et unité Air visible contrastée.', 1),
(3, 'Nike Air Max Plus TN Triple White', 'Nike', 'Sneakers', 'Homme', 34500.00, 38000.00, 'assets/products/tn_3.png', '["assets/products/tn_3.png"]', 'La silhouette Air Max Plus immaculée en blanc éclatant avec semelle Tuned Air transparente et détails réfléchissants.', 1),
(4, 'Nike Air Max Plus TN Dusty Cactus', 'Nike', 'Sneakers', 'Homme', 36000.00, 39500.00, 'assets/products/tn_4.png', '["assets/products/tn_4.png"]', 'Empeigne noire rehaussée de touches turquoise Tiffany vibrantes sur le Swoosh, les bulles d''air et la cage nervurée.', 1),
(5, 'Nike Air Max Plus TN Football Blue', 'Nike', 'Sneakers', 'Homme', 35500.00, 39000.00, 'assets/products/tn_5.png', '["assets/products/tn_5.png"]', 'Superbe dégradé bleu ciel et gris métallisé évoquant les vagues océaniques originales dessinées par Sean McDowell.', 1),
(6, 'Nike Air Max Plus TN Canyon Purple & Volt', 'Nike', 'Sneakers', 'Homme', 37500.00, 42000.00, 'assets/products/tn_6.png', '["assets/products/tn_6.png"]', 'Coloris audacieux combinant dégradé violet profond et touches vert fluo électrique sur le mini-Swoosh et la semelle.', 1),
(7, 'Nike Air Max Plus TN SE Laser Crimson', 'Nike', 'Sneakers', 'Homme', 38000.00, 43000.00, 'assets/products/tn_7.png', '["assets/products/tn_7.png"]', 'Édition spéciale aux finitions argentées métalliques avec accents rouge vif Laser Crimson et cage thermo-collée.', 1),
(8, 'Nike Air Max Plus TN Chrome Yellow', 'Nike', 'Sneakers', 'Homme', 36500.00, 40000.00, 'assets/products/tn_8.png', '["assets/products/tn_8.png"]', 'Teinte ténébreuse gris fumé contrastée par les emblématiques bulles d''air jaunes Tuned Air et accents solaires.', 1),
(9, 'Nike Air Max Plus TN Limelight Volt', 'Nike', 'Sneakers', 'Homme', 35000.00, 38500.00, 'assets/products/tn_9.png', '["assets/products/tn_9.png"]', 'Classique tige noire aux lignes fuselées avec accents lime fluo haute visibilité et amorti Tuned à quatre chambres.', 1),
(10, 'Nike Air Max Plus 3 TN Black & Smoke', 'Nike', 'Sneakers', 'Homme', 37900.00, 42500.00, 'assets/products/tn_10.png', '["assets/products/tn_10.png"]', 'La légendaire TN 3 avec son contrefort arrière aérodynamique futuriste en TPU et double unité Air au talon.', 1),
(11, 'Nike Air Max Plus 3 TN Triple White', 'Nike', 'Sneakers', 'Homme', 37900.00, 42500.00, 'assets/products/tn_11.png', '["assets/products/tn_11.png"]', 'Silhouette TN 3 tout en blanc immaculé, clips talon sculptés et lettrage Tuned Air embossé.', 1),
(12, 'Nike Air Max Plus TN Premium Scorpion', 'Nike', 'Sneakers', 'Homme', 39900.00, 45000.00, 'assets/products/tn_12.png', '["assets/products/tn_12.png"]', 'Édition Premium exclusive avec finitions chrome bleutées, semelle glossy et badge Tn brodé au talon.', 1);

-- SIZES 39 to 45 for each TN
INSERT INTO product_sizes (product_id, size, stock)
SELECT p.id, s.size, 6
FROM products p
CROSS JOIN (
    SELECT '39' AS size UNION ALL SELECT '40' UNION ALL SELECT '41'
    UNION ALL SELECT '42' UNION ALL SELECT '43' UNION ALL SELECT '44' UNION ALL SELECT '45'
) s;
