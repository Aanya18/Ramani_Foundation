from fastapi import APIRouter
from pydantic import BaseModel

from app.core import settings


class PublicSettingsResponse(BaseModel):
    whatsapp_group_url: str


router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("/", response_model=PublicSettingsResponse)
async def get_public_settings():
    return PublicSettingsResponse(whatsapp_group_url=settings.WHATSAPP_GROUP_URL)
