import type { Project } from './types';

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pomodoro Timer</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="container">
  <h1>🍅 Pomodoro Timer</h1>
  
  <div class="mode-tabs">
    <button class="tab active" data-mode="work">Work</button>
    <button class="tab" data-mode="short">Short Break</button>
    <button class="tab" data-mode="long">Long Break</button>
  </div>

  <div class="timer-display">
    <svg class="progress-ring" width="300" height="300">
      <circle class="progress-ring-circle" stroke="#e5e7eb" stroke-width="8" fill="transparent" r="140" cx="150" cy="150"/>
      <circle class="progress-ring-bar" stroke="#ef4444" stroke-width="8" fill="transparent" r="140" cx="150" cy="150"/>
    </svg>
    <div class="time" id="time">25:00</div>
  </div>

  <div class="controls">
    <button class="btn-control btn-start" id="btnStart">Start</button>
    <button class="btn-control btn-pause hidden" id="btnPause">Pause</button>
    <button class="btn-reset" id="btnReset">Reset</button>
  </div>

  <div class="session-info">
    <div class="info-item">
      <span>Sessions</span>
      <strong id="sessions">0/4</strong>
    </div>
    <div class="info-item">
      <span>Total Focus</span>
      <strong id="totalTime">0h 0m</strong>
    </div>
  </div>

  <div class="settings">
    <h3>Settings</h3>
    <div class="setting-item">
      <label>Work Duration (min)</label>
      <input type="number" id="workDuration" value="25" min="1" max="60">
    </div>
    <div class="setting-item">
      <label>Short Break (min)</label>
      <input type="number" id="shortBreak" value="5" min="1" max="15">
    </div>
    <div class="setting-item">
      <label>Long Break (min)</label>
      <input type="number" id="longBreak" value="15" min="5" max="30">
    </div>
    <div class="setting-item">
      <label>Sessions Before Long Break</label>
      <input type="number" id="sessionsTarget" value="4" min="2" max="10">
    </div>
  </div>
</div>
<audio id="alarmSound" src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE=" preload="auto"></audio>
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
  border-radius: 30px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  color: #667eea;
  margin-bottom: 30px;
}

.mode-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  background: #f3f4f6;
  padding: 5px;
  border-radius: 12px;
}

.tab {
  flex: 1;
  padding: 12px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: #666;
  transition: all 0.3s ease;
}

.tab.active {
  background: white;
  color: #ef4444;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.timer-display {
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto 30px;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-bar {
  transition: stroke-dashoffset 1s linear;
  stroke-linecap: round;
}

.time {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4rem;
  font-weight: bold;
  color: #1f2937;
}

.controls {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.btn-control {
  flex: 1;
  padding: 18px;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-start {
  background: #10b981;
  color: white;
}

.btn-start:hover {
  background: #059669;
  transform: translateY(-2px);
}

.btn-pause {
  background: #f59e0b;
  color: white;
}

.btn-pause:hover {
  background: #d97706;
}

.btn-reset {
  flex: 1;
  padding: 18px;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-reset:hover {
  background: #e5e7eb;
}

.hidden {
  display: none !important;
}

.session-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 30px;
}

.info-item {
  background: #f9fafb;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
}

.info-item span {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 5px;
}

.info-item strong {
  display: block;
  font-size: 1.5rem;
  color: #667eea;
}

.settings {
  border-top: 2px solid #e5e7eb;
  padding-top: 25px;
}

.settings h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 15px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.setting-item label {
  font-size: 0.95rem;
  color: #666;
}

.setting-item input {
  width: 80px;
  padding: 8px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  text-align: center;
}

.setting-item input:focus {
  outline: none;
  border-color: #667eea;
}

@media (max-width: 600px) {
  .container {
    padding: 25px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .timer-display {
    width: 250px;
    height: 250px;
  }
  
  .time {
    font-size: 3rem;
  }
}`;

const scriptJs = `// State
let mode = 'work';
let timeLeft = 25 * 60;
let timerInterval = null;
let isRunning = false;
let sessionCount = 0;
let totalFocusTime = 0;

// Settings
let workDuration = 25;
let shortBreakDuration = 5;
let longBreakDuration = 15;
let sessionsTarget = 4;

// DOM elements
const timeEl = document.getElementById('time');
const btnStart = document.getElementById('btnStart');
const btnPause = document.getElementById('btnPause');
const btnReset = document.getElementById('btnReset');
const tabs = document.querySelectorAll('.tab');
const sessionsEl = document.getElementById('sessions');
const totalTimeEl = document.getElementById('totalTime');
const alarmSound = document.getElementById('alarmSound');
const progressBar = document.querySelector('.progress-ring-bar');

// Settings inputs
const workDurationInput = document.getElementById('workDuration');
const shortBreakInput = document.getElementById('shortBreak');
const longBreakInput = document.getElementById('longBreak');
const sessionsTargetInput = document.getElementById('sessionsTarget');

// Calculate circle circumference for progress ring
const radius = 140;
const circumference = 2 * Math.PI * radius;
progressBar.style.strokeDasharray = circumference;
progressBar.style.strokeDashoffset = 0;

// Initialize
updateDisplay();
updateSessionInfo();

// Mode tabs
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    if (isRunning) return;
    
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    mode = tab.dataset.mode;
    
    resetTimer();
  });
});

// Start button
btnStart.addEventListener('click', () => {
  isRunning = true;
  btnStart.classList.add('hidden');
  btnPause.classList.remove('hidden');
  
  timerInterval = setInterval(() => {
    timeLeft--;
    updateDisplay();
    updateProgress();
    
    if (timeLeft <= 0) {
      completeSession();
    }
  }, 1000);
});

// Pause button
btnPause.addEventListener('click', () => {
  isRunning = false;
  btnPause.classList.add('hidden');
  btnStart.classList.remove('hidden');
  clearInterval(timerInterval);
});

// Reset button
btnReset.addEventListener('click', () => {
  resetTimer();
});

// Reset timer
function resetTimer() {
  isRunning = false;
  clearInterval(timerInterval);
  btnPause.classList.add('hidden');
  btnStart.classList.remove('hidden');
  
  if (mode === 'work') {
    timeLeft = workDuration * 60;
  } else if (mode === 'short') {
    timeLeft = shortBreakDuration * 60;
  } else {
    timeLeft = longBreakDuration * 60;
  }
  
  updateDisplay();
  updateProgress();
}

// Complete session
function completeSession() {
  isRunning = false;
  clearInterval(timerInterval);
  alarmSound.play();
  
  // Update stats if work session
  if (mode === 'work') {
    sessionCount++;
    totalFocusTime += workDuration;
    updateSessionInfo();
    
    // Auto-switch to break
    if (sessionCount % sessionsTarget === 0) {
      switchMode('long');
    } else {
      switchMode('short');
    }
  } else {
    // Break ended, switch to work
    switchMode('work');
  }
}

// Switch mode
function switchMode(newMode) {
  mode = newMode;
  tabs.forEach(t => {
    t.classList.toggle('active', t.dataset.mode === mode);
  });
  resetTimer();
  
  // Show notification
  if (Notification.permission === 'granted') {
    new Notification('Pomodoro Timer', {
      body: mode === 'work' ? 'Break is over! Time to focus.' : 'Session complete! Take a break.',
      icon: '🍅'
    });
  }
}

// Update display
function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeEl.textContent = \`\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
}

// Update progress ring
function updateProgress() {
  let totalTime;
  if (mode === 'work') {
    totalTime = workDuration * 60;
  } else if (mode === 'short') {
    totalTime = shortBreakDuration * 60;
  } else {
    totalTime = longBreakDuration * 60;
  }
  
  const progress = (totalTime - timeLeft) / totalTime;
  const offset = circumference - (progress * circumference);
  progressBar.style.strokeDashoffset = offset;
}

// Update session info
function updateSessionInfo() {
  sessionsEl.textContent = \`\${sessionCount}/\${sessionsTarget}\`;
  
  const hours = Math.floor(totalFocusTime / 60);
  const minutes = totalFocusTime % 60;
  totalTimeEl.textContent = \`\${hours}h \${minutes}m\`;
}

// Settings listeners
workDurationInput.addEventListener('change', (e) => {
  workDuration = parseInt(e.target.value);
  if (mode === 'work' && !isRunning) resetTimer();
});

shortBreakInput.addEventListener('change', (e) => {
  shortBreakDuration = parseInt(e.target.value);
  if (mode === 'short' && !isRunning) resetTimer();
});

longBreakInput.addEventListener('change', (e) => {
  longBreakDuration = parseInt(e.target.value);
  if (mode === 'long' && !isRunning) resetTimer();
});

sessionsTargetInput.addEventListener('change', (e) => {
  sessionsTarget = parseInt(e.target.value);
  updateSessionInfo();
});

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}`;

export const pomodoroTimerProject: Project = {
  id: 'pomodoro-timer',
  slug: 'pomodoro-timer',
  title: 'Pomodoro Timer',
  difficulty: 'intermediate',
  type: 'frontend',
  estimatedTime: '4–6 hours',
  playgroundKey: 'pomodoro-timer',
  description: 'Build a productivity timer based on the Pomodoro Technique with work/break modes, circular progress ring, session tracking, customizable durations, audio alarm, and browser notifications.',
  technologies: ['HTML', 'CSS', 'JavaScript'],
  prerequisites: ['JavaScript fundamentals', 'setInterval/setTimeout', 'SVG basics', 'Web Notifications API'],
  learnings: [
    'Timer implementation with setInterval',
    'SVG circle progress ring with stroke-dashoffset',
    'Browser Notifications API',
    'Audio playback with HTML5',
    'State management for timer modes',
    'Settings persistence',
    'Time formatting and calculations',
    'Auto-switching between modes',
  ],
  features: [
    'Three modes: Work (25min), Short Break (5min), Long Break (15min)',
    'Circular SVG progress ring animation',
    'Start, pause, and reset controls',
    'Session counter with target tracking',
    'Total focus time calculator',
    'Customizable durations for all modes',
    'Audio alarm on completion',
    'Browser notifications',
    'Auto-switch to break after work session',
    'Long break after configurable sessions',
  ],
  fileStructure: 'pomodoro-timer/\n  index.html\n  style.css\n  script.js',
  overview: 'The Pomodoro Technique is a time management method using focused work intervals followed by breaks. This app implements a complete Pomodoro timer with SVG progress visualization, session tracking, and customizable settings. It helps users stay productive by breaking work into manageable chunks.',
  objective: 'Build a fully functional Pomodoro timer with visual progress tracking, multiple modes, audio feedback, and browser notifications.',
  
  files: [
    { path: 'pomodoro-timer/index.html', language: 'html', content: indexHtml },
    { path: 'pomodoro-timer/style.css', language: 'css', content: styleCss },
    { path: 'pomodoro-timer/script.js', language: 'javascript', content: scriptJs },
  ],
  
  lessons: [
    {
      id: 'svg-progress-ring',
      title: 'SVG Circular Progress Ring',
      explanation: 'An SVG circle progress ring uses stroke-dasharray and stroke-dashoffset to create an animated progress indicator. The circumference is calculated from the radius (2πr), and offset is reduced as progress increases.',
      js: `const radius = 140;
const circumference = 2 * Math.PI * radius; // ~880

// Set full circle
progressBar.style.strokeDasharray = circumference;

// Update progress (0-100%)
function updateProgress(progress) {
  const offset = circumference - (progress * circumference);
  progressBar.style.strokeDashoffset = offset;
}

// Example: 25% complete
updateProgress(0.25); // offset = 880 - (0.25 * 880) = 660`,
    },
    {
      id: 'notifications-api',
      title: 'Browser Notifications API',
      explanation: 'The Notifications API allows sending system notifications. First request permission, then create notifications when timer completes. Notifications work even when the tab is in the background.',
      js: `// Request permission on page load
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

// Send notification
function sendNotification(title, body) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: body,
      icon: '🍅',
      badge: '🍅'
    });
  }
}

sendNotification('Pomodoro', 'Work session complete! Take a break.');`,
    },
    {
      id: 'auto-mode-switching',
      title: 'Auto Mode Switching Logic',
      explanation: 'After completing a work session, automatically switch to short break. After completing the target number of sessions (default 4), switch to long break instead. Track session count and use modulo to determine break type.',
      js: `let sessionCount = 0;
const sessionsTarget = 4;

function completeSession() {
  if (mode === 'work') {
    sessionCount++;
    
    // Check if long break is due
    if (sessionCount % sessionsTarget === 0) {
      switchMode('long'); // Every 4th session
    } else {
      switchMode('short'); // Regular break
    }
  } else {
    // Break ended, back to work
    switchMode('work');
  }
}

// Example: After 4 work sessions, take long break
// Sessions: W-S-W-S-W-S-W-L (repeat)`,
    },
    {
      id: 'time-formatting',
      title: 'Time Formatting MM:SS',
      explanation: 'Convert seconds to minutes:seconds format using division and modulo. Use padStart to ensure two-digit display (05:03 instead of 5:3).',
      js: `function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  return \`\${minutes.toString().padStart(2, '0')}:\${secs.toString().padStart(2, '0')}\`;
}

// Examples:
formatTime(125);  // "02:05"
formatTime(3661); // "61:01"
formatTime(45);   // "00:45"`,
    },
  ],
  
  challenges: [
    {
      id: 'task-list',
      title: 'Add Task List Integration',
      description: 'Add a task list where users can assign Pomodoro sessions to specific tasks. Track completed sessions per task. Show which task is currently active.',
      hint: 'Create array of {task, sessions} objects. Allow selecting active task. Increment sessions on work completion. Display task name during timer.',
      difficulty: 'medium',
      solutionJs: `let tasks = [
  { id: 1, name: 'Study React', sessions: 0, target: 4 },
  { id: 2, name: 'Exercise', sessions: 0, target: 2 }
];
let activeTask = null;

function completeWorkSession() {
  if (activeTask) {
    const task = tasks.find(t => t.id === activeTask);
    task.sessions++;
    updateTaskList();
  }
}

function selectTask(taskId) {
  activeTask = taskId;
  const task = tasks.find(t => t.id === taskId);
  document.getElementById('activeTask').textContent = task.name;
}`,
    },
    {
      id: 'statistics-chart',
      title: 'Add Daily Statistics Chart',
      description: 'Track completed Pomodoros per day and display a bar chart showing last 7 days. Store data in localStorage with date keys. Show total sessions and focus hours per day.',
      hint: 'Save {date, sessions, minutes} to localStorage. Use canvas or CSS bars to visualize. Group by date and display last 7 days.',
      difficulty: 'hard',
      solutionJs: `function saveSessionData() {
  const today = new Date().toISOString().split('T')[0];
  const stats = JSON.parse(localStorage.getItem('pomodoroStats') || '{}');
  
  if (!stats[today]) {
    stats[today] = { sessions: 0, minutes: 0 };
  }
  
  stats[today].sessions++;
  stats[today].minutes += workDuration;
  
  localStorage.setItem('pomodoroStats', JSON.stringify(stats));
}

function getLast7Days() {
  const stats = JSON.parse(localStorage.getItem('pomodoroStats') || '{}');
  const days = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    days.push({
      date: dateStr,
      sessions: stats[dateStr]?.sessions || 0
    });
  }
  
  return days;
}`,
    },
  ],
  
  github: {
    owner: 'webdev-atlas',
    repo: 'pomodoro-timer',
    branch: 'main',
    url: 'https://github.com/webdev-atlas/pomodoro-timer',
  },
};
