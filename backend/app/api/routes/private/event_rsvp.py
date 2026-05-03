from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
import uuid

from app.api.deps import get_db, get_current_user
from app.models import AdminUser
from app.schemas.event_rsvp import EventRSVPCreate, EventRSVPResponse, EventRSVPDetailResponse
from app.services.event_rsvp import EventRSVPService

router = APIRouter(prefix="/event-rsvps", tags=["event-rsvps"])


@router.get("/event/{event_id}", response_model=List[EventRSVPDetailResponse])
async def get_event_rsvps(
    event_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100,
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all RSVPs for an event (admin only)"""
    service = EventRSVPService(db)
    return await service.get_rsvps_by_event(event_id, skip=skip, limit=limit)


@router.get("/event/{event_id}/volunteers", response_model=List[EventRSVPDetailResponse])
async def get_event_volunteers(
    event_id: uuid.UUID,
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all volunteers for an event (admin only)"""
    service = EventRSVPService(db)
    return await service.get_volunteers_for_event(event_id)


@router.get("/event/{event_id}/attendees", response_model=List[EventRSVPDetailResponse])
async def get_event_attendees(
    event_id: uuid.UUID,
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all attendees for an event (admin only)"""
    service = EventRSVPService(db)
    return await service.get_attendees_for_event(event_id)


@router.get("/event/{event_id}/stats")
async def get_event_stats(
    event_id: uuid.UUID,
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get RSVP statistics for an event (admin only)"""
    service = EventRSVPService(db)
    return await service.get_event_stats(event_id)


@router.get("/lead/{lead_id}", response_model=List[EventRSVPResponse])
async def get_lead_rsvps(
    lead_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100,
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all RSVPs for a lead (admin only)"""
    service = EventRSVPService(db)
    return await service.get_rsvps_by_lead(lead_id, skip=skip, limit=limit)


@router.get("/{rsvp_id}", response_model=EventRSVPDetailResponse)
async def get_rsvp(
    rsvp_id: uuid.UUID,
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get RSVP by ID (admin only)"""
    service = EventRSVPService(db)
    rsvp = await service.get_rsvp(rsvp_id)
    if not rsvp:
        raise HTTPException(status_code=404, detail="RSVP not found")
    return rsvp


@router.post("/", response_model=EventRSVPResponse, status_code=status.HTTP_201_CREATED)
async def create_rsvp(
    rsvp_data: dict,
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create an RSVP for an event (admin only)"""
    service = EventRSVPService(db)
    event_id = rsvp_data.pop("event_id")
    return await service.create_rsvp(event_id, rsvp_data)


@router.put("/{rsvp_id}", response_model=EventRSVPResponse)
async def update_rsvp(
    rsvp_id: uuid.UUID,
    rsvp_data: dict,
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update an RSVP (admin only)"""
    service = EventRSVPService(db)
    rsvp = await service.update_rsvp(rsvp_id, rsvp_data)
    if not rsvp:
        raise HTTPException(status_code=404, detail="RSVP not found")
    return rsvp


@router.delete("/{rsvp_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_rsvp(
    rsvp_id: uuid.UUID,
    current_user: AdminUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete an RSVP (admin only)"""
    service = EventRSVPService(db)
    success = await service.delete_rsvp(rsvp_id)
    if not success:
        raise HTTPException(status_code=404, detail="RSVP not found")
