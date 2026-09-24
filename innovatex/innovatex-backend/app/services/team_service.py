from fastapi import HTTPException, status
from app.models.team import Team, TeamMember, TeamMemberRole, InviteStatus
from app.models.user import User, UserRole, InstitutionType

async def validate_team_formation(creator: User, members: list[User], mentor_id: str | None, leader_id: str) -> None:
    if leader_id not in {member.virtual_id for member in members}:
        raise HTTPException(status_code=422, detail="Leader must be a team member")
    institutions = {member.institution for member in members if member.institution}
    same_school_only = len(institutions) == 1 and all(member.institution_type == InstitutionType.school for member in members)
    if same_school_only:
        if creator.role != UserRole.faculty:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Faculty must form same-school teams")
        if not mentor_id:
            raise HTTPException(status_code=422, detail="Same-school teams must include a mentor")
    elif creator.role != UserRole.student:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Students form cross-institution teams")

async def create_team(creator: User, name: str, members: list[User], leader_id: str, mentor_id: str | None) -> Team:
    await validate_team_formation(creator, members, mentor_id, leader_id)
    team_members = [TeamMember(user_id=user.virtual_id, role=TeamMemberRole.leader if user.virtual_id == leader_id else TeamMemberRole.member, status=InviteStatus.accepted if user.virtual_id == creator.virtual_id else InviteStatus.invited) for user in members]
    if mentor_id:
        team_members.append(TeamMember(user_id=mentor_id, role=TeamMemberRole.member, status=InviteStatus.invited))
    team = Team(name=name, members=team_members, created_by=creator.virtual_id, created_at=__import__('datetime').datetime.now(__import__('datetime').timezone.utc).isoformat())
    await team.insert()
    return team
