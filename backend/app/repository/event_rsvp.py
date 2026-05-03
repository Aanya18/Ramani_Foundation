from sqlalchemy.orm import Session
from app.models import EventRSVP, Event, Lead
from app.schemas.event_rsvp import EventRSVPCreate
import uuid
from typing import List, Optional
from datetime import datetime


class EventRSVPRepository:
    def __init__(self, db: Session):
        self.db = db

    async def create(self, rsvp_data: EventRSVPCreate) -> EventRSVP:
        db_rsvp = EventRSVP(**rsvp_data.dict())
        self.db.add(db_rsvp)
        self.db.commit()
        self.db.refresh(db_rsvp)
        return db_rsvp

    async def get_by_id(self, rsvp_id: uuid.UUID) -> Optional[EventRSVP]:
        return self.db.query(EventRSVP).filter(EventRSVP.id == rsvp_id).first()

    async def get_by_event_and_lead(self, event_id: uuid.UUID, lead_id: uuid.UUID) -> Optional[EventRSVP]:
        return self.db.query(EventRSVP).filter(
            EventRSVP.event_id == event_id,
            EventRSVP.lead_id == lead_id
        ).first()

    async def get_by_event(self, event_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[EventRSVP]:
        return self.db.query(EventRSVP).filter(
            EventRSVP.event_id == event_id
        ).offset(skip).limit(limit).all()

    async def get_by_lead(self, lead_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[EventRSVP]:
        return self.db.query(EventRSVP).filter(
            EventRSVP.lead_id == lead_id
        ).offset(skip).limit(limit).all()

    async def get_volunteers_for_event(self, event_id: uuid.UUID) -> List[EventRSVP]:
        return self.db.query(EventRSVP).filter(
            EventRSVP.event_id == event_id,
            EventRSVP.is_volunteer == True
        ).all()

    async def get_attendees_for_event(self, event_id: uuid.UUID) -> List[EventRSVP]:
        return self.db.query(EventRSVP).filter(
            EventRSVP.event_id == event_id,
            EventRSVP.rsvp_status == "attending"
        ).all()

    async def update(self, rsvp_id: uuid.UUID, rsvp_data: dict) -> Optional[EventRSVP]:
        db_rsvp = await self.get_by_id(rsvp_id)
        if not db_rsvp:
            return None
        
        for field, value in rsvp_data.items():
            if value is not None:
                setattr(db_rsvp, field, value)
        
        db_rsvp.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(db_rsvp)
        return db_rsvp

    async def delete(self, rsvp_id: uuid.UUID) -> bool:
        db_rsvp = await self.get_by_id(rsvp_id)
        if not db_rsvp:
            return False
        
        self.db.delete(db_rsvp)
        self.db.commit()
        return True

    async def get_count_by_status(self, event_id: uuid.UUID, status: str) -> int:
        return self.db.query(EventRSVP).filter(
            EventRSVP.event_id == event_id,
            EventRSVP.rsvp_status == status
        ).count()

    async def get_volunteer_count(self, event_id: uuid.UUID) -> int:
        return self.db.query(EventRSVP).filter(
            EventRSVP.event_id == event_id,
            EventRSVP.is_volunteer == True
        ).count()
