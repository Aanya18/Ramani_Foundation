from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.testimonial import Testimonial
from app.core import cache, settings
from typing import List

class TestimonialRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    @cache.memoize(tag="testimonials", expire=settings.DEFAULT_CACHE_EXPIRE_SECONDS)
    async def get_all(self) -> List[Testimonial]:
        result = await self.db.execute(select(Testimonial).order_by(Testimonial.created_at.desc()))
        return result.scalars().all()

    async def get_by_id(self, testimonial_id: str) -> Testimonial | None:
        result = await self.db.execute(select(Testimonial).where(Testimonial.id == testimonial_id))
        return result.scalars().first()

    async def create(self, testimonial: Testimonial) -> Testimonial:
        self.db.add(testimonial)
        await self.db.commit()
        await self.db.refresh(testimonial)
        cache.invalidate_tag("testimonials")
        return testimonial

    async def update(self, testimonial: Testimonial) -> Testimonial:
        await self.db.commit()
        await self.db.refresh(testimonial)
        cache.invalidate_tag("testimonials")
        return testimonial

    async def delete(self, testimonial: Testimonial) -> None:
        await self.db.delete(testimonial)
        await self.db.commit()
        cache.invalidate_tag("testimonials")
