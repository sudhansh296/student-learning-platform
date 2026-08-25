import type { Project } from './types';

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Markdown Editor</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="app">
  <header class="toolbar">
    <div class="toolbar-left">
      <h1>📝 Markdown Editor</h1>
    </div>
    <div class="toolbar-right">
      <button class="btn-icon" id="btnNewFile" title="New File">📄</button>
      <button class="btn-icon" id="btnSave" title="Save">💾</button>
      <button class="btn-icon" id="btnExport" title="Export HTML">⬇️</button>
      <button class="btn-icon" id="btnTogglePreview" title="Toggle Preview">👁️</button>
      <button class="btn-icon" id="btnTheme" title="Toggle Theme">🌙</button>
    </div>
  </header>

  <div class="editor-container">
    <div class="editor-pane">
      <div class="pane-header">
        <span>✏️ Editor</span>
        <div class="format-buttons">
          <button data-format="**bold**" title="Bold">B</button>
          <button data-format="*italic*" title="Italic">I</button>
          <button data-format="# " title="Heading">H</button>
          <button data-format="- " title="List">≡</button>
          <button data-format="\`code\`" title="Code">&lt;&gt;</button>
          <button data-format="[link](url)" title="Link">🔗</button>
        </div>
      </div>
      <textarea id="editor" placeholder="# Start writing markdown...

Write your content here. The preview updates in real-time!

## Features
- Bold: **text**
- Italic: *text*
- Links: [text](url)
- Images: ![alt](url)
- Code: \`inline\` or \`\`\`block\`\`\`
- Lists, quotes, and more!"></textarea>
      <div class="editor-stats">
        <span id="charCount">0 characters</span>
        <span>•</span>
        <span id="wordCount">0 words</span>
        <span>•</span>
        <span id="lineCount">0 lines</span>
      </div>
    </div>

    <div class="preview-pane">
      <div class="pane-header">
        <span>👁️ Preview</span>
        <button class="btn-copy" id="btnCopy">Copy HTML</button>
      </div>
      <div id="preview" class="preview-content"></div>
    </div>
  </div>
</div>
<script src="script.js"></script>
</body>
</html>`;

const styleCss = `:root {
  --bg: #ffffff;
  --surface: #f9fafb;
  --border: #e5e7eb;
  --text: #1f2937;
  --text-muted: #6b7280;
  --primary: #667eea;
  --code-bg: #f3f4f6;
}

[data-theme="dark"] {
  --bg: #1f2937;
  --surface: #111827;
  --border: #374151;
  --text: #f9fafb;
  --text-muted: #9ca3af;
  --primary: #818cf8;
  --code-bg: #374151;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg);
  color: var(--text);
  height: 100vh;
  overflow: hidden;
}

.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: var(--surface);
  border-bottom: 2px solid var(--border);
}

.toolbar h1 {
  font-size: 1.5rem;
  color: var(--primary);
}

.toolbar-right {
  display: flex;
  gap: 10px;
}

.btn-icon {
  width: 40px;
  height: 40px;
  border: none;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background: var(--primary);
  border-color: var(--primary);
  transform: translateY(-2px);
}

.editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  flex: 1;
  overflow: hidden;
}

.editor-pane,
.preview-pane {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-pane {
  border-right: 2px solid var(--border);
}

.pane-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  font-weight: 600;
  color: var(--text-muted);
}

.format-buttons {
  display: flex;
  gap: 5px;
}

.format-buttons button {
  padding: 5px 10px;
  border: 1px solid var(--border);
  background: var(--bg);
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.format-buttons button:hover {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

#editor {
  flex: 1;
  padding: 20px;
  border: none;
  background: var(--bg);
  color: var(--text);
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  line-height: 1.6;
  resize: none;
  outline: none;
}

.editor-stats {
  padding: 10px 20px;
  background: var(--surface);
  border-top: 1px solid var(--border);
  font-size: 0.85rem;
  color: var(--text-muted);
  display: flex;
  gap: 10px;
}

.btn-copy {
  padding: 5px 15px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-copy:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}

.preview-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  line-height: 1.7;
}

.preview-content h1 { font-size: 2rem; margin: 1em 0 0.5em; }
.preview-content h2 { font-size: 1.5rem; margin: 1em 0 0.5em; }
.preview-content h3 { font-size: 1.25rem; margin: 1em 0 0.5em; }
.preview-content p { margin: 0.75em 0; }
.preview-content ul, .preview-content ol { margin: 0.75em 0; padding-left: 2em; }
.preview-content li { margin: 0.25em 0; }
.preview-content code {
  background: var(--code-bg);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}
.preview-content pre {
  background: var(--code-bg);
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1em 0;
}
.preview-content pre code {
  background: none;
  padding: 0;
}
.preview-content blockquote {
  border-left: 4px solid var(--primary);
  padding-left: 1em;
  margin: 1em 0;
  color: var(--text-muted);
}
.preview-content a {
  color: var(--primary);
  text-decoration: none;
}
.preview-content a:hover {
  text-decoration: underline;
}
.preview-content img {
  max-width: 100%;
  border-radius: 8px;
}
.preview-content hr {
  border: none;
  border-top: 2px solid var(--border);
  margin: 2em 0;
}

@media (max-width: 900px) {
  .editor-container {
    grid-template-columns: 1fr;
  }
  
  .preview-pane {
    display: none;
  }
  
  .preview-pane.active {
    display: flex;
  }
  
  .editor-pane.hidden {
    display: none;
  }
}`;

const scriptJs = `// State
let currentTheme = 'light';
let autoSaveTimeout = null;

// DOM elements
const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const charCount = document.getElementById('charCount');
const wordCount = document.getElementById('wordCount');
const lineCount = document.getElementById('lineCount');
const btnSave = document.getElementById('btnSave');
const btnExport = document.getElementById('btnExport');
const btnCopy = document.getElementById('btnCopy');
const btnNewFile = document.getElementById('btnNewFile');
const btnTheme = document.getElementById('btnTheme');
const btnTogglePreview = document.getElementById('btnTogglePreview');
const formatButtons = document.querySelectorAll('.format-buttons button');

// Load saved content
const saved = localStorage.getItem('markdownContent');
if (saved) {
  editor.value = saved;
  updatePreview();
}

// Load theme
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  currentTheme = 'dark';
  btnTheme.textContent = '☀️';
}

// Editor input
editor.addEventListener('input', () => {
  updatePreview();
  updateStats();
  autoSave();
});

// Update preview
function updatePreview() {
  const markdown = editor.value;
  const html = markdownToHtml(markdown);
  preview.innerHTML = html;
}

// Simple markdown parser
function markdownToHtml(md) {
  let html = md;
  
  // Escape HTML
  html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Code blocks
  html = html.replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, '<pre><code>$1</code></pre>');
  
  // Inline code
  html = html.replace(/\`([^\`]+)\`/g, '<code>$1</code>');
  
  // Bold
  html = html.replace(/\\*\\*([^\\*]+)\\*\\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\\*([^\\*]+)\\*/g, '<em>$1</em>');
  
  // Headings
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Images
  html = html.replace(/!\\[([^\\]]*)\\]\\(([^\\)]+)\\)/g, '<img src="$2" alt="$1" />');
  
  // Links
  html = html.replace(/\\[([^\\]]+)\\]\\(([^\\)]+)\\)/g, '<a href="$2">$1</a>');
  
  // Lists
  html = html.replace(/^\\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\\/li>)/s, '<ul>$1</ul>');
  
  // Blockquotes
  html = html.replace(/^&gt; (.*$)/gim, '<blockquote>$1</blockquote>');
  
  // Horizontal rule
  html = html.replace(/^---$/gim, '<hr />');
  
  // Paragraphs
  html = html.replace(/\\n\\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  
  // Clean up
  html = html.replace(/<p><\\/p>/g, '');
  html = html.replace(/<p>(<h[1-6]>)/g, '$1');
  html = html.replace(/(<\\/h[1-6]>)<\\/p>/g, '$1');
  html = html.replace(/<p>(<ul>)/g, '$1');
  html = html.replace(/(<\\/ul>)<\\/p>/g, '$1');
  html = html.replace(/<p>(<pre>)/g, '$1');
  html = html.replace(/(<\\/pre>)<\\/p>/g, '$1');
  html = html.replace(/<p>(<blockquote>)/g, '$1');
  html = html.replace(/(<\\/blockquote>)<\\/p>/g, '$1');
  html = html.replace(/<p>(<hr \\/>)<\\/p>/g, '$1');
  
  return html;
}

// Update stats
function updateStats() {
  const text = editor.value;
  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\\s+/).length : 0;
  const lines = text.split('\\n').length;
  
  charCount.textContent = \`\${chars} characters\`;
  wordCount.textContent = \`\${words} words\`;
  lineCount.textContent = \`\${lines} lines\`;
}

// Auto save
function autoSave() {
  clearTimeout(autoSaveTimeout);
  autoSaveTimeout = setTimeout(() => {
    localStorage.setItem('markdownContent', editor.value);
  }, 1000);
}

// Format buttons
formatButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const format = btn.dataset.format;
    insertFormat(format);
  });
});

function insertFormat(format) {
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const text = editor.value;
  const selected = text.substring(start, end);
  
  let insertion;
  if (format.includes('bold') || format.includes('italic') || format.includes('code')) {
    const wrapper = format.split(selected.length > 0 ? selected : 'text')[0];
    insertion = wrapper + selected + wrapper;
  } else {
    insertion = format + selected;
  }
  
  editor.value = text.substring(0, start) + insertion + text.substring(end);
  editor.focus();
  editor.setSelectionRange(start + insertion.length, start + insertion.length);
  
  updatePreview();
  updateStats();
}

// Save button
btnSave.addEventListener('click', () => {
  localStorage.setItem('markdownContent', editor.value);
  alert('Document saved!');
});

// Export HTML
btnExport.addEventListener('click', () => {
  const html = preview.innerHTML;
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'markdown-export.html';
  a.click();
  URL.revokeObjectURL(url);
});

// Copy HTML
btnCopy.addEventListener('click', () => {
  navigator.clipboard.writeText(preview.innerHTML).then(() => {
    btnCopy.textContent = '✓ Copied!';
    setTimeout(() => {
      btnCopy.textContent = 'Copy HTML';
    }, 2000);
  });
});

// New file
btnNewFile.addEventListener('click', () => {
  if (confirm('Clear current document?')) {
    editor.value = '';
    updatePreview();
    updateStats();
  }
});

// Theme toggle
btnTheme.addEventListener('click', () => {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);
  btnTheme.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
});

// Toggle preview (mobile)
btnTogglePreview.addEventListener('click', () => {
  document.querySelector('.preview-pane').classList.toggle('active');
  document.querySelector('.editor-pane').classList.toggle('hidden');
});

// Initialize
updateStats();`;

export const markdownEditorProject: Project = {
  id: 'markdown-editor',
  slug: 'markdown-editor',
  title: 'Markdown Editor',
  difficulty: 'intermediate',
  type: 'frontend',
  estimatedTime: '5–7 hours',
  playgroundKey: 'markdown-editor',
  description: 'Build a real-time markdown editor with live preview, formatting toolbar, word counter, dark mode, auto-save, HTML export, and syntax highlighting. Features split-pane layout and responsive design.',
  technologies: ['HTML', 'CSS', 'JavaScript'],
  prerequisites: ['JavaScript fundamentals', 'Regular expressions', 'localStorage', 'File handling', 'String manipulation'],
  learnings: [
    'Markdown parsing with regex',
    'Real-time preview synchronization',
    'Text editor features (insert, selection)',
    'File export and download',
    'localStorage auto-save',
    'Theme switching system',
    'Split-pane layout with CSS Grid',
    'Character/word/line counting',
  ],
  features: [
    'Real-time markdown to HTML conversion',
    'Live preview pane with rendered output',
    'Formatting toolbar (bold, italic, heading, list, code, link)',
    'Character, word, and line counter',
    'Auto-save to localStorage',
    'Manual save button',
    'Export to HTML file',
    'Copy HTML to clipboard',
    'Dark/light theme toggle',
    'Split-pane editor layout',
    'Responsive mobile view',
    'New file creation',
  ],
  fileStructure: 'markdown-editor/\n  index.html\n  style.css\n  script.js',
  overview: 'A markdown editor converts markdown syntax to HTML in real-time. This project teaches text manipulation, regex patterns, file handling, and real-time UI updates. Users can write markdown in the left pane and see formatted HTML output in the right pane, with features like auto-save, export, and theme switching.',
  objective: 'Build a fully functional markdown editor with live preview, formatting tools, persistence, and export capabilities.',
  
  files: [
    { path: 'markdown-editor/index.html', language: 'html', content: indexHtml },
    { path: 'markdown-editor/style.css', language: 'css', content: styleCss },
    { path: 'markdown-editor/script.js', language: 'javascript', content: scriptJs },
  ],
  
  lessons: [
    {
      id: 'markdown-parsing',
      title: 'Markdown to HTML with Regex',
      explanation: 'Convert markdown syntax to HTML using regular expressions. Process in order: code blocks first (to avoid parsing code), then inline code, bold, italic, headings, images, links, lists, and paragraphs. Each pattern maps markdown syntax to HTML tags.',
      js: `function markdownToHtml(md) {
  let html = md;
  
  // Code blocks: \`\`\`code\`\`\`
  html = html.replace(/\`\`\`([\\s\\S]*?)\`\`\`/g, '<pre><code>$1</code></pre>');
  
  // Inline code: \`code\`
  html = html.replace(/\`([^\`]+)\`/g, '<code>$1</code>');
  
  // Bold: **text**
  html = html.replace(/\\*\\*([^\\*]+)\\*\\*/g, '<strong>$1</strong>');
  
  // Italic: *text*
  html = html.replace(/\\*([^\\*]+)\\*/g, '<em>$1</em>');
  
  // Headings: # H1, ## H2, ### H3
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  return html;
}`,
    },
    {
      id: 'text-insertion',
      title: 'Insert Formatting at Cursor',
      explanation: 'To insert formatting around selected text, get the cursor position (selectionStart/End), extract selected text, wrap it with markdown syntax, and replace. Then restore cursor position after the insertion.',
      js: `function insertFormat(format) {
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const text = editor.value;
  const selected = text.substring(start, end);
  
  // Wrap selected text
  const insertion = '**' + selected + '**'; // Example: bold
  
  // Replace text
  editor.value = text.substring(0, start) + 
                 insertion + 
                 text.substring(end);
  
  // Restore cursor after insertion
  editor.focus();
  editor.setSelectionRange(
    start + insertion.length, 
    start + insertion.length
  );
}`,
    },
    {
      id: 'file-export',
      title: 'Export HTML File',
      explanation: 'Create a downloadable file by creating a Blob with the HTML content, generating an Object URL, creating a temporary <a> element with download attribute, and clicking it programmatically.',
      js: `function exportHTML(html) {
  // Create blob from HTML string
  const blob = new Blob([html], { type: 'text/html' });
  
  // Create temporary download link
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document.html';
  
  // Trigger download
  a.click();
  
  // Clean up
  URL.revokeObjectURL(url);
}

// User gets: document.html with rendered HTML`,
    },
    {
      id: 'auto-save',
      title: 'Auto-Save with Debouncing',
      explanation: 'Save to localStorage automatically after user stops typing. Use debouncing with setTimeout to avoid saving on every keystroke. Clear previous timeout and set new one on each input event.',
      js: `let autoSaveTimeout = null;

editor.addEventListener('input', () => {
  // Clear previous save timeout
  clearTimeout(autoSaveTimeout);
  
  // Set new timeout: save after 1 second of no typing
  autoSaveTimeout = setTimeout(() => {
    localStorage.setItem('markdown', editor.value);
    console.log('Auto-saved!');
  }, 1000);
});

// Result: Saves 1 second after user stops typing`,
    },
  ],
  
  challenges: [
    {
      id: 'syntax-highlighting',
      title: 'Add Syntax Highlighting to Code Blocks',
      description: 'Detect programming language in code blocks (\`\`\`javascript) and apply syntax highlighting. Use a library like Prism.js or implement basic highlighting for JavaScript with regex.',
      hint: 'Parse language from \`\`\`lang syntax. Apply different colors to keywords, strings, comments. Use <span> tags with CSS classes.',
      difficulty: 'medium',
      solutionJs: `function highlightCode(code, lang) {
  if (lang === 'javascript') {
    // Keywords
    code = code.replace(/\\b(const|let|var|function|if|else|return)\\b/g, 
      '<span class="keyword">$1</span>');
    
    // Strings
    code = code.replace(/(['"])(.*?)\\1/g, 
      '<span class="string">$1$2$1</span>');
    
    // Comments
    code = code.replace(/(\\/\\/.*$)/gm, 
      '<span class="comment">$1</span>');
  }
  
  return code;
}

// Update regex to capture language:
html = html.replace(/\`\`\`(\\w+)?\\n([\\s\\S]*?)\`\`\`/g, (match, lang, code) => {
  const highlighted = highlightCode(code, lang);
  return \`<pre><code class="language-\${lang}">\${highlighted}</code></pre>\`;
});`,
    },
    {
      id: 'table-support',
      title: 'Add Markdown Table Support',
      description: 'Parse markdown table syntax and convert to HTML <table>. Tables use pipes (|) for columns and dashes for header separator: | Header | Header |\\n| --- | --- |\\n| Cell | Cell |',
      hint: 'Split by newlines, detect rows with pipes, separate header from body with dash row. Map to <thead> and <tbody>.',
      difficulty: 'hard',
      solutionJs: `function parseTable(md) {
  const lines = md.split('\\n');
  const tableLines = [];
  let inTable = false;
  
  lines.forEach(line => {
    if (line.includes('|')) {
      tableLines.push(line);
      inTable = true;
    } else if (inTable) {
      // Process collected table
      const html = buildTable(tableLines);
      md = md.replace(tableLines.join('\\n'), html);
      tableLines.length = 0;
      inTable = false;
    }
  });
  
  return md;
}

function buildTable(lines) {
  const header = lines[0].split('|').filter(c => c.trim()).map(c => c.trim());
  const rows = lines.slice(2).map(row => 
    row.split('|').filter(c => c.trim()).map(c => c.trim())
  );
  
  let html = '<table><thead><tr>';
  header.forEach(h => html += \`<th>\${h}</th>\`);
  html += '</tr></thead><tbody>';
  
  rows.forEach(row => {
    html += '<tr>';
    row.forEach(cell => html += \`<td>\${cell}</td>\`);
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  return html;
}`,
    },
  ],
  
  github: {
    owner: 'webdev-atlas',
    repo: 'markdown-editor',
    branch: 'main',
    url: 'https://github.com/webdev-atlas/markdown-editor',
  },
};
