# Task 7: Integration Tests

**Position in project:** Testing — verifies that CSV loads correctly, data is persisted, and API endpoints return correct data.

**Files to create:**
- Create: `tests/integration/setup.js`
- Create: `tests/integration/awards.test.js`
- Create: `tests/integration/aiInteractions.test.js`

**What this task produces:**

1. **tests/integration/setup.js** — Jest setup utility that:
   - Exports function `getTestApp()` that:
     - Creates fresh in-memory database
     - Loads CSV data (data/Movielist.csv)
     - Returns initialized Express app

2. **tests/integration/awards.test.js** — Test suite for awards endpoint:
   - Test 1: Load CSV via getTestApp(), call GET `/awards/producers/intervals`, verify response has `min` and `max` keys
   - Test 2: Verify each object in `min` has all required fields: `producer`, `interval`, `previousWin`, `followingWin`
   - Test 3: Verify `min[0]` has the smallest interval (or tied for smallest)
   - Test 4: Verify `max[0]` has the largest interval
   - Test 5: Verify interval is >= 1 (no zero or negative intervals)
   - Test 6: Verify producers with only 1 win don't appear in min or max

   Run tests with `npm test`

3. **tests/integration/aiInteractions.test.js** — Test suite for AI interactions endpoint:
   - Test 1: Call GET `/ai/` on fresh app (no interactions logged), verify returns `{ "interactions": [] }`
   - Test 2: Manually log an AI interaction using aiInteractionService, call GET `/ai/`, verify interaction appears in response
   - Test 3: Verify timestamp is ISO 8601 format (regex: `^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}`)
   - Test 4: Verify interactions returned in reverse chronological order (newest first)

**Global Constraints:**
- Testing framework: Jest
- Integration tests only (no unit tests, no mocks of database)
- Each test uses fresh in-memory database via getTestApp()
- Use `supertest` for HTTP calls to app
- No external database required

**Dependencies:**
- Consumes: All prior tasks (app.js, database.js, services, routes)
- Produces: Test suite that validates entire system

**Steps:**

1. Create `tests/integration/setup.js` with `getTestApp()` function
2. Create `tests/integration/awards.test.js` with 6 test cases
3. Create `tests/integration/aiInteractions.test.js` with 4 test cases
4. Run `npm test` — all tests should pass
5. Verify CSV loads and data persists correctly
6. Do NOT commit yet — code ready for validation

**Testing:**
- All integration tests pass
- No mocks or test doubles used
- Real CSV data loaded and tested
- API responses validated against spec

**Test data expectations:**
- CSV loads successfully (~343 rows with ~72 winners based on actual data)
- Min interval should be documented in test (or > 0)
- Max interval can vary based on data
