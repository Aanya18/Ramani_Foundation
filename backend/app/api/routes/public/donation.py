from fastapi import APIRouter, Depends, UploadFile, File, Form
from app.schemas import DonationResponse
from app.services import DonationService

router = APIRouter()

@router.post("/donations", response_model=DonationResponse)
async def create_donation(
    donor_name: str = Form(...),
    email: str = Form(...),
    amount: str = Form(...),
    proof_image: UploadFile = File(...),
    donation_service: DonationService = Depends()
):
    return await donation_service.create_donation(donor_name, email, amount, proof_image)
