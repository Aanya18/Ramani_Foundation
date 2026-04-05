from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class LeadCreate(BaseModel):
    type: str  # volunteer or contact
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: Optional[str] = None


class LeadResponse(LeadCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
