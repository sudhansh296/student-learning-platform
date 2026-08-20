import type { RedisLesson } from '../redis-curriculum';

export const lesson05: RedisLesson = {
  id: 'redis-05',
  slug: '05-caching-patterns',
  chapter: 'advanced',
  order: 5,
  difficulty: 'intermediate',
  readingTime: 11,
  title: 'Caching Patterns',
  description: 'Learn the four main caching strategies and how to handle cache invalidation, the hardest problem in computer science.',
  sections: [
    {
      type: 'text',
      content: 'Caching is about two things: speed and reducing load on your primary data store. A well-designed cache makes your application dramatically faster and more resilient. But caching introduces a fundamental challenge: the cache and the database can disagree. Stale data, cache stampedes, and incorrect invalidation are all real problems in production. Choosing the right caching strategy -- and understanding its tradeoffs -- is the difference between a cache that helps and one that causes subtle bugs.',
    },
    {
      type: 'heading',
      content: 'The Four Caching Strategies',
    },
    {
      type: 'table',
      headers: ['Strategy', 'Description', 'Pros', 'Cons', 'Best For'],
      rows: [
        ['Cache-Aside (Lazy Loading)', 'App reads from cache. On miss, reads DB and populates cache.', 'Only caches what is used; resilient to cache failures', 'Cache miss penalty; risk of stale data', 'Read-heavy workloads, general-purpose caching'],
        ['Write-Through', 'Every write goes to cache AND database synchronously.', 'Cache always has fresh data; no stale reads', 'Write latency is higher; may cache data that is never read', 'Write-heavy apps where read freshness is critical'],
        ['Write-Behind (Write-Back)', 'Write to cache immediately, async flush to database.', 'Very fast writes; database load reduced', 'Risk of data loss if cache fails before flush', 'High-throughput write scenarios (analytics, logs)'],
        ['Read-Through', 'Cache sits in front of DB. On miss, cache fetches from DB automatically.', 'Application code is simpler; cache self-populates', 'Cache must support a DB integration; cold start penalty', 'When using a cache provider with DB integration'],
      ],
    },
    {
      type: 'heading',
      content: 'Cache-Aside (Lazy Loading)',
    },
    {
      type: 'text',
      content: 'Cache-aside is the most commonly used pattern and the one you implement manually with Redis. The application controls both the cache and the database. On a read, the app checks the cache first. On a miss, the app queries the database and then populates the cache for future requests. Because the cache is only populated when data is actually requested, you never cache data that nobody uses. The downside is that the first request for any data always pays the cache miss penalty (a full database query). In scenarios with many unique keys, this can mean a poor initial cache hit rate.',
    },
    {
      type: 'list',
      items: [
        '1. Check cache: GET cache:user:42',
        '2. Cache hit: return the cached value immediately',
        '3. Cache miss: query the database for user 42',
        '4. Populate cache: SET cache:user:42 "{...}" EX 300',
        '5. Return the fresh data to the caller',
      ],
    },
    {
      type: 'heading',
      content: 'Write-Through',
    },
    {
      type: 'text',
      content: 'In write-through caching, every write to the database is also written to the cache synchronously in the same operation. The cache is always in sync with the database, so reads never see stale data. The cost is that every write is slightly slower because it must complete two operations (cache + database). You also end up caching data that may never be read -- a user profile cached on write might not be accessed for weeks. Write-through is a good fit when read freshness is more important than write throughput.',
    },
    {
      type: 'heading',
      content: 'Write-Behind (Write-Back)',
    },
    {
      type: 'text',
      content: 'Write-behind caching writes to Redis immediately and flushes to the database asynchronously in the background. From the application\'s perspective, writes complete instantly. The background process batches writes to the database, reducing load significantly. The risk is data loss: if Redis goes down before the flush, the writes in the cache are lost. For use cases where losing a few recent writes is acceptable (analytics counters, non-critical metrics), write-behind offers excellent write throughput.',
    },
    {
      type: 'heading',
      content: 'Cache Invalidation Strategies',
    },
    {
      type: 'text',
      content: 'Cache invalidation -- deciding when to remove stale data -- is one of the hardest problems in distributed systems. There is no perfect solution. Each strategy makes a tradeoff between complexity, consistency, and performance.',
    },
    {
      type: 'table',
      headers: ['Strategy', 'How It Works', 'Pros', 'Cons'],
      rows: [
        ['TTL-based', 'Every cache entry expires after N seconds automatically', 'Simple, no coordination needed', 'Data can be stale for up to TTL duration'],
        ['Event-driven (delete on update)', 'When data changes, the app explicitly deletes the cache key', 'Cache is always fresh after an update', 'Requires cache invalidation code in every write path; bugs cause stale data'],
        ['Versioned keys', 'Include a version number in the key (user:42:v3). New writes use a new version.', 'No stale reads; old keys expire naturally', 'Old keys linger until TTL; key management is complex'],
        ['Write-through', 'Update cache and database together on every write', 'Always consistent', 'Write latency; may cache rarely-read data'],
      ],
    },
    {
      type: 'heading',
      content: 'Cache Stampede',
    },
    {
      type: 'text',
      content: 'A cache stampede (also called a thundering herd) happens when a popular cache key expires and many concurrent requests all experience a miss at the same moment. All of them query the database simultaneously, overwhelming it. The result is database CPU spiking to 100% and latency skyrocketing just as the cache was supposed to be helping. Two solutions exist. The mutex lock solution uses Redis SET NX (set if not exists) to ensure only one request rebuilds the cache while others wait. The probabilistic early expiry solution randomly triggers a cache rebuild for some requests before the key actually expires, spreading the rebuild cost over time.',
    },
    {
      type: 'example',
      title: 'Cache-aside in Node.js with invalidation on update',
      content: 'A complete cache-aside pattern with event-driven invalidation when a user record is updated.',
      language: 'javascript',
      code: `import Redis from 'ioredis';

const redis = new Redis();
const TTL = 300; // 5 minutes

// Read: cache-aside
async function getUser(id: number) {
  const key = \`user:\${id}\`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const user = await db.findUserById(id); // database query
  await redis.set(key, JSON.stringify(user), 'EX', TTL);
  return user;
}

// Write: invalidate cache on update
async function updateUser(id: number, data: Partial<User>) {
  // 1. Update the database first
  await db.updateUser(id, data);
  // 2. Invalidate the cache -- next read will fetch fresh data
  await redis.del(\`user:\${id}\`);
}

// Mutex lock to prevent cache stampede
async function getUserWithLock(id: number) {
  const key = \`user:\${id}\`;
  const lockKey = \`lock:user:\${id}\`;

  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  // Try to acquire lock (NX = only if not exists, PX = 5s TTL)
  const lock = await redis.set(lockKey, '1', 'NX', 'PX', 5000);
  if (!lock) {
    // Another worker is rebuilding -- wait and retry
    await new Promise(r => setTimeout(r, 100));
    return getUserWithLock(id);
  }

  try {
    const user = await db.findUserById(id);
    await redis.set(key, JSON.stringify(user), 'EX', TTL);
    return user;
  } finally {
    await redis.del(lockKey); // always release lock
  }
}`,
      output: '{ id: 42, name: "Alice" }',
    },
    {
      type: 'example',
      title: 'Versioned cache keys',
      content: 'Version numbers in cache keys guarantee no stale reads -- old versions simply expire by TTL.',
      language: 'javascript',
      code: `// Store version in a separate key
async function getCacheVersion(entityType: string): Promise<number> {
  const v = await redis.get(\`version:\${entityType}\`);
  return v ? parseInt(v) : 1;
}

// Read: always use current version
async function getUserVersioned(id: number) {
  const version = await getCacheVersion('user');
  const key = \`user:\${id}:v\${version}\`;

  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const user = await db.findUserById(id);
  await redis.set(key, JSON.stringify(user), 'EX', 600);
  return user;
}

// Invalidate ALL users by bumping the version
async function invalidateAllUsers() {
  await redis.incr('version:user');
  // Old keys (v1, v2...) are now unreachable and will expire naturally
}`,
      output: '{ id: 42, name: "Alice" }',
    },
    {
      type: 'heading',
      content: 'Key Naming Conventions',
    },
    {
      type: 'list',
      items: [
        'Use colons as separators: user:42:profile, cache:product:99:reviews',
        'Include the entity type first: user:, product:, session:, cache:',
        'Include the ID after the entity type: user:42, product:99',
        'Add the field or sub-resource last: user:42:profile, user:42:settings',
        'For versioned keys, append the version: user:42:v3',
        'For temporary keys, use a prefix: lock:user:42, temp:report:xyz',
        'Avoid spaces and special characters -- colons, hyphens, and underscores are safe',
        'Keep key names short but descriptive -- long keys consume more memory and network bandwidth',
      ],
    },
    {
      type: 'tryit',
      title: 'Caching Strategy Comparison',
      css: `.strat{font-family:system-ui,sans-serif;max-width:700px;margin:0 auto;padding:16px;}
.strat h2{font-size:18px;font-weight:700;margin:0 0 14px;color:#111;}
.strat-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;}
.strat-tab{padding:8px 16px;border:2px solid #e5e5e5;border-radius:8px;background:#fff;cursor:pointer;font-size:13px;font-weight:600;transition:all .15s;}
.strat-tab:hover{border-color:#DC382D;}
.strat-tab.active{background:#DC382D;color:#fff;border-color:#DC382D;}
.strat-body{background:#fff;border:2px solid #e5e5e5;border-radius:12px;padding:18px;}
.strat-subtitle{font-size:13px;color:#555;margin:0 0 16px;line-height:1.5;}
.strat-col-head{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#888;margin-bottom:10px;}
.strat-cols{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.strat-step{display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;}
.strat-num{width:22px;height:22px;border-radius:50%;background:#DC382D;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;}
.strat-step span{font-size:13px;color:#333;line-height:1.5;}
.strat-tradeoff{margin-top:14px;padding:10px 14px;background:#fff5f5;border-left:3px solid #DC382D;border-radius:0 6px 6px 0;font-size:13px;color:#333;}`,
      js: `var strategies = [
  {
    name: 'Cache-Aside',
    desc: 'The application controls cache reads and writes. The cache is only populated on a cache miss. Most common pattern with Redis.',
    read: ['Check Redis for the requested key', 'Cache HIT: return cached value immediately (fast path)', 'Cache MISS: query the database', 'Store result in Redis with TTL', 'Return result to caller'],
    write: ['Write directly to the database', 'Optionally delete or update the cache key', 'Next read will repopulate the cache'],
    tradeoff: 'Tradeoff: First request always pays the DB query cost. Cache is eventually consistent (up to TTL duration).'
  },
  {
    name: 'Write-Through',
    desc: 'Every write is made to the cache AND the database synchronously. The cache always has the latest data.',
    read: ['Check Redis for the requested key', 'Cache HIT: return immediately (always fresh)', 'Cache MISS: very rare after warm-up; read DB and cache result'],
    write: ['Write the new value to Redis', 'Write the same value to the database', 'Both writes complete before responding to the caller', 'Return success'],
    tradeoff: 'Tradeoff: Writes are slower (two round-trips). May cache data that is never read. Best when read freshness is critical.'
  },
  {
    name: 'Write-Behind',
    desc: 'Writes go to Redis immediately. A background worker flushes the cache to the database asynchronously in batches.',
    read: ['Check Redis for the requested key', 'Cache HIT: return cached value (may be ahead of DB)', 'Cache MISS: query database, cache result'],
    write: ['Write value to Redis immediately (fast -- no DB round-trip)', 'Respond to caller right away', 'Background worker collects pending writes', 'Worker flushes batch to database asynchronously'],
    tradeoff: 'Tradeoff: Fastest writes possible. Risk of data loss if Redis fails before the flush. Not suitable for financial transactions.'
  }
];

var activeIdx = 0;

function render() {
  var tabsHtml = strategies.map(function(s, i) {
    return '<button class="strat-tab' + (activeIdx === i ? ' active' : '') + '" data-i="' + i + '">' + s.name + '</button>';
  }).join('');

  var s = strategies[activeIdx];
  var readHtml = s.read.map(function(r, i) {
    return '<div class="strat-step"><span class="strat-num">' + (i+1) + '</span><span>' + r + '</span></div>';
  }).join('');
  var writeHtml = s.write.map(function(w, i) {
    return '<div class="strat-step"><span class="strat-num">' + (i+1) + '</span><span>' + w + '</span></div>';
  }).join('');

  document.getElementById('output').innerHTML =
    '<div class="strat">' +
    '<h2>Caching Strategy Comparison</h2>' +
    '<div class="strat-tabs">' + tabsHtml + '</div>' +
    '<div class="strat-body">' +
    '<p class="strat-subtitle">' + s.desc + '</p>' +
    '<div class="strat-cols">' +
    '<div><div class="strat-col-head">READ path</div>' + readHtml + '</div>' +
    '<div><div class="strat-col-head">WRITE path</div>' + writeHtml + '</div>' +
    '</div>' +
    '<div class="strat-tradeoff">' + s.tradeoff + '</div>' +
    '</div>' +
    '</div>';

  document.querySelectorAll('.strat-tab').forEach(function(btn) {
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
      id: 'redis-05-ex1',
      question: 'What is a cache stampede and when does it occur?',
      type: 'multiple-choice',
      options: [
        'When Redis runs out of memory and starts evicting keys',
        'When a popular cache key expires and many concurrent requests all miss and query the database simultaneously',
        'When write-through caching overwrites the database with stale data',
        'When two cache keys have the same name and overwrite each other',
      ],
      correct: 1,
      explanation: 'A cache stampede happens when a high-traffic cache key expires. All concurrent requests miss the cache at the same moment and each independently queries the database, causing a sudden spike in DB load. Solutions include mutex locks (only one request rebuilds the cache) and probabilistic early expiry (rebuild the cache slightly before it actually expires).',
    },
    {
      id: 'redis-05-ex2',
      question: 'Which caching strategy has the lowest write latency?',
      type: 'multiple-choice',
      options: [
        'Cache-Aside',
        'Write-Through',
        'Write-Behind (Write-Back)',
        'Read-Through',
      ],
      correct: 2,
      explanation: 'Write-behind writes to the cache only and returns immediately, deferring the database write to a background process. Since no database round-trip is required, writes complete in microseconds. The tradeoff is risk of data loss if the cache fails before the background flush.',
    },
    {
      id: 'redis-05-ex3',
      question: 'You are using event-driven cache invalidation and you forget to add redis.del() in one of your write paths. What happens?',
      type: 'multiple-choice',
      options: [
        'Redis automatically detects the inconsistency and updates the cache',
        'The cache entry for that path will be stale until its TTL expires',
        'The database write fails because the cache was not updated',
        'Redis throws an error on the next read',
      ],
      correct: 1,
      explanation: 'Event-driven invalidation requires the developer to call del() in every write path. Missing one means the cache entry will serve stale data until its TTL expires. This is why event-driven invalidation requires discipline -- a single missed call can cause hours of stale reads.',
    },
  ],
  quiz: [
    {
      id: 'redis-05-q1',
      question: 'In cache-aside, when does the cache get populated?',
      options: [
        'When the application starts up (eager loading)',
        'On every write to the database',
        'Only when a cache miss occurs during a read',
        'On a schedule via a background job',
      ],
      correct: 2,
      explanation: 'Cache-aside is also called "lazy loading" because the cache is only populated when needed: on a cache miss. Only data that is actually requested gets cached, which means you avoid wasting memory on data that is never read.',
    },
    {
      id: 'redis-05-q2',
      question: 'Which key naming convention is most standard for Redis?',
      options: [
        'userProfile_42 (underscores, no colons)',
        'user:42:profile (entity:id:field with colons)',
        'USER-42-PROFILE (uppercase with hyphens)',
        '/users/42/profile (URL-style paths)',
      ],
      correct: 1,
      explanation: 'The Redis community convention is to use colons as namespace separators: entity:id:field. For example user:42:profile, product:99:images, session:xyz:data. This makes keys human-readable and easy to group. Spaces, special characters, and very long keys should be avoided.',
    },
    {
      id: 'redis-05-q3',
      question: 'What is the main advantage of write-through caching over cache-aside?',
      options: [
        'Write-through has lower write latency',
        'The cache is always consistent with the database -- no stale reads',
        'Write-through uses less memory',
        'Write-through works without a TTL',
      ],
      correct: 1,
      explanation: 'In write-through, every write updates both the cache and the database synchronously. This means reads always see the latest data. Cache-aside is eventually consistent -- the cache may serve data that is up to TTL seconds out of date.',
    },
  ],
};
