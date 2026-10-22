# Task 2: SQLite Database Setup and Schema

**Position in project:** Database initialization — creates the in-memory SQLite database and schema used by all subsequent tasks.

**Files to create:**
- Create: `src/database.js`

**What this task produces:**

Export function `initializeDatabase()` that:
- Returns a `better-sqlite3` connection to an in-memory database (`:memory:`)
- Creates two tables on first call:
  - `movies(id INTEGER PRIMARY KEY, year INTEGER, title TEXT, studios TEXT, producer TEXT, winner INTEGER)`
  - `ai_interactions(id INTEGER PRIMARY KEY, timestamp TEXT, tool_name TEXT, skill_name TEXT, prompt TEXT, result TEXT)`
- Winner column must be INTEGER (0 or 1), not TEXT

**Global Constraints:**
- Database: SQLite in-memory (`:memory:`), no external setup required
- ES modules

**Dependencies:**
- Consumes: `better-sqlite3` (installed in Task 1)

**Steps:**

1. Create `src/database.js` with `initializeDatabase()` function
2. Function must:
   - Import `Database` from `better-sqlite3`
   - Create in-memory DB with `new Database(':memory:')`
   - Create movies table with exact schema above
   - Create ai_interactions table with exact schema above
   - Return the db connection
3. Test manually: `node -e "import { initializeDatabase } from './src/database.js'; const db = initializeDatabase(); console.log(db.prepare('SELECT 1').get());"`
   - Expected output: `{ "1": 1 }`
4. Do NOT commit yet — code ready for validation

**Testing:**
- Verify function returns usable database connection
- Verify both tables exist after initialization
