import express from 'express';
import { initializeDatabase } from './database.js';
import { loadMoviesFromCSV } from './services/csvLoader.js';
import awardsRoutes from './routes/awardsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const db = initializeDatabase();
loadMoviesFromCSV(db, './data/Movielist.csv');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.locals.db = db;

app.use('/awards', awardsRoutes);
app.use('/ai', aiRoutes);

export { db };
export default app;
