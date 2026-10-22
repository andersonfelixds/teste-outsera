import request from 'supertest';
import { getTestApp } from './setup.js';

async function fetchIntervals(app) {
  const res = await request(app).get('/awards/producers/intervals');
  expect(res.status).toBe(200);
  return res.body;
}

describe('GET /awards/producers/intervals', () => {
  test('retorna as chaves min e max', async () => {
    const body = await fetchIntervals(getTestApp());
    expect(body).toHaveProperty('min');
    expect(body).toHaveProperty('max');
    expect(Array.isArray(body.min)).toBe(true);
    expect(Array.isArray(body.max)).toBe(true);
    expect(body.min.length).toBeGreaterThan(0);
    expect(body.max.length).toBeGreaterThan(0);
  });

  test('cada item de min tem producer, interval, previousWin e followingWin', async () => {
    const { min } = await fetchIntervals(getTestApp());
    for (const item of min) {
      expect(item).toHaveProperty('producer');
      expect(item).toHaveProperty('interval');
      expect(item).toHaveProperty('previousWin');
      expect(item).toHaveProperty('followingWin');
    }
  });

  test('min[0] tem o menor intervalo (ou empatado)', async () => {
    const { min, max } = await fetchIntervals(getTestApp());
    const smallest = Math.min(...min.map((i) => i.interval));
    expect(min[0].interval).toBe(smallest);
    expect(min[0].interval).toBeLessThanOrEqual(max[0].interval);
  });

  test('max[0] tem o maior intervalo', async () => {
    const { min, max } = await fetchIntervals(getTestApp());
    const largest = Math.max(...max.map((i) => i.interval));
    expect(max[0].interval).toBe(largest);
    expect(max[0].interval).toBeGreaterThanOrEqual(min[0].interval);
  });

  test('todo intervalo é >= 1 e coerente com os anos', async () => {
    const { min, max } = await fetchIntervals(getTestApp());
    for (const item of [...min, ...max]) {
      expect(item.interval).toBeGreaterThanOrEqual(1);
      expect(item.followingWin - item.previousWin).toBe(item.interval);
    }
  });

  test('produtores com apenas 1 vitória não aparecem em min nem em max', async () => {
    const app = getTestApp();
    const { min, max } = await fetchIntervals(app);
    const rows = app.locals.db
      .prepare(
        `SELECT producer FROM movies WHERE winner = 1
         GROUP BY producer HAVING COUNT(DISTINCT year) = 1`
      )
      .all();
    const singleWinners = new Set(rows.map((r) => r.producer));
    expect(singleWinners.size).toBeGreaterThan(0);
    for (const item of [...min, ...max]) {
      expect(singleWinners.has(item.producer)).toBe(false);
    }
  });
});
