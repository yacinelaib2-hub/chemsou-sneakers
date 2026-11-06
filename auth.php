<?php
declare(strict_types=1);

ini_set('session.use_strict_mode', '1');
header('Cache-Control: no-store, private');
session_set_cookie_params([
    'httponly'=>true,
    'secure'=>!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'samesite'=>'Lax'
]);
session_start();
if (empty($_SESSION['csrf_token'])) $_SESSION['csrf_token'] = bin2hex(random_bytes(32));

$dbHost = getenv('DB_HOST') ?: 'localhost';
$dbName = getenv('DB_NAME') ?: 'sneaker_store';
$dbUser = getenv('DB_USER') ?: 'root';
$dbPass = getenv('DB_PASSWORD') ?: '';
$pdo = null;
$error = '';
$success = '';
$loginLockedUntil = 0;
$loginEmailInput = '';
$mode = ($_GET['mode'] ?? $_POST['mode'] ?? 'login') === 'register' ? 'register' : 'login';
$nextRequest = $_GET['next'] ?? $_POST['next'] ?? '';
$next = in_array($nextRequest, ['checkout','orders'], true) ? $nextRequest : '';

try {
    $pdo = new PDO(
        "mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4",
        $dbUser,
        $dbPass,
        [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]
    );

    $adminEmail = strtolower(trim(getenv('URBANKICKS_ADMIN_EMAIL') ?: ''));
    $adminPassword = getenv('URBANKICKS_ADMIN_PASSWORD') ?: '';
    if ($adminEmail !== '' && $adminPassword !== '' && filter_var($adminEmail, FILTER_VALIDATE_EMAIL)) {
        $findAdmin = $pdo->prepare('SELECT id FROM users WHERE email = ?');
        $findAdmin->execute([$adminEmail]);
        if (!$findAdmin->fetch()) {
            $createAdmin = $pdo->prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, \'admin\')');
            $createAdmin->execute(['Store Manager', $adminEmail, password_hash($adminPassword, PASSWORD_DEFAULT)]);
        }
    }
} catch (PDOException $e) {
    $error = 'Connexion à la base de données indisponible. Vérifie MySQL et importe database.sql.';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $pdo) {
    if (!hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'] ?? '')) {
        $error = 'Session expirée. Recharge la page.';
    } elseif (($_POST['action'] ?? '') === 'logout') {
        $_SESSION = [];
        session_regenerate_id(true);
        header('Location: index.php');
        exit;
    } elseif (($_POST['action'] ?? '') === 'register') {
        $name = trim($_POST['name'] ?? '');
        $email = strtolower(trim($_POST['email'] ?? ''));
        $phone = trim($_POST['phone'] ?? '');
        $password = (string)($_POST['password'] ?? '');
        if ($name === '' || strlen($name) > 120 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190 || !preg_match('/^[0-9+().\s-]{8,20}$/', $phone) || strlen($password) < 10) {
            $error = 'Vérifie les champs. Le mot de passe doit contenir au moins 10 caractères.';
        } else {
            try {
                $createUser = $pdo->prepare('INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, \'customer\')');
                $createUser->execute([$name, $email, $phone, password_hash($password, PASSWORD_DEFAULT)]);
                $_SESSION['user_id'] = (int)$pdo->lastInsertId();
                $_SESSION['user_name'] = $name;
                $_SESSION['user_email'] = $email;
                $_SESSION['user_phone'] = $phone;
                $_SESSION['user_role'] = 'customer';
                session_regenerate_id(true);
                header('Location: ' . ($next === 'checkout' ? 'index.php?checkout=1' : ($next === 'orders' ? 'auth.php' : 'index.php')));
                exit;
            } catch (PDOException $e) {
                $error = 'Cette adresse e-mail est déjà utilisée.';
            }
        }
    } elseif (($_POST['action'] ?? '') === 'login') {
        $email = strtolower(trim($_POST['email'] ?? ''));
        $loginEmailInput = $email;
        $password = (string)($_POST['password'] ?? '');
        $attemptKey = hash('sha256', $email . '|' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
        $attemptLookup = $pdo->prepare('SELECT attempts, UNIX_TIMESTAMP(locked_until) AS locked_until, UNIX_TIMESTAMP(updated_at) AS updated_at FROM login_throttles WHERE attempt_key = ? LIMIT 1');
        $attemptLookup->execute([$attemptKey]);
        $attempt = $attemptLookup->fetch();
        $lockedUntil = $attempt ? (int)$attempt['locked_until'] : 0;

        if ($lockedUntil > time()) {
            $loginLockedUntil = $lockedUntil;
            $error = 'Trop de tentatives incorrectes. Réessaie après la fin du délai.';
        } else {
            $lookup = $pdo->prepare('SELECT id, name, email, phone, password_hash, role FROM users WHERE email = ? LIMIT 1');
            $lookup->execute([$email]);
            $user = $lookup->fetch();
            if (!$user || !password_verify($password, $user['password_hash'])) {
                $lastAttempt = $attempt ? (int)$attempt['updated_at'] : 0;
                $previousAttempts = $lockedUntil > 0 || $lastAttempt < time() - 600 ? 0 : (int)$attempt['attempts'];
                $failedAttempts = $previousAttempts + 1;
                $loginLockedUntil = $failedAttempts >= 5 ? time() + 600 : 0;
                $saveAttempt = $pdo->prepare('INSERT INTO login_throttles (attempt_key, attempts, updated_at, locked_until) VALUES (?, ?, CURRENT_TIMESTAMP, IF(? = 0, NULL, FROM_UNIXTIME(?))) ON DUPLICATE KEY UPDATE attempts = VALUES(attempts), updated_at = CURRENT_TIMESTAMP, locked_until = VALUES(locked_until)');
                $saveAttempt->execute([$attemptKey, $failedAttempts, $loginLockedUntil, $loginLockedUntil]);
                $error = $loginLockedUntil > 0
                    ? 'Trop de tentatives incorrectes. Réessaie dans 10 minutes.'
                    : 'Adresse e-mail ou mot de passe incorrect.';
            } else {
                $clearAttempts = $pdo->prepare('DELETE FROM login_throttles WHERE attempt_key = ?');
                $clearAttempts->execute([$attemptKey]);
                if (password_needs_rehash($user['password_hash'], PASSWORD_DEFAULT)) {
                    $rehash = $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
                    $rehash->execute([password_hash($password, PASSWORD_DEFAULT), $user['id']]);
                }
                session_regenerate_id(true);
                $_SESSION['user_id'] = (int)$user['id'];
                $_SESSION['user_name'] = $user['name'];
                $_SESSION['user_email'] = $user['email'];
                $_SESSION['user_phone'] = $user['phone'];
                $_SESSION['user_role'] = $user['role'];
                header('Location: ' . ($user['role'] === 'admin' ? 'admin.php' : ($next === 'checkout' ? 'index.php?checkout=1' : ($next === 'orders' ? 'auth.php' : 'index.php'))));
                exit;
            }
        }
    }
}

$loginIsLocked = $mode === 'login' && $loginLockedUntil > time();
$loginLockSeconds = $loginIsLocked ? $loginLockedUntil - time() : 0;

if ($pdo && !empty($_SESSION['user_id'])) {
    if (($_SESSION['user_role'] ?? '') === 'admin') {
        header('Location: admin.php');
        exit;
    }
    $profileQuery = $pdo->prepare('SELECT name, email, phone FROM users WHERE id = ? AND role = \'customer\'');
    $profileQuery->execute([$_SESSION['user_id']]);
    $profile = $profileQuery->fetch();
    $profileOrders = [];
    if (!$profile) {
        unset($_SESSION['user_id'], $_SESSION['user_name'], $_SESSION['user_email'], $_SESSION['user_role']);
    } else {
        $ordersQuery = $pdo->prepare('SELECT o.id, o.order_number, o.created_at, o.total, o.delivery_fee, o.wilaya, o.commune, o.status, oi.product_name, oi.size, oi.quantity, oi.line_total FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id WHERE o.user_id = ? ORDER BY o.created_at DESC, oi.id');
        $ordersQuery->execute([$_SESSION['user_id']]);
        $ordersById = [];
        foreach ($ordersQuery->fetchAll() as $row) {
            $orderId = (int)$row['id'];
            if (!isset($ordersById[$orderId])) {
                $ordersById[$orderId] = [
                    'order_number'=>$row['order_number'],
                    'created_at'=>$row['created_at'],
                    'total'=>$row['total'],
                    'delivery_fee'=>$row['delivery_fee'],
                    'wilaya'=>$row['wilaya'],
                    'commune'=>$row['commune'],
                    'status'=>$row['status'],
                    'items'=>[]
                ];
            }
            if ($row['product_name'] !== null) {
                $ordersById[$orderId]['items'][] = $row;
            }
        }
        $profileOrders = array_values($ordersById);
    }
} else {
    $profile = null;
    $profileOrders = [];
}

function auth_h($value): string { return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8'); }
$orderStatusLabels = [
    'pending'=>'Commande reçue',
    'confirmed'=>'Commande confirmée',
    'shipped'=>'Commande expédiée',
    'delivered'=>'Commande livrée',
    'cancelled'=>'Commande annulée'
];
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $profile ? 'Mon profil' : ($mode === 'register' ? 'Créer un compte' : 'Connexion') ?> | Chemsou Sneakers</title>
    <link rel="stylesheet" href="style.css?v=<?= filemtime(__DIR__ . '/style.css') ?>">
</head>
<body class="auth-page">
<header class="admin-header">
    <a href="index.php" aria-label="Chemsou Sneakers, accueil"><img class="brand-mark" src="assets/chemsou-logo.png?v=<?= filemtime(__DIR__ . '/assets/chemsou-logo.png') ?>" alt="Chemsou Sneakers"></a>
    <a class="admin-back" href="index.php">Retour à la boutique</a>
</header>
<main class="auth-main">
    <?php if ($profile): ?>
        <section class="auth-panel">
            <p class="eyebrow">ESPACE CLIENT</p>
            <h1>Bonjour, <?= auth_h($profile['name']) ?></h1>
            <dl class="profile-details"><div><dt>E-mail</dt><dd><?= auth_h($profile['email']) ?></dd></div><div><dt>Téléphone</dt><dd><?= auth_h($profile['phone']) ?></dd></div></dl>
            <section class="profile-orders" aria-labelledby="profile-orders-title">
                <h2 id="profile-orders-title">Mes commandes</h2>
                <?php if (!$profileOrders): ?><p class="profile-orders-empty">Aucune commande pour le moment.</p>
                <?php else: foreach ($profileOrders as $order): ?>
                    <article class="profile-order">
                        <div class="profile-order-heading">
                            <div><strong><?= auth_h($order['order_number']) ?></strong><time datetime="<?= auth_h(date(DATE_ATOM, strtotime($order['created_at']))) ?>"><?= auth_h(date('d/m/Y H:i', strtotime($order['created_at']))) ?></time></div>
                            <span class="profile-order-status status-<?= auth_h($order['status']) ?>"><?= auth_h($orderStatusLabels[$order['status']] ?? 'Statut indisponible') ?></span>
                        </div>
                        <ul class="profile-order-items">
                            <?php foreach ($order['items'] as $item): ?>
                                <li><span><?= auth_h($item['product_name']) ?> · Pointure <?= auth_h($item['size']) ?> × <?= (int)$item['quantity'] ?></span><strong><?= number_format((float)$item['line_total'], 0, ',', ' ') ?> DA</strong></li>
                            <?php endforeach; ?>
                        </ul>
                        <p class="profile-order-destination">Livraison vers : <?= auth_h($order['commune']) ?>, <?= auth_h($order['wilaya']) ?></p>
                        <p class="profile-order-fees">Articles : <?= number_format(array_sum(array_column($order['items'], 'line_total')), 0, ',', ' ') ?> DA · Livraison : <?= number_format((float)$order['delivery_fee'], 0, ',', ' ') ?> DA</p>
                        <p class="profile-order-total">Total : <?= number_format((float)$order['total'], 0, ',', ' ') ?> DA</p>
                        <?php if ($order['status'] === 'pending'): ?><p class="profile-order-note">Nous vous appellerons pour confirmer votre commande.</p><?php endif; ?>
                    </article>
                <?php endforeach; endif; ?>
            </section>
            <form method="post"><input type="hidden" name="csrf_token" value="<?= auth_h($_SESSION['csrf_token']) ?>"><button class="admin-button" name="action" value="logout">Se déconnecter</button></form>
        </section>
    <?php else: ?>
        <section class="auth-panel">
            <p class="eyebrow">CHEMSOU SNEAKERS / COMPTE CLIENT</p>
            <h1><?= $mode === 'register' ? 'Créer un compte' : 'Bienvenue' ?></h1>
            <div class="auth-tabs"><a class="<?= $mode === 'login' ? 'active' : '' ?>" href="auth.php?next=<?= auth_h($next) ?>">Connexion</a><a class="<?= $mode === 'register' ? 'active' : '' ?>" href="auth.php?mode=register&amp;next=<?= auth_h($next) ?>">Inscription</a></div>
            <?php if ($error): ?><p class="auth-message" role="alert"><?= auth_h($error) ?></p><?php endif; ?>
            <?php if ($loginIsLocked): ?><p class="auth-lockout" id="loginLockTimer" data-unlock-at="<?= (int)$loginLockedUntil ?>" role="status">Tu pourras réessayer dans <strong id="loginCountdown">10:00</strong>.</p><?php endif; ?>
            <?php if ($pdo): ?>
                <form method="post" class="auth-form">
                    <input type="hidden" name="csrf_token" value="<?= auth_h($_SESSION['csrf_token']) ?>">
                    <input type="hidden" name="next" value="<?= auth_h($next) ?>">
                    <input type="hidden" name="action" value="<?= $mode === 'register' ? 'register' : 'login' ?>">
                    <?php if ($mode === 'register'): ?>
                        <label>Nom complet<input name="name" autocomplete="name" maxlength="120" required></label>
                        <label>Téléphone<input name="phone" type="tel" autocomplete="tel" pattern="[0-9+(). -]{8,20}" required></label>
                    <?php endif; ?>
                    <label>Adresse e-mail<input name="email" type="email" autocomplete="email" maxlength="190" value="<?= auth_h($loginEmailInput) ?>" <?= $loginIsLocked ? 'readonly' : '' ?> required></label>
                    <label>Mot de passe
                        <span class="password-control"><input id="authPassword" name="password" type="password" autocomplete="<?= $mode === 'register' ? 'new-password' : 'current-password' ?>" minlength="<?= $mode === 'register' ? '10' : '1' ?>" <?= $loginIsLocked ? 'disabled' : '' ?> required><button id="togglePassword" type="button" aria-label="Afficher le mot de passe" <?= $loginIsLocked ? 'disabled' : '' ?>>Afficher</button></span>
                    </label>
                    <button class="checkout-btn" type="submit" <?= $loginIsLocked ? 'disabled' : '' ?>><?= $mode === 'register' ? 'CRÉER MON COMPTE' : 'SE CONNECTER' ?></button>
                </form>
            <?php endif; ?>
        </section>
    <?php endif; ?>
</main>
<script>
const authPassword = document.getElementById('authPassword');
const togglePassword = document.getElementById('togglePassword');
togglePassword?.addEventListener('click', () => {
    const reveal = authPassword.type === 'password';
    authPassword.type = reveal ? 'text' : 'password';
    togglePassword.textContent = reveal ? 'Masquer' : 'Afficher';
    togglePassword.setAttribute('aria-label', reveal ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
});

const lockTimer = document.getElementById('loginLockTimer');
if (lockTimer) {
    let lockInterval;
    const updateLockTimer = () => {
        const remaining = Math.max(0, Number(lockTimer.dataset.unlockAt) - Math.floor(Date.now() / 1000));
        if (remaining === 0) {
            lockTimer.textContent = 'Le délai est terminé. Tu peux réessayer.';
            document.querySelector('.auth-form [name="email"]').readOnly = false;
            document.getElementById('authPassword').disabled = false;
            document.getElementById('togglePassword').disabled = false;
            document.querySelector('.auth-form [type="submit"]').disabled = false;
            clearInterval(lockInterval);
            return;
        }
        const minutes = String(Math.floor(remaining / 60)).padStart(2, '0');
        const seconds = String(remaining % 60).padStart(2, '0');
        document.getElementById('loginCountdown').textContent = `${minutes}:${seconds}`;
    };
    lockInterval = setInterval(updateLockTimer, 1000);
    updateLockTimer();
}
</script>
</body>
</html>