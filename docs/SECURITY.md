# SwanyThree Ultimate Platform - Security Documentation

## Table of Contents
1. [Security Overview](#security-overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [SSL/TLS Configuration](#ssltls-configuration)
4. [Rate Limiting & DDoS Protection](#rate-limiting--ddos-protection)
5. [Data Encryption](#data-encryption)
6. [API Security](#api-security)
7. [Database Security](#database-security)
8. [Secret Management](#secret-management)
9. [CORS & CSP](#cors--csp)
10. [Security Headers](#security-headers)
11. [Vulnerability Management](#vulnerability-management)
12. [Compliance](#compliance)
13. [Incident Response](#incident-response)
14. [Security Checklist](#security-checklist)

---

## Security Overview

The SwanyThree Ultimate Platform implements **defense-in-depth** security with multiple layers:

```
┌─────────────────────────────────────────────────────┐
│              Layer 7: Monitoring & Alerts            │
│  (Security Logs, Intrusion Detection, Audit Trails) │
├─────────────────────────────────────────────────────┤
│              Layer 6: Application Security           │
│      (Input Validation, CSRF Protection, XSS)       │
├─────────────────────────────────────────────────────┤
│              Layer 5: Authentication & RBAC          │
│         (JWT, Multi-Factor Auth, Permissions)       │
├─────────────────────────────────────────────────────┤
│              Layer 4: API Security                   │
│     (Rate Limiting, API Keys, OAuth 2.0)           │
├─────────────────────────────────────────────────────┤
│              Layer 3: Data Encryption                │
│      (AES-256 at rest, TLS 1.3 in transit)         │
├─────────────────────────────────────────────────────┤
│              Layer 2: Network Security               │
│    (Firewall, CORS, Security Headers, DDoS)        │
├─────────────────────────────────────────────────────┤
│              Layer 1: Infrastructure                 │
│       (SSL/TLS, Secure Hosting, Backups)           │
└─────────────────────────────────────────────────────┘
```

### Security Principles

1. **Zero Trust**: Never trust, always verify
2. **Least Privilege**: Minimum necessary permissions
3. **Defense in Depth**: Multiple security layers
4. **Secure by Default**: Secure configuration out of the box
5. **Regular Audits**: Continuous security monitoring

---

## Authentication & Authorization

### JWT Authentication

**Token Structure**:
```javascript
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "usr_123",
    "email": "user@example.com",
    "role": "pro",
    "teamId": "team_456",
    "iat": 1704470400,
    "exp": 1704471300
  },
  "signature": "..."
}
```

**Token Lifecycle**:
- **Access Token**: 15 minutes expiration
- **Refresh Token**: 7 days expiration
- **Refresh Window**: Last 24 hours of refresh token validity

**Implementation**:
```typescript
// Token generation (N8N Function node)
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ACCESS_EXPIRATION = '15m';
const JWT_REFRESH_EXPIRATION = '7d';

function generateTokens(user: User) {
  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      teamId: user.teamId
    },
    JWT_SECRET,
    { expiresIn: JWT_ACCESS_EXPIRATION }
  );

  const refreshToken = jwt.sign(
    {
      userId: user.id,
      type: 'refresh'
    },
    JWT_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRATION }
  );

  return { accessToken, refreshToken };
}

// Token verification
function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    throw new Error('Invalid token');
  }
}
```

### Role-Based Access Control (RBAC)

**Roles & Permissions**:

| Role  | Workflows | Executions/Day | Team Size | Agent Swarm | MCP Access | Admin Panel |
|-------|-----------|----------------|-----------|-------------|------------|-------------|
| Admin | Unlimited | Unlimited      | Unlimited | ✅          | ✅         | ✅          |
| Pro   | Unlimited | 10,000         | 50        | ✅          | ✅         | ❌          |
| Free  | 5         | 100            | 1         | ❌          | ❌         | ❌          |

**Permission Checks**:
```typescript
// Middleware for permission checking
function requirePermission(permission: string) {
  return async (req, res, next) => {
    const user = req.user; // From JWT

    const permissions = {
      admin: ['*'], // All permissions
      pro: ['workflows:create', 'workflows:edit', 'workflows:delete',
            'agents:use', 'mcp:access', 'team:manage'],
      free: ['workflows:view', 'workflows:execute']
    };

    const userPermissions = permissions[user.role] || [];

    if (userPermissions.includes('*') || userPermissions.includes(permission)) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
}

// Usage in N8N workflow
app.post('/api/workflows',
  authenticateJWT,
  requirePermission('workflows:create'),
  createWorkflow
);
```

### Multi-Factor Authentication (MFA)

**Setup MFA**:
```bash
curl -X POST https://localhost:5678/api/auth/mfa/setup \
  -H "Authorization: Bearer $TOKEN"
```

**Response**:
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCode": "data:image/png;base64,iVBORw0KGgo...",
  "backupCodes": [
    "1234-5678",
    "8765-4321",
    "9876-5432"
  ]
}
```

**Verify MFA**:
```bash
curl -X POST https://localhost:5678/api/auth/mfa/verify \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "123456"
  }'
```

### Password Security

**Requirements**:
- Minimum 12 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character
- Not in common password list (10,000 most common)

**Hashing**:
```typescript
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  // Validate password strength
  if (!isStrongPassword(password)) {
    throw new Error('Password does not meet requirements');
  }

  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function isStrongPassword(password: string): boolean {
  const minLength = 12;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return password.length >= minLength &&
         hasUpperCase &&
         hasLowerCase &&
         hasNumbers &&
         hasSpecialChar &&
         !isCommonPassword(password);
}
```

### Session Management

**Configuration**:
```typescript
const sessionConfig = {
  // Store sessions in Redis
  store: new RedisStore({
    client: redisClient,
    prefix: 'sess:',
    ttl: 86400 // 24 hours
  }),

  // Session cookie settings
  cookie: {
    secure: true, // HTTPS only
    httpOnly: true, // No JavaScript access
    sameSite: 'strict', // CSRF protection
    maxAge: 86400000, // 24 hours
    domain: '.your-domain.com'
  },

  // Session settings
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true // Reset expiration on activity
};
```

---

## SSL/TLS Configuration

### Certificate Setup

**Production (Let's Encrypt)**:
```bash
#!/bin/bash
# scripts/setup-ssl.sh

DOMAIN=$1
EMAIL=$2

# Install certbot
apt-get update
apt-get install -y certbot

# Get certificate
certbot certonly \
  --standalone \
  --non-interactive \
  --agree-tos \
  --email $EMAIL \
  -d $DOMAIN

# Copy certificates
cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem /etc/nginx/ssl/cert.pem
cp /etc/letsencrypt/live/$DOMAIN/privkey.pem /etc/nginx/ssl/key.pem

# Setup auto-renewal
echo "0 0 * * * certbot renew --quiet --deploy-hook 'systemctl reload nginx'" | crontab -

echo "SSL certificate installed for $DOMAIN"
```

**Development (Self-Signed)**:
```bash
#!/bin/bash
# Generate self-signed certificate

openssl req -x509 -nodes -days 365 -newkey rsa:4096 \
  -keyout /etc/nginx/ssl/key.pem \
  -out /etc/nginx/ssl/cert.pem \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
```

### NGINX SSL Configuration

**config/nginx/ssl.conf**:
```nginx
# SSL Protocols (TLS 1.2 and 1.3 only)
ssl_protocols TLSv1.2 TLSv1.3;

# Strong cipher suites
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';

# Prefer server ciphers
ssl_prefer_server_ciphers on;

# SSL session settings
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
ssl_session_tickets off;

# OCSP stapling
ssl_stapling on;
ssl_stapling_verify on;
ssl_trusted_certificate /etc/nginx/ssl/cert.pem;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;

# DH parameters (for perfect forward secrecy)
ssl_dhparam /etc/nginx/ssl/dhparam.pem;
```

**Generate DH Parameters**:
```bash
openssl dhparam -out /etc/nginx/ssl/dhparam.pem 4096
```

### SSL Testing

```bash
# Test SSL configuration
curl -I https://your-domain.com

# SSL Labs test
curl "https://api.ssllabs.com/api/v3/analyze?host=your-domain.com"

# Expected rating: A+ or A
```

---

## Rate Limiting & DDoS Protection

### NGINX Rate Limiting

**config/nginx/rate-limit.conf**:
```nginx
# Define rate limit zones
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/m;
limit_req_zone $binary_remote_addr zone=upload_limit:10m rate=10r/m;

# Connection limits
limit_conn_zone $binary_remote_addr zone=conn_limit:10m;

server {
    # API endpoints - 100 requests per minute
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        limit_conn conn_limit 10;

        # Return 429 on limit exceeded
        limit_req_status 429;
        limit_conn_status 429;
    }

    # Auth endpoints - 5 requests per minute (prevent brute force)
    location /api/auth/ {
        limit_req zone=auth_limit burst=2 nodelay;
        limit_conn conn_limit 5;
    }

    # Upload endpoints - 10 requests per minute
    location /webhook/content-upload {
        limit_req zone=upload_limit burst=5 nodelay;

        # Large file upload timeout
        client_max_body_size 500M;
        client_body_timeout 300s;
    }
}
```

### Application-Level Rate Limiting

**Redis-based rate limiting**:
```typescript
import { Redis } from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
  password: process.env.REDIS_PASSWORD
});

async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {

  const now = Date.now();
  const windowKey = `ratelimit:${key}:${Math.floor(now / (windowSeconds * 1000))}`;

  const count = await redis.incr(windowKey);

  if (count === 1) {
    await redis.expire(windowKey, windowSeconds);
  }

  const remaining = Math.max(0, limit - count);
  const resetAt = now + (windowSeconds * 1000);

  return {
    allowed: count <= limit,
    remaining,
    resetAt
  };
}

// Usage in N8N Function node
const userId = $node["Webhook"].json.user.id;
const rateLimit = await checkRateLimit(`user:${userId}`, 100, 900); // 100 req per 15min

if (!rateLimit.allowed) {
  return {
    json: {
      error: 'Rate limit exceeded',
      retryAfter: rateLimit.resetAt
    },
    statusCode: 429
  };
}
```

### DDoS Protection

**CloudFlare Integration** (Recommended):
```nginx
# config/nginx/cloudflare.conf

# Only allow CloudFlare IPs
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
# ... (add all CloudFlare IP ranges)

real_ip_header CF-Connecting-IP;
real_ip_recursive on;

# Block requests not from CloudFlare
geo $cloudflare {
    default 0;
    173.245.48.0/20 1;
    103.21.244.0/22 1;
    # ... (add all CloudFlare IP ranges)
}

server {
    if ($cloudflare = 0) {
        return 403;
    }
}
```

**Fail2Ban Configuration**:
```ini
# /etc/fail2ban/jail.d/nginx-ratelimit.conf

[nginx-rate-limit]
enabled = true
port = http,https
filter = nginx-rate-limit
logpath = /var/log/nginx/error.log
maxretry = 5
findtime = 600
bantime = 3600
action = iptables-multiport[name=RateLimit, port="http,https", protocol=tcp]
```

---

## Data Encryption

### Encryption at Rest

**Database Encryption**:
```yaml
# PostgreSQL encryption
# postgresql.conf

# Enable encryption
ssl = on
ssl_cert_file = '/etc/ssl/certs/server.crt'
ssl_key_file = '/etc/ssl/private/server.key'

# Encrypt data at rest (requires pgcrypto extension)
shared_preload_libraries = 'pgcrypto'
```

**Encrypt sensitive fields**:
```sql
-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypt user data
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,

    -- Encrypted fields
    api_key BYTEA, -- Encrypted with AES-256
    oauth_tokens BYTEA,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Encrypt data
INSERT INTO users (email, password_hash, api_key)
VALUES (
    'user@example.com',
    '$2b$12$...',
    pgp_sym_encrypt('sk-ant-api-key-123', 'encryption-key')
);

-- Decrypt data
SELECT
    email,
    pgp_sym_decrypt(api_key, 'encryption-key') AS api_key_decrypted
FROM users
WHERE email = 'user@example.com';
```

**File Encryption (S3)**:
```typescript
import { S3 } from '@aws-sdk/client-s3';

const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

async function uploadEncryptedFile(file: Buffer, key: string) {
  await s3.putObject({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: file,

    // Server-side encryption (AES-256)
    ServerSideEncryption: 'AES256',

    // Or use KMS
    // ServerSideEncryption: 'aws:kms',
    // SSEKMSKeyId: 'your-kms-key-id',

    // Access control
    ACL: 'private'
  });
}
```

### Encryption in Transit

**All HTTP → HTTPS redirect**:
```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;

    return 301 https://$server_name$request_uri;
}
```

**Internal service encryption**:
```yaml
# docker-compose.yml

services:
  n8n:
    environment:
      # Force HTTPS
      N8N_PROTOCOL: https

      # Database connection with SSL
      DB_POSTGRESDB_SSL_ENABLED: true
      DB_POSTGRESDB_SSL_REJECT_UNAUTHORIZED: true

      # Redis connection with TLS
      QUEUE_BULL_REDIS_TLS: true
```

---

## API Security

### API Key Management

**Generate API Key**:
```typescript
import * as crypto from 'crypto';

function generateAPIKey(): string {
  return 'sk_' + crypto.randomBytes(32).toString('hex');
}

// Store hashed version
async function createAPIKey(userId: string) {
  const apiKey = generateAPIKey();
  const hashedKey = await bcrypt.hash(apiKey, 10);

  await db.query(
    'INSERT INTO api_keys (user_id, key_hash, created_at) VALUES ($1, $2, NOW())',
    [userId, hashedKey]
  );

  // Return key only once (never stored in plain text)
  return apiKey;
}
```

**API Key Authentication**:
```typescript
async function authenticateAPIKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  // Find matching key
  const keys = await db.query('SELECT * FROM api_keys WHERE revoked = false');

  for (const key of keys.rows) {
    if (await bcrypt.compare(apiKey, key.key_hash)) {
      req.user = await getUser(key.user_id);
      return next();
    }
  }

  return res.status(401).json({ error: 'Invalid API key' });
}
```

### Input Validation

**Sanitize all inputs**:
```typescript
import * as validator from 'validator';
import * as DOMPurify from 'isomorphic-dompurify';

function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Remove HTML tags
    input = DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });

    // Escape special characters
    input = validator.escape(input);

    // Trim whitespace
    input = input.trim();
  }

  return input;
}

function validateEmail(email: string): boolean {
  return validator.isEmail(email);
}

function validateURL(url: string): boolean {
  return validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true
  });
}

// Schema validation with Zod
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12).max(128),
  name: z.string().min(1).max(255),
  role: z.enum(['admin', 'pro', 'free'])
});

function validateUser(data: unknown) {
  return userSchema.parse(data);
}
```

### CSRF Protection

**CSRF Token Implementation**:
```typescript
import * as csrf from 'csurf';

const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  }
});

// Generate token
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Validate token
app.post('/api/protected', csrfProtection, (req, res) => {
  // CSRF token automatically validated
  res.json({ success: true });
});
```

### SQL Injection Prevention

**Always use parameterized queries**:
```typescript
// ❌ NEVER do this (vulnerable to SQL injection)
const query = `SELECT * FROM users WHERE email = '${email}'`;
await db.query(query);

// ✅ Always use parameterized queries
const query = 'SELECT * FROM users WHERE email = $1';
await db.query(query, [email]);

// ✅ Use ORM with prepared statements
const user = await db.users.findOne({ where: { email } });
```

### XSS Prevention

**Content Security Policy**:
```nginx
# config/nginx/security-headers.conf

add_header Content-Security-Policy "
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https:;
    connect-src 'self' https://api.anthropic.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
" always;
```

**Output encoding**:
```typescript
import * as he from 'he';

function encodeOutput(text: string): string {
  return he.encode(text, {
    useNamedReferences: true,
    decimal: false
  });
}

// In templates
const safeText = encodeOutput(userInput);
```

---

## Database Security

### PostgreSQL Hardening

**postgresql.conf**:
```ini
# Connection settings
listen_addresses = 'localhost'  # Only local connections
max_connections = 100

# SSL settings
ssl = on
ssl_cert_file = '/etc/ssl/certs/server.crt'
ssl_key_file = '/etc/ssl/private/server.key'
ssl_ca_file = '/etc/ssl/certs/ca.crt'
ssl_ciphers = 'HIGH:MEDIUM:+3DES:!aNULL'

# Authentication
password_encryption = scram-sha-256

# Logging
log_connections = on
log_disconnections = on
log_duration = on
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
log_statement = 'ddl'  # Log all DDL statements

# Security
shared_preload_libraries = 'pgaudit'  # Audit logging
```

**pg_hba.conf**:
```
# TYPE  DATABASE        USER            ADDRESS                 METHOD

# Local connections
local   all             postgres                                peer

# IPv4 local connections
host    all             all             127.0.0.1/32            scram-sha-256

# IPv6 local connections
host    all             all             ::1/128                 scram-sha-256

# Replication connections
host    replication     replicator      10.0.0.0/8              scram-sha-256

# Deny all other connections
host    all             all             0.0.0.0/0               reject
```

### Database Access Control

**Create limited user**:
```sql
-- Create application user (not superuser)
CREATE USER n8n_app WITH PASSWORD 'SecurePassword123!';

-- Grant only necessary permissions
GRANT CONNECT ON DATABASE n8n TO n8n_app;
GRANT USAGE ON SCHEMA public TO n8n_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO n8n_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO n8n_app;

-- Prevent table creation
REVOKE CREATE ON SCHEMA public FROM n8n_app;

-- Row-level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_isolation ON users
    FOR ALL
    TO n8n_app
    USING (id = current_setting('app.current_user_id')::uuid);
```

### Database Backups

**Automated backup script**:
```bash
#!/bin/bash
# scripts/backup-db.sh

BACKUP_DIR="/var/backups/postgresql"
DATE=$(date +%Y-%m-%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/n8n-$DATE.sql.gz"

# Create backup
pg_dump -U postgres n8n | gzip > $BACKUP_FILE

# Encrypt backup
gpg --encrypt --recipient backup@your-domain.com $BACKUP_FILE
rm $BACKUP_FILE

# Upload to S3
aws s3 cp "$BACKUP_FILE.gpg" s3://your-backup-bucket/postgresql/

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql.gz.gpg" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE.gpg"
```

---

## Secret Management

### Environment Variables

**Never commit secrets**:
```bash
# .gitignore
.env
.env.local
.env.production
secrets/
*.key
*.pem
```

**Use secret management service**:
```typescript
// AWS Secrets Manager
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

async function getSecret(secretName: string): Promise<string> {
  const client = new SecretsManagerClient({ region: process.env.AWS_REGION });

  const command = new GetSecretValueCommand({ SecretId: secretName });
  const response = await client.send(command);

  return response.SecretString;
}

// Usage
const anthropicKey = await getSecret('anthropic-api-key');
```

### Credential Rotation

**Rotate API keys monthly**:
```bash
#!/bin/bash
# scripts/rotate-api-keys.sh

# Generate new key
NEW_KEY=$(openssl rand -hex 32)

# Update in Secrets Manager
aws secretsmanager update-secret \
  --secret-id anthropic-api-key \
  --secret-string "$NEW_KEY"

# Restart services to pick up new key
docker-compose restart n8n

echo "API key rotated successfully"
```

---

## CORS & CSP

### CORS Configuration

**NGINX CORS**:
```nginx
# config/nginx/cors.conf

# Allowed origins (production)
set $cors_origin "";
if ($http_origin ~* (https://app\.your-domain\.com|https://admin\.your-domain\.com)) {
    set $cors_origin $http_origin;
}

# CORS headers
add_header 'Access-Control-Allow-Origin' $cors_origin always;
add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type, X-CSRF-Token' always;
add_header 'Access-Control-Allow-Credentials' 'true' always;
add_header 'Access-Control-Max-Age' 86400 always;

# Handle preflight
if ($request_method = 'OPTIONS') {
    add_header 'Access-Control-Allow-Origin' $cors_origin;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type, X-CSRF-Token';
    add_header 'Access-Control-Max-Age' 86400;
    add_header 'Content-Type' 'text/plain; charset=utf-8';
    add_header 'Content-Length' 0;
    return 204;
}
```

### Content Security Policy

**Strict CSP**:
```nginx
add_header Content-Security-Policy "
    default-src 'self';
    script-src 'self' 'nonce-{random}' https://cdn.jsdelivr.net;
    style-src 'self' 'nonce-{random}' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https:;
    connect-src 'self' https://api.anthropic.com https://api.openai.com;
    media-src 'self' https://cdn.your-domain.com;
    object-src 'none';
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
    upgrade-insecure-requests;
    block-all-mixed-content;
" always;
```

---

## Security Headers

**Complete security headers**:
```nginx
# config/nginx/security-headers.conf

# HSTS (force HTTPS for 1 year)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# Prevent clickjacking
add_header X-Frame-Options "DENY" always;

# Prevent MIME type sniffing
add_header X-Content-Type-Options "nosniff" always;

# XSS protection
add_header X-XSS-Protection "1; mode=block" always;

# Referrer policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Permissions policy
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

# Remove server header
server_tokens off;
more_clear_headers Server;
```

---

## Vulnerability Management

### Dependency Scanning

**Automated scanning**:
```bash
# npm audit
npm audit

# Fix vulnerabilities
npm audit fix

# CI/CD integration
npm audit --audit-level=high
if [ $? -ne 0 ]; then
    echo "High/Critical vulnerabilities found"
    exit 1
fi
```

**Snyk integration**:
```yaml
# .github/workflows/security.yml

name: Security Scan
on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### Security Audits

**Monthly security checklist**:
- [ ] Review access logs for anomalies
- [ ] Rotate API keys and secrets
- [ ] Update dependencies
- [ ] Review user permissions
- [ ] Check SSL certificate expiration
- [ ] Test backup restoration
- [ ] Review firewall rules
- [ ] Scan for vulnerabilities
- [ ] Update security policies

---

## Compliance

### GDPR Compliance

**Data privacy features**:
- User data export
- Right to be forgotten
- Consent management
- Data encryption
- Audit logging

**Implement data export**:
```bash
curl -X GET https://localhost:5678/api/users/me/export \
  -H "Authorization: Bearer $TOKEN"
```

**Implement account deletion**:
```bash
curl -X DELETE https://localhost:5678/api/users/me \
  -H "Authorization: Bearer $TOKEN"
```

### SOC 2 Compliance

**Controls implemented**:
- Access control (RBAC)
- Encryption (at rest and in transit)
- Logging and monitoring
- Incident response
- Business continuity (backups)

---

## Incident Response

### Security Incident Playbook

**1. Detection**:
- Monitor alerts in Grafana/Prometheus
- Review security logs
- User reports

**2. Containment**:
```bash
# Isolate affected systems
docker-compose stop n8n-1

# Block malicious IP
iptables -A INPUT -s <malicious-ip> -j DROP

# Revoke compromised tokens
./scripts/revoke-tokens.sh --user <userId>
```

**3. Investigation**:
```bash
# Review logs
docker-compose logs n8n | grep <suspicious-activity>

# Check database for unauthorized access
SELECT * FROM audit_log
WHERE timestamp > NOW() - INTERVAL '24 hours'
ORDER BY timestamp DESC;
```

**4. Eradication**:
```bash
# Update passwords
./scripts/force-password-reset.sh --all-users

# Rotate secrets
./scripts/rotate-all-secrets.sh

# Update dependencies
npm audit fix
```

**5. Recovery**:
```bash
# Restore from backup if needed
./scripts/restore-db.sh <backup-file>

# Restart services
docker-compose up -d
```

**6. Post-Incident**:
- Document incident
- Update security policies
- Train team
- Improve detection

---

## Security Checklist

### Pre-Deployment

- [ ] SSL/TLS configured (A+ rating)
- [ ] All secrets in environment variables or secret manager
- [ ] Strong password policy enforced
- [ ] JWT with short expiration
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers set
- [ ] Database user has minimal permissions
- [ ] All dependencies up to date
- [ ] Vulnerability scan passed
- [ ] Backups configured and tested
- [ ] Monitoring and alerting active
- [ ] Incident response plan documented

### Post-Deployment

- [ ] Monitor security logs daily
- [ ] Review access logs weekly
- [ ] Rotate secrets monthly
- [ ] Update dependencies monthly
- [ ] Security audit quarterly
- [ ] Penetration testing annually

---

## Reporting Security Issues

If you discover a security vulnerability, please email:

**security@your-domain.com**

Do NOT create a public GitHub issue.

We will respond within 24 hours and provide a timeline for resolution.

---

**Version**: 1.0.0
**Last Updated**: 2024-01-15
**Security Team**: security@your-domain.com
