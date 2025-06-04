from openai import OpenAI, APIError, RateLimitError
from fastapi import HTTPException
from pydantic import BaseModel, Field, ValidationError
from typing import List
import json # For parsing OpenAI JSON response
import logging # Import logging

from app.core.config import settings

logger = logging.getLogger(__name__) # Get a logger for this module

# Initialize the OpenAI client
# It will automatically pick up the OPENAI_API_KEY from the environment if not passed explicitly.
# To ensure it uses the key from our .env via Pydantic settings, we pass it directly.
if not settings.OPENAI_API_KEY or settings.OPENAI_API_KEY == "your_api_key_here":
    logger.critical("OPENAI_API_KEY is not configured or is still the placeholder. The OpenAI client cannot be initialized.")
    # Depending on desired behavior, you might raise an error here or allow client to be None / uninitialized.
    # For now, let's allow it to proceed, and an error will occur if get_ai_analysis is called.
    # Or, more strictly:
    # raise OpenAIError("OPENAI_API_KEY is not configured. Please set it in your .env file.") 
    # However, OpenAIError is not defined here, so a general Exception or specific handling is needed.
    # The OpenAI() call below will fail if the key is invalid, which is an acceptable outcome.

client = OpenAI(api_key=settings.OPENAI_API_KEY)

# Define Pydantic models for the expected structured response from OpenAI

# The suggestions are just strings according to the new output format
# class AISuggestion(BaseModel):
#     suggestion: str

class AIResponseSchema(BaseModel):
    match_score: int = Field(..., ge=0, le=100, description="The match score between 0 and 100.")
    match_rating: str = Field(..., description="The qualitative match rating (Excellent, Good, Fair, Poor).")
    missing_keywords: List[str] = Field(default_factory=list, max_items=10, description="Keywords missing from the resume (max 10).")
    suggestions: List[str] = Field(default_factory=list, max_items=7, description="Suggestions for improvement (max 7, each <= 160 chars).")
    # TBD: Add resume_stats if OpenAI is to generate them, or keep them separate.

async def get_ai_analysis(resume_text: str, job_description_text: str) -> AIResponseSchema:
    """
    Analyzes the resume against the job description using OpenAI GPT.
    Ensures the output is a valid JSON object matching AIResponseSchema.
    """
    logger.info(f"Starting AI analysis. Resume length: {len(resume_text)}, JD length: {len(job_description_text)}")

    system_prompt = """You are **Hireon AI** — an elite, deterministic resume-to-JD evaluator trusted in production.

════════ INPUT ════════
A single JSON object exactly:
{
  "resume": "<plain text>",
  "job_description": "<plain text>"
}

════════ TASK ═════════
1 Compute MATCH_SCORE (0-100) using the rubric below.  
2 Translate score → MATCH_RATING:  
   90-100 Excellent • 75-89 Good • 60-74 Fair • <60 Poor  
3 List up to 10 high-leverage JD keywords absent OR only weakly mentioned (≤1 occurrence outside a "Skills/Tech" section).  
4 Generate 4-7 laser-focused SUGGESTIONS (≤160 chars, each starts with a verb) ranked by ROI to the candidate.  
   ✗ Never suggest faking experience or "improve formatting".  
   ✗ No layout/formatting advice.

════════ BEST-IN-CLASS SCORING RUBRIC (sum = 100) ═════════
1. **Core Technical Skills**     20 pts  
   • Skills tagged "Required" or in JD title.  
   • Award = 20 × (matched_core / total_core).

2. **Secondary / Nice-to-Have Skills** 10 pts  
   • "Preferred/Nice" in JD.  
   • Award = 10 × (matched_secondary / total_secondary).

3. **Skill Depth & Emphasis**   10 pts  
   • +1 if skill appears in "Skills/Tech Stack" heading.  
   • +0.5 if inside Experience bullet.  
   • Award = min(10, Σdepth).

4. **Role / Title / Seniority Fit** 15 pts  
   • Exact title match → 15 Synonym → 12 ±1 level → 8.

5. **Domain / Industry Relevance** 10 pts  
   • Proportional overlap of domain keywords (fintech, healthcare, …).

6. **Certifications & Licenses**  10 pts  
   • +5 per required cert matched, up to 10.

7. **Methodologies & Processes**  10 pts  
   • Agile, DevOps, CI/CD, etc.  
   • Award = 10 × (matched / listed_in_JD).

8. **Impact Verbs & Quantified Results** 10 pts  
   • ≥3 bullets with action verb + metric → 10; 1-2 → 5; none → 0.

9. **Strategic / Leadership Soft Skills** 5 pts  
   • Score only if JD explicitly lists them.  
   • Award = 5 × (matched / listed_soft_skills).

════════ OUTPUT (strict JSON) ════════
Return **only**:
{
  "match_score": <int>,
  "match_rating": "Excellent" | "Good" | "Fair" | "Poor",
  "missing_keywords": ["<kw1>", … up to 10],
  "suggestions": ["<tip1>", … 4-7 items]
}

════════ FAILSAFE ════════
If either input is missing, empty, or mostly noise:  
• "match_score": 0 • "match_rating": "Poor" • arrays empty.  
**Never output text outside the braces nor extra keys.**

════════ HARD CONSTRAINTS ════════
• Output must be valid JSON on the first try.  
• Deterministic: no random phrasing, no variability across runs with same input.  
• No explanations, logs, markdown, or comments.


Begin processing now."""

    user_content = json.dumps({
        "resume": resume_text,
        "job_description": job_description_text
    })

    try:
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo-1106",  # Using a model that supports JSON mode
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            response_format={ "type": "json_object" }, # Request JSON output
            temperature=0.2, # Lower temperature for more deterministic output
            max_tokens=1000 # Adjust as needed, ensure enough for the JSON structure
        )

        ai_response_content = completion.choices[0].message.content

        if not ai_response_content:
            logger.error("AI service returned an empty response.")
            raise HTTPException(status_code=500, detail="AI service returned an empty response.")

        logger.info(f"AI service returned content. Length: {len(ai_response_content)}. Attempting to parse.")
        # Attempt to parse the JSON string from AI into our Pydantic model
        try:
            parsed_data = json.loads(ai_response_content)
            validated_response = AIResponseSchema(**parsed_data)
            logger.info("Successfully parsed and validated AI response.")
            return validated_response
        except json.JSONDecodeError as json_err:
            logger.error(f"Failed to decode JSON from AI. Error: {json_err}. Content: {ai_response_content[:500]}...", exc_info=True)
            raise HTTPException(status_code=500, detail="AI service returned invalid JSON format.")
        except ValidationError as e:
            logger.error(f"AI response validation error: {e.errors()}. Content: {ai_response_content[:500]}...", exc_info=True)
            raise HTTPException(status_code=500, detail=f"AI service response does not match expected structure: {e.errors()}")

    except RateLimitError as e:
        logger.warning(f"OpenAI API rate limit exceeded: {e}")
        raise HTTPException(status_code=429, detail="OpenAI API rate limit exceeded. Please try again later.")
    except APIError as e:
        logger.error(f"OpenAI API returned an error: {e}", exc_info=True)
        raise HTTPException(status_code=502, detail=f"OpenAI API returned an error: {e.message if hasattr(e, 'message') else str(e)}")
    except Exception as e:
        logger.error(f"An unexpected error occurred with OpenAI service: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred with OpenAI service: {str(e)}")

# End of production code. Removed __main__ test block for deployment. 