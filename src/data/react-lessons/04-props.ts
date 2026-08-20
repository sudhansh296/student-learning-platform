import type { ReactLesson } from '../react-curriculum';

export const reactPropsLesson: ReactLesson = {
  id: 'react-props',
  title: 'Props — Passing Data',
  slug: 'props',
  chapter: 'core',
  order: 4,
  difficulty: 'beginner',
  readingTime: 11,
  description: 'Learn how to pass all JavaScript data types as props, understand prop drilling, use PropTypes for runtime type checking, and respect the immutability of props.',
  sections: [
    {
      type: 'text',
      content: 'Props are the primary way to pass data between React components. They flow one way — downward from parent to child. You can pass any JavaScript value as a prop: strings, numbers, booleans, objects, arrays, and even functions. Understanding props well is the foundation of building flexible, reusable components.',
    },
    {
      type: 'heading',
      content: '1. Passing Different Data Types',
    },
    {
      type: 'example',
      title: 'Strings, numbers, booleans, and expressions as props',
      content: 'Strings can be passed with quotes or curly braces. Numbers, booleans, and all other JavaScript values must use curly braces. A boolean prop set to "true" can be written just as the attribute name alone — writing "disabled" is shorthand for "disabled={true}". Omitting a boolean prop means it will be undefined (falsy).',
      language: 'jsx',
      code: `function ProductCard({ name, price, inStock, rating }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>Price: \${price.toFixed(2)}</p>
      <p>Rating: {'⭐'.repeat(Math.round(rating))}</p>
      <p>{inStock ? '✅ In Stock' : '❌ Out of Stock'}</p>
    </div>
  );
}

function App() {
  return (
    <div>
      {/* String with quotes */}
      <ProductCard
        name="React Handbook"
        price={29.99}         // number needs {}
        inStock={true}        // boolean needs {}
        rating={4.5}          // number needs {}
      />

      {/* Shorthand for boolean true */}
      <input type="checkbox" disabled />
      {/* Same as: disabled={true} */}

      {/* Expression as prop */}
      <ProductCard
        name="JS Course"
        price={49.99 * 0.8}   // expression in {}
        inStock={false}
        rating={5}
      />
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '2. Passing Objects and Arrays',
    },
    {
      type: 'example',
      title: 'Objects and arrays as prop values',
      content: 'You can pass objects and arrays as props — they just need curly braces like any other JS value. A common pattern is to define data as an array of objects and pass it to a component. You can also spread an object directly onto a component with the spread operator, which passes each key as a separate prop.',
      language: 'jsx',
      code: `function UserProfile({ user }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>Role: {user.role}</p>
      <p>Skills: {user.skills.join(', ')}</p>
    </div>
  );
}

const alice = {
  name: 'Alice',
  role: 'Developer',
  skills: ['React', 'TypeScript', 'Node.js'],
};

// Pass the whole object as one prop
function App() {
  // Passing as a prop directly
  const result1 = <UserProfile user={alice} />;

  // Spreading — each key becomes its own prop
  // This is equivalent to: name="Alice" role="Developer" skills={[...]}
  // But UserProfile expects a "user" object, so we'd need to match the interface
  
  // Passing array of objects — rendered with map
  const users = [
    { id: 1, name: 'Alice', role: 'Dev', skills: ['React'] },
    { id: 2, name: 'Bob',   role: 'Design', skills: ['Figma', 'CSS'] },
  ];

  return (
    <div>
      {users.map(u => (
        <UserProfile key={u.id} user={u} />
      ))}
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '3. Passing Functions as Props',
    },
    {
      type: 'example',
      title: 'Callbacks — passing functions from parent to child',
      content: 'Functions are first-class values in JavaScript, so you can pass them as props. This is how a child component communicates back to its parent — the parent passes a handler function, the child calls it when something happens. This pattern is called "lifting state up" and keeps data flowing in one direction.',
      language: 'jsx',
      code: `// Parent passes a function down; child calls it
function Button({ label, onClick, variant = 'primary' }) {
  const styles = {
    primary:   { background: '#2563eb', color: 'white' },
    danger:    { background: '#dc2626', color: 'white' },
    secondary: { background: '#f3f4f6', color: '#111' },
  };
  return (
    <button style={{ ...styles[variant], padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
      onClick={onClick}>
      {label}
    </button>
  );
}

function App() {
  function handleSave() {
    alert('Saved!');
  }

  function handleDelete() {
    alert('Deleted!');
  }

  return (
    <div>
      {/* Passing named functions */}
      <Button label="Save" onClick={handleSave} variant="primary" />
      <Button label="Delete" onClick={handleDelete} variant="danger" />

      {/* Passing inline arrow functions */}
      <Button
        label="Cancel"
        onClick={() => alert('Cancelled!')}
        variant="secondary"
      />
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '4. Prop Drilling',
    },
    {
      type: 'example',
      title: 'Passing props through multiple component layers',
      content: 'Prop drilling happens when you need to pass data through several intermediate components that do not use the data themselves — they just pass it down to a deeply nested child. Drilling 2-3 levels is normal. Drilling 5+ levels signals that you might need a context or a state management solution. For now, understanding the pattern is what matters.',
      language: 'jsx',
      code: `// Data starts at App (top level)
// It needs to reach DeepButton (3 levels down)
// Middle components just pass it along — "drilling"

function App() {
  const theme = 'dark';
  return <Layout theme={theme} />;
}

function Layout({ theme }) {
  // Layout does not use theme itself, just passes it down
  return <Sidebar theme={theme} />;
}

function Sidebar({ theme }) {
  // Sidebar does not use theme itself, just passes it down
  return <ThemeButton theme={theme} />;
}

function ThemeButton({ theme }) {
  // This component finally uses the value
  return (
    <button style={{
      background: theme === 'dark' ? '#111' : '#fff',
      color: theme === 'dark' ? '#fff' : '#111',
    }}>
      Toggle theme
    </button>
  );
}

// When drilling gets deep, React Context is the solution
// (covered in a later lesson)`,
    },
    {
      type: 'heading',
      content: '5. Props Are Read-Only (Immutable)',
    },
    {
      type: 'example',
      title: 'Never mutate props — always use state for changes',
      content: 'Props are immutable — a component must never modify the props it receives. This is a core React rule. If a component needs to change data, it should use its own state (useState). Think of props as read-only input, and state as the components own mutable memory. Breaking this rule causes hard-to-debug bugs.',
      language: 'jsx',
      code: `// ❌ WRONG — never mutate props
function BadCounter({ count }) {
  function increment() {
    count++; // This mutates the prop — do NOT do this!
    // React will not re-render because it doesnt know about this change
  }
  return <button onClick={increment}>{count}</button>;
}

// ✅ CORRECT — use state for values that change
function GoodCounter({ initialCount }) {
  const [count, setCount] = React.useState(initialCount);

  function increment() {
    setCount(count + 1); // updates internal state, triggers re-render
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

// Props come in, state changes happen internally
// Parent controls the initial value via props
// Component controls changes via state
function App() {
  return <GoodCounter initialCount={0} />;
}`,
    },
    {
      type: 'tryit',
      title: 'Try It: Props in Action',
      css: `body { font-family: system-ui, sans-serif; padding: 24px; background: #f8fafc; }
.product-grid { display: flex; flex-wrap: wrap; gap: 16px; }
.product { background: white; border-radius: 12px; padding: 16px; width: 180px; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
.product-emoji { font-size: 36px; margin-bottom: 8px; }
.product-name { font-size: 15px; font-weight: 700; color: #111; margin: 0 0 4px; }
.product-price { font-size: 18px; font-weight: 800; color: #2563eb; margin: 0 0 8px; }
.stock-badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 700; }
.add-btn { width: 100%; margin-top: 10px; padding: 8px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; }
.add-btn:disabled { background: #d1d5db; cursor: not-allowed; }`,
      jsx: `function StockBadge({ inStock }) {
  return (
    <span className="stock-badge" style={{
      backgroundColor: inStock ? '#f0fdf4' : '#fef2f2',
      color: inStock ? '#16a34a' : '#dc2626',
    }}>
      {inStock ? 'In Stock' : 'Out of Stock'}
    </span>
  );
}

function ProductCard({ emoji, name, price, inStock, onAddToCart }) {
  return (
    <div className="product">
      <div className="product-emoji">{emoji}</div>
      <p className="product-name">{name}</p>
      <p className="product-price">\${price.toFixed(2)}</p>
      <StockBadge inStock={inStock} />
      <button
        className="add-btn"
        disabled={!inStock}
        onClick={() => onAddToCart(name, price)}
      >
        {inStock ? 'Add to Cart' : 'Unavailable'}
      </button>
    </div>
  );
}

function App() {
  const products = [
    { id: 1, emoji: '📘', name: 'React Book',      price: 29.99, inStock: true  },
    { id: 2, emoji: '🎧', name: 'JS Audiobook',    price: 19.99, inStock: true  },
    { id: 3, emoji: '🖥️', name: 'Web Dev Course',  price: 49.99, inStock: false },
    { id: 4, emoji: '🎨', name: 'CSS Masterclass', price: 24.99, inStock: true  },
  ];

  function handleAddToCart(name, price) {
    alert(name + ' ($' + price.toFixed(2) + ') added to cart!');
  }

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Shop</h2>
      <div className="product-grid">
        {products.map(p => (
          <ProductCard
            key={p.id}
            emoji={p.emoji}
            name={p.name}
            price={p.price}
            inStock={p.inStock}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);`,
    },
  ],
  exercises: [
    {
      id: 'props-1',
      question: 'What happens if you try to modify a prop directly inside a component?',
      type: 'multiple-choice',
      options: [
        'React updates the UI immediately',
        'The parent component is notified',
        'The UI does not update because React doesnt know about the change',
        'A TypeScript error is thrown at build time',
      ],
      correct: 2,
      explanation: 'Props are read-only. If you mutate them directly, React has no way to know the value changed, so it wont trigger a re-render. For mutable values, always use useState inside the component.',
    },
    {
      id: 'props-2',
      question: 'How do you pass a number as a prop?',
      type: 'multiple-choice',
      options: [
        'count="42"',
        'count=42',
        'count={42}',
        'count=(42)',
      ],
      correct: 2,
      explanation: 'Non-string values (numbers, booleans, objects, arrays, expressions) must be passed inside curly braces: count={42}. Using quotes like count="42" passes the string "42", not the number 42.',
    },
  ],
  quiz: [
    {
      id: 'rpq1',
      question: 'What is "prop drilling"?',
      options: [
        'A technique to speed up prop passing',
        'Passing props through multiple intermediate components that dont use them',
        'Destructuring deeply nested props',
        'Setting default values for props',
      ],
      correct: 1,
      explanation: 'Prop drilling is when you pass data through several component layers just to get it to a deeply nested child. The intermediate components do not use the data — they just forward it. Deep drilling (5+ levels) is a sign to reach for React Context.',
    },
  ],
};
