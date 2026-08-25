import type { JSLesson } from '../js-curriculum';

export const jsDataTypesLesson: JSLesson = {
  id: 'js-datatypes-full',
  title: 'Data Types',
  slug: 'data-types',
  chapter: 'basics',
  order: 4,
  difficulty: 'beginner',
  readingTime: 14,
  description: 'Master all 8 JavaScript data types - strings, numbers, booleans, null, undefined, symbol, bigint, and objects. Plus type checking and type conversion.',
  sections: [
    {
      type: 'text',
      content: 'JavaScript has 8 data types. The first 7 are called "primitive" types - they hold a single immutable value. The 8th is "object" - it holds collections of key-value pairs. JavaScript is dynamically typed: a variable can hold any type and you can change it at runtime.',
    },
    {
      type: 'heading',
      content: 'All 8 Data Types',
    },
    {
      type: 'example',
      title: 'Every data type with examples',
      content: 'JavaScript has 8 types of data. The first 7 (string, number, boolean, undefined, null, symbol, bigint) are "primitive" - they store a single value. The 8th is "object" - it stores collections. The most important thing to understand: JavaScript is dynamically typed, meaning a variable can hold any type at any time.',
      code: `// 1. STRING - text in quotes
const single  = 'Hello World';
const double  = "Hello World";
const template = \`Hello, \${"World"}!\`;  // template literal

// 2. NUMBER - integers AND decimals (ONE type handles both)
const integer = 42;
const decimal = 3.14;
const negative = -100;
const scientific = 2.5e6;    // 2,500,000
const infinity = Infinity;
const minusInfinity = -Infinity;
const notANumber = NaN;      // result of invalid math

// 3. BOOLEAN - only true or false
const isActive = true;
const isDeleted = false;

// 4. UNDEFINED - variable declared but no value assigned
let notAssigned;
console.log(notAssigned); // undefined

// 5. NULL - intentional absence of value
const selectedUser = null;  // "there is no user"

// 6. SYMBOL - unique, immutable identifier
const id1 = Symbol("id");
const id2 = Symbol("id");
console.log(id1 === id2); // false - always unique!

// 7. BIGINT - integers too large for Number
const huge = 9007199254740991n;  // note the n suffix
const bigCalc = 1000000000000000000n * 2n;

// 8. OBJECT - collection of key-value pairs
const person = { name: "Alex", age: 25 };
const arr = [1, 2, 3];   // arrays ARE objects
const fn = function() {}; // functions ARE objects`,
      language: 'javascript',
    },
    {
      type: 'heading',
      content: 'The typeof Operator',
    },
    {
      type: 'example',
      title: 'Checking types with typeof',
      content: 'The typeof operator is how you check what type of data a value is. It always returns a string. Watch out for two surprises: typeof null returns "object" (a 30-year-old JavaScript bug) and typeof [] also returns "object" (arrays are objects). Use Array.isArray() to check for arrays specifically.',
      code: `console.log(typeof "hello");        // "string"
console.log(typeof 42);             // "number"
console.log(typeof 3.14);           // "number" - same type!
console.log(typeof true);           // "boolean"
console.log(typeof undefined);      // "undefined"
console.log(typeof null);           // "object" ← FAMOUS BUG!
console.log(typeof {});             // "object"
console.log(typeof []);             // "object" ← arrays are objects
console.log(typeof function(){});   // "function"
console.log(typeof Symbol());       // "symbol"
console.log(typeof 42n);            // "bigint"

// typeof null returning "object" is a decades-old JavaScript bug
// To properly check for null:
const value = null;
if (value === null) {
  console.log("It's null");
}

// To check if something is an array:
console.log(Array.isArray([]));     // true
console.log(Array.isArray({}));     // false`,
      language: 'javascript',
    },
    {
      type: 'heading',
      content: 'Strings in Depth',
    },
    {
      type: 'example',
      title: 'String creation and template literals',
      content: 'Strings hold text. You can use single quotes, double quotes, or backticks. Backticks (template literals) are the most powerful - they let you embed JavaScript expressions directly inside the string using ${} and they support multi-line strings without escape characters.',
      code: `// String creation
const name = "Alice";
const greeting = 'Hello, World!';

// Template literals - most powerful (backticks)
const age = 30;
const msg = \`My name is \${name} and I am \${age} years old.\`;
const math = \`2 + 2 = \${2 + 2}\`;  // expressions work!
const conditional = \`Status: \${age >= 18 ? 'Adult' : 'Minor'}\`;

// Multi-line strings
const multiline = \`
  Line 1
  Line 2
  Line 3
\`;

// String escape sequences
const tab = "Column1\tColumn2";
const newline = "Line1\nLine2";
const quote = "She said \\"Hello\\"";
const backslash = "C:\\\\Users\\\\Alex";

console.log(msg);         // "My name is Alice and I am 30 years old."
console.log(math);        // "2 + 2 = 4"
console.log(conditional); // "Status: Adult"`,
      language: 'javascript',
    },
    {
      type: 'example',
      title: 'Essential string methods',
      content: 'JavaScript strings have built-in methods you can call with a dot. Important: strings are immutable - these methods never change the original string, they always return a new one. The most useful are: length (property, not method), includes(), indexOf(), slice(), replace(), split(), and trim().',
      code: `const str = "Hello, JavaScript World!";

// Length
console.log(str.length);           // 23

// Access characters
console.log(str[0]);               // "H"
console.log(str.at(-1));           // "!" (last char, ES2022)
console.log(str.charAt(7));        // "J"

// Case
console.log(str.toUpperCase());    // "HELLO, JAVASCRIPT WORLD!"
console.log(str.toLowerCase());    // "hello, javascript world!"

// Search
console.log(str.includes("JavaScript")); // true
console.log(str.indexOf("o"));           // 4 (first occurrence)
console.log(str.lastIndexOf("o"));       // 22 (last occurrence)
console.log(str.startsWith("Hello"));    // true
console.log(str.endsWith("!"));          // true

// Extract
console.log(str.slice(7, 17));     // "JavaScript"
console.log(str.slice(-6));        // "orld!" (from end)
console.log(str.substring(7, 17)); // "JavaScript"

// Modify
console.log(str.replace("World", "Universe"));    // replaces first
console.log(str.replaceAll("l", "L"));             // replaces all
console.log("  hello  ".trim());                    // "hello"
console.log("  hello  ".trimStart());               // "hello  "
console.log("abc".padStart(6, "0"));                // "000abc"
console.log("abc".padEnd(6, "."));                  // "abc..."
console.log("ha".repeat(3));                        // "hahaha"

// Split and join
console.log("a,b,c".split(","));   // ["a", "b", "c"]
console.log("hello".split(""));    // ["h","e","l","l","o"]
console.log(["a","b","c"].join("-")); // "a-b-c"`,
      language: 'javascript',
    },
    {
      type: 'heading',
      content: 'Numbers in Depth',
    },
    {
      type: 'example',
      title: 'Number methods and the Math object',
      content: 'JavaScript has a built-in Math object with useful math functions. Note: toFixed() returns a STRING, not a number - so if you need arithmetic after formatting, convert it back with Number(). Math.random() gives 0 to 0.9999 - multiply by the range you want and use Math.floor() to get whole numbers.',
      code: `const n = 3.14159;

// Number methods
console.log(n.toFixed(2));          // "3.14" (string!)
console.log(n.toFixed(0));          // "3"
console.log(n.toPrecision(4));      // "3.142"
console.log((255).toString(16));    // "ff" (hexadecimal)
console.log((255).toString(2));     // "11111111" (binary)

// Convert to number
console.log(Number("42"));          // 42
console.log(Number("3.14"));        // 3.14
console.log(Number(""));            // 0
console.log(Number("hello"));       // NaN
console.log(Number(true));          // 1
console.log(Number(false));         // 0
console.log(Number(null));          // 0
console.log(Number(undefined));     // NaN

console.log(parseInt("42px"));      // 42 (stops at non-numeric)
console.log(parseFloat("3.14em"));  // 3.14

// Check special values
console.log(isNaN("hello"));        // true
console.log(isNaN(42));             // false
console.log(Number.isNaN(NaN));     // true (stricter - only actual NaN)
console.log(Number.isFinite(Infinity)); // false
console.log(Number.isInteger(42));  // true
console.log(Number.isInteger(42.5));// false

// Math object
console.log(Math.PI);              // 3.141592653589793
console.log(Math.round(4.6));      // 5
console.log(Math.round(4.4));      // 4
console.log(Math.floor(4.9));      // 4 (always rounds down)
console.log(Math.ceil(4.1));       // 5 (always rounds up)
console.log(Math.trunc(4.9));      // 4 (removes decimal, no rounding)
console.log(Math.abs(-42));        // 42
console.log(Math.max(1,5,3,9,2));  // 9
console.log(Math.min(1,5,3,9,2));  // 1
console.log(Math.sqrt(16));        // 4
console.log(Math.pow(2, 10));      // 1024 (same as 2**10)
console.log(Math.random());        // 0 to 0.9999...

// Random integer between min and max (inclusive)
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
console.log(randomInt(1, 6));      // dice roll: 1-6`,
      language: 'javascript',
    },
    {
      type: 'heading',
      content: 'Type Coercion - JavaScript\'s Automatic Conversion',
    },
    {
      type: 'example',
      title: 'Implicit type conversion (coercion)',
      content: 'JavaScript sometimes converts types automatically without you asking. This is called "coercion". The most famous trap: when you use + with a string and a number, JavaScript treats it as string joining (concatenation), NOT addition. But -, *, / force both values to be numbers. This surprises many beginners.',
      code: `// JavaScript automatically converts types in some operations

// String + anything = string (concatenation)
console.log("5" + 3);     // "53"  ← not 8!
console.log("5" + 3 + 2); // "532" ← left to right
console.log(3 + 2 + "5"); // "55"  ← 3+2=5, then "5"+"5"="55"

// Arithmetic with strings (except +) converts to number
console.log("10" - 3);    // 7
console.log("10" * 2);    // 20
console.log("10" / 2);    // 5
console.log("10" ** 2);   // 100

// Comparison coercion
console.log("5" == 5);    // true  ← string coerced to number
console.log("5" === 5);   // false ← strict, no coercion (USE THIS)
console.log(null == undefined);  // true
console.log(null === undefined); // false

// Truthy and Falsy values
// Falsy: false, 0, "", '', \`\`, null, undefined, NaN
// Everything else is truthy

if ("") console.log("empty string is truthy");  // not printed
if (0)  console.log("0 is truthy");              // not printed
if (null) console.log("null is truthy");          // not printed

if ("hello") console.log("non-empty string is truthy"); // printed!
if (1)       console.log("1 is truthy");                // printed!
if ([])      console.log("empty array is truthy");      // printed!
if ({})      console.log("empty object is truthy");     // printed!`,
      language: 'javascript',
    },
    {
      type: 'heading',
      content: 'Explicit Type Conversion',
    },
    {
      type: 'example',
      title: 'Converting between types manually',
      content: 'Sometimes JavaScript does not automatically convert types the way you want, so you do it yourself. Number("42") converts a string to a number. String(42) converts a number to text. Boolean(value) converts anything to true or false - falsy values (0, "", null, undefined, NaN) become false, everything else becomes true.',
      code: `// To String
String(42)          // "42"
String(true)        // "true"
String(null)        // "null"
String(undefined)   // "undefined"
(42).toString()     // "42"
\`\${42}\`            // "42" (template literal trick)

// To Number
Number("42")        // 42
Number("3.14")      // 3.14
Number("")          // 0
Number(true)        // 1
Number(false)       // 0
Number(null)        // 0
Number(undefined)   // NaN
+("42")             // 42 (unary + operator)
parseInt("42px")    // 42
parseFloat("3.14x") // 3.14

// To Boolean
Boolean(0)          // false
Boolean("")         // false
Boolean(null)       // false
Boolean(undefined)  // false
Boolean(NaN)        // false
Boolean(1)          // true
Boolean("hello")    // true
Boolean([])         // true (arrays are always truthy!)
Boolean({})         // true (objects are always truthy!)
!!0                 // false (double negation trick)
!!"hello"           // true

// Practical example: form input is always a string
const inputValue = "25"; // from <input type="text">
const age = Number(inputValue); // convert to work with it numerically
console.log(age + 5); // 30 (not "255")`,
      language: 'javascript',
    },
    {
      type: 'tryit',
      title: 'Try It: Data Types Explorer',
      html: `<div id="app">
  <h2>Data Types & Conversion</h2>
  <div class="row">
    <input id="valInput" placeholder="Enter any value" />
    <button onclick="analyze()">Analyze</button>
  </div>
  <div id="result"></div>
  <hr style="margin:16px 0;border-color:#e5e7eb"/>
  <h3>Coercion Quiz</h3>
  <div class="quiz">
    <p>What does <code>"5" + 3</code> equal?</p>
    <div class="quiz-btns">
      <button onclick="quizAnswer('53', '8')">8</button>
      <button onclick="quizAnswer('53', '53')">53 (string)</button>
      <button onclick="quizAnswer('53', 'NaN')">NaN</button>
    </div>
    <p id="quiz-result"></p>
  </div>
</div>`,
      css: `#app{font-family:system-ui,sans-serif;padding:20px;max-width:480px;}
h2{color:#1e1e1e;margin-bottom:12px;}h3{font-size:15px;color:#374151;margin:0 0 10px;}
.row{display:flex;gap:8px;margin-bottom:16px;}
input{flex:1;padding:9px 12px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;outline:none;}
input:focus{border-color:#2563eb;}
button{padding:9px 18px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;}
button:hover{background:#1d4ed8;}
#result{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;font-size:13px;line-height:1.8;font-family:monospace;min-height:50px;}
.quiz p{margin:0 0 10px;color:#374151;font-size:14px;}
code{background:#f3f4f6;padding:2px 6px;border-radius:4px;color:#dc2626;font-size:13px;}
.quiz-btns{display:flex;gap:8px;}
.quiz-btns button{font-size:13px;padding:7px 14px;}
#quiz-result{margin-top:10px;font-size:13px;font-weight:600;min-height:20px;}`,
      js: `function analyze() {
  const raw = document.getElementById('valInput').value;
  const lines = [];
  lines.push('Input: "' + raw + '"');
  lines.push('typeof: "' + typeof raw + '"');
  lines.push('As Number: ' + Number(raw) + ' (isNaN: ' + isNaN(Number(raw)) + ')');
  lines.push('As Boolean: ' + Boolean(raw));
  lines.push('Length: ' + raw.length);
  lines.push('Trim: "' + raw.trim() + '"');
  lines.push('UpperCase: "' + raw.toUpperCase() + '"');
  lines.push('parseInt: ' + parseInt(raw));
  document.getElementById('result').textContent = lines.join('\ ');
}

function quizAnswer(correct, chosen) {
  const el = document.getElementById('quiz-result');
  if (chosen === correct) {
    el.style.color = '#16a34a';
    el.textContent = '✅ Correct! "5" + 3 = "53" - the + operator with a string concatenates, not adds.';
  } else {
    el.style.color = '#dc2626';
    el.textContent = '❌ Wrong! "5" + 3 = "53" - when using + with a string, JavaScript concatenates. Try "5" - 3 which gives 2.';
  }
}`,
      mode: 'full',
    },
  ],
  exercises: [
    {
      id: 'dt-1',
      question: 'What does typeof null return in JavaScript?',
      type: 'multiple-choice',
      options: ['"null"', '"undefined"', '"object"', '"boolean"'],
      correct: 2,
      explanation: 'typeof null returns "object" - this is a famous, decades-old JavaScript bug that cannot be fixed without breaking existing code. To check for null specifically, always use === null.',
    },
    {
      id: 'dt-2',
      question: 'What is the output of: console.log("5" + 3)?',
      type: 'code-output',
      correct: '53',
      explanation: 'When using + with a string, JavaScript concatenates rather than adding. "5" + 3 becomes "53" (a string). Use subtraction to force numeric: "5" - 0 + 3 = 8.',
    },
    {
      id: 'dt-3',
      question: 'Which of these values is FALSY in JavaScript?',
      type: 'multiple-choice',
      options: ['"false" (the string)', '[] (empty array)', '0', '{} (empty object)'],
      correct: 2,
      explanation: '0 is falsy. The string "false" is truthy (non-empty string). Empty arrays [] and empty objects {} are truthy - this surprises many beginners. Only 6 values are falsy: false, 0, "", null, undefined, NaN.',
    },
  ],
  quiz: [
    {
      id: 'qdt1',
      question: 'Which method correctly converts the string "3.14" to a number?',
      options: ['str.toNumber()', 'Number("3.14")', 'parseInt("3.14")', 'Both B and C'],
      correct: 3,
      explanation: 'Number("3.14") returns 3.14. parseInt("3.14") returns 3 (integer only). parseFloat("3.14") also returns 3.14. So Number() and parseFloat() both work; parseInt() truncates the decimal.',
    },
    {
      id: 'qdt2',
      question: 'What is the difference between == and ===?',
      options: [
        'No difference',
        '== checks value with type coercion, === checks value AND type (strict)',
        '=== is always faster',
        '== only works for numbers',
      ],
      correct: 1,
      explanation: '== performs type coercion before comparing (5 == "5" is true). === requires same type AND same value (5 === "5" is false). Always use === to avoid unexpected coercion bugs.',
    },
  ],
};
