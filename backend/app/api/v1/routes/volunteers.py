from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.admin import AdminVolunteerRow
from app.schemas.common import MessageResponse
from app.schemas.forms import VolunteerCreateRequest
from app.services.admin_service import list_admin_volunteers
from app.services.form_service import submit_volunteer_form

router = APIRouter()


@router.post("", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def create_volunteer(
    payload: VolunteerCreateRequest, db: Session = Depends(get_db)
) -> MessageResponse:
    return submit_volunteer_form(db, payload)


@router.get("/admin/list", response_model=list[AdminVolunteerRow])
def get_admin_volunteers(db: Session = Depends(get_db)) -> list[AdminVolunteerRow]:
    return list_admin_volunteers(db)
