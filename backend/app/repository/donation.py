import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models import Donation
from typing import List

class DonationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> List[Donation]:
        result = await self.db.execute(select(Donation).order_by(Donation.created_at.desc()))
        return result.scalars().all()

    async def create(self, donation: Donation) -> Donation:
        self.db.add(donation)
        await self.db.commit()
        await self.db.refresh(donation)
        return donation

    async def get_by_id(self, donation_id: uuid.UUID) -> Donation | None:
        result = await self.db.execute(select(Donation).where(Donation.id == donation_id))
        return result.scalars().first()

    async def verify(self, donation: Donation) -> Donation:
        donation.verified = True
        await self.db.commit()
        await self.db.refresh(donation)
        return donation
