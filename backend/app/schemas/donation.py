from pydantic import BaseModel, EmailStr, Field


class DonationInitiateRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=160)
    email: EmailStr
    phone: str | None = None
    amount_paise: int = Field(gt=0)
    frequency: str = "one_time"
    campaign_slug: str | None = None
    donor_note: str | None = None
    anonymous: bool = False


class DonationInitiateResponse(BaseModel):
    donation_id: str
    reference: str
    status: str
    checkout_provider: str


class DonationStatusResponse(BaseModel):
    reference: str
    status: str
    amount_paise: int
    currency: str = "INR"
