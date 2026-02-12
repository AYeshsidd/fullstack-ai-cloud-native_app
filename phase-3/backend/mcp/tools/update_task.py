import logging
from fastapi import Depends
from sqlmodel import Session
from database.session import get_session
from tool_schemas import UpdateTaskInput, UpdateTaskOutput
from models import TodoTask
from middleware import validate_user_owns_task

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def update_task(input_data: UpdateTaskInput, session: Session = Depends(get_session)) -> UpdateTaskOutput:
    """
    Implement the update_task tool with database UPDATE operation.

    Args:
        input_data: Input containing user_id, task_id, and optional fields to update
        session: Database session for operations

    Returns:
        UpdateTaskOutput: Updated task object
    """
    logger.info(f"Updating task {input_data.task_id} for user {input_data.user_id}")

    try:
        # Validate that the user owns the task (raises exception if not)
        validate_user_owns_task(input_data.user_id, input_data.task_id, session)

        # Get the existing task (ownership validation already happened)
        existing_task = session.get(TodoTask, input_data.task_id)
        if not existing_task:
            raise ValueError(f"Task with ID {input_data.task_id} does not exist")

        # Update the task with provided values
        update_fields = []
        if input_data.title is not None:
            existing_task.title = input_data.title
            update_fields.append("title")
        if input_data.description is not None:
            existing_task.description = input_data.description
            update_fields.append("description")

        # Update the updated_at timestamp
        from datetime import datetime
        existing_task.updated_at = datetime.utcnow()

        # Commit the changes
        session.add(existing_task)
        session.commit()
        session.refresh(existing_task)  # Refresh to get the updated values

        logger.info(f"Successfully updated task {input_data.task_id} for user {input_data.user_id}. Updated fields: {update_fields}")

        # Return the updated task in the expected output format
        return UpdateTaskOutput(
            id=existing_task.id,
            user_id=existing_task.user_id,
            title=existing_task.title,
            description=existing_task.description,
            completed=existing_task.completed,
            created_at=existing_task.created_at,
            updated_at=existing_task.updated_at
        )
    except Exception as e:
        logger.error(f"Error updating task {input_data.task_id} for user {input_data.user_id}: {str(e)}")
        raise