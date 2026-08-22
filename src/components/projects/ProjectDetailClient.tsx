'use client';

import { useState } from 'react';
import { LiveEditor } from '@/components/ide/LiveEditor';
import {
  Download,
  GitBranch,
  Code2,
  BookOpen,
  Trophy,
  FolderOpen,
  Copy,
  Check,
  Terminal,
  Play,
  ExternalLink,
} from 'lucide-react';
import type { Project } from '@/data/projects/types';

interface Props {
  project: Project;
}

type Tab = 'overview' | 'files' | 'challenges';

function cleanHtml(html: string): string {
  return html
    .replace(/<link[^>]*rel=["']stylesheet["'][^>]*\/?>/gi, '')
    .replace(/<script[^>]+src=["'][^"']*["'][^>]*><\/script>/gi, '');
}

function getLangLabel(lang: 'html' | 'css' | 'javascript' | 'typescript' | 'json' | 'markdown' | 'bash' | 'text'): string {
  const map: Record<string, string> = {
    html: 'HTML',
    css: 'CSS',
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    json: 'JSON',
    markdown: 'Markdown',
    bash: 'Bash',
    text: 'Text',
  };
  return map[lang] || lang;
}

function getLangColor(lang: string): string {
  const map: Record<string, string> = {
    html: 'text-orange-400',
    css: 'text-blue-400',
    javascript: 'text-yellow-400',
    typescript: 'text-cyan-400',
    json: 'text-green-400',
    bash: 'text-purple-400',
  };
  return map[lang] || 'text-gray-400';
}

const TYPE_BADGE: Record<string, string> = {
  frontend: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  react: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
  backend: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
  fullstack: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 border-pink-200 dark:border-pink-800',
};

const DIFF_BADGE: Record<string, string> = {
  beginner: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border-green-200 dark:border-green-800',
  intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  advanced: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 border-orange-200 dark:border-orange-800',
};

// ── LESSON SECTION COMPONENT ──────────────────────────────────────────────
interface LessonSectionProps {
  index: number;
  lesson: { id: string; title: string; explanation: string; js?: string; html?: string; css?: string };
  filesToShow: Array<{ path: string; language: string; content: string }>;
  lessonSnippet: string;
  snippetLang: string;
  isLast: boolean;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
}

function LessonSection({ index, lesson, filesToShow, lessonSnippet, snippetLang, isLast, copiedKey, onCopy }: LessonSectionProps) {
  const [activeFile, setActiveFile] = useState(0);

  const hasFiles = filesToShow.length > 0;
  const currentFile = hasFiles ? filesToShow[activeFile] : null;
  const displayCode = currentFile ? currentFile.content : lessonSnippet;
  const displayLang = currentFile ? currentFile.language : snippetLang;

  return (
    <div className="relative">
      {/* Step number + title */}
      <div className="flex items-center gap-3 mb-3">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold shrink-0">
          {index + 1}
        </span>
        <h3 className="text-lg font-bold text-foreground">{lesson.title}</h3>
      </div>

      {/* Explanation */}
      <p className="text-muted-foreground leading-relaxed text-[0.95rem] mb-5 pl-10">
        {lesson.explanation}
      </p>

      {/* Code — full files with tab switcher if multiple files */}
      {(hasFiles || lessonSnippet) && (
        <div className="rounded-xl overflow-hidden border border-border shadow-sm">
          {/* Tab header */}
          <div className="flex items-center justify-between bg-[#161b22] border-b border-[#30363d] px-3 py-1.5">
            <div className="flex items-center gap-1">
              {hasFiles ? (
                filesToShow.map((f, fi) => (
                  <button
                    key={f.path}
                    onClick={() => setActiveFile(fi)}
                    className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-colors ${
                      fi === activeFile
                        ? `bg-[#21262d] ${getLangColor(f.language)}`
                        : 'text-[#8b949e] hover:text-white'
                    }`}
                  >
                    {f.path.split('/').pop()}
                  </button>
                ))
              ) : (
                <span className={`text-xs font-mono font-semibold px-2 ${getLangColor(displayLang)}`}>
                  {getLangLabel(displayLang as 'html' | 'css' | 'javascript' | 'typescript' | 'json' | 'markdown' | 'bash' | 'text')}
                </span>
              )}
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#21262d] text-[#484f58] font-mono ml-1">
                complete file
              </span>
            </div>
            <button
              onClick={() => onCopy(displayCode, lesson.id + '-' + (currentFile?.path || ''))}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors"
            >
              {copiedKey === lesson.id + '-' + (currentFile?.path || '')
                ? <><span className="w-3 h-3 text-green-400">&#10003;</span><span className="text-green-400">Copied</span></>
                : <><span className="w-3 h-3">&#128203;</span><span>Copy</span></>}
            </button>
          </div>

          {/* Code content */}
          <div className="bg-[#0d1117] overflow-x-auto">
            <pre className="p-4 text-[13px] leading-[1.7] font-mono text-[#e6edf3] whitespace-pre">
              <code>{displayCode}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Divider */}
      {!isLast && <div className="mt-10 border-t border-border" />}
    </div>
  );
}

export function ProjectDetailClient({ project }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const isFrontend = project.type === 'frontend';

  // Get the full project files for the live editor
  const fullHtml = project.files.find(f => f.language === 'html')?.content || '';
  const fullCss = project.files.find(f => f.language === 'css')?.content || '';
  const fullJs = project.files.find(f => f.language === 'javascript')?.content || '';
  const hasLiveDemo = isFrontend && (fullHtml || fullCss || fullJs);

  async function copyToClipboard(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  function handleDownload() {
    if (isFrontend && fullHtml) {
      const standalone = cleanHtml(fullHtml)
        .replace('</head>', `<style>\n${fullCss}\n</style>\n</head>`)
        + `<script>\n${fullJs}\n</script>`;
      triggerDownload(standalone, project.slug + '.html', 'text/html');
    } else {
      const content = project.files
        .map(f => '// ===== ' + f.path + ' =====\n\n' + f.content)
        .join('\n\n\n');
      triggerDownload(content, project.slug + '-source.txt', 'text/plain');
    }
  }

  function triggerDownload(content: string, filename: string, mime: string) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  const challengeDiffColor: Record<string, string> = {
    easy: 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400',
    hard: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400',
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-10">

      {/* ── PROJECT HEADER ── */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${DIFF_BADGE[project.difficulty] ?? ''}`}>
            {project.difficulty}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${TYPE_BADGE[project.type] ?? ''}`}>
            {project.type}
          </span>
          <span className="text-xs text-muted-foreground">{project.estimatedTime}</span>
          <div className="flex flex-wrap gap-1.5 ml-1">
            {project.technologies.map(t => (
              <span key={t} className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                {t}
              </span>
            ))}
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-3">{project.title}</h1>
        <p className="text-muted-foreground leading-relaxed max-w-3xl text-base mb-5">{project.overview}</p>

        {/* Meta cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 max-w-3xl">
          <div className="p-4 rounded-lg border border-border bg-muted/30">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Objective</p>
            <p className="text-sm text-foreground leading-snug">{project.objective}</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-muted/30">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Features</p>
            <ul className="space-y-1">
              {project.features.slice(0, 4).map(f => (
                <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="w-1 h-1 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                  {f}
                </li>
              ))}
              {project.features.length > 4 && (
                <li className="text-xs text-muted-foreground pl-3">+{project.features.length - 4} more</li>
              )}
            </ul>
          </div>
          <div className="p-4 rounded-lg border border-border bg-muted/30">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">You will learn</p>
            <ul className="space-y-1">
              {project.learnings.slice(0, 5).map(l => (
                <li key={l} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="w-1 h-1 rounded-full bg-green-400 shrink-0 mt-1.5" />
                  {l}
                </li>
              ))}
              {project.learnings.length > 5 && (
                <li className="text-xs text-muted-foreground pl-3">+{project.learnings.length - 5} more</li>
              )}
            </ul>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          {project.playgroundKey && (
            <a
              href={`/playground?template=${project.playgroundKey}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white text-sm font-semibold transition-colors"
            >
              <Terminal className="w-4 h-4 text-green-400" />
              Open in Code Editor
            </a>
          )}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Source
          </button>
          {project.github ? (
            <a
              href={project.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted text-foreground text-sm font-semibold transition-colors"
            >
              <GitBranch className="w-4 h-4" />
              View on GitHub
            </a>
          ) : (
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-muted/60 text-muted-foreground text-sm font-medium select-none">
              <GitBranch className="w-4 h-4" />
              GitHub coming soon
            </span>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Live Demo
            </a>
          )}
        </div>
      </div>

      {/* ── EMBEDDED LIVE DEMO (for deployed projects) ── */}
      {project.liveUrl && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <ExternalLink className="w-4 h-4 text-green-500" />
            <h2 className="text-lg font-bold text-foreground">Live Preview</h2>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-1"
            >
              {project.liveUrl} (open in new tab)
            </a>
          </div>
          <div className="rounded-xl overflow-hidden border border-border shadow-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-3 h-3 rounded-full bg-[#28ca41]" />
              </div>
              <span className="text-xs font-mono text-[#8b949e] flex-1 text-center">{project.liveUrl}</span>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-[#8b949e] hover:text-white transition-colors"
              >
                Open
              </a>
            </div>
            <iframe
              src={project.liveUrl}
              className="w-full border-0"
              style={{ height: 600 }}
              title={project.title + ' live preview'}
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* ── LIVE PROJECT DEMO (frontend only) ── */}
      {hasLiveDemo && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Play className="w-4 h-4 text-green-500" />
            <h2 className="text-lg font-bold text-foreground">Live Project — Try It Now</h2>
            <span className="text-xs text-muted-foreground ml-1">All files combined and running</span>
          </div>
          <LiveEditor
            defaultHTML={cleanHtml(fullHtml)}
            defaultCSS={fullCss}
            defaultJS={fullJs}
            mode="full"
            height={520}
            readOnly={false}
          />
        </div>
      )}

      {/* ── NON-FRONTEND: show all source files stacked ── */}
      {!isFrontend && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Code2 className="w-4 h-4 text-yellow-500" />
            <h2 className="text-lg font-bold text-foreground">Complete Source Code</h2>
          </div>
          <div className="space-y-4">
            {project.files.map(f => (
              <div key={f.path} className="rounded-xl overflow-hidden border border-border shadow-sm">
                <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-[#8b949e]" />
                    <span className={`text-xs font-mono font-semibold ${getLangColor(f.language)}`}>
                      {getLangLabel(f.language)}
                    </span>
                    <span className="text-xs text-[#484f58] ml-1">{f.path}</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(f.content, f.path)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors"
                  >
                    {copiedKey === f.path
                      ? <><Check className="w-3 h-3 text-green-400" /><span className="text-green-400">Copied</span></>
                      : <><Copy className="w-3 h-3" /><span>Copy</span></>}
                  </button>
                </div>
                <div className="bg-[#0d1117] overflow-x-auto overflow-y-auto">
                  <pre className="p-4 text-[13px] leading-[1.7] font-mono text-[#e6edf3] whitespace-pre">
                    <code>{f.content}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TABS ── */}
      <div className="flex gap-0 border-b border-border mb-6">
        {([
          { key: 'overview' as Tab, label: 'How It Works', icon: BookOpen },
          { key: 'files' as Tab, label: 'Source Files', icon: FolderOpen },
          { key: 'challenges' as Tab, label: 'Challenges', icon: Trophy },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === key
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── HOW IT WORKS TAB ── */}
      {activeTab === 'overview' && (
        <div className="max-w-4xl space-y-12">
          {project.lessons.map((lesson, i) => {
            // Determine which files are relevant to this lesson
            // For frontend projects: show all project files (HTML + CSS + JS together)
            // For backend/react/fullstack: show the file(s) matching the lesson language
            const isFrontendProject = project.type === 'frontend';

            // Files to show for this lesson
            let filesToShow = isFrontendProject
              ? project.files // show all files for frontend (HTML + CSS + JS)
              : lesson.js
              ? project.files.filter(f => f.language === 'javascript' || f.language === 'typescript')
              : lesson.html
              ? project.files.filter(f => f.language === 'html')
              : lesson.css
              ? project.files.filter(f => f.language === 'css')
              : project.files; // fallback: show all

            // If no project files matched, use the lesson snippet as fallback
            const hasProjectFiles = filesToShow.length > 0;
            const lessonSnippet = lesson.js || lesson.html || lesson.css || '';
            const snippetLang = lesson.js ? 'javascript' : lesson.html ? 'html' : 'css';

            return (
              <LessonSection
                key={lesson.id}
                index={i}
                lesson={lesson}
                filesToShow={hasProjectFiles ? filesToShow : []}
                lessonSnippet={hasProjectFiles ? '' : lessonSnippet}
                snippetLang={snippetLang}
                isLast={i === project.lessons.length - 1}
                copiedKey={copiedKey}
                onCopy={copyToClipboard}
              />
            );
          })}
        </div>
      )}

      {/* ── SOURCE FILES TAB ── */}
      {activeTab === 'files' && (
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-2">Files</p>
            {project.files.map((f, i) => (
              <button
                key={f.path}
                onClick={() => setActiveFileIndex(i)}
                className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono transition-colors ${
                  i === activeFileIndex
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <Code2 className="w-3 h-3 shrink-0 opacity-60" />
                <span className="truncate">{f.path.split('/').pop()}</span>
              </button>
            ))}
            <div className="mt-5 px-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Structure</p>
              <pre className="text-[11px] text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap break-words">
                {project.fileStructure}
              </pre>
            </div>
          </div>

          {project.files[activeFileIndex] && (() => {
            const f = project.files[activeFileIndex];
            return (
              <div className="min-w-0">
                <div className="rounded-xl overflow-hidden border border-border shadow-sm">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d]">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-semibold ${getLangColor(f.language)}`}>
                        {getLangLabel(f.language)}
                      </span>
                      <span className="text-xs text-[#484f58]">{f.path}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(f.content, 'file-' + f.path)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors"
                    >
                      {copiedKey === 'file-' + f.path
                        ? <><Check className="w-3 h-3 text-green-400" /><span className="text-green-400">Copied</span></>
                        : <><Copy className="w-3 h-3" /><span>Copy</span></>}
                    </button>
                  </div>
                  <div className="bg-[#0d1117] overflow-x-auto overflow-y-auto">
                    <pre className="p-4 text-[13px] leading-[1.7] font-mono text-[#e6edf3] whitespace-pre">
                      <code>{f.content}</code>
                    </pre>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── CHALLENGES TAB ── */}
      {activeTab === 'challenges' && (
        <div className="space-y-4 max-w-3xl">
          <p className="text-muted-foreground text-sm mb-4">
            Extend the project with these challenges. Each one adds a real-world skill on top of what you built.
          </p>
          {project.challenges.map((c, i) => (
            <div
              key={c.id}
              className="p-5 rounded-xl border border-border bg-background hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground opacity-60">#{i + 1}</span>
                  <h3 className="font-bold text-foreground">{c.title}</h3>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border capitalize shrink-0 ${challengeDiffColor[c.difficulty] ?? ''}`}>
                  {c.difficulty}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{c.description}</p>
              <details>
                <summary className="text-xs font-semibold text-blue-600 dark:text-blue-400 cursor-pointer select-none hover:underline">
                  Show hint
                </summary>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed pl-3 border-l-2 border-blue-200 dark:border-blue-800">
                  {c.hint}
                </p>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
