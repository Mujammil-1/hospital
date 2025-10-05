<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['admin_id'])) {
    $current = $_SERVER['REQUEST_URI'] ?? '/index.php';
    header('Location: /login.php?redirect=' . urlencode($current));
    exit;
}
