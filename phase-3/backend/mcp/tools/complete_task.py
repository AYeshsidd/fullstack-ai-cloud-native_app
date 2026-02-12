import logging
from fastapi import Depends
from sqlmodel import Session
from database.session import get_session
from tool_schemas import CompleteTaskInput, CompleteTaskOutput
from models import TodoTask
from middleware import validate_user_owns_task

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def complete_task(input_data: CompleteTaskInput, session: Session = Depends(get_session)) -> CompleteTaskOutput:
    """
    Implement the complete_task tool with database UPDATE operation.

    Args:
        input_data: Input containing user_id and task_id
        session: Database session for operations

    Returns:
        CompleteTaskOutput: Updated task object with completed status
    """
    logger.info(f"Completing task {input_data.task_id} for user {input_data.user_id}")

    try:
        # Validate that the user owns the task (raises exception if not)
        validate_user_owns_task(input_data.user_id, input_data.task_id, session)

        # Get the existing task (ownership validation already happened)
        existing_task = session.get(TodoTask, input_data.task_id)
        if not existing_task:
            raise ValueError(f"Task with ID {input_data.task_id} does not exist")

        # Mark the task as completed
        if existing_task.completed:
            logger.warning(f"Task {input_data.task_id} was already completed")
        else:
            existing_task.completed = True
            logger.info(f"Task {input_data.task_id} marked as completed")

        # Update the updated_at timestamp
        from datetime import datetime
        existing_task.updated_at = datetime.utcnow()

        # Commit the changes
        session.add(existing_task)
        session.commit()
        session.refresh(existing_task)  # Refresh to get the updated values

        logger.info(f"Successfully completed task {input_data.task_id} for user {input_data.user_id}")

        # Return the updated task in the expected output format
        return CompleteTaskOutput(
            id=existing_task.id,
            user_id=existing_task.user_id,
            title=existing_task.title,
            description=existing_task.description,
            completed=existing_task.completed,
            created_at=existing_task.created_at,
            updated_at=existing_task.updated_at
        )
    except Exception as e:
        logger.error(f"Error completing task {input_data.task_id} for user {input_data.user_id}: {str(e)}")
        raise