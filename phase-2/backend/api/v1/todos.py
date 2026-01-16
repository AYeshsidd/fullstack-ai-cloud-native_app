from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from database.session import get_session
from models.todo import TodoTask, TodoTaskCreate, TodoTaskUpdate
from models.user import User
from schemas.todo import TodoTaskRead, TodoTaskCreate as TodoTaskCreateSchema, TodoTaskUpdate as TodoTaskUpdateSchema, TodoTaskComplete
from middleware.auth import JWTBearer, get_user_id_from_token
from core.security import get_current_user_id_from_token
import uuid


router = APIRouter(prefix="/api/v1", tags=["todos"])


@router.get("/users/{user_id}/tasks", response_model=List[TodoTaskRead])
def get_user_tasks(
    user_id: str,
    completed: bool = None,
    session: Session = Depends(get_session),
    token: str = Depends(JWTBearer())
):
    """
    Retrieve a list of all tasks belonging to the specified user.

    Args:
        user_id: The ID of the user whose tasks to retrieve
        completed: Optional filter for completion status
        session: Database session
        token: JWT token for authentication

    Returns:
        List[TodoTaskRead]: List of user's tasks
    """
    # Verify the user ID in the token matches the requested user_id for security
    current_user_id = get_user_id_from_token(token)
    if not current_user_id or current_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot access another user's tasks"
        )

    # Build query
    query = select(TodoTask).where(TodoTask.user_id == user_id)

    if completed is not None:
        query = query.where(TodoTask.completed == completed)

    # Execute query
    tasks = session.exec(query).all()

    return tasks


@router.post("/users/{user_id}/tasks", response_model=TodoTaskRead)
def create_task(
    user_id: str,
    task: TodoTaskCreateSchema,
    session: Session = Depends(get_session),
    token: str = Depends(JWTBearer())
):
    """
    Create a new todo task for the specified user.

    Args:
        user_id: The ID of the user creating the task
        task: Task data
        session: Database session
        token: JWT token for authentication

    Returns:
        TodoTaskRead: Created task
    """
    # Verify the user ID in the token matches the requested user_id for security
    current_user_id = get_user_id_from_token(token)
    if not current_user_id or current_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot create tasks for another user"
        )

    # Create the task
    db_task = TodoTask(
        title=task.title,
        description=task.description,
        completed=task.completed,
        user_id=user_id
    )

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return db_task


@router.get("/users/{user_id}/tasks/{id}", response_model=TodoTaskRead)
def get_task(
    user_id: str,
    id: str,
    session: Session = Depends(get_session),
    token: str = Depends(JWTBearer())
):
    """
    Retrieve a specific task by ID for the specified user.

    Args:
        user_id: The ID of the user
        id: The ID of the task to retrieve
        session: Database session
        token: JWT token for authentication

    Returns:
        TodoTaskRead: The requested task
    """
    # Verify the user ID in the token matches the requested user_id for security
    current_user_id = get_user_id_from_token(token)
    if not current_user_id or current_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot access another user's tasks"
        )

    # Query for the task
    task = session.get(TodoTask, id)

    # Verify the task belongs to the user
    if not task or task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task


@router.put("/users/{user_id}/tasks/{id}", response_model=TodoTaskRead)
def update_task(
    user_id: str,
    id: str,
    task_update: TodoTaskUpdateSchema,
    session: Session = Depends(get_session),
    token: str = Depends(JWTBearer())
):
    """
    Update an existing task for the specified user.

    Args:
        user_id: The ID of the user
        id: The ID of the task to update
        task_update: Updated task data
        session: Database session
        token: JWT token for authentication

    Returns:
        TodoTaskRead: Updated task
    """
    # Verify the user ID in the token matches the requested user_id for security
    current_user_id = get_user_id_from_token(token)
    if not current_user_id or current_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot update another user's tasks"
        )

    # Get the existing task
    db_task = session.get(TodoTask, id)

    # Verify the task exists and belongs to the user
    if not db_task or db_task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Update the task with provided values
    task_data = task_update.dict(exclude_unset=True)
    for field, value in task_data.items():
        setattr(db_task, field, value)

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return db_task


@router.delete("/users/{user_id}/tasks/{id}")
def delete_task(
    user_id: str,
    id: str,
    session: Session = Depends(get_session),
    token: str = Depends(JWTBearer())
):
    """
    Delete a specific task for the specified user.

    Args:
        user_id: The ID of the user
        id: The ID of the task to delete
        session: Database session
        token: JWT token for authentication

    Returns:
        dict: Success message
    """
    # Verify the user ID in the token matches the requested user_id for security
    current_user_id = get_user_id_from_token(token)
    if not current_user_id or current_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot delete another user's tasks"
        )

    # Get the existing task
    db_task = session.get(TodoTask, id)

    # Verify the task exists and belongs to the user
    if not db_task or db_task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Delete the task
    session.delete(db_task)
    session.commit()

    return {"detail": "Task deleted successfully"}


@router.patch("/users/{user_id}/tasks/{id}/complete", response_model=TodoTaskRead)
def update_task_completion(
    user_id: str,
    id: str,
    completion_status: TodoTaskComplete,
    session: Session = Depends(get_session),
    token: str = Depends(JWTBearer())
):
    """
    Update the completion status of a specific task.

    Args:
        user_id: The ID of the user
        id: The ID of the task to update
        completion_status: New completion status
        session: Database session
        token: JWT token for authentication

    Returns:
        TodoTaskRead: Updated task
    """
    # Verify the user ID in the token matches the requested user_id for security
    current_user_id = get_user_id_from_token(token)
    if not current_user_id or current_user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Cannot update another user's tasks"
        )

    # Get the existing task
    db_task = session.get(TodoTask, id)

    # Verify the task exists and belongs to the user
    if not db_task or db_task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Update the completion status
    db_task.completed = completion_status.completed
    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    return db_task