import asyncio
from services.knowledge_base import kb

async def test_rag():
    print("⏳ Loading Knowledge Base...")
    kb.load_data()
    
    query = "How do I handle a student who is resistant to talking?"
    print(f"\n🔍 Query: '{query}'\n")
    
    results = kb.search(query, limit=1)
    
    if results:
        print("✅ RAG SUCCESS! Found match:")
        print(f"📄 Page: {results[0]['page']}")
        print(f"📝 Content Snippet: {results[0]['content'][:200]}...")
    else:
        print("❌ RAG FAILED: No results found.")

if __name__ == "__main__":
    asyncio.run(test_rag())
