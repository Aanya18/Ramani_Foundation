from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class ArticleBase(BaseModel):
    title: str
    content: str
    category: Optional[str] = None


class ArticleCreate(ArticleBase):
    pass


class ArticleResponse(ArticleBase):
    id: uuid.UUID
    image_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
