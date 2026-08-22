import type { RedisLesson } from '../redis-curriculum';

export const lesson01: RedisLesson = {
  id: 'redis-01',
  slug: '01-introduction',
  chapter: 'fundamentals',
  order: 1,
  difficulty: 'beginner',
  readingTime: 10,
  title: 'Introduction to Redis',
  description: 'Understand what Redis is, why it is blazingly fast, and the key use cases that make it essential in modern stacks.',
  sections: [
    {
      type: 'text',
      content: 'Redis (Remote Dictionary Server) is an open-source, in-memory key-value store. Unlike traditional databases that read and write to disk, Redis keeps all its data in RAM. This single design decision is the reason Redis can respond to requests in under a millisecond — up to 100,000 operations per second on a single instance. It is single-threaded, which eliminates lock contention entirely, and it uses a non-blocking I/O event loop to handle concurrency without multiple threads.',
    },
    {
      type: 'heading',
      content: 'Why RAM is Faster Than Disk',
    },
    {
      type: 'analogy',
      title: 'The desk vs. filing cabinet analogy',
      content: 'Think of your desk as RAM and your filing cabinet as a hard disk. Grabbing a document from your desk takes one second. Walking to the cabinet, finding the drawer, flipping through folders, and pulling the file takes several minutes. Your disk works the same way — data must be located, read into memory, and transferred. RAM skips all of that. Redis keeps your data permanently on the desk.',
    },
    {
      type: 'heading',
      content: 'Redis vs. Traditional Databases',
    },
    {
      type: 'table',
      headers: ['Attribute', 'Redis', 'PostgreSQL / MySQL'],
      rows: [
        ['Storage', 'In-memory (RAM)', 'On-disk (SSD / HDD)'],
        ['Response time', 'Sub-millisecond (< 1 ms)', 'Milliseconds to seconds'],
        ['Data model', 'Key-value with rich types', 'Tables with rows and columns'],
        ['Persistence', 'Optional (RDB / AOF)', 'Always persisted'],
        ['Query language', 'Simple commands (GET, SET)', 'SQL (SELECT, JOIN, etc.)'],
        ['Best use case', 'Caching, sessions, queues', 'Complex queries, transactions'],
        ['Durability', 'Configurable', 'Full ACID compliance'],
      ],
    },
    {
      type: 'heading',
      content: 'Primary Use Cases',
    },
    {
      type: 'list',
      items: [
        'Session storage — Store user login sessions with automatic expiry. Redis handles millions of sessions efficiently without touching the main database on every request.',
        'Caching — Cache the results of expensive database queries or API calls. Serve repeated requests from memory instead of recomputing or re-fetching.',
        'Rate limiting — Track how many requests a user has made in a time window using atomic increment operations (INCR). Block abusers without a database query.',
        'Pub/Sub messaging — Broadcast events to many subscribers in real time. Used for live notifications, dashboards, and microservice communication.',
        'Leaderboards — Sorted Sets maintain a ranked list of scores that can be updated and queried instantly. Games, rankings, and reputation systems use this heavily.',
        'Job queues — Use Lists as first-in, first-out queues. Workers block on BRPOP waiting for new jobs. BullMQ builds a full job queue system on top of Redis.',
        'Real-time analytics — Count page views, track unique visitors, and aggregate metrics in real time using atomic operations and HyperLogLog.',
      ],
    },
    {
      type: 'heading',
      content: 'Persistence Options',
    },
    {
      type: 'text',
      content: 'Redis is primarily an in-memory store, but it offers two persistence mechanisms so data can survive a restart. Understanding the tradeoffs helps you choose the right configuration for your use case.',
    },
    {
      type: 'table',
      headers: ['Option', 'How it works', 'Pros', 'Cons', 'Best for'],
      rows: [
        ['RDB (snapshots)', 'Saves a point-in-time snapshot of the dataset to disk at intervals', 'Very compact files, fast restarts', 'Can lose data since last snapshot', 'Backups, cache warm-up'],
        ['AOF (append-only file)', 'Logs every write command. Replays on restart.', 'Minimal data loss, more durable', 'Larger files, slower restart', 'Session stores, critical data'],
        ['RDB + AOF', 'Both mechanisms enabled simultaneously', 'Best durability', 'Higher disk I/O', 'Production systems'],
        ['No persistence', 'Data only in memory, lost on restart', 'Maximum performance', 'All data lost on crash', 'Pure caching, throwaway data'],
      ],
    },
    {
      type: 'heading',
      content: 'Redis Data Types Overview',
    },
    {
      type: 'list',
      items: [
        'String — The most basic type. Stores text, numbers, or binary data up to 512 MB. Used for counters, tokens, and cached values.',
        'List — An ordered sequence of strings. Supports push/pop from both ends. Ideal for queues and recent-activity feeds.',
        'Set — An unordered collection of unique strings. Perfect for tracking unique visitors, tags, and memberships.',
        'Hash — A map of field-value pairs. Stores structured objects like user profiles without serializing to JSON.',
        'Sorted Set — Like a Set but every member has a floating-point score. Redis keeps members sorted by score automatically. Powers leaderboards and priority queues.',
        'Stream — An append-only log of entries with consumer groups. The most durable and feature-rich messaging primitive in Redis.',
      ],
    },
    {
      type: 'heading',
      content: 'Single-Threaded Architecture',
    },
    {
      type: 'text',
      content: 'Redis processes all commands in a single thread. At first this sounds like a limitation, but it is actually a strength. Because only one command executes at a time, there is no need for mutex locks, no deadlocks, and no thread context-switching overhead. Redis uses a non-blocking I/O event loop (similar to Node.js) to handle thousands of client connections concurrently while still processing commands sequentially. The single thread also means all commands are inherently atomic — a INCR, for example, will never produce a race condition.',
    },
    {
      type: 'example',
      title: 'Installing Redis and first connection',
      content: 'These commands install Redis on Ubuntu/macOS and connect to the server using the redis-cli interactive shell.',
      language: 'bash',
      code: `# Ubuntu / Debian
sudo apt update && sudo apt install redis-server
sudo systemctl start redis

# macOS with Homebrew
brew install redis
brew services start redis

# Verify it is running
redis-cli ping
# => PONG

# Open interactive shell
redis-cli

# Check server info
127.0.0.1:6379> INFO server`,
      output: 'PONG',
    },
    {
      type: 'example',
      title: 'Basic SET, GET, and DEL operations',
      content: 'These three commands are the foundation of Redis — every other data type builds on top of this concept of named keys that hold values.',
      language: 'bash',
      code: `# Store a value
SET username "alice"
# => OK

# Retrieve a value
GET username
# => "alice"

# Store with expiry (TTL in seconds)
SET session_token "abc123" EX 3600
# => OK

# Delete a key
DEL username
# => 1  (number of keys deleted)

# Check if a key exists
EXISTS username
# => 0  (key was deleted)

# Increment a counter atomically
SET page_views 0
INCR page_views
# => 1
INCR page_views
# => 2`,
      output: 'OK',
    },
    {
      type: 'tryit',
      title: 'Use Case Explorer',
      css: `.uce{font-family:system-ui,sans-serif;max-width:680px;margin:0 auto;padding:16px;}
.uce h2{font-size:18px;font-weight:700;margin:0 0 14px;color:#111;}
.uce-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;}
.uce-card{background:#fff;border:2px solid #e5e5e5;border-radius:10px;padding:12px;cursor:pointer;text-align:center;transition:all .15s;}
.uce-card:hover{border-color:#DC382D;background:#fff5f5;}
.uce-card.active{border-color:#DC382D;background:#DC382D;color:#fff;}
.uce-card .icon{font-size:22px;margin-bottom:4px;}
.uce-card .label{font-size:13px;font-weight:600;}
.uce-detail{background:#fff;border:2px solid #DC382D;border-radius:10px;padding:18px;display:none;}
.uce-detail.visible{display:block;}
.uce-detail h3{margin:0 0 8px;font-size:16px;color:#DC382D;}
.uce-detail p{margin:0 0 10px;font-size:14px;color:#333;line-height:1.6;}
.uce-detail .fit{font-weight:600;color:#111;margin-bottom:6px;font-size:13px;}
.uce-detail pre{background:#1a1a1a;color:#4ade80;padding:12px;border-radius:8px;font-size:12px;overflow-x:auto;margin:0;}`,
      js: `var cases = [
  {
    icon: 'C', label: 'Caching',
    desc: 'Store the result of expensive database queries or API responses in Redis. The next request gets served from memory in under a millisecond instead of waiting for the database.',
    fit: 'Redis is ideal because it is fast, supports TTL so stale data auto-expires, and a single SET/GET is all you need.',
    cmd: 'SET cache:user:42 \\'{\"name\":\"Alice\",\"email\":\"a@b.com\"}\\' EX 300\\nGET cache:user:42'
  },
  {
    icon: 'S', label: 'Sessions',
    desc: 'User login sessions are short-lived, frequently accessed, and need fast lookup. Storing them in Redis with a TTL means they auto-expire on logout or inactivity.',
    fit: 'Redis TTL eliminates manual cleanup. The in-memory storage means session lookups never touch the main database.',
    cmd: 'SET session:xyz123 \\'{\"userId\":42,\"role\":\"admin\"}\\' EX 1800\\nGET session:xyz123\\nDEL session:xyz123'
  },
  {
    icon: 'R', label: 'Rate Limiting',
    desc: 'Count how many requests a client makes in a sliding window. Atomic INCR ensures no race conditions even under high concurrency.',
    fit: 'INCR is atomic and returns the new value in one operation. EXPIRE sets the window duration. No locks, no transactions needed.',
    cmd: 'INCR rate:192.168.1.1\\nEXPIRE rate:192.168.1.1 60\\n# Check if over limit: GET rate:192.168.1.1'
  },
  {
    icon: 'L', label: 'Leaderboards',
    desc: 'A Sorted Set keeps players ranked by score. Scores update instantly, and you can query any range of the leaderboard in O(log N) time.',
    fit: 'ZADD adds or updates a player score. ZREVRANGE retrieves the top N players in order. Redis handles all the sorting automatically.',
    cmd: 'ZADD leaderboard 4200 \"alice\"\\nZADD leaderboard 3800 \"bob\"\\nZREVRANGE leaderboard 0 9 WITHSCORES'
  },
  {
    icon: 'P', label: 'Pub/Sub',
    desc: 'Broadcast real-time events to any number of subscribers. Services subscribe to channels and receive messages the instant they are published.',
    fit: 'Redis Pub/Sub delivers messages in real time with microsecond latency. Ideal for notifications, live feeds, and inter-service events.',
    cmd: '# Subscriber (runs in separate connection)\\nSUBSCRIBE notifications\\n\\n# Publisher\\nPUBLISH notifications \"New order placed: #1042\"'
  },
  {
    icon: 'J', label: 'Job Queues',
    desc: 'Use a Redis List as a queue. Producers push jobs onto the list. Worker processes block on BRPOP — they wait until a job arrives and process it immediately.',
    fit: 'BRPOP is atomic and blocking, so workers do not busy-loop. If the queue is empty, the worker sleeps until work arrives.',
    cmd: '# Producer\\nLPUSH jobs:email \\'{\"to\":\"user@example.com\",\"subject\":\"Welcome\"}?\\'\\n\\n# Worker (blocks until item available)\\nBRPOP jobs:email 0'
  }
];

var activeIdx = null;

function render() {
  var cardsHtml = cases.map(function(c, i) {
    var active = activeIdx === i ? ' active' : '';
    return '<div class="uce-card' + active + '" data-i="' + i + '">' +
      '<div class="icon">' + c.icon + '</div>' +
      '<div class="label">' + c.label + '</div>' +
      '</div>';
  }).join('');

  var detailHtml = '';
  if (activeIdx !== null) {
    var c = cases[activeIdx];
    detailHtml = '<div class="uce-detail visible">' +
      '<h3>' + c.label + '</h3>' +
      '<p>' + c.desc + '</p>' +
      '<div class="fit">Why Redis fits:</div>' +
      '<p>' + c.fit + '</p>' +
      '<pre>' + c.cmd + '</pre>' +
      '</div>';
  }

  document.getElementById('output').innerHTML =
    '<div class="uce">' +
    '<h2>Click a use case to explore</h2>' +
    '<div class="uce-grid">' + cardsHtml + '</div>' +
    detailHtml +
    '</div>';

  document.querySelectorAll('.uce-card').forEach(function(card) {
    card.addEventListener('click', function() {
      var i = parseInt(card.getAttribute('data-i'));
      activeIdx = activeIdx === i ? null : i;
      render();
    });
  });
}

render();`,
    },
  ],
  exercises: [
    {
      id: 'redis-01-ex1',
      question: 'What is the primary reason Redis is faster than a traditional relational database?',
      type: 'multiple-choice',
      options: [
        'Redis uses a proprietary compression algorithm',
        'Redis keeps all data in RAM rather than reading from disk',
        'Redis uses multiple threads to process requests in parallel',
        'Redis stores data in a binary format that is faster to parse',
      ],
      correct: 1,
      explanation: 'Redis stores all data in memory (RAM). RAM access is orders of magnitude faster than disk I/O, which is why Redis can respond in under a millisecond while disk-based databases typically take milliseconds to seconds.',
    },
    {
      id: 'redis-01-ex2',
      question: 'Which Redis persistence option logs every write command so data can be replayed on restart?',
      type: 'multiple-choice',
      options: [
        'RDB (snapshots)',
        'AOF (append-only file)',
        'WAL (write-ahead log)',
        'No persistence',
      ],
      correct: 1,
      explanation: 'AOF (Append-Only File) logs every write command. On restart, Redis replays the log to reconstruct the dataset. This provides much better durability than RDB snapshots, which only save at intervals.',
    },
    {
      id: 'redis-01-ex3',
      question: 'Redis is single-threaded. Which of the following is a direct benefit of this design?',
      type: 'multiple-choice',
      options: [
        'It can run on computers with no CPU',
        'All commands are inherently atomic — no race conditions between concurrent clients',
        'It uses less RAM than multi-threaded databases',
        'It can process more total requests per second than any multi-threaded system',
      ],
      correct: 1,
      explanation: 'Because only one command executes at a time, every Redis command is inherently atomic. Operations like INCR never produce race conditions regardless of how many clients are connected simultaneously.',
    },
  ],
  quiz: [
    {
      id: 'redis-01-q1',
      question: 'Which command verifies that a Redis server is running and responding?',
      options: ['STATUS', 'PING', 'HELLO', 'CHECK'],
      correct: 1,
      explanation: 'PING sends a simple health check to Redis. A running server responds with PONG. It is the fastest way to confirm a connection is alive.',
    },
    {
      id: 'redis-01-q2',
      question: 'You need to store user session data that should automatically disappear after 30 minutes of inactivity. Which Redis feature makes this trivial?',
      options: [
        'Redis Streams',
        'Sorted Sets',
        'TTL (time-to-live) with EXPIRE or the EX option on SET',
        'AOF persistence',
      ],
      correct: 2,
      explanation: 'Redis TTL lets you attach an expiry to any key. Using SET session:xyz "data" EX 1800 (1800 seconds = 30 minutes) means Redis automatically deletes the key after 30 minutes. No cron jobs or manual cleanup needed.',
    },
    {
      id: 'redis-01-q3',
      question: 'Which Redis data type would you use to build a real-time leaderboard where players are ranked by score?',
      options: ['String', 'List', 'Set', 'Sorted Set'],
      correct: 3,
      explanation: 'Sorted Sets store members with an associated floating-point score. Redis keeps members sorted by score automatically. ZADD adds/updates scores, ZREVRANGE retrieves the top N players in descending order.',
    },
  ],
};
