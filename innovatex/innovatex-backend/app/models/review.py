from enum import Enum
from beanie import Document
from pydantic import BaseModel

class ReviewStatus(str, Enum):
    open = "open"
    addressed = "addressed"
    resolved = "resolved"

class Reply(BaseModel):
    user_id: str
    message: str
    marks_addressed: bool = False
    created_at: str

class Review(Document):
    project_id: str
    industry_id: str
    overall_assessment: str
    flaws: str
    improvements_needed: str
    what_works: str | None = None
    replies: list[Reply] = []
    status: ReviewStatus = ReviewStatus.open
    created_at: str

    class Settings:
        name = "reviews"
