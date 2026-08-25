import type { Project } from './types';

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>URL Shortener</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="container">
  <header>
    <h1>🔗 URL Shortener</h1>
    <p class="subtitle">Create short links instantly</p>
  </header>

  <div class="shortener-card">
    <form id="urlForm">
      <input type="url" id="urlInput" placeholder="Enter your long URL here..." required>
      <button type="submit" class="btn-shorten">Shorten URL</button>
    </form>

    <div class="result hidden" id="result">
      <div class="short-url-display">
        <span class="label">Short URL:</span>
        <div class="url-box">
          <span id="shortUrl">short.ly/abc123</span>
          <button class="btn-copy" id="btnCopy">Copy</button>
        </div>
      </div>
      <div class="stats-grid">
        <div class="stat">
          <span>Clicks</span>
          <strong id="clicks">0</strong>
        </div>
        <div class="stat">
          <span>Created</span>
          <strong id="created">Just now</strong>
        </div>
      </div>
    </div>
  </div>

  <div class="links-list">
    <div class="list-header">
      <h3>Recent Links</h3>
      <button class="btn-clear" id="btnClearAll">Clear All</button>
    </div>
    <div id="linksList"></div>
  </div>
</div>
<script src="script.js"></script>
</body>
</html>`;

const styleCss = `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 40px 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

header {
  text-align: center;
  margin-bottom: 40px;
}

h1 {
  font-size: 3rem;
  color: white;
  margin-bottom: 10px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
}

.shortener-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  margin-bottom: 30px;
}

#urlForm {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
}

#urlInput {
  flex: 1;
  padding: 18px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

#urlInput:focus {
  outline: none;
  border-color: #667eea;
}

.btn-shorten {
  padding: 18px 35px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.btn-shorten:hover {
  transform: translateY(-2px);
}

.result {
  animation: slideIn 0.4s ease;
}

.result.hidden {
  display: none;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.short-url-display {
  background: #f9fafb;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
  font-weight: 600;
}

.url-box {
  display: flex;
  align-items: center;
  gap: 15px;
  background: white;
  padding: 15px;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
}

#shortUrl {
  flex: 1;
  font-size: 1.2rem;
  color: #667eea;
  font-weight: 600;
}

.btn-copy {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-copy:hover {
  background: #5568d3;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.stat {
  background: #f9fafb;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
}

.stat span {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 5px;
}

.stat strong {
  display: block;
  font-size: 1.5rem;
  color: #667eea;
}

.links-list {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.list-header h3 {
  font-size: 1.5rem;
  color: #333;
}

.btn-clear {
  padding: 8px 16px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #666;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-clear:hover {
  background: #e5e7eb;
}

.link-item {
  background: #f9fafb;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.link-info {
  flex: 1;
  min-width: 0;
}

.link-short {
  font-size: 1.1rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 5px;
}

.link-original {
  font-size: 0.9rem;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-stats {
  display: flex;
  gap: 20px;
  font-size: 0.85rem;
  color: #999;
}

.link-actions {
  display: flex;
  gap: 10px;
}

.btn-action {
  padding: 8px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-action:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

@media (max-width: 768px) {
  #urlForm {
    flex-direction: column;
  }
  
  .link-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .link-stats {
    flex-direction: column;
    gap: 5px;
  }
}`;

const scriptJs = `// State
let links = JSON.parse(localStorage.getItem('shortLinks') || '[]');

// DOM elements
const urlForm = document.getElementById('urlForm');
const urlInput = document.getElementById('urlInput');
const result = document.getElementById('result');
const shortUrl = document.getElementById('shortUrl');
const btnCopy = document.getElementById('btnCopy');
const clicks = document.getElementById('clicks');
const created = document.getElementById('created');
const linksList = document.getElementById('linksList');
const btnClearAll = document.getElementById('btnClearAll');

// Generate short code
function generateShortCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Form submit
urlForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const originalUrl = urlInput.value.trim();
  const shortCode = generateShortCode();
  const shortLink = 'short.ly/' + shortCode;
  
  const link = {
    id: Date.now(),
    original: originalUrl,
    short: shortLink,
    code: shortCode,
    clicks: 0,
    created: new Date().toISOString()
  };
  
  links.unshift(link);
  saveLinks();
  
  // Show result
  shortUrl.textContent = shortLink;
  clicks.textContent = '0';
  created.textContent = 'Just now';
  result.classList.remove('hidden');
  
  // Render list
  renderLinks();
  
  // Clear input
  urlInput.value = '';
});

// Copy button
btnCopy.addEventListener('click', () => {
  navigator.clipboard.writeText(shortUrl.textContent).then(() => {
    btnCopy.textContent = '✓ Copied!';
    setTimeout(() => {
      btnCopy.textContent = 'Copy';
    }, 2000);
  });
});

// Render links list
function renderLinks() {
  if (links.length === 0) {
    linksList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px 0;">No links yet. Create your first short link!</p>';
    return;
  }
  
  linksList.innerHTML = links.map(link => \`
    <div class="link-item">
      <div class="link-info">
        <div class="link-short">\${link.short}</div>
        <div class="link-original">\${link.original}</div>
        <div class="link-stats">
          <span>👆 \${link.clicks} clicks</span>
          <span>📅 \${formatDate(link.created)}</span>
        </div>
      </div>
      <div class="link-actions">
        <button class="btn-action" onclick="copyLink('\${link.short}')">📋</button>
        <button class="btn-action" onclick="visitLink('\${link.id}')">🔗</button>
        <button class="btn-action" onclick="deleteLink(\${link.id})">🗑️</button>
      </div>
    </div>
  \`).join('');
}

// Copy link
window.copyLink = function(short) {
  navigator.clipboard.writeText(short);
  alert('Link copied!');
};

// Visit link
window.visitLink = function(id) {
  const link = links.find(l => l.id === id);
  if (link) {
    link.clicks++;
    saveLinks();
    renderLinks();
    window.open(link.original, '_blank');
  }
};

// Delete link
window.deleteLink = function(id) {
  if (confirm('Delete this link?')) {
    links = links.filter(l => l.id !== id);
    saveLinks();
    renderLinks();
  }
};

// Clear all
btnClearAll.addEventListener('click', () => {
  if (confirm('Delete all links?')) {
    links = [];
    saveLinks();
    renderLinks();
  }
});

// Save to localStorage
function saveLinks() {
  localStorage.setItem('shortLinks', JSON.stringify(links));
}

// Format date
function formatDate(isoDate) {
  const date = new Date(isoDate);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  
  if (diff < 60) return 'Just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  return Math.floor(diff / 86400) + 'd ago';
}

// Initialize
renderLinks();`;

export const urlShortenerProject: Project = {
  id: 'url-shortener',
  slug: 'url-shortener',
  title: 'URL Shortener',
  difficulty: 'intermediate',
  type: 'frontend',
  estimatedTime: '3–5 hours',
  playgroundKey: 'url-shortener',
  description: 'Build a URL shortening service with random code generation, click tracking, copy to clipboard, link history with localStorage, and visit/delete actions. Features clean UI and time-ago formatting.',
  technologies: ['HTML', 'CSS', 'JavaScript'],
  prerequisites: ['JavaScript fundamentals', 'localStorage', 'Clipboard API', 'Date handling', 'Array methods'],
  learnings: [
    'Random string generation',
    'localStorage CRUD operations',
    'Clipboard API for copying',
    'Click tracking and analytics',
    'Time-ago formatting',
    'URL validation',
    'Data persistence patterns',
    'List rendering with actions',
  ],
  features: [
    'URL shortening with 6-character random codes',
    'Copy short URL to clipboard',
    'Click counter for each link',
    'Time-ago display (Just now, 5m ago, 2h ago)',
    'Link history with localStorage',
    'Visit original URL (opens in new tab)',
    'Delete individual links',
    'Clear all links',
    'Responsive card-based layout',
    'Form validation',
  ],
  fileStructure: 'url-shortener/\n  index.html\n  style.css\n  script.js',
  overview: 'A URL shortener creates short, easy-to-share links from long URLs. This project teaches random string generation, data persistence with localStorage, clipboard operations, and click tracking. Users can create unlimited short links, track their usage, and manage their link collection.',
  objective: 'Build a complete URL shortener with link generation, tracking, persistence, and management features.',
  
  files: [
    { path: 'url-shortener/index.html', language: 'html', content: indexHtml },
    { path: 'url-shortener/style.css', language: 'css', content: styleCss },
    { path: 'url-shortener/script.js', language: 'javascript', content: scriptJs },
  ],
  
  lessons: [
    {
      id: 'random-code-generation',
      title: 'Generate Random Short Codes',
      explanation: 'Generate a random 6-character alphanumeric code by randomly selecting characters from a string of valid characters. This creates unique short URLs like "aB3xK9".',
      js: `function generateShortCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyz' +
                'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
                '0123456789';
  
  let code = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars.charAt(randomIndex);
  }
  
  return code; // e.g., "aB3xK9"
}

// With 62 characters and 6 positions:
// Total combinations: 62^6 = 56.8 billion unique codes`,
    },
    {
      id: 'time-ago-formatting',
      title: 'Format Time Ago Display',
      explanation: 'Convert ISO date to relative time display (Just now, 5m ago, 2h ago, 3d ago). Calculate the difference in seconds and convert to appropriate units.',
      js: `function formatTimeAgo(isoDate) {
  const date = new Date(isoDate);
  const now = new Date();
  const diffSeconds = Math.floor((now - date) / 1000);
  
  if (diffSeconds < 60) {
    return 'Just now';
  } else if (diffSeconds < 3600) {
    const minutes = Math.floor(diffSeconds / 60);
    return minutes + 'm ago';
  } else if (diffSeconds < 86400) {
    const hours = Math.floor(diffSeconds / 3600);
    return hours + 'h ago';
  } else {
    const days = Math.floor(diffSeconds / 86400);
    return days + 'd ago';
  }
}

// Examples:
formatTimeAgo('2024-01-01T10:00:00'); // "3d ago"
formatTimeAgo('2024-01-04T11:55:00'); // "5m ago"`,
    },
    {
      id: 'click-tracking',
      title: 'Track Link Clicks',
      explanation: 'Increment click counter when user visits a short link. Find the link by ID, increment clicks, save to localStorage, and open the original URL in new tab.',
      js: `function visitLink(id) {
  // Find link in array
  const link = links.find(l => l.id === id);
  
  if (link) {
    // Increment click counter
    link.clicks++;
    
    // Save updated data
    localStorage.setItem('shortLinks', JSON.stringify(links));
    
    // Update UI
    renderLinks();
    
    // Open original URL in new tab
    window.open(link.original, '_blank');
  }
}

// Link object:
// {
//   id: 1234567890,
//   original: 'https://example.com/very/long/url',
//   short: 'short.ly/aB3xK9',
//   clicks: 5,
//   created: '2024-01-01T10:00:00Z'
// }`,
    },
    {
      id: 'clipboard-api',
      title: 'Copy to Clipboard',
      explanation: 'Use the Clipboard API to copy text to clipboard. Show temporary success feedback by changing button text, then revert after 2 seconds.',
      js: `function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    // Success - show feedback
    btnCopy.textContent = '✓ Copied!';
    
    // Revert after 2 seconds
    setTimeout(() => {
      btnCopy.textContent = 'Copy';
    }, 2000);
  }).catch(err => {
    // Fallback for older browsers
    console.error('Copy failed:', err);
    alert('Failed to copy. Please copy manually.');
  });
}

// Usage:
copyToClipboard('short.ly/aB3xK9');`,
    },
  ],
  
  challenges: [
    {
      id: 'custom-aliases',
      title: 'Add Custom Alias Support',
      description: 'Allow users to create custom short codes instead of random ones. Check if alias is already taken before creating. Validate that alias contains only letters, numbers, and hyphens.',
      hint: 'Add optional custom alias input field. Validate with regex /^[a-zA-Z0-9-]+$/. Check if code already exists in links array.',
      difficulty: 'easy',
      solutionJs: `function createShortLink(originalUrl, customAlias = null) {
  let code;
  
  if (customAlias) {
    // Validate custom alias
    if (!/^[a-zA-Z0-9-]+$/.test(customAlias)) {
      alert('Alias can only contain letters, numbers, and hyphens');
      return;
    }
    
    // Check if already taken
    if (links.some(l => l.code === customAlias)) {
      alert('This alias is already taken');
      return;
    }
    
    code = customAlias;
  } else {
    code = generateShortCode();
  }
  
  const link = {
    id: Date.now(),
    original: originalUrl,
    short: 'short.ly/' + code,
    code: code,
    clicks: 0,
    created: new Date().toISOString()
  };
  
  links.unshift(link);
  saveLinks();
}`,
    },
    {
      id: 'qr-code-generation',
      title: 'Generate QR Codes for Links',
      description: 'Generate QR codes for each short URL so users can scan them with mobile devices. Use a QR code library or API. Add download button for QR code image.',
      hint: 'Use QR Code library or API like qrcode.js or goqr.me API. Generate canvas/image for each link. Add download functionality.',
      difficulty: 'medium',
      solutionJs: `// Using external API (simple approach)
function generateQR(shortUrl) {
  const qrApiUrl = \`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=\${encodeURIComponent(shortUrl)}\`;
  return qrApiUrl;
}

// Add to link item template:
\`<img src="\${generateQR(link.short)}" alt="QR Code" class="qr-code" />\`

// Or use qrcode.js library:
function generateQRCanvas(text, container) {
  QRCode.toCanvas(container, text, {
    width: 200,
    margin: 2
  });
}

// Download QR code:
function downloadQR(shortUrl) {
  const canvas = document.createElement('canvas');
  QRCode.toCanvas(canvas, shortUrl, { width: 400 });
  
  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-code.png';
    a.click();
    URL.revokeObjectURL(url);
  });
}`,
    },
    {
      id: 'analytics-dashboard',
      title: 'Add Analytics Dashboard',
      description: 'Create analytics showing total links, total clicks, most clicked link, click history chart, and geographic data (if using real backend). Display as dashboard with charts.',
      hint: 'Calculate totals from links array. Find max clicks with Array.reduce(). Store click timestamps. Use Chart.js or canvas for visualization.',
      difficulty: 'hard',
      solutionJs: `function calculateAnalytics() {
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
  
  const mostClicked = links.reduce((max, link) => 
    link.clicks > max.clicks ? link : max
  , { clicks: 0 });
  
  const clicksByDay = {};
  links.forEach(link => {
    const day = new Date(link.created).toISOString().split('T')[0];
    clicksByDay[day] = (clicksByDay[day] || 0) + link.clicks;
  });
  
  return {
    totalLinks,
    totalClicks,
    avgClicks: (totalClicks / totalLinks).toFixed(1),
    mostClicked,
    clicksByDay
  };
}

function renderAnalytics() {
  const stats = calculateAnalytics();
  
  document.getElementById('analytics').innerHTML = \`
    <div class="analytics-grid">
      <div class="stat-card">
        <h3>Total Links</h3>
        <p>\${stats.totalLinks}</p>
      </div>
      <div class="stat-card">
        <h3>Total Clicks</h3>
        <p>\${stats.totalClicks}</p>
      </div>
      <div class="stat-card">
        <h3>Avg Clicks/Link</h3>
        <p>\${stats.avgClicks}</p>
      </div>
      <div class="stat-card">
        <h3>Most Clicked</h3>
        <p>\${stats.mostClicked.short} (\${stats.mostClicked.clicks})</p>
      </div>
    </div>
  \`;
}`,
    },
  ],
  
  github: {
    owner: 'webdev-atlas',
    repo: 'url-shortener',
    branch: 'main',
    url: 'https://github.com/webdev-atlas/url-shortener',
  },
};
