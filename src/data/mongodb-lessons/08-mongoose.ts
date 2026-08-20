import type { MongodbLesson } from '../mongodb-curriculum';

export const mongodbMongooseLesson: MongodbLesson = {
  id: 'mongodb-mongoose',
  title: 'Mongoose ODM',
  slug: 'mongoose',
  chapter: 'advanced',
  order: 8,
  difficulty: 'intermediate',
  readingTime: 14,
  description: 'Mongoose Object Data Modeling - schemas, models, validation, middleware, and working with MongoDB in Node.js.',
  sections: [
    {
      type: 'text',
      content: 'Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides schema-based validation, middleware hooks, query helpers, and a more structured way to interact with MongoDB compared to the native driver.',
    },
    {
      type: 'heading',
      content: 'Setup and Connection',
    },
    {
      type: 'example',
      title: 'Installing and connecting to MongoDB',
      language: 'javascript',
      code: `// Install Mongoose
npm install mongoose

// Connect to MongoDB
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Connection events
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB!');
});

// Modern async/await connection
async function connectDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/myapp');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1);
  }
}

connectDB();`,
    },
    {
      type: 'heading',
      content: 'Schemas and Models',
    },
    {
      type: 'example',
      title: 'Defining schemas and creating models',
      language: 'javascript',
      code: `const mongoose = require('mongoose');

// Define schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\\S+@\\S+\\.\\S+$/, 'Invalid email format']
  },
  age: {
    type: Number,
    min: [18, 'Must be 18 or older'],
    max: 120
  },
  skills: [String],
  address: {
    street: String,
    city: String,
    zip: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create model from schema
const User = mongoose.model('User', userSchema);

// Now you can use User to interact with the "users" collection
module.exports = User;`,
    },
    {
      type: 'heading',
      content: 'CRUD Operations with Mongoose',
    },
    {
      type: 'example',
      title: 'Creating and saving documents',
      language: 'javascript',
      code: `const User = require('./models/User');

// Method 1: Create and save
const user = new User({
  name: 'Alice Johnson',
  email: 'alice@example.com',
  age: 28,
  skills: ['JavaScript', 'MongoDB']
});

await user.save();
console.log('User saved:', user._id);

// Method 2: Create directly
const newUser = await User.create({
  name: 'Bob Smith',
  email: 'bob@example.com',
  age: 32,
  skills: ['Python', 'SQL']
});

// Method 3: Insert many
await User.insertMany([
  { name: 'Carol', email: 'carol@example.com', age: 25 },
  { name: 'David', email: 'david@example.com', age: 30 }
]);`,
    },
    {
      type: 'example',
      title: 'Querying documents',
      language: 'javascript',
      code: `// Find all users
const users = await User.find();

// Find with filter
const activeUsers = await User.find({ isActive: true });

// Find one
const user = await User.findOne({ email: 'alice@example.com' });

// Find by ID
const user = await User.findById('507f1f77bcf86cd799439011');

// Query with conditions
const youngUsers = await User.find({ age: { $lt: 30 } });

// Select specific fields
const users = await User.find().select('name email -_id');

// Sort results
const users = await User.find().sort({ createdAt: -1 });

// Limit and skip
const users = await User.find().skip(10).limit(5);

// Chaining
const users = await User
  .find({ isActive: true })
  .select('name email')
  .sort({ name: 1 })
  .limit(10);

// Count documents
const count = await User.countDocuments({ isActive: true });`,
    },
    {
      type: 'example',
      title: 'Updating documents',
      language: 'javascript',
      code: `// Update one
await User.updateOne(
  { email: 'alice@example.com' },
  { $set: { age: 29 } }
);

// Update many
await User.updateMany(
  { age: { $lt: 25 } },
  { $set: { category: 'young' } }
);

// Find and update (returns old document by default)
const user = await User.findOneAndUpdate(
  { email: 'alice@example.com' },
  { $set: { age: 29 } },
  { new: true }  // return updated document
);

// Find by ID and update
const user = await User.findByIdAndUpdate(
  '507f1f77bcf86cd799439011',
  { $push: { skills: 'React' } },
  { new: true, runValidators: true }
);

// Update with instance method
const user = await User.findById('507f1f77bcf86cd799439011');
user.age = 30;
user.skills.push('MongoDB');
await user.save();  // triggers validation and middleware`,
    },
    {
      type: 'example',
      title: 'Deleting documents',
      language: 'javascript',
      code: `// Delete one
await User.deleteOne({ email: 'alice@example.com' });

// Delete many
await User.deleteMany({ isActive: false });

// Find and delete (returns deleted document)
const user = await User.findOneAndDelete({ email: 'bob@example.com' });

// Find by ID and delete
const user = await User.findByIdAndDelete('507f1f77bcf86cd799439011');

// Delete with instance method
const user = await User.findById('507f1f77bcf86cd799439011');
await user.deleteOne();  // or user.remove()`,
    },
    {
      type: 'heading',
      content: 'Schema Validation',
    },
    {
      type: 'example',
      title: 'Built-in and custom validators',
      language: 'javascript',
      code: `const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\\S+@\\S+\\.\\S+$/.test(v);
      },
      message: props => \`\${props.value} is not a valid email!\`
    }
  },
  age: {
    type: Number,
    min: [18, 'Must be at least 18'],
    max: [120, 'Age cannot exceed 120'],
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters'],
    validate: {
      validator: function(v) {
        return /(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])/.test(v);
      },
      message: 'Password must contain uppercase, lowercase, and number'
    }
  },
  website: {
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\\/\\//.test(v);
      },
      message: 'Website must be a valid URL'
    }
  }
});

// Handle validation errors
try {
  const user = new User({ email: 'invalid', age: 15 });
  await user.save();
} catch (error) {
  console.log(error.errors.email.message);  // validation error message
  console.log(error.errors.age.message);
}`,
    },
    {
      type: 'heading',
      content: 'Middleware Hooks',
    },
    {
      type: 'example',
      title: 'Pre and post hooks',
      language: 'javascript',
      code: `const bcrypt = require('bcrypt');

// Pre-save hook (runs before save)
userSchema.pre('save', async function(next) {
  // Only hash password if modified
  if (!this.isModified('password')) return next();
  
  // Hash password
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Post-save hook (runs after save)
userSchema.post('save', function(doc, next) {
  console.log(\`User \${doc.name} was saved!\`);
  next();
});

// Pre-remove hook
userSchema.pre('deleteOne', { document: true }, async function(next) {
  // Clean up related data before deletion
  await Order.deleteMany({ userId: this._id });
  next();
});

// Pre-find hook (query middleware)
userSchema.pre(/^find/, function(next) {
  // Only show active users by default
  this.find({ isActive: { $ne: false } });
  next();
});

// Instance method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static method
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email });
};

// Usage
const user = await User.findByEmail('alice@example.com');
const isMatch = await user.comparePassword('password123');`,
    },
    {
      type: 'note',
      title: 'Mongoose vs MongoDB Driver',
      content: 'Mongoose provides: schema validation, middleware hooks, virtuals, instance/static methods, population for references. Native MongoDB driver is faster but requires manual validation. Use Mongoose for complex apps with structured data, native driver for simple apps or performance-critical operations.',
    },
    {
      type: 'tryit',
      title: 'Mongoose Schema Validator',
      css: `body{font-family:system-ui,sans-serif;padding:18px;margin:0;background:linear-gradient(135deg,#001E2B 0%,#003d4d 100%);}
.container{max-width:750px;margin:0 auto;}
.header{text-align:center;color:#00ED64;font-size:26px;font-weight:700;margin-bottom:8px;}
.card{background:#fff;border-radius:10px;padding:20px;margin-bottom:14px;box-shadow:0 4px 20px rgba(0,237,100,0.2);}
.label{display:block;font-weight:600;color:#001E2B;font-size:14px;margin-bottom:6px;}
.input{width:100%;padding:10px;border:2px solid #e2e8f0;border-radius:6px;font-size:14px;margin-bottom:12px;box-sizing:border-box;}
.input:focus{outline:none;border-color:#00ED64;}
.btn{background:#00ED64;color:#001E2B;border:none;padding:12px 24px;border-radius:8px;cursor:pointer;font-weight:700;font-size:14px;width:100%;}
.btn:hover{background:#00ff70;transform:translateY(-1px);}
.result{padding:14px;border-radius:8px;margin-top:12px;font-size:14px;line-height:1.6;}
.result.success{background:#d1fae5;border:2px solid #00ED64;color:#065f46;}
.result.error{background:#fee2e2;border:2px solid#ef4444;color:#991b1b;}
.code{font-family:monospace;font-size:12px;background:#1e293b;color:#00ED64;padding:8px;border-radius:4px;margin-top:8px;overflow-x:auto;}`,
      js: `function validateUser() {
  var name = document.getElementById('name').value.trim();
  var email = document.getElementById('email').value.trim();
  var age = parseInt(document.getElementById('age').value);
  
  var errors = [];
  
  // Name validation
  if (!name) {
    errors.push('Name is required');
  } else if (name.length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  // Email validation
  if (!email) {
    errors.push('Email is required');
  } else if (!/^\\S+@\\S+\\.\\S+$/.test(email)) {
    errors.push('Invalid email format');
  }
  
  // Age validation
  if (!age || isNaN(age)) {
    errors.push('Age is required and must be a number');
  } else if (age < 18) {
    errors.push('Must be at least 18 years old');
  } else if (age > 120) {
    errors.push('Age cannot exceed 120');
  }
  
  var resultDiv = document.getElementById('result');
  
  if (errors.length > 0) {
    resultDiv.className = 'result error';
    resultDiv.innerHTML = '<strong>Validation Failed:</strong><br>' + errors.join('<br>');
  } else {
    var user = {
      name: name,
      email: email.toLowerCase(),
      age: age,
      createdAt: new Date().toISOString()
    };
    resultDiv.className = 'result success';
    resultDiv.innerHTML = '<strong>Validation Passed!</strong><br>User would be saved to MongoDB:<div class="code">' + 
      JSON.stringify(user, null, 2) + '</div>';
  }
}

document.getElementById('output').innerHTML =
  '<div class="container">' +
  '<div class="header">Mongoose Schema Validator</div>' +
  '<div class="card">' +
  '<label class="label">Name (min 2 chars)</label>' +
  '<input type="text" id="name" class="input" placeholder="Enter name" />' +
  '<label class="label">Email (valid format)</label>' +
  '<input type="email" id="email" class="input" placeholder="Enter email" />' +
  '<label class="label">Age (18-120)</label>' +
  '<input type="number" id="age" class="input" placeholder="Enter age" />' +
  '<button class="btn" onclick="validateUser()">Validate User</button>' +
  '<div id="result"></div>' +
  '</div>' +
  '</div>';

window.validateUser = validateUser;`,
    },
  ],
  exercises: [
    {
      id: 'mongodb-mongoose-1',
      question: 'What is Mongoose?',
      type: 'multiple-choice',
      options: [
        'A MongoDB GUI tool',
        'An Object Data Modeling (ODM) library for MongoDB and Node.js',
        'A MongoDB deployment tool',
        'A database management system',
      ],
      correct: 1,
      explanation: 'Mongoose is an ODM library that provides a schema-based solution for modeling application data with MongoDB in Node.js. It includes built-in validation, middleware, query building, and more.',
    },
    {
      id: 'mongodb-mongoose-2',
      question: 'When does a Mongoose pre-save hook execute?',
      type: 'multiple-choice',
      options: [
        'After the document is saved to the database',
        'Before the document is saved to the database',
        'When querying for documents',
        'When deleting documents',
      ],
      correct: 1,
      explanation: 'Pre-save hooks execute before a document is saved to MongoDB. They are commonly used for hashing passwords, setting timestamps, or validating data before persistence.',
    },
  ],
  quiz: [
    {
      id: 'mongodb-mongoose-q1',
      question: 'What does { new: true } option do in findOneAndUpdate()?',
      options: [
        'Creates a new document if not found',
        'Returns the updated document instead of the original',
        'Forces validation on update',
        'Uses a new database connection',
      ],
      correct: 1,
      explanation: 'By default, findOneAndUpdate() returns the original document before the update. The { new: true } option makes it return the modified document instead.',
    },
  ],
};
