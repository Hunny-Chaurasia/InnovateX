from datetime import datetime, timezone
import pytest
from fastapi import HTTPException
from app.models.user import InstitutionType, User, UserRole
from app.services.team_service import validate_team_formation


def user(virtual_id, role, institution_type, institution):
    return User(virtual_id=virtual_id, name=virtual_id, email=f"{virtual_id}@example.com", password_hash="hash", role=role, institution_type=institution_type, institution=institution, created_at=datetime.now(timezone.utc).isoformat())

@pytest.mark.asyncio
async def test_same_school_requires_faculty_and_mentor():
    faculty = user("FAC-1", UserRole.faculty, InstitutionType.school, "School A")
    student = user("STU-1", UserRole.student, InstitutionType.school, "School A")
    with pytest.raises(HTTPException):
        await validate_team_formation(student, [student], None, "STU-1")
    await validate_team_formation(faculty, [student], "MEN-1", "STU-1")

@pytest.mark.asyncio
async def test_college_team_is_student_formed():
    student = user("STU-1", UserRole.student, InstitutionType.college, "College A")
    await validate_team_formation(student, [student], None, "STU-1")
