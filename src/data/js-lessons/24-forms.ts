import type { JSLesson } from '../js-curriculum';
export const jsFormsLesson: JSLesson = {
  id:'js-forms',title:'Form Handling',slug:'forms',chapter:'dom',order:25,difficulty:'intermediate',readingTime:10,
  description:'Handle HTML forms with JavaScript — read values, validate, submit with Fetch, FormData, and real-world patterns.',
  sections:[
    {type:'text',content:'Forms are how users send data to your application. JavaScript makes forms dynamic — real-time validation, AJAX submission (no page reload), and rich user feedback. Every web app needs solid form handling.'},
    {type:'heading',content:'Reading Form Values'},
    {type:'example',title:'Getting values from inputs',content:'Each input type has its own way to read the value. Text, email, and password inputs use .value. Checkboxes use .checked (true/false). Radio buttons need a CSS selector to find the checked one. The cleanest way to read an entire form is new FormData(form) — it automatically collects all named inputs into a key-value structure that you convert to a plain object with Object.fromEntries().',language:'javascript',code:`const form = document.querySelector('#myForm');

// Individual input values
const name  = document.querySelector('#name').value;
const email = document.querySelector('#email').value;
const age   = parseInt(document.querySelector('#age').value, 10);

// Checkbox
const agree = document.querySelector('#agree').checked; // true/false

// Radio buttons — find the checked one
const gender = document.querySelector('input[name="gender"]:checked')?.value;

// Select dropdown
const country = document.querySelector('#country').value;

// Multiple select
const langs = [...document.querySelectorAll('#langs option:checked')].map(o => o.value);

// Textarea
const bio = document.querySelector('#bio').value.trim();

// FormData — easiest way to get ALL form values
const formData = new FormData(form);
const values = Object.fromEntries(formData.entries());
// { name:"Alex", email:"alex@example.com", ... }

// Log all fields
for (const [key, value] of formData) {
  console.log(key, value);
}`},
    {type:'heading',content:'Form Validation'},
    {type:'example',title:'Validate before submitting',content:'Always validate on the client side before sending data to the server — it gives instant feedback without a round trip. Build a validateForm() function that returns an errors object where each key is the field name and each value is the error message. An empty errors object means valid. Use this pattern to display inline error messages next to each field and add/remove CSS classes.',language:'javascript',code:`function validateForm(data) {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!data.password || data.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  if (data.age && (data.age < 13 || data.age > 120)) {
    errors.age = "Age must be between 13 and 120";
  }

  return errors; // empty object = valid
}

// Display errors
function showErrors(errors) {
  // Clear previous errors
  document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');

  for (const [field, message] of Object.entries(errors)) {
    const errorEl = document.querySelector(\`#\${field}-error\`);
    if (errorEl) errorEl.textContent = message;
    document.querySelector(\`#\${field}\`)?.classList.add('is-invalid');
  }
}`},
    {type:'heading',content:'Submit with Fetch (AJAX)'},
    {type:'example',title:'No page reload — modern form submission',content:'The standard modern pattern: listen for the submit event, call e.preventDefault() to stop the page reload, validate the data, then send it with fetch(). Disable the submit button while the request is in flight to prevent double submissions. Always re-enable it in finally so it recovers from both success and error. Show the user a clear success or error message.',language:'javascript',code:`document.querySelector('#registerForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // stop default page reload

  const form = e.target;
  const submitBtn = form.querySelector('[type="submit"]');
  const data = Object.fromEntries(new FormData(form).entries());

  // Validate
  const errors = validateForm(data);
  if (Object.keys(errors).length > 0) {
    showErrors(errors);
    return;
  }

  // Submit
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Registration failed');
    }

    const result = await response.json();
    showSuccess('Account created! Redirecting...');
    setTimeout(() => window.location.href = '/dashboard', 2000);

  } catch (error) {
    showError(error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Create Account';
  }
});`},
    {type:'tryit',title:'Try It: Form Validation',
     html:`<div id="app">
  <h2>Registration Form</h2>
  <form id="regForm" novalidate>
    <div class="field">
      <label for="name">Full Name *</label>
      <input id="name" type="text" placeholder="Alex Smith"/>
      <span class="error" id="name-err"></span>
    </div>
    <div class="field">
      <label for="email">Email *</label>
      <input id="email" type="email" placeholder="alex@example.com"/>
      <span class="error" id="email-err"></span>
    </div>
    <div class="field">
      <label for="pass">Password *</label>
      <input id="pass" type="password" placeholder="Min 8 characters"/>
      <span class="error" id="pass-err"></span>
    </div>
    <div class="field">
      <label for="confirm">Confirm Password *</label>
      <input id="confirm" type="password" placeholder="Same password"/>
      <span class="error" id="confirm-err"></span>
    </div>
    <div class="field">
      <label><input type="checkbox" id="terms"/> I agree to terms</label>
      <span class="error" id="terms-err"></span>
    </div>
    <button type="submit">Create Account</button>
    <p id="success" style="color:#16a34a;font-weight:700;display:none">✅ Account created!</p>
  </form>
</div>`,
     css:`#app{font-family:system-ui,sans-serif;padding:20px;max-width:400px;}
h2{color:#1e1e1e;margin-bottom:16px;}
.field{margin-bottom:14px;}
label{display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:5px;}
input[type=text],input[type=email],input[type=password]{width:100%;padding:10px 12px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;outline:none;box-sizing:border-box;transition:border-color .15s;}
input:focus{border-color:#2563eb;}
input.invalid{border-color:#ef4444;}
input.valid{border-color:#22c55e;}
.error{display:block;font-size:12px;color:#ef4444;margin-top:3px;min-height:16px;}
button{width:100%;padding:12px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-size:15px;font-weight:700;}
button:disabled{background:#94a3b8;cursor:not-allowed;}`,
     js:`const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const pass = document.getElementById('pass').value;
  const confirm = document.getElementById('confirm').value;
  const terms = document.getElementById('terms').checked;
  const errors = {};

  if (name.length < 2) errors.name = 'Name must be at least 2 characters';
  if (!emailRe.test(email)) errors.email = 'Enter a valid email address';
  if (pass.length < 8) errors.pass = 'Password must be at least 8 characters';
  if (pass !== confirm) errors.confirm = 'Passwords do not match';
  if (!terms) errors.terms = 'You must agree to terms';

  ['name','email','pass','confirm','terms'].forEach(f => {
    const el = document.getElementById(f);
    const errEl = document.getElementById(f+'-err');
    if (errEl) errEl.textContent = errors[f] || '';
    if (el && el.type !== 'checkbox') {
      el.classList.toggle('invalid', !!errors[f]);
      el.classList.toggle('valid', !errors[f] && el.value);
    }
  });

  return Object.keys(errors).length === 0;
}

// Real-time validation
['name','email','pass','confirm'].forEach(id => {
  document.getElementById(id).addEventListener('input', validate);
});

document.getElementById('regForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validate()) return;
  const btn = e.target.querySelector('button');
  btn.disabled = true; btn.textContent = 'Creating account...';
  await new Promise(r => setTimeout(r, 1200)); // simulate API call
  document.getElementById('success').style.display = 'block';
  btn.textContent = '✅ Done!';
});`,mode:'full'},
  ],
  exercises:[{id:'fm1',question:'What does e.preventDefault() do on a form submit event?',type:'multiple-choice',options:['Stops all JavaScript','Prevents the browser from reloading the page and submitting the form traditionally','Clears the form','Validates the form'],correct:1,explanation:'By default, submitting a form causes a full page reload. e.preventDefault() stops this so you can handle submission with JavaScript (Fetch, validation, etc.) without a page reload.'}],
  quiz:[{id:'fq1',question:'What is the cleanest way to read ALL form values at once?',options:['Loop through all inputs manually','Object.fromEntries(new FormData(form).entries())','document.querySelectorAll("input")','JSON.parse(form.value)'],correct:1,explanation:'new FormData(form) automatically collects all named form fields. Object.fromEntries() converts it to a plain object. This one line replaces reading every input individually.'}],
};
