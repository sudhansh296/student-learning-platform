import type { Project } from './types';

const indexHtml = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QuizMaster - Web Dev Quiz</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="app">

    <!-- Home Screen -->
    <div id="screen-home" class="screen active">
      <div class="home-card">
        <div class="home-logo">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="14" fill="#7c3aed"/>
            <path d="M16 18h16M16 24h10M16 30h13" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="35" cy="30" r="6" fill="#fbbf24"/>
            <path d="M33 30l1.5 1.5L37 28" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="home-title">QuizMaster</span>
        </div>
        <p class="home-sub">Test your Web Development knowledge</p>

        <div class="config-section">
          <div class="config-row">
            <label class="config-label">Category</label>
            <select id="catSelect" class="select-field">
              <option value="all">All Topics</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="javascript">JavaScript</option>
              <option value="general">General Web Dev</option>
            </select>
          </div>
          <div class="config-row">
            <label class="config-label">Difficulty</label>
            <div class="diff-tabs" id="diffTabs">
              <button class="diff-tab active" data-diff="all">All</button>
              <button class="diff-tab" data-diff="easy">Easy</button>
              <button class="diff-tab" data-diff="medium">Medium</button>
              <button class="diff-tab" data-diff="hard">Hard</button>
            </div>
          </div>
          <div class="config-row">
            <label class="config-label">Questions</label>
            <div class="diff-tabs" id="countTabs">
              <button class="diff-tab active" data-count="10">10</button>
              <button class="diff-tab" data-count="15">15</button>
              <button class="diff-tab" data-count="20">20</button>
            </div>
          </div>
          <div class="config-row">
            <label class="config-label">Timer per Q</label>
            <div class="diff-tabs" id="timerTabs">
              <button class="diff-tab" data-timer="15">15s</button>
              <button class="diff-tab active" data-timer="20">20s</button>
              <button class="diff-tab" data-timer="30">30s</button>
              <button class="diff-tab" data-timer="0">No Limit</button>
            </div>
          </div>
        </div>

        <button class="btn-start" id="startBtn">Start Quiz</button>

        <div class="best-score-row" id="bestScoreRow" style="display:none;">
          <span class="best-label">Best Score:</span>
          <span class="best-val" id="bestScoreVal"></span>
        </div>
      </div>
    </div>

    <!-- Quiz Screen -->
    <div id="screen-quiz" class="screen">
      <div class="quiz-top">
        <div class="quiz-meta">
          <span class="q-counter" id="qCounter">1 / 10</span>
          <span class="q-category" id="qCategory"></span>
          <span class="q-diff" id="qDiff"></span>
        </div>
        <div class="timer-wrap" id="timerWrap">
          <svg class="timer-ring" width="44" height="44" viewBox="0 0 44 44">
            <circle class="timer-bg" cx="22" cy="22" r="18" fill="none" stroke-width="3"/>
            <circle class="timer-arc" id="timerArc" cx="22" cy="22" r="18" fill="none" stroke-width="3"
              stroke-dasharray="113" stroke-dashoffset="0" stroke-linecap="round"
              transform="rotate(-90 22 22)"/>
          </svg>
          <span class="timer-num" id="timerNum">20</span>
        </div>
      </div>

      <div class="progress-bar-wrap">
        <div class="progress-bar-track">
          <div class="progress-bar-fill" id="progressBar"></div>
        </div>
      </div>

      <div class="question-card" id="questionCard">
        <p class="question-text" id="questionText"></p>
        <div class="options-grid" id="optionsGrid"></div>
        <div class="feedback-row" id="feedbackRow" style="display:none;">
          <div class="feedback-box" id="feedbackBox"></div>
        </div>
        <button class="btn-next" id="nextBtn" style="display:none;">Next Question</button>
      </div>
    </div>

    <!-- Results Screen -->
    <div id="screen-results" class="screen">
      <div class="results-card">
        <div class="result-icon" id="resultIcon"></div>
        <h2 class="result-title" id="resultTitle"></h2>
        <p class="result-sub" id="resultSub"></p>

        <div class="score-ring-wrap">
          <svg width="130" height="130" viewBox="0 0 130 130">
            <circle cx="65" cy="65" r="55" fill="none" stroke="#e2e8f0" stroke-width="10"/>
            <circle id="scoreArc" cx="65" cy="65" r="55" fill="none" stroke="#7c3aed" stroke-width="10"
              stroke-linecap="round" stroke-dasharray="345.4"
              stroke-dashoffset="345.4" transform="rotate(-90 65 65)"
              style="transition: stroke-dashoffset 1s ease;"/>
          </svg>
          <div class="score-center">
            <span class="score-pct" id="scorePct">0%</span>
            <span class="score-label-sm">score</span>
          </div>
        </div>

        <div class="stats-row">
          <div class="stat-box">
            <span class="stat-n correct-col" id="resCorrect">0</span>
            <span class="stat-l">Correct</span>
          </div>
          <div class="stat-box">
            <span class="stat-n wrong-col" id="resWrong">0</span>
            <span class="stat-l">Wrong</span>
          </div>
          <div class="stat-box">
            <span class="stat-n skip-col" id="resSkipped">0</span>
            <span class="stat-l">Skipped</span>
          </div>
          <div class="stat-box">
            <span class="stat-n time-col" id="resTime">0s</span>
            <span class="stat-l">Avg Time</span>
          </div>
        </div>

        <div class="result-btns">
          <button class="btn-review" id="reviewBtn">Review Answers</button>
          <button class="btn-start" id="playAgainBtn">Play Again</button>
        </div>
      </div>
    </div>

    <!-- Review Screen -->
    <div id="screen-review" class="screen">
      <div class="review-header">
        <button class="btn-back" id="backBtn">Back to Results</button>
        <h2 class="review-title">Answer Review</h2>
      </div>
      <div class="review-list" id="reviewList"></div>
    </div>

  </div>
  <script src="script.js"></script>
</body>
</html>`;

const styleCss = `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#f5f3ff;--surface:#fff;--surface2:#f8f7ff;--border:#e4e1f5;
  --text:#1e1b4b;--muted:#6b7280;--soft:#9ca3af;
  --accent:#7c3aed;--accent2:#6d28d9;--accent-light:#ede9fe;
  --correct:#16a34a;--correct-light:#f0fdf4;--correct-border:#bbf7d0;
  --wrong:#dc2626;--wrong-light:#fef2f2;--wrong-border:#fecaca;
  --shadow:0 1px 3px rgba(0,0,0,0.08);--shadow-md:0 4px 16px rgba(0,0,0,0.10);
  --radius:12px;--radius-sm:8px;--tr:0.18s ease;
}
[data-theme="dark"]{
  --bg:#13111e;--surface:#1e1b2e;--surface2:#261f3a;--border:#312a52;
  --text:#f1f0ff;--muted:#a09db8;--soft:#6b6882;--accent-light:#2e1f5e;
  --correct-light:#052e16;--correct-border:#166534;
  --wrong-light:#450a0a;--wrong-border:#991b1b;
}
body{font-family:system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;transition:background var(--tr),color var(--tr);}
.app{max-width:680px;margin:0 auto;padding:20px 16px;}
.screen{display:none;}.screen.active{display:block;}

/* HOME */
.home-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:32px 28px;box-shadow:var(--shadow-md);}
.home-logo{display:flex;align-items:center;gap:12px;margin-bottom:6px;}
.home-title{font-size:1.6rem;font-weight:900;color:var(--text);letter-spacing:-0.5px;}
.home-sub{color:var(--muted);font-size:0.9rem;margin-bottom:28px;}
.config-section{display:flex;flex-direction:column;gap:16px;margin-bottom:28px;}
.config-row{display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
.config-label{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;min-width:90px;}
.select-field{padding:7px 10px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:13px;font-family:inherit;background:var(--surface2);color:var(--text);outline:none;cursor:pointer;}
.select-field:focus{border-color:var(--accent);}
.diff-tabs{display:flex;gap:4px;flex-wrap:wrap;}
.diff-tab{padding:5px 13px;border:1.5px solid var(--border);border-radius:99px;font-size:12px;font-weight:700;cursor:pointer;background:transparent;color:var(--muted);transition:all var(--tr);}
.diff-tab.active{background:var(--accent);border-color:var(--accent);color:#fff;}
.diff-tab:not(.active):hover{border-color:var(--accent);color:var(--accent);}
.btn-start{width:100%;padding:13px;background:linear-gradient(135deg,var(--accent),#a21caf);border:none;border-radius:var(--radius-sm);color:#fff;font-size:1rem;font-weight:800;cursor:pointer;transition:opacity var(--tr),transform var(--tr);}
.btn-start:hover{opacity:.9;}.btn-start:active{transform:scale(.98);}
.best-score-row{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:14px;font-size:13px;}
.best-label{color:var(--muted);}.best-val{font-weight:800;color:var(--accent);}

/* QUIZ TOP */
.quiz-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
.quiz-meta{display:flex;align-items:center;gap:10px;}
.q-counter{font-size:13px;font-weight:800;color:var(--muted);}
.q-category{font-size:11px;font-weight:700;padding:2px 8px;border-radius:99px;background:var(--accent-light);color:var(--accent);border:1px solid var(--border);}
.q-diff{font-size:11px;font-weight:700;padding:2px 8px;border-radius:99px;border:1px solid transparent;}
.q-diff.easy{background:#f0fdf4;color:#16a34a;border-color:#bbf7d0;}
.q-diff.medium{background:#fffbeb;color:#d97706;border-color:#fde68a;}
.q-diff.hard{background:#fef2f2;color:#dc2626;border-color:#fecaca;}
.timer-wrap{position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center;}
.timer-bg{stroke:#e2e8f0;}.timer-arc{stroke:var(--accent);transition:stroke-dashoffset .9s linear,stroke var(--tr);}
.timer-arc.urgent{stroke:#dc2626;}
.timer-num{position:absolute;font-size:12px;font-weight:800;color:var(--text);}
.progress-bar-wrap{margin-bottom:16px;}
.progress-bar-track{height:5px;background:var(--border);border-radius:99px;overflow:hidden;}
.progress-bar-fill{height:100%;background:linear-gradient(90deg,var(--accent),#a21caf);border-radius:99px;transition:width .4s ease;}

/* QUESTION CARD */
.question-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:24px;box-shadow:var(--shadow-md);}
.question-text{font-size:1.05rem;font-weight:700;color:var(--text);line-height:1.55;margin-bottom:20px;}
.options-grid{display:flex;flex-direction:column;gap:9px;margin-bottom:14px;}
.option-btn{width:100%;text-align:left;padding:12px 16px;border:2px solid var(--border);border-radius:var(--radius-sm);font-size:14px;font-weight:500;background:var(--surface2);color:var(--text);cursor:pointer;transition:all var(--tr);display:flex;align-items:center;gap:10px;}
.option-btn .opt-letter{width:24px;height:24px;border-radius:50%;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0;transition:all var(--tr);}
.option-btn:hover:not(:disabled){border-color:var(--accent);background:var(--accent-light);}
.option-btn:hover:not(:disabled) .opt-letter{border-color:var(--accent);color:var(--accent);}
.option-btn.selected{border-color:var(--accent);background:var(--accent-light);}
.option-btn.correct{border-color:var(--correct);background:var(--correct-light);}
.option-btn.correct .opt-letter{background:var(--correct);border-color:var(--correct);color:#fff;}
.option-btn.wrong{border-color:var(--wrong);background:var(--wrong-light);}
.option-btn.wrong .opt-letter{background:var(--wrong);border-color:var(--wrong);color:#fff;}
.option-btn:disabled{cursor:default;}
.feedback-row{margin-bottom:14px;}
.feedback-box{padding:10px 14px;border-radius:var(--radius-sm);font-size:13px;font-weight:600;border:1px solid transparent;}
.feedback-box.correct{background:var(--correct-light);color:var(--correct);border-color:var(--correct-border);}
.feedback-box.wrong{background:var(--wrong-light);color:var(--wrong);border-color:var(--wrong-border);}
.btn-next{width:100%;padding:11px;background:var(--accent);border:none;border-radius:var(--radius-sm);color:#fff;font-size:14px;font-weight:800;cursor:pointer;transition:opacity var(--tr);}
.btn-next:hover{opacity:.88;}

/* RESULTS */
.results-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:32px 24px;text-align:center;box-shadow:var(--shadow-md);}
.result-icon{font-size:3rem;margin-bottom:8px;}
.result-title{font-size:1.5rem;font-weight:900;margin-bottom:6px;}
.result-sub{color:var(--muted);font-size:.9rem;margin-bottom:24px;}
.score-ring-wrap{position:relative;width:130px;height:130px;margin:0 auto 24px;}
.score-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.score-pct{font-size:1.8rem;font-weight:900;color:var(--accent);}
.score-label-sm{font-size:11px;color:var(--muted);font-weight:700;text-transform:uppercase;}
.stats-row{display:flex;gap:10px;justify-content:center;margin-bottom:24px;flex-wrap:wrap;}
.stat-box{display:flex;flex-direction:column;align-items:center;gap:3px;padding:12px 16px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface2);min-width:72px;}
.stat-n{font-size:1.3rem;font-weight:900;}.stat-l{font-size:11px;color:var(--muted);font-weight:600;}
.correct-col{color:var(--correct);}.wrong-col{color:var(--wrong);}.skip-col{color:var(--muted);}.time-col{color:var(--accent);}
.result-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;}
.btn-review{padding:11px 24px;border:2px solid var(--accent);border-radius:var(--radius-sm);background:transparent;color:var(--accent);font-size:14px;font-weight:800;cursor:pointer;transition:all var(--tr);}
.btn-review:hover{background:var(--accent-light);}

/* REVIEW */
.review-header{display:flex;align-items:center;gap:14px;margin-bottom:20px;}
.btn-back{padding:7px 14px;border:1.5px solid var(--border);border-radius:var(--radius-sm);background:transparent;color:var(--muted);font-size:13px;font-weight:700;cursor:pointer;transition:all var(--tr);}
.btn-back:hover{border-color:var(--accent);color:var(--accent);}
.review-title{font-size:1.1rem;font-weight:800;}
.review-list{display:flex;flex-direction:column;gap:14px;}
.review-item{padding:16px;border-radius:var(--radius);border:1px solid var(--border);background:var(--surface);}
.review-item.correct{border-left:3px solid var(--correct);}
.review-item.wrong{border-left:3px solid var(--wrong);}
.review-item.skipped{border-left:3px solid var(--soft);}
.review-q{font-size:14px;font-weight:700;margin-bottom:10px;color:var(--text);}
.review-options{display:flex;flex-direction:column;gap:5px;margin-bottom:8px;}
.review-opt{padding:7px 12px;border-radius:var(--radius-sm);font-size:13px;border:1px solid var(--border);}
.review-opt.correct-ans{background:var(--correct-light);border-color:var(--correct-border);color:var(--correct);font-weight:700;}
.review-opt.user-wrong{background:var(--wrong-light);border-color:var(--wrong-border);color:var(--wrong);}
.review-explanation{font-size:12px;color:var(--muted);line-height:1.5;padding:8px 10px;background:var(--surface2);border-radius:var(--radius-sm);}
@media(max-width:500px){.config-row{flex-direction:column;align-items:flex-start;}.diff-tabs{flex-wrap:wrap;}.stats-row{gap:6px;}.result-btns{flex-direction:column;}}`;

const scriptJs = `// =====================================================
// QuizMaster - Full Web Dev Quiz App
// Features: categories, difficulty, timer, score ring,
// review mode, best score, localStorage, dark mode
// =====================================================

// -- QUESTION BANK ------------------------------------
var QUESTIONS = [
  // HTML - Easy
  { id:1, cat:'html', diff:'easy', q:'What does HTML stand for?', opts:['HyperText Markup Language','HighText Machine Language','HyperText Machine Language','HyperText Marking Language'], ans:0, exp:'HTML stands for HyperText Markup Language — the standard language for creating web pages.' },
  { id:2, cat:'html', diff:'easy', q:'Which tag creates the largest heading in HTML?', opts:['<h6>','<heading>','<h1>','<head>'], ans:2, exp:'<h1> is the largest heading tag. Headings go from <h1> (largest) to <h6> (smallest).' },
  { id:3, cat:'html', diff:'easy', q:'Which attribute makes an input field required?', opts:['validate','mandatory','required','must'], ans:2, exp:'The required attribute prevents form submission if the field is empty.' },
  { id:4, cat:'html', diff:'easy', q:'Which tag is used to insert an image?', opts:['<picture>','<img>','<image>','<src>'], ans:1, exp:'<img> is a self-closing tag that embeds an image. Use the src attribute for the URL and alt for accessibility.' },
  { id:5, cat:'html', diff:'medium', q:'What is the correct HTML for creating a hyperlink?', opts:['<a url="http://x.com">Link</a>','<a href="http://x.com">Link</a>','<link href="http://x.com">Link</link>','<hyperlink>Link</hyperlink>'], ans:1, exp:'The <a> tag uses the href attribute to specify the URL destination.' },
  { id:6, cat:'html', diff:'medium', q:'Which HTML5 element is used for navigation links?', opts:['<navigate>','<nav>','<navigation>','<links>'], ans:1, exp:'<nav> is a semantic HTML5 element that groups navigation links, helping screen readers and search engines.' },
  { id:7, cat:'html', diff:'medium', q:'What does the <meta charset="UTF-8"> tag do?', opts:['Sets page width','Defines the character encoding','Sets the page title','Links a stylesheet'], ans:1, exp:'UTF-8 encoding supports virtually all characters and symbols worldwide. Always include this in <head>.' },
  { id:8, cat:'html', diff:'hard', q:'What is the difference between <section> and <div>?', opts:['No difference','<section> has semantic meaning for thematic content grouping, <div> is purely presentational','<div> is semantic, <section> is not','<section> is inline, <div> is block'], ans:1, exp:'<section> semantically groups related content with a theme. <div> is a generic container with no semantic meaning.' },
  { id:9, cat:'html', diff:'hard', q:'What attribute should every <img> have for accessibility?', opts:['title','class','alt','aria-label'], ans:2, exp:'The alt attribute provides alternative text for screen readers and displays when the image fails to load.' },
  // CSS - Easy
  { id:10, cat:'css', diff:'easy', q:'Which CSS property changes text color?', opts:['font-color','text-color','color','foreground-color'], ans:2, exp:'The color property sets the foreground color of text elements.' },
  { id:11, cat:'css', diff:'easy', q:'How do you center a block element horizontally with CSS?', opts:['text-align:center','align:center','margin:0 auto','position:center'], ans:2, exp:'margin: 0 auto on a block element with a defined width centers it within its container.' },
  { id:12, cat:'css', diff:'easy', q:'Which property controls the spacing inside an element\'s border?', opts:['margin','spacing','padding','border-spacing'], ans:2, exp:'padding controls the space between content and the element border. margin controls space outside the border.' },
  { id:13, cat:'css', diff:'medium', q:'What does "display: flex" do?', opts:['Makes elements invisible','Creates a flexible container for 1D layout','Creates a 2D grid layout','Positions elements absolutely'], ans:1, exp:'Flexbox is a 1D layout model. It arranges children in a row or column with powerful alignment options.' },
  { id:14, cat:'css', diff:'medium', q:'What is the CSS Box Model made of?', opts:['content, padding, margin','content, border, background','content, padding, border, margin','margin, spacing, border'], ans:2, exp:'Every HTML element is a box: content > padding > border > margin. This model determines how size and spacing work.' },
  { id:15, cat:'css', diff:'medium', q:'Which value of position removes an element from normal document flow?', opts:['relative','static','sticky','absolute'], ans:3, exp:'position: absolute removes the element from normal flow and positions it relative to the nearest positioned ancestor.' },
  { id:16, cat:'css', diff:'hard', q:'What does CSS specificity determine?', opts:['Load order of stylesheets','Which CSS rule applies when multiple rules target the same element','Font rendering quality','Animation performance'], ans:1, exp:'Specificity is calculated as inline > ID > class/attribute/pseudo-class > element. Higher specificity wins.' },
  { id:17, cat:'css', diff:'hard', q:'What is the difference between em and rem units?', opts:['No difference','em is relative to viewport, rem to root','em is relative to parent element font size, rem is relative to root element font size','rem is deprecated'], ans:2, exp:'em is relative to the parent element font size (can compound). rem is always relative to the root (<html>) font size, making it more predictable.' },
  // JavaScript - Easy
  { id:18, cat:'javascript', diff:'easy', q:'Which keyword declares a block-scoped variable in modern JavaScript?', opts:['var','let','both let and const','function'], ans:2, exp:'Both let and const are block-scoped. let allows reassignment; const does not. Use const by default.' },
  { id:19, cat:'javascript', diff:'easy', q:'What does === check in JavaScript?', opts:['Value only','Type only','Value and type (strict equality)','Reference equality'], ans:2, exp:'=== checks both value and type without coercion. Always prefer === over == to avoid unexpected type coercions.' },
  { id:20, cat:'javascript', diff:'easy', q:'How do you declare a function in JavaScript?', opts:['function myFn() {}','def myFn() {}','void myFn() {}','fn myFn() {}'], ans:0, exp:'Functions are declared with the function keyword. Arrow functions (const fn = () => {}) are also common in modern JS.' },
  { id:21, cat:'javascript', diff:'medium', q:'What does Array.map() return?', opts:['Modifies the original array','A new array with each element transformed by the callback','The first matching element','A boolean'], ans:1, exp:'map() creates a new array by calling the callback on each element. It never mutates the original array.' },
  { id:22, cat:'javascript', diff:'medium', q:'What is a Promise in JavaScript?', opts:['A guarantee to run code synchronously','An object representing the eventual success or failure of an async operation','A way to declare variables','A type of loop'], ans:1, exp:'Promises handle async operations. They can be pending, fulfilled, or rejected. Use .then()/.catch() or async/await.' },
  { id:23, cat:'javascript', diff:'medium', q:'What does the "this" keyword refer to in a regular function?', opts:['Always the global object','Always undefined','The object that called the function (call context)','The function itself'], ans:2, exp:'In regular functions, this refers to the calling object. Arrow functions do not have their own this — they inherit it from the enclosing scope.' },
  { id:24, cat:'javascript', diff:'hard', q:'What is event delegation in JavaScript?', opts:['Firing events on the document only','Attaching a single listener to a parent to handle events from children via bubbling','Preventing events from bubbling','Removing event listeners'], ans:1, exp:'Instead of adding listeners to many children, add one to the parent. Events bubble up and you check event.target to identify the source.' },
  { id:25, cat:'javascript', diff:'hard', q:'What is a closure in JavaScript?', opts:['A syntax error','A way to close browser tabs','A function that retains access to its outer scope variables even after the outer function has returned','A type of loop'], ans:2, exp:'Closures allow inner functions to "remember" variables from their outer scope. They power patterns like module pattern, memoization, and data privacy.' },
  // General - Mixed
  { id:26, cat:'general', diff:'easy', q:'What does CSS stand for?', opts:['Computer Style Sheets','Cascading Style Sheets','Creative Style System','Colorful Style Sheets'], ans:1, exp:'CSS stands for Cascading Style Sheets. The "cascading" refers to the priority rules that determine which styles apply.' },
  { id:27, cat:'general', diff:'easy', q:'What is a CDN?', opts:['Code Delivery Network','Content Delivery Network','Central Data Node','CSS Definition Network'], ans:1, exp:'A CDN distributes content from servers geographically close to users, reducing latency and load times.' },
  { id:28, cat:'general', diff:'medium', q:'What is the difference between GET and POST HTTP methods?', opts:['No difference','GET retrieves data (params in URL), POST sends data in request body','POST is faster than GET','GET is more secure than POST'], ans:1, exp:'GET is for fetching resources — params are visible in the URL. POST sends data in the body, used for creating/updating resources.' },
  { id:29, cat:'general', diff:'medium', q:'What does API stand for?', opts:['Application Programming Interface','Automated Protocol Integration','Application Process Input','Advanced Program Interface'], ans:0, exp:'An API defines how software components communicate. REST APIs use HTTP methods to transfer data, usually as JSON.' },
  { id:30, cat:'general', diff:'hard', q:'What is the difference between authentication and authorization?', opts:['They are the same','Authentication verifies who you are; authorization determines what you can access','Authorization verifies who you are; authentication determines access','Neither relates to security'], ans:1, exp:'Authentication (login) proves your identity. Authorization (permissions) determines what resources you can access after authentication.' },
];

// -- STATE ---------------------------------------------
var config = { cat:'all', diff:'all', count:10, timer:20 };
var session = { questions:[], idx:0, answers:[], timeTaken:[], timer:null, timeLeft:0, answered:false };
var bestScore = parseInt(localStorage.getItem('qm_best') || '0');

// -- INIT ----------------------------------------------
function init() {
  updateBestScore();
  attachHomeListeners();
  document.getElementById('startBtn').addEventListener('click', startQuiz);
  document.getElementById('nextBtn').addEventListener('click', nextQuestion);
  document.getElementById('playAgainBtn').addEventListener('click', goHome);
  document.getElementById('reviewBtn').addEventListener('click', showReview);
  document.getElementById('backBtn').addEventListener('click', showResults);
}

function updateBestScore() {
  bestScore = parseInt(localStorage.getItem('qm_best') || '0');
  var row = document.getElementById('bestScoreRow');
  if (bestScore > 0) {
    row.style.display = 'flex';
    document.getElementById('bestScoreVal').textContent = bestScore + '%';
  }
}

function attachHomeListeners() {
  // Difficulty tabs
  document.getElementById('diffTabs').addEventListener('click', function(e) {
    var btn = e.target.closest('.diff-tab');
    if (!btn) return;
    document.querySelectorAll('#diffTabs .diff-tab').forEach(function(t){t.classList.remove('active');});
    btn.classList.add('active');
    config.diff = btn.getAttribute('data-diff');
  });
  // Count tabs
  document.getElementById('countTabs').addEventListener('click', function(e) {
    var btn = e.target.closest('.diff-tab');
    if (!btn) return;
    document.querySelectorAll('#countTabs .diff-tab').forEach(function(t){t.classList.remove('active');});
    btn.classList.add('active');
    config.count = parseInt(btn.getAttribute('data-count'));
  });
  // Timer tabs
  document.getElementById('timerTabs').addEventListener('click', function(e) {
    var btn = e.target.closest('.diff-tab');
    if (!btn) return;
    document.querySelectorAll('#timerTabs .diff-tab').forEach(function(t){t.classList.remove('active');});
    btn.classList.add('active');
    config.timer = parseInt(btn.getAttribute('data-timer'));
  });
  // Category
  document.getElementById('catSelect').addEventListener('change', function() {
    config.cat = this.value;
  });
}

// -- FILTER & SHUFFLE ----------------------------------
function getQuestions() {
  var pool = QUESTIONS.slice();
  if (config.cat !== 'all') pool = pool.filter(function(q){return q.cat === config.cat;});
  if (config.diff !== 'all') pool = pool.filter(function(q){return q.diff === config.diff;});
  // Fisher-Yates shuffle
  for (var i = pool.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
  }
  return pool.slice(0, Math.min(config.count, pool.length));
}

// -- START QUIZ ----------------------------------------
function startQuiz() {
  var qs = getQuestions();
  if (qs.length === 0) { alert('No questions match your filters. Try changing category or difficulty.'); return; }
  session.questions = qs;
  session.idx = 0;
  session.answers = [];
  session.timeTaken = [];
  session.answered = false;
  showScreen('screen-quiz');
  loadQuestion();
}

// -- LOAD QUESTION -------------------------------------
function loadQuestion() {
  var q = session.questions[session.idx];
  session.answered = false;

  // Counter & progress
  document.getElementById('qCounter').textContent = (session.idx + 1) + ' / ' + session.questions.length;
  document.getElementById('progressBar').style.width = ((session.idx / session.questions.length) * 100) + '%';

  // Category & difficulty badges
  var catEl = document.getElementById('qCategory');
  catEl.textContent = q.cat.charAt(0).toUpperCase() + q.cat.slice(1);
  var diffEl = document.getElementById('qDiff');
  diffEl.textContent = q.diff.charAt(0).toUpperCase() + q.diff.slice(1);
  diffEl.className = 'q-diff ' + q.diff;

  // Question text
  document.getElementById('questionText').textContent = q.q;

  // Options
  var grid = document.getElementById('optionsGrid');
  grid.innerHTML = '';
  var letters = ['A','B','C','D'];
  q.opts.forEach(function(opt, i) {
    var btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = '<span class="opt-letter">' + letters[i] + '</span><span>' + opt + '</span>';
    btn.addEventListener('click', function(){ selectAnswer(i, btn); });
    grid.appendChild(btn);
  });

  // Hide feedback & next
  document.getElementById('feedbackRow').style.display = 'none';
  document.getElementById('nextBtn').style.display = 'none';

  // Start timer
  startTimer();
  session.timerStart = Date.now();
}

// -- TIMER ---------------------------------------------
function startTimer() {
  clearInterval(session.timer);
  var timerWrap = document.getElementById('timerWrap');
  if (config.timer === 0) { timerWrap.style.display = 'none'; return; }
  timerWrap.style.display = 'flex';
  session.timeLeft = config.timer;
  updateTimerUI();

  session.timer = setInterval(function() {
    session.timeLeft--;
    updateTimerUI();
    if (session.timeLeft <= 0) {
      clearInterval(session.timer);
      if (!session.answered) timeUp();
    }
  }, 1000);
}

function updateTimerUI() {
  var n = document.getElementById('timerNum');
  var arc = document.getElementById('timerArc');
  n.textContent = session.timeLeft;
  var pct = config.timer > 0 ? session.timeLeft / config.timer : 1;
  var circumference = 2 * Math.PI * 18;
  arc.style.strokeDashoffset = circumference * (1 - pct);
  if (session.timeLeft <= 5) arc.classList.add('urgent');
  else arc.classList.remove('urgent');
}

function timeUp() {
  session.answered = true;
  session.answers.push(-1); // skipped
  session.timeTaken.push(config.timer);
  markAnswers(null);
  showFeedback(false, null, true);
}

// -- SELECT ANSWER -------------------------------------
function selectAnswer(idx, btn) {
  if (session.answered) return;
  session.answered = true;
  clearInterval(session.timer);
  var elapsed = config.timer > 0 ? config.timer - session.timeLeft : Math.round((Date.now() - session.timerStart) / 1000);
  session.timeTaken.push(elapsed);
  session.answers.push(idx);
  markAnswers(idx);
  var correct = idx === session.questions[session.idx].ans;
  showFeedback(correct, idx, false);
}

function markAnswers(selectedIdx) {
  var q = session.questions[session.idx];
  var btns = document.getElementById('optionsGrid').querySelectorAll('.option-btn');
  btns.forEach(function(btn, i) {
    btn.disabled = true;
    if (i === q.ans) btn.classList.add('correct');
    else if (selectedIdx !== null && i === selectedIdx) btn.classList.add('wrong');
  });
}

function showFeedback(correct, selectedIdx, skipped) {
  var q = session.questions[session.idx];
  var box = document.getElementById('feedbackBox');
  var row = document.getElementById('feedbackRow');

  if (skipped) {
    box.className = 'feedback-box wrong';
    box.textContent = 'Time up! The correct answer was: ' + q.opts[q.ans] + '. ' + q.exp;
  } else if (correct) {
    box.className = 'feedback-box correct';
    box.textContent = 'Correct! ' + q.exp;
  } else {
    box.className = 'feedback-box wrong';
    box.textContent = 'Wrong. Correct: ' + q.opts[q.ans] + '. ' + q.exp;
  }

  row.style.display = 'block';
  document.getElementById('nextBtn').style.display = 'block';
  document.getElementById('nextBtn').textContent = session.idx < session.questions.length - 1 ? 'Next Question' : 'See Results';
}

// -- NEXT QUESTION ------------------------------------
function nextQuestion() {
  session.idx++;
  if (session.idx >= session.questions.length) {
    showResultsScreen();
  } else {
    loadQuestion();
  }
}

// -- RESULTS ------------------------------------------
function showResultsScreen() {
  clearInterval(session.timer);
  var correct = 0;
  var skipped = 0;
  session.answers.forEach(function(a, i) {
    if (a === -1) skipped++;
    else if (a === session.questions[i].ans) correct++;
  });
  var wrong = session.questions.length - correct - skipped;
  var pct = Math.round((correct / session.questions.length) * 100);
  var avgTime = session.timeTaken.length > 0 ? Math.round(session.timeTaken.reduce(function(a,b){return a+b;},0) / session.timeTaken.length) : 0;

  // Save best
  if (pct > bestScore) {
    bestScore = pct;
    localStorage.setItem('qm_best', pct);
  }

  // Icon & message
  var icon, title, sub;
  if (pct >= 90) { icon='S'; title='Outstanding!'; sub='Perfect mastery. You are ready for technical interviews.'; }
  else if (pct >= 75) { icon='A'; title='Great Job!'; sub='Strong performance. Review the wrong answers to master the rest.'; }
  else if (pct >= 50) { icon='B'; title='Good Effort!'; sub='Solid foundation. Focus on the topics you missed.'; }
  else { icon='C'; title='Keep Practicing!'; sub='Review the explanations below and take the quiz again.'; }

  document.getElementById('resultIcon').textContent = icon;
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultSub').textContent = sub;
  document.getElementById('resCorrect').textContent = correct;
  document.getElementById('resWrong').textContent = wrong;
  document.getElementById('resSkipped').textContent = skipped;
  document.getElementById('resTime').textContent = avgTime + 's';
  document.getElementById('scorePct').textContent = pct + '%';

  // Animate score ring
  var circumference = 2 * Math.PI * 55;
  var arc = document.getElementById('scoreArc');
  arc.style.strokeDashoffset = circumference;
  arc.style.stroke = pct >= 75 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626';
  setTimeout(function() {
    arc.style.strokeDashoffset = circumference * (1 - pct / 100);
  }, 100);

  showScreen('screen-results');
}

// -- REVIEW -------------------------------------------
function showReview() {
  var list = document.getElementById('reviewList');
  list.innerHTML = '';
  session.questions.forEach(function(q, i) {
    var userAns = session.answers[i];
    var isCorrect = userAns === q.ans;
    var isSkipped = userAns === -1 || userAns === undefined;
    var status = isSkipped ? 'skipped' : isCorrect ? 'correct' : 'wrong';

    var item = document.createElement('div');
    item.className = 'review-item ' + status;

    var qText = document.createElement('p');
    qText.className = 'review-q';
    qText.textContent = (i+1) + '. ' + q.q;

    var optsDiv = document.createElement('div');
    optsDiv.className = 'review-options';
    q.opts.forEach(function(opt, j) {
      var optEl = document.createElement('div');
      optEl.className = 'review-opt';
      if (j === q.ans) optEl.classList.add('correct-ans');
      else if (!isSkipped && j === userAns) optEl.classList.add('user-wrong');
      optEl.textContent = opt + (j === q.ans ? ' [Correct]' : (!isSkipped && j === userAns ? ' [Your Answer]' : ''));
      optsDiv.appendChild(optEl);
    });

    var expEl = document.createElement('div');
    expEl.className = 'review-explanation';
    expEl.textContent = q.exp;

    item.appendChild(qText);
    item.appendChild(optsDiv);
    item.appendChild(expEl);
    list.appendChild(item);
  });
  showScreen('screen-review');
}

function showResults() { showScreen('screen-results'); }
function goHome() { showScreen('screen-home'); updateBestScore(); }
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active');});
  document.getElementById(id).classList.add('active');
}

// -- START ---------------------------------------------
init();`;

export const quizApp: Project = {
  id: 'quiz-app',
  slug: 'quiz-app',
  title: 'Web Dev Quiz App',
  difficulty: 'beginner',
  type: 'frontend',
  estimatedTime: '4-6 hours',
  description: 'Build a full-featured quiz app with 30 Web Dev questions, categories, difficulty levels, countdown timer, animated score ring, answer review mode, and best score tracking.',
  technologies: ['HTML', 'CSS', 'JavaScript'],
  prerequisites: ['Basic HTML', 'Basic CSS', 'Basic JavaScript'],
  learnings: [
    'State management with plain JavaScript objects',
    'Dynamic DOM rendering from data arrays',
    'setInterval for countdown timers',
    'CSS animations and SVG stroke-dashoffset tricks',
    'localStorage for persistent best scores',
    'Fisher-Yates shuffle algorithm',
    'Event delegation',
    'Multi-screen SPA pattern without a framework',
  ],
  features: [
    '30 questions across HTML, CSS, JavaScript, and General Web Dev',
    'Filter by category and difficulty (Easy/Medium/Hard)',
    'Choose number of questions: 10, 15, or 20',
    'Countdown timer per question with animated ring (15s/20s/30s/No Limit)',
    'Instant correct/wrong feedback with explanation',
    'Animated score ring on results screen',
    'Correct / Wrong / Skipped / Avg Time stats',
    'Full answer review mode with explanations',
    'Best score saved to localStorage',
    'Grade message based on performance',
    'Questions shuffled every game',
  ],
  fileStructure: 'quiz-app/\n  index.html\n  style.css\n  script.js',
  overview: 'A quiz app is a perfect intermediate project because it requires real state management. You need to track the current question, the user answers, elapsed time, and scores — all without a framework. This project teaches the patterns behind every frontend app: a central state object, a render function that derives UI from state, and event handlers that update state and trigger re-renders.',
  objective: 'Build a complete quiz app with configurable difficulty, countdown timer, animated results, and answer review using plain HTML/CSS/JavaScript.',
  nextProject: 'weather-app',
  files: [
    { path: 'quiz-app/index.html', language: 'html', content: indexHtml },
    { path: 'quiz-app/style.css', language: 'css', content: styleCss },
    { path: 'quiz-app/script.js', language: 'javascript', content: scriptJs },
  ],
  lessons: [
    {
      id: 'data-structure',
      title: 'Designing the Question Bank',
      explanation: 'Each question is a JavaScript object with an id, category (html/css/javascript/general), difficulty (easy/medium/hard), the question text, an array of 4 options, the index of the correct answer (ans), and an explanation string. Storing all questions in an array of objects makes filtering, shuffling, and accessing them trivial with array methods. This is the same pattern used in production quiz platforms and exam systems.',
      js: `// Each question object has this shape:
var question = {
  id: 1,
  cat: 'javascript',        // 'html' | 'css' | 'javascript' | 'general'
  diff: 'medium',           // 'easy' | 'medium' | 'hard'
  q: 'What does Array.map() return?',
  opts: [                   // exactly 4 options
    'Modifies the original array',
    'A new array with each element transformed',
    'The first matching element',
    'A boolean'
  ],
  ans: 1,                   // index of correct option (0-3)
  exp: 'map() creates a new array by calling the callback on each element.'
};

// Filter by category + difficulty then shuffle:
var pool = QUESTIONS.filter(function(q) {
  return q.cat === 'javascript' && q.diff === 'medium';
});`,
    },
    {
      id: 'shuffle',
      title: 'Shuffle with Fisher-Yates Algorithm',
      explanation: 'A truly random shuffle requires the Fisher-Yates algorithm. Starting from the last element, we pick a random index from 0 to i, then swap the current element with the randomly chosen one. This gives every permutation an equal probability. Using Math.random() alone (like sorting by random comparator) produces biased results. After shuffling, we slice the first N questions to get the configured count.',
      js: `function shuffleAndPick(pool, count) {
  var arr = pool.slice(); // copy — never mutate original

  // Fisher-Yates shuffle
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    // Swap arr[i] and arr[j]
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }

  // Return only the number of questions configured
  return arr.slice(0, Math.min(count, arr.length));
}`,
    },
    {
      id: 'timer',
      title: 'Building the Countdown Timer',
      explanation: 'setInterval calls a function every N milliseconds. We use 1000ms (1 second) to decrement timeLeft. The SVG timer ring uses stroke-dasharray and stroke-dashoffset to draw a partial circle — as timeLeft decreases, the dashoffset increases, making the ring shrink. When timeLeft reaches 0, we call timeUp() which records a skipped answer. We always clearInterval when moving to the next question to prevent multiple timers running simultaneously.',
      js: `function startTimer() {
  clearInterval(session.timer); // always clear previous timer first
  session.timeLeft = config.timer;
  updateTimerRing(1.0);         // full ring

  session.timer = setInterval(function() {
    session.timeLeft--;
    var pct = session.timeLeft / config.timer; // 0.0 to 1.0
    updateTimerRing(pct);

    if (session.timeLeft <= 0) {
      clearInterval(session.timer);
      timeUp(); // ran out of time
    }
  }, 1000);
}

function updateTimerRing(pct) {
  var circumference = 2 * Math.PI * 18; // r=18
  var arc = document.getElementById('timerArc');
  // dashoffset 0 = full circle, circumference = empty circle
  arc.style.strokeDashoffset = circumference * (1 - pct);
  // Turn red when under 5 seconds
  if (session.timeLeft <= 5) arc.classList.add('urgent');
  else arc.classList.remove('urgent');
}`,
    },
    {
      id: 'scoring',
      title: 'Calculating and Displaying Results',
      explanation: 'After all questions are answered, we loop through session.answers and compare each answer to the correct index. -1 means skipped (time ran out). We calculate percentage, find the average time, then animate the score ring using SVG stroke-dashoffset with a CSS transition. The ring color changes based on score: green for 75%+, yellow for 50%+, red otherwise. The best score is saved to localStorage and shown on the home screen.',
      js: `function calculateResults() {
  var correct = 0, skipped = 0;
  session.answers.forEach(function(a, i) {
    if (a === -1) skipped++;                         // time up
    else if (a === session.questions[i].ans) correct++; // right answer
  });
  var wrong = session.questions.length - correct - skipped;
  var pct = Math.round((correct / session.questions.length) * 100);
  var avgTime = session.timeTaken.reduce(function(a,b){return a+b;},0)
    / session.timeTaken.length;

  // Animate SVG score ring (CSS transition does the animation)
  var circumference = 2 * Math.PI * 55; // r=55
  var arc = document.getElementById('scoreArc');
  arc.style.strokeDashoffset = circumference;       // start empty
  setTimeout(function() {
    // transition animates from empty to filled
    arc.style.strokeDashoffset = circumference * (1 - pct / 100);
  }, 100);

  // Save best score
  if (pct > parseInt(localStorage.getItem('qm_best') || '0')) {
    localStorage.setItem('qm_best', pct);
  }
}`,
    },
    {
      id: 'review',
      title: 'Building the Answer Review Screen',
      explanation: 'The review screen rebuilds a list of all questions after the quiz ends. For each question we compare the user answer to the correct answer. If they match — green. If the user chose wrong — show their answer in red and the correct one in green. If skipped — show the correct answer only. Each card includes the explanation text so students learn from mistakes. This is the most educational part of any quiz app.',
      js: `function buildReview() {
  session.questions.forEach(function(q, i) {
    var userAns = session.answers[i];          // what user picked
    var correct = q.ans;                        // right answer index
    var skipped = userAns === -1 || userAns === undefined;

    q.opts.forEach(function(opt, j) {
      // Green: always show correct answer
      if (j === correct) {
        optEl.classList.add('correct-ans');     // green badge
      }
      // Red: show user's wrong choice
      else if (!skipped && j === userAns) {
        optEl.classList.add('user-wrong');      // red badge
      }
    });
    // Show explanation so student learns why
    expEl.textContent = q.exp;
  });
}`,
    },
    {
      id: 'complete-project',
      title: 'The Complete Quiz App',
      explanation: 'The full script.js follows a screen-based SPA architecture. showScreen() toggles the active class between four screens: home, quiz, results, review. Config stores the user settings. Session stores all runtime state. The question bank has 30 real Web Dev questions across 4 categories and 3 difficulties. loadQuestion() builds the options from data. selectAnswer() evaluates, saves, and shows feedback. showResultsScreen() computes and animates everything. No framework needed — just clean, organized JavaScript.',
      js: scriptJs,
    },
  ],
  challenges: [
    {
      id: 'c1',
      title: 'Add a Leaderboard',
      difficulty: 'easy',
      description: 'Save the top 5 scores to localStorage and display them on the home screen as a leaderboard.',
      hint: 'Store an array of { score, date } objects in localStorage. On each quiz completion, push the new score, sort descending, keep only top 5, and re-render the leaderboard list.',
    },
    {
      id: 'c2',
      title: 'Add Streak Tracking',
      difficulty: 'easy',
      description: 'Track how many questions the user answers correctly in a row. Show the current streak as a badge during the quiz.',
      hint: 'Add a streak variable to session. Increment it on correct answer, reset to 0 on wrong or skipped. Show a "X in a row!" badge in the question card when streak >= 3.',
    },
    {
      id: 'c3',
      title: 'Add a 50/50 Lifeline',
      difficulty: 'medium',
      description: 'Add a button that removes two wrong answers, leaving only the correct answer and one wrong one. Allow it once per quiz.',
      hint: 'Track lifelineUsed in session state. On click, find the two wrong option buttons (not the correct answer) and hide them. Disable the button after use.',
    },
    {
      id: 'c4',
      title: 'Add Dark Mode',
      difficulty: 'medium',
      description: 'Add a dark mode toggle button in the header that switches the theme and saves the preference to localStorage.',
      hint: 'Toggle data-theme="dark" on document.documentElement. CSS variables in :root and [data-theme="dark"] handle all color switches automatically. Save with localStorage.setItem("qm_theme", "dark").',
    },
    {
      id: 'c5',
      title: 'Add Your Own Questions',
      difficulty: 'hard',
      description: 'Add a form that lets users create and save their own custom questions to localStorage. Include them in the question pool.',
      hint: 'Build a form with inputs for question, 4 options, correct answer index, category, and difficulty. Save to localStorage as a JSON array. Merge with QUESTIONS on init. Add a "Custom" category option to the filter.',
    },
  ],
};
