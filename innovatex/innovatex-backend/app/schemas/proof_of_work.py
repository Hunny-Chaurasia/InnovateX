from pydantic import BaseModel, Field

class ProofOfWorkCreate(BaseModel):
    project_id: str
    images: list[str] = Field(default_factory=list)
    links: list[str] = Field(default_factory=list)
    videos: list[str] = Field(default_factory=list)

class ProofOfWorkResponse(ProofOfWorkCreate):
    id: str
    added_by: str
