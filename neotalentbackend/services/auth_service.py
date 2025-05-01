from schemas.auth import RegisterRequest, LoginRequest, AuthResponse
from fastapi import HTTPException
from dotenv import load_dotenv
import datetime
import requests
import jwt
import os

load_dotenv()

POCKETBASE_URL = os.getenv("POCKETBASE_URL")
JWT_SECRET = os.getenv("JWT_SECRET", "supersecret")

def generate_token(user_id: str, email: str):
    """
    Generates a JWT token during user registration or authentication.

    Args:
        user_id (str): The user's ID from the database, used to identify the registered user.
        email (str): The user's email address, obtained during registration or login.

    Returns:
        str: A JWT token string used for authenticated access.
    """

    payload = {
        "sub": email,
        "uid": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def register_user(data: RegisterRequest) -> AuthResponse:
    """
    Registers a new user and generates a JWT token for initial authentication.

    Args:
        data (RegisterRequest): A JSON object containing the user's username and password.

    Returns:
        dict: An authentication response containing the token type and the JWT token.
    """

    resp = requests.post(
        f"{POCKETBASE_URL}/api/collections/users/records",
        json={
            "email": data.email,
            "password": data.password,
            "passwordConfirm": data.password
        }
    )
    if not resp.ok:
        raise Exception(f"Registration failed: {resp.text}")
    record = resp.json()
    user_id = record["id"]
    token = generate_token(user_id, data.email)
    return AuthResponse(access_token=token)

def login_user(data: LoginRequest) -> AuthResponse:
    """
    Authenticates an existing user and issues a JWT token for access to protected routes.

    Args:
        data (LoginRequest): A JSON object containing the user's username and password.

    Returns:
        dict: An authentication response containing the token type and the JWT token.
    """

    response = requests.post(
        f"{POCKETBASE_URL}/api/collections/users/auth-with-password",
        json={
            "identity": data.email,
            "password": data.password
        }
    )
    if not response.ok:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    record = response.json()
    user_id = record["record"]["id"]
    token = generate_token(user_id, data.email)
    return AuthResponse(access_token=token)
