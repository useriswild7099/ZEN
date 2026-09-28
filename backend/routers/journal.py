"""
Journal Vault Router
Handles zero-knowledge local encryption and .md file I/O for the journal.
"""

from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
import os
import json
import base64
from typing import List, Optional, Dict, Any
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

from services.wellness_score import score_text
from services.crisis_detector import detect_crisis, CRISIS_HELPLINE_BLOCK
from services.sahayak_sync import sahayak_sync

router = APIRouter()

# Local Vault Path
VAULT_DIR = os.path.join(os.path.expanduser("~"), "Documents", "ZenGuard Vault")

class SetupRequest(BaseModel):
    password: str

class UnlockRequest(BaseModel):
    password: str

class SaveRequest(BaseModel):
    password: str
    entry: Dict[str, Any]


def get_encryption_key(password: str, salt: bytes) -> bytes:
    """Derives a secure AES key from the user's password using PBKDF2"""
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=480000,
    )
    return base64.urlsafe_b64encode(kdf.derive(password.encode()))


def ensure_vault():
    if not os.path.exists(VAULT_DIR):
        os.makedirs(VAULT_DIR)


@router.get("/vault_status")
async def get_vault_status():
    """Checks if a vault has been initialized (i.e. contains a .salt file)"""
    ensure_vault()
    salt_file = os.path.join(VAULT_DIR, ".salt")
    return {"is_initialized": os.path.exists(salt_file)}


@router.post("/setup")
async def setup_vault(req: SetupRequest):
    """Initializes a new vault with a fresh salt and verification file"""
    ensure_vault()
    salt_file = os.path.join(VAULT_DIR, ".salt")
    verify_file = os.path.join(VAULT_DIR, ".verify")
    
    if os.path.exists(salt_file):
        raise HTTPException(status_code=400, detail="Vault is already initialized.")
        
    salt = os.urandom(16)
    with open(salt_file, "wb") as f:
        f.write(salt)
        
    key = get_encryption_key(req.password, salt)
    f = Fernet(key)
    
    with open(verify_file, "wb") as f_out:
        f_out.write(f.encrypt(b"ZENGUARD_VAULT_OK"))
        
    return {"status": "success"}


import time

# Rate limiting state
_FAILED_ATTEMPTS = 0
_LOCKOUT_UNTIL = 0
MAX_ATTEMPTS = 5
LOCKOUT_DURATION = 60

@router.post("/unlock")
async def unlock_vault(req: UnlockRequest):
    """Verifies the password by attempting to decrypt the .verify file"""
    global _FAILED_ATTEMPTS, _LOCKOUT_UNTIL
    
    if time.time() < _LOCKOUT_UNTIL:
        remaining = int(_LOCKOUT_UNTIL - time.time())
        raise HTTPException(status_code=429, detail=f"Too many failed attempts. Vault locked for {remaining} seconds.")
        
    salt_file = os.path.join(VAULT_DIR, ".salt")
    verify_file = os.path.join(VAULT_DIR, ".verify")
    
    if not os.path.exists(salt_file) or not os.path.exists(verify_file):
        raise HTTPException(status_code=400, detail="Vault not initialized.")
        
    with open(salt_file, "rb") as f:
        salt = f.read()
        
    key = get_encryption_key(req.password, salt)
    fernet = Fernet(key)
    
    try:
        with open(verify_file, "rb") as f:
            encrypted_data = f.read()
        decrypted = fernet.decrypt(encrypted_data)
        if decrypted != b"ZENGUARD_VAULT_OK":
            raise ValueError()
            
        # Reset attempts on success
        _FAILED_ATTEMPTS = 0
    except Exception:
        _FAILED_ATTEMPTS += 1
        if _FAILED_ATTEMPTS >= MAX_ATTEMPTS:
            _LOCKOUT_UNTIL = time.time() + LOCKOUT_DURATION
            _FAILED_ATTEMPTS = 0
        raise HTTPException(status_code=401, detail="Incorrect password.")
        
    return {"status": "success"}


@router.post("/entries/get")
async def get_entries(req: UnlockRequest):
    """Returns all decrypted entries"""
    salt_file = os.path.join(VAULT_DIR, ".salt")
    if not os.path.exists(salt_file):
        return {"entries": []}
        
    with open(salt_file, "rb") as f:
        salt = f.read()
        
    key = get_encryption_key(req.password, salt)
    fernet = Fernet(key)
    
    entries = []
    for filename in os.listdir(VAULT_DIR):
        if filename.endswith(".md"):
            try:
                with open(os.path.join(VAULT_DIR, filename), "rb") as f:
                    encrypted_data = f.read()
                
                decrypted = fernet.decrypt(encrypted_data)
                entry = json.loads(decrypted.decode('utf-8'))
                entries.append(entry)
            except Exception as e:
                print(f"Skipping corrupt or unreadable file: {filename}")
                continue
                
    return {"entries": entries}


@router.post("/entry")
async def save_entry(req: SaveRequest):
    """Encrypts and saves a journal entry to a .md file"""
    salt_file = os.path.join(VAULT_DIR, ".salt")
    if not os.path.exists(salt_file):
        raise HTTPException(status_code=400, detail="Vault not initialized.")
        
    with open(salt_file, "rb") as f:
        salt = f.read()
        
    key = get_encryption_key(req.password, salt)
    fernet = Fernet(key)
    
    # We use the entry ID as the filename
    entry_id = req.entry.get("id", "unknown_id")
    filename = f"{entry_id}.md"
    file_path = os.path.join(VAULT_DIR, filename)
    
    entry_json = json.dumps(req.entry).encode('utf-8')
    encrypted_data = fernet.encrypt(entry_json)
    
    with open(file_path, "wb") as f:
        f.write(encrypted_data)

    # Every journal entry gets the same unified wellness score as a chat turn.
    # The score is returned to the local client only — the encrypted journal
    # text never leaves the vault, and the score is synced to Sahayak solely
    # if the user has explicitly opted in.
    content = req.entry.get("content", "") or ""
    score = score_text(content)
    synced = sahayak_sync.send_score(
        score, req.entry.get("session_id"), source="journal"
    )

    # A journal entry is often where someone writes the thing they could not
    # say out loud. Run the same crisis detector as chat, and if it fires,
    # return the helpline so the frontend can show it. Still no text leaves
    # the vault — only the crisis flag and the helpline copy are returned.
    crisis = detect_crisis(content)

    return {
        "status": "success",
        "score": score.to_api_dict(),
        "score_synced": synced,
        "crisis_detected": crisis.is_crisis,
        "crisis_category": crisis.category,
        "helpline": CRISIS_HELPLINE_BLOCK if crisis.is_crisis else None,
    }

@router.delete("/entry/{entry_id}")
async def delete_entry(entry_id: str, req: UnlockRequest):
    """Deletes an encrypted journal entry"""
    await unlock_vault(req)
    
    filename = f"{entry_id}.md"
    file_path = os.path.join(VAULT_DIR, filename)
    
    if os.path.exists(file_path):
        os.remove(file_path)
        return {"status": "success"}
        
    raise HTTPException(status_code=404, detail="Entry not found")
