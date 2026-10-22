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
