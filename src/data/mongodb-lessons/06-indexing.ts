import type { MongodbLesson } from '../mongodb-curriculum';

export const mongodbIndexingLesson: MongodbLesson = {
  id: 'mongodb-indexing',
  title: 'Indexing for Performance',
  slug: 'indexing',
  chapter: 'queries',
  order: 6,
  difficulty: 'intermediate',
  readingTime: 12,
  description: 'Creating and managing indexes - single field, compound, text, and geospatial indexes for query optimization.',
  sections: [
    {
      type: 'text',
      content: 'Indexes are special data structures that improve query performance by allowing MongoDB to quickly locate documents without scanning the entire collection. Without indexes, MongoDB performs collection scans - reading every document. With indexes, queries can find documents in milliseconds instead of seconds.',
    },
    {
      type: 'analogy',
      title: 'Indexes are like book indexes',
      content: 'Finding a topic in a book without an index means reading every page. With an index, you look up the topic alphabetically and jump directly to the page. MongoDB indexes work the same way - they map field values to document locations for fast lookups.',
    },
    {
      type: 'heading',
      content: 'Single Field Indexes',
    },
    {
      type: 'example',
      title: 'Creating single field indexes',
      language: 'javascript',
      code: `// Create ascending index on email field
db.users.createIndex({ email: 1 })

// Create descending index on createdAt
db.users.createIndex({ createdAt: -1 })

// 1 = ascending, -1 = descending
// For single-field indexes, direction rarely matters

// Create unique index (prevents duplicates)
db.users.createIndex({ email: 1 }, { unique: true })

// Create sparse index (only indexes documents that have the field)
db.users.createIndex({ phone: 1 }, { sparse: true })

// Create index in background (does not block other operations)
db.users.createIndex({ username: 1 }, { background: true })

// View all indexes on collection
db.users.getIndexes()

// Drop an index
db.users.dropIndex("email_1")

// Drop all indexes except _id
db.users.dropIndexes()`,
    },
    {
      type: 'example',
      title: 'Checking if query uses index with explain()',
      language: 'javascript',
      code: `// Without index - collection scan
db.users.find({ email: "alice@example.com" }).explain("executionStats")

// Output shows:
// "stage": "COLLSCAN",  // collection scan - slow!
// "nReturned": 1,
// "totalDocsExamined": 10000  // checked all documents

// Create index
db.users.createIndex({ email: 1 })

// With index - index scan
db.users.find({ email: "alice@example.com" }).explain("executionStats")

// Output shows:
// "stage": "IXSCAN",  // index scan - fast!
// "nReturned": 1,
// "totalDocsExamined": 1,  // only checked 1 document
// "totalKeysExamined": 1`,
    },
    {
      type: 'heading',
      content: 'Compound Indexes',
    },
    {
      type: 'example',
      title: 'Multi-field compound indexes',
      language: 'javascript',
      code: `// Compound index on multiple fields
db.users.createIndex({ lastName: 1, firstName: 1 })

// This index supports queries on:
// 1. lastName alone: db.users.find({ lastName: "Smith" })
// 2. lastName + firstName: db.users.find({ lastName: "Smith", firstName: "John" })
// But NOT on firstName alone!

// Order matters in compound indexes
db.products.createIndex({ category: 1, price: -1 })

// Good: uses index
db.products.find({ category: "Electronics" }).sort({ price: -1 })

// Good: uses index
db.products.find({ category: "Electronics", price: { $gte: 100 } })

// Bad: does not use index (price is second in index)
db.products.find({ price: { $gte: 100 } })

// ESR rule for compound indexes:
// 1. Equality filters first
// 2. Sort fields second
// 3. Range filters last
db.orders.createIndex({ status: 1, orderDate: -1, total: 1 })
// Equality: status = "shipped"
// Sort: orderDate descending
// Range: total > 100`,
    },
    {
      type: 'heading',
      content: 'Text Indexes',
    },
    {
      type: 'example',
      title: 'Full-text search indexes',
      language: 'javascript',
      code: `// Create text index on single field
db.articles.createIndex({ content: "text" })

// Text index on multiple fields
db.articles.createIndex({
  title: "text",
  content: "text",
  tags: "text"
})

// Text search
db.articles.find({ $text: { $search: "mongodb tutorial" } })

// Text search with exact phrase
db.articles.find({ $text: { $search: "\\"NoSQL database\\"" } })

// Exclude words (use - prefix)
db.articles.find({ $text: { $search: "mongodb -sql" } })

// Text search with relevance score
db.articles.find(
  { $text: { $search: "mongodb" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } })

// Only one text index per collection!
// But it can cover multiple fields

// Set weights for fields (default weight is 1)
db.articles.createIndex(
  { title: "text", content: "text" },
  { weights: { title: 10, content: 1 } }
)`,
    },
    {
      type: 'heading',
      content: 'Index Types and Options',
    },
    {
      type: 'example',
      title: 'Special index types',
      content: 'Beyond basic B-tree indexes, MongoDB offers TTL indexes for auto-expiring documents, partial indexes to index only a subset of documents, wildcard indexes for dynamic schemas, and hashed indexes for sharding.',
      language: 'javascript',
      code: `// TTL index - auto-delete documents after time
db.sessions.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 }  // delete after 1 hour
)

// Partial index - index only documents matching filter
db.orders.createIndex(
  { customerId: 1 },
  { partialFilterExpression: { status: "active" } }
)

// Case-insensitive index (collation)
db.users.createIndex(
  { email: 1 },
  { collation: { locale: "en", strength: 2 } }
)

// Wildcard index - index all fields
db.products.createIndex({ "$**": 1 })

// Wildcard on specific path
db.products.createIndex({ "attributes.$**": 1 })

// Hashed index - for sharding
db.users.createIndex({ userId: "hashed" })`,
    },
    {
      type: 'example',
      title: 'Index management commands',
      content: 'Use these commands to list, drop, rebuild, and hide indexes. Hiding an index lets you test query performance without it before deciding whether to permanently drop it.',
      language: 'javascript',
      code: `// List all indexes
db.users.getIndexes()

// Get index statistics
db.users.stats().indexSizes

// Check if specific index exists
db.users.getIndexes().filter(idx => idx.name === "email_1")

// Drop specific index by name
db.users.dropIndex("email_1")

// Drop index by specification
db.users.dropIndex({ email: 1 })

// Drop all indexes except _id
db.users.dropIndexes()

// Rebuild indexes (after corruption or to reclaim space)
db.users.reIndex()

// Hide index (test before dropping)
db.users.hideIndex("email_1")

// Unhide index
db.users.unhideIndex("email_1")`,
    },
    {
      type: 'table',
      title: 'Index Types Summary',
      headers: ['Index Type', 'Use Case', 'Example'],
      rows: [
        ['Single Field', 'Query/sort on one field', '{ email: 1 }'],
        ['Compound', 'Query/sort on multiple fields', '{ lastName: 1, firstName: 1 }'],
        ['Text', 'Full-text search', '{ content: "text" }'],
        ['Unique', 'Prevent duplicate values', '{ email: 1 }, { unique: true }'],
        ['Sparse', 'Index only docs with field', '{ phone: 1 }, { sparse: true }'],
        ['TTL', 'Auto-expire documents', '{ createdAt: 1 }, { expireAfterSeconds: 3600 }'],
        ['Partial', 'Index subset of docs', '{ customerId: 1 }, { partialFilterExpression: ... }'],
        ['Geospatial', 'Location queries', '{ location: "2dsphere" }'],
      ],
    },
    {
      type: 'note',
      title: 'Index Best Practices',
      content: 'Create indexes on fields used in queries and sorts. Limit indexes per collection (each index slows writes). Use compound indexes for multiple fields. Drop unused indexes. Use explain() to verify index usage. Monitor index size and memory usage.',
    },
    {
      type: 'warning',
      title: 'Index Overhead',
      content: 'Every index speeds up reads but slows down writes (insert, update, delete). Each write must update all indexes. Too many indexes waste memory and slow write operations. Only create indexes you actually use.',
    },
    {
      type: 'tryit',
      title: 'Index Performance Visualizer',
      css: `body{font-family:system-ui,sans-serif;padding:18px;margin:0;background:linear-gradient(135deg,#001E2B 0%,#003d4d 100%);}
.container{max-width:850px;margin:0 auto;}
.header{text-align:center;color:#00ED64;font-size:28px;font-weight:700;margin-bottom:8px;}
.subtitle{text-align:center;color:#fff;font-size:14px;margin-bottom:16px;}
.card{background:#fff;border-radius:12px;padding:20px;margin-bottom:14px;box-shadow:0 4px 20px rgba(0,237,100,0.2);}
.label{font-weight:600;color:#001E2B;font-size:14px;margin-bottom:8px;}
.btn-row{display:flex;gap:10px;margin-bottom:14px;}
.btn{background:#00ED64;color:#001E2B;border:none;padding:12px 20px;border-radius:8px;cursor:pointer;font-weight:700;font-size:14px;flex:1;}
.btn:hover{background:#00ff70;transform:translateY(-1px);}
.btn.indexed{background:#1e293b;color:#fff;}
.btn.indexed:hover{background:#334155;}
.result{background:#f8f9fa;border:2px solid #00ED64;border-radius:8px;padding:14px;font-family:monospace;font-size:13px;line-height:1.6;}
.stat{display:flex;justify-content:space-between;padding:8px;background:#fff;margin:4px 0;border-radius:4px;border-left:4px solid #00ED64;}
.stat-label{font-weight:600;color:#001E2B;}
.stat-value{color:#334155;}
.fast{color:#00ED64;font-weight:700;}
.slow{color:#ef4444;font-weight:700;}`,
      js: `var hasIndex = false;
var collectionSize = 100000;

function runQuery() {
  var result;
  if (hasIndex) {
    result = {
      stage: "IXSCAN",
      executionTime: 2,
      docsExamined: 1,
      keysExamined: 1,
      nReturned: 1
    };
  } else {
    result = {
      stage: "COLLSCAN",
      executionTime: 450,
      docsExamined: collectionSize,
      keysExamined: 0,
      nReturned: 1
    };
  }
  showResult(result);
}

function toggleIndex() {
  hasIndex = !hasIndex;
  document.getElementById('indexBtn').innerHTML = hasIndex ? 'Drop Index' : 'Create Index';
  document.getElementById('indexBtn').className = hasIndex ? 'btn indexed' : 'btn';
  var msg = hasIndex ? 
    'Index created: { email: 1 }\\nQueries on email will now use index scan.' :
    'Index dropped. Queries will perform collection scan.';
  alert(msg);
}

function showResult(result) {
  var html = '<div class="result">' +
    '<div style="font-weight:700;margin-bottom:10px;color:#001E2B;">Query: db.users.find({ email: "alice@example.com" })</div>' +
    '<div class="stat"><span class="stat-label">Execution Stage:</span><span class="stat-value ' + 
    (result.stage === "IXSCAN" ? "fast" : "slow") + '">' + result.stage + 
    (result.stage === "IXSCAN" ? " (Index Scan)" : " (Collection Scan)") + '</span></div>' +
    '<div class="stat"><span class="stat-label">Execution Time:</span><span class="stat-value ' +
    (result.executionTime < 10 ? "fast" : "slow") + '">' + result.executionTime + ' ms</span></div>' +
    '<div class="stat"><span class="stat-label">Documents Examined:</span><span class="stat-value">' + 
    result.docsExamined.toLocaleString() + '</span></div>' +
    '<div class="stat"><span class="stat-label">Index Keys Examined:</span><span class="stat-value">' + 
    result.keysExamined + '</span></div>' +
    '<div class="stat"><span class="stat-label">Documents Returned:</span><span class="stat-value">' + 
    result.nReturned + '</span></div>' +
    '</div>';
  document.getElementById('results').innerHTML = html;
}

document.getElementById('output').innerHTML =
  '<div class="container">' +
  '<div class="header">Index Performance Visualizer</div>' +
  '<div class="subtitle">See how indexes dramatically improve query performance</div>' +
  '<div class="card">' +
  '<div class="label">Collection: users (' + collectionSize.toLocaleString() + ' documents)</div>' +
  '<div class="btn-row">' +
  '<button id="indexBtn" class="btn" onclick="toggleIndex()">Create Index</button>' +
  '<button class="btn" onclick="runQuery()">Run Query</button>' +
  '</div>' +
  '<div id="results" style="color:#666;text-align:center;padding:30px;">Click "Run Query" to see query performance</div>' +
  '</div>' +
  '</div>';

window.runQuery = runQuery;
window.toggleIndex = toggleIndex;`,
    },
  ],
  exercises: [
    {
      id: 'mongodb-indexing-1',
      question: 'What is the main purpose of indexes in MongoDB?',
      type: 'multiple-choice',
      options: [
        'To make the database smaller',
        'To speed up query performance by avoiding collection scans',
        'To automatically backup data',
        'To enforce data validation rules',
      ],
      correct: 1,
      explanation: 'Indexes are data structures that map field values to document locations, allowing MongoDB to quickly find documents without scanning the entire collection (COLLSCAN). This dramatically improves query performance.',
    },
    {
      id: 'mongodb-indexing-2',
      question: 'Given index { lastName: 1, firstName: 1 }, which query uses the index?',
      type: 'multiple-choice',
      options: [
        'db.users.find({ firstName: "John" })',
        'db.users.find({ age: 30 })',
        'db.users.find({ lastName: "Smith" })',
        'db.users.find({ firstName: "John", lastName: "Smith" })',
      ],
      correct: 2,
      explanation: 'Compound indexes can be used for queries on the prefix fields (left to right). The index { lastName: 1, firstName: 1 } supports queries on lastName alone, or lastName + firstName, but NOT firstName alone.',
    },
  ],
  quiz: [
    {
      id: 'mongodb-indexing-q1',
      question: 'How do indexes affect write operations?',
      options: [
        'Indexes have no effect on writes',
        'Indexes speed up writes',
        'Indexes slow down writes because they must be updated',
        'Indexes prevent write operations',
      ],
      correct: 2,
      explanation: 'Every insert, update, or delete must update all applicable indexes, which adds overhead and slows write operations. This is the tradeoff - faster reads, slower writes. Only create indexes you need.',
    },
  ],
};
