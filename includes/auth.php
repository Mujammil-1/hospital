<?php
require_once __DIR__ . '/db.php';

function start_session(): void {
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }
}

function login(string $username, string $password): bool {
    $pdo = get_pdo();
    $stmt = $pdo->prepare('SELECT AdminID, Username, Password FROM Admin WHERE Username = ? LIMIT 1');
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if (!$user) {
        return false;
    }

    if (!password_verify($password, $user['Password'])) {
        return false;
    }

    start_session();
    $_SESSION['admin_id'] = (int)$user['AdminID'];
    $_SESSION['username'] = $user['Username'];
    return true;
}

function require_auth(): void {
    start_session();
    if (empty($_SESSION['admin_id'])) {
        header('Location: /login.php');
        exit;
    }
}

function logout(): void {
    start_session();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params['path'], $params['domain'], $params['secure'], $params['httponly']
        );
    }
    session_destroy();
}
