import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import authRoutes from './routes/auth.js';
import streamRoutes from './routes/streams.js';
import moderationRoutes from './routes/moderation.js';
import aiToolsRoutes from './routes/ai-tools.js';
import AIModeration from './services/AIModeration.js';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Redis client
const redis = createClient({
  url: process.env.REDIS_URL
});

redis.on('error', (err) => console.error('Redis error:', err));
await redis.connect();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/streams', streamRoutes);
app.use('/moderation', moderationRoutes);
app.use('/ai', aiToolsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// WebSocket handling
const clients = new Map();

wss.on('connection', (ws) => {
  const clientId = Math.random().toString(36).substring(7);
  clients.set(clientId, ws);

  console.log(`Client connected: ${clientId}`);

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());

      switch (message.type) {
        case 'chat:message':
          await handleChatMessage(message, clientId);
          break;

        case 'stream:subscribe':
          await handleStreamSubscribe(message, clientId);
          break;

        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          break;

        default:
          ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
    }
  });

  ws.on('close', () => {
    clients.delete(clientId);
    console.log(`Client disconnected: ${clientId}`);
  });

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connected',
    clientId,
    timestamp: Date.now()
  }));
});

async function handleChatMessage(message, clientId) {
  const { username, text, stream_id } = message;

  if (!username || !text) {
    return;
  }

  // Analyze message for toxicity
  const analysis = await AIModeration.analyzeMessage(text, username);

  // Broadcast to all clients
  broadcast({
    type: 'chat:message',
    username,
    message: text,
    toxicity_score: analysis.toxicity_score,
    action: analysis.action,
    timestamp: Date.now()
  });

  // Take action if needed
  if (analysis.action === 'ban') {
    broadcast({
      type: 'moderation:action',
      username,
      action: 'ban',
      reason: 'Toxic content detected',
      timestamp: Date.now()
    });
  }

  // Store in Redis for temporary chat history
  if (stream_id) {
    await redis.lPush(`chat:${stream_id}`, JSON.stringify({
      username,
      message: text,
      toxicity_score: analysis.toxicity_score,
      timestamp: Date.now()
    }));
    await redis.lTrim(`chat:${stream_id}`, 0, 99); // Keep last 100 messages
  }
}

async function handleStreamSubscribe(message, clientId) {
  const { stream_id } = message;

  if (!stream_id) {
    return;
  }

  // Send recent chat history
  const history = await redis.lRange(`chat:${stream_id}`, 0, 49);
  const client = clients.get(clientId);

  if (client) {
    client.send(JSON.stringify({
      type: 'chat:history',
      stream_id,
      messages: history.map(h => JSON.parse(h)).reverse()
    }));
  }
}

function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(message);
    }
  });
}

// Periodic stream status updates
setInterval(async () => {
  // This would query EVMux for status updates in production
  broadcast({
    type: 'stream:status',
    timestamp: Date.now()
  });
}, 30000); // Every 30 seconds

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 SwanyThree backend running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
  console.log(`🗄️  Database: ${process.env.DATABASE_URL?.split('@')[1] || 'Not configured'}`);
  console.log(`🔴 Redis: ${process.env.REDIS_URL || 'Not configured'}`);
});
