import type { Project } from './types';

const indexHtml = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>File Sharing</title><link rel="stylesheet" href="style.css"></head><body>
<div class="app"><h1>📁 File Sharing</h1><div class="upload-zone" id="uploadZone"><p>Drag & drop files here or click to browse</p><input type="file" id="fileInput" multiple hidden></div><div class="files-list" id="filesList"></div></div>
<script src="script.js"></script></body></html>`;

const styleCss = `*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;background:linear-gradient(135deg,#667eea,#764ba2);min-height:100vh;padding:40px 20px}.app{max-width:800px;margin:0 auto;background:#fff;border-radius:20px;padding:40px;box-shadow:0 20px 60px rgba(0,0,0,.3)}h1{text-align:center;color:#667eea;margin-bottom:30px}.upload-zone{border:3px dashed #667eea;border-radius:15px;padding:60px 20px;text-align:center;cursor:pointer;transition:all .3s;margin-bottom:30px}.upload-zone:hover,.upload-zone.drag-over{background:#f0f4ff;border-color:#5568d3}.upload-zone p{font-size:1.2rem;color:#666}.files-list{}.file-item{display:flex;align-items:center;justify-content:space-between;padding:15px;background:#f9fafb;border-radius:10px;margin-bottom:10px}.file-info{flex:1;display:flex;align-items:center;gap:15px}.file-icon{font-size:2rem}.file-details strong{display:block;margin-bottom:3px}.file-details span{font-size:.85rem;color:#999}.file-actions{display:flex;gap:10px}.btn-action{padding:8px 15px;border:none;border-radius:6px;cursor:pointer;font-weight:600;transition:all .2s}.btn-download{background:#10b981;color:#fff}.btn-delete{background:#ef4444;color:#fff}.btn-action:hover{opacity:.9;transform:translateY(-2px)}`;

const scriptJs = `let files=JSON.parse(localStorage.getItem('sharedFiles')||'[]');const uploadZone=document.getElementById('uploadZone'),fileInput=document.getElementById('fileInput'),filesList=document.getElementById('filesList');uploadZone.addEventListener('click',()=>fileInput.click()),uploadZone.addEventListener('dragover',e=>{e.preventDefault(),uploadZone.classList.add('drag-over')}),uploadZone.addEventListener('dragleave',()=>uploadZone.classList.remove('drag-over')),uploadZone.addEventListener('drop',e=>{e.preventDefault(),uploadZone.classList.remove('drag-over'),handleFiles(e.dataTransfer.files)}),fileInput.addEventListener('change',e=>handleFiles(e.target.files));function handleFiles(e){Array.from(e).forEach(e=>{const t=new FileReader;t.onload=t=>{const r={id:Date.now()+Math.random(),name:e.name,size:e.size,type:e.type,data:t.target.result,uploaded:new Date().toISOString()};files.push(r),saveFiles(),renderFiles()},t.readAsDataURL(e)})}function renderFiles(){filesList.innerHTML=0===files.length?'<p style="text-align:center;color:#999;padding:40px 0">No files uploaded yet</p>':files.map(e=>\`<div class="file-item"><div class="file-info"><div class="file-icon">\${getFileIcon(e.type)}</div><div class="file-details"><strong>\${e.name}</strong><span>\${formatSize(e.size)} • \${formatDate(e.uploaded)}</span></div></div><div class="file-actions"><button class="btn-action btn-download" onclick="downloadFile('\${e.id}')">Download</button><button class="btn-action btn-delete" onclick="deleteFile('\${e.id}')">Delete</button></div></div>\`).join('')}function getFileIcon(e){return e.startsWith('image/')?'🖼️':e.startsWith('video/')?'🎥':e.startsWith('audio/')?'🎵':e.includes('pdf')?'📄':e.includes('zip')?'📦':'📄'}function formatSize(e){return e<1024?e+' B':e<1048576?(e/1024).toFixed(1)+' KB':(e/1048576).toFixed(1)+' MB'}function formatDate(e){const t=new Date(e);return t.toLocaleDateString()+' '+t.toLocaleTimeString()}window.downloadFile=function(e){const t=files.find(t=>t.id==e);if(t){const e=document.createElement('a');e.href=t.data,e.download=t.name,e.click()}},window.deleteFile=function(e){confirm('Delete this file?')&&(files=files.filter(t=>t.id!=e),saveFiles(),renderFiles())};function saveFiles(){localStorage.setItem('sharedFiles',JSON.stringify(files))}renderFiles();`;

export const fileSharingProject: Project = {
  id: 'file-sharing',
  slug: 'file-sharing',
  title: 'File Sharing App',
  difficulty: 'advanced',
  type: 'frontend',
  estimatedTime: '10–15 hours',
  playgroundKey: 'file-sharing',
  description: 'Build a file sharing application with drag-and-drop upload, file preview, download functionality, localStorage persistence, file type detection, and size formatting. Supports multiple file types.',
  technologies: ['HTML', 'CSS', 'JavaScript'],
  prerequisites: ['File API', 'FileReader API', 'Drag and Drop API', 'Base64 encoding', 'localStorage'],
  learnings: ['File API and FileReader', 'Drag and drop file upload', 'Base64 data URLs', 'File type detection', 'Size formatting', 'Download file programmatically', 'localStorage for binary data', 'MIME type handling'],
  features: ['Drag and drop file upload', 'Click to browse files', 'Multiple file upload', 'File type icons (image/video/audio/PDF/zip)', 'File size formatting (B/KB/MB)', 'Upload timestamp', 'Download files', 'Delete files', 'localStorage persistence', 'Supported types: images, videos, audio, PDFs, zip files'],
  fileStructure: 'file-sharing/\n  index.html\n  style.css\n  script.js',
  overview: 'A file sharing app demonstrates file handling, drag-and-drop, and data persistence. Users can upload files via drag-and-drop or file picker, view uploaded files with metadata, and download or delete them.',
  objective: 'Build a complete file sharing system with upload, download, delete, and persistence capabilities.',
  files: [
    { path: 'file-sharing/index.html', language: 'html', content: indexHtml },
    { path: 'file-sharing/style.css', language: 'css', content: styleCss },
    { path: 'file-sharing/script.js', language: 'javascript', content: scriptJs },
  ],
  lessons: [
    { id: 'file-upload', title: 'File Upload with FileReader', explanation: 'Use FileReader to read files as Base64 data URLs. Store in localStorage for persistence.', js: 'const reader = new FileReader(); reader.onload = (e) => { const data = e.target.result; };' },
    { id: 'drag-drop', title: 'Drag and Drop API', explanation: 'Handle dragover, dragleave, and drop events. Prevent default to enable drop. Get files from event.dataTransfer.files.', js: 'zone.addEventListener("drop", (e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); });' },
  ],
  challenges: [
    { id: 'file-preview', title: 'Add File Preview Modal', description: 'Show preview modal for images and videos. Display image src or video player.', hint: 'Check file type. For images, show <img>. For videos, use <video>. Create modal overlay.', difficulty: 'medium' },
    { id: 'share-links', title: 'Generate Shareable Links', description: 'Generate unique share links for each file. Copy link to clipboard. Access files via URL parameter.', hint: 'Create unique ID. Use URL with query param ?file=ID. Load file from ID on page load.', difficulty: 'hard' },
  ],
  github: { owner: 'webdev-atlas', repo: 'file-sharing', branch: 'main', url: 'https://github.com/webdev-atlas/file-sharing' },
};
