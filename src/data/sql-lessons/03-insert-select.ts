import type { SqlLesson } from '../sql-curriculum';

export const lesson03: SqlLesson = {
  id: 'sql-03',
  title: 'INSERT and SELECT',
  slug: '03-insert-select',
  chapter: 'basics',
  order: 3,
  difficulty: 'beginner',
  readingTime: 12,
  description: 'Learn how to add data to tables with INSERT and retrieve it with SELECT, including aliases, computed columns, and DISTINCT.',
  sections: [
    {
      type: 'text',
      content: 'Once your tables are defined, you start working with data. Two statements handle almost all your initial interactions: INSERT adds new rows, and SELECT retrieves them. These are the most frequently used SQL statements in any application.'
    },
    {
      type: 'heading',
      content: 'INSERT INTO'
    },
    {
      type: 'text',
      content: 'INSERT INTO adds one or more rows to a table. You specify the table name, a list of column names, and a corresponding list of values. The column list is optional but strongly recommended - omitting it makes your INSERT fragile against schema changes.'
    },
    {
      type: 'text',
      content: 'You can insert multiple rows in a single INSERT statement by separating the value groups with commas. This is much more efficient than running individual INSERT statements in a loop, because it reduces the number of round trips to the database.'
    },
    {
      type: 'example',
      title: 'INSERT Single and Multiple Rows',
      content: 'Inserting one row explicitly, then inserting multiple rows at once in a single statement for efficiency.',
      code: `-- Insert a single row
INSERT INTO users (email, first_name, last_name, plan)
VALUES ('alice@example.com', 'Alice', 'Chen', 'pro');

-- Insert multiple rows in one statement (more efficient)
INSERT INTO users (email, first_name, last_name, plan)
VALUES
  ('bob@example.com',   'Bob',   'Smith', 'free'),
  ('carol@example.com', 'Carol', 'Davis', 'pro'),
  ('dan@example.com',   'Dan',   'Lee',   'free');

-- INSERT ... RETURNING (PostgreSQL) -- get the generated ID back
INSERT INTO users (email, first_name, last_name)
VALUES ('eve@example.com', 'Eve', 'Wilson')
RETURNING id, created_at;`,
      language: 'sql',
      output: `-- Last query returns:
 id |         created_at
----+----------------------------
  5 | 2024-08-20 14:30:00.123456`
    },
    {
      type: 'heading',
      content: 'RETURNING Clause'
    },
    {
      type: 'text',
      content: 'The RETURNING clause (PostgreSQL) makes INSERT return data from the inserted rows. This is extremely useful when you need the auto-generated ID or a server-computed default immediately after inserting, without running a separate SELECT query. MySQL achieves the same result with LAST_INSERT_ID().'
    },
    {
      type: 'heading',
      content: 'SELECT Basics'
    },
    {
      type: 'text',
      content: 'SELECT retrieves rows from one or more tables. Every SELECT query follows the same basic structure: which columns (SELECT), from which table (FROM), and optionally filters, sorting, and limits. The database engine processes these clauses in a specific order that differs from the order you write them.'
    },
    {
      type: 'table',
      title: 'SELECT Clause Execution Order',
      headers: ['Written Order', 'Execution Order', 'Purpose'],
      rows: [
        ['SELECT', '6th', 'Specify which columns to return'],
        ['FROM', '1st', 'Identify the source table(s)'],
        ['WHERE', '2nd', 'Filter rows from source'],
        ['GROUP BY', '3rd', 'Group rows for aggregation'],
        ['HAVING', '4th', 'Filter groups'],
        ['ORDER BY', '5th', 'Sort the result set'],
        ['LIMIT / OFFSET', '7th', 'Restrict number of rows returned']
      ]
    },
    {
      type: 'text',
      content: 'Understanding execution order matters because it explains constraints - you cannot reference a SELECT alias in a WHERE clause (WHERE runs before SELECT), but you can reference it in ORDER BY (which runs after SELECT).'
    },
    {
      type: 'heading',
      content: 'SELECT * vs Column List'
    },
    {
      type: 'text',
      content: 'SELECT * retrieves all columns from a table. It is convenient for quick exploration but problematic in production code: it returns data you may not need (wasting bandwidth), breaks if the table schema changes, and prevents the database from using covering indexes efficiently. Always name your columns explicitly in application queries.'
    },
    {
      type: 'heading',
      content: 'Column Aliases'
    },
    {
      type: 'text',
      content: 'The AS keyword renames a column in the result set. Aliases make results easier to read and are required when you compute new values - computed columns have no name unless you give them one. Aliases are visible to ORDER BY but not to WHERE or HAVING (because of execution order).'
    },
    {
      type: 'heading',
      content: 'DISTINCT'
    },
    {
      type: 'text',
      content: 'SELECT DISTINCT removes duplicate rows from the result set. It compares all selected columns - two rows are duplicates only if every selected column matches. DISTINCT has a cost: the database must sort or hash all rows to identify duplicates. Use it when you genuinely need unique values, not as a bandaid for accidental duplicates in your data.'
    },
    {
      type: 'example',
      title: 'SELECT with Aliases, Computed Columns, and DISTINCT',
      content: 'Querying with explicit column names, renaming columns with AS, computing a full name, and finding distinct values.',
      code: `-- Explicit columns with aliases
SELECT
  id,
  email,
  first_name AS fname,
  last_name  AS lname,
  plan       AS subscription_plan
FROM users;

-- Computed column: concatenate first and last name
SELECT
  id,
  first_name || ' ' || last_name AS full_name,
  email,
  UPPER(plan) AS plan
FROM users;

-- DISTINCT: find all unique plan types in use
SELECT DISTINCT plan
FROM users
ORDER BY plan;`,
      language: 'sql',
      output: `-- Last query returns:
  plan
--------
 free
 pro`
    },
    {
      type: 'tip',
      title: 'String Concatenation Syntax',
      content: 'PostgreSQL uses || for string concatenation (first_name || \' \' || last_name). MySQL uses CONCAT(first_name, \' \', last_name). Both approaches work fine - just match the syntax to your database.'
    },
    {
      type: 'note',
      title: 'NULL in SELECT',
      content: 'If any value in a concatenation expression is NULL, the entire result becomes NULL in PostgreSQL. Use COALESCE(value, \'\') to replace NULLs with empty strings before concatenating.'
    },
    {
      type: 'tryit',
      title: 'SQL Query Runner - Interactive Table Demo',
      js: `document.body.innerHTML = \`<div id="output"></div>\`;

// ──────────────────────────────────────────────────────────────
// In-memory SQL simulator: SELECT * / column list / WHERE / DISTINCT
// ──────────────────────────────────────────────────────────────
var DB = {
  users: {
    columns: ['id','first_name','last_name','email','plan','active','age'],
    rows: [
      [1,'Alice',  'Chen',   'alice@example.com',  'pro',  true,  28],
      [2,'Bob',    'Smith',  'bob@example.com',    'free', true,  34],
      [3,'Carol',  'Davis',  'carol@example.com',  'pro',  false, 22],
      [4,'Dan',    'Lee',    'dan@example.com',    'free', true,  19],
      [5,'Eve',    'Wilson', 'eve@example.com',    'pro',  true,  31],
      [6,'Frank',  'Brown',  'frank@example.com',  'free', false, 45],
    ]
  },
  orders: {
    columns: ['id','user_id','product','amount','status','ordered_at'],
    rows: [
      [101, 1, 'Pro Subscription',   29.99, 'completed', '2024-01-15'],
      [102, 1, 'Extra Storage',       9.99, 'completed', '2024-02-10'],
      [103, 3, 'Pro Subscription',   29.99, 'pending',   '2024-03-01'],
      [104, 5, 'Pro Subscription',   29.99, 'completed', '2024-03-05'],
      [105, 2, 'Domain Name',        12.00, 'completed', '2024-03-08'],
      [106, 4, 'Starter Pack',       49.00, 'cancelled', '2024-03-12'],
    ]
  }
};

var QUERIES = [
  { label: 'SELECT *',           sql: 'SELECT * FROM users;',                                    table:'users', cols:null,   where:null,    distinct:false },
  { label: 'Column list',        sql: 'SELECT id, first_name, email, plan\\nFROM users;',         table:'users', cols:['id','first_name','email','plan'], where:null, distinct:false },
  { label: 'WHERE active=true',  sql: 'SELECT *\\nFROM users\\nWHERE active = true;',              table:'users', cols:null,   where:function(r){return r[5]===true;},  distinct:false },
  { label: 'WHERE plan=pro',     sql: 'SELECT id, first_name, plan\\nFROM users\\nWHERE plan = \\'pro\\';', table:'users', cols:['id','first_name','plan'], where:function(r){return r[4]==='pro';}, distinct:false },
  { label: 'DISTINCT plans',     sql: 'SELECT DISTINCT plan\\nFROM users;',                       table:'users', cols:['plan'], where:null,   distinct:true },
  { label: 'Alias: full_name',   sql: 'SELECT id,\\n  first_name || \\' \\' || last_name AS full_name,\\n  email\\nFROM users;', table:'users', cols:null, where:null, distinct:false, computed:true },
  { label: 'All orders',         sql: 'SELECT *\\nFROM orders;',                                  table:'orders', cols:null,  where:null,    distinct:false },
  { label: 'Completed orders',   sql: 'SELECT id, user_id, product, amount\\nFROM orders\\nWHERE status = \\'completed\\';', table:'orders', cols:['id','user_id','product','amount'], where:function(r){return r[4]==='completed';}, distinct:false },
];

var activeIdx = 0;
var insertCount = 0;

function getRows(q) {
  var tbl = DB[q.table];
  var colDefs = tbl.columns;
  var rows = tbl.rows.slice();
  if (q.where) rows = rows.filter(q.where);
  var outCols, outRows;
  if (q.computed) {
    // Build full_name alias
    outCols = ['id', 'full_name', 'email'];
    outRows = rows.map(function(r) {
      return [r[0], r[1]+' '+r[2], r[3]];
    });
  } else if (q.cols) {
    var idxMap = q.cols.map(function(c) { return colDefs.indexOf(c); });
    outCols = q.cols;
    outRows = rows.map(function(r) { return idxMap.map(function(i) { return r[i]; }); });
  } else {
    outCols = colDefs;
    outRows = rows;
  }
  if (q.distinct) {
    var seen = {};
    outRows = outRows.filter(function(r) {
      var key = JSON.stringify(r);
      if (seen[key]) return false;
      seen[key] = true; return true;
    });
  }
  return { cols: outCols, rows: outRows };
}

function renderTable(cols, rows) {
  if (!rows.length) return '<p style="color:#718096;font-size:13px;padding:8px 0">No rows returned</p>';
  var head = cols.map(function(c) {
    return '<th style="background:#1a3347;color:white;padding:7px 12px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;white-space:nowrap">'+c+'</th>';
  }).join('');
  var body = rows.map(function(row, i) {
    return '<tr style="background:'+(i%2===0?'#fff':'#f8fafc')+'">' +
      row.map(function(cell) {
        var display = cell===null?'<span style="color:#a0aec0;font-style:italic">NULL</span>':
                      typeof cell==='boolean'?'<span style="color:'+(cell?'#16a34a':'#dc2626')+';font-weight:700">'+(cell?'true':'false')+'</span>':
                      String(cell);
        return '<td style="padding:7px 12px;font-size:12px;font-family:monospace;border-bottom:1px solid #e2e8f0">'+display+'</td>';
      }).join('') + '</tr>';
  }).join('');
  return '<table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden"><thead><tr>'+head+'</tr></thead><tbody>'+body+'</tbody></table>';
}

function render() {
  // Tab buttons - create DOM elements instead of HTML strings
  var tabsContainer = document.getElementById('tabs');
  tabsContainer.innerHTML = '';
  QUERIES.forEach(function(q, i) {
    var btn = document.createElement('button');
    btn.textContent = q.label;
    btn.onclick = function() { selectQuery(i); };
    btn.style.cssText = 'padding:5px 11px;border:none;border-radius:5px;cursor:pointer;font-size:11px;font-weight:700;margin:2px;background:'+(i===activeIdx?'#336791':'#e8f4fd')+';color:'+(i===activeIdx?'white':'#1a3347');
    tabsContainer.appendChild(btn);
  });

  // SQL display
  var q = QUERIES[activeIdx];
  document.getElementById('sql-display').textContent = q.sql;

  // Execute and render result
  var result = getRows(q);
  document.getElementById('result').innerHTML = renderTable(result.cols, result.rows);
  document.getElementById('count').textContent = result.rows.length + ' row' + (result.rows.length!==1?'s':'') + ' returned (' + result.cols.length + ' col' + (result.cols.length!==1?'s':'')+')';
}

function addUser() {
  insertCount++;
  var names = [['Zara','Ahmed'],['Leo','Kumar'],['Maya','Patel'],['Kai','Johnson']];
  var n = names[insertCount % names.length];
  var row = [100+insertCount, n[0], n[1], n[0].toLowerCase()+'@example.com', insertCount%2===0?'pro':'free', true, 20+insertCount*3%20];
  DB.users.rows.push(row);
  document.getElementById('insert-status').textContent = '✅ INSERT: Added '+n[0]+' '+n[1]+' to users';
  setTimeout(function(){document.getElementById('insert-status').textContent='';},2000);
  if (activeIdx<4) render();
}

function selectQuery(i) { activeIdx = i; render(); }
window.addUser = addUser;

var outputHTML =
  '<div style="padding:16px;font-family:system-ui,sans-serif;background:#f7fafc;">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px;">' +
      '<div>' +
        '<h3 style="margin:0 0 2px;color:#336791;font-size:16px;font-weight:700">SQL Query Runner</h3>' +
        '<p style="margin:0;color:#718096;font-size:12px">Click a query to execute it against the in-memory database</p>' +
      '</div>' +
      '<button onclick="addUser()" style="padding:6px 14px;background:#336791;color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:700">+ INSERT User</button>' +
    '</div>' +
    '<div id="tabs" style="margin-bottom:10px"></div>' +
    '<div style="background:#1e1e2e;border-radius:8px;padding:12px 14px;margin-bottom:10px;">' +
      '<div style="font-size:10px;color:#8b949e;margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em">Executed SQL</div>' +
      '<pre id="sql-display" style="margin:0;font-family:monospace;font-size:12px;color:#7dd3fc;white-space:pre-wrap"></pre>' +
    '</div>' +
    '<div id="result" style="overflow-x:auto"></div>' +
    '<div id="count" style="font-size:11px;color:#718096;margin-top:6px;font-family:monospace"></div>' +
    '<div id="insert-status" style="font-size:12px;color:#16a34a;font-weight:700;margin-top:4px;min-height:18px"></div>' +
  '</div>';

document.getElementById('output').innerHTML = outputHTML;
render();`,
      css: ``,
    },
  ],
  exercises: [
    {
      id: 'ex-sql-3-1',
      question: 'What does SELECT DISTINCT plan FROM users return?',
      type: 'multiple-choice',
      options: [
        'All plan values including duplicates',
        'Only unique plan values, with duplicates removed',
        'The first plan value in the table',
        'An error - DISTINCT cannot be used with a single column'
      ],
      correct: 1,
      explanation: 'SELECT DISTINCT removes duplicate values from the result. If users have plan values of "free", "pro", "free", "pro", the result will be just "free" and "pro" - one row per unique value.'
    },
    {
      id: 'ex-sql-3-2',
      question: 'Why is it recommended to specify column names in INSERT instead of relying on column order?',
      type: 'multiple-choice',
      options: [
        'It makes the query run faster',
        'It makes the INSERT resilient to column additions or reordering in the table',
        'It is required by the SQL standard',
        'It allows inserting NULL values'
      ],
      correct: 1,
      explanation: 'Naming columns in INSERT explicitly means the query will continue to work correctly even if someone adds a new column to the table or changes column order. Positional inserts break when the schema changes.'
    },
    {
      id: 'ex-sql-3-3',
      question: 'In which order does SQL actually execute the clauses of a SELECT query?',
      type: 'multiple-choice',
      options: [
        'SELECT -> FROM -> WHERE -> GROUP BY -> HAVING -> ORDER BY',
        'FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY',
        'WHERE -> FROM -> SELECT -> GROUP BY -> HAVING -> ORDER BY',
        'FROM -> SELECT -> WHERE -> GROUP BY -> HAVING -> ORDER BY'
      ],
      correct: 1,
      explanation: 'SQL executes: FROM first (get the data), then WHERE (filter rows), GROUP BY (group), HAVING (filter groups), SELECT (choose columns), ORDER BY (sort), LIMIT (restrict). This order explains why SELECT aliases are not available in WHERE.'
    }
  ],
  quiz: [
    {
      id: 'q-sql-3-1',
      question: 'What does the RETURNING clause do in an INSERT statement?',
      options: [
        'Rolls back the insert if it fails',
        'Returns data from the inserted row, such as the generated ID',
        'Checks if a matching row already exists',
        'Returns the number of rows affected'
      ],
      correct: 1,
      explanation: 'RETURNING (PostgreSQL) makes INSERT return values from the newly inserted row. This is useful for retrieving auto-generated IDs or server-computed default values without needing a follow-up SELECT.'
    },
    {
      id: 'q-sql-3-2',
      question: 'What is wrong with using SELECT * in production application code?',
      options: [
        'It is not valid SQL',
        'It returns too many columns, wastes bandwidth, and breaks when schema changes',
        'It is slower than SELECT 1',
        'It cannot be used with WHERE'
      ],
      correct: 1,
      explanation: 'SELECT * returns all columns including ones you do not need, wastes network bandwidth, prevents covering index use, and silently breaks if columns are added or removed. Always specify columns explicitly in application code.'
    },
    {
      id: 'q-sql-3-3',
      question: 'How do you rename a column in the SELECT result without renaming it in the table?',
      options: [
        'RENAME column_name TO alias',
        'SELECT column_name AS alias',
        'SELECT column_name = alias',
        'ALIAS column_name alias'
      ],
      correct: 1,
      explanation: 'The AS keyword creates a column alias in the result set. SELECT first_name AS fname returns the first_name column but labels it "fname" in the output. The AS keyword is technically optional but using it improves readability.'
    }
  ]
};
