from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class TestimonialBase(BaseModel):
    name: str
    role: Optional[str] = None
    content: str
    rating: int = 5


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialResponse(TestimonialBase):
    id: uuid.UUID
    image_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
