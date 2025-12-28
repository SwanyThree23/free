# Connect to Remote MCP Servers

> Learn how to connect Claude to remote MCP servers and extend its capabilities with internet-hosted tools and data sources

## Overview

Remote MCP servers extend AI applications' capabilities beyond your local environment, providing access to internet-hosted tools, services, and data sources. By connecting to remote MCP servers, you transform AI assistants from helpful tools into informed teammates capable of handling complex, multi-step projects with real-time access to external resources.

Many clients now support remote MCP servers, enabling a wide range of integration possibilities. This guide demonstrates how to connect to remote MCP servers using [Claude](https://claude.ai/) as an example, one of the many clients that support MCP. While we focus on Claude's implementation through Custom Connectors, the concepts apply broadly to other MCP-compatible clients.

## Understanding Remote MCP Servers

Remote MCP servers function similarly to local MCP servers but are hosted on the internet rather than your local machine. They expose tools, prompts, and resources that Claude can use to perform tasks on your behalf. These servers can integrate with various services such as:

- Project management tools (Jira, Asana, Trello)
- Documentation systems (Notion, Confluence, Google Docs)
- Code repositories (GitHub, GitLab, Bitbucket)
- Communication platforms (Slack, Discord, Teams)
- Cloud storage (Google Drive, Dropbox, OneDrive)
- Any other API-enabled service

### Key Advantages

The key advantage of remote MCP servers is their **accessibility**:

- **Available anywhere**: Unlike local servers that require installation on each device, remote servers are accessible from any MCP client with an internet connection
- **Easy deployment**: No local installation or configuration needed
- **Ideal for web applications**: Perfect for browser-based AI integrations
- **Team collaboration**: Multiple users can access the same server
- **Server-side processing**: Handle complex operations that require server resources or authentication

## What are Custom Connectors?

Custom Connectors serve as the bridge between Claude and remote MCP servers. They allow you to connect Claude directly to the tools and data sources that matter most to your workflows, enabling Claude to operate within your favorite software and draw insights from the complete context of your external tools.

### Capabilities

With Custom Connectors, you can:

- **Connect to existing remote MCP servers** provided by third-party developers
- **Build your own remote MCP servers** to connect with any tool or service
- **Access multiple servers** simultaneously for comprehensive workflows
- **Manage permissions** granularly for each connected server

### Resources

- [Getting started with Custom Connectors](https://support.anthropic.com/en/articles/11175166-getting-started-with-custom-connectors-using-remote-mcp)
- [Building Custom Connectors](https://support.anthropic.com/en/articles/11503834-building-custom-connectors-via-remote-mcp-servers)

## Connecting to a Remote MCP Server

The process of connecting Claude to a remote MCP server involves adding a Custom Connector through the [Claude interface](https://claude.ai/). This establishes a secure connection between Claude and your chosen remote server.

### Step 1: Navigate to Connector Settings

1. Open Claude in your browser at [claude.ai](https://claude.ai)
2. Click on your **profile icon** in the top-right corner
3. Select **"Settings"** from the dropdown menu
4. In the settings sidebar, click on **"Connectors"**

This will display your currently configured connectors and provide options to add new ones.

**What you'll see:**
- List of active connectors
- Connection status for each connector
- "Add custom connector" button at the bottom

### Step 2: Add a Custom Connector

1. In the Connectors section, scroll to the bottom
2. Click the **"Add custom connector"** button
3. A dialog will appear prompting for the remote MCP server URL

**Server URL Requirements:**
- Must include the protocol (`https://`)
- Should be the complete URL provided by the server developer
- Include any necessary path components

**Example URLs:**
```
https://mcp.example.com/api
https://api.acme.com/mcp/v1
https://my-mcp-server.herokuapp.com
```

4. Enter the complete URL in the dialog
5. Click **"Add"** to proceed

### Step 3: Complete Authentication

Most remote MCP servers require authentication to ensure secure access to their resources. The authentication process varies depending on the server implementation.

**Common Authentication Methods:**

#### OAuth 2.0
- Redirects to third-party authentication provider
- You authorize Claude to access the service
- Tokens are securely stored and managed

#### API Keys
- Enter your API key in the authentication form
- Keys are encrypted and stored securely
- Can be revoked from your settings

#### Username/Password
- Traditional credential-based authentication
- Credentials are encrypted in transit and storage
- May include two-factor authentication

**Authentication Steps:**
1. Follow the prompts displayed by the server
2. Provide required credentials or authorization
3. Review requested permissions carefully
4. Grant access only to necessary scopes
5. Wait for confirmation of successful connection

**After Authentication:**
- Claude establishes a secure connection to the remote server
- Server resources become available in your conversations
- Tool permissions can be configured in settings

### Step 4: Access Resources and Prompts

After successful connection, the remote server's resources and prompts become available in your Claude conversations.

**Accessing Resources:**

1. Click the **paperclip icon** (📎) in the message input area
2. The attachment menu opens, displaying:
   - Files (local uploads)
   - Resources from connected MCP servers
   - Available prompts

**Types of Resources:**

- **Files and Documents**: Access server-hosted files
- **Database Queries**: Predefined or dynamic queries
- **Knowledge Bases**: Documentation, wikis, notes
- **Project Data**: Issues, tasks, tickets
- **API Responses**: Real-time data from integrated services

**Using Resources:**

1. Browse available resources in the menu
2. Select the items you want to include
3. Resources are loaded into the conversation context
4. Claude can now reference and use this information
5. Add your question or request
6. Send the message

**Resource Visibility:**
- Resources are organized by connected server
- Each server section shows available resources
- Search or filter to find specific resources
- Selected resources appear as attachments

### Step 5: Configure Tool Permissions

Remote MCP servers often expose multiple tools with varying capabilities. You can control which tools Claude is allowed to use by configuring permissions in the connector settings.

**Accessing Tool Settings:**

1. Navigate to Settings → Connectors
2. Click on your connected server name
3. View the list of available tools
4. Configure permissions for each tool

**Permission Levels:**

- **Enabled**: Claude can use this tool automatically (with approval prompts)
- **Disabled**: Claude cannot use this tool
- **Approval Required**: Claude must ask explicit permission each time

**Configurable Options:**

- **Tool selection**: Enable/disable specific tools
- **Usage limits**: Set maximum calls per conversation
- **Approval mode**: Automatic, prompted, or manual
- **Scope restrictions**: Limit tool access to specific data

**Security Settings:**

- **Read-only mode**: Allow only data retrieval, no modifications
- **Safe operations**: Restrict potentially destructive actions
- **Audit logging**: Track all tool usage
- **Rate limiting**: Prevent excessive API calls

**Best Practices:**

1. **Start restrictive**: Begin with minimal permissions
2. **Enable as needed**: Add permissions based on actual requirements
3. **Regular audits**: Review and remove unused permissions
4. **Monitor usage**: Check logs for unexpected behavior
5. **Principle of least privilege**: Grant only necessary access

## Best Practices for Using Remote MCP Servers

When working with remote MCP servers, consider these recommendations to ensure a secure and efficient experience.

### Security Considerations

**Verify Server Authenticity:**
- Only connect to servers from trusted sources
- Verify the developer or organization behind the server
- Check for official documentation and support
- Look for community reviews and reputation

**Review Permissions:**
- Carefully review authentication scopes
- Understand what data the server can access
- Be cautious with write permissions
- Limit access to sensitive systems

**Data Privacy:**
- Be aware of what data is sent to remote servers
- Avoid sharing sensitive or confidential information
- Review the server's privacy policy
- Understand data retention and usage policies

**Access Control:**
- Use separate API keys for different use cases
- Rotate credentials regularly
- Revoke access when no longer needed
- Monitor for unauthorized access

### Managing Multiple Connectors

**Organization Strategies:**

1. **Purpose-based grouping**: Organize by functionality (development, content, communication)
2. **Project-based grouping**: Group servers by project or team
3. **Frequency-based**: Separate frequently used from occasional connectors

**Maintenance:**

- **Regular reviews**: Audit connectors monthly
- **Remove unused**: Delete connectors you no longer use
- **Update configurations**: Keep settings current
- **Monitor performance**: Track response times and reliability

**Workspace Management:**

- Keep your connector list focused and relevant
- Document the purpose of each connector
- Share configurations with team members when appropriate
- Use naming conventions for easy identification

### Performance Optimization

**Reduce Latency:**
- Choose geographically closer servers when possible
- Use caching-enabled servers
- Batch requests when appropriate
- Minimize round trips

**Resource Management:**
- Load only necessary resources into conversations
- Clear unused resources from context
- Use specific queries rather than broad searches
- Monitor token usage with large datasets

### Error Handling

**Common Issues:**

1. **Connection timeouts**: Check internet connectivity and server status
2. **Authentication failures**: Verify credentials and refresh tokens
3. **Rate limit errors**: Reduce request frequency or upgrade server plan
4. **Permission denied**: Review and update tool permissions

**Troubleshooting Steps:**

1. Check error messages in Claude interface
2. Review server-specific documentation
3. Verify API key validity
4. Test server endpoint directly
5. Contact server support if needed

## Example Use Cases

### Project Management Integration

**Scenario**: Connect Claude to Jira for task management

**Setup:**
1. Add Jira MCP server connector
2. Authenticate with Jira credentials
3. Grant permissions for reading/creating issues

**Usage:**
- "Show me all high-priority bugs assigned to my team"
- "Create a new task for implementing user authentication"
- "Update the status of PROJ-123 to In Review"

### Documentation Access

**Scenario**: Integrate Notion workspace for knowledge base access

**Setup:**
1. Add Notion MCP server connector
2. OAuth authentication with Notion
3. Select accessible workspaces

**Usage:**
- "Find our API documentation for the payment endpoint"
- "What's our process for deploying to production?"
- "Create a new page in the Engineering wiki about our new feature"

### Code Repository Integration

**Scenario**: Connect to GitHub for repository management

**Setup:**
1. Add GitHub MCP server connector
2. Authenticate via GitHub OAuth
3. Configure repository access permissions

**Usage:**
- "Show me recent pull requests in the main repository"
- "Create a new issue for the bug I just described"
- "What are the open issues labeled 'good first issue'?"

### Communication Tools

**Scenario**: Integrate Slack for team communication

**Setup:**
1. Add Slack MCP server connector
2. OAuth authentication with Slack workspace
3. Select channels and permission scopes

**Usage:**
- "Send a message to #engineering about the deployment"
- "What were the main discussion points in #design today?"
- "Create a reminder for tomorrow's standup"

## Available Remote MCP Servers

### Official Servers

Many popular services offer official MCP server implementations:

- **GitHub**: Repository and issue management
- **Google Drive**: File storage and collaboration
- **Slack**: Team communication
- **Notion**: Knowledge base and documentation
- **Linear**: Issue tracking and project management

### Community Servers

Browse the [MCP servers repository](https://github.com/modelcontextprotocol/servers) for community-created integrations:

- Database connectors (PostgreSQL, MongoDB, MySQL)
- Cloud platforms (AWS, Azure, GCP)
- Development tools (Docker, Kubernetes)
- Analytics platforms (Google Analytics, Mixpanel)
- And hundreds more...

### Building Your Own

Create custom remote MCP servers for proprietary tools:

1. Choose an SDK (TypeScript, Python, Go, etc.)
2. Implement MCP server interface
3. Define tools, resources, and prompts
4. Deploy to hosting platform
5. Share URL with users

[→ SDK Documentation](sdks.md)

## Troubleshooting

### Server Not Connecting

**Symptoms:**
- Connection timeout errors
- "Unable to reach server" message
- Authentication failures

**Solutions:**
1. Verify server URL is correct and includes `https://`
2. Check internet connectivity
3. Confirm server is online (check status page if available)
4. Try accessing server URL in browser
5. Review firewall and network settings

### Authentication Issues

**Symptoms:**
- "Authentication failed" errors
- Redirect loops during OAuth
- Expired token messages

**Solutions:**
1. Verify credentials are correct
2. Check API key hasn't been revoked
3. Refresh or regenerate authentication tokens
4. Clear browser cookies and cache
5. Re-authenticate from scratch

### Tool Permission Errors

**Symptoms:**
- "Permission denied" when using tools
- Tools not appearing in available list
- Unexpected tool behavior

**Solutions:**
1. Review connector settings and permissions
2. Verify scope of authenticated access
3. Check server-side permissions and roles
4. Re-authenticate with correct scopes
5. Contact server administrator

### Resource Loading Failures

**Symptoms:**
- Resources not appearing in menu
- "Failed to load resource" errors
- Incomplete or corrupted data

**Solutions:**
1. Check server API status
2. Verify resource still exists on server
3. Refresh connection to server
4. Clear and reload resources
5. Check rate limits haven't been exceeded

### Getting Help

**Resources:**
- Server-specific documentation and support
- [Anthropic Support](https://support.anthropic.com)
- [MCP Community Discord](https://discord.gg/modelcontextprotocol)
- Server developer's support channels
- [GitHub Issues](https://github.com/modelcontextprotocol/servers/issues)

**Providing Information:**
When seeking help, include:
- Server URL (if not sensitive)
- Error messages (exact text)
- Steps to reproduce
- Authentication method used
- Browser and OS information

## Security Best Practices

### For Users

**Before Connecting:**
- ✓ Research the server developer
- ✓ Read privacy policy and terms
- ✓ Understand data access requirements
- ✓ Verify HTTPS connection

**During Use:**
- ✓ Review tool permissions regularly
- ✓ Monitor for unusual activity
- ✓ Use read-only mode when possible
- ✓ Limit sensitive data exposure

**Maintenance:**
- ✓ Audit connections quarterly
- ✓ Remove unused connectors
- ✓ Update credentials periodically
- ✓ Review access logs if available

### For Server Developers

**Authentication:**
- Implement OAuth 2.0 or equivalent
- Use short-lived tokens
- Support token refresh
- Implement rate limiting

**Data Security:**
- Encrypt data in transit (HTTPS)
- Encrypt sensitive data at rest
- Implement proper access controls
- Log access for audit trails

**API Design:**
- Follow principle of least privilege
- Validate all inputs
- Implement proper error handling
- Provide clear permission scopes

## Next Steps

Now that you've connected Claude to a remote MCP server, explore these resources:

### Learn More
- [Build your own remote server](https://support.anthropic.com/en/articles/11503834-building-custom-connectors-via-remote-mcp-servers) - Create custom integrations
- [Explore available servers](https://github.com/modelcontextprotocol/servers) - Browse official and community servers
- [Connect local servers](local-mcp-servers.md) - Learn about local MCP integration
- [Understand the architecture](https://modelcontextprotocol.io/docs/learn/architecture) - Dive deeper into MCP

### Try These Servers
1. **GitHub MCP Server**: Manage repositories and issues
2. **Google Drive MCP Server**: Access and organize files
3. **Slack MCP Server**: Interact with team communications
4. **Database MCP Servers**: Query databases directly

### Advanced Topics
- Building multi-server workflows
- Creating custom authentication flows
- Implementing caching strategies
- Optimizing for large-scale deployments

---

Remote MCP servers unlock powerful possibilities for extending Claude's capabilities. As you become familiar with these integrations, you'll discover new ways to streamline your workflows and accomplish complex tasks more efficiently.

**Ready to build your own?** Check out the [SDK documentation](sdks.md) to get started.

**Need help?** Visit the [troubleshooting section](#troubleshooting) or reach out to [Anthropic Support](https://support.anthropic.com).
