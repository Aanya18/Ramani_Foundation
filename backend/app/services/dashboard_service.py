from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.models.content import BlogPost
from app.db.models.crm import ContactMessage, Donation, Volunteer
from app.schemas.dashboard import DashboardResponse, DashboardStat


def get_dashboard_data(db: Session) -> DashboardResponse:
    total_amount = db.execute(
        select(func.coalesce(func.sum(Donation.amount_paise), 0)).where(Donation.deleted_at.is_(None))
    ).scalar_one()
    current_month = datetime.utcnow().strftime("%Y-%m")
    monthly_amount = db.execute(
        select(func.coalesce(func.sum(Donation.amount_paise), 0)).where(
            Donation.deleted_at.is_(None),
            func.strftime("%Y-%m", Donation.created_at) == current_month,
        )
    ).scalar_one()
    volunteer_count = db.execute(
        select(func.count()).select_from(Volunteer).where(Volunteer.deleted_at.is_(None))
    ).scalar_one()
    pending_actions = db.execute(
        select(func.count()).select_from(ContactMessage).where(
            ContactMessage.deleted_at.is_(None),
            ContactMessage.status == "new",
        )
    ).scalar_one()
    blog_count = db.execute(
        select(func.count()).select_from(BlogPost).where(BlogPost.deleted_at.is_(None))
    ).scalar_one()

    return DashboardResponse(
        stats=[
            DashboardStat(label="Total donations", value=f"Rs. {total_amount / 100:,.0f}"),
            DashboardStat(label="This month", value=f"Rs. {monthly_amount / 100:,.0f}"),
            DashboardStat(label="Volunteer requests", value=str(volunteer_count)),
            DashboardStat(label="Published posts", value=str(blog_count)),
        ],
        pending_actions=[
            f"{pending_actions} new contact requests awaiting response",
            f"{volunteer_count} volunteer submissions in pipeline",
            "Review featured campaign and homepage settings",
        ],
    )
