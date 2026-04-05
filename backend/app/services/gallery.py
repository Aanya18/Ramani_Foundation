from fastapi import Depends, UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.repository.gallery import GalleryRepository
from app.models.gallery import GalleryItem
from app.schemas.gallery import GalleryItemResponse
from app.core.config import settings
from app.utils.utils import save_upload_file
import uuid
import os
from typing import List

class GalleryService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.gallery_repo = GalleryRepository(db)

    async def get_all_gallery_items(self) -> List[GalleryItemResponse]:
        gallery_items = await self.gallery_repo.get_all()
        return [GalleryItemResponse.from_orm(item) for item in gallery_items]

    async def create_gallery_item(self, title: str, image: UploadFile) -> GalleryItemResponse:
        if not image.filename:
            raise HTTPException(status_code=400, detail="Image is required")

        if image.content_type not in settings.ALLOWED_IMAGE_TYPES:
            raise HTTPException(status_code=400, detail="Invalid image type")

        ext = os.path.splitext(image.filename)[1]
        filename = f"{uuid.uuid4()}{ext}"
        filepath = os.path.join(settings.UPLOADS_DIR, filename)
        await save_upload_file(image, filepath)

        db_gallery = GalleryItem(
            title=title,
            image_url=f"/{settings.UPLOADS_DIR}/{filename}"
        )
        created_item = await self.gallery_repo.create(db_gallery)
        return GalleryItemResponse.from_orm(created_item)
