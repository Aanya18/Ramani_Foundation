from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.api.deps import get_db
from app.schemas.event import EventResponse
from app.schemas.event_rsvp import EventRSVPResponse
from app.services.event import EventService
from app.services.event_rsvp import EventRSVPService
from pydantic import BaseModel, EmailStr


class RSVPRequest(BaseModel):
    lead: dict  # {name, email, phone}
    rsvp_status: str  # attending, maybe, not_attending
    is_volunteer: Optional[bool] = False
    volunteer_role: Optional[str] = None
    notes: Optional[str] = None


router = APIRouter(prefix="/events", tags=["events"])


@router.get("/", response_model=List[EventResponse])
async def get_events(db: AsyncSession = Depends(get_db)):
    """Get all events"""
    service = EventService(db)
    return await service.get_all_events()


@router.get("/upcoming", response_model=List[EventResponse])
async def get_upcoming_events(db: AsyncSession = Depends(get_db)):
    """Get upcoming events"""
    service = EventService(db)
    return await service.get_upcoming_events()


@router.get("/project/{project_id}", response_model=List[EventResponse])
async def get_project_events(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get events for a specific project"""
    service = EventService(db)
    return await service.get_events_by_project(project_id)


@router.get("/{event_id}", response_model=EventResponse)
async def get_event(
    event_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific event"""
    service = EventService(db)
    event = await service.event_repo.get_by_id(event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return EventResponse(
        id=event.id,
        title=event.title,
        description=event.description,
        date=event.date,
        location=event.location,
        project_id=event.project_id,
        is_upcoming=event.is_upcoming,
        accept_rsvp=event.accept_rsvp,
        accept_volunteers=event.accept_volunteers,
        image_url=f"/api/v1/public/images/{event.id}" if event.mega_file_id else None,
        created_at=event.created_at
    )


@router.post("/{event_id}/rsvp", response_model=EventRSVPResponse)
async def rsvp_for_event(
    event_id: uuid.UUID,
    rsvp_data: RSVPRequest,
    db: AsyncSession = Depends(get_db)
):
    """RSVP for an event (public)"""
    # Check if event exists and accepts RSVP
    service = EventService(db)
    event = await service.event_repo.get_by_id(str(event_id))
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    if not event.accept_rsvp:
        raise HTTPException(status_code=400, detail="This event is not accepting RSVPs")
    
    # Create RSVP
    rsvp_service = EventRSVPService(db)
    rsvp_request_dict = rsvp_data.dict()
    return await rsvp_service.create_rsvp(event_id, rsvp_request_dict)
