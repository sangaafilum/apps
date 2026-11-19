// Тексты для двух языков
const translations = {
  ru: {
    pageTitle: "sangaafilum Vault — Программы и утилиты",
    navCatalog: "Каталог",
    navAbout: "О проекте",
    heroBadge: "🚀 Открытые авторские разработки",
    heroTitleHtml: 'Программы, которые мы создаём <br><span class="gradient-text">для работы и удобства</span>',
    heroSubtitle: "Здесь собраны все наши авторские приложения, скрипты и утилиты. Все файлы проверены на вирусы, полностью бесплатны и доступны для скачивания с Google Диска.",
    searchPlaceholder: "Поиск программы по названию или описанию...",
    tabAll: "Все",
    tabUtils: "Утилиты",
    tabProd: "Продуктивность",
    tabDev: "Для разработчиков",
    noResults: "🔍 По вашему запросу ничего не найдено",
    feat1Title: "Безопасность",
    feat1Desc: "Каждая программа перед загрузкой проверяется, не содержит рекламы и скрытых майнеров.",
    feat2Title: "Google Диск",
    feat2Desc: "Быстрая прямая скорость скачивания без ожидания таймеров и ограничений.",
    feat3Title: "Обновления",
    feat3Desc: "Мы постоянно улучшаем наши разработки и выкладываем свежие релизы.",
    footerText: "Все права сохранены.",
    backToTop: "Вверх ↑",
    downloadBtn: "Скачать",
    sizeLabel: "Размер:",
    updatedLabel: "Обновлено:"
  },
  en: {
    pageTitle: "sangaafilum Vault — Software & Apps",
    navCatalog: "Catalog",
    navAbout: "About",
    heroBadge: "🚀 Open Source & Custom Software",
    heroTitleHtml: 'Software crafted <br><span class="gradient-text">for productivity and power</span>',
    heroSubtitle: "A curated collection of our tools, desktop utilities, and apps. Free, virus-scanned, and readily downloadable via Google Drive.",
    searchPlaceholder: "Search programs by title or description...",
    tabAll: "All",
    tabUtils: "Utilities",
    tabProd: "Productivity",
    tabDev: "For Developers",
    noResults: "🔍 No software found matching your query",
    feat1Title: "Safety & Clean Code",
    feat1Desc: "Each software build is verified virus-free, without bundled ads or telemetry.",
    feat2Title: "Google Drive Mirror",
    feat2Desc: "High-speed direct download links without annoying countdowns or rate limits.",
    feat3Title: "Regular Updates",
    feat3Desc: "We continuously refine our projects and release fresh improvements.",
    footerText: "All rights reserved.",
    backToTop: "Back to top ↑",
    downloadBtn: "Download",
    sizeLabel: "Size:",
    updatedLabel: "Updated:"
  }
};

let currentLang = localStorage.getItem('site_lang') || 'ru';
let allApps = [];
let activeFilter = 'all';
let searchQuery = '';

// DOM элементы
const appsGrid = document.getElementById('appsGrid');
const searchInput = document.getElementById('searchInput');
const filterTabs = document.getElementById('filterTabs');
const noResults = document.getElementById('noResults');
const btnRu = document.getElementById('btnRu');
const btnEn = document.getElementById('btnEn');

// Применение языка интерфейса
function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('site_lang', lang);
  
  btnRu.classList.toggle('active', lang === 'ru');
  btnEn.classList.toggle('active', lang === 'en');
  
  const t = translations[lang];
  document.title = t.pageTitle;
  document.getElementById('heroTitle').innerHTML = t.heroTitleHtml;
  searchInput.placeholder = t.searchPlaceholder;
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      el.textContent = t[key];
    }
  });

  render();
}

// Загрузка apps.json
async function loadApps() {
  try {
    const res = await fetch('apps.json');
    if (!res.ok) throw new Error('Не удалось загрузить данные');
    allApps = await res.json();
    render();
  } catch (err) {
    console.error('Ошибка загрузки apps.json:', err);
    appsGrid.innerHTML = `<p style="color: #ef4444; text-align: center; grid-column: 1/-1;">Ошибка загрузки каталога.</p>`;
  }
}

// Отрисовка карточек
function render() {
  const t = translations[currentLang];
  const query = searchQuery.toLowerCase().trim();

  const filtered = allApps.filter(app => {
    const matchesFilter = activeFilter === 'all' || app.category === activeFilter;
    
    const title = (currentLang === 'en' && app.title_en) ? app.title_en : (app.title_ru || app.title || '');
    const desc = (currentLang === 'en' && app.description_en) ? app.description_en : (app.description_ru || app.description || '');

    const matchesSearch = !query || 
      title.toLowerCase().includes(query) || 
      desc.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    appsGrid.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');
  appsGrid.innerHTML = filtered.map(app => {
    const title = (currentLang === 'en' && app.title_en) ? app.title_en : (app.title_ru || app.title || '');
    const desc = (currentLang === 'en' && app.description_en) ? app.description_en : (app.description_ru || app.description || '');
    const badge = (currentLang === 'en' && app.badge_en) ? app.badge_en : (app.badge_ru || app.badge || '');
    const features = (currentLang === 'en' && app.features_en) ? app.features_en : (app.features_ru || app.features || []);

    return `
      <article class="app-card">
        <div>
          <div class="card-top">
            <div class="card-title-group">
              <h2>${escapeHtml(title)}</h2>
              <div class="card-meta">
                <span>v${escapeHtml(app.version)}</span>
                <span>•</span>
                <span>${escapeHtml(app.platform)}</span>
              </div>
            </div>
            ${badge ? `<span class="card-badge">${escapeHtml(badge)}</span>` : ''}
          </div>

          <p class="card-desc">${escapeHtml(desc)}</p>

          <ul class="card-features">
            ${features.map(f => `<li>${escapeHtml(f)}</li>`).join('')}
          </ul>
        </div>

        <div class="card-footer">
          <div class="card-info-text">
            <div>${t.sizeLabel} ${escapeHtml(app.size)}</div>
            <div>${t.updatedLabel} ${escapeHtml(app.date)}</div>
          </div>
          <a href="${escapeHtml(app.downloadUrl)}" target="_blank" rel="noopener noreferrer" class="download-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            ${t.downloadBtn}
          </a>
        </div>
      </article>
    `;
  }).join('');
}

// Защита от XSS
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Обработчики событий
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  render();
});

filterTabs.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  
  filterTabs.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = btn.dataset.filter;
  render();
});

btnRu.addEventListener('click', () => applyLanguage('ru'));
btnEn.addEventListener('click', () => applyLanguage('en'));

// Инициализация
applyLanguage(currentLang);
loadApps();
