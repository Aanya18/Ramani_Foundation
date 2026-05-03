from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import func
from app.models import Event, EventRSVP
from app.core import cache, settings
from typing import List, Optional
import uuid


class EventRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    @cache.memoize(tag="events", expire=settings.DEFAULT_CACHE_EXPIRE_SECONDS)
    async def get_all(self) -> List[Event]:
        result = await self.db.execute(
            select(Event)
            .options(
                selectinload(Event.project),
                selectinload(Event.gallery_items),
                selectinload(Event.rsvps)
            )
            .order_by(Event.created_at.desc())
        )
        return result.scalars().all()

    async def get_upcoming(self) -> List[Event]:
        result = await self.db.execute(
            select(Event)
            .options(
                selectinload(Event.project),
                selectinload(Event.gallery_items),
                selectinload(Event.rsvps)
            )
            .where(Event.is_upcoming == True)
            .order_by(Event.date)
        )
        return result.scalars().all()

    async def get_by_id(self, event_id: str) -> Optional[Event]:
        result = await self.db.execute(
            select(Event)
            .options(
                selectinload(Event.project),
                selectinload(Event.gallery_items),
                selectinload(Event.rsvps)
            )
            .where(Event.id == event_id)
        )
        return result.scalars().first()

    async def get_by_project(self, project_id: uuid.UUID) -> List[Event]:
        result = await self.db.execute(
            select(Event)
            .options(
                selectinload(Event.gallery_items),
                selectinload(Event.rsvps)
            )
            .where(Event.project_id == project_id)
            .order_by(Event.date)
        )
        return result.scalars().all()

    async def create(self, event: Event) -> Event:
        self.db.add(event)
        await self.db.commit()
        await self.db.refresh(event)
        cache.invalidate_tag("events")
        return event

    async def update(self, event: Event) -> Event:
        await self.db.commit()
        await self.db.refresh(event)
        cache.invalidate_tag("events")
        return event

    async def delete(self, event: Event) -> None:
        await self.db.delete(event)
        await self.db.commit()
        cache.invalidate_tag("events")
