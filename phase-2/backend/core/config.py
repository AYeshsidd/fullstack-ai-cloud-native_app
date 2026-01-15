from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """
    database_url: str
    jwt_secret: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    db_echo_enabled: bool = False  # Set to True for SQL query logging

    class Config:
        env_file = ".env"


settings = Settings()