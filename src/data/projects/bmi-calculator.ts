import type { Project } from './types';

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BMI Calculator</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="container">
  <div class="card">
    <header>
      <h1>💪 BMI Calculator</h1>
      <p class="subtitle">Calculate your Body Mass Index and health status</p>
    </header>

    <form id="bmiForm">
      <div class="unit-toggle">
        <button type="button" class="unit-btn active" data-unit="metric">Metric</button>
        <button type="button" class="unit-btn" data-unit="imperial">Imperial</button>
      </div>

      <div class="input-group">
        <label for="age">Age</label>
        <input type="number" id="age" placeholder="Enter age" min="2" max="120" required>
        <span class="unit-label">years</span>
      </div>

      <div class="input-group">
        <label for="gender">Gender</label>
        <select id="gender" required>
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div class="input-group">
        <label for="height">Height</label>
        <input type="number" id="height" placeholder="Enter height" step="0.1" required>
        <span class="unit-label" id="heightUnit">cm</span>
      </div>

      <div class="input-group">
        <label for="weight">Weight</label>
        <input type="number" id="weight" placeholder="Enter weight" step="0.1" required>
        <span class="unit-label" id="weightUnit">kg</span>
      </div>

      <button type="submit" class="btn-calculate">Calculate BMI</button>
    </form>

    <div class="result hidden" id="result">
      <div class="bmi-value">
        <span class="label">Your BMI</span>
        <span class="value" id="bmiValue">0</span>
      </div>
      
      <div class="category-badge" id="categoryBadge">Normal</div>
      
      <div class="health-message" id="healthMessage">
        You have a normal body weight. Keep it up!
      </div>

      <div class="bmi-scale">
        <div class="scale-bar">
          <div class="scale-marker" id="scaleMarker"></div>
        </div>
        <div class="scale-labels">
          <span>Underweight<br>&lt;18.5</span>
          <span>Normal<br>18.5-24.9</span>
          <span>Overweight<br>25-29.9</span>
          <span>Obese<br>≥30</span>
        </div>
      </div>

      <div class="details-grid">
        <div class="detail-item">
          <span class="detail-label">Healthy Weight Range</span>
          <span class="detail-value" id="healthyRange">0 - 0 kg</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Weight to Lose/Gain</span>
          <span class="detail-value" id="weightChange">0 kg</span>
        </div>
      </div>

      <button class="btn-reset" id="btnReset">Calculate Again</button>
    </div>

    <div class="history" id="history">
      <h3>Recent Calculations</h3>
      <div class="history-list" id="historyList"></div>
      <button class="btn-clear-history" id="btnClearHistory">Clear History</button>
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
  max-width: 500px;
  width: 100%;
}

.card {
  background: white;
  border-radius: 20px;
  padding: 40px;
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
  font-size: 1rem;
}

.unit-toggle {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
  background: #f3f4f6;
  padding: 5px;
  border-radius: 10px;
}

.unit-btn {
  flex: 1;
  padding: 10px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: #666;
  transition: all 0.3s ease;
}

.unit-btn.active {
  background: white;
  color: #667eea;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 20px;
  position: relative;
}

.input-group label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 12px 60px 12px 15px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input-group input:focus,
.input-group select:focus {
  outline: none;
  border-color: #667eea;
}

.unit-label {
  position: absolute;
  right: 15px;
  bottom: 13px;
  color: #9ca3af;
  font-weight: 600;
  font-size: 0.9rem;
}

.btn-calculate {
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

.btn-calculate:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.result {
  margin-top: 30px;
  text-align: center;
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

.bmi-value {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.bmi-value .label {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.bmi-value .value {
  font-size: 4rem;
  font-weight: bold;
  color: #667eea;
}

.category-badge {
  display: inline-block;
  padding: 10px 25px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 15px;
}

.category-badge.underweight {
  background: #dbeafe;
  color: #1e40af;
}

.category-badge.normal {
  background: #d1fae5;
  color: #065f46;
}

.category-badge.overweight {
  background: #fed7aa;
  color: #92400e;
}

.category-badge.obese {
  background: #fecaca;
  color: #991b1b;
}

.health-message {
  color: #666;
  font-size: 1rem;
  margin-bottom: 30px;
  line-height: 1.6;
}

.bmi-scale {
  margin: 30px 0;
}

.scale-bar {
  height: 20px;
  background: linear-gradient(to right, #3b82f6, #10b981, #f59e0b, #ef4444);
  border-radius: 10px;
  position: relative;
  margin-bottom: 10px;
}

.scale-marker {
  position: absolute;
  top: -5px;
  width: 3px;
  height: 30px;
  background: #1f2937;
  border-radius: 2px;
  transition: left 0.5s ease;
}

.scale-labels {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  text-align: center;
  font-size: 0.75rem;
  color: #666;
  line-height: 1.4;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin: 30px 0;
}

.detail-item {
  background: #f9fafb;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
}

.detail-label {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 5px;
}

.detail-value {
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
}

.btn-reset {
  width: 100%;
  padding: 12px;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-reset:hover {
  background: #e5e7eb;
}

.history {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 2px solid #e5e7eb;
}

.history h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 15px;
}

.history-list {
  max-height: 200px;
  overflow-y: auto;
}

.history-item {
  background: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.history-item .bmi {
  font-weight: 700;
  color: #667eea;
}

.history-item .date {
  color: #9ca3af;
  font-size: 0.8rem;
}

.btn-clear-history {
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #666;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 10px;
}

.btn-clear-history:hover {
  background: #f9fafb;
}

@media (max-width: 600px) {
  .card {
    padding: 25px;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .bmi-value .value {
    font-size: 3rem;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
}`;

const scriptJs = `// State
let currentUnit = 'metric';
let history = JSON.parse(localStorage.getItem('bmiHistory') || '[]');

// DOM elements
const form = document.getElementById('bmiForm');
const unitBtns = document.querySelectorAll('.unit-btn');
const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
const heightUnit = document.getElementById('heightUnit');
const weightUnit = document.getElementById('weightUnit');
const resultDiv = document.getElementById('result');
const bmiValue = document.getElementById('bmiValue');
const categoryBadge = document.getElementById('categoryBadge');
const healthMessage = document.getElementById('healthMessage');
const scaleMarker = document.getElementById('scaleMarker');
const healthyRange = document.getElementById('healthyRange');
const weightChange = document.getElementById('weightChange');
const btnReset = document.getElementById('btnReset');
const historyList = document.getElementById('historyList');
const btnClearHistory = document.getElementById('btnClearHistory');

// Unit toggle
unitBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    unitBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentUnit = btn.dataset.unit;
    
    if (currentUnit === 'metric') {
      heightUnit.textContent = 'cm';
      weightUnit.textContent = 'kg';
      heightInput.placeholder = 'Enter height';
      weightInput.placeholder = 'Enter weight';
    } else {
      heightUnit.textContent = 'in';
      weightUnit.textContent = 'lbs';
      heightInput.placeholder = 'Enter height';
      weightInput.placeholder = 'Enter weight';
    }
    
    // Clear previous values
    heightInput.value = '';
    weightInput.value = '';
  });
});

// Calculate BMI
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const age = parseInt(document.getElementById('age').value);
  const gender = document.getElementById('gender').value;
  let height = parseFloat(heightInput.value);
  let weight = parseFloat(weightInput.value);
  
  // Convert to metric if imperial
  if (currentUnit === 'imperial') {
    height = height * 2.54; // inches to cm
    weight = weight * 0.453592; // lbs to kg
  }
  
  // Calculate BMI
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  // Display result
  displayResult(bmi, weight, heightInMeters, age, gender);
  
  // Save to history
  saveToHistory(bmi, age, gender);
});

function displayResult(bmi, weight, heightInMeters, age, gender) {
  resultDiv.classList.remove('hidden');
  bmiValue.textContent = bmi.toFixed(1);
  
  // Determine category
  let category, message;
  if (bmi < 18.5) {
    category = 'underweight';
    message = 'You are underweight. Consider consulting a nutritionist to gain weight healthily.';
  } else if (bmi < 25) {
    category = 'normal';
    message = 'You have a normal body weight. Great job maintaining a healthy lifestyle!';
  } else if (bmi < 30) {
    category = 'overweight';
    message = 'You are overweight. Consider a balanced diet and regular exercise.';
  } else {
    category = 'obese';
    message = 'You are obese. Please consult a healthcare provider for a personalized plan.';
  }
  
  categoryBadge.className = 'category-badge ' + category;
  categoryBadge.textContent = category.charAt(0).toUpperCase() + category.slice(1);
  healthMessage.textContent = message;
  
  // Update scale marker position
  let markerPosition;
  if (bmi < 18.5) {
    markerPosition = (bmi / 18.5) * 25; // 0-25%
  } else if (bmi < 25) {
    markerPosition = 25 + ((bmi - 18.5) / 6.5) * 25; // 25-50%
  } else if (bmi < 30) {
    markerPosition = 50 + ((bmi - 25) / 5) * 25; // 50-75%
  } else {
    markerPosition = 75 + Math.min(((bmi - 30) / 10) * 25, 25); // 75-100%
  }
  scaleMarker.style.left = markerPosition + '%';
  
  // Calculate healthy weight range (BMI 18.5 - 24.9)
  const minHealthyWeight = 18.5 * heightInMeters * heightInMeters;
  const maxHealthyWeight = 24.9 * heightInMeters * heightInMeters;
  
  const unit = currentUnit === 'metric' ? 'kg' : 'lbs';
  const displayMinWeight = currentUnit === 'metric' ? minHealthyWeight : minHealthyWeight * 2.20462;
  const displayMaxWeight = currentUnit === 'metric' ? maxHealthyWeight : maxHealthyWeight * 2.20462;
  
  healthyRange.textContent = \`\${displayMinWeight.toFixed(1)} - \${displayMaxWeight.toFixed(1)} \${unit}\`;
  
  // Calculate weight to lose/gain
  let targetWeight;
  if (bmi < 18.5) {
    targetWeight = minHealthyWeight - weight;
    weightChange.textContent = \`Gain \${(currentUnit === 'metric' ? targetWeight : targetWeight * 2.20462).toFixed(1)} \${unit}\`;
    weightChange.style.color = '#2563eb';
  } else if (bmi > 24.9) {
    targetWeight = weight - maxHealthyWeight;
    weightChange.textContent = \`Lose \${(currentUnit === 'metric' ? targetWeight : targetWeight * 2.20462).toFixed(1)} \${unit}\`;
    weightChange.style.color = '#ef4444';
  } else {
    weightChange.textContent = 'Maintain current weight';
    weightChange.style.color = '#10b981';
  }
  
  // Scroll to result
  resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function saveToHistory(bmi, age, gender) {
  const entry = {
    bmi: bmi.toFixed(1),
    age,
    gender,
    date: new Date().toLocaleDateString(),
    timestamp: Date.now()
  };
  
  history.unshift(entry);
  if (history.length > 10) history.pop(); // Keep only last 10
  
  localStorage.setItem('bmiHistory', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  if (history.length === 0) {
    historyList.innerHTML = '<p style="color: #9ca3af; text-align: center; padding: 20px;">No history yet</p>';
    return;
  }
  
  historyList.innerHTML = history.map(entry => \`
    <div class="history-item">
      <div>
        <span class="bmi">BMI: \${entry.bmi}</span> 
        <span style="color: #9ca3af;">· \${entry.age}y · \${entry.gender}</span>
      </div>
      <span class="date">\${entry.date}</span>
    </div>
  \`).join('');
}

btnReset.addEventListener('click', () => {
  resultDiv.classList.add('hidden');
  form.reset();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

btnClearHistory.addEventListener('click', () => {
  if (confirm('Clear all history?')) {
    history = [];
    localStorage.removeItem('bmiHistory');
    renderHistory();
  }
});

// Initialize
renderHistory();`;

export const bmiCalculatorProject: Project = {
  id: 'bmi-calculator',
  slug: 'bmi-calculator',
  title: 'BMI Calculator',
  difficulty: 'beginner',
  type: 'frontend',
  estimatedTime: '2–3 hours',
  playgroundKey: 'bmi-calculator',
  description: 'Build a Body Mass Index calculator with metric/imperial units, health status categories, visual BMI scale, healthy weight range calculator, and calculation history with localStorage.',
  technologies: ['HTML', 'CSS', 'JavaScript'],
  prerequisites: ['Basic HTML/CSS', 'JavaScript fundamentals', 'DOM manipulation', 'localStorage'],
  learnings: [
    'Form handling and validation',
    'Unit conversion (metric/imperial)',
    'Mathematical calculations (BMI formula)',
    'Conditional logic for health categories',
    'Dynamic CSS class manipulation',
    'localStorage for data persistence',
    'Visual data representation',
    'Smooth scrolling and animations',
  ],
  features: [
    'Metric and Imperial unit systems',
    'Age and gender input',
    'Real-time BMI calculation',
    'Health category determination (Underweight/Normal/Overweight/Obese)',
    'Visual BMI scale with animated marker',
    'Healthy weight range calculator',
    'Weight gain/loss recommendations',
    'Calculation history with localStorage',
    'Clear history option',
    'Responsive design',
  ],
  fileStructure: 'bmi-calculator/\n  index.html\n  style.css\n  script.js',
  overview: 'A BMI (Body Mass Index) calculator is a practical beginner project that teaches form handling, mathematical calculations, unit conversions, and data persistence. Users enter their height, weight, age, and gender to receive their BMI score, health category, and personalized recommendations. The app stores calculation history for tracking progress over time.',
  objective: 'Build a complete BMI calculator with unit conversion, visual feedback, health recommendations, and persistent history storage.',
  
  files: [
    { path: 'bmi-calculator/index.html', language: 'html', content: indexHtml },
    { path: 'bmi-calculator/style.css', language: 'css', content: styleCss },
    { path: 'bmi-calculator/script.js', language: 'javascript', content: scriptJs },
  ],
  
  lessons: [
    {
      id: 'bmi-formula',
      title: 'BMI Calculation Formula',
      explanation: 'BMI is calculated by dividing weight in kilograms by height in meters squared. The formula is: BMI = weight(kg) / height(m)². For imperial units, we first convert inches to centimeters (×2.54) and pounds to kilograms (×0.453592) before calculation.',
      js: `function calculateBMI(weight, height, unit) {
  // Convert to metric if imperial
  if (unit === 'imperial') {
    height = height * 2.54;     // inches to cm
    weight = weight * 0.453592;  // pounds to kg
  }
  
  // Convert height from cm to meters
  const heightInMeters = height / 100;
  
  // BMI formula: weight(kg) / height(m)²
  const bmi = weight / (heightInMeters * heightInMeters);
  
  return bmi;
}

// Example:
// Weight: 70 kg, Height: 175 cm
// heightInMeters = 1.75
// BMI = 70 / (1.75 × 1.75) = 70 / 3.0625 = 22.86`,
    },
    {
      id: 'health-categories',
      title: 'BMI Health Categories',
      explanation: 'BMI values are categorized into four health ranges defined by the World Health Organization: Underweight (<18.5), Normal (18.5-24.9), Overweight (25-29.9), and Obese (≥30). Based on the category, we provide different styling and health messages.',
      js: `function getBMICategory(bmi) {
  let category, message, className;
  
  if (bmi < 18.5) {
    category = 'Underweight';
    className = 'underweight';
    message = 'You are underweight. Consider consulting a nutritionist.';
  } else if (bmi < 25) {
    category = 'Normal';
    className = 'normal';
    message = 'You have a normal body weight. Great job!';
  } else if (bmi < 30) {
    category = 'Overweight';
    className = 'overweight';
    message = 'You are overweight. Consider diet and exercise.';
  } else {
    category = 'Obese';
    className = 'obese';
    message = 'You are obese. Please consult a healthcare provider.';
  }
  
  return { category, className, message };
}`,
    },
    {
      id: 'scale-visualization',
      title: 'Visual BMI Scale with Marker',
      explanation: 'The BMI scale is a colored gradient bar divided into four sections. We calculate the marker position as a percentage (0-100%) based on the BMI value. Each category occupies 25% of the bar, and we interpolate within each range.',
      js: `function updateScaleMarker(bmi) {
  let markerPosition;
  
  if (bmi < 18.5) {
    // Underweight: 0-25% of bar
    markerPosition = (bmi / 18.5) * 25;
  } else if (bmi < 25) {
    // Normal: 25-50% of bar
    markerPosition = 25 + ((bmi - 18.5) / 6.5) * 25;
  } else if (bmi < 30) {
    // Overweight: 50-75% of bar
    markerPosition = 50 + ((bmi - 25) / 5) * 25;
  } else {
    // Obese: 75-100% of bar
    markerPosition = 75 + Math.min(((bmi - 30) / 10) * 25, 25);
  }
  
  // Move marker to position
  scaleMarker.style.left = markerPosition + '%';
}

// Example: BMI = 22 (Normal range)
// Position = 25 + ((22 - 18.5) / 6.5) * 25 = 38.46%`,
    },
    {
      id: 'healthy-weight-range',
      title: 'Calculate Healthy Weight Range',
      explanation: 'The healthy weight range is calculated by finding what weights would give BMI values of 18.5 (lower limit) and 24.9 (upper limit) for the user\'s height. We rearrange the BMI formula: weight = BMI × height².',
      js: `function calculateHealthyRange(heightInMeters, currentWeight) {
  // Rearrange: weight = BMI × height²
  const minHealthyWeight = 18.5 * heightInMeters * heightInMeters;
  const maxHealthyWeight = 24.9 * heightInMeters * heightInMeters;
  
  // Calculate how much to lose or gain
  let recommendation;
  if (currentWeight < minHealthyWeight) {
    const toGain = minHealthyWeight - currentWeight;
    recommendation = \`Gain \${toGain.toFixed(1)} kg\`;
  } else if (currentWeight > maxHealthyWeight) {
    const toLose = currentWeight - maxHealthyWeight;
    recommendation = \`Lose \${toLose.toFixed(1)} kg\`;
  } else {
    recommendation = 'Maintain current weight';
  }
  
  return {
    range: \`\${minHealthyWeight.toFixed(1)} - \${maxHealthyWeight.toFixed(1)} kg\`,
    recommendation
  };
}`,
    },
  ],
  
  challenges: [
    {
      id: 'body-fat-percentage',
      title: 'Add Body Fat Percentage Estimator',
      description: 'Estimate body fat percentage using age, gender, and BMI with the formula: For males: (1.20 × BMI) + (0.23 × Age) - 16.2. For females: (1.20 × BMI) + (0.23 × Age) - 5.4. Display alongside BMI.',
      hint: 'Add a new calculation function that takes BMI, age, and gender. Display the result as a percentage with a separate visual indicator.',
      difficulty: 'easy',
      solutionJs: `function calculateBodyFat(bmi, age, gender) {
  let bodyFat;
  
  if (gender === 'male') {
    bodyFat = (1.20 * bmi) + (0.23 * age) - 16.2;
  } else {
    bodyFat = (1.20 * bmi) + (0.23 * age) - 5.4;
  }
  
  return Math.max(0, bodyFat); // Ensure non-negative
}

// Add to displayResult function:
const bodyFat = calculateBodyFat(bmi, age, gender);
document.getElementById('bodyFatValue').textContent = bodyFat.toFixed(1) + '%';`,
    },
    {
      id: 'calorie-calculator',
      title: 'Add Daily Calorie Needs Calculator',
      description: 'Calculate BMR (Basal Metabolic Rate) using the Mifflin-St Jeor equation and multiply by activity level to get daily calorie needs. Add activity level selector (sedentary/light/moderate/active/very active).',
      hint: 'BMR formula for males: (10 × weight) + (6.25 × height) - (5 × age) + 5. For females: same but -161 instead of +5. Multiply by activity multiplier.',
      difficulty: 'medium',
      solutionJs: `function calculateBMR(weight, height, age, gender) {
  // Weight in kg, height in cm
  let bmr;
  
  if (gender === 'male') {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
  
  return bmr;
}

function calculateTDEE(bmr, activityLevel) {
  const multipliers = {
    sedentary: 1.2,      // Little or no exercise
    light: 1.375,        // 1-3 days/week
    moderate: 1.55,      // 3-5 days/week
    active: 1.725,       // 6-7 days/week
    veryActive: 1.9      // Athlete level
  };
  
  return bmr * multipliers[activityLevel];
}

// Display:
const bmr = calculateBMR(weight, height, age, gender);
const tdee = calculateTDEE(bmr, activityLevel);
console.log(\`Daily calories: \${Math.round(tdee)} kcal\`);`,
    },
    {
      id: 'goal-tracker',
      title: 'Add Weight Goal Tracker with Timeline',
      description: 'Allow users to set a target weight goal. Calculate how many weeks it will take at a healthy rate (0.5-1 kg/week loss, 0.25-0.5 kg/week gain). Show a progress bar and timeline chart.',
      hint: 'Store goal in localStorage. Calculate weeks needed based on current vs target weight. Safe weight change is 0.5-1 kg/week for loss, 0.25-0.5 kg/week for gain.',
      difficulty: 'hard',
      solutionJs: `function calculateGoalTimeline(currentWeight, targetWeight, rate = 0.5) {
  const difference = Math.abs(targetWeight - currentWeight);
  const weeks = Math.ceil(difference / rate);
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + (weeks * 7));
  
  return {
    weeks,
    targetDate: targetDate.toLocaleDateString(),
    weeklyChange: rate,
    isLoss: currentWeight > targetWeight
  };
}

// Save goal to localStorage
function saveGoal(targetWeight, rate) {
  const goal = {
    target: targetWeight,
    rate,
    startDate: new Date().toISOString(),
    startWeight: currentWeight
  };
  localStorage.setItem('weightGoal', JSON.stringify(goal));
}

// Display progress
function displayProgress() {
  const goal = JSON.parse(localStorage.getItem('weightGoal'));
  const progress = Math.abs(goal.startWeight - currentWeight);
  const total = Math.abs(goal.startWeight - goal.target);
  const percentage = (progress / total) * 100;
  
  document.getElementById('progressBar').style.width = percentage + '%';
  document.getElementById('progressText').textContent = 
    \`\${progress.toFixed(1)} / \${total.toFixed(1)} kg (\${percentage.toFixed(1)}%)\`;
}`,
    },
  ],
  
  github: {
    owner: 'webdev-atlas',
    repo: 'bmi-calculator',
    branch: 'main',
    url: 'https://github.com/webdev-atlas/bmi-calculator',
  },
};
