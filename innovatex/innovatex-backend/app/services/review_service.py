from datetime import datetime, timezone
from fastapi import HTTPException, status
from app.models.review import Reply, Review, ReviewStatus
from app.models.user import User, UserRole

async def create_review(industry: User, data) -> Review:
    if industry.role != UserRole.industry:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only industry users can create reviews")
    review = Review(**data.model_dump(), industry_id=industry.virtual_id, created_at=datetime.now(timezone.utc).isoformat())
    await review.insert()
    return review

async def add_reply(review: Review, user: User, message: str, marks_addressed: bool) -> Review:
    review.replies.append(Reply(user_id=user.virtual_id, message=message, marks_addressed=marks_addressed, created_at=datetime.now(timezone.utc).isoformat()))
    if marks_addressed:
        review.status = ReviewStatus.addressed
    await review.save()
    return review
