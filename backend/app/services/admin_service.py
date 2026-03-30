from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.content import BlogCategory, BlogPost, Event, Program, SuccessStory
from app.db.models.crm import ContactMessage, Donation, Donor, Volunteer
from app.schemas.admin import (
    AdminBlogBase,
    AdminBlogResponse,
    AdminContactRow,
    AdminDonationRow,
    AdminDonorRow,
    AdminEventBase,
    AdminEventResponse,
    AdminProgramBase,
    AdminProgramResponse,
    AdminStoryBase,
    AdminStoryResponse,
    AdminVolunteerRow,
)
from app.utils.text import slugify


def _get_or_create_blog_category(db: Session, name: str) -> BlogCategory:
    slug = slugify(name)
    category = db.execute(
        select(BlogCategory).where(BlogCategory.slug == slug)
    ).scalar_one_or_none()

    if category is None:
        category = BlogCategory(name=name, slug=slug)
        db.add(category)
        db.flush()
    else:
        category.name = name

    return category


def list_admin_programs(db: Session) -> list[AdminProgramResponse]:
    rows = db.execute(
        select(Program).where(Program.deleted_at.is_(None)).order_by(Program.sort_order, Program.title)
    ).scalars().all()
    return [
        AdminProgramResponse(
            id=row.id,
            title=row.title,
            slug=row.slug,
            excerpt=row.excerpt or "",
            focus_area=row.focus_area,
            beneficiary_count=row.beneficiary_count,
            location_text=row.location_text,
            status=row.status,
            is_featured=row.is_featured,
            updated_at=row.updated_at,
        )
        for row in rows
    ]


def create_program(db: Session, payload: AdminProgramBase) -> AdminProgramResponse:
    row = Program(
        title=payload.title,
        slug=payload.slug or slugify(payload.title),
        excerpt=payload.excerpt,
        focus_area=payload.focus_area,
        beneficiary_count=payload.beneficiary_count,
        location_text=payload.location_text,
        status=payload.status,
        is_featured=payload.is_featured,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return AdminProgramResponse(
        id=row.id,
        title=row.title,
        slug=row.slug,
        excerpt=row.excerpt or "",
        focus_area=row.focus_area,
        beneficiary_count=row.beneficiary_count,
        location_text=row.location_text,
        status=row.status,
        is_featured=row.is_featured,
        updated_at=row.updated_at,
    )


def update_program(db: Session, program_id: str, payload: AdminProgramBase) -> AdminProgramResponse:
    row = db.get(Program, program_id)
    row.title = payload.title
    row.slug = payload.slug or slugify(payload.title)
    row.excerpt = payload.excerpt
    row.focus_area = payload.focus_area
    row.beneficiary_count = payload.beneficiary_count
    row.location_text = payload.location_text
    row.status = payload.status
    row.is_featured = payload.is_featured
    db.commit()
    db.refresh(row)
    return AdminProgramResponse(
        id=row.id,
        title=row.title,
        slug=row.slug,
        excerpt=row.excerpt or "",
        focus_area=row.focus_area,
        beneficiary_count=row.beneficiary_count,
        location_text=row.location_text,
        status=row.status,
        is_featured=row.is_featured,
        updated_at=row.updated_at,
    )


def list_admin_blogs(db: Session) -> list[AdminBlogResponse]:
    rows = db.execute(
        select(BlogPost, BlogCategory)
        .join(BlogCategory, BlogPost.category_id == BlogCategory.id, isouter=True)
        .where(BlogPost.deleted_at.is_(None))
        .order_by(BlogPost.published_at.desc(), BlogPost.updated_at.desc())
    ).all()
    return [
        AdminBlogResponse(
            id=post.id,
            title=post.title,
            slug=post.slug,
            category=category.name if category else "Updates",
            excerpt=post.excerpt or "",
            content=post.content_json or "",
            status=post.status,
            is_featured=post.is_featured,
            updated_at=post.updated_at,
        )
        for post, category in rows
    ]


def create_blog(db: Session, payload: AdminBlogBase) -> AdminBlogResponse:
    category = _get_or_create_blog_category(db, payload.category)
    row = BlogPost(
        title=payload.title,
        slug=payload.slug or slugify(payload.title),
        category_id=category.id,
        excerpt=payload.excerpt,
        content_json=payload.content,
        status=payload.status,
        is_featured=payload.is_featured,
        published_at=datetime.utcnow() if payload.status == "published" else None,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return AdminBlogResponse(
        id=row.id,
        title=row.title,
        slug=row.slug,
        category=category.name,
        excerpt=row.excerpt or "",
        content=row.content_json or "",
        status=row.status,
        is_featured=row.is_featured,
        updated_at=row.updated_at,
    )


def update_blog(db: Session, blog_id: str, payload: AdminBlogBase) -> AdminBlogResponse:
    row = db.get(BlogPost, blog_id)
    category = _get_or_create_blog_category(db, payload.category)
    row.title = payload.title
    row.slug = payload.slug or slugify(payload.title)
    row.category_id = category.id
    row.excerpt = payload.excerpt
    row.content_json = payload.content
    row.status = payload.status
    row.is_featured = payload.is_featured
    if payload.status == "published" and row.published_at is None:
        row.published_at = datetime.utcnow()
    db.commit()
    db.refresh(row)
    return AdminBlogResponse(
        id=row.id,
        title=row.title,
        slug=row.slug,
        category=category.name,
        excerpt=row.excerpt or "",
        content=row.content_json or "",
        status=row.status,
        is_featured=row.is_featured,
        updated_at=row.updated_at,
    )


def list_admin_events(db: Session) -> list[AdminEventResponse]:
    rows = db.execute(
        select(Event).where(Event.deleted_at.is_(None)).order_by(Event.start_at, Event.title)
    ).scalars().all()
    return [
        AdminEventResponse(
            id=row.id,
            title=row.title,
            slug=row.slug,
            excerpt=row.excerpt or "",
            event_type=row.event_type,
            city=row.city,
            venue=row.venue,
            start_at=row.start_at.isoformat() if row.start_at else None,
            status=row.status,
            is_featured=row.is_featured,
            updated_at=row.updated_at,
        )
        for row in rows
    ]


def create_event(db: Session, payload: AdminEventBase) -> AdminEventResponse:
    row = Event(
        title=payload.title,
        slug=payload.slug or slugify(payload.title),
        excerpt=payload.excerpt,
        event_type=payload.event_type,
        city=payload.city,
        venue=payload.venue,
        start_at=datetime.fromisoformat(payload.start_at) if payload.start_at else None,
        status=payload.status,
        is_featured=payload.is_featured,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return AdminEventResponse(
        id=row.id,
        title=row.title,
        slug=row.slug,
        excerpt=row.excerpt or "",
        event_type=row.event_type,
        city=row.city,
        venue=row.venue,
        start_at=row.start_at.isoformat() if row.start_at else None,
        status=row.status,
        is_featured=row.is_featured,
        updated_at=row.updated_at,
    )


def update_event(db: Session, event_id: str, payload: AdminEventBase) -> AdminEventResponse:
    row = db.get(Event, event_id)
    row.title = payload.title
    row.slug = payload.slug or slugify(payload.title)
    row.excerpt = payload.excerpt
    row.event_type = payload.event_type
    row.city = payload.city
    row.venue = payload.venue
    row.start_at = datetime.fromisoformat(payload.start_at) if payload.start_at else None
    row.status = payload.status
    row.is_featured = payload.is_featured
    db.commit()
    db.refresh(row)
    return AdminEventResponse(
        id=row.id,
        title=row.title,
        slug=row.slug,
        excerpt=row.excerpt or "",
        event_type=row.event_type,
        city=row.city,
        venue=row.venue,
        start_at=row.start_at.isoformat() if row.start_at else None,
        status=row.status,
        is_featured=row.is_featured,
        updated_at=row.updated_at,
    )


def list_admin_stories(db: Session) -> list[AdminStoryResponse]:
    rows = db.execute(
        select(SuccessStory).where(SuccessStory.deleted_at.is_(None)).order_by(
            SuccessStory.is_featured.desc(), SuccessStory.updated_at.desc()
        )
    ).scalars().all()
    return [
        AdminStoryResponse(
            id=row.id,
            story_title=row.story_title,
            slug=row.slug,
            person_name=row.person_name,
            role_label=row.location_text or row.summary or "Community beneficiary",
            quote=row.quote or "",
            summary=row.summary or "",
            status=row.status,
            is_featured=row.is_featured,
            updated_at=row.updated_at,
        )
        for row in rows
    ]


def create_story(db: Session, payload: AdminStoryBase) -> AdminStoryResponse:
    row = SuccessStory(
        story_title=payload.story_title,
        slug=payload.slug or slugify(payload.story_title),
        person_name=payload.person_name,
        location_text=payload.role_label,
        summary=payload.summary,
        quote=payload.quote,
        status=payload.status,
        is_featured=payload.is_featured,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return AdminStoryResponse(
        id=row.id,
        story_title=row.story_title,
        slug=row.slug,
        person_name=row.person_name,
        role_label=row.location_text or "",
        quote=row.quote or "",
        summary=row.summary or "",
        status=row.status,
        is_featured=row.is_featured,
        updated_at=row.updated_at,
    )


def update_story(db: Session, story_id: str, payload: AdminStoryBase) -> AdminStoryResponse:
    row = db.get(SuccessStory, story_id)
    row.story_title = payload.story_title
    row.slug = payload.slug or slugify(payload.story_title)
    row.person_name = payload.person_name
    row.location_text = payload.role_label
    row.summary = payload.summary
    row.quote = payload.quote
    row.status = payload.status
    row.is_featured = payload.is_featured
    db.commit()
    db.refresh(row)
    return AdminStoryResponse(
        id=row.id,
        story_title=row.story_title,
        slug=row.slug,
        person_name=row.person_name,
        role_label=row.location_text or "",
        quote=row.quote or "",
        summary=row.summary or "",
        status=row.status,
        is_featured=row.is_featured,
        updated_at=row.updated_at,
    )


def list_admin_donations(db: Session) -> list[AdminDonationRow]:
    rows = db.execute(
        select(Donation, Donor)
        .join(Donor, Donation.donor_id == Donor.id, isouter=True)
        .where(Donation.deleted_at.is_(None))
        .order_by(Donation.created_at.desc())
    ).all()
    return [
        AdminDonationRow(
            id=donation.id,
            donor_name=donor.full_name if donor else "Unknown donor",
            donor_email=donor.email if donor and donor.email else "",
            amount_display=f"Rs. {donation.amount_paise / 100:,.0f}",
            frequency=donation.frequency,
            status=donation.status,
            created_at=donation.created_at,
        )
        for donation, donor in rows
    ]


def list_admin_donors(db: Session) -> list[AdminDonorRow]:
    rows = db.execute(
        select(Donor).where(Donor.deleted_at.is_(None)).order_by(Donor.created_at.desc())
    ).scalars().all()
    return [
        AdminDonorRow(
            id=row.id,
            full_name=row.full_name,
            email=row.email,
            phone=row.phone,
            status=row.status,
            created_at=row.created_at,
        )
        for row in rows
    ]


def list_admin_volunteers(db: Session) -> list[AdminVolunteerRow]:
    rows = db.execute(
        select(Volunteer).where(Volunteer.deleted_at.is_(None)).order_by(Volunteer.created_at.desc())
    ).scalars().all()
    return [
        AdminVolunteerRow(
            id=row.id,
            full_name=row.full_name,
            email=row.email,
            phone=row.phone,
            city=row.city,
            interest_area=row.interest_area,
            status=row.status,
            created_at=row.created_at,
        )
        for row in rows
    ]


def list_admin_contact_messages(db: Session) -> list[AdminContactRow]:
    rows = db.execute(
        select(ContactMessage)
        .where(ContactMessage.deleted_at.is_(None))
        .order_by(ContactMessage.created_at.desc())
    ).scalars().all()
    return [
        AdminContactRow(
            id=row.id,
            name=row.name,
            email=row.email,
            subject=row.subject,
            inquiry_type=row.inquiry_type,
            status=row.status,
            created_at=row.created_at,
        )
        for row in rows
    ]
