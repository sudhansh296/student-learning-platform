import type { RestapiLesson } from '../restapi-curriculum';

export const lesson07: RestapiLesson = {
  id: 'restapi-07',
  title: 'API Authentication and Authorization',
  slug: '07-authentication',
  chapter: 'building',
  order: 7,
  difficulty: 'intermediate',
  readingTime: 13,
  description: 'Secure your REST API using API keys, JWT tokens, and OAuth — and understand the difference between authentication and authorization.',
  sections: [
    {
      type: 'text',
      content: 'Every non-public API needs to know two things: who is making the request, and what they are allowed to do. These are two separate concerns with two separate names. Mixing them up leads to security holes and confusing error responses.'
    },
    {
      type: 'heading',
      content: 'Authentication vs Authorization'
    },
    {
      type: 'analogy',
      title: 'The hotel key card analogy',
      content: 'Authentication is checking in at the hotel front desk and proving your identity with an ID — you receive a key card. Authorization is the key card itself deciding which doors you can open. The front desk does not follow you around; the key card handles access. In APIs: authentication verifies identity (who are you?), authorization enforces permissions (what can you do?).'
    },
    {
      type: 'table',
      title: 'Authentication vs Authorization',
      headers: ['', 'Authentication', 'Authorization'],
      rows: [
        ['Question', 'Who are you?', 'What can you do?'],
        ['Answers with', 'Identity (user ID, email)', 'Permissions (roles, scopes)'],
        ['HTTP status on failure', '401 Unauthorized', '403 Forbidden'],
        ['Mechanism', 'Token, API key, password', 'Role check, scope check, policy']
      ]
    },
    {
      type: 'heading',
      content: 'API Keys'
    },
    {
      type: 'text',
      content: 'API keys are long random strings issued to a client application. They identify the application (not a specific user) and are the simplest form of API authentication. Most public APIs like Google Maps, OpenWeatherMap, and Stripe use API keys. They are easy to issue, rotate, and revoke.'
    },
    {
      type: 'text',
      content: 'Always put API keys in a custom request header (X-API-Key is the common convention), never in a URL query parameter. URLs are logged by every proxy, load balancer, and browser history — putting a secret in a URL leaks it everywhere.'
    },
    {
      type: 'example',
      title: 'API key in a custom request header',
      content: 'Sending the API key in a custom X-API-Key header keeps it out of server logs and browser history, which would otherwise expose it whenever the URL is recorded. The server reads this header on every request to identify and rate-limit the calling application.',
      code: `// API key in a custom header (recommended)
const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=London', {
  headers: {
    'X-API-Key': 'your-api-key-here'
  }
});

// Some APIs use Authorization: ApiKey instead
const response2 = await fetch('https://api.example.com/data', {
  headers: {
    'Authorization': 'ApiKey your-api-key-here'
  }
});

// NEVER do this — key visible in server logs and browser history:
// fetch('https://api.example.com/data?api_key=your-secret-key')`,
      language: 'javascript',
      output: 'API key is sent in the header on every request, never in the URL'
    },
    {
      type: 'heading',
      content: 'Basic Auth'
    },
    {
      type: 'text',
      content: 'HTTP Basic Authentication sends a username and password encoded in Base64 as the Authorization header value. It is supported by every HTTP client but should only be used over HTTPS — Base64 is not encryption, it can be decoded trivially. Basic Auth is common for internal tooling and simple scripts, but not recommended for user-facing APIs.'
    },
    {
      type: 'heading',
      content: 'Bearer Tokens and JWT'
    },
    {
      type: 'text',
      content: 'The most common modern approach is the Bearer token scheme. After the user authenticates (provides credentials), the server issues a token. The client stores that token and sends it with every subsequent request in the Authorization header. The server validates the token without touching a database on every request.'
    },
    {
      type: 'example',
      title: 'Authorization header with Bearer token',
      content: 'The Bearer scheme places the token directly after the word "Bearer" with a space. This header is checked on every protected endpoint — middleware on the server decodes and validates the token before the route handler runs, so the handler can trust req.user.',
      code: `// Login: send credentials, receive token
const loginRes = await fetch('https://api.example.com/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'alice@example.com', password: 'secret123' })
});
const { token } = await loginRes.json();
// token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// All subsequent requests include the token
const profileRes = await fetch('https://api.example.com/profile', {
  headers: {
    'Authorization': 'Bearer ' + token,
    'Accept': 'application/json'
  }
});
const profile = await profileRes.json();`,
      language: 'javascript',
      output: `Login -> 200 { token: "eyJhbGc..." }
GET /profile with Bearer -> 200 { id: 1, name: 'Alice', role: 'admin' }`
    },
    {
      type: 'heading',
      content: 'JWT Anatomy'
    },
    {
      type: 'text',
      content: 'A JSON Web Token (JWT) has three parts separated by dots: header.payload.signature. The header declares the token type and signing algorithm. The payload holds claims — facts about the user. The signature proves the token was issued by your server and has not been tampered with. The header and payload are Base64Url-encoded JSON, not encrypted — never put secrets in a JWT payload.'
    },
    {
      type: 'example',
      title: 'JWT structure breakdown',
      content: 'Splitting a JWT by the dot separator reveals three distinct Base64Url-encoded parts. The header and payload are plain JSON after decoding — readable by anyone. Only the signature is cryptographically protected, and it is what prevents clients from forging or modifying tokens.',
      code: `// A real JWT token:
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzQyIiwibmFtZSI6IkFsaWNlIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzI0MDc3MjAwLCJleHAiOjE3MjQwODA4MDB9.abc123signature

// Part 1 — Header (Base64Url decoded):
{
  "alg": "HS256",   // signing algorithm
  "typ": "JWT"      // token type
}

// Part 2 — Payload (Base64Url decoded):
{
  "sub": "user_42",          // subject: who this token is about
  "name": "Alice Johnson",
  "role": "admin",
  "iss": "api.example.com",  // issuer
  "iat": 1724077200,         // issued at (Unix timestamp)
  "exp": 1724080800          // expiry (Unix timestamp)
}

// Part 3 — Signature:
// HMACSHA256(base64(header) + "." + base64(payload), secretKey)
// Only the server can verify this without the secret`,
      language: 'javascript',
      output: 'header.payload are readable; signature is what prevents forgery'
    },
    {
      type: 'heading',
      content: 'JWT Claims Reference'
    },
    {
      type: 'table',
      title: 'Standard JWT payload claims',
      headers: ['Claim', 'Full name', 'Purpose'],
      rows: [
        ['sub', 'Subject', 'Unique identifier of the user this token represents'],
        ['iss', 'Issuer', 'Who issued the token (your API domain)'],
        ['iat', 'Issued At', 'Unix timestamp when the token was created'],
        ['exp', 'Expiration', 'Unix timestamp when the token stops being valid'],
        ['nbf', 'Not Before', 'Token is not valid before this timestamp'],
        ['jti', 'JWT ID', 'Unique token ID — used for token revocation'],
        ['role', 'Custom', 'User role (custom claim — not in the standard)']
      ]
    },
    {
      type: 'example',
      title: 'Checking token expiry in JavaScript',
      content: 'Because the JWT payload is just Base64-encoded JSON, you can decode and inspect it in the browser without any library. This pattern is useful for checking expiry before making an API call, avoiding a round-trip that would return 401.',
      code: `function parseJwt(token) {
  // JWT has 3 parts: header.payload.signature
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format');

  // Payload is the second part — Base64Url encoded JSON
  // Replace URL-safe chars and pad to standard Base64
  const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const json = atob(base64);
  return JSON.parse(json);
}

function isTokenExpired(token) {
  try {
    const payload = parseJwt(token);
    if (!payload.exp) return false; // no expiry set
    const nowSeconds = Math.floor(Date.now() / 1000);
    return payload.exp < nowSeconds;
  } catch {
    return true; // malformed token counts as expired
  }
}

// Usage
const token = localStorage.getItem('authToken');
if (isTokenExpired(token)) {
  // Redirect to login or use refresh token
  redirectToLogin();
} else {
  // Safe to use the token
  makeAuthenticatedRequest(token);
}`,
      language: 'javascript',
      output: `isTokenExpired("eyJ...validToken...") -> false
isTokenExpired("eyJ...expiredToken...") -> true`
    },
    {
      type: 'heading',
      content: 'OAuth 2.0 Overview'
    },
    {
      type: 'text',
      content: 'OAuth 2.0 is a framework for letting users grant third-party applications limited access to their account without sharing their password. It is the protocol behind "Sign in with Google" and "Connect with GitHub" flows. The most common variant is the Authorization Code flow.'
    },
    {
      type: 'list',
      title: 'OAuth 2.0 Authorization Code flow steps:',
      items: [
        '1. Your app redirects the user to the provider (Google, GitHub) with a client_id and requested scopes',
        '2. The user logs in and approves the permissions your app requested',
        '3. The provider redirects back to your app with a short-lived authorization code in the URL',
        '4. Your app server exchanges the code for an access token (and refresh token) in a server-to-server POST request',
        '5. Your app uses the access token to call the provider API on behalf of the user',
        '6. When the access token expires, use the refresh token to get a new one silently'
      ]
    },
    {
      type: 'heading',
      content: 'Refresh Tokens'
    },
    {
      type: 'text',
      content: 'Access tokens are short-lived (15 minutes to 1 hour) to limit damage if stolen. Refresh tokens are long-lived (days or weeks) and are used only to obtain new access tokens. Store refresh tokens in httpOnly cookies or secure server-side storage, never in localStorage. On access token expiry, call POST /auth/refresh with the refresh token to get a new access token without forcing the user to log in again.'
    },
    {
      type: 'heading',
      content: 'Security Best Practices'
    },
    {
      type: 'list',
      title: 'API authentication security checklist:',
      items: [
        'Always use HTTPS — tokens sent over HTTP can be intercepted',
        'Never put tokens or API keys in URLs — they end up in logs, browser history, and referrer headers',
        'Set short expiry on access tokens (15 minutes is common)',
        'Use the httpOnly cookie flag for refresh tokens — prevents JavaScript from accessing them',
        'Validate the exp, iss, and aud claims on every incoming JWT',
        'Rotate and revoke API keys immediately if they are compromised',
        'Use environment variables for secrets — never commit them to source control'
      ]
    },
    {
      type: 'tryit',
      title: 'JWT Decoder Tool',
      js: `document.body.innerHTML = '<div><h3>JWT Decoder</h3><div class=\\"input-row\\"><input id=\\"jwt-input\\" type=\\"text\\" placeholder=\\"Paste JWT token here...\\" /><button id=\\"decode-btn\\">Decode</button><button id=\\"sample-btn\\">Load Sample</button></div><div id=\\"jwt-output\\"></div></div>';

var SAMPLE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzQyIiwibmFtZSI6IkFsaWNlIEpvaG5zb24iLCJlbWFpbCI6ImFsaWNlQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaXNzIjoiYXBpLmV4YW1wbGUuY29tIiwiaWF0IjoxNzI0MDc3MjAwLCJleHAiOjE3MjQwODA4MDB9.demo_signature_not_real';

var CLAIM_DESCRIPTIONS = {
  sub: 'Subject - who this token represents',
  iss: 'Issuer - who created the token',
  iat: 'Issued At - when the token was created',
  exp: 'Expiration - when the token expires',
  nbf: 'Not Before - token not valid before this time',
  jti: 'JWT ID - unique token identifier',
  aud: 'Audience - intended recipient of the token',
  name: 'Display name of the user',
  email: 'Email address of the user',
  role: 'User role or permission level',
  alg: 'Algorithm used to sign the token',
  typ: 'Token type'
};

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function base64Decode(str) {
  var base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  var pad = base64.length % 4;
  if (pad === 2) base64 += '==';
  else if (pad === 3) base64 += '=';
  try {
    return decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } catch(e) {
    return atob(base64);
  }
}

function formatValue(key, val) {
  if ((key === 'iat' || key === 'exp' || key === 'nbf') && typeof val === 'number') {
    var d = new Date(val * 1000);
    return escHtml(String(val)) + ' <span class=\\"ts-human\\">(' + d.toUTCString() + ')</span>';
  }
  return escHtml(JSON.stringify(val));
}

function renderPanel(obj, title, color) {
  var rows = Object.keys(obj).map(function(k) {
    var desc = CLAIM_DESCRIPTIONS[k] || k;
    return '<tr>' +
      '<td class=\\"claim-key\\">' + escHtml(k) + '</td>' +
      '<td class=\\"claim-val\\">' + formatValue(k, obj[k]) + '</td>' +
      '<td class=\\"claim-desc\\">' + escHtml(desc) + '</td>' +
      '</tr>';
  }).join('');
  return '<div class=\\"jwt-panel\\"><div class=\\"jwt-panel-title\\" style=\\"background:' + color + '\\">' + title + '</div>' +
    '<table class=\\"claim-table\\"><thead><tr><th>Claim</th><th>Value</th><th>Description</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table></div>';
}

function decode() {
  var input = document.getElementById('jwt-input').value.trim();
  var output = document.getElementById('jwt-output');
  var parts = input.split('.');
  if (parts.length !== 3) {
    output.innerHTML = '<div class=\\"decode-error\\">Invalid JWT format. A JWT must have exactly 3 parts separated by dots.</div>';
    return;
  }
  try {
    var header = JSON.parse(base64Decode(parts[0]));
    var payload = JSON.parse(base64Decode(parts[1]));
    var expStatus = '';
    if (payload.exp) {
      var now = Math.floor(Date.now() / 1000);
      expStatus = payload.exp < now
        ? '<div class=\\"exp-badge expired\\">Token has EXPIRED</div>'
        : '<div class=\\"exp-badge valid\\">Token is VALID (not expired)</div>';
    }
    output.innerHTML = expStatus + '<div class=\\"panels-row\\">' + renderPanel(header, 'Header', '#6366f1') + renderPanel(payload, 'Payload', '#10b981') + '</div>' +
      '<div class=\\"sig-note\\"><span class=\\"sig-label\\">Signature</span> ' + escHtml(parts[2].substring(0, 30)) + '... (verify with your server secret)</div>';
  } catch(e) {
    output.innerHTML = '<div class=\\"decode-error\\">Could not decode: ' + escHtml(e.message) + '</div>';
  }
}

document.getElementById('decode-btn').addEventListener('click', decode);
document.getElementById('sample-btn').addEventListener('click', function() {
  document.getElementById('jwt-input').value = SAMPLE_JWT;
  decode();
});`,
      css: `body { font-family: system-ui, sans-serif; padding: 14px; background: #f8fafc; }
h3 { color: #1e293b; margin: 0 0 10px 0; font-size: 15px; }
.input-row { display: flex; gap: 8px; margin-bottom: 10px; }
#jwt-input { flex: 1; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-family: monospace; font-size: 11px; color: #334155; }
#decode-btn { background: #6366f1; color: white; border: none; padding: 8px 14px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px; white-space: nowrap; }
#decode-btn:hover { background: #4f46e5; }
#sample-btn { background: #f1f5f9; border: 1px solid #cbd5e1; color: #334155; padding: 8px 14px; border-radius: 6px; font-size: 13px; cursor: pointer; white-space: nowrap; }
#sample-btn:hover { background: #e2e8f0; }
.exp-badge { padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; margin-bottom: 10px; display: inline-block; }
.exp-badge.valid { background: #dcfce7; color: #166534; }
.exp-badge.expired { background: #fee2e2; color: #991b1b; }
.panels-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
.jwt-panel { background: white; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; }
.jwt-panel-title { color: white; font-size: 12px; font-weight: 700; padding: 6px 12px; letter-spacing: 0.5px; }
.claim-table { width: 100%; border-collapse: collapse; font-size: 11px; }
.claim-table th { background: #f8fafc; padding: 5px 8px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; border-bottom: 1px solid #e2e8f0; }
.claim-table td { padding: 5px 8px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
.claim-key { font-family: monospace; font-weight: 700; color: #6366f1; white-space: nowrap; }
.claim-val { font-family: monospace; color: #10b981; word-break: break-all; }
.claim-desc { color: #64748b; font-size: 10px; }
.ts-human { color: #94a3b8; font-size: 10px; font-family: system-ui, sans-serif; }
.sig-note { background: #1e293b; color: #94a3b8; padding: 8px 12px; border-radius: 6px; font-family: monospace; font-size: 11px; }
.sig-label { background: #334155; color: #f8fafc; padding: 2px 8px; border-radius: 4px; margin-right: 8px; font-weight: 700; }
.decode-error { background: #fee2e2; color: #991b1b; padding: 10px 14px; border-radius: 6px; font-size: 13px; }`
    }
  ],
  exercises: [
    {
      id: 'ex-07-1',
      question: 'A user is logged in and sends a request to DELETE /users/99 but they only have a "viewer" role. Which status code should the API return?',
      type: 'multiple-choice',
      options: [
        '401 Unauthorized — they need to provide credentials',
        '400 Bad Request — the request is malformed',
        '403 Forbidden — they are authenticated but not permitted to delete',
        '404 Not Found — hide the resource from unauthorized users'
      ],
      correct: 2,
      explanation: '403 Forbidden is the correct code for authorization failures. The user is authenticated (the server knows who they are), but they lack the required permissions. 401 would be used if no token was provided or the token was invalid/expired.'
    },
    {
      id: 'ex-07-2',
      question: 'You need to store a user\'s refresh token on the client side. Which storage option is most secure?',
      type: 'multiple-choice',
      options: [
        'localStorage — persistent and easy to access from JavaScript',
        'A JavaScript variable — cleared when the page unloads',
        'An httpOnly cookie — JavaScript cannot read it, reducing XSS risk',
        'A URL query parameter — easily passed between pages'
      ],
      correct: 2,
      explanation: 'An httpOnly cookie cannot be read by JavaScript at all, which means even if an attacker injects malicious JS (XSS), they cannot steal the refresh token. localStorage is accessible from any JavaScript on the page and is a common XSS theft target. URL query parameters are logged everywhere and visible in browser history.'
    },
    {
      id: 'ex-07-3',
      question: 'Which part of a JWT contains the user\'s claims like sub, role, and exp?',
      type: 'multiple-choice',
      options: [
        'The header (first part)',
        'The payload (second part)',
        'The signature (third part)',
        'A separate metadata object attached to the header'
      ],
      correct: 1,
      explanation: 'The payload (second part, between the two dots) contains the JWT claims — the actual data about the user such as their ID (sub), roles, and expiry (exp). The header contains algorithm metadata. The signature is the cryptographic proof that the token is valid and was not tampered with.'
    }
  ],
  quiz: [
    {
      id: 'q-07-1',
      question: 'Why should API keys never be included in URL query parameters?',
      options: [
        'Query parameters are not supported by all HTTP clients',
        'URLs with query parameters are cached differently by browsers',
        'URLs are logged by proxies, load balancers, and server access logs, exposing the key in plain text',
        'Query parameter values are limited to 64 characters'
      ],
      correct: 2,
      explanation: 'URLs — including query parameters — appear in server access logs, proxy logs, browser history, and HTTP Referer headers sent to third parties. Putting a secret API key in a URL effectively broadcasts it to anyone with access to those logs. Header values are not typically logged.'
    },
    {
      id: 'q-07-2',
      question: 'What does the "exp" claim in a JWT payload represent?',
      options: [
        'The expected response time of the API',
        'A Unix timestamp after which the token must be rejected as expired',
        'The exponent used in the signing algorithm',
        'The number of times the token has been used'
      ],
      correct: 1,
      explanation: '"exp" (Expiration Time) is a registered JWT claim that specifies the Unix timestamp (seconds since epoch) after which the token must not be accepted. Servers should always validate this claim. Short expiry times limit the damage if a token is stolen.'
    },
    {
      id: 'q-07-3',
      question: 'In the OAuth 2.0 Authorization Code flow, why does the server exchange an authorization code for an access token server-to-server rather than returning the token directly in the redirect URL?',
      options: [
        'Redirect URLs have a maximum length that would be exceeded by the token',
        'The authorization code proves the server received the redirect, and the token exchange happens over a secure server-to-server channel without exposing the token in the browser URL or logs',
        'OAuth requires two round-trips for performance reasons',
        'Access tokens are too large to fit in a URL parameter'
      ],
      correct: 1,
      explanation: 'The authorization code is a short-lived, single-use code that proves the redirect happened. Exchanging it for a token server-to-server means the actual access token never appears in a browser URL, is never logged by proxies, and is never visible in browser history. This is a key security property of the Authorization Code flow.'
    }
  ]
};
