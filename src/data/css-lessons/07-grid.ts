import type { CssLesson } from '../css-curriculum';
export const cssGridLesson: CssLesson = {
  id:'css-grid',title:'CSS Grid',slug:'grid',
  chapter:'grid',order:7,difficulty:'intermediate',readingTime:16,
  description:'Master CSS Grid — the two-dimensional layout system for building complex page layouts.',
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
    {type:'code',language:'css',content:'grid-template-columns defines how many columns and their widths. fr (fractional unit) divides the remaining space proportionally — 1fr 2fr 1fr gives 25%, 50%, 25%. repeat(3,1fr) creates three equal columns. gap adds spacing between all cells.',code:`/* fr = fractional unit — divides remaining space */
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
    {type:'heading',content:'Named Grid Areas — Most Readable Approach'},
    {type:'code',language:'css',content:'grid-template-areas gives each zone a name and you place items by name with grid-area. This creates a visual map of your layout directly in the CSS. Changing the layout at a breakpoint is as simple as redefining the template-areas string.',code:`/* BEST for page layouts — name your areas like a map */
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
    {type:'heading',content:'auto-fill vs auto-fit — Responsive Grid Without Media Queries'},
    {type:'code',language:'css',content:'auto-fill creates as many columns as fit in the container. auto-fit collapses empty columns. minmax(250px,1fr) sets a minimum column width of 250px and a maximum of 1fr. Together these create a fully responsive grid with no media queries.',code:`/* AUTO-FILL: creates as many columns as fit */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
/* 4 columns on large screen, 2 on tablet, 1 on mobile — automatically! */

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
    {type:'tryit',title:'Try It: CSS Grid Layouts',
     html:`<div class="demo">
  <h1>CSS Grid Demo</h1>

  <h3>1. Responsive Card Grid (auto-fit)</h3>
  <div class="card-grid">
    <div class="card">HTML</div>
    <div class="card">CSS</div>
    <div class="card">JavaScript</div>
    <div class="card">React</div>
    <div class="card">Node.js</div>
    <div class="card">MongoDB</div>
  </div>

  <h3>2. Named Areas Layout</h3>
  <div class="page-layout">
    <header>Header</header>
    <aside>Sidebar</aside>
    <main>Main Content</main>
    <footer>Footer</footer>
  </div>

  <h3>3. Spanning Items</h3>
  <div class="span-grid">
    <div class="span-item full">Full width (span all)</div>
    <div class="span-item">1</div>
    <div class="span-item two-col">Span 2 cols</div>
    <div class="span-item">2</div>
    <div class="span-item">3</div>
    <div class="span-item">4</div>
  </div>
</div>`,
     css:`body{font-family:system-ui,sans-serif;padding:20px;background:#f9fafb;}
h1{color:#1e1e1e;margin-bottom:12px;}
h3{font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin:20px 0 8px;}
.card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-bottom:4px;}
.card{background:#2563eb;color:white;padding:20px;border-radius:10px;text-align:center;font-weight:700;}
.page-layout{display:grid;grid-template-areas:"header header""sidebar main""footer footer";grid-template-columns:120px 1fr;grid-template-rows:40px 80px 40px;gap:6px;margin-bottom:4px;}
.page-layout header{grid-area:header;background:#1e1e1e;color:white;display:flex;align-items:center;justify-content:center;border-radius:6px;font-weight:700;}
.page-layout aside{grid-area:sidebar;background:#7c3aed;color:white;display:flex;align-items:center;justify-content:center;border-radius:6px;font-size:13px;font-weight:700;}
.page-layout main{grid-area:main;background:white;border:1px solid #e5e7eb;display:flex;align-items:center;justify-content:center;border-radius:6px;font-weight:600;color:#374151;}
.page-layout footer{grid-area:footer;background:#374151;color:white;display:flex;align-items:center;justify-content:center;border-radius:6px;font-weight:700;}
.span-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;}
.span-item{background:#059669;color:white;padding:16px;border-radius:8px;text-align:center;font-weight:700;}
.full{grid-column:1/-1;background:#dc2626;}
.two-col{grid-column:span 2;background:#d97706;}`,
     mode:'html'},
  ],
  exercises:[
    {id:'gr1',question:'What does grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) do?',type:'multiple-choice',options:['Creates exactly 200 columns','Creates responsive columns that are at least 200px and share remaining space','Creates one column of 200px','Nothing — invalid syntax'],correct:1,explanation:'auto-fit creates as many columns as fit, each at least 200px wide. On wide screens you get 4-5 columns, on mobile you get 1. This creates a responsive grid with NO media queries needed.'},
  ],
  quiz:[
    {id:'gq1',question:'What is the difference between grid-column: 1/3 and grid-column: span 2?',options:['They are identical','1/3 goes from line 1 to line 3; span 2 spans 2 columns from current position','span 2 is wrong syntax','1/3 is a fraction'],correct:1,explanation:'grid-column: 1/3 means start at grid line 1, end at grid line 3. grid-column: span 2 means span 2 columns from wherever the item is placed. Both result in a 2-column-wide item if starting at line 1.'},
  ],
};
