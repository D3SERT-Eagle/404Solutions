"""
# Registering the calorie estimation endpoint:
# - /calories: Returns the total estimated calories with a breakdown of nutrients and other relevant information
"""
from fastapi import APIRouter, HTTPException, Depends
from schemas.calories import CalorieRequest, CalorieResponse
from services.calorie_service import estimate_calories
from utils.get_curr_user import get_current_user

router = APIRouter()

@router.post("/", response_model=CalorieResponse)
def get_calories(
    request: CalorieRequest, 
    user=Depends(get_current_user)
):
    try:
        total, breakdown = estimate_calories(request)
        return CalorieResponse(
            total_calories=total,
            breakdown=breakdown
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
