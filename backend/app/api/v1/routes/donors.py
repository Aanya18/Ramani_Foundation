from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.admin import AdminDonorRow
from app.services.admin_service import list_admin_donors

router = APIRouter()


@router.get("", response_model=list[AdminDonorRow])
def get_admin_donors(db: Session = Depends(get_db)) -> list[AdminDonorRow]:
    return list_admin_donors(db)
