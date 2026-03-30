from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.admin import AdminEventBase, AdminEventResponse
from app.schemas.content import EventSummary
from app.services.admin_service import create_event, list_admin_events, update_event
from app.services.content_service import list_events

router = APIRouter()


@router.get("", response_model=list[EventSummary])
def get_events(db: Session = Depends(get_db)) -> list[EventSummary]:
    return list_events(db)


@router.get("/admin", response_model=list[AdminEventResponse])
def get_admin_events(db: Session = Depends(get_db)) -> list[AdminEventResponse]:
    return list_admin_events(db)


@router.post("/admin", response_model=AdminEventResponse)
def create_admin_event(
    payload: AdminEventBase, db: Session = Depends(get_db)
) -> AdminEventResponse:
    return create_event(db, payload)


@router.put("/admin/{event_id}", response_model=AdminEventResponse)
def update_admin_event(
    event_id: str, payload: AdminEventBase, db: Session = Depends(get_db)
) -> AdminEventResponse:
    return update_event(db, event_id, payload)
