from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid


class TeamMemberBase(BaseModel):
    name: str
    role: str
    bio: Optional[str] = None


class TeamMemberCreate(TeamMemberBase):
    pass


class TeamMemberResponse(TeamMemberBase):
    id: uuid.UUID
    image_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
