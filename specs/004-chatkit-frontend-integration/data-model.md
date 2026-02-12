# Data Model: ChatKit Frontend Integration

**Feature**: 004-chatkit-frontend-integration | **Date**: 2026-02-10 | **Phase**: 1 - Design

## Overview

This document defines the data models for the ChatKit Frontend Integration feature. Since ChatKit is a hosted service and the backend models already exist, this document focuses on the frontend TypeScript interfaces for the bridge layer that translates between ChatKit's format and the backend API format.

---

## Frontend Data Models

### 1. ChatKitConfig

Configuration object for initializing the hosted ChatKit service.

**TypeScript Interface**:
```typescript
interface ChatKitConfig {
  domainKey: string;
  backendEndpoint: string;
  authToken: string;
  conversationId?: string;
  onMessage?: (message: string) => Promise<void>;
  onResponse?: (response: any) => void;
  onError?: (error: any) => void;
}
```

**Fields**:
- `domainKey`: Domain key for ChatKit access (from .env.local)
- `backendEndpoint`: URL of the custom backend API endpoint
- `authToken`: JWT token for backend authentication
- `conversationId`: Optional conversation ID for persistence
- `onMessage`: Callback when user sends a message
- `onResponse`: Callback when backend responds
- `onError`: Callback when an error occurs

**Validation Rules**:
- `domainKey` must not be empty
- `backendEndpoint` must be valid URL
- `authToken` must be valid JWT token
- `conversationId` must be valid UUID if provided

**Usage**: Passed to ChatKit initialization to configure custom backend integration

---

### 2. BackendMessage

Message format from the existing backend API.

**TypeScript Interface**:
```typescript
interface BackendMessage {
  role: 'user' | 'assistant' | 'tool';
  content: string;
  timestamp: string; // ISO 8601 format
}
```

**Fields**:
- `role`: The sender of the message (user, AI assistant, or tool)
- `content`: The text content of the message
- `timestamp`: When the message was created (ISO 8601 datetime string)

**Validation Rules**:
- `role` must be one of: 'user', 'assistant', 'tool'
- `content` must not be empty
- `timestamp` must be valid ISO 8601 datetime string

**Usage**: Received from backend API, needs to be translated to ChatKit format

---

### 3. ChatKitMessage

Message format expected by hosted ChatKit (to be confirmed with ChatKit documentation).

**TypeScript Interface**:
```typescript
interface ChatKitMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
```

**Fields**:
- `id`: Unique identifier for the message
- `role`: The sender (user or assistant only, no 'tool' role)
- `content`: The text content of the message
- `timestamp`: When the message was created

**Validation Rules**:
- `id` must be unique
- `role` must be either 'user' or 'assistant'
- `content` must not be empty
- `timestamp` must be valid datetime string

**Usage**: Format used by ChatKit for displaying messages

**Note**: Tool messages from backend are converted to assistant messages for ChatKit display

---

### 4. ChatRequest

Request payload for sending a message to the backend.

**TypeScript Interface**:
```typescript
interface ChatRequest {
  message: string;
  conversation_id?: string;
}
```

**Fields**:
- `message`: The user's message text
- `conversation_id`: Optional ID of existing conversation

**Validation Rules**:
- `message` must not be empty after trimming whitespace
- `message` must be ≤ 5000 characters
- `conversation_id` must be valid UUID if provided

**Usage**: Sent to backend API when user sends a message via ChatKit

---

### 5. ChatResponse

Response payload from the backend API.

**TypeScript Interface**:
```typescript
interface ChatResponse {
  response: string;
  conversation_id: string;
  tool_calls: ToolCall[];
  messages: BackendMessage[];
}
```

**Fields**:
- `response`: The AI's response text
- `conversation_id`: ID of the conversation (new or existing)
- `tool_calls`: Array of tool calls made by the AI
- `messages`: Recent messages (user message + assistant response)

**Validation Rules**:
- `response` must be a string (can be empty)
- `conversation_id` must be valid UUID
- `tool_calls` must be an array (can be empty)
- `messages` must contain at least 2 messages

**Usage**: Received from backend, needs to be translated to ChatKit format

---

### 6. ToolCall

Represents an AI invocation of an MCP tool (todo operation).

**TypeScript Interface**:
```typescript
interface ToolCall {
  name: string;
  input: Record<string, any>;
  output?: Record<string, any>;
  status: 'success' | 'error';
}
```

**Fields**:
- `name`: Name of the tool that was called
- `input`: Parameters passed to the tool
- `output`: Result returned by the tool (optional if error)
- `status`: Whether the tool call succeeded or failed

**Validation Rules**:
- `name` must match one of the available MCP tools
- `input` must be a valid object
- `status` must be either 'success' or 'error'

**Tool Names**:
- `add_task`: Create a new todo task
- `list_tasks`: List user's todo tasks
- `update_task`: Update an existing task
- `complete_task`: Mark a task as completed
- `delete_task`: Delete a task

**Usage**: Used to detect when AI performs todo operations and trigger todo list refresh

---

### 7. Conversation

Metadata about a conversation.

**TypeScript Interface**:
```typescript
interface Conversation {
  id: string;
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
}
```

**Fields**:
- `id`: Unique identifier for the conversation (UUID)
- `created_at`: When the conversation was created
- `updated_at`: When the conversation was last updated

**Validation Rules**:
- `id` must be valid UUID
- `created_at` and `updated_at` must be valid ISO 8601 datetime strings
- `updated_at` must be >= `created_at`

**Usage**: Received when listing user's conversations

---

### 8. ConversationDetail

Detailed conversation information including full message history.

**TypeScript Interface**:
```typescript
interface ConversationDetail {
  id: string;
  created_at: string;
  updated_at: string;
  messages: BackendMessage[];
}
```

**Fields**:
- `id`: Unique identifier for the conversation
- `created_at`: When the conversation was created
- `updated_at`: When the conversation was last updated
- `messages`: Full array of messages in chronological order

**Validation Rules**:
- Same as Conversation for metadata fields
- `messages` must be sorted by timestamp (ascending)
- `messages` can be empty for new conversations

**Usage**: Received when loading conversation history on mount

---

## Bridge Layer Models

### 9. ChatKitBridgeState

State managed by the ChatKit bridge layer.

**TypeScript Interface**:
```typescript
interface ChatKitBridgeState {
  conversationId: string | null;
  userId: string;
  isInitialized: boolean;
  lastError: string | null;
}
```

**Fields**:
- `conversationId`: Current conversation ID (null for new conversation)
- `userId`: Current user ID (from auth context)
- `isInitialized`: Whether ChatKit has been initialized
- `lastError`: Last error message (null if no error)

**State Transitions**:
1. **Initial State**: No conversation, not initialized
2. **Initializing**: Loading conversation history if conversationId exists
3. **Ready**: ChatKit initialized and ready for messages
4. **Error**: Initialization or message sending failed

---

## Message Translation

### Backend to ChatKit Translation

```typescript
function translateBackendMessageToChatKit(backendMsg: BackendMessage): ChatKitMessage {
  return {
    id: generateMessageId(backendMsg),
    role: backendMsg.role === 'tool' ? 'assistant' : backendMsg.role,
    content: backendMsg.content,
    timestamp: backendMsg.timestamp,
  };
}
```

**Translation Rules**:
- `tool` role messages are converted to `assistant` role for ChatKit
- Message ID is generated from timestamp and content hash
- Content and timestamp are preserved as-is

---

## Data Flow

### Sending a Message

```
1. User types message in ChatKit
2. ChatKit calls onMessage callback
3. Bridge layer receives message
4. Bridge creates ChatRequest { message, conversation_id }
5. Bridge calls backend API via apiClient
6. Backend processes message, calls MCP tools if needed
7. Backend returns ChatResponse { response, conversation_id, tool_calls, messages }
8. Bridge stores conversation_id in localStorage
9. Bridge checks tool_calls array
10. If tool_calls present, trigger todo list refresh
11. Bridge translates BackendMessage[] to ChatKitMessage[]
12. Bridge updates ChatKit with translated messages
13. ChatKit displays messages
```

### Loading Conversation History

```
1. ChatKitEmbed component mounts
2. Check localStorage for conversation_id
3. If found, call bridge.loadConversationHistory(conversationId)
4. Bridge calls apiClient.getConversationDetail(userId, conversationId)
5. Backend returns ConversationDetail { id, created_at, updated_at, messages }
6. Bridge translates BackendMessage[] to ChatKitMessage[]
7. Bridge initializes ChatKit with translated messages
8. ChatKit displays conversation history
```

---

## Storage Strategy

### localStorage

**Key**: `chatkit-conversation-id`
**Value**: UUID string of current conversation
**Lifecycle**:
- Created when first message is sent
- Persists across browser sessions
- Cleared when user starts new conversation (future feature)

**Example**:
```typescript
localStorage.setItem('chatkit-conversation-id', '550e8400-e29b-41d4-a716-446655440000');
```

---

## Type Definitions File

All interfaces will be defined in `phase-3/frontend/src/lib/chatkit-config.ts`:

```typescript
// phase-3/frontend/src/lib/chatkit-config.ts

export interface ChatKitConfig {
  domainKey: string;
  backendEndpoint: string;
  authToken: string;
  conversationId?: string;
  onMessage?: (message: string) => Promise<void>;
  onResponse?: (response: any) => void;
  onError?: (error: any) => void;
}

export interface BackendMessage {
  role: 'user' | 'assistant' | 'tool';
  content: string;
  timestamp: string;
}

export interface ChatKitMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  tool_calls: ToolCall[];
  messages: BackendMessage[];
}

export interface ToolCall {
  name: string;
  input: Record<string, any>;
  output?: Record<string, any>;
  status: 'success' | 'error';
}

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationDetail extends Conversation {
  messages: BackendMessage[];
}

export interface ChatKitBridgeState {
  conversationId: string | null;
  userId: string;
  isInitialized: boolean;
  lastError: string | null;
}

// Utility functions
export function getStoredConversationId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('chatkit-conversation-id');
}

export function setStoredConversationId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('chatkit-conversation-id', id);
}

export function clearStoredConversationId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('chatkit-conversation-id');
}

export function translateBackendMessageToChatKit(backendMsg: BackendMessage): ChatKitMessage {
  return {
    id: `${backendMsg.timestamp}-${backendMsg.role}`,
    role: backendMsg.role === 'tool' ? 'assistant' : backendMsg.role,
    content: backendMsg.content,
    timestamp: backendMsg.timestamp,
  };
}

export function getChatKitDomainKey(): string {
  return process.env.NEXT_PUBLIC_CHATKIT_DOMAIN_KEY || '';
}

export function getChatKitBackendUrl(): string {
  return process.env.NEXT_PUBLIC_CHATKIT_BACKEND_URL || 'http://localhost:8000/api/v1';
}
```

---

## Backend Models (Reference Only)

The backend models are already implemented and stable. They are documented here for reference but will not be modified as part of this feature.

### Backend: Conversation (SQLModel)
- `id`: UUID primary key
- `user_id`: Foreign key to User
- `created_at`: DateTime
- `updated_at`: DateTime

### Backend: Message (SQLModel)
- `id`: UUID primary key
- `conversation_id`: Foreign key to Conversation
- `role`: Enum (user, assistant, tool)
- `content`: String (max 5000)
- `timestamp`: DateTime
- `tool_calls`: JSON (optional)
- `tool_responses`: JSON (optional)

### Backend: ToolCall (SQLModel)
- `id`: UUID primary key
- `conversation_id`: Foreign key to Conversation
- `message_id`: Foreign key to Message
- `tool_name`: String
- `tool_input`: JSON
- `tool_output`: JSON (optional)
- `timestamp`: DateTime

---

## Summary

The data model for this feature focuses on the bridge layer between hosted ChatKit and the existing backend API. Key design decisions:

1. **Hosted Service**: ChatKit manages its own UI state, frontend only manages configuration and message translation
2. **Bridge Layer**: Translates between ChatKit format and backend format without backend changes
3. **Type Safety**: All API interactions use strongly-typed interfaces
4. **Minimal State**: Only conversation_id persisted in localStorage
5. **Backend Authority**: Backend is source of truth for all data
6. **Message Translation**: Tool messages converted to assistant messages for ChatKit display

This design ensures clean separation between the hosted ChatKit UI, the bridge layer, and the existing backend API.
