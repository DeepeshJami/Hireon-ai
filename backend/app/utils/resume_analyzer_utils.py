import textstat
import logging # Import logging

logger = logging.getLogger(__name__) # Get a logger for this module

# Pydantic model for resume statistics is defined in the main analysis endpoint or its response model.
# This util just provides the calculation functions.

def calculate_word_count(text: str) -> int:
    """
    Calculates the word count of the given text.
    Splits by space and counts non-empty words.
    """
    if not text or text.isspace():
        return 0
    words = text.split()
    count = len(words)
    logger.debug(f"Calculated word count: {count} for text snippet: '{text[:50]}...'")
    return count

def calculate_readability_score(text: str) -> float:
    """
    Calculates the Flesch Reading Ease score for the given text.
    Higher scores indicate easier readability.
    A score of 60-70 is considered plain English.
    Returns 0.0 if text is too short or empty, as textstat can error.
    """
    if not text or len(text.split()) < 10: # textstat might need a minimum number of words
        logger.debug(f"Text too short for readability score. Length: {len(text.split())} words. Snippet: '{text[:50]}...'")
        return 0.0 # Or handle as appropriate, e.g. raise an error or return None
    try:
        # Flesch Reading Ease is a common metric.
        # Other metrics available: textstat.flesch_kincaid_grade, textstat.smog_index, etc.
        score = textstat.flesch_reading_ease(text)
        rounded_score = round(score, 2) # Round to two decimal places
        logger.debug(f"Calculated readability score: {rounded_score} for text snippet: '{text[:50]}...'")
        return rounded_score
    except Exception as e:
        # Catch any potential errors from textstat if text is unusual
        logger.error(f"Error calculating readability for text snippet: '{text[:50]}...'. Error: {e}", exc_info=True)
        return 0.0 # Default or error value

# Example usage (for testing purposes, can be removed later)
if __name__ == "__main__":
    sample_text_easy = "The cat sat on the mat. It was a fluffy cat. The cat was happy."
    sample_text_complex = (
        "The utilization of sophisticated methodologies underscored the project's commitment "
        "to achieving unparalleled efficiency and groundbreaking innovation, thereby facilitating "
        "a paradigm shift in conventional operational frameworks."
    )
    empty_text = "   "

    print(f"Easy Text Word Count: {calculate_word_count(sample_text_easy)}")
    print(f"Easy Text Readability (Flesch Reading Ease): {calculate_readability_score(sample_text_easy)}")
    
    print(f"Complex Text Word Count: {calculate_word_count(sample_text_complex)}")
    print(f"Complex Text Readability (Flesch Reading Ease): {calculate_readability_score(sample_text_complex)}")

    print(f"Empty Text Word Count: {calculate_word_count(empty_text)}")
    print(f"Empty Text Readability: {calculate_readability_score(empty_text)}")

    short_text = "One two three."
    print(f"Short Text Word Count: {calculate_word_count(short_text)}")
    print(f"Short Text Readability: {calculate_readability_score(short_text)}") 