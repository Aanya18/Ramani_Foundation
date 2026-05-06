from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.api.deps import get_db
from app.schemas.event_rsvp import EventRSVPCreate, EventRSVPResponse
from app.services.event_rsvp import EventRSVPService
from pydantic import BaseModel, EmailStr


class RSVPRequest(BaseModel):
    """RSVP request for an event"""
    event_id: uuid.UUID
    name: str
    email: EmailStr
    phone: Optional[str] = None
    rsvp_status: str  # "attending", "maybe", "not_attending"
    is_volunteer: Optional[bool] = False
    volunteer_role: Optional[str] = None
    notes: Optional[str] = None


router = APIRouter(prefix="/rsvp", tags=["rsvp"])


@router.post("/", response_model=EventRSVPResponse, status_code=status.HTTP_201_CREATED)
async def submit_rsvp(
    rsvp: RSVPRequest,
    db: AsyncSession = Depends(get_db)
):
    """Submit RSVP for an event (public)"""
    service = EventRSVPService(db)
    
    rsvp_data = {
        "rsvp_status": rsvp.rsvp_status,
        "is_volunteer": rsvp.is_volunteer,
        "volunteer_role": rsvp.volunteer_role,
        "notes": rsvp.notes,
        "lead": {
            "name": rsvp.name,
            "email": rsvp.email,
            "phone": rsvp.phone
        }
    }
    
    return await service.create_rsvp(rsvp.event_id, rsvp_data)


@router.post("/volunteer", response_model=EventRSVPResponse, status_code=status.HTTP_201_CREATED)
async def submit_volunteer_rsvp(
    rsvp: RSVPRequest,
    db: AsyncSession = Depends(get_db)
):
    """Submit volunteer RSVP for an event (public)"""
    service = EventRSVPService(db)
    
    rsvp_data = {
        "rsvp_status": "attending",
        "is_volunteer": True,
        "volunteer_role": rsvp.volunteer_role or "General Volunteer",
        "notes": rsvp.notes,
        "lead": {
            "name": rsvp.name,
            "email": rsvp.email,
            "phone": rsvp.phone
        }
    }
    
    return await service.create_rsvp(rsvp.event_id, rsvp_data)
