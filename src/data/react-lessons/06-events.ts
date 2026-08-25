import type { ReactLesson } from '../react-curriculum';

export const reactEventsLesson: ReactLesson = {
  id: 'react-events',
  title: 'Events in React',
  slug: 'events',
  chapter: 'core',
  order: 6,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'Learn how to handle user interactions in React - onClick, onChange, onSubmit, synthetic events, preventDefault, and how to pass event handlers as props.',
  sections: [
    {
      type: 'text',
      content: 'React uses a synthetic event system that wraps the browsers native events. You attach event handlers as JSX props using camelCase names like onClick, onChange, and onSubmit. The synthetic event behaves like the native browser event but works consistently across all browsers.',
    },
    {
      type: 'heading',
      content: '1. onClick - Handling Button Clicks',
    },
    {
      type: 'example',
      title: 'Click handlers defined inline and as separate functions',
      content: 'onClick expects a function - not a function call. Writing onClick={handleClick} passes the function itself (correct). Writing onClick={handleClick()} calls the function immediately on render (wrong). For inline handlers with arguments, wrap in an arrow function: onClick={() => handleClick(id)}.',
      language: 'jsx',
      code: `function ClickDemo() {
  // ✅ Named handler function
  function handleClick() {
    alert('Button clicked!');
  }

  // ✅ Inline arrow function - useful for one-liners
  // ✅ Arrow function wrapper - required when passing arguments
  function greet(name) {
    alert('Hello, ' + name + '!');
  }

  return (
    <div>
      {/* Pass the function - do NOT call it */}
      <button onClick={handleClick}>Click me</button>

      {/* Inline arrow function */}
      <button onClick={() => alert('Inline clicked!')}>Inline</button>

      {/* Passing argument - must wrap in arrow function */}
      <button onClick={() => greet('Alice')}>Greet Alice</button>

      {/* ❌ WRONG - this runs greet immediately on render */}
      {/* <button onClick={greet('Alice')}>Wrong</button> */}
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '2. onChange - Handling Input Changes',
    },
    {
      type: 'example',
      title: 'Reading input values via the event object',
      content: 'The onChange event fires every time an input value changes. The handler receives a synthetic event object (e). The current value of the input is at e.target.value. This is how you build controlled inputs - where the React state is always in sync with what the user types.',
      language: 'jsx',
      code: `function InputDemo() {
  const [text, setText] = React.useState('');
  const [number, setNumber] = React.useState(0);
  const [color, setColor] = React.useState('#2563eb');

  return (
    <div>
      {/* Text input */}
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type something..."
      />
      <p>You typed: {text}</p>

      {/* Number input */}
      <input
        type="number"
        value={number}
        onChange={e => setNumber(Number(e.target.value))}
      />
      <p>Double: {number * 2}</p>

      {/* Color input */}
      <input
        type="color"
        value={color}
        onChange={e => setColor(e.target.value)}
      />
      <p style={{ color }}>Colored text ■</p>
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '3. onSubmit and preventDefault',
    },
    {
      type: 'example',
      title: 'Handling form submission and stopping default browser behavior',
      content: 'When a form is submitted, the browsers default behavior is to reload the page and send a GET/POST request. In React, you almost always want to prevent this and handle the submission in JavaScript instead. Call e.preventDefault() at the start of your onSubmit handler to stop the default behavior.',
      language: 'jsx',
      code: `function LoginForm() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');

  function handleSubmit(e) {
    e.preventDefault(); // Stop the browser from reloading the page

    // Now handle the form data in JavaScript
    if (!email || !password) {
      setMessage('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }

    setMessage('Login successful! Welcome, ' + email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Log In</button>
      {message && <p>{message}</p>}
    </form>
  );
}`,
    },
    {
      type: 'heading',
      content: '4. The Synthetic Event Object',
    },
    {
      type: 'example',
      title: 'Properties available on the event object',
      content: 'Every React event handler receives a synthetic event object that wraps the native browser event. It has the same properties and methods as the native event - target, currentTarget, type, key, preventDefault(), stopPropagation(), etc. - but React normalizes them across browsers.',
      language: 'jsx',
      code: `function EventInfoDemo() {
  const [info, setInfo] = React.useState('Click a button to see event info');

  function showEventInfo(e) {
    setInfo(
      'Type: ' + e.type +
      ' | Target: ' + e.target.tagName +
      ' | Text: ' + e.target.textContent
    );
  }

  function handleKeyDown(e) {
    // e.key tells you which key was pressed
    if (e.key === 'Enter') {
      setInfo('Enter key pressed!');
    } else if (e.key === 'Escape') {
      setInfo('Escape key pressed!');
    } else {
      setInfo('Key pressed: ' + e.key);
    }
  }

  function handleMouseMove(e) {
    // e.clientX and e.clientY give cursor position
    setInfo('Mouse at X:' + e.clientX + ' Y:' + e.clientY);
  }

  return (
    <div>
      <p>{info}</p>
      <button onClick={showEventInfo}>Click me</button>
      <input onKeyDown={handleKeyDown} placeholder="Press any key" />
      <div
        onMouseMove={handleMouseMove}
        style={{ width: 200, height: 80, background: '#f3f4f6', borderRadius: 8 }}>
        Move mouse here
      </div>
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '5. Passing Event Handlers as Props',
    },
    {
      type: 'example',
      title: 'Handlers defined in parent, passed to child components',
      content: 'A common pattern is to define the event handler in a parent component (where the state lives) and pass it as a prop to the child. The child just calls the function when the event happens. By convention, handler props are named with the "on" prefix - like onDelete, onSave, onSelect.',
      language: 'jsx',
      code: `// Child component - knows nothing about state
// It just calls the handler prop when clicked
function DeleteButton({ itemId, onDelete }) {
  return (
    <button
      onClick={() => onDelete(itemId)}
      style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }}>
      Delete
    </button>
  );
}

function ItemList() {
  const [items, setItems] = React.useState([
    { id: 1, text: 'First item' },
    { id: 2, text: 'Second item' },
    { id: 3, text: 'Third item' },
  ]);

  // Handler defined where state lives
  function handleDelete(id) {
    setItems(prev => prev.filter(item => item.id !== id));
  }

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.text}
          {/* Pass handler down as a prop */}
          <DeleteButton itemId={item.id} onDelete={handleDelete} />
        </li>
      ))}
    </ul>
  );
}`,
    },
    {
      type: 'tryit',
      title: 'Try It: Interactive Event Handler Demo',
      css: `body { font-family: system-ui, sans-serif; padding: 20px; background: #f8fafc; }
.section { background: white; border-radius: 12px; padding: 20px; margin-bottom: 14px; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
h3 { margin: 0 0 12px; font-size: 14px; font-weight: 700; color: #374151; }
input, textarea { width: 100%; padding: 8px 12px; border: 1.5px solid #e5e7eb; border-radius: 6px; font-size: 14px; outline: none; box-sizing: border-box; }
input:focus, textarea:focus { border-color: #2563eb; }
button { padding: 8px 14px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-top: 8px; }
.preview { margin-top: 8px; padding: 10px; background: #f9fafb; border-radius: 6px; font-size: 13px; color: #374151; min-height: 20px; }
.tag { display: inline-block; padding: 3px 10px; background: #eff6ff; color: #2563eb; border-radius: 999px; font-size: 12px; margin: 2px; }`,
      jsx: `function LiveInput() {
  const [value, setValue] = React.useState('');
  const [submitted, setSubmitted] = React.useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!value.trim()) return;
    setSubmitted(prev => [...prev, value.trim()]);
    setValue('');
  }

  return (
    <div className="section">
      <h3>Form with onSubmit + onChange</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Type a tag and press Enter..."
          style={{ flex: 1 }}
        />
        <button type="submit">Add</button>
      </form>
      <div className="preview" style={{ marginTop: 10 }}>
        {submitted.length === 0
          ? 'No tags yet'
          : submitted.map((t, i) => <span key={i} className="tag">{t}</span>)
        }
      </div>
    </div>
  );
}

function KeyDetector() {
  const [key, setKey] = React.useState('');

  return (
    <div className="section">
      <h3>onKeyDown - Detect Key Presses</h3>
      <input
        onKeyDown={e => {
          e.preventDefault();
          setKey(e.key === ' ' ? 'Space' : e.key);
        }}
        placeholder="Click here and press any key..."
        readOnly
      />
      <div className="preview">
        {key ? 'Last key: ' + key : 'No key pressed yet'}
      </div>
    </div>
  );
}

function ColorPicker() {
  const [color, setColor] = React.useState('#2563eb');
  const [text, setText] = React.useState('Hello, React Events!');

  return (
    <div className="section">
      <h3>onChange - Live Preview</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: 44, padding: 0, border: 'none' }} />
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Enter text..." style={{ flex: 1 }} />
      </div>
      <div className="preview" style={{ color, fontWeight: 700, fontSize: 18 }}>
        {text || 'Type above...'}
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <LiveInput />
      <KeyDetector />
      <ColorPicker />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);`,
    },
  ],
  exercises: [
    {
      id: 'ev-1',
      question: 'What is wrong with: <button onClick={handleClick()}>Click</button>?',
      type: 'multiple-choice',
      options: [
        'Nothing - it works correctly',
        'handleClick() calls the function immediately on render instead of on click',
        'You must use curly braces around the whole expression',
        'onClick does not accept function calls',
      ],
      correct: 1,
      explanation: 'onClick={handleClick()} calls handleClick immediately when React renders the component, not when the user clicks. Use onClick={handleClick} (no parentheses) to pass the function reference.',
    },
    {
      id: 'ev-2',
      question: 'Why do you call e.preventDefault() in a form onSubmit handler?',
      type: 'multiple-choice',
      options: [
        'To stop other event listeners from running',
        'To prevent the browser from reloading the page on form submission',
        'To clear all form fields',
        'To disable the submit button',
      ],
      correct: 1,
      explanation: 'Browsers reload the page by default when a form is submitted. e.preventDefault() stops this default behavior so you can handle the submission with JavaScript instead.',
    },
  ],
  quiz: [
    {
      id: 'req1',
      question: 'How do you pass an argument to an event handler?',
      options: [
        'onClick={handleClick(id)} - call it with the argument',
        'onClick={() => handleClick(id)} - wrap in arrow function',
        'onClick={handleClick, id} - comma-separate',
        'onClick={[handleClick, id]} - use an array',
      ],
      correct: 1,
      explanation: 'When you need to pass an argument to a handler, wrap it in an arrow function: onClick={() => handleClick(id)}. This creates a new function that calls handleClick(id) only when the user clicks.',
    },
  ],
};
