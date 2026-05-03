from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.api.deps import get_current_user, get_db
from app.models import AdminUser
from app.schemas.event import EventResponse, EventUpdate
from app.services.event import EventService

router = APIRouter(prefix="/events", tags=["admin-events"], dependencies=[Depends(get_current_user)])


@router.get("/", response_model=List[EventResponse])
async def get_all_events(
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Get all events (admin only)"""
    service = EventService(db)
    return await service.get_all_events()


@router.get("/upcoming", response_model=List[EventResponse])
async def get_upcoming_events(
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Get upcoming events (admin only)"""
    service = EventService(db)
    return await service.get_upcoming_events()


@router.get("/project/{project_id}", response_model=List[EventResponse])
async def get_project_events(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Get events for a specific project (admin only)"""
    service = EventService(db)
    return await service.get_events_by_project(project_id)


@router.post("/", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
async def create_event(
    title: str = Form(...),
    description: str = Form(...),
    date: str = Form(...),
    location: str = Form(...),
    project_id: Optional[str] = Form(None),
    is_upcoming: bool = Form(True),
    accept_rsvp: bool = Form(True),
    accept_volunteers: bool = Form(True),
    image: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Create a new event (admin only)"""
    service = EventService(db)
    
    project_uuid = None
    if project_id:
        try:
            project_uuid = uuid.UUID(project_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid project_id format")
    
    return await service.create_event(
        title=title,
        description=description,
        date=date,
        location=location,
        project_id=project_uuid,
        image=image,
        is_upcoming=is_upcoming,
        accept_rsvp=accept_rsvp,
        accept_volunteers=accept_volunteers
    )


@router.put("/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: str,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    date: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    project_id: Optional[str] = Form(None),
    is_upcoming: Optional[bool] = Form(None),
    accept_rsvp: Optional[bool] = Form(None),
    accept_volunteers: Optional[bool] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Update an event (admin only)"""
    service = EventService(db)
    
    update_data = {}
    if title is not None:
        update_data["title"] = title
    if description is not None:
        update_data["description"] = description
    if date is not None:
        update_data["date"] = date
    if location is not None:
        update_data["location"] = location
    if project_id is not None:
        try:
            update_data["project_id"] = uuid.UUID(project_id) if project_id else None
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid project_id format")
    if is_upcoming is not None:
        update_data["is_upcoming"] = is_upcoming
    if accept_rsvp is not None:
        update_data["accept_rsvp"] = accept_rsvp
    if accept_volunteers is not None:
        update_data["accept_volunteers"] = accept_volunteers
    
    event_update = EventUpdate(**update_data)
    return await service.update_event(event_id, event_update, image=image)


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(
    event_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Delete an event (admin only)"""
    service = EventService(db)
    await service.delete_event(event_id)
