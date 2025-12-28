# Connect to Local MCP Servers

> Learn how to extend Claude Desktop with local MCP servers to enable file system access and other powerful integrations

## Overview

Model Context Protocol (MCP) servers extend AI applications' capabilities by providing secure, controlled access to local resources and tools. Many clients support MCP, enabling diverse integration possibilities across different platforms and applications.

This guide demonstrates how to connect to local MCP servers using Claude Desktop as an example, one of the many clients that support MCP. While we focus on Claude Desktop's implementation, the concepts apply broadly to other MCP-compatible clients. By the end of this tutorial, Claude will be able to interact with files on your computer, create new documents, organize folders, and search through your file system—all with your explicit permission for each action.

## Prerequisites

Before starting this tutorial, ensure you have the following installed on your system.

### Claude Desktop

Download and install [Claude Desktop](https://claude.ai/download) for your operating system. Claude Desktop is available for macOS and Windows.

**Checking Your Version:**

If you already have Claude Desktop installed, verify you're running the latest version:

1. Open Claude Desktop
2. Click the **Claude** menu (macOS menu bar)
3. Select **"Check for Updates..."**
4. Install any available updates

### Node.js

The Filesystem Server and many other MCP servers require Node.js to run. This is because most MCP servers are distributed as npm packages that can be executed with `npx`.

**Verify Installation:**

Open a terminal or command prompt and run:

```bash
node --version
```

You should see output like `v18.17.0` or higher.

**Installing Node.js:**

If Node.js is not installed:

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version
3. Run the installer
4. Follow installation prompts
5. Restart your terminal
6. Verify installation with `node --version`

**Recommended Version:**
- **LTS version** (currently 18.x or 20.x) for stability
- Minimum version: 16.x

## Understanding MCP Servers

MCP servers are programs that run on your computer and provide specific capabilities to Claude Desktop through a standardized protocol. Think of them as plugins or extensions that give Claude new abilities.

### How MCP Servers Work

1. **Background Process**: The MCP server runs as a background process on your computer
2. **Protocol Communication**: Claude Desktop communicates with the server using the MCP protocol
3. **Tool Exposure**: The server exposes tools that Claude can discover and use
4. **Approval System**: All actions require your explicit approval before execution

### What MCP Servers Can Do

**Filesystem Server Tools:**

- **Reading files**: Access file contents and directory structures
- **Creating files**: Generate new files and directories
- **Moving files**: Rename and relocate files
- **Searching**: Find files by name or content
- **Directory operations**: List, create, and manage folders

**Other Server Examples:**

- **Database access**: Query and manage databases
- **Git operations**: Commit, branch, and manage repositories
- **API integrations**: Connect to external services
- **System commands**: Execute authorized shell commands
- **Web scraping**: Fetch and parse web content

### Security and Control

**Permission Model:**

- ✓ All actions require explicit approval
- ✓ You maintain full control over what Claude can access
- ✓ Servers run with your user account permissions
- ✓ You can see exactly what each tool will do before approving

**Important:** The server can only perform actions you could perform manually. It runs with your account's permissions and respects file system security.

## Installing the Filesystem Server

The Filesystem Server is one of the most popular MCP servers, providing Claude with the ability to read and manage files on your computer. We'll use it as our first example.

The installation process involves configuring Claude Desktop to automatically start the Filesystem Server whenever you launch the application. This configuration is done through a JSON file.

### Step 1: Open Claude Desktop Settings

1. **Launch Claude Desktop**
2. Click on the **Claude** menu in your system's menu bar (not the settings within the Claude window itself)
3. Select **"Settings..."** from the dropdown

**Platform-specific locations:**

- **macOS**: Menu appears in the top menu bar
- **Windows**: Menu appears in the Claude Desktop window

This opens the Claude Desktop configuration window, which is separate from your Claude account settings on the web.

### Step 2: Access Developer Settings

1. In the Settings window, look for the sidebar on the left
2. Navigate to the **"Developer"** tab
3. This section contains options for configuring MCP servers and other developer features

**What you'll see:**
- Current MCP server configurations
- Server status indicators
- "Edit Config" button to modify settings

4. Click the **"Edit Config"** button

**What this does:**
- Opens or creates `claude_desktop_config.json`
- File opens in your default text editor
- Provides direct access to MCP server configurations

**Configuration file location:**

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

### Step 3: Configure the Filesystem Server

Replace the contents of the configuration file with the appropriate configuration for your operating system.

#### macOS Configuration

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

**Important:** Replace `username` with your actual macOS username.

**Finding your username:**
```bash
echo $USER
```

#### Windows Configuration

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

**Important:**
- Replace `username` with your actual Windows username
- Note the double backslashes (`\\`) in Windows paths

**Finding your username:**
```powershell
echo %USERNAME%
```

### Understanding the Configuration

Let's break down what each part of the configuration means:

```json
{
  "mcpServers": {                                    // Container for all MCP servers
    "filesystem": {                                  // Friendly name for this server
      "command": "npx",                              // Tool to run the server
      "args": [                                      // Arguments passed to npx
        "-y",                                        // Auto-confirm installation
        "@modelcontextprotocol/server-filesystem",   // Package name
        "/Users/username/Desktop",                   // First allowed directory
        "/Users/username/Downloads"                  // Second allowed directory
      ]
    }
  }
}
```

**Configuration Parameters:**

| Parameter | Description |
|-----------|-------------|
| `mcpServers` | Root object containing all server configurations |
| `"filesystem"` | Display name for the server (appears in Claude Desktop) |
| `command` | Executable to run (npx runs Node.js packages) |
| `args` | Array of command-line arguments |
| `-y` | Automatically confirms package installation |
| `@modelcontextprotocol/server-filesystem` | npm package to run |
| Directory paths | Directories the server can access |

### Customizing Directory Access

You can grant access to any directories on your system. Here are some common configurations:

**Single directory:**
```json
"args": [
  "-y",
  "@modelcontextprotocol/server-filesystem",
  "/Users/username/Documents"
]
```

**Multiple directories:**
```json
"args": [
  "-y",
  "@modelcontextprotocol/server-filesystem",
  "/Users/username/Desktop",
  "/Users/username/Downloads",
  "/Users/username/Documents",
  "/Users/username/Projects"
]
```

**Project-specific access:**
```json
"args": [
  "-y",
  "@modelcontextprotocol/server-filesystem",
  "/Users/username/Projects/my-app"
]
```

**Security Consideration:**

Only grant access to directories you're comfortable with Claude reading and modifying. The server runs with your user account permissions, so it can perform any file operations you can perform manually.

**Best Practices:**
- ✓ Start with minimal necessary access
- ✓ Use specific directories rather than home directory
- ✓ Avoid granting access to system directories
- ✓ Regularly review and update permissions

### Step 4: Save and Restart Claude Desktop

1. **Save the configuration file**
   - File → Save (or Cmd+S / Ctrl+S)
   - Close your text editor

2. **Quit Claude Desktop completely**
   - macOS: Claude menu → Quit Claude
   - Windows: File menu → Exit
   - Or use keyboard shortcut (Cmd+Q / Alt+F4)

3. **Restart Claude Desktop**
   - Open the application normally
   - Wait for it to fully load

### Verifying Installation

After restart, check if the MCP server is connected successfully.

**Success Indicators:**

1. **MCP Server Indicator**: Look for the slider icon (🔌) in the bottom-right corner of the conversation input box

2. **Available Tools**: Click the slider icon to view available tools

You should see filesystem-related tools like:
- `read_file`
- `read_multiple_files`
- `write_file`
- `create_directory`
- `list_directory`
- `move_file`
- `search_files`
- `get_file_info`

**Troubleshooting Startup Issues:**

If the server indicator doesn't appear, see the [Troubleshooting](#troubleshooting) section below.

## Using the Filesystem Server

With the Filesystem Server connected, Claude can now interact with your file system through natural language requests. Let's explore some practical examples.

### Example Requests

#### File Creation

**Request:**
> "Can you write a poem and save it to my desktop?"

**What happens:**
1. Claude composes a poem
2. Claude requests to use the `write_file` tool
3. You see an approval prompt showing the exact file path and content
4. You approve or deny the action
5. If approved, the file is created on your desktop

#### File Organization

**Request:**
> "What work-related files are in my downloads folder?"

**What happens:**
1. Claude uses `list_directory` to scan downloads
2. You approve the directory read operation
3. Claude analyzes the file names and types
4. Claude identifies and lists work-related documents

**Request:**
> "Please organize all images on my desktop into a new folder called 'Images'"

**What happens:**
1. Claude lists desktop contents
2. Claude identifies image files (.jpg, .png, etc.)
3. Claude requests to create the 'Images' directory
4. Claude requests to move each image file
5. You approve each operation (or approve all at once)

#### File Search and Analysis

**Request:**
> "Find all Python files in my Projects folder that contain the word 'TODO'"

**What happens:**
1. Claude uses `search_files` to find .py files
2. Claude searches file contents for "TODO"
3. Claude presents a list of matching files with context

#### Content Creation

**Request:**
> "Create a README.md file in my project directory with setup instructions"

**What happens:**
1. Claude drafts README content
2. Claude requests to write the file
3. You review the content in the approval dialog
4. You approve, and the file is created

### How Approval Works

Before executing any file system operation, Claude will request your approval. This ensures you maintain control over all actions.

**Approval Dialog Shows:**
- Tool name being used
- Exact parameters (file paths, content, etc.)
- What the operation will do
- Options to approve or deny

**Example Approval:**
```
Tool: write_file
Path: /Users/username/Desktop/poem.txt
Content: [Shows full file content]

[Deny] [Approve]
```

**Approval Options:**
- **Approve**: Execute this specific operation
- **Deny**: Cancel the operation
- **Approve All**: Trust all operations in this conversation (use cautiously)

**Best Practices:**
- Review file paths carefully before approving
- Check file content when creating or modifying files
- Use "Approve All" sparingly, only for trusted operations
- Deny operations if anything looks unexpected

## Advanced Configuration

### Multiple MCP Servers

You can configure multiple MCP servers simultaneously. Each server provides different capabilities.

**Example configuration:**

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/username/Documents"
      ]
    },
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_TOKEN": "your_github_token_here"
      }
    },
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://localhost/mydb"
      ]
    }
  }
}
```

### Environment Variables

Some servers require environment variables for configuration (API keys, database URLs, etc.).

**Adding environment variables:**

```json
{
  "mcpServers": {
    "my-server": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-example"],
      "env": {
        "API_KEY": "your_api_key",
        "API_URL": "https://api.example.com",
        "DEBUG": "true"
      }
    }
  }
}
```

**Security note:** Avoid committing configuration files with sensitive tokens to version control.

### Custom Server Paths

If you've built or downloaded a custom MCP server, you can reference it directly.

**Using a local server:**

```json
{
  "mcpServers": {
    "custom-server": {
      "command": "node",
      "args": ["/path/to/your/custom-server/index.js"]
    }
  }
}
```

**Using a Python server:**

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

## Available MCP Servers

Explore other official and community MCP servers to extend Claude's capabilities.

### Official Servers

| Server | Description | Package Name |
|--------|-------------|--------------|
| **Filesystem** | File and directory operations | `@modelcontextprotocol/server-filesystem` |
| **GitHub** | Repository and issue management | `@modelcontextprotocol/server-github` |
| **GitLab** | GitLab API integration | `@modelcontextprotocol/server-gitlab` |
| **Google Drive** | Drive file operations | `@modelcontextprotocol/server-gdrive` |
| **Slack** | Slack workspace interaction | `@modelcontextprotocol/server-slack` |
| **PostgreSQL** | Database queries | `@modelcontextprotocol/server-postgres` |
| **SQLite** | SQLite database access | `@modelcontextprotocol/server-sqlite` |
| **Puppeteer** | Browser automation | `@modelcontextprotocol/server-puppeteer` |

### Community Servers

Browse the [MCP servers repository](https://github.com/modelcontextprotocol/servers) for hundreds of community-created servers:

- **Development tools**: Docker, Kubernetes, CI/CD platforms
- **Cloud services**: AWS, Azure, GCP integrations
- **Databases**: MongoDB, Redis, MySQL
- **Communication**: Discord, Teams, email
- **Productivity**: Notion, Todoist, calendar apps
- **Analytics**: Google Analytics, monitoring tools

### Installing Additional Servers

To add another server, simply add it to your configuration:

```json
{
  "mcpServers": {
    "filesystem": {
      // ... existing filesystem config
    },
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

Then restart Claude Desktop.

## Troubleshooting

Common issues and solutions when working with local MCP servers.

### Server Not Showing Up

**Symptoms:**
- No MCP server indicator (slider icon) in Claude Desktop
- Tools not available when clicking slider icon
- Server appears in config but not connecting

**Solutions:**

1. **Restart Claude Desktop completely**
   - Quit the application entirely
   - Wait a few seconds
   - Reopen Claude Desktop

2. **Check configuration file syntax**
   - Ensure JSON is valid (proper brackets, commas, quotes)
   - Use a JSON validator: https://jsonlint.com
   - Common errors: missing commas, trailing commas, unescaped backslashes

3. **Verify file paths are absolute**
   - ✓ Correct: `/Users/username/Desktop`
   - ✗ Incorrect: `~/Desktop` or `Desktop`
   - ✓ Correct (Windows): `C:\\Users\\username\\Desktop`
   - ✗ Incorrect (Windows): `C:\Users\username\Desktop`

4. **Check logs**
   - See [Getting Logs](#getting-logs-from-claude-desktop) below

5. **Test manual server execution**

   Try running the server manually to check for errors:

   **macOS/Linux:**
   ```bash
   npx -y @modelcontextprotocol/server-filesystem /Users/username/Desktop
   ```

   **Windows:**
   ```powershell
   npx -y @modelcontextprotocol/server-filesystem C:\Users\username\Desktop
   ```

   If you see errors, they'll indicate what's wrong (missing dependencies, permission issues, etc.)

### Getting Logs from Claude Desktop

Claude Desktop maintains logs that can help diagnose connection issues.

**Log locations:**

- **macOS**: `~/Library/Logs/Claude`
- **Windows**: `%APPDATA%\Claude\logs`

**Log files:**

- `mcp.log`: General MCP connection information and errors
- `mcp-server-SERVERNAME.log`: Server-specific error logs

**Viewing recent logs:**

**macOS/Linux:**
```bash
tail -n 20 -f ~/Library/Logs/Claude/mcp*.log
```

**Windows:**
```powershell
type "%APPDATA%\Claude\logs\mcp*.log"
```

**Common log issues:**

- **"Command not found: npx"**: Node.js not installed or not in PATH
- **"ENOENT"**: File or directory doesn't exist (check paths)
- **"Permission denied"**: Insufficient permissions (check directory access)
- **"Module not found"**: Package installation failed (check internet connection)

### Tool Calls Failing Silently

**Symptoms:**
- Claude attempts to use tools but they fail without error
- Operations seem to execute but nothing happens
- Intermittent success/failure

**Solutions:**

1. **Check Claude's logs** for error messages
2. **Verify your server builds and runs** without errors
3. **Test with simple operations first** (e.g., list directory)
4. **Restart Claude Desktop**
5. **Check file/directory permissions** on your system

### Windows ENOENT Error and ${APPDATA} in Paths

**Symptoms:**
- Server fails to load on Windows
- Error refers to `${APPDATA}` in paths
- Configuration appears correct but server won't start

**Solution:**

Add the expanded value of `%APPDATA%` to your `env` key:

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "APPDATA": "C:\\Users\\username\\AppData\\Roaming",
        "BRAVE_API_KEY": "..."
      }
    }
  }
}
```

Replace `username` with your actual Windows username.

**Verify npm is installed globally:**

The `npx` command may fail if npm is not installed globally.

**Check if npm is installed:**
```powershell
where npm
```

**Install npm globally if needed:**
```powershell
npm install -g npm
```

You should see `%APPDATA%\npm` exists after global installation.

### Connection Timeout Issues

**Symptoms:**
- Server starts but times out during communication
- Intermittent disconnections
- Slow response times

**Solutions:**

1. **Check system resources** (CPU, memory)
2. **Close other resource-intensive applications**
3. **Verify network settings** aren't blocking local connections
4. **Check antivirus/firewall** isn't blocking Node.js
5. **Update Node.js** to latest LTS version

### None of This Is Working

If you've tried all the above solutions and still have issues:

1. **Consult the debugging guide**: [MCP Debugging Guide](https://modelcontextprotocol.io/legacy/tools/debugging)
2. **Check Node.js version**: Ensure you're using Node.js 16.x or higher
3. **Reinstall Claude Desktop**: Download latest version from [claude.ai/download](https://claude.ai/download)
4. **Verify npm packages**: Try installing the server package manually:
   ```bash
   npm install -g @modelcontextprotocol/server-filesystem
   ```
5. **Contact support**: [Anthropic Support](https://support.anthropic.com)
6. **Community help**: [MCP Discord](https://discord.gg/modelcontextprotocol)

## Security Best Practices

### Directory Access

**Principle of Least Privilege:**
- Grant access only to necessary directories
- Avoid giving access to entire home directory
- Never grant access to system directories (`/System`, `/Windows`, `/usr`, etc.)
- Use project-specific paths when possible

**Examples:**

✓ **Good:**
```json
"/Users/username/Projects/myapp",
"/Users/username/Documents/work"
```

✗ **Risky:**
```json
"/Users/username",
"/",
"C:\\"
```

### Reviewing Operations

**Before Approving:**
- Read the exact file path carefully
- Review file content for write operations
- Understand what the tool will do
- Deny if anything looks unexpected or suspicious

**Red Flags:**
- Operations on unexpected directories
- Writes to system files
- Large-scale deletions
- Access to sensitive directories (.ssh, .aws, etc.)

### Configuration File Security

**Protecting Sensitive Data:**

1. **Don't commit configs with secrets**
   - Add `claude_desktop_config.json` to `.gitignore`
   - Use environment variables for sensitive values

2. **Use environment variables:**
   ```json
   {
     "mcpServers": {
       "api-server": {
         "command": "npx",
         "args": ["-y", "@example/server"],
         "env": {
           "API_KEY": "use-environment-variable-here"
         }
       }
     }
   }
   ```

3. **Rotate API keys regularly**
4. **Use read-only tokens when possible**

### Regular Audits

**Monthly checklist:**
- Review all configured MCP servers
- Remove servers you no longer use
- Update server packages to latest versions
- Review and minimize directory access
- Check logs for unusual activity

## Next Steps

Now that you've successfully connected Claude Desktop to a local MCP server, explore these options:

### Explore More Servers

Browse official and community servers:
- [MCP Servers Repository](https://github.com/modelcontextprotocol/servers)
- Filter by category (development, productivity, databases, etc.)
- Read documentation for each server
- Check compatibility and requirements

### Build Your Own Server

Create custom MCP servers for your workflows:
- [Building MCP Servers Guide](https://modelcontextprotocol.io/docs/develop/build-server)
- Choose an SDK (TypeScript, Python, Go, etc.)
- Implement custom tools and resources
- Share with the community

### Connect to Remote Servers

Learn about cloud-based MCP servers:
- [Remote MCP Servers Guide](remote-mcp-servers.md)
- Connect to internet-hosted tools
- Access team resources
- Integrate cloud services

### Learn the Protocol

Understand how MCP works:
- [MCP Architecture](https://modelcontextprotocol.io/docs/learn/architecture)
- Protocol specifications
- Advanced features
- Best practices for developers

---

**Questions?** Check the [troubleshooting section](#troubleshooting) or visit [Anthropic Support](https://support.anthropic.com).

**Ready for more?** Explore [remote MCP servers](remote-mcp-servers.md) or [build your own server](https://modelcontextprotocol.io/docs/develop/build-server).
