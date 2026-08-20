export const roadmaps = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    slug: 'frontend',
    description: 'Complete path from zero to professional frontend developer.',
    difficulty: 'beginner' as const,
    estimatedTime: '6-9 months',
    color: '#3B82F6',
    icon: '🖥️',
    steps: [
      { phase: 'Foundation', items: ['HTML', 'CSS', 'Basic JavaScript'], color: '#10B981' },
      { phase: 'Intermediate', items: ['CSS Flexbox & Grid', 'DOM Manipulation', 'Fetch API', 'Responsive Design'], color: '#3B82F6' },
      { phase: 'Modern JS', items: ['ES6+', 'Modules', 'Async/Await', 'TypeScript Basics'], color: '#8B5CF6' },
      { phase: 'Framework', items: ['React or Vue', 'State Management', 'React Hooks'], color: '#EC4899' },
      { phase: 'Production', items: ['Next.js', 'Testing', 'Performance', 'Deployment'], color: '#F59E0B' },
    ]
  },
  {
    id: 'javascript',
    title: 'JavaScript Developer',
    slug: 'javascript',
    description: 'Master JavaScript from basics to advanced concepts.',
    difficulty: 'beginner' as const,
    estimatedTime: '3-6 months',
    color: '#F59E0B',
    icon: '⚡',
    steps: [
      { phase: 'Basics', items: ['Variables & Types', 'Functions', 'Arrays & Objects', 'Loops'], color: '#10B981' },
      { phase: 'Intermediate', items: ['Scope & Closures', 'DOM API', 'Events', 'Fetch & APIs'], color: '#3B82F6' },
      { phase: 'Async JS', items: ['Callbacks', 'Promises', 'Async/Await', 'Event Loop'], color: '#8B5CF6' },
      { phase: 'Advanced', items: ['Prototypes', 'Classes', 'Generators', 'Design Patterns'], color: '#EC4899' },
      { phase: 'Ecosystem', items: ['Node.js', 'npm', 'Build Tools', 'TypeScript'], color: '#F59E0B' },
    ]
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    slug: 'backend',
    description: 'Build servers, APIs, and databases for the web.',
    difficulty: 'intermediate' as const,
    estimatedTime: '6-12 months',
    color: '#10B981',
    icon: '⚙️',
    steps: [
      { phase: 'Fundamentals', items: ['HTTP & Networking', 'Node.js', 'npm & Modules'], color: '#10B981' },
      { phase: 'API Building', items: ['Express.js', 'REST APIs', 'Middleware', 'Auth/JWT'], color: '#3B82F6' },
      { phase: 'Databases', items: ['SQL & PostgreSQL', 'MongoDB', 'Redis', 'ORM Tools'], color: '#8B5CF6' },
      { phase: 'Advanced', items: ['Caching', 'Queues', 'WebSockets', 'Microservices'], color: '#EC4899' },
      { phase: 'DevOps', items: ['Docker', 'CI/CD', 'Cloud Deploy', 'Monitoring'], color: '#F59E0B' },
    ]
  },
  {
    id: 'fullstack',
    title: 'Full Stack Developer',
    slug: 'fullstack',
    description: 'Master both frontend and backend development.',
    difficulty: 'intermediate' as const,
    estimatedTime: '12-18 months',
    color: '#8B5CF6',
    icon: '🚀',
    steps: [
      { phase: 'Web Basics', items: ['HTML', 'CSS', 'JavaScript'], color: '#10B981' },
      { phase: 'Frontend', items: ['React', 'State Management', 'TypeScript'], color: '#3B82F6' },
      { phase: 'Backend', items: ['Node.js', 'Express', 'REST APIs'], color: '#8B5CF6' },
      { phase: 'Database', items: ['PostgreSQL', 'MongoDB', 'ORM'], color: '#EC4899' },
      { phase: 'Production', items: ['Next.js', 'Docker', 'Cloud', 'CI/CD'], color: '#F59E0B' },
    ]
  }
];
