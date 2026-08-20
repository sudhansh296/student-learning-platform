import type { SqlLesson } from '../sql-curriculum';

export const lesson04: SqlLesson = {
  id: 'sql-04',
  title: 'Filtering with WHERE',
  slug: '04-where-filter',
  chapter: 'querying',
  order: 4,
  difficulty: 'beginner',
  readingTime: 12,
  description: 'Master the WHERE clause with comparison operators, AND/OR/NOT, LIKE pattern matching, BETWEEN, IN, and NULL checks.',
  sections: [
    {
      type: 'text',
      content: 'The WHERE clause is how you filter rows. Without WHERE, a SELECT returns every row in a table. With WHERE, you specify conditions that each row must satisfy to appear in the results. Mastering WHERE means mastering data retrieval — it is the most important clause after SELECT and FROM.'
    },
    {
      type: 'heading',
      content: 'Comparison Operators'
    },
    {
      type: 'text',
      content: 'Comparison operators test a relationship between two values and return true or false. These work on numbers, strings, and dates. String comparisons are case-sensitive by default in most databases (but case-insensitive in MySQL by default).'
    },
    {
      type: 'table',
      title: 'WHERE Comparison Operators',
      headers: ['Operator', 'Meaning', 'Example'],
      rows: [
        ['=', 'Equal to', 'WHERE plan = \'pro\''],
        ['!= or <>', 'Not equal to', 'WHERE plan != \'free\''],
        ['<', 'Less than', 'WHERE age < 18'],
        ['>', 'Greater than', 'WHERE price > 100'],
        ['<=', 'Less than or equal', 'WHERE age <= 65'],
        ['>=', 'Greater than or equal', 'WHERE score >= 90'],
      ]
    },
    {
      type: 'heading',
      content: 'AND, OR, and NOT'
    },
    {
      type: 'text',
      content: 'You combine multiple conditions using AND (both must be true), OR (at least one must be true), and NOT (inverts the condition). These logical operators let you express complex filtering logic in a single WHERE clause.'
    },
    {
      type: 'text',
      content: 'Operator precedence: NOT is evaluated first, then AND, then OR. This is just like arithmetic where multiplication comes before addition. Use parentheses to make complex conditions explicit and avoid bugs from unexpected precedence.'
    },
    {
      type: 'note',
      title: 'Always Use Parentheses for Mixed AND/OR',
      content: 'The condition WHERE a = 1 OR b = 2 AND c = 3 is parsed as WHERE a = 1 OR (b = 2 AND c = 3) because AND has higher precedence than OR. Add parentheses to make your intent explicit: WHERE (a = 1 OR b = 2) AND c = 3.'
    },
    {
      type: 'heading',
      content: 'LIKE and ILIKE Pattern Matching'
    },
    {
      type: 'text',
      content: 'LIKE performs pattern matching on strings using two wildcard characters. It is how you search for partial string matches without writing complex conditions.'
    },
    {
      type: 'list',
      title: 'LIKE wildcard characters:',
      items: [
        '% (percent): matches zero or more characters of any kind',
        '_ (underscore): matches exactly one character of any kind',
        'ILIKE (PostgreSQL only): case-insensitive version of LIKE',
        'To match a literal % or _, escape with backslash: LIKE \'50\\%\''
      ]
    },
    {
      type: 'text',
      content: 'LIKE patterns can be slow on large tables because the database cannot use a standard B-tree index for leading wildcard patterns (like \'%smith\'). For full-text search, use dedicated full-text search features or a search service like Elasticsearch.'
    },
    {
      type: 'heading',
      content: 'BETWEEN'
    },
    {
      type: 'text',
      content: 'BETWEEN tests whether a value falls within an inclusive range. BETWEEN 10 AND 20 is equivalent to >= 10 AND <= 20. It works on numbers, dates, and strings. BETWEEN is inclusive on both ends, which is sometimes surprising — use explicit >= and <= comparisons if you need exclusive bounds.'
    },
    {
      type: 'heading',
      content: 'IN and NOT IN'
    },
    {
      type: 'text',
      content: 'IN tests whether a value matches any item in a list. It is a cleaner alternative to writing multiple OR conditions. NOT IN excludes rows where the column matches any value in the list.'
    },
    {
      type: 'warning',
      title: 'NOT IN and NULL',
      content: 'If the list in NOT IN contains a NULL value, the entire NOT IN condition returns NULL (unknown) for every row, effectively filtering out all rows. Always ensure your IN/NOT IN lists do not contain NULL. Use NOT EXISTS instead of NOT IN when the list comes from a subquery that might return NULLs.'
    },
    {
      type: 'heading',
      content: 'IS NULL and IS NOT NULL'
    },
    {
      type: 'text',
      content: 'NULL represents a missing or unknown value. You cannot use = or != to check for NULL — those comparisons always return NULL (unknown) when NULL is involved. The only correct way to check for NULL is with IS NULL or IS NOT NULL.'
    },
    {
      type: 'example',
      title: 'WHERE Clause Patterns',
      content: 'Practical WHERE examples covering comparison, AND/OR, LIKE, BETWEEN, IN, and NULL checks.',
      code: `-- Multiple conditions with AND
SELECT * FROM users
WHERE plan = 'pro' AND is_active = true;

-- OR with parentheses for clarity
SELECT * FROM products
WHERE (category = 'electronics' OR category = 'computers')
  AND price < 500;

-- LIKE: emails from gmail.com
SELECT email FROM users
WHERE email LIKE '%@gmail.com';

-- ILIKE: case-insensitive name search (PostgreSQL)
SELECT * FROM users
WHERE first_name ILIKE 'ali%';

-- BETWEEN: orders placed in August 2024
SELECT * FROM orders
WHERE created_at BETWEEN '2024-08-01' AND '2024-08-31';

-- IN: specific plans
SELECT * FROM users
WHERE plan IN ('pro', 'enterprise');

-- IS NULL: find users with no phone number
SELECT * FROM users
WHERE phone IS NULL;

-- IS NOT NULL: find users who have a bio
SELECT * FROM users
WHERE bio IS NOT NULL;`,
      language: 'sql'
    },
    {
      type: 'example',
      title: 'LIKE Pattern Examples',
      content: 'Demonstrating percent and underscore wildcards with concrete examples of what each pattern matches.',
      code: `-- % matches zero or more characters
WHERE name LIKE 'A%'      -- starts with A: Alice, Adam, Anna
WHERE name LIKE '%son'    -- ends with son: Johnson, Wilson
WHERE name LIKE '%ali%'   -- contains ali: Alice, Talia, Specialist

-- _ matches exactly one character
WHERE code LIKE 'A_'      -- two-char codes starting with A: A1, AB, A9
WHERE code LIKE '__-___'  -- pattern: two chars, dash, three chars: US-NYC

-- Combined
WHERE sku LIKE 'PROD-___-2024'  -- PROD-ABC-2024, PROD-XYZ-2024`,
      language: 'sql'
    },
    {
      type: 'tip',
      title: 'Index-Friendly Patterns',
      content: 'LIKE \'ali%\' (prefix search — no leading wildcard) can use a B-tree index and is fast. LIKE \'%ali%\' (contains search) and LIKE \'%ali\' (suffix search) cannot use a B-tree index and require a full table scan.'
    },
    {
      type: 'tryit',
      title: 'WHERE Filter Simulator',
      js: `const rows = [
  { id: 1, name: 'Alice Chen', plan: 'pro', age: 28, active: true, email: 'alice@gmail.com' },
  { id: 2, name: 'Bob Smith', plan: 'free', age: 34, active: true, email: 'bob@yahoo.com' },
  { id: 3, name: 'Carol Davis', plan: 'pro', age: 22, active: false, email: 'carol@gmail.com' },
  { id: 4, name: 'Dan Lee', plan: 'free', age: 45, active: true, email: 'dan@company.com' },
  { id: 5, name: 'Eve Wilson', plan: 'pro', age: 31, active: true, email: 'eve@gmail.com' },
  { id: 6, name: 'Frank Brown', plan: 'enterprise', age: 52, active: true, email: 'frank@corp.com' },
];

const filters = [
  { label: 'All rows', fn: () => rows },
  { label: 'plan = pro', fn: () => rows.filter(r => r.plan === 'pro') },
  { label: 'age > 30', fn: () => rows.filter(r => r.age > 30) },
  { label: 'email LIKE %gmail%', fn: () => rows.filter(r => r.email.includes('gmail')) },
  { label: 'active = true', fn: () => rows.filter(r => r.active) },
  { label: 'plan IN (pro, enterprise)', fn: () => rows.filter(r => ['pro','enterprise'].includes(r.plan)) },
];

let active = 0;

function renderTable(data) {
  if (!data.length) return '<p style="color:#718096;font-size:13px;padding:12px 0">No matching rows</p>';
  const cols = Object.keys(data[0]);
  const head = cols.map(c => \`<th style="background:#336791;color:white;padding:7px 12px;text-align:left;font-size:11px;font-weight:700">\${c}</th>\`).join('');
  const body = data.map((r, i) =>
    \`<tr style="background:\${i%2===0?'#fff':'#f8fafc'}">\${cols.map(c => \`<td style="padding:6px 12px;font-size:12px;font-family:monospace;border-bottom:1px solid #e2e8f0">\${String(r[c])}</td>\`).join('')}</tr>\`
  ).join('');
  return \`<table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden"><thead><tr>\${head}</tr></thead><tbody>\${body}</tbody></table>\`;
}

function render() {
  document.getElementById('filters').innerHTML = filters.map((f, i) =>
    \`<button onclick="applyFilter(\${i})" style="display:block;width:100%;text-align:left;padding:8px 12px;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;margin-bottom:4px;background:\${i===active?'#336791':'#e2e8f0'};color:\${i===active?'white':'#4a5568'}">\${f.label}</button>\`
  ).join('');
  const result = filters[active].fn();
  document.getElementById('result').innerHTML = renderTable(result);
  document.getElementById('count').textContent = result.length + ' of ' + rows.length + ' rows match';
}

window.applyFilter = function(i) { active = i; render(); };
render();`,
      css: `body { padding: 20px; font-family: system-ui, sans-serif; background: #f7fafc; }
h3 { color: #336791; margin: 0 0 6px 0; font-size: 15px; font-weight: 700; }
p { color: #718096; font-size: 13px; margin: 0 0 14px 0; }
.layout { display: flex; gap: 16px; }
#filters { width: 180px; flex-shrink: 0; }
#right { flex: 1; min-width: 0; }
#count { font-size: 12px; color: #718096; margin-top: 8px; }`
    }
  ],
  exercises: [
    {
      id: 'ex-sql-4-1',
      question: 'Which query correctly finds users whose name starts with "Jo"?',
      type: 'multiple-choice',
      options: [
        'WHERE name = "Jo%"',
        'WHERE name LIKE \'Jo%\'',
        'WHERE name CONTAINS \'Jo\'',
        'WHERE name STARTS WITH \'Jo\''
      ],
      correct: 1,
      explanation: 'LIKE with the % wildcard matches the pattern. \'Jo%\' means "starts with Jo followed by zero or more characters". The single quotes around the pattern are required in SQL.'
    },
    {
      id: 'ex-sql-4-2',
      question: 'What does WHERE age BETWEEN 20 AND 30 include?',
      type: 'multiple-choice',
      options: [
        'Ages 21 through 29 (exclusive of 20 and 30)',
        'Ages 20 through 30 (inclusive of both 20 and 30)',
        'Ages greater than 20 and less than 30',
        'It depends on the database — behavior is inconsistent'
      ],
      correct: 1,
      explanation: 'BETWEEN is always inclusive on both ends. BETWEEN 20 AND 30 is identical to >= 20 AND <= 30. It includes the boundary values 20 and 30.'
    },
    {
      id: 'ex-sql-4-3',
      question: 'Why is WHERE phone = NULL incorrect for finding rows with no phone number?',
      type: 'multiple-choice',
      options: [
        'NULL must be quoted as \'NULL\'',
        'NULL comparisons with = always return NULL (unknown), never true',
        'The correct syntax is WHERE phone == NULL',
        'It would work, but IS NULL is preferred for readability'
      ],
      correct: 1,
      explanation: 'In SQL, NULL = NULL evaluates to NULL (unknown), not true. Comparisons involving NULL always return NULL. The only correct way to test for NULL is with IS NULL or IS NOT NULL.'
    }
  ],
  quiz: [
    {
      id: 'q-sql-4-1',
      question: 'What does the _ wildcard in LIKE match?',
      options: [
        'Zero or more characters',
        'Exactly one character',
        'Any digit (0-9)',
        'A literal underscore only'
      ],
      correct: 1,
      explanation: 'The underscore _ in a LIKE pattern matches exactly one character of any kind. The percent % matches zero or more characters. For example, LIKE \'A_\' matches "AB", "A1", "Az" but not "A" or "ABC".'
    },
    {
      id: 'q-sql-4-2',
      question: 'Given WHERE a = 1 OR b = 2 AND c = 3, how does SQL evaluate this?',
      options: [
        '(a = 1 OR b = 2) AND c = 3',
        'a = 1 OR (b = 2 AND c = 3)',
        'SQL evaluates left to right with no precedence',
        'It is a syntax error without parentheses'
      ],
      correct: 1,
      explanation: 'AND has higher precedence than OR in SQL, just like multiplication over addition. So the expression is parsed as: a = 1 OR (b = 2 AND c = 3). Always add explicit parentheses to avoid surprises.'
    },
    {
      id: 'q-sql-4-3',
      question: 'Which operator tests if a value matches any item in a list?',
      options: ['CONTAINS', 'ANY', 'IN', 'WITHIN'],
      correct: 2,
      explanation: 'The IN operator checks if a value matches any item in a parenthesized list. WHERE plan IN (\'pro\', \'enterprise\') is equivalent to WHERE plan = \'pro\' OR plan = \'enterprise\', but cleaner.'
    }
  ]
};
