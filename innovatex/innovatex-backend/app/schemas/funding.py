from pydantic import BaseModel, Field
from app.models.funding import FundingStatus

class FundingCreate(BaseModel):
    project_id: str
    team_id: str
    amount: float = Field(gt=0)

class FundingDecision(BaseModel):
    approve: bool
    decline_reason: str | None = Field(default=None, min_length=5)

class FundingResponse(BaseModel):
    id: str
    project_id: str
    team_id: str
    industry_id: str
    amount: float
    status: FundingStatus
    decline_reason: str | None = None
