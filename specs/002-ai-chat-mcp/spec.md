# Feature Specification: AI Chat Endpoint

**Feature Branch**: `002-ai-chat-mcp`
**Created**: 2026-02-08
**Status**: Draft
**Input**: User description: "# Phase III – Spec 2: AI Chat Endpoint

## Objective
Implement a stateless AI chat API that interprets natural language and calls MCP tools from Spec-1.

## Scope
- Work **ONLY inside `/phase-3` folder**
- Phase-1 & Phase-2 are **frozen**, do **not modify**
- Backend: FastAPI + OpenAI Agents SDK
- Use MCP tools from Spec-1 exactly as defined

## Responsibilities
- Create endpoint: `POST /api/{user_id}/chat`
- Fetch conversation history from DB
- Run OpenAI Agent with MCP tools
- Store user messages, assistant responses, and tool calls in DB
- Keep endpoint **stateless**

## Out of Scope
- No frontend changes
- No MCP tool modifications
- No auth or in-memory state changes

## Success Criteria
- Natural language maps correctly to MCP tool calls
- Conversation context persists in DB
- Tool calls included in API response
- Server fully stateless and restart-safe

## Deliverables
- `/phase-3/backend` API code
- Agent configuration + prompts
- Conversation & Message DB models
- Updated API schemas"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Natural Language Todo Interaction (Priority: P1)

Users can interact with their todo list using natural language commands through a chat interface. The AI agent interprets the user's natural language and maps it to the appropriate MCP tools to manage tasks.

**Why this priority**: This is the core functionality that enables users to interact with their todo lists using natural language, which is the primary objective of this feature.

**Independent Test**: User can type natural language like "Add a task to buy groceries" and the AI correctly calls the add_task MCP tool with appropriate parameters.

**Acceptance Scenarios**:

1. **Given** a user with valid user_id, **When** the user sends a natural language message requesting to add a task, **Then** the AI agent calls the add_task MCP tool with correct parameters and returns success
2. **Given** a user with existing tasks, **When** the user asks to see their tasks using natural language, **Then** the AI agent calls the list_tasks MCP tool and returns the tasks in a readable format
3. **Given** a user with existing tasks, **When** the user requests to update a task using natural language, **Then** the AI agent calls the update_task MCP tool with appropriate parameters
4. **Given** a user with existing tasks, **When** the user requests to complete a task using natural language, **Then** the AI agent calls the complete_task MCP tool with appropriate parameters
5. **Given** a user with existing tasks, **When** the user requests to delete a task using natural language, **Then** the AI agent calls the delete_task MCP tool with appropriate parameters

---

### User Story 2 - Conversation Context Persistence (Priority: P2)

The system must maintain conversation context across chat interactions by storing and retrieving conversation history from the database, allowing for more coherent and context-aware AI responses.

**Why this priority**: Critical for creating a natural and coherent conversation experience where the AI remembers previous exchanges.

**Independent Test**: After multiple back-and-forth messages in a conversation, the AI remembers context from earlier in the conversation.

**Acceptance Scenarios**:

1. **Given** an ongoing conversation, **When** the AI processes a new message, **Then** it has access to previous messages in the conversation
2. **Given** a conversation with multiple exchanges, **When** the system restarts and a new message arrives, **Then** the conversation history is preserved in the database
3. **Given** a conversation with task-related context, **When** the user refers back to previous tasks by name or description, **Then** the AI understands the reference based on conversation history

---

### User Story 3 - Stateless Operation (Priority: P3)

The chat endpoint must operate in a completely stateless manner, with all conversation data persisted in the database rather than held in memory, ensuring system reliability and scalability.

**Why this priority**: Essential for system reliability and horizontal scaling - the server must be able to restart without losing conversation state.

**Independent Test**: The system can restart between messages and maintain conversation continuity through database persistence.

**Acceptance Scenarios**:

1. **Given** a conversation in progress, **When** the server restarts and a new message arrives, **Then** the conversation continues seamlessly using database-stored history
2. **Given** multiple server instances, **When** requests arrive at different instances, **Then** the conversation remains consistent as all state is stored in the shared database
3. **Given** any point in the conversation, **When** the system crashes, **Then** no conversation data is lost as everything is persisted to the database

---

### Edge Cases

- What happens when the MCP tools are temporarily unavailable?
- How does the system handle malformed natural language that doesn't map to any tools?
- What occurs when conversation history becomes very large?
- How does the system handle network timeouts during MCP tool calls?
- What happens when the AI generates harmful or inappropriate responses?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expose a `POST /api/{user_id}/chat` endpoint that accepts natural language messages
- **FR-002**: System MUST integrate with OpenAI Agents SDK to interpret natural language and orchestrate MCP tool calls
- **FR-003**: System MUST fetch conversation history from database before processing each new message
- **FR-004**: System MUST store each user message in the database as part of the conversation history
- **FR-005**: System MUST store each AI assistant response in the database as part of the conversation history
- **FR-006**: System MUST store details of all MCP tool calls made by the AI in the database
- **FR-007**: System MUST execute appropriate MCP tools based on natural language interpretation
- **FR-008**: System MUST return both the AI response and details of any tool calls made in the API response
- **FR-009**: System MUST ensure all data is persisted to database and no state is maintained in memory between requests
- **FR-010**: System MUST use the exact MCP tools from Spec-1 without modification
- **FR-011**: System MUST validate that all operations are performed on behalf of the correct user_id
- **FR-012**: System MUST handle errors gracefully when MCP tools fail or are unavailable

### Key Entities *(include if feature involves data)*

- **Conversation**: Represents a chat session between a user and the AI assistant with unique ID and associated user_id
- **Message**: Represents an individual message in a conversation (user message or AI response) with content, timestamp, role (user/assistant), and associated conversation_id
- **ToolCall**: Represents an invocation of an MCP tool with parameters, result, and association to a conversation/message
- **User**: Represents the system user with unique user_id that owns conversations

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Natural language requests correctly map to MCP tool calls in >90% of cases for common todo operations (add, list, update, complete, delete)
- **SC-002**: Conversation context persists reliably in the database with 100% data integrity across server restarts
- **SC-003**: API responses include both AI assistant response and detailed information about any MCP tool calls made
- **SC-004**: Server operates completely statelessly with 100% functionality maintained after restarts with no in-memory state loss