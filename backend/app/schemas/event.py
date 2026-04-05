from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class EventBase(BaseModel):
    title: str
    description: str
    date: str
    location: str


class EventCreate(EventBase):
    pass


class EventResponse(EventBase):
    id: uuid.UUID
    image_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
