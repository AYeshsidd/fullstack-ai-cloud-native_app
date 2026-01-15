from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """
    Base schema for User with shared attributes.
    """
    email: str
    name: str


class UserCreate(UserBase):
    """
    Schema for creating a new user.
    """
    password: str


class UserUpdate(BaseModel):
    """
    Schema for updating user information.
    """
    email: Optional[str] = None
    name: Optional[str] = None


class UserRead(UserBase):
    """
    Schema for reading user data without sensitive information.
    """
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    """
    Schema for user login.
    """
    email: str
    password: str


class UserResponse(BaseModel):
    """
    Schema for user response without sensitive information.
    """
    id: str
    email: str
    name: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True