from enum import Enum
from beanie import Document
from pydantic import EmailStr, Field

class UserRole(str, Enum):
    student = "student"
    faculty = "faculty"
    industry = "industry"
    mentor = "mentor"
    admin = "admin"

class InstitutionType(str, Enum):
    school = "school"
    college = "college"
    university = "university"

class User(Document):
    virtual_id: str = Field(unique=True)
    name: str
    email: EmailStr = Field(unique=True)
    password_hash: str
    role: UserRole
    institution: str | None = None
    institution_type: InstitutionType | None = None
    created_at: str

    class Settings:
        name = "users"
        indexes = ["email", "virtual_id"]
