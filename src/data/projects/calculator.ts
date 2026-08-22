import type { Project } from './types';

const indexHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Scientific Calculator</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="calc">
  <div class="screen">
    <div id="mode-badge">STANDARD</div>
    <div id="hist-line"></div>
    <div id="expr-line"></div>
    <div id="result-line">0</div>
  </div>
  <div class="mode-row">
    <button class="mbtnn on" id="ms">Standard</button>
    <button class="mbtnn" id="mc2">Scientific</button>
    <button class="mbtnn" id="mp">Programmer</button>
  </div>
  <div id="sci-sec" style="display:none">
    <div class="sci-row">
      <button class="sf" id="bsin">sin</button>
      <button class="sf" id="bcos">cos</button>
      <button class="sf" id="btan">tan</button>
      <button class="sf" id="bln">ln</button>
      <button class="sf" id="blog">log</button>
      <button class="sf" id="bsqrt">√</button>
      <button class="sf" id="bpow">xⁿ</button>
      <button class="sf" id="bpi">π</button>
      <button class="sf" id="be">e</button>
      <button class="sf" id="bpar">( )</button>
    </div>
  </div>
  <div id="prog-sec" style="display:none">
    <div class="prog-panel">
      <div class="base-row">
        <button class="bb on" id="b10">DEC</button>
        <button class="bb" id="b16">HEX</button>
        <button class="bb" id="b8">OCT</button>
        <button class="bb" id="b2">BIN</button>
      </div>
      <div class="base-disp">
        <div>HEX: <span id="vhex">0</span></div>
        <div>OCT: <span id="voct">0</span></div>
        <div>BIN: <span id="vbin">0</span></div>
      </div>
    </div>
  </div>
  <div class="mem-row">
    <button class="km" id="bmc">MC</button>
    <button class="km" id="bmr">MR</button>
    <button class="km" id="bmp">M+</button>
    <button class="km" id="bmm">M−</button>
  </div>
  <div class="keys">
    <button class="k kfn kw2" id="bac">AC</button>
    <button class="k kfn" id="bbk">⌫</button>
    <button class="k kop" id="bdiv">÷</button>
    <button class="k" id="b7">7</button>
    <button class="k" id="b8n">8</button>
    <button class="k" id="b9">9</button>
    <button class="k kop" id="bmul">×</button>
    <button class="k" id="b4">4</button>
    <button class="k" id="b5">5</button>
    <button class="k" id="b6">6</button>
    <button class="k kop" id="bsub">−</button>
    <button class="k" id="b1">1</button>
    <button class="k" id="b2n">2</button>
    <button class="k" id="b3">3</button>
    <button class="k kop" id="badd">+</button>
    <button class="k kw2" id="b0">0</button>
    <button class="k" id="bdot">.</button>
    <button class="k keq" id="beq">=</button>
  </div>
  <div class="hist-panel">
    <div class="hist-title">History <button class="hclear" id="bhclear">Clear</button></div>
    <ul id="hist-ul"></ul>
  </div>
</div>
<script src="script.js"></script>
</body>
</html>`;

const styleCss = `*{box-sizing:border-box;margin:0;padding:0}
body{background:#111;display:flex;justify-content:center;align-items:flex-start;padding:12px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;min-height:100vh;}
.calc{background:#1c1c1e;border-radius:20px;padding:16px;width:300px;box-shadow:0 20px 60px rgba(0,0,0,.6);}
.screen{background:#000;border-radius:12px;padding:12px 14px 14px;margin-bottom:10px;}
#mode-badge{font-size:9px;font-weight:700;color:#ff9f0a;letter-spacing:.1em;margin-bottom:2px;}
#hist-line{color:#555;font-size:11px;min-height:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
#expr-line{color:#8e8e93;font-size:14px;min-height:20px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:2px;}
#result-line{color:#fff;font-size:44px;font-weight:200;line-height:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.mode-row{display:flex;gap:5px;margin-bottom:8px;}
.mbtnn{flex:1;padding:5px 2px;background:#2c2c2e;color:#8e8e93;border:1px solid #3a3a3c;border-radius:7px;font-size:10px;cursor:pointer;}
.mbtnn.on{background:#ff9f0a;color:#000;font-weight:700;border-color:#ff9f0a;}
.sci-row{display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin-bottom:7px;}
.sf{background:#2c2c2e;color:#ff9f0a;border:1px solid #3a3a3c;border-radius:7px;padding:7px 2px;font-size:11px;cursor:pointer;font-weight:600;text-align:center;}
.sf:active{opacity:.7;}
.prog-panel{margin-bottom:7px;}
.base-row{display:flex;gap:5px;margin-bottom:6px;}
.bb{flex:1;padding:4px;background:#2c2c2e;color:#8e8e93;border:1px solid #3a3a3c;border-radius:7px;font-size:10px;cursor:pointer;}
.bb.on{background:#30d158;color:#000;font-weight:700;}
.base-disp{background:#000;border-radius:8px;padding:7px 10px;font-size:11px;font-family:monospace;}
.base-disp div{color:#8e8e93;margin:2px 0;}
.base-disp span{color:#fff;}
.keys{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-bottom:8px;}
.k{background:#333336;color:#fff;border:none;border-radius:50%;width:55px;height:55px;font-size:19px;cursor:pointer;transition:transform .08s;display:flex;align-items:center;justify-content:center;}
.k:active{transform:scale(.9);}
.kfn{background:#636366;font-size:14px;}
.kop{background:#ff9f0a;color:#000;font-weight:700;}
.keq{background:#ff9f0a;color:#000;font-weight:700;}
.kw2{border-radius:28px;width:auto;grid-column:span 2;padding:0;justify-content:flex-start;padding-left:20px;}
.mem-row{display:flex;gap:5px;margin-bottom:8px;}
.km{flex:1;background:#2c2c2e;color:#ff9f0a;border:1px solid#3a3a3c;border-radius:7px;padding:6px;font-size:11px;cursor:pointer;font-weight:600;}
.km:active{opacity:.7;}
.hist-panel{background:#000;border-radius:8px;padding:8px;max-height:100px;overflow-y:auto;}
.hist-title{color:#555;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;}
.hclear{background:#333;color:#aaa;border:none;border-radius:4px;padding:2px 7px;font-size:10px;cursor:pointer;}
#hist-ul{list-style:none;padding:0;}
#hist-ul li{color:#666;font-size:11px;font-family:monospace;padding:2px 0;border-bottom:1px solid #111;cursor:pointer;}
#hist-ul li:hover{color:#ff9f0a;}
#hist-ul li b{color:#ff9f0a;float:right;margin-left:8px;}`;

const scriptJs = `// =====================================================
// Scientific Calculator
// Supports Standard, Scientific, and Programmer modes
// with memory functions, history, and keyboard support
// =====================================================

var expr = '';
var memory = 0;
var history = [];
var mode = 'std';
var base = 10;
var calculating = false;

// DOM elements
var RL = document.getElementById('result-line');
var EL = document.getElementById('expr-line');
var HL = document.getElementById('hist-line');

function setDisplay(r) { RL.textContent = r; }
function setExpr(e) { EL.textContent = e; }
function setHist(h) { HL.textContent = h; }

// Number button press
function numPress(v) {
  if (RL.textContent === 'Error') {
    expr = '';
    setDisplay('0');
    setExpr('');
  }
  expr += String(v);
  setExpr(expr);
  tryPreview();
}

// Operator button press
function opPress(v) {
  if (!expr) { expr = String(RL.textContent); }
  if (expr === 'Error' || expr === '0') return;
  expr += v;
  setExpr(expr);
}

// Insert function (for scientific functions)
function insFunc(v) {
  if (!expr) { expr = String(RL.textContent); }
  expr += v;
  setExpr(expr);
}

// Clear all
function clearAll() {
  expr = '';
  setDisplay('0');
  setExpr('');
  setHist('');
}

// Backspace
function backspace() {
  expr = expr.slice(0, -1);
  setExpr(expr);
  tryPreview();
}

// Live preview as user types
function tryPreview() {
  try {
    var r = Function('return (' + expr + ')')();
    if (typeof r === 'number' && isFinite(r) && expr.length > 1) {
      setDisplay(parseFloat(r.toFixed(10)));
    }
  } catch (e) {}
}

// Calculate result
function calculate() {
  if (calculating) return;
  if (!expr) return;
  calculating = true;
  setTimeout(function() { calculating = false; }, 200);
  
  try {
    var r = Function('"use strict";return(' + expr + ')')();
    if (typeof r !== 'number' || !isFinite(r)) throw new Error('Invalid');
    r = parseFloat(r.toFixed(10));
    addHistory(expr, r);
    setHist(expr + ' =');
    setExpr('');
    setDisplay(r);
    if (mode === 'prog') updateBases(r);
    expr = String(r);
    console.log('=', r);
  } catch (e) {
    setDisplay('Error');
    setExpr('');
    expr = '';
  }
}

// Add to history
function addHistory(e, r) {
  history.unshift({ expr: e, result: r });
  if (history.length > 20) history.pop();
  renderHistory();
}

// Render history list
function renderHistory() {
  var ul = document.getElementById('hist-ul');
  ul.innerHTML = '';
  history.forEach(function(h, i) {
    var li = document.createElement('li');
    li.innerHTML = h.expr + '<b>=' + h.result + '</b>';
    li.addEventListener('click', function() {
      expr = String(h.result);
      setDisplay(h.result);
      setHist(h.expr + ' =');
    });
    ul.appendChild(li);
  });
}

// Set calculator mode
function setMode(m) {
  mode = m;
  document.getElementById('ms').className = 'mbtnn' + (m === 'std' ? ' on' : '');
  document.getElementById('mc2').className = 'mbtnn' + (m === 'sci' ? ' on' : '');
  document.getElementById('mp').className = 'mbtnn' + (m === 'prog' ? ' on' : '');
  document.getElementById('sci-sec').style.display = m === 'sci' ? 'block' : 'none';
  document.getElementById('prog-sec').style.display = m === 'prog' ? 'block' : 'none';
  document.getElementById('mode-badge').textContent = m === 'std' ? 'STANDARD' : m === 'sci' ? 'SCIENTIFIC' : 'PROGRAMMER';
}

// Set number base (for programmer mode)
function setBase(b) {
  base = b;
  ['b10', 'b16', 'b8', 'b2'].forEach(function(id) {
    document.getElementById(id).className = 'bb';
  });
  document.getElementById('b' + b).className = 'bb on';
  updateBases(parseFloat(RL.textContent) || 0);
}

// Update base conversions
function updateBases(n) {
  n = Math.trunc(n) || 0;
  document.getElementById('vhex').textContent = n.toString(16).toUpperCase();
  document.getElementById('voct').textContent = n.toString(8);
  document.getElementById('vbin').textContent = n.toString(2);
}

// Wire up number and operator buttons
document.getElementById('bac').addEventListener('click', clearAll);
document.getElementById('bbk').addEventListener('click', backspace);
document.getElementById('beq').addEventListener('click', calculate);
document.getElementById('bdiv').addEventListener('click', function() { opPress('/'); });
document.getElementById('bmul').addEventListener('click', function() { opPress('*'); });
document.getElementById('bsub').addEventListener('click', function() { opPress('-'); });
document.getElementById('badd').addEventListener('click', function() { opPress('+'); });
document.getElementById('b0').addEventListener('click', function() { numPress('0'); });
document.getElementById('b1').addEventListener('click', function() { numPress('1'); });
document.getElementById('b2n').addEventListener('click', function() { numPress('2'); });
document.getElementById('b3').addEventListener('click', function() { numPress('3'); });
document.getElementById('b4').addEventListener('click', function() { numPress('4'); });
document.getElementById('b5').addEventListener('click', function() { numPress('5'); });
document.getElementById('b6').addEventListener('click', function() { numPress('6'); });
document.getElementById('b7').addEventListener('click', function() { numPress('7'); });
document.getElementById('b8n').addEventListener('click', function() { numPress('8'); });
document.getElementById('b9').addEventListener('click', function() { numPress('9'); });
document.getElementById('bdot').addEventListener('click', function() { numPress('.'); });

// Scientific functions
document.getElementById('bsin').addEventListener('click', function() { insFunc('Math.sin('); });
document.getElementById('bcos').addEventListener('click', function() { insFunc('Math.cos('); });
document.getElementById('btan').addEventListener('click', function() { insFunc('Math.tan('); });
document.getElementById('bln').addEventListener('click', function() { insFunc('Math.log('); });
document.getElementById('blog').addEventListener('click', function() { insFunc('Math.log10('); });
document.getElementById('bsqrt').addEventListener('click', function() { insFunc('Math.sqrt('); });
document.getElementById('bpow').addEventListener('click', function() { insFunc('Math.pow('); });
document.getElementById('bpi').addEventListener('click', function() { insFunc('Math.PI'); });
document.getElementById('be').addEventListener('click', function() { insFunc('Math.E'); });
document.getElementById('bpar').addEventListener('click', function() {
  insFunc(expr.split('(').length > expr.split(')').length ? ')' : '(');
});

// Mode buttons
document.getElementById('ms').addEventListener('click', function() { setMode('std'); });
document.getElementById('mc2').addEventListener('click', function() { setMode('sci'); });
document.getElementById('mp').addEventListener('click', function() { setMode('prog'); });

// Base buttons (programmer mode)
document.getElementById('b10').addEventListener('click', function() { setBase(10); });
document.getElementById('b16').addEventListener('click', function() { setBase(16); });
document.getElementById('b8').addEventListener('click', function() { setBase(8); });
document.getElementById('b2').addEventListener('click', function() { setBase(2); });

// Memory functions
document.getElementById('bmc').addEventListener('click', function() {
  memory = 0;
  console.log('Memory cleared');
});
document.getElementById('bmr').addEventListener('click', function() {
  var v = memory;
  expr = String(v);
  setDisplay(v);
  setHist('MR = ' + v);
});
document.getElementById('bmp').addEventListener('click', function() {
  var v = parseFloat(RL.textContent) || 0;
  memory += v;
  console.log('M+ Memory:', memory);
});
document.getElementById('bmm').addEventListener('click', function() {
  var v = parseFloat(RL.textContent) || 0;
  memory -= v;
  console.log('M- Memory:', memory);
});
document.getElementById('bhclear').addEventListener('click', function() {
  history = [];
  document.getElementById('hist-ul').innerHTML = '';
});

// Keyboard support
document.addEventListener('keydown', function(e) {
  if (e.key >= '0' && e.key <= '9') {
    numPress(e.key);
  } else if (e.key === '.') {
    numPress('.');
  } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
    opPress(e.key);
  } else if (e.key === 'Enter' || e.key === '=') {
    if (expr) calculate();
  } else if (e.key === 'Backspace') {
    backspace();
  } else if (e.key === 'Escape') {
    clearAll();
  } else if (e.key === '(' || e.key === ')') {
    insFunc(e.key);
  }
});

console.log('Scientific Calculator ready! Standard / Scientific / Programmer modes. Keyboard supported.');`;

export const calculatorProject: Project = {
  id: 'calculator',
  slug: 'calculator',
  title: 'Scientific Calculator',
  difficulty: 'beginner',
  type: 'frontend',
  estimatedTime: '3–5 hours',
  playgroundKey: 'calculator',
  description: 'Build a fully working scientific calculator with Standard, Scientific (sin/cos/tan/log/√), and Programmer (HEX/OCT/BIN) modes. Includes memory functions, calculation history, and full keyboard support.',
  technologies: ['HTML', 'CSS', 'JavaScript'],
  prerequisites: ['Basic HTML/CSS', 'JavaScript fundamentals', 'DOM manipulation', 'Event handling'],
  learnings: [
    'DOM manipulation and event handling patterns',
    'Mathematical operations with JavaScript Math object',
    'Number system conversions (decimal, hex, octal, binary)',
    'State management for calculator modes',
    'CSS Grid layout for button positioning',
    'Keyboard event handling for accessibility',
    'Live expression preview with dynamic calculation',
    'Error handling for invalid operations',
    'Click history and persistence patterns',
  ],
  features: [
    'Three calculation modes: Standard, Scientific, Programmer',
    'Basic operations: +, −, ×, ÷',
    'Scientific functions: sin, cos, tan, log, ln, π, e, √, xⁿ',
    'Programmer mode: DEC, HEX, OCT, BIN conversions',
    'Memory functions: MC, MR, M+, M−',
    'Live expression preview',
    'Calculation history with clickable results',
    'Full keyboard support (numbers, operators, Enter, Escape)',
    'Clear All (AC) and Backspace (⌫)',
    'iOS-style dark theme calculator design',
  ],
  fileStructure: 'calculator/\n  index.html\n  style.css\n  script.js',
  overview: 'A scientific calculator is a classic project that teaches the fundamentals of state management, mathematical operations, and dynamic UI updates. This calculator supports three modes: Standard for basic arithmetic, Scientific for advanced math functions, and Programmer for number base conversions. The live preview feature shows results as you type, and the history panel lets you recall previous calculations.',
  objective: 'Build a complete multi-mode calculator with memory functions, calculation history, keyboard support, and responsive layout using vanilla JavaScript.',
  nextProject: 'quiz-app',
  
  files: [
    { path: 'calculator/index.html', language: 'html', content: indexHtml },
    { path: 'calculator/style.css', language: 'css', content: styleCss },
    { path: 'calculator/script.js', language: 'javascript', content: scriptJs },
  ],
  
  lessons: [
    {
      id: 'state-management',
      title: 'Calculator State Management',
      explanation: 'The calculator maintains several state variables: current expression (expr), memory value, calculation history, current mode (std/sci/prog), and number base. All button clicks update the expression string, which is then evaluated using JavaScript\'s Function() constructor. The display shows a live preview of the result as you type.',
      js: `// Global state
var expr = '';        // Current expression like "2+3*4"
var memory = 0;       // Memory storage
var history = [];     // Array of {expr, result} objects
var mode = 'std';     // 'std', 'sci', or 'prog'
var base = 10;        // 10, 16, 8, or 2 for programmer mode

// Update display elements
function setDisplay(r) { RL.textContent = r; }
function setExpr(e) { EL.textContent = e; }

// Number button: append to expression
function numPress(v) {
  expr += String(v);
  setExpr(expr);
  tryPreview(); // show live result
}

// Operator button: append operator
function opPress(v) {
  if (!expr) expr = String(RL.textContent);
  expr += v;
  setExpr(expr);
}

// Live preview: evaluate expression without finalizing
function tryPreview() {
  try {
    var r = Function('return (' + expr + ')')();
    if (typeof r === 'number' && isFinite(r)) {
      setDisplay(parseFloat(r.toFixed(10)));
    }
  } catch (e) {}
}`,
    },
    {
      id: 'expression-eval',
      title: 'Safe Expression Evaluation',
      explanation: 'The calculator evaluates mathematical expressions by wrapping them in a Function() constructor. This allows expressions like "2+3*4" or "Math.sin(0.5)" to be evaluated. The Function() is safer than eval() because it doesn\'t have access to the outer scope. We use "use strict" to prevent certain dangerous operations.',
      js: `function calculate() {
  if (!expr) return;
  
  try {
    // Wrap expression in strict mode Function()
    var r = Function('"use strict";return(' + expr + ')')();
    
    // Validate result is a finite number
    if (typeof r !== 'number' || !isFinite(r)) {
      throw new Error('Invalid');
    }
    
    // Round to 10 decimal places to avoid floating point errors
    r = parseFloat(r.toFixed(10));
    
    // Add to history and display result
    addHistory(expr, r);
    setDisplay(r);
    expr = String(r); // Allow chaining calculations
    
  } catch (e) {
    setDisplay('Error');
    expr = '';
  }
}

// Example expressions that work:
// "2+3*4"     → 14
// "Math.sin(Math.PI/2)" → 1
// "Math.sqrt(16)"       → 4
// "Math.pow(2,8)"       → 256`,
    },
    {
      id: 'mode-switching',
      title: 'Calculator Modes',
      explanation: 'The calculator has three modes that show/hide different button panels. Standard mode shows basic arithmetic. Scientific mode adds trigonometric, logarithmic, and power functions. Programmer mode adds number base conversions. Mode switching is handled by toggling CSS display properties and updating button states.',
      js: `function setMode(m) {
  mode = m; // 'std', 'sci', or 'prog'
  
  // Update mode button states
  document.getElementById('ms').className = 
    'mbtnn' + (m === 'std' ? ' on' : '');
  document.getElementById('mc2').className = 
    'mbtnn' + (m === 'sci' ? ' on' : '');
  document.getElementById('mp').className = 
    'mbtnn' + (m === 'prog' ? ' on' : '');
  
  // Show/hide mode-specific panels
  document.getElementById('sci-sec').style.display = 
    m === 'sci' ? 'block' : 'none';
  document.getElementById('prog-sec').style.display = 
    m === 'prog' ? 'block' : 'none';
  
  // Update display badge
  document.getElementById('mode-badge').textContent = 
    m === 'std' ? 'STANDARD' : 
    m === 'sci' ? 'SCIENTIFIC' : 'PROGRAMMER';
}

// Scientific functions insert Math methods
document.getElementById('bsin').addEventListener('click', function() {
  insFunc('Math.sin(');
});

// Result: expr becomes "Math.sin(" + user completes it`,
    },
    {
      id: 'base-conversion',
      title: 'Number Base Conversion',
      explanation: 'Programmer mode converts the current result to hexadecimal, octal, and binary. JavaScript\'s toString(radix) method handles conversion. We truncate to integer with Math.trunc() since fractional binary/hex values are rarely useful. The base display updates whenever a new result is calculated.',
      js: `function updateBases(n) {
  // Convert to integer
  n = Math.trunc(n) || 0;
  
  // Convert to different bases
  document.getElementById('vhex').textContent = 
    n.toString(16).toUpperCase(); // Base 16: HEX
  document.getElementById('voct').textContent = 
    n.toString(8);                // Base 8: OCT
  document.getElementById('vbin').textContent = 
    n.toString(2);                // Base 2: BIN
}

// Examples:
// 255 → HEX: FF, OCT: 377, BIN: 11111111
// 42  → HEX: 2A, OCT: 52,  BIN: 101010
// 100 → HEX: 64, OCT: 144, BIN: 1100100

// Base selector buttons
function setBase(b) {
  base = b;
  // Toggle active button
  ['b10', 'b16', 'b8', 'b2'].forEach(function(id) {
    document.getElementById(id).className = 'bb';
  });
  document.getElementById('b' + b).className = 'bb on';
  updateBases(parseFloat(RL.textContent) || 0);
}`,
    },
  ],
  
  challenges: [
    {
      id: 'scientific-mode',
      title: 'Extend Scientific Functions',
      description: 'Add more scientific functions: asin (arcsine), acos (arccosine), atan (arctangent), factorial (n!), and exponential (eˣ). Update the UI to include buttons for these functions.',
      hint: 'Use Math.asin(), Math.acos(), Math.atan() for inverse trig. For factorial, write a loop or recursive function. For eˣ use Math.exp(x).',
      difficulty: 'medium',
      solutionJs: `// Add factorial function
function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  var result = 1;
  for (var i = 2; i <= n; i++) result *= i;
  return result;
}

// Wire up new buttons
document.getElementById('basin').addEventListener('click', function() {
  insFunc('Math.asin(');
});
document.getElementById('bacos').addEventListener('click', function() {
  insFunc('Math.acos(');
});
document.getElementById('batan').addEventListener('click', function() {
  insFunc('Math.atan(');
});
document.getElementById('bfact').addEventListener('click', function() {
  // Get current number and calculate factorial
  var n = parseInt(RL.textContent);
  if (!isNaN(n)) {
    expr = String(factorial(n));
    setDisplay(factorial(n));
  }
});
document.getElementById('bexp').addEventListener('click', function() {
  insFunc('Math.exp(');
});`,
    },
    {
      id: 'history-persistence',
      title: 'Persist History with localStorage',
      description: 'Save calculation history to localStorage so it persists across page reloads. Load history on page load and update it whenever a new calculation is performed.',
      hint: 'Use JSON.stringify() to convert history array to string before saving. Use JSON.parse() to convert back when loading.',
      difficulty: 'easy',
      solutionJs: `// Load history from localStorage on init
function loadHistory() {
  var saved = localStorage.getItem('calc_history');
  if (saved) {
    history = JSON.parse(saved);
    renderHistory();
  }
}

// Save history to localStorage
function saveHistory() {
  localStorage.setItem('calc_history', JSON.stringify(history));
}

// Update addHistory to save after adding
function addHistory(e, r) {
  history.unshift({ expr: e, result: r });
  if (history.length > 20) history.pop();
  renderHistory();
  saveHistory(); // Save to localStorage
}

// Update clear history to remove from localStorage
document.getElementById('bhclear').addEventListener('click', function() {
  history = [];
  document.getElementById('hist-ul').innerHTML = '';
  localStorage.removeItem('calc_history');
});

// Call loadHistory() on page load
loadHistory();`,
    },
    {
      id: 'advanced-keyboard',
      title: 'Advanced Keyboard Shortcuts',
      description: 'Add advanced keyboard shortcuts: Ctrl+C to copy result, Ctrl+V to paste into expression, Ctrl+H to toggle history panel, and arrow keys to navigate history.',
      hint: 'Use e.ctrlKey to detect Ctrl key combinations. Use navigator.clipboard.writeText() for copying. Add history navigation index variable.',
      difficulty: 'hard',
      solutionJs: `var historyIndex = -1;

document.addEventListener('keydown', function(e) {
  // Copy result (Ctrl+C)
  if (e.ctrlKey && e.key === 'c') {
    e.preventDefault();
    navigator.clipboard.writeText(RL.textContent);
    console.log('Copied:', RL.textContent);
  }
  
  // Paste into expression (Ctrl+V)
  else if (e.ctrlKey && e.key === 'v') {
    e.preventDefault();
    navigator.clipboard.readText().then(function(text) {
      expr += text;
      setExpr(expr);
      tryPreview();
    });
  }
  
  // Toggle history panel (Ctrl+H)
  else if (e.ctrlKey && e.key === 'h') {
    e.preventDefault();
    var panel = document.querySelector('.hist-panel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  }
  
  // Navigate history with arrow keys
  else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (historyIndex < history.length - 1) {
      historyIndex++;
      var h = history[historyIndex];
      expr = h.expr;
      setExpr(expr);
      setDisplay(h.result);
    }
  }
  else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      var h = history[historyIndex];
      expr = h.expr;
      setExpr(expr);
      setDisplay(h.result);
    } else if (historyIndex === 0) {
      historyIndex = -1;
      clearAll();
    }
  }
});`,
    },
  ],
  
  github: {
    owner: 'webdev-atlas',
    repo: 'calculator-project',
    branch: 'main',
    url: 'https://github.com/webdev-atlas/calculator-project',
  },
};
