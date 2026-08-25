import type { TsLesson } from '../ts-curriculum';

export const tsDecoratorsLesson: TsLesson = {
  id: 'ts-decorators',
  title: 'Decorators',
  slug: 'decorators',
  chapter: 'advanced',
  order: 16,
  difficulty: 'advanced',
  readingTime: 14,
  description: 'Learn TypeScript decorators - the metadata annotation system used by Angular, NestJS, TypeORM, and class-validator.',
  sections: [
    {
      type: 'text',
      content: 'Decorators are a stage-3 JavaScript proposal that TypeScript has supported for years via the experimentalDecorators flag. They are functions that receive a class, method, property, or parameter and can read or modify its behavior. Frameworks like Angular, NestJS, TypeORM, and class-validator are built almost entirely around decorators.',
    },
    {
      type: 'note',
      content: 'To enable decorators, add "experimentalDecorators": true and "emitDecoratorMetadata": true to your tsconfig.json compilerOptions. Without these flags the TypeScript compiler will reject decorator syntax.',
    },
    {
      type: 'heading',
      content: 'Class Decorators',
    },
    {
      type: 'example',
      title: 'Class decorator that adds metadata',
      content: 'A class decorator is a function that receives the class constructor as its only argument. It runs once when the class is defined - not each time the class is instantiated - making it the right place to attach metadata or wrap the constructor with additional logic.',
      language: 'typescript',
      code: `// Enable in tsconfig: "experimentalDecorators": true

// A simple class decorator that stamps metadata onto the constructor
function Sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
  console.log(\`Class \${constructor.name} is now sealed\`);
}

// A decorator factory that accepts arguments
function Component(options: { selector: string; template: string }) {
  return function (constructor: Function) {
    // Attach metadata to the class (Angular-style)
    (constructor as any).__selector = options.selector;
    (constructor as any).__template = options.template;
    console.log(\`Registered component: \${options.selector}\`);
  };
}

@Sealed
class UserService {
  findAll() { return []; }
}

@Component({ selector: 'app-root', template: '<h1>Hello</h1>' })
class AppComponent {
  title = 'my-app';
}

console.log((AppComponent as any).__selector); // 'app-root'`,
    },
    {
      type: 'heading',
      content: 'Method Decorators',
    },
    {
      type: 'example',
      title: 'Method decorator that logs execution time',
      content: 'A method decorator receives the class prototype, the method name, and the property descriptor. By replacing descriptor.value with a wrapper function, you intercept every call to that method - allowing you to log timing, add authorization checks, catch errors, or retry on failure without touching the original logic.',
      language: 'typescript',
      code: `function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args: any[]) {
    const start = performance.now();
    console.log(\`Calling \${propertyKey} with:\`, args);

    const result = originalMethod.apply(this, args);

    const end = performance.now();
    console.log(\`\${propertyKey} completed in \${(end - start).toFixed(2)}ms\`);
    return result;
  };

  return descriptor;
}

function Authorize(role: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const currentRole = (this as any).role;
      if (currentRole !== role) {
        throw new Error(\`Unauthorized: requires \${role} role\`);
      }
      return original.apply(this, args);
    };
  };
}

class OrderService {
  role = 'admin';

  @Log
  @Authorize('admin')
  deleteOrder(id: number) {
    return \`Order \${id} deleted\`;
  }
}

const svc = new OrderService();
console.log(svc.deleteOrder(42));`,
    },
    {
      type: 'heading',
      content: 'Property Decorators',
    },
    {
      type: 'example',
      title: 'Property decorator for validation metadata',
      content: 'Property decorators receive the class prototype and the property name. They cannot directly intercept reads and writes - instead, the standard pattern is to store validation rules or metadata in a side map keyed by the class and property name. A separate validation function then reads that metadata at runtime, which is exactly how class-validator works.',
      language: 'typescript',
      code: `// Simple metadata store (reflect-metadata does this automatically)
const validationRules = new Map<string, { property: string; rule: string; message: string }[]>();

function IsEmail(target: any, propertyKey: string) {
  const className = target.constructor.name;
  const rules = validationRules.get(className) ?? [];
  rules.push({ property: propertyKey, rule: 'email', message: 'Must be a valid email' });
  validationRules.set(className, rules);
}

function IsNotEmpty(target: any, propertyKey: string) {
  const className = target.constructor.name;
  const rules = validationRules.get(className) ?? [];
  rules.push({ property: propertyKey, rule: 'notEmpty', message: 'Must not be empty' });
  validationRules.set(className, rules);
}

class CreateUserDto {
  @IsNotEmpty
  name: string = '';

  @IsEmail
  @IsNotEmpty
  email: string = '';
}

function validate(instance: object): string[] {
  const className = instance.constructor.name;
  const rules = validationRules.get(className) ?? [];
  const errors: string[] = [];

  rules.forEach(({ property, rule, message }) => {
    const value = (instance as any)[property];
    if (rule === 'notEmpty' && !value) errors.push(\`\${property}: \${message}\`);
    if (rule === 'email' && value && !value.includes('@')) errors.push(\`\${property}: \${message}\`);
  });

  return errors;
}

const dto = new CreateUserDto();
dto.name = '';
dto.email = 'not-an-email';

console.log(validate(dto));
// ['name: Must not be empty', 'email: Must not be empty', 'email: Must be a valid email']`,
    },
    {
      type: 'heading',
      content: 'Decorator Factories',
    },
    {
      type: 'example',
      title: 'Decorator factory with parameters',
      content: 'A plain decorator function has a fixed signature - it cannot accept configuration. A decorator factory solves this by being a function that returns a decorator. The outer function captures your configuration in a closure, and the inner function is the actual decorator. This is the pattern behind @Column({ type: "varchar", length: 255 }) in TypeORM or @Get("/users") in NestJS.',
      language: 'typescript',
      code: `// Without factory - no way to pass arguments
function ReadOnly(target: any, key: string) {
  Object.defineProperty(target, key, { writable: false });
}

// With factory - accepts configuration
function MinLength(min: number) {
  return function (target: any, propertyKey: string) {
    const className = target.constructor.name;
    console.log(\`\${className}.\${propertyKey} must be at least \${min} characters\`);
  };
}

function Column(options: { type: string; length?: number; nullable?: boolean }) {
  return function (target: any, propertyKey: string) {
    const meta = \`\${options.type}\${options.length ? '(' + options.length + ')' : ''}\${options.nullable ? ' NULL' : ' NOT NULL'}\`;
    console.log(\`Column: \${propertyKey} -> \${meta}\`);
  };
}

function Entity(tableName?: string) {
  return function (constructor: Function) {
    (constructor as any).__tableName = tableName ?? constructor.name.toLowerCase();
    console.log(\`Entity mapped to table: \${(constructor as any).__tableName}\`);
  };
}

// TypeORM-style usage
@Entity('users')
class User {
  @Column({ type: 'varchar', length: 100 })
  @MinLength(2)
  name: string = '';

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string = '';

  @Column({ type: 'int', nullable: true })
  age: number | null = null;
}

console.log((User as any).__tableName); // 'users'`,
    },
    {
      type: 'heading',
      content: 'Decorator Composition',
    },
    {
      type: 'text',
      content: 'Multiple decorators can be stacked on a single target. The evaluation order is top-to-bottom (outer to inner), but the execution order is bottom-to-top (inner to outer) - the same as mathematical function composition. For method decorators: @A @B method means A(B(method)). Understanding this order matters when decorators depend on each other.',
    },
    {
      type: 'example',
      title: 'Stacking multiple decorators',
      content: 'When multiple decorators are applied to a method, they form a pipeline where each decorator wraps the previous. The innermost decorator runs first, so @Log @Validate means the validation wrapper runs before the logging wrapper sees the call.',
      language: 'typescript',
      code: `function Validate(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    if (args.some(a => a === null || a === undefined)) {
      throw new Error('Arguments cannot be null or undefined');
    }
    console.log('Validation passed');
    return original.apply(this, args);
  };
}

function Memoize(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  const cache = new Map<string, any>();
  descriptor.value = function (...args: any[]) {
    const cacheKey = JSON.stringify(args);
    if (cache.has(cacheKey)) {
      console.log('Cache hit for', cacheKey);
      return cache.get(cacheKey);
    }
    const result = original.apply(this, args);
    cache.set(cacheKey, result);
    return result;
  };
}

class MathService {
  // Decorators apply bottom-to-top: Validate runs first, then Memoize caches the validated result
  @Memoize
  @Validate
  fibonacci(n: number): number {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}

const math = new MathService();
console.log(math.fibonacci(10)); // 55 (computed)
console.log(math.fibonacci(10)); // 55 (cache hit)`,
    },
    {
      type: 'heading',
      content: 'Real-World Framework Decorators',
    },
    {
      type: 'table',
      title: 'Common Decorators in Popular Frameworks',
      headers: ['Framework', 'Decorator', 'Purpose'],
      rows: [
        ['NestJS', '@Controller("/users")', 'Marks class as a route controller with base path'],
        ['NestJS', '@Get(":id") / @Post()', 'Maps HTTP methods to handler methods'],
        ['NestJS', '@Injectable()', 'Marks class as a dependency injection provider'],
        ['NestJS', '@Body() / @Param()', 'Extracts data from request body or URL params'],
        ['Angular', '@Component({ selector, template })', 'Declares a UI component with metadata'],
        ['Angular', '@Input() / @Output()', 'Declares component input/output properties'],
        ['Angular', '@NgModule({ declarations, imports })', 'Defines an Angular module'],
        ['TypeORM', '@Entity("table_name")', 'Maps class to a database table'],
        ['TypeORM', '@Column({ type: "varchar" })', 'Maps property to a table column'],
        ['TypeORM', '@PrimaryGeneratedColumn()', 'Auto-increment primary key column'],
        ['class-validator', '@IsEmail()', 'Validates that the value is a valid email'],
        ['class-validator', '@IsNotEmpty()', 'Validates that the value is not empty'],
        ['class-validator', '@MinLength(n) / @MaxLength(n)', 'Validates string length constraints'],
      ],
    },
    {
      type: 'tryit',
      title: 'Try It: Decorator Explorer',
      css: `
        body { font-family: system-ui, sans-serif; margin: 0; padding: 16px; background: #0f172a; color: #e2e8f0; }
        h2 { color: #7dd3fc; font-size: 16px; margin: 0 0 12px; }
        .tabs { display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap; }
        .tab { padding: 7px 14px; border-radius: 6px; border: 1px solid #334155; background: #1e293b; color: #94a3b8; cursor: pointer; font-size: 13px; transition: all 0.15s; }
        .tab.active { background: #1d4ed8; border-color: #3b82f6; color: #fff; }
        .panel { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 14px; margin-bottom: 10px; }
        .panel-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 6px; }
        .panel-title { font-size: 14px; font-weight: 600; color: #f1f5f9; margin-bottom: 4px; }
        pre { background: #0f172a; border: 1px solid #1e293b; border-radius: 6px; padding: 10px; font-size: 12px; overflow-x: auto; color: #e2e8f0; margin: 6px 0; white-space: pre; }
        .kw { color: #c084fc; } .fn { color: #60a5fa; } .str { color: #86efac; } .cm { color: #64748b; }
        .framework-badge { display: inline-block; background: #0f172a; border: 1px solid #334155; border-radius: 4px; padding: 3px 8px; font-size: 11px; color: #7dd3fc; margin-bottom: 6px; }
        .js-output { background: #042f2e; border: 1px solid #134e4a; border-radius: 6px; padding: 10px; font-size: 12px; font-family: monospace; color: #6ee7b7; margin: 6px 0; white-space: pre; }
      `,
      js: `// TypeScript Decorators - console demo

// Simulating @log method decorator
function applyLog(obj, methodName) {
  var original = obj[methodName];
  obj[methodName] = function() {
    var args = Array.prototype.slice.call(arguments);
    console.log('[log] Calling ' + methodName + '(' + args.join(', ') + ')');
    var result = original.apply(this, args);
    console.log('[log] ' + methodName + ' returned: ' + JSON.stringify(result));
    return result;
  };
}

// Class with methods
function UserService() {
  this.users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ];
}
UserService.prototype.findById = function(id) {
  return this.users.find(function(u) { return u.id === id; }) || null;
};
UserService.prototype.getAll = function() {
  return this.users;
};

// Apply @log decorator
var svc = new UserService();
applyLog(svc, 'findById');
applyLog(svc, 'getAll');

console.log('=== @log Decorator Simulation ===');
svc.findById(1);
svc.findById(99);

console.log('\\n=== @readonly Decorator ===');
console.log('Prevents property reassignment at compile time:');
console.log('  config.apiUrl = "evil.com" -> TS Error: readonly property');

console.log('\\n=== Decorator Factories (with args) ===');
console.log('@MinLength(3) applied to username');
console.log('@MinLength(8) applied to password');
console.log('@Column({ type: "varchar", length: 100 }) applied to name');
console.log('@Column({ type: "varchar", length: 255 }) applied to email');

console.log('\\n=== Framework Decorators ===');
var frameworkDecorators = [
  'NestJS:   @Controller("/users") -- marks class as route controller',
  'NestJS:   @Get(":id") / @Post() -- maps HTTP methods to handlers',
  'NestJS:   @Injectable() -- marks class as DI provider',
  'Angular:  @Component({ selector, template }) -- declares UI component',
  'TypeORM:  @Entity("users") -- maps class to database table',
  'TypeORM:  @Column({ type: "varchar" }) -- maps property to column',
  'class-validator: @IsEmail() -- validates email format',
];
frameworkDecorators.forEach(function(d) { console.log('  ' + d); });
      `,
    },
  ],
  exercises: [
    {
      id: 'ts-dec-1',
      question: 'Which tsconfig.json option must be set to true before TypeScript will accept the @ decorator syntax?',
      type: 'multiple-choice',
      options: [
        '"useDecorators": true',
        '"experimentalDecorators": true',
        '"enableDecorators": true',
        '"allowDecorators": true',
      ],
      correct: 1,
      explanation: '"experimentalDecorators": true enables the legacy decorator syntax (stage 2 proposal). Without it, TypeScript throws a compile error when it encounters @. You typically also add "emitDecoratorMetadata": true so TypeScript emits reflection metadata needed by frameworks like NestJS.',
    },
    {
      id: 'ts-dec-2',
      question: 'When multiple decorators are stacked on a single method - @A on top and @B below - in what order do they execute?',
      type: 'multiple-choice',
      options: [
        'A executes first, then B',
        'B executes first, then A',
        'Both execute simultaneously',
        'Only the top decorator executes',
      ],
      correct: 1,
      explanation: 'Decorators are evaluated top-to-bottom but execute bottom-to-top - the same as mathematical function composition where @A @B method means A(B(method)). B wraps the original method first, then A wraps the result of B. This means @B runs first when the method is called.',
    },
    {
      id: 'ts-dec-3',
      question: 'What is the purpose of a decorator factory compared to a plain decorator?',
      type: 'multiple-choice',
      options: [
        'Decorator factories run faster than plain decorators',
        'Decorator factories allow you to pass configuration arguments to the decorator',
        'Decorator factories can only be used on classes, not methods',
        'Decorator factories bypass the need for experimentalDecorators',
      ],
      correct: 1,
      explanation: 'A plain decorator has a fixed signature and cannot accept parameters. A decorator factory is a function that accepts your configuration and returns the actual decorator function. This pattern enables @Column({ type: "varchar", length: 255 }) style usage - the outer call captures options in a closure and the returned function does the actual decoration.',
    },
  ],
  quiz: [
    {
      id: 'ts-dec-q1',
      question: 'Which type of decorator receives the property descriptor as its third argument?',
      options: [
        'Class decorator',
        'Property decorator',
        'Method decorator',
        'Parameter decorator',
      ],
      correct: 2,
      explanation: 'Method decorators receive three arguments: the class prototype (or the constructor for static methods), the method name as a string, and the PropertyDescriptor for the method. The descriptor gives access to the original function via descriptor.value, allowing the decorator to wrap or replace it.',
    },
    {
      id: 'ts-dec-q2',
      question: 'In NestJS, what does the @Injectable() decorator primarily do?',
      options: [
        'It makes the class available in the global scope',
        'It marks the class as a provider that can be injected into other classes via the NestJS dependency injection system',
        'It compiles the class to a singleton automatically',
        'It enables async methods inside the class',
      ],
      correct: 1,
      explanation: '@Injectable() tells the NestJS dependency injection container that this class is a provider - it can be injected into controllers, other services, or any injectable. Under the hood, NestJS reads the reflect-metadata emitted by TypeScript to discover constructor parameter types and resolve the dependency graph.',
    },
    {
      id: 'ts-dec-q3',
      question: 'What argument does a class decorator receive?',
      options: [
        'An instance of the class',
        'The class constructor function',
        'The class prototype and the class name',
        'The property descriptor of the class',
      ],
      correct: 1,
      explanation: 'A class decorator receives exactly one argument: the constructor function of the decorated class. This means you can use it to seal the class, attach static metadata, wrap the constructor to intercept instantiation, or return a new class that extends the original.',
    },
  ],
};
