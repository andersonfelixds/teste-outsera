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
