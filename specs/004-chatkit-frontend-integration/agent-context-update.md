# Agent Context Update Notes

**Feature**: 004-chatkit-frontend-integration | **Date**: 2026-02-10 | **Phase**: 1 - Post-Design

## Overview

This document describes the agent context updates that should be applied after completing the planning phase. Since the PowerShell script `.specify/scripts/powershell/update-agent-context.ps1` is not available in the current environment, these updates should be applied manually or when the script becomes available.

---

## Technologies Added

The following technologies and patterns were introduced in this feature and should be added to the agent context:

### Frontend Technologies

1. **OpenAI Hosted ChatKit**
   - Hosted chat UI service (domain-allowlisted)
   - Embedded via iframe or script tag
   - Requires domain key for access
   - Supports custom backend configuration

2. **Bridge Layer Pattern**
   - Adapter pattern for format translation
   - Separates hosted UI from backend API
   - Handles message translation between formats
   - Manages conversation state and persistence

3. **Environment Configuration**
   - `.env.local` for ChatKit domain key
   - `NEXT_PUBLIC_CHATKIT_DOMAIN_KEY` environment variable
   - `NEXT_PUBLIC_CHATKIT_BACKEND_URL` environment variable

4. **TypeScript Interfaces for ChatKit**
   - `ChatKitConfig`, `ChatKitMessage`, `BackendMessage`
   - `ChatRequest`, `ChatResponse`, `ToolCall`
   - `Conversation`, `ConversationDetail`, `ChatKitBridgeState`
   - Located in: `phase-3/frontend/src/lib/chatkit-config.ts`

### Integration Patterns

1. **Hosted Service Integration**
   - Embedding external hosted UI in React application
   - Domain allowlisting and authentication
   - Custom backend configuration for hosted services

2. **Message Format Translation**
   - Bridge layer translates between ChatKit format and backend format
   - Tool messages converted to assistant messages for display
   - Message ID generation from timestamp and role

3. **Conversation Persistence**
   - localStorage for conversation_id with key `chatkit-conversation-id`
   - Load conversation history on component mount
   - Clear conversation_id on errors or new conversation

4. **Todo List Synchronization**
   - Detect tool_calls in backend response
   - Trigger todo list refresh via callback
   - Parent component coordinates both ChatKit and todo list

### Component Architecture

1. **ChatKitEmbed Component**
   - Wrapper for hosted ChatKit UI
   - Handles initialization and loading states
   - Manages error display

2. **ChatKitBridge Class**
   - Message bridge between ChatKit and backend
   - Handles API calls and format translation
   - Manages conversation state

3. **Dashboard Integration**
   - 3-column grid layout (TodoForm | TodoList | ChatKitEmbed)
   - Responsive design (stack on mobile, side-by-side on desktop)
   - Coordinated state management via refs and callbacks

---

## Existing Technologies Reinforced

The following existing technologies were used and their patterns reinforced:

1. **Tailwind CSS**
   - Consistent styling with existing dashboard components
   - Responsive grid layout (`grid-cols-1 lg:grid-cols-3`)
   - Utility classes for animations and transitions

2. **Next.js App Router**
   - Client components with `'use client'` directive
   - Server-side rendering safety checks
   - Environment variable access via `process.env.NEXT_PUBLIC_*`

3. **API Client Pattern**
   - Extending existing `ApiClient` class
   - Consistent error handling with `ApiResponse<T>` type
   - JWT token injection via existing mechanism

4. **Component Organization**
   - Feature-based directory structure (`components/chat/`)
   - Consistent naming conventions
   - Export patterns

---

## Manual Update Instructions

If updating the agent context manually, add the following to the appropriate agent-specific context file (e.g., `.claude/context.md` or similar):

### Section: Frontend Patterns

```markdown
#### ChatKit Integration Patterns

- **Hosted Service**: OpenAI ChatKit is a hosted UI service (domain-allowlisted), not an npm library
- **Embedding**: Embed via iframe or script tag with domain key
- **Bridge Layer**: Use adapter pattern to translate between ChatKit format and backend API format
- **Conversation Persistence**: Store conversation_id in localStorage with key `chatkit-conversation-id`
- **Message Translation**: Convert tool messages to assistant messages for ChatKit display
- **Environment Config**: Domain key and backend URL in .env.local
```

### Section: API Integration

```markdown
#### ChatKit Backend Integration

- **Custom Backend**: ChatKit can be configured to use custom backend API (not just OpenAI's API)
- **Bridge Pattern**: ChatKitBridge class handles message translation and API calls
- **Tool Call Detection**: Check `response.data.tool_calls.length > 0` to trigger todo list refresh
- **Conversation Loading**: Load history on mount via `getConversationDetail` endpoint
- **CORS**: May need to configure backend CORS to allow ChatKit domain
```

### Section: Component Architecture

```markdown
#### ChatKit Components

- **ChatKitEmbed**: Wrapper component that embeds hosted ChatKit UI
- **ChatKitBridge**: Bridge class for message translation and API integration
- **Dashboard Integration**: 3-column grid with TodoForm, TodoList, and ChatKitEmbed
- **State Coordination**: Parent component manages refs and callbacks for synchronization

Location: `phase-3/frontend/src/components/chat/`
```

---

## Script Execution (When Available)

When the PowerShell script becomes available, run:

```powershell
.specify/scripts/powershell/update-agent-context.ps1 -AgentType claude
```

This will automatically detect the agent type and update the appropriate context file with the new technologies and patterns from this feature.

---

## Verification

After updating the agent context, verify that:

1. ✅ ChatKit hosted service pattern is documented
2. ✅ Bridge layer pattern is described
3. ✅ Environment configuration is noted
4. ✅ Message translation pattern is documented
5. ✅ Component architecture is described
6. ✅ No duplicate entries with existing context

---

## Notes

- All patterns introduced in this feature follow existing conventions
- No new external npm dependencies (ChatKit is hosted)
- TypeScript interfaces are co-located with utility functions in `lib/chatkit-config.ts`
- Component structure mirrors existing patterns in `components/` directory
- Bridge layer provides clean separation between hosted UI and backend API
