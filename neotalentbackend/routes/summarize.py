"""
# Registering the route for summarizing PDF documents:
# - /summarize: Returns a summary of uploaded PDF documents and saves the summary to the database for later reference
"""
from fastapi import APIRouter, UploadFile, File, Depends
from services.ai_service import summarize_pdf, save_summary_to_pocketbase
from utils.pdf_parser import extract_text_from_pdf
from schemas.summarize import SummaryResponse
from utils.get_curr_user import get_current_user


router = APIRouter()


@router.post("/", response_model=SummaryResponse)
async def summarize(
    file: UploadFile = File(...),
    user=Depends(get_current_user)
):
    text = await extract_text_from_pdf(file)
    summary = summarize_pdf(text)

    # Save to Pocketbase using secure ID from JWT
    save_summary_to_pocketbase(user_id=user["user_id"], summary_text=summary)

    return {"summary": summary}
