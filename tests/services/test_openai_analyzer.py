import pytest
from unittest.mock import patch, AsyncMock, MagicMock
import json
from fastapi import HTTPException
from openai import APIError as OpenAI_APIError, RateLimitError as OpenAI_RateLimitError

from app.services.openai_analyzer import get_ai_analysis, AIResponseSchema

# Valid AI response data for mocking
VALID_AI_RESPONSE_DATA = {
    "match_score": 85,
    "match_rating": "Good",
    "missing_keywords": ["JavaScript", "Docker"],
    "suggestions": ["Highlight your Python projects more."]
}

# Helper to create a properly structured mock completion object
def create_mock_completion(content_data):
    mock_message = MagicMock()
    mock_message.content = json.dumps(content_data) if isinstance(content_data, dict) else content_data
    mock_choice = MagicMock()
    mock_choice.message = mock_message
    mock_completion = MagicMock()
    mock_completion.choices = [mock_choice]
    return mock_completion

@pytest.mark.asyncio
async def test_get_ai_analysis_success():
    """Test successful AI analysis with a valid JSON response from OpenAI."""
    mock_completion = create_mock_completion(VALID_AI_RESPONSE_DATA)
    mock_create = AsyncMock(return_value=mock_completion)
    
    with patch('app.services.openai_analyzer.client.chat.completions.create', mock_create):
        result = await get_ai_analysis("Some resume text", "Some job description")
        assert isinstance(result, AIResponseSchema)
        assert result.match_score == VALID_AI_RESPONSE_DATA["match_score"]
        mock_create.assert_awaited_once()

@pytest.mark.asyncio
async def test_get_ai_analysis_invalid_json_response():
    """Test AI analysis when OpenAI returns a non-JSON string."""
    mock_message = MagicMock()
    mock_message.content = "This is not JSON."
    mock_choice = MagicMock()
    mock_choice.message = mock_message
    mock_completion_invalid_json = MagicMock()
    mock_completion_invalid_json.choices = [mock_choice]

    mock_create = AsyncMock(return_value=mock_completion_invalid_json)
    with patch('app.services.openai_analyzer.client.chat.completions.create', mock_create):
        with pytest.raises(HTTPException) as exc_info:
            await get_ai_analysis("resume", "jd")
        assert exc_info.value.status_code == 500
        assert "AI service returned invalid JSON format" in exc_info.value.detail

@pytest.mark.asyncio
async def test_get_ai_analysis_json_schema_mismatch():
    """Test AI analysis when OpenAI returns JSON but with missing/incorrect fields."""
    invalid_data = {"score": 90, "rating": "Excellent"} # Missing fields
    mock_completion_schema_mismatch = create_mock_completion(invalid_data)

    mock_create = AsyncMock(return_value=mock_completion_schema_mismatch)
    with patch('app.services.openai_analyzer.client.chat.completions.create', mock_create):
        with pytest.raises(HTTPException) as exc_info:
            await get_ai_analysis("resume", "jd")
        assert exc_info.value.status_code == 500
        assert "AI service response does not match expected structure" in exc_info.value.detail

@pytest.mark.asyncio
async def test_get_ai_analysis_openai_api_error():
    """Test AI analysis when OpenAI client raises an APIError."""
    import httpx
    mock_request = MagicMock(spec=httpx.Request)
    mock_api_error = OpenAI_APIError("Mocked API Error", mock_request, body=None)
    mock_create = AsyncMock(side_effect=mock_api_error)
    
    with patch('app.services.openai_analyzer.client.chat.completions.create', mock_create):
        with pytest.raises(HTTPException) as exc_info:
            await get_ai_analysis("resume", "jd")
        assert exc_info.value.status_code == 502
        assert "OpenAI API returned an error" in exc_info.value.detail

@pytest.mark.asyncio
async def test_get_ai_analysis_openai_rate_limit_error():
    """Test AI analysis when OpenAI client raises a RateLimitError."""
    import httpx
    mock_response = MagicMock(spec=httpx.Response)
    mock_response.status_code = 429
    mock_response.headers = {}
    mock_rate_limit_error = OpenAI_RateLimitError(
        "Mocked Rate Limit Error",
        response=mock_response,
        body="Rate limit exceeded"
    )
    mock_create = AsyncMock(side_effect=mock_rate_limit_error)
    
    with patch('app.services.openai_analyzer.client.chat.completions.create', mock_create):
        with pytest.raises(HTTPException) as exc_info:
            await get_ai_analysis("resume", "jd")
        assert exc_info.value.status_code == 429
        assert "OpenAI API rate limit exceeded" in exc_info.value.detail

@pytest.mark.asyncio
async def test_get_ai_analysis_empty_response_content():
    """Test AI analysis when OpenAI returns an empty content string."""
    mock_message = MagicMock()
    mock_message.content = ""
    mock_choice = MagicMock()
    mock_choice.message = mock_message
    mock_completion_empty = MagicMock()
    mock_completion_empty.choices = [mock_choice]
    
    mock_create = AsyncMock(return_value=mock_completion_empty)
    with patch('app.services.openai_analyzer.client.chat.completions.create', mock_create):
        with pytest.raises(HTTPException) as exc_info:
            await get_ai_analysis("resume", "jd")
        assert exc_info.value.status_code == 500
        assert "AI service returned an empty response" in exc_info.value.detail