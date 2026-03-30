from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.models.content import Campaign
from app.db.models.crm import Donation
from app.schemas.reports import DonationReportResponse


def get_donation_report(db: Session) -> DonationReportResponse:
    total_amount = db.execute(
        select(func.coalesce(func.sum(Donation.amount_paise), 0)).where(Donation.deleted_at.is_(None))
    ).scalar_one()
    transactions = db.execute(
        select(func.count()).select_from(Donation).where(Donation.deleted_at.is_(None))
    ).scalar_one()
    top_campaign = db.execute(
        select(Campaign.title, func.coalesce(func.sum(Donation.amount_paise), 0).label("raised"))
        .join(Donation, Donation.campaign_id == Campaign.id)
        .where(Donation.deleted_at.is_(None))
        .group_by(Campaign.id, Campaign.title)
        .order_by(func.sum(Donation.amount_paise).desc(), Campaign.title.asc())
        .limit(1)
    ).first()

    return DonationReportResponse(
        range="all_time",
        total_amount=total_amount,
        transactions=transactions,
        top_campaign=top_campaign[0] if top_campaign else "Direct donations",
    )
