// Hand-written SEO copy for the highest-value lessons. Lessons that are not listed here get a title / description
// generated from the lesson itself (see src/lib/seo.ts), so nothing here is required for a page to work.
//
// title       — keyword-friendly <title> (the site adds "| WebDev Atlas"), keep it under ~50 characters
// description — meta description, 110–158 characters, says what the reader will be able to do
// h1          — the on-page heading, worded like the search a beginner would type
// related     — natural internal links shown under the lesson ("course/slug")

export interface LessonSeo {
  title: string;
  description: string;
  h1?: string;
  related?: string[];
}

export const LESSON_SEO: Record<string, LessonSeo> = {
  'js/scope-closures': {
    title: 'JavaScript Scope, Hoisting and Closures Explained',
    description: 'Understand JavaScript scope, hoisting and closures: var, let and const, the temporal dead zone, lexical scope and how closures remember variables.',
    related: ['js/functions', 'js/variables', 'js/event-loop', 'js/es6-features'],
  },
  'typescript/react-typescript': {
    title: 'TypeScript for React: Typing Props and State',
    description: 'Learn how to use TypeScript in React: type props and state, event handlers, useState and useRef generics, and common component patterns.',
  },
  'react/typescript-react': {
    title: 'Using TypeScript in React Projects',
    description: 'Set up TypeScript in a React project and write typed components: props, children, hooks, events and reusable generic components.',
  },
  'js/functions': {
    title: 'JavaScript Functions Tutorial with Examples',
    description: 'Learn JavaScript functions step by step: declarations, arrow functions, parameters, return values, callbacks and closures, with runnable examples.',
    h1: 'JavaScript Functions – Complete Guide with Examples',
    related: ['js/scope-closures', 'js/arrays', 'js/async-await', 'js/es6-features'],
  },
  'js/arrays': {
    title: 'JavaScript Arrays and Array Methods',
    description: 'Learn JavaScript arrays and the methods you use every day: map, filter, reduce, find, sort, slice and splice, with clear examples you can run.',
    h1: 'JavaScript Arrays and Array Methods Explained',
    related: ['js/functions', 'js/objects', 'js/loops', 'js/es6-features'],
  },
  'js/objects': {
    title: 'JavaScript Objects Tutorial with Examples',
    description: 'Understand JavaScript objects: properties, methods, destructuring, spread, Object.keys and entries, this and copying objects, with examples.',
    h1: 'JavaScript Objects – Properties, Methods and Destructuring',
    related: ['js/arrays', 'js/classes', 'js/prototypes', 'js/es6-features'],
  },
  'js/async-await': {
    title: 'JavaScript Async/Await and Promises Tutorial',
    description: 'Learn asynchronous JavaScript: callbacks, Promises, async/await, error handling and running tasks in parallel, with practical examples.',
    h1: 'JavaScript Promises and Async/Await – Beginner Guide',
    related: ['js/event-loop', 'js/fetch-api', 'js/error-handling', 'nodejs/async-callbacks'],
  },
  'js/dom': {
    title: 'JavaScript DOM Manipulation Tutorial',
    description: 'Learn the JavaScript DOM: select elements, change text, styles and attributes, create and remove nodes, and handle events, with live examples.',
    h1: 'JavaScript DOM Manipulation – Select, Change and Create Elements',
    related: ['js/events', 'js/forms', 'js/localstorage', 'html/forms'],
  },
  'js/fetch-api': {
    title: 'JavaScript Fetch API Tutorial (GET, POST)',
    description: 'Learn how to call APIs with the JavaScript Fetch API: GET and POST requests, JSON, headers, error handling and async/await, with examples.',
    h1: 'JavaScript Fetch API – How to Make GET and POST Requests',
    related: ['js/async-await', 'js/error-handling', 'restapi/03-http-methods', 'react/fetch-data'],
  },
  'js/event-loop': {
    title: 'JavaScript Event Loop Explained Simply',
    description: 'Understand the JavaScript event loop: the call stack, the task queue, microtasks, timers and why async code runs in the order it does.',
    h1: 'JavaScript Event Loop Explained – Call Stack, Queue and Microtasks',
    related: ['js/async-await', 'js/scope-closures', 'nodejs/async-callbacks', 'js/error-handling'],
  },
  'css/flexbox': {
    title: 'CSS Flexbox Tutorial with Examples',
    description: 'Learn CSS Flexbox: flex containers and items, justify-content, align-items, wrapping, gap and real layout patterns like navbars and cards.',
    h1: 'CSS Flexbox – Complete Guide with Examples',
    related: ['css/grid', 'css/responsive', 'css/positioning', 'css/box-model'],
  },
  'css/grid': {
    title: 'CSS Grid Layout Tutorial with Examples',
    description: 'Learn CSS Grid: rows and columns, fr units, grid areas, gaps, auto-fit and minmax, and how to build responsive page layouts with it.',
    h1: 'CSS Grid Layout – Complete Guide with Examples',
    related: ['css/flexbox', 'css/responsive', 'css/box-model', 'css/positioning'],
  },
  'css/selectors': {
    title: 'CSS Selectors Tutorial and Cheat Sheet',
    description: 'Learn every CSS selector that matters: element, class, id, attribute, combinators, pseudo-classes, pseudo-elements and specificity.',
    h1: 'CSS Selectors – Types, Combinators and Specificity Explained',
    related: ['css/box-model', 'css/colors-backgrounds', 'html/classes-id', 'js/dom'],
  },
  'css/responsive': {
    title: 'Responsive Web Design with CSS Media Queries',
    description: 'Make websites work on every screen: the viewport meta tag, media queries, fluid units, responsive images and mobile-first CSS, with examples.',
    h1: 'Responsive Web Design – Media Queries and Mobile-First CSS',
    related: ['css/flexbox', 'css/grid', 'html/responsive', 'css/box-model'],
  },
  'html/forms': {
    title: 'HTML Forms Tutorial: Inputs, Labels, Validation',
    description: 'Build HTML forms the right way: input types, labels, select, textarea, buttons, built-in validation and accessible form markup.',
    h1: 'HTML Forms – Input Types, Labels and Validation',
    related: ['html/semantic', 'js/forms', 'js/dom', 'react/forms'],
  },
  'html/semantic': {
    title: 'Semantic HTML Tags Explained with Examples',
    description: 'Learn semantic HTML: header, nav, main, section, article, aside and footer, why they matter for SEO and accessibility, and when to use them.',
    h1: 'Semantic HTML – Tags, Meaning and Best Practices',
    related: ['html/layout', 'html/head', 'html/forms', 'css/selectors'],
  },
  'react/state': {
    title: 'React useState Hook: State Explained',
    description: 'Learn React state with the useState hook: updating state, functional updates, objects and arrays in state, and common beginner mistakes.',
    h1: 'React State and the useState Hook – Beginner Guide',
    related: ['react/useeffect', 'react/events', 'react/forms', 'react/lists-keys'],
  },
  'react/useeffect': {
    title: 'React useEffect Hook Explained with Examples',
    description: 'Understand useEffect in React: the dependency array, cleanup functions, fetching data, timers and how to avoid infinite loops.',
    h1: 'React useEffect Hook – Dependencies, Cleanup and Examples',
    related: ['react/state', 'react/fetch-data', 'react/custom-hooks', 'react/useref'],
  },
  'react/context': {
    title: 'React Context API and useContext Tutorial',
    description: 'Learn the React Context API and useContext: share data without prop drilling, build a theme or auth provider, and know when not to use it.',
    h1: 'React Context API and useContext – Avoid Prop Drilling',
    related: ['react/state', 'react/context-advanced', 'react/custom-hooks', 'react/performance'],
  },
  'react/forms': {
    title: 'React Forms: Controlled Inputs and Validation',
    description: 'Build forms in React: controlled inputs, handling submit, checkboxes and selects, validation and showing error messages, with examples.',
    h1: 'React Forms – Controlled Components, Submit and Validation',
    related: ['react/state', 'react/events', 'html/forms', 'react/custom-hooks'],
  },
  'react/performance': {
    title: 'React Performance: memo, useMemo, useCallback',
    description: 'Speed up React apps: avoid needless re-renders with React.memo, useMemo and useCallback, use keys well and split code with lazy loading.',
    h1: 'React Performance Optimization – memo, useMemo and useCallback',
    related: ['react/useeffect', 'react/lists-keys', 'react/context', 'react/best-practices'],
  },
  'nodejs/rest-api': {
    title: 'Build a REST API with Node.js and Express',
    description: 'Build a REST API in Node.js: routes, CRUD endpoints, JSON, status codes, validation and error handling, step by step.',
    h1: 'Node.js REST API Tutorial – Build CRUD Endpoints',
    related: ['express/middleware', 'restapi/03-http-methods', 'mongodb/crud-basics', 'express/authentication'],
  },
  'express/middleware': {
    title: 'Express Middleware Explained with Examples',
    description: 'Learn Express middleware: how next() works, the request pipeline, built-in and third-party middleware, error handlers and custom middleware.',
    h1: 'Express.js Middleware – How It Works with Examples',
    related: ['express/routing-basics', 'express/error-handling', 'express/authentication', 'nodejs/rest-api'],
  },
  'mongodb/crud-basics': {
    title: 'MongoDB CRUD Operations Tutorial',
    description: 'Learn MongoDB CRUD: insertOne and insertMany, find, updateOne, updateMany, deleteOne and deleteMany, with queries you can copy and run.',
    h1: 'MongoDB CRUD Operations – Insert, Find, Update and Delete',
    related: ['mongodb/queries', 'mongodb/indexing', 'mongodb/mongoose', 'express/database'],
  },
  'sql/07-joins': {
    title: 'SQL JOINs Explained: INNER, LEFT, RIGHT, FULL',
    description: 'Understand SQL JOINs with simple examples: INNER, LEFT, RIGHT and FULL joins, joining more than two tables and common join mistakes.',
    h1: 'SQL JOINs – INNER, LEFT, RIGHT and FULL JOIN Explained',
    related: ['sql/08-subqueries', 'sql/06-aggregates', 'postgresql/06-joins', 'sql/09-indexes-constraints'],
  },
  // ---- JavaScript ----
  'js/introduction': {
    title: 'JavaScript Tutorial for Beginners',
    description: 'Start learning JavaScript from zero: what it is, how it runs in the browser, and how to write and run your first script with examples you can edit.',
    h1: 'JavaScript Tutorial for Beginners – Start Here',
    related: ['js/variables', 'js/data-types', 'js/functions', 'js/dom'],
  },
  'js/variables': {
    title: 'JavaScript Variables: let, const and var',
    description: 'Learn how to declare JavaScript variables with let, const and var, when to use each one, and how scope and reassignment change the result.',
    h1: 'JavaScript Variables – let, const and var Explained',
    related: ['js/data-types', 'js/scope-closures', 'js/operators', 'js/es6-features'],
  },
  'js/data-types': {
    title: 'JavaScript Data Types Explained with Examples',
    description: 'Understand JavaScript data types: strings, numbers, booleans, null, undefined, objects and symbols, plus typeof and type conversion pitfalls.',
    related: ['js/variables', 'js/strings', 'js/numbers', 'js/operators'],
  },
  'js/operators': {
    title: 'JavaScript Operators: Arithmetic to Logical',
    description: 'A practical guide to JavaScript operators: arithmetic, comparison, logical, ternary and nullish coalescing, and why === is safer than ==.',
    related: ['js/conditions', 'js/data-types', 'js/variables', 'js/loops'],
  },
  'js/conditions': {
    title: 'JavaScript if, else and switch Statements',
    description: 'Learn to make decisions in JavaScript with if, else if, else, switch and the ternary operator, with clear examples and common mistakes to avoid.',
    h1: 'JavaScript if...else and switch – Conditions Explained',
    related: ['js/operators', 'js/loops', 'js/functions', 'js/error-handling'],
  },
  'js/loops': {
    title: 'JavaScript Loops: for, while and for...of',
    description: 'Learn every JavaScript loop: for, while, do...while, for...of and for...in, when to pick each one, and how break and continue change the flow.',
    h1: 'JavaScript Loops – for, while, for...of and for...in',
    related: ['js/arrays', 'js/conditions', 'js/functions', 'js/objects'],
  },
  'js/strings': {
    title: 'JavaScript String Methods with Examples',
    description: 'Work with text in JavaScript: template literals, slice, split, replace, includes, trim and padStart, with short examples you can run and edit.',
    h1: 'JavaScript Strings and String Methods',
    related: ['js/regex', 'js/data-types', 'js/arrays', 'js/numbers'],
  },
  'js/classes': {
    title: 'JavaScript Classes and OOP for Beginners',
    description: 'Learn JavaScript classes: constructors, methods, inheritance with extends and super, static members and private fields, explained step by step.',
    h1: 'JavaScript Classes and Object-Oriented Programming',
    related: ['js/prototypes', 'js/objects', 'js/modules', 'js/design-patterns'],
  },
  'js/error-handling': {
    title: 'JavaScript Error Handling: try, catch, finally',
    description: 'Handle errors in JavaScript with try, catch and finally, throw your own errors, and deal with failed promises and async code without crashing.',
    related: ['js/async-await', 'js/fetch-api', 'js/functions', 'js/conditions'],
  },
  'js/es6-features': {
    title: 'Modern JavaScript (ES6+) Features Explained',
    description: 'Tour the ES6+ features you use every day: arrow functions, destructuring, spread, optional chaining and modules, with examples you can run.',
    h1: 'Modern JavaScript – ES6+ Features Every Developer Uses',
    related: ['js/functions', 'js/arrays', 'js/modules', 'js/objects'],
  },
  'js/localstorage': {
    title: 'localStorage and sessionStorage in JavaScript',
    description: 'Save data in the browser with localStorage and sessionStorage: setItem, getItem, JSON storage, size limits and what you should never store there.',
    related: ['js/dom', 'js/forms', 'js/objects', 'js/fetch-api'],
  },
  'js/regex': {
    title: 'JavaScript Regular Expressions for Beginners',
    description: 'Learn JavaScript regex from scratch: patterns, flags, character classes, groups and the test, match and replace methods, with practical examples.',
    related: ['js/strings', 'js/forms', 'js/error-handling', 'js/data-types'],
  },
  'js/modules': {
    title: 'JavaScript Modules: import and export',
    description: 'Split code into files with JavaScript ES modules: named and default exports, import syntax, dynamic import and how modules differ from CommonJS.',
    related: ['js/es6-features', 'js/functions', 'js/classes', 'nodejs/modules'],
  },
  'js/numbers': {
    title: 'JavaScript Numbers and the Math Object',
    description: 'Learn how JavaScript handles numbers: integers and floats, NaN, rounding, toFixed, parseInt and the Math methods, including the 0.1 + 0.2 puzzle.',
    related: ['js/data-types', 'js/operators', 'js/strings', 'js/dates'],
  },
  'js/dates': {
    title: 'JavaScript Dates and Times Explained',
    description: 'Create, read, compare and format dates in JavaScript with the Date object, timestamps and Intl.DateTimeFormat, and avoid the common timezone traps.',
    related: ['js/numbers', 'js/strings', 'js/data-types', 'js/objects'],
  },
  'js/events': {
    title: 'JavaScript Events: Listeners and Bubbling',
    description: 'Understand JavaScript events: addEventListener, the event object, bubbling and capturing, and event delegation, with live examples you can edit.',
    h1: 'JavaScript Events – addEventListener, Bubbling and Delegation',
    related: ['js/dom', 'js/forms', 'js/functions', 'react/events'],
  },
  'js/forms': {
    title: 'JavaScript Form Handling and Validation',
    description: 'Read form values, listen for submit, validate input and show error messages in plain JavaScript, using FormData and the built-in constraint API.',
    related: ['js/events', 'js/dom', 'js/regex', 'html/forms'],
  },
  'js/prototypes': {
    title: 'JavaScript Prototypes and the this Keyword',
    description: 'Understand the prototype chain, how inheritance works under the hood, and how this changes with call, apply, bind and arrow functions.',
    related: ['js/classes', 'js/objects', 'js/functions', 'js/scope-closures'],
  },
  'js/generators': {
    title: 'JavaScript Generators and Iterators',
    description: 'Learn iterators and generator functions in JavaScript: yield, lazy sequences, the iteration protocol and where generators are actually useful.',
    related: ['js/loops', 'js/async-await', 'js/arrays', 'js/es6-features'],
  },
  'js/weakmap-weakset': {
    title: 'JavaScript WeakMap, WeakSet and Memory',
    description: 'See how WeakMap and WeakSet differ from Map and Set, how garbage collection works, and when weak references help you avoid memory leaks.',
    related: ['js/objects', 'js/scope-closures', 'js/classes', 'js/design-patterns'],
  },
  'js/design-patterns': {
    title: 'JavaScript Design Patterns with Examples',
    description: 'Practical JavaScript design patterns: module, singleton, factory, observer and more, each with a short example and a note on when to use it.',
    related: ['js/classes', 'js/scope-closures', 'js/modules', 'js/prototypes'],
  },
  // ---- React ----
  'react/introduction': {
    title: 'React Tutorial for Beginners',
    description: 'Learn what React is, why teams use it, and how to build your first component, with a beginner-friendly path from JSX to state and hooks.',
    h1: 'React Tutorial for Beginners – What React Is and How to Start',
    related: ['react/jsx', 'react/components', 'react/props', 'react/state'],
  },
  'react/jsx': {
    title: 'React JSX Explained for Beginners',
    description: 'Understand JSX in React: how it maps to JavaScript, embedding expressions, attributes like className, fragments and the most common JSX mistakes.',
    related: ['react/components', 'react/props', 'react/conditional-rendering', 'react/lists-keys'],
  },
  'react/components': {
    title: 'React Components: Function Components Guide',
    description: 'Learn how to build React function components, split a UI into reusable pieces, compose them together and keep each component focused.',
    related: ['react/props', 'react/state', 'react/jsx', 'react/patterns'],
  },
  'react/props': {
    title: 'React Props Explained with Examples',
    description: 'Learn how props pass data from parent to child in React: destructuring, default values, passing functions and why props are read-only.',
    h1: 'React Props – Passing Data Between Components',
    related: ['react/components', 'react/state', 'react/events', 'react/typescript-react'],
  },
  'react/events': {
    title: 'Handling Events in React',
    description: 'Handle clicks, input changes and form submits in React: event handlers, synthetic events, passing arguments and preventing default behaviour.',
    related: ['react/state', 'react/forms', 'react/props', 'js/events'],
  },
  'react/conditional-rendering': {
    title: 'React Conditional Rendering Patterns',
    description: 'Show or hide UI in React with if statements, the ternary operator and &&, plus early returns and common bugs like rendering 0 by accident.',
    related: ['react/jsx', 'react/state', 'react/lists-keys', 'react/components'],
  },
  'react/lists-keys': {
    title: 'Rendering Lists and Keys in React',
    description: 'Render arrays as lists in React with map, learn why every item needs a stable key, and avoid the bugs caused by using array indexes as keys.',
    related: ['react/conditional-rendering', 'react/state', 'js/arrays', 'react/performance'],
  },
  'react/useref': {
    title: 'React useRef Hook: DOM Access and Mutable Values',
    description: 'Use the useRef hook in React to focus inputs, read DOM elements and keep values between renders without causing a re-render.',
    related: ['react/useeffect', 'react/state', 'react/forms', 'react/custom-hooks'],
  },
  'react/custom-hooks': {
    title: 'Custom React Hooks: Build Your Own',
    description: 'Learn to write custom hooks in React to share logic between components, with a worked example built from useState and useEffect.',
    related: ['react/useeffect', 'react/useref', 'react/fetch-data', 'react/patterns'],
  },
  'react/router': {
    title: 'React Router Tutorial: Routes and Navigation',
    description: 'Add client-side routing to a React app with React Router: routes, links, URL params, nested routes, redirects and navigating with useNavigate.',
    related: ['react/components', 'react/fetch-data', 'react/context', 'nextjs/file-routing'],
  },
  'react/fetch-data': {
    title: 'Fetching Data in React with useEffect',
    description: 'Fetch API data in React: loading and error states, useEffect with fetch, cleaning up requests and when to use a data-fetching library instead.',
    h1: 'How to Fetch Data in React – Loading, Error and Success States',
    related: ['react/useeffect', 'js/fetch-api', 'react/custom-hooks', 'react/state'],
  },
  'react/context-advanced': {
    title: 'React useReducer and Advanced State Patterns',
    description: 'Manage complex state in React with useReducer, combine it with Context, and learn when to lift state up instead of reaching for a state library.',
    related: ['react/context', 'react/state', 'react/patterns', 'react/performance'],
  },
  'react/patterns': {
    title: 'React Component Patterns You Should Know',
    description: 'Learn the React patterns used in real projects: composition, render props, compound components, controlled inputs and higher-order components.',
    related: ['react/components', 'react/custom-hooks', 'react/context-advanced', 'react/best-practices'],
  },
  'react/best-practices': {
    title: 'React Best Practices for Clean Code',
    description: 'Follow React best practices: project structure, naming, keeping state minimal, avoiding needless effects and writing components that are easy to test.',
    related: ['react/patterns', 'react/performance', 'react/custom-hooks', 'react/state'],
  },
  // ---- CSS ----
  'css/introduction': {
    title: 'CSS Tutorial for Beginners',
    description: 'Learn what CSS is, how it connects to HTML and the three ways to add styles, then write your first rules with examples you can edit and run.',
    h1: 'CSS Tutorial for Beginners – Style Your First Web Page',
    related: ['css/selectors', 'css/box-model', 'css/colors-backgrounds', 'html/introduction'],
  },
  'css/box-model': {
    title: 'CSS Box Model: Margin, Border and Padding',
    description: 'Understand the CSS box model: content, padding, border and margin, box-sizing, and why elements are sometimes wider than you set them.',
    h1: 'The CSS Box Model – Margin, Border, Padding and Content',
    related: ['css/positioning', 'css/flexbox', 'css/selectors', 'css/text-fonts'],
  },
  'css/colors-backgrounds': {
    title: 'CSS Colors and Backgrounds Guide',
    description: 'Style colors and backgrounds in CSS: hex, rgb and hsl values, gradients, background images, sizing and layering, with live examples.',
    related: ['css/text-fonts', 'css/box-model', 'css/animations', 'html/colors'],
  },
  'css/text-fonts': {
    title: 'CSS Text and Fonts: Typography Basics',
    description: 'Control text in CSS: font-family, font-size, weight, line-height, letter-spacing and web fonts, so your pages stay readable on every screen.',
    related: ['css/colors-backgrounds', 'css/box-model', 'css/responsive', 'html/styles'],
  },
  'css/positioning': {
    title: 'CSS Position: static, relative, absolute, fixed',
    description: 'Learn CSS positioning: static, relative, absolute, fixed and sticky, how offsets and z-index work, and when to use each for real layouts.',
    h1: 'CSS Position – Relative, Absolute, Fixed and Sticky',
    related: ['css/box-model', 'css/flexbox', 'css/grid', 'css/responsive'],
  },
  'css/animations': {
    title: 'CSS Transitions and Animations',
    description: 'Add motion with CSS: transitions, transforms, keyframe animations and easing functions, with live examples you can change and run.',
    related: ['css/positioning', 'css/colors-backgrounds', 'css/selectors', 'css/responsive'],
  },
  // ---- HTML ----
  'html/introduction': {
    title: 'HTML Tutorial for Beginners',
    description: 'Learn what HTML is and how a web page is structured, then write your first page using elements, attributes and a proper document layout.',
    h1: 'HTML Tutorial for Beginners – Build Your First Web Page',
    related: ['html/elements', 'html/attributes', 'html/headings-paragraphs', 'css/introduction'],
  },
  'html/elements': {
    title: 'HTML Elements Explained with Examples',
    description: 'Understand HTML elements: opening and closing tags, nesting, block versus inline elements and empty elements, with examples you can edit.',
    related: ['html/attributes', 'html/headings-paragraphs', 'html/semantic', 'html/layout'],
  },
  'html/attributes': {
    title: 'HTML Attributes: id, class, href, src and more',
    description: 'Learn the HTML attributes you use most: id, class, href, src, alt and title, and how they change the way elements look and behave.',
    related: ['html/elements', 'html/classes-id', 'html/links', 'html/images'],
  },
  'html/links': {
    title: 'HTML Links: The Anchor Tag Explained',
    description: 'Create links with the HTML anchor tag: absolute and relative URLs, target and rel, email and phone links, and jumping to sections with anchors.',
    related: ['html/attributes', 'html/images', 'html/head', 'html/semantic'],
  },
  'html/images': {
    title: 'HTML Images: img Tag, alt Text and Sizing',
    description: 'Add images to a web page with the img tag: src, alt text, width and height, responsive images with srcset and picture, and image formats.',
    related: ['html/links', 'html/responsive', 'html/attributes', 'css/responsive'],
  },
  'html/lists': {
    title: 'HTML Lists: Ordered, Unordered and Description',
    description: 'Create ordered, unordered and description lists in HTML, nest them properly and style them, with examples for menus and step-by-step content.',
    related: ['html/tables', 'html/elements', 'html/semantic', 'css/flexbox'],
  },
  'html/tables': {
    title: 'HTML Tables: Rows, Columns and Headers',
    description: 'Build accessible HTML tables with table, tr, th and td, use thead, tbody and colspan correctly, and know when a table is the wrong tool.',
    related: ['html/lists', 'html/layout', 'html/semantic', 'css/selectors'],
  },
  'html/classes-id': {
    title: 'HTML class and id Attributes Explained',
    description: 'Learn the difference between class and id in HTML, how CSS and JavaScript select elements with them, and simple naming rules that scale.',
    related: ['css/selectors', 'html/attributes', 'js/dom', 'html/semantic'],
  },
  'html/head': {
    title: 'HTML Head: Title, Meta Tags and Links',
    description: 'Understand the HTML head element: the title, meta charset and viewport, description tags, favicons and linking stylesheets and scripts.',
    related: ['html/semantic', 'html/links', 'html/responsive', 'nextjs/metadata'],
  },
  'html/layout': {
    title: 'HTML Page Layout: Header, Nav, Main, Footer',
    description: 'Structure a web page layout in HTML with header, nav, main, section, aside and footer, then position the pieces with modern CSS.',
    related: ['html/semantic', 'css/flexbox', 'css/grid', 'html/responsive'],
  },
  'html/responsive': {
    title: 'Responsive HTML: Viewport and Flexible Media',
    description: 'Make HTML pages responsive: the viewport meta tag, flexible images and media, and how HTML and CSS media queries work together on phones.',
    related: ['css/responsive', 'html/images', 'html/layout', 'css/flexbox'],
  },
  // ---- Node.js, Express, MongoDB ----
  'nodejs/introduction': {
    title: 'Node.js Tutorial for Beginners',
    description: 'Learn what Node.js is, how it runs JavaScript outside the browser and how to run your first script, with a clear path to servers and APIs.',
    h1: 'Node.js Tutorial for Beginners – Run JavaScript on the Server',
    related: ['nodejs/modules', 'nodejs/npm-packages', 'nodejs/http-server', 'js/event-loop'],
  },
  'nodejs/modules': {
    title: 'Node.js Modules: require and module.exports',
    description: 'Understand Node.js modules: CommonJS require and module.exports, built-in modules, file modules and how they compare with ES modules.',
    related: ['nodejs/npm-packages', 'nodejs/file-system', 'js/modules', 'nodejs/introduction'],
  },
  'nodejs/npm-packages': {
    title: 'npm and package.json Explained',
    description: 'Use npm to install and manage packages: package.json, dependencies versus devDependencies, package versions, scripts and the lock file.',
    related: ['nodejs/modules', 'nodejs/introduction', 'nodejs/security', 'express/introduction'],
  },
  'nodejs/file-system': {
    title: 'Node.js File System (fs) Tutorial',
    description: 'Read, write, append and delete files in Node.js with the fs module, using both callbacks and promises, and handle missing files properly.',
    related: ['nodejs/path-os', 'nodejs/streams-buffers', 'nodejs/async-await', 'nodejs/modules'],
  },
  'nodejs/http-server': {
    title: 'Create an HTTP Server in Node.js',
    description: 'Build a basic web server with the Node.js http module: handle requests, send responses, read URLs and JSON, then see why frameworks like Express help.',
    related: ['nodejs/express-basics', 'nodejs/routing', 'nodejs/rest-api', 'express/introduction'],
  },
  'nodejs/express-basics': {
    title: 'Express.js Basics in Node.js',
    description: 'Get started with Express in Node.js: install it, create an app, define routes and send responses, and see how it simplifies the http module.',
    related: ['nodejs/routing', 'nodejs/middleware', 'express/introduction', 'nodejs/rest-api'],
  },
  'nodejs/promises': {
    title: 'Node.js Promises Explained',
    description: 'Learn how promises work in Node.js: creating them, then, catch and finally, Promise.all and race, and how to escape callback hell.',
    related: ['nodejs/async-await', 'nodejs/async-callbacks', 'js/async-await', 'js/event-loop'],
  },
  'nodejs/async-await': {
    title: 'Async/Await in Node.js with Examples',
    description: 'Write clean asynchronous Node.js code with async and await: handle errors with try/catch, run tasks in parallel and avoid common mistakes.',
    related: ['nodejs/promises', 'nodejs/file-system', 'js/async-await', 'nodejs/rest-api'],
  },
  'nodejs/streams-buffers': {
    title: 'Node.js Streams and Buffers Explained',
    description: 'Understand Node.js streams and buffers: readable, writable and transform streams, piping large files and why streams save memory.',
    related: ['nodejs/file-system', 'nodejs/http-server', 'nodejs/async-callbacks', 'nodejs/path-os'],
  },
  'nodejs/security': {
    title: 'Node.js Security Best Practices',
    description: 'Secure a Node.js app: validate input, protect against injection and XSS, manage secrets, set security headers and keep dependencies updated.',
    related: ['express/security', 'express/validation', 'express/authentication', 'nodejs/npm-packages'],
  },
  'express/introduction': {
    title: 'Express.js Tutorial for Beginners',
    description: 'Learn what Express.js is and build your first server: install Express, create routes, send JSON and understand how requests flow through an app.',
    h1: 'Express.js Tutorial for Beginners – Build Your First Server',
    related: ['express/routing-basics', 'express/middleware', 'express/request-response', 'express/rest-api'],
  },
  'express/routing-basics': {
    title: 'Express Routing: GET, POST, PUT and DELETE',
    description: 'Learn Express routing: HTTP methods, route parameters and query strings, and how to organise routes as your API grows beyond a few endpoints.',
    h1: 'Express Routing – GET, POST, PUT, DELETE and Route Parameters',
    related: ['express/request-response', 'express/rest-api', 'express/middleware', 'nodejs/routing'],
  },
  'express/request-response': {
    title: 'Express req and res Objects Explained',
    description: 'Read request data and send responses in Express: req.params, req.query, req.body, headers, status codes, res.json and redirects.',
    related: ['express/routing-basics', 'express/validation', 'express/error-handling', 'express/rest-api'],
  },
  'express/rest-api': {
    title: 'Build a REST API with Express.js',
    description: 'Build a REST API with Express: resource routes, CRUD handlers, status codes, JSON bodies and a clean structure you can connect to a database.',
    h1: 'How to Build a REST API with Express.js',
    related: ['express/database', 'express/validation', 'express/error-handling', 'mongodb/mongoose'],
  },
  'express/error-handling': {
    title: 'Error Handling in Express.js',
    description: 'Handle errors in Express with error-handling middleware, async route errors, custom error classes and consistent JSON error responses.',
    related: ['express/middleware', 'express/validation', 'express/rest-api', 'js/error-handling'],
  },
  'express/authentication': {
    title: 'Authentication in Express: Sessions and JWT',
    description: 'Add authentication to an Express app: hash passwords with bcrypt, log users in with JWT or sessions and protect routes with middleware.',
    related: ['express/security', 'express/middleware', 'express/validation', 'nodejs/security'],
  },
  'express/validation': {
    title: 'Input Validation in Express.js',
    description: 'Validate and sanitize request data in Express with express-validator or a schema library, and return clear error messages to the client.',
    related: ['express/request-response', 'express/error-handling', 'express/security', 'express/rest-api'],
  },
  'express/database': {
    title: 'Connect Express.js to a Database',
    description: 'Connect an Express app to a database: connection setup, environment variables, querying from route handlers and a tidy project structure.',
    related: ['mongodb/mongoose', 'express/rest-api', 'express/authentication', 'mongodb/crud-basics'],
  },
  'mongodb/introduction': {
    title: 'MongoDB Tutorial for Beginners',
    description: 'Learn what MongoDB is, how documents and collections differ from SQL tables, and when a document database is a good fit for your project.',
    h1: 'MongoDB Tutorial for Beginners – Documents and Collections',
    related: ['mongodb/installation', 'mongodb/crud-basics', 'mongodb/queries', 'mongodb/mongoose'],
  },
  'mongodb/queries': {
    title: 'MongoDB Query Operators with Examples',
    description: 'Filter MongoDB documents with query operators: $eq, $gt, $in, $and, $or, $regex and sorting, with examples you can copy and run.',
    related: ['mongodb/crud-basics', 'mongodb/arrays-embedded', 'mongodb/indexing', 'mongodb/aggregation'],
  },
  'mongodb/arrays-embedded': {
    title: 'MongoDB Arrays and Embedded Documents',
    description: 'Store and query nested data in MongoDB: embedded documents, arrays, $push, $pull, $elemMatch and dot notation, plus when to embed versus reference.',
    related: ['mongodb/queries', 'mongodb/relationships', 'mongodb/crud-basics', 'mongodb/aggregation'],
  },
  'mongodb/indexing': {
    title: 'MongoDB Indexes: Speed Up Your Queries',
    description: 'Learn how MongoDB indexes work: single, compound and text indexes, reading explain() output and the trade-offs of adding too many indexes.',
    related: ['mongodb/performance', 'mongodb/queries', 'mongodb/aggregation', 'mongodb/crud-basics'],
  },
  'mongodb/aggregation': {
    title: 'MongoDB Aggregation Pipeline Explained',
    description: 'Use the MongoDB aggregation pipeline: $match, $group, $project, $sort, $lookup and $unwind, with step-by-step examples on sample data.',
    related: ['mongodb/queries', 'mongodb/indexing', 'mongodb/relationships', 'mongodb/performance'],
  },
  'mongodb/mongoose': {
    title: 'Mongoose Tutorial: MongoDB with Node.js',
    description: 'Use Mongoose with Node.js and Express: connect to MongoDB, define schemas and models, validate data and run CRUD queries from your API.',
    h1: 'Mongoose Tutorial – Use MongoDB with Node.js and Express',
    related: ['express/database', 'mongodb/crud-basics', 'mongodb/relationships', 'express/rest-api'],
  },
  'mongodb/relationships': {
    title: 'MongoDB Data Relationships: Embed or Reference',
    description: 'Model relationships between documents in MongoDB, compare embedding with references and choose the right approach for your data and queries.',
    related: ['mongodb/arrays-embedded', 'mongodb/aggregation', 'mongodb/mongoose', 'mongodb/performance'],
  },
};
