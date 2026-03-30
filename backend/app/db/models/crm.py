from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


def uuid_str() -> str:
    return str(uuid.uuid4())


class Donor(Base):
    __tablename__ = "donors"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=uuid_str)
    donor_type: Mapped[str] = mapped_column(String(40), default="individual")
    full_name: Mapped[str] = mapped_column(String(160), nullable=False)
    organization_name: Mapped[str | None] = mapped_column(String(255))
    email: Mapped[str | None] = mapped_column(String(255))
    phone: Mapped[str | None] = mapped_column(String(40))
    pan: Mapped[str | None] = mapped_column(String(40))
    address_line1: Mapped[str | None] = mapped_column(String(255))
    address_line2: Mapped[str | None] = mapped_column(String(255))
    city: Mapped[str | None] = mapped_column(String(100))
    state: Mapped[str | None] = mapped_column(String(100))
    country: Mapped[str | None] = mapped_column(String(100))
    pincode: Mapped[str | None] = mapped_column(String(20))
    communication_opt_in: Mapped[bool] = mapped_column(Boolean, default=False)
    is_anonymous_default: Mapped[bool] = mapped_column(Boolean, default=False)
    notes: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(40), default="active")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime)


class Donation(Base):
    __tablename__ = "donations"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=uuid_str)
    donor_id: Mapped[str | None] = mapped_column(ForeignKey("donors.id"))
    campaign_id: Mapped[str | None] = mapped_column(ForeignKey("campaigns.id"))
    amount_paise: Mapped[int] = mapped_column(Integer, nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="INR")
    frequency: Mapped[str] = mapped_column(String(40), default="one_time")
    payment_gateway: Mapped[str] = mapped_column(String(40), default="razorpay")
    gateway_order_id: Mapped[str | None] = mapped_column(String(160))
    gateway_payment_id: Mapped[str | None] = mapped_column(String(160))
    gateway_subscription_id: Mapped[str | None] = mapped_column(String(160))
    payment_method: Mapped[str | None] = mapped_column(String(80))
    status: Mapped[str] = mapped_column(String(40), default="initiated")
    donated_at: Mapped[datetime | None] = mapped_column(DateTime)
    verified_at: Mapped[datetime | None] = mapped_column(DateTime)
    donor_note: Mapped[str | None] = mapped_column(Text)
    anonymous: Mapped[bool] = mapped_column(Boolean, default=False)
    tax_eligible: Mapped[bool] = mapped_column(Boolean, default=True)
    receipt_requested: Mapped[bool] = mapped_column(Boolean, default=True)
    source_page: Mapped[str | None] = mapped_column(String(120))
    metadata_json: Mapped[str | None] = mapped_column(Text)
    failed_reason: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime)


class DonationReceipt(Base):
    __tablename__ = "donation_receipts"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=uuid_str)
    donation_id: Mapped[str] = mapped_column(ForeignKey("donations.id"), unique=True)
    receipt_number: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    receipt_pdf_path: Mapped[str | None] = mapped_column(String(255))
    ngo_pan: Mapped[str | None] = mapped_column(String(60))
    ngo_80g_number: Mapped[str | None] = mapped_column(String(120))
    fiscal_year: Mapped[str | None] = mapped_column(String(20))
    issued_at: Mapped[datetime | None] = mapped_column(DateTime)
    emailed_at: Mapped[datetime | None] = mapped_column(DateTime)
    status: Mapped[str] = mapped_column(String(40), default="generated")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )


class Volunteer(Base):
    __tablename__ = "volunteers"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=uuid_str)
    full_name: Mapped[str] = mapped_column(String(160), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(40))
    city: Mapped[str | None] = mapped_column(String(100))
    state: Mapped[str | None] = mapped_column(String(100))
    interest_area: Mapped[str | None] = mapped_column(String(160))
    availability: Mapped[str | None] = mapped_column(String(120))
    skills_text: Mapped[str | None] = mapped_column(Text)
    motivation: Mapped[str | None] = mapped_column(Text)
    resume_path: Mapped[str | None] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(40), default="new")
    assigned_admin_id: Mapped[str | None] = mapped_column(ForeignKey("admins.id"))
    contacted_at: Mapped[datetime | None] = mapped_column(DateTime)
    notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime)


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=uuid_str)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(40))
    subject: Mapped[str | None] = mapped_column(String(255))
    message: Mapped[str] = mapped_column(Text, nullable=False)
    inquiry_type: Mapped[str | None] = mapped_column(String(120))
    source_page: Mapped[str | None] = mapped_column(String(120))
    status: Mapped[str] = mapped_column(String(40), default="new")
    assigned_admin_id: Mapped[str | None] = mapped_column(ForeignKey("admins.id"))
    responded_at: Mapped[datetime | None] = mapped_column(DateTime)
    notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime)


class Newsletter(Base):
    __tablename__ = "newsletters"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=uuid_str)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    full_name: Mapped[str | None] = mapped_column(String(160))
    source: Mapped[str | None] = mapped_column(String(120))
    status: Mapped[str] = mapped_column(String(40), default="active")
    subscribed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    unsubscribed_at: Mapped[datetime | None] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )


class SiteSetting(Base):
    __tablename__ = "site_settings"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=uuid_str)
    group_key: Mapped[str] = mapped_column(String(120), nullable=False)
    setting_key: Mapped[str] = mapped_column(String(120), nullable=False)
    value_json: Mapped[str | None] = mapped_column(Text)
    value_type: Mapped[str] = mapped_column(String(40), default="string")
    is_public: Mapped[bool] = mapped_column(Boolean, default=False)
    updated_by_admin_id: Mapped[str | None] = mapped_column(ForeignKey("admins.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=uuid_str)
    admin_id: Mapped[str | None] = mapped_column(ForeignKey("admins.id"))
    action: Mapped[str] = mapped_column(String(120), nullable=False)
    entity_type: Mapped[str] = mapped_column(String(120), nullable=False)
    entity_id: Mapped[str | None] = mapped_column(String(120))
    route: Mapped[str | None] = mapped_column(String(255))
    method: Mapped[str | None] = mapped_column(String(20))
    ip_address: Mapped[str | None] = mapped_column(String(80))
    user_agent: Mapped[str | None] = mapped_column(Text)
    before_json: Mapped[str | None] = mapped_column(Text)
    after_json: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
