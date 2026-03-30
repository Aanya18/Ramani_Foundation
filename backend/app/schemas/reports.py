from pydantic import BaseModel


class DonationReportResponse(BaseModel):
    range: str
    total_amount: int
    transactions: int
    top_campaign: str
