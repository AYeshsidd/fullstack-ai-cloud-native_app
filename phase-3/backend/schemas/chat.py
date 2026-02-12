from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum


class MessageRole(str, Enum):
    user = "user"
    assistant = "assistant"
    tool = "tool"


class ToolCallSchema(BaseModel):
    """
    Schema for representing an MCP tool call.
    """
    name: str
    input: dict
    output: Optional[dict] = None
    status: str  # "success" or "error"


class MessageSchema(BaseModel):
    """
    Schema for representing a message in a conversation.
    """
    role: MessageRole
    content: str
    timestamp: datetime


class ChatRequest(BaseModel):
    """
    Schema for the chat endpoint request.
    """
    message: str
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    """
    Schema for the chat endpoint response.
    """
    response: str
    conversation_id: str
    tool_calls: List[ToolCallSchema]
    messages: List[MessageSchema]




class ConversationListResponse(BaseModel):
    """
    Schema for listing conversations.
    """
    conversations: List[dict]


class ConversationDetailResponse(BaseModel):
    """
    Schema for conversation details.
    """
    id: str
    created_at: datetime
    updated_at: datetime
    messages: List[MessageSchema]