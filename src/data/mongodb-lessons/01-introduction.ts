import type { MongodbLesson } from '../mongodb-curriculum';

export const mongodbIntroLesson: MongodbLesson = {
  id: 'mongodb-introduction',
  title: 'Introduction to MongoDB',
  slug: 'introduction',
  chapter: 'intro',
  order: 1,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'What MongoDB is, NoSQL vs SQL, document model, and when to use MongoDB.',
  sections: [
    {
      type: 'text',
      content: 'MongoDB is a NoSQL database that stores data in flexible, JSON-like documents. Unlike traditional SQL databases with tables and rows, MongoDB uses collections and documents. This document model makes it easy to store complex data structures and scale horizontally across multiple servers.',
    },
    {
      type: 'analogy',
      title: 'Documents vs Tables',
      content: 'Think of SQL as a spreadsheet where every row must have the same columns. MongoDB is like a filing cabinet where each document (folder) can have different fields. One user document might have an email, another might not - MongoDB does not care. This flexibility is powerful when data structures evolve.',
    },
    {
      type: 'heading',
      content: 'NoSQL vs SQL',
    },
    {
      type: 'table',
      headers: ['Feature', 'SQL (MySQL, PostgreSQL)', 'NoSQL (MongoDB)'],
      rows: [
        ['Data Model', 'Tables with rows and columns', 'Collections with documents'],
        ['Schema', 'Fixed schema, defined upfront', 'Flexible schema, can change anytime'],
        ['Relationships', 'Foreign keys, JOINs', 'Embedded documents or references'],
        ['Scaling', 'Vertical (bigger servers)', 'Horizontal (more servers)'],
        ['Transactions', 'ACID across all operations', 'ACID for single documents, multi-doc from 4.0'],
        ['Best For', 'Complex queries, reporting, finance', 'Rapid development, unstructured data, scalability'],
      ],
    },
    {
      type: 'heading',
      content: 'MongoDB Document Model',
    },
    {
      type: 'example',
      title: 'SQL vs MongoDB data structure',
      content: 'The same user data in SQL requires multiple tables and JOINs. In MongoDB, everything is in one document.',
      language: 'javascript',
      code: `// SQL - Multiple tables, needs JOINs
// users table:
// id | name         | email
// 1  | Alice Smith  | alice@example.com

// addresses table:
// id | user_id | street       | city
// 1  | 1       | 123 Main St  | Boston

// SELECT * FROM users JOIN addresses ON users.id = addresses.user_id

// MONGODB - Single document, all data together
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "Alice Smith",
  "email": "alice@example.com",
  "address": {
    "street": "123 Main St",
    "city": "Boston",
    "zip": "02101"
  },
  "tags": ["developer", "javascript"],
  "created": ISODate("2024-01-15T10:30:00Z")
}`,
    },
    {
      type: 'heading',
      content: 'When to Use MongoDB',
    },
    {
      type: 'list',
      items: [
        'Rapid development - schema flexibility allows fast iteration without migrations',
        'Unstructured or semi-structured data - logs, user-generated content, sensor data',
        'High read/write throughput - social media feeds, real-time analytics, IoT',
        'Horizontal scaling - need to distribute data across many servers',
        'Document-centric data - catalogs, content management, user profiles',
        'Geospatial data - location-based queries with built-in geo indexes',
      ],
    },
    {
      type: 'note',
      title: 'When NOT to use MongoDB',
      content: 'MongoDB may not be ideal for: complex multi-table transactions (banking, financial ledgers), heavy JOIN operations across many collections, or when data integrity constraints are critical. SQL databases like PostgreSQL excel in these scenarios.',
    },
    {
      type: 'example',
      title: 'MongoDB basic concepts',
      content: 'This reference shows the core vocabulary: databases hold collections, collections hold documents, and each document gets an auto-generated _id. BSON extends JSON with richer types like Date and ObjectId.',
      language: 'javascript',
      code: `// Database - container for collections
use myDatabase

// Collection - group of documents (like a table)
db.users

// Document - a record (like a row, but flexible)
{
  "name": "Bob",
  "age": 30,
  "skills": ["Node.js", "MongoDB"]
}

// _id field - unique identifier (auto-generated if not provided)
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "title": "Learn MongoDB"
}

// BSON - Binary JSON format used internally
// Supports more types: Date, ObjectId, Binary, Decimal128`,
    },
    {
      type: 'tryit',
      title: 'MongoDB Document Explorer',
      css: `body{font-family:system-ui,sans-serif;padding:20px;margin:0;background:linear-gradient(135deg,#001E2B 0%,#003d4d 100%);}
.container{max-width:800px;margin:0 auto;}
.card{background:#fff;border-radius:12px;padding:20px;box-shadow:0 4px 20px rgba(0,237,100,0.15);margin-bottom:16px;}
.header{text-align:center;color:#00ED64;font-size:24px;font-weight:700;margin-bottom:8px;}
.subtitle{text-align:center;color:#fff;font-size:14px;margin-bottom:20px;}
.btn{background:#00ED64;color:#001E2B;border:none;padding:12px 24px;border-radius:8px;cursor:pointer;font-weight:600;font-size:14px;margin:4px;}
.btn:hover{background:#00ff70;transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,237,100,0.3);}
.doc-viewer{background:#f8f9fa;border:2px solid #00ED64;border-radius:8px;padding:16px;font-family:monospace;font-size:13px;white-space:pre;overflow-x:auto;line-height:1.6;color:#001E2B;}
.label{font-weight:600;color:#001E2B;margin-bottom:8px;font-size:14px;}
.comparison{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px;}
.comp-box{background:#f0fff4;border:2px solid #00ED64;border-radius:8px;padding:12px;}
.comp-title{font-weight:700;color:#001E2B;margin-bottom:8px;text-align:center;font-size:13px;}
.comp-content{font-family:monospace;font-size:12px;color:#334155;white-space:pre;line-height:1.5;}`,
      js: `var documents = {
  user: {
    "_id": "ObjectId('64a5f1...')",
    "name": "Alice Smith",
    "email": "alice@example.com",
    "age": 28,
    "skills": ["JavaScript", "Python", "MongoDB"],
    "address": {
      "street": "123 Main St",
      "city": "Boston",
      "zip": "02101"
    },
    "active": true,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  product: {
    "_id": "ObjectId('64b2c3...')",
    "name": "Laptop",
    "price": 1299.99,
    "category": "Electronics",
    "specs": {
      "cpu": "Intel i7",
      "ram": "16GB",
      "storage": "512GB SSD"
    },
    "tags": ["computer", "portable", "work"],
    "inStock": true,
    "reviews": 127
  },
  order: {
    "_id": "ObjectId('64c8d9...')",
    "orderNumber": "ORD-2024-001",
    "customerId": "ObjectId('64a5f1...')",
    "items": [
      { "productId": "64b2c3...", "quantity": 1, "price": 1299.99 },
      { "productId": "64b2c4...", "quantity": 2, "price": 29.99 }
    ],
    "total": 1359.97,
    "status": "shipped",
    "orderDate": "2024-03-20T14:22:00Z"
  }
};

var sqlVsNoSQL = {
  sql: "-- Multiple tables needed\\nUSERS:\\n  id | name  | email\\n  1  | Alice | alice@example.com\\n\\nADDRESSES:\\n  id | user_id | city\\n  1  | 1       | Boston\\n\\nSKILLS:\\n  id | user_id | skill\\n  1  | 1       | JavaScript\\n  2  | 1       | Python\\n\\n-- Need JOINs to get full data",
  nosql: "// One document, all data\ {\   \\"_id\\": ObjectId('...'),\   \\"name\\": \\"Alice\\",\   \\"email\\": \\"alice@example.com\\",\   \\"address\\": {\     \\"city\\": \\"Boston\\"\   },\   \\"skills\\": [\     \\"JavaScript\\",\     \\"Python\\"\   ]\ }\ \ // No JOINs needed!"
};

function showDoc(type) {
  var doc = JSON.stringify(documents[type], null, 2);
  document.getElementById('docDisplay').innerHTML = doc;
}

function showComparison() {
  document.getElementById('comparison').style.display = 'grid';
}

document.getElementById('output').innerHTML =
  '<div class="container">' +
  '<div class="header">MongoDB Document Explorer</div>' +
  '<div class="subtitle">Explore how MongoDB stores data in flexible JSON documents</div>' +
  '<div class="card">' +
  '<div class="label">Select a document type:</div>' +
  '<button class="btn" onclick="showDoc(\\'user\\')">User Document</button>' +
  '<button class="btn" onclick="showDoc(\\'product\\')">Product Document</button>' +
  '<button class="btn" onclick="showDoc(\\'order\\')">Order Document</button>' +
  '<button class="btn" onclick="showComparison()">SQL vs NoSQL</button>' +
  '</div>' +
  '<div class="card">' +
  '<div class="label">Document Structure:</div>' +
  '<div id="docDisplay" class="doc-viewer">Click a button above to view a MongoDB document...</div>' +
  '</div>' +
  '<div id="comparison" class="comparison" style="display:none;">' +
  '<div class="comp-box">' +
  '<div class="comp-title">SQL - Multiple Tables</div>' +
  '<div class="comp-content">' + sqlVsNoSQL.sql + '</div>' +
  '</div>' +
  '<div class="comp-box">' +
  '<div class="comp-title">MongoDB - One Document</div>' +
  '<div class="comp-content">' + sqlVsNoSQL.nosql + '</div>' +
  '</div>' +
  '</div>' +
  '</div>';

window.showDoc = showDoc;
window.showComparison = showComparison;`,
    },
  ],
  exercises: [
    {
      id: 'mongodb-intro-1',
      question: 'What is the main difference between SQL and MongoDB data models?',
      type: 'multiple-choice',
      options: [
        'SQL is faster than MongoDB',
        'SQL uses tables with fixed schemas, MongoDB uses flexible documents',
        'SQL cannot handle large datasets',
        'MongoDB requires schema definitions before inserting data',
      ],
      correct: 1,
      explanation: 'SQL databases use tables with fixed schemas where all rows must have the same columns. MongoDB uses a flexible document model where each document can have different fields, allowing schema changes without migrations.',
    },
    {
      id: 'mongodb-intro-2',
      question: 'When is MongoDB a good choice?',
      type: 'multiple-choice',
      options: [
        'Complex multi-table transactions like banking systems',
        'Rapid development with evolving schemas and unstructured data',
        'Heavy JOIN operations across many tables',
        'Only when you need a free database',
      ],
      correct: 1,
      explanation: 'MongoDB excels at rapid development with its flexible schema, handling unstructured or semi-structured data, and horizontal scaling. It is ideal for modern web applications, content management, real-time analytics, and IoT scenarios.',
    },
  ],
  quiz: [
    {
      id: 'mongodb-intro-q1',
      question: 'What is a MongoDB document most similar to?',
      options: [
        'A SQL table',
        'A JSON object',
        'A CSV file',
        'An XML schema',
      ],
      correct: 1,
      explanation: 'MongoDB documents are stored in BSON (Binary JSON) format and closely resemble JSON objects. They contain field-value pairs and can include nested objects and arrays, just like JSON.',
    },
  ],
};
