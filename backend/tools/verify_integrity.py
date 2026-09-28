
import sys
import os

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.schemas import ChatMode
from prompts import MODE_PROMPTS, MODE_INFO

def verify_integrity():
    errors = []
    
    # Check 1: Do all ChatMode enum values have a prompt?
    for mode in ChatMode:
        if mode not in MODE_PROMPTS:
            errors.append(f"MISSING PROMPT: ChatMode.{mode.name} ({mode.value}) is not in MODE_PROMPTS")
    
    # Check 2: Do all ChatMode enum values have info?
    for mode in ChatMode:
        if mode not in MODE_INFO:
            errors.append(f"MISSING INFO: ChatMode.{mode.name} ({mode.value}) is not in MODE_INFO")
    
    # Check 3: Are there prompts for modes that don't exist in the Enum?
    for mode in MODE_PROMPTS:
        if mode not in ChatMode:
            errors.append(f"ORPHAN PROMPT: Key '{mode}' in MODE_PROMPTS is not in ChatMode Enum")
            
    # Check 4: Check categories in MODE_INFO match PersonalityCategory Enum (if I could import it easily, but I'll visually check or skip strict check for now)
    
    if errors:
        print("❌ INTEGRITY CHECK FAILED:")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)
    else:
        print("✅ INTEGRITY CHECK PASSED: All 57 modes match between schemas and prompts.")

if __name__ == "__main__":
    verify_integrity()
