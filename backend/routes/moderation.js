import express from 'express';
import pg from 'pg';
import AIModeration from '../services/AIModeration.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

router.use(authenticate);

router.get('/logs', async (req, res) => {
  try {
    const { stream_id, limit = 100 } = req.query;

    let query = `
      SELECT ml.*, s.name as stream_name
      FROM moderation_logs ml
      JOIN streams s ON ml.stream_id = s.id
      WHERE s.user_id = $1
    `;
    const params = [req.userId];

    if (stream_id) {
      query += ' AND ml.stream_id = $2';
      params.push(stream_id);
    }

    query += ' ORDER BY ml.timestamp DESC LIMIT $' + (params.length + 1);
    params.push(limit);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      logs: result.rows
    });
  } catch (error) {
    console.error('Get moderation logs error:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

router.post('/analyze', async (req, res) => {
  try {
    const { message, username, stream_id } = req.body;

    if (!message || !username) {
      return res.status(400).json({ error: 'Message and username required' });
    }

    // Analyze message
    const analysis = await AIModeration.analyzeMessage(message, username);

    // Store in database if stream_id provided
    if (stream_id) {
      // Verify stream ownership
      const streamResult = await pool.query(
        'SELECT id FROM streams WHERE id = $1 AND user_id = $2',
        [stream_id, req.userId]
      );

      if (streamResult.rows.length > 0) {
        await pool.query(
          'INSERT INTO moderation_logs (stream_id, username, message, toxicity_score, action) VALUES ($1, $2, $3, $4, $5)',
          [stream_id, username, message, analysis.toxicity_score, analysis.action]
        );
      }
    }

    res.json({
      success: true,
      ...analysis
    });
  } catch (error) {
    console.error('Analyze message error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

router.post('/ban', async (req, res) => {
  try {
    const { username, stream_id, reason } = req.body;

    if (!username || !stream_id) {
      return res.status(400).json({ error: 'Username and stream_id required' });
    }

    // Verify stream ownership
    const streamResult = await pool.query(
      'SELECT id FROM streams WHERE id = $1 AND user_id = $2',
      [stream_id, req.userId]
    );

    if (streamResult.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Log ban action
    await pool.query(
      'INSERT INTO moderation_logs (stream_id, username, message, toxicity_score, action) VALUES ($1, $2, $3, $4, $5)',
      [stream_id, username, reason || 'Manual ban', 1.0, 'ban']
    );

    res.json({
      success: true,
      banned_user: username
    });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ error: 'Ban failed' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const { stream_id } = req.query;

    let query = `
      SELECT
        COUNT(*) as total_messages,
        AVG(toxicity_score) as avg_toxicity,
        SUM(CASE WHEN action = 'ban' THEN 1 ELSE 0 END) as total_bans,
        SUM(CASE WHEN action = 'warning' THEN 1 ELSE 0 END) as total_warnings
      FROM moderation_logs ml
      JOIN streams s ON ml.stream_id = s.id
      WHERE s.user_id = $1
    `;
    const params = [req.userId];

    if (stream_id) {
      query += ' AND ml.stream_id = $2';
      params.push(stream_id);
    }

    const result = await pool.query(query, params);

    res.json({
      success: true,
      stats: result.rows[0]
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
