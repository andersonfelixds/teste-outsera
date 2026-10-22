# Task 3 Brief: Main Component (Intervals Display)

## Context

Tasks 1 and 2 are complete:
- Angular project at `/home/devcodes/projetos/backend/front-end/` with proxy configured
- ApiService created at `src/app/services/api.service.ts` with typed endpoints

This task builds the UI that displays the API data: producer intervals (min/max) in tables and AI interaction history in cards.

## Objective

Create an Angular component that loads and displays Golden Raspberry Awards data with proper error handling, loading state, and empty-state handling.

## Deliverables

**Files to modify:**
- `/front-end/src/app/app.component.ts` — Component logic (load data, handle errors)
- `/front-end/src/app/app.component.html` — Template (tables, cards, refresh button)

**Files to modify (optional):**
- `/front-end/src/app/app.component.css` — Styling (if needed)

## Specification (from plan)

### Step 1: Update app.component.ts

File: `/front-end/src/app/app.component.ts`

Replace or update the component with this code:

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

**Key points:**
- Implements `OnInit` (Review Focus item 5: component initialization timing)
- Properties: `intervals`, `aiInteractions`, `loading`, `error`
- `ngOnInit()` calls `loadData()` on startup
- `loadData()` calls both API endpoints
- Error handler logs and sets `error` message for intervals (and `loading = false` for both)
- Loading state managed by boolean flag

### Step 2: Update app.component.html

File: `/front-end/src/app/app.component.html`

Replace the existing content with:

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

**Key points:**
- Button to manually refresh data (calls `loadData()`, disabled during loading)
- Error display: `*ngIf="error"` shows error message (Review Focus item 3: error handling)
- Two tables: min and max producer intervals
- Empty-state templates (`*ngIf="intervals.min.length > 0; else emptyMin"`) handle when no data exists (Review Focus item 2)
- AI interactions displayed as cards (one per interaction)
- Safe navigation: all properties checked for existence (`intervals?.`, `*ngIf="aiInteractions"`) or array length

### Step 3: Add Basic Styling (Optional)

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

This is optional; if styling is already in place from the scaffold or Task 1, you may enhance or skip.

## Review Focus Coverage

This task addresses three Review Focus points:

1. **Empty API responses (item 2):** Template checks `intervals.min.length > 0` and `intervals.max.length > 0` before showing tables; alt templates show "No data available"
2. **Missing error handling (item 3):** Component catches API errors in the `.subscribe()` error handler and displays them to the user
3. **Component initialization timing (item 5):** Component implements `OnInit`, calls `loadData()` in ngOnInit, uses null checks (`*ngIf="intervals"`) and safe navigation

## Success Criteria

- [ ] app.component.ts updated with OnInit, loadData(), error handling, and Observable subscriptions
- [ ] app.component.html template renders without errors
- [ ] Refresh button works (calls loadData() when clicked)
- [ ] Tables display min/max intervals correctly
- [ ] Empty-state messages appear when arrays are empty
- [ ] Error message displays if API fails
- [ ] Loading state shows while data is loading
- [ ] `ng serve` runs without errors
- [ ] `ng build` passes with no TypeScript errors
- [ ] Open http://localhost:4200 in browser and verify UI appears (tables, cards, refresh button)

## Test Plan

1. Ensure backend is running on `localhost:3000` (or mock it somehow)
2. Run `ng serve` in `/front-end` directory
3. Open http://localhost:4200 in browser
4. Verify:
   - Page loads with title "Golden Raspberry Awards"
   - Refresh button is visible and enabled
   - If backend is reachable: tables populate with producer data, or AI interactions section shows
   - If backend is down: error message appears
   - Click Refresh: data reloads, loading state shows briefly

## Notes

- This task does not require unit tests. Visual verification in browser is sufficient.
- Do not commit. User will validate and authorize commits later.
- The API calls assume both endpoints return successfully. Error handling is in place but not exhaustively tested (that is integration work, not in this scope).
