import type { ReactLesson } from '../react-curriculum';

export const reactTypeScriptLesson: ReactLesson = {
  id: 'react-typescript',
  title: 'TypeScript with React',
  slug: 'typescript-react',
  chapter: 'advanced',
  order: 18,
  difficulty: 'advanced',
  readingTime: 14,
  description: 'Add type safety to your React components. Learn to type props with interfaces, handle event types, use useState generics, type children with React.ReactNode, and avoid common TypeScript pitfalls.',
  sections: [
    {
      type: 'text',
      content: 'TypeScript makes React components more robust by catching type errors at development time. Instead of runtime surprises, you get instant feedback in your editor when you pass a string where a number is expected or forget a required prop.',
    },
    {
      type: 'heading',
      content: '1. Typing Component Props',
    },
    {
      type: 'example',
      title: 'Define a Props interface and use it in your component',
      content: 'Create an interface (or type alias) for your component\'s props. Mark optional props with ?. The component signature receives these typed props and TypeScript enforces correctness at every usage site.',
      language: 'tsx',
      code: `// Define what props the component accepts
interface ButtonProps {
  label: string;         // required string
  onClick: () => void;   // required function
  variant?: 'primary' | 'secondary' | 'danger'; // optional union
  disabled?: boolean;    // optional boolean
  count?: number;        // optional number
}

// Component receives typed props
function Button({ label, onClick, variant = 'primary', disabled = false }: ButtonProps) {
  const styles = {
    primary:   { background: '#2563eb', color: 'white' },
    secondary: { background: '#e5e7eb', color: '#374151' },
    danger:    { background: '#dc2626', color: 'white' },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={styles[variant]}
    >
      {label}
    </button>
  );
}

// TypeScript catches mistakes at the call site:
<Button label="Click me" onClick={() => {}} />              // ✓ OK
<Button label="Save" onClick={() => {}} variant="primary" /> // ✓ OK
<Button onClick={() => {}} />                               // ✗ Error: missing "label"
<Button label={42} onClick={() => {}} />                    // ✗ Error: number not string
<Button label="X" onClick={() => {}} variant="green" />     // ✗ Error: not in union`,
    },
    {
      type: 'heading',
      content: '2. Typing useState',
    },
    {
      type: 'example',
      title: 'useState with generics for complex types',
      content: 'TypeScript infers the type from the initial value for simple cases. For complex types — especially null/undefined initial values or union types — explicitly provide the generic type parameter.',
      language: 'tsx',
      code: `// (React hooks available as React.useState, React.useEffect, etc.)

interface User {
  id: number;
  name: string;
  email: string;
}

function UserProfile() {
  // TypeScript infers: useState<number>(0)
  const [count, setCount] = useState(0);

  // TypeScript infers: useState<string>('')
  const [name, setName] = useState('');

  // Explicit generic needed — initial value is null but will become User
  const [user, setUser] = useState<User | null>(null);

  // Array of users — explicit generic for clarity
  const [users, setUsers] = useState<User[]>([]);

  // Union type — needs explicit generic
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  function loadUser() {
    setStatus('loading');
    // TypeScript knows setUser expects User | null
    setUser({ id: 1, name: 'Alice', email: 'alice@example.com' });
    setStatus('success');
  }

  return (
    <div>
      {user ? <p>Hello, {user.name}</p> : <p>No user loaded</p>}
      <button onClick={loadUser}>Load User</button>
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '3. Event Types',
    },
    {
      type: 'example',
      title: 'React event types for handlers',
      content: 'React wraps native DOM events in SyntheticEvent. TypeScript needs the correct type for event handlers. The most common ones are React.ChangeEvent for inputs and React.MouseEvent for clicks.',
      language: 'tsx',
      code: `// (React hooks available as React.useState, React.useEffect, etc.)

function TypedForm() {
  const [name, setName]   = useState('');
  const [age, setAge]     = useState('');
  const [agreed, setAgreed] = useState(false);

  // React.ChangeEvent<HTMLInputElement> — for text inputs
  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  // React.ChangeEvent<HTMLInputElement> — for number inputs too
  function handleAgeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAge(e.target.value);
  }

  // React.ChangeEvent<HTMLInputElement> — for checkboxes use .checked
  function handleCheckbox(e: React.ChangeEvent<HTMLInputElement>) {
    setAgreed(e.target.checked);
  }

  // React.ChangeEvent<HTMLSelectElement> — for select dropdowns
  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log(e.target.value);
  }

  // React.MouseEvent<HTMLButtonElement> — for button clicks
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    console.log('Clicked at:', e.clientX, e.clientY);
  }

  // React.FormEvent<HTMLFormElement> — for form submit
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log({ name, age, agreed });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={handleNameChange} />
      <input type="number" value={age} onChange={handleAgeChange} />
      <input type="checkbox" checked={agreed} onChange={handleCheckbox} />
      <button type="submit" onClick={handleClick}>Submit</button>
    </form>
  );
}`,
    },
    {
      type: 'heading',
      content: '4. Typing Children',
    },
    {
      type: 'example',
      title: 'React.ReactNode for components that accept children',
      content: 'When a component wraps other components (layout, card, modal), it receives children. Use React.ReactNode as the type — it accepts JSX, strings, numbers, null, and arrays.',
      language: 'tsx',
      code: `// (React hooks available as React.useState, React.useEffect, etc.)

// ReactNode accepts any valid React child
interface CardProps {
  title: string;
  children: ReactNode;  // anything: JSX, string, number, null, array
  footer?: ReactNode;   // optional children-like prop
}

function Card({ title, children, footer }: CardProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>{title}</h2>
      </div>
      <div className="card-body">
        {children}
      </div>
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
}

// Usage — children can be anything
<Card title="Profile">
  <p>Name: Alice</p>
  <p>Email: alice@example.com</p>
</Card>

<Card title="Stats" footer={<button>View All</button>}>
  <p>42 posts</p>
</Card>

// PropsWithChildren helper — alternative approach
// (React hooks available as React.useState, React.useEffect, etc.)

interface PanelProps {
  color: string;
}

function Panel({ color, children }: PropsWithChildren<PanelProps>) {
  return (
    <div style={{ borderLeft: '4px solid ' + color, padding: 16 }}>
      {children}
    </div>
  );
}`,
    },
    {
      type: 'tryit',
      title: 'Try It: Typed React Component (no TS in browser — see patterns)',
      css: `body { font-family: system-ui, sans-serif; padding: 20px; background: #f8fafc; }
.card { background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
h2 { margin: 0 0 14px; font-size: 16px; color: #1e293b; }
.form-row { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
label { font-size: 12px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: .05em; }
input, select { padding: 8px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; width: 100%; }
input:focus, select:focus { border-color: #2563eb; }
.error { font-size: 12px; color: #dc2626; margin-top: 2px; }
button { padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 14px; width: 100%; }
.result { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; margin-top: 12px; font-size: 14px; }
.tag { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; margin-right: 4px; }
.tag-blue { background: #dbeafe; color: #1d4ed8; }
.tag-green { background: #dcfce7; color: #15803d; }`,
      jsx: `function TypedForm() {
  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState('developer');
  const [errors, setErrors] = React.useState({});
  const [submitted, setSubmitted] = React.useState(null);

  function validate() {
    const errs = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitted({ name: name.trim(), role });
  }

  return (
    <div className="card">
      <h2>⚛️ + 🔷 TypeScript React Pattern Demo</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter your name..."
          />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>
        <div className="form-row">
          <label>Role</label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <button type="submit">Submit Form</button>
      </form>
      {submitted && (
        <div className="result">
          <strong>Submitted!</strong>
          <p>Name: {submitted.name}</p>
          <p>Role: <span className="tag tag-blue">{submitted.role}</span></p>
          <span className="tag tag-green">✓ TypeScript would enforce these types at compile time</span>
        </div>
      )}
    </div>
  );
}

function App() {
  return <TypedForm />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);`,
    },
  ],
  exercises: [
    {
      id: 'ts-1',
      question: 'How do you type a useState that starts as null but will hold a User object?',
      type: 'multiple-choice',
      options: [
        'useState<User>(null)',
        'useState<User | null>(null)',
        'useState(null as User)',
        'useState<Nullable<User>>(null)',
      ],
      correct: 1,
      explanation: 'useState<User | null>(null) tells TypeScript the state can be either a User object or null. This is the correct union type. useState<User>(null) would be an error because null is not assignable to User. You then handle the null case with a conditional: if (user) { ... }.',
    },
    {
      id: 'ts-2',
      question: 'What TypeScript type do you use for a component that accepts any React children?',
      type: 'multiple-choice',
      options: [
        'children: string',
        'children: JSX.Element',
        'children: React.ReactNode',
        'children: Component[]',
      ],
      correct: 2,
      explanation: 'React.ReactNode is the most permissive children type — it accepts strings, numbers, JSX elements, arrays, null, and undefined. JSX.Element is more restrictive (only JSX). string only accepts string literals. ReactNode is the correct choice for layout/wrapper components.',
    },
  ],
  quiz: [
    {
      id: 'rtsq1',
      question: 'What is the correct type for an onChange handler on an HTML text input?',
      options: [
        'React.InputEvent',
        'React.ChangeEvent<HTMLInputElement>',
        'Event<HTMLInput>',
        'React.Event<string>',
      ],
      correct: 1,
      explanation: 'React.ChangeEvent<HTMLInputElement> is the correct type for input onChange handlers. The generic parameter specifies which HTML element fired the event, giving you typed access to e.target.value, e.target.checked, etc. For a select element it would be React.ChangeEvent<HTMLSelectElement>.',
    },
  ],
};
