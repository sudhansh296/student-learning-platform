import type { ReactLesson } from '../react-curriculum';

export const reactIntroLesson: ReactLesson = {
  id: 'react-intro',
  title: 'Introduction to React',
  slug: 'introduction',
  chapter: 'intro',
  order: 1,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'What React is, why it exists, how it differs from plain JavaScript, and your first React component.',
  sections: [
    {
      type: 'text',
      content: 'React is a JavaScript library for building user interfaces. Created by Meta (Facebook) in 2013, it is now used by millions of developers to build everything from simple websites to complex apps like Facebook, Instagram, Airbnb, and Netflix. React does not replace HTML, CSS, or JavaScript — it organizes them into reusable components.',
    },
    {
      type: 'analogy',
      title: 'React is like LEGO bricks',
      content: 'In plain HTML you write one big page. In React you build small, reusable pieces called components — like a Button, a Card, a Navbar. Then you assemble these pieces into pages, just like snapping LEGO bricks together. Change a brick once and every page that uses it updates automatically.',
    },
    {
      type: 'heading',
      content: 'Why Use React Instead of Plain JavaScript?',
    },
    {
      type: 'list',
      items: [
        'Components — reusable UI pieces you write once and use everywhere',
        'Declarative — describe what the UI should look like, React updates the DOM efficiently',
        'Virtual DOM — React compares changes and only updates what actually changed (fast!)',
        'Huge ecosystem — thousands of libraries built specifically for React',
        'React Native — use the same skills to build iOS and Android mobile apps',
        'Most in-demand frontend skill for jobs in 2026',
      ],
    },
    {
      type: 'heading',
      content: 'How React Works — The Big Picture',
    },
    {
      type: 'example',
      title: 'Plain JS vs React — same result, different approach',
      content: 'Plain JavaScript is imperative — you tell the browser HOW to change things step by step. React is declarative — you describe WHAT the UI should look like at any point in time, and React figures out the steps. This makes complex UIs much easier to reason about.',
      language: 'javascript',
      code: `// PLAIN JAVASCRIPT — imperative (how to do it)
const btn = document.getElementById('btn');
let count = 0;
btn.addEventListener('click', () => {
  count++;
  document.getElementById('display').textContent = count;
});

// REACT — declarative (what it should look like)
// You just say: "show this count, and when clicked, increment it"
// React handles all the DOM updates automatically
function Counter() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Click</button>
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: 'Your First React Component',
    },
    {
      type: 'example',
      title: 'A simple function component',
      content: 'A React component is just a JavaScript function that returns JSX — which looks like HTML but is actually JavaScript. The function name must start with a capital letter. You render it like an HTML tag. Props (properties) let you pass data into a component, making it reusable with different content.',
      language: 'jsx',
      code: `// A React component — just a function that returns JSX
function Welcome({ name }) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Welcome to React.</p>
    </div>
  );
}

// Render with different data — same component, different output
<Welcome name="Alice" />
<Welcome name="Bob" />
<Welcome name="Carol" />

// JSX rules:
// 1. Return ONE root element (wrap in <div> or <>)
// 2. Use className instead of class (class is a reserved JS word)
// 3. Self-close empty tags: <img /> not <img>
// 4. JavaScript expressions go in { curly braces }`,
    },
    {
      type: 'tryit',
      title: 'Try It: Your First React Component',
      css: `body { font-family: system-ui, sans-serif; padding: 20px; background: #f0f4ff; }
.card { background: white; border-radius: 12px; padding: 24px; max-width: 320px; box-shadow: 0 4px 20px rgba(0,0,0,.1); margin: 8px; display: inline-block; }
h2 { color: #2563eb; margin: 0 0 8px; }
p  { color: #6b7280; margin: 0 0 12px; font-size: 14px; }
.badge { background: #eff6ff; color: #1d4ed8; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }`,
      jsx: `function TechCard({ name, emoji, desc, level }) {
  return (
    <div className="card">
      <h2>{emoji} {name}</h2>
      <p>{desc}</p>
      <span className="badge">{level}</span>
    </div>
  );
}

function App() {
  return (
    <div>
      <TechCard
        name="HTML"
        emoji="🌐"
        desc="Structure of web pages"
        level="Beginner"
      />
      <TechCard
        name="CSS"
        emoji="🎨"
        desc="Styling and layout"
        level="Beginner"
      />
      <TechCard
        name="React"
        emoji="⚛️"
        desc="UI component library"
        level="Intermediate"
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);`,
    },
    {
      type: 'note',
      title: 'JSX is not HTML',
      content: 'JSX looks like HTML but it compiles to JavaScript. The browser never sees JSX — Babel transforms it into React.createElement() calls. This is why you use className instead of class, htmlFor instead of for, and why all tags must be closed.',
    },
  ],
  exercises: [
    {
      id: 'ri-1',
      question: 'What is a React component?',
      type: 'multiple-choice',
      options: ['An HTML file', 'A JavaScript function that returns JSX', 'A CSS class', 'A database model'],
      correct: 1,
      explanation: 'A React component is a JavaScript function (or class) that returns JSX — the UI description. Function components are the modern standard.',
    },
    {
      id: 'ri-2',
      question: 'In JSX, what do you use instead of the HTML "class" attribute?',
      type: 'multiple-choice',
      options: ['class', 'cssClass', 'className', 'style'],
      correct: 2,
      explanation: 'In JSX you use className because "class" is a reserved keyword in JavaScript. At compile time, className becomes class in the actual HTML.',
    },
  ],
  quiz: [
    {
      id: 'riq1',
      question: 'What does "declarative" mean in the context of React?',
      options: [
        'You write step-by-step DOM update instructions',
        'You describe what the UI should look like and React figures out the DOM updates',
        'React declares its own variables',
        'You must declare all components at the top of the file',
      ],
      correct: 1,
      explanation: 'Declarative means you describe the desired end state of the UI. React compares it with the current state and figures out the minimum DOM changes needed. Contrast with imperative JavaScript where you manually call DOM methods.',
    },
  ],
};
