<?php
require_once __DIR__ . '/../includes/auth.php';
require_auth();
require_once __DIR__ . '/../includes/db.php';

$pdo = get_pdo();

// List of tables and views to display
$entities = [
  'Patient', 'Department', 'Doctor', 'Room', 'Appointment', 'Admission', 'Bill',
  'vw_Doctors', 'vw_Appointments', 'vw_Admissions', 'vw_Bills'
];

$selected = $_GET['entity'] ?? $entities[0];
if (!in_array($selected, $entities, true)) {
    $selected = $entities[0];
}

$rows = [];
$columns = [];
$error = '';
try {
    $stmt = $pdo->query("SELECT * FROM `{$selected}` LIMIT 200");
    $rows = $stmt->fetchAll();
    if ($rows) {
        $columns = array_keys($rows[0]);
    } else {
        // get columns via DESCRIBE
        $desc = $pdo->query("DESCRIBE `{$selected}`")->fetchAll();
        $columns = array_column($desc, 'Field');
    }
} catch (Throwable $e) {
    $error = $e->getMessage();
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>View Data</title>
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <div class="container">
    <header class="topbar">
      <h1>View Data</h1>
      <nav>
        <a href="/index.php">Home</a>
        <a href="/view.php">View Data</a>
        <a href="/logout.php">Logout</a>
      </nav>
    </header>

    <form method="get" class="card">
      <label>
        <span>Entity</span>
        <select name="entity" onchange="this.form.submit()">
          <?php foreach ($entities as $e): ?>
            <option value="<?= h($e) ?>" <?= $e === $selected ? 'selected' : '' ?>><?= h($e) ?></option>
          <?php endforeach; ?>
        </select>
      </label>
    </form>

    <?php if ($error): ?><div class="alert error"><?= h($error) ?></div><?php endif; ?>

    <div class="table-wrap card">
      <table>
        <thead>
          <tr>
            <?php foreach ($columns as $c): ?>
              <th><?= h($c) ?></th>
            <?php endforeach; ?>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($rows as $row): ?>
            <tr>
              <?php foreach ($columns as $c): ?>
                <td><?= h((string)($row[$c] ?? '')) ?></td>
              <?php endforeach; ?>
            </tr>
          <?php endforeach; ?>
          <?php if (!$rows): ?>
            <tr><td colspan="<?= count($columns) ?>">No data</td></tr>
          <?php endif; ?>
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>
