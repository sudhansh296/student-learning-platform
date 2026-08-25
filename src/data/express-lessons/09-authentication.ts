import type { ExpressLesson } from '../express-curriculum';

export const expressAuthenticationLesson: ExpressLesson = {
  id: 'express-authentication',
  title: 'Authentication',
  slug: 'authentication',
  chapter: 'advanced',
  order: 9,
  difficulty: 'advanced',
  readingTime: 15,
  description: 'Implementing authentication with JWT tokens, password hashing with bcrypt, sessions, and auth middleware.',
  sections: [
    {
      type: 'text',
      content: 'Authentication verifies user identity. In Express apps, common approaches include JWT tokens for APIs and sessions for traditional web apps. Always hash passwords - never store them in plain text.',
    },
    {
      type: 'heading',
      content: 'Password Hashing with bcrypt',
    },
    {
      type: 'example',
      title: 'Installing bcrypt',
      content: 'bcrypt is a deliberately slow password hashing library that makes brute-force attacks impractical. Run this command to add it before storing any user passwords.',
      language: 'bash',
      code: `npm install bcrypt`,
    },
    {
      type: 'example',
      title: 'Hashing and comparing passwords',
      content: 'bcrypt.hash() converts a plain-text password into a secure one-way hash before storing it. During login, bcrypt.compare() checks a plain-text attempt against the stored hash without ever decrypting it.',
      language: 'javascript',
      code: `const bcrypt = require('bcrypt');

// Register - hash password
app.post('/register', async function(req, res) {
  try {
    const { email, password } = req.body;
    
    // Hash password (10 is the salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Save user with hashed password
    const user = {
      email: email,
      password: hashedPassword
    };
    
    // Save to database...
    
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login - compare passwords
app.post('/login', async function(req, res) {
  try {
    const { email, password } = req.body;
    
    // Find user in database...
    const user = await db.findUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Compare password with hash
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ message: 'Login successful', userId: user.id });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});`,
    },
    {
      type: 'heading',
      content: 'JWT Authentication',
    },
    {
      type: 'example',
      title: 'Installing jsonwebtoken',
      content: 'jsonwebtoken lets you create signed tokens that encode user data and verify them without hitting a database. Install it before building any JWT-based authentication flow.',
      language: 'bash',
      code: `npm install jsonwebtoken`,
    },
    {
      type: 'example',
      title: 'Creating and verifying JWT tokens',
      content: 'jwt.sign() embeds user data into a signed token returned at login. jwt.verify() decodes and validates that token on every protected request, enabling stateless authentication.',
      language: 'javascript',
      code: `const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key'; // Use environment variable in production

// Login - issue JWT token
app.post('/login', async function(req, res) {
  const { email, password } = req.body;
  
  // Verify credentials...
  const user = await db.findUserByEmail(email);
  const isValid = await bcrypt.compare(password, user.password);
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Create JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.json({ token: token });
});

// Verify token middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  jwt.verify(token, JWT_SECRET, function(err, user) {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Protected route
app.get('/profile', authenticateToken, function(req, res) {
  res.json({ 
    message: 'Protected data',
    user: req.user 
  });
});`,
    },
    {
      type: 'heading',
      content: 'Auth Middleware Patterns',
    },
    {
      type: 'example',
      title: 'Role-based authorization',
      content: 'Role-based middleware lets you restrict routes beyond just "is the user logged in." This shows how to check for admin status and ownership so users can only access what they are allowed to.',
      language: 'javascript',
      code: `// Check if user is admin
function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// Admin-only route
app.delete('/users/:id', authenticateToken, requireAdmin, function(req, res) {
  // Only admins can delete users
  res.json({ message: 'User deleted' });
});

// Check resource ownership
function requireOwnership(req, res, next) {
  const resourceUserId = req.params.userId;
  if (req.user.userId !== parseInt(resourceUserId)) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  next();
}

// User can only edit their own profile
app.put('/users/:userId', authenticateToken, requireOwnership, function(req, res) {
  res.json({ message: 'Profile updated' });
});`,
    },
    {
      type: 'warning',
      title: 'Security best practices',
      content: 'Never store JWT secret in code - use environment variables. Always use HTTPS in production. Set appropriate token expiration times. Use secure, httpOnly cookies for sensitive tokens.',
    },
    {
      type: 'tryit',
      title: 'Authentication Flow Demo',
      css: `body{font-family:system-ui,sans-serif;padding:20px;margin:0;background:#f5f5f5;}
.auth-demo{max-width:800px;margin:0 auto;}
.panel{background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);margin-bottom:16px;}
.panel-header{background:#000;color:#fff;padding:14px 20px;font-size:15px;font-weight:700;}
.panel-body{padding:20px;}
.form-group{margin-bottom:14px;}
.label{font-size:12px;font-weight:700;color:#555;margin-bottom:6px;}
.input{width:100%;padding:10px;border:2px solid #ddd;border-radius:6px;font-size:13px;}
.btn-group{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px;}
.btn{padding:12px;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-size:14px;}
.btn-login{background:#000;color:#fff;}
.btn-login:hover{background:#333;}
.btn-test{background:#f0f0f0;color:#333;}
.btn-test:hover{background:#e0e0e0;}
.status{background:#1a1a1a;color:#4ade80;padding:16px;border-radius:8px;font-family:monospace;font-size:12px;min-height:100px;white-space:pre-wrap;}
.token-box{background:#fff3cd;border:1px solid #ffc107;padding:12px;border-radius:6px;margin-top:12px;font-size:11px;font-family:monospace;word-break:break-all;}`,
      js: `var token = null;
var user = { email: 'alice@example.com', password: 'hashed_password_here' };

function login() {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  
  var status = '[POST /login]\ ';
  status += 'Email: ' + email + '\ ';
  status += 'Password: ' + password + '\\n\ ';
  
  if (email === 'alice@example.com' && password === 'password123') {
    token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWxpY2UifQ.demo';
    status += 'HTTP/200 OK\ ';
    status += '{\ ';
    status += '  "message": "Login successful",\ ';
    status += '  "token": "' + token.substring(0, 30) + '..."\ ';
    status += '}';
    
    document.getElementById('tokenBox').innerHTML = '<strong>Token stored:</strong><br>' + token;
  } else {
    status += 'HTTP/401 Unauthorized\ ';
    status += '{ "error": "Invalid credentials" }';
    token = null;
    document.getElementById('tokenBox').innerHTML = 'No token (not logged in)';
  }
  
  document.getElementById('status').textContent = status;
}

function testProtected() {
  var status = '[GET /profile]\ ';
  status += 'Authorization: Bearer ' + (token ? token.substring(0, 30) + '...' : '(none)') + '\\n\ ';
  
  if (token) {
    status += 'HTTP/200 OK\ ';
    status += '{\ ';
    status += '  "message": "Protected data",\ ';
    status += '  "user": { "userId": 1, "email": "alice@example.com" }\ ';
    status += '}';
  } else {
    status += 'HTTP/401 Unauthorized\ ';
    status += '{ "error": "No token provided" }';
  }
  
  document.getElementById('status').textContent = status;
}

document.getElementById('output').innerHTML =
  '<div class="auth-demo">' +
  '<div class="panel">' +
  '<div class="panel-header">Login Form</div>' +
  '<div class="panel-body">' +
  '<div class="form-group">' +
  '<div class="label">Email</div>' +
  '<input id="email" class="input" value="alice@example.com" placeholder="email@example.com">' +
  '</div>' +
  '<div class="form-group">' +
  '<div class="label">Password</div>' +
  '<input id="password" type="password" class="input" value="password123" placeholder="password">' +
  '</div>' +
  '<div class="btn-group">' +
  '<button class="btn btn-login" onclick="login()">Login</button>' +
  '<button class="btn btn-test" onclick="testProtected()">Test Protected Route</button>' +
  '</div>' +
  '<div class="token-box" id="tokenBox">No token (not logged in)</div>' +
  '</div>' +
  '</div>' +
  '<div class="panel">' +
  '<div class="panel-header">Server Response</div>' +
  '<div class="panel-body">' +
  '<div class="status" id="status">Try logging in with the credentials above...</div>' +
  '</div>' +
  '</div>' +
  '</div>';`,
    },
  ],
  exercises: [
    {
      id: 'express-auth-1',
      question: 'Why should passwords be hashed before storing?',
      type: 'multiple-choice',
      options: [
        'To make them shorter',
        'To compress them',
        'To protect them if the database is compromised',
        'To make login faster',
      ],
      correct: 2,
      explanation: 'Hashing passwords protects user accounts even if the database is compromised. Hashes are one-way - you cannot reverse them to get the original password.',
    },
    {
      id: 'express-auth-2',
      question: 'What is the purpose of JWT tokens?',
      type: 'multiple-choice',
      options: [
        'To encrypt passwords',
        'To create stateless authentication',
        'To store user data in database',
        'To hash passwords',
      ],
      correct: 1,
      explanation: 'JWT tokens enable stateless authentication. The server does not need to store session data - all information is in the token itself, which is verified using a secret key.',
    },
  ],
  quiz: [
    {
      id: 'express-auth-q1',
      question: 'How are JWT tokens typically sent to the server?',
      options: [
        'In the request body',
        'In the URL query string',
        'In the Authorization header as "Bearer TOKEN"',
        'As a cookie only',
      ],
      correct: 2,
      explanation: 'JWT tokens are typically sent in the Authorization header with the format "Bearer TOKEN". This is the standard way to authenticate API requests.',
    },
  ],
};
