import json
from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.models.auth import Admin, Permission, Role
from app.db.models.content import BlogCategory, BlogPost, Event, Program, SuccessStory
from app.db.models.crm import SiteSetting
from app.utils.text import slugify


def _upsert_setting(
    db: Session,
    group_key: str,
    setting_key: str,
    value: object,
    value_type: str,
    is_public: bool = True,
    replace_if_value: object | None = None,
) -> None:
    setting = db.execute(
        select(SiteSetting).where(
            SiteSetting.group_key == group_key,
            SiteSetting.setting_key == setting_key,
        )
    ).scalar_one_or_none()

    if setting is None:
        setting = SiteSetting(
            group_key=group_key,
            setting_key=setting_key,
            value_json=json.dumps(value),
            value_type=value_type,
            is_public=is_public,
        )
        db.add(setting)
    elif setting.value_json is None or (
        replace_if_value is not None and setting.value_json == json.dumps(replace_if_value)
    ):
        setting.value_json = json.dumps(value)
        setting.value_type = value_type
        setting.is_public = is_public


def seed_defaults(db: Session) -> None:
    role = db.execute(select(Role).where(Role.slug == "super-admin")).scalar_one_or_none()
    if role is None:
        role = Role(name="Super Admin", slug="super-admin", is_system=True)
        db.add(role)
        db.flush()
        db.add(
            Permission(role_id=role.id, module="*", action="manage", scope="all")
        )

    admin = db.execute(select(Admin).where(Admin.email == "admin@example.org")).scalar_one_or_none()
    if admin is None:
        db.add(
            Admin(
                role_id=role.id,
                full_name="Demo Admin",
                email="admin@example.org",
                password_hash="demo-hash",
                is_active=True,
            )
        )

    if db.execute(select(func.count()).select_from(Program)).scalar_one() == 0:
        db.add_all(
            [
                Program(
                    title="Education Access",
                    slug="education-access",
                    excerpt="Scholarships, after-school support, and digital access for learners who need continuity.",
                    focus_area="Education",
                    beneficiary_count=4800,
                    location_text="Bihar and Uttar Pradesh",
                    status="published",
                    is_featured=True,
                ),
                Program(
                    title="Women Empowerment",
                    slug="women-empowerment",
                    excerpt="Enterprise support, leadership circles, and financial literacy rooted in local needs.",
                    focus_area="Women Empowerment",
                    beneficiary_count=1250,
                    location_text="Rajasthan",
                    status="published",
                ),
                Program(
                    title="Skill Development",
                    slug="skill-development",
                    excerpt="Training pathways that convert learning into employability and income opportunities.",
                    focus_area="Skill Development",
                    beneficiary_count=780,
                    location_text="Delhi NCR",
                    status="published",
                ),
                Program(
                    title="Community Awareness",
                    slug="community-awareness",
                    excerpt="Awareness drives designed around participation, rights literacy, and practical local engagement.",
                    focus_area="Community Awareness",
                    beneficiary_count=220,
                    location_text="Lucknow cluster",
                    status="published",
                ),
            ]
        )

    category = db.execute(
        select(BlogCategory).where(BlogCategory.slug == "impact-stories")
    ).scalar_one_or_none()
    if category is None:
        category = BlogCategory(name="Impact Stories", slug="impact-stories")
        db.add(category)
        db.flush()

    women_category = db.execute(
        select(BlogCategory).where(BlogCategory.slug == "women-empowerment")
    ).scalar_one_or_none()
    if women_category is None:
        women_category = BlogCategory(name="Women Empowerment", slug="women-empowerment")
        db.add(women_category)
        db.flush()

    education_category = db.execute(
        select(BlogCategory).where(BlogCategory.slug == "education")
    ).scalar_one_or_none()
    if education_category is None:
        education_category = BlogCategory(name="Education", slug="education")
        db.add(education_category)
        db.flush()

    if db.execute(select(func.count()).select_from(BlogPost)).scalar_one() == 0:
        db.add_all(
            [
                BlogPost(
                    title="What sustained support looks like after the first donation",
                    slug=slugify("What sustained support looks like after the first donation"),
                    excerpt="A field-level view into why continuity matters more than one-time visibility.",
                    content_json="Long-form content placeholder",
                    category_id=category.id,
                    status="published",
                    is_featured=True,
                    published_at=datetime.utcnow(),
                ),
                BlogPost(
                    title="Why women-led community groups create stronger local outcomes",
                    slug=slugify("Why women-led community groups create stronger local outcomes"),
                    excerpt="When women gain access to skills and support, families and communities shift with them.",
                    content_json="Long-form content placeholder",
                    category_id=women_category.id,
                    status="published",
                    published_at=datetime.utcnow(),
                ),
                BlogPost(
                    title="From scholarship to self-belief",
                    slug=slugify("From scholarship to self-belief"),
                    excerpt="How steady support changed the trajectory of a student's academic year.",
                    content_json="Long-form content placeholder",
                    category_id=education_category.id,
                    status="published",
                    published_at=datetime.utcnow(),
                ),
            ]
        )

    if db.execute(select(func.count()).select_from(Event)).scalar_one() == 0:
        db.add_all(
            [
                Event(
                    title="Summer Learning Drive",
                    slug="summer-learning-drive",
                    excerpt="Reading kits, mentor sessions, and parent orientation.",
                    body_json="Event detail placeholder",
                    event_type="Drive",
                    city="Patna",
                    venue="Community Learning Center",
                    start_at=datetime(2026, 4, 12, 10, 0, 0),
                    status="upcoming",
                    is_featured=True,
                ),
                Event(
                    title="Women's Livelihood Circle",
                    slug="womens-livelihood-circle",
                    excerpt="Micro-enterprise training, market linkage sessions, and peer-led planning.",
                    body_json="Event detail placeholder",
                    event_type="Workshop",
                    city="Jaipur",
                    venue="Women Resource Hub",
                    start_at=datetime(2026, 4, 19, 11, 0, 0),
                    status="upcoming",
                ),
                Event(
                    title="Health and Rights Awareness Camp",
                    slug="health-rights-awareness-camp",
                    excerpt="Community outreach on health access, rights literacy, and local support services.",
                    body_json="Event detail placeholder",
                    event_type="Camp",
                    city="Lucknow",
                    venue="Ward Community Hall",
                    start_at=datetime(2026, 4, 26, 9, 30, 0),
                    status="upcoming",
                ),
            ]
        )

    if db.execute(select(func.count()).select_from(SuccessStory)).scalar_one() == 0:
        db.add_all(
            [
                SuccessStory(
                    person_name="Pooja Kumari",
                    story_title="From scholarship support to academic continuity",
                    slug="pooja-kumari-story",
                    summary="Scholarship beneficiary",
                    quote="Support helped me stay in school and plan further, instead of stopping midway.",
                    location_text="Scholarship beneficiary",
                    status="published",
                    is_featured=True,
                ),
                SuccessStory(
                    person_name="Shabana Sheikh",
                    story_title="Building confidence through women-led enterprise support",
                    slug="shabana-sheikh-story",
                    summary="Women-led enterprise participant",
                    quote="I now earn with more confidence because the training was practical and consistent.",
                    location_text="Women-led enterprise participant",
                    status="published",
                ),
                SuccessStory(
                    person_name="Ritesh Verma",
                    story_title="Why consistent follow-through matters in volunteer-led programs",
                    slug="ritesh-verma-story",
                    summary="Volunteer mentor",
                    quote="The programs are structured with seriousness and visible follow-through.",
                    location_text="Volunteer mentor",
                    status="published",
                ),
            ]
        )

    _upsert_setting(
        db,
        "public_content",
        "organization_name",
        "Ramani Foundation",
        "string",
        replace_if_value="Sahaay Foundation",
    )
    _upsert_setting(db, "public_content", "donation_currency", "INR", "string")
    _upsert_setting(
        db,
        "public_content",
        "primary_phone",
        "",
        "string",
        replace_if_value="+91 98765 43210",
    )
    _upsert_setting(
        db,
        "public_content",
        "primary_email",
        "",
        "string",
        replace_if_value="contact@sahaayfoundation.org",
    )
    _upsert_setting(
        db,
        "public_content",
        "hero_title",
        "Support that stays close to people, not far from reality.",
        "string",
        replace_if_value="Opportunity should not stop at the last mile.",
    )
    _upsert_setting(
        db,
        "public_content",
        "hero_subtitle",
        "Ramani Foundation is being positioned as a trust-first NGO working across education, women empowerment, skill development, and community support with a premium but deeply human digital presence.",
        "string",
        replace_if_value="We help children learn, women lead, and communities grow through education, training, and sustained local support designed for long-term impact.",
    )
    _upsert_setting(
        db,
        "public_content",
        "mission_title",
        "Built for long-term community trust, not short-term visibility.",
        "string",
        replace_if_value="Built for lasting change, not one-day visibility.",
    )
    _upsert_setting(
        db,
        "public_content",
        "mission_description",
        "Ramani Foundation brings together education support, women-led growth, skill development, and community engagement so progress can be practical, measurable, and sustained.",
        "string",
        replace_if_value="Our model combines education support, women-focused livelihood pathways, and community mobilization so support stays active long enough to matter.",
    )
    _upsert_setting(
        db,
        "public_content",
        "trust_items",
        ["Trust-first NGO experience", "Admin-manageable public content", "Donation-friendly storytelling", "Annual reporting ready"],
        "json",
        replace_if_value=[
            "80G Eligible Donations",
            "12+ Years of Community Work",
            "36,000+ Lives Reached",
            "Annual Reports Available",
        ],
    )
    _upsert_setting(db, "public_content", "donation_presets", [1000, 2500, 5000, 10000], "json")
    _upsert_setting(
        db,
        "public_content",
        "trust_notes",
        [
            "Education and community-centered giving",
            "Campaign-specific allocation where applicable",
            "Acknowledgement and receipt workflow ready",
            "Anonymous donation and donor note support",
        ],
        "json",
        replace_if_value=[
            "80G-eligible donation support",
            "Campaign-specific allocation where applicable",
            "Email acknowledgement and receipt workflow",
            "Anonymous donation and donor note support",
        ],
    )
    _upsert_setting(
        db,
        "public_content",
        "impact_stats",
        [
            {"label": "36K+", "value": "36K+", "note": "Lives reached across programs"},
            {"label": "92%", "value": "92%", "note": "Students retained in supported learning tracks"},
            {"label": "18", "value": "18", "note": "District clusters engaged"},
            {"label": "Rs. 1.8Cr", "value": "Rs. 1.8Cr", "note": "Mobilized toward direct impact efforts"},
        ],
        "json",
    )

    db.commit()
