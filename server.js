const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));
app.use(bodyParser.json());

// Правильный путь к статическим файлам
app.use(express.static(path.join(__dirname, 'public')));

// Обработка корневого пути
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Обработка всех HTML-страниц
app.get('/:path*.html', (req, res) => {
  const filePath = req.params.path + req.params[0];
  res.sendFile(path.join(__dirname, 'public', filePath));
});

// API: сохранение заявки
app.post('/api/submit-request', (req, res) => {
  const { name, phone, service, type } = req.body;

  console.log('Получен запрос:', { name, phone, service, type });

  if (!name || !phone || !type) {
    console.error('❌ Ошибка: отсутствуют обязательные поля');
    return res.status(400).json({ 
      error: 'Имя, телефон и тип обязательны',
      details: { name, phone, service, type }
    });
  }

  // Здесь будет код сохранения в базу данных
  console.log('✅ Заявка сохранена');
  
  res.json({ success: true });
});

// Проверка работы
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Обработка OPTIONS запросов для CORS
app.options('*', cors());

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
  console.log('Откройте в браузере: http://localhost:3000');
});