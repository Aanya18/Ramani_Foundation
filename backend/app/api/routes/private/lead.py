from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.api.deps import get_current_user, get_db
from app.models import AdminUser
from app.schemas.lead import LeadResponse, LeadUpdate, LeadDetailResponse
from app.services.lead import LeadService

router = APIRouter(prefix="/leads", tags=["admin-leads"], dependencies=[Depends(get_current_user)])


@router.get("/", response_model=List[LeadResponse])
async def get_all_leads(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Get all leads (admin only)"""
    service = LeadService(db)
    return await service.get_all_leads(skip=skip, limit=limit)


@router.get("/type/{lead_type}", response_model=List[LeadResponse])
async def get_leads_by_type(
    lead_type: str,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Get leads by type (contact, volunteer, donation_inquiry) - admin only"""
    service = LeadService(db)
    return await service.get_by_type(lead_type, skip=skip, limit=limit)


@router.get("/contact-submissions", response_model=List[LeadResponse])
async def get_contact_submissions(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Get contact form submissions (admin only)"""
    service = LeadService(db)
    return await service.get_contact_form_submissions(skip=skip, limit=limit)


@router.get("/volunteers", response_model=List[LeadResponse])
async def get_volunteers(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Get volunteer signups (admin only)"""
    service = LeadService(db)
    return await service.get_volunteer_signups(skip=skip, limit=limit)


@router.get("/active", response_model=List[LeadResponse])
async def get_active_leads(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Get active leads (admin only)"""
    service = LeadService(db)
    return await service.get_active_leads(skip=skip, limit=limit)


@router.get("/{lead_id}", response_model=LeadDetailResponse)
async def get_lead(
    lead_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Get a specific lead with details (admin only)"""
    service = LeadService(db)
    lead = await service.get_lead_by_id(lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead


@router.put("/{lead_id}", response_model=LeadResponse)
async def update_lead(
    lead_id: uuid.UUID,
    lead_data: LeadUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Update a lead (admin only)"""
    service = LeadService(db)
    lead = await service.update_lead(lead_id, lead_data)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead


@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lead(
    lead_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Delete a lead (admin only)"""
    service = LeadService(db)
    success = await service.delete_lead(lead_id)
    if not success:
        raise HTTPException(status_code=404, detail="Lead not found")
