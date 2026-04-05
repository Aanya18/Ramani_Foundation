from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid


class LeadCreate(BaseModel):
    type: str  # volunteer or contact
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: Optional[str] = None


class LeadResponse(LeadCreate):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True
