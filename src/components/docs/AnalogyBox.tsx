import { Sparkles } from 'lucide-react';

interface AnalogyBoxProps {
  title?: string;
  children: string;
}

export function AnalogyBox({ title, children }: AnalogyBoxProps) {
  return (
    <div className="rounded-xl border border-purple-200 dark:border-purple-800/50 bg-purple-50 dark:bg-purple-900/20 p-4 my-5">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300">
          {title || 'In Simple Words'}
        </span>
      </div>
      <p className="text-sm text-purple-900 dark:text-purple-200 leading-relaxed italic">
        &ldquo;{children}&rdquo;
      </p>
    </div>
  );
}
