import Database from 'better-sqlite3';

export function initializeDatabase() {
  const db = new Database(':memory:');

  db.exec(`
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY,
      year INTEGER,
      title TEXT,
      studios TEXT,
      producer TEXT,
      winner INTEGER
    );

    CREATE TABLE IF NOT EXISTS ai_interactions (
      id INTEGER PRIMARY KEY,
      timestamp TEXT,
      tool_name TEXT,
      skill_name TEXT,
      prompt TEXT,
      result TEXT
    );
  `);

  return db;
}
