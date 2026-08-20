import type { CssLesson } from '../css-curriculum';
export const cssAnimationsLesson: CssLesson = {
  id:'css-animations',title:'Transitions & Animations',slug:'animations',
  chapter:'advanced',order:9,difficulty:'intermediate',readingTime:12,
  description:'Add smooth transitions, transforms, and keyframe animations to make your UI feel polished and alive.',
  sections:[
    {type:'text',content:'CSS animations make interfaces feel responsive and alive. There are two ways to animate in CSS: transitions (animate between two states) and animations (keyframe-based, can loop, have multiple steps).'},
    {type:'heading',content:'CSS Transitions'},
    {type:'code',language:'css',content:'transition animates changes between CSS states. Specify which property to animate, the duration, and the easing function. Transitions fire when the property value changes — most commonly on :hover. Use ease-out for natural-feeling motion.',code:`/* transition: property duration timing-function delay */
.btn {
  background: #2563eb;
  transition: background 0.2s ease;  /* animate background over 200ms */
}
.btn:hover { background: #1d4ed8; }

/* Transition multiple properties */
.card {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.15);
}

/* Transition ALL properties (use carefully — can be slow) */
.element { transition: all 0.3s ease; }

/* Timing functions */
transition-timing-function: ease;         /* slow-fast-slow (default) */
transition-timing-function: ease-in;      /* slow start */
transition-timing-function: ease-out;     /* slow end */
transition-timing-function: ease-in-out;  /* slow both ends */
transition-timing-function: linear;       /* constant speed */
transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); /* custom bounce */`},
    {type:'heading',content:'CSS Transforms'},
    {type:'code',language:'css',content:'transform moves, rotates, scales, or skews elements without affecting document layout — neighboring elements do not move. translateX/Y moves in pixels. scale() resizes. rotate() spins. Combining transforms in one declaration applies them right to left.\\',code:`/* transform doesn't affect layout — no reflow */

/* Translate — move */
.move { transform: translateX(50px); }    /* right 50px */
.move { transform: translateY(-20px); }   /* up 20px */
.move { transform: translate(50px, -20px); } /* both */
.move { transform: translateZ(100px); }   /* 3D depth */

/* Scale — resize */
.grow   { transform: scale(1.05); }   /* 5% larger */
.shrink { transform: scale(0.95); }   /* 5% smaller */
.icon   { transform: scaleX(1.1); }   /* only horizontal */

/* Rotate */
.spin90 { transform: rotate(90deg); }
.spin   { transform: rotate(360deg); }
.tilt   { transform: rotate(-5deg); }
.tilt3d { transform: rotateY(20deg); }

/* Skew */
.italic { transform: skewX(-10deg); }

/* Multiple transforms */
.complex { transform: translate(20px, -10px) scale(1.1) rotate(5deg); }

/* transform-origin — pivot point */
.pivot { transform-origin: top left; }    /* rotate from top-left */
.pivot { transform-origin: 50% 50%; }     /* default: center */

/* 3D transforms */
.card {
  transform-style: preserve-3d;
  perspective: 1000px;
}
.card:hover { transform: rotateY(180deg); }`},
    {type:'heading',content:'CSS Keyframe Animations'},
    {type:'code',language:'css',content:'@keyframes names an animation sequence with percentage waypoints. from is 0%, to is 100%. animation-name attaches it to an element. duration sets how long one cycle takes. iteration-count:infinite loops forever. fill-mode:both keeps the final state after the animation ends.',code:`/* Define the animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.05); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Apply the animation */
.hero-text {
  animation: fadeIn 0.6s ease-out;
  /*         name   duration timing */
}

.loader {
  animation: spin 1s linear infinite;
  /*                           ↑ loop forever */
}

.pulse-btn {
  animation: pulse 2s ease-in-out infinite;
}

/* All animation properties */
.element {
  animation-name: fadeIn;
  animation-duration: 0.5s;
  animation-timing-function: ease-out;
  animation-delay: 0.2s;          /* wait 200ms before starting */
  animation-iteration-count: 1;   /* or infinite */
  animation-direction: normal;    /* or reverse, alternate */
  animation-fill-mode: forwards;  /* keep final state after finishing */
  animation-play-state: running;  /* or paused */
}`},
    {type:'heading',content:'Skeleton Loading Animation'},
    {type:'code',language:'css',content:'Performance tip: only animate opacity and transform — these are handled by the GPU and do not trigger layout recalculations (reflow). Animating width, height, or top/left forces the browser to recalculate the layout every frame, which causes jank on low-end devices.',code:`/* Common pattern: skeleton loading placeholder */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  background: linear-gradient(90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-text  { height: 16px; width: 80%; margin-bottom: 8px; }
.skeleton-title { height: 24px; width: 60%; margin-bottom: 16px; }
.skeleton-img   { height: 200px; width: 100%; margin-bottom: 16px; }`},
    {type:'tryit',title:'Try It: Animations',
     html:`<div class="demo">
  <h2>Hover Transitions</h2>
  <div class="button-row">
    <button class="btn-lift">Lift on Hover</button>
    <button class="btn-scale">Scale on Hover</button>
    <button class="btn-slide">Slide Effect</button>
  </div>

  <h2>Keyframe Animations</h2>
  <div class="anim-row">
    <div class="box fade-in">Fade In</div>
    <div class="box pulse">Pulse</div>
    <div class="spin-loader">⟳</div>
  </div>

  <h2>Skeleton Loading</h2>
  <div class="skeleton-card">
    <div class="skeleton skeleton-img"></div>
    <div class="skeleton skeleton-title"></div>
    <div class="skeleton skeleton-text"></div>
    <div class="skeleton skeleton-text" style="width:60%"></div>
  </div>
</div>`,
     css:`body{font-family:system-ui,sans-serif;padding:20px;background:#f9fafb;}
h2{font-size:13px;text-transform:uppercase;letter-spacing:.05em;color:#6b7280;margin:20px 0 10px;}
.button-row,.anim-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:8px;}
.btn-lift,.btn-scale,.btn-slide{padding:10px 20px;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:14px;}
.btn-lift{background:#2563eb;color:white;transition:transform .2s ease,box-shadow .2s ease;}
.btn-lift:hover{transform:translateY(-4px);box-shadow:0 8px 20px rgba(37,99,235,.4);}
.btn-scale{background:#7c3aed;color:white;transition:transform .15s ease;}
.btn-scale:hover{transform:scale(1.08);}
.btn-slide{background:#059669;color:white;position:relative;overflow:hidden;transition:color .3s;}
.btn-slide::after{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:rgba(255,255,255,.2);transition:left .3s;}
.btn-slide:hover::after{left:100%;}
@keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@keyframes spin{to{transform:rotate(360deg)}}
.box{padding:16px 24px;border-radius:10px;font-weight:700;color:white;}
.fade-in{background:#2563eb;animation:fadeIn .8s ease-out both;}
.pulse{background:#dc2626;animation:pulse 2s ease-in-out infinite;}
.spin-loader{font-size:32px;animation:spin 1s linear infinite;display:inline-block;}
.skeleton-card{background:white;border:1px solid #e5e7eb;border-radius:12px;padding:16px;max-width:280px;}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
.skeleton{background:linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;border-radius:4px;}
.skeleton-img{height:140px;width:100%;margin-bottom:12px;}
.skeleton-title{height:20px;width:70%;margin-bottom:10px;}
.skeleton-text{height:14px;width:90%;margin-bottom:8px;}`,
     mode:'html'},
  ],
  exercises:[{id:'an1',question:'What is the difference between transition and animation in CSS?',type:'multiple-choice',options:['No difference','Transition animates between two states (triggered by state change), animation uses keyframes and can loop','Animation is only for transforms','Transition requires JavaScript'],correct:1,explanation:'Transitions animate between two CSS states (e.g., hover → normal). Animations use @keyframes for multi-step sequences, can loop infinitely, and run on page load without needing a state change.'}],
  quiz:[{id:'aq1',question:'Which animation-fill-mode value keeps an element in its final animation state after it ends?',options:['none','backwards','forwards','both'],correct:2,explanation:'animation-fill-mode: forwards keeps the element in the state defined by the last keyframe after the animation ends. Without it, the element snaps back to its original state.'}],
};
