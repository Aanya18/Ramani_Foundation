import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, Text, DateTime, Index, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core import Base


class Lead(Base):
    __tablename__ = "leads"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    type = Column(String, nullable=False)  # "contact", "volunteer", "donation_inquiry"
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    message = Column(Text, nullable=True)
    source = Column(String, nullable=True)  # "contact_form", "event_rsvp", "volunteer_form"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    rsvps = relationship("EventRSVP", back_populates="lead")

    __table_args__ = (
        Index('idx_leads_created_at', 'created_at'),
        Index('idx_leads_type', 'type'),
        Index('idx_leads_email', 'email'),
        Index('idx_leads_is_active', 'is_active'),
    )


class EventRSVP(Base):
    """Track RSVPs and volunteers for events"""
    __tablename__ = "event_rsvps"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    event_id = Column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=False)
    lead_id = Column(UUID(as_uuid=True), ForeignKey("leads.id"), nullable=False)
    rsvp_status = Column(String, nullable=False)  # "attending", "maybe", "not_attending"
    is_volunteer = Column(Boolean, default=False)
    volunteer_role = Column(String, nullable=True)  # Role if volunteering
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    event = relationship("Event", back_populates="rsvps")
    lead = relationship("Lead", back_populates="rsvps")

    __table_args__ = (
        Index('idx_event_rsvps_event_id', 'event_id'),
        Index('idx_event_rsvps_lead_id', 'lead_id'),
        Index('idx_event_rsvps_status', 'rsvp_status'),
        Index('idx_event_rsvps_is_volunteer', 'is_volunteer'),
    )
