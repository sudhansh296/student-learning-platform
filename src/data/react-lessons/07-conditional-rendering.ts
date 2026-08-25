import type { ReactLesson } from '../react-curriculum';

export const reactConditionalLesson: ReactLesson = {
  id: 'react-conditional',
  title: 'Conditional Rendering',
  slug: 'conditional-rendering',
  chapter: 'core',
  order: 7,
  difficulty: 'beginner',
  readingTime: 11,
  description: 'Master all patterns for showing or hiding UI based on conditions - if/else, ternary, short-circuit &&, switch statements, loading states, and toggling component visibility.',
  sections: [
    {
      type: 'text',
      content: 'React does not have special template directives like v-if or ng-if. Instead you use plain JavaScript - if/else, ternary, and logical && - inside your component functions. Because components are just functions that return JSX, you have the full power of JavaScript for conditional logic.',
    },
    {
      type: 'heading',
      content: '1. if / else Before the Return',
    },
    {
      type: 'example',
      title: 'Returning different JSX based on a condition',
      content: 'The simplest way to conditionally render is with an if statement before the return. If the condition is true, you return one JSX block; otherwise you return another. You can also use early returns - return early if a condition is met, and fall through to the main return at the end.',
      language: 'jsx',
      code: `function UserGreeting({ isLoggedIn, username }) {
  // Early return pattern - handle edge cases first
  if (!username) {
    return <p>Loading user data...</p>;
  }

  // Regular if/else - return completely different JSX
  if (isLoggedIn) {
    return (
      <div>
        <h1>Welcome back, {username}!</h1>
        <button>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Please sign in</h1>
      <button>Login</button>
    </div>
  );
}

// Usage
function App() {
  return (
    <div>
      <UserGreeting isLoggedIn={true} username="Alice" />
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '2. Ternary Operator - Inline Conditional',
    },
    {
      type: 'example',
      title: 'Choosing between two values inline with ternary',
      content: 'The ternary operator (condition ? a : b) is the go-to tool for inline conditional rendering inside JSX. It works anywhere inside {}, including in attributes and content. Keep ternaries simple - if they start getting nested, extract the logic into a separate variable or function.',
      language: 'jsx',
      code: `function StatusBadge({ status }) {
  return (
    <div>
      {/* Ternary for conditional content */}
      <span>{status === 'active' ? '✅ Active' : '❌ Inactive'}</span>

      {/* Ternary for conditional className */}
      <span className={status === 'active' ? 'badge-green' : 'badge-red'}>
        {status}
      </span>

      {/* Ternary for conditional style */}
      <div style={{ color: status === 'active' ? 'green' : 'red' }}>
        Status: {status}
      </div>
    </div>
  );
}

function SubscriptionCard({ plan, daysLeft }) {
  return (
    <div>
      <h3>{plan} Plan</h3>
      {daysLeft > 7
        ? <p style={{ color: 'green' }}>✅ {daysLeft} days remaining</p>
        : <p style={{ color: 'red' }}>⚠️ Expires in {daysLeft} days - renew soon!</p>
      }
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '3. Short-Circuit && - Render or Nothing',
    },
    {
      type: 'example',
      title: 'Using && to optionally show an element',
      content: 'The && operator is perfect when you want to show something or nothing at all. In JavaScript, false && anything evaluates to false, and React renders nothing for false. This is shorter than ternary when you have no "else" case. One pitfall: if the left side is 0 (a number), React renders 0 instead of nothing - always coerce to boolean with !! or > 0.',
      language: 'jsx',
      code: `function Notifications({ count, messages }) {
  return (
    <div>
      {/* Renders nothing when count is 0 or falsy */}
      {count > 0 && (
        <div className="notification-badge">
          {count} new notifications
        </div>
      )}

      {/* ⚠️ Pitfall - 0 is falsy but renders as "0" */}
      {/* {count && <Badge count={count} />}  // renders "0" when count = 0! */}

      {/* ✅ Fix - use count > 0 */}
      {count > 0 && <span className="badge">{count}</span>}

      {/* Showing an empty state */}
      {messages.length === 0 && (
        <p className="empty">No messages yet.</p>
      )}

      {/* Multiple conditions chained */}
      {messages.length > 0 && count > 0 && (
        <p>You have unread messages!</p>
      )}
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '4. Loading States',
    },
    {
      type: 'example',
      title: 'Rendering a spinner while data is loading',
      content: 'A very common pattern in React apps is showing different UI depending on loading, error, and success states. You check each state from top to bottom - if loading, show a spinner; if error, show an error message; otherwise, show the data. This pattern is used constantly when fetching data from APIs.',
      language: 'jsx',
      code: `function DataView({ isLoading, error, data }) {
  // 1. Loading state
  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  // 2. Error state
  if (error) {
    return (
      <div className="error">
        <p>❌ Something went wrong: {error}</p>
        <button>Retry</button>
      </div>
    );
  }

  // 3. Empty state
  if (!data || data.length === 0) {
    return <p className="empty">No data found.</p>;
  }

  // 4. Success state - render the actual content
  return (
    <ul>
      {data.map((item, i) => (
        <li key={i}>{item.name}</li>
      ))}
    </ul>
  );
}

// Using the component
function App() {
  return (
    <div>
      <DataView isLoading={false} error={null} data={[{ name: 'Alice' }, { name: 'Bob' }]} />
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '5. Toggling Visibility',
    },
    {
      type: 'example',
      title: 'Show and hide components with a boolean state',
      content: 'A toggle is simply a boolean state that you flip with !previous. You use this to build accordions, modals, dropdowns, and collapsible sections. The component is mounted and unmounted from the DOM each time (unlike display:none in CSS). To just hide it without unmounting, apply a style instead.',
      language: 'jsx',
      code: `function Accordion({ title, children }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="accordion">
      <button onClick={() => setIsOpen(prev => !prev)}>
        {title} {isOpen ? '▲' : '▼'}
      </button>

      {/* Mounted/unmounted based on isOpen */}
      {isOpen && (
        <div className="accordion-content">
          {children}
        </div>
      )}
    </div>
  );
}

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null; // Nothing rendered when closed

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function App() {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div>
      <Accordion title="FAQ: What is React?">
        <p>React is a JavaScript library for building user interfaces.</p>
      </Accordion>

      <button onClick={() => setShowModal(true)}>Open Modal</button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Hello!">
        <p>This is a modal dialog.</p>
      </Modal>
    </div>
  );
}`,
    },
    {
      type: 'tryit',
      title: 'Try It: Conditional Rendering Patterns',
      css: `body { font-family: system-ui, sans-serif; padding: 20px; background: #f8fafc; }
.card { background: white; border-radius: 12px; padding: 20px; margin-bottom: 14px; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
h3 { margin: 0 0 12px; font-size: 14px; font-weight: 700; color: #374151; }
button { padding: 8px 14px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-right: 6px; }
.btn-red { background: #dc2626; }
.badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; margin-left: 8px; }
.accordion-btn { width: 100%; text-align: left; background: #f9fafb; color: #111; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 16px; display: flex; justify-content: space-between; }
.accordion-body { padding: 12px 16px; background: #f9fafb; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; font-size: 14px; color: #374151; }
.status { padding: 10px 14px; border-radius: 8px; font-size: 14px; font-weight: 600; }`,
      jsx: `function StatusDemo() {
  const [status, setStatus] = React.useState('idle');
  const states = ['idle', 'loading', 'success', 'error'];

  const statusInfo = {
    idle:    { label: 'Idle',    bg: '#f9fafb', color: '#374151' },
    loading: { label: 'Loading…', bg: '#eff6ff', color: '#2563eb' },
    success: { label: '✅ Success!', bg: '#f0fdf4', color: '#16a34a' },
    error:   { label: '❌ Error occurred', bg: '#fef2f2', color: '#dc2626' },
  };

  const info = statusInfo[status];

  return (
    <div className="card">
      <h3>Loading State Pattern</h3>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {states.map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            style={{ background: status === s ? '#1d4ed8' : '#6b7280' }}>
            {s}
          </button>
        ))}
      </div>
      <div className="status" style={{ backgroundColor: info.bg, color: info.color }}>
        {status === 'loading' && <span>⏳ </span>}
        {info.label}
      </div>
    </div>
  );
}

function AccordionDemo() {
  const [open, setOpen] = React.useState(null);

  const items = [
    { id: 1, q: 'What is JSX?', a: 'JSX is a syntax extension for JavaScript that looks like HTML. Babel compiles it to React.createElement() calls.' },
    { id: 2, q: 'What is a component?', a: 'A component is a function that returns JSX. It is a self-contained piece of UI that can receive props and manage its own state.' },
    { id: 3, q: 'What is state?', a: 'State is data owned by a component that can change over time. When state changes, React re-renders the component.' },
  ];

  return (
    <div className="card">
      <h3>FAQ Accordion (toggle visibility)</h3>
      {items.map(item => (
        <div key={item.id} style={{ marginBottom: 6 }}>
          <button className="accordion-btn" onClick={() => setOpen(open === item.id ? null : item.id)}>
            {item.q}
            <span>{open === item.id ? '▲' : '▼'}</span>
          </button>
          {open === item.id && (
            <div className="accordion-body">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function App() {
  return (
    <div>
      <StatusDemo />
      <AccordionDemo />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);`,
    },
  ],
  exercises: [
    {
      id: 'cond-1',
      question: 'What is the risk of writing {count && <Badge />} when count might be 0?',
      type: 'multiple-choice',
      options: [
        'It causes a React error',
        'The component renders twice',
        'React renders the number 0 in the UI instead of nothing',
        'There is no risk - it works correctly',
      ],
      correct: 2,
      explanation: '0 is a falsy number, but React renders 0 as text. The expression 0 && <Badge /> evaluates to 0 (not false), and React puts "0" in the DOM. Fix with count > 0 && <Badge /> to get a boolean.',
    },
    {
      id: 'cond-2',
      question: 'What happens to a component when it goes from rendered to not rendered (e.g. {isOpen && <Modal />})?',
      type: 'multiple-choice',
      options: [
        'It stays in the DOM with display:none',
        'It is unmounted and removed from the DOM',
        'It is hidden but keeps its state',
        'React pauses it',
      ],
      correct: 1,
      explanation: 'When a component goes from truthy to falsy in JSX, React unmounts it - removes it completely from the DOM and destroys its state. To hide without losing state, use a CSS class or style to set display:none instead.',
    },
  ],
  quiz: [
    {
      id: 'rcrq1',
      question: 'Which pattern shows something OR nothing (no else branch)?',
      options: [
        'Ternary: condition ? <A /> : <B />',
        'if/else returning different JSX',
        'Short-circuit: condition && <Component />',
        'A switch statement',
      ],
      correct: 2,
      explanation: 'The && short-circuit is perfect for "show or nothing." condition && <Component /> renders the component when condition is truthy, and renders nothing when it is falsy. Use ternary when you need two different outputs.',
    },
  ],
};
