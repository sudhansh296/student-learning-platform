import type { MongodbLesson } from '../mongodb-curriculum';

export const mongodbCrudLesson: MongodbLesson = {
  id: 'mongodb-crud',
  title: 'CRUD Operations',
  slug: 'crud-basics',
  chapter: 'crud',
  order: 3,
  difficulty: 'beginner',
  readingTime: 15,
  description: 'Create, Read, Update, Delete operations - insertOne, find, updateOne, deleteOne and their bulk variants.',
  sections: [
    {
      type: 'text',
      content: 'CRUD operations are the foundation of working with MongoDB. Create (insert), Read (find), Update (modify), and Delete (remove) documents. MongoDB provides both single-document and bulk operations for each CRUD action.',
    },
    {
      type: 'heading',
      content: 'Create - Inserting Documents',
    },
    {
      type: 'example',
      title: 'insertOne() - Insert a single document',
      content: 'insertOne() adds a single document to the collection and returns an acknowledged result with the auto-generated _id.',
      language: 'javascript',
      code: `// Insert one document
db.users.insertOne({
  name: "Alice Johnson",
  email: "alice@example.com",
  age: 28,
  skills: ["JavaScript", "Python"],
  createdAt: new Date()
});

// Returns:
// {
//   acknowledged: true,
//   insertedId: ObjectId("507f1f77bcf86cd799439011")
// }

// The _id field is auto-generated if not provided`,
      output: '{ acknowledged: true, insertedId: ObjectId("507f1f77bcf86cd799439011") }',
    },
    {
      type: 'example',
      title: 'insertMany() - Insert multiple documents',
      content: 'insertMany() inserts an array of documents in a single operation, which is significantly faster than calling insertOne() in a loop.',
      language: 'javascript',
      code: `// Insert multiple documents at once
db.users.insertMany([
  {
    name: "Bob Smith",
    email: "bob@example.com",
    age: 32,
    skills: ["Java", "SQL"]
  },
  {
    name: "Carol White",
    email: "carol@example.com",
    age: 25,
    skills: ["React", "MongoDB"]
  },
  {
    name: "David Brown",
    email: "david@example.com",
    age: 30
  }
]);

// Returns:
// {
//   acknowledged: true,
//   insertedIds: {
//     '0': ObjectId("507f1f77bcf86cd799439012"),
//     '1': ObjectId("507f1f77bcf86cd799439013"),
//     '2': ObjectId("507f1f77bcf86cd799439014")
//   }
// }`,
      output: 'Inserted 3 documents',
    },
    {
      type: 'heading',
      content: 'Read - Finding Documents',
    },
    {
      type: 'example',
      title: 'find() - Query documents',
      content: 'find() returns a cursor to all matching documents. Use a filter object to narrow results, a projection object to select fields, and chain .sort(), .limit(), and .skip() for pagination and ordering.',
      language: 'javascript',
      code: `// Find all documents
db.users.find()

// Find with a filter
db.users.find({ age: 28 })

// Find with multiple conditions
db.users.find({ age: 28, name: "Alice Johnson" })

// Find and return only specific fields (projection)
db.users.find(
  { age: { $gte: 25 } },
  { name: 1, email: 1, _id: 0 }  // 1 = include, 0 = exclude
)

// Limit results
db.users.find().limit(5)

// Sort results
db.users.find().sort({ age: -1 })  // -1 = descending, 1 = ascending

// Skip and limit (pagination)
db.users.find().skip(10).limit(5)  // Skip first 10, return next 5`,
    },
    {
      type: 'example',
      title: 'findOne() - Find a single document',
      content: 'findOne() returns the first matching document as a plain object (not a cursor), or null if no match exists. Use it when you expect exactly one result, such as looking up a user by email.',
      language: 'javascript',
      code: `// Find first matching document
db.users.findOne({ name: "Alice Johnson" })

// Returns:
// {
//   _id: ObjectId("507f1f77bcf86cd799439011"),
//   name: "Alice Johnson",
//   email: "alice@example.com",
//   age: 28,
//   skills: ["JavaScript", "Python"],
//   createdAt: ISODate("2024-03-20T10:30:00Z")
// }

// Returns null if no match found
db.users.findOne({ name: "NonExistent" })  // null`,
    },
    {
      type: 'heading',
      content: 'Update - Modifying Documents',
    },
    {
      type: 'example',
      title: 'updateOne() - Update a single document',
      content: 'updateOne() modifies the first document that matches the filter using update operators like $set, $push, and $unset. It never overwrites the whole document, only the fields you specify.',
      language: 'javascript',
      code: `// Update first matching document
db.users.updateOne(
  { name: "Alice Johnson" },  // filter
  { $set: { age: 29 } }        // update operation
)

// Returns:
// {
//   acknowledged: true,
//   matchedCount: 1,
//   modifiedCount: 1
// }

// Update multiple fields
db.users.updateOne(
  { email: "alice@example.com" },
  {
    $set: {
      age: 29,
      city: "Boston",
      lastModified: new Date()
    }
  }
)

// Add to array
db.users.updateOne(
  { name: "Alice Johnson" },
  { $push: { skills: "MongoDB" } }
)

// Remove a field
db.users.updateOne(
  { name: "Alice Johnson" },
  { $unset: { city: "" } }
)`,
      output: '{ acknowledged: true, matchedCount: 1, modifiedCount: 1 }',
    },
    {
      type: 'example',
      title: 'updateMany() - Update multiple documents',
      content: 'updateMany() applies the same update operation to every document that matches the filter. Pass an empty filter {} to update the entire collection, such as adding a default field to all documents.',
      language: 'javascript',
      code: `// Update all matching documents
db.users.updateMany(
  { age: { $lt: 30 } },  // filter: age less than 30
  { $set: { category: "young professional" } }
)

// Returns:
// {
//   acknowledged: true,
//   matchedCount: 3,
//   modifiedCount: 3
// }

// Increment all ages by 1
db.users.updateMany(
  {},  // empty filter = all documents
  { $inc: { age: 1 } }
)`,
      output: '{ acknowledged: true, matchedCount: 4, modifiedCount: 4 }',
    },
    {
      type: 'example',
      title: 'replaceOne() - Replace entire document',
      content: 'replaceOne() swaps out the entire document body (except _id) with the new object you provide. Unlike updateOne(), any fields you omit are deleted from the document.',
      language: 'javascript',
      code: `// Replace entire document (keeps _id)
db.users.replaceOne(
  { name: "Alice Johnson" },
  {
    name: "Alice Johnson",
    email: "alice.new@example.com",
    age: 29,
    status: "active"
  }
)

// All old fields are removed except _id
// New document structure replaces the old one`,
    },
    {
      type: 'heading',
      content: 'Delete - Removing Documents',
    },
    {
      type: 'example',
      title: 'deleteOne() - Delete a single document',
      content: 'deleteOne() removes the first document matching the filter and returns how many were deleted. Always filter by _id when you want to guarantee you delete exactly the right document.',
      language: 'javascript',
      code: `// Delete first matching document
db.users.deleteOne({ name: "Bob Smith" })

// Returns:
// {
//   acknowledged: true,
//   deletedCount: 1
// }

// Delete by _id
db.users.deleteOne({ _id: ObjectId("507f1f77bcf86cd799439011") })`,
      output: '{ acknowledged: true, deletedCount: 1 }',
    },
    {
      type: 'example',
      title: 'deleteMany() - Delete multiple documents',
      content: 'deleteMany() removes all documents matching the filter at once. Passing an empty filter {} deletes everything in the collection, so use this with caution in production.',
      language: 'javascript',
      code: `// Delete all matching documents
db.users.deleteMany({ age: { $lt: 25 } })

// Returns:
// {
//   acknowledged: true,
//   deletedCount: 3
// }

// Delete all documents in collection
db.users.deleteMany({})  // Deletes everything!

// Drop entire collection (faster than deleteMany)
db.users.drop()`,
      output: '{ acknowledged: true, deletedCount: 3 }',
    },
    {
      type: 'table',
      title: 'CRUD Operations Summary',
      headers: ['Operation', 'Method', 'Description'],
      rows: [
        ['Create One', 'insertOne(doc)', 'Insert a single document'],
        ['Create Many', 'insertMany([docs])', 'Insert multiple documents'],
        ['Read All', 'find(filter)', 'Find all matching documents'],
        ['Read One', 'findOne(filter)', 'Find first matching document'],
        ['Update One', 'updateOne(filter, update)', 'Update first match'],
        ['Update Many', 'updateMany(filter, update)', 'Update all matches'],
        ['Replace One', 'replaceOne(filter, doc)', 'Replace entire document'],
        ['Delete One', 'deleteOne(filter)', 'Delete first match'],
        ['Delete Many', 'deleteMany(filter)', 'Delete all matches'],
      ],
    },
    {
      type: 'note',
      title: 'Update Operators',
      content: 'Common update operators: $set (set field value), $unset (remove field), $inc (increment number), $push (add to array), $pull (remove from array), $addToSet (add to array if not exists), $rename (rename field).',
    },
    {
      type: 'tryit',
      title: 'MongoDB CRUD Playground',
      css: `body{font-family:system-ui,sans-serif;padding:16px;margin:0;background:linear-gradient(135deg,#001E2B 0%,#003d4d 100%);}
.container{max-width:900px;margin:0 auto;}
.header{text-align:center;color:#00ED64;font-size:28px;font-weight:700;margin-bottom:6px;}
.subtitle{text-align:center;color:#fff;font-size:14px;margin-bottom:16px;}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin-bottom:12px;}
.btn{background:#00ED64;color:#001E2B;border:none;padding:10px 16px;border-radius:6px;cursor:pointer;font-weight:600;font-size:13px;text-align:center;}
.btn:hover{background:#00ff70;transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,237,100,0.3);}
.btn.delete{background:#ef4444;}
.btn.delete:hover{background:#dc2626;}
.output-box{background:#fff;border-radius:10px;padding:16px;margin-top:12px;box-shadow:0 4px 20px rgba(0,237,100,0.2);}
.doc{background:#f8f9fa;border:2px solid #00ED64;border-radius:6px;padding:10px;margin:8px 0;font-family:monospace;font-size:12px;}
.doc-header{font-weight:700;color:#001E2B;margin-bottom:4px;}
.count{background:#00ED64;color:#001E2B;padding:4px 10px;border-radius:4px;font-weight:700;font-size:14px;display:inline-block;margin-bottom:8px;}
.label{font-weight:600;color:#001E2B;font-size:14px;margin-bottom:6px;}`,
      js: `var users = [
  { _id: 1, name: "Alice", age: 28, city: "Boston", skills: ["JavaScript"] },
  { _id: 2, name: "Bob", age: 32, city: "NYC", skills: ["Python", "SQL"] },
  { _id: 3, name: "Carol", age: 25, city: "Boston", skills: ["React"] }
];

function render() {
  var html = '<div class="container">' +
    '<div class="header">MongoDB CRUD Operations</div>' +
    '<div class="subtitle">Click buttons to perform Create, Read, Update, Delete operations</div>' +
    '<div class="grid">' +
    '<button class="btn" onclick="insertUser()">Insert User</button>' +
    '<button class="btn" onclick="findAll()">Find All</button>' +
    '<button class="btn" onclick="findBoston()">Find Boston</button>' +
    '<button class="btn" onclick="updateAge()">Update Age</button>' +
    '<button class="btn" onclick="addSkill()">Add Skill</button>' +
    '<button class="btn delete" onclick="deleteUser()">Delete User</button>' +
    '</div>' +
    '<div class="output-box">' +
    '<div class="label">Collection: users</div>' +
    '<div class="count">Documents: ' + users.length + '</div>';
  
  users.forEach(function(u) {
    html += '<div class="doc">' +
      '<div class="doc-header">_id: ' + u._id + '</div>' +
      'name: "' + u.name + '", age: ' + u.age + ', city: "' + u.city + '"<br>' +
      'skills: [' + u.skills.map(function(s) { return '"' + s + '"'; }).join(', ') + ']' +
      '</div>';
  });
  
  html += '</div></div>';
  document.getElementById('output').innerHTML = html;
}

function insertUser() {
  var newId = users.length > 0 ? Math.max.apply(null, users.map(function(u) { return u._id; })) + 1 : 1;
  users.push({
    _id: newId,
    name: "User" + newId,
    age: 20 + newId,
    city: "Seattle",
    skills: ["MongoDB"]
  });
  render();
}

function findAll() {
  alert("db.users.find()\\n\\nReturned " + users.length + " documents");
}

function findBoston() {
  var bostonUsers = users.filter(function(u) { return u.city === "Boston"; });
  alert("db.users.find({ city: \\"Boston\\" })\\n\\nFound " + bostonUsers.length + " users in Boston");
}

function updateAge() {
  if (users.length > 0) {
    users[0].age += 1;
    alert("db.users.updateOne({ name: \\"" + users[0].name + "\\" }, { $inc: { age: 1 } })\\n\\nIncremented age to " + users[0].age);
    render();
  }
}

function addSkill() {
  if (users.length > 0) {
    users[0].skills.push("MongoDB");
    alert("db.users.updateOne({ name: \\"" + users[0].name + "\\" }, { $push: { skills: \\"MongoDB\\" } })\\n\\nAdded skill");
    render();
  }
}

function deleteUser() {
  if (users.length > 0) {
    var deleted = users.pop();
    alert("db.users.deleteOne({ _id: " + deleted._id + " })\\n\\nDeleted user: " + deleted.name);
    render();
  }
}

render();
window.insertUser = insertUser;
window.findAll = findAll;
window.findBoston = findBoston;
window.updateAge = updateAge;
window.addSkill = addSkill;
window.deleteUser = deleteUser;`,
    },
  ],
  exercises: [
    {
      id: 'mongodb-crud-1',
      question: 'Which method inserts a single document into MongoDB?',
      type: 'multiple-choice',
      options: [
        'db.collection.insert()',
        'db.collection.insertOne()',
        'db.collection.add()',
        'db.collection.create()',
      ],
      correct: 1,
      explanation: 'insertOne() is the method to insert a single document. While insert() also works, insertOne() is the modern recommended approach that clearly indicates single document insertion.',
    },
    {
      id: 'mongodb-crud-2',
      question: 'What does db.users.updateOne({ name: "Alice" }, { $set: { age: 30 } }) do?',
      type: 'multiple-choice',
      options: [
        'Updates all users named Alice to age 30',
        'Updates the first user named Alice to age 30',
        'Creates a new user Alice with age 30',
        'Replaces the entire Alice document with { age: 30 }',
      ],
      correct: 1,
      explanation: 'updateOne() updates only the first document that matches the filter. It uses $set to update specific fields without affecting other fields. Use updateMany() to update all matching documents.',
    },
  ],
  quiz: [
    {
      id: 'mongodb-crud-q1',
      question: 'What is the difference between updateOne() and replaceOne()?',
      options: [
        'They are the same, just different names',
        'updateOne() modifies specific fields, replaceOne() replaces the entire document',
        'updateOne() is faster than replaceOne()',
        'replaceOne() can update multiple documents',
      ],
      correct: 1,
      explanation: 'updateOne() uses update operators like $set to modify specific fields while keeping other fields intact. replaceOne() replaces the entire document content (except _id) with a new document structure.',
    },
  ],
};
