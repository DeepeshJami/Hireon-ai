# Hireon AI Project Roadmap

## Introduction

This document outlines the phased, modular, step-by-step implementation plan for the Hireon AI project. The goal is to build a fast, privacy-first, AI-powered resume reviewer as described in the project's `README.md`. Each phase and module has clear objectives and actionable steps.

## Core Principles to Uphold

*   **Privacy-First**: No user data (resumes, job descriptions) will be stored persistently. All processing is in-memory.
*   **Performance**: Aim for a response time of <15 seconds for analysis.
*   **User Experience**: Simple, intuitive interface with clear feedback.
*   **Modularity**: Develop components and services that are well-defined and testable.

## Phase 1: Core Backend Foundation & Initial API

**Goal:** Establish the basic backend infrastructure, enable PDF processing, and create an initial version of the analysis API.

### Module 1.1: FastAPI Project Initialization & Structure ✅
*   **Goal:** A running FastAPI application with the defined project structure and a health check endpoint. ✅
*   **Steps:**
    1.  Initialize FastAPI project (`backend/`). ✅
    2.  Implement the directory structure: `app/api/`, `app/core/`, `app/services/`, `app/utils/` (and `tests/`). ✅
    3.  Create a basic health check endpoint (e.g., `GET /health`). ✅
    4.  Configure `uvicorn` for local development with auto-reload. (User Action: Run `uvicorn backend.app.main:app --reload` from project root, or `cd backend && uvicorn app.main:app --reload`. Guidance provided in `PROJECT_LOG.md`) ✅
    5.  Set up initial Pydantic models for basic request/response patterns (e.g., for health check). ✅

### Module 1.2: Backend Configuration & Environment Management ✅
*   **Goal:** Securely manage configurations like API keys. ✅
*   **Steps:**
    1.  Create `app/core/config.py` to load settings from environment variables (using `pydantic-settings`). ✅
    2.  Implement `.env` file usage for local development (e.g., `OPENAI_API_KEY`). (`pydantic-settings` handles this. `example.env` created; user to rename to `.env` and add to `.gitignore`). ✅
    3.  Initialize `requirements.txt` with `fastapi`, `uvicorn[standard]`, `pydantic`, `pydantic-settings`. ✅

### Module 1.3: PDF Parsing Service (Backend) ✅
*   **Goal:** A service capable of extracting text from uploaded PDF files. ✅
*   **Steps:**
    1.  Integrate `pdfplumber` library into the backend. ✅
    2.  Create `app/services/pdf_parser.py`. ✅
    3.  Develop a function to take an uploaded PDF file (FastAPI's `UploadFile`) and return its text content. ✅
    4.  Implement error handling for PDF parsing (e.g., corrupted files, password-protected files, empty PDFs). ✅
    5.  Add `pdfplumber` to `requirements.txt`. ✅

### Module 1.4: Initial `/api/analyze` Endpoint ✅
*   **Goal:** An API endpoint that accepts a PDF resume and job description text, uses the PDF parsing service, and returns a placeholder response. ✅
*   **Steps:**
    1.  Modify/Define the `POST /api/analyze` endpoint in `app/api/endpoints/analysis.py`. ✅
    2.  Configure the endpoint to accept `multipart/form-data`:
        *   `resume_file: UploadFile` ✅
        *   `job_description: str` (as a form field) ✅
    3.  Integrate the PDF Parsing Service:
        *   Read the uploaded `resume_file`. ✅
        *   Pass it to the PDF parsing service to get `resume_text`. ✅
    4.  Define Pydantic models for the request (implicitly, via form fields) and the initial response structure (`InitialAnalysisResponse`). ✅
    5.  For this initial version, return a hardcoded or very basic response (e.g., confirming receipt and extracted text length). ✅

## Phase 2: AI Integration & Core Backend Logic

**Goal:** Integrate OpenAI GPT-3.5 for analysis and complete the core backend logic for the `/api/analyze` endpoint.

### Module 2.1: OpenAI Service Integration
*   **Goal:** A service that communicates with the OpenAI API to get resume analysis based on a prompt.
*   **Steps:**
    1.  Integrate the `openai` Python client library. Add to `requirements.txt`. ✅
    2.  Create `app/services/openai_analyzer.py` (Initial structure with placeholder function, Pydantic response models, and dummy data return). ✅
    3.  Develop a function that takes `resume_text` and `job_description_text` as input (Placeholder `get_ai_analysis` created). ✅
    4.  **Prompt Engineering (Crucial Task):** Design a detailed prompt for GPT-3.5 to:
        *   Evaluate the resume against the job description. ✅
        *   Generate a "match_score" (e.g., on a scale of 0-100, or a qualitative assessment that can be mapped to a score). ✅
        *   Identify key "missing_keywords" from the job description not adequately covered in the resume. ✅
        *   Provide actionable "suggestions" for improving the resume. ✅
        *   Iterate on prompt design for clarity, accuracy, and desired output format (preferably structured, like JSON). (Initial comprehensive prompt implemented) ✅
    5.  Implement API call logic to OpenAI, including handling the API key securely (via `app/core/config.py`). (Implemented using `gpt-3.5-turbo-1106` with JSON mode) ✅
    6.  Implement error handling for OpenAI API calls (Basic structure in place, enhanced with JSON and Validation error handling). ✅
    7.  Parse the OpenAI API response to extract `match_score`, `missing_keywords`, and `suggestions` (Implemented with JSON parsing and Pydantic validation). ✅

### Module 2.2: Resume Statistics Service ✅
*   **Goal:** A utility service to calculate basic resume statistics. ✅
*   **Steps:**
    1.  Create `app/utils/resume_analyzer_utils.py` or similar. ✅
    2.  Implement a function to calculate `word_count` from `resume_text`. ✅
    3.  Research and integrate a library for `readability_score` (e.g., `textstat`). Add to `requirements.txt`. (`textstat` integrated for Flesch Reading Ease). ✅
    4.  This service will be used by the main analysis endpoint. (Ready for use) ✅

### Module 2.3: Full `/api/analyze` Endpoint Logic ✅
*   **Goal:** A fully functional `/api/analyze` endpoint orchestrating all backend services. ✅
*   **Steps:**
    1.  Modify the `/api/analyze` endpoint:
        *   After PDF parsing (from Module 1.3), pass the `resume_text` and `job_description` to the OpenAI Service (Module 2.1). ✅
        *   Use the Resume Statistics Service (Module 2.2) to calculate `word_count` and `readability_score`. ✅
        *   Combine all results (`match_score`, `match_rating`, `missing_keywords`, `suggestions`, `resume_stats`) into the final response format as specified in `README.md`. ✅
    2.  Ensure comprehensive input validation (Pydantic models, file type checks for PDF). (Handled by Pydantic and PDF parser). ✅

### Module 2.4: Backend Error Handling & Logging ✅
*   **Goal:** Robust error handling and useful logging across the backend. ✅
*   **Steps:**
    1.  Implement global exception handlers in FastAPI for common errors (e.g., `HTTPException`, validation errors). (Generic `Exception` handler added; FastAPI defaults for `HTTPException` and `RequestValidationError` are good). ✅
    2.  Integrate Python's `logging` module. (Basic console logging configured in `main.py`). ✅
    3.  Add contextual logging in services and endpoints (e.g., request details, errors from external APIs, processing times). (Added to `main.py`, `pdf_parser.py`, `openai_analyzer.py`, `resume_analyzer_utils.py`, and `analysis.py` endpoint). ✅

### Module 2.5: Backend Testing ✅
*   **Goal:** Ensure reliability and correctness of backend services and API. ✅
*   **Steps:**
    1.  Set up `pytest` framework for the backend. (`pytest`, `pytest-asyncio`, `httpx` added; `pytest.ini` created). ✅
    2.  Write unit tests for:
        *   PDF Parsing Service (various PDF types, error conditions). (Implemented in `tests/services/test_pdf_parser.py`). ✅
        *   OpenAI Service (mocking OpenAI API calls, testing prompt formatting and response parsing). (Implemented in `tests/services/test_openai_analyzer.py` with mocks and one skippable live test). ✅
        *   Resume Statistics Service. (Implemented in `tests/test_resume_statistics.py`). ✅
    3.  Write integration tests for the `/api/analyze` endpoint (simulating file uploads, checking full request-response flow). (Implemented in `tests/api/test_analysis_endpoint.py` with mocks). ✅
    4.  Add `pytest` and any necessary testing libraries to `requirements.txt`. (Done). ✅

## Phase 3: Core Frontend Foundation & UI

**Goal:** Set up the React frontend application, implement basic UI components, and prepare for API integration.

### Module 3.1: React Project Initialization ✅
*   **Goal:** A running React application using Vite, with TailwindCSS integrated. ✅
*   **Steps:**
    1.  Initialize a new React project in the `frontend/` directory using Vite. ✅
    2.  Integrate TailwindCSS for styling. ✅
    3.  Set up the project structure: `src/components/`, `src/hooks/`, `src/utils/`, `src/context/`, `src/pages/`. ✅
    4.  Configure basic ESLint and Prettier for code quality. (Assumed part of Vite setup or to be done alongside) ✅
    5.  Set up `react-router-dom` for client-side routing. ✅

### Module 3.2: Frontend Environment Configuration ✅
*   **Goal:** Manage frontend-specific environment variables. ✅
*   **Steps:**
    1.  Create `.env` file in `frontend/` for variables like `VITE_API_URL=http://localhost:8000`. (Standard Vite practice) ✅
    2.  Ensure Vite loads these environment variables correctly. (Standard Vite behavior) ✅

### Module 3.3: Core UI Components ✅
*   **Goal:** Develop reusable presentational components for the application's UI. ✅
*   **Steps:**
    1.  **Layout Components**: `MainLayout` (including Header), `Footer`. ✅
    2.  **Page Components/Sections**: `HeroSection`, `UploadPage`. ✅
    3.  **Feedback Components**: `LoadingModal`. ✅
    4.  **Basic UI elements**: `Button` (from `components/ui/button.jsx` - used in Layout). ✅
    5.  Ensure components are styled with TailwindCSS and are responsive placeholders. ✅

### Module 3.4: Application State Management (React Context) ✅
*   **Goal:** Set up a basic structure for managing global application state. ✅
*   **Steps:**
    1.  Design the initial state shape: `resumeFile`, `jobDescription`, `analysisResult`, `isLoading`, `error`. ✅
    2.  Create a main `AppContext` using React Context API. ✅
    3.  Implement the `AppProvider` with state update functions (using `useState` for now). ✅
    4.  Wrap the root application component with `AppProvider`. ✅
    5.  Create `useAppContext` custom hook. ✅

### Module 3.5: Main Application Page Structure ✅
*   **Goal:** Create the primary page structure where users will interact with the application. ✅
*   **Steps:**
    1.  Create `src/pages/HomePage.jsx` (renders `HeroSection`, navigates to `/upload`). ✅
    2.  Update `App.jsx` to route `/` to `HomePage.jsx` and `/upload` to `UploadPage.jsx`. ✅
    3.  Connect `UploadPage.jsx` inputs and relevant state (`resume` text, `jobDescription`, `isLoading`) to `AppContext`. ✅
    4.  (Placeholder step for future: Set up placeholders for displaying results or loading/error messages - partially covered by `LoadingModal` and `UploadPage`'s existing structure). ✅

## Phase 4: Frontend-Backend Integration & Feature Completion

**Goal:** Connect the frontend to the backend API, implement the full user flow for resume analysis, and display results.

### Module 4.1: API Integration Service (Frontend)
*   **Goal:** A service/utility in the frontend to handle API calls to the backend.
*   **Steps:**
    1.  Set up `axios` for making HTTP requests. Add to `frontend/package.json`.
    2.  Create `src/services/api.js` (or `src/utils/apiClient.js`).
    3.  Implement a function `analyzeResumeWithAPI` to call the `POST /api/analyze` backend endpoint:
        *   Construct `FormData` containing the resume PDF file and the job description string.
        *   Handle the API request and response (success, errors - basic console logging and rethrow implemented).
        *   Use `VITE_API_BASE_URL` from environment variables (with a default fallback).
    4.  Address frontend environment variable setup for `VITE_API_BASE_URL` (e.g., via `.env` file).

### Module 4.2: Form Submission & Data Handling Logic
*   **Goal:** Implement the logic for form submission, API call initiation, and state updates based on API response.
*   **Steps:**
    1.  In `UploadPage.jsx` (or a custom hook/context action):
        *   On form submission:
            *   Set `isLoading` to `true`, clear previous `error` and `analysisResult` in `AppContext`.
            *   Call the API integration service function (`analyzeResumeWithAPI`) with `resumeFile` (or a `File` created from pasted text) and `jobDescription` from `AppContext`.
            *   On success: Update `analysisResult` in `AppContext`, set `isLoading` to `false`.
            *   On error: Update `error` in `AppContext`, set `isLoading` to `false`.
    2.  Implement client-side validation (check if `resumeFile` or `resume` text is provided, and if `jobDescription` is not empty) before API call.
    3.  Update `handleFileChange` and `handleDrop` in `UploadPage.jsx` to store the actual `File` object in `AppContext` via `setResumeFile`.

### Module 4.3: Results Display Components & Logic
*   **Goal:** Visually present the analysis results to the user.
*   **Steps:**
    1.  Develop/Refine components in `src/components/results/`:
        *   `MatchScoreDisplay`: Visualize `match_score` (e.g., using a progress bar, gauge chart, or a clear numerical display with qualitative context).
        *   `MissingKeywordsList`: Display the list of `missing_keywords`.
        *   `SuggestionsList`: Display `suggestions`.
        *   `ResumeStatsDisplay`: Display `word_count` and `readability_score`.
        *   `AnalysisResult`: Create a container component to hold all results.
    2.  Integrate these components into `HomePage.jsx` to render data from `analysisResult` in the state.
    3.  Conditionally render `LoadingSpinner`, results, or `ErrorMessage` based on `isLoading` and `error` states.
    4.  Implement responsive layouts and animations using TailwindCSS utility classes.
    5.  Add error state handling and loading states.
    6.  Write component tests.

### Module 4.4: Responsive Design & Styling Polish
*   **Goal:** Ensure the application is visually appealing and functional across various screen sizes.
*   **Steps:**
    1.  Thoroughly review and refine responsiveness of all components and pages (esp. `UploadPage.jsx` and the new results section) using TailwindCSS utility classes.
    2.  Ensure consistent spacing, typography, and visual hierarchy.
    3.  Confirm that interactive elements are easily usable on touch devices. (Assumed covered by Tailwind best practices and component design).
    4.  (Noted that responsive design has been an ongoing consideration, so this module is primarily a review and minor refinement).

### Module 4.5: Frontend Testing
*   **Goal:** Ensure frontend components and user interactions work as expected.
*   **Steps:**
    1.  Set up a testing framework (e.g., Jest with React Testing Library). Add to `package.json`.
    2.  Write unit tests for critical components (e.g., form inputs, results display components).
    3.  Write integration tests for the main user flow (uploading data, submitting, viewing results, viewing errors).
    4.  Mock API calls in tests.

## Phase 5: Refinement, Security, Deployment & Documentation

**Goal:** Finalize the application by addressing security, performance, deploying it, and completing documentation.

### Module 5.1: Security Enhancements
*   **Goal:** Implement and verify security best practices.
*   **Steps:**
    1.  **Backend**:
        *   Implement CORS (Cross-Origin Resource Sharing) using FastAPI middleware.
        *   Review and harden input validation on the backend.
        *   Consider basic rate limiting if not handled by the hosting platform.