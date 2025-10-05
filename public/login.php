<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once __DIR__ . '/db.php';

function h($v){return htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');}

$redirect = $_GET['redirect'] ?? $_POST['redirect'] ?? '/index.php';
$error = null;
$info = null;

// Ensure AdminUser table exists and seed default admin if empty
try {
    $pdo->exec('CREATE TABLE IF NOT EXISTS AdminUser (
        AdminID INT AUTO_INCREMENT PRIMARY KEY,
        Username VARCHAR(50) NOT NULL UNIQUE,
        PasswordHash VARCHAR(255) NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )');

    $count = (int)$pdo->query('SELECT COUNT(*) FROM AdminUser')->fetchColumn();
    if ($count === 0) {
        $defaultUsername = 'admin';
        $defaultPassword = 'admin123';
        $hash = password_hash($defaultPassword, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare('INSERT INTO AdminUser (Username, PasswordHash) VALUES (?, ?)');
        $stmt->execute([$defaultUsername, $hash]);
        $info = 'Default admin created (admin / admin123). Please change it after login.';
    }
} catch (Throwable $e) {
    $error = 'Setup error: ' . $e->getMessage();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !$error) {
    $username = trim($_POST['username'] ?? '');
    $password = (string)($_POST['password'] ?? '');

    if ($username === '' || $password === '') {
        $error = 'Please enter username and password.';
    } else {
        try {
            $stmt = $pdo->prepare('SELECT AdminID, Username, PasswordHash FROM AdminUser WHERE Username = ?');
            $stmt->execute([$username]);
            $user = $stmt->fetch();
            if (!$user || !password_verify($password, $user['PasswordHash'])) {
                $error = 'Invalid credentials.';
            } else {
                $_SESSION['admin_id'] = (int)$user['AdminID'];
                $_SESSION['admin_username'] = $user['Username'];
                header('Location: ' . $redirect);
                exit;
            }
        } catch (Throwable $e) {
            $error = 'Login error: ' . $e->getMessage();
        }
    }
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Admin Login - Hospital Management System</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link href="/assets/styles.css" rel="stylesheet" />
</head>
<body class="bg-light">
  <div class="container py-5" style="max-width: 520px;">
    <div class="app-header mb-4">
      <img src="/assets/hospital-logo.svg" alt="Hospital Logo" class="app-logo" />
      <h1 class="app-title">Admin Login</h1>
    </div>

    <?php if ($info): ?><div class="alert alert-info"><?= h($info) ?></div><?php endif; ?>
    <?php if ($error): ?><div class="alert alert-danger"><?= h($error) ?></div><?php endif; ?>

    <div class="card">
      <div class="card-body">
        <form method="post" action="/login.php">
          <input type="hidden" name="redirect" value="<?= h($redirect) ?>" />
          <div class="mb-3">
            <label class="form-label" for="username">Username</label>
            <input class="form-control" type="text" id="username" name="username" required autofocus />
          </div>
          <div class="mb-3">
            <label class="form-label" for="password">Password</label>
            <input class="form-control" type="password" id="password" name="password" required />
          </div>
          <div class="d-grid gap-2">
            <button class="btn btn-primary" type="submit">Sign In</button>
          </div>
        </form>
        <div class="mt-3 text-muted" style="font-size: .9rem;">
          Default credentials on first run: <strong>admin</strong> / <strong>admin123</strong>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
