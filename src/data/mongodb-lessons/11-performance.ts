import type { MongodbLesson } from '../mongodb-curriculum';

export const mongodbPerformanceLesson: MongodbLesson = {
  id: 'mongodb-performance',
  title: 'Performance Optimization',
  slug: 'performance',
  chapter: 'advanced',
  order: 11,
  difficulty: 'advanced',
  readingTime: 14,
  description: 'Query optimization, explain plans, profiling, monitoring, and best practices for fast MongoDB operations.',
  sections: [
    {
      type: 'text',
      content: 'MongoDB performance depends on proper indexing, efficient queries, schema design, and system resources. Understanding query execution plans and monitoring database metrics helps identify and fix performance bottlenecks.',
    },
    {
      type: 'heading',
      content: 'Query Explain Plans',
    },
    {
      type: 'example',
      title: 'Using explain() to analyze queries',
      language: 'javascript',
      code: `// Basic explain
db.users.find({ email: "alice@example.com" }).explain()

// Execution stats (detailed performance data)
db.users.find({ email: "alice@example.com" }).explain("executionStats")

// All plans (shows rejected plans too)
db.users.find({ age: { $gt: 25 } }).explain("allPlansExecution")

// Key metrics in explain output:
// - executionTimeMillis: query execution time
// - totalDocsExamined: documents scanned
// - totalKeysExamined: index keys scanned
// - nReturned: documents returned
// - stage: IXSCAN (index) vs COLLSCAN (collection scan)

// Example explain output:
{
  "executionStats": {
    "executionSuccess": true,
    "nReturned": 1,
    "executionTimeMillis": 2,
    "totalKeysExamined": 1,
    "totalDocsExamined": 1,
    "executionStages": {
      "stage": "IXSCAN",  // Using index (good!)
      "indexName": "email_1"
    }
  }
}

// Bad query (collection scan):
{
  "executionStats": {
    "nReturned": 1,
    "executionTimeMillis": 450,
    "totalDocsExamined": 100000,  // Scanned all docs!
    "executionStages": {
      "stage": "COLLSCAN"  // No index (bad!)
    }
  }
}`,
    },
    {
      type: 'heading',
      content: 'Index Optimization',
    },
    {
      type: 'example',
      title: 'Optimizing queries with indexes',
      language: 'javascript',
      code: `// Identify slow queries without indexes
db.users.find({ email: "alice@example.com" }).explain("executionStats")
// Shows COLLSCAN = slow!

// Create index
db.users.createIndex({ email: 1 })

// Verify index is used
db.users.find({ email: "alice@example.com" }).explain("executionStats")
// Shows IXSCAN = fast!

// Compound index for multiple fields
db.users.createIndex({ lastName: 1, firstName: 1, age: 1 })

// This index supports queries on:
// 1. lastName only
// 2. lastName + firstName
// 3. lastName + firstName + age
// But NOT: firstName only, age only

// Index for sorting
db.orders.createIndex({ orderDate: -1 })
db.orders.find().sort({ orderDate: -1 }).limit(10)  // Uses index

// Covering query (returns data from index only, no doc fetch)
db.users.createIndex({ email: 1, name: 1 })
db.users.find({ email: "alice@example.com" }, { email: 1, name: 1, _id: 0 })
// explain shows: "stage": "IXSCAN", no FETCH stage`,
    },
    {
      type: 'example',
      title: 'Finding unused indexes',
      language: 'javascript',
      code: `// Get index usage statistics
db.users.aggregate([{ $indexStats: {} }])

// Output shows:
// {
//   name: "email_1",
//   accesses: {
//     ops: 1523,  // times used
//     since: ISODate("2024-01-01T00:00:00Z")
//   }
// }

// Drop unused indexes to improve write performance
db.users.dropIndex("old_unused_index")

// Find indexes with low usage
db.users.aggregate([
  { $indexStats: {} },
  { $match: { "accesses.ops": { $lt: 100 } } }
])`,
    },
    {
      type: 'heading',
      content: 'Query Optimization Techniques',
    },
    {
      type: 'example',
      title: 'Optimizing common query patterns',
      language: 'javascript',
      code: `// 1. Use projection to limit returned fields
// Bad: returns all fields
db.users.find({ age: { $gt: 25 } })

// Good: returns only needed fields
db.users.find({ age: { $gt: 25 } }, { name: 1, email: 1 })

// 2. Use limit() to restrict results
// Bad: returns all matching documents
db.products.find({ category: "Electronics" })

// Good: limits to 20 documents
db.products.find({ category: "Electronics" }).limit(20)

// 3. Use $exists sparingly (can't use index efficiently)
// Slower:
db.users.find({ phone: { $exists: true } })

// Faster (if indexed):
db.users.find({ phone: { $ne: null } })

// 4. Avoid negation queries when possible
// Slower:
db.products.find({ status: { $ne: "discontinued" } })

// Faster (if you know valid statuses):
db.products.find({ status: { $in: ["active", "pending"] } })

// 5. Use $hint to force index usage
db.users.find({ age: 25, city: "Boston" }).hint({ age: 1 })`,
    },
    {
      type: 'heading',
      content: 'Database Profiling',
    },
    {
      type: 'example',
      title: 'Enabling and using profiler',
      language: 'javascript',
      code: `// Enable profiler (level 0 = off, 1 = slow ops, 2 = all ops)
db.setProfilingLevel(1, { slowms: 100 })  // Log queries > 100ms

// Check profiler status
db.getProfilingStatus()

// View profiled queries
db.system.profile.find().sort({ ts: -1 }).limit(10)

// Find slow queries
db.system.profile.find({
  millis: { $gt: 100 }
}).sort({ millis: -1 })

// Analyze slow query patterns
db.system.profile.aggregate([
  { $match: { millis: { $gt: 100 } } },
  { $group: {
    _id: "$command.find",
    avgTime: { $avg: "$millis" },
    count: { $sum: 1 }
  }},
  { $sort: { avgTime: -1 } }
])

// Disable profiler
db.setProfilingLevel(0)`,
    },
    {
      type: 'heading',
      content: 'Schema Design for Performance',
    },
    {
      type: 'example',
      title: 'Performance-oriented schema patterns',
      language: 'javascript',
      code: `// Pattern 1: Embed frequently accessed data
// Instead of:
// users: { _id, name }
// profiles: { userId, bio, avatar }

// Better (one query):
{
  _id: 1,
  name: "Alice",
  profile: {
    bio: "Developer",
    avatar: "url"
  }
}

// Pattern 2: Denormalize for read-heavy workloads
// Instead of JOIN every time:
{
  _id: 1,
  productId: "prod123",
  quantity: 2,
  // Denormalize product info
  productName: "Laptop",
  productPrice: 1299
}

// Pattern 3: Use arrays for bounded one-to-many
// Good (bounded):
{
  _id: 1,
  user: "alice",
  recentViews: ["prod1", "prod2", "prod3"]  // last 10 only
}

// Bad (unbounded):
{
  _id: 1,
  user: "alice",
  allOrders: [...]  // could grow infinitely!
}

// Pattern 4: Bucket pattern for time-series data
// Instead of one doc per reading:
{
  sensorId: "sensor1",
  date: "2024-03-20",
  readings: [
    { time: "10:00", temp: 72 },
    { time: "10:01", temp: 73 },
    // ... 1440 readings per day
  ]
}`,
    },
    {
      type: 'table',
      title: 'Performance Optimization Checklist',
      headers: ['Area', 'Optimization', 'Impact'],
      rows: [
        ['Indexes', 'Create indexes on query fields', 'High'],
        ['Indexes', 'Drop unused indexes', 'Medium'],
        ['Queries', 'Use projection to limit fields', 'Medium'],
        ['Queries', 'Add limits to large result sets', 'High'],
        ['Queries', 'Avoid $exists, use $ne null', 'Low'],
        ['Schema', 'Embed frequently accessed data', 'High'],
        ['Schema', 'Denormalize for read-heavy apps', 'High'],
        ['Aggregation', 'Use $match early in pipeline', 'High'],
        ['Connection', 'Use connection pooling', 'Medium'],
        ['Hardware', 'Add more RAM for working set', 'High'],
      ],
    },
    {
      type: 'tip',
      title: 'Working Set',
      content: 'MongoDB performs best when frequently accessed data (working set) fits in RAM. Monitor memory usage and add RAM if your working set exceeds available memory. Use indexes to reduce working set size.',
    },
    {
      type: 'tryit',
      title: 'Query Performance Analyzer',
      css: `body{font-family:system-ui,sans-serif;padding:16px;margin:0;background:linear-gradient(135deg,#001E2B 0%,#003d4d 100%);}
.container{max-width:850px;margin:0 auto;}
.header{text-align:center;color:#00ED64;font-size:26px;font-weight:700;margin-bottom:8px;}
.subtitle{text-align:center;color:#fff;font-size:13px;margin-bottom:14px;}
.card{background:#fff;border-radius:10px;padding:18px;margin-bottom:12px;box-shadow:0 4px 20px rgba(0,237,100,0.2);}
.label{font-weight:600;color:#001E2B;font-size:14px;margin-bottom:8px;}
.btn-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;}
.btn{background:#00ED64;color:#001E2B;border:none;padding:12px;border-radius:8px;cursor:pointer;font-weight:700;font-size:13px;}
.btn:hover{background:#00ff70;transform:translateY(-1px);}
.btn.indexed{background:#1e293b;color:#fff;}
.result{background:#f8f9fa;border:2px solid #00ED64;border-radius:8px;padding:14px;font-family:monospace;font-size:12px;line-height:1.7;}
.stat{display:flex;justify-content:space-between;padding:8px;background:#fff;margin:4px 0;border-radius:4px;}
.stat-label{font-weight:600;color:#001E2B;}
.fast{color:#00ED64;font-weight:700;}
.slow{color:#ef4444;font-weight:700;}
.recommendation{background:#dbeafe;border:2px solid #3b82f6;padding:10px;border-radius:6px;margin-top:10px;color:#1e40af;font-size:13px;}`,
      js: `var hasIndex = false;
var collectionSize = 500000;

function toggleIndex() {
  hasIndex = !hasIndex;
  runQuery();
}

function runQuery() {
  var result;
  if (hasIndex) {
    result = {
      stage: "IXSCAN",
      time: 3,
      docsExamined: 1,
      keysExamined: 1,
      returned: 1
    };
  } else {
    result = {
      stage: "COLLSCAN",
      time: 892,
      docsExamined: collectionSize,
      keysExamined: 0,
      returned: 1
    };
  }
  
  var efficiency = ((result.returned / result.docsExamined) * 100).toFixed(1);
  var recommendation = hasIndex ?
    "Excellent! Query uses index. Efficiency: " + efficiency + "%" :
    "Warning: Collection scan detected. Create index: db.users.createIndex({ email: 1 })";
  
  var html = '<div class="result">' +
    '<div style="font-weight:700;margin-bottom:8px;color:#001E2B;">Query: db.users.find({ email: "alice@example.com" })</div>' +
    '<div class="stat"><span class="stat-label">Execution Stage:</span><span class="' + 
    (hasIndex ? 'fast' : 'slow') + '">' + result.stage + '</span></div>' +
    '<div class="stat"><span class="stat-label">Execution Time:</span><span class="' +
    (hasIndex ? 'fast' : 'slow') + '">' + result.time + ' ms</span></div>' +
    '<div class="stat"><span class="stat-label">Documents Examined:</span><span>' + 
    result.docsExamined.toLocaleString() + '</span></div>' +
    '<div class="stat"><span class="stat-label">Documents Returned:</span><span>' + 
    result.returned + '</span></div>' +
    '<div class="stat"><span class="stat-label">Efficiency:</span><span>' + efficiency + '%</span></div>' +
    '<div class="recommendation">' + recommendation + '</div>' +
    '</div>';
  
  document.getElementById('results').innerHTML = html;
  document.getElementById('indexBtn').innerHTML = hasIndex ? 'Remove Index' : 'Create Index';
  document.getElementById('indexBtn').className = hasIndex ? 'btn indexed' : 'btn';
}

document.getElementById('output').innerHTML =
  '<div class="container">' +
  '<div class="header">Query Performance Analyzer</div>' +
  '<div class="subtitle">Analyze query execution with and without indexes</div>' +
  '<div class="card">' +
  '<div class="label">Collection: users (' + collectionSize.toLocaleString() + ' documents)</div>' +
  '<div class="btn-grid">' +
  '<button id="indexBtn" class="btn" onclick="toggleIndex()">Create Index</button>' +
  '<button class="btn" onclick="runQuery()">Run Query</button>' +
  '</div>' +
  '<div id="results" style="color:#666;text-align:center;padding:30px;">Click "Run Query" to analyze performance</div>' +
  '</div>' +
  '</div>';

window.toggleIndex = toggleIndex;
window.runQuery = runQuery;`,
    },
  ],
  exercises: [
    {
      id: 'mongodb-perf-1',
      question: 'What does COLLSCAN in an explain plan indicate?',
      type: 'multiple-choice',
      options: [
        'The query is using an index efficiently',
        'The query is scanning the entire collection without an index',
        'The collection is corrupted',
        'The query is collecting statistics',
      ],
      correct: 1,
      explanation: 'COLLSCAN (collection scan) means MongoDB is examining every document in the collection because no suitable index exists. This is slow for large collections. Create an index to change to IXSCAN (index scan).',
    },
    {
      id: 'mongodb-perf-2',
      question: 'Why should you drop unused indexes?',
      type: 'multiple-choice',
      options: [
        'To save disk space',
        'Indexes slow down write operations and use memory',
        'Unused indexes cause query errors',
        'MongoDB only allows 10 indexes per collection',
      ],
      correct: 1,
      explanation: 'Every index must be updated on writes (insert, update, delete), slowing write performance. Indexes also consume RAM. Drop unused indexes to improve write speed and reduce memory usage.',
    },
  ],
  quiz: [
    {
      id: 'mongodb-perf-q1',
      question: 'What is a "working set" in MongoDB?',
      options: [
        'The set of queries currently running',
        'The frequently accessed data that should fit in RAM',
        'The set of indexes on a collection',
        'Documents currently being written',
      ],
      correct: 1,
      explanation: 'The working set is the portion of data frequently accessed by your application. MongoDB performs best when the working set fits entirely in RAM. If it exceeds RAM, the system will page to disk, causing slowdowns.',
    },
  ],
};
