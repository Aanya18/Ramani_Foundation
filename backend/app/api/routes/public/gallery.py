from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.api.deps import get_db
from app.schemas.gallery import GalleryItemResponse, GalleryItemDetailResponse
from app.services.gallery import GalleryService

router = APIRouter(prefix="/gallery", tags=["gallery"])


@router.get("/", response_model=List[GalleryItemResponse])
async def get_all_gallery(db: AsyncSession = Depends(get_db)):
    """Get all gallery items"""
    service = GalleryService(db)
    return await service.get_all_gallery_items()


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
