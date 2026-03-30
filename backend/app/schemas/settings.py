from pydantic import BaseModel

from app.schemas.common import PublicMetric


class PublicSettingsResponse(BaseModel):
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
