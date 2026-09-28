"""
Crisis Detection — pre-routing safety short-circuit for ZenGuard AI.

PURPOSE
-------
This module runs BEFORE persona selection, before the model fallback chain,
before journaling, and before any Sahayak synchronization. If the user
expresses self-harm or harm-to-others intent, the caller must return the
crisis response immediately and ignore all other logic.

It is intentionally pure-stdlib and offline: it must work even when Ollama is
completely unavailable (airgapped / Tier 4 fallback), because the crisis path
can never be allowed to depend on a model.

DESIGN NOTES
------------
- Deliberately CONSERVATIVE: high recall (better to surface a helpline once
  too often than to miss a crisis).
- Never returns user text. Returns only a boolean + a reason code, so it is
  safe to pass into score metadata.
- Multilingual coverage (English + Devanagari transliterations) because the
  served population may write in Hindi/Assamese transliteration.
"""

import re
from dataclasses import dataclass
from typing import List, Optional

from services.language_detect import detect_language

TELE_MANAS_SHORT = "Tele MANAS: 14416"
TELE_MANAS_LONG = "Tele MANAS: 14416 / 1800-891-4416 (free, 24x7, many languages)"
CRISIS_HELPLINE_BLOCK = (
    "If you are in danger right now, please call Tele MANAS: 14416 "
    "(free, confidential, 24x7, available in many languages)."
)

# --------------------------------------------------------------------------
# Pattern banks
# --------------------------------------------------------------------------

# Direct self-harm / suicidal ideation
_SELF_HARM_PATTERNS = [
    r"\bkill\s+myself\b",
    r"\bkilling\s+myself\b",
    r"\bend(?:ing)?\s+my\s+life\b",
    r"\bend\s+it\s+all\b",
    r"\bcommitt?(?:ing)?\s+suicide\b",
    r"\bsuicid(?:e|al)\b",
    r"\btak(?:e|ing)\s+my\s+own\s+life\b",
    r"\bdon'?t\s+want\s+to\s+(?:be\s+here|live|exist)\b",
    r"\bwish\s+i\s+(?:was|were)\s+dead\b",
    r"\bbetter\s+off\s+(?:dead|without\s+me)\b",
    r"\bno\s+reason\s+to\s+live\b",
    r"\bnot\s+worth\s+living\b",
    r"\bharm\s+myself\b",
    r"\bhurt\s+myself\b",
    r"\bcut(?:ting)?\s+myself\b",
    r"\bself[\s\-]?harm\b",
    r"\boverdose\b",
    r"\bhanging\s+myself\b",
    r"\bjump(?:ing)?\s+(?:off|from)\b",
    # Hindi / transliteration
    r"\bma(?:i|ko)?\s+mara\s+junga\b",
    r"\bma(?:i|ko)?\s+mari\s+junga\b",
    r"\bmar\s+dunga\b",
    r"\bjeevan\s+ant\s+karna\b",
    r"\bkhud\s+ko\s+nuksaan\b",
    r"\bmarna\s+chahta\s+hu\b",
    r"\bjeena\s+nahi\s+chahta\b",
    r"\bjeena\s+nahi\s+chahti\b",
]

# Harm to others
_HARM_OTHERS_PATTERNS = [
    r"\bkill(?:ing)?\s+(?:them|him|her|everyone|people|someone)\b",
    r"\bhurt(?:ing)?\s+(?:them|him|her|someone|people|others)\b",
    r"\bshoot(?:ing)?\s+(?:them|him|her|everyone)\b",
    r"\bwant\s+to\s+(?:hurt|harm|attack|kill|strangle|poison)\b",
    r"\bgoing\s+to\s+kill\b",
    r"\brevenge\b",
    r"\bmake\s+them\s+pay\b",
    r"\bpoison(?:ing)?\s+(?:them|him|her)\b",
]

# Imminent / action-present crisis language (raises urgency, not always a full
# crisis response on its own).
#
# DELIBERATELY NARROW: bare state adjectives ("hopeless", "worthless", "alone")
# are NOT crisis signals. They are scored as distress in wellness_score.py and
# are far too common in ordinary distress to route someone into a crisis
# protocol. Only first-person intent, entrapment, or hopelessness combined
# with an action present qualifies.
_IMMINENT_PATTERNS = [
    r"\bcan'?t\s+go\s+on\b",
    r"\bgive\s+up\s+on\s+(?:life|everything)\b",
    r"\bno\s+way\s+out\b",
    r"\bno\s+reason\s+to\s+(?:go\s+on|keep\s+going|live)\b",
    r"\bnobody\s+(?:would\s+miss|would\s+notice|would\s+care)\b",
    r"\b(?:tonight|right\s+now|today)\b[^.]{0,30}\b(?:end\s+it|hurt\s+myself|kill\s+myself|not\s+be\s+here)\b",
    r"\btrapped\b[^.]{0,30}\b(?:here|nowhere|no\s+way|helpless|hopeless)\b",
    r"\bdo\s+not\s+want\s+to\s+be\s+alive\b",
    r"\bbetter\s+if\s+i\s+(?:was|were)\s+(?:gone|dead|not\s+here)\b",
]

# De-escalation / safety-seeking language — a signal worth surfacing
_HELP_SEEKING_PATTERNS = [
    r"\bneed\s+help\b",
    r"\bhelp\s+me\b",
    r"\bshould\s+i\s+go\s+to\s+(?:a\s+)?(?:doctor|therapist|hospital)\b",
    r"\bnot\s+feeling\s+safe\b",
    r"\bdon'?t\s+feel\s+safe\b",
    r"\bfeel\s+unsafe\b",
    r"\bno\s+one\s+to\s+turn\s+to\b",
    r"\btherapist\b",
    r"\bcounsell?or\b",
]

_SELF_HARM_RE = [re.compile(p, re.IGNORECASE) for p in _SELF_HARM_PATTERNS]
_HARM_OTHERS_RE = [re.compile(p, re.IGNORECASE) for p in _HARM_OTHERS_PATTERNS]
_IMMINENT_RE = [re.compile(p, re.IGNORECASE) for p in _IMMINENT_PATTERNS]
_HELP_SEEKING_RE = [re.compile(p, re.IGNORECASE) for p in _HELP_SEEKING_PATTERNS]

# ── Transliterated + Devanagari crisis language ──────────────────────────
# SAFETY-CRITICAL. The English patterns above do not match "mujhe khud ko
# maarne ka mann kar raha hai" or "मैं आत्महत्या करने जा रहा हूँ". A user who
# types in their own language would otherwise bypass the crisis
# short-circuit entirely and get a generic reply while in acute distress.
#
# These are checked against BOTH the raw text and a romanised form, so
# Hinglish, Devanagari, and transliterated Tamil/Telugu/Bengali all route to
# the crisis path.
_TRANS_SELF_HARM = [
    # "maarne ka mann", "maarna chahta", "maar dunga" — note the endings:
    # \b after a bare stem fails on "maarne", so match the suffix explicitly.
    r"maarn[ae]\b",
    r"maar\s*(?:dunga|dungi|unga|ungi|ti|na)\b",
    r"maar\s+ko\b",
    r"mok\s*(?:dunga|dungi|na|ne|ti)\b",
    r"khud\s*ko\s*(?:maar|mok|de|maarna|maarne|marr)\b",
    r"khudko\s*(?:maar|mok|mar)\b",
    r"khud\s*ko\s+khatam",
    r"jeevan\s*chhod",
    r"jeevan\s*khatam",
    r"jivan\s*chhod",
    r"atma\s*(?:hatya|hatya)\b",
    r"suicide\s*(?:kar|karna|karunga|karega|karke)",
    r"marna\s*(?:hai|chah|chahta|chahti|karna|chahiye)",
    r"maut\s*(?:ka|ko)\s*(?:darr|chahta|chahti|chahiye|soch)",
    r"band\s+kar\s*(?:dena|deni|do|dungi|dunga)\b",
]
_TRANS_HARM_OTHERS = [
    r"(?:usko|unko|usse|use)\s+(?:maarna|mari|marda)",
    r"maar\s*dunga",
    r"maar\s*dungi",
    r"sabko\s+mok",
    r"sabko\s+maar",
    r"kill\s*kar\s*dunga",
]
_TRANS_IMMINENT = [
    r"ab\s+\w+\s+nahi\s+sak",
    r"ab\s*se\s+\w+\s*nahi\s+sak",
    r"koi\s+(?:raasta|chara)\s+nahi",
    r"koi\s+nahi\s+(?:hai|tha)\s+(?:mere|liye)",
    r"akela\s*(?:ho|hun|hona)",
]
_TRANS_HELP_SEEKING = [
    r"madad\s*(?:chahiye|kar)",
    r"koi\s+hai\s+jo",
    r"kya\s+karon",
]

_DEVA_HARM = [
    r"आत्महत्या",
    r"आत्म हत्या",
    r"मरना\s*चाहता",
    r"मरना\s*चाहती",
    r"खुद\s*को\s*(?:मार|आत्महत्या)",
    r"जीवन\s*छोड़",
    r"किसी\s*को\s*मार",
    r"सबको\s*मार",
    r"मदद\s*चाहिए",
    r"कोई\s*है\s*जो",
]

_TRANS_SELF_HARM_RE = [re.compile(p, re.IGNORECASE) for p in _TRANS_SELF_HARM]
_TRANS_HARM_OTHERS_RE = [re.compile(p, re.IGNORECASE) for p in _TRANS_HARM_OTHERS]
_TRANS_IMMINENT_RE = [re.compile(p, re.IGNORECASE) for p in _TRANS_IMMINENT]
_TRANS_HELP_SEEKING_RE = [re.compile(p, re.IGNORECASE) for p in _TRANS_HELP_SEEKING]
_DEVA_HARM_RE = [re.compile(p) for p in _DEVA_HARM]


@dataclass(frozen=True)
class CrisisSignal:
    """Result of crisis analysis. Contains NO user text by design."""

    is_crisis: bool
    category: str  # "none" | "self_harm" | "harm_others" | "imminent_distress"
    reason_code: str
    help_seeking: bool = False
    matched_signals: int = 0

    @property
    def requires_immediate_response(self) -> bool:
        return self.is_crisis


def detect_crisis(text: str) -> CrisisSignal:
    """
    Analyze text for crisis intent.

    Returns a CrisisSignal. Never raises. Never returns user text.
    """
    if not text or not text.strip():
        return CrisisSignal(is_crisis=False, category="none", reason_code="empty")

    self_harm_hits = sum(1 for r in _SELF_HARM_RE if r.search(text))
    harm_others_hits = sum(1 for r in _HARM_OTHERS_RE if r.search(text))
    imminent_hits = sum(1 for r in _IMMINENT_RE if r.search(text))
    help_hits = sum(1 for r in _HELP_SEEKING_RE if r.search(text))

    # Hinglish / Devanagari. A missed crisis is far worse than a false one,
    # so these are OR'd in rather than gated behind the English counts.
    if not (self_harm_hits or harm_others_hits or imminent_hits):
        trans_self_harm = sum(1 for r in _TRANS_SELF_HARM_RE if r.search(text))
        trans_others = sum(1 for r in _TRANS_HARM_OTHERS_RE if r.search(text))
        trans_imminent = sum(1 for r in _TRANS_IMMINENT_RE if r.search(text))
        deva = sum(1 for r in _DEVA_HARM_RE if r.search(text))

        help_hits += sum(1 for r in _TRANS_HELP_SEEKING_RE if r.search(text))

        if deva or trans_self_harm:
            self_harm_hits = max(self_harm_hits, trans_self_harm + deva)
        if trans_others:
            harm_others_hits = max(harm_others_hits, trans_others)
        if trans_imminent:
            imminent_hits = max(imminent_hits, trans_imminent)

    total = self_harm_hits + harm_others_hits + imminent_hits

    if self_harm_hits or harm_others_hits:
        if harm_others_hits and self_harm_hits:
            category = "self_harm"
            reason = "self_harm_and_harm_others_language"
        elif harm_others_hits:
            category = "harm_others"
            reason = "harm_to_others_language"
        else:
            category = "self_harm"
            reason = "self_harm_language"
        return CrisisSignal(
            is_crisis=True,
            category=category,
            reason_code=reason,
            help_seeking=bool(help_hits),
            matched_signals=total,
        )

    if imminent_hits:
        return CrisisSignal(
            is_crisis=True,
            category="imminent_distress",
            reason_code="imminent_distress_language",
            help_seeking=bool(help_hits),
            matched_signals=total,
        )

    return CrisisSignal(
        is_crisis=False,
        category="none",
        reason_code="no_crisis_signal",
        help_seeking=bool(help_hits),
        matched_signals=0,
    )


_HINGLISH_BLOCKS = {
    "harm_others": (
        "Shukriya jo aapne yeh bataya. Main aapko judge nahi kar raha, aur main "
        "chahta hoon ki aap abhi safe rahein.",
        "Agar lagta hai ki aap kisi ko nuksaan pahunchane wale soch mein ho, toh "
        "please abhi kisi aisi cheez ke paas mat jaayein jo istemal ho sakti ho, "
        "aur agar ho sake toh kisi aur jagah chale jaayein jahan aur log hon.",
        "Main aapse yeh detail mein nahi poochhunga. Bas itna batayiye — kya aap abhi "
        "safe hain?",
    ),
    "self_harm": (
        "Shukriya ki aapne yeh mujhe bataya. Aapne bol ke sahi kiya, aur aisa feel "
        "karna galti nahi hai.",
        "Main aapse isse zyada detail nahi poochhunga. Aapne jitna bataya, utna hi kafi hai.",
    ),
    "imminent_distress": (
        "Main bahut khush hoon ki aapne yeh bataya. Lagta hai abhi bahut bhaari "
        "lag raha hai, aur aapko ise akele nahi uthana padta.",
        "Ako kuch samjhane ki zaroorat nahi hai, aur aapko aur kuch batane ki bhi nahi hai.",
    ),
}

_HINGLISH_GROUNDING = (
    "Abhi bas wahin rahiye jahan aap hain. Dono pair zameen par rakhiye, aur chaar "
    "tak naak se saans lein, chaar tak rookiye, aur chhhe tak mein dheere se bahar "
    "chhod dein. Ek saans kaafi hai. Jisse madad mile, wahi dohraayein."
)

_HINGLISH_CLOSING = (
    "Aap jab tak chahein yahan reh sakti hain. Main kahin nahi ja raha."
)

_HINGLISH_HELPLINE = (
    "Agar aap abhi khatre mein hain, toh please Helpline par baat karein "
    "(Tele MANAS: 14416) — muft, confidential, aur 24x7 available, kai "
    "languages mein."
)



_HINDI_BLOCKS = {
    "harm_others": (
        "आपने यह बताया, इसके लिए धन्यवाद। मैं आपका फ़ैसला नहीं कर रहा हूँ, और मैं "
        "चाहता हूँ कि आप अभी सुरक्षित रहें।",
        "यदि लगता है कि आप किसी को नुकसान पहुँचाने के विचार में हैं, तो कृपया अभी "
        "ऐसी किसी चीज़ के पास न जाएँ जिसका इस्तेमाल हो सके, और हो सके तो किसी ऐसी "
        "जगह चले जाएँ जहाँ और लोग हों।",
        "मैं आपसे इससे ज़्यादा ब्यौरा नहीं पूछूँगा। बस इतना बताइए — क्या आप अभी सुरक्षित हैं?",
    ),
    "self_harm": (
        "आपने यह मुझे बताया, इसके लिए धन्यवाद। आपने सही किया, और ऐसा महसूस करना "
        "आपकी ग़लती नहीं है।",
        "मैं आपसे इससे ज़्यादा ब्यौरा नहीं पूछूँगा। आपने जितना बताया, उतना ही काफ़ी है।",
    ),
    "imminent_distress": (
        "आपने यह बताया, इसके लिए धन्यवाद। लगता है अभी बहुत भारी लग रहा है, और आपको "
        "इसे अकेले नहीं सहना पड़ेगा।",
        "आपको कुछ समझाने की ज़रूरत नहीं, और न ही आपको और कुछ बताना है।",
    ),
}

_HINDI_GROUNDING = (
    "अभी बस जहाँ आप हैं वहीं रहिए। दोनों पैर ज़मीन पर रखिए, और चार तक नाक से "
    "साँस लीजिए, चार तक रोकिए, और छह तक में धीरे से बाहर छोड़ दीजिए। एक साँस काफ़ी है।"
)

_HINDI_CLOSING = "आप जब तक चाहें यहाँ रह सकते हैं। मैं कहीं नहीं जा रहा हूँ।"

_HINDI_HELPLINE = (
    "यदि आप अभी ख़तरे में हैं, तो कृपया Tele MANAS Helpline पर बात करें "
    "(14416 / 1800-891-4416) — मुफ़्त, गोपनीय, और 24x7 उपलब्ध, कई भाषाओं में।"
)


def build_crisis_response(
    signal: CrisisSignal, persona_name: str = "Saathi", text: str = ""
) -> str:
    """
    Build the crisis-first reply.

    Ordering is deliberate and must not change:
      1. Acknowledge, non-judgmental, no pressure.
      2. Crisis number + immediacy.
      3. Grounding (stay, breathe).
      4. One small, optional next step.

    Language mirrors the user. A user writing in Hinglish or Devanagari
    receives the crisis number in their own script — being unable to read
    the one message that matters most would defeat the purpose.
    """
    script = detect_language(text)

    if script == "hinglish":
        blocks = _HINGLISH_BLOCKS
        safety, grounding, closing, helpline = (
            blocks.get(signal.category, blocks["imminent_distress"])[1],
            _HINGLISH_GROUNDING,
            _HINGLISH_CLOSING,
            _HINGLISH_HELPLINE,
        )
        return (
            f"{blocks[signal.category][0]}\n\n"
            f"{safety} {helpline}\n\n"
            f"{grounding}\n\n"
            f"{closing}"
        )

    # Devanagari script (Hindi) — also covers Marathi/Sanskrit content.
    if script in ("hindi", "devanagari"):
        blocks = _HINDI_BLOCKS
        return (
            f"{blocks[signal.category][0]}\n\n"
            f"{blocks[signal.category][1]} {_HINDI_HELPLINE}\n\n"
            f"{_HINDI_GROUNDING}\n\n"
            f"{_HINDI_CLOSING}"
        )

    if signal.category == "harm_others":
        opening = (
            "Thank you for telling me. I'm not going to judge what you're feeling, "
            "and I want to make sure you're safe right now."
        )
        safety = (
            "If you feel you might act on thoughts of hurting someone, please put "
            "distance between yourself and anything you could use as a weapon right now, "
            "and move to a shared space if you can."
        )
    elif signal.category == "self_harm":
        opening = (
            "Thank you for trusting me with that. I'm really glad you said it out "
            "loud, and nothing about you is wrong for feeling it."
        )
        safety = (
            "I'm not going to ask you for any more detail than you've already shared."
        )
    else:
        opening = (
            "I'm really glad you told me. It sounds like things feel very heavy "
            "right now, and you don't have to carry that alone."
        )
        safety = "You don't need to explain anything or tell me any more details."

    return (
        f"{opening}\n\n"
        f"{safety} {CRISIS_HELPLINE_BLOCK}\n\n"
        "For right now, please just stay where you are. Put both feet on the floor "
        "and breathe in slowly for four counts, hold for four, and let it out for six. "
        "One breath is enough. Repeat only if it helps.\n\n"
        "You can stay here as long as you want. I'm not going anywhere."
    )


def crisis_supporting_note(signal: CrisisSignal) -> Optional[str]:
    """Short internal note for the Sahayak metadata (no user text)."""
    if not signal.is_crisis:
        return None
    return f"crisis:{signal.category}"
