export const interviewQuestions = [
  {
    id: 'js-1',
    technologyId: 'javascript',
    question: 'What is the difference between == and === in JavaScript?',
    shortAnswer: '== checks value only (with type coercion). === checks both value AND type (strict equality).',
    detailedAnswer: '== (loose equality) performs type coercion before comparison — it converts the values to the same type first. === (strict equality) does not convert types; both value and type must match.',
    example: `console.log(0 == false);   // true  (false coerces to 0)
console.log(0 === false);  // false (different types: number vs boolean)
console.log("1" == 1);     // true  (string "1" coerces to number 1)
console.log("1" === 1);    // false (string !== number)
console.log(null == undefined);  // true
console.log(null === undefined); // false`,
    followUp: 'When would you intentionally use == over ===?',
    difficulty: 'beginner' as const,
    tags: ['equality', 'type coercion', 'operators']
  },
  {
    id: 'js-2',
    technologyId: 'javascript',
    question: 'What is a closure in JavaScript?',
    shortAnswer: 'A closure is a function that remembers variables from its outer scope, even after the outer function has finished executing.',
    detailedAnswer: 'When a function is defined inside another function, the inner function forms a closure over the outer function\'s variables. These variables remain accessible to the inner function even after the outer function returns. Closures enable data privacy, factory functions, and callbacks that maintain state.',
    example: `function makeCounter() {
  let count = 0;  // this is "closed over"
  return () => ++count;
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3`,
    followUp: 'What is a common problem with closures inside loops?',
    difficulty: 'intermediate' as const,
    tags: ['closures', 'scope', 'functions']
  },
  {
    id: 'js-3',
    technologyId: 'javascript',
    question: 'What is the Event Loop in JavaScript?',
    shortAnswer: 'The event loop is the mechanism that allows JavaScript (single-threaded) to handle asynchronous operations by managing a call stack, callback queue, and microtask queue.',
    detailedAnswer: 'JavaScript runs on a single thread — one operation at a time. The event loop continuously checks if the call stack is empty. If it is, it processes items from the microtask queue first (Promises), then from the macrotask queue (setTimeout, setInterval). This is why Promise callbacks always run before setTimeout callbacks even with 0ms delay.',
    example: `console.log("1");
setTimeout(() => console.log("3"), 0);
Promise.resolve().then(() => console.log("2"));
console.log("4");
// Output: 1, 4, 2, 3`,
    followUp: 'What is the difference between microtasks and macrotasks?',
    difficulty: 'advanced' as const,
    tags: ['event loop', 'async', 'microtasks']
  },
  {
    id: 'react-1',
    technologyId: 'react',
    question: 'What is the difference between state and props in React?',
    shortAnswer: 'Props are data passed from parent to child (read-only). State is data managed inside a component that can change over time.',
    detailedAnswer: 'Props (properties) are how you pass data from a parent component to a child component. They are immutable inside the child. State is local data that a component owns and can modify — when state changes, the component re-renders.',
    example: `// Props — passed from outside, read-only
function Greeting({ name }) {  // name is a prop
  return <h1>Hello, {name}!</h1>;
}

// State — managed inside, can change
function Counter() {
  const [count, setCount] = useState(0);  // state
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}`,
    followUp: 'Can a child component modify props it receives?',
    difficulty: 'beginner' as const,
    tags: ['react', 'state', 'props']
  },
  {
    id: 'react-2',
    technologyId: 'react',
    question: 'What is the virtual DOM and how does React use it?',
    shortAnswer: 'The virtual DOM is a lightweight in-memory copy of the real DOM. React uses it to determine what changed and update only those parts of the real DOM.',
    detailedAnswer: 'When your React component\'s state changes, React creates a new virtual DOM tree and compares it to the previous one (a process called "diffing"). It then calculates the minimal set of changes needed and applies only those to the real DOM — a process called "reconciliation". This is much faster than rebuilding the entire DOM.',
    followUp: 'What is React Fiber?',
    difficulty: 'intermediate' as const,
    tags: ['react', 'virtual DOM', 'performance']
  },
  {
    id: 'css-1',
    technologyId: 'css',
    question: 'What is the CSS Box Model?',
    shortAnswer: 'Every HTML element is a box with four layers: content, padding, border, and margin.',
    detailedAnswer: 'The CSS box model describes how every HTML element is rendered as a rectangular box. From inside out: content (the actual text/images), padding (space between content and border), border (the line around the element), and margin (space outside the border, separating from other elements). By default, width and height only apply to content. Use box-sizing: border-box to include padding and border in the element\'s total size.',
    example: `.box {
  width: 200px;
  padding: 20px;
  border: 2px solid black;
  margin: 10px;
  /* Total width = 200 + 20+20 + 2+2 = 244px (default) */
  
  box-sizing: border-box;
  /* Total width = 200px (padding/border included) */
}`,
    difficulty: 'beginner' as const,
    tags: ['css', 'box model', 'layout']
  },
  {
    id: 'node-1',
    technologyId: 'nodejs',
    question: 'What is middleware in Express.js?',
    shortAnswer: 'Middleware is a function that runs between a request arriving and a response being sent. It can read, modify, or terminate the request/response cycle.',
    detailedAnswer: 'In Express, middleware functions have access to the request object (req), response object (res), and the next middleware function (next). Middleware can execute code, modify req/res, end the request cycle, or call next() to pass control to the next middleware. This pattern allows you to separate concerns like authentication, logging, parsing, and error handling.',
    example: `// Logger middleware
app.use((req, res, next) => {
  console.log(\`\${req.method} \${req.path}\`);
  next(); // pass to next handler
});

// Auth middleware
function requireAuth(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

app.get('/protected', requireAuth, (req, res) => {
  res.json({ secret: 'data' });
});`,
    difficulty: 'intermediate' as const,
    tags: ['nodejs', 'express', 'middleware']
  }
];
