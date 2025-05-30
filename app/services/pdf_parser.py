import pdfplumber
from fastapi import UploadFile, HTTPException
import logging

logger = logging.getLogger(__name__)

def parse_pdf_to_text(file: UploadFile) -> str:
    """Parses a PDF file uploaded via FastAPI into plain text using pdfplumber."""
    filename = file.filename
    logger.info(f"Attempting to parse PDF: {filename}")

    # Check if file is a PDF
    if not filename.lower().endswith('.pdf'):
        logger.warning(f"Invalid file type for {filename}")
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF files are supported.")

    # SpooledTemporaryFile needs to be seeked to 0 before pdfplumber can read it
    try:
        file.file.seek(0) 
    except Exception as e:
        # Handle cases where seek might not be available or fails (e.g. not a SpooledTemporaryFile)
        # This is a defensive measure; usually, FastAPI UploadFile.file is seekable.
        logger.warning(f"Could not seek file {filename}: {e}. Proceeding without seek.")

    try:
        with pdfplumber.open(file.file) as pdf:
            if not pdf.pages:
                logger.warning(f"PDF file {filename} has no pages.")
                raise HTTPException(status_code=400, detail=f"The PDF file '{filename}' contains no pages or is corrupted.")
            
            all_text = []
            for i, page in enumerate(pdf.pages):
                text = page.extract_text()
                if text:
                    all_text.append(text)
                else:
                    logger.info(f"Page {i+1} of {filename} contains no extractable text.")
            
            if not all_text:
                logger.warning(f"No text could be extracted from PDF: {filename}")
                raise HTTPException(status_code=400, detail=f"No text content found in the PDF file '{filename}'. It might be an image-based PDF or empty.")

            full_text = "\n".join(all_text)
            logger.info(f"Successfully parsed PDF: {filename}. Extracted {len(full_text)} characters.")
            return full_text
            
    except HTTPException: # Re-raise HTTPExceptions directly
        raise
    except Exception as e:
        logger.error(f"Failed to parse PDF file '{filename}': {str(e)}", exc_info=True)
        # Check for specific pdfplumber errors if needed, otherwise a generic error
        if "Cannot open an empty file" in str(e) or "is empty" in str(e):
             raise HTTPException(status_code=400, detail=f"The PDF file '{filename}' is empty or invalid.")
        raise HTTPException(status_code=500, detail=f"Failed to parse PDF '{filename}': An unexpected error occurred.") 