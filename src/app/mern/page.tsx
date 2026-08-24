import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Database, Server, Palette, Zap, CheckCircle2, BookOpen, Code2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'MERN Stack Development | WebDevAtlas',
  description: 'Master full-stack web development with MongoDB, Express.js, React, and Node.js. Complete guide to building modern web applications.',
};

const mernTechnologies = [
  {
    name: 'MongoDB',
    icon: '🍃',
    color: '#10b981',
    bg: '#d1fae5',
    href: '/learn/mongodb',
    description: 'NoSQL database for flexible, scalable data storage',
    features: [
      'Document-based storage',
      'Flexible schema design',
      'Powerful query language',
      'Horizontal scalability',
    ],
  },
  {
    name: 'Express.js',
    icon: '⚡',
    color: '#6366f1',
    bg: '#e0e7ff',
    href: '/learn/express',
    description: 'Fast, minimalist web framework for Node.js',
    features: [
      'Lightweight & flexible',
      'Middleware architecture',
      'RESTful API design',
      'Robust routing system',
    ],
  },
  {
    name: 'React',
    icon: '⚛️',
    color: '#06b6d4',
    bg: '#cffafe',
    href: '/learn/react',
    description: 'Component-based library for building user interfaces',
    features: [
      'Component reusability',
      'Virtual DOM performance',
      'Rich ecosystem & tools',
      'Declarative UI development',
    ],
  },
  {
    name: 'Node.js',
    icon: '💚',
    color: '#22c55e',
    bg: '#dcfce7',
    href: '/learn/nodejs',
    description: 'JavaScript runtime built on Chrome\'s V8 engine',
    features: [
      'Event-driven architecture',
      'Non-blocking I/O',
      'NPM package ecosystem',
      'Full-stack JavaScript',
    ],
  },
];

const learningPath = [
  {
    phase: 'Foundation',
    duration: '2-3 weeks',
    topics: ['JavaScript ES6+', 'Async Programming', 'HTTP & REST APIs'],
  },
  {
    phase: 'Frontend',
    duration: '3-4 weeks',
    topics: ['React Basics', 'Hooks & State', 'Component Design', 'API Integration'],
  },
  {
    phase: 'Backend',
    duration: '3-4 weeks',
    topics: ['Node.js Fundamentals', 'Express Server', 'RESTful APIs', 'Authentication'],
  },
  {
    phase: 'Database',
    duration: '2-3 weeks',
    topics: ['MongoDB Setup', 'CRUD Operations', 'Data Modeling', 'Aggregation'],
  },
  {
    phase: 'Integration',
    duration: '2-3 weeks',
    topics: ['Full-Stack Apps', 'Deployment', 'Testing', 'Best Practices'],
  },
];

const projects = [
  {
    title: 'Task Manager',
    level: 'Beginner',
    description: 'Build a full-stack to-do app with user authentication',
    color: '#10b981',
  },
  {
    title: 'Blog Platform',
    level: 'Intermediate',
    description: 'Create a blogging system with comments and rich text editor',
    color: '#6366f1',
  },
  {
    title: 'E-commerce Store',
    level: 'Advanced',
    description: 'Develop a complete online store with payment integration',
    color: '#f59e0b',
  },
];

export default function MernPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative max-w-screen-xl mx-auto px-4 lg:px-6 py-16 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <Zap className="w-4 h-4 text-white" />
              <span className="text-sm font-bold text-white">Full-Stack Development</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Master the MERN Stack
            </h1>
            <p className="text-lg lg:text-xl text-white/90 mb-8 leading-relaxed">
              Build modern, scalable web applications using MongoDB, Express.js, React, and Node.js. 
              Learn the most popular JavaScript full-stack combination used by companies worldwide.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#technologies"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
              >
                <BookOpen className="w-4 h-4" />
                Start Learning
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-sm hover:bg-white/20 transition-all border-2 border-white/30"
              >
                <Code2 className="w-4 h-4" />
                View Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What is MERN */}
      <section className="max-w-screen-xl mx-auto px-4 lg:px-6 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-extrabold mb-4" style={{ color: 'var(--text)' }}>
            What is the MERN Stack?
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-2)' }}>
            MERN is a powerful combination of four technologies that work together seamlessly to build 
            full-stack web applications using JavaScript from front to back.
          </p>
        </div>

        {/* Technologies Grid */}
        <div id="technologies" className="grid md:grid-cols-2 gap-6 mb-16">
          {mernTechnologies.map((tech, idx) => (
            <Link
              key={tech.name}
              href={tech.href}
              className="group p-6 rounded-2xl transition-all hover:shadow-xl"
              style={{ 
                background: 'var(--card)', 
                border: '1px solid var(--line)',
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform"
                  style={{ background: tech.bg }}
                >
                  {tech.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-emerald-600 transition-colors" style={{ color: 'var(--text)' }}>
                    {tech.name}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                    {tech.description}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: tech.color }} />
              </div>
              <ul className="space-y-2">
                {tech.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-2)' }}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: tech.color }} />
                    {feature}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>

        {/* Why MERN */}
        <div className="grid lg:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
              <Code2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>
              JavaScript Everywhere
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>
              Write both frontend and backend code in JavaScript. One language, one syntax, full-stack power.
            </p>
          </div>
          <div className="p-6 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>
              High Performance
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>
              Non-blocking architecture and virtual DOM ensure fast, responsive applications at scale.
            </p>
          </div>
          <div className="p-6 rounded-2xl" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>
              JSON All the Way
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>
              Seamless data flow from database to frontend using JSON, reducing complexity and errors.
            </p>
          </div>
        </div>

        {/* Learning Path */}
        <div className="mb-16">
          <h2 className="text-3xl font-extrabold mb-8 text-center" style={{ color: 'var(--text)' }}>
            Your Learning Roadmap
          </h2>
          <div className="grid md:grid-cols-5 gap-4">
            {learningPath.map((phase, idx) => (
              <div
                key={phase.phase}
                className="p-5 rounded-xl relative"
                style={{ background: 'var(--card)', border: '2px solid var(--line)' }}
              >
                <div className="absolute -top-3 left-4 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold">
                  {idx + 1}
                </div>
                <h3 className="text-lg font-bold mb-1 mt-2" style={{ color: 'var(--text)' }}>
                  {phase.phase}
                </h3>
                <p className="text-xs mb-3" style={{ color: 'var(--text-3)' }}>
                  {phase.duration}
                </p>
                <ul className="space-y-1.5">
                  {phase.topics.map((topic) => (
                    <li key={topic} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--text-2)' }}>
                      <CheckCircle2 className="w-3 h-3 shrink-0 mt-0.5 text-emerald-500" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div>
          <h2 className="text-3xl font-extrabold mb-8 text-center" style={{ color: 'var(--text)' }}>
            Build Real Projects
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {projects.map((project) => (
              <div
                key={project.title}
                className="p-6 rounded-xl"
                style={{ background: 'var(--card)', border: '1px solid var(--line)' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full text-white"
                    style={{ background: project.color }}
                  >
                    {project.level}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>
                  {project.title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                  {project.description}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all"
            >
              View All Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
