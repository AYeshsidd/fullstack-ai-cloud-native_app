# Quickstart Guide: AI Chat Endpoint

**Feature**: AI Chat Endpoint
**Created**: 2026-02-08

## Overview

This guide explains how to set up and use the AI Chat endpoint that enables users to interact with their todo list using natural language. The system uses OpenAI's Agents SDK to interpret user requests and call the appropriate MCP tools.

## Prerequisites

- Python 3.9 or higher
- Access to OpenAI API (API key required)
- Existing Phase-2 backend with MCP tools from Spec-1 installed and configured
- Running database (PostgreSQL/SQLite)

## Installation

### 1. Install OpenAI SDK
```bash
cd phase-3/backend
pip install openai
```

### 2. Add to requirements.txt
Add the following to your `requirements.txt`:
```
openai>=1.0.0
```

### 3. Configure Environment Variables
Add the following to your `.env` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
MODEL_NAME=gpt-4-turbo-preview  # Or your preferred model
```

## Architecture Overview

The AI Chat system consists of:

1. **Chat Endpoint** (`/api/{user_id}/chat`): Accepts natural language messages from users
2. **AI Agent Service**: Processes natural language and orchestrates MCP tool calls
3. **Database Models**: Stores conversation history, messages, and tool calls
4. **MCP Tools**: Pre-existing tools from Spec-1 that perform actual todo operations

## API Usage

### Starting a New Conversation
```bash
curl -X POST "http://localhost:8000/api/user123/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Add a new task to buy groceries"
  }'
```

### Continuing an Existing Conversation
```bash
curl -X POST "http://localhost:8000/api/user123/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Show me my tasks",
    "conversation_id": "abc123..."
  }'
```

### Expected Response Format
```json
{
  "response": "I've added the task 'buy groceries' to your list. You now have 1 task.",
  "conversation_id": "xyz789...",
  "tool_calls": [
    {
      "name": "add_task",
      "input": {
        "user_id": "user123",
        "title": "buy groceries",
        "description": null
      },
      "output": {
        "id": "task456",
        "user_id": "user123",
        "title": "buy groceries",
        "completed": false,
        "...": "other fields"
      },
      "status": "success"
    }
  ],
  "messages": [
    {
      "role": "user",
      "content": "Add a new task to buy groceries"
    },
    {
      "role": "assistant",
      "content": "I've added the task 'buy groceries' to your list. You now have 1 task."
    }
  ]
}
```

## Implementation Components

### Database Models
- `Conversation`: Tracks chat sessions per user
- `Message`: Stores individual messages (user/assistant/tool)
- `ToolCall`: Records all MCP tool invocations

### Key Flows
1. **Request Processing**: User message → Conversation fetch → AI Agent run → Tool calls
2. **Response Generation**: Tool results → AI response → Database storage → API response
3. **State Management**: All data persisted to database, no in-memory state

## Error Handling

The system handles several error scenarios:
- Invalid user_id: Returns 404 error
- Unavailable MCP tools: Graceful degradation with informative responses
- Malformed natural language: AI attempts to clarify or provide helpful alternatives
- API limits: Proper error messages and retry mechanisms

## Testing

### Unit Tests
- Test AI agent service with mocked MCP tools
- Test conversation model operations
- Test API endpoint with various request formats

### Integration Tests
- Full flow from user message to AI response
- Conversation persistence across server restarts
- Tool call recording and retrieval

## Security & Validation

- All user requests are validated against the user_id
- Conversation isolation ensures users can only access their own chats
- Tool calls are validated to ensure proper user ownership of tasks
- Input sanitization applied to all user messages