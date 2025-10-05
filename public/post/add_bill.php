<?php
require_once __DIR__ . '/../../includes/auth.php';
require_auth();
require_once __DIR__ . '/../../includes/db.php';

$patientId = (int)($_POST['patient_id'] ?? 0);
$admissionId = (int)($_POST['admission_id'] ?? 0);
$amount = (int)($_POST['amount'] ?? 0);
$paymentStatus = trim($_POST['payment_status'] ?? 'Pending');

if ($patientId <= 0 || $admissionId <= 0 || $amount < 0) {
    header('Location: /index.php?error=' . urlencode('Patient, Admission and Amount are required'));
    exit;
}

$pdo = get_pdo();
$stmt = $pdo->prepare('INSERT INTO Bill (PatientID, AdmissionID, Amount, PaymentStatus) VALUES (?, ?, ?, ?)');
$stmt->execute([$patientId, $admissionId, $amount, $paymentStatus ?: null]);

header('Location: /index.php?info=' . urlencode('Bill added'));
exit;
