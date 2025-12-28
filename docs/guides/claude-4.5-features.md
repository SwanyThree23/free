# What's New in Claude 4.5

> Discover the latest capabilities and improvements in Claude 4.5 models

## Overview

Claude 4.5 introduces three powerful models designed for different use cases:

- **Claude Opus 4.5**: Maximum intelligence with practical performance
- **Claude Sonnet 4.5**: Best for complex agents and coding tasks
- **Claude Haiku 4.5**: Fastest with near-frontier intelligence

This guide explores the key features, improvements, and capabilities introduced in Claude 4.5.

## Model Comparison

### Claude Opus 4.5

**Best for**: Maximum intelligence tasks requiring deep reasoning

| Feature | Specification |
|---------|--------------|
| **Context Window** | 200k tokens |
| **Pricing** | $5 input / $25 output per million tokens |
| **Unique Features** | Effort parameter support |
| **Use Cases** | Complex analysis, research, strategic planning |

**Key Strengths:**
- Highest reasoning capability
- Effort parameter for response control
- Enhanced computer use with zoom
- Thinking block preservation across conversations

### Claude Sonnet 4.5

**Best for**: Complex coding and autonomous agents

| Feature | Specification |
|---------|--------------|
| **Context Window** | 200k or 1M tokens (beta) |
| **Pricing** | $3 input / $15 output per million tokens |
| **Unique Features** | Advanced coding, agent capabilities |
| **Use Cases** | Software development, autonomous systems |

**Key Strengths:**
- Best coding model to date
- Extended autonomous operation
- Context awareness
- Enhanced tool usage

### Claude Haiku 4.5

**Best for**: High-speed, high-volume tasks

| Feature | Specification |
|---------|--------------|
| **Context Window** | 200k tokens |
| **Pricing** | $1 input / $5 output per million tokens |
| **Performance** | 2x faster than Sonnet 4 |
| **Use Cases** | Real-time applications, high-volume processing |

**Key Strengths:**
- Near-frontier intelligence at Haiku speed
- First Haiku with extended thinking
- Context awareness
- Cost-effective frontier performance

## Major Feature Improvements

### 1. Enhanced Coding Capabilities (Sonnet 4.5)

Claude Sonnet 4.5 represents a breakthrough in AI coding:

**SWE-bench Verified Performance:**
- State-of-the-art on coding benchmarks
- Significant improvements over Sonnet 4
- Enhanced planning and system design

**Key Improvements:**

**Better Planning:**
- Improved architectural decisions
- Enhanced code organization
- More sophisticated system design

**Security Engineering:**
- More robust security practices
- Better vulnerability detection
- Enhanced security review capabilities

**Instruction Following:**
- More precise adherence to specifications
- Better understanding of requirements
- Improved edge case handling

**Recommendation:** Enable [extended thinking](https://docs.anthropic.com/claude/docs/extended-thinking) for complex coding tasks.

### 2. Agent Capabilities (Sonnet 4.5)

**Extended Autonomous Operation:**

Claude Sonnet 4.5 can work independently for hours while maintaining:
- Clear focus on incremental progress
- Steady advances on manageable tasks
- Fact-based progress updates
- Accurate reflection of accomplishments

**Context Awareness:**

Claude tracks token usage throughout conversations:
- Receives updates after each tool call
- Better understanding of available working space
- More effective task execution
- Prevents premature task abandonment

**Enhanced Tool Usage:**

- **Parallel tool calls**: Multiple speculative operations simultaneously
- **Improved coordination**: Better orchestration across tools
- **Effective research**: Firing off multiple searches at once
- **Faster context building**: Reading several files in parallel

**Advanced Context Management:**

- Exceptional state tracking in external files
- Goal-orientation preservation across sessions
- Optimal context window usage
- Effective information handling over time

### 3. Extended Thinking

**Available in:** Opus 4.5, Sonnet 4.5, Haiku 4.5, Sonnet 3.7, Opus 4, Opus 4.1

Extended thinking gives Claude the ability to "think" before responding, improving reasoning and problem-solving.

**Key Benefits:**

- **Better reasoning**: More thoughtful, considered responses
- **Complex problem-solving**: Handles multi-step reasoning
- **Transparency**: See Claude's thought process (summarized)
- **Configurable**: Control thinking depth with budget tokens

**Enabling Extended Thinking:**

```python
from anthropic import Anthropic

client = Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-5",
    betas=["extended-thinking-2025-01-09"],
    max_tokens=4096,
    thinking={
        "type": "enabled",
        "budget_tokens": 2000  # Optional: control thinking depth
    },
    messages=[{
        "role": "user",
        "content": "Solve this complex logic puzzle..."
    }]
)

# Access thinking
for block in response.content:
    if block.type == "thinking":
        print(f"Thinking: {block.thinking}")
    elif block.type == "text":
        print(f"Response: {block.text}")
```

**Summarized Thinking:**

Claude 4+ models return summarized thinking output:
- Full intelligence benefits maintained
- Prevents potential misuse
- Production-ready format
- Clearer communication

**Thinking Block Preservation (Opus 4.5):**

Opus 4.5 automatically preserves all previous thinking blocks:
- Maintains reasoning continuity across turns
- Effective for extended multi-turn interactions
- Better context for tool use sessions
- Supports complex, long-running tasks

### 4. Effort Parameter (Opus 4.5 Only)

**New in Opus 4.5:** Control response thoroughness vs. token efficiency

The effort parameter allows you to trade off between response detail and token usage:

```python
response = client.beta.messages.create(
    model="claude-opus-4-5-20251101",
    betas=["effort-2025-11-24"],
    max_tokens=4096,
    messages=[{"role": "user", "content": "Explain quantum computing"}],
    output_config={
        "effort": "medium"  # "low", "medium", or "high"
    }
)
```

**Effort Levels:**

| Level | Best For | Characteristics |
|-------|----------|----------------|
| **Low** | High-volume automation | Concise, efficient, minimal explanation |
| **Medium** | Most production use cases | Balanced thoroughness and efficiency |
| **High** | Complex analysis | Maximum detail and comprehensive explanations |

**Affects All Output:**
- Text responses
- Tool calls
- Extended thinking tokens

### 5. Computer Use Excellence (Opus 4.5)

**Enhanced computer use capabilities** with new zoom action:

**Zoom Action:**

Enables detailed inspection of specific screen regions at full resolution:
- Examine fine-grained UI elements
- Read small text and fine print
- Analyze complex interfaces
- Verify precise visual details

**Use Cases:**

- Inspecting small UI controls
- Reading detailed text
- Analyzing dense information displays
- Verifying visual details before actions

**Example:**

```python
tools = [
    {
        "type": "computer_20241022",
        "name": "computer",
        "display_width_px": 1920,
        "display_height_px": 1080,
        "display_number": 1
    }
]

response = client.beta.messages.create(
    model="claude-opus-4-5",
    betas=["computer-use-2024-10-22"],
    max_tokens=4096,
    tools=tools,
    messages=[{
        "role": "user",
        "content": "Click the small 'Settings' icon in the top-right corner"
    }]
)
```

### 6. Advanced Tool Use

**New Beta Features:**

#### Programmatic Tool Calling

Reduce latency by having Claude write code that calls tools programmatically:

```python
tools=[
    {
        "type": "code_execution_20250825",
        "name": "code_execution"
    },
    {
        "name": "query_database",
        "description": "Execute SQL queries",
        "input_schema": {...},
        "allowed_callers": ["code_execution_20250825"]  # Enable programmatic calling
    }
]
```

**Benefits:**
- Reduced latency (no model round-trips)
- Token efficiency (filter data programmatically)
- Support for loops and conditional logic

#### Tool Search Tool

Work with hundreds or thousands of tools via dynamic discovery:

```python
tools=[
    {
        "type": "tool_search_tool_regex_20251119",  # or tool_search_tool_bm25_20251119
        "name": "tool_search_tool_regex"
    },
    {
        "name": "get_weather",
        "description": "Get weather at a location",
        "input_schema": {...},
        "defer_loading": True  # Load on-demand
    }
]
```

**Benefits:**
- Save 10-20K tokens (don't load all tools upfront)
- Maintain accuracy with 100+ tools
- Dynamic tool discovery

#### Tool Use Examples

Provide concrete examples of valid tool inputs:

```python
tools=[
    {
        "name": "get_weather",
        "description": "Get current weather",
        "input_schema": {...},
        "input_examples": [
            {"location": "San Francisco, CA", "unit": "fahrenheit"},
            {"location": "Tokyo, Japan", "unit": "celsius"},
            {"location": "New York, NY"}  # Shows optional 'unit'
        ]
    }
]
```

**Benefits:**
- Improved tool usage accuracy
- Better handling of complex schemas
- Clear examples for optional parameters

#### Memory Tool

Store and retrieve information outside the context window:

```python
tools=[
    {
        "type": "memory_20250818",
        "name": "memory"
    }
]
```

**Use Cases:**
- Building knowledge bases over time
- Maintaining project state across sessions
- Preserving unlimited context via files

### 7. Context Management

**Context Editing:**

Automatically clear old tool calls when approaching token limits:

```python
response = client.beta.messages.create(
    betas=["context-management-2025-06-27"],
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[{"role": "user", "content": "..."}],
    context_management={
        "edits": [
            {
                "type": "clear_tool_uses_20250919",
                "trigger": {"type": "input_tokens", "value": 500},
                "keep": {"type": "tool_uses", "value": 2},
                "clear_at_least": {"type": "input_tokens", "value": 100}
            }
        ]
    },
    tools=[...]
)
```

**Benefits:**
- Intelligent context cleanup
- Maintains recent tool history
- Prevents context overflow
- Better long-running sessions

**Context Awareness:**

Claude tracks remaining context throughout conversations:
- Real-time token budget updates
- Better task persistence
- Multi-context-window workflow support
- Available in Sonnet 4, Sonnet 4.5, Haiku 4.5, Opus 4, Opus 4.1, Opus 4.5

### 8. Enhanced Stop Reasons

**New Stop Reason:** `model_context_window_exceeded`

Explicitly indicates when generation stopped due to context window limits:

```json
{
  "stop_reason": "model_context_window_exceeded",
  "usage": {
    "input_tokens": 150000,
    "output_tokens": 49950
  }
}
```

**All Stop Reasons:**

| Stop Reason | Description |
|-------------|-------------|
| `end_turn` | Natural completion |
| `max_tokens` | Reached requested max_tokens |
| `model_context_window_exceeded` | Hit context window limit |
| `stop_sequence` | Hit specified stop sequence |
| `tool_use` | Claude wants to use a tool |
| `refusal` | Claude declined to respond (Claude 4+) |

### 9. Communication Style Changes

**Claude 4+ models have refined communication:**

**More Concise:**
- Less verbose explanations
- More direct responses
- Efficiency-focused

**More Natural:**
- Slightly more conversational
- Less machine-like
- Better flow

**Workflow Momentum:**
- May skip detailed summaries after actions
- Maintains efficiency
- Can be adjusted with prompting

**Instruction Following:**

Claude 4+ models require more explicit direction:

✓ **Good:** "Make these changes to the code"
✗ **Ambiguous:** "Can you suggest changes?"

**Best Practices:** See [Claude 4 prompt engineering guide](https://docs.anthropic.com/claude/docs/claude-4-best-practices)

## Pricing and Availability

### Pricing

| Model | Input | Output |
|-------|-------|--------|
| Claude Opus 4.5 | $5 | $25 per million tokens |
| Claude Sonnet 4.5 | $3 | $15 per million tokens |
| Claude Haiku 4.5 | $1 | $5 per million tokens |

### Platform Availability

**Claude API (1P):**
- `claude-opus-4-5-20251101`
- `claude-sonnet-4-5-20250929`
- `claude-haiku-4-5-20251001`

**Amazon Bedrock:**
- `anthropic.claude-opus-4-5-20251101-v1:0`
- `anthropic.claude-sonnet-4-5-20250929-v1:0`
- `anthropic.claude-haiku-4-5-20251001-v1:0`

**Google Cloud Vertex AI:**
- `claude-opus-4-5@20251101`
- `claude-sonnet-4-5@20250929`
- `claude-haiku-4-5@20251001`

**Also available:** Claude.ai, Claude Code

### Regional Pricing (3P Platforms)

Starting with Claude 4.5, AWS Bedrock and Google Vertex AI offer:

- **Global endpoints**: Dynamic routing, standard pricing
- **Regional endpoints**: Guaranteed geographic routing, **10% premium**

The **10% premium applies to all Claude 4.5 models** on regional endpoints.

**Claude API is global-only** (equivalent to global endpoint pricing).

## Migration Guide

### From Claude Sonnet 3.7 to Sonnet 4.5

**Breaking changes:**
- New `refusal` stop reason
- Updated text editor tool type
- Communication style differences

**Recommended steps:**

1. Update stop reason handling
2. Update text editor tool type if used
3. Adjust prompts for more explicit instructions
4. Test with extended thinking enabled
5. Review and update tool configurations

### From Claude Haiku 3.5 to Haiku 4.5

**Breaking changes:**
- New `refusal` stop reason
- Communication style differences

**New capabilities:**
- Extended thinking support (first Haiku!)
- Context awareness
- Near-frontier intelligence

**Recommended steps:**

1. Update stop reason handling
2. Enable extended thinking for complex tasks
3. Adjust prompts for explicit instructions
4. Test high-volume workflows

### From Sonnet 4 to Sonnet 4.5

**No breaking changes** - seamless upgrade!

**Improvements:**
- Enhanced coding capabilities
- Better agent performance
- Improved tool usage
- Extended thinking preservation

### From Opus 4.1 to Opus 4.5

**No breaking changes** - seamless upgrade!

**New features:**
- Effort parameter support
- Enhanced computer use with zoom
- Thinking block preservation
- More accessible pricing

## Best Practices

### When to Use Extended Thinking

**Enable for:**
- Complex reasoning tasks
- Multi-step problem solving
- Coding tasks (especially with Sonnet 4.5)
- Strategic planning
- Analysis and research

**Consider disabling for:**
- Simple queries
- High-volume automation
- Speed-critical applications
- When [prompt caching](https://docs.anthropic.com/claude/docs/prompt-caching) efficiency matters

### Choosing the Right Model

**Use Opus 4.5 when:**
- Maximum intelligence is required
- Using effort parameter for control
- Deep reasoning is essential
- Budget allows premium pricing

**Use Sonnet 4.5 when:**
- Building coding applications
- Creating autonomous agents
- Need balance of performance and cost
- Complex tool use workflows

**Use Haiku 4.5 when:**
- Speed is critical
- High-volume processing
- Cost efficiency is important
- Real-time applications
- Sub-agent architectures

### Prompting Tips

**Be explicit:**
```
✓ "Create a function that validates email addresses"
✗ "Can you help with email validation?"
```

**State desired behaviors:**
```
✓ "Provide a detailed explanation with examples"
✗ "Explain this" (might get concise response)
```

**Use system prompts:**
```python
system="You are a helpful coding assistant. Provide detailed explanations with code examples."
```

## Additional Resources

### Documentation
- [Extended Thinking Guide](https://docs.anthropic.com/claude/docs/extended-thinking)
- [Tool Use Documentation](https://docs.anthropic.com/claude/docs/tool-use)
- [Computer Use Guide](https://docs.anthropic.com/claude/docs/computer-use)
- [Prompt Engineering Best Practices](https://docs.anthropic.com/claude/docs/claude-4-best-practices)

### Migration
- [Full Migration Guide](https://docs.anthropic.com/claude/docs/migrating-to-claude-4)
- [Breaking Changes](https://docs.anthropic.com/claude/docs/migrating-to-claude-4#breaking-changes)
- [API Changelog](https://docs.anthropic.com/claude/changelog)

### Community
- [Discord Community](https://discord.gg/anthropic)
- [GitHub Discussions](https://github.com/anthropics/anthropic-sdk-python/discussions)
- [Developer Forum](https://community.anthropic.com)

---

**Ready to get started?** Choose your model and begin building with Claude 4.5 today!

**Need help migrating?** Check the [migration guide](https://docs.anthropic.com/claude/docs/migrating-to-claude-4) for step-by-step instructions.
