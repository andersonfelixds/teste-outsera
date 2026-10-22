# Task 2 Brief: API Service

## Context

Task 1 (Angular Project Setup) is complete and approved. The Angular project is scaffolded at `/home/devcodes/projetos/backend/front-end/` with proxy configured to route `/api/*` to `http://localhost:3000`.

This task creates the HTTP service that Task 3 (Main Component) will consume.

## Objective

Create an Angular service that calls the backend API endpoints with full type safety.

## Deliverables

**Files to create:**
- `/front-end/src/app/services/api.service.ts` — Service with type definitions and API methods

**Files to modify:**
- `/front-end/src/app/app.module.ts` — Import HttpClientModule

## Specification (from plan)

### Step 1: Create Type Definitions

In `/front-end/src/app/services/api.service.ts`, define these interfaces:

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

### Step 2: Create ApiService with HttpClient

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

### Step 3: Import HttpClientModule in app.module.ts

The app structure may use either AppModule or app.config.ts depending on Angular version. Ensure HttpClientModule is imported:

- If using traditional AppModule (`app.module.ts` exists): add `HttpClientModule` to the imports array
- If using standalone components (Angular 14+): import in `app.config.ts` via `provideHttpClient()`

### Step 4: Test service manually

Run `ng serve` (if not running) and open http://localhost:4200.

In browser DevTools console, test the service:
```typescript
// The service is auto-injected; test via the page's injector:
import { inject } from '@angular/core';
const api = inject(ApiService);
api.getProducerIntervals().subscribe(console.log);
api.getAIInteractions().subscribe(console.log);
```

Expected: Both calls succeed. First returns `{ min: [...], max: [...] }` with producer data. Second returns `{ interactions: [] }` (empty initially, which is correct).

## Key Decisions Made (from plan review)

1. **Service provided at root:** `@Injectable({ providedIn: 'root' })` means a single instance is available app-wide. No need for manual module declarations.
2. **API URLs:** Both calls use the `/api/*` prefix, which the proxy.conf.json strips before sending to the backend. So `/api/awards/producers/intervals` becomes `/awards/producers/intervals` at the backend.
3. **Response types:** All interfaces match the backend API exactly, from `/home/devcodes/projetos/backend/README.md` examples.

## Review Focus (from plan)

This task covers **Review Focus item 4: Type safety**. The service defines all interfaces upfront, preventing runtime errors from undefined properties.

## Success Criteria

- [ ] Interfaces defined and exported from api.service.ts
- [ ] ApiService class created with two methods (getProducerIntervals, getAIInteractions)
- [ ] HttpClientModule imported (app.module.ts or app.config.ts)
- [ ] `ng serve` runs without errors
- [ ] Manual test in console succeeds (both API calls return data)
- [ ] No TypeScript errors (`ng build` passes)
- [ ] Code committed (no commit until user validation, per project constraint)

## Notes

- No unit tests are required at this stage. Integration happens in Task 3.
- This service does not catch errors; that is Task 3's responsibility (error handling in the component).
- If app structure differs from plan (e.g., standalone components), adapt HttpClientModule import to match but preserve the service interface.
