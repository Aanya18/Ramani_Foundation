from pydantic import BaseModel


class DashboardStat(BaseModel):
    label: str
    value: str


class DashboardResponse(BaseModel):
    stats: list[DashboardStat]
    pending_actions: list[str]
