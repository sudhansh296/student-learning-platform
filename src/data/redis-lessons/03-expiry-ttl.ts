import type { RedisLesson } from '../redis-curriculum';

export const lesson03: RedisLesson = {
  id: 'redis-03',
  slug: '03-expiry-ttl',
  chapter: 'structures',
  order: 3,
  difficulty: 'beginner',
  readingTime: 9,
  title: 'Expiry and TTL',
  description: 'Control how long data lives in Redis using TTL -- essential for caching, sessions, and auto-cleanup.',
  sections: [
    {
      type: 'text',
      content: 'One of Redis\'s most powerful features is the ability to attach a time-to-live (TTL) to any key. When the TTL expires, Redis automatically deletes the key -- no cron jobs, no cleanup scripts, no application logic required. This is the foundation of caching (serve stale data for N seconds), session management (log users out after inactivity), one-time tokens (OTPs expire in 5 minutes), and rate limiting (counters reset every window). Without TTL, a cache grows forever and eventually exhausts memory.',
    },
    {
      type: 'heading',
      content: 'TTL Commands',
    },
    {
      type: 'table',
      headers: ['Command', 'Units', 'Description'],
      rows: [
        ['EXPIRE key seconds', 'Seconds', 'Set expiry on an existing key in seconds from now'],
        ['EXPIREAT key timestamp', 'Unix timestamp (seconds)', 'Set expiry to a specific Unix timestamp'],
        ['PEXPIRE key milliseconds', 'Milliseconds', 'Set expiry in milliseconds (higher precision)'],
        ['PEXPIREAT key timestamp-ms', 'Unix timestamp (ms)', 'Set expiry to a specific Unix timestamp in milliseconds'],
        ['TTL key', 'Seconds remaining', 'Check remaining TTL. Returns -1 (no expiry) or -2 (key does not exist)'],
        ['PTTL key', 'Milliseconds remaining', 'Check remaining TTL in milliseconds'],
        ['PERSIST key', 'N/A', 'Remove the expiry from a key, making it permanent'],
      ],
    },
    {
      type: 'heading',
      content: 'Setting TTL at Creation Time',
    },
    {
      type: 'text',
      content: 'The most common pattern is to set a key and its TTL in a single atomic command using SET options. This avoids a race condition where another process could access the key between the SET and the EXPIRE call.',
    },
    {
      type: 'table',
      headers: ['Option', 'Meaning', 'Example'],
      rows: [
        ['EX seconds', 'Expire in N seconds', 'SET session:xyz "data" EX 1800'],
        ['PX milliseconds', 'Expire in N milliseconds', 'SET otp:alice "928341" PX 300000'],
        ['EXAT timestamp', 'Expire at Unix timestamp (seconds)', 'SET token:abc "jwt..." EXAT 1893456000'],
        ['PXAT timestamp-ms', 'Expire at Unix timestamp (milliseconds)', 'SET lock:res "1" PXAT 1893456000000'],
        ['KEEPTTL', 'Preserve existing TTL when updating value', 'SET counter:hits 100 KEEPTTL'],
      ],
    },
    {
      type: 'heading',
      content: 'How Redis Expires Keys',
    },
    {
      type: 'text',
      content: 'Redis uses two complementary strategies to expire keys, and neither requires disk I/O. The first is lazy expiry: when a client requests a key, Redis checks if it has expired before returning the value. If it has, Redis deletes it and returns nil. This means a key might linger in memory slightly past its TTL if it is never accessed. The second is active expiry: Redis periodically samples a random subset of keys with TTLs and deletes any that have expired. This background process runs 10 times per second by default and ensures memory is reclaimed even from keys that are never accessed again. Together, these strategies mean expired keys are removed promptly without requiring a dedicated cleanup thread.',
    },
    {
      type: 'heading',
      content: 'Eviction Policies',
    },
    {
      type: 'text',
      content: 'When Redis runs out of memory (or hits the maxmemory limit), it must decide what to evict. The eviction policy controls this behavior and is set in redis.conf or via CONFIG SET.',
    },
    {
      type: 'table',
      headers: ['Policy', 'Behavior', 'Best For'],
      rows: [
        ['noeviction', 'Return error when memory limit is hit. No keys are evicted.', 'Databases where data loss is unacceptable'],
        ['allkeys-lru', 'Evict the least recently used key from all keys', 'General-purpose caches'],
        ['volatile-lru', 'Evict the least recently used key from keys with TTL only', 'Mixed workloads with permanent and cached data'],
        ['allkeys-lfu', 'Evict the least frequently used key from all keys', 'Caches where some keys are accessed far more often'],
        ['volatile-lfu', 'Evict the least frequently used key from keys with TTL only', 'Mixed workloads with frequency-based cache value'],
        ['allkeys-random', 'Evict a random key from all keys', 'When all keys have similar access frequency'],
        ['volatile-random', 'Evict a random key from keys with TTL only', 'Simple caches with no access pattern data'],
        ['volatile-ttl', 'Evict the key with the shortest remaining TTL', 'When soonest-to-expire data is least valuable'],
      ],
    },
    {
      type: 'example',
      title: 'EXPIRE and TTL commands',
      content: 'Set a TTL on an existing key, check the remaining time, and remove the expiry with PERSIST.',
      language: 'bash',
      code: `# Set a key without TTL
SET user:42:token "abc123"

# Add TTL of 1 hour (3600 seconds)
EXPIRE user:42:token 3600
# => 1 (success)

# Check remaining TTL
TTL user:42:token
# => 3598 (seconds remaining, ticked down)

# Fine-grained TTL in milliseconds
PTTL user:42:token
# => 3597841 (milliseconds remaining)

# Make a key permanent (remove TTL)
PERSIST user:42:token
# => 1

# TTL on permanent key
TTL user:42:token
# => -1 (no expiry)

# TTL on non-existent key
TTL does:not:exist
# => -2 (key does not exist)`,
      output: '1',
    },
    {
      type: 'example',
      title: 'SET with EX option -- atomic creation with TTL',
      content: 'Setting a key and its TTL in one command avoids the race condition between SET and EXPIRE.',
      language: 'bash',
      code: `# One-time password: expires in 5 minutes (300 seconds)
SET otp:alice "928341" EX 300
# => OK

# Session token: expires in 30 minutes
SET session:xyz "eyJhbGci..." EX 1800
# => OK

# Cache entry: expires in 10 minutes
SET cache:homepage "<html>..." EX 600
# => OK

# Check how long the homepage cache has left
TTL cache:homepage
# => 598

# Millisecond precision for a distributed lock (500 ms)
SET lock:resource "worker-1" PX 500 NX
# NX = only set if key does not exist (prevents lock collision)`,
      output: 'OK',
    },
    {
      type: 'heading',
      content: 'Common TTL Patterns',
    },
    {
      type: 'list',
      items: [
        'Session expiry -- SET session:id "data" EX 1800. The session automatically expires after 30 minutes of inactivity. Reset the TTL on each request with EXPIRE to implement sliding expiry.',
        'Cache invalidation -- SET cache:user:42 "{...}" EX 300. Cached data is served for 5 minutes, then Redis auto-expires it, forcing the next request to fetch fresh data from the database.',
        'OTP / verification codes -- SET otp:phone:+15551234 "483920" EX 300. The OTP expires in 5 minutes. No need to store expiry time in your database or run cleanup queries.',
        'Rate limiting windows -- INCR rate:user:42 then EXPIRE rate:user:42 60. The counter resets every 60 seconds automatically. Check count before processing to enforce limits.',
        'Distributed locks -- SET lock:payment:order-99 "worker-id" EX 10 NX. A lock that auto-releases after 10 seconds prevents deadlocks if the worker crashes.',
        'Leaderboard reset -- EXPIREAT monthly:leaderboard <end-of-month-timestamp>. The leaderboard disappears at midnight on the last day, ready to be rebuilt.',
      ],
    },
    {
      type: 'warning',
      title: 'TTL is lost when you overwrite a key with SET',
      content: 'If you use SET on a key that already has a TTL, the TTL is removed and the key becomes permanent unless you include EX/PX in the new SET command. This is a common bug: a cache entry is refreshed but its TTL is accidentally cleared, causing memory to grow indefinitely.',
    },
    {
      type: 'tryit',
      title: 'TTL Countdown Simulator',
      css: `.ttl-sim{font-family:system-ui,sans-serif;max-width:680px;margin:0 auto;padding:16px;}
.ttl-sim h2{font-size:18px;font-weight:700;margin:0 0 14px;color:#111;}
.ttl-entries{display:flex;flex-direction:column;gap:10px;margin-bottom:14px;}
.ttl-entry{background:#fff;border:2px solid #e5e5e5;border-radius:10px;padding:14px;}
.ttl-entry.expired{opacity:.45;border-color:#ddd;}
.ttl-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:4px;}
.ttl-key{font-family:monospace;font-size:14px;font-weight:700;color:#111;}
.ttl-val{font-size:12px;color:#555;max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.ttl-meta{display:flex;justify-content:space-between;font-size:12px;color:#777;margin-bottom:8px;}
.ttl-bar-bg{height:8px;background:#f0f0f0;border-radius:4px;overflow:hidden;}
.ttl-bar{height:8px;background:#DC382D;border-radius:4px;transition:width .9s linear;}
.ttl-expired-label{font-size:11px;color:#DC382D;font-weight:700;text-align:center;margin-top:6px;}
.ttl-btn{padding:8px 18px;background:#DC382D;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;}
.ttl-btn:hover{background:#b82e22;}
.ttl-empty{font-size:13px;color:#999;text-align:center;padding:20px 0;}`,
      js: `var entries = [
  { key: 'session:user:42', value: 'eyJhbGciOiJIUzI1NiJ9...', orig: 30, rem: 30 },
  { key: 'cache:homepage', value: '<html><body>Welcome</body></html>', orig: 20, rem: 20 },
  { key: 'otp:alice:phone', value: '482910', orig: 15, rem: 15 },
  { key: 'rate:api:192.168.1.1', value: '47', orig: 10, rem: 10 }
];
var nextId = entries.length;
var tick = null;

function addEntry() {
  entries.push({
    key: 'cache:new:entry' + (nextId++),
    value: 'fresh data ' + new Date().toLocaleTimeString(),
    orig: 15,
    rem: 15
  });
  render();
}

function render() {
  var alive = entries.filter(function(e) { return e.rem > 0; });
  var dead = entries.filter(function(e) { return e.rem <= 0; });
  var all = alive.concat(dead);

  var html = '<div class="ttl-sim">' +
    '<h2>TTL Countdown Simulator</h2>' +
    '<div class="ttl-entries">';

  if (all.length === 0) {
    html += '<div class="ttl-empty">All keys have expired. Add a new entry!</div>';
  }

  all.forEach(function(e) {
    var pct = e.orig > 0 ? Math.max(0, (e.rem / e.orig) * 100) : 0;
    var expired = e.rem <= 0;
    html += '<div class="ttl-entry' + (expired ? ' expired' : '') + '">' +
      '<div class="ttl-top">' +
      '<span class="ttl-key">' + e.key + '</span>' +
      '</div>' +
      '<div class="ttl-val">' + e.value + '</div>' +
      '<div class="ttl-meta">' +
      '<span>Original TTL: ' + e.orig + 's</span>' +
      '<span>' + (expired ? 'EXPIRED' : 'Remaining: ' + e.rem + 's') + '</span>' +
      '</div>' +
      '<div class="ttl-bar-bg"><div class="ttl-bar" style="width:' + pct + '%"></div></div>' +
      (expired ? '<div class="ttl-expired-label">KEY DELETED BY REDIS</div>' : '') +
      '</div>';
  });

  html += '</div>' +
    '<button class="ttl-btn" id="addBtn">Add New Entry (15s TTL)</button>' +
    '</div>';

  document.getElementById('output').innerHTML = html;
  document.getElementById('addBtn').addEventListener('click', addEntry);
}

function countdown() {
  entries.forEach(function(e) {
    if (e.rem > 0) e.rem--;
  });
  render();
}

render();
if (tick) clearInterval(tick);
tick = setInterval(countdown, 1000);`,
    },
  ],
  exercises: [
    {
      id: 'redis-03-ex1',
      question: 'You call TTL on a key and get -1. What does this mean?',
      type: 'multiple-choice',
      options: [
        'The key has expired and was deleted',
        'The key does not exist',
        'The key exists but has no expiry set',
        'There was an error checking the TTL',
      ],
      correct: 2,
      explanation: 'TTL returns -1 when the key exists but has no expiry (it is permanent). TTL returns -2 when the key does not exist at all. A non-negative number is the remaining time in seconds.',
    },
    {
      id: 'redis-03-ex2',
      question: 'You have SET user:token "abc" EX 3600. Then you run SET user:token "xyz". What is the TTL of the key now?',
      type: 'multiple-choice',
      options: [
        'Still ~3600 seconds (TTL is preserved)',
        '-1 (no expiry -- TTL was removed by the new SET)',
        '-2 (the old key was replaced by a new key)',
        'An error is returned because the key has a TTL',
      ],
      correct: 1,
      explanation: 'Using SET on an existing key replaces the value AND removes any TTL unless you include EX/PX/KEEPTTL in the new SET command. The key is now permanent. This is a common bug in caching code.',
    },
    {
      id: 'redis-03-ex3',
      question: 'Which eviction policy should you use for a pure caching layer where you want the most recently used data to stay in memory?',
      type: 'multiple-choice',
      options: [
        'noeviction',
        'volatile-ttl',
        'allkeys-lru',
        'volatile-random',
      ],
      correct: 2,
      explanation: 'allkeys-lru evicts the least recently used key across all keys. For a cache where you want frequently accessed data to stay in memory, this is the standard choice. volatile-lru works similarly but only applies to keys with TTL set.',
    },
  ],
  quiz: [
    {
      id: 'redis-03-q1',
      question: 'Which command removes the expiry from a key and makes it permanent?',
      options: ['DEL key', 'EXPIRE key -1', 'PERSIST key', 'TTL key 0'],
      correct: 2,
      explanation: 'PERSIST removes the TTL from a key, making it persistent. The key will no longer expire and TTL will return -1. DEL removes the key entirely, and EXPIRE key -1 is not valid syntax.',
    },
    {
      id: 'redis-03-q2',
      question: 'You want to set a session token that expires in exactly 30 minutes in a single atomic command. Which is correct?',
      options: [
        'SET session:xyz "token" then EXPIRE session:xyz 1800',
        'SET session:xyz "token" EX 1800',
        'SET session:xyz "token" PX 1800',
        'SET session:xyz "token" EXAT 1800',
      ],
      correct: 1,
      explanation: 'SET key value EX 1800 sets the key and a 1800-second TTL atomically. Using a separate EXPIRE call creates a tiny window where the key exists without TTL. PX is milliseconds (PX 1800 = 1.8 seconds), and EXAT takes a Unix timestamp, not a duration.',
    },
    {
      id: 'redis-03-q3',
      question: 'Redis uses two strategies to expire keys. What are they?',
      options: [
        'Disk scan and memory scan',
        'Lazy expiry (checked on access) and active expiry (background sampling)',
        'Timer-based expiry and manual expiry',
        'LRU eviction and LFU eviction',
      ],
      correct: 1,
      explanation: 'Redis uses lazy expiry (checking if a key is expired when it is accessed) and active expiry (periodically sampling random keys with TTLs and deleting expired ones). Together these ensure memory is reclaimed without requiring a dedicated cleanup thread.',
    },
  ],
};
