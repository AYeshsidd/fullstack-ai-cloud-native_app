# Todo MCP Server

This is an MCP (Model Context Protocol) server that exposes Todo task operations as tools for AI agents. The server provides 5 core operations that allow AI agents to interact with todo tasks through standardized tools.

## Features

- **add_task**: Create new todo tasks
- **list_tasks**: Retrieve user's todo tasks with optional status filtering
- **update_task**: Modify existing todo tasks
- **complete_task**: Mark tasks as completed
- **delete_task**: Remove tasks from the system

## Architecture

The MCP server is built using:
- **FastAPI**: For the web framework
- **SQLModel**: For database modeling and ORM
- **Pydantic**: For data validation
- **Existing models**: Reuses TodoTask and User models from the main application

## Endpoints

- `GET /` - Health check
- `GET /health` - Health status
- `POST /tools/add_task` - Add a new task
- `POST /tools/list_tasks` - List tasks for a user
- `POST /tools/update_task` - Update a task
- `POST /tools/complete_task` - Mark a task as completed
- `POST /tools/delete_task` - Delete a task

## Security

- User isolation: Each user can only access their own tasks
- Input validation: All inputs are validated using Pydantic schemas
- Error handling: Comprehensive error handling with appropriate HTTP status codes

## Configuration

The server uses the same database configuration as the main application, configured through environment variables in the `.env` file.

## Running the Server

```bash
cd phase-3/backend
python -m mcp.start_server
```

The server will start on port 8001 by default.