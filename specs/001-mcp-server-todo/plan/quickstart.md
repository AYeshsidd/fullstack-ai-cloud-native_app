# Quickstart Guide: MCP Server & Todo Tools

**Feature**: MCP Server & Todo Tools
**Created**: 2026-02-08

## Overview

This guide explains how to set up and run the MCP (Model Context Protocol) server that exposes todo tools for AI agents. The server provides 5 core operations: add_task, list_tasks, update_task, complete_task, and delete_task.

## Prerequisites

- Python 3.9 or higher
- Access to Neon Serverless PostgreSQL database
- Existing Phase-2 backend installed and configured

## Installation

### 1. Clone and Navigate to Backend
```bash
cd phase-3/backend
```

### 2. Install MCP SDK
```bash
pip install python-mcp-sdk
```

### 3. Verify Dependencies
Ensure the following are available in your Python environment:
- FastAPI
- SQLModel
- Pydantic
- SQLAlchemy
- python-mcp-sdk (newly installed)

## Configuration

### Environment Variables

The MCP server uses the same database configuration as the main API. Ensure the following environment variables are set in your `.env` file:

```env
DATABASE_URL=postgresql://username:password@host:port/database_name
# Or for local development:
# DATABASE_URL=sqlite:///./todo_local.db
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DB_ECHO_ENABLED=false
```

## Running the MCP Server

### 1. Start the MCP Server
```bash
cd phase-3/backend
uvicorn mcp.server:app --reload --port 8001
```

### 2. Verify Server is Running
Visit http://localhost:8001/docs to see the OpenAPI documentation for the MCP server.

## Tool Usage Examples

Once the server is running, the following tools will be available:

### add_task
- **Endpoint**: POST `/tools/add_task`
- **Parameters**: `{user_id: string, title: string, description?: string}`
- **Response**: Complete task object

### list_tasks
- **Endpoint**: POST `/tools/list_tasks`
- **Parameters**: `{user_id: string, status?: "all"|"pending"|"completed"}`
- **Response**: Array of task objects

### update_task
- **Endpoint**: POST `/tools/update_task`
- **Parameters**: `{user_id: string, task_id: string, title?: string, description?: string}`
- **Response**: Updated task object

### complete_task
- **Endpoint**: POST `/tools/complete_task`
- **Parameters**: `{user_id: string, task_id: string}`
- **Response**: Updated task object

### delete_task
- **Endpoint**: POST `/tools/delete_task`
- **Parameters**: `{user_id: string, task_id: string}`
- **Response**: Success confirmation object

## Testing the Tools

You can test the tools using curl commands:

```bash
# Add a task
curl -X POST "http://localhost:8001/tools/add_task" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "user123", "title": "Test Task", "description": "Test Description"}'

# List tasks
curl -X POST "http://localhost:8001/tools/list_tasks" \
  -H "Content-Type: application/json" \
  -d '{"user_id": "user123", "status": "all"}'
```

## Architecture Overview

The MCP server follows these design principles:

1. **Stateless**: No in-memory state between requests; all data persisted to database
2. **Secure**: User isolation enforced - users can only access their own tasks
3. **Standardized**: Tools follow consistent input/output contracts
4. **Reusable**: Leverages existing Phase-2 database models and configurations

The server uses existing SQLModel models and database connections to maintain consistency with the main API.