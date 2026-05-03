from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.api.deps import get_current_user, get_db
from app.models import AdminUser
from app.schemas.gallery import GalleryItemResponse, GalleryItemDetailResponse, GalleryImageResponse
from app.services.gallery import GalleryService

router = APIRouter(prefix="/gallery", tags=["admin-gallery"], dependencies=[Depends(get_current_user)])


@router.get("/", response_model=List[GalleryItemResponse])
async def get_all_gallery(
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Get all gallery items (admin only)"""
    service = GalleryService(db)
    return await service.get_all_gallery_items()


@router.get("/event/{event_id}", response_model=List[GalleryItemDetailResponse])
async def get_gallery_by_event(
    event_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Get gallery items for a specific event (admin only)"""
    service = GalleryService(db)
    return await service.get_gallery_by_event(event_id)


@router.get("/project/{project_id}", response_model=List[GalleryItemDetailResponse])
async def get_gallery_by_project(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Get gallery items for a specific project (admin only)"""
    service = GalleryService(db)
    return await service.get_gallery_by_project(project_id)


@router.get("/{item_id}", response_model=GalleryItemDetailResponse)
async def get_gallery_item(
    item_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Get gallery item with all images (admin only)"""
    service = GalleryService(db)
    item = await service.get_gallery_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return item


@router.post("/", response_model=GalleryItemResponse, status_code=status.HTTP_201_CREATED)
async def create_gallery_item(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    event_id: Optional[str] = Form(None),
    project_id: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Create a new gallery item (admin only)"""
    service = GalleryService(db)
    
    event_uuid = None
    if event_id:
        try:
            event_uuid = uuid.UUID(event_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid event_id format")
    
    project_uuid = None
    if project_id:
        try:
            project_uuid = uuid.UUID(project_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid project_id format")
    
    return await service.create_gallery_item(
        title=title,
        description=description,
        event_id=event_uuid,
        project_id=project_uuid,
        image=image,
    )


@router.put("/{item_id}", response_model=GalleryItemResponse)
async def update_gallery_item(
    item_id: uuid.UUID,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    event_id: Optional[str] = Form(None),
    project_id: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Update gallery item metadata (admin only)"""
    service = GalleryService(db)
    
    event_uuid = None
    if event_id:
        try:
            event_uuid = uuid.UUID(event_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid event_id format")
    
    project_uuid = None
    if project_id:
        try:
            project_uuid = uuid.UUID(project_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid project_id format")
    
    return await service.update_gallery_item(
        item_id=item_id,
        title=title,
        description=description,
        event_id=event_uuid,
        project_id=project_uuid
    )


@router.post("/{item_id}/images", response_model=GalleryImageResponse, status_code=status.HTTP_201_CREATED)
async def add_image_to_gallery(
    item_id: uuid.UUID,
    image: UploadFile = File(...),
    order: int = Form(0),
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Add a single image to gallery item (admin only)"""
    service = GalleryService(db)
    return await service.add_image_to_gallery(item_id, image, order=order)


@router.post("/{item_id}/images/bulk", response_model=List[GalleryImageResponse], status_code=status.HTTP_201_CREATED)
async def add_multiple_images(
    item_id: uuid.UUID,
    images: List[UploadFile] = File(...),
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Add multiple images to gallery item (admin only)"""
    service = GalleryService(db)
    return await service.add_multiple_images(item_id, images)


@router.delete("/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_image(
    image_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Delete a single image from gallery (admin only)"""
    service = GalleryService(db)
    success = await service.delete_image(image_id)
    if not success:
        raise HTTPException(status_code=404, detail="Image not found")


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_gallery_item(
    item_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: AdminUser = Depends(get_current_user)
):
    """Delete entire gallery item with all images (admin only)"""
    service = GalleryService(db)
    success = await service.delete_gallery_item(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Gallery item not found")
