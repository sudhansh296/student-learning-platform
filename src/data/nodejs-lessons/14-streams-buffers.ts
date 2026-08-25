import type { NodejsLesson } from '../nodejs-curriculum';

export const nodejsStreamsBuffersLesson: NodejsLesson = {
  id: 'nodejs-streams-buffers',
  title: 'Streams & Buffers',
  slug: 'streams-buffers',
  chapter: 'advanced',
  order: 14,
  difficulty: 'advanced',
  readingTime: 14,
  description: 'Readable and writable streams, piping, buffers, and efficient data processing for large files.',
  sections: [
    {
      type: 'text',
      content: 'Streams process data in chunks rather than loading entire files into memory. A stream is like a water pipe - data flows through piece by piece. Buffers are temporary storage for binary data chunks. Streams are essential for handling large files, network data, and real-time processing without consuming massive amounts of memory.',
    },
    {
      type: 'analogy',
      title: 'Streams are like assembly lines',
      content: 'Imagine reading a 5GB video file. Loading it all into memory (fs.readFile) is like trying to carry the entire assembly line output at once - you will run out of space. Streams process it piece by piece, like an assembly line where you handle one item at a time. Memory usage stays constant regardless of file size.',
    },
    {
      type: 'heading',
      content: 'Types of Streams',
    },
    {
      type: 'table',
      headers: ['Type', 'Direction', 'Example', 'Use Case'],
      rows: [
        ['Readable', 'Data flows out', 'fs.createReadStream()', 'Reading files, HTTP responses'],
        ['Writable', 'Data flows in', 'fs.createWriteStream()', 'Writing files, HTTP requests'],
        ['Duplex', 'Both directions', 'net.Socket', 'TCP connections'],
        ['Transform', 'Modify data', 'zlib.createGzip()', 'Compression, encryption'],
      ],
    },
    {
      type: 'heading',
      content: 'Readable Streams',
    },
    {
      type: 'example',
      title: 'Reading files with streams',
      content: 'Streams emit events as data flows. Listen to data, end, and error events.',
      language: 'javascript',
      code: `const fs = require('fs');

// Create a readable stream
const readStream = fs.createReadStream('largefile.txt', {
  encoding: 'utf8',
  highWaterMark: 64 * 1024 // 64KB chunks (default is 64KB)
});

// Listen to data events - fires for each chunk
readStream.on('data', (chunk) => {
  console.log('Received chunk:', chunk.length, 'bytes');
  // Process chunk here - do not wait for entire file
});

// Listen to end event - fires when stream completes
readStream.on('end', () => {
  console.log('Finished reading file');
});

// Listen to error event
readStream.on('error', (error) => {
  console.error('Stream error:', error.message);
});

// Pause and resume
readStream.on('data', (chunk) => {
  console.log('Processing chunk...');
  readStream.pause(); // stop reading
  
  setTimeout(() => {
    console.log('Resuming...');
    readStream.resume(); // continue reading
  }, 1000);
});`,
    },
    {
      type: 'heading',
      content: 'Writable Streams',
    },
    {
      type: 'example',
      title: 'Writing files with streams',
      content: 'Write data in chunks to writable streams. Handle backpressure with the write() return value.',
      language: 'javascript',
      code: `const fs = require('fs');

// Create a writable stream
const writeStream = fs.createWriteStream('output.txt', {
  encoding: 'utf8'
});

// Write data
writeStream.write('First line\ ');
writeStream.write('Second line\ ');
writeStream.write('Third line\ ');

// End the stream (required!)
writeStream.end('Final line\ ');

// Listen to finish event
writeStream.on('finish', () => {
  console.log('All data written');
});

writeStream.on('error', (error) => {
  console.error('Write error:', error.message);
});

// Handling backpressure - write() returns false when buffer is full
function writeMillionLines() {
  let i = 0;
  
  function write() {
    let ok = true;
    while (i < 1000000 && ok) {
      const data = \`Line \${i}\\n\`;
      i++;
      
      if (i === 1000000) {
        writeStream.write(data, () => console.log('Last write!'));
      } else {
        // write() returns false when internal buffer is full
        ok = writeStream.write(data);
      }
    }
    
    if (i < 1000000) {
      // Buffer full - wait for drain event
      writeStream.once('drain', write);
    } else {
      writeStream.end();
    }
  }
  
  write();
}`,
    },
    {
      type: 'heading',
      content: 'Piping Streams',
    },
    {
      type: 'text',
      content: 'Piping connects a readable stream to a writable stream. Data flows automatically with proper backpressure handling. This is the most common pattern for stream processing.',
    },
    {
      type: 'example',
      title: 'Pipe data between streams',
      content: 'Use .pipe() to connect streams. You can chain multiple streams together.',
      language: 'javascript',
      code: `const fs = require('fs');
const zlib = require('zlib');

// Copy a file with streams
const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');

readStream.pipe(writeStream);

writeStream.on('finish', () => {
  console.log('File copied successfully');
});

// Compress a file
fs.createReadStream('large.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('large.txt.gz'))
  .on('finish', () => console.log('Compression complete'));

// Decompress a file
fs.createReadStream('archive.gz')
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream('archive.txt'));

// Chain multiple transformations
const crypto = require('crypto');

fs.createReadStream('secret.txt')
  .pipe(zlib.createGzip())                    // compress
  .pipe(crypto.createCipher('aes192', 'pwd')) // encrypt
  .pipe(fs.createWriteStream('secret.enc'))   // write
  .on('finish', () => console.log('Encrypted and compressed'));`,
    },
    {
      type: 'heading',
      content: 'Transform Streams',
    },
    {
      type: 'example',
      title: 'Creating custom transform streams',
      content: 'Transform streams modify data as it passes through. Implement _transform() to process chunks.',
      language: 'javascript',
      code: `const { Transform } = require('stream');

// Custom transform stream that uppercases text
class UpperCaseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    // Process the chunk
    const upperChunk = chunk.toString().toUpperCase();
    // Push transformed data
    this.push(upperChunk);
    // Signal completion
    callback();
  }
}

// Use the custom transform
const upperCaseStream = new UpperCaseTransform();

fs.createReadStream('input.txt')
  .pipe(upperCaseStream)
  .pipe(fs.createWriteStream('output-upper.txt'));

// Line-by-line transform stream
class LineCounter extends Transform {
  constructor() {
    super();
    this.lineCount = 0;
  }
  
  _transform(chunk, encoding, callback) {
    const lines = chunk.toString().split('\ ');
    this.lineCount += lines.length - 1;
    
    // Add line numbers
    const numbered = lines
      .map((line, i) => \`\${this.lineCount + i}: \${line}\`)
      .join('\ ');
    
    this.push(numbered);
    callback();
  }
}

fs.createReadStream('code.js')
  .pipe(new LineCounter())
  .pipe(process.stdout); // print to console`,
    },
    {
      type: 'heading',
      content: 'Buffers',
    },
    {
      type: 'text',
      content: 'Buffers represent fixed-size chunks of binary data. They are used for raw data operations before encoding to strings or other formats. Streams work with buffers internally.',
    },
    {
      type: 'example',
      title: 'Working with buffers',
      content: 'Create, read, write, and convert buffers.',
      language: 'javascript',
      code: `// Create buffers
const buf1 = Buffer.alloc(10);           // 10 zero-filled bytes
const buf2 = Buffer.from('Hello');       // from string
const buf3 = Buffer.from([1, 2, 3, 4]);  // from array

console.log(buf1); // <Buffer 00 00 00 00 00 00 00 00 00 00>
console.log(buf2); // <Buffer 48 65 6c 6c 6f>
console.log(buf2.toString()); // "Hello"

// Write to buffer
const buf = Buffer.alloc(10);
buf.write('Hi');
buf.write('There', 2); // start at position 2
console.log(buf.toString()); // "HiThere"

// Read from buffer
console.log(buf[0]); // 72 (ASCII code for 'H')
console.log(buf.toString('utf8', 0, 2)); // "Hi"

// Buffer methods
const buf4 = Buffer.from('Node.js');
console.log(buf4.length);           // 7
console.log(buf4.toString('hex'));  // 4e6f64652e6a73
console.log(buf4.slice(0, 4).toString()); // "Node"

// Concatenate buffers
const buf5 = Buffer.concat([buf2, buf4]);
console.log(buf5.toString()); // "HelloNode.js"

// Compare buffers
const buf6 = Buffer.from('abc');
const buf7 = Buffer.from('abd');
console.log(buf6.compare(buf7)); // -1 (buf6 < buf7)`,
    },
    {
      type: 'example',
      title: 'Real-world example: CSV processor',
      content: 'Process a large CSV file line by line with streams.',
      language: 'javascript',
      code: `const fs = require('fs');
const { Transform } = require('stream');

// Transform stream that processes CSV rows
class CSVProcessor extends Transform {
  constructor() {
    super({ objectMode: true });
    this.buffer = '';
  }
  
  _transform(chunk, encoding, callback) {
    // Add chunk to buffer
    this.buffer += chunk.toString();
    
    // Split on newlines
    const lines = this.buffer.split('\ ');
    
    // Keep last incomplete line in buffer
    this.buffer = lines.pop();
    
    // Process complete lines
    lines.forEach(line => {
      if (line.trim()) {
        const fields = line.split(',');
        this.push(JSON.stringify({
          name: fields[0],
          age: parseInt(fields[1]),
          email: fields[2]
        }) + '\ ');
      }
    });
    
    callback();
  }
  
  _flush(callback) {
    // Process remaining buffer
    if (this.buffer.trim()) {
      const fields = this.buffer.split(',');
      this.push(JSON.stringify({
        name: fields[0],
        age: parseInt(fields[1]),
        email: fields[2]
      }) + '\ ');
    }
    callback();
  }
}

// Usage
fs.createReadStream('users.csv')
  .pipe(new CSVProcessor())
  .pipe(fs.createWriteStream('users.json'));`,
    },
    {
      type: 'tryit',
      title: 'Stream Simulator',
      css: `body{font-family:system-ui,sans-serif;padding:16px;margin:0;background:#f0fdfa;}
.container{max-width:800px;margin:0 auto;}
.header{background:linear-gradient(135deg,#14b8a6 0%,#0d9488 100%);color:#fff;padding:16px 20px;border-radius:10px;margin-bottom:16px;}
.header h2{margin:0 0 4px;font-size:18px;}
.header p{margin:0;opacity:0.95;font-size:13px;}
.controls{display:flex;gap:10px;margin-bottom:16px;}
.btn{padding:10px 20px;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;background:#14b8a6;color:#fff;}
.btn:hover{background:#0d9488;}
.pipeline{background:#fff;border:2px solid #5eead4;border-radius:10px;padding:16px;margin-bottom:16px;}
.stream-row{display:flex;align-items:center;gap:10px;margin:12px 0;}
.stream-box{flex:1;background:#f0fdfa;border:2px solid #99f6e4;border-radius:8px;padding:12px;min-height:60px;position:relative;}
.stream-label{font-size:11px;font-weight:700;color:#0f766e;margin-bottom:6px;}
.stream-content{font-family:monospace;font-size:11px;color:#134e4a;}
.arrow{color:#14b8a6;font-size:24px;font-weight:700;}
.chunk{display:inline-block;background:#ccfbf1;border:1px solid #5eead4;padding:2px 6px;margin:2px;border-radius:4px;font-size:10px;animation:flow 0.5s ease-out;}
@keyframes flow{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
.stats{background:#fff;border:2px solid #5eead4;border-radius:10px;padding:14px;}
.stat-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e5e7eb;}
.stat-label{color:#64748b;font-size:12px;}
.stat-value{font-weight:700;color:#0f766e;font-size:12px;}`,
      js: `var chunks = 0;
var bytesProcessed = 0;
var isRunning = false;

function startStream() {
  if (isRunning) return;
  isRunning = true;
  chunks = 0;
  bytesProcessed = 0;
  processChunk();
}

function processChunk() {
  if (chunks >= 10) {
    isRunning = false;
    addLog('Stream ended');
    return;
  }
  
  chunks++;
  var chunkSize = Math.floor(Math.random() * 30) + 10;
  bytesProcessed += chunkSize;
  
  addLog('Chunk ' + chunks + ' (' + chunkSize + ' bytes)');
  updatePipeline();
  updateStats();
  
  setTimeout(processChunk, 600);
}

function addLog(msg) {
  var read = document.getElementById('readable');
  read.innerHTML += '<span class="chunk">' + msg + '</span>';
  setTimeout(function() {
    var transform = document.getElementById('transform');
    transform.innerHTML += '<span class="chunk">' + msg.toUpperCase() + '</span>';
    setTimeout(function() {
      var write = document.getElementById('writable');
      write.innerHTML += '<span class="chunk">' + msg.toUpperCase() + '</span>';
    }, 200);
  }, 200);
}

function updatePipeline() {
  document.getElementById('readable').scrollLeft = 999999;
  document.getElementById('transform').scrollLeft = 999999;
  document.getElementById('writable').scrollLeft = 999999;
}

function updateStats() {
  document.getElementById('stats').innerHTML =
    '<div class="stat-row"><span class="stat-label">Chunks Processed</span><span class="stat-value">' + chunks + '</span></div>' +
    '<div class="stat-row"><span class="stat-label">Bytes Processed</span><span class="stat-value">' + bytesProcessed + '</span></div>' +
    '<div class="stat-row"><span class="stat-label">Memory Usage</span><span class="stat-value">~64KB (constant)</span></div>' +
    '<div class="stat-row"><span class="stat-label">Status</span><span class="stat-value">' + (isRunning ? 'Streaming...' : 'Idle') + '</span></div>';
}

function reset() {
  chunks = 0;
  bytesProcessed = 0;
  isRunning = false;
  document.getElementById('readable').innerHTML = '';
  document.getElementById('transform').innerHTML = '';
  document.getElementById('writable').innerHTML = '';
  updateStats();
}

document.getElementById('output').innerHTML =
  '<div class="container">' +
  '<div class="header"><h2>Stream Pipeline Visualizer</h2><p>Watch data flow through readable, transform, and writable streams</p></div>' +
  '<div class="controls">' +
  '<button class="btn" onclick="startStream()">Start Stream</button>' +
  '<button class="btn" onclick="reset()">Reset</button>' +
  '</div>' +
  '<div class="pipeline">' +
  '<div class="stream-row">' +
  '<div class="stream-box"><div class="stream-label">Readable Stream</div><div id="readable" class="stream-content" style="overflow-x:auto;white-space:nowrap"></div></div>' +
  '<div class="arrow">→</div>' +
  '<div class="stream-box"><div class="stream-label">Transform Stream</div><div id="transform" class="stream-content" style="overflow-x:auto;white-space:nowrap"></div></div>' +
  '<div class="arrow">→</div>' +
  '<div class="stream-box"><div class="stream-label">Writable Stream</div><div id="writable" class="stream-content" style="overflow-x:auto;white-space:nowrap"></div></div>' +
  '</div>' +
  '</div>' +
  '<div class="stats" id="stats"></div>' +
  '</div>';

updateStats();`,
    },
  ],
  exercises: [
    {
      id: 'nodejs-streams-1',
      question: 'What is the main advantage of streams over loading entire files into memory?',
      type: 'multiple-choice',
      options: [
        'Streams are faster than regular file operations',
        'Streams process data in chunks, using constant memory regardless of file size',
        'Streams automatically compress data',
        'Streams are easier to write than fs.readFile',
      ],
      correct: 1,
      explanation: 'Streams process data in small chunks (typically 64KB). Memory usage stays constant whether you process a 1MB or 1GB file. Without streams, loading a 1GB file requires 1GB of RAM.',
    },
    {
      id: 'nodejs-streams-2',
      question: 'What does the .pipe() method do?',
      type: 'multiple-choice',
      options: [
        'It creates a new stream',
        'It connects a readable stream to a writable stream and handles data flow automatically',
        'It pauses a stream temporarily',
        'It converts a stream to a buffer',
      ],
      correct: 1,
      explanation: '.pipe() connects streams together. Data flows from the readable stream through optional transform streams to the writable stream. It handles backpressure automatically, pausing the readable stream if the writable stream is overwhelmed.',
    },
  ],
  quiz: [
    {
      id: 'nodejs-streams-q1',
      question: 'When should you use streams instead of fs.readFile?',
      options: [
        'Always use streams for any file operation',
        'For large files or when you need to process data incrementally',
        'Only for compressed files',
        'Never - fs.readFile is always better',
      ],
      correct: 1,
      explanation: 'Use streams for large files (to avoid loading everything into memory), when processing data incrementally (CSV parsing, log analysis), or when piping data between sources. For small files where you need all data at once, fs.readFile is simpler.',
    },
  ],
};
