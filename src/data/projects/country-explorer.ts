import type { Project } from './types';

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Country Explorer</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<header>
  <div>🌍</div>
  <h1>Country <span>Explorer</span></h1>
  <div class="stats">
    <div class="stat"><strong id="st-total">—</strong>Countries</div>
    <div class="stat"><strong id="st-pop">—</strong>World Pop.</div>
  </div>
</header>
<div class="controls">
  <div class="search-wrap">
    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
    <input type="text" id="search" placeholder="Search countries...">
  </div>
  <select id="region">
    <option value="">All Regions</option>
    <option value="Africa">Africa</option>
    <option value="Americas">Americas</option>
    <option value="Asia">Asia</option>
    <option value="Europe">Europe</option>
    <option value="Oceania">Oceania</option>
  </select>
  <div class="sort-btns">
    <button class="sort-btn active" id="s-az">A→Z</button>
    <button class="sort-btn" id="s-za">Z→A</button>
    <button class="sort-btn" id="s-ph">Pop ↑</button>
    <button class="sort-btn" id="s-pl">Pop ↓</button>
  </div>
  <span id="count-label"></span>
</div>
<main id="main">
  <div class="loading">
    <div class="spinner"></div>
    <p>Loading countries...</p>
  </div>
</main>
<div class="overlay" id="overlay" style="display:none">
  <div class="modal" id="modal"></div>
</div>
<script src="script.js"></script>
</body>
</html>`;

const styleCss = `*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0f172a;color:#e2e8f0;min-height:100vh}
header{background:#1e293b;border-bottom:1px solid #334155;padding:14px 20px;display:flex;align-items:center;gap:12px;position:sticky;top:0;z-index:10}
header h1{font-size:18px;font-weight:700;color:#f1f5f9}
header h1 span{color:#38bdf8}
.stats{margin-left:auto;display:flex;gap:16px}
.stat{text-align:right;font-size:11px;color:#94a3b8}
.stat strong{display:block;font-size:15px;font-weight:700;color:#38bdf8}
.controls{padding:14px 20px;background:#1e293b;border-bottom:1px solid #334155;display:flex;flex-wrap:wrap;gap:10px;align-items:center}
.search-wrap{position:relative;flex:1;min-width:200px}
.search-wrap input{width:100%;padding:9px 14px 9px 36px;background:#0f172a;border:1px solid #475569;border-radius:8px;color:#f1f5f9;font-size:13px;outline:none}
.search-wrap input:focus{border-color:#38bdf8}
.search-wrap svg{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#64748b}
select{padding:9px 12px;background:#0f172a;border:1px solid #475569;border-radius:8px;color:#f1f5f9;font-size:13px;cursor:pointer;outline:none}
select:focus{border-color:#38bdf8}
.sort-btns{display:flex;gap:6px}
.sort-btn{padding:8px 12px;background:#0f172a;border:1px solid #475569;border-radius:8px;color:#94a3b8;font-size:12px;cursor:pointer}
.sort-btn.active{border-color:#38bdf8;color:#38bdf8;background:#0c2034}
#count-label{font-size:12px;color:#64748b;white-space:nowrap}
main{padding:16px 20px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px}
.card{background:#1e293b;border:1px solid #334155;border-radius:12px;overflow:hidden;cursor:pointer;transition:transform .15s,border-color .15s}
.card:hover{transform:translateY(-3px);border-color:#38bdf8}
.card img{width:100%;height:110px;object-fit:cover;display:block;background:#334155}
.card-body{padding:12px}
.card-name{font-size:14px;font-weight:700;color:#f1f5f9;margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.card-info{font-size:11px;color:#94a3b8;line-height:1.7}
.card-info b{color:#cbd5e1}
.badge{display:inline-block;padding:2px 7px;border-radius:999px;font-size:10px;font-weight:600;margin-top:5px}
.badge-asia{background:#1d3a5c;color:#7dd3fc}
.badge-europe{background:#1e3a2f;color:#6ee7b7}
.badge-africa{background:#3a1d00;color:#fcd34d}
.badge-americas{background:#2d1a3f;color:#c4b5fd}
.badge-oceania{background:#1a2d2d;color:#67e8f9}
.badge-other{background:#1e293b;color:#94a3b8}
.loading{text-align:center;padding:60px 20px;color:#64748b}
.spinner{width:40px;height:40px;border:3px solid #334155;border-top-color:#38bdf8;border-radius:50%;animation:spin 0.7s linear infinite;margin:0 auto 16px}
@keyframes spin{to{transform:rotate(360deg)}}
.error{text-align:center;padding:60px 20px}
.error p{color:#f87171;font-size:15px;margin-bottom:14px}
.retry-btn{padding:10px 20px;background:#38bdf8;color:#0f172a;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:14px}
.empty{text-align:center;padding:40px;color:#64748b;font-size:14px}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:100;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(4px)}
.modal{background:#1e293b;border:1px solid #334155;border-radius:16px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 48px rgba(0,0,0,.5)}
.modal-flag{width:100%;height:160px;object-fit:cover;border-radius:16px 16px 0 0}
.modal-body{padding:20px}
.modal-name{font-size:20px;font-weight:800;color:#f1f5f9;margin-bottom:2px}
.modal-official{font-size:12px;color:#64748b;margin-bottom:14px}
.modal-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
.modal-item{background:#0f172a;border-radius:8px;padding:10px}
.modal-item label{display:block;font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px}
.modal-item span{font-size:13px;color:#e2e8f0;font-weight:600}
.modal-section{margin-bottom:12px}
.modal-section h3{font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.06em;margin-bottom:7px}
.tag{display:inline-block;padding:3px 8px;background:#0f172a;border:1px solid #334155;border-radius:6px;font-size:11px;color:#94a3b8;margin:2px}
.close-btn{float:right;background:none;border:none;color:#64748b;font-size:20px;cursor:pointer;padding:0;margin-top:-4px}
.close-btn:hover{color:#f1f5f9}`;

const scriptJs = `// =====================================================
// Country Explorer - Fetch REST API + Search + Filter
// Fetches 195 countries from a REST API endpoint
// =====================================================

var allCountries = [];
var filtered = [];
var sortKey = 'az';

// Format number with K/M/B suffixes
function fmt(n) {
  if (!n && n !== 0) return 'N/A';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K';
  return n.toString();
}

// Get badge CSS class for region
function badgeClass(region) {
  var map = {
    Africa: 'africa',
    Europe: 'europe',
    Asia: 'asia',
    Americas: 'americas',
    Oceania: 'oceania'
  };
  return 'badge badge-' + (map[region] || 'other');
}

// Apply search and filter
function applyFilters() {
  var q = document.getElementById('search').value.toLowerCase();
  var r = document.getElementById('region').value;
  
  filtered = allCountries.filter(function(c) {
    var name = (c.name && c.name.common || '').toLowerCase();
    var matchQ = !q || name.includes(q);
    var matchR = !r || c.region === r;
    return matchQ && matchR;
  });
  
  // Sort
  filtered.sort(function(a, b) {
    var na = a.name && a.name.common || '';
    var nb = b.name && b.name.common || '';
    if (sortKey === 'az') return na.localeCompare(nb);
    if (sortKey === 'za') return nb.localeCompare(na);
    if (sortKey === 'ph') return (a.population || 0) - (b.population || 0);
    if (sortKey === 'pl') return (b.population || 0) - (a.population || 0);
    return 0;
  });
  
  document.getElementById('count-label').textContent = filtered.length + ' countries';
  renderGrid();
}

// Render country cards
function renderGrid() {
  var main = document.getElementById('main');
  
  if (!filtered.length) {
    main.innerHTML = '<div class="empty">No countries match your search 🔍</div>';
    return;
  }
  
  var html = '<div class="grid">';
  filtered.forEach(function(c, i) {
    var name = c.name && c.name.common || 'Unknown';
    var cap = c.capital && c.capital[0] || 'N/A';
    var flag = c.flags && (c.flags.svg || c.flags.png) || '';
    var pop = fmt(c.population);
    var bc = badgeClass(c.region);
    
    html += '<div class="card" data-i="' + i + '">' +
      '<img src="' + flag + '" alt="' + name + ' flag" loading="lazy">' +
      '<div class="card-body">' +
      '<div class="card-name" title="' + name + '">' + name + '</div>' +
      '<div class="card-info"><b>Capital:</b> ' + cap + '<br><b>Population:</b> ' + pop + '</div>' +
      '<span class="' + bc + '">' + c.region + '</span>' +
      '</div></div>';
  });
  html += '</div>';
  main.innerHTML = html;
  
  // Attach click handlers
  main.querySelectorAll('.card').forEach(function(card) {
    card.addEventListener('click', function() {
      openModal(filtered[parseInt(card.dataset.i)]);
    });
  });
}

// Open country detail modal
function openModal(c) {
  var name = c.name && c.name.common || 'Unknown';
  var official = c.name && c.name.official || name;
  var flag = c.flags && (c.flags.svg || c.flags.png) || '';
  var cap = c.capital && c.capital.join(', ') || 'N/A';
  var pop = fmt(c.population);
  var area = c.area ? (c.area.toLocaleString() + ' km²') : 'N/A';
  var sub = c.subregion || c.region || 'N/A';
  var langs = c.languages ? Object.values(c.languages).join(', ') : 'N/A';
  var curr = c.currencies ? Object.values(c.currencies).map(function(x) {
    return x.name + (x.symbol ? ' (' + x.symbol + ')' : '');
  }).join(', ') : 'N/A';
  var borders = c.borders && c.borders.length ? c.borders.map(function(b) {
    return '<span class="tag">' + b + '</span>';
  }).join('') : '<span class="tag">None</span>';

  document.getElementById('modal').innerHTML =
    '<img class="modal-flag" src="' + flag + '" alt="' + name + ' flag">' +
    '<div class="modal-body">' +
    '<button class="close-btn" id="close-modal">✕</button>' +
    '<div class="modal-name">' + name + '</div>' +
    '<div class="modal-official">' + official + '</div>' +
    '<div class="modal-grid">' +
    '<div class="modal-item"><label>Capital</label><span>' + cap + '</span></div>' +
    '<div class="modal-item"><label>Population</label><span>' + pop + '</span></div>' +
    '<div class="modal-item"><label>Area</label><span>' + area + '</span></div>' +
    '<div class="modal-item"><label>Region</label><span>' + sub + '</span></div>' +
    '</div>' +
    '<div class="modal-section"><h3>Languages</h3><div>' + langs + '</div></div>' +
    '<div class="modal-section"><h3>Currencies</h3><div>' + curr + '</div></div>' +
    '<div class="modal-section"><h3>Borders</h3><div>' + borders + '</div></div>' +
    '</div>';

  document.getElementById('overlay').style.display = 'flex';
  document.getElementById('close-modal').addEventListener('click', closeModal);
  console.log('Opened:', name, '| Pop:', c.population, '| Region:', c.region);
}

// Close modal
function closeModal() {
  document.getElementById('overlay').style.display = 'none';
}

// Set sort order
function setSort(key) {
  sortKey = key;
  ['az', 'za', 'ph', 'pl'].forEach(function(k) {
    document.getElementById('s-' + k).classList.toggle('active', k === key);
  });
  applyFilters();
}

// Load countries from REST API
async function loadCountries() {
  try {
    var apiUrl = (window.__APP_ORIGIN__ || '') + '/api/countries';
    console.log('Fetching countries from:', apiUrl);
    var res = await fetch(apiUrl);
    console.log('Response status:', res.status, res.statusText);
    
    if (!res.ok) throw new Error('HTTP ' + res.status);
    
    var data = await res.json();
    console.log('Data received:', data.length, 'countries');
    
    allCountries = data;
    if (!allCountries.length) throw new Error('No country data received');
    
    // Calculate total population
    var totalPop = allCountries.reduce(function(s, c) {
      return s + (c.population || 0);
    }, 0);
    
    document.getElementById('st-total').textContent = allCountries.length;
    document.getElementById('st-pop').textContent = fmt(totalPop);
    console.log('Loaded', allCountries.length, 'countries. World population:', fmt(totalPop));
    
    // Log regions
    var regions = {};
    allCountries.forEach(function(c) {
      regions[c.region] = (regions[c.region] || 0) + 1;
    });
    console.log('By region:', JSON.stringify(regions));
    
    applyFilters();
  } catch (err) {
    document.getElementById('main').innerHTML =
      '<div class="error"><p>⚠️ Failed to load: ' + err.message + '</p>' +
      '<button class="retry-btn" id="retry">Retry</button></div>';
    document.getElementById('retry').addEventListener('click', loadCountries);
    console.error('Error:', err.message);
  }
}

// Event listeners
document.getElementById('search').addEventListener('input', applyFilters);
document.getElementById('region').addEventListener('change', applyFilters);
document.getElementById('s-az').addEventListener('click', function() { setSort('az'); });
document.getElementById('s-za').addEventListener('click', function() { setSort('za'); });
document.getElementById('s-ph').addEventListener('click', function() { setSort('ph'); });
document.getElementById('s-pl').addEventListener('click', function() { setSort('pl'); });
document.getElementById('overlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// Initialize
loadCountries();`;

export const countryExplorerProject: Project = {
  id: 'country-explorer',
  slug: 'country-explorer',
  title: 'Country Explorer',
  difficulty: 'advanced',
  type: 'frontend',
  estimatedTime: '8–12 hours',
  playgroundKey: 'fetch',
  description: 'Fetch 195 countries from a REST API and display them with search, region filter, sort by name/population, and a detail modal showing languages, currencies, and borders.',
  technologies: ['HTML', 'CSS', 'JavaScript', 'REST API'],
  prerequisites: [
    'JavaScript fundamentals (variables, functions, arrays, objects)',
    'Async JavaScript (Promises, async/await)',
    'DOM manipulation and event handling',
    'Understanding of REST APIs and JSON',
    'Array methods (filter, sort, map, reduce)',
  ],
  learnings: [
    'Fetch API and async/await for REST API calls',
    'JSON parsing and data transformation',
    'Search and filter implementation',
    'Dynamic sorting with multiple criteria',
    'Modal UI pattern',
    'Responsive grid layout with CSS Grid',
    'Error handling for network requests',
    'Lazy loading images for performance',
  ],
  features: [
    'Fetch 195 countries from restcountries.com API',
    'Real-time search by country name',
    'Filter by region (Africa, Americas, Asia, Europe, Oceania)',
    'Sort by name (A→Z, Z→A) or population (↑↓)',
    'Country count and world population statistics',
    'Card grid with flag images and basic info',
    'Detailed modal view with languages, currencies, borders',
    'Loading spinner and error handling',
    'Responsive design with mobile support',
    'Dark theme with Tailwind-inspired colors',
  ],
  fileStructure: 'country-explorer/\n  index.html\n  style.css\n  script.js',
  overview: 'The Country Explorer is a real-world project that demonstrates how to work with external REST APIs. It fetches data from the restcountries.com API, which provides comprehensive information about all countries in the world. You will learn how to handle asynchronous operations, parse JSON responses, implement search and filter functionality, and display data in an interactive grid with modal details. This project teaches essential skills for building data-driven web applications.',
  objective: 'Build a complete country explorer with REST API integration, search, filtering, sorting, and modal detail views using vanilla JavaScript.',
  nextProject: 'ecommerce',
  
  files: [
    { path: 'country-explorer/index.html', language: 'html', content: indexHtml },
    { path: 'country-explorer/style.css', language: 'css', content: styleCss },
    { path: 'country-explorer/script.js', language: 'javascript', content: scriptJs },
  ],
  
  lessons: [
    {
      id: 'fetch-api',
      title: 'Fetching Data from REST API',
      explanation: 'The Fetch API is the modern way to make HTTP requests in JavaScript. It returns a Promise that resolves to the Response object. We use async/await syntax to handle the asynchronous operation cleanly. The restcountries.com API returns an array of country objects with detailed information.',
      js: `async function loadCountries() {
  try {
    // Fetch data from REST API
    var res = await fetch('/api/countries');
    
    // Check if request was successful
    if (!res.ok) {
      throw new Error('HTTP ' + res.status);
    }
    
    // Parse JSON response
    var data = await res.json();
    console.log('Loaded', data.length, 'countries');
    
    allCountries = data;
    renderCountries();
    
  } catch (err) {
    // Handle errors (network issues, parsing errors, etc.)
    console.error('Error loading countries:', err);
    showError(err.message);
  }
}

// Alternative: using .then() syntax
fetch('/api/countries')
  .then(res => res.json())
  .then(data => {
    allCountries = data;
    renderCountries();
  })
  .catch(err => console.error(err));`,
    },
    {
      id: 'search-filter',
      title: 'Search and Filter Implementation',
      explanation: 'Search and filter work by creating a new filtered array from the original data. We use Array.filter() to keep only items that match both the search query and the selected region. The search is case-insensitive by converting both the query and country names to lowercase.',
      js: `function applyFilters() {
  // Get search query and selected region
  var q = document.getElementById('search').value.toLowerCase();
  var r = document.getElementById('region').value;
  
  // Filter countries by search AND region
  filtered = allCountries.filter(function(c) {
    var name = (c.name && c.name.common || '').toLowerCase();
    var matchQ = !q || name.includes(q);  // Match search
    var matchR = !r || c.region === r;     // Match region
    return matchQ && matchR;               // Both must match
  });
  
  // Update count display
  document.getElementById('count-label').textContent = 
    filtered.length + ' countries';
  
  // Render filtered results
  renderGrid();
}

// Trigger on search input
document.getElementById('search')
  .addEventListener('input', applyFilters);

// Trigger on region change
document.getElementById('region')
  .addEventListener('change', applyFilters);`,
    },
    {
      id: 'sorting',
      title: 'Multi-Criteria Sorting',
      explanation: 'Sorting is implemented using Array.sort() with a custom comparison function. We track the current sort key in a variable and apply different comparison logic based on it. For alphabetical sorting, we use localeCompare(). For population sorting, we subtract the values to get numeric ordering.',
      js: `var sortKey = 'az'; // Track current sort

function setSort(key) {
  sortKey = key;
  
  // Update active button
  ['az', 'za', 'ph', 'pl'].forEach(function(k) {
    document.getElementById('s-' + k)
      .classList.toggle('active', k === key);
  });
  
  applyFilters(); // Re-filter and re-sort
}

// In applyFilters(), after filtering:
filtered.sort(function(a, b) {
  var na = a.name && a.name.common || '';
  var nb = b.name && b.name.common || '';
  
  if (sortKey === 'az') {
    return na.localeCompare(nb);  // A→Z
  }
  if (sortKey === 'za') {
    return nb.localeCompare(na);  // Z→A
  }
  if (sortKey === 'ph') {
    return (a.population || 0) - (b.population || 0);  // Pop ↑
  }
  if (sortKey === 'pl') {
    return (b.population || 0) - (a.population || 0);  // Pop ↓
  }
  
  return 0;
});`,
    },
    {
      id: 'modal-pattern',
      title: 'Modal UI Pattern',
      explanation: 'Modals are created by showing an overlay div that covers the entire screen with a semi-transparent background. The modal content is centered using flexbox. We attach click handlers to close the modal when clicking outside of it or on the close button. The modal HTML is generated dynamically with data from the selected country.',
      js: `function openModal(country) {
  var name = country.name.common;
  var flag = country.flags.svg;
  var capital = country.capital.join(', ');
  var population = fmt(country.population);
  
  // Generate modal HTML with country data
  document.getElementById('modal').innerHTML =
    '<img src="' + flag + '" alt="' + name + ' flag">' +
    '<div class="modal-body">' +
    '<button id="close-modal">✕</button>' +
    '<h2>' + name + '</h2>' +
    '<p>Capital: ' + capital + '</p>' +
    '<p>Population: ' + population + '</p>' +
    // ... more fields
    '</div>';
  
  // Show overlay
  document.getElementById('overlay').style.display = 'flex';
  
  // Attach close handler
  document.getElementById('close-modal')
    .addEventListener('click', closeModal);
}

function closeModal() {
  document.getElementById('overlay').style.display = 'none';
}

// Close when clicking outside modal
document.getElementById('overlay')
  .addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });`,
    },
  ],
  
  challenges: [
    {
      id: 'favorite-countries',
      title: 'Add Favorite Countries Feature',
      description: 'Add a "favorite" button to each country card that saves favorites to localStorage. Show a filter to display only favorite countries. Add a star icon that toggles between filled and outline.',
      hint: 'Store favorites as an array of country codes in localStorage. Use JSON.stringify() to save and JSON.parse() to load.',
      difficulty: 'easy',
      solutionJs: `var favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function toggleFavorite(countryCode) {
  var index = favorites.indexOf(countryCode);
  if (index > -1) {
    favorites.splice(index, 1); // Remove
  } else {
    favorites.push(countryCode); // Add
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderGrid(); // Re-render to update star icons
}

function isFavorite(countryCode) {
  return favorites.includes(countryCode);
}

// In renderGrid(), add star button to each card:
html += '<button class="fav-btn" data-code="' + c.cca3 + '">' +
  (isFavorite(c.cca3) ? '★' : '☆') +
  '</button>';

// Attach click handler
document.querySelectorAll('.fav-btn').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    e.stopPropagation(); // Prevent card click
    toggleFavorite(btn.dataset.code);
  });
});`,
    },
    {
      id: 'advanced-search',
      title: 'Advanced Search with Debouncing',
      description: 'Implement debounced search that waits 300ms after the user stops typing before triggering the filter. This prevents excessive filtering while typing. Also add search by capital city in addition to country name.',
      hint: 'Use setTimeout to delay the search. Clear the previous timeout on each keystroke. Search both name.common and capital array.',
      difficulty: 'medium',
      solutionJs: `var searchTimeout;

function debouncedSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(applyFilters, 300);
}

document.getElementById('search')
  .addEventListener('input', debouncedSearch);

// Enhanced filter with capital search
function applyFilters() {
  var q = document.getElementById('search').value.toLowerCase();
  var r = document.getElementById('region').value;
  
  filtered = allCountries.filter(function(c) {
    var name = (c.name && c.name.common || '').toLowerCase();
    var capital = (c.capital && c.capital[0] || '').toLowerCase();
    
    // Match either name OR capital
    var matchQ = !q || name.includes(q) || capital.includes(q);
    var matchR = !r || c.region === r;
    
    return matchQ && matchR;
  });
  
  document.getElementById('count-label').textContent = 
    filtered.length + ' countries';
  renderGrid();
}`,
    },
    {
      id: 'map-integration',
      title: 'Integrate Google Maps',
      description: 'Add a Google Maps embed to the modal that shows the country\'s location. Use the country\'s latitude and longitude coordinates from the API data. Add a "View on Map" button that opens Google Maps in a new tab.',
      hint: 'Use the latlng property from country data. Google Maps URL format: https://www.google.com/maps?q=LAT,LNG',
      difficulty: 'hard',
      solutionJs: `function openModal(c) {
  var name = c.name.common;
  var latlng = c.latlng || [0, 0];
  var lat = latlng[0];
  var lng = latlng[1];
  
  // Google Maps URL
  var mapsUrl = 'https://www.google.com/maps?q=' + lat + ',' + lng;
  
  // Add map embed iframe to modal
  var mapHtml = 
    '<div class="modal-section">' +
    '<h3>Location</h3>' +
    '<iframe ' +
    'width="100%" height="200" frameborder="0" ' +
    'src="https://www.google.com/maps/embed/v1/place?' +
    'key=YOUR_API_KEY&q=' + lat + ',' + lng + '">' +
    '</iframe>' +
    '<a href="' + mapsUrl + '" target="_blank" ' +
    'class="map-link">View on Google Maps</a>' +
    '</div>';
  
  // Add to modal body
  document.getElementById('modal').innerHTML =
    // ... other modal content
    mapHtml;
  
  // Note: You need a Google Maps API key for the embed
  // Or use a simple link to open Google Maps
}`,
    },
  ],
  
  github: {
    owner: 'webdev-atlas',
    repo: 'country-explorer-project',
    branch: 'main',
    url: 'https://github.com/webdev-atlas/country-explorer-project',
  },
};
