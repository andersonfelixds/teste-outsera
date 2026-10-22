# Task 7 Report: Integration Tests

## tests/integration/setup.js
```js
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { initializeDatabase } from '../../src/database.js';
import { loadMoviesFromCSV } from '../../src/services/csvLoader.js';
import awardsRoutes from '../../src/routes/awardsRoutes.js';
import aiRoutes from '../../src/routes/aiRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH = path.resolve(__dirname, '../../data/Movielist.csv');

// Cria um app novo com banco em memória próprio e o CSV carregado.
// O banco fica acessível em app.locals.db.
export function getTestApp() {
  const db = initializeDatabase();
  loadMoviesFromCSV(db, CSV_PATH);

  const app = express();
  app.use(express.json());
  app.locals.db = db;
  app.use('/awards', awardsRoutes);
  app.use('/ai', aiRoutes);
  return app;
}
```

## tests/integration/awards.test.js
```js
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
```

## tests/integration/aiInteractions.test.js
```js
import request from 'supertest';
import { getTestApp } from './setup.js';
import { logAIInteraction } from '../../src/services/aiInteractionService.js';

describe('GET /ai/', () => {
  test('retorna lista vazia quando nada foi registrado', async () => {
    const res = await request(getTestApp()).get('/ai/');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ interactions: [] });
  });

  test('retorna a interação registrada', async () => {
    const app = getTestApp();
    logAIInteraction(app.locals.db, 'Claude Code', 'brainstorming', 'meu prompt', 'meu resultado');
    const res = await request(app).get('/ai/');
    expect(res.body.interactions).toHaveLength(1);
    expect(res.body.interactions[0]).toMatchObject({
      tool_name: 'Claude Code',
      skill_name: 'brainstorming',
      prompt: 'meu prompt',
      result: 'meu resultado',
    });
  });

  test('timestamp está em formato ISO 8601', async () => {
    const app = getTestApp();
    logAIInteraction(app.locals.db, 't', 's', 'p', 'r');
    const res = await request(app).get('/ai/');
    expect(res.body.interactions[0].timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  test('ordem cronológica reversa (mais nova primeiro)', async () => {
    const app = getTestApp();
    const db = app.locals.db;
    logAIInteraction(db, 't', 's', 'primeiro', 'r');
    await new Promise((r) => setTimeout(r, 5));
    logAIInteraction(db, 't', 's', 'segundo', 'r');
    await new Promise((r) => setTimeout(r, 5));
    logAIInteraction(db, 't', 's', 'terceiro', 'r');
    const res = await request(app).get('/ai/');
    expect(res.body.interactions.map((i) => i.prompt)).toEqual(['terceiro', 'segundo', 'primeiro']);
  });
});
```

## Saída de npm test
```

> golden-raspberry-api@1.0.0 test
> NODE_OPTIONS=--experimental-vm-modules jest

(node:1394524) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:1394525) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

Test Suites: 2 passed, 2 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        1.923 s
Ran all test suites.
```

## Resultados
2 suites, 10 testes, 10 passaram, 0 falharam (o Jest não rodou em modo verbose, então a saída só mostra os totais).

awards.test.js (6): retorna as chaves min e max; cada item de min tem producer/interval/previousWin/followingWin; min[0] tem o menor intervalo; max[0] tem o maior intervalo; todo intervalo >= 1 e coerente com os anos; produtores com 1 vitória não aparecem em min nem max.

aiInteractions.test.js (4): lista vazia; retorna a interação registrada; timestamp ISO 8601; ordem reversa (mais nova primeiro).

## Concerns e desvios
- src/app.js cria o banco e carrega o CSV no momento do import (singleton), então não serve para "banco novo por teste". getTestApp() monta um app novo com initializeDatabase + loadMoviesFromCSV + as mesmas rotas, sem alterar src/. O banco fica em app.locals.db (usado no teste de produtor com 1 vitória e para logar interações).
- O teste de ordem reversa usa setTimeout de 5ms entre inserções para garantir timestamps distintos. O service também desempata por id DESC.
- Teste 5 também confere followingWin - previousWin === interval (acréscimo ao brief).
- Teste 6 compara com a contagem de anos distintos de vitória por produtor direto no banco.
- Não foi feito commit.

## Resumo
10/10 testes de integração passando (6 awards, 4 ai) com banco em memória novo por teste.
