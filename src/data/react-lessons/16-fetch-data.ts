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
        <li key={user.id}>{user.name} - {user.email}</li>
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
      title: 'You cannot make React.useEffect async - use an inner async function',
      content: 'React.useEffect cannot be an async function because React expects it to return either nothing or a cleanup function. The solution is to define an async function inside React.useEffect and call it immediately.',
      language: 'jsx',
      code: `// ❌ Wrong - React.useEffect itself cannot be async
React.useEffect(async () => {
  const data = await fetch('/api/posts').then(r => r.json());
  setPosts(data);
}, []);

// ✅ Correct - define async function inside and call it
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
      content: 'When you need data from multiple endpoints, fetch them in parallel with Promise.all instead of sequentially. Parallel fetching is much faster - the total time is the slowest request, not the sum of all requests.',
      language: 'jsx',
      code: `// React hooks available via React.React.useState, React.React.useEffect etc.
function Dashboard() {
  const [data, setData]     = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchAll() {
      // Fetch all three simultaneously - not one after another
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

// Promise.allSettled - continues even if some requests fail
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
      title: 'Try It: Hacker News Reader',
      css: `body { font-family: system-ui, sans-serif; padding: 16px; background: #f6f0e8; margin: 0; }
.header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 8px; }
h2 { margin: 0; font-size: 17px; color: #1a1a1a; }
.hn-logo { background: #ff6600; color: white; font-weight: 800; font-size: 13px; padding: 3px 8px; border-radius: 4px; margin-right: 6px; }
.controls { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.tab { padding: 6px 12px; border: 1.5px solid #d4c9b5; border-radius: 6px; background: white; cursor: pointer; font-size: 12px; font-weight: 600; color: #666; }
.tab.active { background: #ff6600; color: white; border-color: #ff6600; }
.story { background: white; border-radius: 10px; padding: 12px 14px; margin-bottom: 8px; border: 1px solid #e8dfd0; }
.story-rank { font-size: 11px; color: #999; font-weight: 700; margin-bottom: 3px; }
.story-title { font-size: 14px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px; line-height: 1.4; cursor: pointer; }
.story-title:hover { color: #ff6600; }
.story-meta { font-size: 11px; color: #888; display: flex; gap: 10px; flex-wrap: wrap; }
.score { color: #ff6600; font-weight: 700; }
.story-url { font-size: 10px; color: #aaa; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 300px; margin-top: 2px; }
.skeleton { background: white; border-radius: 10px; padding: 12px 14px; margin-bottom: 8px; border: 1px solid #e8dfd0; }
.skel-line { background: linear-gradient(90deg,#f0e8dc 25%,#e8dfd0 50%,#f0e8dc 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; height: 14px; margin-bottom: 6px; }
@keyframes shimmer { to { background-position: -200% 0; } }
.error { background: #fff1f0; border: 1px solid #ffccc7; border-radius: 10px; padding: 16px; color: #cf1322; text-align: center; font-size: 13px; }
.load-more { width: 100%; padding: 10px; background: #ff6600; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 13px; margin-top: 4px; }
.load-more:disabled { opacity: .5; cursor: not-allowed; }
.count-label { font-size: 12px; color: #888; text-align: center; padding: 8px 0; }`,
      jsx: `const PAGE_SIZE = 5;

function Skeleton() {
  return (
    <div className="skeleton">
      <div className="skel-line" style={{width:'70%'}} />
      <div className="skel-line" style={{width:'40%',height:10}} />
    </div>
  );
}

function StoryItem({ story, rank }) {
  if (!story) return null;
  const domain = story.url ? new URL(story.url).hostname.replace('www.','') : '';
  return (
    <div className="story">
      <div className="story-rank">#{rank}</div>
      <div className="story-title" onClick={() => story.url && window.open(story.url,'_blank')}>
        {story.title}
      </div>
      {domain && <div className="story-url">{domain}</div>}
      <div className="story-meta">
        <span className="score">▲ {story.score}</span>
        <span>by {story.by}</span>
        <span>💬 {story.descendants || 0} comments</span>
        <span>{new Date(story.time*1000).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

function HackerNews() {
  const [ids, setIds] = React.useState([]);
  const [stories, setStories] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [initialLoad, setInitialLoad] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [page, setPage] = React.useState(0);
  const [feedType, setFeedType] = React.useState('topstories');

  const FEEDS = [
    {key:'topstories',label:'Top'},
    {key:'newstories',label:'New'},
    {key:'beststories',label:'Best'},
  ];

  React.useEffect(() => {
    let cancelled = false;
    setStories([]);
    setPage(0);
    setInitialLoad(true);
    setError(null);

    async function fetchIds() {
      try {
        const res = await fetch('https://hacker-news.firebaseio.com/v0/'+feedType+'.json');
        if (!res.ok) throw new Error('Failed to fetch feed');
        const data = await res.json();
        if (!cancelled) { setIds(data.slice(0,30)); setInitialLoad(false); }
      } catch(e) {
        if (!cancelled) { setError(e.message); setInitialLoad(false); }
      }
    }
    fetchIds();
    return () => { cancelled = true; };
  }, [feedType]);

  React.useEffect(() => {
    if (!ids.length || initialLoad) return;
    const slice = ids.slice(page*PAGE_SIZE, (page+1)*PAGE_SIZE);
    if (!slice.length) return;
    let cancelled = false;
    setLoading(true);

    Promise.all(slice.map(id =>
      fetch('https://hacker-news.firebaseio.com/v0/item/'+id+'.json').then(r=>r.json())
    )).then(items => {
      if (!cancelled) { setStories(prev => [...prev, ...items.filter(Boolean)]); setLoading(false); }
    }).catch(e => {
      if (!cancelled) { setError(e.message); setLoading(false); }
    });

    return () => { cancelled = true; };
  }, [ids, page]);

  const canLoadMore = stories.length < ids.length && !loading;

  return (
    <div>
      <div className="header">
        <div><span className="hn-logo">Y</span><b>Hacker News</b></div>
        <div className="controls">
          {FEEDS.map(f => (
            <button key={f.key} className={"tab"+(feedType===f.key?' active':'')}
              onClick={() => setFeedType(f.key)}>{f.label}</button>
          ))}
        </div>
      </div>

      {error && <div className="error">❌ {error}</div>}

      {initialLoad
        ? Array.from({length:5}).map((_,i) => <Skeleton key={i} />)
        : stories.map((s,i) => <StoryItem key={s.id} story={s} rank={i+1} />)
      }

      {loading && !initialLoad && Array.from({length:3}).map((_,i) => <Skeleton key={'l'+i} />)}

      {!initialLoad && !error && ids.length > 0 && (
        <>
          <div className="count-label">Showing {stories.length} of {ids.length} stories</div>
          <button className="load-more" disabled={!canLoadMore} onClick={() => setPage(p=>p+1)}>
            {canLoadMore ? 'Load More' : loading ? 'Loading...' : 'All loaded'}
          </button>
        </>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<HackerNews />);`,
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
        'Nothing - they work identically',
        'Promise.all runs all requests in parallel; sequential awaits wait for each one before starting the next',
        'Promise.all is synchronous; sequential awaits are asynchronous',
        'Promise.all only works with fetch; sequential awaits work with any Promise',
      ],
      correct: 1,
      explanation: 'Sequential awaits run one after another - the second request doesnt start until the first finishes. Promise.all starts all requests simultaneously and waits for all to complete. For 3 requests of 300ms each: sequential = 900ms, Promise.all = 300ms.',
    },
  ],
  quiz: [
    {
      id: 'rfetchq1',
      question: 'What happens if you forget to add cleanup in React.useEffect when fetching data?',
      options: [
        'The fetch request is cancelled automatically',
        'Nothing - cleanup is only needed for subscriptions',
        'If the component unmounts before the fetch finishes, the callback still runs and tries to update state on an unmounted component',
        'React throws an error immediately',
      ],
      correct: 2,
      explanation: 'Without cleanup, if the user navigates away (unmounting the component) before the fetch completes, the fetch eventually resolves and the .then() callback runs - trying to call setState on an unmounted component. This causes a warning and potential bugs. Use a cancellation flag or AbortController to prevent it.',
    },
  ],
};
