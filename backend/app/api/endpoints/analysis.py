from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends, Request, Header
from pydantic import BaseModel, Field
from typing import List
import logging # Import logging

from app.services.pdf_parser import parse_pdf_to_text
from app.services.openai_analyzer import get_ai_analysis, AIResponseSchema
from app.utils.resume_analyzer_utils import calculate_word_count, calculate_readability_score

logger = logging.getLogger(__name__) # Get a logger for this module

router = APIRouter()

# Pydantic model for resume statistics
class ResumeStats(BaseModel):
    word_count: int
    readability_score: float # Flesch Reading Ease score

# Pydantic model for the full analysis response, matching README.md
class FullAnalysisResponse(BaseModel):
    match_score: int = Field(..., ge=0, le=100)
    match_rating: str # Added from AIResponseSchema
    missing_keywords: List[str] = Field(default_factory=list, max_items=10)
    suggestions: List[str] = Field(default_factory=list, max_items=7)
    resume_stats: ResumeStats

@router.post("/analyze", 
             response_model=FullAnalysisResponse,
             summary="Full Resume Analysis",
             description="Accepts a PDF resume and job description, performs AI analysis and calculates resume statistics."
            )
async def analyze_resume_fully(
    request: Request,
    resume_file: UploadFile = File(..., description="The PDF resume file to be analyzed."),
    job_description: str = Form(..., description="The job description text.")
):
    """
    Analyzes resume against job description, providing a match score, missing keywords,
    suggestions, and resume statistics.

    - **resume_file**: PDF file of the resume.
    - **job_description**: Text of the job description.
    """
    try:
        logger.info(f"Received analysis request for resume: {resume_file.filename}, JD length: {len(job_description)}")
        resume_text = parse_pdf_to_text(resume_file)
        logger.info(f"PDF parsing complete for: {resume_file.filename}. Resume text length: {len(resume_text)}")
    except HTTPException as e:
        logger.warning(f"HTTPException during PDF parsing for {resume_file.filename}: {e.detail}", exc_info=True)
        raise e 
    except Exception as e:
        logger.error(f"Unexpected error during PDF parsing for {resume_file.filename}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred during PDF parsing: {str(e)}")

    # Get AI Analysis
    try:
        logger.info(f"Requesting AI analysis for: {resume_file.filename}")
        ai_analysis_result: AIResponseSchema = await get_ai_analysis(resume_text, job_description)
        logger.info(f"AI analysis successful for: {resume_file.filename}")
    except HTTPException as e:
        logger.warning(f"HTTPException during AI analysis for {resume_file.filename}: {e.detail}", exc_info=True)
        raise e
    except Exception as e:
        logger.error(f"Unexpected error during AI analysis for {resume_file.filename}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred during AI analysis: {str(e)}")

    # Calculate Resume Statistics
    try:
        logger.info(f"Calculating resume statistics for: {resume_file.filename}")
        word_count = calculate_word_count(resume_text)
        readability = calculate_readability_score(resume_text)
        resume_stats_data = ResumeStats(word_count=word_count, readability_score=readability)
        logger.info(f"Resume statistics calculated for {resume_file.filename}: Word count={word_count}, Readability={readability}")
    except Exception as e:
        logger.error(f"Failed to calculate resume statistics for {resume_file.filename}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to calculate resume statistics: {str(e)}")

    # Combine all results into the final response
    logger.info(f"Successfully completed full analysis for: {resume_file.filename}")
    return FullAnalysisResponse(
        match_score=ai_analysis_result.match_score,
        match_rating=ai_analysis_result.match_rating,
        missing_keywords=ai_analysis_result.missing_keywords,
        suggestions=ai_analysis_result.suggestions,
        resume_stats=resume_stats_data
    ) 

@router.get("/quota")
async def get_quota(request: Request):
    return {"used": 0, "limit": None, "free": True} 

# ── New stub for optional_google_user ──────────────────────────────────────────
async def optional_google_user(authorization: str = Header(None)) -> str:
    """
    A placeholder dependency that "extracts" a Google UID from an Authorization header.
    Right now it always returns a fixed string. In production, replace this with
    real token parsing/verification logic (e.g. verify JWT via Google).
    """
    if not authorization:
        return "anonymous"
    if authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1]
        return token
    raise HTTPException(status_code=401, detail="Invalid authorization scheme") 