from enum import Enum
from beanie import Document

class FundingStatus(str, Enum):
    awaiting_leader = "awaiting_leader"
    confirmed = "confirmed"
    declined = "declined"

class Funding(Document):
    project_id: str
    team_id: str
    industry_id: str
    amount: float
    status: FundingStatus = FundingStatus.awaiting_leader
    decline_reason: str | None = None
    created_at: str
    updated_at: str

    class Settings:
        name = "funding"
