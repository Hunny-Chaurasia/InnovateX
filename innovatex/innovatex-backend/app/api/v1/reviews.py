from fastapi import APIRouter, Depends, HTTPException
from app.api.deps import get_current_user
from app.models.review import Review, ReviewStatus
from app.models.user import User, UserRole
from app.schemas.review import ReviewCreate, ReviewResponse, ReplyCreate, ReviewDecision
from app.services.review_service import add_reply, create_review

router = APIRouter(prefix="/reviews", tags=["reviews"])

def response(review):
    return ReviewResponse.model_validate(review, from_attributes=True)

@router.post("", response_model=ReviewResponse, status_code=201)
async def add_review(data: ReviewCreate, user: User = Depends(get_current_user)):
    return response(await create_review(user, data))

@router.post("/{review_id}/replies", response_model=ReviewResponse)
async def reply(review_id: str, data: ReplyCreate, user: User = Depends(get_current_user)):
    review = await Review.get(review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return response(await add_reply(review, user, data.message, data.marks_addressed))

@router.post("/{review_id}/decision", response_model=ReviewResponse)
async def decision(review_id: str, data: ReviewDecision, user: User = Depends(get_current_user)):
    if user.role != UserRole.industry:
        raise HTTPException(status_code=403, detail="Only industry users can decide reviews")
    review = await Review.get(review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    review.status = ReviewStatus.resolved if data.resolve else ReviewStatus.open
    await review.save()
    return response(review)
