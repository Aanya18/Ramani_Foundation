from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import get_db, verify_password, create_access_token, settings
from app.repository import UserRepository
from app.schemas import Token
from datetime import timedelta


class AuthService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.user_repo = UserRepository(db)

    async def login(self, form_data: OAuth2PasswordRequestForm) -> Token:
        user = await self.user_repo.get_by_username(form_data.username)
        if not user or not verify_password(form_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"username": user.username}, expires_delta=access_token_expires
        )
        return Token(access_token=access_token, token_type="bearer")
