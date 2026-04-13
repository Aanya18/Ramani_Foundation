import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, DateTime, Index
from sqlalchemy.sql import func
from app.core import Base


class GalleryItem(Base):
    __tablename__ = "gallery"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

    title = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index('idx_gallery_items_created_at', 'created_at'),
    )
