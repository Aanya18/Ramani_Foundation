from pydantic import BaseModel, EmailStr, Field


class ContactCreateRequest(BaseModel):
    name: str = Field(min_length=2, max_length=160)
    email: EmailStr
    subject: str | None = None
    message: str = Field(min_length=10)
    inquiry_type: str | None = None
    source_page: str | None = None


class VolunteerCreateRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=160)
    email: EmailStr
    phone: str | None = None
    city: str | None = None
    interest_area: str | None = None
    motivation: str | None = None
