# MCP Configuration Examples

This directory contains example configuration files for connecting Claude Desktop to various MCP servers.

## Configuration File Location

Place your configuration file at:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

## Available Examples

### Local MCP Servers

#### `claude_desktop_config.json` (macOS/Linux)

Example configuration for macOS/Linux systems with multiple MCP servers:

- **Filesystem**: Access local files and directories
- **GitHub**: Interact with GitHub repositories
- **PostgreSQL**: Query databases
- **Slack**: Integrate with Slack workspace
- **Puppeteer**: Browser automation

#### `claude_desktop_config_windows.json` (Windows)

Windows-specific configuration with:

- **Filesystem**: Windows path format with double backslashes
- **GitHub**: With APPDATA environment variable
- **PostgreSQL**: Database access
- **Brave Search**: Web search integration

## Using These Examples

### 1. Choose the Right Configuration

- Use `claude_desktop_config.json` for macOS/Linux
- Use `claude_desktop_config_windows.json` for Windows

### 2. Customize Paths and Credentials

Replace placeholder values:

```json
{
  "mcpServers": {
    "filesystem": {
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/YOUR_USERNAME/Desktop"  // ← Replace YOUR_USERNAME
      ]
    },
    "github": {
      "env": {
        "GITHUB_TOKEN": "your_github_token"  // ← Replace with your token
      }
    }
  }
}
```

### 3. Install Prerequisites

Ensure you have:

- [Node.js](https://nodejs.org/) (LTS version)
- [Claude Desktop](https://claude.ai/download) (latest version)
- Required API keys (GitHub, Slack, etc.)

### 4. Copy to Configuration Location

**macOS/Linux:**
```bash
cp claude_desktop_config.json ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Windows:**
```powershell
copy claude_desktop_config_windows.json %APPDATA%\Claude\claude_desktop_config.json
```

### 5. Restart Claude Desktop

Completely quit and restart Claude Desktop for changes to take effect.

## Configuration Sections Explained

### Filesystem Server

```json
"filesystem": {
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-filesystem",
    "/path/to/allowed/directory1",
    "/path/to/allowed/directory2"
  ]
}
```

- **command**: Uses `npx` to run the server
- **args**:
  - `-y`: Auto-confirm package installation
  - Package name: `@modelcontextprotocol/server-filesystem`
  - Remaining args: Directories the server can access

### Server with Environment Variables

```json
"github": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": {
    "GITHUB_TOKEN": "your_token_here"
  }
}
```

- **env**: Object containing environment variables
- Use for API keys, tokens, configuration values

### Database Connections

```json
"postgres": {
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-postgres",
    "postgresql://localhost/database_name"
  ]
}
```

- Connection string format: `postgresql://[user[:password]@][host][:port][/dbname]`
- Examples:
  - `postgresql://localhost/mydb`
  - `postgresql://user:pass@localhost:5432/mydb`
  - `postgresql://user@remote-host/production_db`

## Available MCP Servers

### Official Servers

| Server | Package | Description |
|--------|---------|-------------|
| Filesystem | `@modelcontextprotocol/server-filesystem` | File operations |
| GitHub | `@modelcontextprotocol/server-github` | GitHub API |
| GitLab | `@modelcontextprotocol/server-gitlab` | GitLab API |
| Google Drive | `@modelcontextprotocol/server-gdrive` | Drive operations |
| Slack | `@modelcontextprotocol/server-slack` | Slack integration |
| PostgreSQL | `@modelcontextprotocol/server-postgres` | Database queries |
| SQLite | `@modelcontextprotocol/server-sqlite` | SQLite access |
| Puppeteer | `@modelcontextprotocol/server-puppeteer` | Browser automation |
| Brave Search | `@modelcontextprotocol/server-brave-search` | Web search |

### Adding More Servers

Browse available servers:
- [Official MCP Servers](https://github.com/modelcontextprotocol/servers)
- [Community Servers](https://github.com/modelcontextprotocol/servers/discussions)

## Security Best Practices

### Protecting Sensitive Information

1. **Never commit configuration with real tokens**
   ```bash
   # Add to .gitignore
   echo "claude_desktop_config.json" >> .gitignore
   ```

2. **Use environment variables for secrets**
   - Store tokens in secure location
   - Reference from environment

3. **Grant minimal directory access**
   ```json
   // Good: Specific directories
   "/Users/username/Projects/myapp"

   // Risky: Too broad
   "/Users/username"
   ```

4. **Rotate API keys regularly**
   - Set expiration dates
   - Monitor usage
   - Revoke unused keys

### Recommended Permissions

**Filesystem:**
- ✓ Project directories
- ✓ Documents folder
- ✗ Home directory root
- ✗ System directories

**API Tokens:**
- ✓ Read-only scopes when possible
- ✓ Limited to necessary repositories/resources
- ✗ Admin or owner permissions unless required

## Troubleshooting

### Server Not Appearing

1. **Check JSON syntax**
   - Validate at [jsonlint.com](https://jsonlint.com)
   - Look for missing commas, brackets

2. **Verify file location**
   ```bash
   # macOS
   ls -la ~/Library/Application\ Support/Claude/claude_desktop_config.json

   # Windows
   dir %APPDATA%\Claude\claude_desktop_config.json
   ```

3. **Check logs**
   ```bash
   # macOS
   tail -f ~/Library/Logs/Claude/mcp*.log

   # Windows
   type %APPDATA%\Claude\logs\mcp*.log
   ```

### Permission Errors

**macOS/Linux:**
- Ensure paths are absolute
- Check directory exists
- Verify read permissions

**Windows:**
- Use double backslashes in paths
- Check APPDATA environment variable
- Ensure npm is installed globally

### Connection Issues

1. **Verify Node.js is installed**
   ```bash
   node --version
   ```

2. **Test manual server execution**
   ```bash
   npx -y @modelcontextprotocol/server-filesystem /path/to/directory
   ```

3. **Check internet connection**
   - Required for `npx` to download packages first time

## Advanced Configurations

### Multiple Servers of Same Type

```json
{
  "mcpServers": {
    "work-filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/username/work"]
    },
    "personal-filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/username/personal"]
    }
  }
}
```

### Custom Server Paths

```json
{
  "mcpServers": {
    "custom-server": {
      "command": "node",
      "args": ["/absolute/path/to/your/server.js"]
    }
  }
}
```

### Python Servers

```json
{
  "mcpServers": {
    "python-server": {
      "command": "python",
      "args": ["/path/to/server.py"]
    }
  }
}
```

## Getting Help

### Resources

- [Local MCP Guide](../guides/local-mcp-servers.md)
- [Remote MCP Guide](../guides/remote-mcp-servers.md)
- [MCP Documentation](https://modelcontextprotocol.io)
- [Troubleshooting Guide](../guides/local-mcp-servers.md#troubleshooting)

### Community

- [Discord](https://discord.gg/modelcontextprotocol)
- [GitHub Discussions](https://github.com/modelcontextprotocol/servers/discussions)
- [Anthropic Support](https://support.anthropic.com)

## Contributing

Have a useful configuration to share?

1. Fork the repository
2. Add your configuration example
3. Update this README
4. Submit a pull request

---

**Questions?** Check the [guides](../guides/) or open an issue.

**Ready to customize?** Start with the basic filesystem configuration and add servers as needed!
