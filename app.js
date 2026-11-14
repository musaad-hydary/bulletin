/* ── Theme (light 7am–7pm EST, dark 7pm–7am) ────────────────── */
function applyTheme() {
  const hour = parseInt(new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Toronto',
    hour: 'numeric',
    hour12: false
  }).format(new Date()));
  document.body.classList.toggle('dark', hour >= 19 || hour < 7);
}

applyTheme();
setInterval(applyTheme, 60 * 1000);

/* proxy API to live Vercel when running locally */
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'https://frame-dashboard-theta.vercel.app'
  : '';

/* ── Greeting ───────────────────────────────────────────────── */
const EMOTICONS = [':)', ':D', ':O', ';)', ':P', '8)'];
let emoticonIdx = 0;

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 6  && h < 12) return 'good morning';
  if (h >= 12 && h < 17) return 'good afternoon';
  if (h >= 17 && h < 21) return 'good evening';
  return 'good night';
}

function updateGreeting() {
  emoticonIdx = (emoticonIdx + 1) % EMOTICONS.length;
  const textEl     = document.getElementById('greeting-text');
  const emoticonEl = document.getElementById('greeting-emoticon');
  if (textEl)     textEl.textContent     = getGreeting();
  if (emoticonEl) emoticonEl.textContent = EMOTICONS[emoticonIdx];
}

updateGreeting();
setInterval(updateGreeting, 2000);

/* ── Clock ──────────────────────────────────────────────────── */
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

function updateClock() {
  const now = new Date();
  let h = now.getHours();
  const m  = String(now.getMinutes()).padStart(2, '0');
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;

  document.getElementById('clock').textContent    = `${h}:${m}`;
  document.getElementById('ampm').textContent     = ap;
  document.getElementById('date-day').textContent = DAYS[now.getDay()];
  document.getElementById('date-full').textContent = `${MONTHS[now.getMonth()]} ${now.getDate()}`;
}

updateClock();
setInterval(updateClock, 1000);

/* ── Music ──────────────────────────────────────────────────── */
let musicSource = 'charts';

function albumHTML(album) {
  const title  = escHtml(album.title  || 'Unknown Album');
  const artist = escHtml(album.artist || 'Unknown Artist');
  const art    = album.artwork || '';
  return `
    <div class="album-card">
      <div class="album-art-box">
        ${art ? `<img class="album-art" src="${art}" alt="" loading="lazy" onerror="this.style.display='none'">` : ''}
      </div>
      <div class="album-info">
        <span class="album-artist">${artist}</span>
        <span class="album-title">${title}</span>
      </div>
    </div>`;
}

async function loadGenre(genreId) {
  const container = document.getElementById(`albums-${genreId}`);
  container.innerHTML = '<div class="skeleton-card"></div><div class="skeleton-card"></div><div class="skeleton-card"></div>';
  try {
    const res = await fetch(`${API_BASE}/api/music?genre=${genreId}&source=${musicSource}`);
    if (!res.ok) throw new Error(res.status);
    const { albums } = await res.json();
    container.innerHTML = albums.slice(0, 3).map(a => albumHTML(a)).join('');
  } catch {
    container.innerHTML = '<div class="empty-msg">Could not load</div>';
  }
}

function loadMusic() {
  ['pop', 'hiphop', 'rnb'].forEach(loadGenre);
}

function initToggle() {
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.source === musicSource) return;
      musicSource = btn.dataset.source;
      document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadMusic();
    });
  });
}

/* ── Calendar ───────────────────────────────────────────────── */
const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun',
                      'Jul','Aug','Sep','Oct','Nov','Dec'];

function getEaster(year) {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day   = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function isoDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function nthMonday(year, month, n) {
  const d = new Date(year, month, 1);
  while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
  d.setDate(d.getDate() + (n - 1) * 7);
  return d;
}

function getCanadianHolidays(year) {
  const h = {};
  h[`${year}-01-01`] = "New Year's Day";

  const easter = getEaster(year);
  const gf = new Date(easter); gf.setDate(easter.getDate() - 2);
  const em = new Date(easter); em.setDate(easter.getDate() + 1);
  h[isoDate(gf)] = 'Good Friday';
  h[isoDate(em)] = 'Easter Monday';

  // Victoria Day: last Monday on or before May 24
  const may24 = new Date(year, 4, 24);
  while (may24.getDay() !== 1) may24.setDate(may24.getDate() - 1);
  h[isoDate(may24)] = 'Victoria Day';

  h[`${year}-07-01`] = 'Canada Day';

  // Labour Day: first Monday of September
  h[isoDate(nthMonday(year, 8, 1))] = 'Labour Day';

  // Thanksgiving: second Monday of October
  h[isoDate(nthMonday(year, 9, 2))] = 'Thanksgiving';

  h[`${year}-11-11`] = 'Remembrance Day';
  h[`${year}-12-25`] = 'Christmas Day';
  h[`${year}-12-26`] = 'Boxing Day';
  return h;
}

const _today = new Date();
let calYear  = _today.getFullYear();
let calMonth = _today.getMonth();

function renderCalendar() {
  const container = document.getElementById('calendar-grid');
  const todayYear  = _today.getFullYear();
  const todayMonth = _today.getMonth();
  const todayDate  = _today.getDate();

  const holidays    = getCanadianHolidays(calYear);
  const firstDow    = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const monthPrefix = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-`;

  document.getElementById('cal-section-label').textContent = `${MONTHS[calMonth]} ${calYear}`;

  let grid = '<div class="cal-grid">';
  ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d => {
    grid += `<div class="cal-day-header">${d}</div>`;
  });
  for (let i = 0; i < firstDow; i++) grid += '<div class="cal-cell"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const key = monthPrefix + String(d).padStart(2, '0');
    const dow = new Date(calYear, calMonth, d).getDay();
    let cls = 'cal-cell';
    if (calYear === todayYear && calMonth === todayMonth && d === todayDate) cls += ' cal-today';
    if (holidays[key]) cls += ' cal-holiday';
    if (dow === 0 || dow === 6) cls += ' cal-weekend';
    grid += `<div class="${cls}"><span class="cal-day-num">${d}</span>${holidays[key] ? `<span class="cal-holiday-name">${holidays[key]}</span>` : ''}</div>`;
  }
  grid += '</div>';

  container.innerHTML = grid;
}

function initCalNav() {
  document.getElementById('cal-prev').addEventListener('click', () => {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    renderCalendar();
  });
  document.getElementById('cal-next').addEventListener('click', () => {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    renderCalendar();
  });
}

/* ── Init ───────────────────────────────────────────────────── */
loadMusic();
renderCalendar();
initToggle();
initCalNav();

setInterval(loadMusic, 60 * 60 * 1000);

// Re-render calendar at midnight in case month rolls over
function scheduleCalendarRefresh() {
  const now = new Date();
  const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
  setTimeout(() => {
    const n = new Date();
    calYear = n.getFullYear(); calMonth = n.getMonth();
    renderCalendar();
    scheduleCalendarRefresh();
  }, msUntilMidnight);
}
scheduleCalendarRefresh();

/* ── Utils ──────────────────────────────────────────────────── */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
