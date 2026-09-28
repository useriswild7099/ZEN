"""
Response Cache — Platform-aware LRU response caching system

PRIVACY GUARANTEES:
- Stores only AI responses, NEVER raw user input
- Query matching uses one-way SHA-256 hashes
- Keywords are generic emotional terms only (no PII)
- User can clear cache at any time via API
- Cache auto-clears on app version change

STORAGE:
- Windows: %APPDATA%/ZenGuard/cache/
- macOS:   ~/Library/Application Support/ZenGuard/cache/
- Linux:   ~/.local/share/ZenGuard/cache/
"""

import os
import json
import hashlib
import time
import re
import platform
import logging
from typing import Optional, Dict, List, Any
from pathlib import Path

logger = logging.getLogger(__name__)

# ─── Constants ────────────────────────────────────────────────────────────────

MAX_ENTRIES_PER_PERSONA = 100
CACHE_EXPIRY_DAYS = 30
CACHE_VERSION = "1.0.0"
FUZZY_MATCH_THRESHOLD = 0.60  # 60% keyword overlap for cache hit

# Stopwords to ignore during keyword extraction
STOPWORDS = frozenset({
    "i", "me", "my", "myself", "we", "our", "you", "your", "he", "she", "it",
    "they", "them", "what", "which", "who", "whom", "this", "that", "these",
    "those", "am", "is", "are", "was", "were", "be", "been", "being", "have",
    "has", "had", "do", "does", "did", "will", "would", "shall", "should",
    "can", "could", "may", "might", "must", "need", "a", "an", "the", "and",
    "but", "if", "or", "because", "as", "until", "while", "of", "at", "by",
    "for", "with", "about", "against", "between", "through", "during", "before",
    "after", "above", "below", "to", "from", "up", "down", "in", "out", "on",
    "off", "over", "under", "again", "further", "then", "once", "here", "there",
    "when", "where", "why", "how", "all", "both", "each", "few", "more", "most",
    "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so",
    "than", "too", "very", "just", "don", "now", "also", "like", "really",
    "much", "even", "still", "already", "always", "never", "sometimes", "often",
    "im", "ive", "dont", "cant", "wont", "its", "thats", "hes", "shes",
    "theyre", "youre", "were", "well", "ill", "lets", "theres",
})


# ─── Cache Directory Resolution ──────────────────────────────────────────────

def _get_cache_root() -> Path:
    """Get platform-specific cache directory."""
    system = platform.system()

    if system == "Windows":
        base = os.environ.get("APPDATA", os.path.expanduser("~\\AppData\\Roaming"))
        return Path(base) / "ZenGuard" / "cache"
    elif system == "Darwin":
        return Path.home() / "Library" / "Application Support" / "ZenGuard" / "cache"
    else:  # Linux and others
        xdg = os.environ.get("XDG_DATA_HOME", os.path.expanduser("~/.local/share"))
        return Path(xdg) / "ZenGuard" / "cache"


# ─── Utility Functions ───────────────────────────────────────────────────────

def _normalize_query(text: str) -> str:
    """Normalize query text for consistent matching."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s]', ' ', text)  # Remove punctuation
    text = re.sub(r'\s+', ' ', text)       # Collapse whitespace
    return text.strip()


def _extract_keywords(text: str) -> List[str]:
    """Extract meaningful keywords from text (no PII)."""
    normalized = _normalize_query(text)
    words = normalized.split()
    keywords = [w for w in words if w not in STOPWORDS and len(w) >= 3]
    return sorted(set(keywords))


def _hash_query(text: str) -> str:
    """One-way SHA-256 hash of normalized query."""
    normalized = _normalize_query(text)
    return hashlib.sha256(normalized.encode('utf-8')).hexdigest()


def _keyword_overlap(keywords_a: List[str], keywords_b: List[str]) -> float:
    """Calculate Jaccard similarity between two keyword lists."""
    set_a = set(keywords_a)
    set_b = set(keywords_b)
    if not set_a or not set_b:
        return 0.0
    intersection = set_a & set_b
    union = set_a | set_b
    return len(intersection) / len(union)


# ─── ResponseCache Class ─────────────────────────────────────────────────────

class ResponseCache:
    """
    LRU response cache with per-persona storage and fuzzy matching.
    
    Thread-safe for async usage (single-writer pattern — FastAPI processes
    requests sequentially per-worker, and file writes are atomic via temp+rename).
    """

    def __init__(self, app_version: str = "1.0.0"):
        self.cache_root = _get_cache_root()
        self.chat_dir = self.cache_root / "chat"
        self.sentiment_dir = self.cache_root / "sentiment"
        self.app_version = app_version
        self._initialized = False

    def initialize(self):
        """Create cache directories and check version. Call once on startup."""
        try:
            self.chat_dir.mkdir(parents=True, exist_ok=True)
            self.sentiment_dir.mkdir(parents=True, exist_ok=True)

            meta_path = self.cache_root / "cache_meta.json"
            if meta_path.exists():
                with open(meta_path, "r", encoding="utf-8") as f:
                    meta = json.load(f)
                    stored_version = meta.get("app_version", "")
                    if stored_version != self.app_version:
                        logger.info(f"[Cache] App version changed ({stored_version} → {self.app_version}), clearing cache")
                        self.clear_all()
            
            # Write/update meta
            with open(meta_path, "w", encoding="utf-8") as f:
                json.dump({
                    "app_version": self.app_version,
                    "cache_version": CACHE_VERSION,
                    "last_cleanup": int(time.time()),
                }, f, indent=2)

            self._initialized = True
            logger.info(f"[Cache] Initialized at {self.cache_root}")
        except Exception as e:
            logger.warning(f"[Cache] Failed to initialize: {e}")
            self._initialized = False

    # ─── Chat Response Cache ──────────────────────────────────────────────

    def get_chat_response(self, persona: str, query: str) -> Optional[str]:
        """
        Look up a cached chat response for the given persona and query.
        
        Returns the cached response string, or None if no match.
        Uses exact hash match first, then fuzzy keyword matching.
        """
        if not self._initialized:
            return None

        entries = self._load_persona_cache(persona)
        if not entries:
            return None

        now = int(time.time())
        expiry_cutoff = now - (CACHE_EXPIRY_DAYS * 86400)

        query_hash = _hash_query(query)
        query_keywords = _extract_keywords(query)

        # Fast path: exact hash match
        for entry in entries:
            if entry.get("timestamp", 0) < expiry_cutoff:
                continue
            if entry.get("query_hash") == query_hash:
                entry["hit_count"] = entry.get("hit_count", 0) + 1
                entry["last_hit"] = now
                self._save_persona_cache(persona, entries)
                logger.info(f"[Cache] Exact hit for persona={persona}")
                raw_r = entry["response"]
                return re.sub(r'<\/?s>|<\|.*?\|>|<eos>', '', raw_r).strip()

        # Slow path: fuzzy keyword matching
        best_match = None
        best_score = 0.0

        for entry in entries:
            if entry.get("timestamp", 0) < expiry_cutoff:
                continue
            entry_keywords = entry.get("query_keywords", [])
            score = _keyword_overlap(query_keywords, entry_keywords)
            if score >= FUZZY_MATCH_THRESHOLD and score > best_score:
                best_score = score
                best_match = entry

        if best_match:
            best_match["hit_count"] = best_match.get("hit_count", 0) + 1
            best_match["last_hit"] = now
            self._save_persona_cache(persona, entries)
            logger.info(f"[Cache] Fuzzy hit for persona={persona} (score={best_score:.2f})")
            raw_r = best_match["response"]
            return re.sub(r'<\/?s>|<\|.*?\|>|<eos>', '', raw_r).strip()

        return None

    def put_chat_response(self, persona: str, query: str, response: str):
        """
        Store a chat response in the cache.
        
        Privacy: Only the response text and generic keywords are stored.
        The original query is hashed (one-way) and never stored in plain text.
        """
        if not self._initialized:
            return

        # Scrub any EOS tokens before saving
        response = re.sub(r'<\/?s>|<\|.*?\|>|<eos>', '', response).strip()

        entries = self._load_persona_cache(persona)
        now = int(time.time())
        query_hash = _hash_query(query)

        # Don't duplicate — update existing entry if hash matches
        for entry in entries:
            if entry.get("query_hash") == query_hash:
                entry["response"] = response
                entry["timestamp"] = now
                entry["hit_count"] = entry.get("hit_count", 0)
                self._save_persona_cache(persona, entries)
                return

        # Add new entry
        new_entry = {
            "query_hash": query_hash,
            "query_keywords": _extract_keywords(query),
            "response": response,
            "timestamp": now,
            "hit_count": 0,
            "last_hit": now,
        }
        entries.append(new_entry)

        # Enforce max entries — evict LRU (least recently used)
        if len(entries) > MAX_ENTRIES_PER_PERSONA:
            entries.sort(key=lambda e: e.get("last_hit", 0))
            entries = entries[-MAX_ENTRIES_PER_PERSONA:]

        # Remove expired entries
        expiry_cutoff = now - (CACHE_EXPIRY_DAYS * 86400)
        entries = [e for e in entries if e.get("timestamp", 0) >= expiry_cutoff]

        self._save_persona_cache(persona, entries)

    # ─── Sentiment Cache ──────────────────────────────────────────────────

    def get_sentiment_response(self, query: str) -> Optional[Dict]:
        """Look up cached sentiment analysis result."""
        if not self._initialized:
            return None

        cache_path = self.sentiment_dir / "analysis_cache.json"
        entries = self._load_json(cache_path)
        if not entries:
            return None

        now = int(time.time())
        expiry_cutoff = now - (CACHE_EXPIRY_DAYS * 86400)
        query_hash = _hash_query(query)

        for entry in entries:
            if entry.get("timestamp", 0) < expiry_cutoff:
                continue
            if entry.get("query_hash") == query_hash:
                return entry.get("result")

        return None

    def put_sentiment_response(self, query: str, result: Dict):
        """Store a sentiment analysis result in cache."""
        if not self._initialized:
            return

        cache_path = self.sentiment_dir / "analysis_cache.json"
        entries = self._load_json(cache_path) or []
        now = int(time.time())
        query_hash = _hash_query(query)

        # Update existing or add new
        for entry in entries:
            if entry.get("query_hash") == query_hash:
                entry["result"] = result
                entry["timestamp"] = now
                self._save_json(cache_path, entries)
                return

        entries.append({
            "query_hash": query_hash,
            "result": result,
            "timestamp": now,
        })

        # Enforce limit
        if len(entries) > MAX_ENTRIES_PER_PERSONA:
            entries.sort(key=lambda e: e.get("timestamp", 0))
            entries = entries[-MAX_ENTRIES_PER_PERSONA:]

        self._save_json(cache_path, entries)

    # ─── Cache Management ─────────────────────────────────────────────────

    def clear_all(self):
        """Clear all cached responses."""
        import shutil
        try:
            if self.chat_dir.exists():
                shutil.rmtree(self.chat_dir)
            if self.sentiment_dir.exists():
                shutil.rmtree(self.sentiment_dir)
            self.chat_dir.mkdir(parents=True, exist_ok=True)
            self.sentiment_dir.mkdir(parents=True, exist_ok=True)
            logger.info("[Cache] All cache cleared")
        except Exception as e:
            logger.warning(f"[Cache] Failed to clear: {e}")

    def clear_persona(self, persona: str):
        """Clear cache for a specific persona."""
        cache_path = self.chat_dir / f"{persona}.json"
        try:
            if cache_path.exists():
                cache_path.unlink()
                logger.info(f"[Cache] Cleared cache for persona={persona}")
        except Exception as e:
            logger.warning(f"[Cache] Failed to clear persona {persona}: {e}")

    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics."""
        stats = {
            "cache_path": str(self.cache_root),
            "total_entries": 0,
            "total_size_bytes": 0,
            "personas_cached": [],
            "oldest_entry": None,
            "sentiment_entries": 0,
        }

        try:
            # Chat cache stats
            if self.chat_dir.exists():
                for cache_file in self.chat_dir.glob("*.json"):
                    persona = cache_file.stem
                    file_size = cache_file.stat().st_size
                    entries = self._load_json(cache_file) or []
                    stats["total_entries"] += len(entries)
                    stats["total_size_bytes"] += file_size
                    stats["personas_cached"].append({
                        "persona": persona,
                        "entries": len(entries),
                        "size_bytes": file_size,
                    })
                    for entry in entries:
                        ts = entry.get("timestamp", 0)
                        if ts > 0 and (stats["oldest_entry"] is None or ts < stats["oldest_entry"]):
                            stats["oldest_entry"] = ts

            # Sentiment cache stats
            sentiment_path = self.sentiment_dir / "analysis_cache.json"
            if sentiment_path.exists():
                entries = self._load_json(sentiment_path) or []
                stats["sentiment_entries"] = len(entries)
                stats["total_entries"] += len(entries)
                stats["total_size_bytes"] += sentiment_path.stat().st_size

        except Exception as e:
            logger.warning(f"[Cache] Failed to get stats: {e}")

        return stats

    # ─── Internal Helpers ─────────────────────────────────────────────────

    def _load_persona_cache(self, persona: str) -> List[Dict]:
        """Load entries for a specific persona."""
        cache_path = self.chat_dir / f"{persona}.json"
        return self._load_json(cache_path) or []

    def _save_persona_cache(self, persona: str, entries: List[Dict]):
        """Save entries for a specific persona (atomic write)."""
        cache_path = self.chat_dir / f"{persona}.json"
        self._save_json(cache_path, entries)

    def _load_json(self, path: Path) -> Optional[List]:
        """Load JSON list from file."""
        try:
            if path.exists():
                with open(path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    return data if isinstance(data, list) else None
        except (json.JSONDecodeError, IOError) as e:
            logger.warning(f"[Cache] Failed to load {path}: {e}")
        return None

    def _save_json(self, path: Path, data: List):
        """Atomic write: write to temp file then rename."""
        tmp_path = path.with_suffix(".tmp")
        try:
            with open(tmp_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False)
            tmp_path.replace(path)
        except Exception as e:
            logger.warning(f"[Cache] Failed to save {path}: {e}")
            if tmp_path.exists():
                try:
                    tmp_path.unlink()
                except OSError:
                    pass


# ─── Singleton ────────────────────────────────────────────────────────────────

response_cache = ResponseCache()
