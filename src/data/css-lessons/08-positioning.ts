import type { CssLesson } from '../css-curriculum';
export const cssPositioningLesson: CssLesson = {
  id:'css-positioning',title:'CSS Positioning',slug:'positioning',
  chapter:'layout',order:8,difficulty:'intermediate',readingTime:12,
  description:'Master CSS position values — static, relative, absolute, fixed, sticky — and z-index.',
  sections:[
    {type:'text',content:'CSS positioning lets you place elements exactly where you want them, removing them from the normal document flow. Understanding the five position values is essential for building navigation bars, modals, tooltips, dropdowns, and sticky sidebars.'},
    {type:'heading',content:'The Five Position Values'},
    {type:'code',language:'css',content:'The position property controls how an element is placed. static is the default — elements flow in the document. relative moves an element from its normal position without affecting others. absolute removes it from flow and places it relative to the nearest positioned ancestor. fixed stays in the viewport. sticky is a hybrid.',code:`/* 1. static — default, normal document flow */
div { position: static; }  /* top/left/right/bottom have NO effect */

/* 2. relative — offset from its normal position, stays in flow */
.badge {
  position: relative;
  top: -4px;    /* move 4px UP from where it would normally be */
  left: 10px;   /* move 10px RIGHT */
}
/* The space it WOULD have occupied is preserved */

/* 3. absolute — positioned relative to nearest positioned ancestor */
.tooltip {
  position: absolute;
  top: 100%;    /* directly below the parent */
  left: 0;
  /* Removed from normal flow — other elements ignore it */
}
/* IMPORTANT: parent must have position: relative */

/* 4. fixed — stays in viewport, doesn't scroll */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;   /* or: width: 100% */
  z-index: 100;
}

/* 5. sticky — relative until scrolled to threshold, then fixed */
.table-header {
  position: sticky;
  top: 0;   /* sticks when it reaches 0px from top of viewport */
  background: white;
  z-index: 10;
}`},
    {type:'heading',content:'Absolute Positioning in Practice'},
    {type:'code',language:'css',content:'The parent-child positioning pattern: set position:relative on the container, then position:absolute on the child. The child then positions itself relative to the container using top, right, bottom, left. This is how badges, overlays, and tooltips are built.',code:`/* Pattern: position relative on parent, absolute on child */
.card {
  position: relative;  /* establishes positioning context */
}

.badge {
  position: absolute;
  top: 12px;
  right: 12px;         /* top-right corner of .card */
}

.overlay {
  position: absolute;
  inset: 0;            /* shorthand: top:0 right:0 bottom:0 left:0 */
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Center absolutely within parent */
.centered-absolutely {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* move back by half its own size */
}`},
    {type:'heading',content:'z-index — Stacking Order'},
    {type:'code',language:'css',content:'z-index controls stacking order — higher values appear on top of lower ones. It only works on positioned elements (position other than static). Define a scale: modals at 1000, dropdowns at 100, tooltips at 50. Avoid arbitrary large numbers to prevent z-index wars.',code:`/* z-index controls which element appears ON TOP */
/* Higher value = closer to user */

.navbar    { z-index: 100; }   /* always on top */
.modal     { z-index: 200; }   /* above navbar */
.tooltip   { z-index: 300; }   /* above modal */
.overlay   { z-index: 150; }

/* z-index ONLY works on positioned elements (not static) */
.no-effect { z-index: 999; }   /* does nothing if position: static */
.works     { position: relative; z-index: 999; }  /* this works */

/* Stacking context — z-index is relative within each context */
.parent { position: relative; z-index: 1; }
.child  { position: absolute; z-index: 9999; }
/* child can never appear above elements that are SIBLINGS of parent
   with z-index > 1 */`},
    {type:'tryit',title:'Try It: Positioning',
     html:`<div class="demo">
  <h2>1. Relative + Absolute (Badge)</h2>
  <div class="card">
    <img src="https://placehold.co/300x150/2563eb/white?text=Course" alt="course" style="width:100%;border-radius:8px;display:block;">
    <span class="badge">New</span>
    <h3>JavaScript Tutorial</h3>
    <p>Complete guide to modern JavaScript.</p>
  </div>

  <h2>2. Fixed Navbar (scroll to see)</h2>
  <div class="fake-scroll">
    <p>Scroll inside this box →</p>
    <div style="height:300px;padding-top:60px;">
      <div class="sticky-header">Sticky Header</div>
      <p style="color:#374151;line-height:2">Content line 1<br>Content line 2<br>Content line 3<br>Content line 4<br>Content line 5<br>Content line 6</p>
    </div>
  </div>

  <h2>3. Centered Modal</h2>
  <div class="modal-parent">
    <p style="color:#6b7280">Parent container</p>
    <div class="modal-overlay">
      <div class="modal-box">
        <h3>Modal Title</h3>
        <p>Centered absolutely!</p>
      </div>
    </div>
  </div>
</div>`,
     css:`body{font-family:system-ui,sans-serif;padding:20px;background:#f9fafb;}
h2{font-size:14px;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin:20px 0 8px;}
.card{position:relative;background:white;border:1px solid #e5e7eb;border-radius:12px;padding:16px;max-width:300px;overflow:hidden;}
.badge{position:absolute;top:12px;right:12px;background:#ef4444;color:white;font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px;}
.card h3{margin:10px 0 4px;color:#111827;}
.card p{margin:0;color:#6b7280;font-size:13px;}
.fake-scroll{position:relative;height:140px;overflow-y:auto;border:2px solid #e5e7eb;border-radius:8px;background:white;}
.sticky-header{position:sticky;top:0;background:#2563eb;color:white;padding:8px 16px;font-weight:700;font-size:13px;}
.modal-parent{position:relative;background:#e5e7eb;height:180px;border-radius:12px;display:flex;align-items:center;justify-content:center;}
.modal-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.4);border-radius:12px;display:flex;align-items:center;justify-content:center;}
.modal-box{background:white;padding:24px;border-radius:12px;text-align:center;min-width:160px;}
.modal-box h3{margin:0 0 8px;color:#111827;}
.modal-box p{margin:0;color:#6b7280;font-size:13px;}`,
     mode:'html'},
  ],
  exercises:[{id:'pos1',question:'An element with position:absolute is positioned relative to what?',type:'multiple-choice',options:['The viewport','The document root','The nearest ancestor with a position other than static','Its normal flow position'],correct:2,explanation:'Absolute positioned elements find the nearest ancestor with position: relative, absolute, fixed, or sticky. If none exists, they position relative to the viewport (initial containing block).'}],
  quiz:[{id:'pq1',question:'Which position value keeps an element visible as the user scrolls?',options:['relative','absolute','fixed','static'],correct:2,explanation:'position: fixed removes the element from document flow and fixes it relative to the viewport — it never scrolls with the page. Perfect for sticky headers and floating buttons.'}],
};
