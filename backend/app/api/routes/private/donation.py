from fastapi import APIRouter, Depends
from typing import List
from app.schemas.donation import DonationResponse
from app.services.donation import DonationService
from app.api.deps import get_current_user

router = APIRouter(dependencies=[Depends(get_current_user)])

@router.get("/donations", response_model=List[DonationResponse])
async def get_all_donations(donation_service: DonationService = Depends()):
    return await donation_service.get_all_donations()

@router.post("/donations/{donation_id}/verify", response_model=DonationResponse)
async def verify_donation(donation_id: int, donation_service: DonationService = Depends()):
    return await donation_service.verify_donation(donation_id)
