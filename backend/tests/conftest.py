import pytest
from fastapi.testclient import TestClient
from app.main import app # Import your FastAPI app

@pytest.fixture(scope="session")
def client():
    """
    Provides a TestClient instance for making requests to the FastAPI application.
    The scope is 'session' so the client is created once per test session.
    """
    with TestClient(app) as c:
        yield c 