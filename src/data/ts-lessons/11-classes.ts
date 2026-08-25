import type { TsLesson } from '../ts-curriculum';

export const tsClassesLesson: TsLesson = {
  id: 'ts-classes',
  title: 'Classes in TypeScript',
  slug: 'classes',
  chapter: 'advanced',
  order: 11,
  difficulty: 'intermediate',
  readingTime: 10,
  description: 'TypeScript classes with typed properties, access modifiers (public/private/protected), readonly, abstract classes, and implementing interfaces.',
  sections: [
    {
      type: 'text',
      content: 'TypeScript extends JavaScript classes with a full type system - property types, access modifiers, abstract methods, and interface implementation. These features make object-oriented patterns significantly safer and more expressive than in plain JavaScript.',
    },
    {
      type: 'heading',
      content: 'Typed Classes',
    },
    {
      type: 'example',
      title: 'Class properties with type annotations',
      content: 'TypeScript classes require you to declare properties before using them in the constructor or methods. You annotate the type next to the property name at the class level. TypeScript checks that every property is initialized in the constructor.',
      language: 'typescript',
      code: `class Person {
  name: string;
  age: number;
  email: string;

  constructor(name: string, age: number, email: string) {
    this.name = name;
    this.age = age;
    this.email = email;
  }

  greet(): string {
    return "Hi, I am " + this.name + " and I am " + this.age + " years old.";
  }

  birthday(): void {
    this.age++;
    console.log("Happy birthday " + this.name + "! Now " + this.age);
  }
}

const alice = new Person("Alice", 25, "alice@example.com");
console.log(alice.greet());

// TypeScript checks property access
// alice.phone = "555-1234"; // Error: Property 'phone' does not exist`,
    },
    {
      type: 'heading',
      content: 'Access Modifiers',
    },
    {
      type: 'example',
      title: 'public, private, and protected - controlling access',
      content: 'TypeScript adds access modifiers to control visibility. "public" (default) is accessible from anywhere. "private" is only accessible inside the class itself. "protected" is accessible in the class and its subclasses, but not from outside. These are compile-time checks - they do not exist in the JavaScript output.',
      language: 'typescript',
      code: `class BankAccount {
  public owner: string;         // accessible from anywhere
  private balance: number;      // only inside BankAccount
  protected accountId: string;  // inside BankAccount and subclasses

  constructor(owner: string, initialBalance: number) {
    this.owner = owner;
    this.balance = initialBalance;
    this.accountId = "ACC-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  }

  public deposit(amount: number): void {
    if (amount <= 0) throw new Error("Amount must be positive");
    this.balance += amount;
    console.log("Deposited " + amount + ". New balance: " + this.balance);
  }

  public withdraw(amount: number): void {
    if (amount > this.balance) throw new Error("Insufficient funds");
    this.balance -= amount;
  }

  public getBalance(): number {
    return this.balance; // controlled read access
  }
}

const account = new BankAccount("Alice", 1000);
account.deposit(500);
console.log(account.getBalance()); // 1500
// account.balance = 99999;         // Error: 'balance' is private`,
    },
    {
      type: 'heading',
      content: 'Readonly and Parameter Properties',
    },
    {
      type: 'example',
      title: 'readonly and shorthand constructor parameter properties',
      content: 'The "readonly" modifier makes a property assignable only in the constructor, never again after. TypeScript also offers a shorthand: add an access modifier in the constructor parameters and TypeScript automatically creates the property and assigns it. This drastically reduces boilerplate.',
      language: 'typescript',
      code: `// Long form (without parameter properties):
class ProductLong {
  public readonly id: number;
  public name: string;
  private price: number;

  constructor(id: number, name: string, price: number) {
    this.id = id;
    this.name = name;
    this.price = price;
  }
}

// Short form using parameter properties - identical result:
class Product {
  constructor(
    public readonly id: number,   // creates this.id (readonly)
    public name: string,          // creates this.name
    private price: number,        // creates this.price (private)
    protected category?: string,  // creates this.category (optional)
  ) {}

  getPrice(): number { return this.price; }
  getPriceWithTax(rate: number): number { return this.price * (1 + rate); }
}

const p = new Product(1, "Laptop", 999, "Electronics");
console.log(p.id);   // 1
// p.id = 2;          // Error: readonly
// console.log(p.price); // Error: private`,
    },
    {
      type: 'heading',
      content: 'Abstract Classes',
    },
    {
      type: 'example',
      title: 'Abstract classes - templates that must be subclassed',
      content: 'An abstract class cannot be instantiated directly - it serves as a base template for subclasses. Abstract methods declare a signature but no implementation; each subclass must provide its own implementation. This enforces a contract across all subclasses.',
      language: 'typescript',
      code: `abstract class Shape {
  abstract readonly name: string;
  abstract getArea(): number;
  abstract getPerimeter(): number;

  // Concrete method - shared by all shapes
  describe(): string {
    return this.name + ": area=" + this.getArea().toFixed(2) +
      ", perimeter=" + this.getPerimeter().toFixed(2);
  }
}

// new Shape(); // Error: Cannot create an instance of an abstract class

class Circle extends Shape {
  readonly name = "Circle";
  constructor(private radius: number) { super(); }
  getArea(): number { return Math.PI * this.radius ** 2; }
  getPerimeter(): number { return 2 * Math.PI * this.radius; }
}

class Rectangle extends Shape {
  readonly name = "Rectangle";
  constructor(private width: number, private height: number) { super(); }
  getArea(): number { return this.width * this.height; }
  getPerimeter(): number { return 2 * (this.width + this.height); }
}

const shapes: Shape[] = [new Circle(5), new Rectangle(4, 6)];
shapes.forEach(s => console.log(s.describe()));`,
    },
    {
      type: 'heading',
      content: 'Implementing Interfaces',
    },
    {
      type: 'example',
      title: 'implements - class must satisfy an interface contract',
      content: 'The "implements" keyword tells TypeScript that a class must fulfill an interface contract. If the class is missing any property or method from the interface, TypeScript reports an error. A class can implement multiple interfaces.',
      language: 'typescript',
      code: `interface Serializable {
  serialize(): string;
  deserialize(data: string): this;
}

interface Printable {
  print(): void;
  toHTML(): string;
}

// implements enforces the contract
class Document implements Serializable, Printable {
  constructor(
    public title: string,
    public content: string,
  ) {}

  serialize(): string {
    return JSON.stringify({ title: this.title, content: this.content });
  }

  deserialize(data: string): this {
    const parsed = JSON.parse(data);
    this.title = parsed.title;
    this.content = parsed.content;
    return this;
  }

  print(): void {
    console.log("--- " + this.title + " ---");
    console.log(this.content);
  }

  toHTML(): string {
    return "<article><h1>" + this.title + "</h1><p>" + this.content + "</p></article>";
  }
}

const doc = new Document("Hello", "World");
const json = doc.serialize();
console.log(json);`,
    },
    {
      type: 'tryit',
      title: 'Try It: TypeScript Classes',
      css: `body{font-family:system-ui,sans-serif;padding:20px;} .card{background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:14px;margin-bottom:10px;} .card-title{font-weight:700;color:#1e40af;margin-bottom:6px;font-size:14px;} .prop{font-size:13px;color:#374151;margin:3px 0;} .badge{display:inline-block;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:700;margin-right:4px;}`,
      js: `// TypeScript class patterns in JavaScript

class Animal {
  constructor(name, sound, type) {
    this.name = name;
    this._sound = sound;    // private-like (convention)
    this.type = type;
  }
  speak() { return this.name + ' says: ' + this._sound; }
  describe() { return this.type + ': ' + this.name; }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name, 'Woof!', 'Dog');
    this.breed = breed;
  }
  fetch(item) { return this.name + ' fetches the ' + item; }
}

class Cat extends Animal {
  constructor(name, isIndoor) {
    super(name, 'Meow!', 'Cat');
    this.isIndoor = isIndoor;
  }
  purr() { return this.name + ' purrs...'; }
}

const animals = [
  new Dog('Rex', 'German Shepherd'),
  new Dog('Buddy', 'Labrador'),
  new Cat('Whiskers', true),
  new Cat('Shadow', false),
];

animals.forEach(a => console.log(a.speak()));

document.getElementById('output').innerHTML =
  animals.map(a =>
    '<div class="card"><div class="card-title">' + a.name + '</div>' +
    '<div class="prop">' + a.describe() + '</div>' +
    '<div class="prop">' + a.speak() + '</div>' +
    (a instanceof Dog ? '<div class="prop">' + a.fetch('ball') + '</div>' : '') +
    (a instanceof Cat ? '<div class="prop">' + a.purr() + '</div>' : '') +
    '</div>'
  ).join('');`,
    },
  ],
  exercises: [
    {
      id: 'ts-class-1',
      question: 'What is the difference between "private" and "protected" in TypeScript?',
      type: 'multiple-choice',
      options: [
        '"private" is JavaScript native; "protected" is TypeScript only',
        '"private" is only accessible inside the class; "protected" is accessible in the class and its subclasses',
        '"private" makes the property immutable; "protected" makes it mutable',
        'They are identical - both restrict access from outside the class',
      ],
      correct: 1,
      explanation: '"private" restricts access to inside the class definition only - not even subclasses can access it. "protected" allows access inside the class AND in any class that extends it. Both are TypeScript compile-time checks only and do not appear in the JavaScript output.',
    },
    {
      id: 'ts-class-2',
      question: 'What does the "implements" keyword do in a TypeScript class?',
      type: 'multiple-choice',
      options: [
        'It copies all methods from the interface into the class automatically',
        'It tells TypeScript the class must provide all properties and methods defined in the interface',
        'It extends the class from the interface',
        'It makes all interface properties readonly in the class',
      ],
      correct: 1,
      explanation: '"implements" declares that a class promises to fulfill an interface contract. TypeScript checks that the class has all the required properties and methods with matching types. If anything is missing or wrong, it is a compile error. The class must provide its own implementations.',
    },
  ],
  quiz: [
    {
      id: 'ts-class-q1',
      question: 'What is the shorthand "constructor(private name: string)" equivalent to?',
      options: [
        'Only declaring name as a property, not assigning it',
        'Declaring "private name: string" as a class property AND assigning "this.name = name" in the constructor body',
        'Making name accessible from outside the class',
        'Creating a getter for the name property',
      ],
      correct: 1,
      explanation: 'Parameter properties are a TypeScript shorthand. Writing "constructor(private name: string)" is exactly equivalent to declaring "private name: string" at the class level AND writing "this.name = name" inside the constructor body. It reduces boilerplate significantly.',
    },
  ],
};
