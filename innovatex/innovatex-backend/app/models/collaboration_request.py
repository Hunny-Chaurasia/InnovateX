from enum import Enum
from beanie import Document

class CollaborationStatus(str, Enum):
    pending = "pending"
    accepted = "accepted"
    declined = "declined"

class CollaborationRequest(Document):
    from_user_id: str
    to_user_id: str
    project_id: str | None = None
    message: str
    status: CollaborationStatus = CollaborationStatus.pending
    created_at: str

    class Settings:
        name = "collaboration_requests"
