import { Router } from 'express';
const router = Router();

router.get('/', async (req, res) => {
  res.json({ message: 'List users - Implementation pending' });
});

router.get('/:id', async (req, res) => {
  res.json({ message: 'Get user - Implementation pending' });
});

export default router;
