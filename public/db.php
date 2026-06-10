<?php
// db.php — настройки подключения к базе данных
$host = 'localhost';
$dbname = 'goryunhu_commun';       // замените на своё
$username = 'goryunhu';  // замените на своё
$password = 'zRZ4oCo2J9fP';      // замените на свой

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Ошибка сервера']);
    exit;
}
?>