"""
Language detection tests for ZenGuard AI.

Users type on WhatsApp and Instagram: romanized Hinglish dominates, but real
scripts appear too. Getting this wrong on the CRISIS message means the most
important reply in the app is unreadable to the person it is for.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from services.language_detect import detect_language  # noqa: E402


def test_native_scripts_detected():
    assert detect_language("मैं आत्महत्या करने जा रहा हूँ") == "devanagari"
    assert detect_language("எனக்கு மிகவும் தயங்கமாக இருக்கிறது") == "tamil"
    assert detect_language("నేను చాలా బతిమాలను అనుభవిస్తున్నాను") == "telugu"
    assert detect_language("ನನಗೆ ತುಂಬಾ ಕಳವಳವಿದೆ") == "kannada"
    assert detect_language("എനിക്ക് വളരെ കഷ്ടപ്പെടുന്നു") == "malayalam"
    assert detect_language("আমি খুব চাপ অনুভব করছি") == "bengali"
    assert detect_language("मी खूप थकलो आहे") == "devanagari"
    assert detect_language("ਮੈਂ ਬਹੁਤ ਡਰੀ ਹੋਈ ਹਾਂ") == "gurmukhi"


def test_hinglish_detected():
    for text in [
        "mujhe khud ko maarne ka mann kar raha hai",
        "mera ghar mein koi nahi samajhta",
        "bahut tension hai yaar, neend nahi aati",
    ]:
        assert detect_language(text) == "hinglish", text


def test_english_detected():
    for text in [
        "I want to kill myself",
        "i feel so hopeless and alone lately",
        "my husband hurts me and i dont know what to do",
    ]:
        assert detect_language(text) == "english", text


def test_roman_regional_defaults_to_hinglish():
    """
    A regional romanized script we cannot confidently name must fall back to
    Hinglish rather than the wrong regional language. Hinglish is understood
    by far more of India than any single state language, so it is the safe
    wrong answer; a confidently-wrong regional reply is not.
    """
    for text in [
        "naan romba udantha irukken",       # Tamil
        "nenu chala baadana nenu feel avutunna",  # Telugu
        "naanu chala worra aghora aagide",  # Kannada
    ]:
        assert detect_language(text) == "hinglish", text


def test_empty_defaults_to_english():
    assert detect_language("") == "english"
    assert detect_language("   ") == "english"
    assert detect_language("12345 !!!") == "english"


def test_single_stray_character_does_not_flip_script():
    """
    A quote mark, emoji, or one Hindi character inside English text must not
    flip the reply language.
    """
    assert detect_language("I am okay — really") == "english"
    assert detect_language("hello, how are you?") == "english"
