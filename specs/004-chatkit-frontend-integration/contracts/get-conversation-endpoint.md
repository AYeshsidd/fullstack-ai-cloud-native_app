# API Contract: Get Conversation Detail Endpoint

**Endpoint**: `GET /api/v1/users/{user_id}/conversations/{conversation_id}`

**Purpose**: Retrieve detailed information about a specific conversation, including full message history. Used by the ChatKit bridge layer to load conversation history on page load.

---

## Request

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user_id` | string (UUID) | Yes | ID of the authenticated user |
| `conversation_id` | string (UUID) | Yes | ID of the conversation to retrieve |

### Headers

| Header | Value | Required | Description |
|--------|-------|----------|-------------|
| `Authorization` | `Bearer {token}` | Yes | JWT authentication token |

### Query Parameters

None

---

## Response

### Success Response (200 OK)

```typescript
{
  conversation: ConversationDetail;
}
```

**ConversationDetail Structure**:
```typescript
{
  id: string;              // Conversation UUID
  created_at: string;      // ISO 8601 datetime
  updated_at: string;      // ISO 8601 datetime
  messages: BackendMessage[]; // Full message history
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
  "conversation": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2026-02-10T14:30:00Z",
    "updated_at": "2026-02-10T15:45:00Z",
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
      },
      {
        "role": "user",
        "content": "What are my tasks?",
        "timestamp": "2026-02-10T15:45:00Z"
      },
      {
        "role": "assistant",
        "content": "You have 1 pending task: buy groceries.",
        "timestamp": "2026-02-10T15:45:01Z"
      }
    ]
  }
}
```

**Notes**:
- Messages are returned in chronological order (oldest first)
- Empty messages array is returned for new conversations
- Only conversations belonging to the authenticated user can be accessed

---

## Error Responses

### 401 Unauthorized

**Cause**: Missing or invalid JWT token

```json
{
  "detail": "Not authenticated"
}
```

### 404 Not Found

**Cause**: User does not exist

```json
{
  "detail": "User with ID {user_id} does not exist"
}
```

**Cause**: Conversation does not exist or does not belong to user

```json
{
  "detail": "Conversation with ID {conversation_id} does not exist or does not belong to user {user_id}"
}
```

---

## ChatKit Bridge Integration

### Bridge Layer Usage

The ChatKit bridge layer will use this endpoint to load conversation history on mount:

```typescript
// In ChatKitBridge.tsx
async loadConversationHistory(conversationId: string) {
  const response = await apiClient.getConversationDetail(
    this.userId,
    conversationId
  );

  if (response.success && response.data) {
    // Translate backend messages to ChatKit format
    const chatKitMessages = response.data.conversation.messages.map(msg => ({
      id: `${msg.timestamp}-${msg.role}`,
      role: msg.role === 'tool' ? 'assistant' : msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
    }));

    return chatKitMessages;
  }

  throw new Error(response.error || 'Failed to load conversation');
}
```

### Usage Flow

```
1. ChatKitEmbed component mounts
2. Check localStorage for conversation_id
3. If found, call bridge.loadConversationHistory(conversationId)
4. Bridge calls this endpoint
5. Backend returns full conversation history
6. Bridge translates messages to ChatKit format
7. Bridge initializes ChatKit with history
8. ChatKit displays conversation
```

---

## Use Cases

1. **Load Conversation History**: Retrieve full message history when user returns to the app
2. **Conversation Continuity**: Restore conversation state after page refresh
3. **Message Browsing**: Allow user to scroll through past messages

**Primary Use Case**: This endpoint is used on component mount to load the conversation history if a `conversation_id` exists in localStorage. This ensures conversation continuity across browser sessions and page refreshes.

---

## Performance Considerations

- **Message Count**: Endpoint returns all messages in the conversation
- **Recommended Limit**: Design assumes ≤100 messages per conversation for optimal performance
- **Future Enhancement**: If conversations grow beyond 100 messages, consider implementing pagination or lazy loading
