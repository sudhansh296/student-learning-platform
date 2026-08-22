import type { SqlLesson } from '../sql-curriculum';

export const lesson06: SqlLesson = {
  id: 'sql-06',
  title: 'Aggregate Functions and GROUP BY',
  slug: '06-aggregates',
  chapter: 'querying',
  order: 6,
  difficulty: 'intermediate',
  readingTime: 12,
  description: 'Use COUNT, SUM, AVG, MIN, MAX to summarize data, group rows with GROUP BY, and filter groups with HAVING.',
  sections: [
    {
      type: 'text',
      content: 'Aggregate functions compute a single result from a set of rows. Instead of returning individual row data, they summarize groups of rows into statistics. Aggregation is the engine behind dashboards, reports, analytics queries, and any "how many" or "what is the total" question.'
    },
    {
      type: 'heading',
      content: 'Aggregate Functions'
    },
    {
      type: 'text',
      content: 'The five core aggregate functions cover the vast majority of summarization needs. Each operates on a column and returns a single value per group.'
    },
    {
      type: 'table',
      title: 'SQL Aggregate Functions',
      headers: ['Function', 'Returns', 'NULL Handling', 'Example Use'],
      rows: [
        ['COUNT(*)', 'Total rows in group', 'Includes rows with NULLs', 'Total number of users'],
        ['COUNT(column)', 'Rows where column is NOT NULL', 'Skips NULL values', 'Users with a phone number'],
        ['SUM(column)', 'Sum of all values', 'Skips NULL values', 'Total revenue'],
        ['AVG(column)', 'Average of all values', 'Skips NULL values', 'Average order value'],
        ['MIN(column)', 'Smallest value', 'Skips NULL values', 'Earliest registration date'],
        ['MAX(column)', 'Largest value', 'Skips NULL values', 'Most expensive product']
      ]
    },
    {
      type: 'text',
      content: 'The difference between COUNT(*) and COUNT(column) is important. COUNT(*) counts every row including those with NULLs in every column. COUNT(email) counts only rows where email is not NULL. Use COUNT(*) to count rows; use COUNT(column) to count non-NULL values in that column.'
    },
    {
      type: 'heading',
      content: 'GROUP BY'
    },
    {
      type: 'text',
      content: 'GROUP BY divides rows into groups based on one or more columns, then applies aggregate functions to each group separately. Without GROUP BY, aggregates operate on the entire table and return a single row.'
    },
    {
      type: 'text',
      content: 'The GROUP BY rule: every column in your SELECT list must either be inside an aggregate function OR be listed in the GROUP BY clause. This rule exists because the database needs to know how to produce a single output row per group — it can aggregate a column, or it can group by it, but it cannot return multiple different values for a non-grouped column.'
    },
    {
      type: 'note',
      title: 'The GROUP BY Rule',
      content: 'If you SELECT a column that is neither aggregated nor in GROUP BY, most databases will throw an error. PostgreSQL is strict about this. MySQL (in some modes) will silently return an arbitrary value from the group, which is almost certainly a bug.'
    },
    {
      type: 'heading',
      content: 'HAVING vs WHERE'
    },
    {
      type: 'text',
      content: 'WHERE filters individual rows before they are grouped. HAVING filters groups after aggregation. This distinction is critical: you cannot use aggregate functions in a WHERE clause because WHERE runs before grouping happens.'
    },
    {
      type: 'text',
      content: 'Think of it this way: WHERE asks "which individual rows participate?" and HAVING asks "which groups do I keep in the result?" If your condition involves an aggregate (COUNT, SUM, etc.), it must go in HAVING.'
    },
    {
      type: 'analogy',
      title: 'WHERE vs HAVING',
      content: 'Imagine organizing a library fundraiser. WHERE is the bouncer at the door — it decides which books are allowed in before you start counting. HAVING is the final audit — after you have counted and grouped everything, it removes groups that do not meet your criteria. You cannot count first and then apply the bouncer; the bouncer must act first.'
    },
    {
      type: 'heading',
      content: 'Common Aggregation Mistakes'
    },
    {
      type: 'list',
      title: 'Mistakes to avoid with aggregation:',
      items: [
        'Putting aggregate conditions in WHERE instead of HAVING: WHERE COUNT(*) > 5 is invalid — use HAVING COUNT(*) > 5',
        'Selecting non-grouped columns: SELECT name, COUNT(*) FROM orders GROUP BY status omits name from GROUP BY and is invalid',
        'Forgetting that AVG ignores NULLs: if 3 of 10 rows have NULL salary, AVG(salary) divides by 7 not 10',
        'Using COUNT(column) when you mean COUNT(*): COUNT(phone) counts non-null phones, not total users',
        'Grouping by a high-cardinality column (like user ID) that produces millions of single-row groups'
      ]
    },
    {
      type: 'example',
      title: 'GROUP BY with HAVING',
      content: 'Counting users by plan, calculating revenue per plan, and using HAVING to filter out low-value groups.',
      code: `-- Count users per subscription plan
SELECT plan, COUNT(*) AS user_count
FROM users
GROUP BY plan
ORDER BY user_count DESC;

-- Revenue statistics per product category
SELECT
  category,
  COUNT(*)          AS order_count,
  SUM(amount)       AS total_revenue,
  AVG(amount)       AS avg_order_value,
  MIN(amount)       AS min_order,
  MAX(amount)       AS max_order
FROM orders
GROUP BY category
ORDER BY total_revenue DESC;

-- HAVING: only show plans with more than 100 users
SELECT plan, COUNT(*) AS user_count
FROM users
GROUP BY plan
HAVING COUNT(*) > 100
ORDER BY user_count DESC;

-- Combining WHERE and HAVING:
-- WHERE filters before grouping (only active users)
-- HAVING filters groups (only plans with 10+ active users)
SELECT plan, COUNT(*) AS active_users
FROM users
WHERE is_active = true
GROUP BY plan
HAVING COUNT(*) >= 10
ORDER BY active_users DESC;`,
      language: 'sql'
    },
    {
      type: 'example',
      title: 'Aggregation with Date Grouping',
      content: 'Grouping orders by month to produce a monthly revenue report using date truncation.',
      code: `-- Monthly revenue report (PostgreSQL DATE_TRUNC)
SELECT
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*)     AS order_count,
  SUM(amount)  AS revenue
FROM orders
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Count users who registered each year
SELECT
  EXTRACT(YEAR FROM created_at) AS year,
  COUNT(*) AS signups
FROM users
GROUP BY EXTRACT(YEAR FROM created_at)
ORDER BY year DESC;`,
      language: 'sql'
    },
    {
      type: 'tip',
      title: 'COUNT DISTINCT',
      content: 'To count unique values, combine COUNT with DISTINCT: COUNT(DISTINCT user_id) counts unique users, not total rows. This is different from COUNT(user_id) which counts all non-NULL user_id values including repeats.'
    },
    {
      type: 'tryit',
      title: 'Aggregation Results Visualizer',
      js: `document.body.innerHTML = \`
<style>
body { padding: 20px; font-family: system-ui, sans-serif; background: #f7fafc; margin: 0; }
h3 { color: #336791; margin: 0 0 6px 0; font-size: 15px; font-weight: 700; }
p { color: #718096; font-size: 13px; margin: 0 0 14px 0; }
#btns { margin-bottom: 14px; }
</style>
<div>
  <h3>📊 Aggregation Results Visualizer</h3>
  <p>Click a button to see different aggregation functions in action</p>
  <div id="btns"></div>
  <div id="result"></div>
</div>
\`;

const orders = [
  { id:1, category:'Electronics', amount:299, plan:'pro' },
  { id:2, category:'Books', amount:35, plan:'free' },
  { id:3, category:'Electronics', amount:499, plan:'pro' },
  { id:4, category:'Clothing', amount:79, plan:'free' },
  { id:5, category:'Books', amount:22, plan:'pro' },
  { id:6, category:'Electronics', amount:149, plan:'enterprise' },
  { id:7, category:'Clothing', amount:199, plan:'pro' },
  { id:8, category:'Books', amount:45, plan:'free' },
  { id:9, category:'Electronics', amount:899, plan:'enterprise' },
  { id:10, category:'Clothing', amount:55, plan:'free' },
];

const aggregations = {
  'COUNT by category': () => {
    const m = {};
    orders.forEach(o => { m[o.category] = (m[o.category] || 0) + 1; });
    return Object.entries(m).map(([k, v]) => ({ category: k, count: v })).sort((a,b) => b.count - a.count);
  },
  'SUM revenue': () => {
    const m = {};
    orders.forEach(o => { m[o.category] = (m[o.category] || 0) + o.amount; });
    return Object.entries(m).map(([k, v]) => ({ category: k, total_revenue: '$' + v })).sort((a,b) => parseInt(b.total_revenue.slice(1)) - parseInt(a.total_revenue.slice(1)));
  },
  'AVG order value': () => {
    const count = {}, sum = {};
    orders.forEach(o => { count[o.category] = (count[o.category]||0)+1; sum[o.category] = (sum[o.category]||0)+o.amount; });
    return Object.keys(count).map(k => ({ category: k, avg_value: '$' + (sum[k]/count[k]).toFixed(2) }));
  },
};

let active = 'COUNT by category';

function renderTable(rows) {
  if (!rows.length) return '<p>No data</p>';
  const cols = Object.keys(rows[0]);
  const head = cols.map(c => \`<th style="background:#336791;color:white;padding:7px 12px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase">\${c}</th>\`).join('');
  const body = rows.map((r, i) =>
    \`<tr style="background:\${i%2===0?'#fff':'#f8fafc'}">\${cols.map(c => \`<td style="padding:7px 12px;font-size:13px;font-family:monospace;border-bottom:1px solid #e2e8f0">\${r[c]}</td>\`).join('')}</tr>\`
  ).join('');
  return \`<table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden"><thead><tr>\${head}</tr></thead><tbody>\${body}</tbody></table>\`;
}

function render() {
  document.getElementById('btns').innerHTML = Object.keys(aggregations).map(k =>
    \`<button onclick="setAgg('\${k}')" style="padding:7px 14px;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;margin-right:6px;background:\${k===active?'#336791':'#e2e8f0'};color:\${k===active?'white':'#4a5568'}">\${k}</button>\`
  ).join('');
  document.getElementById('result').innerHTML = renderTable(aggregations[active]());
}

window.setAgg = function(k) { active = k; render(); };
render();`,
      css: ``
    }
  ],
  exercises: [
    {
      id: 'ex-sql-6-1',
      question: 'What is the difference between COUNT(*) and COUNT(email)?',
      type: 'multiple-choice',
      options: [
        'COUNT(*) is faster; COUNT(email) is more accurate',
        'COUNT(*) counts all rows; COUNT(email) counts only rows where email is NOT NULL',
        'They return the same result when there are no NULLs',
        'COUNT(email) counts unique emails; COUNT(*) counts total rows'
      ],
      correct: 1,
      explanation: 'COUNT(*) counts every row in the group regardless of NULL values. COUNT(email) counts only rows where the email column has a non-NULL value. If 5 users have no email set, COUNT(*) returns 5 more than COUNT(email).'
    },
    {
      id: 'ex-sql-6-2',
      question: 'Why would this query fail: SELECT plan, name, COUNT(*) FROM users GROUP BY plan?',
      type: 'multiple-choice',
      options: [
        'COUNT(*) cannot be used with GROUP BY',
        'name is selected but is neither in GROUP BY nor inside an aggregate function',
        'GROUP BY must come before SELECT',
        'plan cannot be both selected and grouped'
      ],
      correct: 1,
      explanation: 'Every column in SELECT must either be inside an aggregate function or appear in GROUP BY. Since "name" is neither aggregated nor grouped, the database does not know which name to return per plan group (there are multiple).'
    },
    {
      id: 'ex-sql-6-3',
      question: 'Which clause filters groups after aggregation?',
      type: 'multiple-choice',
      options: ['WHERE', 'FILTER', 'HAVING', 'GROUP FILTER'],
      correct: 2,
      explanation: 'HAVING filters groups after GROUP BY and aggregation have been applied. WHERE filters individual rows before grouping. You must use HAVING when your condition involves an aggregate function like COUNT, SUM, or AVG.'
    }
  ],
  quiz: [
    {
      id: 'q-sql-6-1',
      question: 'If a column has 3 NULL values and 7 non-NULL numeric values, what does AVG(column) divide by?',
      options: ['10 (total rows)', '7 (non-NULL rows)', '3 (NULL rows)', 'It returns NULL if any NULLs exist'],
      correct: 1,
      explanation: 'AVG ignores NULL values. It divides the sum of non-NULL values by the count of non-NULL values. With 7 non-NULL values, AVG divides by 7. Use COALESCE(column, 0) if you want to treat NULLs as zero.'
    },
    {
      id: 'q-sql-6-2',
      question: 'How do you count only unique values in a column?',
      options: ['COUNT(UNIQUE column)', 'DISTINCT COUNT(column)', 'COUNT(DISTINCT column)', 'COUNT_UNIQUE(column)'],
      correct: 2,
      explanation: 'COUNT(DISTINCT column) counts the number of unique non-NULL values in the column. It is equivalent to counting the members of a SET containing all values. This is different from COUNT(column) which counts all non-NULL values including duplicates.'
    },
    {
      id: 'q-sql-6-3',
      question: 'You want to find categories with total revenue over $1000. Which is correct?',
      options: [
        'WHERE SUM(amount) > 1000',
        'HAVING SUM(amount) > 1000',
        'WHERE TOTAL(amount) > 1000',
        'FILTER SUM(amount) > 1000'
      ],
      correct: 1,
      explanation: 'Aggregate function results can only be filtered with HAVING, not WHERE. WHERE runs before GROUP BY and cannot reference aggregate results. HAVING runs after aggregation and can filter based on aggregate values.'
    }
  ]
};
