import uuid
from sqlalchemy import Column, String, Text, DateTime, Index
from sqlalchemy.sql import func
from app.core import Base, GUID


class Lead(Base):
    __tablename__ = "leads"
    id = Column(GUID, primary_key=True, default=uuid.uuid4, index=True)
    type = Column(String, nullable=False)  # "volunteer" or "contact"
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index('idx_leads_created_at', 'created_at'),
        Index('idx_leads_type', 'type'),
        Index('idx_leads_email', 'email'),
    )
