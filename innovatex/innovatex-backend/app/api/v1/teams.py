from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_user
from app.models.team import Team
from app.models.user import User
from app.schemas.team import TeamCreate, TeamInvite, InviteResponse, TeamResponse
from app.services.team_service import create_team

router = APIRouter(prefix="/teams", tags=["teams"])

@router.post("", response_model=TeamResponse, status_code=201)
async def create(data: TeamCreate, user: User = Depends(get_current_user)):
    members = await User.find(User.virtual_id.in_(data.member_ids)).to_list()
    if len(members) != len(set(data.member_ids)):
        raise HTTPException(status_code=404, detail="One or more users not found")
    team = await create_team(user, data.name, members, data.leader_id, data.mentor_id)
    return TeamResponse(id=str(team.id), name=team.name, members=[member.model_dump() for member in team.members])

@router.post("/{team_id}/invite", status_code=202)
async def invite(team_id: str, data: TeamInvite, user: User = Depends(get_current_user)):
    team = await Team.get(team_id)
    if not team or team.created_by != user.virtual_id:
        raise HTTPException(status_code=403, detail="Only the team creator can invite members")
    return {"detail": "Invitation sent", "user_id": data.user_id}

@router.post("/{team_id}/invite/respond")
async def respond(team_id: str, data: InviteResponse, user: User = Depends(get_current_user)):
    team = await Team.get(team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    for member in team.members:
        if member.user_id == user.virtual_id:
            member.status = "accepted" if data.accept else "invited"
            await team.save()
            return {"accepted": data.accept}
    raise HTTPException(status_code=404, detail="Invitation not found")
