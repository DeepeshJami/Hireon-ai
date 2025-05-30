import pdfplumber
from fastapi import UploadFile, HTTPException
import io
import logging # Import logging
from io import BytesIO

logger = logging.getLogger(__name__) # Get a logger for this module

def parse_pdf_to_text(pdf_file: UploadFile) -> str:
    """
    Parse PDF or plain text file to text using pdfplumber or direct read.

    Args:
        pdf_file (UploadFile): The uploaded file (PDF or TXT)

    Returns:
        str: Extracted text from the file

    Raises:
        HTTPException: If file is not a PDF or TXT or cannot be processed
    """
    filename = pdf_file.filename.lower()
    if filename.endswith('.pdf'):
        try:
            pdf_content = pdf_file.file.read()
            pdf_stream = BytesIO(pdf_content)
            with pdfplumber.open(pdf_stream) as pdf:
                text = ""
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                        text += page_text + "\n"
                return text.strip()
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error processing PDF file: {str(e)}"
            )
        finally:
            pdf_file.file.seek(0)
    elif filename.endswith('.txt') or pdf_file.content_type == 'text/plain':
        try:
            text = pdf_file.file.read().decode('utf-8')
            return text.strip()
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error processing text file: {str(e)}"
            )
        finally:
            pdf_file.file.seek(0)
    else:
        raise HTTPException(
            status_code=400,
            detail="Only PDF or plain text files are supported. Please upload a PDF or paste your resume text."
        ) 