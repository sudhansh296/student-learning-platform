import type { ReactLesson } from '../react-curriculum';

export const reactFetchDataLesson: ReactLesson = {
  id: 'react-fetch-data',
  title: 'Fetching Data in React',
  slug: 'fetch-data',
  chapter: 'patterns',
  order: 16,
  difficulty: 'intermediate',
  readingTime: 14,
  description: 'Master the standard pattern for fetching data in React: loading/error/data state, async functions in React.useEffect, cleanup on unmount, parallel requests, and building a reusable useFetch hook.',
  sections: [
    {
      type: 'text',
      content: 'Fetching data is one of the most common tasks in React apps. The standard pattern combines React.useEffect (to trigger the fetch), React.useState (to track loading, error, and data), and proper cleanup to avoid memory leaks when the component unmounts before the fetch completes.',
    },
    {
      type: 'heading',
      content: '1. The Standard Loading/Error/Data Pattern',
    },
    {
      type: 'example',
      title: 'Always track three states: loading, error, and data',
      content: 'Every fetch operation has three possible states: loading (request in flight), error (request failed), and data (request succeeded). Always handle all three to build a good user experience.',
      language: 'jsx',
      code: `// React hooks available via React.React.useState, React.React.useEffect etc.
function UserList() {
  const [users, setUsers]     = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError]     = React.useState(null);

  React.useEffect(() => {
    // Fetch when component mounts
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch: ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []); // empty array = run once on mount

  // Render each state
  if (loading) return <p>Loading users...</p>;
  if (error)   return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name} — {user.email}</li>
      ))}
    </ul>
  );
}`,
    },
    {
      type: 'heading',
      content: '2. Async Functions in React.useEffect',
    },
    {
      type: 'example',
      title: 'You cannot make React.useEffect async — use an inner async function',
      content: 'React.useEffect cannot be an async function because React expects it to return either nothing or a cleanup function. The solution is to define an async function inside React.useEffect and call it immediately.',
      language: 'jsx',
      code: `// ❌ Wrong — React.useEffect itself cannot be async
React.useEffect(async () => {
  const data = await fetch('/api/posts').then(r => r.json());
  setPosts(data);
}, []);

// ✅ Correct — define async function inside and call it
React.useEffect(() => {
  async function fetchPosts() {
    try {
      setLoading(true);
      const response = await fetch('/api/posts');
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);  // always run whether success or error
    }
  }

  fetchPosts(); // Call it immediately
}, []);

// Alternative: extract to a named function outside the effect
async function fetchPosts() {
  const data = await fetch('/api/posts').then(r => r.json());
  return data;
}

React.useEffect(() => {
  fetchPosts().then(setPosts).catch(e => setError(e.message));
}, []);`,
    },
    {
      type: 'heading',
      content: '3. Cleanup on Unmount',
    },
    {
      type: 'example',
      title: 'Cancel stale requests to prevent state updates on unmounted components',
      content: 'If the user navigates away before a fetch completes, the component unmounts. When the fetch finally resolves, it tries to call setState on an unmounted component. Use a cleanup flag or AbortController to prevent this.',
      language: 'jsx',
      code: `// React hooks available via React.React.useState, React.React.useEffect etc.
function UserProfile({ userId }) {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    // Method 1: boolean flag
    let cancelled = false;

    async function fetchUser() {
      const data = await fetch('/api/users/' + userId).then(r => r.json());
      if (!cancelled) {  // only update state if still mounted
        setUser(data);
      }
    }

    fetchUser();
    return () => { cancelled = true; }; // cleanup
  }, [userId]);

  // Method 2: AbortController (more modern, also cancels the network request)
  React.useEffect(() => {
    const controller = new AbortController();

    async function fetchUser() {
      try {
        const data = await fetch('/api/users/' + userId, {
          signal: controller.signal  // attach the abort signal
        }).then(r => r.json());
        setUser(data);
      } catch (err) {
        if (err.name === 'AbortError') return; // ignore abort
        console.error(err);
      }
    }

    fetchUser();
    return () => controller.abort(); // cancel the request on unmount
  }, [userId]);

  return user ? <div>{user.name}</div> : <p>Loading...</p>;
}`,
    },
    {
      type: 'heading',
      content: '4. Parallel Requests with Promise.all',
    },
    {
      type: 'example',
      title: 'Fetch multiple resources simultaneously',
      content: 'When you need data from multiple endpoints, fetch them in parallel with Promise.all instead of sequentially. Parallel fetching is much faster — the total time is the slowest request, not the sum of all requests.',
      language: 'jsx',
      code: `// React hooks available via React.React.useState, React.React.useEffect etc.
function Dashboard() {
  const [data, setData]     = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchAll() {
      // Fetch all three simultaneously — not one after another
      const [users, posts, comments] = await Promise.all([
        fetch('/api/users').then(r => r.json()),
        fetch('/api/posts').then(r => r.json()),
        fetch('/api/comments').then(r => r.json()),
      ]);

      setData({ users, posts, comments });
      setLoading(false);
    }

    fetchAll().catch(console.error);
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      <p>{data.users.length} users</p>
      <p>{data.posts.length} posts</p>
      <p>{data.comments.length} comments</p>
    </div>
  );
}

// Promise.allSettled — continues even if some requests fail
const results = await Promise.allSettled([
  fetch('/api/critical').then(r => r.json()),
  fetch('/api/optional').then(r => r.json()),
]);

results.forEach(result => {
  if (result.status === 'fulfilled') console.log(result.value);
  else console.error('Failed:', result.reason);
});`,
    },
    {
      type: 'tryit',
      title: 'Try It: Fetching Posts from JSONPlaceholder',
      css: `body { font-family: system-ui, sans-serif; padding: 16px; background: #f8fafc; }
.card { background: white; border-radius: 10px; padding: 16px; margin-bottom: 10px; box-shadow: 0 2px 6px rgba(0,0,0,.06); }
h2 { margin: 0 0 16px; font-size: 16px; color: #1e293b; }
.post { border-left: 3px solid #2563eb; padding: 10px 14px; margin-bottom: 8px; background: #f8fafc; border-radius: 0 8px 8px 0; }
.post-title { font-weight: 700; font-size: 14px; color: #1e293b; margin-bottom: 4px; }
.post-body { font-size: 13px; color: #64748b; line-height: 1.5; }
.spinner { text-align: center; padding: 30px; color: #64748b; font-size: 14px; }
.error { color: #dc2626; background: #fef2f2; padding: 12px; border-radius: 8px; font-size: 14px; }
button { padding: 8px 16px; background: #2563eb; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px; margin-right: 8px; }
button:hover { background: #1d4ed8; }
button:disabled { background: #93c5fd; cursor: default; }
.user-sel { padding: 8px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 13px; margin-right: 8px; }`,
      jsx: `function App() {
  const [posts, setPosts] = React.React.useState([]);
  const [loading, setLoading] = React.React.useState(false);
  const [error, setError] = React.React.useState(null);
  const [userId, setUserId] = React.React.useState(1);

  async function fetchPosts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts?userId=' + userId + '&_limit=4');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  React.React.useEffect(() => {
    fetchPosts();
  }, [userId]);

  return (
    <div>
      <div className="card">
        <h2>📡 Fetch Posts by User</h2>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <select className="user-sel" value={userId} onChange={e => setUserId(Number(e.target.value))}>
            {[1,2,3,4,5].map(id => <option key={id} value={id}>User {id}</option>)}
          </select>
          <button onClick={fetchPosts} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && <div className="error">Error: {error}</div>}

      {loading ? (
        <div className="spinner">⏳ Fetching posts...</div>
      ) : (
        posts.map(post => (
          <div key={post.id} className="post">
            <div className="post-title">{post.title}</div>
            <div className="post-body">{post.body.slice(0, 80)}...</div>
          </div>
        ))
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);`,
    },
  ],
  exercises: [
    {
      id: 'fetch-1',
      question: 'Why cant you make the React.useEffect callback directly async?',
      type: 'multiple-choice',
      options: [
        'React doesnt support modern JavaScript features',
        'Async functions return a Promise, but React.useEffect expects a cleanup function or nothing',
        'Fetch API is not compatible with async/await',
        'It would cause an infinite loop',
      ],
      correct: 1,
      explanation: 'React.useEffect expects its callback to return either nothing or a cleanup function (synchronous). Async functions implicitly return a Promise. React would receive the Promise as a "cleanup function" and try to call it, which would fail. The fix is an inner async function: React.useEffect(() => { async function fetchData() { ... } fetchData(); }, []);',
    },
    {
      id: 'fetch-2',
      question: 'What does Promise.all do differently from sequential awaits?',
      type: 'multiple-choice',
      options: [
        'Nothing — they work identically',
        'Promise.all runs all requests in parallel; sequential awaits wait for each one before starting the next',
        'Promise.all is synchronous; sequential awaits are asynchronous',
        'Promise.all only works with fetch; sequential awaits work with any Promise',
      ],
      correct: 1,
      explanation: 'Sequential awaits run one after another — the second request doesnt start until the first finishes. Promise.all starts all requests simultaneously and waits for all to complete. For 3 requests of 300ms each: sequential = 900ms, Promise.all = 300ms.',
    },
  ],
  quiz: [
    {
      id: 'rfetchq1',
      question: 'What happens if you forget to add cleanup in React.useEffect when fetching data?',
      options: [
        'The fetch request is cancelled automatically',
        'Nothing — cleanup is only needed for subscriptions',
        'If the component unmounts before the fetch finishes, the callback still runs and tries to update state on an unmounted component',
        'React throws an error immediately',
      ],
      correct: 2,
      explanation: 'Without cleanup, if the user navigates away (unmounting the component) before the fetch completes, the fetch eventually resolves and the .then() callback runs — trying to call setState on an unmounted component. This causes a warning and potential bugs. Use a cancellation flag or AbortController to prevent it.',
    },
  ],
};
