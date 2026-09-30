// Starter programs for the terminal / data simulators (PostgreSQL, Git, Redis, Docker, YAML, JSON, HTTP).

export const POSTGRES_STARTER = `-- PostgreSQL — real Postgres 16 running in your browser (WebAssembly)
CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT,
  salary NUMERIC(10, 2),
  hired DATE DEFAULT CURRENT_DATE
);

INSERT INTO employees (name, department, salary) VALUES
  ('Ada', 'Engineering', 120000),
  ('Linus', 'Engineering', 110000),
  ('Grace', 'Research', 130000),
  ('Sam', 'Sales', 70000);

SELECT department, COUNT(*) AS people, ROUND(AVG(salary), 2) AS avg_salary
FROM employees
GROUP BY department
ORDER BY avg_salary DESC;

-- Postgres features: RETURNING, window functions, JSONB
UPDATE employees SET salary = salary * 1.05 WHERE department = 'Sales' RETURNING id, name, salary;

SELECT name, department, salary,
       RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank
FROM employees;

SELECT '{"tags": ["sql", "postgres"]}'::jsonb -> 'tags' ->> 0 AS first_tag;

-- psql commands work too
\\dt
\\d employees
`;

export const GIT_STARTER = `# Git — a working sandbox: files and commits live in memory
mkdir demo && cd demo
git init
echo "# My Project" > README.md
git add .
git commit -m "Initial commit"

# Branch, change, merge
git switch -c feature/login
echo "login page" > login.txt
git add login.txt
git commit -m "Add login page"
git switch main
echo "docs update" >> README.md
git commit -am "Update README"
git merge feature/login

git log --oneline --graph --all
git status
git tag v1.0.0
git branch -v
`;

export const REDIS_STARTER = `# Redis — redis-cli style commands on an in-memory server
SET greeting "hello"
GET greeting
INCR visits
INCRBY visits 10
SET session:42 "alice" EX 60
TTL session:42

# Lists, hashes, sets, sorted sets
LPUSH tasks "write code" "test code"
RPUSH tasks "deploy"
LRANGE tasks 0 -1
HSET user:1 name "Ada" role "admin"
HGETALL user:1
SADD tags redis cache db
SMEMBERS tags
ZADD leaderboard 100 alice 250 bob 175 carol
ZREVRANGE leaderboard 0 -1 WITHSCORES

# Transactions
MULTI
SET a 1
INCR a
EXEC
KEYS *
`;

export const DOCKER_STARTER = `# Docker — a simulated daemon: images, containers, networks, volumes live in memory
docker run -d -p 8080:80 --name web nginx:alpine
docker ps
curl localhost:8080
docker logs web
docker exec web nginx -v

docker network create app-net
docker volume create pgdata
docker run -d --name cache --network app-net redis:7-alpine
docker exec cache redis-cli SET hello world
docker exec cache redis-cli GET hello

docker images
docker stop web
docker rm web
docker ps -a
`;

export const YAML_STARTER = `# YAML — validated as you run it. Docker Compose, GitHub Actions and Kubernetes files get extra checks.
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/app
    depends_on:
      - db
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: pass
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
`;

export const JSON_STARTER = `{
  "name": "webdev-atlas",
  "version": "1.0.0",
  "private": true,
  "scripts": { "dev": "next dev", "build": "next build" },
  "keywords": ["learning", "web", "docs"],
  "author": { "name": "Ada", "email": "ada@example.com" },
  "active": true,
  "score": 9.5,
  "notes": null
}
`;

export const HTTP_STARTER = `### Fetch a post (served by a built-in mock API)
GET https://jsonplaceholder.typicode.com/posts/1
Accept: application/json

### Create a post
POST https://jsonplaceholder.typicode.com/posts
Content-Type: application/json

{
  "title": "Hello",
  "body": "Sent from the HTTP client",
  "userId": 1
}

### Filter with a query string
GET https://jsonplaceholder.typicode.com/comments?postId=1&_limit=2
`;

export const MONGO_STARTER = `// MongoDB — mongosh-style shell on an in-memory database
use shop

db.products.insertMany([
  { name: "Laptop", price: 999, category: "Electronics", stock: 15, tags: ["work", "computer"] },
  { name: "Mouse", price: 19.99, category: "Electronics", stock: 120, tags: ["computer"] },
  { name: "Desk", price: 249.5, category: "Furniture", stock: 8, tags: ["office"] },
  { name: "Chair", price: 129, category: "Furniture", stock: 20, tags: ["office"] }
])

db.products.find({ price: { $gt: 100 } }).sort({ price: -1 })
db.products.find({ tags: "office" }, { name: 1, price: 1, _id: 0 })

db.products.updateOne({ name: "Mouse" }, { $inc: { stock: -1 }, $set: { onSale: true } })
db.products.findOne({ name: "Mouse" })

db.products.aggregate([
  { $group: { _id: "$category", total: { $sum: "$price" }, count: { $sum: 1 } } },
  { $sort: { total: -1 } }
])

db.products.createIndex({ category: 1 })
db.products.find({ category: "Furniture" }).explain("executionStats").executionStats
show collections
`;
