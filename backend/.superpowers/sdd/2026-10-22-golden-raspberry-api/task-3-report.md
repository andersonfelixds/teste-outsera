# Task 3 Report: CSV Loader e app.js

## 1. src/services/csvLoader.js
```js
import fs from 'node:fs';
import { parse } from 'csv-parse/sync';

export function loadMoviesFromCSV(db, filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const rows = parse(content, {
    delimiter: ';',
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  });

  const insert = db.prepare(
    'INSERT INTO movies (year, title, studios, producer, winner) VALUES (?, ?, ?, ?, ?)'
  );

  let count = 0;
  const run = db.transaction(() => {
    for (const row of rows) {
      if (!/^\d+$/.test(row.year)) {
        throw new Error(`Ano inválido no CSV: "${row.year}" (título: ${row.title})`);
      }
      const year = parseInt(row.year, 10);
      const winner = row.winner === 'yes' ? 1 : 0;
      const producers = row.producers
        .split(', ')
        .map((p) => p.trim())
        .filter(Boolean);

      for (const producer of producers) {
        insert.run(year, row.title, row.studios, producer, winner);
        count++;
      }
    }
  });
  run();

  return count;
}
```

## 2. src/app.js
```js
import express from 'express';
import { initializeDatabase } from './database.js';
import { loadMoviesFromCSV } from './services/csvLoader.js';

const db = initializeDatabase();
loadMoviesFromCSV(db, './data/Movielist.csv');

const app = express();
app.use(express.json());
app.locals.db = db;

export { db };
export default app;
```

## 3. Teste manual
Comando do brief (adaptado para `import()` dinâmico, pois `node -e` com `import` estático não roda em CJS):
- `Rows inserted: 343`
- Consulta de conferência: 343 linhas, 72 com winner=1; "Cruising" inserido com producer "Jerry Weintraub", winner 0.
- `import('./src/app.js')`: carrega, export default é function (app Express), 343 linhas no banco.

## 4. Linhas inseridas
343

## 5. Concerns e desvios
- `data/Movielist.csv` não existia no projeto, apesar do brief dizer que já estava lá. Copiei de `/home/devcodes/Downloads/back-end-ai-test/Movielist.csv` (206 linhas de dados + header).
- Dividi só por `, ` como o brief manda. Porém 128 das 343 linhas ficaram com producer no formato "A and B" (ex: "Yoram Globus and Menahem Golan"). Se a Task de intervalos de prêmios precisar de produtores individuais, o split deve também tratar " and ". Não alterei, fica a decisão para a validação. Isto é observação sobre os dados, não confirmei a regra de negócio.
- Usei `csv-parse/sync`, transação do better-sqlite3 e `trim`/`bom` por segurança. Ano inválido lança erro (a opção "skip or throw" do brief).
- `app.js` exporta `app` como default e `db` nomeado, e guarda o db em `app.locals.db`. O app não chama `listen` (será do server.js).
- Sem commit, sem subagentes.

## 6. Resumo
Loader e app criados; CSV carrega 343 linhas sem erro (72 vencedoras).
