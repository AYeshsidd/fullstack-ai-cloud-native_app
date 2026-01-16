from sqlmodel import create_engine, Session
from typing import Generator
from core.config import settings

# Create the database engine
engine = create_engine(
    settings.database_url,
    echo=settings.db_echo_enabled,
    pool_pre_ping=True,
    pool_recycle=300,
)

def get_session() -> Generator[Session, None, None]:
    """
    Get a database session for dependency injection.

    Yields:
        Session: A database session for SQLModel operations
    """
    with Session(engine) as session:
        yield session