from beanie import Document
from pydantic import Field

class ProofOfWork(Document):
    project_id: str
    added_by: str
    images: list[str] = Field(default_factory=list)
    links: list[str] = Field(default_factory=list)
    videos: list[str] = Field(default_factory=list)
    created_at: str

    class Settings:
        name = "proof_of_work"
