from fastapi import FastAPI, Depends, HTTPException, status
from sqlmodel import Session
from config import settings
from database.session import get_session
from tool_schemas import (AddTaskInput, AddTaskOutput, ListTasksInput, ListTasksOutput,
                          UpdateTaskInput, UpdateTaskOutput, CompleteTaskInput, CompleteTaskOutput,
                          DeleteTaskInput, DeleteTaskOutput)
from tools.add_task import add_task as add_task_impl
from tools.list_tasks import list_tasks as list_tasks_impl
from tools.update_task import update_task as update_task_impl
from tools.complete_task import complete_task as complete_task_impl
from tools.delete_task import delete_task as delete_task_impl


# Create FastAPI app instance for MCP server
app = FastAPI(
    title="Todo MCP Server",
    description="MCP server exposing Todo task operations as tools for AI agents",
    version="1.0.0"
)


@app.get("/")
def read_root():
    """
    Root endpoint for health check.

    Returns:
        dict: Welcome message and API status
    """
    return {
        "message": "Welcome to the Todo MCP Server",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    """
    Health check endpoint.

    Returns:
        dict: Health status of the API
    """
    return {
        "status": "healthy",
        "service": "Todo MCP Server",
        "timestamp": __import__('datetime').datetime.now().isoformat()
    }


# Tool endpoints
@app.post("/tools/add_task", response_model=AddTaskOutput)
def api_add_task(input_data: AddTaskInput, session: Session = Depends(get_session)):
    """
    Endpoint for the add_task tool.

    Args:
        input_data: Input containing user_id, title, and optional description
        session: Database session for operations

    Returns:
        AddTaskOutput: Created task object
    """
    try:
        return add_task_impl(input_data, session)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@app.post("/tools/list_tasks", response_model=ListTasksOutput)
def api_list_tasks(input_data: ListTasksInput, session: Session = Depends(get_session)):
    """
    Endpoint for the list_tasks tool.

    Args:
        input_data: Input containing user_id and optional status filter
        session: Database session for operations

    Returns:
        ListTasksOutput: List of task objects
    """
    try:
        return list_tasks_impl(input_data, session)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@app.post("/tools/update_task", response_model=UpdateTaskOutput)
def api_update_task(input_data: UpdateTaskInput, session: Session = Depends(get_session)):
    """
    Endpoint for the update_task tool.

    Args:
        input_data: Input containing user_id, task_id, and optional fields to update
        session: Database session for operations

    Returns:
        UpdateTaskOutput: Updated task object
    """
    try:
        return update_task_impl(input_data, session)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@app.post("/tools/complete_task", response_model=CompleteTaskOutput)
def api_complete_task(input_data: CompleteTaskInput, session: Session = Depends(get_session)):
    """
    Endpoint for the complete_task tool.

    Args:
        input_data: Input containing user_id and task_id
        session: Database session for operations

    Returns:
        CompleteTaskOutput: Updated task object with completed status
    """
    try:
        return complete_task_impl(input_data, session)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@app.post("/tools/delete_task", response_model=DeleteTaskOutput)
def api_delete_task(input_data: DeleteTaskInput, session: Session = Depends(get_session)):
    """
    Endpoint for the delete_task tool.

    Args:
        input_data: Input containing user_id and task_id
        session: Database session for operations

    Returns:
        DeleteTaskOutput: Success confirmation message
    """
    try:
        return delete_task_impl(input_data, session)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))