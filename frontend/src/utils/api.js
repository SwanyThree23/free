import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (email, password) =>
  api.post('/auth/register', { email, password });

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

// Streams
export const getStreams = () =>
  api.get('/streams');

export const createStream = (name) =>
  api.post('/streams', { name });

export const startStream = (id) =>
  api.post(`/streams/${id}/start`);

export const stopStream = (id) =>
  api.post(`/streams/${id}/stop`);

export const deleteStream = (id) =>
  api.delete(`/streams/${id}`);

// Moderation
export const getModerationLogs = (streamId = null, limit = 100) =>
  api.get('/moderation/logs', { params: { stream_id: streamId, limit } });

export const analyzeMessage = (message, username, streamId = null) =>
  api.post('/moderation/analyze', { message, username, stream_id: streamId });

export const banUser = (username, streamId, reason = '') =>
  api.post('/moderation/ban', { username, stream_id: streamId, reason });

export const getModerationStats = (streamId = null) =>
  api.get('/moderation/stats', { params: { stream_id: streamId } });

// AI Tools
export const chatCompletion = (messages, model = 'anthropic/claude-3-sonnet') =>
  api.post('/ai/chat', { messages, model });

export const compressText = (text, compressionRate = 0.5) =>
  api.post('/ai/compress', { text, compression_rate: compressionRate });

export const generatePodcast = (topic, duration = 'medium') =>
  api.post('/ai/podcast', { topic, duration });

export const getAvailableModels = () =>
  api.get('/ai/models');

export default api;
