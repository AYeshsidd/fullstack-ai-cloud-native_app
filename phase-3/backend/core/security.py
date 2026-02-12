from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .config import settings
from sqlmodel import Session
from models.user import User


# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT token scheme for dependency injection
oauth2_scheme = HTTPBearer()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plaintext password against its hash.

    Args:
        plain_password: The plaintext password to verify
        hashed_password: The hashed password to compare against

    Returns:
        bool: True if the passwords match, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Hash a plaintext password.

    Args:
        password: The plaintext password to hash

    Returns:
        str: The hashed password
    """
    return pwd_context.hash(password)


def authenticate_user(session: Session, email: str, password: str) -> Optional[User]:
    """
    Authenticate a user by email and password.

    Args:
        session: Database session
        email: User's email address
        password: User's plaintext password

    Returns:
        User: The authenticated user if credentials are valid, None otherwise
    """
    from sqlmodel import select

    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()

    if not user or not verify_password(password, user.hashed_password):
        return None

    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.

    Args:
        data: Data to encode in the token
        expires_delta: Optional expiration time delta

    Returns:
        str: Encoded JWT token
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.algorithm)

    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    """
    Verify a JWT token and return its payload.

    Args:
        token: JWT token to verify

    Returns:
        dict: Token payload if valid, None otherwise
    """
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.algorithm])
        return payload
    except JWTError:
        return None


def get_current_user_from_token(token: str) -> Optional[dict]:
    """
    Get the current user from a JWT token.

    Args:
        token: JWT token from authorization header

    Returns:
        dict: User information if token is valid, None otherwise
    """
    payload = verify_token(token)
    if payload is None:
        return None

    user_id: str = payload.get("sub")
    if user_id is None:
        return None

    return payload


def get_current_user_id_from_token(token: str) -> Optional[str]:
    """
    Extract the user ID from a JWT token.

    Args:
        token: JWT token from authorization header

    Returns:
        str: User ID if token is valid, None otherwise
    """
    payload = verify_token(token)
    if payload is None:
        return None

    user_id: str = payload.get("sub")
    return user_id