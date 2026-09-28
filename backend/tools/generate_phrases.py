import asyncio
import json
import os
from services.ollama_client import OllamaClient
from prompts import MODE_PROMPTS, MODE_INFO
from models.schemas import ChatMode

# Initialize Client
client = OllamaClient()

OUTPUT_FILE = "data/all_personality_phrases.json"

async def generate_phrases_for_mode(mode: ChatMode, count: int = 20):
    """Generates signature phrases for a single mode using its system prompt."""
    
    mode_name = MODE_INFO[mode]["name"]
    system_prompt = MODE_PROMPTS[mode]
    
    print(f"🎭 Generating {count} phrases for: {mode_name}...")
    
    # Prompt designed to extract pure character voice
    generation_prompt = f"""
    You are {mode_name}. 
    Based on your specific core philosophy, tone, and signature style defined below:
    
    "{system_prompt}"
    
    TASK:
    Generate a list of exactly {count} distinct, conversational phrases, sentences, or wise sayings that YOU would use in a counseling/support context.
    
    RULES:
    1. Stay strict to your character (vocab, rhythm, metaphor).
    2. Include a mix of: 
       - Greetings ("Hey...", "Greetings...", "My child...")
       - Empathetic reactions ("That sounds heavy...", "I feel your pain...")
       - Wisdom/Advice ("Simplicity is key...", "The obstacle is the way...")
       - Closing thoughts ("Rest now...", "Stay hard...")
    3. Return ONLY a raw JSON list of strings. No markdown. No intro text.
    
    Example Output Format:
    ["Phrase 1", "Phrase 2", ...]
    """

    try:
        # We use a higher temp for creativity
        response = await client.generate(
            prompt=generation_prompt,
            system_prompt=f"You are a data generator. Output compliant JSON only.",
            temperature=0.9,
            max_tokens=4000 
        )
        
        # Clean up response to ensure valid JSON
        clean_response = response.strip()
        if clean_response.startswith("```json"):
            clean_response = clean_response.replace("```json", "").replace("```", "")
        
        phrases = json.loads(clean_response)
        print(f"✅ Success! Generated {len(phrases)} phrases for {mode_name}.")
        return phrases
        
    except Exception as e:
        print(f"❌ Error generating for {mode_name}: {e}")
        return []

async def main():
    os.makedirs("data", exist_ok=True)
    
    all_data = {}
    
    # Iterate through all available modes
    # NOTE: To test quicker, you can slice this list e.g. list(ChatMode)[:3]
    for mode in list(ChatMode):
        phrases = await generate_phrases_for_mode(mode, count=20)
        all_data[mode.value] = {
            "name": MODE_INFO[mode]["name"],
            "description": MODE_INFO[mode]["description"],
            "phrases": phrases
        }
        
    # Save to file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(all_data, f, indent=2, ensure_ascii=False)
        
    print(f"\n🎉 DONE! All phrases saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    asyncio.run(main())
