
import asyncio
import httpx
import sys
import os
from enum import Enum

# Add backend directory to sys.path to import schemas
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.schemas import ChatMode

BASE_URL = "http://localhost:8000"
TEST_MESSAGE = "I'm feeling really stressed about my upcoming exams. I feel like I'm going to fail even though I'm studying."

async def test_all_modes():
    async with httpx.AsyncClient(timeout=60.0) as client:
        print(f"🚀 Starting comprehensive test of {len(ChatMode)} personalities...")
        
        # Create/Clear log file
        with open("verification_log.txt", "w", encoding="utf-8") as f:
            f.write("COMPREHENSIVE PERSONALITY TEST LOG\n")
            f.write("================================\n")
            f.write(f"Message: {TEST_MESSAGE}\n\n")

        for mode in ChatMode:
            print(f"Testing {mode.name}...", end="", flush=True)
            try:
                response = await client.post(
                    f"{BASE_URL}/api/chat",
                    json={"message": TEST_MESSAGE, "mode": mode.value, "history": []}
                )
                if response.status_code == 200:
                    data = response.json()
                    result_entry = f"\n--- {mode.name} ({mode.value}) ---\n{data['response']}\n"
                    print(" ✅")
                else:
                    result_entry = f"\n--- {mode.name} ---\n[ERROR] {response.status_code}: {response.text}\n"
                    print(" ❌")
            except Exception as e:
                result_entry = f"\n--- {mode.name} ---\n[EXCEPTION] {str(e)}\n"
                print(" ⚠️")
            
            # Write immediately
            with open("verification_log.txt", "a", encoding="utf-8") as f:
                f.write(result_entry)
            
        print("\n✨ Test complete. Check 'verification_log.txt' for all responses.")

if __name__ == "__main__":
    asyncio.run(test_all_modes())
