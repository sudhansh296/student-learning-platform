import type { PostgresqlLesson } from '../postgresql-curriculum';

export const lesson09: PostgresqlLesson = {
  id: 'postgresql-09',
  title: 'Transactions',
  slug: '09-transactions',
  chapter: 'advanced',
  order: 9,
  difficulty: 'intermediate',
  readingTime: 13,
  description: 'Learn how to use transactions to ensure data integrity, understand isolation levels, savepoints, and how to handle deadlocks in PostgreSQL.',
  sections: [
    {
      type: 'text',
      content: 'A transaction is a group of SQL statements that execute as a single unit. Either all statements succeed and are committed, or all are rolled back as if nothing happened. This is the heart of database reliability.'
    },
    {
      type: 'heading',
      content: 'BEGIN, COMMIT, and ROLLBACK'
    },
    {
      type: 'example',
      title: 'Basic Transaction',
      content: 'Wrapping multiple statements in a transaction:',
      code: `-- Start a transaction
BEGIN;

-- Transfer $100 from Alice to Bob
UPDATE accounts SET balance = balance - 100 WHERE id = 1; -- Alice
UPDATE accounts SET balance = balance + 100 WHERE id = 2; -- Bob

-- If both succeeded, commit the changes permanently
COMMIT;

-- If something went wrong, roll back all changes
-- ROLLBACK;`,
      language: 'sql',
      output: 'BEGIN UPDATE 1 UPDATE 1 COMMIT'
    },
    {
      type: 'note',
      title: 'Autocommit Mode',
      content: 'By default, each SQL statement in PostgreSQL is wrapped in its own implicit transaction and auto-committed. You only need BEGIN when you want multiple statements in one atomic unit.'
    },
    {
      type: 'heading',
      content: 'ACID in Practice'
    },
    {
      type: 'example',
      title: 'Seeing ACID in Action',
      content: 'How each ACID property protects the bank transfer example:',
      code: `-- Atomicity: if the second UPDATE fails, the first is rolled back
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
-- If this fails (e.g., CHECK constraint violation):
UPDATE accounts SET balance = balance + 100 WHERE id = 999; -- user not found!
-- The WHOLE transaction is rolled back; Alice gets her money back
COMMIT; -- never reached if error occurs

-- Consistency: balance cannot go negative (enforced by CHECK constraint)
ALTER TABLE accounts ADD CONSTRAINT no_overdraft
  CHECK (balance >= 0);

-- Isolation: two concurrent transactions do not see each other's uncommitted changes

-- Durability: once COMMIT is called, data survives a server crash`,
      language: 'sql',
      output: 'BEGIN UPDATE 1 ERROR: No rows found ROLLBACK'
    },
    {
      type: 'heading',
      content: 'Savepoints'
    },
    {
      type: 'text',
      content: 'Savepoints let you create checkpoints within a transaction. You can ROLLBACK TO a savepoint without abandoning the entire transaction.'
    },
    {
      type: 'example',
      title: 'Using Savepoints',
      content: 'Partial rollback within a transaction:',
      code: `BEGIN;

INSERT INTO orders (user_id, total) VALUES (1, 149.97);
-- Mark this as a safe point
SAVEPOINT after_order;

INSERT INTO order_items (order_id, product_id, quantity) VALUES (1, 99, 2);
-- Something went wrong with line items
ROLLBACK TO SAVEPOINT after_order;
-- The order was kept, the line items were undone

-- Try again with correct data
INSERT INTO order_items (order_id, product_id, quantity) VALUES (1, 5, 2);

COMMIT; -- order + corrected items committed`,
      language: 'sql',
      output: 'BEGIN INSERT 0 1 SAVEPOINT INSERT 0 1 ROLLBACK INSERT 0 1 COMMIT'
    },
    {
      type: 'heading',
      content: 'Isolation Levels'
    },
    {
      type: 'text',
      content: 'Isolation levels control how much one concurrent transaction can "see" of another\'s uncommitted work. Higher isolation = better data consistency, but lower concurrency and potentially more conflicts.'
    },
    {
      type: 'table',
      title: 'PostgreSQL Isolation Levels',
      headers: ['Level', 'Dirty Read', 'Non-Repeatable Read', 'Phantom Read', 'Use Case'],
      rows: [
        ['READ COMMITTED (default)', 'No', 'Possible', 'Possible', 'General OLTP (most apps)'],
        ['REPEATABLE READ', 'No', 'No', 'No in PG', 'Reports, consistent snapshots'],
        ['SERIALIZABLE', 'No', 'No', 'No', 'Financial, strict consistency']
      ]
    },
    {
      type: 'example',
      title: 'Setting Isolation Level',
      content: 'How to use different isolation levels:',
      code: `-- Set isolation for a transaction
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
-- ...queries here see a consistent snapshot
COMMIT;

-- Serializable: strongest isolation
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
UPDATE inventory SET stock = stock - 1 WHERE product_id = 5 AND stock > 0;
-- PostgreSQL may abort this if a serialization conflict is detected
COMMIT;`,
      language: 'sql',
      output: 'BEGIN UPDATE 1 COMMIT'
    },
    {
      type: 'heading',
      content: 'SELECT FOR UPDATE -- Row Locking'
    },
    {
      type: 'example',
      title: 'Locking Rows for Update',
      content: 'SELECT FOR UPDATE locks rows so other transactions cannot modify them until you commit:',
      code: `-- Transaction 1: lock the row before updating
BEGIN;
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;
-- Row is now locked -- Transaction 2 will wait at this point
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;
-- Lock released; Transaction 2 can now proceed

-- FOR SHARE: allow other reads but prevent updates
SELECT * FROM products WHERE id = 5 FOR SHARE;

-- SKIP LOCKED: skip locked rows (useful for job queues)
SELECT * FROM jobs
WHERE status = 'pending'
LIMIT 1
FOR UPDATE SKIP LOCKED;`,
      language: 'sql',
      output: ' balance   ----------  1000.00 (1 row) UPDATE 1 COMMIT'
    },
    {
      type: 'heading',
      content: 'Deadlocks'
    },
    {
      type: 'text',
      content: 'A deadlock occurs when two transactions are each waiting for a lock held by the other. PostgreSQL automatically detects deadlocks and aborts one of the transactions.'
    },
    {
      type: 'example',
      title: 'Deadlock Example and Prevention',
      content: 'How deadlocks happen and how to avoid them:',
      code: `-- DEADLOCK scenario:
-- Transaction 1: locks accounts row 1, then tries to lock row 2
-- Transaction 2: locks accounts row 2, then tries to lock row 1
-- Each is waiting for the other => DEADLOCK

-- ERROR: deadlock detected
-- DETAIL: Process X waits for ShareLock on transaction Y

-- PREVENTION: always lock rows in the same order across transactions
-- Bad: Tx1 locks (1,2), Tx2 locks (2,1) => deadlock possible
-- Good: both transactions always lock in ascending id order

-- If you get a deadlock error, catch it and retry
-- In application code: catch (error) { if (error.code === '40P01') retry(); }`,
      language: 'sql',
      output: 'ERROR:  deadlock detected DETAIL:  Process 1234 waits for ShareLock on transaction 5678 HINT:  See server log for query details.'
    },
    {
      type: 'warning',
      title: 'Long Transactions Cause Problems',
      content: 'Keep transactions as short as possible. Long-running transactions hold locks, block other queries, cause VACUUM to be unable to reclaim dead rows, and dramatically increase the chance of deadlocks.'
    },
    {
      type: 'tryit',
      title: 'Bank Transfer Simulator',
      js: `const output = document.getElementById('output');

let accounts = [
  { id: 1, owner: 'Alice', balance: 1000 },
  { id: 2, owner: 'Bob',   balance:  500 }
];
let txLog = [];
let txCount = 1;

function addLog(msg, type) {
  txLog.unshift({ msg, type, ts: new Date().toLocaleTimeString() });
  if (txLog.length > 12) txLog.pop();
}

function renderAccounts() {
  let h = '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">';
  accounts.forEach(a => {
    const color = a.balance >= 500 ? '#15803d' : a.balance >= 100 ? '#a16207' : '#dc2626';
    h += \`<div style="background:#f8fafc;border:2px solid \${color}22;border-radius:10px;padding:14px;text-align:center">\`;
    h += \`<div style="font-size:12px;color:#64748b;margin-bottom:4px">Account #\${a.id}</div>\`;
    h += \`<div style="font-size:16px;font-weight:700;color:#1e293b;margin-bottom:4px">\${a.owner}</div>\`;
    h += \`<div style="font-size:24px;font-weight:800;color:\${color}">$\${a.balance.toFixed(2)}</div>\`;
    h += '</div>';
  });
  h += '</div>';
  return h;
}

function renderLog() {
  if (txLog.length === 0) return '';
  let h = '<div><p style="font-size:11px;font-weight:700;color:#64748b;margin:0 0 8px;text-transform:uppercase;letter-spacing:.05em">Transaction Log</p>';
  h += '<div style="background:#0d1117;border-radius:8px;padding:12px;font-family:monospace;font-size:11px;max-height:180px;overflow-y:auto">';
  txLog.forEach(l => {
    const colors = { begin:'#7ee787', commit:'#22c55e', rollback:'#f85149', step:'#79c0ff', info:'#8b949e', error:'#ff6b6b' };
    h += \`<div style="color:\${colors[l.type]||'#e6edf3'};margin-bottom:3px">\`;
    h += \`<span style="color:#484f58;margin-right:8px">\${l.ts}</span>\${l.msg}</div>\`;
  });
  h += '</div></div>';
  return h;
}

function render() {
  output.innerHTML = \`
    <div style="padding:16px;font-family:system-ui,sans-serif">
      <h3 style="color:#336791;margin:0 0 12px">Bank Transfer Simulator</h3>
      \${renderAccounts()}
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
        <button onclick="transfer(1,2,100)" style="background:#336791;color:white;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600">Alice -&gt; Bob $100</button>
        <button onclick="transfer(2,1,50)"  style="background:#336791;color:white;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600">Bob -&gt; Alice $50</button>
        <button onclick="transfer(2,1,600)" style="background:#dc2626;color:white;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600">Overdraft (rollback)</button>
        <button onclick="resetAccounts()"   style="background:#64748b;color:white;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;font-size:12px">Reset</button>
      </div>
      \${renderLog()}
    </div>
  \`;
}

window.transfer = function(fromId, toId, amount) {
  const from = accounts.find(a => a.id === fromId);
  const to   = accounts.find(a => a.id === toId);
  const txId = 'TX-' + (txCount++).toString().padStart(3,'0');
  addLog(\`BEGIN; -- \${txId}\`, 'begin');
  addLog(\`SELECT FOR UPDATE accounts WHERE id IN (\${fromId},\${toId})\`, 'step');

  setTimeout(() => {
    if (from.balance < amount) {
      addLog(\`CHECK CONSTRAINT: \${from.owner} has $\${from.balance.toFixed(2)}, needs $\${amount.toFixed(2)}\`, 'error');
      addLog(\`ROLLBACK; -- \${txId} (insufficient funds)\`, 'rollback');
      render();
      return;
    }
    addLog(\`UPDATE accounts SET balance = balance - \${amount} WHERE id = \${fromId}; -- was $\${from.balance.toFixed(2)}\`, 'step');
    from.balance -= amount;
    setTimeout(() => {
      addLog(\`UPDATE accounts SET balance = balance + \${amount} WHERE id = \${toId}; -- was $\${to.balance.toFixed(2)}\`, 'step');
      to.balance += amount;
      setTimeout(() => {
        addLog(\`COMMIT; -- \${txId} | \${from.owner}: $\${from.balance.toFixed(2)} | \${to.owner}: $\${to.balance.toFixed(2)}\`, 'commit');
        render();
      }, 300);
      render();
    }, 300);
    render();
  }, 200);
};

window.resetAccounts = function() {
  accounts = [{ id:1, owner:'Alice', balance:1000 }, { id:2, owner:'Bob', balance:500 }];
  txLog = [];
  txCount = 1;
  render();
};

render();`,
      css: ''
    }
  ],
  exercises: [
    {
      id: 'ex-09-1',
      question: 'What happens if an error occurs in the middle of a transaction?',
      type: 'multiple-choice',
      options: [
        'The successful statements are committed and the failed one is skipped',
        'The entire transaction is automatically rolled back',
        'PostgreSQL asks whether to commit or rollback',
        'The error is logged and the transaction continues'
      ],
      correct: 1,
      explanation: 'When an error occurs inside a transaction, PostgreSQL puts the transaction into an error state. All subsequent commands in that transaction will fail, and when ROLLBACK (or COMMIT) is issued, all changes from that transaction are rolled back.'
    },
    {
      id: 'ex-09-2',
      question: 'What is the purpose of SELECT FOR UPDATE?',
      type: 'multiple-choice',
      options: [
        'It returns only rows that have been recently updated',
        'It locks the selected rows so other transactions cannot modify them until the current transaction ends',
        'It updates the rows immediately without a separate UPDATE statement',
        'It prevents SELECT from reading uncommitted data'
      ],
      correct: 1,
      explanation: 'SELECT FOR UPDATE locks the returned rows for the duration of the current transaction. Any other transaction that tries to UPDATE or also SELECT FOR UPDATE those rows will be blocked until your transaction commits or rolls back.'
    },
    {
      id: 'ex-09-3',
      question: 'What is a deadlock?',
      type: 'multiple-choice',
      options: [
        'A query that runs forever without returning results',
        'When a transaction is waiting for a lock held by another transaction that is also waiting for a lock held by the first',
        'A corrupted row that cannot be read',
        'When a COMMIT fails to write to disk'
      ],
      correct: 1,
      explanation: 'A deadlock occurs when two (or more) transactions each hold a lock the other needs, creating a circular wait. PostgreSQL detects this and automatically aborts one of the transactions with an error, allowing the other to proceed.'
    }
  ],
  quiz: [
    {
      id: 'q-09-1',
      question: 'Which isolation level is the PostgreSQL default?',
      options: ['READ UNCOMMITTED', 'READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE'],
      correct: 1,
      explanation: 'READ COMMITTED is the default isolation level in PostgreSQL. Each statement within a transaction sees only data committed before that statement started. It offers a good balance between consistency and concurrency for most applications.'
    },
    {
      id: 'q-09-2',
      question: 'What does ROLLBACK TO SAVEPOINT do?',
      options: [
        'Ends the entire transaction and rolls back all changes',
        'Rolls back only the changes made after the savepoint was created, keeping earlier changes intact',
        'Creates a copy of the current transaction state',
        'Commits all changes up to the savepoint'
      ],
      correct: 1,
      explanation: 'ROLLBACK TO SAVEPOINT undoes only the work done after the savepoint was created. The transaction continues; earlier work within the transaction is preserved. The transaction is not ended -- you still need to COMMIT or ROLLBACK at the end.'
    },
    {
      id: 'q-09-3',
      question: 'Why should transactions be kept short?',
      options: [
        'PostgreSQL has a maximum transaction size limit',
        'Long transactions hold locks, prevent VACUUM, and increase deadlock risk',
        'Long transactions use too much memory',
        'PostgreSQL automatically rolls back transactions longer than 30 seconds'
      ],
      correct: 1,
      explanation: 'Long transactions hold locks that block other queries, prevent autovacuum from reclaiming dead row space, increase the probability of deadlocks, and can fill up the WAL (write-ahead log). Best practice is to keep transactions as short as possible.'
    }
  ]
};
