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
                created_at=item.created_at
            ) for item in gallery_items
        ]

    async def create_gallery_item(self, title: str, image: UploadFile) -> GalleryItemResponse:
        if not image.filename:
            raise HTTPException(status_code=400, detail="Image is required")

        if image.content_type not in settings.ALLOWED_IMAGE_TYPES:
            raise HTTPException(status_code=400, detail="Invalid image type")

        # Upload to Mega
        mega_file_id = await self.image_service.upload_image(image)

        db_gallery = GalleryItem(
            title=title,
            mega_file_id=mega_file_id,
            content_type=image.content_type
        )
        created_item = await self.gallery_repo.create(db_gallery)
        
        return GalleryItemResponse(
            id=created_item.id,
            title=created_item.title,
            image_url=f"{settings.API_V1_STR}/public/images/{created_item.id}",
            created_at=created_item.created_at
        )
