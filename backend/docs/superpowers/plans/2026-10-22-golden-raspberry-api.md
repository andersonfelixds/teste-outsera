# Golden Raspberry Awards API — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a RESTful API in Node.js that reads a CSV of Golden Raspberry Awards data, persists it in an in-memory SQLite database, and exposes endpoints to analyze producer award intervals, with documented AI/skill interactions.

**Architecture:** The app loads the CSV on startup, populates an in-memory SQLite database, and exposes two REST endpoints: one to query min/max award intervals by producer, another to retrieve the AI interaction history. A service tracks all LLM tool calls and skills used during development and makes them queryable. All data lives in memory; no external dependencies or database setup required.

**Tech Stack:** Express.js, SQLite (better-sqlite3), Jest, csv-parse for CSV handling.

**Spec:** Golden Raspberry Awards API requirements (inline in this document).

## Global Constraints

- Language: Node.js (JavaScript)
- Database: SQLite in-memory, no external setup required
- Framework: Express.js (REST Level 2)
- Testing: Jest integration tests only
- CSV separator: `;` (semicolon), producers field may contain multiple names separated by `, `
- Winner indicator: `winner` column contains `yes` for winners, empty otherwise
- AI/Skill documentation: Both file (`AI_INTERACTIONS.md`) and queryable endpoint required
- Attribution: Include `Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>` in commit messages

## Review Focus

1. **Producer with multiple names in one record** — CSV `producers` field may contain `Name1, Name2`. Parser must split and create separate rows or handle in query logic without duplicating winners.

2. **Edge case: single win per producer** — Producer appears only once with `winner=yes`. Algorithm must not crash; min/max intervals should skip this producer or handle gracefully.

3. **Null/empty year handling** — CSV may have malformed rows. Loader must validate year is a valid integer before insert.

4. **Interval calculation off-by-one** — Interval between consecutive wins (e.g., 2008 and 2009) is exactly 1 year, not 0. Tests must verify this.

5. **AI interaction logging during tests** — Integration tests trigger API calls which log interactions. Tests should not fail if AI interaction logging throws; logging must be non-blocking.

---

## File Structure

```
project-root/
├── src/
│   ├── app.js                    # Express app setup and initialization
│   ├── server.js                 # Server startup (runs app.js)
│   ├── database.js               # SQLite connection and schema
│   ├── services/
│   │   ├── producerService.js    # Interval calculation logic
│   │   ├── aiInteractionService.js  # AI interaction logging
│   │   └── csvLoader.js          # CSV parsing and DB insert
│   └── routes/
│       ├── awardsRoutes.js       # GET /awards/producers/intervals
│       └── aiRoutes.js           # GET /ai-interactions
├── tests/
│   └── integration/
│       ├── setup.js              # Jest setup, in-memory DB fixture
│       ├── awards.test.js        # Tests for intervals endpoint
│       └── aiInteractions.test.js # Tests for AI history endpoint
├── data/
│   └── Movielist.csv             # CSV data file (provided)
├── AI_INTERACTIONS.md            # Documentation of LLM tool calls and skills used
├── README.md                      # Build, run, and test instructions
├── package.json
├── jest.config.js
├── .gitignore
└── docs/
    └── superpowers/
        └── plans/
            └── 2026-10-22-golden-raspberry-api.md (this file)
```

---

## Task 1: Project Setup and Dependencies

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `jest.config.js`

**Interfaces:**
- Produces: Project structure ready to install dependencies; Jest configured to find tests in `tests/` and run them

- [ ] **Step 1: Create `package.json` with required dependencies**

Include: `express`, `better-sqlite3`, `csv-parse`, `jest` (dev), `supertest` (dev). Set `"type": "module"` for ES modules.

- [ ] **Step 2: Create `.gitignore`**

Standard Node ignores: `node_modules/`, `*.log`, `.env`, `.DS_Store`.

- [ ] **Step 3: Create `jest.config.js`**

Configure Jest to use `testEnvironment: "node"`, `testMatch: ["**/tests/integration/**/*.test.js"]`, and disable coverage for now.

- [ ] **Step 4: Run `npm install` to verify no errors**

Expected: All dependencies install without errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .gitignore jest.config.js
git commit -m "setup: initialize Node.js project with Express, SQLite, Jest"
```

---

## Task 2: SQLite Database Setup and Schema

**Files:**
- Create: `src/database.js`

**Interfaces:**
- Produces: 
  - `initializeDatabase()` → Returns SQLite database connection (in-memory)
  - Database has two tables:
    - `movies(id INTEGER PRIMARY KEY, year INTEGER, title TEXT, studios TEXT, producer TEXT, winner INTEGER)`
    - `ai_interactions(id INTEGER PRIMARY KEY, timestamp TEXT, tool_name TEXT, skill_name TEXT, prompt TEXT, result TEXT)`

- [ ] **Step 1: Write `src/database.js` with `initializeDatabase()` function**

Use `better-sqlite3` with `:memory:` for in-memory DB. Create schema for `movies` (columns: id, year, title, studios, producer, winner) and `ai_interactions` (id, timestamp, tool_name, skill_name, prompt, result). Winner column is INTEGER (0 or 1, not text).

- [ ] **Step 2: Test manually that `initializeDatabase()` returns a usable connection**

```javascript
import { initializeDatabase } from './src/database.js';
const db = initializeDatabase();
console.log(db.prepare("SELECT 1").get()); // Should print { "1": 1 }
```

- [ ] **Step 3: Commit**

```bash
git add src/database.js
git commit -m "feat: set up in-memory SQLite database with schema"
```

---

## Task 3: CSV Loader and Data Insertion

**Files:**
- Create: `src/services/csvLoader.js`
- Modify: `src/app.js` (to call CSV loader on startup)

**Interfaces:**
- Consumes: `database.js` → database connection
- Produces:
  - `loadMoviesFromCSV(db, filePath)` → Reads CSV, inserts rows into `movies` table, returns count of inserted rows
  - CSV parsing: Split `producers` field by `, ` and insert each producer as a separate row

- [ ] **Step 1: Write `src/services/csvLoader.js` with `loadMoviesFromCSV(db, filePath)` function**

Use `csv-parse` with options: `delimiter: ';'`, `columns: true`. For each row: validate `year` is an integer, split `producers` by `, `, and for each producer, insert a row into `movies` table with `winner = 1` if `winner === 'yes'`, else `0`. Return count of inserted rows.

- [ ] **Step 2: Write a test to verify CSV loads correctly**

Create a small test CSV in memory, load it, and verify row count and data.

- [ ] **Step 3: Create `src/app.js` with Express app setup**

Initialize Express app, set up routes (routes will be added in later tasks). Call `loadMoviesFromCSV()` on app startup to populate DB.

- [ ] **Step 4: Verify CSV loads without errors**

```bash
node -e "import { initializeDatabase } from './src/database.js'; import { loadMoviesFromCSV } from './src/services/csvLoader.js'; const db = initializeDatabase(); const count = loadMoviesFromCSV(db, './data/Movielist.csv'); console.log('Rows inserted:', count);"
```

Expected: Should print row count without error.

- [ ] **Step 5: Commit**

```bash
git add src/services/csvLoader.js src/app.js
git commit -m "feat: load and insert CSV data into database on startup"
```

---

## Task 4: Producer Interval Analysis Service

**Files:**
- Create: `src/services/producerService.js`

**Interfaces:**
- Consumes: `database.js` → database connection
- Produces:
  - `getProducerIntervals(db)` → Returns object with `min` and `max` arrays
  - `min`: Array of objects `{ producer: string, interval: number, previousWin: number, followingWin: number }`, sorted by interval ascending
  - `max`: Same structure, sorted by interval descending
  - Logic: For each producer with 2+ wins, calculate all consecutive win intervals, find min and max across all producers

- [ ] **Step 1: Write the failing test in `tests/integration/setup.js`**

Create a Jest setup file that initializes an in-memory DB with sample data (e.g., producer "A" wins in 2000, 2001; producer "B" wins in 1990, 2000). Do not execute yet, just scaffold.

- [ ] **Step 2: Write `src/services/producerService.js` with `getProducerIntervals(db)` function**

Query `movies` table for all (producer, year) pairs where `winner = 1`, grouped by producer, sorted by year. For each producer with 2+ wins, calculate intervals between consecutive years. Track global min and max intervals. Return object with `{ min: [], max: [] }` where each entry is `{ producer, interval, previousWin, followingWin }`.

Example: Producer "A" with wins in [2000, 2001, 2005]:
- Intervals: 1 (2000→2001), 4 (2001→2005)
- Min: { producer: "A", interval: 1, previousWin: 2000, followingWin: 2001 }
- Max: { producer: "A", interval: 4, previousWin: 2001, followingWin: 2005 }

- [ ] **Step 3: Test manually with sample data**

```javascript
import { initializeDatabase } from './src/database.js';
import { getProducerIntervals } from './src/services/producerService.js';
const db = initializeDatabase();
// Insert test data manually
db.prepare("INSERT INTO movies (year, title, studios, producer, winner) VALUES (?, ?, ?, ?, ?)").run(2000, 'Film1', 'Studio', 'Producer A', 1);
db.prepare("INSERT INTO movies (year, title, studios, producer, winner) VALUES (?, ?, ?, ?, ?)").run(2001, 'Film2', 'Studio', 'Producer A', 1);
const result = getProducerIntervals(db);
console.log(JSON.stringify(result, null, 2));
```

Expected: `min` and `max` arrays with correct intervals.

- [ ] **Step 4: Commit**

```bash
git add src/services/producerService.js
git commit -m "feat: implement producer interval calculation logic"
```

---

## Task 5: AI Interaction Logging Service

**Files:**
- Create: `src/services/aiInteractionService.js`

**Interfaces:**
- Consumes: `database.js` → database connection
- Produces:
  - `logAIInteraction(db, toolName, skillName, prompt, result)` → Inserts row into `ai_interactions` table, returns id (non-blocking, errors logged silently)
  - `getAIInteractions(db)` → Returns array of all interactions sorted by timestamp desc
  - Returns: `[{ id, timestamp, tool_name, skill_name, prompt, result }, ...]`

- [ ] **Step 1: Write `src/services/aiInteractionService.js` with both functions**

`logAIInteraction`: Insert into `ai_interactions` table with current timestamp (ISO 8601). Wrap in try-catch; log errors to console but don't throw. `getAIInteractions`: Query and return all rows.

- [ ] **Step 2: Test manually**

```javascript
import { initializeDatabase } from './src/database.js';
import { logAIInteraction, getAIInteractions } from './src/services/aiInteractionService.js';
const db = initializeDatabase();
logAIInteraction(db, 'Agent', 'brainstorming', 'plan API', 'response...');
const interactions = getAIInteractions(db);
console.log(interactions);
```

- [ ] **Step 3: Commit**

```bash
git add src/services/aiInteractionService.js
git commit -m "feat: add AI interaction logging and retrieval"
```

---

## Task 6: REST Routes and Endpoints

**Files:**
- Create: `src/routes/awardsRoutes.js`
- Create: `src/routes/aiRoutes.js`
- Modify: `src/app.js` (to register routes)

**Interfaces:**
- Consumes: 
  - `producerService.getProducerIntervals()`
  - `aiInteractionService.getAIInteractions()`
- Produces:
  - `GET /awards/producers/intervals` → 200 with JSON: `{ "min": [...], "max": [...] }`
  - `GET /ai-interactions` → 200 with JSON: `{ "interactions": [...] }`

- [ ] **Step 1: Write `src/routes/awardsRoutes.js`**

Route: `GET /awards/producers/intervals`. Call `getProducerIntervals(db)`, return status 200 with JSON body matching spec format.

- [ ] **Step 2: Write `src/routes/aiRoutes.js`**

Route: `GET /ai-interactions`. Call `getAIInteractions(db)`, return status 200 with JSON body `{ "interactions": [...] }`.

- [ ] **Step 3: Update `src/app.js` to register routes**

```javascript
import awardsRoutes from './routes/awardsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
app.use('/awards', awardsRoutes);
app.use('/ai', aiRoutes);
```

- [ ] **Step 4: Test routes manually with curl or Postman**

```bash
curl http://localhost:3000/awards/producers/intervals
curl http://localhost:3000/ai-interactions
```

- [ ] **Step 5: Commit**

```bash
git add src/routes/awardsRoutes.js src/routes/aiRoutes.js src/app.js
git commit -m "feat: add REST endpoints for awards and AI interactions"
```

---

## Task 7: Integration Tests

**Files:**
- Create: `tests/integration/setup.js`
- Create: `tests/integration/awards.test.js`
- Create: `tests/integration/aiInteractions.test.js`

**Interfaces:**
- Consumes: All services and routes
- Tests must:
  - Verify CSV data loads correctly into DB
  - Verify `/awards/producers/intervals` returns correct min/max
  - Verify `/ai-interactions` returns interactions
  - Use a fresh in-memory DB per test

- [ ] **Step 1: Write `tests/integration/setup.js`**

Export a Jest setup function that creates an in-memory DB and populates it with `Movielist.csv` data. Export this so tests can use it.

- [ ] **Step 2: Write `tests/integration/awards.test.js`**

Test 1: Load real CSV, call GET `/awards/producers/intervals`, verify response has `min` and `max` keys. Verify that each object in `min` has `producer`, `interval`, `previousWin`, `followingWin`.

Test 2: Verify producer with smallest interval is in `min[0]` and has interval >= 1.

Test 3: Verify producer with largest interval is in `max[0]`.

Test 4: Verify producers with only 1 win are not in min or max.

Test 5: Verify interval calculation is correct (e.g., if a producer wins in 2008 and 2009, interval is 1, not 0).

Run with `supertest` to make actual HTTP calls to the app.

- [ ] **Step 3: Write `tests/integration/aiInteractions.test.js`**

Test 1: Call GET `/ai-interactions` on a fresh DB (no interactions logged yet), verify returns `{ "interactions": [] }`.

Test 2: Manually log an AI interaction, call GET, verify it appears in response with correct fields.

Test 3: Verify timestamp is ISO 8601 format.

- [ ] **Step 4: Run all tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add tests/integration/setup.js tests/integration/awards.test.js tests/integration/aiInteractions.test.js
git commit -m "test: add integration tests for API endpoints"
```

---

## Task 8: Documentation

**Files:**
- Create: `README.md`
- Create: `AI_INTERACTIONS.md`

**Interfaces:**
- `README.md`: Instructions to build, run, and test the project
- `AI_INTERACTIONS.md`: Log of LLM interactions (tools, skills, prompts) used to build this API

- [ ] **Step 1: Write `README.md`**

Include:
- Project description (Golden Raspberry Awards API)
- Prerequisites (Node.js version)
- Install: `npm install`
- Run: `npm start` (starts server on port 3000)
- Test: `npm test` (runs Jest)
- API endpoints: `GET /awards/producers/intervals`, `GET /ai-interactions` with example responses
- Database: In-memory SQLite, no setup required
- CSV format: Expects `data/Movielist.csv` with `;` separator

- [ ] **Step 2: Write `AI_INTERACTIONS.md`**

Document all LLM tool calls and skills used during development. Include:
- Skill: `superpowers:brainstorming` — to plan the API architecture
- Skill: `superpowers:writing-plans` — to create the implementation plan
- Tool: `Agent` (if used) — for code generation or review
- List any Bash commands, reads, edits, writes, or other tool calls made
- Format as a markdown list or table with timestamp, tool/skill name, purpose, and brief notes

Example:
```
## LLM Interactions Log

### Skills Used
- **superpowers:brainstorming** (2026-10-22): Planned API design and identified data structure for producer intervals
- **superpowers:writing-plans** (2026-10-22): Created implementation plan with 8 tasks and file structure

### Tool Calls
- **Agent (subagent-driven-development)**: Implement tasks 1-8 sequentially with independent review
- **Bash**: npm install, npm test, npm start
- **Read**: Movielist.csv to understand data format
- **Write**: Created all source files and tests
```

- [ ] **Step 3: Verify README can be followed from scratch**

Open a new terminal, clone/copy the repo, follow README steps, verify build and test work.

- [ ] **Step 4: Commit**

```bash
git add README.md AI_INTERACTIONS.md
git commit -m "docs: add README and AI interaction log"
```

---

## Self-Review

**Spec coverage:**
- ✅ Read CSV and insert into database on startup (Task 3)
- ✅ Implement REST endpoint for producer intervals (Tasks 4, 6)
- ✅ Implement REST endpoint for AI interactions (Tasks 5, 6)
- ✅ SQLite in-memory, no external setup (Task 2)
- ✅ Integration tests with real CSV data (Task 7)
- ✅ README with build/run/test instructions (Task 8)
- ✅ Documentation of AI interactions (Task 8)
- ✅ Express/REST Level 2 (Tasks 1, 6)

**Step scan:** Each step is unambiguous and produces a checkable result. No step carries code a signature and test already determine.

**Type consistency:** All function names and signatures are consistent across tasks. Database column types match usage (INTEGER for year and winner, TEXT for strings).

**Review Focus:** All five input classes covered:
1. Multiple producers per record → Task 3 (CSV loader splits by `, `)
2. Single win per producer → Task 4 (logic skips producers with <2 wins)
3. Invalid year → Task 3 (validate year is integer before insert)
4. Interval off-by-one → Task 7 (test verifies interval of 1 year = 1 day, not 0)
5. AI logging errors → Task 5 (silent error handling)

**Proportion:** Plan length is appropriate for the scope; code blocks show signatures and test structure, not full implementations.
