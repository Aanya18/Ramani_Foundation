from fastapi import APIRouter, Depends
from typing import List
from app.schemas.lead import LeadResponse
from app.services.lead import LeadService
from app.api.deps import get_current_user

router = APIRouter(dependencies=[Depends(get_current_user)])

@router.get("/leads", response_model=List[LeadResponse])
async def get_all_leads(lead_service: LeadService = Depends()):
    return await lead_service.get_all_leads()
