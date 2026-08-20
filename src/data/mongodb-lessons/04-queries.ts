import type { MongodbLesson } from '../mongodb-curriculum';

export const mongodbQueriesLesson: MongodbLesson = {
  id: 'mongodb-queries',
  title: 'Query Operators',
  slug: 'queries',
  chapter: 'queries',
  order: 4,
  difficulty: 'intermediate',
  readingTime: 14,
  description: 'Advanced query operators - comparison, logical, element, array operators, and regex pattern matching.',
  sections: [
    {
      type: 'text',
      content: 'MongoDB provides powerful query operators that allow you to filter documents with precision. These operators enable complex queries including comparisons, logical operations, array matching, regex patterns, and element existence checks.',
    },
    {
      type: 'heading',
      content: 'Comparison Operators',
    },
    {
      type: 'example',
      title: 'Comparison query operators',
      content: 'Comparison operators let you filter documents by value ranges. $gt/$lt handle greater/less than, $in matches any value in a list, and $ne excludes a specific value.',
      language: 'javascript',
      code: `// $eq - equal to
db.products.find({ price: { $eq: 99.99 } })
// Same as: db.products.find({ price: 99.99 })

// $ne - not equal to
db.products.find({ status: { $ne: "discontinued" } })

// $gt - greater than
db.products.find({ price: { $gt: 100 } })

// $gte - greater than or equal to
db.products.find({ quantity: { $gte: 50 } })

// $lt - less than
db.products.find({ price: { $lt: 50 } })

// $lte - less than or equal to
db.products.find({ rating: { $lte: 3.5 } })

// Range query (between)
db.products.find({
  price: { $gte: 50, $lte: 100 }
})

// Multiple conditions on same field
db.users.find({
  age: { $gt: 18, $lt: 65 }
})`,
    },
    {
      type: 'heading',
      content: 'Logical Operators',
    },
    {
      type: 'example',
      title: 'Logical query operators',
      content: '$and requires all conditions to match, $or requires at least one, and $not negates a condition. Combine them to build complex multi-condition filters on the same or different fields.',
      language: 'javascript',
      code: `// $and - all conditions must be true (implicit by default)
db.products.find({
  $and: [
    { price: { $gte: 50 } },
    { category: "Electronics" }
  ]
})

// Implicit AND (more common)
db.products.find({
  price: { $gte: 50 },
  category: "Electronics"
})

// $or - at least one condition must be true
db.products.find({
  $or: [
    { price: { $lt: 20 } },
    { category: "Clearance" }
  ]
})

// $nor - none of the conditions should be true
db.products.find({
  $nor: [
    { price: { $lt: 10 } },
    { status: "discontinued" }
  ]
})

// $not - negates the condition
db.products.find({
  price: { $not: { $gt: 100 } }
})

// Complex query with multiple logical operators
db.products.find({
  $and: [
    { price: { $gte: 20, $lte: 100 } },
    {
      $or: [
        { category: "Electronics" },
        { category: "Books" }
      ]
    },
    { inStock: true }
  ]
})`,
    },
    {
      type: 'heading',
      content: 'Element Operators',
    },
    {
      type: 'example',
      title: 'Element query operators',
      content: '$exists checks whether a field is present in the document at all, and $type filters by BSON data type. These are useful for finding documents with inconsistent or optional fields.',
      language: 'javascript',
      code: `// $exists - check if field exists
db.users.find({ phone: { $exists: true } })
db.users.find({ deletedAt: { $exists: false } })

// $type - check field data type
db.users.find({ age: { $type: "number" } })
db.users.find({ age: { $type: "string" } })

// BSON type numbers:
// 1 = double, 2 = string, 3 = object, 4 = array
// 8 = boolean, 9 = date, 10 = null, 16 = int
db.products.find({ price: { $type: 1 } })  // double

// Check for null or missing fields
db.users.find({ email: null })  // null or field does not exist
db.users.find({ email: { $eq: null } })  // same as above

// Field exists and is null
db.users.find({
  email: { $type: 10 }  // BSON type for null
})`,
    },
    {
      type: 'heading',
      content: 'Array Operators',
    },
    {
      type: 'example',
      title: 'Array query operators',
      content: '$in matches if the field value is any item in a given list, $all requires all listed values to be present in an array, and $elemMatch ensures at least one array element satisfies multiple conditions at once.',
      language: 'javascript',
      code: `// $in - value matches any value in array
db.products.find({
  category: { $in: ["Electronics", "Books", "Toys"] }
})

// $nin - value does not match any value in array
db.products.find({
  status: { $nin: ["discontinued", "out-of-stock"] }
})

// $all - array field contains all specified values
db.users.find({
  skills: { $all: ["JavaScript", "MongoDB"] }
})

// $size - array has exactly this length
db.users.find({ skills: { $size: 3 } })

// $elemMatch - at least one array element matches all conditions
db.products.find({
  reviews: {
    $elemMatch: {
      rating: { $gte: 4 },
      verified: true
    }
  }
})

// Query array element by index
db.users.find({ "skills.0": "JavaScript" })  // first element

// Array contains a value (simple match)
db.users.find({ skills: "JavaScript" })  // has JavaScript in array`,
    },
    {
      type: 'heading',
      content: 'Regular Expressions',
    },
    {
      type: 'example',
      title: 'Regex pattern matching',
      content: '$regex applies a regular expression to a string field so you can find documents by partial matches, prefixes, or case-insensitive patterns. Use the i option for case-insensitive searches.',
      language: 'javascript',
      code: `// $regex - pattern matching
db.users.find({ name: { $regex: /^A/ } })  // starts with A
db.users.find({ name: { $regex: /son$/ } })  // ends with son

// Case-insensitive search
db.users.find({
  name: { $regex: /alice/i }
})

// Using $regex with $options
db.users.find({
  email: {
    $regex: "gmail",
    $options: "i"  // i = case-insensitive
  }
})

// Contains substring
db.products.find({ name: { $regex: /laptop/i } })

// Starts with pattern (use index for better performance)
db.users.find({ name: { $regex: /^John/i } })

// Multiple patterns with OR
db.products.find({
  $or: [
    { name: { $regex: /phone/i } },
    { name: { $regex: /tablet/i } }
  ]
})

// Word boundary
db.users.find({ bio: { $regex: /\\\\bMongoDB\\\\b/i } })`,
    },
    {
      type: 'example',
      title: 'Text search (requires text index)',
      content: 'Full-text search requires a text index on the fields you want to search. $text then lets you search by words or phrases, score results by relevance, and exclude terms with a minus prefix.',
      language: 'javascript',
      code: `// Create text index first
db.articles.createIndex({ title: "text", content: "text" })

// Text search
db.articles.find({ $text: { $search: "mongodb tutorial" } })

// Text search with phrases
db.articles.find({ $text: { $search: "\\"NoSQL database\\"" } })

// Exclude words (use - prefix)
db.articles.find({ $text: { $search: "mongodb -sql" } })

// Text search score (relevance)
db.articles.find(
  { $text: { $search: "mongodb" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } })`,
    },
    {
      type: 'table',
      title: 'Common Query Operators',
      headers: ['Operator', 'Description', 'Example'],
      rows: [
        ['$eq', 'Equal to', '{ age: { $eq: 25 } }'],
        ['$ne', 'Not equal to', '{ status: { $ne: "inactive" } }'],
        ['$gt', 'Greater than', '{ price: { $gt: 100 } }'],
        ['$gte', 'Greater than or equal', '{ quantity: { $gte: 50 } }'],
        ['$lt', 'Less than', '{ age: { $lt: 18 } }'],
        ['$lte', 'Less than or equal', '{ rating: { $lte: 3 } }'],
        ['$in', 'In array', '{ color: { $in: ["red", "blue"] } }'],
        ['$nin', 'Not in array', '{ size: { $nin: ["XL", "XXL"] } }'],
        ['$and', 'All conditions true', '{ $and: [{ a: 1 }, { b: 2 }] }'],
        ['$or', 'At least one true', '{ $or: [{ a: 1 }, { b: 2 }] }'],
        ['$exists', 'Field exists', '{ email: { $exists: true } }'],
        ['$regex', 'Pattern match', '{ name: { $regex: /^A/i } }'],
      ],
    },
    {
      type: 'note',
      title: 'Query Performance',
      content: 'Use indexes on fields you query frequently. Regex queries starting with ^ (caret) can use indexes. Regex queries with .* patterns or case-insensitive searches on large collections can be slow without proper indexes.',
    },
    {
      type: 'tryit',
      title: 'Query Operator Tester',
      css: `body{font-family:system-ui,sans-serif;padding:16px;margin:0;background:linear-gradient(135deg,#001E2B 0%,#003d4d 100%);}
.container{max-width:900px;margin:0 auto;}
.header{text-align:center;color:#00ED64;font-size:26px;font-weight:700;margin-bottom:6px;}
.subtitle{text-align:center;color:#fff;font-size:13px;margin-bottom:14px;}
.card{background:#fff;border-radius:10px;padding:16px;margin-bottom:12px;box-shadow:0 4px 20px rgba(0,237,100,0.2);}
.label{font-weight:600;color:#001E2B;font-size:14px;margin-bottom:6px;}
.btn-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin-bottom:12px;}
.btn{background:#00ED64;color:#001E2B;border:none;padding:10px 14px;border-radius:6px;cursor:pointer;font-weight:600;font-size:13px;}
.btn:hover{background:#00ff70;transform:translateY(-1px);}
.result{background:#f8f9fa;border:2px solid #00ED64;border-radius:6px;padding:12px;margin-top:10px;font-family:monospace;font-size:12px;line-height:1.6;max-height:300px;overflow-y:auto;}
.query-box{background:#1e293b;color:#00ED64;padding:10px;border-radius:6px;font-family:monospace;font-size:12px;margin-bottom:10px;}
.doc-item{background:#fff;border:1px solid #e2e8f0;padding:8px;margin:6px 0;border-radius:4px;color:#334155;}
.count{background:#00ED64;color:#001E2B;padding:3px 8px;border-radius:4px;font-weight:700;font-size:13px;display:inline-block;}`,
      js: `var products = [
  { _id: 1, name: "Laptop Pro", price: 1299, category: "Electronics", rating: 4.5, inStock: true },
  { _id: 2, name: "Wireless Mouse", price: 29, category: "Electronics", rating: 4.2, inStock: true },
  { _id: 3, name: "MongoDB Book", price: 45, category: "Books", rating: 4.8, inStock: false },
  { _id: 4, name: "USB Cable", price: 12, category: "Electronics", rating: 3.9, inStock: true },
  { _id: 5, name: "Python Guide", price: 52, category: "Books", rating: 4.6, inStock: true },
  { _id: 6, name: "Tablet", price: 599, category: "Electronics", rating: 4.3, inStock: true }
];

function runQuery(type) {
  var query, results;
  
  if (type === 'gt100') {
    query = '{ price: { $gt: 100 } }';
    results = products.filter(function(p) { return p.price > 100; });
  } else if (type === 'range') {
    query = '{ price: { $gte: 20, $lte: 100 } }';
    results = products.filter(function(p) { return p.price >= 20 && p.price <= 100; });
  } else if (type === 'in') {
    query = '{ category: { $in: ["Books", "Toys"] } }';
    results = products.filter(function(p) { return p.category === "Books" || p.category === "Toys"; });
  } else if (type === 'or') {
    query = '{ $or: [{ price: { $lt: 30 } }, { rating: { $gte: 4.5 } }] }';
    results = products.filter(function(p) { return p.price < 30 || p.rating >= 4.5; });
  } else if (type === 'exists') {
    query = '{ inStock: { $exists: true } }';
    results = products.filter(function(p) { return p.inStock !== undefined; });
  } else if (type === 'regex') {
    query = '{ name: { $regex: /^[LP]/i } }';
    results = products.filter(function(p) { return /^[LP]/i.test(p.name); });
  }
  
  showResults(query, results);
}

function showResults(query, results) {
  var html = '<div class="query-box">db.products.find(' + query + ')</div>';
  html += '<div class="count">Found: ' + results.length + ' documents</div>';
  html += '<div class="result">';
  
  if (results.length === 0) {
    html += '<div style="color:#666;">No documents match the query</div>';
  } else {
    results.forEach(function(p) {
      html += '<div class="doc-item">' +
        '{ _id: ' + p._id + ', name: "' + p.name + '", price: ' + p.price + ', category: "' + p.category + '", rating: ' + p.rating + ' }' +
        '</div>';
    });
  }
  
  html += '</div>';
  document.getElementById('results').innerHTML = html;
}

document.getElementById('output').innerHTML =
  '<div class="container">' +
  '<div class="header">Query Operator Tester</div>' +
  '<div class="subtitle">Test MongoDB query operators on a sample product collection</div>' +
  '<div class="card">' +
  '<div class="label">Sample Collection: products (' + products.length + ' documents)</div>' +
  '<div class="btn-grid">' +
  '<button class="btn" onclick="runQuery(\\'gt100\\')">$gt: price &gt; 100</button>' +
  '<button class="btn" onclick="runQuery(\\'range\\')">$gte/$lte: 20-100</button>' +
  '<button class="btn" onclick="runQuery(\\'in\\')">$in: Books/Toys</button>' +
  '<button class="btn" onclick="runQuery(\\'or\\')">$or: cheap OR high rated</button>' +
  '<button class="btn" onclick="runQuery(\\'exists\\')">$exists: inStock</button>' +
  '<button class="btn" onclick="runQuery(\\'regex\\')">$regex: ^[LP]</button>' +
  '</div>' +
  '<div id="results">' +
  '<div style="color:#666;text-align:center;padding:20px;">Click a button to run a query</div>' +
  '</div>' +
  '</div>' +
  '</div>';

window.runQuery = runQuery;`,
    },
  ],
  exercises: [
    {
      id: 'mongodb-queries-1',
      question: 'Which query finds all products with price between 50 and 100?',
      type: 'multiple-choice',
      options: [
        'db.products.find({ price: 50-100 })',
        'db.products.find({ price: { $gte: 50, $lte: 100 } })',
        'db.products.find({ price: { $between: [50, 100] } })',
        'db.products.find({ price: { $range: 50, 100 } })',
      ],
      correct: 1,
      explanation: 'Use $gte (greater than or equal) and $lte (less than or equal) together to query for a range. MongoDB does not have a $between operator.',
    },
    {
      id: 'mongodb-queries-2',
      question: 'What does db.users.find({ skills: "MongoDB" }) return?',
      type: 'multiple-choice',
      options: [
        'Users where skills field equals the string "MongoDB"',
        'Users where skills array contains "MongoDB"',
        'Error - need to use $elemMatch',
        'Users where any field contains "MongoDB"',
      ],
      correct: 1,
      explanation: 'When querying an array field with a simple value, MongoDB finds documents where the array contains that value. No special operator is needed for simple array contains queries.',
    },
  ],
  quiz: [
    {
      id: 'mongodb-queries-q1',
      question: 'Which operator would you use to find users who are either admins OR have verified email?',
      options: [
        '$and',
        '$or',
        '$nor',
        '$in',
      ],
      correct: 1,
      explanation: '$or operator returns documents that match at least one of the conditions. Example: db.users.find({ $or: [{ role: "admin" }, { emailVerified: true }] })',
    },
  ],
};
