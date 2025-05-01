import os
import requests
from schemas.calories import CalorieRequest

def estimate_calories(request: CalorieRequest) -> tuple[int, str]:
    """
    Estimates calories based on a meal description or list of ingredients, and returns the total estimated calories along with insights into the meal and its nutritional value.

    Note:
        Calorie information is estimated by a general-purpose LLM and may not be accurate. Use results with caution.

    Args:
        request (CalorieRequest): A JSON object containing the 'text' field, which describes the meal or ingredients.

    Returns:
        tuple: A tuple containing the estimated number of calories (int) and a string with nutrition insights.
    """
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"
    if not OPENAI_API_KEY:
        raise RuntimeError("OpenAI API key is missing")
    system_prompt = (
    "You are a nutritionist AI that estimates calorie intake based on meals or ingridients. "
    "Be concise: provide a total calorie count followed by a brief breakdown. "
    "Always begin your response with 'Total calories' followed by the number. "
    "Do not break this pattern, as it's required for parsing."
    )
    user_prompt = f"Estimate calories for: {request.text}"
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.4
    }
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    res = requests.post(OPENAI_API_URL, json=payload, headers=headers)
    res.raise_for_status()
    output = res.json()["choices"][0]["message"]["content"].strip()
    # Extract only the number of total calories consumed.
    import re
    match = re.search(r'(?i)(?:total\s+)?calories\s*[:\-]?\s*(\d+)', output)
    total = int(match.group(1)) if match else 0
    return total, output
