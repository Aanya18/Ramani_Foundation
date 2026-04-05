import uuid
from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from app.core import Base, GUID


class AdminUser(Base):
    __tablename__ = "admin_users"
    id = Column(GUID, primary_key=True, default=uuid.uuid4, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
