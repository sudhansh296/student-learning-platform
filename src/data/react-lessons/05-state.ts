import type { ReactLesson } from '../react-curriculum';

export const reactStateLesson: ReactLesson = {
  id: 'react-state',
  title: 'State — useState Hook',
  slug: 'state',
  chapter: 'hooks',
  order: 5,
  difficulty: 'beginner',
  readingTime: 13,
  description: 'Master useState — Reacts primary hook for managing changing data. Learn to update primitives, objects, and arrays, understand asynchronous state updates, and lift state to share it between components.',
  sections: [
    {
      type: 'text',
      content: 'State is data that can change over time and that React needs to track. When state changes, React automatically re-renders the component with the new values. Props are read-only data passed from outside; state is data the component owns and can change. The useState hook is the most important hook in React.',
    },
    {
      type: 'heading',
      content: '1. useState Syntax',
    },
    {
      type: 'example',
      title: 'Declaring and using a state variable',
      content: 'useState is called with an initial value and returns an array with exactly two items: the current value, and a setter function. By convention we destructure them as [value, setValue]. Calling the setter function with a new value triggers a re-render — React calls the component function again and the UI updates to reflect the new state.',
      language: 'jsx',
      code: `// (React hooks available as React.useState, React.useEffect, etc.)

function Counter() {
  // useState(initialValue) returns [currentValue, setterFunction]
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>

      {/* Call setter to change state */}
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// You can use any initial value
const [name,    setName]    = useState('Alice');      // string
const [age,     setAge]     = useState(25);           // number
const [visible, setVisible] = useState(false);        // boolean
const [items,   setItems]   = useState([]);           // array
const [user,    setUser]    = useState(null);         // null`,
    },
    {
      type: 'heading',
      content: '2. State Updates Are Asynchronous',
    },
    {
      type: 'example',
      title: 'Why you should use the functional updater form',
      content: 'Calling setState does not immediately change the value — it schedules a re-render. If you call setState multiple times in one event handler using the current value, you might read a stale value. The safe solution is the functional updater form: pass a function to setState that receives the previous state and returns the new state.',
      language: 'jsx',
      code: `function Counter() {
  const [count, setCount] = useState(0);

  // ⚠️ Problematic — both reads the same stale "count"
  function addThreeBuggy() {
    setCount(count + 1); // count is still 0
    setCount(count + 1); // count is still 0  
    setCount(count + 1); // count is still 0 — result: 1, not 3!
  }

  // ✅ Correct — functional form always uses the latest value
  function addThreeCorrect() {
    setCount(prev => prev + 1); // prev is 0 → 1
    setCount(prev => prev + 1); // prev is 1 → 2
    setCount(prev => prev + 1); // prev is 2 → 3 ✓
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={addThreeBuggy}>Buggy +3</button>
      <button onClick={addThreeCorrect}>Correct +3</button>
    </div>
  );
}

// Rule of thumb: use functional updater whenever
// new state depends on the previous state`,
    },
    {
      type: 'heading',
      content: '3. Multiple State Variables',
    },
    {
      type: 'example',
      title: 'Using useState multiple times in one component',
      content: 'You can call useState as many times as you need in one component — each call creates a completely separate piece of state. React tracks them by their call order, which is why hooks must always be called at the top level (never inside if statements or loops).',
      language: 'jsx',
      code: `function UserForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [age,       setAge]       = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (firstName && lastName) {
      setSubmitted(true);
    }
  }

  if (submitted) {
    return <p>Hello, {firstName} {lastName} (age {age})!</p>;
  }

  return (
    <div>
      <input
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        placeholder="First name"
      />
      <input
        value={lastName}
        onChange={e => setLastName(e.target.value)}
        placeholder="Last name"
      />
      <input
        value={age}
        onChange={e => setAge(e.target.value)}
        placeholder="Age"
        type="number"
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '4. Objects in State',
    },
    {
      type: 'example',
      title: 'Always spread the old object when updating object state',
      content: 'When state is an object, you must replace the entire object — React does not merge individual properties automatically. Use the spread operator to copy all existing properties first, then override the ones that changed. If you forget to spread, you lose all the properties you did not mention.',
      language: 'jsx',
      code: `function ProfileEditor() {
  const [user, setUser] = useState({
    name: 'Alice',
    email: 'alice@example.com',
    bio: 'Frontend developer',
  });

  // ❌ Wrong — replaces the whole object, losing name and email!
  function badUpdate() {
    setUser({ bio: 'Fullstack developer' });
    // user is now { bio: 'Fullstack developer' } — name and email gone!
  }

  // ✅ Correct — spread existing state, then override
  function updateBio(newBio) {
    setUser(prev => ({ ...prev, bio: newBio }));
    // user is now { name: 'Alice', email: '...', bio: newBio }
  }

  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Bio: {user.bio}</p>
      <input
        value={user.bio}
        onChange={e => setUser(prev => ({ ...prev, bio: e.target.value }))}
      />
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '5. Arrays in State',
    },
    {
      type: 'example',
      title: 'Adding, removing, and updating array items in state',
      content: 'Arrays in state follow the same rule as objects: never mutate the array directly. Instead, create a new array using spread, filter, or map. Avoid push, pop, splice, or sort on the state array directly — these mutate in place and React wont detect the change.',
      language: 'jsx',
      code: `function TodoList() {
  const [todos, setTodos] = useState(['Buy milk', 'Walk the dog']);
  const [input, setInput] = useState('');

  // ✅ Add — spread old array + new item
  function addTodo() {
    if (!input.trim()) return;
    setTodos(prev => [...prev, input.trim()]);
    setInput('');
  }

  // ✅ Remove — filter creates a new array without the item
  function removeTodo(index) {
    setTodos(prev => prev.filter((_, i) => i !== index));
  }

  // ✅ Update — map creates a new array with one item changed
  function updateTodo(index, newText) {
    setTodos(prev => prev.map((todo, i) => i === index ? newText : todo));
  }

  return (
    <div>
      <input value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>
            {todo}
            <button onClick={() => removeTodo(i)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
    },
    {
      type: 'tryit',
      title: 'Try It: useState Counter and Todo',
      css: `body { font-family: system-ui, sans-serif; padding: 20px; background: #f8fafc; }
.section { background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
h3 { margin: 0 0 12px; font-size: 15px; color: #374151; }
.counter-row { display: flex; align-items: center; gap: 12px; }
.count-num { font-size: 32px; font-weight: 800; min-width: 60px; text-align: center; }
button { padding: 8px 14px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px; }
.btn-red { background: #dc2626; }
.btn-gray { background: #6b7280; }
.input-row { display: flex; gap: 8px; margin-bottom: 12px; }
input { flex: 1; padding: 8px 12px; border: 1.5px solid #e5e7eb; border-radius: 6px; font-size: 14px; outline: none; }
input:focus { border-color: #2563eb; }
ul { list-style: none; padding: 0; margin: 0; }
li { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; border-radius: 6px; margin-bottom: 4px; background: #f9fafb; font-size: 14px; }
.del-btn { background: none; border: none; color: #9ca3af; cursor: pointer; font-size: 16px; padding: 2px 6px; }
.del-btn:hover { color: #dc2626; }`,
      jsx: `function CounterSection() {
  const [count, setCount] = React.useState(0);
  const color = count > 0 ? '#16a34a' : count < 0 ? '#dc2626' : '#2563eb';

  return (
    <div className="section">
      <h3>Counter (useState)</h3>
      <div className="counter-row">
        <button className="btn-red" onClick={() => setCount(prev => prev - 1)}>−</button>
        <div className="count-num" style={{ color }}>{count}</div>
        <button onClick={() => setCount(prev => prev + 1)}>+</button>
        <button className="btn-gray" onClick={() => setCount(0)}>Reset</button>
      </div>
    </div>
  );
}

function TodoSection() {
  const [todos, setTodos] = React.useState(['Learn React', 'Build something']);
  const [input, setInput] = React.useState('');

  function addTodo() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos(prev => [...prev, trimmed]);
    setInput('');
  }

  function removeTodo(i) {
    setTodos(prev => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div className="section">
      <h3>Todo List (array state)</h3>
      <div className="input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="New todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul>
        {todos.map((t, i) => (
          <li key={i}>
            {t}
            <button className="del-btn" onClick={() => removeTodo(i)}>✕</button>
          </li>
        ))}
      </ul>
      {todos.length === 0 && <p style={{ color: '#9ca3af', fontSize: 13 }}>No todos yet!</p>}
    </div>
  );
}

function App() {
  return (
    <div>
      <CounterSection />
      <TodoSection />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);`,
    },
  ],
  exercises: [
    {
      id: 'state-1',
      question: 'What does useState(0) return?',
      type: 'multiple-choice',
      options: [
        'Just the number 0',
        'An object with { value: 0, setValue: function }',
        'An array with [0, setterFunction]',
        'A Promise that resolves to 0',
      ],
      correct: 2,
      explanation: 'useState returns an array with two items: the current state value and the setter function. We destructure it as const [count, setCount] = useState(0).',
    },
    {
      id: 'state-2',
      question: 'How do you correctly add an item to an array stored in state?',
      type: 'multiple-choice',
      options: [
        'items.push(newItem); setItems(items);',
        'setItems([...items, newItem]);',
        'items[items.length] = newItem;',
        'setItems(items.add(newItem));',
      ],
      correct: 1,
      explanation: 'Never mutate the state array directly (no push, splice, etc.). Instead create a new array using spread: setItems([...items, newItem]). This gives React the new array reference it needs to detect the change.',
    },
  ],
  quiz: [
    {
      id: 'rsq1',
      question: 'When should you use the functional updater form setCount(prev => prev + 1)?',
      options: [
        'Always — its the only correct way',
        'Never — it is slower',
        'When the new state depends on the previous state',
        'Only when using TypeScript',
      ],
      correct: 2,
      explanation: 'Use the functional form (prev => newValue) whenever the new state depends on the current state. This guarantees you are working with the latest value, even when multiple updates are batched together.',
    },
  ],
};
