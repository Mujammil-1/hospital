<?php
require_once __DIR__ . '/../includes/auth.php';
require_auth();
require_once __DIR__ . '/../includes/db.php';

$pdo = get_pdo();

// Fetch dropdown options
$departments = $pdo->query('SELECT DepartmentID, DepartmentName FROM Department ORDER BY DepartmentName')->fetchAll();
$patients = $pdo->query('SELECT PatientID, Name FROM Patient ORDER BY Name')->fetchAll();
$doctors = $pdo->query('SELECT DoctorID, Name FROM Doctor ORDER BY Name')->fetchAll();
$rooms = $pdo->query('SELECT RoomID, RoomType, Availability FROM Room ORDER BY RoomID')->fetchAll();

$info = $_GET['info'] ?? '';
$error = $_GET['error'] ?? '';
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Hospital Management - Dashboard</title>
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <div class="container">
    <header class="topbar">
      <h1>Dashboard</h1>
      <nav>
        <a href="/index.php">Home</a>
        <a href="/view.php">View Data</a>
        <a href="/logout.php">Logout</a>
      </nav>
    </header>

    <?php if ($info): ?><div class="alert success"><?= h($info) ?></div><?php endif; ?>
    <?php if ($error): ?><div class="alert error"><?= h($error) ?></div><?php endif; ?>

    <section class="grid">
      <div class="card">
        <h2>Add Patient</h2>
        <form method="post" action="/post/add_patient.php">
          <label><span>Name</span><input name="name" required /></label>
          <label><span>Age</span><input type="number" name="age" min="0" /></label>
          <label>
            <span>Gender</span>
            <select name="gender">
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </label>
          <label><span>Contact No</span><input name="contact" /></label>
          <label><span>Address</span><input name="address" /></label>
          <label><span>Disease</span><input name="disease" /></label>
          <button type="submit">Save</button>
        </form>
      </div>

      <div class="card">
        <h2>Add Department</h2>
        <form method="post" action="/post/add_department.php">
          <label><span>Department ID</span><input type="number" name="department_id" required /></label>
          <label><span>Name</span><input name="department_name" required /></label>
          <label><span>Location</span><input name="location" /></label>
          <button type="submit">Save</button>
        </form>
      </div>

      <div class="card">
        <h2>Add Doctor</h2>
        <form method="post" action="/post/add_doctor.php">
          <label><span>Name</span><input name="name" required /></label>
          <label><span>Specialization</span><input name="specialization" /></label>
          <label><span>Contact No</span><input name="contact" /></label>
          <label>
            <span>Department</span>
            <select name="department_id">
              <option value="">Select</option>
              <?php foreach ($departments as $d): ?>
                <option value="<?= (int)$d['DepartmentID'] ?>"><?= h($d['DepartmentName']) ?></option>
              <?php endforeach; ?>
            </select>
          </label>
          <button type="submit">Save</button>
        </form>
      </div>

      <div class="card">
        <h2>Add Room</h2>
        <form method="post" action="/post/add_room.php">
          <label><span>Room Type</span><input name="room_type" /></label>
          <label>
            <span>Availability</span>
            <select name="availability">
              <option>Yes</option>
              <option>No</option>
            </select>
          </label>
          <button type="submit">Save</button>
        </form>
      </div>

      <div class="card">
        <h2>Add Appointment</h2>
        <form method="post" action="/post/add_appointment.php">
          <label>
            <span>Patient</span>
            <select name="patient_id" required>
              <option value="">Select</option>
              <?php foreach ($patients as $p): ?>
                <option value="<?= (int)$p['PatientID'] ?>"><?= h($p['Name']) ?></option>
              <?php endforeach; ?>
            </select>
          </label>
          <label>
            <span>Doctor</span>
            <select name="doctor_id" required>
              <option value="">Select</option>
              <?php foreach ($doctors as $doc): ?>
                <option value="<?= (int)$doc['DoctorID'] ?>"><?= h($doc['Name']) ?></option>
              <?php endforeach; ?>
            </select>
          </label>
          <label><span>Date</span><input type="date" name="date" required /></label>
          <label><span>Status</span><input name="status" /></label>
          <button type="submit">Save</button>
        </form>
      </div>

      <div class="card">
        <h2>Add Admission</h2>
        <form method="post" action="/post/add_admission.php">
          <label>
            <span>Patient</span>
            <select name="patient_id" required>
              <option value="">Select</option>
              <?php foreach ($patients as $p): ?>
                <option value="<?= (int)$p['PatientID'] ?>"><?= h($p['Name']) ?></option>
              <?php endforeach; ?>
            </select>
          </label>
          <label>
            <span>Room</span>
            <select name="room_id" required>
              <option value="">Select</option>
              <?php foreach ($rooms as $r): ?>
                <option value="<?= (int)$r['RoomID'] ?>" <?= $r['Availability']==='No' ? 'disabled' : '' ?>>
                  #<?= (int)$r['RoomID'] ?> - <?= h($r['RoomType']) ?> (<?= h($r['Availability']) ?>)
                </option>
              <?php endforeach; ?>
            </select>
          </label>
          <label><span>Admission Date</span><input type="date" name="admission_date" required /></label>
          <button type="submit">Save</button>
        </form>
      </div>

      <div class="card">
        <h2>Add Bill</h2>
        <form method="post" action="/post/add_bill.php">
          <label><span>Patient ID</span><input type="number" name="patient_id" required /></label>
          <label><span>Admission ID</span><input type="number" name="admission_id" required /></label>
          <label><span>Amount</span><input type="number" name="amount" min="0" required /></label>
          <label><span>Payment Status</span><input name="payment_status" /></label>
          <button type="submit">Save</button>
        </form>
      </div>
    </section>
  </div>
</body>
</html>
