import express from 'express';
import pg from 'pg';
import EVMuxService from '../services/EVMuxService.js';
import OBSController from '../services/OBSController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, evmux_id, name, status, rtmp_url, created_at FROM streams WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );

    res.json({
      success: true,
      streams: result.rows
    });
  } catch (error) {
    console.error('Get streams error:', error);
    res.status(500).json({ error: 'Failed to fetch streams' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Stream name required' });
    }

    // Create stream on EVMux
    const evmuxStream = await EVMuxService.createStream(name);

    // Store in database
    const result = await pool.query(
      'INSERT INTO streams (user_id, evmux_id, name, status, rtmp_url, stream_key) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.userId, evmuxStream.evmux_id, name, evmuxStream.status, evmuxStream.rtmp_url, evmuxStream.stream_key]
    );

    const stream = result.rows[0];

    // Generate OBS config
    const obsConfig = OBSController.generateOBSConfig(stream.rtmp_url, stream.stream_key);

    res.status(201).json({
      success: true,
      stream: {
        id: stream.id,
        name: stream.name,
        status: stream.status,
        rtmp_url: stream.rtmp_url,
        stream_key: stream.stream_key,
        created_at: stream.created_at
      },
      obs_config: obsConfig
    });
  } catch (error) {
    console.error('Create stream error:', error);
    res.status(500).json({ error: 'Failed to create stream' });
  }
});

router.post('/:id/start', async (req, res) => {
  try {
    const { id } = req.params;

    // Get stream
    const streamResult = await pool.query(
      'SELECT evmux_id, user_id FROM streams WHERE id = $1',
      [id]
    );

    if (streamResult.rows.length === 0) {
      return res.status(404).json({ error: 'Stream not found' });
    }

    const stream = streamResult.rows[0];

    if (stream.user_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Start stream on EVMux
    await EVMuxService.startStream(stream.evmux_id);

    // Update database
    await pool.query(
      'UPDATE streams SET status = $1 WHERE id = $2',
      ['live', id]
    );

    res.json({
      success: true,
      status: 'live'
    });
  } catch (error) {
    console.error('Start stream error:', error);
    res.status(500).json({ error: 'Failed to start stream' });
  }
});

router.post('/:id/stop', async (req, res) => {
  try {
    const { id } = req.params;

    // Get stream
    const streamResult = await pool.query(
      'SELECT evmux_id, user_id FROM streams WHERE id = $1',
      [id]
    );

    if (streamResult.rows.length === 0) {
      return res.status(404).json({ error: 'Stream not found' });
    }

    const stream = streamResult.rows[0];

    if (stream.user_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Stop stream on EVMux
    await EVMuxService.stopStream(stream.evmux_id);

    // Update database
    await pool.query(
      'UPDATE streams SET status = $1 WHERE id = $2',
      ['stopped', id]
    );

    res.json({
      success: true,
      status: 'stopped'
    });
  } catch (error) {
    console.error('Stop stream error:', error);
    res.status(500).json({ error: 'Failed to stop stream' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get stream
    const streamResult = await pool.query(
      'SELECT evmux_id, user_id FROM streams WHERE id = $1',
      [id]
    );

    if (streamResult.rows.length === 0) {
      return res.status(404).json({ error: 'Stream not found' });
    }

    const stream = streamResult.rows[0];

    if (stream.user_id !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Delete from EVMux
    if (stream.evmux_id) {
      await EVMuxService.deleteStream(stream.evmux_id);
    }

    // Delete from database
    await pool.query('DELETE FROM streams WHERE id = $1', [id]);

    res.json({
      success: true
    });
  } catch (error) {
    console.error('Delete stream error:', error);
    res.status(500).json({ error: 'Failed to delete stream' });
  }
});

export default router;
