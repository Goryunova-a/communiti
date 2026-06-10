<?php
// process.php — обработчик заявок
header('Content-Type: application/json; charset=utf-8');
require_once 'db.php';

// 1. Принимаем JSON от фронтенда
$input = json_decode(file_get_contents('php://input'), true);

// 2. Базовая валидация
if (empty($input['name']) || empty($input['phone'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Заполните все поля']);
    exit;
}

// 3. Проверка согласия на обработку ПД (ФЗ-152)
if (empty($input['consent']) || $input['consent'] !== true) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Необходимо согласие на обработку персональных данных']);
    exit;
}

// 4. Санитизация (защита от XSS)
$name = htmlspecialchars(trim($input['name']), ENT_QUOTES, 'UTF-8');
$phone = preg_replace('/[^0-9\+\-\(\)\s]/', '', $input['phone']);

// Проверка длины имени
if (mb_strlen($name) < 2 || mb_strlen($name) > 100) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Некорректное имя']);
    exit;
}

// Проверка длины телефона (минимум 10 цифр)
if (preg_replace('/[^0-9]/', '', $phone) < 10) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Некорректный номер телефона']);
    exit;
}

// 5. Сохранение в БД (PDO — защита от SQL-инъекций)
try {
    $stmt = $pdo->prepare("
        INSERT INTO requests (name, phone, consent) 
        VALUES (:name, :phone, 1)
    ");
    
    $stmt->execute([
        ':name' => $name,
        ':phone' => $phone
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Спасибо! Мы перезвоним вам в течение 15 минут.'
    ]);

} catch (PDOException $e) {
    error_log("DB Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Ошибка при сохранении заявки']);
}
?>