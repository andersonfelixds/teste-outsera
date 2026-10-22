# Task 3: CSV Loader and Data Insertion

**Position in project:** Initialization logic — loads the CSV file on app startup and populates the database.

**Files to create/modify:**
- Create: `src/services/csvLoader.js`
- Create: `src/app.js`

**What this task produces:**

1. **csvLoader.js** exports function `loadMoviesFromCSV(db, filePath)` that:
   - Reads CSV file from filePath
   - Uses `csv-parse` with delimiter `;` and `columns: true` option
   - For each row:
     - Validate `year` is an integer (skip or throw if invalid)
     - Split `producers` field by `, ` (comma-space separator)
     - For each producer name, insert one row into `movies` table with:
       - `year`: parsed as integer
       - `title`: from CSV
       - `studios`: from CSV
       - `producer`: individual producer name (split)
       - `winner`: 1 if `winner === 'yes'`, else 0
   - Return count of inserted rows

2. **app.js** initializes Express app that:
   - Imports and calls `initializeDatabase()` from `src/database.js`
   - Calls `loadMoviesFromCSV(db, './data/Movielist.csv')` to load data on startup
   - Sets up Express app (routes will be added in Task 6)
   - Exports the app (so it can be used by tests and server)

**Global Constraints:**
- CSV separator: `;` (semicolon)
- Producers field may contain multiple names separated by `, ` (comma-space)
- Winner indicator: `yes` for winners, empty for non-winners
- ES modules

**Dependencies:**
- Consumes: `database.js` from Task 2 (initializeDatabase function)
- Consumes: `csv-parse` (installed in Task 1)
- Produces: Both functions used by Task 4+ and tests

**CSV file location:** `./data/Movielist.csv` (already provided by user)

**Steps:**

1. Create `src/directory`  (if not exists)
2. Create `src/services/csvLoader.js` with `loadMoviesFromCSV(db, filePath)` function
3. Create `src/app.js` that initializes Express and loads CSV
4. Test manually: `node -e "import { initializeDatabase } from './src/database.js'; import { loadMoviesFromCSV } from './src/services/csvLoader.js'; const db = initializeDatabase(); const count = loadMoviesFromCSV(db, './data/Movielist.csv'); console.log('Rows inserted:', count);"`
   - Expected: Should print row count without error (expect ~200+ rows since CSV has multiple winners with multiple producers)
5. Do NOT commit yet — code ready for validation

**Testing:**
- CSV loads without errors
- Row count > 0
- Data insertion works correctly
- Producers field is properly split
