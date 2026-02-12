# Implementation Plan: ChatKit Frontend Integration

**Branch**: `004-chatkit-frontend-integration` | **Date**: 2026-02-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-chatkit-frontend-integration/spec.md`

## Summary

Integrate OpenAI's hosted ChatKit UI (domain-allowlisted service) into the Phase-3 frontend to provide a production-ready conversational interface for managing todos. ChatKit will be configured to communicate with the existing Phase-3 AI Chat API backend at `/api/v1/users/{user_id}/chat`, enabling users to manage todos through natural language while maintaining conversation persistence and real-time todo list updates.

## Technical Context

**Language/Version**: TypeScript 5.2.2, React 18.2.0, Next.js 14.0.1
**Primary Dependencies**: OpenAI hosted ChatKit (domain-allowlisted UI), existing API client
**Storage**: Browser localStorage for conversation_id persistence, backend PostgreSQL for message history
**Testing**: Manual end-to-end testing, browser-based validation
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
**Project Type**: Web application (frontend integration with hosted UI)
**Performance Goals**: <3s response time for chat messages, smooth rendering for 100+ messages
**Constraints**: Frontend-only (no backend changes), must use hosted ChatKit, work within phase-3/frontend only, domain key required for ChatKit access
**Scale/Scope**: Single chat interface, support for multiple conversations per user, 100+ messages per conversation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Alignment with Core Principles

✅ **Strict Spec-Driven Development**: This plan follows approved spec.md from `/specs/004-chatkit-frontend-integration/spec.md`

✅ **Phased Evolution**: Building on Phase III foundation (backend AI chat API already exists)

✅ **Production-Quality Mindset**: Using production-ready hosted ChatKit service, implementing proper configuration and integration

✅ **Explicit Behavior Only**: All chat interactions map to defined API contracts and ChatKit configuration

✅ **Deterministic Core Logic**: AI operates via backend tools, ChatKit only handles UI rendering

### Technology Constraints Compliance

✅ **Phase III Requirements**: AI-powered Todo chatbot using existing OpenAI integration and MCP tools

✅ **No Kubernetes**: Not applicable for this feature (frontend only)

✅ **Tech Stack**: Next.js frontend (existing), FastAPI backend (existing, no changes)

### Key Standards Compliance

✅ **API Definition**: Using existing `/api/v1/users/{user_id}/chat` endpoint

✅ **Clear Separation**: Frontend (hosted ChatKit UI), Backend (AI agent), MCP tools (todo operations), Database (persistence)

✅ **Explicit Errors**: Will implement error messages for network failures, API errors, and invalid states

### AI Rules Compliance

✅ **AI in Phase III**: Appropriate phase for AI chatbot integration

✅ **Deterministic Actions**: Natural language maps to MCP tool calls (add_task, list_tasks, update_task, complete_task, delete_task)

✅ **Tool-Driven**: AI operates via backend tools, not free-form text mutation

✅ **OpenAI ChatKit Required**: Using OpenAI's hosted ChatKit as specified in constitution

### Gate Status: ✅ PASSED

No violations detected. All requirements align with constitution principles.

## Project Structure

### Documentation (this feature)

```text
specs/004-chatkit-frontend-integration/
├── spec.md              # Feature specification (already exists)
├── plan.md              # This file
├── research.md          # Phase 0 output (to be generated)
├── data-model.md        # Phase 1 output (to be generated)
├── quickstart.md        # Phase 1 output (to be generated)
├── contracts/           # Phase 1 output (to be generated)
└── tasks.md             # Phase 2 output (created by /sp.tasks - NOT by /sp.plan)
```

### Source Code (repository root)

```text
phase-3/
├── backend/
│   ├── api/v1/
│   │   └── chat.py                    # Existing chat endpoints (no changes needed)
│   ├── services/
│   │   └── ai_agent.py                # Existing AI agent service (no changes needed)
│   ├── models/
│   │   └── chat.py                    # Existing chat models (no changes needed)
│   └── schemas/
│       └── chat.py                    # Existing chat schemas (no changes needed)
│
└── frontend/
    ├── .env.local                     # NEW: ChatKit domain key configuration
    ├── src/
    │   ├── app/
    │   │   └── dashboard/
    │   │       └── page.tsx           # Update to embed ChatKit
    │   ├── components/
    │   │   ├── chat/                  # NEW: ChatKit integration utilities
    │   │   │   ├── ChatKitEmbed.tsx   # ChatKit iframe/embed wrapper
    │   │   │   └── ChatKitBridge.tsx  # Message bridge for backend API
    │   │   ├── TodoList.tsx           # Existing (may need refresh trigger)
    │   │   ├── TodoForm.tsx           # Existing
    │   │   └── Navbar.tsx             # Existing
    │   └── lib/
    │       ├── api-client.ts          # Existing (extend with chat methods if needed)
    │       ├── api.ts                 # Existing API utilities
    │       └── chatkit-config.ts      # NEW: ChatKit configuration utilities
    │
    └── tests/                         # Manual testing documentation
```

**Structure Decision**: Web application structure. Frontend changes only, leveraging existing backend infrastructure. ChatKit integration utilities will be organized in `components/chat/` directory. The dashboard page will be updated to embed the hosted ChatKit UI alongside the existing todo list.

## Complexity Tracking

No violations requiring justification. This feature integrates cleanly into the existing Phase III architecture using OpenAI's hosted ChatKit service without introducing additional complexity or violating constitution principles.

## Phase 0: Outline & Research

### Research Questions

1. **OpenAI Hosted ChatKit Service**
   - What is OpenAI's hosted ChatKit and how does it work?
   - How to obtain a domain key for ChatKit access?
   - What are the domain allowlisting requirements?
   - How to embed ChatKit in a Next.js application?

2. **ChatKit Configuration**
   - How to configure ChatKit to use a custom backend API (not OpenAI's API)?
   - What configuration options are available (appearance, behavior)?
   - How to pass authentication tokens to ChatKit?
   - How to handle conversation_id with hosted ChatKit?

3. **Backend Integration**
   - How does ChatKit communicate with custom backend endpoints?
   - What message format does ChatKit expect from the backend?
   - How to bridge between ChatKit's format and our backend API?
   - How to handle CORS and authentication?

4. **Message State Management**
   - How does hosted ChatKit manage message state?
   - How to load initial conversation history into ChatKit?
   - How to persist conversation_id with hosted ChatKit?
   - How to synchronize state between ChatKit and todo list?

5. **Error Handling**
   - How does hosted ChatKit handle API errors?
   - How to customize error messages?
   - How to handle network failures?
   - How to implement retry logic?

### Research Outputs

Research findings will be documented in `research.md` with the following structure:
- Decision: [what was chosen]
- Rationale: [why chosen]
- Alternatives considered: [what else was evaluated]
- Implementation notes: [specific guidance for implementation]

## Phase 1: Design & Contracts

### Data Model

The data model for this feature is already defined in the backend. Frontend will need to understand the message format expected by hosted ChatKit and how to bridge it with the backend API:

**ChatKit Message Format** (to be researched and documented):

```typescript
// ChatKit expected format (to be confirmed in research)
interface ChatKitMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Backend message format (existing)
interface BackendMessage {
  role: 'user' | 'assistant' | 'tool';
  content: string;
  timestamp: string;
}

// Bridge configuration
interface ChatKitConfig {
  domainKey: string;
  backendEndpoint: string;
  authToken: string;
  conversationId?: string;
}
```

### API Contracts

**Existing Backend Endpoints** (no changes needed):

1. **POST /api/v1/users/{user_id}/chat**
   - Request: `{ message: string, conversation_id?: string }`
   - Response: `{ response: string, conversation_id: string, tool_calls: ToolCall[], messages: BackendMessage[] }`
   - Authentication: JWT Bearer token
   - Purpose: Send user message and receive AI response

2. **GET /api/v1/users/{user_id}/conversations/{conversation_id}**
   - Response: `{ conversation: { id, created_at, updated_at, messages: BackendMessage[] } }`
   - Authentication: JWT Bearer token
   - Purpose: Get detailed conversation history

**ChatKit Integration Layer** (to be implemented):

The integration layer will bridge between hosted ChatKit and the backend API:

```typescript
// Configuration utilities
function getChatKitDomainKey(): string
function configureChatKitEndpoint(userId: string): string
function getAuthToken(): string

// Message bridge functions
function handleChatKitMessage(message: string): Promise<void>
function sendToBackend(message: string, conversationId?: string): Promise<BackendResponse>
function updateChatKitWithResponse(response: BackendResponse): void
function detectToolCalls(response: BackendResponse): boolean
```

### Component Architecture

**Component Hierarchy**:

```
Dashboard Page
├── TodoForm
├── TodoList
└── ChatKitEmbed (new)
    ├── Hosted ChatKit UI (iframe/embed)
    └── ChatKitBridge (message handler)
        └── API Client (existing)
```

**Component Responsibilities**:

1. **ChatKitEmbed**: Wrapper component that embeds the hosted ChatKit UI
2. **ChatKitBridge**: Handles message passing between ChatKit and backend API
3. **Hosted ChatKit UI**: OpenAI's hosted interface (embedded via iframe or script)
4. **API Client**: Existing client for backend communication

### Configuration Strategy

**Environment Variables** (.env.local):

```bash
# ChatKit Configuration
NEXT_PUBLIC_CHATKIT_DOMAIN_KEY=your-domain-key-here
NEXT_PUBLIC_CHATKIT_BACKEND_URL=http://localhost:8000/api/v1
```

**ChatKit Initialization**:

```typescript
// Initialize ChatKit with custom backend
const chatKitConfig = {
  domainKey: process.env.NEXT_PUBLIC_CHATKIT_DOMAIN_KEY,
  backendEndpoint: `${process.env.NEXT_PUBLIC_CHATKIT_BACKEND_URL}/users/${userId}/chat`,
  authToken: getAuthToken(),
  onMessage: handleChatKitMessage,
  onError: handleChatKitError,
};
```

### Integration Points

1. **Dashboard Integration**: Embed ChatKit in dashboard page alongside todo list
2. **Todo List Refresh**: Trigger todo list refresh after successful tool calls
3. **Authentication**: Pass JWT token to ChatKit for backend authentication
4. **Conversation Persistence**: Store conversation_id in localStorage
5. **Error Handling**: Bridge ChatKit errors to user-friendly messages

## Phase 2: Task Generation

Task generation will be handled by the `/sp.tasks` command (not part of this plan). The tasks will be based on the design artifacts generated in Phase 0 and Phase 1.

## Implementation Notes

### Critical Success Factors

1. **Domain Key Configuration**: Obtain and configure ChatKit domain key correctly
2. **Backend Integration**: Successfully connect hosted ChatKit to custom backend API
3. **Message Bridging**: Correctly translate between ChatKit format and backend format
4. **Conversation Persistence**: Ensure conversation_id is properly stored and retrieved
5. **Todo Sync**: Refresh todo list after AI performs todo operations
6. **Error Recovery**: Graceful error handling with user-friendly messages

### Non-Goals (Out of Scope)

- Modifying the backend API or adding new endpoints
- Building custom chat UI components (using hosted ChatKit instead)
- Adding real-time WebSocket connections (Phase III uses HTTP polling)
- Implementing message editing or deletion
- Adding file upload or media sharing capabilities
- Implementing multi-user conversations
- Adding conversation search or filtering
- Implementing conversation export or sharing

### Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Domain key not available | High | Research ChatKit access requirements, contact OpenAI if needed |
| ChatKit requires OpenAI API only | High | Verify ChatKit supports custom backends in research phase |
| CORS issues with custom backend | High | Configure CORS headers on backend, use proxy if needed |
| Message format mismatch | Medium | Create bridge layer to translate formats |
| Conversation state loss | High | Persist conversation_id to localStorage, implement recovery |
| Todo list out of sync | High | Trigger refresh after tool calls, implement polling fallback |
| Network failures | High | Use ChatKit's error handling, show clear error messages |

## Next Steps

1. ✅ Complete Phase 0: Generate `research.md` with findings on hosted ChatKit service and integration patterns
2. ⏳ Complete Phase 1: Generate `data-model.md` and `contracts/` directory
3. ⏳ Update agent context with new technologies and patterns
4. ⏳ Generate `quickstart.md` for developers
5. ⏳ Run `/sp.tasks` to generate implementation tasks

## Appendix

### References

- Feature Spec: `specs/004-chatkit-frontend-integration/spec.md`
- Constitution: `.specify/memory/constitution.md`
- Existing Backend Chat API: `phase-3/backend/api/v1/chat.py`
- Existing AI Agent Service: `phase-3/backend/services/ai_agent.py`
- Existing Frontend API Client: `phase-3/frontend/src/lib/api-client.ts`

### Glossary

- **ChatKit**: OpenAI's hosted chat UI service (domain-allowlisted)
- **Domain Key**: Authentication key for accessing hosted ChatKit
- **MCP**: Model Context Protocol - framework for AI tool calling
- **Conversation**: A chat session between user and AI assistant
- **Tool Call**: AI invocation of a todo management function (add, list, update, complete, delete)
- **Message**: Individual chat message (user or assistant)
- **conversation_id**: Unique identifier for a conversation session
- **Bridge**: Integration layer between hosted ChatKit and custom backend API
