import type { RedisLesson } from '../redis-curriculum';

export const lesson06: RedisLesson = {
  id: 'redis-06',
  slug: '06-pubsub-queues',
  chapter: 'advanced',
  order: 6,
  difficulty: 'intermediate',
  readingTime: 11,
  title: 'Pub/Sub and Queues',
  description: 'Use Redis as a message broker with Pub/Sub channels and implement reliable job queues with Lists and BullMQ.',
  sections: [
    {
      type: 'text',
      content: 'Beyond caching, Redis is a capable messaging layer between services. Two primary mechanisms exist: Pub/Sub for fire-and-forget broadcasts to many subscribers, and List-based queues for reliable point-to-point message delivery. For production job processing, BullMQ provides a full-featured queue system built on Redis that adds retries, scheduling, priorities, and worker concurrency. Choosing the right tool depends on your delivery guarantees: Pub/Sub is fast but ephemeral, queues are persistent and reliable.',
    },
    {
      type: 'heading',
      content: 'Pub/Sub Concepts',
    },
    {
      type: 'text',
      content: 'Pub/Sub (publish/subscribe) is a messaging pattern where senders (publishers) send messages to named channels, and receivers (subscribers) listen to channels. Publishers and subscribers are decoupled -- they do not know about each other. A publisher sends a message to a channel and Redis delivers it to every currently-connected subscriber of that channel. If there are no subscribers, the message is discarded. Redis Pub/Sub is a one-to-many broadcast mechanism.',
    },
    {
      type: 'heading',
      content: 'Pub/Sub Commands',
    },
    {
      type: 'table',
      headers: ['Command', 'Direction', 'Description'],
      rows: [
        ['SUBSCRIBE channel [channel ...]', 'Subscriber', 'Listen to one or more named channels. Receives all messages published to them.'],
        ['PSUBSCRIBE pattern', 'Subscriber', 'Subscribe using a glob pattern. PSUBSCRIBE news:* receives all news:sports, news:tech, etc.'],
        ['UNSUBSCRIBE [channel ...]', 'Subscriber', 'Stop listening to specific channels. No argument unsubscribes from all.'],
        ['PUNSUBSCRIBE [pattern]', 'Subscriber', 'Stop listening to a pattern subscription.'],
        ['PUBLISH channel message', 'Publisher', 'Send a message to a channel. Returns the number of subscribers who received it.'],
        ['PUBSUB CHANNELS [pattern]', 'Info', 'List all active channels with at least one subscriber.'],
        ['PUBSUB NUMSUB [channel ...]', 'Info', 'Return the subscriber count for specified channels.'],
      ],
    },
    {
      type: 'heading',
      content: 'Pub/Sub Limitations',
    },
    {
      type: 'list',
      items: [
        'Messages are not stored -- if no subscriber is connected when PUBLISH is called, the message is gone forever.',
        'Subscribers must be connected at the time of publishing to receive a message. There is no inbox or message history.',
        'No acknowledgment -- the publisher has no way to know if a message was processed successfully.',
        'No replay -- a new subscriber cannot receive messages that were published before it connected.',
        'A connection in SUBSCRIBE mode can only run SUBSCRIBE, UNSUBSCRIBE, PSUBSCRIBE, PUNSUBSCRIBE, PING, and RESET -- no data commands.',
        'Not suitable for job queues where each message should be processed exactly once by exactly one worker.',
      ],
    },
    {
      type: 'example',
      title: 'SUBSCRIBE and PUBLISH',
      content: 'SUBSCRIBE puts the connection in subscribe mode. PUBLISH sends a message from any other connection.',
      language: 'bash',
      code: `# Connection 1 (subscriber)
SUBSCRIBE notifications user-updates

# Connection 2 (publisher) -- same Redis server
PUBLISH notifications "New order placed: #1042"
# => 1 (one subscriber received it)

PUBLISH user-updates "User 42 changed email"
# => 1

# Connection 1 receives:
# 1) "message"
# 2) "notifications"
# 3) "New order placed: #1042"

# Pattern subscription (matches any channel starting with "user:")
PSUBSCRIBE user:*

# Publisher
PUBLISH user:42:activity "logged in"
# Subscriber receives from pattern match`,
      output: '1',
    },
    {
      type: 'heading',
      content: 'List-Based Queues',
    },
    {
      type: 'text',
      content: 'For reliable message delivery where each message must be processed exactly once, use a Redis List. The producer pushes messages onto the list with LPUSH. The consumer pops messages with BRPOP. BRPOP (blocking right-pop) blocks the consumer connection until an item is available, then atomically pops and returns it. Because the pop is atomic, two workers calling BRPOP on the same list will never receive the same message. This is a simple, reliable producer-consumer queue with no external dependencies.',
    },
    {
      type: 'table',
      headers: ['Pattern', 'Producer Command', 'Consumer Command', 'Order'],
      rows: [
        ['FIFO (first in, first out)', 'LPUSH queue msg', 'BRPOP queue 0', 'Messages processed in order of arrival'],
        ['LIFO (last in, first out)', 'RPUSH queue msg', 'BRPOP queue 0', 'Most recent message processed first'],
        ['Priority queue', 'LPUSH queue:high / queue:low', 'BRPOP queue:high queue:low 0', 'High-priority list checked first; falls back to low'],
      ],
    },
    {
      type: 'example',
      title: 'List-based FIFO queue',
      content: 'LPUSH adds to the head. BRPOP blocks and removes from the tail when available. This forms a FIFO queue.',
      language: 'bash',
      code: `# Producer: push jobs to the queue
LPUSH jobs:email '{"to":"alice@example.com","subject":"Welcome"}'
LPUSH jobs:email '{"to":"bob@example.com","subject":"Password Reset"}'
# => 2

# Consumer: block until a job arrives (0 = wait forever)
BRPOP jobs:email 0
# => 1) "jobs:email"
# => 2) '{"to":"alice@example.com","subject":"Welcome"}'

# BRPOP with timeout (unblocks after 5 seconds if no item)
BRPOP jobs:email 5
# => (nil) if queue was empty for 5 seconds

# Queue length
LLEN jobs:email
# => 1

# Priority: check high-priority queue first, fallback to normal
BRPOP jobs:email:high jobs:email:normal 0`,
      output: '"jobs:email"',
    },
    {
      type: 'heading',
      content: 'BullMQ Overview',
    },
    {
      type: 'text',
      content: 'BullMQ is a production-grade job queue library built on Redis. It goes far beyond simple LPUSH/BRPOP by providing: automatic retries with configurable backoff, job concurrency limits, delayed jobs (run at a specific time), job priorities, job progress reporting, job events (completed, failed, stalled), repeatable jobs (cron-like scheduling), and a web dashboard (Bull Board). BullMQ manages the Redis data structures for you -- you interact with a high-level Queue and Worker API. It is the standard choice for job processing in Node.js production applications.',
    },
    {
      type: 'example',
      title: 'BullMQ basic queue and worker',
      content: 'Create a queue, add jobs, and process them with a worker. BullMQ handles retries and concurrency automatically.',
      language: 'javascript',
      code: `// npm install bullmq
import { Queue, Worker } from 'bullmq';

const connection = { host: 'localhost', port: 6379 };

// Producer: create a queue and add jobs
const emailQueue = new Queue('email', { connection });

await emailQueue.add('send-welcome', {
  to: 'alice@example.com',
  subject: 'Welcome to our app',
  template: 'welcome',
});

// Delayed job: send reminder in 24 hours
await emailQueue.add('send-reminder', { userId: 42 }, {
  delay: 24 * 60 * 60 * 1000,  // 24 hours in ms
});

// Repeating job: daily digest at 8am
await emailQueue.add('daily-digest', {}, {
  repeat: { cron: '0 8 * * *' },
});

// Consumer: process jobs with concurrency
const worker = new Worker('email', async (job) => {
  console.log('Processing job:', job.name, job.data);

  if (job.name === 'send-welcome') {
    await sendEmail(job.data);
  }

  return { sent: true };
}, {
  connection,
  concurrency: 5,       // process up to 5 jobs simultaneously
});

worker.on('completed', (job) => console.log('Done:', job.id));
worker.on('failed', (job, err) => console.error('Failed:', err));`,
      output: 'Processing job: send-welcome',
    },
    {
      type: 'heading',
      content: 'When to Use Each Messaging Tool',
    },
    {
      type: 'table',
      headers: ['Tool', 'Delivery', 'Persistence', 'Fan-out', 'Best For'],
      rows: [
        ['Redis Pub/Sub', 'At-most-once (fire and forget)', 'None', 'One-to-many', 'Real-time notifications, live dashboards, chat, event broadcasts'],
        ['List queues (LPUSH/BRPOP)', 'At-least-once (stays in list until popped)', 'Until popped', 'One-to-one', 'Simple job queues, task distribution, basic producer-consumer'],
        ['BullMQ', 'At-least-once with retries', 'Yes (in Redis)', 'One-to-one (configurable)', 'Production job processing, email/notification workers, scheduled tasks'],
        ['Redis Streams', 'At-least-once with consumer groups', 'Yes (append-only log)', 'One-to-many with groups', 'Event sourcing, audit logs, durable fan-out, high-volume event streams'],
      ],
    },
    {
      type: 'warning',
      title: 'Pub/Sub drops messages when subscribers are offline',
      content: 'Redis Pub/Sub delivers messages only to currently-connected subscribers. If a subscriber service is restarting, scaling up, or simply disconnected when a message is published, that message is lost permanently. For anything that must be reliably delivered, use a List queue or BullMQ instead.',
    },
    {
      type: 'tryit',
      title: 'Pub/Sub Simulator',
      css: `.pubsub{font-family:system-ui,sans-serif;max-width:700px;margin:0 auto;padding:16px;}
.pubsub h2{font-size:18px;font-weight:700;margin:0 0 14px;color:#111;}
.pubsub-panels{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;}
.pubsub-panel{border:2px solid #e5e5e5;border-radius:10px;padding:14px;background:#fff;}
.pubsub-panel h3{font-size:14px;font-weight:700;margin:0 0 10px;color:#111;}
.pubsub-panel h3 span{color:#DC382D;}
.pub-field{width:100%;box-sizing:border-box;border:1px solid #e5e5e5;border-radius:6px;padding:7px 10px;font-size:13px;margin-bottom:7px;font-family:inherit;}
.pub-field:focus{outline:none;border-color:#DC382D;}
.pub-btn{padding:7px 14px;background:#DC382D;color:#fff;border:none;border-radius:7px;font-size:13px;font-weight:600;cursor:pointer;width:100%;}
.pub-btn:hover{background:#b82e22;}
.sub-status{display:flex;align-items:center;gap:6px;margin-bottom:8px;}
.sub-dot{width:9px;height:9px;border-radius:50%;}
.sub-dot.on{background:#22c55e;}
.sub-dot.off{background:#d1d5db;}
.sub-label{font-size:13px;color:#444;}
.sub-btn-row{display:flex;gap:6px;margin-bottom:8px;}
.sub-btn{flex:1;padding:6px;border:2px solid #DC382D;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;background:#fff;color:#DC382D;}
.sub-btn.active{background:#DC382D;color:#fff;}
.sub-log{background:#1a1a1a;border-radius:8px;padding:10px;height:120px;overflow-y:auto;}
.sub-log p{font-family:monospace;font-size:12px;margin:2px 0;}
.sub-log p.msg{color:#4ade80;}
.sub-log p.sys{color:#9ca3af;}
.sub-count{font-size:12px;color:#888;margin-top:6px;}`,
      js: `var subscribed = false;
var messages = [];
var msgCount = 0;

function publish() {
  var channel = document.getElementById('chanInput').value.trim() || 'notifications';
  var msg = document.getElementById('msgInput').value.trim();
  if (!msg) return;

  if (!subscribed) {
    messages.push({ text: 'No subscribers connected -- message dropped!', cls: 'sys' });
  } else {
    msgCount++;
    var ts = new Date().toLocaleTimeString();
    messages.push({ text: '[' + ts + '] [' + channel + '] ' + msg, cls: 'msg' });
    messages.push({ text: 'PUBLISH returned: 1 subscriber(s) notified', cls: 'sys' });
  }
  if (messages.length > 20) messages = messages.slice(-20);
  document.getElementById('msgInput').value = '';
  render();
}

function toggleSubscribe() {
  subscribed = !subscribed;
  var channel = document.getElementById('chanInput').value.trim() || 'notifications';
  if (subscribed) {
    messages.push({ text: 'Subscribed to channel: ' + channel, cls: 'sys' });
  } else {
    messages.push({ text: 'Unsubscribed from: ' + channel, cls: 'sys' });
  }
  render();
}

function render() {
  var logsHtml = messages.length
    ? messages.map(function(m) { return '<p class="' + m.cls + '">' + m.msg + '</p>'; }).join('')
    : '<p class="sys">No messages yet</p>';

  document.getElementById('output').innerHTML =
    '<div class="pubsub">' +
    '<h2>Pub/Sub Simulator</h2>' +
    '<div class="pubsub-panels">' +
    '<div class="pubsub-panel">' +
    '<h3>Publisher</h3>' +
    '<input id="chanInput" class="pub-field" placeholder="Channel (e.g. notifications)" value="notifications">' +
    '<input id="msgInput" class="pub-field" placeholder="Message to publish">' +
    '<button class="pub-btn" id="pubBtn">Publish</button>' +
    '</div>' +
    '<div class="pubsub-panel">' +
    '<h3>Subscriber</h3>' +
    '<div class="sub-status">' +
    '<div class="sub-dot ' + (subscribed ? 'on' : 'off') + '"></div>' +
    '<span class="sub-label">' + (subscribed ? 'Connected and listening' : 'Not subscribed') + '</span>' +
    '</div>' +
    '<div class="sub-btn-row">' +
    '<button class="sub-btn ' + (subscribed ? 'active' : '') + '" id="subBtn">' +
    (subscribed ? 'Unsubscribe' : 'Subscribe') + '</button>' +
    '</div>' +
    '<div class="sub-count">Messages received: ' + msgCount + '</div>' +
    '</div>' +
    '</div>' +
    '<div class="sub-log" id="subLog">' + logsHtml + '</div>' +
    '</div>';

  document.getElementById('pubBtn').addEventListener('click', publish);
  document.getElementById('subBtn').addEventListener('click', toggleSubscribe);
  document.getElementById('msgInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') publish();
  });

  var log = document.getElementById('subLog');
  if (log) log.scrollTop = log.scrollHeight;
}

render();`,
    },
  ],
  exercises: [
    {
      id: 'redis-06-ex1',
      question: 'A subscriber is briefly disconnected from Redis when a PUBLISH is called on its channel. What happens to the message?',
      type: 'multiple-choice',
      options: [
        'Redis queues the message and delivers it when the subscriber reconnects',
        'The message is stored for up to 60 seconds for late subscribers',
        'The message is discarded permanently -- the subscriber never receives it',
        'Redis retries delivery until the subscriber reconnects',
      ],
      correct: 2,
      explanation: 'Redis Pub/Sub is fire-and-forget. Messages are delivered only to subscribers that are connected at the moment PUBLISH is called. There is no buffering, no queuing, and no retry. For reliable delivery, use a List queue or BullMQ.',
    },
    {
      id: 'redis-06-ex2',
      question: 'Why does BRPOP prevent workers from busy-looping when the queue is empty?',
      type: 'multiple-choice',
      options: [
        'BRPOP polls the list every second automatically',
        'BRPOP blocks the worker connection at the Redis server level until an item is pushed, then returns immediately',
        'BRPOP puts the Node.js event loop to sleep',
        'BRPOP reduces CPU usage by running on a separate thread',
      ],
      correct: 1,
      explanation: 'BRPOP sends a blocking command to Redis. Redis holds the connection suspended until an item is available in the list, then atomically pops and returns it. No polling occurs -- the worker waits with zero CPU usage until work arrives.',
    },
    {
      id: 'redis-06-ex3',
      question: 'Which BullMQ feature ensures a failed job is retried automatically?',
      type: 'multiple-choice',
      options: [
        'BRPOP timeout parameter',
        'The attempts option in job options (e.g., { attempts: 3 })',
        'Redis TTL on the job key',
        'The concurrency option on the Worker',
      ],
      correct: 1,
      explanation: 'BullMQ\'s attempts option specifies how many times a failed job should be retried. Combined with backoff (e.g., exponential backoff), failed jobs are retried with increasing delays. This is one of the key features that makes BullMQ suitable for production job processing.',
    },
  ],
  quiz: [
    {
      id: 'redis-06-q1',
      question: 'PUBLISH notifications "hello" returns 3. What does this mean?',
      options: [
        'The message was stored in 3 Redis databases',
        '3 subscribers received the message at the moment of publish',
        'The message will be retried 3 times',
        '3 channels were created',
      ],
      correct: 1,
      explanation: 'PUBLISH returns the number of subscribers that received the message. A return value of 3 means exactly 3 clients were subscribed to the "notifications" channel at the time PUBLISH was called.',
    },
    {
      id: 'redis-06-q2',
      question: 'Which command lets a subscriber receive messages from all channels matching "user:*"?',
      options: ['SUBSCRIBE user:*', 'PSUBSCRIBE user:*', 'SUBSCRIBE * FILTER user:', 'PUBSUB user:*'],
      correct: 1,
      explanation: 'PSUBSCRIBE (pattern subscribe) uses glob patterns. user:* matches user:42, user:99:events, user:alice, etc. Regular SUBSCRIBE requires exact channel names.',
    },
    {
      id: 'redis-06-q3',
      question: 'When would you choose a List-based queue over Redis Pub/Sub?',
      options: [
        'When you want to broadcast to many subscribers simultaneously',
        'When you need real-time chat functionality',
        'When each message must be processed exactly once by exactly one worker',
        'When you want sub-millisecond delivery latency',
      ],
      correct: 2,
      explanation: 'List queues guarantee that each item is popped exactly once. BRPOP is atomic -- only one worker gets each message. Pub/Sub broadcasts to all subscribers; if you have 3 workers subscribed to a channel, all 3 receive every message, causing triple-processing.',
    },
  ],
};
