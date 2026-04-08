from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
import jwt
from typing import Optional
from .config import settings

pwd_context_config = {
    "schemes": [settings.HASHING_SCHEME],
    "deprecated": "auto",
}

if settings.HASHING_SCHEME == "argon2":
    pwd_context_config.update(
        {
            "argon2__time_cost": settings.ARGON2_TIME_COST,
            "argon2__memory_cost": settings.ARGON2_MEMORY_COST,
            "argon2__parallelism": settings.ARGON2_PARALLELISM,
        }
    )

pwd_context = CryptContext(**pwd_context_config)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt
