import type { MongodbLesson } from '../mongodb-curriculum';

export const mongodbAggregationLesson: MongodbLesson = {
  id: 'mongodb-aggregation',
  title: 'Aggregation Pipeline',
  slug: 'aggregation',
  chapter: 'advanced',
  order: 7,
  difficulty: 'intermediate',
  readingTime: 16,
  description: 'Aggregation pipeline stages - $match, $group, $project, $sort, $lookup, and complex data transformations.',
  sections: [
    {
      type: 'text',
      content: 'The aggregation pipeline processes documents through multiple stages, transforming data step by step. Each stage performs an operation (filter, group, sort, transform) and passes results to the next stage. Aggregation is powerful for analytics, reports, and complex queries.',
    },
    {
      type: 'analogy',
      title: 'Pipeline like assembly line',
      content: 'Imagine documents moving through a factory assembly line. Each station (stage) performs one task: filtering defective items, grouping by color, sorting by size, packaging. Documents flow through stages sequentially, being transformed at each step.',
    },
    {
      type: 'heading',
      content: 'Basic Pipeline Stages',
    },
    {
      type: 'example',
      title: '$match - Filter documents',
      language: 'javascript',
      code: `// $match filters documents (like find)
db.orders.aggregate([
  { $match: { status: "completed" } }
])

// Multiple conditions
db.orders.aggregate([
  { $match: { 
    status: "completed",
    total: { $gte: 100 }
  }}
])

// Best practice: use $match early to reduce documents
db.orders.aggregate([
  { $match: { status: "completed" } },  // filter first
  { $group: { _id: "$customerId", totalSpent: { $sum: "$total" } } }
])`,
    },
    {
      type: 'example',
      title: '$project - Select and transform fields',
      language: 'javascript',
      code: `// Include/exclude fields (1 = include, 0 = exclude)
db.users.aggregate([
  { $project: { name: 1, email: 1, _id: 0 } }
])

// Computed fields
db.orders.aggregate([
  { $project: {
    orderId: 1,
    total: 1,
    tax: { $multiply: ["$total", 0.1] },
    grandTotal: { $add: ["$total", { $multiply: ["$total", 0.1] }] }
  }}
])

// Rename fields
db.users.aggregate([
  { $project: {
    fullName: "$name",
    emailAddress: "$email"
  }}
])

// String operations
db.users.aggregate([
  { $project: {
    name: 1,
    upperName: { $toUpper: "$name" },
    nameLength: { $strLenCP: "$name" }
  }}
])`,
    },
    {
      type: 'heading',
      content: '$group - Aggregation Operations',
    },
    {
      type: 'example',
      title: '$group with accumulator operators',
      language: 'javascript',
      code: `// Group by category and count
db.products.aggregate([
  { $group: {
    _id: "$category",
    count: { $sum: 1 }
  }}
])

// Multiple aggregations
db.orders.aggregate([
  { $group: {
    _id: "$customerId",
    totalOrders: { $sum: 1 },
    totalSpent: { $sum: "$total" },
    avgOrderValue: { $avg: "$total" },
    maxOrder: { $max: "$total" },
    minOrder: { $min: "$total" }
  }}
])

// Group by multiple fields
db.sales.aggregate([
  { $group: {
    _id: { 
      year: { $year: "$date" },
      month: { $month: "$date" }
    },
    revenue: { $sum: "$amount" }
  }}
])

// Group all documents (null _id)
db.orders.aggregate([
  { $group: {
    _id: null,
    totalRevenue: { $sum: "$total" },
    orderCount: { $sum: 1 },
    avgOrder: { $avg: "$total" }
  }}
])

// Collect values into array
db.orders.aggregate([
  { $group: {
    _id: "$customerId",
    orderIds: { $push: "$_id" },
    products: { $addToSet: "$productName" }  // unique values
  }}
])`,
    },
    {
      type: 'example',
      title: '$sort, $limit, and $skip',
      language: 'javascript',
      code: `// Sort results
db.products.aggregate([
  { $sort: { price: -1 } }  // -1 = descending, 1 = ascending
])

// Sort by multiple fields
db.users.aggregate([
  { $sort: { lastName: 1, firstName: 1 } }
])

// Limit results
db.products.aggregate([
  { $sort: { sales: -1 } },
  { $limit: 10 }  // top 10
])

// Skip and limit (pagination)
db.products.aggregate([
  { $sort: { createdAt: -1 } },
  { $skip: 20 },
  { $limit: 10 }  // items 21-30
])

// Combined pipeline
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $sort: { total: -1 } },
  { $limit: 5 }  // top 5 orders
])`,
    },
    {
      type: 'heading',
      content: 'Advanced Pipeline Stages',
    },
    {
      type: 'example',
      title: '$lookup - Join collections',
      language: 'javascript',
      code: `// LEFT OUTER JOIN (SQL equivalent)
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",           // collection to join
      localField: "customerId",    // field in orders
      foreignField: "_id",         // field in customers
      as: "customerInfo"           // output array field
    }
  }
])

// Result:
// {
//   _id: 1,
//   customerId: "cust123",
//   total: 299,
//   customerInfo: [
//     { _id: "cust123", name: "Alice", email: "alice@example.com" }
//   ]
// }

// Unwind lookup result to flatten
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customer"
    }
  },
  { $unwind: "$customer" },  // convert array to object
  {
    $project: {
      orderId: 1,
      total: 1,
      customerName: "$customer.name"
    }
  }
])`,
    },
    {
      type: 'example',
      title: '$unwind - Deconstruct arrays',
      language: 'javascript',
      code: `// Document with array
{
  _id: 1,
  order: "ORD-001",
  items: ["laptop", "mouse", "keyboard"]
}

// Unwind creates one document per array element
db.orders.aggregate([
  { $unwind: "$items" }
])

// Result:
// { _id: 1, order: "ORD-001", items: "laptop" }
// { _id: 1, order: "ORD-001", items: "mouse" }
// { _id: 1, order: "ORD-001", items: "keyboard" }

// Use case: analyze each item separately
db.orders.aggregate([
  { $unwind: "$items" },
  { $group: {
    _id: "$items.productId",
    totalQuantity: { $sum: "$items.quantity" },
    totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
  }}
])`,
    },
    {
      type: 'example',
      title: 'Real-world aggregation examples',
      language: 'javascript',
      code: `// Sales report by month
db.sales.aggregate([
  {
    $match: {
      date: { $gte: new Date("2024-01-01") }
    }
  },
  {
    $group: {
      _id: {
        year: { $year: "$date" },
        month: { $month: "$date" }
      },
      revenue: { $sum: "$amount" },
      orderCount: { $sum: 1 },
      avgOrder: { $avg: "$amount" }
    }
  },
  { $sort: { "_id.year": 1, "_id.month": 1 } }
])

// Top 5 customers by spending
db.orders.aggregate([
  { $match: { status: "completed" } },
  {
    $group: {
      _id: "$customerId",
      totalSpent: { $sum: "$total" },
      orderCount: { $sum: 1 }
    }
  },
  { $sort: { totalSpent: -1 } },
  { $limit: 5 },
  {
    $lookup: {
      from: "customers",
      localField: "_id",
      foreignField: "_id",
      as: "customer"
    }
  },
  { $unwind: "$customer" },
  {
    $project: {
      customerName: "$customer.name",
      totalSpent: 1,
      orderCount: 1
    }
  }
])

// Product performance with ratings
db.reviews.aggregate([
  {
    $group: {
      _id: "$productId",
      avgRating: { $avg: "$rating" },
      reviewCount: { $sum: 1 },
      ratingDistribution: {
        $push: "$rating"
      }
    }
  },
  { $match: { reviewCount: { $gte: 10 } } },
  { $sort: { avgRating: -1 } }
])`,
    },
    {
      type: 'table',
      title: 'Common Pipeline Stages',
      headers: ['Stage', 'Purpose', 'Example'],
      rows: [
        ['$match', 'Filter documents', '{ $match: { status: "active" } }'],
        ['$project', 'Select/compute fields', '{ $project: { name: 1, total: 1 } }'],
        ['$group', 'Group and aggregate', '{ $group: { _id: "$city", count: { $sum: 1 } } }'],
        ['$sort', 'Sort documents', '{ $sort: { price: -1 } }'],
        ['$limit', 'Limit results', '{ $limit: 10 }'],
        ['$skip', 'Skip documents', '{ $skip: 20 }'],
        ['$lookup', 'Join collections', '{ $lookup: { from: "users", ... } }'],
        ['$unwind', 'Deconstruct array', '{ $unwind: "$items" }'],
        ['$count', 'Count documents', '{ $count: "total" }'],
        ['$addFields', 'Add computed fields', '{ $addFields: { total: { $sum: ... } } }'],
      ],
    },
    {
      type: 'tip',
      title: 'Pipeline Optimization',
      content: 'Place $match as early as possible to reduce documents. Use indexes for $match and $sort stages. Limit fields with $project early. Place $limit after $sort to get top N results. Use $lookup sparingly as it is expensive.',
    },
    {
      type: 'tryit',
      title: 'Aggregation Pipeline Builder',
      css: `body{font-family:system-ui,sans-serif;padding:16px;margin:0;background:linear-gradient(135deg,#001E2B 0%,#003d4d 100%);}
.container{max-width:900px;margin:0 auto;}
.header{text-align:center;color:#00ED64;font-size:26px;font-weight:700;margin-bottom:6px;}
.subtitle{text-align:center;color:#fff;font-size:13px;margin-bottom:14px;}
.card{background:#fff;border-radius:10px;padding:18px;margin-bottom:12px;box-shadow:0 4px 20px rgba(0,237,100,0.2);}
.label{font-weight:600;color:#001E2B;font-size:14px;margin-bottom:8px;}
.pipeline{background:#1e293b;border-radius:8px;padding:12px;margin-bottom:12px;font-family:monospace;font-size:12px;color:#00ED64;line-height:1.6;}
.btn-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin-bottom:12px;}
.btn{background:#00ED64;color:#001E2B;border:none;padding:10px;border-radius:6px;cursor:pointer;font-weight:600;font-size:13px;}
.btn:hover{background:#00ff70;transform:translateY(-1px);}
.result{background:#f8f9fa;border:2px solid #00ED64;border-radius:8px;padding:12px;max-height:250px;overflow-y:auto;}
.doc{background:#fff;border:1px solid #e2e8f0;padding:8px;margin:6px 0;border-radius:4px;font-family:monospace;font-size:12px;color:#334155;}`,
      js: `var orders = [
  { _id: 1, customerId: "C001", category: "Electronics", total: 1299, status: "completed" },
  { _id: 2, customerId: "C001", category: "Books", total: 45, status: "completed" },
  { _id: 3, customerId: "C002", category: "Electronics", total: 599, status: "completed" },
  { _id: 4, customerId: "C002", category: "Electronics", total: 299, status: "pending" },
  { _id: 5, customerId: "C003", category: "Books", total: 89, status: "completed" },
  { _id: 6, customerId: "C003", category: "Toys", total: 129, status: "completed" }
];

function runAgg(type) {
  var pipeline, results;
  
  if (type === 'match') {
    pipeline = '[{ $match: { status: "completed" } }]';
    results = orders.filter(function(o) { return o.status === "completed"; });
  } else if (type === 'group') {
    pipeline = '[{ $group: { _id: "$category", count: { $sum: 1 } } }]';
    var grouped = {};
    orders.forEach(function(o) {
      grouped[o.category] = (grouped[o.category] || 0) + 1;
    });
    results = Object.keys(grouped).map(function(k) {
      return { _id: k, count: grouped[k] };
    });
  } else if (type === 'customer') {
    pipeline = '[{ $match: { status: "completed" } }, { $group: { _id: "$customerId", totalSpent: { $sum: "$total" }, orders: { $sum: 1 } } }]';
    var customers = {};
    orders.filter(function(o) { return o.status === "completed"; }).forEach(function(o) {
      if (!customers[o.customerId]) {
        customers[o.customerId] = { totalSpent: 0, orders: 0 };
      }
      customers[o.customerId].totalSpent += o.total;
      customers[o.customerId].orders += 1;
    });
    results = Object.keys(customers).map(function(k) {
      return { _id: k, totalSpent: customers[k].totalSpent, orders: customers[k].orders };
    });
  }
  
  showResults(pipeline, results);
}

function showResults(pipeline, results) {
  var html = '<div class="pipeline">db.orders.aggregate(' + pipeline + ')</div>';
  html += '<div class="result">';
  results.forEach(function(r) {
    html += '<div class="doc">' + JSON.stringify(r) + '</div>';
  });
  html += '</div>';
  document.getElementById('results').innerHTML = html;
}

document.getElementById('output').innerHTML =
  '<div class="container">' +
  '<div class="header">Aggregation Pipeline Builder</div>' +
  '<div class="subtitle">Build aggregation pipelines and see results</div>' +
  '<div class="card">' +
  '<div class="label">Sample Collection: orders (' + orders.length + ' documents)</div>' +
  '<div class="btn-grid">' +
  '<button class="btn" onclick="runAgg(\&apos;match\&apos;)">$match: completed</button>' +
  '<button class="btn" onclick="runAgg(\&apos;group\&apos;)">$group by category</button>' +
  '<button class="btn" onclick="runAgg(\&apos;customer\&apos;)">Customer totals</button>' +
  '</div>' +
  '<div id="results" style="color:#666;text-align:center;padding:30px;">Click a button to run aggregation</div>' +
  '</div>' +
  '</div>';

window.runAgg = runAgg;`,
    },
  ],
  exercises: [
    {
      id: 'mongodb-agg-1',
      question: 'Which pipeline stage filters documents?',
      type: 'multiple-choice',
      options: [
        '$filter',
        '$match',
        '$where',
        '$find',
      ],
      correct: 1,
      explanation: '$match filters documents in the aggregation pipeline, similar to find() but used within aggregate(). It should be placed early in the pipeline to reduce the number of documents processed.',
    },
    {
      id: 'mongodb-agg-2',
      question: 'What does $group with { _id: null } do?',
      type: 'multiple-choice',
      options: [
        'Groups documents by null values',
        'Creates an error',
        'Groups all documents together into a single result',
        'Removes the _id field',
      ],
      correct: 2,
      explanation: 'Using { _id: null } in $group aggregates all documents into a single group, useful for computing totals across the entire collection (e.g., total revenue, average order value).',
    },
  ],
  quiz: [
    {
      id: 'mongodb-agg-q1',
      question: 'What is the purpose of $lookup in aggregation?',
      options: [
        'To search for documents',
        'To join data from another collection',
        'To look up field values',
        'To create indexes',
      ],
      correct: 1,
      explanation: '$lookup performs a left outer join with another collection, similar to SQL JOIN. It adds documents from the joined collection as an array field in the result.',
    },
  ],
};
