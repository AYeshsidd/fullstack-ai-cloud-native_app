# API Contract: Backend Chat Endpoint

**Endpoint**: `POST /api/v1/users/{user_id}/chat`

**Purpose**: Send a user message to the AI assistant and receive a response with any tool calls performed. This endpoint is used by the ChatKit bridge layer to communicate with the backend.

---

## Request

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | string (UUID) | Yes | ID of the authenticated user |

### Headers

| Header | Value | Required | Description |
|--------|-------|----------|-------------|
| `Authorization` | `Bearer {token}` | Yes | JWT authentication token |
| `Content-Type` | `application/json` | Yes | Request body format |

### Body

```typescript
{
  message: string;           // User's message (1-5000 characters)
  conversation_id?: string;  // Optional conversation ID (UUID)
}
```

**Field Descriptions**:
- `message`: The user's natural language message to the AI assistant
  - Must not be empty after trimming whitespace
  - Maximum length: 5000 characters
  - Examples: "Add a task to buy groceries", "What are my tasks?", "Mark the first task as complete"

- `conversation_id`: Optional UUID of an existing conversation
  - If provided, the message is added to the existing conversation
  - If omitted, a new conversation is created
  - Must belong to the authenticated user

**Example Request**:
```json
{
  "message": "Add a task to buy groceries",
  "conversation_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## Response

### Success Response (200 OK)

```typescript
{
  response: string;              // AI assistant's response text
  conversation_id: string;       // Conversation ID (new or existing)
  tool_calls: ToolCall[];        // Array of tool calls made
  messages: BackendMessage[];    // Recent messages (user + assistant)
}
```

**Field Descriptions**:
- `response`: The AI assistant's natural language response
  - Can be empty if only tool calls were made
  - Examples: "I've added 'buy groceries' to your todo list.", "You have 3 pending tasks."

- `conversation_id`: UUID of the conversation
  - Same as request if provided, otherwise a new UUID
  - Should be stored by client for subsequent messages

- `tool_calls`: Array of MCP tool invocations
  - Empty array if no tools were called
  - Each tool call includes name, input, output, and status

- `messages`: Array containing the user's message and assistant's response
  - Always contains exactly 2 messages
  - Ordered chronologically (user message first, assistant response second)

**ToolCall Structure**:
```typescript
{
  name: string;                  // Tool name (e.g., "add_task")
  input: Record<string, any>;    // Tool input parameters
  output?: Record<string, any>;  // Tool output (if successful)
  status: "success" | "error";   // Tool call status
}
```

**BackendMessage Structure**:
```typescript
{
  role: "user" | "assistant" | "tool";  // Message sender
  content: string;                       // Message text
  timestamp: string;                     // ISO 8601 datetime
}
```

**Example Success Response**:
```json
{
  "response": "I've added 'buy groceries' to your todo list.",
  "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
  "tool_calls": [
    {
      "name": "add_task",
      "input": {
        "user_id": "123e4567-e89b-12d3-a456-426614174000",
        "title": "buy groceries",
        "description": null
      },
      "output": {
        "id": "789e0123-e89b-12d3-a456-426614174000",
        "title": "buy groceries",
        "completed": false
      },
      "status": "success"
    }
  ],
  "messages": [
    {
      "role": "user",
      "content": "Add a task to buy groceries",
      "timestamp": "2026-02-10T14:30:00Z"
    },
    {
      "role": "assistant",
      "content": "I've added 'buy groceries' to your todo list.",
      "timestamp": "2026-02-10T14:30:02Z"
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request

**Cause**: Invalid request data (empty message, invalid conversation_id, etc.)

```json
{
  "detail": "Message cannot be empty"
}
```

### 401 Unauthorized

**Cause**: Missing or invalid JWT token

```json
{
  "detail": "Not authenticated"
}
```

### 404 Not Found

**Cause**: User does not exist or conversation does not belong to user

```json
{
  "detail": "User with ID {user_id} does not exist"
}
```

or

```json
{
  "detail": "Conversation not found or does not belong to user"
}
```

### 500 Internal Server Error

**Cause**: Server error during processing (AI API failure, database error, etc.)

```json
{
  "detail": "Error processing chat request: {error_message}"
}
```

---

## ChatKit Bridge Integration

### Bridge Layer Usage

The ChatKit bridge layer will use this endpoint as follows:

```typescript
// In ChatKitBridge.tsx
async sendMessage(message: string, conversationId?: string) {
  const response = await apiClient.sendChatMessage(
    this.userId,
    message,
    conversationId || getStoredConversationId()
  );

  if (response.success && response.data) {
    // Store conversation_id
    setStoredConversationId(response.data.conversation_id);

    // Check for tool calls
    if (response.data.tool_calls.length > 0) {
      this.onTodoListRefresh?.();
    }

    // Translate to ChatKit format
    return {
      message: response.data.response,
      conversationId: response.data.conversation_id,
    };
  }

  throw new Error(response.error || 'Failed to send message');
}
```

### CORS Considerations

If ChatKit is hosted on a different domain, the backend may need to allow CORS requests:

```python
# Backend CORS configuration (if needed)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://chatkit.openai.com",
        "http://localhost:3000",
        # Add production domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Tool Call Examples

### add_task

**Input**:
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "buy groceries",
  "description": "milk, eggs, bread"
}
```

**Output**:
```json
{
  "id": "789e0123-e89b-12d3-a456-426614174000",
  "title": "buy groceries",
  "description": "milk, eggs, bread",
  "completed": false,
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "created_at": "2026-02-10T14:30:00Z",
  "updated_at": "2026-02-10T14:30:00Z"
}
```

### list_tasks

**Input**:
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "all"
}
```

**Output**:
```json
{
  "tasks": [
    {
      "id": "789e0123-e89b-12d3-a456-426614174000",
      "title": "buy groceries",
      "completed": false
    },
    {
      "id": "890e1234-e89b-12d3-a456-426614174000",
      "title": "finish report",
      "completed": true
    }
  ]
}
```

### complete_task

**Input**:
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "task_id": "789e0123-e89b-12d3-a456-426614174000"
}
```

**Output**:
```json
{
  "id": "789e0123-e89b-12d3-a456-426614174000",
  "title": "buy groceries",
  "completed": true
}
```

### update_task

**Input**:
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "task_id": "789e0123-e89b-12d3-a456-426614174000",
  "title": "buy organic groceries",
  "description": "organic milk, free-range eggs, whole grain bread"
}
```

**Output**:
```json
{
  "id": "789e0123-e89b-12d3-a456-426614174000",
  "title": "buy organic groceries",
  "description": "organic milk, free-range eggs, whole grain bread",
  "completed": false
}
```

### delete_task

**Input**:
```json
{
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "task_id": "789e0123-e89b-12d3-a456-426614174000"
}
```

**Output**:
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## Rate Limiting

**Current**: No rate limiting implemented

**Future Consideration**: May implement rate limiting to prevent abuse (e.g., 60 requests per minute per user)

---

## Versioning

**Current Version**: v1

**Stability**: Stable (no breaking changes planned)

**Deprecation Policy**: 6 months notice for breaking changes
