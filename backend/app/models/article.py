import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import Column, String, Text, DateTime, Index
from sqlalchemy.sql import func
from app.core import Base


class Article(Base):
    __tablename__ = "articles"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String, nullable=True)
    mega_file_id = Column(String, nullable=True)
    content_type = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index('idx_articles_created_at', 'created_at'),
    )
