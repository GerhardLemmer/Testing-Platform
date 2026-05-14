from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from infrastructure.dependencies import get_db
from infrastructure.scenario_repository import get_user_by_email, create_user
from infrastructure.auth import hash_password, verify_password, create_access_token
from adapters.schemas import UserRegisterSchema, UserLoginSchema, TokenSchema

router = APIRouter()

@router.post("/auth/register")
def register(payload: UserRegisterSchema, db: Session = Depends(get_db)):
    existing_user = get_user_by_email(db, payload.email)
    if existing_user:
        raise HTTPException(status_code = 400, detail = "Email is already registered")
    hashed = hash_password(payload.password)
    user = create_user(db, payload.email, hashed, payload.full_name)
    return {"message": f"User '{user.full_name}' has been successfully registered"}

@router.post("/auth/login")
def login(payload: UserLoginSchema, db: Session = Depends(get_db)):
    user = get_user_by_email(db, payload.email)
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code = 401, detail = "Invalid email or password")
    token = create_access_token({"sub": user.id})
    return {"access_token": token, "token_type": "bearer"}