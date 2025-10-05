<?php
// Single-file HospitalDB web interface (login + admin)
// Default login for seed data: username=admin, password=admin123

declare(strict_types=1);

session_name('hospital_admin');
session_start();

// --- Configuration (edit if needed) ---
$DB_HOST = getenv('DB_HOST') ?: '127.0.0.1';
$DB_NAME = getenv('DB_NAME') ?: 'HospitalDB';
$DB_USER = getenv('DB_USER') ?: 'root';
$DB_PASS = getenv('DB_PASS') ?: '';
$DB_CHARSET = 'utf8mb4';

function getPdo(): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) { return $pdo; }
    global $DB_HOST, $DB_NAME, $DB_USER, $DB_PASS, $DB_CHARSET;
    $dsn = "mysql:host={$DB_HOST};dbname={$DB_NAME};charset={$DB_CHARSET}";
    $pdo = new PDO($dsn, $DB_USER, $DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}

function e(string $v): string { return htmlspecialchars($v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function isLoggedIn(): bool { return isset($_SESSION['auth']) && $_SESSION['auth'] === true; }

function getAllTableNames(PDO $pdo): array {
    $stmt = $pdo->query("SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_type = 'BASE TABLE' ORDER BY table_name");
    return array_map(fn($r) => $r['table_name'], $stmt->fetchAll());
}
function getAllViewNames(PDO $pdo): array {
    $stmt = $pdo->query("SELECT table_name FROM information_schema.tables WHERE table_schema = DATABASE() AND table_type = 'VIEW' ORDER BY table_name");
    return array_map(fn($r) => $r['table_name'], $stmt->fetchAll());
}

function fetchPairs(PDO $pdo, string $sql, string $key, string $label): array {
    $rows = $pdo->query($sql)->fetchAll();
    $out = [];
    foreach ($rows as $row) { $out[(string)$row[$key]] = (string)$row[$label]; }
    return $out;
}

$errors = [];
$notice = null;

// --- Actions ---
if (isset($_GET['logout'])) {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy();
    header('Location: index.php');
    exit;
}

if (($_POST['action'] ?? '') === 'login') {
    try {
        $pdo = getPdo();
        $username = trim((string)($_POST['username'] ?? ''));
        $password = (string)($_POST['password'] ?? '');
        $stmt = $pdo->prepare('SELECT AdminID, Username, Password FROM Admin WHERE Username = ?');
        $stmt->execute([$username]);
        $admin = $stmt->fetch();
        if ($admin && password_verify($password, (string)$admin['Password'])) {
            $_SESSION['auth'] = true;
            $_SESSION['username'] = $admin['Username'];
            $_SESSION['admin_id'] = (int)$admin['AdminID'];
            header('Location: index.php');
            exit;
        } else {
            $errors[] = 'Invalid username or password.';
        }
    } catch (Throwable $t) {
        $errors[] = 'Login failed: ' . $t->getMessage();
    }
}

if (isLoggedIn() && (($_POST['action'] ?? '') === 'insert')) {
    $table = (string)($_POST['table'] ?? '');
    try {
        $pdo = getPdo();
        switch ($table) {
            case 'Patient': {
                $stmt = $pdo->prepare('INSERT INTO Patient (Name, Age, Gender, ContactNo, Address, Disease) VALUES (?, ?, ?, ?, ?, ?)');
                $stmt->execute([
                    trim((string)($_POST['Name'] ?? '')),
                    $_POST['Age'] !== '' ? (int)$_POST['Age'] : null,
                    trim((string)($_POST['Gender'] ?? '')),
                    trim((string)($_POST['ContactNo'] ?? '')),
                    trim((string)($_POST['Address'] ?? '')),
                    trim((string)($_POST['Disease'] ?? '')),
                ]);
                $notice = 'Inserted new Patient.';
                break;
            }
            case 'Department': {
                $stmt = $pdo->prepare('INSERT INTO Department (DepartmentID, DepartmentName, Location) VALUES (?, ?, ?)');
                $stmt->execute([
                    (int)($_POST['DepartmentID'] ?? 0),
                    trim((string)($_POST['DepartmentName'] ?? '')),
                    trim((string)($_POST['Location'] ?? '')),
                ]);
                $notice = 'Inserted new Department.';
                break;
            }
            case 'Doctor': {
                $stmt = $pdo->prepare('INSERT INTO Doctor (Name, Specialization, ContactNo, DepartmentID) VALUES (?, ?, ?, ?)');
                $stmt->execute([
                    trim((string)($_POST['Name'] ?? '')),
                    trim((string)($_POST['Specialization'] ?? '')),
                    trim((string)($_POST['ContactNo'] ?? '')),
                    $_POST['DepartmentID'] !== '' ? (int)$_POST['DepartmentID'] : null,
                ]);
                $notice = 'Inserted new Doctor.';
                break;
            }
            case 'Room': {
                $stmt = $pdo->prepare("INSERT INTO Room (RoomType, Availability) VALUES (?, ?)");
                $stmt->execute([
                    trim((string)($_POST['RoomType'] ?? '')),
                    trim((string)($_POST['Availability'] ?? 'Yes')),
                ]);
                $notice = 'Inserted new Room.';
                break;
            }
            case 'Appointment': {
                $stmt = $pdo->prepare('INSERT INTO Appointment (PatientID, DoctorID, AppointmentDate, Status) VALUES (?, ?, ?, ?)');
                $stmt->execute([
                    $_POST['PatientID'] !== '' ? (int)$_POST['PatientID'] : null,
                    $_POST['DoctorID'] !== '' ? (int)$_POST['DoctorID'] : null,
                    ($_POST['AppointmentDate'] ?? '') !== '' ? (string)$_POST['AppointmentDate'] : null,
                    trim((string)($_POST['Status'] ?? '')),
                ]);
                $notice = 'Inserted new Appointment.';
                break;
            }
            case 'Admission': {
                $stmt = $pdo->prepare('INSERT INTO Admission (PatientID, RoomID, AdmissionDate, DischargeDate) VALUES (?, ?, ?, ?)');
                $discharge = trim((string)($_POST['DischargeDate'] ?? ''));
                $stmt->execute([
                    $_POST['PatientID'] !== '' ? (int)$_POST['PatientID'] : null,
                    $_POST['RoomID'] !== '' ? (int)$_POST['RoomID'] : null,
                    ($_POST['AdmissionDate'] ?? '') !== '' ? (string)$_POST['AdmissionDate'] : null,
                    $discharge !== '' ? $discharge : null,
                ]);
                $notice = 'Inserted new Admission.';
                break;
            }
            case 'Bill': {
                $stmt = $pdo->prepare('INSERT INTO Bill (PatientID, AdmissionID, Amount, PaymentStatus) VALUES (?, ?, ?, ?)');
                $stmt->execute([
                    $_POST['PatientID'] !== '' ? (int)$_POST['PatientID'] : null,
                    $_POST['AdmissionID'] !== '' ? (int)$_POST['AdmissionID'] : null,
                    $_POST['Amount'] !== '' ? (int)$_POST['Amount'] : null,
                    trim((string)($_POST['PaymentStatus'] ?? '')),
                ]);
                $notice = 'Inserted new Bill.';
                break;
            }
            default:
                $errors[] = 'Unknown table for insert.';
        }
    } catch (Throwable $t) {
        $errors[] = 'Insert failed: ' . $t->getMessage();
    }
}

function renderHeader(string $title = 'HospitalDB'): void {
    echo '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">';
    echo '<title>' . e($title) . '</title>';
    echo '<style>';
    echo 'body{margin:0;background:#0f172a;color:#e5e7eb;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,Helvetica,Arial}';
    echo '.wrap{max-width:1100px;margin:0 auto;padding:24px}';
    echo '.card{background:#0b1220;border:1px solid #1f2937;border-radius:14px;padding:24px;box-shadow:0 10px 30px rgba(0,0,0,.35)}';
    echo '.title{font-size:22px;font-weight:700;margin:0 0 16px}';
    echo '.muted{color:#9ca3af}';
    echo '.grid{display:grid;gap:16px} .two{grid-template-columns:repeat(2,minmax(0,1fr))}';
    echo '@media(max-width:800px){.two{grid-template-columns:1fr}}';
    echo 'input,select,textarea{width:100%;background:#0b1220;border:1px solid #1f2937;color:#e5e7eb;padding:10px 12px;border-radius:10px}';
    echo 'label{font-size:12px;color:#9ca3af;display:block;margin-bottom:6px}';
    echo '.btn{appearance:none;border:none;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer;color:#06202a;background:linear-gradient(135deg,#06b6d4,#22d3ee);box-shadow:0 4px 14px rgba(34,211,238,.35)}';
    echo '.btn.secondary{background:#1f2937;color:#e5e7eb;box-shadow:none;border:1px solid #1f2937}';
    echo '.row{display:flex;gap:12px;align-items:center;flex-wrap:wrap}';
    echo '.table{overflow:auto;border:1px solid #1f2937;border-radius:12px;margin-top:12px} table{width:100%;border-collapse:collapse} th,td{padding:10px 12px;border-bottom:1px solid #1f2937;text-align:left} th{background:#0e1726;font-weight:700}';
    echo '.notice{padding:12px 14px;border:1px solid #1f2937;border-radius:10px;background:#0e1726;margin-bottom:12px} .err{border-color:#450a0a;color:#fecaca} .ok{border-color:#064e3b;color:#bbf7d0}';
    echo 'a{color:#22d3ee;text-decoration:none} a:hover{text-decoration:underline}';
    echo '</style></head><body><div class="wrap">';
}

function renderFooter(): void { echo '<footer class="muted" style="margin-top:20px">Minimal single-file app • HospitalDB</footer></div></body></html>'; }

function renderLogin(array $errors): void {
    renderHeader('Login • HospitalDB');
    echo '<div class="card">';
    echo '<h1 class="title">Admin Login</h1>';
    echo '<p class="muted">Use your admin credentials to continue.</p>';
    if ($errors) {
        echo '<div class="notice err">' . e(implode("\n", $errors)) . '</div>';
    }
    echo '<!-- Default login for seed data: username=admin, password=admin123 -->';
    echo '<form method="post" autocomplete="off" style="margin-top:16px">';
    echo '<input type="hidden" name="action" value="login">';
    echo '<div class="grid">';
    echo '<div><label>Username</label><input name="username" required></div>';
    echo '<div><label>Password</label><input type="password" name="password" required></div>';
    echo '</div>';
    echo '<div style="margin-top:16px" class="row"><button class="btn" type="submit">Login</button></div>';
    echo '</form>';
    echo '</div>';
    renderFooter();
}

function renderInsertSection(PDO $pdo): void {
    $insertTables = ['Patient','Department','Doctor','Room','Appointment','Admission','Bill'];
    $chosen = (string)($_GET['insert_table'] ?? ($insertTables[0] ?? ''));

    echo '<div class="card" style="margin-top:16px">';
    echo '<h2 class="title" style="font-size:18px">Insert Data</h2>';

    echo '<form method="get" class="row" style="margin-bottom:12px">';
    echo '<input type="hidden" name="tab" value="insert">';
    echo '<label>Choose table</label>';
    echo '<select name="insert_table" onchange="this.form.submit()">';
    foreach ($insertTables as $t) { $sel = $t === $chosen ? 'selected' : ''; echo '<option '.$sel.' value="'.e($t).'">'.e($t).'</option>'; }
    echo '</select>';
    echo '<noscript><button class="btn secondary" type="submit">Load</button></noscript>';
    echo '</form>';

    echo '<form method="post">';
    echo '<input type="hidden" name="action" value="insert">';
    echo '<input type="hidden" name="table" value="'.e($chosen).'">';

    if ($chosen === 'Patient') {
        echo '<div class="grid two">';
        echo '<div><label>Name</label><input name="Name" required></div>';
        echo '<div><label>Age</label><input type="number" name="Age" min="0"></div>';
        echo '<div><label>Gender</label><select name="Gender"><option>Male</option><option>Female</option><option>Other</option></select></div>';
        echo '<div><label>Contact No</label><input name="ContactNo"></div>';
        echo '<div><label>Address</label><input name="Address"></div>';
        echo '<div><label>Disease</label><input name="Disease"></div>';
        echo '</div>';
    } elseif ($chosen === 'Department') {
        echo '<div class="grid two">';
        echo '<div><label>Department ID</label><input type="number" name="DepartmentID" required></div>';
        echo '<div><label>Department Name</label><input name="DepartmentName" required></div>';
        echo '<div><label>Location</label><input name="Location"></div>';
        echo '</div>';
    } elseif ($chosen === 'Doctor') {
        $dept = fetchPairs($pdo, 'SELECT DepartmentID, DepartmentName FROM Department ORDER BY DepartmentName', 'DepartmentID', 'DepartmentName');
        echo '<div class="grid two">';
        echo '<div><label>Name</label><input name="Name" required></div>';
        echo '<div><label>Specialization</label><input name="Specialization"></div>';
        echo '<div><label>Contact No</label><input name="ContactNo"></div>';
        echo '<div><label>Department</label><select name="DepartmentID">';
        echo '<option value="">-- None --</option>';
        foreach ($dept as $k=>$v) { echo '<option value="'.e($k).'">'.e($v).' ('.e($k).')</option>'; }
        echo '</select></div>';
        echo '</div>';
    } elseif ($chosen === 'Room') {
        echo '<div class="grid two">';
        echo '<div><label>Room Type</label><input name="RoomType"></div>';
        echo '<div><label>Availability</label><select name="Availability"><option>Yes</option><option>No</option></select></div>';
        echo '</div>';
    } elseif ($chosen === 'Appointment') {
        $patients = fetchPairs($pdo, 'SELECT PatientID, Name FROM Patient ORDER BY Name', 'PatientID', 'Name');
        $doctors  = fetchPairs($pdo, 'SELECT DoctorID, Name FROM Doctor ORDER BY Name', 'DoctorID', 'Name');
        echo '<div class="grid two">';
        echo '<div><label>Patient</label><select name="PatientID">';
        echo '<option value="">-- Select --</option>';
        foreach ($patients as $k=>$v) { echo '<option value="'.e($k).'">'.e($v).' ('.e($k).')</option>'; }
        echo '</select></div>';
        echo '<div><label>Doctor</label><select name="DoctorID">';
        echo '<option value="">-- Select --</option>';
        foreach ($doctors as $k=>$v) { echo '<option value="'.e($k).'">'.e($v).' ('.e($k).')</option>'; }
        echo '</select></div>';
        echo '<div><label>Appointment Date</label><input type="date" name="AppointmentDate"></div>';
        echo '<div><label>Status</label><select name="Status"><option>Scheduled</option><option>Completed</option><option>Cancelled</option></select></div>';
        echo '</div>';
    } elseif ($chosen === 'Admission') {
        $patients = fetchPairs($pdo, 'SELECT PatientID, Name FROM Patient ORDER BY Name', 'PatientID', 'Name');
        $rooms    = fetchPairs($pdo, 'SELECT RoomID, CONCAT(RoomType, " (", Availability, ")") AS label FROM Room ORDER BY RoomID', 'RoomID', 'label');
        echo '<div class="grid two">';
        echo '<div><label>Patient</label><select name="PatientID">';
        echo '<option value="">-- Select --</option>';
        foreach ($patients as $k=>$v) { echo '<option value="'.e($k).'">'.e($v).' ('.e($k).')</option>'; }
        echo '</select></div>';
        echo '<div><label>Room</label><select name="RoomID">';
        echo '<option value="">-- Select --</option>';
        foreach ($rooms as $k=>$v) { echo '<option value="'.e($k).'">'.e($v).' ('.e($k).')</option>'; }
        echo '</select></div>';
        echo '<div><label>Admission Date</label><input type="date" name="AdmissionDate"></div>';
        echo '<div><label>Discharge Date</label><input type="date" name="DischargeDate"></div>';
        echo '</div>';
    } elseif ($chosen === 'Bill') {
        $patients  = fetchPairs($pdo, 'SELECT PatientID, Name FROM Patient ORDER BY Name', 'PatientID', 'Name');
        $admission = fetchPairs($pdo, 'SELECT AdmissionID, AdmissionID AS label FROM Admission ORDER BY AdmissionID', 'AdmissionID', 'label');
        echo '<div class="grid two">';
        echo '<div><label>Patient</label><select name="PatientID">';
        echo '<option value="">-- Select --</option>';
        foreach ($patients as $k=>$v) { echo '<option value="'.e($k).'">'.e($v).' ('.e($k).')</option>'; }
        echo '</select></div>';
        echo '<div><label>Admission</label><select name="AdmissionID">';
        echo '<option value="">-- Select --</option>';
        foreach ($admission as $k=>$v) { echo '<option value="'.e($k).'">#'.e($v).'</option>'; }
        echo '</select></div>';
        echo '<div><label>Amount</label><input type="number" name="Amount" min="0" step="1"></div>';
        echo '<div><label>Payment Status</label><select name="PaymentStatus"><option>Pending</option><option>Paid</option></select></div>';
        echo '</div>';
    } else {
        echo '<p class="muted">Choose a table to insert.</p>';
    }

    echo '<div style="margin-top:16px" class="row"><button class="btn" type="submit">Insert</button></div>';
    echo '</form>';
    echo '</div>';
}

function renderViewSection(PDO $pdo, ?string $selectedName = null): void {
    $tables = getAllTableNames($pdo);
    $views  = getAllViewNames($pdo);
    $all = array_merge($tables, $views);
    $name = $selectedName ?: (count($all) ? $all[0] : '');

    echo '<div class="card" style="margin-top:16px">';
    echo '<h2 class="title" style="font-size:18px">View Data</h2>';

    echo '<form method="get" class="row">';
    echo '<input type="hidden" name="tab" value="view">';
    echo '<label>Choose table/view</label>';
    echo '<select name="view_name" onchange="this.form.submit()">';
    foreach ($tables as $t) { $sel = $t === $name ? 'selected' : ''; echo '<option '.$sel.' value="'.e($t).'">'.e($t).' (table)</option>'; }
    foreach ($views as $v) { $sel = $v === $name ? 'selected' : ''; echo '<option '.$sel.' value="'.e($v).'">'.e($v).' (view)</option>'; }
    echo '</select>';
    echo '<noscript><button class="btn secondary" type="submit">Load</button></noscript>';
    echo '</form>';

    if ($name !== '') {
        try {
            $stmt = $pdo->query('SELECT * FROM `'.str_replace('`','``',$name).'` LIMIT 250');
            $rows = $stmt->fetchAll();
            if (!$rows) {
                echo '<div class="notice muted">No rows.</div>';
            } else {
                $cols = array_keys($rows[0]);
                echo '<div class="table"><table><thead><tr>';
                foreach ($cols as $c) { echo '<th>'.e((string)$c).'</th>'; }
                echo '</tr></thead><tbody>';
                foreach ($rows as $r) {
                    echo '<tr>';
                    foreach ($cols as $c) { $val = $r[$c]; echo '<td>'.e((string)($val === null ? 'NULL' : (string)$val)).'</td>'; }
                    echo '</tr>';
                }
                echo '</tbody></table></div>';
            }
        } catch (Throwable $t) {
            echo '<div class="notice err">Query failed: '.e($t->getMessage()).'</div>';
        }
    }

    echo '</div>';
}

function renderDashboard(?string $notice, array $errors): void {
    renderHeader('Dashboard • HospitalDB');
    echo '<div class="card">';
    echo '<div class="row" style="justify-content:space-between">';
    echo '<div><h1 class="title" style="margin:0">Hospital Admin</h1><div class="muted">Signed in as '.e((string)($_SESSION['username'] ?? 'admin')).'</div></div>';
    echo '<div class="row"><a class="btn secondary" href="?logout=1">Logout</a></div>';
    echo '</div>';

    if ($notice) { echo '<div class="notice ok">'.e($notice).'</div>'; }
    if ($errors) { echo '<div class="notice err">'.e(implode("\n", $errors)).'</div>'; }

    try { $pdo = getPdo(); }
    catch (Throwable $t) { echo '<div class="notice err">DB connection failed: '.e($t->getMessage()).'</div>'; renderFooter(); return; }

    // Tabs via query param
    $tab = (string)($_GET['tab'] ?? 'insert');
    echo '<div class="row" style="gap:8px;margin:8px 0 4px">';
    echo '<a class="btn secondary" href="?tab=insert">Insert</a>';
    echo '<a class="btn secondary" href="?tab=view">View</a>';
    echo '</div>';
    echo '</div>';

    if ($tab === 'view') {
        $viewName = isset($_GET['view_name']) ? (string)$_GET['view_name'] : null;
        renderViewSection($pdo, $viewName);
    } else {
        renderInsertSection($pdo);
    }

    renderFooter();
}

// --- Route ---
if (!isLoggedIn()) { renderLogin($errors); }
else { renderDashboard($notice, $errors); }
