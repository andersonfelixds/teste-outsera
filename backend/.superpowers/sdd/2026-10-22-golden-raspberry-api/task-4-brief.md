# Task 4: Producer Interval Analysis Service

**Position in project:** Business logic — core algorithm to analyze award intervals between consecutive producer wins.

**Files to create:**
- Create: `src/services/producerService.js`

**What this task produces:**

Export function `getProducerIntervals(db)` that:
- Queries `movies` table for all (producer, year) pairs where `winner = 1`
- Groups by producer and sorts by year ascending
- For each producer with 2 or more wins:
  - Calculate intervals between consecutive wins
  - Example: wins in [2000, 2001, 2005] → intervals [1, 4]
- Collect all intervals across all producers
- Find the minimum and maximum intervals
- Return object: `{ min: [...], max: [...] }`
  - Each item: `{ producer: string, interval: number, previousWin: number, followingWin: number }`
  - `min` array: all intervals equal to the global minimum, sorted by interval ascending
  - `max` array: all intervals equal to the global maximum, sorted by interval descending

**Example logic:**

If producers have these wins:
- "A": [2000, 2001, 2005] → intervals: [1 (2000→2001), 4 (2001→2005)]
- "B": [1990, 2000] → intervals: [10 (1990→2000)]

Global min = 1, max = 10

Return:
```json
{
  "min": [
    { "producer": "A", "interval": 1, "previousWin": 2000, "followingWin": 2001 }
  ],
  "max": [
    { "producer": "B", "interval": 10, "previousWin": 1990, "followingWin": 2000 }
  ]
}
```

**Global Constraints:**
- Interval between consecutive wins (e.g., 2008 and 2009) = 1 year, not 0
- Producers with only 1 win are skipped (no consecutive intervals)
- ES modules

**Dependencies:**
- Consumes: `database.js` from Task 2 (for database connection)
- Consumes: `movies` table schema from Task 2 (year INTEGER, producer TEXT, winner INTEGER)
- Produces: Used by Task 6 (routes)

**Steps:**

1. Create `src/services/producerService.js` with `getProducerIntervals(db)` function
2. Function must:
   - Query all rows where `winner = 1`, group by producer, sort by year
   - For each producer with 2+ wins, calculate consecutive intervals
   - Track global min and max
   - Return `{ min: [...], max: [...] }` with correct structure
3. Test manually: Create sample data with known intervals and verify output
4. Do NOT commit yet — code ready for validation

**Testing:**
- Verify min/max calculation is correct
- Verify interval calculation (2008→2009 = 1, not 0)
- Verify producers with 1 win are excluded
