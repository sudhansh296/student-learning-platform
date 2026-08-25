import type { ReactLesson } from '../react-curriculum';

export const reactContextAdvancedLesson: ReactLesson = {
  id: 'react-context-advanced',
  title: 'Advanced State Patterns',
  slug: 'context-advanced',
  chapter: 'advanced',
  order: 17,
  difficulty: 'advanced',
  readingTime: 16,
  description: 'Level up your state management with useReducer for complex state transitions. Learn the dispatch/action pattern, combine useReducer with Context, and know when to choose useReducer over useState.',
  sections: [
    {
      type: 'text',
      content: 'useState is great for simple values. But when state has multiple sub-values that change together, or when the next state depends on complex logic, useReducer provides a cleaner pattern. It centralizes all state update logic in one place called a reducer function.',
    },
    {
      type: 'analogy',
      title: 'useReducer is like a bank account',
      content: 'With useState you directly set the balance. With useReducer you submit transactions (actions) - deposit, withdraw, transfer. The reducer function processes each transaction and returns the new balance. The UI never directly manipulates state - it dispatches actions.',
    },
    {
      type: 'heading',
      content: '1. useReducer - The Basics',
    },
    {
      type: 'example',
      title: 'useReducer syntax and the reducer pattern',
      content: 'useReducer takes a reducer function and initial state, returns the current state and a dispatch function. The reducer receives the current state and an action object, and returns the new state. Actions typically have a type string and optional payload.',
      language: 'jsx',
      code: `// (React hooks available as React.useState, React.useEffect, etc.)

// Reducer - pure function, takes state + action, returns new state
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    case 'SET':
      return { count: action.payload };
    default:
      return state;  // always return state for unknown actions
  }
}

const initialState = { count: 0 };

function Counter() {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>

      {/* dispatch sends an action to the reducer */}
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-1</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'SET', payload: 100 })}>Set 100</button>
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '2. Complex State with useReducer',
    },
    {
      type: 'example',
      title: 'Managing a shopping cart with useReducer',
      content: 'Shopping cart logic is a perfect use case - multiple related state values (items, total, count) that update together based on actions. The reducer keeps all logic in one place, making it testable and easy to reason about.',
      language: 'jsx',
      code: `// (React hooks available as React.useState, React.useEffect, etc.)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.item.id);
      if (existing) {
        // Increase quantity if item already in cart
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
}

function Cart() {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] });

  const total = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div>
      <button onClick={() => dispatch({
        type: 'ADD_ITEM',
        item: { id: 1, name: 'React Course', price: 49 }
      })}>
        Add React Course
      </button>
      
      <ul>
        {cart.items.map(item => (
          <li key={item.id}>
            {item.name} × {item.qty} = {item.price * item.qty}
            <button onClick={() => dispatch({ type: 'REMOVE_ITEM', id: item.id })}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      
      <p>Total: {total}</p>
      <button onClick={() => dispatch({ type: 'CLEAR_CART' })}>Clear</button>
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '3. Combining useReducer with Context',
    },
    {
      type: 'example',
      title: 'Global state with useReducer + Context',
      content: 'The most powerful pattern: useReducer manages complex state, Context distributes it globally. This is essentially how Redux works - but built into React. Share both state and dispatch through Context so any component can read or update the global state.',
      language: 'jsx',
      code: `// (React hooks available as React.useState, React.useEffect, etc.)

// 1. Create contexts
const StateContext    = createContext(null);
const DispatchContext = createContext(null);

// 2. Reducer
function appReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.user, isLoggedIn: true };
    case 'LOGOUT':
      return { ...state, user: null, isLoggedIn: false };
    case 'SET_THEME':
      return { ...state, theme: action.theme };
    default:
      return state;
  }
}

// 3. Provider
function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    isLoggedIn: false,
    theme: 'light',
  });

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

// 4. Custom hooks for clean consumption
function useAppState()    { return useContext(StateContext); }
function useAppDispatch() { return useContext(DispatchContext); }

// 5. Any component can read or dispatch
function Header() {
  const { user, theme }  = useAppState();
  const dispatch = useAppDispatch();

  return (
    <header>
      <span>{user ? 'Hello, ' + user.name : 'Not logged in'}</span>
      <button onClick={() => dispatch({ type: 'SET_THEME', theme: theme === 'light' ? 'dark' : 'light' })}>
        Toggle Theme
      </button>
    </header>
  );
}`,
    },
    {
      type: 'heading',
      content: '4. useState vs useReducer - When to Use Each',
    },
    {
      type: 'table',
      title: 'Choosing between useState and useReducer',
      headers: ['Situation', 'Use useState', 'Use useReducer'],
      rows: [
        ['Single value (toggle, count)', '✓ Simple and direct', '✗ Overkill'],
        ['Multiple related values', '◑ Possible but messy', '✓ Cleaner'],
        ['Complex transition logic', '✗ If/else clutter in handlers', '✓ Centralized in reducer'],
        ['Next state depends on previous', '✓ Use functional updater', '✓ Also works well'],
        ['Testing state logic separately', '✗ Logic mixed in component', '✓ Reducer is pure function'],
        ['Shared across many components', '✓ Lift state up', '✓ Pair with Context'],
      ],
    },
    {
      type: 'tryit',
      title: 'Try It: Todo App with useReducer',
      css: `body { font-family: system-ui, sans-serif; padding: 20px; background: #f0f4ff; }
.card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
h2 { margin: 0 0 16px; font-size: 16px; color: #1e293b; }
.row { display: flex; gap: 8px; margin-bottom: 16px; }
input { flex: 1; padding: 8px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; }
input:focus { border-color: #2563eb; }
button { padding: 8px 14px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px; }
.btn-blue { background: #2563eb; color: white; }
.btn-red { background: #dc2626; color: white; }
.btn-gray { background: #e5e7eb; color: #374151; }
.todo { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
.todo:last-child { border-bottom: none; }
.todo-text { flex: 1; font-size: 14px; color: #374151; }
.todo-text.done { text-decoration: line-through; color: #9ca3af; }
.filters { display: flex; gap: 6px; margin-bottom: 12px; }
.count { font-size: 12px; color: #6b7280; margin-bottom: 8px; }`,
      jsx: `function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      if (!action.text.trim()) return state;
      return {
        ...state,
        todos: [...state.todos, { id: Date.now(), text: action.text.trim(), done: false }],
      };
    case 'TOGGLE':
      return {
        ...state,
        todos: state.todos.map(t => t.id === action.id ? { ...t, done: !t.done } : t),
      };
    case 'DELETE':
      return { ...state, todos: state.todos.filter(t => t.id !== action.id) };
    case 'SET_FILTER':
      return { ...state, filter: action.filter };
    case 'CLEAR_DONE':
      return { ...state, todos: state.todos.filter(t => !t.done) };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = React.useReducer(todoReducer, {
    todos: [
      { id: 1, text: 'Learn useReducer', done: true },
      { id: 2, text: 'Build a todo app', done: false },
    ],
    filter: 'all',
  });
  const [input, setInput] = React.useState('');

  const filtered = state.todos.filter(t => {
    if (state.filter === 'active') return !t.done;
    if (state.filter === 'done')   return t.done;
    return true;
  });

  const doneCount = state.todos.filter(t => t.done).length;

  return (
    <div className="card">
      <h2>✅ Todo - useReducer Pattern</h2>
      <div className="row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { dispatch({ type: 'ADD', text: input }); setInput(''); } }}
          placeholder="New todo..."
        />
        <button className="btn-blue" onClick={() => { dispatch({ type: 'ADD', text: input }); setInput(''); }}>Add</button>
      </div>
      <div className="filters">
        {['all','active','done'].map(f => (
          <button key={f} className={state.filter === f ? 'btn-blue' : 'btn-gray'}
            onClick={() => dispatch({ type: 'SET_FILTER', filter: f })} style={{ textTransform: 'capitalize', fontSize: 12, padding: '4px 10px' }}>
            {f}
          </button>
        ))}
      </div>
      <div className="count">{doneCount}/{state.todos.length} completed</div>
      {filtered.map(todo => (
        <div key={todo.id} className="todo">
          <input type="checkbox" checked={todo.done}
            onChange={() => dispatch({ type: 'TOGGLE', id: todo.id })} />
          <span className={'todo-text' + (todo.done ? ' done' : '')}>{todo.text}</span>
          <button className="btn-red" style={{ padding: '3px 8px', fontSize: 11 }}
            onClick={() => dispatch({ type: 'DELETE', id: todo.id })}>✕</button>
        </div>
      ))}
      {doneCount > 0 && (
        <button className="btn-gray" style={{ marginTop: 10, fontSize: 12 }}
          onClick={() => dispatch({ type: 'CLEAR_DONE' })}>Clear completed</button>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);`,
    },
  ],
  exercises: [
    {
      id: 'reducer-1',
      question: 'What does the dispatch function do in useReducer?',
      type: 'multiple-choice',
      options: [
        'It directly updates the state value like setState',
        'It sends an action object to the reducer function, which calculates the new state',
        'It fetches data and updates state when it arrives',
        'It registers an event listener for state changes',
      ],
      correct: 1,
      explanation: 'dispatch sends an action object (usually { type: "ACTION_NAME", payload: ... }) to the reducer function. The reducer receives the current state + action and returns the new state. React then re-renders with the new state. The component never modifies state directly.',
    },
    {
      id: 'reducer-2',
      question: 'What must a reducer function always do for unknown action types?',
      type: 'multiple-choice',
      options: [
        'Throw an error',
        'Return null',
        'Return the current state unchanged',
        'Return the initial state',
      ],
      correct: 2,
      explanation: 'The default case in a reducer should always return the current state. If you return undefined or null for unknown actions, your state will be wiped out. A reducer is a pure function - for any input it produces a predictable output without side effects.',
    },
  ],
  quiz: [
    {
      id: 'rredq1',
      question: 'What is the main advantage of putting all state logic in a reducer?',
      options: [
        'Reducers run faster than useState setters',
        'State logic is centralized, predictable, and testable as a pure function',
        'Reducers automatically persist state to localStorage',
        'You can use reducers without React',
      ],
      correct: 1,
      explanation: 'A reducer is a pure function - it takes state + action and deterministically returns new state with no side effects. This makes all state transitions predictable, easy to trace, and independently testable (just call the function with inputs and check the output). No component setup needed to test state logic.',
    },
  ],
};
