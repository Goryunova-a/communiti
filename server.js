const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg'); // Библиотека для PostgreSQL

const app = express();
const PORT = process.env.PORT || 3000;

// --- Настройка базы данных PostgreSQL ---
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ссылка берется из переменных окружения
  ssl: {
    rejectUnauthorized: false // Обязательно для Render
  }
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://ВАШ_САЙТ.onrender.com'], // Замените на ваш адрес
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Создание таблицы при запуске
pool.query(`
  CREATE TABLE IF NOT EXISTS requests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    service TEXT,
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) console.error('❌ Ошибка создания таблицы:', err);
  else console.log('✅ База данных подключена, таблица готова');
});

// --- API Маршруты ---

// 1. Проверка здоровья
app.get('/health', (req, res) => {
  res.json({ status: 'ok', db: 'connected' });
});

// 2. Прием заявки
app.post('/api/submit-request', async (req, res) => {
  const { name, phone, service, type } = req.body;

  if (!name || !phone || !type) {
    return res.status(400).json({ error: 'Заполните все обязательные поля' });
  }

  try {
    // SQL запрос для вставки данных
    const result = await pool.query(
      'INSERT INTO requests (name, phone, service, type) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, phone, service || null, type]
    );
    
    console.log('✅ Заявка сохранена под ID:', result.rows[0].id);
    res.json({ success: true, id: result.rows[0].id });
    
  } catch (err) {
    console.error('❌ Ошибка при сохранении:', err);
    res.status(500).json({ error: 'Ошибка сервера при сохранении' });
  }
});

// --- Запуск сервера ---
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});