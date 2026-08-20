import type { MongodbLesson } from '../mongodb-curriculum';

export const mongodbReferencesLesson: MongodbLesson = {
  id: 'mongodb-references',
  title: 'Quick Reference & Best Practices',
  slug: 'references',
  chapter: 'advanced',
  order: 12,
  difficulty: 'beginner',
  readingTime: 8,
  description: 'Command cheat sheet, best practices, common patterns, and helpful resources for MongoDB development.',
  sections: [
    {
      type: 'heading',
      content: 'MongoDB Shell Commands',
    },
    {
      type: 'example',
      title: 'Essential shell commands',
      content: 'A quick-access reference of the most commonly used MongoDB shell commands covering databases, collections, documents, indexes, and utilities.',
      language: 'javascript',
      code: `// Database operations
show dbs                          // List all databases
use myDatabase                    // Switch to database
db                                // Show current database
db.dropDatabase()                 // Delete current database

// Collection operations
show collections                  // List collections
db.createCollection("users")     // Create collection
db.users.drop()                   // Delete collection
db.users.stats()                  // Collection statistics

// Document operations
db.users.insertOne({...})         // Insert one document
db.users.insertMany([{...}])      // Insert multiple
db.users.find()                   // Find all
db.users.findOne({email: "..."}) // Find one
db.users.updateOne({...}, {...}) // Update one
db.users.updateMany({...}, {...})// Update many
db.users.deleteOne({...})         // Delete one
db.users.deleteMany({...})        // Delete many
db.users.countDocuments()         // Count documents

// Index operations
db.users.createIndex({email: 1})  // Create index
db.users.getIndexes()             // List indexes
db.users.dropIndex("email_1")     // Drop index

// Utility
db.users.find().pretty()          // Formatted output
db.users.find().explain()         // Query plan
exit                              // Exit shell`,
    },
    {
      type: 'heading',
      content: 'Query Operators Reference',
    },
    {
      type: 'table',
      title: 'Comparison Operators',
      headers: ['Operator', 'Description', 'Example'],
      rows: [
        ['$eq', 'Equal to', '{ age: { $eq: 25 } }'],
        ['$ne', 'Not equal', '{ status: { $ne: "inactive" } }'],
        ['$gt', 'Greater than', '{ price: { $gt: 100 } }'],
        ['$gte', 'Greater than or equal', '{ age: { $gte: 18 } }'],
        ['$lt', 'Less than', '{ score: { $lt: 50 } }'],
        ['$lte', 'Less than or equal', '{ rating: { $lte: 3 } }'],
        ['$in', 'In array', '{ color: { $in: ["red", "blue"] } }'],
        ['$nin', 'Not in array', '{ size: { $nin: ["XL", "XXL"] } }'],
      ],
    },
    {
      type: 'table',
      title: 'Logical Operators',
      headers: ['Operator', 'Description', 'Example'],
      rows: [
        ['$and', 'All conditions true', '{ $and: [{ a: 1 }, { b: 2 }] }'],
        ['$or', 'At least one true', '{ $or: [{ a: 1 }, { b: 2 }] }'],
        ['$nor', 'None true', '{ $nor: [{ a: 1 }, { b: 2 }] }'],
        ['$not', 'Negates condition', '{ age: { $not: { $gt: 30 } } }'],
      ],
    },
    {
      type: 'table',
      title: 'Update Operators',
      headers: ['Operator', 'Description', 'Example'],
      rows: [
        ['$set', 'Set field value', '{ $set: { age: 30 } }'],
        ['$unset', 'Remove field', '{ $unset: { phone: "" } }'],
        ['$inc', 'Increment number', '{ $inc: { views: 1 } }'],
        ['$push', 'Add to array', '{ $push: { tags: "new" } }'],
        ['$pull', 'Remove from array', '{ $pull: { tags: "old" } }'],
        ['$addToSet', 'Add unique to array', '{ $addToSet: { skills: "JS" } }'],
        ['$pop', 'Remove first/last', '{ $pop: { items: 1 } }'],
        ['$rename', 'Rename field', '{ $rename: { "old": "new" } }'],
      ],
    },
    {
      type: 'heading',
      content: 'Aggregation Pipeline Stages',
    },
    {
      type: 'table',
      title: 'Common Pipeline Stages',
      headers: ['Stage', 'Purpose', 'Example'],
      rows: [
        ['$match', 'Filter documents', '{ $match: { status: "active" } }'],
        ['$group', 'Group by key', '{ $group: { _id: "$city", count: { $sum: 1 } } }'],
        ['$project', 'Select fields', '{ $project: { name: 1, email: 1 } }'],
        ['$sort', 'Sort results', '{ $sort: { createdAt: -1 } }'],
        ['$limit', 'Limit results', '{ $limit: 10 }'],
        ['$skip', 'Skip documents', '{ $skip: 20 }'],
        ['$lookup', 'Join collections', '{ $lookup: { from: "users", ... } }'],
        ['$unwind', 'Deconstruct array', '{ $unwind: "$items" }'],
        ['$count', 'Count documents', '{ $count: "total" }'],
        ['$addFields', 'Add computed fields', '{ $addFields: { total: { $sum: ... } } }'],
      ],
    },
    {
      type: 'heading',
      content: 'Best Practices',
    },
    {
      type: 'list',
      items: [
        'Create indexes on frequently queried fields for better performance',
        'Use projection to return only needed fields and reduce network traffic',
        'Embed data for one-to-few relationships accessed together',
        'Reference data for one-to-many relationships or large arrays',
        'Keep documents under 16MB limit (use GridFS for larger files)',
        'Use updateMany sparingly - prefer targeted updateOne when possible',
        'Enable authentication and use role-based access control in production',
        'Use connection pooling to reuse database connections efficiently',
        'Monitor slow queries with profiler and create indexes accordingly',
        'Use replica sets for high availability and read scaling',
        'Regular backups - use mongodump or Atlas automated backups',
        'Keep MongoDB and drivers updated for security patches and features',
      ],
    },
    {
      type: 'heading',
      content: 'Common Patterns',
    },
    {
      type: 'example',
      title: 'Pagination pattern',
      content: 'Two pagination strategies: skip/limit is simple but slows on large offsets; range-based pagination using the last returned _id is faster and consistent for production use.',
      language: 'javascript',
      code: `// Skip and limit (simple but slow for large offsets)
const page = 2;
const pageSize = 20;
db.products.find()
  .skip((page - 1) * pageSize)
  .limit(pageSize)

// Range-based (faster for large datasets)
const lastId = "...";  // last _id from previous page
db.products.find({ _id: { $gt: ObjectId(lastId) } })
  .limit(pageSize)`,
    },
    {
      type: 'example',
      title: 'Audit trail pattern',
      content: 'Track the full change history of a document by pushing each change into a history array alongside the current value. A single update atomically records both the new state and the audit entry.',
      language: 'javascript',
      code: `// Store change history in array
{
  _id: 1,
  currentValue: "active",
  history: [
    { value: "pending", changedAt: "2024-01-01", changedBy: "user1" },
    { value: "active", changedAt: "2024-01-05", changedBy: "user2" }
  ]
}

// Update with history tracking
db.documents.updateOne(
  { _id: 1 },
  {
    $set: { currentValue: "inactive" },
    $push: {
      history: {
        value: "inactive",
        changedAt: new Date(),
        changedBy: "user3"
      }
    }
  }
)`,
    },
    {
      type: 'example',
      title: 'Soft delete pattern',
      content: 'Instead of permanently removing documents, mark them with an isDeleted flag and a deletedAt timestamp. Add a partial index to exclude deleted documents from query results automatically.',
      language: 'javascript',
      code: `// Mark as deleted instead of removing
db.users.updateOne(
  { _id: userId },
  { 
    $set: { 
      isDeleted: true,
      deletedAt: new Date()
    }
  }
)

// Exclude deleted documents in queries
db.users.find({ isDeleted: { $ne: true } })

// Use partial index to exclude deleted from index
db.users.createIndex(
  { email: 1 },
  { partialFilterExpression: { isDeleted: { $ne: true } } }
)`,
    },
    {
      type: 'heading',
      content: 'Connection Strings',
    },
    {
      type: 'example',
      title: 'MongoDB connection string formats',
      content: 'Connection strings follow the mongodb:// or mongodb+srv:// format. Use the +srv variant for Atlas, include credentials for authenticated servers, and append options like retryWrites and w=majority for production reliability.',
      language: 'text',
      code: `// Local MongoDB
mongodb://localhost:27017/myDatabase

// With authentication
mongodb://username:password@localhost:27017/myDatabase

// Atlas (cloud)
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/myDatabase

// Replica set
mongodb://host1:27017,host2:27017,host3:27017/myDatabase?replicaSet=rs0

// With options
mongodb://localhost:27017/myDatabase?retryWrites=true&w=majority

// Common options:
// - retryWrites=true: automatically retry writes
// - w=majority: wait for majority acknowledgment
// - readPreference=secondaryPreferred: prefer secondary reads
// - maxPoolSize=10: connection pool size`,
    },
    {
      type: 'heading',
      content: 'Helpful Resources',
    },
    {
      type: 'list',
      items: [
        'Official Documentation: docs.mongodb.com - comprehensive guides and API reference',
        'MongoDB University: university.mongodb.com - free courses and certifications',
        'MongoDB Community Forums: community.mongodb.com - get help from experts',
        'MongoDB Atlas: cloud.mongodb.com - free cloud hosting (512MB)',
        'Mongoose Documentation: mongoosejs.com - ODM for Node.js',
        'MongoDB Compass: mongodb.com/products/compass - free GUI tool',
        'Stack Overflow: stackoverflow.com/questions/tagged/mongodb',
      ],
    },
    {
      type: 'tryit',
      title: 'MongoDB Cheat Sheet',
      css: `body{font-family:system-ui,sans-serif;padding:16px;margin:0;background:linear-gradient(135deg,#001E2B 0%,#003d4d 100%);}
.container{max-width:900px;margin:0 auto;}
.header{text-align:center;color:#00ED64;font-size:26px;font-weight:700;margin-bottom:8px;}
.subtitle{text-align:center;color:#fff;font-size:13px;margin-bottom:14px;}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:12px;}
.card{background:#fff;border-radius:10px;padding:16px;box-shadow:0 4px 20px rgba(0,237,100,0.2);}
.card-title{font-weight:700;color:#00ED64;font-size:16px;margin-bottom:10px;border-bottom:2px solid #00ED64;padding-bottom:6px;}
.command{background:#f8f9fa;border-left:3px solid #00ED64;padding:8px;margin:6px 0;border-radius:4px;font-family:monospace;font-size:12px;color:#001E2B;}
.desc{font-size:11px;color:#64748b;margin-top:2px;}`,
      js: `var sections = {
  crud: [
    { cmd: 'db.users.insertOne({...})', desc: 'Insert one document' },
    { cmd: 'db.users.find({...})', desc: 'Find documents' },
    { cmd: 'db.users.updateOne({...})', desc: 'Update one document' },
    { cmd: 'db.users.deleteOne({...})', desc: 'Delete one document' }
  ],
  query: [
    { cmd: '{ age: { $gt: 25 } }', desc: 'Greater than' },
    { cmd: '{ $or: [{...}, {...}] }', desc: 'Logical OR' },
    { cmd: '{ tags: { $in: [...] } }', desc: 'Value in array' },
    { cmd: '{ name: { $regex: /^A/i } }', desc: 'Regex match' }
  ],
  index: [
    { cmd: 'db.users.createIndex({email: 1})', desc: 'Create index' },
    { cmd: 'db.users.getIndexes()', desc: 'List indexes' },
    { cmd: 'db.users.dropIndex("email_1")', desc: 'Drop index' },
    { cmd: 'find().explain("executionStats")', desc: 'Query plan' }
  ],
  agg: [
    { cmd: '{ $match: { status: "active" } }', desc: 'Filter stage' },
    { cmd: '{ $group: { _id: "$city" } }', desc: 'Group stage' },
    { cmd: '{ $sort: { date: -1 } }', desc: 'Sort stage' },
    { cmd: '{ $limit: 10 }', desc: 'Limit results' }
  ]
};

var html = '<div class="container">' +
  '<div class="header">MongoDB Quick Reference</div>' +
  '<div class="subtitle">Essential commands and patterns at a glance</div>' +
  '<div class="grid">';

html += '<div class="card"><div class="card-title">CRUD Operations</div>';
sections.crud.forEach(function(item) {
  html += '<div class="command">' + item.cmd + '<div class="desc">' + item.desc + '</div></div>';
});
html += '</div>';

html += '<div class="card"><div class="card-title">Query Operators</div>';
sections.query.forEach(function(item) {
  html += '<div class="command">' + item.cmd + '<div class="desc">' + item.desc + '</div></div>';
});
html += '</div>';

html += '<div class="card"><div class="card-title">Indexes</div>';
sections.index.forEach(function(item) {
  html += '<div class="command">' + item.cmd + '<div class="desc">' + item.desc + '</div></div>';
});
html += '</div>';

html += '<div class="card"><div class="card-title">Aggregation</div>';
sections.agg.forEach(function(item) {
  html += '<div class="command">' + item.cmd + '<div class="desc">' + item.desc + '</div></div>';
});
html += '</div>';

html += '</div></div>';
document.getElementById('output').innerHTML = html;`,
    },
  ],
  exercises: [
    {
      id: 'mongodb-ref-1',
      question: 'Which command shows all collections in the current database?',
      type: 'multiple-choice',
      options: [
        'db.listCollections()',
        'show collections',
        'db.collections()',
        'list collections',
      ],
      correct: 1,
      explanation: 'The "show collections" command lists all collections in the current database. You can also use db.getCollectionNames() for programmatic access.',
    },
    {
      id: 'mongodb-ref-2',
      question: 'What is the maximum document size in MongoDB?',
      type: 'multiple-choice',
      options: [
        '1MB',
        '4MB',
        '16MB',
        'Unlimited',
      ],
      correct: 2,
      explanation: 'MongoDB documents have a maximum size of 16MB (16,777,216 bytes). For larger files, use GridFS which splits files into chunks.',
    },
  ],
  quiz: [
    {
      id: 'mongodb-ref-q1',
      question: 'Which pattern is best for pagination with large datasets?',
      options: [
        'skip() and limit()',
        'Range-based queries with _id > lastId',
        'Load all data and filter in application',
        'Use $slice operator',
      ],
      correct: 1,
      explanation: 'Range-based pagination using _id > lastId is more efficient for large datasets because skip() becomes slower as the offset increases. It still needs to traverse skipped documents.',
    },
  ],
};
