// Якорная навигация
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 60,
        behavior: 'smooth'
      });
      document.querySelectorAll('.nav a').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    }
  });
});

// Кнопка АУДИТ
document.getElementById('audit').addEventListener('click', () => {
  document.querySelector('#contacts').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Видео-модалка
const modal = document.getElementById('video-modal');
const closeModal = document.querySelector('.modal-close');
const videoIframe = document.getElementById('video-iframe');
const reviewButtons = document.querySelectorAll('.btn-review');

// Массив с данными для ваших видео из VK
const vkVideos = [
  {
    owner_id: '-201030809',
    video_id: '456239034',
    hash: '217c46967d575b0c5c'
  },
  {
    owner_id: '-201030809',
    video_id: '456239038',
    hash: 'c514cfc89c771ab6df'
  },
  {
    owner_id: '-201030809',
    video_id: '456239040',
    hash: '5f65d11f8b218fa1ab'
  },
  {
    owner_id: '-201030809',
    video_id: '456239041',
    hash: '355168e9d4f56cd73c'
  }
];

reviewButtons.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    modal.style.display = 'flex';
    
    // Получаем данные для текущего видео
    const videoData = vkVideos[index % vkVideos.length];
    
    // Формируем URL для VK видео
    videoIframe.src = `https://vk.com/video_ext.php?oid=${videoData.owner_id}&id=${videoData.video_id}&hash=${videoData.hash}&autoplay=1`;
  });
});

// Обработчик закрытия модального окна
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
  videoIframe.src = ''; // Очищаем источник видео при закрытии
});

// Закрытие модального окна при клике на overlay
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    videoIframe.src = '';
  }
});

// СТРЕЛКИ ДЛЯ КЕЙСОВ
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.cases-grid');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  if (!grid || !prevBtn || !nextBtn) return;

  const cardWidth = 300;
  const gap = 30;
  const step = cardWidth + gap;

  prevBtn.addEventListener('click', () => {
    grid.scrollBy({ left: -step, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    grid.scrollBy({ left: step, behavior: 'smooth' });
  });

  const updateButtons = () => {
    const { scrollLeft, scrollWidth, clientWidth } = grid;
    prevBtn.disabled = scrollLeft <= 0;
    nextBtn.disabled = scrollLeft >= scrollWidth - clientWidth;
  };

  grid.addEventListener('scroll', updateButtons);
  updateButtons();
});

document.addEventListener('DOMContentLoaded', function() {
  const bookPages = document.querySelector('.book-pages');
  const prevArrow = document.querySelector('.page-arrow.prev');
  const nextArrow = document.querySelector('.page-arrow.next');
  
  let currentPage = 0;
  const totalPages = 5;
  
  // Функция для обновления видимости стрелок
  function updateArrows() {
    prevArrow.classList.toggle('show', currentPage > 0);
    nextArrow.classList.toggle('show', currentPage < totalPages - 1);
  }
  
  // Инициализация стрелок
  updateArrows();
  
  // Обработчик для стрелок
  prevArrow.addEventListener('click', function() {
    if (currentPage > 0) {
      currentPage--;
      bookPages.scrollBy({
        left: -bookPages.offsetWidth,
        behavior: 'smooth'
      });
      updateArrows();
    }
  });
  
  nextArrow.addEventListener('click', function() {
    if (currentPage < totalPages - 1) {
      currentPage++;
      bookPages.scrollBy({
        left: bookPages.offsetWidth,
        behavior: 'smooth'
      });
      updateArrows();
    }
  });
  
  // Обработка скролла
  bookPages.addEventListener('scroll', function() {
    const scrollPosition = bookPages.scrollLeft;
    const pageWidth = bookPages.offsetWidth;
    currentPage = Math.round(scrollPosition / pageWidth);
    updateArrows();
  });
  
  // Обработка скролла мыши
  let isScrolling = false;
  bookPages.addEventListener('wheel', function(e) {
    if (isScrolling) return;
    isScrolling = true;
    
    setTimeout(() => {
      isScrolling = false;
    }, 100);
    
    const delta = e.deltaY;
    if (delta > 0) {
      // Прокрутка вниз
      if (currentPage < totalPages - 1) {
        currentPage++;
        bookPages.scrollBy({
          left: bookPages.offsetWidth,
          behavior: 'smooth'
        });
      }
    } else {
      // Прокрутка вверх
      if (currentPage > 0) {
        currentPage--;
        bookPages.scrollBy({
          left: -bookPages.offsetWidth,
          behavior: 'smooth'
        });
      }
    }
    
    updateArrows();
  });
});

// Обработчик для кнопок "Оставить заявку"
document.addEventListener('DOMContentLoaded', function() {
  // Получаем все кнопки "Оставить заявку" на странице
  const applyButtons = document.querySelectorAll('.btn-apply, .btn-submit, .btn');
  
  // Добавляем обработчик клика для каждой кнопки
  applyButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Прокручиваем к блоку контактов
      const contactsSection = document.getElementById('contacts');
      
      if (contactsSection) {
        contactsSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        // Если блок контактов не найден, прокручиваем к верху страницы
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
  });
});





// Функция отправки заявки
async function submitRequest(name, phone, service, type) {
  try {
    const response = await fetch('/api/submit-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, service, type })
    });

    const result = await response.json();
    if (result.success) {
      alert('✅ Заявка отправлена! Мы свяжемся с вами в течение 15 минут.');
      return true;
    } else {
      alert('❌ Ошибка: ' + (result.error || 'Неизвестная ошибка'));
      return false;
    }
  } catch (error) {
    console.error('Ошибка сети:', error);
    alert('⚠️ Не удалось отправить заявку. Попробуйте позже.');
    return false;
  }
}

// Пример использования для кнопки "Аудит"
document.querySelector('.audit-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('input[name="name"]').value;
  const phone = form.querySelector('input[name="phone"]').value;
  
  if (await submitRequest(name, phone, null, 'audit')) {
    form.reset();
    document.getElementById('audit-modal').style.display = 'none';
  }
});

// Для формы "Услуги" или "Калькулятор"
document.querySelector('.service-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('input[name="name"]').value;
  const phone = form.querySelector('input[name="phone"]').value;
  const service = form.querySelector('select[name="service"]')?.value || null;
  
  if (await submitRequest(name, phone, service, 'service')) {
    form.reset();
    document.getElementById('service-modal').style.display = 'none';
  }
});

// === НОВЫЙ БУРГЕР ===
const burgerBtn = document.getElementById('newBurger');
const mobileMenu = document.getElementById('newMobileMenu');

if (burgerBtn && mobileMenu) {
  burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  // Закрывать меню при клике на ссылку
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burgerBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });
}


document.addEventListener('DOMContentLoaded', function() {
  // Находим все страницы
  const pages = document.querySelectorAll('.page');
  
  pages.forEach(function(page) {
    page.addEventListener('click', function() {
      // Закрываем все остальные
      pages.forEach(function(p) {
        if (p !== this) {
          p.classList.remove('active');
        }
      }, this);
      
      // Переключаем текущую
      this.classList.toggle('active');
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const pages = document.querySelectorAll('.page');
  
  // === 1. ОБРАБОТКА КЛИКА ===
  pages.forEach(function(page) {
    page.addEventListener('click', function() {
      // Закрываем все остальные
      pages.forEach(function(p) {
        if (p !== this) {
          p.classList.remove('active');
        }
      }, this);
      
      // Переключаем текущую
      this.classList.toggle('active');
    });
  });
  
  // === 2. ОБРАБОТКА СКРОЛЛА (Intersection Observer) ===
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      const page = entry.target;
      
      if (entry.isIntersecting) {
        // Карточка появилась на экране — показываем
        page.classList.add('in-view');
      } else {
        // Карточка ушла с экрана — скрываем
        page.classList.remove('in-view');
      }
    });
  }, {
    threshold: 0.5, // Срабатывает, когда 50% карточки видно
    rootMargin: '0px 0px -50px 0px' // Небольшой отступ снизу
  });
  
  // Наблюдаем за каждой карточкой
  pages.forEach(function(page) {
    observer.observe(page);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const pages = document.querySelectorAll('.page');

  // 1. Настройка наблюдателя за скроллом
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Если карточка видна хотя бы на 30%
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        // Если ушла с экрана — скрываем (для повторного эффекта)
        entry.target.classList.remove('visible');
      }
    });
  }, {
    threshold: 0.3, // 30% карточки должно быть видно
    rootMargin: '0px 0px -50px 0px' // Чуть раньше срабатывать
  });

  // 2. Запускаем наблюдение и клик
  pages.forEach(page => {
    observer.observe(page); // Следим за скроллом
    
    // Следим за кликом
    page.addEventListener('click', function() {
      // Если кликнули, закрываем остальные
      pages.forEach(p => {
        if (p !== this) p.classList.remove('active');
      });
      // Переключаем текущую
      this.classList.toggle('active');
    });
  });
});

