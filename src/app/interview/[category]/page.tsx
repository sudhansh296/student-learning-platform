import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { interviewCategories, getQuestionsByCategory } from '@/data/interview';
import InterviewQuestionList from '@/components/interview/InterviewQuestionList';

type Props = {
  params: { category: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categoryId } = await params;
  const category = interviewCategories.find(c => c.id === categoryId);
  
  if (!category) {
    return {
      title: 'Category Not Found | WebDevAtlas',
    };
  }

  return {
    title: `${category.name} Interview Questions | WebDevAtlas`,
    description: `Prepare for ${category.name} interviews. ${category.description}`,
  };
}

export async function generateStaticParams() {
  return interviewCategories.map((category) => ({
    category: category.id,
  }));
}

export default async function CategoryPage({ params }: Props) {
  const { category: categoryId } = await params;
  const category = interviewCategories.find(c => c.id === categoryId);
  
  if (!category) {
    notFound();
  }

  const questions = getQuestionsByCategory(categoryId);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-12">
        {/* Back Link */}
        <Link
          href="/interview"
          className="inline-flex items-center gap-2 mb-6 text-sm font-medium hover:gap-3 transition-all"
          style={{ color: 'var(--text-2)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Interview Prep
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
              style={{ background: category.bgColor }}
            >
              {category.icon}
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold mb-2" style={{ color: 'var(--text)' }}>
                {category.name} Interview
              </h1>
              <p className="text-base" style={{ color: 'var(--text-2)' }}>
                {category.description}
              </p>
            </div>
          </div>
          
          {questions.length > 0 && (
            <div className="flex items-center gap-3 mt-6">
              <span
                className="text-sm font-semibold px-4 py-2 rounded-lg"
                style={{ background: category.bgColor, color: category.color }}
              >
                {questions.length} question{questions.length !== 1 ? 's' : ''}
              </span>
              <span className="text-sm" style={{ color: 'var(--text-3)' }}>
                •
              </span>
              <span className="text-sm" style={{ color: 'var(--text-2)' }}>
                {questions.filter(q => q.difficulty === 'beginner').length} beginner, {' '}
                {questions.filter(q => q.difficulty === 'intermediate').length} intermediate, {' '}
                {questions.filter(q => q.difficulty === 'advanced').length} advanced
              </span>
            </div>
          )}
        </div>

        {/* Questions */}
        {questions.length > 0 ? (
          <InterviewQuestionList questions={questions} />
        ) : (
          <div className="text-center py-16 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--line)' }}>
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl" style={{ background: category.bgColor }}>
              {category.icon}
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
              Questions Coming Soon
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>
              {category.name} interview questions are being prepared
            </p>
            <Link
              href="/interview"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors"
            >
              Browse Other Topics
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
