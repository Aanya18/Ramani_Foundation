from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.event_rsvp import EventRSVPCreate, EventRSVPResponse, EventRSVPDetailResponse
from app.repository.event_rsvp import EventRSVPRepository
from app.schemas.lead import LeadCreate
from app.services.lead import LeadService
import uuid
from typing import List, Optional


class EventRSVPService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = EventRSVPRepository(db)
        self.lead_service = LeadService(db)

    async def create_rsvp(self, event_id: uuid.UUID, rsvp_data: dict) -> EventRSVPResponse:
        """Create an RSVP for an event"""
        lead_data = rsvp_data.get("lead", {})
        
        # Get or create lead
        lead = await self.lead_service.get_by_email(lead_data.get("email"))
        if not lead:
            lead_create = LeadCreate(
                type="event_attendee",
                name=lead_data.get("name"),
                email=lead_data.get("email"),
                phone=lead_data.get("phone"),
                source="event_rsvp"
            )
            lead = await self.lead_service.create_lead(lead_create)
        
        # Create RSVP
        rsvp_create = EventRSVPCreate(
            event_id=event_id,
            lead_id=lead.id,
            rsvp_status=rsvp_data.get("rsvp_status", "attending"),
            is_volunteer=rsvp_data.get("is_volunteer", False),
            volunteer_role=rsvp_data.get("volunteer_role"),
            notes=rsvp_data.get("notes")
        )
        rsvp = await self.repo.create(rsvp_create)
        return EventRSVPResponse.from_orm(rsvp)

    async def get_rsvp(self, rsvp_id: uuid.UUID) -> Optional[EventRSVPDetailResponse]:
        """Get RSVP by ID"""
        rsvp = await self.repo.get_by_id(rsvp_id)
        if not rsvp:
            return None
        
        return EventRSVPDetailResponse(
            **EventRSVPResponse.from_orm(rsvp).dict(),
            lead_name=rsvp.lead.name,
            lead_email=rsvp.lead.email,
            lead_phone=rsvp.lead.phone
        )

    async def get_rsvps_by_event(self, event_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[EventRSVPDetailResponse]:
        """Get all RSVPs for an event"""
        rsvps = await self.repo.get_by_event(event_id, skip=skip, limit=limit)
        
        results = []
        for rsvp in rsvps:
            results.append(EventRSVPDetailResponse(
                **EventRSVPResponse.from_orm(rsvp).dict(),
                lead_name=rsvp.lead.name,
                lead_email=rsvp.lead.email,
                lead_phone=rsvp.lead.phone
            ))
        return results

    async def get_rsvps_by_lead(self, lead_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[EventRSVPResponse]:
        """Get all RSVPs for a lead"""
        rsvps = await self.repo.get_by_lead(lead_id, skip=skip, limit=limit)
        return [EventRSVPResponse.from_orm(rsvp) for rsvp in rsvps]

    async def get_volunteers_for_event(self, event_id: uuid.UUID) -> List[EventRSVPDetailResponse]:
        """Get all volunteers for an event"""
        rsvps = await self.repo.get_volunteers_for_event(event_id)
        
        results = []
        for rsvp in rsvps:
            results.append(EventRSVPDetailResponse(
                **EventRSVPResponse.from_orm(rsvp).dict(),
                lead_name=rsvp.lead.name,
                lead_email=rsvp.lead.email,
                lead_phone=rsvp.lead.phone
            ))
        return results

    async def get_attendees_for_event(self, event_id: uuid.UUID) -> List[EventRSVPDetailResponse]:
        """Get all attendees for an event"""
        rsvps = await self.repo.get_attendees_for_event(event_id)
        
        results = []
        for rsvp in rsvps:
            results.append(EventRSVPDetailResponse(
                **EventRSVPResponse.from_orm(rsvp).dict(),
                lead_name=rsvp.lead.name,
                lead_email=rsvp.lead.email,
                lead_phone=rsvp.lead.phone
            ))
        return results

    async def update_rsvp(self, rsvp_id: uuid.UUID, rsvp_data: dict) -> Optional[EventRSVPResponse]:
        """Update an RSVP"""
        rsvp = await self.repo.update(rsvp_id, rsvp_data)
        if not rsvp:
            return None
        return EventRSVPResponse.from_orm(rsvp)

    async def delete_rsvp(self, rsvp_id: uuid.UUID) -> bool:
        """Delete an RSVP"""
        return await self.repo.delete(rsvp_id)

    async def get_event_stats(self, event_id: uuid.UUID) -> dict:
        """Get RSVP statistics for an event"""
        attending_count = await self.repo.get_count_by_status(event_id, "attending")
        maybe_count = await self.repo.get_count_by_status(event_id, "maybe")
        not_attending_count = await self.repo.get_count_by_status(event_id, "not_attending")
        volunteer_count = await self.repo.get_volunteer_count(event_id)
        
        return {
            "event_id": event_id,
            "total_rsvps": attending_count + maybe_count + not_attending_count,
            "attending": attending_count,
            "maybe": maybe_count,
            "not_attending": not_attending_count,
            "volunteers": volunteer_count
        }
