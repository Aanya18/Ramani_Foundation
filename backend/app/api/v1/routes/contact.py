from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.admin import AdminContactRow
from app.schemas.common import MessageResponse
from app.schemas.forms import ContactCreateRequest
from app.services.admin_service import list_admin_contact_messages
from app.services.form_service import submit_contact_form

router = APIRouter()


@router.post("", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def create_contact_message(
    payload: ContactCreateRequest, db: Session = Depends(get_db)
) -> MessageResponse:
    return submit_contact_form(db, payload)


@router.get("/admin/list", response_model=list[AdminContactRow])
def get_admin_contact_messages(db: Session = Depends(get_db)) -> list[AdminContactRow]:
    return list_admin_contact_messages(db)
