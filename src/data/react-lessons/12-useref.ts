import type { ReactLesson } from '../react-curriculum';

export const reactUseRefLesson: ReactLesson = {
  id: 'react-useref',
  title: 'useRef Hook',
  slug: 'useref',
  chapter: 'hooks',
  order: 12,
  difficulty: 'intermediate',
  readingTime: 12,
  description: 'Learn the useRef hook for accessing DOM nodes directly, storing mutable values without triggering re-renders, and managing timers and intervals.',
  sections: [
    {
      type: 'text',
      content: 'useRef returns a mutable object with a single .current property. It has two main uses: referencing DOM elements directly (to focus, measure, or call methods on them), and storing values that should persist across renders without causing a re-render when they change.',
    },
    {
      type: 'heading',
      content: '1. Accessing DOM Elements',
    },
    {
      type: 'example',
      title: 'Focus an input programmatically with useRef',
      content: 'Attach a ref to any JSX element using the ref prop. After the component mounts, ref.current will be the actual DOM node. You can then call DOM methods like focus(), blur(), scrollIntoView(), or read properties like value and offsetHeight.',
      language: 'jsx',
      code: `// (React hooks available as React.useState, React.useEffect, etc.)

function SearchBox() {
  const inputRef = useRef(null);

  function focusInput() {
    // inputRef.current is the actual <input> DOM node
    inputRef.current.focus();
  }

  function clearInput() {
    inputRef.current.value = '';
    inputRef.current.focus();
  }

  return (
    <div>
      {/* Attach ref to the DOM element */}
      <input ref={inputRef} type="text" placeholder="Search..." />
      <button onClick={focusInput}>Focus</button>
      <button onClick={clearInput}>Clear</button>
    </div>
  );
}

// Other DOM ref use cases:
function ScrollExample() {
  const bottomRef = useRef(null);

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div>
      <button onClick={scrollToBottom}>Scroll to bottom</button>
      {/* Long content... */}
      <div ref={bottomRef} />
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '2. Mutable Values Without Re-renders',
    },
    {
      type: 'example',
      title: 'Using refs to store values that dont cause re-renders',
      content: 'Unlike useState, changing ref.current does NOT trigger a re-render. This makes refs ideal for storing timer IDs, previous values, render counts, or any value you need to track internally without affecting the UI on each change.',
      language: 'jsx',
      code: `// (React hooks available as React.useState, React.useEffect, etc.)

// Track how many times a component has re-rendered
function RenderCounter() {
  const [count, setCount] = useState(0);
  const renderCount = useRef(0);

  // This runs after every render - increment without causing another render
  useEffect(() => {
    renderCount.current += 1;
  });

  return (
    <div>
      <p>Count: {count}</p>
      <p>This component has rendered {renderCount.current} times</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}

// Store previous value
function PreviousValue() {
  const [name, setName] = useState('');
  const prevName = useRef('');

  useEffect(() => {
    prevName.current = name; // Store after render
  }, [name]);

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <p>Now: {name || '(empty)'}</p>
      <p>Before: {prevName.current || '(empty)'}</p>
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '3. Managing Intervals and Timers',
    },
    {
      type: 'example',
      title: 'Store interval IDs in refs for proper cleanup',
      content: 'setTimeout and setInterval return IDs that you need to cancel later. Storing them in a ref (not state) is perfect - you do not need to re-render when the ID changes, but you do need to access it in the cleanup function.',
      language: 'jsx',
      code: `// (React hooks available as React.useState, React.useEffect, etc.)

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  function start() {
    if (running) return;
    setRunning(true);
    // Store the interval ID in ref so stop() can access it
    intervalRef.current = setInterval(() => {
      setTime(t => t + 1);
    }, 1000);
  }

  function stop() {
    clearInterval(intervalRef.current);
    setRunning(false);
  }

  function reset() {
    clearInterval(intervalRef.current);
    setRunning(false);
    setTime(0);
  }

  // Always clean up on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const mins = String(Math.floor(time / 60)).padStart(2, '0');
  const secs = String(time % 60).padStart(2, '0');

  return (
    <div>
      <p style={{ fontSize: 48, fontFamily: 'monospace' }}>{mins}:{secs}</p>
      <button onClick={start} disabled={running}>Start</button>
      <button onClick={stop} disabled={!running}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}`,
    },
    {
      type: 'tip',
      title: 'useRef vs useState - key difference',
      content: 'useState triggers a re-render when updated. useRef does NOT. Use state for values that should update the UI. Use refs for values you need to track internally (timers, DOM nodes, previous values) where changing them should not cause a new render.',
    },
    {
      type: 'tryit',
      title: 'Try It: DOM Ref and Stopwatch',
      css: `body { font-family: system-ui, sans-serif; padding: 20px; background: #f8fafc; }
.card { background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
h3 { margin: 0 0 12px; font-size: 15px; color: #374151; }
.row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
input { flex: 1; padding: 8px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; min-width: 120px; }
input:focus { border-color: #2563eb; }
button { padding: 8px 14px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px; transition: opacity .15s; }
button:hover { opacity: .85; }
button:disabled { opacity: .4; cursor: default; }
.btn-blue { background: #2563eb; color: white; }
.btn-red { background: #dc2626; color: white; }
.btn-gray { background: #6b7280; color: white; }
.time { font-size: 48px; font-family: monospace; font-weight: 800; color: #1e293b; letter-spacing: 2px; margin: 8px 0 16px; }`,
      jsx: `function FocusDemo() {
  const inputRef = React.useRef(null);
  const [msg, setMsg] = React.useState('');

  function handleFocus() {
    inputRef.current.focus();
    setMsg('Input focused!');
  }

  function handleClear() {
    inputRef.current.value = '';
    inputRef.current.focus();
    setMsg('Cleared and focused!');
  }

  return (
    <div className="card">
      <h3>DOM Ref - Focus Control</h3>
      <div className="row" style={{ marginBottom: 8 }}>
        <input ref={inputRef} type="text" placeholder="Type something..." />
        <button className="btn-blue" onClick={handleFocus}>Focus</button>
        <button className="btn-gray" onClick={handleClear}>Clear</button>
      </div>
      {msg && <p style={{ fontSize: 13, color: '#16a34a', margin: 0 }}>✓ {msg}</p>}
    </div>
  );
}

function StopwatchDemo() {
  const [time, setTime] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const intervalRef = React.useRef(null);

  function start() {
    if (running) return;
    setRunning(true);
    intervalRef.current = setInterval(() => setTime(t => t + 1), 1000);
  }

  function stop() {
    clearInterval(intervalRef.current);
    setRunning(false);
  }

  function reset() {
    clearInterval(intervalRef.current);
    setRunning(false);
    setTime(0);
  }

  React.useEffect(() => () => clearInterval(intervalRef.current), []);

  const m = String(Math.floor(time / 60)).padStart(2, '0');
  const s = String(time % 60).padStart(2, '0');

  return (
    <div className="card">
      <h3>Stopwatch (interval in ref)</h3>
      <div className="time">{m}:{s}</div>
      <div className="row">
        <button className="btn-blue" onClick={start} disabled={running}>▶ Start</button>
        <button className="btn-red" onClick={stop} disabled={!running}>⏹ Stop</button>
        <button className="btn-gray" onClick={reset}>↺ Reset</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <FocusDemo />
      <StopwatchDemo />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);`,
    },
  ],
  exercises: [
    {
      id: 'ref-1',
      question: 'What is the key difference between useRef and useState?',
      type: 'multiple-choice',
      options: [
        'useRef can only store DOM nodes; useState can store any value',
        'Changing ref.current does NOT trigger a re-render; changing state does',
        'useRef is asynchronous; useState is synchronous',
        'There is no difference - they are interchangeable',
      ],
      correct: 1,
      explanation: 'The key difference is re-rendering. Calling setState triggers React to re-render the component. Mutating ref.current does NOT cause a re-render. This makes refs ideal for storing values you need internally but that should not affect the displayed UI.',
    },
    {
      id: 'ref-2',
      question: 'What is the correct way to attach a ref to a DOM element?',
      type: 'multiple-choice',
      options: [
        '<input useRef={myRef} />',
        '<input ref={myRef} />',
        '<input reference={myRef} />',
        '<input bind={myRef} />',
      ],
      correct: 1,
      explanation: 'Use the ref prop: <input ref={myRef} />. After the component mounts, myRef.current will be the actual DOM input element, giving you direct access to DOM methods like focus() and properties like value.',
    },
  ],
  quiz: [
    {
      id: 'rrefq1',
      question: 'You need to store a setInterval ID so you can cancel it later. Which hook should you use?',
      options: [
        'useState - because you need to persist it across renders',
        'useRef - because you dont need a re-render when the ID changes',
        'useEffect - because its a side effect',
        'useCallback - because its a function ID',
      ],
      correct: 1,
      explanation: 'useRef is perfect for storing timer IDs. You need the ID to persist across renders (so you can call clearInterval) but changing the ID should not cause a re-render. If you used useState, setting the interval ID would trigger an unnecessary re-render.',
    },
  ],
};
