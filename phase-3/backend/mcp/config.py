from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """
    MCP server settings loaded from environment variables.
    """
    database_url: str = "sqlite:///./todo_local.db"  # Default to local SQLite for development
    jwt_secret: str = "your-super-secret-jwt-key-here-make-it-long-and-random"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    db_echo_enabled: bool = False  # Set to True for SQL query logging
    mcp_port: int = 8001  # Port for MCP server (different from main API)

    class Config:
        env_file = ".env"


settings = Settings()