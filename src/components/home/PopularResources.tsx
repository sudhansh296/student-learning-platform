import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const resources = [
  { href: '/javascript-practice', icon: '🧩', tag: 'Practice', title: 'JavaScript Practice Questions', desc: '50 exercises from beginner to advanced. Try each one in the editor, then check the solution.', cta: 'Start practising' },
  { href: '/javascript-interview-questions', icon: '⚡', tag: 'Interview', title: 'JavaScript Interview Questions', desc: '92 questions on closures, promises, the event loop and more, with short and detailed answers.', cta: 'Prepare now' },
  { href: '/react-interview-questions', icon: '⚛️', tag: 'Interview', title: 'React Interview Questions', desc: '92 questions on hooks, state, props, performance and advanced patterns, with runnable examples.', cta: 'Prepare now' },
  { href: '/nodejs-interview-questions', icon: '🟢', tag: 'Interview', title: 'Node.js Interview Questions', desc: '85 questions on the event loop, modules, streams, Express, REST APIs and security.', cta: 'Prepare now' },
  { href: '/css-cheatsheet', icon: '🎨', tag: 'Cheat sheet', title: 'CSS Cheat Sheet', desc: 'Selectors, box model, Flexbox, Grid and media queries in one page, with copyable examples.', cta: 'Open cheat sheet' },
  { href: '/frontend-roadmap', icon: '🗺️', tag: 'Roadmap', title: 'Frontend Developer Roadmap', desc: 'A 12-step plan from HTML to React and Next.js, with time estimates, lessons and projects.', cta: 'See the roadmap' },
];

export function PopularResources() {
  return (
    <section className="py-12" style={{ background: 'var(--bg)', borderBottom: '1px solid var(--line)' }}>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6">
        <div className="mb-6">
          <h2 className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>Popular Learning Resources</h2>
          <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-3)' }}>Practice questions, interview prep, cheat sheets and roadmaps students use most</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((r) => (
            <Link key={r.href} href={r.href}
              className="group flex flex-col p-5 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: 'var(--bg-section)', border: '1px solid var(--line)' }}>{r.icon}</span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: 'var(--text-3)' }}>{r.tag}</span>
              </div>
              <h3 className="text-[15px] font-bold mb-1.5" style={{ color: 'var(--text)' }}>{r.title}</h3>
              <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'var(--text-2)' }}>{r.desc}</p>
              <div className="flex items-center gap-1.5 text-[12px] font-bold mt-auto group-hover:gap-3 transition-all" style={{ color: '#2563eb' }}>
                {r.cta} <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
