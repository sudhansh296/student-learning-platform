import type { ReactLesson } from '../react-curriculum';

export const reactComponentsLesson: ReactLesson = {
  id: 'react-components',
  title: 'Components - Building Blocks',
  slug: 'components',
  chapter: 'core',
  order: 3,
  difficulty: 'beginner',
  readingTime: 12,
  description: 'Master React function components - how to create them, pass props, use the children prop, compose multiple components together, and follow PascalCase naming conventions.',
  sections: [
    {
      type: 'text',
      content: 'A component is a self-contained piece of UI. Think of your app as a tree of components: an App at the top, then a Navbar, Sidebar, and Content, and inside Content maybe a list of Cards. Each component handles its own appearance and logic. You build complex UIs by composing simple components together.',
    },
    {
      type: 'heading',
      content: '1. Function Components',
    },
    {
      type: 'example',
      title: 'Defining and using a function component',
      content: 'A function component is a plain JavaScript function whose name starts with a capital letter and returns JSX. The capital letter is mandatory - React uses it to tell apart custom components (capitalized) from plain HTML tags (lowercase). You use the component just like an HTML tag in your JSX.',
      language: 'jsx',
      code: `// A minimal function component
function Greeting() {
  return <h1>Hello, world!</h1>;
}

// Arrow function style (same thing, different syntax)
const Greeting = () => {
  return <h1>Hello, world!</h1>;
};

// Use it like an HTML tag
function App() {
  return (
    <div>
      <Greeting />
      <Greeting />
      <Greeting />
    </div>
  );
}

// lowercase = HTML element, Capitalized = React component
// <div>  → creates a real HTML div
// <Greeting /> → calls the Greeting function and renders its output`,
    },
    {
      type: 'heading',
      content: '2. Props - Passing Data to Components',
    },
    {
      type: 'example',
      title: 'Receiving props as a parameter object',
      content: 'Props (properties) are how you pass data into a component from its parent. The component receives all passed attributes as a single "props" object. You access individual values like props.name, props.age, etc. Props make a component reusable - the same component can show different content depending on what props you give it.',
      language: 'jsx',
      code: `// Props come in as one object - access with props.xxx
function UserCard(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>Age: {props.age}</p>
      <p>Email: {props.email}</p>
    </div>
  );
}

// Pass props like HTML attributes
function App() {
  return (
    <div>
      <UserCard name="Alice" age={28} email="alice@example.com" />
      <UserCard name="Bob"   age={34} email="bob@example.com" />
    </div>
  );
}

// Strings use quotes, numbers/booleans/expressions use {}
// name="Alice"  → string
// age={28}      → number
// active={true} → boolean`,
    },
    {
      type: 'heading',
      content: '3. Destructuring Props',
    },
    {
      type: 'example',
      title: 'Destructuring props for cleaner code',
      content: 'Instead of writing props.name and props.age everywhere, you can destructure the props object directly in the function parameter. This is the most common pattern in real React code - it is shorter, cleaner, and makes it obvious which props a component needs.',
      language: 'jsx',
      code: `// Without destructuring - verbose
function Badge(props) {
  return <span className={props.type}>{props.label}</span>;
}

// With destructuring - clean and explicit
function Badge({ type, label }) {
  return <span className={type}>{label}</span>;
}

// With default values in the destructure
function Avatar({ src, alt = 'User avatar', size = 48 }) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      style={{ borderRadius: '50%' }}
    />
  );
}

// Components using Avatar
function App() {
  return (
    <div>
      <Avatar src="/alice.jpg" alt="Alice" size={64} />
      <Avatar src="/bob.jpg" />   {/* uses default alt and size */}
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '4. The children Prop',
    },
    {
      type: 'example',
      title: 'Wrapping content with children',
      content: 'When you put content between opening and closing component tags, React automatically passes that content as the "children" prop. This is how you build wrapper or container components - like a Card, Modal, or Panel - that do not need to know what they will contain ahead of time.',
      language: 'jsx',
      code: `// Card component that wraps any content
function Card({ title, children }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
      {title && <h3 style={{ marginTop: 0 }}>{title}</h3>}
      {children}
    </div>
  );
}

// Section wrapper - just adds a title and padding
function Section({ title, children }) {
  return (
    <section>
      <h2>{title}</h2>
      <div className="section-content">
        {children}
      </div>
    </section>
  );
}

// Using them - pass anything as children
function App() {
  return (
    <Section title="Latest Posts">
      <Card title="React Tips">
        <p>Always destructure your props for clarity.</p>
        <button>Read more</button>
      </Card>

      <Card>
        {/* No title prop - the {title && ...} skips rendering it */}
        <img src="/banner.jpg" alt="Banner" />
        <p>An image card with no title.</p>
      </Card>
    </Section>
  );
}`,
    },
    {
      type: 'heading',
      content: '5. Composing Components',
    },
    {
      type: 'example',
      title: 'Building a page from many small components',
      content: 'Component composition is the heart of React. You build small, focused components and combine them into larger ones. A Navbar is composed of Logo and NavLinks. A ProductPage is composed of Navbar, ProductGallery, and ReviewList. This makes each piece testable and reusable in isolation.',
      language: 'jsx',
      code: `// Small, focused components
function Logo() {
  return <span style={{ fontWeight: 800, fontSize: 20 }}>⚛️ MyApp</span>;
}

function NavLink({ href, children }) {
  return <a href={href} style={{ marginLeft: 16, color: '#374151' }}>{children}</a>;
}

// Composed from smaller pieces
function Navbar() {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', padding: '12px 24px', background: 'white', borderBottom: '1px solid #e5e7eb' }}>
      <Logo />
      <div style={{ marginLeft: 'auto' }}>
        <NavLink href="/about">About</NavLink>
        <NavLink href="/docs">Docs</NavLink>
        <NavLink href="/blog">Blog</NavLink>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <div style={{ padding: '60px 24px', textAlign: 'center' }}>
      <h1>Welcome to MyApp</h1>
      <p>Built with composable React components.</p>
    </div>
  );
}

// The full page - assembled from parts
function App() {
  return (
    <div>
      <Navbar />
      <Hero />
    </div>
  );
}`,
    },
    {
      type: 'tryit',
      title: 'Try It: Build a Profile Card Component',
      css: `body { font-family: system-ui, sans-serif; padding: 24px; background: #f0f4ff; }
.page-title { font-size: 13px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 16px; }
.cards { display: flex; flex-wrap: wrap; gap: 16px; }
.card { background: white; border-radius: 16px; padding: 20px; width: 200px; box-shadow: 0 2px 12px rgba(0,0,0,.08); }
.avatar { font-size: 40px; margin-bottom: 10px; }
.card-name { font-size: 16px; font-weight: 700; color: #111; margin: 0 0 4px; }
.card-title { font-size: 12px; color: #6b7280; margin: 0 0 12px; }
.tag { display: inline-block; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 700; margin: 2px; }`,
      jsx: `function Tag({ label, color }) {
  const colors = {
    blue:   { bg: '#eff6ff', text: '#1d4ed8' },
    green:  { bg: '#f0fdf4', text: '#16a34a' },
    purple: { bg: '#faf5ff', text: '#7c3aed' },
    orange: { bg: '#fff7ed', text: '#c2410c' },
  };
  const c = colors[color] || colors.blue;
  return (
    <span className="tag" style={{ backgroundColor: c.bg, color: c.text }}>
      {label}
    </span>
  );
}

function ProfileCard({ emoji, name, title, tags }) {
  return (
    <div className="card">
      <div className="avatar">{emoji}</div>
      <p className="card-name">{name}</p>
      <p className="card-title">{title}</p>
      <div>
        {tags.map((tag, i) => (
          <Tag key={i} label={tag.label} color={tag.color} />
        ))}
      </div>
    </div>
  );
}

function App() {
  const team = [
    {
      emoji: '👩‍💻', name: 'Alice Chen', title: 'Frontend Dev',
      tags: [{ label: 'React', color: 'blue' }, { label: 'CSS', color: 'purple' }],
    },
    {
      emoji: '🧑‍🔬', name: 'Bob Smith', title: 'Backend Dev',
      tags: [{ label: 'Node.js', color: 'green' }, { label: 'SQL', color: 'orange' }],
    },
    {
      emoji: '🎨', name: 'Carol Lee', title: 'UI Designer',
      tags: [{ label: 'Figma', color: 'purple' }, { label: 'CSS', color: 'blue' }],
    },
  ];

  return (
    <div>
      <p className="page-title">Our Team</p>
      <div className="cards">
        {team.map((member, i) => (
          <ProfileCard key={i} {...member} />
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
      id: 'comp-1',
      question: 'Why must React component names start with a capital letter?',
      type: 'multiple-choice',
      options: [
        'It is just a style convention with no functional effect',
        'React uses the capital letter to distinguish custom components from HTML tags',
        'Capital letters make components faster',
        'Only class components need capitals',
      ],
      correct: 1,
      explanation: 'React uses the capitalization to decide what to render. Lowercase names like <div> are treated as native HTML elements. Capitalized names like <Button> are treated as React components and the function is called.',
    },
    {
      id: 'comp-2',
      question: 'What is the "children" prop?',
      type: 'multiple-choice',
      options: [
        'An array of all components in the app',
        'Content passed between opening and closing component tags',
        'A list of child routes',
        'Sub-components defined inside a parent component',
      ],
      correct: 1,
      explanation: 'When you write <Card>Hello!</Card>, React passes "Hello!" as props.children to the Card component. This lets you build wrapper/container components that accept arbitrary content.',
    },
  ],
  quiz: [
    {
      id: 'rcq1',
      question: 'Which is the cleanest way to access props in a function component?',
      options: [
        'Using this.props.name',
        'Using window.props.name',
        'Destructuring: function Card({ name, age })',
        'Using getProps().name',
      ],
      correct: 2,
      explanation: 'Destructuring props directly in the function signature is the most idiomatic pattern. It makes the component API explicit and keeps the function body clean. this.props belongs to older class components.',
    },
  ],
};
