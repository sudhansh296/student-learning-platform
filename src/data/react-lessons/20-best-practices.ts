import type { ReactLesson } from '../react-curriculum';

export const reactBestPracticesLesson: ReactLesson = {
  id: 'react-best-practices',
  title: 'Best Practices & References',
  slug: 'best-practices',
  chapter: 'advanced',
  order: 20,
  difficulty: 'intermediate',
  readingTime: 15,
  description: 'Wrap up with professional React best practices: folder structure, component naming, Rules of Hooks, common mistakes to avoid, performance checklist, and an introduction to testing with React Testing Library.',
  sections: [
    {
      type: 'text',
      content: 'Learning React syntax is one thing — writing maintainable, scalable React code is another. This lesson covers the conventions, rules, and patterns that experienced React developers follow to keep large codebases healthy.',
    },
    {
      type: 'heading',
      content: '1. Folder Structure',
    },
    {
      type: 'example',
      title: 'A scalable React project structure',
      content: 'There is no single "correct" folder structure. The most important rule is consistency. Group by feature or by type — both work, but feature-based grouping scales better for large apps.',
      language: 'bash',
      code: `src/
├── components/           # Shared, reusable UI components
│   ├── ui/               # Generic: Button, Input, Modal, Card
│   ├── layout/           # App structure: Navbar, Footer, Sidebar
│   └── forms/            # Reusable form components
│
├── features/             # Feature-based grouping (scales well)
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── useAuth.ts    # custom hook
│   │   └── authContext.tsx
│   ├── dashboard/
│   │   ├── Dashboard.tsx
│   │   └── DashboardStats.tsx
│   └── products/
│       ├── ProductList.tsx
│       └── ProductCard.tsx
│
├── hooks/                # Global custom hooks
│   ├── useFetch.ts
│   └── useLocalStorage.ts
│
├── utils/                # Pure utility functions (no React)
│   ├── formatDate.ts
│   └── validateEmail.ts
│
├── types/                # TypeScript interfaces and types
│   └── index.ts
│
└── App.tsx`,
    },
    {
      type: 'heading',
      content: '2. Component Naming Conventions',
    },
    {
      type: 'list',
      title: 'React naming rules and conventions',
      items: [
        'Components: PascalCase — UserCard, ProductList, NavBar (required by React)',
        'Files: match the component name — UserCard.tsx, not userCard.tsx',
        'Props interfaces: suffix with Props — ButtonProps, CardProps',
        'Hooks: always start with use — useFetch, useLocalStorage, useAuth',
        'Event handlers: prefix with handle — handleClick, handleSubmit, handleChange',
        'Boolean props: prefix with is/has/can — isLoading, hasError, canEdit',
        'Context: suffix with Context — UserContext, ThemeContext',
        'Providers: suffix with Provider — UserProvider, ThemeProvider',
      ],
    },
    {
      type: 'heading',
      content: '3. Rules of Hooks',
    },
    {
      type: 'example',
      title: 'The two rules you must never break',
      content: 'React relies on the order that hooks are called. Breaking either rule causes bugs that are hard to debug — React will misidentify which state belongs to which hook.',
      language: 'jsx',
      code: `// RULE 1: Only call hooks at the top level
// Never inside conditionals, loops, or nested functions

// ❌ Wrong — hooks inside an if statement
function BadComponent({ loggedIn }) {
  if (loggedIn) {
    const [name, setName] = useState(''); // hook inside condition!
  }
}

// ✅ Correct — hooks at the top, use condition inside
function GoodComponent({ loggedIn }) {
  const [name, setName] = useState('');
  if (!loggedIn) return <Login />;
  return <p>Hello, {name}!</p>;
}

// RULE 2: Only call hooks from React functions
// Not from regular JavaScript functions, classes, or event handlers

// ❌ Wrong — hook in a regular function
function regularFunction() {
  const [count, setCount] = useState(0); // not a component or custom hook!
}

// ✅ Correct — only in components and custom hooks
function MyComponent() {
  const [count, setCount] = useState(0); // ✓ inside component
}

function useMyHook() {
  const [count, setCount] = useState(0); // ✓ inside custom hook (starts with "use")
}

// The eslint-plugin-react-hooks package enforces these rules automatically`,
    },
    {
      type: 'heading',
      content: '4. Common Mistakes to Avoid',
    },
    {
      type: 'table',
      title: 'Top React mistakes and their fixes',
      headers: ['Mistake', 'Problem', 'Fix'],
      rows: [
        ['Missing key in lists', 'React cant track which items changed', 'Use unique, stable IDs — not array index if items reorder'],
        ['Mutating state directly', 'React doesnt detect the change', 'Always return new objects/arrays: spread, filter, map'],
        ['No cleanup in useEffect', 'Memory leaks on unmount', 'Return a cleanup function from useEffect'],
        ['Too many useEffects', 'Hard to follow data flow', 'Derived values dont need effects — compute during render'],
        ['useEffect with missing deps', 'Stale closures and bugs', 'Include all values you read inside the effect in the array'],
        ['Overusing useContext', 'Unnecessary re-renders everywhere', 'Keep context values stable; split contexts by change frequency'],
        ['Giant components', 'Hard to test and maintain', 'Split into smaller focused components — aim for under 100 lines'],
      ],
    },
    {
      type: 'heading',
      content: '5. Testing with React Testing Library',
    },
    {
      type: 'example',
      title: 'Write tests that simulate user behavior',
      content: 'React Testing Library (RTL) encourages testing from the user\'s perspective — what they see and interact with — rather than implementation details. This makes tests more resilient to refactors.',
      language: 'jsx',
      code: `// Install: npm install --save-dev @testing-library/react @testing-library/user-event

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

describe('Counter component', () => {
  test('renders initial count of 0', () => {
    render(<Counter />);

    // Query by what the user sees — not by class name or ID
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  test('increments count when + button is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await user.click(screen.getByRole('button', { name: '+1' }));
    await user.click(screen.getByRole('button', { name: '+1' }));

    expect(screen.getByText('Count: 2')).toBeInTheDocument();
  });

  test('resets to 0 when Reset is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await user.click(screen.getByRole('button', { name: '+1' }));
    await user.click(screen.getByRole('button', { name: 'Reset' }));

    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });
});

// Key RTL queries (in priority order):
// getByRole        — accessible role (button, heading, textbox, etc.)
// getByLabelText   — form field by its label
// getByText        — by visible text
// getByPlaceholderText — input by placeholder
// getByTestId      — last resort: data-testid attribute`,
    },
    {
      type: 'heading',
      content: '6. Performance Checklist',
    },
    {
      type: 'list',
      title: 'Before deploying — React performance checklist',
      items: [
        'Production build: run npm run build — it enables all optimizations',
        'Large lists: use react-window or react-virtual for virtualization',
        'Images: use next/image (Next.js) or lazy loading with loading="lazy"',
        'Code splitting: use React.lazy + Suspense for route-level splitting',
        'Bundle size: analyze with webpack-bundle-analyzer or source-map-explorer',
        'Excessive re-renders: profile with React DevTools Profiler before memoizing',
        'State colocation: keep state as close to where it is used as possible',
        'Avoid creating objects/arrays in render: extract to constants outside component or use useMemo',
      ],
    },
    {
      type: 'tryit',
      title: 'Try It: Best Practices in Action',
      css: `body { font-family: system-ui, sans-serif; padding: 20px; background: #f8fafc; }
.card { background: white; border-radius: 12px; padding: 20px; margin-bottom: 14px; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
h2 { margin: 0 0 14px; font-size: 15px; color: #1e293b; }
.check-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
.check-item:last-child { border-bottom: none; }
.check-item input[type=checkbox] { width: 16px; height: 16px; cursor: pointer; }
.check-text { flex: 1; color: #374151; }
.check-text.done { text-decoration: line-through; color: #9ca3af; }
.category { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: #6b7280; margin-top: 4px; }
.progress { height: 8px; background: #e5e7eb; border-radius: 999px; overflow: hidden; margin-bottom: 8px; }
.progress-bar { height: 100%; background: linear-gradient(90deg, #2563eb, #7c3aed); border-radius: 999px; transition: width .3s; }
.score { font-size: 13px; font-weight: 700; color: #374151; }`,
      jsx: `const checklist = [
  { id: 1, cat: 'Code Quality', text: 'Components under 100 lines of JSX' },
  { id: 2, cat: 'Code Quality', text: 'Meaningful component and variable names' },
  { id: 3, cat: 'Hooks', text: 'All hook calls at top level (no conditions)' },
  { id: 4, cat: 'Hooks', text: 'useEffect has correct dependency array' },
  { id: 5, cat: 'State', text: 'State is colocated close to where its used' },
  { id: 6, cat: 'State', text: 'No direct state mutation (spread, filter, map)' },
  { id: 7, cat: 'Performance', text: 'Lists have stable unique keys' },
  { id: 8, cat: 'Performance', text: 'useEffect cleanup function returns on unmount' },
  { id: 9, cat: 'TypeScript', text: 'All component props have typed interfaces' },
  { id: 10, cat: 'Testing', text: 'Core user interactions have test coverage' },
];

function App() {
  const [checked, setChecked] = React.useState(new Set());

  function toggle(id) {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const pct = Math.round((checked.size / checklist.length) * 100);
  const cats = [...new Set(checklist.map(i => i.cat))];

  return (
    <div>
      <div className="card">
        <h2>✅ React Best Practices Checklist</h2>
        <div className="progress">
          <div className="progress-bar" style={{ width: pct + '%' }} />
        </div>
        <div className="score">{checked.size}/{checklist.length} complete — {pct}%</div>
      </div>
      {cats.map(cat => (
        <div key={cat} className="card">
          <div className="category">{cat}</div>
          {checklist.filter(i => i.cat === cat).map(item => (
            <div key={item.id} className="check-item">
              <input type="checkbox" checked={checked.has(item.id)}
                onChange={() => toggle(item.id)} />
              <span className={"check-text" + (checked.has(item.id) ? " done" : "")}>
                {item.text}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);`,
    },
  ],
  exercises: [
    {
      id: 'bp-1',
      question: 'What is the first Rule of Hooks?',
      type: 'multiple-choice',
      options: [
        'Hooks must be exported from their module',
        'Only call hooks at the top level — never inside conditions, loops, or nested functions',
        'Hooks can only be used in class components',
        'You can only call one hook per component',
      ],
      correct: 1,
      explanation: 'The first Rule of Hooks: always call hooks at the top level of your React function. Never call hooks inside if statements, loops, or nested functions. React depends on the consistent order of hook calls to associate state with the right hook.',
    },
    {
      id: 'bp-2',
      question: 'What does React Testing Library encourage testing against?',
      type: 'multiple-choice',
      options: [
        'Implementation details like component state and class names',
        'What the user sees and interacts with — accessible roles, visible text, labels',
        'The internal React component tree structure',
        'The exact HTML output of components',
      ],
      correct: 1,
      explanation: 'React Testing Library promotes testing from the user\'s perspective. Query elements by accessible role (getByRole), visible text (getByText), or label (getByLabelText). Avoid querying by class names or internal state — those are implementation details that may change without affecting user behavior.',
    },
  ],
  quiz: [
    {
      id: 'rbpq1',
      question: 'When is the best time to add React.memo, useMemo, and useCallback optimizations?',
      options: [
        'Always — add them to every component and value from the start',
        'Never — React handles optimization automatically',
        'After measuring a real performance problem with the profiler',
        'Only in TypeScript projects',
      ],
      correct: 2,
      explanation: 'Premature optimization is the root of much complexity. React.memo, useMemo, and useCallback have real costs: they add code complexity, increase memory usage, and have their own comparison overhead. Add them only after profiling with React DevTools Profiler reveals an actual performance bottleneck.',
    },
  ],
};
