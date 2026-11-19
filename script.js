// Состояние каталога
let allApps = [];
let activeFilter = 'all';
let searchQuery = '';

// Элементы DOM
const appsGrid = document.getElementById('appsGrid');
const searchInput = document.getElementById('searchInput');
const filterTabs = document.getElementById('filterTabs');
const noResults = document.getElementById('noResults');

// Загрузка программ
async function loadApps() {
  try {
    const res = await fetch('apps.json');
    if (!res.ok) throw new Error('Не удалось загрузить данные');
    allApps = await res.json();
    render();
  } catch (err) {
    console.error('Ошибка загрузки apps.json:', err);
    appsGrid.innerHTML = `<p style="color: #ef4444; text-align: center; grid-column: 1/-1;">Ошибка загрузки списка приложений.</p>`;
  }
}

// Отрисовка списка
function render() {
  const filtered = allApps.filter(app => {
    const matchesFilter = activeFilter === 'all' || app.category === activeFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      app.title.toLowerCase().includes(query) || 
      app.description.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    appsGrid.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');
  appsGrid.innerHTML = filtered.map(app => `
    <article class="app-card">
      <div>
        <div class="card-top">
          <div class="card-title-group">
            <h2>${escapeHtml(app.title)}</h2>
            <div class="card-meta">
              <span>v${escapeHtml(app.version)}</span>
              <span>•</span>
              <span>${escapeHtml(app.platform)}</span>
            </div>
          </div>
          ${app.badge ? `<span class="card-badge">${escapeHtml(app.badge)}</span>` : ''}
        </div>

        <p class="card-desc">${escapeHtml(app.description)}</p>

        <ul class="card-features">
          ${(app.features || []).map(f => `<li>${escapeHtml(f)}</li>`).join('')}
        </ul>
      </div>

      <div class="card-footer">
        <div class="card-info-text">
          <div>Размер: ${escapeHtml(app.size)}</div>
          <div>Обновлено: ${escapeHtml(app.date)}</div>
        </div>
        <a href="${escapeHtml(app.downloadUrl)}" target="_blank" rel="noopener noreferrer" class="download-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Скачать
        </a>
      </div>
    </article>
  `).join('');
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

// Слушатели событий
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

// Старт
loadApps();
