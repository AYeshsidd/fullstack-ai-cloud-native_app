import logging
from fastapi import Depends
from sqlmodel import Session, select
from typing import List
from database.session import get_session
from tool_schemas import ListTasksInput, ListTasksOutput, TaskItem
from models import TodoTask
from middleware import validate_user_exists

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def list_tasks(input_data: ListTasksInput, session: Session = Depends(get_session)) -> ListTasksOutput:
    """
    Implement the list_tasks tool with database READ operation.

    Args:
        input_data: Input containing user_id and optional status filter
        session: Database session for operations

    Returns:
        ListTasksOutput: List of task objects
    """
    logger.info(f"Listing tasks for user {input_data.user_id}, status filter: {input_data.status}")

    try:
        # Validate that the user exists (raises exception if not found)
        validate_user_exists(input_data.user_id, session)

        # Build the query to get tasks for the user
        query = select(TodoTask).where(TodoTask.user_id == input_data.user_id)

        # Apply status filter if provided
        if input_data.status and input_data.status.lower() != "all":
            if input_data.status.lower() == "pending":
                query = query.where(TodoTask.completed == False)
            elif input_data.status.lower() == "completed":
                query = query.where(TodoTask.completed == True)

        # Execute the query
        tasks = session.exec(query).all()

        # Convert to TaskItem format
        task_items = [
            TaskItem(
                id=task.id,
                user_id=task.user_id,
                title=task.title,
                description=task.description,
                completed=task.completed,
                created_at=task.created_at,
                updated_at=task.updated_at
            )
            for task in tasks
        ]

        logger.info(f"Retrieved {len(task_items)} tasks for user {input_data.user_id}")

        # Return the list in the expected output format
        return ListTasksOutput(tasks=task_items)
    except Exception as e:
        logger.error(f"Error listing tasks for user {input_data.user_id}: {str(e)}")
        raise