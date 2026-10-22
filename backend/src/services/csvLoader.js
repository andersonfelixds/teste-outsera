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
