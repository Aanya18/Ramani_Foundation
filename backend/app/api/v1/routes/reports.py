from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.reports import DonationReportResponse
from app.services.report_service import get_donation_report

router = APIRouter()


@router.get("/donations", response_model=DonationReportResponse)
def donation_report(db: Session = Depends(get_db)) -> DonationReportResponse:
    return get_donation_report(db)
