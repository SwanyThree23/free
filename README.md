# SwanyThree Ultimate Edition

AI-powered streaming platform with EVMux cloud streaming, AI chat moderation, multi-tool AI wrapper, and enterprise monetization.

## Features

### 🎥 EVMux Cloud Streaming
- Create and manage live streams via EVMux API
- RTMP configuration for OBS integration
- Real-time stream status tracking
- Start/stop streams with one click

### 🛡️ AI Chat Moderation
- Real-time toxicity detection using Claude AI
- Automatic ban system (>0.7 toxicity score)
- Warning system (0.5-0.7 toxicity)
- Live moderation dashboard with stats
- Moderation history and logs

### 🤖 AI Tools Wrapper
- **OpenRouter Chat**: Multi-model AI chat interface
- **LLMLingua Compression**: Intelligent text compression
- **NotebookLM Podcast**: AI-generated podcast scripts
- Unified API for all AI operations

### ⚡ Real-time Features
- WebSocket-powered live updates
- Real-time chat moderation
- Stream status broadcasts
- Automatic reconnection

## Tech Stack

**Backend:**
- Node.js 20
- Express.js
- PostgreSQL 16
- Redis 7
- WebSocket (ws)
- JWT Authentication

**Frontend:**
- React 18
- Vite 5
- TailwindCSS 3
- Lucide Icons
- Axios

**Infrastructure:**
- Docker & Docker Compose
- Multi-stage builds
- Health checks
- Volume persistence

## Quick Start

### Prerequisites
- Docker & Docker Compose
- API Keys for:
  - EVMux (streaming)
  - Anthropic Claude (moderation & AI tools)
  - OpenRouter (AI chat)

### Installation

1. **Clone and navigate:**
```bash
cd swanythree
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your API keys
```

3. **Launch the platform:**
```bash
chmod +x launch.sh
./launch.sh
```

The launch script will:
- Check Docker status
- Build all services
- Start PostgreSQL, Redis, backend, and frontend
- Run database migrations
- Display access URLs

### Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Environment Variables

Required in `.env`:

```env
DATABASE_URL=postgresql://postgres:devpass@postgres:5432/swanythree
REDIS_URL=redis://redis:6379
JWT_SECRET=your-super-secret-jwt-key-change-this
EVMUX_API_KEY=your-evmux-api-key
EVMUX_APP_ID=your-evmux-app-id
ANTHROPIC_API_KEY=your-anthropic-api-key
OPENROUTER_API_KEY=your-openrouter-api-key
PORT=3000
```

## API Endpoints

### Authentication
- `POST /auth/register` - Create account
- `POST /auth/login` - Login and get JWT

### Streams
- `GET /streams` - List user streams
- `POST /streams` - Create new stream
- `POST /streams/:id/start` - Start stream
- `POST /streams/:id/stop` - Stop stream
- `DELETE /streams/:id` - Delete stream

### Moderation
- `GET /moderation/logs` - Get moderation history
- `POST /moderation/analyze` - Analyze message toxicity
- `POST /moderation/ban` - Ban user
- `GET /moderation/stats` - Get moderation statistics

### AI Tools
- `POST /ai/chat` - OpenRouter chat completion
- `POST /ai/compress` - LLMLingua text compression
- `POST /ai/podcast` - Generate podcast script
- `GET /ai/models` - List available AI models

## WebSocket Events

### Client → Server
- `chat:message` - Send chat message for moderation
- `stream:subscribe` - Subscribe to stream updates
- `ping` - Keep-alive ping

### Server → Client
- `connected` - Connection established
- `chat:message` - Moderated chat message
- `chat:history` - Chat history for stream
- `moderation:action` - Moderation action taken
- `stream:status` - Stream status update
- `pong` - Ping response

## Database Schema

### users
- `id` - Serial primary key
- `email` - Unique email
- `password_hash` - Bcrypt hash
- `created_at` - Timestamp

### streams
- `id` - Serial primary key
- `user_id` - Foreign key to users
- `evmux_id` - EVMux stream ID
- `name` - Stream name
- `status` - Stream status (live/stopped)
- `rtmp_url` - RTMP server URL
- `stream_key` - RTMP stream key
- `created_at` - Timestamp

### moderation_logs
- `id` - Serial primary key
- `stream_id` - Foreign key to streams
- `username` - Chat username
- `message` - Chat message
- `toxicity_score` - AI toxicity score (0-1)
- `action` - Moderation action (none/warning/ban)
- `timestamp` - Timestamp

## Design System

### Earth Tone Color Palette

```css
Background: #2a1810 (dark brown)
Card: #3d2817 (medium brown)
Accent: #8b2635 (burgundy)
Gold: #d4af37 (gold)
Text: #e8d5b5 (cream)
Success: #6b8e4e (olive green)
Warning: #c77d4f (terracotta)
```

### Component Patterns
- Gradient buttons: `from-[#8b2635] to-[#6b1f2a]`
- Cards: `bg-gradient-to-br from-[#3d2817] to-[#2a1810]`
- Borders: `border-2 border-[#8b2635]/30`
- Hover: `hover:border-[#d4af37]`

## Development

### Manual Setup

```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run dev
```

### Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild
docker-compose build --no-cache

# Reset database
docker-compose down -v
docker-compose up -d
```

### Database Migrations

Migrations run automatically on container start. Manual migration:

```bash
docker exec -i swanythree-postgres psql -U postgres -d swanythree < migrations/001_init.sql
```

## OBS Integration

1. Create a stream in SwanyThree
2. Copy RTMP URL and Stream Key
3. In OBS:
   - Settings → Stream
   - Service: Custom
   - Server: [Paste RTMP URL]
   - Stream Key: [Paste Stream Key]
4. Click "Start Streaming"

## Security Features

- JWT-based authentication
- Bcrypt password hashing (10 rounds)
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitized outputs)
- CORS configuration
- Environment variable secrets
- Rate limiting ready
- WebSocket authentication ready

## Production Deployment

### Recommended Changes

1. **Environment:**
   - Generate secure `JWT_SECRET`
   - Use strong database password
   - Enable Redis password
   - Set `NODE_ENV=production`

2. **Security:**
   - Enable HTTPS/WSS
   - Add rate limiting
   - Implement CSRF protection
   - Add WebSocket authentication
   - Enable helmet.js

3. **Performance:**
   - Enable Redis persistence
   - Add database connection pooling
   - Implement caching strategy
   - Add CDN for frontend

4. **Monitoring:**
   - Add application logging
   - Implement error tracking
   - Add performance monitoring
   - Set up health checks

## Troubleshooting

### Docker Issues
```bash
# Reset everything
docker-compose down -v
docker system prune -a
./launch.sh
```

### Database Connection Issues
```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Verify database
docker exec -it swanythree-postgres psql -U postgres -d swanythree
```

### WebSocket Connection Issues
- Check CORS configuration
- Verify WebSocket URL in frontend
- Check backend logs for errors

## License

MIT License - see LICENSE file

## Support

For issues and questions:
- GitHub Issues: [Your repo URL]
- Documentation: This README
- API Reference: See API Endpoints section

---

Built with ❤️ using Claude AI, EVMux, and OpenRouter
