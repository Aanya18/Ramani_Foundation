from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.admin import AdminPublicContentSettings
from app.schemas.settings import PublicSettingsResponse
from app.services.settings_service import (
    get_admin_public_settings,
    get_public_settings,
    update_admin_public_settings,
)

router = APIRouter()


@router.get("/public", response_model=PublicSettingsResponse)
def public_settings(db: Session = Depends(get_db)) -> PublicSettingsResponse:
    return get_public_settings(db)


@router.get("/admin/public-content", response_model=AdminPublicContentSettings)
def admin_public_content(db: Session = Depends(get_db)) -> AdminPublicContentSettings:
    return get_admin_public_settings(db)


@router.put("/admin/public-content", response_model=AdminPublicContentSettings)
def save_admin_public_content(
    payload: AdminPublicContentSettings, db: Session = Depends(get_db)
) -> AdminPublicContentSettings:
    return update_admin_public_settings(db, payload)
