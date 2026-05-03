from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid


class EventBase(BaseModel):
    title: str
    description: str
    date: str
    location: str
    project_id: Optional[uuid.UUID] = None
    is_upcoming: Optional[bool] = True
    accept_rsvp: Optional[bool] = True
    accept_volunteers: Optional[bool] = True


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    location: Optional[str] = None
    project_id: Optional[uuid.UUID] = None
    is_upcoming: Optional[bool] = None
    accept_rsvp: Optional[bool] = None
    accept_volunteers: Optional[bool] = None


class EventResponse(EventBase):
    id: uuid.UUID
    image_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class EventDetailResponse(EventResponse):
    """Event with gallery items and RSVP info"""
    gallery_items: List[dict] = []
    rsvp_count: int = 0
    volunteer_count: int = 0
    project_name: Optional[str] = None

    class Config:
        from_attributes = True
