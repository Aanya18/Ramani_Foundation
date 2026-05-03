from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import get_db
from app.repository.lead import LeadRepository
from app.models import Lead
from app.schemas.lead import LeadCreate, LeadUpdate, LeadResponse, LeadDetailResponse
from typing import List, Optional
import uuid


class LeadService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.db = db
        self.lead_repo = LeadRepository(db)

    async def get_all_leads(self, skip: int = 0, limit: int = 100) -> List[LeadResponse]:
        leads = await self.lead_repo.get_all()
        return [LeadResponse.from_orm(lead) for lead in leads]

    async def get_lead_by_id(self, lead_id: uuid.UUID) -> Optional[LeadDetailResponse]:
        lead = await self.lead_repo.get_by_id(lead_id)
        if not lead:
            return None
        
        rsvp_count = len(lead.rsvps) if lead.rsvps else 0
        
        return LeadDetailResponse(
            **LeadResponse.from_orm(lead).dict(),
            rsvp_count=rsvp_count
        )

    async def create_lead(self, lead: LeadCreate) -> LeadResponse:
        db_lead = Lead(**lead.dict())
        created_lead = await self.lead_repo.create(db_lead)
        return LeadResponse.from_orm(created_lead)

    async def get_by_email(self, email: str) -> Optional[LeadResponse]:
        lead = await self.lead_repo.get_by_email(email)
        if not lead:
            return None
        return LeadResponse.from_orm(lead)

    async def get_by_type(self, lead_type: str, skip: int = 0, limit: int = 100) -> List[LeadResponse]:
        leads = await self.lead_repo.get_by_type(lead_type, skip=skip, limit=limit)
        return [LeadResponse.from_orm(lead) for lead in leads]

    async def get_active_leads(self, skip: int = 0, limit: int = 100) -> List[LeadResponse]:
        leads = await self.lead_repo.get_active(skip=skip, limit=limit)
        return [LeadResponse.from_orm(lead) for lead in leads]

    async def update_lead(self, lead_id: uuid.UUID, lead_data: LeadUpdate) -> Optional[LeadResponse]:
        lead = await self.lead_repo.get_by_id(lead_id)
        if not lead:
            return None
        
        update_data = lead_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(lead, field, value)
        
        updated_lead = await self.lead_repo.update(lead)
        return LeadResponse.from_orm(updated_lead)

    async def delete_lead(self, lead_id: uuid.UUID) -> bool:
        lead = await self.lead_repo.get_by_id(lead_id)
        if not lead:
            return False
        
        await self.lead_repo.delete(lead)
        return True

    async def get_contact_form_submissions(self, skip: int = 0, limit: int = 100) -> List[LeadResponse]:
        leads = await self.lead_repo.get_by_type("contact", skip=skip, limit=limit)
        return [LeadResponse.from_orm(lead) for lead in leads]

    async def get_volunteer_signups(self, skip: int = 0, limit: int = 100) -> List[LeadResponse]:
        leads = await self.lead_repo.get_by_type("volunteer", skip=skip, limit=limit)
        return [LeadResponse.from_orm(lead) for lead in leads]
