import type { JSLesson } from '../js-curriculum';

export const jsConditionsLesson: JSLesson = {
  id: 'js-conditions',
  title: 'Conditions - if, else, switch',
  slug: 'conditions',
  chapter: 'basics',
  order: 6,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'Control the flow of your program with if/else statements, switch/case, and the ternary operator.',
  sections: [
    { type: 'text', content: 'Conditions let your program make decisions. "If the user is logged in, show the dashboard. Otherwise, show the login page." Every program needs conditions - they are the foundation of logic.' },
    { type: 'heading', content: 'if / else if / else' },
    { type: 'example', title: 'Basic conditionals', content: 'An if statement runs code only when a condition is true. else if adds more conditions. else runs when nothing above was true. JavaScript evaluates conditions from top to bottom and stops at the first true one. The condition inside () can be any expression that evaluates to true or false.', language: 'javascript', code: `const hour = new Date().getHours();
let greeting;

if (hour < 12) {
  greeting = "Good morning! ☀️";
} else if (hour < 17) {
  greeting = "Good afternoon! 🌤️";
} else if (hour < 21) {
  greeting = "Good evening! 🌆";
} else {
  greeting = "Good night! 🌙";
}
console.log(greeting);

// Checking multiple conditions
const score = 75;
let grade;

if (score >= 90) {
  grade = "A";
} else if (score >= 80) {
  grade = "B";
} else if (score >= 70) {
  grade = "C";
} else if (score >= 60) {
  grade = "D";
} else {
  grade = "F";
}
console.log("Grade:", grade); // "C"` },
    { type: 'heading', content: 'Truthy and Falsy in Conditions' },
    { type: 'example', title: 'Using truthy/falsy to simplify conditions', content: 'In JavaScript, you do not always need to write the full comparison. Any value used in an if condition is automatically converted to boolean. The 6 "falsy" values that become false: 0, "", null, undefined, NaN, false. EVERYTHING else is truthy - including empty arrays [], empty objects {}, and the string "false". This lets you write cleaner code like: if (name) instead of if (name !== null && name !== undefined && name !== "").', language: 'javascript', code: `// Falsy values: false, 0, "", '', null, undefined, NaN
// Everything else is truthy

// Long way:
const name = "Alex";
if (name !== null && name !== undefined && name !== "") {
  console.log("Name:", name);
}

// Short way - using truthiness:
if (name) {
  console.log("Name:", name); // runs if name is truthy (non-empty)
}

// Check if array has items:
const items = [1, 2, 3];
if (items.length) {
  console.log("Has items:", items.length);
}

// Check if user exists before accessing property:
const user = null;
if (user) {
  console.log(user.name); // safe - only runs if user is truthy
}
// With optional chaining:
console.log(user?.name); // undefined (no error)` },
    { type: 'heading', content: 'switch / case' },
    { type: 'example', title: 'Switch for multiple specific values', content: 'A switch statement is cleaner than multiple if/else when you are checking ONE variable against many specific exact values. The break statement is critical - without it, JavaScript "falls through" and keeps running the next case even if it does not match. The default case runs if no other case matched, like the final else.', language: 'javascript', code: `const day = new Date().getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

switch (day) {
  case 0:
    console.log("Sunday - rest day");
    break;
  case 1:
    console.log("Monday - start of work week");
    break;
  case 2:
    console.log("Tuesday - keep going");
    break;
  case 3:
    console.log("Wednesday - halfway there");
    break;
  case 4:
    console.log("Thursday - almost Friday!");
    break;
  case 5:
    console.log("Friday - TGIF! 🎉");
    break;
  case 6:
    console.log("Saturday - weekend!");
    break;
  default:
    console.log("Unknown day");
}

// Fall-through (multiple cases, same action):
switch (day) {
  case 1:
  case 2:
  case 3:
  case 4:
  case 5:
    console.log("Weekday");
    break;
  case 0:
  case 6:
    console.log("Weekend");
    break;
}

// IMPORTANT: always use break to stop fall-through!
// Without break, execution continues to the next case` },
    { type: 'note', title: 'switch vs if/else - when to use which', content: 'Use switch when checking one variable against many specific exact values (like a menu command or day of week). Use if/else for ranges (age > 18), multiple conditions (&&, ||), or when conditions are complex.' },
    { type: 'heading', content: 'Object Lookup - Better Than Long switch' },
    { type: 'example', title: 'Replace switch with an object map', content: 'For many simple lookups, an object works better than a long switch statement. Instead of case 200: return "OK", store the mapping in an object { 200: "OK", 404: "Not Found" } and access it with statuses[code]. The ?? "Unknown" at the end provides a default value if the code is not in the object. This is shorter, more readable, and easier to update.', language: 'javascript', code: `// Switch statement (verbose):
function getStatusText(code) {
  switch(code) {
    case 200: return "OK";
    case 201: return "Created";
    case 400: return "Bad Request";
    case 401: return "Unauthorized";
    case 404: return "Not Found";
    case 500: return "Server Error";
    default:  return "Unknown";
  }
}

// Object lookup (cleaner, more maintainable):
function getStatusText(code) {
  const statuses = {
    200: "OK",
    201: "Created",
    400: "Bad Request",
    401: "Unauthorized",
    404: "Not Found",
    500: "Server Error",
  };
  return statuses[code] ?? "Unknown";
}

console.log(getStatusText(404)); // "Not Found"
console.log(getStatusText(999)); // "Unknown"` },
    { type: 'tryit', title: 'Try It: Build a Grade Calculator',
      html: `<div id="app">
  <h2>Grade Calculator</h2>
  <div class="row">
    <input id="scoreInput" type="number" min="0" max="100" placeholder="Enter score (0-100)"/>
    <button onclick="calculateGrade()">Get Grade</button>
  </div>
  <div id="result"></div>
  <hr style="margin:16px 0;border-color:#e5e7eb">
  <h3>Day Checker</h3>
  <button onclick="checkDay()">What day is it?</button>
  <p id="dayResult"></p>
</div>`,
      css: `#app{font-family:system-ui,sans-serif;padding:20px;max-width:440px;}
h2{color:#1e1e1e;margin-bottom:12px;}h3{font-size:14px;color:#374151;margin:0 0 10px;}
.row{display:flex;gap:8px;margin-bottom:12px;}
input{flex:1;padding:9px 12px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;outline:none;}
input:focus{border-color:#2563eb;}
button{padding:9px 18px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:14px;}
#result{min-height:44px;padding:14px;border-radius:10px;border:1px solid #e5e7eb;background:#f9fafb;font-size:20px;font-weight:700;text-align:center;}
#dayResult{margin-top:8px;color:#374151;font-size:14px;}`,
      js: `function calculateGrade() {
  const score = parseInt(document.getElementById('scoreInput').value);
  let grade, message, bg, color;

  if (isNaN(score) || score < 0 || score > 100) {
    document.getElementById('result').textContent = '⚠️ Enter a score between 0 and 100';
    return;
  }

  if (score >= 90)      { grade = 'A'; message = 'Excellent! 🌟'; bg = '#f0fdf4'; color = '#15803d'; }
  else if (score >= 80) { grade = 'B'; message = 'Great work! 👍'; bg = '#eff6ff'; color = '#1d4ed8'; }
  else if (score >= 70) { grade = 'C'; message = 'Good job! 😊'; bg = '#fefce8'; color = '#854d0e'; }
  else if (score >= 60) { grade = 'D'; message = 'Needs work 📚'; bg = '#fff7ed'; color = '#c2410c'; }
  else                  { grade = 'F'; message = 'Keep studying! 💪'; bg = '#fef2f2'; color = '#dc2626'; }

  const el = document.getElementById('result');
  el.style.background = bg;
  el.style.color = color;
  el.style.borderColor = color + '40';
  el.textContent = \`Score: \${score} → Grade: \${grade} · \${message}\`;
}

function checkDay() {
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const day = new Date().getDay();
  const name = days[day];
  const isWeekend = day === 0 || day === 6;
  document.getElementById('dayResult').textContent =
    \`Today is \${name}. \${isWeekend ? '🎉 It is the weekend!' : '💼 It is a weekday.'}\`;
}`,
      mode: 'full' },
  ],
  exercises: [
    { id: 'cond-1', question: 'What is the output: if (0) { console.log("yes") } else { console.log("no") }', type: 'code-output', correct: 'no', explanation: '0 is falsy in JavaScript. The if condition evaluates to false, so the else block runs, printing "no".' },
    { id: 'cond-2', question: 'Why is break important in a switch statement?', type: 'multiple-choice', options: ['It is not important', 'Without break, execution falls through to the next case', 'break ends the program', 'It skips the default case'], correct: 1, explanation: 'Without break, JavaScript continues executing the next case even if it does not match. This is called "fall-through." Always add break at the end of each case unless you intentionally want fall-through behavior.' },
  ],
  quiz: [
    { id: 'qc1', question: 'What is the ternary operator syntax?', options: ['if (condition) ? trueVal : falseVal', 'condition ? trueVal : falseVal', 'condition : trueVal ? falseVal', '(condition, trueVal, falseVal)'], correct: 1, explanation: 'Ternary: condition ? valueIfTrue : valueIfFalse. Example: age >= 18 ? "adult" : "minor". It is a one-line if/else for simple expressions.' },
  ],
};
