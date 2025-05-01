from pydantic import BaseModel
from typing import Optional

class TranslateRequest(BaseModel):
    text: str
    target_lang: str
    source_lang: Optional[str] = None

class TranslateResponse(BaseModel):
    original_text: str
    translated_text: str
    source_lang: Optional[str]
    target_lang: str
