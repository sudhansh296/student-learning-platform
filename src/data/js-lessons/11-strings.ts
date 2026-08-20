import type { JSLesson } from '../js-curriculum';

export const jsStringsLesson: JSLesson = {
  id:'js-strings',title:'Strings — Complete Guide',slug:'strings',
  chapter:'data',order:12,difficulty:'beginner',readingTime:14,
  description:'Master every string method — search, extract, replace, split, template literals, and real-world patterns.',
  sections:[
    {type:'text',content:'Strings are one of the most-used data types in JavaScript. You work with strings constantly — user names, messages, URLs, HTML content, API responses. Mastering string methods will save you hours of manual work.'},
    {type:'heading',content:'String Creation and Basics'},
    {type:'example',title:'String creation',content:'JavaScript has three ways to write strings: single quotes, double quotes, and backtick template literals. Template literals are the most powerful — they let you embed variables and expressions directly inside the string using ${...}. They also support multi-line strings without special characters.',language:'javascript',code:`const s1 = 'single quotes';
const s2 = "double quotes";
const s3 = \`template literal — most powerful\`;

// Template literals
const name = "Alex", age = 25;
const msg = \`Hello \${name}, you are \${age} years old.\`;
const expr = \`2 + 2 = \${2 + 2}\`;            // "2 + 2 = 4"
const cond = \`Role: \${age >= 18 ? 'adult' : 'minor'}\`;

// Multi-line (template literals only)
const html = \`
  <div class="card">
    <h2>\${name}</h2>
    <p>Age: \${age}</p>
  </div>
\`;

// String length
"hello".length;    // 5
"".length;         // 0
"  hi  ".length;   // 6 (spaces count)

// Access characters
"hello"[0];        // "h"
"hello".at(-1);    // "o" (last char — ES2022)
"hello".charAt(1); // "e"`},
    {type:'heading',content:'Searching Strings'},
    {type:'example',title:'Finding things inside strings',content:'These methods let you check if a string contains something and where. includes() is the simplest — returns true or false. indexOf() returns the position of the match (or -1 if not found). startsWith() and endsWith() check the beginning and end. match() with a regex lets you extract pieces of a string.',language:'javascript',code:`const str = "Hello, JavaScript World!";

// includes — true/false (case sensitive)
str.includes("JavaScript"); // true
str.includes("python");     // false

// startsWith / endsWith
str.startsWith("Hello");    // true
str.startsWith("World", 14);// true (from index 14)
str.endsWith("!");           // true
str.endsWith("World", 22);  // true (check first 22 chars)

// indexOf / lastIndexOf — returns index or -1
str.indexOf("o");            // 4
str.lastIndexOf("o");        // 22
str.indexOf("Python");       // -1 (not found)

// search — like indexOf but accepts regex
str.search(/JavaScript/i);  // 7
str.search(/python/i);       // -1

// match — returns matches
"test123".match(/\d+/);      // ["123"]
"a1b2c3".match(/\d/g);       // ["1","2","3"] (g flag = all matches)`},
    {type:'heading',content:'Extracting Parts'},
    {type:'example',title:'slice, substring, split',content:'slice(start, end) cuts out a piece of a string — negative numbers count from the end, so slice(-3) gives you the last 3 characters. split() turns a string into an array by breaking it at a separator character. This is how you parse CSV data, split a sentence into words, or break a URL into parts.',language:'javascript',code:`const str = "Hello, JavaScript World!";

// slice(start, end) — negative index counts from end
str.slice(7, 17);    // "JavaScript"
str.slice(-6);       // "orld!" (last 6 chars)
str.slice(7);        // "JavaScript World!" (to end)

// substring(start, end) — no negatives (treats negatives as 0)
str.substring(7, 17); // "JavaScript"

// split — string to array
"a,b,c,d".split(",");         // ["a","b","c","d"]
"hello".split("");             // ["h","e","l","l","o"]
"one two three".split(" ");   // ["one","two","three"]
"a-b-c".split("-", 2);        // ["a","b"] (limit)

// Join array back to string
["one","two","three"].join(", "); // "one, two, three"
["Hello","World"].join(" ");      // "Hello World"`},
    {type:'heading',content:'Modifying Strings'},
    {type:'example',title:'Replace, transform, trim',content:'replace() swaps the first match in a string. Use a regex with the /g flag to replace ALL matches. trim() removes whitespace from both ends — essential for cleaning user input. padStart() is great for formatting numbers with leading zeros (like "007" from 7). These methods all return NEW strings — strings in JavaScript are immutable.',language:'javascript',code:`const str = "Hello World Hello";

// replace — replaces FIRST match
str.replace("Hello", "Hi");         // "Hi World Hello"
str.replace(/hello/gi, "Hey");      // "Hey World Hey" (case insensitive, all)

// replaceAll — replaces ALL matches (ES2021)
str.replaceAll("Hello", "Hi");      // "Hi World Hi"

// Case
"hello WORLD".toUpperCase();        // "HELLO WORLD"
"hello WORLD".toLowerCase();        // "hello world"

// Trimming whitespace
"  hello world  ".trim();            // "hello world"
"  hello world  ".trimStart();       // "hello world  "
"  hello world  ".trimEnd();         // "  hello world"

// Padding
"5".padStart(3, "0");               // "005" — leading zeros!
"hi".padEnd(10, ".");               // "hi........"

// Repeat
"abc".repeat(3);                     // "abcabcabc"

// Concatenation (prefer template literals)
"Hello" + " " + "World";            // "Hello World"
"Hello".concat(" ", "World");       // "Hello World"`},
    {type:'heading',content:'Real-World String Patterns'},
    {type:'example',title:'Common string tasks every developer does',content:'These are the string utility functions you will write or use in almost every real project. capitalize() fixes the casing of names. truncate() cuts long text for card previews. slugify() converts titles into clean URL paths. Knowing these patterns saves you from writing the same code over and over — or better yet, you will recognize them when you see them in open-source code.',language:'javascript',code:`// 1. Capitalize first letter
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
capitalize("hELLO wORLD"); // "Hello world"

// 2. Truncate with ellipsis
function truncate(str, maxLen) {
  return str.length > maxLen ? str.slice(0, maxLen) + "..." : str;
}
truncate("JavaScript is awesome", 10); // "JavaScript..."

// 3. Slugify (URL-friendly string)
function slugify(str) {
  return str.toLowerCase().trim().replace(/[\s_]+/g, "-").replace(/[^a-z0-9-]/g, "");
}
slugify("Hello World! 2026"); // "hello-world-2026"

// 4. Count occurrences
function countOccurrences(str, search) {
  return (str.match(new RegExp(search, "g")) || []).length;
}
countOccurrences("hello world hello", "hello"); // 2

// 5. Reverse a string
const reverse = str => str.split("").reverse().join("");
reverse("hello"); // "olleh"

// 6. Check palindrome
const isPalindrome = str => {
  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return clean === clean.split("").reverse().join("");
};
isPalindrome("A man a plan a canal Panama"); // true

// 7. Extract numbers from string
"Order #1234 placed at 2026-08-17".match(/\d+/g); // ["1234","2026","08","17"]

// 8. Template tag function
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) =>
    result + str + (values[i] ? \`<mark>\${values[i]}</mark>\` : ""), "");
}
const item = "JavaScript", count = 5;
highlight\`Found \${count} results for \${item}\`;
// "Found <mark>5</mark> results for <mark>JavaScript</mark>"`},
    {type:'tryit',title:'Try It: String Methods',
     html:`<div id="app">
  <h2>String Manipulator</h2>
  <textarea id="strInput" rows="3" placeholder="Enter text here...">Hello, JavaScript World! This is a test string.</textarea>
  <div class="btns">
    <button onclick="run('upper')">UPPER</button>
    <button onclick="run('lower')">lower</button>
    <button onclick="run('reverse')">esreveR</button>
    <button onclick="run('words')">Word Count</button>
    <button onclick="run('slug')">Slugify</button>
    <button onclick="run('palindrome')">Palindrome?</button>
  </div>
  <div id="result"></div>
  <h3>Search & Replace</h3>
  <div class="row">
    <input id="searchInput" placeholder="Search for..." value="JavaScript"/>
    <input id="replaceInput" placeholder="Replace with..." value="JS"/>
    <button onclick="doReplace()">Replace All</button>
  </div>
  <div id="replaceResult"></div>
</div>`,
     css:`#app{font-family:system-ui,sans-serif;padding:20px;max-width:520px;}
h2{color:#1e1e1e;margin-bottom:12px;}h3{font-size:14px;color:#374151;margin:16px 0 8px;}
textarea{width:100%;padding:10px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;outline:none;resize:vertical;font-family:inherit;}
.btns,.row{display:flex;flex-wrap:wrap;gap:7px;margin:10px 0;}
button{padding:8px 14px;background:#2563eb;color:white;border:none;border-radius:7px;cursor:pointer;font-size:13px;font-weight:600;}
input{flex:1;padding:8px 12px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:13px;outline:none;min-width:80px;}
#result,#replaceResult{background:#f0fdf4;border:1px solid #86efac;padding:12px 14px;border-radius:8px;font-size:13px;min-height:38px;margin-top:6px;word-break:break-word;}`,
     js:`function run(op) {
  const s = document.getElementById('strInput').value;
  const ops = {
    upper:      () => s.toUpperCase(),
    lower:      () => s.toLowerCase(),
    reverse:    () => s.split('').reverse().join(''),
    words:      () => \`Words: \${s.trim().split(/\\s+/).length} · Chars: \${s.length} · Chars(no spaces): \${s.replace(/\\s/g,'').length}\`,
    slug:       () => s.toLowerCase().trim().replace(/[\\s_]+/g,'-').replace(/[^a-z0-9-]/g,''),
    palindrome: () => { const c=s.toLowerCase().replace(/[^a-z0-9]/g,''); return c===c.split('').reverse().join('')?'✅ Is a palindrome!':'❌ Not a palindrome'; },
  };
  document.getElementById('result').textContent = ops[op] ? ops[op]() : '';
}
function doReplace() {
  const s = document.getElementById('strInput').value;
  const search  = document.getElementById('searchInput').value;
  const replace = document.getElementById('replaceInput').value;
  if (!search) return;
  const result = s.replaceAll(search, replace);
  const safe = replace.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const highlighted = result.split(replace).join('<mark style="background:#fef9c3">' + safe + '</mark>');
  document.getElementById('replaceResult').innerHTML = highlighted;
}`,mode:'full'},
  ],
  exercises:[{id:'str-1',question:'What does "hello".at(-1) return?',type:'code-output',correct:'o',explanation:'.at() accepts negative indices — -1 means last character. "hello".at(-1) returns "o". This is cleaner than str[str.length-1].'}],
  quiz:[{id:'sq-str1',question:'What is the difference between indexOf() and includes()?',options:['No difference','indexOf returns the position (or -1), includes returns true/false','includes is newer and always preferred','indexOf is faster'],correct:1,explanation:'indexOf returns the numeric index of the match (-1 if not found). includes returns a boolean. Use includes when you just need to know IF something exists; use indexOf when you need the position.'}],
};
