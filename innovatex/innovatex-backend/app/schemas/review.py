from pydantic import BaseModel, Field
from app.models.review import ReviewStatus

class ReviewCreate(BaseModel):
    project_id: str
    overall_assessment: str = Field(min_length=10)
    flaws: str = Field(min_length=10)
    improvements_needed: str = Field(min_length=10)
    what_works: str | None = None

class ReplyCreate(BaseModel):
    message: str = Field(min_length=1)
    marks_addressed: bool = False

class ReviewDecision(BaseModel):
    resolve: bool

class ReviewResponse(BaseModel):
    id: str
    project_id: str
    overall_assessment: str
    flaws: str
    improvements_needed: str
    what_works: str | None
    status: ReviewStatus
    replies: list[dict]
