from datetime import datetime, timezone
import pytest
from fastapi import HTTPException
from app.models.funding import Funding, FundingStatus
from app.models.team import Team, TeamMember, TeamMemberRole, InviteStatus
from app.services.funding_service import decide_funding

@pytest.mark.asyncio
async def test_only_team_leader_can_approve(mongo_database):
    team = Team(name="Team", members=[TeamMember(user_id="leader", role=TeamMemberRole.leader, status=InviteStatus.accepted), TeamMember(user_id="member")], created_by="leader", created_at=datetime.now(timezone.utc).isoformat())
    await team.insert()
    funding = Funding(project_id="project", team_id=str(team.id), industry_id="industry", amount=100, created_at="now", updated_at="now")
    await funding.insert()
    with pytest.raises(HTTPException) as error:
        await decide_funding(funding, "member", True, None)
    assert error.value.status_code == 403

@pytest.mark.asyncio
async def test_decline_requires_reason(mongo_database):
    team = Team(name="Team", members=[TeamMember(user_id="leader", role=TeamMemberRole.leader, status=InviteStatus.accepted)], created_by="leader", created_at="now")
    await team.insert()
    funding = Funding(project_id="project", team_id=str(team.id), industry_id="industry", amount=100, created_at="now", updated_at="now")
    await funding.insert()
    with pytest.raises(HTTPException) as error:
        await decide_funding(funding, "leader", False, "no")
    assert error.value.status_code == 422
