from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.api.deps import get_db
from app.schemas.gallery import GalleryItemResponse, GalleryItemDetailResponse, GalleryImageResponse
from app.services.gallery import GalleryService
from app.core import settings

router = APIRouter(prefix="/gallery", tags=["gallery"])


@router.get("/", response_model=List[GalleryItemDetailResponse])
async def get_all_gallery(db: AsyncSession = Depends(get_db)):
    """Get all gallery items with all images"""
    service = GalleryService(db)
    gallery_items = await service.gallery_repo.get_all()
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
            ) for img in sorted(item.images, key=lambda x: (x.order, x.created_at))
        ] if item.images else []
        
        # Get first image URL
        image_url = None
        if images:
            image_url = images[0].image_url
        elif item.mega_file_id:
            image_url = f"{settings.API_V1_STR}/public/images/{item.id}"
        
        results.append(GalleryItemDetailResponse(
            id=item.id,
            title=item.title,
            description=item.description,
            event_id=item.event_id,
            project_id=item.project_id,
            event_title=item.event.title if item.event else None,
            project_name=item.project.name if item.project else None,
            image_url=image_url,
            images=images,
            created_at=item.created_at
        ))
    return results


@router.get("/event/{event_id}", response_model=List[GalleryItemDetailResponse])
async def get_gallery_by_event(
    event_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get gallery items for a specific event"""
    service = GalleryService(db)
    return await service.get_gallery_by_event(event_id)


@router.get("/project/{project_id}", response_model=List[GalleryItemDetailResponse])
async def get_gallery_by_project(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get gallery items for a specific project"""
    service = GalleryService(db)
    return await service.get_gallery_by_project(project_id)


@router.get("/{item_id}", response_model=GalleryItemDetailResponse)
async def get_gallery_item(
    item_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific gallery item with all images"""
    service = GalleryService(db)
    item = await service.get_gallery_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return item
