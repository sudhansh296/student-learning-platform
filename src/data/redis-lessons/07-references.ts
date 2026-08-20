import type { RedisLesson } from '../redis-curriculum';

export const lesson07: RedisLesson = {
  id: 'redis-07',
  slug: '07-references',
  chapter: 'advanced',
  order: 7,
  difficulty: 'beginner',
  readingTime: 8,
  title: 'Redis Quick Reference',
  description: 'A searchable cheat sheet of Redis commands, data types, configuration options, and best practices.',
  sections: [
    {
      type: 'heading',
      content: 'String Commands',
    },
    {
      type: 'table',
      headers: ['Command', 'Syntax', 'Description'],
      rows: [
        ['GET', 'GET key', 'Return the value of a key. Returns nil if key does not exist.'],
        ['SET', 'SET key value [EX seconds] [NX|XX]', 'Set a key to a value. EX sets TTL. NX only sets if absent, XX only if present.'],
        ['DEL', 'DEL key [key ...]', 'Delete one or more keys. Returns count of deleted keys.'],
        ['INCR', 'INCR key', 'Increment integer value by 1. Creates key at 0 if missing. Atomic.'],
        ['INCRBY', 'INCRBY key amount', 'Increment integer value by amount. Use negative amount to decrement.'],
        ['DECR', 'DECR key', 'Decrement integer value by 1. Atomic.'],
        ['APPEND', 'APPEND key value', 'Append value to existing string. Returns new length.'],
        ['STRLEN', 'STRLEN key', 'Return the byte length of the stored string.'],
        ['MGET', 'MGET key [key ...]', 'Return values of multiple keys in a single round trip.'],
        ['MSET', 'MSET key value [key value ...]', 'Set multiple key-value pairs atomically.'],
        ['GETRANGE', 'GETRANGE key start end', 'Return a substring of the stored string (0-indexed, inclusive).'],
        ['SETNX', 'SETNX key value', 'Set key only if it does not exist. Returns 1 on success, 0 if already exists.'],
      ],
    },
    {
      type: 'heading',
      content: 'List Commands',
    },
    {
      type: 'table',
      headers: ['Command', 'Syntax', 'Description'],
      rows: [
        ['LPUSH', 'LPUSH key value [value ...]', 'Insert values at the head (left) of the list. Returns new length.'],
        ['RPUSH', 'RPUSH key value [value ...]', 'Insert values at the tail (right) of the list. Returns new length.'],
        ['LPOP', 'LPOP key [count]', 'Remove and return element(s) from the head of the list.'],
        ['RPOP', 'RPOP key [count]', 'Remove and return element(s) from the tail of the list.'],
        ['LRANGE', 'LRANGE key start stop', 'Return elements from start to stop (inclusive). 0 to -1 = entire list.'],
        ['LLEN', 'LLEN key', 'Return the length of the list.'],
        ['BRPOP', 'BRPOP key [key ...] timeout', 'Blocking pop from tail. Blocks until item available or timeout (0 = forever).'],
        ['LINSERT', 'LINSERT key BEFORE|AFTER pivot value', 'Insert value before or after pivot element.'],
        ['LTRIM', 'LTRIM key start stop', 'Trim list to specified range. Used to cap a list at N items.'],
        ['LINDEX', 'LINDEX key index', 'Return element at index (0-based, negative for from-tail).'],
      ],
    },
    {
      type: 'heading',
      content: 'Set Commands',
    },
    {
      type: 'table',
      headers: ['Command', 'Syntax', 'Description'],
      rows: [
        ['SADD', 'SADD key member [member ...]', 'Add members to a set. Returns count of newly added members.'],
        ['SREM', 'SREM key member [member ...]', 'Remove members from a set. Returns count removed.'],
        ['SMEMBERS', 'SMEMBERS key', 'Return all members of the set (unordered).'],
        ['SISMEMBER', 'SISMEMBER key member', 'Returns 1 if member is in the set, 0 otherwise.'],
        ['SCARD', 'SCARD key', 'Return the number of members in the set.'],
        ['SINTER', 'SINTER key [key ...]', 'Return members present in ALL specified sets (intersection).'],
        ['SUNION', 'SUNION key [key ...]', 'Return members present in ANY of the specified sets (union).'],
        ['SDIFF', 'SDIFF key [key ...]', 'Return members in the first set not in any other set (difference).'],
        ['SMOVE', 'SMOVE src dst member', 'Atomically move a member from one set to another.'],
      ],
    },
    {
      type: 'heading',
      content: 'Hash Commands',
    },
    {
      type: 'table',
      headers: ['Command', 'Syntax', 'Description'],
      rows: [
        ['HSET', 'HSET key field value [field value ...]', 'Set one or more fields. Returns count of new fields added.'],
        ['HGET', 'HGET key field', 'Return the value of a single field.'],
        ['HGETALL', 'HGETALL key', 'Return all fields and values as a flat list of alternating field, value.'],
        ['HMGET', 'HMGET key field [field ...]', 'Return values for multiple fields in one round trip.'],
        ['HDEL', 'HDEL key field [field ...]', 'Delete one or more fields. Returns count deleted.'],
        ['HEXISTS', 'HEXISTS key field', 'Returns 1 if the field exists, 0 otherwise.'],
        ['HKEYS', 'HKEYS key', 'Return all field names in the hash.'],
        ['HVALS', 'HVALS key', 'Return all values in the hash.'],
        ['HLEN', 'HLEN key', 'Return the number of fields in the hash.'],
        ['HINCRBY', 'HINCRBY key field amount', 'Increment a hash field integer by amount. Creates field at 0 if missing.'],
      ],
    },
    {
      type: 'heading',
      content: 'Sorted Set Commands',
    },
    {
      type: 'table',
      headers: ['Command', 'Syntax', 'Description'],
      rows: [
        ['ZADD', 'ZADD key score member [score member ...]', 'Add members with scores. Returns count of newly added members.'],
        ['ZRANGE', 'ZRANGE key start stop [WITHSCORES]', 'Return members by rank (ascending). 0 to -1 = all. Add WITHSCORES for scores.'],
        ['ZREVRANGE', 'ZREVRANGE key start stop [WITHSCORES]', 'Return members by rank (descending, highest score first).'],
        ['ZRANGEBYSCORE', 'ZRANGEBYSCORE key min max', 'Return members with scores between min and max.'],
        ['ZSCORE', 'ZSCORE key member', 'Return the score of a member.'],
        ['ZRANK', 'ZRANK key member', 'Return the rank (0-based ascending) of a member.'],
        ['ZREVRANK', 'ZREVRANK key member', 'Return the rank (0-based descending) of a member.'],
        ['ZREM', 'ZREM key member [member ...]', 'Remove one or more members.'],
        ['ZCARD', 'ZCARD key', 'Return the number of members in the sorted set.'],
        ['ZINCRBY', 'ZINCRBY key increment member', 'Increment a member\'s score by amount.'],
      ],
    },
    {
      type: 'heading',
      content: 'Key Management Commands',
    },
    {
      type: 'table',
      headers: ['Command', 'Syntax', 'Description'],
      rows: [
        ['DEL', 'DEL key [key ...]', 'Delete one or more keys synchronously.'],
        ['EXISTS', 'EXISTS key [key ...]', 'Return count of how many of the given keys exist.'],
        ['KEYS', 'KEYS pattern', 'Find all keys matching a pattern. NEVER use in production (blocks).'],
        ['SCAN', 'SCAN cursor [MATCH pattern] [COUNT count]', 'Iterate keys in small increments. Safe for production. Returns cursor + keys.'],
        ['TYPE', 'TYPE key', 'Return the data type of the value stored at key.'],
        ['RENAME', 'RENAME key newkey', 'Rename a key. Error if key does not exist.'],
        ['EXPIRE', 'EXPIRE key seconds', 'Set a TTL on a key in seconds.'],
        ['TTL', 'TTL key', 'Return remaining TTL in seconds. -1 = no expiry. -2 = key missing.'],
        ['PERSIST', 'PERSIST key', 'Remove TTL from a key, making it permanent.'],
        ['COPY', 'COPY src dst', 'Copy the value of src to dst without deleting src.'],
        ['OBJECT ENCODING', 'OBJECT ENCODING key', 'Return the internal memory representation used for the key.'],
      ],
    },
    {
      type: 'heading',
      content: 'Server Commands',
    },
    {
      type: 'table',
      headers: ['Command', 'Description', 'Notes'],
      rows: [
        ['INFO [section]', 'Return server statistics. Sections: server, memory, clients, stats, replication, cpu', 'Most useful for monitoring and debugging'],
        ['PING [message]', 'Test connection. Returns PONG or the message.', 'Use in health checks'],
        ['FLUSHDB [ASYNC]', 'Delete all keys in the current database.', 'Irreversible. Use with extreme caution.'],
        ['FLUSHALL [ASYNC]', 'Delete all keys in all databases.', 'Irreversible. Never run in production.'],
        ['DBSIZE', 'Return the number of keys in the current database.', 'Safe to run in production'],
        ['CONFIG GET pattern', 'Return configuration parameter(s) matching pattern.', 'e.g., CONFIG GET maxmemory'],
        ['CONFIG SET param value', 'Set a configuration parameter at runtime.', 'Changes apply immediately without restart'],
        ['MONITOR', 'Stream every command processed by Redis in real time.', 'Use only for debugging -- high overhead'],
        ['DEBUG SLEEP seconds', 'Block the server for N seconds. For testing timeout behavior only.', 'Never in production'],
        ['OBJECT HELP', 'Return help text for the OBJECT command family.', 'Useful for memory introspection'],
      ],
    },
    {
      type: 'heading',
      content: 'Eviction Policies',
    },
    {
      type: 'table',
      headers: ['Policy', 'Behavior', 'Best For'],
      rows: [
        ['noeviction', 'Return error on writes when memory limit is reached. No keys are evicted.', 'Databases where data loss is unacceptable'],
        ['allkeys-lru', 'Evict the least recently used key from all keys.', 'General-purpose caches'],
        ['volatile-lru', 'Evict the least recently used key from keys with TTL only.', 'Mixed caches with permanent and ephemeral data'],
        ['allkeys-lfu', 'Evict the least frequently used key from all keys.', 'Caches with a hot subset of frequently accessed data'],
        ['volatile-lfu', 'Evict the least frequently used key from keys with TTL only.', 'Mixed workloads with frequency-based cache value'],
        ['allkeys-random', 'Evict a random key from all keys.', 'When all keys have roughly equal access frequency'],
        ['volatile-random', 'Evict a random key from keys with TTL only.', 'Simple caches without access pattern data'],
        ['volatile-ttl', 'Evict the key with the shortest remaining TTL first.', 'When soonest-to-expire data is least valuable'],
      ],
    },
    {
      type: 'heading',
      content: 'Best Practices',
    },
    {
      type: 'list',
      items: [
        'Use meaningful key names with colons as separators: user:42:profile, cache:product:99, session:xyz.',
        'Always set TTL on cache keys. A cache that never expires will consume all available memory over time.',
        'Use SCAN instead of KEYS in production. KEYS blocks Redis for the full scan duration on large keyspaces.',
        'Handle reconnection in your client. Configure maxRetriesPerRequest and listen to the "error" event.',
        'Never store sensitive data (passwords, credit cards, PII) in Redis without encryption. Redis data is not encrypted at rest by default.',
        'Monitor memory usage regularly with INFO memory. Set maxmemory and a sensible eviction policy.',
        'Use pipelining (redis.pipeline()) when sending many commands in sequence. Reduces network round-trips dramatically.',
        'Prefer atomic commands (INCR, GETSET, SET NX) over read-modify-write sequences. They prevent race conditions without transactions.',
        'Test your reconnection logic. Kill the Redis instance in staging and confirm the application recovers gracefully.',
        'Use separate Redis databases (db 0, 1, 2...) or a keyPrefix to namespace different environments or applications.',
      ],
    },
    {
      type: 'heading',
      content: 'Common Pitfalls',
    },
    {
      type: 'list',
      items: [
        'Using KEYS in production. KEYS is O(N) and blocks the single-threaded Redis server while it scans all keys. Use SCAN in a loop instead.',
        'Not setting TTL on cache keys. Cache keys that never expire cause unbounded memory growth. Always specify EX when caching data.',
        'Overwriting a key with SET without re-specifying EX. A plain SET removes the existing TTL, making the key permanent.',
        'Using Pub/Sub when reliable delivery is required. Pub/Sub drops messages when subscribers are offline. Use Lists or BullMQ for durability.',
        'Running FLUSHALL in the wrong environment. FLUSHALL deletes every key in every database with no confirmation prompt and no undo.',
        'Storing large objects as Strings. Deserializing a 1 MB JSON blob on every read is expensive. Use Hash fields for structured data.',
        'Not handling nil responses. GET on a missing key returns nil (null in Node.js). Always check before parsing as JSON.',
        'Using blocking commands (BRPOP) on the same connection as regular commands. A blocking command holds the connection and prevents other requests from being sent.',
      ],
    },
    {
      type: 'tryit',
      title: 'Searchable Command Reference',
      css: `.cmdref{font-family:system-ui,sans-serif;max-width:700px;margin:0 auto;padding:16px;}
.cmdref h2{font-size:18px;font-weight:700;margin:0 0 12px;color:#111;}
.cmdref-search{width:100%;box-sizing:border-box;border:2px solid #e5e5e5;border-radius:8px;padding:9px 14px;font-size:14px;margin-bottom:14px;font-family:inherit;}
.cmdref-search:focus{outline:none;border-color:#DC382D;}
.cmdref-grid{display:flex;flex-direction:column;gap:8px;}
.cmd-card{background:#fff;border:1px solid #e5e5e5;border-radius:8px;padding:12px 14px;}
.cmd-card:hover{border-color:#DC382D;}
.cmd-top{display:flex;align-items:center;gap:8px;margin-bottom:4px;}
.cmd-name{font-family:monospace;font-size:15px;font-weight:700;color:#111;}
.cmd-tag{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:2px 7px;border-radius:10px;}
.cmd-syntax{font-family:monospace;font-size:12px;color:#555;margin-bottom:4px;}
.cmd-desc{font-size:13px;color:#444;line-height:1.5;}
.cmdref-count{font-size:12px;color:#888;margin-bottom:10px;}
.tag-string{background:#fee2e2;color:#991b1b;}
.tag-list{background:#dbeafe;color:#1e40af;}
.tag-set{background:#d1fae5;color:#065f46;}
.tag-hash{background:#ede9fe;color:#4c1d95;}
.tag-sorted{background:#fed7aa;color:#7c2d12;}
.tag-key{background:#f3f4f6;color:#374151;}
.tag-server{background:#fef9c3;color:#713f12;}`,
      js: `var commands = [
  { name: 'GET', syntax: 'GET key', cat: 'string', desc: 'Return the value of a key. Returns nil if missing.' },
  { name: 'SET', syntax: 'SET key value [EX sec] [NX|XX]', cat: 'string', desc: 'Store a value. EX sets TTL in seconds. NX = only if absent.' },
  { name: 'DEL', syntax: 'DEL key [key ...]', cat: 'key', desc: 'Delete one or more keys. Returns count deleted.' },
  { name: 'INCR', syntax: 'INCR key', cat: 'string', desc: 'Atomically increment integer value by 1.' },
  { name: 'INCRBY', syntax: 'INCRBY key amount', cat: 'string', desc: 'Increment integer by amount. Negative amount decrements.' },
  { name: 'DECR', syntax: 'DECR key', cat: 'string', desc: 'Atomically decrement integer value by 1.' },
  { name: 'APPEND', syntax: 'APPEND key value', cat: 'string', desc: 'Append to existing string. Returns new length.' },
  { name: 'STRLEN', syntax: 'STRLEN key', cat: 'string', desc: 'Return byte length of the stored string.' },
  { name: 'MGET', syntax: 'MGET key [key ...]', cat: 'string', desc: 'Return values of multiple keys in one request.' },
  { name: 'MSET', syntax: 'MSET key value [key value ...]', cat: 'string', desc: 'Set multiple key-value pairs atomically.' },
  { name: 'LPUSH', syntax: 'LPUSH key value [value ...]', cat: 'list', desc: 'Insert values at head (left) of list.' },
  { name: 'RPUSH', syntax: 'RPUSH key value [value ...]', cat: 'list', desc: 'Insert values at tail (right) of list.' },
  { name: 'LPOP', syntax: 'LPOP key [count]', cat: 'list', desc: 'Remove and return element(s) from head of list.' },
  { name: 'RPOP', syntax: 'RPOP key [count]', cat: 'list', desc: 'Remove and return element(s) from tail of list.' },
  { name: 'LRANGE', syntax: 'LRANGE key start stop', cat: 'list', desc: 'Return elements from start to stop. 0 to -1 = all.' },
  { name: 'LLEN', syntax: 'LLEN key', cat: 'list', desc: 'Return the length of the list.' },
  { name: 'BRPOP', syntax: 'BRPOP key [key ...] timeout', cat: 'list', desc: 'Blocking pop from tail. Blocks until item available or timeout.' },
  { name: 'LTRIM', syntax: 'LTRIM key start stop', cat: 'list', desc: 'Trim list to specified range. Use to cap list at N items.' },
  { name: 'SADD', syntax: 'SADD key member [member ...]', cat: 'set', desc: 'Add members to set. Returns count of newly added.' },
  { name: 'SREM', syntax: 'SREM key member [member ...]', cat: 'set', desc: 'Remove members from set.' },
  { name: 'SMEMBERS', syntax: 'SMEMBERS key', cat: 'set', desc: 'Return all members of the set (unordered).' },
  { name: 'SISMEMBER', syntax: 'SISMEMBER key member', cat: 'set', desc: 'Returns 1 if member exists, 0 otherwise.' },
  { name: 'SCARD', syntax: 'SCARD key', cat: 'set', desc: 'Return the number of members in the set.' },
  { name: 'SINTER', syntax: 'SINTER key [key ...]', cat: 'set', desc: 'Return members present in ALL specified sets.' },
  { name: 'SUNION', syntax: 'SUNION key [key ...]', cat: 'set', desc: 'Return members present in ANY of the specified sets.' },
  { name: 'HSET', syntax: 'HSET key field value [field value ...]', cat: 'hash', desc: 'Set one or more hash fields.' },
  { name: 'HGET', syntax: 'HGET key field', cat: 'hash', desc: 'Return value of a single hash field.' },
  { name: 'HGETALL', syntax: 'HGETALL key', cat: 'hash', desc: 'Return all fields and values in the hash.' },
  { name: 'HDEL', syntax: 'HDEL key field [field ...]', cat: 'hash', desc: 'Delete one or more hash fields.' },
  { name: 'HEXISTS', syntax: 'HEXISTS key field', cat: 'hash', desc: 'Returns 1 if field exists in hash.' },
  { name: 'ZADD', syntax: 'ZADD key score member [score member ...]', cat: 'sorted', desc: 'Add members with scores. Returns count of new members.' },
  { name: 'ZRANGE', syntax: 'ZRANGE key start stop [WITHSCORES]', cat: 'sorted', desc: 'Return members by rank ascending. WITHSCORES includes scores.' },
  { name: 'ZREVRANGE', syntax: 'ZREVRANGE key start stop [WITHSCORES]', cat: 'sorted', desc: 'Return members by rank descending (highest score first).' },
  { name: 'ZSCORE', syntax: 'ZSCORE key member', cat: 'sorted', desc: 'Return the score of a member.' },
  { name: 'ZRANK', syntax: 'ZRANK key member', cat: 'sorted', desc: 'Return 0-based rank of member (ascending).' },
  { name: 'ZREM', syntax: 'ZREM key member [member ...]', cat: 'sorted', desc: 'Remove members from sorted set.' },
  { name: 'ZCARD', syntax: 'ZCARD key', cat: 'sorted', desc: 'Return number of members in sorted set.' },
  { name: 'EXISTS', syntax: 'EXISTS key [key ...]', cat: 'key', desc: 'Return count of how many of the given keys exist.' },
  { name: 'KEYS', syntax: 'KEYS pattern', cat: 'key', desc: 'Find keys matching pattern. NEVER use in production.' },
  { name: 'SCAN', syntax: 'SCAN cursor [MATCH pat] [COUNT n]', cat: 'key', desc: 'Safe key iteration in small increments. Use instead of KEYS.' },
  { name: 'TYPE', syntax: 'TYPE key', cat: 'key', desc: 'Return data type of the value at key.' },
  { name: 'EXPIRE', syntax: 'EXPIRE key seconds', cat: 'key', desc: 'Set TTL on a key in seconds.' },
  { name: 'TTL', syntax: 'TTL key', cat: 'key', desc: 'Return remaining TTL. -1 = no expiry. -2 = key missing.' },
  { name: 'PERSIST', syntax: 'PERSIST key', cat: 'key', desc: 'Remove TTL, making key permanent.' },
  { name: 'RENAME', syntax: 'RENAME key newkey', cat: 'key', desc: 'Rename a key.' },
  { name: 'INFO', syntax: 'INFO [section]', cat: 'server', desc: 'Return server statistics. Sections: server, memory, clients.' },
  { name: 'PING', syntax: 'PING [message]', cat: 'server', desc: 'Test connection. Returns PONG.' },
  { name: 'DBSIZE', syntax: 'DBSIZE', cat: 'server', desc: 'Return number of keys in current database.' },
  { name: 'FLUSHDB', syntax: 'FLUSHDB [ASYNC]', cat: 'server', desc: 'Delete all keys in current database. Irreversible.' },
  { name: 'CONFIG GET', syntax: 'CONFIG GET pattern', cat: 'server', desc: 'Return matching configuration parameter(s).' },
  { name: 'SUBSCRIBE', syntax: 'SUBSCRIBE channel [channel ...]', cat: 'key', desc: 'Subscribe to one or more channels.' },
  { name: 'PUBLISH', syntax: 'PUBLISH channel message', cat: 'key', desc: 'Publish message to channel. Returns subscriber count.' },
];

var tagLabels = { string: 'String', list: 'List', set: 'Set', hash: 'Hash', sorted: 'Sorted Set', key: 'Keys', server: 'Server' };
var query = '';

function render() {
  var q = query.toLowerCase();
  var filtered = q
    ? commands.filter(function(c) {
        return c.name.toLowerCase().includes(q) ||
               c.syntax.toLowerCase().includes(q) ||
               c.desc.toLowerCase().includes(q) ||
               c.cat.toLowerCase().includes(q) ||
               (tagLabels[c.cat] || '').toLowerCase().includes(q);
      })
    : commands;

  var cardsHtml = filtered.map(function(c) {
    return '<div class="cmd-card">' +
      '<div class="cmd-top">' +
      '<span class="cmd-name">' + c.name + '</span>' +
      '<span class="cmd-tag tag-' + c.cat + '">' + (tagLabels[c.cat] || c.cat) + '</span>' +
      '</div>' +
      '<div class="cmd-syntax">' + c.syntax + '</div>' +
      '<div class="cmd-desc">' + c.desc + '</div>' +
      '</div>';
  }).join('');

  document.getElementById('output').innerHTML =
    '<div class="cmdref">' +
    '<h2>Redis Command Reference</h2>' +
    '<input class="cmdref-search" id="searchBox" placeholder="Search commands... (e.g. GET, hash, TTL, sorted)" value="' + query + '">' +
    '<div class="cmdref-count">Showing ' + filtered.length + ' of ' + commands.length + ' commands</div>' +
    '<div class="cmdref-grid">' + cardsHtml + '</div>' +
    '</div>';

  document.getElementById('searchBox').addEventListener('input', function(e) {
    query = e.target.value;
    render();
  });
  document.getElementById('searchBox').focus();
}

render();`,
    },
  ],
  exercises: [
    {
      id: 'redis-07-ex1',
      question: 'Why should you never use KEYS * in a production Redis instance?',
      type: 'multiple-choice',
      options: [
        'KEYS requires admin privileges that are not available in production',
        'KEYS is deprecated and has been removed in Redis 7',
        'KEYS blocks the single-threaded Redis server for the full scan duration, causing latency spikes for all other clients',
        'KEYS does not support wildcard patterns on large datasets',
      ],
      correct: 2,
      explanation: 'Redis is single-threaded. KEYS is O(N) and executes synchronously, blocking ALL other commands for the entire duration. On a database with millions of keys this can take seconds, causing severe latency for every client. Use SCAN in a loop instead -- it iterates in small safe increments.',
    },
    {
      id: 'redis-07-ex2',
      question: 'Which command lets you atomically set a key only if it does NOT already exist?',
      type: 'multiple-choice',
      options: [
        'SET key value IFNEW',
        'SETNX key value (or SET key value NX)',
        'SET key value XX',
        'GETSET key value',
      ],
      correct: 1,
      explanation: 'SETNX (set if not exists) returns 1 if the key was set, 0 if the key already existed. Modern Redis prefers SET key value NX which does the same thing but allows combining with EX for TTL. The NX option is commonly used for distributed locks.',
    },
  ],
  quiz: [
    {
      id: 'redis-07-q1',
      question: 'What does SCAN cursor MATCH user:* COUNT 100 do?',
      options: [
        'Return exactly 100 keys matching "user:*"',
        'Scan up to ~100 keys and return matching ones plus a cursor for the next batch',
        'Block until all keys matching "user:*" are returned',
        'Return the first 100 keys alphabetically',
      ],
      correct: 1,
      explanation: 'SCAN iterates the keyspace in small increments. COUNT is a hint to Redis about how many keys to scan per call (not a hard limit on results). It returns a new cursor and the matching keys found in this batch. Iterate until cursor returns 0 (full scan complete).',
    },
    {
      id: 'redis-07-q2',
      question: 'You run CONFIG GET maxmemory and get "0". What does this mean?',
      options: [
        'Redis has no memory available',
        'Redis is using 0 bytes',
        'maxmemory is not set -- Redis will use all available RAM with no limit',
        'Redis is in read-only mode',
      ],
      correct: 2,
      explanation: 'A maxmemory value of 0 means no memory limit is configured. Redis will allocate as much memory as the operating system allows. In production you should always set maxmemory along with an eviction policy to prevent Redis from consuming all system RAM.',
    },
    {
      id: 'redis-07-q3',
      question: 'Which INFO section gives you current memory usage statistics?',
      options: ['INFO server', 'INFO clients', 'INFO memory', 'INFO stats'],
      correct: 2,
      explanation: 'INFO memory returns detailed memory statistics including used_memory (total allocated), used_memory_human (human-readable), mem_fragmentation_ratio, and the maxmemory setting. This is the first place to look when investigating Redis memory issues.',
    },
  ],
};
