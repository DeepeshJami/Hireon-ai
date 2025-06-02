import logging
import io
from pdfminer.high_level import extract_text
from fastapi import HTTPException

logger = logging.getLogger(__name__)

def parse_pdf_to_text(file_content: bytes) -> str:
    """
    Parse PDF content to text using pdfminer.
    
    Args:
        file_content: PDF file content as bytes
        
    Returns:
        Extracted text from the PDF
        
    Raises:
        HTTPException: If PDF parsing fails
    """
    logger.info("Starting PDF parsing")
    
    try:
        # Create a file-like object from bytes
        pdf_file = io.BytesIO(file_content)
        logger.info("Created BytesIO object from file content")
        
        # Extract text from PDF
        logger.info("Extracting text from PDF")
        text = extract_text(pdf_file)
        logger.info(f"Successfully extracted text. Length: {len(text)} characters")
        
        if not text.strip():
            logger.warning("Extracted text is empty")
            raise HTTPException(
                status_code=400,
                detail="Could not extract any text from the PDF. Please ensure the file is a valid PDF."
            )
            
        return text
        
    except Exception as e:
        logger.error(f"Error parsing PDF: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Error parsing PDF: {str(e)}"
        ) 