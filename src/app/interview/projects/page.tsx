import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Briefcase, CheckCircle2, AlertTriangle, Lightbulb, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Project Interview Prep | WebDevAtlas',
  description: 'Learn to explain your projects confidently in technical interviews',
};

const projectTemplate = {
  steps: [
    {
      label: '1. One-Sentence Summary',
      icon: '🎯',
      description: 'State what the project does and who it\'s for in a single sentence.',
      example: '"I built a full-stack task management app for small teams to track work without the complexity of Jira."',
      tip: 'If you can\'t explain it in one sentence, you don\'t understand it well enough yet.',
    },
    {
      label: '2. Problem It Solves',
      icon: '🔍',
      description: 'Why does this project exist? What pain point does it address?',
      example: '"I noticed my team was using Google Sheets to track tasks, which made it hard to see who was blocked and what was overdue."',
      tip: 'Problem-first explanations are more compelling than feature lists.',
    },
    {
      label: '3. Your Specific Role',
      icon: '👤',
      description: 'What did YOU build? Use "I" not "we". Be specific about your contribution.',
      example: '"I was the sole developer — I designed the database schema, built the REST API with Node.js, and built the React frontend."',
      tip: 'Interviewers need to know your contribution, not just the project scope.',
    },
    {
      label: '4. Tech Stack & Why',
      icon: '⚙️',
      description: 'Name the technologies and briefly justify each choice.',
      example: '"I used React for the UI because component reusability was critical for the many different task card states. MongoDB for flexible document storage since tasks have varying attributes."',
      tip: 'Don\'t just list tech. "I used React because it\'s popular" shows no judgment.',
    },
    {
      label: '5. Biggest Challenge',
      icon: '⚡',
      description: 'The most interesting technical problem you solved. This is what sets you apart.',
      example: '"The hardest part was real-time updates. When one user marks a task complete, other users should see it instantly. I implemented WebSockets with Socket.IO and learned about managing connection state."',
      tip: 'This is the most important part. Show your problem-solving depth here.',
    },
    {
      label: '6. Outcome & Impact',
      icon: '📈',
      description: 'What happened? Numbers, users, performance improvements.',
      example: '"The app is deployed on Vercel, used by 2 teams (about 15 people). It reduced our weekly status meeting from 45 minutes to 15 minutes."',
      tip: 'Even small numbers are better than no numbers. Estimate if needed.',
    },
    {
      label: '7. What You\'d Improve',
      icon: '🔮',
      description: 'Honest reflection on what you\'d do differently shows engineering maturity.',
      example: '"Looking back, I\'d add proper test coverage from the start. I ended up spending a day debugging a regression that a unit test would have caught immediately."',
      tip: 'This shows you reflect on your work. It\'s a strength, not weakness.',
    },
  ],
};

const commonQuestions = [
  {
    q: 'Tell me about your most impressive project.',
    guidance: 'Use the 7-step framework above. Focus on the challenge section — that\'s where you demonstrate real engineering. Aim for 3-4 minutes, then invite follow-up questions.',
    redFlag: 'Just listing features without explaining problems solved or decisions made.',
  },
  {
    q: 'Why did you choose that tech stack?',
    guidance: 'Explain constraints (team familiarity, project requirements, time) then justify the fit. Show you considered alternatives. "I considered PostgreSQL but chose MongoDB because the schema was evolving weekly during development."',
    redFlag: 'Saying "because it\'s popular" or "because I know it" without connecting to project needs.',
  },
  {
    q: 'What was the hardest bug you fixed?',
    guidance: 'Walk through your debugging process: noticed the symptom → formed a hypothesis → tested it → found root cause → fixed it → learned from it. The process matters as much as the fix.',
    redFlag: 'Vague answers like "there was a bug with the API" with no debugging story.',
  },
  {
    q: 'How would you scale this project to 10x more users?',
    guidance: 'Identify likely bottlenecks (usually the database), then address each: caching with Redis, horizontal scaling behind a load balancer, CDN for static assets, async job queues for heavy operations.',
    redFlag: '"Just add more servers" without identifying what actually breaks at scale.',
  },
  {
    q: 'What would you build next if you continued this project?',
    guidance: 'Shows you think about product and user impact, not just code. Connect it to a real user need you observed. "Users kept asking for mobile notifications, so I\'d add push notifications via Firebase."',
    redFlag: 'Technical features that don\'t connect to user problems ("I\'d add GraphQL").',
  },
  {
    q: 'How did you test this project?',
    guidance: 'Be honest about your testing approach. If limited, acknowledge it and describe what you\'d do with more time. Mention tools you used or would use: Jest, React Testing Library, Cypress for e2e.',
    redFlag: '"I manually tested it" with no mention of what you\'d do better.',
  },
];

const dosDonts = [
  { type: 'do', text: 'Lead with the problem, not the technology' },
  { type: 'do', text: 'Use specific numbers (200 users, 40% faster, 3 months to build)' },
  { type: 'do', text: 'Acknowledge tradeoffs and limitations' },
  { type: 'do', text: 'Show what you learned from challenges' },
  { type: 'do', text: 'Have a live demo or deployed link ready' },
  { type: 'do', text: 'Practice out loud — not just in your head' },
  { type: 'dont', text: 'Recite a feature list without explaining purpose' },
  { type: 'dont', text: 'Say "we" if you were the sole developer' },
  { type: 'dont', text: 'Pretend you know things you looked up during the project' },
  { type: 'dont', text: 'Dismiss simple projects — depth > breadth' },
  { type: 'dont', text: '"I used X because it\'s popular" without context' },
  { type: 'dont', text: 'Talk for 10 minutes without pausing for questions' },
];

const projectIdeas = [
  { name: 'Todo / Task Manager', complexity: 'Beginner', whyGood: 'Shows CRUD, state management, local storage or backend integration', linkHref: '/projects/todo-app' },
  { name: 'Weather App', complexity: 'Beginner', whyGood: 'Demonstrates API integration, async/await, error handling, UI states', linkHref: '/projects/weather-app' },
  { name: 'Calculator', complexity: 'Beginner', whyGood: 'Shows logic, event handling, state management without a backend', linkHref: '/projects/calculator' },
  { name: 'Country Explorer', complexity: 'Intermediate', whyGood: 'REST API, search/filter, routing, responsive design', linkHref: '/projects/country-explorer' },
  { name: 'E-commerce Store', complexity: 'Intermediate', whyGood: 'Cart logic, auth, payments, full-stack depth — high signal', linkHref: '/projects/ecommerce' },
  { name: 'Real-time Chat', complexity: 'Advanced', whyGood: 'WebSockets, authentication, database, live updates — very impressive', linkHref: null },
  { name: 'Blog / CMS', complexity: 'Intermediate', whyGood: 'CRUD, auth, markdown, rich text, image uploads', linkHref: null },
  { name: 'Job Board Clone', complexity: 'Advanced', whyGood: 'Full-stack, search, filters, user roles, real product', linkHref: null },
];

export default function ProjectInterviewPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
        <Link href="/interview" className="inline-flex items-center gap-2 mb-6 text-sm font-medium hover:gap-3 transition-all" style={{ color: 'var(--text-2)' }}>
          <ArrowLeft className="w-4 h-4" />Back to Interview Prep
        </Link>

        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold" style={{ color: 'var(--text)' }}>Project Interview Prep</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>
                How to explain your projects confidently and impress any interviewer
              </p>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-xl" style={{ background: '#F5F3FF', border: '1px solid #DDD6FE' }}>
            <p className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed">
              💡 <strong>Project interviews reveal more than code quality.</strong> They show how you think, communicate, make decisions, and learn from challenges. A &quot;simple&quot; project explained with depth beats a complex project you can&apos;t articulate. The 7-step framework below works for every project.
            </p>
          </div>
        </div>

        {/* 7-Step Framework */}
        <section className="mb-12">
          <h2 className="text-xl font-extrabold mb-2" style={{ color: 'var(--text)' }}>The 7-Step Framework</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>
            Use this structure for every project explanation. Aim for 3–4 minutes, then invite follow-up questions.
          </p>
          <div className="space-y-4">
            {projectTemplate.steps.map((step) => (
              <div key={step.label} className="p-5 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
                <div className="flex items-start gap-4">
                  <span className="text-2xl shrink-0">{step.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold mb-1" style={{ color: 'var(--text)' }}>{step.label}</h3>
                    <p className="text-sm mb-3" style={{ color: 'var(--text-2)' }}>{step.description}</p>
                    <div className="p-3 rounded-lg mb-3" style={{ background: 'var(--bg-section)' }}>
                      <p className="text-sm italic" style={{ color: 'var(--text)' }}>{step.example}</p>
                    </div>
                    <p className="text-xs flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400">
                      <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                      {step.tip}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dos and Don'ts */}
        <section className="mb-12">
          <h2 className="text-xl font-extrabold mb-6" style={{ color: 'var(--text)' }}>Dos & Don'ts</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <h3 className="font-bold mb-3 flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-4 h-4" />Do This
              </h3>
              <ul className="space-y-2">
                {dosDonts.filter(d => d.type === 'do').map((item) => (
                  <li key={item.text} className="flex items-start gap-2 text-sm text-green-800 dark:text-green-300">
                    <span className="shrink-0">✅</span>{item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 rounded-xl" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
              <h3 className="font-bold mb-3 flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4" />Avoid This
              </h3>
              <ul className="space-y-2">
                {dosDonts.filter(d => d.type === 'dont').map((item) => (
                  <li key={item.text} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                    <span className="shrink-0">❌</span>{item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Common Questions */}
        <section className="mb-12">
          <h2 className="text-xl font-extrabold mb-2" style={{ color: 'var(--text)' }}>Common Project Interview Questions</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>Prepare specific answers for these before every interview.</p>
          <div className="space-y-4">
            {commonQuestions.map((item) => (
              <div key={item.q} className="p-5 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
                <h3 className="font-bold mb-3" style={{ color: 'var(--text)' }}>❓ {item.q}</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg" style={{ background: 'var(--bg-section)' }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-1 text-green-600 dark:text-green-400">How to answer</p>
                    <p className="text-sm" style={{ color: 'var(--text-2)' }}>{item.guidance}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <p className="text-xs font-bold uppercase tracking-wider mb-1 text-red-600 dark:text-red-400">🚩 Red flag answer</p>
                    <p className="text-sm text-red-700 dark:text-red-300">{item.redFlag}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Project Ideas */}
        <section className="mb-12">
          <h2 className="text-xl font-extrabold mb-2" style={{ color: 'var(--text)' }}>Good Portfolio Projects</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>
            3–5 polished projects beat 10 half-finished ones. Each should be deployed with a live link and source code on GitHub.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {projectIdeas.map((project) => (
              <div key={project.name} className="p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>{project.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    project.complexity === 'Beginner' ? 'bg-green-100 text-green-700' :
                    project.complexity === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700'}`}>
                    {project.complexity}
                  </span>
                </div>
                <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-2)' }}>{project.whyGood}</p>
                {project.linkHref && (
                  <Link href={project.linkHref} className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                    View project guide <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Practice CTA */}
        <div className="p-6 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
          <h3 className="font-bold mb-2" style={{ color: 'var(--text)' }}>Practice Makes Perfect</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-2)' }}>
            Use the framework above to write out your project explanation for each portfolio project. Then practice saying it aloud — record yourself if possible. The goal is natural confidence, not a scripted monologue.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/projects" className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors">
              <Briefcase className="w-4 h-4" />View Sample Projects
            </Link>
            <Link href="/interview/practice" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors" style={{ background: 'var(--bg-section)', color: 'var(--text)' }}>
              Practice Questions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
