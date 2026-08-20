import type { ExpressLesson } from '../express-curriculum';

export const expressTemplatingLesson: ExpressLesson = {
  id: 'express-templating',
  title: 'Template Engines',
  slug: 'templating',
  chapter: 'advanced',
  order: 8,
  difficulty: 'intermediate',
  readingTime: 11,
  description: 'Using template engines like EJS and Pug to render dynamic HTML pages with Express.',
  sections: [
    {
      type: 'text',
      content: 'Template engines allow you to generate dynamic HTML by embedding JavaScript logic and variables into your HTML. Express supports many template engines including EJS, Pug, Handlebars, and more.',
    },
    {
      type: 'heading',
      content: 'Setting Up EJS',
    },
    {
      type: 'example',
      title: 'Installing and configuring EJS',
      content: 'EJS (Embedded JavaScript) is installed via npm like any other package. Run this in your project directory to add it as a dependency, then configure Express to use it as the view engine.',
      language: 'bash',
      code: `# Install EJS
npm install ejs`,
    },
    {
      type: 'example',
      title: 'Configuring Express to use EJS',
      content: 'Set the view engine to EJS and specify the views directory, then use res.render() to send rendered HTML.',
      language: 'javascript',
      code: `const express = require('express');
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set views directory (default is ./views)
app.set('views', './views');

// Render a template
app.get('/', function(req, res) {
  res.render('index', { 
    title: 'Home Page',
    user: { name: 'Alice' }
  });
});

app.listen(3000);`,
    },
    {
      type: 'heading',
      content: 'EJS Syntax',
    },
    {
      type: 'example',
      title: 'EJS template example (views/index.ejs)',
      content: 'EJS uses <% %> for logic, <%= %> for output, and <%- %> for raw HTML.',
      language: 'html',
      code: `<!DOCTYPE html>
<html>
<head>
  <title><%= title %></title>
</head>
<body>
  <h1>Welcome <%= user.name %>!</h1>
  
  <!-- Loop -->
  <ul>
  <% for (let i = 0; i < items.length; i++) { %>
    <li><%= items[i] %></li>
  <% } %>
  </ul>
  
  <!-- Conditional -->
  <% if (user.isAdmin) { %>
    <p>Admin Panel Access</p>
  <% } else { %>
    <p>Regular User</p>
  <% } %>
  
  <!-- Include partial -->
  <%- include('partials/footer') %>
</body>
</html>`,
    },
    {
      type: 'heading',
      content: 'Passing Data to Templates',
    },
    {
      type: 'example',
      title: 'Rendering with data',
      content: 'Pass a data object as the second argument to res.render() to make variables available inside the template.',
      language: 'javascript',
      code: `app.get('/users/:id', function(req, res) {
  const user = {
    id: req.params.id,
    name: 'Alice',
    email: 'alice@example.com',
    posts: ['Post 1', 'Post 2', 'Post 3']
  };
  
  res.render('user', {
    user: user,
    title: user.name + ' Profile'
  });
});

// With async data
app.get('/dashboard', async function(req, res) {
  const stats = await db.getStats();
  const users = await db.getUsers();
  
  res.render('dashboard', {
    stats: stats,
    users: users,
    currentUser: req.user
  });
});`,
    },
    {
      type: 'note',
      title: 'Template file location',
      content: 'By default, Express looks for templates in the views/ directory. Template files for EJS use the .ejs extension.',
    },
    {
      type: 'tryit',
      title: 'Template Rendering Demo',
      css: `body{font-family:system-ui,sans-serif;padding:18px;margin:0;background:#e8e8e8;}
.demo{max-width:900px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.panel{background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);}
.panel-header{background:#000;color:#fff;padding:12px 18px;font-size:14px;font-weight:700;}
.panel-body{padding:18px;}
.form-group{margin-bottom:14px;}
.label{font-size:11px;font-weight:700;color:#666;margin-bottom:6px;text-transform:uppercase;}
.input{width:100%;padding:10px;border:2px solid #ddd;border-radius:6px;font-size:13px;}
.render-btn{width:100%;padding:12px;background:#000;color:#fff;border:none;border-radius:6px;font-weight:700;cursor:pointer;margin-top:10px;}
.render-btn:hover{background:#333;}
.preview{padding:16px;border:1px solid #ddd;border-radius:8px;background:#fff;min-height:200px;}
.preview h1{font-size:24px;margin:0 0 10px;color:#000;}
.preview p{margin:8px 0;color:#555;}
.preview ul{margin:10px 0;padding-left:20px;}
.preview li{margin:6px 0;}
@media(max-width:768px){.demo{grid-template-columns:1fr;}}`,
      js: `function renderTemplate() {
  var title = document.getElementById('title').value || 'My Page';
  var name = document.getElementById('name').value || 'User';
  var isAdmin = document.getElementById('admin').checked;
  
  var items = ['Feature 1', 'Feature 2', 'Feature 3'];
  
  var html = '<h1>' + title + '</h1>';
  html += '<p>Welcome back, ' + name + '!</p>';
  
  if (isAdmin) {
    html += '<p style="color:#16a34a;font-weight:700">Admin Panel Access Granted</p>';
  } else {
    html += '<p style="color:#64748b">Regular User Access</p>';
  }
  
  html += '<h3 style="margin-top:16px">Features:</h3><ul>';
  items.forEach(function(item) {
    html += '<li>' + item + '</li>';
  });
  html += '</ul>';
  
  html += '<p style="margin-top:16px;font-size:12px;color:#888">Rendered with EJS</p>';
  
  document.getElementById('preview').innerHTML = html;
}

document.getElementById('output').innerHTML =
  '<div class="demo">' +
  '<div class="panel">' +
  '<div class="panel-header">Template Data</div>' +
  '<div class="panel-body">' +
  '<div class="form-group">' +
  '<div class="label">Title</div>' +
  '<input id="title" class="input" value="My Dashboard" placeholder="Page title">' +
  '</div>' +
  '<div class="form-group">' +
  '<div class="label">User Name</div>' +
  '<input id="name" class="input" value="Alice" placeholder="User name">' +
  '</div>' +
  '<div class="form-group">' +
  '<label style="display:flex;align-items:center;gap:8px;cursor:pointer">' +
  '<input type="checkbox" id="admin" style="width:auto"> Is Admin' +
  '</label>' +
  '</div>' +
  '<button class="render-btn" onclick="renderTemplate()">Render Template</button>' +
  '</div>' +
  '</div>' +
  '<div class="panel">' +
  '<div class="panel-header">Rendered Output</div>' +
  '<div class="panel-body">' +
  '<div class="preview" id="preview">Click Render Template to see output...</div>' +
  '</div>' +
  '</div>' +
  '</div>';

renderTemplate();`,
    },
  ],
  exercises: [
    {
      id: 'express-template-1',
      question: 'What does res.render() do in Express?',
      type: 'multiple-choice',
      options: [
        'Sends a JSON response',
        'Renders a template engine view and sends HTML',
        'Renders CSS styles',
        'Compiles JavaScript',
      ],
      correct: 1,
      explanation: 'res.render() renders a view template using the configured template engine and sends the resulting HTML to the client.',
    },
    {
      id: 'express-template-2',
      question: 'In EJS, which tag is used to output a variable?',
      type: 'multiple-choice',
      options: [
        '<% variable %>',
        '<%= variable %>',
        '{{ variable }}',
        '<%- variable %>',
      ],
      correct: 1,
      explanation: '<%= variable %> outputs the variable with HTML escaping. Use <%- variable %> for raw HTML output (unescaped).',
    },
  ],
  quiz: [
    {
      id: 'express-template-q1',
      question: 'Where does Express look for template files by default?',
      options: [
        'public/',
        'templates/',
        'views/',
        'pages/',
      ],
      correct: 2,
      explanation: 'Express looks for templates in the views/ directory by default. You can change this with app.set("views", "./your-directory").',
    },
  ],
};
