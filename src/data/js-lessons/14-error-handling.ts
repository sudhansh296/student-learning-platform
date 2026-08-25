import type { JSLesson } from '../js-curriculum';

export const jsErrorHandlingLesson: JSLesson = {
  id:'js-error-handling',title:'Error Handling',slug:'error-handling',
  chapter:'advanced',order:15,difficulty:'intermediate',readingTime:10,
  description:'Handle errors professionally with try/catch/finally, custom errors, error types, and defensive programming.',
  sections:[
    {type:'text',content:'Errors are inevitable in any program. Professional JavaScript handles errors gracefully - not crashing, giving users useful messages, and making debugging easy. Unhandled errors break your app; properly handled errors make it resilient.'},
    {type:'heading',content:'Types of Errors'},
    {type:'example',title:'Built-in error types',content:'JavaScript has several built-in error types, each for a different kind of mistake. TypeError happens when you use the wrong type - like calling a method on null. ReferenceError happens when you use a variable that does not exist. SyntaxError is caught before the code even runs. Every error object has a name, message, and stack trace - the stack shows exactly which function calls led to the error.',language:'javascript',code:`// SyntaxError - invalid JavaScript syntax (caught at parse time)
// eval("let let = 5"); // SyntaxError

// ReferenceError - using undeclared variable
// console.log(undeclaredVar); // ReferenceError

// TypeError - wrong type operation
// null.toString(); // TypeError: Cannot read properties of null
// (5)();           // TypeError: 5 is not a function

// RangeError - value out of valid range
// new Array(-1);   // RangeError: Invalid array length
// (1.5).toFixed(200); // RangeError

// URIError
// decodeURIComponent("%"); // URIError

// Every error has:
const err = new TypeError("Something went wrong");
console.log(err.name);    // "TypeError"
console.log(err.message); // "Something went wrong"
console.log(err.stack);   // Stack trace`},
    {type:'heading',content:'try / catch / finally'},
    {type:'example',title:'Basic error handling',content:'The try block contains code that might fail. If any line in try throws an error, execution immediately jumps to catch - skipping the rest of try. The catch block receives the error object so you can read its message and name. finally always runs at the end, whether there was an error or not - perfect for cleanup like hiding a loading spinner.',language:'javascript',code:`// try - code that might throw
// catch - runs if error is thrown
// finally - always runs (cleanup)

function divide(a, b) {
  try {
    if (b === 0) throw new Error("Cannot divide by zero");
    if (typeof a !== "number" || typeof b !== "number") {
      throw new TypeError("Both arguments must be numbers");
    }
    return a / b;
  } catch (error) {
    console.error(\`[\${error.name}] \${error.message}\`);
    return null;
  } finally {
    console.log("divide() completed"); // always runs
  }
}

console.log(divide(10, 2));   // 5
console.log(divide(10, 0));   // null (caught error)
console.log(divide("a", 2));  // null (caught TypeError)

// Catching specific error types
try {
  JSON.parse("invalid json {{{");
} catch (error) {
  if (error instanceof SyntaxError) {
    console.log("Invalid JSON:", error.message);
  } else {
    throw error; // re-throw unexpected errors
  }
}`},
    {type:'heading',content:'Custom Errors'},
    {type:'example',title:'Creating custom error classes',content:'Custom error classes make debugging much easier. Instead of a generic Error saying "something went wrong", a ValidationError can tell you exactly which field failed and why. A NotFoundError can carry a status code (404) so your API handler knows what HTTP response to send. Create a custom error by extending the built-in Error class and adding extra properties.',language:'javascript',code:`// Custom errors make debugging much easier
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

class NotFoundError extends Error {
  constructor(resource, id) {
    super(\`\${resource} with id \${id} not found\`);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

class AuthError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "AuthError";
    this.statusCode = 401;
  }
}

// Using custom errors
function validateUser(data) {
  if (!data.name || data.name.trim() === "") {
    throw new ValidationError("name", "Name is required");
  }
  if (!data.email || !data.email.includes("@")) {
    throw new ValidationError("email", "Invalid email format");
  }
  if (data.age < 0 || data.age > 150) {
    throw new ValidationError("age", "Age must be between 0 and 150");
  }
}

try {
  validateUser({ name: "", email: "invalid", age: 25 });
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(\`Validation failed for field "\${error.field}": \${error.message}\`);
  } else {
    throw error;
  }
}`},
    {type:'heading',content:'Error Handling in Async Code'},
    {type:'example',title:'Async error handling patterns',content:'In async functions, try/catch works identically to synchronous code - just wrap your await calls. The tryCatch() helper is a Go-language style pattern that turns errors into return values instead of exceptions. Instead of try/catch blocks everywhere, you get [data, err] back and check if err exists. This makes async error handling very clean in complex functions that call multiple APIs.',language:'javascript',code:`// try/catch with async/await
async function fetchUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) {
      throw new NotFoundError("User", id);
    }
    return await res.json();
  } catch (error) {
    if (error instanceof NotFoundError) {
      console.warn(error.message);
      return null;
    }
    if (error.name === "TypeError") {
      console.error("Network error - are you offline?");
      return null;
    }
    throw error; // unexpected error - let it bubble up
  }
}

// Helper: wrap async to avoid repetitive try/catch
async function tryCatch(promise) {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

// Usage - Go-style error handling
const [user, err] = await tryCatch(fetchUser(1));
if (err) {
  console.error("Failed to load user:", err.message);
} else {
  console.log("Loaded:", user.name);
}

// Global error handlers
window.addEventListener("error", (event) => {
  console.error("Uncaught error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled Promise rejection:", event.reason);
  event.preventDefault(); // prevent default console error
});`},
    {type:'tryit',title:'Try It: Error Handling',
     html:`<div id="app">
  <h2>Error Handling Demo</h2>
  <div class="section">
    <h3>Form Validation</h3>
    <input id="nameInput" placeholder="Name (required)"/>
    <input id="emailInput" placeholder="Email (must contain @)"/>
    <input id="ageInput" type="number" placeholder="Age (18-100)"/>
    <button onclick="submitForm()">Submit</button>
    <div id="formResult"></div>
  </div>
  <div class="section">
    <h3>Parse JSON</h3>
    <textarea id="jsonInput" rows="3">{ "name": "Alex", "age": 25 }</textarea>
    <button onclick="parseJSON()">Parse JSON</button>
    <div id="jsonResult"></div>
  </div>
</div>`,
     css:`#app{font-family:system-ui,sans-serif;padding:20px;max-width:460px;}
h2{color:#1e1e1e;margin-bottom:16px;}h3{font-size:14px;color:#374151;margin:0 0 10px;}
.section{background:white;border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:14px;}
input,textarea{display:block;width:100%;padding:9px 12px;border:1.5px solid #e5e7eb;border-radius:8px;font-size:14px;outline:none;margin-bottom:8px;box-sizing:border-box;}
input:focus,textarea:focus{border-color:#2563eb;}
button{padding:9px 18px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:14px;margin-top:2px;}
.ok{background:#f0fdf4;border:1px solid #86efac;color:#166534;padding:10px 12px;border-radius:8px;font-size:13px;margin-top:8px;}
.err{background:#fef2f2;border:1px solid #fca5a5;color:#dc2626;padding:10px 12px;border-radius:8px;font-size:13px;margin-top:8px;}`,
     js:`class ValidationError extends Error {
  constructor(field, msg) { super(msg); this.name='ValidationError'; this.field=field; }
}

function validateForm(data) {
  if (!data.name.trim()) throw new ValidationError('name','Name is required');
  if (!data.email.includes('@')) throw new ValidationError('email','Invalid email format');
  const age = parseInt(data.age);
  if (!data.age || isNaN(age) || age < 18 || age > 100) throw new ValidationError('age','Age must be between 18 and 100');
}

function submitForm() {
  const data = {
    name: document.getElementById('nameInput').value,
    email: document.getElementById('emailInput').value,
    age: document.getElementById('ageInput').value,
  };
  const el = document.getElementById('formResult');
  try {
    validateForm(data);
    el.className = 'ok';
    el.textContent = '✅ Form is valid! { name: "'+data.name+'", email: "'+data.email+'", age: '+data.age+' }';
  } catch(e) {
    el.className = 'err';
    el.textContent = '❌ ['+e.name+'] Field "'+e.field+'": '+e.message;
  }
}

function parseJSON() {
  const el = document.getElementById('jsonResult');
  try {
    const parsed = JSON.parse(document.getElementById('jsonInput').value);
    el.className = 'ok';
    el.textContent = '✅ Valid JSON:\ ' + JSON.stringify(parsed, null, 2);
  } catch(e) {
    el.className = 'err';
    el.textContent = '❌ [SyntaxError] '+e.message;
  }
}`,mode:'full'},
  ],
  exercises:[{id:'err-1',question:'What is the purpose of the finally block?',type:'multiple-choice',options:['It runs only if no error occurs','It runs only if an error occurs','It always runs after try and catch, regardless of outcome','It catches errors from async functions'],correct:2,explanation:'finally always executes whether the try block succeeded or the catch block ran. Use it for cleanup tasks like closing connections, hiding loading spinners, or releasing resources.'}],
  quiz:[{id:'qerr1',question:'Why should you create custom error classes?',options:['To make code longer','To add useful context (error type, field name, status code) and enable isinstance checks','For performance','Custom errors are not a good practice'],correct:1,explanation:'Custom error classes (extending Error) let you add context like field names, status codes, or resource names. They also enable instanceof checks to handle different error types differently, making error handling more precise and user-friendly.'}],
};
