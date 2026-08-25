'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Play, RotateCcw, Maximize2, Minimize2, Copy, Check, Download, ChevronDown, Terminal, BookOpen } from 'lucide-react';
import Link from 'next/link';

const TS_JS = '// TypeScript — type annotations compile automatically\ninterface User {\n  name: string;\n  age: number;\n}\n\nfunction greet(user: User): string {\n  return "Hello, " + user.name + "! Age: " + user.age;\n}\n\nconst alex: User = { name: "Alex", age: 25 };\nconsole.log(greet(alex));\n\n// Generic function\nfunction first<T>(arr: T[]): T | undefined { return arr[0]; }\nconsole.log("first:", first([10, 20, 30]));\n\n// Union type\ntype Status = "active" | "inactive" | "pending";\nfunction getLabel(s: Status) {\n  const map: Record<Status, string> = { active: "Active", inactive: "Inactive", pending: "Pending" };\n  return map[s];\n}\nconsole.log(getLabel("active"));';

const REACT_JS = '// React — CDN React 18 + Babel loaded automatically\nfunction Counter() {\n  const [count, setCount] = React.useState(0);\n  return (\n    <div className="card">\n      <h2>\u26db\ufe0f React Counter</h2>\n      <p>Click to update state</p>\n      <div className="count">{count}</div>\n      <button onClick={() => setCount(c => c + 1)}>Increment +</button>\n      {" "}\n      <button onClick={() => setCount(0)} style={{background:"#6b7280"}}>Reset</button>\n    </div>\n  );\n}\nReactDOM.createRoot(document.getElementById("root")).render(<Counter />);';

const QUIZ_JS = '// ===== QUIZ DATA =====\n' +
'var QUESTIONS = {\n' +
'  javascript: [\n' +
'    {q:\'Which keyword declares a block-scoped variable?\',opts:[\'var\',\'let\',\'def\',\'dim\'],ans:1,exp:\'let declares block-scoped variables, unlike var which is function-scoped.\'},\n' +
'    {q:\'What does typeof null return?\',opts:[\'null\',\'undefined\',\'object\',\'boolean\'],ans:2,exp:\'typeof null returns "object" - a historic bug in JavaScript.\'},\n' +
'    {q:\'Which array method creates a new array with transformed elements?\',opts:[\'forEach\',\'filter\',\'map\',\'reduce\'],ans:2,exp:\'Array.map() returns a new array with each element transformed.\'},\n' +
'    {q:\'What is the output of: 0 == false?\',opts:[\'false\',\'true\',\'TypeError\',\'undefined\'],ans:1,exp:\'0 == false is true due to type coercion. Use === to avoid this.\'},\n' +
'    {q:\'Which method removes the last element of an array?\',opts:[\'shift\',\'splice\',\'pop\',\'slice\'],ans:2,exp:\'Array.pop() removes and returns the last element.\'},\n' +
'    {q:\'What does === check?\',opts:[\'Value only\',\'Type only\',\'Value and type\',\'Neither\'],ans:2,exp:\'=== checks both value AND type without coercion.\'},\n' +
'    {q:\'How do you create a Promise?\',opts:[\'new Promise()\',\'Promise.create()\',\'async()\',\'await()\'],ans:0,exp:\'new Promise((resolve, reject) => { ... }) creates a Promise.\'},\n' +
'    {q:\'Which is a correct arrow function?\',opts:[\'function => x {}\',\'const f = x => x * 2\',\'def f(x) = x * 2\',\'fn f(x) -> x\'],ans:1,exp:\'Arrow functions use the => syntax: const f = x => x * 2;\'},\n' +
'    {q:\'What is a closure?\',opts:[\'A CSS property\',\'A function accessing outer scope variables\',\'A type of loop\',\'A built-in method\'],ans:1,exp:\'A closure retains access to variables from its outer scope.\'},\n' +
'    {q:\'Which method parses a JSON string?\',opts:[\'JSON.parse()\',\'JSON.stringify()\',\'JSON.decode()\',\'JSON.convert()\'],ans:0,exp:\'JSON.parse() parses a JSON string and returns a JavaScript object.\'},\n' +
'  ],\n' +
'  css: [\n' +
'    {q:\'Which property controls text size?\',opts:[\'text-size\',\'font-size\',\'size\',\'letter-size\'],ans:1,exp:\'font-size sets the size of the text.\'},\n' +
'    {q:\'What does "display: flex" do?\',opts:[\'Makes element invisible\',\'Enables Flexbox layout\',\'Creates a grid\',\'Floats the element\'],ans:1,exp:\'display:flex turns the element into a flex container.\'},\n' +
'    {q:\'Which property makes an element transparent?\',opts:[\'transparent\',\'visibility\',\'opacity\',\'alpha\'],ans:2,exp:\'opacity: 0 to 1 controls transparency.\'},\n' +
'    {q:\'CSS Box Model from outside in?\',opts:[\'Content, Padding, Border, Margin\',\'Margin, Border, Padding, Content\',\'Padding, Margin, Border, Content\',\'Border, Content, Margin, Padding\'],ans:1,exp:\'From outside: Margin > Border > Padding > Content.\'},\n' +
'    {q:\'Which unit is relative to viewport width?\',opts:[\'em\',\'rem\',\'vw\',\'px\'],ans:2,exp:\'vw (viewport width) is 1% of the viewport width.\'},\n' +
'    {q:\'How do you select all paragraphs?\',opts:[\'.p\',\'#p\',\'p\',\'*p\'],ans:2,exp:\'p {} selects all <p> elements.\'},\n' +
'    {q:\'Which property controls space INSIDE an element?\',opts:[\'margin\',\'gap\',\'padding\',\'border\'],ans:2,exp:\'padding is space between the content and the border.\'},\n' +
'    {q:\'What does z-index control?\',opts:[\'Zoom level\',\'Stacking order\',\'Letter spacing\',\'Width\'],ans:1,exp:\'z-index controls the stacking order of positioned elements.\'},\n' +
'    {q:\'Which position removes element from normal flow?\',opts:[\'relative\',\'static\',\'absolute\',\'inherit\'],ans:2,exp:\'position:absolute removes an element from normal flow.\'},\n' +
'    {q:\'Default value of position property?\',opts:[\'relative\',\'absolute\',\'fixed\',\'static\'],ans:3,exp:\'The default value of position is static.\'},\n' +
'  ],\n' +
'  html: [\n' +
'    {q:\'Which tag creates a hyperlink?\',opts:[\'<link>\',\'<href>\',\'<a>\',\'<url>\'],ans:2,exp:\'The <a> (anchor) tag creates hyperlinks using the href attribute.\'},\n' +
'    {q:\'What does the "alt" attribute do in img?\',opts:[\'Sets image size\',\'Provides alternative text\',\'Links to another image\',\'Rotates the image\'],ans:1,exp:\'alt provides text shown when the image cannot be displayed.\'},\n' +
'    {q:\'Which tag defines the largest heading?\',opts:[\'<h6>\',\'<heading>\',\'<h1>\',\'<head>\'],ans:2,exp:\'<h1> is the largest heading.\'},\n' +
'    {q:\'Correct HTML for a line break?\',opts:[\'<break>\',\'<lb>\',\'<br>\',\'<newline>\'],ans:2,exp:\'<br> inserts a line break.\'},\n' +
'    {q:\'Element for unordered lists?\',opts:[\'<ol>\',\'<li>\',\'<ul>\',\'<list>\'],ans:2,exp:\'<ul> creates an unordered (bulleted) list.\'},\n' +
'    {q:\'Attribute for form submission URL?\',opts:[\'method\',\'target\',\'action\',\'src\'],ans:2,exp:\'The action attribute specifies where form data is sent.\'},\n' +
'    {q:\'Tag that makes text bold (no semantic)?\',opts:[\'<strong>\',\'<bold>\',\'<b>\',\'<em>\'],ans:2,exp:\'<b> makes text bold visually. <strong> indicates importance.\'},\n' +
'    {q:\'What does DOCTYPE declaration do?\',opts:[\'Defines JS version\',\'Tells browser document type\',\'Creates metadata\',\'Loads CSS\'],ans:1,exp:\'<!DOCTYPE html> tells the browser to use HTML5 standards mode.\'},\n' +
'    {q:\'Input type for password field?\',opts:[\'type="secret"\',\'type="hidden"\',\'type="password"\',\'type="private"\'],ans:2,exp:\'<input type="password"> masks the input for security.\'},\n' +
'    {q:\'Correct way to add HTML comment?\',opts:[\'// comment\',\'/* comment */\',\'<!-- comment -->\',\'# comment\'],ans:2,exp:\'HTML comments use <!-- --> syntax.\'},\n' +
'  ],\n' +
'  general: [\n' +
'    {q:\'What does CPU stand for?\',opts:[\'Central Processing Unit\',\'Computer Personal Unit\',\'Central Program Utility\',\'Core Processing Unit\'],ans:0,exp:\'CPU (Central Processing Unit) executes program instructions.\'},\n' +
'    {q:\'Protocol for secure web browsing?\',opts:[\'HTTP\',\'FTP\',\'HTTPS\',\'SMTP\'],ans:2,exp:\'HTTPS uses SSL/TLS encryption for secure communications.\'},\n' +
'    {q:\'What does RAM stand for?\',opts:[\'Random Access Memory\',\'Read And Modify\',\'Rapid Application Management\',\'Run-time Allocated Memory\'],ans:0,exp:\'RAM is temporary, fast memory used by running programs.\'},\n' +
'    {q:\'Who created JavaScript?\',opts:[\'Microsoft\',\'Google\',\'Netscape\',\'Apple\'],ans:2,exp:\'JavaScript was created by Brendan Eich at Netscape in 1995.\'},\n' +
'    {q:\'What is binary made of?\',opts:[\'0 and 1\',\'1 and 2\',\'A and B\',\'+ and -\'],ans:0,exp:\'Binary uses base-2, consisting only of 0 and 1.\'},\n' +
'    {q:\'O(n log n) average sorting algorithm?\',opts:[\'Bubble Sort\',\'Selection Sort\',\'Merge Sort\',\'Insertion Sort\'],ans:2,exp:\'Merge Sort consistently achieves O(n log n) time complexity.\'},\n' +
'    {q:\'What does SQL stand for?\',opts:[\'Structured Query Language\',\'Simple Question Language\',\'System Query Logic\',\'Secure Query Layer\'],ans:0,exp:\'SQL is used to manage relational databases.\'},\n' +
'    {q:\'Time complexity of binary search?\',opts:[\'O(n)\',\'O(n2)\',\'O(log n)\',\'O(1)\'],ans:2,exp:\'Binary search halves the search space each step: O(log n).\'},\n' +
'    {q:\'Which uses LIFO order?\',opts:[\'Queue\',\'Stack\',\'Linked List\',\'Tree\'],ans:1,exp:\'Stack uses LIFO (Last In, First Out).\'},\n' +
'    {q:\'What does API stand for?\',opts:[\'Application Programming Interface\',\'Automated Program Integration\',\'Application Process Input\',\'Applied Protocol Interface\'],ans:0,exp:\'API allows programs to communicate with each other.\'},\n' +
'  ]\n' +
'};\n' +
'\n' +
'var CATEGORIES = [\n' +
'  {key:\'javascript\',label:\'JavaScript\',icon:\'\u26a1\'},\n' +
'  {key:\'css\',label:\'CSS\',icon:\'\ud83c\udfa8\'},\n' +
'  {key:\'html\',label:\'HTML\',icon:\'\ud83c\udf10\'},\n' +
'  {key:\'general\',label:\'CS General\',icon:\'\ud83d\udcbb\'}\n' +
'];\n' +
'var DIFFICULTIES = {easy:{time:20,count:5},medium:{time:15,count:7},hard:{time:10,count:10}};\n' +
'\n' +
'var selCat = \'javascript\', selDiff = \'medium\';\n' +
'var questions = [], current = 0, score = 0;\n' +
'var timerInterval = null, timeLeft = 0, totalTime = 0, answerTimes = [];\n' +
'\n' +
'// Build category grid\n' +
'var catGrid = document.getElementById(\'catGrid\');\n' +
'CATEGORIES.forEach(function(c) {\n' +
'  var btn = document.createElement(\'button\');\n' +
'  btn.className = \'cat-btn\' + (c.key === selCat ? \' sel\' : \'\');\n' +
'  btn.innerHTML = \'<span class="cat-icon">\' + c.icon + \'</span>\' + c.label;\n' +
'  btn.addEventListener(\'click\', function() {\n' +
'    selCat = c.key;\n' +
'    document.querySelectorAll(\'.cat-btn\').forEach(function(b) { b.classList.remove(\'sel\'); });\n' +
'    btn.classList.add(\'sel\');\n' +
'  });\n' +
'  catGrid.appendChild(btn);\n' +
'});\n' +
'\n' +
'// Difficulty buttons\n' +
'document.querySelectorAll(\'.diff-btn\').forEach(function(btn) {\n' +
'  btn.addEventListener(\'click\', function() {\n' +
'    selDiff = btn.dataset.diff;\n' +
'    document.querySelectorAll(\'.diff-btn\').forEach(function(b) { b.classList.remove(\'sel\'); });\n' +
'    btn.classList.add(\'sel\');\n' +
'  });\n' +
'});\n' +
'\n' +
'// Navigation buttons\n' +
'document.getElementById(\'startBtn\').addEventListener(\'click\', startQuiz);\n' +
'document.getElementById(\'nextBtn\').addEventListener(\'click\', nextQuestion);\n' +
'document.getElementById(\'retryBtn\').addEventListener(\'click\', startQuiz);\n' +
'document.getElementById(\'homeBtn\').addEventListener(\'click\', function() {\n' +
'  show(\'homeScreen\'); hide(\'resultsScreen\');\n' +
'});\n' +
'\n' +
'function show(id) { document.getElementById(id).classList.remove(\'hidden\'); }\n' +
'function hide(id) { document.getElementById(id).classList.add(\'hidden\'); }\n' +
'\n' +
'function startQuiz() {\n' +
'  var pool = QUESTIONS[selCat].slice();\n' +
'  // Shuffle\n' +
'  for (var i = pool.length - 1; i > 0; i--) {\n' +
'    var j = Math.floor(Math.random() * (i + 1));\n' +
'    var t = pool[i]; pool[i] = pool[j]; pool[j] = t;\n' +
'  }\n' +
'  questions = pool.slice(0, DIFFICULTIES[selDiff].count);\n' +
'  current = 0; score = 0; answerTimes = [];\n' +
'  hide(\'homeScreen\'); hide(\'resultsScreen\'); show(\'quizScreen\');\n' +
'  showQuestion();\n' +
'  console.log(\'Quiz started:\', selCat, \'difficulty:\', selDiff, \'questions:\', questions.length);\n' +
'}\n' +
'\n' +
'function showQuestion() {\n' +
'  var q = questions[current];\n' +
'  var total = questions.length;\n' +
'  document.getElementById(\'qProgress\').textContent = \'Q \' + (current+1) + \' / \' + total;\n' +
'  document.getElementById(\'progressFill\').style.width = ((current / total) * 100) + \'%\';\n' +
'  document.getElementById(\'qCategory\').textContent = CATEGORIES.find(function(c) { return c.key === selCat; }).label;\n' +
'  document.getElementById(\'question\').textContent = q.q;\n' +
'  document.getElementById(\'feedback\').style.display = \'none\';\n' +
'  hide(\'nextBtn\');\n' +
'\n' +
'  var opts = document.getElementById(\'options\');\n' +
'  opts.innerHTML = \'\';\n' +
'  q.opts.forEach(function(opt, i) {\n' +
'    var btn = document.createElement(\'button\');\n' +
'    btn.className = \'opt\';\n' +
'    btn.textContent = String.fromCharCode(65 + i) + \'. \' + opt;\n' +
'    btn.addEventListener(\'click\', function() { selectAnswer(i); });\n' +
'    opts.appendChild(btn);\n' +
'  });\n' +
'\n' +
'  // Timer\n' +
'  clearInterval(timerInterval);\n' +
'  timeLeft = DIFFICULTIES[selDiff].time;\n' +
'  totalTime = timeLeft;\n' +
'  questions[current]._start = Date.now();\n' +
'  updateTimer();\n' +
'  timerInterval = setInterval(function() {\n' +
'    timeLeft--;\n' +
'    updateTimer();\n' +
'    if (timeLeft <= 0) { clearInterval(timerInterval); timeUp(); }\n' +
'  }, 1000);\n' +
'}\n' +
'\n' +
'function updateTimer() {\n' +
'  var el = document.getElementById(\'timer\');\n' +
'  el.textContent = timeLeft + \'s\';\n' +
'  el.classList.toggle(\'warn\', timeLeft <= 5);\n' +
'}\n' +
'\n' +
'function timeUp() {\n' +
'  var q = questions[current];\n' +
'  lockOptions();\n' +
'  highlightAnswer(q.ans, \'reveal\');\n' +
'  showFeedback(false, \'Time up! Answer: \' + q.opts[q.ans] + \'. \' + q.exp);\n' +
'  answerTimes.push(totalTime);\n' +
'  show(\'nextBtn\');\n' +
'  document.getElementById(\'nextBtn\').textContent = current === questions.length - 1 ? \'See Results\' : \'Next Question\';\n' +
'}\n' +
'\n' +
'function selectAnswer(i) {\n' +
'  clearInterval(timerInterval);\n' +
'  var q = questions[current];\n' +
'  var elapsed = Math.round((Date.now() - (q._start || Date.now())) / 1000);\n' +
'  answerTimes.push(elapsed);\n' +
'  lockOptions();\n' +
'  var correct = i === q.ans;\n' +
'  if (correct) { score++; highlightAnswer(i, \'correct\'); showFeedback(true, \'Correct! \' + q.exp); }\n' +
'  else { highlightAnswer(i, \'wrong\'); highlightAnswer(q.ans, \'reveal\'); showFeedback(false, \'Wrong. \' + q.exp); }\n' +
'  show(\'nextBtn\');\n' +
'  document.getElementById(\'nextBtn\').textContent = current === questions.length - 1 ? \'See Results\' : \'Next Question\';\n' +
'  console.log(\'Q\' + (current+1) + \':\', correct ? \'CORRECT\' : \'WRONG\', \'| Score:\', score);\n' +
'}\n' +
'\n' +
'function lockOptions() {\n' +
'  document.querySelectorAll(\'.opt\').forEach(function(b) { b.classList.add(\'locked\'); });\n' +
'}\n' +
'\n' +
'function highlightAnswer(i, cls) {\n' +
'  var btns = document.querySelectorAll(\'.opt\');\n' +
'  if (btns[i]) btns[i].classList.add(cls);\n' +
'}\n' +
'\n' +
'function showFeedback(correct, msg) {\n' +
'  var el = document.getElementById(\'feedback\');\n' +
'  el.textContent = (correct ? \'\u2705 \' : \'\u274c \') + msg;\n' +
'  el.className = \'feedback \' + (correct ? \'correct\' : \'wrong\');\n' +
'  el.style.display = \'block\';\n' +
'}\n' +
'\n' +
'function nextQuestion() {\n' +
'  current++;\n' +
'  if (current >= questions.length) { showResults(); return; }\n' +
'  showQuestion();\n' +
'}\n' +
'\n' +
'function showResults() {\n' +
'  clearInterval(timerInterval);\n' +
'  hide(\'quizScreen\'); show(\'resultsScreen\');\n' +
'  var total = questions.length;\n' +
'  var accuracy = Math.round((score / total) * 100);\n' +
'  var avgTime = answerTimes.length ? Math.round(answerTimes.reduce(function(a,b){return a+b;},0) / answerTimes.length) : 0;\n' +
'\n' +
'  document.getElementById(\'resScore\').textContent = score;\n' +
'  document.getElementById(\'resTotal\').textContent = \'/ \' + total;\n' +
'  document.getElementById(\'statCorrect\').textContent = score;\n' +
'  document.getElementById(\'statAccuracy\').textContent = accuracy + \'%\';\n' +
'  document.getElementById(\'statTime\').textContent = avgTime + \'s\';\n' +
'\n' +
'  var grade, msg;\n' +
'  if (accuracy >= 90) { grade = \'A+ Outstanding!\'; msg = \'Perfect! You are a master.\'; }\n' +
'  else if (accuracy >= 80) { grade = \'A Excellent!\'; msg = \'Great job! You know your stuff.\'; }\n' +
'  else if (accuracy >= 70) { grade = \'B Good Work\'; msg = \'Solid! Keep practicing!\'; }\n' +
'  else if (accuracy >= 60) { grade = \'C Pass\'; msg = \'You passed! Review what you missed.\'; }\n' +
'  else { grade = \'F Needs Work\'; msg = \'Keep studying and try again!\'; }\n' +
'\n' +
'  document.getElementById(\'resGrade\').textContent = grade;\n' +
'  document.getElementById(\'resMsg\').textContent = msg;\n' +
'\n' +
'  // Leaderboard\n' +
'  var key = \'qm_lb_\' + selCat + \'_\' + selDiff;\n' +
'  var lb = JSON.parse(localStorage.getItem(key) || \'[]\');\n' +
'  lb.push({score: score, total: total, accuracy: accuracy});\n' +
'  lb.sort(function(a,b) { return b.accuracy - a.accuracy; });\n' +
'  lb = lb.slice(0, 5);\n' +
'  localStorage.setItem(key, JSON.stringify(lb));\n' +
'  var ranks = [\'gold\',\'silver\',\'bronze\',\'\',\'\'];\n' +
'  document.getElementById(\'leaderboard\').innerHTML = lb.map(function(e, i) {\n' +
'    return \'<div class="lb-row"><span class="lb-rank \' + ranks[i] + \'">\' + (i+1) + \'</span>\'\n' +
'      + \'<span class="lb-name">Score \' + e.score + \'/\' + e.total + \'</span>\'\n' +
'      + \'<span class="lb-score">\' + e.accuracy + \'%</span></div>\';\n' +
'  }).join(\'\');\n' +
'\n' +
'  console.log(\'Quiz complete! Score:\', score + \'/\' + total, \'Accuracy:\', accuracy + \'%\');\n' +
'}\n' +
'\n' +
'console.log(\'QuizMaster loaded! Categories: JavaScript, CSS, HTML, CS General | Difficulties: Easy/Medium/Hard\');';

const TEMPLATES: Record<string, { html: string; css: string; js: string; label: string; desc: string; icon: string }> = {
  blank: {
    icon: '📄', label: 'Blank', desc: 'Start from scratch',
    html: '<!-- Write your HTML here -->\n<h1>Hello, World!</h1>\n<p>Edit me and click \u25b6 Run</p>',
    css: 'body {\n  font-family: system-ui, sans-serif;\n  padding: 24px;\n  background: #f9fafb;\n  color: #111827;\n}\nh1 { color: #2563eb; font-size: 2rem; margin-bottom: 8px; }\np { color: #6b7280; }',
    js: '// Write JavaScript here\nconsole.log("Hello from JavaScript!");\nconsole.log("Add more console.log() calls to see output here.");',
  },
  typescript: {
    icon: '🔷', label: 'TypeScript', desc: 'TypeScript with type checking',
    html: '', css: '', js: TS_JS,
  },
  react: {
    icon: '⚛️', label: 'React', desc: 'React component with JSX',
    html: '<div id="root"></div>',
    css: 'body{margin:0;font-family:system-ui,sans-serif;background:#f0f4ff;}\n.card{background:white;border-radius:12px;padding:20px;max-width:320px;margin:20px auto;box-shadow:0 4px 20px rgba(0,0,0,.1);}\nh2{color:#2563eb;margin:0 0 8px;}\np{color:#6b7280;font-size:14px;margin:0 0 12px;}\nbutton{background:#2563eb;color:white;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:14px;}\n.count{font-size:32px;font-weight:800;color:#2563eb;text-align:center;margin:12px 0;}',
    js: REACT_JS,
  },
  counter: {
    icon: '\u{1F9E0}', label: 'Quiz App', desc: 'Multi-category quiz with timer & leaderboard',
    html: `<!-- QuizMaster - Multi-category Quiz App -->
<div class="app">
  <!-- Home Screen -->
  <div id="homeScreen" class="card">
    <h1>QuizMaster</h1>
    <p class="subtitle">Test your knowledge across multiple subjects</p>
    <div class="categories" id="catGrid"></div>
    <div class="diff-row">
      <button class="diff-btn sel" data-diff="easy">Easy</button>
      <button class="diff-btn" data-diff="medium">Medium</button>
      <button class="diff-btn" data-diff="hard">Hard</button>
    </div>
    <button class="start-btn" id="startBtn">Start Quiz</button>
  </div>
  <!-- Quiz Screen -->
  <div id="quizScreen" class="card hidden">
    <div class="quiz-header">
      <span class="progress-info" id="qProgress">Q 1 / 10</span>
      <span class="timer" id="timer">15s</span>
    </div>
    <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
    <span class="category-badge" id="qCategory">Category</span>
    <div class="question" id="question"></div>
    <div class="options" id="options"></div>
    <div class="feedback" id="feedback"></div>
    <button class="next-btn hidden" id="nextBtn">Next Question</button>
  </div>
  <!-- Results Screen -->
  <div id="resultsScreen" class="card hidden">
    <div class="results-circle">
      <span class="results-score" id="resScore">0</span>
      <span class="results-total" id="resTotal">/ 10</span>
    </div>
    <div class="results-grade" id="resGrade"></div>
    <div class="results-msg" id="resMsg"></div>
    <div class="stats-grid">
      <div class="stat-box"><div class="stat-val" id="statCorrect">0</div><div class="stat-lbl">Correct</div></div>
      <div class="stat-box"><div class="stat-val" id="statAccuracy">0%</div><div class="stat-lbl">Accuracy</div></div>
      <div class="stat-box"><div class="stat-val" id="statTime">0s</div><div class="stat-lbl">Avg Time</div></div>
    </div>
    <div class="leaderboard"><div class="lb-title">Top Scores</div><div id="leaderboard"></div></div>
    <div class="btn-row">
      <button class="btn-home" id="homeBtn">Change Category</button>
      <button class="btn-retry" id="retryBtn">Play Again</button>
    </div>
  </div>
</div>`,
    css: `/* ===== QUIZ APP STYLES ===== */
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.app { width: 100%; max-width: 560px; }
.card { background: #fff; border-radius: 20px; padding: 28px; box-shadow: 0 20px 60px rgba(0,0,0,.2); }
.hidden { display: none !important; }

/* Home */
h1 { font-size: 1.8rem; font-weight: 800; color: #1a1a2e; text-align: center; margin-bottom: 4px; }
.subtitle { text-align: center; color: #6b7280; font-size: 14px; margin-bottom: 24px; }
.categories { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
.cat-btn { padding: 14px; border: 2px solid #e5e7eb; border-radius: 12px; background: #f9fafb; cursor: pointer; text-align: center; transition: all .2s; font-size: 13px; font-weight: 600; color: #374151; }
.cat-btn:hover, .cat-btn.sel { border-color: #667eea; background: #ede9fe; color: #4f46e5; }
.cat-icon { font-size: 24px; display: block; margin-bottom: 4px; }
.diff-row { display: flex; gap: 8px; margin-bottom: 20px; }
.diff-btn { flex: 1; padding: 8px; border: 2px solid #e5e7eb; border-radius: 8px; background: #f9fafb; cursor: pointer; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; transition: all .2s; color: #6b7280; }
.diff-btn.sel { border-color: #667eea; background: #667eea; color: #fff; }
.start-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; border: none; border-radius: 12px; font-size: 16px; font-weight: 700; cursor: pointer; transition: opacity .2s; }
.start-btn:hover { opacity: .9; }

/* Quiz */
.quiz-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.progress-info { font-size: 13px; color: #6b7280; font-weight: 600; }
.timer { background: #fee2e2; color: #dc2626; border-radius: 8px; padding: 6px 14px; font-weight: 800; font-size: 15px; transition: background .3s; }
.timer.warn { background: #dc2626; color: #fff; animation: pulse .5s infinite; }
@keyframes pulse { 0%,100%{transform:scale(1);}50%{transform:scale(1.05);} }
.progress-bar { height: 6px; background: #e5e7eb; border-radius: 3px; margin-bottom: 20px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 3px; transition: width .3s ease; }
.category-badge { display: inline-block; background: #ede9fe; color: #4f46e5; border-radius: 6px; padding: 3px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 14px; }
.question { font-size: 1.05rem; font-weight: 700; color: #1a1a2e; line-height: 1.5; margin-bottom: 20px; }
.options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
.opt { padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 10px; cursor: pointer; font-size: 14px; font-weight: 500; color: #374151; background: #f9fafb; transition: all .2s; text-align: left; width: 100%; }
.opt:hover:not(.locked) { border-color: #667eea; background: #ede9fe; color: #4f46e5; }
.opt.correct { border-color: #16a34a; background: #dcfce7; color: #15803d; }
.opt.wrong { border-color: #dc2626; background: #fee2e2; color: #dc2626; }
.opt.reveal { border-color: #16a34a; background: #dcfce7; color: #15803d; opacity: .8; }
.opt.locked { cursor: default; }
.feedback { padding: 12px 16px; border-radius: 10px; font-size: 14px; font-weight: 600; margin-bottom: 16px; display: none; }
.feedback.correct { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
.feedback.wrong { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; }
.next-btn { width: 100%; padding: 12px; background: #667eea; color: #fff; border: none; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; transition: opacity .2s; }
.next-btn:hover { opacity: .9; }

/* Results */
.results-circle { width: 110px; height: 110px; border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0 auto 20px; background: linear-gradient(135deg, #667eea, #764ba2); }
.results-score { font-size: 2rem; font-weight: 900; color: #fff; line-height: 1; }
.results-total { font-size: 12px; color: rgba(255,255,255,.8); font-weight: 600; }
.results-grade { text-align: center; font-size: 1.2rem; font-weight: 800; margin-bottom: 6px; color: #1a1a2e; }
.results-msg { text-align: center; color: #6b7280; font-size: 14px; margin-bottom: 20px; }
.stats-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 20px; }
.stat-box { background: #f9fafb; border-radius: 10px; padding: 12px; text-align: center; border: 1px solid #e5e7eb; }
.stat-val { font-size: 1.3rem; font-weight: 800; color: #4f46e5; }
.stat-lbl { font-size: 11px; color: #6b7280; font-weight: 600; margin-top: 2px; }
.leaderboard { background: #f9fafb; border-radius: 12px; padding: 14px; margin-bottom: 18px; border: 1px solid #e5e7eb; }
.lb-title { font-size: 13px; font-weight: 800; color: #374151; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 10px; }
.lb-row { display: flex; align-items: center; gap: 10px; padding: 7px 0; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
.lb-row:last-child { border-bottom: none; }
.lb-rank { font-weight: 800; color: #9ca3af; min-width: 20px; }
.lb-rank.gold { color: #f59e0b; }
.lb-rank.silver { color: #9ca3af; }
.lb-rank.bronze { color: #b45309; }
.lb-name { flex: 1; font-weight: 600; color: #374151; }
.lb-score { font-weight: 700; color: #4f46e5; }
.btn-row { display: flex; gap: 10px; }
.btn-retry { flex: 1; padding: 12px; background: #4f46e5; color: #fff; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; }
.btn-home { flex: 1; padding: 12px; background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; border-radius: 10px; font-weight: 700; cursor: pointer; }`,
    js: QUIZ_JS,
  },
  todo: {
    icon: '✅', label: 'TaskFlow (Todo)', desc: 'Full task manager — priority, categories, filters',
    html: `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>TaskFlow</title>
<style>
:root{--bg:#f1f5f9;--surface:#ffffff;--surface2:#f8fafc;--border:#e2e8f0;--text:#0f172a;--text-muted:#64748b;--text-soft:#94a3b8;--accent:#2563eb;--accent-hover:#1d4ed8;--accent-light:#eff6ff;--success:#16a34a;--danger:#dc2626;--danger-light:#fef2f2;--shadow:0 1px 3px rgba(0,0,0,.08);--shadow-md:0 4px 16px rgba(0,0,0,.08);--radius:10px;--radius-sm:6px;--transition:.18s ease;}
[data-theme="dark"]{--bg:#0f172a;--surface:#1e293b;--surface2:#293548;--border:#334155;--text:#f1f5f9;--text-muted:#94a3b8;--text-soft:#64748b;--accent-light:#1e3a5f;--shadow:0 1px 3px rgba(0,0,0,.3);--shadow-md:0 4px 16px rgba(0,0,0,.3);}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;transition:background var(--transition),color var(--transition);}
.app{max-width:780px;margin:0 auto;padding:16px;}
.app-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding:12px 0;border-bottom:1px solid var(--border);}
.logo{display:flex;align-items:center;gap:10px;}
.logo-text{font-size:1.25rem;font-weight:800;color:var(--text);letter-spacing:-0.5px;}
.theme-btn{width:36px;height:36px;border:1px solid var(--border);border-radius:50%;background:var(--surface);color:var(--text-muted);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all var(--transition);}
.theme-btn:hover{background:var(--surface2);color:var(--text);}
[data-theme="light"] .icon-moon{display:none;}
[data-theme="dark"] .icon-sun{display:none;}
.stats-bar{display:flex;align-items:center;gap:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px 18px;margin-bottom:16px;box-shadow:var(--shadow);flex-wrap:wrap;}
.stat-item{display:flex;flex-direction:column;align-items:center;gap:2px;min-width:44px;}
.stat-num{font-size:1.4rem;font-weight:800;line-height:1;}
.stat-label{font-size:11px;color:var(--text-muted);font-weight:500;text-transform:uppercase;letter-spacing:.5px;}
.stat-divider{width:1px;height:32px;background:var(--border);}
.active-color{color:var(--accent);}
.done-color{color:var(--success);}
.progress-wrap{display:flex;align-items:center;gap:10px;flex:1;margin-left:8px;}
.progress-track{flex:1;height:8px;background:var(--border);border-radius:4px;overflow:hidden;}
.progress-fill{height:100%;background:linear-gradient(90deg,var(--accent),#7c3aed);border-radius:4px;transition:width .4s ease;}
.progress-pct{font-size:12px;font-weight:700;color:var(--text-muted);min-width:36px;text-align:right;}
.add-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px;margin-bottom:16px;box-shadow:var(--shadow);}
.add-title{font-size:.85rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:12px;}
.add-row{display:flex;gap:8px;margin-bottom:10px;}
.add-meta-row{display:flex;gap:8px;flex-wrap:wrap;}
.input-field{flex:1;padding:9px 12px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:14px;font-family:inherit;background:var(--surface2);color:var(--text);outline:none;transition:border-color var(--transition);}
.input-field:focus{border-color:var(--accent);}
.input-field::placeholder{color:var(--text-soft);}
.date-field{flex:none;width:160px;color-scheme:light dark;}
.select-field{padding:9px 10px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:13px;font-family:inherit;background:var(--surface2);color:var(--text);cursor:pointer;outline:none;}
.select-field:focus{border-color:var(--accent);}
.btn-primary{padding:9px 20px;background:var(--accent);color:white;border:none;border-radius:var(--radius-sm);font-weight:700;font-size:14px;cursor:pointer;white-space:nowrap;transition:background var(--transition);}
.btn-primary:hover{background:var(--accent-hover);}
.btn-ghost{padding:7px 14px;background:transparent;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:12px;font-weight:600;color:var(--text-muted);cursor:pointer;transition:all var(--transition);}
.btn-ghost:hover{background:var(--danger-light);color:var(--danger);}
.btn-icon{width:28px;height:28px;background:transparent;border:none;border-radius:var(--radius-sm);cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--text-soft);transition:all var(--transition);flex-shrink:0;}
.btn-icon:hover{background:var(--surface2);color:var(--text);}
.btn-icon.delete:hover{background:var(--danger-light);color:var(--danger);}
.controls-bar{display:flex;align-items:center;gap:10px;margin-bottom:14px;flex-wrap:wrap;}
.filter-tabs{display:flex;gap:2px;background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:3px;}
.tab{padding:5px 14px;border:none;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;background:transparent;color:var(--text-muted);transition:all var(--transition);}
.tab.active{background:var(--surface);color:var(--accent);box-shadow:var(--shadow);}
.controls-right{display:flex;gap:8px;flex-wrap:wrap;flex:1;}
.search-input{flex:1;min-width:140px;padding:6px 10px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:13px;font-family:inherit;background:var(--surface);color:var(--text);outline:none;}
.search-input:focus{border-color:var(--accent);}
.select-sm{padding:6px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px;font-family:inherit;background:var(--surface);color:var(--text);cursor:pointer;outline:none;}
.task-list{display:flex;flex-direction:column;gap:8px;}
.task-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:12px 14px;display:flex;align-items:flex-start;gap:12px;box-shadow:var(--shadow);transition:all var(--transition);animation:slideIn .2s ease;position:relative;}
.task-card:hover{box-shadow:var(--shadow-md);transform:translateY(-1px);}
.task-card.completed{opacity:.65;}
.task-card.completed .task-title{text-decoration:line-through;color:var(--text-muted);}
@keyframes slideIn{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
.task-card[data-priority="high"]{border-left:3px solid #ef4444;}
.task-card[data-priority="medium"]{border-left:3px solid #f59e0b;}
.task-card[data-priority="low"]{border-left:3px solid #22c55e;}
.task-check{width:19px;height:19px;border:2px solid var(--border);border-radius:50%;flex-shrink:0;margin-top:2px;cursor:pointer;appearance:none;background:var(--surface);position:relative;transition:all var(--transition);}
.task-check:checked{background:var(--success);border-color:var(--success);}
.task-check:checked::after{content:'';position:absolute;left:4px;top:1px;width:6px;height:10px;border:2px solid white;border-top:none;border-left:none;transform:rotate(45deg);}
.task-body{flex:1;min-width:0;}
.task-title{font-size:14px;font-weight:600;color:var(--text);margin-bottom:5px;word-break:break-word;cursor:pointer;}
.task-meta{display:flex;gap:6px;flex-wrap:wrap;align-items:center;}
.badge{display:inline-flex;align-items:center;font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px;text-transform:uppercase;letter-spacing:.4px;border:1px solid transparent;}
.badge-high{background:#fef2f2;color:#dc2626;border-color:#fecaca;}
.badge-medium{background:#fffbeb;color:#d97706;border-color:#fde68a;}
.badge-low{background:#f0fdf4;color:#16a34a;border-color:#bbf7d0;}
.badge-general{background:#f1f5f9;color:#64748b;border-color:#e2e8f0;}
.badge-work{background:#eff6ff;color:#2563eb;border-color:#bfdbfe;}
.badge-study{background:#faf5ff;color:#7c3aed;border-color:#e9d5ff;}
.badge-personal{background:#fff0f9;color:#be185d;border-color:#fbcfe8;}
.badge-health{background:#ecfdf5;color:#059669;border-color:#a7f3d0;}
.badge-overdue{background:#fef2f2;color:#dc2626;border-color:#fecaca;}
.badge-duedate{background:#f8fafc;color:var(--text-muted);border-color:var(--border);}
.task-actions{display:flex;gap:2px;opacity:0;transition:opacity var(--transition);}
.task-card:hover .task-actions{opacity:1;}
.empty-state{text-align:center;padding:60px 20px;color:var(--text-soft);}
.empty-title{font-size:1.1rem;font-weight:700;margin:16px 0 6px;color:var(--text-muted);}
.empty-sub{font-size:13px;}
.footer-bar{display:flex;align-items:center;justify-content:space-between;padding:10px 0;margin-top:6px;border-top:1px solid var(--border);font-size:12px;color:var(--text-muted);}
@media(max-width:600px){.add-row{flex-wrap:wrap;}.add-meta-row{flex-direction:column;}.controls-bar{flex-direction:column;align-items:stretch;}.controls-right{flex-direction:column;}.date-field{width:100%;}}
</style>
</head>
<body>
<div class="app">
  <header class="app-header">
    <div class="logo">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect width="28" height="28" rx="8" fill="#2563eb"/><path d="M8 14l4 4 8-8" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span class="logo-text">TaskFlow</span>
    </div>
    <button class="theme-btn" id="themeToggle" title="Toggle dark mode">
      <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
      <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    </button>
  </header>
  <div class="stats-bar">
    <div class="stat-item"><span class="stat-num" id="statTotal">0</span><span class="stat-label">Total</span></div>
    <div class="stat-divider"></div>
    <div class="stat-item"><span class="stat-num active-color" id="statActive">0</span><span class="stat-label">Active</span></div>
    <div class="stat-divider"></div>
    <div class="stat-item"><span class="stat-num done-color" id="statDone">0</span><span class="stat-label">Done</span></div>
    <div class="progress-wrap"><div class="progress-track"><div class="progress-fill" id="progressFill"></div></div><span class="progress-pct" id="progressPct">0%</span></div>
  </div>
  <div class="add-card">
    <h2 class="add-title">Add New Task</h2>
    <div class="add-row">
      <input type="text" id="taskTitle" class="input-field" placeholder="What needs to be done?" maxlength="120" autocomplete="off"/>
      <button class="btn-primary" id="addBtn">Add Task</button>
    </div>
    <div class="add-meta-row">
      <select id="taskPriority" class="select-field"><option value="medium">Medium Priority</option><option value="high">High Priority</option><option value="low">Low Priority</option></select>
      <select id="taskCategory" class="select-field"><option value="general">General</option><option value="work">Work</option><option value="study">Study</option><option value="personal">Personal</option><option value="health">Health</option></select>
      <input type="date" id="taskDueDate" class="input-field date-field" title="Due date (optional)"/>
    </div>
  </div>
  <div class="controls-bar">
    <div class="filter-tabs" id="filterTabs">
      <button class="tab active" data-filter="all">All</button>
      <button class="tab" data-filter="active">Active</button>
      <button class="tab" data-filter="completed">Completed</button>
    </div>
    <div class="controls-right">
      <input type="text" id="searchInput" class="search-input" placeholder="Search tasks..." autocomplete="off"/>
      <select id="filterCategory" class="select-sm"><option value="">All Categories</option><option value="general">General</option><option value="work">Work</option><option value="study">Study</option><option value="personal">Personal</option><option value="health">Health</option></select>
      <select id="filterPriority" class="select-sm"><option value="">All Priorities</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select>
      <select id="sortBy" class="select-sm"><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="duedate">Due Date</option><option value="priority">Priority</option><option value="name">Name</option></select>
    </div>
  </div>
  <div class="task-list" id="taskList"></div>
  <div class="empty-state" id="emptyState" style="display:none;">
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="30" stroke="#e2e8f0" stroke-width="2"/><path d="M20 32l8 8 16-16" stroke="#e2e8f0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <p class="empty-title" id="emptyTitle">No tasks yet</p>
    <p class="empty-sub" id="emptySub">Add your first task above to get started.</p>
  </div>
  <div class="footer-bar" id="footerBar" style="display:none;">
    <span class="footer-info" id="footerInfo"></span>
    <button class="btn-ghost" id="clearCompletedBtn">Clear Completed</button>
  </div>
</div>
<script>
var tasks=[],currentFilter='all',currentCategory='',currentPriority='',currentSort='newest',searchQuery='';
var PRIORITY_ORDER={high:0,medium:1,low:2};
var sampleTasks=[
  {id:1,title:'Complete JavaScript assignment',priority:'high',category:'study',dueDate:new Date(Date.now()-86400000).toISOString().split('T')[0],completed:false,createdAt:Date.now()-3*86400000},
  {id:2,title:'Submit internship application',priority:'high',category:'work',dueDate:new Date(Date.now()+2*86400000).toISOString().split('T')[0],completed:false,createdAt:Date.now()-2*86400000},
  {id:3,title:'Read chapter 5 of Data Structures',priority:'medium',category:'study',dueDate:new Date(Date.now()+4*86400000).toISOString().split('T')[0],completed:false,createdAt:Date.now()-86400000},
  {id:4,title:'Morning run - 5km',priority:'low',category:'health',dueDate:'',completed:true,createdAt:Date.now()-86400000},
  {id:5,title:'Buy groceries for the week',priority:'medium',category:'personal',dueDate:new Date(Date.now()+86400000).toISOString().split('T')[0],completed:false,createdAt:Date.now()-3600000},
  {id:6,title:'Review pull requests on GitHub',priority:'medium',category:'work',dueDate:'',completed:true,createdAt:Date.now()-7200000}
];
function init(){loadTheme();loadTasks();attachListeners();renderAll();}
function loadTasks(){var s=localStorage.getItem('taskflow_tasks');tasks=s?JSON.parse(s):sampleTasks;if(!s)saveTasks();}
function saveTasks(){localStorage.setItem('taskflow_tasks',JSON.stringify(tasks));}
function loadTheme(){var t=localStorage.getItem('taskflow_theme')||'light';document.documentElement.setAttribute('data-theme',t);}
function toggleTheme(){var c=document.documentElement.getAttribute('data-theme');var n=c==='light'?'dark':'light';document.documentElement.setAttribute('data-theme',n);localStorage.setItem('taskflow_theme',n);}
function addTask(){
  var el=document.getElementById('taskTitle');var title=el.value.trim();
  if(!title){el.style.borderColor='#ef4444';setTimeout(function(){el.style.borderColor='';},1200);el.focus();return;}
  tasks.unshift({id:Date.now(),title:title,priority:document.getElementById('taskPriority').value,category:document.getElementById('taskCategory').value,dueDate:document.getElementById('taskDueDate').value,completed:false,createdAt:Date.now()});
  saveTasks();el.value='';document.getElementById('taskDueDate').value='';renderAll();el.focus();
  console.log('Task added:',title);
}
function toggleTask(id){var t=tasks.find(function(x){return x.id===id;});if(t){t.completed=!t.completed;saveTasks();renderAll();}}
function deleteTask(id){tasks=tasks.filter(function(x){return x.id!==id;});saveTasks();renderAll();}
function clearCompleted(){var count=tasks.filter(function(t){return t.completed;}).length;if(!count)return;tasks=tasks.filter(function(t){return!t.completed;});saveTasks();renderAll();console.log('Cleared',count,'completed tasks');}
function getFiltered(){
  var f=tasks.slice();
  if(currentFilter==='active')f=f.filter(function(t){return!t.completed;});
  else if(currentFilter==='completed')f=f.filter(function(t){return t.completed;});
  if(currentCategory)f=f.filter(function(t){return t.category===currentCategory;});
  if(currentPriority)f=f.filter(function(t){return t.priority===currentPriority;});
  if(searchQuery){var q=searchQuery.toLowerCase();f=f.filter(function(t){return t.title.toLowerCase().indexOf(q)!==-1;});}
  if(currentSort==='newest')f.sort(function(a,b){return b.createdAt-a.createdAt;});
  else if(currentSort==='oldest')f.sort(function(a,b){return a.createdAt-b.createdAt;});
  else if(currentSort==='priority')f.sort(function(a,b){return PRIORITY_ORDER[a.priority]-PRIORITY_ORDER[b.priority];});
  else if(currentSort==='name')f.sort(function(a,b){return a.title.localeCompare(b.title);});
  else if(currentSort==='duedate')f.sort(function(a,b){if(!a.dueDate&&!b.dueDate)return 0;if(!a.dueDate)return 1;if(!b.dueDate)return-1;return a.dueDate.localeCompare(b.dueDate);});
  return f;
}
function isOverdue(t){if(!t.dueDate||t.completed)return false;return t.dueDate<new Date().toISOString().split('T')[0];}
function fmtDate(s){if(!s)return'';var d=new Date(s+'T00:00:00');var m=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];return m[d.getMonth()]+' '+d.getDate();}
function renderAll(){renderStats();renderTasks();}
function renderStats(){
  var total=tasks.length,done=tasks.filter(function(t){return t.completed;}).length,active=total-done,pct=total>0?Math.round(done/total*100):0;
  document.getElementById('statTotal').textContent=total;
  document.getElementById('statActive').textContent=active;
  document.getElementById('statDone').textContent=done;
  document.getElementById('progressFill').style.width=pct+'%';
  document.getElementById('progressPct').textContent=pct+'%';
}
function renderTasks(){
  var list=document.getElementById('taskList'),empty=document.getElementById('emptyState'),footer=document.getElementById('footerBar');
  var filtered=getFiltered();
  var activeCount=tasks.filter(function(t){return!t.completed;}).length;
  if(tasks.length>0){footer.style.display='flex';document.getElementById('footerInfo').textContent=activeCount+' task'+(activeCount!==1?'s':'')+' remaining';}
  else{footer.style.display='none';}
  if(filtered.length===0){list.innerHTML='';empty.style.display='block';
    document.getElementById('emptyTitle').textContent=tasks.length===0?'No tasks yet':'No matching tasks';
    document.getElementById('emptySub').textContent=tasks.length===0?'Add your first task above.':'Try adjusting your filters.';
    return;}
  empty.style.display='none';
  list.innerHTML=filtered.map(function(t){
    var overdue=isOverdue(t);
    return '<div class="task-card'+(t.completed?' completed':'')+'" data-priority="'+t.priority+'" data-id="'+t.id+'">'
      +'<input type="checkbox" class="task-check"'+(t.completed?' checked':'')+' data-id="'+t.id+'">'
      +'<div class="task-body">'
      +'<div class="task-title" data-id="'+t.id+'">'+t.title+'</div>'
      +'<div class="task-meta">'
      +'<span class="badge badge-'+t.priority+'">'+t.priority+'</span>'
      +'<span class="badge badge-'+t.category+'">'+t.category+'</span>'
      +(t.dueDate?'<span class="badge '+(overdue?'badge-overdue':'badge-duedate')+'">'+(overdue?'Overdue: ':'')+fmtDate(t.dueDate)+'</span>':'')
      +'</div></div>'
      +'<div class="task-actions">'
      +'<button class="btn-icon delete" data-del="'+t.id+'" title="Delete">&#x2715;</button>'
      +'</div></div>';
  }).join('');
  list.querySelectorAll('.task-check').forEach(function(cb){cb.addEventListener('change',function(){toggleTask(parseInt(cb.dataset.id));});});
  list.querySelectorAll('[data-del]').forEach(function(btn){btn.addEventListener('click',function(){deleteTask(parseInt(btn.dataset.del));});});
}
function attachListeners(){
  document.getElementById('addBtn').addEventListener('click',addTask);
  document.getElementById('taskTitle').addEventListener('keydown',function(e){if(e.key==='Enter')addTask();});
  document.getElementById('themeToggle').addEventListener('click',toggleTheme);
  document.getElementById('clearCompletedBtn').addEventListener('click',clearCompleted);
  document.getElementById('searchInput').addEventListener('input',function(e){searchQuery=e.target.value;renderTasks();});
  document.getElementById('filterCategory').addEventListener('change',function(e){currentCategory=e.target.value;renderTasks();});
  document.getElementById('filterPriority').addEventListener('change',function(e){currentPriority=e.target.value;renderTasks();});
  document.getElementById('sortBy').addEventListener('change',function(e){currentSort=e.target.value;renderTasks();});
  document.getElementById('filterTabs').addEventListener('click',function(e){
    if(e.target.dataset.filter){
      currentFilter=e.target.dataset.filter;
      document.querySelectorAll('.tab').forEach(function(t){t.classList.remove('active');});
      e.target.classList.add('active');
      renderTasks();
    }
  });
}
init();
console.log('TaskFlow loaded! Features: priorities, categories, due dates, filters, search, sort, dark mode, localStorage');
<\/script>
</body>
</html>`,
    css: '',
    js: '',
  },
  fetch: {
    icon: '🌍', label: 'Country Explorer', desc: 'REST API + search + filter + modal',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Country Explorer</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
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
.close-btn:hover{color:#f1f5f9}
</style>
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
    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
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
  <div class="loading"><div class="spinner"></div><p>Loading countries...</p></div>
</main>
<div class="overlay" id="overlay" style="display:none">
  <div class="modal" id="modal"></div>
</div>
<script>
var allCountries = [];
var filtered = [];
var sortKey = 'az';

function fmt(n) {
  if (!n && n !== 0) return 'N/A';
  if (n >= 1e9) return (n/1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n/1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n/1e3).toFixed(0) + 'K';
  return n.toString();
}

function badgeClass(region) {
  var map = {Africa:'africa',Europe:'europe',Asia:'asia',Americas:'americas',Oceania:'oceania'};
  return 'badge badge-'+(map[region]||'other');
}

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
  filtered.sort(function(a,b) {
    var na = a.name && a.name.common || '';
    var nb = b.name && b.name.common || '';
    if (sortKey==='az') return na.localeCompare(nb);
    if (sortKey==='za') return nb.localeCompare(na);
    if (sortKey==='ph') return (a.population||0)-(b.population||0);
    if (sortKey==='pl') return (b.population||0)-(a.population||0);
    return 0;
  });
  document.getElementById('count-label').textContent = filtered.length + ' countries';
  renderGrid();
}

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
    html += '<div class="card" data-i="'+i+'">'
      + '<img src="'+flag+'" alt="'+name+' flag" loading="lazy">'
      + '<div class="card-body">'
      + '<div class="card-name" title="'+name+'">'+name+'</div>'
      + '<div class="card-info"><b>Capital:</b> '+cap+'<br><b>Population:</b> '+pop+'</div>'
      + '<span class="'+bc+'">'+c.region+'</span>'
      + '</div></div>';
  });
  html += '</div>';
  main.innerHTML = html;
  main.querySelectorAll('.card').forEach(function(card) {
    card.addEventListener('click', function() {
      openModal(filtered[parseInt(card.dataset.i)]);
    });
  });
}

function openModal(c) {
  var name = c.name && c.name.common || 'Unknown';
  var official = c.name && c.name.official || name;
  var flag = c.flags && (c.flags.svg || c.flags.png) || '';
  var cap = c.capital && c.capital.join(', ') || 'N/A';
  var pop = fmt(c.population);
  var area = c.area ? (c.area.toLocaleString() + ' km²') : 'N/A';
  var sub = c.subregion || c.region || 'N/A';
  var langs = c.languages ? Object.values(c.languages).join(', ') : 'N/A';
  var curr = c.currencies ? Object.values(c.currencies).map(function(x){return x.name + (x.symbol?' ('+x.symbol+')':'');}).join(', ') : 'N/A';
  var borders = c.borders && c.borders.length ? c.borders.map(function(b){return '<span class="tag">'+b+'</span>';}).join('') : '<span class="tag">None</span>';

  document.getElementById('modal').innerHTML =
    '<img class="modal-flag" src="'+flag+'" alt="'+name+' flag">'
    +'<div class="modal-body">'
    +'<button class="close-btn" id="close-modal">✕</button>'
    +'<div class="modal-name">'+name+'</div>'
    +'<div class="modal-official">'+official+'</div>'
    +'<div class="modal-grid">'
    +'<div class="modal-item"><label>Capital</label><span>'+cap+'</span></div>'
    +'<div class="modal-item"><label>Population</label><span>'+pop+'</span></div>'
    +'<div class="modal-item"><label>Area</label><span>'+area+'</span></div>'
    +'<div class="modal-item"><label>Region</label><span>'+sub+'</span></div>'
    +'</div>'
    +'<div class="modal-section"><h3>Languages</h3><div>'+langs+'</div></div>'
    +'<div class="modal-section"><h3>Currencies</h3><div>'+curr+'</div></div>'
    +'<div class="modal-section"><h3>Borders</h3><div>'+borders+'</div></div>'
    +'</div>';

  document.getElementById('overlay').style.display = 'flex';
  document.getElementById('close-modal').addEventListener('click', closeModal);
  console.log('Opened:', name, '| Pop:', c.population, '| Region:', c.region);
}

function closeModal() {
  document.getElementById('overlay').style.display = 'none';
}

function setSort(key) {
  sortKey = key;
  ['az','za','ph','pl'].forEach(function(k) {
    document.getElementById('s-'+k).classList.toggle('active', k===key);
  });
  applyFilters();
}

async function loadCountries() {
  try {
    console.log('Fetching countries via local proxy...');
    // Use our own Next.js API route to avoid CORS issues from srcdoc iframe
    var res = await fetch('__APP_ORIGIN__/api/countries');
    console.log('Response status:', res.status, res.statusText);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    var data = await res.json();
    console.log('Data received:', Array.isArray(data) ? 'array['+data.length+']' : JSON.stringify(data).slice(0,100));
    // Handle both direct array and nested response shapes
    if (data && data.error) throw new Error(data.error);
    allCountries = Array.isArray(data) ? data : (data.data || data.countries || data.results || []);
    if (!allCountries.length) throw new Error('No country data received');
    var totalPop = allCountries.reduce(function(s,c){return s+(c.population||0);},0);
    document.getElementById('st-total').textContent = allCountries.length;
    document.getElementById('st-pop').textContent = fmt(totalPop);
    console.log('Loaded', allCountries.length, 'countries. World population:', fmt(totalPop));
    var regions = {};
    allCountries.forEach(function(c){regions[c.region]=(regions[c.region]||0)+1;});
    console.log('By region:', JSON.stringify(regions));
    applyFilters();
  } catch(err) {
    document.getElementById('main').innerHTML =
      '<div class="error"><p>⚠️ Failed to load: ' + err.message + '</p>'
      +'<button class="retry-btn" id="retry">Retry</button></div>';
    document.getElementById('retry').addEventListener('click', loadCountries);
    console.error('Error:', err.message);
  }
}

document.getElementById('search').addEventListener('input', applyFilters);
document.getElementById('region').addEventListener('change', applyFilters);
document.getElementById('s-az').addEventListener('click', function(){setSort('az');});
document.getElementById('s-za').addEventListener('click', function(){setSort('za');});
document.getElementById('s-ph').addEventListener('click', function(){setSort('ph');});
document.getElementById('s-pl').addEventListener('click', function(){setSort('pl');});
document.getElementById('overlay').addEventListener('click', function(e){if(e.target===this)closeModal();});

loadCountries();
<\/script>
</body>
</html>`,
    css: '',
    js: '',
  },
  calculator: {
    icon: '🧮', label: 'Calculator', desc: 'Full scientific calculator',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
*{box-sizing:border-box;margin:0;padding:0}
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
.km{flex:1;background:#2c2c2e;color:#ff9f0a;border:1px solid #3a3a3c;border-radius:7px;padding:6px;font-size:11px;cursor:pointer;font-weight:600;}
.km:active{opacity:.7;}
.hist-panel{background:#000;border-radius:8px;padding:8px;max-height:100px;overflow-y:auto;}
.hist-title{color:#555;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;}
.hclear{background:#333;color:#aaa;border:none;border-radius:4px;padding:2px 7px;font-size:10px;cursor:pointer;}
#hist-ul{list-style:none;padding:0;}
#hist-ul li{color:#666;font-size:11px;font-family:monospace;padding:2px 0;border-bottom:1px solid #111;cursor:pointer;}
#hist-ul li:hover{color:#ff9f0a;}
#hist-ul li b{color:#ff9f0a;float:right;margin-left:8px;}
</style>
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
<script>
var expr='', memory=0, history=[], mode='std', base=10;
var RL=document.getElementById('result-line');
var EL=document.getElementById('expr-line');
var HL=document.getElementById('hist-line');
var calculating=false;

function setDisplay(r){RL.textContent=r;}
function setExpr(e){EL.textContent=e;}
function setHist(h){HL.textContent=h;}

function numPress(v){
  if(RL.textContent==='Error'){expr='';setDisplay('0');setExpr('');}
  expr+=String(v);
  setExpr(expr);
  tryPreview();
}
function opPress(v){
  if(!expr){expr=String(RL.textContent);}
  if(expr==='Error'||expr==='0')return;
  expr+=v;
  setExpr(expr);
}
function insFunc(v){
  if(!expr){expr=String(RL.textContent);}
  expr+=v;
  setExpr(expr);
}
function clearAll(){expr='';setDisplay('0');setExpr('');setHist('');}
function backspace(){expr=expr.slice(0,-1);setExpr(expr);tryPreview();}

function tryPreview(){
  try{
    var r=Function('return ('+expr+')')();
    if(typeof r==='number'&&isFinite(r)&&expr.length>1){
      setDisplay(parseFloat(r.toFixed(10)));
    }
  }catch(e){}
}

function calculate(){
  if(calculating)return;
  if(!expr)return;
  calculating=true;
  setTimeout(function(){calculating=false;},300);
  // Get current display value (live preview already computed it)
  var displayVal=parseFloat(String(RL.textContent));
  if(isNaN(displayVal)){
    // try to compute
    try{
      var r=Function('"use strict";return('+expr+')')();
      if(typeof r!=='number'||!isFinite(r))throw new Error('Invalid');
      displayVal=parseFloat(r.toFixed(10));
    }catch(e){
      setDisplay('Error');setExpr('');expr='';return;
    }
  }
  // Finalize: save to history, clear expression line, keep result
  addHistory(expr,displayVal);
  setHist(expr+' =');
  setExpr('');
  setDisplay(displayVal);
  if(mode==='prog')updateBases(displayVal);
  expr=String(displayVal);
  console.log('=',displayVal);
}

function calculate(){
  if(calculating)return;
  // After a result, expr is like "2080" - just display it again, don't error
  if(!expr)return;
  calculating=true;
  setTimeout(function(){calculating=false;},200);
  try{
    var r=Function('"use strict";return('+expr+')')();
    if(typeof r!=='number'||!isFinite(r))throw new Error('Invalid');
    r=parseFloat(r.toFixed(10));
    addHistory(expr,r);
    setHist(expr+' =');
    setExpr('');
    setDisplay(r);
    if(mode==='prog')updateBases(r);
    expr=String(r);
    console.log('=',r);
  }catch(e){
    setDisplay('Error');
    setExpr('');
    expr='';
  }
}

function addHistory(e,r){
  history.unshift({expr:e,result:r});
  if(history.length>20)history.pop();
  renderHistory();
}
function renderHistory(){
  var ul=document.getElementById('hist-ul');
  ul.innerHTML='';
  history.forEach(function(h,i){
    var li=document.createElement('li');
    li.innerHTML=h.expr+'<b>='+h.result+'</b>';
    li.addEventListener('click',function(){expr=String(h.result);setDisplay(h.result);setHist(h.expr+' =');});
    ul.appendChild(li);
  });
}

function setMode(m){
  mode=m;
  document.getElementById('ms').className='mbtnn'+(m==='std'?' on':'');
  document.getElementById('mc2').className='mbtnn'+(m==='sci'?' on':'');
  document.getElementById('mp').className='mbtnn'+(m==='prog'?' on':'');
  document.getElementById('sci-sec').style.display=m==='sci'?'block':'none';
  document.getElementById('prog-sec').style.display=m==='prog'?'block':'none';
  document.getElementById('mode-badge').textContent=m==='std'?'STANDARD':m==='sci'?'SCIENTIFIC':'PROGRAMMER';
}
function setBase(b){
  base=b;
  ['b10','b16','b8','b2'].forEach(function(id){document.getElementById(id).className='bb';});
  document.getElementById('b'+b).className='bb on';
  updateBases(parseFloat(RL.textContent)||0);
}
function updateBases(n){
  n=Math.trunc(n)||0;
  document.getElementById('vhex').textContent=n.toString(16).toUpperCase();
  document.getElementById('voct').textContent=n.toString(8);
  document.getElementById('vbin').textContent=n.toString(2);
}

// Wire buttons
document.getElementById('bac').addEventListener('click',clearAll);
document.getElementById('bbk').addEventListener('click',backspace);
document.getElementById('beq').addEventListener('click',calculate);
document.getElementById('bdiv').addEventListener('click',function(){opPress('/');});
document.getElementById('bmul').addEventListener('click',function(){opPress('*');});
document.getElementById('bsub').addEventListener('click',function(){opPress('-');});
document.getElementById('badd').addEventListener('click',function(){opPress('+');});
document.getElementById('b0').addEventListener('click',function(){numPress('0');});
document.getElementById('b1').addEventListener('click',function(){numPress('1');});
document.getElementById('b2n').addEventListener('click',function(){numPress('2');});
document.getElementById('b3').addEventListener('click',function(){numPress('3');});
document.getElementById('b4').addEventListener('click',function(){numPress('4');});
document.getElementById('b5').addEventListener('click',function(){numPress('5');});
document.getElementById('b6').addEventListener('click',function(){numPress('6');});
document.getElementById('b7').addEventListener('click',function(){numPress('7');});
document.getElementById('b8n').addEventListener('click',function(){numPress('8');});
document.getElementById('b9').addEventListener('click',function(){numPress('9');});
document.getElementById('bdot').addEventListener('click',function(){numPress('.');});
// Scientific
document.getElementById('bsin').addEventListener('click',function(){insFunc('Math.sin(');});
document.getElementById('bcos').addEventListener('click',function(){insFunc('Math.cos(');});
document.getElementById('btan').addEventListener('click',function(){insFunc('Math.tan(');});
document.getElementById('bln').addEventListener('click',function(){insFunc('Math.log(');});
document.getElementById('blog').addEventListener('click',function(){insFunc('Math.log10(');});
document.getElementById('bsqrt').addEventListener('click',function(){insFunc('Math.sqrt(');});
document.getElementById('bpow').addEventListener('click',function(){insFunc('Math.pow(');});
document.getElementById('bpi').addEventListener('click',function(){insFunc('Math.PI');});
document.getElementById('be').addEventListener('click',function(){insFunc('Math.E');});
document.getElementById('bpar').addEventListener('click',function(){insFunc(expr.split('(').length>expr.split(')').length?')':'(');});
// Mode
document.getElementById('ms').addEventListener('click',function(){setMode('std');});
document.getElementById('mc2').addEventListener('click',function(){setMode('sci');});
document.getElementById('mp').addEventListener('click',function(){setMode('prog');});
// Base
document.getElementById('b10').addEventListener('click',function(){setBase(10);});
document.getElementById('b16').addEventListener('click',function(){setBase(16);});
document.getElementById('b8').addEventListener('click',function(){setBase(8);});
document.getElementById('b2').addEventListener('click',function(){setBase(2);});
// Memory
document.getElementById('bmc').addEventListener('click',function(){memory=0;console.log('Memory cleared');});
document.getElementById('bmr').addEventListener('click',function(){var v=memory;expr=String(v);setDisplay(v);setHist('MR = '+v);});
document.getElementById('bmp').addEventListener('click',function(){var v=parseFloat(RL.textContent)||0;memory+=v;console.log('M+ Memory:',memory);});
document.getElementById('bmm').addEventListener('click',function(){var v=parseFloat(RL.textContent)||0;memory-=v;console.log('M- Memory:',memory);});
document.getElementById('bhclear').addEventListener('click',function(){history=[];document.getElementById('hist-ul').innerHTML='';});
// Keyboard
document.addEventListener('keydown',function(e){
  if(e.key>='0'&&e.key<='9'){numPress(e.key);}
  else if(e.key==='.'){numPress('.');}
  else if(e.key==='+'||e.key==='-'||e.key==='*'||e.key==='/'){opPress(e.key);}
  else if(e.key==='Enter'||e.key==='='){if(expr)calculate();}
  else if(e.key==='Backspace'){backspace();}
  else if(e.key==='Escape'){clearAll();}
  else if(e.key==='('||e.key===')'){insFunc(e.key);}
});
console.log('Scientific Calculator ready! Standard / Scientific (sin,cos,tan,log,sqrt,pi) / Programmer (HEX/OCT/BIN) modes. Keyboard supported.');
</script>
</body>
</html>`,
    css: '',
    js: '',
  },
};


// Build the iframe HTML for a given mode
function buildIframe(h: string, c: string, j: string, runId: number): string {
  // If HTML is a full self-contained document, inject the console bridge just before </body> and return as-is
  const trimmed = h.trim();
  if (trimmed.toLowerCase().startsWith('<!doctype') || (trimmed.toLowerCase().startsWith('<html') && trimmed.includes('</html>'))) {
    const bridge = `<script>
var __rid=${runId};
var APP_ORIGIN=${JSON.stringify(typeof window !== 'undefined' ? window.location.origin : '')};
function __post(t,msg){try{window.parent.postMessage({_wda:1,rid:__rid,t:t,d:msg},"*");}catch(e){}}
var __ol=console.log,__ow=console.warn,__oe=console.error;
console.log=function(){var a=Array.prototype.slice.call(arguments);__ol.apply(console,a);__post("l",a.map(function(x){return typeof x==="object"?JSON.stringify(x,null,2):String(x);}).join(" "));};
console.warn=function(){var a=Array.prototype.slice.call(arguments);__ow.apply(console,a);if(String(a[0]||"").indexOf("Babel")===-1)__post("w",a.map(String).join(" "));};
console.error=function(){var a=Array.prototype.slice.call(arguments);__oe.apply(console,a);__post("e",a.map(String).join(" "));};
window.onerror=function(m,s,l){__post("e","❌ "+m+(l?" (line "+l+")":""));return false;};
<\/script>`;
    return trimmed.replace(/<\/body>/i, bridge + '</body>');
  }

  const isJsInHtml = h.trim() && !h.trim().startsWith('<') && !h.includes('</');
  const bodyContent = isJsInHtml ? '' : (h || '');
  const jsContent   = isJsInHtml ? h : j;

  const hasReact = /ReactDOM\.(createRoot|render)|React\.(useState|useEffect|useRef)\b|return\s*\(\s*<|<[A-Z]\w*\s*\/>|return\s*<[A-Z]|className=|htmlFor=|onClick=|onChange=/.test(jsContent);
  const hasTS    = !hasReact && (
    /:\s*(string|number|boolean|any|void|never|unknown)\b/.test(jsContent) ||
    /^(interface|type|enum)\s+\w/m.test(jsContent) ||
    /:\s*\w+\[\]/.test(jsContent)
  );

  // The bridge - uses var so it's accessible from new Function() and Babel script contexts
  const bridge = [
    'var __rid=' + runId + ';',
    'var __logs=[];',
    'function __post(t,msg){',
    '  try{window.parent.postMessage({_wda:1,rid:__rid,t:t,d:msg},"*");}catch(e){}',
    '}',
    'var __ol=console.log,__ow=console.warn,__oe=console.error;',
    'console.log=function(){',
    '  var args=Array.prototype.slice.call(arguments);',
    '  __ol.apply(console,arguments);',
    '  var msg=args.map(function(x){return typeof x==="object"?JSON.stringify(x,null,2):String(x);}).join(" ");',
    '  __post("l",msg);',
    '  __logs.push(msg);',
    '};',
    'console.warn=function(){',
    '  var args=Array.prototype.slice.call(arguments);',
    '  __ow.apply(console,arguments);',
    '  if(String(args[0]||"").indexOf("Babel")===-1){',
    '    __post("w",args.map(function(x){return String(x);}).join(" "));',
    '  }',
    '};',
    'console.error=function(){',
    '  var args=Array.prototype.slice.call(arguments);',
    '  __oe.apply(console,arguments);',
    '  __post("e",args.map(function(x){return String(x);}).join(" "));',
    '};',
    'window.onerror=function(m,s,l){__post("e","❌ "+m+(l?" (line "+l+")":""));return false;};',
  ].join('');

  const style = `*{box-sizing:border-box}body{margin:0;padding:16px;font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;background:#fff;color:#111}${c}`;

  if (hasTS) {
    // Strip import/export statements before compiling — CDN mode doesn't support ES modules
    const cleanedTS = jsContent
      .replace(/^import\s+.*?from\s+['"][^'"]+['"]\s*;?\s*$/gm, '')
      .replace(/^export\s+(default\s+)?/gm, '');
    const escaped = JSON.stringify(cleanedTS);
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<script src="https://cdn.jsdelivr.net/npm/typescript@5/lib/typescript.js"></script>
<style>${style}</style></head>
<body>${bodyContent}
<script>
${bridge}
(function(){
  var __root=document.getElementById('root');
  if(!__root){__root=document.createElement('div');__root.id='root';document.body.appendChild(__root);}
})();
try{
  var __compiled=ts.transpileModule(${escaped},{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.None,strict:false}});
  // Wrap in async IIFE so top-level await works
  var __asyncFn='(async function(){'+__compiled.outputText+'})()';
  var __result=new Function('return '+__asyncFn)();
  if(__result&&typeof __result.catch==='function'){
    __result.catch(function(e){
      __post('e','❌ '+e.message);
      var d=document.createElement('div');
      d.style.cssText='color:#dc2626;background:#fef2f2;padding:12px;border-radius:8px;font-family:monospace;font-size:13px;margin-top:8px;white-space:pre-wrap';
      d.textContent='❌ TypeScript Error: '+e.message;
      document.body.appendChild(d);
    });
  }
}catch(e){
  __post('e','❌ TypeScript: '+e.message);
  var __errDiv=document.createElement('div');
  __errDiv.style.cssText='color:#dc2626;background:#fef2f2;padding:12px;border-radius:8px;font-family:monospace;font-size:13px;margin-top:8px;white-space:pre-wrap';
  __errDiv.textContent='❌ TypeScript Error: '+e.message;
  document.body.appendChild(__errDiv);
}
</script></body></html>`;
  }

  if (hasReact) {
    // Strip ES module import statements — CDN React is already loaded globally
    let rc = jsContent
      .replace(/^import\s+.*?from\s+['"][^'"]+['"]\s*;?\s*$/gm, '')
      .replace(/^import\s+['"][^'"]+['"]\s*;?\s*$/gm, '');
    if (!rc.includes('ReactDOM.createRoot') && !rc.includes('ReactDOM.render')) {
      const m = rc.match(/function\s+([A-Z]\w*)/g);
      const last = m ? m[m.length-1].replace('function ','') : '';
      if (last) {
        rc += '\nif(typeof '+last+'!=="undefined"&&document.getElementById("root")){ReactDOM.createRoot(document.getElementById("root")).render(React.createElement('+last+'));}';
      }
    }
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<style>${style}</style></head>
<body>${bodyContent || '<div id="root"></div>'}
<script>${bridge}</script>
<script type="text/babel">
(async function(){
try{
  ${rc}
}catch(e){
  console.error('❌ '+e.message);
  var rootEl=document.getElementById('root');
  if(rootEl){rootEl.innerHTML='<div style="color:#dc2626;background:#fef2f2;padding:12px;border-radius:8px;font-family:monospace;font-size:13px;white-space:pre-wrap">❌ React Error: '+e.message+'</div>';}
}
})();
</script></body></html>`;
  }

  // Plain JS/HTML
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>${style}</style></head>
<body>${bodyContent}
<script>
${bridge}
// Provide common stubs so teaching examples don't crash on missing DOM elements
(function(){
  var __root=document.getElementById('root');
  if(!__root){__root=document.createElement('div');__root.id='root';document.body.appendChild(__root);}
  var __demo=document.getElementById('demo');
  if(!__demo){__demo=document.createElement('div');__demo.id='demo';__demo.style.display='none';document.body.appendChild(__demo);}
})();
// Wrap in async IIFE so top-level await works
(async function(){
try{
${jsContent}
}catch(e){
  __post("e","❌ "+e.message);
  var __errDiv=document.createElement('div');
  __errDiv.style.cssText='color:#dc2626;background:#fef2f2;padding:12px;border-radius:8px;font-family:monospace;font-size:13px;margin-top:8px;white-space:pre-wrap';
  __errDiv.textContent='❌ Error: '+e.message;
  document.body.appendChild(__errDiv);
}
})();
</script></body></html>`;
}

export function PlaygroundClient() {
  const searchParams = useSearchParams();

  function decodeParam(key: string): string {
    const val = searchParams.get(key);
    if (!val) return '';
    try {
      return decodeURIComponent(
        atob(decodeURIComponent(val)).split('').map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
      );
    } catch { return ''; }
  }

  const urlHtml = decodeParam('html');
  const urlCss  = decodeParam('css');
  const urlJs   = decodeParam('js');
  const urlTemplate = searchParams.get('template') || '';

  // Resolve initial template from ?template= param
  const resolvedTemplate = urlTemplate && TEMPLATES[urlTemplate] ? urlTemplate : 'blank';
  const activeInitTemplate = urlHtml || urlJs ? 'blank' : resolvedTemplate;

  // When JS is pre-loaded from URL (from lesson Code Editor button),
  // detect if it needs React/TS mode and set appropriate HTML
  const tpl = TEMPLATES[activeInitTemplate] || TEMPLATES.blank;
  const initHtml = urlHtml || (urlJs ? (() => {
    const hasR = /ReactDOM\.(createRoot|render)|return\s*\(\s*<|<[A-Z]\w*\s*\/>/.test(urlJs);
    if (hasR) return '<div id="root"></div>';
    return TEMPLATES.blank.html;
  })() : tpl.html);

  const [html, setHtml] = useState(initHtml);
  const [css,  setCss]  = useState(urlCss  || tpl.css);
  const [js,   setJs]   = useState(urlJs   || tpl.js);
  const [tab, setTab]   = useState<'html' | 'css' | 'js'>(urlCss ? 'css' : urlJs ? 'js' : 'html');
  const [logs, setLogs] = useState<{ type: string; msg: string }[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied]   = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(activeInitTemplate);
  const [showTemplates, setShowTemplates]   = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const runIdRef  = useRef(0);

  const run = useCallback((h: string, c: string, j: string) => {
    runIdRef.current += 1;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const doc = buildIframe(h.replace('__APP_ORIGIN__', origin), c, j, runIdRef.current);
    if (iframeRef.current) iframeRef.current.srcdoc = doc;
    setLogs([]);
  }, []);

  const runCurrent = useCallback(() => run(html, css, js), [html, css, js, run]);

  useEffect(() => { run(initHtml, urlCss || tpl.css, urlJs || tpl.js); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data?._wda) return;
      setLogs(p => [...p.slice(-49), { type: e.data.t, msg: e.data.d }]);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  const loadTemplate = (key: string) => {
    const t = TEMPLATES[key];
    setHtml(t.html); setCss(t.css); setJs(t.js);
    setActiveTemplate(key); setShowTemplates(false);
    setTimeout(() => run(t.html, t.css, t.js), 40);
  };

  const copy = async () => {
    const code = tab === 'html' ? html : tab === 'css' ? css : js;
    await navigator.clipboard.writeText(code);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const exportFile = () => {
    const blob = new Blob([buildIframe(html, css, js, 0)], { type: 'text/html' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = 'project.html'; a.click();
  };

  const cur    = tab === 'html' ? html : tab === 'css' ? css : js;
  const setCur = (v: string) => { if (tab === 'html') setHtml(v); else if (tab === 'css') setCss(v); else setJs(v); };

  // Language mode badge
  const hasReact = /ReactDOM\.(createRoot|render)|return\s*\(<|<[A-Z]\w*\s*\/>/.test(js);
  const hasTS    = !hasReact && (/:\s*(string|number|boolean)\b/.test(js) || /^(interface|type|enum)\s+\w/m.test(js));
  const langMode = tab === 'js' ? (hasReact ? '⚛️ React' : hasTS ? '🔷 TypeScript' : '⚡ JavaScript') : tab === 'html' ? '🌐 HTML' : '🎨 CSS';

  const tabCls = (t: string) => `px-4 py-2.5 text-[12px] font-mono font-bold tracking-wide border-b-2 transition-colors ${
    tab === t
      ? t === 'html' ? 'text-orange-400 border-orange-400 bg-orange-400/5'
        : t === 'css' ? 'text-blue-400 border-blue-400 bg-blue-400/5'
        : 'text-yellow-400 border-yellow-400 bg-yellow-400/5'
      : 'text-[#6b7280] border-transparent hover:text-white hover:bg-white/5'
  }`;
  const logCls = (t: string) => `text-[11px] font-mono py-0.5 px-1 ${t === 'e' ? 'text-red-400' : t === 'w' ? 'text-yellow-400' : 'text-[#3fb950]'}`;

  return (
    <div className={`flex flex-col bg-[#0d1117] ${isFullscreen ? 'fixed inset-0 z-[100]' : 'min-h-[calc(100vh-58px)]'}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d] shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1.5 text-white font-bold text-[13px] font-mono mr-1">
            <Terminal className="w-4 h-4 text-green-400" />
            <span className="hidden sm:inline">Code Editor</span>
          </Link>
          <div className="relative">
            <button onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white text-[11px] font-medium transition-colors">
              <span>{TEMPLATES[activeTemplate].icon}</span>
              <span className="hidden sm:inline">{TEMPLATES[activeTemplate].label}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {showTemplates && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-[#161b22] border border-[#30363d] rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#484f58]">Templates</p>
                {Object.entries(TEMPLATES).map(([k, t]) => (
                  <button key={k} onClick={() => loadTemplate(k)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-[#21262d] transition-colors ${activeTemplate === k ? 'text-white' : 'text-[#8b949e]'}`}>
                    <span className="text-base">{t.icon}</span>
                    <div><p className="text-[12px] font-semibold">{t.label}</p><p className="text-[10px] text-[#484f58]">{t.desc}</p></div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={copy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-[#8b949e] hover:text-white hover:bg-[#21262d]">
            {copied ? <><Check className="w-3.5 h-3.5 text-green-400" /><span className="hidden sm:inline text-green-400">Copied!</span></> : <><Copy className="w-3.5 h-3.5" /><span className="hidden sm:inline">Copy</span></>}
          </button>
          <button onClick={exportFile} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-[#8b949e] hover:text-white hover:bg-[#21262d]">
            <Download className="w-3.5 h-3.5" /><span className="hidden sm:inline">Export</span>
          </button>
          <Link href="/js/introduction" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-[#8b949e] hover:text-white hover:bg-[#21262d]">
            <BookOpen className="w-3.5 h-3.5" />Tutorial
          </Link>
          <button onClick={runCurrent}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-[12px] font-bold transition-colors shadow-lg shadow-green-900/30">
            <Play className="w-3.5 h-3.5" />Run ▶
          </button>
          <button onClick={() => setIsFullscreen(f => !f)} className="p-1.5 rounded-lg text-[#6b7280] hover:text-white hover:bg-[#21262d]">
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        {/* Editor */}
        <div className="flex flex-col w-full md:w-1/2 border-b md:border-b-0 md:border-r border-[#30363d]" style={{ minHeight: 200 }}>
          <div className="flex items-center bg-[#0d1117] border-b border-[#30363d]">
            {(['html','css','js'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={tabCls(t)}>{t.toUpperCase()}</button>
            ))}
            <span className="ml-2 text-[10px] text-[#8b949e] font-mono hidden sm:block">{langMode}</span>
            <span className="ml-auto pr-3 text-[10px] text-[#484f58] font-mono hidden lg:block">Ctrl+Enter = run</span>
          </div>
          <textarea value={cur} onChange={e => setCur(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Tab') {
                e.preventDefault();
                const s = e.currentTarget.selectionStart;
                const v = cur.slice(0, s) + '  ' + cur.slice(e.currentTarget.selectionEnd);
                setCur(v);
                requestAnimationFrame(() => { if(e.currentTarget){e.currentTarget.selectionStart=e.currentTarget.selectionEnd=s+2;}});
              }
              if ((e.ctrlKey||e.metaKey) && e.key === 'Enter') runCurrent();
            }}
            spellCheck={false}
            className="flex-1 w-full p-4 font-mono text-[13px] leading-relaxed resize-none outline-none bg-[#0d1117] text-[#e6edf3] caret-white"
            style={{ tabSize: 2 }} />
        </div>

        {/* Preview + Console */}
        <div className="flex flex-col w-full md:w-1/2" style={{ minHeight: 320 }}>
          <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest ml-2">Live Preview</span>
            </div>
            <button onClick={runCurrent} className="text-gray-400 hover:text-gray-700 transition-colors"><RotateCcw className="w-3.5 h-3.5" /></button>
          </div>
          <iframe ref={iframeRef} className="flex-1 bg-white border-0 w-full"
            style={{ minHeight: 220 }}
            sandbox="allow-scripts allow-forms allow-popups allow-modals" title="Live Preview" />
          <div className="border-t border-[#30363d] bg-[#0d1117] shrink-0" style={{ minHeight: 28, maxHeight: 60 }}>
            <div className="flex items-center justify-between px-3 py-0.5 border-b border-[#21262d]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6b7280]">
                Console {logs.length > 0 && <span className="ml-1 text-[#484f58]">({logs.length})</span>}
              </span>
              <button onClick={() => setLogs([])} className="text-[10px] text-[#484f58] hover:text-[#8b949e]">Clear</button>
            </div>
            <div className="overflow-y-auto p-1 space-y-0.5" style={{ maxHeight: 32 }}>
              {logs.length === 0
                ? <p className="text-[10px] text-[#484f58] font-mono px-1">console.log() output appears here...</p>
                : logs.map((l, i) => <p key={i} className={logCls(l.type)}>{l.msg}</p>)}
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-[#161b22] border-t border-[#30363d] shrink-0">
        <span className="text-[10px] text-[#484f58] font-mono">{tab.toUpperCase()} · {cur.split('\n').length} lines</span>
        <span className="text-[10px] text-[#484f58] font-mono">HTML · CSS · JS · TypeScript · React — all supported</span>
      </div>
    </div>
  );
}
