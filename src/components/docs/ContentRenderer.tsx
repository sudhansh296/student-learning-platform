import { ContentSection } from '@/lib/types';
import { CodeBlock } from './CodeBlock';
import { Callout } from './Callout';
import { AnalogyBox } from './AnalogyBox';
import { InlinePlayground } from './InlinePlayground';

interface ContentRendererProps {
  sections: ContentSection[];
}

export function ContentRenderer({ sections }: ContentRendererProps) {
  return (
    <div className="doc-content">
      {sections.map((section, index) => {
        switch (section.type) {
          case 'text':
            return (
              <p key={index} className="text-[15px] text-foreground/90 leading-[1.85] mb-4">
                {section.content}
              </p>
            );

          case 'heading':
            return (
              <h2 key={index}
                className="text-xl font-bold text-foreground mt-10 mb-4 pb-2 border-b border-border scroll-mt-20"
                id={(section.content || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}>
                {section.content}
              </h2>
            );

          case 'code':
            return (
              <CodeBlock
                key={index}
                code={section.content || ''}
                language={section.language}
                filename={section.filename}
                output={section.output}
                showLineNumbers={section.language !== 'bash'}
              />
            );

          case 'callout':
            return (
              <Callout key={index} variant={section.variant || 'info'} title={section.title}>
                {section.content || ''}
              </Callout>
            );

          case 'analogy':
            return (
              <AnalogyBox key={index} title={section.title}>
                {section.content || ''}
              </AnalogyBox>
            );

          case 'list':
            return (
              <div key={index} className="my-5">
                {section.title && (
                  <p className="text-sm font-semibold text-foreground mb-3">{section.title}</p>
                )}
                <ul className="space-y-2">
                  {section.items?.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[14px] text-foreground/90 leading-relaxed">
                      <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );

          case 'table':
            return (
              <div key={index} className="my-5 overflow-x-auto">
                {section.title && (
                  <p className="text-sm font-semibold text-foreground mb-2">{section.title}</p>
                )}
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      {section.headers?.map((h, i) => (
                        <th key={i} className="text-left px-4 py-2.5 border border-border font-semibold text-foreground text-xs uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.rows?.map((row, ri) => (
                      <tr key={ri} className="hover:bg-muted/30 transition-colors">
                        {row.map((cell, ci) => (
                          <td key={ci} className="px-4 py-3 border border-border text-foreground/90 font-mono text-xs">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case 'example':
            return (
              <div key={index} className="my-5">
                {section.title && (
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Example — {section.title}
                  </p>
                )}
                <CodeBlock
                  code={section.content || ''}
                  language={section.language || 'javascript'}
                  output={section.output}
                  showLineNumbers
                />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
