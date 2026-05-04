from fastapi import Depends, UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import get_db, settings
from app.repository.gallery import GalleryRepository, GalleryImageRepository
from app.models import GalleryItem, GalleryImage
from app.schemas.gallery import GalleryItemResponse, GalleryItemDetailResponse, GalleryImageResponse
from app.services.image import ImageService
import uuid
from typing import List, Optional


class GalleryService:
    def __init__(self, db: AsyncSession = Depends(get_db)):
        self.db = db
        self.gallery_repo = GalleryRepository(db)
        self.image_repo = GalleryImageRepository(db)
        self.image_service = ImageService()

    async def get_all_gallery_items(self) -> List[GalleryItemResponse]:
        gallery_items = await self.gallery_repo.get_all()
        results = []
        for item in gallery_items:
            # Get first image URL - check images relationship first, then fallback to item's mega_file_id
            image_url = None
            if item.images and len(item.images) > 0:
                # Sort by order and get first image
                sorted_images = sorted(item.images, key=lambda img: (img.order, img.created_at))
                image_url = f"{settings.API_V1_STR}/public/images/{sorted_images[0].id}"
            elif item.mega_file_id:
                image_url = f"{settings.API_V1_STR}/public/images/{item.id}"
            
            results.append(GalleryItemResponse(
                id=item.id,
                title=item.title,
                description=item.description,
                event_id=item.event_id,
                project_id=item.project_id,
                image_url=image_url,
                created_at=item.created_at
            ))
        return results

    async def get_gallery_by_event(self, event_id: uuid.UUID) -> List[GalleryItemDetailResponse]:
        gallery_items = await self.gallery_repo.get_by_event(event_id)
        results = []
        for item in gallery_items:
            images = [
                GalleryImageResponse(
                    id=img.id,
                    mega_file_id=img.mega_file_id,
                    image_filename=img.image_filename,
                    content_type=img.content_type,
                    order=img.order,
                    image_url=f"{settings.API_V1_STR}/public/images/{img.id}",
                    created_at=img.created_at
                ) for img in item.images
            ] if item.images else []
            results.append(GalleryItemDetailResponse(
                id=item.id,
                title=item.title,
                description=item.description,
                event_id=item.event_id,
                project_id=item.project_id,
                event_title=item.event.title if item.event else None,
                project_name=item.project.name if item.project else None,
                image_url=f"{settings.API_V1_STR}/public/images/{item.id}" if item.images or item.mega_file_id else None,
                images=images,
                created_at=item.created_at
            ))
        return results

    async def get_gallery_by_project(self, project_id: uuid.UUID) -> List[GalleryItemDetailResponse]:
        gallery_items = await self.gallery_repo.get_by_project(project_id)
        results = []
        for item in gallery_items:
            images = [
                GalleryImageResponse(
                    id=img.id,
                    mega_file_id=img.mega_file_id,
                    image_filename=img.image_filename,
                    content_type=img.content_type,
                    order=img.order,
                    image_url=f"{settings.API_V1_STR}/public/images/{img.id}",
                    created_at=img.created_at
                ) for img in item.images
            ] if item.images else []
            results.append(GalleryItemDetailResponse(
                id=item.id,
                title=item.title,
                description=item.description,
                event_id=item.event_id,
                project_id=item.project_id,
                event_title=item.event.title if item.event else None,
                project_name=item.project.name if item.project else None,
                image_url=f"{settings.API_V1_STR}/public/images/{item.id}" if item.images or item.mega_file_id else None,
                images=images,
                created_at=item.created_at
            ))
        return results

    async def get_gallery_item(self, item_id: uuid.UUID) -> Optional[GalleryItemDetailResponse]:
        item = await self.gallery_repo.get_by_id(item_id)
        if not item:
            return None
        
        images = [
            GalleryImageResponse(
                id=img.id,
                mega_file_id=img.mega_file_id,
                image_filename=img.image_filename,
                content_type=img.content_type,
                order=img.order,
                image_url=f"{settings.API_V1_STR}/public/images/{img.id}",
                created_at=img.created_at
            ) for img in item.images
        ] if item.images else []
        return GalleryItemDetailResponse(
            id=item.id,
            title=item.title,
            description=item.description,
            event_id=item.event_id,
            project_id=item.project_id,
            event_title=item.event.title if item.event else None,
            project_name=item.project.name if item.project else None,
            image_url=f"{settings.API_V1_STR}/public/images/{item.id}" if item.images or item.mega_file_id else None,
            images=images,
            created_at=item.created_at
        )

    async def create_gallery_item(
        self, 
        title: str, 
        description: Optional[str] = None,
        event_id: Optional[uuid.UUID] = None,
        project_id: Optional[uuid.UUID] = None,
        image: Optional[UploadFile] = None,
    ) -> GalleryItemResponse:
        """Create a gallery item and optionally attach its first image."""

        mega_file_id = None
        content_type = None
        image_filename = None
        if image:
            if not image.filename:
                raise HTTPException(status_code=400, detail="Image is required")
            if image.content_type not in settings.ALLOWED_IMAGE_TYPES:
                raise HTTPException(status_code=400, detail="Invalid image type")

            mega_file_id = await self.image_service.upload_image(image)
            content_type = image.content_type
            image_filename = image.filename

        db_gallery = GalleryItem(
            title=title,
            mega_file_id=mega_file_id,
            content_type=content_type,
            image_filename=image_filename,
            description=description,
            event_id=event_id,
            project_id=project_id
        )
        created_item = await self.gallery_repo.create(db_gallery)

        if mega_file_id and image_filename and content_type:
            db_image = GalleryImage(
                gallery_item_id=created_item.id,
                mega_file_id=mega_file_id,
                image_filename=image_filename,
                content_type=content_type,
                order=0,
            )
            await self.image_repo.create(db_image)
        
        return GalleryItemResponse(
            id=created_item.id,
            title=created_item.title,
            description=created_item.description,
            event_id=created_item.event_id,
            project_id=created_item.project_id,
            created_at=created_item.created_at
        )

    async def add_image_to_gallery(
        self, 
        gallery_item_id: uuid.UUID, 
        image: UploadFile,
        order: int = 0
    ) -> GalleryImageResponse:
        """Add an image to a gallery item"""
        if not image.filename:
            raise HTTPException(status_code=400, detail="Image is required")

        if image.content_type not in settings.ALLOWED_IMAGE_TYPES:
            raise HTTPException(status_code=400, detail="Invalid image type")

        # Store image in Mega storage
        mega_file_id = await self.image_service.upload_image(image)

        db_image = GalleryImage(
            gallery_item_id=gallery_item_id,
            mega_file_id=mega_file_id,
            image_filename=image.filename,
            content_type=image.content_type,
            order=order
        )
        created_image = await self.image_repo.create(db_image)

        gallery_item = await self.gallery_repo.get_by_id(gallery_item_id)
        if gallery_item and order == 0:
            gallery_item.mega_file_id = mega_file_id
            gallery_item.content_type = image.content_type
            gallery_item.image_filename = image.filename
            await self.gallery_repo.update(gallery_item)
        
        return GalleryImageResponse(
            id=created_image.id,
            mega_file_id=created_image.mega_file_id,
            image_filename=created_image.image_filename,
            content_type=created_image.content_type,
            order=created_image.order,
            image_url=f"{settings.API_V1_STR}/public/images/{created_image.id}",
            created_at=created_image.created_at
        )

    async def add_multiple_images(
        self, 
        gallery_item_id: uuid.UUID,
        images: List[UploadFile]
    ) -> List[GalleryImageResponse]:
        """Add multiple images to a gallery item (appends after existing images)."""
        if not images:
            raise HTTPException(status_code=400, detail="At least one image is required")

        gallery_item = await self.gallery_repo.get_by_id(gallery_item_id)
        if not gallery_item:
            raise HTTPException(status_code=404, detail="Gallery item not found")

        existing = list(gallery_item.images or [])
        if existing:
            start_order = max((img.order for img in existing), default=-1) + 1
        else:
            start_order = 0

        results = []
        for offset, image in enumerate(images):
            result = await self.add_image_to_gallery(
                gallery_item_id, image, order=start_order + offset
            )
            results.append(result)
        return results

    async def update_gallery_item(
        self, 
        item_id: uuid.UUID, 
        title: Optional[str] = None,
        description: Optional[str] = None,
        event_id: Optional[uuid.UUID] = None,
        project_id: Optional[uuid.UUID] = None
    ) -> GalleryItemResponse:
        """Update gallery item metadata"""
        db_gallery = await self.gallery_repo.get_by_id(item_id)
        if not db_gallery:
            raise HTTPException(status_code=404, detail="Gallery item not found")

        if title:
            db_gallery.title = title
        if description is not None:
            db_gallery.description = description
        if event_id is not None:
            db_gallery.event_id = event_id
        if project_id is not None:
            db_gallery.project_id = project_id

        updated_item = await self.gallery_repo.update(db_gallery)

        return GalleryItemResponse(
            id=updated_item.id,
            title=updated_item.title,
            description=updated_item.description,
            event_id=updated_item.event_id,
            project_id=updated_item.project_id,
            created_at=updated_item.created_at
        )

    async def delete_image(self, image_id: uuid.UUID) -> bool:
        """Delete a single image from gallery"""
        db_image = await self.image_repo.get_by_id(image_id)
        if not db_image:
            return False

        if db_image.mega_file_id:
            await self.image_service.delete_image(db_image.mega_file_id)

        await self.image_repo.delete(db_image)
        return True

    async def delete_gallery_item(self, item_id: uuid.UUID) -> bool:
        """Delete entire gallery item with all images"""
        db_gallery = await self.gallery_repo.get_by_id(item_id)
        if not db_gallery:
            return False

        # Delete all associated images
        if db_gallery.images:
            for image in db_gallery.images:
                if image.mega_file_id:
                    await self.image_service.delete_image(image.mega_file_id)

        await self.gallery_repo.delete(db_gallery)
        return True
