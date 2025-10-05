<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/db.php';

function h($v) { return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8'); }

$tables = [
    'Patient', 'Department', 'Doctor', 'Room', 'Appointment', 'Admission', 'Bill',
    'vw_Doctors', 'vw_Appointments', 'vw_Admissions', 'vw_Bills'
];

$insertMessage = null;
$insertError = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['insert_into'])) {
    $table = $_POST['insert_into'];
    try {
        switch ($table) {
            case 'Patient':
                $stmt = $pdo->prepare('INSERT INTO Patient (Name, Age, Gender, ContactNo, Address, Disease) VALUES (?,?,?,?,?,?)');
                $stmt->execute([
                    $_POST['name'] ?? null,
                    $_POST['age'] !== '' ? (int)$_POST['age'] : null,
                    $_POST['gender'] ?? null,
                    $_POST['contact'] ?? null,
                    $_POST['address'] ?? null,
                    $_POST['disease'] ?? null,
                ]);
                break;
            case 'Department':
                $stmt = $pdo->prepare('INSERT INTO Department (DepartmentID, DepartmentName, Location) VALUES (?,?,?)');
                $stmt->execute([
                    (int)($_POST['department_id'] ?? 0),
                    $_POST['department_name'] ?? null,
                    $_POST['location'] ?? null,
                ]);
                break;
            case 'Doctor':
                $stmt = $pdo->prepare('INSERT INTO Doctor (Name, Specialization, ContactNo, DepartmentID) VALUES (?,?,?,?)');
                $stmt->execute([
                    $_POST['name'] ?? null,
                    $_POST['specialization'] ?? null,
                    $_POST['contact'] ?? null,
                    $_POST['department_id'] !== '' ? (int)$_POST['department_id'] : null,
                ]);
                break;
            case 'Room':
                $stmt = $pdo->prepare("INSERT INTO Room (RoomType, Availability) VALUES (?,?)");
                $availability = ($_POST['availability'] ?? 'Yes') === 'Yes' ? 'Yes' : 'No';
                $stmt->execute([
                    $_POST['room_type'] ?? null,
                    $availability,
                ]);
                break;
            case 'Appointment':
                $stmt = $pdo->prepare('INSERT INTO Appointment (PatientID, DoctorID, AppointmentDate, Status) VALUES (?,?,?,?)');
                $stmt->execute([
                    $_POST['patient_id'] !== '' ? (int)$_POST['patient_id'] : null,
                    $_POST['doctor_id'] !== '' ? (int)$_POST['doctor_id'] : null,
                    $_POST['appointment_date'] ?? null,
                    $_POST['status'] ?? null,
                ]);
                break;
            case 'Admission':
                $stmt = $pdo->prepare('INSERT INTO Admission (PatientID, RoomID, AdmissionDate, DischargeDate) VALUES (?,?,?,?)');
                $discharge = $_POST['discharge_date'] !== '' ? $_POST['discharge_date'] : null;
                $stmt->execute([
                    $_POST['patient_id'] !== '' ? (int)$_POST['patient_id'] : null,
                    $_POST['room_id'] !== '' ? (int)$_POST['room_id'] : null,
                    $_POST['admission_date'] ?? null,
                    $discharge,
                ]);
                break;
            case 'Bill':
                $stmt = $pdo->prepare('INSERT INTO Bill (PatientID, AdmissionID, Amount, PaymentStatus) VALUES (?,?,?,?)');
                $stmt->execute([
                    $_POST['patient_id'] !== '' ? (int)$_POST['patient_id'] : null,
                    $_POST['admission_id'] !== '' ? (int)$_POST['admission_id'] : null,
                    $_POST['amount'] !== '' ? (int)$_POST['amount'] : null,
                    $_POST['payment_status'] ?? null,
                ]);
                break;
            default:
                throw new Exception('Unsupported table');
        }
        $insertMessage = "$table record inserted successfully.";
    } catch (Throwable $e) {
        $insertError = $e->getMessage();
    }
}

$selectedTable = $_GET['table'] ?? 'vw_Doctors';
if (!in_array($selectedTable, $tables, true)) {
    $selectedTable = 'vw_Doctors';
}

$rows = [];
$columns = [];
try {
    $stmt = $pdo->query("SELECT * FROM `{$selectedTable}` LIMIT 100");
    $rows = $stmt->fetchAll();
    if (!empty($rows)) {
        $columns = array_keys($rows[0]);
    } else {
        // fetch columns via DESCRIBE
        $colsStmt = $pdo->query("DESCRIBE `{$selectedTable}`");
        $columns = array_map(fn($c) => $c['Field'], $colsStmt->fetchAll());
    }
} catch (Throwable $e) {
    $insertError = $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Hospital Management System</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link href="/assets/styles.css" rel="stylesheet" />
</head>
<body class="bg-light">
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="app-header flex-grow-1 me-3">
        <img src="/assets/hospital-logo.svg" alt="Hospital Logo" class="app-logo" />
        <h1 class="app-title">Hospital Management System</h1>
      </div>
      <div class="text-end" style="min-width: 180px;">
        <div class="small text-muted">Signed in as<br><strong><?= h($_SESSION['admin_username'] ?? 'Admin') ?></strong></div>
        <a class="btn btn-outline-danger btn-sm mt-2" href="/logout.php">Logout</a>
      </div>
    </div>

    <?php if ($insertMessage): ?>
      <div class="alert alert-success"><?= h($insertMessage) ?></div>
    <?php endif; ?>
    <?php if ($insertError): ?>
      <div class="alert alert-danger"><?= h($insertError) ?></div>
    <?php endif; ?>

    <div class="row g-4">
      <div class="col-lg-6">
        <div class="card">
          <div class="card-header">Insert Data</div>
          <div class="card-body">
            <form method="post" class="mb-3" id="insertForm">
              <div class="mb-3">
                <label class="form-label">Choose table</label>
                <select name="insert_into" id="insert_into" class="form-select" required>
                  <option value="Patient">Patient</option>
                  <option value="Department">Department</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Room">Room</option>
                  <option value="Appointment">Appointment</option>
                  <option value="Admission">Admission</option>
                  <option value="Bill">Bill</option>
                </select>
              </div>

              <div id="dynamicFields"></div>

              <button type="submit" class="btn btn-primary">Insert</button>
            </form>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card">
          <div class="card-header">View Data</div>
          <div class="card-body">
            <form method="get" class="row g-2 align-items-end">
              <div class="col">
                <label class="form-label">Select table or view</label>
                <select name="table" class="form-select" onchange="this.form.submit()">
                  <?php foreach ($tables as $t): ?>
                    <option value="<?= h($t) ?>" <?= $t === $selectedTable ? 'selected' : '' ?>><?= h($t) ?></option>
                  <?php endforeach; ?>
                </select>
              </div>
              <div class="col-auto">
                <button type="submit" class="btn btn-secondary">Refresh</button>
              </div>
            </form>

            <div class="table-responsive mt-3">
              <table class="table table-striped table-hover table-bordered">
                <thead>
                  <tr>
                    <?php foreach ($columns as $c): ?>
                      <th><?= h($c) ?></th>
                    <?php endforeach; ?>
                  </tr>
                </thead>
                <tbody>
                  <?php foreach ($rows as $r): ?>
                    <tr>
                      <?php foreach ($columns as $c): ?>
                        <td><?= h($r[$c] ?? '') ?></td>
                      <?php endforeach; ?>
                    </tr>
                  <?php endforeach; ?>
                  <?php if (empty($rows)): ?>
                    <tr><td colspan="<?= count($columns) ?>" class="text-center">No rows</td></tr>
                  <?php endif; ?>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    const fieldSets = {
      Patient: [
        {name:'name', label:'Name', type:'text', required:true},
        {name:'age', label:'Age', type:'number'},
        {name:'gender', label:'Gender', type:'text'},
        {name:'contact', label:'Contact No', type:'text'},
        {name:'address', label:'Address', type:'text'},
        {name:'disease', label:'Disease', type:'text'},
      ],
      Department: [
        {name:'department_id', label:'Department ID', type:'number', required:true},
        {name:'department_name', label:'Department Name', type:'text', required:true},
        {name:'location', label:'Location', type:'text'},
      ],
      Doctor: [
        {name:'name', label:'Name', type:'text', required:true},
        {name:'specialization', label:'Specialization', type:'text'},
        {name:'contact', label:'Contact No', type:'text'},
        {name:'department_id', label:'Department ID', type:'number'},
      ],
      Room: [
        {name:'room_type', label:'Room Type', type:'text'},
        {name:'availability', label:'Availability', type:'select', options:['Yes','No']},
      ],
      Appointment: [
        {name:'patient_id', label:'Patient ID', type:'number', required:true},
        {name:'doctor_id', label:'Doctor ID', type:'number', required:true},
        {name:'appointment_date', label:'Appointment Date', type:'date'},
        {name:'status', label:'Status', type:'text'},
      ],
      Admission: [
        {name:'patient_id', label:'Patient ID', type:'number', required:true},
        {name:'room_id', label:'Room ID', type:'number', required:true},
        {name:'admission_date', label:'Admission Date', type:'date'},
        {name:'discharge_date', label:'Discharge Date', type:'date'},
      ],
      Bill: [
        {name:'patient_id', label:'Patient ID', type:'number', required:true},
        {name:'admission_id', label:'Admission ID', type:'number', required:true},
        {name:'amount', label:'Amount', type:'number'},
        {name:'payment_status', label:'Payment Status', type:'text'},
      ],
    };

    const form = document.getElementById('insertForm');
    const select = document.getElementById('insert_into');
    const container = document.getElementById('dynamicFields');

    function renderFields(kind) {
      container.innerHTML = '';
      fieldSets[kind].forEach(f => {
        const div = document.createElement('div');
        div.className = 'mb-3';
        let control = '';
        if (f.type === 'select') {
          const opts = f.options.map(o => `<option value="${o}">${o}</option>`).join('');
          control = `<select class="form-select" name="${f.name}" ${f.required ? 'required' : ''}>${opts}</select>`;
        } else {
          control = `<input class="form-control" name="${f.name}" type="${f.type}" ${f.required ? 'required' : ''} />`;
        }
        div.innerHTML = `<label class="form-label">${f.label}</label>${control}`;
        container.appendChild(div);
      });
    }

    renderFields(select.value);
    select.addEventListener('change', e => renderFields(e.target.value));
  </script>
</body>
</html>
