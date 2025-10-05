<?php
require_once __DIR__ . '/../../includes/auth.php';
require_auth();
require_once __DIR__ . '/../../includes/db.php';

$patientId = (int)($_POST['patient_id'] ?? 0);
$roomId = (int)($_POST['room_id'] ?? 0);
$admissionDate = $_POST['admission_date'] ?? '';

if ($patientId <= 0 || $roomId <= 0 || $admissionDate === '') {
    header('Location: /index.php?error=' . urlencode('Patient, Room and Admission Date are required'));
    exit;
}

$pdo = get_pdo();
$stmt = $pdo->prepare('INSERT INTO Admission (PatientID, RoomID, AdmissionDate) VALUES (?, ?, ?)');
$stmt->execute([$patientId, $roomId, $admissionDate]);

header('Location: /index.php?info=' . urlencode('Admission added'));
exit;
