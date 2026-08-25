import type { Project } from './types';

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Memory Card Game</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="container">
  <header>
    <h1>🧠 Memory Game</h1>
    <p class="subtitle">Find all matching pairs!</p>
  </header>

  <div class="stats">
    <div class="stat-item">
      <span class="stat-label">Moves</span>
      <span class="stat-value" id="moves">0</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Time</span>
      <span class="stat-value" id="time">00:00</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Pairs</span>
      <span class="stat-value" id="pairs">0/8</span>
    </div>
  </div>

  <div class="difficulty-selector">
    <button class="diff-btn active" data-level="easy">Easy (4x4)</button>
    <button class="diff-btn" data-level="medium">Medium (4x5)</button>
    <button class="diff-btn" data-level="hard">Hard (4x6)</button>
  </div>

  <div class="game-board" id="gameBoard"></div>

  <button class="btn-new-game" id="btnNewGame">New Game</button>

  <div class="modal hidden" id="winModal">
    <div class="modal-content">
      <h2>🎉 Congratulations!</h2>
      <p class="win-message">You won the game!</p>
      <div class="win-stats">
        <div class="win-stat">
          <span>Time</span>
          <strong id="finalTime">00:00</strong>
        </div>
        <div class="win-stat">
          <span>Moves</span>
          <strong id="finalMoves">0</strong>
        </div>
        <div class="win-stat">
          <span>Stars</span>
          <strong id="stars">⭐⭐⭐</strong>
        </div>
      </div>
      <button class="btn-play-again" id="btnPlayAgain">Play Again</button>
    </div>
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
  max-width: 700px;
  width: 100%;
}

header {
  text-align: center;
  margin-bottom: 25px;
}

h1 {
  font-size: 2.5rem;
  color: white;
  margin-bottom: 8px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.stat-item {
  background: white;
  padding: 15px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  display: block;
  font-size: 1.8rem;
  font-weight: bold;
  color: #667eea;
}

.difficulty-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.diff-btn {
  flex: 1;
  padding: 10px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.diff-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.diff-btn.active {
  background: white;
  color: #667eea;
  border-color: white;
}

.game-board {
  display: grid;
  gap: 10px;
  margin-bottom: 20px;
  perspective: 1000px;
}

.game-board.easy {
  grid-template-columns: repeat(4, 1fr);
}

.game-board.medium {
  grid-template-columns: repeat(5, 1fr);
}

.game-board.hard {
  grid-template-columns: repeat(6, 1fr);
}

.card {
  aspect-ratio: 1;
  background: white;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.card.flipped {
  transform: rotateY(180deg);
}

.card.matched {
  opacity: 0.6;
  cursor: default;
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.card-front {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
}

.card-back {
  background: white;
  transform: rotateY(180deg);
  font-size: 2.5rem;
}

.btn-new-game {
  width: 100%;
  padding: 15px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.btn-new-game:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal.hidden {
  display: none;
}

.modal-content {
  background: white;
  padding: 40px;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-content h2 {
  font-size: 2rem;
  color: #667eea;
  margin-bottom: 15px;
}

.win-message {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 25px;
}

.win-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.win-stat {
  background: #f3f4f6;
  padding: 15px;
  border-radius: 10px;
}

.win-stat span {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 5px;
  text-transform: uppercase;
}

.win-stat strong {
  display: block;
  font-size: 1.3rem;
  color: #667eea;
}

.btn-play-again {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.btn-play-again:hover {
  transform: translateY(-2px);
}

@media (max-width: 600px) {
  h1 {
    font-size: 2rem;
  }
  
  .card-back {
    font-size: 2rem;
  }
  
  .stats {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .difficulty-selector {
    flex-direction: column;
  }
}`;

const scriptJs = `// Card emojis
const cardEmojis = [
  '🎮', '🎯', '🎪', '🎨', '🎭', '🎸', '🎹', '🎺',
  '🎻', '🎲', '🎰', '🎳', '⚽', '🏀', '🏈', '⚾',
  '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🏒', '🏑'
];

// Game state
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = 0;
let timerInterval = null;
let isGameStarted = false;
let difficulty = 'easy';
let totalPairs = 8;

// DOM elements
const gameBoard = document.getElementById('gameBoard');
const movesEl = document.getElementById('moves');
const timeEl = document.getElementById('time');
const pairsEl = document.getElementById('pairs');
const btnNewGame = document.getElementById('btnNewGame');
const diffBtns = document.querySelectorAll('.diff-btn');
const winModal = document.getElementById('winModal');
const btnPlayAgain = document.getElementById('btnPlayAgain');

// Initialize game
function initGame() {
  // Reset state
  cards = [];
  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  timer = 0;
  isGameStarted = false;
  clearInterval(timerInterval);
  
  // Update stats
  movesEl.textContent = '0';
  timeEl.textContent = '00:00';
  pairsEl.textContent = \`0/\${totalPairs}\`;
  
  // Set grid size
  gameBoard.className = 'game-board ' + difficulty;
  
  // Generate cards
  const selectedEmojis = cardEmojis.slice(0, totalPairs);
  const cardPairs = [...selectedEmojis, ...selectedEmojis];
  cards = shuffle(cardPairs);
  
  // Render cards
  gameBoard.innerHTML = cards.map((emoji, index) => \`
    <div class="card" data-index="\${index}">
      <div class="card-front">?</div>
      <div class="card-back">\${emoji}</div>
    </div>
  \`).join('');
  
  // Add click listeners
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', flipCard);
  });
}

// Shuffle array
function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Start timer
function startTimer() {
  if (isGameStarted) return;
  isGameStarted = true;
  
  timerInterval = setInterval(() => {
    timer++;
    const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
    const seconds = (timer % 60).toString().padStart(2, '0');
    timeEl.textContent = \`\${minutes}:\${seconds}\`;
  }, 1000);
}

// Flip card
function flipCard(e) {
  const card = e.currentTarget;
  
  // Ignore if already flipped or matched
  if (card.classList.contains('flipped') || card.classList.contains('matched')) {
    return;
  }
  
  // Start timer on first flip
  if (!isGameStarted) {
    startTimer();
  }
  
  // Flip card
  card.classList.add('flipped');
  flippedCards.push(card);
  
  // Check for match when 2 cards flipped
  if (flippedCards.length === 2) {
    moves++;
    movesEl.textContent = moves;
    
    setTimeout(checkMatch, 600);
  }
}

// Check if cards match
function checkMatch() {
  const [card1, card2] = flippedCards;
  const index1 = parseInt(card1.dataset.index);
  const index2 = parseInt(card2.dataset.index);
  
  if (cards[index1] === cards[index2]) {
    // Match!
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedPairs++;
    pairsEl.textContent = \`\${matchedPairs}/\${totalPairs}\`;
    
    // Check win condition
    if (matchedPairs === totalPairs) {
      setTimeout(showWinModal, 500);
    }
  } else {
    // No match - flip back
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
  }
  
  flippedCards = [];
}

// Show win modal
function showWinModal() {
  clearInterval(timerInterval);
  
  document.getElementById('finalTime').textContent = timeEl.textContent;
  document.getElementById('finalMoves').textContent = moves;
  
  // Calculate stars based on moves
  let stars;
  if (moves <= totalPairs * 1.5) {
    stars = '⭐⭐⭐';
  } else if (moves <= totalPairs * 2) {
    stars = '⭐⭐';
  } else {
    stars = '⭐';
  }
  document.getElementById('stars').textContent = stars;
  
  winModal.classList.remove('hidden');
}

// Difficulty selector
diffBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    diffBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    difficulty = btn.dataset.level;
    
    // Set total pairs based on difficulty
    if (difficulty === 'easy') {
      totalPairs = 8;  // 4x4
    } else if (difficulty === 'medium') {
      totalPairs = 10; // 4x5
    } else {
      totalPairs = 12; // 4x6
    }
    
    initGame();
  });
});

// New game button
btnNewGame.addEventListener('click', initGame);

// Play again button
btnPlayAgain.addEventListener('click', () => {
  winModal.classList.add('hidden');
  initGame();
});

// Initialize on load
initGame();`;

export const memoryGameProject: Project = {
  id: 'memory-game',
  slug: 'memory-game',
  title: 'Memory Card Game',
  difficulty: 'beginner',
  type: 'frontend',
  estimatedTime: '3–4 hours',
  playgroundKey: 'memory-game',
  description: 'Build a memory card matching game with three difficulty levels, flip animations, move counter, timer, and star rating system. Features 3D card flip effects and win modal.',
  technologies: ['HTML', 'CSS', 'JavaScript'],
  prerequisites: ['Basic HTML/CSS', 'JavaScript fundamentals', 'Array methods', 'CSS transforms'],
  learnings: [
    'Array shuffling algorithms (Fisher-Yates)',
    'CSS 3D transforms and animations',
    'Game state management',
    'Timer implementation with setInterval',
    'Event delegation patterns',
    'Card matching logic',
    'Modal UI patterns',
    'Star rating calculation',
  ],
  features: [
    'Three difficulty levels: Easy (4×4), Medium (4×5), Hard (4×6)',
    '24 unique emoji cards',
    '3D card flip animations',
    'Move counter tracking',
    'Timer with minutes:seconds format',
    'Matched pairs progress indicator',
    'Win modal with final stats',
    'Star rating based on efficiency',
    'Shuffle algorithm for random card placement',
    'New game reset button',
  ],
  fileStructure: 'memory-game/\n  index.html\n  style.css\n  script.js',
  overview: 'A memory card game is a classic project that teaches array manipulation, game logic, animations, and state management. Players flip cards to find matching pairs while the app tracks moves and time. The game features three difficulty levels and awards stars based on performance.',
  objective: 'Build a complete memory game with multiple difficulty levels, smooth animations, accurate game logic, and performance tracking.',
  
  files: [
    { path: 'memory-game/index.html', language: 'html', content: indexHtml },
    { path: 'memory-game/style.css', language: 'css', content: styleCss },
    { path: 'memory-game/script.js', language: 'javascript', content: scriptJs },
  ],
  
  lessons: [
    {
      id: 'shuffle-algorithm',
      title: 'Fisher-Yates Shuffle Algorithm',
      explanation: 'The Fisher-Yates shuffle is an efficient algorithm for randomly shuffling an array. It works by iterating from the end of the array to the start, swapping each element with a random element before it. This ensures every permutation has equal probability.',
      js: `function shuffle(array) {
  const shuffled = [...array]; // Create copy to avoid mutating original
  
  // Start from end, swap with random element before it
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

// Example:
const cards = ['🎮', '🎯', '🎮', '🎯'];
const shuffled = shuffle(cards);
// Result: ['🎯', '🎮', '🎯', '🎮'] (random order)`,
    },
    {
      id: 'card-flip-animation',
      title: '3D Card Flip with CSS',
      explanation: 'CSS 3D transforms create the card flip effect. Each card has front and back faces positioned absolutely. The card container uses transform-style: preserve-3d and rotates on the Y-axis when flipped. backface-visibility: hidden ensures only the visible face shows.',
      js: `// CSS for 3D flip:
// .card {
//   transform-style: preserve-3d;
//   transition: transform 0.6s;
// }
// 
// .card.flipped {
//   transform: rotateY(180deg);
// }
// 
// .card-front, .card-back {
//   backface-visibility: hidden;
// }
// 
// .card-back {
//   transform: rotateY(180deg);
// }

// JavaScript to flip:
function flipCard(e) {
  const card = e.currentTarget;
  card.classList.add('flipped'); // Adds rotateY(180deg)
}`,
    },
    {
      id: 'match-checking',
      title: 'Card Matching Logic',
      explanation: 'When two cards are flipped, we compare their emoji values. If they match, add the "matched" class and increment the matched pairs counter. If not, flip them back after a delay. We prevent clicking during the comparison by checking if two cards are already flipped.',
      js: `let flippedCards = [];

function flipCard(e) {
  const card = e.currentTarget;
  
  // Prevent flipping if already flipped or matched
  if (card.classList.contains('flipped') || 
      card.classList.contains('matched')) {
    return;
  }
  
  card.classList.add('flipped');
  flippedCards.push(card);
  
  // Check match when 2 cards flipped
  if (flippedCards.length === 2) {
    setTimeout(checkMatch, 600); // Wait for flip animation
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const emoji1 = cards[parseInt(card1.dataset.index)];
  const emoji2 = cards[parseInt(card2.dataset.index)];
  
  if (emoji1 === emoji2) {
    // Match! Keep flipped
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedPairs++;
  } else {
    // No match - flip back
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
  }
  
  flippedCards = [];
}`,
    },
    {
      id: 'star-rating',
      title: 'Star Rating Calculation',
      explanation: 'Stars are awarded based on move efficiency. Calculate the optimal moves (total pairs) and compare to actual moves. Excellent performance (≤1.5× optimal) gets 3 stars, good (≤2× optimal) gets 2 stars, otherwise 1 star.',
      js: `function calculateStars(moves, totalPairs) {
  const optimalMoves = totalPairs; // Perfect game
  
  if (moves <= optimalMoves * 1.5) {
    return '⭐⭐⭐'; // Excellent: within 50% of optimal
  } else if (moves <= optimalMoves * 2) {
    return '⭐⭐';   // Good: within 100% of optimal
  } else {
    return '⭐';     // Needs improvement
  }
}

// Example with 8 pairs:
// 8-12 moves:  ⭐⭐⭐ (perfect to excellent)
// 13-16 moves: ⭐⭐   (good)
// 17+ moves:   ⭐     (needs practice)`,
    },
  ],
  
  challenges: [
    {
      id: 'leaderboard',
      title: 'Add Leaderboard with Best Times',
      description: 'Store the best completion times for each difficulty level in localStorage. Display a leaderboard showing top 5 scores with time, moves, and stars.',
      hint: 'Save array of {time, moves, stars, date, difficulty} objects. Sort by time ascending. Display separate leaderboards for each difficulty.',
      difficulty: 'easy',
      solutionJs: `function saveScore(time, moves, stars, difficulty) {
  const scores = JSON.parse(localStorage.getItem('memoryScores') || '[]');
  
  scores.push({
    time,
    moves,
    stars,
    difficulty,
    date: new Date().toLocaleDateString()
  });
  
  scores.sort((a, b) => a.time - b.time);
  
  localStorage.setItem('memoryScores', JSON.stringify(scores.slice(0, 10)));
}

function displayLeaderboard(difficulty) {
  const scores = JSON.parse(localStorage.getItem('memoryScores') || '[]');
  const filtered = scores.filter(s => s.difficulty === difficulty).slice(0, 5);
  
  return filtered.map((s, i) => \`
    <div>#\${i + 1} - \${formatTime(s.time)} - \${s.moves} moves - \${s.stars}</div>
  \`).join('');
}`,
    },
    {
      id: 'hint-system',
      title: 'Add Hint System',
      description: 'Allow users to use 3 hints per game. A hint briefly reveals two unmatched cards. Deduct a star for each hint used.',
      hint: 'Find two unmatched card indices randomly. Flip them for 2 seconds then flip back. Track hints remaining and deduct from star rating.',
      difficulty: 'medium',
      solutionJs: `let hintsRemaining = 3;

function useHint() {
  if (hintsRemaining <= 0) return;
  
  // Find unmatched cards
  const unmatched = Array.from(document.querySelectorAll('.card:not(.matched)'));
  
  if (unmatched.length < 2) return;
  
  // Pick 2 random unmatched cards
  const card1 = unmatched[Math.floor(Math.random() * unmatched.length)];
  const remaining = unmatched.filter(c => c !== card1);
  const card2 = remaining[Math.floor(Math.random() * remaining.length)];
  
  // Show cards briefly
  card1.classList.add('flipped');
  card2.classList.add('flipped');
  
  setTimeout(() => {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
  }, 2000);
  
  hintsRemaining--;
  document.getElementById('hintsLeft').textContent = hintsRemaining;
}`,
    },
    {
      id: 'multiplayer-mode',
      title: 'Add Two-Player Mode',
      description: 'Create a turn-based multiplayer mode. Players alternate turns. If they find a match, they get another turn. Track score for each player. Winner has most pairs.',
      hint: 'Add currentPlayer variable (1 or 2). On match, keep same player. On miss, switch player. Track pairs won by each player separately.',
      difficulty: 'hard',
      solutionJs: `let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;

function checkMatch() {
  const [card1, card2] = flippedCards;
  const index1 = parseInt(card1.dataset.index);
  const index2 = parseInt(card2.dataset.index);
  
  if (cards[index1] === cards[index2]) {
    // Match! Current player scores
    card1.classList.add('matched');
    card2.classList.add('matched');
    
    if (currentPlayer === 1) {
      player1Score++;
    } else {
      player2Score++;
    }
    
    updateScores();
    // Same player continues
  } else {
    // Miss - flip back and switch player
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
    
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateTurnIndicator();
  }
  
  flippedCards = [];
  
  // Check win
  if (player1Score + player2Score === totalPairs) {
    const winner = player1Score > player2Score ? 1 : 
                   player2Score > player1Score ? 2 : 'tie';
    showWinner(winner);
  }
}`,
    },
  ],
  
  github: {
    owner: 'webdev-atlas',
    repo: 'memory-game',
    branch: 'main',
    url: 'https://github.com/webdev-atlas/memory-game',
  },
};
