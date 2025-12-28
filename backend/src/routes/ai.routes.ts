import { Router } from 'express';
const router = Router();

router.post('/chat', async (req, res) => {
  res.json({ message: 'AI chat - Implementation pending' });
});

export default router;
