# Claude API Overview

> Comprehensive guide to the Claude API for building AI-powered applications

## Introduction

The Claude API is a RESTful API at `https://api.anthropic.com` that provides programmatic access to Claude models. The primary API is the Messages API (`POST /v1/messages`) for conversational interactions.

This document provides an overview of the Claude API, including authentication, available endpoints, rate limits, and best practices.

## Prerequisites

To use the Claude API, you'll need:

- An [Anthropic Console account](https://console.anthropic.com)
- An [API key](https://console.anthropic.com/settings/keys)

## Available APIs

### General Availability

- **[Messages API](https://docs.anthropic.com/api/messages)**: Send messages to Claude for conversational interactions (`POST /v1/messages`)
- **[Message Batches API](https://docs.anthropic.com/api/creating-message-batches)**: Process large volumes of Messages requests asynchronously with 50% cost reduction (`POST /v1/messages/batches`)
- **[Token Counting API](https://docs.anthropic.com/api/messages-count-tokens)**: Count tokens in a message before sending to manage costs and rate limits (`POST /v1/messages/count_tokens`)
- **[Models API](https://docs.anthropic.com/api/models-list)**: List available Claude models and their details (`GET /v1/models`)

### Beta

- **[Files API](https://docs.anthropic.com/api/files-create)**: Upload and manage files for use across multiple API calls (`POST /v1/files`, `GET /v1/files`)
- **[Skills API](https://docs.anthropic.com/api/skills/create-skill)**: Create and manage custom agent skills (`POST /v1/skills`, `GET /v1/skills`)

## Authentication

All requests to the Claude API must include these headers:

| Header | Value | Required |
|--------|-------|----------|
| `x-api-key` | Your API key from Console | Yes |
| `anthropic-version` | API version (e.g., `2023-06-01`) | Yes |
| `content-type` | `application/json` | Yes |

### Getting API Keys

1. Sign up at [console.anthropic.com](https://console.anthropic.com)
2. Navigate to [Account Settings → API Keys](https://console.anthropic.com/settings/keys)
3. Click "Create Key"
4. Copy and securely store your API key
5. Use the key in the `x-api-key` header

**Security Best Practices:**
- Never commit API keys to version control
- Use environment variables to store keys
- Rotate keys regularly
- Use separate keys for different environments
- Monitor key usage in the Console

### Example Request

```bash
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: $ANTHROPIC_API_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello, Claude"}
    ]
  }'
```

**Response:**
```json
{
  "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Hello! How can I assist you today?"
    }
  ],
  "model": "claude-sonnet-4-5",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 12,
    "output_tokens": 8
  }
}
```

## Client SDKs

Anthropic provides official SDKs that simplify API integration:

| Language | Installation | Repository |
|----------|-------------|------------|
| **Python** | `pip install anthropic` | [anthropic-sdk-python](https://github.com/anthropics/anthropic-sdk-python) |
| **TypeScript** | `npm install @anthropic-ai/sdk` | [anthropic-sdk-typescript](https://github.com/anthropics/anthropic-sdk-typescript) |
| **Java** | Maven/Gradle | [anthropic-sdk-java](https://github.com/anthropics/anthropic-sdk-java) |
| **Go** | `go get github.com/anthropics/anthropic-sdk-go` | [anthropic-sdk-go](https://github.com/anthropics/anthropic-sdk-go) |
| **C#** | `dotnet add package Anthropic.SDK` | [anthropic-sdk-dotnet](https://github.com/anthropics/anthropic-sdk-dotnet) |
| **Ruby** | `gem install anthropic` | [anthropic-sdk-ruby](https://github.com/anthropics/anthropic-sdk-ruby) |
| **PHP** | `composer require anthropic/sdk` | [anthropic-sdk-php](https://github.com/anthropics/anthropic-sdk-php) |

### SDK Benefits

- Automatic header management
- Type-safe request and response handling
- Built-in retry logic and error handling
- Streaming support
- Request timeouts and connection management

### SDK Example (Python)

```python
from anthropic import Anthropic

client = Anthropic()  # Reads ANTHROPIC_API_KEY from environment

message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello, Claude"}
    ]
)

print(message.content)
```

## Request and Response Format

### Request Size Limits

| Endpoint | Maximum Size |
|----------|--------------|
| Standard endpoints | 32 MB |
| Batch API | 256 MB |
| Files API | 500 MB |

Exceeding these limits results in a 413 `request_too_large` error.

### Response Headers

Every response includes:

- `request-id`: Globally unique identifier for the request
- `anthropic-organization-id`: Organization ID associated with the API key

## Rate Limits

The API enforces rate limits and spend limits organized into usage tiers.

### Usage Tiers

| Tier | Monthly Spend | Max Requests/Min | Max Tokens/Min |
|------|---------------|------------------|----------------|
| **Free** | $0 | 50 | 50,000 |
| **Tier 1** | $5+ | 100 | 100,000 |
| **Tier 2** | $100+ | 1,000 | 1,000,000 |
| **Tier 3** | $1,000+ | 5,000 | 5,000,000 |
| **Tier 4** | $10,000+ | 20,000 | 20,000,000 |

### Rate Limit Headers

Responses include rate limit information:

```
x-ratelimit-requests-limit: 100
x-ratelimit-requests-remaining: 95
x-ratelimit-requests-reset: 2024-01-01T00:00:00Z
x-ratelimit-tokens-limit: 100000
x-ratelimit-tokens-remaining: 95000
x-ratelimit-tokens-reset: 2024-01-01T00:00:00Z
```

### Handling Rate Limits

**Best practices:**

1. **Implement exponential backoff** for 429 errors
2. **Monitor rate limit headers** to avoid limits
3. **Use batch API** for high-volume workloads
4. **Cache responses** when appropriate
5. **Upgrade tier** for higher limits

## Claude Models

### Available Models

| Model | Context | Best For | Pricing (Input/Output) |
|-------|---------|----------|------------------------|
| **Claude Opus 4.5** | 200k | Maximum intelligence | $5 / $25 per million tokens |
| **Claude Sonnet 4.5** | 200k/1M | Complex agents, coding | $3 / $15 per million tokens |
| **Claude Haiku 4.5** | 200k | Speed, high-volume | $1 / $5 per million tokens |
| **Claude Opus 4.1** | 200k | High intelligence | $15 / $75 per million tokens |
| **Claude Sonnet 3.7** | 200k | Balanced performance | $3 / $15 per million tokens |

### Model Selection Guide

**For maximum intelligence:**
- Use **Claude Opus 4.5** or **Opus 4.1**
- Best for complex reasoning, analysis, creative tasks

**For coding and agents:**
- Use **Claude Sonnet 4.5**
- Best for software development, autonomous agents

**For speed and volume:**
- Use **Claude Haiku 4.5**
- Best for real-time applications, high-volume processing

## Third-Party Platforms

Claude is also available through:

| Platform | Provider | Documentation |
|----------|----------|---------------|
| **Amazon Bedrock** | AWS | [Claude on Bedrock](https://docs.anthropic.com/claude/docs/claude-on-amazon-bedrock) |
| **Vertex AI** | Google Cloud | [Claude on Vertex AI](https://docs.anthropic.com/claude/docs/claude-on-vertex-ai) |
| **Azure AI** | Microsoft Azure | [Claude on Azure](https://docs.anthropic.com/claude/docs/claude-in-microsoft-foundry) |

### When to Use Third-Party Platforms

**Choose third-party platforms if:**
- You have existing cloud provider commitments
- You need specific compliance requirements
- You want consolidated cloud billing
- You require cloud-specific integrations

**Choose Claude API (1P) if:**
- You want latest features first
- You prefer direct relationship with Anthropic
- You need maximum feature compatibility
- You want unified billing across platforms

## Key Features

### Streaming

Stream responses token-by-token for better UX:

```python
with client.messages.stream(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a story"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

### Extended Thinking

Enable extended thinking for enhanced reasoning:

```python
response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["extended-thinking-2025-01-09"],
    max_tokens=4096,
    thinking={
        "type": "enabled",
        "budget_tokens": 2000
    },
    messages=[{"role": "user", "content": "Solve this complex problem..."}]
)
```

### Tool Use

Enable Claude to use external tools:

```python
tools = [
    {
        "name": "get_weather",
        "description": "Get weather for a location",
        "input_schema": {
            "type": "object",
            "properties": {
                "location": {"type": "string"}
            }
        }
    }
]

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "What's the weather in San Francisco?"}]
)
```

### Prompt Caching

Reduce costs by caching frequently used prompts:

```python
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are a helpful assistant...",
            "cache_control": {"type": "ephemeral"}
        }
    ],
    messages=[{"role": "user", "content": "Hello"}]
)
```

**Benefits:**
- 90% cost reduction for cached content
- Faster response times
- Ideal for large prompts, documents, or context

### Vision

Analyze images alongside text:

```python
import base64

with open("image.jpg", "rb") as f:
    image_data = base64.standard_b64encode(f.read()).decode("utf-8")

response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/jpeg",
                    "data": image_data
                }
            },
            {
                "type": "text",
                "text": "Describe this image"
            }
        ]
    }]
)
```

## Error Handling

### Common Error Codes

| Code | Status | Description | Solution |
|------|--------|-------------|----------|
| `invalid_request_error` | 400 | Malformed request | Check request format |
| `authentication_error` | 401 | Invalid API key | Verify API key |
| `permission_error` | 403 | Access denied | Check API key permissions |
| `not_found_error` | 404 | Resource not found | Verify endpoint URL |
| `rate_limit_error` | 429 | Rate limit exceeded | Implement backoff |
| `overloaded_error` | 529 | Service overloaded | Retry with backoff |

### Error Response Format

```json
{
  "type": "error",
  "error": {
    "type": "rate_limit_error",
    "message": "Rate limit exceeded. Please retry after 60 seconds."
  }
}
```

### Retry Strategy

```python
import time
from anthropic import APIError, RateLimitError

max_retries = 3
retry_delay = 1

for attempt in range(max_retries):
    try:
        response = client.messages.create(...)
        break
    except RateLimitError as e:
        if attempt < max_retries - 1:
            time.sleep(retry_delay * (2 ** attempt))
        else:
            raise
```

## Best Practices

### Performance

- Use streaming for better UX
- Implement prompt caching for repeated content
- Use batch API for high-volume workloads
- Choose appropriate model for task complexity

### Cost Optimization

- Use Haiku for simple tasks
- Cache frequently used prompts
- Use batch API for 50% discount
- Monitor token usage with count API

### Security

- Never expose API keys in client-side code
- Use environment variables for keys
- Implement rate limiting on your end
- Validate all user inputs
- Monitor usage for anomalies

### Reliability

- Implement retry logic with exponential backoff
- Handle all error types gracefully
- Monitor response times and errors
- Use request IDs for debugging
- Test with various inputs

## Monitoring and Debugging

### Console Dashboard

Monitor usage at [console.anthropic.com](https://console.anthropic.com):

- Request volume and costs
- Error rates
- Rate limit usage
- Model performance

### Request IDs

Every response includes a `request-id` header. Save these for troubleshooting:

```python
response = client.messages.create(...)
request_id = response.response_headers.get('request-id')
print(f"Request ID: {request_id}")
```

### Logging

Log important request details:

```python
import logging

logging.info(f"Request: {request_id}, Model: {model}, Tokens: {usage.total_tokens}")
```

## Additional Resources

### Documentation
- [Full API Reference](https://docs.anthropic.com/api)
- [Messages API Guide](https://docs.anthropic.com/claude/docs/working-with-messages)
- [Tool Use Guide](https://docs.anthropic.com/claude/docs/tool-use)
- [Vision Guide](https://docs.anthropic.com/claude/docs/vision)

### Community
- [Discord Community](https://discord.gg/anthropic)
- [GitHub Discussions](https://github.com/anthropics/anthropic-sdk-python/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/anthropic)

### Support
- [Anthropic Support](https://support.anthropic.com)
- [API Status](https://status.anthropic.com)
- [Console](https://console.anthropic.com)

---

**Ready to start?** Sign up at [console.anthropic.com](https://console.anthropic.com) and get your API key!

**Need help?** Check the [full documentation](https://docs.anthropic.com) or contact [support](https://support.anthropic.com).
