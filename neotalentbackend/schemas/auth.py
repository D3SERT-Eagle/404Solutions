from pydantic import BaseModel

class RegisterRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    access_token: str #Contains Email, DBID and exp info so no need to engineer it further.
    token_type: str = "bearer"
