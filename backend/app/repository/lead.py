from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models import Lead
from typing import List

class LeadRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> List[Lead]:
        result = await self.db.execute(select(Lead).order_by(Lead.created_at.desc()))
        return result.scalars().all()

    async def create(self, lead: Lead) -> Lead:
        self.db.add(lead)
        await self.db.commit()
        await self.db.refresh(lead)
        return lead
