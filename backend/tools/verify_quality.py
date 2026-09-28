import asyncio
import sys
import os

# Add backend to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.ollama_client import OllamaClient
from prompts import HUMAN_REALITY_FILTER

async def test_generation():
    client = OllamaClient()
    
    print("🏥 Checking Ollama Connection...")
    if not await client.health_check():
        print("❌ Ollama is NOT running or model is missing.")
        return

    print("✅ Ollama is connected.")

    prompt = "I'm failing my chemistry class and I feel like such a disappointment to my parents. I don't know what to do."
    
    # We expect: 
    # 1. Validation ("that feels heavy")
    # 2. Strength ("you care about this")
    # 3. Perspective/Question ("what part feels heaviest?")
    # 4. SUBSTANCE (not just "that's tough")

    system = f"You are a supportive friend.\n\n{HUMAN_REALITY_FILTER}"
    
    print(f"\n📝 Prompt: {prompt}")
    print("\n⏳ Generating response with ACTIVE ENGAGEMENT parameters...")
    
    try:
        response = await client.generate(
            prompt=prompt,
            system_prompt=system,
            temperature=0.8,
            max_tokens=300 # Allow more room for depth
        )
        print("\n💬 AI Response:\n")
        print(response)
        print("\n✅ Generation successful.")
        
        # specific checks
        if len(response.split()) < 10:
             print("\n⚠️ WARNING: Response is too brief (Possible Over-Correction).")
        if "I understand" in response:
            print("\n⚠️ WARNING: Response contains banned robotic phrase.")
        if "I can't give advice" in response:
            print("\n⚠️ WARNING: Response is evasive/refusing to engage.")
            
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_generation())
