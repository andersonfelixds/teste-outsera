import { Router } from 'express';
import { getAIInteractions } from '../services/aiInteractionService.js';

const router = Router();

/**
 * @swagger
 * /ai/:
 *   get:
 *     summary: Retorna o histórico de interações com ferramentas de IA
 *     description: Lista todas as interações registradas com ferramentas de IA, ordenadas pela mais recente primeiro
 *     tags:
 *       - AI Interactions
 *     responses:
 *       200:
 *         description: Sucesso - Retorna o histórico de interações
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AIInteractionsResponse'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', (req, res) => {
  const interactions = getAIInteractions(req.app.locals.db);
  res.status(200).json({ interactions });
});

export default router;
