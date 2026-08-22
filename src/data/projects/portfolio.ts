import type { Project } from './types';

// Source: https://github.com/sudhansh296/Portfolio
// Real fullstack portfolio by Sudhanshu Kumar
// Frontend: React, Framer Motion, tsparticles, EmailJS, React Router
// Backend: Node.js, Express, MongoDB, Cloudinary, JWT, Helmet, Rate Limiting

const appJsx = `import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import MobileApps from './pages/MobileApps';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/mobile-apps" element={<MobileApps />} />
      </Routes>
    </BrowserRouter>
  );
}`;

const heroJsx = `import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { TypeAnimation } from 'react-type-animation';

const socials = [
  { name: 'GitHub',    url: 'https://github.com/sudhansh296' },
  { name: 'LinkedIn',  url: 'https://www.linkedin.com/in/sudhanshu-kumar-867918257' },
  { name: 'Instagram', url: 'https://www.instagram.com/coder_lobby' },
  { name: 'YouTube',   url: 'https://youtube.com/@coder_lobby' },
  { name: 'Telegram',  url: 'https://t.me/coding_python_programming' },
];

export default function Hero() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <section id="home" style={styles.section}>
      {/* Animated particle background */}
      <Particles id="tsparticles" init={particlesInit} options={{
        particles: {
          color: { value: '#6c63ff' },
          links: { color: '#6c63ff', distance: 150, enable: true, opacity: 0.15 },
          move: { enable: true, speed: 0.8 },
          number: { value: 60 },
          opacity: { value: 0.2 },
          size: { value: { min: 1, max: 3 } }
        }
      }} style={{ position: 'absolute', inset: 0 }} />

      <div style={styles.content}>
        {/* Available badge */}
        <div style={styles.badge}>
          <span style={styles.dot} />
          Available for freelance work
        </div>

        {/* Name with shimmer gradient animation */}
        <h1 style={styles.name}>Sudhanshu Kumar</h1>

        {/* Type animation cycling through roles */}
        <div style={styles.typeWrap}>
          <span>I am a </span>
          <TypeAnimation
            sequence={['Developer', 2000, 'Creator', 2000, 'Builder', 2000, 'Freelancer', 2000]}
            wrapper="span" speed={50} repeat={Infinity}
            style={{ color: '#a78bfa', fontWeight: 700 }}
          />
        </div>

        {/* Social links row */}
        <div style={styles.socials}>
          {socials.map(s => (
            <a key={s.name} href={s.url} target="_blank" rel="noreferrer" style={styles.socialBtn}>
              {s.name}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div style={styles.ctaRow}>
          <a href="#projects" style={styles.ctaPrimary}>View Projects</a>
          <a href="#contact-form" style={styles.ctaSecondary}>Hire Me</a>
        </div>

        {/* Stats row */}
        <div style={styles.stats}>
          {[['10+', 'Projects'], ['2+ Yrs', 'Experience'], ['15+', 'Technologies']].map(([val, label]) => (
            <div key={label} style={styles.stat}>
              <span style={styles.statVal}>{val}</span>
              <span style={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}`;

const contactJsx = `import React, { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await emailjs.send(
        'service_p312t58',        // EmailJS service ID
        'template_05a7ig8',       // EmailJS template ID
        { name: form.name, email: form.email, message: form.message },
        'b6GyHFdl5nptLlEPn'      // EmailJS public key
      );
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(''), 4000);
    } catch (err) {
      setStatus('error');
      setTimeout(() => setStatus(''), 4000);
    }
  };

  return (
    <section id="contact-form" style={styles.section}>
      <h2>Contact Me</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <input name="name" value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Your name" required style={styles.input} />
          <input name="email" type="email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="your@email.com" required style={styles.input} />
        </div>
        <textarea name="message" value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          placeholder="Tell me about your project..." required
          style={{ ...styles.input, height: '140px' }} />
        <button type="submit" style={styles.btn} disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...'
           : status === 'sent'    ? 'Message Sent!'
           : status === 'error'   ? 'Failed, try again'
           : 'Send Message'}
        </button>
      </form>
    </section>
  );
}`;

const serverJs = `const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

dotenv.config();
const app = express();

// Security: set HTTP headers
app.use(helmet());

// Rate limiting: max 100 requests per 15 min globally
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Strict rate limit for login: 10 attempts per 15 min
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
app.use('/api/auth/login', loginLimiter);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err.message));

// Routes
app.use('/api/projects', require('./routes/projects'));
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/profile',  require('./routes/profile'));

app.listen(process.env.PORT || 5000);`;

const indexCss = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg: #050508;  --bg2: #07070f;  --bg3: #0d0d14;
  --border: #1a1a2e;  --text: #ffffff;
  --text2: #aaaaaa;   --text3: #555555;
  --card: #0d0d14;
}

body.light {
  --bg: #f8f9ff;  --bg2: #f0f2ff;  --bg3: #ffffff;
  --border: #e0e0f0;  --text: #111111;
  --text2: #444444;   --text3: #888888;
  --card: #ffffff;
}

body {
  font-family: 'Inter', sans-serif;
  background: var(--bg);
  color: var(--text);
  scroll-behavior: smooth;
  overflow-x: hidden;
  transition: background 0.3s ease, color 0.3s ease;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}

.card-hover {
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
.card-hover:hover {
  transform: translateY(-6px);
  border-color: #6c63ff !important;
  box-shadow: 0 20px 40px rgba(108,99,255,0.15);
}`;

export const portfolioProject: Project = {
  id: 'portfolio',
  slug: 'portfolio',
  title: 'Developer Portfolio',
  difficulty: 'intermediate',
  type: 'fullstack',
  estimatedTime: '10-20 hours',
  description: 'Build a full-stack developer portfolio with React, animated particle background, type animation, EmailJS contact form, and a Node.js/Express/MongoDB admin backend — the real portfolio used by Sudhanshu Kumar.',
  technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'EmailJS', 'Framer Motion', 'tsparticles'],
  prerequisites: ['React basics', 'JavaScript ES6', 'Basic CSS', 'Node.js basics'],
  learnings: [
    'React component architecture',
    'Framer Motion animations',
    'tsparticles animated background',
    'TypeAnimation for cycling text',
    'EmailJS for contact form (no backend needed)',
    'Express + MongoDB REST API',
    'JWT authentication',
    'Security: Helmet, rate limiting, CORS',
    'Cloudinary image upload',
    'Deployment on Vercel and Render',
  ],
  features: [
    'Animated particle background using tsparticles',
    'Shimmer gradient name animation',
    'Cycling type animation: Developer / Creator / Builder / Freelancer',
    'Social links row (GitHub, LinkedIn, Instagram, YouTube, Telegram)',
    'Projects section with live GitHub links',
    'Skills showcase with technology badges',
    'Contact form with EmailJS (sends real emails)',
    'Admin panel protected with JWT auth',
    'Photo upload via Cloudinary API',
    'Security: Helmet headers, rate limiting, CORS',
    'Light and dark mode toggle',
    'Deployed on Vercel (frontend) and Render (backend)',
  ],
  fileStructure: 'portfolio/\n  frontend/\n    src/\n      App.jsx\n      index.css\n      pages/\n        Home.jsx\n        Admin.jsx\n      components/\n        Hero.jsx\n        About.jsx\n        Contact.jsx\n        Footer.jsx\n        Cursor.jsx\n    package.json\n  backend/\n    server.js\n    routes/\n      projects.js\n      auth.js\n      profile.js\n    models/\n    middleware/\n    package.json',
  overview: 'This is a production fullstack developer portfolio built with React on the frontend and Node.js/Express/MongoDB on the backend. The frontend uses tsparticles for an animated network background, react-type-animation for cycling role text, Framer Motion for smooth page transitions, and EmailJS so the contact form sends real emails without a backend email server. The backend has a full admin panel with JWT authentication, Cloudinary photo upload, and proper security (Helmet, rate limiting). It is deployed on Vercel and Render.',
  objective: 'Build and deploy a complete fullstack developer portfolio with animations, a working contact form, and an admin backend.',
  nextProject: 'expense-tracker',
  github: {
    owner: 'sudhansh296',
    repo: 'Portfolio',
    branch: 'main',
    url: 'https://github.com/sudhansh296/Portfolio',
  },
  liveUrl: 'https://portfolio-sudhanshu295.vercel.app',
  files: [
    { path: 'frontend/src/App.jsx',                language: 'javascript', content: appJsx },
    { path: 'frontend/src/index.css',              language: 'css',        content: indexCss },
    { path: 'frontend/src/components/Hero.jsx',    language: 'javascript', content: heroJsx },
    { path: 'frontend/src/components/Contact.jsx', language: 'javascript', content: contactJsx },
    { path: 'backend/server.js',                   language: 'javascript', content: serverJs },
  ],
  lessons: [
    {
      id: 'architecture',
      title: 'Fullstack Architecture',
      explanation: 'This portfolio has two completely separate applications. The frontend is a React SPA (Single Page Application) created with Create React App. It runs on port 3000 locally and is deployed to Vercel. The backend is a Node.js/Express REST API that connects to MongoDB Atlas. It runs on port 5000 locally and is deployed to Render. The frontend talks to the backend using axios with a proxy setting in package.json during development. In production, the frontend calls the Render URL directly.',
      js: `// frontend/src/api.js
import axios from 'axios';

// In development: proxy in package.json forwards /api calls to port 5000
// In production: use REACT_APP_API_URL environment variable
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
});

export default API;

// frontend/package.json
{
  "proxy": "http://localhost:5000"  // dev proxy to backend
}

// Usage in any component:
import API from '../api';
const response = await API.get('/api/projects');`,
    },
    {
      id: 'particles',
      title: 'Animated Particle Background',
      explanation: 'tsparticles creates the animated network of dots and connecting lines in the hero section. The particlesInit callback loads the slim bundle (smaller file size). The options object configures particle color, link distance and opacity, movement speed, particle count, and size range. The Particles component renders as an absolutely positioned div behind the content, creating depth without affecting layout. The particle density and speed are intentionally low for a subtle, professional feel.',
      js: heroJsx,
    },
    {
      id: 'type-animation',
      title: 'Cycling Type Animation',
      explanation: 'react-type-animation takes a sequence array alternating between text strings and delay milliseconds. It types each string character by character at the configured speed, waits the specified delay, then moves to the next. repeat={Infinity} makes it loop forever. The wrapper="span" keeps it inline. This creates the "I am a Developer... Creator... Builder... Freelancer" cycling effect that immediately communicates your versatility to visitors.',
      js: `import { TypeAnimation } from 'react-type-animation';

// sequence: [text, delay_ms, text, delay_ms, ...]
<TypeAnimation
  sequence={[
    'Developer',  2000,   // type "Developer", wait 2s
    'Creator',    2000,   // type "Creator", wait 2s
    'Builder',    2000,
    'Freelancer', 2000,
  ]}
  wrapper="span"          // renders as <span>
  speed={50}              // typing speed (higher = faster)
  repeat={Infinity}       // loop forever
  style={{ color: '#a78bfa', fontWeight: 700 }}
/>`,
    },
    {
      id: 'emailjs',
      title: 'Contact Form with EmailJS',
      explanation: 'EmailJS lets you send emails directly from the browser using their API — no email server needed. You create a service (Gmail/Outlook), an email template with variables like {{name}} and {{message}}, and get a public key. emailjs.send() takes the service ID, template ID, the variables object, and your public key. The status state variable tracks sending/sent/error and updates the button text. The form resets after success and error states clear after 4 seconds.',
      js: contactJsx,
    },
    {
      id: 'backend-security',
      title: 'Backend Security: Helmet and Rate Limiting',
      explanation: 'Helmet sets security-related HTTP response headers automatically — it prevents clickjacking (X-Frame-Options), XSS attacks (X-XSS-Protection), and MIME sniffing (X-Content-Type-Options). express-rate-limit prevents brute force and DDoS attacks by limiting how many requests an IP can make in a time window. We apply a stricter limit to the login route (10 requests per 15 min) to prevent password guessing. This is production-grade security used in real applications.',
      js: serverJs,
    },
    {
      id: 'css-variables-theming',
      title: 'CSS Variables for Dark/Light Mode',
      explanation: 'CSS custom properties defined in :root set the default dark theme colors. body.light overrides those same variables with light theme values. When the theme toggle button runs document.body.classList.toggle("light"), every element using a CSS variable switches instantly — no JavaScript color changes needed. The transition on body animates the switch smoothly. This pattern means all 50+ components automatically respect the theme without any theme prop drilling.',
      css: indexCss,
    },
    {
      id: 'framer-motion',
      title: 'Page Transitions with Framer Motion',
      explanation: 'Framer Motion adds smooth animations with a declarative API. motion.div replaces a regular div and accepts animate, initial, and exit props. The variants object defines named animation states. whileInView triggers animations when elements scroll into the viewport. AnimatePresence handles exit animations when components unmount. The portfolio uses this for fade-in-up effects on sections, hover animations on project cards, and smooth page transitions in React Router.',
      js: `import { motion, AnimatePresence } from 'framer-motion';

// Fade up when element enters viewport
const fadeUpVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Usage
<motion.div
  variants={fadeUpVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}   // only animate once
>
  <h2>Projects</h2>
</motion.div>

// Hover animation on project card
<motion.div
  whileHover={{ y: -6, scale: 1.02 }}
  transition={{ type: 'spring', stiffness: 300 }}
>
  <ProjectCard />
</motion.div>`,
    },
  ],
  challenges: [
    {
      id: 'c1',
      title: 'Add a Projects Filter',
      difficulty: 'easy',
      description: 'Add filter buttons to the Projects section — All, Frontend, Backend, Fullstack. Clicking a filter shows only projects of that type.',
      hint: 'Add a category field to each project object. Store the active filter in useState. Filter the projects array before rendering based on the active filter. Highlight the active button with a different style.',
    },
    {
      id: 'c2',
      title: 'Add Skill Progress Bars',
      difficulty: 'medium',
      description: 'Add animated progress bars to the Skills section that fill from 0 to the skill percentage when the section scrolls into view.',
      hint: 'Use Framer Motion with useInView. Set the bar width to 0 initially. When in view, animate width to the skill percentage using motion.div with animate={{ width: skill.level + "%" }}.',
    },
    {
      id: 'c3',
      title: 'Add a Blog Section',
      difficulty: 'medium',
      description: 'Add a blog section that fetches your dev.to or hashnode articles via their public API and displays them as cards.',
      hint: 'dev.to API: fetch("https://dev.to/api/articles?username=YOUR_USERNAME"). Map over the articles array and render a card with article.title, article.description, article.url, and article.cover_image.',
    },
    {
      id: 'c4',
      title: 'Deploy Your Own Version',
      difficulty: 'hard',
      description: 'Fork this repo, update it with your own name, projects, and social links, then deploy frontend to Vercel and backend to Render.',
      hint: 'Fork the repo on GitHub. Update personal info in Hero.jsx and About.jsx. Create a MongoDB Atlas cluster and get the connection string. Add MONGO_URI to Render environment variables. Add REACT_APP_API_URL to Vercel environment variables pointing to your Render URL.',
    },
  ],
};
