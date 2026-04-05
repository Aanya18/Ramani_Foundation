from fastapi import APIRouter, Depends
from app.schemas.lead import LeadCreate, LeadResponse
from app.services.lead import LeadService

router = APIRouter()

@router.post("/leads", response_model=LeadResponse)
async def create_lead(lead: LeadCreate, lead_service: LeadService = Depends()):
    return await lead_service.create_lead(lead)
