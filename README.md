# MCP Hub - AI-Powered MCP Server Management Platform

> A Full-Stack AI MVP for managing and monitoring Model Context Protocol (MCP) servers with intelligent automation and analytics

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14%2B-black)](https://nextjs.org/)

## 🚀 Overview

MCP Hub is a comprehensive full-stack web application that transforms how developers and enterprises manage Model Context Protocol (MCP) servers. Built with AI-first principles following the latest MVP development best practices, it combines the power of Claude AI with modern web technologies to deliver intelligent server management, real-time analytics, and automated troubleshooting.

This repository includes both a production-ready web application and comprehensive MCP documentation to help you get started with the Model Context Protocol.

## What is MCP?

The Model Context Protocol (MCP) is a standardized protocol that allows AI applications to securely access:

- **Tools**: Enable Claude to perform actions (file operations, API calls, system commands)
- **Resources**: Provide Claude with data and context (files, databases, documentation)
- **Prompts**: Share reusable prompt templates across applications

MCP servers can be hosted locally on your machine or remotely on the internet, providing flexibility for different use cases and deployment scenarios.

## 🎯 Key Features of MCP Hub

### Web Application Features
- 🎨 **Modern Full-Stack Architecture**: Next.js + React frontend with Node.js/Express backend
- 🤖 **AI-Powered Management**: Claude AI integration for intelligent server configuration and troubleshooting
- 📊 **Real-time Dashboard**: Live server monitoring with WebSocket updates
- 🔒 **Enterprise Security**: JWT authentication, RBAC, and comprehensive audit logging
- 📈 **Advanced Analytics**: Usage tracking, cost analysis, and performance metrics
- 🛠️ **Tool & Resource Management**: Browse, test, and manage MCP server capabilities

### Documentation Features
- 📚 **Comprehensive Guides**: Step-by-step tutorials for local and remote MCP servers
- 💻 **SDK Documentation**: Coverage of all 10 official MCP SDKs
- 🎓 **Best Practices**: AI MVP development patterns and security considerations
- 🔧 **Code Examples**: Ready-to-use configurations and implementation samples

## Repository Structure

```
free/
├── README.md                        # Project overview (this file)
├── APPLICATION_ARCHITECTURE.md      # Detailed architecture documentation
├── package.json                     # Root package.json (monorepo)
├── docker-compose.yml               # Local development infrastructure
│
├── frontend/                        # Next.js frontend application
│   ├── src/
│   │   ├── components/             # React components
│   │   ├── pages/                  # Next.js pages
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── services/               # API services
│   │   └── utils/                  # Utility functions
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                         # Express backend API
│   ├── src/
│   │   ├── routes/                 # API routes
│   │   ├── controllers/            # Route controllers
│   │   ├── services/               # Business logic
│   │   ├── middleware/             # Express middleware
│   │   ├── config/                 # Configuration files
│   │   └── utils/                  # Utility functions
│   ├── prisma/                     # Database schema & migrations
│   │   └── schema.prisma           # Prisma schema
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                            # Comprehensive documentation
│   ├── guides/
│   │   ├── remote-mcp-servers.md   # Remote server guide
│   │   ├── local-mcp-servers.md    # Local server guide
│   │   ├── claude-4.5-features.md  # Claude 4.5 capabilities
│   │   └── sdks.md                 # SDK documentation
│   ├── api/
│   │   └── overview.md             # API documentation
│   └── examples/                    # Configuration examples
│       ├── claude_desktop_config.json
│       └── remote-server-example.md
│
└── LICENSE                          # MIT License
```

## 🚀 Quick Start (Web Application)

### Prerequisites
- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Docker** (for PostgreSQL and Redis)
- **Anthropic API Key** ([Get one here](https://console.anthropic.com/))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/SwanyThree23/free.git
cd free

# 2. Install all dependencies
npm run install:all

# 3. Start infrastructure (PostgreSQL & Redis)
docker-compose up -d

# 4. Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
# Edit the .env files with your configuration

# 5. Initialize the database
cd backend
npm run prisma:generate
npm run migrate
cd ..

# 6. Start development servers
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health**: http://localhost:3001/health

### Technology Stack

#### Frontend
- **Framework**: Next.js 14+ (React 18+)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Data Fetching**: TanStack Query
- **Forms**: React Hook Form + Zod

#### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Auth**: JWT + bcrypt
- **Real-time**: Socket.IO

#### Infrastructure
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+
- **AI**: Anthropic Claude API
- **MCP SDK**: @modelcontextprotocol/sdk

## Quick Start

### For Remote MCP Servers

Connect Claude to internet-hosted MCP servers through Custom Connectors:

1. Navigate to Claude settings → Connectors
2. Click "Add custom connector"
3. Enter the remote MCP server URL
4. Complete authentication
5. Configure tool permissions

**Use cases**: Cloud services, team collaboration, web-based integrations

[→ Full Remote MCP Guide](docs/guides/remote-mcp-servers.md)

### For Local MCP Servers

Connect Claude Desktop to local MCP servers for direct system access:

1. Install prerequisites (Node.js, Claude Desktop)
2. Edit `claude_desktop_config.json`
3. Configure server paths and permissions
4. Restart Claude Desktop

**Use cases**: File system access, local databases, development tools

[→ Full Local MCP Guide](docs/guides/local-mcp-servers.md)

## Key Features

### Remote MCP Servers
- ✅ Access from any MCP client with internet connection
- ✅ No local installation required
- ✅ Ideal for cloud services and APIs
- ✅ Easy team collaboration

### Local MCP Servers
- ✅ Direct access to local resources
- ✅ Enhanced security and privacy
- ✅ No network latency
- ✅ Perfect for development workflows

### Claude 4.5 Capabilities
- 🚀 **Extended thinking**: Enhanced reasoning with summarized output
- 🛠️ **Advanced tool use**: Programmatic calling, tool search, memory
- ⚡ **Performance**: Faster, more efficient responses
- 🎯 **Precision**: Improved instruction following and task execution

## Available MCP Servers

### Official Servers
- **Filesystem**: Read, write, and manage local files
- **GitHub**: Repository access and management
- **Google Drive**: Cloud file operations
- **Slack**: Team communication integration
- **PostgreSQL**: Database queries and operations

### Community Servers
Browse the [MCP servers repository](https://github.com/modelcontextprotocol/servers) for hundreds of community-created integrations.

## Building Your Own MCP Server

Create custom MCP servers using official SDKs:

- **TypeScript/JavaScript**: [typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk)
- **Python**: [python-sdk](https://github.com/modelcontextprotocol/python-sdk)
- **Go**: [go-sdk](https://github.com/modelcontextprotocol/go-sdk)
- **Kotlin**: [kotlin-sdk](https://github.com/modelcontextprotocol/kotlin-sdk)
- **Swift**: [swift-sdk](https://github.com/modelcontextprotocol/swift-sdk)
- **Java**: [java-sdk](https://github.com/modelcontextprotocol/java-sdk)
- **C#**: [csharp-sdk](https://github.com/modelcontextprotocol/csharp-sdk)
- **Ruby**: [ruby-sdk](https://github.com/modelcontextprotocol/ruby-sdk)
- **Rust**: [rust-sdk](https://github.com/modelcontextprotocol/rust-sdk)
- **PHP**: [php-sdk](https://github.com/modelcontextprotocol/php-sdk)

[→ SDK Documentation](docs/guides/sdks.md)

## Example Configurations

### Claude Desktop - Filesystem Server

**macOS:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/Desktop",
        "/Users/username/Downloads"
      ]
    }
  }
}
```

**Windows:**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\username\\Desktop",
        "C:\\Users\\username\\Downloads"
      ]
    }
  }
}
```

[→ More Examples](docs/examples/)

## Documentation

### Guides
- [Remote MCP Servers](docs/guides/remote-mcp-servers.md) - Connect to internet-hosted servers
- [Local MCP Servers](docs/guides/local-mcp-servers.md) - Connect to local servers
- [SDKs](docs/guides/sdks.md) - Build with official SDKs
- [Claude 4.5 Features](docs/guides/claude-4.5-features.md) - Latest capabilities

### API Reference
- [API Overview](docs/api/overview.md) - Claude API documentation
- [Authentication](docs/api/overview.md#authentication) - API keys and headers
- [Rate Limits](docs/api/overview.md#rate-limits-and-availability) - Usage tiers and limits

## Prerequisites

### For Remote MCP Servers
- Claude account (web-based)
- Internet connection
- Remote MCP server URL

### For Local MCP Servers
- [Claude Desktop](https://claude.ai/download) (latest version)
- [Node.js](https://nodejs.org/) (LTS version recommended)
- Operating System: macOS or Windows

## Troubleshooting

### Server Not Showing Up
1. Restart Claude Desktop completely
2. Verify `claude_desktop_config.json` syntax
3. Check file paths are absolute (not relative)
4. Review logs in `~/Library/Logs/Claude` (macOS) or `%APPDATA%\Claude\logs` (Windows)

### Connection Errors
1. Verify internet connectivity (remote servers)
2. Check server URL format (must include `https://`)
3. Confirm authentication credentials
4. Review server-specific logs

### Tool Call Failures
1. Check Claude logs for error messages
2. Verify tool permissions in settings
3. Test manual server execution
4. Restart Claude Desktop

[→ Full Troubleshooting Guide](docs/guides/local-mcp-servers.md#troubleshooting)

## Security Considerations

### Remote Servers
- ✓ Only connect to trusted server sources
- ✓ Review authentication permissions carefully
- ✓ Regularly audit connected servers
- ✓ Remove unused connectors

### Local Servers
- ✓ Grant directory access thoughtfully
- ✓ Use absolute paths in configurations
- ✓ Limit server permissions to necessary directories
- ✓ Review tool actions before approval

## Use Cases

### Development Workflows
- File system management and code editing
- Git repository operations
- Database queries and management
- API testing and integration

### Content Creation
- Document generation and organization
- Research and information gathering
- Multi-source data aggregation
- Automated report creation

### Team Collaboration
- Shared knowledge bases
- Project management integration
- Communication tool connectivity
- Centralized resource access

### Data Processing
- Batch file operations
- Data transformation and analysis
- Multi-step automation workflows
- Cross-platform integrations

## Claude 4.5 Model Variants

### Claude Opus 4.5
- **Best for**: Maximum intelligence with practical performance
- **Context**: 200k tokens
- **Unique**: Effort parameter support
- **Pricing**: $5/$25 per million tokens (input/output)

### Claude Sonnet 4.5
- **Best for**: Complex agents and coding
- **Context**: 200k or 1M tokens (beta)
- **Strengths**: Coding excellence, agent capabilities
- **Pricing**: $3/$15 per million tokens (input/output)

### Claude Haiku 4.5
- **Best for**: High-speed, high-volume tasks
- **Context**: 200k tokens
- **Performance**: Near-frontier at 3x speed
- **Pricing**: $1/$5 per million tokens (input/output)

[→ Full Feature Comparison](docs/guides/claude-4.5-features.md)

## API Features (Beta)

### Advanced Tool Use
- **Programmatic Tool Calling**: Reduce latency with code-based tool invocation
- **Tool Search**: Work with hundreds of tools via dynamic discovery
- **Tool Examples**: Improve accuracy with concrete usage examples

### Context Management
- **Memory Tool**: Store unlimited context outside conversation window
- **Context Editing**: Automatic tool call cleanup for long sessions
- **Context Awareness**: Track remaining tokens throughout conversations

### Response Control
- **Effort Parameter**: Balance thoroughness vs. token efficiency (Opus 4.5 only)
- **Extended Thinking**: Access Claude's reasoning process
- **Interleaved Thinking**: Mix tool use with thought process

[→ API Documentation](docs/api/overview.md)

## Resources

### Official Links
- [MCP Documentation](https://modelcontextprotocol.io)
- [Claude Console](https://console.anthropic.com)
- [Claude Desktop Download](https://claude.ai/download)
- [MCP Server Repository](https://github.com/modelcontextprotocol/servers)

### Community
- [GitHub Issues](https://github.com/modelcontextprotocol/servers/issues)
- [Discord Community](https://discord.gg/modelcontextprotocol)
- [SDK Repositories](https://github.com/modelcontextprotocol)

### Support
- [Anthropic Support](https://support.anthropic.com)
- [API Status](https://status.anthropic.com)
- [Rate Limits Guide](https://docs.anthropic.com/api/rate-limits)

## Contributing

Contributions are welcome! If you'd like to:
- Report issues or bugs
- Suggest documentation improvements
- Add example configurations
- Share use cases

Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Documentation based on official [Anthropic MCP Documentation](https://modelcontextprotocol.io)
- Built for the Claude AI community
- Thanks to all MCP server developers and contributors

---

**Questions?** Check the [guides](docs/guides/) or open an issue.

**Ready to start?** Begin with [Remote MCP Servers](docs/guides/remote-mcp-servers.md) or [Local MCP Servers](docs/guides/local-mcp-servers.md).
