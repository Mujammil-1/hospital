<?php
require_once __DIR__ . '/../../includes/auth.php';
require_auth();
require_once __DIR__ . '/../../includes/db.php';

$name = trim($_POST['name'] ?? '');
$age = $_POST['age'] !== '' ? (int)$_POST['age'] : null;
$gender = trim($_POST['gender'] ?? '');
$contact = trim($_POST['contact'] ?? '');
$address = trim($_POST['address'] ?? '');
$disease = trim($_POST['disease'] ?? '');

if ($name === '') {
    header('Location: /index.php?error=' . urlencode('Patient name is required'));
    exit;
}

$pdo = get_pdo();
$stmt = $pdo->prepare('INSERT INTO Patient (Name, Age, Gender, ContactNo, Address, Disease) VALUES (?, ?, ?, ?, ?, ?)');
$stmt->execute([$name, $age, $gender ?: null, $contact ?: null, $address ?: null, $disease ?: null]);

header('Location: /index.php?info=' . urlencode('Patient added'));
exit;
