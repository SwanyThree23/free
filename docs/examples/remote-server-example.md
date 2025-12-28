# Remote MCP Server Configuration Examples

This document provides examples of how to configure and use remote MCP servers with Claude.

## Overview

Unlike local MCP servers that run on your machine, remote MCP servers are hosted on the internet and accessed through Claude's Custom Connectors feature. These servers don't require local configuration files but are added through the Claude web interface.

## Adding Remote Servers

### Method 1: Claude Web Interface

1. Navigate to [claude.ai](https://claude.ai)
2. Click your profile icon → Settings
3. Select "Connectors" from the sidebar
4. Click "Add custom connector"
5. Enter the remote server URL
6. Complete authentication
7. Configure permissions

### Method 2: Direct URL Access

Some remote MCP servers provide direct access URLs:

```
https://mcp.example.com/api
https://api.service.com/mcp/v1
https://your-server.herokuapp.com
```

## Example Remote Server URLs

### Development and Testing

```
https://mcp-test-server.example.com
https://demo.modelcontextprotocol.io
```

### Common Service Integrations

**Project Management:**
```
https://api.linear.app/mcp
https://mcp.asana.com/api
https://jira-mcp.atlassian.net
```

**Communication:**
```
https://slack-mcp.slack.com/api
https://discord-mcp.com/api
https://teams-mcp.microsoft.com
```

**Cloud Storage:**
```
https://drive-mcp.google.com
https://onedrive-mcp.microsoft.com
https://dropbox-mcp.dropbox.com
```

## Building Your Own Remote Server

### Deployment Options

#### 1. Heroku

```bash
# Deploy to Heroku
git init
heroku create my-mcp-server
git push heroku main

# Your server URL
https://my-mcp-server.herokuapp.com
```

#### 2. Railway

```bash
# Deploy to Railway
railway init
railway up

# Automatic URL provided
https://my-mcp-server.railway.app
```

#### 3. Vercel

```bash
# Deploy to Vercel
vercel --prod

# Provided URL
https://my-mcp-server.vercel.app
```

#### 4. AWS Lambda + API Gateway

```python
# Example serverless MCP server
import json
from mcp.server import Server

app = Server("remote-mcp-server")

@app.list_tools()
async def list_tools():
    return [{"name": "example", "description": "Example tool"}]

def lambda_handler(event, context):
    # MCP protocol handling
    return {
        'statusCode': 200,
        'body': json.dumps(response)
    }
```

URL: `https://abc123.execute-api.us-east-1.amazonaws.com/prod/mcp`

#### 5. Google Cloud Run

```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/mcp-server', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/mcp-server']
  - name: 'gcr.io/cloud-builders/gcloud'
    args: ['run', 'deploy', 'mcp-server', '--image', 'gcr.io/$PROJECT_ID/mcp-server']
```

URL: `https://mcp-server-abc123.run.app`

### Authentication Examples

#### OAuth 2.0

```javascript
// Server-side OAuth implementation
app.get('/oauth/authorize', (req, res) => {
  const authUrl = `https://oauth-provider.com/authorize?
    client_id=${CLIENT_ID}&
    redirect_uri=${REDIRECT_URI}&
    scope=read:data write:data&
    state=${generateState()}`;

  res.redirect(authUrl);
});

app.get('/oauth/callback', async (req, res) => {
  const { code, state } = req.query;
  const token = await exchangeCodeForToken(code);
  // Store token securely
});
```

#### API Key

```javascript
// API key validation middleware
function validateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || !isValidKey(apiKey)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  next();
}

app.use('/mcp', validateApiKey, mcpRouter);
```

#### JWT Tokens

```javascript
// JWT authentication
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}
```

## Example Server Implementation

### TypeScript/Express

```typescript
import express from 'express';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

const app = express();
const mcpServer = new Server({
  name: "remote-example-server",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {},
    resources: {}
  }
});

// Define tools
mcpServer.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "get_data",
      description: "Fetch data from API",
      inputSchema: {
        type: "object",
        properties: {
          id: { type: "string" }
        }
      }
    }
  ]
}));

mcpServer.setRequestHandler("tools/call", async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "get_data") {
    const data = await fetchData(args.id);
    return { content: [{ type: "text", text: JSON.stringify(data) }] };
  }
});

// SSE endpoint for MCP protocol
app.get('/mcp/sse', async (req, res) => {
  const transport = new SSEServerTransport('/mcp/messages', res);
  await mcpServer.connect(transport);
});

// Message endpoint for MCP protocol
app.post('/mcp/messages', express.json(), async (req, res) => {
  // Handle MCP messages
});

app.listen(3000, () => {
  console.log('MCP server running on https://yourserver.com');
});
```

### Python/FastAPI

```python
from fastapi import FastAPI, Header
from mcp.server import Server
from mcp.server.sse import sse_server

app = FastAPI()
mcp = Server("remote-example-server")

@mcp.list_tools()
async def list_tools():
    return [{
        "name": "get_data",
        "description": "Fetch data from API",
        "inputSchema": {
            "type": "object",
            "properties": {
                "id": {"type": "string"}
            }
        }
    }]

@mcp.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "get_data":
        data = await fetch_data(arguments["id"])
        return {"content": [{"type": "text", "text": str(data)}]}

@app.get("/mcp/sse")
async def mcp_sse_endpoint():
    return sse_server(mcp)

@app.post("/mcp/messages")
async def mcp_messages(request: dict):
    return await mcp.handle_message(request)

# Run with: uvicorn main:app --host 0.0.0.0 --port 8000
```

## Testing Your Remote Server

### 1. Local Testing

```bash
# Start your server locally
npm start  # or python main.py

# Test endpoint
curl http://localhost:3000/mcp/sse

# Use ngrok for temporary public URL
ngrok http 3000
# Use the ngrok URL to test with Claude
```

### 2. Postman/Insomnia Testing

Create requests to test your MCP endpoints:

```http
POST https://your-server.com/mcp/messages
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "method": "tools/list",
  "id": 1
}
```

### 3. MCP Inspector

Use the MCP Inspector tool (if available) to validate protocol compliance:

```bash
npx @modelcontextprotocol/inspector https://your-server.com
```

## Security Considerations

### HTTPS Required

All remote MCP servers must use HTTPS:

```javascript
// Force HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

### Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/mcp', limiter);
```

### CORS Configuration

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://claude.ai',
  credentials: true
}));
```

### Input Validation

```javascript
const { body, validationResult } = require('express-validator');

app.post('/mcp/messages', [
  body('jsonrpc').equals('2.0'),
  body('method').isString(),
  body('id').isNumeric()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process request
});
```

## Monitoring and Logging

### Logging Best Practices

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log all requests
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    path: req.path,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });
  next();
});
```

### Health Checks

```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Readiness check
app.get('/ready', async (req, res) => {
  const isReady = await checkDependencies();
  res.status(isReady ? 200 : 503).json({ ready: isReady });
});
```

## Production Checklist

- [ ] HTTPS configured
- [ ] Authentication implemented
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Input validation in place
- [ ] Logging and monitoring setup
- [ ] Health checks implemented
- [ ] Error handling comprehensive
- [ ] API documentation available
- [ ] Backup and recovery plan
- [ ] Secrets management secure
- [ ] Database connections pooled
- [ ] Caching strategy implemented
- [ ] Load balancing configured (if needed)

## Resources

### Documentation
- [Remote MCP Guide](../guides/remote-mcp-servers.md)
- [MCP Protocol Specification](https://modelcontextprotocol.io/docs/learn/architecture)
- [Building Custom Connectors](https://support.anthropic.com/en/articles/11503834-building-custom-connectors-via-remote-mcp-servers)

### Tools
- [ngrok](https://ngrok.com) - Temporary public URLs for testing
- [Railway](https://railway.app) - Easy deployment
- [Vercel](https://vercel.com) - Serverless deployment
- [Heroku](https://heroku.com) - Platform as a Service

### Community
- [MCP Servers Repository](https://github.com/modelcontextprotocol/servers)
- [Discord Community](https://discord.gg/modelcontextprotocol)
- [GitHub Discussions](https://github.com/modelcontextprotocol/servers/discussions)

---

**Ready to deploy?** Choose a platform, implement your server, and share it with the community!

**Need help?** Join the [Discord community](https://discord.gg/modelcontextprotocol) for support.
