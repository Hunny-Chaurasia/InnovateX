from enum import Enum
from beanie import Document
from pydantic import BaseModel, Field

class TeamMemberRole(str, Enum):
    leader = "leader"
    member = "member"

class InviteStatus(str, Enum):
    invited = "invited"
    accepted = "accepted"

class TeamMember(BaseModel):
    user_id: str
    role: TeamMemberRole = TeamMemberRole.member
    status: InviteStatus = InviteStatus.invited

class Team(Document):
    name: str
    institution_type: str | None = None
    members: list[TeamMember] = Field(default_factory=list)
    created_by: str
    created_at: str

    class Settings:
        name = "teams"
