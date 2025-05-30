import pytest
from app.utils.resume_analyzer_utils import calculate_word_count, calculate_readability_score

# Test cases for calculate_word_count
@pytest.mark.parametrize("text, expected_count", [
    ("Hello world", 2),
    ("This is a sentence with five words.", 7),
    ("", 0),
    ("   ", 0),
    ("Word", 1),
    ("Multiple   spaces    between words", 4),
    (" Leading and trailing spaces  ", 4)
])
def test_calculate_word_count(text, expected_count):
    assert calculate_word_count(text) == expected_count

# Test cases for calculate_readability_score
# Note: Readability scores can be sensitive. These are approximate expectations.
# textstat might need a certain amount of text to give meaningful scores.
@pytest.mark.parametrize("text, expected_range_min, expected_range_max, is_short_text_case", [
    ("The cat sat on the mat. It was a fluffy cat. The cat was happy.", 90, 110, False), # Simple text, high score
    ("This is an easy sentence to read. It has short words.", 90, 110, False),
    # Complex text (ensure enough words for textstat to work reliably)
    (
        "The utilization of sophisticated methodologies underscored the project's commitment "
        "to achieving unparalleled efficiency and groundbreaking innovation, thereby facilitating "
        "a paradigm shift in conventional operational frameworks. This strategic imperative was pivotal.",
        -50, 50, False # Complex text, lower score
    ),
    ("", 0, 0, True), # Empty text
    ("   ", 0, 0, True), # Only spaces
    ("One two three four five six seven eight nine.", 0, 0, True), # Short text (less than 10 words should return 0 based on our util)
    ("One two three four five six seven eight nine ten.", 0, 100, False) # Edge case of 10 words
])
def test_calculate_readability_score(text, expected_range_min, expected_range_max, is_short_text_case):
    score = calculate_readability_score(text)
    if is_short_text_case:
        assert score == 0.0
    else:
        assert isinstance(score, float)
        if text == "One two three four five six seven eight nine ten.":
            assert score > 50
        else:
            assert expected_range_min <= score <= expected_range_max 