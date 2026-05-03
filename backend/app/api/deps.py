from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from app.core import settings
from app.core.database import get_db
from app.services import UserService
from app.models import AdminUser

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=settings.AUTH_TOKEN_URL)

async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    user_service: UserService = Depends()
) -> AdminUser:
    return await user_service.get_user_from_token(token)

async def get_current_admin(
    current_user: AdminUser = Depends(get_current_user)
) -> AdminUser:
    return current_user
