import type { ReactLesson } from '../react-curriculum';

export const reactUseEffectLesson: ReactLesson = {
  id: 'react-useeffect',
  title: 'useEffect Hook',
  slug: 'useeffect',
  chapter: 'hooks',
  order: 9,
  difficulty: 'intermediate',
  readingTime: 13,
  description: 'Master the useEffect hook — run side effects after render, control when effects re-run with the dependency array, clean up subscriptions, fetch data on mount, and avoid common pitfalls like infinite loops.',
  sections: [
    {
      type: 'text',
      content: 'useEffect lets you perform side effects from a function component. A "side effect" is anything that interacts with the outside world — fetching data, updating the document title, setting up timers, subscribing to events, or directly manipulating the DOM. useEffect runs after every render by default, but the dependency array gives you precise control over when it runs.',
    },
    {
      type: 'heading',
      content: '1. useEffect Syntax',
    },
    {
      type: 'example',
      title: 'Basic useEffect structure and the three forms',
      content: 'useEffect takes two arguments: a function (the effect) and an optional dependency array. The dependency array controls when the effect re-runs. No array means after every render. An empty array [] means once after the first render only. An array with values means every time one of those values changes.',
      language: 'jsx',
      code: `// (React hooks available as React.useState, React.useEffect, etc.)

function EffectDemo() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('Alice');

  // 1. No dependency array — runs after EVERY render
  useEffect(() => {
    console.log('Rendered! count =', count);
  });

  // 2. Empty array — runs ONCE after mount (like componentDidMount)
  useEffect(() => {
    console.log('Component mounted — runs once');
    document.title = 'My App';
  }, []);

  // 3. With dependencies — runs when count changes
  useEffect(() => {
    console.log('Count changed to', count);
    document.title = 'Count: ' + count;
  }, [count]); // re-runs whenever count changes

  // 4. Multiple dependencies
  useEffect(() => {
    console.log('count or name changed:', count, name);
  }, [count, name]);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <input value={name} onChange={e => setName(e.target.value)} />
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '2. The Cleanup Function',
    },
    {
      type: 'example',
      title: 'Returning a cleanup function to avoid memory leaks',
      content: 'If your effect sets up something that needs to be torn down (a timer, event listener, subscription, WebSocket), return a cleanup function from useEffect. React calls the cleanup function before running the effect again and before the component unmounts. Without cleanup, you can get memory leaks and bugs from stale handlers.',
      language: 'jsx',
      code: `function Timer() {
  const [seconds, setSeconds] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);

  useEffect(() => {
    if (!isRunning) return; // no effect when paused

    // Set up a timer
    const intervalId = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // ✅ Return cleanup function — clears the timer
    // Called when isRunning changes or component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]); // re-runs when isRunning changes

  return (
    <div>
      <p>Time: {seconds}s</p>
      <button onClick={() => setIsRunning(r => !r)}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button onClick={() => { setIsRunning(false); setSeconds(0); }}>
        Reset
      </button>
    </div>
  );
}

// Event listener cleanup example:
function WindowWidth() {
  const [width, setWidth] = React.useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    // Cleanup: remove the listener to prevent memory leaks
    return () => window.removeEventListener('resize', handleResize);
  }, []); // mount only — listener stays until unmount

  return <p>Window width: {width}px</p>;
}`,
    },
    {
      type: 'heading',
      content: '3. Fetching Data with useEffect',
    },
    {
      type: 'example',
      title: 'Loading data from an API when the component mounts',
      content: 'Fetching data on mount is the most common useEffect use case. Put your fetch call inside useEffect with an empty dependency array so it runs once. Manage loading, data, and error as separate state variables. Note that the effect function itself cannot be async — but you can define and call an async function inside it.',
      language: 'jsx',
      code: `function UsersList() {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    // Cannot make the effect function async directly
    // Define an async function inside and call it
    async function fetchUsers() {
      try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setUsers(data.slice(0, 5)); // first 5 users
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []); // empty array = run once on mount

  if (loading) return <p>Loading users...</p>;
  if (error)   return <p>Error: {error}</p>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name} — {user.email}</li>
      ))}
    </ul>
  );
}`,
    },
    {
      type: 'heading',
      content: '4. Running Effect When State Changes',
    },
    {
      type: 'example',
      title: 'Re-fetching data when a dependency changes',
      content: 'When you put a value in the dependency array, the effect re-runs every time that value changes. This is how you implement "re-fetch when search term changes" or "update document title when count changes." The effect re-runs only for the specific values you list as dependencies.',
      language: 'jsx',
      code: `function SearchResults() {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  // Re-runs every time query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    // Simulate an API search with a debounce-like delay
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(
          'https://jsonplaceholder.typicode.com/posts?q=' + query
        );
        const data = await res.json();
        setResults(data.slice(0, 5));
      } finally {
        setLoading(false);
      }
    }, 400); // wait 400ms after last keystroke

    // Cleanup: cancel the timeout if query changes again before 400ms
    return () => clearTimeout(timeoutId);
  }, [query]); // dependency — re-run when query changes

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search posts..." />
      {loading && <p>Searching...</p>}
      {results.map(r => <p key={r.id}>{r.title}</p>)}
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '5. Common Pitfall — Infinite Loop',
    },
    {
      type: 'example',
      title: 'How to avoid accidentally creating an infinite render loop',
      content: 'An infinite loop happens when you update state inside useEffect and include that state in the dependency array. The state update triggers a re-render, which runs the effect again, which updates state, which triggers another re-render... forever. The fix is to either remove the state from dependencies (if safe) or restructure the logic to break the cycle.',
      language: 'jsx',
      code: `// ❌ INFINITE LOOP — count is in deps, but effect updates count!
function BadComponent() {
  const [count, setCount] = React.useState(0);

  useEffect(() => {
    setCount(count + 1); // updates count → triggers effect → updates count → ...
  }, [count]); // ← count here causes the infinite loop
}

// ✅ FIX 1: Use functional updater — no need for count in deps
function FixedComponent1() {
  const [count, setCount] = React.useState(0);

  useEffect(() => {
    setCount(prev => prev + 1); // uses prev, doesnt need count in deps
  }, []); // runs once, updates count once
}

// ✅ FIX 2: Remove state from deps when safe (if you dont read it)
function FixedComponent2() {
  const [data, setData] = React.useState(null);
  const [userId, setUserId] = React.useState(1);

  useEffect(() => {
    // Only depends on userId, not on data
    fetch('/api/users/' + userId)
      .then(r => r.json())
      .then(setData);
  }, [userId]); // re-fetch only when userId changes

  return <div>{data ? data.name : 'Loading...'}</div>;
}`,
    },
    {
      type: 'tryit',
      title: 'Try It: Live Clock and Window Size',
      css: `body { font-family: system-ui, sans-serif; padding: 20px; background: #f8fafc; }
.card { background: white; border-radius: 16px; padding: 24px; margin-bottom: 16px; box-shadow: 0 2px 12px rgba(0,0,0,.07); }
h3 { margin: 0 0 16px; font-size: 14px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: .05em; }
.clock { font-size: 48px; font-weight: 800; color: #111; font-variant-numeric: tabular-nums; letter-spacing: -.02em; }
.date { font-size: 14px; color: #6b7280; margin-top: 4px; }
.width-bar { height: 12px; border-radius: 999px; background: #2563eb; transition: width .2s; }
.width-val { font-size: 32px; font-weight: 800; color: #2563eb; margin-bottom: 8px; }
.info { font-size: 13px; color: #9ca3af; }
button { padding: 8px 14px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-top: 8px; }`,
      jsx: `function LiveClock() {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id); // cleanup on unmount
  }, []);

  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="card">
      <h3>useEffect — Live Clock</h3>
      <div className="clock">{timeStr}</div>
      <div className="date">{dateStr}</div>
    </div>
  );
}

function WindowSizeTracker() {
  const [width, setWidth] = React.useState(window.innerWidth);
  const maxWidth = 800;
  const pct = Math.min((width / maxWidth) * 100, 100);

  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize); // cleanup
  }, []);

  return (
    <div className="card">
      <h3>useEffect — Window Resize</h3>
      <div className="width-val">{width}px</div>
      <div style={{ background: '#f3f4f6', borderRadius: 999, overflow: 'hidden', marginBottom: 8 }}>
        <div className="width-bar" style={{ width: pct + '%' }} />
      </div>
      <p className="info">Resize the window to see this update in real time.</p>
    </div>
  );
}

function App() {
  return (
    <div>
      <LiveClock />
      <WindowSizeTracker />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);`,
    },
  ],
  exercises: [
    {
      id: 'ue-1',
      question: 'What does an empty dependency array [] mean in useEffect?',
      type: 'multiple-choice',
      options: [
        'The effect runs after every render',
        'The effect never runs',
        'The effect runs once after the initial render',
        'The effect runs only when the component unmounts',
      ],
      correct: 2,
      explanation: 'An empty dependency array [] means useEffect runs once after the first render only (on mount). This is equivalent to componentDidMount in class components and is perfect for one-time initialization like fetching data or setting up subscriptions.',
    },
    {
      id: 'ue-2',
      question: 'Why do you return a cleanup function from useEffect?',
      type: 'multiple-choice',
      options: [
        'To return a value to the parent component',
        'To reset state before the next render',
        'To cancel timers, remove event listeners, or unsubscribe before the next effect runs or the component unmounts',
        'To tell React the effect succeeded',
      ],
      correct: 2,
      explanation: 'The cleanup function prevents memory leaks. React calls it before running the effect again (when dependencies change) and when the component unmounts. Use it to clear intervals, remove event listeners, cancel fetch requests, etc.',
    },
  ],
  quiz: [
    {
      id: 'rueq1',
      question: 'You fetch data inside useEffect and accidentally create an infinite loop. What is the most likely cause?',
      options: [
        'The fetch URL is wrong',
        'The data state variable is in the dependency array and you update it in the effect',
        'useEffect doesnt support async functions',
        'You forgot to return a cleanup function',
      ],
      correct: 1,
      explanation: 'Infinite loops happen when you update a state variable that is also in the dependency array. The update triggers a re-render, which runs the effect again, which updates state again, and so on. Fix it by removing that state from the deps array or using the functional updater form.',
    },
  ],
};
