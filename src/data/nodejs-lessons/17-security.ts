import type { NodejsLesson } from '../nodejs-curriculum';

export const nodejsSecurityLesson: NodejsLesson = {
  id: 'nodejs-security',
  title: 'Node.js Security Best Practices',
  slug: 'security',
  chapter: 'advanced',
  order: 17,
  difficulty: 'intermediate',
  readingTime: 13,
  description: 'Secure your Node.js applications against common vulnerabilities -- injection attacks, authentication flaws, dependency risks, and more.',
  sections: [
    {
      type: 'text',
      content: 'Security is not a feature you add at the end -- it is a mindset you apply throughout development. Node.js applications face the same vulnerabilities as any web application: injection attacks, broken authentication, exposed secrets, and insecure dependencies. This lesson walks through the most important defenses.',
    },
    {
      type: 'heading',
      content: 'OWASP Top 10 and Node.js',
    },
    {
      type: 'text',
      content: 'The OWASP Top 10 is the industry-standard list of the most critical web application security risks. Most of them apply directly to Node.js and Express applications. Understanding what each category means is the first step to defending against them.',
    },
    {
      type: 'table',
      headers: ['OWASP Category', 'Node.js Relevance', 'Example'],
      rows: [
        ['Injection', 'SQL, NoSQL, and command injection via user input', 'db.find({ $where: userInput })'],
        ['Broken Authentication', 'Weak JWT secrets, no rate limiting on login', 'jwt.sign(payload, "secret")'],
        ['Sensitive Data Exposure', 'Secrets in env, logs, or error messages', 'console.log(req.body) in production'],
        ['Security Misconfiguration', 'Missing headers, CORS wildcard, debug mode on', 'cors({ origin: "*" })'],
        ['XSS', 'Rendering unsanitized user input in HTML responses', 'res.send("<p>" + req.query.name + "</p>")'],
        ['Broken Access Control', 'Missing auth middleware on protected routes', 'app.delete("/user/:id", deleteUser)'],
        ['Insecure Dependencies', 'Outdated packages with known CVEs', 'npm audit shows high severity issues'],
        ['Prototype Pollution', 'Merging user objects into app state', 'Object.assign({}, req.body)'],
      ],
    },
    {
      type: 'heading',
      content: 'Input Validation and Sanitization',
    },
    {
      type: 'text',
      content: 'Never trust user input. Every value coming from a request -- body, query string, headers, params -- must be validated before use. Validation confirms the shape and type of data; sanitization removes or escapes dangerous characters.',
    },
    {
      type: 'list',
      items: [
        'joi -- schema-based validation with detailed error messages, widely used in Node.js',
        'zod -- TypeScript-first schema validation with excellent type inference',
        'validator.js -- focused string validation and sanitization utilities',
        'express-validator -- middleware wrappers around validator.js for Express routes',
        'Always validate on the server, even if you validate on the client -- client-side validation can be bypassed',
      ],
    },
    {
      type: 'example',
      title: 'Input validation with Joi schema',
      language: 'javascript',
      content: 'This example defines a Joi schema for a user registration body, then uses a reusable middleware function that validates req.body against any schema. When validation fails, Joi returns a detailed error message that is sent back as a 400 response without the request reaching the route handler.',
      code: `const Joi = require('joi');

// Define a validation schema
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[A-Z])(?=.*[0-9])/).required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter and one number',
    }),
  age: Joi.number().integer().min(13).max(120).optional(),
});

// Reusable validation middleware factory
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map(d => d.message);
      return res.status(400).json({ errors: messages });
    }
    req.body = value; // use the sanitized, coerced value
    next();
  };
}

// Use it in a route
app.post('/register', validate(registerSchema), async (req, res) => {
  const { username, email, password } = req.body;
  // At this point, input is validated and safe to use
  const user = await createUser({ username, email, password });
  res.status(201).json({ id: user.id });
});`,
    },
    {
      type: 'heading',
      content: 'SQL Injection and NoSQL Injection Prevention',
    },
    {
      type: 'text',
      content: 'Injection attacks happen when user-supplied data is interpreted as code or query logic instead of data. In SQL, this means constructing queries by string concatenation. In MongoDB, it means trusting objects from req.body as query filters.',
    },
    {
      type: 'table',
      headers: ['Attack Type', 'Vulnerable Pattern', 'Safe Pattern'],
      rows: [
        ['SQL Injection', 'db.query("SELECT * FROM users WHERE id = " + id)', 'db.query("SELECT * FROM users WHERE id = $1", [id])'],
        ['NoSQL Injection', 'User.findOne({ password: req.body.password })', 'Validate that password is a string before querying'],
        ['$where injection', 'db.find({ $where: "this.age > " + req.query.age })', 'Never use $where with user input -- use $gt operator'],
        ['Object injection', 'User.findOne(req.body)', 'Pick only expected fields: { email: req.body.email }'],
      ],
    },
    {
      type: 'heading',
      content: 'Command Injection Prevention',
    },
    {
      type: 'list',
      items: [
        'Never pass user input directly to child_process.exec() -- it runs in a shell and allows chaining with ; | &&',
        'Use child_process.execFile() or child_process.spawn() which do not invoke a shell',
        'If you must use exec, use a strict allowlist to validate input before passing it',
        'Avoid shell: true in spawn options when user input is involved',
        'Use libraries for tasks like image processing or file conversion instead of shelling out',
      ],
    },
    {
      type: 'heading',
      content: 'Security Headers with Helmet',
    },
    {
      type: 'text',
      content: 'HTTP response headers can significantly improve security. The helmet package sets over a dozen security headers in a single middleware call, each targeting a specific class of attack.',
    },
    {
      type: 'table',
      headers: ['Header Set by Helmet', 'What It Prevents'],
      rows: [
        ['Content-Security-Policy', 'XSS -- restricts which sources scripts, styles, and images can load from'],
        ['X-Frame-Options', 'Clickjacking -- prevents your page from being embedded in an iframe'],
        ['X-Content-Type-Options: nosniff', 'MIME sniffing -- forces browser to respect declared content type'],
        ['Strict-Transport-Security', 'Protocol downgrade -- forces HTTPS for a configurable duration'],
        ['Referrer-Policy', 'Information leakage -- controls how much URL info is sent in the Referer header'],
        ['X-XSS-Protection', 'Reflected XSS -- enables browser XSS filter (legacy browsers)'],
        ['Permissions-Policy', 'Feature abuse -- restricts access to browser APIs like camera, microphone'],
      ],
    },
    {
      type: 'example',
      title: 'Helmet middleware setup with custom CSP',
      language: 'javascript',
      content: 'This example shows how to add helmet to an Express app with a customized Content-Security-Policy. The default helmet() call enables safe defaults for all headers, and the contentSecurityPolicy option lets you define exactly which sources are permitted for scripts, styles, and other resource types.',
      code: `const express = require('express');
const helmet = require('helmet');

const app = express();

// Use helmet with custom Content-Security-Policy
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'strict-dynamic'"],
        styleSrc: ["'self'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    // Enforce HTTPS for 1 year, include subdomains
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// You can also use defaults (recommended starting point)
// app.use(helmet());

app.get('/', (req, res) => {
  res.json({ message: 'Secured with helmet' });
});`,
    },
    {
      type: 'heading',
      content: 'Rate Limiting',
    },
    {
      type: 'text',
      content: 'Rate limiting prevents brute-force attacks, credential stuffing, and denial-of-service by capping how many requests a client can make in a time window. The express-rate-limit package is the standard choice for Express applications.',
    },
    {
      type: 'example',
      title: 'Rate limiting setup for login and general API endpoints',
      language: 'javascript',
      content: 'This example creates two separate rate limiters: a tight limiter for the login endpoint that blocks brute-force password attempts, and a looser general limiter for the rest of the API. The skip option exempts trusted IPs, and handler sends a descriptive JSON error instead of the default HTML response.',
      code: `const rateLimit = require('express-rate-limit');

// Strict limiter for authentication endpoints
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // max 10 login attempts per window
  standardHeaders: true,     // return RateLimit-* headers
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
  // Skip successful requests so the window only counts failures
  skipSuccessfulRequests: true,
});

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute window
  max: 100,             // 100 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests. Please slow down.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
});

// Apply to routes
app.use('/api/', apiLimiter);
app.post('/api/auth/login', loginLimiter, loginController);

// For distributed systems, use a Redis store:
// const RedisStore = require('rate-limit-redis');
// store: new RedisStore({ client: redisClient })`,
    },
    {
      type: 'heading',
      content: 'CORS Configuration',
    },
    {
      type: 'text',
      content: 'Cross-Origin Resource Sharing (CORS) controls which domains can make requests to your API. Using a wildcard origin (*) in production allows any website to call your API, which defeats authentication schemes based on browser cookies and exposes your API to cross-site request attacks.',
    },
    {
      type: 'list',
      items: [
        'Never use cors({ origin: "*" }) in production -- specify an explicit allowlist of trusted origins',
        'Store allowed origins in environment variables, not hardcoded in source',
        'Only allow the methods and headers your API actually uses',
        'Set credentials: true only when you need to accept cookies, and pair it with an explicit origin (not *)',
        'Use different CORS configs for different environments (development vs. production)',
      ],
    },
    {
      type: 'heading',
      content: 'Dependency Security',
    },
    {
      type: 'text',
      content: 'The average Node.js project has hundreds of transitive dependencies. Each one is a potential attack vector. Dependency security is about reducing that surface area and catching vulnerabilities early.',
    },
    {
      type: 'example',
      title: 'Running npm audit and fixing vulnerabilities',
      language: 'bash',
      content: 'This shows the typical npm audit workflow: running an audit to see a vulnerability summary, using npm audit fix to auto-upgrade safe patches, checking what a breaking fix would do before applying it, and optionally using the Snyk CLI for deeper scanning with remediation advice.',
      code: `# Run security audit on your dependencies
npm audit

# Sample output:
# found 3 vulnerabilities (1 moderate, 2 high)
# Run "npm audit fix" to fix them

# Auto-fix vulnerabilities that only require patch/minor upgrades
npm audit fix

# See what breaking changes a full fix would make (review before applying)
npm audit fix --dry-run

# Force upgrades including major version bumps (review carefully)
npm audit fix --force

# Install Snyk for deeper scanning and monitoring
npm install -g snyk
snyk test          # scan current project
snyk monitor       # register project for continuous monitoring
snyk fix           # interactive fix wizard

# Add to CI/CD pipeline to fail builds on high severity
npm audit --audit-level=high

# Keep dependencies updated (use a tool like Dependabot or Renovate)
# Lock your exact versions in package-lock.json and commit it to git`,
    },
    {
      type: 'heading',
      content: 'Environment Variables and Secrets',
    },
    {
      type: 'list',
      items: [
        'Never hardcode secrets (API keys, DB passwords, JWT secrets) in source code',
        'Never commit .env files to version control -- add .env to .gitignore immediately',
        'Use dotenv in development and your hosting platform\'s secret manager in production',
        'Rotate secrets regularly, especially after any suspected exposure',
        'Use different secrets for each environment (development, staging, production)',
        'Set strict minimum permissions for service accounts -- only the access they actually need',
        'Scan your git history for accidentally committed secrets with tools like git-secrets or truffleHog',
      ],
    },
    {
      type: 'heading',
      content: 'Password Hashing with bcrypt',
    },
    {
      type: 'text',
      content: 'Passwords must never be stored in plain text or with fast hashing algorithms like MD5 or SHA-1. These can be cracked with precomputed tables (rainbow tables) in seconds. bcrypt is a slow, adaptive hashing function designed specifically for passwords -- it includes a salt and a cost factor that you can increase over time as hardware gets faster.',
    },
    {
      type: 'example',
      title: 'bcrypt password hashing and comparison',
      language: 'javascript',
      content: 'This example demonstrates the two core bcrypt operations: hashing a password during registration using a salt round of 12 (which makes each hash attempt take ~300ms, slowing brute-force attacks), and comparing a candidate password against the stored hash during login without ever needing to decrypt the hash.',
      code: `const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12; // higher = slower but more secure (10-14 is typical)

// --- Registration: hashing a password ---
async function hashPassword(plainTextPassword) {
  const hashed = await bcrypt.hash(plainTextPassword, SALT_ROUNDS);
  return hashed;
  // hashed looks like: $2b$12$KixRIaZ...  (60 characters)
}

// --- Login: verifying a password ---
async function verifyPassword(plainTextPassword, storedHash) {
  const isMatch = await bcrypt.compare(plainTextPassword, storedHash);
  return isMatch; // true or false
}

// --- In a route handler ---
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await hashPassword(password);
  await db.createUser({ email, password: hashedPassword });
  res.status(201).json({ message: 'User created' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.findUserByEmail(email);
  if (!user) {
    // Use same error message for missing user and wrong password
    // to prevent email enumeration
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const valid = await verifyPassword(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = generateJwt(user.id);
  res.json({ token });
});

// Why NOT MD5 or SHA1:
// - They are designed for speed (billions of hashes per second on a GPU)
// - No built-in salt means rainbow table attacks work
// - bcrypt is intentionally slow and always salted`,
    },
    {
      type: 'heading',
      content: 'JWT Security',
    },
    {
      type: 'list',
      items: [
        'Use strong, random secrets for signing -- at least 256 bits of entropy (not "secret" or "password")',
        'Set short expiration times -- 15 minutes for access tokens, longer for refresh tokens',
        'Never decode a JWT on the client and trust its contents without server verification',
        'Use HTTPS exclusively -- JWTs in transit over HTTP can be intercepted',
        'Store JWTs in httpOnly cookies to prevent XSS theft, not localStorage',
        'Include only necessary claims in the payload -- tokens are base64-encoded, not encrypted',
        'Validate iss (issuer) and aud (audience) claims in multi-service architectures',
        'Implement token revocation via a blocklist or short expiry plus refresh token rotation',
      ],
    },
    {
      type: 'heading',
      content: 'Avoiding Prototype Pollution',
    },
    {
      type: 'text',
      content: 'Prototype pollution attacks inject properties into Object.prototype by sending specially crafted JSON like {"__proto__": {"isAdmin": true}}. If your code merges or deep-copies user-supplied objects, those injected properties can appear on every object in your application, potentially bypassing security checks.',
    },
    {
      type: 'list',
      items: [
        'Avoid using generic deep merge functions (lodash < 4.17.15, jQuery < 3.4.0) with user input',
        'Use Object.create(null) for lookup maps to create objects with no prototype',
        'Use structuredClone() or JSON.parse(JSON.stringify(obj)) for safe deep copies',
        'Validate that incoming JSON does not contain __proto__, constructor, or prototype keys',
        'Use Joi or Zod schemas that pick only the fields your code expects',
        'Keep lodash and other utility libraries updated -- most had prototype pollution patches',
      ],
    },
    {
      type: 'tryit',
      title: 'Security Checklist',
      css: `*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;padding:16px;}
h1{font-size:17px;font-weight:700;color:#fff;margin-bottom:4px;}
.subtitle{font-size:12px;color:#64748b;margin-bottom:14px;}
.progress-bar-wrap{background:#1e293b;border-radius:20px;height:10px;margin-bottom:6px;overflow:hidden;}
.progress-bar{height:100%;border-radius:20px;background:#339933;transition:width 0.4s,background 0.4s;}
.progress-label{font-size:12px;color:#94a3b8;margin-bottom:16px;}
.checklist{display:flex;flex-direction:column;gap:6px;margin-bottom:16px;}
.item{background:#1e293b;border-radius:8px;border:1px solid #334155;cursor:pointer;transition:border-color 0.2s;}
.item.checked{border-color:#339933;background:#052e16;}
.item-header{display:flex;align-items:center;gap:10px;padding:10px 14px;}
.checkbox{width:18px;height:18px;border-radius:4px;border:2px solid #475569;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background 0.2s,border-color 0.2s;}
.item.checked .checkbox{background:#339933;border-color:#339933;}
.check-icon{width:10px;height:10px;fill:none;stroke:#fff;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;display:none;}
.item.checked .check-icon{display:block;}
.item-title{font-size:13px;font-weight:600;flex:1;}
.item.checked .item-title{color:#4ade80;}
.category{font-size:10px;padding:2px 8px;border-radius:10px;font-weight:700;}
.cat-auth{background:#1e3a5f;color:#60a5fa;}
.cat-input{background:#3b1f00;color:#fb923c;}
.cat-headers{background:#2d1a4e;color:#c084fc;}
.cat-deps{background:#1a2e1a;color:#4ade80;}
.cat-secrets{background:#3b2700;color:#fbbf24;}
.cat-network{background:#1a2d3b;color:#38bdf8;}
.detail{padding:0 14px 12px 42px;display:none;border-top:1px solid #1e293b;}
.item.open .detail{display:block;}
.detail-risk{font-size:12px;color:#f87171;margin-bottom:6px;}
.detail-fix{font-size:12px;color:#94a3b8;margin-bottom:8px;}
.detail-code{background:#0f172a;border-radius:6px;padding:8px 10px;font-family:monospace;font-size:11px;color:#7dd3fc;white-space:pre;overflow-x:auto;}`,
      js: `var items = [
  {
    title: "Use HTTPS in production",
    category: "network", catLabel: "Network",
    risk: "HTTP traffic can be intercepted (man-in-the-middle attacks), exposing tokens, passwords, and session data.",
    fix: "Terminate TLS at the load balancer or use Let's Encrypt with certbot. Enforce HTTPS with the HSTS header.",
    code: "app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));"
  },
  {
    title: "Add helmet security headers",
    category: "headers", catLabel: "Headers",
    risk: "Without security headers, browsers allow XSS payloads to run, pages to be framed (clickjacking), and content to be sniffed.",
    fix: "Add helmet as the first middleware in your Express app.",
    code: "const helmet = require('helmet');\napp.use(helmet());"
  },
  {
    title: "Configure CORS allowlist",
    category: "network", catLabel: "Network",
    risk: "A wildcard CORS origin (origin: '*') lets any website make authenticated requests to your API on behalf of a user.",
    fix: "Specify an explicit list of trusted origins. Never use '*' in production.",
    code: "app.use(cors({ origin: process.env.ALLOWED_ORIGINS.split(',') }));"
  },
  {
    title: "Rate limit authentication endpoints",
    category: "auth", catLabel: "Auth",
    risk: "Without rate limiting, attackers can attempt millions of password combinations against your login endpoint.",
    fix: "Apply a strict rate limiter (e.g., 10 requests per 15 minutes) on /login, /register, and /password-reset.",
    code: "const loginLimiter = rateLimit({ windowMs: 15*60*1000, max: 10 });\napp.post('/login', loginLimiter, loginHandler);"
  },
  {
    title: "Hash passwords with bcrypt",
    category: "auth", catLabel: "Auth",
    risk: "Plain text or fast-hashed (MD5/SHA1) passwords can be cracked in seconds using precomputed tables.",
    fix: "Use bcrypt with a cost factor of 12 or higher. Never store or log plain text passwords.",
    code: "const hashed = await bcrypt.hash(password, 12);\nconst valid = await bcrypt.compare(input, hashed);"
  },
  {
    title: "Validate all user input",
    category: "input", catLabel: "Input",
    risk: "Unvalidated input can lead to injection attacks, unexpected application behavior, or data corruption.",
    fix: "Use a schema validation library (Joi, Zod) to validate the type, format, and range of all incoming request data.",
    code: "const schema = Joi.object({ email: Joi.string().email().required() });\nconst { error } = schema.validate(req.body);"
  },
  {
    title: "Use parameterized queries",
    category: "input", catLabel: "Input",
    risk: "String-concatenated SQL queries allow attackers to inject arbitrary SQL, bypassing authentication or deleting data.",
    fix: "Always use parameterized queries or an ORM. Never build queries by string concatenation with user input.",
    code: "// Safe:\ndb.query('SELECT * FROM users WHERE id = $1', [userId]);\n// Unsafe:\ndb.query('SELECT * FROM users WHERE id = ' + userId);"
  },
  {
    title: "Avoid exec() with user input",
    category: "input", catLabel: "Input",
    risk: "child_process.exec() passes arguments through a shell, allowing attackers to chain commands with ; | && characters.",
    fix: "Use execFile() or spawn() which do not use a shell, or validate input against a strict allowlist.",
    code: "// Safe:\nconst { execFile } = require('child_process');\nexecFile('convert', [userFile, output], callback);"
  },
  {
    title: "Store secrets in environment variables",
    category: "secrets", catLabel: "Secrets",
    risk: "Hardcoded secrets in source code are committed to git and visible to anyone with repo access, including after deletion.",
    fix: "Use process.env for all secrets. Add .env to .gitignore. Use your platform's secret manager in production.",
    code: "// .env (never commit this)\nJWT_SECRET=a-long-random-string\n\n// Code\nconst secret = process.env.JWT_SECRET;"
  },
  {
    title: "Add .env to .gitignore",
    category: "secrets", catLabel: "Secrets",
    risk: "Committed .env files expose all secrets in your git history -- even if deleted later, they remain accessible via git log.",
    fix: "Add .env, .env.local, .env.production to .gitignore before the first commit.",
    code: "# .gitignore\n.env\n.env.*\n!.env.example"
  },
  {
    title: "Use short JWT expiry times",
    category: "auth", catLabel: "Auth",
    risk: "Long-lived JWTs that are stolen remain valid until expiry, with no way to revoke them without a blocklist.",
    fix: "Set access tokens to 15 minutes and use refresh tokens for session persistence.",
    code: "const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });"
  },
  {
    title: "Store JWTs in httpOnly cookies",
    category: "auth", catLabel: "Auth",
    risk: "Tokens stored in localStorage are accessible to JavaScript, making them easy to steal via XSS.",
    fix: "Use httpOnly, secure, sameSite cookies to store tokens so they are invisible to JavaScript.",
    code: "res.cookie('token', jwt, {\n  httpOnly: true,\n  secure: true,\n  sameSite: 'strict'\n});"
  },
  {
    title: "Run npm audit regularly",
    category: "deps", catLabel: "Deps",
    risk: "Outdated packages may contain known vulnerabilities (CVEs) that attackers can exploit remotely.",
    fix: "Run npm audit in CI/CD. Fail builds on high severity. Use Dependabot or Renovate for automated updates.",
    code: "# In CI:\nnpm audit --audit-level=high"
  },
  {
    title: "Sanitize against prototype pollution",
    category: "input", catLabel: "Input",
    risk: "JSON like {\"__proto__\":{\"isAdmin\":true}} can pollute Object.prototype, potentially bypassing authorization checks.",
    fix: "Validate input with strict schemas. Avoid deep-merging user objects. Keep lodash updated.",
    code: "// Block dangerous keys in Joi schema:\nJoi.object().unknown(false)\n  .pattern(/^((?!__proto__|constructor|prototype).)*$/, Joi.any());"
  },
  {
    title: "Use generic error messages in auth flows",
    category: "auth", catLabel: "Auth",
    risk: "Returning 'User not found' vs 'Wrong password' lets attackers enumerate valid email addresses.",
    fix: "Return the same error message and response time for both cases to prevent user enumeration.",
    code: "// Always return the same message:\nreturn res.status(401).json({ error: 'Invalid credentials' });"
  }
];

var checked = {};
var open = {};

function getCatClass(cat) {
  return 'cat-' + cat;
}

function render() {
  var total = items.length;
  var count = Object.keys(checked).filter(function(k) { return checked[k]; }).length;
  var pct = Math.round((count / total) * 100);
  var barColor = pct < 33 ? '#ef4444' : pct < 66 ? '#f59e0b' : '#339933';

  var html = '<h1>Node.js Security Checklist</h1>';
  html += '<p class="subtitle">Click any item to see the risk, fix, and example code.</p>';
  html += '<div class="progress-bar-wrap"><div class="progress-bar" style="width:' + pct + '%;background:' + barColor + '"></div></div>';
  html += '<div class="progress-label">' + count + ' / ' + total + ' items checked (' + pct + '%)</div>';
  html += '<div class="checklist">';

  items.forEach(function(item, i) {
    var isChecked = !!checked[i];
    var isOpen = !!open[i];
    var checkedClass = isChecked ? ' checked' : '';
    var openClass = isOpen ? ' open' : '';

    html += '<div class="item' + checkedClass + openClass + '" id="item-' + i + '">';
    html += '<div class="item-header" onclick="toggleOpen(' + i + ')">';
    html += '<div class="checkbox" onclick="event.stopPropagation();toggleCheck(' + i + ')">';
    html += '<svg class="check-icon" viewBox="0 0 12 12"><polyline points="1.5,6 4.5,9 10.5,3"/></svg>';
    html += '</div>';
    html += '<span class="item-title">' + item.title + '</span>';
    html += '<span class="category ' + getCatClass(item.category) + '">' + item.catLabel + '</span>';
    html += '</div>';

    if (isOpen) {
      html += '<div class="detail">';
      html += '<div class="detail-risk"><strong>Risk:</strong> ' + item.risk + '</div>';
      html += '<div class="detail-fix"><strong>Fix:</strong> ' + item.fix + '</div>';
      html += '<div class="detail-code">' + item.code.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</div>';
      html += '</div>';
    }

    html += '</div>';
  });

  html += '</div>';
  document.getElementById('output').innerHTML = html;
}

function toggleCheck(i) {
  checked[i] = !checked[i];
  render();
}

function toggleOpen(i) {
  open[i] = !open[i];
  render();
}

render();`,
    },
  ],
  exercises: [
    {
      id: 'nodejs-security-1',
      question: 'Which of the following is a safe way to query MongoDB with data from req.body?',
      type: 'multiple-choice',
      options: [
        'User.findOne(req.body)',
        'User.findOne({ email: req.body.email, password: req.body.password })',
        'const { email } = req.body; User.findOne({ email })',
        'User.find({ $where: "this.email == \'" + req.body.email + "\'" })',
      ],
      correct: 2,
      explanation: 'Destructuring only the expected field (email) and using it in a typed query prevents NoSQL injection. Option A passes the entire body as a query filter -- an attacker could send {"email": {"$gt": ""}} to match all documents. Option D uses $where with user input which is a critical NoSQL injection vulnerability.',
    },
    {
      id: 'nodejs-security-2',
      question: 'Why should you use bcrypt over SHA-256 for storing passwords?',
      type: 'multiple-choice',
      options: [
        'bcrypt produces shorter hashes that take less storage space',
        'bcrypt is intentionally slow and includes a salt, making brute-force attacks impractical',
        'bcrypt is reversible, so you can recover the original password if needed',
        'SHA-256 is deprecated and no longer available in Node.js',
      ],
      correct: 1,
      explanation: 'bcrypt is designed to be slow (each hash takes ~300ms with a cost factor of 12) and automatically generates a unique salt for each password. This makes brute-force and rainbow table attacks computationally infeasible. SHA-256 can compute billions of hashes per second on modern hardware, which makes it completely unsuitable for passwords.',
    },
    {
      id: 'nodejs-security-3',
      question: 'What does the helmet package do for an Express application?',
      type: 'multiple-choice',
      options: [
        'It encrypts all request and response bodies automatically',
        'It sets security-related HTTP response headers to protect against common web attacks',
        'It validates all incoming request bodies against a predefined schema',
        'It blocks all requests that do not come from a trusted IP address',
      ],
      correct: 1,
      explanation: 'helmet sets HTTP response headers like Content-Security-Policy, X-Frame-Options, Strict-Transport-Security, and X-Content-Type-Options. These headers instruct browsers to apply protections against XSS, clickjacking, protocol downgrade attacks, and MIME sniffing. It does not touch request or response bodies.',
    },
  ],
  quiz: [
    {
      id: 'nodejs-security-q1',
      question: 'An attacker sends a login request with the password {"$gt": ""}. What type of attack is this?',
      options: [
        'SQL injection',
        'Command injection',
        'NoSQL injection',
        'Prototype pollution',
      ],
      correct: 2,
      explanation: 'This is a NoSQL injection attack targeting MongoDB. The $gt operator means "greater than empty string", which matches any password value. If the application passes req.body.password directly into a MongoDB query without validating that it is a string, the attacker can bypass password authentication entirely.',
    },
    {
      id: 'nodejs-security-q2',
      question: 'Where should you store a JWT in the browser to best protect against XSS attacks?',
      options: [
        'localStorage',
        'sessionStorage',
        'A JavaScript variable in memory',
        'An httpOnly cookie',
      ],
      correct: 3,
      explanation: 'An httpOnly cookie cannot be read by JavaScript, so even if an XSS vulnerability exists, malicious scripts cannot steal the token. localStorage and sessionStorage are both accessible via JavaScript and are common XSS theft targets. Keeping the token only in a JS variable prevents XSS theft but loses the token on page refresh.',
    },
    {
      id: 'nodejs-security-q3',
      question: 'What is the purpose of setting a short expiration time on a JWT access token?',
      options: [
        'To reduce the size of the token payload',
        'To limit the window of exposure if a token is compromised or stolen',
        'To make the JWT signature stronger',
        'To comply with HTTP/2 header size limits',
      ],
      correct: 1,
      explanation: 'JWTs are stateless and cannot be individually revoked once issued. A short expiry (typically 15 minutes) means that even if a token is stolen, it becomes useless quickly. This is paired with a refresh token (stored securely, longer-lived) that issues new access tokens without requiring the user to log in again.',
    },
  ],
};
