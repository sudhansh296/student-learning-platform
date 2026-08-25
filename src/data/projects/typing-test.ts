import type { Project } from './types';

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Typing Speed Test</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="container">
  <header>
    <h1>⚡ Typing Speed Test</h1>
    <p class="subtitle">Test your typing speed and accuracy</p>
  </header>
  
  <div class="stats-bar">
    <div class="stat">
      <span class="stat-label">Time</span>
      <span class="stat-value" id="timer">60</span>
    </div>
    <div class="stat">
      <span class="stat-label">WPM</span>
      <span class="stat-value" id="wpm">0</span>
    </div>
    <div class="stat">
      <span class="stat-label">Accuracy</span>
      <span class="stat-value" id="accuracy">100%</span>
    </div>
    <div class="stat">
      <span class="stat-label">Errors</span>
      <span class="stat-value" id="errors">0</span>
    </div>
  </div>

  <div class="mode-selector">
    <button class="mode-btn active" data-time="60">1 min</button>
    <button class="mode-btn" data-time="120">2 min</button>
    <button class="mode-btn" data-time="180">3 min</button>
    <button class="mode-btn" data-time="300">5 min</button>
  </div>

  <div class="text-display" id="textDisplay"></div>

  <textarea 
    id="textInput" 
    placeholder="Click here or start typing to begin..."
    spellcheck="false"
    autocomplete="off"
  ></textarea>

  <div class="controls">
    <button class="btn btn-primary" id="restartBtn">↻ Restart Test</button>
    <button class="btn btn-secondary" id="newTextBtn">🔄 New Text</button>
  </div>

  <div class="results hidden" id="results">
    <h2>🎉 Test Complete!</h2>
    <div class="result-grid">
      <div class="result-item">
        <span class="result-label">Words Per Minute</span>
        <span class="result-value" id="finalWpm">0</span>
      </div>
      <div class="result-item">
        <span class="result-label">Characters Per Minute</span>
        <span class="result-value" id="finalCpm">0</span>
      </div>
      <div class="result-item">
        <span class="result-label">Accuracy</span>
        <span class="result-value" id="finalAccuracy">100%</span>
      </div>
      <div class="result-item">
        <span class="result-label">Total Errors</span>
        <span class="result-value" id="finalErrors">0</span>
      </div>
    </div>
    <button class="btn btn-primary" id="tryAgainBtn">Try Again</button>
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
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.container {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

header {
  text-align: center;
  margin-bottom: 30px;
}

h1 {
  font-size: 2.5rem;
  color: #667eea;
  margin-bottom: 10px;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.stats-bar {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

.stat {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 15px;
  border-radius: 12px;
  text-align: center;
  color: white;
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  opacity: 0.9;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  display: block;
  font-size: 1.8rem;
  font-weight: bold;
}

.mode-selector {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 25px;
}

.mode-btn {
  padding: 10px 25px;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.mode-btn:hover {
  background: #f0f4ff;
}

.mode-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.text-display {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 25px;
  font-size: 1.3rem;
  line-height: 2;
  margin-bottom: 20px;
  min-height: 200px;
  font-family: 'Courier New', monospace;
  user-select: none;
  letter-spacing: 1px;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.text-display span {
  position: relative;
}

.text-display span.correct {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.text-display span.incorrect {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.2);
}

.text-display span.current {
  background: #667eea;
  color: white;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}

#textInput {
  width: 100%;
  padding: 20px;
  border: 3px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1.1rem;
  font-family: 'Courier New', monospace;
  resize: none;
  height: 120px;
  transition: border-color 0.3s ease;
  margin-bottom: 20px;
}

#textInput:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.controls {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #f3f4f6;
  color: #666;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.results {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.results.hidden {
  display: none;
}

.results h2 {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 30px;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  max-width: 800px;
  width: 100%;
  padding: 0 20px;
}

.result-item {
  background: white;
  padding: 25px;
  border-radius: 15px;
  text-align: center;
}

.result-label {
  display: block;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.result-value {
  display: block;
  font-size: 2.5rem;
  font-weight: bold;
  color: #667eea;
}

@media (max-width: 768px) {
  .container {
    padding: 25px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .text-display {
    font-size: 1.1rem;
    padding: 20px;
  }
  
  .stats-bar {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .mode-selector {
    flex-wrap: wrap;
  }
}`;

const scriptJs = `// Sample texts for typing test
const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. Programming requires practice and patience. Every developer starts as a beginner and grows with experience. Code quality matters more than code quantity.",
  "Web development combines creativity with logic. JavaScript powers the modern web. Practice makes perfect in programming. Learning to code opens many opportunities in technology careers.",
  "Algorithms and data structures form the foundation of computer science. Problem solving skills are essential for developers. Writing clean code is an art that improves with practice.",
  "Software engineering is about building solutions that scale. Testing ensures code reliability and maintainability. Version control helps teams collaborate effectively on projects.",
  "Responsive design makes websites work on all devices. User experience should always be a top priority. Performance optimization improves application speed and efficiency."
];

// Game state
let currentText = '';
let timeLimit = 60;
let timeRemaining = 60;
let isTestActive = false;
let timerInterval = null;
let totalCharacters = 0;
let correctCharacters = 0;
let incorrectCharacters = 0;
let startTime = null;

// DOM elements
const textDisplay = document.getElementById('textDisplay');
const textInput = document.getElementById('textInput');
const timerEl = document.getElementById('timer');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const errorsEl = document.getElementById('errors');
const restartBtn = document.getElementById('restartBtn');
const newTextBtn = document.getElementById('newTextBtn');
const resultsPanel = document.getElementById('results');
const tryAgainBtn = document.getElementById('tryAgainBtn');
const modeBtns = document.querySelectorAll('.mode-btn');

// Initialize
function init() {
  loadNewText();
  setupEventListeners();
}

// Load random text
function loadNewText() {
  currentText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
  displayText();
  resetTest();
}

// Display text with spans for each character
function displayText() {
  textDisplay.innerHTML = currentText
    .split('')
    .map((char, index) => \`<span id="char-\${index}">\${char === ' ' ? '&nbsp;' : char}</span>\`)
    .join('');
}

// Setup event listeners
function setupEventListeners() {
  textInput.addEventListener('input', handleInput);
  textInput.addEventListener('focus', startTest);
  restartBtn.addEventListener('click', resetTest);
  newTextBtn.addEventListener('click', loadNewText);
  tryAgainBtn.addEventListener('click', closeResults);
  
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      timeLimit = parseInt(btn.dataset.time);
      resetTest();
    });
  });
}

// Start test on first input
function startTest() {
  if (!isTestActive && textInput.value.length === 0) {
    isTestActive = true;
    startTime = Date.now();
    startTimer();
  }
}

// Handle user input
function handleInput(e) {
  if (!isTestActive) {
    startTest();
  }
  
  const typedText = textInput.value;
  totalCharacters = typedText.length;
  correctCharacters = 0;
  incorrectCharacters = 0;
  
  // Update display with correct/incorrect highlighting
  for (let i = 0; i < currentText.length; i++) {
    const charSpan = document.getElementById(\`char-\${i}\`);
    
    if (i < typedText.length) {
      if (typedText[i] === currentText[i]) {
        charSpan.className = 'correct';
        correctCharacters++;
      } else {
        charSpan.className = 'incorrect';
        incorrectCharacters++;
      }
    } else if (i === typedText.length) {
      charSpan.className = 'current';
    } else {
      charSpan.className = '';
    }
  }
  
  // Update stats
  updateStats();
  
  // Check if test is complete
  if (typedText === currentText) {
    endTest(true);
  }
}

// Start countdown timer
function startTimer() {
  timeRemaining = timeLimit;
  timerEl.textContent = timeRemaining;
  
  timerInterval = setInterval(() => {
    timeRemaining--;
    timerEl.textContent = timeRemaining;
    
    if (timeRemaining <= 0) {
      endTest(false);
    }
  }, 1000);
}

// Calculate WPM
function calculateWPM() {
  const timeElapsed = (timeLimit - timeRemaining) / 60; // in minutes
  if (timeElapsed === 0) return 0;
  const words = correctCharacters / 5; // standard: 5 characters = 1 word
  return Math.round(words / timeElapsed);
}

// Calculate accuracy
function calculateAccuracy() {
  if (totalCharacters === 0) return 100;
  return Math.round((correctCharacters / totalCharacters) * 100);
}

// Update stats display
function updateStats() {
  wpmEl.textContent = calculateWPM();
  accuracyEl.textContent = calculateAccuracy() + '%';
  errorsEl.textContent = incorrectCharacters;
}

// End test
function endTest(completed) {
  isTestActive = false;
  clearInterval(timerInterval);
  textInput.disabled = true;
  
  // Show results
  showResults();
}

// Show results panel
function showResults() {
  const finalWpm = calculateWPM();
  const finalCpm = Math.round((correctCharacters / (timeLimit - timeRemaining)) * 60);
  const finalAccuracy = calculateAccuracy();
  
  document.getElementById('finalWpm').textContent = finalWpm;
  document.getElementById('finalCpm').textContent = isFinite(finalCpm) ? finalCpm : 0;
  document.getElementById('finalAccuracy').textContent = finalAccuracy + '%';
  document.getElementById('finalErrors').textContent = incorrectCharacters;
  
  resultsPanel.classList.remove('hidden');
}

// Close results and restart
function closeResults() {
  resultsPanel.classList.add('hidden');
  resetTest();
}

// Reset test
function resetTest() {
  clearInterval(timerInterval);
  isTestActive = false;
  timeRemaining = timeLimit;
  totalCharacters = 0;
  correctCharacters = 0;
  incorrectCharacters = 0;
  
  textInput.value = '';
  textInput.disabled = false;
  textInput.focus();
  
  timerEl.textContent = timeLimit;
  wpmEl.textContent = '0';
  accuracyEl.textContent = '100%';
  errorsEl.textContent = '0';
  
  displayText();
}

// Initialize app
init();`;

export const typingTestProject: Project = {
  id: 'typing-test',
  slug: 'typing-test',
  title: 'Typing Speed Test',
  difficulty: 'beginner',
  type: 'frontend',
  estimatedTime: '2–4 hours',
  playgroundKey: 'typing-test',
  description: 'Build a fully functional typing speed test that measures WPM (Words Per Minute), accuracy, and errors. Features multiple time modes, real-time character highlighting, and detailed results.',
  technologies: ['HTML', 'CSS', 'JavaScript'],
  prerequisites: ['Basic HTML/CSS', 'JavaScript fundamentals', 'DOM manipulation', 'Event handling'],
  learnings: [
    'Real-time input validation and comparison',
    'Timer implementation with setInterval',
    'Character-by-character text comparison',
    'Dynamic DOM manipulation with classList',
    'Calculating typing metrics (WPM, CPM, accuracy)',
    'Event-driven programming patterns',
    'Modal and overlay UI patterns',
    'Responsive grid layouts with CSS Grid',
    'User input handling and validation',
  ],
  features: [
    'Real-time character highlighting (correct/incorrect)',
    'Multiple time modes: 1, 2, 3, and 5 minutes',
    'Live WPM (Words Per Minute) calculation',
    'Live accuracy percentage display',
    'Error counting and tracking',
    'Random text selection from pool',
    'Detailed results modal with CPM (Characters Per Minute)',
    'Restart and new text buttons',
    'Gradient purple theme with smooth animations',
    'Fully responsive design for all devices',
  ],
  fileStructure: 'typing-test/\n  index.html\n  style.css\n  script.js',
  overview: 'A typing speed test is an excellent beginner project that teaches input handling, real-time comparison, timer management, and metric calculations. Users type the displayed text while the app tracks their speed, accuracy, and errors. The test can be customized with different time limits, and results are shown in a beautiful modal overlay.',
  objective: 'Build a complete typing speed test application with real-time feedback, multiple modes, accurate metrics calculation, and a polished user interface.',
  
  files: [
    { path: 'typing-test/index.html', language: 'html', content: indexHtml },
    { path: 'typing-test/style.css', language: 'css', content: styleCss },
    { path: 'typing-test/script.js', language: 'javascript', content: scriptJs },
  ],
  
  lessons: [
    {
      id: 'character-comparison',
      title: 'Real-Time Character Comparison',
      explanation: 'The core of the typing test is comparing what the user types with the target text character by character. Each character is wrapped in a span with a unique ID. As the user types, we iterate through both strings and apply CSS classes (correct/incorrect/current) based on whether characters match.',
      js: `function handleInput(e) {
  const typedText = textInput.value;
  
  // Compare each character
  for (let i = 0; i < currentText.length; i++) {
    const charSpan = document.getElementById(\`char-\${i}\`);
    
    if (i < typedText.length) {
      // Character has been typed
      if (typedText[i] === currentText[i]) {
        charSpan.className = 'correct';
        correctCharacters++;
      } else {
        charSpan.className = 'incorrect';
        incorrectCharacters++;
      }
    } else if (i === typedText.length) {
      // Current character cursor
      charSpan.className = 'current';
    } else {
      // Not yet typed
      charSpan.className = '';
    }
  }
}`,
    },
    {
      id: 'wpm-calculation',
      title: 'WPM and Accuracy Metrics',
      explanation: 'WPM (Words Per Minute) is calculated by dividing correct characters by 5 (standard: 5 chars = 1 word), then dividing by time elapsed in minutes. Accuracy is the percentage of correct characters out of total typed. These metrics update in real-time as the user types.',
      js: `function calculateWPM() {
  const timeElapsed = (timeLimit - timeRemaining) / 60; // minutes
  if (timeElapsed === 0) return 0;
  
  const words = correctCharacters / 5; // 5 characters = 1 word
  return Math.round(words / timeElapsed);
}

function calculateAccuracy() {
  if (totalCharacters === 0) return 100;
  return Math.round((correctCharacters / totalCharacters) * 100);
}

// Example:
// Typed 250 correct characters in 2 minutes
// Words = 250 / 5 = 50 words
// WPM = 50 / 2 = 25 WPM`,
    },
    {
      id: 'timer-management',
      title: 'Countdown Timer Implementation',
      explanation: 'The timer starts when the user begins typing. We use setInterval to decrement the time remaining every second. When time reaches zero, the test ends automatically. The timer can be stopped early if the user completes the entire text.',
      js: `function startTimer() {
  timeRemaining = timeLimit; // e.g., 60 seconds
  timerEl.textContent = timeRemaining;
  
  timerInterval = setInterval(() => {
    timeRemaining--;
    timerEl.textContent = timeRemaining;
    
    // End test when time runs out
    if (timeRemaining <= 0) {
      endTest(false);
    }
  }, 1000);
}

function endTest(completed) {
  clearInterval(timerInterval); // Stop timer
  textInput.disabled = true;     // Disable input
  showResults();                 // Show results modal
}`,
    },
    {
      id: 'mode-switching',
      title: 'Time Mode Selection',
      explanation: 'Users can choose different time limits (1, 2, 3, or 5 minutes) before starting the test. When a mode button is clicked, we update the timeLimit variable, toggle the active class for styling, and reset the test with the new time limit.',
      js: `modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons
    modeBtns.forEach(b => b.classList.remove('active'));
    
    // Add active class to clicked button
    btn.classList.add('active');
    
    // Update time limit from data attribute
    timeLimit = parseInt(btn.dataset.time);
    
    // Reset test with new time limit
    resetTest();
  });
});

// HTML: <button class="mode-btn" data-time="60">1 min</button>`,
    },
  ],
  
  challenges: [
    {
      id: 'difficulty-levels',
      title: 'Add Difficulty Levels',
      description: 'Add three difficulty levels: Easy (simple words), Medium (mixed sentences), Hard (complex technical terms). Create separate text arrays for each level and allow users to select difficulty before starting.',
      hint: 'Create three text arrays (easyTexts, mediumTexts, hardTexts). Add difficulty buttons similar to time mode buttons. Update loadNewText() to use the selected difficulty array.',
      difficulty: 'easy',
      solutionJs: `const easyTexts = [
  "The cat sat on the mat. Dogs like to run and play.",
  "I like to code. Programming is fun and creative."
];

const mediumTexts = [
  "JavaScript powers modern web applications and interactive websites.",
  "Learning algorithms improves problem solving abilities."
];

const hardTexts = [
  "Asynchronous programming with promises and async await enables non-blocking operations.",
  "Binary search trees provide logarithmic time complexity for insertion."
];

let currentDifficulty = 'medium';

function loadNewText() {
  const texts = currentDifficulty === 'easy' ? easyTexts :
                currentDifficulty === 'medium' ? mediumTexts : hardTexts;
  currentText = texts[Math.floor(Math.random() * texts.length)];
  displayText();
  resetTest();
}`,
    },
    {
      id: 'leaderboard',
      title: 'Add Local Leaderboard',
      description: 'Create a leaderboard that saves the top 10 test results to localStorage. Display the leaderboard showing WPM, accuracy, and date. Users can clear their history.',
      hint: 'Use localStorage.setItem() with JSON.stringify() to save results array. Load with JSON.parse() on page load. Sort by WPM descending and take top 10.',
      difficulty: 'medium',
      solutionJs: `function saveResult(wpm, accuracy, errors) {
  let leaderboard = JSON.parse(localStorage.getItem('typingLeaderboard') || '[]');
  
  leaderboard.push({
    wpm: wpm,
    accuracy: accuracy,
    errors: errors,
    date: new Date().toLocaleDateString()
  });
  
  // Sort by WPM descending and keep top 10
  leaderboard.sort((a, b) => b.wpm - a.wpm);
  leaderboard = leaderboard.slice(0, 10);
  
  localStorage.setItem('typingLeaderboard', JSON.stringify(leaderboard));
}

function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('typingLeaderboard') || '[]');
  const html = leaderboard.map((result, i) => \`
    <div class="leaderboard-row">
      <span>#\${i + 1}</span>
      <span>\${result.wpm} WPM</span>
      <span>\${result.accuracy}%</span>
      <span>\${result.date}</span>
    </div>
  \`).join('');
  document.getElementById('leaderboardList').innerHTML = html;
}`,
    },
    {
      id: 'live-graph',
      title: 'Add Live WPM Graph',
      description: 'Create a live graph that plots WPM over time during the test. Use HTML5 Canvas or a charting library to draw the graph. Update it every second showing how typing speed changes.',
      hint: 'Store WPM values in an array every second. Use Canvas 2D API to draw a line graph. Calculate points based on array index (time) and value (WPM).',
      difficulty: 'hard',
      solutionJs: `const wpmHistory = [];
const canvas = document.getElementById('wpmGraph');
const ctx = canvas.getContext('2d');

function updateGraph() {
  const currentWPM = calculateWPM();
  wpmHistory.push(currentWPM);
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw axes
  ctx.strokeStyle = '#ddd';
  ctx.beginPath();
  ctx.moveTo(40, 10);
  ctx.lineTo(40, canvas.height - 30);
  ctx.lineTo(canvas.width - 10, canvas.height - 30);
  ctx.stroke();
  
  // Draw line graph
  if (wpmHistory.length > 1) {
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    wpmHistory.forEach((wpm, i) => {
      const x = 40 + (i / wpmHistory.length) * (canvas.width - 50);
      const y = canvas.height - 30 - (wpm / 100) * (canvas.height - 40);
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    
    ctx.stroke();
  }
}

// Call updateGraph() every second in startTimer()`,
    },
  ],
  
  github: {
    owner: 'webdev-atlas',
    repo: 'typing-speed-test',
    branch: 'main',
    url: 'https://github.com/webdev-atlas/typing-speed-test',
  },
};
