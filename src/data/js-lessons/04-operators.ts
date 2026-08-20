import type { JSLesson } from '../js-curriculum';

export const jsOperatorsLesson: JSLesson = {
  id: 'js-operators',
  title: 'Operators',
  slug: 'operators',
  chapter: 'basics',
  order: 5,
  difficulty: 'beginner',
  readingTime: 12,
  description: 'Master all JavaScript operators — arithmetic, assignment, comparison, logical, ternary, nullish coalescing, and optional chaining.',
  sections: [
    { type: 'text', content: 'Operators are symbols that perform operations on values. JavaScript has many types of operators: arithmetic (math), assignment (store values), comparison (compare values), logical (combine conditions), and more. Mastering operators is essential for writing any meaningful JavaScript code.' },
    { type: 'heading', content: 'Arithmetic Operators' },
    { type: 'example', title: 'Math operations', content: 'These are the standard arithmetic operators. The one beginners often forget is % (modulo/remainder) — it gives you what is left over after division. For example, 10 % 3 = 1 because 10 divided by 3 is 3 with remainder 1. It is very useful for checking if a number is even (n % 2 === 0).', language: 'javascript', code: `let a = 10, b = 3;

console.log(a + b);   // 13  — addition
console.log(a - b);   // 7   — subtraction
console.log(a * b);   // 30  — multiplication
console.log(a / b);   // 3.333... — division
console.log(a % b);   // 1   — modulo (remainder): 10 ÷ 3 = 3 remainder 1
console.log(a ** b);  // 1000 — exponentiation: 10³

// Increment & Decrement
let x = 5;
console.log(x++); // 5  — post-increment: returns THEN increments
console.log(x);   // 6
console.log(++x); // 7  — pre-increment: increments THEN returns
console.log(x--); // 7  — post-decrement
console.log(x);   // 6
console.log(--x); // 5  — pre-decrement

// Practical: check if number is even or odd
function isEven(n) { return n % 2 === 0; }
console.log(isEven(4));  // true
console.log(isEven(7));  // false` },
    { type: 'heading', content: 'Assignment Operators' },
    { type: 'example', title: 'Assigning and updating values', content: 'Assignment operators are shortcuts. Instead of writing x = x + 5, you can write x += 5. These compound operators (+=, -=, *=, /=) all do the same thing: update the variable using the current value. The newer ??= operator is especially useful: it only assigns a value if the variable is currently null or undefined.', language: 'javascript', code: `let x = 10;

x = 20;    // basic assignment: x is now 20
x += 5;    // same as x = x + 5  → 25
x -= 3;    // same as x = x - 3  → 22
x *= 2;    // same as x = x * 2  → 44
x /= 4;    // same as x = x / 4  → 11
x %= 3;    // same as x = x % 3  → 2
x **= 3;   // same as x = x ** 3 → 8

// Logical assignment (ES2021)
let a = null;
a ??= "default";   // assign if null/undefined → "default"

let b = "";
b ||= "fallback";  // assign if falsy → "fallback"

let c = 5;
c &&= 10;          // assign if truthy → 10

console.log(a, b, c); // "default" "fallback" 10` },
    { type: 'heading', content: 'Comparison Operators' },
    { type: 'example', title: 'Comparing values — always use ===', content: 'Comparison operators return true or false. The critical rule: always use === (triple equals) instead of == (double equals). Triple equals is "strict" — it checks both value AND type. Double equals performs type coercion (automatic conversion) which causes confusing bugs. Example: 0 == false is true (dangerous!), but 0 === false is false (correct).', language: 'javascript', code: `// STRICT equality (===) — checks value AND type
console.log(5 === 5);        // true
console.log(5 === "5");      // false — different types!
console.log(null === null);  // true

// LOOSE equality (==) — coerces types (AVOID)
console.log(5 == "5");       // true  — string coerced
console.log(0 == false);     // true  — both coerce to 0
console.log(null == undefined); // true — special rule
console.log("" == false);    // true  — coercion

// Strict inequality
console.log(5 !== "5");      // true  — use this
console.log(5 != "5");       // false — avoid

// Relational
console.log(10 > 5);         // true
console.log(10 >= 10);       // true
console.log(5 < 3);          // false
console.log(5 <= 5);         // true

// String comparison (lexicographic)
console.log("apple" < "banana");  // true — 'a' < 'b'
console.log("B" < "a");           // true — uppercase < lowercase in ASCII` },
    { type: 'heading', content: 'Logical Operators' },
    { type: 'example', title: '&&, ||, ! and short-circuit evaluation', content: 'Logical operators combine conditions. && (AND) requires BOTH sides to be true. || (OR) requires at least ONE side to be true. ! (NOT) flips the value. The most important concept is short-circuit evaluation: JavaScript stops evaluating as soon as it knows the answer. This is why user && user.name works — if user is null, JavaScript never tries to access .name (which would crash).', language: 'javascript', code: `// && (AND) — true only if BOTH are true
console.log(true && true);   // true
console.log(true && false);  // false
console.log(5 > 3 && 10 > 7); // true

// || (OR) — true if AT LEAST ONE is true
console.log(false || true);  // true
console.log(false || false); // false
console.log(5 > 10 || 3 > 1); // true

// ! (NOT) — flips the boolean
console.log(!true);   // false
console.log(!false);  // true
console.log(!!0);     // false (double negation converts to boolean)
console.log(!!"");    // false

// SHORT-CIRCUIT EVALUATION — crucial pattern
// && returns first falsy value, or last value if all truthy
console.log(0 && "hello");     // 0     — 0 is falsy, stop
console.log("hi" && "hello");  // "hello" — both truthy, return last

// || returns first truthy value
console.log(0 || "default");   // "default" — 0 is falsy
console.log("user" || "guest"); // "user"    — truthy, return it

// Real-world patterns
const user = null;
const name = user && user.name;  // safe access: if user exists, get .name
console.log(name); // null (no error!)

const displayName = user || "Guest";
console.log(displayName); // "Guest"` },
    { type: 'heading', content: 'Nullish Coalescing (??) and Optional Chaining (?.)' },
    { type: 'example', title: 'Modern operators for safe null handling', content: '?. (optional chaining) and ?? (nullish coalescing) were added in 2020 and are now used everywhere in modern JavaScript. Optional chaining (?.) stops and returns undefined instead of throwing an error when something is null. Nullish coalescing (??) provides a fallback but ONLY for null/undefined — unlike || it does not trigger for 0 or empty string.', language: 'javascript', code: `// ?? (Nullish Coalescing) — only falls back for null/undefined
// Unlike ||, it does NOT fall back for 0 or ""

const score = 0;
console.log(score || 100);  // 100 — 0 is falsy, uses fallback (WRONG!)
console.log(score ?? 100);  // 0   — only null/undefined triggers fallback

const name = "";
console.log(name || "Guest"); // "Guest" — "" is falsy (may be unintended)
console.log(name ?? "Guest"); // ""     — "" is not null/undefined

// ?. (Optional Chaining) — safe property access
const user = { profile: { name: "Alex", address: null } };

// Without optional chaining (crashes if null):
// const city = user.profile.address.city; // TypeError!

// With optional chaining (safe):
const city = user?.profile?.address?.city; // undefined (no crash)
const missing = user?.settings?.theme;     // undefined

// Works with methods too:
const result = user?.greet?.();  // undefined if greet doesn't exist

// Works with arrays:
const first = arr?.[0];

// Combine with ??
const city2 = user?.profile?.address?.city ?? "Unknown";
console.log(city2); // "Unknown"

// Real-world API response handling
async function getUser(id) {
  const response = await fetch(\`/api/users/\${id}\`);
  const data = await response.json();
  return data?.user?.name ?? "Anonymous";
}` },
    { type: 'heading', content: 'Ternary Operator — Inline if/else' },
    { type: 'example', title: 'condition ? valueIfTrue : valueIfFalse', content: 'The ternary operator is a compact way to write a simple if/else in one line. The name "ternary" means "three parts" — condition, value if true, value if false. It is great for short decisions inside JSX (React) or variable assignments. Avoid nesting ternaries — if the logic is complex, use a regular if/else instead.', language: 'javascript', code: `const age = 20;

// Ternary syntax: condition ? if_true : if_false
const status = age >= 18 ? "adult" : "minor";
console.log(status); // "adult"

// Equivalent if/else
let statusLong;
if (age >= 18) {
  statusLong = "adult";
} else {
  statusLong = "minor";
}

// Use cases
const isLoggedIn = true;
const greeting = isLoggedIn ? "Welcome back!" : "Please log in";

// In JSX (React)
// return <div>{isLoggedIn ? <UserMenu /> : <LoginButton />}</div>

// Nested ternary (use sparingly — can hurt readability)
const score = 75;
const grade = score >= 90 ? "A" :
              score >= 80 ? "B" :
              score >= 70 ? "C" :
              score >= 60 ? "D" : "F";
console.log(grade); // "C"

// Better with object lookup:
function getGrade(score) {
  const grades = { 90: "A", 80: "B", 70: "C", 60: "D" };
  for (const [min, letter] of Object.entries(grades).reverse()) {
    if (score >= min) return letter;
  }
  return "F";
}` },
    { type: 'tryit', title: 'Try It: Operators',
      html: `<div id="app">
  <h2>Operator Calculator</h2>
  <div class="inputs">
    <input id="a" type="number" value="10" placeholder="A">
    <select id="op">
      <option value="+">+ Add</option>
      <option value="-">− Subtract</option>
      <option value="*">× Multiply</option>
      <option value="/">÷ Divide</option>
      <option value="%">% Modulo</option>
      <option value="**">** Power</option>
    </select>
    <input id="b" type="number" value="3" placeholder="B">
    <button onclick="calculate()">Calculate</button>
  </div>
  <div id="result" class="result"></div>
  <h3>Comparison Results</h3>
  <div id="comparisons"></div>
</div>`,
      css: `#app{font-family:system-ui,sans-serif;padding:20px;max-width:500px;}
h2{color:#1e1e1e;margin-bottom:12px;}h3{font-size:14px;color:#374151;margin:16px 0 8px;}
.inputs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;}
input[type=number]{width:80px;padding:9px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;text-align:center;outline:none;}
select{padding:9px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;outline:none;background:white;}
button{padding:9px 18px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;}
.result{background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:16px;font-size:18px;font-weight:700;color:#1d4ed8;min-height:52px;}
#comparisons{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;}
.comp{background:#f9fafb;border:1px solid #e5e7eb;padding:8px 12px;border-radius:8px;font-size:13px;font-family:monospace;}
.comp.true{background:#f0fdf4;border-color:#86efac;color:#166534;}
.comp.false{background:#fef2f2;border-color:#fca5a5;color:#dc2626;}`,
      js: `function calculate() {
  const a = parseFloat(document.getElementById('a').value);
  const b = parseFloat(document.getElementById('b').value);
  const op = document.getElementById('op').value;
  let result;
  if (op==='+') result=a+b;
  else if (op==='-') result=a-b;
  else if (op==='*') result=a*b;
  else if (op=='/') result=b===0?'Cannot divide by zero':a/b;
  else if (op==='%') result=a%b;
  else if (op==='**') result=a**b;
  document.getElementById('result').textContent = \`\${a} \${op} \${b} = \${result}\`;

  const comps = [
    [\`\${a} === \${b}\`, a===b],[\`\${a} !== \${b}\`, a!==b],
    [\`\${a} > \${b}\`, a>b],[\`\${a} < \${b}\`, a<b],
    [\`\${a} >= \${b}\`, a>=b],[\`\${a} <= \${b}\`, a<=b],
    [\`\${a}>\${b} && \${a}>0\`, a>b&&a>0],[\`\${a}<0 || \${b}>0\`, a<0||b>0],
  ];
  document.getElementById('comparisons').innerHTML = comps.map(([expr,val])=>
    \`<div class="comp \${val}">\${expr} → \${val}</div>\`).join('');
}
calculate();`,
      mode: 'full' },
  ],
  exercises: [
    { id: 'op-1', question: 'What is 10 % 3?', type: 'code-output', correct: '1', explanation: 'The modulo operator (%) returns the remainder of division. 10 ÷ 3 = 3 remainder 1. So 10 % 3 = 1. Common use: check if even (n % 2 === 0).' },
    { id: 'op-2', question: 'What does the ?? operator do (nullish coalescing)?', type: 'multiple-choice', options: ['Same as ||', 'Only falls back for null or undefined (not 0 or "")', 'Throws error if null', 'Checks if equal'], correct: 1, explanation: '?? (nullish coalescing) only uses the fallback value when the left side is null or undefined. Unlike ||, it does NOT trigger for falsy values like 0 or empty string.' },
  ],
  quiz: [
    { id: 'qop1', question: 'What is the output of: console.log(0 || "default")?', options: ['"0"', '0', '"default"', 'undefined'], correct: 2, explanation: '|| returns the first truthy value. 0 is falsy, so JavaScript moves to the right side and returns "default". Use ?? instead if you want 0 to be a valid value.' },
    { id: 'qop2', question: 'What does user?.profile?.name do?', options: ['Throws error if user is null', 'Safely accesses nested properties, returns undefined instead of throwing', 'Creates a new property', 'Deletes the property'], correct: 1, explanation: 'Optional chaining (?.) stops and returns undefined if any link in the chain is null or undefined, instead of throwing a TypeError. Essential for handling API responses.' },
  ],
};
