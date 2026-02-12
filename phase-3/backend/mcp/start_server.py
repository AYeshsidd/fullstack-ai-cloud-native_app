#!/usr/bin/env python
"""
Start script for the MCP server.
"""
import uvicorn
from server import app
from config import settings


if __name__ == "__main__":
    print(f"Starting Todo MCP Server on port {settings.mcp_port}")
    print("Available endpoints:")
    print("  GET  / - Health check")
    print("  GET  /health - Health status")
    print("  POST /tools/add_task - Add a new task")
    print("  POST /tools/list_tasks - List tasks for a user")
    print("  POST /tools/update_task - Update a task")
    print("  POST /tools/complete_task - Mark a task as completed")
    print("  POST /tools/delete_task - Delete a task")
    print("")

    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=settings.mcp_port,
        reload=True,
        log_level="info"
    )