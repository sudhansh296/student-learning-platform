import type { MongodbLesson } from '../mongodb-curriculum';

export const mongodbArraysLesson: MongodbLesson = {
  id: 'mongodb-arrays',
  title: 'Arrays and Embedded Documents',
  slug: 'arrays-embedded',
  chapter: 'queries',
  order: 5,
  difficulty: 'intermediate',
  readingTime: 13,
  description: 'Working with arrays and nested documents - dot notation, array operators, and embedded document queries.',
  sections: [
    {
      type: 'text',
      content: 'MongoDB documents can contain arrays and nested objects, making it easy to model complex data structures. Dot notation allows you to access nested fields, and specialized operators enable powerful array manipulations.',
    },
    {
      type: 'heading',
      content: 'Dot Notation for Nested Fields',
    },
    {
      type: 'example',
      title: 'Querying embedded documents',
      content: 'Dot notation like "address.city" lets you query or update fields inside nested objects. Quote the dotted path as a string so MongoDB interprets it as a path, not a literal key.',
      language: 'javascript',
      code: `// Sample document with nested structure
{
  _id: 1,
  name: "Alice",
  address: {
    street: "123 Main St",
    city: "Boston",
    zip: "02101"
  },
  scores: [85, 92, 88]
}

// Query nested field using dot notation
db.users.find({ "address.city": "Boston" })

// Query nested field in array
db.users.find({ "scores.0": 85 })  // first element = 85

// Multiple nested levels
db.orders.find({ "customer.address.city": "NYC" })

// Update nested field
db.users.updateOne(
  { name: "Alice" },
  { $set: { "address.city": "Cambridge" } }
)`,
    },
    {
      type: 'heading',
      content: 'Array Update Operators',
    },
    {
      type: 'example',
      title: '$push - Add element to array',
      content: '$push appends a value to an array field. Pair it with $each to add multiple values at once, $position to insert at a specific index, and $slice to cap the array at a maximum length.',
      language: 'javascript',
      code: `// Add single element
db.users.updateOne(
  { name: "Alice" },
  { $push: { skills: "MongoDB" } }
)

// Add multiple elements
db.users.updateOne(
  { name: "Alice" },
  { $push: { skills: { $each: ["Python", "React"] } } }
)

// Add with position (insert at specific index)
db.users.updateOne(
  { name: "Alice" },
  { $push: { skills: { $each: ["Docker"], $position: 0 } } }
)

// Add with sorting
db.users.updateOne(
  { name: "Alice" },
  { $push: { scores: { $each: [95, 88], $sort: -1 } } }
)

// Add and limit array size
db.users.updateOne(
  { name: "Alice" },
  { 
    $push: { 
      recentViews: {
        $each: ["product123"],
        $slice: -10  // keep only last 10 items
      }
    }
  }
)`,
    },
    {
      type: 'example',
      title: '$pull and $pop - Remove from array',
      content: '$pull removes all elements that match a value or condition. $pop removes the first or last element by position. $pullAll removes multiple specific values in a single operation.',
      language: 'javascript',
      code: `// $pull - remove all matching values
db.users.updateOne(
  { name: "Alice" },
  { $pull: { skills: "MongoDB" } }
)

// $pull with condition
db.users.updateOne(
  { name: "Alice" },
  { $pull: { scores: { $lt: 70 } } }
)

// $pop - remove first or last element
db.users.updateOne(
  { name: "Alice" },
  { $pop: { skills: 1 } }  // 1 = last, -1 = first
)

// Remove last element
db.users.updateOne(
  { name: "Alice" },
  { $pop: { scores: 1 } }
)

// $pullAll - remove multiple specific values
db.users.updateOne(
  { name: "Alice" },
  { $pullAll: { skills: ["Python", "Java"] } }
)`,
    },
    {
      type: 'example',
      title: '$addToSet - Add unique values',
      content: '$addToSet only inserts a value if it does not already exist in the array, making it ideal for maintaining tag lists, category sets, or any array where duplicates are not allowed.',
      language: 'javascript',
      code: `// Add only if not already in array (prevents duplicates)
db.users.updateOne(
  { name: "Alice" },
  { $addToSet: { skills: "JavaScript" } }
)

// Add multiple unique values
db.users.updateOne(
  { name: "Alice" },
  { $addToSet: { skills: { $each: ["Python", "MongoDB", "React"] } } }
)

// Use case: tags, categories, unique identifiers
db.articles.updateOne(
  { _id: 123 },
  { $addToSet: { tags: "mongodb" } }
)`,
    },
    {
      type: 'heading',
      content: 'Querying Arrays',
    },
    {
      type: 'example',
      title: 'Array query operators',
      content: '$all ensures every listed value is present in the array, $size matches on exact array length, and $elemMatch lets you apply multiple conditions to a single array element rather than across elements.',
      language: 'javascript',
      code: `// Find documents where array contains value
db.users.find({ skills: "JavaScript" })

// Find documents where array contains all values
db.users.find({ skills: { $all: ["JavaScript", "MongoDB"] } })

// Find by array size
db.users.find({ skills: { $size: 3 } })

// $elemMatch - array element matches all conditions
db.products.find({
  reviews: {
    $elemMatch: {
      rating: { $gte: 4 },
      verified: true,
      date: { $gte: new Date("2024-01-01") }
    }
  }
})

// Query array by index
db.users.find({ "skills.0": "JavaScript" })  // first skill

// Array contains any of these values
db.users.find({ skills: { $in: ["Python", "Java", "C++"] } })`,
    },
    {
      type: 'example',
      title: 'Updating specific array elements',
      language: 'javascript',
      code: `// Update first matching array element with $
db.products.updateOne(
  { _id: 1, "reviews.userId": "user123" },
  { $set: { "reviews.$.rating": 5 } }
)

// Update all matching array elements with $[]
db.products.updateOne(
  { _id: 1 },
  { $set: { "reviews.$[].verified": true } }
)

// Update specific elements with arrayFilters
db.products.updateOne(
  { _id: 1 },
  { $set: { "reviews.$[elem].verified": true } },
  { arrayFilters: [{ "elem.rating": { $gte: 4 } }] }
)

// Increment array element
db.products.updateOne(
  { _id: 1 },
  { $inc: { "reviews.$[elem].helpfulCount": 1 } },
  { arrayFilters: [{ "elem.userId": "user123" }] }
)`,
    },
    {
      type: 'heading',
      content: 'Embedded Documents',
    },
    {
      type: 'example',
      title: 'Working with embedded documents',
      language: 'javascript',
      code: `// Document with embedded object
{
  _id: 1,
  name: "Alice",
  address: {
    street: "123 Main St",
    city: "Boston",
    state: "MA",
    coordinates: {
      lat: 42.3601,
      lng: -71.0589
    }
  }
}

// Query nested field
db.users.find({ "address.city": "Boston" })

// Query deeply nested field
db.users.find({ "address.coordinates.lat": { $gt: 40 } })

// Update nested field
db.users.updateOne(
  { name: "Alice" },
  { $set: { "address.zip": "02101" } }
)

// Update multiple nested fields
db.users.updateOne(
  { name: "Alice" },
  {
    $set: {
      "address.city": "Cambridge",
      "address.zip": "02139"
    }
  }
)

// Replace entire embedded document
db.users.updateOne(
  { name: "Alice" },
  {
    $set: {
      address: {
        street: "456 Oak Ave",
        city: "Cambridge",
        state: "MA",
        zip: "02139"
      }
    }
  }
)`,
    },
    {
      type: 'example',
      title: 'Array of embedded documents',
      language: 'javascript',
      code: `// Document with array of objects
{
  _id: 1,
  orderId: "ORD-2024-001",
  items: [
    { productId: "P001", name: "Laptop", price: 1299, qty: 1 },
    { productId: "P002", name: "Mouse", price: 29, qty: 2 },
    { productId: "P003", name: "Keyboard", price: 79, qty: 1 }
  ]
}

// Query array element field
db.orders.find({ "items.productId": "P001" })

// $elemMatch for multiple conditions on same element
db.orders.find({
  items: {
    $elemMatch: {
      price: { $gte: 50 },
      qty: { $gte: 1 }
    }
  }
})

// Update specific array element
db.orders.updateOne(
  { _id: 1, "items.productId": "P001" },
  { $set: { "items.$.price": 1199 } }
)

// Add new item to array
db.orders.updateOne(
  { _id: 1 },
  { $push: { items: { productId: "P004", name: "Cable", price: 15, qty: 1 } } }
)

// Remove item from array
db.orders.updateOne(
  { _id: 1 },
  { $pull: { items: { productId: "P002" } } }
)`,
    },
    {
      type: 'tip',
      title: 'When to embed vs reference',
      content: 'Embed documents when: data is accessed together, one-to-few relationships, data does not change often. Use references when: data is accessed independently, one-to-many or many-to-many relationships, data changes frequently, document size might exceed 16MB limit.',
    },
    {
      type: 'tryit',
      title: 'Array Operations Playground',
      css: `body{font-family:system-ui,sans-serif;padding:16px;margin:0;background:linear-gradient(135deg,#001E2B 0%,#003d4d 100%);}
.container{max-width:800px;margin:0 auto;}
.header{text-align:center;color:#00ED64;font-size:26px;font-weight:700;margin-bottom:6px;}
.card{background:#fff;border-radius:10px;padding:18px;box-shadow:0 4px 20px rgba(0,237,100,0.2);margin-bottom:12px;}
.label{font-weight:600;color:#001E2B;font-size:14px;margin-bottom:8px;}
.btn-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin-bottom:12px;}
.btn{background:#00ED64;color:#001E2B;border:none;padding:10px;border-radius:6px;cursor:pointer;font-weight:600;font-size:13px;}
.btn:hover{background:#00ff70;transform:translateY(-1px);}
.btn.remove{background:#ef4444;color:#fff;}
.btn.remove:hover{background:#dc2626;}
.doc-view{background:#f8f9fa;border:2px solid #00ED64;border-radius:8px;padding:14px;font-family:monospace;font-size:13px;line-height:1.6;}
.array-items{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;}
.array-item{background:#00ED64;color:#001E2B;padding:4px 10px;border-radius:4px;font-weight:600;font-size:12px;}
.operation{background:#1e293b;color:#00ED64;padding:8px;border-radius:6px;font-family:monospace;font-size:12px;margin-top:8px;}`,
      js: `var user = {
  name: "Alice",
  skills: ["JavaScript", "HTML", "CSS"],
  scores: [85, 92, 88]
};
var lastOp = "";

function render() {
  var html = '<div class="container">' +
    '<div class="header">Array Operations</div>' +
    '<div class="card">' +
    '<div class="label">User Document:</div>' +
    '<div class="doc-view">' +
    '{ name: "' + user.name + '",<br>' +
    '  skills: [' + user.skills.map(function(s) { return \'"' + s + '\\"'; }).join(', ') + '],<br>' +
    '  scores: [' + user.scores.join(', ') + '] }' +
    '</div>' +
    (lastOp ? '<div class="operation">Last operation: ' + lastOp + '</div>' : '') +
    '</div>' +
    '<div class="card">' +
    '<div class="label">Array Operations:</div>' +
    '<div class="btn-grid">' +
    '<button class="btn" onclick="pushSkill()">$push skill</button>' +
    '<button class="btn" onclick="addToSet()">$addToSet skill</button>' +
    '<button class="btn remove" onclick="popSkill()">$pop last skill</button>' +
    '<button class="btn remove" onclick="pullSkill()">$pull skill</button>' +
    '<button class="btn" onclick="pushScore()">$push score</button>' +
    '<button class="btn" onclick="incScore()">$inc first score</button>' +
    '</div>' +
    '</div>' +
    '</div>';
  document.getElementById('output').innerHTML = html;
}

function pushSkill() {
  user.skills.push("MongoDB");
  lastOp = 'db.users.updateOne({ name: "Alice" }, { $push: { skills: "MongoDB" } })';
  render();
}

function addToSet() {
  if (user.skills.indexOf("React") === -1) {
    user.skills.push("React");
  }
  lastOp = 'db.users.updateOne({ name: "Alice" }, { $addToSet: { skills: "React" } })';
  render();
}

function popSkill() {
  if (user.skills.length > 0) {
    user.skills.pop();
    lastOp = 'db.users.updateOne({ name: "Alice" }, { $pop: { skills: 1 } })';
  }
  render();
}

function pullSkill() {
  if (user.skills.length > 0) {
    var removed = user.skills.shift();
    lastOp = 'db.users.updateOne({ name: "Alice" }, { $pull: { skills: "' + removed + '" } })';
  }
  render();
}

function pushScore() {
  var newScore = 80 + Math.floor(Math.random() * 20);
  user.scores.push(newScore);
  lastOp = 'db.users.updateOne({ name: "Alice" }, { $push: { scores: ' + newScore + ' } })';
  render();
}

function incScore() {
  if (user.scores.length > 0) {
    user.scores[0] += 5;
    lastOp = 'db.users.updateOne({ name: "Alice" }, { $inc: { "scores.0": 5 } })';
  }
  render();
}

render();
window.pushSkill = pushSkill;
window.addToSet = addToSet;
window.popSkill = popSkill;
window.pullSkill = pullSkill;
window.pushScore = pushScore;
window.incScore = incScore;`,
    },
  ],
  exercises: [
    {
      id: 'mongodb-arrays-1',
      question: 'What is the difference between $push and $addToSet?',
      type: 'multiple-choice',
      options: [
        '$push is faster than $addToSet',
        '$push adds duplicates, $addToSet only adds if value does not exist',
        '$addToSet can add multiple values, $push cannot',
        'They are the same, just different names',
      ],
      correct: 1,
      explanation: '$push always adds the value to the array, even if it already exists (allowing duplicates). $addToSet only adds the value if it is not already present, ensuring uniqueness.',
    },
    {
      id: 'mongodb-arrays-2',
      question: 'How do you query a nested field in MongoDB?',
      type: 'multiple-choice',
      options: [
        'db.users.find({ address->city: "Boston" })',
        'db.users.find({ address.city: "Boston" })',
        'db.users.find({ "address.city": "Boston" })',
        'Both B and C are correct',
      ],
      correct: 3,
      explanation: 'Use dot notation to access nested fields. You can use either address.city or "address.city" (quoted). Quotes are required when the field name contains special characters or spaces.',
    },
  ],
  quiz: [
    {
      id: 'mongodb-arrays-q1',
      question: 'Which operator updates the first matching element in an array?',
      options: [
        '$[]',
        '$',
        '$elemMatch',
        '$first',
      ],
      correct: 1,
      explanation: 'The positional $ operator updates the first array element that matches the query condition. Example: db.users.updateOne({ "items.id": 5 }, { $set: { "items.$.qty": 10 } })',
    },
  ],
};
