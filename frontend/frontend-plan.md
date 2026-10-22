# Golden Raspberry Awards Frontend — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a simple Angular frontend that displays Golden Raspberry Awards producer intervals (min/max consecutive win gaps) and AI interaction history.

**Architecture:** Single Angular project using `ng new`, with one service (HttpClient) consuming the backend API at localhost:3000, and one main component displaying results in simple tables/cards. Proxy configuration forwards API calls to the backend.

**Tech Stack:** Angular (latest), TypeScript, HttpClientModule, proxy.conf.json for local development.

**Spec:** Golden Raspberry Awards frontend consuming two API endpoints: GET /awards/producers/intervals and GET /ai/.

## Global Constraints

- Use `ng new golden-raspberry-front` to scaffold the project
- Frontend runs on localhost:4200 (ng default)
- Backend runs on localhost:3000
- All API calls proxied via proxy.conf.json in development
- ES modules, TypeScript strict mode
- No heavy styling required (simple, clean UI)
- Documentation in `/front-end/README.md` and root `README.md`

## Review Focus

1. **Proxy misconfiguration** — Proxy not routing API calls to :3000, resulting in 404 or CORS errors. Tests should verify API calls succeed.
2. **Empty API responses** — GET /ai/ returns empty interactions array. Component should display gracefully (empty state message).
3. **Missing error handling** — Network error (backend down) crashes component. Should catch and display error message.
4. **Type safety** — Response objects from API not typed in Angular service, leading to runtime errors. Service should define interfaces matching API responses.
5. **Component initialization timing** — Data loaded before component fully initializes. Should use OnInit and safe navigation operator.

---

## File Structure

```
/front-end/ (new Angular project)
├── src/
│   ├── app/
│   │   ├── services/
│   │   │   └── api.service.ts          # HttpClient service for backend API
│   │   ├── app.component.ts             # Main component (intervals + history)
│   │   ├── app.component.html
│   │   └── app.module.ts                # HttpClientModule imported
│   ├── proxy.conf.json                  # Routes /api/* to :3000
│   └── main.ts
├── angular.json                         # Modified to use proxy.conf.json
├── package.json
└── README.md                             # Setup and usage instructions

Root README.md updated with frontend section
```

---

## Task 1: Angular Project Setup

**Files:**
- Create: `/front-end/` directory with `ng new golden-raspberry-front`
- Create: `/front-end/src/proxy.conf.json`
- Modify: `/front-end/angular.json` (proxyConfig)
- Create: `/front-end/README.md`
- Modify: `/README.md` (root, add frontend section)

**Interfaces:**
- Produces: Runnable Angular project with proxy configured to forward /api/* to localhost:3000

- [ ] **Step 1: Generate Angular project**

Run: `ng new golden-raspberry-front --routing=false --style=css`

Expected: Project created in `/front-end/` with package.json, angular.json, src/ directory.

- [ ] **Step 2: Create proxy configuration**

Create `/front-end/src/proxy.conf.json`:
```json
{
  "/api/*": {
    "target": "http://localhost:3000",
    "pathRewrite": { "^/api": "" },
    "changeOrigin": true
  }
}
```

- [ ] **Step 3: Update angular.json to use proxy**

In `/front-end/angular.json`, under `projects.golden-raspberry-front.architect.serve.options`, add:
```json
"proxyConfig": "src/proxy.conf.json"
```

- [ ] **Step 4: Verify project runs**

Run: `cd front-end && npm start`

Expected: Application running on http://localhost:4200 with no errors.

- [ ] **Step 5: Create frontend README.md**

File: `/front-end/README.md`

Include:
- Project description (frontend for Golden Raspberry Awards API)
- Prerequisites (Node.js, npm)
- Installation: `npm install` (from /front-end directory)
- Running: `npm start` (starts on :4200 with proxy to :3000)
- Building: `npm run build`
- API endpoints consumed (GET /awards/producers/intervals, GET /ai/)
- Project structure (brief overview of components)

- [ ] **Step 6: Update root README.md**

Add section to `/README.md` (at root):

```markdown
## Frontend

A simple Angular application in `/front-end/` consumes the API endpoints and displays producer award intervals.

### Quick Start

```bash
cd front-end
npm install
npm start
```

Frontend runs on `http://localhost:4200`. Make sure the backend is running on `localhost:3000`.

See [frontend/README.md](front-end/README.md) for details.
```

- [ ] **Step 7: Commit**

```bash
git add front-end/ README.md
git commit -m "setup: initialize Angular frontend project with proxy configuration"
```

---

## Task 2: API Service

**Files:**
- Create: `/front-end/src/app/services/api.service.ts`
- Modify: `/front-end/src/app/app.module.ts` (import HttpClientModule)

**Interfaces:**
- Consumes: HttpClientModule (Angular built-in)
- Produces:
  - `ApiService` class with methods:
    - `getProducerIntervals()` → returns Observable<ProducerIntervalsResponse>
    - `getAIInteractions()` → returns Observable<AIInteractionsResponse>
  - Type definitions:
    - `ProducerIntervalsResponse` { min: ProducerInterval[], max: ProducerInterval[] }
    - `ProducerInterval` { producer: string, interval: number, previousWin: number, followingWin: number }
    - `AIInteractionsResponse` { interactions: AIInteraction[] }
    - `AIInteraction` { id: number, timestamp: string, tool_name: string, skill_name: string, prompt: string, result: string }

- [ ] **Step 1: Create type definitions**

File: `/front-end/src/app/services/api.service.ts`

Define interfaces:
```typescript
export interface ProducerInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface ProducerIntervalsResponse {
  min: ProducerInterval[];
  max: ProducerInterval[];
}

export interface AIInteraction {
  id: number;
  timestamp: string;
  tool_name: string;
  skill_name: string;
  prompt: string;
  result: string;
}

export interface AIInteractionsResponse {
  interactions: AIInteraction[];
}
```

- [ ] **Step 2: Create ApiService with HttpClient**

In same file, add:
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getProducerIntervals(): Observable<ProducerIntervalsResponse> {
    return this.http.get<ProducerIntervalsResponse>('/api/awards/producers/intervals');
  }

  getAIInteractions(): Observable<AIInteractionsResponse> {
    return this.http.get<AIInteractionsResponse>('/api/ai/');
  }
}
```

- [ ] **Step 3: Import HttpClientModule in AppModule**

File: `/front-end/src/app/app.module.ts`

Add to imports array:
```typescript
import { HttpClientModule } from '@angular/common/http';
// ...
imports: [BrowserModule, HttpClientModule]
```

- [ ] **Step 4: Test service manually**

Run: `ng serve` and in browser console:
```typescript
// Inject ApiService and test:
api.getProducerIntervals().subscribe(console.log);
api.getAIInteractions().subscribe(console.log);
```

Expected: Both calls succeed and return data (or empty interactions array).

- [ ] **Step 5: Commit**

```bash
git add src/app/services/api.service.ts src/app/app.module.ts
git commit -m "feat: add API service with typed endpoints"
```

---

## Task 3: Main Component (Intervals Display)

**Files:**
- Modify: `/front-end/src/app/app.component.ts`
- Modify: `/front-end/src/app/app.component.html`

**Interfaces:**
- Consumes: `ApiService` (from Task 2)
- Produces: App component displaying min/max producer intervals in tables

- [ ] **Step 1: Update app.component.ts**

File: `/front-end/src/app/app.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { ApiService, ProducerIntervalsResponse, AIInteractionsResponse } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  intervals: ProducerIntervalsResponse | null = null;
  aiInteractions: AIInteractionsResponse | null = null;
  loading = true;
  error: string | null = null;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    this.api.getProducerIntervals().subscribe({
      next: (data) => {
        this.intervals = data;
      },
      error: (err) => {
        this.error = 'Failed to load producer intervals';
        console.error(err);
        this.loading = false;
      }
    });

    this.api.getAIInteractions().subscribe({
      next: (data) => {
        this.aiInteractions = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
```

- [ ] **Step 2: Update app.component.html**

File: `/front-end/src/app/app.component.html`

```html
<div class="container">
  <h1>Golden Raspberry Awards</h1>
  <p>Producer Award Intervals Analysis</p>

  <button (click)="loadData()" [disabled]="loading">{{ loading ? 'Loading...' : 'Refresh' }}</button>

  <div *ngIf="error" class="error">{{ error }}</div>

  <div *ngIf="intervals">
    <h2>Minimum Interval Between Wins</h2>
    <table *ngIf="intervals.min.length > 0; else emptyMin">
      <thead>
        <tr>
          <th>Producer</th>
          <th>Interval (years)</th>
          <th>From Year</th>
          <th>To Year</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let item of intervals.min">
          <td>{{ item.producer }}</td>
          <td>{{ item.interval }}</td>
          <td>{{ item.previousWin }}</td>
          <td>{{ item.followingWin }}</td>
        </tr>
      </tbody>
    </table>
    <ng-template #emptyMin>
      <p><em>No data available</em></p>
    </ng-template>

    <h2>Maximum Interval Between Wins</h2>
    <table *ngIf="intervals.max.length > 0; else emptyMax">
      <thead>
        <tr>
          <th>Producer</th>
          <th>Interval (years)</th>
          <th>From Year</th>
          <th>To Year</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let item of intervals.max">
          <td>{{ item.producer }}</td>
          <td>{{ item.interval }}</td>
          <td>{{ item.previousWin }}</td>
          <td>{{ item.followingWin }}</td>
        </tr>
      </tbody>
    </table>
    <ng-template #emptyMax>
      <p><em>No data available</em></p>
    </ng-template>
  </div>

  <div *ngIf="aiInteractions">
    <h2>AI Interaction History</h2>
    <p *ngIf="aiInteractions.interactions.length === 0"><em>No interactions recorded yet</em></p>
    <div *ngFor="let interaction of aiInteractions.interactions" class="interaction-card">
      <p><strong>Tool:</strong> {{ interaction.tool_name }}</p>
      <p *ngIf="interaction.skill_name"><strong>Skill:</strong> {{ interaction.skill_name }}</p>
      <p><strong>Timestamp:</strong> {{ interaction.timestamp }}</p>
      <p><strong>Prompt:</strong> {{ interaction.prompt }}</p>
      <p><strong>Result:</strong> {{ interaction.result }}</p>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Add basic styling**

File: `/front-end/src/app/app.component.css`

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
}

h2 {
  color: #666;
  margin-top: 30px;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

table th, table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

table th {
  background-color: #f8f9fa;
  font-weight: bold;
}

table tr:hover {
  background-color: #f5f5f5;
}

.error {
  color: #d32f2f;
  padding: 10px;
  background-color: #ffebee;
  border-radius: 4px;
  margin-bottom: 20px;
}

.interaction-card {
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 4px;
  background-color: #fafafa;
}

.interaction-card p {
  margin: 5px 0;
  font-size: 14px;
}
```

- [ ] **Step 4: Test component in browser**

Run: `ng serve` (if not already running)

Open: http://localhost:4200

Expected:
- Page loads with title and "Refresh" button
- Click Refresh → tables populate with min/max intervals
- AI interactions section shows (empty if no data)

- [ ] **Step 5: Commit**

```bash
git add src/app/app.component.* 
git commit -m "feat: add main component displaying producer intervals and AI history"
```

---

## Task 4: Final Documentation Update

**Files:**
- Modify: Root `/README.md` (update frontend section with complete instructions)

**Interfaces:**
- Produces: Complete documentation for using the full system (backend + frontend)

- [ ] **Step 1: Update root README.md**

File: `/README.md` (at repository root)

Add/enhance the Frontend section:

```markdown
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
cd /home/devcodes/projetos/frontend  # or /front-end
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
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add complete frontend setup and usage instructions"
```

---

## Self-Review

**Spec coverage:**
- ✅ Angular project with `ng new` (Task 1)
- ✅ Proxy configuration for API calls (Task 1)
- ✅ API service with HttpClient (Task 2)
- ✅ Display min/max intervals in tables (Task 3)
- ✅ Display AI interactions (Task 3)
- ✅ Error handling (Task 3)
- ✅ Loading state (Task 3)
- ✅ Documentation in README (Tasks 1, 4)

**Step scan:** Each step is unambiguous and has a checkable result. No step carries code a signature already determines.

**Type consistency:** All service methods match component usage (getProducerIntervals returns Observable<ProducerIntervalsResponse>, etc.).

**Review Focus:** All five points covered:
1. Proxy misconfiguration → Task 1 (Step 3) verifies proxy.conf.json and angular.json
2. Empty API responses → Task 3 (Step 2) has ngIf checking array.length
3. Missing error handling → Task 3 (Step 1) has error.subscribe with error handler
4. Type safety → Task 2 (Step 1) defines all interfaces
5. Component initialization → Task 3 (Step 1) uses ngOnInit and null checks

**Proportion:** Plan is appropriate for scope; code blocks show signatures and structure, not full implementations.

---

Plan complete. Ready to implement with subagent-driven-development. All tasks are independent and can run sequentially with reviews between each.
