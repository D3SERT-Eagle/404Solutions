"""
# Registering the route for the translation service:
# - /translate: Uses an LLM to translate text into another language.
#   By default, it auto-detects the source language, but you can optionally specify it for improved accuracy.
"""
from fastapi import APIRouter, HTTPException, Depends
from schemas.translate import TranslateRequest, TranslateResponse
from services.translation_service import translate_with_llm
from utils.get_curr_user import get_current_user

router = APIRouter()

@router.post("/", response_model=TranslateResponse)
def translate(
    request: TranslateRequest,
    user=Depends(get_current_user)
):
    try:
        translated = translate_with_llm(request)
        return TranslateResponse(
            original_text=request.text,
            translated_text=translated,
            source_lang=request.source_lang,
            target_lang=request.target_lang
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
