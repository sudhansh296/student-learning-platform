import type { NextjsLesson } from '../nextjs-curriculum';

export const nextjsClientComponentsLesson: NextjsLesson = {
  id: 'nextjs-client-components',
  title: 'Client Components',
  slug: 'client-components',
  chapter: 'data',
  order: 6,
  difficulty: 'intermediate',
  readingTime: 10,
  description: 'Add interactivity with Client Components - use "use client" when you need useState, useEffect, event handlers, or browser APIs.',
  sections: [
    {
      type: 'text',
      content: 'Client Components are React components that run in the browser. They enable interactivity - state, effects, event handlers, and browser APIs. In Next.js App Router, you opt into being a Client Component by adding "use client" as the very first line of the file. All imports in a Client Component file also become part of the client bundle.',
    },
    {
      type: 'heading',
      content: 'The "use client" Directive',
    },
    {
      type: 'example',
      title: 'Adding "use client" to enable interactivity',
      content: 'The "use client" directive must be the first line of the file - before any imports. It marks this file and all its imports as part of the client bundle. Once you add it, you can use all React hooks and browser APIs freely.',
      language: 'typescript',
      code: `'use client'; // Must be the FIRST line - before imports

import { useState, useEffect } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = 'Count: ' + count;
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => setCount(c => c - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// This component can now use:
// [OK] useState, useReducer, useContext
// [OK] useEffect, useLayoutEffect, useRef
// [OK] Event handlers (onClick, onSubmit, etc.)
// [OK] window, document, localStorage
// [OK] Third-party hooks (react-query, zustand, etc.)`,
    },
    {
      type: 'heading',
      content: 'useState in Client Components',
    },
    {
      type: 'example',
      title: 'Interactive form with useState',
      content: 'A typical Client Component use case is a form with controlled inputs. The "use client" directive at the top enables useState and the onChange handlers that update the form state on each keystroke.',
      language: 'typescript',
      code: `'use client';

import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
}

export function ContactForm() {
  const [form, setForm] = useState<FormData>({ name: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError('All fields required');
      return;
    }
    const res = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) setSubmitted(true);
  }

  if (submitted) return <p>Thanks, {form.name}! We will be in touch.</p>;

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <button type="submit">Send</button>
    </form>
  );
}`,
    },
    {
      type: 'heading',
      content: 'Mixing Server and Client Components',
    },
    {
      type: 'example',
      title: 'Server parent, Client children - the right pattern',
      content: 'Keep data fetching and layout in Server Components. Move only the interactive pieces to Client Components. A Server Component can import and render Client Components - the Client Component receives its props from the server and hydrates in the browser.',
      language: 'typescript',
      code: `// app/products/[id]/page.tsx - Server Component
import { AddToCartButton } from '@/components/AddToCartButton'; // Client
import { ProductGallery } from '@/components/ProductGallery';   // Client

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Fetch on server - no API route needed
  const product = await fetch('/api/products/' + id).then(r => r.json());

  return (
    <div>
      {/* Server-rendered static content */}
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>Price: \${product.price}</p>

      {/* Client components receive server data as props */}
      <ProductGallery images={product.images} />
      <AddToCartButton productId={product.id} price={product.price} />
    </div>
  );
}

// components/AddToCartButton.tsx - Client Component
'use client';
import { useState } from 'react';

export function AddToCartButton({ productId, price }: { productId: string; price: number }) {
  const [added, setAdded] = useState(false);
  return (
    <button onClick={() => { addToCart(productId); setAdded(true); }}>
      {added ? 'Added to Cart!' : 'Add to Cart - $' + price}
    </button>
  );
}`,
    },
    {
      type: 'example',
      title: 'When to use Server vs Client Components',
      content: 'The decision is straightforward: if the component needs interactivity or browser APIs, use "use client". Otherwise, keep it as a Server Component. Aim to push "use client" as far down the component tree as possible to minimize client JavaScript.',
      language: 'typescript',
      code: `// Decision guide:

// Use SERVER Component when:
// - Fetching data (async component with fetch/db)
// - Accessing environment variables
// - Rendering static/read-only content
// - Using large server-only libraries
// - The component does not need interactivity

// Use CLIENT Component ("use client") when:
// - Using useState or useReducer
// - Using useEffect or useLayoutEffect
// - Using onClick, onChange, onSubmit handlers
// - Using browser APIs: window, localStorage, navigator
// - Using third-party libraries that need browser APIs
// - Using React Context providers

// Examples:
// [OK] Server: BlogPost, ProductList, UserProfile (display only)
// [OK] Server: any page.tsx or layout.tsx that fetches data
// [OK] Client: SearchBar (handles input state)
// [OK] Client: Cart (tracks items in state)
// [OK] Client: Modal (open/close state)
// [OK] Client: ThemeToggle (reads/writes localStorage)
// [OK] Client: Slider, Tabs, Accordion (UI state)`,
    },
    {
      type: 'tryit',
      title: 'Client Component Interactions',
      css: `body{font-family:system-ui,sans-serif;padding:14px;margin:0;background:#f0f2f5;}
.card{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:14px;margin-bottom:10px;}
.card-title{font-size:13px;font-weight:700;color:#111;margin-bottom:10px;display:flex;align-items:center;gap:6px;}
.card-tag{font-size:10px;background:#f3f4f6;color:#666;padding:2px 7px;border-radius:20px;font-weight:400;}
.counter-row{display:flex;align-items:center;gap:10px;}
.count-val{font-size:32px;font-weight:900;min-width:50px;text-align:center;color:#000;}
.cbtn{border:none;border-radius:6px;padding:8px 16px;font-size:14px;cursor:pointer;font-weight:700;}
.cbtn-dec{background:#fee2e2;color:#dc2626;}
.cbtn-inc{background:#dcfce7;color:#16a34a;}
.cbtn-rst{background:#f3f4f6;color:#666;font-size:12px;padding:6px 12px;}
.input-area input{width:100%;box-sizing:border-box;border:1px solid #e5e7eb;border-radius:6px;padding:8px 12px;font-size:14px;outline:none;}
.input-area input:focus{border-color:#000;}
.input-preview{font-size:13px;color:#555;min-height:22px;margin-top:6px;padding:6px 10px;background:#f9fafb;border-radius:6px;}
.toggle-row{display:flex;align-items:center;gap:10px;}
.toggle-btn{border:none;border-radius:20px;padding:6px 16px;font-size:13px;cursor:pointer;font-weight:600;transition:all 0.2s;}
.toggle-on{background:#000;color:#fff;}
.toggle-off{background:#e5e7eb;color:#666;}
.toggle-status{font-size:13px;color:#666;}`,
      js: `var count = 0;
var toggleOn = false;
var inputVal = '';

function updateCount(delta) {
  count = Math.max(0, count + delta);
  document.getElementById('count-num').textContent = count;
  console.log('useState update - count:', count);
}

function resetCount() {
  count = 0;
  document.getElementById('count-num').textContent = 0;
}

function onInput(val) {
  inputVal = val;
  var el = document.getElementById('input-preview');
  el.textContent = val ? 'Live value: "' + val + '" (' + val.length + ' chars)' : 'Start typing above...';
  console.log('onChange - value:', val);
}

function flipToggle() {
  toggleOn = !toggleOn;
  var btn = document.getElementById('toggle-btn');
  var status = document.getElementById('toggle-status');
  btn.textContent = toggleOn ? 'ON' : 'OFF';
  btn.className = 'toggle-btn ' + (toggleOn ? 'toggle-on' : 'toggle-off');
  status.textContent = toggleOn ? 'Feature is enabled' : 'Feature is disabled';
  console.log('toggle state:', toggleOn);
}

document.getElementById('output').innerHTML =
  '<div class="card">' +
  '<div class="card-title">Counter <span class="card-tag">useState</span></div>' +
  '<div class="counter-row">' +
  '<button class="cbtn cbtn-dec" id="btn-dec">-</button>' +
  '<span class="count-val" id="count-num">0</span>' +
  '<button class="cbtn cbtn-inc" id="btn-inc">+</button>' +
  '<button class="cbtn cbtn-rst" id="btn-rst">Reset</button>' +
  '</div></div>' +

  '<div class="card">' +
  '<div class="card-title">Text Input <span class="card-tag">onChange controlled input</span></div>' +
  '<div class="input-area">' +
  '<input type="text" id="text-input" placeholder="Type something..." />' +
  '<div class="input-preview" id="input-preview">Start typing above...</div>' +
  '</div></div>' +

  '<div class="card">' +
  '<div class="card-title">Toggle <span class="card-tag">boolean state</span></div>' +
  '<div class="toggle-row">' +
  '<button class="toggle-btn toggle-off" id="toggle-btn">OFF</button>' +
  '<span class="toggle-status" id="toggle-status">Feature is disabled</span>' +
  '</div></div>';

document.getElementById('btn-dec').addEventListener('click', function() { updateCount(-1); });
document.getElementById('btn-inc').addEventListener('click', function() { updateCount(1); });
document.getElementById('btn-rst').addEventListener('click', resetCount);
document.getElementById('text-input').addEventListener('input', function() { onInput(this.value); });
document.getElementById('toggle-btn').addEventListener('click', flipToggle);`,
    },
  ],
  exercises: [
    {
      id: 'nextjs-cc-1',
      question: 'Where does the "use client" directive go in a component file?',
      type: 'multiple-choice',
      options: [
        'At the bottom of the file, after all exports',
        'Above the component function, below the imports',
        'As the very first line of the file, before any imports',
        'Inside the component function body',
      ],
      correct: 2,
      explanation: '"use client" must be the very first line of the file - before any import statements. This is because it acts as a compilation boundary telling the Next.js bundler to include this file and all its imports in the client JavaScript bundle.',
    },
    {
      id: 'nextjs-cc-2',
      question: 'What is the recommended pattern for combining Server and Client Components?',
      type: 'multiple-choice',
      options: [
        'Put "use client" in every file to avoid confusion',
        'Use Client Components at the top level and pass data down to Server Components',
        'Keep data fetching in Server Components, push interactivity to leaf Client Components',
        'Server and Client Components cannot be used together in the same page',
      ],
      correct: 2,
      explanation: 'The recommended pattern is to keep as much as possible in Server Components (data fetching, layout, static content) and push "use client" as far down the component tree as possible to the leaf interactive components. This minimizes the client JavaScript bundle.',
    },
  ],
  quiz: [
    {
      id: 'nextjs-cc-q1',
      question: 'If you add "use client" to a component file, what happens to the libraries imported in that file?',
      options: [
        'They are only loaded on the server',
        'They are excluded from the bundle automatically',
        'They are included in the client JavaScript bundle',
        'They are split into a separate chunk loaded lazily',
      ],
      correct: 2,
      explanation: 'When you add "use client" to a file, that file becomes a client boundary. All imports in that file - including third-party libraries - are included in the client JavaScript bundle sent to the browser. This is why you should avoid importing large libraries in Client Components when possible.',
    },
  ],
};
