import type { ReactLesson } from '../react-curriculum';

export const reactReferencesLesson: ReactLesson = {
  id: 'react-references',
  title: 'React References',
  slug: 'references',
  chapter: 'advanced',
  order: 21,
  difficulty: 'beginner',
  readingTime: 15,
  description: 'Complete React quick reference — every built-in hook, component patterns, event handling, and common gotchas in one place.',
  sections: [
    // ── HOOKS ──────────────────────────────────────────────────
    { type: 'heading', content: 'Built-in Hooks Reference' },
    { type: 'text', content: 'Every hook React ships out of the box, what it returns, and when to reach for it.' },
    {
      type: 'table',
      title: 'State & Effect Hooks',
      headers: ['Hook', 'Returns', 'Use it for'],
      rows: [
        ['useState(initial)', '[value, setValue]', 'Local component state'],
        ['useReducer(reducer, initial)', '[state, dispatch]', 'Complex state with multiple sub-values or transitions'],
        ['useEffect(fn, deps)', 'nothing', 'Syncing with an external system after render (fetch, subscriptions, DOM)'],
        ['useLayoutEffect(fn, deps)', 'nothing', 'Same as useEffect, but fires synchronously before the browser paints'],
        ['useContext(Context)', 'current context value', 'Reading a value provided higher up the tree without prop drilling'],
      ],
    },
    {
      type: 'table',
      title: 'Ref & DOM Hooks',
      headers: ['Hook', 'Returns', 'Use it for'],
      rows: [
        ['useRef(initial)', 'mutable {current} object', 'Storing a value that persists across renders without causing one; DOM element references'],
        ['useImperativeHandle(ref, fn)', 'nothing', 'Customizing what a parent sees when it holds a ref to your component'],
      ],
    },
    {
      type: 'table',
      title: 'Performance Hooks',
      headers: ['Hook', 'Returns', 'Use it for'],
      rows: [
        ['useMemo(fn, deps)', 'memoized value', 'Skipping an expensive recalculation when deps haven’t changed'],
        ['useCallback(fn, deps)', 'memoized function', 'Keeping a function reference stable between renders (e.g. for React.memo children)'],
        ['useTransition()', '[isPending, startTransition]', 'Marking a state update as low-priority so the UI stays responsive'],
        ['useDeferredValue(value)', 'deferred copy of value', 'Deferring re-render of an expensive part of the tree until it’s idle'],
      ],
    },
    {
      type: 'table',
      title: 'Other Hooks',
      headers: ['Hook', 'Returns', 'Use it for'],
      rows: [
        ['useId()', 'unique stable id string', 'Generating ids for accessibility attributes (label/input pairs) that match between server and client'],
        ['useSyncExternalStore(subscribe, getSnapshot)', 'current snapshot', 'Subscribing to a store outside React (browser APIs, third-party state libraries)'],
      ],
    },
    { type: 'warning', title: 'The Rules of Hooks', content: 'Only call hooks at the top level of a component or custom hook — never inside loops, conditions, or nested functions. Only call hooks from React function components or other custom hooks, never plain JS functions.' },

    // ── COMPONENT PATTERNS ─────────────────────────────────────
    { type: 'heading', content: 'Component Syntax Reference' },
    { type: 'example', title: 'Function component with props and children', language: 'jsx', code: `function Card({ title, children, onClose }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{title}</h3>
        <button onClick={onClose}>×</button>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

// Usage
<Card title="Hello" onClose={() => setOpen(false)}>
  <p>Any JSX passed between the tags becomes props.children</p>
</Card>` },
    {
      type: 'table',
      title: 'JSX rules to remember',
      headers: ['Rule', 'Example'],
      rows: [
        ['Return one root element', 'Wrap siblings in <div> or a fragment <>...</>'],
        ['Use className, not class', '<div className="box">'],
        ['Self-close empty tags', '<img /> and <br /> not <img> or <br>'],
        ['camelCase attributes', 'onClick, tabIndex, readOnly (not onclick, tabindex)'],
        ['JS expressions in { }', '<p>{count * 2}</p>'],
        ['Style is an object', 'style={{ color: "red", fontSize: 14 }}'],
        ['Comments need braces', '{/* like this */}'],
      ],
    },

    // ── EVENTS ─────────────────────────────────────────────────
    { type: 'heading', content: 'Event Handling Reference' },
    {
      type: 'table',
      title: 'Common synthetic events',
      headers: ['Prop', 'Fires on'],
      rows: [
        ['onClick', 'Mouse click'],
        ['onChange', 'Input/select/textarea value change'],
        ['onSubmit', 'Form submission — call e.preventDefault() to stop the page reload'],
        ['onKeyDown / onKeyUp', 'Keyboard key press/release'],
        ['onFocus / onBlur', 'Element gains/loses focus'],
        ['onMouseEnter / onMouseLeave', 'Pointer enters/leaves the element (no bubbling)'],
        ['onScroll', 'Element or window scrolled'],
      ],
    },
    { type: 'example', title: 'Passing arguments to an event handler', language: 'jsx', code: `function TodoList({ items, onRemove }) {
  return (
    <ul>
      {items.map((item) => (
        // Wrap in an arrow function to pass the id — calling onRemove(item.id)
        // directly would invoke it immediately during render.
        <li key={item.id}>
          {item.text}
          <button onClick={() => onRemove(item.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}` },

    // ── LISTS, KEYS, CONDITIONALS ───────────────────────────────
    { type: 'heading', content: 'Lists, Keys & Conditional Rendering' },
    {
      type: 'table',
      title: 'Conditional rendering patterns',
      headers: ['Pattern', 'Example'],
      rows: [
        ['&& short-circuit', '{isLoggedIn && <Dashboard />}'],
        ['Ternary', '{isLoading ? <Spinner /> : <Content />}'],
        ['Early return', 'if (!user) return <LoginPrompt />;'],
        ['Variable then render', 'let content; if (x) content = <A/>; else content = <B/>; return content;'],
      ],
    },
    { type: 'warning', title: 'Keys must be stable and unique', content: 'Use a stable id from your data (item.id), never the array index if the list can be reordered, filtered, or have items inserted/removed — index keys cause React to mix up state between items.' },

    // ── DATA FETCHING PATTERN ───────────────────────────────────
    { type: 'heading', content: 'Common Custom Hook Pattern' },
    { type: 'example', title: 'A reusable useFetch hook', language: 'jsx', code: `function useFetch(url) {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((json) => { if (!cancelled) setData(json); })
      .catch((err) => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; }; // avoid setting state after unmount
  }, [url]);

  return { data, error, loading };
}` },

    // ── GOTCHAS ─────────────────────────────────────────────────
    { type: 'heading', content: 'Common Gotchas' },
    {
      type: 'list',
      title: 'Mistakes to avoid',
      items: [
        'State updates are asynchronous and batched — reading the state variable right after calling setState() still shows the old value.',
        'Never mutate state directly (arr.push(x)); always create a new array/object (setArr([...arr, x])) so React detects the change.',
        'useEffect with no dependency array runs after every render; an empty array [] runs once on mount; omitting it entirely is almost always a bug.',
        'Props flow down, events flow up — a child updates a parent by calling a function the parent passed in as a prop.',
        'Conditionally rendering hooks (calling useState inside an if) breaks React’s hook order tracking — hooks must run in the same order every render.',
      ],
    },
    { type: 'tip', title: 'React DevTools', content: 'Install the React DevTools browser extension to inspect the component tree, live props/state, and highlight re-renders — invaluable for debugging performance issues.' },
  ],
  exercises: [
    { id: 'react-ref-ex-1', question: 'Which hook lets you skip an expensive calculation when its inputs haven’t changed?', type: 'multiple-choice', options: ['useEffect', 'useMemo', 'useRef', 'useState'], correct: 1, explanation: 'useMemo(fn, deps) memoizes the return value of fn, recomputing only when deps change.' },
    { id: 'react-ref-ex-2', question: 'What happens if you call a hook inside an if statement?', type: 'multiple-choice', options: ['Nothing, it works fine', 'It breaks React’s hook order tracking', 'It runs twice', 'It only runs on the server'], correct: 1, explanation: 'Hooks must run in the same order on every render — conditionally calling them violates the Rules of Hooks.' },
    { id: 'react-ref-ex-3', question: 'Why shouldn’t you use the array index as a key when a list can be reordered?', type: 'multiple-choice', options: ['It’s slower to compute', 'React can mix up state between items', 'JSX doesn’t allow numeric keys', 'It causes a console warning only, no real issue'], correct: 1, explanation: 'When items move, index keys point to the wrong item, so React can attach the wrong internal state to it.' },
    { id: 'react-ref-ex-4', question: 'What does useRef return?', type: 'multiple-choice', options: ['A new value every render', 'A mutable object with a .current property', 'A memoized function', 'A promise'], correct: 1, explanation: 'useRef returns a stable, mutable {current: ...} object that persists across renders without triggering re-renders when updated.' },
  ],
  quiz: [
    { id: 'react-ref-q1', question: 'Which hook subscribes to context values from a higher provider?', options: ['useState', 'useContext', 'useRef', 'useReducer'], correct: 1, explanation: 'useContext(MyContext) reads the nearest matching Provider’s value.' },
    { id: 'react-ref-q2', question: 'What must a JSX expression always return?', options: ['An array of elements', 'Exactly one root element (or a fragment)', 'A string', 'Nothing, multiple roots are fine'], correct: 1, explanation: 'JSX must have a single root — use a fragment <>...</> to group siblings without an extra DOM node.' },
    { id: 'react-ref-q3', question: 'Which event prop fires when a form is submitted?', options: ['onClick', 'onSubmit', 'onChange', 'onFocus'], correct: 1, explanation: 'onSubmit fires on the <form> element; call e.preventDefault() to stop the default page reload.' },
    { id: 'react-ref-q4', question: 'What does useCallback memoize?', options: ['A value', 'A function reference', 'A component', 'A DOM node'], correct: 1, explanation: 'useCallback(fn, deps) returns the same function reference between renders as long as deps are unchanged.' },
    { id: 'react-ref-q5', question: 'Which cleanup pattern in useEffect prevents "setState after unmount" bugs?', options: ['Returning a cleanup function that sets a cancelled flag', 'Calling useState twice', 'Wrapping in try/catch', 'Using useMemo instead'], correct: 0, explanation: 'Returning a cleanup function from useEffect that flips a cancelled flag (or aborts a fetch) avoids updating state on an unmounted component.' },
  ],
};
