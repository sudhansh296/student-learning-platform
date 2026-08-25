import type { ReactLesson } from '../react-curriculum';

export const reactListsLesson: ReactLesson = {
  id: 'react-lists',
  title: 'Lists and Keys',
  slug: 'lists-keys',
  chapter: 'core',
  order: 8,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'Learn how to render arrays with .map(), why React requires the key prop, what makes a good key, how to filter lists, and how to render arrays of objects.',
  sections: [
    {
      type: 'text',
      content: 'Rendering a list of items is one of the most common tasks in React - product lists, user feeds, navigation menus, comment threads. React uses JavaScript\'s .map() method to transform arrays into JSX elements. Each element in a list must have a unique "key" prop so React can track changes efficiently.',
    },
    {
      type: 'heading',
      content: '1. Rendering an Array with .map()',
    },
    {
      type: 'example',
      title: 'Transforming an array into JSX elements',
      content: 'The .map() method creates a new array by transforming each item. When you return JSX from the callback, you get an array of JSX elements. React renders arrays automatically - just put the result inside {}. Every element in the array needs a unique key prop so React can track each item.',
      language: 'jsx',
      code: `const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

function FruitList() {
  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li key={index}>{fruit}</li>
      ))}
    </ul>
  );
}

// You can also store the mapped JSX in a variable
function FruitGrid() {
  const fruitItems = fruits.map((fruit, i) => (
    <div key={i} style={{ padding: '8px', background: '#f3f4f6', borderRadius: '6px', margin: '4px' }}>
      🍎 {fruit}
    </div>
  ));

  return (
    <div>
      <h2>Fruits ({fruits.length})</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {fruitItems}
      </div>
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '2. Why Keys Are Required',
    },
    {
      type: 'example',
      title: 'How React uses keys to reconcile the DOM',
      content: 'React uses keys to identify which items in a list have changed, been added, or been removed. Without keys, React would re-render the entire list on every change. With stable unique keys, React knows exactly which item to update - making list operations (add, delete, reorder) very fast. Without keys, React logs a warning and may produce incorrect behavior when items are reordered.',
      language: 'jsx',
      code: `// ❌ No key - React warning + potential bugs on reorder
function BadList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li>{item.name}</li>  // Missing key prop!
      ))}
    </ul>
  );
}

// ❌ Index as key - OK for static lists, bad for dynamic ones
// If items are reordered/deleted, index changes → wrong item re-renders
function OkayList({ items }) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item.name}</li>
      ))}
    </ul>
  );
}

// ✅ Stable unique ID - always the right choice for mutable lists
function GoodList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// Rule: key must be stable, unique AMONG SIBLINGS, and not change
// between renders. A database ID is the ideal key.`,
    },
    {
      type: 'heading',
      content: '3. Rendering Arrays of Objects',
    },
    {
      type: 'example',
      title: 'Mapping an array of objects into components',
      content: 'Most real-world lists come from an API as arrays of objects. You .map() over them and pass each objects properties as props to a child component. This keeps your rendering logic in the parent and your display logic in the child component.',
      language: 'jsx',
      code: `const users = [
  { id: 1, name: 'Alice Chen',  role: 'Frontend Dev', avatar: '👩‍💻', active: true  },
  { id: 2, name: 'Bob Smith',   role: 'Backend Dev',  avatar: '🧑‍💼', active: false },
  { id: 3, name: 'Carol White', role: 'Designer',     avatar: '🎨',  active: true  },
];

// Component for a single item
function UserRow({ id, name, role, avatar, active }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '12px', borderBottom: '1px solid #f3f4f6'
    }}>
      <span style={{ fontSize: 28 }}>{avatar}</span>
      <div style={{ flex: 1 }}>
        <strong>{name}</strong>
        <p style={{ margin: 0, color: '#6b7280', fontSize: 13 }}>{role}</p>
      </div>
      <span style={{
        color: active ? '#16a34a' : '#9ca3af',
        fontSize: 12, fontWeight: 700
      }}>
        {active ? '● Online' : '○ Offline'}
      </span>
    </div>
  );
}

// Parent maps the array and passes each item as props
function UserList() {
  return (
    <div>
      {users.map(user => (
        <UserRow key={user.id} {...user} />
      ))}
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '4. Filtering Lists',
    },
    {
      type: 'example',
      title: 'Combining .filter() and .map() for searchable lists',
      content: 'You can chain .filter() before .map() to show only matching items. Filtering does not mutate the original array - it returns a new array. This pattern is the foundation for search bars, category filters, and status filters. The filtered and mapped result is computed fresh on every render.',
      language: 'jsx',
      code: `function FilterableList() {
  const [query, setQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  const products = [
    { id: 1, name: 'React Course',      category: 'Education', available: true  },
    { id: 2, name: 'CSS Masterclass',   category: 'Education', available: false },
    { id: 3, name: 'Wireless Keyboard', category: 'Hardware',  available: true  },
    { id: 4, name: 'Standing Desk',     category: 'Hardware',  available: true  },
    { id: 5, name: 'TypeScript Book',   category: 'Education', available: false },
  ];

  const visible = products
    .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    .filter(p => statusFilter === 'all' || (statusFilter === 'available') === p.available);

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search products..."
      />
      <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="available">Available</option>
        <option value="unavailable">Unavailable</option>
      </select>

      <p>{visible.length} results</p>

      {visible.map(p => (
        <div key={p.id}>
          <strong>{p.name}</strong>
          <span> - {p.category}</span>
          <span> {p.available ? '✅' : '❌'}</span>
        </div>
      ))}

      {visible.length === 0 && <p>No products found.</p>}
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '5. Keys Must Be Unique Among Siblings',
    },
    {
      type: 'example',
      title: 'Key scope - unique within siblings, not globally',
      content: 'Keys only need to be unique among siblings in the same list. Two different lists can have the same key values without conflict. The key is never passed as a prop to the component - if you need the ID inside the component, pass it as a separate prop too.',
      language: 'jsx',
      code: `const todoItems = [
  { id: 101, text: 'Buy milk' },
  { id: 102, text: 'Walk the dog' },
];

const doneItems = [
  { id: 101, text: 'Send email' }, // same id 101 is OK - different list
  { id: 103, text: 'Read book' },
];

function Item({ id, text, onDelete }) {
  // Note: "key" is NOT received as a prop
  // We pass "id" separately if we need it inside the component
  return (
    <li>
      {text}
      <button onClick={() => onDelete(id)}>Delete</button>
    </li>
  );
}

function Lists() {
  function handleDelete(id) {
    console.log('Deleting item', id);
  }

  return (
    <div>
      <h3>Todo</h3>
      <ul>
        {todoItems.map(item => (
          <Item key={item.id} id={item.id} text={item.text} onDelete={handleDelete} />
        ))}
      </ul>
      <h3>Done</h3>
      <ul>
        {doneItems.map(item => (
          <Item key={item.id} id={item.id} text={item.text} onDelete={handleDelete} />
        ))}
      </ul>
    </div>
  );
}`,
    },
    {
      type: 'tryit',
      title: 'Try It: Filterable Todo List with Keys',
      css: `body { font-family: system-ui, sans-serif; padding: 20px; background: #f8fafc; }
.app { max-width: 480px; }
.controls { display: flex; gap: 8px; margin-bottom: 16px; }
input { flex: 1; padding: 8px 12px; border: 1.5px solid #e5e7eb; border-radius: 6px; font-size: 14px; outline: none; }
input:focus { border-color: #2563eb; }
.filter-row { display: flex; gap: 6px; margin-bottom: 12px; }
.filter-btn { padding: 5px 12px; border-radius: 999px; border: 1.5px solid #e5e7eb; background: white; cursor: pointer; font-size: 12px; font-weight: 700; color: #6b7280; }
.filter-btn.active { background: #2563eb; color: white; border-color: #2563eb; }
.todo-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: white; border-radius: 8px; margin-bottom: 6px; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
.todo-item.done .todo-text { text-decoration: line-through; color: #9ca3af; }
.todo-text { flex: 1; font-size: 14px; }
.del-btn { background: none; border: none; color: #d1d5db; cursor: pointer; font-size: 18px; }
.del-btn:hover { color: #dc2626; }
.empty { text-align: center; color: #9ca3af; font-size: 14px; padding: 20px; }
.count { font-size: 12px; color: #9ca3af; margin-bottom: 8px; }
button.add-btn { padding: 8px 14px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 700; }`,
      jsx: `function TodoApp() {
  const [todos, setTodos] = React.useState([
    { id: 1, text: 'Learn React basics', done: true  },
    { id: 2, text: 'Build a component',  done: true  },
    { id: 3, text: 'Understand useState', done: false },
    { id: 4, text: 'Master useEffect',   done: false },
  ]);
  const [input, setInput] = React.useState('');
  const [filter, setFilter] = React.useState('all');
  const [nextId, setNextId] = React.useState(5);

  function addTodo() {
    const text = input.trim();
    if (!text) return;
    setTodos(prev => [...prev, { id: nextId, text, done: false }]);
    setNextId(n => n + 1);
    setInput('');
  }

  function toggleTodo(id) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  function deleteTodo(id) {
    setTodos(prev => prev.filter(t => t.id !== id));
  }

  const filtered = todos.filter(t =>
    filter === 'all' ? true :
    filter === 'active' ? !t.done :
    t.done
  );

  return (
    <div className="app">
      <div className="controls">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo..."
        />
        <button className="add-btn" onClick={addTodo}>Add</button>
      </div>

      <div className="filter-row">
        {['all','active','done'].map(f => (
          <button
            key={f}
            className={'filter-btn' + (filter === f ? ' active' : '')}
            onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <p className="count">{filtered.length} item{filtered.length !== 1 ? 's' : ''}</p>

      {filtered.map(todo => (
        <div key={todo.id} className={'todo-item' + (todo.done ? ' done' : '')}>
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => toggleTodo(todo.id)}
          />
          <span className="todo-text">{todo.text}</span>
          <button className="del-btn" onClick={() => deleteTodo(todo.id)}>✕</button>
        </div>
      ))}

      {filtered.length === 0 && (
        <p className="empty">No todos in this filter.</p>
      )}
    </div>
  );
}

function App() {
  return <TodoApp />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);`,
    },
  ],
  exercises: [
    {
      id: 'list-1',
      question: 'Why is using the array index as a key problematic for dynamic lists?',
      type: 'multiple-choice',
      options: [
        'Indexes are not JavaScript values',
        'Indexes change when items are added, deleted, or reordered, causing React to match the wrong component to each key',
        'React does not support numbers as keys',
        'It causes infinite re-renders',
      ],
      correct: 1,
      explanation: 'When you delete or reorder items, the index of every subsequent item changes. React then sees a different key and unmounts/remounts those components, losing their state and causing incorrect animations or focus management. Stable IDs from the data avoid this problem.',
    },
    {
      id: 'list-2',
      question: 'Can you access the "key" prop inside a component?',
      type: 'multiple-choice',
      options: [
        'Yes - it is available as props.key',
        'Yes - but only in class components',
        'No - key is used by React internally and is not passed to the component',
        'No - key only works with HTML elements',
      ],
      correct: 2,
      explanation: 'The key prop is consumed by React internally for reconciliation. It is never passed to the component as a prop. If you need the ID value inside the component, pass it as a separate prop: <Item key={item.id} id={item.id} />.',
    },
  ],
  quiz: [
    {
      id: 'rlkq1',
      question: 'What is the main purpose of the key prop in a list?',
      options: [
        'To set the CSS id attribute on the element',
        'To give React a stable identifier so it can track and update each list item efficiently',
        'To prevent duplicate items from being added',
        'To make the component accessible',
      ],
      correct: 1,
      explanation: 'React uses the key to identify which items changed between renders. With stable unique keys, React can add, remove, and reorder list items with minimal DOM updates. Without keys it has to re-render everything.',
    },
  ],
};
