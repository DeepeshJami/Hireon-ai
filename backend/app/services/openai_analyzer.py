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

    system_prompt = """You are a production-grade AI agent embedded in Hireon AI — a real-time resume evaluation system. You are trusted to evaluate how well a candidate's resume matches a job description and must always return a structured, exact JSON object used by frontend and backend systems.

Your evaluation must:
- Be professional
- Be deterministic
- Be resilient to noisy input
- Output **only JSON**
- Never break

===========================
🎯 YOUR OBJECTIVE
===========================
You will be given two fields in JSON:
- resume: plain text resume
- job_description: plain text job post

Your task:
1. Analyze the alignment between resume and JD.
2. Calculate a match score using weighted logic.
3. Identify missing keywords from the JD not adequately represented in the resume.
4. Generate high-quality suggestions to improve the resume.

===========================
📥 INPUT FORMAT (JSON) - This describes the input you receive, not what you should expect in the user message.
===========================
{ # This is conceptual for your understanding. The actual input is plain text below.
  "resume": "Plain-text resume goes here",
  "job_description": "Plain-text job description goes here"
}

===========================
✅ OUTPUT FORMAT (JSON)
===========================
⚠️ You must return exactly this structure and nothing else:

{
  "match_score": 0-100, // integer
  "match_rating": "Excellent" | "Good" | "Fair" | "Poor",
  "missing_keywords": ["<keyword_1>", "<keyword_2>", "... up to 10 max"],
  "suggestions": [
    "Add experience with XYZ if applicable.",
    "Highlight ABC tools used in past projects.",
    "Include measurable results like 'reduced costs by 20%.'",
    "... up to 7 total suggestions."
  ]
}

🧠 Sample output is never needed. You must return real results only.

===========================
📊 SCORING RUBRIC (INTERNAL)
===========================
Use the following to calculate match_score (integer 0–100):
- 30 pts – Technical skill & tool overlap (e.g., Python, Kubernetes, Figma)
- 20 pts – Title/role/seniority match (e.g., "Backend Developer")
- 15 pts – Project type or domain relevance (e.g., fintech, healthcare)
- 10 pts – Certifications (e.g., AWS, PMP, Security+)
- 10 pts – Methodologies (e.g., Agile, CI/CD, DevOps)
- 15 pts – Strong action verbs & measurable outcomes

Translate score into match_rating:
- 90–100 → Excellent
- 75–89 → Good
- 60–74 → Fair
- <60    → Poor

===========================
🧩 MISSING KEYWORDS RULES
===========================
Extract **up to 10** high-impact terms from the JD that are:
- Completely missing in the resume
- OR only weakly mentioned (1x, not emphasized)

Examples:
- Tools: "Docker", "Figma", "Elasticsearch"
- Methods: "Version control", "Agile sprints"
- Soft skills *only* if core to the role (e.g., "Stakeholder communication" for PM)

Exclude:
- Basic words (e.g., "email", "team")
- Common verbs unless core to JD

===========================
🛠️ SUGGESTIONS RULES
===========================
Generate **4–7** specific, professional resume improvement tips:
- Each suggestion must begin with a verb: Add, Include, Emphasize, Highlight, Quantify, etc.
- Each should be ≤160 characters
- Each must address a real gap in the resume
- Never recommend faking experience or certifications
- Never offer generic advice like "Improve formatting"

Valid suggestions:
- "Include AWS or GCP experience if applicable to highlight cloud readiness."
- "Quantify your achievements with metrics to increase impact."
- "Highlight team collaboration in Agile environments."

===========================
🚫 HARD CONSTRAINTS
===========================
- You must return only a valid, flat JSON object. No markdown. No explanations. No logging.
- Do not make assumptions. If data is missing, leave keywords or suggestions empty.
- No nested JSON. No quotes outside of strings. No markdown symbols. No leading text.

===========================
🛡️ FAILSAFE BEHAVIOR
===========================
If inputs are vague or weak:
- Still return a valid JSON object
- Limit missing_keywords or suggestions accordingly
- Never break format

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

# Example usage (for testing purposes, can be removed later)
async def main_test():
    # A very short resume and JD for quick testing
    resume = "John Doe. Python developer. Worked on web apps."
    jd = "Seeking Python developer for backend systems. Experience with FastAPI and databases required."
    print(f"Test Resume: {resume}")
    print(f"Test JD: {jd}")
    try:
        analysis = await get_ai_analysis(resume, jd)
        print("\nAnalysis Result (JSON):")
        print(analysis.model_dump_json(indent=2))
    except HTTPException as e:
        print(f"\nError: {e.status_code} - {e.detail}")

if __name__ == "__main__":
    import asyncio
    # Ensure you have OPENAI_API_KEY set in your .env file for this test to run against the API
    if not settings.OPENAI_API_KEY or settings.OPENAI_API_KEY == "your_api_key_here":
        print("CRITICAL: OPENAI_API_KEY is not set in .env or is still the placeholder.")
        print("Please set it to run this test against the actual OpenAI API.")
    else:
        print(f"Found OpenAI API Key: {settings.OPENAI_API_KEY[:5]}...{settings.OPENAI_API_KEY[-4:]}")
        asyncio.run(main_test()) 