# Golden Raspberry Awards API

A RESTful API that reads a CSV file of Golden Raspberry Awards (Razzies) nominees and winners, and works out which producers had the shortest and the longest gap between two consecutive wins.

## Prerequisites

- Node.js 18 or later (Express 5 requires it; the test suite was run on Node 22)
- npm (ships with Node.js)

## Installation

```bash
npm install
```

## Running the app

```bash
npm start
```

The `start` script runs `node src/server.js` and is meant to serve the API on port 3000. See the note under "Known limitations" about this entry point.

## Running the tests

```bash
npm test
```

This runs the Jest integration tests (Supertest against the Express app). At the time of writing: 2 suites, 10 tests, all passing.

## API endpoints

### `GET /awards/producers/intervals`

Returns the producers with the minimum and the maximum interval between two consecutive wins. If several producers tie for the minimum or the maximum, all of them are listed. If no producer has two or more wins, both lists are empty.

Example response (produced by the app with the bundled `data/Movielist.csv`):

```json
{
  "min": [
    {
      "producer": "Bo Derek",
      "interval": 6,
      "previousWin": 1984,
      "followingWin": 1990
    }
  ],
  "max": [
    {
      "producer": "Matthew Vaughn",
      "interval": 13,
      "previousWin": 2002,
      "followingWin": 2015
    }
  ]
}
```

### `GET /ai/`

Returns the AI interaction history stored by the API, newest first. Each record has `id`, `timestamp` (ISO 8601), `tool_name`, `skill_name`, `prompt` and `result`.

Example response when nothing has been recorded yet (this is what a freshly started app returns):

```json
{
  "interactions": []
}
```

Example response with one recorded interaction (illustrative values):

```json
{
  "interactions": [
    {
      "id": 1,
      "timestamp": "2026-10-22T12:00:00.000Z",
      "tool_name": "Claude Code",
      "skill_name": "brainstorming",
      "prompt": "Plan the API design",
      "result": "Design approved"
    }
  ]
}
```

For the human-readable log of the AI tools used to build this project, see [AI_INTERACTIONS.md](AI_INTERACTIONS.md).

## Database

The API uses an in-memory SQLite database (`better-sqlite3`). There is nothing to install or configure. The database is created when the app starts, filled from the CSV, and discarded when the app stops, so any AI interaction recorded at runtime is lost on restart.

## CSV format

The app loads `data/Movielist.csv` at startup.

- Separator: `;`
- Header: `year;title;studios;producers;winner`
- The `producers` column may list several producers separated by `, `. Each producer is stored separately and counted individually.
- `winner` is `yes` for winners and empty otherwise.
- An invalid (non-numeric) year makes the load fail with an error.

Example:

```
year;title;studios;producers;winner
1980;Can't Stop the Music;Associated Film Distribution;Allan Carr;yes
1980;Cruising;Lorimar Productions, United Artists;Jerry Weintraub;
```

## Project structure

```
data/
  Movielist.csv              Source data
src/
  app.js                     Express app: creates the database, loads the CSV, mounts routes
  database.js                In-memory SQLite setup and table creation
  routes/
    awardsRoutes.js          /awards routes
    aiRoutes.js              /ai routes
  services/
    csvLoader.js             Reads and parses the CSV into the database
    producerService.js       Computes the min/max win intervals
    aiInteractionService.js  Stores and lists AI interactions
tests/
  integration/
    setup.js                 Shared test app setup
    awards.test.js           Tests for the intervals endpoint
    aiInteractions.test.js   Tests for the AI history endpoint
```

## Known limitations

- `package.json` points `npm start` to `src/server.js`, but that file does not exist in the repository yet. `src/app.js` only exports the app and never calls `listen`, so `npm start` will fail until a small entry point is added. The tests are not affected, because they use the exported app directly.
- Nothing in the app writes to the AI interaction history on its own, so `GET /ai/` returns an empty list until something calls the logging service.

## Frontend (Angular)

A simple Angular application displays producer award intervals and AI interaction history.

### Prerequisites

- Node.js 18+ (for backend)
- Node.js for frontend (same or newer version)
- Backend running on `localhost:3000`

### Quick Start

**Terminal 1 - Start the backend:**
```bash
cd /home/devcodes/projetos/backend
npm install
npm start
```

**Terminal 2 - Start the frontend:**
```bash
cd /home/devcodes/projetos/backend/front-end
npm install
npm start
```

Open http://localhost:4200 in your browser.

### Project Structure

- `/backend/` — Node.js/Express API (port 3000)
- `/front-end/` — Angular frontend (port 4200)
  - `src/app/services/api.service.ts` — HTTP client for API
  - `src/app/app.component.*` — Main UI component
  - `src/proxy.conf.json` — Dev proxy routing

### How It Works

1. Frontend loads on startup
2. Calls `GET /api/awards/producers/intervals` to fetch producer award intervals
3. Displays min/max intervals in tables
4. Calls `GET /api/ai/` to fetch AI interaction history (if any)
5. User can click "Refresh" to reload data

### Building for Production

```bash
cd front-end
npm run build
```

Output in `dist/golden-raspberry-front/`.

### Troubleshooting

- **Frontend can't reach backend:** Ensure backend is running on port 3000 and proxy.conf.json is correct
- **Empty AI interactions:** Nothing has logged interactions yet; this is expected
- **CORS errors:** Proxy routing may be misconfigured; check src/proxy.conf.json
