from pydantic import BaseModel, EmailStr, Field
from app.models.user import UserRole, InstitutionType

class UserRegister(BaseModel):
    name: str = Field(min_length=2)
    email: EmailStr
    password: str = Field(min_length=8)
    role: UserRole
    institution: str | None = None
    institution_type: InstitutionType | None = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    virtual_id: str
    name: str
    email: EmailStr
    role: UserRole
    institution: str | None = None
    institution_type: InstitutionType | None = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
