from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.repository.lead import LeadRepository
from app.models.lead import Lead
from app.schemas.lead import LeadCreate, LeadResponse
from typing import List

class LeadService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.lead_repo = LeadRepository(db)

    async def get_all_leads(self) -> List[LeadResponse]:
        leads = await self.lead_repo.get_all()
        return [LeadResponse.from_orm(lead) for lead in leads]

    async def create_lead(self, lead: LeadCreate) -> LeadResponse:
        db_lead = Lead(**lead.model_dump())
        created_lead = await self.lead_repo.create(db_lead)
        return LeadResponse.from_orm(created_lead)
