import type { JSLesson } from '../js-curriculum';
export const jsDatesLesson: JSLesson = {
  id:'js-dates',title:'Dates & Times',slug:'dates',chapter:'basics',order:23,difficulty:'beginner',readingTime:10,
  description:'Work with dates and times using the Date object - create, format, compare, and calculate time differences.',
  sections:[
    {type:'text',content:'The JavaScript Date object represents a single point in time stored as milliseconds since January 1, 1970 UTC (Unix epoch). Dates are tricky - timezones, formatting, and calculations all have gotchas. Modern projects often use a library like date-fns or dayjs, but understanding the native Date object is essential.'},
    {type:'heading',content:'Creating Dates'},
    {type:'example',title:'All ways to create a Date',content:'new Date() with no arguments gives you right now. The most reliable way to create a specific date is from an ISO 8601 string: "2026-08-17T14:30:00Z". Be careful creating dates from (year, month, day) - months are 0-indexed (0=January, 11=December). Date.now() returns raw milliseconds and is the fastest way to get the current timestamp for measuring performance.',language:'javascript',code:`// Current date and time
const now = new Date();
console.log(now); // 2026-08-17T...

// From string (ISO 8601 - recommended format)
const d1 = new Date("2026-08-17");           // date only
const d2 = new Date("2026-08-17T14:30:00");  // date + time
const d3 = new Date("2026-08-17T14:30:00Z"); // UTC

// From year, month, day (month is 0-indexed! Jan=0, Dec=11)
const d4 = new Date(2026, 7, 17);           // Aug 17 2026 (month=7)
const d5 = new Date(2026, 7, 17, 14, 30, 0); // Aug 17 2026 14:30:00

// From milliseconds (Unix timestamp * 1000)
const d6 = new Date(0);           // Jan 1 1970
const d7 = new Date(1723896000000); // some date

// Date.now() - current time as milliseconds (fastest!)
const ms = Date.now();
console.log(ms); // e.g. 1723896000000`},
    {type:'heading',content:'Getting Date Parts'},
    {type:'example',title:'Extracting date/time components',content:'Each getter method returns one piece of the date. Remember getMonth() returns 0-11 (add 1 to display it). getDay() returns 0-6 where 0 is Sunday. getDate() (not getDay) gives the day of the month. Set methods let you change individual parts - setDate(getDate() + 7) adds exactly one week to any date.',language:'javascript',code:`const d = new Date("2026-08-17T14:30:45");

// Get methods (LOCAL time)
d.getFullYear();    // 2026
d.getMonth();       // 7 (August - 0-indexed!)
d.getDate();        // 17 (day of month, 1-31)
d.getDay();         // 1 (Monday - 0=Sun, 1=Mon, 6=Sat)
d.getHours();       // 14
d.getMinutes();     // 30
d.getSeconds();     // 45
d.getMilliseconds(); // 0
d.getTime();        // milliseconds since epoch

// UTC versions
d.getUTCFullYear();
d.getUTCHours(); // hours in UTC timezone

// Setting date parts
const date = new Date();
date.setFullYear(2030);
date.setMonth(11); // December
date.setDate(25);  // 25th
// Result: December 25, 2030`},
    {type:'heading',content:'Formatting Dates'},
    {type:'example',title:'Converting dates to strings',content:'toISOString() is the best format for storing dates in databases or sending them over APIs - it is always UTC and universally parseable. For displaying dates to users, use Intl.DateTimeFormat which respects the user\'s locale and timezone. Different locales format dates very differently - American MM/DD/YYYY vs German DD.MM.YYYY vs Japanese YYYY/MM/DD.',language:'javascript',code:`const d = new Date("2026-08-17T14:30:00");

// Built-in methods
d.toString();         // "Mon Aug 17 2026 14:30:00 GMT+0000"
d.toDateString();     // "Mon Aug 17 2026"
d.toTimeString();     // "14:30:00 GMT+0000"
d.toISOString();      // "2026-08-17T14:30:00.000Z" ← use this for APIs/storage
d.toLocaleDateString(); // "8/17/2026" (locale-dependent)
d.toLocaleTimeString(); // "2:30:00 PM" (locale-dependent)
d.toLocaleString();     // "8/17/2026, 2:30:00 PM"

// Intl.DateTimeFormat - best for user-facing dates
const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric", month: "long", day: "numeric",
  hour: "2-digit", minute: "2-digit", timeZoneName: "short"
});
formatter.format(d); // "August 17, 2026 at 02:30 PM GMT"

// Different locales
new Intl.DateTimeFormat("de-DE").format(d); // "17.8.2026" (German)
new Intl.DateTimeFormat("ja-JP").format(d); // "2026/8/17" (Japanese)

// Manual formatting
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth()+1).padStart(2,'0');
  const day = String(date.getDate()).padStart(2,'0');
  return \`\${y}-\${m}-\${day}\`; // "2026-08-17"
}`},
    {type:'heading',content:'Date Calculations'},
    {type:'example',title:'Time differences and date math',content:'Date objects support subtraction - subtracting two dates gives you the difference in milliseconds. Divide by 1000 for seconds, by 86400000 for days. To add days to a date, clone it first (new Date(date)) so you do not mutate the original, then use setDate(getDate() + n). Always compare dates using < or > or getTime() - never use == because two different Date objects are never reference-equal.',language:'javascript',code:`// Time difference in milliseconds
const start = new Date("2026-01-01");
const end   = new Date("2026-08-17");
const diffMs = end - start; // milliseconds difference

// Convert to useful units
const seconds = Math.floor(diffMs / 1000);
const minutes = Math.floor(diffMs / (1000 * 60));
const hours   = Math.floor(diffMs / (1000 * 60 * 60));
const days    = Math.floor(diffMs / (1000 * 60 * 60 * 24));
console.log(days); // 228 days

// Add days to a date
function addDays(date, n) {
  const result = new Date(date);
  result.setDate(result.getDate() + n);
  return result;
}
const tomorrow = addDays(new Date(), 1);
const nextWeek = addDays(new Date(), 7);

// Check if date is in the past
const deadline = new Date("2026-12-31");
const isPast = deadline < new Date();

// Compare dates
const a = new Date("2026-01-01");
const b = new Date("2026-06-15");
console.log(a < b);  // true
console.log(a > b);  // false
console.log(a.getTime() === b.getTime()); // false

// Days until a date
function daysUntil(targetDate) {
  const ms = new Date(targetDate) - new Date();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}
console.log(daysUntil("2027-01-01")); // days until new year`},
    {type:'tryit',title:'Try It: Date Calculator',
     html:`<div id="app">
  <h2>Date & Time Tools</h2>
  <div class="section">
    <h3>Current Date & Time</h3>
    <div id="clock"></div>
  </div>
  <div class="section">
    <h3>Days Between Dates</h3>
    <div class="row">
      <input type="date" id="d1" value="2026-01-01"/>
      <span>to</span>
      <input type="date" id="d2"/>
      <button onclick="calcDiff()">Calculate</button>
    </div>
    <p id="diff-result"></p>
  </div>
  <div class="section">
    <h3>Days Until...</h3>
    <input type="date" id="future"/>
    <button onclick="calcUntil()">Days Until</button>
    <p id="until-result"></p>
  </div>
</div>`,
     css:`#app{font-family:system-ui,sans-serif;padding:20px;max-width:460px;}
h2{color:#1e1e1e;}h3{font-size:14px;font-weight:700;color:#374151;margin:0 0 10px;}
.section{background:white;border:1px solid #e5e7eb;border-radius:12px;padding:14px;margin-bottom:12px;}
.row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
input[type=date]{padding:8px 10px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:13px;outline:none;}
button{padding:8px 14px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;}
#clock{font-size:20px;font-weight:700;color:#2563eb;font-family:monospace;}
p{margin:8px 0 0;font-size:14px;font-weight:600;color:#374151;}`,
     js:`// Live clock
function updateClock() {
  const now = new Date();
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  document.getElementById('clock').textContent =
    days[now.getDay()] + ', ' +
    now.toLocaleDateString() + ' ' +
    now.toLocaleTimeString();
}
updateClock(); setInterval(updateClock, 1000);

// Set today as default for d2
document.getElementById('d2').value = new Date().toISOString().split('T')[0];

function calcDiff() {
  const a = new Date(document.getElementById('d1').value);
  const b = new Date(document.getElementById('d2').value);
  const days = Math.round((b-a)/(1000*60*60*24));
  document.getElementById('diff-result').textContent =
    Math.abs(days) + ' days ' + (days >= 0 ? 'between' : 'difference (reversed)');
}

function calcUntil() {
  const target = new Date(document.getElementById('future').value);
  const days = Math.ceil((target - new Date())/(1000*60*60*24));
  document.getElementById('until-result').textContent =
    days > 0 ? days + ' days until then' :
    days === 0 ? 'That is today!' :
    Math.abs(days) + ' days ago';
}`,mode:'full'},
  ],
  exercises:[{id:'dt1',question:'JavaScript months in the Date object are 0-indexed. What month is new Date(2026, 0, 1)?',type:'multiple-choice',options:['December 1','January 1','February 1','Month 0 (invalid)'],correct:1,explanation:'JavaScript Date months are 0-indexed: 0=January, 1=February, ..., 11=December. new Date(2026, 0, 1) is January 1, 2026. This is one of the most common Date gotchas.'}],
  quiz:[{id:'dq1',question:'What is the best format to store/transmit dates between systems?',options:['MM/DD/YYYY','timestamp only','ISO 8601 string (date.toISOString()): 2026-08-17T14:30:00.000Z','Human readable string'],correct:2,explanation:'ISO 8601 (toISOString()) is universal, timezone-aware (Z=UTC), sortable alphabetically, and parseable by all languages and databases. Use this format in APIs, databases, and localStorage.'}],
};
