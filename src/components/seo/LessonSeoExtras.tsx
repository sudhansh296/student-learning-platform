import Link from 'next/link';
import { guidesForLesson, lessonJsonLd, relatedLessons } from '@/lib/seo';
import { GuideLinks } from '@/components/seo/GuideLinks';

/** Structured data + "keep learning" links under a lesson. Server component, rendered by the lesson route pages. */
export function LessonSeoExtras({ courseId, lesson }: { courseId: string; lesson: { slug: string; title: string; description?: string } }) {
  const related = relatedLessons(courseId, lesson.slug);
  const guides = guidesForLesson(courseId, lesson.slug);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(lessonJsonLd(courseId, lesson)).replace(/</g, '\\u003c') }} />
      {related.length > 0 && (
        <nav aria-label="Related lessons" className="max-w-screen-xl mx-auto px-4 lg:px-6 pb-12">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text)' }}>Keep learning</h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="block h-full rounded-xl p-4 transition-colors hover:border-blue-400"
                  style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#2563eb' }}>{r.course}</span>
                  <p className="text-sm font-semibold mt-1" style={{ color: 'var(--text)' }}>{r.title}</p>
                  {r.description && <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-3)' }}>{r.description}</p>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {guides.length > 0 && (
        <section className="max-w-screen-xl mx-auto px-4 lg:px-6 pb-12">
          <div className="rounded-2xl p-5 sm:p-6" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
            <GuideLinks title="Cheat sheets, roadmaps and interview questions" links={guides} />
          </div>
        </section>
      )}
    </>
  );
}
