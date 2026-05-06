from pydantic import BaseModel
from datetime import datetime
import uuid
from typing import Optional, List


class GalleryImageBase(BaseModel):
    mega_file_id: str
    image_filename: str
    content_type: str
    order: Optional[int] = 0


class GalleryImageCreate(GalleryImageBase):
    pass


class GalleryImageResponse(GalleryImageBase):
    id: uuid.UUID
    image_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class GalleryItemBase(BaseModel):
    title: str
    description: Optional[str] = None
    event_id: Optional[uuid.UUID] = None
    project_id: Optional[uuid.UUID] = None


class GalleryItemCreate(GalleryItemBase):
    pass


class GalleryItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_id: Optional[uuid.UUID] = None
    project_id: Optional[uuid.UUID] = None


class GalleryItemResponse(GalleryItemBase):
    id: uuid.UUID
    image_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class GalleryItemDetailResponse(GalleryItemResponse):
    """Gallery item with all images"""
    images: List[GalleryImageResponse] = []
    event_title: Optional[str] = None
    project_name: Optional[str] = None

    class Config:
        from_attributes = True
