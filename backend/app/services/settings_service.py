import json

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.schemas.admin import AdminPublicContentSettings
from app.schemas.common import PublicMetric
from app.schemas.settings import PublicSettingsResponse
from app.db.models.crm import SiteSetting


SETTING_KEYS = [
    "organization_name",
    "donation_currency",
    "primary_phone",
    "primary_email",
    "hero_title",
    "hero_subtitle",
    "mission_title",
    "mission_description",
    "trust_items",
    "donation_presets",
    "trust_notes",
    "impact_stats",
]


def _load_settings(db: Session, group_key: str = "public_content") -> dict[str, object]:
    rows = db.execute(
        select(SiteSetting).where(SiteSetting.group_key == group_key)
    ).scalars().all()

    values: dict[str, object] = {}
    for row in rows:
        if row.value_type == "json":
            values[row.setting_key] = json.loads(row.value_json or "null")
        else:
            values[row.setting_key] = json.loads(row.value_json) if row.value_json and row.value_json.startswith('"') else row.value_json
    return values


def _save_setting(
    db: Session,
    key: str,
    value: object,
    value_type: str,
    group_key: str = "public_content",
) -> None:
    row = db.execute(
        select(SiteSetting).where(
            SiteSetting.group_key == group_key,
            SiteSetting.setting_key == key,
        )
    ).scalar_one_or_none()

    serialized = json.dumps(value)
    if row is None:
        row = SiteSetting(
            group_key=group_key,
            setting_key=key,
            value_json=serialized,
            value_type=value_type,
            is_public=True,
        )
        db.add(row)
    else:
        row.value_json = serialized
        row.value_type = value_type
        row.is_public = True


def get_public_settings(db: Session) -> PublicSettingsResponse:
    values = _load_settings(db)
    impact_rows = [
        PublicMetric(**item) for item in values.get("impact_stats", [])
    ]

    return PublicSettingsResponse(
        organization_name=str(values.get("organization_name", "Ramani Foundation")),
        donation_currency=str(values.get("donation_currency", "INR")),
        primary_phone=str(values.get("primary_phone", "")),
        primary_email=str(values.get("primary_email", "")),
        hero_title=str(values.get("hero_title", "")),
        hero_subtitle=str(values.get("hero_subtitle", "")),
        mission_title=str(values.get("mission_title", "")),
        mission_description=str(values.get("mission_description", "")),
        trust_items=list(values.get("trust_items", [])),
        donation_presets=list(values.get("donation_presets", [])),
        trust_notes=list(values.get("trust_notes", [])),
        impact_stats=impact_rows,
    )


def get_admin_public_settings(db: Session) -> AdminPublicContentSettings:
    public = get_public_settings(db)
    return AdminPublicContentSettings(**public.model_dump())


def update_admin_public_settings(
    db: Session, payload: AdminPublicContentSettings
) -> AdminPublicContentSettings:
    json_keys = {"trust_items", "donation_presets", "trust_notes", "impact_stats"}

    for key in SETTING_KEYS:
        value = getattr(payload, key)
        if key == "impact_stats":
            value = [item.model_dump() for item in value]
        _save_setting(db, key, value, "json" if key in json_keys else "string")

    db.commit()
    return get_admin_public_settings(db)
