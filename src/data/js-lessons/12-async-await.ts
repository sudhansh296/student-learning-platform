import type { JSLesson } from '../js-curriculum';

export const jsAsyncLesson: JSLesson = {
  id:'js-async-await',title:'Async/Await & Promises',slug:'async-await',
  chapter:'async',order:13,difficulty:'intermediate',readingTime:15,
  description:'Master asynchronous JavaScript - callbacks, Promises, async/await, error handling, and parallel execution.',
  sections:[
    {type:'text',content:'JavaScript runs one thing at a time (single-threaded). But many operations take time - fetching data, reading files, waiting for timers. Asynchronous JavaScript lets you start these operations and continue doing other things while waiting, instead of freezing the entire program.'},
    {type:'analogy',title:'Ordering food at a restaurant',content:'When you order food, you get a receipt (a Promise). You don\'t just stand frozen at the counter waiting - you go sit down (continue doing other things). When the food is ready, you are notified (Promise resolved). If the kitchen runs out of ingredients, you are told the bad news (Promise rejected). async/await is like a waiter who handles all this automatically so you don\'t have to manage receipts yourself.'},
    {type:'heading',content:'The Problem - Callback Hell'},
    {type:'example',title:'Why we need better async patterns',content:'Before Promises existed, the only way to do async work was callbacks - functions passed as arguments that get called when the operation finishes. The problem: when you need multiple async operations in sequence, each callback nests inside the previous one. This creates "callback hell" - deeply indented, hard-to-read code where error handling must be repeated at every level.',language:'javascript',code:`// CALLBACKS - old way - "callback hell"
getUser(1, function(user) {
  getPosts(user.id, function(posts) {
    getComments(posts[0].id, function(comments) {
      getLikes(comments[0].id, function(likes) {
        // Deeply nested - hard to read, hard to handle errors
        console.log(likes);
      }, errorHandler);
    }, errorHandler);
  }, errorHandler);
}, errorHandler);

// Each async operation requires a callback
// Error handling is repeated at every level
// Extremely hard to maintain and debug`},
    {type:'heading',content:'Promises - Better Async'},
    {type:'example',title:'Creating and consuming Promises',content:'A Promise is an object that represents a future value. It starts as "pending", then either "fulfills" with a value or "rejects" with an error. You chain .then() to handle success and .catch() to handle errors. The key advantage over callbacks: errors automatically bubble up the chain - you only need one .catch() at the end instead of error handling at every step.',language:'javascript',code:`// A Promise represents a future value - pending, fulfilled, or rejected
const promise = new Promise((resolve, reject) => {
  const success = Math.random() > 0.5;
  setTimeout(() => {
    if (success) {
      resolve({ id: 1, name: "Alex" }); // success
    } else {
      reject(new Error("User not found")); // failure
    }
  }, 1000);
});

// Consume with .then() and .catch()
promise
  .then(user => {
    console.log("Got user:", user.name);
    return user.name.toUpperCase(); // return value passes to next .then()
  })
  .then(upper => console.log("Uppercase:", upper))
  .catch(error => console.error("Error:", error.message))
  .finally(() => console.log("Always runs - for cleanup"));

// Promise shortcuts
Promise.resolve("immediate value").then(v => console.log(v));
Promise.reject(new Error("instant fail")).catch(e => console.log(e.message));`},
    {type:'heading',content:'async/await - Clearest Way to Write Async Code'},
    {type:'example',title:'async/await syntax',content:'async/await makes asynchronous code look and read like synchronous code. The async keyword marks a function as asynchronous. The await keyword pauses execution inside that function until the Promise resolves - but does NOT block the rest of the program. Wrap await calls in try/catch for error handling, just like synchronous code.',language:'javascript',code:`// async function always returns a Promise
// await pauses execution until the Promise resolves

async function fetchUser(id) {
  // await can only be used inside async functions
  const response = await fetch(\`https://jsonplaceholder.typicode.com/users/\${id}\`);

  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }

  const user = await response.json(); // parse JSON
  return user;
}

// Usage - call async function, get Promise back
async function displayUser() {
  try {
    const user = await fetchUser(1);
    console.log("Name:", user.name);
    console.log("Email:", user.email);
  } catch (error) {
    console.error("Failed:", error.message);
  }
}

displayUser();

// Top-level await (in ES modules)
// const user = await fetchUser(1);`},
    {type:'heading',content:'Error Handling'},
    {type:'example',title:'Proper error handling patterns',content:'In async functions, use try/catch exactly like you would with synchronous code. Check response.ok after every fetch call - a 404 or 500 response does NOT automatically throw an error, you must check manually. The finally block always runs - use it to hide loading spinners or close connections. Re-throw unexpected errors so they don\'t silently disappear.',language:'javascript',code:`// try/catch/finally
async function loadData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(\`HTTP \${res.status}: \${res.statusText}\`);
    const data = await res.json();
    return data;
  } catch (error) {
    if (error.name === "TypeError") {
      console.error("Network error - are you offline?");
    } else {
      console.error("API error:", error.message);
    }
    throw error; // re-throw so caller knows it failed
  } finally {
    console.log("Request complete (success or failure)");
  }
}

// Handling errors at the call site
async function main() {
  try {
    const users = await loadData("/api/users");
    const posts = await loadData("/api/posts");
    return { users, posts };
  } catch (error) {
    return { error: error.message };
  }
}`},
    {type:'heading',content:'Running Multiple Promises - Parallel vs Sequential'},
    {type:'example',title:'Promise.all and parallel execution',content:'Sequential awaits run one after another - each waits for the previous to finish. If each call takes 1 second, three calls take 3 seconds total. Promise.all() starts ALL promises simultaneously and waits for all to finish - three 1-second calls complete in 1 second total. Use Promise.allSettled() when you want all results even if some fail.',language:'javascript',code:`// SEQUENTIAL - each waits for the previous (slow!)
async function sequential() {
  console.time("sequential");
  const user  = await fetch("/api/user").then(r => r.json());    // wait 1s
  const posts = await fetch("/api/posts").then(r => r.json());   // wait 1s
  const todos = await fetch("/api/todos").then(r => r.json());   // wait 1s
  console.timeEnd("sequential"); // ~3000ms
}

// PARALLEL with Promise.all - all start simultaneously (fast!)
async function parallel() {
  console.time("parallel");
  const [user, posts, todos] = await Promise.all([
    fetch("/api/user").then(r => r.json()),
    fetch("/api/posts").then(r => r.json()),
    fetch("/api/todos").then(r => r.json()),
  ]);
  console.timeEnd("parallel"); // ~1000ms (3x faster!)
}

// Promise.allSettled - wait for all, don't fail if some reject
const results = await Promise.allSettled([
  fetch("/api/user").then(r => r.json()),
  fetch("/api/broken"),                    // this might fail
  fetch("/api/todos").then(r => r.json()),
]);
results.forEach(result => {
  if (result.status === "fulfilled") console.log("Success:", result.value);
  else console.log("Failed:", result.reason);
});

// Promise.race - resolve/reject with FIRST settled
const first = await Promise.race([
  fetch("/api/fast-server").then(r => r.json()),
  fetch("/api/slow-server").then(r => r.json()),
  new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 5000))
]);`},
    {type:'heading',content:'Real-World: Complete Fetch Pattern'},
    {type:'example',title:'Production-quality API utility',content:'Real apps use a shared api() helper so every request automatically includes the auth token and handles errors consistently. This avoids repeating the same headers and error checks in every component. The helper returns parsed JSON directly, so callers just await api("/url") and get the data - no boilerplate. Notice how the CRUD functions (getUser, createUser) are just one line each once the helper exists.',language:'javascript',code:`// Reusable API function used in every real project
async function api(url, options = {}) {
  const token = localStorage.getItem("authToken");
  const defaults = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { "Authorization": \`Bearer \${token}\` }),
    },
  };

  const response = await fetch(url, { ...defaults, ...options });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || \`HTTP \${response.status}\`);
  }

  // Handle empty responses (204 No Content)
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// CRUD operations
const getUser    = (id) => api(\`/api/users/\${id}\`);
const getUsers   = ()   => api("/api/users");
const createUser = (data) => api("/api/users", { method:"POST", body:JSON.stringify(data) });
const updateUser = (id, data) => api(\`/api/users/\${id}\`, { method:"PUT", body:JSON.stringify(data) });
const deleteUser = (id) => api(\`/api/users/\${id}\`, { method:"DELETE" });

// Usage in a React component
async function loadDashboard(userId) {
  const [user, posts, stats] = await Promise.all([
    getUser(userId),
    api(\`/api/users/\${userId}/posts\`),
    api(\`/api/users/\${userId}/stats\`),
  ]);
  return { user, posts, stats };
}`},
    {type:'tryit',title:'Weather Dashboard',
     html:`<div id="app">
  <div class="header">
    <h2>🌤 Weather Dashboard</h2>
    <p class="sub">async/await · loading states · error handling</p>
  </div>
  <div class="city-tabs" id="cityTabs"></div>
  <div id="main"></div>
</div>`,
     css:`*{box-sizing:border-box}body{font-family:system-ui,sans-serif;padding:16px;background:linear-gradient(135deg,#0f172a,#1e3a5f);min-height:100vh;margin:0;}
#app{max-width:520px;margin:0 auto;}
.header{text-align:center;color:white;margin-bottom:16px;}
h2{margin:0 0 4px;font-size:20px;}
.sub{margin:0;font-size:11px;color:#94a3b8;}
.city-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;justify-content:center;}
.city-btn{padding:7px 14px;border:1.5px solid rgba(255,255,255,.2);border-radius:999px;background:transparent;color:white;cursor:pointer;font-size:13px;font-weight:600;transition:all .15s;}
.city-btn.active{background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.5);}
.card{background:rgba(255,255,255,.1);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.15);border-radius:20px;padding:20px;color:white;}
.city-name{font-size:24px;font-weight:800;margin-bottom:2px;}
.condition{font-size:14px;color:#94a3b8;margin-bottom:16px;}
.temp-row{display:flex;align-items:center;gap:16px;margin-bottom:20px;}
.temp-main{font-size:56px;font-weight:800;line-height:1;}
.temp-feel{font-size:13px;color:#94a3b8;}
.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
.metric{background:rgba(255,255,255,.08);border-radius:12px;padding:10px;text-align:center;}
.metric-val{font-size:18px;font-weight:700;}
.metric-lbl{font-size:10px;color:#94a3b8;margin-top:2px;text-transform:uppercase;letter-spacing:.05em;}
.weather-icon{font-size:52px;line-height:1;}
.loading{text-align:center;padding:40px;color:rgba(255,255,255,.6);}
.spinner{font-size:32px;display:inline-block;animation:spin 1s linear infinite;}
@keyframes spin{to{transform:rotate(360deg)}}
.error-card{background:rgba(239,68,68,.15);border-color:rgba(239,68,68,.3);}
.forecast{display:flex;gap:6px;margin-top:14px;overflow-x:auto;padding-bottom:4px;}
.fday{background:rgba(255,255,255,.07);border-radius:10px;padding:8px 10px;text-align:center;flex-shrink:0;min-width:62px;}
.fday-name{font-size:10px;color:#94a3b8;margin-bottom:4px;}
.fday-icon{font-size:18px;}
.fday-temp{font-size:12px;font-weight:700;margin-top:2px;}`,
     js:`const cities = [
  { name:'New York', country:'US', lat:40.71, lon:-74.01 },
  { name:'London', country:'GB', lat:51.51, lon:-0.13 },
  { name:'Tokyo', country:'JP', lat:35.68, lon:139.69 },
  { name:'Sydney', country:'AU', lat:-33.87, lon:151.21 },
  { name:'Paris', country:'FR', lat:48.86, lon:2.35 },
];

const MOCK_DATA = {
  'New York':  { temp:22, feels:20, humidity:62, wind:14, uv:5, visibility:16, condition:'Partly Cloudy', icon:'⛅', forecast:[{d:'Mon',i:'☀',t:'24°'},{d:'Tue',i:'🌧',t:'18°'},{d:'Wed',i:'⛅',t:'21°'},{d:'Thu',i:'☀',t:'26°'},{d:'Fri',i:'🌤',t:'23°'}] },
  'London':    { temp:14, feels:12, humidity:78, wind:22, uv:2, visibility:10, condition:'Overcast',       icon:'☁',  forecast:[{d:'Mon',i:'🌧',t:'12°'},{d:'Tue',i:'☁',t:'14°'},{d:'Wed',i:'🌦',t:'15°'},{d:'Thu',i:'☁',t:'13°'},{d:'Fri',i:'⛅',t:'16°'}] },
  'Tokyo':     { temp:28, feels:31, humidity:80, wind:8,  uv:7, visibility:20, condition:'Humid & Sunny',  icon:'☀',  forecast:[{d:'Mon',i:'⛅',t:'27°'},{d:'Tue',i:'🌦',t:'24°'},{d:'Wed',i:'☀',t:'30°'},{d:'Thu',i:'☀',t:'29°'},{d:'Fri',i:'⛅',t:'26°'}] },
  'Sydney':    { temp:19, feels:17, humidity:55, wind:18, uv:4, visibility:25, condition:'Clear Sky',      icon:'🌤', forecast:[{d:'Mon',i:'☀',t:'22°'},{d:'Tue',i:'🌤',t:'20°'},{d:'Wed',i:'⛅',t:'18°'},{d:'Thu',i:'🌧',t:'15°'},{d:'Fri',i:'🌤',t:'21°'}] },
  'Paris':     { temp:17, feels:15, humidity:70, wind:10, uv:3, visibility:18, condition:'Light Drizzle',  icon:'🌦', forecast:[{d:'Mon',i:'🌧',t:'14°'},{d:'Tue',i:'🌦',t:'16°'},{d:'Wed',i:'⛅',t:'18°'},{d:'Thu',i:'☀',t:'20°'},{d:'Fri',i:'⛅',t:'17°'}] },
};

let activeCity = 'New York';

function fakeDelay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchWeather(cityName) {
  setLoading();
  await fakeDelay(700 + Math.random() * 400);
  if (!MOCK_DATA[cityName]) throw new Error('City not found');
  return MOCK_DATA[cityName];
}

function setLoading() {
  document.getElementById('main').innerHTML =
    '<div class="card loading"><div class="spinner">⏳</div><br>Fetching weather data...<br><small style="color:#64748b">async/await in action</small></div>';
}

async function loadCity(cityName) {
  activeCity = cityName;
  renderTabs();
  try {
    const w = await fetchWeather(cityName);
    const forecast = w.forecast.map(f => '<div class="fday"><div class="fday-name">'+f.d+'</div><div class="fday-icon">'+f.i+'</div><div class="fday-temp">'+f.t+'</div></div>').join('');
    document.getElementById('main').innerHTML =
      '<div class="card">' +
        '<div class="city-name">'+cityName+'</div>' +
        '<div class="condition">'+w.condition+'</div>' +
        '<div class="temp-row">' +
          '<div><div class="temp-main">'+w.temp+'°C</div><div class="temp-feel">Feels like '+w.feels+'°C</div></div>' +
          '<div class="weather-icon">'+w.icon+'</div>' +
        '</div>' +
        '<div class="metrics">' +
          '<div class="metric"><div class="metric-val">'+w.humidity+'%</div><div class="metric-lbl">Humidity</div></div>' +
          '<div class="metric"><div class="metric-val">'+w.wind+'</div><div class="metric-lbl">Wind km/h</div></div>' +
          '<div class="metric"><div class="metric-val">'+w.uv+'</div><div class="metric-lbl">UV Index</div></div>' +
          '<div class="metric"><div class="metric-val">'+w.visibility+'</div><div class="metric-lbl">Visib km</div></div>' +
        '</div>' +
        '<div class="forecast">'+forecast+'</div>' +
      '</div>';
  } catch(e) {
    document.getElementById('main').innerHTML = '<div class="card error-card"><b>❌ Error: '+e.message+'</b><br><small style="color:#fca5a5">Check your async error handling</small></div>';
  }
}

function renderTabs() {
  document.getElementById('cityTabs').innerHTML = cities.map(c =>
    '<button class="city-btn'+(c.name===activeCity?' active':'')+'" onclick="loadCity(&apos;'+c.name+'&apos;)">'+c.name+'</button>'
  ).join('');
}

window.loadCity = loadCity;
renderTabs();
loadCity('New York');`,mode:'full'},
  ],
  exercises:[
    {id:'as-1',question:'What does an async function always return?',type:'multiple-choice',options:['A regular value','A Promise','undefined','A callback'],correct:1,explanation:'Every async function automatically wraps its return value in a Promise. Even if you return a plain number, the caller receives Promise.resolve(42). This allows using .then() or await on any async function call.'},
    {id:'as-2',question:'How do you run 3 API calls simultaneously instead of one after another?',type:'multiple-choice',options:['Use three sequential awaits','Promise.all([call1, call2, call3])','Use setTimeout','You cannot - JS is single-threaded'],correct:1,explanation:'Promise.all() starts all promises simultaneously and waits for all to complete. This can be 2-3x faster than sequential awaits. The results are returned as an array in the same order.'},
  ],
  quiz:[
    {id:'qas1',question:'What is the difference between Promise.all() and Promise.allSettled()?',options:['No difference','Promise.all() fails fast if any promise rejects; allSettled waits for all and reports each result','allSettled is faster','Promise.all only works with 3 promises'],correct:1,explanation:'Promise.all() rejects immediately if any promise rejects (fail-fast). Promise.allSettled() waits for all promises regardless, reporting {status:"fulfilled",value} or {status:"rejected",reason} for each.'},
    {id:'qas2',question:'Where can you use the await keyword?',options:['Anywhere in JavaScript','Only inside async functions or at the top level of ES modules','Only in try/catch blocks','Only for fetch()'],correct:1,explanation:'await can only be used inside async functions. The exception is top-level await in ES modules (supported in modern browsers and Node.js 14.8+). Using await outside async throws a SyntaxError.'},
  ],
};
