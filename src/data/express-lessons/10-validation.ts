import type { ExpressLesson } from '../express-curriculum';

export const expressValidationLesson: ExpressLesson = {
  id: 'express-validation',
  title: 'Input Validation',
  slug: 'validation',
  chapter: 'advanced',
  order: 10,
  difficulty: 'intermediate',
  readingTime: 12,
  description: 'Validating and sanitizing user input with express-validator and joi, handling validation errors.',
  sections: [
    {
      type: 'text',
      content: 'Never trust user input. Validation ensures data meets your requirements before processing. Sanitization cleans input to prevent security issues like XSS attacks. Express has no built-in validation, but express-validator and joi are popular libraries.',
    },
    {
      type: 'heading',
      content: 'Manual Validation',
    },
    {
      type: 'example',
      title: 'Basic manual validation',
      content: 'Writing validation by hand shows the core pattern of collecting errors and returning a 400 response, but it gets repetitive and inconsistent across routes as your app grows.',
      language: 'javascript',
      code: `app.post('/users', function(req, res) {
  const errors = [];
  
  if (!req.body.name || req.body.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  if (!req.body.email || !req.body.email.includes('@')) {
    errors.push('Valid email required');
  }
  
  if (!req.body.age || req.body.age < 18) {
    errors.push('Must be 18 or older');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ errors: errors });
  }
  
  // Process valid data...
  res.json({ message: 'User created' });
});`,
    },
    {
      type: 'heading',
      content: 'Using express-validator',
    },
    {
      type: 'example',
      title: 'Installing express-validator',
      content: 'express-validator wraps the validator.js library as chainable route middleware. Install it to replace manual if-checks with declarative rules that are easier to read and maintain.',
      language: 'bash',
      code: `npm install express-validator`,
    },
    {
      type: 'example',
      title: 'Validation with express-validator',
      content: 'Attach validation rules directly in the route definition, then call validationResult() to collect any failures and return a 400 with structured error messages before touching your business logic.',
      language: 'javascript',
      code: `const { body, validationResult } = require('express-validator');

app.post('/users',
  // Validation rules
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Must be a valid email'),
  body('age').isInt({ min: 18 }).withMessage('Must be 18 or older'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  
  // Handle validation errors
  function(req, res) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        errors: errors.array() 
      });
    }
    
    // Data is valid, process it
    const { name, email, age, password } = req.body;
    res.status(201).json({ 
      message: 'User created',
      user: { name, email, age }
    });
  }
);`,
    },
    {
      type: 'heading',
      content: 'Common Validation Rules',
    },
    {
      type: 'table',
      headers: ['Validator', 'Description', 'Example'],
      rows: [
        ['isEmail()', 'Valid email format', 'body("email").isEmail()'],
        ['isLength()', 'String length', 'body("name").isLength({min:2})'],
        ['isInt()', 'Integer number', 'body("age").isInt({min:18})'],
        ['isURL()', 'Valid URL', 'body("website").isURL()'],
        ['matches()', 'Regex pattern', 'body("phone").matches(/^\\d{10}$/)'],
        ['trim()', 'Remove whitespace', 'body("name").trim()'],
        ['escape()', 'Sanitize HTML', 'body("bio").escape()'],
      ],
    },
    {
      type: 'example',
      title: 'Custom validators',
      content: 'Custom validators let you run async checks (like querying the database for a duplicate email) or enforce complex rules (password strength, matching fields) that built-in validators cannot cover.',
      language: 'javascript',
      code: `const { body } = require('express-validator');

app.post('/register',
  body('email').isEmail().custom(async function(email) {
    const user = await db.findUserByEmail(email);
    if (user) {
      throw new Error('Email already in use');
    }
  }),
  
  body('password').isLength({ min: 8 })
    .matches(/[A-Z]/).withMessage('Must contain uppercase')
    .matches(/[0-9]/).withMessage('Must contain number'),
  
  body('confirmPassword').custom(function(value, { req }) {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  
  function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.json({ message: 'Registration successful' });
  }
);`,
    },
    {
      type: 'tip',
      title: 'Reusable validation middleware',
      content: 'Extract validation logic into reusable middleware functions to keep routes clean and avoid repetition.',
    },
    {
      type: 'tryit',
      title: 'Validation Testing Form',
      css: `body{font-family:system-ui,sans-serif;padding:20px;margin:0;background:#f0f0f0;}
.validator{max-width:700px;margin:0 auto;}
.panel{background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);margin-bottom:16px;}
.panel-header{background:#000;color:#fff;padding:14px 20px;font-size:15px;font-weight:700;}
.panel-body{padding:20px;}
.form-group{margin-bottom:16px;}
.label{font-size:12px;font-weight:700;color:#555;margin-bottom:6px;display:block;}
.input{width:100%;padding:10px;border:2px solid #ddd;border-radius:6px;font-size:13px;}
.input.error{border-color:#ef4444;}
.input.valid{border-color:#22c55e;}
.error-msg{color:#ef4444;font-size:11px;margin-top:4px;font-weight:600;}
.valid-msg{color:#22c55e;font-size:11px;margin-top:4px;font-weight:600;}
.submit-btn{width:100%;padding:14px;background:#000;color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-size:14px;}
.submit-btn:hover{background:#333;}
.submit-btn:disabled{background:#ccc;cursor:not-allowed;}
.result{background:#1a1a1a;color:#4ade80;padding:16px;border-radius:8px;font-family:monospace;font-size:12px;white-space:pre-wrap;min-height:80px;}`,
      js: `function validate(field) {
  var value = document.getElementById(field).value;
  var errorEl = document.getElementById(field + 'Error');
  var inputEl = document.getElementById(field);
  var isValid = true;
  var msg = '';
  
  if (field === 'name') {
    if (value.trim().length < 2) {
      isValid = false;
      msg = 'Name must be at least 2 characters';
    }
  } else if (field === 'email') {
    if (!value.includes('@') || !value.includes('.')) {
      isValid = false;
      msg = 'Must be a valid email';
    }
  } else if (field === 'age') {
    var age = parseInt(value);
    if (isNaN(age) || age < 18) {
      isValid = false;
      msg = 'Must be 18 or older';
    }
  } else if (field === 'password') {
    if (value.length < 8) {
      isValid = false;
      msg = 'Password must be at least 8 characters';
    }
  }
  
  if (isValid) {
    inputEl.className = 'input valid';
    errorEl.className = 'valid-msg';
    errorEl.textContent = 'Valid';
  } else {
    inputEl.className = 'input error';
    errorEl.className = 'error-msg';
    errorEl.textContent = msg;
  }
  
  return isValid;
}

function submit() {
  var valid = true;
  ['name', 'email', 'age', 'password'].forEach(function(field) {
    if (!validate(field)) valid = false;
  });
  
  var result = '';
  if (valid) {
    result = 'POST /users\ ';
    result += 'HTTP/201 Created\ \ ';
    result += '{\ ';
    result += '  "success": true,\ ';
    result += '  "message": "User created successfully",\ ';
    result += '  "user": {\ ';
    result += '    "name": "' + document.getElementById('name').value + '",\ ';
    result += '    "email": "' + document.getElementById('email').value + '",\ ';
    result += '    "age": ' + document.getElementById('age').value + '\ ';
    result += '  }\ ';
    result += '}';
  } else {
    result = 'POST /users\ ';
    result += 'HTTP/400 Bad Request\ \ ';
    result += '{\ ';
    result += '  "success": false,\ ';
    result += '  "errors": [...]\ ';
    result += '}';
  }
  
  document.getElementById('result').textContent = result;
}

document.getElementById('output').innerHTML =
  '<div class="validator">' +
  '<div class="panel">' +
  '<div class="panel-header">User Registration Form</div>' +
  '<div class="panel-body">' +
  '<div class="form-group">' +
  '<label class="label">Name</label>' +
  '<input id="name" class="input" onblur="validate(\&apos;name\&apos;)" placeholder="Enter name">' +
  '<div id="nameError"></div>' +
  '</div>' +
  '<div class="form-group">' +
  '<label class="label">Email</label>' +
  '<input id="email" class="input" onblur="validate(\\'email\\')" placeholder="email@example.com">' +
  '<div id="emailError"></div>' +
  '</div>' +
  '<div class="form-group">' +
  '<label class="label">Age</label>' +
  '<input id="age" type="number" class="input" onblur="validate(\&apos;age\&apos;)" placeholder="18">' +
  '<div id="ageError"></div>' +
  '</div>' +
  '<div class="form-group">' +
  '<label class="label">Password</label>' +
  '<input id="password" type="password" class="input" onblur="validate(\\'password\\')" placeholder="Min 8 characters">' +
  '<div id="passwordError"></div>' +
  '</div>' +
  '<button class="submit-btn" onclick="submit()">Submit</button>' +
  '</div>' +
  '</div>' +
  '<div class="panel">' +
  '<div class="panel-header">Validation Result</div>' +
  '<div class="panel-body">' +
  '<div class="result" id="result">Fill out the form and click Submit...</div>' +
  '</div>' +
  '</div>' +
  '</div>';`,
    },
  ],
  exercises: [
    {
      id: 'express-validation-1',
      question: 'Why is input validation important?',
      type: 'multiple-choice',
      options: [
        'To make the code look better',
        'To prevent invalid data and security vulnerabilities',
        'To speed up the server',
        'It is not important',
      ],
      correct: 1,
      explanation: 'Input validation prevents invalid data from entering your system and protects against security vulnerabilities like SQL injection and XSS attacks.',
    },
    {
      id: 'express-validation-2',
      question: 'What is the difference between validation and sanitization?',
      type: 'multiple-choice',
      options: [
        'They are the same thing',
        'Validation checks if data is correct, sanitization cleans/modifies data',
        'Sanitization is deprecated',
        'Validation is only for strings',
      ],
      correct: 1,
      explanation: 'Validation checks if data meets requirements (e.g., is an email valid?). Sanitization modifies data to make it safe (e.g., removing HTML tags, trimming whitespace).',
    },
  ],
  quiz: [
    {
      id: 'express-validation-q1',
      question: 'When should you validate user input?',
      options: [
        'Only on the frontend',
        'Only on the backend',
        'On both frontend and backend',
        'Validation is optional',
      ],
      correct: 2,
      explanation: 'Always validate on both frontend (for user experience) and backend (for security). Frontend validation can be bypassed, so backend validation is essential.',
    },
  ],
};
