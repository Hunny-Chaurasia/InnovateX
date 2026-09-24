from pydantic import BaseModel, Field
from app.models.team import TeamMemberRole

class TeamMemberInput(BaseModel):
    user_id: str
    role: TeamMemberRole = TeamMemberRole.member

class TeamCreate(BaseModel):
    name: str = Field(min_length=2)
    member_ids: list[str] = Field(min_length=1)
    leader_id: str
    mentor_id: str | None = None

class TeamInvite(BaseModel):
    user_id: str

class InviteResponse(BaseModel):
    accept: bool

class TeamResponse(BaseModel):
    id: str
    name: str
    members: list[dict]
