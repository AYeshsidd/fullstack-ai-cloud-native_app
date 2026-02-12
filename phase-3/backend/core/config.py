from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """
    database_url: str = "sqlite:///./todo_local.db"  # Default to local SQLite for development
    environment: str = "development"  # Environment setting
    jwt_secret: str = "your-super-secret-jwt-key-here-make-it-long-and-random"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    db_echo_enabled: bool = False  # Set to True for SQL query logging
    openai_api_key: str = "your_openai_api_key_here"  # OpenAI API key
    model_name: str = "gpt-4-turbo-preview"  # Model name for OpenAI
    mcp_port: int = 8001  # Port for MCP server (different from main API)

    class Config:
        env_file = ".env"
        protected_namespaces = ()  # Disable the protected namespace warning

    @property
    def ENVIRONMENT(self):
        """Backward compatibility property"""
        return self.environment

    @property
    def DATABASE_URL(self):
        """Backward compatibility property"""
        return self.database_url


settings = Settings()