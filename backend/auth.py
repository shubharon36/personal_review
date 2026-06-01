from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from config import get_settings, Settings

security = HTTPBearer()


def create_access_token(settings: Settings | None = None) -> str:
    """Create a JWT access token for the admin user."""
    if settings is None:
        settings = get_settings()
    expire = datetime.now(timezone.utc) + timedelta(days=settings.access_token_expire_days)
    to_encode = {"sub": "admin", "exp": expire}
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


def verify_password(password: str, settings: Settings | None = None) -> bool:
    """Verify the admin password."""
    if settings is None:
        settings = get_settings()
    return password == settings.admin_password


def verify_token(token: str, settings: Settings | None = None) -> bool:
    """Verify a JWT token is valid and not expired."""
    if settings is None:
        settings = get_settings()
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        return payload.get("sub") == "admin"
    except JWTError:
        return False


async def require_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> bool:
    """FastAPI dependency that requires a valid admin token."""
    settings = get_settings()
    if not verify_token(credentials.credentials, settings):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    return True
