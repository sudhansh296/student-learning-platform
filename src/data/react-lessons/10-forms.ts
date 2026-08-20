import type { ReactLesson } from '../react-curriculum';

export const reactFormsLesson: ReactLesson = {
  id: 'react-forms',
  title: 'Forms in React',
  slug: 'forms',
  chapter: 'patterns',
  order: 10,
  difficulty: 'intermediate',
  readingTime: 13,
  description: 'Build fully functional forms in React — controlled inputs, handling multiple fields efficiently, form submission, client-side validation, and working with select, textarea, and checkbox elements.',
  sections: [
    {
      type: 'text',
      content: 'Forms are one of the most important parts of any web app — login screens, search bars, contact forms, checkout flows. In React, forms work differently from plain HTML. The recommended approach is "controlled components" — where React state is the single source of truth for every input value.',
    },
    {
      type: 'heading',
      content: '1. Controlled Inputs — React Owns the Value',
    },
    {
      type: 'example',
      title: 'Binding an input to state with value and onChange',
      content: 'A controlled input has its value driven by React state. You pass the state value to the "value" prop and update state in the "onChange" handler. This makes the input\'s current value always available in JavaScript — perfect for validation, formatting, or submitting. Without onChange, React will make the input read-only.',
      language: 'jsx',
      code: `function ControlledInput() {
  const [name, setName] = React.useState('');

  return (
    <div>
      {/* value + onChange = controlled input */}
      <input
        type="text"
        value={name}          // React state drives the displayed value
        onChange={e => setName(e.target.value)}  // update state on change
        placeholder="Enter your name"
      />

      {/* The current value is always available in state */}
      <p>Hello, {name || 'stranger'}!</p>

      {/* Live transformations — force uppercase */}
      <input
        type="text"
        value={name.toUpperCase()}
        onChange={e => setName(e.target.value)}
        placeholder="Will show uppercase..."
      />
    </div>
  );
}`,
    },
    {
      type: 'heading',
      content: '2. Handling Multiple Inputs Efficiently',
    },
    {
      type: 'example',
      title: 'One state object and one handler for all fields',
      content: 'For forms with many fields, storing all values in one object and using one generic handler is cleaner than a useState and handler per field. The trick is using e.target.name to look up which field changed, then spreading the old state and updating only that field.',
      language: 'jsx',
      code: `function RegistrationForm() {
  const [form, setForm] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // One handler for all fields using e.target.name
  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log('Form data:', form);
    alert('Registered: ' + form.firstName + ' ' + form.lastName);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="firstName"           // name must match key in state
        value={form.firstName}
        onChange={handleChange}
        placeholder="First name"
      />
      <input
        name="lastName"
        value={form.lastName}
        onChange={handleChange}
        placeholder="Last name"
      />
      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Register</button>
    </form>
  );
}`,
    },
    {
      type: 'heading',
      content: '3. select, textarea, and checkbox',
    },
    {
      type: 'example',
      title: 'Controlled versions of select, textarea, and checkbox',
      content: 'In React, select uses value and onChange just like a text input — no selected attribute on the option. textarea also uses value rather than putting text between tags. Checkboxes are different — they use checked={boolean} and read e.target.checked (not e.target.value) in the onChange handler.',
      language: 'jsx',
      code: `function SpecialInputs() {
  const [role, setRole] = React.useState('developer');
  const [bio, setBio] = React.useState('');
  const [agree, setAgree] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);

  return (
    <form>
      {/* SELECT — use value on the <select>, not "selected" on option */}
      <label>Role:</label>
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="developer">Developer</option>
        <option value="designer">Designer</option>
        <option value="manager">Manager</option>
        <option value="other">Other</option>
      </select>
      <p>Selected: {role}</p>

      {/* TEXTAREA — value and onChange, not children */}
      <label>Bio:</label>
      <textarea
        value={bio}
        onChange={e => setBio(e.target.value)}
        rows={4}
        placeholder="Tell us about yourself..."
      />
      <p>Characters: {bio.length}</p>

      {/* CHECKBOX — use "checked" and e.target.checked */}
      <label>
        <input
          type="checkbox"
          checked={agree}
          onChange={e => setAgree(e.target.checked)}  // .checked not .value
        />
        I agree to the terms
      </label>

      <label>
        <input
          type="checkbox"
          checked={notifications}
          onChange={e => setNotifications(e.target.checked)}
        />
        Send me notifications
      </label>
    </form>
  );
}`,
    },
    {
      type: 'heading',
      content: '4. Form Validation',
    },
    {
      type: 'example',
      title: 'Client-side validation before submitting',
      content: 'Client-side validation gives instant feedback without a round trip to the server. A common approach is to maintain an errors object in state, validate each field in the submit handler, and display error messages conditionally. You can also validate on change or on blur for even faster feedback.',
      language: 'jsx',
      code: `function ValidatedForm() {
  const [form, setForm] = React.useState({ email: '', password: '' });
  const [errors, setErrors] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);

  function validate(data) {
    const errs = {};
    if (!data.email) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errs.email = 'Email is not valid';
    }
    if (!data.password) {
      errs.password = 'Password is required';
    } else if (data.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear the error for this field as the user types
    setErrors(prev => ({ ...prev, [name]: '' }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
  }

  if (submitted) return <p>✅ Logged in as {form.email}!</p>;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        {errors.email && <p style={{ color: 'red', fontSize: 12 }}>{errors.email}</p>}
      </div>
      <div>
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
        {errors.password && <p style={{ color: 'red', fontSize: 12 }}>{errors.password}</p>}
      </div>
      <button type="submit">Log In</button>
    </form>
  );
}`,
    },
    {
      type: 'heading',
      content: '5. Uncontrolled Inputs with useRef',
    },
    {
      type: 'example',
      title: 'Reading input values on submit without controlling each keystroke',
      content: 'Uncontrolled inputs do not use state — the DOM is the source of truth. You read the value using a ref only when you need it (e.g., on submit). This is simpler for forms you only need to read at submit time. Use React.createRef or useRef and attach it to the element via the ref prop.',
      language: 'jsx',
      code: `function UncontrolledForm() {
  // Refs to read the DOM values on submit
  const nameRef = React.useRef(null);
  const emailRef = React.useRef(null);
  const [result, setResult] = React.useState('');

  function handleSubmit(e) {
    e.preventDefault();
    // Read the value from the ref at submit time
    const name  = nameRef.current.value;
    const email = emailRef.current.value;
    setResult('Hello, ' + name + ' (' + email + ')!');
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* No value or onChange — uncontrolled */}
        <input ref={nameRef}  defaultValue="Alice" placeholder="Name" />
        <input ref={emailRef} type="email" placeholder="Email" />
        <button type="submit">Submit</button>
      </form>
      {result && <p>{result}</p>}
    </div>
  );
}

// When to use uncontrolled:
// - Simple forms where you only need values on submit
// - File inputs (always uncontrolled)
// - Integrating with non-React libraries

// When to use controlled (preferred in most cases):
// - Live validation
// - Dependent fields
// - Formatted inputs (phone, credit card)
// - Disabling submit until valid`,
    },
    {
      type: 'tryit',
      title: 'Try It: Full Registration Form with Validation',
      css: `body { font-family: system-ui, sans-serif; padding: 24px; background: #f0f4ff; }
.form-box { background: white; border-radius: 16px; padding: 28px; max-width: 420px; box-shadow: 0 4px 20px rgba(0,0,0,.08); }
h2 { margin: 0 0 20px; font-size: 20px; color: #111; }
.field { margin-bottom: 14px; }
label { display: block; font-size: 12px; font-weight: 700; color: #374151; margin-bottom: 4px; text-transform: uppercase; letter-spacing: .05em; }
input, select, textarea { width: 100%; padding: 9px 12px; border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; box-sizing: border-box; }
input:focus, select:focus, textarea:focus { border-color: #2563eb; }
input.error, select.error { border-color: #dc2626; }
.error-msg { color: #dc2626; font-size: 12px; margin-top: 3px; }
.submit-btn { width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 700; cursor: pointer; margin-top: 6px; }
.submit-btn:hover { background: #1d4ed8; }
.success { background: #f0fdf4; color: #15803d; border: 1.5px solid #bbf7d0; border-radius: 12px; padding: 20px; text-align: center; }
.success h3 { margin: 0 0 8px; font-size: 18px; }
.tag { display: inline-block; padding: 3px 10px; background: #eff6ff; color: #2563eb; border-radius: 999px; font-size: 12px; font-weight: 700; margin: 2px; }`,
      jsx: `function RegistrationForm() {
  const [form, setForm] = React.useState({
    name: '', email: '', password: '', role: 'developer', agree: false,
  });
  const [errors, setErrors] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  }

  function validate(f) {
    const e = {};
    if (!f.name.trim()) e.name = 'Name is required';
    if (!f.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(f.email)) e.email = 'Invalid email address';
    if (!f.password) e.password = 'Password is required';
    else if (f.password.length < 8) e.password = 'At least 8 characters required';
    if (!f.agree) e.agree = 'You must accept the terms';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="form-box">
        <div className="success">
          <h3>🎉 Welcome aboard!</h3>
          <p>Account created for <strong>{form.name}</strong></p>
          <p>{form.email}</p>
          <span className="tag">{form.role}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="form-box">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label>Full Name</label>
          <input name="name" value={form.name} onChange={handleChange}
            placeholder="Alice Smith" className={errors.name ? 'error' : ''} />
          {errors.name && <p className="error-msg">{errors.name}</p>}
        </div>
        <div className="field">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange}
            placeholder="alice@example.com" className={errors.email ? 'error' : ''} />
          {errors.email && <p className="error-msg">{errors.email}</p>}
        </div>
        <div className="field">
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange}
            placeholder="Min 8 characters" className={errors.password ? 'error' : ''} />
          {errors.password && <p className="error-msg">{errors.password}</p>}
        </div>
        <div className="field">
          <label>Role</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="manager">Manager</option>
            <option value="student">Student</option>
          </select>
        </div>
        <div className="field" style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <input
            type="checkbox" name="agree" checked={form.agree} onChange={handleChange}
            style={{ width: 'auto', marginTop: 2 }} />
          <div>
            <span style={{ fontSize: 13, color: '#374151' }}>I accept the terms and conditions</span>
            {errors.agree && <p className="error-msg">{errors.agree}</p>}
          </div>
        </div>
        <button type="submit" className="submit-btn">Create Account</button>
      </form>
    </div>
  );
}

function App() {
  return <RegistrationForm />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);`,
    },
  ],
  exercises: [
    {
      id: 'form-1',
      question: 'What is the difference between a controlled and uncontrolled input in React?',
      type: 'multiple-choice',
      options: [
        'Controlled inputs use HTML only; uncontrolled use React',
        'Controlled inputs have their value driven by React state via value+onChange; uncontrolled inputs are managed by the DOM',
        'Uncontrolled inputs are faster and always preferred',
        'Controlled inputs cannot be validated',
      ],
      correct: 1,
      explanation: 'A controlled input uses value={state} and onChange to keep React state as the single source of truth. An uncontrolled input lets the DOM hold the value, which you read via a ref when needed. Controlled inputs are preferred because they enable live validation and dependent fields.',
    },
    {
      id: 'form-2',
      question: 'For a checkbox input, which event property gives you the checked state?',
      type: 'multiple-choice',
      options: [
        'e.target.value',
        'e.target.state',
        'e.target.checked',
        'e.target.selected',
      ],
      correct: 2,
      explanation: 'Checkboxes use e.target.checked (a boolean) not e.target.value. In the JSX, use checked={booleanState} instead of value. The pattern is: <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />.',
    },
  ],
  quiz: [
    {
      id: 'rfq1',
      question: 'How do you efficiently handle multiple form inputs with one onChange handler?',
      options: [
        'Create a separate useState for each field',
        'Use e.target.name as the key to update the matching field in one state object',
        'Read all values on submit using document.querySelector',
        'React can only handle one controlled input at a time',
      ],
      correct: 1,
      explanation: 'Give each input a name attribute matching its state key. In a single handler, use const { name, value } = e.target and setForm(prev => ({ ...prev, [name]: value })) to update only the changed field. This scales cleanly to any number of fields.',
    },
  ],
};
