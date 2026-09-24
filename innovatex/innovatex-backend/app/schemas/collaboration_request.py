from pydantic import BaseModel, Field

class CollaborationRequestCreate(BaseModel):
    to_user_id: str
    project_id: str | None = None
    message: str = Field(min_length=2)

class CollaborationRequestResponse(CollaborationRequestCreate):
    id: str
    status: str
