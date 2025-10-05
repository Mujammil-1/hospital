<?php
require_once __DIR__ . '/../includes/auth.php';

start_session();
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($username === '' || $password === '') {
        $error = 'Username and password are required';
    } else if (login($username, $password)) {
        header('Location: /index.php');
        exit;
    } else {
        $error = 'Invalid credentials';
    }
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Hospital Management - Login</title>
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <div class="container narrow">
    <h1>Hospital Management System</h1>
    <form method="post" class="card">
      <h2>Admin Login</h2>
      <?php if ($error): ?>
        <div class="alert error"><?= h($error) ?></div>
      <?php endif; ?>
      <label>
        <span>Username</span>
        <input type="text" name="username" required />
      </label>
      <label>
        <span>Password</span>
        <input type="password" name="password" required />
      </label>
      <button type="submit">Login</button>
    </form>
  </div>
</body>
</html>
