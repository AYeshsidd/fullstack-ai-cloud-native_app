from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TodoTaskBase(BaseModel):
    """
    Base schema for TodoTask with shared attributes.
    """
    title: str
    description: Optional[str] = None
    completed: bool = False


class TodoTaskCreate(TodoTaskBase):
    """
    Schema for creating a new todo task.
    """
    pass


class TodoTaskUpdate(BaseModel):
    """
    Schema for updating todo task information.
    """
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


class TodoTaskRead(TodoTaskBase):
    """
    Schema for reading todo task data.
    """
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TodoTaskList(BaseModel):
    """
    Schema for listing multiple todo tasks.
    """
    tasks: list[TodoTaskRead]


class TodoTaskComplete(BaseModel):
    """
    Schema for updating task completion status.
    """
    completed: bool