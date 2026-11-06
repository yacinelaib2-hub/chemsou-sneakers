<?php
declare(strict_types=1);

ini_set('session.use_strict_mode', '1');
header('Cache-Control: no-store, private');
session_set_cookie_params(['httponly'=>true, 'secure'=>!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off', 'samesite'=>'Lax']);
session_start();
if (empty($_SESSION['csrf_token'])) $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
if (empty($_SESSION['user_id'])) {
    header('Location: auth.php?next=admin');
    exit;
}

$dbError = false;
$message = '';
$pdo = null;
$categories = ['Sneakers','Vêtements','Accessoires','Sport'];
$shoeSizes = range(35, 49);
$allowedShoeSizes = array_map('strval', $shoeSizes);

try {
    $pdo = new PDO(
        'mysql:host=' . (getenv('DB_HOST') ?: 'localhost') . ';dbname=' . (getenv('DB_NAME') ?: 'sneaker_store') . ';charset=utf8mb4',
        getenv('DB_USER') ?: 'root',
        getenv('DB_PASSWORD') ?: '',
        [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]
    );
} catch (PDOException $e) {
    $dbError = true;
}

if ($pdo) {
    $roleCheck = $pdo->prepare('SELECT role FROM users WHERE id = ?');
    $roleCheck->execute([$_SESSION['user_id']]);
    if ($roleCheck->fetchColumn() !== 'admin') {
        header('Location: index.php');
        exit;
    }
    $_SESSION['user_role'] = 'admin';
} elseif (($_SESSION['user_role'] ?? '') !== 'admin') {
    header('Location: index.php');
    exit;
}

$existingBrands = $pdo
    ? $pdo->query("SELECT DISTINCT brand FROM products WHERE TRIM(brand) <> '' ORDER BY brand")->fetchAll(PDO::FETCH_COLUMN)
    : [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'] ?? '')) {
        $message = 'Session expirée. Recharge la page.';
    } elseif ($pdo) {
        try {
            if (isset($_POST['save_product'])) {
                $name = trim($_POST['name'] ?? '');
                $brandChoice = trim($_POST['brand'] ?? '');
                $brand = $brandChoice === '__create_new_brand__' ? trim($_POST['new_brand'] ?? '') : $brandChoice;
                $category = trim($_POST['category'] ?? 'Sneakers');
                $gender = trim($_POST['gender'] ?? 'Homme');
                $price = filter_var($_POST['price'] ?? null, FILTER_VALIDATE_FLOAT);
                $oldPriceInput = trim((string)($_POST['old_price'] ?? ''));
                $oldPrice = $oldPriceInput === '' ? null : filter_var($oldPriceInput, FILTER_VALIDATE_FLOAT);
                $description = trim($_POST['description'] ?? '');
                if ($name === '' || strlen($name) > 150 || strlen($brand) > 80 || $brand === '' || ($brandChoice !== '__create_new_brand__' && !in_array($brandChoice, $existingBrands, true)) || !in_array($category, $categories, true) || $gender !== 'Homme' || !$price || $price <= 0 || $oldPrice === false || ($oldPrice !== null && $oldPrice <= $price) || $description === '') {
                    throw new RuntimeException('Vérifie le nom, la marque, le genre, le prix et la description.');
                }

                $uploadDir = __DIR__ . '/assets/product-uploads';
                if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) throw new RuntimeException('Impossible de préparer le stockage des images.');
                $storeImage = static function (array $file) use ($uploadDir): string {
                    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || ($file['size'] ?? 0) > 5 * 1024 * 1024) throw new RuntimeException('Chaque image doit peser moins de 5 Mo.');
                    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
                    $extensions = ['image/jpeg'=>'jpg','image/png'=>'png','image/webp'=>'webp'];
                    if (!isset($extensions[$mime])) throw new RuntimeException('Format accepté : JPG, PNG ou WebP.');
                    $filename = bin2hex(random_bytes(16)) . '.' . $extensions[$mime];
                    $targetPath = $uploadDir . "/" . $filename;
                    if (!move_uploaded_file($file["tmp_name"], $targetPath)) throw new RuntimeException("Erreur de transfert de fichier.");
                    $pythonScript = __DIR__ . "/feather_image.py";
                    if (file_exists($pythonScript)) { @shell_exec("python " . escapeshellarg($pythonScript) . " " . escapeshellarg($targetPath)); }
                    return 'assets/product-uploads/' . $filename;
                };
                $mainImage = $_FILES['image'] ?? null;
                if (!$mainImage || ($mainImage['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) throw new RuntimeException('Ajoute une photo principale.');
                $gallery = [$storeImage($mainImage)];
                $extraImages = $_FILES['gallery'] ?? null;
                if ($extraImages && is_array($extraImages['name'] ?? null)) {
                    foreach ($extraImages['name'] as $index => $unusedName) {
                        if (($extraImages['error'][$index] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) continue;
                        if (count($gallery) >= 6) throw new RuntimeException('Maximum 6 photos par article.');
                        $gallery[] = $storeImage([
                            'name'=>$extraImages['name'][$index],
                            'type'=>$extraImages['type'][$index],
                            'tmp_name'=>$extraImages['tmp_name'][$index],
                            'error'=>$extraImages['error'][$index],
                            'size'=>$extraImages['size'][$index]
                        ]);
                    }
                }

                $pdo->beginTransaction();
                $create = $pdo->prepare('INSERT INTO products (name, brand, category, gender, price, old_price, image, gallery, description, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)');
                $create->execute([$name, $brand, $category, $gender, $price, $oldPrice, $gallery[0], json_encode($gallery, JSON_UNESCAPED_SLASHES), $description]);
                $productId = (int)$pdo->lastInsertId();
                $stockInput = $_POST['new_stock'] ?? [];
                $stockInsert = $pdo->prepare('INSERT INTO product_sizes (product_id, size, stock) VALUES (?, ?, ?)');
                foreach ($shoeSizes as $size) {
                    $quantity = filter_var($stockInput[$size] ?? 0, FILTER_VALIDATE_INT);
                    if ($quantity === false || $quantity < 0 || $quantity > 9999) throw new RuntimeException('Le stock par pointure doit être compris entre 0 et 9 999.');
                    $stockInsert->execute([$productId, $size, $quantity]);
                }
                $pdo->commit();
                $message = 'Article ajouté avec ses photos et son stock.';
            } elseif (isset($_POST['update_product'])) {
                $productId = filter_var($_POST['product_id'] ?? null, FILTER_VALIDATE_INT);
                $name = trim($_POST['name'] ?? '');
                $brand = trim($_POST['brand'] ?? '');
                $category = trim($_POST['category'] ?? '');
                $gender = trim($_POST['gender'] ?? '');
                $price = filter_var($_POST['price'] ?? null, FILTER_VALIDATE_FLOAT);
                $oldPriceInput = trim((string)($_POST['old_price'] ?? ''));
                $oldPrice = $oldPriceInput === '' ? null : filter_var($oldPriceInput, FILTER_VALIDATE_FLOAT);
                $description = trim($_POST['description'] ?? '');
                if (!$productId || $name === '' || strlen($name) > 150 || strlen($brand) > 80 || $brand === '' || !in_array($category, $categories, true) || $gender !== 'Homme' || $price === false || $price <= 0 || $oldPrice === false) {
                    throw new RuntimeException('Vérifie les informations du produit et ses prix.');
                }
                $promotionRemoved = $oldPrice !== null && $oldPrice <= $price;
                if ($promotionRemoved) $oldPrice = null;

                $stockInput = $_POST['stock'][$productId] ?? [];
                if (!is_array($stockInput)) throw new RuntimeException('Stock invalide.');
                $stockValues = [];
                foreach ($shoeSizes as $size) {
                    $quantity = filter_var($stockInput[$size] ?? 0, FILTER_VALIDATE_INT);
                    if ($quantity === false || $quantity < 0 || $quantity > 9999) throw new RuntimeException('Le stock par pointure doit être compris entre 0 et 9 999.');
                    $stockValues[$size] = $quantity;
                }

                $pdo->beginTransaction();
                $updateProduct = $pdo->prepare('UPDATE products SET name = ?, brand = ?, category = ?, gender = ?, price = ?, old_price = ?, description = ?, active = ? WHERE id = ?');
                $updateProduct->execute([$name, $brand, $category, $gender, $price, $oldPrice, $description, isset($_POST['active']) ? 1 : 0, $productId]);
                $updateStock = $pdo->prepare('INSERT INTO product_sizes (product_id, size, stock) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE stock = VALUES(stock)');
                foreach ($stockValues as $size => $quantity) $updateStock->execute([$productId, $size, $quantity]);
                $pdo->commit();
                $message = $promotionRemoved
                    ? 'Prix normal restauré, promotion supprimée et stock mis à jour.'
                    : 'Produit, promotion et stock mis à jour.';
            } elseif (isset($_POST['save_stock'])) {
                $pdo->beginTransaction();
                $stockQuery = $pdo->prepare('INSERT INTO product_sizes (product_id, size, stock) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE stock = VALUES(stock)');
                foreach (($_POST['stock'] ?? []) as $productId => $sizes) {
                    $productId = filter_var($productId, FILTER_VALIDATE_INT);
                    if (!$productId || !is_array($sizes)) continue;
                    foreach ($sizes as $size => $quantity) {
                        $quantity = filter_var($quantity, FILTER_VALIDATE_INT);
                        if (!in_array((string)$size, $allowedShoeSizes, true) || $quantity === false || $quantity < 0 || $quantity > 9999) continue;
                        $stockQuery->execute([$productId, $size, $quantity]);
                    }
                }
                $pdo->commit();
                $message = 'Stock mis à jour.';
            } elseif (isset($_POST['update_order'])) {
                $orderId = filter_var($_POST['order_id'] ?? null, FILTER_VALIDATE_INT);
                $newStatus = (string)($_POST['status'] ?? '');
                $allowedStatuses = ['pending','confirmed','shipped','delivered','cancelled'];
                if (!$orderId || !in_array($newStatus, $allowedStatuses, true)) throw new RuntimeException('Mise à jour de commande invalide.');

                $pdo->beginTransaction();
                $orderQuery = $pdo->prepare('SELECT status FROM orders WHERE id = ? FOR UPDATE');
                $orderQuery->execute([$orderId]);
                $oldStatus = $orderQuery->fetchColumn();
                $validTransitions = [
                    'pending'=>['confirmed','cancelled'],
                    'confirmed'=>['shipped','cancelled'],
                    'shipped'=>['delivered'],
                    'delivered'=>[],
                    'cancelled'=>[]
                ];
                if (!$oldStatus || !in_array($newStatus, $validTransitions[$oldStatus] ?? [], true)) throw new RuntimeException('Cette transition de commande n’est pas autorisée.');

                if ($newStatus === 'cancelled') {
                    $lines = $pdo->prepare('SELECT product_id, size, quantity FROM order_items WHERE order_id = ? AND product_id IS NOT NULL');
                    $lines->execute([$orderId]);
                    $restore = $pdo->prepare('UPDATE product_sizes SET stock = stock + ? WHERE product_id = ? AND size = ?');
                    foreach ($lines->fetchAll() as $line) $restore->execute([$line['quantity'], $line['product_id'], $line['size']]);
                }
                $update = $pdo->prepare('UPDATE orders SET status = ? WHERE id = ?');
                $update->execute([$newStatus, $orderId]);
                $pdo->commit();
                $message = 'Commande mise à jour.';
            }
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            $message = $e instanceof RuntimeException ? $e->getMessage() : 'Erreur pendant la mise à jour.';
        }
    }
}

$authenticated = ($_SESSION['user_role'] ?? '') === 'admin';
$products = [];
$orders = [];
if ($authenticated && $pdo && !$dbError) {
    $products = $pdo->query('SELECT p.id, p.name, p.brand, p.category, p.gender, p.price, p.old_price, p.active, p.image, p.description, ps.size, ps.stock FROM products p LEFT JOIN product_sizes ps ON ps.product_id = p.id ORDER BY p.name, ps.size')->fetchAll();
    $stockProducts = [];
    foreach ($products as $row) {
        $productId = (int)$row['id'];
        if (!isset($stockProducts[$productId])) {
            $stockProducts[$productId] = [
                'id'=>$productId,
                'name'=>$row['name'],
                'brand'=>$row['brand'],
                'category'=>$row['category'],
                'gender'=>'Homme',
                'price'=>$row['price'],
                'old_price'=>$row['old_price'],
                'active'=>(int)$row['active'],
                'image'=>$row['image'],
                'description'=>$row['description'],
                'sizes'=>[]
            ];
        }
        if ($row['size'] !== null) $stockProducts[$productId]['sizes'][$row['size']] = (int)$row['stock'];
    }
    $orderRows = $pdo->query('SELECT * FROM orders ORDER BY created_at DESC')->fetchAll();
    $lineQuery = $pdo->prepare('SELECT product_name, size, quantity, unit_price, line_total FROM order_items WHERE order_id = ?');
    foreach ($orderRows as $order) {
        $lineQuery->execute([$order['id']]);
        $order['items'] = $lineQuery->fetchAll();
        $orders[] = $order;
    }
}

function h($value): string { return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8'); }
$statusLabels = ['pending'=>'À confirmer','confirmed'=>'Confirmée','shipped'=>'Expédiée','delivered'=>'Livrée','cancelled'=>'Annulée'];
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#111111">
    <title>Administration | Chemsou Sneakers</title>
    <link rel="stylesheet" href="style.css?v=<?= filemtime(__DIR__ . '/style.css') ?>">
</head>
<body class="admin-page">
<header class="admin-header">
    <a class="admin-brand" href="index.php" aria-label="Chemsou Sneakers, accueil"><img class="brand-mark" src="assets/chemsou-logo.png?v=<?= filemtime(__DIR__ . '/assets/chemsou-logo.png') ?>" alt="Chemsou Sneakers"></a>
    <nav class="admin-header-actions" aria-label="Actions administrateur">
        <a class="admin-header-button admin-return" href="index.php"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5-7 7 7 7M7 12h14"/></svg><span>Retour à la boutique</span></a>
        <form method="post" action="auth.php"><input type="hidden" name="csrf_token" value="<?= h($_SESSION['csrf_token']) ?>"><button class="admin-header-button admin-logout" type="submit" name="action" value="logout"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 17l5-5-5-5m5 5H3"/><path d="M12 3h8v18h-8"/></svg><span>Déconnexion</span></button></form>
    </nav>
</header>
<main class="admin-main">
    <?php if ($authenticated): ?>
        <div class="admin-title"><div><p class="eyebrow">GESTION DE LA BOUTIQUE</p><h1>Commandes & stock</h1></div></div>
        <?php if ($dbError): ?><p class="admin-notice">Connexion à la base de données impossible.</p><?php endif; ?>
        <?php if ($message): ?><p class="admin-message" role="status"><?= h($message) ?></p><?php endif; ?>

        <section class="admin-section">
            <h2>Ajouter un article</h2>
            <form class="admin-product-form" method="post" enctype="multipart/form-data">
                <input type="hidden" name="csrf_token" value="<?= h($_SESSION['csrf_token']) ?>">
                <div class="admin-form-grid">
                    <label>Nom<input name="name" maxlength="150" required></label>
                    <label>Marque
                        <select id="newProductBrand" name="brand" required>
                            <option value="" selected disabled>Choisir une marque</option>
                            <?php foreach ($existingBrands as $brandOption): ?>
                                <option value="<?= h($brandOption) ?>"><?= h($brandOption) ?></option>
                            <?php endforeach; ?>
                            <option value="__create_new_brand__">Nouvelle marque</option>
                        </select>
                    </label>
                    <label id="newBrandField" hidden>Nouvelle marque<input id="newProductBrandName" name="new_brand" maxlength="80"></label>
                    <label>Catégorie<select name="category"><?php foreach ($categories as $category): ?><option value="<?= h($category) ?>"><?= h($category) ?></option><?php endforeach; ?></select></label>
                    <input type="hidden" name="gender" value="Homme">
                    <label>Prix actuel (DA)<input type="number" name="price" min="1" step="1" required></label>
                    <label>Prix précédent (DA), facultatif<input type="number" name="old_price" min="1" step="1"></label>
                    <label>Photo principale<input type="file" name="image" id="adminMainImageInput" accept="image/jpeg,image/png,image/webp" required></label>
                    <div id="adminMainImagePreview" style="display:none; align-items:center; gap:14px; padding:12px; background:#f9f9f9; border:1px dashed #ccc; border-radius:10px; margin-top:8px;">
                        <img id="adminPreviewImg" src="" alt="Apercu" style="width:72px; height:72px; object-fit:contain; background:#fff; border-radius:12px; mix-blend-mode:multiply; mask-image:radial-gradient(ellipse 85% 80% at 50% 50%, #000 45%, rgba(0,0,0,0.6) 70%, transparent 92%); -webkit-mask-image:radial-gradient(ellipse 85% 80% at 50% 50%, #000 45%, rgba(0,0,0,0.6) 70%, transparent 92%); filter:drop-shadow(0 4px 8px rgba(0,0,0,0.12));">
                        <div>
                            <strong style="font-size:12px; color:#111; display:block;">Apercu du rendu automatique (bords floutes)</strong>
                            <span style="font-size:11px; color:#666;">Effet flou sur les bords applique automatiquement</span>
                        </div>
                    </div>
                    <label class="admin-form-wide">Photos supplémentaires (6 au total maximum)<input type="file" name="gallery[]" accept="image/jpeg,image/png,image/webp" multiple></label>
                    <label class="admin-form-wide">Description<textarea name="description" rows="3" required></textarea></label>
                </div>
                <div class="new-stock-fields">
                    <strong>Stock initial par pointure</strong>
                    <div><?php foreach ($shoeSizes as $size): ?>
                        <label><?= $size ?><input type="number" min="0" max="9999" name="new_stock[<?= $size ?>]" value="0" aria-label="Stock initial pointure <?= $size ?>"></label>
                    <?php endforeach; ?></div>
                </div>
                <button class="admin-button" type="submit" name="save_product">Créer l’article</button>
            </form>
        </section>

        <section class="admin-section">
            <h2>Commandes <span><?= count($orders) ?></span></h2>
            <?php if (!$orders): ?><p class="admin-empty">Aucune commande pour le moment.</p><?php endif; ?>
            <div class="order-table-wrap">
                <table class="order-table">
                    <thead><tr><th>Commande</th><th>Client</th><th>Livraison</th><th>Articles</th><th>Total</th><th>Statut</th></tr></thead>
                    <tbody>
                    <?php foreach ($orders as $order): ?>
                        <?php $nextStatuses = ['pending'=>['confirmed','cancelled'],'confirmed'=>['shipped','cancelled'],'shipped'=>['delivered'],'delivered'=>[],'cancelled'=>[]][$order['status']] ?? []; ?>
                        <tr>
                            <td data-label="Commande"><strong><?= h($order['order_number']) ?></strong><small><?= h(date('d/m/Y H:i', strtotime($order['created_at']))) ?></small></td>
                            <td data-label="Client"><?= h($order['customer_name']) ?><small><?= h($order['phone']) ?></small></td>
                            <td data-label="Livraison"><?= h($order['commune']) ?><small>Wilaya de <?= h($order['wilaya']) ?></small><small>À la livraison</small></td>
                            <td data-label="Articles"><ul class="order-items"><?php foreach ($order['items'] as $item): ?><li><?= h($item['product_name']) ?> · <?= h($item['size']) ?> × <?= h($item['quantity']) ?></li><?php endforeach; ?></ul></td>
                            <td data-label="Total"><small>Articles : <?= number_format(array_sum(array_column($order['items'], 'line_total')), 0, ',', ' ') ?> DA</small><small>Livraison : <?= number_format((float)$order['delivery_fee'], 0, ',', ' ') ?> DA</small><strong><?= number_format((float)$order['total'], 0, ',', ' ') ?> DA</strong></td>
                            <td data-label="Statut"><span class="status status-<?= h($order['status']) ?>"><?= h($statusLabels[$order['status']] ?? $order['status']) ?></span>
                                <?php if ($nextStatuses): ?><form class="order-status-form" method="post">
                                    <input type="hidden" name="csrf_token" value="<?= h($_SESSION['csrf_token']) ?>">
                                    <input type="hidden" name="order_id" value="<?= (int)$order['id'] ?>">
                                    <select name="status" aria-label="Nouveau statut">
                                        <?php foreach ($nextStatuses as $status): ?><option value="<?= h($status) ?>"><?= h($statusLabels[$status]) ?></option><?php endforeach; ?>
                                    </select>
                                    <button class="admin-button" type="submit" name="update_order">Valider</button>
                                </form><?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </section>

        <section class="admin-section">
            <h2>Catalogue, promos & stock</h2>
            <p class="inventory-intro">Modifie les prix, active une promotion et ajuste les quantités par pointure au même endroit.</p>
            <?php if (!$stockProducts): ?><p class="admin-empty">Aucun produit à gérer pour le moment.</p><?php endif; ?>
            <div class="inventory-list">
                <?php foreach ($stockProducts as $productId => $product): ?>
                    <?php $totalStock = array_sum($product['sizes']); $stockState = $totalStock === 0 ? 'empty' : ($totalStock <= 3 ? 'low' : 'available'); ?>
                    <form class="inventory-card" method="post">
                        <input type="hidden" name="csrf_token" value="<?= h($_SESSION['csrf_token']) ?>">
                        <input type="hidden" name="product_id" value="<?= (int)$productId ?>">
                        <div class="inventory-heading">
                            <img src="<?= h($product['image']) ?>" alt="" loading="lazy">
                            <div class="inventory-product-copy">
                                <h3><?= h($product['name']) ?></h3>
                                <p><?= h($product['brand']) ?> · <?= h($product['category']) ?></p>
                                <div class="inventory-price">
                                    <?php if ($product['old_price'] && (float)$product['old_price'] > (float)$product['price']): ?><del><?= number_format((float)$product['old_price'], 0, ',', ' ') ?> DA</del><?php endif; ?>
                                    <strong><?= number_format((float)$product['price'], 0, ',', ' ') ?> DA</strong>
                                    <?php if ($product['old_price'] && (float)$product['old_price'] > (float)$product['price']): ?><span class="inventory-promo">PROMO</span><?php endif; ?>
                                </div>
                            </div>
                            <span class="inventory-stock-state <?= h($stockState) ?>"><?= $stockState === 'empty' ? 'Épuisé' : ($stockState === 'low' ? 'Stock faible' : 'En stock') ?> · <?= $totalStock ?></span>
                        </div>
                        <div class="inventory-stock">
                            <strong>Stock par pointure</strong>
                            <div class="inventory-sizes">
                                <?php foreach ($shoeSizes as $size): ?>
                                    <label><?= $size ?><input type="number" min="0" max="9999" name="stock[<?= (int)$productId ?>][<?= $size ?>]" value="<?= (int)($product['sizes'][$size] ?? 0) ?>" aria-label="Pointure <?= $size ?>, <?= h($product['name']) ?>"></label>
                                <?php endforeach; ?>
                            </div>
                        </div>
                        <details class="inventory-edit">
                            <summary>Modifier la fiche produit</summary>
                            <div class="inventory-fields">
                                <label class="inventory-wide">Nom<input name="name" maxlength="150" value="<?= h($product['name']) ?>" required></label>
                                <label>Marque<input name="brand" maxlength="80" value="<?= h($product['brand']) ?>" required></label>
                                <label>Catégorie<select name="category"><?php foreach ($categories as $category): ?><option value="<?= h($category) ?>" <?= $product['category'] === $category ? 'selected' : '' ?>><?= h($category) ?></option><?php endforeach; ?></select></label>
                                <input type="hidden" name="gender" value="Homme">
                                <label>Prix actuel (DA)<input type="number" name="price" min="1" step="1" value="<?= h($product['price']) ?>" required></label>
                                <label>Prix précédent (DA)<input type="number" name="old_price" min="1" step="1" value="<?= h($product['old_price']) ?>" placeholder="Vide = aucune promo"></label>
                                <label class="inventory-wide">Description<textarea name="description" rows="2"><?= h($product['description']) ?></textarea></label>
                                <label class="inventory-active"><input type="checkbox" name="active" value="1" <?= $product['active'] ? 'checked' : '' ?>> Visible dans la boutique</label>
                            </div>
                        </details>
                        <button class="admin-button inventory-save" type="submit" name="update_product">Enregistrer les modifications</button>
                    </form>
                <?php endforeach; ?>
            </div>
        </section>
    <?php endif; ?>
</main>
<script>
const newProductBrand = document.getElementById('newProductBrand');
const newBrandField = document.getElementById('newBrandField');
const newProductBrandName = document.getElementById('newProductBrandName');
const syncNewBrandField = () => {
    const isNewBrand = newProductBrand.value === '__create_new_brand__';
    newBrandField.hidden = !isNewBrand;
    newProductBrandName.required = isNewBrand;
    newProductBrandName.disabled = !isNewBrand;
    if (!isNewBrand) newProductBrandName.value = '';
};
newProductBrand.addEventListener('change', syncNewBrandField);
syncNewBrandField();
const mainImgInput = document.getElementById('adminMainImageInput');
const previewWrap = document.getElementById('adminMainImagePreview');
const previewImg = document.getElementById('adminPreviewImg');
if (mainImgInput && previewWrap && previewImg) {
    mainImgInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            previewImg.src = URL.createObjectURL(file);
            previewWrap.style.display = 'flex';
        } else {
            previewWrap.style.display = 'none';
        }
    });
}
</script>
</body>
</html>