from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from ..core.security import verify_token, get_current_user_id_from_token
from typing import Optional, Dict


class JWTBearer(HTTPBearer):
    """
    Custom JWT authentication middleware that extends HTTPBearer.
    """

    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        """
        Process the incoming request and validate JWT token.

        Args:
            request: Incoming HTTP request

        Returns:
            Optional[HTTPAuthorizationCredentials]: Valid credentials or raises exception

        Raises:
            HTTPException: If token is invalid or missing
        """
        credentials: Optional[HTTPAuthorizationCredentials] = await super(JWTBearer, self).__call__(request)

        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Invalid authentication scheme."
                )

            if not self.verify_jwt(credentials.credentials):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Invalid or expired token."
                )

            return credentials.credentials
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid authorization code."
            )

    def verify_jwt(self, jwtoken: str) -> bool:
        """
        Verify the JWT token.

        Args:
            jwtoken: JWT token to verify

        Returns:
            bool: True if token is valid, False otherwise
        """
        payload = verify_token(jwtoken)
        return payload is not None


# Helper function to extract user ID from token
def get_user_id_from_token(token: str) -> Optional[str]:
    """
    Extract user ID from JWT token.

    Args:
        token: JWT token

    Returns:
        Optional[str]: User ID if token is valid, None otherwise
    """
    return get_current_user_id_from_token(token)