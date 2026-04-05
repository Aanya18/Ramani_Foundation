from pydantic import BaseModel
from datetime import datetime
import uuid


class GalleryItemBase(BaseModel):
    title: str


class GalleryItemCreate(GalleryItemBase):
    pass


class GalleryItemResponse(GalleryItemBase):
    id: uuid.UUID
    image_url: str
    created_at: datetime

    class Config:
        from_attributes = True
