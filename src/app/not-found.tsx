import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-24 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-6">
        <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>
      <h1 className="text-4xl font-extrabold text-foreground mb-3">Page not found</h1>
      <p className="text-muted-foreground max-w-sm leading-relaxed mb-8">
        The page you&apos;re looking for doesn&apos;t exist yet — but there&apos;s plenty to explore.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
        >
          Go home <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/technologies"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-background hover:bg-muted/60 text-sm font-medium text-foreground transition-colors"
        >
          Browse technologies
        </Link>
      </div>
    </div>
  );
}
