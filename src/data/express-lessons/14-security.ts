import type { ExpressLesson } from '../express-curriculum';

export const expressSecurityLesson: ExpressLesson = {
  id: 'express-security',
  slug: 'security',
  chapter: 'advanced',
  order: 14,
  difficulty: 'intermediate',
  readingTime: 13,
  title: 'Express Security and Rate Limiting',
  description: 'Harden your Express API with security headers, rate limiting, CORS configuration, and input sanitization.',
  sections: [
    {
      type: 'text',
      content: 'A bare Express app exposes several attack surfaces out of the box. It sends an X-Powered-By header that advertises the server stack, it has no rate limiting so any endpoint can be brute-forced, it has no CORS policy so any origin can make requests, and it sets none of the HTTP security headers that modern browsers rely on to block XSS, clickjacking, and other client-side attacks.',
    },
    {
      type: 'heading',
      content: 'Helmet: Security Headers',
    },
    {
      type: 'text',
      content: 'Helmet is a collection of small middleware functions that each set or remove a specific HTTP response header. Calling app.use(helmet()) enables all of them at once with sensible defaults.',
    },
    {
      type: 'example',
      title: 'Install and enable Helmet',
      content: 'Installing Helmet adds a single middleware that automatically sets dozens of security-related response headers, protecting clients from a wide range of common web attacks without any additional configuration.',
      language: 'bash',
      code: `npm install helmet`,
    },
    {
      type: 'table',
      headers: ['Header set by Helmet', 'Attack it prevents'],
      rows: [
        ['Content-Security-Policy', 'XSS - restricts which scripts and resources can load'],
        ['X-Frame-Options', 'Clickjacking - blocks your page from being embedded in iframes'],
        ['X-Content-Type-Options', 'MIME sniffing - forces browser to respect declared content type'],
        ['Strict-Transport-Security', 'Protocol downgrade - forces HTTPS for a defined duration'],
        ['Referrer-Policy', 'Information leakage - controls how much referrer info is sent'],
        ['X-DNS-Prefetch-Control', 'DNS prefetch privacy - disables automatic DNS lookups'],
        ['X-Download-Options', 'Drive-by downloads in IE - prevents auto-opening downloads'],
        ['Cross-Origin-Opener-Policy', 'Cross-origin attacks - isolates browsing context'],
      ],
    },
    {
      type: 'heading',
      content: 'CORS with the cors Package',
    },
    {
      type: 'text',
      content: 'CORS (Cross-Origin Resource Sharing) is a browser mechanism that blocks JavaScript from reading responses from a different origin unless the server explicitly allows it. Without CORS configuration, only same-origin requests work. You need to configure which origins, methods, and headers are permitted - and handle the preflight OPTIONS request.',
    },
    {
      type: 'example',
      title: 'Install cors',
      content: 'The cors package provides a middleware that sets the Access-Control-Allow-Origin and related headers automatically based on a configuration object you provide.',
      language: 'bash',
      code: `npm install cors`,
    },
    {
      type: 'heading',
      content: 'Rate Limiting with express-rate-limit',
    },
    {
      type: 'text',
      content: 'Rate limiting caps how many requests an IP address can make in a given time window. The windowMs option sets the window length in milliseconds, max sets the request limit per window, and standardHeaders adds rate limit information to the response headers. A lower limit on sensitive endpoints like /login protects against brute-force password attacks.',
    },
    {
      type: 'example',
      title: 'Install express-rate-limit',
      content: 'express-rate-limit is a lightweight middleware that stores request counts in memory by default and automatically sends a 429 Too Many Requests response when the limit is exceeded.',
      language: 'bash',
      code: `npm install express-rate-limit`,
    },
    {
      type: 'heading',
      content: 'Brute Force Protection',
    },
    {
      type: 'text',
      content: 'Apply a strict rate limit specifically to authentication endpoints. Your general API might allow 100 requests per 15 minutes, but /login should be restricted to 5 or 10 attempts per 15 minutes. This still allows legitimate users to log in while making a dictionary attack impractical.',
    },
    {
      type: 'heading',
      content: 'Input Sanitization with express-validator',
    },
    {
      type: 'text',
      content: 'express-validator provides sanitize chains that clean input before it reaches your route logic. trim() removes leading and trailing whitespace, normalizeEmail() lowercases email addresses and strips unnecessary characters, and escape() converts HTML special characters to entities, preventing stored XSS.',
    },
    {
      type: 'heading',
      content: 'Hiding the Server Fingerprint',
    },
    {
      type: 'text',
      content: 'By default Express sends X-Powered-By: Express in every response. This fingerprint tells attackers exactly what framework to target. One line disables it: app.disable("x-powered-by"). Helmet also removes it, but calling disable() directly makes the intent explicit.',
    },
    {
      type: 'heading',
      content: 'HTTPS Redirect in Production',
    },
    {
      type: 'text',
      content: 'When running behind a proxy like a load balancer, Express sees all requests as HTTP. Add a middleware that checks the X-Forwarded-Proto header and redirects to HTTPS if the original request was not secure. Set app.set("trust proxy", 1) so Express trusts the proxy headers.',
    },
    {
      type: 'example',
      title: 'Full Helmet setup',
      content: 'Calling app.use(helmet()) with default settings enables all built-in protections at once. You can pass an options object to fine-tune individual headers, such as providing your own Content-Security-Policy directives or disabling a header that conflicts with your setup.',
      language: 'javascript',
      code: `const express = require('express');
const helmet = require('helmet');

const app = express();

// Enable all Helmet headers with defaults
app.use(helmet());

// Or customize specific headers:
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "cdn.example.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    }
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Remove Express fingerprint (also done by Helmet, explicit here for clarity)
app.disable('x-powered-by');

app.listen(3000);`,
    },
    {
      type: 'example',
      title: 'Rate limiting for general API and login endpoint',
      content: 'Two separate limiter instances allow different thresholds: a generous limit for general API use and a strict limit on the login route. The skipSuccessfulRequests option on the login limiter means only failed attempts count toward the cap.',
      language: 'javascript',
      code: `const rateLimit = require('express-rate-limit');

// General API limiter: 100 requests per 15 minutes per IP
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,   // Return rate limit info in headers
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

// Strict login limiter: 5 failed attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: { error: 'Too many login attempts. Please try again in 15 minutes.' }
});

app.use('/api/', apiLimiter);
app.post('/login', loginLimiter, authController.login);
app.post('/register', loginLimiter, authController.register);`,
    },
    {
      type: 'example',
      title: 'CORS configuration with origin allowlist',
      content: 'The origin function receives the requesting origin and calls the callback with true to allow or an error to block. Listing allowed origins explicitly is safer than a wildcard because it prevents unexpected origins from reading your API responses.',
      language: 'javascript',
      code: `const cors = require('cors');

const allowedOrigins = [
  'https://myapp.com',
  'https://www.myapp.com',
  'http://localhost:3000', // development only
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (curl, Postman, same-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,         // Allow cookies and auth headers
  maxAge: 86400,             // Cache preflight for 24 hours
};

app.use(cors(corsOptions));`,
    },
    {
      type: 'example',
      title: 'express-validator sanitization chain',
      content: 'Sanitization chains run before your route logic and modify the incoming values in place. Validation chains check values and populate the errors object that validationResult() returns, letting you reject bad input with a clear 400 response.',
      language: 'javascript',
      code: `const { body, validationResult } = require('express-validator');

const registerSanitizers = [
  body('name')
    .trim()
    .escape()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2-50 characters'),

  body('email')
    .normalizeEmail()
    .isEmail()
    .withMessage('Invalid email address'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];

app.post('/register', registerSanitizers, function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // req.body.name, req.body.email are now sanitized
  res.json({ message: 'Registration successful' });
});`,
    },
    {
      type: 'warning',
      title: 'HTTPS in production',
      content: 'Always serve your API over HTTPS in production. HTTP exposes tokens, passwords, and sensitive data to anyone who can intercept the network traffic. Use a reverse proxy (nginx, Caddy) or your cloud provider to terminate TLS before requests reach Express.',
    },
    {
      type: 'tip',
      title: 'Use all layers together',
      content: 'Security is defense in depth. Use Helmet for headers, CORS for origin control, rate limiting for brute-force protection, and input sanitization for XSS prevention. No single layer is sufficient on its own.',
    },
    {
      type: 'tryit',
      title: 'Security Headers Inspector',
      css: `body{font-family:system-ui,sans-serif;padding:20px;margin:0;background:#f0f0f0;}
.sec-demo{max-width:720px;margin:0 auto;}
.panel{background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);margin-bottom:16px;}
.panel-header{background:#000;color:#fff;padding:14px 20px;font-size:15px;font-weight:700;display:flex;justify-content:space-between;align-items:center;}
.score-badge{background:#4ade80;color:#000;padding:4px 12px;border-radius:20px;font-size:13px;font-weight:700;}
.score-badge.low{background:#fca5a5;color:#7f1d1d;}
.score-badge.mid{background:#fde68a;color:#78350f;}
.panel-body{padding:20px;}
.toggle-list{margin-bottom:20px;}
.toggle-row{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:8px;border:1px solid #e8e8e8;margin-bottom:8px;background:#fafafa;}
.toggle-label{font-size:13px;font-weight:600;color:#333;}
.toggle-desc{font-size:11px;color:#888;margin-top:2px;}
.toggle{position:relative;width:40px;height:22px;flex-shrink:0;}
.toggle input{opacity:0;width:0;height:0;}
.slider{position:absolute;cursor:pointer;inset:0;background:#ccc;border-radius:22px;transition:.3s;}
.slider:before{content:"";position:absolute;height:16px;width:16px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:.3s;}
input:checked+.slider{background:#000;}
input:checked+.slider:before{transform:translateX(18px);}
.btn{padding:10px 20px;background:#000;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;width:100%;margin-bottom:16px;}
.btn:hover{background:#333;}
.response-panel{background:#1a1a1a;border-radius:8px;padding:16px;font-family:monospace;font-size:12px;line-height:1.8;}
.h-present{color:#4ade80;}
.h-absent{color:#f87171;}
.h-status{color:#60a5fa;}`,
      js: `var headers = [
  { key:'Content-Security-Policy', desc:'Blocks XSS by restricting script sources', enabled:true },
  { key:'X-Frame-Options', desc:'Prevents clickjacking via iframes', enabled:true },
  { key:'X-Content-Type-Options', desc:'Stops MIME-type sniffing attacks', enabled:true },
  { key:'Strict-Transport-Security', desc:'Forces HTTPS for future requests', enabled:false },
  { key:'Referrer-Policy', desc:'Controls referrer information leakage', enabled:true },
  { key:'X-DNS-Prefetch-Control', desc:'Reduces DNS prefetch privacy leaks', enabled:false },
  { key:'Cross-Origin-Opener-Policy', desc:'Isolates browsing context from cross-origin', enabled:false },
  { key:'X-Powered-By', desc:'Remove Express fingerprint (absent = good)', enabled:false }
];

function calcScore() {
  var on = headers.filter(function(h){return h.enabled;}).length;
  // X-Powered-By absent = good, so invert its logic for scoring
  return on;
}

function getScoreClass(score) {
  if (score >= 6) return '';
  if (score >= 3) return 'mid';
  return 'low';
}

function showHeaders() {
  headers.forEach(function(h,i){
    var el = document.getElementById('toggle-'+i);
    if(el) h.enabled = el.checked;
  });

  var score = calcScore();
  var scoreEl = document.getElementById('scoreEl');
  scoreEl.textContent = 'Score: '+score+'/8';
  scoreEl.className = 'score-badge '+getScoreClass(score);

  var lines = '<span class=\\"h-status\\">HTTP/1.1 200 OK</span>\\\ ';
  lines += '<span style=\\"color:#e2e8f0\\">Content-Type: application/json</span>\\\ ';
  lines += '<span style=\\"color:#e2e8f0\\">Date: '+new Date().toUTCString()+'</span>\\\ \\\ ';
  lines += '<span style=\\"color:#94a3b8\\">// Security Headers (via Helmet)</span>\\\ ';

  headers.forEach(function(h){
    if (h.key === 'X-Powered-By') {
      if (!h.enabled) {
        lines += '<span class=\\"h-present\\">// X-Powered-By: [REMOVED] - good</span>\\\ ';
      } else {
        lines += '<span class=\\"h-absent\\">X-Powered-By: Express  // exposes stack</span>\\\ ';
      }
    } else {
      if (h.enabled) {
        lines += '<span class=\\"h-present\\">'+h.key+': [enabled]</span>\\\ ';
      } else {
        lines += '<span class=\\"h-absent\\">// '+h.key+': [missing]</span>\\\ ';
      }
    }
  });

  document.getElementById('responsePanel').innerHTML = lines;
}

var toggleHtml = '';
headers.forEach(function(h,i){
  toggleHtml += '<div class=\\"toggle-row\\">';
  toggleHtml += '<div><div class=\\"toggle-label\\">'+h.key+'</div><div class=\\"toggle-desc\\">'+h.desc+'</div></div>';
  toggleHtml += '<label class=\\"toggle\\"><input type=\\"checkbox\\" id=\\"toggle-'+i+'\\"'+(h.enabled?' checked':'')+' onchange=\\"showHeaders()\\"><span class=\\"slider\\"></span></label>';
  toggleHtml += '</div>';
});

document.getElementById('output').innerHTML =
  '<div class=\\"sec-demo\\">' +
  '<div class=\\"panel\\">' +
  '<div class=\\"panel-header\\"><span>Security Headers Checklist</span><span class=\\"score-badge\\" id=\\"scoreEl\\">Score: -/8</span></div>' +
  '<div class=\\"panel-body\\">' +
  '<div class=\\"toggle-list\\">'+toggleHtml+'</div>' +
  '<button class=\\"btn\\" onclick=\\"showHeaders()\\">View Response Headers</button>' +
  '<div class=\\"response-panel\\" id=\\"responsePanel\\"><span style=\\"color:#888\\">Click \\"View Response Headers\\" to inspect the HTTP response...</span></div>' +
  '</div>' +
  '</div>' +
  '</div>';

showHeaders();`,
    },
  ],
  exercises: [
    {
      id: 'express-security-1',
      question: 'What does Helmet primarily do for an Express application?',
      type: 'multiple-choice',
      options: [
        'It encrypts the database connection',
        'It sets HTTP security response headers',
        'It validates and sanitizes user input',
        'It manages user sessions',
      ],
      correct: 1,
      explanation: 'Helmet sets HTTP security headers like Content-Security-Policy, X-Frame-Options, and Strict-Transport-Security. These headers instruct browsers to apply protections against XSS, clickjacking, and protocol downgrade attacks.',
    },
    {
      id: 'express-security-2',
      question: 'What HTTP status code does express-rate-limit send when the limit is exceeded?',
      type: 'multiple-choice',
      options: ['400 Bad Request', '401 Unauthorized', '403 Forbidden', '429 Too Many Requests'],
      correct: 3,
      explanation: 'express-rate-limit responds with 429 Too Many Requests when an IP address exceeds the configured request limit within the time window. This is the RFC-specified status code for rate limiting.',
    },
    {
      id: 'express-security-3',
      question: 'Which express-validator sanitizer prevents stored XSS by converting HTML special characters to entities?',
      type: 'multiple-choice',
      options: ['trim()', 'normalizeEmail()', 'escape()', 'stripLow()'],
      correct: 2,
      explanation: 'escape() converts characters like <, >, &, ", and \' into their HTML entity equivalents. If sanitized input is later rendered in HTML, these entities are displayed as text rather than parsed as HTML tags.',
    },
  ],
  quiz: [
    {
      id: 'express-security-q1',
      question: 'Why should you call app.disable("x-powered-by") in production?',
      options: [
        'It improves performance by reducing response size',
        'It prevents the framework version from being advertised to attackers',
        'It is required for HTTPS to work correctly',
        'It enables CORS for all origins automatically',
      ],
      correct: 1,
      explanation: 'The X-Powered-By: Express header reveals the technology stack to anyone inspecting responses. Removing it makes it slightly harder for automated scanners to fingerprint your server and target framework-specific vulnerabilities.',
    },
    {
      id: 'express-security-q2',
      question: 'What is the purpose of the CORS preflight request?',
      options: [
        'To authenticate the user before the real request',
        'To check whether the server allows the actual cross-origin request method and headers',
        'To pre-warm the server connection for faster responses',
        'To validate the request body before it is sent',
      ],
      correct: 1,
      explanation: 'Before sending certain cross-origin requests (non-simple methods or custom headers), the browser sends an OPTIONS preflight request. The server responds with CORS headers indicating what is allowed. Only if the preflight succeeds does the browser send the actual request.',
    },
    {
      id: 'express-security-q3',
      question: 'Why apply a stricter rate limit to login routes compared to general API routes?',
      options: [
        'Login routes are slower to process so they need fewer concurrent requests',
        'To prevent brute-force attacks that try many password combinations',
        'Because login responses are larger and consume more bandwidth',
        'Authentication headers require extra processing time',
      ],
      correct: 1,
      explanation: 'A brute-force attack tries thousands of password combinations against a login endpoint. A strict rate limit (e.g., 5 attempts per 15 minutes) makes this impractical without blocking legitimate users who rarely fail more than one or two login attempts.',
    },
  ],
};
