import type { ReactLesson } from '../react-curriculum';

export const reactStateLesson: ReactLesson = {
  id: 'react-state',
  title: 'State - useState Hook',
  slug: 'state',
  chapter: 'hooks',
  order: 5,
  difficulty: 'beginner',
  readingTime: 13,
  description: 'Master useState - Reacts primary hook for managing changing data. Learn to update primitives, objects, and arrays, understand asynchronous state updates, and lift state to share it between components.',
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
      content: 'useState is called with an initial value and returns an array with exactly two items: the current value, and a setter function. By convention we destructure them as [value, setValue]. Calling the setter function with a new value triggers a re-render - React calls the component function again and the UI updates to reflect the new state.',
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
      content: 'Calling setState does not immediately change the value - it schedules a re-render. If you call setState multiple times in one event handler using the current value, you might read a stale value. The safe solution is the functional updater form: pass a function to setState that receives the previous state and returns the new state.',
      language: 'jsx',
      code: `function Counter() {
  const [count, setCount] = useState(0);

  // ⚠️ Problematic - both reads the same stale "count"
  function addThreeBuggy() {
    setCount(count + 1); // count is still 0
    setCount(count + 1); // count is still 0  
    setCount(count + 1); // count is still 0 - result: 1, not 3!
  }

  // ✅ Correct - functional form always uses the latest value
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
      content: 'You can call useState as many times as you need in one component - each call creates a completely separate piece of state. React tracks them by their call order, which is why hooks must always be called at the top level (never inside if statements or loops).',
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
      content: 'When state is an object, you must replace the entire object - React does not merge individual properties automatically. Use the spread operator to copy all existing properties first, then override the ones that changed. If you forget to spread, you lose all the properties you did not mention.',
      language: 'jsx',
      code: `function ProfileEditor() {
  const [user, setUser] = useState({
    name: 'Alice',
    email: 'alice@example.com',
    bio: 'Frontend developer',
  });

  // ❌ Wrong - replaces the whole object, losing name and email!
  function badUpdate() {
    setUser({ bio: 'Fullstack developer' });
    // user is now { bio: 'Fullstack developer' } - name and email gone!
  }

  // ✅ Correct - spread existing state, then override
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
      content: 'Arrays in state follow the same rule as objects: never mutate the array directly. Instead, create a new array using spread, filter, or map. Avoid push, pop, splice, or sort on the state array directly - these mutate in place and React wont detect the change.',
      language: 'jsx',
      code: `function TodoList() {
  const [todos, setTodos] = useState(['Buy milk', 'Walk the dog']);
  const [input, setInput] = useState('');

  // ✅ Add - spread old array + new item
  function addTodo() {
    if (!input.trim()) return;
    setTodos(prev => [...prev, input.trim()]);
    setInput('');
  }

  // ✅ Remove - filter creates a new array without the item
  function removeTodo(index) {
    setTodos(prev => prev.filter((_, i) => i !== index));
  }

  // ✅ Update - map creates a new array with one item changed
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
      title: 'Try It: Kanban Task Board',
      css: `body { font-family: system-ui, sans-serif; padding: 16px; background: #f0f4ff; }
h2 { margin: 0 0 14px; font-size: 17px; color: #1e293b; }
.board { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
.col { background: white; border-radius: 12px; padding: 12px; border: 1px solid #e2e8f0; min-height: 260px; }
.col-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.col-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; }
.col-count { font-size: 11px; font-weight: 700; padding: 1px 7px; border-radius: 999px; }
.col-todo .col-title { color: #6366f1; } .col-todo .col-count { background: #ede9fe; color: #6d28d9; }
.col-progress .col-title { color: #f59e0b; } .col-progress .col-count { background: #fef3c7; color: #d97706; }
.col-done .col-title { color: #22c55e; } .col-done .col-count { background: #dcfce7; color: #15803d; }
.task { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 10px; margin-bottom: 6px; font-size: 13px; color: #1e293b; }
.task-row { display: flex; align-items: flex-start; gap: 4px; }
.task-text { flex: 1; line-height: 1.4; }
.task-btns { display: flex; flex-direction: column; gap: 2px; flex-shrink: 0; }
.tb { background: none; border: none; cursor: pointer; font-size: 10px; padding: 2px 4px; border-radius: 3px; color: #94a3b8; }
.tb:hover { background: #e2e8f0; color: #475569; }
.tb.del { color: #fca5a5; } .tb.del:hover { background: #fee2e2; color: #dc2626; }
.add-row { display: flex; gap: 6px; margin-top: 8px; }
.add-row input { flex: 1; padding: 6px 8px; border: 1.5px solid #e2e8f0; border-radius: 6px; font-size: 12px; outline: none; }
.add-row input:focus { border-color: #6366f1; }
.add-row button { padding: 6px 10px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 700; }
.empty { color: #cbd5e1; font-size: 11px; text-align: center; padding: 20px 0; }`,
      jsx: `const COLS = ['Todo', 'In Progress', 'Done'];
const COL_KEYS = ['todo', 'progress', 'done'];

const INITIAL = {
  todo:     [{id:1,text:'Learn React hooks'},{id:2,text:'Build a todo app'},{id:3,text:'Study useEffect'}],
  progress: [{id:4,text:'Master useState'},{id:5,text:'CSS Grid layout'}],
  done:     [{id:6,text:'Set up dev environment'},{id:7,text:'Learn JSX syntax'}],
};

function TaskCard({ task, colIdx, onMove, onDelete }) {
  return (
    <div className="task">
      <div className="task-row">
        <span className="task-text">{task.text}</span>
        <div className="task-btns">
          {colIdx > 0 && <button className="tb" onClick={() => onMove(task.id, colIdx, colIdx-1)}>◀</button>}
          {colIdx < COLS.length-1 && <button className="tb" onClick={() => onMove(task.id, colIdx, colIdx+1)}>▶</button>}
          <button className="tb del" onClick={() => onDelete(task.id, colIdx)}>✕</button>
        </div>
      </div>
    </div>
  );
}

function Column({ colIdx, tasks, onMove, onDelete, onAdd }) {
  const [input, setInput] = React.useState('');
  const key = COL_KEYS[colIdx];
  const colors = ['col-todo','col-progress','col-done'];

  function handleAdd(e) {
    e.preventDefault();
    if (!input.trim()) return;
    onAdd(colIdx, input.trim());
    setInput('');
  }

  return (
    <div className={"col " + colors[colIdx]}>
      <div className="col-header">
        <span className="col-title">{COLS[colIdx]}</span>
        <span className="col-count">{tasks.length}</span>
      </div>
      {tasks.length === 0 && <div className="empty">Drop tasks here</div>}
      {tasks.map(t => (
        <TaskCard key={t.id} task={t} colIdx={colIdx} onMove={onMove} onDelete={onDelete} />
      ))}
      <form className="add-row" onSubmit={handleAdd}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Add task..." />
        <button type="submit">+</button>
      </form>
    </div>
  );
}

function KanbanBoard() {
  const [board, setBoard] = React.useState(INITIAL);
  const [nextId, setNextId] = React.useState(8);

  function moveTask(taskId, fromIdx, toIdx) {
    const fromKey = COL_KEYS[fromIdx], toKey = COL_KEYS[toIdx];
    setBoard(prev => {
      const task = prev[fromKey].find(t => t.id === taskId);
      return {
        ...prev,
        [fromKey]: prev[fromKey].filter(t => t.id !== taskId),
        [toKey]: [...prev[toKey], task],
      };
    });
  }

  function deleteTask(taskId, colIdx) {
    const key = COL_KEYS[colIdx];
    setBoard(prev => ({ ...prev, [key]: prev[key].filter(t => t.id !== taskId) }));
  }

  function addTask(colIdx, text) {
    const key = COL_KEYS[colIdx];
    setBoard(prev => ({ ...prev, [key]: [...prev[key], { id: nextId, text }] }));
    setNextId(n => n + 1);
  }

  const total = COL_KEYS.reduce((s,k) => s + board[k].length, 0);
  const done  = board.done.length;

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
        <h2>⚛️ Kanban Board (useState)</h2>
        <span style={{fontSize:12,color:'#64748b',fontWeight:600}}>{done}/{total} done</span>
      </div>
      <div className="board">
        {COL_KEYS.map((_, i) => (
          <Column key={i} colIdx={i} tasks={board[COL_KEYS[i]]}
            onMove={moveTask} onDelete={deleteTask} onAdd={addTask} />
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<KanbanBoard />);`,
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
        'Always - its the only correct way',
        'Never - it is slower',
        'When the new state depends on the previous state',
        'Only when using TypeScript',
      ],
      correct: 2,
      explanation: 'Use the functional form (prev => newValue) whenever the new state depends on the current state. This guarantees you are working with the latest value, even when multiple updates are batched together.',
    },
  ],
};
