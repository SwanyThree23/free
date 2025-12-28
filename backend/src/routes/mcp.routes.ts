import { Router } from 'express';
const router = Router();

router.get('/servers', async (req, res) => {
  res.json({ message: 'List MCP servers - Implementation pending' });
});

router.post('/servers', async (req, res) => {
  res.json({ message: 'Create MCP server - Implementation pending' });
});

export default router;
