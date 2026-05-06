import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, Text, DateTime, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core import Base


class Project(Base):
    __tablename__ = "projects"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=False)
    status = Column(String, default="active")  # active, completed, on_hold
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    events = relationship("Event", back_populates="project", cascade="all, delete-orphan")
    gallery_items = relationship("GalleryItem", back_populates="project", cascade="all, delete-orphan")

    __table_args__ = (
        Index('idx_projects_created_at', 'created_at'),
        Index('idx_projects_status', 'status'),
    )
