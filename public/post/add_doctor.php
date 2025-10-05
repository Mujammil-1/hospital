<?php
require_once __DIR__ . '/../../includes/auth.php';
require_auth();
require_once __DIR__ . '/../../includes/db.php';

$name = trim($_POST['name'] ?? '');
$specialization = trim($_POST['specialization'] ?? '');
$contact = trim($_POST['contact'] ?? '');
$departmentId = $_POST['department_id'] !== '' ? (int)$_POST['department_id'] : null;

if ($name === '') {
    header('Location: /index.php?error=' . urlencode('Doctor name is required'));
    exit;
}

$pdo = get_pdo();
$stmt = $pdo->prepare('INSERT INTO Doctor (Name, Specialization, ContactNo, DepartmentID) VALUES (?, ?, ?, ?)');
$stmt->execute([$name, $specialization ?: null, $contact ?: null, $departmentId]);

header('Location: /index.php?info=' . urlencode('Doctor added'));
exit;
