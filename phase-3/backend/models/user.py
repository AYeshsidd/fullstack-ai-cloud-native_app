from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import datetime
import uuid

if TYPE_CHECKING:
    from .todo import TodoTask
    from .chat import Conversation


class UserBase(SQLModel):
    """
    Base model for User with shared attributes.
    """
    email: str = Field(unique=True, nullable=False, max_length=255)
    name: str = Field(max_length=100)


class User(UserBase, table=True):
    """
    User model representing an authenticated user with unique identifier and account information.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    hashed_password: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to TodoTask
    tasks: list["TodoTask"] = Relationship(back_populates="user")

    # Relationship to Conversation
    conversations: list["Conversation"] = Relationship(back_populates="user")


class UserRead(UserBase):
    """
    Model for reading user data without sensitive information.
    """
    id: str
    created_at: datetime
    updated_at: datetime


class UserCreate(UserBase):
    """
    Model for creating a new user.
    """
    password: str


class UserUpdate(SQLModel):
    """
    Model for updating user information.
    """
    email: Optional[str] = None
    name: Optional[str] = None