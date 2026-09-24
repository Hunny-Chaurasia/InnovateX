from beanie import Document
from pydantic import Field

class Portfolio(Document):
    slug: str = Field(unique=True, index=True)
    enabled: bool = True
    user_id: str = Field(unique=True)
    bio: str | None = None
    project_ids: list[str] = Field(default_factory=list)

    class Settings:
        name = "portfolios"
        indexes = ["slug", "user_id"]
