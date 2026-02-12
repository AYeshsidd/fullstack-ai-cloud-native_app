from sqlmodel import SQLModel, Field, Relationship, Column
from sqlalchemy import JSON
from typing import Optional, TYPE_CHECKING
from datetime import datetime
import uuid
from enum import Enum

if TYPE_CHECKING:
    from .user import User
    from .todo import TodoTask


# Define the Role enum for Message
class MessageRole(str, Enum):
    user = "user"
    assistant = "assistant"
    tool = "tool"


class ConversationBase(SQLModel):
    """
    Base model for Conversation with shared attributes.
    """
    user_id: str = Field(foreign_key="user.id", nullable=False)


class Conversation(ConversationBase, table=True):
    """
    Conversation model representing a chat session between a user and AI assistant.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to User
    user: "User" = Relationship(back_populates="conversations")

    # Relationship to Messages
    messages: list["Message"] = Relationship(back_populates="conversation")

    # Relationship to ToolCalls
    tool_calls: list["ToolCall"] = Relationship(back_populates="conversation")


class MessageBase(SQLModel):
    """
    Base model for Message with shared attributes.
    """
    conversation_id: str = Field(foreign_key="conversation.id", nullable=False)
    role: MessageRole
    content: str = Field(min_length=1, max_length=5000)
    tool_calls: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    tool_responses: Optional[dict] = Field(default=None, sa_column=Column(JSON))


class Message(MessageBase, table=True):
    """
    Message model representing an individual message in a conversation.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    # Relationship to Conversation
    conversation: "Conversation" = Relationship(back_populates="messages")

    # Relationship to ToolCalls
    tool_calls_recorded: list["ToolCall"] = Relationship(back_populates="message")


class ToolCallBase(SQLModel):
    """
    Base model for ToolCall with shared attributes.
    """
    conversation_id: str = Field(foreign_key="conversation.id", nullable=False)
    message_id: str = Field(foreign_key="message.id", nullable=False)
    tool_name: str = Field(max_length=100)
    tool_input: dict = Field(sa_column=Column(JSON))
    tool_output: Optional[dict] = Field(default=None, sa_column=Column(JSON))


class ToolCall(ToolCallBase, table=True):
    """
    ToolCall model representing an invocation of an MCP tool.
    """
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    conversation: "Conversation" = Relationship(back_populates="tool_calls")
    message: "Message" = Relationship(back_populates="tool_calls_recorded")


# Update the Conversation model to add the relationship to ToolCalls
Conversation.model_rebuild()