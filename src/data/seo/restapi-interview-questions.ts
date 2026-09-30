import { code } from './cheatsheet-types';
import type { QuestionBank } from './question-types';

export const restapiInterview: QuestionBank = {
  path: '/restapi-interview-questions',
  mode: 'interview',
  tech: 'restapi',
  codeLang: 'http',
  badge: 'REST API interview',
  title: 'REST API Interview Questions and Answers',
  description: '45+ REST API interview questions with clear answers: HTTP methods, status codes, URL design, authentication, versioning, pagination, rate limiting and CORS.',
  h1: 'REST API Interview Questions and Answers (Freshers to Backend Developers)',
  intro: 'Forty-five REST API interview questions grouped by topic: fundamentals, HTTP methods, status codes, URL and resource design, request/response structure, authentication, and production best practices (versioning, rate limiting, caching, CORS). Each has a short answer and a fuller explanation, framework-agnostic and applicable regardless of which language or framework you build APIs with. For building the actual routes in Node.js, see the Express.js interview questions page.',
  notes: [
    {
      id: 'how-to-use',
      title: 'How to use this page',
      text: 'Read the short answer first, then open the longer explanation for the reasoning. This page is framework-agnostic by design — it is about API design principles that apply whether you build with Express, Django, Rails or anything else, not the syntax of any one framework.',
      placement: 'top',
    },
    {
      id: 'common-mistakes',
      title: 'Common mistakes beginners make',
      items: [
        'Using verbs in URLs, like /getUser or /createOrder. Fix: the HTTP method already expresses the action — resources should be nouns, like GET /users/42 or POST /orders.',
        'Returning 200 OK for every response regardless of outcome, with the real result buried in the body. Fix: use the status code to communicate the actual outcome — clients, proxies, and monitoring tools all rely on it.',
        'Confusing 401 and 403. Fix: 401 means "we don\'t know who you are" (missing or invalid credentials); 403 means "we know who you are, and you\'re not allowed to do this."',
        'Building an API with no versioning at all, then having no way to make a breaking change later without breaking every existing client. Fix: version from the start, even if it is just /v1/, so a breaking change can become /v2/ instead.',
      ],
    },
    {
      id: 'real-projects',
      title: 'Where this helps in real projects',
      items: [
        'Designing resource URLs and choosing HTTP methods that another developer (or your future self) can predict without checking documentation.',
        'Returning the right status code so client error handling, retries, and monitoring dashboards all work correctly.',
        'Choosing an authentication approach (API key, JWT, OAuth) that actually fits the situation — a public API, a first-party client, or delegated third-party access are different problems.',
        'Designing pagination and filtering that stays fast and predictable as a dataset grows into the millions of rows.',
      ],
    },
    {
      id: 'study-tip',
      title: 'Study tip',
      text: 'Design a small REST API on paper (or in a scratch file) for a real feature — a bookstore, a task tracker — including every resource\'s URLs, methods, status codes, and its error and pagination shape. Most REST interview questions are really testing whether you have internalized these conventions well enough to apply them consistently, not whether you can recite a definition.',
    },
  ],
  groups: [
    {
      id: 'fundamentals',
      title: 'REST fundamentals',
      items: [
        { q: 'What does REST stand for, and what does it actually mean in practice?', level: 'beginner', short: 'Representational State Transfer: an architectural style for designing networked APIs around resources (nouns, like "a user" or "an order"), identified by URLs, manipulated through a small set of standard HTTP methods, with each request containing everything needed to understand it.', long: 'REST is a set of constraints and conventions, not a protocol or a standard with an official specification — which is why real-world "REST APIs" vary somewhat in how strictly they follow every original REST principle. In practice, "RESTful" usually means: resource-based URLs, standard HTTP methods mapped to CRUD-like actions, and JSON request/response bodies.' },
        { q: 'What does it mean for a REST API to be "stateless"?', level: 'intermediate', short: 'Each request must contain all the information the server needs to process it — the server does not rely on any session state remembered from a previous request. Authentication, for example, is proven on every single request (like via a token), not by the server "remembering" that you logged in earlier.', long: 'Statelessness is a big part of why REST APIs scale well horizontally: any server instance can handle any request, since no server needs to hold onto session-specific memory that only it has — a load balancer can send consecutive requests from the same client to entirely different servers with no issue.' },
        { q: 'What is the difference between REST and SOAP, at a high level?', level: 'advanced', short: 'REST is a lightweight architectural style built on standard HTTP, typically using JSON. SOAP is a stricter, XML-based protocol with a formal specification, built-in error handling standards, and heavier tooling — historically common in enterprise and financial systems that valued that formality, while REST became dominant for public web APIs due to its simplicity.' },
        { q: 'What is the difference between REST and GraphQL?', level: 'advanced', short: 'A REST API exposes fixed endpoints, each returning a fixed shape of data. GraphQL exposes a single endpoint where the client specifies exactly what fields it wants in the query itself, potentially fetching data from multiple resources in one request instead of several.', long: 'REST\'s fixed endpoints can lead to over-fetching (getting fields you don\'t need) or under-fetching (needing several requests to assemble what you actually want). GraphQL solves both, at the cost of more complexity on the server side and a steeper learning curve — the right choice depends on the API\'s consumers and how varied their data needs are.' },
        { q: 'Why is REST\'s reliance on standard HTTP methods and status codes considered a strength?', level: 'intermediate', short: 'Because HTTP itself is already universally understood — browsers, proxies, caches, monitoring tools, and every HTTP client library already know what GET, 404 and Cache-Control mean, so a well-designed REST API gets a huge amount of tooling and shared understanding "for free" just by following the conventions.' },
      ],
    },
    {
      id: 'methods',
      title: 'HTTP methods',
      items: [
        { q: 'What does it mean for an HTTP method to be "safe"?', level: 'intermediate', short: 'A safe method should never change server-side state — GET, HEAD and OPTIONS are safe. A GET request that deletes data (or has any other side effect) violates this and can cause real problems, since things like browser prefetching and search engine crawlers assume GET is always harmless to call.' },
        { q: 'What does it mean for an HTTP method to be "idempotent"?', level: 'intermediate', short: 'Calling it once has the same effect as calling it many times with the same input. GET, PUT and DELETE are idempotent; POST is not.', code: code('DELETE /v1/orders/42 HTTP/1.1', 'Host: api.example.com'), long: 'Calling this a second time still results in order 42 being gone — it just has nothing left to delete the second time, which is exactly what "idempotent" means. This matters most for safe retries: a client (or a proxy) can safely retry an idempotent request if a response was lost due to a network issue, without worrying about accidentally repeating the effect — retrying a non-idempotent POST could create a duplicate resource.' },
        { q: 'Why is PATCH not considered idempotent by default, even though PUT is?', level: 'advanced', short: 'PUT replaces a resource with a full representation, so sending the same PUT request twice leaves the resource in the same final state both times. A PATCH that says "increment this counter by 1" produces a different result each time it is applied, even with an identical request body.', long: 'A PATCH endpoint can be designed to be idempotent (like "set this field to this exact value" rather than "increment it"), but it is not guaranteed to be idempotent by the semantics of the method itself, the way PUT and DELETE are.' },
        { q: 'What is the difference between PUT and PATCH?', level: 'beginner', short: 'PUT replaces the entire resource — fields left out of the request body are typically treated as cleared or reset to a default. PATCH updates only the specific fields included in the request, leaving everything else on the resource untouched.', code: code('PATCH /v1/users/42 HTTP/1.1', 'Content-Type: application/json', '', '{ "email": "new@example.com" }'), lessons: ['restapi/03-http-methods'] },
        { q: 'What are HEAD and OPTIONS used for?', level: 'advanced', short: 'HEAD requests the same response as GET but without the body — useful for checking if a resource exists, or reading headers like Content-Length, without downloading the full payload. OPTIONS asks what methods and headers a given endpoint supports, and is what browsers automatically send as a CORS "preflight" request before certain cross-origin requests.', lessons: ['restapi/03-http-methods'] },
      ],
    },
    {
      id: 'status-codes',
      title: 'Status codes',
      items: [
        { q: 'What is the difference between the 2xx, 4xx and 5xx status code ranges, broadly?', level: 'beginner', short: '2xx means success. 4xx means the client made a mistake (bad input, missing auth, requesting something that does not exist). 5xx means the server failed to handle an otherwise valid request — the fault is on the server\'s side, not the client\'s.', lessons: ['restapi/04-status-codes'] },
        { q: 'What is the difference between 401 Unauthorized and 403 Forbidden?', level: 'intermediate', short: '401 means the request has no valid credentials at all — not authenticated. 403 means the credentials are valid and the client is authenticated, but that identity is specifically not allowed to perform this action — authenticated, but not authorized.', code: code('HTTP/1.1 401 Unauthorized', 'WWW-Authenticate: Bearer', '', '{ "error": { "message": "Authentication required" } }'), long: 'This is one of the single most commonly confused pairs in API design — many real APIs get it wrong, returning 403 for a missing token when 401 is actually correct.', lessons: ['restapi/04-status-codes'] },
        { q: 'When would an API return 422 Unprocessable Entity instead of 400 Bad Request?', level: 'advanced', short: '400 typically means the request itself is malformed (invalid JSON, wrong content type). 422 means the request is syntactically valid and was understood, but the data fails semantic validation — like a well-formed JSON body with an email field that is not a valid email address.', long: 'Not every API bothers distinguishing these two — many use 400 for both cases — but a well-designed API that does distinguish them gives clients a more precise signal about what kind of problem occurred.' },
        { q: 'What is the difference between 404 Not Found and 410 Gone?', level: 'advanced', short: '404 means the resource was not found, without saying anything about why — it might never have existed, or might exist under a different URL. 410 specifically means the resource used to exist at this URL and has been permanently and intentionally removed — a stronger, more specific signal.' },
        { q: 'What does 429 Too Many Requests mean, and what header commonly accompanies it?', level: 'intermediate', short: 'The client has exceeded a rate limit. It is commonly returned alongside a Retry-After header, telling the client how long to wait before trying again.', code: code('HTTP/1.1 429 Too Many Requests', 'Retry-After: 60', '', '{ "error": { "message": "Rate limit exceeded" } }'), lessons: ['restapi/04-status-codes'] },
      ],
    },
    {
      id: 'url-design',
      title: 'URL and resource design',
      items: [
        { q: 'Why should REST URLs use nouns, not verbs?', level: 'beginner', short: 'The HTTP method already expresses the action (GET reads, POST creates, DELETE removes) — putting a verb in the URL too, like /getUsers or /deleteOrder, duplicates that meaning and breaks the convention that makes REST APIs predictable to navigate.', code: code('GET /users        (not GET /getUsers)', 'POST /users       (not POST /createUser)', 'DELETE /users/42  (not POST /deleteUser?id=42)'), lessons: ['restapi/05-url-design'] },
        { q: 'How should you design a URL for a nested/hierarchical resource, like a user\'s orders?', level: 'intermediate', short: 'Nest the path to reflect the relationship: /users/42/orders reads naturally as "the orders belonging to user 42," and /users/42/orders/7 identifies one specific order within that context.', code: code('GET /v1/users/42/orders', 'GET /v1/users/42/orders/7'), lessons: ['restapi/05-url-design'] },
        { q: 'Should URLs use singular or plural resource names?', level: 'beginner', short: 'Plural, consistently — /users, /orders, /products — even for a single-item request like GET /users/42. This keeps the convention uniform regardless of whether zero, one, or many results come back.', lessons: ['restapi/05-url-design'] },
        { q: 'What belongs in the URL path versus a query parameter?', level: 'intermediate', short: 'The path identifies a specific resource or collection (/users/42). Query parameters express optional modifiers to a request against that resource — filtering, sorting, pagination (?status=active&page=2) — not things that identify a specific different resource.', code: code('GET /v1/orders?status=shipped&page=2&limit=20'), lessons: ['restapi/05-url-design'] },
      ],
    },
    {
      id: 'request-response',
      title: 'Request and response design',
      items: [
        { q: 'Why is a consistent response structure across every endpoint worth the effort?', level: 'intermediate', short: 'Clients can write one generic piece of code to parse any response, instead of special-casing every endpoint\'s slightly different shape — a real maintenance and developer-experience cost that compounds as an API grows.', code: code('{', '  "data": { "id": 42, "name": "Ada" },', '  "meta": { "requestId": "abc123" }', '}'), lessons: ['restapi/06-request-response'] },
        { q: 'What should a consistent error response look like?', level: 'intermediate', short: 'A predictable shape every endpoint uses for errors — typically an object with a machine-readable code, a human-readable message, and sometimes field-level validation details — so client error-handling code does not need custom logic per endpoint.', code: code('HTTP/1.1 422 Unprocessable Entity', 'Content-Type: application/json', '', '{', '  "error": {', '    "code": "VALIDATION_ERROR",', '    "message": "Email is not a valid email address",', '    "field": "email"', '  }', '}'), lessons: ['restapi/06-request-response'] },
        { q: 'How would you design a paginated list response?', level: 'intermediate', short: 'Return the page of results alongside metadata the client needs to fetch more — typically the current page, the page size, and either a total count or a "has more" flag / next-page link.', code: code('{', '  "data": [ { "id": 101 }, { "id": 102 } ],', '  "meta": { "page": 2, "limit": 20, "total": 143 }', '}'), lessons: ['restapi/06-request-response'] },
        { q: 'Why should API responses always use ISO 8601 for dates?', level: 'intermediate', short: 'It is an unambiguous, widely-supported, sortable string format (2026-08-19T14:30:00Z) that every serious programming language can parse without guessing the date order or timezone — unlike a format like "08/19/2026," which is genuinely ambiguous between different regional conventions.', code: code('{ "createdAt": "2026-08-19T14:30:00Z" }'), lessons: ['restapi/06-request-response'] },
        { q: 'What is the difference between returning null for a field versus omitting it from the response entirely?', level: 'advanced', short: 'null usually means "this field exists on the resource conceptually, but currently has no value" — the client can rely on the key always being present. Omitting the key entirely more often signals "this field does not apply here at all." Pick one convention and apply it consistently, since mixing both for the same conceptual situation confuses clients.', lessons: ['restapi/06-request-response'] },
      ],
    },
    {
      id: 'authentication',
      title: 'Authentication and authorization',
      items: [
        { q: 'What is the difference between authentication and authorization?', level: 'beginner', short: 'Authentication verifies who is making the request. Authorization decides what that identity is allowed to do — a request can be fully authenticated and still be forbidden (403) from a specific action.', lessons: ['restapi/07-authentication'] },
        { q: 'How does API key authentication work, and what is a limitation of it?', level: 'intermediate', short: 'A fixed secret string is sent with each request (often in a header) identifying the calling application. It is simple to implement, but it typically identifies an application, not an individual end user, and if leaked, must be manually revoked and rotated — it carries no built-in expiry or scoping the way a JWT can.', code: code('GET /v1/data HTTP/1.1', 'X-API-Key: sk_live_abc123'), lessons: ['restapi/07-authentication'] },
        { q: 'What is a JWT, and what are its three parts?', level: 'advanced', short: 'A JSON Web Token: a compact, signed token with three base64-encoded parts separated by dots — a header (describing the signing algorithm), a payload (the claims, like the user id and an expiry), and a signature (proving the token was issued by the server and has not been tampered with).', code: code('Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMiLCJleHAiOjE3MjY3NjE2MDB9.abc123signature'), long: 'Anyone can decode a JWT\'s header and payload — they are just base64, not encrypted — so a JWT should never contain secret information. The signature is what prevents tampering, not confidentiality.', lessons: ['restapi/07-authentication'] },
        { q: 'What is a refresh token, and why is it used alongside a short-lived access token?', level: 'advanced', short: 'A long-lived, more carefully protected token used only to obtain a new short-lived access token when the current one expires — this limits how long a stolen access token remains useful, while avoiding forcing the user to log in again every few minutes.', long: 'Access tokens are typically short-lived (minutes to an hour) and sent on every request, making them somewhat exposed. Refresh tokens are used rarely (only to mint a new access token) and can be stored more securely and revoked individually if compromised.', lessons: ['restapi/07-authentication'] },
        { q: 'What problem does OAuth 2.0 solve that a simple username/password login does not?', level: 'advanced', short: 'Delegated authorization: letting a third-party application act on a user\'s behalf (like "let this app post to your account") without that app ever seeing the user\'s actual password — the user authenticates directly with the service they trust, which then issues a scoped, revocable token to the third-party app.', lessons: ['restapi/07-authentication'] },
        { q: 'What is the difference between Basic Auth and Bearer token auth?', level: 'intermediate', short: 'Basic Auth sends a base64-encoded username:password on every single request. Bearer token auth sends a token (often a JWT) obtained once during login — the credentials themselves are not repeatedly transmitted, and the token can carry an expiry and be revoked independently of the user\'s actual password.', code: code('Authorization: Basic YWRhOnNlY3JldA==', 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...'), lessons: ['restapi/07-authentication'] },
      ],
    },
    {
      id: 'production',
      title: 'Versioning, rate limiting, CORS and caching',
      items: [
        { q: 'Why should an API be versioned from the start, even before any breaking change is planned?', level: 'intermediate', short: 'Adding versioning later, after clients already depend on an unversioned API, is far more disruptive than starting with a simple /v1/ prefix from day one — it costs almost nothing upfront and gives you a clean path (/v2/) the moment a genuine breaking change is needed.', code: code('GET /v1/users/42'), lessons: ['restapi/09-best-practices'] },
        { q: 'What counts as a breaking change that requires a new API version, versus a safe, non-breaking addition?', level: 'advanced', short: 'Breaking: removing a field, renaming a field, changing a field\'s type, changing existing behavior or validation rules. Generally safe: adding a new optional field, adding a new endpoint — existing clients that ignore fields they do not recognize are unaffected.', lessons: ['restapi/09-best-practices'] },
        { q: 'What is rate limiting, and why does an API need it?', level: 'intermediate', short: 'Restricting how many requests a client can make in a given time window, to protect the API from being overwhelmed — whether from a bug in a client, a scraper, or a deliberate abuse attempt — and to keep service fair across all clients.', code: code('HTTP/1.1 429 Too Many Requests', 'X-RateLimit-Limit: 100', 'X-RateLimit-Remaining: 0', 'Retry-After: 60'), lessons: ['restapi/09-best-practices'] },
        { q: 'What is CORS, and why do browsers enforce it?', level: 'advanced', short: 'Cross-Origin Resource Sharing: a browser security mechanism that blocks a web page from calling an API on a different origin (domain, port or protocol) unless that API explicitly allows it via response headers — protecting users from a malicious page silently making authenticated requests to another site on their behalf.', code: code('Access-Control-Allow-Origin: https://example.com', 'Access-Control-Allow-Methods: GET, POST'), long: 'CORS is enforced entirely by the browser, not the server — a non-browser client (like a mobile app, or curl) is never blocked by CORS, since the restriction exists specifically to protect users of a browser from a malicious web page, not to secure the API itself.', lessons: ['restapi/09-best-practices'] },
        { q: 'What is a CORS "preflight" request?', level: 'advanced', short: 'Before certain cross-origin requests (like a POST with a JSON body), the browser automatically sends an OPTIONS request first, asking the server whether the actual request is allowed — the server responds with the allowed origins/methods/headers, and only if that preflight succeeds does the browser send the real request.', lessons: ['restapi/09-best-practices'] },
        { q: 'How does HTTP caching work for an API, and what does the ETag header do?', level: 'advanced', short: 'Cache-Control headers tell clients and intermediate caches how long a response can be reused without asking the server again. An ETag is a fingerprint of the current response — a client can send it back on a later request (If-None-Match), and the server replies 304 Not Modified with no body at all if nothing has changed, saving bandwidth.', code: code('HTTP/1.1 200 OK', 'Cache-Control: max-age=60', 'ETag: "a1b2c3"'), lessons: ['restapi/09-best-practices'] },
        { q: 'What is OpenAPI (Swagger), and why do teams use it?', level: 'intermediate', short: 'A standard, machine-readable format for describing a REST API\'s endpoints, parameters, request/response shapes and authentication — from one OpenAPI spec file, tools can auto-generate interactive documentation, client SDKs, and even server-side request validation, instead of hand-writing and maintaining all of that separately.', lessons: ['restapi/09-best-practices'] },
      ],
    },
  ],
  tips: [
    'Know 401 vs 403 cold, and be ready to give a concrete example of each — one of the single most common REST interview questions.',
    'Be able to explain idempotency precisely, including why PUT and DELETE qualify but POST does not, with an example of why that matters for retries.',
    'Practice designing URLs for a nested resource relationship out loud — hierarchical URL design is a very common practical exercise.',
    'Understand the authentication vs authorization distinction, and be ready to compare API keys, JWTs and OAuth 2.0 by what problem each actually solves.',
    'Be able to explain why an API should be versioned from day one, not just what versioning looks like.',
  ],
  more: [
    { label: 'REST API cheat sheet', href: '/restapi-cheatsheet' },
    { label: 'Express.js interview questions', href: '/express-interview-questions' },
    { label: 'Node.js interview questions', href: '/nodejs-interview-questions' },
    { label: 'REST API lessons', href: '/learn/rest-api' },
    { label: 'Backend developer roadmap', href: '/roadmaps/backend' },
  ],
};
