# Implementation Plan: AI Chat Endpoint

**Feature**: AI Chat Endpoint
**Branch**: 002-ai-chat-mcp
**Created**: 2026-02-08
**Status**: Draft

## Technical Context

The AI chat endpoint will be built using FastAPI with OpenAI Agents SDK integration. It needs to work alongside the existing MCP server created in Spec-1. The architecture will include:

- **New API endpoint**: `POST /api/{user_id}/chat` in the existing API structure
- **Conversation management**: Database models to store conversation history and messages
- **OpenAI Agent Integration**: Using the OpenAI Agents SDK to process natural language and orchestrate MCP tool calls
- **MCP Tool Integration**: Calling the MCP tools from Spec-1 based on AI interpretation of natural language
- **Database Integration**: Using existing SQLModel and database connection patterns from Phase-2
- **User Isolation**: Ensuring conversations are properly isolated by user_id

The existing backend already has a solid foundation with:
- Database: SQLModel models for User and TodoTask with proper relationships
- API Structure: FastAPI routes in `/api/v1/`
- Configuration: Settings system with database URL and JWT configuration
- Authentication: JWT-based authentication with user isolation
- Schemas: Pydantic schemas for data validation

## Constitution Check

- ✅ **Strict Spec-Driven Development**: Following spec requirements from `specs/002-ai-chat-mcp/spec.md`
- ✅ **Phased evolution**: Building upon existing Phase-2 and Spec-1 MCP foundation
- ✅ **Production-quality mindset**: Reusing proven components and patterns
- ✅ **Explicit behavior only**: Clear API contracts and tool interactions
- ✅ **Deterministic core logic**: AI operates via defined tools, not free-form mutations

## Gates Analysis

- ✅ **Technology Alignment**: FastAPI, OpenAI Agents SDK match spec requirements
- ✅ **Architecture Consistency**: Reuses existing patterns from Phase-2 backend and MCP server
- ✅ **Security Compliance**: Maintains user isolation through existing auth system
- ✅ **Performance Requirements**: Stateless design ensures scalability

---

## Phase 0: Research & Preparation

### R01: OpenAI Agents SDK Integration Research
- **Decision**: Integrate OpenAI Agents SDK with FastAPI application for natural language processing
- **Rationale**: OpenAI Agents SDK provides advanced reasoning and tool calling capabilities needed for todo task management
- **Alternatives considered**: Custom prompt engineering vs Agents SDK - Agents SDK offers better tool orchestration

### R02: MCP Tool Consumption Strategy
- **Decision**: Call MCP tools via HTTP requests from the AI agent
- **Rationale**: MCP tools are already implemented and tested; calling them via standard HTTP interface ensures loose coupling
- **Alternatives considered**: Direct function calls vs HTTP calls - HTTP calls maintain statelessness

### R03: Conversation State Management
- **Decision**: Store conversation history in database with proper user isolation
- **Rationale**: Maintains statelessness requirement while providing context persistence
- **Alternatives considered**: In-memory vs database storage - database ensures restart safety

---

## Phase 1: Architecture & Data Design

### P1.1: Data Model Definition (`data-model.md`)

#### Conversation Entity
- **Fields**: `id` (str, primary key), `user_id` (str, foreign key to User), `created_at` (datetime), `updated_at` (datetime)
- **Relationships**: Belongs to User, Has many Messages
- **Validation**: user_id must reference an existing user

#### Message Entity
- **Fields**: `id` (str, primary key), `conversation_id` (str, foreign key), `role` (str: "user"|"assistant"|"tool"), `content` (str), `timestamp` (datetime), `tool_calls` (JSON, optional), `tool_responses` (JSON, optional)
- **Relationships**: Belongs to Conversation
- **Validation**: role must be valid enum, content required

#### ToolCall Entity
- **Fields**: `id` (str, primary key), `conversation_id` (str, foreign key), `message_id` (str, foreign key), `tool_name` (str), `tool_input` (JSON), `tool_output` (JSON, optional), `timestamp` (datetime)
- **Relationships**: Belongs to Conversation and Message
- **Validation**: tool_name must be valid MCP tool

### P1.2: API Contracts (`contracts/`)

#### Chat Endpoint Contract
- **Endpoint**: `POST /api/{user_id}/chat`
- **Input Schema**: `{message: string, conversation_id?: string}`
- **Output Schema**: `{response: string, conversation_id: string, tool_calls: Array<{name: string, input: object, output: object}>, messages: Array<{role: string, content: string}>}`
- **Validation**: user_id must exist, message required and non-empty
- **Behavior**: Processes natural language, calls MCP tools as needed, returns response and tool call details

### P1.3: System Architecture

#### Directory Structure
```
/phase-3/backend/
├── api/
│   └── v1/
│       ├── __init__.py
│       ├── auth.py
│       ├── todos.py
│       └── chat.py                 # New chat endpoint
├── models/
│   ├── __init__.py
│   ├── user.py
│   ├── todo.py
│   └── chat.py                   # New chat models (Conversation, Message, ToolCall)
├── schemas/
│   ├── __init__.py
│   ├── user.py
│   ├── todo.py
│   └── chat.py                   # New chat schemas
├── services/
│   └── ai_agent.py              # AI agent service implementation
├── core/
│   └── config.py
├── middleware/
│   └── auth.py
└── requirements.txt              # Updated with OpenAI SDK
```

#### AI-Agent-to-MCP Flow
1. Chat endpoint receives user message and user_id
2. Fetch conversation history from database
3. Initialize OpenAI Agent with MCP tools as functions
4. Run agent with user message and conversation context
5. Agent makes MCP tool calls as needed
6. Collect tool responses and generate AI response
7. Store user message, AI response, and tool calls in database
8. Return AI response and tool call details to user

### P1.4: Configuration & Environment Setup (`quickstart.md`)

#### Chat Service Configuration
- **Dependencies**: FastAPI, OpenAI SDK, existing SQLModel setup
- **Environment Variables**: OPENAI_API_KEY, MODEL_NAME (default: gpt-4)
- **Integration**: Works with existing database and authentication systems

#### Setup Commands
```bash
cd phase-3/backend
pip install openai
# Update requirements.txt with new dependencies
```

---

## Phase 2: Implementation Steps

### P2.1: Data Models & Schemas
1. Create Conversation, Message, and ToolCall models in `/models/chat.py`
2. Create corresponding Pydantic schemas in `/schemas/chat.py`
3. Update main models and schemas `__init__.py` files

### P2.2: AI Agent Service
1. Implement AI agent service in `/services/ai_agent.py`
2. Configure OpenAI client with MCP tools
3. Implement conversation history retrieval and storage

### P2.3: Chat API Endpoint
1. Create chat endpoint in `/api/v1/chat.py`
2. Implement authentication and user validation
3. Integrate with AI agent service and database models

### P2.4: Integration & Testing
1. Connect all components and test the complete flow
2. Validate conversation persistence and statelessness
3. Test various natural language scenarios and tool mappings

---

## Dependencies & Risks

### External Dependencies
- **OpenAI SDK**: For AI agent functionality
- **FastAPI**: Web framework (already in requirements)
- **SQLModel**: ORM (already in requirements)
- **Existing MCP tools**: From Spec-1 implementation

### Risks & Mitigations
- **Risk**: OpenAI API costs and rate limiting
  - **Mitigation**: Implement proper error handling and rate limiting awareness
- **Risk**: Complex AI agent configuration
  - **Mitigation**: Start with simple tool calling and iterate
- **Risk**: MCP tool availability issues
  - **Mitigation**: Implement fallbacks and graceful error handling

---

## Success Criteria Validation

- ✅ **Natural language maps correctly to MCP tool calls**: AI agent interprets natural language and calls appropriate MCP tools
- ✅ **Conversation context persists in database**: All conversation data stored and retrievable
- ✅ **Tool calls included in API response**: API returns both AI response and tool call details
- ✅ **Server operates statelessly**: All state stored in database, no in-memory persistence between requests