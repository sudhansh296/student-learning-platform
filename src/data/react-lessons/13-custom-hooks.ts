import type { ReactLesson } from '../react-curriculum';

export const reactCustomHooksLesson: ReactLesson = {
  id: 'react-custom-hooks',
  title: 'Custom Hooks',
  slug: 'custom-hooks',
  chapter: 'hooks',
  order: 13,
  difficulty: 'intermediate',
  readingTime: 13,
  description: 'Extract reusable logic from components into custom hooks. Build useFetch, useLocalStorage, and useToggle to see how custom hooks make code cleaner and easier to share.',
  sections: [
    {
      type: 'text',
      content: 'Custom hooks are JavaScript functions whose names start with "use" and that call other hooks internally. They let you extract stateful logic from components so you can reuse it across many components without duplicating code. They are the primary way to share behavior in React.',
    },
    {
      type: 'heading',
      content: '1. What Makes a Custom Hook',
    },
    {
      type: 'example',
      title: 'Extracting logic into a reusable custom hook',
      content: 'Any time you find yourself writing the same useState + useEffect pattern in multiple components, extract it into a custom hook. The hook is just a function - it can accept arguments, return values, and call any built-in hooks.',
      language: 'jsx',
      code: `// BEFORE: logic duplicated in every component that needs window size
function Header() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return <nav>{width > 768 ? 'Desktop Nav' : 'Mobile Nav'}</nav>;
}

// AFTER: extract into a custom hook - reuse anywhere
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);  // cleanup
  }, []);

  return width;
}

// Now any component can use it cleanly
function Header() {
  const width = useWindowWidth();
  return <nav>{width > 768 ? 'Desktop Nav' : 'Mobile Nav'}</nav>;
}

function Sidebar() {
  const width = useWindowWidth();
  if (width < 768) return null;
  return <aside>Sidebar content</aside>;
}`,
    },
    {
      type: 'heading',
      content: '2. useToggle Hook',
    },
    {
      type: 'example',
      title: 'A simple useToggle hook for boolean state',
      content: 'The useToggle hook is a great first custom hook - it wraps a boolean useState with a toggle function. Simple but eliminates a tiny repeated pattern across your app.',
      language: 'jsx',
      code: `// (React hooks available as React.useState, React.useEffect, etc.)

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  // useCallback prevents a new function reference on every render
  const toggle = useCallback(() => {
    setValue(v => !v);
  }, []);

  const setOn  = useCallback(() => setValue(true), []);
  const setOff = useCallback(() => setValue(false), []);

  return [value, toggle, setOn, setOff];
}

// Usage
function DropdownMenu() {
  const [isOpen, toggleOpen, open, close] = useToggle(false);

  return (
    <div>
      <button onClick={toggleOpen}>
        Menu {isOpen ? '▲' : '▼'}
      </button>
      {isOpen && (
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">About</a></li>
          <li><button onClick={close}>Close</button></li>
        </ul>
      )}
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '3. useLocalStorage Hook',
    },
    {
      type: 'example',
      title: 'Persist state to localStorage with a custom hook',
      content: 'This hook works like useState but automatically saves the value to localStorage and reads it back on mount. The component doesnt need to know anything about localStorage.',
      language: 'jsx',
      code: `// (React hooks available as React.useState, React.useEffect, etc.)

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    // Lazy initializer - reads from localStorage on first render only
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  function setValue(value) {
    try {
      // Support functional updater pattern like useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('localStorage error:', error);
    }
  }

  return [storedValue, setValue];
}

// Usage - works exactly like useState but persists across page refreshes
function Settings() {
  const [theme, setTheme] = useLocalStorage('app-theme', 'light');
  const [fontSize, setFontSize] = useLocalStorage('font-size', 16);

  return (
    <div>
      <p>Theme: {theme}</p>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
      <p>Font size: {fontSize}px</p>
      <button onClick={() => setFontSize(s => s + 2)}>Larger</button>
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '4. useFetch Hook',
    },
    {
      type: 'example',
      title: 'Abstract the loading/error/data pattern into a hook',
      content: 'Nearly every component that fetches data needs the same three state variables: loading, error, and data. Extract this pattern into a useFetch hook and every component gets it for free.',
      language: 'jsx',
      code: `// (React hooks available as React.useState, React.useEffect, etc.)

function useFetch(url) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!url) return;
    
    let cancelled = false;  // prevent state update if unmounted
    setLoading(true);
    setError(null);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(json => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };  // cleanup on unmount or url change
  }, [url]);

  return { data, loading, error };
}

// Clean usage - no loading/error boilerplate in the component
function UserList() {
  const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/users');

  if (loading) return <p>Loading...</p>;
  if (error)   return <p>Error: {error}</p>;

  return (
    <ul>
      {data?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}`,
    },
    {
      type: 'tryit',
      title: 'Try It: useToggle and useCounter',
      css: `body { font-family: system-ui, sans-serif; padding: 20px; background: #f8fafc; }
.card { background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
h3 { margin: 0 0 12px; font-size: 15px; color: #374151; }
button { padding: 8px 14px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px; margin-right: 8px; transition: opacity .15s; }
button:hover { opacity: .85; }
.btn-blue { background: #2563eb; color: white; }
.btn-green { background: #16a34a; color: white; }
.btn-red { background: #dc2626; color: white; }
.btn-gray { background: #6b7280; color: white; }
.count { font-size: 48px; font-weight: 800; color: #1e293b; margin: 8px 0; }
.menu { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; margin-top: 8px; padding: 8px 0; }
.menu-item { display: block; padding: 8px 16px; font-size: 14px; color: #374151; cursor: pointer; }
.menu-item:hover { background: #eff6ff; }`,
      jsx: `function useToggle(init = false) {
  const [val, setVal] = React.useState(init);
  const toggle = React.useCallback(() => setVal(v => !v), []);
  return [val, toggle];
}

function useCounter(init = 0, step = 1) {
  const [count, setCount] = React.useState(init);
  return {
    count,
    increment: () => setCount(c => c + step),
    decrement: () => setCount(c => c - step),
    reset:     () => setCount(init),
  };
}

function DropdownDemo() {
  const [open, toggleOpen] = useToggle(false);
  return (
    <div className="card">
      <h3>useToggle - Dropdown</h3>
      <button className="btn-blue" onClick={toggleOpen}>
        Menu {open ? '▲' : '▼'}
      </button>
      {open && (
        <div className="menu">
          <span className="menu-item">🏠 Home</span>
          <span className="menu-item">📚 Docs</span>
          <span className="menu-item">⚙️ Settings</span>
        </div>
      )}
    </div>
  );
}

function CounterDemo() {
  const { count, increment, decrement, reset } = useCounter(0, 5);
  return (
    <div className="card">
      <h3>useCounter - Custom Hook</h3>
      <div className="count">{count}</div>
      <button className="btn-green" onClick={increment}>+5</button>
      <button className="btn-red" onClick={decrement}>-5</button>
      <button className="btn-gray" onClick={reset}>Reset</button>
    </div>
  );
}

function App() {
  return (
    <div>
      <DropdownDemo />
      <CounterDemo />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);`,
    },
  ],
  exercises: [
    {
      id: 'hook-1',
      question: 'What naming rule must custom hooks follow?',
      type: 'multiple-choice',
      options: [
        'They must end with "Hook" (e.g., ToggleHook)',
        'They must start with "use" (e.g., useToggle)',
        'They must start with "custom" (e.g., customToggle)',
        'No naming rules - any function name works',
      ],
      correct: 1,
      explanation: 'Custom hooks must start with "use" (e.g., useToggle, useFetch, useLocalStorage). This is not just a convention - React linters use this rule to detect hooks and enforce the Rules of Hooks (no hooks in conditions or loops).',
    },
    {
      id: 'hook-2',
      question: 'What is the primary reason to create a custom hook?',
      type: 'multiple-choice',
      options: [
        'To make the code run faster',
        'To replace Redux and Context',
        'To extract and reuse stateful logic across multiple components',
        'To avoid writing JSX',
      ],
      correct: 2,
      explanation: 'Custom hooks are for extracting and reusing stateful logic. When you find yourself copying the same useState + useEffect pattern into multiple components, extract it into a custom hook and both components use the hook instead.',
    },
  ],
  quiz: [
    {
      id: 'rchkq1',
      question: 'Can a custom hook call other hooks like useState and useEffect?',
      options: [
        'No - hooks can only be called inside component functions',
        'Yes - custom hooks can call any built-in hooks',
        'Only if the custom hook is exported as default',
        'Only useEffect - not useState',
      ],
      correct: 1,
      explanation: 'Custom hooks can call any other hooks (useState, useEffect, useRef, useContext, etc.) as well as other custom hooks. This is what makes them powerful - they compose behavior from smaller pieces, just like components compose UI.',
    },
  ],
};
