import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, DateTime, Index, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core import Base


class GalleryItem(Base):
    __tablename__ = "gallery"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

    title = Column(String, nullable=False)
    mega_file_id = Column(String, nullable=False)
    content_type = Column(String, nullable=False)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    event = relationship("Event", back_populates="gallery_items")

    __table_args__ = (
        Index('idx_gallery_items_created_at', 'created_at'),
    )
