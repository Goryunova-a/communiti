// ============================================
// 1. ЯКОРНАЯ НАВИГАЦИЯ + АКТИВНЫЙ ПУНКТ МЕНЮ
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 60,
        behavior: 'smooth'
      });
      document.querySelectorAll('.nav a, .nav-item').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    }
  });
});

// Активный пункт меню при скролле
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.pageYOffset;
  
  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document.querySelectorAll('.nav a, .nav-item').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}` || 
            link.getAttribute('href') === `${sectionId}.html`) {
          link.classList.add('active');
        }
      });
    }
  });
});

// ============================================
// 2. КНОПКА АУДИТ
// ============================================
document.getElementById('audit')?.addEventListener('click', () => {
  document.querySelector('#contacts')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ============================================
// 3. ВИДЕО-МОДАЛКА
// ============================================
const modal = document.getElementById('video-modal');
const closeModal = document.querySelector('.modal-close');
const videoIframe = document.getElementById('video-iframe');
const reviewButtons = document.querySelectorAll('.btn-review');

const vkVideos = [
  { owner_id: '-201030809', video_id: '456239034', hash: '217c46967d575b0c5c' },
  { owner_id: '-201030809', video_id: '456239038', hash: 'c514cfc89c771ab6df' },
  { owner_id: '-201030809', video_id: '456239040', hash: '5f65d11f8b218fa1ab' },
  { owner_id: '-201030809', video_id: '456239041', hash: '355168e9d4f56cd73c' }
];

reviewButtons.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    if (!modal || !videoIframe) return;
    modal.style.display = 'flex';
    const videoData = vkVideos[index % vkVideos.length];
    videoIframe.src = `https://vk.com/video_ext.php?oid=${videoData.owner_id}&id=${videoData.video_id}&hash=${videoData.hash}&autoplay=1`;
  });
});

closeModal?.addEventListener('click', () => {
  modal.style.display = 'none';
  videoIframe.src = '';
});

modal?.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    videoIframe.src = '';
  }
});

// ============================================
// 4. КАРУСЕЛЬ КЕЙСОВ (стрелки + свайп)
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.cases-grid');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  if (!grid) return;

  const cardWidth = 300;
  const gap = 30;
  const step = cardWidth + gap;

  prevBtn?.addEventListener('click', () => {
    grid.scrollBy({ left: -step, behavior: 'smooth' });
  });

  nextBtn?.addEventListener('click', () => {
    grid.scrollBy({ left: step, behavior: 'smooth' });
  });

  // Свайп для мобильных
  let touchStartX = 0;
  let touchEndX = 0;

  grid.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  grid.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        grid.scrollBy({ left: step, behavior: 'smooth' });
      } else {
        grid.scrollBy({ left: -step, behavior: 'smooth' });
      }
    }
  }

  // Обновление состояния стрелок
  const updateButtons = () => {
    if (!prevBtn || !nextBtn) return;
    const { scrollLeft, scrollWidth, clientWidth } = grid;
    prevBtn.disabled = scrollLeft <= 0;
    nextBtn.disabled = scrollLeft >= scrollWidth - clientWidth - 10;
  };

  grid.addEventListener('scroll', updateButtons);
  updateButtons();
});

// ============================================
// 5. СЛАЙДЕР КОМАНДЫ (книжные страницы)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const pagesContainer = document.querySelector('.book-pages');
  if (!pagesContainer) return;
  
  const pages = pagesContainer.querySelectorAll('.page');
  const prevBtn = pagesContainer.querySelector('.page-arrow.prev');
  const nextBtn = pagesContainer.querySelector('.page-arrow.next');
  
  if (!pages.length) return;
  
  let currentIndex = 0;

  function showPage(index) {
    pages.forEach(page => page.classList.remove('active'));
    if (pages[index]) {
      pages[index].classList.add('active');
    }
  }

  showPage(currentIndex);

  nextBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % pages.length;
    showPage(currentIndex);
  });

  prevBtn?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + pages.length) % pages.length;
    showPage(currentIndex);
  });

  // Свайп для мобильных
  let touchStartX = 0;
  pagesContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  pagesContainer.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        currentIndex = (currentIndex + 1) % pages.length;
      } else {
        currentIndex = (currentIndex - 1 + pages.length) % pages.length;
      }
      showPage(currentIndex);
    }
  }, { passive: true });
});

// ============================================
// 6. КНОПКИ "ОСТАВИТЬ ЗАЯВКУ" → ПРОКРУТКА К КОНТАКТАМ
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const applyButtons = document.querySelectorAll('.btn-apply, .btn-request');
  
  applyButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const contactsSection = document.getElementById('contacts');
      if (contactsSection) {
        contactsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

// ============================================
// 7. ОТПРАВКА ФОРМ НА process.php
// ============================================
async function submitRequest(name, phone, consent, service = null) {
  // Валидация телефона
  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    alert('⚠️ Введите корректный номер телефона (минимум 10 цифр)');
    return false;
  }

  try {
    const response = await fetch('process.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, consent, service })
    });

    const result = await response.json();
    if (result.success) {
      alert('✅ ' + (result.message || 'Заявка отправлена! Мы свяжемся с вами в течение 15 минут.'));
      return true;
    } else {
      alert('❌ Ошибка: ' + (result.error || 'Неизвестная ошибка'));
      return false;
    }
  } catch (error) {
    console.error('Ошибка сети:', error);
    alert('⚠️ Не удалось отправить заявку. Проверьте подключение к интернету.');
    return false;
  }
}

// Обработчик основной формы контактов
document.querySelectorAll('.contact-form').forEach(form => {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const checkbox = this.querySelector('#pd-consent');
    if (checkbox && !checkbox.checked) {
      alert('⚠️ Пожалуйста, подтвердите согласие на обработку персональных данных.');
      checkbox.parentElement.style.color = '#ff0000';
      setTimeout(() => {
        checkbox.parentElement.style.color = '';
      }, 2000);
      return;
    }

    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn?.innerText;
    if (submitBtn) {
      submitBtn.innerText = 'Отправка...';
      submitBtn.disabled = true;
    }

    const name = this.querySelector('input[name="name"]')?.value.trim();
    const phone = this.querySelector('input[name="phone"]')?.value.trim();
    const service = this.dataset.service || null;

    if (!name || !phone) {
      alert('⚠️ Заполните все обязательные поля');
      if (submitBtn) {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
      }
      return;
    }

    const success = await submitRequest(name, phone, true, service);
    
    if (success) {
      this.reset();
    }
    
    if (submitBtn) {
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
    }
  });
});

// Обработчик формы АУДИТ (модальное окно)
document.querySelector('.audit-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('input[name="name"]')?.value.trim();
  const phone = form.querySelector('input[name="phone"]')?.value.trim();
  const checkbox = form.querySelector('#pd-consent');
  
  if (checkbox && !checkbox.checked) {
    alert('⚠️ Подтвердите согласие на обработку персональных данных.');
    return;
  }

  if (await submitRequest(name, phone, true, 'audit')) {
    form.reset();
    const auditModal = document.getElementById('audit-modal');
    if (auditModal) auditModal.style.display = 'none';
  }
});

// ============================================
// 8. БУРГЕР-МЕНЮ
// ============================================
const burgerBtn = document.getElementById('newBurger');
const mobileMenu = document.getElementById('newMobileMenu');

if (burgerBtn && mobileMenu) {
  burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burgerBtn.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });
}

// ============================================
// 9. АНИМАЦИЯ ПОЯВЛЕНИЯ СЕКЦИЙ ПРИ СКРОЛЛЕ
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const sections = document.querySelectorAll('.services-section, .cases-section, .team-section, .numbers-section, .reviews-section, .contacts-section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
});

// CSS для анимации (добавьте в стили):
// .services-section.visible, .cases-section.visible, .team-section.visible,
// .numbers-section.visible, .reviews-section.visible, .contacts-section.visible {
//   opacity: 1 !important;
//   transform: translateY(0) !important;
// }

// ============================================
// 10. СЧЁТЧИК ЦИФР (секция "О нас" / "Цифры")
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const counters = document.querySelectorAll('.counter, .number-item .number');
  
  if (!counters.length) return;
  
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target') || el.textContent.replace(/\D/g, ''));
    if (isNaN(target)) return;
    
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + (el.getAttribute('data-suffix') || '+');
    }, 16);
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => observer.observe(counter));
});

// ============================================
// 11. ФИЛЬТРАЦИЯ КЕЙСОВ ПО ОТРАСЛЯМ (табы)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelectorAll('.case-tab, .filter-tab');
  const cases = document.querySelectorAll('.case-card');
  
  if (!tabs.length || !cases.length) return;
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      // Активный таб
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.getAttribute('data-filter');
      
      cases.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = '';
          setTimeout(() => card.style.opacity = '1', 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 300);
        }
      });
    });
  });
});

// ============================================
// 12. ПЛАВНОЕ ПОЯВЛЕНИЕ ПЛАШЕК КОМАНДЫ
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  const rightPanels = document.querySelectorAll('.page-right, .slide-right');
  
  rightPanels.forEach(panel => {
    const h4 = panel.querySelector('h4');
    const p = panel.querySelector('p');
    
    if (h4 && !h4.textContent.trim()) {
      h4.textContent = 'Имя';
    }
    if (p && !p.textContent.trim()) {
      p.textContent = 'Должность';
    }
  });
});

// ============================================
// 13. ЗАКРЫТИЕ МОДАЛЬНЫХ ОКОН ПО ESC
// ============================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modals = document.querySelectorAll('.modal, #video-modal, #audit-modal, #service-modal');
    modals.forEach(modal => {
      modal.style.display = 'none';
      const iframe = modal.querySelector('iframe');
      if (iframe) iframe.src = '';
    });
  }
});
