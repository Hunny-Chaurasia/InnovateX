from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_user
from app.models.funding import Funding
from app.models.user import User
from app.schemas.funding import FundingCreate, FundingDecision, FundingResponse
from app.services.funding_service import decide_funding

router = APIRouter(prefix="/funding", tags=["funding"])

def response(funding):
    return FundingResponse.model_validate(funding, from_attributes=True)

@router.post("", response_model=FundingResponse, status_code=201)
async def submit(data: FundingCreate, user: User = Depends(get_current_user)):
    funding = Funding(**data.model_dump(), industry_id=user.virtual_id, created_at=datetime.now(timezone.utc).isoformat(), updated_at=datetime.now(timezone.utc).isoformat())
    await funding.insert()
    return response(funding)

@router.post("/{funding_id}/decision", response_model=FundingResponse)
async def decision(funding_id: str, data: FundingDecision, user: User = Depends(get_current_user)):
    funding = await Funding.get(funding_id)
    if not funding:
        raise HTTPException(status_code=404, detail="Funding not found")
    return response(await decide_funding(funding, user.virtual_id, data.approve, data.decline_reason))

@router.get("/project/{project_id}/latest", response_model=FundingResponse | None)
async def latest(project_id: str, user: User = Depends(get_current_user)):
    funding = await Funding.find_one(Funding.project_id == project_id, sort=[("created_at", -1)])
    return response(funding) if funding else None
