from datetime import datetime

from pydantic import BaseModel

from app.schemas.common import PublicMetric


class AdminProgramBase(BaseModel):
    title: str
    slug: str
    excerpt: str
    focus_area: str
    beneficiary_count: int
    location_text: str | None = None
    status: str = "published"
    is_featured: bool = False


class AdminProgramResponse(AdminProgramBase):
    id: str
    updated_at: datetime


class AdminBlogBase(BaseModel):
    title: str
    slug: str
    category: str
    excerpt: str
    content: str
    status: str = "published"
    is_featured: bool = False


class AdminBlogResponse(AdminBlogBase):
    id: str
    updated_at: datetime


class AdminEventBase(BaseModel):
    title: str
    slug: str
    excerpt: str
    event_type: str
    city: str | None = None
    venue: str | None = None
    start_at: str | None = None
    status: str = "upcoming"
    is_featured: bool = False


class AdminEventResponse(AdminEventBase):
    id: str
    updated_at: datetime


class AdminStoryBase(BaseModel):
    story_title: str
    slug: str
    person_name: str
    role_label: str
    quote: str
    summary: str
    status: str = "published"
    is_featured: bool = False


class AdminStoryResponse(AdminStoryBase):
    id: str
    updated_at: datetime


class AdminPublicContentSettings(BaseModel):
    organization_name: str
    donation_currency: str
    primary_phone: str
    primary_email: str
    hero_title: str
    hero_subtitle: str
    mission_title: str
    mission_description: str
    trust_items: list[str]
    donation_presets: list[int]
    trust_notes: list[str]
    impact_stats: list[PublicMetric]


class AdminDonationRow(BaseModel):
    id: str
    donor_name: str
    donor_email: str
    amount_display: str
    frequency: str
    status: str
    created_at: datetime


class AdminDonorRow(BaseModel):
    id: str
    full_name: str
    email: str | None
    phone: str | None
    status: str
    created_at: datetime


class AdminVolunteerRow(BaseModel):
    id: str
    full_name: str
    email: str
    phone: str | None
    city: str | None
    interest_area: str | None
    status: str
    created_at: datetime


class AdminContactRow(BaseModel):
    id: str
    name: str
    email: str
    subject: str | None
    inquiry_type: str | None
    status: str
    created_at: datetime
