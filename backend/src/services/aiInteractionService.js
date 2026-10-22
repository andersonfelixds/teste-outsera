export function logAIInteraction(db, toolName, skillName, prompt, result) {
  try {
    const timestamp = new Date().toISOString();
    const info = db
      .prepare(
        `INSERT INTO ai_interactions (timestamp, tool_name, skill_name, prompt, result)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(timestamp, toolName ?? null, skillName ?? null, prompt ?? null, result ?? null);
    return Number(info.lastInsertRowid);
  } catch (error) {
    console.error('Failed to log AI interaction:', error.message);
    return null;
  }
}

export function getAIInteractions(db) {
  return db
    .prepare(
      `SELECT id, timestamp, tool_name, skill_name, prompt, result
       FROM ai_interactions
       ORDER BY timestamp DESC, id DESC`
    )
    .all();
}
