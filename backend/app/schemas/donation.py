from pydantic import BaseModel, EmailStr
from datetime import datetime


class DonationBase(BaseModel):
    donor_name: str
    email: EmailStr
    amount: str


class DonationCreate(DonationBase):
    pass


class DonationResponse(DonationBase):
    id: int
    proof_image_url: str
    verified: bool
    created_at: datetime

    class Config:
        from_attributes = True
