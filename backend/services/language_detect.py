"""
Language detection for ZenGuard AI replies.

WHY THIS IS ITS OWN MODULE
--------------------------
Users type on WhatsApp and Instagram. That means Latin-script Hinglish
(romanized Hindi) dominates, but real scripts also appear: Devanagari, Tamil,
Telugu, Bengali, Kannada, Malayalam, Marathi, Gujarati, Punjabi (Gurmukhi),
Odia, and Urdu. City users mix English with the local language; rural users
often send romanized text with heavy local vocabulary.

The single most important property: a person in crisis must receive a message
they can actually READ. Getting the script wrong on the crisis message is the
same as not sending it.
"""

import re

# Unicode block ranges, by script.
_SCRIPT_RANGES = {
    "devanagari": (0x0900, 0x097F),
    "bengali": (0x0980, 0x09FF),
    "gurmukhi": (0x0A00, 0x0A7F),
    "gujarati": (0x0A80, 0x0AFF),
    "odia": (0x0B00, 0x0B7F),
    "tamil": (0x0B80, 0x0BFF),
    "telugu": (0x0C00, 0x0C7F),
    "kannada": (0x0C80, 0x0CFF),
    "malayalam": (0x0D00, 0x0D7F),
    "arabic": (0x0600, 0x06FF),
}


def _count_script(text: str, name: str) -> int:
    lo, hi = _SCRIPT_RANGES[name]
    return sum(1 for ch in text if lo <= ord(ch) <= hi)


def detect_script(text: str) -> str:
    """
    Dominant non-Latin script, or "latin".

    Only reports a script when unambiguously dominant (>20% of letters, >=3
    chars) — a single stray character or an emoji must not flip the reply
    language.
    """
    if not text:
        return "latin"
    letters = sum(1 for ch in text if ch.isalpha())
    if letters == 0:
        return "latin"

    counts = {n: _count_script(text, n) for n in _SCRIPT_RANGES}
    best = max(counts, key=counts.get)
    if counts[best] >= 3 and (counts[best] / letters) > 0.20:
        return best
    return "latin"


# Romanized marker words, as typed on WhatsApp/Instagram.
_ROMAN_MARKERS = {
    "hinglish": {
        "hai", "nahi", "nahin", "kya", "kyu", "kyun", "kaise", "mujhe", "meri",
        "mera", "ham", "hum", "ghar", "kuch", "bhi", "aur", "tha", "thi",
        "raha", "rahi", "liye", "sath", "bohot", "bahut", "acha", "theek",
        "abhi", "phir", "karna", "chahiye", "waqt", "saath", "bhai", "yaar",
        "dost", "jaldi", "baat", "mat", "kar", "karu", "karunga", "jaisa",
        "apna", "apni", "sab", "bilkul", "galat", "chalo", "dekho", "sun",
        "batay", "batao", "pata", "dhanyavad", "zindagi", "marna", "marna",
    },
    "tamil_roman": {
        "naan", "na", "en", "konjam", "vachi", "poi", "soru", "kodu", "illai",
        "irukku", "pattu", "naal", "vaal", "nala", "kasu", "kasa", "epdi",
        "eppadi", "sippu", "pooru", "edhavadhu", "nandri", "anubhavam",
        "valam", "sorga", "udantha", "bearer",
    },
    "telugu_roman": {
        "nenu", "nu", "mee", "koni", "kontha", "ela", "chepp", "undhi",
        "ledu", "kada", "kado", "naa", "maa", "chala", "bagundi", "kalam",
        "kallu", "naaku", "baadana", "feel", "avutunna", "nuvvu", "meeku",
    },
    "kannada_roman": {
        "naanu", "nu", "ee", "naa", "yaava", "yaavudhu", "hagu", "illa",
        "iddi", "andi", "matte", "mattu", "nanage", "nanna", "appa", "kodu",
        "bekti", "solladi", "challi", "bahudu", "dhanyavadagalu", "aghora",
    },
    "malayalam_roman": {
        "ente", "en", "njan", "namma", "ee", "eea", "avoo", "illa", "und",
        "undu", "ith", "kande", "poyi", "kku", "kollal", "sreyam", "dhanyavam",
    },
    "bengali_roman": {
        "ami", "apni", "tumi", "amra", "ar", "se", "ta", "hobo", "hobe",
        "kemon", "koto", "kotha", "amar", "tomar", "krte", "parbe", "dhonnobad",
        "bhalobash", "chhobi", "tension",
    },
    "marathi_roman": {
        "aahes", "aahet", "aahe", "kasa", "kay", "sathi", "mala", "tula",
        "bhau", "aiko", "sang", "thev", "mi", "tumhi", "aapan", "aani", "dhanyavad",
    },
    "gujarati_roman": {
        "hu", "tume", "ame", "taro", "ane", "che", "kevi", "shu", "mate",
        "tamne", "bahu", "dhanyavad", "kay",
    },
    "punjabi_roman": {
        "tenu", "nu", "kinna", "hona", "huns", "pher", "bhad", "shukriya",
        "main", "tu", "koi", "da", "nu",
    },
    "odia_roman": {"mo", "tume", "ham", "san", "kiba", "koto", "dhanyabad"},
}

_ENGLISH_MARKERS = {
    "i", "you", "the", "is", "are", "was", "were", "and", "but", "so",
    "feel", "feeling", "really", "very", "just", "about", "help", "want",
    "cant", "cannot", "dont", "im", "ive", "yesterday", "today", "tomorrow",
    "my", "me", "that", "this", "with", "for", "have", "has", "been", "not",
    "do", "did", "no", "yes", "am", "get", "got", "one", "day", "night",
}


def detect_language(text: str) -> str:
    """
    Return the reply language for `text`.

    Values: "english", "hinglish", or a script name (devanagari, tamil,
    telugu, kannada, malayalam, bengali, marathi, gujarati, gurmukhi, odia,
    arabic).

    Strategy:
      1. Non-Latin script dominant -> that script. High confidence.
      2. Latin script -> score per-language marker sets. Ties and anything
         ambiguous resolve to Hinglish, the lingua franca that far more of
         India understands than any single state language.
      3. No signal -> English (safe default; the model still sees the
         original text and the persona prompt tells it to mirror).
    """
    if not text or not text.strip():
        return "english"

    script = detect_script(text)
    if script != "latin":
        return script

    words = [w.strip("'") for w in re.findall(r"[a-zA-Z']+", text.lower())]
    if not words:
        return "english"

    eng_hits = sum(1 for w in words if w in _ENGLISH_MARKERS)
    scores = {
        lang: sum(1 for w in words if w in markers)
        for lang, markers in _ROMAN_MARKERS.items()
    }

    top_lang = max(scores, key=scores.get)
    top_score = scores[top_lang]

    if top_score == 0:
        return "english"
    if eng_hits > top_score * 1.5 and eng_hits >= 3:
        return "english"
    if top_lang == "hinglish":
        return "hinglish"
    # Ambiguous regional romanization -> Hinglish (understood more widely).
    if scores["hinglish"] >= top_score:
        return "hinglish"
    # A confidently-detected regional romanization (tamil_roman, etc.) is a
    # marker-set key, not a reply language we have vetted crisis copy for.
    # Hinglish is the correct fallback: it is understood across India, and
    # the persona prompt instructs the model to mirror the user's script.
    return "hinglish"
