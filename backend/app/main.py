from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging # Import the logging module
from fastapi.responses import JSONResponse # Add JSONResponse
from app.middleware.anon_id import EnsureAnonID

# Configure basic logging
# This will output logs to the console. For production, you might want to configure a more robust setup
# (e.g., logging to files, structured logging, etc.)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__) # Get a logger for the main module

# Temporarily import settings to verify API key loading
# from .core.config import settings # Re-commented or removed
# print(f"[SETUP_VERIFICATION] Loaded OpenAI API Key: {settings.OPENAI_API_KEY}") # Re-commented or removed

from app.api.endpoints import analysis as analysis_endpoints # Import the analysis router
from app.api.endpoints import account as account_endpoints # Import the account router

app = FastAPI(
    title="Hireon AI Backend",
    description="API for Hireon AI resume reviewer.",
    version="0.1.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(EnsureAnonID)

class HealthCheckResponse(BaseModel):
    status: str = "OK"

@app.get("/health", response_model=HealthCheckResponse, tags=["Health"])
async def health_check():
    """
    Health check endpoint to confirm the API is running.
    """
    logger.info("Health check endpoint was called.") # Example log
    return HealthCheckResponse(status="OK")

# Include the analysis router
app.include_router(analysis_endpoints.router, prefix="/api", tags=["Analysis"])
# Include the account router
app.include_router(account_endpoints.router, prefix="/api/account", tags=["Account"])

# --- Global Exception Handler ---
@app.exception_handler(Exception) # Handle generic Exceptions
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception for request {request.method} {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected internal server error occurred."},
    )
# --- End Global Exception Handler --- 