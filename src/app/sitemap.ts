import { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://webdevatlas.com';

// All learn slugs and their lesson slugs
const LEARN_TOPICS: Record<string, string[]> = {
  typescript: ['introduction','basic-types','arrays-tuples','objects-interfaces','functions','type-aliases','enums','generics','type-guards','utility-types','classes','modules','react-typescript','node-typescript','references','decorators','declaration-files','tsconfig'],
  react: ['introduction','jsx','components','props','state','events','conditional-rendering','lists-keys','useeffect','forms','context','useref','custom-hooks','performance','router','fetch-data','context-advanced','typescript-react','patterns','best-practices'],
  nextjs: ['introduction','file-routing','layouts','navigation','server-components','client-components','data-fetching','static-generation','api-routes','metadata','image-optimization','styling','middleware','deployment','references','authentication','env-config','error-handling'],
  nodejs: ['introduction','modules','npm-packages','file-system','http-server','express-basics','routing','middleware','rest-api','async-callbacks','promises','async-await','streams-buffers','references','testing','security'],
  express: ['introduction','routing-basics','middleware','request-response','rest-api','error-handling','static-files','templating','authentication','validation','database','references','file-uploads','security','testing'],
  mongodb: ['introduction','installation','crud-basics','queries','arrays-embedded','indexing','aggregation','mongoose','relationships','transactions','performance','references'],
  postgresql: ['01-introduction','02-installation','03-tables-schema','04-crud-basics','05-queries','06-joins','07-aggregation','08-indexes','09-transactions','10-nodejs-pg','11-advanced','12-references'],
  git: ['01-introduction','02-setup','03-core-workflow','04-branching','05-merging','06-remote','07-undoing','08-conflicts','09-tags-workflows','10-references'],
  docker: ['01-introduction','02-installation','03-images','04-containers','05-dockerfile','06-volumes','07-networking','08-compose','09-nodejs-docker','10-registry','11-references'],
  sql: ['01-introduction','02-tables','03-insert-select','04-where-filter','05-sorting-limiting','06-aggregates','07-joins','08-subqueries','09-indexes-constraints','10-references'],
  sqlite: ['01-introduction','02-setup-nodejs','03-crud','04-relationships','05-comparison','06-references'],
  redis: ['01-introduction','02-data-structures','03-expiry-ttl','04-nodejs-redis','05-caching-patterns','06-pubsub-queues','07-references'],
  'rest-api': ['01-introduction','02-http-basics','03-http-methods','04-status-codes','05-url-design','06-request-response','07-authentication','08-building-express-api','09-best-practices','10-references'],
};

const HTML_LESSONS = ['introduction','elements','attributes','headings-paragraphs','links','styles','colors','images','lists','tables','classes-id','forms','semantic','head','layout','responsive','iframes','javascript','references'];
const CSS_LESSONS  = ['introduction','selectors','box-model','colors-backgrounds','text-fonts','flexbox','grid','positioning','animations','responsive'];
const JS_LESSONS   = ['introduction','variables','data-types','operators','conditions','loops','functions','arrays','objects','dom','strings','async-await','classes','error-handling','es6-features','scope-closures','fetch-api','localstorage','regex','modules','numbers','dates','events','forms','prototypes','generators','event-loop','weakmap-weakset','design-patterns','js-references'];

const ROADMAP_SLUGS  = ['frontend','javascript','backend','fullstack'];
const PROJECT_SLUGS  = ['blog-platform','calculator','chat-app','country-explorer','ecommerce','expense-tracker','portfolio','quiz-app','rest-api','todo-app','weather-app'];
const TOOL_IDS       = ['json-formatter','base64','url-encoder','jwt-decoder','hash-generator','color-converter','css-gradient','timestamp','uuid-generator','lorem-ipsum','markdown-previewer','regex-tester'];
const INTERVIEW_CATS = ['javascript','react','nodejs','html-css','backend','database','rest-api','security','coding','project','hr'];

const now = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];

  // Static top-level pages
  const staticPages = ['','/learn','/roadmaps','/projects','/tools','/technologies','/interview','/playground','/databases','/mern','/compare'];
  for (const p of staticPages) {
    urls.push({ url: `${BASE}${p}`, lastModified: now, changeFrequency: 'weekly', priority: p === '' ? 1 : 0.9 });
  }

  // HTML lessons
  for (const s of HTML_LESSONS) {
    urls.push({ url: `${BASE}/html/${s}`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 });
  }

  // CSS lessons
  for (const s of CSS_LESSONS) {
    urls.push({ url: `${BASE}/css/${s}`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 });
  }

  // JS lessons
  for (const s of JS_LESSONS) {
    urls.push({ url: `${BASE}/js/${s}`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 });
  }

  // /learn/[tech]/[topic]
  for (const [tech, topics] of Object.entries(LEARN_TOPICS)) {
    urls.push({ url: `${BASE}/learn/${tech}`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 });
    for (const topic of topics) {
      urls.push({ url: `${BASE}/learn/${tech}/${topic}`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 });
    }
  }

  // Roadmaps
  for (const s of ROADMAP_SLUGS) {
    urls.push({ url: `${BASE}/roadmaps/${s}`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 });
  }

  // Projects
  for (const s of PROJECT_SLUGS) {
    urls.push({ url: `${BASE}/projects/${s}`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 });
  }

  // Tools
  for (const id of TOOL_IDS) {
    urls.push({ url: `${BASE}/tools/${id}`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 });
  }

  // Interview categories
  for (const cat of INTERVIEW_CATS) {
    urls.push({ url: `${BASE}/interview/${cat}`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 });
  }

  return urls;
}
