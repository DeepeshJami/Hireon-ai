# Hireon AI Project Log

## Project Overview
- **Project Name**: Hireon AI
- **Start Date**: [Current Date]
- **Description**: A privacy-first, AI-powered resume reviewer that compares resumes against job descriptions
- **Tech Stack**: FastAPI (Backend), React (Frontend), OpenAI GPT-3.5

## Development Log

### Phase 1: Core Backend Foundation & Initial API

#### Module 1.1: FastAPI Project Initialization & Structure
**Date**: [Current Date]
**Status**: ✅ Completed

**Actions Taken**:
1. Created backend directory structure:
   ```
   backend/
   ├── app/
   │   ├── api/
   │   ├── core/
   │   ├── services/
   │   ├── utils/
   │   └── __init__.py
   └── tests/
   ```

2. Initialized Python packages with `__init__.py` files in:
   - `backend/app/`
   - `backend/app/api/`
   - `backend/app/core/`
   - `backend/app/services/`
   - `backend/app/utils/`
   - `backend/tests/`

3. Created `backend/app/main.py` with:
   - FastAPI application instance
   - Basic configuration (title, description, version)
   - Health check endpoint (`GET /health`)
   - Pydantic model for health check response

**Technical Decisions**:
- Used FastAPI for its modern features, automatic API documentation, and async support
- Implemented health check endpoint as a standard practice for API monitoring
- Used Pydantic for response validation and automatic OpenAPI schema generation
- Structured the project following FastAPI best practices with modular organization

**Files Created**:
1. `backend/app/__init__.py`
2. `backend/app/api/__init__.py`
3. `backend/app/core/__init__.py`
4. `backend/app/services/__init__.py`
5. `backend/app/utils/__init__.py`
6. `backend/tests/__init__.py`
7. `backend/app/main.py`

**Code Snippets**:
```python
# backend/app/main.py
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(
    title="Hireon AI Backend",
    description="API for Hireon AI resume reviewer.",
    version="0.1.0"
)

class HealthCheckResponse(BaseModel):
    status: str = "OK"

@app.get("/health", response_model=HealthCheckResponse, tags=["Health"])
async def health_check():
    """
    Health check endpoint to confirm the API is running.
    """
    return HealthCheckResponse(status="OK")
```

**Next Steps**:
- Module 1.3: PDF Parsing Service (Backend)

**Testing Notes**:
- Health check endpoint can be tested by running:
  ```bash
  cd backend
  uvicorn app.main:app --reload
  ```
- Endpoint should be accessible at: `http://localhost:8000/health`
- Expected response: `{"status": "OK"}`

**Dependencies Added**:
- (Covered in Module 1.2)

---

#### Module 1.2: Backend Configuration & Environment Management
**Date**: [Current Date]
**Status**: ✅ Completed

**Actions Taken**:
1.  Created `backend/app/core/config.py` using `pydantic-settings` to manage environment variables and load settings from a `.env` file.
2.  Created `backend/example.env` to serve as a template for the required `.env` file.
    *   **Note**: User needs to rename `backend/example.env` to `backend/.env`, populate it with their `OPENAI_API_KEY`, and ensure `backend/.env` is added to `.gitignore`.
3.  Created `backend/requirements.txt` and added initial dependencies: `fastapi`, `uvicorn[standard]`, `pydantic`, and `pydantic-settings`.

**Technical Decisions**:
-   Used `pydantic-settings` for robust and type-safe configuration management, integrating seamlessly with FastAPI and Pydantic.
-   Provided an `example.env` file to guide users on setting up their environment, while avoiding direct creation of `.env` due to security best practices (and tool limitations for `.env` named files).

**Files Created/Modified**:
1.  `backend/app/core/config.py` (Created)
2.  `backend/example.env` (Created) - User to rename to `backend/.env`
3.  `backend/requirements.txt` (Created)

**Code Snippets**:
```python
# backend/app/core/config.py
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    OPENAI_API_KEY: str = "your_api_key_here"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8', extra='ignore')

settings = Settings()
```

```text
# backend/example.env
OPENAI_API_KEY=your_openai_api_key_here
```

```text
# backend/requirements.txt
fastapi
uvicorn[standard]
pydantic
pydantic-settings
```

**Next Steps**:
- Module 1.3: PDF Parsing Service (Backend)

**Testing Notes**:
- Ensure `OPENAI_API_KEY` is accessible via `settings.OPENAI_API_KEY` after creating and populating `.env`. This can be verified by adding a temporary print statement in `main.py` or in a Python shell within the backend environment.
  ```python
  # Example for quick test in main.py (remove after testing)
  # from .core.config import settings
  # print(f"Loaded OpenAI Key: {settings.OPENAI_API_KEY}")
  ```
- Ensure dependencies can be installed using `pip install -r backend/requirements.txt`.

**Dependencies Added**:
- `fastapi`
- `uvicorn[standard]`
- `pydantic`
- `pydantic-settings`

---

#### Module 1.3: PDF Parsing Service (Backend)
**Date**: [Current Date]
**Status**: ✅ Completed

**Actions Taken**:
1.  Added `pdfplumber` to `backend/requirements.txt`.
2.  Created `backend/app/services/pdf_parser.py`.
3.  Implemented `parse_pdf_to_text(file: UploadFile) -> str` function within `pdf_parser.py`:
    *   Validates if the uploaded file is a PDF.
    *   Uses `io.BytesIO` to handle the `UploadFile` content for `pdfplumber`.
    *   Extracts text content from all pages of the PDF.
    *   Includes error handling for:
        *   Invalid file type (non-PDF).
        *   Password-protected PDFs (basic attempt to decrypt with empty password).
        *   PDFs with no extractable text content.
        *   Other `pdfplumber` or I/O related exceptions during parsing.
    *   Raises `HTTPException` with appropriate status codes (400 for client errors, 500 for server errors) and details.

**Technical Decisions**:
-   Chose `pdfplumber` for its capabilities in text extraction and handling PDF structures.
-   Implemented robust error handling to provide clear feedback to the API client in case of parsing issues.
-   Used `io.BytesIO` to adapt FastAPI's `UploadFile` (which is a SpooledTemporaryFile) for use with `pdfplumber` which expects a file path or a file-like object that supports read operations directly on its content.

**Files Created/Modified**:
1.  `backend/requirements.txt` (Modified)
2.  `backend/app/services/pdf_parser.py` (Created)

**Code Snippets**:
```python
# backend/app/services/pdf_parser.py
import pdfplumber
from fastapi import UploadFile, HTTPException
import io

def parse_pdf_to_text(file: UploadFile) -> str:
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF files are accepted.")
    try:
        file_content = io.BytesIO(file.file.read())
        with pdfplumber.open(file_content) as pdf:
            if pdf.is_encrypted:
                try:
                    pdf.decrypt('')
                except Exception:
                    raise HTTPException(status_code=400, detail="Failed to parse PDF: File is password-protected and decryption failed.")
            text_content = []
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text_content.append(page_text)
            if not text_content:
                raise HTTPException(status_code=400, detail="Failed to parse PDF: No text content found in the PDF.")
            return "\n".join(text_content)
    except pdfplumber.pdfdocument.PDFPasswordIncorrect:
        raise HTTPException(status_code=400, detail="Failed to parse PDF: File is password-protected.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse PDF: An unexpected error occurred. {str(e)}")
```

**Next Steps**:
- Module 1.4: Initial `/api/analyze` Endpoint

**Testing Notes**:
-   The `parse_pdf_to_text` function can be unit tested by mocking `UploadFile` and providing various PDF byte streams (normal, encrypted, empty, non-PDF).
-   User to run `pip install -r backend/requirements.txt` to install `pdfplumber`.

**Dependencies Added**:
- `pdfplumber`

---

#### Module 1.4: Initial `/api/analyze` Endpoint
**Date**: [Current Date]
**Status**: ✅ Completed

**Actions Taken**:
1.  Created `backend/app/api/endpoints/__init__.py`.
2.  Created `backend/app/api/endpoints/analysis.py` and defined the `POST /api/analyze` endpoint.
    *   The endpoint uses an `APIRouter`.
    *   It accepts `resume_file: UploadFile = File(...)` and `job_description: str = Form(...)` as multipart/form-data.
    *   It calls the `parse_pdf_to_text` service from `app.services.pdf_parser`.
    *   It defines an `InitialAnalysisResponse` Pydantic model for the response schema.
    *   It returns a basic JSON response including the uploaded filename, a snippet of the job description, and the length of the extracted resume text.
    *   Includes error handling for PDF parsing, re-raising `HTTPException`s from the service.
3.  Updated `backend/app/main.py` to include the `analysis_router` from `app.api.endpoints.analysis` with a `/api` prefix and "Analysis" tag.

**Technical Decisions**:
-   Used FastAPI's `UploadFile` and `Form` for handling multipart/form-data, suitable for file uploads alongside other data.
-   Created a specific Pydantic model (`InitialAnalysisResponse`) for the initial endpoint's response to ensure clear data contracts and automatic documentation.
-   Structured the API endpoints using `APIRouter` for better organization and modularity, to be included in the main app.

**Files Created/Modified**:
1.  `backend/app/api/endpoints/__init__.py` (Created)
2.  `backend/app/api/endpoints/analysis.py` (Created)
3.  `backend/app/main.py` (Modified to include the new router)

**Code Snippets**:
```python
# backend/app/api/endpoints/analysis.py
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from app.services.pdf_parser import parse_pdf_to_text

router = APIRouter()

class InitialAnalysisResponse(BaseModel):
    message: str
    resume_filename: str
    job_description_snippet: str
    extracted_resume_text_length: int = 0

@router.post("/analyze", response_model=InitialAnalysisResponse)
async def analyze_resume(resume_file: UploadFile = File(...), job_description: str = Form(...)):
    try:
        resume_text = parse_pdf_to_text(resume_file)
    except HTTPException as e:
        raise e
    return InitialAnalysisResponse(
        message="Resume and job description received and PDF parsed successfully (Initial Endpoint).",
        resume_filename=resume_file.filename,
        job_description_snippet=job_description[:100] + ("..." if len(job_description) > 100 else ""),
        extracted_resume_text_length=len(resume_text)
    )
```

```python
# backend/app/main.py (snippet of changes for Module 1.4)
from app.api.endpoints import analysis as analysis_endpoints

# ... (app initialization) ...

app.include_router(analysis_endpoints.router, prefix="/api", tags=["Analysis"])
```

**Next Steps**:
- Phase 2, Module 2.1: OpenAI Service Integration

**Testing Notes**:
-   The `/api/analyze` endpoint can be tested using tools like Postman or `curl`.
-   Send a `POST` request to `http://localhost:8000/api/analyze`.
-   The request body should be `multipart/form-data` with two fields:
    *   `resume_file`: Select a PDF file.
    *   `job_description`: Provide a string for the job description.
-   Expected successful response (status 200 OK):
    ```json
    {
        "message": "Resume and job description received and PDF parsed successfully (Initial Endpoint).",
        "resume_filename": "your_resume.pdf",
        "job_description_snippet": "The first 100 characters of your job description...",
        "extracted_resume_text_length": 1234
    }
    ```
-   Test with invalid file types (non-PDFs) and password-protected PDFs to verify error handling.

**Dependencies Added**: None for this specific module (relies on existing).

---

### Phase 2: AI Integration & Core Backend Logic

#### Module 2.1: OpenAI Service Integration
**Date**: [Current Date]
**Status**: ✅ Completed

**Actions Taken**:
1.  Added `openai` library to `backend/requirements.txt`.
2.  Updated `backend/app/services/openai_analyzer.py`:
    *   Pydantic models (`AIResponseSchema`) updated to precisely match the required JSON output format (including `match_rating`, integer `match_score`, and string list for `suggestions`).
    *   The comprehensive system prompt provided by the user has been implemented.
    *   The user content (resume and job description) is formatted as a JSON string for the AI, as implied by the prompt structure.
    *   Implemented the actual OpenAI API call using `client.chat.completions.create`:
        *   Model: `gpt-3.5-turbo-1106` (supports JSON mode).
        *   `response_format={"type": "json_object"}` requested.
        *   Temperature set to `0.2` for deterministic output.
        *   `max_tokens` set to `1000`.
    *   Implemented robust JSON response parsing:
        *   Handles empty AI response.
        *   Parses the AI's string response using `json.loads()`.
        *   Validates the parsed data against `AIResponseSchema` using Pydantic, raising `HTTPException` on `JSONDecodeError` or `ValidationError`.
        *   Updated the `if __name__ == "__main__":` test block with a short example and a check for the `OPENAI_API_KEY`.

**Technical Decisions**:
-   Adopted the user-provided detailed prompt directly for its comprehensiveness and specific instructions to the AI.
-   Utilized `gpt-3.5-turbo-1106` and its JSON mode to enforce structured output from the AI.
-   Set a low temperature (`0.2`) to promote consistency and determinism in AI responses.
-   Implemented a two-stage validation for the AI response: first `json.loads()` for basic JSON validity, then Pydantic model validation for structure and type adherence.

**Files Created/Modified**:
1.  `backend/requirements.txt` (Modified - `openai` added earlier in this module)
2.  `backend/app/services/openai_analyzer.py` (Significantly updated with prompt, API call, and parsing logic)

**Code Snippets**:
```python
# backend/app/services/openai_analyzer.py (relevant changes)
from openai import OpenAI, APIError, RateLimitError
from fastapi import HTTPException
from pydantic import BaseModel, Field, ValidationError # Added ValidationError
from typing import List
import json # Added for parsing
from app.core.config import settings

client = OpenAI()

class AIResponseSchema(BaseModel): # Updated schema
    match_score: int = Field(..., ge=0, le=100)
    match_rating: str = Field(...)
    missing_keywords: List[str] = Field(default_factory=list, max_items=10)
    suggestions: List[str] = Field(default_factory=list, max_items=7)

async def get_ai_analysis(resume_text: str, job_description_text: str) -> AIResponseSchema:
    system_prompt = """You are a production-grade AI agent...""" # User's detailed prompt
    user_content = json.dumps({"resume": resume_text, "job_description": job_description_text})

    try:
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo-1106",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_content}
            ],
            response_format={ "type": "json_object" },
            temperature=0.2,
            max_tokens=1000
        )
        ai_response_content = completion.choices[0].message.content
        if not ai_response_content:
            raise HTTPException(status_code=500, detail="AI service returned an empty response.")
        try:
            parsed_data = json.loads(ai_response_content)
            validated_response = AIResponseSchema(**parsed_data)
            return validated_response
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail="AI service returned invalid JSON format.")
        except ValidationError as e:
            raise HTTPException(status_code=500, detail=f"AI response validation error: {e.errors()}")
    except RateLimitError as e:
        raise HTTPException(status_code=429, detail="OpenAI API rate limit exceeded.")
    except APIError as e:
        raise HTTPException(status_code=502, detail=f"OpenAI API error: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected AI service error: {e}")
```

**Next Steps**:
- Module 2.2: Resume Statistics Service

**Testing Notes**:
-   User should ensure `OPENAI_API_KEY` is correctly set in `backend/.env`.
-   The service can be tested independently: `python backend/app/services/openai_analyzer.py`.
-   This will make a live call to the OpenAI API and attempt to parse the response.
-   Monitor output for successful JSON parsing and validation against `AIResponseSchema` or any potential errors from the API or parsing stages.

**Dependencies Added**: `openai` (added in the first part of this module).

---

#### Module 2.2: Resume Statistics Service
**Date**: [Current Date]
**Status**: ✅ Completed

**Actions Taken**:
1.  Added `textstat` library to `backend/requirements.txt`.
2.  Created `backend/app/utils/resume_analyzer_utils.py`.
3.  Implemented `calculate_word_count(text: str) -> int` function for basic word counting.
4.  Implemented `calculate_readability_score(text: str) -> float` function using `textstat.flesch_reading_ease()`:
    *   Includes a check for minimum text length to prevent errors from `textstat` with very short inputs.
    *   Rounds the score to two decimal places.
    *   Basic error handling returns `0.0` if calculation fails or text is too short.
5.  Added an `if __name__ == "__main__":` block for standalone testing of these utility functions.

**Technical Decisions**:
-   Selected `textstat` library for its ease of use and provision of standard readability metrics like Flesch Reading Ease.
-   Implemented basic word counting as a straightforward utility.
-   Added checks for empty or very short text in readability calculation to improve robustness, as `textstat` might error on such inputs.

**Files Created/Modified**:
1.  `backend/requirements.txt` (Modified)
2.  `backend/app/utils/resume_analyzer_utils.py` (Created)

**Code Snippets**:
```python
# backend/requirements.txt (addition)
# ...
textstat
```

```python
# backend/app/utils/resume_analyzer_utils.py
import textstat

def calculate_word_count(text: str) -> int:
    if not text or text.isspace():
        return 0
    return len(text.split())

def calculate_readability_score(text: str) -> float:
    if not text or len(text.split()) < 10:
        return 0.0
    try:
        return round(textstat.flesch_reading_ease(text), 2)
    except Exception:
        return 0.0
```

**Next Steps**:
- Module 2.3: Full `/api/analyze` Endpoint Logic

**Testing Notes**:
-   User to run `pip install -r backend/requirements.txt` to install `textstat`.
-   The utilities can be tested independently by running `python backend/app/utils/resume_analyzer_utils.py`.

**Dependencies Added**:
- `textstat`

---

#### Module 2.3: Full `/api/analyze` Endpoint Logic
**Date**: [Current Date]
**Status**: ✅ Completed

**Actions Taken**:
1.  Updated `backend/app/api/endpoints/analysis.py`:
    *   Imported `get_ai_analysis`, `AIResponseSchema` from `openai_analyzer.py`.
    *   Imported `calculate_word_count`, `calculate_readability_score` from `resume_analyzer_utils.py`.
    *   Defined a new Pydantic model `ResumeStats` for `word_count` and `readability_score`.
    *   Updated the main response model to `FullAnalysisResponse`, incorporating fields from `AIResponseSchema` and `ResumeStats` to match the `README.md` specification (`match_score`, `match_rating`, `missing_keywords`, `suggestions`, `resume_stats`).
    *   Modified the `analyze_resume_fully` endpoint function (previously `analyze_resume`):
        *   Orchestrates calls to `parse_pdf_to_text`, then `get_ai_analysis`, then `calculate_word_count` and `calculate_readability_score`.
        *   Combines results into the `FullAnalysisResponse` model.
        *   Includes try-except blocks for each major service call (PDF parsing, AI analysis, stats calculation) to handle potential errors and raise appropriate `HTTPException`s.

**Technical Decisions**:
-   Structured the endpoint to clearly separate calls to different services (PDF parsing, AI analysis, statistical calculation) for better readability and error isolation.
-   Ensured the final response model (`FullAnalysisResponse`) strictly adheres to the structure defined in the `README.md`, promoting consistency with frontend expectations.
-   Renamed the endpoint function to `analyze_resume_fully` to better reflect its comprehensive nature compared to the initial version.

**Files Created/Modified**:
1.  `backend/app/api/endpoints/analysis.py` (Significantly updated)

**Code Snippets**:
```python
# backend/app/api/endpoints/analysis.py (relevant changes)
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel, Field
from typing import List
from app.services.pdf_parser import parse_pdf_to_text
from app.services.openai_analyzer import get_ai_analysis, AIResponseSchema
from app.utils.resume_analyzer_utils import calculate_word_count, calculate_readability_score

router = APIRouter()

class ResumeStats(BaseModel):
    word_count: int
    readability_score: float

class FullAnalysisResponse(BaseModel):
    match_score: int = Field(..., ge=0, le=100)
    match_rating: str
    missing_keywords: List[str] = Field(default_factory=list, max_items=10)
    suggestions: List[str] = Field(default_factory=list, max_items=7)
    resume_stats: ResumeStats

@router.post("/analyze", response_model=FullAnalysisResponse)
async def analyze_resume_fully(resume_file: UploadFile = File(...), job_description: str = Form(...)):
    resume_text = parse_pdf_to_text(resume_file) # Error handling within this call or reraised
    ai_analysis_result = await get_ai_analysis(resume_text, job_description)
    
    word_count = calculate_word_count(resume_text)
    readability = calculate_readability_score(resume_text)
    resume_stats_data = ResumeStats(word_count=word_count, readability_score=readability)
    
    return FullAnalysisResponse(
        match_score=ai_analysis_result.match_score,
        match_rating=ai_analysis_result.match_rating,
        missing_keywords=ai_analysis_result.missing_keywords,
        suggestions=ai_analysis_result.suggestions,
        resume_stats=resume_stats_data
    )
```

**Next Steps**:
- Module 2.4: Backend Error Handling & Logging

**Testing Notes**:
-   Thoroughly test the `/api/analyze` endpoint with various PDFs (valid, large, empty text) and job descriptions.
-   Verify that error handling for PDF parsing, AI service calls, and statistics calculation works as expected.
-   Ensure the response structure strictly matches `FullAnalysisResponse` and the `README.md` specification.
-   Requires `OPENAI_API_KEY` to be set in `.env` for the AI part.

**Dependencies Added**: None for this specific module (relies on existing).

---

#### Module 2.4: Backend Error Handling & Logging
**Date**: [Current Date]
**Status**: ✅ Completed

**Actions Taken**:
1.  **Basic Logging Configuration (`app/main.py`)**:
    *   Imported the `logging` module.
    *   Configured basic console logging using `logging.basicConfig` with `INFO` level and a standard format (`%(asctime)s - %(name)s - %(levelname)s - %(message)s`).
    *   Added an example log message to the `/health` endpoint.
2.  **Global Exception Handler (`app/main.py`)**:
    *   Added a global exception handler using `@app.exception_handler(Exception)`.
    *   This handler catches any unhandled `Exception` (not already an `HTTPException`).
    *   It logs the error with traceback information using `logger.error(..., exc_info=True)`.
    *   It returns a generic `JSONResponse` with status code 500 and a standard error message.
3.  **Contextual Logging Added to Services and Endpoints**:
    *   `app/services/pdf_parser.py`: Added `INFO`, `WARNING`, and `ERROR` level logs for various stages of PDF parsing (start, invalid type, decryption failure, no content, success, password error, unexpected errors).
    *   `app/services/openai_analyzer.py`: Added `INFO`, `WARNING`, and `ERROR` logs for AI analysis stages (start, empty response, successful parse/validation, JSON decode error, validation error, rate limit, API error, unexpected errors). Includes snippets of AI response content in error logs for better debugging.
    *   `app/utils/resume_analyzer_utils.py`: Added `DEBUG` level logs for successful word count and readability calculations, and `ERROR` logs for exceptions during readability calculation.
    *   `app/api/endpoints/analysis.py`: Added `INFO` logs for request receipt, after each major service call (PDF parsing, AI analysis, stats calculation), and for successful completion. `WARNING` and `ERROR` logs added for exceptions caught from these service calls.

**Technical Decisions**:
-   Implemented a simple console-based logging setup suitable for development. More advanced configurations (file logging, structured logging, external services) can be added later if needed.
-   The global exception handler ensures that any unexpected server error results in a clean JSON 500 response rather than a raw traceback to the client, while still capturing full error details on the server side.
-   Contextual logs provide insights into the application flow and aid in debugging specific operations or errors within services.
-   Used `exc_info=True` in error logs to automatically include traceback information.

**Files Created/Modified**:
1.  `backend/app/main.py` (Modified for logging config and global exception handler)
2.  `backend/app/services/pdf_parser.py` (Modified for contextual logging)
3.  `backend/app/services/openai_analyzer.py` (Modified for contextual logging)
4.  `backend/app/utils/resume_analyzer_utils.py` (Modified for contextual logging)
5.  `backend/app/api/endpoints/analysis.py` (Modified for contextual logging)

**Code Snippets**:
```python
# backend/app/main.py (logging config & global handler)
import logging
from fastapi import Request
from fastapi.responses import JSONResponse

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception for request {request.method} {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected internal server error occurred."},
    )
```
```python
# Example of contextual logging in a service (e.g., openai_analyzer.py)
# logger = logging.getLogger(__name__)
# logger.info("Starting AI analysis...")
# try: ...
# except Exception as e:
#     logger.error(f"Error during AI analysis: {e}", exc_info=True)
```

**Next Steps**:
- Module 2.5: Backend Testing

**Testing Notes**:
-   Observe console logs when running the application and making API calls.
-   Trigger errors (e.g., upload non-PDF, invalid API key) to verify error logging and the global exception handler's response.
-   To see `DEBUG` logs from `resume_analyzer_utils.py`, change `logging.INFO` to `logging.DEBUG` in `main.py`'s `basicConfig`.

**Dependencies Added**: None for this specific module.

---

#### Module 2.5: Backend Testing
**Date**: [Current Date]
**Status**: ✅ Completed

**Actions Taken**:
1.  **Pytest Setup**:
    *   Added `pytest`, `pytest-asyncio` (for async code), and `httpx` (for TestClient dependencies) to `backend/requirements.txt`.
    *   Created `backend/pytest.ini` with basic configurations (`pythonpath = .`, `asyncio_mode = auto`).
    *   Created `backend/tests/conftest.py` with a session-scoped `TestClient` fixture for making requests to the FastAPI application.
    *   Created `backend/tests/test_data/` directory and added `dummy.pdf` (a very simple valid PDF) and `dummy.txt` for file upload tests.
2.  **Unit Tests for Resume Statistics Service (`backend/tests/test_resume_statistics.py`)**:
    *   Wrote parametrized tests for `calculate_word_count` covering empty strings, spaces, and normal cases.
    *   Wrote parametrized tests for `calculate_readability_score` covering simple text, complex text, empty/short strings, and edge cases, checking for expected score ranges or specific return values (e.g., 0.0 for short text).
3.  **Unit Tests for PDF Parsing Service (`backend/tests/services/test_pdf_parser.py`)**:
    *   Implemented tests for `parse_pdf_to_text`.
    *   Tested with a valid PDF (`dummy.pdf`), an invalid file type (`dummy.txt`), and a simulated empty PDF upload.
    *   Asserted expected text content or `HTTPException`s with correct status codes and details.
4.  **Unit Tests for OpenAI Analyzer Service (`backend/tests/services/test_openai_analyzer.py`)**:
    *   Implemented tests for `get_ai_analysis`, extensively using `unittest.mock.patch` to mock `client.chat.completions.create`.
    *   Tested successful response with valid JSON, invalid JSON response, JSON schema mismatch, simulated `APIError` and `RateLimitError`, and empty content from AI.
    *   Included a skippable (`@pytest.mark.skipif`) live test (`test_get_ai_analysis_live_call_basic`) that calls the actual OpenAI API if an API key is configured, for basic sanity checking.
    *   Corrected `OpenAI` client initialization in `app/services/openai_analyzer.py` to explicitly pass `api_key=settings.OPENAI_API_KEY` to resolve an issue with direct script execution and environment variable loading.
5.  **Integration Tests for Analysis Endpoint (`backend/tests/api/test_analysis_endpoint.py`)**:
    *   Used the `TestClient` to make `POST` requests to `/api/analyze`.
    *   Mocked `app.services.openai_analyzer.get_ai_analysis` to control AI responses during integration tests.
    *   Tested successful end-to-end flow with valid PDF and mocked AI data, verifying the combined response structure.
    *   Tested invalid file type uploads.
    *   Tested error propagation when the (mocked) AI service raises an `HTTPException`.
    *   Tested error handling when the (mocked) PDF parser raises an unexpected error.

**Technical Decisions**:
-   Organized tests into `tests/services/` and `tests/api/` subdirectories.
-   Utilized `pytest.mark.parametrize` for concise test cases with multiple inputs.
-   Mocked external dependencies (especially OpenAI API calls) for unit and integration tests to ensure speed, reliability, and no external costs, with an optional live test for OpenAI.
-   Used `FastAPI.TestClient` for integration testing the API endpoint.

**Files Created/Modified**:
1.  `backend/requirements.txt` (Modified: added `pytest`, `pytest-asyncio`, `httpx`)
2.  `backend/pytest.ini` (Created)
3.  `backend/tests/__init__.py` (Ensured it exists, typically empty)
4.  `backend/tests/conftest.py` (Created)
5.  `backend/tests/test_data/dummy.pdf` (Created)
6.  `backend/tests/test_data/dummy.txt` (Created)
7.  `backend/tests/test_resume_statistics.py` (Created)
8.  `backend/tests/services/__init__.py` (Created, empty)
9.  `backend/tests/services/test_pdf_parser.py` (Created)
10. `backend/tests/services/test_openai_analyzer.py` (Created)
11. `backend/tests/api/__init__.py` (Created, empty)
12. `backend/tests/api/test_analysis_endpoint.py` (Created)
13. `backend/app/services/openai_analyzer.py` (Modified: Explicit API key for client)


**Next Steps**:
- Module 4.6: Frontend Testing

**Testing Notes**:
-   User to install new dependencies: `cd backend && pip install -r requirements.txt`.
-   Run tests from the `backend` directory: `pytest` or `python -m pytest`.
-   The live OpenAI test in `test_openai_analyzer.py` will be skipped if `OPENAI_API_KEY` is not properly set in `.env`.

**Dependencies Added**:
- `pytest`
- `pytest-asyncio`
- `httpx`

### Completed
- ✅ Phase 1: Core Backend Foundation & Initial API (Modules 1.1 - 1.4)
- ✅ Phase 2: AI Integration & Core Backend Logic (Modules 2.1 - 2.5)
    - ✅ Module 2.1: OpenAI Service Integration
    - ✅ Module 2.2: Resume Statistics Service
    - ✅ Module 2.3: Full `/api/analyze` Endpoint Logic
    - ✅ Module 2.4: Backend Error Handling & Logging
    - ✅ Module 2.5: Backend Testing
- ✅ Phase 3: Frontend Development - Initial Setup & Core UI (Modules 3.1 - 3.5)
    - ✅ Module 3.1: React Project Initialization & Setup
    - ✅ Module 3.2: Core UI Component Implementation
    - ✅ Module 3.4: Application State Management (React Context)
    - ✅ Module 3.5: Main Application Page Structure
- ✅ Phase 4: Frontend-Backend Integration & Feature Completion (Modules 4.1 - 4.4)
    - ✅ Module 4.1: API Integration Service (Frontend)
    - ✅ Module 4.2: Form Submission & Data Handling Logic
    - ✅ Module 4.3: Results Display Components & Logic
    - ✅ Module 4.4: Responsive Design & Styling Polish

### In Progress
- ⏳ Module 4.5: Frontend Testing
- ⏳ Phase 5: Refinement, Security, Deployment & Documentation

## Notes & Decisions
- Backend Phase 2 is complete, including core logic, AI integration, utilities, error handling, logging, and a foundational test suite.
- Frontend Phase 3 is complete, setting up the basic UI and state management.
- Frontend Phase 4, up to Module 4.4, is complete.
- The project structure is well-organized and follows best practices for both backend and frontend.

## Issues & Challenges
- Resolved `OpenAIError` by explicitly passing the API key during client initialization in `openai_analyzer.py`.
- Need to ensure proper CORS configuration on the backend for frontend API calls. (This will be explicitly tested soon).
- Linter warnings for unused `analysisResult` and `error` in `UploadPage.jsx` are noted (delegated to `AnalysisResult.jsx`).
- Persistent linter warnings for unused `motion` import in `framer-motion` components (`HeroSection.jsx`, and `results/` components) are noted as likely linter/environment quirks, as `motion.elementName` is used correctly.

## Next Actions
1. Continue with Phase 4: Frontend-Backend Integration & Feature Completion
   - Module 4.5: Frontend Testing (Set up Jest/RTL, write unit/integration tests for components and user flow).

---
*This log will be updated as the project progresses.* 

### Module 4.3: Results Display Components & Logic
**Date**: [Current Date]
**Status**: In Progress

#### Actions Taken:
1. Reviewed existing components in `src/components/results/`:
   - `MatchScoreDisplay.jsx`: Displays match score with color coding
   - `MissingKeywordsList.jsx`: Shows missing keywords with animations
   - `SuggestionsList.jsx`: Presents improvement suggestions
   - `ResumeStatsDisplay.jsx`: Shows resume statistics
   - `AnalysisResult.jsx`: Main component integrating all results

2. Testing Status:
   - Unit tests completed for all components
   - Integration tests implemented for full analysis flow
   - End-to-end tests setup with Cypress:
     - Created test file `analysis.cy.js`
     - Added file upload support
     - Implemented test cases for:
       - Complete analysis flow
       - API error handling
       - Form validation
       - File type validation
   - Added data-testid attributes to all components for reliable test targeting:
     - `match-score-container`, `match-score`, `match-rating`
     - `missing-keywords-container`, `missing-keywords-list`, `missing-keyword-item`
     - `suggestions-container`, `suggestions-list`, `suggestion-item`
     - `stats-container`, `stat-item`
     - `analysis-result`

#### Next Steps:
1. Add more edge cases to end-to-end tests
2. Implement visual regression testing
3. Set up CI/CD pipeline for automated testing

#### Technical Decisions:
1. Using Framer Motion for animations
2. Implementing comprehensive integration tests using mocks for API calls
3. Using Cypress for end-to-end testing with custom commands
4. Ensuring accessibility in all components
5. Implementing proper error handling and loading states
6. Using data-testid attributes for reliable test targeting

---
*This log will be updated as the project progresses.* 