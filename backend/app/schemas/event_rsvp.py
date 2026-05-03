from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid


class EventRSVPBase(BaseModel):
    rsvp_status: str  # "attending", "maybe", "not_attending"
    is_volunteer: Optional[bool] = False
    volunteer_role: Optional[str] = None
    notes: Optional[str] = None


class EventRSVPCreate(EventRSVPBase):
    event_id: uuid.UUID
    lead_id: uuid.UUID


class EventRSVPResponse(EventRSVPBase):
    id: uuid.UUID
    event_id: uuid.UUID
    lead_id: uuid.UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class EventRSVPDetailResponse(EventRSVPResponse):
    """RSVP with associated lead details"""
    lead_name: Optional[str] = None
    lead_email: Optional[str] = None
    lead_phone: Optional[str] = None

    class Config:
        from_attributes = True
