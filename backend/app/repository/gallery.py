from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models import GalleryItem
from typing import List

class GalleryRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> List[GalleryItem]:
        result = await self.db.execute(select(GalleryItem).order_by(GalleryItem.created_at.desc()))
        return result.scalars().all()

    async def create(self, gallery_item: GalleryItem) -> GalleryItem:
        self.db.add(gallery_item)
        await self.db.commit()
        await self.db.refresh(gallery_item)
        return gallery_item
