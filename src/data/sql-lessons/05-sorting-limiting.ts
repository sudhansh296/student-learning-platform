import type { SqlLesson } from '../sql-curriculum';

export const lesson05: SqlLesson = {
  id: 'sql-05',
  title: 'Sorting, Limiting, and Pagination',
  slug: '05-sorting-limiting',
  chapter: 'querying',
  order: 5,
  difficulty: 'beginner',
  readingTime: 10,
  description: 'Sort query results with ORDER BY, limit rows with LIMIT and OFFSET, and implement efficient pagination.',
  sections: [
    {
      type: 'text',
      content: 'Without ORDER BY, SQL results come back in no guaranteed order. The database returns rows in whatever order is most convenient for its query plan - usually the order they are stored on disk, but this can change after updates or deletions. Always use ORDER BY when the order of results matters to your application.'
    },
    {
      type: 'heading',
      content: 'ORDER BY'
    },
    {
      type: 'text',
      content: 'ORDER BY sorts the result set by one or more columns. ASC (ascending) sorts from smallest to largest, A to Z, oldest to newest - and is the default if you omit the direction. DESC (descending) sorts in the opposite direction: largest first, Z to A, newest first.'
    },
    {
      type: 'text',
      content: 'You can sort by multiple columns: the first column is sorted first, and ties are broken by the second column. This is commonly used to sort by a primary criterion and then alphabetically within tied values.'
    },
    {
      type: 'heading',
      content: 'NULL Sort Order'
    },
    {
      type: 'text',
      content: 'NULL values have an undefined sort position in standard SQL. Different databases place NULLs differently by default: PostgreSQL sorts NULLs last for ASC and first for DESC. You can control this explicitly with NULLS FIRST or NULLS LAST.'
    },
    {
      type: 'example',
      title: 'ORDER BY with Multiple Columns',
      content: 'Sorting by plan descending, then by name ascending within each plan group, and controlling NULL placement.',
      code: `-- Sort by a single column ascending (default)
SELECT id, first_name, plan, created_at
FROM users
ORDER BY created_at;

-- Sort descending: newest users first
SELECT id, first_name, plan, created_at
FROM users
ORDER BY created_at DESC;

-- Sort by multiple columns: plan first, then name within each plan
SELECT id, first_name, last_name, plan
FROM users
ORDER BY plan ASC, last_name ASC, first_name ASC;

-- Control NULL placement (PostgreSQL)
SELECT id, first_name, last_login
FROM users
ORDER BY last_login DESC NULLS LAST;`,
      language: 'sql'
    },
    {
      type: 'heading',
      content: 'LIMIT and OFFSET'
    },
    {
      type: 'text',
      content: 'LIMIT restricts the number of rows returned. This is essential for performance - retrieving 10,000 rows when you only need the top 10 wastes database resources, network bandwidth, and application memory. Always LIMIT queries that could return large result sets.'
    },
    {
      type: 'text',
      content: 'OFFSET skips a specified number of rows before returning results. Combined with LIMIT, this implements classic page-based pagination: LIMIT 20 OFFSET 40 returns rows 41-60 (page 3 with 20 rows per page).'
    },
    {
      type: 'heading',
      content: 'Pagination Patterns'
    },
    {
      type: 'text',
      content: 'There are two main approaches to pagination in SQL: offset-based pagination (using LIMIT/OFFSET) and cursor-based pagination (using a WHERE clause on the last-seen ID or timestamp).'
    },
    {
      type: 'table',
      title: 'Offset vs Cursor Pagination',
      headers: ['Factor', 'Offset Pagination', 'Cursor Pagination'],
      rows: [
        ['Implementation', 'Simple: LIMIT n OFFSET m', 'More complex: WHERE id > last_id LIMIT n'],
        ['Performance', 'Slow on large offsets (must scan and skip rows)', 'Fast regardless of position - uses index'],
        ['Consistency', 'Can show duplicates or miss rows if data changes', 'Stable - anchored to a specific row'],
        ['Random access', 'Yes - can jump to any page number', 'No - sequential only'],
        ['Best for', 'Admin dashboards, small datasets, numbered pages', 'Infinite scroll, large datasets, real-time feeds']
      ]
    },
    {
      type: 'text',
      content: 'Offset pagination degrades in performance as offset grows. OFFSET 100000 forces the database to read and discard 100,000 rows before returning yours. For large tables, cursor pagination is significantly faster because it uses an index lookup directly to the right position.'
    },
    {
      type: 'example',
      title: 'Pagination Patterns',
      content: 'Offset-based pagination for numbered pages, and cursor-based pagination for infinite scroll or large datasets.',
      code: `-- Offset pagination: page 3 with 20 rows per page
SELECT id, first_name, email, plan
FROM users
ORDER BY created_at DESC
LIMIT 20 OFFSET 40;  -- skip 2 * 20 = 40 rows

-- FETCH FIRST syntax (SQL standard, works in PostgreSQL)
SELECT id, first_name, email
FROM users
ORDER BY created_at DESC
FETCH FIRST 20 ROWS ONLY;

-- Cursor pagination: get next page after last seen ID
-- Much faster on large tables because it uses the primary key index
SELECT id, first_name, email, created_at
FROM users
WHERE id > 1234  -- 1234 = id of last row from previous page
ORDER BY id ASC
LIMIT 20;

-- Get the previous page (reverse direction)
SELECT * FROM (
  SELECT id, first_name, email, created_at
  FROM users
  WHERE id < 1234
  ORDER BY id DESC
  LIMIT 20
) AS page
ORDER BY id ASC;`,
      language: 'sql'
    },
    {
      type: 'tip',
      title: 'Always ORDER BY with LIMIT',
      content: 'LIMIT without ORDER BY returns an arbitrary subset of rows. Which rows you get may change between queries. LIMIT is only meaningful when combined with ORDER BY, which defines a stable ordering.'
    },
    {
      type: 'note',
      title: 'MySQL LIMIT Syntax',
      content: 'MySQL supports a two-argument form: LIMIT offset, count (e.g., LIMIT 40, 20 means skip 40, return 20). Most databases use the LIMIT count OFFSET skip form. Using the explicit OFFSET keyword is clearer and more portable.'
    },
    {
      type: 'tryit',
      title: 'Pagination Simulator',
      js: `document.body.innerHTML = \`
<style>
body { padding: 20px; font-family: system-ui, sans-serif; background: #f7fafc; margin: 0; }
h3 { color: #336791; margin: 0 0 4px 0; font-size: 15px; font-weight: 700; }
#info { font-size: 12px; color: #718096; margin: 8px 0; }
#sql { display: block; font-family: monospace; font-size: 12px; background: #1a3347; color: #90cdf4; padding: 8px 12px; border-radius: 6px; margin: 8px 0 12px 0; }
.pager { display: flex; align-items: center; gap: 12px; margin-top: 12px; }
button { padding: 7px 18px; background: #336791; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; }
button:disabled { background: #a0aec0; cursor: not-allowed; }
#page { font-size: 13px; color: #4a5568; font-weight: 600; }
</style>
<div>
  <h3>📄 Pagination Simulator - LIMIT and OFFSET</h3>
  <div id="info"></div>
  <code id="sql"></code>
  <div id="table"></div>
  <div class="pager">
    <button id="prev">← Previous</button>
    <span id="page"></span>
    <button id="next">Next →</button>
  </div>
</div>
\`;

const allUsers = Array.from({ length: 47 }, (_, i) => ({
  id: i + 1,
  name: ['Alice','Bob','Carol','Dan','Eve','Frank','Grace','Henry','Iris','Jack'][i % 10] + ' ' + String.fromCharCode(65 + (i % 26)),
  plan: ['free','pro','free','enterprise','pro'][i % 5],
  joined: '2024-0' + (1 + i % 9) + '-' + String(1 + (i * 7) % 28).padStart(2,'0'),
}));

const PAGE_SIZE = 8;
let currentPage = 1;
const totalPages = Math.ceil(allUsers.length / PAGE_SIZE);

function renderTable(rows) {
  const head = ['id','name','plan','joined'].map(c =>
    \`<th style="background:#336791;color:white;padding:6px 12px;text-align:left;font-size:11px;font-weight:700">\${c}</th>\`
  ).join('');
  const body = rows.map((r, i) =>
    \`<tr style="background:\${i%2===0?'#fff':'#f8fafc'}">\${Object.values(r).map(v =>
      \`<td style="padding:6px 12px;font-size:12px;font-family:monospace;border-bottom:1px solid #e2e8f0">\${v}</td>\`
    ).join('')}</tr>\`
  ).join('');
  return \`<table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden"><thead><tr>\${head}</tr></thead><tbody>\${body}</tbody></table>\`;
}

function render() {
  const offset = (currentPage - 1) * PAGE_SIZE;
  const rows = allUsers.slice(offset, offset + PAGE_SIZE);
  document.getElementById('table').innerHTML = renderTable(rows);
  document.getElementById('info').textContent =
    \`Showing rows \${offset + 1}--\${Math.min(offset + PAGE_SIZE, allUsers.length)} of \${allUsers.length} (LIMIT \${PAGE_SIZE} OFFSET \${offset})\`;
  document.getElementById('sql').textContent =
    \`SELECT * FROM users ORDER BY id LIMIT \${PAGE_SIZE} OFFSET \${offset};\`;
  document.getElementById('prev').disabled = currentPage === 1;
  document.getElementById('next').disabled = currentPage === totalPages;
  document.getElementById('page').textContent = \`Page \${currentPage} of \${totalPages}\`;
}

document.getElementById('prev').addEventListener('click', () => { if (currentPage > 1) { currentPage--; render(); } });
document.getElementById('next').addEventListener('click', () => { if (currentPage < totalPages) { currentPage++; render(); } });
render();`,
      css: ``
    }
  ],
  exercises: [
    {
      id: 'ex-sql-5-1',
      question: 'What is the default sort direction when you write ORDER BY column?',
      type: 'multiple-choice',
      options: ['DESC (descending)', 'ASC (ascending)', 'The order is random', 'It depends on the data type'],
      correct: 1,
      explanation: 'ASC (ascending) is the default sort direction. ORDER BY name is equivalent to ORDER BY name ASC. Descending order must be requested explicitly with DESC.'
    },
    {
      id: 'ex-sql-5-2',
      question: 'What does LIMIT 10 OFFSET 20 return?',
      type: 'multiple-choice',
      options: [
        'The first 20 rows, limited to 10 columns',
        'Rows 21 through 30 (skip 20, return the next 10)',
        'Rows 1 through 10, with a 20-second timeout',
        'The last 10 rows of the result'
      ],
      correct: 1,
      explanation: 'OFFSET 20 skips the first 20 rows, and LIMIT 10 returns the next 10. So you get rows 21-30 - this is page 3 of a 10-rows-per-page pagination scheme (pages are 1-10, 11-20, 21-30, ...).'
    },
    {
      id: 'ex-sql-5-3',
      question: 'Why is cursor-based pagination faster than offset pagination on large tables?',
      type: 'multiple-choice',
      options: [
        'It uses a different SQL dialect',
        'Offset pagination must scan and skip all preceding rows, while cursor pagination uses an index to jump directly to the right position',
        'Cursor pagination returns fewer columns',
        'Offset pagination is not supported in PostgreSQL'
      ],
      correct: 1,
      explanation: 'OFFSET n forces the database to read and discard n rows before returning your results. With OFFSET 100000, the DB must process 100,000 rows. Cursor pagination uses WHERE id > last_id, which lets the B-tree index jump directly to the right position.'
    }
  ],
  quiz: [
    {
      id: 'q-sql-5-1',
      question: 'What happens if you use LIMIT without ORDER BY?',
      options: [
        'An error is thrown',
        'Results are sorted alphabetically by the first column',
        'An arbitrary subset is returned - the specific rows may vary between queries',
        'The database returns the first rows in insertion order'
      ],
      correct: 2,
      explanation: 'Without ORDER BY, the database has no obligation to return rows in any particular order. The result set can vary depending on the query plan, indexes used, and physical row layout. LIMIT without ORDER BY gives you an unpredictable subset.'
    },
    {
      id: 'q-sql-5-2',
      question: 'Which syntax is the SQL standard way to limit rows?',
      options: ['LIMIT n', 'TOP n', 'FETCH FIRST n ROWS ONLY', 'ROWNUM <= n'],
      correct: 2,
      explanation: 'FETCH FIRST n ROWS ONLY is the SQL standard syntax (SQL:2008). LIMIT n is a PostgreSQL/MySQL extension. TOP n is SQL Server syntax. ROWNUM is Oracle syntax. All accomplish the same goal but with different syntax.'
    },
    {
      id: 'q-sql-5-3',
      question: 'How does PostgreSQL handle NULL values in ORDER BY ASC by default?',
      options: [
        'NULLs come first',
        'NULLs come last',
        'NULLs are excluded from the result',
        'NULLs cause an error'
      ],
      correct: 1,
      explanation: 'In PostgreSQL, NULL values are treated as larger than any non-NULL value by default. So in ASC order, NULLs appear last. In DESC order, NULLs appear first. Use NULLS FIRST or NULLS LAST to override.'
    }
  ]
};
