import type { MongodbLesson } from '../mongodb-curriculum';

export const mongodbTransactionsLesson: MongodbLesson = {
  id: 'mongodb-transactions',
  title: 'Transactions',
  slug: 'transactions',
  chapter: 'advanced',
  order: 10,
  difficulty: 'advanced',
  readingTime: 11,
  description: 'ACID transactions, sessions, multi-document transactions, and consistency guarantees in MongoDB.',
  sections: [
    {
      type: 'text',
      content: 'MongoDB supports ACID transactions for operations that span multiple documents or collections. Transactions ensure that either all operations succeed or all fail (atomicity), maintaining data consistency. Single-document operations are always atomic in MongoDB.',
    },
    {
      type: 'heading',
      content: 'Single Document Atomicity',
    },
    {
      type: 'example',
      title: 'Atomic single document operations',
      language: 'javascript',
      code: `// Single document operations are ALWAYS atomic
// All updates succeed or none do

// Transfer money within single document (atomic)
db.accounts.updateOne(
  { _id: "account1" },
  {
    $inc: { savingsBalance: -100, checkingBalance: 100 }
  }
)

// Add item to order and update total (atomic)
db.orders.updateOne(
  { _id: orderId },
  {
    $push: { items: newItem },
    $inc: { total: newItem.price }
  }
)

// Embedded documents make operations atomic
{
  _id: 1,
  user: "alice",
  wallet: {
    usd: 1000,
    eur: 500
  }
}

// Convert currency atomically
db.accounts.updateOne(
  { user: "alice" },
  {
    $inc: { "wallet.usd": -100, "wallet.eur": 85 }
  }
)`,
    },
    {
      type: 'heading',
      content: 'Multi-Document Transactions',
    },
    {
      type: 'example',
      title: 'Basic transaction with MongoDB driver',
      language: 'javascript',
      code: `const { MongoClient } = require('mongodb');

async function transferMoney(fromId, toId, amount) {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  
  // Start a session
  const session = client.startSession();
  
  try {
    // Start transaction
    session.startTransaction();
    
    const db = client.db('myapp');
    const accounts = db.collection('accounts');
    
    // Deduct from sender
    await accounts.updateOne(
      { _id: fromId },
      { $inc: { balance: -amount } },
      { session }  // pass session to operation
    );
    
    // Add to receiver
    await accounts.updateOne(
      { _id: toId },
      { $inc: { balance: amount } },
      { session }
    );
    
    // Commit transaction (all or nothing)
    await session.commitTransaction();
    console.log('Transaction successful');
    
  } catch (error) {
    // Abort transaction on error (rollback)
    await session.abortTransaction();
    console.error('Transaction failed:', error);
    throw error;
  } finally {
    await session.endSession();
    await client.close();
  }
}

transferMoney('alice', 'bob', 100);`,
    },
    {
      type: 'example',
      title: 'Transactions with Mongoose',
      language: 'javascript',
      code: `const mongoose = require('mongoose');

async function transferMoneyMongoose(fromId, toId, amount) {
  // Start session
  const session = await mongoose.startSession();
  
  try {
    // Start transaction
    session.startTransaction();
    
    // Deduct from sender
    const sender = await Account.findByIdAndUpdate(
      fromId,
      { $inc: { balance: -amount } },
      { session, new: true }
    );
    
    // Check for insufficient funds
    if (sender.balance < 0) {
      throw new Error('Insufficient funds');
    }
    
    // Add to receiver
    await Account.findByIdAndUpdate(
      toId,
      { $inc: { balance: amount } },
      { session }
    );
    
    // Commit transaction
    await session.commitTransaction();
    console.log('Transfer successful');
    
  } catch (error) {
    // Abort on error
    await session.abortTransaction();
    console.error('Transfer failed:', error);
    throw error;
  } finally {
    session.endSession();
  }
}

// Usage
transferMoneyMongoose('alice123', 'bob456', 100);`,
    },
    {
      type: 'example',
      title: 'Multi-collection transaction',
      language: 'javascript',
      code: `// Create order and update inventory atomically
async function createOrder(orderData) {
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();
    
    // Create order
    const order = await Order.create([{
      customerId: orderData.customerId,
      items: orderData.items,
      total: orderData.total
    }], { session });
    
    // Update inventory for each item
    for (const item of orderData.items) {
      const product = await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } },
        { session, new: true }
      );
      
      // Check stock availability
      if (product.stock < 0) {
        throw new Error(\`Insufficient stock for \${product.name}\`);
      }
    }
    
    // Update customer order count
    await Customer.findByIdAndUpdate(
      orderData.customerId,
      { 
        $push: { orderIds: order[0]._id },
        $inc: { totalOrders: 1, totalSpent: orderData.total }
      },
      { session }
    );
    
    await session.commitTransaction();
    return order[0];
    
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}`,
    },
    {
      type: 'heading',
      content: 'Transaction Best Practices',
    },
    {
      type: 'list',
      items: [
        'Keep transactions short - long transactions hold locks and impact performance',
        'Limit operations per transaction - MongoDB has a 60-second time limit',
        'Use appropriate read/write concerns for your consistency needs',
        'Design schemas to minimize need for multi-document transactions',
        'Single document operations are faster than transactions',
        'Transactions require replica set or sharded cluster (not standalone)',
        'Handle errors and always call endSession() in finally block',
      ],
    },
    {
      type: 'example',
      title: 'Read and write concerns in transactions',
      language: 'javascript',
      code: `// Transaction options
const transactionOptions = {
  readPreference: 'primary',
  readConcern: { level: 'snapshot' },
  writeConcern: { w: 'majority' }
};

session.startTransaction(transactionOptions);

// Read Concern levels:
// - local: reads from primary, not guaranteed durable
// - majority: reads only data acknowledged by majority
// - snapshot: reads from consistent snapshot (transactions)

// Write Concern levels:
// - w: 1 - acknowledge from primary only (default)
// - w: 'majority' - acknowledge from majority of nodes
// - w: 0 - no acknowledgment (fire and forget)

// Example with specific concerns
await session.withTransaction(async () => {
  await Account.updateOne(
    { _id: fromId },
    { $inc: { balance: -amount } },
    { session }
  );
  await Account.updateOne(
    { _id: toId },
    { $inc: { balance: amount } },
    { session }
  );
}, transactionOptions);`,
    },
    {
      type: 'note',
      title: 'When to use transactions',
      content: 'Use transactions when: you need atomicity across multiple documents/collections, data consistency is critical (banking, inventory), operations must succeed or fail together. Avoid when: single document updates suffice, operations are read-only, extreme performance is needed.',
    },
    {
      type: 'warning',
      title: 'Transaction Requirements',
      content: 'Transactions require MongoDB 4.0+ and a replica set or sharded cluster. They do NOT work on standalone MongoDB instances. For development, create a single-node replica set.',
    },
    {
      type: 'tryit',
      title: 'Transaction Simulator',
      css: `body{font-family:system-ui,sans-serif;padding:18px;margin:0;background:linear-gradient(135deg,#001E2B 0%,#003d4d 100%);}
.container{max-width:750px;margin:0 auto;}
.header{text-align:center;color:#00ED64;font-size:26px;font-weight:700;margin-bottom:8px;}
.subtitle{text-align:center;color:#fff;font-size:13px;margin-bottom:14px;}
.card{background:#fff;border-radius:10px;padding:18px;margin-bottom:12px;box-shadow:0 4px 20px rgba(0,237,100,0.2);}
.label{font-weight:600;color:#001E2B;font-size:14px;margin-bottom:8px;}
.accounts{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;}
.account{background:#f8f9fa;border:2px solid #00ED64;border-radius:8px;padding:12px;text-align:center;}
.account-name{font-weight:700;color:#001E2B;margin-bottom:4px;}
.balance{font-size:24px;color:#00ED64;font-weight:700;}
.input{width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:6px;font-size:14px;margin-bottom:12px;box-sizing:border-box;}
.btn{background:#00ED64;color:#001E2B;border:none;padding:12px 20px;border-radius:8px;cursor:pointer;font-weight:700;font-size:14px;width:100%;}
.btn:hover{background:#00ff70;transform:translateY(-1px);}
.log{background:#1e293b;color:#00ED64;border-radius:8px;padding:12px;font-family:monospace;font-size:12px;margin-top:12px;max-height:150px;overflow-y:auto;line-height:1.6;}`,
      js: `var accounts = {
  alice: 1000,
  bob: 500
};
var logs = [];

function addLog(msg) {
  logs.push(msg);
  if (logs.length > 8) logs.shift();
  render();
}

function transfer() {
  var amount = parseInt(document.getElementById('amount').value);
  
  if (!amount || amount <= 0) {
    addLog('ERROR: Invalid amount');
    return;
  }
  
  if (accounts.alice < amount) {
    addLog('ERROR: Insufficient funds - TRANSACTION ABORTED');
    return;
  }
  
  addLog('START TRANSACTION');
  addLog('Session started');
  
  // Simulate deduction
  accounts.alice -= amount;
  addLog(\`Deduct $\${amount} from Alice (balance: $\${accounts.alice})\`);
  
  // Simulate addition
  accounts.bob += amount;
  addLog(\`Add $\${amount} to Bob (balance: $\${accounts.bob})\`);
  
  addLog('COMMIT TRANSACTION - Success!');
  render();
}

function render() {
  document.getElementById('output').innerHTML =
    '<div class="container">' +
    '<div class="header">Transaction Simulator</div>' +
    '<div class="subtitle">Simulate money transfer with ACID guarantees</div>' +
    '<div class="card">' +
    '<div class="label">Account Balances:</div>' +
    '<div class="accounts">' +
    '<div class="account"><div class="account-name">Alice</div><div class="balance">$' + accounts.alice + '</div></div>' +
    '<div class="account"><div class="account-name">Bob</div><div class="balance">$' + accounts.bob + '</div></div>' +
    '</div>' +
    '<div class="label">Transfer from Alice to Bob:</div>' +
    '<input type="number" id="amount" class="input" placeholder="Enter amount" min="1" />' +
    '<button class="btn" onclick="transfer()">Execute Transaction</button>' +
    '<div class="log">' + logs.join('\ ') + '</div>' +
    '</div>' +
    '</div>';
}

render();
window.transfer = transfer;`,
    },
  ],
  exercises: [
    {
      id: 'mongodb-trans-1',
      question: 'Are single-document operations in MongoDB atomic?',
      type: 'multiple-choice',
      options: [
        'No, you always need transactions',
        'Yes, single-document operations are always atomic',
        'Only if you use transactions',
        'Only in replica sets',
      ],
      correct: 1,
      explanation: 'Single-document operations in MongoDB are ALWAYS atomic, even without explicit transactions. This includes updates with multiple field modifications, array operations, and embedded document updates.',
    },
    {
      id: 'mongodb-trans-2',
      question: 'What happens when you call abortTransaction()?',
      type: 'multiple-choice',
      options: [
        'All changes in the transaction are saved',
        'All changes in the transaction are rolled back',
        'Only the last operation is undone',
        'The database connection is closed',
      ],
      correct: 1,
      explanation: 'abortTransaction() rolls back all changes made within the transaction. None of the operations are committed to the database, maintaining data consistency.',
    },
  ],
  quiz: [
    {
      id: 'mongodb-trans-q1',
      question: 'What MongoDB deployment is required for multi-document transactions?',
      options: [
        'Any MongoDB instance',
        'Standalone server only',
        'Replica set or sharded cluster',
        'Only MongoDB Atlas',
      ],
      correct: 2,
      explanation: 'Multi-document transactions require MongoDB 4.0+ running as a replica set or sharded cluster. They do not work on standalone instances because transactions rely on the oplog for rollback capability.',
    },
  ],
};
