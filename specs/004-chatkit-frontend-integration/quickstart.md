# Quickstart Guide: ChatKit Frontend Integration

**Feature**: 004-chatkit-frontend-integration | **Date**: 2026-02-10

## Overview

This guide provides step-by-step instructions for integrating OpenAI's hosted ChatKit service into the Phase-3 frontend. Follow these steps to embed ChatKit, configure it to use the custom backend API, and coordinate with the todo list component.

---

## Prerequisites

- Phase-3 backend is running and accessible at `http://localhost:8000`
- Phase-3 frontend is set up with Next.js 14.0.1
- User authentication is working (JWT tokens)
- Existing todo list functionality is operational
- **ChatKit domain key obtained from OpenAI** (required for access)

---

## Implementation Steps

### Step 1: Configure Environment Variables

Create or update `phase-3/frontend/.env.local` with ChatKit configuration:

```bash
# ChatKit Configuration
NEXT_PUBLIC_CHATKIT_DOMAIN_KEY=your-domain-key-here
NEXT_PUBLIC_CHATKIT_BACKEND_URL=http://localhost:8000/api/v1

# Existing environment variables
# ... (keep existing vars)
```

**Important**:
- Replace `your-domain-key-here` with the actual domain key from OpenAI
- For production, update `NEXT_PUBLIC_CHATKIT_BACKEND_URL` to production backend URL
- Never commit `.env.local` to version control

---

### Step 2: Create Type Definitions

Create `phase-3/frontend/src/lib/chatkit-config.ts` with TypeScript interfaces and utility functions:

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

// Utility functions
const CONVERSATION_ID_KEY = 'chatkit-conversation-id';

export function getStoredConversationId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CONVERSATION_ID_KEY);
}

export function setStoredConversationId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONVERSATION_ID_KEY, id);
}

export function clearStoredConversationId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CONVERSATION_ID_KEY);
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

### Step 3: Extend API Client (if needed)

Check if `phase-3/frontend/src/lib/api-client.ts` already has chat methods. If not, add them:

```typescript
// Add to existing ApiClient class in api-client.ts

/**
 * Send a chat message to the AI assistant
 */
async sendChatMessage(
  userId: string,
  message: string,
  conversationId?: string
): Promise<ApiResponse<ChatResponse>> {
  return this.post<ChatResponse>(`/api/v1/users/${userId}/chat`, {
    message,
    conversation_id: conversationId,
  });
}

/**
 * Get detailed conversation with message history
 */
async getConversationDetail(
  userId: string,
  conversationId: string
): Promise<ApiResponse<{ conversation: ConversationDetail }>> {
  return this.get<{ conversation: ConversationDetail }>(
    `/api/v1/users/${userId}/conversations/${conversationId}`
  );
}
```

Don't forget to import the types:

```typescript
import type { ChatResponse, ConversationDetail } from './chatkit-config';
```

---

### Step 4: Create ChatKit Bridge Component

Create `phase-3/frontend/src/components/chat/ChatKitBridge.tsx`:

```typescript
'use client';

import { apiClient } from '@/lib/api-client';
import {
  getStoredConversationId,
  setStoredConversationId,
  translateBackendMessageToChatKit,
  type ChatKitMessage,
} from '@/lib/chatkit-config';

interface ChatKitBridgeProps {
  userId: string;
  onTodoListRefresh?: () => void;
}

export class ChatKitBridge {
  private userId: string;
  private onTodoListRefresh?: () => void;

  constructor(userId: string, onTodoListRefresh?: () => void) {
    this.userId = userId;
    this.onTodoListRefresh = onTodoListRefresh;
  }

  async sendMessage(message: string, conversationId?: string) {
    const response = await apiClient.sendChatMessage(
      this.userId,
      message,
      conversationId || getStoredConversationId() || undefined
    );

    if (response.success && response.data) {
      // Store conversation_id
      setStoredConversationId(response.data.conversation_id);

      // Check for tool calls
      if (response.data.tool_calls.length > 0) {
        this.onTodoListRefresh?.();
      }

      return {
        message: response.data.response,
        conversationId: response.data.conversation_id,
      };
    }

    throw new Error(response.error || 'Failed to send message');
  }

  async loadConversationHistory(conversationId: string): Promise<ChatKitMessage[]> {
    const response = await apiClient.getConversationDetail(this.userId, conversationId);

    if (response.success && response.data) {
      return response.data.conversation.messages.map(translateBackendMessageToChatKit);
    }

    return [];
  }
}
```

---

### Step 5: Create ChatKit Embed Component

Create `phase-3/frontend/src/components/chat/ChatKitEmbed.tsx`:

```typescript
'use client';

import { useEffect, useRef, useState } from 'react';
import { ChatKitBridge } from './ChatKitBridge';
import {
  getChatKitDomainKey,
  getChatKitBackendUrl,
  getStoredConversationId,
  clearStoredConversationId,
} from '@/lib/chatkit-config';

interface ChatKitEmbedProps {
  userId: string;
  onTodoListRefresh?: () => void;
}

export function ChatKitEmbed({ userId, onTodoListRefresh }: ChatKitEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const bridgeRef = useRef<ChatKitBridge | null>(null);

  useEffect(() => {
    // Initialize bridge
    bridgeRef.current = new ChatKitBridge(userId, onTodoListRefresh);

    // Load conversation history if exists
    const conversationId = getStoredConversationId();
    if (conversationId) {
      bridgeRef.current
        .loadConversationHistory(conversationId)
        .then((messages) => {
          // Initialize ChatKit with history
          // TODO: Call ChatKit initialization with messages
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load conversation:', err);
          clearStoredConversationId();
          setError('Failed to load conversation history');
          setIsLoading(false);
        });
    } else {
      // Initialize empty ChatKit
      // TODO: Call ChatKit initialization
      setIsLoading(false);
    }
  }, [userId, onTodoListRefresh]);

  const handleChatKitMessage = async (message: string) => {
    if (!bridgeRef.current) return;

    try {
      const response = await bridgeRef.current.sendMessage(message);
      // ChatKit will handle displaying the response
      return response;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 h-[600px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 h-[600px] flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
        <p className="text-sm text-gray-600">Manage your todos with natural language</p>
      </div>

      {/* Error display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* ChatKit embed container */}
      <div className="flex-1 overflow-hidden">
        {/* TODO: Embed ChatKit here using iframe or script tag */}
        {/* Example iframe embed: */}
        <iframe
          src={`https://chatkit.openai.com/embed?key=${getChatKitDomainKey()}`}
          width="100%"
          height="100%"
          frameBorder="0"
          title="ChatKit"
        />
      </div>
    </div>
  );
}
```

**Note**: The actual ChatKit embedding code depends on OpenAI's ChatKit documentation. The iframe example above is illustrative. Consult ChatKit documentation for the correct embedding method.

---

### Step 6: Update Dashboard Page

Update `phase-3/frontend/src/app/dashboard/page.tsx` to include ChatKit:

```typescript
// Add import
import { ChatKitEmbed } from '../../components/chat/ChatKitEmbed';

// Add ref for TodoList (if not already present)
import { useRef } from 'react';

// Inside component, add ref
const todoListRef = useRef<any>(null);

// Add refresh handler
const handleTodoListRefresh = () => {
  // Trigger a re-fetch of todos
  // This depends on how TodoList is implemented
  // Option 1: If TodoList has a refresh method
  todoListRef.current?.refresh();

  // Option 2: If using a key to force re-render
  // setTodoListKey(prev => prev + 1);
};

// Update the grid layout to 3 columns
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div className="transform transition-transform duration-300 hover:-translate-y-1 animate-fadeIn">
    <TodoForm
      userId={userId}
      onAddTodo={handleAddTodo}
      onAddSuccess={handleAddSuccess}
      onAddError={handleAddError}
    />
  </div>

  <div className="transform transition-transform duration-300 hover:-translate-y-1 animate-fadeIn delay-100">
    <TodoList
      ref={todoListRef}
      userId={userId}
      onStatsChange={setTodoStats}
    />
  </div>

  <div className="transform transition-transform duration-300 hover:-translate-y-1 animate-fadeIn delay-200">
    <ChatKitEmbed
      userId={userId}
      onTodoListRefresh={handleTodoListRefresh}
    />
  </div>
</div>
```

---

## Testing

### Manual Testing Checklist

1. **Environment Setup**
   - [ ] Verify `.env.local` has correct ChatKit domain key
   - [ ] Verify backend is running at configured URL
   - [ ] Verify frontend can access environment variables

2. **ChatKit Embedding**
   - [ ] Open dashboard
   - [ ] Verify ChatKit UI loads without errors
   - [ ] Verify ChatKit displays correctly in the layout

3. **Send First Message**
   - [ ] Type "Add a task to buy groceries" in ChatKit
   - [ ] Verify message is sent to backend
   - [ ] Verify AI response appears in ChatKit
   - [ ] Verify todo appears in todo list

4. **Conversation Persistence**
   - [ ] Send several messages
   - [ ] Refresh the page
   - [ ] Verify previous messages are still visible
   - [ ] Send another message
   - [ ] Verify conversation continues with same conversation_id

5. **Todo Operations**
   - [ ] Test: "What are my tasks?"
   - [ ] Test: "Mark the first task as complete"
   - [ ] Test: "Update the task to buy organic groceries"
   - [ ] Test: "Delete the groceries task"
   - [ ] Verify todo list updates after each operation

6. **Error Handling**
   - [ ] Stop backend server
   - [ ] Try sending a message
   - [ ] Verify error message appears
   - [ ] Restart backend
   - [ ] Verify can send messages again

---

## Troubleshooting

### Issue: ChatKit doesn't load

**Solution**:
- Check browser console for errors
- Verify domain key is correct in `.env.local`
- Verify domain is allowlisted with OpenAI
- Check network tab for failed requests

### Issue: Messages not reaching backend

**Solution**:
- Verify backend URL in `.env.local`
- Check CORS configuration on backend
- Verify JWT token is being sent
- Check backend logs for errors

### Issue: Conversation not persisting

**Solution**:
- Check browser DevTools → Application → Local Storage
- Verify `chatkit-conversation-id` key exists
- Check bridge layer is storing conversation_id correctly

### Issue: Todo list not refreshing

**Solution**:
- Verify `onTodoListRefresh` callback is properly connected
- Check that `tool_calls` array is being detected
- Verify TodoList has a refresh method

### Issue: Authentication errors

**Solution**:
- Verify JWT token exists in localStorage
- Check token expiration
- Re-login if needed

---

## Next Steps

After completing the implementation:

1. Test all scenarios from the checklist
2. Fix any runtime errors or integration issues
3. Verify end-to-end flow works correctly
4. Document any deviations from the plan
5. Prepare for code review and deployment

---

## Resources

- **Spec**: `specs/004-chatkit-frontend-integration/spec.md`
- **Plan**: `specs/004-chatkit-frontend-integration/plan.md`
- **Research**: `specs/004-chatkit-frontend-integration/research.md`
- **Data Model**: `specs/004-chatkit-frontend-integration/data-model.md`
- **API Contracts**: `specs/004-chatkit-frontend-integration/contracts/`
- **Backend Chat API**: `phase-3/backend/api/v1/chat.py`
- **OpenAI ChatKit Documentation**: (access with domain key)
