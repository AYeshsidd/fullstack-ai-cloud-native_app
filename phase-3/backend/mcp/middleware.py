from fastapi import HTTPException, status
from typing import Optional
from models import User
from sqlmodel import Session, select
from database.session import get_session


def validate_user_exists(user_id: str, session: Session) -> Optional[User]:
    """
    Validate that the user exists in the database.

    Args:
        user_id: The ID of the user to validate
        session: Database session for querying

    Returns:
        User object if exists

    Raises:
        HTTPException: If user does not exist
    """
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} does not exist"
        )
    return user


def validate_user_owns_task(user_id: str, task_id: str, session: Session):
    """
    Validate that the user owns the specified task.

    Args:
        user_id: The ID of the user
        task_id: The ID of the task to validate ownership for
        session: Database session for querying

    Raises:
        HTTPException: If user does not own the task or task doesn't exist
    """
    from models import TodoTask

    # Query for the task with matching user_id and task_id
    task = session.get(TodoTask, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} does not exist"
        )

    # Check if the task belongs to the user
    if task.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"User with ID {user_id} does not own task with ID {task_id}"
        )