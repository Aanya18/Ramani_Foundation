from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import func
from app.models import Lead, EventRSVP
from app.core import cache, settings
from typing import List, Optional
import uuid


class LeadRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    @cache.memoize(tag="leads", expire=settings.DEFAULT_CACHE_EXPIRE_SECONDS)
    async def get_all(self) -> List[Lead]:
        result = await self.db.execute(
            select(Lead)
            .options(selectinload(Lead.rsvps))
            .order_by(Lead.created_at.desc())
        )
        return result.scalars().all()

    async def get_by_id(self, lead_id: uuid.UUID) -> Optional[Lead]:
        result = await self.db.execute(
            select(Lead)
            .options(selectinload(Lead.rsvps))
            .where(Lead.id == lead_id)
        )
        return result.scalars().first()

    async def get_by_email(self, email: str) -> Optional[Lead]:
        result = await self.db.execute(
            select(Lead)
            .where(Lead.email == email)
        )
        return result.scalars().first()

    async def get_by_type(self, lead_type: str, skip: int = 0, limit: int = 100) -> List[Lead]:
        result = await self.db.execute(
            select(Lead)
            .where(Lead.type == lead_type)
            .order_by(Lead.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def get_active(self, skip: int = 0, limit: int = 100) -> List[Lead]:
        result = await self.db.execute(
            select(Lead)
            .where(Lead.is_active == True)
            .order_by(Lead.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

    async def create(self, lead: Lead) -> Lead:
        self.db.add(lead)
        await self.db.commit()
        await self.db.refresh(lead)
        cache.invalidate_tag("leads")
        return lead

    async def update(self, lead: Lead) -> Lead:
        await self.db.commit()
        await self.db.refresh(lead)
        cache.invalidate_tag("leads")
        return lead

    async def delete(self, lead: Lead) -> None:
        await self.db.delete(lead)
        await self.db.commit()
        cache.invalidate_tag("leads")

    async def get_count(self) -> int:
        result = await self.db.execute(select(func.count(Lead.id)))
        return result.scalar()
