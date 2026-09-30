'use client';

import { useEffect, useRef } from 'react';
import { Annotation, Compartment, EditorState } from '@codemirror/state';
import { EditorView, drawSelection, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { HighlightStyle, bracketMatching, indentOnInput, indentUnit, syntaxHighlighting } from '@codemirror/language';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { tags as t } from '@lezer/highlight';
import { loadEditorLanguage, type EditorLang } from './editorLanguages';

// Colours follow the playground's existing GitHub-dark look (#0d1117 / #161b22 / #30363d).
const theme = EditorView.theme({
  '&': { height: '100%', backgroundColor: '#0d1117', color: '#e6edf3', fontSize: '13px' },
  '&.cm-focused': { outline: 'none' },
  '.cm-scroller': { fontFamily: 'var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', lineHeight: '1.6', overflow: 'auto' },
  '.cm-content': { caretColor: '#ffffff', padding: '12px 0' },
  '.cm-line': { padding: '0 12px 0 6px' },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: '#ffffff' },
  '.cm-gutters': { backgroundColor: '#0d1117', color: '#484f58', border: 'none' },
  '.cm-lineNumbers .cm-gutterElement': { padding: '0 8px 0 12px', minWidth: '32px' },
  '.cm-activeLine': { backgroundColor: 'rgba(110,118,129,0.10)' },
  '.cm-activeLineGutter': { backgroundColor: 'transparent', color: '#8b949e' },
  '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': { backgroundColor: '#264f78' },
  '.cm-matchingBracket': { backgroundColor: 'rgba(63,185,80,0.22)', outline: '1px solid rgba(63,185,80,0.55)' },
  '.cm-nonmatchingBracket': { backgroundColor: 'rgba(248,81,73,0.25)' },
}, { dark: true });

const highlight = HighlightStyle.define([
  { tag: [t.keyword, t.operatorKeyword, t.modifier, t.controlKeyword], color: '#ff7b72' },
  { tag: [t.string, t.special(t.string), t.regexp], color: '#a5d6ff' },
  { tag: [t.number, t.bool, t.null, t.atom], color: '#79c0ff' },
  { tag: [t.comment, t.lineComment, t.blockComment], color: '#8b949e', fontStyle: 'italic' },
  { tag: [t.function(t.variableName), t.function(t.propertyName), t.definition(t.function(t.variableName))], color: '#d2a8ff' },
  { tag: [t.className, t.typeName, t.namespace], color: '#ffa657' },
  { tag: [t.tagName], color: '#7ee787' },
  { tag: [t.attributeName, t.propertyName, t.definition(t.propertyName)], color: '#79c0ff' },
  { tag: [t.operator, t.punctuation, t.separator], color: '#ff7b72' },
  { tag: [t.bracket, t.paren, t.brace, t.squareBracket], color: '#e6edf3' },
  { tag: [t.variableName, t.name], color: '#e6edf3' },
  { tag: [t.self, t.special(t.variableName)], color: '#79c0ff' },
  { tag: [t.meta, t.processingInstruction], color: '#8b949e' },
  { tag: t.heading, color: '#79c0ff', fontWeight: 'bold' },
  { tag: t.invalid, color: '#f85149' },
]);

/** Marks a document change that came from the parent (tab switch, template, draft) so it is not echoed back to onChange. */
const External = Annotation.define<boolean>();

interface Props {
  value: string;
  onChange: (value: string) => void;
  /** Ctrl/Cmd + Enter */
  onRun: () => void;
  language: EditorLang;
}

/** CodeMirror 6 editor: line numbers, syntax highlighting, bracket matching, auto-closing brackets, wrapping, no minimap. */
export default function CodeEditor({ value, onChange, onRun, language }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const langSlot = useRef(new Compartment());
  const onChangeRef = useRef(onChange);
  const onRunRef = useRef(onRun);

  useEffect(() => { onChangeRef.current = onChange; onRunRef.current = onRun; });

  // create the editor once
  useEffect(() => {
    if (!hostRef.current) return;
    const view = new EditorView({
      parent: hostRef.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(),
          highlightActiveLineGutter(),
          highlightActiveLine(),
          history(),
          drawSelection(),
          indentOnInput(),
          bracketMatching(),
          closeBrackets(),
          indentUnit.of('  '),
          EditorState.tabSize.of(2),
          EditorView.lineWrapping,
          syntaxHighlighting(highlight),
          theme,
          langSlot.current.of([]),
          EditorView.contentAttributes.of({ 'aria-label': 'Code editor', spellcheck: 'false', autocorrect: 'off', autocapitalize: 'off' }),
          keymap.of([
            { key: 'Mod-Enter', run: () => { onRunRef.current(); return true; } },
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...historyKeymap,
            indentWithTab,
          ]),
          EditorView.updateListener.of((u) => {
            if (u.docChanged && !u.transactions.some((tr) => tr.annotation(External))) onChangeRef.current(u.state.doc.toString());
          }),
        ],
      }),
    });
    viewRef.current = view;
    return () => { view.destroy(); viewRef.current = null; };
    // the editor is created once; later prop changes are applied by the effects below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // the parent replaced the code (template, draft, share link …)
  useEffect(() => {
    const view = viewRef.current;
    if (!view || view.state.doc.toString() === value) return;
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value }, annotations: External.of(true) });
  }, [value]);

  // syntax package, loaded on demand
  useEffect(() => {
    let cancelled = false;
    loadEditorLanguage(language).then((ext) => {
      if (!cancelled) viewRef.current?.dispatch({ effects: langSlot.current.reconfigure(ext) });
    }).catch(() => { /* no highlighting for this language, the editor still works */ });
    return () => { cancelled = true; };
  }, [language]);

  return <div ref={hostRef} className="absolute inset-0" />;
}
