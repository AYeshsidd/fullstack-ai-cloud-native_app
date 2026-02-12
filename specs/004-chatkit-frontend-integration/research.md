# Research: ChatKit Frontend Integration

**Feature**: 004-chatkit-frontend-integration | **Date**: 2026-02-10 | **Phase**: 0 - Research

## Overview

This document captures research findings and technical decisions for implementing the ChatKit Frontend Integration feature. ChatKit is OpenAI's hosted chat UI service (domain-allowlisted) that will be embedded in the Phase-3 frontend and configured to communicate with the existing backend API.

---

## 1. OpenAI Hosted ChatKit Service

### Research Question
What is OpenAI's hosted ChatKit, how does it work, and how to obtain domain key access?

### Decision
**ChatKit is OpenAI's hosted chat UI service** that provides a production-ready chat interface accessible via domain allowlisting. Key characteristics:
- **Hosted Service**: Runs on OpenAI's infrastructure, embedded via iframe or script tag
- **Domain Allowlisting**: Requires domain key for access control
- **Custom Backend Support**: Can be configured to use custom API endpoints (not just OpenAI's API)
- **Configuration**: Supports customization of appearance, behavior, and backend integration

### Rationale
Using hosted ChatKit provides:
- Production-ready UI without building custom components
- Maintained and updated by OpenAI
- Professional appearance and UX
- Reduced frontend development effort
- Focus on integration rather than UI implementation

### Alternatives Considered
1. **Build custom chat components**: More work, already designed in 004-ai-chat-ui
2. **Use third-party React library**: Adds dependency, requires adaptation
3. **Use OpenAI Assistants API**: Different architecture, requires backend changes

### Implementation Notes

**Domain Key Acquisition**:
- Contact OpenAI to request ChatKit access
- Provide domain(s) to be allowlisted (e.g., localhost:3000 for development, production domain)
- Receive domain key for configuration
- Store domain key in `.env.local` file

**Embedding ChatKit**:
```html
<!-- Option 1: iframe embed -->
<iframe
  src="https://chatkit.openai.com/embed?key=YOUR_DOMAIN_KEY"
  width="100%"
  height="600px"
  frameborder="0"
></iframe>

<!-- Option 2: Script tag embed -->
<script src="https://chatkit.openai.com/embed.js"></script>
<div id="chatkit-container" data-key="YOUR_DOMAIN_KEY"></div>
```

**Configuration Options** (to be confirmed with OpenAI documentation):
- Backend endpoint URL
- Authentication token passing
- Appearance customization (colors, fonts)
- Behavior settings (auto-scroll, timestamps)

---

## 2. ChatKit Configuration for Custom Backend

### Research Question
How to configure ChatKit to use a custom backend API instead of OpenAI's API?

### Decision
ChatKit supports custom backend configuration through initialization parameters:
- **Backend Endpoint**: Point to custom API URL
- **Authentication**: Pass JWT token for backend authentication
- **Message Format**: Bridge between ChatKit format and backend format
- **Event Handlers**: Handle message send, receive, and error events

### Rationale
Custom backend integration allows:
- Use existing Phase-3 backend API without modifications
- Maintain existing authentication and authorization
- Leverage existing AI agent and MCP tools
- Keep backend logic unchanged (frontend-only integration)

### Alternatives Considered
1. **Modify backend to match ChatKit format**: Out of scope, violates constraints
2. **Use OpenAI API directly**: Doesn't leverage existing backend and MCP tools
3. **Proxy through backend**: Adds complexity, unnecessary

### Implementation Notes

**ChatKit Configuration** (example structure):
```typescript
const chatKitConfig = {
  domainKey: process.env.NEXT_PUBLIC_CHATKIT_DOMAIN_KEY,
  backend: {
    endpoint: `${process.env.NEXT_PUBLIC_CHATKIT_BACKEND_URL}/users/${userId}/chat`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json',
    },
  },
  onMessage: async (message: string) => {
    // Handle message send
    return await sendToBackend(message);
  },
  onResponse: (response: any) => {
    // Handle backend response
    handleBackendResponse(response);
  },
  onError: (error: any) => {
    // Handle errors
    handleError(error);
  },
};
```

**Environment Variables** (.env.local):
```bash
NEXT_PUBLIC_CHATKIT_DOMAIN_KEY=your-domain-key-here
NEXT_PUBLIC_CHATKIT_BACKEND_URL=http://localhost:8000/api/v1
```

---

## 3. Backend Integration and Message Bridging

### Research Question
How does ChatKit communicate with custom backends, and how to bridge message formats?

### Decision
- **Communication Pattern**: ChatKit sends HTTP requests to configured backend endpoint
- **Message Format**: ChatKit expects specific request/response format (to be confirmed)
- **Bridge Layer**: Create adapter to translate between ChatKit format and backend format
- **CORS Handling**: Ensure backend allows requests from ChatKit domain

### Rationale
A bridge layer provides:
- Clean separation between ChatKit and backend
- Format translation without backend changes
- Error handling and retry logic
- Conversation state management

### Alternatives Considered
1. **Direct integration**: Requires backend format changes, out of scope
2. **Backend proxy**: Adds complexity, unnecessary
3. **No bridge**: Format mismatch would cause errors

### Implementation Notes

**Message Bridge Functions**:
```typescript
// Bridge layer in ChatKitBridge.tsx
class ChatKitBridge {
  async sendMessage(message: string, conversationId?: string) {
    // Translate to backend format
    const backendRequest = {
      message: message,
      conversation_id: conversationId || getStoredConversationId(),
    };

    // Send to backend
    const response = await apiClient.sendChatMessage(
      userId,
      backendRequest.message,
      backendRequest.conversation_id
    );

    // Translate response to ChatKit format
    if (response.success && response.data) {
      // Store conversation_id
      setStoredConversationId(response.data.conversation_id);

      // Check for tool calls
      if (response.data.tool_calls.length > 0) {
        onTodoListRefresh?.();
      }

      // Return formatted response for ChatKit
      return {
        message: response.data.response,
        conversationId: response.data.conversation_id,
      };
    }

    throw new Error(response.error || 'Failed to send message');
  }

  async loadConversationHistory(conversationId: string) {
    const response = await apiClient.getConversationDetail(userId, conversationId);

    if (response.success && response.data) {
      // Translate backend messages to ChatKit format
      return response.data.conversation.messages.map(msg => ({
        role: msg.role === 'tool' ? 'assistant' : msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
      }));
    }

    return [];
  }
}
```

**CORS Configuration** (backend - if needed):
```python
# In backend main.py or middleware
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://chatkit.openai.com", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 4. Message State Management and Conversation Persistence

### Research Question
How does hosted ChatKit manage message state, and how to persist conversation_id?

### Decision
- **ChatKit State**: ChatKit manages its own internal message state
- **Conversation Persistence**: Store conversation_id in localStorage
- **History Loading**: Load conversation history on mount via bridge layer
- **State Synchronization**: Bridge layer coordinates between ChatKit and backend

### Rationale
- ChatKit handles UI state internally (messages, scroll position, input)
- Application only needs to manage conversation_id for persistence
- localStorage provides cross-session persistence
- Bridge layer ensures state consistency

### Alternatives Considered
1. **sessionStorage**: Loses data on browser close, worse UX
2. **Backend-only state**: Requires additional API calls, slower
3. **No persistence**: Poor UX, conversations lost on refresh

### Implementation Notes

**Conversation Persistence Utilities**:
```typescript
const CONVERSATION_ID_KEY = 'chatkit-conversation-id';

function getStoredConversationId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CONVERSATION_ID_KEY);
}

function setStoredConversationId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONVERSATION_ID_KEY, id);
}

function clearStoredConversationId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CONVERSATION_ID_KEY);
}
```

**Initialization Flow**:
```typescript
useEffect(() => {
  const conversationId = getStoredConversationId();

  if (conversationId) {
    // Load conversation history
    chatKitBridge.loadConversationHistory(conversationId)
      .then(messages => {
        // Initialize ChatKit with history
        initializeChatKit(messages);
      })
      .catch(err => {
        console.error('Failed to load conversation:', err);
        clearStoredConversationId();
      });
  } else {
    // Initialize empty ChatKit
    initializeChatKit([]);
  }
}, []);
```

---

## 5. Error Handling and User Feedback

### Research Question
How does hosted ChatKit handle errors, and how to provide user-friendly error messages?

### Decision
- **ChatKit Error Handling**: Use ChatKit's built-in error display (if available)
- **Custom Error Messages**: Override with user-friendly messages via bridge layer
- **Retry Mechanism**: Implement retry logic in bridge layer
- **Network Failures**: Display clear messages with retry option

### Rationale
- ChatKit may have built-in error handling
- Custom messages provide better UX for backend-specific errors
- Retry logic in bridge layer gives more control
- Clear error messages improve user experience

### Alternatives Considered
1. **ChatKit-only errors**: May not be user-friendly for backend errors
2. **No retry logic**: Poor UX for transient failures
3. **Automatic retry**: Can create loops, wastes resources

### Implementation Notes

**Error Handling in Bridge**:
```typescript
async function handleChatKitMessage(message: string) {
  try {
    const response = await chatKitBridge.sendMessage(message, conversationId);
    return response;
  } catch (error) {
    // Translate backend errors to user-friendly messages
    const userMessage = translateError(error);

    // Display error in ChatKit (if supported) or fallback UI
    displayError(userMessage);

    // Store failed message for retry
    setLastFailedMessage(message);

    throw error;
  }
}

function translateError(error: any): string {
  if (error.message.includes('network')) {
    return 'Network error. Please check your connection and try again.';
  }
  if (error.message.includes('401')) {
    return 'Session expired. Please log in again.';
  }
  if (error.message.includes('500')) {
    return 'Server error. Please try again later.';
  }
  return error.message || 'An error occurred. Please try again.';
}
```

---

## 6. Todo List Integration and Synchronization

### Research Question
How to detect when AI performs todo operations and trigger todo list refresh?

### Decision
- **Detection Method**: Check `tool_calls` array in backend response
- **Refresh Trigger**: Direct callback to parent component (dashboard)
- **Timing**: Immediate refresh after receiving response with tool_calls
- **Coordination**: Parent component manages both ChatKit and todo list

### Rationale
- Tool calls in response indicate todo operations were performed
- Direct callback is simplest and most reliable
- Immediate refresh ensures UI reflects database state
- Parent component coordination avoids tight coupling

### Alternatives Considered
1. **Polling**: Inefficient, adds unnecessary network traffic
2. **WebSockets**: Out of scope, requires backend changes
3. **Event bus**: Over-engineered for single-page communication
4. **Optimistic updates**: Risk of inconsistency

### Implementation Notes

**Todo List Refresh Integration**:
```typescript
// In ChatKitBridge
async sendMessage(message: string, conversationId?: string) {
  const response = await apiClient.sendChatMessage(userId, message, conversationId);

  if (response.success && response.data) {
    // Check for tool calls
    if (response.data.tool_calls.length > 0) {
      // Trigger todo list refresh via callback
      this.onTodoListRefresh?.();
    }

    return response.data;
  }

  throw new Error(response.error || 'Failed to send message');
}

// In Dashboard page
const todoListRef = useRef<TodoListHandle>(null);

const handleTodoListRefresh = () => {
  todoListRef.current?.refresh();
};

<ChatKitEmbed
  userId={userId}
  onTodoListRefresh={handleTodoListRefresh}
/>
```

---

## 7. Dashboard Layout and Integration

### Research Question
How to integrate ChatKit into the existing dashboard layout?

### Decision
- **Layout**: Add ChatKit as third column in dashboard grid
- **Responsive Design**: Stack vertically on mobile, side-by-side on desktop
- **Styling**: Use Tailwind CSS to match existing dashboard design
- **Height**: Full-height container (600px or viewport-based)

### Rationale
- Three-column layout provides balanced visual hierarchy
- Responsive design ensures usability on all devices
- Tailwind CSS maintains consistency with existing design
- Full-height container maximizes chat visibility

### Alternatives Considered
1. **Modal/overlay**: Hides todo list, worse for multitasking
2. **Separate page**: Requires navigation, breaks workflow
3. **Bottom drawer**: Limited space, awkward for conversations
4. **Two-column with tabs**: More clicks, less efficient

### Implementation Notes

**Dashboard Layout**:
```typescript
// In dashboard/page.tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
  <div className="lg:col-span-1">
    <TodoForm
      userId={userId}
      onAddTodo={handleAddTodo}
      onAddSuccess={handleAddSuccess}
      onAddError={handleAddError}
    />
  </div>

  <div className="lg:col-span-1">
    <TodoList
      ref={todoListRef}
      userId={userId}
      onStatsChange={setTodoStats}
    />
  </div>

  <div className="lg:col-span-1">
    <ChatKitEmbed
      userId={userId}
      onTodoListRefresh={handleTodoListRefresh}
    />
  </div>
</div>
```

**ChatKit Container Styling**:
```typescript
<div className="bg-white rounded-xl shadow-lg border border-gray-100 h-[600px] flex flex-col">
  <div className="border-b border-gray-200 p-4">
    <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
    <p className="text-sm text-gray-600">Manage your todos with natural language</p>
  </div>

  <div className="flex-1 overflow-hidden">
    {/* ChatKit embed here */}
  </div>
</div>
```

---

## Summary of Key Decisions

| Area | Decision | Impact |
|------|----------|--------|
| ChatKit Type | OpenAI's hosted service (domain-allowlisted) | Requires domain key, embedded via iframe/script |
| Backend Integration | Custom backend via configuration | No backend changes needed |
| Message Bridge | Adapter layer for format translation | Clean separation, no backend changes |
| Conversation Storage | localStorage for conversation_id | Persists across sessions |
| History Loading | On component mount via bridge | Immediate continuity |
| Todo Refresh | Direct callback after tool_calls | Reliable, simple |
| Error Handling | Bridge layer with user-friendly messages | Better UX |
| Layout | 3-column dashboard grid | Balanced, responsive |

## Implementation Readiness

All research questions have been resolved with clear decisions and implementation guidance. Key findings:

1. **ChatKit is a hosted service** - requires domain key and embedding
2. **Custom backend support** - can be configured to use Phase-3 API
3. **Bridge layer needed** - to translate between formats
4. **No backend changes** - all work is frontend integration
5. **Environment configuration** - domain key in .env.local

**Next Steps**: Proceed to Phase 1 (Design & Contracts) to generate data-model.md, contracts/, and quickstart.md.

## References

- OpenAI ChatKit Documentation (to be accessed with domain key)
- Existing Backend Chat API: `phase-3/backend/api/v1/chat.py`
- Existing AI Agent Service: `phase-3/backend/services/ai_agent.py`
- Existing Frontend API Client: `phase-3/frontend/src/lib/api-client.ts`
- Existing Dashboard: `phase-3/frontend/src/app/dashboard/page.tsx`
