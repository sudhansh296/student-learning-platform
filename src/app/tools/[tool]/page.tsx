import { notFound } from 'next/navigation';
import { JsonFormatter } from '@/components/tools/JsonFormatter';
import { Base64Tool } from '@/components/tools/Base64Tool';
import { RegexTester } from '@/components/tools/RegexTester';
import { JwtDecoder } from '@/components/tools/JwtDecoder';
import { LoremIpsum } from '@/components/tools/LoremIpsum';
import { UuidGenerator } from '@/components/tools/UuidGenerator';
import { UrlEncoder } from '@/components/tools/UrlEncoder';
import { ColorConverter } from '@/components/tools/ColorConverter';
import { CssGradient } from '@/components/tools/CssGradient';
import { TimestampConverter } from '@/components/tools/TimestampConverter';
import { HashGenerator } from '@/components/tools/HashGenerator';
import { MarkdownPreviewer } from '@/components/tools/MarkdownPreviewer';
import { Breadcrumb } from '@/components/docs/Breadcrumb';

const toolsMap: Record<string, { name: string; component: React.ComponentType }> = {
  'json-formatter':  { name: 'JSON Formatter',          component: JsonFormatter },
  'base64':          { name: 'Base64 Encoder/Decoder',  component: Base64Tool },
  'regex-tester':    { name: 'Regex Tester',            component: RegexTester },
  'jwt-decoder':     { name: 'JWT Decoder',             component: JwtDecoder },
  'lorem-ipsum':     { name: 'Lorem Ipsum Generator',   component: LoremIpsum },
  'uuid-generator':  { name: 'UUID Generator',          component: UuidGenerator },
  'url-encoder':     { name: 'URL Encoder/Decoder',     component: UrlEncoder },
  'color-converter': { name: 'Color Converter',         component: ColorConverter },
  'css-gradient':    { name: 'CSS Gradient Generator',  component: CssGradient },
  'timestamp':       { name: 'Timestamp Converter',     component: TimestampConverter },
  'hash-generator':  { name: 'Hash Generator',          component: HashGenerator },
  'markdown-preview':{ name: 'Markdown Previewer',      component: MarkdownPreviewer },
};

interface Props {
  params: Promise<{ tool: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { tool } = await params;
  const t = toolsMap[tool];
  if (!t) return { title: 'Not Found' };
  return { title: t.name };
}

export default async function ToolPage({ params }: Props) {
  const { tool } = await params;
  const toolConfig = toolsMap[tool];

  if (!toolConfig) notFound();

  const Component = toolConfig.component;

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-10">
      <Breadcrumb items={[{ label: 'Tools', href: '/tools' }, { label: toolConfig.name }]} />
      <Component />
    </div>
  );
}
