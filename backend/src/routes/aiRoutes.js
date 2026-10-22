import { Router } from 'express';
import { getAIInteractions } from '../services/aiInteractionService.js';

const router = Router();

router.get('/', (req, res) => {
  const interactions = getAIInteractions(req.app.locals.db);
  res.status(200).json({ interactions });
});

export default router;
