import logging
from fastapi import Depends
from sqlmodel import Session
from database.session import get_session
from tool_schemas import DeleteTaskInput, DeleteTaskOutput
from models import TodoTask
from middleware import validate_user_owns_task

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def delete_task(input_data: DeleteTaskInput, session: Session = Depends(get_session)) -> DeleteTaskOutput:
    """
    Implement the delete_task tool with database DELETE operation.

    Args:
        input_data: Input containing user_id and task_id
        session: Database session for operations

    Returns:
        DeleteTaskOutput: Success confirmation message
    """
    logger.info(f"Deleting task {input_data.task_id} for user {input_data.user_id}")

    try:
        # Validate that the user owns the task (raises exception if not)
        validate_user_owns_task(input_data.user_id, input_data.task_id, session)

        # Get the existing task (ownership validation already happened)
        existing_task = session.get(TodoTask, input_data.task_id)
        if not existing_task:
            raise ValueError(f"Task with ID {input_data.task_id} does not exist")

        # Delete the task from the database
        session.delete(existing_task)
        session.commit()

        logger.info(f"Successfully deleted task {input_data.task_id} for user {input_data.user_id}")

        # Return success confirmation
        return DeleteTaskOutput(
            success=True,
            message=f"Task with ID {input_data.task_id} deleted successfully"
        )
    except Exception as e:
        logger.error(f"Error deleting task {input_data.task_id} for user {input_data.user_id}: {str(e)}")
        raise