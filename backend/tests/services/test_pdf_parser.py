import pytest
from fastapi import HTTPException, UploadFile
from app.services.pdf_parser import parse_pdf_to_text
import io
import os

# Helper to create an UploadFile from a file path
async def create_upload_file(file_path: str, filename: str, content_type: str) -> UploadFile:
    with open(file_path, "rb") as f:
        file_bytes = f.read()
    return UploadFile(filename=filename, file=io.BytesIO(file_bytes), content_type=content_type)

@pytest.mark.asyncio
async def test_parse_pdf_to_text_valid_pdf():
    """Test parsing a valid PDF file."""
    # Ensure the dummy PDF exists
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, "..", "test_data", "dummy.pdf")
    assert os.path.exists(file_path), f"Test PDF not found at {file_path}"

    upload_file = await create_upload_file(file_path, "dummy.pdf", "application/pdf")
    text_content = parse_pdf_to_text(upload_file)
    assert "Hello Test PDF!" in text_content
    assert isinstance(text_content, str)
    assert len(text_content) > 0

@pytest.mark.asyncio
async def test_parse_pdf_to_text_invalid_file_type():
    """Test parsing a non-PDF file, expecting an HTTPException."""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(current_dir, "..", "test_data", "dummy.txt")
    assert os.path.exists(file_path), f"Test TXT file not found at {file_path}"

    upload_file = await create_upload_file(file_path, "dummy.txt", "text/plain")
    with pytest.raises(HTTPException) as exc_info:
        parse_pdf_to_text(upload_file)
    assert exc_info.value.status_code == 400
    assert "Invalid file type" in exc_info.value.detail

@pytest.mark.asyncio
async def test_parse_pdf_to_text_empty_upload():
    """Test with an empty file upload (simulated)."""
    # Simulate an empty file by creating an UploadFile with empty BytesIO
    empty_file_content = io.BytesIO(b"")
    upload_file = UploadFile(filename="empty.pdf", file=empty_file_content, content_type="application/pdf")
    
    with pytest.raises(HTTPException) as exc_info:
        parse_pdf_to_text(upload_file)
    # This will likely fail because pdfplumber cannot open an empty file.
    # The exact error message might vary based on pdfplumber's behavior with truly empty streams.
    # It might be caught by the general "Failed to parse PDF: No text content found" 
    # or a more specific pdfplumber error if it can't even open it.
    # For our dummy.pdf, it has content. True empty PDF is harder to test without a file.
    assert exc_info.value.status_code == 500 or exc_info.value.status_code == 400
    # Example: if it fails to open, it might be a 500. If it opens but finds no text, 400.
    # Based on current pdf_parser, an empty file (0 bytes) will likely lead to an error when pdfplumber tries to open it.
    # pdfplumber.open(io.BytesIO(b"")) raises `PDFSyntaxError: Cannot open an empty file`
    # This should be caught by the generic Exception in parse_pdf_to_text and result in a 500
    assert "Failed to parse PDF: An unexpected error occurred" in exc_info.value.detail 


# To test password-protected PDFs, you'd need a sample password-protected PDF.
# And potentially a more sophisticated mocking if you don't want to include such files in the repo.
# For now, this is a placeholder for how one might approach it.
# @pytest.mark.asyncio
# async def test_parse_pdf_to_text_password_protected():
#     # current_dir = os.path.dirname(os.path.abspath(__file__))
#     # file_path = os.path.join(current_dir, "..", "test_data", "password_protected.pdf")
#     # assert os.path.exists(file_path), "Password protected test PDF not found"
#     # upload_file = await create_upload_file(file_path, "password_protected.pdf", "application/pdf")
#     # with pytest.raises(HTTPException) as exc_info:
#     #     parse_pdf_to_text(upload_file)
#     # assert exc_info.value.status_code == 400
#     # assert "File is password-protected" in exc_info.value.detail
#     pass # Skipping for now as it requires a specific test file 