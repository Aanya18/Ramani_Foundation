from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models import Event
from app.core import cache, settings
from typing import List

class EventRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    @cache.memoize(tag="events", expire=settings.DEFAULT_CACHE_EXPIRE_SECONDS)
    async def get_all(self) -> List[Event]:
        result = await self.db.execute(select(Event).order_by(Event.created_at.desc()))
        return result.scalars().all()

    async def create(self, event: Event) -> Event:
        self.db.add(event)
        await self.db.commit()
        await self.db.refresh(event)
        cache.invalidate_tag("events")
        return event
