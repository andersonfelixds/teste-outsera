# Task 6: REST Routes and Endpoints

**Position in project:** API routes — exposes the business logic (producer intervals and AI interactions) via REST endpoints.

**Files to create/modify:**
- Create: `src/routes/awardsRoutes.js`
- Create: `src/routes/aiRoutes.js`
- Modify: `src/app.js` (to register routes)

**What this task produces:**

1. **awardsRoutes.js** — Express router that:
   - Exports a router (using `Router()`)
   - Route: `GET /producers/intervals`
   - Handler calls `getProducerIntervals(db)` from producerService
   - Returns status 200 with JSON body matching spec:
     ```json
     {
       "min": [
         { "producer": "...", "interval": ..., "previousWin": ..., "followingWin": ... }
       ],
       "max": [
         { "producer": "...", "interval": ..., "previousWin": ..., "followingWin": ... }
       ]
     }
     ```

2. **aiRoutes.js** — Express router that:
   - Exports a router (using `Router()`)
   - Route: `GET /`
   - Handler calls `getAIInteractions(db)` from aiInteractionService
   - Returns status 200 with JSON body:
     ```json
     {
       "interactions": [
         { "id": ..., "timestamp": "...", "tool_name": "...", "skill_name": "...", "prompt": "...", "result": "..." }
       ]
     }
     ```

3. **Modify src/app.js** to:
   - Import both route modules
   - Register awardsRoutes at `/awards` (so full path is `/awards/producers/intervals`)
   - Register aiRoutes at `/ai` (so full path is `/ai/`)
   - Both routes should have access to `db` from app.locals

**Global Constraints:**
- REST Level 2 (resource-oriented URIs, HTTP methods)
- Status codes: 200 for success
- JSON responses only
- Database connection passed via `app.locals.db` or similar mechanism

**Dependencies:**
- Consumes: `producerService.getProducerIntervals()` from Task 4
- Consumes: `aiInteractionService.getAIInteractions()` from Task 5
- Consumes: database connection from Task 2
- Produces: Complete API endpoints used by tests and clients

**Steps:**

1. Create `src/routes/awardsRoutes.js` with router and GET `/producers/intervals` handler
2. Create `src/routes/aiRoutes.js` with router and GET `/` handler
3. Update `src/app.js` to import and register routes
4. Test manually with curl:
   ```bash
   curl http://localhost:3000/awards/producers/intervals
   curl http://localhost:3000/ai/
   ```
5. Verify responses match JSON spec
6. Do NOT commit yet — code ready for validation

**Testing:**
- Endpoints accessible at correct URLs
- Responses have correct JSON structure
- Status code 200 for both
