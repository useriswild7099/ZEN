"""
Sahayak Router — reviewer-side ingestion, case storage and review workflow.

This is the second half of the opt-in path defined in services/sahayak_sync.py.

PRIVACY CONTRACT
----------------
The store holds SCORES ONLY. There is no column, field, or model in this
router that can hold a chat message, a journal entry, or any other user
content. The ingest model forbids extra fields, so a client cannot smuggle
transcript text into the reviewer store.

Ingestion requires the shared `X-Api-Key`. Case review endpoints are
separately guarded and are intended to sit behind the reviewer's own
authentication before any real deployment — see TODO below.
"""

import os
import sqlite3
import time
import threading
from typing import List, Optional

from fastapi import APIRouter, Header, HTTPException

from models.schemas import (
    SahayakIngestRequest,
    SahayakCase,
    SahayakCaseList,
    SahayakStatusUpdate,
)

router = APIRouter()

DB_PATH = os.getenv(
    "SAHAYAK_DB_PATH",
    os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "sahayak_cases.db"),
)
INGEST_API_KEY = os.getenv("SAHAYAK_INGEST_KEY", "zenguard-local-dev-key")
# TODO(security): require real reviewer auth before production. The reviewer
# endpoints below are unauthenticated so the dashboard works in a demo; do
# not expose this service publicly as-is.
REVIEWER_TOKEN = os.getenv("SAHAYAK_REVIEWER_TOKEN", "")

_lock = threading.Lock()

_SCHEMA = """
CREATE TABLE IF NOT EXISTS cases (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    session_ref       TEXT    NOT NULL,
    wellness_score    REAL    NOT NULL,
    risk_score        REAL    NOT NULL,
    band              TEXT    NOT NULL,
    flagged           INTEGER NOT NULL,
    crisis_detected   INTEGER NOT NULL,
    confidence        REAL    NOT NULL,
    source            TEXT    NOT NULL,
    created_at        REAL    NOT NULL,
    status            TEXT    NOT NULL DEFAULT 'open',
    reviewer_note     TEXT
);
CREATE INDEX IF NOT EXISTS idx_cases_created ON cases (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cases_flagged ON cases (flagged, status);
"""


def _connect() -> sqlite3.Connection:
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH, timeout=5.0)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    """Create the reviewer store if it does not exist."""
    with _lock, _connect() as conn:
        conn.executescript(_SCHEMA)


def _row_to_case(row: sqlite3.Row) -> SahayakCase:
    return SahayakCase(
        id=row["id"],
        session_ref=row["session_ref"],
        wellness_score=row["wellness_score"],
        risk_score=row["risk_score"],
        band=row["band"],
        flagged=bool(row["flagged"]),
        crisis_detected=bool(row["crisis_detected"]),
        source=row["source"],
        created_at=row["created_at"],
        status=row["status"],
        reviewer_note=row["reviewer_note"],
    )


@router.post("/sahayak/ingest", response_model=SahayakCase, status_code=201)
async def sahayak_ingest(
    payload: SahayakIngestRequest,
    x_api_key: Optional[str] = Header(default=None, alias="X-Api-Key"),
):
    """
    Accept a score-only sync from a client that holds an active opt-in.

    Authenticated with the shared ingest key. Rejects unknown fields, so a
    client cannot attach conversation content.
    """
    if x_api_key != INGEST_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid ingest key")

    with _lock, _connect() as conn:
        conn.executescript(_SCHEMA)
        cur = conn.execute(
            """
            INSERT INTO cases (
                session_ref, wellness_score, risk_score, band, flagged,
                crisis_detected, confidence, source, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payload.session_ref,
                payload.wellness_score,
                payload.risk_score,
                payload.band,
                int(payload.flagged),
                int(payload.crisis_detected),
                payload.confidence,
                payload.source,
                time.time(),
            ),
        )
        row = conn.execute("SELECT * FROM cases WHERE id = ?", (cur.lastrowid,)).fetchone()

    return _row_to_case(row)


@router.get("/sahayak/cases", response_model=SahayakCaseList)
async def sahayak_cases(
    flagged_only: bool = False,
    status: Optional[str] = None,
    limit: int = 100,
    x_reviewer_token: Optional[str] = Header(default=None, alias="X-Reviewer-Token"),
):
    """
    List cases for the reviewer dashboard, most recent first.

    When SAHAYAK_REVIEWER_TOKEN is configured, callers must present it.
    """
    _require_reviewer(x_reviewer_token)

    query = "SELECT * FROM cases WHERE 1=1"
    params: List = []
    if flagged_only:
        query += " AND flagged = 1"
    if status:
        query += " AND status = ?"
        params.append(status)
    query += " ORDER BY created_at DESC LIMIT ?"
    params.append(max(1, min(limit, 500)))

    with _connect() as conn:
        rows = conn.execute(query, params).fetchall()
        open_flagged = conn.execute(
            "SELECT COUNT(*) FROM cases WHERE flagged = 1 AND status = 'open'"
        ).fetchone()[0]

    return SahayakCaseList(
        total=len(rows),
        open_flagged=open_flagged,
        cases=[_row_to_case(r) for r in rows],
    )


@router.get("/sahayak/cases/{case_id}", response_model=SahayakCase)
async def sahayak_case_detail(
    case_id: int,
    x_reviewer_token: Optional[str] = Header(default=None, alias="X-Reviewer-Token"),
):
    """One case row. Note there is nothing to show but the score."""
    _require_reviewer(x_reviewer_token)
    with _connect() as conn:
        row = conn.execute("SELECT * FROM cases WHERE id = ?", (case_id,)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Case not found")
    return _row_to_case(row)


@router.patch("/sahayak/cases/{case_id}", response_model=SahayakCase)
async def sahayak_update_case(
    case_id: int,
    update: SahayakStatusUpdate,
    x_reviewer_token: Optional[str] = Header(default=None, alias="X-Reviewer-Token"),
):
    """
    Review workflow: acknowledge or close a case, and attach a reviewer note.

    The note is written by the reviewer, not by the user, and is the only
    free-text field in the store.
    """
    _require_reviewer(x_reviewer_token)
    with _lock, _connect() as conn:
        result = conn.execute(
            "UPDATE cases SET status = ?, reviewer_note = ? WHERE id = ?",
            (update.status, update.reviewer_note, case_id),
        )
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Case not found")
        row = conn.execute("SELECT * FROM cases WHERE id = ?", (case_id,)).fetchone()
    return _row_to_case(row)


@router.get("/sahayak/summary")
async def sahayak_summary(
    x_reviewer_token: Optional[str] = Header(default=None, alias="X-Reviewer-Token"),
):
    """Aggregate counts per band, for the dashboard header."""
    _require_reviewer(x_reviewer_token)
    with _connect() as conn:
        rows = conn.execute(
            "SELECT band, COUNT(*) AS n FROM cases GROUP BY band"
        ).fetchall()
        total = conn.execute("SELECT COUNT(*) FROM cases").fetchone()[0]
        crisis = conn.execute(
            "SELECT COUNT(*) FROM cases WHERE crisis_detected = 1"
        ).fetchone()[0]
    return {
        "total_cases": total,
        "crisis_cases": crisis,
        "by_band": {r["band"]: r["n"] for r in rows},
    }


def _require_reviewer(token: Optional[str]) -> None:
    if REVIEWER_TOKEN and token != REVIEWER_TOKEN:
        raise HTTPException(status_code=401, detail="Reviewer authorization required")
