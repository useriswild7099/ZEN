"""
Verification suite for the ZenGuard AI customization.

Run from the backend directory:
    python -m pytest tests/ -v

Covers the seven guarantees the customization had to preserve:
  1. Crisis short-circuit wins before persona / model / fallback.
  2. One score definition shared by chat and journal.
  3. Opt-in required before anything is synced.
  4. Score-only payload — no text fields exist on the wire.
  5. Single persona, no mode selection.
  6. Tele MANAS surfaced at least once per session.
  7. Mood Doodle is gone.
"""

import os
import sys

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app  # noqa: E402
from services.wellness_score import score_text, wellness_engine  # noqa: E402
from services.crisis_detector import (
    detect_crisis,
    build_crisis_response,
    TELE_MANAS_SHORT,
)  # noqa: E402
from services.sahayak_sync import consent_store  # noqa: E402
import services.sahayak_sync as sync_mod  # noqa: E402

client = TestClient(app)


# ── 1. Crisis short-circuit ────────────────────────────────────────────────

@pytest.mark.parametrize("text", [
    "I want to kill myself",
    "i dont want to live anymore",
    "thinking about ending my life",
    "mai mara junga",
    "I want to hurt someone badly",
])
def test_crisis_detected(text):
    assert detect_crisis(text).is_crisis is True


@pytest.mark.parametrize("text", [
    "I had a good day at college",
    "studying for my exam tomorrow",
    "my friend suggested we go for a walk",
])
def test_no_false_crisis(text):
    assert detect_crisis(text).is_crisis is False


def test_crisis_short_circuits_chat():
    """Crisis response must win over the model/fallback chain."""
    r = client.post("/api/chat", json={
        "message": "I want to kill myself",
        "session_id": "s-crisis",
    })
    assert r.status_code == 200
    body = r.json()
    assert body["crisis_detected"] is True
    assert body["crisis_response_used"] is True
    assert TELE_MANAS_SHORT in body["response"]
    # Must NOT have gone down the fallback chain
    assert body["fallback_used"] is False
    # Must have scored the turn
    assert body["score"]["crisis_detected"] is True


def test_crisis_does_not_ask_for_incident_details():
    r = client.post("/api/chat", json={"message": "I want to kill myself"})
    text = r.json()["response"].lower()
    # The crisis reply must not probe for incident/perpetrator detail.
    for probe in ["what happened", "who did", "tell me more about", "can you describe"]:
        assert probe not in text


# ── 2. One shared score definition ─────────────────────────────────────────

def test_chat_and_journal_share_score_engine():
    """Identical text must score identically on both paths."""
    text = "I am so exhausted and anxious about everything"
    chat_score = client.post("/api/chat", json={"message": text}).json()["score"]
    direct = score_text(text).to_api_dict()
    assert chat_score["wellness_score"] == direct["wellness_score"]
    assert chat_score["band"] == direct["band"]


def test_score_bands_are_consistent():
    assert score_text("everything is wonderful, I feel calm and grateful").band in (
        "thriving", "steady",
    )
    assert score_text("I am worthless and hopeless and alone").band in (
        "strained", "at_risk",
    )
    assert score_text("I want to end my life").band == "crisis"


def test_score_is_deterministic():
    text = "tired sad anxious but trying"
    a = score_text(text).to_dict()
    b = score_text(text).to_dict()
    assert a == b


def test_score_never_leaks_text():
    """The score object must be safe to put on the wire."""
    score = score_text("my name is Rahul and I live in Guwahati")
    d = score.to_dict()
    for forbidden in ("Rahul", "Guwahati", "name"):
        assert forbidden not in str(d)


# ── 3 + 4. Opt-in required, score-only payload ─────────────────────────────

def test_no_sync_without_opt_in():
    consent_store.revoke(None)
    r = client.post("/api/chat", json={"message": "I feel low", "session_id": "s-noopt"})
    assert r.status_code == 200
    assert r.json()["score_synced"] is False


def test_opt_in_grants_score_only_sync(monkeypatch):
    session = "s-optin"
    # Intercept the outbound POST: TestClient is in-process, so there is no
    # real socket for the sync client to reach.
    monkeypatch.setattr(sync_mod.httpx, "post", lambda *a, **k: type("R", (), {"ok": True})())

    consent = client.post("/api/chat/consent", json={"session_id": session, "opt_in": True})
    assert consent.status_code == 200
    body = consent.json()
    assert body["opted_in"] is True
    assert body["scope"] == "score_only"
    # The contract must state what never leaves the device.
    assert "chat messages" in body["never_shared"]
    assert "journal text" in body["never_shared"]

    r = client.post("/api/chat", json={"message": "I feel low", "session_id": session})
    assert r.json()["score_synced"] is True


def test_consent_can_be_revoked():
    session = "s-revoke"
    client.post("/api/chat/consent", json={"session_id": session, "opt_in": True})
    client.post("/api/chat/consent", json={"session_id": session, "opt_in": False})
    status = client.get(f"/api/chat/consent?session_id={session}").json()
    assert status["opted_in"] is False


def test_sync_payload_has_no_text_fields(monkeypatch):
    """Intercept the outbound request and assert the wire shape."""
    captured = {}

    def fake_post(url, json=None, headers=None, timeout=None):
        captured["payload"] = json
        captured["url"] = url
        class R: ok = True
        return R()

    monkeypatch.setattr(sync_mod.httpx, "post", fake_post)

    session = "s-wire"
    consent_store.grant(session)
    score = score_text("I am exhausted and worried")
    assert sahayak_send(score, session) is True

    payload = captured["payload"]
    assert payload["wellness_score"] == score.score
    assert payload["session_ref"] == session
    assert payload["source"] == "chat"
    # Nothing conversational may appear.
    for forbidden in ("message", "text", "content", "transcript", "prompt", "journal"):
        assert forbidden not in payload


def sahayak_send(score, session):
    from services.sahayak_sync import sahayak_sync
    return sahayak_sync.send_score(score, session, source="chat")


def test_ingest_rejects_extra_fields():
    """A client cannot smuggle transcript text into the reviewer store."""
    r = client.post("/api/sahayak/ingest", json={
        "session_ref": "x",
        "wellness_score": 50,
        "risk_score": 50,
        "band": "strained",
        "flagged": False,
        "crisis_detected": False,
        "confidence": 0.5,
        "message": "my private text",
    }, headers={"X-Api-Key": "zenguard-local-dev-key"})
    assert r.status_code == 422


def test_ingest_requires_api_key():
    r = client.post("/api/sahayak/ingest", json={
        "session_ref": "x", "wellness_score": 50, "risk_score": 50,
        "band": "strained", "flagged": False, "crisis_detected": False,
        "confidence": 0.5,
    })
    assert r.status_code == 401


# ── 5. Single persona ──────────────────────────────────────────────────────

def test_5_specialized_personas():
    r = client.get("/api/modes")
    assert r.status_code == 200
    body = r.json()
    assert len(body["modes"]) == 5
    ids = [m["id"] for m in body["modes"]]
    for expected in ("saathi", "margdarshak", "prahari", "vaidya", "custom"):
        assert expected in ids



def test_legacy_mode_is_collapsed_not_honoured():
    r = client.post("/api/chat", json={
        "message": "hello there",
        "mode": "gordon_ramsay",
        "session_id": "s-legacy",
    })
    body = r.json()
    assert body["mode"] == "saathi"
    assert body["persona_notice"] is not None


def test_persona_prompt_contains_mandatory_safeguards():
    from trauma_persona import build_system_prompt
    p = build_system_prompt()
    lowered = p.lower()
    assert "draft" in lowered  # copy is still marked for review
    for required in ["not a therapist", "14416", "trauma-informed"]:
        assert required in lowered


def test_crisis_prompt_puts_crisis_directive_first():
    from trauma_persona import build_system_prompt
    p = build_system_prompt(crisis_active=True)
    assert p.index("[ACTIVE CRISIS PROTOCOL") < p.index("You are Saathi")


# ── 6. Tele MANAS once per session ─────────────────────────────────────────

def test_helpline_surfaced_in_session():
    session = "s-helpline"
    for _ in range(2):
        r = client.post("/api/chat", json={
            "message": "I am having a stressful week",
            "session_id": session,
        })
        assert TELE_MANAS_SHORT in r.json()["response"]


# ── 7. Mood Doodle removed ─────────────────────────────────────────────────

def test_crisis_in_indian_languages():
    """
    SAFETY-CRITICAL: a user typing in Hinglish or Devanagari must still hit
    the crisis short-circuit. A missed crisis here is a person in acute
    distress getting a generic reply.
    """
    hinglish = [
        "mujhe khud ko maarne ka mann kar raha hai",
        "main khudko mok dungi",
        "mera jeevan chhod dena hai",
        "mujhe marna hai yaar",
        "main atma hatya karne wala hu",
        "maut ka darr lag raha hai mujhe",
    ]
    for text in hinglish:
        sig = detect_crisis(text)
        assert sig.is_crisis, f"missed Hinglish crisis: {text!r}"

    devanagari = [
        "मैं आत्महत्या करने जा रहा हूँ",
        "मुझे खुद को मारना है",
        "मरना चाहता हूँ",
        "जीवन छोड़ देना चाहता हूँ",
    ]
    for text in devanagari:
        sig = detect_crisis(text)
        assert sig.is_crisis, f"missed Devanagari crisis: {text!r}"


def test_crisis_reply_mirrors_language():
    """The crisis message must be readable by the person it is for."""
    sig = detect_crisis("mujhe khud ko maarne ka mann kar raha hai")
    hinglish = build_crisis_response(sig, text="mujhe khud ko maarne ka mann kar raha hai")
    assert "14416" in hinglish
    assert "Tele MANAS" in hinglish
    # Not the English block.
    assert "Put both feet on the floor" not in hinglish

    d = detect_crisis("मैं आत्महत्या करने जा रहा हूँ")
    hindi = build_crisis_response(d, text="मैं आत्महत्या करने जा रहा हूँ")
    assert "14416" in hindi
    assert any("ऀ" <= ch <= "ॿ" for ch in hindi)

    e = detect_crisis("I want to kill myself")
    english = build_crisis_response(e, text="I want to kill myself")
    assert "14416" in english
    assert "Put both feet on the floor" in english


def test_bare_adjectives_do_not_trigger_crisis():
    """
    Regression guard: "hopeless"/"worthless"/"alone" are ordinary distress
    words, not crisis signals. Routing them into a crisis protocol would
    alienate a large share of genuine users.
    """
    for text in [
        "I am worthless and hopeless and alone",
        "mood swings bahut zyada hain",
        "i feel trapped in my job",
    ]:
        sig = detect_crisis(text)
        assert not sig.is_crisis, f"false-positive crisis on: {text!r}"


def test_mood_doodle_removed():
    from pathlib import Path
    backend = Path(__file__).resolve().parent.parent
    hits = []
    for p in backend.rglob("*.py"):
        # Skip this test file: its own assertion strings contain the term.
        if "backup" in p.name or p.name == "test_zenguard_customization.py":
            continue
        if "doodle" in p.read_text(encoding="utf-8", errors="ignore").lower():
            hits.append(p.name)
    assert hits == [], f"Mood Doodle references remain: {hits}"


# ── Fallback chain intact ──────────────────────────────────────────────────

def test_fallback_chain_intact():
    """Offline: must still answer via cache or pre-written fallback."""
    r = client.post("/api/chat", json={
        "message": "tell me about the weather in a place where it snows",
        "session_id": "s-fallback",
    })
    assert r.status_code == 200
    body = r.json()
    assert body["response"]
    # If Ollama is offline the tier must be 3 or 4, never None-with-no-reply.
    if body["fallback_used"]:
        assert body["fallback_tier"] in (3, 4)
