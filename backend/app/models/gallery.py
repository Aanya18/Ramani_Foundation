import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, DateTime, Index, ForeignKey, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core import Base


class GalleryItem(Base):
    __tablename__ = "gallery"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String, nullable=False)
    mega_file_id = Column(String, nullable=True)
    content_type = Column(String, nullable=True)
    image_filename = Column(String, nullable=True)
    description = Column(String, nullable=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=True)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=True)
    order = Column(Integer, default=0)  # For ordering images within gallery item
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    project = relationship("Project", back_populates="gallery_items")
    event = relationship("Event", back_populates="gallery_items")
    images = relationship("GalleryImage", back_populates="gallery_item", cascade="all, delete-orphan")

    __table_args__ = (
        Index('idx_gallery_items_created_at', 'created_at'),
        Index('idx_gallery_items_project_id', 'project_id'),
        Index('idx_gallery_items_event_id', 'event_id'),
    )


class GalleryImage(Base):
    """Individual images within a gallery item (supports multiple images)"""
    __tablename__ = "gallery_images"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    gallery_item_id = Column(UUID(as_uuid=True), ForeignKey("gallery.id"), nullable=False)
    mega_file_id = Column(String, nullable=False)
    image_filename = Column(String, nullable=False)
    content_type = Column(String, nullable=False)
    order = Column(Integer, default=0)  # For ordering within the gallery item
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    gallery_item = relationship("GalleryItem", back_populates="images")

    __table_args__ = (
        Index('idx_gallery_images_gallery_item_id', 'gallery_item_id'),
        Index('idx_gallery_images_created_at', 'created_at'),
    )
