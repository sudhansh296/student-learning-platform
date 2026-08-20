import type { CssLesson } from '../css-curriculum';
export const cssFlexboxLesson: CssLesson = {
  id:'css-flexbox',title:'CSS Flexbox',slug:'flexbox',
  chapter:'flexbox',order:6,difficulty:'beginner',readingTime:15,
  description:'Master Flexbox — the modern one-dimensional layout system for aligning and distributing elements.',
  sections:[
    {type:'text',content:'Flexbox (Flexible Box Layout) is a CSS layout model that makes it easy to arrange items in a row or column, align them, and distribute space between them. It replaced float-based layouts and is now the most used layout technique in web development.'},
    {type:'analogy',title:'Flexbox is like a shelf',content:'Imagine a bookshelf. You decide if books stand left-to-right or top-to-bottom (flex-direction). You decide if they bunch up to one side or spread out (justify-content). You decide if they all stand at the same height or vary (align-items). Flexbox gives you this control over any group of HTML elements.'},
    {type:'heading',content:'Enabling Flexbox'},
    {type:'code',language:'css',content:'display:flex turns a container into a flexbox. Its DIRECT children become flex items that line up in a row by default. Only the direct children are affected — deeper descendants are not flex items. This is the most important rule in Flexbox.',code:`/* Add display: flex to the PARENT (container) */
.container {
  display: flex;        /* makes children flex items */
  display: inline-flex; /* flex container but stays inline */
}`},
    {type:'heading',content:'flex-direction — Row or Column?'},
    {type:'code',language:'css',content:'flex-direction sets which way items flow. row (default) lays items left to right. column stacks them top to bottom. row-reverse and column-reverse go in the opposite direction. The main axis is always the direction of flex-direction.',code:`/* Controls main axis direction */
.container { flex-direction: row; }           /* → left to right (default) */
.container { flex-direction: row-reverse; }   /* ← right to left */
.container { flex-direction: column; }        /* ↓ top to bottom */
.container { flex-direction: column-reverse; }/* ↑ bottom to top */`},
    {type:'heading',content:'justify-content — Alignment on Main Axis'},
    {type:'code',language:'css',content:'justify-content distributes space along the main axis. flex-start packs items to the start. flex-end to the end. center centers them. space-between puts equal space between items. space-around adds equal space around each item.',code:`/* Controls how items are distributed along main axis */
.row { justify-content: flex-start; }    /* items at start (default) */
.row { justify-content: flex-end; }      /* items at end */
.row { justify-content: center; }        /* items centered */
.row { justify-content: space-between; } /* equal gaps between items, no outer gaps */
.row { justify-content: space-around; }  /* equal gaps including half-gaps at edges */
.row { justify-content: space-evenly; }  /* equal gaps everywhere including edges */`},
    {type:'heading',content:'align-items — Alignment on Cross Axis'},
    {type:'code',language:'css',content:'align-items aligns items on the cross axis (perpendicular to flex-direction). stretch (default) makes all items the same height. center vertically centers them. flex-start aligns to the top. baseline aligns items to their text baseline.',code:`/* Controls how items align on the CROSS axis (perpendicular to main) */
.row { align-items: stretch; }    /* items stretch to fill container height (default) */
.row { align-items: flex-start; } /* items at top (for row direction) */
.row { align-items: flex-end; }   /* items at bottom */
.row { align-items: center; }     /* items vertically centered */
.row { align-items: baseline; }   /* items aligned by text baseline */

/* Perfect centering — one of the most useful CSS tricks */
.center-everything {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* needs height set */
}`},
    {type:'heading',content:'flex-wrap — Wrapping'},
    {type:'code',language:'css',content:'By default flex items never wrap — they shrink to fit on one line. flex-wrap:wrap allows items to move to the next line when there is not enough space. This is essential for responsive card grids.',code:`/* By default, flex items never wrap (they shrink instead) */
.container { flex-wrap: nowrap; }   /* all on one line (default) */
.container { flex-wrap: wrap; }     /* wrap to next line when needed */
.container { flex-wrap: wrap-reverse; } /* wrap upward */

/* align-content — controls wrapped lines */
.container {
  flex-wrap: wrap;
  align-content: flex-start;   /* wrapped lines at start */
  align-content: space-between; /* space between wrapped lines */
  align-content: center;        /* wrapped lines centered vertically */
}`},
    {type:'heading',content:'Flex Item Properties'},
    {type:'code',language:'css',content:'flex-grow controls how much an item expands to fill available space. flex-shrink controls how much it shrinks when space is tight. flex-basis sets the initial size before growing or shrinking. flex:1 is shorthand for grow:1, shrink:1, basis:0.',code:`/* flex-grow: how much item GROWS relative to siblings */
.item { flex-grow: 0; }   /* don't grow (default) */
.item { flex-grow: 1; }   /* grow to fill available space */
.sidebar { flex-grow: 0; }
.main { flex-grow: 1; }   /* main fills all remaining space */

/* flex-shrink: how much item SHRINKS when space is tight */
.item { flex-shrink: 1; } /* can shrink (default) */
.logo { flex-shrink: 0; } /* never shrink (important for icons/logos!) */

/* flex-basis: initial size before growing/shrinking */
.item { flex-basis: auto; }    /* use width/height (default) */
.item { flex-basis: 200px; }   /* start at 200px */
.item { flex-basis: 33.33%; }  /* start at 1/3 width */

/* SHORTHAND: flex = grow shrink basis */
.item { flex: 1; }          /* grow:1, shrink:1, basis:0 — equal widths */
.item { flex: 0 0 200px; }  /* fixed 200px, never grow or shrink */
.item { flex: 1 1 auto; }   /* default behavior */

/* order — change visual order without changing HTML */
.first { order: -1; } /* moves to front */
.last  { order: 999; } /* moves to back */
/* default order is 0 for all items */

/* align-self — override align-items for ONE item */
.item { align-self: flex-start; }  /* this item ignores align-items on container */
.item { align-self: center; }`},
    {type:'heading',content:'gap — Space Between Items'},
    {type:'code',language:'css',content:'gap adds consistent spacing between flex items without needing margins. It does not add space before the first or after the last item — unlike margin. row-gap and column-gap set spacing independently for each direction.',code:`/* gap replaces margin tricks for flex spacing */
.container { gap: 16px; }        /* same gap on all sides */
.container { gap: 8px 16px; }    /* row-gap column-gap */
.container { row-gap: 8px; column-gap: 16px; }

/* Much better than using margin: */
/* BEFORE (messy): */
.item + .item { margin-left: 16px; }

/* AFTER (clean): */
.container { display: flex; gap: 16px; }`},
    {type:'heading',content:'Real-World Flexbox Patterns'},
    {type:'code',language:'css',content:'These are the real-world Flexbox patterns used on every website. The navbar uses justify-content:space-between to push logo left and links right. The card grid uses flex-wrap:wrap with a fixed basis so cards flow naturally. The centered hero uses both justify-content and align-items:center.',code:`/* 1. Navbar with logo left, links right */
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 64px;
}

/* 2. Card grid that wraps */
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.card {
  flex: 1 1 280px; /* grow, shrink, min 280px — wraps nicely */
  max-width: 400px;
}

/* 3. Sidebar + main layout */
.layout {
  display: flex;
  gap: 32px;
}
.sidebar { flex: 0 0 250px; }  /* fixed 250px sidebar */
.main    { flex: 1; }           /* main fills rest */

/* 4. Center absolutely anything */
.screen {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}`},
    {type:'tryit',title:'Try It: Flexbox Playground',
     html:`<div class="demo">
  <h1>Flexbox Demo</h1>

  <h3>justify-content: space-between</h3>
  <div class="flex-demo space-between">
    <div class="box">1</div>
    <div class="box">2</div>
    <div class="box">3</div>
    <div class="box">4</div>
  </div>

  <h3>justify-content: center + align-items: center</h3>
  <div class="flex-demo centered">
    <div class="box tall">Tall</div>
    <div class="box">Short</div>
    <div class="box medium">Mid</div>
  </div>

  <h3>flex-wrap: wrap (resize to see)</h3>
  <div class="flex-demo wrap-demo">
    <div class="card-item">Card 1</div>
    <div class="card-item">Card 2</div>
    <div class="card-item">Card 3</div>
    <div class="card-item">Card 4</div>
    <div class="card-item">Card 5</div>
  </div>

  <h3>Sidebar + Main Layout</h3>
  <div class="layout-demo">
    <aside class="sidebar">Sidebar<br><small>flex: 0 0 150px</small></aside>
    <main class="main-area">Main Content<br><small>flex: 1</small></main>
  </div>
</div>`,
     css:`body{font-family:system-ui,sans-serif;padding:20px;background:#f9fafb;}
h1{color:#1e1e1e;margin-bottom:16px;}
h3{font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin:20px 0 8px;}
.flex-demo{display:flex;background:#eff6ff;border-radius:10px;padding:12px;border:2px solid #bfdbfe;margin-bottom:8px;}
.space-between{justify-content:space-between;align-items:center;}
.centered{justify-content:center;align-items:center;height:100px;gap:12px;}
.wrap-demo{flex-wrap:wrap;gap:10px;}
.box{background:#2563eb;color:white;padding:12px 18px;border-radius:8px;font-weight:700;}
.tall{height:80px;display:flex;align-items:center;}
.medium{height:60px;display:flex;align-items:center;}
.card-item{flex:1 1 120px;background:#7c3aed;color:white;padding:16px;border-radius:8px;text-align:center;font-weight:600;}
.layout-demo{display:flex;gap:12px;background:#eff6ff;border-radius:10px;border:2px solid #bfdbfe;overflow:hidden;}
.sidebar{flex:0 0 150px;background:#2563eb;color:white;padding:16px;font-weight:600;}
.main-area{flex:1;background:white;padding:16px;font-weight:600;color:#374151;}
small{font-weight:400;opacity:.8;}`,
     mode:'html'},
  ],
  exercises:[
    {id:'fb1',question:'Which CSS property on the CONTAINER controls horizontal spacing between flex items in a row?',type:'multiple-choice',options:['align-items','justify-content','flex-direction','flex-wrap'],correct:1,explanation:'justify-content controls alignment along the main axis. In a row (default), that is horizontal. Use space-between, space-around, center, flex-start, or flex-end.'},
    {id:'fb2',question:'Which flex item property prevents an item from shrinking smaller than its defined size?',type:'multiple-choice',options:['flex-grow: 0','flex-shrink: 0','flex-basis: auto','order: 0'],correct:1,explanation:'flex-shrink: 0 prevents the item from shrinking. This is essential for logos, icons, and fixed-width sidebars that should not compress.'},
  ],
  quiz:[
    {id:'fq1',question:'How do you perfectly center content both horizontally and vertically with flexbox?',options:['text-align:center only','display:flex + justify-content:center + align-items:center','margin:auto on child','padding:50%'],correct:1,explanation:'display:flex + justify-content:center + align-items:center on the container centers all children. The container needs a defined height/width to center against.'},
    {id:'fq2',question:'What does flex: 1 mean?',options:['Fixed width of 1px','flex-grow:1, flex-shrink:1, flex-basis:0 — item fills available space equally','Only grow, never shrink','Nothing'],correct:1,explanation:'flex: 1 is shorthand for flex-grow:1 shrink:1 basis:0. Multiple items with flex:1 share available space equally — very useful for equal-width columns.'},
  ],
};
