import type { JSLesson } from '../js-curriculum';
export const jsNumbersLesson: JSLesson = {
  id:'js-numbers',title:'Numbers & Math',slug:'numbers',chapter:'basics',order:22,difficulty:'beginner',readingTime:10,
  description:'Master JavaScript numbers — integer vs float, special values (Infinity/NaN), Number methods, and the Math object.',
  sections:[
    {type:'text',content:'JavaScript has ONE number type for both integers and decimals (unlike Java/C which have int, float, double). All numbers are 64-bit floating point (IEEE 754). This causes some surprises but is easy to work with once understood.'},
    {type:'heading',content:'Number Basics and Special Values'},
    {type:'example',title:'Numbers in JavaScript',content:'JavaScript uses one number type for both whole numbers and decimals — a 64-bit floating point (IEEE 754). This means very large integers can lose precision, and 0.1 + 0.2 does not equal exactly 0.3 (a classic floating-point issue). Number.EPSILON is the smallest difference JavaScript can represent — use it when comparing floats. Number.MAX_SAFE_INTEGER is the largest integer that can be represented exactly.',language:'javascript',code:`// JavaScript has ONE number type
const integer = 42;
const decimal = 3.14;
const negative = -100;
const big = 1_000_000;   // numeric separator (ES2021) — just for readability

// Special values
console.log(Infinity);      // positive infinity
console.log(-Infinity);     // negative infinity
console.log(NaN);           // Not a Number
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991 (2^53 - 1)
console.log(Number.MIN_SAFE_INTEGER); // -9007199254740991
console.log(Number.EPSILON);          // 2.22e-16 (smallest difference)

// Floating point quirk
console.log(0.1 + 0.2);         // 0.30000000000000004 ← not 0.3!
console.log(0.1 + 0.2 === 0.3); // false!
// Fix: compare with tolerance
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON); // true
// Or: use toFixed for display
console.log((0.1 + 0.2).toFixed(1)); // "0.3"

// Number checks
console.log(Number.isNaN(NaN));         // true
console.log(Number.isNaN("hello"));     // false (stricter than isNaN)
console.log(Number.isFinite(Infinity)); // false
console.log(Number.isInteger(42));      // true
console.log(Number.isInteger(42.5));    // false
console.log(Number.isSafeInteger(Number.MAX_SAFE_INTEGER)); // true`},
    {type:'heading',content:'Number Conversion'},
    {type:'example',title:'Converting to and from numbers',content:'Number() converts any value to a number — empty string becomes 0, non-numeric strings become NaN. parseInt() is smarter for strings that start with numbers — it reads as far as it can and stops, so "42px" becomes 42. Always pass a radix (base) to parseInt: parseInt("0xff", 16) for hex. toFixed() formats a number to a set number of decimal places and returns a string — useful for displaying prices.',language:'javascript',code:`// String to number
Number("42");         // 42
Number("3.14");       // 3.14
Number("");           // 0
Number("hello");      // NaN
Number(true);         // 1
Number(false);        // 0
Number(null);         // 0
Number(undefined);    // NaN

// parseInt and parseFloat
parseInt("42px");     // 42 — stops at non-numeric
parseInt("3.9");      // 3 — truncates decimal
parseInt("0xff", 16); // 255 — parse hex
parseInt("1010", 2);  // 10 — parse binary
parseFloat("3.14em"); // 3.14

// Number to string
(42).toString();      // "42"
(255).toString(16);   // "ff" — hex
(255).toString(2);    // "11111111" — binary
(255).toString(8);    // "377" — octal

// Formatting
(3.14159).toFixed(2);    // "3.14" — decimal places (returns string!)
(1234567).toLocaleString(); // "1,234,567" — locale-aware
(0.000001).toExponential(2); // "1.00e-6"
(1234).toPrecision(3);   // "1.23e+3"`},
    {type:'heading',content:'The Math Object'},
    {type:'example',title:'Math methods — all you need to know',content:'The Math object contains constants and functions for mathematical operations. Math.random() gives a random number between 0 and 1 (never exactly 1) — multiply and floor it to get random integers. Know the difference between Math.floor() (always rounds down toward -∞) and Math.trunc() (always rounds toward zero) — they differ for negative numbers. Math.max(...arr) uses spread to pass an array as individual arguments.',language:'javascript',code:`// Constants
Math.PI;      // 3.14159265358979
Math.E;       // 2.71828182845905
Math.SQRT2;   // 1.41421356237
Math.LN2;     // 0.693147180559945

// Rounding
Math.round(4.6);    // 5  — nearest integer
Math.round(4.5);    // 5  — .5 rounds UP
Math.round(4.4);    // 4
Math.floor(4.9);    // 4  — always rounds DOWN
Math.ceil(4.1);     // 5  — always rounds UP
Math.trunc(4.9);    // 4  — removes decimal (no rounding)
Math.trunc(-4.9);   // -4 (different from floor for negatives!)
Math.floor(-4.1);   // -5 (floor goes toward -∞)

// Min/Max
Math.max(1, 5, 3, 9, 2);   // 9
Math.min(1, 5, 3, 9, 2);   // 1
Math.max(...[1,5,3,9,2]);   // 9 — spread array

// Math functions
Math.abs(-42);              // 42 — absolute value
Math.sqrt(16);              // 4  — square root
Math.cbrt(27);              // 3  — cube root
Math.pow(2, 10);            // 1024 (same as 2**10)
Math.sign(-5);              // -1 (negative)
Math.sign(0);               // 0
Math.sign(5);               // 1 (positive)
Math.log(Math.E);           // 1 — natural log
Math.log2(8);               // 3 — log base 2
Math.log10(1000);           // 3 — log base 10
Math.hypot(3, 4);           // 5 — sqrt(3²+4²)

// Trigonometry
Math.sin(Math.PI / 2);      // 1
Math.cos(Math.PI);          // -1
Math.tan(Math.PI / 4);      // ~1

// Random numbers
Math.random();                    // 0 to 0.9999... (never 1)
Math.floor(Math.random() * 6);    // 0 to 5 (dice 0-indexed)
Math.floor(Math.random() * 6)+1;  // 1 to 6 (dice)

// Random integer between min and max (inclusive)
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
randomInt(1, 100); // random number 1-100`},
    {type:'tryit',title:'Try It: Numbers & Math',
     html:`<div id="app">
  <h2>Math Playground</h2>
  <div class="row"><label>Number A:</label><input id="a" type="number" value="16"/></div>
  <div class="row"><label>Number B:</label><input id="b" type="number" value="3"/></div>
  <button onclick="calculate()">Calculate</button>
  <div id="result"></div>
  <h3 style="margin-top:16px">Random Dice</h3>
  <button onclick="rollDice()">Roll Dice 🎲</button>
  <p id="dice"></p>
</div>`,
     css:`#app{font-family:system-ui,sans-serif;padding:20px;max-width:440px;}
h2{color:#1e1e1e;}h3{font-size:14px;color:#374151;}
.row{display:flex;align-items:center;gap:10px;margin-bottom:10px;}
label{width:90px;font-size:13px;color:#374151;font-weight:600;}
input{padding:8px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;outline:none;width:100px;}
button{padding:9px 18px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;}
#result{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;font-family:monospace;font-size:12px;line-height:1.8;margin-top:12px;}
p{font-size:18px;font-weight:700;color:#2563eb;margin:10px 0 0;}`,
     js:`function calculate() {
  const a = parseFloat(document.getElementById('a').value);
  const b = parseFloat(document.getElementById('b').value);
  const lines = [
    'a = ' + a + ', b = ' + b,
    '',
    'Math.round(a)   = ' + Math.round(a),
    'Math.floor(a)   = ' + Math.floor(a),
    'Math.ceil(a)    = ' + Math.ceil(a),
    'Math.sqrt(a)    = ' + Math.sqrt(a).toFixed(4),
    'Math.pow(a,b)   = ' + Math.pow(a,b),
    'Math.max(a,b)   = ' + Math.max(a,b),
    'Math.min(a,b)   = ' + Math.min(a,b),
    'Math.abs(a-b)   = ' + Math.abs(a-b),
    'a.toFixed(2)    = ' + a.toFixed(2),
    '(a).toString(2) = ' + Math.floor(a).toString(2) + ' (binary)',
    '(a).toString(16)= ' + Math.floor(a).toString(16) + ' (hex)',
  ];
  document.getElementById('result').textContent = lines.join('\\n');
}
function rollDice() {
  const dice = Array.from({length:5}, () => Math.floor(Math.random()*6)+1);
  document.getElementById('dice').textContent = '🎲 ' + dice.join(' ');
}`,mode:'full'},
  ],
  exercises:[{id:'n1',question:'What is the output of: console.log(0.1 + 0.2 === 0.3)',type:'code-output',correct:'false',explanation:'Due to IEEE 754 floating-point representation, 0.1 + 0.2 = 0.30000000000000004 in JavaScript, not 0.3. To compare floats, use Math.abs(a - b) < Number.EPSILON.'}],
  quiz:[{id:'nq1',question:'What does Math.floor() do?',options:['Rounds to nearest integer','Always rounds DOWN (toward negative infinity)','Always rounds UP','Removes the decimal part'],correct:1,explanation:'Math.floor() always rounds DOWN toward negative infinity. Math.floor(4.9) = 4, Math.floor(-4.1) = -5. For truncation (toward zero), use Math.trunc().'}],
};
