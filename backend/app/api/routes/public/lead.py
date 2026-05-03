from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.schemas.lead import LeadCreate, LeadResponse
from app.services.lead import LeadService
from pydantic import BaseModel, EmailStr
from typing import Optional


class ContactFormRequest(BaseModel):
    """Contact form submission"""
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str
    contact_type: Optional[str] = "contact"  # contact, volunteer inquiry, donation inquiry


router = APIRouter(prefix="/leads", tags=["leads"])


@router.post("/", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
async def create_lead(
    lead: LeadCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a lead (generic)"""
    service = LeadService(db)
    return await service.create_lead(lead)


@router.post("/contact", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
async def submit_contact_form(
    contact: ContactFormRequest,
    db: AsyncSession = Depends(get_db)
):
    """Submit a contact form (public)"""
    service = LeadService(db)
    
    lead_data = LeadCreate(
        type="contact",
        name=contact.name,
        email=contact.email,
        phone=contact.phone,
        message=contact.message,
        source="contact_form"
    )
    
    return await service.create_lead(lead_data)


@router.post("/volunteer", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
async def submit_volunteer_form(
    volunteer: ContactFormRequest,
    db: AsyncSession = Depends(get_db)
):
    """Submit a volunteer signup form (public)"""
    service = LeadService(db)
    
    lead_data = LeadCreate(
        type="volunteer",
        name=volunteer.name,
        email=volunteer.email,
        phone=volunteer.phone,
        message=volunteer.message,
        source="volunteer_form"
    )
    
    return await service.create_lead(lead_data)


@router.post("/donation-inquiry", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
async def submit_donation_inquiry(
    inquiry: ContactFormRequest,
    db: AsyncSession = Depends(get_db)
):
    """Submit a donation inquiry (public)"""
    service = LeadService(db)
    
    lead_data = LeadCreate(
        type="donation_inquiry",
        name=inquiry.name,
        email=inquiry.email,
        phone=inquiry.phone,
        message=inquiry.message,
        source="donation_form"
    )
    
    return await service.create_lead(lead_data)
