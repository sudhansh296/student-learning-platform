import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Users, CheckCircle2, AlertTriangle, Lightbulb, MessageCircle, Star } from 'lucide-react';
import { getQuestionsByCategory } from '@/data/interview';
import InterviewQuestionList from '@/components/interview/InterviewQuestionList';

export const metadata: Metadata = {
  title: 'HR Interview Preparation | WebDevAtlas',
  description: 'Master behavioral and HR interview questions with STAR method, salary negotiation, and communication tips',
};

const starMethod = {
  title: 'The STAR Method',
  description: '85% of companies use behavioral interviews. STAR gives you a proven structure for every "Tell me about a time..." question.',
  steps: [
    { letter: 'S', word: 'Situation', desc: 'Set the scene briefly (30 seconds). Who, what, where, when.', example: '"In my second year at XYZ, our team had to migrate a legacy codebase to React before a tight deadline..."' },
    { letter: 'T', word: 'Task', desc: 'What was your responsibility? What needed to happen?', example: '"I was responsible for architecting the migration plan and leading a team of 3 developers..."' },
    { letter: 'A', word: 'Action', desc: 'What specific steps did YOU take? Use "I", not "we". (This is 60% of your answer)', example: '"First, I broke the migration into phases. I created a shared component library, set up CI/CD, trained the team on React hooks, and held daily 15-min standups to unblock issues..."' },
    { letter: 'R', word: 'Result', desc: 'What was the measurable outcome? What did you learn?', example: '"We launched 2 weeks early. Page load improved by 40%. I learned that incremental migration is safer than a big-bang rewrite..."' },
  ],
};

const dosDonts = [
  { type: 'do', items: [
    'Research the company for 30 min before every interview',
    'Prepare 5-6 STAR stories covering different themes',
    'Practice answers aloud — not just in your head',
    'Have quantified results ("30% faster", "200 users", "3 months")',
    'Send a thank-you email within 24 hours',
    'Ask thoughtful questions about the role and team',
    'Be honest about what you don\'t know',
    'Match your answer length to the question — be concise',
  ]},
  { type: 'dont', items: [
    'Badmouth your current or previous employer',
    'Lie about skills or experience',
    'Check your phone or look distracted',
    'Give one-word answers to behavioral questions',
    'Say "we" when asked what YOU did',
    'Accept an offer on the spot — it\'s okay to ask for time',
    'Skip negotiation — first offers are almost always negotiable',
    'Over-share personal information',
  ]},
];

const prepChecklist = [
  { when: '1 Week Before', tasks: ['Research company, products, recent news', 'Review job description and map your skills', 'Prepare 5-6 STAR stories (challenge, conflict, failure, leadership, collaboration, success)', 'Research salary range on Glassdoor/Levels.fyi'] },
  { when: '1 Day Before', tasks: ['Review your resume and project explanations', 'Practice top 5 behavioral questions out loud', 'Prepare 5 questions to ask the interviewer', 'Plan your route / test your video setup'] },
  { when: 'Morning Of', tasks: ['Review company mission and values', 'Do a quick practice of your "tell me about yourself"', 'Arrive 10 min early / log in 5 min early', 'Have water, notebook, and pen ready'] },
  { when: 'After the Interview', tasks: ['Send thank-you email within 24 hours', 'Note what questions you struggled with', 'Follow up after stated decision timeline', 'Negotiate the offer — always negotiate'] },
];

export default function HRInterviewPage() {
  const questions = getQuestionsByCategory('hr');

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
        <Link href="/interview" className="inline-flex items-center gap-2 mb-6 text-sm font-medium hover:gap-3 transition-all" style={{ color: 'var(--text-2)' }}>
          <ArrowLeft className="w-4 h-4" /> Back to Interview Prep
        </Link>

        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-pink-100 dark:bg-pink-900/40 flex items-center justify-center shrink-0">
              <Users className="w-7 h-7 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold" style={{ color: 'var(--text)' }}>HR Interview Preparation</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>
                Behavioral questions, STAR method, salary negotiation, and communication strategies
              </p>
            </div>
          </div>
          <div className="mt-5 p-4 rounded-xl" style={{ background: '#FDF2F8', border: '1px solid #F9A8D4' }}>
            <p className="text-sm text-pink-800 leading-relaxed">
              💡 <strong>Technical skills get you an interview. Soft skills get you the job.</strong> HR rounds evaluate communication, self-awareness, cultural fit, and how you handle challenges. These aren&apos;t trick questions — they&apos;re looking for self-awareness, ownership, and growth mindset.
            </p>
          </div>
        </div>

        {/* STAR Method */}
        <section className="mb-12">
          <h2 className="text-xl font-extrabold mb-2" style={{ color: 'var(--text)' }}>The STAR Method</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>
            Structure every behavioral answer with STAR. It makes your answers clear, credible, and memorable.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {starMethod.steps.map((step) => (
              <div key={step.letter} className="p-5 rounded-xl flex gap-4" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
                <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center shrink-0">
                  <span className="font-extrabold text-lg text-pink-600">{step.letter}</span>
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: 'var(--text)' }}>{step.word}</h3>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-2)' }}>{step.desc}</p>
                  <div className="p-3 rounded-lg" style={{ background: 'var(--bg-section)' }}>
                    <p className="text-xs italic" style={{ color: 'var(--text-3)' }}>{step.example}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dos and Don'ts */}
        <section className="mb-12">
          <h2 className="text-xl font-extrabold mb-6" style={{ color: 'var(--text)' }}>HR Interview Dos &amp; Don&apos;ts</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <h3 className="font-bold mb-3 flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-4 h-4" /> Always Do These
              </h3>
              <ul className="space-y-2">
                {dosDonts[0].items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-green-800">
                    <span className="shrink-0">✅</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 rounded-xl" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
              <h3 className="font-bold mb-3 flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4" /> Never Do These
              </h3>
              <ul className="space-y-2">
                {dosDonts[1].items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-red-700">
                    <span className="shrink-0">❌</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Prep Checklist */}
        <section className="mb-12">
          <h2 className="text-xl font-extrabold mb-6" style={{ color: 'var(--text)' }}>Interview Preparation Checklist</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {prepChecklist.map((phase) => (
              <div key={phase.when} className="p-5 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
                <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text)' }}>
                  <Star className="w-4 h-4 text-yellow-500" />{phase.when}
                </h3>
                <ul className="space-y-1.5">
                  {phase.tasks.map((task) => (
                    <li key={task} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-2)' }}>
                      <span className="shrink-0 mt-0.5 text-indigo-500">◦</span>{task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* All Practice Questions */}
        <section id="practice-questions">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-extrabold" style={{ color: 'var(--text)' }}>
                Practice Questions
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>
                {questions.length} behavioral questions — click to reveal the full answer, examples, and common mistakes
              </p>
            </div>
            <span
              className="text-sm font-semibold px-4 py-2 rounded-lg shrink-0"
              style={{ background: '#FCE7F3', color: '#EC4899' }}
            >
              {questions.length} questions
            </span>
          </div>

          <InterviewQuestionList questions={questions} />
        </section>

        {/* Mock Interview CTA */}
        <div className="mt-12 p-6 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
          <h3 className="font-bold mb-2" style={{ color: 'var(--text)' }}>Ready for a Mock Interview?</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-2)' }}>
            Mix technical and behavioral questions together to simulate a real interview loop.
          </p>
          <Link
            href="/interview/mock"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
            style={{ background: 'var(--bg-section)', color: 'var(--text)' }}
          >
            Mock Interview →
          </Link>
        </div>
      </div>
    </div>
  );
}
