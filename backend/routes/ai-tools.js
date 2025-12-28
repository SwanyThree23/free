import express from 'express';
import AIToolsWrapper from '../services/AIToolsWrapper.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.post('/chat', async (req, res) => {
  try {
    const { messages, model = 'anthropic/claude-3-sonnet' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required' });
    }

    const result = await AIToolsWrapper.chatCompletion(messages, model);

    res.json(result);
  } catch (error) {
    console.error('Chat completion error:', error);
    res.status(500).json({ error: 'Chat failed' });
  }
});

router.post('/compress', async (req, res) => {
  try {
    const { text, compression_rate = 0.5 } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text required' });
    }

    if (compression_rate <= 0 || compression_rate >= 1) {
      return res.status(400).json({ error: 'Compression rate must be between 0 and 1' });
    }

    const result = await AIToolsWrapper.compressText(text, compression_rate);

    res.json(result);
  } catch (error) {
    console.error('Text compression error:', error);
    res.status(500).json({ error: 'Compression failed' });
  }
});

router.post('/podcast', async (req, res) => {
  try {
    const { topic, duration = 'medium' } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic required' });
    }

    if (!['short', 'medium', 'long'].includes(duration)) {
      return res.status(400).json({ error: 'Duration must be short, medium, or long' });
    }

    const result = await AIToolsWrapper.generatePodcast(topic, duration);

    res.json(result);
  } catch (error) {
    console.error('Podcast generation error:', error);
    res.status(500).json({ error: 'Podcast generation failed' });
  }
});

router.get('/models', async (req, res) => {
  try {
    const result = await AIToolsWrapper.getAvailableModels();

    res.json(result);
  } catch (error) {
    console.error('Get models error:', error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

export default router;
