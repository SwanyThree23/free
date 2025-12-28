import { Router } from 'express';
const router = Router();

router.get('/dashboard', async (req, res) => {
  res.json({ message: 'Analytics dashboard - Implementation pending' });
});

export default router;
