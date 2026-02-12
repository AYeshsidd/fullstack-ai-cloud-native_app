from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class AddTaskInput(BaseModel):
    """Input schema for add_task tool."""
    user_id: str
    title: str
    description: Optional[str] = None


class AddTaskOutput(BaseModel):
    """Output schema for add_task tool."""
    id: str
    user_id: str
    title: str
    description: Optional[str] = None
    completed: bool
    created_at: datetime
    updated_at: datetime


class ListTasksInput(BaseModel):
    """Input schema for list_tasks tool."""
    user_id: str
    status: Optional[str] = "all"  # "all", "pending", "completed"


class TaskItem(BaseModel):
    """Schema for a single task item in list output."""
    id: str
    user_id: str
    title: str
    description: Optional[str] = None
    completed: bool
    created_at: datetime
    updated_at: datetime


class ListTasksOutput(BaseModel):
    """Output schema for list_tasks tool."""
    tasks: List[TaskItem]


class UpdateTaskInput(BaseModel):
    """Input schema for update_task tool."""
    user_id: str
    task_id: str
    title: Optional[str] = None
    description: Optional[str] = None


class UpdateTaskOutput(BaseModel):
    """Output schema for update_task tool."""
    id: str
    user_id: str
    title: str
    description: Optional[str] = None
    completed: bool
    created_at: datetime
    updated_at: datetime


class CompleteTaskInput(BaseModel):
    """Input schema for complete_task tool."""
    user_id: str
    task_id: str


class CompleteTaskOutput(BaseModel):
    """Output schema for complete_task tool."""
    id: str
    user_id: str
    title: str
    description: Optional[str] = None
    completed: bool
    created_at: datetime
    updated_at: datetime


class DeleteTaskInput(BaseModel):
    """Input schema for delete_task tool."""
    user_id: str
    task_id: str


class DeleteTaskOutput(BaseModel):
    """Output schema for delete_task tool."""
    success: bool
    message: str