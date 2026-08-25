import type { ReactLesson } from '../react-curriculum';

export const reactJsxLesson: ReactLesson = {
  id: 'react-jsx',
  title: 'JSX - JavaScript XML',
  slug: 'jsx',
  chapter: 'intro',
  order: 2,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'Learn JSX syntax rules, how to embed JavaScript expressions, key differences from HTML, and how JSX compiles to React.createElement calls.',
  sections: [
    {
      type: 'text',
      content: 'JSX stands for JavaScript XML. It is a syntax extension that lets you write HTML-like code directly inside JavaScript. JSX is not valid JavaScript on its own - a tool called Babel compiles it into regular JavaScript before the browser runs it. JSX is the most natural way to describe what your UI should look like.',
    },
    {
      type: 'heading',
      content: '1. JSX Basics - HTML Inside JavaScript',
    },
    {
      type: 'example',
      title: 'Your first JSX element',
      content: 'JSX looks like HTML but lives inside a JavaScript file. You can assign JSX to a variable just like any other value. Each JSX element must have exactly ONE root element - if you need to return multiple elements side by side, wrap them in a parent div or a Fragment (<>).',
      language: 'jsx',
      code: `// JSX assigned to a variable
const heading = <h1>Hello, React!</h1>;

// Multiple elements need ONE root wrapper
const card = (
  <div className="card">
    <h2>Title</h2>
    <p>Some text here.</p>
  </div>
);

// Or use a Fragment - no extra DOM element
const items = (
  <>
    <li>First</li>
    <li>Second</li>
    <li>Third</li>
  </>
);`,
    },
    {
      type: 'heading',
      content: '2. JavaScript Expressions in JSX',
    },
    {
      type: 'example',
      title: 'Embedding JS values and expressions with curly braces',
      content: 'Curly braces {} let you escape from JSX back into JavaScript. Inside the braces you can put any valid JavaScript expression - a variable, a calculation, a function call, or a ternary. You cannot put statements (like if, for, while) directly in JSX - only expressions that produce a value.',
      language: 'jsx',
      code: `const name = "Alice";
const score = 92;
const isLoggedIn = true;

function App() {
  return (
    <div>
      {/* Variables */}
      <h1>Hello, {name}!</h1>

      {/* Arithmetic */}
      <p>Score: {score} / 100 ({score >= 90 ? "A" : "B"})</p>

      {/* Function call */}
      <p>Today: {new Date().toDateString()}</p>

      {/* Template - curly braces evaluate expressions */}
      <p>Half score: {score / 2}</p>

      {/* Ternary for conditional text */}
      <p>{isLoggedIn ? "Welcome back!" : "Please log in."}</p>
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '3. JSX vs HTML - Key Differences',
    },
    {
      type: 'example',
      title: 'className, htmlFor, and self-closing tags',
      content: 'JSX uses camelCase for attributes because JSX compiles to JavaScript, and "class" and "for" are reserved keywords in JS. Use className instead of class for CSS classes, and htmlFor instead of for on labels. Every tag must be closed - either with a closing tag or self-closing slash like <img /> and <input />.',
      language: 'jsx',
      code: `// HTML:              JSX:
// class="btn"  →  className="btn"
// for="email"  →  htmlFor="email"
// <img src="">  →  <img src="" /> (must self-close)
// <br>          →  <br />
// <input>       →  <input />

function LoginForm() {
  return (
    <div className="form-container">
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        className="input-field"
        placeholder="you@example.com"
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        className="input-field"
      />

      <hr />
      <img src="/logo.png" alt="Logo" />

      <button type="submit" className="btn btn-primary">
        Sign In
      </button>
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '4. Inline Styles in JSX',
    },
    {
      type: 'example',
      title: 'Applying inline styles with a JavaScript object',
      content: 'In HTML you write style="color: red". In JSX the style attribute takes a JavaScript object, so you use double curly braces - the outer {} for JSX expression, the inner {} for the object literal. CSS property names become camelCase: background-color becomes backgroundColor, font-size becomes fontSize.',
      language: 'jsx',
      code: `function StyledBox() {
  // Style as a variable (cleaner for multiple properties)
  const boxStyle = {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '16px 24px',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 'bold',
  };

  return (
    <div>
      {/* Inline object directly in the attribute */}
      <p style={{ color: 'red', fontWeight: 'bold' }}>
        Red bold text
      </p>

      {/* Style from a variable */}
      <div style={boxStyle}>
        Styled box
      </div>

      {/* Dynamic styles */}
      <p style={{ color: true ? 'green' : 'gray' }}>
        Dynamic color
      </p>
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '5. JSX Compiles to React.createElement',
    },
    {
      type: 'example',
      title: 'What Babel does behind the scenes',
      content: 'JSX is just syntactic sugar. Babel transforms every JSX element into a React.createElement() call. The first argument is the element type, the second is props (attributes), and the rest are children. Understanding this helps you see why JSX has rules like single root elements and why component names must be capitalized - lowercase names are treated as HTML strings.',
      language: 'jsx',
      code: `// What you write:
const element = <h1 className="title">Hello!</h1>;

// What Babel compiles it to:
const element = React.createElement(
  'h1',                    // element type (lowercase = HTML tag)
  { className: 'title' },  // props object
  'Hello!'                 // children
);

// Nested JSX:
const card = (
  <div className="card">
    <h2>Title</h2>
    <p>Body</p>
  </div>
);

// Compiles to:
const card = React.createElement(
  'div',
  { className: 'card' },
  React.createElement('h2', null, 'Title'),
  React.createElement('p', null, 'Body')
);

// Capitalized names = component, lowercase = HTML tag
// <Button /> → React.createElement(Button, ...)
// <button /> → React.createElement('button', ...)`,
    },
    {
      type: 'tryit',
      title: 'Try It: JSX Expressions and Styling',
      css: `body { font-family: system-ui, sans-serif; padding: 20px; background: #f8fafc; }
.profile { background: white; border-radius: 16px; padding: 24px; max-width: 300px; box-shadow: 0 4px 20px rgba(0,0,0,.08); }
.avatar { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 12px; }
.name { font-size: 20px; font-weight: 700; color: #111; margin: 0 0 4px; }
.role { font-size: 13px; color: #6b7280; margin: 0 0 12px; }
.badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }
.stats { display: flex; gap: 16px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #f3f4f6; }
.stat { text-align: center; }
.stat-num { font-size: 18px; font-weight: 700; color: #111; }
.stat-label { font-size: 11px; color: #9ca3af; }`,
      jsx: `function ProfileCard({ name, role, emoji, level, posts, followers, following }) {
  const levelColors = {
    Beginner:     { bg: '#f0fdf4', color: '#16a34a' },
    Intermediate: { bg: '#eff6ff', color: '#2563eb' },
    Advanced:     { bg: '#faf5ff', color: '#7c3aed' },
  };

  const colors = levelColors[level] || levelColors.Beginner;
  const avatarBg = level === 'Advanced' ? '#7c3aed' : level === 'Intermediate' ? '#2563eb' : '#16a34a';

  return (
    <div className="profile">
      <div className="avatar" style={{ backgroundColor: avatarBg }}>
        {emoji}
      </div>
      <p className="name">{name}</p>
      <p className="role">{role}</p>
      <span className="badge" style={{ backgroundColor: colors.bg, color: colors.color }}>
        {level}
      </span>
      <div className="stats">
        <div className="stat">
          <div className="stat-num">{posts}</div>
          <div className="stat-label">Posts</div>
        </div>
        <div className="stat">
          <div className="stat-num">{followers}</div>
          <div className="stat-label">Followers</div>
        </div>
        <div className="stat">
          <div className="stat-num">{following}</div>
          <div className="stat-label">Following</div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ProfileCard
      name="Alex Rivera"
      role="Frontend Developer"
      emoji="👩‍💻"
      level="Intermediate"
      posts={142}
      followers={1800}
      following={230}
    />
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);`,
    },
  ],
  exercises: [
    {
      id: 'jsx-1',
      question: 'In JSX, which attribute replaces the HTML "class" attribute?',
      type: 'multiple-choice',
      options: ['cssClass', 'class', 'className', 'classList'],
      correct: 2,
      explanation: 'JSX uses className instead of class because "class" is a reserved keyword in JavaScript. Babel compiles className back to class in the final HTML output.',
    },
    {
      id: 'jsx-2',
      question: 'What goes inside curly braces {} in JSX?',
      type: 'multiple-choice',
      options: ['Only string values', 'Any JavaScript expression that returns a value', 'Only function names', 'Only variable names'],
      correct: 1,
      explanation: 'Curly braces in JSX can contain any valid JavaScript expression - variables, arithmetic, ternaries, function calls. They cannot contain statements like if, for, or while.',
    },
  ],
  quiz: [
    {
      id: 'rjq1',
      question: 'What does JSX compile to?',
      options: [
        'HTML and CSS',
        'Python objects',
        'React.createElement() function calls',
        'DOM innerHTML strings',
      ],
      correct: 2,
      explanation: 'Babel compiles every JSX element into a React.createElement(type, props, ...children) call. JSX is purely syntactic sugar - the browser never actually sees JSX.',
    },
  ],
};
