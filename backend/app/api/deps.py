from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from app.core.config import settings
from app.services.user import UserService
from app.models.user import AdminUser

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=settings.AUTH_TOKEN_URL)

async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    user_service: UserService = Depends()
) -> AdminUser:
    return await user_service.get_user_from_token(token)

