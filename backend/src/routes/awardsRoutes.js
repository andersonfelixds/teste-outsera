import { Router } from 'express';
import { getProducerIntervals } from '../services/producerService.js';

const router = Router();

router.get('/producers/intervals', (req, res) => {
  const result = getProducerIntervals(req.app.locals.db);
  res.status(200).json(result);
});

export default router;
