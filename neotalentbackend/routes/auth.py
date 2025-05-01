"""
# Registering routes for authentication purposes:
# - Register: Create new users for application access
# - Login: Authenticate existing users to access the application
"""
from fastapi import APIRouter
from schemas.auth import LoginRequest, RegisterRequest, AuthResponse
from services.auth_service import login_user, register_user

router = APIRouter()

@router.post("/register", response_model=AuthResponse)
def register(data: RegisterRequest):
    return register_user(data)

@router.post("/login", response_model=AuthResponse)
def login(data: LoginRequest):
    return login_user(data)
