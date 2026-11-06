<?php
// ============================================================
// CHEMSOU SNEAKERS & STREETWEAR STORE
// Files: index.php + style.css + script.js + database.sql
// ============================================================

$dbHost = getenv('DB_HOST') ?: 'localhost';
$dbName = getenv('DB_NAME') ?: 'sneaker_store';
$dbUser = getenv('DB_USER') ?: 'root';
$dbPass = getenv('DB_PASSWORD') ?: '';

$pdo = null;
$products = [];
if (session_status() !== PHP_SESSION_ACTIVE) {
    ini_set('session.use_strict_mode', '1');
    session_set_cookie_params(['httponly'=>true, 'secure'=>!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off', 'samesite'=>'Lax']);
    session_start();
}
if (empty($_SESSION['csrf_token'])) $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
$isAdmin = ($_SESSION['user_role'] ?? '') === 'admin';

try {
    $pdo = new PDO(
        "mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4",
        $dbUser,
        $dbPass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );

    $stmt = $pdo->query("SELECT * FROM products WHERE active = 1 ORDER BY id DESC");
    $products = $stmt->fetchAll();
    $sizeRows = $pdo->query("SELECT product_id, size, stock FROM product_sizes ORDER BY size")->fetchAll();
    $sizesByProduct = [];
    foreach ($sizeRows as $sizeRow) $sizesByProduct[$sizeRow['product_id']][] = $sizeRow;
    foreach ($products as &$product) {
        $product['gender'] = 'Homme';
        $product['images'] = json_decode($product['gallery'] ?: '[]', true) ?: [];
        if (!$product['images']) $product['images'] = [$product['image']];
        $product['sizes'] = $sizesByProduct[$product['id']] ?? [];
    }
    unset($product);
} catch (PDOException $e) {
    // The UI remains usable with demo data if the database is unavailable
    $products = [
        [
            "id"=>1, "name"=>"Nike Air Max Plus TN Triple Black", "brand"=>"Nike", "category"=>"Sneakers",
            "price"=>34500, "old_price"=>38000, "image"=>"assets/products/tn_1.png", "images"=>["assets/products/tn_1.png"],
            "gender"=>"Homme", "sizes"=>array_map(fn($s) => ["size"=>(string)$s, "stock"=>6], [39,40,41,42,43,44,45]),
            "description"=>"L'incontournable Requin Triple Black aux nervures TPU ondulées, mesh respirant et amorti Tuned Air légendaire."
        ],
        [
            "id"=>2, "name"=>"Nike Air Max Plus TN Tough Red Shark", "brand"=>"Nike", "category"=>"Sneakers",
            "price"=>36900, "old_price"=>41000, "image"=>"assets/products/tn_2.png", "images"=>["assets/products/tn_2.png"],
            "gender"=>"Homme", "sizes"=>array_map(fn($s) => ["size"=>(string)$s, "stock"=>6], [39,40,41,42,43,44,45]),
            "description"=>"Le mythique dégradé Requin rouge sang et noir profond, cage TPU injectée et unité Air visible contrastée."
        ],
        [
            "id"=>3, "name"=>"Nike Air Max Plus TN Triple White", "brand"=>"Nike", "category"=>"Sneakers",
            "price"=>34500, "old_price"=>38000, "image"=>"assets/products/tn_3.png", "images"=>["assets/products/tn_3.png"],
            "gender"=>"Homme", "sizes"=>array_map(fn($s) => ["size"=>(string)$s, "stock"=>6], [39,40,41,42,43,44,45]),
            "description"=>"La silhouette Air Max Plus immaculée en blanc éclatant avec semelle Tuned Air transparente et détails réfléchissants."
        ],
        [
            "id"=>4, "name"=>"Nike Air Max Plus TN Dusty Cactus", "brand"=>"Nike", "category"=>"Sneakers",
            "price"=>36000, "old_price"=>39500, "image"=>"assets/products/tn_4.png", "images"=>["assets/products/tn_4.png"],
            "gender"=>"Homme", "sizes"=>array_map(fn($s) => ["size"=>(string)$s, "stock"=>6], [39,40,41,42,43,44,45]),
            "description"=>"Empeigne noire rehaussée de touches turquoise Tiffany vibrantes sur le Swoosh, les bulles d'air et la cage nervurée."
        ],
        [
            "id"=>5, "name"=>"Nike Air Max Plus TN Football Blue", "brand"=>"Nike", "category"=>"Sneakers",
            "price"=>35500, "old_price"=>39000, "image"=>"assets/products/tn_5.png", "images"=>["assets/products/tn_5.png"],
            "gender"=>"Homme", "sizes"=>array_map(fn($s) => ["size"=>(string)$s, "stock"=>6], [39,40,41,42,43,44,45]),
            "description"=>"Superbe dégradé bleu ciel et gris métallisé évoquant les vagues océaniques originales dessinées par Sean McDowell."
        ],
        [
            "id"=>6, "name"=>"Nike Air Max Plus TN Canyon Purple & Volt", "brand"=>"Nike", "category"=>"Sneakers",
            "price"=>37500, "old_price"=>42000, "image"=>"assets/products/tn_6.png", "images"=>["assets/products/tn_6.png"],
            "gender"=>"Homme", "sizes"=>array_map(fn($s) => ["size"=>(string)$s, "stock"=>6], [39,40,41,42,43,44,45]),
            "description"=>"Coloris audacieux combinant dégradé violet profond et touches vert fluo électrique sur le mini-Swoosh et la semelle."
        ],
        [
            "id"=>7, "name"=>"Nike Air Max Plus TN SE Laser Crimson", "brand"=>"Nike", "category"=>"Sneakers",
            "price"=>38000, "old_price"=>43000, "image"=>"assets/products/tn_7.png", "images"=>["assets/products/tn_7.png"],
            "gender"=>"Homme", "sizes"=>array_map(fn($s) => ["size"=>(string)$s, "stock"=>6], [39,40,41,42,43,44,45]),
            "description"=>"Édition spéciale aux finitions argentées métalliques avec accents rouge vif Laser Crimson et cage thermo-collée."
        ],
        [
            "id"=>8, "name"=>"Nike Air Max Plus TN Chrome Yellow", "brand"=>"Nike", "category"=>"Sneakers",
            "price"=>36500, "old_price"=>40000, "image"=>"assets/products/tn_8.png", "images"=>["assets/products/tn_8.png"],
            "gender"=>"Homme", "sizes"=>array_map(fn($s) => ["size"=>(string)$s, "stock"=>6], [39,40,41,42,43,44,45]),
            "description"=>"Teinte ténébreuse gris fumé contrastée par les emblématiques bulles d'air jaunes Tuned Air et accents solaires."
        ],
        [
            "id"=>9, "name"=>"Nike Air Max Plus TN Limelight Volt", "brand"=>"Nike", "category"=>"Sneakers",
            "price"=>35000, "old_price"=>38500, "image"=>"assets/products/tn_9.png", "images"=>["assets/products/tn_9.png"],
            "gender"=>"Homme", "sizes"=>array_map(fn($s) => ["size"=>(string)$s, "stock"=>6], [39,40,41,42,43,44,45]),
            "description"=>"Classique tige noire aux lignes fuselées avec accents lime fluo haute visibilité et amorti Tuned à quatre chambres."
        ],
        [
            "id"=>10, "name"=>"Nike Air Max Plus 3 TN Black & Smoke", "brand"=>"Nike", "category"=>"Sneakers",
            "price"=>37900, "old_price"=>42500, "image"=>"assets/products/tn_10.png", "images"=>["assets/products/tn_10.png"],
            "gender"=>"Homme", "sizes"=>array_map(fn($s) => ["size"=>(string)$s, "stock"=>6], [39,40,41,42,43,44,45]),
            "description"=>"La légendaire TN 3 avec son contrefort arrière aérodynamique futuriste en TPU et double unité Air au talon."
        ],
        [
            "id"=>11, "name"=>"Nike Air Max Plus 3 TN Triple White", "brand"=>"Nike", "category"=>"Sneakers",
            "price"=>37900, "old_price"=>42500, "image"=>"assets/products/tn_11.png", "images"=>["assets/products/tn_11.png"],
            "gender"=>"Homme", "sizes"=>array_map(fn($s) => ["size"=>(string)$s, "stock"=>6], [39,40,41,42,43,44,45]),
            "description"=>"Silhouette TN 3 tout en blanc immaculé, clips talon sculptés et lettrage Tuned Air embossé."
        ],
        [
            "id"=>12, "name"=>"Nike Air Max Plus TN Premium Scorpion", "brand"=>"Nike", "category"=>"Sneakers",
            "price"=>39900, "old_price"=>45000, "image"=>"assets/products/tn_12.png", "images"=>["assets/products/tn_12.png"],
            "gender"=>"Homme", "sizes"=>array_map(fn($s) => ["size"=>(string)$s, "stock"=>6], [39,40,41,42,43,44,45]),
            "description"=>"Édition Premium exclusive avec finitions chrome bleutées, semelle glossy et badge Tn brodé au talon."
        ]
    ];
}

$brandNames = array_values(array_unique(array_filter(array_map(
    static fn(array $product): string => trim((string)($product['brand'] ?? '')),
    $products
))));
natcasesort($brandNames);
$brandNames = array_values($brandNames);

$allProductSizes = [];
foreach ($products as $p) {
    foreach (($p['sizes'] ?? []) as $sz) {
        if (!empty($sz['size'])) $allProductSizes[$sz['size']] = true;
    }
}
$clothingSizes = ['S', 'M', 'L', 'XL', 'XXL'];
$shoeSizes = array_map('strval', range(38, 46));
$allowedOrderSizes = array_unique(array_merge($shoeSizes, $clothingSizes, array_keys($allProductSizes)));

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'place_order') {
    header('Content-Type: application/json; charset=utf-8');
    try {
        if (!$pdo) throw new RuntimeException('La boutique est temporairement indisponible.');
        if (!hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'] ?? '')) throw new RuntimeException('Session expirée. Recharge la page.');
        if (empty($_SESSION['user_id']) || ($_SESSION['user_role'] ?? '') !== 'customer') throw new RuntimeException('Connecte-toi à ton compte client pour commander.');
        $customerName = trim($_POST['customer_name'] ?? '');
        $phone = trim($_POST['phone'] ?? '');
        $wilaya = trim($_POST['wilaya'] ?? '');
        $commune = trim($_POST['commune'] ?? '');
        $items = json_decode($_POST['items'] ?? '[]', true, 512, JSON_THROW_ON_ERROR);
        if ($customerName === '' || strlen($customerName) > 120 || !preg_match('/^[0-9+().\s-]{8,20}$/', $phone) || $wilaya === '' || $commune === '' || !is_array($items) || !$items) {
            throw new RuntimeException('Vérifie le nom, le téléphone, la wilaya, la commune et le panier.');
        }

        $pdo->beginTransaction();
        $total = 0;
        $orderItems = [];
        foreach ($items as $item) {
            $productId = filter_var($item['id'] ?? null, FILTER_VALIDATE_INT);
            $quantity = filter_var($item['qty'] ?? null, FILTER_VALIDATE_INT);
            $size = trim((string)($item['size'] ?? ''));
            if (!$productId || !$quantity || $quantity > 20 || !in_array($size, $allowedOrderSizes, true)) throw new RuntimeException('Un article du panier est invalide.');

            $productQuery = $pdo->prepare('SELECT name, price FROM products WHERE id = ? AND active = 1');
            $productQuery->execute([$productId]);
            $product = $productQuery->fetch();
            $stockQuery = $pdo->prepare('SELECT stock FROM product_sizes WHERE product_id = ? AND size = ? FOR UPDATE');
            $stockQuery->execute([$productId, $size]);
            $stock = $stockQuery->fetchColumn();
            if (!$product || $stock === false || (int)$stock < $quantity) throw new RuntimeException('Stock insuffisant pour ' . ($product['name'] ?? 'un article') . ', taille ' . $size . '.');

            $reserve = $pdo->prepare('UPDATE product_sizes SET stock = stock - ? WHERE product_id = ? AND size = ? AND stock >= ?');
            $reserve->execute([$quantity, $productId, $size, $quantity]);
            if ($reserve->rowCount() !== 1) throw new RuntimeException('Le stock vient de changer. Vérifie ton panier.');
            $lineTotal = (float)$product['price'] * $quantity;
            $total += $lineTotal;
            $orderItems[] = ['id'=>$productId, 'name'=>$product['name'], 'price'=>$product['price'], 'size'=>$size, 'qty'=>$quantity, 'total'=>$lineTotal];
        }

        $deliveryFee = 300;
        $total += $deliveryFee;
        $orderNumber = 'CS-' . date('ymd') . '-' . strtoupper(bin2hex(random_bytes(4)));
        $orderQuery = $pdo->prepare("INSERT INTO orders (user_id, order_number, customer_name, phone, wilaya, commune, total, delivery_fee, payment_method, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'COD', 'pending')");
        $orderQuery->execute([$_SESSION['user_id'], $orderNumber, $customerName, $phone, $wilaya, $commune, $total, $deliveryFee]);
        $orderId = (int)$pdo->lastInsertId();
        $lineQuery = $pdo->prepare('INSERT INTO order_items (order_id, product_id, product_name, size, quantity, unit_price, line_total) VALUES (?, ?, ?, ?, ?, ?, ?)');
        foreach ($orderItems as $line) $lineQuery->execute([$orderId, $line['id'], $line['name'], $line['size'], $line['qty'], $line['price'], $line['total']]);
        $pdo->commit();
        echo json_encode(['success'=>true, 'order_number'=>$orderNumber, 'wilaya'=>$wilaya, 'commune'=>$commune, 'delivery_fee'=>$deliveryFee, 'total'=>$total]);
    } catch (Throwable $e) {
        if ($pdo && $pdo->inTransaction()) $pdo->rollBack();
        http_response_code($e instanceof RuntimeException ? 422 : 500);
        echo json_encode(['success'=>false, 'message'=>$e instanceof RuntimeException ? $e->getMessage() : 'Erreur serveur. Réessaie plus tard.']);
    }
    exit;
}
?>
<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#111111">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="Chemsou Sneakers">
    <title data-i18n="siteTitle">Chemsou Sneakers | Baskets & Streetwear Algérie</title>
    <link rel="manifest" href="manifest.php?v=<?= filemtime(__DIR__ . '/manifest.webmanifest') ?>">
    <link rel="icon" href="assets/chemsou-logo.png?v=<?= filemtime(__DIR__ . '/assets/chemsou-logo.png') ?>" type="image/png">
    <link rel="apple-touch-icon" href="assets/app-icon-192.png?v=<?= filemtime(__DIR__ . '/assets/app-icon-192.png') ?>">
    <link rel="stylesheet" href="style.css?v=<?= filemtime(__DIR__ . '/style.css') ?>">
</head>
<body>

<div class="topbar">
    <div data-i18n="announcement">🔥 CHEMSOU SNEAKERS & STREETWEAR — LIVRAISON 69 WILAYAS (ORAN, ALGER...)</div>
    <div class="top-links">
        <span id="languageCode">FR</span>
        <span>DZD</span>
    </div>
</div>

<header class="header">
    <div class="header-main">
        <button class="menu-btn" id="menuButton" aria-label="Ouvrir le menu" data-i18n-aria-label="menuOpen" aria-expanded="false" aria-controls="siteSidebar">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
        <a class="logo-image" href="index.php" aria-label="Chemsou Sneakers, accueil">
            <img class="brand-mark" src="assets/chemsou-logo.png?v=<?= filemtime(__DIR__ . '/assets/chemsou-logo.png') ?>" alt="Chemsou Sneakers">
        </a>
        <div class="header-search">
            <input type="search" id="searchInput" placeholder="Rechercher une paire, un ensemble, une marque..." data-i18n-placeholder="searchPlaceholder" aria-label="Recherche" data-i18n-aria-label="search">
            <button id="clearSearch" aria-label="Effacer la recherche" data-i18n-aria-label="clearSearch">×</button>
            <button class="search-submit" id="searchToggle" aria-label="Recherche" data-i18n-aria-label="search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg></button>
        </div>
        <div class="header-tools">
            <div class="language-switch" id="languageSwitch" data-language="fr" role="group" aria-label="Choisir la langue" data-i18n-aria-label="languageSelect">
                <button class="language-option" type="button" data-language-option="fr" aria-pressed="true" aria-label="Afficher en français">FR</button>
                <button class="language-option" type="button" data-language-option="ar" aria-pressed="false" aria-label="عرض الموقع بالعربية">عربي</button>
            </div>
            <a class="header-tool store-finder" href="#contact"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg><span data-i18n="contactDelivery">Contact & livraison</span></a>
            <a class="header-tool profile-link" href="<?= $isAdmin ? 'admin.php' : 'auth.php' ?>" aria-label="<?= $isAdmin ? 'Tableau de bord admin' : (!empty($_SESSION['user_id']) ? 'Mon profil' : 'Connexion ou inscription') ?>" data-i18n-aria-label="<?= $isAdmin ? 'profileAdmin' : (!empty($_SESSION['user_id']) ? 'profileMember' : 'profileGuest') ?>">
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg>
                <span data-i18n="<?= $isAdmin ? 'profileAdmin' : (!empty($_SESSION['user_id']) ? 'profileMember' : 'profileGuest') ?>"><?= $isAdmin ? 'Tableau de bord admin' : (!empty($_SESSION['user_id']) ? 'Mon profil' : 'Connexion / Inscription') ?></span>
            </a>
            <button class="header-tool cart-button" id="cartButton" aria-label="Panier" data-i18n-aria-label="cart"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 8H6"/><circle cx="10" cy="21" r="1"/><circle cx="18" cy="21" r="1"/></svg><span data-i18n="cart">Panier</span><b id="cartCount">0</b></button>
        </div>
    </div>
    <nav class="store-nav" aria-label="Navigation boutique" data-i18n-aria-label="mainNavigation">
        <a href="#shop" data-sort-filter="new" data-i18n="newArrivals">Nouveautés</a>
        <a href="#shop" data-category-filter="Sneakers" data-i18n="sneakers">Baskets</a>
        <a href="#shop" data-category-filter="Vêtements" data-i18n="clothes">Vêtements</a>
        <a href="#brands" data-i18n="brand">Marques</a>
        <a href="#shop" data-promo-filter="true" data-i18n="promotions">Promotions</a>
    </nav>
</header>

<div class="sidebar-overlay" id="sidebarOverlay"></div>
<aside class="site-sidebar" id="siteSidebar" aria-hidden="true">
    <div class="sidebar-head">
        <img class="brand-mark" src="assets/chemsou-logo.png?v=<?= filemtime(__DIR__ . '/assets/chemsou-logo.png') ?>" alt="Chemsou Sneakers">
        <button id="sidebarClose" aria-label="Fermer le menu" data-i18n-aria-label="close">×</button>
    </div>
    <p class="sidebar-caption" data-i18n="shop">BOUTIQUE</p>
    <nav class="sidebar-links" aria-label="Navigation principale" data-i18n-aria-label="mainNavigation">
        <a href="#home" data-i18n="home">Accueil</a>
        <a href="#shop" data-category-filter="Sneakers" data-i18n="sneakers">Baskets</a>
        <a href="#shop" data-category-filter="Vêtements" data-i18n="clothes">Vêtements</a>
        <a href="#contact" data-i18n="contactDelivery">Contact & livraison</a>
    </nav>
    <div class="sidebar-useful">
        <p class="sidebar-caption" data-i18n="mySpace">MON ESPACE</p>
        <?php if ($isAdmin): ?><a href="admin.php" data-i18n="profileAdmin">Tableau de bord admin</a>
        <?php elseif (!empty($_SESSION['user_id'])): ?><a href="auth.php" data-i18n="profileMember">Mon profil</a>
        <?php else: ?><a href="auth.php" data-i18n="profileGuest">Connexion / inscription</a><?php endif; ?>
        <a href="#contact" data-i18n="helpSocial">Aide & réseaux sociaux</a>
        <?php if (!empty($_SESSION['user_id'])): ?>
            <form method="post" action="auth.php"><input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION['csrf_token']) ?>"><button type="submit" name="action" value="logout" data-i18n="logout">Se déconnecter</button></form>
        <?php endif; ?>
    </div>
</aside>

<?php
$latestSneaker = null;
foreach ($products as $p) {
    if (strtolower($p['category'] ?? '') === 'sneakers' || stripos($p['category'] ?? '', 'basket') !== false) {
        $latestSneaker = $p;
        break;
    }
}
if (!$latestSneaker && !empty($products)) {
    $latestSneaker = $products[0];
}
?>

<main>
    <section class="hero" id="home">
        <div class="hero-content">
            <p class="eyebrow" data-i18n="season">CHEMSOU SNEAKERS & STREETWEAR / 2026</p>
            <h1><span data-i18n="heroTitleFirst">CHEMSOU</span><br><span data-i18n="heroTitleSecond">SNEAKERS.</span></h1>
            <p class="hero-text" data-i18n="heroText">Baskets tendance, ensembles streetwear et nouveautés exclusives en Algérie. Livraison 69 Wilayas.</p>
            <a href="#shop" class="btn btn-dark" data-i18n="shopNow">DÉCOUVRIR LA BOUTIQUE →</a>
        </div>
        <div class="hero-shape">
            <?php if ($latestSneaker): ?>
            <div class="hero-sneaker-showcase" data-product-id="<?= (int)$latestSneaker['id'] ?>">
                <div class="showcase-badge-row">
                    <span class="showcase-live-pill"><span class="live-dot"></span> DERNIER DROP</span>
                    <span class="showcase-brand"><?= htmlspecialchars($latestSneaker['brand']) ?></span>
                </div>
                <div class="showcase-image-wrapper">
                    <img src="<?= htmlspecialchars($latestSneaker['image']) ?>" alt="<?= htmlspecialchars($latestSneaker['name']) ?>" class="showcase-sneaker-img">
                </div>
                <div class="showcase-info">
                    <span class="showcase-category">👟 <?= htmlspecialchars($latestSneaker['category']) ?> · 69 Wilayas</span>
                    <h3 class="showcase-title"><?= htmlspecialchars($latestSneaker['name']) ?></h3>
                    <div class="showcase-meta">
                        <div class="showcase-pricing">
                            <span class="showcase-price"><?= number_format((float)$latestSneaker['price'], 0, ',', ' ') ?> DA</span>
                            <?php if (!empty($latestSneaker['old_price']) && (float)$latestSneaker['old_price'] > (float)$latestSneaker['price']): ?>
                                <del class="showcase-old-price"><?= number_format((float)$latestSneaker['old_price'], 0, ',', ' ') ?> DA</del>
                            <?php endif; ?>
                        </div>
                        <button class="showcase-action-btn" type="button" data-product-trigger="<?= (int)$latestSneaker['id'] ?>">
                            <span>VOIR LA PAIRE</span>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </button>
                    </div>
                </div>
            </div>
            <?php endif; ?>
        </div>
    </section>

    <section class="brand-strip" id="brands" aria-label="Choisir une marque" data-i18n-aria-label="chooseBrand">
        <?php foreach ($brandNames as $brand): ?>
            <button class="brand-chip" type="button" data-brand-filter="<?= htmlspecialchars($brand, ENT_QUOTES, 'UTF-8') ?>" aria-pressed="false"><?= htmlspecialchars($brand, ENT_QUOTES, 'UTF-8') ?></button>
        <?php endforeach; ?>
    </section>

    <section class="shop-section" id="shop">
        <div class="section-head">
            <div>
                <p class="eyebrow" data-i18n="selection">NOTRE SÉLECTION</p>
                <h2 data-i18n="latestDrops">Nouveautés & Tendances</h2>
            </div>
            <button class="filter-mobile" id="filterToggle" data-i18n="filters">FILTRES ☰</button>
        </div>

        <div class="shop-layout">
            <aside class="filters" id="filters">
                <div class="filter-block">
                    <h3 data-i18n="category">Catégorie</h3>
                    <label><input type="radio" name="category" value="all" checked> <span data-i18n="all">Tout</span></label>
                    <label><input type="radio" name="category" value="Sneakers"> <span data-i18n="sneakers">Baskets (Sneakers)</span></label>
                    <label><input type="radio" name="category" value="Vêtements"> <span data-i18n="clothes">Vêtements & Ensembles</span></label>
                </div>

                <div class="filter-block">
                    <h3 data-i18n="brand">Marque</h3>
                    <?php foreach ($brandNames as $brand): ?>
                        <label><input type="checkbox" class="brand-filter" value="<?= htmlspecialchars($brand, ENT_QUOTES, 'UTF-8') ?>"> <?= htmlspecialchars($brand, ENT_QUOTES, 'UTF-8') ?></label>
                    <?php endforeach; ?>
                </div>

                <div class="filter-block">
                    <h3 data-i18n="gender">Genre</h3>
                    <label><input type="checkbox" class="gender-filter" value="Homme" checked> <span data-i18n="male">Homme</span></label>
                </div>

                <div class="filter-block">
                    <h3 data-i18n="size">Pointure / Taille</h3>
                    <select id="sizeFilter" class="size-filter" aria-label="Choisir une taille">
                        <option value="" data-i18n="sizeAll">Toutes les tailles</option>
                        <optgroup label="Tailles Vêtements">
                            <?php foreach (['S', 'M', 'L', 'XL', 'XXL'] as $size): ?>
                                <option value="<?= $size ?>"><?= $size ?></option>
                            <?php endforeach; ?>
                        </optgroup>
                        <optgroup label="Pointures Baskets">
                            <?php foreach (range(39, 45) as $size): ?>
                                <option value="<?= $size ?>"><?= $size ?></option>
                            <?php endforeach; ?>
                        </optgroup>
                    </select>
                </div>

                <div class="filter-block">
                    <h3 data-i18n="sortBy">Trier par</h3>
                    <select id="sortSelect">
                        <option value="new" data-i18n="sortNew">Nouveautés</option>
                        <option value="low" data-i18n="sortPriceLow">Prix : croissant</option>
                        <option value="high" data-i18n="sortPriceHigh">Prix : décroissant</option>
                        <option value="name" data-i18n="sortName">Nom A-Z</option>
                    </select>
                </div>
            </aside>

            <div class="products-area">
                <div class="result-row">
                    <span id="resultCount"><?= count($products) ?> produits</span>
                    <span class="desktop-note" data-i18n="clickDetails">Sélectionne un article pour voir les détails</span>
                </div>

                <div class="product-grid" id="productGrid">
                    <?php foreach ($products as $product): ?>
                        <article class="product-card"
                            data-id="<?= htmlspecialchars((string)$product['id']) ?>"
                            data-name="<?= htmlspecialchars(strtolower($product['name'])) ?>"
                            data-brand="<?= htmlspecialchars($product['brand']) ?>"
                            data-category="<?= htmlspecialchars($product['category']) ?>"
                            data-gender="<?= htmlspecialchars($product['gender']) ?>"
                            data-price="<?= htmlspecialchars((string)$product['price']) ?>">
                            <button class="heart" data-id="<?= $product['id'] ?>" aria-label="Ajouter aux favoris" data-i18n-aria-label="favorite">♡</button>

                            <div class="product-image" data-product-id="<?= $product['id'] ?>">
                                <?php if (!empty($product['old_price']) && $product['old_price'] > $product['price']): ?>
                                    <span class="sale-badge" data-i18n="sale">PROMO</span>
                                <?php endif; ?>
                                <img src="<?= htmlspecialchars($product['image']) ?>" alt="<?= htmlspecialchars($product['name']) ?>" loading="lazy">
                                <button class="quick-view" data-product-id="<?= $product['id'] ?>" data-i18n="quickView">APERÇU RAPIDE</button>
                            </div>

                            <div class="product-info">
                                <div class="product-meta">
                                    <span><?= htmlspecialchars($product['brand']) ?></span>
                                    <span data-category-label="<?= htmlspecialchars($product['category'], ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($product['category']) ?></span>
                                </div>
                                <h3><?= htmlspecialchars($product['name']) ?></h3>
                                <p class="product-description"><?= htmlspecialchars($product['description']) ?></p>
                                <p class="stock-label" data-i18n="<?= array_sum(array_column($product['sizes'], 'stock')) > 0 ? 'stockIn' : 'stockOut' ?>"><?= array_sum(array_column($product['sizes'], 'stock')) > 0 ? 'Disponible en stock' : 'Rupture de stock' ?></p>
                                <div class="price-line">
                                    <strong><?= number_format($product['price'], 0, ',', ' ') ?> DA</strong>
                                    <?php if (!empty($product['old_price'])): ?>
                                        <del><?= number_format($product['old_price'], 0, ',', ' ') ?> DA</del>
                                    <?php endif; ?>
                                </div>
                                <button class="add-btn" data-product-id="<?= $product['id'] ?>" data-i18n="addToCart" <?= array_sum(array_column($product['sizes'], 'stock')) < 1 ? 'disabled' : '' ?>>AJOUTER AU PANIER</button>
                            </div>
                        </article>
                    <?php endforeach; ?>
                </div>

                <div class="empty-state" id="emptyState">
                    <div>⌕</div>
                    <h3 data-i18n="noProducts">Aucun produit trouvé</h3>
                    <p data-i18n="noProductsHelp">Essaie une autre recherche ou enlève quelques filtres.</p>
                </div>
            </div>
        </div>
    </section>

    <section class="promo">
        <div>
            <p class="eyebrow" data-i18n="promoEyebrow">CHEMSOU SNEAKERS & STREETWEAR</p>
            <h2><span data-i18n="promoFirst">Ta paire et ton ensemble.</span><br><span data-i18n="promoSecond">Directement chez toi.</span></h2>
        </div>
        <a href="#shop" class="btn btn-light" data-i18n="discover">DÉCOUVRIR LE CATALOGUE →</a>
    </section>

    <section class="contact-section" id="contact">
        <div>
            <p class="eyebrow" data-i18n="needHelp">BESOIN D’AIDE ? COMMANDES & INFOS</p>
            <h2 data-i18n="contactTitle">Contacte Chemsou Sneakers</h2>
            <p data-i18n="contactText">Point de vente à Aïn El Turk (Oran) & livraison rapide dans les 69 wilayas d'Algérie. Pour réserver ta taille ou passer commande :</p>
        </div>
        <div class="contact-buttons">
            <a href="https://wa.me/213540755098" class="contact-btn" target="_blank" rel="noopener noreferrer" data-i18n="whatsapp">WhatsApp (05 40 75 50 98) →</a>
            <a href="https://www.instagram.com/chemsou_sneakers/" class="contact-btn" target="_blank" rel="noopener noreferrer" data-i18n="instagram">Instagram (@chemsou_sneakers) →</a>
            <a href="https://www.tiktok.com/@chemsou_sneakers" class="contact-btn" target="_blank" rel="noopener noreferrer">TikTok (@chemsou_sneakers) →</a>
            <a href="tel:+213540755098" class="contact-btn" data-i18n="phoneCall">Appeler le 05 40 75 50 98 →</a>
        </div>
    </section>
</main>

<footer>
    <div class="footer-main">
        <div>
            <a class="footer-logo" href="index.php" aria-label="Chemsou Sneakers">
                <img class="brand-mark" src="assets/chemsou-logo.png?v=<?= filemtime(__DIR__ . '/assets/chemsou-logo.png') ?>" alt="Chemsou Sneakers">
            </a>
            <p data-i18n="footerTagline">Boutique de baskets & streetwear de référence en Algérie. Livraison 69 Wilayas.</p>
        </div>
        <div>
            <h4 data-i18n="shop">BOUTIQUE</h4>
            <a href="#shop" data-category-filter="Sneakers" data-i18n="sneakers">Baskets</a>
            <a href="#shop" data-category-filter="Vêtements" data-i18n="clothes">Vêtements</a>
            <a href="#shop" data-sort-filter="new" data-i18n="newArrivals">Nouveautés</a>
            <a href="#shop" data-promo-filter="true" data-i18n="promotions">Promotions</a>
        </div>
        <div>
            <h4 data-i18n="information">INFORMATIONS</h4>
            <a href="#contact" data-i18n="contact">Contact & Localisation</a>
            <a href="auth.php?next=orders" data-i18n="delivery">Suivi de commande</a>
            <a href="admin.php" data-i18n="administration">Administration</a>
        </div>
        <div>
            <h4 data-i18n="follow">SUIVEZ-NOUS</h4>
            <a href="https://www.instagram.com/chemsou_sneakers/" target="_blank" rel="noopener noreferrer" data-i18n="instagram">Instagram (@chemsou_sneakers)</a>
            <a href="https://www.tiktok.com/@chemsou_sneakers" target="_blank" rel="noopener noreferrer">TikTok (@chemsou_sneakers)</a>
            <a href="https://wa.me/213540755098" target="_blank" rel="noopener noreferrer">WhatsApp (05 40 75 50 98)</a>
        </div>
    </div>
    <div class="copyright">© <?= date('Y') ?> Chemsou Sneakers. <span data-i18n="rights">Tous droits réservés.</span></div>
</footer>

<aside class="install-notice" id="installNotice" role="region" aria-labelledby="installNoticeTitle" aria-live="polite" hidden>
    <img src="assets/app-icon-192.png?v=<?= filemtime(__DIR__ . '/assets/app-icon-192.png') ?>" alt="" width="48" height="48">
    <div class="install-notice-copy">
        <h2 id="installNoticeTitle" data-i18n="installNoticeTitle">Installe Chemsou Sneakers</h2>
        <p data-i18n="installNoticeText">Retrouve la boutique facilement depuis ton écran d’accueil.</p>
    </div>
    <button class="install-notice-close" type="button" data-install-later aria-label="Plus tard" data-i18n-aria-label="installLater">×</button>
    <div class="install-notice-actions">
        <button class="install-notice-install" type="button" id="installNoticeButton" data-i18n="installNow">Installer</button>
        <button class="install-notice-later" type="button" data-install-later data-i18n="installLater">Plus tard</button>
    </div>
    <p class="install-notice-feedback" id="installNoticeFeedback" aria-live="polite" hidden></p>
</aside>

<!-- Cart drawer -->
<div class="overlay" id="overlay"></div>
<aside class="cart-drawer" id="cartDrawer">
    <div class="drawer-head">
        <h2><span data-i18n="cartTitle">Votre panier</span> <span id="drawerCount">0</span></h2>
        <button id="closeCart" aria-label="Fermer" data-i18n-aria-label="close">×</button>
    </div>
    <div class="cart-items" id="cartItems"></div>
    <div class="cart-empty" id="cartEmpty">
        <div>🛒</div>
        <p data-i18n="emptyCart">Votre panier est vide.</p>
        <button class="btn btn-dark" id="continueShopping" data-i18n="continueShopping">CONTINUER MES ACHATS</button>
    </div>
    <div class="cart-footer" id="cartFooter">
        <div><span data-i18n="total">Total</span><strong id="cartTotal">0 DA</strong></div>
        <button class="checkout-btn" id="checkoutBtn" data-i18n="checkout">COMMANDER</button>
    </div>
</aside>

<!-- Product modal -->
<div class="modal" id="productModal">
    <div class="modal-box">
        <button class="modal-close" id="modalClose" aria-label="Fermer" data-i18n-aria-label="close">×</button>
        <div class="modal-image"><img id="modalImage" src="" alt=""><div class="modal-gallery" id="modalGallery"></div></div>
        <div class="modal-content">
            <span id="modalBrand"></span>
            <h2 id="modalName"></h2>
            <p id="modalDescription"></p>
            <div class="modal-price" id="modalPrice"></div>
            <p class="modal-availability" id="modalAvailability"></p>
            <div class="size-title" data-i18n="chooseSize">Choisir une taille</div>
            <select class="size-select" id="sizes" aria-label="Choisir une taille" data-i18n-aria-label="chooseSize"></select>
            <details class="size-guide">
                <summary data-i18n="sizeGuide">Guide des tailles (Baskets & Vêtements)</summary>
                <p data-i18n="sizeGuideText">Baskets : 39 (24.5 cm) à 45 (29 cm) · Vêtements : S, M, L, XL, XXL.</p>
            </details>
            <button class="checkout-btn" id="modalAdd" data-i18n="addToCart">AJOUTER AU PANIER</button>
        </div>
    </div>
</div>

<div class="modal checkout-modal" id="checkoutModal">
    <div class="checkout-box">
        <button class="modal-close" id="checkoutClose" aria-label="Fermer" data-i18n-aria-label="close">×</button>
        <p class="eyebrow" data-i18n="cashOnDelivery">PAIEMENT À LA LIVRAISON (69 WILAYAS)</p>
        <h2 data-i18n="shippingInfo">Informations de livraison</h2>
        <form id="checkoutForm">
            <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION['csrf_token']) ?>">
            <label><span data-i18n="fullName">Nom complet</span><input name="customer_name" autocomplete="name" maxlength="120" value="<?= htmlspecialchars($_SESSION['user_name'] ?? '', ENT_QUOTES, 'UTF-8') ?>" required></label>
            <label><span data-i18n="phone">Numéro de téléphone</span><input name="phone" type="tel" autocomplete="tel" placeholder="05 / 06 / 07..." data-i18n-placeholder="phonePlaceholder" pattern="[0-9+(). -]{8,20}" value="<?= htmlspecialchars($_SESSION['user_phone'] ?? '', ENT_QUOTES, 'UTF-8') ?>" required></label>
            <div class="address-fields">
                <label><span data-i18n="province">Wilaya</span>
                    <select name="wilaya" required>
                        <option value="" data-i18n="chooseProvince">Choisir une wilaya</option>
                        <?php foreach ([
                            "01 - Adrar","02 - Chlef","03 - Laghouat","04 - Oum El Bouaghi","05 - Batna",
                            "06 - Béjaïa","07 - Biskra","08 - Béchar","09 - Blida","10 - Bouira",
                            "11 - Tamanrasset","12 - Tébessa","13 - Tlemcen","14 - Tiaret","15 - Tizi Ouzou",
                            "16 - Alger","17 - Djelfa","18 - Jijel","19 - Sétif","20 - Saïda",
                            "21 - Skikda","22 - Sidi Bel Abbès","23 - Annaba","24 - Guelma","25 - Constantine",
                            "26 - Médéa","27 - Mostaganem","28 - M'Sila","29 - Mascara","30 - Ouargla",
                            "31 - Oran","32 - El Bayadh","33 - Illizi","34 - Bordj Bou Arréridj","35 - Boumerdès",
                            "36 - El Tarf","37 - Tindouf","38 - Tissemsilt","39 - El Oued","40 - Khenchela",
                            "41 - Souk Ahras","42 - Tipaza","43 - Mila","44 - Aïn Defla","45 - Naâma",
                            "46 - Aïn Témouchent","47 - Ghardaïa","48 - Relizane","49 - Timimoun","50 - Bordj Badji Mokhtar",
                            "51 - Ouled Djellal","52 - Béni Abbès","53 - In Salah","54 - In Guezzam","55 - Touggourt",
                            "56 - Djanet","57 - El M'Ghair","58 - El Meniaa",
                            "59 - Aflou","60 - Barika","61 - El Kantara","62 - Bir El Ater","63 - El Aricha",
                            "64 - Ksar Chellala","65 - Aïn Ouessara","66 - Messaad","67 - Ksar El Boukhari",
                            "68 - Bou Saâda","69 - El Abiodh Sidi Cheikh"
                        ] as $wilaya): ?>
                            <option><?= htmlspecialchars($wilaya) ?></option>
                        <?php endforeach; ?>
                    </select>
                </label>
                <label><span data-i18n="municipality">Commune</span><input name="commune" autocomplete="address-level2" maxlength="100" required></label>
            </div>
            <section class="checkout-summary" aria-live="polite" aria-label="Récapitulatif de la commande" data-i18n-aria-label="orderSummary">
                <div><span data-i18n="itemsSubtotal">Articles</span><strong id="checkoutSubtotal">0 DA</strong></div>
                <div><span data-i18n="deliveryTo">Livraison vers</span><strong id="checkoutDestination" data-i18n="enterDestination">Saisis la wilaya et la commune</strong></div>
                <div><span data-i18n="deliveryFee">Livraison</span><strong id="checkoutDeliveryFee">—</strong></div>
                <div class="checkout-summary-total"><span data-i18n="finalTotal">Total de la commande</span><strong id="checkoutTotal">—</strong></div>
            </section>
            <p class="payment-note" data-i18n="cashNote">Paiement en espèces à la réception de votre commande.</p>
            <p id="checkoutFeedback" role="status" aria-live="polite"></p>
            <button class="checkout-btn" type="submit" data-i18n="confirmOrder">CONFIRMER LA COMMANDE</button>
        </form>
    </div>
</div>

<!-- Hidden product data for JavaScript -->
<script>
window.PRODUCTS = <?= json_encode($products, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) ?>;
window.AUTHENTICATED = <?= !empty($_SESSION['user_id']) && ($_SESSION['user_role'] ?? '') === 'customer' ? 'true' : 'false' ?>;
</script>
<script src="script.js?v=<?= filemtime(__DIR__ . '/script.js') ?>"></script>
<script>
if ('serviceWorker' in navigator) {
    const registerChemsouApp = () => {
        if (navigator.serviceWorker.controller) {
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (refreshing) return;
                refreshing = true;
                window.location.reload();
            });
        }
        navigator.serviceWorker.register('sw.js?v=<?= filemtime(__DIR__ . '/sw.js') ?>')
            .then(() => document.documentElement.dataset.appWorker = 'ready')
            .catch(error => document.documentElement.dataset.appWorkerError = error.name);
    };
    if (document.readyState === 'complete') registerChemsouApp();
    else window.addEventListener('load', registerChemsouApp, {once:true});
}
</script>
</body>
</html>
