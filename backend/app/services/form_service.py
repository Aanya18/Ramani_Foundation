from sqlalchemy.orm import Session

from app.db.models.crm import ContactMessage, Volunteer
from app.schemas.common import MessageResponse
from app.schemas.forms import ContactCreateRequest, VolunteerCreateRequest


def submit_contact_form(db: Session, payload: ContactCreateRequest) -> MessageResponse:
    record = ContactMessage(
        name=payload.name,
        email=payload.email,
        subject=payload.subject,
        message=payload.message,
        inquiry_type=payload.inquiry_type,
        source_page=payload.source_page,
    )
    db.add(record)
    db.commit()

    return MessageResponse(message=f"Contact message received for {payload.name}.")


def submit_volunteer_form(db: Session, payload: VolunteerCreateRequest) -> MessageResponse:
    record = Volunteer(
        full_name=payload.full_name,
        email=payload.email,
        phone=payload.phone,
        city=payload.city,
        interest_area=payload.interest_area,
        motivation=payload.motivation,
    )
    db.add(record)
    db.commit()

    return MessageResponse(message=f"Volunteer application received for {payload.full_name}.")
