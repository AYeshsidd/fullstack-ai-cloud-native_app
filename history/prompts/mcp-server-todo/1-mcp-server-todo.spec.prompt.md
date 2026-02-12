---
id: 1
title: mcp-server-todo
stage: spec
date: 2026-02-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: mcp-server-todo
branch: 001-mcp-server-todo
user: Claude
command: /sp.specify "# Phase-3 – Spec-1: MCP Server & Todo Tools\n\n**Objective:**  \nImplement a stateless MCP server exposing Todo task operations as tools for AI agents.\n\n**Scope:**  \n- Work ONLY inside `/phase-3` folder  \n- Phase-1 and Phase-2 are complete and MUST NOT be modified  \n- Build MCP server using **FastAPI + SQLModel + Neon DB + Official MCP SDK**  \n- Tools must be stateless; all state persisted in the database\n\n**MCP Tools to implement:**  \n1. `add_task(user_id, title, description?)`  \n2. `list_tasks(user_id, status?)`  \n3. `update_task(user_id, task_id, title?, description?)`  \n4. `complete_task(user_id, task_id)`  \n5. `delete_task(user_id, task_id)`\n\n**Success Criteria:**  \n- All tools perform correct database operations  \n- Strict input/output contracts  \n- User isolation via `user_id`  \n- No in-memory state\n\n**Constraints:**  \n- No AI agent logic yet  \n- No frontend work  \n- No auth changes  \n- Do NOT touch Phase-1 or Phase-2  \n\n**Deliverables:**  \n- MCP server code inside `/phase-3`  \n- Tool schemas and implementations  \n- Task DB models"
labels: ["spec", "mcp", "todo-tools", "ai-agents"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - D:\Ai_Todo\specs\001-mcp-server-todo\spec.md
 - D:\Ai_Todo\specs\001-mcp-server-todo\checklists\requirements.md
tests: []
---

# Prompt

```
/sp.specify "# Phase-3 – Spec-1: MCP Server & Todo Tools

**Objective:**
Implement a stateless MCP server exposing Todo task operations as tools for AI agents.

**Scope:**
- Work ONLY inside `/phase-3` folder
- Phase-1 and Phase-2 are complete and MUST NOT be modified
- Build MCP server using **FastAPI + SQLModel + Neon DB + Official MCP SDK**
- Tools must be stateless; all state persisted in the database

**MCP Tools to implement:**
1. `add_task(user_id, title, description?)`
2. `list_tasks(user_id, status?)`
3. `update_task(user_id, task_id, title?, description?)`
4. `complete_task(user_id, task_id)`
5. `delete_task(user_id, task_id)`

**Success Criteria:**
- All tools perform correct database operations
- Strict input/output contracts
- User isolation via `user_id`
- No in-memory state

**Constraints:**
- No AI agent logic yet
- No frontend work
- No auth changes
- Do NOT touch Phase-1 or Phase-2

**Deliverables:**
- MCP server code inside `/phase-3`
- Tool schemas and implementations
- Task DB models"
```

# Response

```
# Feature Specification: MCP Server & Todo Tools

**Feature Branch**: `001-mcp-server-todo`
**Created**: 2026-02-08
**Status**: Draft
**Input**: User description: "# Phase-3 – Spec-1: MCP Server & Todo Tools

**Objective:**
Implement a stateless MCP server exposing Todo task operations as tools for AI agents.

**Scope:**
- Work ONLY inside `/phase-3` folder
- Phase-1 and Phase-2 are complete and MUST NOT be modified
- Build MCP server using **FastAPI + SQLModel + Neon DB + Official MCP SDK**
- Tools must be stateless; all state persisted in the database

**MCP Tools to implement:**
1. `add_task(user_id, title, description?)`
2. `list_tasks(user_id, status?)`
3. `update_task(user_id, task_id, title?, description?)`
4. `complete_task(user_id, task_id)`
5. `delete_task(user_id, task_id)`

**Success Criteria:**
- All tools perform correct database operations
- Strict input/output contracts
- User isolation via `user_id`
- No in-memory state

**Constraints:**
- No AI agent logic yet
- No frontend work
- No auth changes
- Do NOT touch Phase-1 or Phase-2

**Deliverables:**
- MCP server code inside `/phase-3`
- Tool schemas and implementations
- Task DB models"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - AI Agent Accesses Todo Operations (Priority: P1)

AI agents need to interact with todo tasks through standardized tools exposed by an MCP server. The system should allow AI agents to perform all core todo operations (add, list, update, complete, delete) using a well-defined API.

**Why this priority**: This is the foundational functionality that enables AI agents to work with todo tasks, which is the core objective of this feature.

**Independent Test**: AI agents can successfully call the MCP server tools to perform all 5 todo operations and see the changes persisted in the database.

**Acceptance Scenarios**:

1. **Given** an authenticated AI agent with a valid user_id, **When** the agent calls `add_task` with a title and user_id, **Then** a new task is created in the database and returned with a unique task_id
2. **Given** a user with existing tasks, **When** an AI agent calls `list_tasks` with the user_id, **Then** all tasks for that user are returned in a structured format
3. **Given** a user with existing tasks, **When** an AI agent calls `update_task` with valid user_id, task_id, and updated properties, **Then** the task is updated in the database and the updated task is returned
4. **Given** a user with existing tasks, **When** an AI agent calls `complete_task` with valid user_id and task_id, **Then** the task's completion status is updated to true in the database
5. **Given** a user with existing tasks, **When** an AI agent calls `delete_task` with valid user_id and task_id, **Then** the task is removed from the database

---

### User Story 2 - User Isolation and Security (Priority: P2)

The system must ensure that AI agents can only access and modify tasks belonging to the user specified in the request, preventing cross-user data access.

**Why this priority**: Essential for data privacy and security - users must be isolated from each other's data.

**Independent Test**: When an AI agent attempts to access tasks with a different user_id than the authenticated user, the request is rejected with appropriate error response.

**Acceptance Scenarios**:

1. **Given** a user with tasks and another user's user_id, **When** an AI agent calls any todo operation with mismatched user_id, **Then** the operation fails with access denied error
2. **Given** an AI agent with valid authentication, **When** the agent performs operations with matching user_id, **Then** operations succeed and only the user's own data is accessed

---

### User Story 3 - State Persistence (Priority: P3)

All todo operations must persist changes to the database rather than maintaining in-memory state, ensuring data durability and consistency across system restarts.

**Why this priority**: Critical for reliability - data must survive system restarts and be consistently available.

**Independent Test**: After performing todo operations and restarting the system, the same data remains accessible and unchanged.

**Acceptance Scenarios**:

1. **Given** a user with created tasks, **When** the system is restarted, **Then** all previously created tasks remain accessible
2. **Given** an AI agent performing operations, **When** operations complete successfully, **Then** data is persisted in the database and available to other clients

---

### Edge Cases

- What happens when a user_id doesn't exist in the database?
- How does the system handle invalid task_id values?
- What occurs when required parameters are missing from tool calls?
- How does the system handle database connection failures?
- What happens when an AI agent tries to complete a task that's already completed?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST expose a stateless MCP server that implements FastAPI for handling todo operations
- **FR-002**: System MUST persist all todo data using SQLModel with Neon DB backend
- **FR-003**: System MUST implement `add_task(user_id, title, description?)` tool that creates new todo tasks in the database
- **FR-004**: System MUST implement `list_tasks(user_id, status?)` tool that retrieves user's todo tasks from the database
- **FR-005**: System MUST implement `update_task(user_id, task_id, title?, description?)` tool that modifies existing todo tasks
- **FR-006**: System MUST implement `complete_task(user_id, task_id)` tool that marks tasks as completed
- **FR-007**: System MUST implement `delete_task(user_id, task_id)` tool that removes tasks from the database
- **FR-008**: System MUST enforce user isolation by validating that operations only affect tasks belonging to the specified user_id
- **FR-009**: System MUST use Official MCP SDK for tool exposure and communication
- **FR-010**: System MUST ensure no in-memory state is maintained between requests - all data must be persisted to database and retrieved from database for each operation
- **FR-011**: System MUST provide strict input/output contracts for all tools with defined schemas

### Key Entities *(include if feature involves data)*

- **Todo Task**: Represents a user's todo item with properties like id, title, description, completion status, and associated user_id
- **User**: Represents a system user with unique user_id that owns todo tasks
- **MCP Tool**: Represents an API endpoint that exposes a specific todo operation to AI agents

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 5 MCP tools (add_task, list_tasks, update_task, complete_task, delete_task) perform correct database operations with 100% success rate
- **SC-002**: User isolation is maintained with 100% accuracy - no user can access another user's tasks
- **SC-003**: All operations are stateless - system can restart without data loss and all persisted data remains accessible
- **SC-004**: Input/output contracts are strictly validated with appropriate error responses for invalid requests (>95% successful validation)
```