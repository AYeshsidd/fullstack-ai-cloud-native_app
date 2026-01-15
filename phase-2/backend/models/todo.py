from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import datetime
import uuid

if TYPE_CHECKING:
    from .user import User


class TodoTaskBase(SQLModel):
    """
    Base model for TodoTask with shared attributes.
    """
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)


class TodoTask(TodoTaskBase, table=True):
    """
    TodoTask model representing a user's task with all required properties and associations.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="user.id", nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to User
    user: "User" = Relationship(back_populates="tasks")


class TodoTaskRead(TodoTaskBase):
    """
    Model for reading todo task data.
    """
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime


class TodoTaskCreate(TodoTaskBase):
    """
    Model for creating a new todo task.
    """
    pass


class TodoTaskUpdate(SQLModel):
    """
    Model for updating todo task information.
    """
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None