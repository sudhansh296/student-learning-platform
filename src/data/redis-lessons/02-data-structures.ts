import type { RedisLesson } from '../redis-curriculum';

export const lesson02: RedisLesson = {
  id: 'redis-02',
  slug: '02-data-structures',
  chapter: 'structures',
  order: 2,
  difficulty: 'beginner',
  readingTime: 13,
  title: 'Redis Data Structures',
  description: 'Master the five core Redis data structures -- Strings, Lists, Sets, Hashes, and Sorted Sets -- and when to use each.',
  sections: [
    {
      type: 'text',
      content: 'Redis is not just a key-value store. It supports five rich data types, each designed and optimized for specific access patterns. Choosing the right data type is the single most important decision when using Redis -- the wrong type leads to complex workarounds, while the right type makes the solution trivially simple. Every Redis key holds exactly one value, and the type of that value determines which commands are available for it.',
    },
    {
      type: 'heading',
      content: 'The Five Core Data Types',
    },
    {
      type: 'table',
      headers: ['Type', 'Stores', 'Typical Use Case', 'Key Commands'],
      rows: [
        ['String', 'Text, numbers, or binary data (up to 512 MB)', 'Counters, tokens, cached HTML, session IDs', 'GET, SET, INCR, APPEND, GETRANGE'],
        ['List', 'Ordered sequence of strings, duplicates allowed', 'Job queues, activity feeds, recent items', 'LPUSH, RPUSH, LRANGE, LPOP, RPOP'],
        ['Set', 'Unordered collection of unique strings', 'Unique visitors, tags, memberships, friends', 'SADD, SMEMBERS, SISMEMBER, SINTER'],
        ['Hash', 'Map of field-value string pairs', 'User profiles, product records, config objects', 'HSET, HGET, HGETALL, HDEL'],
        ['Sorted Set', 'Unique members each with a floating-point score', 'Leaderboards, priority queues, range queries', 'ZADD, ZRANGE, ZREVRANGE, ZSCORE'],
      ],
    },
    {
      type: 'heading',
      content: 'Strings',
    },
    {
      type: 'text',
      content: 'The String is the most fundamental Redis type. Despite the name, it can store any binary-safe data: text, serialized JSON, integers, floats, or raw bytes. Strings support atomic increment and decrement operations, making them ideal for counters. The APPEND command lets you build values incrementally. GETRANGE extracts a substring without loading the full value. A String value can be at most 512 MB, though in practice you should keep values small for performance.',
    },
    {
      type: 'example',
      title: 'String commands',
      content: 'SET and GET are the foundation. INCR, APPEND, and GETRANGE show how Strings go beyond simple key-value storage.',
      language: 'bash',
      code: `# Basic set and get
SET product:name "Wireless Keyboard"
GET product:name
# => "Wireless Keyboard"

# Atomic counter -- no race conditions
SET page_views 0
INCR page_views
# => 1
INCRBY page_views 10
# => 11

# Append to existing value
SET log:today "Started"
APPEND log:today " | Request received"
GET log:today
# => "Started | Request received"

# Extract substring (0-indexed, inclusive)
SET isbn "978-3-16-148410-0"
GETRANGE isbn 0 2
# => "978"

# Store and retrieve a number
SET price 29.99
GET price
# => "29.99"  (strings in Redis, parse in your app)`,
      output: 'OK',
    },
    {
      type: 'heading',
      content: 'Lists',
    },
    {
      type: 'text',
      content: 'A Redis List is an ordered sequence of strings implemented as a linked list. Items can be pushed onto or popped from either end in O(1) time regardless of list length. This makes Lists perfect for queues (LPUSH + BRPOP) and stacks (LPUSH + LPOP). LRANGE retrieves a range of elements without removing them, making it useful for reading recent activity feeds. The maximum number of elements in a List is 2^32 - 1 (over 4 billion).',
    },
    {
      type: 'example',
      title: 'List commands',
      content: 'LPUSH adds to the head, RPUSH adds to the tail. LRANGE reads without removing. LPOP and RPOP remove from each end.',
      language: 'bash',
      code: `# Add items to the tail (right) of a list
RPUSH tasks:queue "send-email" "resize-image" "generate-report"
# => 3 (list length)

# Add to the head (left)
LPUSH tasks:queue "urgent-task"
# => 4

# Read elements without removing (0 = first, -1 = last)
LRANGE tasks:queue 0 -1
# => 1) "urgent-task"
# => 2) "send-email"
# => 3) "resize-image"
# => 4) "generate-report"

# Pop from left (head) -- FIFO queue worker
LPOP tasks:queue
# => "urgent-task"

# Pop from right (tail)
RPOP tasks:queue
# => "generate-report"

# Length of list
LLEN tasks:queue
# => 2`,
      output: '3',
    },
    {
      type: 'heading',
      content: 'Sets',
    },
    {
      type: 'text',
      content: 'A Redis Set is an unordered collection of unique strings. Attempting to add a duplicate member is silently ignored. Sets support O(1) membership tests regardless of size -- SISMEMBER answers "is this in the set?" instantly. The real power of Sets comes from set operations: SINTER (intersection), SUNION (union), and SDIFF (difference). These operations let you answer questions like "which users follow both Alice and Bob?" directly in Redis without pulling data into your application.',
    },
    {
      type: 'example',
      title: 'Set commands',
      content: 'SADD adds members (duplicates are ignored). SMEMBERS lists all. SISMEMBER checks membership. SINTER and SUNION combine sets.',
      language: 'bash',
      code: `# Add members to a set
SADD user:42:tags "javascript" "redis" "nodejs"
# => 3

# Adding a duplicate -- silently ignored
SADD user:42:tags "redis"
# => 0 (nothing added)

# Check membership
SISMEMBER user:42:tags "redis"
# => 1 (true)
SISMEMBER user:42:tags "python"
# => 0 (false)

# Count members
SCARD user:42:tags
# => 3

# Retrieve all members (unordered)
SMEMBERS user:42:tags
# => 1) "nodejs"  2) "javascript"  3) "redis"

# Set intersection -- tags both users have in common
SADD user:99:tags "redis" "python" "go"
SINTER user:42:tags user:99:tags
# => 1) "redis"

# Set union -- all tags from both users
SUNION user:42:tags user:99:tags
# => 1) "javascript"  2) "redis"  3) "nodejs"  4) "python"  5) "go"`,
      output: '3',
    },
    {
      type: 'heading',
      content: 'Hashes',
    },
    {
      type: 'text',
      content: 'A Redis Hash is a map of string field-value pairs stored under a single key. Think of it as a dictionary or a JSON object. Hashes are memory-efficient for storing structured records like user profiles: instead of serializing the entire object to JSON and storing it as a String, you store each field separately. This means you can read or update a single field (HGET, HSET) without touching the rest of the record. Hashes support up to 2^32 - 1 fields per key.',
    },
    {
      type: 'example',
      title: 'Hash commands',
      content: 'HSET stores one or more fields. HGET retrieves one field. HGETALL retrieves all fields. HDEL removes a field. HEXISTS checks if a field exists.',
      language: 'bash',
      code: `# Store a user record
HSET user:42 name "Alice" email "alice@example.com" age "30" role "admin"
# => 4 (fields added)

# Get a single field
HGET user:42 name
# => "Alice"

# Get all fields and values
HGETALL user:42
# => 1) "name"   2) "Alice"
# => 3) "email"  4) "alice@example.com"
# => 5) "age"    6) "30"
# => 7) "role"   8) "admin"

# Update a single field without touching others
HSET user:42 role "superadmin"

# Delete a field
HDEL user:42 age
# => 1

# Check if field exists
HEXISTS user:42 age
# => 0 (deleted above)
HEXISTS user:42 email
# => 1`,
      output: '4',
    },
    {
      type: 'heading',
      content: 'Sorted Sets',
    },
    {
      type: 'text',
      content: 'A Sorted Set combines the uniqueness of a Set with a floating-point score attached to every member. Redis automatically keeps members sorted by score at all times. You never sort manually -- ZRANGE and ZREVRANGE always return members in score order. Adding or updating a member is O(log N). Querying a range by score (ZRANGEBYSCORE) or by rank (ZRANGE) is also O(log N + M) where M is the number of results. Sorted Sets are the natural choice for leaderboards, priority queues, and any "top N" query.',
    },
    {
      type: 'example',
      title: 'Sorted Set commands',
      content: 'ZADD adds members with scores. ZRANGE retrieves by rank (ascending). ZREVRANGE by rank (descending). ZSCORE returns a member\'s score. ZRANK returns a member\'s position.',
      language: 'bash',
      code: `# Add players with scores (ZADD key score member)
ZADD leaderboard 4200 "alice"
ZADD leaderboard 3800 "bob"
ZADD leaderboard 5100 "carol"
ZADD leaderboard 2900 "dave"

# Top 3 players (descending by score, with scores)
ZREVRANGE leaderboard 0 2 WITHSCORES
# => 1) "carol"  2) "5100"
# => 3) "alice"  4) "4200"
# => 5) "bob"    6) "3800"

# Ascending (lowest first)
ZRANGE leaderboard 0 -1 WITHSCORES

# Get a player's score
ZSCORE leaderboard "alice"
# => "4200"

# Get a player's rank (0-indexed, ascending)
ZRANK leaderboard "dave"
# => 0  (lowest score = rank 0)

# Update alice's score
ZADD leaderboard 5500 "alice"

# Remove a member
ZREM leaderboard "dave"
# => 1`,
      output: '1',
    },
    {
      type: 'heading',
      content: 'Choosing the Right Data Type',
    },
    {
      type: 'table',
      headers: ['Use Case', 'Best Data Type', 'Reason'],
      rows: [
        ['Cache a user profile (full object)', 'String (serialized JSON) or Hash', 'String if always read whole; Hash if fields are read/updated individually'],
        ['Page view counter', 'String', 'INCR is atomic, fast, and requires no locks'],
        ['Job queue (FIFO)', 'List', 'LPUSH to enqueue, BRPOP to dequeue; BRPOP blocks without busy-waiting'],
        ['Unique visitor tracking', 'Set', 'SADD auto-deduplicates; SCARD returns exact count in O(1)'],
        ['User tags or interests', 'Set', 'Set operations (SINTER, SUNION) answer "users with tag X and Y" directly'],
        ['User profile fields', 'Hash', 'Update one field (HSET user:42 email "...") without touching the rest'],
        ['Leaderboard with ranking', 'Sorted Set', 'Members stay sorted by score automatically; ZRANK is O(log N)'],
        ['Rate-limiting window', 'String', 'INCR + EXPIRE sets a counter that resets after the window expires'],
        ['Recently viewed items', 'List', 'LPUSH + LTRIM keeps a capped list of the last N items'],
        ['Mutual friends (set intersection)', 'Set', 'SINTER user:a:friends user:b:friends finds shared connections instantly'],
      ],
    },
    {
      type: 'tryit',
      title: 'Data Structure Explorer',
      css: `.dse{font-family:system-ui,sans-serif;max-width:700px;margin:0 auto;padding:16px;}
.dse h2{font-size:18px;font-weight:700;margin:0 0 14px;color:#111;}
.dse-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;}
.dse-tab{padding:8px 14px;border:2px solid #e5e5e5;border-radius:8px;background:#fff;cursor:pointer;font-size:13px;font-weight:600;transition:all .15s;}
.dse-tab:hover{border-color:#DC382D;}
.dse-tab.active{background:#DC382D;color:#fff;border-color:#DC382D;}
.dse-card{background:#fff;border:2px solid #e5e5e5;border-radius:12px;padding:20px;}
.dse-card h3{font-size:17px;font-weight:700;color:#DC382D;margin:0 0 8px;}
.dse-desc{font-size:14px;color:#333;line-height:1.6;margin-bottom:14px;}
.dse-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#888;margin-bottom:6px;}
.dse-pill-row{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:14px;}
.dse-pill{padding:4px 10px;border-radius:20px;font-size:12px;background:#f3f3f3;color:#333;}
.dse-cmd-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:6px;}
.dse-cmd{display:flex;align-items:baseline;gap:8px;}
.dse-cmd code{font-family:monospace;font-size:13px;background:#1a1a1a;color:#4ade80;padding:3px 8px;border-radius:5px;}
.dse-cmd span{font-size:13px;color:#555;}`,
      js: `var types = [
  {
    name: 'String',
    desc: 'The most basic Redis type. Stores text, numbers, or binary data under a single key. Despite the name, it can hold any binary-safe value. Supports atomic increment/decrement, making it ideal for counters.',
    stores: ['Text', 'Numbers', 'Binary data', 'Serialized JSON', 'Up to 512 MB'],
    uses: ['Counters and rate limits', 'Cached HTML or API responses', 'Session tokens', 'Feature flags'],
    cmds: [
      ['SET key value', 'Store a value'],
      ['GET key', 'Retrieve a value'],
      ['INCR key', 'Atomically increment a number'],
      ['APPEND key value', 'Append text to existing value'],
    ]
  },
  {
    name: 'List',
    desc: 'An ordered sequence of strings implemented as a linked list. Push and pop from both ends in O(1). Use as a queue (LPUSH + BRPOP) or stack (LPUSH + LPOP). LRANGE reads elements without removing them.',
    stores: ['Ordered strings', 'Duplicates allowed', 'Up to 4 billion items'],
    uses: ['Job queues (FIFO)', 'Activity feeds', 'Recent browsing history', 'Log streams'],
    cmds: [
      ['LPUSH key val', 'Push to head (left)'],
      ['RPUSH key val', 'Push to tail (right)'],
      ['LRANGE key 0 -1', 'Read all elements'],
      ['BRPOP key 0', 'Block until item available'],
    ]
  },
  {
    name: 'Set',
    desc: 'An unordered collection of unique strings. Duplicates are silently ignored. SISMEMBER is O(1) regardless of set size. Set operations (SINTER, SUNION, SDIFF) let you find common or unique members across multiple sets.',
    stores: ['Unique strings only', 'No guaranteed order', 'Up to 4 billion members'],
    uses: ['Unique visitor tracking', 'User tags and interests', 'Friend lists', 'Mutual-friend queries'],
    cmds: [
      ['SADD key member', 'Add a member (ignores duplicates)'],
      ['SISMEMBER key m', 'Check if member exists (O(1))'],
      ['SINTER k1 k2', 'Intersection of two sets'],
      ['SUNION k1 k2', 'Union of two sets'],
    ]
  },
  {
    name: 'Hash',
    desc: 'A map of field-value string pairs stored under one key. Like a dictionary or JSON object. Read or update individual fields without loading the whole record. Memory-efficient for structured data.',
    stores: ['Field-value string pairs', 'Up to 4 billion fields per key'],
    uses: ['User profiles', 'Product records', 'Configuration objects', 'Session data with multiple fields'],
    cmds: [
      ['HSET key f v', 'Set one or more fields'],
      ['HGET key field', 'Get one field'],
      ['HGETALL key', 'Get all fields and values'],
      ['HDEL key field', 'Delete a field'],
    ]
  },
  {
    name: 'Sorted Set',
    desc: 'A set where every member has a floating-point score. Members are always kept sorted by score automatically. ZRANGE retrieves by rank in O(log N + M). Perfect for leaderboards and priority queues.',
    stores: ['Unique members with float scores', 'Always sorted by score', 'Up to 4 billion members'],
    uses: ['Leaderboards and rankings', 'Priority job queues', 'Top-N queries', 'Range-by-score lookups'],
    cmds: [
      ['ZADD key score member', 'Add or update a member'],
      ['ZREVRANGE key 0 N', 'Top N members descending'],
      ['ZSCORE key member', 'Get a member\'s score'],
      ['ZRANK key member', 'Get a member\'s rank (0-based)'],
    ]
  }
];

var activeIdx = 0;

function render() {
  var tabsHtml = types.map(function(t, i) {
    return '<button class="dse-tab' + (activeIdx === i ? ' active' : '') + '" data-i="' + i + '">' + t.name + '</button>';
  }).join('');

  var t = types[activeIdx];
  var storesHtml = t.stores.map(function(s) { return '<span class="dse-pill">' + s + '</span>'; }).join('');
  var usesHtml = t.uses.map(function(u) { return '<span class="dse-pill">' + u + '</span>'; }).join('');
  var cmdsHtml = t.cmds.map(function(c) {
    return '<li class="dse-cmd"><code>' + c[0] + '</code><span>' + c[1] + '</span></li>';
  }).join('');

  document.getElementById('output').innerHTML =
    '<div class="dse">' +
    '<h2>Redis Data Structure Explorer</h2>' +
    '<div class="dse-tabs">' + tabsHtml + '</div>' +
    '<div class="dse-card">' +
    '<h3>' + t.name + '</h3>' +
    '<p class="dse-desc">' + t.desc + '</p>' +
    '<div class="dse-label">What it stores</div>' +
    '<div class="dse-pill-row">' + storesHtml + '</div>' +
    '<div class="dse-label">Common use cases</div>' +
    '<div class="dse-pill-row">' + usesHtml + '</div>' +
    '<div class="dse-label">Key commands</div>' +
    '<ul class="dse-cmd-list">' + cmdsHtml + '</ul>' +
    '</div>' +
    '</div>';

  document.querySelectorAll('.dse-tab').forEach(function(btn) {
    btn.addEventListener('click', function() {
      activeIdx = parseInt(btn.getAttribute('data-i'));
      render();
    });
  });
}

render();`,
    },
  ],
  exercises: [
    {
      id: 'redis-02-ex1',
      question: 'You need to store a user profile with fields like name, email, and role, and update individual fields without rewriting the entire object. Which Redis data type is best?',
      type: 'multiple-choice',
      options: [
        'String (serialized JSON)',
        'List',
        'Hash',
        'Sorted Set',
      ],
      correct: 2,
      explanation: 'Hash is ideal for structured objects. HSET updates a single field without touching others. With a String, you would need to deserialize the entire JSON, modify it, and re-serialize on every update.',
    },
    {
      id: 'redis-02-ex2',
      question: 'Which Redis data type automatically keeps its members sorted and supports O(log N) rank queries?',
      type: 'multiple-choice',
      options: [
        'List',
        'Set',
        'Hash',
        'Sorted Set',
      ],
      correct: 3,
      explanation: 'Sorted Sets associate every member with a floating-point score and automatically maintain sort order. ZRANK returns a member\'s position in O(log N) time. This is exactly what leaderboards and priority queues need.',
    },
    {
      id: 'redis-02-ex3',
      question: 'You want to find all tags that two users have in common. Both users have their tags stored in Redis Sets. Which command solves this in a single operation?',
      type: 'multiple-choice',
      options: [
        'SMEMBERS on both sets, then compare in application code',
        'SINTER user:a:tags user:b:tags',
        'SUNION user:a:tags user:b:tags',
        'SDIFF user:a:tags user:b:tags',
      ],
      correct: 1,
      explanation: 'SINTER returns only the members that exist in all specified sets -- the intersection. Redis performs this operation server-side, so you get the answer without transferring full sets to your application.',
    },
  ],
  quiz: [
    {
      id: 'redis-02-q1',
      question: 'What happens when you SADD a member that already exists in a Redis Set?',
      options: [
        'Redis raises an error',
        'The duplicate is added, making the set have two copies',
        'The operation is silently ignored and returns 0',
        'The existing member is overwritten',
      ],
      correct: 2,
      explanation: 'Sets only hold unique members. Adding a duplicate silently does nothing and returns 0 (the number of NEW members added). The set is unchanged.',
    },
    {
      id: 'redis-02-q2',
      question: 'Which Redis type would you choose to implement a blocking job queue where workers sleep until work arrives?',
      options: [
        'Sorted Set with ZRANGE',
        'List with BRPOP',
        'Hash with HGETALL',
        'Set with SMEMBERS',
      ],
      correct: 1,
      explanation: 'BRPOP (blocking right-pop) on a List will block the worker connection until an element is available, then pop and return it atomically. This eliminates polling entirely.',
    },
    {
      id: 'redis-02-q3',
      question: 'A Sorted Set has 10,000 members. What is the time complexity of ZRANK to find a member\'s position?',
      options: [
        'O(1)',
        'O(log N)',
        'O(N)',
        'O(N log N)',
      ],
      correct: 1,
      explanation: 'ZRANK runs in O(log N) time because Redis maintains the Sorted Set as a skip list. It does not scan all members -- it navigates the skip list structure to find the rank in logarithmic time.',
    },
  ],
};
