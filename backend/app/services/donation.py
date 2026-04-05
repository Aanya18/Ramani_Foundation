from fastapi import Depends, UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.repository.donation import DonationRepository
from app.models.donation import Donation
from app.schemas.donation import DonationResponse
from app.utils.utils import save_upload_file
import uuid
import os
from typing import List

class DonationService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.donation_repo = DonationRepository(db)

    async def get_all_donations(self) -> List[DonationResponse]:
        donations = await self.donation_repo.get_all()
        return [DonationResponse.from_orm(donation) for donation in donations]

    async def create_donation(self, donor_name: str, email: str, amount: str, proof_image: UploadFile) -> DonationResponse:
        if not proof_image.filename:
            raise HTTPException(status_code=400, detail="Proof image is required")

        if proof_image.content_type not in ['image/png', 'image/jpeg', 'image/webp']:
            raise HTTPException(status_code=400, detail="Invalid image type")

        ext = os.path.splitext(proof_image.filename)[1]
        filename = f"{uuid.uuid4()}{ext}"
        filepath = os.path.join("uploads", filename)
        await save_upload_file(proof_image, filepath)

        db_donation = Donation(
            donor_name=donor_name,
            email=email,
            amount=amount,
            proof_image_url=f"/uploads/{filename}"
        )
        created_donation = await self.donation_repo.create(db_donation)
        return DonationResponse.from_orm(created_donation)

    async def verify_donation(self, donation_id: int) -> DonationResponse:
        donation = await self.donation_repo.get_by_id(donation_id)
        if not donation:
            raise HTTPException(status_code=404, detail="Donation not found")
        
        verified_donation = await self.donation_repo.verify(donation)
        return DonationResponse.from_orm(verified_donation)
