import type { SqlLesson } from '../sql-curriculum';

export const lesson07: SqlLesson = {
  id: 'sql-07',
  title: 'JOINs',
  slug: '07-joins',
  chapter: 'querying',
  order: 7,
  difficulty: 'intermediate',
  readingTime: 13,
  description: 'Learn how to combine data from multiple tables using INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, and SELF JOIN.',
  sections: [
    {
      type: 'text',
      content: 'Relational databases split data across multiple tables to avoid duplication â€” this is called normalization. A users table stores user information; an orders table stores order information. But often you need data from both at once: "show me all orders with the customer name." JOINs are how you combine data from multiple tables in a single query.'
    },
    {
      type: 'heading',
      content: 'Why JOINs Exist'
    },
    {
      type: 'text',
      content: 'Consider storing the customer name on every order row. If a customer updates their name, you would need to update every order row â€” missing even one creates inconsistency. Instead, orders store a user_id foreign key. To get the name, you JOIN the orders table to the users table on the shared key. This way names are stored once and stay consistent everywhere.'
    },
    {
      type: 'analogy',
      title: 'JOINs as a Lookup',
      content: 'Think of a JOIN like a VLOOKUP in Excel. Your orders sheet has a customer_id column. You look that ID up in your customers sheet to get the customer name. SQL JOIN does this for entire datasets simultaneously, matching every row where the condition is true.'
    },
    {
      type: 'heading',
      content: 'INNER JOIN'
    },
    {
      type: 'text',
      content: 'INNER JOIN returns only rows where there is a matching row in both tables. If an order has a user_id that does not exist in the users table, that order is excluded from the result. If a user has no orders, they are also excluded. INNER JOIN is the most common type â€” it returns the intersection of both tables based on the join condition.'
    },
    {
      type: 'heading',
      content: 'LEFT JOIN (LEFT OUTER JOIN)'
    },
    {
      type: 'text',
      content: 'LEFT JOIN returns all rows from the left (first) table plus matching rows from the right table. If there is no match in the right table, the right table columns contain NULL. Use LEFT JOIN when you want to keep all records from the main table regardless of whether they have related records in the joined table.'
    },
    {
      type: 'text',
      content: 'A common LEFT JOIN use case: find all users even those with no orders. With INNER JOIN, users with no orders disappear. With LEFT JOIN, they stay in the result and their order columns show NULL â€” you can then use WHERE order_id IS NULL to find users with no orders at all.'
    },
    {
      type: 'heading',
      content: 'RIGHT JOIN and FULL OUTER JOIN'
    },
    {
      type: 'text',
      content: 'RIGHT JOIN is the mirror of LEFT JOIN â€” it keeps all rows from the right table and NULLs for unmatched left rows. In practice, most developers rewrite RIGHT JOINs as LEFT JOINs by swapping table order â€” this makes queries easier to read left-to-right.'
    },
    {
      type: 'text',
      content: 'FULL OUTER JOIN returns all rows from both tables. Rows that match appear combined; rows from either table with no match appear with NULLs for the other table\'s columns. FULL OUTER JOIN is used for finding all discrepancies between two datasets.'
    },
    {
      type: 'heading',
      content: 'CROSS JOIN and SELF JOIN'
    },
    {
      type: 'text',
      content: 'CROSS JOIN returns the Cartesian product â€” every possible combination of rows from both tables. If table A has 100 rows and table B has 50 rows, CROSS JOIN produces 5,000 rows. It is rarely used intentionally but easy to create accidentally by forgetting the ON clause in older-style JOIN syntax.'
    },
    {
      type: 'text',
      content: 'SELF JOIN joins a table to itself. This is useful for hierarchical data where rows reference other rows in the same table â€” like an employees table where each employee has a manager_id pointing to another row in the same table.'
    },
    {
      type: 'table',
      title: 'JOIN Types Summarized',
      headers: ['JOIN Type', 'Returns', 'Common Use Case'],
      rows: [
        ['INNER JOIN', 'Only rows with matches in both tables', 'Get orders with customer details (both must exist)'],
        ['LEFT JOIN', 'All left rows + matching right rows (NULLs for no match)', 'Get all users, including those with no orders'],
        ['RIGHT JOIN', 'All right rows + matching left rows (NULLs for no match)', 'Rarely used â€” rewrite as LEFT JOIN'],
        ['FULL OUTER JOIN', 'All rows from both tables, NULLs for non-matches', 'Find mismatches between two datasets'],
        ['CROSS JOIN', 'Every combination (Cartesian product)', 'Generate combinations (e.g., all size/color pairs)'],
        ['SELF JOIN', 'Table joined to itself', 'Hierarchical data like org charts, employee-manager']
      ]
    },
    {
      type: 'example',
      title: 'INNER JOIN and LEFT JOIN',
      content: 'Combining users and orders with INNER JOIN (only matched rows), then LEFT JOIN to include users with no orders.',
      code: `-- INNER JOIN: orders with customer names (both sides must match)
SELECT
  o.id          AS order_id,
  u.first_name  || ' ' || u.last_name AS customer_name,
  u.email,
  o.amount,
  o.created_at
FROM orders o
INNER JOIN users u ON o.user_id = u.id
ORDER BY o.created_at DESC;

-- LEFT JOIN: ALL users, even those with no orders
-- Users with no orders have NULL for order columns
SELECT
  u.id,
  u.first_name,
  u.email,
  COUNT(o.id) AS order_count,
  COALESCE(SUM(o.amount), 0) AS total_spent
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
GROUP BY u.id, u.first_name, u.email
ORDER BY total_spent DESC;

-- LEFT JOIN with IS NULL: find users who have NEVER ordered
SELECT u.id, u.email
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE o.id IS NULL;`,
      language: 'sql'
    },
    {
      type: 'example',
      title: 'Multiple JOINs and SELF JOIN',
      content: 'Chaining multiple JOINs to combine three tables, and a SELF JOIN on the employees table to show each employee with their manager name.',
      code: `-- Multiple JOINs: orders with customer name and product name
SELECT
  o.id                AS order_id,
  u.first_name        AS customer,
  p.name              AS product,
  p.category,
  o.quantity,
  o.quantity * p.price AS line_total
FROM orders o
INNER JOIN users    u ON o.user_id    = u.id
INNER JOIN products p ON o.product_id = p.id
ORDER BY o.created_at DESC;

-- SELF JOIN: employees with their manager name
SELECT
  e.name         AS employee,
  e.title,
  m.name         AS manager_name
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id
ORDER BY e.name;`,
      language: 'sql'
    },
    {
      type: 'tip',
      title: 'Always Alias Table Names',
      content: 'When JOINing multiple tables, always give each table a short alias (FROM orders o, FROM users u). This makes column references unambiguous (o.id vs u.id) and queries much shorter and more readable.'
    },
    {
      type: 'note',
      title: 'JOIN Performance',
      content: 'JOINs perform well when the join columns are indexed. Without an index on the foreign key column, the database must scan the entire joined table for every row in the left table. Always index foreign key columns.'
    },
    {
      type: 'tryit',
      title: 'JOIN Visualizer',
      css: ``,
      js: `document.body.innerHTML = '<div id="output"></div>';

var USERS=[
  {u_id:1,u_name:'Alice Chen',  u_plan:'pro' },
  {u_id:2,u_name:'Bob Smith',   u_plan:'free'},
  {u_id:3,u_name:'Carol Davis', u_plan:'pro' },
  {u_id:4,u_name:'Dan Lee',     u_plan:'free'},
];
var ORDERS=[
  {o_id:101,o_user_id:1,o_product:'Pro Plan',     o_amt:29},
  {o_id:102,o_user_id:1,o_product:'Extra Storage',o_amt:10},
  {o_id:103,o_user_id:3,o_product:'Pro Plan',     o_amt:29},
  {o_id:104,o_user_id:5,o_product:'Mystery Order',o_amt:50},
];

var JOINS={
  inner:{label:'INNER JOIN',cls:'inner',sql:'SELECT u.u_name, o.o_product FROM users u INNER JOIN orders o ON o.o_user_id = u.u_id',explain:'Returns only rows where there is a match in BOTH tables. Users with no orders (Bob, Dan) are excluded. The orphan order (user_id=5) is also excluded.',venn:'both',exec:function(){return ORDERS.map(function(o){var u=USERS.find(function(u){return u.u_id===o.o_user_id;});if(!u)return null;return {u_name:u.u_name,u_plan:u.u_plan,o_id:o.o_id,o_product:o.o_product,o_amt:'$'+o.o_amt,_hi:'both'};}).filter(Boolean);}},
  left:{label:'LEFT JOIN',cls:'left',sql:'SELECT u.u_name, o.o_product FROM users u LEFT JOIN orders o ON o.o_user_id = u.u_id',explain:'Returns ALL rows from the left table (users), plus matching right rows. Users with no orders appear with NULL for order columns.',venn:'left',exec:function(){var rows=[];USERS.forEach(function(u){var ords=ORDERS.filter(function(o){return o.o_user_id===u.u_id;});if(!ords.length){rows.push({u_name:u.u_name,u_plan:u.u_plan,o_id:'NULL',o_product:'NULL',o_amt:'NULL',_hi:'left'});}else ords.forEach(function(o){rows.push({u_name:u.u_name,u_plan:u.u_plan,o_id:o.o_id,o_product:o.o_product,o_amt:'$'+o.o_amt,_hi:'both'});});});return rows;}},
  right:{label:'RIGHT JOIN',cls:'right',sql:'SELECT u.u_name, o.o_product FROM users u RIGHT JOIN orders o ON o.o_user_id = u.u_id',explain:'Returns ALL rows from the right table (orders), plus matching left rows. The orphan order (user_id=5) appears with NULL for user columns.',venn:'right',exec:function(){return ORDERS.map(function(o){var u=USERS.find(function(u){return u.u_id===o.o_user_id;});return {u_name:u?u.u_name:'NULL',u_plan:u?u.u_plan:'NULL',o_id:o.o_id,o_product:o.o_product,o_amt:'$'+o.o_amt,_hi:u?'both':'right'};});}},
  full:{label:'FULL OUTER',cls:'full',sql:'SELECT u.u_name, o.o_product FROM users u FULL OUTER JOIN orders o ON o.o_user_id = u.u_id',explain:'Returns ALL rows from both tables. Users with no orders get NULL for order columns. Orphan orders get NULL for user columns.',venn:'full',exec:function(){var rows=[];USERS.forEach(function(u){var ords=ORDERS.filter(function(o){return o.o_user_id===u.u_id;});if(!ords.length){rows.push({u_name:u.u_name,u_plan:u.u_plan,o_id:'NULL',o_product:'NULL',o_amt:'NULL',_hi:'left'});}else ords.forEach(function(o){rows.push({u_name:u.u_name,u_plan:u.u_plan,o_id:o.o_id,o_product:o.o_product,o_amt:'$'+o.o_amt,_hi:'both'});});});ORDERS.forEach(function(o){var u=USERS.find(function(u){return u.u_id===o.o_user_id;});if(!u)rows.push({u_name:'NULL',u_plan:'NULL',o_id:o.o_id,o_product:o.o_product,o_amt:'$'+o.o_amt,_hi:'right'});});return rows;}},
  anti:{label:'Anti-JOIN',cls:'anti',sql:'SELECT u.u_name FROM users u LEFT JOIN orders o ON o.o_user_id = u.u_id WHERE o.o_id IS NULL',explain:'Find users who have NEVER placed an order. LEFT JOIN all users, then filter WHERE o.o_id IS NULL.',venn:'leftonly',exec:function(){return USERS.filter(function(u){return !ORDERS.some(function(o){return o.o_user_id===u.u_id;});}).map(function(u){return {u_name:u.u_name,u_plan:u.u_plan,note:'no orders',_hi:'left'};});}}
};

var activeKey='inner';

var st=document.createElement('style');
st.textContent='body{font-family:system-ui,sans-serif;padding:14px;background:#f7fafc;margin:0}'+
  '.jtab{padding:6px 12px;border:2px solid transparent;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700;margin:2px}'+
  '.jtab.inner{background:#e9f5ff;color:#1a56a0;border-color:#bee3f8}'+
  '.jtab.left{background:#e6fffa;color:#276749;border-color:#9ae6b4}'+
  '.jtab.right{background:#fef9c3;color:#7c5e10;border-color:#fde68a}'+
  '.jtab.full{background:#faf5ff;color:#6b21a8;border-color:#d8b4fe}'+
  '.jtab.anti{background:#fff1f0;color:#c0392b;border-color:#fca5a5}'+
  '.jtab.on{filter:brightness(.88);box-shadow:0 2px 8px rgba(0,0,0,.15)}'+
  '.card{background:white;border-radius:10px;border:1px solid #e2e8f0;padding:12px;margin-bottom:10px}'+
  '.sql-box{background:#1e1e2e;border-radius:6px;padding:8px 12px;font-family:monospace;font-size:11px;color:#7dd3fc;margin:6px 0;word-break:break-all}'+
  '.g2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px}'+
  '.tblh{padding:5px 10px;font-size:11px;font-weight:700;text-transform:uppercase}'+
  'table{width:100%;border-collapse:collapse}th{padding:5px 8px;text-align:left;font-size:10px;font-weight:700;background:#f0f4ff;color:#336791}'+
  'td{padding:5px 8px;font-size:11px;font-family:monospace;border-top:1px solid #f0f0f0}'+
  '.hl td{background:#e6fffa}.hr td{background:#fff9db}.hb td{background:#f0fff4}'+
  '.nc{color:#a0aec0;font-style:italic}';
document.head.appendChild(st);

function vennSVG(type){
  var lop=0.15,rop=0.15,bop=0.7;
  if(type==='left'){lop=0.8;bop=0.5;rop=0.1;}
  else if(type==='right'){rop=0.8;bop=0.5;lop=0.1;}
  else if(type==='full'){lop=0.7;rop=0.7;bop=0.7;}
  else if(type==='leftonly'){lop=0.9;rop=0.05;bop=0.0;}
  return '<svg width="130" height="65" viewBox="0 0 130 65">'+
    '<circle cx="45" cy="32" r="28" fill="#a7f3d0" fill-opacity="'+lop+'" stroke="#34d399" stroke-width="2"/>'+
    '<circle cx="85" cy="32" r="28" fill="#fde68a" fill-opacity="'+rop+'" stroke="#f59e0b" stroke-width="2"/>'+
    '<ellipse cx="65" cy="32" rx="11" ry="24" fill="#6ee7b7" fill-opacity="'+bop+'"/>'+
    '<text x="32" y="60" text-anchor="middle" font-size="7" fill="#276749">users</text>'+
    '<text x="100" y="60" text-anchor="middle" font-size="7" fill="#7c5e10">orders</text>'+
  '</svg>';
}

function renderRT(rows,cols){
  if(!rows.length)return '<p style="text-align:center;padding:14px;color:#a0aec0;font-size:12px">No rows returned</p>';
  var h=cols.map(function(c){return '<th>'+c+'</th>';}).join('');
  var b=rows.map(function(r){
    var cl=r._hi==='left'?'hl':r._hi==='right'?'hr':'hb';
    return '<tr class="'+cl+'">'+cols.map(function(c){return '<td class="'+(r[c]==='NULL'?'nc':'')+'">'+r[c]+'</td>';}).join('')+'</tr>';
  }).join('');
  return '<table><thead><tr>'+h+'</tr></thead><tbody>'+b+'</tbody></table>';
}

function render(){
  var j=JOINS[activeKey];
  var rows=j.exec();
  var cols=rows.length?Object.keys(rows[0]).filter(function(k){return k!=='_hi';}):[];

  var tabsDiv=document.getElementById('jtabs');
  tabsDiv.innerHTML='';
  Object.keys(JOINS).forEach(function(k){
    var btn=document.createElement('button');
    btn.className='jtab '+JOINS[k].cls+(k===activeKey?' on':'');
    btn.textContent=JOINS[k].label;
    btn.addEventListener('click',function(){activeKey=k;render();});
    tabsDiv.appendChild(btn);
  });

  document.getElementById('venn').innerHTML=vennSVG(j.venn);
  document.getElementById('jname').textContent=j.label;
  document.getElementById('jsql').textContent=j.sql;
  document.getElementById('jexpl').textContent=j.explain;
  document.getElementById('jresult').innerHTML=renderRT(rows,cols);
  document.getElementById('jcount').textContent=rows.length+' row'+(rows.length!==1?'s':'');
}

var uRows=USERS.map(function(u,i){return '<tr style="background:'+(i%2?'#f9fafb':'#fff')+'"><td>'+u.u_id+'</td><td>'+u.u_name+'</td><td>'+u.u_plan+'</td></tr>';}).join('');
var oRows=ORDERS.map(function(o,i){return '<tr style="background:'+(i%2?'#f9fafb':'#fff')+'"><td>'+o.o_id+'</td><td>'+o.o_user_id+'</td><td>'+o.o_product+'</td><td>$'+o.o_amt+'</td></tr>';}).join('');

document.getElementById('output').innerHTML=
  '<div id="jtabs" style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px"></div>'+
  '<div class="card" style="display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap">'+
    '<div id="venn"></div>'+
    '<div style="flex:1;min-width:160px">'+
      '<div id="jname" style="font-size:14px;font-weight:800;color:#336791;margin-bottom:4px"></div>'+
      '<div id="jsql" class="sql-box"></div>'+
      '<div id="jexpl" style="font-size:12px;color:#4a5568;line-height:1.6"></div>'+
    '</div>'+
  '</div>'+
  '<div class="g2">'+
    '<div style="background:white;border-radius:8px;border:1px solid #e2e8f0;overflow:hidden">'+
      '<div class="tblh" style="background:#e6fffa;color:#276749">users (left)</div>'+
      '<table><thead><tr><th>u_id</th><th>u_name</th><th>u_plan</th></tr></thead><tbody>'+uRows+'</tbody></table>'+
    '</div>'+
    '<div style="background:white;border-radius:8px;border:1px solid #e2e8f0;overflow:hidden">'+
      '<div class="tblh" style="background:#fff9db;color:#7c5e10">orders (right)</div>'+
      '<table><thead><tr><th>o_id</th><th>user_id</th><th>product</th><th>amt</th></tr></thead><tbody>'+oRows+'</tbody></table>'+
    '</div>'+
  '</div>'+
  '<div style="background:white;border-radius:10px;border:1px solid #e2e8f0;overflow:hidden">'+
    '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;border-bottom:1px solid #e2e8f0;background:#f9fafb">'+
      '<span style="font-size:12px;font-weight:700;color:#336791">Result</span>'+
      '<span id="jcount" style="font-size:11px;color:#718096;background:#ebf8ff;padding:1px 8px;border-radius:999px"></span>'+
    '</div>'+
    '<div id="jresult"></div>'+
  '</div>';

render();`,
    }
  ],
  exercises: [
    {
      id: 'ex-sql-7-1',
      question: 'You want all users from the users table, including those with no orders. Which JOIN type should you use?',
      type: 'multiple-choice',
      options: ['INNER JOIN', 'LEFT JOIN with users as the left table', 'RIGHT JOIN with orders as the right table', 'CROSS JOIN'],
      correct: 1,
      explanation: 'LEFT JOIN with users as the left table returns all users. For users with no orders, the order columns will be NULL. INNER JOIN would exclude users with no orders.'
    },
    {
      id: 'ex-sql-7-2',
      question: 'How do you find all users who have never placed an order?',
      type: 'multiple-choice',
      options: [
        'INNER JOIN orders WHERE orders.id = 0',
        'LEFT JOIN orders ON orders.user_id = users.id WHERE orders.id IS NULL',
        'NOT JOIN orders ON orders.user_id = users.id',
        'INNER JOIN orders WHERE orders.user_id NOT IN (SELECT id FROM users)'
      ],
      correct: 1,
      explanation: 'LEFT JOIN returns all users, with NULL for order columns when no matching order exists. Adding WHERE orders.id IS NULL then filters to only the users without orders â€” the "anti-join" pattern.'
    },
    {
      id: 'ex-sql-7-3',
      question: 'What does INNER JOIN return when no rows match the ON condition?',
      type: 'multiple-choice',
      options: [
        'Both tables fully (like FULL OUTER JOIN)',
        'An empty result set with no rows',
        'NULL values for all columns',
        'An error'
      ],
      correct: 1,
      explanation: 'INNER JOIN returns only rows where the ON condition matches in both tables. If no rows match, the result is an empty result set with zero rows â€” not an error, just no data.'
    }
  ],
  quiz: [
    {
      id: 'q-sql-7-1',
      question: 'What is the difference between INNER JOIN and LEFT JOIN?',
      options: [
        'INNER JOIN is faster; LEFT JOIN is slower',
        'INNER JOIN returns only matched rows; LEFT JOIN returns all left rows plus matched right rows (NULLs for no match)',
        'LEFT JOIN only works with two tables; INNER JOIN works with any number',
        'They return identical results when all rows have matches'
      ],
      correct: 1,
      explanation: 'INNER JOIN discards rows from either table that have no match. LEFT JOIN keeps all rows from the left table, filling right-side columns with NULL when there is no match. They produce the same result only when every left row has at least one match on the right.'
    },
    {
      id: 'q-sql-7-2',
      question: 'Why should you always index foreign key columns?',
      options: [
        'Foreign keys require an index to be created',
        'Without an index, the database must scan the entire joined table for each row on the other side',
        'Indexes make foreign key constraints enforced faster',
        'Indexes prevent NULL values in foreign key columns'
      ],
      correct: 1,
      explanation: 'When you JOIN on a foreign key, the database needs to look up matching rows in the joined table. Without an index, it scans every row (O(n) per lookup). With a B-tree index, it jumps directly to matches (O(log n)). On large tables this is the difference between milliseconds and minutes.'
    },
    {
      id: 'q-sql-7-3',
      question: 'What is a SELF JOIN used for?',
      options: [
        'Joining a table to a backup copy of itself',
        'Joining a table to itself to represent hierarchical relationships within the same table',
        'Duplicating all rows in a table',
        'SELF JOIN is not valid SQL'
      ],
      correct: 1,
      explanation: 'A SELF JOIN joins a table to itself using table aliases. It is used for hierarchical data where rows reference other rows in the same table â€” like employees with manager_id pointing to another employee, or categories with parent_id.'
    }
  ]
};
