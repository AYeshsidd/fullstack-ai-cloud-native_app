import logging
from fastapi import Depends
from sqlmodel import Session, select
from typing import Optional
from database.session import get_session
from tool_schemas import AddTaskInput, AddTaskOutput
from models import TodoTask, User
from middleware import validate_user_exists

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def add_task(input_data: AddTaskInput, session: Session = Depends(get_session)) -> AddTaskOutput:
    """
    Implement the add_task tool with database CREATE operation.

    Args:
        input_data: Input containing user_id, title, and optional description
        session: Database session for operations

    Returns:
        AddTaskOutput: Created task object
    """
    logger.info(f"Adding task for user {input_data.user_id} with title '{input_data.title}'")

    try:
        # Validate that the user exists (raises exception if not found)
        validate_user_exists(input_data.user_id, session)

        # Create new task instance
        new_task = TodoTask(
            title=input_data.title,
            description=input_data.description,
            completed=False,  # Default to not completed
            user_id=input_data.user_id
        )

        # Add to session and commit
        session.add(new_task)
        session.commit()
        session.refresh(new_task)  # Refresh to get the generated ID and timestamps

        logger.info(f"Successfully added task {new_task.id} for user {input_data.user_id}")

        # Return the created task in the expected output format
        return AddTaskOutput(
            id=new_task.id,
            user_id=new_task.user_id,
            title=new_task.title,
            description=new_task.description,
            completed=new_task.completed,
            created_at=new_task.created_at,
            updated_at=new_task.updated_at
        )
    except Exception as e:
        logger.error(f"Error adding task for user {input_data.user_id}: {str(e)}")
        raise