from pydantic import BaseModel

class PortfolioEnsure(BaseModel):
    bio: str | None = None

class PortfolioResponse(BaseModel):
    slug: str
    enabled: bool
    user_id: str
    bio: str | None = None
    project_ids: list[str]
