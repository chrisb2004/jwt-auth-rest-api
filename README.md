# node_practice

## Project Objective

This project is designed to reinforce:

- Environment setup for a Node.js project
- Building a CRUD application with Node.js and Express
- Designing REST APIs
- Implementing session-based and token-based authentication

---

## Environment Setup

### 1. Clone the repo and install dependencies

\```bash
npm install
\```

This reads `package.json` and `package-lock.json` to recreate `node_modules` exactly. You never need to commit `node_modules` itself.

### 2. Create your `.env` file

\```bash
touch .env
\```

Add any secret keys or environment variables here. This file is ignored by Git — never commit it.

### 3. Run the project

\```bash
# Production mode — runs once, no auto-restart
npm start

# Development mode — auto-restarts on file save (uses nodemon)
npm run dev
\```

### 4. Run tests

\```bash
# Run all test files (*.test.js, *.spec.js, __tests__/ folder)
npm test

# Watch mode — re-runs tests on file changes, lets you filter interactively
npm run test:watch

# Run a specific test file
npx jest filename.test.js

# Run tests matching a pattern
npx jest user    # runs any test file with "user" in the name
\```

---

## package.json Explained

### dependencies vs devDependencies

| | dependencies | devDependencies |
|---|---|---|
| Used in production? | ✅ Yes | ❌ No |
| Example | `express` (serves your app) | `nodemon`, `jest` |
| Install flag | `npm install <pkg>` | `npm install <pkg> -D` |

When deploying, run `npm install --production` to skip devDependencies and keep your server lean.

### npm scripts

- `npm start` → runs `node index.js` once. Manually stop and restart if you change code.
- `npm run dev` → runs `nodemon index.js`, auto-restarts on file save.
- `npm test` and `npm start` are built-in npm shortcuts — no `run` needed.
- Everything else (`dev`, `test:watch`) requires `npm run <script>`.

---

## .gitignore Explained

### How it works

- Plain text file, one pattern per line
- `#` starts a comment (unlike JSON, plain text files support comments)
- `*` is a wildcard — matches anything (e.g. `*.log` ignores all log files)
- `dist/` — trailing `/` means match folders only, not files named `dist`
- `**/*.test.js` — `**` means any folder depth, ignores test files anywhere in the project

### Why ignore node_modules but keep package-lock.json?

- `package.json` — defines **what** packages your project needs
- `package-lock.json` — locks the **exact versions** so everyone gets the same thing
- `node_modules/` — can be fully recreated with `npm install`, no need to commit it

Anyone who clones this repo just runs `npm install` and gets an identical environment.