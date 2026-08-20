import type { PostgresqlLesson } from '../postgresql-curriculum';

export const lesson07: PostgresqlLesson = {
  id: 'postgresql-07',
  title: 'Aggregation and Grouping',
  slug: '07-aggregation',
  chapter: 'queries',
  order: 7,
  difficulty: 'intermediate',
  readingTime: 14,
  description: 'Go beyond basic aggregates to master GROUP BY, HAVING, window functions, CTEs, and helper functions like COALESCE and NULLIF.',
  sections: [
    {
      type: 'text',
      content: 'Aggregation is what transforms raw rows into insights. PostgreSQL offers powerful grouping, window functions, and Common Table Expressions (CTEs) that let you write complex analytical queries clearly.'
    },
    {
      type: 'heading',
      content: 'GROUP BY Deep Dive'
    },
    {
      type: 'text',
      content: 'GROUP BY collapses multiple rows that share the same value(s) in the specified columns into a single summary row. Every column in SELECT must either be in GROUP BY or wrapped in an aggregate function.'
    },
    {
      type: 'example',
      title: 'GROUP BY with Multiple Columns',
      content: 'Grouping by department and job title:',
      code: `-- Group by one column
SELECT department, COUNT(*) AS headcount
FROM employees
GROUP BY department
ORDER BY headcount DESC;

-- Group by multiple columns
SELECT department, job_title, AVG(salary) AS avg_salary
FROM employees
GROUP BY department, job_title
ORDER BY department, avg_salary DESC;

-- Aggregating dates
SELECT
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*)                        AS new_users
FROM users
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;`,
      language: 'sql',
      output: ' department  | headcount \n-------------+-----------\n Engineering |        12\n Marketing   |         6\n Sales       |         8\n(3 rows)'
    },
    {
      type: 'heading',
      content: 'HAVING vs WHERE'
    },
    {
      type: 'example',
      title: 'Filtering Before and After Grouping',
      content: 'Combining WHERE (before group) and HAVING (after group):',
      code: `-- WHERE filters rows BEFORE grouping
-- HAVING filters groups AFTER grouping

SELECT
  department,
  COUNT(*)         AS headcount,
  ROUND(AVG(salary), 2) AS avg_salary
FROM employees
WHERE is_active = true           -- only active employees (before group)
GROUP BY department
HAVING AVG(salary) > 60000       -- only departments with high avg salary (after group)
ORDER BY avg_salary DESC;`,
      language: 'sql',
      output: ' department  | headcount | avg_salary \n-------------+-----------+------------\n Engineering |        10 |   95000.00\n Sales       |         6 |   72000.00\n(2 rows)'
    },
    {
      type: 'heading',
      content: 'ROUND, COALESCE, and NULLIF'
    },
    {
      type: 'example',
      title: 'Helper Functions for Clean Output',
      content: 'Functions that make query results cleaner and NULL-safe:',
      code: `-- ROUND: round to N decimal places
SELECT ROUND(AVG(salary), 2) AS avg_salary FROM employees;

-- COALESCE: return the first non-NULL value
SELECT
  name,
  COALESCE(phone, email, 'no contact') AS contact
FROM users;

-- NULLIF: return NULL if two values are equal (avoid division by zero)
SELECT
  department,
  total_revenue / NULLIF(total_cost, 0) AS margin_ratio
FROM department_stats;

-- Combining them
SELECT
  COALESCE(department, 'Unknown') AS dept,
  ROUND(AVG(salary), 0)           AS avg_sal,
  COUNT(*) FILTER (WHERE is_active = true) AS active_count
FROM employees
GROUP BY department;`,
      language: 'sql',
      output: ' dept        | avg_sal | active_count \n-------------+---------+--------------\n Engineering |   95000 |           10\n Marketing   |   55000 |            5\n Unknown     |   48000 |            3'
    },
    {
      type: 'note',
      title: 'FILTER with Aggregates',
      content: 'The FILTER (WHERE ...) clause lets you apply a condition to a specific aggregate without affecting the rest of the query. This is more efficient than using multiple subqueries.'
    },
    {
      type: 'heading',
      content: 'Window Functions'
    },
    {
      type: 'text',
      content: 'Window functions compute a value for each row based on a "window" of related rows, without collapsing the rows. They are like aggregates but preserve every row in the output.'
    },
    {
      type: 'example',
      title: 'ROW_NUMBER and RANK',
      content: 'Ranking rows within partitions:',
      code: `-- ROW_NUMBER: unique sequential number within each partition
SELECT
  name,
  department,
  salary,
  ROW_NUMBER() OVER (
    PARTITION BY department
    ORDER BY salary DESC
  ) AS rank_in_dept
FROM employees;

-- RANK: like ROW_NUMBER but ties get the same rank (with gaps)
-- DENSE_RANK: like RANK but without gaps after ties
SELECT
  name, salary,
  RANK()       OVER (ORDER BY salary DESC) AS rank,
  DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rank
FROM employees;`,
      language: 'sql',
      output: '    name    | department  | salary  | rank_in_dept \n------------+-------------+---------+--------------\n Emma       | Engineering | 120000  |            1\n Liam       | Engineering | 115000  |            2\n Noah       | Engineering | 110000  |            3'
    },
    {
      type: 'example',
      title: 'Running Totals and Moving Averages',
      content: 'Cumulative and analytical window calculations:',
      code: `-- Running total of sales
SELECT
  sale_date,
  amount,
  SUM(amount) OVER (ORDER BY sale_date) AS running_total
FROM sales;

-- 7-day moving average
SELECT
  sale_date,
  amount,
  AVG(amount) OVER (
    ORDER BY sale_date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS moving_avg_7d
FROM daily_sales;`,
      language: 'sql',
      output: ' sale_date  | amount | running_total \n------------+--------+---------------\n 2024-01-01 |   1000 |          1000\n 2024-01-02 |   1500 |          2500\n 2024-01-03 |   1200 |          3700'
    },
    {
      type: 'heading',
      content: 'CTEs -- WITH Clause'
    },
    {
      type: 'text',
      content: 'A Common Table Expression (CTE) defines a named temporary result set that you can reference within the same query. CTEs make complex queries readable by breaking them into named steps.'
    },
    {
      type: 'example',
      title: 'Basic and Multi-Step CTEs',
      content: 'Using CTEs to organize complex queries:',
      code: `-- Basic CTE
WITH high_earners AS (
  SELECT * FROM employees WHERE salary > 100000
)
SELECT department, COUNT(*) AS count
FROM high_earners
GROUP BY department;

-- Multi-step CTE (like named query variables)
WITH
  monthly_sales AS (
    SELECT
      DATE_TRUNC('month', created_at) AS month,
      SUM(total)                      AS revenue
    FROM orders
    WHERE status = 'completed'
    GROUP BY 1
  ),
  with_growth AS (
    SELECT
      month,
      revenue,
      LAG(revenue) OVER (ORDER BY month) AS prev_revenue
    FROM monthly_sales
  )
SELECT
  month,
  revenue,
  ROUND((revenue - prev_revenue) / NULLIF(prev_revenue, 0) * 100, 1) AS growth_pct
FROM with_growth
ORDER BY month;`,
      language: 'sql',
      output: '     month      | revenue  | growth_pct \n-----------------+----------+------------\n 2024-01-01 00:00|  12500.00|       NULL\n 2024-02-01 00:00|  15300.00|       22.4\n 2024-03-01 00:00|  14100.00|       -7.8'
    },
    {
      type: 'tip',
      title: 'CTEs vs Subqueries',
      content: 'Use CTEs when the same subquery is needed more than once, or when a query has multiple logical steps that are hard to read nested. CTEs are evaluated once and re-used, but PostgreSQL may materialize them differently -- check EXPLAIN if performance is critical.'
    },
    {
      type: 'tryit',
      title: 'Aggregation Dashboard',
      js: `const output = document.getElementById('output');

const employees = [
  { name:'Alice',   dept:'Engineering', salary:120000 },
  { name:'Bob',     dept:'Engineering', salary:115000 },
  { name:'Carol',   dept:'Engineering', salary:105000 },
  { name:'Dave',    dept:'Marketing',   salary: 72000 },
  { name:'Eve',     dept:'Marketing',   salary: 68000 },
  { name:'Frank',   dept:'Sales',       salary: 85000 },
  { name:'Grace',   dept:'Sales',       salary: 78000 },
  { name:'Hank',    dept:'Sales',       salary: 82000 },
  { name:'Iris',    dept:'HR',          salary: 65000 },
  { name:'Jack',    dept:'Engineering', salary: 98000 }
];

const depts = [...new Set(employees.map(e => e.dept))].sort();

const stats = depts.map(dept => {
  const group = employees.filter(e => e.dept === dept);
  const salaries = group.map(e => e.salary);
  return {
    dept,
    count: group.length,
    total: salaries.reduce((a,b)=>a+b,0),
    avg: Math.round(salaries.reduce((a,b)=>a+b,0) / salaries.length),
    min: Math.min(...salaries),
    max: Math.max(...salaries)
  };
});

const maxTotal = Math.max(...stats.map(s => s.total));

function fmt(n) { return '$' + n.toLocaleString(); }

let html = '<div style="padding:16px;font-family:system-ui,sans-serif">';
html += '<h3 style="color:#336791;margin:0 0 4px">Employee Salary Dashboard</h3>';
html += '<p style="color:#64748b;font-size:12px;margin:0 0 16px">GROUP BY department -- salary aggregates</p>';

// Bar chart
html += '<div style="margin-bottom:20px">';
html += '<p style="font-size:11px;font-weight:700;color:#475569;margin:0 0 10px;text-transform:uppercase;letter-spacing:.05em">Total Payroll by Department</p>';
stats.forEach(s => {
  const pct = Math.round((s.total / maxTotal) * 100);
  const colors = { Engineering:'#336791', Marketing:'#7c3aed', Sales:'#15803d', HR:'#c2410c' };
  const col = colors[s.dept] || '#64748b';
  html += \`<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">\`;
  html += \`<div style="width:100px;font-size:12px;font-weight:600;color:#374151">\${s.dept}</div>\`;
  html += \`<div style="flex:1;background:#f1f5f9;border-radius:4px;height:24px;overflow:hidden">\`;
  html += \`<div style="background:\${col};width:\${pct}%;height:100%;border-radius:4px;display:flex;align-items:center;padding-left:8px;transition:width .5s">\`;
  html += \`<span style="color:white;font-size:11px;font-weight:700;white-space:nowrap">\${fmt(s.total)}</span></div></div>\`;
  html += \`<div style="font-size:11px;color:#64748b;width:20px">\${pct}%</div>\`;
  html += '</div>';
});
html += '</div>';

// Stats table
html += '<table style="width:100%;border-collapse:collapse;font-size:12px">';
html += '<thead><tr style="background:#336791;color:white">';
['Department','Headcount','Avg Salary','Min','Max','Total'].forEach(h => {
  html += \`<th style="padding:8px 12px;text-align:left;font-size:11px;letter-spacing:.05em">\${h}</th>\`;
});
html += '</tr></thead><tbody>';
stats.forEach((s,i) => {
  html += \`<tr style="background:\${i%2===0?'#fff':'#f8fafc'};border-bottom:1px solid #e2e8f0">\`;
  html += \`<td style="padding:8px 12px;font-weight:600">\${s.dept}</td>\`;
  html += \`<td style="padding:8px 12px;font-family:monospace">\${s.count}</td>\`;
  html += \`<td style="padding:8px 12px;font-family:monospace;color:#336791;font-weight:700">\${fmt(s.avg)}</td>\`;
  html += \`<td style="padding:8px 12px;font-family:monospace;color:#15803d">\${fmt(s.min)}</td>\`;
  html += \`<td style="padding:8px 12px;font-family:monospace;color:#7c3aed">\${fmt(s.max)}</td>\`;
  html += \`<td style="padding:8px 12px;font-family:monospace;font-weight:700">\${fmt(s.total)}</td>\`;
  html += '</tr>';
});

const grand = { count: employees.length, total: employees.reduce((a,e)=>a+e.salary,0), avg: Math.round(employees.reduce((a,e)=>a+e.salary,0)/employees.length) };
html += \`<tr style="background:#f0f4ff;font-weight:700;border-top:2px solid #336791">\`;
html += \`<td style="padding:8px 12px">ALL DEPTS</td>\`;
html += \`<td style="padding:8px 12px;font-family:monospace">\${grand.count}</td>\`;
html += \`<td style="padding:8px 12px;font-family:monospace;color:#336791">\${fmt(grand.avg)}</td>\`;
html += '<td colspan="2"></td>';
html += \`<td style="padding:8px 12px;font-family:monospace">\${fmt(grand.total)}</td>\`;
html += '</tr>';
html += '</tbody></table></div>';

output.innerHTML = html;`,
      css: ''
    }
  ],
  exercises: [
    {
      id: 'ex-07-1',
      question: 'What is the key difference between GROUP BY and window functions?',
      type: 'multiple-choice',
      options: [
        'GROUP BY is faster than window functions',
        'GROUP BY collapses rows into one per group; window functions compute values per row without collapsing',
        'Window functions can only be used with ORDER BY',
        'GROUP BY works with numbers; window functions work with strings'
      ],
      correct: 1,
      explanation: 'GROUP BY reduces multiple rows to one per group, discarding individual row detail. Window functions compute aggregate values (like rank or running total) while preserving every individual row in the output.'
    },
    {
      id: 'ex-07-2',
      question: 'What does COALESCE(phone, email, \'no contact\') return?',
      type: 'multiple-choice',
      options: [
        'Always returns "no contact"',
        'The first non-NULL value among phone, email, and "no contact"',
        'Concatenates all three values',
        'Returns NULL if any of the values is NULL'
      ],
      correct: 1,
      explanation: 'COALESCE evaluates its arguments from left to right and returns the first non-NULL value. If phone is not NULL, it returns phone. If phone is NULL but email is not, it returns email. Only if both are NULL does it return "no contact".'
    },
    {
      id: 'ex-07-3',
      question: 'Which SQL feature lets you name a subquery and reference it multiple times in the same query?',
      type: 'multiple-choice',
      options: [
        'TEMP TABLE',
        'VIEW',
        'CTE (WITH clause)',
        'ALIAS'
      ],
      correct: 2,
      explanation: 'CTEs (Common Table Expressions), defined with the WITH keyword, create named temporary result sets that can be referenced multiple times within the same query. They improve readability for complex multi-step queries.'
    }
  ],
  quiz: [
    {
      id: 'q-07-1',
      question: 'Which function would you use to avoid a division-by-zero error?',
      options: ['COALESCE', 'NULLIF', 'ISNULL', 'IFNULL'],
      correct: 1,
      explanation: 'NULLIF(x, 0) returns NULL if x equals 0 (instead of the value 0). Dividing by NULL returns NULL rather than throwing a division-by-zero error. COALESCE is used to replace NULLs with fallback values.'
    },
    {
      id: 'q-07-2',
      question: 'What does RANK() OVER (ORDER BY score DESC) return for two rows with the same score?',
      options: [
        'Both get unique sequential numbers (1, 2)',
        'Both get the same rank number, and the next rank is skipped (e.g., both get 1, next is 3)',
        'Both get the same rank number, and the next rank follows immediately (e.g., both get 1, next is 2)',
        'An error is thrown for duplicate values'
      ],
      correct: 1,
      explanation: 'RANK() assigns the same number to tied rows but then skips the next number (1, 1, 3). DENSE_RANK() also ties but does not skip numbers (1, 1, 2). ROW_NUMBER() always assigns unique numbers regardless of ties.'
    },
    {
      id: 'q-07-3',
      question: 'In which order does PostgreSQL process the clauses of a SELECT query?',
      options: [
        'SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY',
        'FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY',
        'WHERE, FROM, SELECT, GROUP BY, HAVING, ORDER BY',
        'FROM, SELECT, WHERE, GROUP BY, ORDER BY, HAVING'
      ],
      correct: 1,
      explanation: 'PostgreSQL processes clauses in this logical order: FROM (which tables), WHERE (filter rows), GROUP BY (group rows), HAVING (filter groups), SELECT (compute output), ORDER BY (sort). This is why you cannot use SELECT aliases in WHERE or GROUP BY.'
    }
  ]
};
