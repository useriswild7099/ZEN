
import asyncio
import httpx

BASE_URL = "http://localhost:8000"
MODES = ["ashish_chanchlani", "mother"]
TEST_MESSAGE = "I'm feeling really stressed about my upcoming exams. I feel like I'm going to fail even though I'm studying."

async def main():
    async with httpx.AsyncClient() as client:
        for mode in MODES:
            print(f"\n--- Testing {mode} ---")
            try:
                response = await client.post(
                    f"{BASE_URL}/api/chat",
                    json={"message": TEST_MESSAGE, "mode": mode, "history": []},
                    timeout=60.0
                )
                print(response.json()["response"])
            except Exception as e:
                print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
