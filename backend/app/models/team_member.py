import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, Text, DateTime, Index
from sqlalchemy.sql import func
from app.core import Base


class TeamMember(Base):
    __tablename__ = "team_members"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    bio = Column(Text, nullable=True)
    mega_file_id = Column(String, nullable=True)
    content_type = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index('idx_team_members_created_at', 'created_at'),
    )
