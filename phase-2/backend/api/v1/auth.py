from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlmodel import Session, select
from datetime import timedelta
from database.session import get_session
from models.user import User, UserCreate
from schemas.user import UserLogin, UserCreate as UserCreateSchema
from core.security import (
    authenticate_user,
    create_access_token,
    get_password_hash,
    verify_password
)
from middleware.auth import JWTBearer
import uuid


router = APIRouter(prefix="/api/v1", tags=["auth"])


@router.post("/auth/register")
def register_user(
    user_data: UserCreateSchema,
    session: Session = Depends(get_session)
):
    """
    Register a new user account.

    Args:
        user_data: User registration data
        session: Database session

    Returns:
        dict: Success message and user information
    """
    # Check if user already exists
    existing_user = session.exec(
        select(User).where(User.email == user_data.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=hashed_password
    )

    session.add(db_user)
    session.commit()
    session.refresh(db_user)

    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": db_user.id}, expires_delta=access_token_expires
    )

    return {
        "message": "User registered successfully",
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "name": db_user.name
        },
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/auth/login")
def login_user(
    user_credentials: UserLogin,
    session: Session = Depends(get_session)
):
    """
    Authenticate user and return access token.

    Args:
        user_credentials: User login credentials
        session: Database session

    Returns:
        dict: Access token and user information
    """
    user = authenticate_user(
        session=session,
        email=user_credentials.email,
        password=user_credentials.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name
        }
    }


@router.post("/auth/logout")
def logout_user(token: str = Depends(JWTBearer())):
    """
    Logout user (currently just validates token).

    Args:
        token: JWT token for authentication

    Returns:
        dict: Success message
    """
    # In a real implementation, you might add the token to a blacklist
    return {"message": "Successfully logged out"}


@router.get("/auth/me")
def get_current_user(
    token: str = Depends(JWTBearer()),
    session: Session = Depends(get_session)
):
    """
    Get current authenticated user information.

    Args:
        token: JWT token for authentication
        session: Database session

    Returns:
        User: Current user information
    """
    from core.security import get_current_user_id_from_token

    user_id = get_current_user_id_from_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user