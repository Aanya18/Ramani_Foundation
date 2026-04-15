from fastapi import Depends, UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import get_db, settings
from app.repository import GalleryRepository
from app.models import GalleryItem
from app.schemas import GalleryItemResponse
from app.services.image import ImageService
import uuid
from typing import List

class GalleryService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.gallery_repo = GalleryRepository(db)
        self.image_service = ImageService()

    async def get_all_gallery_items(self) -> List[GalleryItemResponse]:
        gallery_items = await self.gallery_repo.get_all()
        return [
            GalleryItemResponse(
                id=item.id,
                title=item.title,
                image_url=f"{settings.API_V1_STR}/public/images/{item.id}",
                event_id=item.event_id,
                event_title=item.event.title if item.event else None,
                created_at=item.created_at
            ) for item in gallery_items
        ]

    async def create_gallery_item(self, title: str, image: UploadFile, event_id: str | None = None) -> GalleryItemResponse:
        if not image.filename:
            raise HTTPException(status_code=400, detail="Image is required")

        if image.content_type not in settings.ALLOWED_IMAGE_TYPES:
            raise HTTPException(status_code=400, detail="Invalid image type")

        # Upload to Mega
        mega_file_id = await self.image_service.upload_image(image)

        db_gallery = GalleryItem(
            title=title,
            mega_file_id=mega_file_id,
            content_type=image.content_type,
            event_id=event_id if event_id else None
        )
        created_item = await self.gallery_repo.create(db_gallery)
        
        # Fetch again to get the relationship loaded if we needed it, but we can just return what we have

        return GalleryItemResponse(
            id=created_item.id,
            title=created_item.title,
            image_url=f"{settings.API_V1_STR}/public/images/{created_item.id}",
            event_id=created_item.event_id,
            created_at=created_item.created_at
        )

    async def update_gallery_item(self, item_id: str, title: str, image: UploadFile | None, event_id: str | None = None) -> GalleryItemResponse:
        db_gallery = await self.gallery_repo.get_by_id(item_id)
        if not db_gallery:
            raise HTTPException(status_code=404, detail="Gallery item not found")

        if image and image.filename:
            if image.content_type not in settings.ALLOWED_IMAGE_TYPES:
                raise HTTPException(status_code=400, detail="Invalid image type")

            new_mega_file_id = await self.image_service.upload_image(image)

            if db_gallery.mega_file_id:
                await self.image_service.delete_image(db_gallery.mega_file_id)

            db_gallery.mega_file_id = new_mega_file_id
            db_gallery.content_type = image.content_type

        db_gallery.title = title
        if event_id is not None:
            db_gallery.event_id = event_id if event_id else None

        updated_item = await self.gallery_repo.update(db_gallery)

        return GalleryItemResponse(
            id=updated_item.id,
            title=updated_item.title,
            image_url=f"{settings.API_V1_STR}/public/images/{updated_item.id}",
            event_id=updated_item.event_id,
            event_title=updated_item.event.title if updated_item.event else None,
            created_at=updated_item.created_at
        )

    async def delete_gallery_item(self, item_id: str) -> None:
        db_gallery = await self.gallery_repo.get_by_id(item_id)
        if not db_gallery:
            raise HTTPException(status_code=404, detail="Gallery item not found")

        if db_gallery.mega_file_id:
            await self.image_service.delete_image(db_gallery.mega_file_id)

        await self.gallery_repo.delete(db_gallery)
