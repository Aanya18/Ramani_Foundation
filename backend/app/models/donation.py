import uuid
from sqlalchemy import Column, String, DateTime, Boolean, Index
from sqlalchemy.sql import func
from app.core import Base, GUID


class Donation(Base):
    __tablename__ = "donations"
    id = Column(GUID, primary_key=True, default=uuid.uuid4, index=True)
    donor_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    amount = Column(String, nullable=False)
    proof_image_url = Column(String, nullable=False)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index('idx_donations_created_at', 'created_at'),
        Index('idx_donations_email', 'email'),
    )
