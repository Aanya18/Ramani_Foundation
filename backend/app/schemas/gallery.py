from pydantic import BaseModel
from datetime import datetime
import uuid
from typing import Optional


class GalleryItemBase(BaseModel):
    title: str


class GalleryItemCreate(GalleryItemBase):
    event_id: Optional[uuid.UUID] = None


class GalleryItemResponse(GalleryItemBase):
    id: uuid.UUID
    image_url: str
    event_id: Optional[uuid.UUID] = None
    event_title: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
