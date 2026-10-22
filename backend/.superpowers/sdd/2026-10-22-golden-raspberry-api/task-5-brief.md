# Task 5: AI Interaction Logging Service

**Position in project:** Logging and observability — tracks all LLM tool calls and skills used during development.

**Files to create:**
- Create: `src/services/aiInteractionService.js`

**What this task produces:**

Export two functions:

1. **`logAIInteraction(db, toolName, skillName, prompt, result)`**
   - Inserts row into `ai_interactions` table
   - Fields:
     - `timestamp`: current time in ISO 8601 format
     - `tool_name`: name of the tool/skill (e.g., "Agent", "Bash", "Read", "Write")
     - `skill_name`: name of the skill used, if any (e.g., "brainstorming", "writing-plans")
     - `prompt`: the input prompt or command
     - `result`: the output or result
   - Non-blocking: wrap in try-catch, log errors to console but do NOT throw
   - Returns: inserted row id (or null if failed)

2. **`getAIInteractions(db)`**
   - Queries all rows from `ai_interactions` table
   - Returns array sorted by timestamp descending (newest first)
   - Each item: `{ id, timestamp, tool_name, skill_name, prompt, result }`

**Example usage:**

```javascript
logAIInteraction(db, 'Agent', 'brainstorming', 'plan API', 'response...', null);
const interactions = getAIInteractions(db);
// interactions = [{ id: 1, timestamp: "2026-10-22T16:00:00Z", tool_name: "Agent", skill_name: "brainstorming", ... }]
```

**Global Constraints:**
- Timestamp format: ISO 8601
- Non-blocking logging (errors logged, not thrown)
- ES modules

**Dependencies:**
- Consumes: `database.js` from Task 2 (database connection)
- Consumes: `ai_interactions` table schema from Task 2
- Produces: Used by Task 6 (routes)

**Steps:**

1. Create `src/services/aiInteractionService.js` with both functions
2. `logAIInteraction` must:
   - Get current timestamp in ISO 8601 format
   - Insert row into `ai_interactions` table
   - Wrap in try-catch; log errors to console.error but do NOT throw
   - Return inserted id
3. `getAIInteractions` must:
   - Query all rows from `ai_interactions`
   - Sort by timestamp descending
   - Return array of objects
4. Test manually: Log an interaction, retrieve it, verify timestamp format
5. Do NOT commit yet — code ready for validation

**Testing:**
- Verify logging works without errors
- Verify timestamp is ISO 8601
- Verify retrieval returns interactions in correct order
