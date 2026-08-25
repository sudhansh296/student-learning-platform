import type { ReactLesson } from '../react-curriculum';

export const reactPerformanceLesson: ReactLesson = {
  id: 'react-performance',
  title: 'Performance Optimization',
  slug: 'performance',
  chapter: 'advanced',
  order: 14,
  difficulty: 'advanced',
  readingTime: 15,
  description: 'Optimize React apps with React.memo, useMemo, and useCallback. Learn when re-renders are actually a problem and how to profile before optimizing.',
  sections: [
    {
      type: 'text',
      content: 'React is fast by default. Before optimizing, always profile first - premature optimization adds complexity without real benefit. The three main optimization tools are React.memo (skip re-rendering unchanged components), useMemo (cache expensive calculations), and useCallback (cache function references).',
    },
    {
      type: 'warning',
      title: 'Optimize only when you measure a problem',
      content: 'Adding React.memo, useMemo, and useCallback to everything is not better - it adds overhead and complexity. Profile your app first. Re-renders are only a problem if they are slow, which usually means a component does expensive work or renders a massive list.',
    },
    {
      type: 'heading',
      content: '1. React.memo - Skip Re-renders',
    },
    {
      type: 'example',
      title: 'React.memo wraps a component to skip re-renders if props havent changed',
      content: 'By default, when a parent re-renders, all its children re-render too - even if their props are unchanged. React.memo wraps a component and tells React: "only re-render this if its props actually changed." It uses shallow comparison by default.',
      language: 'jsx',
      code: `// (React hooks available as React.useState, React.useEffect, etc.)

// Without memo - re-renders every time the parent renders
function ChildExpensive({ name }) {
  console.log('ChildExpensive rendered');
  // Imagine expensive calculations here...
  return <div>Hello, {name}!</div>;
}

// With memo - only re-renders if "name" prop changes
const ChildMemo = memo(function Child({ name }) {
  console.log('ChildMemo rendered');
  return <div>Hello, {name}!</div>;
});

function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      {/* Clicking the button re-renders Parent */}
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
      
      {/* Without memo - re-renders on every button click */}
      <ChildExpensive name="Alice" />

      {/* With memo - skips re-render because name="Alice" never changes */}
      <ChildMemo name="Alice" />
    </div>
  );
}

// Note: memo does a SHALLOW comparison
// If you pass new object/array literals each render, memo wont help:
// <Child data={{ id: 1 }} />  ← new object every render, memo fails
// Use useMemo or useCallback to stabilize those references`,
    },
    {
      type: 'heading',
      content: '2. useMemo - Cache Expensive Calculations',
    },
    {
      type: 'example',
      title: 'useMemo caches the result of an expensive calculation',
      content: 'useMemo runs your calculation only when its dependencies change, not on every render. Use it for genuinely expensive operations like filtering large lists, heavy math, or building complex data structures.',
      language: 'jsx',
      code: `// (React hooks available as React.useState, React.useEffect, etc.)

// Slow function - imagine this processes thousands of items
function expensiveFilter(items, query) {
  console.log('Running expensive filter...');
  return items.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase())
  );
}

function ProductList({ products }) {
  const [query, setQuery]   = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Without useMemo - runs expensiveFilter on EVERY render
  // including when darkMode changes (which has nothing to do with filtering)
  const filteredBad = expensiveFilter(products, query);

  // With useMemo - only re-runs when products or query change
  // Toggling darkMode does NOT re-run the filter
  const filteredGood = useMemo(
    () => expensiveFilter(products, query),
    [products, query]  // dependency array
  );

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." />
      <button onClick={() => setDarkMode(d => !d)}>Toggle Dark Mode</button>
      <ul>
        {filteredGood.map(p => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '3. useCallback - Stable Function References',
    },
    {
      type: 'example',
      title: 'useCallback prevents new function references on every render',
      content: 'Every render creates new function objects. When you pass a function as a prop to a memoized child, the new reference breaks memoization. useCallback returns the same function reference across renders (unless dependencies change), so memo actually works.',
      language: 'jsx',
      code: `// (React hooks available as React.useState, React.useEffect, etc.)

// Memoized button - only re-renders if onClick or label changes
const MemoButton = memo(function Button({ onClick, label }) {
  console.log('Button rendered:', label);
  return <button onClick={onClick}>{label}</button>;
});

function Counter() {
  const [count, setCount] = useState(0);
  const [other, setOther] = useState(0);

  // Without useCallback - new function every render
  // MemoButton re-renders even when "other" changes
  const handleClickBad = () => setCount(c => c + 1);

  // With useCallback - same function reference unless [] deps change
  // MemoButton correctly skips re-renders when "other" changes
  const handleClickGood = useCallback(() => {
    setCount(c => c + 1);
  }, []); // empty deps - never changes

  return (
    <div>
      <p>Count: {count} | Other: {other}</p>
      <MemoButton onClick={handleClickBad}  label="Bad (no useCallback)" />
      <MemoButton onClick={handleClickGood} label="Good (useCallback)" />
      <button onClick={() => setOther(o => o + 1)}>Update Other</button>
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '4. When to Optimize - Decision Guide',
    },
    {
      type: 'table',
      title: 'Optimization tool guide',
      headers: ['Tool', 'Use When', 'Cost'],
      rows: [
        ['React.memo', 'Component re-renders often with same props and render is slow', 'Shallow prop comparison on each render'],
        ['useMemo', 'Calculation is measurably slow and runs more than needed', 'Memory + comparison overhead'],
        ['useCallback', 'Function passed to memoized child or is useEffect dependency', 'Memory + comparison overhead'],
        ['None', 'Component renders fast (most components)', 'Zero - simplest code'],
      ],
    },
    {
      type: 'tryit',
      title: 'Try It: Seeing Memoization in Action',
      css: `body { font-family: system-ui, sans-serif; padding: 20px; background: #f0f4ff; }
.card { background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
h3 { margin: 0 0 8px; font-size: 15px; color: #374151; }
.row { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; margin-bottom: 8px; }
button { padding: 8px 14px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px; }
.btn-blue { background: #2563eb; color: white; }
.btn-purple { background: #7c3aed; color: white; }
.btn-gray { background: #6b7280; color: white; }
.log { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px; font-family: monospace; font-size: 12px; max-height: 120px; overflow-y: auto; }
.log-entry { padding: 2px 0; color: #374151; }
.badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 700; }
.badge-blue { background: #dbeafe; color: #1d4ed8; }
.badge-green { background: #dcfce7; color: #15803d; }`,
      jsx: `const ExpensiveChild = React.memo(function ExpensiveChild({ value, label }) {
  return (
    <div className="card" style={{ border: '2px solid #dbeafe' }}>
      <h3>{label}</h3>
      <p>Value: <strong>{value}</strong></p>
      <span className="badge badge-green">✓ Memoized - only re-renders when value changes</span>
    </div>
  );
});

function App() {
  const [count, setCount] = React.useState(0);
  const [theme, setTheme] = React.useState('blue');
  const [log, setLog] = React.useState([]);

  function addLog(msg) {
    setLog(prev => [...prev.slice(-9), msg]);
  }

  const expensive = React.useMemo(() => {
    addLog('useMemo: recalculating...');
    let result = 0;
    for (let i = 0; i < count * 1000; i++) result += i;
    return result;
  }, [count]);

  return (
    <div>
      <div className="card">
        <h3>Performance Demo</h3>
        <div className="row">
          <button className="btn-blue" onClick={() => { setCount(c => c + 1); addLog('Count changed - useMemo will recalculate'); }}>
            Count: {count} (triggers useMemo)
          </button>
          <button className="btn-purple" onClick={() => { setTheme(t => t === 'blue' ? 'purple' : 'blue'); addLog('Theme changed - useMemo skips!'); }}>
            Theme: {theme} (skips useMemo)
          </button>
        </div>
        <p style={{ fontSize: 13 }}>useMemo result: <strong>{expensive}</strong></p>
      </div>
      <ExpensiveChild value={count} label="React.memo Child" />
      <div className="card">
        <h3>Render Log</h3>
        <div className="log">
          {log.length === 0 && <div className="log-entry" style={{ color: '#9ca3af' }}>Click buttons to see log...</div>}
          {log.map((l, i) => <div key={i} className="log-entry">▶ {l}</div>)}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);`,
    },
  ],
  exercises: [
    {
      id: 'perf-1',
      question: 'What does React.memo do?',
      type: 'multiple-choice',
      options: [
        'Makes the component load from memory instead of disk',
        'Skips re-rendering a component when its props have not changed',
        'Caches the result of an expensive calculation inside the component',
        'Prevents the component from ever re-rendering',
      ],
      correct: 1,
      explanation: 'React.memo wraps a component and tells React to skip re-rendering it if the props have not changed (using shallow equality comparison). If the parent re-renders but passes the same props, the memoized child is skipped.',
    },
    {
      id: 'perf-2',
      question: 'When should you use useMemo?',
      type: 'multiple-choice',
      options: [
        'For every calculation in your component',
        'Only for calculations that are measurably slow and run more than needed',
        'Whenever you use a variable inside JSX',
        'To replace useState for all derived values',
      ],
      correct: 1,
      explanation: 'useMemo adds overhead (memory + comparison). Only use it when a calculation is genuinely expensive AND runs more often than needed. For cheap calculations, useMemo actually makes things slightly slower due to its own overhead.',
    },
  ],
  quiz: [
    {
      id: 'rperfq1',
      question: 'Why does passing a function as a prop often break React.memo optimization?',
      options: [
        'Functions cannot be passed as props in React',
        'Each render creates a new function object, so memo sees a changed prop every time',
        'React.memo does not support function props',
        'Functions are always re-created by the JavaScript engine',
      ],
      correct: 1,
      explanation: 'Every time a component renders, every function defined inside it is a brand-new object. Even if the logic is identical, the reference is different. React.memo uses === comparison, so it sees the new function as a changed prop and re-renders. useCallback solves this by returning the same reference.',
    },
  ],
};
