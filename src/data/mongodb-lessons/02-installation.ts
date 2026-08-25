import type { MongodbLesson } from '../mongodb-curriculum';

export const mongodbInstallLesson: MongodbLesson = {
  id: 'mongodb-installation',
  title: 'Installing MongoDB',
  slug: 'installation',
  chapter: 'intro',
  order: 2,
  difficulty: 'beginner',
  readingTime: 12,
  description: 'How to install MongoDB, MongoDB Compass, connection strings, and basic shell commands.',
  sections: [
    {
      type: 'text',
      content: 'MongoDB can be installed locally on your machine or used through MongoDB Atlas (cloud). MongoDB Compass is a free GUI tool that makes it easy to visualize and interact with your data. The MongoDB Shell (mongosh) provides a command-line interface for database operations.',
    },
    {
      type: 'heading',
      content: 'Installation Options',
    },
    {
      type: 'list',
      items: [
        'MongoDB Community Server - Free local installation for development',
        'MongoDB Atlas - Free cloud-hosted MongoDB (recommended for beginners)',
        'MongoDB Compass - GUI tool for visualizing data',
        'MongoDB Shell (mongosh) - Command-line interface',
        'Docker - Run MongoDB in a container',
      ],
    },
    {
      type: 'example',
      title: 'Installing MongoDB on Windows',
      content: 'Download the MSI installer from the official MongoDB site, add the binary to your PATH, then create the default data directory and start the server.',
      language: 'bash',
      code: `# Download from mongodb.com/try/download/community
# Run the MSI installer, choose "Complete" installation

# Add to PATH (if not automatic)
# C:\\\\Program Files\\\\MongoDB\\\\Server\\\\7.0\\\\bin

# Create data directory
mkdir C:\\\\data\\\\db

# Start MongoDB server
mongod

# In a new terminal, connect with shell
mongosh`,
    },
    {
      type: 'example',
      title: 'Installing MongoDB on macOS',
      content: 'Homebrew is the recommended way to install MongoDB on macOS. After installing, start it as a background service so it runs automatically.',
      language: 'bash',
      code: `# Using Homebrew (recommended)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB as a service
brew services start mongodb-community

# Or run manually
mongod --config /opt/homebrew/etc/mongod.conf

# Connect with shell
mongosh`,
    },
    {
      type: 'example',
      title: 'Installing MongoDB on Linux',
      content: 'On Ubuntu and Debian systems, add the official MongoDB repository and install with apt. Enable the service so MongoDB starts automatically on boot.',
      language: 'bash',
      code: `# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod  # auto-start on boot

# Connect with shell
mongosh`,
    },
    {
      type: 'tip',
      title: 'Quick Start with Docker',
      content: 'The fastest way to get MongoDB running: docker run -d -p 27017:27017 --name mongodb mongo:latest. Connect with: mongosh "mongodb://localhost:27017"',
    },
    {
      type: 'heading',
      content: 'MongoDB Atlas (Cloud)',
    },
    {
      type: 'example',
      title: 'Setting up MongoDB Atlas',
      content: 'MongoDB Atlas provides a free cloud-hosted cluster in minutes with no server management. Sign up, create an M0 cluster, add a database user, whitelist your IP, and copy the connection string.',
      language: 'text',
      code: `1. Visit mongodb.com/cloud/atlas
2. Sign up for free (no credit card required)
3. Create a free M0 cluster (512MB storage)
4. Choose a cloud provider and region
5. Wait 3-5 minutes for cluster creation
6. Create a database user (username + password)
7. Add your IP to the whitelist (0.0.0.0/0 for testing)
8. Get your connection string:
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/

Atlas includes:
- Free tier with 512MB storage
- Automatic backups
- Built-in monitoring
- No server management`,
    },
    {
      type: 'heading',
      content: 'Connection Strings',
    },
    {
      type: 'example',
      title: 'MongoDB connection string formats',
      content: 'The connection string tells your app where MongoDB is, who to authenticate as, and which database to use. Atlas uses the mongodb+srv:// protocol which resolves server addresses via DNS.',
      language: 'javascript',
      code: `// Local MongoDB (default)
mongodb://localhost:27017

// Local with database name
mongodb://localhost:27017/myDatabase

// Local with authentication
mongodb://username:password@localhost:27017/myDatabase

// MongoDB Atlas (cloud)
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/myDatabase

// With options
mongodb://localhost:27017/myDatabase?retryWrites=true&w=majority

// Connection string parts:
// mongodb:// or mongodb+srv:// - protocol
// username:password@ - credentials (optional)
// localhost:27017 - host and port
// /myDatabase - database name
// ?options - connection options`,
    },
    {
      type: 'example',
      title: 'MongoDB Shell (mongosh) basics',
      content: 'mongosh is the interactive command-line shell for MongoDB. Use it to connect to a server, switch databases, list collections, and run queries directly.',
      language: 'javascript',
      code: `// Connect to MongoDB
mongosh "mongodb://localhost:27017"

// Show all databases
show dbs

// Switch to a database (creates if not exists)
use myDatabase

// Show current database
db

// Show collections in current database
show collections

// Get help
help

// Exit shell
exit

// Run shell command with --eval
mongosh --eval "db.users.find().pretty()"`,
    },
    {
      type: 'example',
      title: 'Installing MongoDB Compass',
      content: 'MongoDB Compass is a free GUI for browsing data, building queries visually, and managing indexes. Download it, connect with your connection string, and explore your databases without writing shell commands.',
      language: 'text',
      code: `1. Download from mongodb.com/products/compass
2. Install the application (Windows/Mac/Linux)
3. Launch Compass
4. Enter connection string:
   - Local: mongodb://localhost:27017
   - Atlas: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
5. Click "Connect"

Compass features:
- Visual query builder
- Real-time performance stats
- Index management
- Schema visualization
- Import/export data`,
    },
    {
      type: 'tryit',
      title: 'MongoDB Connection Tester',
      css: `body{font-family:system-ui,sans-serif;padding:20px;margin:0;background:linear-gradient(135deg,#001E2B 0%,#003d4d 100%);}
.container{max-width:700px;margin:0 auto;}
.card{background:#fff;border-radius:12px;padding:24px;box-shadow:0 4px 20px rgba(0,237,100,0.2);}
.header{text-align:center;color:#00ED64;font-size:28px;font-weight:700;margin-bottom:8px;}
.subtitle{text-align:center;color:#666;font-size:14px;margin-bottom:24px;}
.input-group{margin-bottom:16px;}
.label{display:block;font-weight:600;color:#001E2B;margin-bottom:6px;font-size:14px;}
.input{width:100%;padding:10px 12px;border:2px solid #e2e8f0;border-radius:6px;font-size:14px;font-family:monospace;box-sizing:border-box;}
.input:focus{outline:none;border-color:#00ED64;}
.btn{background:#00ED64;color:#001E2B;border:none;padding:12px 28px;border-radius:8px;cursor:pointer;font-weight:700;font-size:15px;width:100%;margin-top:8px;}
.btn:hover{background:#00ff70;transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,237,100,0.3);}
.btn.secondary{background:#1e293b;color:#fff;margin-top:12px;}
.btn.secondary:hover{background:#334155;}
.result{margin-top:20px;padding:16px;border-radius:8px;font-family:monospace;font-size:13px;line-height:1.6;display:none;}
.result.success{background:#d1fae5;border:2px solid #00ED64;color:#065f46;}
.result.error{background:#fee2e2;border:2px solid #ef4444;color:#991b1b;}
.result.info{background:#dbeafe;border:2px solid #3b82f6;color:#1e40af;}
.icon{font-size:18px;margin-right:8px;}
.example-links{margin-top:16px;text-align:center;}
.example-link{color:#00ED64;cursor:pointer;text-decoration:underline;font-size:13px;margin:0 8px;}
.example-link:hover{color:#00ff70;}`,
      js: `function testConnection() {
  var uri = document.getElementById('connectionUri').value.trim();
  var resultDiv = document.getElementById('result');
  
  if (!uri) {
    showResult('error', 'Please enter a connection string');
    return;
  }
  
  // Parse connection string
  var isAtlas = uri.includes('mongodb+srv://');
  var isLocal = uri.includes('localhost') || uri.includes('127.0.0.1');
  var hasAuth = uri.includes('@') && uri.includes(':');
  var dbMatch = uri.match(/\\/([^\\/\\?]+)(\\?|$)/);
  var dbName = dbMatch ? dbMatch[1] : 'test';
  
  // Validate format
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    showResult('error', 'Invalid connection string. Must start with mongodb:// or mongodb+srv://');
    return;
  }
  
  // Simulate connection check
  setTimeout(function() {
    var msg = 'Connection successful!\ \ ';
    msg += 'Protocol: ' + (isAtlas ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB') + '\ ';
    msg += 'Host: ' + (isLocal ? 'localhost:27017' : 'Remote Server') + '\ ';
    msg += 'Database: ' + dbName + '\ ';
    msg += 'Authentication: ' + (hasAuth ? 'Enabled' : 'Disabled') + '\ \ ';
    msg += 'Ready to execute commands!';
    showResult('success', msg);
  }, 800);
}

function showResult(type, message) {
  var resultDiv = document.getElementById('result');
  resultDiv.className = 'result ' + type;
  resultDiv.style.display = 'block';
  
  var icons = {
    success: '\\u2713',
    error: '\\u2717',
    info: '\\u2139'
  };
  
  resultDiv.innerHTML = '<span class="icon">' + icons[type] + '</span>' + message.replace(/\ /g, '<br>');
}

function loadExample(type) {
  var examples = {
    local: 'mongodb://localhost:27017',
    localAuth: 'mongodb://admin:password123@localhost:27017/myDatabase',
    atlas: 'mongodb+srv://username:password@cluster0.abcde.mongodb.net/myDatabase',
    docker: 'mongodb://172.17.0.2:27017/myapp'
  };
  document.getElementById('connectionUri').value = examples[type];
  showResult('info', 'Example loaded. Click "Test Connection" to validate.');
}

document.getElementById('output').innerHTML =
  '<div class="container">' +
  '<div class="card">' +
  '<div class="header">MongoDB Connection Tester</div>' +
  '<div class="subtitle">Test your MongoDB connection string format</div>' +
  '<div class="input-group">' +
  '<label class="label">Connection String (URI)</label>' +
  '<input type="text" id="connectionUri" class="input" placeholder="mongodb://localhost:27017 or mongodb+srv://..." />' +
  '</div>' +
  '<button class="btn" onclick="testConnection()">Test Connection</button>' +
  '<div class="example-links">' +
  '<span class="example-link" onclick="loadExample(\\'local\\')">Local</span> | ' +
  '<span class="example-link" onclick="loadExample(\\'localAuth\\')">Local + Auth</span> | ' +
  '<span class="example-link" onclick="loadExample(\\'atlas\\')">Atlas</span> | ' +
  '<span class="example-link" onclick="loadExample(\\'docker\\')">Docker</span>' +
  '</div>' +
  '<div id="result" class="result"></div>' +
  '</div>' +
  '</div>';

window.testConnection = testConnection;
window.loadExample = loadExample;
window.showResult = showResult;`,
    },
  ],
  exercises: [
    {
      id: 'mongodb-install-1',
      question: 'What is the default port for MongoDB?',
      type: 'multiple-choice',
      options: [
        '3000',
        '5432',
        '27017',
        '8080',
      ],
      correct: 2,
      explanation: 'MongoDB runs on port 27017 by default. This is the port you connect to when running MongoDB locally.',
    },
    {
      id: 'mongodb-install-2',
      question: 'What is the difference between mongodb:// and mongodb+srv:// connection strings?',
      type: 'multiple-choice',
      options: [
        'mongodb+srv:// is for local, mongodb:// is for cloud',
        'mongodb+srv:// uses DNS seedlist for Atlas, mongodb:// is standard connection',
        'They are the same, just different syntax',
        'mongodb+srv:// requires SSL, mongodb:// does not',
      ],
      correct: 1,
      explanation: 'mongodb+srv:// is used for MongoDB Atlas and leverages DNS to provide a connection string that can automatically update server addresses. mongodb:// is the standard connection format for local and explicit host connections.',
    },
  ],
  quiz: [
    {
      id: 'mongodb-install-q1',
      question: 'Which command shows all databases in MongoDB shell?',
      options: [
        'list databases',
        'show dbs',
        'db.showAll()',
        'get databases',
      ],
      correct: 1,
      explanation: 'The command "show dbs" lists all databases in MongoDB. You can also use "show databases" which is an alias.',
    },
  ],
};
