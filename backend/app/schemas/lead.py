from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid


class LeadBase(BaseModel):
    type: str  # "contact", "volunteer", "donation_inquiry"
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: Optional[str] = None
    source: Optional[str] = None  # "contact_form", "event_rsvp", "volunteer_form"


class LeadCreate(LeadBase):
    pass


class LeadUpdate(BaseModel):
    type: Optional[str] = None
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    message: Optional[str] = None
    is_active: Optional[bool] = None


class LeadResponse(LeadBase):
    id: uuid.UUID
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class LeadDetailResponse(LeadResponse):
    """Lead with RSVP history"""
    updated_at: Optional[datetime] = None
    rsvp_count: int = 0

    class Config:
        from_attributes = True
