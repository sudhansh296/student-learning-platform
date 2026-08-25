import type { JSLesson } from '../js-curriculum';
export const jsRegexLesson: JSLesson = {
  id:'js-regex',title:'Regular Expressions',slug:'regex',
  chapter:'advanced',order:20,difficulty:'intermediate',readingTime:12,
  description:'Master regular expressions in JavaScript - syntax, flags, methods, capture groups, and real-world validation patterns.',
  sections:[
    {type:'text',content:'Regular expressions (regex) are patterns for matching text. They look intimidating at first, but once you understand the syntax, they become an incredibly powerful tool for validation, search, and text manipulation.'},
    {type:'heading',content:'Creating Regular Expressions'},
    {type:'example',title:'Regex literals and the RegExp constructor',content:'A regular expression is a pattern written between two forward slashes: /pattern/. Flags come after the closing slash - i makes it case-insensitive, g finds all matches not just the first. Use the literal syntax when the pattern is known at compile time. Use new RegExp(variable) when you need to build the pattern dynamically from a string variable.',language:'javascript',code:`// Literal syntax (preferred)
const pattern1 = /hello/;          // match "hello"
const pattern2 = /hello/i;         // case-insensitive
const pattern3 = /hello/gi;        // global + case-insensitive

// RegExp constructor (for dynamic patterns)
const word = "hello";
const pattern4 = new RegExp(word, "i"); // same as /hello/i
const pattern5 = new RegExp(\`^\${word}\$\`, "i"); // dynamic

// Flags:
// i - case-insensitive
// g - global (find ALL matches)
// m - multiline (^ and $ match start/end of each line)
// s - dotAll (. matches newline too)
// u - unicode
// d - generate indices for matches (ES2022)`},
    {type:'heading',content:'Testing and Matching'},
    {type:'example',title:'test, match, search, replace',content:'test() is the simplest - just returns true or false. match() returns the matched text plus metadata, or null if nothing matched. With the /g flag, match() returns an array of all matches. exec() is like match() but works in a loop for multiple matches. search() returns the index position of the match. replace() substitutes the match with new text - use a function as the replacement for dynamic substitutions.',language:'javascript',code:`const str = "Hello, my email is alex@example.com and phone is +1-555-0123";
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

// test() - returns true/false
emailRegex.test(str);               // true
emailRegex.test("no email here");   // false

// match() - returns match array or null
str.match(emailRegex);              // ["alex@example.com", ...]
"no match".match(emailRegex);       // null

// With 'g' flag - returns ALL matches
const allEmails = str.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
// ["alex@example.com"]

// exec() - returns match with index (useful in loops)
const regex = /\d+/g;
let match;
while ((match = regex.exec("a1b2c3")) !== null) {
  console.log(\`Found \${match[0]} at index \${match.index}\`);
}

// search() - returns index of first match or -1
str.search(emailRegex);   // 22 (index of match)
str.search(/python/);     // -1 (not found)

// replace() - single replacement
str.replace(emailRegex, "[REDACTED]");

// replaceAll() with regex - use 'g' flag
str.replace(/\d+/g, "X"); // replace all numbers`},
    {type:'heading',content:'Regex Patterns and Character Classes'},
    {type:'example',title:'Special characters and patterns',content:'Character classes like [a-z] match any character in that range. Shorthand classes \\d (digit), \\w (word character), \\s (whitespace) save you from writing the full range. Quantifiers control how many times something must appear: + means one or more, * means zero or more, {2,4} means between 2 and 4 times. Anchors ^ and $ pin the match to the start or end of the string. Capture groups () extract specific parts of the match.',language:'javascript',code:`// Character classes
/[abc]/       // a, b, or c
/[a-z]/       // any lowercase letter
/[A-Z]/       // any uppercase letter
/[0-9]/       // any digit (same as \d)
/[a-zA-Z0-9]/ // alphanumeric
/[^abc]/       // NOT a, b, or c (negation)

// Shorthand character classes
/\d/ // digit [0-9]
/\D/ // non-digit [^0-9]
/\w/ // word character [a-zA-Z0-9_]
/\W/ // non-word character
/\s/ // whitespace (space, tab, newline)
/\S/ // non-whitespace
/./  // any character except newline

// Quantifiers
/a*/   // 0 or more a's
/a+/   // 1 or more a's
/a?/   // 0 or 1 a (optional)
/a{3}/ // exactly 3 a's
/a{2,4}/ // 2 to 4 a's
/a{2,}/  // 2 or more a's

// Anchors
/^hello/  // starts with "hello"
/world$/  // ends with "world"
/^hello$/ // exactly "hello"
/\bhello\b/ // whole word "hello"

// Groups and capture
/(hello)/     // capture group 1
/(?:hello)/   // non-capturing group
/(hello)(world)/ // two capture groups
/(?<year>\d{4})-(?<month>\d{2})/ // named capture groups`},
    {type:'heading',content:'Real-World Validation Patterns'},
    {type:'example',title:'Common validation regexes',content:'These are the regex patterns used in real-world form validation. The email regex checks for the user@domain.tld structure. The password regex uses lookaheads (?=...) - these are zero-width assertions that check "the string contains at least one lowercase/uppercase/digit" without consuming characters. Named capture groups (?<year>...) extract date parts directly by name instead of by index number.',language:'javascript',code:`// Email validation
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
emailRegex.test("user@example.com");    // true
emailRegex.test("invalid.email");       // false

// Password (min 8 chars, uppercase, lowercase, number)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
passwordRegex.test("Password123");      // true
passwordRegex.test("weak");             // false

// Phone number (various formats)
const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
phoneRegex.test("+1-555-0123");         // true

// URL
const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
urlRegex.test("https://example.com");   // true

// Extract capture groups
const dateStr = "2026-08-17";
const dateRegex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const { year, month, day } = dateStr.match(dateRegex).groups;
console.log(year, month, day); // "2026" "08" "17"

// Replace with function (powerful!)
const text = "Hello WORLD foo BAR";
const result = text.replace(/[A-Z]+/g, match => match.toLowerCase());
console.log(result); // "Hello world foo bar"

// Tokenize a string
"  hello   world  foo  ".trim().split(/\s+/); // ["hello","world","foo"]`},
    {type:'tryit',title:'Try It: Regex Tester',
     html:`<div id="app">
  <h2>Regex Tester</h2>
  <div class="section">
    <label>Pattern: <code>/</code></label>
    <input id="pattern" value="[a-z]+" placeholder="Regex pattern"/>
    <code>/</code>
    <input id="flags" value="gi" placeholder="flags" style="width:60px"/>
    <button onclick="testRegex()">Test</button>
  </div>
  <div class="section">
    <label>Test String:</label>
    <textarea id="testStr" rows="3">Hello World 123 JavaScript foo BAR</textarea>
  </div>
  <div id="result"></div>
  <div class="section">
    <h3>Quick Validators</h3>
    <input id="emailTest" placeholder="test@email.com"/> <button onclick="testEmail()">Validate Email</button><br><br>
    <input id="passTest" type="password" placeholder="Password"/> <button onclick="testPass()">Validate Password</button>
    <p id="validResult"></p>
  </div>
</div>`,
     css:`#app{font-family:system-ui,sans-serif;padding:20px;max-width:500px;}
h2{color:#1e1e1e;}h3{font-size:14px;font-weight:700;color:#374151;margin:0 0 8px;}
label{font-size:13px;color:#374151;}code{font-size:16px;font-weight:700;}
.section{margin-bottom:12px;background:white;border:1px solid #e5e7eb;border-radius:10px;padding:14px;}
input{padding:8px 10px;border:1.5px solid #e5e7eb;border-radius:7px;font-size:14px;outline:none;font-family:monospace;}
#pattern{width:240px;} textarea{width:100%;padding:8px;border:1.5px solid #e5e7eb;border-radius:7px;font-size:14px;outline:none;box-sizing:border-box;font-family:inherit;resize:vertical;}
button{padding:8px 14px;background:#2563eb;color:white;border:none;border-radius:7px;cursor:pointer;font-size:13px;font-weight:600;margin-left:6px;}
#result{background:#0d1117;color:#e6edf3;padding:12px;border-radius:10px;font-family:monospace;font-size:12px;min-height:60px;white-space:pre-wrap;margin-bottom:12px;}
.hl{background:#f7df1e;color:#1e1e1e;border-radius:2px;}
p{margin:8px 0 0;font-size:13px;font-weight:600;}`,
     js:`function testRegex() {
  const str = document.getElementById('testStr').value;
  const pat = document.getElementById('pattern').value;
  const flags = document.getElementById('flags').value;
  const result = document.getElementById('result');
  try {
    const rx = new RegExp(pat, flags);
    const matches = str.match(rx) || [];
    let html = 'Pattern: /' + pat + '/' + flags + '\ ';
    html += 'Matches (' + matches.length + '): ' + JSON.stringify(matches) + '\ ';
    html += 'test(): ' + rx.test(str) + '\ ';
    result.textContent = html;
  } catch(e) { result.textContent = '❌ Invalid regex: ' + e.message; }
}

const emailRx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;
const passRx  = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$/;

function testEmail() {
  const v = document.getElementById('emailTest').value;
  const ok = emailRx.test(v);
  document.getElementById('validResult').innerHTML =
    ok ? '✅ <span style="color:#16a34a">Valid email!</span>' :
         '❌ <span style="color:#dc2626">Invalid email format</span>';
}
function testPass() {
  const v = document.getElementById('passTest').value;
  const ok = passRx.test(v);
  document.getElementById('validResult').innerHTML =
    ok ? '✅ <span style="color:#16a34a">Strong password!</span>' :
         '❌ <span style="color:#dc2626">Need 8+ chars, uppercase, lowercase, number</span>';
}`,mode:'full'},
  ],
  exercises:[{id:'rx-1',question:'What does the /g flag do in a regex?',type:'multiple-choice',options:['Makes the match case-insensitive','Returns all matches instead of just the first one','Makes the regex run faster','Searches only global variables'],correct:1,explanation:'The g (global) flag makes the regex find ALL matches in a string, not just the first one. Without g, str.match(/\d+/) returns the first number found. With g, str.match(/\d+/g) returns an array of all numbers.'}],
  quiz:[{id:'qrx1',question:'What is (?<name>...) in a regex?',options:['Optional group','Negative lookahead','A named capture group - accessible via match.groups.name','A non-capturing group'],correct:2,explanation:'(?<name>...) is a named capture group. The matched value is available at match.groups.name. Example: /(?<year>\\d{4})-(?<month>\\d{2})/.exec("2026-08") gives groups.year="2026" and groups.month="08".'}],
};
