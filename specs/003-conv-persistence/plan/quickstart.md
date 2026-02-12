# Quickstart Guide: Conversation Persistence & Stateless Flow

**Feature**: Conversation Persistence & Stateless Flow
**Created**: 2026-02-08

## Overview

This guide explains how to use the conversation persistence functionality that enables AI chatbot conversations to be stored and retrieved from the database, ensuring continuity across server restarts and stateless operation.

## Prerequisites

- Phase-3 backend running (with MCP tools and AI agent service)
- Database connection established (PostgreSQL/SQLite)
- OpenAI API key configured in environment variables

## API Usage

### Starting a New Conversation
```bash
curl -X POST "http://localhost:8000/api/users/user123/chat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "message": "Hi, I want to add a task to buy groceries"
  }'
```

### Continuing an Existing Conversation
```bash
curl -X POST "http://localhost:8000/api/users/user123/chat" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "message": "Show me my tasks",
    "conversation_id": "abc123..."
  }'
```

### Listing User Conversations
```bash
curl -X GET "http://localhost:8000/api/users/user123/conversations" \
  -H "Authorization: Bearer <jwt_token>"
```

### Getting Conversation Details
```bash
curl -X GET "http://localhost:8000/api/users/user123/conversations/abc123..." \
  -H "Authorization: Bearer <jwt_token>"
```

## Expected Response Format

### Chat Endpoint Response
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
      "content": "Hi, I want to add a task to buy groceries",
      "timestamp": "2026-02-08T10:00:00.000Z"
    },
    {
      "role": "assistant",
      "content": "I've added the task 'buy groceries' to your list. You now have 1 task.",
      "timestamp": "2026-02-08T10:00:05.000Z"
    }
  ]
}
```

## Key Implementation Components

### Database Models
- **Conversation**: Tracks chat sessions per user with timestamps
- **Message**: Stores individual messages with role, content, and timestamps
- **ToolCall**: Records all MCP tool invocations with inputs and outputs

### Key Flows
1. **Request Processing**: User message → Conversation load/create → Message store → History rebuild → AI Agent run
2. **Response Generation**: Tool results → AI response → Message store → API response
3. **State Management**: All data persisted to database, no in-memory state

## Verification Steps

### 1. Test Conversation Persistence
- Send multiple messages in a conversation
- Verify all messages are stored in the database
- Retrieve conversation history to confirm message order

### 2. Test Server Restart Resilience
- Start a conversation and add several messages
- Restart the server
- Continue the conversation with the same conversation_id
- Verify continuity of conversation history

### 3. Test Multiple Conversations
- Create multiple conversations for the same user
- Switch between different conversation IDs
- Verify each maintains its own independent history

### 4. Test User Isolation
- Have multiple users create conversations simultaneously
- Verify users cannot access each other's conversations
- Confirm proper user_id validation

## Architecture Benefits

### Stateless Design
- No in-memory session state between requests
- Server can restart without losing conversation data
- Horizontal scaling support with load balancers

### Database-First Approach
- All conversation data stored in database
- Consistent and durable across server instances
- Support for complex queries and analytics

### Conversation Continuity
- Full conversation history available to AI agent
- Context-aware responses based on entire conversation
- Support for follow-up questions referencing earlier parts

## Error Handling

The system handles several error scenarios:
- Invalid user_id: Returns 404 error
- Unauthorized conversation access: Returns 403 error
- Database connection issues: Graceful degradation with appropriate error messages
- Malformed messages: Input validation with clear error responses
- Tool failures: Continues operation with error status in tool_calls