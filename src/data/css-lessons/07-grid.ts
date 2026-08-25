import type { CssLesson } from '../css-curriculum';
export const cssGridLesson: CssLesson = {
  id:'css-grid',title:'CSS Grid',slug:'grid',
  chapter:'grid',order:7,difficulty:'intermediate',readingTime:16,
  description:'Master CSS Grid - the two-dimensional layout system for building complex page layouts.',
  sections:[
    {type:'text',content:'CSS Grid is the most powerful layout system in CSS. Unlike Flexbox (one-dimensional), Grid controls both rows and columns simultaneously. It is perfect for full page layouts, dashboards, image galleries, and any two-dimensional structure.'},
    {type:'heading',content:'Basic Grid Setup'},
    {type:'code',language:'css',content:'display:grid turns a container into a CSS Grid. Like Flexbox, only DIRECT children become grid items. Grid is the go-to for two-dimensional layouts where you need control over both rows and columns at the same time.',code:`/* Apply grid to the container */
.container {
  display: grid;

  /* Define columns */
  grid-template-columns: 200px 1fr 200px;      /* sidebar main sidebar */
  grid-template-columns: repeat(3, 1fr);        /* 3 equal columns */
  grid-template-columns: repeat(4, minmax(200px, 1fr)); /* min 200px each */
  grid-template-columns: auto 1fr auto;         /* auto = size to content */

  /* Define rows */
  grid-template-rows: 64px 1fr 48px;    /* header content footer heights */
  grid-template-rows: repeat(3, auto);  /* 3 auto-height rows */

  /* Gap between cells */
  gap: 24px;           /* row and column gap */
  column-gap: 24px;    /* only column */
  row-gap: 16px;       /* only row */
}`},
    {type:'heading',content:'The fr Unit'},
    {type:'code',language:'css',content:'grid-template-columns defines how many columns and their widths. fr (fractional unit) divides the remaining space proportionally - 1fr 2fr 1fr gives 25%, 50%, 25%. repeat(3,1fr) creates three equal columns. gap adds spacing between all cells.',code:`/* fr = fractional unit - divides remaining space */
grid-template-columns: 1fr 1fr 1fr;     /* 3 equal columns */
grid-template-columns: 2fr 1fr;         /* left twice as wide as right */
grid-template-columns: 250px 1fr;       /* fixed sidebar, flexible main */
grid-template-columns: 1fr 2fr 1fr;     /* center twice as wide as sides */

/* repeat() shorthand */
grid-template-columns: repeat(4, 1fr);    /* same as 1fr 1fr 1fr 1fr */
grid-template-columns: repeat(3, 200px 1fr); /* alternating: 200px 1fr 200px 1fr 200px 1fr */`},
    {type:'heading',content:'Placing Items'},
    {type:'code',language:'css',content:'Grid auto-placement fills items left to right, top to bottom. grid-column and grid-row let individual items span multiple columns or rows. span 2 means the item takes 2 tracks. This is how featured or hero items in a card grid are built.',code:`/* By default, grid auto-places items left to right, top to bottom */

/* Manually place items with grid-column and grid-row */
.item {
  grid-column: 1 / 3;    /* start at line 1, end at line 3 (spans 2 columns) */
  grid-column: 1 / -1;   /* start at 1, end at LAST line (full width!) */
  grid-column: span 2;   /* span 2 columns from wherever it is */
  grid-row: 1 / 3;       /* span 2 rows */
  grid-row: span 2;
}

/* Short example: 3-column grid */
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.full-width { grid-column: 1 / -1; }   /* spans all 3 columns */
.two-thirds { grid-column: span 2; }   /* spans 2 of 3 columns */`},
    {type:'heading',content:'Named Grid Areas - Most Readable Approach'},
    {type:'code',language:'css',content:'grid-template-areas gives each zone a name and you place items by name with grid-area. This creates a visual map of your layout directly in the CSS. Changing the layout at a breakpoint is as simple as redefining the template-areas string.',code:`/* BEST for page layouts - name your areas like a map */
.layout {
  display: grid;
  grid-template-areas:
    "header  header  header"
    "sidebar main    main"
    "sidebar footer  footer";
  grid-template-columns: 250px 1fr 1fr;
  grid-template-rows: 64px 1fr 48px;
  min-height: 100vh;
  gap: 0;
}

/* Assign each element to its area */
header  { grid-area: header; }
.sidebar{ grid-area: sidebar; }
main    { grid-area: main; }
footer  { grid-area: footer; }

/* Use . for empty cells */
.grid-with-gap {
  grid-template-areas:
    "logo   . nav"
    "hero   hero hero"
    "cards  cards cards";
}`},
    {type:'heading',content:'auto-fill vs auto-fit - Responsive Grid Without Media Queries'},
    {type:'code',language:'css',content:'auto-fill creates as many columns as fit in the container. auto-fit collapses empty columns. minmax(250px,1fr) sets a minimum column width of 250px and a maximum of 1fr. Together these create a fully responsive grid with no media queries.',code:`/* AUTO-FILL: creates as many columns as fit */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
/* 4 columns on large screen, 2 on tablet, 1 on mobile - automatically! */

/* AUTO-FIT: same but collapses empty tracks */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}
/* Cards expand to fill space if fewer than max columns */`},
    {type:'heading',content:'Alignment in Grid'},
    {type:'code',language:'css',content:'justify-items aligns items horizontally within their cell. align-items aligns items vertically. justify-content and align-content position the entire grid within its container. justify-self and align-self override these on individual items.',code:`/* Align ALL items in the grid */
.grid {
  justify-items: start;    /* items at start of cell (default: stretch) */
  justify-items: center;   /* items centered horizontally in cell */
  justify-items: end;
  justify-items: stretch;  /* default: fill cell width */

  align-items: start;      /* items at top of cell */
  align-items: center;     /* items vertically centered in cell */
  align-items: end;
  align-items: stretch;    /* default: fill cell height */
}

/* Align the ENTIRE grid within its container */
.grid {
  justify-content: center;   /* horizontal */
  align-content: center;     /* vertical */
}

/* Override for ONE item */
.item {
  justify-self: center;  /* this item horizontally centered */
  align-self: end;       /* this item at bottom of row */
  place-self: center;    /* shorthand: both centered */
}`},
    {type:'heading',content:'Real-World Grid Layouts'},
    {type:'code',language:'css',content:'These patterns appear in almost every real project. The classic page layout uses named areas (header, sidebar, main, footer). The magazine layout uses grid-column:span to make featured items take more space. The card grid uses auto-fill and minmax for fully responsive columns.',code:`/* 1. Classic page layout */
.page {
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-areas: "header" "main" "footer";
  min-height: 100vh;
}

/* 2. Holy Grail layout */
.holy-grail {
  display: grid;
  grid-template: auto 1fr auto / 200px 1fr 200px;
  grid-template-areas:
    "header  header  header"
    "left    main    right"
    "footer  footer  footer";
}

/* 3. Masonry-ish gallery */
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 200px;
  gap: 8px;
}
.gallery .large { grid-row: span 2; }  /* tall image spans 2 rows */
.gallery .wide  { grid-column: span 2; } /* wide image spans 2 cols */`},
    {type:'tryit',title:'CSS Grid Layout Builder',
     html:`<div id="app">
  <div class="sidebar">
    <h3>Grid Controls</h3>
    <div class="control-group">
      <label>Columns: <b id="colsVal">3</b></label>
      <input type="range" id="cols" min="1" max="6" value="3" oninput="update()">
    </div>
    <div class="control-group">
      <label>Rows: <b id="rowsVal">3</b></label>
      <input type="range" id="rows" min="1" max="5" value="3" oninput="update()">
    </div>
    <div class="control-group">
      <label>Gap: <b id="gapVal">16px</b></label>
      <input type="range" id="gap" min="0" max="32" value="16" oninput="update()">
    </div>
    <div class="control-group">
      <label>Template</label>
      <select id="template" onchange="applyTemplate()">
        <option value="">Custom</option>
        <option value="equal">Equal Columns</option>
        <option value="sidebar">Sidebar Layout</option>
        <option value="holy-grail">Holy Grail</option>
        <option value="card-grid">Auto-fit Cards</option>
      </select>
    </div>
    <div class="control-group">
      <label>Column sizes</label>
      <input type="text" id="colSizes" value="1fr 1fr 1fr" oninput="update()" style="width:100%;padding:6px 8px;border:1px solid #e2e8f0;border-radius:6px;font-size:12px;font-family:monospace;">
    </div>
    <div class="css-output">
      <div style="font-size:10px;color:#8b949e;margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em;">Generated CSS</div>
      <pre id="cssOut"></pre>
      <button id="copyBtn" onclick="copyCss()">📋 Copy CSS</button>
    </div>
  </div>
  <div class="preview-area">
    <div class="preview-header">
      <span>Live Preview</span>
      <span id="info"></span>
    </div>
    <div id="grid-preview"></div>
  </div>
</div>`,
     css:`*{box-sizing:border-box}body{font-family:system-ui,sans-serif;margin:0;padding:12px;background:#f8fafc;font-size:13px;}
#app{display:grid;grid-template-columns:220px 1fr;gap:12px;height:calc(100vh - 24px);max-height:520px;}
.sidebar{background:white;border-radius:12px;padding:14px;border:1px solid #e2e8f0;overflow-y:auto;}
h3{margin:0 0 12px;font-size:13px;font-weight:800;color:#1e293b;text-transform:uppercase;letter-spacing:.06em;}
.control-group{margin-bottom:12px;}
label{display:block;font-size:11px;font-weight:600;color:#475569;margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em;}
label b{color:#6366f1;}
input[type=range]{width:100%;accent-color:#6366f1;height:4px;}
select{width:100%;padding:6px 8px;border:1px solid #e2e8f0;border-radius:6px;font-size:12px;outline:none;}
.css-output{background:#0d1117;border-radius:8px;padding:10px;margin-top:10px;}
pre{font-size:10px;color:#7dd3fc;margin:0;white-space:pre-wrap;line-height:1.5;}
#copyBtn{margin-top:6px;padding:4px 10px;background:#1f6feb;color:white;border:none;border-radius:5px;cursor:pointer;font-size:11px;font-weight:600;}
.preview-area{background:white;border-radius:12px;border:1px solid #e2e8f0;display:flex;flex-direction:column;overflow:hidden;}
.preview-header{display:flex;justify-content:space-between;align-items:center;padding:8px 14px;border-bottom:1px solid #e2e8f0;font-size:11px;font-weight:600;color:#475569;}
#info{font-family:monospace;font-size:10px;color:#6366f1;background:#ede9fe;padding:2px 6px;border-radius:4px;}
#grid-preview{flex:1;padding:14px;display:grid;align-content:start;}
.grid-cell{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;min-height:60px;transition:all .2s;cursor:pointer;position:relative;}
.grid-cell:hover{filter:brightness(1.1);transform:scale(1.02);}
.cell-label{font-size:10px;opacity:.8;position:absolute;top:4px;left:6px;}
.cell-num{font-size:16px;}
.cell-1{background:linear-gradient(135deg,#6366f1,#818cf8);}
.cell-2{background:linear-gradient(135deg,#0ea5e9,#38bdf8);}
.cell-3{background:linear-gradient(135deg,#10b981,#34d399);}
.cell-4{background:linear-gradient(135deg,#f59e0b,#fbbf24);}
.cell-5{background:linear-gradient(135deg,#ef4444,#f87171);}
.cell-6{background:linear-gradient(135deg,#8b5cf6,#a78bfa);}`,
     js:`const colors = ['cell-1','cell-2','cell-3','cell-4','cell-5','cell-6'];

function update() {
  const cols = +document.getElementById('cols').value;
  const rows = +document.getElementById('rows').value;
  const gap  = +document.getElementById('gap').value;
  const colSizes = document.getElementById('colSizes').value || ('1fr '.repeat(cols).trim());
  document.getElementById('colsVal').textContent = cols;
  document.getElementById('rowsVal').textContent = rows;
  document.getElementById('gapVal').textContent = gap + 'px';

  const total = cols * rows;
  const grid  = document.getElementById('grid-preview');
  grid.style.gridTemplateColumns = colSizes;
  grid.style.gridTemplateRows = 'repeat('+rows+',1fr)';
  grid.style.gap = gap + 'px';

  grid.innerHTML = Array.from({length:total},(_,i)=>
    '<div class="grid-cell '+colors[i%colors.length]+'">' +
    '<span class="cell-label">item '+i+'</span>' +
    '<span class="cell-num">'+(i+1)+'</span></div>'
  ).join('');

  document.getElementById('info').textContent = cols+'×'+rows+' grid';
  document.getElementById('cssOut').textContent =
    '.grid {   display: grid;   grid-template-columns: '+colSizes+'; ' +
    '  grid-template-rows: repeat('+rows+', 1fr);   gap: '+gap+'px; }';
}

function applyTemplate() {
  const t = document.getElementById('template').value;
  const colsInput = document.getElementById('colSizes');
  const colsRange = document.getElementById('cols');
  const rowsRange = document.getElementById('rows');
  if (t==='equal'){colsInput.value='1fr 1fr 1fr';colsRange.value=3;rowsRange.value=2;}
  else if(t==='sidebar'){colsInput.value='250px 1fr';colsRange.value=2;rowsRange.value=3;}
  else if(t==='holy-grail'){colsInput.value='200px 1fr 200px';colsRange.value=3;rowsRange.value=3;}
  else if(t==='card-grid'){colsInput.value='repeat(auto-fit,minmax(120px,1fr))';colsRange.value=4;rowsRange.value=2;}
  update();
}

function copyCss() {
  const css = document.getElementById('cssOut').textContent;
  navigator.clipboard.writeText(css).then(()=>{
    const btn = document.getElementById('copyBtn');
    btn.textContent='✅ Copied!';
    setTimeout(()=>{btn.textContent='📋 Copy CSS';},1500);
  });
}

window.update=update; window.applyTemplate=applyTemplate; window.copyCss=copyCss;
update();`,
     mode:'full'},
  ],
  exercises:[
    {id:'gr1',question:'What does grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) do?',type:'multiple-choice',options:['Creates exactly 200 columns','Creates responsive columns that are at least 200px and share remaining space','Creates one column of 200px','Nothing - invalid syntax'],correct:1,explanation:'auto-fit creates as many columns as fit, each at least 200px wide. On wide screens you get 4-5 columns, on mobile you get 1. This creates a responsive grid with NO media queries needed.'},
  ],
  quiz:[
    {id:'gq1',question:'What is the difference between grid-column: 1/3 and grid-column: span 2?',options:['They are identical','1/3 goes from line 1 to line 3; span 2 spans 2 columns from current position','span 2 is wrong syntax','1/3 is a fraction'],correct:1,explanation:'grid-column: 1/3 means start at grid line 1, end at grid line 3. grid-column: span 2 means span 2 columns from wherever the item is placed. Both result in a 2-column-wide item if starting at line 1.'},
  ],
};
