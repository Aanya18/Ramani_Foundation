from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import func
from app.models import GalleryItem, GalleryImage, Event
from app.core import cache, settings
from typing import List, Optional
import uuid


class GalleryRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    @cache.memoize(tag="gallery", expire=settings.DEFAULT_CACHE_EXPIRE_SECONDS)
    async def get_all(self) -> List[GalleryItem]:
        result = await self.db.execute(
            select(GalleryItem)
            .options(
                selectinload(GalleryItem.project),
                selectinload(GalleryItem.images)
            )
            .order_by(GalleryItem.created_at.desc())
        )
        return result.scalars().all()

    async def get_by_id(self, item_id: str) -> Optional[GalleryItem]:
        result = await self.db.execute(
            select(GalleryItem)
            .options(
                selectinload(GalleryItem.event),
                selectinload(GalleryItem.project),
                selectinload(GalleryItem.images)
            )
            .where(GalleryItem.id == item_id)
        )
        return result.scalars().first()

    async def get_by_event(self, event_id: uuid.UUID) -> List[GalleryItem]:
        result = await self.db.execute(
            select(GalleryItem)
            .options(
                selectinload(GalleryItem.images),
                selectinload(GalleryItem.project)
            )
            .where(GalleryItem.event_id == event_id)
            .order_by(GalleryItem.created_at.desc())
        )
        return result.scalars().all()

    async def get_by_project(self, project_id: uuid.UUID) -> List[GalleryItem]:
        result = await self.db.execute(
            select(GalleryItem)
            .options(
                selectinload(GalleryItem.images),
                selectinload(GalleryItem.event)
            )
            .where(GalleryItem.project_id == project_id)
            .order_by(GalleryItem.created_at.desc())
        )
        return result.scalars().all()

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

    async def get_count(self) -> int:
        result = await self.db.execute(select(func.count(GalleryItem.id)))
        return result.scalar()


class GalleryImageRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, image: GalleryImage) -> GalleryImage:
        self.db.add(image)
        await self.db.commit()
        await self.db.refresh(image)
        cache.invalidate_tag("gallery")
        return image

    async def get_by_id(self, image_id: uuid.UUID) -> Optional[GalleryImage]:
        result = await self.db.execute(
            select(GalleryImage).where(GalleryImage.id == image_id)
        )
        return result.scalars().first()

    async def get_by_gallery_item(self, gallery_item_id: uuid.UUID) -> List[GalleryImage]:
        result = await self.db.execute(
            select(GalleryImage)
            .where(GalleryImage.gallery_item_id == gallery_item_id)
            .order_by(GalleryImage.order)
        )
        return result.scalars().all()

    async def delete(self, image: GalleryImage) -> None:
        await self.db.delete(image)
        await self.db.commit()
        cache.invalidate_tag("gallery")
