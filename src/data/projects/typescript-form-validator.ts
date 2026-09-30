import type { Project } from './types';

const validatorTs = `// ================================================================
// A type-safe form validation library
// ================================================================

/** A single rule: checks a value of type T and reports a message if it fails. */
interface ValidationRule<T> {
  check: (value: T) => boolean;
  message: string;
}

/**
 * The result of validating one value, modeled as a discriminated union.
 * TypeScript will not let you read .value without first checking valid === true,
 * and will not let you read .errors without checking valid === false.
 */
type ValidationResult<T> =
  | { valid: true; value: T }
  | { valid: false; errors: string[] };

/** A type guard: narrows a ValidationResult to its success case for the rest of the block. */
function isValid<T>(result: ValidationResult<T>): result is { valid: true; value: T } {
  return result.valid;
}

/** Runs every rule against a value, collecting every failing rule's message. */
function validate<T>(value: T, rules: ValidationRule<T>[]): ValidationResult<T> {
  const errors = rules.filter((rule) => !rule.check(value)).map((rule) => rule.message);
  if (errors.length > 0) return { valid: false, errors };
  return { valid: true, value };
}

// ---------------------------------------------------------------
// Reusable, generic rule builders
// ---------------------------------------------------------------

function required(message = 'This field is required'): ValidationRule<string> {
  return { check: (v) => v.trim().length > 0, message };
}

function minLength(min: number, message?: string): ValidationRule<string> {
  return { check: (v) => v.length >= min, message: message ?? \`Must be at least \${min} characters\` };
}

function isEmail(message = 'Must be a valid email address'): ValidationRule<string> {
  const pattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return { check: (v) => pattern.test(v), message };
}

function inRange(min: number, max: number, message?: string): ValidationRule<number> {
  return { check: (v) => v >= min && v <= max, message: message ?? \`Must be between \${min} and \${max}\` };
}

// ---------------------------------------------------------------
// Validating a whole object against a schema
// ---------------------------------------------------------------

/** A mapped type: for every key of T, a list of rules for that field's own type. */
type Schema<T> = { [K in keyof T]: ValidationRule<T[K]>[] };

type ObjectValidationResult<T> =
  | { valid: true; value: T }
  | { valid: false; errors: Partial<Record<keyof T, string[]>> };

function validateObject<T extends Record<string, unknown>>(
  obj: T,
  schema: Schema<T>
): ObjectValidationResult<T> {
  const errors: Partial<Record<keyof T, string[]>> = {};
  let hasErrors = false;

  for (const key in schema) {
    const rules = schema[key];
    const result = validate(obj[key], rules);
    if (!isValid(result)) {
      errors[key] = result.errors;
      hasErrors = true;
    }
  }

  return hasErrors ? { valid: false, errors } : { valid: true, value: obj };
}

// ================================================================
// Example usage
// ================================================================

interface SignupForm {
  username: string;
  email: string;
  age: number;
}

const signupSchema: Schema<SignupForm> = {
  username: [required(), minLength(3)],
  email: [required(), isEmail()],
  age: [inRange(13, 120, 'Age must be between 13 and 120')],
};

const goodSubmission: SignupForm = { username: 'ada', email: 'ada@example.com', age: 36 };
const badSubmission: SignupForm = { username: 'x', email: 'not-an-email', age: 8 };

const goodResult = validateObject(goodSubmission, signupSchema);
const badResult = validateObject(badSubmission, signupSchema);

console.log('Valid form:', JSON.stringify(goodResult));
console.log('Invalid form:', JSON.stringify(badResult));

// Because TypeScript knows the shape of ObjectValidationResult, this kind of
// mistake is caught at compile time, before the code ever runs:
//
//   if (badResult.valid) {
//     console.log(badResult.errors); // Error: Property 'errors' does not exist
//                                     // on type '{ valid: true; value: SignupForm }'
//   }
`;

export const typescriptFormValidatorProject: Project = {
  id: 'typescript-form-validator',
  slug: 'typescript-form-validator',
  title: 'Type-Safe Form Validator',
  difficulty: 'intermediate',
  type: 'backend',
  estimatedTime: '5-8 hours',
  playgroundKey: 'typescript-form-validator',
  description: 'Build a genuinely type-safe validation library in TypeScript — generics, discriminated unions, type guards, and mapped types working together so invalid states are unrepresentable and caught at compile time, not just at runtime.',
  overview: 'This project is a small, real TypeScript library, not a JavaScript app with type annotations sprinkled on top. A generic ValidationRule<T> and validate<T>() work for any type. A discriminated union ValidationResult<T> makes it a compile-time error to read .value without first checking valid === true. A mapped type, Schema<T>, derives a whole object\'s validation schema directly from that object\'s own interface, so the schema and the data can never drift out of sync.',
  objective: 'Build a type-safe validation library covering a generic validation rule and function, a discriminated union result type with a proper type guard, reusable rule builders (required, minLength, isEmail, inRange), and a mapped-type Schema<T> that validates a whole typed object at once.',
  technologies: ['TypeScript', 'JavaScript'],
  prerequisites: ['JavaScript fundamentals', 'Basic TypeScript (interfaces, basic types)', 'Some familiarity with generics is helpful but not required'],
  learnings: [
    'Writing a generic function and interface that work correctly for any type, not just one hardcoded type',
    'Modeling a result as a discriminated union so an invalid state (reading .value when validation failed) is a compile-time error, not a runtime bug',
    'Writing a custom type guard (a function returning "x is Y") that narrows a union type for the rest of a code block',
    'Using a mapped type ([K in keyof T]) to derive one type from another, keeping a schema and its data type permanently in sync',
    'Using utility types (Partial, Record, keyof) to build precise types instead of widening everything to any',
    'Why real TypeScript projects are more than JavaScript with type annotations — the type system itself can prevent whole categories of bugs before the code ever runs',
  ],
  features: [
    'A fully generic ValidationRule<T> and validate<T>() that works for strings, numbers, or any other type',
    'A discriminated union ValidationResult<T> with a real type guard (isValid) narrowing it correctly',
    'Four reusable, composable rule builders: required, minLength, isEmail, inRange',
    'A mapped type Schema<T> that derives a full validation schema from any interface automatically',
    'validateObject<T>() validating an entire typed object in one call, returning per-field error lists',
    'A worked example (a signup form) showing both a valid and an invalid submission',
    'Comments showing the exact compile-time error TypeScript prevents by design',
  ],
  fileStructure: 'typescript-form-validator/ |   validator.ts',
  files: [
    { path: 'typescript-form-validator/validator.ts', language: 'typescript', content: validatorTs },
  ],
  lessons: [
    {
      id: 'generic-rule',
      title: 'A Generic Validation Rule and Function',
      explanation: 'A generic type parameter <T> lets one interface and one function work correctly for strings, numbers, or any future type, without duplicating the code — and without losing type safety by falling back to any.',
      js: `interface ValidationRule<T> {
  check: (value: T) => boolean;
  message: string;
}

function validate<T>(value: T, rules: ValidationRule<T>[]): ValidationResult<T> {
  const errors = rules.filter((rule) => !rule.check(value)).map((rule) => rule.message);
  if (errors.length > 0) return { valid: false, errors };
  return { valid: true, value };
}

// The same validate() function works for completely different types,
// each fully type-checked:
validate<string>('ada', [required()]);
validate<number>(36, [inRange(0, 120)]);`,
    },
    {
      id: 'discriminated-union',
      title: 'A Discriminated Union Prevents an Entire Class of Bugs',
      explanation: 'ValidationResult<T> is either { valid: true; value: T } or { valid: false; errors: string[] } — never both, never neither. TypeScript uses the literal valid: true / valid: false tag to know exactly which shape you have after a check, and refuses to compile code that reads a field that is not there.',
      js: `type ValidationResult<T> =
  | { valid: true; value: T }
  | { valid: false; errors: string[] };

function handle(result: ValidationResult<string>) {
  if (result.valid) {
    console.log(result.value);   // OK -- TypeScript knows .value exists here
    // console.log(result.errors); // Compile error: no .errors on this branch
  } else {
    console.log(result.errors);  // OK -- TypeScript knows .errors exists here
    // console.log(result.value);  // Compile error: no .value on this branch
  }
}`,
    },
    {
      id: 'type-guard',
      title: 'Writing a Custom Type Guard',
      explanation: 'A function whose return type is "x is Y" tells TypeScript that, whenever it returns true, the checked value can safely be treated as type Y for the rest of that code block — exactly what isValid() does for a ValidationResult.',
      js: `function isValid<T>(result: ValidationResult<T>): result is { valid: true; value: T } {
  return result.valid;
}

function useResult<T>(result: ValidationResult<T>) {
  if (isValid(result)) {
    // TypeScript now knows result.value exists, purely from the type guard
    console.log(result.value);
  }
}`,
    },
    {
      id: 'mapped-type-schema',
      title: 'Deriving a Schema Type with a Mapped Type',
      explanation: 'Schema<T> = { [K in keyof T]: ValidationRule<T[K]>[] } walks every key of an existing interface T and builds a new type from it automatically. If SignupForm ever gains or loses a field, Schema<SignupForm> updates itself — there is no separate schema type to keep in sync by hand.',
      js: `interface SignupForm {
  username: string;
  email: string;
  age: number;
}

// Schema<SignupForm> is automatically:
// {
//   username: ValidationRule<string>[];
//   email: ValidationRule<string>[];
//   age: ValidationRule<number>[];
// }
type Schema<T> = { [K in keyof T]: ValidationRule<T[K]>[] };

const signupSchema: Schema<SignupForm> = {
  username: [required(), minLength(3)],
  email: [required(), isEmail()],
  age: [inRange(13, 120)],
  // Missing a field here, or adding one SignupForm doesn't have,
  // is a compile-time error -- not something you discover at runtime.
};`,
    },
  ],
  challenges: [
    {
      id: 'add-matches-rule',
      title: 'Add a "matches another field" rule (e.g. confirm password)',
      difficulty: 'easy',
      description: 'Add a rule builder, matchesField, that takes the value of another field and validates that the current field equals it — useful for a "confirm password" input.',
      hint: 'matchesField(otherValue: string, message?: string) should return a ValidationRule<string> whose check compares the value being validated to otherValue.',
      solutionJs: `function matchesField(otherValue: string, message = 'Fields do not match'): ValidationRule<string> {
  return { check: (v) => v === otherValue, message };
}

// Usage:
const passwordSchema = {
  password: [required(), minLength(8)],
  confirmPassword: [required(), matchesField(formValues.password, 'Passwords must match')],
};`,
    },
    {
      id: 'add-optional-fields',
      title: 'Support optional fields in Schema<T>',
      difficulty: 'medium',
      description: 'Extend Schema<T> and validateObject<T> to correctly handle fields typed as optional (like age?: number in the interface) — an optional field with no rules, or with a value of undefined, should not cause a false failure.',
      hint: 'Use T[K] extends undefined ? ... in a conditional type, or simply check `if (obj[key] === undefined) continue;` inside the validateObject loop before running that field\'s rules.',
      solutionJs: `function validateObject<T extends Record<string, unknown>>(
  obj: T,
  schema: Partial<Schema<T>>   // every field's rule list becomes optional
): ObjectValidationResult<T> {
  const errors: Partial<Record<keyof T, string[]>> = {};
  let hasErrors = false;

  for (const key in schema) {
    const rules = schema[key];
    if (!rules || obj[key] === undefined) continue; // skip unset optional fields

    const result = validate(obj[key], rules);
    if (!isValid(result)) {
      errors[key] = result.errors;
      hasErrors = true;
    }
  }

  return hasErrors ? { valid: false, errors } : { valid: true, value: obj };
}`,
    },
    {
      id: 'add-async-rule',
      title: 'Support an async validation rule (e.g. checking a username is not taken)',
      difficulty: 'hard',
      description: 'Add support for an async rule (like checking a username against a server) alongside the existing synchronous ones, with a validateAsync<T>() that awaits every rule and still returns a properly typed ValidationResult<T>.',
      hint: 'Define AsyncValidationRule<T> with check: (value: T) => Promise<boolean>, then write validateAsync<T>(value, rules) using Promise.all to run every check, filtering rules whose resolved result is false.',
      solutionJs: `interface AsyncValidationRule<T> {
  check: (value: T) => Promise<boolean>;
  message: string;
}

async function validateAsync<T>(
  value: T,
  rules: AsyncValidationRule<T>[]
): Promise<ValidationResult<T>> {
  const results = await Promise.all(
    rules.map(async (rule) => ({ rule, passed: await rule.check(value) }))
  );
  const errors = results.filter((r) => !r.passed).map((r) => r.rule.message);

  if (errors.length > 0) return { valid: false, errors };
  return { valid: true, value };
}

function usernameIsAvailable(): AsyncValidationRule<string> {
  return {
    check: async (username) => {
      const res = await fetch(\`/api/check-username?u=\${encodeURIComponent(username)}\`);
      const data = await res.json();
      return data.available;
    },
    message: 'That username is already taken',
  };
}`,
    },
  ],
};
