"""
# Sets up a persistent admin session for the server to process requests as a superuser registered in PocketBase.
# The token is cached globally for simplicity (note: this is not suitable for production environments).
# If the token is expired or invalid, a new login attempt is made to obtain a fresh superuser token.
# This logic simulates more secure practices, such as refreshing tokens based on expiration and storing them securely (e.g., in environment variables).
"""
from dotenv import load_dotenv
import requests
import os


load_dotenv(override=True)

POCKETBASE_URL = os.getenv("POCKETBASE_URL")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")

#Persist token for session
_admin_token = None

def get_admin_token()->str:
    """
    Retrieves the admin token if it exists and is valid. Generates a new token if not.
    """
    global _admin_token
    if _admin_token is None:
        login_admin()
    return _admin_token

def login_admin()-> str:
    """
    Retrieves an admin JWT token for performing database read and write operations.
    """
    global _admin_token
    response = requests.post(
        f"{POCKETBASE_URL}/api/collections/_superusers/auth-with-password",
        json={
            "identity": ADMIN_EMAIL.strip(),
            "password": ADMIN_PASSWORD.strip()
        }
    )
    if response.status_code == 401:
        raise Exception("Admin login failed: Unauthorized (wrong email/password)")
    if not response.ok:
        raise Exception(f"Admin login failed: {response.text}")
    data = response.json()
    _admin_token = data["token"]

def reset_admin_token() -> None:
    """
    Resets the cached admin token, typically after it has expired or become invalid.
    """
    global _admin_token
    _admin_token = None
