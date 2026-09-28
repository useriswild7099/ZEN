"""
Sahayak Sync — automatic score-only export to Sahayak reviewer dashboard and local store.

PRIVACY & STATUTORY MANDATE:
Only calibrated numeric scores (wellness 0-100, distress 0-100, risk tier) leave the device.
Conversational transcripts, journal prose, and identity stay strictly local.
"""

import logging
import os
import time
from dataclasses import dataclass
from typing import Dict, Optional
from uuid import uuid4

import httpx

from services.wellness_score import WellnessScore

logger = logging.getLogger(__name__)

DEFAULT_SAHAYAK_URL = os.getenv("SAHAYAK_INGEST_URL", "http://127.0.0.1:3000/api/companion/ingest")
DEFAULT_LOCAL_INGEST_URL = os.getenv("LOCAL_SAHAYAK_URL", "http://127.0.0.1:8000/api/sahayak/ingest")
DEFAULT_SAHAYAK_KEY = os.getenv("SAHAYAK_INGEST_KEY", "mosje_sec_bridge_live_8f3a99c1")
DEFAULT_CASE_ID = os.getenv("SAHAYAK_DEFAULT_CASE_ID", "CASE-2026-ALW-019")
SYNC_TIMEOUT_SECONDS = 3.0


@dataclass(frozen=True)
class ConsentGrant:
    session_ref: str
    granted_at: float
    scope: str = "score_only"


class ConsentStore:
    """Consent registry supporting automatic default sync with explicit user revocation."""

    def __init__(self) -> None:
        self._grants: Dict[str, ConsentGrant] = {}
        self._revoked: set = set()
        self._grants[DEFAULT_CASE_ID] = ConsentGrant(session_ref=DEFAULT_CASE_ID, granted_at=time.time())

    def grant(self, session_ref: Optional[str]) -> ConsentGrant:
        ref = session_ref or DEFAULT_CASE_ID
        self._revoked.discard(ref)
        grant = ConsentGrant(session_ref=ref, granted_at=time.time())
        self._grants[ref] = grant
        logger.info(f"[Sahayak] Consent granted for {ref}")
        return grant

    def revoke(self, session_ref: Optional[str]) -> bool:
        if not session_ref:
            self._grants.clear()
            return True
        self._revoked.add(session_ref)
        return self._grants.pop(session_ref, None) is not None

    def has(self, session_ref: Optional[str]) -> bool:
        if not session_ref:
            return True
        if session_ref in self._revoked:
            return False
        return True

    def status(self, session_ref: Optional[str]) -> Dict:
        ref = session_ref or DEFAULT_CASE_ID
        is_opted = (ref not in self._revoked)
        return {
            "opted_in": is_opted,
            "scope": "score_only" if is_opted else None,
            "session_ref": ref,
            "never_shared": ["chat messages", "journal text", "raw transcripts", "identifying PII"],
        }


consent_store = ConsentStore()


class SahayakSyncClient:
    """Transmits calibrated distress metric to Sahayak dashboard."""

    def __init__(
        self,
        base_url: str = DEFAULT_SAHAYAK_URL,
        api_key: str = DEFAULT_SAHAYAK_KEY,
    ) -> None:
        self.base_url = base_url
        self.api_key = api_key

    def send_score(
        self,
        score: WellnessScore,
        session_ref: Optional[str],
        source: str = "chat",
    ) -> bool:
        if not consent_store.has(session_ref):
            return False

        ref = session_ref or DEFAULT_CASE_ID
        distress_score = max(0, min(100, int(100 - score.score)))
        
        if score.band == "crisis" or distress_score >= 75:
            risk_tier = "CRITICAL"
        elif score.band == "at_risk" or distress_score >= 50:
            risk_tier = "ELEVATED"
        elif score.band == "strained" or distress_score >= 25:
            risk_tier = "MODERATE"
        else:
            risk_tier = "LOW"

        # Outbound payload covering both Sahayak Dashboard and wire contract
        sahayak_payload = {
            "session_ref": ref,
            "wellness_score": float(score.score),
            "source": source,
            "client": "zenguard-ai",
            "schema_version": 1,
            "caseId": ref,
            "distressScore": distress_score,
            "riskTier": risk_tier,
            "journalSnippet": "",  # Strictly empty under privacy mandate
            "sourceProject": f"ZenGuard AI ({source.title()})",
        }

        internal_payload = {
            "session_ref": ref,
            "source": source,
            "wellness_score": float(score.score),
            "risk_score": float(distress_score),
            "band": score.band,
            "flagged": bool(score.flagged),
            "crisis_detected": bool(score.crisis_detected),
            "confidence": float(score.confidence),
        }



        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "X-Api-Key": self.api_key,
            "Content-Type": "application/json",
        }

        success = False

        # Attempt push to Sahayak Dashboard
        try:
            r = httpx.post(self.base_url, json=sahayak_payload, headers=headers, timeout=SYNC_TIMEOUT_SECONDS)
            if r.status_code in (200, 201, 204):
                success = True
                logger.info(f"[Sahayak] Pushed to dashboard: case={ref} distress={distress_score} tier={risk_tier}")
        except Exception as exc:
            logger.debug(f"[Sahayak] Dashboard push skipped/deferred: {exc}")

        # Attempt push to local internal DB
        try:
            httpx.post(DEFAULT_LOCAL_INGEST_URL, json=internal_payload, headers=headers, timeout=SYNC_TIMEOUT_SECONDS)
            success = True
        except Exception:
            pass

        return success


sahayak_sync = SahayakSyncClient()

