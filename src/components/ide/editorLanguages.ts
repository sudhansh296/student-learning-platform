// Loads the CodeMirror syntax package for a language only when it is needed, so the editor's first chunk stays small.
import type { Extension } from '@codemirror/state';

export type EditorLang =
  | 'html' | 'css' | 'javascript' | 'jsx' | 'typescript' | 'tsx' | 'json' | 'sql' | 'python' | 'java' | 'cpp'
  | 'rust' | 'php' | 'go' | 'csharp' | 'ruby' | 'shell' | 'yaml' | 'text';

export async function loadEditorLanguage(id: EditorLang): Promise<Extension> {
  const stream = async () => (await import('@codemirror/language')).StreamLanguage;
  switch (id) {
    case 'html': return (await import('@codemirror/lang-html')).html();
    case 'css': return (await import('@codemirror/lang-css')).css();
    case 'javascript': return (await import('@codemirror/lang-javascript')).javascript();
    case 'jsx': return (await import('@codemirror/lang-javascript')).javascript({ jsx: true });
    case 'typescript': return (await import('@codemirror/lang-javascript')).javascript({ typescript: true });
    case 'tsx': return (await import('@codemirror/lang-javascript')).javascript({ jsx: true, typescript: true });
    case 'json': return (await import('@codemirror/lang-json')).json();
    case 'sql': return (await import('@codemirror/lang-sql')).sql();
    case 'python': return (await import('@codemirror/lang-python')).python();
    case 'java': return (await import('@codemirror/lang-java')).java();
    case 'cpp': return (await import('@codemirror/lang-cpp')).cpp();
    case 'rust': return (await import('@codemirror/lang-rust')).rust();
    case 'php': return (await import('@codemirror/lang-php')).php();
    case 'go': return (await stream()).define((await import('@codemirror/legacy-modes/mode/go')).go);
    case 'csharp': return (await stream()).define((await import('@codemirror/legacy-modes/mode/clike')).csharp);
    case 'ruby': return (await stream()).define((await import('@codemirror/legacy-modes/mode/ruby')).ruby);
    case 'shell': return (await stream()).define((await import('@codemirror/legacy-modes/mode/shell')).shell);
    case 'yaml': return (await stream()).define((await import('@codemirror/legacy-modes/mode/yaml')).yaml);
    default: return [];
  }
}

/** Which highlighter fits a playground tab / language id. `jsHint` refines the plain JS tab (it may hold React or TypeScript). */
export function editorLangFor(tab: string, jsHint: 'javascript' | 'jsx' | 'typescript' = 'javascript'): EditorLang {
  switch (tab) {
    case 'html': return 'html';
    case 'css': return 'css';
    case 'js': return jsHint;
    case 'typescript': return 'typescript';
    case 'react': return 'tsx';
    case 'nextjs': return 'tsx';
    case 'express': case 'node': case 'mongo': return 'javascript';
    case 'postgres': case 'sql': return 'sql';
    case 'python': return 'python';
    case 'java': return 'java';
    case 'c': case 'cpp': return 'cpp';
    case 'csharp': return 'csharp';
    case 'go': return 'go';
    case 'rust': return 'rust';
    case 'php': return 'php';
    case 'ruby': return 'ruby';
    case 'bash': case 'git': case 'redis': case 'docker': return 'shell';
    case 'yaml': return 'yaml';
    case 'json': return 'json';
    default: return 'text';
  }
}
