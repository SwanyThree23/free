# MCP SDKs

> Official SDKs for building Model Context Protocol servers and clients

## Overview

Build MCP servers and clients using our official SDKs. All SDKs provide the same core functionality and full protocol support, allowing you to create powerful integrations in your preferred programming language.

The Model Context Protocol SDKs enable you to:
- **Create MCP servers** that expose tools, resources, and prompts to AI applications
- **Build MCP clients** that can connect to any MCP-compliant server
- **Support both transports**: Local (stdio) and remote (HTTP/SSE) protocols
- **Ensure protocol compliance** with built-in type safety and validation

## Available SDKs

### TypeScript SDK

**Official Repository**: [typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk)

**Best for:**
- Node.js applications
- Web applications
- JavaScript/TypeScript developers
- Rapid prototyping

**Installation:**
```bash
npm install @modelcontextprotocol/sdk
```

**Quick Example:**
```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "example-server",
  version: "1.0.0",
}, {
  capabilities: {
    tools: {},
  },
});

// Define tools
server.setRequestHandler("tools/list", async () => ({
  tools: [{
    name: "get_weather",
    description: "Get weather for a location",
    inputSchema: {
      type: "object",
      properties: {
        location: { type: "string" }
      }
    }
  }]
}));

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

**Features:**
- Full TypeScript type definitions
- Async/await support
- Built-in validation
- Comprehensive examples

**Resources:**
- [Documentation](https://github.com/modelcontextprotocol/typescript-sdk#readme)
- [Examples](https://github.com/modelcontextprotocol/typescript-sdk/tree/main/examples)
- [API Reference](https://github.com/modelcontextprotocol/typescript-sdk/wiki)

---

### Python SDK

**Official Repository**: [python-sdk](https://github.com/modelcontextprotocol/python-sdk)

**Best for:**
- Data science applications
- Machine learning integrations
- Python developers
- Scientific computing

**Installation:**
```bash
pip install mcp
```

**Quick Example:**
```python
from mcp.server import Server
from mcp.server.stdio import stdio_server

app = Server("example-server")

@app.list_tools()
async def list_tools():
    return [
        {
            "name": "get_weather",
            "description": "Get weather for a location",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"}
                }
            }
        }
    ]

@app.call_tool()
async def call_tool(name: str, arguments: dict):
    if name == "get_weather":
        location = arguments["location"]
        # Implementation here
        return f"Weather in {location}: Sunny"

if __name__ == "__main__":
    stdio_server(app)
```

**Features:**
- Pythonic API design
- Type hints with Pydantic
- Async/await support
- Easy integration with existing Python code

**Resources:**
- [Documentation](https://github.com/modelcontextprotocol/python-sdk#readme)
- [Examples](https://github.com/modelcontextprotocol/python-sdk/tree/main/examples)
- [PyPI Package](https://pypi.org/project/mcp/)

---

### Go SDK

**Official Repository**: [go-sdk](https://github.com/modelcontextprotocol/go-sdk)

**Best for:**
- High-performance applications
- System-level integrations
- Cloud-native services
- Microservices

**Installation:**
```bash
go get github.com/modelcontextprotocol/go-sdk
```

**Quick Example:**
```go
package main

import (
    "context"
    "github.com/modelcontextprotocol/go-sdk/server"
)

func main() {
    s := server.NewServer("example-server", "1.0.0")

    s.HandleListTools(func(ctx context.Context) ([]server.Tool, error) {
        return []server.Tool{
            {
                Name:        "get_weather",
                Description: "Get weather for a location",
                InputSchema: map[string]interface{}{
                    "type": "object",
                    "properties": map[string]interface{}{
                        "location": map[string]string{"type": "string"},
                    },
                },
            },
        }, nil
    })

    s.Serve()
}
```

**Features:**
- Native Go concurrency
- High performance
- Minimal dependencies
- Strong type safety

**Resources:**
- [Documentation](https://github.com/modelcontextprotocol/go-sdk#readme)
- [Examples](https://github.com/modelcontextprotocol/go-sdk/tree/main/examples)
- [Go Package](https://pkg.go.dev/github.com/modelcontextprotocol/go-sdk)

---

### Kotlin SDK

**Official Repository**: [kotlin-sdk](https://github.com/modelcontextprotocol/kotlin-sdk)

**Best for:**
- Android applications
- JVM applications
- Kotlin developers
- Multi-platform projects

**Installation:**
```kotlin
dependencies {
    implementation("org.modelcontextprotocol:kotlin-sdk:1.0.0")
}
```

**Features:**
- Kotlin coroutines support
- Android compatibility
- Multi-platform ready
- Idiomatic Kotlin API

**Resources:**
- [Documentation](https://github.com/modelcontextprotocol/kotlin-sdk#readme)
- [Examples](https://github.com/modelcontextprotocol/kotlin-sdk/tree/main/examples)

---

### Swift SDK

**Official Repository**: [swift-sdk](https://github.com/modelcontextprotocol/swift-sdk)

**Best for:**
- iOS/macOS applications
- Swift developers
- Apple ecosystem integrations
- Native performance

**Installation:**
```swift
dependencies: [
    .package(url: "https://github.com/modelcontextprotocol/swift-sdk", from: "1.0.0")
]
```

**Features:**
- Swift concurrency (async/await)
- iOS/macOS native
- SwiftUI integration
- Type-safe APIs

**Resources:**
- [Documentation](https://github.com/modelcontextprotocol/swift-sdk#readme)
- [Examples](https://github.com/modelcontextprotocol/swift-sdk/tree/main/examples)

---

### Java SDK

**Official Repository**: [java-sdk](https://github.com/modelcontextprotocol/java-sdk)

**Best for:**
- Enterprise applications
- Spring Boot integrations
- Android applications
- Legacy Java systems

**Installation:**
```xml
<dependency>
    <groupId>org.modelcontextprotocol</groupId>
    <artifactId>java-sdk</artifactId>
    <version>1.0.0</version>
</dependency>
```

**Features:**
- Java 11+ compatibility
- CompletableFuture support
- Spring integration
- Enterprise-ready

**Resources:**
- [Documentation](https://github.com/modelcontextprotocol/java-sdk#readme)
- [Examples](https://github.com/modelcontextprotocol/java-sdk/tree/main/examples)

---

### C# SDK

**Official Repository**: [csharp-sdk](https://github.com/modelcontextprotocol/csharp-sdk)

**Best for:**
- .NET applications
- Windows desktop apps
- Azure integrations
- Unity game development

**Installation:**
```bash
dotnet add package ModelContextProtocol.SDK
```

**Features:**
- .NET 6+ support
- async/await patterns
- Azure integration
- Unity compatible

**Resources:**
- [Documentation](https://github.com/modelcontextprotocol/csharp-sdk#readme)
- [Examples](https://github.com/modelcontextprotocol/csharp-sdk/tree/main/examples)
- [NuGet Package](https://www.nuget.org/packages/ModelContextProtocol.SDK)

---

### Ruby SDK

**Official Repository**: [ruby-sdk](https://github.com/modelcontextprotocol/ruby-sdk)

**Best for:**
- Rails applications
- Ruby developers
- Scripting and automation
- Web applications

**Installation:**
```bash
gem install mcp
```

**Features:**
- Ruby idioms and conventions
- Rails integration
- Async support with Async gem
- Easy to use API

**Resources:**
- [Documentation](https://github.com/modelcontextprotocol/ruby-sdk#readme)
- [Examples](https://github.com/modelcontextprotocol/ruby-sdk/tree/main/examples)
- [RubyGems](https://rubygems.org/gems/mcp)

---

### Rust SDK

**Official Repository**: [rust-sdk](https://github.com/modelcontextprotocol/rust-sdk)

**Best for:**
- Systems programming
- High-performance servers
- WebAssembly
- Embedded systems

**Installation:**
```toml
[dependencies]
mcp = "1.0"
```

**Features:**
- Zero-cost abstractions
- Memory safety
- Async runtime support (Tokio)
- Cross-platform

**Resources:**
- [Documentation](https://github.com/modelcontextprotocol/rust-sdk#readme)
- [Examples](https://github.com/modelcontextprotocol/rust-sdk/tree/main/examples)
- [Crates.io](https://crates.io/crates/mcp)

---

### PHP SDK

**Official Repository**: [php-sdk](https://github.com/modelcontextprotocol/php-sdk)

**Best for:**
- WordPress plugins
- Laravel applications
- PHP web applications
- CMS integrations

**Installation:**
```bash
composer require modelcontextprotocol/php-sdk
```

**Features:**
- PHP 8.0+ support
- PSR-4 autoloading
- Framework agnostic
- Easy WordPress integration

**Resources:**
- [Documentation](https://github.com/modelcontextprotocol/php-sdk#readme)
- [Examples](https://github.com/modelcontextprotocol/php-sdk/tree/main/examples)
- [Packagist](https://packagist.org/packages/modelcontextprotocol/php-sdk)

---

## SDK Feature Comparison

All SDKs support the same core MCP functionality:

| Feature | All SDKs |
|---------|----------|
| **Server creation** | ✅ |
| **Client creation** | ✅ |
| **Tool definition** | ✅ |
| **Resource management** | ✅ |
| **Prompt handling** | ✅ |
| **Local transport (stdio)** | ✅ |
| **Remote transport (HTTP/SSE)** | ✅ |
| **Type safety** | ✅ |
| **Async/concurrent support** | ✅ |
| **Protocol compliance** | ✅ |

### Language-Specific Advantages

| SDK | Unique Strengths |
|-----|-----------------|
| **TypeScript** | Best ecosystem, web integration, largest community |
| **Python** | Data science, ML integration, scientific computing |
| **Go** | Performance, concurrency, cloud-native |
| **Kotlin** | Android, multi-platform, JVM ecosystem |
| **Swift** | iOS/macOS native, Apple ecosystem |
| **Java** | Enterprise, Spring, Android |
| **C#** | .NET, Azure, Unity, Windows |
| **Ruby** | Rails, scripting, web development |
| **Rust** | Performance, safety, WebAssembly |
| **PHP** | WordPress, Laravel, web CMS |

## Choosing an SDK

### Selection Criteria

**Choose based on:**

1. **Existing codebase**: Match your application's language
2. **Performance needs**: Go, Rust, or C++ for high-performance
3. **Platform requirements**: Swift for iOS, Kotlin for Android
4. **Team expertise**: Use what your team knows best
5. **Ecosystem**: Consider available libraries and tools

### Quick Decision Guide

**For web applications:**
- Frontend: TypeScript
- Backend API: TypeScript, Python, Go
- CMS integration: PHP

**For mobile applications:**
- iOS: Swift
- Android: Kotlin or Java
- Cross-platform: TypeScript (React Native)

**For data/ML applications:**
- Python (best ML/data ecosystem)

**For enterprise applications:**
- Java (Spring ecosystem)
- C# (.NET ecosystem)
- Go (cloud-native)

**For high-performance:**
- Rust (maximum performance + safety)
- Go (performance + simplicity)
- C++ (if available for your use case)

## Getting Started

### Building Your First MCP Server

Follow these general steps (syntax varies by language):

1. **Install the SDK**
   - Use your language's package manager
   - Import/require the MCP SDK

2. **Create a server instance**
   - Define server name and version
   - Specify capabilities

3. **Define tools**
   - List available tools
   - Implement tool handlers
   - Define input schemas

4. **Add resources (optional)**
   - Define resource URIs
   - Implement resource handlers

5. **Add prompts (optional)**
   - Define prompt templates
   - Implement prompt handlers

6. **Start the server**
   - Choose transport (stdio or HTTP)
   - Begin listening for requests

### Example Workflow

**1. Create a simple server:**
```
Install SDK → Create server → Define one tool → Test locally
```

**2. Add functionality:**
```
Add more tools → Add resources → Test with Claude Desktop
```

**3. Deploy:**
```
Package server → Configure client → Deploy to production
```

## Common Patterns

### Tool Definition Pattern

Every SDK follows this general pattern:

1. Define tool metadata (name, description, schema)
2. Implement tool logic
3. Register tool with server
4. Handle tool calls from clients

### Resource Pattern

1. Define resource URIs
2. Implement resource retrieval logic
3. Register resources with server
4. Serve resources to clients

### Transport Pattern

**Local (stdio):**
- Server reads from stdin
- Server writes to stdout
- Used by Claude Desktop

**Remote (HTTP/SSE):**
- Server exposes HTTP endpoint
- Clients connect via HTTP
- Server-sent events for server→client messages

## Best Practices

### For All SDKs

**Server Development:**
- ✓ Validate all inputs
- ✓ Handle errors gracefully
- ✓ Provide clear error messages
- ✓ Use semantic versioning
- ✓ Document your tools thoroughly

**Security:**
- ✓ Validate tool parameters
- ✓ Implement authentication if needed
- ✓ Use environment variables for secrets
- ✓ Follow principle of least privilege
- ✓ Log security-relevant events

**Performance:**
- ✓ Use async/concurrent operations
- ✓ Implement caching where appropriate
- ✓ Handle timeouts properly
- ✓ Monitor resource usage
- ✓ Optimize for common use cases

### Language-Specific Best Practices

**TypeScript/JavaScript:**
- Use TypeScript for type safety
- Leverage async/await
- Handle promise rejections
- Use proper error types

**Python:**
- Use type hints
- Implement proper async with asyncio
- Follow PEP 8 style guide
- Use virtual environments

**Go:**
- Follow Go conventions
- Use contexts for cancellation
- Handle errors explicitly
- Leverage goroutines wisely

**Others:**
- Follow language-specific conventions
- Use community best practices
- Leverage language strengths
- Consider ecosystem patterns

## Testing

### Testing Your Server

**Basic tests:**
1. Tool discovery (list tools)
2. Tool execution (call tools with valid input)
3. Error handling (invalid inputs, edge cases)
4. Resource access (if applicable)

**Integration tests:**
1. Connect with real MCP client
2. Test full workflows
3. Verify transport layer
4. Test with Claude Desktop

### Testing Tools

Each SDK may provide testing utilities:

- Mock clients for unit testing
- Test transport implementations
- Validation helpers
- Example test suites

## Documentation & Support

### SDK Documentation

Each SDK has its own documentation:

- README with quick start
- API reference
- Example implementations
- Architecture guides

### Community Resources

- **GitHub Discussions**: Ask questions, share solutions
- **Discord Community**: Real-time help and discussions
- **Stack Overflow**: Tag with `model-context-protocol`
- **Official Documentation**: [modelcontextprotocol.io](https://modelcontextprotocol.io)

### Contributing

All SDKs are open source and accept contributions:

- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation
- Add examples

## Migration Between SDKs

### Concepts Translate Across SDKs

If switching languages, core concepts remain the same:

- **Server setup**: Create instance, define capabilities
- **Tool definition**: Name, description, input schema, handler
- **Resources**: URI, type, content
- **Transports**: stdio or HTTP/SSE

### Porting Checklist

1. Install new SDK
2. Recreate server structure
3. Port tool definitions
4. Port tool implementations
5. Update transport layer
6. Test thoroughly
7. Update deployment

## Next Steps

### Start Building

**Choose your path:**

1. **Build a server**: [Server Development Guide](https://modelcontextprotocol.io/docs/develop/build-server)
2. **Build a client**: [Client Development Guide](https://modelcontextprotocol.io/docs/develop/build-client)
3. **Explore examples**: Check SDK repositories for example implementations
4. **Join community**: [Discord](https://discord.gg/modelcontextprotocol), [GitHub](https://github.com/modelcontextprotocol)

### Resources

**Official:**
- [MCP Documentation](https://modelcontextprotocol.io)
- [Protocol Specification](https://modelcontextprotocol.io/docs/learn/architecture)
- [Server Repository](https://github.com/modelcontextprotocol/servers)

**Community:**
- [Awesome MCP](https://github.com/modelcontextprotocol/awesome-mcp)
- [Example Servers](https://github.com/modelcontextprotocol/servers/tree/main/src)
- [Community Showcase](https://github.com/modelcontextprotocol/servers/discussions)

---

**Ready to build?** Choose an SDK above and start creating your MCP server or client today!

**Need help?** Join our [Discord community](https://discord.gg/modelcontextprotocol) or check the [documentation](https://modelcontextprotocol.io).
