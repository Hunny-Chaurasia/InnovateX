from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.user import UserLogin, UserRegister, Token, UserResponse
from app.services.virtual_id_service import generate_virtual_id

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse, status_code=201)
async def register(data: UserRegister):
    if await User.find_one(User.email == data.email):
        raise HTTPException(status_code=409, detail="Email already registered")
    user = User(**data.model_dump(exclude={"password"}), password_hash=hash_password(data.password), virtual_id=await generate_virtual_id(data.role), created_at=datetime.now(timezone.utc).isoformat())
    await user.insert()
    return UserResponse.model_validate(user, from_attributes=True)

@router.post("/login", response_model=Token)
async def login(data: UserLogin):
    user = await User.find_one(User.email == data.email)
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    return Token(access_token=create_access_token(user.virtual_id, user.role.value))
