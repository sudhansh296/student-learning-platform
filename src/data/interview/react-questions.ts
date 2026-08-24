import { InterviewQuestion } from '@/lib/interview-types';

export const reactInterviewQuestions: InterviewQuestion[] = [
  {
    id: 'react-what-is-react',
    category: 'react',
    type: 'theory',
    question: 'What is React and why would you use it?',
    difficulty: 'beginner',
    tags: ['fundamentals', 'library', 'components'],
    
    shortAnswer: 'React is a JavaScript library for building user interfaces using reusable components. It uses a virtual DOM for efficient updates and provides a declarative way to build UIs.',
    
    detailedExplanation: 'React is a UI library developed by Facebook that focuses on the view layer. It allows you to build complex UIs from small, isolated pieces of code called components. React uses a virtual DOM to optimize rendering - it compares the new virtual DOM with the previous one and only updates the real DOM where necessary. This makes React fast and efficient.',
    
    example: {
      code: `// Simple React component
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Using the component
function App() {
  return (
    <div>
      <Welcome name="Alex" />
      <Welcome name="Sam" />
    </div>
  );
}

// React with state
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
      language: 'jsx'
    },
    
    interviewAnswer: 'React makes building complex UIs manageable through component-based architecture. Each component manages its own state and can be reused throughout the app. The virtual DOM ensures efficient updates - React only re-renders what changed, not the entire page. JSX lets me write HTML-like syntax in JavaScript, making components intuitive to write and read.',
    
    commonMistakes: [
      'Thinking React is a framework (it\'s a library)',
      'Not understanding that JSX is not HTML',
      'Modifying state directly instead of using setState',
      'Not understanding component re-renders'
    ],
    
    realWorldUse: 'React powers Facebook, Instagram, Netflix, Airbnb, and thousands of other apps. Its component model scales from small widgets to massive applications. The ecosystem (Next.js, React Native) extends React to SSR and mobile.',
    
    followUpQuestions: [
      'What is the virtual DOM?',
      'What\'s the difference between React and other frameworks like Vue or Angular?',
      'What is JSX?'
    ]
  },

  {
    id: 'react-usestate',
    category: 'react',
    type: 'theory',
    question: 'How does useState work?',
    difficulty: 'beginner',
    tags: ['hooks', 'state', 'useState'],
    
    shortAnswer: 'useState is a hook that adds state to functional components. It returns current state and a setter function. Calling the setter triggers a re-render with the new state.',
    
    detailedExplanation: 'useState accepts an initial value and returns an array with two elements: the current state value and a function to update it. When you call the setter function, React schedules a re-render with the new state. State updates may be asynchronous and batched for performance. For state based on previous state, use the functional update form: setState(prev => prev + 1).',
    
    example: {
      code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  // Direct update
  const increment = () => setCount(count + 1);
  
  // Functional update (better for multiple updates)
  const incrementCorrectly = () => setCount(prev => prev + 1);
  
  // Multiple state variables
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(false);
  
  // Object state
  const [user, setUser] = useState({ name: '', age: 0 });
  
  // Update object (must spread to avoid replacing)
  const updateName = (newName) => {
    setUser(prev => ({ ...prev, name: newName }));
  };
  
  // Array state
  const [items, setItems] = useState([]);
  const addItem = (item) => setItems(prev => [...prev, item]);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={incrementCorrectly}>+1</button>
    </div>
  );
}`,
      language: 'jsx'
    },
    
    interviewAnswer: 'useState lets functional components have state. I call it at the top level of my component and destructure the state value and setter. Important: React batches state updates for performance, so if I need to update based on previous state, I use the functional form: setCount(prev => prev + 1). This ensures I\'m working with the latest value even if multiple updates happen quickly.',
    
    commonMistakes: [
      'Calling useState conditionally or in loops',
      'Not using functional updates when state depends on previous state',
      'Mutating object/array state directly',
      'Expecting state to update immediately (it\'s asynchronous)'
    ],
    
    realWorldUse: 'Form inputs, toggles, counters, managing component-level data. Any time a component needs to remember something between renders, useState is the solution.',
    
    followUpQuestions: [
      'Why use functional updates with useState?',
      'Can you call useState conditionally?',
      'How do you update nested state with useState?'
    ]
  },

  {
    id: 'react-useeffect',
    category: 'react',
    type: 'theory',
    question: 'What is useEffect and how does it work?',
    difficulty: 'intermediate',
    tags: ['hooks', 'side-effects', 'useEffect'],
    
    shortAnswer: 'useEffect runs side effects after render. It takes a function and optional dependency array. Effects run after render, and cleanup functions run before the next effect or unmount.',
    
    detailedExplanation: 'useEffect handles side effects like data fetching, subscriptions, timers, and DOM manipulation. It runs after the browser paints. The dependency array controls when it runs: empty array runs once on mount, no array runs every render, array with values runs when those values change. Return a cleanup function to cancel subscriptions, clear timers, or remove event listeners.',
    
    example: {
      code: `import { useState, useEffect } from 'react';

function DataFetcher({ userId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Runs on mount and when userId changes
  useEffect(() => {
    setLoading(true);
    
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
    
    // Cleanup function
    return () => {
      // Cancel request or cleanup
    };
  }, [userId]); // Dependency array
  
  // Run only on mount (empty array)
  useEffect(() => {
    console.log('Component mounted');
    
    return () => {
      console.log('Component unmounting');
    };
  }, []);
  
  // Runs every render (no array - usually avoid)
  useEffect(() => {
    console.log('Component rendered');
  });
  
  // Event listeners
  useEffect(() => {
    const handleResize = () => console.log('Resized');
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  if (loading) return <p>Loading...</p>;
  return <div>{data?.name}</div>;
}`,
      language: 'jsx'
    },
    
    interviewAnswer: 'useEffect is for side effects - anything that reaches outside the component like API calls, subscriptions, or DOM manipulation. The dependency array is crucial: empty means run once on mount, specific values mean run when they change. I always return a cleanup function for subscriptions or timers to prevent memory leaks. Common mistake: missing dependencies causes stale closure bugs.',
    
    commonMistakes: [
      'Missing dependencies causing stale closures',
      'Creating infinite loops by updating state without proper dependencies',
      'Not returning cleanup functions for subscriptions',
      'Using useEffect for derived state (use useMemo instead)'
    ],
    
    realWorldUse: 'Data fetching, WebSocket subscriptions, setting up event listeners, updating document title, localStorage sync, analytics tracking.',
    
    followUpQuestions: [
      'What is the dependency array?',
      'When does the cleanup function run?',
      'What\'s the difference between useEffect and useLayoutEffect?'
    ]
  },

  {
    id: 'react-props-vs-state',
    category: 'react',
    type: 'theory',
    question: 'What is the difference between props and state?',
    difficulty: 'beginner',
    tags: ['props', 'state', 'fundamentals'],
    
    shortAnswer: 'Props are passed from parent to child and are read-only. State is managed within a component and can be changed. Props flow down, state changes trigger re-renders.',
    
    detailedExplanation: 'Props (properties) are how components receive data from parents. They\'re immutable within the receiving component. State is data managed by the component itself. When state changes via setState, React re-renders the component. Props enable component reusability, state enables interactivity. You can pass setState functions as props to allow children to update parent state.',
    
    example: {
      code: `// Props - passed from parent
function Welcome({ name, age }) {
  // name and age are props - read-only
  // âŒ name = "New Name"; // Error!
  
  return <h1>Hello {name}, age {age}</h1>;
}

function ParentComponent() {
  return <Welcome name="Alex" age={25} />;
}

// State - managed internally
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

// Combining props and state
function TodoList({ initialTodos }) {
  // Props used to initialize state
  const [todos, setTodos] = useState(initialTodos);
  
  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text }]);
  };
  
  return (
    <div>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}`,
      language: 'jsx'
    },
    
    interviewAnswer: 'Props are data passed from parent components - they\'re like function arguments. I can\'t modify props in the receiving component. State is data the component owns and manages. When I need the UI to change based on user interaction, I use state. When I need to pass data or callbacks between components, I use props. Props make components reusable, state makes them interactive.',
    
    commonMistakes: [
      'Trying to modify props directly',
      'Using state when props would be sufficient',
      'Not lifting state up when multiple components need it',
      'Prop drilling (passing props through many layers)'
    ],
    
    realWorldUse: 'Props: passing data to reusable components like buttons, cards, lists. State: form inputs, toggles, filters, any interactive UI. Combination: controlled components where parent manages state via props and callbacks.',
    
    followUpQuestions: [
      'Can you modify props in a component?',
      'When should you lift state up?',
      'What is prop drilling and how do you solve it?'
    ]
  },

  {
    id: 'react-virtual-dom',
    category: 'react',
    type: 'theory',
    question: 'What is the Virtual DOM and how does it work?',
    difficulty: 'intermediate',
    tags: ['virtual-dom', 'performance', 'reconciliation'],
    
    shortAnswer: 'The Virtual DOM is a lightweight copy of the real DOM. React compares the new virtual DOM with the previous one (diffing), calculates minimal changes needed, and efficiently updates only those parts of the real DOM.',
    
    detailedExplanation: 'Direct DOM manipulation is slow. React keeps a virtual representation of the UI in memory. When state changes, React creates a new virtual DOM tree, compares it with the previous one (reconciliation), identifies differences (diffing), and updates only the changed parts in the real DOM (batching updates). This process is much faster than updating the entire DOM.',
    
    example: {
      code: `// When this component re-renders:
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}

// React's process:
// 1. Create new Virtual DOM tree
// 2. Compare with previous Virtual DOM
// 3. Find differences (maybe one todo added)
// 4. Update only that <li> in real DOM

// Key prop helps React identify which items changed
function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        // âœ… Good - stable unique key
        <li key={item.id}>{item.name}</li>
        
        // âŒ Bad - index as key (causes bugs)
        // <li key={index}>{item.name}</li>
      ))}
    </ul>
  );
}`,
      language: 'jsx'
    },
    
    interviewAnswer: 'The Virtual DOM is React\'s secret to performance. When state changes, React doesn\'t immediately touch the real DOM. Instead, it creates a new virtual DOM tree, diffs it against the old one, and calculates the minimal set of changes needed. Then it batches these changes and updates the real DOM efficiently. This is why the "key" prop matters in lists - it helps React identify which items changed.',
    
    commonMistakes: [
      'Not using key prop in lists',
      'Using index as key (causes bugs when order changes)',
      'Thinking virtual DOM makes React automatically fast (inefficient code still matters)',
      'Not understanding when React re-renders'
    ],
    
    realWorldUse: 'Virtual DOM is internal to React - you don\'t interact with it directly. It\'s why React can handle complex UIs with thousands of components efficiently. Understanding it helps you write better code (proper keys, avoiding unnecessary re-renders).',
    
    followUpQuestions: [
      'Why is the key prop important?',
      'What is reconciliation?',
      'Is Virtual DOM always faster than direct DOM manipulation?'
    ]
  },

  {
    id: 'react-usecontext',
    category: 'react',
    type: 'theory',
    question: 'What is useContext and when should you use it?',
    difficulty: 'intermediate',
    tags: ['hooks', 'context', 'state-management'],
    
    shortAnswer: 'useContext lets components access context values without prop drilling. It\'s for sharing data (like themes, user info, language) across the component tree without passing props through every level.',
    
    detailedExplanation: 'Context provides a way to pass data through the component tree without manually passing props at every level. useContext accepts a Context object and returns the current context value. When the context value updates, components using that context re-render. Use it for global data like authentication, themes, or preferences. For frequent updates or complex state, consider state management libraries instead.',
    
    example: {
      code: `import { createContext, useContext, useState } from 'react';

// Create context
const ThemeContext = createContext();

// Provider component
function App() {
  const [theme, setTheme] = useState('dark');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

// Child component - no props needed!
function Toolbar() {
  return <ThemedButton />;
}

// Deeply nested component can access context
function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <button 
      style={{ background: theme === 'dark' ? '#333' : '#fff' }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      Toggle Theme
    </button>
  );
}

// Multiple contexts
const UserContext = createContext();
const SettingsContext = createContext();

function Profile() {
  const user = useContext(UserContext);
  const settings = useContext(SettingsContext);
  
  return <div>{user.name} - {settings.language}</div>;
}`,
      language: 'jsx'
    },
    
    interviewAnswer: 'useContext solves prop drilling - when you need to pass data through many component layers. Instead of passing theme props through 5 components, I create a ThemeContext and any component can useContext(ThemeContext) to access it. This is cleaner than passing props, but be careful: every consumer re-renders when context changes. For frequent updates, I use state management libraries or split contexts.',
    
    commonMistakes: [
      'Putting too much in one context (unnecessary re-renders)',
      'Not memoizing context value (causes all consumers to re-render)',
      'Using context for all state (prop drilling isn\'t always bad)',
      'Forgetting to provide context (undefined values)'
    ],
    
    realWorldUse: 'Theme switching, authentication state, language/i18n, user preferences, shopping cart state. Most apps have 2-5 contexts for global concerns.',
    
    followUpQuestions: [
      'When should you avoid using Context?',
      'How do you optimize Context to avoid unnecessary re-renders?',
      'What\'s the difference between Context and Redux?'
    ]
  },

  {
    id: 'react-useref',
    category: 'react',
    type: 'theory',
    question: 'What is useRef and when would you use it?',
    difficulty: 'intermediate',
    tags: ['hooks', 'useRef', 'dom'],
    
    shortAnswer: 'useRef returns a mutable ref object that persists across renders without causing re-renders. Use it to access DOM elements directly or store mutable values that shouldn\'t trigger re-renders.',
    
    detailedExplanation: 'useRef creates a ref object with a .current property that can hold any value. Unlike state, changing a ref doesn\'t trigger re-renders. Common uses: storing DOM references for focus/scroll, storing previous values, holding timeouts/intervals, storing mutable values that don\'t affect rendering. The ref object persists for the component\'s lifetime.',
    
    example: {
      code: `import { useRef, useEffect, useState } from 'react';

// DOM access
function TextInput() {
  const inputRef = useRef(null);
  
  useEffect(() => {
    // Focus input on mount
    inputRef.current.focus();
  }, []);
  
  return <input ref={inputRef} />;
}

// Storing previous value
function Counter() {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();
  
  useEffect(() => {
    prevCountRef.current = count;
  });
  
  const prevCount = prevCountRef.current;
  
  return (
    <div>
      <p>Now: {count}, Before: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

// Storing interval (not causing re-renders)
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef();
  
  const start = () => {
    intervalRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  };
  
  const stop = () => {
    clearInterval(intervalRef.current);
  };
  
  return (
    <div>
      <p>{seconds}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}

// When NOT to use ref
function Bad() {
  const countRef = useRef(0);
  
  return (
    <div>
      {/* âŒ Won't re-render when countRef changes! */}
      <p>{countRef.current}</p>
      <button onClick={() => countRef.current++}>Bad</button>
    </div>
  );
}`,
      language: 'jsx'
    },
    
    interviewAnswer: 'useRef is for values that persist but don\'t trigger re-renders. I use it to access DOM nodes - like focusing an input or measuring element size. It\'s also great for storing previous values or holding setInterval/setTimeout IDs. Key difference from state: changing ref.current doesn\'t cause a re-render, making it perfect for values that change but don\'t affect the UI.',
    
    commonMistakes: [
      'Using ref instead of state for data that should trigger re-renders',
      'Reading/writing ref during render (side effects belong in useEffect)',
      'Forgetting to clear intervals/timeouts stored in refs',
      'Overusing refs when state would be clearer'
    ],
    
    realWorldUse: 'Auto-focusing inputs, measuring element sizes, implementing scroll-to-top, storing WebSocket connections, holding animation frame IDs, tracking if component is mounted.',
    
    followUpQuestions: [
      'What\'s the difference between useRef and useState?',
      'Can you use refs to store objects?',
      'Why doesn\'t changing a ref cause a re-render?'
    ]
  },

  {
    id: 'react-usememo-usecallback',
    category: 'react',
    type: 'theory',
    question: 'What are useMemo and useCallback? When should you use them?',
    difficulty: 'intermediate',
    tags: ['hooks', 'performance', 'memoization'],
    
    shortAnswer: 'useMemo memoizes computed values, useCallback memoizes functions. Both prevent unnecessary recalculations/recreations between renders. Use them to optimize expensive computations or prevent unnecessary child re-renders.',
    
    detailedExplanation: 'useMemo caches the result of a computation and only recalculates when dependencies change. useCallback caches a function instance, preventing recreation on every render. Use useMemo for expensive calculations or to maintain reference equality for objects/arrays. Use useCallback when passing callbacks to optimized child components (wrapped in React.memo) or as dependencies in useEffect. Don\'t overuse - premature optimization can hurt readability.',
    
    example: {
      code: `import { useMemo, useCallback, useState, memo } from 'react';

// useMemo - expensive computation
function DataTable({ data }) {
  // Without useMemo - runs every render
  const sortedData = data.sort((a, b) => a.value - b.value);
  
  // With useMemo - only when data changes
  const sortedData = useMemo(() => {
    console.log('Sorting...');
    return data.sort((a, b) => a.value - b.value);
  }, [data]);
  
  return <div>{sortedData.map(/* ... */)}</div>;
}

// useCallback - function reference
function TodoList() {
  const [todos, setTodos] = useState([]);
  
  // âŒ New function every render - child re-renders
  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text }]);
  };
  
  // âœ… Same function reference - child doesn't re-render
  const addTodoOptimized = useCallback((text) => {
    setTodos(prev => [...prev, { id: Date.now(), text }]);
  }, []); // No dependencies needed with functional update
  
  return <TodoForm onAdd={addTodoOptimized} />;
}

// React.memo prevents re-renders if props haven't changed
const TodoForm = memo(({ onAdd }) => {
  console.log('TodoForm rendered');
  const [text, setText] = useState('');
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onAdd(text);
      setText('');
    }}>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button>Add</button>
    </form>
  );
});

// When NOT to use them
function Counter() {
  const [count, setCount] = useState(0);
  
  // âŒ Overkill - no benefit
  const double = useMemo(() => count * 2, [count]);
  
  // âœ… Just compute it
  const double = count * 2;
  
  return <div>{double}</div>;
}`,
      language: 'jsx'
    },
    
    interviewAnswer: 'useMemo and useCallback are optimization tools. useMemo caches expensive calculations - like filtering/sorting large lists. useCallback caches functions so child components wrapped in React.memo don\'t re-render unnecessarily. I don\'t use them everywhere - only when profiling shows a performance issue or when passing functions/objects to memo-ed children. Overusing them can actually hurt performance because memoization has overhead.',
    
    commonMistakes: [
      'Using them everywhere (premature optimization)',
      'Not including all dependencies (stale closures)',
      'Using useCallback without React.memo (no benefit)',
      'Memoizing cheap operations (wasted effort)'
    ],
    
    realWorldUse: 'Optimizing large lists, expensive filtering/sorting, preventing API calls in effects, optimizing chart/graph rendering. Use React DevTools Profiler to identify actual performance issues first.',
    
    followUpQuestions: [
      'When should you NOT use useMemo?',
      'What\'s the difference between useMemo and useCallback?',
      'How does React.memo relate to these hooks?'
    ]
  },

  {
    id: 'react-controlled-uncontrolled',
    category: 'react',
    type: 'theory',
    question: 'What is the difference between controlled and uncontrolled components?',
    difficulty: 'beginner',
    tags: ['forms', 'inputs', 'state'],
    
    shortAnswer: 'Controlled components: React state controls the input value. Uncontrolled components: DOM controls the input value (accessed via refs). Controlled is preferred for validation and complex forms.',
    
    detailedExplanation: 'Controlled components have their value controlled by React state. Every keystroke updates state and re-renders with the new value. You have full control and can validate/transform input. Uncontrolled components let the DOM handle state - you read values using refs when needed (like native HTML forms). Controlled is React-idiomatic and preferred, but uncontrolled can be simpler for basic forms.',
    
    example: {
      code: `import { useState, useRef } from 'react';

// CONTROLLED - React controls value
function ControlledForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      {/* Can validate as user types */}
      {password.length < 8 && <p>Password too short</p>}
      
      <button>Submit</button>
    </form>
  );
}

// UNCONTROLLED - DOM controls value
function UncontrolledForm() {
  const emailRef = useRef();
  const passwordRef = useRef();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      email: emailRef.current.value,
      password: passwordRef.current.value
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input ref={emailRef} defaultValue="" />
      <input ref={passwordRef} defaultValue="" />
      <button>Submit</button>
    </form>
  );
}

// Hybrid - File input is always uncontrolled
function FileUpload() {
  const [name, setName] = useState(''); // controlled
  const fileRef = useRef(); // uncontrolled (can't control file inputs)
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const file = fileRef.current.files[0];
    console.log({ name, file });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input type="file" ref={fileRef} />
      <button>Upload</button>
    </form>
  );
}`,
      language: 'jsx'
    },
    
    interviewAnswer: 'Controlled components are the React way - state is the single source of truth. Every change flows through state, giving me full control to validate, format, or restrict input. Uncontrolled components let the DOM manage state, which is simpler but less flexible. I default to controlled for most forms because I usually need validation or need to submit via AJAX. Uncontrolled is fine for simple forms where I just need values on submit.',
    
    commonMistakes: [
      'Mixing controlled and uncontrolled (value + ref)',
      'Not using defaultValue for uncontrolled inputs',
      'Forgetting controlled inputs need onChange',
      'Using controlled when uncontrolled would be simpler'
    ],
    
    realWorldUse: 'Controlled: complex forms with validation, dynamic forms, search inputs with suggestions. Uncontrolled: simple contact forms, file uploads (always uncontrolled), integrating with non-React libraries.',
    
    followUpQuestions: [
      'When would you use an uncontrolled component?',
      'Can file inputs be controlled?',
      'What is defaultValue vs value?'
    ]
  },

  {
    id: 'react-lifecycle',
    category: 'react',
    type: 'theory',
    question: 'Explain React component lifecycle and how it relates to hooks',
    difficulty: 'intermediate',
    tags: ['lifecycle', 'hooks', 'useEffect'],
    
    shortAnswer: 'Class components have lifecycle methods (componentDidMount, componentDidUpdate, componentWillUnmount). Function components use useEffect to replicate all lifecycle phases: mount (empty array), update (dependencies), unmount (cleanup function).',
    
    detailedExplanation: 'Component lifecycle has three phases: mounting (component created), updating (props/state change), unmounting (component removed). Class components have specific methods for each. In function components, useEffect handles all phases: running after render (mount + update), with dependency array controlling when it runs, and cleanup function handling unmount. Multiple useEffects can handle different concerns separately.',
    
    example: {
      code: `import { useEffect, useState } from 'react';

// Class component lifecycle (old way)
class Timer extends React.Component {
  componentDidMount() {
    // Runs once after first render
    this.interval = setInterval(() => {
      this.setState({ seconds: this.state.seconds + 1 });
    }, 1000);
  }
  
  componentDidUpdate(prevProps, prevState) {
    // Runs after every update
    if (prevProps.userId !== this.props.userId) {
      this.fetchUserData(this.props.userId);
    }
  }
  
  componentWillUnmount() {
    // Cleanup before removal
    clearInterval(this.interval);
  }
}

// Function component with hooks (modern way)
function Timer({ userId }) {
  const [seconds, setSeconds] = useState(0);
  
  // componentDidMount + componentWillUnmount
  useEffect(() => {
    console.log('Component mounted');
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    
    // Cleanup (componentWillUnmount)
    return () => {
      console.log('Component unmounting');
      clearInterval(interval);
    };
  }, []); // Empty array = run once on mount
  
  // componentDidUpdate (when userId changes)
  useEffect(() => {
    console.log('userId changed to:', userId);
    fetchUserData(userId);
  }, [userId]); // Runs when userId changes
  
  // Runs after every render (like componentDidUpdate)
  useEffect(() => {
    console.log('Component rendered');
  }); // No array = every render
  
  return <div>{seconds}s</div>;
}

// Common pattern: separate concerns
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  // Effect 1: Fetch data
  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);
  
  // Effect 2: Update page title
  useEffect(() => {
    document.title = user ? user.name : 'Loading...';
  }, [user]);
  
  // Effect 3: Track analytics
  useEffect(() => {
    analytics.track('profile_view', { userId });
  }, [userId]);
  
  return <div>{user?.name}</div>;
}`,
      language: 'jsx'
    },
    
    interviewAnswer: 'In class components, lifecycle methods gave control over mount, update, and unmount phases. useEffect replaces all of them. Empty dependency array runs once on mount, dependencies run on specific changes, and cleanup functions run on unmount. This is actually better than classes because I can split related logic into multiple effects instead of cramming everything into one componentDidMount method.',
    
    commonMistakes: [
      'Missing dependencies in useEffect array',
      'Not returning cleanup functions (memory leaks)',
      'Using componentWillMount patterns (deprecated)',
      'Running effects on every render unintentionally'
    ],
    
    realWorldUse: 'Data fetching on mount, subscribing to WebSockets, setting up event listeners, timers, updating document title, analytics tracking. Every side effect uses useEffect.',
    
    followUpQuestions: [
      'What React lifecycle methods are deprecated?',
      'How do you replicate componentDidMount with hooks?',
      'Why is useEffect better than lifecycle methods?'
    ]
  },

  {
    id: 'react-memo-optimization',
    category: 'react',
    type: 'theory',
    question: 'What is React.memo and how does it help with performance?',
    difficulty: 'intermediate',
    tags: ['performance', 'optimization', 'memo'],
    
    shortAnswer: 'React.memo is a higher-order component that prevents re-renders if props haven\'t changed. It does shallow comparison of props and only re-renders when they differ.',
    
    detailedExplanation: 'React.memo wraps a component to memoize it. If props are the same (shallow comparison), React skips rendering and reuses the last result. This optimizes expensive components or components that render frequently with the same props. You can provide a custom comparison function as second argument. Use with useCallback/useMemo to ensure prop references stay stable.',
    
    example: {
      code: `import { memo, useState, useCallback } from 'react';

// Without memo - re-renders every time parent renders
function ExpensiveComponent({ data, onClick }) {
  console.log('ExpensiveComponent rendered');
  return (
    <div>
      {data.map(item => <div key={item.id}>{item.name}</div>)}
      <button onClick={onClick}>Click</button>
    </div>
  );
}

// With memo - only re-renders if props change
const MemoizedComponent = memo(function ExpensiveComponent({ data, onClick }) {
  console.log('MemoizedComponent rendered');
  return (
    <div>
      {data.map(item => <div key={item.id}>{item.name}</div>)}
      <button onClick={onClick}>Click</button>
    </div>
  );
});

// Parent component
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [data] = useState([{ id: 1, name: 'Item 1' }]);
  
  // âŒ New function every render - memo doesn't help
  const handleClick = () => console.log('clicked');
  
  // âœ… Stable function reference - memo works
  const handleClickOptimized = useCallback(() => {
    console.log('clicked');
  }, []);
  
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      
      {/* Re-renders every time despite memo */}
      <MemoizedComponent data={data} onClick={handleClick} />
      
      {/* Only re-renders if data changes */}
      <MemoizedComponent data={data} onClick={handleClickOptimized} />
    </div>
  );
}

// Custom comparison function
const UserCard = memo(
  function UserCard({ user }) {
    return <div>{user.name} - {user.email}</div>;
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip render)
    return prevProps.user.id === nextProps.user.id;
  }
);`,
      language: 'jsx'
    },
    
    interviewAnswer: 'React.memo prevents unnecessary re-renders by comparing props. If props haven\'t changed, React reuses the previous render. This is crucial for expensive components or lists with many items. However, it only works if props are stable - functions and objects need useCallback/useMemo. I don\'t wrap every component in memo - only when profiling shows it helps. Overusing memo adds overhead without benefits.',
    
    commonMistakes: [
      'Using memo without stable props (functions/objects)',
      'Memoizing every component (premature optimization)',
      'Expecting deep comparison (it\'s shallow)',
      'Not profiling before optimizing'
    ],
    
    realWorldUse: 'List items in large tables, expensive chart components, forms with many fields, components that receive stable props but parent re-renders frequently.',
    
    followUpQuestions: [
      'What\'s the difference between React.memo and useMemo?',
      'When should you NOT use React.memo?',
      'How does React.memo compare props?'
    ]
  },

  {
    id: 'react-lazy-suspense',
    category: 'react',
    type: 'theory',
    question: 'What are React.lazy and Suspense? How do they improve performance?',
    difficulty: 'intermediate',
    tags: ['performance', 'code-splitting', 'lazy-loading'],
    
    shortAnswer: 'React.lazy enables code-splitting by dynamically importing components. Suspense shows a fallback UI while the lazy component loads. This reduces initial bundle size.',
    
    detailedExplanation: 'React.lazy allows you to render a dynamic import as a regular component. The component code isn\'t loaded until it\'s rendered. Suspense wraps lazy components and displays a fallback (like a loading spinner) while they load. This splits your bundle into smaller chunks, making the initial load faster. Especially useful for routes, modals, and tabs.',
    
    example: {
      code: `import { lazy, Suspense, useState } from 'react';

// Lazy load components
const Dashboard = lazy(() => import('./Dashboard'));
const Settings = lazy(() => import('./Settings'));
const HeavyChart = lazy(() => import('./HeavyChart'));

function App() {
  const [page, setPage] = useState('home');
  
  return (
    <div>
      <nav>
        <button onClick={() => setPage('home')}>Home</button>
        <button onClick={() => setPage('dashboard')}>Dashboard</button>
        <button onClick={() => setPage('settings')}>Settings</button>
      </nav>
      
      {/* Suspense shows fallback while loading */}
      <Suspense fallback={<div>Loading...</div>}>
        {page === 'dashboard' && <Dashboard />}
        {page === 'settings' && <Settings />}
      </Suspense>
    </div>
  );
}

// Route-based code splitting (React Router)
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Profile = lazy(() => import('./pages/Profile'));

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// Nested Suspense boundaries
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Separate loading states */}
      <Suspense fallback={<div>Loading stats...</div>}>
        <Stats />
      </Suspense>
      
      <Suspense fallback={<div>Loading chart...</div>}>
        <HeavyChart />
      </Suspense>
    </div>
  );
}

// Error boundary with lazy loading
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return <h2>Failed to load component</h2>;
    }
    return this.props.children;
  }
}

function SafeLazyLoad() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <LazyComponent />
      </Suspense>
    </ErrorBoundary>
  );
}`,
      language: 'jsx'
    },
    
    interviewAnswer: 'React.lazy and Suspense are game-changers for performance. Instead of loading all components upfront, I lazy load routes and heavy components. The initial bundle stays small, and components load on demand. Suspense provides a clean way to show loading states. In a large app, this can cut the initial load time in half. I lazy load routes, modals, admin panels, and anything users might not see immediately.',
    
    commonMistakes: [
      'Lazy loading everything (overhead for small components)',
      'Not wrapping with Suspense (causes errors)',
      'Poor fallback UX (flash of loading states)',
      'Not considering network conditions'
    ],
    
    realWorldUse: 'Route-based code splitting, admin panels, modals, tabs, charts/visualization libraries, markdown editors, any heavy third-party components.',
    
    followUpQuestions: [
      'Can you use React.lazy for non-default exports?',
      'What happens if a lazy component fails to load?',
      'How does code splitting affect SEO?'
    ]
  },

  {
    id: 'react-error-boundaries',
    category: 'react',
    type: 'theory',
    question: 'What are Error Boundaries and how do they work?',
    difficulty: 'intermediate',
    tags: ['error-handling', 'class-components', 'production'],
    
    shortAnswer: 'Error Boundaries catch JavaScript errors in child components, log them, and display fallback UI instead of crashing the entire app. They\'re class components with componentDidCatch or getDerivedStateFromError.',
    
    detailedExplanation: 'Error Boundaries are React components that catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them. They don\'t catch errors in event handlers, async code, or the error boundary itself. Use them to wrap sections of your app and provide graceful error recovery. Currently requires class components (no hook equivalent yet).',
    
    example: {
      code: `import React from 'react';

// Error Boundary class component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    // Log error to error reporting service
    console.error('Error caught:', error, errorInfo);
    // logErrorToService(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong</h2>
          <details>
            {this.state.error?.message}
          </details>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Using Error Boundary
function App() {
  return (
    <ErrorBoundary>
      <Navigation />
      <ErrorBoundary>
        <Content />
      </ErrorBoundary>
      <ErrorBoundary>
        <Sidebar />
      </ErrorBoundary>
    </ErrorBoundary>
  );
}

// Component that might throw
function BuggyComponent() {
  const [explode, setExplode] = useState(false);
  
  if (explode) {
    throw new Error('Boom!');
  }
  
  return <button onClick={() => setExplode(true)}>Explode</button>;
}

// Error boundaries DON'T catch these:
function NotCaught() {
  const handleClick = () => {
    // âŒ Error in event handler - not caught
    throw new Error('Not caught');
  };
  
  useEffect(() => {
    // âŒ Async error - not caught
    setTimeout(() => {
      throw new Error('Not caught');
    }, 1000);
  }, []);
  
  return <button onClick={handleClick}>Click</button>;
}

// Custom hook for error boundaries (workaround)
function useErrorHandler() {
  const [error, setError] = useState(null);
  
  if (error) {
    throw error; // Error boundary will catch this
  }
  
  return setError;
}

function ComponentWithErrorHandler() {
  const throwError = useErrorHandler();
  
  const handleClick = async () => {
    try {
      await riskyOperation();
    } catch (err) {
      throwError(err); // Throw to error boundary
    }
  };
  
  return <button onClick={handleClick}>Do Risky Thing</button>;
}`,
      language: 'jsx'
    },
    
    interviewAnswer: 'Error Boundaries prevent one broken component from crashing the entire app. I wrap different sections in error boundaries so if one fails, the rest keeps working. This is essential for production - users see a helpful error message instead of a blank page. I log errors to Sentry or LogRocket for monitoring. Important: they don\'t catch event handler or async errors - those need try/catch.',
    
    commonMistakes: [
      'Expecting error boundaries to catch all errors',
      'Not logging errors (you won\'t know when things break)',
      'Only one error boundary for entire app (too coarse)',
      'Trying to use error boundaries with hooks (not supported yet)'
    ],
    
    realWorldUse: 'Production apps always need error boundaries. Wrap routes, third-party widgets, experimental features. Integrate with error tracking services like Sentry, Bugsnag, or LogRocket.',
    
    followUpQuestions: [
      'What errors do Error Boundaries NOT catch?',
      'Can you use Error Boundaries with hooks?',
      'How do you reset an Error Boundary?'
    ]
  },

  {
    id: 'react-custom-hooks',
    category: 'react',
    type: 'coding',
    question: 'What are custom hooks and how do you create them?',
    difficulty: 'intermediate',
    tags: ['hooks', 'reusability', 'patterns'],
    
    shortAnswer: 'Custom hooks are JavaScript functions starting with "use" that can call other hooks. They extract reusable stateful logic between components without changing component hierarchy.',
    
    detailedExplanation: 'Custom hooks let you extract component logic into reusable functions. They can use built-in hooks (useState, useEffect, etc.) and return anything - state, functions, objects. This enables sharing logic without render props or HOCs. Each component using a custom hook gets independent state. Common patterns: data fetching, form handling, subscriptions, animations.',
    
    example: {
      code: `import { useState, useEffect } from 'react';

// Custom hook: useFetch
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);
  
  return { data, loading, error };
}

// Usage
function UserProfile({ userId }) {
  const { data, loading, error } = useFetch(\`/api/users/\${userId}\`);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{data.name}</div>;
}

// Custom hook: useLocalStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue];
}

// Usage
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'dark');
  const [language, setLanguage] = useLocalStorage('language', 'en');
  
  return (
    <div>
      <select value={theme} onChange={e => setTheme(e.target.value)}>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </div>
  );
}

// Custom hook: useDebounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage
function SearchBox() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  
  useEffect(() => {
    if (debouncedSearch) {
      // Make API call with debounced value
      searchAPI(debouncedSearch);
    }
  }, [debouncedSearch]);
  
  return <input value={search} onChange={e => setSearch(e.target.value)} />;
}

// Custom hook: useToggle
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = () => setValue(v => !v);
  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  
  return [value, { toggle, setTrue, setFalse }];
}

// Usage
function Modal() {
  const [isOpen, { toggle, setFalse }] = useToggle(false);
  
  return (
    <>
      <button onClick={toggle}>Toggle Modal</button>
      {isOpen && (
        <div className="modal">
          <button onClick={setFalse}>Close</button>
        </div>
      )}
    </>
  );
}`,
      language: 'jsx'
    },
    
    interviewAnswer: 'Custom hooks are my go-to for extracting reusable logic. Instead of duplicating useState/useEffect patterns, I create hooks like useFetch, useLocalStorage, or useDebounce. Each component using the hook gets independent state. This keeps components clean and focused on UI. Custom hooks are cleaner than HOCs or render props because they don\'t add wrapper components.',
    
    commonMistakes: [
      'Not starting name with "use" (breaks rules of hooks)',
      'Calling hooks conditionally inside custom hooks',
      'Sharing state between components (each gets independent state)',
      'Making hooks too specific (reduces reusability)'
    ],
    
    realWorldUse: 'Data fetching, form handling, authentication, local storage, window size, media queries, web sockets, timers, animations. Libraries like react-query and swr are built on custom hooks.',
    
    followUpQuestions: [
      'Do components using the same custom hook share state?',
      'Can custom hooks call other custom hooks?',
      'What are the rules of hooks?'
    ],
    
    codingChallenge: {
      starterCode: `// Create a useWindowSize custom hook
function useWindowSize() {
  // Your code here
}

// Test it
function App() {
  const { width, height } = useWindowSize();
  return <div>{width} x {height}</div>;
}`,
      solution: `function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return size;
}`,
      hints: [
        'Use useState to store width and height',
        'Use useEffect to add/remove resize listener',
        'Return cleanup function to prevent memory leaks'
      ]
    }
  },

  {
    id: 'react-usereducer',
    category: 'react',
    type: 'theory',
    question: 'What is useReducer and when should you use it over useState?',
    difficulty: 'intermediate',
    tags: ['hooks', 'useReducer', 'state-management'],
    shortAnswer: 'useReducer manages complex state with a reducer function (like Redux). Use it when state has multiple sub-values, when next state depends on previous state, or when update logic is complex.',
    detailedExplanation: 'useReducer(reducer, initialState) returns [state, dispatch]. You dispatch actions and the reducer computes new state. Better than useState when: state has multiple related fields that change together, transitions are complex, you want to co-locate state logic, or you need to test state transitions independently. It follows the same pattern as Redux.',
    example: {
      code: `import { useReducer } from 'react';

// Reducer function - pure function
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      const exists = state.items.find(i => i.id === action.item.id);
      if (exists) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
          )
        };
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] };
      
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.id)
      };
      
    case 'CLEAR_CART':
      return { ...state, items: [] };
      
    default:
      return state;
  }
}

const initialState = { items: [], coupon: null };

function ShoppingCart() {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  
  const addItem = (item) => dispatch({ type: 'ADD_ITEM', item });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', id });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  
  const total = cart.items.reduce((sum, item) => 
    sum + item.price * item.qty, 0
  );
  
  return (
    <div>
      {cart.items.map(item => (
        <div key={item.id}>
          {item.name} x{item.qty}
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
      <p>Total: \${total}</p>
      <button onClick={clearCart}>Clear</button>
    </div>
  );
}

// When to use useReducer vs useState:
// useState: simple values, independent state
// useReducer: complex objects, related state changes, many actions`,
      language: 'jsx'
    },
    interviewAnswer: 'useReducer is useState with more structure. I use it when I find myself writing many setState calls that need to be coordinated, or when state transitions have complex logic. The reducer is a pure function that maps (state, action) â†’ newState, which is easy to test in isolation. For a shopping cart with add/remove/update/clear operations, useReducer is much cleaner than multiple useState calls.',
    commonMistakes: [
      'Mutating state inside the reducer (must return new state)',
      'Using useReducer for simple boolean toggles (overkill)',
      'Forgetting to handle the default case in switch',
      'Putting side effects inside the reducer (must be pure)'
    ],
    realWorldUse: 'Shopping carts, form state with many fields and validation, complex UI state machines, any state with multiple related actions.',
    followUpQuestions: [
      'When would you choose Redux over useReducer?',
      'Can you use useReducer with Context for global state?',
      'What is the difference between Redux and useReducer?'
    ]
  },

  {
    id: 'react-forwardref',
    category: 'react',
    type: 'theory',
    question: 'What is forwardRef and when do you need it?',
    difficulty: 'intermediate',
    tags: ['forwardRef', 'refs', 'dom'],
    shortAnswer: 'forwardRef allows a parent component to pass a ref to a child component\'s DOM element. Needed when you want to access a DOM node inside a reusable component from its parent.',
    detailedExplanation: 'By default, refs on components point to the component instance, not the DOM. With functional components, there is no instance. forwardRef wraps a component and passes the ref through to a DOM element or child component. Commonly used for: auto-focus behavior, measuring DOM sizes, scrolling, and building component libraries where consumers need DOM access.',
    example: {
      code: `import { forwardRef, useRef, useEffect } from 'react';

// Without forwardRef - ref doesn't work on custom components
function Input(props) {
  return <input {...props} />;
}

// âŒ This ref points to nothing useful
const ref = useRef();
<Input ref={ref} /> // ref.current is null in functional component

// With forwardRef - correctly forwards the ref
const Input = forwardRef(function Input(props, ref) {
  return (
    <input
      ref={ref}  // Forward to the DOM input
      className="border rounded px-3 py-2"
      {...props}
    />
  );
});

// Parent can now access the DOM input
function LoginForm() {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  
  useEffect(() => {
    emailRef.current?.focus(); // Auto-focus on mount
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Access values directly
    console.log(emailRef.current.value);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Input ref={emailRef} type="email" placeholder="Email" />
      <Input ref={passwordRef} type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}

// useImperativeHandle - expose custom methods via ref
const FancyInput = forwardRef(function FancyInput(props, ref) {
  const inputRef = useRef();
  
  // Expose only what parent needs, not the whole DOM node
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => { inputRef.current.value = ''; },
    getValue: () => inputRef.current.value,
  }));
  
  return <input ref={inputRef} className="fancy" {...props} />;
});

// Parent uses the imperative API
function Parent() {
  const inputRef = useRef();
  
  return (
    <>
      <FancyInput ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
      <button onClick={() => inputRef.current.clear()}>Clear</button>
    </>
  );
}`,
      language: 'jsx'
    },
    interviewAnswer: 'forwardRef is needed when building reusable input or UI components where consumers need to interact with the underlying DOM â€” like auto-focusing a custom input or triggering scroll. I use it in component libraries. I pair it with useImperativeHandle to expose only the specific methods the parent needs rather than the entire DOM node, which is a cleaner API.',
    commonMistakes: [
      'Forgetting to accept ref as second parameter in forwardRef',
      'Passing ref in the props object (it\'s separate)',
      'Overusing refs when controlled components would be cleaner',
      'Exposing the full DOM node when specific methods are better'
    ],
    realWorldUse: 'UI component libraries (MUI, Chakra UI, shadcn/ui), form libraries, animation libraries, any reusable input component.',
    followUpQuestions: [
      'What is useImperativeHandle?',
      'When would you use a ref instead of state?',
      'What is the difference between ref and callback ref?'
    ]
  },

  {
    id: 'react-portals',
    category: 'react',
    type: 'theory',
    question: 'What are React Portals and when do you need them?',
    difficulty: 'intermediate',
    tags: ['portals', 'dom', 'modals'],
    shortAnswer: 'Portals render children outside the parent DOM hierarchy while keeping them in the React tree. Used for modals, tooltips, and dropdowns that need to escape CSS overflow:hidden or z-index stacking contexts.',
    detailedExplanation: 'ReactDOM.createPortal(child, container) renders child into a different DOM node than the parent. The component still behaves as a React child â€” events bubble up through the React tree (not the DOM tree), and Context works normally. Portals solve the stacking context problem: a modal inside a div with overflow:hidden would be clipped without a portal.',
    example: {
      code: `import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';

// Modal using Portal
function Modal({ isOpen, onClose, children }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  // Renders directly in document.body, not inside parent div
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-white rounded-xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()} // Prevent closing on content click
      >
        {children}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-200 rounded"
        >
          Close
        </button>
      </div>
    </div>,
    document.body  // Portal target
  );
}

// Usage â€” Modal is inside a div with overflow:hidden
// But it still renders at document.body level
function App() {
  const [modalOpen, setModalOpen] = useState(false);
  
  return (
    <div style={{ overflow: 'hidden', height: '200px' }}>
      <button onClick={() => setModalOpen(true)}>Open Modal</button>
      
      {/* Without portal: modal would be clipped by overflow:hidden */}
      {/* With portal: modal renders at body level â€” not clipped! */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h2>Modal Title</h2>
        <p>This content is outside the overflow:hidden div!</p>
      </Modal>
    </div>
  );
}

// Event bubbling still works through React tree
function Parent() {
  return (
    <div onClick={() => console.log('Parent clicked!')}>
      <Modal isOpen={true}>
        <button>Click me</button>
        {/* Click event bubbles to Parent in React tree, not DOM tree */}
      </Modal>
    </div>
  );
}`,
      language: 'jsx'
    },
    interviewAnswer: 'Portals solve a very specific CSS problem: when you need to render a modal or dropdown but a parent element has overflow:hidden or a z-index stacking context that would clip or hide it. The portal renders the content at document.body level where nothing clips it, but React events still bubble normally through the component tree. This is how most modal libraries work.',
    commonMistakes: [
      'Manually creating DOM nodes instead of using createPortal',
      'Forgetting that events still bubble through React tree',
      'Not cleaning up portal DOM nodes on unmount',
      'Using portals when z-index management would be simpler'
    ],
    realWorldUse: 'Modals, tooltips, dropdowns, notification toasts, context menus â€” anything that needs to "escape" its container\'s CSS constraints.',
    followUpQuestions: [
      'Does event bubbling work the same with Portals?',
      'What problem do Portals solve?',
      'Can you use Context inside a Portal?'
    ]
  },

  {
    id: 'react-hoc',
    category: 'react',
    type: 'theory',
    question: 'What are Higher-Order Components (HOC) in React?',
    difficulty: 'intermediate',
    tags: ['hoc', 'patterns', 'composition'],
    shortAnswer: 'A HOC is a function that takes a component and returns a new enhanced component. Used for cross-cutting concerns like authentication, logging, or adding props. Being replaced by hooks in modern React.',
    detailedExplanation: 'HOCs are the React pattern for reusing component logic. A HOC wraps a component and can add props, state, lifecycle logic, or conditional rendering. Common HOCs: withAuth (redirects if not logged in), withErrorBoundary, connect() from Redux. The main drawback is "wrapper hell" (many nested HOCs) and prop collision. Hooks solve the same problems more cleanly.',
    example: {
      code: `import { ComponentType, useState, useEffect } from 'react';

// HOC: withAuth â€” redirects if not authenticated
function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth(); // custom hook
    
    if (loading) return <LoadingSpinner />;
    if (!user) {
      redirect('/login');
      return null;
    }
    
    return <WrappedComponent {...props} user={user} />;
  };
}

// Usage
function Dashboard({ user }) {
  return <div>Welcome, {user.name}</div>;
}

const ProtectedDashboard = withAuth(Dashboard);
<ProtectedDashboard /> // Will redirect if not logged in

// HOC: withLogger â€” logs renders
function withLogger(WrappedComponent) {
  const displayName = WrappedComponent.displayName || WrappedComponent.name;
  
  function WithLogger(props) {
    useEffect(() => {
      console.log(\`\${displayName} mounted\`);
      return () => console.log(\`\${displayName} unmounted\`);
    }, []);
    
    return <WrappedComponent {...props} />;
  }
  
  // Important: set displayName for debugging
  WithLogger.displayName = \`withLogger(\${displayName})\`;
  return WithLogger;
}

// HOC: withLoadingState
function withLoadingState(WrappedComponent) {
  return function WithLoading({ isLoading, ...props }) {
    if (isLoading) return <Spinner />;
    return <WrappedComponent {...props} />;
  };
}

// Composing multiple HOCs
const EnhancedDashboard = withLogger(withAuth(withLoadingState(Dashboard)));

// Modern approach with hooks (replaces most HOCs)
function useDashboard() {
  const { user, loading } = useAuth();
  return { user, loading };
}`,
      language: 'jsx'
    },
    interviewAnswer: 'HOCs solve cross-cutting concerns â€” features that need to be applied across many components like authentication, logging, or error boundaries. The pattern wraps a component and returns an enhanced version. However, hooks have largely replaced HOCs because they\'re simpler â€” no wrapper components, no prop collision. I still encounter HOCs in older codebases and the connect() HOC from Redux, but for new code I prefer hooks.',
    commonMistakes: [
      'Not setting displayName (hard to debug in React DevTools)',
      'Mutating the original component instead of wrapping',
      'Prop naming collisions',
      'Using HOCs when a custom hook would be simpler'
    ],
    realWorldUse: 'Redux connect(), React Router withRouter(), authentication guards, error boundaries as HOCs. Most are being replaced by hooks in modern code.',
    followUpQuestions: [
      'How do hooks replace HOCs?',
      'What is "wrapper hell"?',
      'What is the difference between HOC and render props?'
    ]
  },
  {
    id: 'react-concurrent-features',
    category: 'react',
    type: 'theory',
    question: 'What are React 18 concurrent features (useTransition, useDeferredValue) and when do you use them?',
    difficulty: 'advanced',
    tags: ['react-18', 'concurrent', 'performance', 'hooks'],
    shortAnswer: 'useTransition marks a state update as non-urgent, keeping the UI responsive. useDeferredValue defers re-rendering a value until the browser is idle. Both prevent input lag during expensive renders.',
    detailedExplanation: 'Concurrent React allows React to interrupt, pause, and resume rendering. useTransition returns [isPending, startTransition] — wrap non-urgent updates in startTransition. useDeferredValue is the receiving end: pass it a value and React will use the old value while preparing the new render. Use useTransition when you control the state setter; useDeferredValue when you receive a prop you can\'t control.',
    example: {
      code: `import { useState, useTransition, useDeferredValue } from 'react';

// useTransition — control the setter
function SearchPage() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    // Input updates immediately (urgent)
    // List filter is deferred (non-urgent)
    startTransition(() => setQuery(e.target.value));
  };

  return (
    <>
      <input onChange={handleChange} />
      {isPending && <Spinner />}
      <ResultList query={query} />
    </>
  );
}

// useDeferredValue — defer a prop/value
function ResultList({ query }) {
  const deferredQuery = useDeferredValue(query);
  // render with deferredQuery — won't block input
}`,
      language: 'javascript'
    },
    interviewAnswer: 'Key distinction: useTransition wraps the setter, useDeferredValue wraps the received value. Both prevent blocking the input while an expensive list re-renders.',
    commonMistakes: ['Using useDeferredValue when you have access to the setter — useTransition is cleaner', 'Expecting concurrent features to speed up slow components — they reduce perceived lag, not actual computation'],
    realWorldUse: 'Search-as-you-type with large result sets, heavy filtering/sorting operations, route transitions.',
    followUpQuestions: ['What is startTransition and how is it different from useTransition?', 'How does Suspense interact with concurrent features?']
  },

  {
    id: 'react-server-components',
    category: 'react',
    type: 'theory',
    question: 'What are React Server Components (RSC) and how do they differ from SSR?',
    difficulty: 'advanced',
    tags: ['rsc', 'next-js', 'server-components', 'performance'],
    shortAnswer: 'RSC run exclusively on the server, never ship their JavaScript to the client, can directly access databases/files, and produce a serialised component tree. SSR runs the same component code on both server (to produce HTML) and client (to hydrate). RSC = zero client JS for those components.',
    detailedExplanation: 'In Next.js App Router, all components are Server Components by default. They cannot use hooks, event handlers, or browser APIs. Client Components are opted-in with "use client". The pattern: Server Components fetch data and pass serialisable props to Client Components. This reduces the client bundle significantly.',
    example: {
      code: `// app/page.tsx — Server Component (default, no "use client")
// Can await, access DB, use fs — zero JS sent to client
async function ProductPage({ params }) {
  const product = await db.products.findById(params.id); // direct DB access
  return (
    <main>
      <h1>{product.name}</h1>
      <ProductPrice price={product.price} /> {/* Server Component */}
      <AddToCartButton productId={product.id} /> {/* Client Component */}
    </main>
  );
}

// components/AddToCartButton.tsx
'use client'; // opt-in to client features
import { useState } from 'react';

export function AddToCartButton({ productId }) {
  const [added, setAdded] = useState(false);
  return <button onClick={() => setAdded(true)}>{added ? 'Added!' : 'Add to Cart'}</button>;
}`,
      language: 'javascript'
    },
    interviewAnswer: 'Three key differences from SSR: (1) zero JS bundle for RSC, (2) can directly access backend resources, (3) not hydrated. Draw the server/client boundary clearly.',
    commonMistakes: ['Using useState or event handlers in a Server Component', 'Passing non-serialisable values (functions, class instances) as props to Client Components', 'Thinking RSC replaces SSR — they are complementary'],
    realWorldUse: 'Next.js App Router, data-heavy pages where most UI is static, large dependency-heavy components (markdown parsers, date libraries).',
    followUpQuestions: ['Can a Server Component import a Client Component?', 'What is the "use server" directive?']
  },

  {
    id: 'react-key-prop',
    category: 'react',
    type: 'theory',
    question: 'Why does React need the key prop in lists and what happens when you use index as key?',
    difficulty: 'beginner',
    tags: ['react', 'reconciliation', 'keys', 'lists'],
    shortAnswer: 'key helps React identify which items changed, were added, or removed during reconciliation. Using array index as key causes bugs when items are reordered or inserted — React reuses the wrong DOM element because the index-to-element mapping changes.',
    detailedExplanation: 'React\'s reconciliation algorithm matches old and new elements by key. Without a stable key, React diffs by position. When you insert an item at the start of a list with index keys, every element\'s key shifts — React re-renders all items and loses local state (e.g. input values) in controlled components.',
    example: {
      code: `// ❌ Index as key — causes bugs when list changes
{items.map((item, i) => <Item key={i} data={item} />)}

// ✅ Stable unique ID as key
{items.map(item => <Item key={item.id} data={item} />)}

// Demonstrate the bug:
// List: [A, B, C] — insert D at start
// Index keys:  D(key=0), A(key=1), B(key=2), C(key=3)
//              ^ React sees key=0 changed from A to D
//                and re-renders everything, losing input state

// Stable ID keys:
// D(key=d), A(key=a), B(key=b), C(key=c)
//           ^ React knows A, B, C are unchanged — only inserts D`,
      language: 'javascript'
    },
    interviewAnswer: 'Demonstrate the insert/reorder bug with index keys. Interviewers will probe whether you know what actually goes wrong (state loss, unnecessary re-renders) not just that you should avoid it.',
    commonMistakes: ['Using Math.random() as key (creates new key every render — worse than index)', 'Thinking key is passed as a prop — it\'s not, the component cannot read props.key'],
    realWorldUse: 'Anywhere you render dynamic lists: todos, search results, drag-and-drop sortable lists.',
    followUpQuestions: ['When is index as key actually acceptable?', 'Does key affect performance even without state?']
  },

  {
    id: 'react-state-batching',
    category: 'react',
    type: 'theory',
    question: 'What is automatic batching in React 18 and how does it differ from React 17?',
    difficulty: 'intermediate',
    tags: ['react-18', 'batching', 'state', 'performance'],
    shortAnswer: 'In React 17, batching only happened inside React event handlers. In React 18, all state updates are automatically batched — including those in setTimeout, Promises, and native event listeners — causing a single re-render per batch.',
    detailedExplanation: 'Batching groups multiple setState calls into one re-render. React 17 batched in synthetic events only, so multiple setState calls in a setTimeout each triggered a separate render. React 18 (with createRoot) batches all state updates everywhere. To opt out of batching, use flushSync().',
    example: {
      code: `// React 17: 2 re-renders (outside event handler)
setTimeout(() => {
  setCount(c => c + 1); // render 1
  setFlag(f => !f);     // render 2
}, 0);

// React 18: 1 re-render (automatic batching)
setTimeout(() => {
  setCount(c => c + 1); // batched
  setFlag(f => !f);     // batched — only 1 render
}, 0);

// Same in Promises:
fetch('/api/data').then(() => {
  setData(d);   // batched
  setLoading(false); // batched — 1 render
});

// Opt out: force immediate render
import { flushSync } from 'react-dom';
flushSync(() => setCount(c => c + 1)); // renders immediately`,
      language: 'javascript'
    },
    interviewAnswer: 'Lead with "React 18 batches everywhere, React 17 only in event handlers." Then mention flushSync as the escape hatch.',
    commonMistakes: ['Not knowing this changed in React 18', 'Thinking flushSync is the same as unstable_batchedUpdates from React 17'],
    realWorldUse: 'Any component with multiple related state updates in async code — reduces wasted renders.',
    followUpQuestions: ['What is flushSync and when would you use it?', 'Does batching affect useEffect execution?']
  },

  {
    id: 'react-use-id',
    category: 'react',
    type: 'theory',
    question: 'What is the useId hook and why is it better than incrementing a counter for accessibility IDs?',
    difficulty: 'intermediate',
    tags: ['react-18', 'hooks', 'accessibility', 'ssr'],
    shortAnswer: 'useId generates a stable, unique ID per component instance that is consistent between server and client renders, preventing SSR hydration mismatches. A counter would produce different IDs if server and client render different component trees.',
    detailedExplanation: 'When you need to link a label to an input (htmlFor/id), or an ARIA attribute to an element, you need a unique ID per instance. Using a module-level counter causes hydration mismatches in SSR because server and client may render in different orders. useId is safe for SSR/Suspense because it derives its value from the component\'s position in the tree — stable across environments.',
    example: {
      code: `import { useId } from 'react';

function FormField({ label }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" />
    </div>
  );
}

// Multiple IDs from one call
function PasswordField() {
  const id = useId();
  return (
    <>
      <label htmlFor={id + '-input'}>Password</label>
      <input id={id + '-input'} aria-describedby={id + '-hint'} type="password" />
      <p id={id + '-hint'}>Must be 8+ characters</p>
    </>
  );
}`,
      language: 'javascript'
    },
    interviewAnswer: 'Frame it as an accessibility + SSR safety tool. The hydration mismatch is the key reason it exists over a manual counter.',
    commonMistakes: ['Using useId for list keys — it\'s for DOM IDs only, not reconciliation keys', 'Not using it for ARIA relationships in component libraries'],
    realWorldUse: 'Form component libraries, design systems, any reusable component that needs DOM IDs.',
    followUpQuestions: ['Can you use useId for multiple IDs in one component?', 'What does an ID generated by useId look like?']
  },

  {
    id: 'react-suspense-data',
    category: 'react',
    type: 'theory',
    question: 'How does Suspense work with data fetching in React, and what is the "suspend" mechanism?',
    difficulty: 'advanced',
    tags: ['react', 'suspense', 'data-fetching', 'concurrent'],
    shortAnswer: 'A component "suspends" by throwing a Promise. React catches it, shows the nearest Suspense fallback, and retries the component when the Promise resolves. Libraries like React Query and Next.js RSC use this mechanism under the hood.',
    detailedExplanation: 'Suspense was introduced for lazy loading (React.lazy) but React 18 opened it for data fetching. A Suspense-compatible data fetching library throws a Promise when data is not yet cached. React walks up the tree to the nearest <Suspense> boundary, renders the fallback, then re-renders the subtree when the Promise settles.',
    example: {
      code: `import { Suspense } from 'react';

// The boundary
<Suspense fallback={<Skeleton />}>
  <UserProfile userId={id} />
</Suspense>

// UserProfile "suspends" when data isn't ready
function UserProfile({ userId }) {
  // React Query v5 with suspense: true or useSuspenseQuery
  const { data } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(\`/api/users/\${userId}\`).then(r => r.json()),
  });
  return <div>{data.name}</div>;
}

// Multiple suspending components waterfall vs parallel
// Waterfall (one waits for the other):
<Suspense fallback={<Spinner />}>
  <UserProfile />   // suspends
  <UserPosts />     // waits for UserProfile
</Suspense>

// Parallel (both start immediately):
<Suspense fallback={<Spinner />}>
  <UserProfile />
</Suspense>
<Suspense fallback={<Spinner />}>
  <UserPosts />
</Suspense>`,
      language: 'javascript'
    },
    interviewAnswer: 'Explain the throw-a-Promise mechanism, nearest boundary fallback, and the waterfall vs parallel pattern for nested Suspense boundaries.',
    commonMistakes: ['Using one Suspense for multiple fetches that could load in parallel — causes waterfall', 'Thinking Suspense is only for React.lazy — it works for data in React 18+'],
    realWorldUse: 'Next.js loading.tsx files, React Query useSuspenseQuery, streaming SSR with selective hydration.',
    followUpQuestions: ['What is ErrorBoundary and how does it pair with Suspense?', 'What is the difference between Suspense and useEffect for data fetching?']
  },

  {
    id: 'react-reconciliation',
    category: 'react',
    type: 'theory',
    question: 'How does React\'s reconciliation algorithm (diffing) work?',
    difficulty: 'advanced',
    tags: ['react', 'reconciliation', 'virtual-dom', 'performance'],
    shortAnswer: 'React diffs the old and new virtual DOM trees with two heuristics: (1) elements of different types produce completely new trees, (2) elements with the same key are matched as the same instance. This reduces O(n³) tree diffing to O(n).',
    detailedExplanation: 'Rules: if element type changes (div→span), React destroys the old subtree and creates a new one — even if children are identical. Same type: React updates attributes in place. For lists, React matches by key. Without key, it diffs by position which causes issues on reorder. Fiber is React\'s internal representation of the component tree, allowing incremental rendering.',
    example: {
      code: `// Rule 1: Different element type = full destroy + recreate
// Before: <div><Counter /></div>
// After:  <span><Counter /></span>
// → Counter state is LOST (div→span triggers full remount)

// Rule 2: Same type = update in place (state preserved)
// Before: <div className="a"><Counter /></div>
// After:  <div className="b"><Counter /></div>
// → Counter state PRESERVED (just className updated)

// Rule 3: Keys in lists
// Before: [A(key=a), B(key=b), C(key=c)]
// After:  [B(key=b), A(key=a), C(key=c)]
// → React moves B and A — doesn't recreate them

// Forcing remount with key (useful trick)
// Changing the key forces a fresh instance:
<Input key={userId} defaultValue={user.email} />`,
      language: 'javascript'
    },
    interviewAnswer: 'The two heuristics + O(n) claim. Bonus: mention that changing an element\'s key is the idiomatic way to force a remount (useful for resetting form state).',
    commonMistakes: ['Thinking React always diffs the full DOM — it diffs the virtual DOM first', 'Not knowing that wrapping in a different parent type resets child state'],
    realWorldUse: 'Understanding why components re-mount unexpectedly, optimising lists, resetting component state on route change.',
    followUpQuestions: ['What is React Fiber?', 'How does the key trick help with resetting form state?']
  },

  {
    id: 'react-compound-components',
    category: 'react',
    type: 'theory',
    question: 'What is the compound component pattern in React?',
    difficulty: 'advanced',
    tags: ['react', 'patterns', 'context', 'design-patterns'],
    shortAnswer: 'Compound components expose a set of related sub-components that share implicit state via React Context. The parent component manages state; children access it without explicit prop-passing. Think <Select> + <Option> or <Tabs> + <Tab> + <TabPanel>.',
    detailedExplanation: 'The pattern separates the logic (parent with state) from the structure (consumers arrange children as they like). It avoids render-prop complexity and prop-drilling. Implemented with React.createContext — the parent provides state, sub-components consume it.',
    example: {
      code: `const TabsContext = React.createContext(null);

// Parent manages state, provides context
function Tabs({ children }) {
  const [active, setActive] = useState(0);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

// Sub-components consume context
function Tab({ index, children }) {
  const { active, setActive } = useContext(TabsContext);
  return (
    <button
      onClick={() => setActive(index)}
      style={{ fontWeight: active === index ? 'bold' : 'normal' }}
    >
      {children}
    </button>
  );
}

function TabPanel({ index, children }) {
  const { active } = useContext(TabsContext);
  return active === index ? <div>{children}</div> : null;
}

// Usage — consumer controls structure
<Tabs>
  <Tab index={0}>Profile</Tab>
  <Tab index={1}>Settings</Tab>
  <TabPanel index={0}><Profile /></TabPanel>
  <TabPanel index={1}><Settings /></TabPanel>
</Tabs>`,
      language: 'javascript'
    },
    interviewAnswer: 'Describe the parent-as-state-owner + children-as-consumers pattern. Mention that Context is the implementation mechanism and it avoids prop drilling in complex UI components.',
    commonMistakes: ['Exporting context directly instead of encapsulating it', 'Making sub-components work without the parent — they should throw if used outside context'],
    realWorldUse: 'Design systems (tabs, accordions, menus, select dropdowns), Radix UI, Headless UI all use this pattern.',
    followUpQuestions: ['How does this compare to the render props pattern?', 'How do you prevent consumers from using sub-components outside the parent?']
  },

  {
    id: 'react-strict-mode',
    category: 'react',
    type: 'theory',
    question: 'What does React.StrictMode do and why does it double-invoke functions in development?',
    difficulty: 'intermediate',
    tags: ['react', 'strict-mode', 'debugging', 'best-practices'],
    shortAnswer: 'StrictMode activates additional checks in development: it double-invokes render functions, state initialisers, and useEffect setup/cleanup to help detect side effects in "pure" code. It has zero production impact.',
    detailedExplanation: 'React 18 StrictMode intentionally mounts components twice (mount → unmount → remount) in development to detect components with non-idempotent effects. If your component behaves differently on the second mount, it has an impure render or effect. It also warns about deprecated APIs and unexpected side effects in pure zones.',
    example: {
      code: `// StrictMode wraps the entire app (or a subtree)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// In dev, this effect runs TWICE:
useEffect(() => {
  const sub = websocket.subscribe(channel); // called twice in dev
  return () => sub.unsubscribe();           // cleanup must work correctly
}, [channel]);

// The double-invoke reveals this bug:
let id = 0;
function Counter() {
  id++; // mutates module variable — different on re-render!
  return <div>Count: {id}</div>;
}`,
      language: 'javascript'
    },
    interviewAnswer: 'Explain the double-invoke behavior and WHY it helps: impure renders produce different output on the second call, making bugs visible. Emphasise it is dev-only.',
    commonMistakes: ['Thinking StrictMode causes a bug — it reveals an existing one', 'Disabling StrictMode to silence the double-render instead of fixing the underlying issue'],
    realWorldUse: 'Catching impure renders, detecting legacy lifecycle usage, validating cleanup functions.',
    followUpQuestions: ['Should you disable StrictMode in production? (No — it has no effect)', 'What is the difference between StrictMode in React 17 vs 18?']
  },

  {
    id: 'react-testing-library',
    category: 'react',
    type: 'theory',
    question: 'How do you test React components with React Testing Library?',
    difficulty: 'intermediate',
    tags: ['testing', 'react-testing-library', 'jest', 'accessibility'],
    shortAnswer: 'React Testing Library tests components from the user\'s perspective — find elements by role/text/label, fire events, and assert on what the user sees. It discourages testing implementation details.',
    detailedExplanation: 'RTL philosophy: "The more your tests resemble the way your software is used, the more confidence they give you." Query priority: getByRole > getByLabelText > getByPlaceholderText > getByText > getByTestId. Use userEvent over fireEvent for realistic interactions. Async: waitFor, findBy* for async elements. Avoid testing state or props directly — test what renders.',
    example: {
      code: `import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Component to test
function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Invalid email');
      return;
    }
    await onLogin(email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input id="email" value={email} onChange={e => setEmail(e.target.value)} />
      {error && <p role="alert">{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}

// Tests
describe('LoginForm', () => {
  it('shows error for invalid email', async () => {
    const user = userEvent.setup();
    render(<LoginForm onLogin={jest.fn()} />);

    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
  });

  it('calls onLogin with email on valid submit', async () => {
    const user = userEvent.setup();
    const mockLogin = jest.fn().mockResolvedValue(undefined);
    render(<LoginForm onLogin={mockLogin} />);

    await user.type(screen.getByLabelText('Email'), 'alex@example.com');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('alex@example.com');
    });
  });

  it('renders loading state', async () => {
    render(<LoginForm onLogin={jest.fn()} />);
    // Query by role - screen reader accessible
    expect(screen.getByRole('button', { name: 'Login' })).toBeEnabled();
  });
});`,
      language: 'javascript',
    },
    interviewAnswer: 'RTL pushes me to write tests that check what users see and do, not internal state. I query by role first — getByRole(\'button\', {name: \'Submit\'}) — because it also validates accessibility. For async operations I use waitFor or findBy* queries. I mock API calls at the fetch/axios level, not the component. The key insight: if you have to reach into component internals to test it, the test will break when you refactor even if the behaviour is the same.',
    commonMistakes: [
      'Using getByTestId everywhere instead of semantic queries',
      'Using fireEvent instead of userEvent (not realistic)',
      'Testing implementation details like state values',
    ],
    realWorldUse: 'Unit and integration tests for all React components. Pairs with Jest. MSW (Mock Service Worker) for API mocking.',
    followUpQuestions: ['What is the difference between getBy, queryBy, and findBy?', 'How do you test a component that makes API calls?'],
  },

  {
    id: 'react-typescript',
    category: 'react',
    type: 'theory',
    question: 'How do you use TypeScript with React? Common patterns and pitfalls.',
    difficulty: 'intermediate',
    tags: ['typescript', 'react', 'types', 'generics'],
    shortAnswer: 'Type props with interfaces or type aliases, use React.FC sparingly (prefer explicit return types), type events with React.ChangeEvent/MouseEvent, use generics for reusable components, type context with createContext<T>.',
    detailedExplanation: 'TypeScript in React: Props typed with interface (preferred for extension) or type. Events typed as React.ChangeEvent<HTMLInputElement>, React.FormEvent, React.MouseEvent. Refs typed as useRef<HTMLInputElement>(null). Context typed as createContext<T | null>(null). Generic components for reusable lists/tables. Discriminated unions for component variants. PropsWithChildren when needed. Avoid React.FC — it adds implicit children and doesn\'t infer generic props well.',
    example: {
      code: `// Props interface
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  children?: React.ReactNode;
}

// Explicit return type preferred over React.FC
function Button({ label, onClick, variant = 'primary', disabled }: ButtonProps): JSX.Element {
  return (
    <button onClick={onClick} disabled={disabled} className={\`btn-\${variant}\`}>
      {label}
    </button>
  );
}

// Event types
function SearchInput() {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={value} onChange={handleChange} />
    </form>
  );
}

// Generic component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage
<List
  items={users}
  keyExtractor={u => u.id}
  renderItem={u => <span>{u.name}</span>}
/>

// Typed context
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

// Discriminated union props
type AlertProps =
  | { variant: 'error'; message: string; onRetry: () => void }
  | { variant: 'success'; message: string };

function Alert(props: AlertProps) {
  return (
    <div>
      {props.message}
      {props.variant === 'error' && <button onClick={props.onRetry}>Retry</button>}
    </div>
  );
}`,
      language: 'typescript',
    },
    interviewAnswer: 'TypeScript makes React code significantly safer. I type event handlers explicitly — React.ChangeEvent<HTMLInputElement> catches typos. Generic components avoid duplicating the same list/table component for different data types. Discriminated unions are great for component variants — TypeScript narrows the type in each branch. I avoid React.FC because it doesn\'t work well with generics and adds implicit children that you often don\'t want.',
    commonMistakes: [
      'Using any to silence TypeScript errors',
      'Using React.FC instead of explicit return types',
      'Not typing context — createContext<T>() with null check hook',
    ],
    realWorldUse: 'All modern React projects. TypeScript is now the default in Create React App, Vite, and Next.js templates.',
    followUpQuestions: ['What is the difference between interface and type in TypeScript?', 'How do you type a ref in TypeScript?'],
  },

  {
    id: 'react-render-props',
    category: 'react',
    type: 'theory',
    question: 'What is the render props pattern and when would you still use it?',
    difficulty: 'intermediate',
    tags: ['render-props', 'patterns', 'reusability'],
    shortAnswer: 'Render props pass a function as a prop that a component calls to render its output. The component provides data/logic; the caller controls rendering. Largely replaced by custom hooks but still useful for component-level rendering control.',
    detailedExplanation: 'Render props share stateful logic between components via a prop that is a function. The component calls this function with its internal state/data, letting the consumer decide what to render. This avoids the wrapper hell of HOCs. Custom hooks have largely replaced render props for logic sharing, but render props still shine when you need to inject JSX structure — like react-window, react-beautiful-dnd, and Downshift.',
    example: {
      code: `// Render props pattern
interface MousePosition {
  x: number;
  y: number;
}

interface MouseTrackerProps {
  render: (position: MousePosition) => React.ReactNode;
  // Alternative: children as function
  children?: (position: MousePosition) => React.ReactNode;
}

function MouseTracker({ render, children }: MouseTrackerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const renderFn = render || children;
  return (
    <div onMouseMove={handleMouseMove} style={{ height: '100vh' }}>
      {renderFn?.(position)}
    </div>
  );
}

// Usage — consumer controls rendering
<MouseTracker render={({ x, y }) => (
  <p>Mouse: {x}, {y}</p>
)} />

// Children as function (common pattern)
<MouseTracker>
  {({ x, y }) => <Cursor style={{ left: x, top: y }} />}
</MouseTracker>

// Modern equivalent with custom hook
function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);
  return position;
}

// Much simpler usage
function Cursor() {
  const { x, y } = useMousePosition();
  return <div style={{ left: x, top: y }} />;
}

// Render props still useful: react-window
<FixedSizeList itemCount={1000} itemSize={50} height={600} width="100%">
  {({ index, style }) => (
    <div style={style}>{items[index].name}</div>
  )}
</FixedSizeList>`,
      language: 'tsx',
    },
    interviewAnswer: 'Render props were the pre-hooks solution for sharing logic. Custom hooks replaced most render prop use cases with simpler code — useMousePosition() is cleaner than <MouseTracker render={...}>. But render props still make sense when the library needs control over the rendering structure itself, like virtual scroll libraries where the library manages which rows exist in the DOM.',
    commonMistakes: [
      'Using render props when a custom hook would be simpler',
      'Performance issues — inline render prop creates new function every render',
    ],
    realWorldUse: 'react-window, Downshift, react-beautiful-dnd, Formik\'s <Field render> prop.',
    followUpQuestions: ['How do you prevent performance issues with render props?', 'When would you choose render props over a custom hook?'],
  },

  {
    id: 'react-context-performance',
    category: 'react',
    type: 'theory',
    question: 'How do you optimise React Context to prevent unnecessary re-renders?',
    difficulty: 'advanced',
    tags: ['context', 'performance', 'optimization', 're-renders'],
    shortAnswer: 'Every context consumer re-renders when context value changes. Split contexts by update frequency, memoize context values with useMemo, and split state from dispatch into separate contexts.',
    detailedExplanation: 'The problem: if you put all state in one context, every consumer re-renders on every change. Solutions: 1) Split context — put data and setter in separate contexts. 2) Memoize value with useMemo so reference only changes when data changes. 3) Split into multiple focused contexts. 4) Use a selector pattern with useSyncExternalStore. 5) Libraries like Zustand or Jotai handle this automatically.',
    example: {
      code: `// ❌ Single context — everything re-renders on any change
const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [cart, setCart] = useState([]);

  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme, cart, setCart }}>
      {children}
    </AppContext.Provider>
  );
}
// Every consumer re-renders when cart changes, even if they only need theme

// ✅ Split contexts by concern
const UserContext = createContext();
const ThemeContext = createContext();
const CartContext = createContext();

// ✅ Memoize context value
function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const value = useMemo(
    () => ({ user, setUser }),
    [user] // Only new reference when user changes
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// ✅ Split state and dispatch (common Redux-like pattern)
const CartStateContext = createContext();
const CartDispatchContext = createContext();

function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={cart}>
        {children}
      </CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
}

// Components that only dispatch don't re-render on state changes
function AddToCartButton({ item }) {
  const dispatch = useContext(CartDispatchContext); // Never re-renders from cart changes
  return <button onClick={() => dispatch({ type: 'ADD', item })}>Add</button>;
}

// ✅ useSyncExternalStore for external stores with selectors
function useUserName() {
  return useSyncExternalStore(
    store.subscribe,
    () => store.getState().user.name,
    () => null
  );
}`,
      language: 'jsx',
    },
    interviewAnswer: 'The most impactful optimization is splitting state from dispatch — components that only trigger actions don\'t need to re-render when state changes. For data contexts, I memoize the value object so consumers only re-render when the actual data changes, not on every parent render. If context performance is critical, I reach for Zustand — it has built-in selector support so components only re-render when the specific slice they use changes.',
    commonMistakes: [
      'Creating new object inline: <Ctx.Provider value={{ user, setUser }}> without useMemo',
      'Putting too much in one context',
      'Not knowing that all consumers re-render on ANY context change',
    ],
    realWorldUse: 'Auth context, theme context, shopping cart, any global state that many components consume.',
    followUpQuestions: ['How does Zustand avoid the context re-render problem?', 'What is useSyncExternalStore?'],
  },

  {
    id: 'react-zustand-state',
    category: 'react',
    type: 'theory',
    question: 'What is Zustand and when should you use it over Context + useReducer?',
    difficulty: 'intermediate',
    tags: ['zustand', 'state-management', 'context', 'performance'],
    shortAnswer: 'Zustand is a lightweight state management library. Advantages over Context: selector-based subscriptions (only re-render when subscribed slice changes), no Provider wrapping, access state outside components, simpler code.',
    detailedExplanation: 'Context + useReducer is React\'s built-in solution but has limitations: no selectors (all consumers re-render on any change), requires Provider wrapping, harder to access from utilities outside React. Zustand uses a Flux-like pattern with a single store but lets components subscribe to specific slices via selectors. Devtools integration, middleware (immer, persist, devtools). Redux Toolkit is more powerful but heavier — Zustand hits the sweet spot for medium complexity apps.',
    example: {
      code: `import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Define store with TypeScript
interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        total: 0,

        addItem: (item) => set((state) => ({
          items: [...state.items, item],
          total: state.total + item.price,
        }), false, 'addItem'), // action name for devtools

        removeItem: (id) => set((state) => {
          const item = state.items.find(i => i.id === id);
          return {
            items: state.items.filter(i => i.id !== id),
            total: state.total - (item?.price ?? 0),
          };
        }),

        clearCart: () => set({ items: [], total: 0 }),
      }),
      { name: 'cart-storage' } // Persists to localStorage
    )
  )
);

// Use in components — selector prevents re-renders from other changes
function CartIcon() {
  const itemCount = useCartStore(state => state.items.length);
  // Only re-renders when item count changes, not on price updates etc.
  return <span>{itemCount}</span>;
}

function CartTotal() {
  const total = useCartStore(state => state.total);
  return <span>\${total.toFixed(2)}</span>;
}

// Access outside React (in utils, API handlers)
const { addItem } = useCartStore.getState();
addItem(newItem);

// Compare: same thing with Context
// Requires: CartContext, CartProvider wrapper, every consumer re-renders on any change`,
      language: 'typescript',
    },
    interviewAnswer: 'I choose Zustand when Context performance becomes an issue or when I need to access state outside React components. The selector pattern is the killer feature — CartIcon only re-renders when item count changes, not when prices update. The code is also simpler — no Provider, no useReducer boilerplate. For very complex apps with lots of derived state and side effects, Redux Toolkit is more structured. For simple local state, Context is fine.',
    commonMistakes: [
      'Not using selectors — subscribing to the whole store defeats the purpose',
      'Using Zustand for everything when local useState would be simpler',
    ],
    realWorldUse: 'E-commerce cart, auth state, UI state that spans many components (modals, toasts, sidebars).',
    followUpQuestions: ['How does Zustand compare to Redux?', 'What is Jotai and how does it differ from Zustand?'],
  },

  {
    id: 'react-fiber',
    category: 'react',
    type: 'theory',
    question: 'What is React Fiber and how does it enable concurrent rendering?',
    difficulty: 'advanced',
    tags: ['fiber', 'concurrent-mode', 'rendering', 'internals'],
    shortAnswer: 'React Fiber is the reimplemented reconciliation engine (React 16+). It represents work as a linked list of fiber nodes that can be paused, resumed, and prioritised. This enables concurrent rendering — React can interrupt low-priority renders for urgent updates.',
    detailedExplanation: 'Before Fiber, reconciliation was recursive and synchronous — once started, it couldn\'t be interrupted, causing UI jank for large trees. Fiber represents each component as a work unit (fiber node) in a linked list. Rendering is split into two phases: render phase (interruptible — build work-in-progress tree) and commit phase (synchronous — apply DOM changes). Priority lanes assign urgency. useTransition and useDeferredValue use this to keep UI responsive during heavy updates.',
    example: {
      code: `// Fiber enables this — marking expensive updates as non-urgent
import { useTransition, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    // Immediate: update the input (urgent)
    setQuery(e.target.value);
  };

  const handleSearch = (value) => {
    // Non-urgent: React can interrupt this to handle user input
    startTransition(() => {
      performExpensiveSearch(value);
    });
  };

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <SearchResults query={query} />
    </>
  );
}

// useDeferredValue — defer rendering of slow component
function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  // Uses old query while new results load
  // Shows stale content instead of blocking

  return <Results query={deferredQuery} />;
}

// Fiber phases (conceptual):
// 1. Render phase (can be interrupted):
//    - Build work-in-progress fiber tree
//    - Determine what changed (diffing)
//    - Mark nodes with effects
//
// 2. Commit phase (synchronous, can't interrupt):
//    - Apply DOM mutations
//    - Run useLayoutEffect
//    - Run useEffect

// Priority lanes (React internal):
// SyncLane (highest)     - discrete user events (click, keydown)
// InputContinuousLane   - continuous events (scroll, mousemove)
// DefaultLane           - normal updates
// TransitionLane        - startTransition updates (lowest)`,
      language: 'javascript',
    },
    interviewAnswer: 'Fiber is why React 18 concurrent features work. The old recursive renderer couldn\'t be interrupted — if you had a slow render, the browser couldn\'t respond to clicks. Fiber breaks rendering into small units of work that can be paused. React prioritises urgent work (user typing) over non-urgent work (showing search results). As a developer, I interact with this through useTransition — I mark state updates as "non-urgent" and React keeps the UI responsive.',
    commonMistakes: [
      'Thinking Fiber is only about performance — it enables entirely new rendering patterns',
      'Using startTransition for all state updates (only for genuinely non-urgent ones)',
    ],
    realWorldUse: 'Concurrent rendering in React 18, startTransition for search/filtering, Suspense for data fetching.',
    followUpQuestions: ['What is the difference between the render phase and commit phase?', 'What are React\'s priority lanes?'],
  },

  {
    id: 'react-devtools-profiling',
    category: 'react',
    type: 'theory',
    question: 'How do you debug and profile React applications with React DevTools?',
    difficulty: 'intermediate',
    tags: ['devtools', 'profiling', 'debugging', 'performance'],
    shortAnswer: 'React DevTools has two main tabs: Components (inspect tree, props, state, hooks) and Profiler (record renders, find slow components, see why components re-rendered). Use the Profiler to identify unnecessary re-renders and measure impact of optimisations.',
    detailedExplanation: 'Components tab: inspect component tree, view/edit props and state in real-time, find which context a component consumes, highlight updates. Profiler tab: record a session, see flame chart of every render, identify components that rendered when they shouldn\'t, see "why did this component render?" for each commit. Programmatic profiling with <Profiler> component for production metrics.',
    example: {
      code: `// Programmatic Profiler component
import { Profiler } from 'react';

function onRenderCallback(
  id,           // Component name
  phase,        // "mount" or "update"
  actualDuration,  // Time for this render
  baseDuration,    // Estimated time without memoization
  startTime,
  commitTime
) {
  // Send to analytics
  if (actualDuration > 16) { // Slower than 60fps
    analytics.track('slow_render', {
      component: id,
      phase,
      duration: actualDuration,
    });
  }
}

<Profiler id="Navigation" onRender={onRenderCallback}>
  <Navigation />
</Profiler>

// DevTools — why did this component render?
// React DevTools shows the reason in Profiler:
// - "Props changed: [title]"
// - "Hooks changed: useState"
// - "Parent component rendered"

// Common findings from Profiler:
// 1. Component renders on every parent render
//    Fix: React.memo() if props are stable

// 2. Context consumer re-renders too often
//    Fix: Split contexts, memoize value

// 3. Expensive component with stable props
//    Fix: memo + useCallback for handler props

// 4. Cascading re-renders from one state change
//    Fix: Move state closer to where it's used

// Debugging hooks in DevTools
// Components tab shows each hook's current value:
// State: [0, setCount]
// Effect: <effect>
// Callback: ƒ handleClick
// Memo: "computed value"
// Ref: { current: <div> }

// Display name for better debugging
const MyComponent = React.memo(function MyComponent(props) {
  // DevTools shows "MyComponent" not "Anonymous"
  return <div>{props.value}</div>;
});`,
      language: 'jsx',
    },
    interviewAnswer: 'I use the Profiler tab to find which components re-render unnecessarily. I record a session while doing the problematic interaction, then look for components that rendered when they shouldn\'t have — DevTools tells me "why did this component render?" right in the UI. The flame chart shows render time by component. I always profile before adding memo or useCallback — often the component isn\'t actually slow and optimisation would add complexity for no benefit.',
    commonMistakes: [
      'Adding memo/useCallback before profiling (premature optimisation)',
      'Not installing React DevTools browser extension',
      'Using the Profiler in development build only — production numbers differ',
    ],
    realWorldUse: 'Diagnosing slow interactions, finding unnecessary re-renders, measuring the impact of memoization.',
    followUpQuestions: ['What is the difference between actualDuration and baseDuration in the Profiler?', 'How do you enable the Profiler in a production build?'],
  },

  {
    id: 'react-react19-features',
    category: 'react',
    type: 'theory',
    question: 'What are the key new features in React 19?',
    difficulty: 'advanced',
    tags: ['react-19', 'actions', 'use-hook', 'form-actions'],
    shortAnswer: 'React 19 introduces: Actions (async transitions with pending/error states), the use() hook (read promises/context in render), form Actions (native form handling without event.preventDefault), ref as prop, improved error handling, and Server Actions.',
    detailedExplanation: 'Actions replace the common pattern of managing isPending/isError state manually for async operations. use() can unwrap a Promise directly in render (with Suspense) or read context. Form Actions connect HTML forms to async functions natively. useOptimistic handles optimistic UI updates. useFormStatus gives form components access to the parent form\'s pending state without prop drilling.',
    example: {
      code: `// React 19: Actions — async transitions with built-in pending/error
import { useActionState, useOptimistic } from 'react';

// useActionState replaces manual isPending + error state
function UpdateNameForm() {
  const [state, formAction, isPending] = useActionState(
    async (previousState, formData) => {
      const name = formData.get('name');
      try {
        await updateUser({ name });
        return { success: true, name };
      } catch (err) {
        return { error: err.message };
      }
    },
    { success: false } // initial state
  );

  return (
    <form action={formAction}>
      <input name="name" />
      <button disabled={isPending}>
        {isPending ? 'Saving...' : 'Save'}
      </button>
      {state.error && <p>{state.error}</p>}
      {state.success && <p>Saved!</p>}
    </form>
  );
}

// use() hook — read promise in render
function UserProfile({ userPromise }) {
  const user = use(userPromise); // Suspends until resolved
  return <h1>{user.name}</h1>;
}

<Suspense fallback={<Spinner />}>
  <UserProfile userPromise={fetchUser(id)} />
</Suspense>

// use() for context (can be called conditionally!)
function ThemedButton() {
  if (someCondition) {
    const theme = use(ThemeContext); // OK in React 19!
  }
}

// useOptimistic — instant UI update, rollback on error
function LikeButton({ postId, initialLikes }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(initialLikes);

  async function handleLike() {
    addOptimisticLike(prev => prev + 1); // Immediately show +1
    await likePost(postId); // Actual API call
    // Automatically rolled back on error
  }

  return <button onClick={handleLike}>{optimisticLikes} ❤️</button>;
}

// ref as prop — no more forwardRef needed!
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}`,
      language: 'jsx',
    },
    interviewAnswer: 'React 19\'s biggest change is Actions — it replaces the repetitive pattern of const [isPending, startTransition] + manual error/success state. Now one useActionState call handles the full async lifecycle. The use() hook is also significant — it lets you read a Promise or context directly in render with Suspense handling the loading state. Server Actions (from Next.js, now stable in React) let you call server functions from client components like regular async functions.',
    commonMistakes: [
      'Confusing useActionState with the old useFormState (renamed in React 19)',
      'Using use() on a new Promise created in render — always pass a stable promise reference',
    ],
    realWorldUse: 'Form submissions, optimistic updates, server actions in Next.js 15+.',
    followUpQuestions: ['What is the difference between useActionState and useFormState?', 'What are Server Actions?'],
  },

  {
    id: 'react-code-review-patterns',
    category: 'react',
    type: 'theory',
    question: 'What React anti-patterns should you look for in code reviews?',
    difficulty: 'intermediate',
    tags: ['anti-patterns', 'code-review', 'best-practices', 'bugs'],
    shortAnswer: 'Key anti-patterns: mutating state directly, missing dependency arrays, useEffect for derived state, prop drilling over 2-3 levels, index as list key, async state updates without cleanup, effects that could be event handlers.',
    detailedExplanation: 'Common React bugs found in code review: direct state mutation (breaks change detection), missing useEffect dependencies (stale closures), using useEffect to sync state that could be derived, over-engineered with unnecessary state, setState after unmount, creating new references in render breaking memo, effects for things that should be event handlers.',
    example: {
      code: `// ❌ Direct state mutation
const [user, setUser] = useState({ name: 'Alex', hobbies: [] });
user.name = 'Sam'; // Direct mutation — no re-render!
user.hobbies.push('coding'); // Direct mutation!

// ✅ Immutable update
setUser(prev => ({ ...prev, name: 'Sam' }));
setUser(prev => ({ ...prev, hobbies: [...prev.hobbies, 'coding'] }));

// ❌ useEffect for derived state
const [filtered, setFiltered] = useState([]);
useEffect(() => {
  setFiltered(items.filter(i => i.active)); // Double render!
}, [items]);

// ✅ Derived state — compute during render
const filtered = items.filter(i => i.active); // Or useMemo for expensive

// ❌ Missing dependencies — stale closure bug
const [count, setCount] = useState(0);
useEffect(() => {
  const interval = setInterval(() => {
    console.log(count); // Always logs 0! Stale closure
  }, 1000);
  return () => clearInterval(interval);
}, []); // Missing count dependency

// ✅ Functional update avoids stale closure
useEffect(() => {
  const interval = setInterval(() => {
    setCount(c => c + 1); // Reads current value
  }, 1000);
  return () => clearInterval(interval);
}, []);

// ❌ Effect for something that should be event handler
useEffect(() => {
  if (submitted) {
    navigate('/success'); // Should be in handleSubmit
  }
}, [submitted]);

// ✅ In the event handler
const handleSubmit = async () => {
  await submitForm();
  navigate('/success');
};

// ❌ New object reference breaks memo
function Parent() {
  return <ExpensiveChild config={{ theme: 'dark' }} />; // New object every render
}

// ✅ Stable reference
const config = useMemo(() => ({ theme: 'dark' }), []);
return <ExpensiveChild config={config} />;`,
      language: 'jsx',
    },
    interviewAnswer: 'In code reviews I look for: state mutations (spread instead of mutate), useEffect for derived state (delete and compute directly), missing or wrong dependencies in useEffect, and new reference creation in render that breaks memoization. The useEffect-for-derived-state anti-pattern causes double renders and is really common — if you can compute something from existing state, just do it during render.',
    commonMistakes: [
      'All of the above patterns — they\'re common even for experienced developers',
      'Over-memoizing everything after reading performance articles',
    ],
    realWorldUse: 'Every React codebase. ESLint\'s react-hooks/exhaustive-deps rule catches many of these automatically.',
    followUpQuestions: ['What ESLint rules help catch React anti-patterns?', 'When is it OK to omit a dependency from useEffect?'],
  },

  {
    id: 'react-nextjs-patterns',
    category: 'react',
    type: 'theory',
    question: 'What is the App Router in Next.js and how does it differ from the Pages Router?',
    difficulty: 'intermediate',
    tags: ['nextjs', 'app-router', 'server-components', 'routing'],
    shortAnswer: 'App Router (Next.js 13+) uses React Server Components by default, nested layouts, server-side data fetching in components, and streaming. Pages Router uses getServerSideProps/getStaticProps and all components are client components.',
    detailedExplanation: 'App Router is built on React Server Components. Files are co-located: page.tsx (route), layout.tsx (shared UI), loading.tsx (Suspense fallback), error.tsx (Error Boundary), not-found.tsx. Data fetching happens in async Server Components — no need for getServerSideProps. Client components use "use client" directive. Route handlers replace API routes for simple endpoints. Parallel routes and intercepting routes for advanced UI patterns.',
    example: {
      code: `// App Router file structure
// app/
//   layout.tsx          — Root layout (always server component)
//   page.tsx            — Home route /
//   loading.tsx         — Suspense fallback for page
//   error.tsx           — Error boundary for route
//   not-found.tsx       — 404 for this route
//   blog/
//     layout.tsx        — Nested layout for /blog/*
//     page.tsx          — /blog
//     [slug]/
//       page.tsx        — /blog/:slug

// app/blog/[slug]/page.tsx — Server Component (default)
async function BlogPost({ params }: { params: { slug: string } }) {
  // Direct async data fetching — no getServerSideProps
  const post = await prisma.post.findUnique({
    where: { slug: params.slug }
  });

  if (!post) notFound(); // Triggers not-found.tsx

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <LikeButton postId={post.id} /> {/* Client component */}
    </article>
  );
}

// Generate static paths
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({ select: { slug: true } });
  return posts.map(p => ({ slug: p.slug }));
}

// Metadata
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return { title: post.title, description: post.excerpt };
}

// app/blog/[slug]/LikeButton.tsx — must be client component
'use client';
import { useState } from 'react';

export function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(true)}>❤️</button>;
}

// app/layout.tsx — Root layout
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}`,
      language: 'typescript',
    },
    interviewAnswer: 'App Router is a paradigm shift. Server Components run only on the server — they can directly query the database, reducing client bundle size. The file-based conventions (loading.tsx for Suspense, error.tsx for boundaries) make routing patterns declarative. The biggest mental shift: decide per component whether it needs interactivity (client) or just renders data (server). I start every component as a server component and add "use client" only when I need hooks or browser APIs.',
    commonMistakes: [
      'Using "use client" on every component (defeats the purpose)',
      'Trying to use useState in a server component',
      'Passing non-serializable props from server to client components',
    ],
    realWorldUse: 'Next.js 13+ App Router is now the recommended way to build React apps. Used for e-commerce, dashboards, blogs.',
    followUpQuestions: ['What can\'t you do in a Server Component?', 'What is a Server Action?'],
  },
];
