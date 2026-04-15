from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models import GalleryItem
from app.core import cache, settings
from typing import List

class GalleryRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    @cache.memoize(tag="gallery", expire=settings.DEFAULT_CACHE_EXPIRE_SECONDS)
    async def get_all(self) -> List[GalleryItem]:
        result = await self.db.execute(
            select(GalleryItem).options(selectinload(GalleryItem.event)).order_by(GalleryItem.created_at.desc())
        )
        return result.scalars().all()

    async def get_by_id(self, item_id: str) -> GalleryItem | None:
        result = await self.db.execute(
            select(GalleryItem).options(selectinload(GalleryItem.event)).where(GalleryItem.id == item_id)
        )
        return result.scalars().first()

    async def create(self, gallery_item: GalleryItem) -> GalleryItem:
        self.db.add(gallery_item)
        await self.db.commit()
        await self.db.refresh(gallery_item)
        cache.invalidate_tag("gallery")
        return gallery_item

    async def update(self, gallery_item: GalleryItem) -> GalleryItem:
        await self.db.commit()
        await self.db.refresh(gallery_item)
        cache.invalidate_tag("gallery")
        return gallery_item

    async def delete(self, gallery_item: GalleryItem) -> None:
        await self.db.delete(gallery_item)
        await self.db.commit()
        cache.invalidate_tag("gallery")
