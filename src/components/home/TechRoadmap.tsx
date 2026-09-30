'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { technologies } from '@/data/technologies';
import { roadmaps } from '@/data/roadmaps';
import type { Technology } from '@/lib/types';
import { ArrowRight } from 'lucide-react';
import styles from './TechRoadmap.module.css';

function getTech(id: string): Technology {
  const t = technologies.find((tech) => tech.id === id);
  if (!t) throw new Error(`Unknown technology id: ${id}`);
  return t;
}

function hrefFor(t: Technology): string {
  if (t.id === 'html') return '/html';
  if (t.id === 'css') return '/css';
  if (t.id === 'javascript') return '/js';
  if (t.id === 'typescript') return '/learn/typescript';
  if (t.id === 'react') return '/learn/react';
  if (t.id === 'nextjs') return '/learn/nextjs';
  if (t.id === 'nodejs') return '/learn/nodejs';
  return `/learn/${t.slug}`;
}

const TOTAL_LESSONS = technologies.reduce((sum, t) => sum + t.topics.length, 0);

// Real topic titles pulled from src/data/technologies.ts (excluding generic
// "Introduction"/"References"/"Quick Reference" entries) — used for the
// "In this course" previews shown on the trunk cards and hover tooltips.
const TOPIC_PREVIEW: Record<string, string[]> = {
  html: ['Semantic HTML', 'Forms', 'Tables', 'Responsive Design'],
  css: ['Flexbox', 'CSS Grid', 'Transitions & Animations', 'Responsive Design'],
  javascript: ['Functions', 'Async/Await', 'DOM', 'Event Loop'],
  git: ['Branching', 'Merging and Rebasing', 'Remote Repositories', 'Undoing Changes'],
  typescript: ['Type Guards', 'Generics', 'Utility Types', 'TypeScript with React'],
  react: ['State (useState)', 'useEffect Hook', 'Context API', 'Custom Hooks'],
  nextjs: ['File-Based Routing', 'Server Components', 'Data Fetching', 'API Routes'],
  nodejs: ['HTTP Server', 'Middleware', 'REST API', 'Async Patterns'],
  express: ['Routing Basics', 'Middleware', 'Authentication', 'Input Validation'],
  restapi: ['HTTP Methods', 'HTTP Status Codes', 'REST URL Design', 'REST API Best Practices'],
  docker: ['Docker Images', 'Docker Containers', 'Dockerfile', 'Docker Compose'],
  sql: ['JOINs', 'Aggregate Functions', 'Subqueries and Views', 'Indexes and Constraints'],
  postgresql: ['Joins and Relationships', 'Aggregation and Grouping', 'Transactions', 'Indexes and Performance'],
  sqlite: ['CRUD Operations', 'Relationships and Foreign Keys', 'SQLite with Node.js', 'SQLite vs PostgreSQL vs MySQL'],
  mongodb: ['CRUD Operations', 'Aggregation Pipeline', 'Mongoose ODM', 'Data Relationships'],
  redis: ['Data Structures', 'Expiry and TTL', 'Caching Patterns', 'Pub/Sub and Queues'],
};

// ---------------------------------------------------------------------------
// Walker (animated guide) state machine
// ---------------------------------------------------------------------------

type Mood = '📖' | '🤔' | '💻' | '🙂' | '😃' | '🎉';
interface Waypoint { x: number; y: number; mood: Mood; text: string; dwell: number }

const TRUNK: Waypoint[] = [
  { x: 580, y: 120, mood: '📖', text: 'Reading HTML…', dwell: 4400 },
  { x: 580, y: 250, mood: '📖', text: 'Reading CSS…', dwell: 4400 },
  { x: 580, y: 380, mood: '📖', text: 'Reading JavaScript…', dwell: 4400 },
  { x: 580, y: 510, mood: '📖', text: 'Learning Git…', dwell: 4200 },
  { x: 580, y: 510, mood: '🤔', text: 'Which path next?', dwell: 4800 },
];

const BRANCHES: Record<'frontend' | 'backend', Waypoint[]> = {
  frontend: [
    { x: 260, y: 640, mood: '💻', text: 'Building with TypeScript…', dwell: 4600 },
    { x: 180, y: 770, mood: '💻', text: 'Building with React…', dwell: 4400 },
    { x: 300, y: 900, mood: '🎉', text: 'Frontend track done!', dwell: 5000 },
  ],
  backend: [
    { x: 580, y: 640, mood: '💻', text: 'Building with Node.js…', dwell: 4600 },
    { x: 680, y: 770, mood: '💻', text: 'Adding Express…', dwell: 4400 },
    { x: 560, y: 900, mood: '💻', text: 'Building the API…', dwell: 4400 },
    { x: 680, y: 1030, mood: '🎉', text: 'Backend track done!', dwell: 5000 },
  ],
};

const DB_LEAVES = [
  { name: 'SQL', x: 750 },
  { name: 'PostgreSQL', x: 845 },
  { name: 'SQLite', x: 940 },
  { name: 'MongoDB', x: 1035 },
  { name: 'Redis', x: 1130 },
];

function pickBranch(): Waypoint[] {
  const choice = (['frontend', 'backend', 'database'] as const)[Math.floor(Math.random() * 3)];
  if (choice !== 'database') return BRANCHES[choice];
  const leaf = DB_LEAVES[Math.floor(Math.random() * DB_LEAVES.length)];
  return [
    { x: 940, y: 640, mood: '🤔', text: 'Choosing a database…', dwell: 4400 },
    { x: leaf.x, y: 780, mood: '💻', text: `Trying ${leaf.name}…`, dwell: 4600 },
    { x: 940, y: 640, mood: '🎉', text: 'Database track done!', dwell: 5000 },
  ];
}

const MOOD_TO_CLASS: Record<Mood, string> = {
  '📖': styles.moodRead,
  '🤔': styles.moodThink,
  '💻': styles.moodType,
  '🙂': styles.moodCelebrate,
  '😃': styles.moodCelebrate,
  '🎉': styles.moodCelebrate,
};

function Walker() {
  const [sequence, setSequence] = useState<Waypoint[]>(TRUNK);
  const [step, setStep] = useState(0);
  const [bubbleSide, setBubbleSide] = useState<'left' | 'right'>('right');
  const [phase, setPhase] = useState<'typing' | 'text'>('typing');
  const [moveState, setMoveState] = useState<'walking' | 'arrived'>('walking');

  useEffect(() => {
    const current = sequence[step];
    const dwellTimer = setTimeout(() => {
      const nextSide = Math.random() < 0.5 ? 'left' : 'right';
      if (sequence === TRUNK && step === TRUNK.length - 1) {
        setSequence(TRUNK.concat(pickBranch()));
        setStep(TRUNK.length);
      } else if (step + 1 >= sequence.length) {
        setSequence(TRUNK);
        setStep(0);
      } else {
        setStep(step + 1);
      }
      setBubbleSide(nextSide);
      setPhase('typing');
      setMoveState('walking');
    }, current.dwell);

    const phaseTimer = setTimeout(() => setPhase('text'), 900);
    const arriveTimer = setTimeout(() => setMoveState('arrived'), 2200);

    return () => {
      clearTimeout(dwellTimer);
      clearTimeout(phaseTimer);
      clearTimeout(arriveTimer);
    };
  }, [sequence, step]);

  const w = sequence[step];
  const prev = step > 0 ? sequence[step - 1] : w;
  const dx = w.x - prev.x;
  const facingLeft = moveState === 'walking' && dx < -2;
  const moodClass = moveState === 'walking' ? styles.moodWalk : MOOD_TO_CLASS[w.mood];
  const bubbleLeft = bubbleSide === 'right' ? w.x + 10 : w.x - 245;
  const bubbleTop = w.y - 215;

  return (
    <>
      <div
        className={styles.walkerRing}
        style={{ position: 'absolute', left: w.x - 40, top: w.y - 40, width: 80, height: 80, borderRadius: 9999, background: 'rgba(37,99,235,0.22)', zIndex: 4 }}
      />
      <div
        className={[
          styles.walkerBubble,
          bubbleSide === 'right' ? styles.sideRight : styles.sideLeft,
          phase === 'typing' ? styles.isTyping : '',
          moveState === 'walking' ? styles.bubbleClosed : styles.bubbleOpen,
        ].join(' ')}
        style={{ position: 'absolute', left: bubbleLeft, top: bubbleTop, width: 235, height: 205, zIndex: 6 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.cloudImg} src="/roadmap/bubble-cloud.png" alt="" />
        <div className={styles.bubbleTextArea}>
          <span className={styles.typingDots}><span /><span /><span /></span>
          <span className={styles.bubbleText}>{w.mood} {w.text}</span>
        </div>
      </div>
      <div
        className={[styles.walker, moodClass, facingLeft ? styles.walkerFaceLeft : ''].join(' ')}
        style={{ position: 'absolute', left: w.x - 30, top: w.y - 30, width: 60, height: 60, zIndex: 5 }}
      >
        <video className={`${styles.walkerClip} ${styles.clipWalk}`} autoPlay loop muted playsInline>
          <source src="/roadmap/walker-walk.webm" type="video/webm" />
        </video>
        <video className={`${styles.walkerClip} ${styles.clipRead}`} autoPlay loop muted playsInline>
          <source src="/roadmap/walker-read.webm" type="video/webm" />
        </video>
        <video className={`${styles.walkerClip} ${styles.clipThink}`} autoPlay loop muted playsInline>
          <source src="/roadmap/walker-think.webm" type="video/webm" />
        </video>
        <video className={`${styles.walkerClip} ${styles.clipType}`} autoPlay loop muted playsInline>
          <source src="/roadmap/walker-type.webm" type="video/webm" />
        </video>
        <video className={`${styles.walkerClip} ${styles.clipCelebrate}`} autoPlay loop muted playsInline>
          <source src="/roadmap/walker-celebrate.webm" type="video/webm" />
        </video>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Node rendering
// ---------------------------------------------------------------------------

interface LabelSpec { left: number; top: number; width: number; align: 'left' | 'right' | 'center' }
interface DotSpec { left: number; top: number; size: number }
interface TipSpec { left: number; top: number }

function TechNode({
  id, x, y, size, fontSize, dot, label, tip, logoOverride,
}: {
  id: string; x: number; y: number; size: number; fontSize: number;
  dot: DotSpec; label: LabelSpec; tip?: TipSpec;
  logoOverride?: React.CSSProperties;
}) {
  const t = getTech(id);
  const dotColor = t.difficulty === 'beginner' ? '#059669' : '#2563eb';
  const topics = TOPIC_PREVIEW[id];

  return (
    <>
      <Link
        href={hrefFor(t)}
        className={[styles.nodeCircle, tip ? styles.hvTrigger : ''].join(' ')}
        style={{
          position: 'absolute', left: x, top: y, width: size, height: size,
          borderRadius: 9999, background: t.bgColor, border: `2.5px solid ${t.color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize,
          boxShadow: '0 6px 14px -4px rgba(0,0,0,0.18), 0 0 0 6px var(--bg-section)',
          ...logoOverride,
        }}
      >
        {t.logo}
      </Link>
      {tip && topics && (
        <div
          className={styles.hvTip}
          style={{
            left: tip.left, top: tip.top, width: 190, boxSizing: 'border-box', padding: '10px 14px',
            borderRadius: 12, background: 'var(--card)', border: '1px solid var(--line)',
            boxShadow: '0 8px 20px -6px rgba(0,0,0,0.2)',
          }}
        >
          <span style={{ display: 'block', fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-3)', marginBottom: 4 }}>
            In this course · {t.topics.length} lessons
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.5 }}>{topics.join(' · ')}</span>
        </div>
      )}
      <span
        style={{ position: 'absolute', left: dot.left, top: dot.top, width: dot.size, height: dot.size, borderRadius: 9999, background: dotColor, border: '2px solid var(--bg-section)' }}
      />
      <div style={{ position: 'absolute', left: label.left, top: label.top, width: label.width, fontSize: 13, fontWeight: 800, color: 'var(--text)', textAlign: label.align }}>
        {t.name}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Desktop diagram
// ---------------------------------------------------------------------------

function DesktopDiagram() {
  const dbTechIds = ['sql', 'postgresql', 'sqlite', 'mongodb', 'redis'];
  const dbLessonTotal = dbTechIds.reduce((sum, id) => sum + getTech(id).topics.length, 0);

  return (
    <div className={styles.diagram}>
      <svg width={1180} height={1140} viewBox="0 0 1180 1140" style={{ position: 'absolute', left: 0, top: 0, width: 1180, height: 1140, overflow: 'visible' }}>
        <path
          d="M 580 120 L 580 250 L 580 380 L 580 510 C 580 575, 260 575, 260 640 C 260 705, 180 705, 180 770 C 180 835, 300 835, 300 900 M 580 510 L 580 640 C 580 705, 680 705, 680 770 C 680 835, 560 835, 560 900 C 560 965, 680 965, 680 1030 M 580 510 C 580 575, 940 575, 940 640"
          fill="none" style={{ stroke: 'var(--line-2)' }} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d="M 580 120 L 580 250 L 580 380 L 580 510 C 580 575, 260 575, 260 640 C 260 705, 180 705, 180 770 C 180 835, 300 835, 300 900 M 580 510 L 580 640 C 580 705, 680 705, 680 770 C 680 835, 560 835, 560 900 C 560 965, 680 965, 680 1030 M 580 510 C 580 575, 940 575, 940 640"
          fill="none" style={{ stroke: 'var(--bg-section)' }} strokeWidth={4} strokeLinecap="round" strokeDasharray="2 18"
        />
        <path d="M 940 640 C 940 710, 750 710, 750 780" fill="none" stroke="#94a3b8" strokeWidth={3} strokeLinecap="round" strokeDasharray="5 6" />
        <path d="M 940 640 C 940 710, 845 710, 845 780" fill="none" stroke="#94a3b8" strokeWidth={3} strokeLinecap="round" strokeDasharray="5 6" />
        <path d="M 940 640 L 940 780" fill="none" stroke="#94a3b8" strokeWidth={3} strokeLinecap="round" strokeDasharray="5 6" />
        <path d="M 940 640 C 940 710, 1035 710, 1035 780" fill="none" stroke="#94a3b8" strokeWidth={3} strokeLinecap="round" strokeDasharray="5 6" />
        <path d="M 940 640 C 940 710, 1130 710, 1130 780" fill="none" stroke="#94a3b8" strokeWidth={3} strokeLinecap="round" strokeDasharray="5 6" />
      </svg>

      <div style={{ position: 'absolute', left: 940, top: 90, width: 210, boxSizing: 'border-box', padding: '18px 20px', borderRadius: 16, background: 'var(--card)', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 10, boxShadow: '0 4px 14px -6px rgba(0,0,0,0.08)' }}>
        <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-3)' }}>Map key</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: 9999, background: '#059669', flexShrink: 0 }} /><span style={{ fontSize: 12, color: 'var(--text-2)' }}>Beginner friendly</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: 9999, background: '#2563eb', flexShrink: 0 }} /><span style={{ fontSize: 12, color: 'var(--text-2)' }}>Some experience helps</span></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 16, height: 3, borderRadius: 2, background: '#94a3b8', flexShrink: 0 }} /><span style={{ fontSize: 12, color: 'var(--text-2)' }}>Optional — pick one</span></div>
      </div>

      {(() => {
        const fullstack = roadmaps.find((r) => r.id === 'fullstack')!;
        return (
          <Link
            href={`/roadmaps/${fullstack.slug}`}
            className={styles.nodeCircle}
            style={{
              position: 'absolute', left: 940, top: 280, width: 210, boxSizing: 'border-box',
              padding: '18px 20px', borderRadius: 16, background: 'var(--card)', border: `1.5px solid ${fullstack.color}33`,
              display: 'flex', flexDirection: 'column', gap: 8, boxShadow: '0 4px 14px -6px rgba(0,0,0,0.08)',
            }}
          >
            <span style={{ fontSize: 22 }}>{fullstack.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text)' }}>Want the full path?</span>
            <span style={{ fontSize: 11, lineHeight: 1.5, color: 'var(--text-3)' }}>
              See the complete {fullstack.title} roadmap — {fullstack.estimatedTime}, step by step.
            </span>
            <span style={{ fontSize: 11, fontWeight: 800, color: fullstack.color, display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              View the roadmap <ArrowRight style={{ width: 12, height: 12 }} />
            </span>
          </Link>
        );
      })()}

      <div style={{ position: 'absolute', left: 760, top: 960, width: 380, boxSizing: 'border-box', padding: '18px 22px', borderRadius: 16, background: 'var(--bg-section)', border: '1px solid var(--line)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
        <span style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--text-2)' }}><b style={{ color: 'var(--text)' }}>Tip:</b> Master the trunk — HTML, CSS, JavaScript and Git — before picking a track. Everything branches from here.</span>
      </div>

      <span style={{ position: 'absolute', left: 525, top: 20, width: 110, boxSizing: 'border-box', padding: '6px 0', borderRadius: 999, background: 'var(--card)', border: '1.5px solid #2563eb', color: '#2563eb', fontSize: 11, fontWeight: 800, textAlign: 'center', whiteSpace: 'nowrap' }}>🚀 START</span>

      {/* Trunk */}
      <TechNode id="html" x={544} y={84} size={72} fontSize={30} dot={{ left: 598, top: 138, size: 14 }} label={{ left: 630, top: 105, width: 132, align: 'left' }} />
      <TechNode id="css" x={544} y={214} size={72} fontSize={30} dot={{ left: 598, top: 268, size: 14 }} label={{ left: 630, top: 235, width: 132, align: 'left' }} />
      <TechNode id="javascript" x={544} y={344} size={72} fontSize={30} dot={{ left: 598, top: 398, size: 14 }} label={{ left: 630, top: 365, width: 132, align: 'left' }} />
      <TechNode id="git" x={544} y={474} size={72} fontSize={30} dot={{ left: 598, top: 528, size: 14 }} label={{ left: 630, top: 495, width: 132, align: 'left' }} />

      <span style={{ position: 'absolute', left: 205, top: 570, width: 110, fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#2563eb', textAlign: 'center' }}>Frontend</span>
      <TechNode id="typescript" x={224} y={604} size={72} fontSize={30} dot={{ left: 278, top: 658, size: 14 }} label={{ left: 310, top: 625, width: 132, align: 'left' }} tip={{ left: 165, top: 544 }} />
      <TechNode id="react" x={144} y={734} size={72} fontSize={30} dot={{ left: 198, top: 788, size: 14 }} label={{ left: 230, top: 755, width: 132, align: 'left' }} tip={{ left: 85, top: 674 }} />
      <TechNode id="nextjs" x={264} y={864} size={72} fontSize={30} dot={{ left: 318, top: 918, size: 14 }} label={{ left: 350, top: 885, width: 132, align: 'left' }} tip={{ left: 205, top: 804 }} />

      <span style={{ position: 'absolute', left: 530, top: 570, width: 100, fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#2563eb', textAlign: 'center' }}>Backend</span>
      <TechNode id="nodejs" x={544} y={604} size={72} fontSize={30} dot={{ left: 598, top: 658, size: 14 }} label={{ left: 514, top: 686, width: 132, align: 'center' }} tip={{ left: 485, top: 544 }} />
      <TechNode id="express" x={644} y={734} size={72} fontSize={30} dot={{ left: 698, top: 788, size: 14 }} label={{ left: 498, top: 755, width: 132, align: 'right' }} tip={{ left: 585, top: 674 }} />
      <TechNode id="restapi" x={524} y={864} size={72} fontSize={30} dot={{ left: 578, top: 918, size: 14 }} label={{ left: 610, top: 885, width: 132, align: 'left' }} tip={{ left: 465, top: 804 }} />
      <TechNode id="docker" x={644} y={994} size={72} fontSize={30} dot={{ left: 698, top: 1048, size: 14 }} label={{ left: 498, top: 1015, width: 132, align: 'right' }} tip={{ left: 585, top: 934 }} />

      {/* Databases hub (not a single technology — a grouping of 5) */}
      <div style={{ position: 'absolute', left: 898, top: 598, width: 84, height: 84, borderRadius: 9999, background: 'var(--card)', border: '3px solid #2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, boxShadow: '0 8px 18px -4px rgba(37,99,235,0.28), 0 0 0 6px var(--bg-section)' }}>🗄️</div>
      <div style={{ position: 'absolute', left: 870, top: 692, width: 140, fontSize: 16, fontWeight: 800, color: 'var(--text)', textAlign: 'center' }}>Databases</div>
      <div style={{ position: 'absolute', left: 840, top: 714, width: 200, fontSize: 11, lineHeight: 1.4, color: 'var(--text-3)', textAlign: 'center' }}>5 options · {dbLessonTotal} lessons combined — pick what you need</div>

      <TechNode id="sql" x={722} y={752} size={56} fontSize={22} dot={{ left: 764, top: 794, size: 12 }} label={{ left: 705, top: 816, width: 90, align: 'center' }} tip={{ left: 655, top: 692 }} />
      <TechNode id="postgresql" x={817} y={752} size={56} fontSize={22} dot={{ left: 859, top: 794, size: 12 }} label={{ left: 800, top: 816, width: 90, align: 'center' }} tip={{ left: 750, top: 692 }} />
      <TechNode id="sqlite" x={912} y={752} size={56} fontSize={22} dot={{ left: 954, top: 794, size: 12 }} label={{ left: 895, top: 816, width: 90, align: 'center' }} tip={{ left: 845, top: 692 }} />
      <TechNode id="mongodb" x={1007} y={752} size={56} fontSize={22} dot={{ left: 1049, top: 794, size: 12 }} label={{ left: 990, top: 816, width: 90, align: 'center' }} tip={{ left: 940, top: 692 }} />
      <TechNode id="redis" x={1102} y={752} size={56} fontSize={20} dot={{ left: 1144, top: 794, size: 12 }} label={{ left: 1085, top: 816, width: 90, align: 'center' }} tip={{ left: 990, top: 692 }} logoOverride={{ fontWeight: 800, color: '#DC382D' }} />

      <Walker />

      {/* Always-visible trunk topic cards — plenty of room here, no hover-gating needed */}
      {(['html', 'css', 'javascript', 'git'] as const).map((id, i) => {
        const t = getTech(id);
        return (
          <div key={id} style={{ position: 'absolute', left: 20, top: 101 + i * 130, width: 480, boxSizing: 'border-box', padding: '10px 16px', borderRadius: 12, background: 'var(--card)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-3)', width: 78, flexShrink: 0 }}>In this course</span>
            <span style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{TOPIC_PREVIEW[id].join(' · ')} — {t.topics.length} lessons</span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Responsive wrapper — same diagram on every screen size, scaled to fit
// ---------------------------------------------------------------------------

const DIAGRAM_W = 1180;
const DIAGRAM_H = 1140;

function ScaledDiagram() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / DIAGRAM_W));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: DIAGRAM_H * scale, position: 'relative', overflow: 'visible' }}>
      <div style={{ width: DIAGRAM_W, height: DIAGRAM_H, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <DesktopDiagram />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

export function TechRoadmap() {
  return (
    <section className="relative py-20" style={{ background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg-section) 100%)' }}>
      <div className="relative max-w-screen-xl mx-auto px-4 lg:px-6">
        <div className="flex flex-col items-center text-center gap-3.5 max-w-2xl mx-auto mb-10">
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide" style={{ background: 'rgba(37,99,235,0.1)', color: '#2563eb', border: '1px solid rgba(37,99,235,0.25)' }}>
            Choose Your Path
          </span>
          <h2 className="text-3xl lg:text-5xl font-black" style={{ color: 'var(--text)' }}>
            Start together. Branch off where it matters.
          </h2>
          <p className="text-base" style={{ color: 'var(--text-2)' }}>
            Everyone begins with HTML, CSS, JavaScript and Git. From there, follow a frontend track, a backend track, or just the one database you actually need — click any checkpoint to open it.
          </p>
        </div>

        <ScaledDiagram />

        <div className="flex items-center justify-between flex-wrap gap-5 pt-8 mt-8" style={{ borderTop: '1px solid var(--line)' }}>
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>{technologies.length}</span>
              <span className="text-sm" style={{ color: 'var(--text-2)' }}>technologies</span>
            </div>
            <div className="w-px h-6" style={{ background: 'var(--line)' }} />
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>{TOTAL_LESSONS}</span>
              <span className="text-sm" style={{ color: 'var(--text-2)' }}>lessons</span>
            </div>
            <div className="w-px h-6" style={{ background: 'var(--line)' }} />
            <span className="text-sm" style={{ color: 'var(--text-2)' }}>One trunk, three tracks — take what you need</span>
          </div>
          <div className="flex gap-3">
            <Link href="/technologies" className={`${styles.btnPrimary} inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm`} style={{ background: '#2563eb', color: '#ffffff' }}>
              Explore all technologies <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
