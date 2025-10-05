<?php
require_once __DIR__ . '/../../includes/auth.php';
require_auth();
require_once __DIR__ . '/../../includes/db.php';

$departmentId = (int)($_POST['department_id'] ?? 0);
$departmentName = trim($_POST['department_name'] ?? '');
$location = trim($_POST['location'] ?? '');

if ($departmentId <= 0 || $departmentName === '') {
    header('Location: /index.php?error=' . urlencode('Department ID and Name are required'));
    exit;
}

$pdo = get_pdo();
$stmt = $pdo->prepare('INSERT INTO Department (DepartmentID, DepartmentName, Location) VALUES (?, ?, ?)');
$stmt->execute([$departmentId, $departmentName, $location ?: null]);

header('Location: /index.php?info=' . urlencode('Department added'));
exit;
