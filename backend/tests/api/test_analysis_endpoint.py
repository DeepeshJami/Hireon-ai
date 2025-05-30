import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock, MagicMock
import io
import os
import json

from app.services.openai_analyzer import AIResponseSchema # To help construct mock AI responses

# Valid AI response data for mocking
VALID_MOCK_AI_RESPONSE = {
    "match_score": 78,
    "match_rating": "Good",
    "missing_keywords": ["Azure", "Project Management"],
    "suggestions": ["Add more details about your Python projects.", "Quantify your achievements with numbers."]
}

# Path to the dummy PDF file
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
TEST_PDF_PATH = os.path.join(CURRENT_DIR, "..", "test_data", "dummy.pdf")
TEST_TXT_PATH = os.path.join(CURRENT_DIR, "..", "test_data", "dummy.txt")


@pytest.mark.asyncio
async def test_analyze_endpoint_success(client: TestClient):
    """Test the /api/analyze endpoint with a valid PDF and mocked successful AI response."""
    assert os.path.exists(TEST_PDF_PATH), f"Test PDF not found at {TEST_PDF_PATH}"

    mock_ai_response_obj = AIResponseSchema(**VALID_MOCK_AI_RESPONSE)

    with patch('app.services.openai_analyzer.get_ai_analysis', AsyncMock(return_value=mock_ai_response_obj)) as mock_get_ai_analysis:
        with open(TEST_PDF_PATH, "rb") as f:
            files = {"resume_file": ("dummy.pdf", f, "application/pdf")}
            data = {"job_description": "Seeking a skilled Python developer for exciting projects."}
            response = client.post("/api/analyze", files=files, data=data)

        assert response.status_code == 200
        json_response = response.json()
        
        assert json_response["match_score"] == VALID_MOCK_AI_RESPONSE["match_score"]
        assert json_response["match_rating"] == VALID_MOCK_AI_RESPONSE["match_rating"]
        assert json_response["missing_keywords"] == VALID_MOCK_AI_RESPONSE["missing_keywords"]
        assert json_response["suggestions"] == VALID_MOCK_AI_RESPONSE["suggestions"]
        
        assert "resume_stats" in json_response
        assert "word_count" in json_response["resume_stats"]
        assert "readability_score" in json_response["resume_stats"]
        # Word count for "Hello Test PDF!" is 3
        assert json_response["resume_stats"]["word_count"] == 3 
        # Readability for "Hello Test PDF!" (very short) is 0.0 by our util
        assert json_response["resume_stats"]["readability_score"] == 0.0 

        mock_get_ai_analysis.assert_called_once()
        # You could add more assertions on the arguments passed to mock_get_ai_analysis if needed
        # args, kwargs = mock_get_ai_analysis.call_args
        # assert "Hello Test PDF!" in args[0] # resume_text
        # assert "Seeking a skilled Python developer" in args[1] # job_description_text

@pytest.mark.asyncio
async def test_analyze_endpoint_invalid_file_type(client: TestClient):
    """Test /api/analyze with a non-PDF file."""
    assert os.path.exists(TEST_TXT_PATH), f"Test TXT file not found at {TEST_TXT_PATH}"
    with open(TEST_TXT_PATH, "rb") as f:
        files = {"resume_file": ("dummy.txt", f, "text/plain")}
        data = {"job_description": "Some JD"}
        response = client.post("/api/analyze", files=files, data=data)
    
    assert response.status_code == 400
    json_response = response.json()
    assert "Invalid file type" in json_response["detail"]

@pytest.mark.asyncio
async def test_analyze_endpoint_ai_service_http_exception(client: TestClient):
    """Test /api/analyze when the AI service mock raises an HTTPException."""
    assert os.path.exists(TEST_PDF_PATH)
    
    # Simulate an HTTPException from the AI service (e.g., RateLimitError)
    with patch('app.services.openai_analyzer.get_ai_analysis', AsyncMock(side_effect=HTTPException(status_code=429, detail="AI rate limit"))):
        with open(TEST_PDF_PATH, "rb") as f:
            files = {"resume_file": ("dummy.pdf", f, "application/pdf")}
            data = {"job_description": "Some JD"}
            response = client.post("/api/analyze", files=files, data=data)
            
        assert response.status_code == 429
        json_response = response.json()
        assert "AI rate limit" in json_response["detail"]

@pytest.mark.asyncio
async def test_analyze_endpoint_pdf_parser_raises_unexpected_error(client: TestClient):
    """Test /api/analyze when PDF parser raises an unexpected (non-HTTP) error."""
    with patch('app.services.pdf_parser.parse_pdf_to_text', MagicMock(side_effect=ValueError("Unexpected PDF parsing failure"))):
        # We don't need an actual file here since parse_pdf_to_text is mocked to fail immediately
        # but TestClient requires the `files` argument for multipart POST if `resume_file` is expected by FastAPI
        # So we send a dummy file content.
        dummy_file_content = io.BytesIO(b"dummy pdf content")
        files = {"resume_file": ("dummy.pdf", dummy_file_content, "application/pdf")}
        data = {"job_description": "Some JD"}
        response = client.post("/api/analyze", files=files, data=data)

    assert response.status_code == 500
    json_response = response.json()
    assert "An unexpected error occurred during PDF parsing" in json_response["detail"] 