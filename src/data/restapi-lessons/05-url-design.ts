import type { RestapiLesson } from '../restapi-curriculum';

export const lesson05: RestapiLesson = {
  id: 'restapi-05',
  title: 'REST URL Design and Resources',
  slug: '05-url-design',
  chapter: 'building',
  order: 5,
  difficulty: 'intermediate',
  readingTime: 12,
  description: 'Design clean, intuitive REST API endpoints by following naming conventions, resource modeling, and URL structure best practices.',
  sections: [
    {
      type: 'text',
      content: 'Good URL design makes an API intuitive. A developer should be able to guess your endpoints without looking at documentation. The core principle is simple: URLs represent resources (nouns), and HTTP methods represent actions (verbs). When you mix the two, the API becomes unpredictable.'
    },
    {
      type: 'heading',
      content: 'Resources Are Nouns, Not Verbs'
    },
    {
      type: 'text',
      content: 'The most common REST URL design mistake is putting verbs in URLs. The HTTP method is already the verb - you do not need to repeat it in the path. GET /users means "get users." You do not need GET /getUsers.'
    },
    {
      type: 'example',
      title: 'Good vs bad URL patterns - the key differences',
      content: 'This comparison shows the most common URL design anti-patterns and their correct alternatives. The bad patterns duplicate the HTTP method in the URL or use singular nouns, while the good patterns use plural nouns and let HTTP methods convey the action.',
      code: `// BAD URL PATTERNS (verbs in URLs, inconsistent naming):
GET    /getUsers          // verb in URL
GET    /getUserById/1     // verb in URL
POST   /createUser        // verb in URL
PUT    /updateUser/1      // verb in URL
DELETE /deleteUser/1      // verb in URL
GET    /user/orders/1     // singular noun

// GOOD URL PATTERNS (nouns only, plural, consistent):
GET    /users             // get all users
GET    /users/1           // get user with id 1
POST   /users             // create a new user
PUT    /users/1           // replace user 1
PATCH  /users/1           // partially update user 1
DELETE /users/1           // delete user 1
GET    /users/1/orders    // get orders for user 1`,
      language: 'http',
      output: 'REST convention: URL = resource (noun), HTTP method = action (verb)'
    },
    {
      type: 'heading',
      content: 'Use Plural Nouns'
    },
    {
      type: 'text',
      content: 'Always use plural nouns for collection endpoints (/users, /products, /orders). This keeps the URL pattern consistent - /users returns a list, /users/1 returns a single user. Using singular nouns creates confusion about whether an endpoint returns one item or many.'
    },
    {
      type: 'heading',
      content: 'Hierarchical Resources'
    },
    {
      type: 'example',
      title: 'Nested resource URLs and a complete CRUD endpoint set',
      content: 'Nested resources show parent-child relationships directly in the URL structure. This complete CRUD example for a blog API shows how every operation on posts and their comments maps to a clean URL pattern - reading this table, any developer immediately understands the full API surface.',
      code: `// Posts resource - full CRUD
GET    /posts              // list all posts
GET    /posts/1            // get post #1
POST   /posts              // create a post
PUT    /posts/1            // replace post #1
PATCH  /posts/1            // update post #1 fields
DELETE /posts/1            // delete post #1

// Comments nested under a specific post
GET    /posts/1/comments   // list comments on post #1
GET    /posts/1/comments/5 // get comment #5 on post #1
POST   /posts/1/comments   // add a comment to post #1
PATCH  /posts/1/comments/5 // update comment #5
DELETE /posts/1/comments/5 // delete comment #5

// Versioned API
GET    /api/v1/users
GET    /api/v2/users`,
      language: 'http',
      output: 'Clean, predictable REST URL hierarchy for posts and comments'
    },
    {
      type: 'heading',
      content: 'Query Strings for Filtering, Sorting, Pagination'
    },
    {
      type: 'text',
      content: 'Query parameters are the right tool for optional operations on a collection: filtering, sorting, searching, and pagination. Keep query param names lowercase and use underscores or camelCase consistently across your API.'
    },
    {
      type: 'example',
      title: 'Query parameters for filtering and pagination',
      content: 'This shows the standard conventions for common query operations. The key insight is that filtering and sorting describe how to read the collection, not a different resource - so they belong in query params, not new URL paths.',
      code: `// Filtering
GET /products?category=electronics&in_stock=true

// Sorting (prefix - for descending)
GET /products?sort=-price         // price descending
GET /products?sort=name           // name ascending

// Pagination (page-based)
GET /users?page=2&limit=20

// Pagination (cursor-based, better for large datasets)
GET /users?after=user_xyz123&limit=20

// Search
GET /products?q=wireless+headphones

// Combining filter, sort, paginate
GET /products?category=electronics&sort=-price&page=1&limit=10

// Field selection (reduce response size)
GET /users?fields=id,name,email`,
      language: 'http',
      output: 'Query params control how a collection is filtered and presented'
    },
    {
      type: 'heading',
      content: 'URL Versioning'
    },
    {
      type: 'text',
      content: 'Versioning your API allows you to make breaking changes without breaking existing clients. The most common and clearest approach is URL versioning: /api/v1/. Header versioning (Accept: application/vnd.api+json;version=2) also works but is harder to test with a browser.'
    },
    {
      type: 'table',
      title: 'URL naming conventions - good and bad',
      headers: ['Bad', 'Good', 'Rule'],
      rows: [
        ['/getUsers', '/users', 'No verbs in URLs'],
        ['/user/1', '/users/1', 'Use plural nouns'],
        ['/Users/1', '/users/1', 'Lowercase only'],
        ['/user_orders/1', '/users/1/orders', 'Hierarchy over flat names'],
        ['/users/1/get_orders', '/users/1/orders', 'No verbs in nested paths'],
        ['/users/1/address/city', '/users/1/address', 'Max 2-3 levels of nesting'],
        ['/api/users', '/api/v1/users', 'Always version your API']
      ]
    },
    {
      type: 'tryit',
      title: 'REST URL Validator and Designer',
      js: `document.body.innerHTML = '<div><h3>REST URL Validator</h3><div class=\\"input-row\\"><input id=\\"url-input\\" type=\\"text\\" placeholder=\\"/api/v1/users\\" value=\\"/api/v1/users\\" /><button id=\\"check-btn\\">Check URL</button></div><span class=\\"examples-label\\">Try examples:</span><div id=\\"examples\\"></div><div id=\\"result\\"></div></div>';

var rules = [
  { check: function(u) { return /^(https?:\\/\\/[^\\/]+)?\\/api\\/v[0-9]/.test(u); }, label: 'Versioned', points: 1 },
  { check: function(u) { var path = u.replace(/^https?:\\/\\/[^\\/]+/, ''); return !/[A-Z]/.test(path); }, label: 'Lowercase path', points: 1 },
  { check: function(u) { return !new RegExp('\\\\/(get|create|update|delete|fetch|list|add|remove)[A-Za-z]*', 'i').test(u); }, label: 'No verbs in path', points: 2 },
  { check: function(u) { var segs = u.replace(/^https?:\\/\\/[^\\/]+/, '').replace(/\\?.*$/, '').split('\\/').filter(Boolean); var res = segs.filter(function(s) { return !/^[0-9]+$/.test(s) && !/^v[0-9]/.test(s) && s !== 'api'; }); return res.every(function(s) { return s.endsWith('s') || s.length < 4; }); }, label: 'Plural nouns', points: 1 },
  { check: function(u) { return u.replace(/^https?:\\/\\/[^\\/]+/, '').replace(/\\?.*$/, '').split('\\/').filter(Boolean).length <= 5; }, label: 'Reasonable depth', points: 1 }
];

function check() {
  var url = document.getElementById('url-input').value.trim() || '/api/v1/users';
  var passed = [];
  var failed = [];
  var score = 0;
  var maxScore = 0;
  rules.forEach(function(r) {
    maxScore += r.points;
    if (r.check(url)) { passed.push(r.label); score += r.points; }
    else { failed.push(r.label); }
  });
  var rating = score >= maxScore ? 'Good' : score >= maxScore - 1 ? 'Acceptable' : 'Needs Work';
  var rColor = score >= maxScore ? '#10b981' : score >= maxScore - 1 ? '#f59e0b' : '#ef4444';

  var html = '<div class=\\"result-header\\" style=\\"background:' + rColor + '\\">';
  html += '<span class=\\"rating\\">' + rating + '</span>';
  html += '<span class=\\"score\\">' + score + '/' + maxScore + ' points</span></div>';
  html += '<div class=\\"result-body\\">';
  html += '<div class=\\"url-display\\">' + escHtml(url) + '</div>';
  if (passed.length) {
    html += '<div class=\\"section-title pass-title\\">Follows:</div>';
    passed.forEach(function(p) { html += '<div class=\\"rule-row pass-row\\"><span class=\\"rule-icon\\">ok</span>' + p + '</div>'; });
  }
  if (failed.length) {
    html += '<div class=\\"section-title fail-title\\">Issues:</div>';
    failed.forEach(function(f) { html += '<div class=\\"rule-row fail-row\\"><span class=\\"rule-icon\\">!</span>' + f + '</div>'; });
  }
  html += '</div>';
  document.getElementById('result').innerHTML = html;
}

function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

document.getElementById('check-btn').addEventListener('click', check);
document.getElementById('url-input').addEventListener('keydown', function(e) { if (e.key === 'Enter') check(); });

var examples = ['/api/v1/users', '/api/v1/users/1/orders', '/getUsers', '/user/orders', '/api/users/1/address/city/street'];
var exDiv = document.getElementById('examples');
examples.forEach(function(ex) {
  var btn = document.createElement('button');
  btn.className = 'ex-btn';
  btn.textContent = ex;
  btn.addEventListener('click', function() {
    document.getElementById('url-input').value = ex;
    check();
  });
  exDiv.appendChild(btn);
});`,
      css: `body { font-family: system-ui, sans-serif; padding: 16px; background: #f8fafc; }
h3 { color: #1e293b; margin: 0 0 12px 0; font-size: 15px; }
.input-row { display: flex; gap: 8px; margin-bottom: 10px; }
#url-input { flex: 1; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; font-family: monospace; }
#check-btn { background: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px; }
#check-btn:hover { background: #4f46e5; }
#examples { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
.ex-btn { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; padding: 4px 8px; font-size: 11px; font-family: monospace; cursor: pointer; color: #334155; }
.ex-btn:hover { background: #e2e8f0; }
.examples-label { font-size: 11px; color: #64748b; font-weight: 600; margin-bottom: 6px; display: block; }
#result { background: white; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; }
.result-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; }
.rating { color: white; font-size: 15px; font-weight: 800; }
.score { color: white; font-size: 13px; font-weight: 600; opacity: 0.9; }
.result-body { padding: 12px 14px; }
.url-display { background: #1e293b; color: #7dd3fc; padding: 8px 12px; border-radius: 5px; font-family: monospace; font-size: 12px; margin-bottom: 10px; }
.section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin: 8px 0 4px 0; }
.pass-title { color: #10b981; }
.fail-title { color: #ef4444; }
.rule-row { display: flex; align-items: center; gap: 8px; font-size: 12px; padding: 3px 0; }
.rule-icon { width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; color: white; flex-shrink: 0; }
.pass-row .rule-icon { background: #10b981; }
.fail-row .rule-icon { background: #ef4444; }
.pass-row { color: #166534; }
.fail-row { color: #991b1b; }`
    }
  ],
  exercises: [
    {
      id: 'ex-05-1',
      question: 'Which URL correctly follows REST conventions for getting all orders for user #5?',
      type: 'multiple-choice',
      options: [
        '/api/v1/getUserOrders?userId=5',
        '/api/v1/users/5/orders',
        '/api/v1/getOrders/user/5',
        '/api/v1/user/orders/5'
      ],
      correct: 1,
      explanation: '/api/v1/users/5/orders follows all REST conventions: it is versioned (/v1/), uses plural nouns (/users/, /orders), contains no verbs, and expresses the hierarchy (orders belong to a user) through URL nesting.'
    },
    {
      id: 'ex-05-2',
      question: 'You want to return only users whose role is "admin", sorted by name. Where do these constraints belong in a REST URL?',
      type: 'multiple-choice',
      options: [
        'In separate path segments: /users/admin/sorted-by-name',
        'In the request body of a GET request',
        'In query parameters: /users?role=admin&sort=name',
        'In the Authorization header'
      ],
      correct: 2,
      explanation: 'Filtering and sorting are query parameters - they describe how to read the collection, not a different resource. /users?role=admin&sort=name is the correct REST pattern. Path segments are for identifying resources (like /users/42), and GET requests should not have bodies.'
    },
    {
      id: 'ex-05-3',
      question: 'What is the recommended maximum depth for nested resource URLs?',
      type: 'multiple-choice',
      options: [
        '1 level (/resources only)',
        '2-3 levels (/resources/:id/sub-resources)',
        '5-6 levels for complex data models',
        'There is no limit - depth should reflect your full data hierarchy'
      ],
      correct: 1,
      explanation: 'REST best practice is to limit nesting to 2-3 levels. Deeper nesting creates unwieldy URLs and tightly couples API structure to database schema. For deeply nested data, consider using query parameters or returning IDs that clients can use to make separate requests.'
    }
  ],
  quiz: [
    {
      id: 'q-05-1',
      question: 'Why should REST API URLs use nouns instead of verbs?',
      options: [
        'Nouns are shorter and save bandwidth',
        'The HTTP method (GET, POST, etc.) already serves as the verb, so the URL only needs to identify the resource',
        'Verb-based URLs are not supported by HTTP/2',
        'Nouns are easier to cache in proxies'
      ],
      correct: 1,
      explanation: 'In REST, the HTTP method is the verb (GET = read, POST = create, DELETE = remove). The URL identifies the resource being acted upon. Adding verbs to URLs duplicates information and creates an inconsistent, unpredictable API surface.'
    },
    {
      id: 'q-05-2',
      question: 'Which versioning strategy is most commonly used and easiest to test in a browser?',
      options: [
        'Query parameter versioning: /users?version=2',
        'URL path versioning: /api/v2/users',
        'Header versioning: Accept: application/vnd.api+json;version=2',
        'Subdomain versioning: v2.api.example.com/users'
      ],
      correct: 1,
      explanation: 'URL path versioning (/api/v2/users) is the most widely used approach. It is visible, cacheable, and trivially testable in a browser. Header versioning is cleaner architecturally but is invisible in URLs and harder to test without tools like Postman.'
    },
    {
      id: 'q-05-3',
      question: 'A client needs a list of products filtered by category, sorted by price, showing page 3. Which URL is correct?',
      options: [
        '/products/electronics/price/page-3',
        '/products?category=electronics&sort=price&page=3',
        '/list-products?cat=electronics',
        '/products/filter?sort=price'
      ],
      correct: 1,
      explanation: '/products?category=electronics&sort=price&page=3 is correct REST design. The base path /products identifies the collection, and query parameters express filtering, sorting, and pagination without creating new path segments or using verbs.'
    }
  ]
};
