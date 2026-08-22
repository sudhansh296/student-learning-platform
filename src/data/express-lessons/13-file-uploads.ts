import type { ExpressLesson } from '../express-curriculum';

export const expressFileUploadsLesson: ExpressLesson = {
  id: 'express-file-uploads',
  slug: 'file-uploads',
  chapter: 'advanced',
  order: 13,
  difficulty: 'intermediate',
  readingTime: 13,
  title: 'File Uploads with Multer',
  description: 'Handle single and multiple file uploads in Express using Multer — with validation, storage configuration, and error handling.',
  sections: [
    {
      type: 'text',
      content: 'File uploads require a special content type called multipart/form-data. The built-in express.json() and express.urlencoded() middleware only parse application/json and application/x-www-form-urlencoded bodies — they cannot handle binary file data. You need a dedicated package like Multer to parse multipart requests.',
    },
    {
      type: 'heading',
      content: 'Installing Multer',
    },
    {
      type: 'example',
      title: 'Install Multer',
      content: 'Multer is the standard middleware for handling multipart/form-data in Express, primarily used for file uploads.',
      language: 'bash',
      code: `npm install multer`,
    },
    {
      type: 'heading',
      content: 'Memory Storage vs Disk Storage',
    },
    {
      type: 'analogy',
      title: 'RAM vs Hard Drive',
      content: 'Memory storage is like RAM — fast, immediately accessible, but cleared when the process ends. Disk storage is like a hard drive — files persist permanently but require a file path and write operation. Use memory storage for small files you process immediately (resize, upload to S3). Use disk storage for files you keep on the server long-term.',
    },
    {
      type: 'table',
      headers: ['Feature', 'Memory Storage', 'Disk Storage'],
      rows: [
        ['Location', 'RAM (req.file.buffer)', 'Filesystem (req.file.path)'],
        ['Persistence', 'Gone when process ends', 'Permanent on disk'],
        ['Speed', 'Very fast', 'Slower (I/O)'],
        ['File size limit', 'Limited by RAM', 'Limited by disk space'],
        ['Best for', 'Immediate processing, cloud uploads', 'Long-term storage on server'],
        ['Access method', 'req.file.buffer', 'req.file.path'],
      ],
    },
    {
      type: 'heading',
      content: 'Single File Upload',
    },
    {
      type: 'text',
      content: 'Use upload.single(fieldname) to accept one file. After the middleware runs, req.file contains all information about the uploaded file — fieldname, originalname, mimetype, size, and either buffer (memory) or path (disk).',
    },
    {
      type: 'table',
      headers: ['Field', 'Type', 'Description'],
      rows: [
        ['fieldname', 'string', 'Name of the form field'],
        ['originalname', 'string', 'Original filename from client'],
        ['mimetype', 'string', 'MIME type, e.g. image/jpeg'],
        ['size', 'number', 'File size in bytes'],
        ['buffer', 'Buffer', 'File data in memory (memory storage only)'],
        ['path', 'string', 'Path to saved file (disk storage only)'],
        ['destination', 'string', 'Folder where file was saved'],
        ['filename', 'string', 'Name of file on disk'],
      ],
    },
    {
      type: 'heading',
      content: 'Multiple Files',
    },
    {
      type: 'text',
      content: 'Use upload.array(fieldname, maxCount) to accept multiple files from the same field. The files are available as an array on req.files. You can also use upload.fields() to accept files from multiple different form fields simultaneously.',
    },
    {
      type: 'heading',
      content: 'Mixed Fields',
    },
    {
      type: 'text',
      content: 'upload.fields() lets you define multiple named file fields with individual max counts. The result is an object on req.files where each key is a field name and the value is an array of file objects.',
    },
    {
      type: 'heading',
      content: 'File Validation',
    },
    {
      type: 'text',
      content: 'Multer itself does not block files by type or size — you must add that logic yourself. Use the fileFilter option to check mimetype before accepting the file. Use the limits option to set a maximum file size in bytes.',
    },
    {
      type: 'heading',
      content: 'Multer Error Handling',
    },
    {
      type: 'text',
      content: 'Multer throws a MulterError instance for problems like exceeding the file limit or receiving an unexpected field. Check for instanceof multer.MulterError in your error middleware to send specific, helpful error messages to the client.',
    },
    {
      type: 'example',
      title: 'Multer disk storage setup',
      content: 'The diskStorage engine accepts a destination function that sets the upload folder and a filename function that controls how the saved file is named on disk. Using Date.now() in the filename prevents collisions between files with the same original name.',
      language: 'javascript',
      code: `const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Disk storage: control where and how files are saved
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save files to the "uploads/" folder
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Unique filename: fieldname-timestamp.ext
    const ext = path.extname(file.originalname);
    const uniqueName = file.fieldname + '-' + Date.now() + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });

app.listen(3000);`,
    },
    {
      type: 'example',
      title: 'Single file upload route with validation',
      content: 'The fileFilter callback receives the file object and calls cb(null, true) to accept or cb(null, false) to silently reject. The limits.fileSize option rejects files larger than the specified byte count before they are fully read into memory.',
      language: 'javascript',
      code: `const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
  },
  fileFilter: function (req, file, cb) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true); // accept
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
    }
  }
});

app.post('/upload/avatar', upload.single('avatar'), function (req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({
    message: 'Upload successful',
    file: {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      // req.file.buffer is available for memory storage
    }
  });
});`,
    },
    {
      type: 'example',
      title: 'Multiple files upload route',
      content: 'upload.array() places all uploaded files in req.files as an array, while upload.fields() groups them by field name into an object. Both accept a second argument specifying the maximum number of files allowed.',
      language: 'javascript',
      code: `// Accept up to 5 photos from a field named "photos"
app.post('/upload/photos', upload.array('photos', 5), function (req, res) {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const fileList = req.files.map(function (f) {
    return { name: f.originalname, size: f.size, type: f.mimetype };
  });

  res.json({ uploaded: req.files.length, files: fileList });
});

// Mixed fields: 1 avatar + up to 3 documents
app.post('/upload/profile', upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'docs', maxCount: 3 }
]), function (req, res) {
  const avatar = req.files['avatar'] ? req.files['avatar'][0] : null;
  const docs = req.files['docs'] || [];

  res.json({
    avatar: avatar ? avatar.originalname : null,
    documents: docs.map(function (d) { return d.originalname; })
  });
});`,
    },
    {
      type: 'example',
      title: 'Error handling middleware for Multer errors',
      content: 'Multer errors are instances of multer.MulterError and have a code property such as LIMIT_FILE_SIZE or LIMIT_UNEXPECTED_FILE. Checking instanceof lets you return a specific 400 response for upload problems instead of a generic 500.',
      language: 'javascript',
      code: `const multer = require('multer');

// 4-argument error middleware catches Multer errors
app.use(function (err, req, res, next) {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large. Maximum size is 5 MB.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Unexpected field name: ' + err.field
      });
    }
    return res.status(400).json({ error: err.message });
  }

  // Custom file type errors (thrown in fileFilter)
  if (err && err.message) {
    return res.status(400).json({ error: err.message });
  }

  // Generic server error
  res.status(500).json({ error: 'Internal server error' });
});`,
    },
    {
      type: 'warning',
      title: 'Never trust the original filename',
      content: 'Always rename uploaded files server-side. The originalname field comes from the client and can contain path traversal characters like ../ or malicious names. Always use a sanitized, generated filename when saving to disk.',
    },
    {
      type: 'tip',
      title: 'Memory storage for cloud uploads',
      content: 'Use memoryStorage() when you plan to stream the file directly to a cloud service (AWS S3, Cloudinary) without saving it locally. For large files or high traffic, disk storage is safer because it does not consume Node.js heap memory.',
    },
    {
      type: 'tryit',
      title: 'File Upload Simulator',
      css: `body{font-family:system-ui,sans-serif;padding:20px;margin:0;background:#f0f0f0;}
.upload-demo{max-width:700px;margin:0 auto;}
.panel{background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);margin-bottom:16px;}
.panel-header{background:#000;color:#fff;padding:14px 20px;font-size:15px;font-weight:700;}
.panel-body{padding:20px;}
.controls{display:flex;gap:12px;margin-bottom:20px;align-items:flex-end;flex-wrap:wrap;}
.ctrl-group{display:flex;flex-direction:column;gap:6px;}
.ctrl-label{font-size:12px;font-weight:700;color:#555;text-transform:uppercase;letter-spacing:.5px;}
select{padding:10px 14px;border:2px solid #ddd;border-radius:8px;font-size:14px;background:#fff;cursor:pointer;}
select:focus{outline:none;border-color:#000;}
.btn{padding:10px 20px;background:#000;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;}
.btn:hover{background:#333;}
.upload-zone{border:2px dashed #ccc;border-radius:10px;padding:30px;text-align:center;margin-bottom:20px;background:#fafafa;}
.upload-zone-text{color:#888;font-size:14px;}
.result-panel{display:none;}
.result-panel.visible{display:block;}
.val-title{font-size:13px;font-weight:700;color:#333;margin-bottom:12px;}
.val-row{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-radius:6px;margin-bottom:6px;background:#f8f8f8;border:1px solid #e8e8e8;}
.val-key{font-size:13px;color:#555;font-weight:600;}
.val-val{font-size:13px;color:#333;font-family:monospace;}
.badge{padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;}
.badge-pass{background:#d1fae5;color:#065f46;}
.badge-fail{background:#fee2e2;color:#991b1b;}
.req-file{background:#1a1a1a;color:#4ade80;padding:14px;border-radius:8px;font-family:monospace;font-size:12px;white-space:pre;margin-top:16px;}`,
      js: `var imageNames = ['photo','avatar','profile_pic','banner','thumbnail'];
var docNames = ['resume','report','invoice','contract','manual'];
var imageExts = ['.jpg','.png','.webp','.gif'];
var docExts = ['.pdf','.docx','.xlsx','.txt'];

function rand(arr){return arr[Math.floor(Math.random()*arr.length)];}
function randInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}

function generateFile(type) {
  if (type === 'image') {
    var ext = rand(imageExts);
    var mime = ext==='.jpg'?'image/jpeg':ext==='.png'?'image/png':ext==='.webp'?'image/webp':'image/gif';
    var size = randInt(50*1024, 8*1024*1024);
    return { name: rand(imageNames)+'-'+Date.now()+ext, mime: mime, size: size };
  } else {
    var ext2 = rand(docExts);
    var mimeMap = {'.pdf':'application/pdf','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document','.xlsx':'application/vnd.ms-excel','.txt':'text/plain'};
    var size2 = randInt(10*1024, 20*1024*1024);
    return { name: rand(docNames)+'-'+Date.now()+ext2, mime: mimeMap[ext2], size: size2 };
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB';
  return (bytes/(1024*1024)).toFixed(2) + ' MB';
}

function selectFile() {
  var type = document.getElementById('fileType').value;
  var file = generateFile(type);
  var maxSize = 5*1024*1024;
  var allowedImages = ['image/jpeg','image/png','image/webp'];
  var allowedDocs = ['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain'];
  var typeOk = type==='image' ? allowedImages.includes(file.mime) : allowedDocs.includes(file.mime);
  var sizeOk = file.size <= maxSize;

  document.getElementById('valName').textContent = file.name;
  document.getElementById('valSize').textContent = formatSize(file.size);
  document.getElementById('valMime').textContent = file.mime;
  document.getElementById('valType').innerHTML = typeOk
    ? '<span class=\\"badge badge-pass\\">PASS</span>'
    : '<span class=\\"badge badge-fail\\">FAIL - type not allowed</span>';
  document.getElementById('valSize2').innerHTML = sizeOk
    ? '<span class=\\"badge badge-pass\\">PASS</span>'
    : '<span class=\\"badge badge-fail\\">FAIL - exceeds 5 MB</span>';

  var reqFile = '// req.file object in your Express route\\nreq.file = {\\n  fieldname: \\"upload\\",\\n  originalname: \\"'+file.name+'\\",\\n  mimetype: \\"'+file.mime+'\\",\\n  size: '+file.size+',\\n  buffer: &lt;Buffer ... &gt; // memoryStorage\\n};';

  if (!typeOk || !sizeOk) {
    reqFile = '// Upload rejected — file did not pass validation\\n// Route handler would return 400 Bad Request';
  }

  document.getElementById('reqFile').textContent = reqFile;
  document.getElementById('resultPanel').className = 'result-panel visible';
  document.getElementById('uploadZoneText').textContent = 'Selected: ' + file.name;
}

document.getElementById('output').innerHTML =
  '<div class=\\"upload-demo\\">' +
  '<div class=\\"panel\\">' +
  '<div class=\\"panel-header\\">File Upload Validator</div>' +
  '<div class=\\"panel-body\\">' +
  '<div class=\\"controls\\">' +
  '<div class=\\"ctrl-group\\"><span class=\\"ctrl-label\\">File Type</span>' +
  '<select id=\\"fileType\\"><option value=\\"image\\">Image (JPEG/PNG/WebP)</option><option value=\\"document\\">Document (PDF/DOCX/TXT)</option></select></div>' +
  '<button class=\\"btn\\" onclick=\\"selectFile()\\">Select File</button>' +
  '</div>' +
  '<div class=\\"upload-zone\\"><div class=\\"upload-zone-text\\" id=\\"uploadZoneText\\">Click \\"Select File\\" to generate a random file for validation</div></div>' +
  '<div class=\\"result-panel\\" id=\\"resultPanel\\">' +
  '<div class=\\"val-title\\">Validation Results (Multer fileFilter + limits)</div>' +
  '<div class=\\"val-row\\"><span class=\\"val-key\\">filename</span><span class=\\"val-val\\" id=\\"valName\\"></span></div>' +
  '<div class=\\"val-row\\"><span class=\\"val-key\\">size</span><span class=\\"val-val\\" id=\\"valSize\\"></span></div>' +
  '<div class=\\"val-row\\"><span class=\\"val-key\\">mimetype</span><span class=\\"val-val\\" id=\\"valMime\\"></span></div>' +
  '<div class=\\"val-row\\"><span class=\\"val-key\\">type check</span><span id=\\"valType\\"></span></div>' +
  '<div class=\\"val-row\\"><span class=\\"val-key\\">size check (max 5 MB)</span><span id=\\"valSize2\\"></span></div>' +
  '<div class=\\"req-file\\" id=\\"reqFile\\"></div>' +
  '</div>' +
  '</div>' +
  '</div>';`,
    },
  ],
  exercises: [
    {
      id: 'express-uploads-1',
      question: 'Why does express.json() not handle file uploads?',
      type: 'multiple-choice',
      options: [
        'It only parses application/json bodies',
        'It is too slow for binary data',
        'It requires a plugin to enable file support',
        'Files must be uploaded with PUT requests',
      ],
      correct: 0,
      explanation: 'express.json() only parses requests with Content-Type: application/json. File uploads use multipart/form-data, which requires a dedicated parser like Multer to decode the binary file data.',
    },
    {
      id: 'express-uploads-2',
      question: 'Which multer storage option keeps the file in Node.js memory rather than saving to disk?',
      type: 'multiple-choice',
      options: [
        'multer.ramStorage()',
        'multer.bufferStorage()',
        'multer.memoryStorage()',
        'multer.cacheStorage()',
      ],
      correct: 2,
      explanation: 'multer.memoryStorage() stores the file as a Buffer in req.file.buffer without writing to disk. This is useful when you want to process the file immediately or stream it to a cloud service.',
    },
    {
      id: 'express-uploads-3',
      question: 'What does the multer error code LIMIT_FILE_SIZE indicate?',
      type: 'multiple-choice',
      options: [
        'The file type is not allowed',
        'The disk is full',
        'The uploaded file exceeds the configured byte limit',
        'Too many files were uploaded at once',
      ],
      correct: 2,
      explanation: 'LIMIT_FILE_SIZE is a MulterError thrown when an uploaded file exceeds the fileSize value set in the limits option. You can catch it with instanceof multer.MulterError and check err.code.',
    },
  ],
  quiz: [
    {
      id: 'express-uploads-q1',
      question: 'What property of req.file contains the uploaded file data when using memoryStorage?',
      options: ['req.file.data', 'req.file.buffer', 'req.file.stream', 'req.file.content'],
      correct: 1,
      explanation: 'When using multer.memoryStorage(), the file contents are stored as a Node.js Buffer in req.file.buffer. With diskStorage, the file is written to disk and req.file.path holds the location.',
    },
    {
      id: 'express-uploads-q2',
      question: 'Which multer method do you use to accept files from multiple named form fields?',
      options: ['upload.multi()', 'upload.array()', 'upload.fields()', 'upload.mixed()'],
      correct: 2,
      explanation: 'upload.fields([{ name: "avatar", maxCount: 1 }, { name: "docs", maxCount: 3 }]) accepts files from different named fields. The result is available as req.files["avatar"] and req.files["docs"].',
    },
    {
      id: 'express-uploads-q3',
      question: 'How do you limit file uploads to images only in Multer?',
      options: [
        'Set the accept option in the multer config',
        'Use the fileFilter callback to check file.mimetype',
        'Set allowed: ["image/*"] in the limits option',
        'Multer automatically detects image files',
      ],
      correct: 1,
      explanation: 'The fileFilter option receives the file object and calls cb(null, true) to accept or cb(null, false) to reject. Check file.mimetype against an allowlist of accepted types like ["image/jpeg", "image/png"].',
    },
  ],
};
