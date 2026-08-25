import type { MongodbLesson } from '../mongodb-curriculum';

export const mongodbRelationshipsLesson: MongodbLesson = {
  id: 'mongodb-relationships',
  title: 'Data Relationships',
  slug: 'relationships',
  chapter: 'advanced',
  order: 9,
  difficulty: 'advanced',
  readingTime: 13,
  description: 'Modeling relationships - embedded vs referenced documents, one-to-many, many-to-many, and population.',
  sections: [
    {
      type: 'text',
      content: 'MongoDB supports two ways to model relationships: embedding related data within a document, or referencing other documents with ObjectIds. The choice depends on data access patterns, update frequency, and data size.',
    },
    {
      type: 'heading',
      content: 'Embedded Documents (Denormalization)',
    },
    {
      type: 'example',
      title: 'Embedding related data',
      language: 'javascript',
      code: `// One-to-few: embed addresses in user document
{
  _id: ObjectId("..."),
  name: "Alice Johnson",
  email: "alice@example.com",
  addresses: [
    {
      type: "home",
      street: "123 Main St",
      city: "Boston",
      zip: "02101"
    },
    {
      type: "work",
      street: "456 Office Blvd",
      city: "Cambridge",
      zip: "02139"
    }
  ]
}

// Benefits:
// - Single query to get all data
// - Atomic updates (all or nothing)
// - Better read performance

// Drawbacks:
// - Data duplication if shared
// - Document can grow (16MB limit)
// - Hard to query embedded data independently`,
    },
    {
      type: 'example',
      title: 'When to embed documents',
      language: 'javascript',
      code: `// EMBED when:
// 1. One-to-few relationship (user has 2-3 addresses)
// 2. Data is accessed together
// 3. Data does not change often
// 4. Need atomic updates

// User with orders (few orders per user)
{
  _id: 1,
  name: "Alice",
  recentOrders: [
    { orderId: "ORD-001", total: 99.99, date: "2024-03-20" },
    { orderId: "ORD-002", total: 149.50, date: "2024-03-18" }
  ]
}

// Blog post with comments (moderate number)
{
  _id: 1,
  title: "MongoDB Guide",
  content: "...",
  comments: [
    { user: "Bob", text: "Great post!", date: "2024-03-20" },
    { user: "Carol", text: "Very helpful", date: "2024-03-21" }
  ]
}`,
    },
    {
      type: 'heading',
      content: 'Referenced Documents (Normalization)',
    },
    {
      type: 'example',
      title: 'Referencing with ObjectIds',
      language: 'javascript',
      code: `// One-to-many: reference users from orders
// Users collection
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "Alice Johnson",
  email: "alice@example.com"
}

// Orders collection
{
  _id: ObjectId("507f1f77bcf86cd799439012"),
  orderNumber: "ORD-001",
  userId: ObjectId("507f1f77bcf86cd799439011"),  // reference
  total: 299.99,
  items: [...]
}

// Query with manual join
const order = await db.orders.findOne({ orderNumber: "ORD-001" });
const user = await db.users.findOne({ _id: order.userId });

// Benefits:
// - No data duplication
// - Smaller documents
// - Can query independently
// - Easy to update (one place)

// Drawbacks:
// - Multiple queries needed
// - Application-level joins
// - Slower reads`,
    },
    {
      type: 'example',
      title: 'When to reference documents',
      language: 'javascript',
      code: `// REFERENCE when:
// 1. One-to-many relationship (user has 1000+ orders)
// 2. Many-to-many relationship
// 3. Data is accessed independently
// 4. Data changes frequently
// 5. Document would exceed 16MB

// E-commerce: separate collections
// Products (referenced by many orders)
{
  _id: ObjectId("prod123"),
  name: "Laptop",
  price: 1299,
  stock: 50
}

// Orders (reference products)
{
  _id: ObjectId("order456"),
  customerId: ObjectId("cust789"),
  items: [
    { productId: ObjectId("prod123"), quantity: 1 },
    { productId: ObjectId("prod124"), quantity: 2 }
  ]
}`,
    },
    {
      type: 'heading',
      content: 'One-to-Many Relationships',
    },
    {
      type: 'example',
      title: 'One-to-many patterns',
      language: 'javascript',
      code: `// Pattern 1: Child references parent (one-to-many)
// User collection
{ _id: ObjectId("user1"), name: "Alice" }

// Posts collection (many posts per user)
{ _id: ObjectId("post1"), title: "First Post", userId: ObjectId("user1") }
{ _id: ObjectId("post2"), title: "Second Post", userId: ObjectId("user1") }

// Find user's posts
db.posts.find({ userId: ObjectId("user1") })

// Pattern 2: Parent references children (one-to-few)
// User collection (stores post IDs)
{
  _id: ObjectId("user1"),
  name: "Alice",
  postIds: [ObjectId("post1"), ObjectId("post2"), ObjectId("post3")]
}

// Find posts by IDs
db.posts.find({ _id: { $in: user.postIds } })

// Use child-references-parent for one-to-many
// Use parent-references-children for one-to-few`,
    },
    {
      type: 'heading',
      content: 'Many-to-Many Relationships',
    },
    {
      type: 'example',
      title: 'Many-to-many patterns',
      language: 'javascript',
      code: `// Students and Courses (many-to-many)

// Pattern 1: Array of references in both collections
// Students collection
{
  _id: ObjectId("student1"),
  name: "Alice",
  courseIds: [ObjectId("course1"), ObjectId("course2")]
}

// Courses collection
{
  _id: ObjectId("course1"),
  title: "MongoDB Basics",
  studentIds: [ObjectId("student1"), ObjectId("student2")]
}

// Pattern 2: Junction collection (like SQL)
// Students collection
{ _id: ObjectId("student1"), name: "Alice" }

// Courses collection
{ _id: ObjectId("course1"), title: "MongoDB Basics" }

// Enrollments collection (junction)
{
  _id: ObjectId("enroll1"),
  studentId: ObjectId("student1"),
  courseId: ObjectId("course1"),
  enrolledDate: ISODate("2024-03-20"),
  grade: "A"
}

// Query: Find courses for student
db.enrollments.find({ studentId: ObjectId("student1") })

// Use junction collection when you need metadata about relationship`,
    },
    {
      type: 'heading',
      content: 'Mongoose Population',
    },
    {
      type: 'example',
      title: 'Population (automatic reference resolution)',
      language: 'javascript',
      code: `// Define schemas with references
const userSchema = new mongoose.Schema({
  name: String,
  email: String
});

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'  // reference to User model
  },
  comments: [{
    text: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);

// Without population (just IDs)
const post = await Post.findById(postId);
// post.author = ObjectId("...")

// With population (full user object)
const post = await Post.findById(postId).populate('author');
// post.author = { _id: ObjectId("..."), name: "Alice", email: "..." }

// Populate specific fields
const post = await Post.findById(postId)
  .populate('author', 'name email');  // only name and email

// Populate multiple paths
const post = await Post.findById(postId)
  .populate('author')
  .populate('comments.user');

// Populate with conditions
const posts = await Post.find()
  .populate({
    path: 'author',
    match: { isActive: true },
    select: 'name email'
  });`,
    },
    {
      type: 'table',
      title: 'Embed vs Reference Decision Guide',
      headers: ['Factor', 'Embed', 'Reference'],
      rows: [
        ['Relationship', 'One-to-few', 'One-to-many, many-to-many'],
        ['Data Access', 'Always together', 'Sometimes separate'],
        ['Update Frequency', 'Rarely changes', 'Changes frequently'],
        ['Data Size', 'Small, bounded', 'Large, unbounded'],
        ['Atomicity', 'Need atomic updates', 'OK with eventual consistency'],
        ['Duplication', 'Acceptable', 'Avoid duplication'],
        ['Query Pattern', 'Single document reads', 'Independent queries'],
      ],
    },
    {
      type: 'note',
      title: 'Hybrid Approach',
      content: 'You can combine embedding and referencing. For example, embed frequently accessed fields (name, email) but reference the full document for detailed views. Store both a reference and a subset of embedded data for optimal performance.',
    },
    {
      type: 'tryit',
      title: 'Relationship Pattern Simulator',
      css: `body{font-family:system-ui,sans-serif;padding:16px;margin:0;background:linear-gradient(135deg,#001E2B 0%,#003d4d 100%);}
.container{max-width:850px;margin:0 auto;}
.header{text-align:center;color:#00ED64;font-size:26px;font-weight:700;margin-bottom:8px;}
.subtitle{text-align:center;color:#fff;font-size:13px;margin-bottom:14px;}
.card{background:#fff;border-radius:10px;padding:18px;margin-bottom:12px;box-shadow:0 4px 20px rgba(0,237,100,0.2);}
.label{font-weight:600;color:#001E2B;font-size:14px;margin-bottom:8px;}
.btn-row{display:flex;gap:10px;margin-bottom:12px;}
.btn{background:#00ED64;color:#001E2B;border:none;padding:12px 18px;border-radius:8px;cursor:pointer;font-weight:700;font-size:13px;flex:1;}
.btn:hover{background:#00ff70;transform:translateY(-1px);}
.output{background:#f8f9fa;border:2px solid #00ED64;border-radius:8px;padding:14px;font-family:monospace;font-size:12px;line-height:1.7;white-space:pre;overflow-x:auto;}
.metric{background:#fff;border-left:4px solid #00ED64;padding:8px;margin:6px 0;border-radius:4px;}
.metric-label{font-weight:700;color:#001E2B;}
.metric-value{color:#334155;}`,
      js: `function showPattern(type) {
  var result = '';
  
  if (type === 'embedded') {
    result = '// EMBEDDED PATTERN\ \ ' +
      '// User document with embedded addresses\ ' +
      '{\ ' +
      '  _id: ObjectId("user1"),\ ' +
      '  name: "Alice Johnson",\ ' +
      '  email: "alice@example.com",\ ' +
      '  addresses: [\ ' +
      '    { type: "home", city: "Boston", zip: "02101" },\ ' +
      '    { type: "work", city: "Cambridge", zip: "02139" }\ ' +
      '  ]\ ' +
      '}\ \ ' +
      '// Query (1 operation):\ ' +
      'db.users.findOne({ _id: ObjectId("user1") })\ \ ' +
      'Metrics:\ ' +
      '- Queries needed: 1\ ' +
      '- Data duplication: None\ ' +
      '- Best for: One-to-few, data accessed together';
  } else if (type === 'referenced') {
    result = '// REFERENCED PATTERN\ \ ' +
      '// Users collection\ ' +
      '{ _id: ObjectId("user1"), name: "Alice" }\ \ ' +
      '// Orders collection\ ' +
      '{ _id: ObjectId("ord1"), userId: ObjectId("user1"), total: 299 }\ ' +
      '{ _id: ObjectId("ord2"), userId: ObjectId("user1"), total: 149 }\ \ ' +
      '// Query (2 operations):\ ' +
      'const user = db.users.findOne({ _id: ObjectId("user1") })\ ' +
      'const orders = db.orders.find({ userId: ObjectId("user1") })\ \ ' +
      'Metrics:\ ' +
      '- Queries needed: 2\ ' +
      '- Data duplication: None\ ' +
      '- Best for: One-to-many, large collections';
  } else if (type === 'manytomany') {
    result = '// MANY-TO-MANY PATTERN\ \ ' +
      '// Students collection\ ' +
      '{ _id: ObjectId("s1"), name: "Alice" }\ \ ' +
      '// Courses collection\ ' +
      '{ _id: ObjectId("c1"), title: "MongoDB 101" }\ \ ' +
      '// Enrollments (junction)\ ' +
      '{ studentId: ObjectId("s1"), courseId: ObjectId("c1"), grade: "A" }\ \ ' +
      '// Find student courses:\ ' +
      'const enrollments = db.enrollments.find({ studentId: ObjectId("s1") })\ ' +
      'const courseIds = enrollments.map(e => e.courseId)\ ' +
      'const courses = db.courses.find({ _id: { $in: courseIds } })\ \ ' +
      'Metrics:\ ' +
      '- Queries needed: 3\ ' +
      '- Data duplication: None\ ' +
      '- Best for: Many-to-many with metadata';
  }
  
  document.getElementById('output').textContent = result;
}

document.getElementById('output').innerHTML =
  '<div class="container">' +
  '<div class="header">Relationship Patterns</div>' +
  '<div class="subtitle">Explore different ways to model data relationships</div>' +
  '<div class="card">' +
  '<div class="label">Choose a pattern:</div>' +
  '<div class="btn-row">' +
  '<button class="btn" onclick="showPattern(\&apos;embedded\&apos;)">Embedded</button>' +
  '<button class="btn" onclick="showPattern(\&apos;referenced\&apos;)">Referenced</button>' +
  '<button class="btn" onclick="showPattern(\&apos;manytomany\&apos;)">Many-to-Many</button>' +
  '</div>' +
  '<pre id="output" class="output">Click a button to see relationship pattern examples...</pre>' +
  '</div>' +
  '</div>';

window.showPattern = showPattern;`,
    },
  ],
  exercises: [
    {
      id: 'mongodb-rel-1',
      question: 'When should you embed documents instead of referencing?',
      type: 'multiple-choice',
      options: [
        'When you have thousands of related documents',
        'When data is accessed together and relationships are one-to-few',
        'When data changes frequently',
        'Always embed for better performance',
      ],
      correct: 1,
      explanation: 'Embed documents when: the relationship is one-to-few, data is accessed together, updates are infrequent, and you need atomic updates. Embedding avoids multiple queries but can cause data duplication and large documents.',
    },
    {
      id: 'mongodb-rel-2',
      question: 'What is the purpose of a junction collection in many-to-many relationships?',
      type: 'multiple-choice',
      options: [
        'To make queries faster',
        'To store metadata about the relationship',
        'To automatically sync data',
        'To reduce database size',
      ],
      correct: 1,
      explanation: 'A junction collection stores the relationships between two collections and can include metadata (enrollment date, grade, status). Without metadata, you can store arrays of references in both collections.',
    },
  ],
  quiz: [
    {
      id: 'mongodb-rel-q1',
      question: 'What does Mongoose populate() do?',
      options: [
        'Inserts multiple documents',
        'Automatically resolves references and replaces ObjectIds with actual documents',
        'Validates document structure',
        'Creates indexes',
      ],
      correct: 1,
      explanation: 'populate() is Mongoose method that automatically queries referenced documents and replaces ObjectId references with the actual document data, similar to a SQL JOIN.',
    },
  ],
};
