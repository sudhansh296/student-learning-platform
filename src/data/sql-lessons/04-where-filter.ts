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
      title: 'WHERE Clause Builder',
      css: ``,
      js: `// Build the entire UI with DOM - no innerHTML with inline handlers
document.body.style.cssText = 'font-family:system-ui,sans-serif;padding:14px;background:#f7fafc;margin:0;box-sizing:border-box';

var DATA=[
  {id:1,name:'Alice Chen',  plan:'pro',        age:28,active:true, email:'alice@gmail.com',  city:'Boston' },
  {id:2,name:'Bob Smith',   plan:'free',       age:34,active:true, email:'bob@yahoo.com',    city:'NYC'    },
  {id:3,name:'Carol Davis', plan:'pro',        age:22,active:false,email:'carol@gmail.com',  city:'Boston' },
  {id:4,name:'Dan Lee',     plan:'free',       age:45,active:true, email:'dan@company.com',  city:'Chicago'},
  {id:5,name:'Eve Wilson',  plan:'pro',        age:31,active:true, email:'eve@gmail.com',    city:'NYC'    },
  {id:6,name:'Frank Brown', plan:'enterprise', age:52,active:true, email:'frank@corp.com',   city:'Chicago'},
  {id:7,name:'Grace Kim',   plan:'free',       age:19,active:false,email:'grace@student.edu',city:'Boston' },
  {id:8,name:'Henry Liu',   plan:'enterprise', age:41,active:true, email:'henry@corp.com',   city:'NYC'    },
];
var COLS=['id','name','plan','age','active','email','city'];
var CTYPES={id:'number',name:'string',plan:'string',age:'number',active:'boolean',email:'string',city:'string'};
var STROPS=['=','!=','LIKE','NOT LIKE'];
var NUMOPS=['=','!=','>','<','>=','<='];
var BOOLOPS=['=','!='];
var conditions=[];
var sortCol='id',sortDir=1;

var PRESETS=[
  {label:'plan = pro',       conds:[{logic:'AND',col:'plan',op:'=',val:'pro'}]},
  {label:'age > 30',         conds:[{logic:'AND',col:'age',op:'>',val:'30'}]},
  {label:'city = Boston',    conds:[{logic:'AND',col:'city',op:'=',val:'Boston'}]},
  {label:'email LIKE gmail', conds:[{logic:'AND',col:'email',op:'LIKE',val:'gmail'}]},
  {label:'active = true',    conds:[{logic:'AND',col:'active',op:'=',val:'true'}]},
  {label:'age 20-35',        conds:[{logic:'AND',col:'age',op:'>=',val:'20'},{logic:'AND',col:'age',op:'<=',val:'35'}]},
];

function getOps(col){return CTYPES[col]==='number'?NUMOPS:CTYPES[col]==='boolean'?BOOLOPS:STROPS;}

function evalCond(row,c){
  var rv=row[c.col],cv=c.val,t=CTYPES[c.col]||'string';
  if(t==='number'){rv=Number(rv);cv=Number(cv);}
  else if(t==='boolean'){rv=!!rv;cv=(cv==='true'||cv===true);}
  else{rv=String(rv).toLowerCase();cv=String(cv).toLowerCase();}
  if(c.op==='=')return rv===cv;
  if(c.op==='!=')return rv!==cv;
  if(c.op==='>') return rv>cv;
  if(c.op==='<') return rv<cv;
  if(c.op==='>=')return rv>=cv;
  if(c.op==='<=')return rv<=cv;
  if(c.op==='LIKE')return String(row[c.col]).toLowerCase().includes(cv.replace(/%/g,''));
  if(c.op==='NOT LIKE')return !String(row[c.col]).toLowerCase().includes(cv.replace(/%/g,''));
  return true;
}

function applyFilter(){
  if(!conditions.length)return DATA.slice();
  return DATA.filter(function(row){
    var r=evalCond(row,conditions[0]);
    for(var i=1;i<conditions.length;i++){
      if(conditions[i].logic==='AND')r=r&&evalCond(row,conditions[i]);
      else r=r||evalCond(row,conditions[i]);
    }
    return r;
  });
}

function getSQL(){
  var parts=['SELECT * FROM users'];
  if(conditions.length){
    var w=conditions.map(function(c,i){
      var prefix=i===0?'':' '+c.logic+' ';
      var v=CTYPES[c.col]==='number'?c.val:(c.op==='LIKE'||c.op==='NOT LIKE'?'%'+c.val+'%':c.val);
      return prefix+c.col+' '+c.op+' '+v;
    }).join('');
    parts.push('WHERE'+w);
  }
  return parts.join(' ');
}

// ── build static skeleton ──────────────────────────
var style=document.createElement('style');
style.textContent=[
  '*{box-sizing:border-box}',
  '.top{background:white;border-radius:10px;padding:14px;border:1px solid #e2e8f0;margin-bottom:10px;}',
  '.lbl{font-size:10px;font-weight:700;color:#4a5568;text-transform:uppercase;letter-spacing:.05em;display:block;margin-bottom:3px;}',
  'select,input{padding:7px 10px;border:1.5px solid #e2e8f0;border-radius:6px;font-size:12px;font-family:monospace;outline:none;background:white;}',
  'select:focus,input:focus{border-color:#336791;}',
  '.btn{padding:7px 14px;border:none;border-radius:6px;cursor:pointer;font-weight:700;font-size:12px;}',
  '.btn-add{background:#336791;color:white;}',
  '.btn-clear{background:#edf2f7;color:#4a5568;}',
  '.sql-box{background:#1e1e2e;border-radius:8px;padding:10px 14px;font-family:monospace;font-size:12px;color:#7dd3fc;white-space:pre-wrap;margin-top:8px;}',
  '.bottom{background:white;border-radius:10px;border:1px solid #e2e8f0;overflow:hidden;}',
  'table{width:100%;border-collapse:collapse;}',
  'th{background:#336791;color:white;padding:7px 12px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;}',
  'td{padding:7px 12px;font-size:12px;font-family:monospace;border-bottom:1px solid #f0f0f0;}',
  'tr:hover td{background:#f7fafc;}',
  '.tag{display:inline-flex;align-items:center;gap:4px;background:#ebf8ff;border:1px solid #bee3f8;border-radius:999px;padding:2px 8px;font-family:monospace;font-size:11px;color:#2b6cb0;margin:2px;}',
  '.s-btn{padding:3px 9px;border:1px solid #e2e8f0;border-radius:4px;background:white;font-size:11px;cursor:pointer;font-weight:600;color:#4a5568;margin:2px;}',
  '.s-btn.on{background:#336791;color:white;border-color:#336791;}',
  '.bp{display:inline-block;padding:1px 7px;border-radius:999px;font-size:10px;font-weight:700;}',
  '.bp-pro{background:#e9d8fd;color:#553c9a;}',
  '.bp-free{background:#e2e8f0;color:#4a5568;}',
  '.bp-enterprise{background:#fefcbf;color:#744210;}',
].join('');
document.head.appendChild(style);

// top card
var topCard=document.createElement('div');
topCard.className='top';

var title=document.createElement('div');
title.textContent='WHERE Clause Builder';
title.style.cssText='font-size:14px;font-weight:800;color:#336791;margin-bottom:10px;';
topCard.appendChild(title);

// add-row
var addRow=document.createElement('div');
addRow.style.cssText='display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap;margin-bottom:10px;';

function makeField(labelTxt, el){
  var wrap=document.createElement('div');
  wrap.style.cssText='display:flex;flex-direction:column;gap:3px;';
  var lbl=document.createElement('span');
  lbl.className='lbl'; lbl.textContent=labelTxt;
  wrap.appendChild(lbl); wrap.appendChild(el);
  return wrap;
}

var selLogic=document.createElement('select');
selLogic.style.width='70px';
['AND','OR'].forEach(function(v){var o=document.createElement('option');o.value=v;o.textContent=v;selLogic.appendChild(o);});

var selCol=document.createElement('select');
COLS.forEach(function(c){var o=document.createElement('option');o.value=c;o.textContent=c;selCol.appendChild(o);});

var selOp=document.createElement('select');
function refreshOps(){
  selOp.innerHTML='';
  getOps(selCol.value).forEach(function(op){var o=document.createElement('option');o.value=op;o.textContent=op;selOp.appendChild(o);});
}
selCol.addEventListener('change',refreshOps);
refreshOps();

var inpVal=document.createElement('input');
inpVal.type='text'; inpVal.placeholder='value e.g. Boston'; inpVal.style.width='130px';
inpVal.addEventListener('keydown',function(e){if(e.key==='Enter')doAdd();});

var btnAdd=document.createElement('button');
btnAdd.className='btn btn-add'; btnAdd.textContent='+ Add Filter';
btnAdd.addEventListener('click',doAdd);

var btnClear=document.createElement('button');
btnClear.className='btn btn-clear'; btnClear.textContent='Clear All';
btnClear.addEventListener('click',function(){conditions=[];render();});

addRow.appendChild(makeField('Logic',selLogic));
addRow.appendChild(makeField('Column',selCol));
addRow.appendChild(makeField('Operator',selOp));
addRow.appendChild(makeField('Value',inpVal));
addRow.appendChild(btnAdd);
addRow.appendChild(btnClear);
topCard.appendChild(addRow);

// presets
var presetsLabel=document.createElement('div');
presetsLabel.textContent='Quick Presets';
presetsLabel.style.cssText='font-size:10px;font-weight:700;color:#4a5568;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;';
topCard.appendChild(presetsLabel);

var presetsRow=document.createElement('div');
presetsRow.style.cssText='display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;';
PRESETS.forEach(function(p,i){
  var btn=document.createElement('button');
  btn.textContent=p.label;
  btn.style.cssText='padding:4px 10px;background:#ebf8ff;border:1px solid #bee3f8;border-radius:999px;cursor:pointer;font-size:11px;font-weight:600;color:#2b6cb0;';
  btn.addEventListener('click',function(){
    conditions=p.conds.map(function(c){return Object.assign({},c);});
    render();
  });
  presetsRow.appendChild(btn);
});
topCard.appendChild(presetsRow);

// conditions display
var condLabel=document.createElement('div');
condLabel.textContent='Active Conditions';
condLabel.style.cssText='font-size:10px;font-weight:700;color:#4a5568;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;';
topCard.appendChild(condLabel);

var condDiv=document.createElement('div');
condDiv.id='cond-area';
condDiv.style.cssText='display:flex;flex-wrap:wrap;gap:4px;min-height:28px;margin-bottom:10px;';
topCard.appendChild(condDiv);

// sql preview
var sqlLabel=document.createElement('div');
sqlLabel.textContent='Generated SQL';
sqlLabel.style.cssText='font-size:10px;font-weight:700;color:#4a5568;text-transform:uppercase;letter-spacing:.05em;margin-bottom:5px;';
topCard.appendChild(sqlLabel);

var sqlBox=document.createElement('div');
sqlBox.className='sql-box';
topCard.appendChild(sqlBox);

document.body.appendChild(topCard);

// bottom results
var bottom=document.createElement('div');
bottom.className='bottom';

var tbar=document.createElement('div');
tbar.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid #e2e8f0;';
var tbarTitle=document.createElement('span');
tbarTitle.style.cssText='font-size:12px;font-weight:700;color:#336791;';
tbarTitle.textContent='Results';
var rowCount=document.createElement('span');
rowCount.id='row-count';
rowCount.style.cssText='font-size:11px;color:#718096;background:#ebf8ff;padding:2px 8px;border-radius:999px;';
tbar.appendChild(tbarTitle); tbar.appendChild(rowCount);
bottom.appendChild(tbar);

// sort row
var sortRow=document.createElement('div');
sortRow.style.cssText='display:flex;gap:4px;padding:7px 14px;border-bottom:1px solid #f0f0f0;background:#f9fafb;flex-wrap:wrap;align-items:center;';
var sortLabel=document.createElement('span');
sortLabel.textContent='SORT:';
sortLabel.style.cssText='font-size:10px;font-weight:700;color:#718096;margin-right:4px;';
sortRow.appendChild(sortLabel);
COLS.forEach(function(c){
  var btn=document.createElement('button');
  btn.className='s-btn';
  btn.id='sort-'+c;
  btn.textContent=c;
  btn.addEventListener('click',function(){
    if(sortCol===c){sortDir*=-1;}else{sortCol=c;sortDir=1;}
    render();
  });
  sortRow.appendChild(btn);
});
bottom.appendChild(sortRow);

// table
var tableWrap=document.createElement('div');
tableWrap.style.overflowX='auto';
var tbl=document.createElement('table');
var thead=document.createElement('thead');
var hrow=document.createElement('tr');
COLS.forEach(function(c){var th=document.createElement('th');th.textContent=c;hrow.appendChild(th);});
thead.appendChild(hrow);
var tbody=document.createElement('tbody');
tbody.id='tbody';
tbl.appendChild(thead); tbl.appendChild(tbody);
tableWrap.appendChild(tbl);
bottom.appendChild(tableWrap);
document.body.appendChild(bottom);

// ── add filter ──
function doAdd(){
  var val=inpVal.value.trim();
  if(!val)return;
  conditions.push({logic:selLogic.value,col:selCol.value,op:selOp.value,val:val});
  inpVal.value='';
  render();
}

// ── render ──
function render(){
  // update conditions display
  condDiv.innerHTML='';
  if(conditions.length===0){
    var empty=document.createElement('span');
    empty.textContent='No filters — showing all rows';
    empty.style.cssText='color:#a0aec0;font-size:12px;';
    condDiv.appendChild(empty);
  } else {
    conditions.forEach(function(c,i){
      var tag=document.createElement('span');
      tag.className='tag';
      tag.textContent=(i>0?c.logic+' ':'')+c.col+' '+c.op+' '+c.val;
      var rm=document.createElement('button');
      rm.textContent='×';
      rm.style.cssText='background:none;border:none;cursor:pointer;color:#a0aec0;font-size:14px;padding:0 0 0 3px;';
      (function(idx){rm.addEventListener('click',function(){conditions.splice(idx,1);render();});})(i);
      tag.appendChild(rm);
      condDiv.appendChild(tag);
    });
  }

  // update sql
  sqlBox.textContent=getSQL();

  // update sort buttons
  COLS.forEach(function(c){
    var btn=document.getElementById('sort-'+c);
    if(!btn)return;
    btn.className='s-btn'+(sortCol===c?' on':'');
    btn.textContent=c+(sortCol===c?(sortDir===1?' ↑':' ↓'):'');
  });

  // filter and sort rows
  var rows=applyFilter().sort(function(a,b){
    var av=a[sortCol],bv=b[sortCol];
    if(typeof av==='string')return sortDir*av.localeCompare(bv);
    return sortDir*(av-bv);
  });

  rowCount.textContent=rows.length+' / '+DATA.length+' rows';

  tbody.innerHTML='';
  if(rows.length===0){
    var tr=document.createElement('tr');
    var td=document.createElement('td');
    td.colSpan=7; td.textContent='No rows match'; td.style.cssText='text-align:center;padding:20px;color:#a0aec0;';
    tr.appendChild(td); tbody.appendChild(tr);
  } else {
    rows.forEach(function(r,i){
      var tr=document.createElement('tr');
      tr.style.background=i%2===0?'#fff':'#f8fafc';
      COLS.forEach(function(c){
        var td=document.createElement('td');
        if(c==='plan'){
          var sp=document.createElement('span');
          sp.className='bp bp-'+r[c];
          sp.textContent=r[c];
          td.appendChild(sp);
        } else if(c==='active'){
          var sp=document.createElement('span');
          sp.style.cssText='font-weight:700;color:'+(r[c]?'#38a169':'#e53e3e');
          sp.textContent=String(r[c]);
          td.appendChild(sp);
        } else {
          td.textContent=r[c];
          if(c==='email')td.style.fontSize='11px';
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
}

render();`,
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
