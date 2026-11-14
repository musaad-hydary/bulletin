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
  ? 'https://bulletin-six.vercel.app'
  : '';

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

  const s = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('clock').textContent    = `${h}:${m}`;
  document.getElementById('seconds').textContent  = `:${s}`;
  document.getElementById('ampm').textContent     = ap;
}

updateClock();
setInterval(updateClock, 1000);

/* ── Music ──────────────────────────────────────────────────── */
let musicSource = 'charts';

function albumHTML(album) {
  const title  = escHtml(album.title  || 'Unknown Album');
  const artist = escHtml(album.artist || 'Unknown Artist');
  const art    = /^https:\/\//.test(album.artwork || '') ? album.artwork : '';
  return `
    <div class="album-card">
      <div class="album-art-box">
        ${art ? `<img class="album-art" src="${art}" alt="" loading="lazy" onload="this.classList.add('loaded')" onerror="this.style.display='none'">` : ''}
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

let calYear  = new Date().getFullYear();
let calMonth = new Date().getMonth();

function renderCalendar() {
  const container = document.getElementById('calendar-grid');
  const today      = new Date();
  const todayYear  = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDate  = today.getDate();

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

/* ── Weather ────────────────────────────────────────────────── */
const WMO = {
  0: 'Clear', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Foggy',
  51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle',
  61: 'Rain', 63: 'Rain', 65: 'Heavy Rain',
  71: 'Snow', 73: 'Snow', 75: 'Heavy Snow', 77: 'Snow',
  80: 'Showers', 81: 'Showers', 82: 'Heavy Showers',
  85: 'Snow Showers', 86: 'Snow Showers',
  95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm',
};

async function loadWeather() {
  const el = document.getElementById('weather');
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=43.6532&longitude=-79.3832&daily=temperature_2m_max,temperature_2m_min,weathercode&temperature_unit=celsius&timezone=America%2FToronto&forecast_days=5'
    );
    if (!res.ok) throw new Error(res.status);
    const { daily } = await res.json();
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    el.innerHTML = daily.time.slice(0, 5).map((dateStr, i) => {
      const label = i === 0 ? 'Today' : days[new Date(dateStr + 'T12:00:00').getDay()];
      const hi    = Math.round(daily.temperature_2m_max[i]);
      const lo    = Math.round(daily.temperature_2m_min[i]);
      const cond  = WMO[daily.weathercode[i]] || '';
      const cls = i === 0 ? 'forecast-day forecast-today' : 'forecast-day';
      return `<div class="${cls}">
        <span class="forecast-label">${label}</span>
        <span class="forecast-temps">${hi}° / ${lo}°</span>
        <span class="forecast-cond">${cond}</span>
      </div>`;
    }).join('');
  } catch {
    el.textContent = '';
  }
}

/* ── Init ───────────────────────────────────────────────────── */
loadMusic();
loadWeather();
renderCalendar();
initToggle();
initCalNav();

setInterval(loadMusic, 60 * 60 * 1000);
setInterval(loadWeather, 15 * 60 * 1000);

// Re-render calendar at midnight in case month rolls over
function scheduleCalendarRefresh() {
  const now = new Date();
  const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
  setTimeout(() => {
    const now = new Date();
    calYear = now.getFullYear(); calMonth = now.getMonth();
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
