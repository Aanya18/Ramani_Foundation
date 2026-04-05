from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import jwt
from app.core.database import get_db
from app.core.config import settings
from app.models.user import AdminUser
from app.repository.user import UserRepository

class UserService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.user_repo = UserRepository(db)

    async def get_user_from_token(self, token: str) -> AdminUser:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
            username: str = payload.get("username")
            if username is None:
                raise credentials_exception
        except jwt.PyJWTError:
            raise credentials_exception

        user = await self.user_repo.get_by_username(username)
        if user is None:
            raise credentials_exception
        return user
