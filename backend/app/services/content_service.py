from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.content import BlogCategory, BlogPost, Event, Program, SuccessStory
from app.schemas.content import BlogSummary, EventSummary, PageResponse, ProgramSummary, StorySummary


def get_page_by_slug(slug: str) -> PageResponse:
    return PageResponse(
        slug=slug,
        title=slug.replace("-", " ").title(),
        hero_title="Trust-led NGO content managed from admin",
        hero_subtitle="This payload is a starter placeholder until CMS-backed page persistence is wired in.",
        body="Use this service layer to connect SQLAlchemy repositories and shape frontend-ready responses.",
    )


def list_programs(db: Session) -> list[ProgramSummary]:
    programs = db.execute(
        select(Program).where(Program.deleted_at.is_(None)).order_by(Program.sort_order, Program.title)
    ).scalars().all()
    return [
        ProgramSummary(
            slug=item.slug,
            title=item.title,
            description=item.excerpt or "",
            stat=f"{item.beneficiary_count:,} beneficiaries supported",
        )
        for item in programs
    ]


def list_stories(db: Session) -> list[StorySummary]:
    stories = db.execute(
        select(SuccessStory).where(SuccessStory.deleted_at.is_(None)).order_by(
            SuccessStory.is_featured.desc(), SuccessStory.updated_at.desc()
        )
    ).scalars().all()
    return [
        StorySummary(
            name=item.person_name,
            role=item.location_text or item.summary or "Community beneficiary",
            quote=item.quote or "",
        )
        for item in stories
    ]


def list_events(db: Session) -> list[EventSummary]:
    events = db.execute(
        select(Event).where(Event.deleted_at.is_(None)).order_by(Event.start_at)
    ).scalars().all()
    return [
        EventSummary(
            title=item.title,
            date=item.start_at.strftime("%d %b %Y") if item.start_at else "TBD",
            location=item.city or item.venue or "India",
            description=item.excerpt or "",
        )
        for item in events
    ]


def list_blogs(db: Session) -> list[BlogSummary]:
    posts = db.execute(
        select(BlogPost, BlogCategory)
        .join(BlogCategory, BlogPost.category_id == BlogCategory.id, isouter=True)
        .where(BlogPost.deleted_at.is_(None))
        .order_by(BlogPost.is_featured.desc(), BlogPost.published_at.desc())
    ).all()
    return [
        BlogSummary(
            category=category.name if category else "Updates",
            title=post.title,
            excerpt=post.excerpt or "",
        )
        for post, category in posts
    ]
