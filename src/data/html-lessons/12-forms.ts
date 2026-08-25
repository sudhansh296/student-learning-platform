import type { HtmlLesson } from '../html-curriculum';

export const htmlFormsLesson: HtmlLesson = {
  id: 'html-forms',
  title: 'HTML Forms',
  slug: 'forms',
  chapter: 'forms',
  order: 12,
  difficulty: 'beginner',
  readingTime: 14,
  description: 'Build interactive forms with input types, labels, validation, buttons, select, textarea, and accessibility best practices.',
  sections: [
    { type: 'text', content: 'Forms are how users send data to a website. Login pages, search bars, contact forms, checkout pages - all use HTML forms. The <form> element groups related inputs. When the user submits, the data is sent to a server (or handled by JavaScript).' },
    { type: 'heading', content: 'The <form> Element' },
    { type: 'code', language: 'html',       content: 'The form element contains all inputs. action is the URL where data is sent. method POST sends data in the request body. method GET appends data to the URL. Every input needs a name attribute so the server can identify the submitted value.',
      code: `<form action="/submit" method="POST">
  <!-- action: where to send the data (URL) -->
  <!-- method: how to send it - GET (URL) or POST (body) -->

  <!-- Inputs go here -->

  <button type="submit">Submit</button>
</form>

<!-- method="GET"  - data appears in the URL (for search forms) -->
<!-- method="POST" - data sent in request body (for sensitive data like passwords) -->` },
    { type: 'heading', content: 'The <label> and <input> Elements' },
    { type: 'code', language: 'html',       content: 'The label element links text to an input. The for attribute must match the input id. Clicking the label focuses the input. Screen readers read the label when the input is focused. Never use placeholder as the only label - it disappears when the user starts typing.',
      code: `<!-- Always connect label to input with for + id -->
<label for="username">Username:</label>
<input type="text" id="username" name="username" placeholder="Enter username">

<!-- Clicking the label focuses the input - great for accessibility -->
<!-- Screen readers read the label when the input is focused -->` },
    { type: 'heading', content: 'Input Types' },
    { type: 'code', language: 'html',       content: 'HTML5 added many input types that improve UX. type=email validates email format. type=number shows a numeric keyboard on mobile. type=date shows a date picker. type=password hides characters. type=checkbox creates tick-boxes. The browser handles basic validation automatically.',
      code: `<!-- text - single line text -->
<input type="text" placeholder="Your name">

<!-- email - validates email format -->
<input type="email" placeholder="your@email.com">

<!-- password - hides characters -->
<input type="password" placeholder="••••••••">

<!-- number - only numbers -->
<input type="number" min="0" max="100" step="5">

<!-- tel - phone number (mobile keyboard) -->
<input type="tel" placeholder="+1 (234) 567-890">

<!-- url - validates URL format -->
<input type="url" placeholder="https://example.com">

<!-- date - date picker -->
<input type="date">

<!-- time -->
<input type="time">

<!-- color - color picker -->
<input type="color" value="#2563eb">

<!-- range - slider -->
<input type="range" min="0" max="100" value="50">

<!-- checkbox -->
<input type="checkbox" id="agree" name="agree">
<label for="agree">I agree to the terms</label>

<!-- radio buttons (group them with same name) -->
<input type="radio" id="html"  name="skill" value="html">  <label for="html">HTML</label>
<input type="radio" id="css"   name="skill" value="css">   <label for="css">CSS</label>
<input type="radio" id="js"    name="skill" value="js">    <label for="js">JavaScript</label>

<!-- file upload -->
<input type="file" accept="image/*">

<!-- hidden - not visible but sent with form -->
<input type="hidden" name="user_id" value="12345">

<!-- search -->
<input type="search" placeholder="Search...">` },
    { type: 'heading', content: 'Textarea, Select, and Datalist' },
    { type: 'code', language: 'html',       content: 'The textarea element creates a multi-line text input - used for messages, descriptions, and comments. rows and cols set the initial size. resize: none in CSS prevents users from resizing it. Unlike input, textarea has both opening and closing tags and the default content goes between them.',
code: `<!-- Textarea - multi-line text -->
<label for="message">Message:</label>
<textarea id="message" name="message" rows="5" cols="40"
  placeholder="Write your message here..."></textarea>

<!-- Select - dropdown menu -->
<label for="country">Country:</label>
<select id="country" name="country">
  <option value="">-- Select --</option>
  <option value="us">United States</option>
  <option value="uk">United Kingdom</option>
  <option value="in">India</option>
  <option value="ca">Canada</option>
</select>

<!-- Option groups in select -->
<select name="technology">
  <optgroup label="Frontend">
    <option value="html">HTML</option>
    <option value="css">CSS</option>
    <option value="js">JavaScript</option>
  </optgroup>
  <optgroup label="Backend">
    <option value="nodejs">Node.js</option>
    <option value="express">Express</option>
  </optgroup>
</select>

<!-- Datalist - text input + autocomplete suggestions -->
<label for="browser">Browser:</label>
<input list="browsers" id="browser" name="browser">
<datalist id="browsers">
  <option value="Chrome">
  <option value="Firefox">
  <option value="Safari">
  <option value="Edge">
</datalist>` },
    { type: 'heading', content: 'Form Validation Attributes' },
    { type: 'code', language: 'html',       content: 'HTML5 built-in validation works without JavaScript. required makes a field mandatory. minlength and maxlength limit text length. min and max limit number ranges. pattern accepts a regex for custom formats. Add novalidate to the form for full JavaScript control.',
      code: `<!-- required - field must be filled -->
<input type="text" name="name" required>

<!-- minlength / maxlength - character limits -->
<input type="text" name="username" minlength="3" maxlength="20">

<!-- min / max for numbers and dates -->
<input type="number" name="age" min="18" max="120">
<input type="date" name="birthday" min="1924-01-01" max="2026-12-31">

<!-- pattern - regex validation -->
<input type="text" name="phone" pattern="[0-9]{10}"
  title="Enter a 10-digit phone number">

<!-- These are all built-in browser validation - no JavaScript needed! -->` },
    { type: 'heading', content: 'Fieldset and Legend' },
    { type: 'code', language: 'html',       content: 'fieldset draws a visible border around a group of related inputs. legend is the label for that group, displayed in the border. This is the accessible way to group radio buttons, checkboxes, or related form sections - screen readers announce the group name before each input inside.',
      code: `<!-- fieldset groups related inputs; legend is its title -->
<form>
  <fieldset>
    <legend>Personal Information</legend>
    <label for="fname">First name: <input type="text" id="fname" name="fname"></label>
    <label for="lname">Last name:  <input type="text" id="lname" name="lname"></label>
  </fieldset>

  <fieldset>
    <legend>Account Details</legend>
    <label for="email2">Email:    <input type="email" id="email2" name="email"></label>
    <label for="pass">Password: <input type="password" id="pass" name="password"></label>
  </fieldset>

  <button type="submit">Create Account</button>
</form>` },
    { type: 'tryit', title: 'Try It: Complete Contact Form',
      html: `<div class="form-wrapper">
  <h1>Contact Us</h1>
  <p>Fill in the form below and we'll get back to you within 24 hours.</p>

  <form id="contactForm">
    <div class="form-group">
      <label for="name">Full Name *</label>
      <input type="text" id="name" name="name" placeholder="Alex Smith" required>
    </div>

    <div class="form-group">
      <label for="email">Email Address *</label>
      <input type="email" id="email" name="email" placeholder="alex@example.com" required>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="phone">Phone</label>
        <input type="tel" id="phone" name="phone" placeholder="+1 234 567 890">
      </div>
      <div class="form-group">
        <label for="subject">Subject</label>
        <select id="subject" name="subject">
          <option value="">Select topic</option>
          <option value="html">HTML Question</option>
          <option value="css">CSS Question</option>
          <option value="js">JavaScript</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>

    <div class="form-group">
      <label for="message">Message *</label>
      <textarea id="message" name="message" rows="4"
        placeholder="How can we help you?" required></textarea>
    </div>

    <div class="form-check">
      <input type="checkbox" id="newsletter" name="newsletter">
      <label for="newsletter">Subscribe to our newsletter</label>
    </div>

    <button type="submit">Send Message →</button>
  </form>
</div>`,
      css: `* { box-sizing: border-box; }
body { font-family: system-ui, sans-serif; background: #f9fafb; display: flex; justify-content: center; padding: 30px 16px; }
.form-wrapper { background: white; border: 1px solid #e5e7eb; border-radius: 16px; padding: 32px; width: 100%; max-width: 480px; }
h1 { font-size: 22px; color: #1e1e1e; margin: 0 0 6px; }
p { font-size: 14px; color: #6b7280; margin: 0 0 24px; }
.form-group { margin-bottom: 16px; }
.form-row { display: flex; gap: 12px; }
.form-row .form-group { flex: 1; }
label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 5px; }
input, select, textarea { width: 100%; padding: 10px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 14px; color: #1e1e1e; outline: none; font-family: inherit; transition: border-color .15s; }
input:focus, select:focus, textarea:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.1); }
textarea { resize: vertical; }
.form-check { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
.form-check input { width: auto; }
.form-check label { margin: 0; font-weight: 400; color: #6b7280; font-size: 14px; }
button { width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; }
button:hover { background: #1d4ed8; }`,
      mode: 'html' },
  ],
  exercises: [
    { id: 'frm1', question: 'Which input type should you use for passwords?', type: 'multiple-choice', options: ['type="text"', 'type="hidden"', 'type="password"', 'type="secret"'], correct: 2, explanation: 'type="password" hides the characters as the user types (shows dots or asterisks). It also prevents the browser from showing the value in page source.' },
    { id: 'frm2', question: 'Which attribute makes a form field required before submission?', type: 'multiple-choice', options: ['mandatory', 'required', 'validate="true"', 'must-fill'], correct: 1, explanation: 'The required attribute (no value needed) tells the browser to block form submission if this field is empty. Built-in browser validation - no JavaScript needed.' },
  ],
  quiz: [
    { id: 'fq1', question: 'Why should you always connect <label> to <input> with for and id?', options: ['For decoration only', 'Clicking the label focuses the input, and screen readers read the label', 'It makes the form submit faster', 'It is required by HTML5'], correct: 1, explanation: 'Connecting label to input via for="inputId" improves usability (clicking label focuses input) and accessibility (screen readers announce the label when the input is focused).' },
  ],
};
