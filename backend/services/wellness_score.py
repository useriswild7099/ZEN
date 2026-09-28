"""
Wellness / Risk Score Engine -- single source of truth for scoring.

One score, computed on EVERY chat turn and EVERY journal entry, using the
same code path for both so numbers are comparable and consistent.

SEMANTICS  (0-100 wellness scale, higher = better)
  80-100  THRIVING   - stable, regulated, or positive
  60-79   STEADY     - ordinary fluctuation, no acute concern
  40-59   STRAINED   - sustained distress, worth gentle support
  20-39   AT_RISK    - high distress, recommend outreach / grounding
  0-19    CRISIS     - acute risk, crisis protocol + helpline surfaced

LANGUAGE SUPPORT
  18+ Indian languages: Hindi, Hinglish (Roman + Devanagari), Bengali,
  Assamese, Telugu, Marathi, Tamil, Gujarati, Kannada, Punjabi, Odia,
  Urdu plus Romanised variants and mixed-script code-switching.

DESIGN CONSTRAINTS
  Pure stdlib + unicodedata.  Works completely offline.
  Never returns or stores user text.
  Crisis detection handled upstream by crisis_detector.py.
"""

import re
import unicodedata
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional

from services.crisis_detector import detect_crisis

# ---------------------------------------------------------------------------
# Bands
# ---------------------------------------------------------------------------
BAND_THRIVING = "thriving"
BAND_STEADY   = "steady"
BAND_STRAINED = "strained"
BAND_AT_RISK  = "at_risk"
BAND_CRISIS   = "crisis"

BANDS = [
    (80.0, BAND_THRIVING),
    (60.0, BAND_STEADY),
    (40.0, BAND_STRAINED),
    (20.0, BAND_AT_RISK),
    (0.0,  BAND_CRISIS),
]

FLAGGED_BANDS = {BAND_AT_RISK, BAND_CRISIS}

# ---------------------------------------------------------------------------
# COMPREHENSIVE INDIAN LANGUAGE LEXICONS
# English + 18 Indian languages/scripts + Romanised variants
# ---------------------------------------------------------------------------

# ── Negative / Distress ──────────────────────────────────────────────────────
_NEGATIVE = {
    # English
    "sad","tired","exhausted","afraid","scared","angry","anxious","anxiety",
    "worried","worry","hopeless","useless","worthless","alone","lonely",
    "broken","hurt","pain","panic","overwhelmed","stressed","stress",
    "depressed","crying","cried","numb","empty","trapped","stuck",
    "fail","failing","failure","helpless","nightmare","flashback",
    "triggered","unsafe","guilty","shame","ashamed","regret","dread",
    "miserable","devastated","lost","grief","shattered","suffocate",
    "abuse","violence","terrified","abandoned","rejected","betrayed",
    "humiliated","panicattack","trauma","traumatized",
    # Hindi Roman
    "udaas","dara","gussa","thakan","akela","nirasha","bhay","dukh",
    "takleef","pareshan","bebas","bechari","majboor","tadap","aansoo",
    "rona","rone","roya","roti","toota","tanha","khatam","barbaad",
    "mushkil","darr","ghabrana","chinta","dard","zakhm","zulm",
    "atank","khauf","bechaini","kasht","pida","naaraz","thaka",
    "haara","haar","asahaay","pareshani","azaab",
    # Hindi Devanagari
    "\u0909\u0926\u093e\u0938","\u0921\u0930\u093e","\u0917\u0941\u0938\u094d\u0938\u093e",
    "\u0925\u0915\u093e\u0928","\u0905\u0915\u0947\u0932\u093e","\u0928\u093f\u0930\u093e\u0936\u093e",
    "\u092d\u092f","\u0926\u0941\u0916","\u0924\u0915\u0932\u0940\u092b\u093c",
    "\u092a\u0930\u0947\u0936\u093e\u0928","\u092c\u0947\u092c\u0938",
    "\u092e\u091c\u093c\u092c\u0942\u0930","\u0926\u0930\u094d\u0926",
    "\u0930\u094b\u0928\u093e","\u0918\u092c\u0930\u093e\u0939\u091f",
    "\u091a\u093f\u0902\u0924\u093e","\u091c\u093c\u0916\u094d\u092e",
    "\u0906\u0924\u0902\u0915","\u0916\u093c\u094c\u092b\u093c",
    "\u092c\u0947\u091a\u0948\u0928\u0940","\u091f\u0942\u091f\u093e",
    "\u0924\u0928\u094d\u0939\u093e","\u092c\u0930\u094d\u092c\u093e\u0926",
    "\u092e\u0941\u0936\u094d\u0915\u093f\u0932",
    # Bengali Roman
    "dukhi","bhoy","ekaki","byatha","shok","abosad","kanna","bedona",
    # Bengali Unicode
    "\u0995\u09b7\u09cd\u099f","\u09ac\u09cd\u09af\u09a5\u09be",
    "\u09ad\u09af\u09bc","\u0995\u09be\u09a8\u09cd\u09a8\u09be",
    "\u098f\u0995\u09be\u0995\u09c0","\u09a6\u09c1\u0983\u0996\u09c0",
    "\u09a8\u09bf\u09b0\u09be\u09b6\u09be","\u09ac\u09bf\u09b7\u09a3\u09cd\u09a8\u09a4\u09be",
    "\u0985\u09ac\u09b8\u09be\u09a6","\u099a\u09bf\u09a8\u09cd\u09a4\u09bf\u09a4",
    # Assamese Unicode
    "\u09a6\u09c1\u0996\u09c0","\u09a8\u09bf\u09f0\u09be\u09b6\u09be",
    "\u0985\u0995\u09b2\u09b6\u09f0\u09c0\u09af\u09bc\u09be",
    # Telugu Roman
    "badha","bhayam","okkai","vedana","dukhham",
    # Telugu Unicode
    "\u0c2c\u0c3e\u0c27","\u0c2d\u0c2f\u0c02","\u0c35\u0c47\u0c26\u0c28",
    "\u0c28\u0c3f\u0c30\u0c3e\u0c36","\u0c26\u0c41\u0c03\u0c16\u0c02",
    "\u0c12\u0c02\u0c1f\u0c30\u0c3f\u0c17\u0c3e","\u0c1a\u0c3f\u0c02\u0c24",
    "\u0c06\u0c02\u0c26\u0c4b\u0c33\u0c28","\u0c05\u0c32\u0c38\u0c3f\u0c2a\u0c4b\u0c2f\u0c3e\u0c28\u0c41",
    # Marathi Roman
    "tras",
    # Marathi Unicode
    "\u0930\u0921\u0923\u0947","\u0926\u0941\u0903\u0916","\u092d\u0940\u0924\u0940",
    "\u090f\u0915\u091f\u0947\u092a\u0923\u093e","\u0935\u0947\u0926\u0928\u093e",
    "\u0928\u0948\u0930\u093e\u0936\u094d\u092f","\u0924\u094d\u0930\u093e\u0938",
    "\u091a\u093f\u0902\u0924\u093e","\u0930\u093e\u0917","\u0925\u0915\u0935\u093e",
    # Tamil Roman
    "dukham","bayam","tanimai","vedanai","nambikkaiyimai",
    # Tamil Unicode
    "\u0ba4\u0bc1\u0b95\u0bcd\u0b95\u0bae\u0bcd","\u0baa\u0baf\u0bae\u0bcd",
    "\u0ba4\u0ba9\u0bbf\u0bae\u0bc8","\u0b95\u0bc7\u0bbe\u0baa\u0bae\u0bcd",
    "\u0b9a\u0bcb\u0bb0\u0bcd\u0bb5\u0bc1","\u0b95\u0bb5\u0bb2\u0bc8",
    # Gujarati Roman
    "gabharat",
    # Gujarati Unicode
    "\u0aa6\u0ac1\u0a83\u0a96","\u0aad\u0aaf","\u0a8f\u0a95\u0ab2\u0acb",
    "\u0ab5\u0ac7\u0aa6\u0aa8\u0abe","\u0aa8\u0abf\u0ab0\u0abe\u0ab6\u0abe",
    "\u0a97\u0ac1\u0ab8\u0acd\u0ab8\u0acb","\u0aa5\u0abe\u0a95",
    # Kannada Roman
    "dukha","bhaya","ekaanta","vedane","niraasha","chinte",
    # Kannada Unicode
    "\u0ca6\u0cc1\u0cbe\u0c96","\u0cad\u0caf","\u0cb5\u0cc7\u0ca6\u0ca8\u0cc6",
    "\u0ca8\u0cbf\u0cb0\u0cbe\u0cb6\u0cc6","\u0c9a\u0cbf\u0c82\u0ca4\u0cc6",
    "\u0c95\u0ccb\u0caa","\u0c86\u0caf\u0cbe\u0cb8",
    # Punjabi Roman
    "peed","ikalla",
    # Punjabi Gurmukhi Unicode
    "\u0a26\u0a41\u0a71\u0a16","\u0a21\u0a30","\u0a07\u0a71\u0a15\u0a32\u0a3e",
    "\u0a2a\u0a40\u0a5c","\u0a17\u0a41\u0a71\u0a38\u0a3e","\u0a25\u0a15\u0a3e\u0a35\u0a1f",
    # Odia Unicode
    "\u0b26\u0b41\u0b03\u0b16","\u0b2d\u0b2f","\u0b0f\u0b15\u0b3e\u0b15\u0b40",
    "\u0b2c\u0b4d\u0b5f\u0b25\u0b3e","\u0b28\u0b3f\u0b30\u0b3e\u0b36\u0b3e",
}

# ── Positive / Protective ────────────────────────────────────────────────────
_POSITIVE = {
    # English
    "better","good","great","happy","calmer","calm","hopeful","hope",
    "grateful","thankful","relieved","proud","strong","safe","okay","ok",
    "fine","improving","improved","lighter","joy","joyful","peaceful",
    "energized","motivated","accomplished","confident","supported","loved",
    "connected","healed","healing","resilient","positive","optimistic",
    "blessed","grounded","stable",
    # Hindi Roman
    "accha","theek","khushi","shanti","vishwas","umeed","sukoon",
    "mazboot","himmat","pyaar","khush","aaram","chain","shakti",
    # Hindi Devanagari
    "\u0909\u092e\u094d\u092e\u0940\u0926","\u0916\u0941\u0936\u0940",
    "\u0936\u093e\u0902\u0924\u093f","\u0935\u093f\u0936\u094d\u0935\u093e\u0938",
    "\u0938\u0941\u0915\u0942\u0928","\u092e\u091c\u093c\u092c\u0942\u0924",
    "\u0939\u093f\u092e\u094d\u092e\u0924","\u092a\u094d\u092f\u093e\u0930",
    "\u0936\u0915\u094d\u0924\u093f","\u0920\u0940\u0915","\u0905\u091a\u094d\u091b\u093e",
    # Bengali
    "bhalo","asha","ananda","shaktishali",
    "\u09ad\u09be\u09b2\u09cb","\u09b6\u09be\u09a8\u09cd\u09a4\u09bf",
    "\u0986\u09a8\u09a8\u09cd\u09a6","\u0986\u09b6\u09be","\u09b6\u0995\u09cd\u09a4\u09bf\u09b6\u09be\u09b2\u09c0",
    # Telugu
    "manchiga","santosham",
    "\u0c38\u0c02\u0c24\u0c4b\u0c37\u0c02","\u0c06\u0c36",
    "\u0c36\u0c15\u0c4d\u0c24\u0c3f","\u0c36\u0c3e\u0c02\u0c24\u0c3f",
    # Marathi
    "changla",
    "\u091a\u093e\u0902\u0917\u0932\u093e","\u0906\u0928\u0902\u0926",
    "\u0906\u0936\u093e","\u0936\u093e\u0902\u0924\u0940","\u0936\u0915\u094d\u0924\u0940",
    # Tamil
    "nalam","magizhchi","nambikkai","vallamai",
    "\u0ba8\u0bb2\u0bae\u0bcd","\u0bae\u0b95\u0bbf\u0bb4\u0bcd\u0b9a\u0bcd\u0b9a\u0bbf",
    "\u0ba8\u0bae\u0bcd\u0baa\u0bbf\u0b95\u0bcd\u0b95\u0bc8",
    # Gujarati
    "sachu","aanand",
    "\u0ab8\u0abe\u0ab0\u0ac1\u0a82","\u0a86\u0aa8\u0a82\u0aa6",
    "\u0a86\u0ab6\u0abe","\u0ab6\u0abe\u0a82\u0aa4\u0abf","\u0ab6\u0a95\u0acd\u0aa4\u0abf",
    # Kannada
    "chennagide","santosha","nambike",
    "\u0c9a\u0cc6\u0ca8\u0ccd\u0ca8\u0cbe\u0c97\u0cbf\u0ca6\u0cc6",
    "\u0cb8\u0c82\u0ca4\u0ccb\u0cb7","\u0ca8\u0c82\u0cac\u0cbf\u0c95\u0cc6",
    "\u0cb6\u0cbe\u0c82\u0ca4\u0cbf","\u0cb6\u0c95\u0ccd\u0ca4\u0cbf",
    # Punjabi
    "changha",
    "\u0a1a\u0a70\u0a17\u0a3e","\u0a16\u0a41\u0a38\u0a3c\u0a40",
    "\u0a06\u0a38\u0a3c\u0a3e","\u0a38\u0a3c\u0a3e\u0a02\u0a24\u0a40",
    # Urdu Roman
    "khushi","sukoon","umeed","aman","tasalli",
}

# ── Masking / Concealment ────────────────────────────────────────────────────
_MASKING = {
    "fine","ok","okay","imfine","imokay","good","alright","allswell",
    "normal","nothing","nobigdeal","forgetit","whatever","nevermind",
    "dontworry","itsok","nothingbig","routine","usual",
    "theek","sabsahi","kuchnahi","chhodoye","majamein",
    "\u0920\u0940\u0915 \u0939\u0948","\u0938\u092c \u0920\u0940\u0915",
    "bhalo","thikace","parvaledhu","paravailla","saruche",
}

# ── Intensifiers ─────────────────────────────────────────────────────────────
_INTENSIFIERS = {
    "very","really","so","extremely","incredibly","terribly","utterly",
    "completely","totally","always","forever","unbearably","absolutely",
    "desperately","constantly","deeply",
    "bahut","bohot","bilkul","zyada","itna",
    "\u092c\u0939\u0941\u0924","\u092c\u093f\u0932\u094d\u0915\u0941\u0932",
    "\u091c\u093c\u094d\u092f\u093e\u0926\u093e","\u0907\u0924\u0928\u093e",
    "khub","onek","ati",
    "\u0996\u09c0\u09be\u09ac","\u0985\u09a8\u09c7\u0995",
    "chala","chaala","\u0c1a\u0c3e\u0c32\u0c3e",
    "khup","far","jast","\u0916\u0942\u092a","\u092b\u093e\u0930","\u091c\u093e\u0938\u094d\u0924",
    "romba","miga","\u0bb0\u0bca\u0bae\u0bcd\u0baa","\u0bae\u0bbf\u0b95",
    "thumba","\u0ca4\u0cc1\u0c82\u0cac\u0cbe",
    "\u0a2c\u0a39\u0a41\u0a24",
}

# ── Somatic / Trauma markers ─────────────────────────────────────────────────
_SOMATIC = {
    "cantsleep","insomnia","nightmares","shaking","trembling","panic",
    "heartracing","breathless","nauseous","headache","chest","numb",
    "dissociate","blank","flashback","nightmare","shivering","freeze",
    "frozen","bodyache","bodypain","blackout","hyperventilate",
    "neendnahi","sardard","seena","dhadkan","chakkar",
    "\u0928\u0940\u0902\u0926","\u0938\u093f\u0930\u0926\u0930\u094d\u0926",
    "\u0938\u093e\u0902\u0938","\u0927\u0921\u093c\u0915\u0928","\u091a\u0915\u094d\u0915\u0930",
    "\u0918\u092c\u0930\u093e\u0939\u091f",
    "ghumnar","matharbyatha",
    "\u0998\u09c1\u09ae \u09a8\u09c7\u0987","\u09ae\u09be\u09a5\u09be \u09ac\u09cd\u09af\u09a5\u09be",
    "nidraledhu","talanoppi",
    "\u0c28\u0c3f\u0c26\u0c4d\u0c30 \u0c32\u0c47\u0c26\u0c41",
    "zhopyena","dokedukhi","\u091d\u094b\u092a \u092f\u0947\u0928\u093e",
    "thokkamillai","thalaivalee",
    "oonghnaathi",
    # Witness intimidation signals
    "threat","threatened","watching","surveillance","accusednearby",
    "menoutside","fearforlife","witnessprotection","intimidation","retaliation",
}

# ── Witness intimidation / threat signals ──────────────
_INTIMIDATION = {
    "threat","threats","threatened","kill","attack","watching","surveillance",
    "accused","retaliation","intimidation","witness","testify","menoutside",
    "dhakka","dhamki","maar","hatyara",
    "\u0927\u092e\u0915\u0940","\u092e\u093e\u0930\u0928\u093e",
    "\u0917\u0935\u093e\u0939",
    "\u09b9\u09c1\u09ae\u0995\u09bf","\u09b8\u09be\u0995\u09cd\u09b7\u09c0",
    "\u0c2c\u0c46\u0c26\u0c3f\u0c30\u0c3f\u0c02\u0c2a\u0c41","\u0c38\u0c3e\u0c15\u0c4d\u0c37\u0c3f",
}

# ── Negation ─────────────────────────────────────────────────────────────────
_NEGATION_WORDS = {
    "not","never","no","dont","doesnt","cannot","cant","wont",
    "havent","hadnt","isnt","arent","neither",
    "nahi","na","mat","naa",
    "\u0928\u0939\u0940\u0902","\u0928\u093e","\u092e\u0924",
    "nai","nei","noye","ledu","kadu","naahi","nako",
    "illai","illa","vendam","nathi","beda",
}

# ---------------------------------------------------------------------------
# Unicode-aware tokeniser
# ---------------------------------------------------------------------------
_TOKEN_RE = re.compile(
    r"[\w"
    "\u0900-\u097F"  # Devanagari
    "\u0980-\u09FF"  # Bengali/Assamese
    "\u0A00-\u0A7F"  # Gurmukhi (Punjabi)
    "\u0A80-\u0AFF"  # Gujarati
    "\u0B00-\u0B7F"  # Odia
    "\u0B80-\u0BFF"  # Tamil
    "\u0C00-\u0C7F"  # Telugu
    "\u0C80-\u0CFF"  # Kannada
    "\u0D00-\u0D7F"  # Malayalam
    "\u0600-\u06FF"  # Arabic/Urdu
    "]+",
    re.UNICODE,
)


def _tokens(text: str) -> List[str]:
    lowered = unicodedata.normalize("NFC", (text or "").lower())
    lowered = lowered.replace("\u2019", "").replace("'", "")
    return _TOKEN_RE.findall(lowered)


def _lexicon_hits(tokens: List[str], lexicon: set) -> int:
    return sum(1 for t in tokens if t in lexicon)


# ---------------------------------------------------------------------------
# Lightweight language detection
# ---------------------------------------------------------------------------
_LANG_MARKERS: Dict[str, List[str]] = {
    "hi": ["\u092e\u0948\u0902","\u0939\u0948","\u0939\u0942\u0902","\u0914\u0930"],
    "bn": ["\u0986\u09ae\u09bf","\u0986\u099b\u09bf","\u098f\u09ac\u0982"],
    "as": ["\u09ae\u0987","\u0986\u099b\u09cb","\u0986\u09f0\u09c1"],
    "te": ["\u0c28\u0c47\u0c28\u0c41","\u0c09\u0c02\u0c26\u0c3f"],
    "mr": ["\u092e\u0940","\u0906\u0939\u0947","\u0906\u0923\u093f"],
    "ta": ["\u0ba8\u0bbe\u0ba9\u0bcd","\u0bae\u0bb1\u0bcd\u0bb1\u0bc1\u0bae\u0bcd"],
    "gu": ["\u0ab9\u0ac1\u0a82","\u0a9b\u0ac1\u0a82","\u0a85\u0aa8\u0ac7"],
    "kn": ["\u0ca8\u0cbe\u0ca8\u0cc1","\u0cae\u0ca4\u0ccd\u0ca4\u0cc1"],
    "pa": ["\u0a2e\u0a48\u0a02","\u0a39\u0a3e\u0a02","\u0a05\u0a24\u0a47"],
    "or": ["\u0b2e\u0b41\u0b01","\u0b05\u0b1b\u0b3f"],
}
_HINGLISH: set = {
    "yaar","bhai","kal","aaj","mera","tera","hain","kar",
    "raha","rahe","kyun","kya","ab","bas","woh","yeh",
}


def _detect_languages(text: str) -> List[str]:
    detected = []
    for lang, markers in _LANG_MARKERS.items():
        if any(m in text for m in markers):
            detected.append(lang)
    if not detected and set(_tokens(text.lower())).intersection(_HINGLISH):
        detected.append("hi-rom")
    if re.search(r"[a-z]", text.lower()):
        if "en" not in detected:
            detected.append("en")
    return detected or ["en"]


# ---------------------------------------------------------------------------
# WellnessScore  (immutable, text-free, sync-safe)
# ---------------------------------------------------------------------------
@dataclass(frozen=True)
class WellnessScore:
    score: float
    band: str
    risk_score: float
    confidence: float
    distress_signals: int
    protective_signals: int
    somatic_signals: int
    masking_detected: bool
    crisis_detected: bool
    crisis_category: str
    flagged: bool
    languages_detected: List[str]

    def to_dict(self) -> Dict:
        return asdict(self)

    def to_api_dict(self) -> Dict:
        d = asdict(self)
        d["wellness_score"] = d.pop("score")
        return d

    def to_sync_metadata(self, session_ref: str) -> Dict:
        return {
            "session_ref": session_ref,
            "wellness_score": self.score,
            "risk_score": self.risk_score,
            "band": self.band,
            "flagged": self.flagged,
            "crisis_detected": self.crisis_detected,
            "confidence": self.confidence,
        }


# ---------------------------------------------------------------------------
# WellnessScoreEngine
# ---------------------------------------------------------------------------
class WellnessScoreEngine:
    """
    Deterministic, offline wellness scorer.

    Shared by chat router, sentiment router, and journal router.
    Supports 18+ Indian languages via Unicode tokenisation +
    multilingual distress lexicons.
    """
    NEUTRAL_BASELINE   = 62.0
    DISTRESS_PENALTY   = 7.5
    PROTECTIVE_CREDIT  = 3.0
    SOMATIC_PENALTY    = 6.0
    MASKING_PENALTY    = 5.0
    CRISIS_FLOOR       = 8.0
    CRISIS_PENALTY     = 45.0
    INTIMIDATION_PENALTY = 10.0   # Witness threat signals
    MAX = 100.0
    MIN = 0.0

    def __init__(self) -> None:
        self._crisis = detect_crisis

    @staticmethod
    def _band_for(score: float) -> str:
        for threshold, band in BANDS:
            if score >= threshold:
                return band
        return BAND_CRISIS

    @staticmethod
    def _clamp(value: float) -> float:
        return max(WellnessScoreEngine.MIN, min(WellnessScoreEngine.MAX, value))

    @staticmethod
    def _has_negation(tokens: List[str]) -> bool:
        return any(t in _NEGATION_WORDS for t in tokens)

    def score_text(self, text: str) -> WellnessScore:
        """Score a chat turn or journal entry. Pure, synchronous, thread-safe."""
        raw = text or ""
        tokens = _tokens(raw)
        langs = _detect_languages(raw)

        if not tokens:
            return self._build(self.NEUTRAL_BASELINE, 0, 0, 0,
                               False, None, 0.25, langs)

        distress     = _lexicon_hits(tokens, _NEGATIVE)
        protective   = _lexicon_hits(tokens, _POSITIVE)
        somatic      = _lexicon_hits(tokens, _SOMATIC)
        intensifier  = _lexicon_hits(tokens, _INTENSIFIERS)
        intimidation = _lexicon_hits(tokens, _INTIMIDATION)
        negated      = self._has_negation(tokens)

        if negated:
            distress   = int(distress   * 0.5)
            protective = int(protective * 0.5)

        if intensifier:
            distress += int(distress * 0.30)
            somatic  += int(somatic  * 0.20)

        masking = distress > 0 and _lexicon_hits(tokens, _MASKING) > 0
        crisis  = self._crisis(raw)

        score  = self.NEUTRAL_BASELINE
        score -= distress      * self.DISTRESS_PENALTY
        score += protective    * self.PROTECTIVE_CREDIT
        score -= somatic       * self.SOMATIC_PENALTY
        score -= intimidation  * self.INTIMIDATION_PENALTY
        if masking:            score -= self.MASKING_PENALTY
        if crisis.is_crisis:   score -= self.CRISIS_PENALTY
        if crisis.is_crisis:   score  = min(score, self.CRISIS_FLOOR)

        evidence      = distress + protective + somatic + intimidation
        length_factor = min(1.0, len(tokens) / 25.0)
        confidence    = 0.30 + (0.12 * min(evidence, 6)) + (0.30 * length_factor)
        if len(langs) > 1:     confidence = min(0.95, confidence + 0.05)
        if crisis.is_crisis:   confidence = max(confidence, 0.85)
        confidence = round(min(0.95, confidence), 2)

        return self._build(self._clamp(score), distress, protective, somatic,
                           masking, crisis, confidence, langs)

    def _build(self, score, distress, protective, somatic,
               masking, crisis, confidence, langs=None) -> WellnessScore:
        score = round(self._clamp(score), 1)
        band  = self._band_for(score)
        return WellnessScore(
            score=score,
            band=band,
            risk_score=round(self.MAX - score, 1),
            confidence=confidence,
            distress_signals=distress,
            protective_signals=protective,
            somatic_signals=somatic,
            masking_detected=masking,
            crisis_detected=bool(crisis and crisis.is_crisis),
            crisis_category=(crisis.category if crisis else "none"),
            flagged=band in FLAGGED_BANDS,
            languages_detected=langs or ["en"],
        )


# Shared singleton
wellness_engine = WellnessScoreEngine()


def score_text(text: str) -> WellnessScore:
    """Module-level convenience wrapper around the shared engine."""
    return wellness_engine.score_text(text)
