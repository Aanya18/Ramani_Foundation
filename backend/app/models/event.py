import uuid
from sqlalchemy import Column, String, Text, DateTime, Index
from sqlalchemy.sql import func
from app.core import Base, GUID


class Event(Base):
    __tablename__ = "events"
    id = Column(GUID, primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    date = Column(String, nullable=False)
    location = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index('idx_events_created_at', 'created_at'),
    )
