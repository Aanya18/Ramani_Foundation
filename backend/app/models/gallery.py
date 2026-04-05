import uuid
from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from app.core import Base, GUID


class GalleryItem(Base):
    __tablename__ = "gallery_items"
    id = Column(GUID, primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
