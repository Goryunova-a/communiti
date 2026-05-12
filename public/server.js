const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Подключение к SQLite
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) console.error('❌ Ошибка БД:', err.message);
  else console.log('✅ Подключено к SQLite');
});

// Создание таблицы при старте
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      service TEXT,
      type TEXT NOT NULL, -- 'audit', 'service', 'calculator'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// API: сохранение заявки
app.post('/api/submit-request', (req, res) => {
  const { name, phone, service, type } = req.body;

  if (!name || !phone || !type) {
    return res.status(400).json({ error: 'Имя, телефон и тип обязательны' });
  }

  const stmt = db.prepare(
    'INSERT INTO requests (name, phone, service, type) VALUES (?, ?, ?, ?)'
  );
  
  stmt.run([name, phone, service || null, type], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Ошибка сохранения' });
    }
    res.json({ success: true, id: this.lastID });
  });
  
  stmt.finalize();
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});
