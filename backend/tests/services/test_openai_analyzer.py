import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi import HTTPException
from pydantic import ValidationError

from app.services.openai_analyzer import get_ai_analysis, AIResponseSchema
from app.core.config import settings # Import settings to check API key for certain test skips

# A valid dummy AI response structure
VALID_AI_RESPONSE_DATA = {
    "match_score": 85,
    "match_rating": "Good",
    "missing_keywords": ["Kubernetes", "CI/CD"],
    "suggestions": ["Highlight your cloud platform experience more prominently.", "Quantify achievements in past projects."]
}

@pytest.mark.asyncio
async def test_get_ai_analysis_success():
    """Test successful AI analysis with a valid JSON response from OpenAI."""
    mock_completion = MagicMock()
    mock_completion.choices = [MagicMock()]
    mock_completion.choices[0].message = MagicMock()
    mock_completion.choices[0].message.content = json.dumps(VALID_AI_RESPONSE_DATA)

    # Patch the client.chat.completions.create method
    # The path to patch is 'app.services.openai_analyzer.client.chat.completions.create'
    # because 'client' is an instance in that module's namespace.
    with patch('app.services.openai_analyzer.client.chat.completions.create', AsyncMock(return_value=mock_completion)) as mock_create:
        result = await get_ai_analysis("Some resume text", "Some job description")
        assert isinstance(result, AIResponseSchema)
        assert result.match_score == VALID_AI_RESPONSE_DATA["match_score"]
        assert result.match_rating == VALID_AI_RESPONSE_DATA["match_rating"]
        mock_create.assert_called_once()

@pytest.mark.asyncio
async def test_get_ai_analysis_invalid_json_response():
    """Test AI analysis when OpenAI returns a non-JSON string."""
    mock_completion = MagicMock()
    mock_completion.choices = [MagicMock()]
    mock_completion.choices[0].message = MagicMock()
    mock_completion.choices[0].message.content = "This is not JSON."

    with patch('app.services.openai_analyzer.client.chat.completions.create', AsyncMock(return_value=mock_completion)):
        with pytest.raises(HTTPException) as exc_info:
            await get_ai_analysis("resume", "jd")
        assert exc_info.value.status_code == 500
        assert "AI service returned invalid JSON format" in exc_info.value.detail

@pytest.mark.asyncio
async def test_get_ai_analysis_json_schema_mismatch():
    """Test AI analysis when OpenAI returns JSON but with missing/incorrect fields."""
    invalid_data = {"score": 90, "rating": "Excellent"} # Missing fields compared to AIResponseSchema
    mock_completion = MagicMock()
    mock_completion.choices = [MagicMock()]
    mock_completion.choices[0].message = MagicMock()
    mock_completion.choices[0].message.content = json.dumps(invalid_data)

    with patch('app.services.openai_analyzer.client.chat.completions.create', AsyncMock(return_value=mock_completion)):
        with pytest.raises(HTTPException) as exc_info:
            await get_ai_analysis("resume", "jd")
        assert exc_info.value.status_code == 500
        assert "AI service response does not match expected structure" in exc_info.value.detail
        # Pydantic's ValidationError errors() gives a list of dicts, check for some expected field
        assert "'match_score'" in exc_info.value.detail 

@pytest.mark.asyncio
async def test_get_ai_analysis_openai_api_error():
    """Test AI analysis when OpenAI client raises an APIError."""
    from openai import APIError as OpenAI_APIError # Local import to avoid name collision if any

    with patch('app.services.openai_analyzer.client.chat.completions.create', AsyncMock(side_effect=OpenAI_APIError("Mocked API Error", request=None, body=None))):
        with pytest.raises(HTTPException) as exc_info:
            await get_ai_analysis("resume", "jd")
        assert exc_info.value.status_code == 502
        assert "OpenAI API returned an error: Mocked API Error" in exc_info.value.detail

@pytest.mark.asyncio
async def test_get_ai_analysis_openai_rate_limit_error():
    """Test AI analysis when OpenAI client raises a RateLimitError."""
    from openai import RateLimitError as OpenAI_RateLimitError

    with patch('app.services.openai_analyzer.client.chat.completions.create', AsyncMock(side_effect=OpenAI_RateLimitError("Mocked Rate Limit Error", request=None, body=None, response=MagicMock()))):
        with pytest.raises(HTTPException) as exc_info:
            await get_ai_analysis("resume", "jd")
        assert exc_info.value.status_code == 429
        assert "OpenAI API rate limit exceeded" in exc_info.value.detail

@pytest.mark.asyncio
async def test_get_ai_analysis_empty_response_content():
    """Test AI analysis when OpenAI returns an empty content string."""
    mock_completion = MagicMock()
    mock_completion.choices = [MagicMock()]
    mock_completion.choices[0].message = MagicMock()
    mock_completion.choices[0].message.content = ""

    with patch('app.services.openai_analyzer.client.chat.completions.create', AsyncMock(return_value=mock_completion)):
        with pytest.raises(HTTPException) as exc_info:
            await get_ai_analysis("resume", "jd")
        assert exc_info.value.status_code == 500
        assert "AI service returned an empty response" in exc_info.value.detail

# This is an actual integration test for the OpenAI service, skipped if no API key.
# It's good to have one test that can (optionally) hit the real API for a sanity check.
@pytest.mark.skipif(not settings.OPENAI_API_KEY or settings.OPENAI_API_KEY == "your_api_key_here", reason="OPENAI_API_KEY not set, skipping live API test.")
@pytest.mark.asyncio
async def test_get_ai_analysis_live_call_basic():
    """A basic live test against OpenAI API. Will be skipped if API key is not configured."""
    # Use very short, simple texts to minimize token usage and processing time
    resume_text = "Software engineer with Python experience."
    job_description_text = "Seeking a Python developer."
    try:
        result = await get_ai_analysis(resume_text, job_description_text)
        assert isinstance(result, AIResponseSchema)
        assert 0 <= result.match_score <= 100
        assert result.match_rating in ["Excellent", "Good", "Fair", "Poor"]
        assert isinstance(result.missing_keywords, list)
        assert isinstance(result.suggestions, list)
        # Basic check that suggestions are strings if any are present
        if result.suggestions:
            assert all(isinstance(s, str) for s in result.suggestions)
    except HTTPException as e:
        pytest.fail(f"Live OpenAI API call failed with HTTPException: {e.status_code} - {e.detail}")
    except Exception as e:
        pytest.fail(f"Live OpenAI API call failed with an unexpected exception: {str(e)}")

# Need to import json for some test cases
import json 