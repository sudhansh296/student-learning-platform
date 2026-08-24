'use client';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

const mernStack = [
  {
    name: 'MongoDB',
    icon: '🍃',
    color: '#10b981',
    bg: '#d1fae5',
    href: '/learn/mongodb',
    description: 'NoSQL Database',
  },
  {
    name: 'Express.js',
    icon: '⚡',
    color: '#6366f1',
    bg: '#e0e7ff',
    href: '/learn/express',
    description: 'Backend Framework',
  },
  {
    name: 'React',
    icon: '⚛️',
    color: '#06b6d4',
    bg: '#cffafe',
    href: '/learn/react',
    description: 'Frontend Library',
  },
  {
    name: 'Node.js',
    icon: '💚',
    color: '#22c55e',
    bg: '#dcfce7',
    href: '/learn/nodejs',
    description: 'JavaScript Runtime',
  },
];

export function MernSection() {
  return (
    <section className="max-w-screen-xl mx-auto px-4 lg:px-6 py-16">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
          style={{ background: '#d1fae5', border: '1px solid #10b981' }}>
          <Zap className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-bold text-emerald-700">Full-Stack Development</span>
        </div>
        <h2 className="text-3xl lg:text-5xl font-extrabold mb-4" style={{ color: 'var(--text)' }}>
          Master the MERN Stack
        </h2>
        <p className="text-base lg:text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-2)' }}>
          Build modern web applications with MongoDB, Express.js, React, and Node.js. 
          Learn the most popular JavaScript full-stack combination.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {mernStack.map((tech) => (
          <Link
            key={tech.name}
            href={tech.href}
            className="group p-5 rounded-xl transition-all hover:shadow-lg"
            style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
            }}
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform"
              style={{ background: tech.bg }}
            >
              {tech.icon}
            </div>
            <h3 className="text-lg font-bold mb-1 group-hover:text-emerald-600 transition-colors" style={{ color: 'var(--text)' }}>
              {tech.name}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>
              {tech.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/mern"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
        >
          View MERN Guide
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all"
          style={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            color: 'var(--text)',
          }}
        >
          Browse MERN Projects
        </Link>
      </div>
    </section>
  );
}
