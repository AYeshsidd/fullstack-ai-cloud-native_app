---
id: 2
title: mcp-server-todo
stage: plan
date: 2026-02-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: mcp-server-todo
branch: 001-mcp-server-todo
user: Claude
command: '/sp.plan "Phase-3 – Spec-1 (MCP Server)\nBefore planning:\n- Read and understand `frontend/` and `backend/` folders\n- Understand existing APIs, DB models, and flows\n- DO NOT change Phase-1 or Phase-2\n\nContext:\nStarting Phase-3: Todo AI Chatbot  \nSpec-1 = MCP Server foundation\n\nScope:\n- Work ONLY inside `/phase-3`\n- Backend only (FastAPI + SQLModel + Neon DB)\n- Stateless MCP server using Official MCP SDK\n\nPlan Must Cover:\n1. MCP server structure\n2. DB model usage\n3. Tool schemas\n4. Tool → DB flow\n5. Config & env setup\n\nConstraints:\n- No agent logic\n- No chat\n- No auth changes\n- No code generation\n\nDeliverable:\n- Clear step-by-step plan only"'
labels:
- plan
- mcp
- todo-tools
- architecture
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
- D:\Ai_Todo\specs\001-mcp-server-todo\plan.md
- D:\Ai_Todo\specs\001-mcp-server-todo\plan\data-model.md
- D:\Ai_Todo\specs\001-mcp-server-todo\plan\quickstart.md
- D:\Ai_Todo\specs\001-mcp-server-todo\plan\contracts\tool-contracts.md
tests: []
---

# Prompt

```
/sp.plan "Phase-3 – Spec-1 (MCP Server)
Before planning:
- Read and understand `frontend/` and `backend/` folders
- Understand existing APIs, DB models, and flows
- DO NOT change Phase-1 or Phase-2

Context:
Starting Phase-3: Todo AI Chatbot
Spec-1 = MCP Server foundation

Scope:
- Work ONLY inside `/phase-3`
- Backend only (FastAPI + SQLModel + Neon DB)
- Stateless MCP server using Official MCP SDK

Plan Must Cover:
1. MCP server structure
2. DB model usage
3. Tool schemas
4. Tool → DB flow
5. Config & env setup

Constraints:
- No agent logic
- No chat
- No auth changes
- No code generation

Deliverable:
- Clear step-by-step plan only"
```

# Response

```
# Implementation Plan: MCP Server & Todo Tools

**Feature**: MCP Server & Todo Tools
**Branch**: 001-mcp-server-todo
**Created**: 2026-02-08
**Status**: Draft

## Technical Context

The MCP server will be built using FastAPI + SQLModel + Neon DB + Official MCP SDK. The existing backend already has a solid foundation with:

- **Database**: SQLModel models for TodoTask and User with proper relationships
- **Existing APIs**: Auth and todo APIs already implemented in `/api/v1/`
- **Configuration**: Settings system with database URL and JWT configuration
- **Authentication**: JWT-based authentication with proper user isolation
- **Schemas**: Pydantic schemas for data validation

The MCP server will be built as a separate application within the `/phase-3` backend folder, reusing existing models and database configuration. It will expose the 5 todo tools as MCP-compatible endpoints.

## Constitution Check

- ✅ **Strict Spec-Driven Development**: Following spec requirements from `specs/001-mcp-server-todo/spec.md`
- ✅ **Phased evolution**: Building upon existing Phase-2 backend architecture
- ✅ **Production-quality mindset**: Reusing proven components and patterns
- ✅ **Explicit behavior only**: Clear tool interfaces with defined inputs/outputs
- ✅ **Deterministic core logic**: Stateless tools operating through database persistence

## Gates Analysis

- ✅ **Technology Alignment**: FastAPI, SQLModel, Neon DB match spec requirements
- ✅ **Architecture Consistency**: Reuses existing patterns from Phase-2 backend
- ✅ **Security Compliance**: Maintains user isolation through existing auth system
- ✅ **Performance Requirements**: Stateless design ensures scalability

---

## Phase 0: Research & Preparation

### R01: MCP SDK Integration Research
- **Decision**: Integrate Official MCP SDK with FastAPI application
- **Rationale**: MCP SDK provides standardized interface for AI tools; FastAPI integrates well with various SDKs
- **Alternatives considered**: Custom REST API vs MCP SDK - MCP SDK provides better AI agent compatibility

### R02: Database Model Reuse Assessment
- **Decision**: Reuse existing TodoTask and User models from `/models/`
- **Rationale**: Existing models are well-tested and meet requirements; reduces duplication
- **Alternatives considered**: New models vs reuse - reuse maintains consistency

### R03: Authentication Strategy for MCP Tools
- **Decision**: Use header-based authentication passing user_id to tools
- **Rationale**: MCP tools typically use headers for authentication context; maintains user isolation
- **Alternatives considered**: Token per tool vs contextual authentication - contextual approach is cleaner

---

## Phase 1: Architecture & Data Design

### P1.1: Data Model Definition (`data-model.md`)

#### Todo Task Entity
- **Fields**: `id` (str, primary key), `title` (str, required), `description` (str, optional), `completed` (bool, default false), `user_id` (str, foreign key), `created_at` (datetime), `updated_at` (datetime)
- **Relationships**: Belongs to User entity
- **Validation**: Title min length 1, max length 200; Description max length 1000
- **State transitions**: `pending` → `completed` via complete_task operation

#### User Entity
- **Fields**: `id` (str, primary key), `email` (str, required, unique), `name` (str), `hashed_password` (str)
- **Relationships**: Has many TodoTask entities

### P1.2: Tool Schemas (`contracts/`)

#### add_task Tool Contract
- **Input Schema**: `{user_id: string, title: string, description?: string}`
- **Output Schema**: `{id: string, user_id: string, title: string, description?: string, completed: boolean, created_at: datetime, updated_at: datetime}`
- **Validation**: Title required and 1-200 chars, user_id must exist
- **Behavior**: Creates new todo task and returns full task object

#### list_tasks Tool Contract
- **Input Schema**: `{user_id: string, status?: "all" | "pending" | "completed"}`
- **Output Schema**: `{tasks: Array<{id: string, user_id: string, title: string, description?: string, completed: boolean, created_at: datetime, updated_at: datetime}>}`
- **Validation**: user_id must exist, status must be valid enum
- **Behavior**: Returns all tasks for user, filtered by status if specified

#### update_task Tool Contract
- **Input Schema**: `{user_id: string, task_id: string, title?: string, description?: string}`
- **Output Schema**: `{id: string, user_id: string, title: string, description?: string, completed: boolean, created_at: datetime, updated_at: datetime}`
- **Validation**: user_id and task_id must exist and match, at least one update field required
- **Behavior**: Updates specified fields and returns updated task

#### complete_task Tool Contract
- **Input Schema**: `{user_id: string, task_id: string}`
- **Output Schema**: `{id: string, user_id: string, title: string, description?: string, completed: boolean, created_at: datetime, updated_at: datetime}`
- **Validation**: user_id and task_id must exist and match
- **Behavior**: Sets completion status to true and returns updated task

#### delete_task Tool Contract
- **Input Schema**: `{user_id: string, task_id: string}`
- **Output Schema**: `{success: boolean, message: string}`
- **Validation**: user_id and task_id must exist and match
- **Behavior**: Deletes task and returns success confirmation

### P1.3: MCP Server Structure

#### Directory Structure
```
/phase-3/backend/mcp/
├── server.py                 # MCP server entry point
├── tools/
│   ├── __init__.py
│   ├── add_task.py           # add_task tool implementation
│   ├── list_tasks.py         # list_tasks tool implementation
│   ├── update_task.py        # update_task tool implementation
│   ├── complete_task.py      # complete_task tool implementation
│   └── delete_task.py        # delete_task tool implementation
├── models/                   # Reuse existing models via symlink/imports
├── database/                 # Reuse existing database modules
├── config.py                 # MCP server configuration
└── requirements-mcp.txt      # MCP SDK dependencies
```

#### Tool-to-Database Flow
1. MCP Tool receives request with user_id and parameters
2. Authentication/authorization validates user access to resources
3. Tool calls database layer using existing SQLModel models
4. Database operation executes (CREATE, READ, UPDATE, DELETE)
5. Response formatted according to tool contract and returned

### P1.4: Configuration & Environment Setup (`quickstart.md`)

#### MCP Server Configuration
- **Port**: 8001 (to avoid conflict with main API on 8000)
- **Environment Variables**: Same database settings as main API
- **Dependencies**: FastAPI, SQLModel, Neon DB connector, Official MCP SDK

#### Installation & Setup Commands
```bash
cd phase-3/backend
pip install python-mcp-sdk  # Official MCP SDK
# Create MCP server files
python -m mcp.server --config mcp/config.py
```

---

## Phase 2: Implementation Steps

### P2.1: MCP Server Foundation
1. Create `/phase-3/backend/mcp/` directory structure
2. Set up basic FastAPI app with MCP SDK integration
3. Configure database connection using existing settings
4. Implement basic authentication middleware

### P2.2: Tool Implementations
1. Implement `add_task` tool with database CREATE operation
2. Implement `list_tasks` tool with database READ operation
3. Implement `update_task` tool with database UPDATE operation
4. Implement `complete_task` tool with database UPDATE operation
5. Implement `delete_task` tool with database DELETE operation

### P2.3: Testing & Validation
1. Unit tests for each tool implementation
2. Integration tests with database operations
3. Validation of user isolation requirements
4. Performance testing for stateless operations

---

## Dependencies & Risks

### External Dependencies
- **Official MCP SDK**: For MCP tool compatibility
- **FastAPI**: Web framework (already in requirements)
- **SQLModel**: ORM (already in requirements)
- **Neon DB connector**: Database connectivity (already in requirements)

### Risks & Mitigations
- **Risk**: MCP SDK compatibility issues with FastAPI
  - **Mitigation**: Thorough testing and potential wrapper layer
- **Risk**: Authentication integration complexity
  - **Mitigation**: Reuse existing JWT authentication patterns
- **Risk**: Database connection conflicts
  - **Mitigation**: Share connection pool safely between main API and MCP server

---

## Success Criteria Validation

- ✅ **All tools perform correct database operations**: Each tool directly maps to DB CRUD operations
- ✅ **Strict input/output contracts**: Defined schemas with Pydantic validation
- ✅ **User isolation via user_id**: Authentication layer validates user-task relationships
- ✅ **No in-memory state**: Stateless design with database persistence only
```