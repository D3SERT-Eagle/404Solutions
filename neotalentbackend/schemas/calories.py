from pydantic import BaseModel

class CalorieRequest(BaseModel):
    text: str

class CalorieResponse(BaseModel):
    total_calories: int
    breakdown: str  # Natural language explanation
