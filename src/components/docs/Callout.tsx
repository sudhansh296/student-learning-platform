import { Info, AlertTriangle, Lightbulb, XCircle } from 'lucide-react';
import { ReactNode } from 'react';

interface CalloutProps {
  variant?: 'info' | 'warning' | 'tip' | 'danger';
  title?: string;
  children: ReactNode;
}

const variants = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    icon: <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />,
    titleColor: 'text-blue-800 dark:text-blue-300',
    textColor: 'text-blue-700 dark:text-blue-200',
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />,
    titleColor: 'text-amber-800 dark:text-amber-300',
    textColor: 'text-amber-700 dark:text-amber-200',
  },
  tip: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    icon: <Lightbulb className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />,
    titleColor: 'text-green-800 dark:text-green-300',
    textColor: 'text-green-700 dark:text-green-200',
  },
  danger: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    icon: <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />,
    titleColor: 'text-red-800 dark:text-red-300',
    textColor: 'text-red-700 dark:text-red-200',
  },
};

export function Callout({ variant = 'info', title, children }: CalloutProps) {
  const v = variants[variant];
  return (
    <div className={`flex gap-3 rounded-xl border p-4 my-4 ${v.bg} ${v.border}`}>
      {v.icon}
      <div>
        {title && <p className={`text-sm font-semibold mb-1 ${v.titleColor}`}>{title}</p>}
        <p className={`text-sm leading-relaxed ${v.textColor}`}>{children}</p>
      </div>
    </div>
  );
}
