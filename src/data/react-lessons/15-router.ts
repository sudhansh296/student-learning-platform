import type { ReactLesson } from '../react-curriculum';

export const reactRouterLesson: ReactLesson = {
  id: 'react-router',
  title: 'React Router',
  slug: 'router',
  chapter: 'patterns',
  order: 15,
  difficulty: 'intermediate',
  readingTime: 14,
  description: 'Add client-side routing to React apps with React Router. Learn BrowserRouter, Routes, Route, Link, NavLink, useNavigate, useParams, nested routes, and 404 handling.',
  sections: [
    {
      type: 'text',
      content: 'React Router is the standard library for routing in React apps. Routing means showing different components based on the URL - so /home shows the home page, /about shows the about page, etc. React Router handles this entirely on the client side without full page reloads.',
    },
    {
      type: 'heading',
      content: '1. Installation and Basic Setup',
    },
    {
      type: 'example',
      title: 'Installing React Router and creating basic routes',
      content: 'Install react-router-dom, wrap your app in BrowserRouter, then use Routes and Route to define which component renders for each URL path. Link replaces anchor tags for navigation - it updates the URL without a full page reload.',
      language: 'jsx',
      code: `// Install: npm install react-router-dom

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home()  { return <h1>Home Page</h1>; }
function About() { return <h1>About Page</h1>; }
function Blog()  { return <h1>Blog Page</h1>; }

function Navbar() {
  return (
    <nav>
      {/* Link updates URL without page reload */}
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/blog">Blog</Link>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Route maps a URL path to a component */}
        <Route path="/"      element={<Home />}  />
        <Route path="/about" element={<About />} />
        <Route path="/blog"  element={<Blog />}  />
        
        {/* 404 - catches any unmatched route */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}`,
    },
    {
      type: 'heading',
      content: '2. NavLink - Active Link Styling',
    },
    {
      type: 'example',
      title: 'NavLink adds an active class automatically',
      content: 'NavLink is like Link but automatically adds an "active" class (or style) when the current URL matches its to prop. This makes navigation highlighting easy without manual tracking.',
      language: 'jsx',
      code: `import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ display: 'flex', gap: 16 }}>
      {/* className can be a function that receives { isActive } */}
      <NavLink
        to="/"
        className={({ isActive }) => isActive ? 'nav-active' : 'nav-link'}
      >
        Home
      </NavLink>

      {/* style prop also works as a function */}
      <NavLink
        to="/about"
        style={({ isActive }) => ({
          color: isActive ? '#2563eb' : '#6b7280',
          fontWeight: isActive ? 700 : 400,
          textDecoration: 'none',
        })}
      >
        About
      </NavLink>

      {/* end prop prevents "/" from matching "/about" etc */}
      <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
        Home (exact)
      </NavLink>
    </nav>
  );
}`,
    },
    {
      type: 'heading',
      content: '3. URL Params with useParams',
    },
    {
      type: 'example',
      title: 'Dynamic segments with :param syntax and useParams hook',
      content: 'Prefix a route segment with : to make it dynamic. useParams returns an object with all the dynamic segments from the current URL. Use this for product pages, user profiles, or any URL with an ID.',
      language: 'jsx',
      code: `import { Routes, Route, useParams, Link } from 'react-router-dom';

// Posts data (normally from an API)
const posts = [
  { id: 1, title: 'Hello React', body: 'First post!' },
  { id: 2, title: 'Router Guide', body: 'Routing is easy.' },
];

function PostList() {
  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(p => (
        <div key={p.id}>
          <Link to={"/posts/" + p.id}>{p.title}</Link>
        </div>
      ))}
    </div>
  );
}

function PostDetail() {
  // useParams reads the :id segment from the URL
  const { id } = useParams();
  const post = posts.find(p => p.id === Number(id));

  if (!post) return <h2>Post not found</h2>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <Link to="/posts">← Back to list</Link>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/posts"     element={<PostList />}   />
      <Route path="/posts/:id" element={<PostDetail />} />
    </Routes>
  );
}`,
    },
    {
      type: 'heading',
      content: '4. useNavigate - Programmatic Navigation',
    },
    {
      type: 'example',
      title: 'Navigate programmatically after actions like form submit',
      content: 'useNavigate returns a function you can call to navigate programmatically - useful after form submission, login, or any action that should redirect the user. Pass -1 to go back like a browser back button.',
      language: 'jsx',
      code: `import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError]  = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    
    const success = await loginUser(email);
    
    if (success) {
      // Navigate to dashboard after successful login
      navigate('/dashboard');
    } else {
      setError('Login failed');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Login</button>

      {/* Go back without knowing the previous URL */}
      <button type="button" onClick={() => navigate(-1)}>Back</button>

      {/* Navigate with replace - removes current page from history */}
      <button type="button" onClick={() => navigate('/home', { replace: true })}>
        Go Home (no back history)
      </button>
    </form>
  );
}`,
    },
    {
      type: 'heading',
      content: '5. Nested Routes',
    },
    {
      type: 'example',
      title: 'Nested routes render child routes inside parent layouts',
      content: 'Nest Route components to create layouts that wrap sub-pages. The parent renders an Outlet component where child routes appear. Great for dashboard layouts with a shared sidebar.',
      language: 'jsx',
      code: `import { Routes, Route, Outlet, Link } from 'react-router-dom';

// Dashboard layout - shared for all dashboard/* pages
function DashboardLayout() {
  return (
    <div style={{ display: 'flex', gap: 20 }}>
      <nav>
        <Link to="overview">Overview</Link>
        <Link to="analytics">Analytics</Link>
        <Link to="settings">Settings</Link>
      </nav>
      <main>
        {/* Child routes render here */}
        <Outlet />
      </main>
    </div>
  );
}

function Overview()  { return <h2>Overview</h2>; }
function Analytics() { return <h2>Analytics</h2>; }
function Settings()  { return <h2>Settings</h2>; }

function App() {
  return (
    <Routes>
      <Route path="dashboard" element={<DashboardLayout />}>
        {/* These render inside DashboardLayout's Outlet */}
        <Route index       element={<Overview />}  />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings"  element={<Settings />}  />
      </Route>
    </Routes>
  );
}`,
    },
    {
      type: 'tryit',
      title: 'Try It: Simulated Tab Router',
      css: `body { font-family: system-ui, sans-serif; margin: 0; background: #f8fafc; }
.app { max-width: 500px; margin: 20px auto; }
nav { display: flex; background: white; border-bottom: 2px solid #e5e7eb; }
.tab { flex: 1; padding: 12px; text-align: center; cursor: pointer; font-weight: 600; font-size: 14px; color: #6b7280; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all .15s; }
.tab.active { color: #2563eb; border-bottom-color: #2563eb; }
.tab:hover:not(.active) { color: #374151; background: #f9fafb; }
.page { background: white; margin-top: 16px; border-radius: 12px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,.06); min-height: 150px; }
h2 { margin: 0 0 12px; color: #1e293b; }
p { color: #6b7280; font-size: 14px; line-height: 1.6; }
.product-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin-bottom: 8px; cursor: pointer; transition: border-color .15s; }
.product-card:hover { border-color: #2563eb; }
.back-btn { padding: 6px 12px; background: #f3f4f6; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; margin-bottom: 12px; }`,
      jsx: `const products = [
  { id: 1, name: 'React Course', price: 49, desc: 'Learn React from scratch with hands-on projects.' },
  { id: 2, name: 'Node.js Guide', price: 39, desc: 'Build REST APIs with Node.js and Express.' },
  { id: 3, name: 'CSS Mastery', price: 29, desc: 'Master modern CSS, Flexbox, and Grid.' },
];

function HomePage() {
  return (
    <div className="page">
      <h2>🏠 Home</h2>
      <p>Welcome to WebDev Academy! Browse our courses or read about us below.</p>
    </div>
  );
}

function ShopPage({ onSelectProduct }) {
  return (
    <div className="page">
      <h2>🛍️ Shop</h2>
      {products.map(p => (
        <div key={p.id} className="product-card" onClick={() => onSelectProduct(p)}>
          <strong>{p.name}</strong> - {p.price}
        </div>
      ))}
    </div>
  );
}

function ProductPage({ product, onBack }) {
  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← Back to Shop</button>
      <h2>{product.name}</h2>
      <p>{product.desc}</p>
      <p><strong>Price:</strong> {product.price}</p>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="page">
      <h2>ℹ️ About</h2>
      <p>This simulates React Router tab navigation using state. In a real app, each tab would be a separate URL route using BrowserRouter + Route.</p>
    </div>
  );
}

function App() {
  const [route, setRoute] = React.useState('home');
  const [selectedProduct, setSelectedProduct] = React.useState(null);

  function renderPage() {
    if (route === 'shop' && selectedProduct) {
      return <ProductPage product={selectedProduct} onBack={() => setSelectedProduct(null)} />;
    }
    if (route === 'home')  return <HomePage />;
    if (route === 'shop')  return <ShopPage onSelectProduct={p => setSelectedProduct(p)} />;
    if (route === 'about') return <AboutPage />;
    return <div className="page"><h2>404 - Not Found</h2></div>;
  }

  return (
    <div className="app">
      <nav>
        {['home', 'shop', 'about'].map(r => (
          <div key={r} className={"tab" + (route === r ? ' active' : '')}
            onClick={() => { setRoute(r); setSelectedProduct(null); }}>
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </div>
        ))}
      </nav>
      {renderPage()}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);`,
    },
  ],
  exercises: [
    {
      id: 'router-1',
      question: 'What is the difference between Link and a regular anchor tag in React Router?',
      type: 'multiple-choice',
      options: [
        'There is no difference - both work the same way',
        'Link prevents a full page reload and updates the URL client-side',
        'Link only works with absolute URLs',
        'Anchor tags are not allowed in React',
      ],
      correct: 1,
      explanation: 'React Router\'s Link component intercepts the click, updates the browser URL, and renders the matching component - all without a full page reload. Regular anchor tags (<a href>) trigger a full page reload, losing all React state.',
    },
    {
      id: 'router-2',
      question: 'How do you access the :id URL parameter inside a component?',
      type: 'multiple-choice',
      options: [
        'props.params.id',
        'const { id } = useParams();',
        'const id = useRoute().id;',
        'URL.searchParams.get("id")',
      ],
      correct: 1,
      explanation: 'The useParams hook returns an object containing all dynamic segments from the current URL. For a route like /posts/:id, useParams() returns { id: "42" } when the URL is /posts/42.',
    },
  ],
  quiz: [
    {
      id: 'rrouterq1',
      question: 'What does the path="*" Route catch?',
      options: [
        'All routes - it must be listed first',
        'Only routes with a wildcard in their URL',
        'Any URL that did not match a previous route - used for 404 pages',
        'Routes with query strings',
      ],
      correct: 2,
      explanation: 'path="*" is a wildcard that matches any URL not matched by earlier routes. React Router evaluates routes in order and picks the best match, so putting the * route last makes it a catch-all for 404 pages.',
    },
  ],
};
