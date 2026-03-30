import uuid

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.content import Campaign
from app.db.models.crm import Donation, Donor
from app.schemas.donation import (
    DonationInitiateRequest,
    DonationInitiateResponse,
    DonationStatusResponse,
)


def initiate_donation(db: Session, payload: DonationInitiateRequest) -> DonationInitiateResponse:
    donor = db.execute(select(Donor).where(Donor.email == payload.email)).scalar_one_or_none()

    if donor is None:
        donor = Donor(
            full_name=payload.full_name,
            email=payload.email,
            phone=payload.phone,
        )
        db.add(donor)
        db.flush()
    else:
        donor.full_name = payload.full_name
        donor.phone = payload.phone or donor.phone

    campaign = None
    if payload.campaign_slug:
        campaign = (
            db.execute(select(Campaign).where(Campaign.slug == payload.campaign_slug))
            .scalar_one_or_none()
        )

    donation_id = str(uuid.uuid4())
    donation = Donation(
        id=donation_id,
        donor_id=donor.id,
        campaign_id=campaign.id if campaign else None,
        amount_paise=payload.amount_paise,
        frequency=payload.frequency,
        donor_note=payload.donor_note,
        anonymous=payload.anonymous,
        status="initiated",
        source_page="donate",
    )
    db.add(donation)
    db.commit()

    return DonationInitiateResponse(
        donation_id=donation_id,
        reference=donation_id,
        status="initiated",
        checkout_provider="razorpay",
    )


def get_donation_status(db: Session, reference: str) -> DonationStatusResponse:
    donation = db.get(Donation, reference)

    if donation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found",
        )

    return DonationStatusResponse(
        reference=reference,
        status=donation.status,
        amount_paise=donation.amount_paise,
    )
