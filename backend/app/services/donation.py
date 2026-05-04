from fastapi import Depends, UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import get_db, settings
from app.repository import DonationRepository
from app.models import Donation
from app.schemas import DonationResponse
from app.services.image import ImageService
import uuid
from typing import List

class DonationService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.donation_repo = DonationRepository(db)
        self.image_service = ImageService()

    async def _map_response(self, donation: Donation) -> DonationResponse:
        return DonationResponse(
            id=donation.id,
            donor_name=donation.donor_name,
            email=donation.email,
            amount=donation.amount,
            proof_image_url=f"{settings.API_V1_STR}/public/images/{donation.id}",
            verified=donation.verified,
            created_at=donation.created_at
        )

    async def get_all_donations(self) -> List[DonationResponse]:
        donations = await self.donation_repo.get_all()
        return [await self._map_response(d) for d in donations]

    async def create_donation(self, donor_name: str, email: str, amount: str, proof_image: UploadFile) -> DonationResponse:
        if not proof_image.filename:
            raise HTTPException(status_code=400, detail="Proof image is required")

        if proof_image.content_type not in settings.ALLOWED_IMAGE_TYPES:
            raise HTTPException(status_code=400, detail="Invalid image type")

        # Store proof image in Mega storage
        mega_file_id = await self.image_service.upload_image(proof_image)

        db_donation = Donation(
            donor_name=donor_name,
            email=email,
            amount=amount,
            mega_file_id=mega_file_id,
            content_type=proof_image.content_type
        )
        created_donation = await self.donation_repo.create(db_donation)
        return await self._map_response(created_donation)

    async def verify_donation(self, donation_id: uuid.UUID) -> DonationResponse:
        donation = await self.donation_repo.get_by_id(donation_id)
        if not donation:
            raise HTTPException(status_code=404, detail="Donation not found")

        verified_donation = await self.donation_repo.verify(donation)
        return await self._map_response(verified_donation)

