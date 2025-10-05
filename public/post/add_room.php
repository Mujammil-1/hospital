<?php
require_once __DIR__ . '/../../includes/auth.php';
require_auth();
require_once __DIR__ . '/../../includes/db.php';

$roomType = trim($_POST['room_type'] ?? '');
$availability = trim($_POST['availability'] ?? 'Yes');

$pdo = get_pdo();
$stmt = $pdo->prepare('INSERT INTO Room (RoomType, Availability) VALUES (?, ?)');
$stmt->execute([$roomType ?: null, $availability === 'No' ? 'No' : 'Yes']);

header('Location: /index.php?info=' . urlencode('Room added'));
exit;
