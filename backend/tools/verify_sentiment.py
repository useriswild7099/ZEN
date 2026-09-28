import httpx
import asyncio
import json

async def test_sentiment_pipeline():
    base_url = "http://localhost:8000/api"
    
    print("🚀 Testing Sentiment Analysis Pipeline...")
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        # 1. Test Quick Check
        print("\n1️⃣ Testing /quick-check endpoint...")
        try:
            payload = {"text": "I am feeling a bit anxious but hopeful about the future."}
            response = await client.post(f"{base_url}/quick-check", json=payload)
            if response.status_code == 200:
                print("✅ Quick Check Passed:", response.json())
            else:
                print(f"❌ Quick Check Failed: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"❌ Quick Check Connection Error: {e}")

        # 2. Test Full Analysis
        print("\n2️⃣ Testing /analyze endpoint (Full Pipeline)...")
        try:
            payload = {
                "text": "I've been feeling deeply overwhelmed lately. Work is piling up and I don't see a way out. It feels like I'm drowning.",
                "session_id": "test-session-123"
            }
            response = await client.post(f"{base_url}/analyze", json=payload)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Analysis Passed. Wellness Score: {data.get('wellness_score')}")
                print(f"   Primary Emotion: {data.get('primary_emotion')}")
                print(f"   Interventions: {len(data.get('recommended_interventions', []))}")
            else:
                print(f"❌ Analysis Failed: {response.status_code} - {response.text}")
        except Exception as e:
            print(f"❌ Analysis Connection Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_sentiment_pipeline())
