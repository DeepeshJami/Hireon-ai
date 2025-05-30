import pdfplumber
from fastapi import UploadFile, HTTPException
import io
import logging # Import logging

logger = logging.getLogger(__name__) # Get a logger for this module

def parse_pdf_to_text(file: UploadFile) -> str:
    """
    Parses an uploaded PDF file and extracts text content.

    Args:
        file: The UploadFile object from FastAPI.

    Returns:
        A string containing the extracted text from the PDF.

    Raises:
        HTTPException: If the file is not a PDF, is password-protected,
                       or if any other parsing error occurs.
    """
    logger.info(f"Attempting to parse PDF: {file.filename}")
    if not file.filename.lower().endswith(".pdf"):
        logger.warning(f"Invalid file type uploaded: {file.filename}. Not a PDF.")
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF files are accepted.")

    try:
        # Read the file content into a BytesIO object
        file_content = io.BytesIO(file.file.read())
        
        with pdfplumber.open(file_content) as pdf:
            text_content = []
            for page in pdf.pages:
                try:
                    page_text = page.extract_text()
                    if page_text:
                        text_content.append(page_text)
                except Exception as page_error:
                    logger.warning(f"Error extracting text from page in {file.filename}: {page_error}")
                    continue  # Skip problematic pages but continue processing
            
            if not text_content:
                logger.warning(f"No text content found in PDF: {file.filename}")
                raise HTTPException(status_code=400, detail="Failed to parse PDF: No text content found in the PDF.")

            logger.info(f"Successfully parsed PDF: {file.filename}, extracted {len(text_content)} pages of text.")
            return "\n".join(text_content)

    except Exception as e:
        logger.error(f"Failed to parse PDF {file.filename} due to an unexpected error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to parse PDF: An unexpected error occurred. {str(e)}") 