import { code, type Cheatsheet } from './cheatsheet-types';

export const redisCheatsheet: Cheatsheet = {
  path: '/redis-cheatsheet',
  tech: 'redis',
  badge: 'Redis',
  title: 'Redis Cheat Sheet: Data Types, Expiry and Pub/Sub',
  description: 'Redis cheat sheet covering strings, lists, sets, hashes, sorted sets, expiry, transactions, pub/sub and using Redis from Node.js. Run the commands in the editor.',
  h1: 'Redis Cheat Sheet – Data Types, Expiry, Transactions and Pub/Sub',
  intro: 'A practical Redis reference: strings and counters, the four other core data types (lists, sets, hashes, sorted sets), expiry and TTL, transactions, pub/sub, and using Redis from Node.js with ioredis. Commands are short, copyable and run against a real Redis command simulator in the live editor. For deeper explanations, see the Redis interview questions page.',
  sections: [
    {
      id: 'strings',
      title: 'Strings and counters',
      table: {
        headers: ['Command', 'What it does'],
        rows: [
          ['SET key value', 'Set a string value'],
          ['SET key value EX seconds', 'Set a value with an expiry in one command'],
          ['GET key', 'Read a value (nil if missing)'],
          ['INCR key / DECR key', 'Atomically add or subtract 1'],
          ['MSET k1 v1 k2 v2', 'Set several keys in one round trip'],
        ],
        codeCols: [0],
      },
      examples: [{
        title: 'Basic string commands',
        language: 'bash',
        code: code(
          'SET username "ada"',
          'GET username',
          'SET pageviews 0',
          'INCR pageviews',
          'INCR pageviews',
          'GET pageviews',
        ),
      }],
      lessons: ['redis/02-data-structures'],
    },
    {
      id: 'data-structures',
      title: 'Lists, sets, hashes and sorted sets',
      table: {
        headers: ['Type', 'Key commands'],
        rows: [
          ['List', 'LPUSH, RPUSH, LPOP, RPOP, LRANGE'],
          ['Set', 'SADD, SMEMBERS, SISMEMBER, SINTER'],
          ['Hash', 'HSET, HGET, HGETALL, HDEL'],
          ['Sorted set', 'ZADD, ZRANGE, ZSCORE, ZRANK'],
        ],
        codeCols: [0],
      },
      examples: [{
        title: 'One example of each data type',
        language: 'bash',
        code: code(
          'RPUSH tasks "email" "resize" "report"',
          'LRANGE tasks 0 -1',
          '',
          'SADD tags "sale" "electronics" "sale"',
          'SMEMBERS tags',
          '',
          'HSET user:1 name "Ada" age "36"',
          'HGETALL user:1',
          '',
          'ZADD leaderboard 1500 "ada" 2200 "sam"',
          'ZREVRANGE leaderboard 0 0 WITHSCORES',
        ),
      }],
      lessons: ['redis/02-data-structures'],
    },
    {
      id: 'expiry',
      title: 'Expiry and TTL',
      table: {
        headers: ['Command', 'What it does'],
        rows: [
          ['EXPIRE key seconds', 'Set a TTL on an existing key'],
          ['TTL key', 'Seconds left (-1 no TTL, -2 key does not exist)'],
          ['PERSIST key', 'Remove a key\'s TTL, making it permanent again'],
          ['SET key value EX seconds NX', 'Set only if the key does not already exist, with a TTL — the basis of a simple lock'],
        ],
        codeCols: [0],
      },
      examples: [{
        title: 'Setting and checking expiry',
        language: 'bash',
        code: code(
          'SET session:abc "user-42" EX 3600',
          'TTL session:abc',
          'PERSIST session:abc',
          'TTL session:abc',
        ),
      }],
      lessons: ['redis/03-expiry-ttl'],
    },
    {
      id: 'transactions',
      title: 'Transactions',
      examples: [{
        title: 'MULTI/EXEC',
        language: 'bash',
        code: code(
          'MULTI',
          'SET balance:a 100',
          'SET balance:b 50',
          'EXEC',
          'GET balance:a',
        ),
      }],
      tips: [
        'MULTI queues commands; EXEC runs them all together, uninterrupted by other clients. Unlike a SQL transaction, a runtime error in one queued command does not stop the others from running.',
      ],
      lessons: ['redis/01-introduction'],
    },
    {
      id: 'pubsub',
      title: 'Pub/sub',
      examples: [{
        title: 'Publishing a message',
        language: 'bash',
        code: code(
          'PUBLISH notifications "New order received"',
        ),
      }],
      tips: [
        'Pub/sub is fire-and-forget — a message published while nobody is subscribed is lost. For anything that must not be lost, use a list (RPUSH/BLPOP) or a dedicated queue instead.',
      ],
      lessons: ['redis/06-pubsub-queues'],
    },
    {
      id: 'nodejs',
      title: 'Using Redis from Node.js',
      examples: [{
        title: 'ioredis: cache-aside pattern',
        language: 'javascript',
        code: code(
          "const Redis = require('ioredis');",
          'const redis = new Redis();',
          '',
          'async function getProduct(id) {',
          '  const cached = await redis.get(`product:${id}`);',
          '  if (cached) return JSON.parse(cached);',
          '',
          '  const product = await db.findProduct(id);',
          "  await redis.set(`product:${id}`, JSON.stringify(product), 'EX', 300);",
          '  return product;',
          '}',
        ),
      }],
      tips: [
        'Always set a TTL on cached values, even when you also invalidate them explicitly on writes — it is the safety net for anything that changes the underlying data outside your normal write path.',
      ],
      lessons: ['redis/04-nodejs-redis', 'redis/05-caching-patterns'],
    },
  ],
  faq: [
    { q: 'What is the difference between EXPIRE and SET ... EX?', a: 'EXPIRE adds a TTL to a key that may already exist. SET key value EX seconds sets the value and the TTL together in one atomic command.' },
    { q: 'Why should I avoid KEYS * in production?', a: 'Redis is single-threaded, and KEYS scans the entire keyspace, blocking every other client while it runs. SCAN does the same job incrementally without blocking the server.' },
    { q: 'What is the difference between a list and a sorted set?', a: 'A list keeps elements in insertion order and is pushed/popped from either end — a natural fit for a queue. A sorted set keeps unique members ordered by a score you assign, which fits a leaderboard or anything ranked.' },
    { q: 'Is Redis a database or just a cache?', a: 'Both, depending on how you configure it. With persistence (RDB and/or AOF) enabled, Redis can be a real, durable data store; many teams also run it purely as an in-memory cache in front of a primary database.' },
    { q: 'How do I safely store a value only if it does not already exist?', a: 'SET key value NX — it only sets the value if the key is not already present, which is also the building block for a simple distributed lock (combined with EX for an expiry).' },
  ],
  more: [
    { label: 'Redis interview questions', href: '/redis-interview-questions' },
    { label: 'Redis lessons', href: '/learn/redis' },
    { label: 'Node.js cheat sheet', href: '/nodejs-cheatsheet' },
    { label: 'Backend developer roadmap', href: '/roadmaps/backend' },
  ],
};
