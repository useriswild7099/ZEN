
import asyncio
import httpx

BASE_URL = "http://localhost:8000"

MODES_TO_TEST = [
    "mother",
    "school_teacher",
    "best_friend",
    "lover",
    "dalai_lama",
    "sigmund_freud",
    "elon_mentor",
    "ashish_chanchlani"
]

TEST_MESSAGE = "I'm feeling really stressed about my upcoming exams. I feel like I'm going to fail even though I'm studying."

async def test_mode(client, mode):
    print(f"\nScanning personality: {mode.upper()}...")
    url = f"{BASE_URL}/api/chat"
    payload = {
        "message": TEST_MESSAGE,
        "mode": mode,
        "history": []
    }
    
    try:
        response = await client.post(url, json=payload, timeout=60.0)
        if response.status_code == 200:
            data = response.json()
            print(f"[{mode.upper()} RESPONSE]:\n{data['response']}\n")
            print("-" * 50)
        else:
            print(f"Error for {mode}: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"Failed to test {mode}: {e}")

async def main():
    async with httpx.AsyncClient() as client:
        # First check health
        try:
            response = await client.get(f"{BASE_URL}/health")
            if response.status_code != 200:
                print("Server is not healthy. Please ensure backend is running.")
                return
            print("Server is healthy. Starting personality tests...\n")
        except Exception:
             print("Server is not reachable.")
             return
        
        # Test all modes
        for mode in MODES_TO_TEST:
            await test_mode(client, mode)

if __name__ == "__main__":
    asyncio.run(main())
