import type { TsLesson } from '../ts-curriculum';

export const tsUtilityTypesLesson: TsLesson = {
  id: 'ts-utility-types',
  title: 'Utility Types',
  slug: 'utility-types',
  chapter: 'advanced',
  order: 10,
  difficulty: 'intermediate',
  readingTime: 10,
  description: 'Built-in TypeScript utility types - Partial, Required, Readonly, Pick, Omit, Record, Exclude, Extract, ReturnType.',
  sections: [
    {
      type: 'text',
      content: 'TypeScript ships with a library of built-in utility types that transform existing types into new ones. Instead of duplicating type definitions, you derive new types from existing ones. This keeps your types DRY and ensures that when the source type changes, all derived types automatically update.',
    },
    {
      type: 'heading',
      content: 'Partial and Required',
    },
    {
      type: 'example',
      title: 'Partial<T> and Required<T> - flip all properties',
      content: 'Partial<T> makes every property of T optional. This is perfect for update functions where you only need to provide the fields that changed. Required<T> is the opposite - it makes every property required, removing all question marks.',
      language: 'typescript',
      code: `interface User {
  id: number;
  name: string;
  email: string;
  bio?: string;       // optional
  avatar?: string;    // optional
}

// Partial<User> - all properties become optional
function updateUser(id: number, updates: Partial<User>): void {
  // Only provide the fields you want to change
  console.log("Updating user", id, "with:", updates);
}

updateUser(1, { name: "Alice Updated" });           // OK
updateUser(1, { email: "new@example.com", bio: "Dev" }); // OK
// updateUser(1, { unknownField: "x" });             // Error!

// Required<User> - all properties become required
type FullUser = Required<User>;
// bio and avatar are now required - cannot be omitted

// Real-world pattern: create + update types
type CreateUserInput = Omit<User, "id">;           // id is set by server
type UpdateUserInput = Partial<Omit<User, "id">>; // all optional updates

const newUser: CreateUserInput = {
  name: "Bob",
  email: "bob@example.com",
};`,
    },
    {
      type: 'heading',
      content: 'Readonly',
    },
    {
      type: 'example',
      title: 'Readonly<T> - immutable version of any type',
      content: 'Readonly<T> makes every property of T readonly. Once the object is created, no property can be reassigned. This is shallowly immutable - nested objects can still be mutated. Use it for configuration objects, constants, and anywhere you want to prevent accidental modification.',
      language: 'typescript',
      code: `interface Config {
  host: string;
  port: number;
  debug: boolean;
}

const config: Readonly<Config> = {
  host: "localhost",
  port: 3000,
  debug: false,
};

// config.port = 8080; // Error: Cannot assign to 'port' because it is a read-only property

// Readonly is shallow - only top-level properties are locked
interface DeepConfig {
  server: { host: string; port: number };
}

const deep: Readonly<DeepConfig> = {
  server: { host: "localhost", port: 3000 },
};
// deep.server = { host: "other", port: 8080 }; // Error - server is readonly
deep.server.port = 8080; // OK - shallow readonly, nested is still mutable

// Use for function parameters to prevent mutation
function processConfig(cfg: Readonly<Config>): string {
  // cfg.debug = true; // Error - prevented by readonly
  return cfg.host + ":" + cfg.port;
}`,
    },
    {
      type: 'heading',
      content: 'Pick and Omit',
    },
    {
      type: 'example',
      title: 'Pick<T, K> and Omit<T, K> - select or exclude properties',
      content: 'Pick<T, K> creates a new type with only the properties K from T. Omit<T, K> creates a new type with all properties except K. These are essential for creating public-facing types from internal ones - you can strip out passwords, internal IDs, or implementation details.',
      language: 'typescript',
      code: `interface InternalUser {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  internalNotes: string;
  createdAt: Date;
}

// Pick - only include these specific properties
type PublicUser = Pick<InternalUser, "id" | "name" | "email">;
// { id: number; name: string; email: string }

// Omit - include everything EXCEPT these properties
type SafeUser = Omit<InternalUser, "passwordHash" | "internalNotes">;
// { id: number; name: string; email: string; createdAt: Date }

function getPublicProfile(user: InternalUser): PublicUser {
  return { id: user.id, name: user.name, email: user.email };
}

// Great for form types
interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  publishedAt: Date;
  updatedAt: Date;
}

// Form only needs title and content
type CreatePostForm = Pick<Post, "title" | "content">;
type UpdatePostForm = Partial<Pick<Post, "title" | "content">>;`,
    },
    {
      type: 'heading',
      content: 'Record',
    },
    {
      type: 'example',
      title: 'Record<K, V> - typed dictionaries and lookup tables',
      content: 'Record<Keys, Values> creates an object type where all keys are of type Keys and all values are of type Values. It is cleaner than writing "{ [key: string]: number }" and more powerful when Keys is a union type, ensuring you handle every key.',
      language: 'typescript',
      code: `// Basic record - string keys, number values
const wordCount: Record<string, number> = {};
wordCount["hello"] = 5;
wordCount["world"] = 3;

// Record with literal keys - TypeScript enforces all keys exist
type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

const schedule: Record<DayOfWeek, string[]> = {
  mon: ["Meeting", "Code review"],
  tue: ["Sprint planning"],
  wed: ["1-on-1", "Deployment"],
  thu: ["Code review"],
  fri: ["Release"],
  sat: [],
  sun: [],
  // TypeScript requires ALL days to be present!
};

// HTTP status code lookup
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const methodColors: Record<HttpMethod, string> = {
  GET:    "#22c55e",
  POST:   "#3b82f6",
  PUT:    "#f59e0b",
  PATCH:  "#8b5cf6",
  DELETE: "#ef4444",
};`,
    },
    {
      type: 'example',
      title: 'ReturnType, Parameters, and Extract/Exclude',
      content: 'TypeScript provides utility types that extract information from other types. ReturnType<T> gets the return type of a function. Parameters<T> gets the parameter types as a tuple. Exclude<T, U> removes types from a union. Extract<T, U> keeps only the types that match.',
      language: 'typescript',
      code: `// ReturnType - extract return type of a function
function getUser() {
  return { id: 1, name: "Alice", email: "a@b.com" };
}
type UserType = ReturnType<typeof getUser>;
// { id: number; name: string; email: string }

// Parameters - extract parameter types as a tuple
function createPost(title: string, content: string, authorId: number): void {}
type PostParams = Parameters<typeof createPost>;
// [string, string, number]

// Exclude - remove types from a union
type AllRoles = "admin" | "editor" | "viewer" | "guest";
type AuthorizedRoles = Exclude<AllRoles, "guest">;
// "admin" | "editor" | "viewer"

// Extract - keep only matching types
type StringOrNumber = string | number | boolean | null;
type Primitives = Extract<StringOrNumber, string | number>;
// string | number

// NonNullable - removes null and undefined
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;
// string`,
    },
    {
      type: 'tryit',
      title: 'Try It: Utility Types in Practice',
      css: `body{font-family:system-ui,sans-serif;padding:20px;} .card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin-bottom:10px;} .title{font-weight:700;color:#1e40af;font-size:13px;margin-bottom:6px;} .prop{font-size:12px;color:#374151;padding:2px 0;} .prop span{font-weight:600;color:#1e40af;}`,
      js: `// Utility types demonstrated in JavaScript

// Simulating Partial<T> - update with only some fields
function updateUser(existing, updates) {
  return { ...existing, ...updates };
}

// Simulating Pick<T, K>
function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {});
}

// Simulating Omit<T, K>
function omit(obj, keys) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !keys.includes(k))
  );
}

const user = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  passwordHash: 'abc123hash',
  internalNotes: 'VIP customer',
  createdAt: '2024-01-15',
};

const publicUser = pick(user, ['id', 'name', 'email']);
const safeUser = omit(user, ['passwordHash', 'internalNotes']);
const updated = updateUser(user, { name: 'Alice Updated', email: 'new@example.com' });

console.log('Original keys:', Object.keys(user).join(', '));
console.log('Pick result:', JSON.stringify(publicUser));
console.log('Omit result keys:', Object.keys(safeUser).join(', '));
console.log('After update:', updated.name, '-', updated.email);

document.getElementById('output').innerHTML =
  '<div class="card"><div class="title">Pick(user, [id, name, email])</div>' +
  Object.entries(publicUser).map(([k, v]) => '<div class="prop"><span>' + k + ':</span> ' + v + '</div>').join('') +
  '</div><div class="card"><div class="title">Omit(user, [passwordHash, internalNotes])</div>' +
  Object.entries(safeUser).map(([k, v]) => '<div class="prop"><span>' + k + ':</span> ' + v + '</div>').join('') +
  '</div>';`,
    },
  ],
  exercises: [
    {
      id: 'ts-util-1',
      question: 'What does Partial<User> do when User has required properties?',
      type: 'multiple-choice',
      options: [
        'Removes all properties from User',
        'Makes all properties of User optional',
        'Makes all properties of User readonly',
        'Keeps only the optional properties from User',
      ],
      correct: 1,
      explanation: 'Partial<T> takes every property in T and makes it optional (adds "?" to each one). The resulting type has all the same properties but none of them are required. This is perfect for update/patch operations where you only want to provide the changed fields.',
    },
    {
      id: 'ts-util-2',
      question: 'What is the difference between Pick<T, K> and Omit<T, K>?',
      type: 'multiple-choice',
      options: [
        'Pick includes only the listed properties; Omit excludes only the listed properties',
        'Pick is for arrays; Omit is for objects',
        'Pick makes properties optional; Omit makes them required',
        'They are identical with different syntax',
      ],
      correct: 0,
      explanation: 'Pick<T, K> creates a new type containing ONLY the properties K from T. Omit<T, K> creates a new type with ALL properties from T EXCEPT those in K. They are complementary - use Pick when the inclusion list is small, Omit when the exclusion list is small.',
    },
  ],
  quiz: [
    {
      id: 'ts-util-q1',
      question: 'When would you use ReturnType<typeof myFunction>?',
      options: [
        'To call the function and return its result',
        'To extract the type of what the function returns, without calling it',
        'To check if the function has a return statement',
        'To convert the function to an async function',
      ],
      correct: 1,
      explanation: 'ReturnType<typeof myFunction> extracts the TypeScript type of the functions return value - at compile time, without calling the function. This is useful when the return type is complex or inferred, and you want to use that type elsewhere without duplicating the type definition.',
    },
  ],
};
