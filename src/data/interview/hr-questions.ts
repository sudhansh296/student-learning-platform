import { InterviewQuestion } from '@/lib/interview-types';

export const hrInterviewQuestions: InterviewQuestion[] = [
  {
    id: 'hr-tell-me-about-yourself',
    category: 'hr',
    type: 'theory',
    question: 'Tell me about yourself.',
    difficulty: 'beginner',
    tags: ['introduction', 'hr', 'soft-skills'],
    shortAnswer: 'Give a 2-minute professional summary: current role/background, relevant skills and experience, what you\'re looking for. Tailor it to the role. End with why you\'re excited about this opportunity.',
    detailedExplanation: 'This is your elevator pitch. Structure it as: Present (current role/what you do), Past (relevant experience that got you here), Future (what you\'re looking for and why this role). Keep it to 90 seconds - 2 minutes. Focus on professional journey, not personal life. Mention 2-3 relevant technologies or achievements. Bridge to why you\'re interested in this specific role.',
    example: {
      code: `// Structure: Present â†’ Past â†’ Future

// âœ… Strong answer (customize for your situation):
"I'm a full-stack developer with 2 years of experience 
building web applications with React and Node.js. 

I started as a frontend developer at a startup where 
I built the main dashboard from scratch, which helped 
reduce customer support tickets by 30%. Over time I took 
on more backend work, building REST APIs and working with 
MongoDB databases.

I'm looking to join a company where I can work on 
products that have real user impact, and where I can 
continue growing â€” particularly in system design and 
large-scale backend architecture.

When I saw this role at [Company], I was excited because 
your product directly impacts [specific thing you care about], 
and the tech stack aligns perfectly with my experience."

// What to AVOID:
// âŒ "I'm a hard worker who loves to code"
// âŒ Starting with your birth city or personal info
// âŒ Reading your resume line by line
// âŒ Being too long (>3 minutes)
// âŒ Not connecting to the role

// Tips:
// - Practice until it feels natural, not rehearsed
// - Customize the "future" part for each company
// - Mention 1-2 quantifiable achievements
// - Show personality - be conversational`,
      language: 'javascript'
    },
    interviewAnswer: 'Keep it professional and focused on the job. Practice this until it flows naturally â€” it sets the tone for the entire interview. Tailor the "why this role" part specifically to each company.',
    commonMistakes: [
      'Going on for too long (over 3 minutes)',
      'Starting with personal/family details',
      'Sounding rehearsed and robotic',
      'Not connecting your story to the specific role'
    ],
    realWorldUse: 'Every interview starts with this. It\'s your chance to frame the conversation and highlight what\'s most relevant.',
    followUpQuestions: [
      'What are you looking for in your next role?',
      'Why are you leaving your current job?',
      'What do you know about our company?'
    ]
  },

  {
    id: 'hr-strengths-weaknesses',
    category: 'hr',
    type: 'theory',
    question: 'What are your strengths and weaknesses?',
    difficulty: 'beginner',
    tags: ['self-awareness', 'hr', 'growth'],
    shortAnswer: 'Strengths: pick 2-3 genuine ones with examples. Weaknesses: be honest about a real weakness but focus on how you\'re actively working on it. Never say "I work too hard" â€” it\'s a clichÃ© that signals low self-awareness.',
    detailedExplanation: 'Strengths should be relevant to the role and backed with examples. Weaknesses must be genuine but not disqualifying for the position. The growth focus is key â€” interviewers want to see self-awareness and ability to improve. Pick a real weakness that you\'ve recognized and are actively addressing. Avoid the classic "perfectionism" or "I work too hard" clichÃ©s.',
    example: {
      code: `// STRENGTHS - with evidence
"One of my strengths is breaking down complex problems 
into smaller, manageable parts. When we had a legacy 
codebase with no documentation, I created a plan to 
understand it section by section, wrote docs as I went, 
and delivered the feature 2 weeks ahead of schedule.

Another strength is communication. I write clear technical 
documentation and can explain technical concepts to 
non-technical stakeholders, which has helped bridge gaps 
between engineering and product teams."

// WEAKNESSES - genuine + growth focus
"One area I'm working on is public speaking. I'm 
comfortable in 1-on-1 or small group settings, but 
presenting to large audiences makes me nervous. I've 
been addressing this by volunteering to do team demos 
and recently gave a tech talk at my local JavaScript 
meetup. I can see improvement but it's still a work 
in progress.

Another thing I'm developing is system design skills. 
I'm strong on implementation but want to get better 
at high-level architecture. I'm currently reading 
'Designing Data-Intensive Applications' and working 
through system design practice problems."

// What NOT to say:
// âŒ "I'm a perfectionist" (overused, not believable)
// âŒ "I work too hard" (humble brag, shows no self-awareness)
// âŒ A core skill for the job (deal breaker)
// âŒ "I don't have any weaknesses" (red flag)
// âŒ Vague: "I sometimes procrastinate" without growth plan`,
      language: 'javascript'
    },
    interviewAnswer: 'Be authentic. Interviewers have heard "perfectionism" thousands of times. A real weakness with genuine growth steps shows maturity and self-awareness, which is far more impressive. For strengths, always pair them with a brief, concrete example from your experience.',
    commonMistakes: [
      'Using the "perfectionism" clichÃ©',
      'Giving a weakness that\'s actually a strength (work too hard)',
      'Not having a growth plan for your weakness',
      'Strengths with no supporting examples'
    ],
    realWorldUse: 'Every interview has this question in some form. Practice your answer so it feels genuine and confident.',
    followUpQuestions: [
      'Can you give me a specific example of using that strength?',
      'How has that weakness impacted your work?',
      'What specific steps are you taking to improve?'
    ]
  },

  {
    id: 'hr-challenge',
    category: 'hr',
    type: 'theory',
    question: 'Tell me about a challenging technical problem you faced and how you solved it.',
    difficulty: 'beginner',
    tags: ['problem-solving', 'star', 'technical'],
    shortAnswer: 'Use STAR method: Situation (context), Task (what was needed), Action (what YOU specifically did), Result (measurable outcome). Focus on your specific contributions and what you learned.',
    detailedExplanation: 'Behavioral questions like "tell me about a time" use the STAR framework: Situation (brief context), Task (what needed to be done, your role), Action (specific steps you took â€” say "I" not "we"), Result (quantifiable outcome when possible, and what you learned). Pick a genuine challenge where you overcame obstacles and can speak to technical depth.',
    example: {
      code: `// STAR Framework Applied

// SITUATION: Set the scene briefly (30 seconds)
"At my previous company, we had a React application that 
was taking 8 seconds to load on mobile devices, which 
was causing a high bounce rate. The product team flagged 
it as a critical issue."

// TASK: Your role and what needed solving (15 seconds)
"I was tasked with identifying performance bottlenecks 
and reducing the load time to under 2 seconds."

// ACTION: What YOU specifically did (90 seconds - the meat)
"First, I used Lighthouse and Chrome DevTools to identify 
the main issues. I found three critical problems:

1. The entire app was in one 2.4MB JavaScript bundle â€” 
   I implemented code splitting with React.lazy and split 
   routes into separate chunks.
   
2. We were loading all 200 product images upfront â€” I 
   added lazy loading with the Intersection Observer API 
   and converted images to WebP format.
   
3. The product catalog API was being called on every 
   render without caching â€” I added React Query for 
   API response caching with a 5-minute stale time.

I also analyzed network requests and found we were loading 
a full lodash library but only using 3 functions, so I 
switched to named imports to enable tree shaking."

// RESULT: Measurable outcome (30 seconds)
"These changes reduced the initial bundle from 2.4MB to 
340KB and load time from 8 seconds to 1.4 seconds on 
mobile. The bounce rate dropped by 23% and product 
team reported a 12% increase in mobile conversions. 
I also documented the process as a performance audit 
guide for future features."

// What makes this answer strong:
// - Specific numbers (2.4MB â†’ 340KB, 8s â†’ 1.4s)
// - Multiple specific technical solutions
// - Business impact (23% bounce rate reduction)
// - Shows learning/documentation`,
      language: 'javascript'
    },
    interviewAnswer: 'The key is specificity. Vague answers like "I fixed a performance problem" don\'t impress. Show your debugging process, the specific solutions you chose, and quantify the impact. Even if you don\'t have exact numbers, estimate them.',
    commonMistakes: [
      'Using "we" instead of "I" (can\'t tell your contribution)',
      'No measurable result',
      'Too vague â€” no technical detail',
      'Choosing a problem that\'s too simple'
    ],
    realWorldUse: 'Every behavioral interview uses the STAR method. Prepare 5-6 STAR stories covering: challenge overcome, conflict resolved, leadership shown, failure learned from, collaboration success.',
    followUpQuestions: [
      'What would you do differently?',
      'How did this impact the team?',
      'What did you learn from this experience?'
    ]
  },

  {
    id: 'hr-teamwork',
    category: 'hr',
    type: 'theory',
    question: 'Tell me about a time you had a conflict with a colleague. How did you handle it?',
    difficulty: 'beginner',
    tags: ['teamwork', 'conflict-resolution', 'star'],
    shortAnswer: 'Use STAR method. Show you addressed the conflict professionally, focused on the issue not the person, sought to understand their perspective, and reached a solution collaboratively. Never badmouth the colleague.',
    detailedExplanation: 'Conflict questions assess maturity, communication, and professionalism. Interviewers want to see that you can navigate disagreements without escalation or avoidance. Key behaviors: approach directly (not via manager or email), listen to understand, focus on shared goals, find compromise. The outcome doesn\'t have to be "you won" â€” learning to collaborate is the point.',
    example: {
      code: `// Strong STAR answer for conflict question

// SITUATION:
"In my previous role, I was working on a new feature 
with another developer who wanted to use a different 
technical approach. I proposed using React Query for 
data fetching, but they preferred Redux Toolkit because 
they were more familiar with it."

// TASK:
"We needed to make a decision quickly since we were 
blocked from starting implementation, and both of us 
felt strongly about our approach."

// ACTION:
"Instead of escalating or just giving in, I suggested 
we have a focused 30-minute comparison meeting. I prepared 
a quick comparison document covering bundle size impact, 
learning curve, and fit for our use case.

During the meeting, I asked them to walk me through why 
they preferred Redux â€” I learned they were concerned about 
consistency with the rest of the codebase. That was a 
valid point I hadn't considered fully.

We agreed to look at the existing patterns together. 
Since most of our other data fetching used a simpler 
pattern, we ended up using React Query but with a shared 
set of conventions so it felt consistent. I wrote the 
conventions doc, and they reviewed it."

// RESULT:
"The implementation went smoothly, and they later said 
the React Query approach made their part easier than 
expected. More importantly, we established a practice 
of doing quick technical comparisons for architecture 
decisions, which the team adopted for future choices."

// Key principles shown:
// - Addressed directly, not via manager
// - Listened to understand their perspective  
// - Found common ground (codebase consistency)
// - Reached a collaborative decision
// - Built a process for future disagreements`,
      language: 'javascript'
    },
    interviewAnswer: 'Never say you\'ve never had conflict â€” it signals you avoid confrontation. Pick a real story where disagreement was resolved professionally. The goal is to show you can work through differences without damaging relationships.',
    commonMistakes: [
      '"I\'ve never had a conflict" (avoidance is a red flag)',
      'Making the colleague look bad',
      'Describing a conflict where you just gave in (no resolution)',
      'A conflict with a manager without careful framing'
    ],
    realWorldUse: 'Technical teams have disagreements about architecture, code style, and priorities constantly. Healthy conflict resolution is essential for senior roles.',
    followUpQuestions: [
      'What did you learn from that conflict?',
      'Would you do anything differently?',
      'How do you prevent conflicts from escalating?'
    ]
  },

  {
    id: 'hr-why-this-company',
    category: 'hr',
    type: 'theory',
    question: 'Why do you want to work at our company?',
    difficulty: 'beginner',
    tags: ['motivation', 'research', 'hr'],
    shortAnswer: 'Show genuine research: mention specific products, recent news, values, or tech stack. Connect their work to your career goals. Never just say salary or "you\'re a big company." Show you\'ve done homework.',
    detailedExplanation: 'This question tests whether you\'ve researched the company and whether your values align. Generic answers ("great company, great culture") show no effort. Specific answers ("I use your product daily and noticed X that I\'d love to work on") show genuine interest. Research: use the product yourself, read their engineering blog, check recent news, understand their mission.',
    example: {
      code: `// Research checklist before answering:
// - Use their product/service yourself
// - Read their engineering blog (tech.company.com)
// - Check recent news, product launches
// - Look at open source contributions
// - Understand their mission statement
// - Know their tech stack (from job description)

// âœ… Strong answer:
"I've been using [Product] for about a year to manage 
my freelance projects, and I've always been impressed 
by how [specific feature] works â€” it's one of the 
smoothest UX experiences I've seen for [problem it solves].

I read your engineering blog post about how you built 
the real-time collaboration feature using WebSockets 
and CRDTs â€” that's exactly the kind of technically 
interesting problem I want to work on.

Beyond the technical side, I'm aligned with your 
mission around [specific mission aspect]. I want to 
work somewhere where engineering decisions have real 
user impact.

And practically, your tech stack â€” React, Node.js, 
and PostgreSQL â€” is exactly what I've been building 
with, so I'd hit the ground running."

// âŒ Generic answers to avoid:
// "You're a leading company in the industry."
// "The salary and benefits are great."
// "I heard it's a good place to work."
// "You use React and I know React."

// Connection points to make:
// - Product you've used or admired
// - Technical blog post or open source work
// - Company mission that resonates
// - Growth stage that matches what you want
// - Specific team or problem area`,
      language: 'javascript'
    },
    interviewAnswer: 'Genuine research shows respect for the interviewer\'s time and signals you\'re serious about the role. Spend 30 minutes before every interview reading their engineering blog, trying the product, and checking recent news. The more specific you are, the more convincing.',
    commonMistakes: [
      'Generic answers that could apply to any company',
      'Mentioning only salary',
      'Not researching the company at all',
      'Mentioning reasons that aren\'t about the company (commute, location)'
    ],
    realWorldUse: 'This is asked in every interview. Companies want people excited about their mission, not just a paycheck. Enthusiasm is genuinely noticed.',
    followUpQuestions: [
      'What do you know about our product?',
      'Where do you see us going in the next few years?',
      'Is there anything about our company you find challenging?'
    ]
  },

  {
    id: 'hr-career-goals',
    category: 'hr',
    type: 'theory',
    question: 'Where do you see yourself in 5 years?',
    difficulty: 'beginner',
    tags: ['career-goals', 'motivation', 'hr'],
    shortAnswer: 'Show ambition with realistic direction. Connect your goals to growth you\'d get from this role. Avoid extremes: too vague ("I want to grow") or too specific ("I want your job"). Show you\'re invested in the work, not just the title.',
    detailedExplanation: 'Interviewers want to know if your goals align with what the role offers, if you\'re ambitious but realistic, and if you plan to stay long enough to add value. Two to three years of contributions is what most companies hope for. Show direction without tying yourself to a specific title. Express interest in depth of skill and impact, not just promotion.',
    example: {
      code: `// âœ… Strong answer for a developer role:
"In 5 years, I see myself as a senior or lead developer 
who can independently drive technical decisions for a 
product area â€” not just implementing features but 
contributing to architecture, mentoring junior developers, 
and working closely with product to shape what gets built 
and how.

Right now I'm strong on implementation but I want to 
develop better instincts for system design and technical 
leadership. I think a role like this, where I'd be working 
with an experienced team on complex problems, is the 
right environment to build those skills.

I'm not obsessed with titles â€” I care more about the 
quality of problems I get to work on and the impact 
I can have."

// âœ… For more senior role:
"I'd like to be in a technical leadership role â€” either 
as a staff engineer or engineering manager, depending 
on how I grow and what opportunities emerge. I enjoy 
both deep technical work and helping others improve, 
so I'm keeping both paths open.

This role appeals to me because [specific aspect] 
would help me develop [specific skill] that's important 
for either path."

// âŒ Answers to avoid:
// "Honestly, I just want to be doing a good job and 
//  see where life takes me." (no ambition)
// "I want your job." (presumptuous)
// "I plan to start my own company." (leaving signal)
// "I'll be a VP in 5 years." (unrealistic for junior)`,
      language: 'javascript'
    },
    interviewAnswer: 'Show ambition but connect it to the skills you\'d develop in this role. Companies invest in hiring and training â€” they want to know you\'ll be around to provide return on that investment. Tying your goals to what you\'d learn in this specific role shows alignment.',
    commonMistakes: [
      'Being so vague you sound disinterested',
      'Mentioning starting a company (signals exit plan)',
      'Unrealistic expectations (CEO in 5 years)',
      'Not connecting goals to this specific role'
    ],
    realWorldUse: 'Standard HR question at every company. Have a genuine answer that reflects your actual career thinking â€” forced answers are obvious.',
    followUpQuestions: [
      'What skills do you want to develop?',
      'Do you prefer technical or management track?',
      'How does this role fit into your career plan?'
    ]
  },

  {
    id: 'hr-failure',
    category: 'hr',
    type: 'theory',
    question: 'Tell me about a time you failed. What did you learn?',
    difficulty: 'intermediate',
    tags: ['failure', 'learning', 'growth', 'star'],
    shortAnswer: 'Pick a real failure (not a humble brag). Own it completely, don\'t blame others. Focus on what you learned and how you changed your behavior afterward. Show growth mindset.',
    detailedExplanation: 'This question is a growth mindset test. Interviewers want to see self-awareness, accountability, and learning from mistakes. The story matters less than your reflection on it. Avoid failures that were out of your control, involve blaming others, or are so small they don\'t show any real stakes. Pick something where you genuinely dropped the ball and grew from it.',
    example: {
      code: `// âœ… Genuine failure answer

// SITUATION + TASK:
"Early in my first developer job, I was confident in 
my skills and pushed a database migration to production 
without fully testing the rollback script.

// WHAT HAPPENED (the failure):
The migration had a bug that caused some user data to 
become inaccessible. The issue affected about 200 users 
and took 4 hours to resolve. It was genuinely my fault â€” 
I cut corners on testing because I was confident it 
would work, and I didn't get a proper code review."

// WHAT YOU DID:
"I immediately told my manager, stayed late to debug 
and restore the data, and wrote a post-mortem 
documenting exactly what went wrong and why."

// WHAT YOU LEARNED:
"The experience changed how I work permanently. I now:
1. Always test rollback procedures before migrating 
   production data
2. Require a second pair of eyes on anything touching 
   production databases
3. Stage and verify migrations in a staging environment 
   that mirrors production

That mistake made me a much more careful engineer. 
I haven't had a data incident since."

// Key elements:
// - It was genuinely YOUR fault (accountability)
// - Real stakes (200 users affected)
// - Specific lessons learned
// - Behavioral change (not just "I'll be more careful")

// âŒ Avoid:
// "I once missed a deadline because the requirements 
//  kept changing." (blaming others)
// "I worked so hard I burned out." (humble brag)
// Choosing something so minor it has no stakes`,
      language: 'javascript'
    },
    interviewAnswer: 'The best failure stories show real accountability and specific behavioral change. "I\'ll be more careful next time" is not learning. "I now do X every time because of this" is learning. Own it completely â€” interviewers respect honesty far more than a polished story with excuses.',
    commonMistakes: [
      'Blaming external factors (requirements changed, team failed)',
      'Choosing something too minor (no stakes)',
      'Choosing something disqualifying for the role',
      'Lessons that are too vague ("be more careful")'
    ],
    realWorldUse: 'Companies hiring senior engineers especially care about this â€” they\'ve learned that people who can\'t acknowledge failure are dangerous to work with.',
    followUpQuestions: [
      'How did you fix the situation?',
      'How did it affect your team?',
      'What processes did you put in place afterward?'
    ]
  },

  {
    id: 'hr-salary',
    category: 'hr',
    type: 'theory',
    question: 'What are your salary expectations?',
    difficulty: 'beginner',
    tags: ['salary', 'negotiation', 'hr'],
    shortAnswer: 'Research market rates first. Give a range based on research, not a single number. Anchor high but reasonably. Never give a number before the company does if you can avoid it â€” ask about their range first.',
    detailedExplanation: 'Salary negotiation is a skill. First, research market rates using Glassdoor, Levels.fyi, LinkedIn Salary, and Blind for your role, location, and experience level. Try to get the company to state their range first. If you must go first, give a well-researched range anchored at the higher end. Never anchor too low â€” it\'s hard to negotiate up. Consider total compensation (base, equity, bonus, benefits).',
    example: {
      code: `// Strategy 1: Deflect first (best option)
Interviewer: "What are your salary expectations?"
You: "I'm flexible and interested in finding a number 
     that works for both of us. Could you share the 
     budget range for this role? That would help me 
     understand if we're in the right range."

// If they insist you go first:
// Research sites: Glassdoor, Levels.fyi, LinkedIn Salary,
// Blind, Payscale, Glassdoor, H1B salary database

// Strategy 2: Researched range (anchor high)
"Based on my research for [role] in [location] with 
my experience level, I'm targeting $90,000 - $110,000 
in base salary. I'm open to discussing the full package 
including equity and benefits."

// Key principles:
// - Always give a range (never a single number first)
// - Anchor at the HIGHER end of your range
// - Mention "open to discussing full package" (equity, etc)
// - Don't apologize for your number
// - Never accept on the spot â€” "I'll think about it"

// Strategy 3: If asked about current salary
// (illegal to ask in many US states)
"I'd prefer to focus on the value I'd bring to this 
role and market rates rather than my current salary."

// After getting an offer - negotiating up:
"Thank you for the offer! I'm very excited about this 
opportunity. The base salary is a bit below what I was 
targeting based on my research and experience. Is there 
flexibility to come up to [target number]?"

// 80% of the time, the first offer is negotiable
// Worst answer: "Yes, that's fine" without negotiating`,
      language: 'javascript'
    },
    interviewAnswer: 'Never give a number without research. Use Levels.fyi for tech companies, Glassdoor for others. Give a range anchored 10-20% above your target â€” it\'s expected, and companies rarely offer above the middle of their stated range. Always negotiate the first offer; it\'s expected and shows you know your worth.',
    commonMistakes: [
      'Giving a number too low (anchors negotiation low)',
      'Saying "whatever is fair" (leaves money on the table)',
      'Not researching market rates',
      'Accepting the first offer without negotiating'
    ],
    realWorldUse: 'Negotiation is expected. Not negotiating costs the average developer $1-5k/year in starting salary, which compounds over a career. Research specific to your location and company size matters significantly.',
    followUpQuestions: [
      'Would you be flexible on the salary for the right opportunity?',
      'What other factors are important to you besides salary?',
      'When can we expect a decision from you?'
    ]
  },

  {
    id: 'hr-why-leaving',
    category: 'hr',
    type: 'theory',
    question: 'Why are you leaving your current job?',
    difficulty: 'beginner',
    tags: ['hr', 'motivation', 'professional'],
    shortAnswer: 'Stay positive and forward-focused. Talk about what you\'re moving toward, not what you\'re running from. Never badmouth your current employer. Valid reasons: growth opportunity, new challenges, better alignment with interests.',
    detailedExplanation: 'This is a trap for negativity. Even if your boss is terrible, don\'t say so. The interviewer doesn\'t know if you\'re the problem. Focus on what you want more of, not what you hate. Valid positive reasons: want bigger scale, want to work on different technology, company direction changed, want to contribute to a product you use, seeking mentorship opportunities, career advancement.',
    example: {
      code: `// âœ… Forward-focused answers:

// Scenario: Want more growth
"I've learned a lot in my current role and am proud 
of what I've built. But after two years, the work has 
become more maintenance-oriented and I'm looking for 
more greenfield development where I can face new 
architectural challenges."

// Scenario: Company direction changed
"Our team was just acquired and the product direction 
shifted away from what I joined to build. It's a good 
opportunity for me to find a role that's more aligned 
with my interests in [specific area]."

// Scenario: Better tech/product fit
"I've been working with older technologies and want 
to be working with modern tooling. [Company] using 
React and Node.js aligns with where I want to develop 
my skills."

// Scenario: First job/layoff (handle honestly)
"I was recently laid off as part of a company-wide 
restructuring. It was a difficult experience, but I've 
used the time to [what you did: side projects, open 
source, courses], and I'm excited to find a role 
where I can contribute."

// âŒ Things to NEVER say:
// "My boss is terrible and micromanages everything"
// "I hate the company culture"
// "I'm not being paid enough" (first thing - red flag)
// "I'm bored and do nothing most days"
// Even if all these are true - don't say them

// Transform negatives to positives:
// "Boss micromanages" â†’ "I'm looking for more autonomy"
// "Boring work" â†’ "I want more challenging technical problems"
// "Bad culture" â†’ "I'm looking for a more collaborative team"`,
      language: 'javascript'
    },
    interviewAnswer: 'Always be honest but frame it positively. Interviewers ask this partly to detect red flags â€” if you badmouth your current employer, they wonder if you\'ll do the same to them. Genuinely forward-focused answers about growth, challenge, or alignment with interests are the most believable and impressive.',
    commonMistakes: [
      'Badmouthing current employer or manager',
      'Saying only "for more money"',
      'Not having a real answer (vague)',
      'Being dishonest (it often comes out)'
    ],
    realWorldUse: 'Asked at every interview. Have a genuine, positive answer ready. If you were laid off, be straightforward â€” it\'s common and not a stigma.',
    followUpQuestions: [
      'What did you like most about your current role?',
      'What would make you stay at your current job?',
      'What does your current manager think of you leaving?'
    ]
  },

  {
    id: 'hr-questions-for-interviewer',
    category: 'hr',
    type: 'theory',
    question: 'Do you have any questions for us?',
    difficulty: 'beginner',
    tags: ['questions', 'research', 'engagement'],
    shortAnswer: 'Always have 3-5 thoughtful questions prepared. Ask about the team, tech stack, biggest challenges, growth opportunities, and what success looks like. Never say "No, I think you\'ve covered everything."',
    detailedExplanation: 'Saying you have no questions is a red flag â€” it signals low engagement. Questions show you\'re evaluating the role seriously, not just taking any offer. Ask questions that help you make a decision, that show you\'ve done research, and that demonstrate genuine curiosity. Avoid asking about salary/benefits in early rounds (HR round is fine), vacation policies, or anything easily found on their website.',
    example: {
      code: `// Great questions to ask (pick 3-5 relevant ones):

// About the role
"What does success look like in the first 90 days 
for this role?"

"What are the biggest technical challenges the team 
is currently facing?"

"How would you describe the balance between new 
feature development and technical debt?"

// About the team
"Can you tell me about the team I'd be joining â€” 
size, how long people have been here, how you 
collaborate?"

"How does the engineering team work with product 
and design? Is it collaborative or more waterfall?"

// About the tech
"What does the tech stack look like beyond what's 
in the job description? What are you considering 
for the future?"

"How do you handle code quality? Do you have code 
reviews, testing requirements, CI/CD?"

// About growth
"What do career progression opportunities look like 
for engineers here?"

"Are there opportunities to work on different parts 
of the system, or is it more specialized by team?"

// About the company/culture
"What do you like most about working here?"
(Great question for individual interviewers)

"What's the on-call situation for engineers?"

// Questions showing research:
"I read your recent blog post about [specific topic]. 
What was the outcome of that approach?"

"I noticed you recently [launched a feature/changed 
direction]. How has that affected the engineering team?"

// âŒ Avoid these questions:
// "What are the vacation days?"
// "Can I work from home?" (ask but save for offer stage)
// "What does the company do?" (Google it)
// "Will I get promoted quickly?"`,
      language: 'javascript'
    },
    interviewAnswer: 'Questions are your chance to evaluate the company too. The best questions show genuine curiosity about the work and team, not just the perks. "What do you like most about working here?" to an engineer always gives candid, useful insight. Questions about technical debt and code quality reveal the engineering culture.',
    commonMistakes: [
      'Not having any questions',
      'Questions about vacation/salary in early rounds',
      'Questions answered on the company website',
      'Too many questions (keep it to 3-5)'
    ],
    realWorldUse: 'This ends every interview. Have your questions written down. The interviewer\'s answers to "what do you like most about working here" and "what are the biggest challenges" are often the most valuable information you\'ll get.',
    followUpQuestions: [
      'What are the next steps in the process?',
      'When can I expect to hear back?',
      'Is there anything about my background I can clarify?'
    ]
  },

  // â”€â”€ BATCH 1 (1-10) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  {
    id: 'hr-new-remote-work',
    category: 'hr',
    type: 'theory',
    question: 'How do you stay productive when working remotely?',
    difficulty: 'beginner',
    tags: ['remote-work', 'productivity', 'hr'],
    shortAnswer: 'Structured routine, dedicated workspace, async communication habits, and regular check-ins. Show you are self-disciplined and proactive about visibility.',
    detailedExplanation: 'Remote work requires self-management skills that not everyone develops naturally. Interviewers want to know you can stay accountable without in-person oversight. Key areas: time structuring (fixed work hours, time-blocking), environment (dedicated space, minimal distractions), communication (over-communicate progress, use async tools well), and isolation mitigation (virtual coffees, team rituals).',
    example: {
      code: `// Remote productivity system (real example)

// 1. Fixed schedule â€” treat remote like in-office
"I work 9-6 with a hard shutdown. I block deep-work 
hours in the morning (9-12) when I do complex coding, 
and reserve afternoons for meetings, reviews, and 
async replies."

// 2. Dedicated workspace
"I have a separate room set up as my office. When I'm 
in that room, I'm at work. When I leave, I'm done. 
The physical separation helps me switch off."

// 3. Async-first communication
"I write clear, detailed Slack messages and Jira updates 
so colleagues in different timezones can unblock 
themselves without waiting for me. I document decisions 
in Notion immediately after calls."

// 4. Visibility and check-ins
"I post a daily async standup: what I did yesterday, 
what I'm doing today, any blockers. It keeps me 
accountable and keeps my manager informed without 
micro-managing."

// 5. Combating isolation
"I schedule one virtual coffee per week with a teammate. 
Our team also has a non-work Slack channel that keeps 
the social side alive."

// Metrics that matter:
// - Tasks delivered on time
// - PRs reviewed within 24 hours
// - Blockers communicated proactively`,
      language: 'javascript'
    },
    interviewAnswer: 'Remote hiring is competitive â€” companies want proof you have the habits, not just the intention. Be specific about tools, routines, and how you maintain team visibility. Vague "I\'m disciplined" answers don\'t land.',
    commonMistakes: [
      'Vague answers with no specific habits',
      'Not mentioning communication and visibility',
      'Focusing only on personal productivity, ignoring team impact',
      'No mention of handling distractions'
    ],
    realWorldUse: 'Remote roles are permanent at many companies. This question is now standard and increasingly important for async-first, distributed teams.',
    followUpQuestions: [
      'How do you handle timezone differences with your team?',
      'What tools do you use for remote collaboration?',
      'How do you separate work from personal life at home?'
    ]
  },

  {
    id: 'hr-new-feedback',
    category: 'hr',
    type: 'theory',
    question: 'Tell me about a time you received critical feedback. How did you respond?',
    difficulty: 'beginner',
    tags: ['feedback', 'growth', 'self-awareness', 'star'],
    shortAnswer: 'Use STAR. Show you listened without defensiveness, reflected on whether the feedback was valid, and made a concrete change. Receiving feedback well is a professional skill.',
    detailedExplanation: 'This question tests emotional maturity and growth mindset. Interviewers look for: no defensiveness, genuine reflection, and behavioral change. Pick a real example where the feedback stung a little â€” if it was easy, it doesn\'t show much. The ability to separate ego from work is a key signal of a high-performing collaborator.',
    example: {
      code: `// SITUATION:
"Six months into my first job, my tech lead gave me 
feedback in my review that my code was hard to review 
â€” functions were too long, naming wasn't clear, and 
I rarely wrote comments explaining the 'why'."

// MY INITIAL REACTION (be honest):
"My first reaction was defensive. I thought my code 
worked, so what was the problem? But I took a day 
before responding."

// ACTION:
"I asked my lead to walk me through a PR with me 
and explain what specifically was hard to follow. 
Seeing it from a reviewer's perspective was a 
wake-up call â€” I realized I was writing code I 
could read, not code others could read.

I bought 'Clean Code' by Robert Martin, applied the 
principles to my next PR, and asked for feedback on it. 
I also started doing self-reviews before submitting PRs, 
reading my own diff as if I were a stranger."

// RESULT:
"Over the next quarter, my PR review cycles went from 
averaging 3 rounds of back-and-forth to 1-2. My lead 
mentioned at my next review that my code quality had 
noticeably improved. More importantly, I genuinely 
internalized that readable code is collaborative code."

// What this shows:
// - No long-term defensiveness
// - Sought to understand before reacting
// - Took concrete action (book, habit change)
// - Measurable improvement`,
      language: 'javascript'
    },
    interviewAnswer: 'Admitting initial defensiveness actually makes the answer more credible. The key is what you did after. "I immediately agreed and changed" sounds fake. "I reflected, understood the valid point, and made this specific change" sounds real.',
    commonMistakes: [
      'Picking feedback you didn\'t actually agree with and still don\'t',
      'Being defensive in the story itself',
      'No concrete behavioral change',
      'Feedback that was too minor to demonstrate anything'
    ],
    realWorldUse: 'Code reviews, performance reviews, and peer feedback are constant in software teams. People who receive feedback poorly create toxic dynamics.',
    followUpQuestions: [
      'Do you still apply what you learned?',
      'How do you give feedback to others?',
      'What\'s the best feedback you\'ve ever received?'
    ]
  },

  {
    id: 'hr-new-prioritization',
    category: 'hr',
    type: 'theory',
    question: 'How do you prioritize when you have multiple deadlines at the same time?',
    difficulty: 'beginner',
    tags: ['prioritization', 'time-management', 'hr'],
    shortAnswer: 'Assess impact and urgency, communicate proactively, negotiate scope when needed, and don\'t silently miss deadlines. Show a system, not just "I work harder."',
    detailedExplanation: 'Competing priorities are a daily reality in engineering. Interviewers want to see a rational, communicative approach. Key behaviors: explicitly understanding true priority with stakeholders, breaking work into chunks to deliver increments, flagging conflicts early (not after the fact), and avoiding the trap of doing everything partially instead of finishing things completely.',
    example: {
      code: `// My prioritization process:

// Step 1: Clarify what's actually urgent vs important
"If I have 3 deadlines converging, I first list each 
task with its deadline, impact (blocking who?), and 
effort estimate. Often one is blocking another person 
or team â€” that gets prioritized regardless of effort."

// Step 2: Time-block ruthlessly
"I block deep focus time for the highest-priority item 
first. I don't context-switch between major tasks until 
one is complete enough to hand off or submit."

// Step 3: Communicate early
"If I can see I won't hit all deadlines at full quality, 
I raise the conflict immediately â€” not on the due date.
'I have X, Y, and Z due Friday. X is taking longer 
than estimated. Can we adjust Y's deadline or reduce 
scope on Z?'"

// Step 4: Negotiate scope, not just time
"Deadlines are often fixed but scope isn't. Delivering 
the core of a feature on time beats delivering a 
complete feature late. I proactively identify what's 
MVP for each task."

// Real example:
"During a sprint, I had a bug fix needed for a demo, 
a feature PR for code review, and documentation due. 
The bug was blocking the sales demo so it went first. 
I asked a teammate to start the documentation while 
I finished the feature. Everything shipped â€” the bug 
that day, feature next morning, docs by EOD."`,
      language: 'javascript'
    },
    interviewAnswer: 'The most important thing is showing you communicate conflicts proactively. Silently missing a deadline or delivering poor quality without warning is the worst outcome. A well-explained scope change negotiated in advance is completely fine.',
    commonMistakes: [
      '"I just work harder/longer" (not sustainable)',
      'No mention of communicating with stakeholders',
      'Always saying yes without scope negotiation',
      'No system â€” pure gut feeling'
    ],
    realWorldUse: 'Sprint crunches, production bugs during feature development, and cross-team dependencies make this a constant challenge. This skill separates reliable engineers from unpredictable ones.',
    followUpQuestions: [
      'Have you ever missed a deadline? What happened?',
      'How do you handle a stakeholder who says everything is top priority?',
      'What tools do you use to manage your work?'
    ]
  },

  {
    id: 'hr-new-learning',
    category: 'hr',
    type: 'theory',
    question: 'How do you keep your technical skills up to date?',
    difficulty: 'beginner',
    tags: ['learning', 'growth', 'self-improvement'],
    shortAnswer: 'Show a concrete, consistent learning system: specific sources, regular habits, and application of what you learn through side projects or at work.',
    detailedExplanation: 'Technology moves fast. Interviewers want to see that you\'re self-driven learners, not people who only learn what their job requires. The best answers combine passive learning (blogs, newsletters, podcasts) with active application (building things, contributing to open source, applying concepts at work). Generic "I read tech blogs" isn\'t enough â€” be specific.',
    example: {
      code: `// Learning system (be specific about sources)

// Weekly habits:
"Every morning I spend 20 minutes reading:
- JavaScript Weekly newsletter (curated ecosystem updates)
- Dan Abramov's blog (React internals and mental models)
- The Changelog podcast on my commute"

// Deeper learning (structured):
"When I want to learn something new, I go through a 
course on Frontend Masters or read the official docs 
end-to-end, not just the getting started guide.

For TypeScript, I worked through the official handbook 
and Matt Pocock's Total TypeScript. For system design, 
I'm going through 'Designing Data-Intensive Applications' 
chapter by chapter."

// Active application:
"I maintain two side projects that I update whenever 
I learn something new. Currently rebuilding one with 
Next.js App Router to learn the new patterns."

// Following people:
"I follow key contributors to projects I use on Twitter/X: 
Tanner Linsley (React Query/TanStack), Kent C. Dodds 
(testing), and Guillermo Rauch (Next.js). Their threads 
often explain the 'why' behind design decisions better 
than docs do."

// At work:
"I volunteer to be the person who evaluates new libraries 
when we're considering a change â€” it forces me to go 
deep quickly."`,
      language: 'javascript'
    },
    interviewAnswer: 'Specificity is everything here. Naming actual people you follow, newsletters you read, or courses you\'ve taken signals genuine engagement. "I stay current with blogs" tells an interviewer nothing.',
    commonMistakes: [
      'Vague answers ("I read documentation")',
      'Only mentioning passive learning, no active practice',
      'Learning things unrelated to your stated career goals',
      'Describing a system you don\'t actually follow'
    ],
    realWorldUse: 'The JavaScript ecosystem changes every 18 months. Engineers who don\'t invest in continuous learning become liabilities within 3-5 years.',
    followUpQuestions: [
      'What have you learned in the last 3 months?',
      'What\'s a technology you\'re currently exploring?',
      'How do you decide what to learn next?'
    ]
  },

  {
    id: 'hr-new-pressure',
    category: 'hr',
    type: 'theory',
    question: 'How do you handle stress and pressure at work?',
    difficulty: 'beginner',
    tags: ['stress', 'resilience', 'hr', 'soft-skills'],
    shortAnswer: 'Show that pressure doesn\'t affect your work quality or team relationships. Describe concrete coping strategies, how you identify when you\'re overwhelmed early, and how you ask for help before things go wrong.',
    detailedExplanation: 'This question looks for emotional regulation, self-awareness, and sustainable work habits. Companies don\'t want someone who thrives only in low-pressure environments, nor someone who burns out in crunches and becomes destructive. Key signals: you recognize stress early, you have healthy coping mechanisms, you communicate when load is unsustainable, and you don\'t take pressure out on teammates.',
    example: {
      code: `// Healthy stress management signals

// Self-awareness:
"I've learned to recognize when I'm in a productive 
pressure mode versus an unproductive spiral. Signs 
I'm tipping into spiral: I start second-guessing 
decisions I've already made, I re-read the same code 
without progress, or I become unusually quiet in Slack."

// Coping strategies (be genuine):
"When I hit a wall, I take a 10-minute walk away 
from screens. I come back with a fresh perspective 
about 80% of the time. For longer crunches, I break 
work into 90-minute focus blocks with real breaks 
instead of grinding for 6 hours straight â€” I actually 
produce more this way."

// Preventing the problem:
"I try to front-load uncertainty. If I'm starting a 
sprint and see a task that I'm not confident about, 
I spike on it day one rather than leaving it for 
the end. That removes the surprise that creates 
the worst pressure."

// Communication:
"If I'm genuinely underwater, I say so early. 
'I'm struggling with X, can we pair on it?' or 
'At current pace I'll finish Y by Thursday, not 
Tuesday â€” does that break anything?' is always 
better than missing silently."

// Real crunch example:
"During a product launch, we found a critical bug 
24 hours before go-live. I stayed calm, broke the 
problem into components, debugged methodically 
instead of frantically, and fixed it in 3 hours. 
The calm debugging approach is faster than panicked 
thrashing."`,
      language: 'javascript'
    },
    interviewAnswer: '"I work well under pressure" is the expected answer and tells interviewers nothing. Be specific about what pressure looks like for you and the concrete habits you use. Admitting you have a stress response but manage it well is more credible than claiming you\'re stress-immune.',
    commonMistakes: [
      '"I thrive under pressure" with no supporting detail',
      'No mention of seeking help or communicating',
      'Coping strategies that create team problems (becoming short with people)',
      'Glorifying working 80-hour crunches as a badge of honor'
    ],
    realWorldUse: 'Production incidents, tight launch deadlines, and scope creep are constant. Engineers who remain effective under pressure and don\'t create drama are invaluable.',
    followUpQuestions: [
      'Tell me about a time you were under significant pressure. What happened?',
      'How do you support teammates who are stressed?',
      'What do you do when a deadline is clearly unrealistic?'
    ]
  },

  {
    id: 'hr-new-leadership',
    category: 'hr',
    type: 'theory',
    question: 'Describe a time you took initiative or showed leadership without being asked.',
    difficulty: 'intermediate',
    tags: ['leadership', 'initiative', 'star', 'ownership'],
    shortAnswer: 'Use STAR. Show you identified a problem others didn\'t act on, took ownership beyond your job description, and produced a measurable result. Leadership at any level is about initiative, not title.',
    detailedExplanation: 'This question is especially important for mid-to-senior roles. Interviewers want self-starters who don\'t wait to be told what to do. Examples don\'t need to involve managing people â€” refactoring a failing CI pipeline, creating documentation nobody asked for, or organizing a knowledge-sharing session all count. The key elements: you saw a gap, you stepped up, and it had impact.',
    example: {
      code: `// SITUATION:
"At my previous company, our deployment process was 
largely manual â€” someone would SSH into the server, 
pull the latest code, run migrations manually, and 
hope nothing went wrong. We had 2 failed deployments 
in a month that caused downtime. It wasn't my team's 
responsibility â€” DevOps was a single person who was 
already stretched thin."

// INITIATIVE TAKEN:
"I didn't wait to be assigned the work. I spent a 
weekend building a basic GitHub Actions CI/CD pipeline 
that ran tests, built the Docker image, and deployed 
to staging automatically on merge to main. I deployed 
to production manually but with a checklist and 
rollback script included in the PR."

// I then:
"Documented the entire setup in Confluence, presented 
it in our next engineering sync, and offered to help 
the DevOps engineer extend it to production deployments."

// RESULT:
"Within a month, we had fully automated deployments 
to production. Zero deployment-related downtime in 
the 6 months after that. The DevOps engineer told 
me it saved him several hours a week. My manager 
highlighted it in my performance review as 
'engineering initiative beyond scope'."

// What makes this strong:
// - Problem existed, no one was acting
// - Solution was in your skill set but outside your lane
// - You helped others adopt it (not just a personal fix)
// - Measurable impact (zero downtime, hours saved)`,
      language: 'javascript'
    },
    interviewAnswer: 'The best initiative stories solve a real problem that was bothering everyone but nobody owned. If you can quantify the impact â€” time saved, bugs prevented, people helped â€” the story becomes significantly more compelling.',
    commonMistakes: [
      'Describing "initiative" that was actually asked of you',
      'No measurable result or team impact',
      'Solo work that didn\'t help the team',
      'Too junior an example for a senior role'
    ],
    realWorldUse: 'Companies promote people who improve things around them, not just people who do their assigned tasks. Initiative is the #1 signal for senior-level readiness.',
    followUpQuestions: [
      'How did the team respond to what you did?',
      'Did you face any resistance?',
      'What would have happened if you hadn\'t done it?'
    ]
  },

  {
    id: 'hr-new-disagreement-manager',
    category: 'hr',
    type: 'theory',
    question: 'Tell me about a time you disagreed with your manager. What did you do?',
    difficulty: 'intermediate',
    tags: ['disagreement', 'management', 'communication', 'star'],
    shortAnswer: 'Show you raised the disagreement professionally, explained your reasoning with data, listened to their perspective, and ultimately respected the decision even if it went against you. Never badmouth the manager.',
    detailedExplanation: 'This question checks whether you\'re blindly obedient (bad) or combatively independent (also bad). The ideal is "disagree and commit" â€” you voiced a reasoned objection, had a productive dialogue, and supported the final decision regardless of outcome. Managers value people who push back thoughtfully, not people who nod along or go rogue.',
    example: {
      code: `// SITUATION:
"My manager decided we should rewrite our REST API 
endpoints in GraphQL to 'modernize' the stack. I had 
concerns â€” our team had no GraphQL experience, our 
clients were simple, and we were mid-sprint on a 
feature delivery. I disagreed with the timing and scope."

// HOW I RAISED IT:
"I didn't push back in the team meeting. Instead, I 
sent my manager a Slack message: 'I have some concerns 
about the GraphQL migration timing â€” can we find 20 
minutes this week to talk through it?'

In that meeting, I came prepared:
- A list of risks: learning curve during active development, 
  no existing tooling or patterns in our codebase, 
  overkill for our 12 endpoints
- A proposal: spike on GraphQL in Q3 when we have a 
  natural lull, pilot on one domain, then evaluate"

// OUTCOME:
"My manager heard me out, agreed the timing was 
premature, and we deferred the migration to Q3. 
We piloted it on one service first. It went smoothly 
and the team was much better prepared."

// If the decision went the other way:
"Even if my manager had decided to proceed anyway, 
I would have committed fully. I raised my concern, 
it was considered â€” after that, my job is to execute 
well, not to be right."

// Key principles:
// - Private, direct conversation first
// - Data and reasoning, not emotion
// - Proposed an alternative, not just a veto
// - Committed to the final decision`,
      language: 'javascript'
    },
    interviewAnswer: '"Disagree and commit" is the framework to reference. Show you can advocate for your view professionally and then fully support whatever direction is chosen. Managers want teammates who challenge them thoughtfully, not people who either silently comply or openly revolt.',
    commonMistakes: [
      'Badmouthing the manager',
      'Describing a situation where you just gave in with no real discussion',
      'A story where you went around your manager',
      'Still clearly being bitter about the outcome'
    ],
    realWorldUse: 'Technical disagreements with managers about stack choices, priorities, and timelines are constant. Your ability to handle them professionally determines your career trajectory.',
    followUpQuestions: [
      'What if your manager made the same decision you disagreed with again?',
      'Have you ever gone over a manager\'s head?',
      'How do you build trust with a new manager?'
    ]
  },

  {
    id: 'hr-new-adaptability',
    category: 'hr',
    type: 'theory',
    question: 'Tell me about a time you had to quickly adapt to a significant change.',
    difficulty: 'beginner',
    tags: ['adaptability', 'change', 'resilience', 'star'],
    shortAnswer: 'Use STAR. Show that when the ground shifted, you assessed the new reality quickly, adjusted your approach without excessive resistance, and produced a good outcome. Agility is a core engineering trait.',
    detailedExplanation: 'Change is constant in tech: pivots, layoffs, stack migrations, new leadership, cancelled projects. Interviewers want to see that you don\'t get paralyzed or resentful when plans change. Key signals: you assess before reacting, you find what can be salvaged, you communicate with stakeholders, and you deliver despite the disruption.',
    example: {
      code: `// SITUATION:
"Three weeks into building a new payment integration 
feature, the business decided to switch from Stripe 
to a different payment processor (Adyen) due to a 
partnership deal. The integration APIs were completely 
different â€” most of my work couldn't be reused."

// MY RESPONSE:
"My first reaction was frustration, but I contained it. 
In the team meeting I asked two clarifying questions: 
'Is the decision final?' and 'What's the adjusted 
deadline?' Both answers gave me the constraints I 
needed to plan."

// ADAPTATION:
"I spent half a day reading Adyen's docs and comparing 
the webhook events and API structure to what I'd built. 
I identified about 30% of my work (the abstraction layer 
and test structure) was reusable. I rewrote a detailed 
migration plan for my manager: what was reusable, what 
needed rebuilding, and a revised timeline estimate.

I delivered the Adyen integration in 2.5 weeks instead 
of the original 2 â€” faster than the revised estimate."

// LEARNING:
"I started abstracting payment-provider logic behind 
interfaces by default so provider-switching wouldn't 
be a full rewrite next time. That pattern became a 
team standard."

// What this demonstrates:
// - Controlled emotional response to disruption
// - Fast assessment of what's salvageable
// - Proactive communication about timeline impact
// - Learning converted to team-wide improvement`,
      language: 'javascript'
    },
    interviewAnswer: 'The story doesn\'t need to be a triumphant success against all odds. Adapting calmly, communicating the impact honestly, and delivering something good is enough. Showing what you learned and changed structurally makes it stronger.',
    commonMistakes: [
      'A story where the change was minor and adaptation was trivial',
      'Showing resentment toward the decision in the story',
      'No communication with stakeholders about the impact',
      'No learning from the experience'
    ],
    realWorldUse: 'Startups pivot constantly. Large companies restructure. Frameworks deprecate. The ability to adapt without drama is one of the most valuable professional traits.',
    followUpQuestions: [
      'What would you do if a change felt genuinely wrong?',
      'How do you help teammates who struggle with change?',
      'How quickly do you think you adapt compared to others?'
    ]
  },

  {
    id: 'hr-new-collaboration',
    category: 'hr',
    type: 'theory',
    question: 'How do you work with non-technical stakeholders or explain technical concepts to them?',
    difficulty: 'beginner',
    tags: ['communication', 'collaboration', 'non-technical', 'hr'],
    shortAnswer: 'Lead with impact, not implementation. Use analogies and visuals. Confirm understanding without being condescending. Translate "what we built" into "what it means for the business."',
    detailedExplanation: 'As developers grow in seniority, communication with non-technical stakeholders becomes increasingly important. Interviewers â€” especially for senior or lead roles â€” want to see that you can bridge the gap between engineering and business. Key skills: translating technical concepts to business outcomes, not using jargon, calibrating depth to the audience, and confirming understanding.',
    example: {
      code: `// Principles for non-technical communication

// 1. Lead with impact, not implementation
// âŒ "We refactored the database query layer"
// âœ… "We fixed the root cause of the slow reports â€” 
//     they'll load in under 2 seconds now instead of 30"

// 2. Use the right analogy
"Explaining caching to a PM:
'Imagine your phone stores the last 20 contacts you 
called so you don't have to search the full address 
book every time. Our cache does the same for database 
results â€” the most common queries are answered 
instantly from memory.'"

// 3. Calibrate depth to the audience
"With a CEO: 'This will reduce our server costs by 
about $2,000/month.'
With a PM: 'Users will stop seeing the loading 
spinner on the dashboard.'
With a senior engineer: 'We switched from N+1 
queries to batch loading with DataLoader.'"

// 4. Confirm without condescending
"Does that make sense so far?" or 
"Let me know if I'm going too fast or too slow" 
(better than "Is that clear?" which can feel patronizing)

// 5. What to avoid
// âŒ "It's technically complicated to explain"
// âŒ Full technical jargon (API, ORM, latency P99)
// âŒ Skipping the 'why should I care' part

// Real story structure:
"A PM asked why a feature was taking 3 sprints. 
Instead of explaining microservices, I drew a 
quick diagram: 'We need to touch 4 different systems 
that don't talk to each other. Building the bridge 
between them is the time â€” the feature itself is 
actually small.'"`,
      language: 'javascript'
    },
    interviewAnswer: 'The best engineers are translation layers between business and code. Practice one-sentence explanations of what you\'ve built in terms of user or business value. If you can\'t explain it simply, you may not fully understand it yourself.',
    commonMistakes: [
      'Defaulting to technical jargon with non-technical audiences',
      'Being condescending or impatient',
      'Not confirming understanding',
      'Skipping the "why this matters" framing'
    ],
    realWorldUse: 'Product managers, designers, sales teams, and executives are all stakeholders. Senior engineers spend a significant portion of their time on this kind of communication.',
    followUpQuestions: [
      'How do you handle it when a stakeholder pushes back on a technical decision?',
      'Have you ever changed a technical approach based on non-technical feedback?',
      'How do you set technical expectations in project planning?'
    ]
  },

  {
    id: 'hr-new-ownership',
    category: 'hr',
    type: 'theory',
    question: 'Describe a situation where you went above and beyond your job responsibilities.',
    difficulty: 'beginner',
    tags: ['ownership', 'initiative', 'star', 'impact'],
    shortAnswer: 'Use STAR. Show genuine ownership â€” you identified something that needed doing beyond your role, did it, and it benefited the team or product. Not about working extra hours but about taking responsibility.',
    detailedExplanation: 'Going above and beyond isn\'t about logging extra hours â€” it\'s about ownership of outcomes beyond your assigned tasks. This includes: volunteering for high-impact-but-unowned work, helping teammates who are blocked, improving processes nobody asked you to fix, and advocating for users when it wasn\'t required. Companies value this because it signals you care about the product, not just your to-do list.',
    example: {
      code: `// SITUATION:
"We were in QA for a major feature release. I noticed 
that our test environment was missing some production 
data edge cases that had caused bugs in previous releases. 
Setting up better test data wasn't my ticket â€” it was 
'owned' by QA, who was already overwhelmed."

// ACTION:
"I talked to the QA lead informally and learned they 
knew the gap existed but didn't have the backend 
access or SQL knowledge to create the missing fixtures. 
I offered to pair with them for a few hours.

Together, we identified 6 edge-case data scenarios 
from past bug reports. I wrote seed scripts for each 
one and documented how to run them. I also added them 
to our existing fixture setup so they'd be available 
for every future release."

// RESULT:
"We caught 3 bugs in that release that wouldn't have 
been found otherwise â€” two of them were regressions 
that had affected users previously. The QA lead told 
me it was the most useful thing a dev had done for 
them all year. The seed scripts are still in use."

// Why this is 'above and beyond':
// - Not my ticket
// - Required cross-functional collaboration
// - Made a lasting improvement, not a one-time fix
// - Benefited users (bugs caught before release)`,
      language: 'javascript'
    },
    interviewAnswer: 'The strongest stories have three qualities: the work wasn\'t assigned to you, it had real impact, and it benefited someone other than just yourself. Going above and beyond for self-promotion doesn\'t count â€” genuine helpfulness and ownership do.',
    commonMistakes: [
      'Describing extra hours as the "above and beyond" without actual impact',
      'Work that was actually part of your job description',
      'No team or business benefit',
      'One-off work that left no lasting improvement'
    ],
    realWorldUse: 'High-performing teams are full of people who pick up dropped balls before they hit the floor. This trait, more than raw technical skill, often drives promotions.',
    followUpQuestions: [
      'How did your manager react?',
      'Do you find yourself doing this often?',
      'What motivates you to go beyond what\'s required?'
    ]
  },

  // â”€â”€ BATCH 2 (11-20) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  {
    id: 'hr-new-mentor',
    category: 'hr',
    type: 'theory',
    question: 'Have you ever mentored or helped a junior developer? What was your approach?',
    difficulty: 'intermediate',
    tags: ['mentorship', 'leadership', 'teaching', 'collaboration'],
    shortAnswer: 'Show you can transfer knowledge effectively: guide rather than solve, explain the "why" not just the "what", celebrate small wins, and adjust your style to the person. Mentorship is a multiplier skill.',
    detailedExplanation: 'Mentorship signals leadership maturity and team investment. Interviewers for mid-to-senior roles want to see that you can multiply the team\'s output, not just your own. Key behaviors: diagnosing where someone is stuck before jumping in, asking Socratic questions instead of giving answers, providing specific and actionable feedback, and being patient without being patronizing.',
    example: {
      code: `// My mentorship approach

// Principle 1: Guide, don't solve
"When a junior dev asked me why their API call wasn't 
working, I resisted looking at the code immediately. 
Instead: 'Walk me through what you expected to happen 
and what you're seeing instead.'

This usually reveals the misunderstanding faster than 
reading the code, and they internalize the debugging 
process."

// Principle 2: Explain the why
"When reviewing their PRs I never just say 'change this 
to that.' I explain: 'This works, but if the array is 
empty this will throw. Here's why and here's a guard 
pattern you can use everywhere for this situation.'"

// Principle 3: Pair on the right things
"I pair on new concepts and unfamiliar patterns. I don't 
pair on things they can figure out with 20 minutes of 
reading docs â€” that growth is important too."

// Principle 4: Regular check-ins
"Weekly 1-on-1s, even 15 minutes. Two questions: 
'What's going well?' and 'Where are you stuck or 
uncertain?' Most blockers come out in a safe, 
consistent space."

// Concrete outcome:
"The junior developer I mentored over 6 months went 
from needing help on almost every PR to independently 
shipping features and reviewing others' code. Their 
first solo feature shipped with no rework â€” that was 
the milestone I was working toward."`,
      language: 'javascript'
    },
    interviewAnswer: 'Mentorship is about helping someone become independent, not dependent on you. The best mentors make themselves progressively less needed. Showing you understand that distinction sets you apart.',
    commonMistakes: [
      'Describing mentorship as "just answering questions when asked"',
      'Creating dependency instead of independence',
      'Not adjusting style to the individual',
      'No concrete outcome or growth measurement'
    ],
    realWorldUse: 'Senior and staff engineers spend 20-30% of their time on knowledge transfer. Teams that mentor well onboard faster and retain more institutional knowledge.',
    followUpQuestions: [
      'How did you handle it when the mentee made repeated mistakes?',
      'What\'s the hardest part of mentoring?',
      'Do you have a mentor yourself?'
    ]
  },

  {
    id: 'hr-new-ambiguous',
    category: 'hr',
    type: 'theory',
    question: 'How do you handle ambiguous or poorly defined requirements?',
    difficulty: 'intermediate',
    tags: ['ambiguity', 'requirements', 'communication', 'problem-solving'],
    shortAnswer: 'Ask the right clarifying questions, document your understanding, identify assumptions explicitly, build in feedback loops, and don\'t wait for perfect requirements to start. Progress and alignment trump perfect clarity.',
    detailedExplanation: 'Vague requirements are the norm, not the exception. Interviewers â€” especially for product-facing roles â€” want to see that you can operate without a complete specification. The ideal engineer narrows ambiguity through targeted questions, makes reasonable assumptions explicit, ships something to validate early, and iterates. Waiting for perfect requirements is a common junior mistake.',
    example: {
      code: `// My process for ambiguous requirements

// Step 1: List the unknowns explicitly
"When I get a vague ticket like 'improve the dashboard 
performance', I write down every unknown before asking 
anything:
- What metric is 'performance'? Load time? API response?
- Which users are affected? All or a segment?
- What's the target? 2s? 1s? 
- Is this blocking anything or just a complaint?"

// Step 2: Ask targeted, not scattered questions
"I group my questions and bring them in one message 
or meeting â€” not 10 separate pings. I also propose 
answers when I can: 'I'm assuming we want to target 
mobile users on 4G. Is that right?'"

// Step 3: Document the answers
"After the conversation, I write a short summary: 
'Based on our talk, I understand X, I'm assuming Y, 
and the definition of done is Z.' I send it to the PM. 
This surfaces misalignment before I've written a line."

// Step 4: Build to discover
"For highly ambiguous features, I prototype the 
most uncertain part first. If we don't know what 
'seamless onboarding' looks like, I build 3 options 
in a day and show them to the PM. That conversation 
takes 10 minutes and saves 3 days of wrong work."

// What I avoid:
// - Asking every possible question upfront (analysis paralysis)
// - Assuming everything and building the wrong thing
// - Waiting for complete requirements before starting`,
      language: 'javascript'
    },
    interviewAnswer: 'The goal is alignment, not clarity for its own sake. A documented assumption is almost as good as an explicit requirement â€” it\'s verifiable and correctable. Companies want engineers who move forward intelligently, not ones who stall waiting for perfect specs.',
    commonMistakes: [
      'Asking too many questions before starting anything',
      'Building without validating assumptions',
      'Not documenting the agreed-upon understanding',
      '"I just build what I think is right" (no alignment loop)'
    ],
    realWorldUse: 'Product specs are always incomplete. The fastest teams have engineers and PMs who work in tight alignment loops, catching misalignment early and cheaply.',
    followUpQuestions: [
      'Have you ever built something that turned out to be wrong? What happened?',
      'How do you handle a PM who keeps changing requirements?',
      'What do you do if you can\'t get answers from stakeholders?'
    ]
  },

  {
    id: 'hr-new-diversity',
    category: 'hr',
    type: 'theory',
    question: 'How do you contribute to an inclusive and diverse team environment?',
    difficulty: 'beginner',
    tags: ['diversity', 'inclusion', 'teamwork', 'culture'],
    shortAnswer: 'Show specific behaviors: amplifying quieter voices in meetings, making onboarding inclusive, inclusive code review practices, and being aware of unconscious bias. Inclusion is a practice, not a value statement.',
    detailedExplanation: 'Diversity and inclusion questions are now standard at most companies. Interviewers want concrete behaviors, not platitudes. The best answers describe specific, habitual actions that make a team more inclusive: meeting facilitation that includes everyone, mentorship across differences, accessible documentation, and confronting exclusionary behavior professionally.',
    example: {
      code: `// Concrete inclusive behaviors

// 1. Meeting facilitation
"In meetings where I'm a lead, I actively solicit 
input from people who haven't spoken: 'Sam, you've 
worked with this codebase longer than anyone â€” 
what's your read?' 

I also interrupt 'stacktracking' (where the same 
2-3 people dominate): 'Let's make sure we hear 
from everyone before we decide.'"

// 2. Code review tone
"I write code review comments as questions, not 
corrections: 'What was the thinking behind this 
approach?' instead of 'This is wrong because X.'
The question is less threatening and often reveals 
context I didn't have."

// 3. Onboarding and documentation
"I write onboarding docs that assume no tribal 
knowledge â€” no 'just ask Alice' steps. Information 
that lives only in someone's head is exclusionary 
by default."

// 4. Amplifying quieter voices
"When a quieter colleague makes a good point that 
gets glossed over, I explicitly name it: 
'Going back to what Maya said â€” I think that's 
actually the key insight here.'"

// 5. Confronting exclusion professionally
"If I hear an exclusive comment (even if unintentional), 
I address it privately after the meeting: 
'Hey, the comment about [X] may have landed badly â€” 
I don't think you meant it that way but worth knowing.'"`,
      language: 'javascript'
    },
    interviewAnswer: 'Be specific and behavioral. "I believe in diversity" is not an answer. "Here\'s what I actually do" is. You don\'t need a perfect record â€” showing you think about it and act on it consistently is what matters.',
    commonMistakes: [
      'Generic value statements with no actions',
      'Focusing only on hiring, not day-to-day culture',
      'Describing one-time actions instead of habits',
      'Overcomplicating or being preachy'
    ],
    realWorldUse: 'Teams with inclusive cultures retain people longer and produce more creative solutions. Senior engineers are often evaluated on culture contribution, not just output.',
    followUpQuestions: [
      'Have you ever addressed an exclusionary behavior directly?',
      'How do you handle it when someone dismisses inclusion concerns?',
      'What does psychological safety mean to you?'
    ]
  },

  {
    id: 'hr-new-big-picture',
    category: 'hr',
    type: 'theory',
    question: 'How do you balance writing clean code with meeting tight deadlines?',
    difficulty: 'intermediate',
    tags: ['trade-offs', 'technical-debt', 'pragmatism', 'quality'],
    shortAnswer: 'Show you understand that the dichotomy is mostly false: clean code is usually faster. But explain how you make trade-off decisions explicitly â€” what shortcuts are acceptable, when, and how you track debt for cleanup.',
    detailedExplanation: 'This question probes your pragmatism vs idealism balance. Interviewers don\'t want a perfectionist who misses deadlines for beautiful code, nor someone who ships trash under any pressure. The ideal: you have quality standards, you know when to bend them with explicit acknowledgment, you ship working code, and you leave breadcrumbs (TODO comments, tech debt tickets) for cleanup.',
    example: {
      code: `// My framework for clean code vs deadlines

// Core belief:
"The framing as a dichotomy is mostly wrong. Messy code 
usually makes you slower, not faster â€” you spend more 
time debugging and the next person spends more time 
understanding it. Clean code is often the faster path."

// When shortcuts ARE acceptable:
"If it's a hotfix for a critical production bug, 
I take the fastest safe path. I write a tech debt 
ticket immediately, add a TODO comment in the code, 
and fix it properly in the next sprint."

// Minimum quality bar that I never drop:
"Regardless of timeline:
- No hard-coded credentials or magic numbers
- Functions do one thing (can always name it clearly)
- Error paths are handled (not silently swallowed)
- The PR has at least minimal context in the description"

// Communication about trade-offs:
"If a deadline genuinely requires a quality compromise, 
I make it explicit: 'I can ship X by Friday but it will 
need cleanup â€” here's what I'd do differently with 
another day.' This lets the team make an informed 
decision and documents the trade-off."

// Tech debt tracking:
"Every shortcut gets a Jira ticket immediately. Not 
someday. The moment I merge a sub-optimal solution, 
the debt ticket exists. Otherwise it never gets fixed."`,
      language: 'javascript'
    },
    interviewAnswer: 'The answer companies want: you have standards, you\'re pragmatic, you communicate trade-offs explicitly, and you track debt. Claiming you never compromise quality OR that you always prioritize speed are both wrong answers.',
    commonMistakes: [
      '"I always write clean code, deadlines be damned" (not pragmatic)',
      '"Under pressure I just ship anything" (no standards)',
      'Not tracking technical debt at all',
      'No communication about trade-offs to stakeholders'
    ],
    realWorldUse: 'The codebase is a long-running collaboration. Every shortcut that isn\'t tracked becomes someone else\'s confusion. Clean enough + tracked debt is the sustainable model.',
    followUpQuestions: [
      'How do you convince a team to pay down technical debt?',
      'Have you worked in a codebase with very high debt? How did you navigate it?',
      'What does "done" mean to you?'
    ]
  },

  {
    id: 'hr-new-notice',
    category: 'hr',
    type: 'theory',
    question: 'What is your notice period and when can you start?',
    difficulty: 'beginner',
    tags: ['logistics', 'hr', 'notice-period', 'start-date'],
    shortAnswer: 'Be honest about your notice period. Most companies expect 2-4 weeks. If you have a longer notice period, frame it as professionalism. Don\'t promise a start date you can\'t honor.',
    detailedExplanation: 'This is a logistics question, but how you handle it reveals professionalism. Interviewers want honesty (not a start date you\'ll later change), commitment (honoring your current employer\'s notice period), and reasonable flexibility. Many companies can accommodate 4-6 week starts for the right candidate. Never burn bridges by leaving without proper notice.',
    example: {
      code: `// Honest, professional answers

// Standard notice period:
"I have a standard 2-week notice period at my current 
company. Once I have an offer in hand, I'd give notice 
immediately and could start on [specific date]."

// Longer notice period:
"My contract requires 4 weeks' notice, which I intend 
to honor. I want to transition my work properly â€” I'd 
rather take the time to hand off well than leave the 
team in a difficult spot. I could start on [date + 4 weeks]."

// If you need time for personal reasons:
"I can give 2 weeks' notice, but I'd also appreciate 
2 weeks before starting for [moving, family matter â€” 
brief reason]. I could start [4 weeks from now]. 
If the start date is flexible, that would be ideal."

// If currently unemployed:
"I'm currently available immediately. I'd want a 
week to wrap up some personal commitments, but 
I could realistically start [1 week from offer acceptance]."

// What NOT to do:
// âŒ Say you can start sooner than you can
// âŒ Abandon your current employer without notice
//    (it tells the new employer you'll do the same to them)
// âŒ Be vague: "sometime next month"
// âŒ Promise flexibility you don't have

// Pro tip:
// If start date matters to the company, ask:
// "Is the start date flexible or is there a hard date 
//  I should be aware of?"`,
      language: 'javascript'
    },
    interviewAnswer: 'Honoring your notice period is a signal of integrity. Companies that would pressure you to abandon it are often not companies you want to work for. Give an honest date and stick to it.',
    commonMistakes: [
      'Overpromising a start date and needing to push it back',
      'Agreeing to start immediately when you have obligations',
      'Vague answers that delay planning',
      'Not asking about the company\'s timeline flexibility'
    ],
    realWorldUse: 'Offer negotiations often include start date discussions. Being clear and honest upfront prevents complications and shows professionalism.',
    followUpQuestions: [
      'Could you start earlier if needed?',
      'Is your current employer likely to counter-offer?',
      'Are you interviewing elsewhere?'
    ]
  },

  {
    id: 'hr-new-job-hopping',
    category: 'hr',
    type: 'theory',
    question: 'Your resume shows you\'ve changed jobs frequently. Can you explain that?',
    difficulty: 'intermediate',
    tags: ['job-hopping', 'career', 'hr', 'framing'],
    shortAnswer: 'Don\'t be defensive. Each move should have a clear, positive reason: layoff, company closed, better opportunity, skill growth. Show a thread of intentional career progression, not aimless jumping.',
    detailedExplanation: 'Job hopping is more accepted now (2-year tenures are common in tech) but multiple <1-year stints still raise flags. Interviewers want to know you left for growth reasons, not because you were pushed out or can\'t get along with people. Each transition should demonstrate learning or intentional progression. Explaining honestly is far better than being evasive.',
    example: {
      code: `// Framing each transition positively

// Layoff (simple, honest):
"Company A was acquired and my team was eliminated 
during the merger. That was outside my control."

// Better opportunity:
"Company B was a good role but after 14 months 
there was no path to the backend work I wanted. 
When Company C offered a full-stack role with 
a Node.js stack, it was the right growth move."

// Startup that closed:
"Company D was an early-stage startup that ran 
out of funding. I learned an enormous amount in 
10 months but the business didn't survive. 
I was proud of what we shipped."

// Narrative arc (tie it together):
"Looking at the full picture: A was a layoff, 
D was a closure â€” both involuntary. B to C was 
intentional because I wanted backend experience. 
Each move has been toward full-stack depth and 
more complex systems. This role is the right 
next step for that same reason."

// Commitment signal:
"I'm aware the resume looks like a lot of moves. 
What I can tell you is I've stayed through difficulty 
when there was a reason to â€” at Company C I turned 
down a higher offer from a competitor because I 
wanted to finish the product launch I'd started."

// What to avoid:
// âŒ Vague: "I just wanted new challenges each time"
// âŒ Badmouthing former employers
// âŒ Defensive or apologetic tone`,
      language: 'javascript'
    },
    interviewAnswer: 'Anticipate this question and prepare a clear, confident narrative for each transition. The interviewer is checking for a pattern of instability or poor judgment â€” show them neither by being direct and having coherent reasons.',
    commonMistakes: [
      'Appearing defensive or embarrassed',
      'Vague reasons that sound made up',
      'Not having a commitment signal for the new role',
      'Badmouthing companies you left'
    ],
    realWorldUse: 'Hiring managers discuss this explicitly. A strong explanation with clear reasons and a confident delivery can completely neutralize the concern.',
    followUpQuestions: [
      'How long do you plan to stay in this role?',
      'What would make you leave this job?',
      'Have you received counter-offers in past transitions?'
    ]
  },

  {
    id: 'hr-new-workstyle',
    category: 'hr',
    type: 'theory',
    question: 'Are you more of an independent worker or do you prefer collaborating with a team?',
    difficulty: 'beginner',
    tags: ['work-style', 'collaboration', 'independence', 'hr'],
    shortAnswer: 'The right answer is both â€” show you\'re comfortable with deep individual focus AND collaborative work, and that you know when each mode is appropriate. Explain with concrete examples.',
    detailedExplanation: 'This question assesses self-awareness about work style and fit. Most engineering roles require both modes: deep solo focus for coding and debugging, collaboration for design, code review, and planning. Neither extreme (lone wolf or can\'t work without constant input) is ideal. Demonstrate range and situational awareness.',
    example: {
      code: `// Balanced answer with specifics

// Independent mode (when and why):
"For implementation work â€” actually writing code, 
debugging, and problem-solving â€” I prefer deep, 
uninterrupted blocks. I do my best work in 2-3 hour 
focus sessions with no Slack interruptions. 
I protect those blocks aggressively."

// Collaborative mode (when and why):
"For design decisions, architecture discussions, 
and code review, collaboration is essential â€” 
you simply can't get to the best solution alone. 
Two people reviewing a system design catch 90% 
of what one person misses."

// How I switch modes:
"I batch communication. I check Slack/email at 
10am and 3pm rather than constantly. This means 
I can be responsive and collaborative without 
fragmenting my focus time."

// Concrete example:
"On my last team, we'd design together on Monday 
(everyone in the room, whiteboard, full discussion), 
then split off to implement independently for 
most of the week, then reconvene for code review 
and integration. That rhythm felt ideal."

// What I ask about new teams:
"I ask about a team's communication norms early â€” 
not because I need a specific style, but because 
I want to match the rhythm of the team rather than 
create friction by operating differently."`,
      language: 'javascript'
    },
    interviewAnswer: 'Context-dependent is the only honest and correct answer. If you claim pure independence, they\'ll worry about isolation and alignment. If you claim you only work well collaborating, they\'ll worry about focus and productivity.',
    commonMistakes: [
      'Claiming one style exclusively',
      'No concrete examples of either mode',
      'Not connecting work style to role requirements',
      'Sounding like you don\'t know yourself'
    ],
    realWorldUse: 'Engineering cultures vary enormously â€” some are highly async and independent, others are highly collaborative. Knowing your style and asking about theirs is smart interview practice.',
    followUpQuestions: [
      'How do you handle it when collaboration is needed but your team prefers working independently?',
      'Do you prefer pair programming?',
      'How do you handle open-plan or noisy work environments?'
    ]
  },

  {
    id: 'hr-new-motivation',
    category: 'hr',
    type: 'theory',
    question: 'What motivates you in your work?',
    difficulty: 'beginner',
    tags: ['motivation', 'values', 'hr', 'culture-fit'],
    shortAnswer: 'Be genuine. Common authentic motivators for engineers: solving hard problems, seeing users benefit, learning new things, building something from scratch, mentoring others. Connect your motivator to this specific role.',
    detailedExplanation: 'Motivation questions probe values alignment and predict retention. Companies want people motivated by the work itself, not just external rewards. Intrinsic motivators (mastery, autonomy, purpose) are more sustainable and signal someone who will stay engaged. The best answers are specific enough to be believable and connect directly to what the role offers.',
    example: {
      code: `// Genuine motivation answers

// Motivator: Solving hard problems
"I get genuine satisfaction from debugging a complex 
problem that's stumped the team for days. The moment 
the root cause clicks â€” that's the feeling I chase. 
This role appeals to me because the distributed 
systems challenges you described are exactly the 
kind of hard problems I want to work on."

// Motivator: User impact
"What energizes me most is seeing real people use 
something I built. When I shipped the search redesign 
at my last job, I read through user feedback for days 
â€” seeing users find things they couldn't find before 
was deeply satisfying. A consumer product at this 
scale would give me that multiplied significantly."

// Motivator: Learning
"I'm motivated by the steep parts of the learning curve. 
When I'm in new territory â€” unfamiliar codebase, 
new technology, new domain â€” I'm at my most engaged. 
I deliberately seek out the parts of a problem I 
don't understand yet."

// Motivator: Mentoring and team building
"Increasingly, what I find motivating is helping 
other people get unstuck. When a junior dev ships 
their first feature independently after I've worked 
with them â€” that's more satisfying than shipping 
the feature myself."

// âŒ Avoid:
// "I'm motivated by salary and growth" (transactional)
// "I love coding" (too vague)
// "I want to be a senior engineer" (title focus)`,
      language: 'javascript'
    },
    interviewAnswer: 'Specificity makes motivation believable. Generic answers sound performed. Think about what actually got you out of bed excited about a project and describe that â€” even small examples are more convincing than polished abstractions.',
    commonMistakes: [
      'Pure extrinsic motivators (money, title)',
      'Vague answers ("I love technology")',
      'Motivation that contradicts what the role offers',
      'Saying what you think they want to hear'
    ],
    realWorldUse: 'Misalignment of motivation and role is the #1 cause of attrition in 1-2 year tenure employees. Companies genuinely want to know if this will be energizing work for you.',
    followUpQuestions: [
      'What demotivates you?',
      'What was the most motivating project you\'ve worked on?',
      'How do you stay motivated during repetitive or routine work?'
    ]
  },

  {
    id: 'hr-new-mistake-process',
    category: 'hr',
    type: 'theory',
    question: 'How do you handle making a mistake that impacts the team or product?',
    difficulty: 'intermediate',
    tags: ['mistakes', 'accountability', 'process', 'blameless-culture'],
    shortAnswer: 'Acknowledge immediately, contain the impact, communicate transparently, fix it, and run a post-mortem to prevent recurrence. Speed of acknowledgment and quality of prevention matters more than the mistake itself.',
    detailedExplanation: 'How someone handles mistakes tells you more about them than whether they make them â€” everyone makes mistakes. Interviewers want to see: fast acknowledgment (no covering up), clear-headed problem-solving under stress, transparent communication with affected parties, and a systemic fix that prevents recurrence. Blameless post-mortems are the gold standard.',
    example: {
      code: `// My process when I make a mistake

// Step 1: Acknowledge immediately
"When I realize I've made a mistake, I tell my 
team immediately â€” even before I know the full 
scope. 'I think I may have broken X â€” I'm investigating 
now, will update in 30 minutes.'

Waiting until I have a solution before acknowledging 
the problem wastes everyone else's time."

// Step 2: Contain and fix
"I focus on containment first: is there a hotfix, 
a rollback, a feature flag I can toggle? Then I 
work on the proper fix, often with help."

// Step 3: Communicate transparently
"After resolution, I write a clear post-mortem: 
what happened, timeline, root cause, impact, and â€” 
most importantly â€” what I'm changing to prevent it. 
Not 'I'll be more careful' but specific process changes."

// Step 4: No defensive post-mortem
"I write post-mortems as systems problems, not 
person problems. 'The bug was possible because 
we had no integration test for this code path' 
is more useful than 'I forgot to check the edge case.'"

// Real example:
"I once deployed a migration that caused a data 
inconsistency for a small set of users. I caught 
it in monitoring 20 minutes later. Immediate Slack 
to the team, rollback in 30 minutes, all affected 
records restored within 2 hours. Post-mortem the 
next day added a staging data check to the migration 
process. No repeat in 18 months."`,
      language: 'javascript'
    },
    interviewAnswer: 'Companies with good engineering cultures run blameless post-mortems specifically because they know mistakes are inevitable. What they\'re evaluating is your transparency and improvement process, not your perfection.',
    commonMistakes: [
      'Minimizing or hiding mistakes initially',
      'Blaming others or external factors',
      'Vague prevention: "I\'ll be more careful next time"',
      'No post-mortem or systemic improvement'
    ],
    realWorldUse: 'Production incidents happen. Engineers who handle them with transparency and improve processes afterward are invaluable. Engineers who cover up or deflect create toxic dynamics.',
    followUpQuestions: [
      'How do you create a culture where people admit mistakes?',
      'Have you ever seen a mistake handled badly by a team? What happened?',
      'What\'s the biggest mistake you\'ve made technically?'
    ]
  },

  {
    id: 'hr-new-passion-project',
    category: 'hr',
    type: 'theory',
    question: 'Do you have any personal projects or side projects you\'re working on?',
    difficulty: 'beginner',
    tags: ['side-projects', 'passion', 'self-learning', 'initiative'],
    shortAnswer: 'Share something genuine â€” even a small, unfinished project shows curiosity and initiative. Explain what problem it solves, what you\'re learning from it, and why you built it. Not having side projects isn\'t disqualifying, but having one is an asset.',
    detailedExplanation: 'Side projects are an optional but impactful signal of genuine passion for the craft. Interviewers aren\'t looking for a polished product â€” they\'re looking for self-directed learning and curiosity beyond the day job. Even a half-built CLI tool or a small open source contribution is meaningful. If you don\'t have side projects, answer honestly and redirect to other forms of continuous learning.',
    example: {
      code: `// If you have a side project (be specific):
"I'm building a personal finance tracker because 
I was frustrated with existing apps â€” they're either 
too simple or require connecting bank accounts, which 
I don't want to do. It's a Next.js app with a Postgres 
database and CSV import from bank statements.

The app itself isn't the interesting part â€” I'm 
using it to learn proper database design with real 
normalization challenges and to experiment with 
React Server Components in Next.js 14. It's helped 
me understand RSC trade-offs much better than any 
tutorial would."

// If you have an open source contribution:
"I maintain a small utility library for formatting 
currency in different locales â€” it has about 200 
stars on GitHub. It was born from a problem I had 
at work. Maintaining it taught me about semver, 
release management, and handling issue reports from 
strangers â€” a different skill than building something 
yourself."

// If you don't have active side projects (honest):
"I don't have an active side project right now â€” 
I've found that after a full work week I need real 
downtime to stay sustainable. What I do instead 
is spend time reading and working through structured 
courses â€” currently going through the Rust book and 
building the exercises."

// âŒ Avoid:
// Pretending you have a side project you don't
// A project you haven't touched in 2 years
// Vague: "I'm always experimenting with new things"`,
      language: 'javascript'
    },
    interviewAnswer: 'Genuine and specific beats polished and vague. A half-built project you\'re actually learning from is more impressive than a finished project you can\'t speak to with depth. And if you genuinely don\'t build side projects, say so and explain how you learn instead.',
    commonMistakes: [
      'Claiming a project you can\'t discuss in depth',
      'A project so old you\'ve forgotten the details',
      'Pretending you have one when you don\'t',
      'Not explaining what you learned, only what you built'
    ],
    realWorldUse: 'Side projects are conversation starters and depth probes. They often lead to the most genuine and interesting interview conversations.',
    followUpQuestions: [
      'What was the hardest part of building it?',
      'Would you ever try to monetize it?',
      'What would you do differently if you started over?'
    ]
  },

  // â”€â”€ BATCH 3 (21-30) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  {
    id: 'hr-new-biggest-achievement',
    category: 'hr',
    type: 'theory',
    question: 'What is your biggest professional achievement?',
    difficulty: 'beginner',
    tags: ['achievement', 'impact', 'star', 'hr'],
    shortAnswer: 'Use STAR. Pick something with measurable impact, where you played a key role, and that relates to the work you\'d do in the new role. Quantify whenever possible.',
    detailedExplanation: 'This is your highlight reel question. The goal is to pick your strongest, most relevant story with the most concrete impact. Don\'t be modest â€” this is the time to quantify your best work. Connect the achievement to skills the new role requires. If you have multiple candidates, pick the one most aligned with the role and save the others for follow-up questions.',
    example: {
      code: `// Strong achievement answer with STAR

// SITUATION + TASK:
"In my previous role, we had a checkout flow with 
a 68% cart abandonment rate on mobile â€” well above 
industry average. The PM tasked me with leading 
a redesign to bring it down."

// ACTION (specific and in-depth):
"I started with data: set up session recordings 
with Hotjar and analyzed where users were dropping 
off. Found three critical friction points:
1. The form required 14 fields on a single page
2. Credit card entry had no formatting help
3. Error messages appeared at the top of the form, 
   far from where users were typing

I redesigned the form into a 3-step flow (contact, 
shipping, payment), added real-time input formatting 
and validation, and moved inline error messages 
to appear next to the relevant field.

I worked with the designer on 3 iterations, ran 
A/B tests on each, and shipped the winning variant 
after 2 weeks of data."

// RESULT:
"Mobile cart abandonment dropped from 68% to 41% â€” 
a 27-point improvement. On our traffic volume, that 
translated to roughly $180,000 in additional monthly 
revenue. It was the highest-impact project I've shipped 
and it was recognized in the company's quarterly review."

// Why this is strong:
// - Specific baseline (68%) and outcome (41%)
// - Data-driven process
// - Business impact in dollars
// - Team collaboration mentioned`,
      language: 'javascript'
    },
    interviewAnswer: 'The difference between a good answer and a great answer is specificity. "I improved checkout conversion" is forgettable. "Cart abandonment dropped 27 points, translating to $180k/month" is memorable. Always tie technical work to business outcomes.',
    commonMistakes: [
      'Vague outcomes ("it went really well")',
      'Team achievement presented as personal (use "I" where accurate)',
      'Choosing an achievement too small for your experience level',
      'No connection to the skills needed for the new role'
    ],
    realWorldUse: 'This answer should be in every developer\'s preparation list. It\'s asked universally and sets the tone for technical depth discussions.',
    followUpQuestions: [
      'What would you have done differently?',
      'What was the hardest part of that project?',
      'How did the team contribute to that success?'
    ]
  },

  {
    id: 'hr-new-culture-fit',
    category: 'hr',
    type: 'theory',
    question: 'How would your colleagues describe you?',
    difficulty: 'beginner',
    tags: ['self-perception', 'hr', 'culture', 'soft-skills'],
    shortAnswer: 'Give 3 specific traits with brief supporting examples. Balance technical and soft skills. Be honest â€” interviewers often reference-check, and you want alignment between self-perception and how you actually are.',
    detailedExplanation: 'This question probes self-awareness and personal brand. Interviewers compare what you say against how you present in the interview. Key: pick traits that are genuine, relevant to the role, and that you can support with a quick example. Avoid generic answers ("hardworking", "dedicated") that everyone says. Specific, slightly surprising traits ("I\'m the person who writes the post-mortems nobody asked for") are more memorable.',
    example: {
      code: `// Strong 3-trait answer with examples

// Trait 1: Technical reliability
"They'd probably say I'm someone you can always 
count on to ship what I commit to. I have a 
personal rule: if I say I'll have something done 
by Thursday, it's done by Thursday â€” and if it 
looks like it won't be, I flag it by Tuesday, 
not Thursday morning."

// Trait 2: Communicative
"They'd also say I over-communicate in writing. 
I leave detailed PR descriptions, update ticket 
status proactively, and document decisions in 
Notion the same day we make them. A few teammates 
have told me my PRs are the easiest to review on 
the team because of the context I include."

// Trait 3: Curious/honest
"And probably that I ask a lot of questions â€” 
not because I'm confused, but because I like to 
understand the 'why' behind decisions. I've been 
told it makes meetings more productive because 
it surfaces assumptions people didn't realize 
they were making."

// Optional: add a weakness-adjacent trait for authenticity
"If they were being completely honest, they'd 
also say I can be slow to delegate â€” I sometimes 
hold on to tasks longer than I should instead 
of asking for help. I'm actively working on that."

// âŒ Generic answers to avoid:
// "Hardworking" â€” everyone says this
// "Team player" â€” means nothing without example
// "Passionate about code" â€” clichÃ©`,
      language: 'javascript'
    },
    interviewAnswer: 'Brief examples make traits credible. The optional weakness-adjacent trait at the end adds authenticity â€” it shows self-awareness without undermining the positive picture.',
    commonMistakes: [
      'Three generic traits with no examples',
      'Traits that are irrelevant to the role',
      'No self-awareness about areas of growth',
      'Describing yourself as your team rather than you individually'
    ],
    realWorldUse: 'Reference checks genuinely ask former colleagues about you. Alignment between your self-description and what references say is a strong signal of integrity.',
    followUpQuestions: [
      'Is there anything your colleagues might say that would surprise us?',
      'How do you think you\'d be described by someone who found you challenging to work with?',
      'What\'s something you wish colleagues knew about how you work?'
    ]
  },

  {
    id: 'hr-new-work-life-balance',
    category: 'hr',
    type: 'theory',
    question: 'How do you manage work-life balance?',
    difficulty: 'beginner',
    tags: ['work-life-balance', 'sustainability', 'hr', 'wellbeing'],
    shortAnswer: 'Show that you have clear boundaries and sustainable habits â€” and that you perform better because of them, not despite them. Avoiding burnout benefits the team, not just you.',
    detailedExplanation: 'Companies increasingly understand that burnout is bad for productivity. They want people who are sustainable, not martyrs who flame out. Key signals: you have real boundaries, you communicate about capacity honestly, and you take proper downtime. Avoid glorifying overwork â€” it\'s a red flag in 2025, not a virtue signal.',
    example: {
      code: `// Healthy work-life balance framing

// Clear shutdown routine:
"I have a firm end time â€” usually 6pm. I close 
Slack on my personal devices after that. Not because 
I don't care about my work, but because I've found 
that I produce higher quality work in focused hours 
than I do grinding through low-energy evenings."

// Protecting recovery time:
"On weekends, I don't check work messages. I have 
hobbies that are completely unrelated to tech â€” 
[running, cooking, reading â€” whatever is genuine]. 
This isn't laziness; it's maintenance. I come back 
Monday genuinely refreshed."

// Crunch transparency:
"When there's a genuine crunch â€” a launch, a critical 
incident â€” I put in extra hours without complaint. 
But I also expect recovery time afterward. If we 
sprint, we rest. I've worked at a place that expected 
permanent crunch mode and it wasn't sustainable for 
anyone."

// Capacity communication:
"If I'm already at capacity and new work comes in, 
I surface it: 'I'm currently on X and Y. If you 
add Z, one of these needs to shift. Which is the 
priority?' This protects quality across everything."

// What this shows:
// - Self-awareness about sustainable pace
// - Honesty about capacity
// - Real recovery habits
// - Flexibility for genuine emergencies`,
      language: 'javascript'
    },
    interviewAnswer: 'Describing clear boundaries with the reasoning behind them (better focus, better quality) reframes limits as professionalism. Avoid both extremes: "I work until it\'s done, no matter what" (unsustainable) and "I never work past 5pm" (inflexible).',
    commonMistakes: [
      'Glorifying overwork or "I\'m always available"',
      'Sounding rigid and inflexible for genuine emergencies',
      'Not connecting recovery to performance',
      'Vague answers with no actual habits described'
    ],
    realWorldUse: 'Burnout costs companies roughly 3-6 months of output per engineer who burns out and leaves. Sustainable engineers are an asset. Most good companies know this now.',
    followUpQuestions: [
      'Have you ever burned out? How did you recognize it?',
      'How do you handle it when the company culture expects long hours?',
      'What do you do to recharge?'
    ]
  },

  {
    id: 'hr-new-decision-making',
    category: 'hr',
    type: 'theory',
    question: 'How do you make decisions when you don\'t have all the information?',
    difficulty: 'intermediate',
    tags: ['decision-making', 'ambiguity', 'judgment', 'hr'],
    shortAnswer: 'Gather the minimum viable information needed for the decision, make assumptions explicit, choose reversible actions when possible, decide with confidence, and course-correct when new data arrives.',
    detailedExplanation: 'Most real decisions are made with incomplete information. Perfect data is rarely available. Interviewers want to see a rational, time-bounded decision-making framework â€” not someone who is paralyzed without complete information, nor someone who makes gut-only calls. Key principles: distinguish reversible from irreversible decisions, set a decision deadline, document the assumptions, and remain genuinely open to changing course.',
    example: {
      code: `// Decision-making framework under uncertainty

// 1. Classify the decision
"First I ask: is this reversible or irreversible?
- Reversible (can undo): decide fast, move forward, 
  adjust based on results
- Irreversible (can't undo): gather more data, 
  consult others, slow down"

// 2. Identify the key unknown
"Instead of trying to answer every question, I 
identify the one unknown that matters most for 
the decision. Often 80% of uncertainty collapses 
once you resolve that single key question."

// 3. Make assumptions explicit
"I list what I'm assuming and state it: 
'I'm deciding based on the assumption that X. 
If X turns out to be false, we'll need to revisit.'
Explicit assumptions can be checked. Implicit ones 
bite you later."

// 4. Set a decision deadline
"Open decisions are expensive. I set a time box: 
'I'll decide by EOD tomorrow unless I learn 
something that changes the framing.'"

// Real example:
"We needed to pick a state management library 
before our PM was back from leave. I had Redux, 
Zustand, and Jotai to evaluate. I spent 3 hours 
prototyping the most complex use case in each one, 
chose Zustand as the clearest fit, documented 
my reasoning and assumptions, and flagged it 
in Slack for async review. PM approved on their 
return. No one lost time waiting."`,
      language: 'javascript'
    },
    interviewAnswer: 'Amazon\'s "disagree and commit" and "two-way door vs one-way door" frameworks are worth referencing here. The core insight: most decisions are reversible, and reversible decisions should be made fast with explicit assumptions. Irreversible decisions deserve more care.',
    commonMistakes: [
      'Waiting for perfect information (paralysis)',
      'Gut-only decisions with no documented reasoning',
      'Not flagging assumptions to stakeholders',
      'Not revisiting decisions when new information arrives'
    ],
    realWorldUse: 'Tech leads and senior engineers make dozens of impactful decisions weekly under uncertainty. This skill separates good senior engineers from great ones.',
    followUpQuestions: [
      'Have you ever made a decision that turned out to be wrong? What happened?',
      'How do you handle a situation where your decision was overruled?',
      'How do you know when you have enough information to decide?'
    ]
  },

  {
    id: 'hr-new-relocation',
    category: 'hr',
    type: 'theory',
    question: 'Are you open to relocation or travel for this role?',
    difficulty: 'beginner',
    tags: ['logistics', 'relocation', 'travel', 'hr'],
    shortAnswer: 'Answer honestly with your actual constraints. If open to relocation, say so. If not, say so clearly and ask if remote is an option. Vagueness wastes everyone\'s time.',
    detailedExplanation: 'This is a straightforward logistics question. Interviewers are checking compatibility with role requirements. Honesty is essential â€” misrepresenting flexibility leads to problems at offer stage or after joining. If travel is involved, ask what "some travel" or "occasional" means in specific terms (days per month, international or domestic).',
    example: {
      code: `// Honest and direct answers

// Open to full relocation:
"Yes, I'm open to relocating. I'm currently in 
[city] but I'm flexible. How soon would the 
company need the move to happen?"

// Open to relocation with a timeline:
"I'm open to relocating, though I'd need about 
2 months to manage the transition â€” wrapping up 
my lease and finding housing. Would that work 
with the timeline?"

// Not open to relocation but flexible on remote:
"I'm not in a position to relocate right now due 
to [family, partner's job â€” brief honest reason]. 
Is there flexibility for this role to be remote 
or hybrid? I saw the job description mentioned 
[location] â€” I want to make sure we're aligned 
before going further."

// Travel question â€” ask for specifics:
"I'm comfortable with occasional travel. Can you 
give me a sense of what that looks like in practice â€” 
roughly how many days per month and mostly domestic 
or international?"

// If travel is a hard constraint:
"My situation makes more than 1-2 days of travel 
per month difficult. If the role requires significant 
travel, I want to know that upfront so we can figure 
out if it's workable."

// âŒ Avoid:
// Being vague to avoid the conversation
// Saying yes when the answer is no
// Not asking for specifics on "some travel"`,
      language: 'javascript'
    },
    interviewAnswer: 'This is a compatibility question, not a commitment question. Be clear about your actual constraints early â€” discovering misalignment at the offer stage wastes everyone\'s time and goodwill.',
    commonMistakes: [
      'Being vague to delay an uncomfortable answer',
      'Agreeing to things you\'re not actually willing to do',
      'Not asking what "some travel" or "occasional travel" actually means',
      'Not proactively asking about remote flexibility if relocation isn\'t possible'
    ],
    realWorldUse: 'Companies with office requirements often lose candidates late in the process over location mismatches. Surfacing it early benefits both sides.',
    followUpQuestions: [
      'How soon could you be on-site if needed?',
      'Do you have any experience working across time zones?',
      'What\'s your current commute/work setup?'
    ]
  },

  {
    id: 'hr-new-learn-fast',
    category: 'hr',
    type: 'theory',
    question: 'Tell me about a time you had to learn something new very quickly.',
    difficulty: 'beginner',
    tags: ['learning', 'adaptability', 'fast-learning', 'star'],
    shortAnswer: 'Use STAR. Show your method for learning under time pressure: ruthless prioritization of what matters for the task, learning-by-doing over passive study, and asking the right people the right questions.',
    detailedExplanation: 'Fast learning is one of the most valuable engineering skills. Every new job, codebase, or technology requires it. Interviewers want to see a repeatable system â€” not luck or natural talent. Key behaviors: identify the minimum you need to learn for the task at hand, learn by building something, use official docs before YouTube, and ask targeted questions to colleagues rather than asking them to explain everything.',
    example: {
      code: `// SITUATION:
"Two weeks into a new job, I was asked to fix a 
critical bug in a Kubernetes deployment â€” a system 
I'd never worked with before. The bug was causing 
intermittent pod restarts that affected 15% of users."

// MY FAST-LEARNING APPROACH:
"I didn't try to learn Kubernetes from scratch. 
I focused on exactly what I needed:
1. How to read pod logs: kubectl logs <pod-name>
2. How to describe a pod: kubectl describe pod
3. What resource limits look like in a deployment YAML

I read only the relevant sections of the Kubernetes 
docs, spent 20 minutes watching a pod logs tutorial, 
and asked a senior DevOps engineer one specific 
question: 'What should I look for in pod events 
to diagnose OOM kills?'

That one question saved me 2 hours of investigation."

// RESULT:
"I identified that the pods were hitting memory 
limits due to a misconfigured heap setting in 
the Node.js app. Fixed the deployment YAML, 
deployed, and pods stabilized within 30 minutes. 
Total time from zero Kubernetes knowledge to 
resolved: about 3 hours."

// My general fast-learning system:
// 1. Narrow to the minimum viable knowledge for the task
// 2. Official docs > tutorials for accuracy
// 3. Build/apply immediately â€” don't just read
// 4. Ask experts targeted, specific questions
// 5. Write down what I learn (it sticks better)`,
      language: 'javascript'
    },
    interviewAnswer: 'The system is the story. "I\'m a fast learner" is meaningless. Describing exactly how you narrowed scope, where you went for information, and how you applied it immediately is the answer that impresses.',
    commonMistakes: [
      'Claiming "I just figured it out" with no process described',
      'Story where the learning took months (not fast enough)',
      'Learning something trivial â€” not a meaningful challenge',
      'No measurable outcome from the learning'
    ],
    realWorldUse: 'Switching companies, migrating technology stacks, taking on new domains â€” fast learning is needed constantly throughout an engineering career.',
    followUpQuestions: [
      'How do you retain what you learn quickly?',
      'What\'s your go-to approach when you\'re completely stuck on something new?',
      'How do you know when you know enough to proceed?'
    ]
  },

  {
    id: 'hr-new-open-source',
    category: 'hr',
    type: 'theory',
    question: 'Have you contributed to open source? If not, is it something you\'re interested in?',
    difficulty: 'beginner',
    tags: ['open-source', 'community', 'hr', 'initiative'],
    shortAnswer: 'If yes, be specific about what you contributed and what you learned. If no, be honest and talk about how you use open source, your interest in contributing, and what has held you back.',
    detailedExplanation: 'Open source contributions are a bonus, not a requirement. Interviewers at companies that value open source community (many product companies do) use this to gauge initiative, code sharing habits, and community engagement. Contribution doesn\'t mean a major PR â€” it includes documentation improvements, bug reports, small fixes, or maintaining your own library.',
    example: {
      code: `// If you have contributed:
"I\'ve made small contributions to two projects. 
For React Query, I fixed a typo in the docs 
and then submitted a small PR that added a 
missing TypeScript overload for a mutation hook. 
It got merged after one review cycle.

More substantially, I maintain a small utility 
library I open-sourced from a work project â€” 
it's a set of form validation helpers. It has 
about 150 stars, which means people are using it, 
and I respond to issues within a few days. 
That experience of maintaining something and 
responding to users has made me much more 
empathetic when I file issues on other projects."

// If you haven't contributed formally:
"I haven't submitted a PR to a major project yet. 
I use open source extensively â€” most of my stack 
is open source â€” and I've filed a few detailed 
bug reports with reproductions, which I think 
of as a light form of contribution.

Contributing code has been on my list and I've 
held back mainly from imposter syndrome about 
code quality standards. I'm planning to start 
with documentation contributions on a library 
I use daily â€” lower bar, high value for the project."

// âŒ Don't say:
// "I don't have time for that"
// "I don't think my code is good enough for public"
//  (without having tried)`,
      language: 'javascript'
    },
    interviewAnswer: 'Honesty beats inflation here. A detailed bug report or documentation fix is a genuine contribution. Claiming you\'ve contributed something you can\'t speak to in depth is easy to expose.',
    commonMistakes: [
      'Inflating minor contributions',
      'Being defensive if you haven\'t contributed',
      'Not mentioning open source you use and benefit from',
      'No genuine interest expressed if you haven\'t contributed yet'
    ],
    realWorldUse: 'Companies that publish open source tools specifically value engineers who engage with the community. It\'s a differentiator but not a dealbreaker at most places.',
    followUpQuestions: [
      'What open source tools do you use daily?',
      'Is there a project you\'d love to contribute to?',
      'How do you evaluate the quality of an open source library before using it?'
    ]
  },

  {
    id: 'hr-new-impact-story',
    category: 'hr',
    type: 'theory',
    question: 'Tell me about a project you\'re particularly proud of.',
    difficulty: 'beginner',
    tags: ['pride', 'impact', 'star', 'hr'],
    shortAnswer: 'Pick a project with a meaningful outcome, real challenges you overcame, and ideally some connection to the work in the new role. Explain what you\'re proud of: the outcome, the process, the collaboration, or the learning.',
    detailedExplanation: 'This is an open-ended story question that reveals values and judgment. What you\'re proud of signals what you care about â€” impact, technical elegance, user outcomes, team collaboration. Pick your best story and explain not just what you built but why you\'re proud of it specifically. The "why" is more revealing than the "what."',
    example: {
      code: `// WHAT WAS BUILT:
"I rebuilt our company's real-time notification 
system â€” it had become a source of daily complaints 
from users and was causing about 2% of sessions 
to end with an error state."

// THE CHALLENGE:
"The existing system used long-polling, which 
was creating server load spikes and delivering 
notifications with up to 30-second delays. 
Migrating to WebSockets in a live production 
system with 50,000 daily active users without 
downtime was the hard part."

// HOW I DID IT:
"I used a feature flag to gradually roll out 
the WebSocket implementation â€” 1%, then 10%, 
then 50%, monitoring error rates at each stage 
before proceeding. I wrote a fallback that 
automatically downgraded to long-polling if 
the WebSocket connection failed."

// RESULT:
"Notification latency dropped from 30 seconds 
average to under 500ms. Session error rate 
from notification failures went from 2% to 0.1%. 
User satisfaction scores for the feature went 
from 2.8 to 4.4 out of 5 in the next survey."

// WHY I'M PROUD:
"I'm proud of it because it was technically 
challenging, it had direct user impact I could 
measure, and I did it safely â€” the gradual 
rollout meant no one even noticed the migration 
was happening."`,
      language: 'javascript'
    },
    interviewAnswer: 'The "why you\'re proud" part distinguishes this from a generic achievement story. Pride connected to user impact, technical craft, or safe execution tells the interviewer what drives you.',
    commonMistakes: [
      'Describing what you built without explaining why you\'re proud of it',
      'Choosing a project with no measurable outcome',
      'A project so technical the interviewer can\'t follow it',
      'Choosing the most recent project instead of the best one'
    ],
    realWorldUse: 'Passion and genuine engagement are visible in how people talk about their best work. This question surfaces whether you care about craft, not just output.',
    followUpQuestions: [
      'What was the hardest technical decision you made in that project?',
      'Is there anything you\'d do differently?',
      'How did users respond?'
    ]
  },

  {
    id: 'hr-new-team-size',
    category: 'hr',
    type: 'theory',
    question: 'What size of team and company do you prefer to work in?',
    difficulty: 'beginner',
    tags: ['culture', 'company-size', 'hr', 'fit'],
    shortAnswer: 'Be honest about your preference but show adaptability. Connect your preference to the kind of impact and learning you want, not just comfort. Then connect it to the company you\'re interviewing with.',
    detailedExplanation: 'This question is a fit probe â€” the interviewer wants to know if the company\'s size and culture matches what energizes you. Being honest prevents mismatches that hurt both sides. If you genuinely prefer small teams, say so with a reason. If you\'ve only worked in one type of environment, acknowledge that and show genuine curiosity about what\'s different.',
    example: {
      code: `// Prefer startups/small teams:
"I\'ve done my best work in smaller teams â€” typically 
5-15 engineers â€” where I can see the full system and 
have real ownership over decisions. I like being close 
to the product and customer feedback, and at my last 
company (30 people) I shipped features and saw user 
reactions in the same week.

That said, I know smaller teams mean less structure 
and more ambiguity. I\'ve learned to create my own 
processes when they don\'t exist."

// Prefer larger companies:
"I\'ve worked in startups and while I learned a lot, 
I\'ve realized I actually thrive with more structure â€” 
strong engineering practices, dedicated design and 
QA, and senior engineers to learn from. I\'m looking 
for a company at a stage where those things are solid."

// Honest middle ground:
"I\'ve mostly worked in 50-200 person companies â€” 
big enough to have real engineering practices but 
small enough to know most people. I\'m genuinely 
curious about [this company\'s size/stage] and what 
that means for how engineering works day-to-day."

// Connect to the interviewing company:
"Your team size of [X] engineers sounds like the 
right scale for me â€” enough to collaborate and 
learn from, small enough that my contributions 
have visible impact."`,
      language: 'javascript'
    },
    interviewAnswer: 'Companies interviewing you want to avoid a bad culture fit as much as you do. Honest answers save everyone time. If their size doesn\'t match your preference, it\'s worth surfacing rather than finding out 3 months in.',
    commonMistakes: [
      'Claiming to love any size without conviction',
      'No connection between size preference and work style',
      'Not asking about the team\'s actual size and structure',
      'Being negative about company sizes you\'ve worked in'
    ],
    realWorldUse: 'A 10-person startup and a 10,000-person company are completely different environments. Mismatched expectations are a primary cause of 6-12 month departures.',
    followUpQuestions: [
      'What\'s the biggest team you\'ve been part of?',
      'How do you handle bureaucracy or slow decision-making?',
      'What do you think you\'d find most different about working here compared to your last role?'
    ]
  },

  {
    id: 'hr-new-cross-functional',
    category: 'hr',
    type: 'theory',
    question: 'Tell me about a time you worked closely with product, design, or other non-engineering functions.',
    difficulty: 'intermediate',
    tags: ['cross-functional', 'collaboration', 'product', 'design', 'star'],
    shortAnswer: 'Use STAR. Show you listened to and respected their domain expertise, communicated technical constraints clearly, and contributed to a better outcome through collaboration than you could have achieved working separately.',
    detailedExplanation: 'The best product outcomes come from tight engineering-product-design loops, not handoffs. Interviewers for product-facing roles want engineers who engage genuinely with non-engineering functions, not ones who just implement specs. Key signals: you ask "why" before "how", you surface technical constraints early (not at the end), you offer creative alternatives when constraints block the original design, and you respect others\' expertise.',
    example: {
      code: `// SITUATION:
"We were redesigning our mobile onboarding flow. 
The designer proposed a multi-step animation 
sequence between screens that I estimated would 
take 3 weeks to implement correctly â€” significantly 
over budget for the sprint."

// HOW I ENGAGED (not just pushed back):
"Instead of saying 'that\'ll take too long', I 
scheduled a 30-minute meeting with the designer 
to understand what they were trying to achieve â€” 
what was the experience goal behind the animation?

They said the goal was to make transitions feel 
smooth and intentional, not abrupt. Once I 
understood the goal, I showed them two alternatives: 
a CSS transition approach that would take 2 days 
and a shared element transition using a library 
we already had that would take 4 days. Both met 
the experience goal."

// RESULT:
"We went with the 2-day approach. The designer 
was happy because the goal was met. I was happy 
because we shipped on time. And I learned that 
'expensive design request' usually means 
'misaligned on what the experience goal really is.'"

// What this demonstrates:
// - Understanding before reacting
// - Presenting alternatives rather than hard limits
// - Respect for the designer\'s domain expertise
// - Outcome-focused collaboration`,
      language: 'javascript'
    },
    interviewAnswer: 'The best cross-functional work happens when engineers engage with the "why" rather than just implementing the "what." Showing you go upstream in the design process â€” rather than just receiving specs â€” signals product-minded engineering.',
    commonMistakes: [
      'Describing yourself as just implementing what design handed over',
      'A story where you pushed back without understanding the goal',
      'No mention of what you learned from the other function',
      'Not showing respect for the other discipline\'s expertise'
    ],
    realWorldUse: 'Product companies rely on tight collaboration loops between engineering, product, and design. Engineers who engage well in those loops ship better products faster.',
    followUpQuestions: [
      'How do you handle it when you disagree with a product decision?',
      'What do you think good product engineering culture looks like?',
      'Have you ever pushed back on a design that was technically infeasible?'
    ]
  },

  // â”€â”€ BATCH 4 (31-40) â€” sourced from real FAANG/top-tech interview patterns â”€â”€â”€â”€

  {
    id: 'hr-new-legacy-code',
    category: 'hr',
    type: 'theory',
    question: 'How do you approach a bug in a legacy codebase that has no documentation?',
    difficulty: 'intermediate',
    tags: ['problem-solving', 'legacy-code', 'debugging', 'ownership'],
    shortAnswer: 'Read the code like an archaeologist: trace execution paths, add logging, write tests that capture current behavior, then narrow the bug. Never change code you don\'t understand yet.',
    detailedExplanation: 'Legacy debugging is a core engineering skill. Interviewers ask this to see if you work methodically under uncertainty rather than guessing. The key principle: understand before you change. Changing code you don\'t understand in a legacy system introduces new bugs. Your process should be: map the execution path, reproduce the bug reliably, isolate the cause with targeted instrumentation, then fix and add a regression test.',
    example: {
      code: `// My process for a legacy bug hunt

// Step 1: Reproduce reliably first
"Before touching anything, I make sure I can 
reproduce the bug consistently. If I can't 
reproduce it, I can't know when I've fixed it."

// Step 2: Read the code â€” trace, don't assume
"I trace the execution path from the entry point 
related to the bug. I use the debugger or add 
strategic console.log / logging to understand 
what the code is actually doing vs. what I 
think it should be doing."

// Step 3: Write a failing test
"Once I understand the bug, I write a test that 
fails because of it. This gives me a safety net 
and a clear definition of 'fixed.' In a legacy 
codebase with no tests, this is especially 
important â€” the first test you write is as 
valuable as the fix itself."

// Step 4: Narrow with git blame and history
"git blame and git log are underused tools. 
The commit that introduced the bug often has 
a message explaining why the code was written 
that way, which is the missing documentation."

// Step 5: Fix minimally
"I make the smallest possible change that fixes 
the bug. Legacy code has hidden dependencies. 
The bigger the change, the more likely I break 
something else I don't know about."

// Step 6: Document what I found
"After fixing, I add a comment explaining 
what this code does and why. The next person 
â€” which might be future me â€” will thank me."

// What NOT to do:
// âŒ Rewrite large sections to "understand" it
// âŒ Change code that isn't directly related to the bug
// âŒ Fix without a regression test`,
      language: 'javascript'
    },
    interviewAnswer: 'The discipline of "understand before changing" is what separates engineers who fix bugs safely from engineers who create new ones. In a legacy system, every change has unknown downstream effects â€” methodical exploration beats fast guessing every time.',
    commonMistakes: [
      'Jumping to code changes before understanding the flow',
      'No regression test after the fix',
      'Rewriting unrelated code during the fix',
      'Not using git history as documentation'
    ],
    realWorldUse: 'Most companies have legacy code. The ability to navigate systems that predate your tenure â€” safely and methodically â€” is one of the most valuable things a mid-to-senior engineer can do.',
    followUpQuestions: [
      'How do you balance fixing a legacy bug vs. refactoring the surrounding code?',
      'What\'s the riskiest bug fix you\'ve ever made?',
      'How do you test code in a codebase that has no test infrastructure?'
    ]
  },

  {
    id: 'hr-new-push-back-deadline',
    category: 'hr',
    type: 'theory',
    question: 'Tell me about a time you had to push back on a product manager\'s deadline.',
    difficulty: 'intermediate',
    tags: ['conflict', 'product', 'deadlines', 'star', 'communication'],
    shortAnswer: 'Use STAR. Show you pushed back with data and a specific alternative â€” not just "that\'s too fast." You negotiated scope or timeline constructively and maintained a good working relationship with the PM.',
    detailedExplanation: 'This question tests your ability to be assertive without being combative. PMs and engineers have different incentives â€” PMs want to ship, engineers want to ship well. The best outcome is an honest conversation about tradeoffs with a mutually acceptable solution. Key signals: you came with data (not feelings), you proposed an alternative (not just a veto), and you committed fully once a decision was made.',
    example: {
      code: `// SITUATION:
"A PM asked for a full OAuth2 integration with 
Google, GitHub, and LinkedIn to be shipped in 
one sprint (2 weeks). I estimated 5-6 weeks 
minimum for a proper, secure implementation."

// MY PUSHBACK APPROACH:
"I didn't say 'that's impossible' in the ticket. 
Instead, I requested a 30-minute call to discuss 
the timeline."

// In that meeting, I came prepared with:
"1. A task breakdown: auth flow, token storage, 
   refresh logic, error handling, security review â€” 
   with realistic time estimates per component

2. A risk list: what happens if we rush this 
   (OAuth vulnerabilities are serious and costly)

3. A proposal: can we ship Google OAuth only 
   in sprint 1, then GitHub in sprint 2, LinkedIn 
   in sprint 3? That way login is live faster 
   and we don't compromise security."

// OUTCOME:
"The PM agreed to phase it. In hindsight, the 
phased approach was actually better for users 
too â€” we could measure adoption at each step. 
The PM later told me she appreciated that I 
came with an alternative rather than just 
telling her it couldn't be done."

// Key elements:
// - Private conversation, not a public battle
// - Data-driven (task breakdown, time estimates)
// - Proposed alternative â€” not just a veto
// - Risk framing that speaks to business impact`,
      language: 'javascript'
    },
    interviewAnswer: '"No" without an alternative is just friction. "Here\'s what I can do and when" is a partnership. The most effective pushback comes with a proposal, not just an objection.',
    commonMistakes: [
      'Just saying "it can\'t be done in that time"',
      'Pushing back publicly in a group setting',
      'No alternative proposal',
      'Being defensive rather than collaborative'
    ],
    realWorldUse: 'PM-engineer tension over timelines is universal. Engineers who can advocate for quality while still being partners in delivery are far more valuable than engineers who just comply or constantly refuse.',
    followUpQuestions: [
      'What if the PM insisted on the original deadline despite your pushback?',
      'How do you know when to compromise vs. hold firm?',
      'How do you maintain a good relationship with PMs you frequently push back on?'
    ]
  },

  {
    id: 'hr-new-wrong-tech',
    category: 'hr',
    type: 'theory',
    question: 'Tell me about a time you chose the wrong technology or approach for a problem.',
    difficulty: 'intermediate',
    tags: ['failure', 'technical-decision', 'learning', 'star'],
    shortAnswer: 'Own it fully. Explain what the decision was, why you made it (with the information you had at the time), what went wrong, and what you changed. Bonus points for the process you now use to avoid the same mistake.',
    detailedExplanation: 'Every experienced engineer has a wrong-tech story. The question assesses honesty, self-awareness, and learning from technical mistakes. Interviewers are suspicious of engineers who claim never to have made a wrong technical call â€” it suggests either no experience or no reflection. The ideal answer: a genuine misjudgment with clear reasoning about why it seemed right at the time and a concrete process change afterward.',
    example: {
      code: `// SITUATION:
"Two years into my career, I was building a 
small internal reporting tool. I chose MongoDB 
because I'd heard it was flexible and fast, 
and because I was comfortable with JSON documents."

// THE PROBLEM:
"Six months later, the reporting queries became 
increasingly complex â€” lots of joins between 
collections, aggregation across nested arrays. 
MongoDB can handle this, but the aggregation 
pipeline syntax was far more complex than SQL 
would have been, and performance tuning took 
weeks to get right. A relational database with 
proper schema design would have been a much 
better fit from the start."

// WHAT I DID:
"I didn't try to hide it. I flagged the issue to 
my team lead, explained the technical debt, and 
we agreed on a gradual migration to PostgreSQL 
over two sprints. I wrote the migration plan 
and owned the entire migration."

// WHAT I CHANGED:
"I now ask a specific question before choosing 
a database: 'What are the most complex queries 
this system will ever need to run?' If the answer 
involves multiple joins and aggregations on 
structured data, relational is almost always 
the right choice.

I also make technology decisions more visibly now â€” 
writing a short tech note with alternatives considered 
and the reasoning for my choice. That makes the 
decision reviewable and correctable by others."`,
      language: 'javascript'
    },
    interviewAnswer: 'The most important part of this answer is the process change â€” not just "I\'ll be more careful" but a specific decision-making improvement. That\'s what demonstrates growth rather than just regret.',
    commonMistakes: [
      'Choosing a trivial example with no real impact',
      'Blaming incomplete requirements for the wrong choice',
      'No process change described afterward',
      'Still defending the original decision'
    ],
    realWorldUse: 'Technology selection decisions have long tails. A wrong choice made in week 1 can cost months of refactoring in year 2. Engineers who can reflect honestly on these decisions make better future choices.',
    followUpQuestions: [
      'How did the team react when you raised it?',
      'How do you now evaluate new technologies before using them?',
      'Would you involve others in the decision differently next time?'
    ]
  },

  {
    id: 'hr-new-technical-debt',
    category: 'hr',
    type: 'theory',
    question: 'Describe a moment you realized your code was creating significant technical debt.',
    difficulty: 'intermediate',
    tags: ['technical-debt', 'code-quality', 'ownership', 'star'],
    shortAnswer: 'Use STAR. Show you recognized the debt proactively (not after a bug exploded), raised it transparently, made it visible with a ticket or doc, and contributed to paying it down.',
    detailedExplanation: 'Technical debt awareness is a maturity signal. Junior engineers often don\'t see the debt they\'re creating. Mid-to-senior engineers see it but may not always raise it. Staff engineers raise it, quantify it, and drive cleanup. Interviewers want to see you noticed debt in your own code (self-awareness), communicated it openly (transparency), and took steps to address it (ownership).',
    example: {
      code: `// SITUATION:
"While building a new feature, I needed data 
from three different APIs. Under deadline pressure, 
I made three sequential API calls in the request 
handler â€” simple, worked fine."

// WHEN I REALIZED IT WAS DEBT:
"Two sprints later, I was adding a fourth API call 
to the same handler and I stopped. I calculated 
that if each call averaged 200ms, we'd hit 800ms 
total for a page that should load in under 300ms. 
I'd been building a pattern that was linearly 
degrading performance, and two other engineers 
had copied my pattern in adjacent code."

// WHAT I DID:
"I opened a Jira ticket: 'API call parallelization 
in data-fetching handlers â€” technical debt.' I 
described the pattern, how many places it appeared 
(6 handlers at that point), the latency cost, and 
a proposed fix using Promise.all.

I included it in sprint planning as a medium-priority 
tech health item. It got scheduled two sprints later. 
I refactored all 6 handlers and we saw page load 
time drop by an average of 450ms."

// THE STRUCTURAL CHANGE:
"I added a linting rule that flagged sequential 
await calls to the same type of resource as a 
warning. The debt pattern can no longer silently 
spread."`,
      language: 'javascript'
    },
    interviewAnswer: 'The story is stronger when the debt was in your own code â€” it demonstrates self-awareness rather than blame. The structural prevention (a linting rule, a pattern library, a PR checklist item) is what makes the answer senior-level.',
    commonMistakes: [
      'Only describing debt in other people\'s code',
      'No concrete measure of the debt\'s impact',
      'A ticket was opened but never addressed',
      'No prevention mechanism for future recurrence'
    ],
    realWorldUse: 'Teams that identify and address debt incrementally ship faster over time. Teams that ignore it slow down to a crawl. Engineers who raise debt proactively are force multipliers.',
    followUpQuestions: [
      'How do you convince a team that doesn\'t believe in paying down debt?',
      'How do you quantify technical debt in a way PMs understand?',
      'What\'s the difference between good shortcuts and bad technical debt?'
    ]
  },

  {
    id: 'hr-new-broke-production',
    category: 'hr',
    type: 'theory',
    question: 'Tell me about a serious mistake you made that broke production.',
    difficulty: 'intermediate',
    tags: ['production', 'failure', 'accountability', 'post-mortem', 'star'],
    shortAnswer: 'Own it fully with no blame-shifting. Use STAR: what happened, how you detected it, what you did immediately (contain + fix), how you communicated, and what process change you made to prevent recurrence.',
    detailedExplanation: 'This is the highest-stakes failure question. Every experienced engineer has a production incident story. Interviewers aren\'t looking for someone who never breaks things â€” they\'re looking for someone who responds to incidents with speed, transparency, and learning. The blameless post-mortem mindset is what separates mature engineers from immature ones.',
    example: {
      code: `// SITUATION:
"I was deploying a database migration that renamed 
a column. I tested it in staging. What I didn't 
account for: there was a background job that ran 
every 5 minutes referencing the old column name 
by string, not through the ORM. Staging didn't 
have that job running."

// WHAT HAPPENED:
"About 12 minutes after deploying to production, 
our error rate spiked. Our background job was 
throwing column-not-found exceptions on every 
run, and it was responsible for sending notification 
emails. Users stopped receiving notifications."

// IMMEDIATE RESPONSE:
"I saw the spike in Datadog, recognized the 
deployment timing, and paged the team channel: 
'I think my migration broke background jobs â€” 
investigating now, may need rollback.'

I identified the specific error in logs within 
4 minutes. Two options: rollback the migration 
(risky â€” the app code was already using the new 
column name) or hot-fix the background job. 
I chose the hot-fix, deployed in 12 minutes. 
Job failure rate returned to zero."

// POST-MORTEM:
"I wrote a post-mortem the next day. Root cause: 
migration testing didn't include background jobs.
Prevention: I added a 'background job smoke test' 
step to our migration checklist, and we added 
the background job to the staging environment."

// COMMUNICATION:
"I proactively updated the PM and support team 
on impact: notifications delayed for ~25 minutes 
for some users. No data was lost."`,
      language: 'javascript'
    },
    interviewAnswer: 'Specific numbers â€” how long the incident lasted, how many users were affected, how quickly you responded â€” make this story compelling and credible. The post-mortem and prevention step are what make it a growth story rather than just a horror story.',
    commonMistakes: [
      'Minimizing the impact to seem less culpable',
      'Blaming infrastructure, the codebase, or others',
      '"I\'ll test more carefully next time" as the lesson (not specific enough)',
      'No communication to affected stakeholders described'
    ],
    realWorldUse: 'Production incidents are inevitable. Companies hire engineers partly based on how they respond to them. A well-handled incident that you own builds trust; a poorly-handled one or a covered-up one destroys it.',
    followUpQuestions: [
      'How did your manager respond?',
      'What monitoring or alerting did you add after?',
      'Would you have done anything differently?'
    ]
  },

  {
    id: 'hr-new-unpopular-idea',
    category: 'hr',
    type: 'theory',
    question: 'Tell me about a time you championed an unpopular technical idea.',
    difficulty: 'intermediate',
    tags: ['leadership', 'influence', 'ownership', 'communication', 'star'],
    shortAnswer: 'Use STAR. Show you pushed for something you genuinely believed in, backed your position with data, earned buy-in through evidence not authority, and stayed committed even when the initial reception was cold.',
    detailedExplanation: 'This question assesses intellectual courage and influence without authority. Interviewers â€” especially for senior and staff roles â€” want engineers who drive technical direction, not just follow it. Key signals: you had a real technical conviction, you made the case with evidence (prototype, benchmark, clear tradeoff analysis), and the outcome either validated your position or changed your mind â€” both are acceptable outcomes.',
    example: {
      code: `// SITUATION:
"Our team was building a new API layer. The existing 
pattern was REST, and the team was comfortable with it. 
I proposed we evaluate GraphQL for this specific service 
because our frontend needed very different data shapes 
across 6 different views, leading to either massive 
over-fetching or 12 narrow REST endpoints."

// INITIAL RECEPTION:
"The lead engineer was skeptical â€” more complexity, 
new tooling, steeper learning curve. Two others 
just went along with whatever the lead said. 
My proposal was politely dismissed in the initial 
discussion."

// HOW I EARNED BUY-IN:
"I didn't give up after the first discussion. 
I asked for one week to build a side-by-side 
prototype: the same data needs fulfilled with 
REST (11 endpoints) and with GraphQL (1 schema). 
I benchmarked both for network payload size and 
time-to-data for the frontend.

GraphQL reduced frontend data transfer by 62% 
for the most data-heavy view. I presented this 
in a 20-minute demo with the numbers."

// OUTCOME:
"The lead changed his position after the demo. 
We shipped the service in GraphQL. A year later, 
three other teams adopted the same pattern. 
The lead engineer told me it was one of the 
best technical decisions the team had made 
that year."

// Key principle:
// Don't win the argument â€” win the data.
// A prototype or benchmark beats a debate every time.`,
      language: 'javascript'
    },
    interviewAnswer: 'The most effective technical advocates win on evidence, not persistence. Building a prototype or running a benchmark transforms a debate into a demonstration. That\'s more powerful than any argument.',
    commonMistakes: [
      'An idea you pushed through by stubbornness, not evidence',
      'No data or demonstration backing the position',
      'Not acknowledging valid concerns from the skeptics',
      'An example where the idea turned out to be wrong (frame it differently if so)'
    ],
    realWorldUse: 'Staff and principal engineers are expected to drive technical direction. Showing you can do this at any level signals readiness for bigger scope.',
    followUpQuestions: [
      'What would you have done if the team still said no after the prototype?',
      'Have you ever championed an idea that turned out to be wrong?',
      'How do you earn trust on a new team before influencing technical decisions?'
    ]
  },

  {
    id: 'hr-new-cut-scope',
    category: 'hr',
    type: 'theory',
    question: 'Describe a situation where you had to cut scope significantly to ship on time.',
    difficulty: 'intermediate',
    tags: ['scope', 'prioritization', 'pragmatism', 'delivery', 'star'],
    shortAnswer: 'Show you made the scope decision transparently, based on business value (not just ease of removal), involved the PM in the decision, and documented the cut features as fast-follow items with a plan.',
    detailedExplanation: 'Scope cutting is a skill, not a compromise. Done well, it means shipping the highest-value piece on time rather than the full feature late. Done badly, it means silently dropping things until days before the deadline and surprising the PM. Interviewers want to see you made the call early, with the PM, based on explicit value prioritization.',
    example: {
      code: `// SITUATION:
"We were building a user analytics dashboard for 
an enterprise client. Original scope: 8 charts, 
custom date range filtering, CSV export, and email 
scheduling. We were 2 weeks from the deadline 
with about 5 weeks of work left."

// HOW I ASSESSED THE CUT:
"I mapped each feature to the client's stated 
'must-have for launch' criteria from the kickoff 
document. Only 3 charts and date filtering were 
in the must-have list. CSV export was 'nice-to-have.' 
Email scheduling was on the roadmap but not 
committed to the client."

// THE CONVERSATION:
"I brought this to the PM with a clear matrix: 
what we could definitely ship in 2 weeks, what 
would need to slip, and the business risk of 
each. 'Email scheduling is not in the launch 
commitment â€” dropping it from this sprint saves 
2 weeks. CSV export is straightforward and 
improves trust with the client â€” I can add it 
without the scheduling component in 3 days.'"

// RESULT:
"We shipped 3 charts, date filtering, and CSV 
export on time. Email scheduling shipped 3 weeks 
later in a follow-on release. The client was 
satisfied with the launch and appreciated the 
early access to core functionality."

// WHAT MADE IT WORK:
// - Cut was made 2 weeks before deadline, not 2 days
// - PM was involved in the tradeoff decision
// - Cut features were tracked and scheduled, not abandoned
// - Client expectation was managed proactively`,
      language: 'javascript'
    },
    interviewAnswer: 'The earlier you surface a scope problem, the more choices you have. An engineer who flags "we can\'t ship everything in 2 weeks" with 10 days left gives the PM real options. The same flag with 2 days left just causes panic.',
    commonMistakes: [
      'Cutting scope without telling the PM',
      'Making the cut based on ease of removal, not business value',
      'Cut features were dropped permanently, not tracked',
      'Waiting until the deadline to raise the conflict'
    ],
    realWorldUse: 'Every sprint has scope creep and under-estimation. Engineers who can make crisp scope decisions with product partners are invaluable at any stage of a company.',
    followUpQuestions: [
      'How did the client or stakeholders react?',
      'How do you decide what to cut vs. what to delay?',
      'How do you track cut scope so it doesn\'t get forgotten?'
    ]
  },

  {
    id: 'hr-new-harsh-code-review',
    category: 'hr',
    type: 'theory',
    question: 'Tell me about a time you received harsh or critical feedback in a code review.',
    difficulty: 'beginner',
    tags: ['code-review', 'feedback', 'growth', 'professionalism'],
    shortAnswer: 'Show you didn\'t respond defensively in the PR thread. You took time to understand the feedback, engaged productively, made improvements, and potentially used it as a learning opportunity to improve your code quality long-term.',
    detailedExplanation: 'Code reviews are a major source of feedback in engineering teams. How you receive criticism in public (a PR comment visible to the team) is a significant professionalism signal. Interviewers want to see you can separate your ego from your code, engage with criticism thoughtfully, and learn from it. Responding defensively in PR comments is a red flag that follows engineers for years on small teams.',
    example: {
      code: `// SITUATION:
"Early in my second job, I submitted a PR for 
a new authentication flow. A senior engineer 
left 11 comments â€” some minor, but several 
were quite blunt. One said: 'This session 
handling is fundamentally wrong â€” it\'s not 
thread-safe and will cause data leaks under 
concurrent requests.'"

// MY INITIAL REACTION (honest):
"My first instinct was to defend it. I'd spent 
3 days on this PR and had tested it. I typed 
a response â€” then deleted it."

// WHAT I DID INSTEAD:
"I took 30 minutes to research the thread-safety 
issue before responding. I found two articles 
that confirmed the reviewer was right â€” my 
implementation would fail under concurrent 
requests in a way that my single-threaded 
tests couldn't catch.

I replied: 'You\'re right, I missed this â€” 
I\'ve read up on the issue and here\'s my 
proposed fix. Can you confirm this addresses 
the concern?'"

// OUTCOME:
"The senior engineer responded positively. 
We had a 20-minute call where he walked me 
through concurrent session patterns â€” probably 
the most useful learning I had in that job. 
The next few PRs I submitted, he left far 
fewer comments."

// LONG-TERM CHANGE:
"I now add concurrency scenarios to my mental 
checklist before submitting auth-related code. 
That review shaped how I think about security 
edge cases."`,
      language: 'javascript'
    },
    interviewAnswer: 'Deleting the defensive response before sending it is a skill worth developing. Public PR threads are permanent. A measured, curious response builds reputation; a defensive one damages it.',
    commonMistakes: [
      'Describing how you explained why your code was actually fine',
      'No learning or behavioral change from the feedback',
      'Not acknowledging the emotional challenge of public criticism',
      'Framing the reviewer as harsh or unfair'
    ],
    realWorldUse: 'Code review culture makes or breaks engineering teams. Engineers who receive criticism well make review culture safe for everyone. Those who don\'t create an environment where people avoid giving honest feedback.',
    followUpQuestions: [
      'How do you give critical feedback in code reviews without being harsh?',
      'What would you do if you thought the code review comment was wrong?',
      'How do you build rapport with reviewers whose style is blunt?'
    ]
  },

  {
    id: 'hr-new-everything-priority',
    category: 'hr',
    type: 'theory',
    question: 'How do you handle a situation where everything is marked "high priority"?',
    difficulty: 'intermediate',
    tags: ['prioritization', 'communication', 'stakeholders', 'time-management'],
    shortAnswer: 'Surface the conflict explicitly with stakeholders, force a real stack-ranking conversation, deliver incrementally on the top item, and be transparent about what\'s waiting and why.',
    detailedExplanation: 'Infinite "high priority" is a real organizational dysfunction. The worst response is to work on everything simultaneously and deliver nothing well. The best response is to make the prioritization decision visible â€” with stakeholders, not unilaterally. Key skills: facilitated prioritization (asking the right questions to force a ranking), transparent capacity communication, and delivering the top item fully before starting the next.',
    example: {
      code: `// The problem:
"Every ticket in the sprint was marked P1 â€” Critical. 
Three different stakeholders each thought their 
feature was the most important. I had enough 
capacity for 2 of the 4 items at acceptable quality."

// What NOT to do:
// âŒ Context-switch between all 4 â€” ship nothing well
// âŒ Pick one silently and surprise everyone else
// âŒ Ask your manager to decide (they'll say do all 4)

// What I did:

// Step 1: Make the conflict visible
"I sent a single message to all three stakeholders: 
'I want to flag a capacity issue. I have items A, 
B, C, and D all marked high priority. Realistically, 
I can deliver 2 of these at high quality this sprint. 
Can we align on the top 2? I\'ll start on whichever 
wins that conversation immediately.'"

// Step 2: Ask the forcing question
"'If only one of these shipped this sprint and 
the others slipped by two weeks â€” which one 
would hurt the business most?' 

That question usually produces a real answer.
Everyone says everything is equal until they 
have to choose."

// Step 3: Confirm and deliver
"Once I had a stack rank, I confirmed it in writing, 
started on item #1, and updated the other tickets 
with the reason for the delay and the expected date."

// RESULT:
"A, B shipped that sprint. C shipped 10 days later, D 
the sprint after. No surprises. All stakeholders 
were informed in advance."`,
      language: 'javascript'
    },
    interviewAnswer: 'The most important move is making the tradeoff visible to the people who should be making it â€” stakeholders and PM â€” not making it yourself in silence. Your job is to execute on the decided priority, not to absorb the dysfunction of unclear priorities alone.',
    commonMistakes: [
      'Trying to do everything and delivering nothing well',
      'Silently choosing priority without stakeholder input',
      'Escalating to your manager as the first move',
      'No transparency about what\'s being delayed and why'
    ],
    realWorldUse: 'Priority inflation is endemic at most companies. Engineers who can force productive prioritization conversations â€” without creating drama â€” are invaluable.',
    followUpQuestions: [
      'What if the stakeholders couldn\'t agree on the ranking?',
      'How do you handle a stakeholder who is upset their item was deprioritized?',
      'How do you track deprioritized items so they don\'t get forgotten?'
    ]
  },

  {
    id: 'hr-new-teammate-blocking',
    category: 'hr',
    type: 'theory',
    question: 'Describe a situation where a teammate\'s work was blocking yours. How did you handle it?',
    difficulty: 'intermediate',
    tags: ['teamwork', 'conflict', 'communication', 'unblocking', 'star'],
    shortAnswer: 'Show you reached out directly and early, communicated without blame, offered to help unblock them, found a parallel workstream to stay productive, and escalated only when genuinely necessary.',
    detailedExplanation: 'Blocked dependencies are one of the most common friction points in engineering teams. Interviewers want to see that you handle them proactively (not passively waiting), collaboratively (not accusatorially), and constructively (finding a workaround or parallel track). Escalating to a manager as the first move signals you can\'t resolve normal peer friction independently.',
    example: {
      code: `// SITUATION:
"I was building an API feature that depended 
on a database schema migration being completed 
by another engineer. Two days before our shared 
deadline, the migration was still not in review â€” 
the engineer had been pulled into a production 
incident."

// STEP 1: Reach out directly
"I messaged the engineer directly (not in the 
public channel): 'Hey, I know you\'ve been dealing 
with the incident â€” the migration is a dependency 
for my feature. Can you give me a rough ETA? 
Even a rough timeline would help me plan.'"

// STEP 2: Offer to help
"When they said it would take another 2 days, 
I offered: 'Would it help if I drafted the 
migration script? You could review and adjust, 
which might be faster than starting from scratch.'"

// STEP 3: Find a parallel workstream
"While waiting, I mocked the database layer 
locally so I could develop and test my API 
logic against a fake schema. That way I wasn\'t 
sitting idle â€” I had clean, testable code ready 
to plug in the real migration when it landed."

// STEP 4: Communicate upward (not escalate)
"I updated our PM with a one-liner in the 
daily standup: 'My feature is waiting on 
the DB migration â€” on track for Thursday 
instead of Tuesday, no action needed yet.'"

// RESULT:
"Migration landed Wednesday. My feature was 
done Thursday â€” one day late total instead 
of two. No escalation needed."`,
      language: 'javascript'
    },
    interviewAnswer: 'The best engineers assume positive intent when a blocker appears (the other person is usually blocked or overwhelmed, not lazy) and focus on finding the fastest path to resolution rather than complaining about the dependency.',
    commonMistakes: [
      'Waiting silently until the deadline without reaching out',
      'Public blame in standup or Slack channels',
      'Immediately escalating to manager',
      'No parallel workstream or workaround attempted'
    ],
    realWorldUse: 'Cross-dependency management is a daily reality in any team working in parallel. Engineers who handle it gracefully keep teams moving; those who don\'t create friction that slows everything down.',
    followUpQuestions: [
      'What if the engineer had been unresponsive?',
      'How do you avoid creating blockers for others?',
      'How do you structure your work to minimize dependency risk?'
    ]
  },

  // â”€â”€ BATCH 5 (41-50) â€” sourced from real FAANG/top-tech interview patterns â”€â”€â”€â”€

  {
    id: 'hr-new-pivoted-approach',
    category: 'hr',
    type: 'theory',
    question: 'Describe a time you had to pivot your technical approach halfway through a sprint.',
    difficulty: 'intermediate',
    tags: ['adaptability', 'pivot', 'problem-solving', 'star'],
    shortAnswer: 'Use STAR. Show you recognized the need to pivot early (not at the end), assessed the cost of the pivot vs. continuing, communicated transparently about the impact, and switched directions decisively.',
    detailedExplanation: 'Mid-sprint pivots test adaptability and decision-making under pressure. Interviewers want to see that you can recognize a wrong path early and change course without excessive attachment to sunk cost. The worst outcome is continuing down a path you know is wrong because you\'ve invested time in it. The best outcome is recognizing the issue, assessing alternatives, and pivoting with a clear communication to the team.',
    example: {
      code: `// SITUATION:
"I was building a real-time feature using polling â€” 
the frontend would hit an API every 5 seconds to 
check for updates. On day 3 of a 10-day sprint, 
a load test revealed the polling would generate 
enough traffic to exceed our server capacity 
by ~3x at our projected user scale."

// RECOGNIZING THE PIVOT:
"I ran the numbers: 10,000 users Ã— polling 
every 5 seconds = 2M API calls/hour. Our 
infrastructure was built for ~600k calls/hour. 
Continuing wasn\'t viable â€” this would bring 
down the service at launch."

// THE PIVOT DECISION:
"I evaluated two alternatives: 
1. WebSockets â€” real-time, right tool, but 3-4 
   days of rework given our current stack
2. Long-polling with exponential backoff â€” 
   1 day of rework, significantly reduces load

I chose long-polling with backoff as a pragmatic 
middle ground: it was achievable within the sprint, 
reduced traffic by ~80%, and could be upgraded to 
WebSockets in a follow-on sprint."

// COMMUNICATION:
"I flagged it in standup: 'I\'ve found a scalability 
issue with my current approach. Pivoting to long-polling 
â€” this keeps me on schedule but I\'ll need to update 
the architecture doc.'"

// RESULT:
"Shipped on time with long-polling. We upgraded 
to WebSockets 3 weeks later. The PM appreciated 
that I didn\'t hide the issue and the team appreciated 
that I'd brought a solution, not just a problem."`,
      language: 'javascript'
    },
    interviewAnswer: 'Sunk cost is the enemy of good technical decisions. Recognizing early that a path won\'t work â€” and being willing to say so â€” is more valuable than being right in the first place. Coming with a proposed pivot rather than just a problem is what makes the communication constructive.',
    commonMistakes: [
      'Continuing the wrong approach until the last day of the sprint',
      'Pivoting without communicating the reason to the team',
      'No concrete alternative proposed before raising the issue',
      'Treating the pivot as a failure rather than good engineering judgment'
    ],
    realWorldUse: 'Engineering plans are estimates, not contracts. The engineers who pivot well â€” early, decisively, with good communication â€” are the ones companies trust with complex, ambiguous projects.',
    followUpQuestions: [
      'How do you prevent mid-sprint pivots from becoming the norm on your teams?',
      'How much time do you invest in technical design before starting implementation?',
      'How do you balance speed-of-start vs. risk-of-pivot?'
    ]
  },

  {
    id: 'hr-new-led-postmortem',
    category: 'hr',
    type: 'theory',
    question: 'Describe a time you led or contributed to a post-mortem after a severe outage.',
    difficulty: 'intermediate',
    tags: ['post-mortem', 'leadership', 'incident-response', 'blameless-culture'],
    shortAnswer: 'Show you drove a blameless process: focused on systems and processes rather than people, identified the true root cause (not just the surface trigger), and produced actionable items that actually got implemented.',
    detailedExplanation: 'Post-mortems done well are one of the highest-leverage activities in engineering. Done badly â€” blame-focused, surface-level, action items ignored â€” they waste everyone\'s time and leave the system fragile. Interviewers for senior and lead roles care deeply about your ability to run or contribute to effective post-mortems. Key signals: blameless framing, deep root cause analysis (5 Whys or similar), and concrete follow-through.',
    example: {
      code: `// SITUATION:
"We had a 90-minute outage affecting all users 
after a deployment. The immediate cause was an 
environment variable misconfiguration that caused 
our payment service to point at the sandbox 
API in production."

// HOW I LED THE POST-MORTEM:

// 1. Set the blameless tone at the start
"I opened the post-mortem doc with: 
'This is a systems review, not a blame session. 
We\'re asking why our systems allowed this to happen, 
not who made the mistake.'"

// 2. Built a detailed timeline
"We reconstructed a minute-by-minute timeline: 
deployment at 2:14pm â†’ first error at 2:18pm â†’ 
alert triggered at 2:26pm â†’ rollback at 3:41pm. 
The 75-minute gap between first error and rollback 
was the key finding â€” we were slow to respond 
despite having monitoring."

// 3. Did a 5-Whys root cause analysis
"Why did the outage happen?
â†’ Wrong env var in production config
Why did wrong env var get deployed?
â†’ No automated validation of environment-specific vars
Why was there no validation?
â†’ Our deploy pipeline had no config sanity checks
Why?
â†’ Config validation was always 'someone\'s job' but 
  no one owned it
Why did the alert take 12 minutes to fire?
â†’ Our alert threshold was set too high (5% error rate)"

// 4. Action items with owners and dates
"3 action items, each with an owner and a deadline:
- Add deploy-time config validation: me, 1 week
- Lower error rate alert threshold: on-call engineer, 3 days
- Add runbook for payment service incidents: tech lead, 2 weeks"

// FOLLOW-THROUGH:
"All three items were completed within 2 weeks. 
We haven\'t had a config-related outage since."`,
      language: 'javascript'
    },
    interviewAnswer: 'The 5 Whys is a simple but powerful tool for distinguishing root cause from surface trigger. Most outages have the same surface cause (someone deployed something wrong) but very different root causes (process gap, monitoring gap, ownership gap). The root cause is what you fix.',
    commonMistakes: [
      'A post-mortem that identified blame rather than systems gaps',
      'Action items with no owner or deadline',
      'Surface-level root cause ("human error") not followed with deeper analysis',
      'Action items that were never completed'
    ],
    realWorldUse: 'High-reliability engineering teams (Netflix, Google SRE) treat post-mortems as a core part of their reliability culture. Leaders who can run good post-mortems build more resilient systems and more trusting teams.',
    followUpQuestions: [
      'How do you ensure action items from post-mortems don\'t get dropped?',
      'How do you handle it when the root cause points to a leadership decision?',
      'What\'s the difference between a good post-mortem and a useless one?'
    ]
  },

  {
    id: 'hr-new-completed-incomplete-info',
    category: 'hr',
    type: 'theory',
    question: 'Tell me about a time you had to make a critical decision with incomplete information.',
    difficulty: 'intermediate',
    tags: ['decision-making', 'ambiguity', 'judgment', 'star'],
    shortAnswer: 'Use STAR. Show you gathered the most critical information fast, made your assumptions explicit, chose the most reversible option when possible, and made a clear decision â€” then updated it as more data came in.',
    detailedExplanation: 'This is a key question at Amazon (tests "Bias for Action") and OpenAI. Interviewers want to see you don\'t freeze under uncertainty, but also that you don\'t make reckless calls without seeking any information. The ideal is: rapid triage of what information is needed vs. nice-to-have, a decisive call, documented assumptions, and genuine openness to revision.',
    example: {
      code: `// SITUATION:
"Production was showing degraded performance â€” 
response times up 4x. Our on-call engineer 
was unreachable. I was the most senior engineer 
available. We had three competing hypotheses:
1. A bad deployment from 90 minutes earlier
2. A database query suddenly slow (no obvious cause)
3. A spike in traffic that exceeded capacity"

// MY PROCESS UNDER TIME PRESSURE:

// Step 1: Gather minimum critical data fast
"I had 5 minutes of data: deployment logs, 
DB slow query log, traffic graph. Traffic 
was normal â€” ruled out #3. Slow query log 
showed nothing unusual â€” tentatively ruled 
out #2. The deployment was the most likely cause."

// Step 2: Choose the reversible action
"I could rollback the deployment (reversible 
and fast, 5 minutes) or debug further (20+ 
minutes, no guarantee). The rollback was 
the right call â€” even if the deployment 
wasn\'t the cause, we\'d lose nothing except 
the deployment itself."

// Step 3: Communicate before acting
"I posted in the incident channel: 
\'Initiating rollback of last deployment â€” 
most likely cause based on timeline. Will 
report in 10 minutes.\'"

// RESULT:
"Response times normalized within 3 minutes 
of rollback. Root cause confirmed: a query 
introduced in the deployment had a missing 
index on a large table. Added the index, 
redeployed the next morning."

// LESSON:
"When time is critical, prefer reversible 
actions and communicate intent before acting. 
That gives people a window to stop you if 
they have information you don\'t."`,
      language: 'javascript'
    },
    interviewAnswer: 'The "reversible action" principle is one of the most useful mental models for decisions under uncertainty. When you can\'t know which choice is right, choose the one that can be undone. Save the irreversible decisions for when you have more data.',
    commonMistakes: [
      'Analysis paralysis â€” waiting for perfect data',
      'Taking irreversible action without even basic triage',
      'Not communicating intent before acting',
      'Not documenting assumptions so others can correct you'
    ],
    realWorldUse: 'Production incidents demand decisions under uncertainty constantly. Engineers who can act decisively and transparently under pressure are the ones trusted with incident command.',
    followUpQuestions: [
      'How do you distinguish between decisions that need more data and those that need action?',
      'Have you ever made a call under pressure that turned out to be wrong?',
      'How do you update a decision when new information changes the picture?'
    ]
  },

  {
    id: 'hr-new-greatest-career-lesson',
    category: 'hr',
    type: 'theory',
    question: 'What is the biggest lesson you\'ve learned in your engineering career so far?',
    difficulty: 'beginner',
    tags: ['reflection', 'growth', 'values', 'hr'],
    shortAnswer: 'Pick a genuine, specific insight â€” not a platitude. The most compelling answers come from a real experience that changed how you work. Connect it to something observable in how you operate today.',
    detailedExplanation: 'This open-ended reflection question reveals values, self-awareness, and intellectual maturity. Interviewers are looking for candidates who have genuinely reflected on their growth â€” not people who produce motivational poster quotes. The best answers are specific, connected to a real experience, and describe a behavioral change that is still visible in how you work today.',
    example: {
      code: `// Strong answer examples

// Lesson: Readable code is collaborative code
"The biggest lesson was that I was writing code 
for myself, not for my team. I thought 'if it works 
and I understand it, it\'s good code.' A code review 
from a senior engineer early in my career showed me 
how wrong that was â€” they couldn\'t follow my logic 
at all without reading every line carefully.

I now read every function I write and ask: 
'Could someone who\'s never seen this understand 
what it does and why in 30 seconds?' If not, I rewrite it. 
That one shift has probably saved more collective 
engineering hours than any feature I\'ve ever shipped."

// Lesson: Communication is the job
"The biggest lesson was that writing code is maybe 
50% of my job. The other 50% is communication â€” 
setting expectations, raising blockers, writing 
clear PRs, explaining technical decisions to PMs. 
I used to think communication was overhead. 
Now I think it\'s infrastructure. Teams with great 
communication ship faster and break less."

// Lesson: Shipping early beats shipping perfectly
"I used to hold PRs until I thought the code was 
perfect. I\'d spend days polishing something 
before anyone saw it. A lead engineer told me: 
\'Perfect is the enemy of shipped, and unreviewed 
code is unvalidated code.\' Now I ship drafts 
for early feedback, iterate, and merge sooner. 
The code ends up better, not worse, because 
other eyes catch things early that are expensive 
to change later."`,
      language: 'javascript'
    },
    interviewAnswer: 'The lesson should feel earned, not borrowed. A lesson from a real experience â€” even a painful one â€” is far more compelling than a lesson that sounds like it was taken from a blog post.',
    commonMistakes: [
      'Platitudes without a specific experience behind them',
      'A lesson that isn\'t visible in how you actually work now',
      'A lesson that\'s entirely technical with no human/team dimension',
      'Overly humble ("I\'m still learning") without actual content'
    ],
    realWorldUse: 'Companies want engineers who reflect on their experience and extract value from it, not just accumulate years. Genuine lessons from real experience signal a growth mindset.',
    followUpQuestions: [
      'How have you applied that lesson recently?',
      'Is there a lesson you feel you haven\'t fully internalized yet?',
      'What advice would you give your earlier self?'
    ]
  },

  {
    id: 'hr-new-proactive-solution',
    category: 'hr',
    type: 'theory',
    question: 'Tell me about a time you spotted a problem and built a solution before anyone asked.',
    difficulty: 'intermediate',
    tags: ['initiative', 'ownership', 'proactive', 'star'],
    shortAnswer: 'Use STAR. Show genuine initiative: you noticed a real problem that others were ignoring or hadn\'t seen, built something to address it, and the outcome benefited more than just yourself.',
    detailedExplanation: 'This question directly tests Amazon\'s "Ownership" principle and what Google calls "Googleyness" â€” going beyond your assigned scope to improve the system. The best stories are ones where you noticed friction that others had accepted as normal, decided not to accept it, and invested your own time to address it. The solution doesn\'t need to be a large project â€” a script that saves the team 2 hours a week is genuinely impactful.',
    example: {
      code: `// SITUATION:
"Our team deployed by manually SSHing into servers, 
running a checklist of commands, and hoping nothing 
went wrong. We averaged one broken deployment per 
month. Nobody had been assigned to fix this â€” 
it was just 'how things were done.'"

// THE PROBLEM I IDENTIFIED:
"The manual deploy process had three failure modes:
1. Steps were skipped under time pressure
2. No automated test run before deploy
3. No easy rollback â€” rollback required 
   re-running the entire process in reverse"

// WHAT I DID:
"I spent a Saturday building a deploy script 
in bash that automated the checklist, ran 
our test suite before deploying, and created 
a tagged snapshot before each deploy for 
one-command rollback.

I tested it 5 times in staging, then proposed 
it to the team in a Monday demo: \'I built 
a deploy automation â€” here\'s a 5-minute demo. 
It takes 8 minutes vs. our current 25 minutes 
and includes a safety rollback.'"

// RESULT:
"The team adopted it the same week. Zero broken 
deployments in the 4 months after. The team lead 
mentioned it to the CTO, who asked me to write 
up the approach for other teams. Two other teams 
adopted versions of it."

// KEY SIGNAL:
"Nobody asked me to do this. I did it because 
I was tired of deploying at 11pm hoping nothing 
broke. The fact that it helped everyone else 
was a bonus."`,
      language: 'javascript'
    },
    interviewAnswer: 'The most compelling initiative stories have two qualities: the problem was real and painful for multiple people, and nobody had formally assigned it to anyone. Those are the conditions for genuine ownership â€” stepping into a vacuum and filling it.',
    commonMistakes: [
      'A solution to a problem only you had (not team-level impact)',
      'Work that was actually assigned to you',
      'No measurable result or adoption',
      'A story where you got permission before starting (ownership is acting first, informing after)'
    ],
    realWorldUse: 'The best engineering teams are full of people who fix things they didn\'t have to fix. This trait â€” more than any specific skill â€” determines who gets promoted to lead and staff roles.',
    followUpQuestions: [
      'What would have happened if you hadn\'t done it?',
      'How did you get others to adopt it?',
      'Do you do this kind of thing often?'
    ]
  },

  {
    id: 'hr-new-new-tech-fast',
    category: 'hr',
    type: 'theory',
    question: 'Give an example of a time you had to rapidly learn a new technology to finish a project.',
    difficulty: 'beginner',
    tags: ['fast-learning', 'adaptability', 'star', 'initiative'],
    shortAnswer: 'Use STAR. Show your method for fast learning: you narrowed to the minimum needed, learned by building, asked targeted questions to experts, and delivered despite the knowledge gap.',
    detailedExplanation: 'Rapid technology learning is tested explicitly at Microsoft ("How would you solve a problem with unfamiliar technology?") and implicitly at most companies. The best answer describes a repeatable system â€” not luck or natural talent. Key elements: you scoped your learning to the task, you used the best available resources efficiently, you applied immediately (learning by doing), and you delivered.',
    example: {
      code: `// SITUATION:
"I was tasked with building a data pipeline that 
ingested events from Kafka. I had never used Kafka 
before. The pipeline needed to be in production 
in 10 days."

// MY FAST-LEARNING SYSTEM:

// Step 1: Define the minimum I needed to know
"I wrote down exactly what the pipeline needed 
to do: consume messages from a topic, deserialize 
JSON, transform the data, write to PostgreSQL. 
I listed the Kafka concepts I needed: Consumer, 
Consumer Group, Topic, Offset. That\'s it â€” 
I didn\'t need to understand Kafka internals or 
producer logic for this task."

// Step 2: Official docs + one focused tutorial
"I read the Kafka consumer documentation end-to-end 
(not the whole docs â€” just consumer). Then one 
YouTube tutorial specifically on Kafka with Node.js. 
Total: 4 hours of study."

// Step 3: Build a working spike on day 1
"Day 1 afternoon: I had a local Kafka consumer 
running, printing messages to the terminal. 
That single working example taught me more than 
the 4 hours of reading."

// Step 4: One targeted expert question
"I asked our DevOps engineer one question: 
\'What are the gotchas with consumer group 
commits that I should know about for production?\' 
That answer saved me 2 days of debugging later."

// RESULT:
"Pipeline was in production on day 8 â€” 
2 days ahead of schedule. No Kafka-related 
issues in the first 3 months."`,
      language: 'javascript'
    },
    interviewAnswer: 'The key is ruthless scope: you only need to learn enough for the specific task. Trying to understand a full technology before using it is how engineers get paralyzed. Build the smallest thing that demonstrates understanding, then expand from there.',
    commonMistakes: [
      'Trying to learn the full technology before starting',
      'Only passive learning (reading, watching) without building',
      'Not identifying the one expert question that saves the most time',
      'No outcome or delivery mentioned'
    ],
    realWorldUse: 'Every job, codebase, and system requires learning things you don\'t know yet. Engineers with a fast, efficient learning system onboard faster, take on broader scope, and outgrow their peers.',
    followUpQuestions: [
      'What resources do you default to when learning something new?',
      'How do you know when you\'ve learned enough to move forward?',
      'What was the hardest technology you\'ve had to pick up quickly?'
    ]
  },

  {
    id: 'hr-new-values-tradeoff',
    category: 'hr',
    type: 'theory',
    question: 'Tell me about a time you had to make a tradeoff between moving fast and doing it right.',
    difficulty: 'intermediate',
    tags: ['tradeoffs', 'speed', 'quality', 'pragmatism', 'star'],
    shortAnswer: 'Show that you made the tradeoff explicitly and transparently â€” not by default or under pressure. Explain the decision criteria, what you chose to defer, and how you tracked the deferred work.',
    detailedExplanation: 'This is a values and judgment question. Companies want engineers who can make intelligent tradeoffs, not engineers who always insist on perfection or always cut corners under pressure. The ideal answer: you had a genuine dilemma, you assessed the business impact of both options, you chose one with eyes open, you communicated the tradeoff, and you followed through on the deferred work.',
    example: {
      code: `// SITUATION:
"We had a product launch in 3 days and discovered 
our error handling in the payment flow was incomplete â€” 
some edge cases (card declined mid-session, 
network timeout during payment) had no user-facing 
error messages and would just fail silently."

// THE TRADEOFF:
"Option A: Proper fix â€” 4-5 days. Add error handling, 
  write tests, get full code review. Miss launch.

Option B: Fast fix â€” 1 day. Add basic catch-all 
  error messages, log all payment errors, 
  disable payment silently failing. Not elegant, 
  but not a silent failure either. Add proper 
  handling post-launch."

// MY DECISION CRITERIA:
"I weighed: 
- User impact of silent failures (high) vs. 
  user impact of generic error message (medium)
- Business impact of missing launch (high)
- Security risk of the fast fix (low â€” 
  we\'re logging errors, not ignoring them)

Generic error message is worse UX but safe. 
Silent failure loses the user\'s purchase and 
trust. Option B was the right call."

// HOW I MANAGED THE DEBT:
"I created a detailed Jira ticket before 
shipping option B: specific edge cases, 
ideal behavior, and tagged it to the 
post-launch cleanup sprint. I also added 
a comment in the code: 
// TODO: Replace with specific error handling â€” 
// [Jira ticket link]. Shipped 3 Nov 2024."

// RESULT:
"Launched on time. Two edge case errors surfaced 
in the first week â€” both caught by our logging 
and showed the generic message (not silent). 
Proper handling shipped 8 days post-launch."`,
      language: 'javascript'
    },
    interviewAnswer: 'The tradeoff is only good engineering if it was made deliberately. Accidental shortcuts that you discover later aren\'t tradeoffs â€” they\'re mistakes. A deliberate, documented, tracked shortcut is a legitimate engineering decision.',
    commonMistakes: [
      'Framing "I just shipped it quickly" as a deliberate tradeoff',
      'No tracking of the deferred work (it never gets done)',
      'Not communicating the tradeoff to PM or the team',
      'Choosing the fast option without assessing the risk'
    ],
    realWorldUse: 'Every product that ships has deliberate tradeoffs. The engineers who make them explicitly and track the debt are the ones who can be trusted with high-stakes launches.',
    followUpQuestions: [
      'How do you ensure deferred improvements actually happen?',
      'How do you explain technical tradeoffs to a non-technical PM?',
      'Is there a tradeoff you regret making?'
    ]
  },

  {
    id: 'hr-new-why-coding',
    category: 'hr',
    type: 'theory',
    question: 'Why did you become a software engineer?',
    difficulty: 'beginner',
    tags: ['motivation', 'passion', 'hr', 'origin-story'],
    shortAnswer: 'Be genuine. Companies like LinkedIn and Microsoft ask this explicitly to gauge passion for the craft. The best answers are specific â€” a problem you solved, something you built, a moment of realization â€” not generic ("I like technology").',
    detailedExplanation: 'This question is used as an icebreaker but also as a motivation probe. Interviewers want to see genuine enthusiasm for building software, not just a career choice made for salary or stability. The best answers have a specific origin story: a first program, a problem solved, a game modded, a feeling of control over a computer that felt magical. Connect it to what you still love about it today.',
    example: {
      code: `// Strong origin story answers

// Story: First program that did something real
"When I was 14, my school asked me to design 
a seating chart for 300 students. I was doing 
it manually in Excel, which took hours. Then 
I wrote a basic Python script that did it in 
seconds. That moment â€” making the computer do 
the tedious work for me â€” was when I understood 
what programming actually was. I\'ve been chasing 
that feeling ever since."

// Story: Solving your own problem
"I started because I was frustrated that no 
app existed that did exactly what I wanted. 
So I built it. It was bad code, it barely worked, 
but I\'d made something from nothing. That 
was the hook. The desire to build things 
that didn\'t exist before is still what drives me."

// Story: The lever effect
"I became an engineer because software is the 
highest-leverage skill I know of. One person 
with good code can affect millions of people. 
I wanted to build things at that scale â€” 
not just do work, but multiply impact. 
That\'s still why I care about the work 
I do."

// Connect to today:
"And I still love it â€” particularly [specific 
aspect: distributed systems, UI performance, 
open source], because [genuine reason]."

// âŒ Avoid:
// "It pays well" (even if true, not only this)
// "I\'ve always been good with computers" (vague)
// "I saw it was a growing field" (purely strategic)`,
      language: 'javascript'
    },
    interviewAnswer: 'Specificity beats polish here. A small, concrete story about the first time you felt the power of code is more compelling than a carefully crafted answer about your passion for problem-solving.',
    commonMistakes: [
      'A purely strategic answer (job market, salary)',
      'Vague: "I\'ve always been interested in technology"',
      'No connection to what you still enjoy about it',
      'A story that sounds borrowed, not lived'
    ],
    realWorldUse: 'Companies that care about culture â€” Microsoft, LinkedIn, Airbnb â€” ask this explicitly. It\'s also a conversation builder that can unlock genuine connection with the interviewer.',
    followUpQuestions: [
      'What part of engineering do you still love the most?',
      'Has your reason for loving it changed as you\'ve grown?',
      'What\'s a recent project that reminded you why you got into this?'
    ]
  },

  {
    id: 'hr-new-exceeded-expectations',
    category: 'hr',
    type: 'theory',
    question: 'Tell me about a time you exceeded expectations.',
    difficulty: 'beginner',
    tags: ['achievement', 'ownership', 'star', 'impact'],
    shortAnswer: 'Use STAR. Choose a story where you delivered significantly more value than was asked for â€” not by working longer, but by identifying a higher-value version of the task and delivering it. Quantify the delta.',
    detailedExplanation: 'This is a direct request for your best performance story. Interviewers at companies like Google (Googleyness) and Amazon ("Deliver Results," "Invent and Simplify") use this to assess drive and judgment about what "done" means. Exceeding expectations isn\'t about heroic hours â€” it\'s about understanding what success looks like and going beyond the minimum viable delivery to the maximum valuable delivery.',
    example: {
      code: `// SITUATION:
"I was asked to add a basic search bar to our 
admin dashboard â€” a simple text filter on a 
table of 500 records. The PM\'s expectation: 
client-side filtering, search by name, done 
in 1 day."

// WHAT I DID INSTEAD:
"Before starting, I spent 30 minutes shadowing 
two admin users to understand how they actually 
used the table. I found that they most often 
searched by status AND date range together â€” 
a combination that a simple name filter 
wouldn\'t support at all.

I built: 
- Client-side text filter (original ask â€” 2 hours)
- Status dropdown filter (discovered need â€” 2 hours)
- Date range filter (discovered need â€” 3 hours)
- A filter combination that preserved state 
  on page refresh (usability â€” 1 hour)

Total time: 8 hours vs. the 1-day budget."

// RESULT:
"When I showed it to the PM, their reaction was 
\'this is exactly what we needed but didn\'t know 
to ask for.\' Admin team reported a 40% reduction 
in time spent on daily reconciliation tasks. 
The feature became a template that other 
teams used for their admin dashboards."

// WHY IT EXCEEDED EXPECTATIONS:
"I didn\'t just do what I was asked. I understood 
what the ask was actually trying to solve and 
built for that. The difference was 30 minutes 
of user research."`,
      language: 'javascript'
    },
    interviewAnswer: 'The highest-leverage version of exceeding expectations is understanding the real problem behind the request and solving that â€” not just adding more features to the requested feature. "User research" sounds big but can be as simple as watching someone use the tool for 20 minutes.',
    commonMistakes: [
      'Exceeding expectations by working more hours (not the same as delivering more value)',
      'No measurable delta between expected and actual outcome',
      'Choosing a story where "exceeding" was small or accidental',
      'Not explaining how you identified the higher-value version of the task'
    ],
    realWorldUse: 'Engineers who understand the business context of their work identify higher-value versions of every task. That compounding effect over a year is the difference between "meets expectations" and "exceeds expectations" in performance reviews.',
    followUpQuestions: [
      'How do you identify what the real need is behind a feature request?',
      'How much time do you spend on this kind of discovery before building?',
      'Has this approach ever led you down the wrong path?'
    ]
  },

  {
    id: 'hr-new-good-fit',
    category: 'hr',
    type: 'theory',
    question: 'Why are you a good fit for this role?',
    difficulty: 'beginner',
    tags: ['fit', 'self-promotion', 'hr', 'research'],
    shortAnswer: 'Map your 3 strongest relevant skills directly to the specific needs of the role. Use concrete evidence for each. Show you\'ve read the JD carefully and researched the company â€” generic answers are immediately obvious.',
    detailedExplanation: 'This is your closing argument question. It\'s an invitation to connect your experience directly to the role requirements. Most candidates give generic answers that could apply to any job. The best answers are specific: skill from your background + requirement from the JD + evidence. Prepare this answer by going through the job description line by line and identifying your 3 strongest matches.',
    example: {
      code: `// Framework: JD requirement â†’ Your evidence

// Example for a senior fullstack role

// Match 1: React + Node (core technical requirement)
"The role asks for strong React and Node.js experience. 
I\'ve spent the last 3 years building production apps 
in both â€” including a Node.js microservices architecture 
that handles 50k requests/minute and a React SPA 
with a custom rendering pipeline that reduced 
TTI by 40%."

// Match 2: Ownership + product-thinking
"The JD emphasizes 'engineers who think like product 
owners.' In my last role, I initiated and led a 
checkout redesign that wasn\'t on the roadmap â€” 
identified a 68% cart abandonment rate, built 
the business case, led the project, and reduced 
abandonment to 41%. That kind of ownership is 
how I naturally work."

// Match 3: Team scale / collaborative culture
"The role mentions a team of 8 engineers working 
in a closely collaborative culture. My best work 
has been in exactly that team size â€” small enough 
for fast decisions, large enough to have specializations. 
I thrive in those dynamics and have specifically 
sought out roles with that structure."

// Close by connecting to the company specifically:
"Beyond the technical match, I\'ve been following 
[Company] since you launched [specific feature/product]. 
The problem you\'re solving is one I care about, 
and I think my background puts me in a position 
to contribute quickly."`,
      language: 'javascript'
    },
    interviewAnswer: 'Generic answers ("I\'m hardworking and passionate") are invisible. Specific answers that cite real numbers and match the actual JD requirements are memorable. Read the job description the morning of the interview and prepare this answer fresh for each company.',
    commonMistakes: [
      'Generic answers that could apply to any job',
      'Listing skills without evidence',
      'Not mapping to the specific JD requirements',
      'Sounding like you\'re reading from a resume'
    ],
    realWorldUse: 'This is often the last question before the salary discussion. A strong answer reinforces your value and sets up negotiation from a position of confidence.',
    followUpQuestions: [
      'Is there anything in the job description you feel less confident about?',
      'How long do you think it would take you to get up to speed?',
      'What would you want to accomplish in your first 90 days?'
    ]
  },

];
