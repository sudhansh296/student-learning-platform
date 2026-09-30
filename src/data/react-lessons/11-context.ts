import type { ReactLesson } from '../react-curriculum';

export const reactContextLesson: ReactLesson = {
  id: 'react-context',
  title: 'Context API - Global State',
  slug: 'context',
  chapter: 'advanced',
  order: 11,
  difficulty: 'intermediate',
  readingTime: 17,
  description: 'Solve prop drilling with Reacts built-in Context API. Learn createContext, useContext, the Provider pattern, and when to use context vs lifting state.',
  sections: [
    {
      type: 'text',
      content: 'Prop drilling happens when you pass props through many layers of components just to get data to a deeply nested child. Context solves this by creating a "global" value that any component in the tree can read without props being passed through intermediate components.',
    },
    {
      type: 'analogy',
      title: 'Context is like a radio broadcast',
      content: 'Prop drilling is like passing a note from person to person down a long chain. Context is like a radio broadcast - the Provider broadcasts the value and any component that tunes in (calls useContext) receives it directly, no matter how deep it is.',
    },
    {
      type: 'heading',
      content: '1. Creating and Using Context',
    },
    {
      type: 'example',
      title: 'The three steps - createContext, Provider, useContext',
      content: 'Using context requires three things: create a context object with createContext, wrap your component tree in the Provider, then read the value in any child with useContext. The Provider value prop is what all consumers will receive.',
      language: 'jsx',
      code: `// (React hooks available as React.useState, React.useEffect, etc.)

// Step 1: Create the context with a default value
const ThemeContext = createContext('light');

// Step 2: Wrap your tree in the Provider
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Page />
    </ThemeContext.Provider>
  );
}

// Step 3: Read it anywhere with useContext - no props needed!
function Page() {
  return <Navbar />;  // Navbar doesnt even know about theme
}

function Navbar() {
  return <Button />;  // Button doesnt pass theme either
}

function Button() {
  // Reads context directly - skips Page and Navbar entirely
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme === 'dark' ? '#1a1a1a' : '#fff' }}>
      Current theme: {theme}
    </button>
  );
}`,
    },
    {
      type: 'heading',
      content: '2. Context with useState for Dynamic Values',
    },
    {
      type: 'example',
      title: 'Combine context with useState to make values changeable',
      content: 'Static context values are rarely useful. The real power comes from combining context with useState - put the state and setter function into the context so any component can both read and update the global value.',
      language: 'jsx',
      code: `// (React hooks available as React.useState, React.useEffect, etc.)

// Create context for both value and setter
const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

// Custom hook for easy consumption
function useTheme() {
  return useContext(ThemeContext);
}

// Provider component manages the state
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  function toggleTheme() {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Now ANY component can toggle the theme
function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <header style={{ background: theme === 'dark' ? '#111' : '#f8f8f8' }}>
      <button onClick={toggleTheme}>
        Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
      </button>
    </header>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Header />
      <main>Content here</main>
    </ThemeProvider>
  );
}`,
    },
    {
      type: 'heading',
      content: '3. Avoiding Prop Drilling - Practical Example',
    },
    {
      type: 'example',
      title: 'User context - sharing auth state across the app',
      content: 'A common use case is sharing the logged-in user across many components. Without context, you would pass the user prop down through every level. With context, components that need the user can read it directly.',
      language: 'jsx',
      code: `// (React hooks available as React.useState, React.useEffect, etc.)

const UserContext = createContext(null);

function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
}

function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  function login(name) {
    setUser({ name, loggedInAt: new Date().toLocaleTimeString() });
  }

  function logout() {
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// Deep child - no user prop needed
function ProfileBadge() {
  const { user, logout } = useUser();
  if (!user) return null;
  return (
    <div>
      <span>👤 {user.name}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

function LoginForm() {
  const { login } = useUser();
  return (
    <button onClick={() => login('Alice')}>Login as Alice</button>
  );
}

function App() {
  return (
    <UserProvider>
      <ProfileBadge />
      <LoginForm />
    </UserProvider>
  );
}`,
    },
    {
      type: 'heading',
      content: '4. When to Use Context',
    },
    {
      type: 'list',
      title: 'Good use cases for Context',
      items: [
        'Theme (dark/light mode) - needed by many components',
        'Current logged-in user - needed across the whole app',
        'Language/locale - affects text in many places',
        'Shopping cart - referenced by header, cart page, checkout',
        'Feature flags - toggle features globally',
      ],
    },
    {
      type: 'warning',
      title: 'Context is not a replacement for all state',
      content: 'Do not put everything in context. Local state (useState inside a component) is simpler and faster for data that only one component needs. Context re-renders all consumers when the value changes - so avoid putting rapidly-changing values like mouse position into context.',
    },
    {
      type: 'tryit',
      title: 'Try It: Theme Context',
      css: `body { font-family: system-ui, sans-serif; margin: 0; transition: background .3s; }
.app { min-height: 100vh; padding: 20px; transition: background .3s, color .3s; }
.app.dark { background: #111827; color: #f9fafb; }
.app.light { background: #f9fafb; color: #111827; }
.card { border-radius: 12px; padding: 20px; margin-bottom: 16px; transition: background .3s; }
.dark .card { background: #1f2937; border: 1px solid #374151; }
.light .card { background: white; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
button { padding: 8px 16px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; }
.btn-primary { background: #2563eb; color: white; }
.btn-toggle { background: #f59e0b; color: #1a1a1a; }
h2 { margin: 0 0 8px; font-size: 18px; }
p { margin: 0 0 12px; font-size: 14px; opacity: .8; }`,
      jsx: `const ThemeContext = React.createContext({ theme: 'light', toggle: () => {} });

function ThemeProvider({ children }) {
  const [theme, setTheme] = React.useState('light');
  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme(t => t === 'light' ? 'dark' : 'light') }}>
      {children}
    </ThemeContext.Provider>
  );
}

function Header() {
  const { theme, toggle } = React.useContext(ThemeContext);
  return (
    <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2>⚛️ Context Demo</h2>
      <button className="btn-toggle" onClick={toggle}>
        {theme === 'light' ? '🌙 Dark' : '☀️ Light'} Mode
      </button>
    </div>
  );
}

function UserCard({ name, role }) {
  const { theme } = React.useContext(ThemeContext);
  return (
    <div className="card">
      <h2>👤 {name}</h2>
      <p>Role: {role}</p>
      <p style={{ fontSize: 12, opacity: .5 }}>Theme: {theme}</p>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme } = React.useContext(ThemeContext);
  return (
    <div className={"app " + theme}>
      <Header />
      <UserCard name="Alice" role="Developer" />
      <UserCard name="Bob" role="Designer" />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);`,
    },
    {
      type: 'heading',
      content: 'Common mistakes beginners make',
    },
    {
      type: 'list',
      items: [
        'Putting all state in context. Fix: keep local state local and use context only for values many distant components need, such as theme or the current user.',
        'Forgetting to wrap components in the Provider, so useContext returns the default value. Fix: place the Provider above every component that reads the context.',
        'Creating a new object for the value on every render, which re-renders all consumers. Fix: keep the value stable with useMemo, or split rarely changing data into its own context.',
        'Calling useContext outside a function component or hook. Fix: hooks work only inside components and custom hooks.',
        'Using one huge context for unrelated data. Fix: create a few small contexts (theme, auth, cart) so a change re-renders only its own consumers.',
        'Forgetting a helpful default or error when the Provider is missing. Fix: wrap useContext in a custom hook that throws a clear message.',
      ],
    },
    {
      type: 'heading',
      content: 'Where you use this in real projects',
    },
    {
      type: 'list',
      items: [
        'Theme: light or dark mode used by many components.',
        'The logged-in user and their permissions.',
        'Language and locale for a translated site.',
        'A shopping cart count shown in the header and updated from product cards.',
        'Toast or notification systems that any component can trigger.',
        'Settings and feature flags shared across a whole app.',
      ],
    },
    {
      type: 'heading',
      content: 'Practice task: Share a cart count with context',
    },
    {
      type: 'text',
      content: 'The header should show how many items are in the cart, and every product card has an Add to cart button. Finish CartProvider so it keeps a count in state and provides both count and addItem through context.',
    },
    {
      type: 'tryit',
      title: 'Share a cart count with context',
      content: 'Complete the TODO parts of the component, press Run and check the behaviour described below.',
      jsx: `const { createContext, useContext, useState } = React;

const CartContext = createContext(null);

function CartProvider({ children }) {
  // TODO: keep the count in state and provide { count, addItem }
  return (
    <CartContext.Provider value={{ count: 0, addItem: () => {} }}>
      {children}
    </CartContext.Provider>
  );
}

function Header() {
  const { count } = useContext(CartContext);
  return <div className="header">My Shop - Cart: {count}</div>;
}

function ProductCard({ name }) {
  const { addItem } = useContext(CartContext);
  return (
    <div className="card">
      <span>{name}</span>
      <button onClick={addItem}>Add to cart</button>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Header />
      <ProductCard name="Notebook" />
      <ProductCard name="Pen" />
    </CartProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);`,
      css: `body { font-family: system-ui, sans-serif; padding: 20px; }
button { cursor: pointer; }
.header { background: #1e293b; color: #fff; padding: 12px 16px; border-radius: 8px; margin-bottom: 12px; font-weight: 700; }
.card { display: flex; justify-content: space-between; align-items: center; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; margin-bottom: 8px; }
.card button { background: #6366f1; color: #fff; border: 0; border-radius: 6px; padding: 6px 12px; }`,
    },
    {
      type: 'note',
      title: 'Expected result',
      content: 'The header starts with "Cart: 0". Clicking Add to cart on any product increases the number in the header by one.',
    },
    {
      type: 'tip',
      title: 'Hint',
      content: 'Inside CartProvider use const [count, setCount] = useState(0) and const addItem = () => setCount(c => c + 1), then pass value={{ count, addItem }} to the Provider.',
    },
    {
      type: 'example',
      title: 'Solution (try it yourself first)',
      content: 'One possible solution. Yours may look different and still be correct.',
      code: `// In a real project, start with: import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

function CartProvider({ children }) {
  const [count, setCount] = useState(0);
  const addItem = () => setCount((c) => c + 1);

  return (
    <CartContext.Provider value={{ count, addItem }}>
      {children}
    </CartContext.Provider>
  );
}

function Header() {
  const { count } = useContext(CartContext);
  return <div className="header">My Shop - Cart: {count}</div>;
}

function ProductCard({ name }) {
  const { addItem } = useContext(CartContext);
  return (
    <div className="card">
      <span>{name}</span>
      <button onClick={addItem}>Add to cart</button>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <Header />
      <ProductCard name="Notebook" />
      <ProductCard name="Pen" />
    </CartProvider>
  );
}`,
      language: 'jsx',
    },
    {
      type: 'heading',
      content: 'Frequently asked questions',
    },
    {
      type: 'note',
      title: 'What problem does context solve?',
      content: 'Prop drilling: passing a value through many components that do not use it just to reach one that does.',
    },
    {
      type: 'note',
      title: 'Is context a replacement for Redux?',
      content: 'For small and medium apps, often yes, especially for values that rarely change. Bigger apps with complex updates may still prefer a state library.',
    },
    {
      type: 'note',
      title: 'Why do all my components re-render when the context changes?',
      content: 'Every component that calls useContext for that context re-renders when its value changes. Split contexts so components only subscribe to what they need.',
    },
    {
      type: 'note',
      title: 'Can I use more than one context?',
      content: 'Yes. Nest several Providers, one for each concern such as theme, user and cart.',
    },
  ],
  exercises: [
    {
      id: 'ctx-1',
      question: 'What are the three steps to use React Context?',
      type: 'multiple-choice',
      options: [
        'import, export, render',
        'createContext, Provider, useContext',
        'useState, useEffect, useContext',
        'createStore, dispatch, subscribe',
      ],
      correct: 1,
      explanation: 'The three steps are: 1) createContext() to create the context object, 2) wrap your tree with the .Provider component, 3) call useContext() in any consumer component to read the value.',
    },
    {
      id: 'ctx-2',
      question: 'When is Context the wrong tool to use?',
      type: 'multiple-choice',
      options: [
        'When you need to share theme across many components',
        'For local state that only one component needs',
        'For the logged-in user across the whole app',
        'For the current language/locale setting',
      ],
      correct: 1,
      explanation: 'Context adds complexity. If only one component needs a piece of state, useState inside that component is simpler and faster. Use context only when multiple unrelated components need the same data.',
    },
  ],
  quiz: [
    {
      id: 'rctxq1',
      question: 'What problem does React Context primarily solve?',
      options: [
        'Making components render faster',
        'Replacing all useState calls',
        'Prop drilling - passing props through many intermediate components',
        'Fetching data from APIs',
      ],
      correct: 2,
      explanation: 'Context solves prop drilling - the pattern where you must pass props through many intermediate components just to get data to a deeply nested child. With Context, any component can access the value directly without intermediaries needing to pass it along.',
    },
  ],
};
