import string

def calculate_word_count(text: str) -> int:
    """Calculates the number of words in a given text string."""
    if not text or text.isspace():
        return 0
    # Remove punctuation
    translator = str.maketrans('', '', string.punctuation)
    text_without_punctuation = text.translate(translator)
    words = text_without_punctuation.split()
    return len(words) 