from datetime import datetime, timezone
import pytest
from fastapi import HTTPException
from app.models.user import User, UserRole
from app.services.review_service import create_review
from app.schemas.review import ReviewCreate

@pytest.mark.asyncio
async def test_only_industry_can_create_review(mongo_database):
    student = User(virtual_id="STU-2026-0001", name="Student", email="student@example.com", password_hash="hash", role=UserRole.student, created_at=datetime.now(timezone.utc).isoformat())
    with pytest.raises(HTTPException) as error:
        await create_review(student, ReviewCreate(project_id="project", overall_assessment="long enough assessment", flaws="long enough flaws", improvements_needed="long enough improvements"))
    assert error.value.status_code == 403

def test_review_fields_require_ten_characters():
    with pytest.raises(ValueError):
        ReviewCreate(project_id="project", overall_assessment="short", flaws="long enough flaws", improvements_needed="long enough improvements")
