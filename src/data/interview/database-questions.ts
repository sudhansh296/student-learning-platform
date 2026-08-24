import { InterviewQuestion } from '@/lib/interview-types';

export const databaseInterviewQuestions: InterviewQuestion[] = [
  {
    id: 'db-sql-vs-nosql',
    category: 'database',
    type: 'theory',
    question: 'What is the difference between SQL and NoSQL databases?',
    difficulty: 'beginner',
    tags: ['sql', 'nosql', 'fundamentals'],
    shortAnswer: 'SQL databases use structured tables with schemas and support ACID transactions. NoSQL databases use flexible document, key-value, graph, or column formats and scale horizontally more easily.',
    detailedExplanation: 'SQL (relational) databases store data in tables with fixed schemas, use SQL language, and support complex joins and ACID transactions. Best for structured data with complex relationships. NoSQL databases offer flexible schemas and horizontal scaling. Types: Document (MongoDB - JSON-like), Key-Value (Redis - cache), Column-family (Cassandra - time series), Graph (Neo4j - relationships). Choose based on data structure, scale, and consistency requirements.',
    example: {
      code: `// SQL - structured, relational
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id INT PRIMARY KEY,
  user_id INT REFERENCES users(id), -- Foreign key
  total DECIMAL(10,2),
  status VARCHAR(20)
);

-- Join query
SELECT users.name, orders.total
FROM users
JOIN orders ON users.id = orders.user_id
WHERE orders.status = 'pending';

// MongoDB - document, flexible schema
// No need to define schema upfront
db.users.insertOne({
  name: "Alex",
  email: "alex@example.com",
  // Can add any fields
  preferences: { theme: "dark" },
  address: { city: "NYC", zip: "10001" }
});

// No joins - embed related data or reference
db.orders.find({ userId: ObjectId("..."), status: "pending" });

// When to use SQL:
// - Complex relationships (e-commerce, banking)
// - Need ACID transactions
// - Structured, consistent data

// When to use MongoDB:
// - Flexible/evolving schema
// - Document-like data (blog posts, user profiles)
// - Horizontal scaling
// - JSON/JavaScript ecosystem`,
      language: 'sql'
    },
    interviewAnswer: 'I choose based on the data model and requirements. SQL for anything with complex relationships and transactions - like a bank or e-commerce system where you need ACID guarantees. MongoDB for content management, user profiles, or anything with a document-like structure where the schema might evolve. Redis for caching and sessions. There\'s no universal winner - it depends on the use case.',
    commonMistakes: [
      'Using MongoDB for everything (including complex relational data)',
      'Using SQL when horizontal scaling is needed',
      'Not considering data consistency requirements',
      'Thinking NoSQL means no schema needed (schema design still matters)'
    ],
    realWorldUse: 'PostgreSQL for financial data, user management. MongoDB for content management, catalogs, user profiles. Redis for sessions, caching. Cassandra for high-write time series data (IoT, logs).',
    followUpQuestions: [
      'When would you use MongoDB over PostgreSQL?',
      'What is ACID and which databases guarantee it?',
      'What is database normalization?'
    ]
  },

  {
    id: 'db-indexes',
    category: 'database',
    type: 'theory',
    question: 'What are database indexes and how do they work?',
    difficulty: 'intermediate',
    tags: ['indexes', 'performance', 'query-optimization'],
    shortAnswer: 'Indexes are data structures (usually B-trees) that allow fast lookups without scanning all rows. They speed up reads but slow down writes. Create indexes on columns used in WHERE, JOIN, and ORDER BY clauses.',
    detailedExplanation: 'Without an index, a query scans every row (full table scan) - O(n). Indexes create a sorted B-tree structure, enabling O(log n) lookups. Trade-off: indexes speed up reads but each write must also update the index. Too many indexes slow down inserts/updates. Composite indexes cover multiple columns. Covering indexes include all needed columns, avoiding table lookups. Explain/analyze shows query plans.',
    example: {
      code: `-- SQL Indexes
-- Without index: full table scan on 1M rows
SELECT * FROM users WHERE email = 'alex@example.com';

-- Create index
CREATE INDEX idx_users_email ON users(email);

-- Now query uses index - O(log n) instead of O(n)

-- Composite index (column order matters!)
CREATE INDEX idx_name_age ON users(last_name, first_name, age);
-- Works for queries on: last_name, (last_name + first_name), all three
-- Does NOT help for: first_name alone, age alone

-- Check if query uses index
EXPLAIN SELECT * FROM users WHERE email = 'alex@example.com';
-- Shows: index scan vs sequential scan

-- Unique index (enforces uniqueness + creates index)
CREATE UNIQUE INDEX idx_email_unique ON users(email);

// MongoDB Indexes
// Without index
db.users.find({ email: "alex@example.com" })
// Scans entire collection

// Create index
db.users.createIndex({ email: 1 }); // 1 = ascending

// Unique index
db.users.createIndex({ email: 1 }, { unique: true });

// Compound index
db.orders.createIndex({ userId: 1, status: 1, createdAt: -1 });

// Check index usage
db.users.find({ email: "alex@example.com" }).explain("executionStats");
// Shows: IXSCAN (index scan) vs COLLSCAN (collection scan)

// When to create indexes
// âœ… Columns used in WHERE clauses
// âœ… Foreign key columns used in JOINs
// âœ… Columns used in ORDER BY
// âŒ Columns rarely queried
// âŒ Tables with few rows
// âŒ Columns updated very frequently`,
      language: 'sql'
    },
    interviewAnswer: 'Indexes are the most impactful database optimization. I create indexes on every column used in WHERE clauses, JOINs, and sort operations. The rule of thumb: index for reads, pay cost on writes. I use EXPLAIN to verify queries use indexes. In MongoDB, I always index any field I query on. Over-indexing hurts insert performance, so I analyze query patterns before adding indexes.',
    commonMistakes: [
      'Forgetting indexes on foreign key columns',
      'Creating too many indexes (hurts write performance)',
      'Not checking query plans with EXPLAIN',
      'Wrong column order in composite indexes'
    ],
    realWorldUse: 'Every production database needs proper indexing. Slow queries are usually missing indexes. Database monitoring tools show slow query logs to identify needed indexes.',
    followUpQuestions: [
      'What is the difference between clustered and non-clustered indexes?',
      'What is a covering index?',
      'When would an index hurt performance?'
    ]
  },

  {
    id: 'db-sql-joins',
    category: 'database',
    type: 'theory',
    question: 'Explain SQL JOINs - INNER, LEFT, RIGHT, and FULL OUTER JOIN',
    difficulty: 'intermediate',
    tags: ['sql', 'joins', 'queries'],
    shortAnswer: 'INNER JOIN returns matching rows from both tables. LEFT JOIN returns all left table rows + matching right rows (nulls for no match). RIGHT JOIN is opposite of LEFT. FULL OUTER JOIN returns all rows from both tables.',
    detailedExplanation: 'JOINs combine rows from multiple tables based on related columns. INNER JOIN returns only rows with matches in both tables. LEFT JOIN returns all rows from the left table; right table columns are NULL when no match. RIGHT JOIN returns all rows from the right table. FULL OUTER JOIN returns all rows from both tables, with NULLs where no match. CROSS JOIN returns cartesian product (every combination).',
    example: {
      code: `-- Sample data
-- users: id, name
-- orders: id, user_id, total

-- INNER JOIN - only users who have orders
SELECT users.name, orders.total
FROM users
INNER JOIN orders ON users.id = orders.user_id;
-- Returns: only users with matching orders

-- LEFT JOIN - all users, even without orders
SELECT users.name, orders.total
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
-- Returns: all users; orders.total is NULL for users without orders

-- Find users with NO orders
SELECT users.name
FROM users
LEFT JOIN orders ON users.id = orders.user_id
WHERE orders.id IS NULL;

-- RIGHT JOIN - all orders, even without a user (orphaned records)
SELECT users.name, orders.total
FROM users
RIGHT JOIN orders ON users.id = orders.user_id;

-- FULL OUTER JOIN - everyone
SELECT users.name, orders.total
FROM users
FULL OUTER JOIN orders ON users.id = orders.user_id;

-- Multiple JOINs
SELECT 
  users.name,
  orders.total,
  products.name AS product
FROM users
INNER JOIN orders ON users.id = orders.user_id
INNER JOIN order_items ON orders.id = order_items.order_id
INNER JOIN products ON order_items.product_id = products.id
WHERE orders.status = 'completed';

-- Self JOIN (employees and their managers)
SELECT 
  e.name AS employee,
  m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;`,
      language: 'sql'
    },
    interviewAnswer: 'I think of JOINs visually using Venn diagrams. INNER JOIN is the intersection - only rows that match in both tables. LEFT JOIN keeps everything from the left, adds nulls for unmatched right rows. This is the most common - I use it to get all users and their orders, including users with no orders. FULL OUTER JOIN is rare but useful for finding unmatched records on either side.',
    commonMistakes: [
      'Using INNER JOIN when LEFT JOIN is needed (losing data)',
      'Joining on wrong columns (not the foreign key)',
      'Not filtering null values after LEFT JOIN',
      'Cartesian products from missing JOIN condition'
    ],
    realWorldUse: 'JOINs are fundamental to relational databases. Every analytics query, reporting dashboard, and complex data retrieval uses JOINs. ORMs generate JOIN queries automatically.',
    followUpQuestions: [
      'What is a CROSS JOIN?',
      'How do you find records that exist in one table but not another?',
      'What is a self-join?'
    ]
  },

  {
    id: 'db-acid',
    category: 'database',
    type: 'theory',
    question: 'What are ACID properties in databases?',
    difficulty: 'intermediate',
    tags: ['acid', 'transactions', 'consistency'],
    shortAnswer: 'ACID: Atomicity (all or nothing), Consistency (valid state before and after), Isolation (concurrent transactions don\'t interfere), Durability (committed data persists). Guarantees reliable transactions.',
    detailedExplanation: 'ACID ensures database transactions are processed reliably. Atomicity: transaction either fully completes or fully rolls back - no partial updates. Consistency: transaction brings database from one valid state to another, respecting constraints. Isolation: concurrent transactions execute as if they were sequential - no dirty reads. Durability: committed transactions survive system failures - written to disk.',
    example: {
      code: `// Bank transfer example - needs ACID
// Without ACID: money could disappear if server crashes mid-transfer

// SQL Transaction
BEGIN TRANSACTION;

UPDATE accounts 
SET balance = balance - 100 
WHERE id = 1;

UPDATE accounts 
SET balance = balance + 100 
WHERE id = 2;

-- If any error occurs, rolls back both updates
COMMIT; -- Makes both changes permanent

-- Atomicity: if COMMIT fails, both updates roll back
-- Consistency: balance constraints (no negative) enforced
-- Isolation: other transactions can't see partial update
-- Durability: after COMMIT, survives server restart

// Node.js with PostgreSQL (pg)
const client = await pool.connect();

try {
  await client.query('BEGIN');
  
  await client.query(
    'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
    [100, fromAccountId]
  );
  
  const { rows } = await client.query(
    'SELECT balance FROM accounts WHERE id = $1',
    [fromAccountId]
  );
  
  if (rows[0].balance < 0) {
    throw new Error('Insufficient funds');
  }
  
  await client.query(
    'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
    [100, toAccountId]
  );
  
  await client.query('COMMIT');
} catch (err) {
  await client.query('ROLLBACK');
  throw err;
} finally {
  client.release();
}

// MongoDB Transactions (multi-document)
const session = await mongoose.startSession();
session.startTransaction();

try {
  await Account.updateOne(
    { _id: fromId }, 
    { $inc: { balance: -100 } },
    { session }
  );
  
  await Account.updateOne(
    { _id: toId },
    { $inc: { balance: 100 } },
    { session }
  );
  
  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
  throw err;
} finally {
  session.endSession();
}`,
      language: 'javascript'
    },
    interviewAnswer: 'ACID is why banks use databases. Atomicity means a bank transfer either completes both debits/credits or neither - money doesn\'t disappear. Consistency means constraints are always enforced. Isolation means concurrent transfers don\'t interfere. Durability means a committed transaction survives power outages. MongoDB added multi-document transactions in v4, but relational databases had ACID for decades.',
    commonMistakes: [
      'Not using transactions for multi-step operations',
      'Not handling transaction rollback on errors',
      'Thinking MongoDB doesn\'t support transactions (it does since v4)',
      'Holding transactions open too long (locks performance)'
    ],
    realWorldUse: 'Banking, payments, inventory management, any operation that must be all-or-nothing. Stripe, PayPal use ACID databases for payment processing.',
    followUpQuestions: [
      'What is a dirty read?',
      'What isolation levels does SQL support?',
      'Does MongoDB support ACID transactions?'
    ]
  },

  {
    id: 'db-normalization',
    category: 'database',
    type: 'theory',
    question: 'What is database normalization? Explain 1NF, 2NF, and 3NF.',
    difficulty: 'intermediate',
    tags: ['normalization', 'sql', 'schema-design'],
    shortAnswer: '1NF: atomic values, no repeating groups. 2NF: no partial dependencies on composite keys. 3NF: no transitive dependencies. Normalization reduces data redundancy and update anomalies.',
    detailedExplanation: 'Normalization organizes data to reduce redundancy. 1NF requires atomic (indivisible) column values and no repeating groups. 2NF (requires 1NF) requires every non-key column depends on the whole primary key, not just part of it. 3NF (requires 2NF) requires no transitive dependencies - non-key columns must not depend on other non-key columns. Denormalization is intentionally breaking rules for read performance.',
    example: {
      code: `-- NOT NORMALIZED (bad)
-- Single table with repeating groups and redundant data
orders (
  order_id, customer_name, customer_email, customer_city,
  item1_name, item1_qty, item1_price,
  item2_name, item2_qty, item2_price
);

-- Problems:
-- What if customer moves? Update in many rows
-- Max 2 items per order (hard limit)
-- Empty columns when fewer items

-- 1NF: Atomic values, no repeating groups
orders (order_id, customer_name, customer_email)
order_items (order_id, item_name, qty, price)
-- Each row has one item, no repeating groups

-- 2NF: No partial dependencies
-- If primary key is (order_id, item_id):
-- Bad: customer_name depends only on order_id (partial dependency!)
order_items (order_id, item_id, qty, price) -- Only order-item deps
orders (order_id, customer_name, customer_email) -- Only order deps

-- 3NF: No transitive dependencies
-- Bad: customer_city depends on customer_zip, not on customer_id
-- customer_id -> customer_zip -> customer_city (transitive!)
customers (customer_id, name, email, zip_code) -- Remove city
zip_codes (zip_code, city, state) -- City in separate table

-- Final normalized structure
customers (customer_id, name, email, zip_code)
zip_codes (zip_code, city, state)
products (product_id, name, price)
orders (order_id, customer_id, order_date, status)
order_items (order_id, product_id, quantity)

-- Benefits:
-- Update customer email in ONE place
-- No empty columns
-- Data integrity enforced by foreign keys`,
      language: 'sql'
    },
    interviewAnswer: 'Normalization prevents update anomalies. If customer email is stored in every order row, updating it requires updating thousands of rows - and we might miss some. Normalized design stores it once in customers table. 3NF is the practical target for most applications. I sometimes denormalize intentionally for read-heavy tables - like storing customer name on orders so reports don\'t need a join on every query.',
    commonMistakes: [
      'Over-normalizing (too many joins slow down reads)',
      'Under-normalizing (data duplication causes update bugs)',
      'Not understanding that denormalization is sometimes intentional',
      'Forgetting foreign key constraints after normalizing'
    ],
    realWorldUse: 'E-commerce databases, ERP systems, any application with complex relational data. ORMs make normalized data easy to work with. Data warehouses often denormalize for analytics performance.',
    followUpQuestions: [
      'What is denormalization and when should you use it?',
      'What is BCNF?',
      'How does normalization affect query performance?'
    ]
  },

  {
    id: 'db-mongodb-embed-reference',
    category: 'database',
    type: 'theory',
    question: 'When should you embed documents vs use references in MongoDB?',
    difficulty: 'intermediate',
    tags: ['mongodb', 'schema-design', 'embedding'],
    shortAnswer: 'Embed when data is always queried together, has one-to-few relationship, or changes with parent. Reference when data is queried independently, has one-to-many or many-to-many, or is large.',
    detailedExplanation: 'MongoDB schema design is about query patterns. Embedding puts related data in one document - no joins, better read performance. But documents have a 16MB limit and embedding large arrays is inefficient. Referencing splits data into collections and uses populate/lookup - more flexible but requires extra queries. Choose based on access patterns: do you always need both together?',
    example: {
      code: `// EMBEDDING - good for: blog posts + comments (few), user + address

// User with embedded address
{
  _id: ObjectId("..."),
  name: "Alex",
  email: "alex@example.com",
  address: {
    street: "123 Main St",
    city: "NYC",
    zip: "10001"
  }
}
// âœ… Always fetched together
// âœ… Atomic updates
// âœ… Single query

// Blog post with embedded comments (small number)
{
  _id: ObjectId("..."),
  title: "My Post",
  content: "...",
  comments: [
    { author: "Sam", text: "Great post!" },
    { author: "Jane", text: "Thanks!" }
  ]
}
// âœ… Good for few, bounded comments
// âŒ Bad for thousands of comments

// REFERENCING - good for: users + orders (many), movies + actors (many-to-many)

// Orders collection
{
  _id: ObjectId("order_id"),
  userId: ObjectId("user_id"),  // Reference to users
  items: [
    { productId: ObjectId("prod_1"), qty: 2 }  // Reference to products
  ],
  total: 99.99
}

// User collection
{
  _id: ObjectId("user_id"),
  name: "Alex",
  // Don't embed orders! Could be thousands
}

// Populate (Mongoose)
const orders = await Order.find({ userId: req.user.id })
  .populate('userId', 'name email')     // Join users
  .populate('items.productId', 'name'); // Join products

// Aggregation $lookup (MongoDB's JOIN)
db.orders.aggregate([
  { $match: { userId: ObjectId("...") } },
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" }
]);

// Rules of thumb:
// 1:1 -> Always embed (address in user)
// 1:Few -> Embed (tags on article, few addresses)
// 1:Many -> Reference (orders for user)
// Many:Many -> Reference both ways (students-courses)`,
      language: 'javascript'
    },
    interviewAnswer: 'MongoDB schema design is fundamentally different from SQL. I design around access patterns - how will the data be queried? User addresses are always fetched with the user, so embed. Orders are fetched independently by user ID, so reference. The 16MB document size limit also constrains embedding. For blog comments that could number in thousands, I reference. For a user\'s 1-3 addresses, I embed.',
    commonMistakes: [
      'Embedding unbounded arrays (can hit 16MB limit)',
      'Referencing everything (too many queries, like SQL)',
      'Not considering access patterns when designing schema',
      'Duplicating data without a plan to keep it in sync'
    ],
    realWorldUse: 'E-commerce: embed product snapshots in orders (price at time of purchase), reference product catalog. Social media: embed like count, reference list of likers.',
    followUpQuestions: [
      'What is the MongoDB document size limit?',
      'How does $lookup work?',
      'What is the "extended reference" pattern?'
    ]
  },

  {
    id: 'db-aggregation-pipeline',
    category: 'database',
    type: 'theory',
    question: 'What is the MongoDB aggregation pipeline?',
    difficulty: 'intermediate',
    tags: ['mongodb', 'aggregation', 'queries'],
    shortAnswer: 'The aggregation pipeline is a series of stages that transform documents. Key stages: $match (filter), $group (aggregate), $project (reshape), $sort, $limit, $lookup (join). Each stage outputs to the next.',
    detailedExplanation: 'MongoDB aggregation pipeline processes documents through a sequence of stages, like a Unix pipe. Documents flow through stages and are transformed. $match filters (like WHERE), $group aggregates (like GROUP BY), $project reshapes output, $sort orders results, $limit restricts count, $lookup joins collections, $unwind flattens arrays, $facet creates multi-dimensional groupings.',
    example: {
      code: `// Sample: Analyze order data

// $match - filter documents (use early to reduce data)
// $group - aggregate
// $project - reshape output
// $sort - order results
// $lookup - join another collection

db.orders.aggregate([
  // Stage 1: Filter completed orders in 2024
  {
    $match: {
      status: "completed",
      createdAt: { $gte: new Date("2024-01-01") }
    }
  },
  
  // Stage 2: Group by userId, sum totals
  {
    $group: {
      _id: "$userId",
      totalSpent: { $sum: "$total" },
      orderCount: { $sum: 1 },
      avgOrder: { $avg: "$total" }
    }
  },
  
  // Stage 3: Join with users collection
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "user"
    }
  },
  
  // Stage 4: Unwind array from $lookup
  { $unwind: "$user" },
  
  // Stage 5: Reshape output
  {
    $project: {
      userName: "$user.name",
      email: "$user.email",
      totalSpent: 1,
      orderCount: 1,
      avgOrder: { $round: ["$avgOrder", 2] }
    }
  },
  
  // Stage 6: Sort by highest spenders
  { $sort: { totalSpent: -1 } },
  
  // Stage 7: Top 10
  { $limit: 10 }
]);

// Common aggregation patterns

// Count by status
db.orders.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } }
]);

// Daily revenue
db.orders.aggregate([
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      revenue: { $sum: "$total" }
    }
  },
  { $sort: { _id: 1 } }
]);

// $facet - multiple aggregations at once
db.products.aggregate([
  {
    $facet: {
      byCategory: [{ $group: { _id: "$category", count: { $sum: 1 } } }],
      priceRange: [{ $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" } } }],
      total: [{ $count: "count" }]
    }
  }
]);`,
      language: 'javascript'
    },
    interviewAnswer: 'The aggregation pipeline is MongoDB\'s most powerful feature for analytics. I use it for reports and data analysis. $match early to reduce data size - it\'s much faster than filtering at the end. $group with $sum and $avg calculates totals and averages. $lookup joins collections like SQL JOINs. I chain stages like building a data transformation pipeline.',
    commonMistakes: [
      '$match late in pipeline (should be first for performance)',
      'Not using indexes in $match stage',
      'Creating huge intermediate documents (memory issues)',
      'Not using $project to limit fields and reduce data size'
    ],
    realWorldUse: 'Sales reports, analytics dashboards, data exports, recommendation engines. Every MongoDB-based analytics feature uses aggregation. Much more powerful than map-reduce for most use cases.',
    followUpQuestions: [
      'What is the difference between aggregation and find()?',
      'How do you optimize an aggregation pipeline?',
      'What is $facet used for?'
    ]
  },

  {
    id: 'db-group-having-where',
    category: 'database',
    type: 'theory',
    question: 'What is the difference between WHERE, GROUP BY, and HAVING in SQL?',
    difficulty: 'beginner',
    tags: ['sql', 'queries', 'group-by'],
    shortAnswer: 'WHERE filters rows before grouping. GROUP BY groups rows by column values. HAVING filters groups after aggregation. WHERE can\'t use aggregate functions; HAVING can.',
    detailedExplanation: 'SQL query execution order: FROM â†’ WHERE â†’ GROUP BY â†’ HAVING â†’ SELECT â†’ ORDER BY. WHERE filters individual rows before any grouping. GROUP BY combines rows with the same value into groups, enabling aggregate functions (COUNT, SUM, AVG). HAVING filters the resulting groups, and can use aggregate functions unlike WHERE.',
    example: {
      code: `-- Sample: orders table
-- order_id, user_id, status, total, created_at

-- WHERE - filter before grouping
SELECT user_id, SUM(total) as revenue
FROM orders
WHERE status = 'completed'  -- Filter rows first
GROUP BY user_id;

-- GROUP BY - aggregate by column
SELECT status, COUNT(*) as count, AVG(total) as avg_total
FROM orders
GROUP BY status;

-- HAVING - filter after grouping (use aggregate functions here)
SELECT user_id, SUM(total) as revenue
FROM orders
WHERE status = 'completed'
GROUP BY user_id
HAVING SUM(total) > 1000;  -- Only high-value customers
-- Can't use: WHERE SUM(total) > 1000 (not yet aggregated)

-- Combined example: Top customers in 2024
SELECT 
  user_id,
  COUNT(*) as order_count,
  SUM(total) as total_revenue,
  AVG(total) as avg_order
FROM orders
WHERE 
  created_at >= '2024-01-01'  -- WHERE: filter by date
  AND status = 'completed'    -- WHERE: filter by status
GROUP BY user_id              -- GROUP: one row per customer
HAVING 
  COUNT(*) >= 5               -- HAVING: at least 5 orders
  AND SUM(total) > 500        -- HAVING: spent over $500
ORDER BY total_revenue DESC
LIMIT 10;

-- Error: can't use aggregate in WHERE
-- SELECT user_id FROM orders WHERE COUNT(*) > 5; -- âŒ Wrong
-- SELECT user_id FROM orders GROUP BY user_id HAVING COUNT(*) > 5; -- âœ… Correct`,
      language: 'sql'
    },
    interviewAnswer: 'Think of it as a pipeline: WHERE reduces rows before grouping, GROUP BY creates aggregate groups, HAVING filters those groups. The key insight is that WHERE runs before GROUP BY, so it can\'t use aggregate functions. HAVING runs after, so it can. I use HAVING to filter for "customers who spent more than $1000" because that requires the SUM to be calculated first.',
    commonMistakes: [
      'Using HAVING instead of WHERE (when aggregate isn\'t needed)',
      'Using WHERE with aggregate functions (syntax error)',
      'Forgetting columns not in GROUP BY must be aggregated',
      'SELECT column not in GROUP BY without aggregating it'
    ],
    realWorldUse: 'Reports, analytics, business intelligence queries. "Top 10 customers", "products sold more than 100 units", "daily revenue over $5000". Every data analysis query uses GROUP BY and HAVING.',
    followUpQuestions: [
      'What is the difference between HAVING and WHERE with performance?',
      'Can you GROUP BY multiple columns?',
      'What aggregate functions are available?'
    ]
  },

  {
    id: 'db-mongodb-crud',
    category: 'database',
    type: 'coding',
    question: 'Show MongoDB CRUD operations with practical examples',
    difficulty: 'beginner',
    tags: ['mongodb', 'crud', 'queries'],
    shortAnswer: 'insertOne/insertMany, find/findOne, updateOne/updateMany/$set/$push, deleteOne/deleteMany. Always use Mongoose in Node.js for schema validation and cleaner syntax.',
    detailedExplanation: 'MongoDB CRUD operations work on collections. Create: insertOne() or insertMany(). Read: find() returns cursor, findOne() returns single doc. Query operators: $eq, $gt, $lt, $in, $and, $or, $not, $regex. Update: $set (update fields), $push (add to array), $pull (remove from array), $inc (increment). Delete: deleteOne() or deleteMany(). Mongoose wraps these with models for type safety.',
    example: {
      code: `// Mongoose Model
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  age: Number,
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// CREATE
const user = await User.create({ name: 'Alex', email: 'alex@test.com', age: 25 });

// Bulk create
const users = await User.insertMany([
  { name: 'Sam', email: 'sam@test.com' },
  { name: 'Jane', email: 'jane@test.com' }
]);

// READ
const allUsers = await User.find(); // All users
const user = await User.findById(id); // By ID
const user = await User.findOne({ email: 'alex@test.com' });

// Query operators
const adults = await User.find({ age: { $gte: 18 } });
const filtered = await User.find({
  age: { $gte: 18, $lte: 65 },
  tags: { $in: ['developer', 'designer'] }
});

// Select specific fields
const names = await User.find({}, 'name email'); // Projection
const names = await User.find().select('name email -_id');

// Sort, limit, skip
const paginated = await User.find()
  .sort({ createdAt: -1 })
  .skip(0)
  .limit(10);

// UPDATE
await User.findByIdAndUpdate(id, 
  { $set: { name: 'Alex Smith' } },
  { new: true }  // Return updated doc
);

// Array operations
await User.findByIdAndUpdate(id, { $push: { tags: 'nodejs' } });
await User.findByIdAndUpdate(id, { $pull: { tags: 'php' } });
await User.findByIdAndUpdate(id, { $inc: { loginCount: 1 } });

// Update many
await User.updateMany(
  { age: { $lt: 18 } },
  { $set: { isMinor: true } }
);

// DELETE
await User.findByIdAndDelete(id);
await User.deleteMany({ age: { $lt: 18 } });

// Counting
const count = await User.countDocuments({ age: { $gte: 18 } });`,
      language: 'javascript'
    },
    interviewAnswer: 'I always use Mongoose in Node.js for MongoDB - it adds schemas, validation, and type safety. The key operators: $set for updating fields (without $set you replace the document), $push/$pull for arrays, $inc for counters. Always use findByIdAndUpdate with { new: true } to get the updated document back. Mongoose models make queries self-documenting.',
    commonMistakes: [
      'Updating without $set (replaces entire document)',
      'Not using { new: true } with findByIdAndUpdate',
      'Forgetting await on async operations',
      'Not validating input before database operations'
    ],
    realWorldUse: 'Every MongoDB application does CRUD. Express/Mongoose is the most common pattern for Node.js backends with MongoDB.',
    followUpQuestions: [
      'What is the difference between update() and findByIdAndUpdate()?',
      'How do you perform atomic operations in MongoDB?',
      'What does upsert do?'
    ],
    codingChallenge: {
      starterCode: `// Write a function to get all users older than 25
// sorted by name, with name and email only
async function getAdultUsers() {
  // Your code here
}`,
      solution: `async function getAdultUsers() {
  return await User.find(
    { age: { $gt: 25 } },
    'name email'
  ).sort({ name: 1 });
}`,
      hints: [
        'Use $gt operator for greater than',
        'Second argument to find() is projection',
        'sort({ name: 1 }) sorts ascending'
      ]
    }
  },

  {
    id: 'db-n-plus-one',
    category: 'database',
    type: 'theory',
    question: 'What is the N+1 query problem and how do you solve it?',
    difficulty: 'intermediate',
    tags: ['performance', 'orm', 'queries'],
    shortAnswer: 'N+1 happens when you fetch N records then make 1 additional query per record. Fetching 100 posts then querying each author = 101 queries. Solve with JOINs (SQL), eager loading ($lookup, populate), or DataLoader.',
    detailedExplanation: 'N+1 is a performance anti-pattern. You fetch a list (1 query), then for each item, make another query for related data (N queries). With 100 items, that\'s 101 database roundtrips. Each roundtrip has network latency. Solution: eager loading - fetch all needed data upfront with JOINs or batch queries. ORMs often cause N+1 if not configured for eager loading.',
    example: {
      code: `// N+1 Problem
// Fetch 100 posts, then each author - 101 queries!
const posts = await Post.find(); // 1 query

// âŒ N+1 - one query per post
for (const post of posts) {
  post.author = await User.findById(post.userId); // 100 queries
}

// Solution 1: SQL JOIN - 1 query
SELECT posts.*, users.name as author_name
FROM posts
JOIN users ON posts.user_id = users.id;

// Solution 2: Mongoose populate (automatic $lookup) - 2 queries
const posts = await Post.find().populate('userId', 'name email');
// Query 1: Get posts
// Query 2: Get all authors in one query: { _id: { $in: [id1, id2, ...] } }

// Solution 3: Batch query manually
const posts = await Post.find();
const authorIds = [...new Set(posts.map(p => p.userId))];
const authors = await User.find({ _id: { $in: authorIds } });
const authorMap = Object.fromEntries(authors.map(a => [a._id, a]));
const enriched = posts.map(p => ({ ...p.toObject(), author: authorMap[p.userId] }));

// Solution 4: MongoDB $lookup (single query)
const postsWithAuthors = await Post.aggregate([
  {
    $lookup: {
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'author'
    }
  },
  { $unwind: '$author' }
]);

// Solution 5: DataLoader (for GraphQL)
const DataLoader = require('dataloader');

const userLoader = new DataLoader(async (userIds) => {
  const users = await User.find({ _id: { $in: userIds } });
  return userIds.map(id => users.find(u => u._id.equals(id)));
});

// Now each resolver uses the loader - batched automatically
async function postResolver(post) {
  return {
    ...post,
    author: await userLoader.load(post.userId) // Batched!
  };
}`,
      language: 'javascript'
    },
    interviewAnswer: 'N+1 is one of the most common performance bugs I see. It\'s sneaky because it works fine in development with 10 records, then kills performance in production with 10,000. I always use populate in Mongoose or explicit JOINs in SQL to eager load related data. In code review, I watch for loops making database calls. DataLoader is the standard solution for GraphQL APIs.',
    commonMistakes: [
      'Making database queries inside loops',
      'Not checking actual SQL/MongoDB queries (use query logging)',
      'Over-fetching to avoid N+1 (select * with many joins)',
      'Using DataLoader outside of GraphQL contexts'
    ],
    realWorldUse: 'Everywhere ORMs are used without careful eager loading. GraphQL resolvers are especially prone to N+1. Query logging in development reveals N+1 before production.',
    followUpQuestions: [
      'How does DataLoader solve N+1 in GraphQL?',
      'What is eager loading vs lazy loading in ORMs?',
      'How do you detect N+1 queries?'
    ]
  },

  {
    id: 'db-sharding-replication',
    category: 'database',
    type: 'theory',
    question: 'What is the difference between database sharding and replication?',
    difficulty: 'advanced',
    tags: ['scaling', 'sharding', 'replication'],
    shortAnswer: 'Replication copies data to multiple servers for availability/read scaling. Sharding splits data across multiple servers for write scaling and storage. Replication = data redundancy; Sharding = data distribution.',
    detailedExplanation: 'Replication creates identical copies of data on multiple servers. Primary accepts writes; replicas serve reads and provide failover. Improves read performance and availability. Sharding (horizontal partitioning) splits data across multiple servers based on a shard key (like user ID range or geographic region). Each shard holds a subset of data. Enables horizontal write scaling and handling datasets larger than single server capacity.',
    example: {
      code: `// REPLICATION - same data, multiple servers
// Primary (writes) + Replicas (reads/failover)

// MongoDB Replica Set
// Primary:   { _id: 1, ..., all users }
// Replica 1: { _id: 1, ..., all users } (copy)
// Replica 2: { _id: 1, ..., all users } (copy)

// Benefits:
// - High availability (if primary fails, replica becomes primary)
// - Read scaling (route read queries to replicas)
// - No data loss (replication lag is minutes max)

// MongoDB connection with replica set read preference
const mongoose = await mongoose.connect(uri, {
  readPreference: 'secondaryPreferred' // Read from replicas
});

// SHARDING - different data on each server
// Shard key: userId
// Shard 1: users with id 1-1000000
// Shard 2: users with id 1000001-2000000
// Shard 3: users with id 2000001-3000000

// MongoDB Sharding
// Config servers: track which shard has what data
// mongos (router): routes queries to correct shard

// Choosing a shard key
// âœ… Good: high cardinality, evenly distributed
// âŒ Bad: monotonically increasing (creates hot shard)
// âŒ Bad: low cardinality (e.g., gender - only 2-3 shards max)

// Hash-based sharding
sh.shardCollection("mydb.users", { userId: "hashed" });

// Range-based sharding
sh.shardCollection("mydb.events", { timestamp: 1 });

// BOTH TOGETHER (common in production)
// 3 shards, each with 2 replicas = 6 servers total
// - Sharding provides write/storage scaling
// - Replication provides availability

// Summary
// Replication: "I need high availability and read scaling"
// Sharding: "I need to handle more writes or data > single server"`,
      language: 'javascript'
    },
    interviewAnswer: 'Replication is about availability - same data on multiple servers so reads are faster and the system survives server failures. Sharding is about scale - splitting data so no single server holds everything. Most production systems start with replication and add sharding when they outgrow a single server. Choosing the right shard key is critical - a bad key creates hot spots where one shard gets all the traffic.',
    commonMistakes: [
      'Sharding too early (adds complexity without benefit)',
      'Choosing monotonically increasing shard keys (hot spot)',
      'Not having replication on each shard',
      'Queries that require all shards (scatter-gather problem)'
    ],
    realWorldUse: 'MongoDB Atlas handles both automatically. Most SaaS companies start with replication, shard when database exceeds ~1TB or write throughput exceeds single server. Twitter, Facebook use massive sharding.',
    followUpQuestions: [
      'What is a "hot shard"?',
      'How do you choose a good shard key?',
      'What is the CAP theorem?'
    ]
  },

  {
    id: 'db-transactions-mongodb',
    category: 'database',
    type: 'theory',
    question: 'How do you handle transactions in MongoDB with Node.js?',
    difficulty: 'intermediate',
    tags: ['mongodb', 'transactions', 'mongoose'],
    shortAnswer: 'MongoDB supports multi-document ACID transactions since v4. Use session.startTransaction(), run operations with { session }, then commitTransaction() or abortTransaction() in a try/catch.',
    detailedExplanation: 'Before MongoDB 4.0, multi-document atomicity required embedding. Now transactions span multiple documents and collections. Start a session, begin transaction, pass session to all operations, commit or abort. Performance cost: transactions use locks, so keep them short. For single-document operations, MongoDB is always atomic without transactions.',
    example: {
      code: `// MongoDB Transaction with Mongoose
const mongoose = require('mongoose');

async function transferFunds(fromUserId, toUserId, amount) {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    // All operations use same session - atomic
    const fromUser = await User.findById(fromUserId).session(session);
    
    if (fromUser.balance < amount) {
      throw new Error('Insufficient funds');
    }
    
    // Debit
    await User.findByIdAndUpdate(
      fromUserId,
      { $inc: { balance: -amount } },
      { session }
    );
    
    // Credit
    await User.findByIdAndUpdate(
      toUserId,
      { $inc: { balance: amount } },
      { session }
    );
    
    // Create transaction record
    await Transaction.create([{
      from: fromUserId,
      to: toUserId,
      amount,
      type: 'transfer'
    }], { session });
    
    await session.commitTransaction();
    return { success: true };
    
  } catch (error) {
    await session.abortTransaction();
    throw error;
    
  } finally {
    session.endSession();
  }
}

// Using withTransaction helper (handles retries)
async function transferWithHelper(fromId, toId, amount) {
  const session = await mongoose.startSession();
  
  await session.withTransaction(async () => {
    await User.findByIdAndUpdate(fromId, { $inc: { balance: -amount } }, { session });
    await User.findByIdAndUpdate(toId, { $inc: { balance: amount } }, { session });
  });
  
  session.endSession();
}

// When NOT to use transactions
// Single document operations are already atomic
await User.findByIdAndUpdate(id, { $inc: { balance: -100 } }); 
// This is atomic without a transaction`,
      language: 'javascript'
    },
    interviewAnswer: 'MongoDB transactions are essential for operations that must be atomic across multiple documents - like transfers, order creation with inventory decrement, or any all-or-nothing operation. The pattern is always: start session, begin transaction, run operations with session, commit on success, abort on error, always end session in finally. I use withTransaction helper when I need automatic retry on transient errors.',
    commonMistakes: [
      'Not ending session (resource leak)',
      'Not passing session to all operations in the transaction',
      'Using transactions for single-document operations (unnecessary overhead)',
      'Long-running transactions (hold locks, hurt performance)'
    ],
    realWorldUse: 'E-commerce order placement (create order + decrement inventory), financial transfers, any operation that modifies multiple collections atomically.',
    followUpQuestions: [
      'Does MongoDB guarantee atomicity for single document operations?',
      'What is the performance cost of transactions?',
      'What is write concern in MongoDB?'
    ]
  },

  {
    id: 'db-indexing-mongodb',
    category: 'database',
    type: 'theory',
    question: 'What types of indexes does MongoDB support?',
    difficulty: 'intermediate',
    tags: ['mongodb', 'indexes', 'performance'],
    shortAnswer: 'MongoDB supports single field, compound, multikey (arrays), text, geospatial, hashed, sparse, TTL, and partial indexes. Each serves different query patterns.',
    detailedExplanation: 'Single field indexes speed up equality queries. Compound indexes cover multiple fields - order matters (ESR rule: Equality, Sort, Range). Multikey indexes automatically index array elements. Text indexes enable full-text search. Geospatial indexes support location queries. TTL indexes automatically delete documents after expiry (for sessions, logs). Partial indexes only index documents matching a filter condition.',
    example: {
      code: `const mongoose = require('mongoose');

// Single field index
userSchema.index({ email: 1 }); // Ascending
userSchema.index({ createdAt: -1 }); // Descending (most recent first)

// Unique index
userSchema.index({ email: 1 }, { unique: true });

// Compound index (ESR rule: Equality, Sort, Range)
// For query: find active users in city, sort by date
userSchema.index({ status: 1, createdAt: -1, age: 1 });
// status = equality, createdAt = sort, age = range

// Multikey index (for arrays - automatic)
postSchema.index({ tags: 1 }); // Indexes each tag value

// Text index for full-text search
productSchema.index({ name: 'text', description: 'text' });
// Search: db.products.find({ $text: { $search: "laptop gaming" } })

// Sparse index (only indexes documents with the field)
userSchema.index({ phone: 1 }, { sparse: true });
// Excludes documents without phone field

// TTL index (auto-delete after expiry)
sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });
// Documents deleted 1 hour after createdAt

// Partial index (only index matching documents)
orderSchema.index(
  { userId: 1, createdAt: -1 },
  { partialFilterExpression: { status: 'active' } }
);
// Only indexes active orders - smaller index, faster writes

// Check existing indexes
// db.users.getIndexes()

// Analyze query - check for COLLSCAN (bad) vs IXSCAN (good)
// db.users.find({ email: 'alex@test.com' }).explain('executionStats')

// Compound index field order matters!
// Index: { lastName: 1, firstName: 1 }
db.users.find({ lastName: 'Smith' }); // âœ… Uses index
db.users.find({ lastName: 'Smith', firstName: 'Alex' }); // âœ… Uses index
db.users.find({ firstName: 'Alex' }); // âŒ Cannot use this index alone`,
      language: 'javascript'
    },
    interviewAnswer: 'Indexing strategy is critical for MongoDB performance. I always create indexes for fields used in find() queries and sort operations. Compound indexes follow the ESR rule. TTL indexes are great for session cleanup and log expiry - no manual cleanup needed. I use explain() to verify queries use IXSCAN not COLLSCAN. Too many indexes slow writes, so I analyze query patterns before indexing.',
    commonMistakes: [
      'Using wrong field order in compound indexes',
      'Indexing every field (hurts write performance)',
      'Not running explain() to check query plans',
      'Missing indexes on fields used in aggregation $match stages'
    ],
    realWorldUse: 'Every production MongoDB app needs careful index design. MongoDB Atlas suggests missing indexes. Index usage can be monitored in Atlas Performance Advisor.',
    followUpQuestions: [
      'What is the ESR rule for compound indexes?',
      'When would you use a partial index?',
      'How do you drop an unused index?'
    ]
  },

  {
    id: 'db-sql-views',
    category: 'database',
    type: 'theory',
    question: 'What are SQL views and when should you use them?',
    difficulty: 'intermediate',
    tags: ['sql', 'views', 'abstraction'],
    shortAnswer: 'A view is a saved SQL query that acts like a virtual table. It simplifies complex queries, enforces access control, and provides a stable API layer over changing table structures.',
    detailedExplanation: 'Views store a SELECT query and let you query it like a table. Regular views recalculate every query (no stored data). Materialized views cache the result and refresh periodically â€” great for expensive aggregations. Views provide security (hide sensitive columns), abstraction (rename/reformat columns), and reusability (complex joins defined once). Updatable views allow INSERT/UPDATE/DELETE under certain conditions.',
    example: {
      code: `-- Create a view
CREATE VIEW active_users AS
SELECT 
  id, 
  name, 
  email,
  created_at
FROM users
WHERE status = 'active' AND deleted_at IS NULL;

-- Query the view like a table
SELECT * FROM active_users WHERE created_at > NOW() - INTERVAL '30 days';

-- Security: hide sensitive columns
CREATE VIEW public_products AS
SELECT id, name, description, price
FROM products;
-- Hides: cost_price, supplier_id, internal_notes

-- Complex join view
CREATE VIEW order_summary AS
SELECT 
  o.id AS order_id,
  u.name AS customer_name,
  u.email,
  COUNT(oi.id) AS item_count,
  SUM(oi.price * oi.qty) AS total,
  o.status,
  o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, u.name, u.email, o.status, o.created_at;

-- Now reports use the view, not complex joins
SELECT * FROM order_summary WHERE status = 'pending';

-- Materialized view (cached, faster for expensive queries)
CREATE MATERIALIZED VIEW monthly_revenue AS
SELECT 
  DATE_TRUNC('month', created_at) AS month,
  SUM(total) AS revenue,
  COUNT(*) AS order_count
FROM orders
WHERE status = 'completed'
GROUP BY 1
ORDER BY 1;

-- Refresh when needed (not automatic)
REFRESH MATERIALIZED VIEW monthly_revenue;

-- Drop view
DROP VIEW IF EXISTS active_users;`,
      language: 'sql'
    },
    interviewAnswer: 'I use views for two main reasons: abstraction and security. For security, I create views that expose only non-sensitive columns â€” external systems query the view, never the underlying table. For abstraction, complex join queries used in multiple reports get wrapped in a view so report code stays simple. Materialized views are my go-to for dashboard analytics that run slowly â€” I refresh them hourly instead of recalculating on every page load.',
    commonMistakes: [
      'Using views everywhere (adds abstraction overhead)',
      'Forgetting materialized views need manual refresh',
      'Assuming views always improve performance (regular views don\'t cache)',
      'Complex nested views that are hard to debug'
    ],
    realWorldUse: 'Analytics dashboards, API abstraction layers, row-level security, legacy database migrations (views hide schema changes), reporting systems.',
    followUpQuestions: [
      'What is the difference between a view and a materialized view?',
      'Can you INSERT/UPDATE through a view?',
      'When would you use a materialized view?'
    ]
  },

  {
    id: 'db-cap-theorem',
    category: 'database',
    type: 'theory',
    question: 'What is the CAP Theorem and how does it apply to database choices?',
    difficulty: 'advanced',
    tags: ['cap-theorem', 'distributed', 'consistency'],
    shortAnswer: 'CAP Theorem states distributed systems can only guarantee 2 of 3: Consistency (all nodes see same data), Availability (every request gets a response), Partition Tolerance (system works despite network failures). Most DBs choose CP or AP.',
    detailedExplanation: 'Network partitions are inevitable in distributed systems, so partition tolerance is non-negotiable. This leaves a choice between Consistency (no stale reads) and Availability (always respond). CP systems (MongoDB, HBase) sacrifice availability during partitions â€” refuse to serve stale data. AP systems (Cassandra, DynamoDB) sacrifice consistency â€” serve possibly stale data but always respond. SQL databases with ACID are CA systems (assume no partitions).',
    example: {
      code: `// CAP Theorem examples in practice

// Consistency + Partition Tolerance (CP)
// MongoDB with majority read concern
const result = await db.collection('accounts').findOne(
  { userId: '123' },
  { readConcern: { level: 'majority' } }
  // Blocks until majority of nodes have the data
  // If partition: returns error rather than stale data
);

// Availability + Partition Tolerance (AP)  
// Cassandra - always responds, may serve stale data
// If nodes are partitioned, read from available node
// Application must handle eventual consistency

// Banking - choose Consistency (CP)
// Can't show wrong balance, better to show error
async function getBalance(accountId) {
  try {
    // Reads from primary only - no stale data
    return await Account.findById(accountId).session(session);
  } catch (err) {
    // During partition: show error, not stale data
    throw new Error('Service temporarily unavailable');
  }
}

// Social media feed - choose Availability (AP)
// Better to show slightly old posts than no feed
async function getFeed(userId) {
  try {
    return await Feed.find({ userId }).sort({ createdAt: -1 });
  } catch (err) {
    // During partition: return cached/stale data
    return await cache.get(\`feed:\${userId}\`) || [];
  }
}

// Database CAP positioning
// PostgreSQL: CA (strong consistency, no partition tolerance design)
// MongoDB: CP (consistency over availability during partitions)
// Cassandra: AP (availability and partition tolerance, eventual consistency)
// DynamoDB: AP by default, CP with strong consistency reads
// Redis: CP (single node) or AP (Redis Cluster with async replication)`,
      language: 'javascript'
    },
    interviewAnswer: 'CAP Theorem guides distributed database choices. Since network partitions always happen, the real choice is CP vs AP. For banking or inventory (can\'t show wrong balance), I choose CP â€” better to show an error than wrong data. For social feeds or search (slight staleness is acceptable), I choose AP â€” always respond even if data is seconds old. This is why you might see "your post is being processed" â€” the system chose availability over immediate consistency.',
    commonMistakes: [
      'Thinking you can have all three (you can\'t guarantee it)',
      'Not understanding partition tolerance is mandatory in distributed systems',
      'Choosing wrong trade-off for the use case',
      'Confusing consistency here with ACID consistency'
    ],
    realWorldUse: 'Architecture decisions for microservices, choosing between MongoDB and Cassandra, designing multi-region deployments. Every distributed system faces this trade-off.',
    followUpQuestions: [
      'What is eventual consistency?',
      'Where does PostgreSQL sit in the CAP triangle?',
      'What is the PACELC theorem (extension of CAP)?'
    ]
  },

  {
    id: 'db-query-optimization',
    category: 'database',
    type: 'theory',
    question: 'How do you optimize slow database queries?',
    difficulty: 'intermediate',
    tags: ['optimization', 'performance', 'explain'],
    shortAnswer: 'Use EXPLAIN/EXPLAIN ANALYZE to see query plan. Add indexes on WHERE/JOIN/ORDER BY columns. Avoid SELECT *, avoid functions on indexed columns, limit result sets, use covering indexes, and consider query rewriting.',
    detailedExplanation: 'Query optimization starts with measurement: EXPLAIN ANALYZE shows actual execution time per step, rows scanned, and whether indexes are used. Common fixes: add missing indexes (identified by sequential scans), rewrite subqueries as JOINs, avoid SELECT *, avoid applying functions to indexed columns (prevents index use), use LIMIT for paginated queries, partition large tables, denormalize hot paths.',
    example: {
      code: `-- 1. Always start with EXPLAIN ANALYZE
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 123;
-- Shows: Seq Scan (bad) or Index Scan (good)
-- Shows: actual rows, estimated rows, execution time

-- 2. Add missing index (found via sequential scan)
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- 3. Avoid functions on indexed columns
-- âŒ Can't use index on email
SELECT * FROM users WHERE LOWER(email) = 'alex@test.com';
-- âœ… Use functional index or store lowercase
CREATE INDEX idx_email_lower ON users(LOWER(email));
-- Or store email already lowercase

-- 4. Avoid SELECT *
-- âŒ Fetches all columns including large text/blob fields
SELECT * FROM articles WHERE author_id = 1;
-- âœ… Only needed columns
SELECT id, title, published_at FROM articles WHERE author_id = 1;

-- 5. Covering index (index includes all needed columns)
-- Query: SELECT email FROM users WHERE age > 25 ORDER BY name
CREATE INDEX idx_users_covering ON users(age, name, email);
-- Index-only scan: no need to access main table!

-- 6. Rewrite correlated subquery as JOIN
-- âŒ Slow: runs subquery for each row
SELECT * FROM orders o
WHERE (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) > 5;

-- âœ… Fast: single join
SELECT o.*
FROM orders o
JOIN (
  SELECT order_id, COUNT(*) as item_count
  FROM order_items
  GROUP BY order_id
  HAVING COUNT(*) > 5
) oi ON o.id = oi.order_id;

-- 7. Pagination: keyset is faster than OFFSET for large tables
-- âŒ OFFSET scans all previous rows
SELECT * FROM posts ORDER BY id LIMIT 20 OFFSET 10000;

-- âœ… Keyset pagination
SELECT * FROM posts 
WHERE id > 10000  -- Last seen ID
ORDER BY id 
LIMIT 20;

-- MongoDB equivalents
// Use explain()
db.orders.find({ userId: '123' }).explain('executionStats');
// Look for COLLSCAN vs IXSCAN
// Add index if COLLSCAN
db.orders.createIndex({ userId: 1 });`,
      language: 'sql'
    },
    interviewAnswer: 'Query optimization always starts with EXPLAIN ANALYZE â€” you need to see what\'s actually happening before guessing. The most impactful fix is almost always a missing index. I look for sequential scans on large tables in the query plan. After adding indexes, I check for SELECT * pulling unnecessary large columns, and N+1 patterns. For very large tables, pagination with keyset (WHERE id > last_seen) is much faster than OFFSET which scans all skipped rows.',
    commonMistakes: [
      'Adding indexes without checking EXPLAIN first',
      'Over-indexing (every index slows down writes)',
      'Using OFFSET for deep pagination on large tables',
      'Functions on indexed columns preventing index use'
    ],
    realWorldUse: 'Every high-traffic database application has slow query logs. Database monitoring (pg_stat_statements, MongoDB Atlas Performance Advisor) identifies the worst offenders.',
    followUpQuestions: [
      'What is a query plan?',
      'What is the difference between EXPLAIN and EXPLAIN ANALYZE?',
      'What is a covering index?'
    ]
  },

  {
    id: 'db-stored-procedures',
    category: 'database',
    type: 'theory',
    question: 'What are stored procedures and when should you use them?',
    difficulty: 'intermediate',
    tags: ['stored-procedures', 'sql', 'database'],
    shortAnswer: 'Stored procedures are precompiled SQL code blocks stored in the database. They reduce network round trips, enforce business logic at the DB layer, and can improve performance. But they make logic harder to version control and test.',
    detailedExplanation: 'Stored procedures run in the database engine, reducing network traffic for complex multi-step operations. They can accept parameters, use control flow (IF/ELSE, loops), and call other procedures. Benefits: precompiled (faster), reduced network calls, atomic operations, centralized business logic. Drawbacks: harder to version control, test, and debug; creates tight coupling between app and DB; different syntax per database.',
    example: {
      code: `-- PostgreSQL stored procedure example

-- Simple procedure: transfer funds
CREATE OR REPLACE PROCEDURE transfer_funds(
  from_account_id INT,
  to_account_id INT, 
  amount DECIMAL,
  OUT transaction_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check sufficient funds
  IF (SELECT balance FROM accounts WHERE id = from_account_id) < amount THEN
    RAISE EXCEPTION 'Insufficient funds';
  END IF;
  
  -- Debit
  UPDATE accounts SET balance = balance - amount 
  WHERE id = from_account_id;
  
  -- Credit
  UPDATE accounts SET balance = balance + amount 
  WHERE id = to_account_id;
  
  -- Log transaction
  INSERT INTO transactions (from_id, to_id, amount, created_at)
  VALUES (from_account_id, to_account_id, amount, NOW())
  RETURNING id INTO transaction_id;
  
  -- Implicit commit if no errors
END;
$$;

-- Call the procedure
CALL transfer_funds(1, 2, 100.00, NULL);

-- Function (returns value, can be used in SELECT)
CREATE OR REPLACE FUNCTION calculate_discount(
  original_price DECIMAL,
  coupon_code VARCHAR
)
RETURNS DECIMAL
LANGUAGE plpgsql
AS $$
DECLARE
  discount_rate DECIMAL;
BEGIN
  SELECT rate INTO discount_rate
  FROM coupons
  WHERE code = coupon_code AND expires_at > NOW();
  
  IF discount_rate IS NULL THEN
    RETURN original_price;
  END IF;
  
  RETURN original_price * (1 - discount_rate);
END;
$$;

-- Use in query
SELECT id, name, calculate_discount(price, 'SAVE20') AS final_price
FROM products;

-- Node.js calling stored procedure
const { rows } = await pool.query(
  'CALL transfer_funds($1, $2, $3, NULL)',
  [fromId, toId, amount]
);`,
      language: 'sql'
    },
    interviewAnswer: 'Stored procedures are useful when you need to reduce network round trips for complex multi-step operations, or when you need to enforce business logic at the database level regardless of which application connects. The transfer funds example is classic â€” running it in the DB ensures atomicity and reduces 4 network calls to 1. However, I generally prefer handling business logic in the application layer where it\'s easier to test, version control, and deploy.',
    commonMistakes: [
      'Putting all business logic in stored procedures (hard to maintain)',
      'Not handling errors inside procedures',
      'Database-specific syntax that doesn\'t port well',
      'Treating stored procedures as a replacement for proper transactions'
    ],
    realWorldUse: 'Financial systems, legacy enterprise databases, ETL pipelines, batch processing. Increasingly replaced by application-layer logic with proper ORM transactions.',
    followUpQuestions: [
      'What is the difference between a stored procedure and a function?',
      'What are the disadvantages of stored procedures?',
      'When would you choose application-layer logic over stored procedures?'
    ]
  },
  {
    id: 'db-window-functions',
    category: 'database',
    type: 'theory',
    question: 'What are SQL window functions and how do they differ from GROUP BY?',
    difficulty: 'advanced',
    tags: ['sql', 'window-functions', 'analytics', 'advanced-sql'],
    shortAnswer: 'Window functions perform calculations across a set of rows related to the current row without collapsing them into one row (unlike GROUP BY). OVER() defines the window: PARTITION BY groups, ORDER BY controls order within the window.',
    detailedExplanation: 'GROUP BY aggregates rows into one result row per group. Window functions keep all rows and add computed columns alongside them: running totals (SUM OVER), ranks (ROW_NUMBER, RANK, DENSE_RANK), moving averages, lead/lag values. Common functions: ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), LEAD(), SUM() OVER, AVG() OVER.',
    example: {
      code: `-- Rank employees by salary within each department
SELECT
  name,
  department,
  salary,
  RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank,
  ROW_NUMBER() OVER (ORDER BY salary DESC) AS global_rank,
  salary - LAG(salary) OVER (ORDER BY hire_date) AS salary_change
FROM employees;

-- Running total
SELECT
  date,
  amount,
  SUM(amount) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total
FROM sales;

-- Top 3 per group (vs GROUP BY which would need a subquery)
SELECT * FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn
  FROM employees
) ranked WHERE rn <= 3;`,
      language: 'sql'
    },
    interviewAnswer: 'Contrast with GROUP BY: "window functions keep all rows; GROUP BY collapses them." The top-N-per-group query is the classic window function interview question.',
    commonMistakes: ['Confusing RANK (leaves gaps) with DENSE_RANK (no gaps) with ROW_NUMBER (always unique)', 'Forgetting that window functions can\'t be used in WHERE clause (use a subquery/CTE)'],
    realWorldUse: 'Analytics dashboards, reporting queries, finding top N per category, calculating percentiles.',
    followUpQuestions: ['What is the difference between RANK and DENSE_RANK?', 'How do you calculate a moving 7-day average with window functions?']
  },

  {
    id: 'db-cte',
    category: 'database',
    type: 'theory',
    question: 'What is a Common Table Expression (CTE) and when would you use a recursive CTE?',
    difficulty: 'intermediate',
    tags: ['sql', 'cte', 'recursive', 'readability'],
    shortAnswer: 'A CTE (WITH clause) is a named temporary result set that exists for the duration of one query. It improves readability. A recursive CTE references itself to traverse hierarchical data (org charts, file trees, bill of materials).',
    detailedExplanation: 'Non-recursive CTEs are a stylistic improvement over nested subqueries — easier to read and re-usable within the same query. Recursive CTEs have two parts: the base case (anchor member) and the recursive case that references the CTE itself, joined with UNION ALL. The recursion terminates when the recursive part returns no rows.',
    example: {
      code: `-- Non-recursive CTE (readability)
WITH high_value_orders AS (
  SELECT customer_id, SUM(total) AS order_total
  FROM orders
  GROUP BY customer_id
  HAVING SUM(total) > 1000
)
SELECT c.name, o.order_total
FROM customers c
JOIN high_value_orders o ON c.id = o.customer_id;

-- Recursive CTE — employee hierarchy
WITH RECURSIVE org_chart AS (
  -- Base case: top-level employees (no manager)
  SELECT id, name, manager_id, 0 AS level
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  -- Recursive: employees whose manager is in the CTE
  SELECT e.id, e.name, e.manager_id, o.level + 1
  FROM employees e
  JOIN org_chart o ON e.manager_id = o.id
)
SELECT * FROM org_chart ORDER BY level, name;`,
      language: 'sql'
    },
    interviewAnswer: 'For non-recursive: "it\'s like naming a subquery for reuse and readability." For recursive: describe the anchor + recursive member structure with the org-chart example.',
    commonMistakes: ['Forgetting UNION ALL (not UNION) in recursive CTEs — UNION would deduplicate and break traversal', 'Not adding a depth limit to prevent infinite recursion for circular references'],
    realWorldUse: 'Organisation hierarchies, category trees, bill of materials, file system paths.',
    followUpQuestions: ['What is the difference between a CTE and a subquery?', 'How do you prevent infinite recursion in a recursive CTE?']
  },

  {
    id: 'db-upsert',
    category: 'database',
    type: 'theory',
    question: 'What is an upsert and how do you implement it in PostgreSQL and MongoDB?',
    difficulty: 'intermediate',
    tags: ['database', 'postgresql', 'mongodb', 'upsert', 'sql'],
    shortAnswer: 'An upsert inserts a row if it doesn\'t exist, or updates it if it does — atomically. PostgreSQL: INSERT ... ON CONFLICT DO UPDATE. MongoDB: updateOne with upsert: true.',
    detailedExplanation: 'Upserts avoid a separate SELECT-then-INSERT-or-UPDATE round trip, which has a race condition. They\'re essential for idempotent data import pipelines and syncing external data. PostgreSQL\'s ON CONFLICT targets a specific unique constraint. MongoDB\'s upsert matches by the filter and updates or creates.',
    example: {
      code: `-- PostgreSQL upsert
INSERT INTO users (id, email, updated_at)
VALUES (1, 'alice@example.com', NOW())
ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      updated_at = EXCLUDED.updated_at;

-- Insert only (ignore if exists)
INSERT INTO users (id, email) VALUES (1, 'alice@example.com')
ON CONFLICT (id) DO NOTHING;

-- MongoDB upsert
await db.collection('users').updateOne(
  { externalId: 'ext-123' },          // filter
  {
    $set: { email: 'alice@example.com', updatedAt: new Date() },
    $setOnInsert: { createdAt: new Date() } // only on insert
  },
  { upsert: true }
);`,
      language: 'sql'
    },
    interviewAnswer: 'Explain the atomicity benefit (no race condition vs SELECT + INSERT). Show EXCLUDED keyword in PostgreSQL and $setOnInsert in MongoDB.',
    commonMistakes: ['Using ON CONFLICT without specifying the conflict target in PostgreSQL', 'Not using $setOnInsert to set creation timestamps only on new documents'],
    realWorldUse: 'Data sync from external APIs, idempotent event processing, user profile creation/update.',
    followUpQuestions: ['What is EXCLUDED in PostgreSQL ON CONFLICT?', 'How does MySQL REPLACE INTO differ from upsert?']
  },

  {
    id: 'db-explain-analyze',
    category: 'database',
    type: 'theory',
    question: 'How do you use EXPLAIN ANALYZE to diagnose slow SQL queries?',
    difficulty: 'advanced',
    tags: ['sql', 'performance', 'explain', 'query-optimization', 'postgresql'],
    shortAnswer: 'EXPLAIN shows the query plan (how the planner intends to execute). EXPLAIN ANALYZE actually runs the query and shows real timing and row counts. Look for: Sequential Scan on large tables (missing index), high row estimates vs actuals (stale statistics), and nested loops on large sets.',
    detailedExplanation: 'Key nodes to understand: Seq Scan (reads entire table — often bad on large tables), Index Scan (uses index), Bitmap Heap Scan (bulk index lookups), Hash Join vs Nested Loop vs Merge Join. "Actual Rows" vs "Plan Rows" discrepancy means stale statistics — run ANALYZE. The widest node in the plan is usually the bottleneck.',
    example: {
      code: `-- Basic explain
EXPLAIN SELECT * FROM orders WHERE customer_id = 1;

-- With actual execution (runs the query)
EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 1;

-- Output example:
-- Seq Scan on orders (cost=0.00..450.00 rows=5 width=120)
-- (actual time=0.04..12.3 rows=5 loops=1)
--   Filter: (customer_id = 1)
--   Rows Removed by Filter: 10000  ← 10K rows scanned to find 5!

-- Fix: add index
CREATE INDEX idx_orders_customer_id ON orders(customer_id);

-- After index:
-- Index Scan using idx_orders_customer_id on orders
-- (actual time=0.04..0.08 rows=5 loops=1)  ← much faster

-- Update stale statistics
ANALYZE orders; -- or VACUUM ANALYZE orders;`,
      language: 'sql'
    },
    interviewAnswer: 'Walk through: run EXPLAIN ANALYZE, look for Seq Scans on large tables and row estimate vs actual discrepancies. Adding an index and re-running shows the improvement.',
    commonMistakes: ['Using EXPLAIN without ANALYZE — plan rows are estimates only', 'Creating an index without checking if it\'s actually used (check pg_stat_user_indexes)'],
    realWorldUse: 'Diagnosing slow API endpoints, optimising dashboard queries, performance regression investigations.',
    followUpQuestions: ['What is the difference between a sequential scan and an index scan?', 'What is a covering index?']
  },

  {
    id: 'db-migrations',
    category: 'database',
    type: 'theory',
    question: 'What are database migrations and how do you handle zero-downtime schema changes?',
    difficulty: 'intermediate',
    tags: ['database', 'migrations', 'zero-downtime', 'deployment'],
    shortAnswer: 'Migrations are versioned, incremental schema changes tracked in files (Flyway, Liquibase, Prisma Migrate). Zero-downtime strategies: expand-contract (add new column, migrate data, drop old column), avoid long-running locks, use NOT VALID constraints for large tables.',
    detailedExplanation: 'The expand-contract (or parallel-change) pattern: Phase 1 (expand) — add new column/table, both old and new code work. Phase 2 (migrate) — backfill data. Phase 3 (contract) — remove old column after all code uses new one. This avoids locking a table during data migration. In PostgreSQL, adding a NOT NULL column locks the table unless you: add nullable, backfill, then add constraint with NOT VALID, then VALIDATE.',
    example: {
      code: `-- ❌ This locks the entire table for migration on large tables:
ALTER TABLE users ADD COLUMN full_name TEXT NOT NULL DEFAULT '';

-- ✅ Zero-downtime pattern:
-- Step 1: Add nullable column (fast, no lock)
ALTER TABLE users ADD COLUMN full_name TEXT;

-- Step 2: Backfill in batches (no lock)
UPDATE users SET full_name = first_name || ' ' || last_name
WHERE id BETWEEN 1 AND 10000;
-- ... repeat for all batches

-- Step 3: Add NOT NULL constraint without full scan
ALTER TABLE users ADD CONSTRAINT users_full_name_not_null
  CHECK (full_name IS NOT NULL) NOT VALID;
ALTER TABLE users VALIDATE CONSTRAINT users_full_name_not_null;
-- (VALIDATE takes a ShareUpdateExclusiveLock, not AccessExclusiveLock)

-- Step 4 (later): Drop old columns after code no longer uses them
ALTER TABLE users DROP COLUMN first_name, DROP COLUMN last_name;`,
      language: 'sql'
    },
    interviewAnswer: 'The expand-contract pattern + NOT VALID constraint trick are the main points. Demonstrate awareness that naive ALTER TABLE can lock a large table for minutes.',
    commonMistakes: ['Running ALTER TABLE ADD NOT NULL DEFAULT in one step on a large table', 'Not testing migrations on a production-sized dataset'],
    realWorldUse: 'Any production deployment involving schema changes, especially on high-traffic tables.',
    followUpQuestions: ['What is Flyway vs Liquibase vs Prisma Migrate?', 'How do you roll back a failed migration?']
  },

  {
    id: 'db-redis-use-cases',
    category: 'database',
    type: 'theory',
    question: 'What are the main use cases for Redis alongside a primary database?',
    difficulty: 'intermediate',
    tags: ['redis', 'caching', 'database', 'performance'],
    shortAnswer: 'Redis is used for: caching DB query results, session storage, rate limiting counters, pub/sub messaging, distributed locks, job queues (BullMQ), and leaderboards (sorted sets). Its in-memory storage makes reads ~100x faster than a DB round trip.',
    detailedExplanation: 'Redis is not a replacement for a relational DB — data is not durably persisted by default (configurable). Common patterns: cache-aside (check Redis → on miss, query DB + cache result), write-through (write DB and Redis together), TTL-based expiry for session data, INCR for atomic counters (rate limiting), ZADD/ZRANGEBYSCORE for leaderboards.',
    example: {
      code: `// Cache-aside pattern
async function getUser(id) {
  const cached = await redis.get(\`user:\${id}\`);
  if (cached) return JSON.parse(cached);

  const user = await db.users.findById(id);
  await redis.setex(\`user:\${id}\`, 300, JSON.stringify(user)); // TTL 5min
  return user;
}

// Rate limiting with INCR + EXPIRE
async function checkRateLimit(ip) {
  const key = \`rate:\${ip}:\${Math.floor(Date.now() / 60000)}\`; // per-minute window
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 60);
  return count <= 100; // 100 requests/min
}

// Pub/sub
redis.subscribe('notifications', (msg) => console.log(msg));
redis.publish('notifications', JSON.stringify({ userId: 1, text: 'Hello' }));

// Sorted set leaderboard
await redis.zadd('scores', 100, 'alice');
await redis.zrevrange('scores', 0, 9, 'WITHSCORES'); // top 10`,
      language: 'javascript'
    },
    interviewAnswer: 'List 5 concrete use cases with data structures: string for cache, INCR for rate limiting, ZADD for leaderboards, list for queues, pub/sub for messaging.',
    commonMistakes: ['Caching mutable data without a cache invalidation strategy', 'Not setting TTL — Redis fills up and starts evicting with an LRU policy you didn\'t plan for'],
    realWorldUse: 'Session management (most web apps), API rate limiting, real-time features in Node.js.',
    followUpQuestions: ['What is cache invalidation and why is it hard?', 'What Redis data structure would you use for a leaderboard?']
  },

  {
    id: 'db-denormalization',
    category: 'database',
    type: 'theory',
    question: 'What is database denormalization and when is it justified?',
    difficulty: 'intermediate',
    tags: ['database', 'denormalization', 'performance', 'design'],
    shortAnswer: 'Denormalization intentionally introduces redundancy (duplicating data or pre-joining tables) to speed up read queries at the cost of write complexity and storage. Justified when: read performance is critical, JOINs across tables are slow, and the data rarely changes.',
    detailedExplanation: 'Normalisation reduces redundancy and ensures consistency. Denormalisation trades consistency maintenance for read speed. Techniques: storing a customer\'s country on the order (even though it\'s on the customer record) to avoid a JOIN, pre-aggregating a post\'s comment count, materialised views. Always benchmark before denormalising — premature optimisation.',
    example: {
      code: `-- Normalised: requires JOIN for every query
SELECT o.id, c.name, c.country
FROM orders o
JOIN customers c ON c.id = o.customer_id;

-- Denormalised: customer_name and country copied to orders
-- Faster read, but must update orders when customer changes name
SELECT id, customer_name, customer_country FROM orders;

-- Materialised view: pre-computed aggregation
CREATE MATERIALIZED VIEW product_stats AS
  SELECT
    product_id,
    COUNT(*) AS review_count,
    AVG(rating) AS avg_rating
  FROM reviews
  GROUP BY product_id;
-- Refresh periodically:
REFRESH MATERIALIZED VIEW CONCURRENTLY product_stats;`,
      language: 'sql'
    },
    interviewAnswer: 'Position it as a deliberate tradeoff with clear trade conditions. Mention materialised views as a cleaner alternative for read-heavy aggregations.',
    commonMistakes: ['Denormalising without benchmarking — the JOIN may already be fast enough', 'Not considering update anomalies when duplicated data changes'],
    realWorldUse: 'High-read e-commerce product pages, analytics tables, event-sourced systems.',
    followUpQuestions: ['What is a materialised view?', 'When does normalisation hurt performance?']
  },

  {
    id: 'db-soft-delete',
    category: 'database',
    type: 'theory',
    question: 'What is soft delete and what are the tradeoffs compared to hard delete?',
    difficulty: 'beginner',
    tags: ['database', 'soft-delete', 'design', 'patterns'],
    shortAnswer: 'Soft delete sets a deleted_at timestamp instead of removing the row. Data is retained for audit/recovery but every query must filter WHERE deleted_at IS NULL — easy to forget, causing data leaks. Hard delete reclaims storage but is irreversible.',
    detailedExplanation: 'Soft delete is common in systems with audit requirements, user-recoverable deletes ("undo"), or regulatory retention. The risk: developers forget the WHERE deleted_at IS NULL filter and expose deleted data. Mitigations: database views that filter automatically, query hooks in the ORM (Prisma middleware, Sequelize paranoid mode), or moving deleted records to an archive table.',
    example: {
      code: `-- Schema
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP NULL;

-- Soft delete
UPDATE users SET deleted_at = NOW() WHERE id = 1;

-- ❌ Forget the filter — returns deleted users!
SELECT * FROM users;

-- ✅ Always filter
SELECT * FROM users WHERE deleted_at IS NULL;

-- Postgres view to enforce the filter
CREATE VIEW active_users AS
  SELECT * FROM users WHERE deleted_at IS NULL;

-- Prisma middleware (adds filter to every query)
prisma.$use(async (params, next) => {
  if (params.model === 'User' && params.action === 'findMany') {
    params.args.where = { ...params.args.where, deletedAt: null };
  }
  return next(params);
});`,
      language: 'sql'
    },
    interviewAnswer: 'List the tradeoffs clearly. The "forgot the filter" data leak is the most common problem to call out in interviews.',
    commonMistakes: ['Unique constraints breaking on soft-deleted rows (user re-registers with same email)', 'Indexes not filtering on deleted_at — scans include deleted rows'],
    realWorldUse: 'User accounts, content management systems, financial records with audit requirements.',
    followUpQuestions: ['How do unique constraints interact with soft-deleted rows?', 'What is the difference between soft delete and an archive table?']
  },

  {
    id: 'db-connection-pool',
    category: 'database',
    type: 'theory',
    question: 'What is a database connection pool and how do you configure it correctly?',
    difficulty: 'intermediate',
    tags: ['database', 'connection-pool', 'performance', 'nodejs'],
    shortAnswer: 'A connection pool maintains a set of open DB connections for reuse, avoiding the overhead of establishing a new TCP+TLS connection per query. Key settings: min/max pool size, idle timeout, connection timeout. Setting max too high causes DB-side resource exhaustion.',
    detailedExplanation: 'Opening a DB connection is expensive (~100ms). A pool opens a fixed set of connections at startup and lends them to queries. Key parameters: max (max concurrent connections — must not exceed DB\'s max_connections), min (keep-warm connections), idleTimeoutMillis (close idle connections), connectionTimeoutMillis (throw if no connection available in this time). In Kubernetes with multiple pods, max_pool_size × pod_count must not exceed DB max_connections.',
    example: {
      code: `// pg pool (PostgreSQL)
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  max: 20,               // max connections in pool
  min: 2,                // keep 2 warm connections
  idleTimeoutMillis: 30000,  // close idle after 30s
  connectionTimeoutMillis: 2000, // throw if can't connect in 2s
});

// Prisma connection pool
datasource db {
  url = env("DATABASE_URL")
  // PostgreSQL: ?connection_limit=10&pool_timeout=10
}

// Monitor pool health
pool.on('error', (err) => console.error('Pool error:', err));
console.log('Pool size:', pool.totalCount, 'Idle:', pool.idleCount);

// PgBouncer — connection pooler for very high concurrency
// Handles 1000s of app connections → pool of 20 actual DB connections`,
      language: 'javascript'
    },
    interviewAnswer: 'Explain the per-query overhead avoided, then the max × pods ≤ DB max_connections math. Mention PgBouncer as the production solution for high-scale.',
    commonMistakes: ['Not accounting for multiple pods when setting max pool size', 'Not setting connectionTimeoutMillis — app hangs silently when pool is exhausted'],
    realWorldUse: 'Every production Node.js + PostgreSQL stack. Misconfigured pools are a top cause of DB outages.',
    followUpQuestions: ['What is PgBouncer?', 'How do you monitor connection pool exhaustion?']
  },

  {
    id: 'db-postgresql-specific',
    category: 'database',
    type: 'theory',
    question: 'What are PostgreSQL-specific features that make it stand out from other SQL databases?',
    difficulty: 'intermediate',
    tags: ['postgresql', 'jsonb', 'full-text-search', 'arrays'],
    shortAnswer: 'PostgreSQL standout features: JSONB (native JSON with indexing), arrays and hstore, full-text search, window functions, CTEs, table inheritance, LISTEN/NOTIFY, partial indexes, and strong ACID with MVCC.',
    detailedExplanation: 'PostgreSQL goes beyond standard SQL. JSONB stores JSON as binary — queryable with operators like ->>, @>, and indexable with GIN indexes. Arrays let columns hold multiple values natively. Full-text search with tsvector/tsquery rivals dedicated search engines for moderate scale. LISTEN/NOTIFY enables real-time pub/sub directly in the database. Extensions like uuid-ossp, pgcrypto, PostGIS (geospatial) and pg_trgm (fuzzy search) vastly expand capability.',
    example: {
      code: `-- JSONB — query nested JSON
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT,
  metadata JSONB
);

INSERT INTO products VALUES (1, 'Laptop', '{"brand": "Dell", "specs": {"ram": 16, "cpu": "i7"}}');

-- Query JSON fields
SELECT name, metadata->>'brand' AS brand
FROM products
WHERE metadata->'specs'->>'ram' = '16';

-- JSONB containment operator (@>)
SELECT * FROM products
WHERE metadata @> '{"brand": "Dell"}';

-- GIN index for JSONB performance
CREATE INDEX idx_products_metadata ON products USING GIN (metadata);

-- Array columns
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title TEXT,
  tags TEXT[]  -- Array column
);

INSERT INTO articles VALUES (1, 'PostgreSQL Tips', ARRAY['database', 'sql', 'postgres']);

-- Query arrays
SELECT * FROM articles WHERE 'database' = ANY(tags);
SELECT * FROM articles WHERE tags @> ARRAY['sql', 'postgres']; -- contains

-- Full-text search
ALTER TABLE articles ADD COLUMN search_vector tsvector;

UPDATE articles
SET search_vector = to_tsvector('english', title || ' ' || content);

CREATE INDEX idx_articles_fts ON articles USING GIN (search_vector);

-- Search
SELECT title, ts_rank(search_vector, query) AS rank
FROM articles, to_tsquery('english', 'postgresql & tips') query
WHERE search_vector @@ query
ORDER BY rank DESC;

-- LISTEN/NOTIFY — real-time events
-- In one connection (producer):
NOTIFY user_created, '{"userId": 123, "email": "alex@test.com"}';

-- In another connection (consumer):
LISTEN user_created;
-- Receives notification when another session calls NOTIFY

-- Partial index — index only subset of rows
CREATE INDEX idx_active_users ON users(email)
WHERE deleted_at IS NULL; -- Only index active users

-- Generated columns
CREATE TABLE orders (
  price NUMERIC,
  quantity INT,
  total NUMERIC GENERATED ALWAYS AS (price * quantity) STORED
);`,
      language: 'sql',
    },
    interviewAnswer: 'JSONB is why many teams choose PostgreSQL over MySQL for flexible data — you get relational integrity and the ability to store dynamic JSON with full indexing. I use it for product metadata, user preferences, and audit logs. LISTEN/NOTIFY is underrated — it lets Node.js subscribe to database events in real time without polling. For search, pg_trgm with trigram indexes gives you fuzzy search on any column without Elasticsearch.',
    commonMistakes: [
      'Using JSON instead of JSONB (JSON is stored as text, not indexed)',
      'Not indexing JSONB columns used in queries',
      'Using PostgreSQL arrays when a junction table would be more flexible',
    ],
    realWorldUse: 'Flexible schemas (product catalogs), real-time features (LISTEN/NOTIFY), geospatial data (PostGIS), multi-tenant SaaS apps.',
    followUpQuestions: ['What is the difference between JSON and JSONB in PostgreSQL?', 'What is MVCC in PostgreSQL?'],
  },

  {
    id: 'db-read-replicas',
    category: 'database',
    type: 'theory',
    question: 'What are read replicas and how do you use them to scale database reads?',
    difficulty: 'intermediate',
    tags: ['read-replicas', 'scaling', 'replication', 'performance'],
    shortAnswer: 'Read replicas are copies of the primary database that serve read queries. Write operations go to the primary; read-heavy queries route to replicas. Reduces primary load, enables horizontal read scaling, and provides failover capability.',
    detailedExplanation: 'Most applications have far more reads than writes (typically 80-90% reads). Read replicas take read load off the primary. Replication is typically asynchronous — replicas lag slightly behind the primary (replication lag). For queries where stale data is acceptable (reports, analytics, search), route to replicas. For queries needing current data (after a write, session data), use the primary. Multi-region replicas reduce latency for global users.',
    example: {
      code: `// Prisma with read replicas
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_PRIMARY_URL")
  // Note: Prisma doesn't natively support read replicas
  // Use connection routing at the connection pool level
}

// pg connection pool with read/write routing
import { Pool } from 'pg';

const writePool = new Pool({
  connectionString: process.env.DATABASE_PRIMARY_URL,
  max: 10,
});

const readPool = new Pool({
  connectionString: process.env.DATABASE_REPLICA_URL,
  max: 20, // More connections for read-heavy workloads
});

// Route helper
async function query(sql: string, params?: unknown[], useReplica = false) {
  const pool = useReplica ? readPool : writePool;
  return pool.query(sql, params);
}

// Read from replica (analytics query — stale data OK)
const stats = await query(
  'SELECT COUNT(*) as total, SUM(amount) as revenue FROM orders',
  [],
  true // Use replica
);

// Write to primary
await query(
  'UPDATE users SET last_login = NOW() WHERE id = $1',
  [userId],
  false // Must use primary
);

// Read after write — must use primary to avoid reading stale data
async function createOrder(data) {
  // Write to primary
  const result = await query(
    'INSERT INTO orders (...) VALUES (...) RETURNING id',
    [...data],
    false
  );
  const orderId = result.rows[0].id;

  // Read from primary immediately after write (replication lag!)
  const order = await query(
    'SELECT * FROM orders WHERE id = $1',
    [orderId],
    false // Not replica — might not have replicated yet
  );

  return order.rows[0];
}

// In production: use PgBouncer or RDS Proxy for routing
// AWS RDS: use separate read endpoint
// DATABASE_REPLICA_URL = your-cluster.cluster-ro-xxxx.region.rds.amazonaws.com`,
      language: 'typescript',
    },
    interviewAnswer: 'Read replicas are the first scaling lever for read-heavy apps. Analytics queries, search, report generation — all excellent replica candidates. The key challenge is replication lag — if I create a record and immediately read it back, I might read from a replica that hasn\'t received the write yet. I use the primary for reads that immediately follow writes. In practice, AWS RDS and PlanetScale handle replica routing automatically.',
    commonMistakes: [
      'Reading from replica immediately after a write (replication lag)',
      'Not monitoring replication lag (could be seconds to minutes)',
      'Using read replicas for session validation (user could be logged out on primary but replica shows valid session)',
    ],
    realWorldUse: 'Any high-traffic application. AWS RDS, PlanetScale, Neon, Supabase all provide read replicas.',
    followUpQuestions: ['What is replication lag and how does it affect your application?', 'What is the difference between synchronous and asynchronous replication?'],
  },

  {
    id: 'db-database-backup',
    category: 'database',
    type: 'theory',
    question: 'What are database backup strategies and how do you implement point-in-time recovery?',
    difficulty: 'intermediate',
    tags: ['backup', 'recovery', 'pitr', 'disaster-recovery'],
    shortAnswer: 'Backup strategies: full backup (complete snapshot), incremental (changes since last backup), continuous WAL archiving (for point-in-time recovery). Test restores regularly. RTO (Recovery Time Objective) and RPO (Recovery Point Objective) define requirements.',
    detailedExplanation: 'RTO = maximum acceptable downtime after disaster. RPO = maximum acceptable data loss. Full backups are simple but large. Incremental backups are smaller but slower to restore. WAL (Write-Ahead Log) archiving enables point-in-time recovery — restore to any moment. Managed services (AWS RDS, Supabase) handle backups automatically. Most important rule: test your restores regularly — an untested backup is not a backup.',
    example: {
      code: `# PostgreSQL backup strategies

# 1. pg_dump — logical backup (SQL or custom format)
pg_dump -Fc -d mydb -U postgres > backup_$(date +%Y%m%d_%H%M%S).dump

# Restore
pg_restore -d mydb_restored backup_20241201_120000.dump

# 2. pg_basebackup — physical backup (for PITR)
pg_basebackup -D /backups/base -Ft -z -U replication

# 3. WAL archiving for point-in-time recovery
# postgresql.conf:
# wal_level = replica
# archive_mode = on
# archive_command = 'cp %p /archive/%f'
# (Or use pgBackRest, WAL-G for cloud storage)

# Node.js scheduled backup
import { exec } from 'child_process';
import { promisify } from 'util';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { createReadStream } from 'fs';

const execAsync = promisify(exec);

async function dailyBackup() {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const filename = \`backup_\${timestamp}.dump\`;
  const localPath = \`/tmp/\${filename}\`;

  // Create backup
  await execAsync(
    \`pg_dump -Fc -d "\${process.env.DATABASE_URL}" > \${localPath}\`
  );

  // Upload to S3
  const s3 = new S3Client({ region: 'us-east-1' });
  await s3.send(new PutObjectCommand({
    Bucket: process.env.BACKUP_BUCKET,
    Key: \`backups/\${filename}\`,
    Body: createReadStream(localPath),
    StorageClass: 'STANDARD_IA', // Cheaper for infrequent access
  }));

  // Keep only last 30 days in S3 (use lifecycle rule)
  console.log(\`Backup complete: \${filename}\`);
}

// Test restore quarterly
async function testRestore(backupKey: string) {
  await execAsync(\`pg_restore -d test_restore "\${backupKey}"\`);
  // Run integrity checks
  const result = await query('SELECT COUNT(*) FROM critical_table');
  console.log('Restore test passed:', result.rows[0].count, 'records');
}

# MongoDB backup
mongodump --uri="\${MONGODB_URI}" --out=/backups/$(date +%Y%m%d)
mongorestore --uri="\${MONGODB_URI}" /backups/20241201/`,
      language: 'bash',
    },
    interviewAnswer: 'The most important backup rule I follow: test your restores. I\'ve seen teams with years of automated backups discover on disaster day that they were all corrupt. I schedule quarterly restore tests in a separate environment. For production, I use managed backup services (AWS RDS automated backups with 30-day retention + S3 for long-term). WAL archiving gives point-in-time recovery which is critical — if someone runs DELETE without WHERE, you can recover to the moment before.',
    commonMistakes: [
      'Never testing restores',
      'Only keeping backups in the same region (region outage = lost backups)',
      'No monitoring on backup job failures',
    ],
    realWorldUse: 'Every production database. AWS RDS, Supabase, PlanetScale provide automated backups. Critical for compliance (SOC2, HIPAA).',
    followUpQuestions: ['What is WAL archiving?', 'What is the difference between RTO and RPO?'],
  },

  {
    id: 'db-orm-vs-raw-sql',
    category: 'database',
    type: 'theory',
    question: 'When should you use an ORM vs raw SQL?',
    difficulty: 'intermediate',
    tags: ['orm', 'raw-sql', 'prisma', 'drizzle', 'tradeoffs'],
    shortAnswer: 'Use ORM for: CRUD operations, type safety, migrations, rapid development. Use raw SQL for: complex queries, performance-critical paths, advanced features (window functions, CTEs, lateral joins), or when ORM generates inefficient queries.',
    detailedExplanation: 'ORMs (Prisma, Drizzle, Sequelize, TypeORM) improve developer experience — auto-generated types, relations handling, migration system. But they abstract away SQL, sometimes generating inefficient queries (N+1, missing indexes). Raw SQL gives full control but requires more boilerplate. The best approach: ORM for 80% of queries, raw SQL for complex analytics and performance-critical paths. Query builders (Knex, Drizzle) are a middle ground.',
    example: {
      code: `// ORM (Prisma) — clean, type-safe, handles relations
const users = await prisma.user.findMany({
  where: { active: true },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    },
  },
});
// ✅ Type-safe, readable, handles N+1 automatically

// Same query in raw SQL
const users = await prisma.$queryRaw<UserWithPosts[]>\`
  SELECT u.*, json_agg(
    json_build_object('id', p.id, 'title', p.title)
    ORDER BY p.created_at DESC
  ) FILTER (WHERE p.id IS NOT NULL) AS posts
  FROM users u
  LEFT JOIN posts p ON p.author_id = u.id AND p.published = true
  WHERE u.active = true
  GROUP BY u.id
  LIMIT 50
\`;
// More control, harder to maintain

// Complex analytics — raw SQL wins
const report = await prisma.$queryRaw\`
  WITH monthly_revenue AS (
    SELECT
      DATE_TRUNC('month', created_at) as month,
      SUM(amount) as revenue,
      COUNT(*) as orders
    FROM orders
    WHERE status = 'completed'
    GROUP BY 1
  ),
  ranked AS (
    SELECT *,
      RANK() OVER (ORDER BY revenue DESC) as rank,
      LAG(revenue) OVER (ORDER BY month) as prev_month_revenue
    FROM monthly_revenue
  )
  SELECT
    month,
    revenue,
    orders,
    rank,
    ROUND(((revenue - prev_month_revenue) / prev_month_revenue * 100)::numeric, 2) as growth_pct
  FROM ranked
  ORDER BY month DESC
  LIMIT 12
\`;
// Window functions, CTEs — ORM can't express this cleanly

// Drizzle ORM — type-safe query builder (middle ground)
const result = await db
  .select({
    userId: users.id,
    name: users.name,
    postCount: sql<number>\`count(\${posts.id})\`,
  })
  .from(users)
  .leftJoin(posts, eq(posts.authorId, users.id))
  .where(eq(users.active, true))
  .groupBy(users.id)
  .having(sql\`count(\${posts.id}) > 5\`);`,
      language: 'typescript',
    },
    interviewAnswer: 'I use Prisma for 80% of queries — CRUD, simple relations, pagination. When Prisma can\'t express what I need (complex CTEs, window functions, custom aggregations), I drop to $queryRaw. The key is knowing when the ORM is fighting you. If you\'re writing complex string manipulation to get the ORM to generate a specific query, just write the SQL. Drizzle is a good middle ground — it\'s a type-safe query builder that\'s closer to SQL than Prisma.',
    commonMistakes: [
      'Using ORM for everything including complex analytics (generates poor SQL)',
      'Never using ORM (reinventing schema management and type generation)',
      'Not checking what SQL the ORM actually generates (use logging)',
    ],
    realWorldUse: 'Most production apps use ORM for CRUD + raw SQL for analytics. Prisma has $queryRaw, Knex is a pure query builder alternative.',
    followUpQuestions: ['What is Drizzle ORM and how does it differ from Prisma?', 'How do you log the SQL queries Prisma generates?'],
  },

  {
    id: 'db-database-testing',
    category: 'database',
    type: 'theory',
    question: 'How do you test database interactions in a Node.js application?',
    difficulty: 'intermediate',
    tags: ['testing', 'database', 'jest', 'transactions', 'testcontainers'],
    shortAnswer: 'Three approaches: in-memory database (SQLite/mongomemory for unit tests), test database with transaction rollback (fast, isolated), or Testcontainers (real database in Docker for integration tests). Each trades speed for realism.',
    detailedExplanation: 'Testing strategies by fidelity: Unit tests mock the DB layer entirely (jest.mock). Integration tests use a real test DB — wrap each test in a transaction and roll it back after, so tests are isolated and fast. End-to-end tests use Testcontainers (spins up real PostgreSQL/MongoDB in Docker) for maximum realism. The transaction rollback pattern is the sweet spot for most apps.',
    example: {
      code: `// Option 1: Mock the database (unit tests)
jest.mock('../lib/prisma', () => ({
  prisma: { user: { create: jest.fn(), findMany: jest.fn() } }
}));

// Option 2: Transaction rollback (integration tests — best balance)
import { prisma } from '../lib/prisma';

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('UserService', () => {
  let transaction: Awaited<ReturnType<typeof prisma.$transaction>>;

  beforeEach(async () => {
    // Start transaction — all writes will be rolled back
    await prisma.$executeRaw\`BEGIN\`;
  });

  afterEach(async () => {
    // Rollback — leaves DB clean for next test
    await prisma.$executeRaw\`ROLLBACK\`;
  });

  it('creates a user', async () => {
    const user = await createUser({ name: 'Alex', email: 'alex@test.com' });
    expect(user.id).toBeDefined();

    // Can query within the same transaction
    const found = await prisma.user.findUnique({ where: { id: user.id } });
    expect(found?.name).toBe('Alex');
    // Rolled back after test — no cleanup needed
  });
});

// Option 3: Testcontainers (real DB in Docker)
import { PostgreSqlContainer } from '@testcontainers/postgresql';

let container: StartedPostgreSqlContainer;

beforeAll(async () => {
  container = await new PostgreSqlContainer('postgres:16-alpine')
    .withDatabase('testdb')
    .withUsername('test')
    .withPassword('test')
    .start();

  // Run migrations against test container
  process.env.DATABASE_URL = container.getConnectionUri();
  await prisma.$executeRaw\`...\`; // or run migrations
});

afterAll(async () => {
  await container.stop();
});

// Seed helpers for readable tests
async function createTestUser(overrides = {}) {
  return prisma.user.create({
    data: {
      name: 'Test User',
      email: \`test-\${Date.now()}@example.com\`,
      ...overrides,
    },
  });
}`,
      language: 'typescript',
    },
    interviewAnswer: 'The transaction rollback pattern is my default for integration tests — it uses a real database with real SQL but rolls back after each test so there\'s no state to clean up. Much faster than recreating the database or deleting test data. For CI/CD, Testcontainers gives you a fresh PostgreSQL instance per test run — no shared test database contention. I avoid in-memory SQLite for PostgreSQL apps because the SQL dialects differ and you miss PostgreSQL-specific bugs.',
    commonMistakes: [
      'Shared test database with no cleanup (test order dependency)',
      'Using SQLite to test PostgreSQL-specific queries',
      'Not seeding deterministic test data (flaky tests)',
    ],
    realWorldUse: 'Every Node.js app with a database. CI/CD pipelines run integration tests against real databases via Testcontainers or GitHub Actions services.',
    followUpQuestions: ['What is Testcontainers?', 'How do you run database migrations in tests?'],
  },

  {
    id: 'db-mongodb-advanced-aggregation',
    category: 'database',
    type: 'theory',
    question: 'What are advanced MongoDB aggregation pipeline techniques?',
    difficulty: 'advanced',
    tags: ['mongodb', 'aggregation', 'pipeline', 'advanced'],
    shortAnswer: 'Advanced techniques: $facet (multiple pipelines in one query), $graphLookup (recursive graph traversal), $bucket/$bucketAuto (histogram), $merge (write results to collection), $setWindowFields (window functions like SQL), and $densify (fill time series gaps).',
    detailedExplanation: '$facet runs multiple independent aggregation pipelines on the same input documents, perfect for building faceted search with counts. $graphLookup traverses graph data recursively — finding all reports in an org chart. $setWindowFields brings SQL-style window functions to MongoDB. $merge writes aggregation results to a collection for materialised views. $densify fills missing dates/values in time series.',
    example: {
      code: `// $facet — multiple aggregations in one query (faceted search)
db.products.aggregate([
  { $match: { category: 'electronics' } },
  {
    $facet: {
      // Facet 1: price buckets
      byPrice: [
        { $bucket: {
          groupBy: '$price',
          boundaries: [0, 50, 100, 250, 500, 1000],
          default: '1000+',
          output: { count: { $sum: 1 }, avgRating: { $avg: '$rating' } }
        }}
      ],
      // Facet 2: by brand
      byBrand: [
        { $group: { _id: '$brand', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ],
      // Facet 3: total and stats
      stats: [
        { $group: {
          _id: null,
          total: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }}
      ]
    }
  }
]);

// $graphLookup — recursive graph traversal (org chart)
db.employees.aggregate([
  { $match: { name: 'CEO' } },
  {
    $graphLookup: {
      from: 'employees',
      startWith: '$_id',
      connectFromField: '_id',
      connectToField: 'managerId',
      as: 'reports',
      maxDepth: 3,  // Max 3 levels deep
      depthField: 'depth'
    }
  }
]);
// Returns CEO + all direct/indirect reports (up to 3 levels)

// $setWindowFields — window functions (MongoDB 5.0+)
db.orders.aggregate([
  {
    $setWindowFields: {
      partitionBy: '$userId',        // GROUP BY equivalent
      sortBy: { createdAt: 1 },
      output: {
        runningTotal: {
          $sum: '$amount',
          window: { documents: ['unbounded', 'current'] }
        },
        rank: {
          $rank: {}
        },
        movingAvg: {
          $avg: '$amount',
          window: { documents: [-6, 0] }  // 7-day moving average
        }
      }
    }
  }
]);

// $merge — materialised view (write results to collection)
db.orders.aggregate([
  { $group: {
    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
    revenue: { $sum: '$amount' },
    count: { $sum: 1 }
  }},
  { $merge: {
    into: 'monthly_revenue',    // Target collection
    on: '_id',
    whenMatched: 'replace',
    whenNotMatched: 'insert'
  }}
]);
// Schedule this to run hourly for pre-computed reports`,
      language: 'javascript',
    },
    interviewAnswer: '$facet is the feature I show teams who are used to running multiple queries for a product listing page. Instead of three separate aggregations for price buckets, brand counts, and totals, one $facet query returns all three. $graphLookup is powerful for org charts and category hierarchies — it follows references recursively which would require multiple queries in SQL. $setWindowFields brings window function capability that was a key advantage of SQL over MongoDB.',
    commonMistakes: [
      'Running $facet with expensive stages before it (runs once on all input, then splits)',
      '$graphLookup without maxDepth on circular graphs (infinite loop)',
      'Not indexing the connectFromField and connectToField in $graphLookup',
    ],
    realWorldUse: 'Faceted search (e-commerce filters), org chart traversal, time-series analysis, materialised view refresh.',
    followUpQuestions: ['How does $facet affect performance?', 'What is $densify used for?'],
  },

  {
    id: 'db-full-text-search',
    category: 'database',
    type: 'theory',
    question: 'How do you implement full-text search in PostgreSQL vs dedicated search engines?',
    difficulty: 'intermediate',
    tags: ['full-text-search', 'postgresql', 'elasticsearch', 'meilisearch'],
    shortAnswer: 'PostgreSQL FTS (tsvector/tsquery with GIN index) handles millions of documents well — no extra infrastructure. Use Elasticsearch/MeiliSearch/Typesense when you need: relevance ranking, facets, autocomplete, multilingual support, or real-time search at billions of rows.',
    detailedExplanation: 'PostgreSQL FTS: convert text to tsvector (lexemes), query with tsquery, rank with ts_rank/ts_rank_cd. Advantages: no extra service, transactional consistency, ACID guarantees. Limitations: basic ranking, no typo tolerance, harder to tune. Elasticsearch: inverted index, powerful ranking, aggregations, but eventual consistency and operational overhead. MeiliSearch/Typesense: simpler, typo-tolerant, great DX, cloud options.',
    example: {
      code: `-- PostgreSQL full-text search

-- Setup: generated tsvector column (auto-updated)
ALTER TABLE articles ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(tags::text, '')), 'C')
  ) STORED;

-- GIN index for fast search
CREATE INDEX idx_articles_search ON articles USING GIN (search_vector);

-- Basic search
SELECT id, title, ts_rank(search_vector, query) AS rank
FROM articles, to_tsquery('english', 'postgresql & performance') query
WHERE search_vector @@ query
ORDER BY rank DESC
LIMIT 20;

-- Phrase search
WHERE search_vector @@ phraseto_tsquery('english', 'full text search');

-- Prefix search (for autocomplete)
WHERE search_vector @@ to_tsquery('english', 'postgre:*');

-- Highlighted results
SELECT id, title,
  ts_headline('english', content, query,
    'MaxFragments=3, MaxWords=20, MinWords=5'
  ) AS excerpt
FROM articles, to_tsquery('english', 'search & performance') query
WHERE search_vector @@ query;

-- MeiliSearch example (Node.js — better UX, typo tolerance)
import MeiliSearch from 'meilisearch';

const client = new MeiliSearch({ host: 'http://localhost:7700' });
const index = client.index('articles');

// Index documents
await index.addDocuments(articles);

// Configure for relevance
await index.updateSettings({
  searchableAttributes: ['title', 'content', 'tags'],
  rankingRules: ['words', 'typo', 'proximity', 'attribute', 'sort', 'exactness'],
  typoTolerance: { enabled: true, minWordSizeForTypos: { oneTypo: 4 } },
});

// Search with typo tolerance + facets
const results = await index.search('posgresql performance', { // typo in query!
  limit: 20,
  facets: ['category', 'author'],
  filter: 'published = true',
  highlightPreTag: '<mark>',
  highlightPostTag: '</mark>',
});`,
      language: 'sql',
    },
    interviewAnswer: 'I start with PostgreSQL FTS — it handles millions of documents, zero extra infrastructure, and searches are transactionally consistent with your data. Most apps don\'t need more. When I need typo tolerance (users searching "javascirpt"), real-time facets, or search beyond a few million documents, I add MeiliSearch or Typesense. Elasticsearch is powerful but operationally complex — usually overkill unless you\'re at very large scale.',
    commonMistakes: [
      'Using ILIKE/LIKE for search (table scan, no ranking)',
      'Adding Elasticsearch before testing PostgreSQL FTS',
      'Not keeping search index in sync with database changes',
    ],
    realWorldUse: 'Documentation sites, blog search, e-commerce product search, SaaS search bars.',
    followUpQuestions: ['What is an inverted index?', 'How do you keep Elasticsearch in sync with PostgreSQL?'],
  },

  {
    id: 'db-time-series',
    category: 'database',
    type: 'theory',
    question: 'How do you handle time-series data efficiently in databases?',
    difficulty: 'advanced',
    tags: ['time-series', 'partitioning', 'timescaledb', 'influxdb'],
    shortAnswer: 'Time-series data (sensor readings, metrics, logs) has special characteristics: append-only, queried by time range, often aggregated. Use table partitioning by time range, appropriate indexes on timestamp, retention policies for old data, and consider TimescaleDB for PostgreSQL.',
    detailedExplanation: 'Time-series challenges: high write volume, range queries, retention (delete old data), aggregations (avg over last hour). Solutions: partition tables by time range (monthly/daily) so old partitions can be dropped efficiently. Use BRIN indexes (block range) for time columns — more efficient than B-tree for sequential data. TimescaleDB adds hypertables that handle partitioning automatically. InfluxDB is purpose-built.',
    example: {
      code: `-- PostgreSQL table partitioning for time-series
CREATE TABLE metrics (
  time TIMESTAMPTZ NOT NULL,
  device_id VARCHAR(50),
  metric_name VARCHAR(100),
  value DOUBLE PRECISION
) PARTITION BY RANGE (time);

-- Create monthly partitions
CREATE TABLE metrics_2024_01 PARTITION OF metrics
  FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE metrics_2024_02 PARTITION OF metrics
  FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- BRIN index efficient for time-ordered data
CREATE INDEX ON metrics_2024_01 USING BRIN (time);

-- Automated partition creation (via pg_partman extension)
SELECT partman.create_parent(
  p_parent_table => 'public.metrics',
  p_control => 'time',
  p_type => 'range',
  p_interval => '1 month',
  p_premake => 3
);

-- Efficient time-range queries (only scans relevant partition)
SELECT
  DATE_TRUNC('hour', time) AS hour,
  device_id,
  AVG(value) AS avg_value,
  MAX(value) AS max_value
FROM metrics
WHERE
  time >= NOW() - INTERVAL '24 hours'
  AND device_id = 'sensor-001'
GROUP BY 1, 2
ORDER BY 1 DESC;

-- Drop old partitions (retention policy)
DROP TABLE metrics_2023_01; -- Instant! No row deletion

-- TimescaleDB (PostgreSQL extension)
SELECT create_hypertable('metrics', 'time',
  chunk_time_interval => INTERVAL '1 day'
);

-- Continuous aggregates (pre-computed rollups)
CREATE MATERIALIZED VIEW hourly_metrics
WITH (timescaledb.continuous) AS
SELECT
  time_bucket('1 hour', time) AS bucket,
  device_id,
  AVG(value) AS avg_val
FROM metrics
GROUP BY 1, 2;

-- Auto-refresh policy
SELECT add_continuous_aggregate_policy('hourly_metrics',
  start_offset => INTERVAL '3 hours',
  end_offset => INTERVAL '1 hour',
  schedule_interval => INTERVAL '30 minutes'
);`,
      language: 'sql',
    },
    interviewAnswer: 'Time-series data breaks normal database assumptions — it\'s mostly append-only, queried by time range, and you need to delete old data efficiently. Partitioning by time range is the key technique: queries only scan relevant partitions, and dropping an old month is instantaneous compared to deleting millions of rows. TimescaleDB wraps this in a nicer API and adds continuous aggregates for pre-computed time buckets.',
    commonMistakes: [
      'Storing time-series in a regular table (range queries become full scans)',
      'Deleting old records one by one instead of dropping partitions',
      'Using B-tree index on timestamp (BRIN is more efficient for sequential data)',
    ],
    realWorldUse: 'IoT sensor data, application metrics, financial tick data, server logs, user activity tracking.',
    followUpQuestions: ['What is TimescaleDB?', 'What is the difference between a BRIN and B-tree index?'],
  },

  {
    id: 'db-multitenancy',
    category: 'database',
    type: 'theory',
    question: 'What are the database strategies for multi-tenant SaaS applications?',
    difficulty: 'advanced',
    tags: ['multi-tenancy', 'saas', 'row-level-security', 'schema-isolation'],
    shortAnswer: 'Three strategies: (1) separate database per tenant (strongest isolation, expensive), (2) separate schema per tenant (good isolation, moderate cost), (3) shared tables with tenant_id column + Row Level Security (cheapest, most complex). Choose based on isolation requirements and tenant count.',
    detailedExplanation: 'Database multi-tenancy is a fundamental SaaS architecture decision. Separate databases: each tenant has their own database — maximum isolation, easy data deletion (GDPR), but expensive at scale (1000 tenants = 1000 databases). Separate schemas: one database, one schema per tenant — good isolation, moderate overhead. Shared tables with tenant_id: all tenants in same tables, use Row Level Security to prevent cross-tenant access — most efficient but requires disciplined development.',
    example: {
      code: `-- Strategy 3: Shared tables with Row Level Security (PostgreSQL)

-- Add tenant_id to all tables
ALTER TABLE users ADD COLUMN tenant_id UUID NOT NULL;
ALTER TABLE orders ADD COLUMN tenant_id UUID NOT NULL;

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: each user can only see their own tenant's data
CREATE POLICY tenant_isolation ON users
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation ON orders
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Set tenant context for each request
-- In Node.js middleware:
async function setTenantContext(tenantId: string) {
  await prisma.$executeRaw\`
    SELECT set_config('app.current_tenant_id', \${tenantId}, TRUE)
  \`;
}

-- Now all queries automatically filter by tenant
const users = await prisma.user.findMany(); // Only returns tenant's users

-- Strategy 2: Schema per tenant (Prisma example)
// Each tenant gets schema: tenant_abc123, tenant_def456

async function getTenantPrisma(tenantId: string) {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL?.replace('?schema=public', \`?schema=tenant_\${tenantId}\`)
      }
    }
  });
}

-- Strategy 1: Database per tenant
const tenantDbMap = new Map();

async function getTenantDb(tenantId: string) {
  if (!tenantDbMap.has(tenantId)) {
    const tenant = await getTenantConfig(tenantId);
    tenantDbMap.set(tenantId, new PrismaClient({
      datasources: { db: { url: tenant.databaseUrl } }
    }));
  }
  return tenantDbMap.get(tenantId);
}

-- Compound indexes for multi-tenant queries
CREATE INDEX idx_users_tenant ON users(tenant_id, email);
CREATE INDEX idx_orders_tenant ON orders(tenant_id, created_at DESC);`,
      language: 'sql',
    },
    interviewAnswer: 'For most SaaS apps I recommend shared tables with Row Level Security — it\'s operationally simple and scales to thousands of tenants. RLS ensures even a bug in your application code can\'t accidentally expose cross-tenant data. The key is setting the tenant context at the start of every database session. For high-compliance customers (banks, healthcare) who need data isolation guarantees, separate databases are worth the cost.',
    commonMistakes: [
      'Forgetting tenant_id on every table (data leaks)',
      'No compound index on (tenant_id, ...) (all queries are slow)',
      'Missing RLS policy on new tables added later',
    ],
    realWorldUse: 'Every SaaS application — CRM, project management, HR systems. Neon and Supabase both support RLS natively.',
    followUpQuestions: ['What is Row Level Security?', 'How do you handle database migrations across hundreds of tenant schemas?'],
  },

  {
    id: 'db-vector-search',
    category: 'database',
    type: 'theory',
    question: 'What is vector search and how is it used with AI/LLM applications?',
    difficulty: 'advanced',
    tags: ['vector-search', 'embeddings', 'pgvector', 'ai', 'llm'],
    shortAnswer: 'Vector search finds semantically similar items using mathematical distance between high-dimensional vectors (embeddings). Used for semantic search, recommendation engines, and RAG (Retrieval-Augmented Generation) with LLMs. pgvector adds vector support to PostgreSQL.',
    detailedExplanation: 'Embeddings are numerical representations of meaning — similar concepts have similar vectors. OpenAI\'s text-embedding-ada-002 creates 1536-dimensional vectors. pgvector extension adds a vector column type and similarity search operators (<-> cosine distance, <=> L2 distance). Index with IVFFlat or HNSW for fast approximate nearest-neighbor search. RAG pattern: embed documents → store in vector DB → embed user query → find similar documents → send context + query to LLM.',
    example: {
      code: `-- pgvector extension
CREATE EXTENSION vector;

-- Store embeddings alongside content
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  content TEXT,
  embedding vector(1536),  -- OpenAI ada-002 dimension
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HNSW index for fast approximate search
CREATE INDEX ON documents
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Node.js: embed and store documents
import OpenAI from 'openai';
const openai = new OpenAI();

async function embedAndStore(content: string, metadata: object) {
  // Get embedding from OpenAI
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: content,
  });
  const embedding = response.data[0].embedding; // 1536 numbers

  // Store in PostgreSQL with pgvector
  await prisma.$executeRaw\`
    INSERT INTO documents (content, embedding, metadata)
    VALUES (\${content}, \${JSON.stringify(embedding)}::vector, \${metadata})
  \`;
}

// Semantic search — find similar documents
async function semanticSearch(query: string, limit = 5) {
  const queryEmbedding = await getEmbedding(query);

  const results = await prisma.$queryRaw<SearchResult[]>\`
    SELECT
      id,
      content,
      metadata,
      1 - (embedding <=> \${JSON.stringify(queryEmbedding)}::vector) AS similarity
    FROM documents
    ORDER BY embedding <=> \${JSON.stringify(queryEmbedding)}::vector
    LIMIT \${limit}
  \`;

  return results; // Most similar documents first
}

// RAG (Retrieval Augmented Generation) pattern
async function askQuestion(userQuestion: string) {
  // 1. Find relevant documents
  const relevantDocs = await semanticSearch(userQuestion, 5);

  // 2. Build context from relevant docs
  const context = relevantDocs.map(d => d.content).join('\n\n');

  // 3. Ask LLM with context
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: \`Answer based on this context:\n\${context}\` },
      { role: 'user', content: userQuestion },
    ],
  });

  return response.choices[0].message.content;
}`,
      language: 'typescript',
    },
    interviewAnswer: 'Vector search is fundamental to AI-powered features. The RAG pattern is how you build a "chat with your docs" feature — embed your knowledge base, embed the user\'s question, find the most semantically similar documents, and send those as context to the LLM. pgvector makes this possible without a separate vector database service. For production scale, Pinecone or Qdrant are purpose-built vector databases with better performance at large scale.',
    commonMistakes: [
      'Not using an index (vector search without HNSW is O(n) — very slow)',
      'Using L2 distance when cosine similarity is more appropriate for embeddings',
      'Embedding at query time without caching (slow and expensive)',
    ],
    realWorldUse: 'Semantic search, RAG chatbots, recommendation engines, duplicate detection, image search.',
    followUpQuestions: ['What is the difference between semantic search and keyword search?', 'What is RAG (Retrieval Augmented Generation)?'],
  },
];
