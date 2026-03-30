from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.admin import AdminDonationRow
from app.schemas.donation import (
    DonationInitiateRequest,
    DonationInitiateResponse,
    DonationStatusResponse,
)
from app.services.admin_service import list_admin_donations
from app.services.donation_service import get_donation_status, initiate_donation

router = APIRouter()


@router.post("/initiate", response_model=DonationInitiateResponse, status_code=status.HTTP_201_CREATED)
def create_donation(
    payload: DonationInitiateRequest, db: Session = Depends(get_db)
) -> DonationInitiateResponse:
    return initiate_donation(db, payload)


@router.get("/{reference}/status", response_model=DonationStatusResponse)
def donation_status(reference: str, db: Session = Depends(get_db)) -> DonationStatusResponse:
    return get_donation_status(db, reference)


@router.get("/admin/list", response_model=list[AdminDonationRow])
def admin_donations(db: Session = Depends(get_db)) -> list[AdminDonationRow]:
    return list_admin_donations(db)


@router.post("/webhooks/razorpay")
def razorpay_webhook() -> dict[str, str]:
    return {"message": "Webhook received"}
