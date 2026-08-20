import type { TsLesson } from '../ts-curriculum';

export const tsReactLesson: TsLesson = {
  id: 'ts-react',
  title: 'TypeScript with React',
  slug: 'react-typescript',
  chapter: 'practical',
  order: 13,
  difficulty: 'advanced',
  readingTime: 10,
  description: 'Type component props with interfaces, FC type, event types, useState generics, useRef types, and children prop.',
  sections: [
    {
      type: 'text',
      content: 'TypeScript and React are one of the most popular combinations in modern frontend development. TypeScript catches prop type errors, gives you autocomplete for event properties, and makes large React applications much safer to refactor. Most new React projects are started with TypeScript by default.',
    },
    {
      type: 'heading',
      content: 'Typing Component Props',
    },
    {
      type: 'example',
      title: 'Props interfaces — define what a component accepts',
      content: 'Define component props with an interface and use it as the type for the props parameter. TypeScript will check every place you use the component — missing required props and wrong types are caught before the browser ever runs the code.',
      language: 'typescript',
      code: `// (React is globally available)

// Define props with an interface
interface ButtonProps {
  label: string;             // required
  onClick: () => void;       // required function
  variant?: "primary" | "secondary" | "danger";  // optional literal union
  disabled?: boolean;        // optional
  size?: "sm" | "md" | "lg"; // optional
}

// Function component with typed props
function Button({ label, onClick, variant = "primary", disabled = false, size = "md" }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={"btn btn-" + variant + " btn-" + size}
    >
      {label}
    </button>
  );
}

// TypeScript checks all usages:
<Button label="Save" onClick={() => console.log("saved")} />  // OK
<Button label="Delete" onClick={() => {}} variant="danger" />  // OK
// <Button onClick={() => {}} />  // Error: prop 'label' is missing`,
    },
    {
      type: 'heading',
      content: 'Event Handler Types',
    },
    {
      type: 'example',
      title: 'Typing React event handlers',
      content: "React's synthetic event types are in the React namespace. The pattern is React.ChangeEvent<HTMLInputElement> for input changes, React.MouseEvent<HTMLButtonElement> for clicks, and React.FormEvent<HTMLFormElement> for form submissions. These give you full type safety for the event's target and properties.",
      language: 'typescript',
      code: `// (React is globally available)

function SearchForm() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);

  // Input change handler — typed with HTMLInputElement
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value); // event.target.value is string
  };

  // Form submit handler
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    // search logic here
    setResults(["Result 1", "Result 2"]);
  };

  // Button click handler
  const handleClear = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    setQuery("");
    setResults([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={query} onChange={handleChange} placeholder="Search..." />
      <button type="submit">Search</button>
      <button type="button" onClick={handleClear}>Clear</button>
    </form>
  );
}`,
    },
    {
      type: 'heading',
      content: 'useState with Generics',
    },
    {
      type: 'example',
      title: 'Typing useState for objects and complex state',
      content: 'useState is a generic function. TypeScript usually infers the type from the initial value, but for complex types — like objects, nullable values, or when you start with an empty state — you should pass the type explicitly: useState<User | null>(null).',
      language: 'typescript',
      code: `// (React hooks: React.useState, React.useEffect, React.useRef, etc.)

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

function UserProfile() {
  // Inferred from initial value — string
  const [name, setName] = useState("Alice");

  // Explicit generic — nullable User
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Explicit generic — array of objects
  const [users, setUsers] = useState<User[]>([]);

  // Loading/error state pattern
  const [isLoading, setIsLoading] = useState(false); // inferred boolean
  const [error, setError] = useState<string | null>(null);

  const loadUser = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      // TypeScript knows the response matches User shape
      const data: User = await fetchUser(id);
      setCurrentUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return null; // render logic here
}

async function fetchUser(id: number): Promise<User> {
  const res = await fetch("/api/users/" + id);
  return res.json();
}`,
    },
    {
      type: 'heading',
      content: 'useRef Types',
    },
    {
      type: 'example',
      title: 'Typing useRef for DOM elements and mutable values',
      content: 'useRef has two main uses: holding a reference to a DOM element, and storing a mutable value that does not trigger re-renders. For DOM refs, pass the element type as the generic and null as the initial value. For mutable values, pass the value type.',
      language: 'typescript',
      code: `// (React hooks: React.useState, React.useEffect, React.useRef, etc.)

function FocusInput() {
  // DOM ref — must start with null, generic is the element type
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // inputRef.current might be null before mount
    inputRef.current?.focus();
  }, []);

  const handleClick = () => {
    if (inputRef.current) {
      // TypeScript knows it is HTMLInputElement
      inputRef.current.select();
      console.log("Input value:", inputRef.current.value);
    }
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="Auto-focused" />
      <button ref={buttonRef} onClick={handleClick}>Select all</button>
    </div>
  );
}

// Mutable ref — for storing values without re-renders
function Timer() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    intervalRef.current = setInterval(() => console.log("tick"), 1000);
  };

  const stop = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
    }
  };

  return <div><button onClick={start}>Start</button><button onClick={stop}>Stop</button></div>;
}`,
    },
    {
      type: 'example',
      title: 'Typing children — ReactNode and PropsWithChildren',
      content: 'When a component accepts children, type the children prop as React.ReactNode (which includes elements, strings, numbers, arrays, and more). A convenient shortcut is React.PropsWithChildren<YourProps> which automatically adds "children?: React.ReactNode" to your props type.',
      language: 'typescript',
      code: `// (React is globally available)

// Manual children typing
interface CardProps {
  title: string;
  children: React.ReactNode; // elements, strings, arrays — anything renderable
  footer?: React.ReactNode;
}

function Card({ title, children, footer }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="body">{children}</div>
      {footer && <div className="footer">{footer}</div>}
    </div>
  );
}

// Shorthand with PropsWithChildren
interface LayoutProps {
  sidebar: React.ReactNode;
}

function Layout({ children, sidebar }: React.PropsWithChildren<LayoutProps>) {
  return (
    <div className="layout">
      <aside>{sidebar}</aside>
      <main>{children}</main>
    </div>
  );
}

// Usage — TypeScript checks children shape
<Card title="Hello">
  <p>Any React content goes here</p>
</Card>`,
    },
    {
      type: 'tryit',
      title: 'Try It: Typed React Patterns',
      css: `body{font-family:system-ui,sans-serif;padding:20px;} .btn{padding:8px 16px;border:none;border-radius:6px;cursor:pointer;font-size:13px;font-weight:600;margin-right:6px;margin-bottom:6px;} .primary{background:#3b82f6;color:white;} .secondary{background:#e5e7eb;color:#374151;} .danger{background:#ef4444;color:white;} .card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;margin-top:10px;} .result{font-size:13px;color:#374151;margin-top:8px;padding:8px;background:#f0fdf4;border-radius:4px;}`,
      js: `// Typed React patterns — shown in plain JS with React

function Button({ label, onClick, variant, disabled }) {
  return React.createElement('button', {
    className: 'btn ' + (variant || 'primary'),
    onClick: onClick,
    disabled: !!disabled,
  }, label);
}

function TypedForm() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email) setSubmitted(true);
  };

  if (submitted) {
    return React.createElement('div', { className: 'card' },
      React.createElement('p', null, 'Submitted!'),
      React.createElement('p', { className: 'result' }, 'Name: ' + name),
      React.createElement('p', { className: 'result' }, 'Email: ' + email),
      React.createElement(Button, { label: 'Reset', onClick: () => setSubmitted(false), variant: 'secondary' })
    );
  }

  return React.createElement('form', { onSubmit: handleSubmit },
    React.createElement('div', { style: { marginBottom: '10px' } },
      React.createElement('input', {
        style: { padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', marginRight: '8px', fontSize: '13px' },
        value: name,
        onChange: e => setName(e.target.value),
        placeholder: 'Name'
      }),
      React.createElement('input', {
        style: { padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px' },
        value: email,
        onChange: e => setEmail(e.target.value),
        placeholder: 'Email'
      })
    ),
    React.createElement(Button, { label: 'Submit', onClick: () => {}, variant: 'primary' }),
    React.createElement(Button, { label: 'Cancel', onClick: () => {}, variant: 'secondary' }),
    React.createElement(Button, { label: 'Delete', onClick: () => {}, variant: 'danger', disabled: true })
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(TypedForm));`,
    },
  ],
  exercises: [
    {
      id: 'ts-react-1',
      question: 'What type should you use for an input onChange event handler parameter?',
      type: 'multiple-choice',
      options: [
        'Event',
        'React.ChangeEvent<HTMLInputElement>',
        'InputEvent<string>',
        'React.InputEvent',
      ],
      correct: 1,
      explanation: 'React.ChangeEvent<HTMLInputElement> is the correct type for an input onChange handler. It gives you full access to event.target.value as a string and other HTMLInputElement properties. React uses synthetic events, not native DOM events, so use React-specific event types.',
    },
    {
      id: 'ts-react-2',
      question: 'When should you provide an explicit generic to useState?',
      type: 'multiple-choice',
      options: [
        'Always — TypeScript cannot infer useState types',
        'Never — useState always infers correctly',
        'When the initial value does not fully represent the type, like useState<User | null>(null)',
        'Only when using TypeScript 5+',
      ],
      correct: 2,
      explanation: 'TypeScript infers the state type from the initial value. If you pass null, it infers null — not User | null. When the initial value does not represent all possible states, pass the type explicitly: useState<User | null>(null) or useState<string[]>([]).',
    },
  ],
  quiz: [
    {
      id: 'ts-react-q1',
      question: 'What type should you use for a component that accepts any renderable React content as children?',
      options: [
        'React.Component',
        'React.Element',
        'React.ReactNode',
        'JSX.Element',
      ],
      correct: 2,
      explanation: 'React.ReactNode is the broadest type for anything React can render: elements, strings, numbers, arrays, fragments, and null/undefined. Use it for children props and any other prop that accepts arbitrary renderable content. JSX.Element is more specific — only for a single React element.',
    },
  ],
};
