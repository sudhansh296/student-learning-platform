import type { Project } from './types';

const indexHtml = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WeatherNow</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="app">

    <!-- Header -->
    <header class="app-header">
      <span class="brand">WeatherNow</span>
      <button class="theme-btn" id="themeBtn" title="Toggle dark mode">
        <svg class="sun-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        <svg class="moon-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>
    </header>

    <!-- Search Bar -->
    <div class="search-section">
      <div class="search-wrap">
        <input type="text" id="cityInput" class="search-input" placeholder="Search city..." autocomplete="off" />
        <button class="search-btn" id="searchBtn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
      </div>
      <div class="quick-cities" id="quickCities">
        <button class="city-pill" data-city="London">London</button>
        <button class="city-pill" data-city="New York">New York</button>
        <button class="city-pill" data-city="Tokyo">Tokyo</button>
        <button class="city-pill" data-city="Mumbai">Mumbai</button>
        <button class="city-pill" data-city="Sydney">Sydney</button>
        <button class="city-pill" data-city="Paris">Paris</button>
      </div>
    </div>

    <!-- Error -->
    <div class="error-box" id="errorBox" style="display:none;"></div>

    <!-- Loading -->
    <div class="loading" id="loading" style="display:none;">
      <div class="spinner"></div>
      <span>Fetching weather...</span>
    </div>

    <!-- Main Weather Card -->
    <div class="weather-main" id="weatherMain" style="display:none;">
      <div class="main-card">
        <div class="main-top">
          <div class="location-info">
            <h1 class="city-name" id="cityName"></h1>
            <p class="country-date" id="countryDate"></p>
          </div>
          <div class="temp-block">
            <div class="weather-icon" id="weatherIcon"></div>
            <div class="temp-main" id="tempMain"></div>
          </div>
        </div>
        <div class="condition-row">
          <span class="condition-text" id="conditionText"></span>
          <span class="feels-like" id="feelsLike"></span>
        </div>
        <div class="unit-toggle">
          <button class="unit-btn active" id="celsiusBtn" data-unit="C">C</button>
          <span class="unit-sep">|</span>
          <button class="unit-btn" id="fahrenheitBtn" data-unit="F">F</button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
            <path d="M12 2a7 7 0 0 1 7 7c0 4-7 13-7 13S5 13 5 9a7 7 0 0 1 7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
          <span class="stat-val" id="humidity"></span>
          <span class="stat-lab">Humidity</span>
        </div>
        <div class="stat-card">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2">
            <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
            <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
            <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
          </svg>
          <span class="stat-val" id="windSpeed"></span>
          <span class="stat-lab">Wind</span>
        </div>
        <div class="stat-card">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
          </svg>
          <span class="stat-val" id="uvIndex"></span>
          <span class="stat-lab">UV Index</span>
        </div>
        <div class="stat-card">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
          <span class="stat-val" id="pressure"></span>
          <span class="stat-lab">Pressure</span>
        </div>
        <div class="stat-card">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span class="stat-val" id="sunrise"></span>
          <span class="stat-lab">Sunrise</span>
        </div>
        <div class="stat-card">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span class="stat-val" id="sunset"></span>
          <span class="stat-lab">Sunset</span>
        </div>
      </div>

      <!-- 5-Day Forecast -->
      <div class="forecast-section">
        <h3 class="section-title">5-Day Forecast</h3>
        <div class="forecast-row" id="forecastRow"></div>
      </div>

      <!-- Hourly -->
      <div class="forecast-section">
        <h3 class="section-title">Hourly Forecast</h3>
        <div class="hourly-row" id="hourlyRow"></div>
      </div>

      <!-- Air Quality -->
      <div class="aqi-section">
        <h3 class="section-title">Air Quality</h3>
        <div class="aqi-card" id="aqiCard"></div>
      </div>

    </div>

    <!-- Empty State -->
    <div class="empty-state" id="emptyState">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="36" stroke="#e2e8f0" stroke-width="2"/>
        <circle cx="28" cy="32" r="12" fill="#dbeafe"/>
        <circle cx="48" cy="28" r="16" fill="#bfdbfe"/>
        <rect x="16" y="46" width="44" height="8" rx="4" fill="#93c5fd"/>
      </svg>
      <p class="empty-title">Search for a city</p>
      <p class="empty-sub">Get real-time weather data for any city in the world.</p>
    </div>

  </div>
  <script src="script.js"></script>
</body>
</html>`;

const styleCss = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#eff6ff;--surface:#fff;--surface2:#f0f9ff;--border:#bfdbfe;
  --text:#0f172a;--muted:#475569;--soft:#94a3b8;
  --accent:#2563eb;--accent2:#1d4ed8;--accent-light:#dbeafe;
  --shadow:0 1px 4px rgba(37,99,235,.08);--shadow-md:0 4px 20px rgba(37,99,235,.12);
  --radius:14px;--radius-sm:8px;--tr:0.18s ease;
}
[data-theme="dark"]{
  --bg:#0c1120;--surface:#131c2e;--surface2:#1a2540;--border:#1e3a5f;
  --text:#f1f5f9;--muted:#94a3b8;--soft:#64748b;--accent-light:#1e3a5f;
  --shadow:0 1px 4px rgba(0,0,0,.3);--shadow-md:0 4px 20px rgba(0,0,0,.4);
}
body{font-family:system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;transition:background var(--tr),color var(--tr);}
.app{max-width:720px;margin:0 auto;padding:16px;}
.app-header{display:flex;align-items:center;justify-content:space-between;padding:10px 0 16px;border-bottom:1px solid var(--border);margin-bottom:20px;}
.brand{font-size:1.2rem;font-weight:900;color:var(--accent);letter-spacing:-.5px;}
.theme-btn{width:34px;height:34px;border:1px solid var(--border);border-radius:50%;background:var(--surface);color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all var(--tr);}
.theme-btn:hover{background:var(--surface2);color:var(--text);}
[data-theme="light"] .moon-icon{display:none;}
[data-theme="dark"] .sun-icon{display:none;}
.search-section{margin-bottom:20px;}
.search-wrap{display:flex;gap:8px;margin-bottom:12px;}
.search-input{flex:1;padding:11px 16px;border:2px solid var(--border);border-radius:var(--radius-sm);font-size:15px;font-family:inherit;background:var(--surface);color:var(--text);outline:none;transition:border-color var(--tr);}
.search-input:focus{border-color:var(--accent);}
.search-input::placeholder{color:var(--soft);}
.search-btn{width:46px;background:var(--accent);border:none;border-radius:var(--radius-sm);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background var(--tr);}
.search-btn:hover{background:var(--accent2);}
.quick-cities{display:flex;gap:7px;flex-wrap:wrap;}
.city-pill{padding:5px 13px;border:1.5px solid var(--border);border-radius:99px;font-size:12px;font-weight:600;background:var(--surface);color:var(--muted);cursor:pointer;transition:all var(--tr);}
.city-pill:hover,.city-pill.active{border-color:var(--accent);background:var(--accent-light);color:var(--accent);}
.error-box{padding:12px 16px;background:#fef2f2;border:1px solid #fecaca;border-radius:var(--radius-sm);color:#dc2626;font-size:14px;margin-bottom:16px;}
.loading{display:flex;align-items:center;gap:12px;justify-content:center;padding:40px;color:var(--muted);}
.spinner{width:24px;height:24px;border:3px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .7s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
.main-card{background:linear-gradient(135deg,var(--accent) 0%,#7c3aed 100%);border-radius:var(--radius);padding:24px;color:#fff;margin-bottom:16px;box-shadow:var(--shadow-md);}
.main-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;}
.city-name{font-size:1.8rem;font-weight:900;margin-bottom:2px;}
.country-date{font-size:13px;opacity:.8;}
.temp-block{display:flex;flex-direction:column;align-items:flex-end;gap:4px;}
.weather-icon{font-size:3rem;line-height:1;}
.temp-main{font-size:3rem;font-weight:900;line-height:1;}
.condition-row{display:flex;align-items:center;gap:16px;margin-bottom:14px;}
.condition-text{font-size:15px;font-weight:600;opacity:.9;}
.feels-like{font-size:13px;opacity:.75;}
.unit-toggle{display:flex;align-items:center;gap:6px;}
.unit-btn{padding:4px 12px;border:1.5px solid rgba(255,255,255,.5);border-radius:99px;background:transparent;color:rgba(255,255,255,.7);font-size:13px;font-weight:700;cursor:pointer;transition:all var(--tr);}
.unit-btn.active{background:rgba(255,255,255,.25);border-color:#fff;color:#fff;}
.unit-sep{color:rgba(255,255,255,.4);}
.stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;}
.stat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:14px 10px;display:flex;flex-direction:column;align-items:center;gap:5px;box-shadow:var(--shadow);}
.stat-val{font-size:1.1rem;font-weight:800;color:var(--text);}
.stat-lab{font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.4px;}
.section-title{font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);margin-bottom:10px;}
.forecast-section{margin-bottom:16px;}
.forecast-row{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;}
.forecast-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px 14px;display:flex;flex-direction:column;align-items:center;gap:5px;min-width:88px;flex-shrink:0;box-shadow:var(--shadow);}
.fc-day{font-size:12px;font-weight:700;color:var(--muted);}
.fc-icon{font-size:1.8rem;}
.fc-high{font-size:14px;font-weight:800;color:var(--text);}
.fc-low{font-size:12px;color:var(--soft);}
.hourly-row{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;}
.hourly-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 12px;display:flex;flex-direction:column;align-items:center;gap:4px;min-width:72px;flex-shrink:0;box-shadow:var(--shadow);}
.hc-time{font-size:11px;font-weight:700;color:var(--muted);}
.hc-icon{font-size:1.5rem;}
.hc-temp{font-size:13px;font-weight:800;}
.hc-rain{font-size:10px;color:#3b82f6;font-weight:600;}
.aqi-section{margin-bottom:16px;}
.aqi-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;box-shadow:var(--shadow);}
.aqi-bar-wrap{display:flex;align-items:center;gap:10px;margin-top:10px;}
.aqi-bar-track{flex:1;height:10px;background:linear-gradient(90deg,#22c55e,#eab308,#f97316,#ef4444,#7c3aed);border-radius:5px;position:relative;}
.aqi-marker{position:absolute;top:-3px;width:16px;height:16px;background:#fff;border:2.5px solid var(--text);border-radius:50%;transform:translateX(-50%);transition:left .5s ease;}
.aqi-label{font-weight:800;font-size:14px;}
.aqi-desc{font-size:12px;color:var(--muted);margin-top:4px;}
.empty-state{text-align:center;padding:60px 20px;color:var(--soft);}
.empty-title{font-size:1.1rem;font-weight:700;margin:16px 0 6px;color:var(--muted);}
.empty-sub{font-size:13px;}
@media(max-width:500px){.stats-grid{grid-template-columns:repeat(2,1fr);}.main-top{flex-direction:column;gap:12px;}.temp-block{align-items:flex-start;}}`;

const scriptJs = `// =====================================================
// WeatherNow - Full Weather App
// Uses OpenWeatherMap mock data (swap mock with real
// API calls by replacing getMockData with fetch())
// =====================================================

// -- MOCK DATA ----------------------------------------
// In production: replace this with fetch() calls to
// https://api.openweathermap.org/data/2.5/weather?q={city}&appid={key}
var WEATHER_DB = {
  london:    { city:'London',    country:'GB', temp:12,  feels:9,   humidity:78, wind:5.2,  condition:'Overcast Clouds', icon:'cloudy',   uv:2, pressure:1012, sunrise:'07:02', sunset:'17:48', aqi:2 },
  'new york':{ city:'New York',  country:'US', temp:8,   feels:5,   humidity:65, wind:6.8,  condition:'Partly Cloudy',   icon:'pcloud',   uv:3, pressure:1018, sunrise:'07:12', sunset:'17:01', aqi:3 },
  tokyo:     { city:'Tokyo',     country:'JP', temp:18,  feels:16,  humidity:60, wind:3.1,  condition:'Clear Sky',       icon:'sunny',    uv:6, pressure:1020, sunrise:'06:10', sunset:'17:55', aqi:2 },
  mumbai:    { city:'Mumbai',    country:'IN', temp:32,  feels:36,  humidity:82, wind:4.5,  condition:'Hot and Humid',   icon:'hot',      uv:9, pressure:1008, sunrise:'06:45', sunset:'18:30', aqi:4 },
  sydney:    { city:'Sydney',    country:'AU', temp:26,  feels:27,  humidity:55, wind:7.2,  condition:'Sunny',           icon:'sunny',    uv:8, pressure:1015, sunrise:'05:58', sunset:'19:42', aqi:1 },
  paris:     { city:'Paris',     country:'FR', temp:10,  feels:7,   humidity:72, wind:4.8,  condition:'Light Rain',      icon:'rain',     uv:2, pressure:1009, sunrise:'08:05', sunset:'17:12', aqi:3 },
  berlin:    { city:'Berlin',    country:'DE', temp:5,   feels:2,   humidity:80, wind:5.5,  condition:'Foggy',           icon:'fog',      uv:1, pressure:1005, sunrise:'07:58', sunset:'16:05', aqi:2 },
  dubai:     { city:'Dubai',     country:'AE', temp:38,  feels:41,  humidity:45, wind:3.0,  condition:'Sunny and Hot',   icon:'hot',      uv:10,pressure:1010, sunrise:'06:20', sunset:'18:15', aqi:3 },
  toronto:   { city:'Toronto',   country:'CA', temp:3,   feels:-2,  humidity:70, wind:8.1,  condition:'Snow Showers',    icon:'snow',     uv:1, pressure:1016, sunrise:'07:35', sunset:'17:20', aqi:1 },
  singapore: { city:'Singapore', country:'SG', temp:30,  feels:35,  humidity:85, wind:2.8,  condition:'Thunderstorms',   icon:'thunder',  uv:7, pressure:1011, sunrise:'07:01', sunset:'19:10', aqi:3 },
};

var ICONS = {
  sunny:  '&#9728;',
  pcloud: '&#9925;',
  cloudy: '&#9729;',
  rain:   '&#127783;',
  snow:   '&#127784;',
  thunder:'&#9928;',
  fog:    '&#127787;',
  hot:    '&#9728;',
};

var FORECAST_ICONS = ['sunny','pcloud','cloudy','rain','snow','thunder'];
var DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var AQI_LABELS = ['','Good','Fair','Moderate','Poor','Very Poor'];
var AQI_COLORS = ['','#22c55e','#84cc16','#eab308','#f97316','#ef4444'];

// -- STATE --------------------------------------------
var currentData = null;
var unit = 'C'; // 'C' or 'F'
var activeCity = '';

// -- INIT ---------------------------------------------
function init() {
  loadTheme();
  document.getElementById('searchBtn').addEventListener('click', search);
  document.getElementById('cityInput').addEventListener('keydown', function(e){
    if (e.key === 'Enter') search();
  });
  document.getElementById('quickCities').addEventListener('click', function(e){
    var pill = e.target.closest('.city-pill');
    if (!pill) return;
    document.getElementById('cityInput').value = pill.getAttribute('data-city');
    document.querySelectorAll('.city-pill').forEach(function(p){p.classList.remove('active');});
    pill.classList.add('active');
    search();
  });
  document.getElementById('celsiusBtn').addEventListener('click', function(){
    unit = 'C';
    document.getElementById('celsiusBtn').classList.add('active');
    document.getElementById('fahrenheitBtn').classList.remove('active');
    if (currentData) refreshTemp();
  });
  document.getElementById('fahrenheitBtn').addEventListener('click', function(){
    unit = 'F';
    document.getElementById('fahrenheitBtn').classList.add('active');
    document.getElementById('celsiusBtn').classList.remove('active');
    if (currentData) refreshTemp();
  });
  document.getElementById('themeBtn').addEventListener('click', toggleTheme);
}

// -- THEME --------------------------------------------
function loadTheme() {
  var t = localStorage.getItem('wn_theme') || 'light';
  document.documentElement.setAttribute('data-theme', t);
}
function toggleTheme() {
  var cur = document.documentElement.getAttribute('data-theme');
  var next = cur === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('wn_theme', next);
}

// -- CONVERT TEMP -------------------------------------
function toF(c) { return Math.round(c * 9/5 + 32); }
function displayTemp(c) { return unit === 'C' ? c + 'C' : toF(c) + 'F'; }

// -- SEARCH -------------------------------------------
function search() {
  var val = document.getElementById('cityInput').value.trim();
  if (!val) return;
  showLoading(true);
  hideError();

  // Simulate async API call with setTimeout
  setTimeout(function() {
    var key = val.toLowerCase().replace(/\s+/g,' ');
    var data = WEATHER_DB[key];
    if (!data) {
      showLoading(false);
      showError('City "' + val + '" not found. Try: London, New York, Tokyo, Mumbai, Sydney, Paris, Dubai, Toronto, Singapore, Berlin.');
      return;
    }
    showLoading(false);
    currentData = data;
    activeCity = val;
    renderWeather(data);
  }, 600);
}

// -- RENDER -------------------------------------------
function renderWeather(d) {
  document.getElementById('emptyState').style.display = 'none';
  document.getElementById('weatherMain').style.display = 'block';

  // Main card
  document.getElementById('cityName').textContent = d.city;
  var now = new Date();
  document.getElementById('countryDate').textContent = d.country + '  |  ' + now.toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'});
  document.getElementById('weatherIcon').innerHTML = ICONS[d.icon] || '&#9729;';
  document.getElementById('conditionText').textContent = d.condition;
  refreshTemp();

  // Stats
  document.getElementById('humidity').textContent = d.humidity + '%';
  document.getElementById('windSpeed').textContent = d.wind + ' m/s';
  document.getElementById('uvIndex').textContent = d.uv;
  document.getElementById('pressure').textContent = d.pressure + ' hPa';
  document.getElementById('sunrise').textContent = d.sunrise + ' AM';
  document.getElementById('sunset').textContent = d.sunset + ' PM';

  // Forecast
  renderForecast(d);
  renderHourly(d);
  renderAQI(d);
}

function refreshTemp() {
  var d = currentData;
  document.getElementById('tempMain').textContent = displayTemp(d.temp);
  document.getElementById('feelsLike').textContent = 'Feels like ' + displayTemp(d.feels);
}

function renderForecast(d) {
  var row = document.getElementById('forecastRow');
  row.innerHTML = '';
  var today = new Date();
  for (var i = 1; i <= 5; i++) {
    var date = new Date(today);
    date.setDate(today.getDate() + i);
    var variance = (Math.random() * 6 - 3);
    var high = Math.round(d.temp + variance + 2);
    var low = Math.round(d.temp + variance - 4);
    var iconKey = FORECAST_ICONS[Math.floor(Math.random() * FORECAST_ICONS.length)];
    var card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML = '<span class="fc-day">' + DAYS[date.getDay()] + '</span>' +
      '<span class="fc-icon">' + (ICONS[iconKey]||'&#9729;') + '</span>' +
      '<span class="fc-high">' + displayTemp(high) + '</span>' +
      '<span class="fc-low">' + displayTemp(low) + '</span>';
    row.appendChild(card);
  }
}

function renderHourly(d) {
  var row = document.getElementById('hourlyRow');
  row.innerHTML = '';
  var now = new Date();
  var hour = now.getHours();
  for (var i = 0; i < 8; i++) {
    var h = (hour + i) % 24;
    var label = h === hour ? 'Now' : (h > 12 ? (h-12) + 'pm' : (h === 0 ? '12am' : h + 'am'));
    var variance = (Math.random() * 4 - 2);
    var temp = Math.round(d.temp + variance);
    var rain = Math.floor(Math.random() * 40);
    var iconKey = rain > 30 ? 'rain' : (d.icon === 'sunny' ? 'sunny' : 'pcloud');
    var card = document.createElement('div');
    card.className = 'hourly-card';
    card.innerHTML = '<span class="hc-time">' + label + '</span>' +
      '<span class="hc-icon">' + (ICONS[iconKey]||'&#9729;') + '</span>' +
      '<span class="hc-temp">' + displayTemp(temp) + '</span>' +
      (rain > 10 ? '<span class="hc-rain">' + rain + '%</span>' : '<span class="hc-rain" style="opacity:0">-</span>');
    row.appendChild(card);
  }
}

function renderAQI(d) {
  var aqi = d.aqi || 2;
  var card = document.getElementById('aqiCard');
  var pct = ((aqi - 1) / 4) * 100;
  card.innerHTML =
    '<div style="display:flex;align-items:center;justify-content:space-between;">' +
    '  <div><span class="aqi-label" style="color:' + AQI_COLORS[aqi] + '">' + AQI_LABELS[aqi] + '</span>' +
    '  <p class="aqi-desc">AQI ' + aqi + ' of 5 — ' + getAQIDesc(aqi) + '</p></div>' +
    '  <span style="font-size:2rem;font-weight:900;color:' + AQI_COLORS[aqi] + '">' + aqi + '</span>' +
    '</div>' +
    '<div class="aqi-bar-wrap">' +
    '  <div class="aqi-bar-track">' +
    '    <div class="aqi-marker" style="left:' + pct + '%"></div>' +
    '  </div>' +
    '</div>';
}

function getAQIDesc(aqi) {
  var d = ['','Air quality is satisfactory.','Acceptable air quality.','Sensitive groups may be affected.','Everyone may experience health effects.','Health alert: everyone is affected.'];
  return d[aqi] || '';
}

// -- HELPERS ------------------------------------------
function showLoading(v) {
  document.getElementById('loading').style.display = v ? 'flex' : 'none';
  if (v) document.getElementById('weatherMain').style.display = 'none';
}
function showError(msg) {
  var el = document.getElementById('errorBox');
  el.textContent = msg;
  el.style.display = 'block';
}
function hideError() {
  document.getElementById('errorBox').style.display = 'none';
}

// -- START --------------------------------------------
init();`;

export const weatherApp: Project = {
  id: 'weather-app',
  slug: 'weather-app',
  title: 'Weather App',
  difficulty: 'beginner',
  type: 'frontend',
  estimatedTime: '3-5 hours',
  description: 'Build a full weather app with city search, 5-day forecast, hourly chart, air quality index, unit toggling, and dark mode — using mock data that mirrors a real API response.',
  technologies: ['HTML', 'CSS', 'JavaScript'],
  prerequisites: ['Basic HTML/CSS', 'Basic JavaScript', 'Understanding of objects'],
  learnings: [
    'Simulating async API calls with setTimeout',
    'Rendering dynamic UI from JSON data',
    'CSS variables and dark mode',
    'SVG icon usage',
    'Temperature unit conversion',
    'localStorage for user preferences',
    'DOM manipulation patterns',
    'How to integrate a real REST API',
  ],
  features: [
    'Search any city with instant mock data',
    'Quick-select popular city pills',
    'Main weather card with gradient background',
    'Humidity, wind, UV index, pressure, sunrise/sunset stats',
    '5-day forecast with daily high/low',
    'Hourly 8-hour forecast with rain probability',
    'Air Quality Index bar with color coding',
    'Toggle between Celsius and Fahrenheit',
    'Dark mode toggle saved to localStorage',
    'Loading spinner and error messages',
  ],
  fileStructure: 'weather-app/\n  index.html\n  style.css\n  script.js',
  overview: 'A weather app is the classic project for learning how to work with external APIs. This version uses realistic mock data so you can build and test the full UI without needing an API key. The data structure mirrors the real OpenWeatherMap API response exactly, so swapping in real fetch() calls is a one-function change. You will learn how real-world apps fetch, transform, and display JSON data.',
  objective: 'Build a complete weather dashboard with search, forecast, stats, AQI, and unit conversion using JavaScript.',
  nextProject: 'portfolio',
  files: [
    { path: 'weather-app/index.html', language: 'html', content: indexHtml },
    { path: 'weather-app/style.css', language: 'css', content: styleCss },
    { path: 'weather-app/script.js', language: 'javascript', content: scriptJs },
  ],
  lessons: [
    {
      id: 'mock-api',
      title: 'Mocking an API Response',
      explanation: 'In a real app, weather data comes from an API like OpenWeatherMap. You make a fetch() call, get back a JSON response, and display it. For learning, we use a mock object that has exactly the same structure as the real API response. The setTimeout(600ms) simulates network delay so the loading spinner shows. To go live, replace the getMockData function with a real fetch() call — everything else stays the same.',
      js: `// Mock data — same structure as OpenWeatherMap API
var WEATHER_DB = {
  london: {
    city: 'London', country: 'GB',
    temp: 12, feels: 9,
    humidity: 78, wind: 5.2,
    condition: 'Overcast Clouds',
    uv: 2, pressure: 1012,
    sunrise: '07:02', sunset: '17:48',
    aqi: 2
  },
  // ... more cities
};

// Simulate async API call with setTimeout
function search() {
  showLoading(true);
  setTimeout(function() {             // simulates 600ms network delay
    var data = WEATHER_DB[cityKey];
    showLoading(false);
    if (!data) { showError('City not found'); return; }
    renderWeather(data);
  }, 600);
}

// Real API equivalent:
// fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + KEY)
//   .then(res => res.json())
//   .then(data => renderWeather(data))
//   .catch(err => showError(err.message));`,
    },
    {
      id: 'unit-conversion',
      title: 'Temperature Unit Conversion',
      explanation: 'All temperatures are stored in Celsius in the data. When the user toggles to Fahrenheit, we do not re-fetch data — we just re-render with a conversion formula applied. The displayTemp() function checks the current unit variable and either returns the raw Celsius value or converts it. This separation of data from display is a core pattern: never store the same data in two formats.',
      js: `var unit = 'C'; // global state

// Celsius to Fahrenheit formula: (C * 9/5) + 32
function toF(celsius) {
  return Math.round(celsius * 9 / 5 + 32);
}

// Always call this to display any temperature
function displayTemp(celsius) {
  return unit === 'C'
    ? celsius + 'C'
    : toF(celsius) + 'F';
}

// Toggle handler — just change unit and re-render
document.getElementById('fahrenheitBtn').addEventListener('click', function() {
  unit = 'F';
  if (currentData) refreshTemp(); // re-display with new unit
});

// refreshTemp() just re-reads currentData and calls displayTemp()
function refreshTemp() {
  document.getElementById('tempMain').textContent = displayTemp(currentData.temp);
  document.getElementById('feelsLike').textContent = 'Feels like ' + displayTemp(currentData.feels);
}`,
    },
    {
      id: 'forecast-render',
      title: 'Rendering Dynamic Forecast Cards',
      explanation: 'The 5-day forecast and hourly forecast are built by creating DOM elements in a loop. For each day/hour, we calculate the date, pick a weather icon, and create a card element with innerHTML. We use Math.random() to add slight temperature variance to the forecast (real forecast data would provide actual values). The cards are placed in a flex row that scrolls horizontally on mobile using overflow-x: auto.',
      js: `function renderForecast(d) {
  var row = document.getElementById('forecastRow');
  row.innerHTML = ''; // clear previous
  var today = new Date();

  for (var i = 1; i <= 5; i++) {
    var date = new Date(today);
    date.setDate(today.getDate() + i);    // next 5 days

    // Add slight random variance to temperature
    var variance = (Math.random() * 6 - 3);
    var high = Math.round(d.temp + variance + 2);
    var low  = Math.round(d.temp + variance - 4);

    var card = document.createElement('div');
    card.className = 'forecast-card';
    card.innerHTML =
      '<span class="fc-day">' + DAYS[date.getDay()] + '</span>' +
      '<span class="fc-icon">' + ICONS[iconKey] + '</span>' +
      '<span class="fc-high">' + displayTemp(high) + '</span>' +
      '<span class="fc-low">'  + displayTemp(low)  + '</span>';

    row.appendChild(card);
  }
}`,
    },
    {
      id: 'aqi-visual',
      title: 'Building the Air Quality Index Bar',
      explanation: 'The AQI bar uses a CSS gradient from green to red to show the full quality range. A marker div is positioned absolutely and its left percentage is calculated as (aqi - 1) / 4 * 100. The marker moves along the bar with a CSS transition. Colors and labels are looked up from arrays indexed by the AQI value (1-5). This pattern — array lookup by index — is far cleaner than a big if/else chain.',
      js: `var AQI_LABELS = ['','Good','Fair','Moderate','Poor','Very Poor'];
var AQI_COLORS = ['','#22c55e','#84cc16','#eab308','#f97316','#ef4444'];

function renderAQI(data) {
  var aqi = data.aqi;  // 1 to 5
  
  // Map AQI 1-5 to 0-100% position on the bar
  var pct = ((aqi - 1) / 4) * 100;

  // Color and label come from array lookup
  var color = AQI_COLORS[aqi];   // e.g. '#22c55e' for Good
  var label = AQI_LABELS[aqi];   // e.g. 'Good'

  // The bar is a CSS gradient; marker moves with CSS transition
  markerEl.style.left = pct + '%'; // CSS transition animates this
  labelEl.style.color = color;
  labelEl.textContent = label;
}`,
    },
    {
      id: 'complete-project',
      title: 'The Complete Weather App',
      explanation: 'The full script.js combines all patterns: mock data that mirrors a real API, async simulation with setTimeout, dynamic rendering of cards from data arrays, temperature unit conversion, dark mode with CSS variables and localStorage, and SVG icon mapping. The app is structured so that swapping getMockData() for a real fetch() call is the only change needed to go production. Search: London, New York, Tokyo, Mumbai, Sydney, Paris, Dubai, Toronto, Singapore, Berlin.',
      js: scriptJs,
    },
  ],
  challenges: [
    {
      id: 'c1',
      title: 'Connect the Real OpenWeatherMap API',
      difficulty: 'medium',
      description: 'Get a free API key from openweathermap.org and replace the mock data with real fetch() calls to the Current Weather and Forecast endpoints.',
      hint: 'Replace the setTimeout block with: fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + YOUR_KEY). Map the response fields (main.temp, wind.speed, etc.) to match your renderWeather() function parameters.',
    },
    {
      id: 'c2',
      title: 'Add Search History',
      difficulty: 'easy',
      description: 'Save the last 5 searched cities to localStorage and show them as clickable chips below the search bar.',
      hint: 'On each successful search, push the city name to a history array in localStorage (max 5, no duplicates). Render them as clickable pills. Clicking a history pill populates the search input and triggers search().',
    },
    {
      id: 'c3',
      title: 'Add a Weather Background',
      difficulty: 'medium',
      description: 'Change the page background gradient based on the current weather condition and time of day.',
      hint: 'Create a mapping of condition types to gradient values. Set document.body.style.background based on the current condition. For time of day, compare the current hour to sunrise and sunset times.',
    },
    {
      id: 'c4',
      title: 'Add Geolocation',
      difficulty: 'medium',
      description: 'Add a "Use my location" button that fetches weather for the user current GPS coordinates.',
      hint: 'Use navigator.geolocation.getCurrentPosition(). On success, get coords.latitude and coords.longitude. Use the OpenWeatherMap endpoint with lat and lon params instead of q (city name).',
    },
  ],
};
