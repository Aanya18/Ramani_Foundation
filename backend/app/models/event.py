import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, Text, DateTime, Index, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core import Base


class Event(Base):
    __tablename__ = "events"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    date = Column(String, nullable=False)
    location = Column(String, nullable=False)
    mega_file_id = Column(String, nullable=True)
    content_type = Column(String, nullable=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=True)
    is_upcoming = Column(Boolean, default=True)  # To track if event is upcoming
    accept_rsvp = Column(Boolean, default=True)  # Allow RSVP for this event
    accept_volunteers = Column(Boolean, default=True)  # Allow volunteer signups
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    project = relationship("Project", back_populates="events")
    gallery_items = relationship("GalleryItem", back_populates="event", cascade="all, delete-orphan")
    rsvps = relationship("EventRSVP", back_populates="event", cascade="all, delete-orphan")

    __table_args__ = (
        Index('idx_events_created_at', 'created_at'),
        Index('idx_events_is_upcoming', 'is_upcoming'),
        Index('idx_events_project_id', 'project_id'),
    )
