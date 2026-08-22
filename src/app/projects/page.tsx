import Link from 'next/link';
import { Clock, ArrowRight, Terminal } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects — Build Real Apps',
  description: 'Project ideas for beginner, intermediate, and advanced developers. Learn by building.',
};

const projects = [
  {
    id: 'todo-app',
    title: 'To-Do List App',
    slug: 'todo-app',
    difficulty: 'beginner',
    estimatedTime: '2–4 hours',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    description: 'Build a functional to-do list with add, complete, and delete features. Store data in localStorage.',
    learnings: ['DOM manipulation', 'Event listeners', 'localStorage API', 'CSS transitions'],
  },
  {
    id: 'weather-app',
    title: 'Weather App',
    slug: 'weather-app',
    difficulty: 'beginner',
    estimatedTime: '3–5 hours',
    technologies: ['HTML', 'CSS', 'JavaScript', 'REST API'],
    description: 'Fetch real-time weather data from an API and display it with a clean UI.',
    learnings: ['Fetch API', 'Async/Await', 'JSON parsing', 'API keys', 'Error handling'],
  },
  {
    id: 'calculator',
    title: 'Scientific Calculator',
    slug: 'calculator',
    difficulty: 'beginner',
    estimatedTime: '3–5 hours',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    description: 'Fully working calculator with Standard, Scientific (sin/cos/tan/log/√), and Programmer (HEX/OCT/BIN) modes. Memory functions, history, and keyboard support.',
    learnings: ['DOM manipulation', 'Math functions', 'Event listeners', 'CSS Grid layout', 'State management'],
    playgroundKey: 'calculator',
  },
  {
    id: 'quiz-app',
    title: 'Quiz App',
    slug: 'quiz-app',
    difficulty: 'beginner',
    estimatedTime: '4–6 hours',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    description: 'A multiple-choice quiz with timer, score tracking, and results screen.',
    learnings: ['State management', 'Timers (setInterval)', 'DOM updates', 'Array methods'],
  },
  {
    id: 'portfolio',
    title: 'Developer Portfolio',
    slug: 'portfolio',
    difficulty: 'beginner',
    estimatedTime: '6–10 hours',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    description: 'A personal portfolio site with projects section, about me, and contact form.',
    learnings: ['Responsive design', 'CSS Grid & Flexbox', 'Animations', 'Semantic HTML'],
  },
  {
    id: 'expense-tracker',
    title: 'Expense Tracker',
    slug: 'expense-tracker',
    difficulty: 'intermediate',
    estimatedTime: '6–8 hours',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    description: 'Track income and expenses, show balance, and visualize spending categories.',
    learnings: ['React state', 'useReducer', 'Component architecture', 'TypeScript interfaces'],
  },
  {
    id: 'blog-platform',
    title: 'Blog Platform',
    slug: 'blog-platform',
    difficulty: 'intermediate',
    estimatedTime: '10–15 hours',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Markdown'],
    description: 'A full blog with article pages, categories, search, and MDX content.',
    learnings: ['Next.js routing', 'Static generation', 'Markdown/MDX', 'SEO metadata'],
  },
  {
    id: 'rest-api',
    title: 'REST API with Node.js',
    slug: 'rest-api',
    difficulty: 'intermediate',
    estimatedTime: '8–12 hours',
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'JWT'],
    description: 'Build a CRUD REST API for a blog with user authentication using JWT.',
    learnings: ['Express routing', 'MongoDB CRUD', 'Middleware', 'JWT authentication', 'Error handling'],
  },
  {
    id: 'country-explorer',
    title: 'Country Explorer',
    slug: 'country-explorer',
    difficulty: 'advanced',
    estimatedTime: '8–12 hours',
    technologies: ['HTML', 'CSS', 'JavaScript', 'REST API'],
    description: 'Fetch 195 countries from a REST API and display them with search, region filter, sort by name/population, and a detail modal showing languages, currencies, and borders.',
    learnings: ['Fetch API + async/await', 'REST API integration', 'Search & filter logic', 'Dynamic card grid', 'Modal UI pattern'],
    playgroundKey: 'fetch',
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Store',
    slug: 'ecommerce',
    difficulty: 'advanced',
    estimatedTime: '30–50 hours',
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
    description: 'Full-featured store with product listings, cart, checkout, and order management.',
    learnings: ['Full-stack Next.js', 'Database design', 'Payment processing', 'Authentication', 'State management'],
  },
  {
    id: 'chat-app',
    title: 'Real-time Chat App',
    slug: 'chat-app',
    difficulty: 'advanced',
    estimatedTime: '20–30 hours',
    technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
    description: 'Real-time group chat with rooms, typing indicators, and message history.',
    learnings: ['WebSockets', 'Socket.io events', 'Real-time state', 'Room management'],
  },
];

const difficultyConfig = {
  beginner: { label: 'Beginner', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border-green-200 dark:border-green-800' },
  intermediate: { label: 'Intermediate', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
  advanced: { label: 'Advanced', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 border-orange-200 dark:border-orange-800' },
};

type Project = typeof projects[0] & { playgroundKey?: string };

export default function ProjectsPage() {
  const grouped = {
    beginner: projects.filter(p => p.difficulty === 'beginner') as Project[],
    intermediate: projects.filter(p => p.difficulty === 'intermediate') as Project[],
    advanced: projects.filter(p => p.difficulty === 'advanced') as Project[],
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-3">Project Ideas</h1>
        <p className="text-muted-foreground max-w-xl leading-relaxed">
          The fastest way to learn is by building. Each project teaches real skills used in professional development.
        </p>
      </div>

      {(Object.entries(grouped) as [keyof typeof grouped, Project[]][]).map(([level, items]) => (
        <section key={level} className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${difficultyConfig[level].color}`}>
              {difficultyConfig[level].label}
            </span>
            <span className="text-xs text-muted-foreground">{items.length} projects</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(project => (
              <div
                key={project.id}
                className="group flex flex-col p-5 rounded-xl border border-border bg-background hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-foreground text-base leading-snug">{project.title}</h3>
                    {project.playgroundKey && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800 whitespace-nowrap">
                        Live
                      </span>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap shrink-0">
                    <Clock className="w-3 h-3" />
                    {project.estimatedTime}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.map(tech => (
                    <span
                      key={tech}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Learnings */}
                <div className="mb-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    You will learn
                  </p>
                  <ul className="space-y-1">
                    {project.learnings.slice(0, 3).map(l => (
                      <li key={l} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="w-1 h-1 rounded-full bg-blue-400 shrink-0" />
                        {l}
                      </li>
                    ))}
                    {project.learnings.length > 3 && (
                      <li className="text-xs text-muted-foreground pl-3">
                        +{project.learnings.length - 3} more
                      </li>
                    )}
                  </ul>
                </div>

                {/* Button — All projects go to detail page first */}
                <Link
                  href={'/projects/' + project.slug}
                  className="mt-auto flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
                >
                  Open Project
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
