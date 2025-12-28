# SwanyThree Ultimate Platform - API Reference

## Table of Contents
1. [Authentication](#authentication)
2. [Agent Swarm API](#agent-swarm-api)
3. [Content Waterfall API](#content-waterfall-api)
4. [User Management API](#user-management-api)
5. [Workflow API](#workflow-api)
6. [Team Collaboration API](#team-collaboration-api)
7. [Platform Publishing API](#platform-publishing-api)
8. [Error Codes](#error-codes)
9. [Rate Limiting](#rate-limiting)
10. [Webhooks](#webhooks)

---

## Authentication

All API requests (except registration and login) require a valid JWT token.

### Register

**Endpoint**: `POST /webhook/auth/register`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response** (201 Created):
```json
{
  "user": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "free"
  },
  "message": "Verification email sent"
}
```

### Login

**Endpoint**: `POST /webhook/auth/login`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "role": "pro",
    "teamId": "team_xyz789"
  },
  "expiresIn": 900
}
```

### Refresh Token

**Endpoint**: `POST /webhook/auth/refresh`

**Request**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response** (200 OK):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 900
}
```

### Logout

**Endpoint**: `POST /webhook/auth/logout`

**Headers**:
```
Authorization: Bearer {accessToken}
```

**Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

---

## Agent Swarm API

### Create Agent Swarm Task

**Endpoint**: `POST /webhook/agent-swarm`

**Headers**:
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request**:
```json
{
  "request": "Create a complete e-commerce landing page with SEO optimization",
  "industry": "ecommerce",
  "agents": ["frontend", "seo", "content"],
  "priority": "high",
  "deadline": "2024-12-31T23:59:59Z"
}
```

**Parameters**:
- `request` (required): Task description
- `industry` (optional): Industry context (ecommerce, saas, content, finance, healthcare)
- `agents` (optional): Specific agents to use (frontend, mcp-builder, seo, content, code-review)
- `priority` (optional): Task priority (low, medium, high)
- `deadline` (optional): ISO 8601 timestamp

**Response** (202 Accepted):
```json
{
  "taskId": "task_abc123",
  "status": "processing",
  "assignedAgents": [
    {
      "agent": "frontend",
      "status": "in_progress",
      "progress": 35
    },
    {
      "agent": "seo",
      "status": "queued",
      "progress": 0
    },
    {
      "agent": "content",
      "status": "in_progress",
      "progress": 60
    }
  ],
  "estimatedCompletion": "2024-01-15T14:30:00Z"
}
```

### Get Task Status

**Endpoint**: `GET /webhook/agent-swarm/{taskId}`

**Headers**:
```
Authorization: Bearer {accessToken}
```

**Response** (200 OK):
```json
{
  "taskId": "task_abc123",
  "status": "completed",
  "results": [
    {
      "agent": "frontend",
      "output": {
        "design": {...},
        "components": [...],
        "code": "...",
        "styling": "...",
        "accessibility": [...]
      }
    },
    {
      "agent": "seo",
      "output": {
        "keywords": [...],
        "metaTags": {...},
        "schema": {...}
      }
    },
    {
      "agent": "content",
      "output": {
        "copy": "...",
        "cta": "..."
      }
    }
  ],
  "completedAt": "2024-01-15T14:25:00Z"
}
```

---

## Content Waterfall API

### Upload Content

**Endpoint**: `POST /webhook/content-upload`

**Headers**:
```
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data
```

**Request** (multipart/form-data):
```
file: (binary)
industry: ecommerce
targetPlatforms: youtube,linkedin,twitter,instagram
```

**Parameters**:
- `file` (required): Video, audio, or image file (max 500MB)
- `industry` (optional): Industry context
- `targetPlatforms` (optional): Comma-separated list of platforms

**Response** (202 Accepted):
```json
{
  "contentId": "content_abc123",
  "status": "processing",
  "estimatedCompletion": "2024-01-15T15:00:00Z"
}
```

### Get Content Status

**Endpoint**: `GET /webhook/content/{contentId}`

**Headers**:
```
Authorization: Bearer {accessToken}
```

**Response** (200 OK):
```json
{
  "contentId": "content_abc123",
  "status": "completed",
  "originalFile": {
    "name": "video.mp4",
    "size": 104857600,
    "duration": 300,
    "type": "video/mp4"
  },
  "generatedAssets": {
    "videos": [
      {
        "platform": "youtube",
        "url": "https://cdn.example.com/youtube-optimized.mp4",
        "resolution": "1080p",
        "format": "16:9"
      },
      {
        "platform": "instagram",
        "url": "https://cdn.example.com/instagram-reels.mp4",
        "resolution": "1080x1920",
        "format": "9:16"
      }
    ],
    "images": [
      {
        "type": "youtube-thumbnail",
        "url": "https://cdn.example.com/thumbnail.jpg",
        "dimensions": "1280x720"
      }
    ],
    "text": [
      {
        "type": "transcript",
        "url": "https://cdn.example.com/transcript.txt"
      },
      {
        "type": "summary",
        "content": "Executive summary..."
      }
    ],
    "audio": [
      {
        "type": "podcast",
        "url": "https://cdn.example.com/podcast.mp3"
      }
    ],
    "seo": {
      "keywords": ["keyword1", "keyword2"],
      "metaDescription": "Description...",
      "schema": {...}
    }
  },
  "completedAt": "2024-01-15T14:55:00Z"
}
```

---

## User Management API

### Get Current User

**Endpoint**: `GET /api/users/me`

**Headers**:
```
Authorization: Bearer {accessToken}
```

**Response** (200 OK):
```json
{
  "id": "usr_abc123",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "pro",
  "teamId": "team_xyz789",
  "quotas": {
    "maxWorkflows": -1,
    "maxExecutionsPerDay": 10000,
    "maxConcurrentExecutions": 10,
    "maxStorageGB": 1000
  },
  "usage": {
    "workflows": 25,
    "executionsToday": 1234,
    "storageUsedGB": 150
  },
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Update User Profile

**Endpoint**: `PATCH /api/users/me`

**Headers**:
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request**:
```json
{
  "name": "John Updated Doe",
  "email": "newemail@example.com"
}
```

**Response** (200 OK):
```json
{
  "id": "usr_abc123",
  "email": "newemail@example.com",
  "name": "John Updated Doe",
  "role": "pro"
}
```

### Export User Data (GDPR)

**Endpoint**: `GET /api/users/me/export`

**Headers**:
```
Authorization: Bearer {accessToken}
```

**Response** (200 OK):
Returns a ZIP file containing all user data.

### Delete Account

**Endpoint**: `DELETE /api/users/me`

**Headers**:
```
Authorization: Bearer {accessToken}
```

**Request**:
```json
{
  "password": "SecurePass123!",
  "confirmDeletion": "DELETE MY ACCOUNT"
}
```

**Response** (200 OK):
```json
{
  "message": "Account deleted successfully"
}
```

---

## Workflow API

### List Workflows

**Endpoint**: `GET /api/workflows`

**Headers**:
```
Authorization: Bearer {accessToken}
```

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20, max: 100)
- `active` (optional): Filter by active status (true/false)

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": "workflow_abc123",
      "name": "My Workflow",
      "active": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

### Get Workflow

**Endpoint**: `GET /api/workflows/{workflowId}`

**Headers**:
```
Authorization: Bearer {accessToken}
```

**Response** (200 OK):
```json
{
  "id": "workflow_abc123",
  "name": "My Workflow",
  "active": true,
  "nodes": [...],
  "connections": {...},
  "settings": {...}
}
```

### Create Workflow

**Endpoint**: `POST /api/workflows`

**Headers**:
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request**:
```json
{
  "name": "New Workflow",
  "nodes": [...],
  "connections": {...}
}
```

**Response** (201 Created):
```json
{
  "id": "workflow_xyz789",
  "name": "New Workflow",
  "active": false
}
```

### Update Workflow

**Endpoint**: `PATCH /api/workflows/{workflowId}`

**Headers**:
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request**:
```json
{
  "name": "Updated Workflow Name",
  "active": true
}
```

**Response** (200 OK):
```json
{
  "id": "workflow_abc123",
  "name": "Updated Workflow Name",
  "active": true
}
```

### Delete Workflow

**Endpoint**: `DELETE /api/workflows/{workflowId}`

**Headers**:
```
Authorization: Bearer {accessToken}
```

**Response** (200 OK):
```json
{
  "message": "Workflow deleted successfully"
}
```

---

## Team Collaboration API

### Create Team

**Endpoint**: `POST /api/teams`

**Headers**:
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request**:
```json
{
  "name": "Marketing Team",
  "maxMembers": 50
}
```

**Response** (201 Created):
```json
{
  "id": "team_abc123",
  "name": "Marketing Team",
  "ownerId": "usr_xyz789",
  "maxMembers": 50,
  "currentMembers": 1
}
```

### Invite Team Member

**Endpoint**: `POST /api/teams/{teamId}/invite`

**Headers**:
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request**:
```json
{
  "email": "member@example.com",
  "role": "editor"
}
```

**Response** (200 OK):
```json
{
  "inviteId": "invite_abc123",
  "email": "member@example.com",
  "expiresAt": "2024-01-22T00:00:00Z"
}
```

### Share Workflow

**Endpoint**: `POST /api/workflows/{workflowId}/share`

**Headers**:
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request**:
```json
{
  "userId": "usr_abc123",
  "permission": "edit"
}
```

**Parameters**:
- `permission`: view, edit, admin

**Response** (200 OK):
```json
{
  "workflowId": "workflow_xyz789",
  "userId": "usr_abc123",
  "permission": "edit"
}
```

---

## Platform Publishing API

### Publish Content

**Endpoint**: `POST /webhook/publish`

**Headers**:
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request**:
```json
{
  "contentId": "content_abc123",
  "platforms": ["youtube", "linkedin", "twitter"],
  "scheduleTime": "optimal",
  "industry": "auto-detect",
  "abTest": true
}
```

**Parameters**:
- `contentId` (required): Content ID from waterfall
- `platforms` (required): Array of target platforms
- `scheduleTime` (optional): ISO timestamp or "optimal" for AI-determined timing
- `industry` (optional): Industry context or "auto-detect"
- `abTest` (optional): Enable A/B testing (boolean)

**Response** (202 Accepted):
```json
{
  "publishId": "pub_abc123",
  "status": "scheduled",
  "detectedIndustry": "ecommerce",
  "confidence": 0.87,
  "posts": [
    {
      "platform": "youtube",
      "status": "scheduled",
      "publishTime": "2024-01-15T18:00:00Z",
      "optimizations": ["thumbnail A/B test", "SEO tags", "chapters"]
    },
    {
      "platform": "linkedin",
      "status": "scheduled",
      "publishTime": "2024-01-15T09:00:00Z",
      "optimizations": ["professional tone", "hashtags", "CTA"]
    }
  ]
}
```

### Get Publication Status

**Endpoint**: `GET /webhook/publish/{publishId}`

**Headers**:
```
Authorization: Bearer {accessToken}
```

**Response** (200 OK):
```json
{
  "publishId": "pub_abc123",
  "status": "completed",
  "posts": [
    {
      "platform": "youtube",
      "status": "published",
      "url": "https://youtube.com/watch?v=...",
      "publishedAt": "2024-01-15T18:00:00Z",
      "analytics": {
        "views": 1234,
        "likes": 56,
        "comments": 12
      }
    }
  ]
}
```

---

## Error Codes

### HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `202 Accepted` - Request accepted for processing
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `422 Unprocessable Entity` - Validation error
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
- `503 Service Unavailable` - Service temporarily unavailable

### Error Response Format

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required field: email",
    "details": {
      "field": "email",
      "constraint": "required"
    }
  }
}
```

### Common Error Codes

- `INVALID_REQUEST` - Invalid request parameters
- `AUTHENTICATION_REQUIRED` - Missing or invalid token
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `QUOTA_EXCEEDED` - User has exceeded their quota
- `INVALID_TOKEN` - JWT token is invalid or expired
- `WEAK_PASSWORD` - Password doesn't meet requirements
- `EMAIL_ALREADY_EXISTS` - Email is already registered

---

## Rate Limiting

### Default Limits

- **API Endpoints**: 100 requests per 15 minutes
- **Authentication**: 5 requests per 15 minutes
- **Upload**: 10 requests per 15 minutes

### Rate Limit Headers

Every response includes:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704470400
```

### Rate Limit Exceeded Response

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "retryAfter": 1704470400
  }
}
```

---

## Webhooks

### Configure Webhook

**Endpoint**: `POST /api/webhooks`

**Headers**:
```
Authorization: Bearer {accessToken}
Content-Type: application/json
```

**Request**:
```json
{
  "url": "https://your-domain.com/webhook",
  "events": ["workflow.completed", "task.completed", "content.generated"],
  "secret": "your-webhook-secret"
}
```

**Response** (201 Created):
```json
{
  "id": "webhook_abc123",
  "url": "https://your-domain.com/webhook",
  "events": ["workflow.completed", "task.completed", "content.generated"]
}
```

### Webhook Events

**workflow.completed**:
```json
{
  "event": "workflow.completed",
  "workflowId": "workflow_abc123",
  "executionId": "execution_xyz789",
  "status": "success",
  "timestamp": "2024-01-15T14:30:00Z"
}
```

**task.completed**:
```json
{
  "event": "task.completed",
  "taskId": "task_abc123",
  "results": [...],
  "timestamp": "2024-01-15T14:30:00Z"
}
```

**content.generated**:
```json
{
  "event": "content.generated",
  "contentId": "content_abc123",
  "assetsCount": 52,
  "timestamp": "2024-01-15T14:30:00Z"
}
```

### Webhook Signature Verification

All webhook requests include a signature header:

```
X-Webhook-Signature: sha256=...
```

Verify using HMAC SHA256:

```javascript
const crypto = require('crypto');

const signature = req.headers['x-webhook-signature'];
const expectedSignature = 'sha256=' + crypto
  .createHmac('sha256', webhookSecret)
  .update(JSON.stringify(req.body))
  .digest('hex');

if (signature !== expectedSignature) {
  throw new Error('Invalid signature');
}
```

---

## SDK Examples

### JavaScript/Node.js

```javascript
const SwanyThreeClient = require('@swanythree/sdk');

const client = new SwanyThreeClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.your-domain.com'
});

// Create agent swarm task
const task = await client.agentSwarm.create({
  request: 'Create landing page',
  industry: 'ecommerce',
  agents: ['frontend', 'seo']
});

// Upload content
const content = await client.content.upload({
  file: fs.createReadStream('video.mp4'),
  targetPlatforms: ['youtube', 'linkedin']
});

// Publish to platforms
const publish = await client.publish.create({
  contentId: content.id,
  platforms: ['youtube', 'linkedin'],
  scheduleTime: 'optimal'
});
```

### Python

```python
from swanythree import Client

client = Client(
    api_key='your-api-key',
    base_url='https://api.your-domain.com'
)

# Create agent swarm task
task = client.agent_swarm.create(
    request='Create landing page',
    industry='ecommerce',
    agents=['frontend', 'seo']
)

# Upload content
with open('video.mp4', 'rb') as f:
    content = client.content.upload(
        file=f,
        target_platforms=['youtube', 'linkedin']
    )

# Publish to platforms
publish = client.publish.create(
    content_id=content['id'],
    platforms=['youtube', 'linkedin'],
    schedule_time='optimal'
)
```

---

**Version**: 1.0.0
**Last Updated**: 2024-01-15
**Support**: api-support@your-domain.com
