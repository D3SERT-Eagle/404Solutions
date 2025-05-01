import os
import requests
from schemas.translate import TranslateRequest

def translate_with_llm(request: TranslateRequest) -> str:
    """
    Translates the given text using an LLM. Automatically detects the source language if not specified, but translation is more accurate when the original language is provided.

    Args:
        request (TranslateRequest): A JSON object containing:
            - 'text': The text to be translated.
            - 'source_lang' (optional): The original language of the text.
            - 'target_lang': The desired target language.

    Returns:
        str: The translated text.
    """
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"
    if not OPENAI_API_KEY:
        raise RuntimeError("OpenAI API key is not configured")
    system_prompt = "You are a professional translator."
    if request.source_lang:
        user_prompt = f"Translate the following text from {request.source_lang} to {request.target_lang}:\n\n{request.text}"
    else:
        user_prompt = f"Detect the language of the following text and translate it to {request.target_lang}:\n\n{request.text}"
    payload = {
        "model": "gpt-4",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.3
    }
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    response = requests.post(OPENAI_API_URL, json=payload, headers=headers)
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"].strip()
