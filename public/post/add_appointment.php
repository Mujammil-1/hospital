<?php
require_once __DIR__ . '/../../includes/auth.php';
require_auth();
require_once __DIR__ . '/../../includes/db.php';

$patientId = (int)($_POST['patient_id'] ?? 0);
$doctorId = (int)($_POST['doctor_id'] ?? 0);
$date = $_POST['date'] ?? '';
$status = trim($_POST['status'] ?? 'Scheduled');

if ($patientId <= 0 || $doctorId <= 0 || $date === '') {
    header('Location: /index.php?error=' . urlencode('Patient, Doctor and Date are required'));
    exit;
}

$pdo = get_pdo();
$stmt = $pdo->prepare('INSERT INTO Appointment (PatientID, DoctorID, AppointmentDate, Status) VALUES (?, ?, ?, ?)');
$stmt->execute([$patientId, $doctorId, $date, $status ?: null]);

header('Location: /index.php?info=' . urlencode('Appointment added'));
exit;
