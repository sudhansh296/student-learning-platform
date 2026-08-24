import { InterviewQuestion } from '@/lib/interview-types';

export const projectInterviewQuestions: InterviewQuestion[] = [
  {
    id: 'proj-explain-project',
    category: 'project',
    type: 'theory',
    question: 'How do you explain your project in an interview?',
    difficulty: 'beginner',
    tags: ['projects', 'communication', 'interview-skills'],
    shortAnswer: 'One sentence what it does → problem it solves → your specific role → tech stack choices → biggest challenge → outcome/impact → what you\'d improve.',
    detailedExplanation: 'Explaining a project well is a communication skill that signals engineering maturity. Structure: 1) One-sentence summary (what + for whom). 2) Problem it solves (why it exists). 3) Your specific role and contributions. 4) Technical decisions you made and why. 5) Biggest challenge you faced. 6) Outcome or current status. 7) What you\'d do differently (shows reflection). Keep it to 3-4 minutes, then answer follow-up questions.',
    example: {
      code: `// PROJECT EXPLANATION FRAMEWORK

// 1. One sentence summary
"I built a full-stack e-commerce platform for small 
businesses to sell products online."

// 2. Problem / motivation  
"The project came from seeing friends who run small 
businesses struggle with Shopify fees — they wanted 
something simpler and cheaper to self-host."

// 3. Your role
"I was the sole developer, so I was responsible for 
the entire stack — from database design to deployment."

// 4. Tech stack + reasoning
"I used React for the frontend because of component 
reusability for the product catalog and cart. 
Node.js/Express for the API because I wanted 
JavaScript across the stack. MongoDB because the 
product schema varied a lot between sellers, so 
flexible documents made sense."

// 5. Most interesting technical challenge
"The hardest part was implementing the shopping cart. 
I needed it to work for both logged-in users (persistent 
across devices) and guests (local storage). When a 
guest logs in, I had to merge their local cart with 
their saved cart without duplicating items. I ended 
up writing a merge function that reconciles quantities 
and prefers the higher of the two quantities for 
matching products."

// 6. Outcome
"It's deployed on Vercel with a Railway backend 
and has been used by 3 local businesses. One of 
them processed about 200 orders in the first month."

// 7. What you'd improve (shows maturity)
"If I were rebuilding it, I'd add proper payment 
retry logic with idempotency keys from the start. 
I had to add that later when one of the businesses 
reported duplicate charges — it wasn't hard to fix 
but would have been cleaner to design in upfront."

// Common follow-up questions to prepare for:
// - Why did you choose [technology] over [alternative]?
// - How did you handle [specific feature]?
// - What was the most difficult bug you faced?
// - How do you handle [edge case]?
// - What would you scale this?`,
      language: 'javascript'
    },
    interviewAnswer: 'Practice this until it\'s 3-4 minutes maximum. The challenge section is what sets apart good candidates — it shows depth of thinking. Quantify outcomes where possible (users, performance improvements, etc.). The "what I\'d improve" section shows you reflect on your work rather than just shipping and forgetting.',
    commonMistakes: [
      'Just listing technologies without explaining WHY',
      'Taking too long (>5 minutes) without a question',
      'Not mentioning your specific contribution',
      'No challenge or problem-solving story'
    ],
    realWorldUse: 'Every technical interview asks about your projects. Freshers especially need to articulate portfolio projects well since they\'re the primary evidence of capability.',
    followUpQuestions: [
      'Why did you choose that particular tech stack?',
      'How would you scale this to handle 10x traffic?',
      'What would you build next if you continued this project?'
    ]
  },

  {
    id: 'proj-tech-choices',
    category: 'project',
    type: 'theory',
    question: 'How do you justify your technical choices in a project?',
    difficulty: 'intermediate',
    tags: ['architecture', 'decisions', 'tradeoffs'],
    shortAnswer: 'Explain the problem constraints first, then why this solution fits those constraints better than alternatives. Show you considered tradeoffs — no technology is universally better, context determines choice.',
    detailedExplanation: 'Technical decision-making is one of the most valued engineering skills. Interviewers don\'t expect perfect choices — they want to see reasoning. Structure: What problem were you solving? What options did you consider? What were the tradeoffs? Why did this option fit your constraints? What would you choose differently with hindsight? Show you weighed team familiarity, scale requirements, maintenance burden, and correctness.',
    example: {
      code: `// Framework for explaining technical decisions

// Example: "Why did you use MongoDB over PostgreSQL?"

// ❌ Weak answer:
"MongoDB is more flexible and scales better."
// (too vague, doesn't show thinking)

// ✅ Strong answer:
"For this project I chose MongoDB over PostgreSQL 
for a few reasons:

1. Data model fit: Each product had different 
   attributes — electronics have voltage specs, 
   clothing has size/color variants. MongoDB's 
   document model meant I didn't need 15 nullable 
   columns or multiple join tables.

2. Iteration speed: This was a prototype and the 
   schema was evolving weekly. Not having to write 
   migrations for every field change let me move faster.

3. My experience: I had more MongoDB experience at 
   the time, which matters for a solo project where 
   getting stuck on the database layer would slow everything.

The tradeoff is I gave up ACID transactions across 
multiple collections. For this use case — a catalog 
with no complex financial transactions — that was 
acceptable. If I were building a payment system or 
anything requiring strong consistency, I'd use PostgreSQL.

Now that I know MongoDB supports multi-document 
transactions since v4, I'd still make the same choice 
for the schema flexibility, but I'd use transactions 
for the checkout flow instead of the manual 
compensation logic I wrote."

// Decision framework questions to ask yourself:
// - What are my constraints? (time, scale, team, schema)
// - What problem does this technology solve better?
// - What does it trade away?
// - What happens if requirements change?
// - Would I make the same choice with hindsight?`,
      language: 'javascript'
    },
    interviewAnswer: 'The goal is to show that you made intentional decisions rather than just picking what you knew. Acknowledging tradeoffs is more impressive than claiming your choice was perfect. "I chose X because it fits constraints A and B, even though it has limitation C which wasn\'t critical for this use case" shows mature engineering thinking.',
    commonMistakes: [
      '"I just used what I knew" (shows no analysis)',
      'Claiming no tradeoffs (shows shallow thinking)',
      'Not relating the choice to specific project requirements',
      'Defending a bad choice without acknowledging its flaws'
    ],
    realWorldUse: 'Senior engineers are evaluated heavily on decision-making. Code reviews and architecture discussions require articulating why you chose one approach over another.',
    followUpQuestions: [
      'What would you choose if scale was 100x bigger?',
      'What did you learn from that technical decision?',
      'Have you ever had to reverse a technical decision?'
    ]
  },

  {
    id: 'proj-biggest-challenge',
    category: 'project',
    type: 'theory',
    question: 'What was the most challenging part of building your project?',
    difficulty: 'intermediate',
    tags: ['problem-solving', 'debugging', 'projects'],
    shortAnswer: 'Pick a genuine technical challenge. Walk through: what the problem was, why it was hard, how you debugged/researched, what solutions you considered, what you chose, and the result. Show systematic debugging approach.',
    detailedExplanation: 'This question tests problem-solving depth and persistence. Interviewers want to see how you approach hard problems: do you Google blindly or systematically diagnose? Do you ask for help appropriately? The best answers show a methodical approach: reproduce the issue, form hypotheses, test them, find root cause, evaluate solutions, implement, verify. Even better if the problem taught you something fundamental.',
    example: {
      code: `// Example answer structure

// THE PROBLEM (be specific):
"The most challenging issue was a race condition in 
my real-time chat feature. Messages occasionally 
appeared out of order, but only under load — impossible 
to reproduce consistently, which made it really hard 
to debug."

// WHY IT WAS HARD:
"The problem only appeared when multiple messages were 
sent in quick succession, and the timing was different 
every time. My initial console.log debugging was 
useless because adding logs changed the timing."

// HOW YOU DEBUGGED:
"I started by adding timestamps to every step — when 
the message was sent, when the WebSocket received it, 
when it was saved to the database, when it was 
broadcast to clients.

Looking at the timestamps, I noticed that sometimes 
the database write completed before the timestamp 
was set, and sometimes after — the timestamps 
themselves weren't reliable because they were 
set by different async operations.

I realized the issue was that I was generating 
timestamps client-side AND saving to MongoDB, and 
they could differ by milliseconds. The ordering 
was based on client timestamps, but display order 
was based on MongoDB insertion order."

// THE SOLUTION:
"I switched to using MongoDB's ObjectId for ordering — 
it has a timestamp component that's guaranteed monotonic 
from the server. On the client, I sort messages by 
ObjectId, not by a separate timestamp field. This 
completely eliminated the out-of-order issue."

// THE LESSON:
"I learned that client-side time is unreliable for 
ordering — clocks drift and can go backward. Anything 
requiring a guaranteed order should use server-side 
monotonic IDs. This is why Snowflake IDs and ULIDs 
exist for distributed systems."`,
      language: 'javascript'
    },
    interviewAnswer: 'The debugging process is as important as the solution. Show that you approached the problem systematically rather than trying random fixes. The lesson you drew from it shows you extracted value from the difficulty — that\'s what seniors do.',
    commonMistakes: [
      'Picking a too-simple challenge ("styling wasn\'t working")',
      'No debugging methodology (just tried random things)',
      'Not explaining why it was actually hard',
      'No lesson learned from the experience'
    ],
    realWorldUse: 'Every project has hard problems. This shows real engineering experience beyond tutorials. The more specific and technical the debugging story, the more credible.',
    followUpQuestions: [
      'Could you have prevented that problem by designing differently?',
      'How long did debugging take?',
      'Did you find any relevant documentation or resources?'
    ]
  },

  {
    id: 'proj-scale-it',
    category: 'project',
    type: 'theory',
    question: 'How would you scale your project to handle 10x more traffic?',
    difficulty: 'intermediate',
    tags: ['scalability', 'architecture', 'system-design'],
    shortAnswer: 'Identify bottlenecks first (DB, API, assets). Solutions: horizontal scaling + load balancing, database read replicas, caching layer (Redis), CDN for static assets, queue async work, optimize queries.',
    detailedExplanation: 'Scalability questions test system design thinking. The approach: identify what currently breaks at 10x load, then address each bottleneck. Web tier: horizontal scaling behind load balancer (stateless helps here). Database: read replicas for read-heavy loads, connection pooling, query optimization, caching hot data in Redis. Static assets: CDN. Queue async operations. Add monitoring to know what\'s actually slow.',
    example: {
      code: `// Scaling a typical MERN app to 10x traffic

// CURRENT STATE (1x):
// Single Node.js server → MongoDB → Client

// IDENTIFY BOTTLENECKS at 10x:
// 1. Single Node.js process (CPU bound on heavy requests)
// 2. Every request hits MongoDB (connection limit, slow queries)
// 3. Static files served from same server
// 4. Email/jobs processed synchronously in request

// SCALING SOLUTIONS:

// 1. Web tier - horizontal scaling
// Before: 1 server
// After: Load balancer → 3+ Node.js servers
// - Use PM2 cluster mode or Docker containers
// - Stateless design (JWT, no server-side sessions)
// - Session/cache in Redis (shared across servers)

// 2. Database layer
// Before: Single MongoDB instance
// After: 
//   Primary (writes) + 2 Read Replicas (reads)
//   All writes → primary
//   All reads → replicas (90% of traffic is reads)
const mongoose = require('mongoose');
await mongoose.connect(mongoUri, {
  readPreference: 'secondaryPreferred'
});

// 3. Caching - Redis for hot data
// Before: Every /products request hits MongoDB
// After: Cache for 5 minutes
const getCachedProducts = async () => {
  const cached = await redis.get('products:all');
  if (cached) return JSON.parse(cached);
  
  const products = await Product.find();
  await redis.setex('products:all', 300, JSON.stringify(products));
  return products;
};

// 4. CDN for static assets
// Before: Static files from Node.js server
// After: CloudFront/Cloudflare serves CSS, JS, images
// Cache-Control: max-age=31536000, immutable

// 5. Async queue for heavy operations
// Before: Send email synchronously during request
// After: Queue email job, return response immediately
app.post('/register', async (req, res) => {
  const user = await User.create(req.body);
  await emailQueue.add('welcome', { email: user.email }); // Don't await!
  res.status(201).json(user); // Respond immediately
});

// 6. Database query optimization
// Before: Full collection scan
// After: Indexed queries
User.schema.index({ email: 1 });
Product.schema.index({ category: 1, price: 1 });

// 7. Monitoring - know what's actually slow
// Add APM (Application Performance Monitoring)
// Track: response times, error rates, DB query times
// Prometheus + Grafana, or Datadog, or New Relic`,
      language: 'javascript'
    },
    interviewAnswer: 'Start with "it depends on what the bottleneck is." I\'d add monitoring first to see where time is being spent. For most web apps: caching database reads with Redis eliminates most DB pressure, horizontal scaling handles CPU, and moving static assets to CDN removes a lot of bandwidth. The key is keeping the web servers stateless so they can scale horizontally without sticky session issues.',
    commonMistakes: [
      '"Just add more servers" without identifying bottlenecks',
      'Not mentioning the database (usually the bottleneck)',
      'No monitoring strategy',
      'Forgetting stateless requirement for horizontal scaling'
    ],
    realWorldUse: 'System design questions at mid-senior interviews often expand on this. Starting with current bottlenecks and addressing them methodically is the right framework regardless of scale.',
    followUpQuestions: [
      'What metrics would you monitor?',
      'How would you handle database write scaling?',
      'What would 100x require beyond 10x?'
    ]
  },

  {
    id: 'proj-code-quality',
    category: 'project',
    type: 'theory',
    question: 'How do you ensure code quality in your projects?',
    difficulty: 'intermediate',
    tags: ['code-quality', 'testing', 'ci-cd'],
    shortAnswer: 'Code quality stack: ESLint (catch errors), Prettier (consistent formatting), TypeScript (type safety), Jest tests (catch regressions), CI/CD pipeline (automated checks on every PR), code reviews.',
    detailedExplanation: 'Code quality is a practice, not a one-time thing. Linting catches common errors before code runs. Formatting (Prettier) eliminates style debates. TypeScript catches type errors at compile time. Tests catch regressions. CI/CD ensures no code merges without passing checks. Code review (even solo: self-review after a break) catches logic issues. Documentation helps future you and teammates.',
    example: {
      code: `// Code quality toolchain

// 1. ESLint - catch errors and enforce standards
// .eslintrc.json
{
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "rules": {
    "no-unused-vars": "error",
    "no-console": "warn",
    "react/prop-types": "error"
  }
}

// 2. Prettier - consistent formatting
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}

// 3. Husky - run checks before commit
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}

// 4. TypeScript - type safety
interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

// Compiler catches this error before runtime
function getUser(id: string): Promise<User> {
  return User.findById(id);
}

// 5. Testing with Jest/Vitest
describe('cart service', () => {
  test('merges guest cart with user cart on login', () => {
    const guestCart = [{ id: 'a', qty: 2 }, { id: 'b', qty: 1 }];
    const userCart  = [{ id: 'a', qty: 1 }, { id: 'c', qty: 3 }];
    
    const merged = mergeCart(guestCart, userCart);
    
    expect(merged).toEqual([
      { id: 'a', qty: 2 },  // Takes higher quantity
      { id: 'b', qty: 1 },  // From guest
      { id: 'c', qty: 3 }   // From user
    ]);
  });
});

// 6. CI/CD pipeline (GitHub Actions)
// .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test -- --coverage
      - run: npm run build
// No merge if any step fails!`,
      language: 'javascript'
    },
    interviewAnswer: 'I treat code quality as infrastructure — set it up once and it runs automatically. ESLint and Prettier run on save in my editor and as a pre-commit hook so bad code never gets committed. TypeScript catches type errors before they hit production. Tests protect against regressions. The CI pipeline is the safety net — no code merges without linting, types, tests, and build all passing.',
    commonMistakes: [
      'Only linting without testing',
      'No CI pipeline (quality checks are optional)',
      'Not using TypeScript (misses class of bugs)',
      'Tests that don\'t cover edge cases or failure paths'
    ],
    realWorldUse: 'Professional codebases always have this toolchain. It\'s how teams ship quickly without breaking things. Showing you have this set up on personal projects demonstrates professional standards.',
    followUpQuestions: [
      'What is your testing strategy (unit vs integration vs e2e)?',
      'How do you decide what to test?',
      'How do you handle code review in a solo project?'
    ]
  }
,

  // --- BATCH 1 (Q6-Q10) ---------------------------------------------

  {
    id: 'proj-auth-implementation',
    category: 'project',
    type: 'theory',
    question: 'How did you implement authentication in your project?',
    difficulty: 'intermediate',
    tags: ['authentication', 'jwt', 'bcrypt', 'security'],
    shortAnswer: 'Hash passwords with bcrypt on registration. On login, verify and issue a short-lived JWT (15 min) + refresh token (7 days). Protect routes with auth middleware.',
    detailedExplanation: 'Authentication has two sides: storing credentials safely and verifying identity on each request. Never store plain-text passwords. Hash with bcrypt (cost factor 10-12). JWT is stateless � the server signs a token, the client sends it on every request, the server verifies the signature without a DB lookup. Store refresh tokens in httpOnly cookies to prevent XSS.',
    example: {
      code: `// Register
const hash = await bcrypt.hash(password, 12);
await User.create({ email, password: hash });

// Login
const user = await User.findOne({ email });
const valid = await bcrypt.compare(password, user.password);
if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
res.json({ accessToken });

// Auth Middleware
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Token expired or invalid' }); }
};`,
      language: 'javascript',
    },
    interviewAnswer: 'Walk through: bcrypt hash on register, compare on login, sign JWT, protect routes with middleware. Mention refresh tokens and httpOnly cookies.',
    commonMistakes: ['Storing plain-text passwords', 'Long-lived JWTs with no refresh', 'Storing JWT in localStorage (XSS risk)', 'No HTTPS in production'],
    realWorldUse: 'Every authenticated app needs this pattern.',
    followUpQuestions: ['JWT vs Sessions � when to use which?', 'How do you invalidate a JWT before it expires?', 'What is OAuth?'],
  },

  {
    id: 'proj-database-design',
    category: 'project',
    type: 'theory',
    question: 'How did you design the database schema for your project?',
    difficulty: 'intermediate',
    tags: ['database', 'schema', 'mongodb', 'postgresql', 'normalization'],
    shortAnswer: 'Identify entities and relationships first. SQL: normalize, add indexes on queried fields. MongoDB: embed for co-read data, reference for independently accessed data.',
    detailedExplanation: 'Schema design drives long-term performance. For SQL: entities -> relationships -> normalize -> indexes on JOIN and WHERE columns. For MongoDB: model around query patterns. Embed documents when always read together. Reference when data is accessed independently.',
    example: {
      code: `// PostgreSQL schema
CREATE TABLE users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email VARCHAR(255) UNIQUE NOT NULL);
CREATE TABLE products (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(255) NOT NULL, price DECIMAL(10,2) NOT NULL, category_id UUID REFERENCES categories(id));
CREATE TABLE orders (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID REFERENCES users(id) NOT NULL, total DECIMAL(10,2) NOT NULL, status VARCHAR(50) DEFAULT 'pending');

-- Index FK and search fields
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_products_category ON products(category_id);

// MongoDB embed vs reference
// Embed: user + address (always read together)
{ _id, name, email, address: { street, city, zip } }
// Reference: order -> user (accessed independently)
{ _id, userId: ObjectId('...'), items: [...], total: 99.99 }`,
      language: 'javascript',
    },
    interviewAnswer: 'Describe your entities, relationships, and specifically why you chose embed vs reference or how you normalized. Always mention indexes.',
    commonMistakes: ['No indexes on FK columns', 'Over-normalizing causing too many joins', 'Over-embedding in MongoDB', 'No transactions for multi-step writes'],
    realWorldUse: 'DB design is heavily evaluated at every backend and fullstack interview.',
    followUpQuestions: ['Why SQL vs NoSQL?', 'How do you handle schema migrations?', 'What queries were slow and how did you fix them?'],
  },

  {
    id: 'proj-state-management',
    category: 'project',
    type: 'theory',
    question: 'How did you manage state in your React project?',
    difficulty: 'intermediate',
    tags: ['state-management', 'react', 'zustand', 'context', 'react-query'],
    shortAnswer: 'useState for local state. Context for global UI state (user, theme). Zustand for complex shared state. React Query for server/async state � caching, refetching, loading states.',
    detailedExplanation: 'State has two categories: UI state (local) and server state (from APIs). useState for local. Context + useReducer for medium global state. Zustand or Redux Toolkit for large complex state. React Query for server state � handles loading, error, caching, and background refetching automatically.',
    example: {
      code: `// Local state
const [isOpen, setIsOpen] = useState(false);

// Context � global auth
const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

// Zustand � cart store
const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((s) => ({ items: [...s.items, item] })),
  removeItem: (id) => set((s) => ({ items: s.items.filter(i => i.id !== id) })),
}));

// React Query � server state
const { data: products, isLoading } = useQuery({
  queryKey: ['products', category],
  queryFn: () => fetch('/api/products').then(r => r.json()),
  staleTime: 5 * 60 * 1000,
});`,
      language: 'javascript',
    },
    interviewAnswer: 'The key insight: separate server state (React Query) from UI state (Zustand/Context). Avoid putting everything in Redux.',
    commonMistakes: ['Using Redux for everything including local state', 'Context for high-frequency updates (re-render issues)', 'Not using React Query for API data'],
    realWorldUse: 'Asked in almost every React interview.',
    followUpQuestions: ['Redux vs Zustand?', 'How do you handle optimistic updates?', 'How do you avoid unnecessary re-renders?'],
  },

  {
    id: 'proj-api-design',
    category: 'project',
    type: 'theory',
    question: 'How did you design the REST API for your project?',
    difficulty: 'intermediate',
    tags: ['rest-api', 'api-design', 'endpoints', 'http-methods', 'status-codes'],
    shortAnswer: 'Nouns for resources, HTTP verbs for actions, proper status codes (200/201/400/401/404/500), consistent JSON response shape, versioning (/api/v1/), input validation.',
    detailedExplanation: 'Good API design is predictable and consistent. Resource-based URLs (nouns not verbs). HTTP methods express intent. Correct status codes. Consistent JSON envelope. Version from day one. Validate all inputs server-side. Paginate list endpoints.',
    example: {
      code: `const router = express.Router();

// GET /api/v1/products � paginated list
router.get('/', async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const [data, total] = await Promise.all([
    Product.find().skip((page-1)*limit).limit(Number(limit)),
    Product.countDocuments(),
  ]);
  res.json({ data, meta: { page, limit, total } });
});

// GET /api/v1/products/:id
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json({ data: product });
});

// POST /api/v1/products
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const product = await Product.create(req.body);
  res.status(201).json({ data: product });
});

// DELETE /api/v1/products/:id
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).send();
});`,
      language: 'javascript',
    },
    interviewAnswer: 'Walk through routes, HTTP verbs, status codes, auth middleware placement, and input validation. Always mention pagination.',
    commonMistakes: ['Verbs in URLs (/getProducts)', '200 for every response including errors', 'No input validation', 'No pagination'],
    realWorldUse: 'API design is tested at every backend interview.',
    followUpQuestions: ['How do you handle API versioning?', 'How do you document your API?', 'How would you add rate limiting?'],
  },

  {
    id: 'proj-deployment',
    category: 'project',
    type: 'theory',
    question: 'How did you deploy your project? Walk me through the deployment process.',
    difficulty: 'intermediate',
    tags: ['deployment', 'ci-cd', 'vercel', 'railway', 'github-actions'],
    shortAnswer: 'Frontend on Vercel/Netlify. Backend on Railway/Render/AWS. CI/CD with GitHub Actions � lint, test, build on every push, then auto-deploy. Env vars in platform secrets, never in code.',
    detailedExplanation: 'Modern deployment is fully automated. Push to main triggers GitHub Actions: install ? lint ? test ? build ? deploy. Frontend on Vercel (zero-config, global CDN). Backend on Railway for simplicity. Database on MongoDB Atlas (managed). Secrets in platform env var settings. Health check endpoint to verify deployments.',
    example: {
      code: `# .github/workflows/deploy.yml
name: CI/CD
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: \${{ secrets.RAILWAY_TOKEN }}

# Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

# .gitignore � never commit secrets
.env
.env.local`,
      language: 'yaml',
    },
    interviewAnswer: 'Describe: push ? CI (lint + test + build) ? auto deploy. Name your platforms and why. Mention env vars in platform secrets.',
    commonMistakes: ['Committing .env to git', 'Manual deploys with no CI/CD', 'No health check endpoint', 'Same DB for dev and prod'],
    realWorldUse: 'Shows you can take code all the way to production.',
    followUpQuestions: ['How do you handle rollbacks?', 'What is blue-green deployment?', 'How do you manage secrets securely?'],
  }

,

  // --- BATCH 2 (Q11-Q15) --------------------------------------------

  {
    id: 'proj-error-handling',
    category: 'project',
    type: 'theory',
    question: 'How did you handle errors in your project?',
    difficulty: 'intermediate',
    tags: ['error-handling', 'try-catch', 'logging', 'middleware'],
    shortAnswer: 'Global Express error middleware catches all unhandled errors. Async wrapper avoids repetitive try/catch. React Error Boundaries prevent full UI crashes. Never expose stack traces to clients.',
    detailedExplanation: 'Error handling has two layers: backend (catch, log, return safe message) and frontend (handle API failures gracefully). Use a custom AppError class for operational errors vs programmer bugs. A catchAsync wrapper passes errors to Express error middleware automatically. Log full errors server-side, send only safe messages to clients.',
    example: {
      code: `// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Async wrapper - no try/catch in every route
const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// Route - clean, no try/catch
router.get('/:id', catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  res.json({ data: user });
}));

// Global error middleware (last app.use)
app.use((err, req, res, next) => {
  console.error(err); // Full error server-side
  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.isOperational ? err.message : 'Something went wrong',
  });
});

// React Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    return this.state.hasError ? <h2>Something went wrong.</h2> : this.props.children;
  }
}`,
      language: 'javascript',
    },
    interviewAnswer: 'Describe your layered approach: backend catches and logs errors, returns safe messages. Frontend handles API failures gracefully, Error Boundaries prevent full crashes.',
    commonMistakes: ['Sending stack traces to clients', 'No global error handler', 'Generic errors with no logging', 'Not validating inputs before processing'],
    realWorldUse: 'Production apps need robust error handling. Shows you think about reliability.',
    followUpQuestions: ['How do you log errors in production?', 'How do you alert on critical errors?', 'How do you test error paths?'],
  },

  {
    id: 'proj-performance-optimization',
    category: 'project',
    type: 'theory',
    question: 'What performance optimizations did you implement in your project?',
    difficulty: 'intermediate',
    tags: ['performance', 'caching', 'lazy-loading', 'indexes', 'optimization'],
    shortAnswer: 'Frontend: code splitting, lazy loading images/routes, memoization. Backend: DB indexes, Redis caching for hot queries. Network: CDN for static assets, gzip compression.',
    detailedExplanation: 'Always measure first (Lighthouse, Chrome DevTools) then fix the bottleneck. Common wins: lazy loading reduces initial bundle size, DB indexes turn O(n) scans into O(log n) lookups, Redis caches repeated queries, CDN serves assets from edge servers near users, gzip reduces transfer size.',
    example: {
      code: `// Frontend � code splitting & lazy loading
const ProductList = React.lazy(() => import('./ProductList'));
// Image lazy loading
<img src={url} loading="lazy" alt="product" />
// Memoization
const filtered = useMemo(() => items.filter(fn), [items]);
const handler  = useCallback(() => onClick(id), [id]);

// Backend � DB index (O(n) -> O(log n))
userSchema.index({ email: 1 });
productSchema.index({ category: 1, price: -1 });

// Redis caching
const getProducts = async (category) => {
  const key = 'products:' + category;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  const data = await Product.find({ category });
  await redis.setex(key, 300, JSON.stringify(data)); // 5 min TTL
  return data;
};

// Gzip compression
app.use(compression());

// HTTP cache headers
res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');`,
      language: 'javascript',
    },
    interviewAnswer: 'Start with measurement � Lighthouse or DevTools found the bottleneck. Then describe the specific fix and quantify the improvement ("bundle dropped from 2MB to 400KB", "query went from 2s to 50ms after indexing").',
    commonMistakes: ['Optimizing without measuring first', 'No DB indexes on large collections', 'Not lazy loading routes and images', 'Caching without invalidation strategy'],
    realWorldUse: 'Performance is a key metric everywhere. Showing you measured and improved it is very impactful.',
    followUpQuestions: ['How do you measure Core Web Vitals?', 'How do you invalidate cache?', 'What is a CDN?'],
  },

  {
    id: 'proj-testing-strategy',
    category: 'project',
    type: 'theory',
    question: 'What testing strategy did you use in your project?',
    difficulty: 'intermediate',
    tags: ['testing', 'jest', 'vitest', 'cypress', 'unit-tests', 'integration-tests'],
    shortAnswer: 'Testing pyramid: many unit tests (fast, isolated), some integration tests (API routes + DB), few E2E tests (critical user flows). Jest/Vitest for unit/integration, Cypress/Playwright for E2E.',
    detailedExplanation: 'The testing pyramid guides investment: unit tests are cheap and fast (test individual functions with mocked dependencies), integration tests verify multiple units together (route + controller + DB), E2E tests run the full browser flow (slowest, most expensive). Aim for 70% unit, 20% integration, 10% E2E. Always test critical paths: auth, payments, core user flows.',
    example: {
      code: `// Unit test � Jest
describe('mergeCart', () => {
  test('takes higher quantity for duplicate items', () => {
    const guest = [{ id: 'a', qty: 3 }];
    const user  = [{ id: 'a', qty: 1 }, { id: 'b', qty: 2 }];
    expect(mergeCart(guest, user)).toEqual([
      { id: 'a', qty: 3 },
      { id: 'b', qty: 2 },
    ]);
  });
});

// Integration test � supertest
describe('POST /api/auth/login', () => {
  test('returns 200 and token on valid credentials', async () => {
    await User.create({ email: 't@t.com', password: await bcrypt.hash('pass', 10) });
    const res = await request(app).post('/api/auth/login').send({ email: 't@t.com', password: 'pass' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');
  });
  test('returns 401 on wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 't@t.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });
});

// E2E � Cypress
it('completes checkout', () => {
  cy.login('user@test.com', 'pass');
  cy.get('[data-testid="add-to-cart"]').click();
  cy.get('[data-testid="checkout"]').click();
  cy.get('[data-testid="confirmation"]').should('be.visible');
});`,
      language: 'javascript',
    },
    interviewAnswer: 'Describe your pyramid: what you unit tested, which API routes have integration tests, and what E2E tests cover critical flows. Mention test coverage if you have it.',
    commonMistakes: ['Only testing happy paths', 'No integration tests for API routes', 'Using a real DB in tests (use test DB or in-memory)', 'Testing implementation details not behavior'],
    realWorldUse: 'Testing is required at most companies. Shows you care about reliability.',
    followUpQuestions: ['What is test coverage?', 'How do you mock external APIs?', 'What is TDD?'],
  },

  {
    id: 'proj-security-measures',
    category: 'project',
    type: 'theory',
    question: 'What security measures did you implement in your project?',
    difficulty: 'intermediate',
    tags: ['security', 'helmet', 'rate-limiting', 'xss', 'cors', 'validation'],
    shortAnswer: 'helmet.js sets security headers, rate limiting prevents brute force, input validation/sanitization prevents injection, CORS restricts origins, HTTPS everywhere, secrets in environment variables.',
    detailedExplanation: 'Security is multi-layered. helmet.js sets HTTP security headers (Content-Security-Policy, X-Frame-Options, HSTS). Rate limiting prevents brute-force on auth endpoints. Input validation prevents injection attacks. CORS restricts which origins can call your API. Never commit secrets � use env vars. HTTPS enforced in production.',
    example: {
      code: `const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

app.use(helmet()); // Security headers

// Brute-force protection on login
app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5, // 5 attempts
  message: 'Too many attempts, try again later',
}));

// General API rate limit
app.use('/api', rateLimit({ windowMs: 60_000, max: 100 }));

// Sanitize MongoDB operators from inputs
app.use(mongoSanitize());

// CORS � only allow your frontend
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Input validation with Zod
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
router.post('/login', (req, res, next) => {
  const result = LoginSchema.safeParse(req.body);
  if (!result.success) return res.status(400).json({ error: result.error.flatten() });
  next();
});`,
      language: 'javascript',
    },
    interviewAnswer: 'Walk through your security layers: helmet for headers, rate limiting for brute force, input validation, sanitization, CORS. Shows you built features AND thought about security.',
    commonMistakes: ['No rate limiting on auth endpoints', 'CORS set to * (any origin)', 'Secrets in source code', 'Trusting client input without server validation'],
    realWorldUse: 'Security is non-negotiable in production. Any senior role will ask about this.',
    followUpQuestions: ['How do you prevent XSS?', 'What is CSRF and how do you prevent it?', 'What is SQL injection?'],
  },

  {
    id: 'proj-file-upload',
    category: 'project',
    type: 'theory',
    question: 'How did you implement file uploads in your project?',
    difficulty: 'intermediate',
    tags: ['file-upload', 'multer', 'cloudinary', 's3', 'storage'],
    shortAnswer: 'Multer handles multipart/form-data on the backend. Store files in cloud storage (Cloudinary for images, S3 for general files) � never on the server disk in production. Store the URL in the database.',
    detailedExplanation: 'File uploads have two steps: receive the file and store it. Never store files on the server disk in production � servers restart and lose files, and you cannot scale horizontally. Cloudinary is excellent for images (auto-resize, optimize, CDN delivery). AWS S3 for general files. Validate file type and size. Store only the cloud URL in your database.',
    example: {
      code: `const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'avatars', allowed_formats: ['jpg', 'png', 'webp'] },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Images only'));
    cb(null, true);
  },
});

router.post('/upload-avatar', authenticate, upload.single('avatar'), async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { avatar: req.file.path }, // Cloudinary URL stored in DB
    { new: true }
  );
  res.json({ avatar: user.avatar });
});`,
      language: 'javascript',
    },
    interviewAnswer: 'Explain the flow: Multer receives the file, validates type/size, uploads to Cloudinary, stores the URL in MongoDB. Mention why cloud storage over disk (scalability, persistence across deploys).',
    commonMistakes: ['Storing files on server disk in production', 'No file size or type validation', 'Storing binary data in the database', 'No CDN for serving images'],
    realWorldUse: 'Profile pictures, product images, document uploads � very common real-world feature.',
    followUpQuestions: ['How do you handle image resizing?', 'How do you delete an old file when updated?', 'How do you handle very large file uploads?'],
  }

,

  // --- BATCH 3 (Q16-Q20) --------------------------------------------

  {
    id: 'proj-real-time',
    category: 'project',
    type: 'theory',
    question: 'Did your project have real-time features? How did you implement them?',
    difficulty: 'advanced',
    tags: ['websockets', 'socket.io', 'real-time', 'notifications'],
    shortAnswer: 'WebSockets (Socket.io) for bidirectional real-time (chat, live updates). Server-Sent Events for one-way server push (notifications). Always authenticate socket connections.',
    detailedExplanation: 'Real-time features need persistent connections. WebSockets are full-duplex � both sides can send. Socket.io adds rooms, namespaces, and auto-reconnection. Use rooms to broadcast only to relevant users. Authenticate on connection using JWT. For simple one-way push (notifications) SSE is lighter than WebSockets.',
    example: {
      code: `// Server
const io = new Server(httpServer, { cors: { origin: process.env.FRONTEND_URL } });

// Auth middleware for sockets
io.use((socket, next) => {
  try {
    socket.user = jwt.verify(socket.handshake.auth.token, process.env.JWT_SECRET);
    next();
  } catch { next(new Error('Unauthorized')); }
});

io.on('connection', (socket) => {
  socket.join('user:' + socket.user.id); // private room per user

  socket.on('join-room', (roomId) => socket.join(roomId));

  socket.on('send-message', async ({ roomId, content }) => {
    const msg = await Message.create({ userId: socket.user.id, roomId, content });
    io.to(roomId).emit('new-message', msg);
  });
});

// Notify specific user from anywhere
const notifyUser = (userId, event, data) =>
  io.to('user:' + userId).emit(event, data);

// Client (React)
const socket = io(API_URL, { auth: { token: accessToken } });
socket.emit('join-room', roomId);
socket.on('new-message', (msg) => setMessages(prev => [...prev, msg]));
return () => socket.disconnect(); // cleanup`,
      language: 'javascript',
    },
    interviewAnswer: 'Describe the use case, why WebSockets over polling, how you authenticated socket connections, and how you used rooms to target broadcasts.',
    commonMistakes: ['No auth on socket connections', 'Broadcasting to ALL clients instead of rooms', 'Memory leaks � not cleaning up listeners on unmount'],
    realWorldUse: 'Chat, live dashboards, collaborative tools, notifications � high-value feature.',
    followUpQuestions: ['WebSockets vs SSE vs Long-polling?', 'How do you scale WebSockets across multiple servers?', 'How do you handle reconnection?'],
  },

  {
    id: 'proj-pagination',
    category: 'project',
    type: 'theory',
    question: 'How did you implement pagination in your project?',
    difficulty: 'beginner',
    tags: ['pagination', 'cursor', 'offset', 'api', 'database'],
    shortAnswer: 'Offset pagination (skip/limit) is simple but slow on large datasets. Cursor-based pagination uses the last item ID as a cursor � fast regardless of page number. Use offset for admin tables, cursor for infinite scroll feeds.',
    detailedExplanation: 'Pagination prevents loading all data at once. Offset: skip N records, take M. Simple but slow at high offsets (DB scans all skipped rows). Cursor: use last item\'s ID as a bookmark � consistent and fast. Offset is fine for small datasets. Cursor is better for large datasets and infinite scroll.',
    example: {
      code: `// Offset pagination
router.get('/products', async (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 20;

  const [data, total] = await Promise.all([
    Product.find().skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 }),
    Product.countDocuments(),
  ]);

  res.json({ data, meta: { page, limit, total, pages: Math.ceil(total / limit) } });
});

// Cursor pagination (infinite scroll)
router.get('/feed', async (req, res) => {
  const { cursor, limit = 20 } = req.query;
  const query = cursor ? { _id: { $lt: cursor } } : {};

  const posts = await Post.find(query).sort({ _id: -1 }).limit(Number(limit) + 1);
  const hasMore = posts.length > limit;
  const data = hasMore ? posts.slice(0, -1) : posts;

  res.json({ data, nextCursor: hasMore ? data.at(-1)._id : null, hasMore });
});`,
      language: 'javascript',
    },
    interviewAnswer: 'Explain both approaches and which you used. Mention you included total count and page metadata in the response for the frontend to render pagination controls.',
    commonMistakes: ['No pagination at all (loading all records)', 'Forgetting total count in response', 'Cursor pagination without consistent sort'],
    realWorldUse: 'Every list endpoint needs pagination. Very commonly asked API design follow-up.',
    followUpQuestions: ['Cursor vs offset � when to use which?', 'How do you implement infinite scroll on the frontend?', 'How do you handle new items added during pagination?'],
  },

  {
    id: 'proj-search',
    category: 'project',
    type: 'theory',
    question: 'How did you implement search in your project?',
    difficulty: 'intermediate',
    tags: ['search', 'mongodb', 'full-text-search', 'debounce', 'indexing'],
    shortAnswer: 'MongoDB $text index for full-text search. Debounce on the frontend (300ms) to avoid a query on every keystroke. Add filters alongside search. Atlas Search or Elasticsearch for advanced fuzzy search.',
    detailedExplanation: 'Search has frontend and backend parts. Frontend: debounce input to avoid flooding the API. Backend: text index for word-based search, regex for simple substring search (slow on large data). MongoDB Atlas Search or Elasticsearch for fuzzy matching and relevance ranking. Always combine search with filters for better UX.',
    example: {
      code: `// 1. Create text index
productSchema.index({ name: 'text', description: 'text' });

// 2. Search route
router.get('/search', async (req, res) => {
  const { q, category, minPrice, maxPrice } = req.query;
  const filter = {};
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  const products = await Product.find(filter)
    .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
    .limit(20);
  res.json({ data: products });
});

// 3. Frontend � debounced search hook
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}
const debouncedQuery = useDebounce(query, 300);
useEffect(() => { if (debouncedQuery) fetchResults(debouncedQuery); }, [debouncedQuery]);`,
      language: 'javascript',
    },
    interviewAnswer: 'Describe your search approach, how you indexed searchable fields, how you handle filters alongside search, and the debounce on the frontend.',
    commonMistakes: ['Regex search on unindexed fields (full collection scan)', 'No debounce � API call on every keypress', 'Case-sensitive search when users expect case-insensitive'],
    realWorldUse: 'Search is a core feature of almost every app.',
    followUpQuestions: ['How would you add autocomplete?', 'How does Atlas Search differ from $text?', 'How do you handle typos?'],
  },

  {
    id: 'proj-env-management',
    category: 'project',
    type: 'theory',
    question: 'How did you manage environment variables across different environments?',
    difficulty: 'beginner',
    tags: ['environment-variables', 'dotenv', 'secrets', 'config'],
    shortAnswer: '.env locally (gitignored), platform secrets in production (Vercel/Railway dashboard). Commit .env.example to show teammates required vars. Validate required vars at app startup.',
    detailedExplanation: 'Environment config (API keys, DB URLs, secrets) must never be in source code. Use dotenv locally. Platform secret managers in production. Different values per environment (dev DB vs prod DB). Validate all required env vars at startup so missing config fails loudly at boot rather than silently at runtime.',
    example: {
      code: `// .env  (gitignored � NEVER commit)
DATABASE_URL=mongodb://localhost:27017/myapp_dev
JWT_SECRET=local-dev-secret-change-in-prod
STRIPE_KEY=sk_test_...

// .env.example  (committed � shows required vars)
DATABASE_URL=
JWT_SECRET=
STRIPE_KEY=
FRONTEND_URL=

// config/index.ts � validate at startup
const required = ['DATABASE_URL', 'JWT_SECRET', 'STRIPE_KEY'];
const missing  = required.filter(k => !process.env[k]);
if (missing.length) {
  console.error('Missing env vars:', missing.join(', '));
  process.exit(1); // fail fast, don't start broken
}

export const config = {
  db:         { url: process.env.DATABASE_URL! },
  jwt:        { secret: process.env.JWT_SECRET!, expiresIn: '15m' },
  stripe:     { key: process.env.STRIPE_KEY! },
  isProd:     process.env.NODE_ENV === 'production',
};

// .gitignore
.env
.env.local
.env.production`,
      language: 'javascript',
    },
    interviewAnswer: 'Mention .env locally (gitignored), platform secrets in prod, .env.example committed, and startup validation that fails fast on missing config.',
    commonMistakes: ['Committing .env to git (major security issue)', 'Hardcoding secrets in source code', 'No .env.example', 'Same database for dev and production'],
    realWorldUse: 'Basic DevOps hygiene. Every professional project does this.',
    followUpQuestions: ['How do you share secrets with teammates?', 'What is a secrets manager?', 'How do you rotate a compromised secret?'],
  },

  {
    id: 'proj-code-structure',
    category: 'project',
    type: 'theory',
    question: 'How did you structure your codebase? What folder structure did you use?',
    difficulty: 'beginner',
    tags: ['code-structure', 'mvc', 'architecture', 'separation-of-concerns'],
    shortAnswer: 'Layer-based (controllers/services/models/routes) for small-medium apps. Feature-based (grouping by domain) scales better for large apps. Key principle: thin controllers, fat services � business logic lives in the service layer.',
    detailedExplanation: 'Code structure affects long-term maintainability. MVC separates concerns: routes define endpoints, controllers handle HTTP, services contain business logic, models define data shape. Thin controllers only handle req/res � business logic in services makes it testable and reusable. Feature-based structure groups all files for a domain together, which is easier to navigate at scale.',
    example: {
      code: `// Layer-based structure
src/
  routes/       controllers/    services/
  models/       middleware/     utils/      config/

// Feature-based structure (scales better)
src/
  features/
    auth/     ? auth.controller.ts  auth.service.ts  auth.routes.ts
    products/ ? product.controller.ts  product.service.ts  ...
  shared/     ? middleware/  utils/  config/

// Thin controller � only HTTP concerns
const getProduct = catchAsync(async (req, res) => {
  const product = await productService.findById(req.params.id);
  res.json({ data: product });
});

// Fat service � all business logic here
const findById = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) throw new AppError('Product not found', 404);
  return product;
};

// Why this matters:
// - Service logic is testable without HTTP
// - Service can be reused by multiple routes
// - Controller stays clean and predictable`,
      language: 'javascript',
    },
    interviewAnswer: 'Draw or describe the folder structure, explain what lives where and why. Thin controllers, fat services is the key principle to emphasise.',
    commonMistakes: ['Business logic in controllers (hard to test)', 'No service layer (controllers query DB directly)', 'Everything in one file', 'Inconsistent naming'],
    realWorldUse: 'Asked in every backend interview. Shows separation of concerns.',
    followUpQuestions: ['What is the service layer pattern?', 'How do you share logic between controllers?', 'How does your structure change as the app grows?'],
  }

,

  // BATCH 4 (Q21-Q25)

  {
    id: 'proj-caching-strategy',
    category: 'project',
    type: 'theory',
    question: 'How did you use caching in your project?',
    difficulty: 'advanced',
    tags: ['caching', 'redis', 'cdn', 'cache-invalidation'],
    shortAnswer: 'Browser cache, CDN for static assets, Redis for DB queries. Set TTL. Invalidate on writes.',
    detailedExplanation: 'Cache-aside: check Redis first, fallback to DB, store with TTL. Hardest part is stale data.',
    example: {
      code: 'const get=async(c)=>{const h=await redis.get(c);if(h)return JSON.parse(h);const d=await Product.find({category:c});await redis.setex(c,300,JSON.stringify(d));return d;};',
      language: 'javascript',
    },
    interviewAnswer: 'Describe what you cached, the TTL, and invalidation strategy.',
    commonMistakes: ['No TTL', 'Not invalidating on writes', 'No Redis fallback'],
    realWorldUse: 'Caching is how you scale read-heavy apps.',
    followUpQuestions: ['Cache stampede?', 'Write-through vs cache-aside?', 'When NOT to cache?'],
  },

  {
    id: 'proj-git-workflow',
    category: 'project',
    type: 'theory',
    question: 'How did you use Git? What was your branching strategy?',
    difficulty: 'beginner',
    tags: ['git', 'branching', 'pull-requests', 'conventional-commits'],
    shortAnswer: 'Feature branch workflow: main plus feature branches. PRs for review. Conventional commits. Never push to main directly.',
    detailedExplanation: 'GitHub Flow: main plus feature branches, merge via PR. Conventional Commits make history readable. Squash merge keeps main clean.',
    example: {
      code: 'git checkout -b feature/auth\ngit commit -m feat: add login\ngit push origin feature/auth\n# Open PR then squash merge to main',
      language: 'bash',
    },
    interviewAnswer: 'Feature branches, conventional commits, PRs, squash merges.',
    commonMistakes: ['Pushing to main directly', 'Vague messages', 'Committing .env'],
    realWorldUse: 'Clean Git workflow signals team-readiness.',
    followUpQuestions: ['Rebase vs merge?', 'Resolve merge conflicts?', 'Revert a pushed commit?'],
  },

  {
    id: 'proj-responsive-design',
    category: 'project',
    type: 'theory',
    question: 'How did you make your project responsive?',
    difficulty: 'beginner',
    tags: ['responsive-design', 'mobile-first', 'tailwind', 'css-grid', 'flexbox'],
    shortAnswer: 'Mobile-first: base styles for small screens, enhance with breakpoints. CSS Grid and Flexbox. Tailwind sm/md/lg prefixes.',
    detailedExplanation: 'Mobile-first means base styles for mobile then min-width overrides. Over 60% of web traffic is mobile.',
    example: {
      code: '.grid{display:grid;grid-template-columns:1fr;}\n@media(min-width:640px){.grid{grid-template-columns:repeat(2,1fr);}}\n@media(min-width:1024px){.grid{grid-template-columns:repeat(4,1fr);}}',
      language: 'css',
    },
    interviewAnswer: 'Mobile-first, breakpoints, hamburger nav, tested on real devices.',
    commonMistakes: ['Desktop-first', 'Fixed px widths', 'Not testing on real devices'],
    realWorldUse: 'Responsive design is a baseline requirement.',
    followUpQuestions: ['Viewport meta tag?', 'rem vs px?', 'Core Web Vitals?'],
  },

  {
    id: 'proj-logging-monitoring',
    category: 'project',
    type: 'theory',
    question: 'How did you set up logging and monitoring in your project?',
    difficulty: 'intermediate',
    tags: ['logging', 'monitoring', 'winston', 'morgan', 'sentry'],
    shortAnswer: 'Winston for structured JSON logs. Morgan for HTTP logs. Sentry for error tracking. Never log passwords or tokens.',
    detailedExplanation: 'Structured logs are searchable. Log levels filter noise. Sentry catches unhandled exceptions and sends real-time alerts.',
    example: {
      code: 'const logger=winston.createLogger({level:\'info\',format:winston.format.json(),transports:[new winston.transports.Console()]});\napp.use(morgan(\'combined\',{stream:{write:m=>logger.info(m.trim())}}));\nSentry.init({dsn:process.env.SENTRY_DSN});\napp.use(Sentry.Handlers.errorHandler());',
      language: 'javascript',
    },
    interviewAnswer: 'Winston for logs, Morgan for HTTP, Sentry for alerts. Never log sensitive data.',
    commonMistakes: ['console.log in production', 'Logging passwords', 'No alerting'],
    realWorldUse: 'Observability is essential in production.',
    followUpQuestions: ['Structured logging?', 'Search logs in production?', 'Set up alerts?'],
  },

  {
    id: 'proj-refactor-improvements',
    category: 'project',
    type: 'theory',
    question: 'If you could refactor your project what would you change and why?',
    difficulty: 'intermediate',
    tags: ['refactoring', 'technical-debt', 'typescript', 'growth'],
    shortAnswer: 'Add TypeScript for type safety, better test coverage, centralized error handling, or fix an early tech choice.',
    detailedExplanation: 'Tests intellectual honesty and growth mindset. Never say nothing. Pick specific improvements tied to real problems you experienced.',
    example: {
      code: '// TypeScript catches silent NaN at compile time\ninterface Item{price:number;qty:number;}\nconst total=(items:Item[])=>items.reduce((s,i)=>s+i.price*i.qty,0);\n// Named constants\nconst TTL={PRODUCTS:300,SESSION:3600};\nawait redis.setex(key,TTL.PRODUCTS,data);',
      language: 'javascript',
    },
    interviewAnswer: 'Connect each improvement to a real bug or pain point. Be specific.',
    commonMistakes: ['Saying nothing to change', 'Vague improvements', 'Listing everything as bad'],
    realWorldUse: 'Shows growth mindset and self-awareness.',
    followUpQuestions: ['Biggest lesson?', 'What build next?', 'How start differently?'],
  },

  // BATCH 5 (Q26-Q30)

  {
    id: 'proj-data-validation',
    category: 'project',
    type: 'theory',
    question: 'How did you validate data in your project on both frontend and backend?',
    difficulty: 'intermediate',
    tags: ['validation', 'zod', 'joi', 'react-hook-form', 'security'],
    shortAnswer: 'Frontend validation (Zod + React Hook Form) gives immediate UX feedback. Backend validation is mandatory for security - anyone can bypass frontend and send raw HTTP requests.',
    detailedExplanation: 'Never trust client-only validation. Frontend for UX, backend for security. Use Zod or Joi schema validation on the server before any DB operation. Zod is TypeScript-first and can be shared between frontend and backend.',
    example: {
      code: 'const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });\n// Frontend\nconst { register, handleSubmit, formState:{errors} } = useForm({ resolver: zodResolver(LoginSchema) });\n// Backend\nrouter.post(\'/login\', (req,res,next) => {\n  const result = LoginSchema.safeParse(req.body);\n  if (!result.success) return res.status(400).json({ error: result.error.flatten() });\n  next();\n});',
      language: 'javascript',
    },
    interviewAnswer: 'Both layers are required. Frontend for UX feedback, backend for security. Key point: client validation can always be bypassed.',
    commonMistakes: [
      'Client-side only validation',
      'Validating after querying DB',
      'No helpful error messages',
      'Different rules on client and server',
    ],
    realWorldUse: 'Input validation prevents bugs, improves UX, and is the first defense against injection attacks.',
    followUpQuestions: ['Joi vs Zod?', 'How do you sanitize HTML input?', 'How do you validate file uploads?'],
  },

  {
    id: 'proj-scalability-architecture',
    category: 'project',
    type: 'theory',
    question: 'How would you scale your project if user traffic grew 10x?',
    difficulty: 'advanced',
    tags: ['scalability', 'architecture', 'load-balancing', 'horizontal-scaling', 'redis'],
    shortAnswer: 'Identify bottlenecks first. Web tier: horizontal scaling + load balancer. Database: read replicas, query optimization, indexes. Cache hot data in Redis. CDN for static assets. Queue async work.',
    detailedExplanation: 'Scaling starts with measurement. Typical bottlenecks: single server CPU, database connections, slow queries. Solutions: stateless servers scale horizontally, read replicas reduce DB load, Redis caches eliminate repeated queries, CDN removes bandwidth from servers, async queues handle heavy work without blocking requests.',
    example: {
      code: '// 1. Horizontal scaling (stateless servers)\n// Use JWT not sessions - no server memory needed\n// Load balancer -> Server 1, Server 2, Server 3\n\n// 2. DB read replicas\nawait mongoose.connect(mongoUri, { readPreference: \'secondaryPreferred\' });\n\n// 3. Redis cache hot queries\nconst getProducts = async () => {\n  const cached = await redis.get(\'products:all\');\n  if (cached) return JSON.parse(cached);\n  const data = await Product.find();\n  await redis.setex(\'products:all\', 300, JSON.stringify(data));\n  return data;\n};\n\n// 4. Async job queue\nawait emailQueue.add(\'welcome\', { email: user.email }); // non-blocking',
      language: 'javascript',
    },
    interviewAnswer: 'Start by identifying the bottleneck with monitoring. For most MERN apps: Redis caching eliminates most DB load, horizontal scaling handles CPU, CDN handles static files.',
    commonMistakes: [
      'Just add more servers without finding the bottleneck',
      'No monitoring to know what is slow',
      'Sessions on servers prevent horizontal scaling',
      'No DB indexes on large collections',
    ],
    realWorldUse: 'System design questions expand on this. The bottleneck-first approach is correct at any scale.',
    followUpQuestions: ['How do you scale database writes?', 'What metrics would you monitor?', 'Monolith vs microservices?'],
  },

  {
    id: 'proj-ci-cd-pipeline',
    category: 'project',
    type: 'theory',
    question: 'What does your CI/CD pipeline look like? How do you ensure quality before deploying?',
    difficulty: 'intermediate',
    tags: ['ci-cd', 'github-actions', 'automation', 'testing', 'deployment'],
    shortAnswer: 'GitHub Actions: on every push to main, run lint, type-check, tests, and build. Only deploy if all pass. No manual deploys. Failed builds block the merge.',
    detailedExplanation: 'CI (Continuous Integration) runs automated checks on every push. CD (Continuous Deployment) auto-deploys passing builds. This catches bugs before they reach production and removes human error from deployments. Branch protection rules prevent merging if CI fails.',
    example: {
      code: '# .github/workflows/ci.yml\nname: CI/CD\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\njobs:\n  quality:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with: { node-version: 20 }\n      - run: npm ci\n      - run: npm run lint\n      - run: npm run type-check\n      - run: npm test -- --coverage\n      - run: npm run build\n      - name: Deploy (main only)\n        if: github.ref == refs/heads/main\n        run: npm run deploy',
      language: 'yaml',
    },
    interviewAnswer: 'Describe your pipeline steps: install, lint, type-check, test, build, deploy. Mention branch protection so PRs cannot merge if CI fails.',
    commonMistakes: [
      'Manual deployments (error-prone)',
      'No tests in pipeline',
      'Deploying even when tests fail',
      'No branch protection rules',
    ],
    realWorldUse: 'CI/CD is standard at every company. Shows you understand professional engineering workflow.',
    followUpQuestions: ['How do you handle failed deployments?', 'What is a rollback strategy?', 'Staging vs production environment?'],
  },

  {
    id: 'proj-monolith-vs-microservices',
    category: 'project',
    type: 'theory',
    question: 'Did you build a monolith or microservices? Why? When would you switch?',
    difficulty: 'advanced',
    tags: ['architecture', 'microservices', 'monolith', 'system-design', 'scalability'],
    shortAnswer: 'Start with a monolith - simpler to develop, deploy, and debug. Move to microservices only when you hit concrete problems: independent scaling needs, different tech stacks, or clear team boundaries.',
    detailedExplanation: 'Monolith: single deployable unit. Simple to start, fast to develop, easy to debug. Microservices: each service independent with separate deploy, but adds distributed system complexity (network failures, distributed tracing, data consistency). Industry consensus: start monolith, extract services when you have real bottlenecks.',
    example: {
      code: '// Monolith - single app\nsrc/\n  features/\n    auth/\n    products/\n    orders/\n  shared/\n// One deploy, one DB, simple to reason about\n\n// When to extract a microservice:\n// 1. One service needs different scaling (checkout vs catalog)\n// 2. Different team owns it independently\n// 3. Different tech stack needed (ML model in Python)\n// 4. Service is a clear bottleneck\n\n// Service communication\n// Sync: REST or gRPC calls\nconst order = await fetch(\'http://order-service/orders\', { method: \'POST\' });\n// Async: message queue\nawait queue.publish(\'order.created\', { orderId, userId });',
      language: 'javascript',
    },
    interviewAnswer: 'Say you built a monolith and explain why it was the right choice for your scale. Then show you understand when microservices make sense. Avoid saying microservices are always better.',
    commonMistakes: [
      'Microservices always better (premature complexity)',
      'No reasoning for the choice',
      'Not understanding the operational overhead of microservices',
    ],
    realWorldUse: 'Architecture questions are standard at senior level. Pragmatic reasoning beats buzzword adoption.',
    followUpQuestions: ['What is the strangler fig pattern?', 'Data consistency across services?', 'How do you debug microservices?'],
  },

  {
    id: 'proj-concurrency-race-conditions',
    category: 'project',
    type: 'theory',
    question: 'How does your project handle concurrent users accessing the same data simultaneously?',
    difficulty: 'advanced',
    tags: ['concurrency', 'race-conditions', 'transactions', 'atomic-operations', 'mongodb'],
    shortAnswer: 'Atomic operations prevent race conditions. MongoDB findOneAndUpdate with conditions. SQL transactions with FOR UPDATE row locking. Optimistic locking with version fields for conflict detection.',
    detailedExplanation: 'Race condition example: two users buy the last item simultaneously - both read stock=1, both pass the check, both decrement, stock goes negative. Fix with atomic operations that read and write in one DB operation, SQL transactions with row locks, or optimistic locking with version fields.',
    example: {
      code: '// WRONG - race condition\nconst product = await Product.findById(id);\nif (product.stock < qty) return res.status(400).json({ error: \'Out of stock\' });\nproduct.stock -= qty; // another request runs here!\nawait product.save();\n\n// CORRECT - atomic MongoDB operation\nconst product = await Product.findOneAndUpdate(\n  { _id: id, stock: { $gte: qty } }, // condition + update in one operation\n  { $inc: { stock: -qty } },\n  { new: true }\n);\nif (!product) return res.status(400).json({ error: \'Out of stock\' });\n\n// SQL transaction\nawait client.query(\'BEGIN\');\nconst { rows } = await client.query(\'SELECT stock FROM products WHERE id=$1 FOR UPDATE\',[id]);\nif (rows[0].stock < qty) { await client.query(\'ROLLBACK\'); throw new Error(\'Out of stock\'); }\nawait client.query(\'UPDATE products SET stock=stock-$1 WHERE id=$2\',[qty,id]);\nawait client.query(\'COMMIT\');',
      language: 'javascript',
    },
    interviewAnswer: 'Describe the race condition with a concrete example like inventory, then explain your solution - atomic operations in MongoDB or transactions in SQL.',
    commonMistakes: [
      'Read-modify-write without atomicity',
      'No transactions for multi-step operations',
      'Not considering concurrent access at all',
    ],
    realWorldUse: 'Critical for inventory, bookings, financial transactions - any shared mutable state.',
    followUpQuestions: ['What is a race condition?', 'Optimistic vs pessimistic locking?', 'When use distributed locking?'],
  },
];
