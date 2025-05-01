from services.admin_session import get_admin_token, reset_admin_token
from dotenv import load_dotenv
import requests
import openai
import os
load_dotenv()

POCKETBASE_URL = os.getenv("POCKETBASE_URL")
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def summarize_pdf(text: str) -> str:
    """
    Generates a summary of the PDF uploaded by the user and stores it in the database for future reference.

    Args:
        text (str): The input string compiled by parsing the uploaded PDF. This text will be summarized.

    Returns:
        str: The summarized text parsed from the OpenAI response.
    """
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Summarize the following PDF:"},
            {"role": "user", "content": text}
        ]
    )
    return response.choices[0].message.content

def save_summary_to_pocketbase(user_id: str, summary_text: str) -> None:
    """
    Saves the summary text to the database and links it to the logged-in user.

    Args:
        user_id (str): The ID of the user, used to associate the summary with the correct account.
        summary_text (str): The summarized text to be stored, typically returned from the summarize_pdf function.

    Returns:
        None
    """
    summary_data = {
        "summary_text": summary_text,
        "user": user_id
    }
    try:
        response = requests.post(
            f"{POCKETBASE_URL}/api/collections/summaries/records",
            json=summary_data,
            headers={
                "Authorization": f"Bearer {get_admin_token()}"
            }
        )
        if response.status_code == 401 or response.status_code == 403:
            # Token expired, reset and retry
            reset_admin_token()
            response = requests.post(
                f"{POCKETBASE_URL}/api/collections/summaries/records",
                json=summary_data,
                headers={
                    "Authorization": f"Bearer {get_admin_token()}"
                }
            )
        if not response.ok:
            raise Exception(f"Failed to save summary: {response.text}")
    except Exception as e:
        raise Exception(f"Pocketbase request failed: {str(e)}")
