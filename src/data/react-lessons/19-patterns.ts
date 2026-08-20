import type { ReactLesson } from '../react-curriculum';

export const reactPatternsLesson: ReactLesson = {
  id: 'react-patterns',
  title: 'React Patterns',
  slug: 'patterns',
  chapter: 'advanced',
  order: 19,
  difficulty: 'advanced',
  readingTime: 16,
  description: 'Master advanced React patterns: composition over inheritance, render props, compound components, higher-order components, and controlled vs uncontrolled components.',
  sections: [
    {
      type: 'text',
      content: 'React patterns are reusable solutions to common design problems. Understanding them helps you write more flexible, reusable components and lets you recognize these patterns in popular libraries like React Router, Formik, and React Hook Form.',
    },
    {
      type: 'heading',
      content: '1. Composition Over Inheritance',
    },
    {
      type: 'example',
      title: 'Use composition — components inside components — instead of extending classes',
      content: 'React favors composition over class inheritance. Instead of extending a BaseCard class, you compose components by passing children and props. This is more flexible because you can compose behavior from multiple sources.',
      language: 'jsx',
      code: `// ❌ Inheritance approach (not the React way)
class BaseCard extends Component { render() { ... } }
class UserCard extends BaseCard { ... }
class ProductCard extends BaseCard { ... }

// ✅ Composition approach — the React way
// Generic Card accepts whatever children you give it
function Card({ title, children, footer, color = '#2563eb' }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ background: color, color: 'white', padding: '12px 16px' }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
      </div>
      <div style={{ padding: 16 }}>
        {children}
      </div>
      {footer && (
        <div style={{ padding: '10px 16px', borderTop: '1px solid #e5e7eb', background: '#f9fafb' }}>
          {footer}
        </div>
      )}
    </div>
  );
}

// Compose specific cards using the generic Card
function UserCard({ user }) {
  return (
    <Card title={user.name} footer={<button>Message</button>}>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </Card>
  );
}

function ProductCard({ product }) {
  return (
    <Card title={product.name} color="#7c3aed" footer={<button>Add to Cart</button>}>
      <p>{product.price}</p>
      <p>{product.description}</p>
    </Card>
  );
}`,
    },
    {
      type: 'heading',
      content: '2. Render Props Pattern',
    },
    {
      type: 'example',
      title: 'Share behavior by passing a render function as a prop',
      content: 'The render props pattern passes a function as a prop. The component calls this function with its internal state, letting the parent control what gets rendered while the child provides the logic. This is how React Router\'s Route component worked before hooks.',
      language: 'jsx',
      code: `// (React hooks available as React.useState, React.useEffect, etc.)

// MouseTracker provides mouse position logic
// but lets the parent decide what to render with that data
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function handleMouseMove(e) {
    setPosition({ x: e.clientX, y: e.clientY });
  }

  return (
    <div style={{ height: 200, border: '1px solid #e5e7eb' }}
      onMouseMove={handleMouseMove}>
      {/* Call the render prop with internal data */}
      {render(position)}
    </div>
  );
}

// Usage — parent decides how to render the position
function App() {
  return (
    <>
      {/* Render as coordinates */}
      <MouseTracker
        render={({ x, y }) => <p>Mouse: {x}, {y}</p>}
      />

      {/* Render as a following dot */}
      <MouseTracker
        render={({ x, y }) => (
          <div style={{
            width: 20, height: 20, borderRadius: '50%',
            background: 'red', position: 'absolute',
            left: x - 10, top: y - 10, pointerEvents: 'none'
          }} />
        )}
      />
    </>
  );
}

// Note: custom hooks mostly replaced render props in modern React
// Render props are still useful in libraries and for backwards compatibility`,
    },
    {
      type: 'heading',
      content: '3. Compound Components',
    },
    {
      type: 'example',
      title: 'Multiple components that work together as a system',
      content: 'Compound components are a group of components that work together while sharing implicit state through Context. The parent component manages state and its children are designed to work inside it. You see this pattern in libraries like React Select and Radix UI.',
      language: 'jsx',
      code: `// (React hooks available as React.useState, React.useEffect, etc.)

const TabsContext = createContext(null);

// Parent — manages state
function Tabs({ children, defaultTab = 0 }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

// Child — Tab buttons
function TabList({ children }) {
  return <div style={{ display: 'flex', borderBottom: '2px solid #e5e7eb' }}>{children}</div>;
}

function Tab({ children, index }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === index;
  return (
    <button
      onClick={() => setActiveTab(index)}
      style={{
        padding: '10px 16px',
        border: 'none',
        borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
        marginBottom: -2,
        cursor: 'pointer',
        fontWeight: isActive ? 700 : 400,
        color: isActive ? '#2563eb' : '#6b7280',
        background: 'none',
      }}>
      {children}
    </button>
  );
}

// Child — Panel content
function TabPanel({ children, index }) {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== index) return null;
  return <div style={{ padding: 16 }}>{children}</div>;
}

// Attach children as static properties
Tabs.List  = TabList;
Tabs.Tab   = Tab;
Tabs.Panel = TabPanel;

// Clean, expressive API
function App() {
  return (
    <Tabs defaultTab={0}>
      <Tabs.List>
        <Tabs.Tab index={0}>Profile</Tabs.Tab>
        <Tabs.Tab index={1}>Settings</Tabs.Tab>
        <Tabs.Tab index={2}>History</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel index={0}><p>Profile content here</p></Tabs.Panel>
      <Tabs.Panel index={1}><p>Settings content here</p></Tabs.Panel>
      <Tabs.Panel index={2}><p>History content here</p></Tabs.Panel>
    </Tabs>
  );
}`,
    },
    {
      type: 'heading',
      content: '4. Controlled vs Uncontrolled Components',
    },
    {
      type: 'example',
      title: 'Controlled — React owns the value; Uncontrolled — DOM owns the value',
      content: 'Controlled components store form values in React state (value + onChange). Uncontrolled components let the DOM manage the value and you read it when needed via a ref. Controlled gives you more control; uncontrolled is simpler for simple forms.',
      language: 'jsx',
      code: `// (React hooks available as React.useState, React.useEffect, etc.)

// CONTROLLED — React state drives the input
function ControlledForm() {
  const [email, setEmail] = useState('');

  // Can validate, transform, or block input in real time
  function handleChange(e) {
    setEmail(e.target.value.toLowerCase()); // force lowercase
  }

  function handleSubmit() {
    console.log('Email:', email); // always up-to-date
  }

  return (
    <div>
      <input
        value={email}           // state controls the displayed value
        onChange={handleChange} // every keystroke updates state
        placeholder="Controlled input"
      />
      <p>Live: {email}</p>      {/* instant reflection */}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

// UNCONTROLLED — DOM manages the input
function UncontrolledForm() {
  const emailRef = useRef(null);

  function handleSubmit() {
    // Read value only when needed — no state needed
    console.log('Email:', emailRef.current.value);
  }

  return (
    <div>
      <input
        ref={emailRef}          // attach ref — no value/onChange needed
        defaultValue="alice@example.com"  // initial value only
        placeholder="Uncontrolled input"
      />
      {/* No live preview — DOM manages state */}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}`,
    },
    {
      type: 'tryit',
      title: 'Try It: Compound Tabs Component',
      css: `body { font-family: system-ui, sans-serif; padding: 20px; background: #f8fafc; }
.tabs { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,.06); overflow: hidden; }
.tab-list { display: flex; border-bottom: 2px solid #e5e7eb; background: #f9fafb; }
.tab-btn { padding: 12px 20px; border: none; background: none; cursor: pointer; font-weight: 600; font-size: 14px; color: #6b7280; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all .15s; }
.tab-btn.active { color: #2563eb; border-bottom-color: #2563eb; background: white; }
.tab-btn:hover:not(.active) { color: #374151; }
.panel { padding: 20px; min-height: 120px; }
h3 { margin: 0 0 10px; color: #1e293b; font-size: 15px; }
p { color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 8px; }
.stat { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
.stat:last-child { border-bottom: none; }`,
      jsx: `const TabsCtx = React.createContext(null);

function Tabs({ children, defaultTab = 0 }) {
  const [active, setActive] = React.useState(defaultTab);
  return (
    <TabsCtx.Provider value={{ active, setActive }}>
      <div className="tabs">{children}</div>
    </TabsCtx.Provider>
  );
}

function TabList({ children }) {
  return <div className="tab-list">{children}</div>;
}

function Tab({ children, index }) {
  const { active, setActive } = React.useContext(TabsCtx);
  return (
    <button className={"tab-btn" + (active === index ? " active" : "")}
      onClick={() => setActive(index)}>
      {children}
    </button>
  );
}

function TabPanel({ children, index }) {
  const { active } = React.useContext(TabsCtx);
  if (active !== index) return null;
  return <div className="panel">{children}</div>;
}

function App() {
  return (
    <Tabs defaultTab={0}>
      <TabList>
        <Tab index={0}>👤 Profile</Tab>
        <Tab index={1}>📊 Stats</Tab>
        <Tab index={2}>⚙️ Settings</Tab>
      </TabList>
      <TabPanel index={0}>
        <h3>User Profile</h3>
        <p>Name: Alice Johnson</p>
        <p>Role: Senior Developer</p>
        <p>Location: San Francisco, CA</p>
      </TabPanel>
      <TabPanel index={1}>
        <h3>Activity Stats</h3>
        <div className="stat"><span>Projects</span><strong>24</strong></div>
        <div className="stat"><span>Commits</span><strong>1,847</strong></div>
        <div className="stat"><span>Reviews</span><strong>312</strong></div>
      </TabPanel>
      <TabPanel index={2}>
        <h3>Account Settings</h3>
        <p>Theme: Dark Mode</p>
        <p>Notifications: Email only</p>
        <p>Language: English</p>
      </TabPanel>
    </Tabs>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);`,
    },
  ],
  exercises: [
    {
      id: 'patterns-1',
      question: 'In the compound components pattern, how do child components access the parent\'s shared state?',
      type: 'multiple-choice',
      options: [
        'Through direct props from the parent',
        'Through React Context provided by the parent component',
        'Through a global Redux store',
        'Through CSS class names',
      ],
      correct: 1,
      explanation: 'Compound components use React Context internally. The parent component creates a Context and provides state through it. Child components (Tab, TabPanel, etc.) read from that Context with useContext. Users of the compound component dont need to manage this — it happens automatically.',
    },
    {
      id: 'patterns-2',
      question: 'What is the main difference between controlled and uncontrolled components?',
      type: 'multiple-choice',
      options: [
        'Controlled components use class components; uncontrolled use function components',
        'Controlled means React state drives the value; uncontrolled means the DOM manages it',
        'Controlled components cannot be submitted; uncontrolled ones can',
        'There is no practical difference',
      ],
      correct: 1,
      explanation: 'In a controlled component, the input\'s value is driven by React state (value={state}) and updated via onChange. React always knows the current value. In an uncontrolled component, the DOM owns the value and you read it with a ref when needed (e.g., on submit). Controlled gives more control; uncontrolled is simpler for basic forms.',
    },
  ],
  quiz: [
    {
      id: 'rpattq1',
      question: 'Why does React favor composition over inheritance?',
      options: [
        'Because JavaScript doesnt support class inheritance',
        'Because inheritance creates rigid hierarchies; composition is more flexible and allows reusing logic from multiple sources',
        'Because composition is faster than inheritance',
        'Because React.Component was removed in React 18',
      ],
      correct: 1,
      explanation: 'Class inheritance creates tight coupling — child classes depend on parent internals. With composition, you build components by combining smaller pieces. React provides two composition mechanisms: children props (pass JSX into a component) and specialization (one component renders another with specific props). This is more flexible because you can compose from multiple sources simultaneously.',
    },
  ],
};
