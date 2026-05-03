from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid


class ProjectBase(BaseModel):
    name: str
    description: str
    status: Optional[str] = "active"


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None


class ProjectResponse(ProjectBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ProjectDetailResponse(ProjectResponse):
    """Project with events and gallery items"""
    events_count: int = 0
    gallery_items_count: int = 0

    class Config:
        from_attributes = True
