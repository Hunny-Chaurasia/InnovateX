from datetime import datetime, timezone
from fastapi import HTTPException, status
from app.models.funding import Funding, FundingStatus
from app.models.team import Team, TeamMemberRole

async def decide_funding(funding: Funding, user_id: str, approve: bool, decline_reason: str | None) -> Funding:
    if funding.status != FundingStatus.awaiting_leader:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Funding is no longer awaiting a decision")
    team = await Team.get(funding.team_id)
    if not team or not any(member.user_id == user_id and member.role == TeamMemberRole.leader for member in team.members):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the team leader can decide funding")
    if not approve and (not decline_reason or len(decline_reason.strip()) < 5):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Decline reason must be at least 5 characters")
    funding.status = FundingStatus.confirmed if approve else FundingStatus.declined
    funding.decline_reason = None if approve else decline_reason.strip()
    funding.updated_at = datetime.now(timezone.utc).isoformat()
    await funding.save()
    return funding
