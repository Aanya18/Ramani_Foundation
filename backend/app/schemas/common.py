from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class MessageResponse(BaseModel):
    message: str


class PublicMetric(BaseModel):
    label: str
    value: str
    note: str | None = None


class TimestampedResponse(ORMModel):
    id: str
    created_at: datetime
    updated_at: datetime
