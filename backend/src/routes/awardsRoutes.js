import { Router } from 'express';
import { getProducerIntervals } from '../services/producerService.js';

const router = Router();

/**
 * @swagger
 * /awards/producers/intervals:
 *   get:
 *     summary: Retorna os produtores com menor e maior intervalo entre vitórias consecutivas
 *     description: Calcula quais produtores tiveram o menor e o maior intervalo entre dois prêmios consecutivos do Golden Raspberry Awards
 *     tags:
 *       - Awards
 *     responses:
 *       200:
 *         description: Sucesso - Retorna os intervalos de produtores
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IntervalsResponse'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/producers/intervals', (req, res) => {
  const result = getProducerIntervals(req.app.locals.db);
  res.status(200).json(result);
});

export default router;
