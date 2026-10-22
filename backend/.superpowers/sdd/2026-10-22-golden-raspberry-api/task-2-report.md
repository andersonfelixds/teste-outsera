# Task 2 Report: SQLite Database Setup and Schema

## 1. Código de `src/database.js`

```js
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
```

## 2. Resultado do teste manual

Comando exato do brief (`node -e "import ..."`):

```
{ '1': 1 }
```

Também rodei com `--input-type=module`, com o mesmo resultado `{ '1': 1 }`. O comando do brief funcionou porque o `package.json` tem `"type": "module"`.

## 3. Verificação das tabelas

Consulta em `sqlite_master`:

```
[ { name: 'ai_interactions' }, { name: 'movies' } ]
```

`PRAGMA table_info(movies)`: `id:INTEGER, year:INTEGER, title:TEXT, studios:TEXT, producer:TEXT, winner:INTEGER` (winner é INTEGER).

## 4. Preocupações e desvios

Nenhum desvio do brief. Usei `CREATE TABLE IF NOT EXISTS`, o que é inofensivo em `:memory:` (cada chamada cria um banco novo). Não rodei Jest nem criei arquivo de teste, porque o brief só pede verificação manual. Nada foi commitado.

## 5. Resumo

Manual: `SELECT 1` retornou `{ '1': 1 }` e as 2 tabelas (movies, ai_interactions) existem com o schema pedido.
