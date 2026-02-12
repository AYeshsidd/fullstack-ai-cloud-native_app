import sys
import os
# Add the project root to the Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlmodel import SQLModel, create_engine
from models.user import User
from models.todo import TodoTask
from models.chat import Conversation, Message, ToolCall
from core.config import settings


def init_db():
    """
    Initialize the database by creating all tables.
    """
    # Create the database engine
    engine = create_engine(
        settings.database_url,
        echo=settings.db_echo_enabled,
        pool_pre_ping=True,
        pool_recycle=300,
    )

    # Create all tables
    SQLModel.metadata.create_all(engine)


if __name__ == "__main__":
    init_db()